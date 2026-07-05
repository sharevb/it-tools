import { parseLines } from '@/utils/objgen';

const indentString = '  ';
const htmlElements = {
  a: true,
  abbr: true,
  acronym: true,
  address: true,
  applet: true,
  area: true,
  article: true,
  aside: true,
  audio: true,
  b: true,
  base: true,
  basefont: true,
  bdi: true,
  bdo: true,
  bgsound: true,
  big: true,
  blink: true,
  blockquote: true,
  body: false,
  br: true,
  button: true,
  canvas: true,
  caption: true,
  center: true,
  cite: true,
  code: true,
  colgroup: true,
  command: true,
  data: true,
  datalist: true,
  dd: true,
  del: true,
  details: true,
  dfn: true,
  dir: true,
  div: true,
  dl: true,
  dt: true,
  em: true,
  embed: true,
  fieldset: true,
  figcaption: true,
  figure: true,
  font: true,
  footer: true,
  form: true,
  frame: true,
  frameset: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  head: true,
  header: true,
  hgroup: true,
  hr: true,
  html: false,
  i: true,
  iframe: true,
  img: true,
  input: true,
  ins: true,
  isindex: true,
  kbd: true,
  keygen: true,
  label: true,
  legend: true,
  li: true,
  link: true,
  listing: true,
  map: true,
  mark: true,
  marquee: true,
  menu: true,
  meta: true,
  meter: true,
  nav: true,
  nobr: true,
  noframes: true,
  noscript: true,
  object: true,
  ol: true,
  optgroup: true,
  option: true,
  output: true,
  p: true,
  param: true,
  plaintext: true,
  pre: true,
  progress: true,
  q: true,
  rp: true,
  rt: true,
  ruby: true,
  s: true,
  samp: true,
  script: false,
  section: true,
  select: true,
  small: true,
  source: true,
  spacer: true,
  span: true,
  strike: true,
  strong: true,
  style: true,
  sub: true,
  summary: true,
  sup: true,
  table: true,
  tbody: true,
  td: true,
  textarea: true,
  tfoot: true,
  th: true,
  thead: true,
  time: true,
  title: true,
  tr: true,
  track: true,
  tt: true,
  u: true,
  ul: true,
  var: true,
  video: true,
  wbr: true,
  xmp: true,
};

interface Element {
  kind: string
  id: string
  clazz: string[]
  content: string
  elements: Element[]
  attributes: string
}

export function xHtml(modelText: string) {
  const reggie = /([-\w]+)|(\.[-\w]+)|(#[-\w]+)|(\(.*?\))|(=.*$)/g;
  const elements: Element[] = [];
  let parents: Array<Element> = [];

  // parse the inbound model text
  parseLines(modelText, { numSpaces: 2 }, (line, depth) => {
    if (line.match('^s+$/|^/$|^//|^s.*/$|^s.*//') !== null) {
      return '';
    }

    const elem: Element = {
      kind: 'div',
      id: '',
      clazz: [],
      content: '',
      elements: [],
      attributes: '',
    };
    let parent: Element | null = null;
    if (depth === 1) {
      parent = null;
      parents = [];
      parents.push(elem);
    }
    else {
      while (parents.length > depth - 1) {
        parent = parents.pop()!;
      }
      parents.push(parent!);
      parents.push(elem);
    }

    if (parent === null) {
      elements.push(elem);
    }
    else {
      parent.elements.push(elem);
    }

    parents.push(elem);

    let matches = 0;
    let match = reggie.exec(line);

    while (match !== null) {
      matches += 1;
      if (matches === 1 && isHtmlElement(match[0])) {
        elem.kind = match[0];
      }
      else if (match[2]) {
        elem.clazz[elem.clazz.length] = match[0].replace(/\./, '');
      }
      else if (match[3]) {
        elem.id = match[0].replace(/#/, '');
      }
      else if (match[4]) {
        elem.attributes = match[0].replace(/^\(|\)$/g, '');
        elem.attributes = elem.attributes.trim().replace(/\s+/g, ' ');
      }
      else if (match[5]) {
        elem.content = match[0].replace(/=/, '').trim();
      }
      else {
        elem.clazz.push(match[0]);
      }

      match = reggie.exec(line);
    }
  });

  const h = genHtml(elements, 1);
  return h;
}

function genHtml(elements: Element[], depth: number) {
  if (depth == null) {
    depth = 1;
  }

  const t = indentString.repeat(depth);
  let result = '';

  for (let i = 0; i < elements.length; i++) {
    const e = elements[i];
    result += `${t}<${e.kind}`;
    if (hasContent(e.id)) {
      result += ` id="${e.id}"`;
    }

    if (hasContent(e.clazz)) {
      result += ` class="${e.clazz.join(' ')}"`;
    }

    if (hasContent(e.attributes)) {
      result += ` ${e.attributes}`;
    }

    result += '>';

    const hasChildren = hasContent(e.elements);

    if (hasContent(e.content)) {
      if (hasChildren) {
        result += `\n${t}${indentString}`;
      }
      result += e.content;
    }

    if (hasChildren) {
      result += `\n${genHtml(e.elements, depth + 1)}${t}`;
    }

    result += `</${e.kind}>\n`;
  }

  return result;
}

function hasContent(val: any[] | string) {
  return val && val.length > 0;
}

function isHtmlElement(val: string) {
  return Object.prototype.hasOwnProperty.call(htmlElements, val);
}
