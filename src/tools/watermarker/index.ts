import { Copyright } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

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
