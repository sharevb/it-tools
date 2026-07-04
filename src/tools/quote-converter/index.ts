import { Quote } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.quote-converter.title'),
  path: '/quote-converter',
  description: t('tools.quote-converter.description'),
  keywords: ['quote', 'converter'],
  component: () => import('./quote-converter.vue'),
  icon: Quote,
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
