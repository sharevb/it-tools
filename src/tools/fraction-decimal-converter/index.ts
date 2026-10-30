import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Fraction Decimal Converter',
  path: '/fraction-decimal-converter',
  description: 'Convert fractions to decimals and vice versa including inches and metric conversions.',
  keywords: ['fraction', 'decimal', 'inches', 'metric', 'mm', 'length', 'converter'],
  component: () => import('./fraction-decimal-converter.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/MathSymbols')),
  createdAt: new Date('2026-10-30'),
  category: 'Maths',
});
