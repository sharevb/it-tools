import { Prompt } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ai-prompt-splitter.title'),
  path: '/ai-prompt-splitter',
  description: translate('tools.ai-prompt-splitter.description'),
  keywords: ['ai', 'chatgpt', 'gpt', 'prompt', 'splitter'],
  component: () => import('./ai-prompt-splitter.vue'),
  icon: Prompt,
  createdAt: new Date('2024-07-14'),
  category: 'Text',
});
