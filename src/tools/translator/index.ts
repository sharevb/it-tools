import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.translator.title'),
  path: '/translator',
  description: t('tools.translator.description'),
  keywords: ['translate', 'language'],
  component: () => import('./translator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-08-15'),
  category: 'Text',
  externAccessDescription: 'This tool downloads translation models (Xenova/opus-mt-[source]-[target]) on https://huggingface.co/',
});
