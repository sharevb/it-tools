import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json to XML',
  path: '/json-to-xml',
  description: 'Convert JSON to XML',
  keywords: ['json', 'xml'],
  component: () => import('./json-to-xml.vue'),
  icon: Braces,
  createdAt: new Date('2024-06-30'),
});
