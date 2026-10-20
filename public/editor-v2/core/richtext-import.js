import { validatedLinkHref } from './richtext-links.js';
import { RICH_TEXT_FONT_FAMILIES } from './schema.js';

const MAX_CLIPBOARD_CHARS = 250_000;
const MAX_TABLE_ROWS = 100;
const MAX_TABLE_COLUMNS = 24;
const MARK_ORDER = ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code'];

function normalizeColor(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  const hex = raw.match(/^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i);
  if (hex) return `#${hex[1].toLowerCase()}`;
  const rgb = raw.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i);
  if (!rgb || rgb.slice(1, 4).some(channel => Number(channel) > 255)) return null;
  return `#${rgb.slice(1, 4).map(channel => Number(channel).toString(16).padStart(2, '0')).join('')}`;
}

function safeFontFamily(value) {
  const candidates = String(value ?? '').split(',').map(item => item.trim().replace(/^['\"]|['\"]$/g, ''));
  return candidates.map(candidate => RICH_TEXT_FONT_FAMILIES.find(family => family.toLowerCase() === candidate.toLowerCase())).find(Boolean) ?? null;
}

function safeFontSize(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  const match = raw.match(/^(\d+(?:\.\d+)?)(px|pt)$/);
  if (!match) return null;
  const px = Math.round(Number(match[1]) * (match[2] === 'pt' ? 4 / 3 : 1));
  return px >= 8 && px <= 96 ? `${px}px` : null;
}

function styleFor(node, inherited) {
  const marks = new Set(inherited.marks);
  const styles = {...inherited.styles};
  const tag = node.tagName?.toUpperCase();
  if (['B', 'STRONG'].includes(tag)) marks.add('bold');
  if (['I', 'EM'].includes(tag)) marks.add('italic');
  if (tag === 'U') marks.add('underline');
  if (['S', 'STRIKE', 'DEL'].includes(tag)) marks.add('strikethrough');
  if (tag === 'SUB') marks.add('subscript');
  if (tag === 'SUP') marks.add('superscript');
  if (tag === 'CODE' || tag === 'KBD') marks.add('code');
  const declarations = node.getAttribute?.('style') || '';
  if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(declarations)) marks.add('bold');
  if (/font-style\s*:\s*italic/i.test(declarations)) marks.add('italic');
  if (/text-decoration(?:-line)?\s*:[^;]*(underline)/i.test(declarations)) marks.add('underline');
  if (/text-decoration(?:-line)?\s*:[^;]*(line-through)/i.test(declarations)) marks.add('strikethrough');
  const color = declarations.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i)?.[1];
  const highlight = declarations.match(/(?:^|;)\s*background-color\s*:\s*([^;]+)/i)?.[1];
  const fontFamily = declarations.match(/(?:^|;)\s*font-family\s*:\s*([^;]+)/i)?.[1];
  const fontSize = declarations.match(/(?:^|;)\s*font-size\s*:\s*([^;]+)/i)?.[1];
  if (color && normalizeColor(color)) styles.color = normalizeColor(color);
  if (highlight && normalizeColor(highlight)) styles.backgroundColor = normalizeColor(highlight);
  if (fontFamily && safeFontFamily(fontFamily)) styles.fontFamily = safeFontFamily(fontFamily);
  if (fontSize && safeFontSize(fontSize)) styles.fontSize = safeFontSize(fontSize);
  if (tag === 'FONT') {
    const fontColor = normalizeColor(node.getAttribute('color'));
    if (fontColor) styles.color = fontColor;
    const face = safeFontFamily(node.getAttribute('face'));
    if (face) styles.fontFamily = face;
    const legacySize = Number(node.getAttribute('size'));
    if (Number.isInteger(legacySize) && legacySize >= 1 && legacySize <= 7) styles.fontSize = `${[8,10,13,16,18,24,32][legacySize-1]}px`;
  }
  return {marks: MARK_ORDER.filter(mark => marks.has(mark)), styles};
}

function safeLink(anchor) {
  const raw = anchor?.getAttribute?.('href');
  if (!raw) return null;
  try {
    const href = validatedLinkHref(raw);
    return {
      href,
      ...(href.startsWith('http://') || href.startsWith('https://') ? {target: '_blank', rel: 'noopener noreferrer'} : {}),
      ...(anchor.getAttribute('title') ? {title: anchor.getAttribute('title').slice(0, 256)} : {})
    };
  } catch { return null; }
}

function readInlineNodes(root, inherited = {marks: [], styles: {}}, inheritedLink = null) {
  const result = [];
  const visit = (node, context, link) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.nodeValue) return;
      const styles = Object.fromEntries(Object.entries(context.styles).filter(([, value]) => value));
      result.push({type: 'text', text: node.nodeValue, marks: [...context.marks], ...(Object.keys(styles).length ? {styles} : {}), ...(link ? {link} : {})});
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName.toUpperCase();
    if (['SCRIPT', 'STYLE', 'SVG', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON'].includes(tag)) return;
    if (tag === 'BR') {
      // Preserve in-paragraph/LI/TD hard breaks as canonical inline newlines.
      // A single placeholder <br> in an otherwise empty block is not content.
      if (!(root.querySelectorAll?.('br').length === 1 && root.textContent === '')) {
        result.push({type:'text',text:'\n',marks:[...context.marks],
          ...(Object.keys(context.styles).length?{styles:{...context.styles}}:{}),
          ...(link?{link}:{})});
      }
      return;
    }
    const next = styleFor(node, context);
    const nextLink = tag === 'A' ? safeLink(node) : link;
    for (const child of node.childNodes) visit(child, next, nextLink);
  };
  const rootContext = root?.nodeType === Node.ELEMENT_NODE ? styleFor(root, inherited) : inherited;
  for (const child of root.childNodes ?? []) visit(child, rootContext, inheritedLink);
  return mergeRuns(result);
}

function mergeRuns(runs) {
  const result = [];
  for (const run of runs) {
    const previous = result.at(-1);
    const key = value => JSON.stringify({marks: value.marks, styles: value.styles ?? {}, link: value.link ?? null});
    if (previous && key(previous) === key(run)) previous.text += run.text;
    else result.push(run);
  }
  return result.length ? result : [{type: 'text', text: '', marks: []}];
}

function blockAlign(element) {
  const align = element.getAttribute('align') || element.style?.textAlign || '';
  return ['left', 'center', 'right', 'justify'].includes(align.toLowerCase()) ? align.toLowerCase() : undefined;
}

function directRows(table) {
  return [...table.querySelectorAll('tr')].filter(row => row.closest('table') === table);
}

function htmlTable(table) {
  const rows = directRows(table).slice(0, MAX_TABLE_ROWS).map(row => ({
    cells: [...row.children].filter(cell => ['TD', 'TH'].includes(cell.tagName)).slice(0, MAX_TABLE_COLUMNS).map(cell => ({
      header: cell.tagName === 'TH', ...(blockAlign(cell) ? {align:blockAlign(cell)} : {}), children: readInlineNodes(cell)
    }))
  })).filter(row => row.cells.length);
  if (!rows.length) return null;
  const width = Math.max(...rows.map(row => row.cells.length));
  for (const row of rows) while (row.cells.length < width) row.cells.push({header: false, children: [{type: 'text', text: '', marks: []}]});
  return {type: 'table', rows};
}

function listBlock(list) {
  const items = [...list.children].filter(child => child.tagName === 'LI').map(item => ({children: readInlineNodes(item)}));
  return {type: list.tagName === 'OL' ? 'numbered-list' : 'bulleted-list', items: items.length ? items : [{children: [{type: 'text', text: '', marks: []}]}]};
}

function parseHtmlBlocks(root) {
  const blocks = [];
  const appendParagraph = element => {
    const children = readInlineNodes(element);
    const align = blockAlign(element);
    blocks.push({type: 'paragraph', ...(align ? {align} : {}), children});
  };
  const walk = element => {
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.nodeValue?.trim()) blocks.push({type: 'paragraph', children: mergeRuns([{type: 'text', text: child.nodeValue.trim(), marks: []}])});
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.tagName.toUpperCase();
      if (['SCRIPT', 'STYLE', 'SVG', 'IFRAME', 'OBJECT', 'EMBED', 'FORM'].includes(tag)) continue;
      if (/^H[1-6]$/.test(tag)) {
        const align = blockAlign(child);
        blocks.push({type: 'heading', level: Number(tag.slice(1)), ...(align ? {align} : {}), children: readInlineNodes(child)});
      } else if (tag === 'P') appendParagraph(child);
      else if (tag === 'BLOCKQUOTE') { const align = blockAlign(child); blocks.push({type: 'quote', ...(align ? {align} : {}), children: readInlineNodes(child)}); }
      else if (tag === 'PRE') blocks.push({type: 'code', children: readInlineNodes(child)});
      else if (tag === 'UL' || tag === 'OL') blocks.push(listBlock(child));
      else if (tag === 'TABLE') {
        const parsed = htmlTable(child);
        if (parsed) blocks.push(parsed);
      } else if (['BR', 'HR'].includes(tag)) blocks.push({type: 'paragraph', children: [{type: 'text', text: '', marks: []}]});
      else if ([...child.children].some(item => ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'TABLE', 'BLOCKQUOTE', 'PRE'].includes(item.tagName))) walk(child);
      else appendParagraph(child);
    }
  };
  walk(root);
  return blocks;
}

function fromPlainText(text) {
  const normalized = String(text ?? '').replace(/\r\n?/g, '\n');
  const lines = normalized.split('\n');
  if (lines.some(line => line.includes('\t'))) {
    if (lines.length > MAX_TABLE_ROWS || Math.max(...lines.map(line => line.split('\t').length)) > MAX_TABLE_COLUMNS) {
      throw new Error('A beillesztett táblázat legfeljebb 100 sort és 24 oszlopot tartalmazhat.');
    }
    const width = Math.max(...lines.map(line => line.split('\t').length));
    return {
      schemaVersion: 1, type: 'richtext-document', blocks: [{
        type: 'table', rows: lines.map(line => ({cells: Array.from({length: width}, (_, index) => ({
          header: false, children: [{type: 'text', text: line.split('\t')[index] ?? '', marks: []}]
        }))}))
      }]
    };
  }
  return {schemaVersion: 1, type: 'richtext-document', blocks: lines.map(line => ({
    type: 'paragraph', children: [{type: 'text', text: line, marks: []}]
  }))};
}

/** Convert Word/Excel clipboard HTML into a small, safe Page Model document. */
export function importRichTextClipboard({html = '', text = ''} = {}) {
  const sourceHtml = String(html ?? ''), sourceText = String(text ?? '');
  if (sourceHtml.length > MAX_CLIPBOARD_CHARS || sourceText.length > MAX_CLIPBOARD_CHARS) {
    throw new Error('A beillesztett tartalom túl nagy (maximum 250 kB).');
  }
  if (sourceHtml.trim()) {
    const parsed = new DOMParser().parseFromString(sourceHtml, 'text/html');
    const blocks = parseHtmlBlocks(parsed.body);
    const hasUsableContent = blocks.some(block=>
      block.type === 'table' || block.type === 'bulleted-list' || block.type === 'numbered-list' ||
      block.children?.some(run=>String(run.text??'').length>0));
    if (hasUsableContent || (blocks.length>1))return {schemaVersion: 1, type: 'richtext-document', blocks};
  }
  // HTML containing only discarded elements (e.g. SCRIPT or IMG) or an
  // empty clipboard must not silently replace a nonempty selection with ''.
  if(!sourceText.length)throw new Error('A vágólapon nincs beilleszthető szöveg.');
  return fromPlainText(sourceText);
}
