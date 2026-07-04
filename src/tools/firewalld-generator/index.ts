import { Firetruck } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.firewalld-generator.title'),
  path: '/firewalld-generator',
  description: t('tools.firewalld-generator.description'),
  keywords: ['firewalld', 'firewall-cmd'],
  component: () => import('./firewalld-generator.vue'),
  icon: Firetruck,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
