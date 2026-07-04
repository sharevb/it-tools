import { BrandDocker } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dockerfile-memo.title'),
  path: '/dockerfile-memo',
  description: t('tools.dockerfile-memo.description'),
  keywords: ['dockerfile', 'memo', 'cheatsheet'],
  component: () => import('./dockerfile-memo.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-08-17'),
  category: 'Cheatsheets',
});
