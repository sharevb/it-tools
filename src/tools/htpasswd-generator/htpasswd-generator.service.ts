import { hashSync } from 'bcryptjs';
import { encrypt } from 'unixcrypt-browser';
import md5 from 'apache-md5';
import { multiRandFromArray } from '@/utils/random';

const itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function generateHtpasswd({
  username,
  password,
  algorithm,
  salt = null,
  saltRounds = 10,
}: {
  username: string
  password: string
  algorithm: 'bcrypt' | 'md5' | 'apr1' | 'sha256' | 'sha512'
  salt?: string | null
  saltRounds?: number
}): string {
  const generateSalt = (length: number) => multiRandFromArray([...itoa64], length).join('');
  let hash: string;
  const finalSalt = salt || generateSalt(algorithm === 'sha512' ? 16 : 8);
  // eslint-disable-next-line no-control-regex
  const non_ascii = /[^\x00-\x7F]/;

  switch (algorithm) {
    case 'bcrypt':
      hash = hashSync(password, saltRounds);
      break;
    case 'md5':

      if (non_ascii.test(password)) {
        throw new Error('MD5 does not currently support non ASCII characters');
      }
      hash = md5(password, `$1$${finalSalt}`);
      break;
    case 'apr1':

      if (non_ascii.test(password)) {
        throw new Error('MD5 does not currently support non ASCII characters');
      }
      hash = md5(password, `$apr1$${finalSalt}`);
      break;
    case 'sha256':
      hash = encrypt(password, `$5$${finalSalt}`);
      break;
    case 'sha512':
      hash = encrypt(password, `$6$${finalSalt}`);
      break;
    default:
      throw new Error('Unsupported algorithm');
  }

  return `${username}:${hash}`;
}
