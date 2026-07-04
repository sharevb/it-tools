import { translate as t } from '@/plugins/i18n.plugin';
import { Artboard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.zalgo.title'),
  path: '/zalgo',
  description: t('tools.zalgo.description'),
  keywords: ['zalgo', 'text', 'generation'],
  component: () => import('./zalgo.vue'),
  icon: Artboard,
  createdAt: new Date('2026-02-21'),
  category: 'Text',
});
