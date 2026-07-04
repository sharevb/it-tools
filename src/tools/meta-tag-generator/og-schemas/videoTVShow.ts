import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

import { translate as t } from '@/plugins/i18n.plugin';

export const videoTVShow: OGSchemaType = {
  name: t('tools.meta-tag-generator.videoTVShow.text.tv-show-details'),
  elements: [...videoMovie.elements],
};
