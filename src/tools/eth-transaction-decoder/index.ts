import { ReportMoney } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.eth-transaction-decoder.title'),
  path: '/eth-transaction-decoder',
  description: t('tools.eth-transaction-decoder.description'),
  keywords: ['eth', 'ethereum', 'transaction', 'decoder'],
  component: () => import('./eth-transaction-decoder.vue'),
  icon: ReportMoney,
  createdAt: new Date('2025-11-01'),
  category: 'Forensic',
});
