import { CursorText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.sed-command-generator.title'),
  path: '/sed-command-generator',
  description: t('tools.sed-command-generator.description'),
  keywords: ['sed', 'command', 'generator'],
  component: () => import('./sed-command-generator.vue'),
  icon: CursorText,
  createdAt: new Date('2025-08-17'),
  category: 'Text',
});
