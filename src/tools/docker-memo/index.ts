import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.docker-memo.title'),
  path: '/docker-memo',
  description: t('tools.docker-memo.description'),
  keywords: ['docker', 'memo'],
  component: () => import('./docker-memo.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-03-09'),
  category: 'Cheatsheets',
});
