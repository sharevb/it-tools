import { World } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.dmarc-dns-generator.title'),
  path: '/dmarc-dns-generator',
  description: t('tools.dmarc-dns-generator.description'),
  keywords: ['dmarc', 'dns'],
  component: () => import('./dmarc-dns-generator.vue'),
  icon: World,
  createdAt: new Date('2025-04-21'),
  category: 'Network',
});
