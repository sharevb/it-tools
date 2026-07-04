import { translate as t } from '@/plugins/i18n.plugin';
import { PictureInPictureOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.remove-background.title'),
  path: '/remove-background',
  description: t('tools.remove-background.description'),
  keywords: ['remove', 'background', 'image', 'rmbg', 'modnet'],
  component: () => import('./remove-background.vue'),
  icon: PictureInPictureOff,
  createdAt: new Date('2026-03-15'),
  category: 'Images',
  externAccessDescription: t('tools.remove-background.externalAccess'),
});
