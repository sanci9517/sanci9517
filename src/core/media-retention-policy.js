// Pure retention lifecycle policy. This module performs no D1 or R2 writes.
// A transition decision is NOT permission to delete an object.
export const RETENTION_STATES = Object.freeze([
  "requested", "quarantined", "revalidated", "cancelled", "deleted", "blocked"
]);
const transitions = Object.freeze({
  requested: ["quarantined", "cancelled", "blocked"],
  quarantined: ["revalidated", "cancelled", "blocked"],
  revalidated: ["deleted", "cancelled", "blocked"],
  blocked: ["cancelled"],
  cancelled: [],
  deleted: []
});

/**
 * Evaluate only the state transition, never execute it.
 * The actual destructive transition requires a separate transactional
 * reference check and object identity verification at execution time.
 */
export function retentionTransition(current, next, context = {}) {
  if (!RETENTION_STATES.includes(current) || !RETENTION_STATES.includes(next))
    return { allowed: false, reason: "INVALID_STATE" };
  if (!transitions[current].includes(next))
    return { allowed: false, reason: "INVALID_TRANSITION" };
  if (next === "deleted")
    return { allowed: false, reason: "DELETION_NOT_IMPLEMENTED" };
  if (next === "quarantined" || next === "revalidated") {
    if (context.usageComplete !== true) return { allowed: false, reason: "USAGE_INCOMPLETE" };
    if (context.referenceCount !== 0) return { allowed: false, reason: "ASSET_IN_USE" };
    if (context.archived !== true) return { allowed: false, reason: "ASSET_NOT_ARCHIVED" };
    if (context.objectPresent !== true) return { allowed: false, reason: "OBJECT_UNAVAILABLE" };
    if (next === "revalidated" && context.retentionExpired !== true)
      return { allowed: false, reason: "RETENTION_NOT_EXPIRED" };
  }
  return { allowed: true, reason: null };
}
