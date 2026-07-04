import { Braces } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-to-object.title'),
  path: '/json-to-object',
  description: t('tools.json-to-object.description'),
  keywords: ['json', 'parse', 'object', 'convert', 'transform'],
  component: () => import('./json-to-object.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-16'),
  category: 'JSON',
});
