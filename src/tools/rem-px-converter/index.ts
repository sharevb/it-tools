import { Dimensions } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.rem-px-converter.title'),
  path: '/rem-px-converter',
  description: translate('tools.rem-px-converter.description'),
  keywords: ['rem', 'px', 'converter'],
  component: () => import('./rem-px-converter.vue'),
  icon: Dimensions,
  createdAt: new Date('2025-03-09'),
  category: 'Web',
});
