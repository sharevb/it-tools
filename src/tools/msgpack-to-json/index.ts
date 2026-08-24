import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.msgpack-to-json.title'),
  path: '/msgpack-to-json',
  description: t('tools.msgpack-to-json.description'),
  keywords: ['msgpack', 'message', 'pack', 'json'],
  component: () => import('./msgpack-to-json.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Binary')),
  createdAt: new Date('2025-11-01'),
  category: 'JSON',
});
