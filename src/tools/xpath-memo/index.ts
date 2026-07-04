import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.xpath-memo.title'),
  path: '/xpath-memo',
  description: t('tools.xpath-memo.description'),
  keywords: ['xpath', 'memo', 'cheatsheet'],
  component: () => import('./xpath-memo.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
  category: 'Cheatsheets',
});
