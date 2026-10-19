import {GRADIENTS} from './state-styles.js';
/*
 * A deliberately narrow, versioned appearance snapshot. Content, element
 * size, position and container layout are not part of this clipboard: applying
 * a visual style to another text element must not move or resize it.
 */

export const STYLE_SNAPSHOT_VERSION = 1;
export const STYLE_SNAPSHOT_PROPERTIES = Object.freeze([
  'color',
  'backgroundColor',
  'backgroundImage',
  'borderWidth',
  'borderStyle',
  'borderColor',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomRightRadius',
  'borderBottomLeftRadius',
  'boxShadow',
  'opacity',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'textTransform',
  'textDecoration',
  'textWrap',
  'overflowWrap',
  'wordSpacing',
  'textIndent',
  'textShadow',
  'margin',
  'padding'
]);

const devices = Object.freeze(['desktop', 'tablet', 'mobile']);
const propertySet = new Set(STYLE_SNAPSHOT_PROPERTIES);

function pickProperties(source) {
  const picked = {};
  for (const key of STYLE_SNAPSHOT_PROPERTIES) {
    const value = source?.[key];
    if(key==='backgroundImage'&&!GRADIENTS.includes(value))continue;
    if (typeof value === 'string' && value.length <= 256) picked[key] = value;
    else if (typeof value === 'number' && Number.isFinite(value)) picked[key] = String(value);
  }
  return picked;
}

export function captureStyleSnapshot(node) {
  if (!node || typeof node !== 'object' || !node.id) {
    throw new Error('Nincs másolható elemstílus.');
  }
  const responsive = {};
  for (const device of devices) responsive[device] = pickProperties(node.responsive?.[device]);
  return Object.freeze({
    version: STYLE_SNAPSHOT_VERSION,
    sourceNodeId: node.id,
    style: Object.freeze(pickProperties(node.style)),
    responsive: Object.freeze(Object.fromEntries(
      devices.map(device => [device, Object.freeze(responsive[device])])
    ))
  });
}

/** Replace only copyable appearance values, retaining content and geometry. */
export function applyStyleSnapshot(node, snapshot) {
  if (!node || typeof node !== 'object') throw new Error('A cél elem nem található.');
  if (snapshot?.version !== STYLE_SNAPSHOT_VERSION || !snapshot.style || !snapshot.responsive) {
    throw new Error('A stílusmásolat nem támogatott vagy sérült.');
  }

  const style = { ...(node.style ?? {}) };
  for (const key of propertySet) delete style[key];
  Object.assign(style, pickProperties(snapshot.style));

  const responsive = Object.fromEntries(devices.map(device => {
    const values = { ...(node.responsive?.[device] ?? {}) };
    for (const key of propertySet) delete values[key];
    Object.assign(values, pickProperties(snapshot.responsive?.[device]));
    return [device, values];
  }));
  return { style, responsive };
}
