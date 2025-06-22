import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.docker-compose-validator.title'),
  path: '/docker-compose-validator',
  description: translate('tools.docker-compose-validator.description'),
  keywords: ['docker', 'compose', 'validator', 'commonspec'],
  component: () => import('./docker-compose-validator.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-25'),
  category: 'Docker',
});
