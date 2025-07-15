import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const twitter: OGSchemaType = {
  name: t('tools.meta-tag-generator.twitter.text.twitter'),
  elements: [
    {
      type: 'select',
      options: [
        { label: t('tools.meta-tag-generator.twitter.text.summary'), value: 'summary' },
        { label: t('tools.meta-tag-generator.twitter.text.summary-with-large-image'), value: 'summary_large_image' },
        { label: t('tools.meta-tag-generator.ies-lighting-guidelines.texts.tag-application'), value: 'app' },
        { label: t('tools.meta-tag-generator.twitter.text.player'), value: 'player' },
      ],
      label: t('tools.meta-tag-generator.twitter.text.card-type'),
      placeholder: t('tools.meta-tag-generator.twitter.text.the-twitter-card-type'),
      key: 'twitter:card',
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.twitter.text.site-account'),
      placeholder: t('tools.meta-tag-generator.twitter.text.the-name-of-the-twitter-account-of-the-site-ex-ittoolsdottech'),
      key: 'twitter:site',
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.twitter.text.creator-acc'),
      placeholder: t('tools.meta-tag-generator.twitter.text.the-name-of-the-twitter-account-of-the-creator-ex-cthmsst'),
      key: 'twitter:creator',
    },
  ],
};
