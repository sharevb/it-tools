import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.toon-to-json.title'),
  path: '/toon-to-json',
  description: t('tools.toon-to-json.description'),
  keywords: ['toon', 'llm', 'gpt', 'json'],
  component: () => import('./toon-to-json.vue'),
  icon: Braces,
  createdAt: new Date('2025-11-22'),
  category: 'Text',
});
