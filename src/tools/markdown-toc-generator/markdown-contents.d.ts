declare module 'markdown-contents' {
  class MarkdownContents {
    markdown(): string;
  }
  export default function Create(markdown: string): MarkdownContents;
}
