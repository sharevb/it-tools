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

function processFile(filePath) {
  const parentDir = path.basename(path.dirname(filePath)); // Get parent directory name
  const originalContent = fs.readFileSync(filePath, 'utf-8');

  // Extract existing name and description values
  const nameMatch = originalContent.match(/name: '(.*?)'/);
  const descriptionMatch = originalContent.match(/description: '(.*?)'/);

  if (!nameMatch || !descriptionMatch) {
    console.warn(`Skipping ${filePath}: Unable to extract name or description.`);
    return;
  }

  const nameValue = nameMatch[1];
  const descriptionValue = descriptionMatch[1];

  // Modify name and description to use the translate function
  const transformedContent = originalContent
    .replace(/name: '((?:[^']+|(?<=\\)')+)'/, `name: t('tools.${parentDir}.title')`)
    .replace(/description: '((?:[^']+|(?<=\\)')+)'/, `description: t('tools.${parentDir}.description')`);

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
