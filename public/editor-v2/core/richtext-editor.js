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

export function toggleRichTextMark(document,start,end,mark){
  const next=structuredClone(document);
  if(start===end||!mark) return next;
  let offset=0;
  for(const block of next.blocks||[]){
    if(block.type==='bulleted-list'||block.type==='numbered-list'){
      for(const item of block.items||[]){
        for(const inline of item||[]){
          const text=inline.text||'';
          const a=Math.max(0,start-offset),b=Math.min(text.length,end-offset);
          if(b>a){
            inline.marks=Array.isArray(inline.marks)?[...new Set(inline.marks)]:[];
            inline.marks=inline.marks.includes(mark)?inline.marks.filter(x=>x!==mark):[...inline.marks,mark];
          }
          offset+=text.length;
        }
        offset+=1;
      }
      continue;
    }
    for(const inline of block.children||[]){
      const text=inline.text||'';
      const a=Math.max(0,start-offset),b=Math.min(text.length,end-offset);
      if(b>a){
        inline.marks=Array.isArray(inline.marks)?[...new Set(inline.marks)]:[];
        inline.marks=inline.marks.includes(mark)?inline.marks.filter(x=>x!==mark):[...inline.marks,mark];
      }
      offset+=text.length;
    }
    offset+=1;
  }
  return next;
}

export function richTextLineIndexAtOffset(text,offset){
  return lineIndexAtOffset(text,offset);
}
