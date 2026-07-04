import { Copyright } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.watermarker.title'),
  path: '/watermarker',
  description: t('tools.watermarker.description'),
  keywords: ['watermarker'],
  component: () => import('./watermarker.vue'),
  icon: Copyright,
  createdAt: new Date('2025-06-22'),
  category: 'Images',
});
