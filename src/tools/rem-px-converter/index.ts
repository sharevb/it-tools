import { Dimensions } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rem-px-converter.title'),
  path: '/rem-px-converter',
  description: t('tools.rem-px-converter.description'),
  keywords: ['rem', 'px', 'converter'],
  component: () => import('./rem-px-converter.vue'),
  icon: Dimensions,
  createdAt: new Date('2025-03-09'),
  category: 'Web',
});
