import {
  normalizeInspectorValue, INSPECTOR_FONTS, INSPECTOR_SHADOWS
} from '../core/property-values.js';

/** One property input. All changes go through the central command callback. */
export function renderPropertyInput(property, label, current, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'field typed-inspector-field';
  wrap.dataset.propertyId = property.id;
  const heading = document.createElement('div');
  heading.className = 'property-heading';
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
  const info = document.createElement('button');
  info.type = 'button';
  info.className = 'property-info-toggle';
  info.textContent = 'i';
  info.setAttribute('aria-label', label + ' magyarázata');
  info.setAttribute('aria-expanded', 'false');
  const help = document.createElement('small');
  help.className = 'property-help';
  help.hidden = true;
  help.textContent = property.help || describeProperty(property);
  info.onclick = () => {
    help.hidden = !help.hidden;
    info.setAttribute('aria-expanded', String(!help.hidden));
  };
  heading.append(title, info);
  wrap.append(heading, help);
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
  } else if (type === 'dimension') {
    const controls=document.createElement('div');controls.className='dimension-controls';
    const match=String(current??'').trim().match(/^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/i);
    const special=String(current??'').trim()==='auto'&&property.units?.includes('auto');
    const number=document.createElement('input');number.type='number';number.inputMode='decimal';
    number.step='any';number.value=special?'':match?.[1]??'';number.setAttribute('aria-label',label+' értéke');
    const unit=document.createElement('select');unit.setAttribute('aria-label',label+' mértékegysége');
    const blank=document.createElement('option');blank.value='';blank.textContent='Egység';unit.append(blank);
    for(const choice of property.units||[]){if(choice==='0')continue;const option=document.createElement('option');option.value=choice;option.textContent=choice==='auto'?'Auto':choice;unit.append(option)}
    if(special)unit.value='auto';
    else if(match){const selected=match[2]||'px';if([...unit.options].some(option=>option.value===selected))unit.value=selected;else unit.value=''}
    else unit.value=(property.units||[]).find(choice=>choice!=='auto'&&choice!=='0')||'';
    number.disabled=special;unit.onchange=()=>{number.disabled=unit.value==='auto';if(unit.value==='auto'){number.value='';save('auto')}else if(number.value)save(number.value+(unit.value||''))};
    number.onchange=()=>{if(number.value&&unit.value&&unit.value!=='auto')save(number.value+unit.value)};
    number.onkeydown=event=>{if(event.key==='Enter'){event.preventDefault();number.blur()}};
    controls.append(number,unit);wrap.append(controls);
    const note=document.createElement('small');note.className='property-unit-hint';
    note.textContent='Az egység módosítása megváltoztathatja a tényleges méretet.';wrap.append(note);
  } else {
    const input = document.createElement('input');
    input.id = controlId;
    input.type = type === 'number' ? 'number' : 'text';
    input.value = current ?? '';
    if (type === 'number') {
      input.step = property.key === 'opacity' || property.key === 'lineHeight' ? '0.1' : '1';
      if (property.key === 'opacity') { input.min = '0'; input.max = '1'; }
      if (property.key === 'lineHeight') { input.min = '0.5'; input.max = '5'; }
    }
    input.onchange = () => save(input.value);
    input.onkeydown = event => {if(event.key === 'Enter') {event.preventDefault();input.blur();}};
    wrap.append(input);
  }
  // Choice controls already expose every available option. Repeating the same
  // values as chips makes the Inspector longer without adding a faster choice.
  const choiceControl = ['select', 'font', 'shadow'].includes(type);
  if(property.presets?.length && !choiceControl && !['size.width','size.height'].includes(property.id)){
    const group=document.createElement('div');group.className='property-presets';group.setAttribute('role','group');group.setAttribute('aria-label',label+' gyorsbeállítások');
    for(const preset of property.presets){
      const button=document.createElement('button');button.type='button';button.className='property-preset';
      button.textContent=preset.label;button.dataset.value=preset.value;
      button.setAttribute('aria-pressed',String(String(current??'')===preset.value));
      if(type==='color'){button.classList.add('property-preset-color');button.style.setProperty('--preset-color',preset.value==='transparent'?'transparent':preset.value);button.title=preset.label+' · '+preset.value}
      button.onclick=()=>save(preset.value);group.append(button);
    }
    wrap.append(group);
  }
  wrap.append(error);
  return wrap;
}

function describeProperty(property) {
  const descriptions = {
    display: 'Megadja, hogy az elem normál blokk, Flexbox vagy rács elrendezés szerint jelenjen meg.',
    overflow: 'Azt szabályozza, mi történjen, ha a tartalom nagyobb az elemnél.',
    width: 'Az elem szélessége. A mobilnézethez külön értéket is megadhatsz.',
    height: 'Az elem magassága. Az „auto” a tartalomhoz igazítja.',
    color: 'A szöveg színe. HEX-kódot is beírhatsz, például #3366FF.',
    backgroundColor: 'Az elem hátterének színe; az átlátszó érték a mögötte levő tartalmat mutatja.',
    fontSize: 'A betűk mérete. A mértékegységgel együtt add meg, például 18px vagy 1.2rem.',
    fontFamily: 'A szöveg betűcsaládja. A betűtípus a publikált oldalon is érvényesül.',
    fontWeight: 'A szöveg vastagsága: a kisebb szám vékonyabb, a nagyobb vastagabb betűt jelent.',
    textAlign: 'A szöveget balra, középre, jobbra vagy sorkizártan rendezi.',
    padding: 'Belső tér az elem széle és a tartalma között.',
    margin: 'Külső tér az elem és a szomszédos elemek között.',
    borderRadius: 'Lekerekíti az elem sarkait.',
    boxShadow: 'Árnyékot ad az elem mögé; az árnyék a publikált oldalon is megjelenik.',
    opacity: 'Az elem átlátszósága 0 és 1 között. A 1 teljesen fed, a 0 láthatatlan.',
    href: 'A célcím lehet belső oldal, például /p/kezdolap, vagy teljes webcím.',
    position: 'Meghatározza, hogyan helyezkedjen el az elem a többi tartalomhoz képest.'
  };
  const key = property.key || property.id?.split('.').at(-1);
  return descriptions[key] || `${property.label || 'Ez a beállítás'} az elem megjelenését szabályozza. Próbáld ki az értéket, majd ellenőrizd az előnézetben.`;
}
