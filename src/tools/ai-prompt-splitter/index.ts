import { Prompt } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ai-prompt-splitter.title'),
  path: '/ai-prompt-splitter',
  description: t('tools.ai-prompt-splitter.description'),
  keywords: ['ai', 'chatgpt', 'gpt', 'prompt', 'splitter'],
  component: () => import('./ai-prompt-splitter.vue'),
  icon: Prompt,
  createdAt: new Date('2024-07-14'),
  category: 'Text',
});
