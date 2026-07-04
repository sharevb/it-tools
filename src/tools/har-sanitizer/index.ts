import { ClearFormatting } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.har-sanitizer.title'),
  path: '/har-sanitizer',
  description: t('tools.har-sanitizer.description'),
  keywords: ['har', 'sanitizer'],
  component: () => import('./har-sanitizer.vue'),
  icon: ClearFormatting,
  createdAt: new Date('2024-06-17'),
  category: 'Network',
});
