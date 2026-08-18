import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';

// The app is built once, for no particular path, and told where it lives at request time.
// This exercises that: a server that mounts `dist` under a subfolder the way the container
// does -- rewrite the one `<base href>` in index.html, serve everything else from the same
// files -- and then checks the app actually works from there.
//
// See nginx.conf (the real thing), vite.config.ts (`base` and the baseHref plugin) and
// src/utils/base-url.ts (how the app reads it back).

const BASE_URL = '/it-tools/';
const DIST = resolve(fileURLToPath(new URL('.', import.meta.url)), '../dist');

const CONTENT_TYPES: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json',
};

function resolveInDist(pathname: string): string | undefined {
  const candidate = join(DIST, normalize(pathname));

  if (!candidate.startsWith(DIST) || !existsSync(candidate) || !statSync(candidate).isFile()) {
    return undefined;
  }

  return candidate;
}

function serveDistUnder(base: string): Promise<{ server: Server; origin: string }> {
  // What nginx.conf does with sub_filter, on every HTML response rather than only on the
  // SPA fallback: the service worker precaches index.html by fetching it, and it has to
  // get the same document a navigation would.
  const withBaseHref = (html: string) => html.replace('<base href="/">', `<base href="${base}">`);
  const indexHtml = withBaseHref(readFileSync(join(DIST, 'index.html'), 'utf-8'));

  const server = createServer((request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    // Everything below the mount point, with the prefix dropped -- the reverse proxy in
    // front of a container may or may not have stripped it already, so nginx.conf copes
    // with both and so does this.
    const path = decodeURIComponent(pathname.startsWith(base) ? pathname.slice(base.length - 1) : pathname);

    const asset = path.match(/^\/(?:.*\/)?assets\/(.+)$/);
    const file = asset ? resolveInDist(`/assets/${asset[1]}`) : resolveInDist(path);

    if (!file) {
      // A missing hashed chunk is a 404, not the SPA shell: serving index.html in its
      // place turns a plain 404 into an opaque MIME error in the browser.
      if (asset) {
        response.writeHead(404).end();
        return;
      }

      response.writeHead(200, { 'content-type': 'text/html' }).end(indexHtml);
      return;
    }

    response.writeHead(200, {
      'content-type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream',
      // Same headers the container sets; the WebAssembly-backed tools need them.
      'cross-origin-opener-policy': 'same-origin',
      'cross-origin-embedder-policy': 'require-corp',
    });

    if (extname(file) === '.html') {
      response.end(withBaseHref(readFileSync(file, 'utf-8')));
      return;
    }

    createReadStream(file).pipe(response);
  });

  return new Promise((done) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address !== null ? address.port : 0;

      done({ server, origin: `http://127.0.0.1:${port}` });
    });
  });
}

test.describe('Deployment under a subfolder', () => {
  let server: Server;
  let origin: string;

  test.beforeAll(async () => {
    ({ server, origin } = await serveDistUnder(BASE_URL));
  });

  test.afterAll(async () => {
    await new Promise((done) => server.close(done));
  });

  test('loads the app, and everything it asks for, from the subfolder', async ({ page }) => {
    const notFound: string[] = [];
    page.on('response', (response) => {
      if (response.status() === 404 && response.url().startsWith(origin)) {
        notFound.push(response.url());
      }
    });

    await page.goto(`${origin}${BASE_URL}`);

    await expect(page).toHaveTitle(/IT Tools/);
    // Router links carry the subfolder, so navigating inside the app stays inside it.
    await expect(page.locator(`a[href^="${BASE_URL}"]`).first()).toBeVisible();
    expect(notFound).toEqual([]);
  });

  test('serves a deep link, whose assets are one directory further down', async ({ page }) => {
    // The interesting case for a relative build: index.html is served for a path that is
    // not the app root, so `./assets/...` would resolve one level too deep without the
    // `<base href>` the server injected.
    await page.goto(`${origin}${BASE_URL}json-to-yaml-converter`);

    await expect(page).toHaveTitle('JSON to YAML converter - IT Tools');

    // Reaching the tool at all means its lazily imported chunk was resolved correctly.
    await page.getByTestId('input').fill('{"foo":"bar"}');
    expect((await page.getByTestId('area-content').innerText()).trim()).toEqual('foo: bar');
  });

  test('keeps the subfolder when navigating and reloading', async ({ page }) => {
    await page.goto(`${origin}${BASE_URL}`);

    const homeTitle = await page.title();
    await page.locator('a.it-tool-link').first().click();

    // The router was handed the runtime base, so an in-app navigation writes a URL that
    // still points inside the subfolder -- and reloading it lands back on the same tool
    // instead of on the app root or a 404.
    await expect(page).not.toHaveURL(`${origin}${BASE_URL}`);
    expect(page.url().startsWith(`${origin}${BASE_URL}`)).toBe(true);

    await expect(page).not.toHaveTitle(homeTitle);

    const url = page.url();
    const title = await page.title();

    // Then load that URL from scratch, the way someone pasting the link would: it has to
    // come back as the same tool rather than as the app root or a 404. In a second tab
    // rather than by reloading this one -- navigating a page that has just pulled in a
    // tool's chunks races with those requests, and the app answers an aborted chunk load
    // by reloading itself (the vite:preloadError handler in src/main.ts), which cancels
    // the navigation the test is waiting on.
    const fresh = await page.context().newPage();
    await fresh.goto(url);

    await expect(fresh).toHaveURL(url);
    await expect(fresh).toHaveTitle(title);
    await fresh.close();
  });
});
