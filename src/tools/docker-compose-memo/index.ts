import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.docker-compose-memo.title'),
  path: '/docker-compose-memo',
  description: t('tools.docker-compose-memo.description'),
  keywords: ['docker', 'compose', 'memo', 'cheatsheet'],
  component: () => import('./docker-compose-memo.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-08-17'),
  category: 'Cheatsheets',
});
