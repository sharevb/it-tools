import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.whitespace-cleaner.title'),
  path: '/whitespace-cleaner',
  description: t('tools.whitespace-cleaner.description'),
  keywords: [
    'whitespace',
    'cleaner',
    'clean',
    'claude',
    'terminal',
    'ansi',
    'indent',
    'trailing',
    'line',
    'numbers',
    'box',
    'drawing',
    'diff',
    'unwrap',
    'markdown',
  ],
  component: () => import('./whitespace-cleaner.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ClearFormatting')),
  createdAt: new Date('2026-11-15'),
  category: 'Text',
});
