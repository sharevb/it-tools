import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.docker-compose-to-docker-run-converter.title'),
  path: '/docker-compose-to-docker-run-converter',
  description: translate('tools.docker-compose-to-docker-run-converter.description'),
  keywords: ['docker', 'run', 'compose', 'yaml', 'yml', 'convert', 'deamon'],
  component: () => import('./docker-compose-to-docker-run-converter.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-03'),
  category: 'Docker',
});
