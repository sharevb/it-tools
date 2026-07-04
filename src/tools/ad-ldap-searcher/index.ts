import { Folder } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ad-ldap-searcher.title'),
  path: '/ad-ldap-searcher',
  description: t('tools.ad-ldap-searcher.description'),
  keywords: ['active', 'directory', 'ad', 'ldap', 'prop', 'searcher'],
  component: () => import('./ad-ldap-searcher.vue'),
  icon: Folder,
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
