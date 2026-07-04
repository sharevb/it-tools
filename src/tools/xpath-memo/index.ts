import { Brackets } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

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
