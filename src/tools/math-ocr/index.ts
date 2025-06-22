import { MathSymbols } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.math-ocr.title'),
  path: '/math-ocr',
  description: translate('tools.math-ocr.description'),
  keywords: ['math', 'ocr', 'latex', 'formula', 'image'],
  component: () => import('./math-ocr.vue'),
  icon: MathSymbols,
  createdAt: new Date('2024-08-15'),
  category: 'Maths',
});
