import { Books } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Online Dictionary',
  path: '/online-wiktionary',
  description: 'Search words in Wiktionary',
  keywords: ['online', 'dictionary', 'wiktionary'],
  component: () => import('./online-wiktionary.vue'),
  icon: Books,
  createdAt: new Date('2026-01-03'),
  category: 'Data',
});
