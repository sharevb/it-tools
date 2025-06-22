import { Mailbox } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.sharepoint-decoder.title'),
  path: '/sharepoint-decoder',
  description: translate('tools.sharepoint-decoder.description'),
  keywords: ['sharepoint', 'url', 'decoder'],
  component: () => import('./sharepoint-decoder.vue'),
  icon: Mailbox,
  createdAt: new Date('2025-02-09'),
  category: 'Forensic',
});
