import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.javascript-obfuscator.title'),
  path: '/javascript-obfuscator',
  description: t('tools.javascript-obfuscator.description'),
  keywords: ['javascript', 'js', 'rot13', 'base64', 'obfuscator'],
  component: () => import('./javascript-obfuscator.vue'),
  icon: defineAsyncComponent(() => import('@vicons/tabler/es/Lock')),
  createdAt: new Date('2026-01-01'),
  category: 'Development',
});
