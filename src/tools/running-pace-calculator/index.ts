import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.running-pace-calculator.title'),
  path: '/running-pace-calculator',
  description: t('tools.running-pace-calculator.description'),
  keywords: ['running', 'pace', 'calculator'],
  component: () => import('./running-pace-calculator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Run')),
  createdAt: new Date('2026-06-21'),
  category: 'Data',
});
