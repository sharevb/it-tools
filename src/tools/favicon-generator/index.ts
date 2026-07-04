import { IconFavicon } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.favicon-generator.title'),
  path: '/favicon-generator',
  description: t('tools.favicon-generator.description'),
  keywords: ['favicon', 'generator'],
  component: () => import('./favicon-generator.vue'),
  icon: IconFavicon,
  createdAt: new Date('2025-08-15'),
  category: 'Development',
});
