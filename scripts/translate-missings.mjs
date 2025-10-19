import { promises as fs } from "fs";
import path from 'node:path';
import yaml from 'yaml';
import dotenv from 'dotenv';
import axios from 'axios';
import { Command } from 'commander';

dotenv.config();

const program = new Command();
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_ENDPOINT = 'https://translation.googleapis.com/language/translate/v2';

if (!GOOGLE_TRANSLATE_API_KEY) {
  console.error('❌ Missing GOOGLE_TRANSLATE_API_KEY environment variable');
  process.exit(1);
}

program
  .name('translate-yaml')
  .description('Sync and translate YAML files using Google Translate')
  .requiredOption('-e, --english <file>', 'English YAML file')
  .requiredOption('-t, --targets <files...>', 'Target language YAML files')
  .option('--dry-run', 'Count characters to translate without sending API requests')
  .parse(process.argv);

const options = program.opts();

async function translateText(text, targetLang) {
  const response = await axios.post(TRANSLATE_ENDPOINT, null, {
    params: {
      q: text,
      target: targetLang,
      key: GOOGLE_TRANSLATE_API_KEY,
    },
  });
  return response.data.data.translations[0].translatedText;
}

function flattenYaml(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenYaml(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

function unflattenYaml(flat) {
  const result = {};
  for (const [key, value] of Object.entries(flat)) {
    const keys = key.split('.');
    let current = result;
    keys.forEach((k, i) => {
      if (i === keys.length - 1) {
        current[k] = value;
      } else {
        current[k] = current[k] || {};
        current = current[k];
      }
    });
  }
  return result;
}

async function syncTranslations(englishFile, targetFiles, dryRun = false) {
  const englishYaml = yaml.parse(await fs.readFile(englishFile, 'utf8'));
  const englishFlat = flattenYaml(englishYaml);

  let totalChars = 0;

  for (const file of targetFiles) {
    const langCode = path.basename(file, '.yml');
    if (langCode === 'en') {
      continue;
    }
    const targetYaml = yaml.parse(await fs.readFile(file, 'utf8')) || {};
    const targetFlat = flattenYaml(targetYaml);

    const updatedFlat = { ...targetFlat };
    let langCharCount = 0;

    for (const [key, englishText] of Object.entries(englishFlat)) {
      const needsTranslation = !targetFlat[key];
      if (needsTranslation) {
        if (dryRun) {
          langCharCount += englishText.length;
        } else {
          const translated = await translateText(englishText, langCode);
          updatedFlat[key] = translated;
          console.log(`Translated [${key}] to ${langCode}: ${translated}`);
        }
      }
    }

    if (dryRun) {
      console.log(`Dry run for ${langCode}: ${langCharCount} characters to translate.`);
      totalChars += langCharCount;
    } else {
      const updatedYaml = unflattenYaml(updatedFlat);
      await fs.writeFile(file, yaml.stringify(updatedYaml), 'utf8');
    }
  }

  if (dryRun) {
    console.log(`Total characters across all languages: ${totalChars}`);
  }
}

syncTranslations(options.english, options.targets, options.dryRun)
  .then(() => console.log(options.dryRun ? 'Dry run complete.' : 'Translation sync complete.'))
  .catch(console.error);
