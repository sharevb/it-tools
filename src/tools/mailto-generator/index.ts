import { translate as t } from '@/plugins/i18n.plugin';
import { IconMailCog } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.mailto-generator.title'),
  path: '/mailto-generator',
  description: t('tools.mailto-generator.description'),
  keywords: ['mailto', 'generator', 'link'],
  component: () => import('./mailto-generator.vue'),
  icon: IconMailCog,
  createdAt: new Date('2025-08-17'),
  category: 'Development',
});
