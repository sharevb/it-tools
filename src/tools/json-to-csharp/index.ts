import { CSharp } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-to-csharp.title'),
  path: '/json-to-csharp',
  description: t('tools.json-to-csharp.description'),
  keywords: ['json', 'c#', 'csharp'],
  component: () => import('./json-to-csharp.vue'),
  icon: CSharp,
  createdAt: new Date('2024-05-11'),
  category: 'JSON',
});
