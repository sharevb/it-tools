import { Braces } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-minify.title'),
  path: '/json-minify',
  description: t('tools.json-minify.description'),
  keywords: ['json', 'minify', 'format'],
  component: () => import('./json-minify.vue'),
  icon: Braces,
  npmPackages: ['json5'],
  category: 'JSON',
});
