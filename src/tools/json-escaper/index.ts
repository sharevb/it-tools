import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-escaper.title'),
  path: '/json-escaper',
  description: translate('tools.json-escaper.description'),
  keywords: ['json', 'string', 'escape', 'unescape'],
  component: () => import('./json-escaper.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-09'),
  category: 'JSON',
});
