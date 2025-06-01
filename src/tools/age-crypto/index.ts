import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'AGE Cryptography',
  path: '/age-crypto',
  description: 'Provides a simple and easy-to-use open-source Age tool for generating keys, encrypting, and decrypting messages.',
  keywords: ['age'],
  component: () => import('./age-crypto.vue'),
  icon: EyeOff,
  createdAt: new Date('2025-05-08'),
  category: 'Crypto',
});
