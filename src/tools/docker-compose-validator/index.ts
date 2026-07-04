import { BrandDocker } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.docker-compose-validator.title'),
  path: '/docker-compose-validator',
  description: t('tools.docker-compose-validator.description'),
  keywords: ['docker', 'compose', 'validator', 'commonspec'],
  component: () => import('./docker-compose-validator.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-25'),
  category: 'Docker',
});
