import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.bounce-parser.title'),
  path: '/bounce-parser',
  description: t('tools.bounce-parser.description'),
  keywords: ['bounce', 'email', 'smtp', 'parser'],
  component: () => import('./bounce-parser.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Mailbox')),
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
