import { MailForward } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dnsbl-checker.title'),
  path: '/dnsbl-checker',
  description: t('tools.dnsbl-checker.description'),
  keywords: ['dnsbl', 'block', 'dns', 'checker'],
  component: () => import('./dnsbl-checker.vue'),
  icon: MailForward,
  createdAt: new Date('2025-08-15'),
  category: 'Network',
  externAccessDescription: t('tools.dnsbl-checker.externalAccess'),
});
