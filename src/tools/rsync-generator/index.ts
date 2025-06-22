import { TransferIn } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.rsync-generator.title'),
  path: '/rsync-generator',
  description: translate('tools.rsync-generator.description'),
  keywords: ['rsync'],
  component: () => import('./rsync-generator.vue'),
  icon: TransferIn,
  createdAt: new Date('2024-04-20'),
  category: 'Network',
});
