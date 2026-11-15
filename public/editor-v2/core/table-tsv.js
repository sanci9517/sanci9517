// Lossless, dependency-free TSV for the legacy authored-table Inspector.
// Cells containing quotes or delimiters use standard doubled-quote escaping.
export function serializeTableTsv(rows){
  return (Array.isArray(rows)?rows:[]).map(row=>(Array.isArray(row)?row:[]).map(value=>{
    const cell=typeof value==='string'?value:typeof value==='number'&&Number.isFinite(value)?String(value):'';
    return /["\t\r\n]/.test(cell)?`"${cell.replaceAll('"','""')}"`:cell;
  }).join('\t')).join('\n');
}

export function parseTableTsv(source){
  if(typeof source!=='string')throw new Error('A táblázat szöveges értéke szükséges.');
  const rows=[],row=[];let cell='',quoted=false,closedQuote=false;
  const pushCell=()=>{row.push(cell);cell='';closedQuote=false};
  const pushRow=()=>{pushCell();rows.push(row.splice(0))};
  for(let i=0;i<source.length;i++){
    const char=source[i];
    if(quoted){
      if(char==='"'){
        if(source[i+1]==='"'){cell+='"';i++}
        else{quoted=false;closedQuote=true}
      }else cell+=char;
      continue;
    }
    if(char==='\t'){pushCell();continue}
    if(char==='\r'||char==='\n'){
      if(char==='\r'&&source[i+1]==='\n')i++;
      pushRow();
      continue;
    }
    if(char==='"'&&cell.length===0&&!closedQuote){quoted=true;continue}
    if(closedQuote)throw new Error('A záró idézőjel után csak tabulátor vagy sortörés következhet.');
    cell+=char;
  }
  if(quoted)throw new Error('A táblázat egyik idézőjeles cellája nincs lezárva.');
  pushCell();rows.push(row);
  return rows;
}
