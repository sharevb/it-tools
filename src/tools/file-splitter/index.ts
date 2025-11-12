import { Cut } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'File Splitter',
  path: '/file-splitter',
  description: 'Split JSON, XML or text file either by group of nodes or by group of lines',
  keywords: ['file', 'json', 'xml', 'text', 'splitter'],
  component: () => import('./file-splitter.vue'),
  icon: Cut,
  createdAt: new Date('2025-11-11'),
  category: 'Development',
});
