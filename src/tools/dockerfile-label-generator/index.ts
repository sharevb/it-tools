import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dockerfile-label-generator.title'),
  path: '/dockerfile-label-generator',
  description: t('tools.dockerfile-label-generator.description'),
  keywords: ['dockerfile', 'label', 'generator'],
  component: () => import('./dockerfile-label-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandDocker')),
  createdAt: new Date('2026-07-05'),
  category: 'Docker',
});
