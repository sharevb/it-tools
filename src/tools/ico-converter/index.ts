import { PictureInPicture } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ico-converter.title'),
  path: '/ico-converter',
  description: translate('tools.ico-converter.description'),
  keywords: ['ico', 'png', 'jpeg', 'icon', 'converter'],
  component: () => import('./ico-converter.vue'),
  icon: PictureInPicture,
  createdAt: new Date('2024-08-15'),
  category: 'Images',
});
