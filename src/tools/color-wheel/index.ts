import { ColorPicker } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.color-wheel.title'),
  path: '/color-wheel',
  description: t('tools.color-wheel.description'),
  keywords: ['color', 'wheel', 'palette', 'theme'],
  component: () => import('./color-wheel.vue'),
  icon: ColorPicker,
  createdAt: new Date('2024-08-15'),
  category: 'Web',
});
