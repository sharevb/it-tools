import { SquaresDiagonal } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.area-converter.title'),
  path: '/area-converter',
  description: translate('tools.area-converter.description'),
  keywords: ['area', 'converter'],
  component: () => import('./area-converter.vue'),
  icon: SquaresDiagonal,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
