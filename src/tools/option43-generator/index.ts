import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.option43-generator.title'),
  path: '/option43-generator',
  description: t('tools.option43-generator.description'),
  keywords: ['option43', 'wifi', 'dhcp', 'generator'],
  component: () => import('./option43-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/material/es/RouterOutlined')),
  createdAt: new Date('2024-03-09'),
  category: 'Network',
});
