import { Power } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.force-converter.title'),
  path: '/force-converter',
  description: translate('tools.force-converter.description'),
  keywords: ['force', 'converter'],
  component: () => import('./force-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
