import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.voltage-0-10v-converter.title'),
  path: '/voltage-0-10v-converter',
  description: t('tools.voltage-0-10v-converter.description'),
  keywords: ['0-10', 'volt', 'voltage', 'analog', 'sensor', '1-5', '2-10', 'plc', 'scaling'],
  component: () => import('./voltage-0-10v-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Bolt')),
  createdAt: new Date('2026-11-03'),
  category: 'Automation',
});
