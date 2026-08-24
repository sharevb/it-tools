import type { Config } from './random-line-picker.types';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getLines(config: Config) {
  return config.input ? config.input.split(/\n/) : [];
}

export function pickLines(config: Config) {
  const lines = getLines(config);
  const length = config.repeat ? config.count : Math.min(config.count, lines.length);

  return Array.from({ length }, (_, i) => {
    const index = getRandomInt(0, lines.length - 1);
    const line = config.repeat ? lines[index] : lines.splice(index, 1)[0];

    return line && config.prefix ? `${i + 1}. ${line}` : line;
  }).join('\n');
}
