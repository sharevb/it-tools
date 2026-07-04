import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.cli-command-editor.title'),
  path: '/cli-command-editor',
  description: '',
  keywords: ['cli', 'command', 'editor'],
  component: () => import('./cli-command-editor.vue'),
  icon: Terminal2,
  createdAt: new Date('2025-07-05'),
  category: 'Development',
});
