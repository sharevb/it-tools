import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.punycode-converter.title'),
  path: '/punycode-converter',
  description: t('tools.punycode-converter.description'),
  keywords: ['punycode', 'converter', 'rfc3492', 'bootstring', 'domain', 'dns'],
  component: () => import('./punycode-converter.vue'),
  icon: World,
  createdAt: new Date('2024-08-15'),
  category: 'Network',
});
