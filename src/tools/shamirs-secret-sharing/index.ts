import { Share } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Shamirs Secret Sharing',
  path: '/shamirs-secret-sharing',
  description: 'Allow to share and recompose a secret using Shamir\'s Secret Sharing algorythm',
  keywords: ['shamirs', 'secret', 'sharing'],
  component: () => import('./shamirs-secret-sharing.vue'),
  icon: Share,
  createdAt: new Date('2025-11-29'),
  category: 'Crypto',
});
