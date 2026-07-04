import { translate as t } from '@/plugins/i18n.plugin';
import { Books } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.rsvp-reader.title'),
  path: '/rsvp-reader',
  description: t('tools.rsvp-reader.description'),
  keywords: ['rsvp', 'reader'],
  component: () => import('./rsvp-reader.vue'),
  icon: Books,
  createdAt: new Date('2026-01-30'),
  category: 'Text',
});
