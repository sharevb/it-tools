import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.css-js-prettify-minify.title'),
  path: '/css-js-prettify-minify',
  description: t('tools.css-js-prettify-minify.description'),
  keywords: ['css', 'javascript', 'js', 'prettify', 'minify', 'beautify', 'format', 'uglify', 'compress', 'formatter'],
  component: () => import('./css-js-prettify-minify.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Code')),
  createdAt: new Date('2026-07-11'),
  category: 'Development',
});
