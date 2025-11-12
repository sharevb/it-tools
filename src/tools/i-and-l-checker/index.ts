import { LettersCase } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'I and L Checker',
  path: '/i-and-l-checker',
  description: 'Check a password or text with highlighting of 1, l, I, 0, O',
  keywords: ['ambiguous', 'text', 'letters', 'password', 'checker'],
  component: () => import('./i-and-l-checker.vue'),
  icon: LettersCase,
  createdAt: new Date('2025-11-08'),
  category: 'Text',
});
