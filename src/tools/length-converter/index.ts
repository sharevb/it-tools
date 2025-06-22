import { SquareHalf } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.length-converter.title'),
  path: '/length-converter',
  description: translate('tools.length-converter.description'),
  keywords: ['length', 'converter'],
  component: () => import('./length-converter.vue'),
  icon: SquareHalf,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
