export { appBaseUrl, resolveAppBaseUrl };

/**
 * The path the app is served under, resolved at runtime instead of baked into the bundle.
 *
 * The build is path-agnostic: vite.config.ts uses a relative `base`, so hashed assets and
 * lazy chunks resolve against the URL of the chunk that imports them and `import.meta.env.BASE_URL` is a useless `./`.
 * The one thing that does know where the app lives is the `<base href>` element injected into index.html at build time --
 * the container rewrites it from the BASE_URL environment variable on the way out (see nginx.conf), which is what lets
 * a single image serve any subpath.
 *
 * Anything that builds a URL to a file shipped in `public/`, plus the router base, goes
 * through this. Deployments that serve the app from the domain root -- the default -- get
 * `/`, exactly as before.
 */
function resolveAppBaseUrl(href: string | null | undefined, documentUrl: string): string {
  if (!href) {
    // No <base>: a plain `vite dev` (the dev server always serves from the root, even
    // when the build base is relative) or a unit test rendering into a bare document.
    return '/';
  }

  try {
    // Resolved against the *page* URL, which is how the browser itself resolves a
    // relative `<base href>`. `document.baseURI` would already have the base applied.
    const { pathname } = new URL(href, documentUrl);

    return pathname.endsWith('/') ? pathname : `${pathname}/`;
  } catch (_) {
    return '/';
  }
}

const appBaseUrl =
  typeof document === 'undefined'
    ? '/'
    : resolveAppBaseUrl(document.querySelector('base')?.getAttribute('href'), document.URL);
