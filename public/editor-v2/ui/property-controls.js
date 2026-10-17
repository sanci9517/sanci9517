import {
  normalizeInspectorValue, INSPECTOR_FONTS, INSPECTOR_SHADOWS
} from '../core/property-values.js';

/** One property input. All changes go through the central command callback. */
export function renderPropertyInput(property, label, current, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'field typed-inspector-field';
  wrap.dataset.propertyId = property.id;
  const title = document.createElement('label');
  title.textContent = label;
  const controlId = 'prop-' + property.id.replaceAll('.', '-') + '-' + Math.random().toString(36).slice(2, 7);
  title.htmlFor = controlId;
  const error = document.createElement('small');
  error.className = 'property-validation';
  error.setAttribute('role', 'status');
  error.setAttribute('aria-live', 'polite');
  const save = raw => {
    try {
      const value = normalizeInspectorValue(property, raw);
      error.textContent = '';
      onChange(value);
    } catch (e) {
      error.textContent = e instanceof Error ? e.message : 'Érvénytelen érték';
    }
  };
  wrap.append(title);
  const type = property.type;
  if (type === 'asset') {
    const note = document.createElement('div');
    note.className = 'property-unavailable';
    note.textContent = 'Média-választó fejlesztés alatt – még nem szerkeszthető.';
    wrap.append(note);
    return wrap;
  }
  if (type === 'select' || type === 'font' || type === 'shadow') {
    const select = document.createElement('select');
    select.id = controlId;
    const choices = type === 'font' ? INSPECTOR_FONTS : type === 'shadow' ? INSPECTOR_SHADOWS : property.options;
    for (const value of ['', ...choices]) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value || '— Válassz —';
      select.append(option);
    }
    if (current && !choices.includes(String(current))) {
      const custom = document.createElement('option');
      custom.value = current;
      custom.textContent = 'Jelenlegi egyedi érték';
      select.append(custom);
    }
    select.value = current || '';
    select.onchange = () => save(select.value);
    wrap.append(select);
  } else if (type === 'color') {
    const controls = document.createElement('div');
    controls.className = 'typed-color-controls';
    const picker = document.createElement('input');
    picker.type = 'color';
    picker.id = controlId;
    picker.value = /^#[\da-f]{6}$/i.test(String(current)) ? current : '#808080';
    picker.setAttribute('aria-label', label + ' színválasztó');
    const hex = document.createElement('input');
    hex.type = 'text';
    hex.value = current || '';
    hex.placeholder = '#RRGGBB vagy transparent';
    hex.setAttribute('aria-label', label + ' HEX');
    picker.onchange = () => save(picker.value);
    hex.onchange = () => save(hex.value);
    controls.append(picker, hex);
    wrap.append(controls);
  } else if (type === 'box') {
    // Store the standard CSS four-value shorthand (top, right, bottom, left).
    const parts = String(current || '0').trim().split(/\s+/);
    const values = parts.length === 1 ? [parts[0],parts[0],parts[0],parts[0]] :
      parts.length === 2 ? [parts[0],parts[1],parts[0],parts[1]] :
      parts.length === 3 ? [parts[0],parts[1],parts[2],parts[1]] : parts.slice(0,4);
    const grid = document.createElement('div');
    grid.className = 'typed-box-controls';
    ['Felül','Jobb','Alul','Bal'].forEach((side,i) => {
      const field = document.createElement('label');
      field.textContent = side;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = values[i] || '0';
      input.setAttribute('aria-label', label + ' – ' + side);
      input.onchange = () => { values[i] = input.value.trim(); save(values.join(' ')); };
      field.append(input);
      grid.append(field);
    });
    wrap.append(grid);
  } else {
    const input = document.createElement('input');
    input.id = controlId;
    input.type = type === 'number' ? 'number' : 'text';
    input.value = current ?? '';
    if (type === 'dimension') input.placeholder = property.units?.join(' · ') || 'pl. 20px';
    if (type === 'number') {
      input.step = property.key === 'opacity' || property.key === 'lineHeight' ? '0.1' : '1';
      if (property.key === 'opacity') { input.min = '0'; input.max = '1'; }
      if (property.key === 'lineHeight') { input.min = '0.5'; input.max = '5'; }
    }
    input.onchange = () => save(input.value);
    input.onkeydown = event => {if(event.key === 'Enter') {event.preventDefault();input.blur();}};
    wrap.append(input);
    if (type === 'dimension') {
      const note = document.createElement('small');
      note.className = 'property-unit-hint';
      note.textContent = 'Egységek: ' + (property.units || []).join(', ');
      wrap.append(note);
    }
  }
  wrap.append(error);
  return wrap;
}
