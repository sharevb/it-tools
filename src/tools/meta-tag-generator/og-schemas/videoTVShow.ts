import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

import { videoMovie } from './videoMovie';

export const videoTVShow: OGSchemaType = {
  name: t('tools.meta-tag-generator.videoTVShow.text.tv-show-details'),
  elements: [...videoMovie.elements],
};
