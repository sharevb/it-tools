import { ArrowsShuffle } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.csv-to-json.title'),
  path: '/csv-to-json',
  description: t('tools.csv-to-json.description'),
  keywords: ['csv', 'to', 'json', 'convert'],
  component: () => import('./csv-to-json.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-04-12'),
  category: 'JSON',
});
