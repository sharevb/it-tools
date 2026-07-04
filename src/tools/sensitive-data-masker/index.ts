import { ShieldLock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.sensitive-data-masker.title'),
  path: '/sensitive-data-masker',
  description: t('tools.sensitive-data-masker.description'),
  keywords: ['sensitive', 'data', 'masker', 'obfuscator', 'clean', 'log'],
  component: () => import('./sensitive-data-masker.vue'),
  icon: ShieldLock,
  createdAt: new Date('2024-06-16'),
  category: 'Forensic',
});
