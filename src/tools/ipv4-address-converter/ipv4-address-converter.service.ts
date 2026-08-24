import * as _ from 'es-toolkit/compat';

export { ipv4ToInt, ipv4ToIpv6, isValidIpv4 };

function ipv4ToInt({ ip }: { ip: string }) {
  if (!isValidIpv4({ ip })) {
    return 0;
  }

  return ip
    .trim()
    .split('.')
    .reduce((acc, part, index) => acc + Number(part) * 256 ** (3 - index), 0);
}

function ipv4ToIpv6({ ip, prefix = '0000:0000:0000:0000:0000:ffff:' }: { ip: string; prefix?: string }) {
  if (!isValidIpv4({ ip })) {
    return '';
  }

  const hexParts = ip.trim().split('.').map(part => Number.parseInt(part).toString(16).padStart(2, '0'));
  return (
    prefix
    + _.chunk(hexParts, 2)
      .map(blocks => blocks.join(''))
      .join(':')
  );
}

function isValidIpv4({ ip }: { ip: string }) {
  const cleanIp = ip.trim();

  return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(cleanIp);
}
