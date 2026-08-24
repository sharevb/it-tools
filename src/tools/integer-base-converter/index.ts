import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.base-converter.title'),
  path: '/base-converter',
  description: t('tools.base-converter.description'),
  keywords: ['integer', 'number', 'base', 'conversion', 'decimal', 'hexadecimal', 'binary', 'octal', 'base64'],
  component: () => import('./integer-base-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/ArrowsLeftRight')),
  category: 'Converters',
});
