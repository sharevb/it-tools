import { AspectRatio } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.aspect-ratio-calculator.title'),
  path: '/aspect-ratio-calculator',
  description: t('tools.aspect-ratio-calculator.description'),
  keywords: ['aspect', 'ratio', 'calculator'],
  component: () => import('./aspect-ratio-calculator.vue'),
  icon: AspectRatio,
  createdAt: new Date('2024-08-14'),
  category: 'Measurement',
});
