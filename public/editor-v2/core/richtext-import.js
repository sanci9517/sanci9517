import { resolveRichTextLinkTarget, validatedLinkHref } from './richtext-links.js?v=20261117-d03-invalid-media-id-guidance-v1';
import { RICH_TEXT_FONT_FAMILIES } from './schema.js?v=20261125-edt016-child-reference-limit-v1';
import { parseTableTsv } from './table-tsv.js';

const MAX_CLIPBOARD_CHARS = 250_000;
const MAX_IMPORT_DOM_NODES = 20_000;
const MAX_IMPORT_DOM_DEPTH = 64;
const MAX_TABLE_ROWS = 100;
const MAX_TABLE_COLUMNS = 24;
const MAX_IMPORTED_BLOCKS = 5_000;
const MAX_LIST_ITEMS = 5_000;
const MAX_INLINE_RUNS = 5_000;
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
    const target=anchor.getAttribute('target');
    const effectiveTarget=target==='_self'?'_self':resolveRichTextLinkTarget(href,target==='_blank'?'_blank':'auto');
    return {
      href,
      ...(effectiveTarget==='_self'&&target==='_self'?{target:'_self'}:effectiveTarget==='_blank'?{target:'_blank',rel:'noopener noreferrer'}:{}),
      ...(anchor.getAttribute('title') ? {title: anchor.getAttribute('title').slice(0, 256)} : {})
    };
  } catch { return null; }
}

function readInlineNodes(root, inherited = {marks: [], styles: {}}, inheritedLink = null, budget) {
  const result = [];
  // Read the empty-block placeholder rule once per inline root. Querying for
  // every <br> made a large but valid pasted paragraph quadratic in its break
  // count, despite the aggregate DOM and inline-run limits below.
  const isSingleEmptyPlaceholderBreak = root?.querySelectorAll?.('br').length === 1 && root.textContent === '';
  const append = run => {
    if (budget.inlineRuns >= MAX_INLINE_RUNS) {
      throw new Error(`A beillesztett tartalom legfeljebb ${MAX_INLINE_RUNS} formázott szövegrészt tartalmazhat.`);
    }
    budget.inlineRuns++;
    result.push(run);
  };
  const visit = (node, context, link) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.nodeValue) return;
      const styles = Object.fromEntries(Object.entries(context.styles).filter(([, value]) => value));
      append({type: 'text', text: node.nodeValue, marks: [...context.marks], ...(Object.keys(styles).length ? {styles} : {}), ...(link ? {link} : {})});
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const tag = node.tagName.toUpperCase();
    if (['SCRIPT', 'STYLE', 'SVG', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON'].includes(tag)) return;
    if (tag === 'BR') {
      // Preserve in-paragraph/LI/TD hard breaks as canonical inline newlines.
      // A single placeholder <br> in an otherwise empty block is not content.
      if (!isSingleEmptyPlaceholderBreak) {
        append({type:'text',text:'\n',marks:[...context.marks],
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

function assertClipboardTreeBudget(root) {
  const pending = [{node: root, depth: 0}];
  let visited = 0;
  while (pending.length) {
    const {node, depth} = pending.pop();
    visited++;
    if (visited > MAX_IMPORT_DOM_NODES) {
      throw new Error(`A beillesztett HTML legfeljebb ${MAX_IMPORT_DOM_NODES} DOM-elemet tartalmazhat.`);
    }
    if (depth > MAX_IMPORT_DOM_DEPTH) {
      throw new Error(`A beillesztett HTML legfeljebb ${MAX_IMPORT_DOM_DEPTH} szint mélységű lehet.`);
    }
    for (let index = node.childNodes.length - 1; index >= 0; index--) {
      pending.push({node: node.childNodes[index], depth: depth + 1});
    }
  }
}

function htmlTable(table, budget) {
  const sourceRows = directRows(table);
  if (sourceRows.length > MAX_TABLE_ROWS) {
    throw new Error(`A beillesztett táblázat legfeljebb ${MAX_TABLE_ROWS} sort tartalmazhat.`);
  }
  const rows = sourceRows.map(row => {
    const sourceCells = [...row.children].filter(cell => ['TD', 'TH'].includes(cell.tagName));
    if (sourceCells.length > MAX_TABLE_COLUMNS) {
      throw new Error(`A beillesztett táblázat legfeljebb ${MAX_TABLE_COLUMNS} oszlopot tartalmazhat.`);
    }
    return {cells: sourceCells.map(cell => ({
      header: cell.tagName === 'TH', ...(blockAlign(cell) ? {align:blockAlign(cell)} : {}), children: readInlineNodes(cell, undefined, null, budget)
    }))};
  }).filter(row => row.cells.length);
  if (!rows.length) return null;
  const width = Math.max(...rows.map(row => row.cells.length));
  for (const row of rows) while (row.cells.length < width) row.cells.push({header: false, children: [{type: 'text', text: '', marks: []}]});
  return {type: 'table', rows};
}

function listBlock(list, budget) {
  const listItems = [...list.children].filter(child => child.tagName === 'LI');
  if (budget.listItems + listItems.length > MAX_LIST_ITEMS) {
    throw new Error(`A beillesztett lista legfeljebb ${MAX_LIST_ITEMS} elemet tartalmazhat.`);
  }
  budget.listItems += listItems.length;
  const items = listItems.map(item => ({children: readInlineNodes(item, undefined, null, budget)}));
  return {type: list.tagName === 'OL' ? 'numbered-list' : 'bulleted-list', items: items.length ? items : [{children: [{type: 'text', text: '', marks: []}]}]};
}

function parseHtmlBlocks(root, budget) {
  const blocks = [];
  const append = block => {
    if (budget.blocks >= MAX_IMPORTED_BLOCKS) {
      throw new Error(`A beillesztett tartalom legfeljebb ${MAX_IMPORTED_BLOCKS} szövegblokkot tartalmazhat.`);
    }
    budget.blocks++;
    blocks.push(block);
  };
  const appendParagraph = element => {
    const children = readInlineNodes(element, undefined, null, budget);
    const align = blockAlign(element);
    append({type: 'paragraph', ...(align ? {align} : {}), children});
  };
  const walk = element => {
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.nodeValue?.trim()) append({type: 'paragraph', children: mergeRuns([{type: 'text', text: child.nodeValue.trim(), marks: []}])});
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const tag = child.tagName.toUpperCase();
      if (['SCRIPT', 'STYLE', 'SVG', 'IFRAME', 'OBJECT', 'EMBED', 'FORM'].includes(tag)) continue;
      if (/^H[1-6]$/.test(tag)) {
        const align = blockAlign(child);
        append({type: 'heading', level: Number(tag.slice(1)), ...(align ? {align} : {}), children: readInlineNodes(child, undefined, null, budget)});
      } else if (tag === 'P') appendParagraph(child);
      else if (tag === 'BLOCKQUOTE') { const align = blockAlign(child); append({type: 'quote', ...(align ? {align} : {}), children: readInlineNodes(child, undefined, null, budget)}); }
      else if (tag === 'PRE') append({type: 'code', children: readInlineNodes(child, undefined, null, budget)});
      else if (tag === 'UL' || tag === 'OL') append(listBlock(child, budget));
      else if (tag === 'TABLE') {
        const parsed = htmlTable(child, budget);
        if (parsed) append(parsed);
      } else if (['BR', 'HR'].includes(tag)) append({type: 'paragraph', children: [{type: 'text', text: '', marks: []}]});
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
    // Reuse the authored-table parser so clipboard TSV decodes quoted tabs,
    // embedded line breaks, and doubled quotes instead of splitting cell data.
    // A single terminal newline is the clipboard's row terminator, not a new
    // empty record; preserve additional terminal blank rows as intentional data.
    const tableText=normalized.endsWith('\n')?normalized.slice(0,-1):normalized;
    const rows=parseTableTsv(tableText);
    // parseTableTsv treats one final row terminator as non-data. The legacy
    // clipboard contract has already removed its single terminator above, so a
    // remaining terminal newline represents an intentional extra blank row.
    if(tableText.endsWith('\n'))rows.push(['']);
    if (rows.length > MAX_TABLE_ROWS || Math.max(...rows.map(row => row.length)) > MAX_TABLE_COLUMNS) {
      throw new Error('A beillesztett táblázat legfeljebb 100 sort és 24 oszlopot tartalmazhat.');
    }
    const width = Math.max(...rows.map(row => row.length));
    return {
      schemaVersion: 1, type: 'richtext-document', blocks: [{
        type: 'table', rows: rows.map(row => ({cells: Array.from({length: width}, (_, index) => ({
          header: false, children: [{type: 'text', text: row[index] ?? '', marks: []}]
        }))}))
      }]
    };
  }
  if (lines.length > MAX_IMPORTED_BLOCKS) {
    throw new Error(`A beillesztett tartalom legfeljebb ${MAX_IMPORTED_BLOCKS} szövegblokkot tartalmazhat.`);
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
    assertClipboardTreeBudget(parsed.body);
    const blocks = parseHtmlBlocks(parsed.body, {blocks: 0, listItems: 0, inlineRuns: 0});
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
