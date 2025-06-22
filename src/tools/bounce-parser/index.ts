import { Mailbox } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.bounce-parser.title'),
  path: '/bounce-parser',
  description: translate('tools.bounce-parser.description'),
  keywords: ['bounce', 'email', 'smtp', 'parser'],
  component: () => import('./bounce-parser.vue'),
  icon: Mailbox,
  createdAt: new Date('2024-08-15'),
  category: 'Forensic',
});
