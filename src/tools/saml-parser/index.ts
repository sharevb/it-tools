import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SAML Parser',
  path: '/saml-parser',
  description: 'Detects SAML input (Base64, DEFLATE, or XML), parses, validates its signature, and displays a structured view of the assertion—including issuer, subject, conditions, authentication context, claims, and validation status.',
  keywords: ['saml', 'assertion', 'decoder', 'parser'],
  component: () => import('./saml-parser.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Key')),
  createdAt: new Date('2026-07-04'),
  category: 'Crypto',
});
