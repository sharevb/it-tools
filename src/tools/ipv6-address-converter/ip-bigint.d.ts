declare module 'ip-bigint' {
  type IPInfo = {
    number: bigint;
    version: number;
    ipv4mapped?: boolean;
    scopeid?: string;
  };
  type StringifyOptions = {
    compress?: boolean;
    hexify?: boolean;
  };

  export function normalizeIp(ip: string, options?: StringifyOptions): string;
  export function stringifyIp(ip: IPInfo, options?: StringifyOptions): string;
  export function ipVersion(ip: string): number;
  export function parseIp(ip): IPInfo;
}
