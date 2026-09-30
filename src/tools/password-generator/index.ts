import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.password-generator.title'),
  path: '/password-generator',
  description: t('tools.password-generator.description'),
  keywords: ['password', 'generator', 'random', 'secure', 'lowercase', 'uppercase', 'symbols'],
  component: () => import('./password-generator.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconPassword.mjs')),
  category: 'Generators',
});
