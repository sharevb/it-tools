import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.fraction-decimal-converter.title'),
  path: '/fraction-decimal-converter',
  description: t('tools.fraction-decimal-converter.description'),
  keywords: ['fraction', 'decimal', 'inches', 'metric', 'mm', 'length', 'converter'],
  component: () => import('./fraction-decimal-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/MathSymbols')),
  createdAt: new Date('2026-10-30'),
  category: 'Maths',
});
