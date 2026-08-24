import { shuffleString } from '@/utils/random';

export function createToken({
  withUppercase = true,
  withLowercase = true,
  withNumbers = true,
  withHexaNumbers = false,
  withSymbols = false,
  deniedChars = '',
  allowAmbiguousChars = false,
  length = 64,
  alphabet,
}: {
  withUppercase?: boolean;
  withLowercase?: boolean;
  withNumbers?: boolean;
  withHexaNumbers?: boolean;
  withSymbols?: boolean;
  deniedChars?: string;
  allowAmbiguousChars?: boolean;
  length?: number;
  alphabet?: string;
}) {
  const allDeniedChars = deniedChars + (allowAmbiguousChars ? '' : 'Oo01lI'); // Deny visually similar characters if not allowed
  const allAlphabet = (
    alphabet ??
    (withUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '') +
      (withLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '') +
      (withNumbers ? '0123456789' : '') +
      (withHexaNumbers ? '0123456789abcdef' : '') +
      (withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '')
  )
    .split('')
    .filter((c) => !allDeniedChars?.includes(c))
    .join('');

  const len = length < 1 ? 1 : length;
  return shuffleString(allAlphabet.repeat(len)).substring(0, len);
}
