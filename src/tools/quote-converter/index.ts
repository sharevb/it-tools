import { Quote } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.quote-converter.title'),
  path: '/quote-converter',
  description: translate('tools.quote-converter.description'),
  keywords: ['quote', 'converter'],
  component: () => import('./quote-converter.vue'),
  icon: Quote,
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
