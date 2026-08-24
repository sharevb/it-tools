import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.rmb-numbers.title'),
  path: '/rmb-numbers',
  description: t('tools.rmb-numbers.description'),
  keywords: ['rmb', 'renminbi', 'cny', 'number', 'uppercase', '人民币', '大写', '转换'],
  component: () => import('./rmb-numbers.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/CurrencyYen')),
  createdAt: new Date('2024-04-29'),
  category: 'Data',
});
