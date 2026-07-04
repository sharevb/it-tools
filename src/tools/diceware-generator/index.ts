import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.diceware-generator.title'),
  path: '/diceware-generator',
  description: t('tools.diceware-generator.description'),
  keywords: ['diceware', 'generator'],
  component: () => import('./diceware-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-10-04'),
  category: 'Generators',
});
