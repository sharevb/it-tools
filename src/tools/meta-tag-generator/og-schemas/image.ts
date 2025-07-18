import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const image: OGSchemaType = {
  name: t('tools.meta-tag-generator.qr-code-generator.texts.title-image'),
  elements: [
    {
      type: 'input',
      label: t('tools.meta-tag-generator.image.text.image-url'),
      placeholder: t('tools.meta-tag-generator.image.text.the-url-of-your-website-social-image'),
      key: 'image',
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.image.text.image-alt'),
      placeholder: t('tools.meta-tag-generator.image.text.the-alternative-text-of-your-website-social-image'),
      key: 'image:alt',
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.image.text.width'),
      placeholder: t('tools.meta-tag-generator.image.text.width-in-px-of-your-website-social-image'),
      key: 'image:width',
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.image.text.height'),
      placeholder: t('tools.meta-tag-generator.image.text.height-in-px-of-your-website-social-image'),
      key: 'image:height',
    },
  ],
};
