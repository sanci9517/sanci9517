import {normalizeRichText} from './schema.js';
import {renderRichTextEditor,richTextToPlainText} from './richtext-engine.js';

/**
 * Insert a sanitized Rich Text document at the active native selection.
 * Within LI/TH/TD cells only inline content is inserted; new block elements
 * there would corrupt the list or table. A multi-block payload is flattened
 * into readable text inside that single item/cell, never into nested tables.
 * Cross-cell and cross-item replacement is refused before any DOM mutation.
 */
export function pasteRichTextDocument(editor,documentModel){
  const selection=window.getSelection();
  const range=selection?.rangeCount?selection.getRangeAt(0):null;
  // Mobile toolbars/IME may leave the native selection in another control.
  // Never guess a paste location or silently append to the end of the page.
  if(!range||!editor.contains(range.startContainer)||!editor.contains(range.endContainer)){
    throw new Error('A beillesztés helye elveszett. Érintsd meg a kívánt szövegrészt, majd próbáld újra.');
  }
  const model=normalizeRichText(documentModel);
  const imported=document.createElement('div');
  renderRichTextEditor(imported,model);
  const incoming=[...imported.childNodes];
  if(!incoming.length)return false;
  const lastInserted=incoming.at(-1);
  const restoreCaret=()=>{
    if(!lastInserted?.isConnected)return false;
    const caret=document.createRange();
    caret.selectNodeContents(lastInserted);
    caret.collapse(false);
    selection.removeAllRanges();selection.addRange(caret);
    return true;
  };

  const nestedTarget=container=>{
    if(!container||!editor.contains(container))return null;
    const element=container.nodeType===Node.ELEMENT_NODE?container:container.parentElement;
    const nested=element?.closest('li,th,td');
    return nested&&editor.contains(nested)?nested:null;
  };
  const startNested=range&&nestedTarget(range.startContainer);
  const endNested=range&&nestedTarget(range.endContainer);
  if(startNested||endNested){
    if(!startNested||!endNested||startNested!==endNested){
      throw new Error('Több listaelem vagy táblázatcella közötti beillesztés nem támogatott. Jelölj ki egyetlen elemet vagy cellát.');
    }
    let inserted;
    if(model.blocks.length===1&&['paragraph','heading','quote','code'].includes(model.blocks[0].type)){
      const block=incoming[0];
      inserted=[...block.childNodes];
    }else{
      const text=richTextToPlainText(model);
      inserted=text?[document.createTextNode(text)]:[];
    }
    // Reject empty clipboard content without deleting selected text.
    if(!inserted.length||inserted.every(node=>node.nodeType===Node.TEXT_NODE&&!node.nodeValue))return false;
    const fragment=document.createDocumentFragment();
    fragment.append(...inserted);
    const last=fragment.lastChild;
    range.deleteContents();
    range.insertNode(fragment);
    const caret=document.createRange();
    caret.setStartAfter(last);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
    return true;
  }

  // The start/end nodes can both be ordinary paragraphs while the selection
  // crosses an intervening table or list. The old top-level replacement then
  // deleted that entire structured block as an accidental side effect.
  // Likewise, a collapsed caret on a UL/TABLE/TR/TBODY wrapper is not inside
  // an editable LI/TD/TH and must never receive arbitrary paragraph markup.
  const structuralAncestor=container=>{
    const element=container?.nodeType===Node.ELEMENT_NODE?container:container?.parentElement;
    const structure=element?.closest('ul,ol,table');
    return structure&&editor.contains(structure)?structure:null;
  };
  if(structuralAncestor(range.startContainer)||structuralAncestor(range.endContainer)){
    throw new Error('A lista vagy táblázat szerkezetén kívülre eső kurzorhely nem szerkeszthető. Válassz egy szövegrészt vagy cellát.');
  }
  if(!range.collapsed&&[...editor.children].some(block=>
    ['UL','OL','TABLE'].includes(block.tagName)&&range.intersectsNode(block))){
    throw new Error('A kijelölés listát vagy táblázatot is érint. A beillesztéshez jelölj ki csak szövegbekezdéseket; a strukturált elem változatlan maradt.');
  }

  const topLevel=node=>{
    let current=node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement;
    while(current?.parentElement&&current.parentElement!==editor)current=current.parentElement;
    return current?.parentElement===editor?current:null;
  };
  // Pasting a single text block *within* a paragraph/heading/quote/code
  // should replace only the selected inline characters. Splitting the
  // destination into three sibling paragraphs changes spacing and editing
  // semantics even when the clipboard contains just one paragraph.
  // Preserve the destination block type/alignment and imported inline marks.
  const firstBlock=topLevel(range.startContainer);
  const lastBlock=topLevel(range.endContainer);
  if(firstBlock&&firstBlock===lastBlock&&
     /^(?:P|H[1-6]|BLOCKQUOTE|PRE)$/.test(firstBlock.tagName)&&
     model.blocks.length===1&&['paragraph','heading','quote','code'].includes(model.blocks[0].type)){
    const inlines=[...incoming[0].childNodes];
    if(!inlines.some(node=>Boolean(node.textContent||node.nodeValue)))return false;
    const fragment=document.createDocumentFragment();
    fragment.append(...inlines);
    const lastInline=fragment.lastChild;
    range.deleteContents();
    range.insertNode(fragment);
    const caret=document.createRange();
    caret.setStartAfter(lastInline);
    caret.collapse(true);
    selection.removeAllRanges();selection.addRange(caret);
    return true;
  }

  // Multiple imported blocks still split the surrounding top-level blocks.
  // This retains the original explicit paragraph/list/table paste behavior.
  // A caret between top-level blocks is an insertion point, not a request
  // to replace the following whole block (especially offset 0 on mobile).
  if(range.startContainer===editor&&range.endContainer===editor){
    const fragment=document.createDocumentFragment();fragment.append(...incoming);
    range.deleteContents();range.insertNode(fragment);
    restoreCaret();return true;
  }
  const startBlock=range&&range.startContainer===editor?editor.childNodes[range.startOffset]:(range&&editor.contains(range.startContainer)?topLevel(range.startContainer):null);
  const endBlock=range&&range.endContainer===editor?editor.childNodes[Math.max(0,range.endOffset-1)]:(range&&editor.contains(range.endContainer)?topLevel(range.endContainer):null);
  if(!startBlock||!endBlock){editor.append(...incoming);restoreCaret();return true}
  const children=[...editor.childNodes],first=children.indexOf(startBlock),last=children.indexOf(endBlock);
  if(first<0||last<first)return false;
  const prefix=document.createDocumentFragment(),suffix=document.createDocumentFragment();
  if(range.startContainer!==editor){
    const prefixRange=document.createRange();prefixRange.selectNodeContents(startBlock);
    prefixRange.setEnd(range.startContainer,range.startOffset);
    prefix.append(prefixRange.cloneContents());
  }
  if(range.endContainer!==editor){
    const suffixRange=document.createRange();suffixRange.selectNodeContents(endBlock);
    suffixRange.setStart(range.endContainer,range.endOffset);
    suffix.append(suffixRange.cloneContents());
  }
  const meaningful=fragment=>[...fragment.childNodes].some(node=>node.nodeType===Node.TEXT_NODE?Boolean(node.nodeValue):Boolean(node.textContent));
  const fragment=document.createDocumentFragment();
  if(meaningful(prefix)){
    const wrapper=startBlock.cloneNode(false);
    wrapper.removeAttribute('data-rich-block');
    fragment.append(wrapper);
    wrapper.append(prefix);
  }
  fragment.append(...incoming);
  if(meaningful(suffix)){
    const wrapper=endBlock.cloneNode(false);
    wrapper.removeAttribute('data-rich-block');
    wrapper.append(suffix);fragment.append(wrapper);
  }
  startBlock.before(fragment);
  for(const block of children.slice(first,last+1))block.remove();
  // Keep the native caret *inside* the last inserted Rich Text block.
  // A detached marker between blocks left subsequent typing at a root edge.
  restoreCaret();
  return true;
}
