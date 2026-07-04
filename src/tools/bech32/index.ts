import { translate as t } from '@/plugins/i18n.plugin';
import { ZoomMoney } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.bech32.title'),
  path: '/bech32',
  description: t('tools.bech32.description'),
  keywords: ['bech32', 'crypto', 'encode', 'decode', 'bitcoin', 'address', 'segwit'],
  component: () => import('./bech32.vue'),
  icon: ZoomMoney,
  createdAt: new Date('2026-02-21'),
  category: 'Crypto',
});
