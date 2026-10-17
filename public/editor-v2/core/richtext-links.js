/*
 * Rich Text inline link editing. A single paragraph/heading/quote/code selection
 * is updated in the structured model, preserving other runs and existing marks.
 * Link mutation does not touch publish state; caller uses the canonical command.
 */
export function validatedLinkHref(value) {
  const href = String(value ?? '').trim();
  if (!href || href.length > 2048 || /[\u0000-\u001f\u007f\\]/.test(href)) {
    throw new Error('Érvénytelen vagy túl hosszú hivatkozás.');
  }
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  if (href.startsWith('#') && href.length > 1) return href;
  try {
    const url = new URL(href);
    if (url.username || url.password || !['https:', 'http:', 'mailto:'].includes(url.protocol)) {
      throw new Error('Nem engedélyezett protokoll.');
    }
    return href;
  } catch {
    throw new Error('Csak biztonságos https://, http://, mailto:, /útvonal vagy #azonosító link megengedett.');
  }
}

export function updateRichTextInlineLink(documentModel, {blockIndex, from, to}, href) {
  if (!Array.isArray(documentModel?.blocks) || !Number.isInteger(blockIndex) ||
      blockIndex < 0 || blockIndex >= documentModel.blocks.length) throw new Error('Érvénytelen szövegkijelölés.');
  const block = documentModel.blocks[blockIndex];
  if (!Array.isArray(block.children)) throw new Error('A hivatkozás beszúrása jelenleg egy szövegblokkban támogatott.');
  const size = block.children.reduce((sum, run) => sum + (run.text?.length || 0), 0);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || to > size || to <= from) {
    throw new Error('Először jelölj ki egy szövegrészt.');
  }
  const safeHref = href === null ? null : validatedLinkHref(href);
  const next = structuredClone(documentModel);
  const updated = [];
  let offset = 0;
  for (const run of block.children) {
    const text = String(run.text ?? '');
    const begin = offset, end = begin + text.length;
    offset = end;
    const take = (a, b, selected) => {
      if (b <= a) return;
      const piece = {...structuredClone(run), text: text.slice(a - begin, b - begin)};
      if (selected) {
        if (safeHref === null) delete piece.link;
        else piece.link = {
          href: safeHref,
          ...(safeHref.startsWith('https://') || safeHref.startsWith('http://')
            ? {target: '_blank', rel: 'noopener noreferrer'} : {})
        };
      }
      updated.push(piece);
    };
    take(begin, Math.min(end, from), false);
    take(Math.max(begin, from), Math.min(end, to), true);
    take(Math.max(begin, to), end, false);
  }
  // Combine adjacent runs with identical formatting, without losing existing links.
  const merged = [];
  for (const piece of updated) {
    const last = merged.at(-1);
    if (last && JSON.stringify({marks:last.marks,link:last.link}) ===
      JSON.stringify({marks:piece.marks,link:piece.link})) last.text += piece.text;
    else merged.push(piece);
  }
  next.blocks[blockIndex].children = merged;
  return next;
}

// Capture selection before focus moves to toolbar buttons / URL input. The native
// DOM selection may disappear on mobile; the returned immutable offsets survive.
export function getRichTextBlockSelection(editor) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) return null;
  const firstBlock = range.startContainer.nodeType === Node.ELEMENT_NODE
    ? range.startContainer : range.startContainer.parentElement;
  const lastBlock = range.endContainer.nodeType === Node.ELEMENT_NODE
    ? range.endContainer : range.endContainer.parentElement;
  const findBlock = element => {
    let current = element;
    while (current && current.parentElement !== editor) current = current.parentElement;
    return current?.parentElement === editor ? current : null;
  };
  const start = findBlock(firstBlock), end = findBlock(lastBlock);
  if (!start || start !== end) return null;
  const blockIndex = [...editor.children].indexOf(start);
  const offset = (container, n) => {
    const r = document.createRange();
    r.selectNodeContents(start);
    r.setEnd(container, n);
    return r.toString().length;
  };
  let from = offset(range.startContainer, range.startOffset);
  let to = offset(range.endContainer, range.endOffset);
  if (from === to) {
    // A caret inside an existing link means 'edit/unlink this link'.
    const element = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer : range.startContainer.parentElement;
    const anchor = element?.closest('a');
    if (!anchor || !start.contains(anchor)) return null;
    const r = document.createRange();
    r.selectNodeContents(start);
    r.setEndBefore(anchor);
    from = r.toString().length;
    to = from + anchor.textContent.length;
  }
  return from === to ? null : {blockIndex, from, to};
}
