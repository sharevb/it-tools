import { Mountain } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Swagger UI tester',
  path: '/swagger-ui-tester',
  description: 'Test Swagger Manifest',
  keywords: ['swagger', 'manifest', 'tester'],
  component: () => import('./swagger-ui-tester.vue'),
  icon: Mountain,
  createdAt: new Date('2025-07-14'),
  category: 'Development',
});
