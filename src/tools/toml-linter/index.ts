import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';
import BracketIcon from '~icons/mdi/code-brackets';

export const tool = defineTool({
  name: t('tools.toml-linter.title'),
  path: '/toml-linter',
  description: t('tools.toml-linter.description'),
  keywords: ['toml', 'linter'],
  component: () => import('./toml-linter.vue'),
  icon: BracketIcon,
  createdAt: new Date('2025-08-15'),
  category: 'TOML',
});
