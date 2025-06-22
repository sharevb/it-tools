import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.option43-generator.title'),
  path: '/option43-generator',
  description: translate('tools.option43-generator.description'),
  keywords: ['option43', 'wifi', 'dhcp', 'generator'],
  component: () => import('./option43-generator.vue'),
  icon: RouterOutlined,
  createdAt: new Date('2024-03-09'),
  category: 'Network',
});
