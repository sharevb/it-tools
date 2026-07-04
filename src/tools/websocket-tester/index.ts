import { Sock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.websocket-tester.title'),
  path: '/websocket-tester',
  description: t('tools.websocket-tester.description'),
  keywords: ['websocket', 'ws', 'tester'],
  component: () => import('./websocket-tester.vue'),
  icon: Sock,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
