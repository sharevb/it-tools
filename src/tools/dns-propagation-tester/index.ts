import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'DNS Propagation Tester',
  path: '/dns-propagation-tester',
  description: 'A simple tool for testing DNS propagation across different servers.',
  keywords: ['dns', 'propagation', 'tester'],
  component: () => import('./dns-propagation-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/World')),
  createdAt: new Date('2026-05-11'),
  category: 'Forensic',
  externAccessDescription: 'This tool calls your Self Host Network Utilities Service to perform DNS queries.',
});
