import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-toon.title'),
  path: '/json-to-toon',
  description: t('tools.json-to-toon.description'),
  keywords: ['json', 'llm', 'gpt', 'toon'],
  component: () => import('./json-to-toon.vue'),
  icon: Braces,
  createdAt: new Date('2025-11-22'),
  category: 'Text',
});
