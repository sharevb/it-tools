import { DatabaseExport } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-to-protobuf.title'),
  path: '/json-to-protobuf',
  description: t('tools.json-to-protobuf.description'),
  keywords: ['json', 'protobuf'],
  component: () => import('./json-to-protobuf.vue'),
  icon: DatabaseExport,
  createdAt: new Date('2025-01-01'),
  category: 'Development',
});
