import { License } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.software-licence-compatibility.title'),
  path: '/software-licence-compatibility',
  description: translate('tools.software-licence-compatibility.description'),
  keywords: ['software', 'licence', 'compatibility'],
  component: () => import('./software-licence-compatibility.vue'),
  icon: License,
  createdAt: new Date('2024-03-17'),
  category: 'Data',
});
