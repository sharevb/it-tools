import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Keyboard Tester',
  path: '/keyboard-tester',
  description:
    'Test your keyboard keys and check if all keys are working properly. Visual feedback for each key press with support for different keyboard layouts.',
  keywords: [
    'keyboard',
    'tester',
    'test',
    'keys',
    'layout',
    'mechanical',
    'typing',
    'qwerty',
    'azerty',
    'dvorak',
    'check',
    'working',
  ],
  component: () => import('./keyboard-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Keyboard')),
  createdAt: new Date('2026-07-11'),
  category: 'Forensic',
});
