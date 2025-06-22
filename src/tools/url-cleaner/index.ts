import { ClearAll } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.url-cleaner.title'),
  path: '/url-cleaner',
  description: translate('tools.url-cleaner.description'),
  keywords: ['url', 'cleaner', 'utm', 'fbclip'],
  component: () => import('./url-cleaner.vue'),
  icon: ClearAll,
  createdAt: new Date('2024-03-13'),
  category: 'Web',
});
