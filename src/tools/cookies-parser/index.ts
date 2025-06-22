import { Cookie } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.cookies-parser.title'),
  path: '/cookies-parser',
  description: translate('tools.cookies-parser.description'),
  keywords: ['cookies', 'parser'],
  component: () => import('./cookies-parser.vue'),
  icon: Cookie,
  createdAt: new Date('2025-05-01'),
  category: 'Forensic',
});
