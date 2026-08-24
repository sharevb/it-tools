import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.json-to-typescript.title'),
  path: '/json-to-typescript',
  description: t('tools.json-to-typescript.description'),
  keywords: ['json', 'typescript'],
  component: () => import('./json-to-typescript.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconBrandTypescript.mjs')),
  createdAt: new Date('2025-05-01'),
  category: 'Development',
});
