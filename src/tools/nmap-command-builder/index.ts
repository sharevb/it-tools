import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.nmap-command-builder.title'),
  path: '/nmap-command-builder',
  description: t('tools.nmap-command-builder.description'),
  keywords: ['nmap', 'command', 'builder', 'scan', 'generator'],
  component: () => import('./nmap-command-builder.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ShieldCheck')),
  createdAt: new Date('2026-05-11'),
  category: 'Forensic',
});
