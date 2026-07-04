import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.arpa-decoder.title'),
  path: '/arpa-decoder',
  description: t('tools.arpa-decoder.description'),
  keywords: ['arpa', 'ptr', 'ip', 'dns', 'decoder'],
  component: () => import('./arpa-decoder.vue'),
  icon: World,
  createdAt: new Date('2026-01-01'),
  category: 'Network',
});
