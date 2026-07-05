function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c: string | undefined) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    return '';
  });
}

const dontEscape = '';
const escapeBackslash = '\\\\';
const escapeSingleQuote = '\'';
const escapeDoubleQuote = '"';
const defaultEscape = escapeBackslash + escapeSingleQuote + escapeDoubleQuote;
export const languages = [
  { id: 'raw', name: 'Raw Text', cr: '\n', start_quote: '', prefix: '', suffix: '', begin: '', end: '', escape: dontEscape },
  { id: 'bash', name: 'Bash', crlf: '\\n', start_quote: '"', prefix: 'echo ', suffix: '', begin: '', end: '', escape: escapeBackslash + escapeDoubleQuote },
  { id: 'pwsh', name: 'PowerShell', crlf: '\\n', start_quote: '"', prefix: 'Write-Output ', suffix: '', begin: '', end: '', escape: escapeBackslash + escapeSingleQuote },
  { id: 'c', name: 'C', crlf: '\\n', start_quote: '"', prefix: 'printf(', suffix: ');', suffix_eol: '\\n', begin: '#include <stdio.h>\n', end: '', escape: defaultEscape },
  { id: 'cpp', name: 'C++', crlf: '\\n', start_quote: '"', prefix: 'std::cout << ', suffix: ';', suffix_eol: '\\n', begin: '#include <iostream>\n', end: '', escape: defaultEscape },
  { id: 'csharp', name: 'C#', crlf: '\\n', start_quote: '"', prefix: 'Console.WriteLine(', suffix: ');', begin: 'using System;\n', end: '', escape: (l: string) => l.replace(/[\\'"]/g, (m: string) => `\\${m}`).replace(/\t/g, '\\t') },
  { id: 'csharp_verb', name: 'C# (Verbatim)', crlf: '" + "\\n" + @"', start_quote: '@"', end_quote: '"', prefix: 'Console.WriteLine(', suffix: ');', begin: 'using System;\n', end: '', escape: (l: string) => l.replace(/["]/g, '""').replace(/\t/g, '\\t') },
  { id: 'csharp_interf', name: 'C# (Interpolated)', crlf: '\\n', start_quote: '$"', end_quote: '"', prefix: 'Console.WriteLine(', suffix: ');', begin: 'using System;\n', end: '', escape: (l: string) => l.replace(/["{}]/g, (m: string) => m + m).replace(/\t/g, '\\t') },
  { id: 'csharp_raw', name: 'C# (Raw)', crlf: '\n', start_quote: '"""', prefix: 'Console.WriteLine(', suffix: ');', begin: 'using System;\n', end: '', escape: dontEscape },
  { id: 'vbnet', name: 'VB.Net', crlf: '" & vbCrLf & "', start_quote: '"', prefix: 'Console.WriteLine(', suffix: ')', begin: '', end: '', escape: (l: string) => l.replace(/"/g, '""') },
  { id: 'node', name: 'Node.js', crlf: '\\n', start_quote: '"', prefix: 'console.log(', suffix: ');', begin: '', end: '', escape: defaultEscape },
  { id: 'python', name: 'Python', crlf: '\\n', start_quote: '"', prefix: 'print(', suffix: ')', begin: '', end: '', escape: escapeBackslash + escapeDoubleQuote },
  { id: 'html', name: 'HTML', crlf: '<br />', start_quote: '', prefix: '', suffix: '', begin: '<pre>\n', end: '\n</pre>', escape: (l: string) => escapeXml(l) },
  { id: 'rust', name: 'Rust', crlf: '\\n', start_quote: '"', prefix: 'println!(', suffix: ');', begin: '', end: '', escape: defaultEscape },
  { id: 'go', name: 'Go', crlf: '\\n', start_quote: '"', prefix: 'fmt.Println(', suffix: ')', begin: 'import "fmt"\n', end: '', escape: defaultEscape },
  { id: 'ruby', name: 'Ruby', crlf: '\\n', start_quote: '"', prefix: 'puts ', suffix: '', begin: '', end: '', escape: defaultEscape },
  { id: 'php', name: 'PHP', crlf: '\\n', start_quote: '"', prefix: 'echo ', suffix: ';', suffix_eol: '\\n', begin: '<?php\n', end: '\n?>', escape: defaultEscape },
  { id: 'swift', name: 'Swift', crlf: '\\n', start_quote: '"', prefix: 'print(', suffix: ')', begin: '', end: '', escape: defaultEscape },
  { id: 'kotlin', name: 'Kotlin', crlf: '\\n', start_quote: '"', prefix: 'println(', suffix: ')', begin: '', end: '', escape: defaultEscape },
  { id: 'sql', name: 'SQL', crlf: '\' + CHAR(10 + \'', start_quote: '\'', prefix: 'SELECT ', suffix: '', suffix_eol: '\\n', begin: '', end: '', escape: (l: string) => l.replace(/'/g, '\'\'') },
  { id: 'java', name: 'Java', crlf: '\\n', start_quote: '"', prefix: 'System.out.println(', suffix: ');', begin: '', end: '', escape: defaultEscape },
];
export function printToLanguage(s: string, languageId: string) {
  const langConfig = languages.find(l => l.id === languageId);
  if (!langConfig) {
    return s;
  }

  return langConfig.begin + s.split('\n').map((line) => {
    return langConfig.prefix + escapeForLanguage(line, languageId,
      { suffix_eol: langConfig.suffix_eol || '' },
    ) + langConfig.suffix;
  }).join('\n') + langConfig.end;
}

export function escapeForLanguage(s: string, languageId: string,
  options: {
    suffix_eol?: string
    single_linize?: boolean
  }) {
  const langConfig = languages.find(l => l.id === languageId);
  if (!langConfig) {
    return s;
  }

  const escape = typeof langConfig.escape === 'function'
    ? langConfig.escape
    : function (line: string) {
      return langConfig.escape
        ? line.replace(new RegExp(`([${langConfig.escape}])`, 'g'), '\\$1')
        : line;
    };
  const escapeMultiLine = function (s: string) {
    const result = escape(s);
    if (!options.single_linize) {
      return result;
    }
    return result.replace(/\n/g, langConfig.crlf || '\\n');
  };
  return (options.single_linize ? [s] : s.split('\n')).map((line) => {
    return langConfig.start_quote + escapeMultiLine(line) + (options.suffix_eol || '') + (langConfig.end_quote || langConfig.start_quote);
  }).join('\n');
}
