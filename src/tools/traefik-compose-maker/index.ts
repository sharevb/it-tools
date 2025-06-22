import { NetworkCheckSharp } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.traefik-compose-maker.title'),
  path: '/traefik-compose-maker',
  description: translate('tools.traefik-compose-maker.description'),
  keywords: ['traefik', 'docker', 'compose'],
  component: () => import('./traefik-compose-maker.vue'),
  icon: NetworkCheckSharp,
  createdAt: new Date('2024-03-30'),
  category: 'Docker',
});
