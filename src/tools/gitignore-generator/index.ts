import { BrandGit } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.gitignore-generator.title'),
  path: '/gitignore-generator',
  description: t('tools.gitignore-generator.description'),
  keywords: ['gitignore', 'generator'],
  component: () => import('./gitignore-generator.vue'),
  icon: BrandGit,
  createdAt: new Date('2025-12-06'),
  category: 'Development',
  externAccessDescription: t('tools.gitignore-generator.externalAccess'),
});
