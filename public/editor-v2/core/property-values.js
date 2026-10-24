import { validatedLinkHref } from './richtext-links.js';
import {parseTokenReference,compatibleTokens} from './design-tokens.js';
/*
 * Typed Inspector value validation. This module deliberately covers only the
 * controls the current Canvas/Renderer property map can actually consume.
 * Unsupported asset selection is NOT represented as a working text field.
 */
const lengthToken = /^(?:-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|%|vh|vw|rem|em)|0|auto)$/i;
const boxLengthToken = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|%|vh|vw|rem|em)$/i;
const hexColor = /^#[\da-f]{3}(?:[\da-f]{3})?(?:[\da-f]{2})?$/i;
const unitToken = /^(?:auto|0|px|%|vw|vh|rem|em)$/i;
export const INSPECTOR_FONTS = Object.freeze(['inherit','system-ui','Arial','Georgia','Verdana','monospace','sans-serif','serif']);
export const INSPECTOR_SHADOWS = Object.freeze(['none','0 2px 8px #0003','0 8px 24px #0005','0 16px 48px #0007']);

function numberBounds(property) {
  return property?.key === 'scale' ? [.1,4] : property?.key === 'opacity' ? [0, 1] :
    property?.key === 'lineHeight' ? [0.5, 5] :
    ['flexGrow','flexShrink'].includes(property?.key) ? [0, 100] : [-9999, 9999];
}

/** A declarative view of the same rules enforced by normalizeInspectorValue. */
export function getInspectorValueContract(property) {
  if (!property || typeof property !== 'object') return Object.freeze({kind:'unsupported'});
  const type=property.type;
  const tokens=Object.freeze(compatibleTokens(property));
  let contract;
  if(type==='select') contract={kind:'enum',values:Object.freeze([...(property.options||[])])};
  else if(type==='font') contract={kind:'enum',values:INSPECTOR_FONTS};
  else if(type==='shadow') contract={kind:'enum',values:INSPECTOR_SHADOWS};
  else if(type==='number') { const [min,max]=numberBounds(property);contract={kind:'number',min,max}; }
  else if(type==='dimension') contract=property.key==='rotate'
    ? {kind:'dimension',units:Object.freeze(['deg']),min:-360,max:360}
    : {kind:'dimension',units:Object.freeze([...(property.units||[])]),allowsZero:true,allowsAuto:Boolean(property.units?.includes('auto')),negative:['x','y','letterSpacing','wordSpacing','textIndent'].includes(property.key)};
  else if(type==='box') contract={kind:'box',maxParts:4,units:Object.freeze(['px','%','vh','vw','rem','em']),negativeMargin:property.key==='margin',negativePadding:false};
  else if(type==='asset') contract={kind:'asset-id',format:'uuid',allowsNone:true};
  else if(type==='color') contract={kind:'color',formats:Object.freeze(['hex','transparent'])};
  else if(type==='url') contract={kind:'url',policy:'validatedLinkHref'};
  else if(type==='text') contract={kind:'text',trimmed:true};
  else contract={kind:'unsupported'};
  return Object.freeze({...contract,tokens});
}

export function normalizeInspectorValue(property, input) {
  const type = property?.type;
  const value = String(input ?? '').trim();
  const token=parseTokenReference(value);
  if(token){if(!compatibleTokens(property).includes(token))throw new Error('Ez a közös stílus nem használható ebben a mezőben.');return value}
  if(type==='asset'){
    if(value==='none')return value;
    if(!/^[0-9a-f-]{36}$/i.test(value))throw new Error('Érvénytelen Médiatár-azonosító.');
    return value;
  }
  if (!value) throw new Error('Az üres érték helyett használd az Öröklés visszaállítása gombot.');
  if (type === 'select') {
    if (!property.options?.includes(value)) throw new Error('Érvénytelen választási lehetőség.');
    return value;
  }
  if (type === 'number') {
    const number = Number(value);
    const bounds = numberBounds(property);
    if (!Number.isFinite(number) || number < bounds[0] || number > bounds[1]) {
      throw new Error('A szám a megengedett tartományon kívül van.');
    }
    return String(number);
  }
  if (type === 'dimension') {
    if(property.key==='rotate'){if(!/^-?\d+(?:\.\d+)?deg$/.test(value)||Math.abs(parseFloat(value))>360)throw new Error('A forgatás -360 és 360 fok között lehet.');return value}
    if (!lengthToken.test(value)) throw new Error('Használj érvényes méretet: pl. 24px, 50%, 2rem vagy auto.');
    if (value.startsWith('-') && !['x','y','letterSpacing','wordSpacing','textIndent'].includes(property.key)) throw new Error('Itt nem használható negatív méret.');
    if (value === 'auto' && !property.units?.includes('auto')) throw new Error('Az auto itt nem használható.');
    if (value === '0') return '0';
    const unit = value.match(/[a-z%]+$/i)?.[0] || '';
    if (unit && !property.units?.includes(unit)) throw new Error('Ez a mértékegység nem támogatott.');
    return value;
  }
  if (type === 'box') {
    const parts = value.split(/\s+/);
    if (!['margin','padding'].includes(property.key) || parts.length > 4 || parts.some(part =>
      part !== '0' && !(property.key === 'margin' && part === 'auto') && !boxLengthToken.test(part))) {
      throw new Error('A térköz 1–4 méretből állhat, pl. 8px 16px.');
    }
    if(property.key==='padding'&&parts.some(part=>part.startsWith('-')))throw new Error('A belső térköz nem lehet negatív.');
    return parts.join(' ');
  }
  if (type === 'color') {
    if (!hexColor.test(value) && !/^transparent$/i.test(value)) {
      throw new Error('Adj meg HEX színt (#112233) vagy transparent értéket.');
    }
    return value;
  }
  if (type === 'font') {
    const fonts = ['inherit', 'system-ui', 'Arial', 'Georgia', 'Verdana', 'monospace', 'sans-serif', 'serif'];
    if (!fonts.includes(value)) throw new Error('Csak a támogatott betűcsaládok választhatók.');
    return value;
  }
  if (type === 'shadow') {
    const values = ['none', '0 2px 8px #0003', '0 8px 24px #0005', '0 16px 48px #0007'];
    if (!values.includes(value)) throw new Error('Ismeretlen árnyék preset.');
    return value;
  }
  if (type === 'url') return validatedLinkHref(value);
  if (type === 'text') return value;
  throw new Error('Ezt a vezérlőt még nem fejlesztettük le.');
}

export const INSPECTOR_LENGTH_UNITS = unitToken;
