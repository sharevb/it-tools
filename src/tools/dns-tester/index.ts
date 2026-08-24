import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dns-tester.title'),
  path: '/dns-tester',
  description: t('tools.dns-tester.description'),
  keywords: ['dns', 'tester', 'resolution', 'whois', 'lookup', 'query', 'axfr', 'zone', 'dnssec'],
  component: () => import('./dns-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/World')),
  createdAt: new Date('2026-05-11'),
  category: 'Forensic',
  externAccessDescription: t('tools.dns-tester.externalAccess'),
});
