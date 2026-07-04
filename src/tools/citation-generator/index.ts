import { Book2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.citation-generator.title'),
  path: '/citation-generator',
  description: t('tools.citation-generator.description'),
  keywords: ['citation', 'generator', 'apa', 'mla', 'bibliography'],
  component: () => import('./citation-generator.vue'),
  icon: Book2,
  createdAt: new Date('2025-07-06'),
  category: 'Text',
});
