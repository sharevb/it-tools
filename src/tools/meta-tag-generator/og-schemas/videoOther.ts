import type { OGSchemaType } from '../OGSchemaType.type';
import { translate as t } from '@/plugins/i18n.plugin';

import { videoMovie } from './videoMovie';

export const videoOther: OGSchemaType = {
  name: t('tools.meta-tag-generator.videoOther.text.other-video-details'),
  elements: [...videoMovie.elements],
};
