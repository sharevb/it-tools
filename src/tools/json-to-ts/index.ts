import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-ts.title'),
  path: '/json-to-ts',
  description: t('tools.json-to-ts.description'),
  keywords: ['json', 'parse', 'typescript', 'convert', 'transform'],
  component: () => import('./json-to-ts.vue'),
  icon: Braces,
  createdAt: new Date('2024-04-25'),
  category: 'JSON',
});
