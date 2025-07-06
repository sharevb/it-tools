import type { OGSchemaType } from '../OGSchemaType.type';

import { translate as t } from '@/plugins/i18n.plugin';

export const profile: OGSchemaType = {
  name: t('tools.meta-tag-generator.website.text.profile'),
  elements: [
    {
      type: 'input',
      label: t('tools.meta-tag-generator.profile.text.first-name'),
      placeholder: t('tools.meta-tag-generator.profile.text.enter-the-first-name-of-the-person'),
      key: 'profile:first_name',
    },
    {
      type: 'input',
      label: t('tools.meta-tag-generator.profile.text.last-name'),
      placeholder: t('tools.meta-tag-generator.profile.text.enter-the-last-name-of-the-person'),
      key: 'profile:last_name',
    },
    { type: 'input', label: t('tools.meta-tag-generator.__i18n_ally_root__.basic-auth-generator.username'), placeholder: t('tools.meta-tag-generator.profile.text.enter-the-username-of-the-person'), key: 'profile:username' },
    { type: 'input', label: t('tools.meta-tag-generator.profile.text.gender'), placeholder: t('tools.meta-tag-generator.profile.text.enter-the-gender-of-the-person'), key: 'profile:gender' },
  ],
};
