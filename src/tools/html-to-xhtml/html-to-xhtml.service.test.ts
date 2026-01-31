import { describe, expect, it } from 'vitest';
import { toStrictXhtml } from './html-to-xhtml.service';

describe('toStrictXhtml', () => {
  it('self-closes all void elements', () => {
    const html = `
      <img src="a.png">
      <br>
      <hr>
      <input disabled>
      <meta charset="utf-8">
      <source src="x.mp4">
      <track kind="captions">
      <area href="#">
      <base href="/">
      <col>
      <embed src="x">
      <param name="p" value="v">
      <wbr>
    `;

    const out = toStrictXhtml(html);

    const expected = [
      '<img src="a.png" />',
      '<br />',
      '<hr />',
      '<input disabled="disabled" />',
      '<meta charset="utf-8" />',
      '<source src="x.mp4" />',
      '<track kind="captions" />',
      '<area href="#" />',
      '<base href="/" />',
      '<col />',
      '<embed src="x" />',
      '<param name="p" value="v" />',
      '<wbr />',
    ];

    for (const line of expected) {
      expect(out).toContain(line);
    }
  });

  it('injects namespace on root element when requested', () => {
    const html = '<html><body><p>Hello</p></body></html>';

    const out = toStrictXhtml(html, {
      addNamespace: true,
    });

    expect(out).toContain('<html xmlns="http://www.w3.org/1999/xhtml">');
  });

  it('applies indentation when indent option is provided', () => {
    const html = '<div><p>Hello</p></div>';

    const out = toStrictXhtml(html, { indent: 2 });

    expect(out).toBe(
`<div>
  <p>
    Hello
  </p>
</div>`,
    );
  });

  it('escapes XML entities in text and attributes', () => {
    const html = '<p title="5 > 3 & 2 < 4">5 > 3 & 2 < 4</p>';

    const out = toStrictXhtml(html);

    expect(out).toContain('title="5 &gt; 3 &amp; 2 &lt; 4"');
    expect(out).toContain('5 &gt; 3 &amp; 2 &lt; 4');
  });

  it('lowercases tag and attribute names', () => {
    const html = '<DIV CLASS="X"><IMG SRC="A.PNG"></DIV>';

    const out = toStrictXhtml(html);

    expect(out).toContain('<div class="X">');
    expect(out).toContain('<img src="A.PNG" />');
  });

  it('serializes comments correctly', () => {
    const html = '<div><!-- Test Comment --></div>';

    const out = toStrictXhtml(html);
    expect(out).toContain('<!-- Test Comment -->');
  });

  it('handles nested structures deterministically', () => {
    const html = '<ul><li>One</li><li>Two</li></ul>';

    const out = toStrictXhtml(html, { indent: 2 });

    expect(out).toBe(
`<ul>
  <li>
    One
  </li>
  <li>
    Two
  </li>
</ul>`,
    );
  });
});
