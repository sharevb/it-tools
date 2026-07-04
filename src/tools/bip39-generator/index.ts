import { AlignJustified } from '@vicons/tabler';
import { translate as t } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: t('tools.bip39-generator.title'),
  path: '/bip39-generator',
  description: t('tools.bip39-generator.description'),
  keywords: ['BIP39', 'passphrase', 'generator', 'mnemonic', 'entropy'],
  component: () => import('./bip39-generator.vue'),
  icon: AlignJustified,
  npmPackages: ['@it-tools/bip39'],
  category: 'Generators',
});
