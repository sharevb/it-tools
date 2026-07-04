import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.mermaid-exporter.title'),
  path: '/mermaid-exporter',
  description: t('tools.mermaid-exporter.description'),
  keywords: ['mermaid', 'exporter', 'markdown', 'MD'],
  component: () => import('./mermaid-exporter.vue'),
  icon: Markdown,
  createdAt: new Date('2025-04-11'),
  category: 'Text',
  redirectFrom: ['/mermaid-previewer'],
});
