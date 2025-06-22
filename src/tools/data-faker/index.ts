import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.data-faker.title'),
  path: '/data-faker',
  description: translate('tools.data-faker.description'),
  keywords: ['data', 'json', 'sample', 'faker'],
  component: () => import('./data-faker.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
