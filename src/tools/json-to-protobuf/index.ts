import { DatabaseExport } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-protobuf.title'),
  path: '/json-to-protobuf',
  description: translate('tools.json-to-protobuf.description'),
  keywords: ['json', 'protobuf'],
  component: () => import('./json-to-protobuf.vue'),
  icon: DatabaseExport,
  createdAt: new Date('2025-01-01'),
  category: 'Development',
});
