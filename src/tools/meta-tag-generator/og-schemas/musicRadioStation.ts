import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const musicRadioStation: OGSchemaType = {
  name: t('tools.meta-tag-generator.musicRadioStation.text.radio-station-details'),
  elements: [
    { type: 'input', label: t('tools.meta-tag-generator.musicPlaylist.text.creator'), key: 'music:creator', placeholder: t('tools.meta-tag-generator.musicRadioStation.text.the-creator-of-this-radio-station') },
  ],
};
