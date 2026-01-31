import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-linter.title'),
  path: '/json-linter',
  description: t('tools.json-linter.description'),
  keywords: ['json', 'linter', 'check', 'validator', 'repair'],
  component: () => import('./json-linter.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-20'),
  category: 'JSON',
  externAccessDescription: 'This tool may download a JSON schema from https://www.schemastore.org when validation is requested. No data is send externally.',
});
