import { FileLike } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.pdf-linearize.title'),
  path: '/pdf-linearize',
  description: t('tools.pdf-linearize.description'),
  keywords: ['pdf', 'linearize', 'fastweb'],
  component: () => import('./pdf-linearize.vue'),
  icon: FileLike,
  createdAt: new Date('2024-01-09'),
  category: 'PDF',
});
