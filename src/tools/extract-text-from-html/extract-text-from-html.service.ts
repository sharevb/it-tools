import { convert } from 'html-to-text';

function validateHtml(value: string) {
  try {
    new DOMParser().parseFromString(value, 'text/html');
  }
  catch (error) {
    return false;
  }

  const regex = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>|<([a-z][a-z0-9]*)\b[^\/]*\/>/gi;
  const matches = value.match(regex);

  return Boolean(matches !== null && matches.length);
}

function getTextFromHtml(value: string) {
  return convert(value);
}

export { validateHtml, getTextFromHtml };
