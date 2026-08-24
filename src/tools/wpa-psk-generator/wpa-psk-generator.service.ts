import { Hex, PBKDF2, SHA1Algo } from 'crypto-es';

export function generateWpaPskRawKey(ssid: string, passphrase: string) {
  const psk = PBKDF2(passphrase, ssid, {
    keySize: 256 / 32,
    iterations: 4096,
    hasher: SHA1Algo,
  }).toString(Hex);
  return {
    ssid,
    passphrase,
    psk,
  };
}
