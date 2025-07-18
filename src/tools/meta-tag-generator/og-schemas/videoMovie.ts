import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const videoMovie: OGSchemaType = {
  name: t('tools.meta-tag-generator.videoMovie.text.movie-details'),
  elements: [
    {
      type: 'input-multiple',
      label: t('tools.meta-tag-generator.videoMovie.text.actor'),
      key: 'video:actor',
      placeholder: t('tools.meta-tag-generator.videoMovie.text.name-of-the-actress-actor'),
    },
    // { type: 'input', label: 'Actor role', key: 'video:actor:role', placeholder: 'The role they played...' },
    {
      type: 'input-multiple',
      label: t('tools.meta-tag-generator.videoMovie.text.director'),
      key: 'video:director',
      placeholder: t('tools.meta-tag-generator.videoMovie.text.name-of-the-director'),
    },
    { type: 'input-multiple', label: t('tools.meta-tag-generator.videoMovie.text.writer'), key: 'video:writer', placeholder: t('tools.meta-tag-generator.videoMovie.text.writers-of-the-movie') },
    { type: 'input', label: t('tools.meta-tag-generator.musicSong.text.duration'), key: 'video:duration', placeholder: t('tools.meta-tag-generator.videoMovie.text.the-movie-s-length-in-seconds') },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.book.text.release-date'),
      key: 'video:release_date',
      placeholder: t('tools.meta-tag-generator.videoMovie.text.the-date-the-movie-was-released'),
    },
    { type: 'input', label: t('tools.meta-tag-generator.article.text.tag'), key: 'video:tag', placeholder: t('tools.meta-tag-generator.videoMovie.text.tag-words-associated-with-this-movie') },
  ],
};
