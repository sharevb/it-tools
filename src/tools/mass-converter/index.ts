import { Atom } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.mass-converter.title'),
  path: '/mass-converter',
  description: t('tools.mass-converter.description'),
  keywords: ['mass', 'converter', 'units', 'gram', 'ton', 'tonne', 'pound', 'stone', 'ounce'],
  component: () => import('./mass-converter.vue'),
  icon: Atom,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
