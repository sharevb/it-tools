import { describe, expect, it } from 'vitest';

import { formatVancouverCitation } from './citation-generator.service'; // adjust path as needed

describe('formatVancouverCitation', () => {
  it('formats a single author with initials', () => {
    const entry = {
      authors: [{ first: 'John', last: 'Doe' }],
      year: '2021',
      title: 'Sample Title',
      publisher: 'Publisher',
      url: 'https://example.com',
    };
    expect(formatVancouverCitation(entry)).toBe(
      'Doe J. Sample Title. Publisher; 2021. Available from: https://example.com',
    );
  });

  it('formats multiple authors correctly', () => {
    const entry = {
      authors: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Smith' },
      ],
      year: '2020',
      title: 'Multi Author Work',
      publisher: 'TechPress',
    };
    expect(formatVancouverCitation(entry)).toBe('Doe J, Smith J. Multi Author Work. TechPress; 2020.');
  });

  it('uses et al. when more than 6 authors', () => {
    const entry = {
      authors: [
        { first: 'A', last: 'One' },
        { first: 'B', last: 'Two' },
        { first: 'C', last: 'Three' },
        { first: 'D', last: 'Four' },
        { first: 'E', last: 'Five' },
        { first: 'F', last: 'Six' },
        { first: 'G', last: 'Seven' },
      ],
      year: '2019',
      title: 'Big Team Paper',
      publisher: 'SciencePub',
    };
    expect(formatVancouverCitation(entry)).toBe(
      'One A, Two B, Three C, Four D, Five E, Six F, et al. Big Team Paper. SciencePub; 2019.',
    );
  });

  it('handles multiple initials in first name', () => {
    const entry = {
      authors: [{ first: 'John Michael', last: 'Doe' }],
      title: 'Initials Test',
    };
    expect(formatVancouverCitation(entry)).toBe('Doe JM. Initials Test.');
  });

  it('falls back to Anonymous if no authors', () => {
    const entry = {
      title: 'No Author Work',
      year: '2022',
    };
    expect(formatVancouverCitation(entry)).toBe('Anonymous. No Author Work. 2022.');
  });

  it('handles missing title gracefully', () => {
    const entry = {
      authors: [{ first: 'Jane', last: 'Smith' }],
      year: '2023',
    };
    expect(formatVancouverCitation(entry)).toBe('Smith J. [No title]. 2023.');
  });

  it('handles missing publisher and year', () => {
    const entry = {
      authors: [{ first: 'Jane', last: 'Smith' }],
      title: 'Untimed Work',
    };
    expect(formatVancouverCitation(entry)).toBe('Smith J. Untimed Work.');
  });
});
