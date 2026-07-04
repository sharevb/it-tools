import { Parking } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.parquets-reader.title'),
  path: '/parquets-reader',
  description: t('tools.parquets-reader.description'),
  keywords: ['parquet', 'reader'],
  component: () => import('./parquets-reader.vue'),
  icon: Parking,
  createdAt: new Date('2025-02-09'),
  category: 'Forensic',
});
