import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ufw-generator.title'),
  path: '/ufw-generator',
  description: t('tools.ufw-generator.description'),
  keywords: ['ufw', 'firewall', 'generator'],
  component: () => import('./ufw-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Firetruck')),
  createdAt: new Date('2026-03-07'),
  category: 'Network',
});
