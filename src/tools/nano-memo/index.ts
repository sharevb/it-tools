import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.nano-memo.title'),
  path: '/nano-memo',
  description: translate('tools.nano-memo.description'),
  keywords: ['nano', 'memo', 'cheatsheet', 'sheet'],
  component: () => import('./nano-memo.vue'),
  icon: FileText,
  createdAt: new Date('2024-04-20'),
  category: 'Cheatsheets',
});
