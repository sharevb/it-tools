import { Rainbow } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.css-gradient-generator.title'),
  path: '/css-gradient-generator',
  description: t('tools.css-gradient-generator.description'),
  keywords: ['css', 'gradient', 'generator'],
  component: () => import('./css-gradient-generator.vue'),
  icon: Rainbow,
  createdAt: new Date('2025-11-29'),
  category: 'Web',
});
