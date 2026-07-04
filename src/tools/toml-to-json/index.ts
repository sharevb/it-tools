import BracketIcon from '~icons/mdi/code-brackets';
import { translate as t } from '@/plugins/i18n.plugin';

import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.toml-to-json.title'),
  path: '/toml-to-json',
  description: t('tools.toml-to-json.description'),
  keywords: ['toml', 'json', 'convert', 'online', 'transform', 'parser'],
  component: () => import('./toml-to-json.vue'),
  icon: BracketIcon,
  createdAt: new Date('2023-06-23'),
  npmPackages: ['yaml', 'smol-toml'],
  category: 'TOML',
});
