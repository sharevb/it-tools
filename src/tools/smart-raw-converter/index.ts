import { Disc } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.smart-raw-converter.title'),
  path: '/smart-raw-converter',
  description: t('tools.smart-raw-converter.description'),
  keywords: ['smart', 'raw', 'converter'],
  component: () => import('./smart-raw-converter.vue'),
  icon: Disc,
  createdAt: new Date('2024-07-14'),
  category: 'Forensic',
});
