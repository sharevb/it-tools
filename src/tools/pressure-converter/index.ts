import { Atom } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pressure-converter.title'),
  path: '/pressure-converter',
  description: translate('tools.pressure-converter.description'),
  keywords: ['pressure', 'converter'],
  component: () => import('./pressure-converter.vue'),
  icon: Atom,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
