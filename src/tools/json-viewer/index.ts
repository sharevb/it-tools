import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-prettify.title'),
  path: '/json-prettify',
  description: t('tools.json-prettify.description'),
  keywords: ['json', 'viewer', 'prettify', 'format', 'lint', 'validator', 'schema', 'repair'],
  component: () => import('./json-viewer.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Braces')),
  redirectFrom: ['/json-viewer'],
  npmPackages: ['json5'],
  category: 'JSON',
  externAccessDescription: t('tools.json-prettify.externalAccess'),
});
