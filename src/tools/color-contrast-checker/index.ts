import { ColorSwatch } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.color-contrast-checker.title'),
  path: '/color-contrast-checker',
  description: translate('tools.color-contrast-checker.description'),
  keywords: ['color', 'contrast', 'checker', 'wcag'],
  component: () => import('./color-contrast-checker.vue'),
  icon: ColorSwatch,
  createdAt: new Date('2025-03-09'),
  category: 'Web',
});
