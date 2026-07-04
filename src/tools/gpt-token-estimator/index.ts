import { CurrencyDollar } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.gpt-token-estimator.title'),
  path: '/gpt-token-estimator',
  description: t('tools.gpt-token-estimator.description'),
  keywords: ['gpt', 'llm', 'openai', 'token', 'estimator'],
  component: () => import('./gpt-token-estimator.vue'),
  icon: CurrencyDollar,
  createdAt: new Date('2024-08-15'),
  category: 'Text',
});
