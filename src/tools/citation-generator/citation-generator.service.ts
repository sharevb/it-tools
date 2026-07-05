interface Author { first?: string; last?: string }
interface CitationInput {
  authors?: Author[]
  year?: string
  title?: string
  publisher?: string
  url?: string
}

export function formatVancouverCitation(entry: CitationInput): string {
  const formatAuthor = (author: Author): string => {
    if (!author.last) {
      return '';
    }
    const initials = (author.first || '')
      .split(/\s+/)
      .map(name => name.charAt(0).toUpperCase())
      .join('');
    return `${author.last} ${initials}`;
  };

  const authors = Array.isArray(entry.authors) ? entry.authors.map(formatAuthor).filter(Boolean) : [];
  let authorStr = 'Anonymous';
  if (authors.length > 0) {
    authorStr = authors.length > 6
      ? `${authors.slice(0, 6).join(', ')}, et al`
      : authors.join(', ');
  }

  const title = entry.title?.trim() || '[No title]';
  const publisher = entry.publisher?.trim();
  const year = entry.year?.trim();
  const url = entry.url?.trim();

  let citation = `${authorStr}. ${title}.`;
  if (publisher) {
    citation += ` ${publisher};`;
  }
  if (year) {
    citation += ` ${year}.`;
  }
  if (url) {
    citation += ` Available from: ${url}`;
  }

  return citation;
}
