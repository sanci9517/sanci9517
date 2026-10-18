import { getProperty } from '../core/property-registry.js';
import { normalizeInspectorValue } from '../core/property-values.js';

// Only values accepted by the canonical typed Inspector are offered here.
export const GEOMETRY_PRESETS = Object.freeze({
  'size.width': Object.freeze([['Auto', 'auto'], ['50%', '50%'], ['100%', '100%']]),
  'size.height': Object.freeze([['Auto', 'auto'], ['100px', '100px'], ['200px', '200px'], ['300px', '300px']])
});

export function renderGeometryPresets(propertyId, current, apply) {
  const property = getProperty(propertyId);
  const wrap = document.createElement('div');
  wrap.className = 'geometry-presets-wrap';
  const label = document.createElement('span');
  label.className = 'geometry-presets-label';
  label.textContent = `${property.label} gyorsbeállítások`;
  const options = document.createElement('div');
  options.className = 'geometry-presets';
  options.setAttribute('role', 'group');
  options.setAttribute('aria-label', label.textContent);
  for (const [name, raw] of GEOMETRY_PRESETS[propertyId] ?? []) {
    const value = normalizeInspectorValue(property, raw);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = name;
    button.dataset.value = value;
    button.setAttribute('aria-pressed', String(current === value));
    button.onclick = () => apply(value);
    options.append(button);
  }
  wrap.append(label, options);
  return wrap;
}
