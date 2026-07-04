import { CreditCard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.credit-card-checker.title'),
  path: '/credit-card-checker',
  description: t('tools.credit-card-checker.description'),
  keywords: ['credit', 'card', 'checker'],
  component: () => import('./credit-card-checker.vue'),
  icon: CreditCard,
  createdAt: new Date('2025-10-03'),
  category: 'Data',
});
