/*
 * Sanci9517 Visual Editor v2 — Canvas Engine foundation.
 *
 * The Page Model remains the only source of truth. This module resolves the
 * active responsive style and maps canonical node geometry to the editor DOM.
 * It does not persist DOM state and it does not mutate the Page Model.
 */

import { resolveResponsiveValue } from './responsive.js';

const STYLE_MAP = Object.freeze({
  width: 'width',
  height: 'height',
  display: 'display',
  overflow: 'overflow',
  color: 'color',
  backgroundColor: 'backgroundColor',
  backgroundImage: 'backgroundImage',
  borderWidth: 'borderWidth',
  borderStyle: 'borderStyle',
  borderColor: 'borderColor',
  borderRadius: 'borderRadius',
  boxShadow: 'boxShadow',
  opacity: 'opacity',
  fontFamily: 'fontFamily',
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  lineHeight: 'lineHeight',
  textAlign: 'textAlign',
  zIndex: 'zIndex',
  margin: 'margin',
  padding: 'padding',
  position: 'position',
  left: 'left',
  top: 'top'
});

export function resolveNodeStyle(node, device = 'desktop') {
  const base = { ...(node?.style ?? {}) };
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

  for (const [property, value] of Object.entries(style)) {
    const cssProperty = STYLE_MAP[property];
    if (!cssProperty || value === undefined || value === null || value === '') continue;
    element.style[cssProperty] = String(value);
  }

  if (style.x !== undefined && style.x !== '') {
    element.style.left = String(style.x);
    if (!style.position || style.position === 'static') element.style.position = 'relative';
  }
  if (style.y !== undefined && style.y !== '') {
    element.style.top = String(style.y);
    if (!style.position || style.position === 'static') element.style.position = 'relative';
  }

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
