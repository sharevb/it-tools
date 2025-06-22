import { GitCommit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.git-semantic-commit-memo.title'),
  path: '/git-semantic-commit-memo',
  description: translate('tools.git-semantic-commit-memo.description'),
  keywords: ['git', 'semantic', 'commit', 'cheatsheet'],
  component: () => import('./git-semantic-commit-memo.vue'),
  icon: GitCommit,
  createdAt: new Date('2025-05-01'),
  category: 'Cheatsheets',
});
