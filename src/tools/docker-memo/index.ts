import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.docker-memo.title'),
  path: '/docker-memo',
  description: translate('tools.docker-memo.description'),
  keywords: ['docker', 'memo'],
  component: () => import('./docker-memo.vue'),
  icon: BrandDocker,
  createdAt: new Date('2025-03-09'),
  category: 'Cheatsheets',
});
