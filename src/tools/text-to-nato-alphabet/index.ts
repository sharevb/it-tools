import { Speakerphone } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.text-to-nato-alphabet.title'),
  path: '/text-to-nato-alphabet',
  description: t('tools.text-to-nato-alphabet.description'),
  keywords: ['string', 'nato', 'alphabet', 'phonetic', 'oral', 'transmission'],
  component: () => import('./text-to-nato-alphabet.vue'),
  icon: Speakerphone,
  category: 'Text',
});
