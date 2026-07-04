import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.xml-linter.title'),
  path: '/xml-linter',
  description: t('tools.xml-linter.description'),
  keywords: ['xml', 'linter'],
  component: () => import('./xml-linter.vue'),
  icon: Code,
  createdAt: new Date('2025-08-15'),
  category: 'XML',
});
