import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown to Text',
  path: '/markdown-to-text',
  description: 'Convert markdown to plain text',
  keywords: ['markdown', 'plain', 'text'],
  component: () => import('./markdown-to-text.vue'),
  icon: FileText,
  createdAt: new Date('2026-02-02'),
  category: 'Markdown',
});
