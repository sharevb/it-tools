import { BrandPython } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.django-secret-generator.title'),
  path: '/django-secret-generator',
  description: t('tools.django-secret-generator.description'),
  keywords: ['django', 'secret', 'generator'],
  component: () => import('./django-secret-generator.vue'),
  icon: BrandPython,
  createdAt: new Date('2025-08-17'),
  category: 'Development',
});
