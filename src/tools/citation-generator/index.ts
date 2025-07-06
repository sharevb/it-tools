import { Book2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Citation Generator',
  path: '/citation-generator',
  description: 'Generate citation of papers/books in MLA or APA format',
  keywords: ['citation', 'generator', 'apa', 'mla', 'bibliography'],
  component: () => import('./citation-generator.vue'),
  icon: Book2,
  createdAt: new Date('2025-07-06'),
  category: 'Text',
});
