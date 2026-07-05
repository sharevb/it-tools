import _ from 'lodash';
import languageLorems from '../lorem-ipsum-generator/lorem-ipsum.i18n.json';

export type HeaderStyle = 'atx' | 'setext';
export type ListStyle = 'unordered' | 'ordered';

export interface GeneratorConfig {
  seedStr: string
  blocks: number
  avgSentencePerPara: number
  enableHeaders: boolean
  enableLists: boolean
  enableCode: boolean
  enableBlockquotes: boolean
  inlineEmphasis: boolean
  inlineStrong: boolean
  inlineLinks: boolean
  inlineCode: boolean
  headerStyle: HeaderStyle
  listStyle: ListStyle
  headerFrequency: number
  listFrequency: number
  codeFrequency: number
  quoteFrequency: number
  language: string
}

export function getSupportedLanguages() {
  return _.flatten(_.chain(languageLorems).map(l => l.languages).value()).sort();
}

export function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

export function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Chain = Record<string, string[]>;
function buildChain(words: string[]): Chain {
  const chain: Chain = {};
  for (let i = 0; i < words.length - 1; i++) {
    const w = words[i];
    const next = words[i + 1];
    if (!chain[w]) {
      chain[w] = [];
    }
    chain[w].push(next);
  }
  const last = words[words.length - 1];
  if (!chain[last]) {
    chain[last] = [];
  }
  chain[last].push(words[0]);
  return chain;
}

function nextWord(chain: Chain, current: string, rnd: () => number, latinWords: string[]): string {
  const candidates = chain[current] ?? latinWords;
  return candidates[Math.floor(rnd() * candidates.length)];
}

function getLoremWords(cfg: GeneratorConfig) {
  return _.find(languageLorems, ({ languages }) => languages.includes(cfg.language))?.loremIpsum?.split(' ') || [];
}

function capitalized(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function sentence(cfg: GeneratorConfig, chain: Chain, latinWords: string[], rnd: () => number, min = 6, max = 16): string {
  const len = Math.floor(rnd() * (max - min + 1)) + min;
  let w = latinWords[Math.floor(rnd() * latinWords.length)];
  const parts: string[] = [];
  for (let i = 0; i < len; i++) {
    let token = w;
    if (cfg.inlineCode && rnd() < 0.05) {
      token = `\`${token}\``;
    }
    if (cfg.inlineEmphasis && rnd() < 0.08) {
      token = `*${token}*`;
    }
    if (cfg.inlineStrong && rnd() < 0.06) {
      token = `**${token}**`;
    }
    if (cfg.inlineLinks && rnd() < 0.05) {
      token = `[${token}](https://example.com/${token})`;
    }
    parts.push(token);
    w = nextWord(chain, w, rnd, latinWords);
  }
  const body = parts.join(' ');
  const end = rnd() < 0.1 ? '?!' : (rnd() < 0.5 ? '.' : '!');
  return capitalized(body) + end;
}

function paragraph(cfg: GeneratorConfig, chain: Chain, rnd: () => number, latinWords: string[]): string {
  const sCount = Math.max(1, Math.round(cfg.avgSentencePerPara + (rnd() - 0.5) * 2));
  return Array.from({ length: sCount }).map(() => sentence(cfg, chain, latinWords, rnd)).join(' ');
}

function header(rnd: () => number, level: number, style: HeaderStyle, latinWords: string[]): string {
  const pick = () => capitalized(latinWords[Math.floor(rnd() * latinWords.length)]);
  const title = `${pick()} ${pick()} ${pick()}`;
  if (style === 'atx') {
    return `${'#'.repeat(Math.min(level, 6))} ${title}`;
  }
  else {
    const underline = level <= 1 ? '='.repeat(title.length) : '-'.repeat(title.length);
    return `${title}\n${underline}`;
  }
}

function listBlock(cfg: GeneratorConfig, rnd: () => number, latinWords: string[]): string {
  const items = Math.floor(rnd() * 5) + 3;
  const lines: string[] = [];
  const chain = buildChain(latinWords);
  for (let i = 0; i < items; i++) {
    const marker = cfg.listStyle === 'ordered'
      ? `${i + 1}.`
      : (rnd() < 0.33 ? '-' : (rnd() < 0.66 ? '*' : '+'));
    const text = sentence(cfg, chain, latinWords, rnd, 4, 10);
    lines.push(`${marker} ${text}`);
  }
  return lines.join('\n');
}

function codeBlock(rnd: () => number): string {
  const langs = ['ts', 'js', 'json', 'bash', 'md', 'python', 'csharp'];
  const lang = langs[Math.floor(rnd() * langs.length)];

  const samples: Record<string, string[]> = {
    ts: [
      'type User = { id: number; name: string }',
      'const users: User[] = []',
      'function addUser(u: User) { users.push(u) }',
      'addUser({ id: 1, name: "lorem" })',
    ],
    js: [
      'const arr = [1,2,3]',
      'arr.forEach(x => console.log(x))',
      'function square(n) { return n*n }',
      'console.log(square(5))',
    ],
    json: [
      '{',
      '  "id": 42,',
      '  "name": "ipsum",',
      '  "active": true',
      '}',
    ],
    bash: [
      '#!/bin/bash',
      'echo "Hello lorem"',
      'for i in {1..3}; do',
      '  echo "Item $i"',
      'done',
    ],
    md: [
      '# Sample Markdown',
      '',
      '- Item one',
      '- Item two',
      '',
      '> Blockquote lorem ipsum',
    ],
    python: [
      'def greet(name):',
      '    print(f"Hello {name}")',
      '',
      'for n in ["lorem", "ipsum"]:',
      '    greet(n)',
    ],
    csharp: [
      'public class Hello {',
      '  public static void Main() {',
      '    Console.WriteLine("Hello lorem");',
      '  }',
      '}',
    ],
  };

  const body = samples[lang].join('\n');
  return `\`\`\`${lang}\n${body}\n\`\`\``;
}

function blockquote(cfg: GeneratorConfig, rnd: () => number, latinWords: string[]): string {
  const lines = Math.floor(rnd() * 3) + 1;
  const chain = buildChain(latinWords);
  return Array.from({ length: lines })
    .map(() => `> ${sentence(cfg, chain, latinWords, rnd, 6, 12)}`)
    .join('\n');
}

export function generateMarkdown(cfg: GeneratorConfig): string {
  const latinWords = getLoremWords(cfg);
  const rnd = mulberry32(hashSeed(cfg.seedStr));
  const chain = buildChain(latinWords);
  const blocks: string[] = [];
  let currentHeaderLevel = 1;

  for (let i = 0; i < cfg.blocks; i++) {
    const roll = rnd();
    if (cfg.enableHeaders && roll < cfg.headerFrequency) {
      const nextHeader = header(rnd, currentHeaderLevel, cfg.headerStyle, latinWords);
      blocks.push(nextHeader);
      // update currentHeaderLevel realistically
      if (currentHeaderLevel === 1) {
        currentHeaderLevel = rnd() < 0.7 ? 2 : 1;
      }
      else if (currentHeaderLevel === 2) {
        currentHeaderLevel = rnd() < 0.5 ? 3 : 1;
      }
      else {
        currentHeaderLevel = rnd() < 0.6 ? 2 : 1;
      }
      blocks.push(paragraph(cfg, chain, rnd, latinWords));
    }
    else if (cfg.enableLists && roll < cfg.headerFrequency + cfg.listFrequency) {
      blocks.push(listBlock(cfg, rnd, latinWords));
    }
    else if (cfg.enableCode && roll < cfg.headerFrequency + cfg.listFrequency + cfg.codeFrequency) {
      blocks.push(codeBlock(rnd));
    }
    else if (cfg.enableBlockquotes
               && roll < cfg.headerFrequency + cfg.listFrequency + cfg.codeFrequency + cfg.quoteFrequency) {
      blocks.push(blockquote(cfg, rnd, latinWords));
    }
    else {
      blocks.push(paragraph(cfg, chain, rnd, latinWords));
    }
  }

  if (cfg.inlineLinks && rnd() < 0.3) {
    blocks.push('[lorem]: https://example.com/lorem');
    blocks.push('[ipsum]: https://example.com/ipsum');
  }

  return blocks.join('\n\n');
}
