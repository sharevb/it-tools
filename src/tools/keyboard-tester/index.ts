import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.keyboard-tester.title'),
  path: '/keyboard-tester',
  description: t('tools.keyboard-tester.description'),
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
