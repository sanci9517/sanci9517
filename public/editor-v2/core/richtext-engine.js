/* Sanci9517 Visual Editor v2 — structured Rich Text DOM bridge. */

export function plainTextToRichText(text=''){
  const value=String(text??'');
  return {schemaVersion:1,type:'richtext-document',blocks:value.split(/\n/).map(line=>({type:'paragraph',children:[{type:'text',text:line,marks:[]}]}))};
}

export function richTextToPlainText(document){
  return (document?.blocks??[]).map(block=>{
    if(block.type==='bulleted-list'||block.type==='numbered-list')return (block.items??[]).map(item=>(Array.isArray(item)?item:item.children??[]).map(x=>x.text??'').join('')).join('\n');
    return (block.children??[]).map(x=>x.text??'').join('');
  }).join('\n');
}

function clone(value){return structuredClone(value)}
function inlineKey(inline){return JSON.stringify({marks:inline.marks??[],link:inline.link??null})}
function mergeRuns(children){
  const out=[];
  for(const child of children??[]){
    const item={type:'text',text:String(child.text??''),marks:[...(child.marks??[])]};
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
  for(const [mark,tag] of [['bold','strong'],['italic','em'],['underline','u']]){
    if(inline.marks?.includes(mark)){const wrapper=document.createElement(tag);wrapper.append(node);node=wrapper;}
  }
  if(inline.link){const link=document.createElement('a');link.href=inline.link.href;for(const key of ['target','rel','title'])if(inline.link[key])link[key]=inline.link[key];link.append(node);node=link}
  return node;
}

export function renderRichTextEditor(editor,documentModel){
  editor.replaceChildren();
  (documentModel?.blocks??[]).forEach((block,index)=>{
    if(block.type==='bulleted-list'||block.type==='numbered-list'){
      const list=document.createElement(block.type==='bulleted-list'?'ul':'ol');list.dataset.richBlock=String(index);
      for(const item of block.items??[]){const li=document.createElement('li');for(const inline of Array.isArray(item)?item:item.children??[])li.append(inlineElement(inline));list.append(li)}
      editor.append(list);return;
    }
    let tag='p';if(block.type==='heading')tag='h'+(block.level||1);else if(block.type==='quote')tag='blockquote';else if(block.type==='code')tag='pre';
    const blockEl=document.createElement(tag);blockEl.dataset.richBlock=String(index);
    for(const inline of block.children??[])blockEl.append(inlineElement(inline));
    if(!block.children?.length)blockEl.append(document.createTextNode(''));
    editor.append(blockEl);
  });
  if(!editor.firstChild)editor.append(document.createElement('p'));
}

function linkFromNode(node){
  const link=node.parentElement?.closest('a');
  return link?{href:link.getAttribute('href')||'',...(link.target?{target:link.target}:{}),...(link.rel?{rel:link.rel}:{}),...(link.title?{title:link.title}:{})}:null;
}
function marksFromNode(node,block){
  const marks=[];let parent=node.parentElement;
  while(parent&&parent!==block){
    const tag=parent.tagName;
    if((tag==='B'||tag==='STRONG')&&!marks.includes('bold'))marks.push('bold');
    if((tag==='I'||tag==='EM')&&!marks.includes('italic'))marks.push('italic');
    if(tag==='U'&&!marks.includes('underline'))marks.push('underline');
    parent=parent.parentElement;
  }
  return ['bold','italic','underline'].filter(mark=>marks.includes(mark));
}
function readInlines(element){
  const items=[];const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);let node;
  while(node=walker.nextNode()){
    if(!node.nodeValue)continue;
    const item={type:'text',text:node.nodeValue,marks:marksFromNode(node,element)};
    const link=linkFromNode(node);if(link)item.link=link;items.push(item);
  }
  return mergeRuns(items);
}

export function richTextEditorToDocument(editor){
  const blocks=[];
  for(const el of editor.children){
    const tag=el.tagName;
    if(tag==='UL'||tag==='OL'){
      const items=[...el.children].filter(child=>child.tagName==='LI').map(li=>({children:readInlines(li)}));
      blocks.push({type:tag==='UL'?'bulleted-list':'numbered-list',items:items.length?items:[{children:mergeRuns([])}]});
      continue;
    }
    const block=tag.startsWith('H')&&/^H[1-6]$/.test(tag)?{type:'heading',level:Number(tag.slice(1)),children:[]}:
      tag==='BLOCKQUOTE'?{type:'quote',children:[]}:tag==='PRE'?{type:'code',children:[]}:{type:'paragraph',children:[]};
    block.children=readInlines(el);blocks.push(block);
  }
  if(!blocks.length&&editor.textContent)blocks.push({type:'paragraph',children:mergeRuns([{text:editor.textContent,marks:[]}])});
  return {schemaVersion:1,type:'richtext-document',blocks:blocks.length?blocks:[{type:'paragraph',children:[{type:'text',text:'',marks:[]}]}]};
}

export function setBlockType(document,from,to,type,level=1){
  const next=clone(document);let offset=0;
  for(const block of next.blocks??[]){
    const children=block.children??block.items?.flatMap(item=>Array.isArray(item)?item:item.children??[])??[];
    const length=children.reduce((n,x)=>n+(x.text?.length??0),0);const start=offset,end=offset+length;
    if((to>start&&from<end)||(length===0&&from===start)){
      if(type==='bulleted-list'||type==='numbered-list'){
        block.type=type;block.items=[{children:clone(children)}];delete block.children;delete block.level;
      }else{
        block.type=type;block.children=clone(children);delete block.items;
        if(type==='heading')block.level=Math.min(6,Math.max(1,Number(level)||1));else delete block.level;
      }
    }
    offset=end+1;
  }
  return next;
}
