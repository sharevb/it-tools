export interface PasswordOptions {
  length: number;
  withLowercase: boolean;
  withUppercase: boolean;
  withNumbers: boolean;
  withSymbols: boolean;
  excludedChars?: string;
}

const characterSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
};

function randomIndex(length: number): number {
  const limit = Math.floor(0x100000000 / length) * length;
  const values = new Uint32Array(1);

  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % length;
}

function randomCharacter(characters: string): string {
  return characters[randomIndex(characters.length)];
}

function shuffle(characters: string[]): string {
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const targetIndex = randomIndex(index + 1);
    [characters[index], characters[targetIndex]] = [characters[targetIndex], characters[index]];
  }

  return characters.join('');
}

export function generatePassword(options: PasswordOptions): string {
  if (options.length < 4) {
    throw new RangeError('Password length must be at least 4 characters.');
  }

  const excludedChars = options.excludedChars ?? '';
  const selectedSets = [
    options.withLowercase ? characterSets.lowercase : '',
    options.withUppercase ? characterSets.uppercase : '',
    options.withNumbers ? characterSets.numbers : '',
    options.withSymbols ? characterSets.symbols : '',
  ]
    .filter(Boolean)
    .map(characters => characters.split('').filter(character => !excludedChars.includes(character)).join(''));

  if (selectedSets.length === 0) {
    throw new RangeError('Select at least one character type.');
  }

  if (selectedSets.some(characters => characters.length === 0)) {
    throw new RangeError('Excluded characters remove every character from an enabled type.');
  }

  if (options.length < selectedSets.length) {
    throw new RangeError('Password length is shorter than the enabled character types.');
  }

  const allCharacters = selectedSets.join('');
  const password = selectedSets.map(randomCharacter);

  while (password.length < options.length) {
    password.push(randomCharacter(allCharacters));
  }

  return shuffle(password);
}
