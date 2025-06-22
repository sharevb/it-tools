import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.properties-converter.title'),
  path: '/properties-converter',
  redirectFrom: ['/properties-to-yaml'],
  description: translate('tools.properties-converter.description'),
  keywords: ['properties', 'yaml', 'convert', 'spring', 'spring-boot', 'parse', 'ini'],
  component: () => import('./properties-converter.vue'),
  icon: AlignJustified,
  createdAt: new Date('2025-04-21'),
  category: 'Converters',
});
