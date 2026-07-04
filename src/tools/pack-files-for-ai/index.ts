import { BatteryCharging } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.pack-files-for-ai.title'),
  path: '/pack-files-for-ai',
  description: t('tools.pack-files-for-ai.description'),
  keywords: ['pack', 'files', 'source', 'code', 'gpt', 'claude', 'repomix', 'ai'],
  component: () => import('./pack-files-for-ai.vue'),
  icon: BatteryCharging,
  createdAt: new Date('2025-08-23'),
  category: 'Text',
});
