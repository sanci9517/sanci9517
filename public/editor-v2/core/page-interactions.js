// A deliberately small, declarative page-action registry. Page actions are
// saved with the Page Model; they are not JavaScript and cannot invoke the
// separate server-side automation/workflow engine.
export const PAGE_ACTIONS = Object.freeze({
  'scroll-to': Object.freeze({ label: 'Ugrás egy elemhez', targetTypes: null, indexKey: null }),
  'select-tab': Object.freeze({ label: 'Fül kiválasztása', targetTypes: Object.freeze(['tabs']), indexKey: 'itemIndex' }),
  'toggle-disclosure': Object.freeze({ label: 'Lenyitható rész váltása', targetTypes: Object.freeze(['accordion', 'dropdown']), indexKey: 'itemIndex' })
});
export const PAGE_ACTION_EVENTS = Object.freeze(['click', 'focus']);
export const PAGE_ACTION_MAX_PER_NODE = 1;
const ID = /^[A-Za-z0-9_-]{1,120}$/;
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const itemCount = node => Array.isArray(node?.props?.items) ? Math.min(node.props.items.length, 40) : 0;

function invalid(message) { throw new TypeError(message); }

export function normalizePageInteractions(value, sourceNode, nodes) {
  const interactions = value == null ? [] : value;
  if (!Array.isArray(interactions)) invalid('Az oldalinterakciók listája érvénytelen.');
  if (interactions.length > PAGE_ACTION_MAX_PER_NODE) invalid('Gombonként jelenleg egy oldalinterakció állítható be.');
  if (interactions.length === 0) return [];
  if (!isRecord(sourceNode) || sourceNode.type !== 'button' || sourceNode.metadata?.contentVersion !== 1) {
    invalid('Oldalinterakció csak szerkeszthető gombhoz adható.');
  }
  if (typeof sourceNode.props?.href === 'string' && sourceNode.props.href.trim()) {
    invalid('A navigációs hivatkozást töröld, mielőtt oldalinterakciót állítasz be.');
  }
  const record = interactions[0];
  if (!isRecord(record)) invalid('Az oldalinterakció formátuma érvénytelen.');
  const definition = PAGE_ACTIONS[record.action];
  if (record.schemaVersion !== 1 || !PAGE_ACTION_EVENTS.includes(record.event) || !definition) {
    invalid('Az oldalinterakció nem támogatott.');
  }
  const targetId = record.targetId;
  if (typeof targetId !== 'string' || !ID.test(targetId) || targetId === sourceNode.id) {
    invalid('Az oldalinterakció célja érvénytelen.');
  }
  const target = nodes?.[targetId];
  if (!isRecord(target) || target.id !== targetId || target.type === 'root') {
    invalid('Az oldalinterakció célja nem található ezen az oldalon.');
  }
  if (definition.targetTypes && !definition.targetTypes.includes(target.type)) {
    invalid('A kiválasztott művelet nem használható ezen az elemen.');
  }
  const normalized = { schemaVersion: 1, event: record.event, action: record.action, targetId };
  if (definition.indexKey) {
    const index = record[definition.indexKey];
    if (!Number.isInteger(index) || index < 0 || index >= itemCount(target)) {
      invalid('Az oldalinterakció célzott eleme nem található.');
    }
    normalized[definition.indexKey] = index;
  }
  const allowed = new Set(['schemaVersion', 'event', 'action', 'targetId', ...(definition.indexKey ? [definition.indexKey] : [])]);
  if (Object.keys(record).some(key => !allowed.has(key))) invalid('Az oldalinterakció tiltott mezőt tartalmaz.');
  return [normalized];
}

export function safePageInteraction(node, nodes) {
  try { return normalizePageInteractions(node?.interactions, node, nodes)[0] ?? null; }
  catch { return null; }
}

export function pageInteractionAttributes(node, nodes) {
  const action = safePageInteraction(node, nodes);
  if (!action) return {};
  return {
    'data-page-action': action.action,
    'data-page-action-event': action.event,
    'data-page-action-target': action.targetId,
    ...(Number.isInteger(action.itemIndex) ? { 'data-page-action-index': String(action.itemIndex) } : {})
  };
}
