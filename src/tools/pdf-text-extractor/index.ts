import { FileExport } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PDF Text Extractor',
  path: '/pdf-text-extractor',
  description: 'Extract text from PDF',
  keywords: ['pdf', 'text', 'extractor'],
  component: () => import('./pdf-text-extractor.vue'),
  icon: FileExport,
  createdAt: new Date('2025-05-08'),
  category: 'PDF',
});
