import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.data-faker.title'),
  path: '/data-faker',
  description: t('tools.data-faker.description'),
  keywords: ['data', 'json', 'sample', 'faker'],
  component: () => import('./data-faker.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ArrowsShuffle')),
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
