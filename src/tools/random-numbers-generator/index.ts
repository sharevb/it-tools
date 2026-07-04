import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.random-numbers-generator.title'),
  path: '/random-numbers-generator',
  description: t('tools.random-numbers-generator.description'),
  keywords: ['random', 'numbers', 'decimal', 'hexadecimal', 'generator'],
  component: () => import('./random-numbers-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-08-23'),
  category: 'Generators',
});
