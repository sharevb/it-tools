import { FileText } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.gpt-token-encoder.title'),
  path: '/gpt-token-encoder',
  description: t('tools.gpt-token-encoder.description'),
  keywords: ['gpt', 'llm', 'openai', 'token', 'encode', 'decode'],
  component: () => import('./gpt-token-encoder.vue'),
  icon: FileText,
  createdAt: new Date('2025-08-15'),
  category: 'Text',
});
