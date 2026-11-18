import { PAGE_ACTIONS, PAGE_ACTION_TIMER_DELAYS_MS, normalizePageInteractions } from '../core/page-interactions.js?v=20261118-edt039-timer-trigger-v1';

const ACTION_OPTIONS = Object.freeze([
  ['scroll-to', 'Ugrás egy elemhez'],
  ['select-tab', 'Fül kiválasztása'],
  ['toggle-disclosure', 'Lenyitható rész váltása']
]);
const EVENT_OPTIONS = Object.freeze([
  ['click', 'Kattintás'],
  ['focus', 'Fókuszba kerülés'],
  ['hover', 'Egér/toll fölé lépés (billentyűzettel is aktiválható)'],
  ['load', 'Oldal betöltése'],
  ['timer', 'Időzítve']
]);
const DELAY_OPTIONS = Object.freeze(PAGE_ACTION_TIMER_DELAYS_MS.map(value => [String(value), `${value / 1000} másodperc`]));
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
  help.textContent = 'Biztonságos, beállított eseményre működő művelet. A fül oldalbetöltéskor váltható; a megosztott URL-ben kért fül ezt felülírja. Az időzített fülváltás csak 3, 5 vagy 10 másodperc lehet, és a célfül használata megszakítja. A hover egér/toll fölé lépésre vált, és billentyűzettel vagy érintéssel is aktiválható. Nem futtat JavaScriptet, és nem navigál másik webhelyre.';
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
  const persisted = node.interactions;
  const hasPersistedInteraction = persisted != null && (!Array.isArray(persisted) || persisted.length > 0);
  const current = Array.isArray(persisted) ? persisted[0] : null;
  let currentValid = null;
  let invalidPersistedInteraction = false;
  try { currentValid = normalizePageInteractions(persisted, node, nodes)[0] ?? null; }
  catch { invalidPersistedInteraction = true; /* Preserve old/invalid data until the user explicitly replaces or clears it. */ }
  const actionSelect = select('Művelet', [['', 'Nincs beállítva'], ...ACTION_OPTIONS], currentValid?.action || '');
  actionSelect.wrap.dataset.pageInteractionField = 'action';
  const eventSelect = select('Kiváltó esemény', EVENT_OPTIONS, currentValid?.event || 'click');
  eventSelect.wrap.dataset.pageInteractionField = 'event';
  const syncEventsForAction = action => {
    const allowed = PAGE_ACTIONS[action]?.events || ['click', 'focus'];
    const previous = eventSelect.input.value;
    eventSelect.input.replaceChildren(...allowed.map(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = EVENT_OPTIONS.find(([candidate]) => candidate === value)?.[1] || value;
      return option;
    }));
    eventSelect.input.value = allowed.includes(previous) ? previous : 'click';
  };
  syncEventsForAction(currentValid?.action || '');
  section.append(eventSelect.wrap, actionSelect.wrap);

  const addNote = text => {
    const note = document.createElement('p');
    note.className = 'content-field-help';
    note.setAttribute('role', 'status');
    note.textContent = text;
    section.append(note);
  };

  if (invalidPersistedInteraction) {
    const warning = document.createElement('p');
    warning.className = 'property-validation';
    warning.dataset.pageInteractionRecovery = 'warning';
    warning.setAttribute('role', 'alert');
    warning.textContent = 'A mentett oldalinterakció hibás vagy nem támogatott, ezért a publikus oldalon nem fut le. Válassz új műveletet a javításhoz, vagy távolítsd el.';
    section.append(warning);
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'secondary-action';
    clear.dataset.pageInteractionRecovery = 'clear';
    clear.textContent = 'Hibás interakció eltávolítása';
    clear.disabled = disabled;
    clear.onclick = () => apply([]);
    section.append(clear);
  }

  const refresh = (preferredTargetId = currentValid?.targetId) => {
    section.querySelectorAll('[data-page-interaction-dynamic]').forEach(element => element.remove());
    const action = actionSelect.input.value;
    syncEventsForAction(action);
    if (!action) {
      if (hasPersistedInteraction && currentValid) {
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
    const targetId = targets.some(target => target.id === preferredTargetId) ? preferredTargetId : targets[0].id;
    const targetField = select('Cél elem', targets.map(target => [target.id, labelFor(target)]), targetId);
    targetField.wrap.dataset.pageInteractionDynamic = '1';
    targetField.input.disabled = disabled;
    section.append(targetField.wrap);
    const target = targets.find(item => item.id === targetId);
    let index = 0;
    let readSelectedIndex = () => 0;
    if (definition.indexKey) {
      const count = Math.min(Array.isArray(target?.props?.items) ? target.props.items.length : 0, 40);
      const max = Math.max(0, count - 1);
      index = Number.isInteger(currentValid?.[definition.indexKey]) && currentValid.targetId === targetId
        ? Math.min(currentValid[definition.indexKey], max) : 0;
      const itemField = select(action === 'select-tab' ? 'Kiválasztott fül' : 'Kiválasztott rész',
        Array.from({ length: count }, (_, itemIndex) => [String(itemIndex), itemLabel(target, itemIndex)]), String(index));
      readSelectedIndex = () => Number(itemField.input.value);
      itemField.wrap.dataset.pageInteractionDynamic = '1';
      itemField.input.disabled = disabled || count === 0;
      section.append(itemField.wrap);
      itemField.input.onchange = () => save(targetField.input.value, readSelectedIndex());
    }
    let readSelectedDelay = () => null;
    if (eventSelect.input.value === 'timer') {
      const delay = currentValid?.action === action && currentValid.targetId === targetId && currentValid.event === 'timer' && PAGE_ACTION_TIMER_DELAYS_MS.includes(currentValid.delayMs)
        ? currentValid.delayMs : 5000;
      const delayField = select('Várakozás', DELAY_OPTIONS, String(delay));
      delayField.wrap.dataset.pageInteractionDynamic = '1';
      delayField.input.disabled = disabled;
      readSelectedDelay = () => Number(delayField.input.value);
      delayField.input.onchange = () => save(targetField.input.value, readSelectedIndex(), readSelectedDelay());
      section.append(delayField.wrap);
    }
    const save = (nextTargetId = targetId, nextIndex = index, nextDelay = readSelectedDelay()) => {
      const record = { schemaVersion: 1, event: eventSelect.input.value, action, targetId: nextTargetId };
      if (definition.indexKey) record[definition.indexKey] = nextIndex;
      if (record.event === 'timer') record.delayMs = nextDelay;
      try { apply(normalizePageInteractions([record], node, nodes)); }
      catch (error) { addNote(error instanceof Error ? error.message : 'A művelet nem állítható be.'); }
    };
    eventSelect.input.onchange = () => refresh(targetField.input.value);
    targetField.input.onchange = () => refresh(targetField.input.value);
    if (!currentValid || currentValid.action !== action || currentValid.targetId !== targetId || currentValid.event !== eventSelect.input.value || (eventSelect.input.value === 'timer' && currentValid.delayMs !== readSelectedDelay())) save(targetId, index, readSelectedDelay());
  };
  actionSelect.input.disabled = disabled;
  eventSelect.input.disabled = disabled;
  actionSelect.input.onchange = () => {
    if (!actionSelect.input.value) { apply([]); return; }
    refresh();
  };
  refresh();
  return section;
}
