import { WorldDownload } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Short Urls Expander',
  path: '/short-urls-expander',
  description: 'Expand short urls to target full urls',
  keywords: ['short', 'urls', 'expander'],
  component: () => import('./short-urls-expander.vue'),
  icon: WorldDownload,
  createdAt: new Date('2025-11-29'),
  category: 'Forensic',
});
