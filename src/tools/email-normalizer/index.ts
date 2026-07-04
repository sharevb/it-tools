import { Mail } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.email-normalizer.title'),
  path: '/email-normalizer',
  description: t('tools.email-normalizer.description'),
  keywords: ['email', 'normalizer'],
  component: () => import('./email-normalizer.vue'),
  icon: Mail,
  createdAt: new Date('2024-08-15'),
  category: 'Converters',
});
