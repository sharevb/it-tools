import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.safelink-decoder.title'),
  path: '/safelink-decoder',
  description: t('tools.safelink-decoder.description'),
  keywords: ['outlook', 'safelink', 'decoder'],
  component: () => import('./safelink-decoder.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Mailbox')),
  createdAt: new Date('2024-03-11'),
  category: 'Forensic',
});
