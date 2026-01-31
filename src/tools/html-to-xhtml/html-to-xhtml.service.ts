import { DomUtils, parseDocument } from 'htmlparser2';

export interface XhtmlOptions {
  addNamespace?: boolean // add http://www.w3.org/1999/xhtml
  indent?: number // number of spaces per indent level
}

export function toStrictXhtml(html: string, options: XhtmlOptions = {}): string {
  // FULL canonical void element list
  const voidElements = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
    'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
  ]);

  const escapeXml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const indentSize = options.indent ?? 0;
  const indentStr = (level: number) =>
    indentSize > 0 ? ' '.repeat(level * indentSize) : '';

  const serialize = (node: any, level = 0): string => {
    if (DomUtils.isText(node)) {
      const text = escapeXml(node.data);
      return indentSize > 0 ? indentStr(level) + text : text;
    }

    if (DomUtils.isComment(node)) {
      const comment = `<!--${escapeXml(node.data)}-->`;
      return indentSize > 0 ? indentStr(level) + comment : comment;
    }

    if (DomUtils.isTag(node)) {
      const tag = node.name.toLowerCase();

      // Attributes
      const attrsObj = { ...(node.attribs || {}) };

      // Inject namespace on root element if requested
      if (options.addNamespace && node.parent?.type === 'root') {
        attrsObj.xmlns = 'http://www.w3.org/1999/xhtml';
      }

      const attrs = Object.entries(attrsObj)
        .map(([k, v]) => `${k.toLowerCase()}="${escapeXml(String(v || k.toLowerCase()))}"`)
        .join(' ');

      const open = attrs ? `<${tag} ${attrs}` : `<${tag}`;

      // VOID ELEMENT → self-close
      if (voidElements.has(tag)) {
        const line = `${open} />`;
        return indentSize > 0 ? indentStr(level) + line : line;
      }

      // NORMAL ELEMENT
      const children = (node.children || [])
        .map(child => serialize(child, level + 1))
        .join(indentSize > 0 ? '\n' : '');

      if (indentSize > 0) {
        if (children.trim().length === 0) {
          return `${indentStr(level)}${open}></${tag}>`;
        }
        return `${indentStr(level)}${open}>\n${children}\n${indentStr(level)}</${tag}>`;
      }

      return `${open}>${children}</${tag}>`;
    }

    return '';
  };

  const doc = parseDocument(html);

  return doc.children
    .map(node => serialize(node, 0))
    .join(indentSize > 0 ? '\n' : '');
}
