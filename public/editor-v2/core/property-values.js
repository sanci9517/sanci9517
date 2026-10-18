import { validatedLinkHref } from './richtext-links.js';
/*
 * Typed Inspector value validation. This module deliberately covers only the
 * controls the current Canvas/Renderer property map can actually consume.
 * Unsupported asset selection is NOT represented as a working text field.
 */
const lengthToken = /^(?:-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|%|vh|vw|rem|em)|0|auto)$/i;
const hexColor = /^#[\da-f]{3}(?:[\da-f]{3})?(?:[\da-f]{2})?$/i;
const unitToken = /^(?:auto|0|px|%|vw|vh|rem|em)$/i;

export function normalizeInspectorValue(property, input) {
  const type = property?.type;
  const value = String(input ?? '').trim();
  if (!value) throw new Error('Az üres érték helyett használd az Öröklés visszaállítása gombot.');
  if (type === 'select') {
    if (!property.options?.includes(value)) throw new Error('Érvénytelen választási lehetőség.');
    return value;
  }
  if (type === 'number') {
    const number = Number(value);
    const bounds = property.key === 'opacity' ? [0, 1] :
      property.key === 'lineHeight' ? [0.5, 5] :
      ['flexGrow','flexShrink'].includes(property.key) ? [0, 100] : [-9999, 9999];
    if (!Number.isFinite(number) || number < bounds[0] || number > bounds[1]) {
      throw new Error('A szám a megengedett tartományon kívül van.');
    }
    return String(number);
  }
  if (type === 'dimension') {
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
    if (parts.length < 1 || parts.length > 4 || parts.some(p => !lengthToken.test(p))) {
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

export const INSPECTOR_FONTS = Object.freeze(['inherit','system-ui','Arial','Georgia','Verdana','monospace','sans-serif','serif']);
export const INSPECTOR_SHADOWS = Object.freeze(['none','0 2px 8px #0003','0 8px 24px #0005','0 16px 48px #0007']);
export const INSPECTOR_LENGTH_UNITS = unitToken;
