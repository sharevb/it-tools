import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-javascript.title'),
  path: '/json-to-javascript',
  description: t('tools.json-to-javascript.description'),
  keywords: ['json', 'to', 'javascript'],
  component: () => import('./json-to-javascript.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-29'),
  category: 'JSON',
});
