import { Code } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.string-escaper.title'),
  path: '/string-escaper',
  description: t('tools.string-escaper.description'),
  keywords: ['string', 'code', 'escaper'],
  component: () => import('./string-escaper.vue'),
  icon: Code,
  createdAt: new Date('2024-08-15'),
  category: 'Development',
});
