import { CurrencyYen } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rmb-numbers.title'),
  path: '/rmb-numbers',
  description: t('tools.rmb-numbers.description'),
  keywords: ['rmb', 'renminbi', 'cny', 'number', 'uppercase', '人民币', '大写', '转换'],
  component: () => import('./rmb-numbers.vue'),
  icon: CurrencyYen,
  createdAt: new Date('2024-04-29'),
  category: 'Data',
});
