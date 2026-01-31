import { BrandGit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.gitignore-generator.title'),
  path: '/gitignore-generator',
  description: t('tools.gitignore-generator.description'),
  keywords: ['gitignore', 'generator'],
  component: () => import('./gitignore-generator.vue'),
  icon: BrandGit,
  createdAt: new Date('2025-12-06'),
  category: 'Development',
  externAccessDescription: 'This tool download .gitignore from https://github.com/github/gitignore using Github API',
});
