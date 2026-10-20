/**
 * Canonical UTF-16 character offset within a Rich Text DOM surface or block.
 * Range.toString() may insert visual list-item, paragraph or table-cell
 * separators; the Page Model counts only its inline text characters.
 */
export function textOffsetWithin(root, container, offset) {
  if (!root?.contains(container) || !Number.isInteger(offset) || offset < 0) return null;
  if (container.nodeType === Node.TEXT_NODE && offset > container.nodeValue.length) return null;
  if (container.nodeType === Node.ELEMENT_NODE && offset > container.childNodes.length) return null;
  const cursor = document.createRange();
  try {
    cursor.setStart(container, offset);
    cursor.collapse(true);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let total = 0;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node === container && node.nodeType === Node.TEXT_NODE) return total + offset;
      if (isRichTextHardBreak(node)) {
        const parent=node.parentNode, index=[...parent.childNodes].indexOf(node);
        if(cursor.comparePoint(parent,index+1)<=0)total+=1;
        else break;
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (cursor.comparePoint(node, node.nodeValue.length) <= 0) total += node.nodeValue.length;
        else break;
      }
    }
    return total;
  } catch {
    return null;
  }
}

/**
 * Native contenteditable Shift+Enter creates BR nodes, although the canonical
 * document serializes those as one newline character. Empty placeholder BR
 * nodes are not content and must never add a phantom character.
 */
export function isRichTextHardBreak(node) {
  if(node?.nodeType!==Node.ELEMENT_NODE||node.tagName!=='BR')return false;
  const block=node.closest('p,h1,h2,h3,h4,h5,h6,blockquote,pre,li,td,th');
  return !block||block.textContent!==''||block.querySelectorAll('br').length>1;
}
