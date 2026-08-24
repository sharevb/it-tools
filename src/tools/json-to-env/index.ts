import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-env.title'),
  path: '/json-to-env',
  description: t('tools.json-to-env.description'),
  keywords: ['json', 'to', 'env', 'dotenv', 'convert', 'environment', 'variables'],
  component: () => import('./json-to-env.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Braces')),
  createdAt: new Date('2026-04-17'),
  npmPackages: ['json5'],
  category: 'JSON',
});
