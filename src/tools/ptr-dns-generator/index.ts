import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ptr-dns-generator.title'),
  path: '/ptr-dns-generator',
  description: t('tools.ptr-dns-generator.description'),
  keywords: ['ptr', 'arpa', 'ip', 'dns', 'generator'],
  component: () => import('./ptr-dns-generator.vue'),
  icon: World,
  createdAt: new Date('2026-01-01'),
  category: 'Network',
});
