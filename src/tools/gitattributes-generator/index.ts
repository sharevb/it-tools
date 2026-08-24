import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.gitattributes-generator.title'),
  path: '/gitattributes-generator',
  description: t('tools.gitattributes-generator.description'),
  keywords: ['gitattributes', 'generator'],
  component: () => import('./gitattributes-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/BrandGit')),
  createdAt: new Date('2026-01-01'),
  category: 'Development',
  externAccessDescription: t('tools.gitattributes-generator.externalAccess'),
});
