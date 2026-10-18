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
  { id: 'size.width', key: 'width', group: 'size', label: 'Szélesség', type: 'dimension', units: ['auto', 'px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.height', key: 'height', group: 'size', label: 'Magasság', type: 'dimension', units: ['auto', 'px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.minWidth', key: 'minWidth', group: 'size', label: 'Min. szélesség', type: 'dimension', units: ['px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.maxWidth', key: 'maxWidth', group: 'size', label: 'Max. szélesség', type: 'dimension', units: ['px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.minHeight', key: 'minHeight', group: 'size', label: 'Min. magasság', type: 'dimension', units: ['px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'size.maxHeight', key: 'maxHeight', group: 'size', label: 'Max. magasság', type: 'dimension', units: ['px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'spacing.margin', key: 'margin', group: 'spacing', label: 'Külső térköz', type: 'box', responsive: true, command: 'responsive.set' },
  { id: 'spacing.padding', key: 'padding', group: 'spacing', label: 'Belső térköz', type: 'box', responsive: true, command: 'responsive.set' },
  { id: 'layout.display', key: 'display', group: 'layout', label: 'Megjelenítés', type: 'select', options: ['block', 'flex', 'grid', 'inline', 'none'], responsive: true, command: 'responsive.set' },
  { id: 'layout.overflow', key: 'overflow', group: 'layout', label: 'Túlcsordulás', type: 'select', options: ['visible', 'hidden', 'auto', 'scroll'], responsive: true, command: 'responsive.set' },
  { id: 'position.position', key: 'position', group: 'position', label: 'Pozícionálás', type: 'select', options: ['static', 'relative', 'absolute', 'fixed', 'sticky'], responsive: true, command: 'responsive.set' },
  { id: 'position.x', key: 'x', group: 'position', label: 'X pozíció', type: 'dimension', units: ['px', '%', 'vw', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'position.y', key: 'y', group: 'position', label: 'Y pozíció', type: 'dimension', units: ['px', '%', 'vh', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'position.zIndex', key: 'zIndex', group: 'position', label: 'Z-index', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'typography.fontFamily', key: 'fontFamily', group: 'typography', label: 'Betűtípus', type: 'font', responsive: true, command: 'responsive.set' },
  { id: 'typography.fontSize', key: 'fontSize', group: 'typography', label: 'Betűméret', type: 'dimension', units: ['px', 'rem', 'em', 'vw'], responsive: true, command: 'responsive.set' },
  { id: 'typography.fontWeight', key: 'fontWeight', group: 'typography', label: 'Vastagság', type: 'select', options: ['300', '400', '500', '600', '700', '800', '900'], responsive: true, command: 'responsive.set' },
  { id: 'typography.lineHeight', key: 'lineHeight', group: 'typography', label: 'Sormagasság', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'typography.letterSpacing', key: 'letterSpacing', group: 'typography', label: 'Betűköz', type: 'dimension', units: ['px', 'rem', 'em'], responsive: true, command: 'responsive.set' },
  { id: 'typography.textAlign', key: 'textAlign', group: 'typography', label: 'Igazítás', type: 'select', options: ['left', 'center', 'right', 'justify'], responsive: true, command: 'responsive.set' },
  { id: 'background.color', key: 'backgroundColor', group: 'background', label: 'Háttérszín', type: 'color', responsive: true, command: 'responsive.set' },
  { id: 'background.image', key: 'backgroundImage', group: 'background', label: 'Háttérkép', type: 'asset', responsive: true, command: 'responsive.set' },
  { id: 'border.width', key: 'borderWidth', group: 'border', label: 'Szegélyvastagság', type: 'dimension', units: ['0', 'px'], responsive: true, command: 'responsive.set' },
  { id: 'border.style', key: 'borderStyle', group: 'border', label: 'Szegélystílus', type: 'select', options: ['none', 'solid', 'dashed', 'dotted'], responsive: true, command: 'responsive.set' },
  { id: 'border.color', key: 'borderColor', group: 'border', label: 'Szegélyszín', type: 'color', responsive: true, command: 'responsive.set' },
  { id: 'radius.all', key: 'borderRadius', group: 'radius', label: 'Lekerekítés', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.topLeft', key: 'borderTopLeftRadius', group: 'radius', label: 'Bal felső sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.topRight', key: 'borderTopRightRadius', group: 'radius', label: 'Jobb felső sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.bottomRight', key: 'borderBottomRightRadius', group: 'radius', label: 'Jobb alsó sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'radius.bottomLeft', key: 'borderBottomLeftRadius', group: 'radius', label: 'Bal alsó sarok', type: 'dimension', units: ['0', 'px', 'rem', '%'], responsive: true, command: 'responsive.set' },
  { id: 'shadow.box', key: 'boxShadow', group: 'shadow', label: 'Árnyék', type: 'shadow', responsive: true, command: 'responsive.set' },
  { id: 'opacity.value', key: 'opacity', group: 'opacity', label: 'Átlátszóság', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'flex.direction', key: 'flexDirection', group: 'flex', label: 'Irány', type: 'select', options: ['row', 'column', 'row-reverse', 'column-reverse'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.justify', key: 'justifyContent', group: 'flex', label: 'Vízszintes elosztás', type: 'select', options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.align', key: 'alignItems', group: 'flex', label: 'Elemek igazítása', type: 'select', options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.wrap', key: 'flexWrap', group: 'flex', label: 'Tördelés', type: 'select', options: ['nowrap', 'wrap', 'wrap-reverse'], appliesTo: ['flex','row','columns','stack'], responsive: true, command: 'responsive.set' },
  { id: 'flex.gap', key: 'gap', group: 'flex', label: 'Elemköz', type: 'dimension', units: ['px', 'rem', 'em', '%'], appliesTo: ['flex','row','columns','stack','grid'], responsive: true, command: 'responsive.set' },
  { id: 'flex.grow', key: 'flexGrow', group: 'flex', label: 'Növekedés', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'flex.shrink', key: 'flexShrink', group: 'flex', label: 'Zsugorodás', type: 'number', responsive: true, command: 'responsive.set' },
  { id: 'flex.basis', key: 'flexBasis', group: 'flex', label: 'Alapméret', type: 'dimension', units: ['auto', 'px', '%', 'rem'], responsive: true, command: 'responsive.set' },
  { id: 'flex.alignSelf', key: 'alignSelf', group: 'flex', label: 'Saját igazítás', type: 'select', options: ['auto', 'stretch', 'flex-start', 'center', 'flex-end', 'baseline'], responsive: true, command: 'responsive.set' },
  { id: 'grid.columns', key: 'gridTemplateColumns', group: 'grid', label: 'Oszlopok', type: 'select', options: ['1fr', 'repeat(2, minmax(0, 1fr))', 'repeat(3, minmax(0, 1fr))', 'repeat(4, minmax(0, 1fr))'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  { id: 'grid.rows', key: 'gridTemplateRows', group: 'grid', label: 'Sorok', type: 'select', options: ['auto', '1fr', 'repeat(2, minmax(0, 1fr))', 'repeat(3, minmax(0, 1fr))'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  { id: 'grid.column', key: 'gridColumn', group: 'grid', label: 'Oszlophely', type: 'select', options: ['auto', '1', '2', '3', '4', '1 / -1'], responsive: true, command: 'responsive.set' },
  { id: 'grid.row', key: 'gridRow', group: 'grid', label: 'Sorhely', type: 'select', options: ['auto', '1', '2', '3', '4', '1 / -1'], responsive: true, command: 'responsive.set' },
  { id: 'grid.rowGap', key: 'rowGap', group: 'grid', label: 'Sorköz', type: 'dimension', units: ['px', 'rem', 'em', '%'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  { id: 'grid.columnGap', key: 'columnGap', group: 'grid', label: 'Oszlopköz', type: 'dimension', units: ['px', 'rem', 'em', '%'], appliesTo: ['grid'], responsive: true, command: 'responsive.set' },
  { id: 'advanced.nodeName', group: 'advanced', label: 'Elem neve', type: 'text', command: 'element.update' }
];

// Named, validated starting points are owned by the same registry as each
// property. The Inspector may show them inline, while a future token/preset
// module can consume this exact source without duplicating CSS semantics.
const presets = Object.freeze({
  'size.width': [['Auto','auto'],['Keskeny 320','320px'],['Tartalom 480','480px'],['Fél szélesség','50%'],['Kétharmad','66.6667%'],['Háromnegyed','75%'],['Teljes szélesség','100%'],['Tablet 768','768px'],['Laptop 1024','1024px'],['Asztali 1200','1200px']],
  'size.height': [['Auto','auto'],['Kompakt 120','120px'],['Közepes 240','240px'],['Szakasz 400','400px'],['Fél képernyő','50vh'],['Teljes képernyő','100vh']],
  'size.minWidth': [['320px','320px'],['480px','480px'],['640px','640px'],['768px','768px']],
  'size.maxWidth': [['640px','640px'],['768px','768px'],['1024px','1024px'],['1200px','1200px'],['1440px','1440px'],['Teljes','100%']],
  'size.minHeight': [['120px','120px'],['240px','240px'],['400px','400px'],['50vh','50vh']],
  'size.maxHeight': [['400px','400px'],['600px','600px'],['800px','800px'],['Teljes képernyő','100vh']],
  'position.position': [['Normál folyás','static'],['Mozgatható','relative'],['Réteg','absolute'],['Ragadós','sticky']],
  'position.x': [['0','0'],['Kis eltolás · 8','8px'],['Eltolás · 16','16px'],['Eltolás · 32','32px'],['Fél szélesség','50%']],
  'position.y': [['0','0'],['Kis eltolás · 8','8px'],['Eltolás · 16','16px'],['Eltolás · 32','32px'],['Fél magasság','50%']],
  'position.zIndex': [['Alap · 0','0'],['Réteg · 1','1'],['Fent · 10','10'],['Overlay · 100','100']],
  'spacing.margin': [['Nincs','0'],['XS · 4','4px'],['S · 8','8px'],['M · 16','16px'],['L · 24','24px'],['XL · 32','32px'],['Középre','0 auto']],
  'spacing.padding': [['Nincs','0'],['XS · 4','4px'],['S · 8','8px'],['M · 16','16px'],['L · 24','24px'],['XL · 32','32px'],['Szakasz · 48','48px'],['Kártya · 16/24','16px 24px']],
  'layout.display': [['Blokk','block'],['Egymás mellé','flex'],['Rács','grid']],
  'layout.overflow': [['Látható','visible'],['Levágás','hidden'],['Görgethető','auto']],
  'typography.fontSize': [['Apró · 12','12px'],['Kicsi · 14','14px'],['Törzs · 16','16px'],['Kiemelt · 20','20px'],['Alcím · 24','24px'],['Címsor · 32','32px'],['Nagy · 48','48px'],['Hero · 64','64px']],
  'typography.fontFamily': [['Rendszer','system-ui'],['Arial','Arial'],['Georgia','Georgia'],['Verdana','Verdana'],['Monospace','monospace']],
  'typography.fontWeight': [['Vékony · 300','300'],['Normál · 400','400'],['Közepes · 500','500'],['Félkövér · 600','600'],['Erős · 700','700'],['Extra · 800','800'],['Fekete · 900','900']],
  'typography.lineHeight': [['Szoros · 1.1','1.1'],['Cím · 1.25','1.25'],['Kompakt · 1.4','1.4'],['Kényelmes · 1.5','1.5'],['Laza · 1.75','1.75'],['Dupla · 2','2']],
  'typography.letterSpacing': [['Szoros · -0.5','-0.5px'],['Normál · 0','0'],['Nyitott · 0.5','0.5px'],['Tág · 1','1px']],
  'typography.textAlign': [['Balra','left'],['Középre','center'],['Jobbra','right'],['Sorkizárt','justify']],
  'background.color': [['Fehér','#ffffff'],['Világos','#f1f5f9'],['Palaszürke','#64748b'],['Sötét','#0f172a'],['Kék','#2563eb'],['Lila','#7c3aed'],['Áttetsző','transparent']],
  'border.width': [['Nincs','0'],['Vékony · 1','1px'],['Normál · 2','2px'],['Erős · 4','4px']],
  'border.style': [['Nincs','none'],['Folytonos','solid'],['Szaggatott','dashed'],['Pontozott','dotted']],
  'border.color': [['Sötét','#0f172a'],['Szürke','#94a3b8'],['Világos','#e2e8f0'],['Kék','#2563eb']],
  'radius.all': [['Éles · 0','0'],['Finom · 4','4px'],['Kártya · 8','8px'],['Lágy · 16','16px'],['Kerek · 24','24px'],['Pill · 999','999px']],
  'radius.topLeft': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'radius.topRight': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'radius.bottomRight': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'radius.bottomLeft': [['0','0'],['4px','4px'],['8px','8px'],['16px','16px'],['24px','24px']],
  'shadow.box': [['Nincs','none'],['Finom','0 2px 8px #0003'],['Kártya','0 8px 24px #0005'],['Emelt','0 16px 48px #0007']],
  'opacity.value': [['Teljes · 100%','1'],['Halvány · 75%','0.75'],['Fél · 50%','0.5'],['Visszafogott · 25%','0.25']],
  'flex.direction': [['Sor','row'],['Oszlop','column']],
  'flex.justify': [['Kezdő','flex-start'],['Közép','center'],['Vég','flex-end'],['Közte elosztva','space-between'],['Egyenletes','space-evenly']],
  'flex.align': [['Nyújtás','stretch'],['Közép','center'],['Fent','flex-start'],['Lent','flex-end']],
  'flex.wrap': [['Egy sor','nowrap'],['Tördelés','wrap']],
  'flex.grow': [['Ne nőjön','0'],['Töltse ki a helyet','1'],['Kétszeres','2']],
  'flex.shrink': [['Ne zsugorodjon','0'],['Rugalmas','1'],['Erősebben zsugorodjon','2']],
  'flex.gap': [['Nincs','0'],['Szoros · 8','8px'],['Normál · 16','16px'],['Laza · 24','24px'],['Tág · 32','32px']],
  'flex.basis': [['Automatikus','auto'],['25%','25%'],['50%','50%'],['75%','75%'],['Teljes','100%']],
  'flex.alignSelf': [['Szülőtől','auto'],['Nyújtás','stretch'],['Közép','center'],['Fent','flex-start'],['Lent','flex-end']],
  'grid.columns': [['1 oszlop','1fr'],['2 oszlop','repeat(2, minmax(0, 1fr))'],['3 oszlop','repeat(3, minmax(0, 1fr))'],['4 oszlop','repeat(4, minmax(0, 1fr))']],
  'grid.rows': [['Automatikus','auto'],['Egy sor','1fr'],['2 sor','repeat(2, minmax(0, 1fr))'],['3 sor','repeat(3, minmax(0, 1fr))']],
  'grid.column': [['Automatikus','auto'],['1. oszlop','1'],['2. oszlop','2'],['3. oszlop','3'],['4. oszlop','4'],['Teljes sor','1 / -1']],
  'grid.row': [['Automatikus','auto'],['1. sor','1'],['2. sor','2'],['3. sor','3'],['4. sor','4'],['Teljes oszlop','1 / -1']],
  'grid.rowGap': [['Nincs','0'],['Szoros · 8','8px'],['Normál · 16','16px'],['Laza · 24','24px'],['Tág · 32','32px']],
  'grid.columnGap': [['Nincs','0'],['Szoros · 8','8px'],['Normál · 16','16px'],['Laza · 24','24px'],['Tág · 32','32px']]
});

const propertyMap = new Map(properties.map((property) => [property.id, Object.freeze({ ...property,
  presets: presets[property.id] ? Object.freeze(presets[property.id].map(([label,value])=>Object.freeze({label,value}))) : undefined
})]));
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
  }).map(property=>propertyMap.get(property.id));
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
