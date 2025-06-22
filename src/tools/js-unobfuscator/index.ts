import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.js-unobfuscator.title'),
  path: '/js-unobfuscator',
  description: translate('tools.js-unobfuscator.description'),
  keywords: ['js', 'unobfuscator', 'obfuscator.io', 'unminify', 'transpile', 'unpack', 'webpack', 'browserify'],
  component: () => import('./js-unobfuscator.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2024-05-11'),
  category: 'Development',
});
