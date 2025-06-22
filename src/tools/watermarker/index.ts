import { Copyright } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.watermarker.title'),
  path: '/watermarker',
  description: translate('tools.watermarker.description'),
  keywords: ['watermarker'],
  component: () => import('./watermarker.vue'),
  icon: Copyright,
  createdAt: new Date('2025-06-22'),
  category: 'Images',
});
