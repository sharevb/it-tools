import { Flag } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.iso-3166-searcher.title'),
  path: '/iso-3166-searcher',
  description: translate('tools.iso-3166-searcher.description'),
  keywords: ['iso', 'iso2', 'iso3', 'phone', 'currency', 'timezones', 'domain', 'lang', 'iso3166', 'country', 'ccltd', 'searcher'],
  component: () => import('./iso-3166-searcher.vue'),
  icon: Flag,
  createdAt: new Date('2024-04-20'),
  category: 'Data',
});
