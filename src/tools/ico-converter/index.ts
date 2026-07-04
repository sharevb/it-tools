import { PictureInPicture } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.ico-converter.title'),
  path: '/ico-converter',
  description: t('tools.ico-converter.description'),
  keywords: ['ico', 'png', 'jpeg', 'icon', 'converter'],
  component: () => import('./ico-converter.vue'),
  icon: PictureInPicture,
  createdAt: new Date('2024-08-15'),
  category: 'Images',
});
