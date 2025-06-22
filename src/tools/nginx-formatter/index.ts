import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.nginx-formatter.title'),
  path: '/nginx-formatter',
  description: translate('tools.nginx-formatter.description'),
  keywords: ['nginx', 'formatter', 'prettier'],
  component: () => import('./nginx-formatter.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-30'),
  category: 'Network',
});
