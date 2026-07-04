import { translate as t } from '@/plugins/i18n.plugin';
import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.iso-639-searcher.title'),
  path: '/iso-639-searcher',
  description: t('tools.iso-639-searcher.description'),
  keywords: ['iso639', 'language', 'langcode', 'searcher'],
  component: () => import('./iso-639-searcher.vue'),
  icon: Language,
  createdAt: new Date('2026-02-21'),
  category: 'Data',
});
