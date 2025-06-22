import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.text-to-unicode-names.title'),
  path: '/text-to-unicode-names',
  description: translate('tools.text-to-unicode-names.description'),
  keywords: ['text', 'unicode', 'name', 'hexa', 'char', 'code'],
  component: () => import('./text-to-unicode-names.vue'),
  icon: Language,
  createdAt: new Date('2024-06-10'),
  category: 'Text',
});
