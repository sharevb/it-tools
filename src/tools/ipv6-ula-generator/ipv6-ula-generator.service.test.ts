import { describe, expect, it } from 'vitest';
import { generateUlaBlocks, generateUlaPrefix } from './ipv6-ula-generator.service';

describe('ipv6-ula-generator', () => {
  describe('generateUlaPrefix', () => {
    it.each<[number, string, string]>([
      [0, '20:37:06:12:34:56', 'fda8:5b32:b6f9'],
      [1700000000000, '20:37:06:12:34:56', 'fdb7:29eb:4229'],
      [1234567890, 'aa:bb:cc:dd:ee:ff', 'fd0c:d4a8:7e9a'],
    ])('derives the prefix from timestamp %s and mac %s', (timestamp, macAddress, expected) => {
      expect(generateUlaPrefix({ macAddress, timestamp })).toEqual(expected);
    });

    it('always starts with the fd00::/8 locally assigned prefix', () => {
      for (let timestamp = 0; timestamp < 50; timestamp++) {
        expect(generateUlaPrefix({ macAddress: '20:37:06:12:34:56', timestamp })).toMatch(
          /^fd[0-9a-f]{2}:[0-9a-f]{4}:[0-9a-f]{4}$/,
        );
      }
    });

    it('is stable for a given timestamp and mac address', () => {
      const args = { macAddress: '20:37:06:12:34:56', timestamp: 42 };

      expect(generateUlaPrefix(args)).toEqual(generateUlaPrefix(args));
    });

    it('changes when the timestamp or the mac address changes', () => {
      expect(generateUlaPrefix({ macAddress: '20:37:06:12:34:56', timestamp: 1 })).not.toEqual(
        generateUlaPrefix({ macAddress: '20:37:06:12:34:56', timestamp: 2 }),
      );
      expect(generateUlaPrefix({ macAddress: '20:37:06:12:34:56', timestamp: 1 })).not.toEqual(
        generateUlaPrefix({ macAddress: '20:37:06:12:34:57', timestamp: 1 }),
      );
    });
  });

  describe('generateUlaBlocks', () => {
    it('builds the ula and its routable blocks', () => {
      expect(generateUlaBlocks({ macAddress: '20:37:06:12:34:56', timestamp: 1700000000000 })).toEqual({
        ula: 'fdb7:29eb:4229::/48',
        firstRoutableBlock: 'fdb7:29eb:4229:0::/64',
        lastRoutableBlock: 'fdb7:29eb:4229:ffff::/64',
      });
    });
  });
});
