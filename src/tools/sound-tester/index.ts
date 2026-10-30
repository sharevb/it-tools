import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.sound-tester.title'),
  path: '/sound-tester',
  description: t('tools.sound-tester.description'),
  keywords: ['sound', 'speaker', 'tester'],
  component: () => import('./sound-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Speakerphone')),
  createdAt: new Date('2026-10-30'),
  category: 'Forensic',
});
