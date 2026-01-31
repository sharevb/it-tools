import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.iana-whois-checker.title'),
  path: '/iana-whois-checker',
  description: t('tools.iana-whois-checker.description'),
  keywords: ['iana', 'whois', 'checker'],
  component: () => import('./iana-whois-checker.vue'),
  icon: World,
  createdAt: new Date('2025-10-03'),
  category: 'Network',
  externAccessDescription: 'This tool launch a new tab with domain to check at https://www.iana.org/whois',
});
