import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-msgpack.title'),
  path: '/json-to-msgpack',
  description: t('tools.json-to-msgpack.description'),
  keywords: ['json', 'message', 'pack', 'msgpack'],
  component: () => import('./json-to-msgpack.vue'),
  icon: Binary,
  createdAt: new Date('2025-11-11'),
  category: 'JSON',
});
