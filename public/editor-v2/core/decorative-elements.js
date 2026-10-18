// Shared between the Editor commands, Inspector and public renderer.
// Legacy divider/spacer nodes are only upgraded on explicit creation/edit.
export const DIVIDER_LINE_STYLES = Object.freeze(['solid','dashed','dotted','double']);
const VALID_HEX=/^#[0-9a-f]{6}$/i;

export function defaultDividerStyle() {
 return {version:1,thickness:2,color:'#94a3b8',lineStyle:'solid'};
}

export function normalizeDividerStyle(input) {
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Hiányzó elválasztóvonal-beállítás');
 const thickness=Number(input.thickness);
 if(input.version!==1||!Number.isInteger(thickness)||thickness<1||thickness>24)throw new Error('A vonal vastagsága 1 és 24 képpont között lehet');
 const color=String(input.color||'').trim();
 if(!VALID_HEX.test(color))throw new Error('A vonal színe #RRGGBB formátumú legyen');
 if(!DIVIDER_LINE_STYLES.includes(input.lineStyle))throw new Error('Nem támogatott vonalstílus');
 return {version:1,thickness,color:color.toLowerCase(),lineStyle:input.lineStyle};
}
