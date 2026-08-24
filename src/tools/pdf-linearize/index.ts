import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pdf-linearize.title'),
  path: '/pdf-linearize',
  description: t('tools.pdf-linearize.description'),
  keywords: ['pdf', 'linearize', 'fastweb'],
  component: () => import('./pdf-linearize.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/FileLike')),
  createdAt: new Date('2024-01-09'),
  category: 'PDF',
});
