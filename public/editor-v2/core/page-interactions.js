// A deliberately small, declarative page-action registry. Page actions are
// saved with the Page Model; they are not JavaScript and cannot invoke the
// separate server-side automation/workflow engine.
export const PAGE_ACTIONS = Object.freeze({
  // A successful Form submission may continue with a safe same-page result
  // action. These are editor/schema capabilities; execution still belongs to
  // the public form lifecycle and must not run for invalid or failed posts.
  'scroll-to': Object.freeze({ label: 'Ugrás egy elemhez', events: Object.freeze(['click', 'focus']), formEvents: Object.freeze(['submit']), targetTypes: null, indexKey: null }),
  'select-tab': Object.freeze({ label: 'Fül kiválasztása', events: Object.freeze(['click', 'focus', 'hover', 'load', 'timer']), formEvents: Object.freeze(['submit']), targetTypes: Object.freeze(['tabs']), indexKey: 'itemIndex' }),
  'open-disclosure': Object.freeze({ label: 'Lenyitható rész megnyitása', events: Object.freeze(['click', 'focus']), targetTypes: Object.freeze(['accordion', 'dropdown']), indexKey: 'itemIndex' }),
  'close-disclosure': Object.freeze({ label: 'Lenyitható rész bezárása', events: Object.freeze(['click', 'focus']), targetTypes: Object.freeze(['accordion', 'dropdown']), indexKey: 'itemIndex' }),
  'toggle-disclosure': Object.freeze({ label: 'Lenyitható rész váltása', events: Object.freeze(['click', 'focus']), targetTypes: Object.freeze(['accordion', 'dropdown']), indexKey: 'itemIndex' })
});
export const PAGE_ACTION_EVENTS = Object.freeze(['click', 'focus', 'hover', 'load', 'timer', 'submit']);
export const PAGE_ACTION_MAX_PER_NODE = 1;
export const PAGE_ACTION_TIMER_DELAYS_MS = Object.freeze([3000, 5000, 10000]);
const ID = /^[A-Za-z0-9_-]{1,120}$/;
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const itemCount = node => Array.isArray(node?.props?.items) ? Math.min(node.props.items.length, 40) : 0;
const isBoundForm = node => node?.type === 'form' && node.metadata?.contentVersion === 1 &&
  /^[0-9a-f-]{36}$/i.test(String(node.props?.formId || '')) && node.props?.formBindingVersion === 1;

export function pageActionEventsForSource(sourceNode, action) {
  const definition = PAGE_ACTIONS[action];
  if (!definition || sourceNode?.metadata?.contentVersion !== 1) return [];
  if (sourceNode.type === 'form') return isBoundForm(sourceNode) ? definition.formEvents ?? [] : [];
  if (sourceNode.type === 'button') return definition.events;
  return [];
}

function invalid(message) { throw new TypeError(message); }

export function normalizePageInteractions(value, sourceNode, nodes) {
  const interactions = value == null ? [] : value;
  if (!Array.isArray(interactions)) invalid('Az oldalinterakciók listája érvénytelen.');
  if (interactions.length > PAGE_ACTION_MAX_PER_NODE) invalid('Elemenként jelenleg egy oldalinterakció állítható be.');
  if (interactions.length === 0) return [];
  const record = interactions[0];
  if (!isRecord(record)) invalid('Az oldalinterakció formátuma érvénytelen.');
  const definition = PAGE_ACTIONS[record.action];
  if (record.schemaVersion !== 1 || !definition || !PAGE_ACTION_EVENTS.includes(record.event) || !pageActionEventsForSource(sourceNode, record.action).includes(record.event)) {
    invalid('Az oldalinterakció nem támogatott.');
  }
  if (sourceNode.type === 'button' && typeof sourceNode.props?.href === 'string' && sourceNode.props.href.trim()) {
    invalid('A navigációs hivatkozást töröld, mielőtt oldalinterakciót állítasz be.');
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
  if (record.event === 'timer') {
    if (!PAGE_ACTION_TIMER_DELAYS_MS.includes(record.delayMs)) invalid('Az oldalinterakció időzítése nem támogatott.');
    normalized.delayMs = record.delayMs;
  }
  // Load and timer actions are page-level defaults for one target. The runtime
  // intentionally gives a deep link / load baseline precedence and keeps only
  // one timer per target; accepting competing defaults here would make which
  // button wins depend on document order. Reject that ambiguous model early.
  if (record.event === 'load' || record.event === 'timer') {
    const competingDefault = Object.values(nodes ?? {}).some(other => {
      if (!isRecord(other) || other.id === sourceNode.id || !Array.isArray(other.interactions) || other.interactions.length !== 1) return false;
      if (other.type !== 'button' || other.metadata?.contentVersion !== 1 || (typeof other.props?.href === 'string' && other.props.href.trim())) return false;
      const peer = other.interactions[0];
      const peerDefinition = isRecord(peer) ? PAGE_ACTIONS[peer.action] : null;
      if (!isRecord(peer) || peer.schemaVersion !== 1 || peer.targetId !== targetId ||
          (peer.event !== 'load' && peer.event !== 'timer') || !peerDefinition?.events.includes(peer.event) ||
          (peerDefinition.targetTypes && !peerDefinition.targetTypes.includes(target.type))) return false;
      if (peerDefinition.indexKey && (!Number.isInteger(peer[peerDefinition.indexKey]) || peer[peerDefinition.indexKey] < 0 || peer[peerDefinition.indexKey] >= itemCount(target))) return false;
      if (peer.event === 'timer' && !PAGE_ACTION_TIMER_DELAYS_MS.includes(peer.delayMs)) return false;
      const peerAllowed = new Set(['schemaVersion', 'event', 'action', 'targetId', ...(peerDefinition.indexKey ? [peerDefinition.indexKey] : []), ...(peer.event === 'timer' ? ['delayMs'] : [])]);
      return Object.keys(peer).every(key => peerAllowed.has(key));
    });
    if (competingDefault) invalid('Egy cél elemhez csak egy automatikus oldalinterakció állítható be.');
  }
  const allowed = new Set(['schemaVersion', 'event', 'action', 'targetId', ...(definition.indexKey ? [definition.indexKey] : []), ...(record.event === 'timer' ? ['delayMs'] : [])]);
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
    ...(Number.isInteger(action.itemIndex) ? { 'data-page-action-index': String(action.itemIndex) } : {}),
    ...(PAGE_ACTION_TIMER_DELAYS_MS.includes(action.delayMs) ? { 'data-page-action-delay-ms': String(action.delayMs) } : {})
  };
}
