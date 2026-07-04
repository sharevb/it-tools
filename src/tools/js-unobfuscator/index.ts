import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.js-unobfuscator.title'),
  path: '/js-unobfuscator',
  description: t('tools.js-unobfuscator.description'),
  keywords: ['js', 'unobfuscator', 'obfuscator.io', 'unminify', 'transpile', 'unpack', 'webpack', 'browserify'],
  component: () => import('./js-unobfuscator.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2024-05-11'),
  category: 'Development',
});
