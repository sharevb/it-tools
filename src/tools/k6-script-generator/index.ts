import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.k6-script-generator.title'),
  path: '/k6-script-generator',
  description: t('tools.k6-script-generator.description'),
  keywords: ['k6', 'script', 'generator', 'load', 'testing', 'performance'],
  component: () => import('./k6-script-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Speedboat')),
  createdAt: new Date('2026-07-05'),
  category: 'Development',
});
