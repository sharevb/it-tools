import _ from 'lodash';

export { getPasswordCrackTimeEstimation, getCharsetLength };

import { translate as t } from '@/plugins/i18n.plugin';

function prettifyExponentialNotation(exponentialNotation: number) {
  const [base, exponent] = exponentialNotation.toString().split('e');
  const baseAsNumber = Number.parseFloat(base);
  const prettyBase = baseAsNumber % 1 === 0 ? baseAsNumber.toLocaleString() : baseAsNumber.toFixed(2);
  return exponent ? `${prettyBase}e${exponent}` : prettyBase;
}

function getHumanFriendlyDuration({ seconds }: { seconds: number }) {
  if (seconds <= 0.001) {
    return t('tools.password-strength-analyser.service.text.instantly');
  }

  if (seconds <= 1) {
    return t('tools.password-strength-analyser.service.text.less-than-a-second');
  }

  const timeUnits = [
    { unit: t('tools.password-strength-analyser.service.text.millenium'), secondsInUnit: 31536000000, format: prettifyExponentialNotation, plural: t('tools.password-strength-analyser.service.text.millennia') },
    { unit: t('tools.password-strength-analyser.service.text.century'), secondsInUnit: 3153600000, plural: t('tools.password-strength-analyser.service.text.centuries') },
    { unit: t('tools.password-strength-analyser.service.text.decade'), secondsInUnit: 315360000, plural: t('tools.password-strength-analyser.service.text.decades') },
    { unit: t('tools.password-strength-analyser.service.text.year'), secondsInUnit: 31536000, plural: t('tools.password-strength-analyser.service.text.years') },
    { unit: t('tools.password-strength-analyser.service.text.month'), secondsInUnit: 2592000, plural: t('tools.password-strength-analyser.service.text.months') },
    { unit: t('tools.password-strength-analyser.service.text.week'), secondsInUnit: 604800, plural: t('tools.password-strength-analyser.service.text.weeks') },
    { unit: t('tools.password-strength-analyser.service.text.day'), secondsInUnit: 86400, plural: t('tools.password-strength-analyser.service.text.days') },
    { unit: t('tools.password-strength-analyser.service.text.hour'), secondsInUnit: 3600, plural: t('tools.password-strength-analyser.service.text.hours') },
    { unit: t('tools.password-strength-analyser.service.text.minute'), secondsInUnit: 60, plural: t('tools.password-strength-analyser.service.text.minutes') },
    { unit: t('tools.password-strength-analyser.service.text.second'), secondsInUnit: 1, plural: t('tools.password-strength-analyser.service.text.seconds') },
  ];

  return _.chain(timeUnits)
    .map(({ unit, secondsInUnit, plural, format = _.identity }) => {
      const quantity = Math.floor(seconds / secondsInUnit);
      seconds %= secondsInUnit;

      if (quantity <= 0) {
        return undefined;
      }

      const formattedQuantity = format(quantity);
      return `${formattedQuantity} ${quantity > 1 ? plural : unit}`;
    })
    .compact()
    .take(2)
    .join(', ')
    .value();
}

function getPasswordCrackTimeEstimation({ password, guessesPerSecond = 1e9 }: { password: string; guessesPerSecond?: number }) {
  const charsetLength = getCharsetLength({ password });
  const passwordLength = password.length;

  const entropy = password === '' ? 0 : Math.log2(charsetLength) * passwordLength;

  const secondsToCrack = 2 ** entropy / guessesPerSecond;

  const crackDurationFormatted = getHumanFriendlyDuration({ seconds: secondsToCrack });

  const score = Math.min(entropy / 128, 1);

  return {
    entropy,
    charsetLength,
    passwordLength,
    crackDurationFormatted,
    secondsToCrack,
    score,
  };
}

function getCharsetLength({ password }: { password: string }) {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /\W|_/.test(password);

  let charsetLength = 0;

  if (hasLowercase) {
    charsetLength += 26;
  }
  if (hasUppercase) {
    charsetLength += 26;
  }
  if (hasDigits) {
    charsetLength += 10;
  }
  if (hasSpecialChars) {
    charsetLength += 32;
  }

  return charsetLength;
}
