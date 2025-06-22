import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.docker-compose-converter.title'),
  path: '/docker-compose-converter',
  description: translate('tools.docker-compose-converter.description'),
  keywords: ['docker', 'compose', 'converter'],
  component: () => import('./docker-compose-converter.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-04'),
  category: 'Docker',
});
