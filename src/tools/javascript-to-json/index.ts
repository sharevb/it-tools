import { Braces } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.javascript-to-json.title'),
  path: '/javascript-to-json',
  description: t('tools.javascript-to-json.description'),
  keywords: ['javascript', 'json'],
  component: () => import('./javascript-to-json.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-29'),
  category: 'JSON',
});
