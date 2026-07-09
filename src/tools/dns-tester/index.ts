import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'DNS Tester',
  path: '/dns-tester',
  description: 'A simple tool for testing DNS resolution, whois queries, and other DNS-related tasks.',
  keywords: ['dns', 'tester', 'resolution', 'whois', 'lookup', 'query', 'axfr', 'zone', 'dnssec'],
  component: () => import('./dns-tester.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/World')),
  createdAt: new Date('2026-05-11'),
  category: 'Forensic',
  externAccessDescription: 'This tool calls your Self Host Network Utilities Service to perform DNS/Whois queries and related tasks.',
});
