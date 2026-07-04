import { GitCommit } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.git-semantic-commit-memo.title'),
  path: '/git-semantic-commit-memo',
  description: t('tools.git-semantic-commit-memo.description'),
  keywords: ['git', 'semantic', 'commit', 'cheatsheet'],
  component: () => import('./git-semantic-commit-memo.vue'),
  icon: GitCommit,
  createdAt: new Date('2025-05-01'),
  category: 'Cheatsheets',
});
