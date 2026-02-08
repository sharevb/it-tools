import { Books } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RSVP Reader',
  path: '/rsvp-reader',
  description: 'A Rapid Serial Visual Presentation (RSVP) tool that lets you paste text, and have the words displayed one at a time at a configurable words-per-minute (WPM) value.',
  keywords: ['rsvp', 'reader'],
  component: () => import('./rsvp-reader.vue'),
  icon: Books,
  createdAt: new Date('2026-01-30'),
  category: 'Text',
});
