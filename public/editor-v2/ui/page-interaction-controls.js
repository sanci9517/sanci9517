import { PAGE_ACTIONS, normalizePageInteractions } from '../core/page-interactions.js?v=20261117-edt039-page-action-registry-v1';

const ACTION_OPTIONS = Object.freeze([
  ['scroll-to', 'Ugrás egy elemhez'],
  ['select-tab', 'Fül kiválasztása'],
  ['toggle-disclosure', 'Lenyitható rész váltása']
]);
const labelFor = node => `${String(node?.name || node?.type || 'Elem').slice(0, 80)} · ${node?.type || 'ismeretlen'}`;
const itemLabel = (node, index) => {
  const item = node?.props?.items?.[index];
  return String(item?.title || `${node.type === 'tabs' ? 'Fül' : 'Rész'} ${index + 1}`).slice(0, 100);
};

function select(label, options, value) {
  const wrap = document.createElement('label');
  wrap.className = 'content-schema-field page-interaction-field';
  wrap.dataset.pageInteractionField = label;
  const caption = document.createElement('span');
  caption.textContent = label;
  const input = document.createElement('select');
  input.setAttribute('aria-label', label);
  for (const [optionValue, optionLabel] of options) {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionLabel;
    input.append(option);
  }
  input.value = value;
  wrap.append(caption, input);
  return { wrap, input };
}

export function renderPageInteractionControls(node, page, apply, disabled = false) {
  const section = document.createElement('section');
  section.className = 'page-interaction-inspector';
  section.setAttribute('aria-labelledby', 'pageInteractionHeading');
  const heading = document.createElement('h3');
  heading.id = 'pageInteractionHeading';
  heading.textContent = 'Oldalinterakció';
  const help = document.createElement('p');
  help.className = 'content-field-help';
  help.textContent = 'Biztonságos, billentyűzettel is működő művelet. Nem futtat JavaScriptet, és nem navigál másik webhelyre.';
  section.append(heading, help);
  if (typeof node.props?.href === 'string' && node.props.href.trim()) {
    const note = document.createElement('p');
    note.className = 'content-field-help';
    note.textContent = 'A gomb jelenleg hivatkozás. Töröld a Hivatkozás mezőt, ha helyette oldalinterakciót szeretnél.';
    section.append(note);
    return section;
  }

  const nodes = page?.nodes && typeof page.nodes === 'object' ? page.nodes : {};
  const candidates = Object.values(nodes).filter(target => target?.id !== node.id && target?.type !== 'root' && target?.metadata?.contentVersion === 1);
  const current = Array.isArray(node.interactions) ? node.interactions[0] : null;
  let currentValid = null;
  try { currentValid = normalizePageInteractions(current ? [current] : [], node, nodes)[0] ?? null; }
  catch { /* Preserve old/invalid data until the user explicitly replaces or clears it. */ }
  const actionSelect = select('Művelet', [['', 'Nincs beállítva'], ...ACTION_OPTIONS], currentValid?.action || '');
  actionSelect.wrap.dataset.pageInteractionField = 'action';
  section.append(actionSelect.wrap);

  const addNote = text => {
    const note = document.createElement('p');
    note.className = 'content-field-help';
    note.setAttribute('role', 'status');
    note.textContent = text;
    section.append(note);
  };

  const refresh = () => {
    section.querySelectorAll('[data-page-interaction-dynamic]').forEach(element => element.remove());
    const action = actionSelect.input.value;
    if (!action) {
      if (current && currentValid) {
        const clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'secondary-action';
        clear.dataset.pageInteractionDynamic = '1';
        clear.textContent = 'Interakció eltávolítása';
        clear.disabled = disabled;
        clear.onclick = () => apply([]);
        section.append(clear);
      }
      return;
    }
    const definition = PAGE_ACTIONS[action];
    if (!definition) return;
    const targets = candidates.filter(target => !definition.targetTypes || definition.targetTypes.includes(target.type));
    if (!targets.length) {
      addNote('Ehhez a művelethez még nincs megfelelő cél elem ezen az oldalon.');
      return;
    }
    const targetId = targets.some(target => target.id === currentValid?.targetId) ? currentValid.targetId : targets[0].id;
    const targetField = select('Cél elem', targets.map(target => [target.id, labelFor(target)]), targetId);
    targetField.wrap.dataset.pageInteractionDynamic = '1';
    targetField.input.disabled = disabled;
    section.append(targetField.wrap);
    const target = targets.find(item => item.id === targetId);
    let index = 0;
    if (definition.indexKey) {
      const count = Math.min(Array.isArray(target?.props?.items) ? target.props.items.length : 0, 40);
      const max = Math.max(0, count - 1);
      index = Number.isInteger(currentValid?.[definition.indexKey]) && currentValid.targetId === targetId
        ? Math.min(currentValid[definition.indexKey], max) : 0;
      const itemField = select(action === 'select-tab' ? 'Kiválasztott fül' : 'Kiválasztott rész',
        Array.from({ length: count }, (_, itemIndex) => [String(itemIndex), itemLabel(target, itemIndex)]), String(index));
      itemField.wrap.dataset.pageInteractionDynamic = '1';
      itemField.input.disabled = disabled || count === 0;
      section.append(itemField.wrap);
      itemField.input.onchange = () => save(targetField.input.value, Number(itemField.input.value));
    }
    const save = (nextTargetId = targetId, nextIndex = index) => {
      const record = { schemaVersion: 1, event: 'click', action, targetId: nextTargetId };
      if (definition.indexKey) record[definition.indexKey] = nextIndex;
      try { apply(normalizePageInteractions([record], node, nodes)); }
      catch (error) { addNote(error instanceof Error ? error.message : 'A művelet nem állítható be.'); }
    };
    targetField.input.onchange = () => save(targetField.input.value, 0);
    if (!currentValid || currentValid.action !== action || currentValid.targetId !== targetId) save(targetId, index);
  };
  actionSelect.input.disabled = disabled;
  actionSelect.input.onchange = () => {
    if (!actionSelect.input.value) { apply([]); return; }
    refresh();
  };
  refresh();
  return section;
}
