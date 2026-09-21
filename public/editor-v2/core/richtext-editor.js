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

export function applyRichTextMarkToSelection(editor,mark){
  const selection=window.getSelection();
  if(!selection||selection.rangeCount===0||!selection.toString())return false;
  const range=selection.getRangeAt(0);
  if(!editor.contains(range.commonAncestorContainer))return false;
  const walker=document.createTreeWalker(editor,NodeFilter.SHOW_TEXT);
  const nodes=[];
  let node;
  while(node=walker.nextNode()){
    if(!range.intersectsNode(node))continue;
    const start=node===range.startContainer?range.startOffset:0;
    const end=node===range.endContainer?range.endOffset:node.nodeValue.length;
    if(end>start)nodes.push({node,start,end});
  }
  if(!nodes.length)return false;
  const tag=mark==='bold'?'strong':mark==='italic'?'em':mark==='underline'?'u':mark==='strike'?'s':mark==='code'?'code':null;
  if(!tag)return false;
  const allActive=nodes.every(({node})=>{let p=node.parentElement;while(p&&p!==editor){if(p.tagName.toLowerCase()===tag)return true;p=p.parentElement}return false});
  for(const item of [...nodes].reverse()){
    let target=item.node;
    const selectedLength=item.end-item.start;
    if(item.end<target.nodeValue.length)target.splitText(item.end);
    let selected=target;
    if(item.start>0)selected=target.splitText(item.start);
    const parent=selected.parentNode;
    if(allActive){
      const wrapper=selected.parentElement?.tagName.toLowerCase()===tag?selected.parentElement:null;
      if(wrapper){parent.insertBefore(selected,wrapper);if(!wrapper.textContent)wrapper.remove();else if(wrapper.childNodes.length===0)wrapper.remove()}
    }else{
      const wrapper=document.createElement(tag);parent.insertBefore(wrapper,selected);wrapper.append(selected);
    }
  }
  editor.normalize();
  return true;
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
