import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-php.title'),
  path: '/json-to-php',
  description: translate('tools.json-to-php.description'),
  keywords: ['json', 'php'],
  component: () => import('./json-to-php.vue'),
  icon: Braces,
  createdAt: new Date('2025-04-21'),
  category: 'JSON',
});
