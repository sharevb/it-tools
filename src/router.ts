import { createRouter, createWebHistory } from 'vue-router';
import { type ActiveLoader, useLoading } from 'vue-loading-overlay';
import { layouts } from './layouts/index';
import HomePage from './pages/Home.page.vue';
import NotFound from './pages/404.page.vue';
import { tools } from './tools';
import { config } from './config';
import { useAppTheme } from './ui/theme/themes';

// Conditional dynamic import: import.meta.env.DEV is statically false in production
// builds, so the demo gallery (and everything it imports: c-markdown, markdown-it, …)
// is dead-code-eliminated from the bundle instead of shipping in the entry graph.
const demoRoutes = import.meta.env.DEV && config.app.env === 'development'
  ? (await import('./ui/demo/demo.routes')).routes
  : [];

const $loading = useLoading();
const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.toolLayout, name, ...config },
}));
const toolsRedirectRoutes = tools
  .filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0)
  .flatMap(
    ({ path, redirectFrom }) => redirectFrom?.map(redirectSource => ({ path: redirectSource, redirect: path })) ?? [],
  );

const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  // The document is the app's scroller (see MenuLayout.vue)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.path !== from.path) {
      return { top: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/About.vue'),
    },
    ...toolsRoutes,
    ...toolsRedirectRoutes,
    ...demoRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ],
});

let loader: ActiveLoader | null = null;
let loaderTimeoutId: NodeJS.Timeout | null = null;

router.beforeEach((to, from) => {
  // Only show loading for actual route changes, not just query param changes
  if (to.path !== from.path) {
    const theme = useAppTheme();
    loaderTimeoutId = setTimeout(() => {
      // Scope the overlay to the routed page so the nav bar and menu stay
      // visible; on the very first navigation the layout isn't mounted yet
      // and the overlay falls back to fullscreen.
      const pageContainer = document.querySelector<HTMLElement>('.page-content');
      loader = $loading?.show({
        color: theme.value.primary.color,
        ...(pageContainer ? { container: pageContainer } : {}),
      });
    }, 350);
  }
});

router.afterEach(() => {
  if (loaderTimeoutId) {
    clearTimeout(loaderTimeoutId);
    loaderTimeoutId = null;
  }
  if (loader) {
    loader.hide();
    loader = null;
  }
});

export default router;
