import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'XML to Json',
  path: '/xml-to-json',
  description: 'Convert XML to JSON',
  keywords: ['xml', 'json'],
  component: () => import('./xml-to-json.vue'),
  icon: Braces,
  createdAt: new Date('2024-06-30'),
});
