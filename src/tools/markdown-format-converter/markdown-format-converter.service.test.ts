import { describe, expect, it } from 'vitest';
import { convertMarkdown } from './markdown-format-converter.service';

describe('markdown-format-converter', () => {
  describe('Standard elements conversion', () => {
    const input =
      '# Heading 1\nThis is **bold** and *italic* and ~~strikethrough~~.\nHere is `inline code`.\n\n[Google](https://google.com)';

    it('should convert standard elements to Slack format', () => {
      const output = convertMarkdown(input, 'slack');
      expect(output).toContain('*Heading 1*');
      expect(output).toContain('*bold*');
      expect(output).toContain('_italic_');
      expect(output).toContain('~strikethrough~');
      expect(output).toContain('<https://google.com|Google>');
    });

    it('should convert standard elements to Discord format', () => {
      const output = convertMarkdown(input, 'discord');
      expect(output).toContain('# Heading 1');
      expect(output).toContain('**bold**');
      expect(output).toContain('*italic*');
      expect(output).toContain('~~strikethrough~~');
      expect(output).toContain('[Google](https://google.com)');
    });

    it('should convert standard elements to Jira format', () => {
      const output = convertMarkdown(input, 'jira');
      expect(output).toContain('h1. Heading 1');
      expect(output).toContain('*bold*');
      expect(output).toContain('_italic_');
      expect(output).toContain('-strikethrough-');
      expect(output).toContain('[Google|https://google.com]');
    });

    it('should convert standard elements to GitHub format', () => {
      const output = convertMarkdown(input, 'github');
      expect(output).toContain('# Heading 1');
      expect(output).toContain('**bold**');
      expect(output).toContain('*italic*');
      expect(output).toContain('~~strikethrough~~');
      expect(output).toContain('[Google](https://google.com)');
    });
  });

  describe('Wikilink conversion', () => {
    const input1 = 'Check [[My Page]] for info.';
    const input2 = 'Check [[My Page|Alternate Text]] for info.';

    it('should convert wikilink with Slack format', () => {
      expect(convertMarkdown(input1, 'slack')).toContain('*My Page*');
      expect(convertMarkdown(input2, 'slack')).toContain('*Alternate Text*');
    });

    it('should convert wikilink with Jira format', () => {
      expect(convertMarkdown(input1, 'jira')).toContain('[My Page|My Page]');
      expect(convertMarkdown(input2, 'jira')).toContain('[Alternate Text|My Page]');
    });

    it('should convert wikilink with GitHub format', () => {
      expect(convertMarkdown(input1, 'github')).toContain('[My Page](my-page)');
      expect(convertMarkdown(input2, 'github')).toContain('[Alternate Text](my-page)');
    });

    it('should convert wikilink with Obsidian format', () => {
      expect(convertMarkdown(input1, 'obsidian')).toContain('[[My Page]]');
      expect(convertMarkdown(input2, 'obsidian')).toContain('[[My Page|Alternate Text]]');
    });
  });

  describe('Callout conversion', () => {
    const input = '> [!info] Tip of the day\n> This is some callout body content.\n> Line 2 of callout.';

    it('should convert callout to Slack blockquotes', () => {
      const output = convertMarkdown(input, 'slack');
      expect(output).toContain('> *[INFO] Tip of the day*');
      expect(output).toContain('> This is some callout body content.');
    });

    it('should convert callout to Jira panel macro', () => {
      const output = convertMarkdown(input, 'jira');
      expect(output).toContain(
        '{panel:title=Tip of the day|borderStyle=solid|borderColor=#3572b0|titleBGColor=#cbe3ff|bgColor=#e0f0ff}',
      );
      expect(output).toContain('This is some callout body content.');
      expect(output).toContain('{panel}');
    });

    it('should convert callout to GitHub native alerts', () => {
      const output = convertMarkdown(input, 'github');
      expect(output).toContain('> [!NOTE] > **Tip of the day**');
      expect(output).toContain('> This is some callout body content.');
    });

    it('should preserve callout in Obsidian strategy', () => {
      const output = convertMarkdown(input, 'obsidian');
      expect(output).toContain('> [!info] Tip of the day');
      expect(output).toContain('> This is some callout body content.');
    });
  });

  describe('Lists conversion', () => {
    it('should convert ordered lists correctly in standard formats', () => {
      const input = '1. First item\n2. Second item\n3. Third item';
      
      const githubOutput = convertMarkdown(input, 'github');
      expect(githubOutput).toContain('1. First item');
      expect(githubOutput).toContain('2. Second item');
      expect(githubOutput).toContain('3. Third item');

      const jiraOutput = convertMarkdown(input, 'jira');
      expect(jiraOutput).toContain('# First item');
      expect(jiraOutput).toContain('# Second item');
      expect(jiraOutput).toContain('# Third item');
    });

    it('should convert nested lists with correct indentation', () => {
      const input = '- Parent item\n  - Child item 1\n  - Child item 2';
      const output = convertMarkdown(input, 'github');
      expect(output).toContain('- Parent item');
      expect(output).toContain('  - Child item 1');
      expect(output).toContain('  - Child item 2');
    });

    it('should convert standard elements to Logseq outliner format', () => {
      const input = '# Heading 1\nThis is a paragraph.\n1. Item 1\n2. Item 2';
      const output = convertMarkdown(input, 'logseq');
      expect(output).toContain('- # Heading 1');
      expect(output).toContain('- This is a paragraph.');
      expect(output).toContain('- 1. Item 1');
      expect(output).toContain('- 2. Item 2');
    });

    it('should convert loose ordered lists correctly without shifting the content to the next line', () => {
      const input = `1. **Item 1**\n   - Detail 1\n\n2. **Item 2**\n   - Detail 2`;
      const output = convertMarkdown(input, 'github');
      expect(output).toContain('1. **Item 1**\n  - Detail 1');
      expect(output).toContain('2. **Item 2**\n  - Detail 2');
    });

    it('should unescape special characters like single quotes in the final output', () => {
      const input = "Jira's native prefix";
      const output = convertMarkdown(input, 'jira');
      expect(output).toContain("Jira's");
    });
  });
});
