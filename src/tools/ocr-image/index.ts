import { Scan } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ocr-image.title'),
  path: '/ocr-image',
  description: t('tools.ocr-image.description'),
  keywords: ['ocr', 'image', 'tesseract', 'pdf'],
  component: () => import('./ocr-image.vue'),
  icon: Scan,
  createdAt: new Date('2024-03-09'),
  category: 'Images',
  externAccessDescription: 'This tool downloads OCR languages models on https://cdn.jsdelivr.net',
});
