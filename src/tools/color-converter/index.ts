import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.color-converter.title'),
  path: '/color-converter',
  description: t('tools.color-converter.description'),
  keywords: ['color', 'converter'],
  component: () => import('./color-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Palette')),
  redirectFrom: ['/color-picker-converter'],
  npmPackages: ['colord'],
  category: 'Web',
});
