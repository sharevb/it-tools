import { BrandDocker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.docker-compose-converter.title'),
  path: '/docker-compose-converter',
  description: t('tools.docker-compose-converter.description'),
  keywords: ['docker', 'compose', 'converter'],
  component: () => import('./docker-compose-converter.vue'),
  icon: BrandDocker,
  createdAt: new Date('2024-01-04'),
  category: 'Docker',
});
