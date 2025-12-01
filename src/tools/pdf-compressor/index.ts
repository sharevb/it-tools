import { FileZip } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PDF Compressor',
  path: '/pdf-compressor',
  description: 'Optimize and compress PDF using Ghostscript',
  keywords: ['pdf', 'optimize', 'compressor'],
  component: () => import('./pdf-compressor.vue'),
  icon: FileZip,
  createdAt: new Date('2025-11-11'),
  category: 'PDF',
});
