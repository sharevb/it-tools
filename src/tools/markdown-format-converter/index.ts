import { defineAsyncComponent } from 'vue';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.markdown-format-converter.title'),
  path: '/markdown-format-converter',
  description: t('tools.markdown-format-converter.description'),
  keywords: [
    'markdown',
    'format',
    'converter',
    'slack',
    'discord',
    'jira',
    'github',
    'stackoverflow',
    'obsidian',
    'logseq',
  ],
  component: () => import('./markdown-format-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Markdown')),
  createdAt: new Date('2026-07-14'),
  category: 'Markdown',
});
