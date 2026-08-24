import { URL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import wasm from 'vite-plugin-wasm';

import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import markdown from 'unplugin-vue-markdown/vite';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Unocss from 'unocss/vite';
import { configDefaults } from 'vitest/config';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import VueI18n from '@intlify/unplugin-vue-i18n/vite';

import fs from 'node:fs';
import fg from 'fast-glob';
import Sitemap from 'vite-plugin-sitemap';

import { visualizer } from 'rollup-plugin-visualizer';

// Where the app will be served from. The build itself is path-agnostic -- `base` below is
// relative, so every asset URL is resolved against the file that references it -- and this
// only seeds the `<base href>` in index.html, which is what the app and the browser read
// the deployment path from at runtime (see src/utils/base-url.ts).
//
// Setting it is only needed for a plain static deployment into a subfolder (GitHub Pages,
// `dist` dropped into a directory), because there is no server to fill it in. The Docker
// image leaves it at `/` and rewrites the tag per request from the BASE_URL environment
// variable instead (see nginx.conf), which is why one image can serve any subpath.
const baseUrl = normalizeBaseUrl(process.env.BASE_URL);
const hostname = process.env.HOSTNAME;

function normalizeBaseUrl(value: string | undefined): string {
  const trimmed = (value ?? '').replace(/^\/+|\/+$/g, '');

  if (trimmed === '') {
    return '/';
  }

  // The same rule the container applies to the runtime value
  // (docker-entrypoint.d/18-resolve-base-url.envsh): a plain path built from unreserved
  // characters. This one ends up spliced into an HTML attribute below, so a value carrying
  // a quote would rewrite the tag around it, and one carrying a space or `..` would just
  // quietly produce a page that loads from the wrong place. Fail the build instead.
  const segments = trimmed.split('/');

  if (segments.some(segment => segment === '..' || !/^[\w.~-]+$/.test(segment))) {
    throw new Error(`BASE_URL must be a plain path such as "/it-tools/", got ${JSON.stringify(value)}`);
  }

  return `/${segments.join('/')}/`;
}

// index.html gets exactly one `<base href>`, and it has to come before the first relative
// URL in <head> -- Vite injects the entry script and the stylesheet links there, so this
// splices it in right after the opening tag rather than relying on tag-injection order.
// The emitted string is kept byte-stable on purpose: nginx.conf matches it literally to
// swap in the runtime BASE_URL.
function baseHref(base: string): Plugin {
  return {
    name: 'it-tools:base-href',
    // Build only: the dev server always serves from the root (Vite normalizes a relative
    // base to `/` for `serve`), and with no `<base>` the app falls back to `/` as well.
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const withBase = html.replace(/<head(\s[^>]*)?>/i, match => `${match}\n    <base href="${base}">`);

        if (withBase === html) {
          throw new Error('it-tools:base-href: no <head> to inject the <base href> into');
        }

        return withBase;
      },
    },
  };
}

// Locales are code-split: only en is bundled eagerly, the rest become lazy chunks fetched on
// first use (see src/plugins/i18n.plugin.ts). VITE_AVAILABLE_LOCALES filters the locales
// offered at runtime instead of trimming the build.
const includeLocales = [resolve(__dirname, 'src/tools/*/locales/**'), resolve(__dirname, 'locales/**')];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    baseHref(baseUrl),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: includeLocales,
      strictMessage: false,
      escapeHtml: true,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      vueTemplate: true,
    }),
    Icons({ compiler: 'vue3' }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    markdown(),
    svgLoader(),
    VitePWA({
      registerType: 'autoUpdate',
      // src/main.ts registers the worker itself, against the base the app resolved at
      // runtime. Turning the injection off means the plugin no longer infers the
      // `autoUpdate` workbox flags either, hence skipWaiting/clientsClaim below.
      injectRegister: false,
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Precache only the app shell so the service worker doesn't download every
        // tool chunk and WASM binary (~160 MB) on first visit; hashed assets are
        // cached on demand as tools are opened. Set VITE_PWA_FULL_PRECACHE=true to
        // restore full offline precaching of everything.
        globPatterns:
          process.env.VITE_PWA_FULL_PRECACHE === 'true' && !process.env.VITE_VERCEL_DEPLOY
            ? ['**\/*.{js,wasm,css,html}']
            : ['**\/*.{css,html}'],
        maximumFileSizeToCacheInBytes: 25 * 1024 ** 2,
        // Relative, like every other precache entry: workbox resolves them against the
        // service worker's own URL, so the same sw.js works under any deployment path.
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin, request }) =>
              sameOrigin && (request.destination === 'script' || request.destination === 'worker'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-chunks',
              expiration: { maxEntries: 2000, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ sameOrigin, url }) => sameOrigin && url.pathname.endsWith('.wasm'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-wasm',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      strategies: 'generateSW',
      // Every URL in here is relative to the manifest itself, which the browser fetches
      // from the app root -- so the manifest, like the rest of the build, does not need to
      // know where that root is.
      manifest: {
        name: 'IT Tools',
        description: 'Aggregated set of useful tools for developers.',
        display: 'standalone',
        start_url: './?utm_source=pwa&utm_medium=pwa',
        scope: './',
        orientation: 'any',
        theme_color: '#18a058',
        background_color: '#f1f5f9',
        icons: [
          {
            src: './favicon-16x16.png',
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: './favicon-32x32.png',
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: './android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
    Components({
      dirs: ['src/'],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: 'icon' })],
      // dtsTsx generates invalid `const 'Name.demo':` declarations for
      // components whose file names contain dots
      dtsTsx: false,
    }),
    Unocss(),
    nodePolyfills(),
    wasm(),
    visualizer(),
    hostname
      ? Sitemap({
          hostname,
          generateRobotsTxt: true,
          robots: [{ userAgent: '*', allow: '/' }],
          dynamicRoutes: (() => {
            const paths = ['/', '/about'];
            fg.sync('src/tools/*/index.ts').forEach((file) => {
              const content = fs.readFileSync(file, 'utf-8');
              const pathMatch = content.match(/path:\s*['"`]([^'"`]+)['"`]/);
              if (pathMatch) {
                paths.push(pathMatch[1]);
              }
              const redirectMatch = content.match(/redirectFrom:\s*\[([^\]]+)\]/);
              if (redirectMatch?.[1]) {
                const redirectPaths = redirectMatch[1].match(/['"`]([^'"`]+)['"`]/g);
                redirectPaths?.forEach((p) => paths.push(p.replace(/['"`]/g, '')));
              }
            });
            return paths;
          })(),
        })
      : undefined,
  ],
  // Relative, so a built asset is addressed from the chunk that imports it rather than
  // from a path fixed at build time. This is what makes the output portable across
  // deployment paths; `<base href>` (see baseHref above) covers the entry points in
  // index.html, which the browser resolves against the document instead.
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'node:fs/promises': fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      'node:fs': fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      // Must come before the bare `fs` entry: aliases match by prefix, so `fs` alone would rewrite
      // `fs/promises` to `_empty.ts/promises`. cron-parser's CronFileParser reaches for it.
      'fs/promises': fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      fs: fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      '@babel/core': fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      'isolated-vm': fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      'onnxruntime-node': fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      'unpdf/pdfjs': fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
      'webcrypto-liner-shim': !process.env.VERCEL
        ? 'webcrypto-liner-shim'
        : fileURLToPath(new URL('./src/_empty.ts', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  },
  test: {
    exclude: [...configDefaults.exclude, '**/*.e2e.spec.ts'],
    // Several suites assert on formatted dates and offsets (date-time-converter,
    // days-calculator, crontab-generator). Without a fixed zone they fail on any
    // machine that is not on UTC.
    env: { TZ: 'UTC' },
    // Only a handful of suites touch the DOM; they opt in with a
    // `// @vitest-environment jsdom` docblock. Building a jsdom for all 128
    // files cost ~2 minutes of environment setup for the 7 that need it.
    environment: 'node',
    server: {
      deps: {
        inline: ['otpauth-migration', 'proto'],
      },
    },
  },
  build: {
    target: 'esnext',
    // sourcemap: !process.env.VERCEL,
    // minify: !process.env.VERCEL,
    reportCompressedSize: !process.env.VERCEL,
    // cssMinify: false,
    // modulePreload: false,
    rolldownOptions: {
      external: ['regex', './out/isolated_vm', 'isolated-vm', 'onnxruntime-node', 'unpdf/pdfjs'],
      output: {
        format: 'es',
        codeSplitting: {
          // Tool icons are loaded through per-icon dynamic imports (see src/tools/*/index.ts);
          // merge them into a single lazy chunk instead of ~450 tiny ones.
          // includeDependenciesRecursively must stay off: with it, shared helper modules
          // get captured into this chunk and entry chunks end up statically importing it,
          // which drags the whole icon set back into the startup payload.
          groups: [
            {
              name: 'tool-icons',
              test: /node_modules[\\/](?:@vicons[\\/]|@tabler[\\/]icons-vue[\\/]dist[\\/]esm[\\/]icons[\\/])/,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'isolated-vm',
      '@lezer/highlight',
      'pdfjs-dist',
      'onnxruntime-node',
      'onnxruntime-web',
      'unpdf',
      'unpdf/pdfjs',
      ...(process.env.VERCEL ? ['webcrypto-liner-shim'] : []),
    ], // optionally specify dependency name
  },
  server: {
    watch: {
      ignored: ['**/.pnpm-store/**'],
    },
    headers: {
      //   'Cross-Origin-Resource-Policy': 'same-site',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});
