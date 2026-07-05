// tests/generator.spec.ts
import { describe, expect, it } from 'vitest';
import { type GeneratorConfig, type HeaderStyle, generateMarkdown } from './markdown-lorem-ipsum.service';

const baseCfg: GeneratorConfig = {
  seedStr: 'seed-paris-2025',
  blocks: 8,
  avgSentencePerPara: 4,
  enableHeaders: true,
  enableLists: true,
  enableCode: true,
  enableBlockquotes: true,
  inlineEmphasis: true,
  inlineStrong: true,
  inlineLinks: true,
  inlineCode: true,
  headerStyle: 'atx',
  listStyle: 'unordered',
  headerFrequency: 0.25,
  listFrequency: 0.25,
  codeFrequency: 0.15,
  quoteFrequency: 0.15,
  language: 'English',
};

describe('generateMarkdown', () => {
  it('is deterministic for a given seed and config', () => {
    const a = generateMarkdown(baseCfg);
    const b = generateMarkdown({ ...baseCfg });
    expect(a).toEqual(b);
  });

  it('changes when seed changes', () => {
    const a = generateMarkdown(baseCfg);
    const b = generateMarkdown({ ...baseCfg, seedStr: 'seed-paris-2026' });
    expect(a).not.toEqual(b);
  });

  it('respects block count', () => {
    const cfg = { ...baseCfg, blocks: 12 };
    const out = generateMarkdown(cfg);
    const blocks = out.split(/\n{2,}/);
    expect(blocks.length).toBeGreaterThanOrEqual(12); // footnotes may add extra
  });

  it('emits ATX headers when configured', () => {
    const cfg = { ...baseCfg, headerStyle: 'atx' as HeaderStyle, seedStr: 'h-atx' };
    const out = generateMarkdown(cfg);
    expect(out).toMatch(/^#{1,6}\s.+/m);
  });

  it('emits setext headers when configured', () => {
    const cfg = { ...baseCfg, headerStyle: 'setext' as HeaderStyle, seedStr: 'h-setext' };
    const out = generateMarkdown(cfg);
    // Look for underline of = or - on next line
    expect(out).toMatch(/^[A-Z][^\n]+\n[=-]+$/m);
  });

  it('emits ordered and unordered lists per config', () => {
    const unordered = generateMarkdown({ ...baseCfg, listStyle: 'unordered', seedStr: 'list-u' });
    expect(unordered).toMatch(/^\s*[-*+]\s.+/m);

    const ordered = generateMarkdown({ ...baseCfg, listStyle: 'ordered', seedStr: 'list-o' });
    expect(ordered).toMatch(/^\s*\d+\.\s.+/m);
  });

  it('contains inline decorations when enabled', () => {
    const out = generateMarkdown({ ...baseCfg, seedStr: 'inline-on' });
    expect(out).toMatch(/`[^`\n]+`|\*\*[^\*\n]+\*\*|\*[^\*\n]+\*|\[[^\]]+\]\([^)]+\)/);
  });

  it('disables inline decorations when toggled off', () => {
    const out = generateMarkdown({
      ...baseCfg,
      seedStr: 'inline-off',
      inlineEmphasis: false,
      inlineStrong: false,
      inlineLinks: false,
      inlineCode: false,
    });
    expect(out).not.toMatch(/`[^`\n]+`|\*\*[^\*\n]+\*\*|\*[^\*\n]+\*|\[[^\]]+\]\([^)]+\)/);
  });

  it('can be skewed towards headers via frequency', () => {
    const cfg = { ...baseCfg, seedStr: 'freq-headers', headerFrequency: 0.8, listFrequency: 0.05, codeFrequency: 0.05, quoteFrequency: 0.05 };
    const out = generateMarkdown(cfg);
    const headers = out.match(/^#{1,6}\s.+|^[A-Z][^\n]+\n[=-]+$/gm) ?? [];
    expect(headers.length).toBeGreaterThan(3);
  });
});
