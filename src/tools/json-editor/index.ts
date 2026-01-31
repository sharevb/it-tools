import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-editor.title'),
  path: '/json-editor',
  description: t('tools.json-editor.description'),
  keywords: ['json', 'editor', 'validator', 'repair'],
  component: () => import('./json-editor.vue'),
  icon: Braces,
  createdAt: new Date('2024-05-11'),
  category: 'JSON',
  externAccessDescription: 'This tool may download a JSON schema from https://www.schemastore.org when validation is requested. No data is send externally.',
});
