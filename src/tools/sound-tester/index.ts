import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Sound Tester',
  path: '/sound-tester',
  description: 'Test your speakers and headphones by playing test sounds. Adjust volume and check for audio clarity.',
  keywords: ['sound', 'speaker', 'tester'],
  component: () => import('./sound-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Speakerphone')),
  createdAt: new Date('2026-10-30'),
  category: 'Forensic',
});
