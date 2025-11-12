import { ReportMoney } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ETH Transaction Decoder',
  path: '/eth-transaction-decoder',
  description: 'Ethereum transaction decoder with Smart Contract ABI',
  keywords: ['eth', 'ethereum', 'transaction', 'decoder'],
  component: () => import('./eth-transaction-decoder.vue'),
  icon: ReportMoney,
  createdAt: new Date('2025-11-01'),
  category: 'Forensic',
});
