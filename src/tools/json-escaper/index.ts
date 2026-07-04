import { Braces } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-escaper.title'),
  path: '/json-escaper',
  description: t('tools.json-escaper.description'),
  keywords: ['json', 'string', 'escape', 'unescape'],
  component: () => import('./json-escaper.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-09'),
  category: 'JSON',
});
