import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

const typeOptions = [
  { label: t('tools.meta-tag-generator.qr-contact-info-generator.texts.label-website'), value: 'website' },
  { label: t('tools.meta-tag-generator.website.text.article'), value: 'article' },
  { label: t('tools.meta-tag-generator.website.text.book'), value: 'book' },
  { label: t('tools.meta-tag-generator.website.text.profile'), value: 'profile' },
  {
    type: 'group',
    label: t('tools.meta-tag-generator.website.text.music'),
    key: t('tools.meta-tag-generator.website.text.music-0'),
    children: [
      { label: t('tools.meta-tag-generator.website.text.song'), value: 'music.song' },
      { label: t('tools.meta-tag-generator.website.text.music-album'), value: 'music.album' },
      { label: t('tools.meta-tag-generator.website.text.playlist'), value: 'music.playlist' },
      { label: t('tools.meta-tag-generator.website.text.radio-station'), value: 'music.radio_station' },
    ],
  },
  {
    type: 'group',
    label: t('tools.meta-tag-generator.website.text.video'),
    key: t('tools.meta-tag-generator.website.text.video-0'),
    children: [
      { label: t('tools.meta-tag-generator.website.text.movie'), value: 'video.movie' },
      { label: t('tools.meta-tag-generator.website.text.episode'), value: 'video.episode' },
      { label: t('tools.meta-tag-generator.website.text.tv-show'), value: 'video.tv_show' },
      { label: t('tools.meta-tag-generator.website.text.other-video'), value: 'video.other' },
    ],
  },
];

export const website: OGSchemaType = {
  name: t('tools.meta-tag-generator.website.text.general-information'),
  elements: [
    {
      type: 'select',
      label: t('tools.meta-tag-generator.website.text.page-type'),
      placeholder: t('tools.meta-tag-generator.website.text.select-the-type-of-your-website'),
      key: 'type',
      options: typeOptions,
    },
    { type: 'input', label: t('tools.meta-tag-generator.xslt-tester.texts.tag-title'), placeholder: t('tools.meta-tag-generator.website.text.enter-the-title-of-your-website'), key: 'title' },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.ical-generator.texts.label-description'),
      placeholder: t('tools.meta-tag-generator.website.text.enter-the-description-of-your-website'),
      key: 'description',
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.website.text.page-url'),
      placeholder: t('tools.meta-tag-generator.website.text.enter-the-url-of-your-website'),
      key: 'url',
    },
  ],
};
