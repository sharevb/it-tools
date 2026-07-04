import { Edit } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.html-wysiwyg-editor.title'),
  path: '/html-wysiwyg-editor',
  description: t('tools.html-wysiwyg-editor.description'),
  keywords: ['html', 'wysiwyg', 'editor', 'p', 'ul', 'ol', 'converter', 'live'],
  component: () => import('./html-wysiwyg-editor.vue'),
  icon: Edit,
  npmPackages: ['monaco', 'prettier'],
  category: 'Web',
});
