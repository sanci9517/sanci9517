/* Sanci9517 Visual Editor v2 — Responsive value resolution */

export const VIEWPORTS = Object.freeze(['desktop', 'tablet', 'mobile']);
const RESERVED_PROPERTY_KEYS = new Set(Object.getOwnPropertyNames(Object.prototype));

export function isSafeResponsivePropertyKey(property) {
  return typeof property === 'string' && property.length > 0 && !RESERVED_PROPERTY_KEYS.has(property);
}

export function normalizeResponsive(value) {
  if (!value || typeof value !== 'object') return { desktop: {}, tablet: {}, mobile: {} };
  return {
    desktop: { ...(value.desktop ?? {}) },
    tablet: { ...(value.tablet ?? {}) },
    mobile: { ...(value.mobile ?? {}) }
  };
}

export function resolveResponsiveValue(responsive, property, viewport = 'desktop') {
  if (!VIEWPORTS.includes(viewport) || !isSafeResponsivePropertyKey(property)) return { value: undefined, source: null, inherited: false };
  const normalized = normalizeResponsive(responsive);
  const order = viewport === 'mobile' ? ['mobile', 'tablet', 'desktop'] : viewport === 'tablet' ? ['tablet', 'desktop'] : ['desktop'];
  for (const device of order) {
    if (!Object.prototype.hasOwnProperty.call(normalized[device] ?? {}, property)) continue;
    const value = normalized[device]?.[property];
    if (value !== undefined && value !== null && value !== '') {
      return { value, source: device, inherited: device !== viewport };
    }
  }
  return { value: undefined, source: null, inherited: false };
}

export function hasResponsiveOverride(responsive, property, viewport) {
  if (!VIEWPORTS.includes(viewport) || !isSafeResponsivePropertyKey(property)) return false;
  const normalized = normalizeResponsive(responsive);
  return Object.prototype.hasOwnProperty.call(normalized[viewport] ?? {}, property);
}

export function setResponsiveValue(responsive, property, viewport, value) {
  if (!VIEWPORTS.includes(viewport)) throw new Error(`Ismeretlen viewport: ${viewport}`);
  if (!isSafeResponsivePropertyKey(property)) throw new Error('Érvénytelen responsive tulajdonság.');
  const next = normalizeResponsive(responsive);
  if (value === undefined || value === null || value === '') delete next[viewport][property];
  else next[viewport][property] = value;
  return next;
}

export function resetResponsiveValue(responsive, property, viewport) {
  return setResponsiveValue(responsive, property, viewport, undefined);
}
