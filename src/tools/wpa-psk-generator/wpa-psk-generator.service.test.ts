import { describe, expect, it } from 'vitest';
import { generateWpaPskRawKey } from './wpa-psk-generator.service';

describe('wpa-psk-generator', () => {
  it('generateWpaPskRawKey should generate raw key', () => {
    expect(generateWpaPskRawKey('test', 'test')).to.deep.eq({
      passphrase: 'test',
      psk: 'd630c5513becfd3952432bd7fcf098b7a40907f3214cf43551f1b8cfda873ecc',
      ssid: 'test',
    });
    expect(generateWpaPskRawKey('test', 'test')?.psk).toHaveLength(256 / 8 * 2);
  });

  it.each<[string, string, string]>([
    ['MyNetwork', 'SuperSecret123', '667d7ea7ef34fd9468f4a5ca7ff69cb8bdc05980dee5ba784dfc70e65f70f51a'],
    ['', '', '5c622913020b8e2ddd9a58552396ccebd10eb57121a346f127d13c9006434cc0'],
  ])('derives the psk of ssid "%s" with passphrase "%s"', (ssid, passphrase, psk) => {
    expect(generateWpaPskRawKey(ssid, passphrase)).to.deep.eq({ ssid, passphrase, psk });
  });

  it('uses the ssid as the salt, so swapping ssid and passphrase changes the psk', () => {
    expect(generateWpaPskRawKey('alice', 'bob').psk).not.toEqual(generateWpaPskRawKey('bob', 'alice').psk);
  });

  it('is deterministic', () => {
    expect(generateWpaPskRawKey('ssid', 'passphrase').psk).toEqual(generateWpaPskRawKey('ssid', 'passphrase').psk);
  });
});
