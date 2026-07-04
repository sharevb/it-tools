import { translate as t } from '@/plugins/i18n.plugin';
import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.translator.title'),
  path: '/translator',
  description: t('tools.translator.description'),
  keywords: ['translate', 'language'],
  component: () => import('./translator.vue'),
  icon: Language,
  createdAt: new Date('2025-08-15'),
  category: 'Text',
  externAccessDescription: t('tools.translator.externalAccess'),
});
