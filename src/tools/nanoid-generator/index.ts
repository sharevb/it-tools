import { Fingerprint } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.nanoid-generator.title'),
  path: '/nanoid-generator',
  description: t('tools.nanoid-generator.description'),
  keywords: ['nanoid', 'generator'],
  component: () => import('./nanoid-generator.vue'),
  icon: Fingerprint,
  createdAt: new Date('2024-05-31'),
  category: 'Generators',
});
