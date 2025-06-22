import { FileLike } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.pdf-linearize.title'),
  path: '/pdf-linearize',
  description: translate('tools.pdf-linearize.description'),
  keywords: ['pdf', 'linearize', 'fastweb'],
  component: () => import('./pdf-linearize.vue'),
  icon: FileLike,
  createdAt: new Date('2024-01-09'),
  category: 'PDF',
});
