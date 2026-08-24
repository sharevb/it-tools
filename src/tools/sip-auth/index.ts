import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.sip-auth.title'),
  path: '/sip-auth',
  description: t('tools.sip-auth.description'),
  keywords: ['sip', 'authorization'],
  component: () => import('./sip-auth.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ShieldCheck')),
  createdAt: new Date('2024-04-11'),
  category: 'Network',
});
