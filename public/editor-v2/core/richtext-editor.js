import {RICH_TEXT_SCHEMA_VERSION,RICH_TEXT_TYPE} from './schema.js';

export function plainTextToRichText(value=''){
  const text=String(value);
  const lines=text.split(/\r?\n/);
  return {
    schemaVersion:RICH_TEXT_SCHEMA_VERSION,
    type:RICH_TEXT_TYPE,
    blocks:lines.map(line=>({
      type:'paragraph',
      children:[{type:'text',text:line,marks:[]}]
    }))
  };
}

export function richTextToPlainText(document){
  return (document?.blocks||[]).map(block=>{
    if(block.type==='bulleted-list'||block.type==='numbered-list'){
      return (block.items||[]).map(item=>(item||[]).map(inline=>inline.text||'').join('')).join('\n');
    }
    return (block.children||[]).map(inline=>inline.text||'').join('');
  }).join('\n');
}

function lineIndexAtOffset(text,offset){
  return String(text).slice(0,offset).split(/\r?\n/).length-1;
}

export function setRichTextBlockType(document,lineIndex,type='paragraph',level=1){
  const next=structuredClone(document);
  const block=next.blocks?.[lineIndex];
  if(!block) return next;
  if(type==='heading'){
    block.type='heading';
    block.level=Math.min(6,Math.max(1,Number(level)||1));
  }else{
    block.type=type;
    delete block.level;
  }
  return next;
}

function forEachRichTextInline(document,callback){
  let offset=0;
  for(const block of document?.blocks||[]){
    if(block.type==='bulleted-list'||block.type==='numbered-list'){
      for(const item of block.items||[]){
        for(const inline of item||[]){
          callback(inline,offset);
          offset+=(inline.text||'').length;
        }
        offset+=1;
      }
      continue;
    }
    for(const inline of block.children||[]){
      callback(inline,offset);
      offset+=(inline.text||'').length;
    }
    offset+=1;
  }
}

export function toggleRichTextMark(document,start,end,mark){
  const next=structuredClone(document);
  if(!mark||start===end) return next;
  let hasCoveredText=false;
  let allActive=true;
  forEachRichTextInline(next,(inline,offset)=>{
    const text=inline.text||'';
    const a=Math.max(start,offset);
    const b=Math.min(end,offset+text.length);
    if(b>a){
      hasCoveredText=true;
      const marks=Array.isArray(inline.marks)?[...new Set(inline.marks)]:[];
      if(!marks.includes(mark)) allActive=false;
    }
  });
  if(!hasCoveredText) return next;
  const nextMode=allActive?'remove':'add';
  forEachRichTextInline(next,(inline,offset)=>{
    const text=inline.text||'';
    const a=Math.max(start,offset);
    const b=Math.min(end,offset+text.length);
    if(b<=a) return;
    const marks=Array.isArray(inline.marks)?[...new Set(inline.marks)]:[];
    inline.marks=nextMode==='remove'?marks.filter(x=>x!==mark):[...new Set([...marks,mark])];
  });
  return next;
}

export function isRichTextMarkActive(document,start,end,mark){
  if(!mark) return false;
  const rangeStart=Math.min(start,end);
  const rangeEnd=Math.max(start,end);
  let hasCoveredText=false;
  let active=true;
  forEachRichTextInline(document,(inline,offset)=>{
    const text=inline.text||'';
    const a=Math.max(rangeStart,offset);
    const b=Math.min(rangeEnd,offset+text.length);
    if(b>a){
      hasCoveredText=true;
      const marks=Array.isArray(inline.marks)?inline.marks:[];
      if(!marks.includes(mark)) active=false;
    }
  });
  return hasCoveredText&&active;
}

export function richTextLineIndexAtOffset(text,offset){
  return lineIndexAtOffset(text,offset);
}
