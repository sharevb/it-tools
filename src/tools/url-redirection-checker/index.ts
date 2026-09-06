import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'URL Redirection Checker',
  path: '/url-redirection-checker',
  description: 'Check if a URL redirects to another URL.',
  keywords: ['url', 'redirection', 'checker'],
  component: () => import('./url-redirection-checker.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Direction')),
  createdAt: new Date('2026-09-06'),
  category: 'Network',
  externAccessDescription:
    'This tool calls your Self Host Network Utilities Service to perform URL redirection checking.',
});
