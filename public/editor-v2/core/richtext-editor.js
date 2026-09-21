import {RICH_TEXT_SCHEMA_VERSION,RICH_TEXT_TYPE} from './schema.js';

export function plainTextToRichText(value=''){
  const text=String(value);
  return {
    schemaVersion:RICH_TEXT_SCHEMA_VERSION,
    type:RICH_TEXT_TYPE,
    blocks:text.split(/\r?\n/).map(line=>({
      type:'paragraph',
      children:[{type:'text',text:line,marks:[]}]
    }))
  };
}

export function richTextToPlainText(document){
  return (document?.blocks||[]).map(block=>{
    if(block.type==='bulleted-list'||block.type==='numbered-list'){
      return (block.items||[]).map(item=>(item?.children||item||[]).map(inline=>inline.text||'').join('')).join('\n');
    }
    return (block.children||[]).map(inline=>inline.text||'').join('');
  }).join('\n');
}

function inlineElement(inline){
  let el=document.createTextNode(inline?.text||'');
  const marks=new Set(inline?.marks||[]);
  if(marks.has('bold')){const n=document.createElement('strong');n.append(el);el=n}
  if(Number.isInteger(Number(inline?.fontWeight))){const n=document.createElement('span');n.dataset.fontWeight=String(Number(inline.fontWeight));n.style.fontWeight=String(Number(inline.fontWeight));n.append(el);el=n}
  if(marks.has('italic')){const n=document.createElement('em');n.append(el);el=n}
  if(marks.has('underline')){const n=document.createElement('u');n.append(el);el=n}
  if(marks.has('strike')){const n=document.createElement('s');n.append(el);el=n}
  if(marks.has('code')){const n=document.createElement('code');n.append(el);el=n}
  if(inline?.link?.href){const n=document.createElement('a');n.href=inline.link.href;if(inline.link.target)n.target=inline.link.target;if(inline.link.rel)n.rel=inline.link.rel;if(inline.link.title)n.title=inline.link.title;n.append(el);el=n}
  return el;
}

export function renderRichTextEditor(container,doc){
  container.replaceChildren();
  for(const block of doc?.blocks||[]){
    let blockEl;
    if(block.type==='heading'){
      blockEl=document.createElement(`h${Math.min(6,Math.max(1,Number(block.level)||1))}`);
    }else if(block.type==='quote'){
      blockEl=document.createElement('blockquote');
    }else if(block.type==='code'){
      blockEl=document.createElement('pre');
    }else{
      blockEl=document.createElement('p');
    }
    for(const inline of block.children||[])blockEl.append(inlineElement(inline));
    container.append(blockEl);
  }
  if(!container.firstElementChild){
    const p=document.createElement('p');p.append(document.createTextNode(''));container.append(p);
  }
}

function marksForTextNode(node){
  const marks=[];
  let current=node.parentElement;
  while(current){
    const tag=current.tagName?.toLowerCase();
    if(tag==='strong'||tag==='b')marks.push('bold');
    if(tag==='em'||tag==='i')marks.push('italic');
    if(tag==='u')marks.push('underline');
    if(tag==='s'||tag==='del')marks.push('strike');
    if(tag==='code')marks.push('code');
    current=current.parentElement;
  }
  return [...new Set(marks)];
}

function linkForTextNode(node){
  const link=node.parentElement?.closest('a');
  if(!link)return undefined;
  return {
    href:link.getAttribute('href')||'',
    ...(link.target?{target:link.target}:{}),
    ...(link.rel?{rel:link.rel}:{}),
    ...(link.title?{title:link.title}:{})
  };
}

function inlineRuns(blockEl){
  const runs=[];
  const walker=document.createTreeWalker(blockEl,NodeFilter.SHOW_TEXT);
  let node;
  while(node=walker.nextNode()){
    const text=node.nodeValue||'';
    if(!text)continue;
    const run={type:'text',text,marks:marksForTextNode(node)};
    const weightNode=node.parentElement?.closest('[data-font-weight]');
    const legacyBold=run.marks.includes('bold');
    if(weightNode?.dataset.fontWeight)run.fontWeight=Math.min(900,Math.max(100,Number(weightNode.dataset.fontWeight)||400));
    else if(legacyBold)run.fontWeight=700;
    const link=linkForTextNode(node);if(link)run.link=link;
    runs.push(run);
  }
  return runs.length?runs:[{type:'text',text:'',marks:[]}];
}

export function richTextEditorToDocument(container){
  const blocks=[];
  for(const child of container.children){
    const tag=child.tagName.toLowerCase();
    const children=inlineRuns(child);
    if(/^h[1-6]$/.test(tag))blocks.push({type:'heading',level:Number(tag[1]),children});
    else if(tag==='blockquote')blocks.push({type:'quote',children});
    else if(tag==='pre')blocks.push({type:'code',children});
    else blocks.push({type:'paragraph',children});
  }
  return {schemaVersion:RICH_TEXT_SCHEMA_VERSION,type:RICH_TEXT_TYPE,blocks:blocks.length?blocks:[{type:'paragraph',children:[{type:'text',text:'',marks:[]}]}]};
}

function inlineGroups(document){
  const groups=[];
  for(const block of document?.blocks||[]){
    if(block.type==='bulleted-list'||block.type==='numbered-list'){
      for(const item of block.items||[])groups.push(item?.children||[]);
    }else{
      groups.push(block.children||[]);
    }
  }
  return groups;
}

function inlineEquals(a,b){
  if((a?.fontWeight??null)!==(b?.fontWeight??null))return false;
  if(JSON.stringify(a?.link??null)!==JSON.stringify(b?.link??null))return false;
  const am=[...(a?.marks||[])].slice().sort(),bm=[...(b?.marks||[])].slice().sort();
  return JSON.stringify(am)===JSON.stringify(bm);
}

function mergeInlineRuns(runs){
  const merged=[];
  for(const run of runs||[]){
    const next=structuredClone(run);
    if(!next.text&&!merged.length)continue;
    const previous=merged[merged.length-1];
    if(previous&&inlineEquals(previous,next)){
      previous.text=String(previous.text||'')+String(next.text||'');
    }else{
      merged.push(next);
    }
  }
  return merged.length?merged:[{type:'text',text:'',marks:[]}];
}

function transformRichTextRange(document,start,end,transform){
  const next=structuredClone(document);
  const a=Math.max(0,Math.min(Number(start)||0,Number(end)||0));
  const b=Math.max(0,Math.max(Number(start)||0,Number(end)||0));
  if(a===b)return next;
  let offset=0;
  const groups=inlineGroups(next);
  for(const group of groups){
    const rebuilt=[];
    for(const inline of group){
      const text=String(inline?.text||'');
      const localStart=Math.max(0,a-offset);
      const localEnd=Math.min(text.length,b-offset);
      if(localEnd<=localStart){
        rebuilt.push(inline);
      }else{
        if(localStart>0)rebuilt.push({...structuredClone(inline),text:text.slice(0,localStart)});
        const selected={...structuredClone(inline),text:text.slice(localStart,localEnd)};
        rebuilt.push(transform(selected));
        if(localEnd<text.length)rebuilt.push({...structuredClone(inline),text:text.slice(localEnd)});
      }
      offset+=text.length;
    }
    const merged=mergeInlineRuns(rebuilt);
    const index=groups.indexOf(group);
    const blockEntry=next.blocks?.find(block=>{
      if(block.type==='bulleted-list'||block.type==='numbered-list')return (block.items||[]).some(item=>item?.children===group);
      return block.children===group;
    });
    if(blockEntry?.type==='bulleted-list'||blockEntry?.type==='numbered-list'){
      const item=(blockEntry.items||[]).find(item=>item?.children===group);
      if(item)item.children=merged;
    }else if(blockEntry){
      blockEntry.children=merged;
    }
    offset+=1;
  }
  return next;
}

export function getRichTextSelectionOffsets(editor,range=null){
  const selection=window.getSelection();
  const activeRange=range||((selection&&selection.rangeCount)?selection.getRangeAt(0):null);
  if(!activeRange||!editor.contains(activeRange.commonAncestorContainer))return null;
  const blockElements=[...editor.children];
  const blockForNode=node=>{
    if(node===editor)return null;
    let current=node.nodeType===Node.ELEMENT_NODE?node:node.parentElement;
    while(current&&current.parentElement!==editor)current=current.parentElement;
    return current;
  };
  const pointOffset=(node,offset)=>{
    if(node===editor){
      let total=0;
      for(let i=0;i<Math.min(offset,blockElements.length);i++)total+=(blockElements[i].textContent||'').length+(i<blockElements.length-1?1:0);
      return total;
    }
    const block=blockForNode(node);
    if(!block)return 0;
    const index=blockElements.indexOf(block);
    let total=0;
    for(let i=0;i<index;i++)total+=(blockElements[i].textContent||'').length+1;
    const local=document.createRange();
    local.selectNodeContents(block);
    try{local.setEnd(node,offset)}catch{ return total }
    return total+local.toString().length;
  };
  const start=pointOffset(activeRange.startContainer,activeRange.startOffset);
  const end=pointOffset(activeRange.endContainer,activeRange.endOffset);
  return {from:Math.min(start,end),to:Math.max(start,end),collapsed:start===end};
}

export function restoreRichTextSelectionOffsets(editor,selectionState){
  if(!selectionState)return false;
  const target=Math.max(0,Number(selectionState.from)||0);
  const endTarget=Math.max(target,Number(selectionState.to)||0);
  const blocks=[...editor.children];
  const pointAt=position=>{
    let remaining=position;
    for(let i=0;i<blocks.length;i++){
      const block=blocks[i];
      const length=(block.textContent||'').length;
      if(remaining<=length){
        const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT);
        let node;let seen=0;
        while(node=walker.nextNode()){
          const len=node.nodeValue?.length||0;
          if(remaining<=seen+len)return {node,offset:remaining-seen};
          seen+=len;
        }
        return {node:block,offset:block.childNodes.length};
      }
      remaining-=length;
      if(i<blocks.length-1)remaining-=1;
    }
    const last=blocks[blocks.length-1];
    return last?{node:last,offset:last.childNodes.length}:{node:editor,offset:0};
  };
  const startPoint=pointAt(target),endPoint=pointAt(endTarget);
  const range=document.createRange();
  range.setStart(startPoint.node,startPoint.offset);
  range.setEnd(endPoint.node,endPoint.offset);
  const selection=window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus();
  return true;
}

export function getRichTextFontWeight(document,start,end){
  const a=Math.min(start,end),b=Math.max(start,end);
  let offset=0;let first=null;let same=true;let covered=false;
  for(const group of inlineGroups(document)){
    for(const inline of group){
      const text=String(inline?.text||'');
      const x=Math.max(a,offset),y=Math.min(b,offset+text.length);
      if(y>x){
        covered=true;
        const weight=Number.isInteger(Number(inline?.fontWeight))?Number(inline.fontWeight):(inline?.marks||[]).includes('bold')?700:400;
        if(first===null)first=weight;else if(first!==weight)same=false;
      }
      offset+=text.length;
    }
    offset+=1;
  }
  return covered&&same&&first!==null?first:400;
}

export function setRichTextFontWeight(document,start,end,weight){
  const value=Math.min(900,Math.max(100,Math.round(Number(weight)/100)*100));
  return transformRichTextRange(document,start,end,inline=>{
    const next=structuredClone(inline);
    next.fontWeight=value;
    next.marks=[...(next.marks||[])].filter(mark=>mark!=='bold');
    return next;
  });
}

export function toggleRichTextMarkRange(document,start,end,mark){
  const a=Math.min(start,end),b=Math.max(start,end);
  let allActive=true;let covered=false;let offset=0;
  for(const group of inlineGroups(document)){
    for(const inline of group){
      const text=String(inline?.text||'');
      const x=Math.max(a,offset),y=Math.min(b,offset+text.length);
      if(y>x){
        covered=true;
        if(!(inline.marks||[]).includes(mark))allActive=false;
      }
      offset+=text.length;
    }
    offset+=1;
  }
  if(!covered)return structuredClone(document);
  return transformRichTextRange(document,a,b,inline=>{
    const next=structuredClone(inline);
    const marks=[...(next.marks||[])];
    next.marks=allActive?marks.filter(value=>value!==mark):[...new Set([...marks,mark])];
    return next;
  });
}

export function isRichTextMarkRangeActive(document,start,end,mark){
  const a=Math.min(start,end),b=Math.max(start,end);
  let offset=0;let covered=false;let active=true;
  for(const group of inlineGroups(document)){
    for(const inline of group){
      const text=String(inline?.text||'');
      const x=Math.max(a,offset),y=Math.min(b,offset+text.length);
      if(y>x){
        covered=true;
        if(!(inline.marks||[]).includes(mark))active=false;
      }
      offset+=text.length;
    }
    offset+=1;
  }
  return covered&&active;
}

export function setRichTextBlockType(document,lineIndex,type='paragraph',level=1){
  const next=structuredClone(document);const block=next.blocks?.[lineIndex];if(!block)return next;
  if(type==='heading'){block.type='heading';block.level=Math.min(6,Math.max(1,Number(level)||1))}else{block.type=type;delete block.level}
  return next;
}

export function richTextLineIndexAtOffset(text,offset){
  return String(text).slice(0,offset).split(/\r?\n/).length-1;
}

export function toggleRichTextMark(document,start,end,mark){
  const next=structuredClone(document);if(!mark)return next;
  const rangeStart=Math.min(Number(start)||0,Number(end)||0),rangeEnd=Math.max(Number(start)||0,Number(end)||0);
  if(rangeStart===rangeEnd)return next;
  let offset=0,hasCovered=false,allActive=true;
  const inspect=(inline,inlineOffset)=>{
    const text=String(inline?.text||''),a=Math.max(rangeStart,inlineOffset),b=Math.min(rangeEnd,inlineOffset+text.length);
    if(b<=a)return;hasCovered=true;if(!(inline.marks||[]).includes(mark))allActive=false;
  };
  const each=(callback)=>{
    offset=0;
    for(const block of next.blocks||[]){
      const groups=(block.type==='bulleted-list'||block.type==='numbered-list')
        ?(block.items||[]).map(item=>item?.children||[])
        :[block.children||[]];
      for(const group of groups){for(const inline of group){callback(inline,offset);offset+=String(inline?.text||'').length}offset+=1}
    }
  };
  each(inspect);if(!hasCovered)return next;
  const mode=allActive?'remove':'add';
  offset=0;
  for(const block of next.blocks||[]){
    const isList=block.type==='bulleted-list'||block.type==='numbered-list';
    const groups=isList?(block.items||[]).map(item=>item?.children||[]):[block.children||[]];
    groups.forEach((group,index)=>{
      const rebuilt=[];
      for(const inline of group){
        const text=String(inline?.text||''),localStart=Math.max(0,rangeStart-offset),localEnd=Math.min(text.length,rangeEnd-offset);
        if(localEnd<=localStart){rebuilt.push(inline);offset+=text.length;continue}
        const base=[...new Set(inline.marks||[])];
        const marks=mode==='remove'?base.filter(x=>x!==mark):[...new Set([...base,mark])];
        const make=(value,m)=>({...structuredClone(inline),text:value,marks:[...m]});
        if(localStart>0)rebuilt.push(make(text.slice(0,localStart),base));
        rebuilt.push(make(text.slice(localStart,localEnd),marks));
        if(localEnd<text.length)rebuilt.push(make(text.slice(localEnd),base));
        offset+=text.length;
      }
      if(isList)block.items[index]={children:rebuilt};else block.children=rebuilt;
      offset+=1;
    });
  }
  return next;
}


export function isRichTextMarkActive(document,start,end,mark){
  const a=Math.min(start,end),b=Math.max(start,end);let offset=0,covered=false,active=true;
  for(const block of document?.blocks||[])for(const inline of block.children||[]){
    const text=inline.text||'',x=Math.max(a,offset),y=Math.min(b,offset+text.length);
    if(y>x){covered=true;if(!(inline.marks||[]).includes(mark))active=false} offset+=text.length;
  }
  return covered&&active;
}
