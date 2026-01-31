import { Books } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.online-wiktionary.title'),
  path: '/online-wiktionary',
  description: t('tools.online-wiktionary.description'),
  keywords: ['online', 'dictionary', 'wiktionary'],
  component: () => import('./online-wiktionary.vue'),
  icon: Books,
  createdAt: new Date('2026-01-03'),
  category: 'Data',
});
