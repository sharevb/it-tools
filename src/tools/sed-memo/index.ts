import { FileText } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.sed-memo.title'),
  path: '/sed-memo',
  description: t('tools.sed-memo.description'),
  keywords: ['sed', 'memo', 'cheatsheet'],
  component: () => import('./sed-memo.vue'),
  icon: FileText,
  createdAt: new Date('2025-08-17'),
  category: 'Cheatsheets',
});
