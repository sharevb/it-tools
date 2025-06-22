import { ColorPicker } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.color-wheel.title'),
  path: '/color-wheel',
  description: translate('tools.color-wheel.description'),
  keywords: ['color', 'wheel', 'palette', 'theme'],
  component: () => import('./color-wheel.vue'),
  icon: ColorPicker,
  createdAt: new Date('2024-08-15'),
  category: 'Web',
});
