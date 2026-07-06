import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTTPS Tester',
  path: '/https-tester',
  description: 'Validate HTTPS certificate, HSTS and 302 redirection',
  keywords: ['https', 'hsts', 'redirection', 'certificate', 'tester'],
  component: () => import('./https-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ShieldCheck')),
  createdAt: new Date('2026-05-11'),
  category: 'Forensic',
  externAccessDescription: 'This tool calls your Self Host Network Utilities Service to perform HTTPS/HSTS related tasks.',
});
