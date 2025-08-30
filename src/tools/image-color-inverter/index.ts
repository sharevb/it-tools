import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.image-color-inverter.title'),
  path: '/image-color-inverter',
  description: t('tools.image-color-inverter.description'),
  keywords: ['image', 'color', 'invert', 'negative', 'photo', 'filter', 'effect', 'png', 'jpg', 'jpeg'],
  component: () => import('./image-color-inverter.vue'),
  icon: Palette,
  createdAt: new Date('2025-08-25'),
  category: 'Images',
});
