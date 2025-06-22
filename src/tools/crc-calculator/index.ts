import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.crc-calculator.title'),
  path: '/crc-calculator',
  description: translate('tools.crc-calculator.description'),
  keywords: ['crc', 'checksum', 'crc1',
    'crc8',
    'crc8 1-wire',
    'crc8 dvb-s2',
    'crc16',
    'crc16 ccitt',
    'crc16 modbus',
    'crc16 kermit',
    'crc16 xmodem',
    'crc24',
    'crc32',
    'crc32 mpeg-2',
    'crcjam'],
  component: () => import('./crc-calculator.vue'),
  icon: EyeOff,
  createdAt: new Date('2024-05-11'),
  category: 'Crypto',
});
