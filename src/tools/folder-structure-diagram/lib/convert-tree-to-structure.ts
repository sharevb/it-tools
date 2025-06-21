import { LINE_STRINGS } from './line-strings';

export default function convertTreeToStructure(tree: string): string {
  const treeLines = tree.split('\n').filter(line => line.trim());

  if (treeLines.length === 0) {
    return '';
  }

  // Detect charset by checking for unicode box drawing characters (U+2500 to U+257F)
  const charset = treeLines.some(line => /[\u2500-\u257F]/.test(line)) ? 'utf-8' : 'ascii';
  const lines = LINE_STRINGS[charset];

  // Create a single regex to match all tree connectors
  const treeConnectorRegex = new RegExp(`(${lines.CHILD}|${lines.LAST_CHILD})`, 'g');

  return treeLines
    .flatMap((line) => {
      // Find the last tree connector to determine depth and extract name
      const matches = [...line.matchAll(treeConnectorRegex)];

      if (matches.length === 0) {
        // No tree connectors found - likely root or invalid line
        return []; // Return empty array instead of null or empty string so the flatMap filters it out and doesn't leave unnecessary empty lines
      }

      const lastMatch = matches[matches.length - 1];
      const connectorEnd = lastMatch.index! + lastMatch[0].length;

      // Calculate depth (assuming 4 characters per level)
      const depth = Math.floor(lastMatch.index / 4);

      // Extract folder name after the last connector
      let folderName = line.substring(connectorEnd);

      // When the folder name is an empty string (because it was created with "- ") or starts with a space, add a dash and space
      // to preserve the empty tree connector or the spaces before actual text characters in the folder name
      if (folderName === '' || folderName.startsWith(' ')) {
        folderName = `- ${folderName}`;
      }

      // Create indented structure (2 spaces per level)
      return [`${' '.repeat(depth * 2)}${folderName}`];
    })
    .join('\n');
}
