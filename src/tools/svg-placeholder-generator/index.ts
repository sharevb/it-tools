import { translate as t } from '@/plugins/i18n.plugin';
import { IconFileTypeSvg } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.svg-placeholder-generator.title'),
  path: '/svg-placeholder-generator',
  description: t('tools.svg-placeholder-generator.description'),
  keywords: ['svg', 'placeholder', 'generator', 'image', 'size', 'mockup'],
  component: () => import('./svg-placeholder-generator.vue'),
  icon: IconFileTypeSvg,
  category: 'Web',
});
