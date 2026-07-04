import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.heic-converter.title'),
  path: '/heic-converter',
  description: t('tools.heic-converter.description'),
  keywords: ['heic', 'heif', 'convert', 'decoder', 'converter'],
  component: () => import('./heic-converter.vue'),
  icon: Photo,
  createdAt: new Date('2024-04-28'),
  category: 'Images',
});
