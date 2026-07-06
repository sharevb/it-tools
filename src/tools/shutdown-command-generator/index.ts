import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.shutdown-command-generator.title'),
  path: '/shutdown-command-generator',
  description: t('tools.shutdown-command-generator.description'),
  keywords: ['shutdown', 'command'],
  component: () => import('./shutdown-command-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/SunOff')),
  createdAt: new Date('2026-04-07'),
  category: 'Network',
});
