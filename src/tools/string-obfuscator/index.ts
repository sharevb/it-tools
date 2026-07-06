import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.string-obfuscator.title'),
  path: '/string-obfuscator',
  description: t('tools.string-obfuscator.description'),
  keywords: ['string', 'obfuscator', 'secret', 'token', 'hide', 'obscure', 'mask', 'masking'],
  component: () => import('./string-obfuscator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/EyeOff')),
  createdAt: new Date('2023-08-16'),
  category: 'Text',
});
