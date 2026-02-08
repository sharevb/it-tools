import { Book2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Epub to Markdown',
  path: '/epub-to-markdown',
  description: 'Convert an EPUB file to full markdown content',
  keywords: ['epub', 'markdown'],
  component: () => import('./epub-to-markdown.vue'),
  icon: Book2,
  createdAt: new Date('2026-02-01'),
  category: 'Markdown',
});
