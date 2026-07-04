import { NetworkCheckSharp } from '@vicons/material';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.traefik-compose-maker.title'),
  path: '/traefik-compose-maker',
  description: t('tools.traefik-compose-maker.description'),
  keywords: ['traefik', 'docker', 'compose'],
  component: () => import('./traefik-compose-maker.vue'),
  icon: NetworkCheckSharp,
  createdAt: new Date('2024-03-30'),
  category: 'Docker',
});
