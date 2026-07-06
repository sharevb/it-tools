import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.keyboard-layout-converter.title'),
  path: '/keyboard-layout-converter',
  description: t('tools.keyboard-layout-converter.description'),
  keywords: ['keyboard', 'layout', 'converter'],
  component: () => import('./keyboard-layout-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Keyboard')),
  createdAt: new Date('2025-10-03'),
  category: 'Text',
});
