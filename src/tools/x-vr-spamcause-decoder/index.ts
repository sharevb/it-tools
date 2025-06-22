import { RecordMail } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.x-vr-spamcause-decoder.title'),
  path: '/x-vr-spamcause-decoder',
  description: translate('tools.x-vr-spamcause-decoder.description'),
  keywords: ['ovh', 'vade', 'retro', 'vr', 'spam', 'spamcause', 'decoder'],
  component: () => import('./x-vr-spamcause-decoder.vue'),
  icon: RecordMail,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
