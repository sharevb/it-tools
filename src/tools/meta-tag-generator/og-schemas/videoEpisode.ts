import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

import { translate as t } from '@/plugins/i18n.plugin';

export const videoEpisode: OGSchemaType = {
  name: t('tools.meta-tag-generator.videoEpisode.text.video-episode-details'),
  elements: [
    ...videoMovie.elements,
    { type: 'input', label: t('tools.meta-tag-generator.videoEpisode.text.series'), key: 'video:series', placeholder: t('tools.meta-tag-generator.videoEpisode.text.which-series-this-episode-belongs-to') },
  ],
};
