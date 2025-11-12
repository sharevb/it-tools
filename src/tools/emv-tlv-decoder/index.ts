import { CreditCard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'EMV TLV decoder',
  path: '/emv-tlv-decoder',
  description: 'Decodes the EMV TLV (tag-length-value) data and its individual tags having extended meaning (such as TVR (Tag 95), Terminal Capabilities (Tag 9F33), etc.)',
  keywords: ['emv', 'tag', 'payment', 'card', 'tlv', 'decoder'],
  component: () => import('./emv-tlv-decoder.vue'),
  icon: CreditCard,
  createdAt: new Date('2025-11-01'),
  category: 'Forensic',
});
