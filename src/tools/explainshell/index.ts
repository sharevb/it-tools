import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Explain Shell Command',
  path: '/explainshell',
  description: 'Use explainshell.com (or a self hosted) to explain a shell command',
  keywords: ['explain', 'shell'],
  component: () => import('./explainshell.vue'),
  icon: Terminal2,
  createdAt: new Date('2026-01-30'),
  category: 'Data',
  externAccessDescription: 'This tool calls https://explainshell.com (unless you self host it) this provided shell command.',
});
