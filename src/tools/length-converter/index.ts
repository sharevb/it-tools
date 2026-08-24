import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.length-converter.title'),
  path: '/length-converter',
  description: t('tools.length-converter.description'),
  keywords: ['length', 'converter',
    'units', 'meter', 'foot', 'feet', 'inch', 'yard', 'mile', 'pica', 'parsec', 'light',
  ],
  component: () => import('./length-converter.vue'),
  icon: defineAsyncComponent(() => import('@tabler/icons-vue/dist/esm/icons/IconRuler3.mjs')),
  createdAt: new Date('2024-08-15'),
  category: 'Physics',
});
