import { TransferIn } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.data-transfer-rate-converter.title'),
  path: '/data-transfer-rate-converter',
  description: translate('tools.data-transfer-rate-converter.description'),
  keywords: ['data', 'transfer', 'rate', 'convert', 'time'],
  component: () => import('./data-transfer-rate-converter.vue'),
  icon: TransferIn,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
