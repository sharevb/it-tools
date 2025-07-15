import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const musicPlaylist: OGSchemaType = {
  name: t('tools.meta-tag-generator.musicPlaylist.text.playlist-details'),
  elements: [
    { type: 'input', label: t('tools.meta-tag-generator.website.text.song'), key: 'music:song', placeholder: t('tools.meta-tag-generator.musicAlbum.text.the-song-on-this-album') },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.musicAlbum.text.disc'),
      key: 'music:song:disc',
      placeholder: t('tools.meta-tag-generator.musicAlbum.text.the-same-as-music-album-disc-but-in-reverse'),
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.musicAlbum.text.track'),
      key: 'music:song:track',
      placeholder: t('tools.meta-tag-generator.musicAlbum.text.the-same-as-music-album-track-but-in-reverse'),
    },
    { type: 'input', label: t('tools.meta-tag-generator.musicPlaylist.text.creator'), key: 'music:creator', placeholder: t('tools.meta-tag-generator.musicPlaylist.text.the-creator-of-this-playlist') },
  ],
};
