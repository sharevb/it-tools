import { Scan } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ocr-image.title'),
  path: '/ocr-image',
  description: translate('tools.ocr-image.description'),
  keywords: ['ocr', 'image', 'tesseract', 'pdf'],
  component: () => import('./ocr-image.vue'),
  icon: Scan,
  createdAt: new Date('2024-03-09'),
  category: 'Images',
});
