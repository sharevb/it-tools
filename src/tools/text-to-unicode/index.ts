import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.text-to-unicode.title'),
  path: '/text-to-unicode',
  description: t('tools.text-to-unicode.description'),
  keywords: ['text', 'to', 'unicode'],
  component: () => import('./text-to-unicode.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/TextWrap')),
  createdAt: new Date('2024-01-31'),
  category: 'Converters',
});
