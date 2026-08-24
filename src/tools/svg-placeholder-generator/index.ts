import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.svg-placeholder-generator.title'),
  path: '/svg-placeholder-generator',
  description: t('tools.svg-placeholder-generator.description'),
  keywords: ['svg', 'placeholder', 'generator', 'image', 'size', 'mockup'],
  component: () => import('./svg-placeholder-generator.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconFileTypeSvg.mjs')),
  category: 'Web',
});
