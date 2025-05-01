import { Folder } from '@vicons/tabler';
import { defineTool } from '../tool';

import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ad-ldap-searcher.title'),
  path: '/ad-ldap-searcher',
  description: translate('tools.ad-ldap-searcher.description'),
  keywords: ['active', 'directory', 'ad', 'ldap', 'prop', 'searcher'],
  component: () => import('./ad-ldap-searcher.vue'),
  icon: Folder,
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
