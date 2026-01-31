import { translate as t } from '@/plugins/i18n.plugin';
import { IconLockCog } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.passphrase-generator.title'),
  path: '/passphrase-generator',
  description: t('tools.passphrase-generator.description'),
  keywords: ['passphrase', 'random', 'password', 'generator'],
  component: () => import('./passphrase-generator.vue'),
  icon: IconLockCog,
  createdAt: new Date('2024-08-15'),
  category: 'Generators',
});
