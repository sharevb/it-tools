import { Firetruck } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.firewalld-generator.title'),
  path: '/firewalld-generator',
  description: translate('tools.firewalld-generator.description'),
  keywords: ['firewalld', 'fw'],
  component: () => import('./firewalld-generator.vue'),
  icon: Firetruck,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
