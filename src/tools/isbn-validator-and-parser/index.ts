import { Books } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.isbn-validator-and-parser.title'),
  path: '/isbn-validator-and-parser',
  description: t('tools.isbn-validator-and-parser.description'),
  keywords: ['isbn', 'validator', 'parser', 'formatter'],
  component: () => import('./isbn-validator-and-parser.vue'),
  icon: Books,
  createdAt: new Date('2024-01-10'),
  category: 'Data',
});
