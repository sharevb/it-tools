import { translate as t } from '@/plugins/i18n.plugin';
import { IconRuler3 } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.length-converter.title'),
  path: '/length-converter',
  description: t('tools.length-converter.description'),
  keywords: ['length', 'converter',
    'units', 'meter', 'foot', 'feet', 'inch', 'yard', 'mile', 'pica', 'parsec', 'light',
  ],
  component: () => import('./length-converter.vue'),
  icon: IconRuler3,
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
