import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-linter.title'),
  path: '/json-linter',
  description: translate('tools.json-linter.description'),
  keywords: ['json', 'linter', 'check'],
  component: () => import('./json-linter.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-20'),
  category: 'JSON',
});
