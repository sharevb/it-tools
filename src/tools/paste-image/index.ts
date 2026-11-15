import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.paste-image.title'),
  path: '/paste-image',
  description: t('tools.paste-image.description'),
  keywords: [
    'paste',
    'image',
    'clipboard',
    'download',
    'screenshot',
    'png',
    'jpeg',
    'jpg',
    'webp',
    'convert',
    'base64',
  ],
  component: () => import('./paste-image.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Photo')),
  createdAt: new Date('2026-11-15'),
  category: 'Images',
});
