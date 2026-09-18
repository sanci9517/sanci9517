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
