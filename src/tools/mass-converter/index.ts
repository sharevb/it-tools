import { Atom } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mass-converter.title'),
  path: '/mass-converter',
  description: translate('tools.mass-converter.description'),
  keywords: ['mass', 'converter'],
  component: () => import('./mass-converter.vue'),
  icon: Atom,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
