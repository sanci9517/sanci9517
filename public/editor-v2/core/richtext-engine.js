/* Sanci9517 Visual Editor v2 — structured Rich Text DOM bridge. */
import { validatedLinkHref } from './richtext-links.js';
import { textOffsetWithin } from './richtext-selection-offset.js';
import { RICH_TEXT_FONT_FAMILIES } from './schema.js';

export function plainTextToRichText(text=''){
  const value=String(text??'');
  return {schemaVersion:1,type:'richtext-document',blocks:value.split(/\n/).map(line=>({type:'paragraph',children:[{type:'text',text:line,marks:[]}]}))};
}

export function richTextToPlainText(document){
  return (document?.blocks??[]).map(block=>{
    if(block.type==='table')return (block.rows??[]).map(row=>(row.cells??[]).map(cell=>(cell.children??[]).map(x=>x.text??'').join('')).join('\t')).join('\n');
    if(block.type==='bulleted-list'||block.type==='numbered-list')return (block.items??[]).map(item=>(Array.isArray(item)?item:item.children??[]).map(x=>x.text??'').join('')).join('\n');
    return (block.children??[]).map(x=>x.text??'').join('');
  }).join('\n');
}

function clone(value){return structuredClone(value)}
function inlineKey(inline){return JSON.stringify({marks:inline.marks??[],styles:inline.styles??{},link:inline.link??null})}
function mergeRuns(children){
  const out=[];
  for(const child of children??[]){
    const item={type:'text',text:String(child.text??''),marks:[...(child.marks??[])],...(child.styles?{styles:{...child.styles}}:{})};
    if(child.link)item.link=clone(child.link);
    const prev=out.at(-1);
    if(prev&&inlineKey(prev)===inlineKey(item))prev.text+=item.text;
    else out.push(item);
  }
  return out.length?out:[{type:'text',text:'',marks:[]}];
}

export function getSelectionOffsets(editor){
  const selection=window.getSelection();
  if(!selection||selection.rangeCount===0||!editor.contains(selection.anchorNode)||!editor.contains(selection.focusNode))return null;
  const range=selection.getRangeAt(0);
  const a=textOffsetWithin(editor,range.startContainer,range.startOffset);
  const b=textOffsetWithin(editor,range.endContainer,range.endOffset);
  if(a===null||b===null)return null;
  return {from:Math.min(a,b),to:Math.max(a,b),collapsed:a===b};
}

export function restoreSelectionOffsets(editor,selection){
  if(!selection)return false;
  const walker=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT),nodes=[];let node;
  while(node=walker.nextNode())nodes.push(node);
  const locate=target=>{let offset=0;for(const text of nodes){const end=offset+text.nodeValue.length;if(target<=end)return {node:text,offset:target-offset};offset=end}const last=nodes.at(-1);return last?{node:last,offset:last.nodeValue.length}:null};
  const start=locate(selection.from),end=locate(selection.to);if(!start||!end)return false;
  const range=document.createRange();range.setStart(start.node,start.offset);range.setEnd(end.node,end.offset);
  const native=window.getSelection();native.removeAllRanges();native.addRange(range);return true;
}

function inlineElement(inline){
  let node=document.createElement('span');node.textContent=inline.text??'';
  for(const [key,value] of Object.entries(inline.styles??{})){
    if(['color','backgroundColor'].includes(key)&&/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value))node.style[key]=value;
    if(key==='fontSize'&&/^(?:[8-9]|[1-8]\d|9[0-6])px$/.test(value))node.style.fontSize=value;
    if(key==='fontFamily'&&RICH_TEXT_FONT_FAMILIES.includes(value))node.style.fontFamily=value;
  }
  for(const [mark,tag] of [['bold','strong'],['italic','em'],['underline','u'],['strikethrough','s'],['subscript','sub'],['superscript','sup'],['code','code']]){
    if(inline.marks?.includes(mark)){const wrapper=document.createElement(tag);wrapper.append(node);node=wrapper;}
  }
  if(inline.link){try{const href=validatedLinkHref(inline.link.href);const link=document.createElement('a');link.href=href;if(href.startsWith('http://')||href.startsWith('https://')){link.target='_blank';link.rel='noopener noreferrer'}if(inline.link.title)link.title=String(inline.link.title).slice(0,256);link.append(node);node=link}catch{}}
  return node;
}

export function renderRichTextEditor(editor,documentModel){
  editor.replaceChildren();
  (documentModel?.blocks??[]).forEach((block,index)=>{
    if(block.type==='table'){
      const table=document.createElement('table');table.dataset.richBlock=String(index);
      const body=document.createElement('tbody');
      for(const row of block.rows??[]){const tr=document.createElement('tr');for(const cell of row.cells??[]){const td=document.createElement(cell.header?'th':'td');if(['left','center','right','justify'].includes(cell.align))td.style.textAlign=cell.align;for(const inline of cell.children??[])td.append(inlineElement(inline));tr.append(td)}body.append(tr)}
      table.append(body);editor.append(table);return;
    }
    if(block.type==='bulleted-list'||block.type==='numbered-list'){
      const list=document.createElement(block.type==='bulleted-list'?'ul':'ol');list.dataset.richBlock=String(index);
      for(const item of block.items??[]){const li=document.createElement('li');for(const inline of Array.isArray(item)?item:item.children??[])li.append(inlineElement(inline));list.append(li)}
      editor.append(list);return;
    }
    let tag='p';if(block.type==='heading')tag='h'+(block.level||1);else if(block.type==='quote')tag='blockquote';else if(block.type==='code')tag='pre';
    const blockEl=document.createElement(tag);blockEl.dataset.richBlock=String(index);
    if(['left','center','right','justify'].includes(block.align))blockEl.style.textAlign=block.align;
    for(const inline of block.children??[])blockEl.append(inlineElement(inline));
    if(!block.children?.length)blockEl.append(document.createTextNode(''));
    editor.append(blockEl);
  });
  if(!editor.firstChild)editor.append(document.createElement('p'));
}

function linkFromNode(node){
  const link=node.parentElement?.closest('a');
  if(!link)return null;
  try{const href=validatedLinkHref(link.getAttribute('href')||'');return {href,...(href.startsWith('http://')||href.startsWith('https://')?{target:'_blank',rel:'noopener noreferrer'}:{}),...(link.title?{title:link.title.slice(0,256)}:{})}}catch{return null}
}
function marksFromNode(node,block){
  const marks=[];let parent=node.parentElement;
  while(parent&&parent!==block){
    const tag=parent.tagName;
    if((tag==='B'||tag==='STRONG')&&!marks.includes('bold'))marks.push('bold');
    if((tag==='I'||tag==='EM')&&!marks.includes('italic'))marks.push('italic');
    if(tag==='U'&&!marks.includes('underline'))marks.push('underline');
    if(['S','STRIKE','DEL'].includes(tag)&&!marks.includes('strikethrough'))marks.push('strikethrough');
    if(tag==='SUB'&&!marks.includes('subscript'))marks.push('subscript');
    if(tag==='SUP'&&!marks.includes('superscript'))marks.push('superscript');
    if(['CODE','KBD'].includes(tag)&&!marks.includes('code'))marks.push('code');
    parent=parent.parentElement;
  }
  return ['bold','italic','underline','strikethrough','subscript','superscript','code'].filter(mark=>marks.includes(mark));
}
function canonicalColor(value){const raw=String(value??'').trim().toLowerCase();if(/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(raw))return raw;const rgb=raw.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/);if(!rgb||rgb.slice(1,4).some(channel=>Number(channel)>255))return null;return `#${rgb.slice(1,4).map(channel=>Number(channel).toString(16).padStart(2,'0')).join('')}`}
function canonicalFontFamily(value){const first=String(value??'').split(',')[0].trim().replace(/^['\"]|['\"]$/g,'');return RICH_TEXT_FONT_FAMILIES.find(family=>family.toLowerCase()===first.toLowerCase())}
function stylesFromNode(node,block){const styles={};let parent=node.parentElement;while(parent&&parent!==block){for(const key of ['color','backgroundColor']){const color=canonicalColor(parent.style?.[key]);if(color)styles[key]=color}const family=canonicalFontFamily(parent.style?.fontFamily);if(family)styles.fontFamily=family;const size=String(parent.style?.fontSize??'').trim();if(/^(?:[8-9]|[1-8]\d|9[0-6])px$/.test(size))styles.fontSize=size;parent=parent.parentElement}return Object.keys(styles).length?styles:undefined}
function readInlines(element){
  const items=[];const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
    if(!node.nodeValue)continue;
    const styles=stylesFromNode(node,element);
    const item={type:'text',text:node.nodeValue,marks:marksFromNode(node,element),...(styles?{styles}:{})};
    const link=linkFromNode(node);if(link)item.link=link;items.push(item);
  }
  return mergeRuns(items);
}

export function richTextEditorToDocument(editor){
  const blocks=[];
  for(const el of editor.childNodes){
    // Browsers may place the first keystroke or pasted plain text beside an
    // empty paragraph. Keep it instead of silently dropping a root text node.
    if(el.nodeType===3){
      if(el.nodeValue?.trim())blocks.push({type:'paragraph',children:mergeRuns([{text:el.nodeValue,marks:[]}])});
      continue;
    }
    if(el.nodeType!==1)continue;
    const tag=el.tagName;
    if(tag==='TABLE'){
      const rows=[...el.querySelectorAll('tr')].filter(row=>row.closest('table')===el).map(row=>({cells:[...row.children].filter(cell=>['TD','TH'].includes(cell.tagName)).map(cell=>({header:cell.tagName==='TH',...(['left','center','right','justify'].includes(cell.style?.textAlign)?{align:cell.style.textAlign}:{}),children:readInlines(cell)}))})).filter(row=>row.cells.length);
      if(rows.length)blocks.push({type:'table',rows});
      continue;
    }
    if(tag==='UL'||tag==='OL'){
      const items=[...el.children].filter(child=>child.tagName==='LI').map(li=>({children:readInlines(li)}));
      blocks.push({type:tag==='UL'?'bulleted-list':'numbered-list',items:items.length?items:[{children:mergeRuns([])}]});
      continue;
    }
    const block=tag.startsWith('H')&&/^H[1-6]$/.test(tag)?{type:'heading',level:Number(tag.slice(1)),children:[]}:
      tag==='BLOCKQUOTE'?{type:'quote',children:[]}:tag==='PRE'?{type:'code',children:[]}:{type:'paragraph',children:[]};
    if(['left','center','right','justify'].includes(el.style?.textAlign))block.align=el.style.textAlign;
    block.children=readInlines(el);blocks.push(block);
  }
  if(!blocks.length&&editor.textContent)blocks.push({type:'paragraph',children:mergeRuns([{text:editor.textContent,marks:[]}])});
  return {schemaVersion:1,type:'richtext-document',blocks:blocks.length?blocks:[{type:'paragraph',children:[{type:'text',text:'',marks:[]}]}]};
}

const TRANSFORMABLE_BLOCK_TYPES=new Set(['paragraph','heading','quote','code','bulleted-list','numbered-list']);

/**
 * Transform selected text blocks and, optionally, only the list items touched
 * by a selection. The untouched LI runs remain in their original list type.
 * One return value means one Page Model command / Undo step for the caller.
 * selectionSegments contain canonical per-block text offsets or an exact
 * itemIndex for collapsed carets within an LI. Without them, the entire block
 * is converted for backwards-compatible call sites.
 */
export function transformRichTextBlockTypes(documentModel,indices,type,level=1,selectionSegments=null){
  if(!TRANSFORMABLE_BLOCK_TYPES.has(type))throw new Error('Nem támogatott szövegblokk-típus.');
  if(type==='heading'&&(!Number.isInteger(level)||level<1||level>6))throw new Error('A címsor szintje 1–6 lehet.');
  if(!Array.isArray(documentModel?.blocks)||!Array.isArray(indices)||!indices.length||
     indices.some(index=>!Number.isInteger(index)||index<0||index>=documentModel.blocks.length)){
    throw new Error('Előbb válassz egy szövegblokkot.');
  }
  const selected=new Set(indices);
  if([...selected].some(index=>documentModel.blocks[index].type==='table')){
    throw new Error('Táblázat blokkstílusa nem alakítható át. Jelölj ki csak szövegblokkokat.');
  }
  const result=clone(documentModel),blocks=[],isListTarget=type==='bulleted-list'||type==='numbered-list';
  let previousWasSelected=false;
  for(let index=0;index<result.blocks.length;index++){
    const source=result.blocks[index];
    if(!selected.has(index)){
      blocks.push(source);previousWasSelected=false;continue;
    }
    const wasList=['bulleted-list','numbered-list'].includes(source.type);
    const items=wasList?source.items.map(item=>clone(Array.isArray(item)?item:item.children??[])):[clone(source.children??[])];
    const ranges=Array.isArray(selectionSegments)?selectionSegments.filter(segment=>segment?.blockIndex===index):[];
    const selectedItems=new Set();
    if(wasList&&ranges.length){
      let offset=0;
      items.forEach((runs,itemIndex)=>{
        const length=runs.reduce((sum,run)=>sum+String(run.text??'').length,0);
        if(ranges.some(segment=>segment.itemIndex===itemIndex||
           (Number.isInteger(segment.from)&&Number.isInteger(segment.to)&&
             (segment.to>offset&&segment.from<offset+length||
              !length&&segment.from<=offset&&segment.to>=offset)))){
          selectedItems.add(itemIndex);
        }
        offset+=length;
      });
    }else items.forEach((_,itemIndex)=>selectedItems.add(itemIndex));
    if(wasList&&source.type===type&&selectedItems.size<items.length){
      // The chosen marker already applies: a partial selection is a no-op.
      blocks.push(source);previousWasSelected=false;continue;
    }
    let lastEmitted=null;
    items.forEach((children,itemIndex)=>{
      if(!selectedItems.has(itemIndex)){
        if(lastEmitted==='original'&&blocks.at(-1)?.type===source.type){
          blocks.at(-1).items.push(children);
        }else blocks.push({type:source.type,items:[children]});
        lastEmitted='original';previousWasSelected=false;return;
      }
      if(isListTarget){
        if(previousWasSelected&&blocks.at(-1)?.type===type){
          blocks.at(-1).items.push(children);
        }else blocks.push({type,items:[children]});
      }else{
        blocks.push({type,...(type==='heading'?{level}:{}),
          ...(['paragraph','heading','quote'].includes(type)&&!wasList&&source.align?{align:source.align}:{}),
          children});
      }
      lastEmitted='converted';previousWasSelected=true;
    });
  }
  result.blocks=blocks;
  return result;
}

/** Backwards-compatible character-range helper for older command call sites. */
export function setBlockType(document,from,to,type,level=1){
  const indices=[];let offset=0;
  for(let index=0;index<(document?.blocks??[]).length;index++){
    const block=document.blocks[index];
    const children=block.children??block.items?.flatMap(item=>Array.isArray(item)?item:item.children??[])??
      block.rows?.flatMap(row=>row.cells.flatMap(cell=>cell.children??[]))??[];
    const length=children.reduce((n,x)=>n+String(x.text??'').length,0);
    if((to>offset&&from<offset+length)||(length===0&&from===offset))indices.push(index);
    offset+=length+1;
  }
  return indices.length?transformRichTextBlockTypes(document,indices,type,level):clone(document);
}
