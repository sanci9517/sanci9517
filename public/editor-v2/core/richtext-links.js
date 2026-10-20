import { RICH_TEXT_FONT_FAMILIES } from './schema.js';
import { textOffsetWithin } from './richtext-selection-offset.js';

/*
 * Rich Text links operate inside one block; formatting can span several blocks.
 * All mutations preserve the structured model and use the canonical command.
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
  const safeHref = href === null ? null : validatedLinkHref(href);
  return updateRichTextRange(documentModel, {blockIndex, from, to}, piece => {
    if (safeHref === null) delete piece.link;
    else piece.link = {
      href: safeHref,
      ...(safeHref.startsWith('https://') || safeHref.startsWith('http://')
        ? {target: '_blank', rel: 'noopener noreferrer'} : {})
    };
  });
}

export function updateRichTextInlineMark(documentModel, range, mark) {
  const order=['bold','italic','underline','strikethrough','subscript','superscript','code'];
  if (!order.includes(mark)) throw new Error('Ismeretlen szövegformázás.');
  const segments=Array.isArray(range?.segments)?range.segments:[range];
  const selected=segments.flatMap(segment=>selectedInlineRuns(documentModel,segment));
  if(!selected.length)throw new Error('Először jelölj ki egy szövegrészt.');
  const remove=selected.every(run=>run.marks?.includes(mark));
  return segments.reduce((next,segment)=>updateInlineMarkSegment(next,segment,mark,order,remove),documentModel);
}

export function updateRichTextInlineStyle(documentModel,range,key,value){
  if(!['color','backgroundColor','fontSize','fontFamily'].includes(key))throw new Error('Ismeretlen szövegstílus.');
  const normalized=String(value??'').trim();
  if(['color','backgroundColor'].includes(key)&&!/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(normalized))throw new Error('Válassz érvényes színt.');
  if(key==='fontSize'&&normalized&&!/^(?:[8-9]|[1-8]\d|9[0-6])px$/.test(normalized))throw new Error('A betűméret 8 és 96 képpont között lehet.');
  if(key==='fontFamily'&&normalized&&!RICH_TEXT_FONT_FAMILIES.includes(normalized))throw new Error('Válassz támogatott betűcsaládot.');
  if(Array.isArray(range?.segments))return range.segments.reduce((next,segment)=>updateRichTextInlineStyle(next,segment,key,normalized),documentModel);
  const block=documentModel?.blocks?.[range.blockIndex];if(!block)throw new Error('Érvénytelen szövegkijelölés.');
  const targets=[];
  if(Array.isArray(block.children))targets.push(block.children);
  else if(Array.isArray(block.items))for(const item of block.items)targets.push(Array.isArray(item)?item:item?.children??[]);
  else if(block.type==='table')for(const row of block.rows??[])for(const cell of row.cells??[])targets.push(cell.children??[]);
  else throw new Error('Ebben a blokkban a kijelölés nem formázható.');
  let total=0;for(const runs of targets)total+=runs.reduce((sum,run)=>sum+String(run.text??'').length,0);
  if(!Number.isInteger(range.from)||!Number.isInteger(range.to)||range.from<0||range.to>total||range.to<=range.from)throw new Error('Először jelölj ki egy szövegrészt.');
  const next=structuredClone(documentModel),nextBlock=next.blocks[range.blockIndex],nextTargets=[];
  if(Array.isArray(nextBlock.children))nextTargets.push({get:()=>nextBlock.children,set:value=>{nextBlock.children=value}});
  else if(Array.isArray(nextBlock.items))for(let index=0;index<nextBlock.items.length;index++)nextTargets.push({get:()=>Array.isArray(nextBlock.items[index])?nextBlock.items[index]:nextBlock.items[index]?.children??[],set:value=>{nextBlock.items[index]={children:value}}});
  else if(nextBlock.type==='table')for(let r=0;r<(nextBlock.rows??[]).length;r++)for(let c=0;c<(nextBlock.rows[r].cells??[]).length;c++)nextTargets.push({get:()=>nextBlock.rows[r].cells[c].children??[],set:value=>{nextBlock.rows[r].cells[c].children=value}});
  let offset=0;for(const target of nextTargets){const length=target.get().reduce((sum,run)=>sum+String(run.text??'').length,0);const from=Math.max(0,range.from-offset),to=Math.min(length,range.to-offset);if(to>from)target.set(updateRuns(target.get(),from,to,piece=>{const styles={...(piece.styles??{})};if(normalized)styles[key]=['color','backgroundColor'].includes(key)?normalized.toLowerCase():normalized;else delete styles[key];piece.styles=styles;if(!Object.keys(styles).length)delete piece.styles}));offset+=length}
  return next;
}

export function updateRichTextBlockAlignment(documentModel,blockIndex,align){
  if(!['left','center','right','justify'].includes(align))throw new Error('Válassz érvényes bekezdésigazítást.');
  const indices=[...new Set(Array.isArray(blockIndex)?blockIndex:[blockIndex])];
  const supported=indices.filter(index=>['paragraph','heading','quote'].includes(documentModel?.blocks?.[index]?.type));
  if(!supported.length)throw new Error('Ennél a blokknál nem állítható be bekezdésigazítás.');
  const next=structuredClone(documentModel);for(const index of supported)next.blocks[index].align=align;return next;
}

function inlineTargets(block, setter=false){
  if(Array.isArray(block?.children))return [{get:()=>block.children,set:value=>{block.children=value}}];
  if(Array.isArray(block?.items))return block.items.map((item,index)=>({get:()=>Array.isArray(block.items[index])?block.items[index]:block.items[index]?.children??[],set:value=>{block.items[index]=Array.isArray(block.items[index])?value:{...block.items[index],children:value}}}));
  if(block?.type==='table')return (block.rows??[]).flatMap((row,rowIndex)=>(row.cells??[]).map((cell,cellIndex)=>({get:()=>block.rows[rowIndex].cells[cellIndex].children??[],set:value=>{block.rows[rowIndex].cells[cellIndex].children=value}})));
  return [];
}

function selectedInlineRuns(documentModel,range){
  const targets=inlineTargets(documentModel?.blocks?.[range?.blockIndex]);if(!targets.length)return [];
  let offset=0;const selected=[];
  for(const target of targets)for(const run of target.get()){const begin=offset;offset+=String(run.text??'').length;if(offset>range.from&&begin<range.to)selected.push(run)}
  if(!Number.isInteger(range.from)||!Number.isInteger(range.to)||range.from<0||range.to>offset||range.to<=range.from)throw new Error('Érvénytelen szövegkijelölés.');
  return selected;
}

/** Current selection state, including mixed values across blocks/lists/cells. */
export function readRichTextSelectionFormatting(documentModel,range){
  const segments=Array.isArray(range?.segments)?range.segments:range?[range]:[];
  const runs=segments.flatMap(segment=>selectedInlineRuns(documentModel,segment));
  const marks=Object.fromEntries(['bold','italic','underline','strikethrough','subscript','superscript','code'].map(mark=>{
    const count=runs.filter(run=>run.marks?.includes(mark)).length;
    return [mark,count===0?false:count===runs.length?true:'mixed'];
  }));
  const styles={},mixed=[];
  for(const key of ['color','backgroundColor','fontSize','fontFamily']){
    const values=new Set(runs.map(run=>run.styles?.[key]??''));
    if(values.size>1)mixed.push(key);else styles[key]=[...values][0]||'';
  }
  return {marks,styles,mixed};
}

/** Clear local character overrides while retaining the text and safe links. */
export function clearRichTextInlineFormatting(documentModel,range){
  const segments=Array.isArray(range?.segments)?range.segments:[range];
  return segments.reduce((model,segment)=>{
    selectedInlineRuns(model,segment);
    const next=structuredClone(model);let offset=0;
    for(const target of inlineTargets(next.blocks[segment.blockIndex])){
      const runs=target.get(),length=runs.reduce((sum,run)=>sum+String(run.text??'').length,0);
      const from=Math.max(0,segment.from-offset),to=Math.min(length,segment.to-offset);
      if(to>from)target.set(updateRuns(runs,from,to,piece=>{piece.marks=[];delete piece.styles}));
      offset+=length;
    }
    return next;
  },documentModel);
}

function updateInlineMarkSegment(documentModel,range,mark,order,remove){
  selectedInlineRuns(documentModel,range);
  const next=structuredClone(documentModel),targets=inlineTargets(next.blocks[range.blockIndex]);let offset=0;
  for(const target of targets){const runs=target.get(),length=runs.reduce((sum,run)=>sum+String(run.text??'').length,0),from=Math.max(0,range.from-offset),to=Math.min(length,range.to-offset);if(to>from)target.set(updateRuns(runs,from,to,piece=>{const marks=new Set(piece.marks??[]);if(remove)marks.delete(mark);else marks.add(mark);piece.marks=order.filter(value=>marks.has(value))}));offset+=length}
  return next;
}

function updateRichTextRange(documentModel, {blockIndex, from, to}, change) {
  if (!Array.isArray(documentModel?.blocks) || !Number.isInteger(blockIndex) ||
      blockIndex < 0 || blockIndex >= documentModel.blocks.length) throw new Error('Érvénytelen szövegkijelölés.');
  const block = documentModel.blocks[blockIndex];
  if (!Array.isArray(block.children) && !Array.isArray(block.items) && block.type !== 'table') {
    throw new Error('Ebben a blokkban nem szerkeszthető a hivatkozás.');
  }
  // Validate the complete range against the same flattened inline model used
  // by marks and inline styles, without confusing separate list items/cells.
  selectedInlineRuns(documentModel, {blockIndex, from, to});
  const next = structuredClone(documentModel);
  let offset = 0;
  for (const target of inlineTargets(next.blocks[blockIndex])) {
    const runs = target.get();
    const length = runs.reduce((total, run) => total + String(run.text ?? '').length, 0);
    const localFrom = Math.max(0, from - offset);
    const localTo = Math.min(length, to - offset);
    if (localTo > localFrom) target.set(updateRuns(runs, localFrom, localTo, change));
    offset += length;
  }
  return next;
}

function updateRuns(runs,from,to,change){
  const updated = [];
  let offset = 0;
  for (const run of runs) {
    const text = String(run.text ?? '');
    const begin = offset, end = begin + text.length;
    offset = end;
    const take = (a, b, selected) => {
      if (b <= a) return;
      const piece = {...structuredClone(run), text: text.slice(a - begin, b - begin)};
      if (selected) change(piece);
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
    if (last && JSON.stringify({marks:last.marks,styles:last.styles,link:last.link}) ===
      JSON.stringify({marks:piece.marks,styles:piece.styles,link:piece.link})) last.text += piece.text;
    else merged.push(piece);
  }
  return merged;
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
  let from = textOffsetWithin(start, range.startContainer, range.startOffset);
  let to = textOffsetWithin(start, range.endContainer, range.endOffset);
  if (from === null || to === null) return null;
  if (from === to) {
    // A caret inside an existing link means 'edit/unlink this link'.
    const element = range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer : range.startContainer.parentElement;
    const anchor = element?.closest('a');
    if (!anchor || !start.contains(anchor)) return null;
    const index = [...anchor.parentNode.childNodes].indexOf(anchor);
    from = textOffsetWithin(start, anchor.parentNode, index);
    if (from === null) return null;
    to = from + anchor.textContent.length;
  }
  return from === to ? null : {blockIndex, from, to};
}

/** Return a structured selection split at top-level blocks for model-backed formatting. */
export function getRichTextFormattingSelection(editor) {
  const selection=window.getSelection();
  if(!selection?.rangeCount||selection.isCollapsed)return null;
  const range=selection.getRangeAt(0);
  if(!editor.contains(range.startContainer)||!editor.contains(range.endContainer))return null;
  const topBlock=(container,offset,isStart)=>{
    if(container===editor){const index=isStart?offset:offset-1;return editor.children?.[index]??null}
    let current=container.nodeType===Node.ELEMENT_NODE?container:container.parentElement;
    while(current&&current.parentElement!==editor)current=current.parentElement;
    return current?.parentElement===editor?current:null;
  };
  const start=topBlock(range.startContainer,range.startOffset,true),end=topBlock(range.endContainer,range.endOffset,false);
  if(!start||!end)return null;
  const children=[...editor.children],first=children.indexOf(start),last=children.indexOf(end);
  if(first<0||last<first)return null;
  const offsetIn=(block,container,offset,isStart)=>{
    if(container===editor)return isStart?0:block.textContent.length;
    return textOffsetWithin(block,container,offset);
  };
  const segments=[];
  for(let blockIndex=first;blockIndex<=last;blockIndex++){
    const block=children[blockIndex],from=blockIndex===first?offsetIn(block,range.startContainer,range.startOffset,true):0,
      to=blockIndex===last?offsetIn(block,range.endContainer,range.endOffset,false):block.textContent.length;
    if(from===null||to===null)return null;
    if(to>from)segments.push({blockIndex,from,to});
  }
  return segments.length?{segments}:null;
}

/** Rebuild a native Range from canonical per-block character positions after markup is replaced.
 * This intentionally does not use a flattened text offset: DOM Range.toString()
 * inserts separators between blocks, while TreeWalker(SHOW_TEXT) does not.
 */
export function restoreRichTextFormattingSelection(editor,selectionRange) {
  const segments=selectionRange?.segments;
  if(!editor||!Array.isArray(segments)||!segments.length)return false;
  const first=segments[0],last=segments[segments.length-1];
  const blockAt=(item)=>{
    if(!Number.isInteger(item?.blockIndex)||!Number.isInteger(item?.from)||
       !Number.isInteger(item?.to)||item.from<0||item.to<=item.from)return null;
    return editor.children[item.blockIndex]??null;
  };
  const firstBlock=blockAt(first),lastBlock=blockAt(last);
  if(!firstBlock||!lastBlock||first.blockIndex>last.blockIndex)return false;
  const locate=(block,position)=>{
    const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT);
    let text,offset=0;
    while((text=walker.nextNode())){
      const end=offset+text.nodeValue.length;
      if(position<=end)return {node:text,offset:position-offset};
      offset=end;
    }
    return null;
  };
  const start=locate(firstBlock,first.from),end=locate(lastBlock,last.to);
  if(!start||!end)return false;
  try{
    const nativeRange=document.createRange();
    nativeRange.setStart(start.node,start.offset);
    nativeRange.setEnd(end.node,end.offset);
    if(nativeRange.collapsed)return false;
    const selection=window.getSelection();
    if(!selection)return false;
    selection.removeAllRanges();
    selection.addRange(nativeRange);
    return true;
  }catch{return false}
}

/** Capture selected list-item targets before an Inspector dropdown takes focus.
 * Noncollapsed selections retain per-block inline offsets. Collapsed carets
 * within a list carry their exact LI index, avoiding the ambiguous boundary
 * between one item's end and the next item's start.
 */
export function getRichTextBlockTransformSelection(editor) {
  const selection=window.getSelection();
  if(!selection?.rangeCount||!editor?.contains(selection.anchorNode)||
     !editor.contains(selection.focusNode))return null;
  const format=getRichTextFormattingSelection(editor);
  if(format?.segments?.length)return format.segments;
  const blockIndex=getRichTextActiveBlockIndex(editor);
  if(blockIndex===null)return null;
  const block=editor.children[blockIndex];
  const anchor=selection.anchorNode;
  const element=anchor.nodeType===Node.ELEMENT_NODE?anchor:anchor.parentElement;
  const item=element?.closest('li');
  if(item?.parentElement===block){
    const itemIndex=[...block.children].indexOf(item);
    if(itemIndex>=0)return [{blockIndex,itemIndex}];
  }
  return [{blockIndex}];
}

export function getRichTextActiveBlockIndex(editor) {
  const selection=window.getSelection();
  if(!selection?.rangeCount||!editor.contains(selection.anchorNode))return null;
  let node=selection.anchorNode.nodeType===Node.ELEMENT_NODE?selection.anchorNode:selection.anchorNode.parentElement;
  while(node&&node.parentElement!==editor)node=node.parentElement;
  return node?.parentElement===editor?[...editor.children].indexOf(node):null;
}

export function restoreRichTextBlockSelection(editor, range) {
  const block=editor.children?.[range?.blockIndex];
  if(!block||!Number.isInteger(range.from)||!Number.isInteger(range.to)||range.from<0||range.to<=range.from)return false;
  const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT),nodes=[];let node;
  while(node=walker.nextNode())nodes.push(node);
  const locate=target=>{let offset=0;for(const text of nodes){const end=offset+text.nodeValue.length;if(target<=end)return {node:text,offset:target-offset};offset=end}return null};
  const start=locate(range.from),end=locate(range.to);if(!start||!end)return false;
  const nativeRange=document.createRange();nativeRange.setStart(start.node,start.offset);nativeRange.setEnd(end.node,end.offset);
  const selection=window.getSelection();selection.removeAllRanges();selection.addRange(nativeRange);return true;
}
