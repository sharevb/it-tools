import { translate as t } from '@/plugins/i18n.plugin';
import { NetworkCheckSharp } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.docker-pangolin-labels.title'),
  path: '/docker-pangolin-labels',
  description: t('tools.docker-pangolin-labels.description'),
  keywords: ['docker', 'compose', 'pangolin', 'blueprint', 'labels'],
  component: () => import('./docker-pangolin-labels.vue'),
  icon: NetworkCheckSharp,
  createdAt: new Date('2026-02-08'),
  category: 'Docker',
});
