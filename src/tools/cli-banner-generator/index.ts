import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.cli-banner-generator.title'),
  path: '/cli-banner-generator',
  description: t('tools.cli-banner-generator.description'),
  keywords: ['cli', 'banner', 'generator', 'ascii', 'logo'],
  component: () => import('./cli-banner-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Terminal2')),
  createdAt: new Date('2026-11-15'),
  category: 'Text',
});
