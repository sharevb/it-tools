import { Books } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.isbn-validator-and-parser.title'),
  path: '/isbn-validator-and-parser',
  description: translate('tools.isbn-validator-and-parser.description'),
  keywords: ['isbn', 'validator', 'parser', 'formatter'],
  component: () => import('./isbn-validator-and-parser.vue'),
  icon: Books,
  createdAt: new Date('2024-01-10'),
  category: 'Data',
});
