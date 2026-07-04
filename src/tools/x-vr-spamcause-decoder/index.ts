import { RecordMail } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.x-vr-spamcause-decoder.title'),
  path: '/x-vr-spamcause-decoder',
  description: t('tools.x-vr-spamcause-decoder.description'),
  keywords: ['ovh', 'vade', 'retro', 'vr', 'spam', 'spamcause', 'decoder'],
  component: () => import('./x-vr-spamcause-decoder.vue'),
  icon: RecordMail,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
