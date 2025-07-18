import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const article: OGSchemaType = {
  name: t('tools.meta-tag-generator.website.text.article'),
  elements: [
    {
      type: 'input',
      label: t('tools.meta-tag-generator.article.text.publishing-date'),
      key: 'article:published_time',
      placeholder: t('tools.meta-tag-generator.article.text.when-the-article-was-first-published'),
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.article.text.modification-date'),
      key: 'article:modified_time',
      placeholder: t('tools.meta-tag-generator.article.text.when-the-article-was-last-changed'),
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.article.text.expiration-date'),
      key: 'article:expiration_time',
      placeholder: t('tools.meta-tag-generator.article.text.when-the-article-is-out-of-date-after'),
    },
    { type: 'input', label: t('tools.meta-tag-generator.article.text.author'), key: 'article:author', placeholder: t('tools.meta-tag-generator.article.text.writers-of-the-article') },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.article.text.section'),
      key: 'article:section',
      placeholder: t('tools.meta-tag-generator.article.text.a-high-level-section-name-e-g-technology'),
    },
    { type: 'input', label: t('tools.meta-tag-generator.article.text.tag'), key: 'article:tag', placeholder: t('tools.meta-tag-generator.article.text.tag-words-associated-with-this-article') },
  ],
};
