import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mongo-objectid-converter.title'),
  path: '/mongo-objectid-converter',
  description: translate('tools.mongo-objectid-converter.description'),
  keywords: ['mongo', 'objectid', 'converter', 'timestamp'],
  component: () => import('./mongo-objectid-converter.vue'),
  icon: Database,
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
