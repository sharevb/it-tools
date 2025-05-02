import { AspectRatio } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.aspect-ratio-calculator.title'),
  path: '/aspect-ratio-calculator',
  description: translate('tools.aspect-ratio-calculator.description'),
  keywords: ['aspect', 'ratio', 'calculator'],
  component: () => import('./aspect-ratio-calculator.vue'),
  icon: AspectRatio,
  createdAt: new Date('2024-08-14'),
  category: 'Measurement',
});
