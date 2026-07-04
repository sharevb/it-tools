import { TransferIn } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.data-transfer-rate-converter.title'),
  path: '/data-transfer-rate-converter',
  description: t('tools.data-transfer-rate-converter.description'),
  keywords: ['data', 'transfer', 'rate', 'convert', 'time', 'units'],
  component: () => import('./data-transfer-rate-converter.vue'),
  icon: TransferIn,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
