import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const musicSong: OGSchemaType = {
  name: t('tools.meta-tag-generator.musicSong.text.song-details'),
  elements: [
    { type: 'input', label: t('tools.meta-tag-generator.musicSong.text.duration'), placeholder: t('tools.meta-tag-generator.musicSong.text.the-duration-of-the-song'), key: 'music:duration' },
    { type: 'input', label: t('tools.meta-tag-generator.musicSong.text.album'), placeholder: t('tools.meta-tag-generator.musicSong.text.the-album-this-song-is-from'), key: 'music:album' },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.musicAlbum.text.disc'),
      placeholder: t('tools.meta-tag-generator.musicSong.text.which-disc-of-the-album-this-song-is-on'),
      key: 'music:album:disk',
    },
    { type: 'input', label: t('tools.meta-tag-generator.musicAlbum.text.track'), placeholder: t('tools.meta-tag-generator.musicSong.text.which-track-this-song-is'), key: 'music:album:track' },
    {
      type: 'input-multiple',
      label: t('tools.meta-tag-generator.musicAlbum.text.musician'),
      placeholder: t('tools.meta-tag-generator.musicAlbum.text.the-musician-that-made-this-song'),
      key: 'music:musician',
    },
  ],
};
