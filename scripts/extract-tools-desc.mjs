import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';

const toolsDir = 'src/tools';
const localesFile = 'locales/en.yml';

// Load existing locales file or initialize an empty object
let localesData = {};
if (fs.existsSync(localesFile)) {
  localesData = yaml.parse(fs.readFileSync(localesFile, 'utf-8')) || {};
}

// Single-quoted JS string that may contain escaped quotes. `[^'\\]|\\.` cannot overlap, so it cannot backtrack exponentially.
const quotedValue = (key) => new RegExp(`\\b${key}: '((?:[^'\\\\]|\\\\.)*)'`);
// Decode JS string escapes (\n, \x27, \u00e9, \u{1F600}, \') the way the JS parser would
const JS_ESCAPES = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', 0: '\0' };
const unescapeValue = (value) =>
  value.replace(/\\(?:u\{([\da-fA-F]+)\}|u([\da-fA-F]{4})|x([\da-fA-F]{2})|(.))/g, (_, codePoint, u4, x2, char) =>
    char === undefined ? String.fromCodePoint(Number.parseInt(codePoint ?? u4 ?? x2, 16)) : (JS_ESCAPES[char] ?? char));

function processFile(filePath) {
  const parentDir = path.basename(path.dirname(filePath)); // Get parent directory name
  const originalContent = fs.readFileSync(filePath, 'utf-8');

  // Extract existing name and description values
  const nameMatch = originalContent.match(quotedValue('name'));
  const descriptionMatch = originalContent.match(quotedValue('description'));
  const externAccessDescriptionMatch = originalContent.match(quotedValue('externAccessDescription'));

  if (!nameMatch || !descriptionMatch) {
    console.warn(`Skipping ${filePath}: Unable to extract name or description.`);
    return;
  }

  const nameValue = unescapeValue(nameMatch[1]);
  const descriptionValue = unescapeValue(descriptionMatch[1]);
  const externAccessDescriptionValue = externAccessDescriptionMatch ? unescapeValue(externAccessDescriptionMatch[1]) : null;

  // Modify name and description to use the translate function
  const transformedContent = originalContent
    .replace(quotedValue('name'), `name: t('tools.${parentDir}.title')`)
    .replace(quotedValue('description'), `description: t('tools.${parentDir}.description')`)
    .replace(quotedValue('externAccessDescription'), `externAccessDescription: t('tools.${parentDir}.externalAccess')`);

  fs.writeFileSync(filePath, `import { translate as t } from '@/plugins/i18n.plugin';\n${transformedContent}`, 'utf-8');
  console.log(`Transformed: ${filePath}`);

  // Update locales file with extracted name and description
  if (!localesData.tools) {
    localesData.tools = {};
  }
  localesData.tools[parentDir] = {
    ...localesData.tools[parentDir],
    title: nameValue,
    description: descriptionValue,
    externalAccess: externAccessDescriptionValue,
  };
}

function iterateFolder(folderPath) {
  const items = fs.readdirSync(folderPath);

  items.forEach((item) => {
    const itemPath = path.join(folderPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      iterateFolder(itemPath);
    }
    else if (item === 'index.ts') {
      processFile(itemPath);
    }
  });
}

// Run transformations
iterateFolder(toolsDir);

// Write back the updated locales file
fs.writeFileSync(localesFile, yaml.stringify(localesData), 'utf-8');
console.log('Locales file updated!');
console.log('Transformation completed!');
