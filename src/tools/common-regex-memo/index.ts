import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.common-regex-memo.title'),
  path: '/common-regex-memo',
  description: translate('tools.common-regex-memo.description'),
  keywords: ['common', 'regex', 'memo', 'cheatsheet'],
  component: () => import('./common-regex-memo.vue'),
  icon: FileText,
  createdAt: new Date('2024-05-11'),
  category: 'Cheatsheets',
});
