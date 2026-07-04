import { translate as t } from '@/plugins/i18n.plugin';
import { VideoPlus } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.gif-to-mp4.title'),
  path: '/gif-to-mp4',
  description: t('tools.gif-to-mp4.description'),
  keywords: ['gif', 'ffmpeg', 'mp4'],
  component: () => import('./gif-to-mp4.vue'),
  icon: VideoPlus,
  createdAt: new Date('2026-03-15'),
  category: 'Images',
  externalHTMLContent: 'Download FFMPEG from https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10. All processing done in your browser.',
});
