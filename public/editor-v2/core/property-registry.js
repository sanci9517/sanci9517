/*
 * Sanci9517 Visual Editor v2 — Property Registry
 *
 * The registry is the extensibility boundary for the Inspector. New editable
 * properties should be added here instead of creating another hardcoded
 * Inspector branch. Rendering and mutation remain owned by the Core command API.
 */

const groups = Object.freeze([
  { id: 'content', label: 'Tartalom', order: 10 },
  { id: 'layout', label: 'Elrendezés', order: 20 },
  { id: 'size', label: 'Méret', order: 30 },
  { id: 'spacing', label: 'Térközök', order: 40 },
  { id: 'flex', label: 'Flex', order: 50 },
  { id: 'grid', label: 'Grid', order: 60 },
  { id: 'position', label: 'Pozíció', order: 70 },
  { id: 'typography', label: 'Tipográfia', order: 80 },
  { id: 'background', label: 'Háttér', order: 90 },
  { id: 'border', label: 'Szegély', order: 100 },
  { id: 'radius', label: 'Lekerekítés', order: 110 },
  { id: 'shadow', label: 'Árnyék', order: 120 },
  { id: 'opacity', label: 'Átlátszóság', order: 130 },
  { id: 'transform', label: 'Transzformáció', order: 140 },
  { id: 'filter', label: 'Szűrők', order: 150 },
  { id: 'animation', label: 'Animáció', order: 160 },
  { id: 'interaction', label: 'Interakció', order: 170 },
  { id: 'responsive', label: 'Responsive', order: 180 },
  { id: 'accessibility', label: 'Akadálymentesítés', order: 190 },
  { id: 'seo', label: 'SEO', order: 200 },
  { id: 'data', label: 'Adat', order: 210 },
  { id: 'advanced', label: 'Haladó', order: 220 }
]);

const properties = [
  { id: 'content.text', group: 'content', label: 'Szöveg', type: 'text', command: 'element.update', appliesTo: ['heading', 'text', 'richtext', 'button', 'link'] },
  { id: 'content.href', group: 'content', label: 'Link / URL', type: 'url', command: 'element.update', appliesTo: ['link', 'button'] },
  { id: 'size.width', group: 'size', label: 'Szélesség', type: 'dimension', units: ['auto', 'px', '%', 'vw', 'rem'], responsive: true, command: 'style.set' },
  { id: 'size.height', group: 'size', label: 'Magasság', type: 'dimension', units: ['auto', 'px', '%', 'vh', 'rem'], responsive: true, command: 'style.set' },
  { id: 'spacing.margin', group: 'spacing', label: 'Külső térköz', type: 'box', responsive: true, command: 'style.set' },
  { id: 'spacing.padding', group: 'spacing', label: 'Belső térköz', type: 'box', responsive: true, command: 'style.set' },
  { id: 'layout.display', group: 'layout', label: 'Megjelenítés', type: 'select', options: ['block', 'flex', 'grid', 'inline', 'none'], responsive: true, command: 'style.set' },
  { id: 'layout.overflow', group: 'layout', label: 'Túlcsordulás', type: 'select', options: ['visible', 'hidden', 'auto', 'scroll'], responsive: true, command: 'style.set' },
  { id: 'position.position', group: 'position', label: 'Pozícionálás', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'], responsive: true, command: 'style.set' },
  { id: 'position.zIndex', group: 'position', label: 'Z-index', type: 'number', responsive: true, command: 'style.set' },
  { id: 'typography.fontFamily', group: 'typography', label: 'Betűtípus', type: 'font', responsive: true, command: 'style.set' },
  { id: 'typography.fontSize', group: 'typography', label: 'Betűméret', type: 'dimension', units: ['px', 'rem', 'em', 'vw'], responsive: true, command: 'style.set' },
  { id: 'typography.fontWeight', group: 'typography', label: 'Vastagság', type: 'select', options: ['300', '400', '500', '600', '700', '800', '900'], responsive: true, command: 'style.set' },
  { id: 'typography.lineHeight', group: 'typography', label: 'Sormagasság', type: 'number', responsive: true, command: 'style.set' },
  { id: 'typography.textAlign', group: 'typography', label: 'Igazítás', type: 'select', options: ['left', 'center', 'right', 'justify'], responsive: true, command: 'style.set' },
  { id: 'background.color', group: 'background', label: 'Háttérszín', type: 'color', responsive: true, command: 'style.set' },
  { id: 'background.image', group: 'background', label: 'Háttérkép', type: 'asset', responsive: true, command: 'style.set' },
  { id: 'border.width', group: 'border', label: 'Szegélyvastagság', type: 'dimension', units: ['0', 'px'], responsive: true, command: 'style.set' },
  { id: 'border.style', group: 'border', label: 'Szegélystílus', type: 'select', options: ['none', 'solid', 'dashed', 'dotted'], responsive: true, command: 'style.set' },
  { id: 'border.color', group: 'border', label: 'Szegélyszín', type: 'color', responsive: true, command: 'style.set' },
  { id: 'radius.all', group: 'radius', label: 'Lekerekítés', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'style.set' },
  { id: 'shadow.box', group: 'shadow', label: 'Árnyék', type: 'shadow', responsive: true, command: 'style.set' },
  { id: 'opacity.value', group: 'opacity', label: 'Átlátszóság', type: 'number', responsive: true, command: 'style.set' },
  { id: 'advanced.nodeName', group: 'advanced', label: 'Elem neve', type: 'text', command: 'element.update' }
];

const propertyMap = new Map(properties.map((property) => [property.id, Object.freeze({ ...property })]));
const groupMap = new Map(groups.map((group) => [group.id, Object.freeze({ ...group })]));

export function listPropertyGroups() {
  return [...groups].sort((a, b) => a.order - b.order);
}

export function getProperty(id) {
  return propertyMap.get(id) ?? null;
}

export function listProperties({ group = null, nodeType = null } = {}) {
  return properties.filter((property) => {
    if (group && property.group !== group) return false;
    if (nodeType && Array.isArray(property.appliesTo) && !property.appliesTo.includes(nodeType)) return false;
    return true;
  });
}

export function getPropertyGroup(id) {
  return groupMap.get(id) ?? null;
}

export function registerProperty(property) {
  if (!property?.id || !property?.group) throw new Error('A property id és group kötelező.');
  if (propertyMap.has(property.id)) throw new Error(`Property már létezik: ${property.id}`);
  if (!groupMap.has(property.group)) throw new Error(`Ismeretlen property group: ${property.group}`);
  const normalized = Object.freeze({ ...property });
  properties.push(normalized);
  propertyMap.set(normalized.id, normalized);
  return normalized;
}

export const PROPERTY_REGISTRY = Object.freeze({
  groups: listPropertyGroups,
  get: getProperty,
  list: listProperties,
  getGroup: getPropertyGroup,
  register: registerProperty
});
