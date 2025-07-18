import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const musicAlbum: OGSchemaType = {
  name: t('tools.meta-tag-generator.musicAlbum.text.album-details'),
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
    { type: 'input', label: t('tools.meta-tag-generator.musicAlbum.text.musician'), key: 'music:musician', placeholder: t('tools.meta-tag-generator.musicAlbum.text.the-musician-that-made-this-song') },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.book.text.release-date'),
      key: 'music:release_date',
      placeholder: t('tools.meta-tag-generator.musicAlbum.text.the-date-the-album-was-released'),
    },
  ],
};
