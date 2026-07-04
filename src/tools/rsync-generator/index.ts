import { TransferIn } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.rsync-generator.title'),
  path: '/rsync-generator',
  description: t('tools.rsync-generator.description'),
  keywords: ['rsync'],
  component: () => import('./rsync-generator.vue'),
  icon: TransferIn,
  createdAt: new Date('2024-04-20'),
  category: 'Network',
});
