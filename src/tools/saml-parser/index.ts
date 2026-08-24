import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.saml-parser.title'),
  path: '/saml-parser',
  description: t('tools.saml-parser.description'),
  keywords: ['saml', 'assertion', 'decoder', 'parser'],
  component: () => import('./saml-parser.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Key')),
  createdAt: new Date('2026-07-04'),
  category: 'Crypto',
});
