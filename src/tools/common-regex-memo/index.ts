import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.common-regex-memo.title'),
  path: '/common-regex-memo',
  description: t('tools.common-regex-memo.description'),
  keywords: ['common', 'regex', 'memo', 'cheatsheet'],
  component: () => import('./common-regex-memo.vue'),
  icon: FileText,
  createdAt: new Date('2024-05-11'),
  category: 'Cheatsheets',
});
