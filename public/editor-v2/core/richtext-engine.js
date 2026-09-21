/*
 * Sanci9517 Visual Editor v2 — Rich Text Engine
 *
 * Single source of truth: canonical Rich Text document.
 * DOM is only the editing surface. Formatting always uses one deterministic
 * range transform; there is no parallel mark/font-weight engine.
 */

export function plainTextToRichText(text=''){
  const value=String(text??'');
  return {schemaVersion:1,type:'richtext-document',blocks:value.split(/\n/).map(line=>({type:'paragraph',children:[{type:'text',text:line,marks:[]}]}))};
}

export function richTextToPlainText(document){
  return (document?.blocks??[]).map(block=>{
    if(block.type==='bulleted-list'||block.type==='numbered-list')return (block.items??[]).map(item=>(item??[]).map(x=>x.text??'').join('')).join('\n');
    return (block.children??[]).map(x=>x.text??'').join('');
  }).join('\n');
}

function clone(value){return structuredClone(value)}
function inlineKey(inline){return JSON.stringify({marks:[...(inline.marks??[])].sort(),link:inline.link??null})}
function mergeRuns(children){
  const out=[];
  for(const child of children??[]){
    const item={type:'text',text:String(child.text??''),marks:[...new Set(child.marks??[])]};
    if(child.link)item.link=clone(child.link);
    const prev=out[out.length-1];
    if(prev&&inlineKey(prev)===inlineKey(item))prev.text+=item.text;
    else out.push(item);
  }
  return out.length?out:[{type:'text',text:'',marks:[]}];
}
function splitInline(inline,start,end){
  const text=inline.text??'',parts=[];
  if(start>0)parts.push({...clone(inline),text:text.slice(0,start)});
  parts.push({...clone(inline),text:text.slice(start,end)});
  if(end<text.length)parts.push({...clone(inline),text:text.slice(end)});
  return parts;
}
function blocksWithOffsets(document){
  const result=[];let offset=0;
  for(let index=0;index<(document.blocks??[]).length;index++){
    const block=document.blocks[index];
    const children=block.children??[];
    const length=children.reduce((n,x)=>n+(x.text?.length??0),0);
    result.push({block,index,children,start:offset,end:offset+length});
    offset+=length+1;
  }
  return result;
}
function transformChildren(children,from,to,transform){
  const result=[];let offset=0;
  for(const inline of children??[]){
    const text=inline.text??'',start=offset,end=offset+text.length;
    if(to<=start||from>=end){result.push(clone(inline))}
    else{
      const localFrom=Math.max(0,from-start),localTo=Math.min(text.length,to-start);
      const parts=splitInline(inline,localFrom,localTo);
      let partOffset=0;
      for(const part of parts){
        const selected=partOffset<localTo&&partOffset+part.text.length>localFrom;
        result.push(selected?transform(part):part);
        partOffset+=part.text.length;
      }
    }
    offset=end;
  }
  return mergeRuns(result);
}
function transformRange(document,from,to,transform){
  const next=clone(document);
  for(const entry of blocksWithOffsets(next)){
    if(to<=entry.start||from>=entry.end)continue;
    const localFrom=Math.max(0,from-entry.start),localTo=Math.min(entry.end-entry.start,to-entry.start);
    entry.block.children=transformChildren(entry.children,localFrom,localTo,transform);
  }
  return next;
}

export function toggleMark(document,from,to,mark){
  if(!['bold','italic','underline','strike','code'].includes(mark))throw new Error('Unsupported Rich Text mark');
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<=from)throw new Error('Invalid Rich Text selection');
  const ranges=blocksWithOffsets(document).filter(x=>to>x.start&&from<x.end);
  const active=ranges.length>0&&ranges.every(entry=>{
    const localFrom=Math.max(0,from-entry.start),localTo=Math.min(entry.end-entry.start,to-entry.start);
    let offset=0,covered=false;
    for(const inline of entry.children){
      const end=offset+(inline.text?.length??0);
      if(localTo>offset&&localFrom<end){covered=true;if(!inline.marks?.includes(mark))return false}
      offset=end;
    }
    return covered;
  });
  return transformRange(document,from,to,inline=>{
    const marks=[...(inline.marks??[])];
    return {...inline,marks:active?marks.filter(x=>x!==mark):[...new Set([...marks,mark])]};
  });
}

export function isMarkActive(document,from,to,mark){
  if(!Number.isInteger(from)||!Number.isInteger(to)||from>=to)return false;
  const ranges=blocksWithOffsets(document).filter(x=>to>x.start&&from<x.end);
  if(!ranges.length)return false;
  for(const entry of ranges){
    const localFrom=Math.max(0,from-entry.start),localTo=Math.min(entry.end-entry.start,to-entry.start);
    let offset=0;
    for(const inline of entry.children){
      const end=offset+(inline.text?.length??0);
      if(localTo>offset&&localFrom<end&&!inline.marks?.includes(mark))return false;
      offset=end;
    }
  }
  return true;
}

export function getSelectionOffsets(editor){
  const selection=window.getSelection();
  if(!selection||selection.rangeCount===0||!editor.contains(selection.anchorNode)||!editor.contains(selection.focusNode))return null;
  const range=selection.getRangeAt(0);
  const point=(container,offset)=>{const r=document.createRange();r.selectNodeContents(editor);r.setEnd(container,offset);return r.toString().length};
  const a=point(range.startContainer,range.startOffset),b=point(range.endContainer,range.endOffset);
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
  if(inline.link){const link=document.createElement('a');link.href=inline.link.href;for(const key of ['target','rel','title'])if(inline.link[key])link[key]=inline.link[key];link.append(node);node=link}
  for(const mark of [...(inline.marks??[])].reverse()){
    const tag={bold:'strong',italic:'em',underline:'u',strike:'s',code:'code'}[mark];if(!tag)continue;
    const wrapper=document.createElement(tag);wrapper.append(node);node=wrapper;
  }
  return node;
}

export function renderRichTextEditor(editor,documentModel){
  editor.replaceChildren();
  (documentModel?.blocks??[]).forEach((block,index)=>{
    let tag='p';if(block.type==='heading')tag='h'+(block.level||1);else if(block.type==='quote')tag='blockquote';else if(block.type==='code')tag='pre';
    const blockEl=document.createElement(tag);blockEl.dataset.richBlock=String(index);
    for(const inline of block.children??[])blockEl.append(inlineElement(inline));
    if(!block.children?.length)blockEl.append(document.createTextNode(''));
    editor.append(blockEl);
  });
  if(!editor.firstChild)editor.append(document.createElement('p'));
}

function marksFromNode(node){
  const marks=[];let current=node.parentElement;
  while(current){
    const tag=current.tagName;
    if(tag==='STRONG'||tag==='B')marks.push('bold');
    if(tag==='EM'||tag==='I')marks.push('italic');
    if(tag==='U')marks.push('underline');
    if(tag==='S'||tag==='DEL')marks.push('strike');
    if(tag==='CODE')marks.push('code');
    current=current.parentElement;
  }
  return [...new Set(marks)];
}
function linkFromNode(node){
  const link=node.parentElement?.closest('a');
  return link?{href:link.getAttribute('href')||'',...(link.target?{target:link.target}:{}),...(link.rel?{rel:link.rel}:{}),...(link.title?{title:link.title}:{})}:null;
}

export function richTextEditorToDocument(editor){
  const blocks=[];
  editor.querySelectorAll(':scope > p,:scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6,:scope > blockquote,:scope > pre').forEach(el=>{
    const tag=el.tagName;
    const block=tag.startsWith('H')?{type:'heading',level:Number(tag.slice(1)),children:[]}:tag==='BLOCKQUOTE'?{type:'quote',children:[]}:tag==='PRE'?{type:'code',children:[]}:{type:'paragraph',children:[]};
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
    while(node=walker.nextNode()){
      if(!node.nodeValue)continue;
      const item={type:'text',text:node.nodeValue,marks:marksFromNode(node)};const link=linkFromNode(node);if(link)item.link=link;block.children.push(item);
    }
    block.children=mergeRuns(block.children);blocks.push(block);
  });
  return {schemaVersion:1,type:'richtext-document',blocks:blocks.length?blocks:[{type:'paragraph',children:[{type:'text',text:'',marks:[]}]}]};
}

export function setBlockType(document,from,to,type,level=1){
  const next=clone(document);
  for(const entry of blocksWithOffsets(next)){
    if(to<=entry.start||from>=entry.end)continue;
    entry.block.type=type;if(type==='heading')entry.block.level=Math.min(6,Math.max(1,Number(level)||1));else delete entry.block.level;
  }
  return next;
}
