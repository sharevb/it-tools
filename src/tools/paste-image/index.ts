import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Paste Image',
  path: '/paste-image',
  description: 'Paste an image from your clipboard, convert it to PNG, JPEG, or WebP, and download it.',
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
