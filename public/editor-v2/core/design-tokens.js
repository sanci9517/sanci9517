/* Brand Kit owns these site-wide tokens; pages store references, not copies. */
export const TOKEN_SPECS=Object.freeze({
  'colors.primary':{label:'Márkaszín',kind:'color',value:'#7047eb'},
  'colors.text':{label:'Szövegszín',kind:'color',value:'#182335'},
  'colors.surface':{label:'Felületszín',kind:'color',value:'#ffffff'},
  'colors.border':{label:'Keretszín',kind:'color',value:'#dce2eb'},
  'typography.font':{label:'Márkabetű',kind:'font',value:'system-ui'},
  'typography.bodySize':{label:'Alap betűméret',kind:'length',value:'16px'},
  'typography.headingSize':{label:'Címméret',kind:'length',value:'36px'},
  'typography.lineHeight':{label:'Alap sormagasság',kind:'number',value:'1.6'},
  'spacing.small':{label:'Kis térköz',kind:'length',value:'8px'},
  'spacing.medium':{label:'Közepes térköz',kind:'length',value:'16px'},
  'spacing.large':{label:'Nagy térköz',kind:'length',value:'32px'},
  'radii.card':{label:'Kártya lekerekítése',kind:'length',value:'16px'},
  'shadows.card':{label:'Kártya árnyéka',kind:'shadow',value:'0 8px 24px #0005'}
});
const groups=['colors','typography','spacing','radii','shadows','borders','layout','responsive','motion','states','accessibility'];
export function defaultTokens(){const tokens=Object.fromEntries(groups.map(group=>[group,{}]));for(const [id,spec] of Object.entries(TOKEN_SPECS)){const [group,key]=id.split('.');tokens[group][key]=spec.value}return tokens}
export function tokenValue(tokens,id){const [group,key]=id.split('.');return tokens?.[group]?.[key]??TOKEN_SPECS[id]?.value}
export function normalizeTokens(input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Hibás stíluskészlet.');
  const output=defaultTokens();
  for(const [group,values] of Object.entries(input)){
    if(!groups.includes(group)||!values||typeof values!=='object'||Array.isArray(values))throw new Error('Ismeretlen stíluscsoport.');
    for(const [key,value] of Object.entries(values)){
      const spec=TOKEN_SPECS[group+'.'+key];if(!spec||typeof value!=='string')throw new Error('Ismeretlen stílusérték.');
      const raw=value.trim();
      if(spec.kind==='color'&&!/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(raw))throw new Error('HEX szín szükséges.');
      if(spec.kind==='font'&&!['system-ui','Arial','Georgia','Verdana','monospace','sans-serif','serif'].includes(raw))throw new Error('Nem támogatott betűcsalád.');
      if(spec.kind==='length'&&(!/^(?:0|\d+(?:\.\d+)?(?:px|rem|em))$/.test(raw)||parseFloat(raw)>200||(group==='typography'&&parseFloat(raw)<8&&raw.endsWith('px'))))throw new Error('Érvénytelen méret. Használj px, rem vagy em értéket.');
      if(spec.kind==='number'&&(!/^(?:\d+(?:\.\d+)?)$/.test(raw)||Number(raw)<.5||Number(raw)>3))throw new Error('A sormagasság .5 és 3 között lehet.');
      if(spec.kind==='shadow'&&!['none','0 2px 8px #0003','0 8px 24px #0005','0 16px 48px #0007'].includes(raw))throw new Error('Ismeretlen árnyék.');
      output[group][key]=raw;
    }
  }
  return output;
}
export function tokenVariable(id){return '--creator-'+id.replaceAll('.','-')}
export function tokenReference(id){const spec=TOKEN_SPECS[id];if(!spec)throw new Error('Ismeretlen stílushivatkozás.');return `var(${tokenVariable(id)}, ${spec.value})`}
export function parseTokenReference(value){return Object.keys(TOKEN_SPECS).find(id=>tokenReference(id)===value)||null}
export function compatibleTokens(property){
  const key=property?.key;
  return Object.entries(TOKEN_SPECS).filter(([id,spec])=>
    spec.kind==='color'?['color','backgroundColor','borderColor'].includes(key):
    spec.kind==='font'?key==='fontFamily':
    spec.kind==='number'?key==='lineHeight':
    spec.kind==='shadow'?key==='boxShadow':
    id.startsWith('spacing.')?['padding','margin','gap','rowGap','columnGap'].includes(key):
    id.startsWith('radii.')?['borderRadius','borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'].includes(key):key==='fontSize'
  ).map(([id])=>id);
}
export function applyTokenVariables(element,tokens){
  const normalized=normalizeTokens(tokens||defaultTokens());for(const id of Object.keys(TOKEN_SPECS))element.style.setProperty(tokenVariable(id),tokenValue(normalized,id));
}
