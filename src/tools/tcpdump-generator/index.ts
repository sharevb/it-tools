import { Eyeglass } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.tcpdump-generator.title'),
  path: '/tcpdump-generator',
  description: t('tools.tcpdump-generator.description'),
  keywords: ['tcpdump', 'generator'],
  component: () => import('./tcpdump-generator.vue'),
  icon: Eyeglass,
  createdAt: new Date('2025-04-21'),
  category: 'Forensic',
});
