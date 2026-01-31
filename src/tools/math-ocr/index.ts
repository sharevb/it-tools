import { MathSymbols } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.math-ocr.title'),
  path: '/math-ocr',
  description: t('tools.math-ocr.description'),
  keywords: ['math', 'ocr', 'latex', 'formula', 'image'],
  component: () => import('./math-ocr.vue'),
  icon: MathSymbols,
  createdAt: new Date('2024-08-15'),
  category: 'Maths',
  externAccessDescription: 'This tool downloads MathJaX from https://cdnjs.cloudflare.com and download Latex OCR recognition model (Xenova/texify) from https://huggingface.co/',
});
