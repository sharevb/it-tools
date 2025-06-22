import { ClearFormatting } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.har-sanitizer.title'),
  path: '/har-sanitizer',
  description: translate('tools.har-sanitizer.description'),
  keywords: ['har', 'sanitizer'],
  component: () => import('./har-sanitizer.vue'),
  icon: ClearFormatting,
  createdAt: new Date('2024-06-17'),
  category: 'Network',
});
