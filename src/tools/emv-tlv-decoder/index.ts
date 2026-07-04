import { CreditCard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.emv-tlv-decoder.title'),
  path: '/emv-tlv-decoder',
  description: t('tools.emv-tlv-decoder.description'),
  keywords: ['emv', 'tag', 'payment', 'card', 'tlv', 'decoder'],
  component: () => import('./emv-tlv-decoder.vue'),
  icon: CreditCard,
  createdAt: new Date('2025-11-01'),
  category: 'Forensic',
});
