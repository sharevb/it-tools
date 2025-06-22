import { FileAnalytics } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-size-analyzer.title'),
  path: '/json-size-analyzer',
  description: translate('tools.json-size-analyzer.description'),
  keywords: ['json', 'size', 'analyzer'],
  component: () => import('./json-size-analyzer.vue'),
  icon: FileAnalytics,
  createdAt: new Date('2024-07-14'),
  category: 'JSON',
});
