import { Mailbox } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.safelink-decoder.title'),
  path: '/safelink-decoder',
  description: t('tools.safelink-decoder.description'),
  keywords: ['outlook', 'safelink', 'decoder'],
  component: () => import('./safelink-decoder.vue'),
  icon: Mailbox,
  createdAt: new Date('2024-03-11'),
  category: 'Forensic',
});
