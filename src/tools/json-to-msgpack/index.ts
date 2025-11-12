import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to MessagePack',
  path: '/json-to-msgpack',
  description: 'Convert JSON to MessagePack',
  keywords: ['json', 'message', 'pack', 'msgpack'],
  component: () => import('./json-to-msgpack.vue'),
  icon: Binary,
  createdAt: new Date('2025-11-11'),
  category: 'JSON',
});
