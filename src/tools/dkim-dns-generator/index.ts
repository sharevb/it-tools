import { World } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dkim-dns-generator.title'),
  path: '/dkim-dns-generator',
  description: t('tools.dkim-dns-generator.description'),
  keywords: ['dkim', 'dns'],
  component: () => import('./dkim-dns-generator.vue'),
  icon: World,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
