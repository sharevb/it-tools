import { Disc } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.smart-raw-converter.title'),
  path: '/smart-raw-converter',
  description: translate('tools.smart-raw-converter.description'),
  keywords: ['smart', 'raw', 'converter'],
  component: () => import('./smart-raw-converter.vue'),
  icon: Disc,
  createdAt: new Date('2024-07-14'),
  category: 'Forensic',
});
