import { SHA1 } from 'crypto-es';

// RFC 4193 §3.2.2: sha1 of the current timestamp concatenated with the mac address, keeping the lowest 40 bits.
export function generateUlaPrefix({ macAddress, timestamp }: { macAddress: string; timestamp: number }) {
  const hex40bit = SHA1(timestamp + macAddress)
    .toString()
    .substring(30);

  return `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;
}

export function generateUlaBlocks({ macAddress, timestamp }: { macAddress: string; timestamp: number }) {
  const ula = generateUlaPrefix({ macAddress, timestamp });

  return {
    ula: `${ula}::/48`,
    firstRoutableBlock: `${ula}:0::/64`,
    lastRoutableBlock: `${ula}:ffff::/64`,
  };
}
