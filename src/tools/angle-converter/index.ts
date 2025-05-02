import { Angle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.angle-converter.title'),
  path: '/angle-converter',
  description: translate('tools.angle-converter.description'),
  keywords: ['angle', 'converter'],
  component: () => import('./angle-converter.vue'),
  icon: Angle,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
