import { Binary } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.msgpack-to-json.title'),
  path: '/msgpack-to-json',
  description: t('tools.msgpack-to-json.description'),
  keywords: ['msgpack', 'message', 'pack', 'json'],
  component: () => import('./msgpack-to-json.vue'),
  icon: Binary,
  createdAt: new Date('2025-11-01'),
  category: 'JSON',
});
