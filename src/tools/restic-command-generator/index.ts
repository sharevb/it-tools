import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.restic-command-generator.title'),
  path: '/restic-command-generator',
  description: t('tools.restic-command-generator.description'),
  keywords: [
    'restic',
    'backrest',
    'restore',
    'backup',
    'snapshot',
    'repository',
    'command',
    'generator',
    's3',
    'backblaze',
    'b2',
  ],
  component: () => import('./restic-command-generator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/DatabaseImport')),
  createdAt: new Date('2026-09-11'),
  category: 'Network',
});
