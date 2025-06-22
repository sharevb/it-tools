import { Gauge } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.volume-converter.title'),
  path: '/volume-converter',
  description: translate('tools.volume-converter.description'),
  keywords: ['volume', 'converter'],
  component: () => import('./volume-converter.vue'),
  icon: Gauge,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
