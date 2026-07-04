import { Dimensions } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.css-units-converter.title'),
  path: '/css-units-converter',
  description: t('tools.css-units-converter.description'),
  keywords: ['css', 'units', 'converter'],
  component: () => import('./css-units-converter.vue'),
  icon: Dimensions,
  createdAt: new Date('2025-11-29'),
  category: 'Web',
});
