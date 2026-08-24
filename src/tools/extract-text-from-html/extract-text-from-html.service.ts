import { convert } from 'html-to-text';

function validateHtml(value: string) {
  const regex = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>|<([a-z][a-z0-9]*)\b[^\/]*\/>/gi;
  const matches = value.match(regex);

  return Boolean(matches !== null && matches.length);
}

function getTextFromHtml(value: string) {
  return convert(value);
}

export { validateHtml, getTextFromHtml };
