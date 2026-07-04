import { FileAnalytics } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-size-analyzer.title'),
  path: '/json-size-analyzer',
  description: t('tools.json-size-analyzer.description'),
  keywords: ['json', 'size', 'analyzer'],
  component: () => import('./json-size-analyzer.vue'),
  icon: FileAnalytics,
  createdAt: new Date('2024-07-14'),
  category: 'JSON',
});
