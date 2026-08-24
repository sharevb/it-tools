import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.firewalld-generator.title'),
  path: '/firewalld-generator',
  description: t('tools.firewalld-generator.description'),
  keywords: ['firewalld', 'firewall-cmd'],
  component: () => import('./firewalld-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Firetruck')),
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
