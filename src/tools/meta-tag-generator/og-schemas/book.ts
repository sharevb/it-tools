import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const book: OGSchemaType = {
  name: t('tools.meta-tag-generator.website.text.book'),
  elements: [
    { type: 'input', label: t('tools.meta-tag-generator.article.text.author'), key: 'book:author', placeholder: t('tools.meta-tag-generator.book.text.who-wrote-this-book') },
    { type: 'input', label: 'ISBN', key: 'book:isbn', placeholder: t('tools.meta-tag-generator.book.text.the-international-standard-book-number') },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.book.text.release-date'),
      key: 'book:release_date',
      placeholder: t('tools.meta-tag-generator.book.text.the-date-the-book-was-released'),
    },
    { type: 'input', label: t('tools.meta-tag-generator.article.text.tag'), key: 'book:tag', placeholder: t('tools.meta-tag-generator.book.text.tag-words-associated-with-this-book') },
  ],
};
