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
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let total = 0;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node === container) return total + offset;
      // comparePoint < 0: text end before cursor; 0: exactly at cursor.
      if (cursor.comparePoint(node, node.nodeValue.length) <= 0) {
        total += node.nodeValue.length;
      } else {
        break;
      }
    }
    return total;
  } catch {
    return null;
  }
}
