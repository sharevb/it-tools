import { shuffleString } from '@/utils/random';

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withHexaNumbers = false,
  withSymbols = false,
  deniedChars = '',
  length = 64,
  alphabet,
}: {
  withUppercase?: boolean
  withLowercase?: boolean
  withNumbers?: boolean
  withHexaNumbers?: boolean
  withSymbols?: boolean
  deniedChars?: string
  length?: number
  alphabet?: string
}) {
  const allAlphabet = (alphabet ?? (
    (withUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '')
    + (withLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '')
    + (withNumbers ? '0123456789' : '')
    + (withHexaNumbers ? '0123456789abcdef' : '')
    + (withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '')
  )).split('').filter(c => !(deniedChars?.includes(c))).join('');

  const len = length < 1 ? 1 : length;
  return shuffleString(allAlphabet.repeat(len)).substring(0, len);
}
