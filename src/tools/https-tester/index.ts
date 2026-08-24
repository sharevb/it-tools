import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.https-tester.title'),
  path: '/https-tester',
  description: t('tools.https-tester.description'),
  keywords: ['https', 'hsts', 'redirection', 'certificate', 'tester'],
  component: () => import('./https-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ShieldCheck')),
  createdAt: new Date('2026-05-11'),
  category: 'Forensic',
  externAccessDescription: t('tools.https-tester.externalAccess'),
});
