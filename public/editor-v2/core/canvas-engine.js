/*
 * Sanci9517 Visual Editor v2 — Canvas Engine foundation.
 *
 * The Page Model remains the only source of truth. This module resolves the
 * active responsive style and maps canonical node geometry to the editor DOM.
 * It does not persist DOM state and it does not mutate the Page Model.
 */

import { resolveResponsiveValue } from './responsive.js';
import { contentDefaults } from './authored-content.js';
import { backgroundImageValue, legacyBackgroundColor, legacyBackgroundCompound, MEDIA_ASSET_ID } from './background-asset.js?v=20261030-legacy-background-compound';
export {legacyBackgroundColor} from './background-asset.js?v=20261030-legacy-background-compound';

export const STYLE_MAP = Object.freeze({
  width: 'width',
  height: 'height',
  minWidth: 'minWidth',
  maxWidth: 'maxWidth',
  minHeight: 'minHeight',
  maxHeight: 'maxHeight',
  aspectRatio:'aspectRatio',
  rotate:'rotate',
  scale:'scale',
  filter:'filter',
  transition:'transition',
  display: 'display',
  flexDirection: 'flexDirection',
  justifyContent: 'justifyContent',
  alignItems: 'alignItems',
  alignSelf: 'alignSelf',
  flexWrap: 'flexWrap',
  flexGrow: 'flexGrow',
  flexShrink: 'flexShrink',
  flexBasis: 'flexBasis',
  gap: 'gap',
  rowGap: 'rowGap',
  columnGap: 'columnGap',
  gridTemplateColumns: 'gridTemplateColumns',
  gridTemplateRows: 'gridTemplateRows',
  gridColumn: 'gridColumn',
  gridRow: 'gridRow',
  overflow: 'overflow',
  color: 'color',
  backgroundColor: 'backgroundColor',
  backgroundImage: 'backgroundImage',
  backgroundSize: 'backgroundSize',
  backgroundPosition: 'backgroundPosition',
  backgroundRepeat: 'backgroundRepeat',
  borderWidth: 'borderWidth',
  borderStyle: 'borderStyle',
  borderColor: 'borderColor',
  borderRadius: 'borderRadius',
  borderTopLeftRadius: 'borderTopLeftRadius',
  borderTopRightRadius: 'borderTopRightRadius',
  borderBottomRightRadius: 'borderBottomRightRadius',
  borderBottomLeftRadius: 'borderBottomLeftRadius',
  boxShadow: 'boxShadow',
  opacity: 'opacity',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  fontStyle: 'fontStyle',
  lineHeight: 'lineHeight',
  letterSpacing: 'letterSpacing',
  textAlign: 'textAlign',
  textTransform: 'textTransform',
  textDecoration: 'textDecoration',
  textWrap: 'textWrap',
  overflowWrap: 'overflowWrap',
  wordSpacing: 'wordSpacing',
  textIndent: 'textIndent',
  textShadow: 'textShadow',
  zIndex: 'zIndex',
  margin: 'margin',
  padding: 'padding',
  position: 'position',
  left: 'left',
  top: 'top'
});

// Offsets are stored separately from CSS `position` so dragging remains a
// simple responsive edit. CSS ignores left/top on static elements, therefore
// every renderer must make the node positioned when an offset is present.
export function needsRelativeOffsetPosition(style = {}) {
  const hasOffset = [style.x, style.y].some(value => value !== undefined && value !== null && value !== '');
  return hasOffset && (!style.position || style.position === 'static');
}

export function resolveNodeStyle(node, device = 'desktop') {
  const base = { ...contentDefaults(node,device),...(node?.style ?? {}) };
  const properties = new Set([
    ...Object.keys(base),
    ...Object.keys(node?.responsive?.desktop ?? {}),
    ...Object.keys(node?.responsive?.tablet ?? {}),
    ...Object.keys(node?.responsive?.mobile ?? {})
  ]);

  for (const property of properties) {
    const resolved = resolveResponsiveValue(node?.responsive, property, device);
    if (resolved.value !== undefined) base[property] = resolved.value;
  }
  return base;
}

export function applyNodeStyle(element, node, device = 'desktop') {
  const style = resolveNodeStyle(node, device);
  element.style.cssText = '';

  const rootStyleEnabled=node?.type!=='root'||node.metadata?.rootStyleVersion===1||node.metadata?.editorRootVersion===1;
  const legacyBackground=rootStyleEnabled?legacyBackgroundColor(style.background):'';
  const legacyCompound=rootStyleEnabled?legacyBackgroundCompound(style.background):null;
  if (legacyBackground) element.style.background=legacyBackground;
  else if(legacyCompound?.color)element.style.backgroundColor=legacyCompound.color;

  // Older documents may contain the CSS border shorthand. Apply it as a
  // fallback before Inspector longhands so responsive edits take precedence.
  if (style.border !== undefined && style.border !== null && style.border !== '') {
    element.style.border = String(style.border);
  }

  // Canonical order matters for shorthand/longhand pairs such as border radius.
  // The public renderer also emits declarations in STYLE_MAP order.
  for (const [property, cssProperty] of Object.entries(STYLE_MAP)) {
    if(property==='backgroundImage')continue;
    const value = style[property];
    if (!cssProperty || value === undefined || value === null || value === '') continue;
    element.style[cssProperty] = String(value);
  }
  element.style.backgroundImage=backgroundImageValue(style,{editor:true,legacyBackground:rootStyleEnabled});
  if(MEDIA_ASSET_ID.test(String(style.backgroundAssetId||''))){
    if(!style.backgroundSize)element.style.backgroundSize='cover';
    if(!style.backgroundPosition)element.style.backgroundPosition='center center';
    if(!style.backgroundRepeat)element.style.backgroundRepeat='no-repeat';
  }

  if (style.x !== undefined && style.x !== '') {
    element.style.left = String(style.x);
  }
  if (style.y !== undefined && style.y !== '') {
    element.style.top = String(style.y);
  }
  if (needsRelativeOffsetPosition(style)) element.style.position = 'relative';

  return style;
}

export function getNodeGeometry(node, device = 'desktop') {
  const style = resolveNodeStyle(node, device);
  return {
    x: style.x ?? '0px',
    y: style.y ?? '0px',
    width: style.width ?? 'auto',
    height: style.height ?? 'auto'
  };
}

export const CANVAS_ENGINE = Object.freeze({
  resolveNodeStyle,
  applyNodeStyle,
  getNodeGeometry
});
