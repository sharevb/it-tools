import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-go.title'),
  path: '/json-to-go',
  description: t('tools.json-to-go.description'),
  keywords: ['json', 'parse', 'go', 'convert', 'transform'],
  component: () => import('./json-to-go.vue'),
  icon: Braces,
  createdAt: new Date('2024-04-02'),
  category: 'JSON',
});
