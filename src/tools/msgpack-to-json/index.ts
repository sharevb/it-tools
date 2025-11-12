import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Message Pack to JSON',
  path: '/msgpack-to-json',
  description: 'Convert MessagePack file to JSON',
  keywords: ['msgpack', 'message', 'pack', 'json'],
  component: () => import('./msgpack-to-json.vue'),
  icon: Binary,
  createdAt: new Date('2025-11-01'),
  category: 'JSON',
});
