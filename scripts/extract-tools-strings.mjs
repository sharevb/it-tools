import fs from 'node:fs';
import path, { basename } from 'node:path';
import process from 'node:process';
import yaml from 'yaml';

const toolsDir = 'src/tools';
const localesFile = 'locales/en.yml';

// Load existing locales file or initialize an empty object
let localesData = {};
if (fs.existsSync(localesFile)) {
  localesData = yaml.parse(fs.readFileSync(localesFile, 'utf-8')) || {};
}

// Function to process Vue components in a directory
function processVueComponents(toolDir, toolName) {
  fs.readdirSync(toolDir)
    .filter(file => file.endsWith('.vue'))
    .forEach(file => processVueComponent(path.join(toolDir, file), toolName));
}

// Function to process a Vue component file
function processVueComponent(filePath, toolName) {
  console.log(`Processing ${filePath} in ${toolName}`);

  let content = fs.readFileSync(filePath, 'utf8');
  const origContent = content;

  // Update locales file with extracted name and description
  if (!localesData.tools) {
    localesData.tools = {};
  }
  if (!localesData.tools[toolName]) {
    localesData.tools[toolName] = {};
  }

  // Regex to find label or placeholder attributes
  let regex = /\b(label|text|message):\s*'((?:[^']|\\')+)'/g;
  content = content.replace(regex, (match, attr, text) => {
    if (!text?.trim()) {
      return match;
    }
    const key = (attr + '-' + text.replace(/[\p{P}\p{S}\s]+/gu, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-')).toLowerCase();
    if (!localesData.tools[toolName].texts) {
      localesData.tools[toolName].texts = {};
    }
    localesData.tools[toolName].texts[key] = text;
    return `${attr}: t('tools.${toolName}.texts.${key}')`;
  });

  if (filePath.endsWith('.vue')) {
    // Regex to find label or placeholder attributes
    regex = /(?<!:)((?:input-|output-)?(?:label|placeholder|title))="([^"]+)"/g;
    content = content.replace(regex, (match, attr, text) => {
      if (!text?.trim()) {
        return match;
      }
      const key = (attr + '-' + text.replace(/[\p{P}\p{S}\s]+/gu, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-')).toLowerCase();
      if (!localesData.tools[toolName].texts) {
        localesData.tools[toolName].texts = {};
      }
      localesData.tools[toolName].texts[key] = text;
      return `:${attr}="t('tools.${toolName}.texts.${key}')"`;
    });

    // Regex to find text inside HTML tags
    const textInsideTagsRegex = /(?<!=)\>(?:\n\s*)?([^\<\>\n]+)(?:\n\s*)?\</g;
    content = content.replace(textInsideTagsRegex, (match, text) => {
      if (!text?.trim()) {
        return match;
      }
      if (text.match(/[\}\{\|\[\<\>\]]/)) {
        return match;
      }
      const key = ('tag-' + text.trim().replace(/[\p{P}\p{S}\s]+/gu, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-')).toLowerCase();
      if (!localesData.tools[toolName].texts) {
        localesData.tools[toolName].texts = {};
      }
      localesData.tools[toolName].texts[key] = text.trim();
      return `>{{ t('tools.${toolName}.texts.${key}') }}<`;
    });
  }

  if (origContent === content) {
    console.log(`Nothing to extract in ${filePath}`);
    return;
  }

  if (filePath.endsWith('.vue')) {
    // Ensure the useI18n import exists
    if (!content.includes("const { t } = useI18n();")) {
      content = content.replace(/\<script setup( lang="ts")?\>/, "<script setup lang=\"ts\">\nimport { useI18n } from 'vue-i18n';\nconst { t } = useI18n();");
    }
  }
  else {
    // Ensure the useI18n import exists
    if (!content.includes("import { translate as t } from '@/plugins/i18n.plugin';")) {
      content = 'import { translate as t } from "@/plugins/i18n.plugin";\n' + content;
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

const localFileOrDir = process.argv[2];
if (localFileOrDir) {
  if (fs.statSync(localFileOrDir).isDirectory()) {
    fs.readdirSync(localFileOrDir)
      .filter((fileName) => {
        const filePath = path.join(localFileOrDir, fileName);
        return fs.statSync(filePath).isFile();
      })
      .forEach((fileName) => {
        const filePath = path.join(localFileOrDir, fileName);
        processVueComponent(filePath, process.argv[3] || basename(localFileOrDir));
      });
  } else {
    processVueComponent(localFileOrDir, process.argv[3] || basename(localFileOrDir));
  }
} else {
  fs.readdirSync(toolsDir)
    .filter((toolName) => {
      const toolPath = path.join(toolsDir, toolName);
      return fs.statSync(toolPath).isDirectory();
    })
    .forEach((toolName) => {
      const toolPath = path.join(toolsDir, toolName);
      console.log(`Processing tool: ${toolName}`);
      processVueComponents(toolPath, toolName);
    });
}

// Write back the updated locales file
fs.writeFileSync(localesFile, yaml.stringify(localesData), 'utf-8');
console.log('Locales file updated!');
console.log('Transformation completed!');
