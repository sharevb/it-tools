import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dns-propagation-tester.title'),
  path: '/dns-propagation-tester',
  description: t('tools.dns-propagation-tester.description'),
  keywords: ['dns', 'propagation', 'tester'],
  component: () => import('./dns-propagation-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/World')),
  createdAt: new Date('2026-05-11'),
  category: 'Forensic',
  externAccessDescription: t('tools.dns-propagation-tester.externalAccess'),
});
