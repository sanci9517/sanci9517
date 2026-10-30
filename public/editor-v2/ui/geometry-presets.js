import { getProperty } from '../core/property-registry.js?v=20261030-inspector-default-contract';
import { normalizeInspectorValue } from '../core/property-values.js';

// Geometry options come from the same registry as each Inspector field.
export const GEOMETRY_PRESETS = Object.freeze(Object.fromEntries(
  ['size.width','size.height'].map(id=>[id,Object.freeze((getProperty(id)?.presets??[]).map(({label,value})=>[label,value]))])
));

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
    button.dataset.propertyCommand = property.command;
    button.dataset.propertyKey = property.key;
    button.setAttribute('aria-pressed', String(current === value));
    button.onclick = () => apply(value);
    options.append(button);
  }
  wrap.append(label, options);
  return wrap;
}
