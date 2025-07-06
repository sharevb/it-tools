import type { OGSchemaType } from '../OGSchemaType.type';
import { videoMovie } from './videoMovie';

import { translate as t } from '@/plugins/i18n.plugin';

export const videoOther: OGSchemaType = {
  name: t('tools.meta-tag-generator.videoOther.text.other-video-details'),
  elements: [...videoMovie.elements],
};
