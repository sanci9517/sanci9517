/* Optional per-event artwork without a new D1 migration.
 * The schedule domain owns event rows; media assets stay in the existing R2 media
 * library. A deterministic, site-scoped sidecar key links the two.
 */
export const SCHEDULE_ARTWORK_PREFIX = "schedule-artwork:";
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SITE_ID = /^[a-z0-9][a-z0-9_-]{0,79}$/i;

export function validScheduleArtworkId(value: unknown): value is string {
  return typeof value === "string" && ID.test(value);
}
export function scheduleArtworkKey(siteId: string, itemId: string): string {
  if (!SITE_ID.test(siteId) || !validScheduleArtworkId(itemId)) throw new Error("INVALID_SCHEDULE_ARTWORK_KEY");
  return SCHEDULE_ARTWORK_PREFIX + siteId + ":" + itemId.toLowerCase();
}
export function scheduleArtworkJSON(assetId: string): string {
  if (!validScheduleArtworkId(assetId)) throw new Error("INVALID_SCHEDULE_ARTWORK_ID");
  return JSON.stringify({ assetId: assetId.toLowerCase() });
}
export const SCHEDULE_ARTWORK_JOIN =
  " LEFT JOIN site_settings artwork ON artwork.key = ('schedule-artwork:' || e.site_id || ':' || e.id)";
// Only return a public artwork ID while the linked image is active, on the
// same site and one of the supported safe image MIME types. Untrusted or stale
// sidecars do not expose private asset IDs.
export const SCHEDULE_ARTWORK_SELECT =
  `(SELECT m.id FROM media m
     WHERE m.site_id=e.site_id
       AND lower(m.id)=lower(CASE WHEN json_valid(artwork.value_json) THEN json_extract(artwork.value_json,'$.assetId') ELSE NULL END)
       AND m.archived_at IS NULL
       AND m.mime_type IN ('image/png','image/jpeg','image/webp','image/gif')
     LIMIT 1) AS image_asset_id`;

// Match actual decoded JSON value rather than byte-for-byte serialized JSON.
// This preserves historical Unicode escapes, whitespace and UUID letter-case
// without ever authorizing malformed JSON or another tenant's event.
export const SCHEDULE_ARTWORK_ASSET_MATCH =
  "lower(CASE WHEN json_valid(artwork.value_json) THEN json_extract(artwork.value_json,'$.assetId') ELSE NULL END)=lower(?)";

// The archive preflight is advisory. This predicate is evaluated atomically
// with UPDATE media, so a freshly linked schedule cover can never be archived
// between the preflight and commit. Invalid legacy JSON fails closed as a
// reference only when its actual assetId is still recognizable.
export const SCHEDULE_ARTWORK_ARCHIVE_GUARD =
  ` AND NOT EXISTS (
    SELECT 1 FROM schedule_items e
    JOIN site_settings artwork ON artwork.key=('schedule-artwork:' || e.site_id || ':' || e.id)
    WHERE e.site_id=media.site_id
      AND lower(CASE WHEN json_valid(artwork.value_json)
        THEN json_extract(artwork.value_json,'$.assetId') ELSE NULL END)=lower(media.id)
  )`;

// In the same D1 batch as the conditional artwork UPSERT, audit success only
// if the intended value now exists on a real event and active same-site image.
// This avoids false-success history when the initial read races an archive or
// event removal. The clear audit intentionally allows idempotent no-op clears
// while still requiring a live same-site schedule event.
export const SCHEDULE_ARTWORK_COMMIT_AUDIT_GUARD =
  `EXISTS (
    SELECT 1 FROM schedule_items e
    JOIN site_settings artwork ON artwork.key=('schedule-artwork:' || e.site_id || ':' || e.id)
    JOIN media m ON m.id=? AND m.site_id=e.site_id
    WHERE e.id=? AND e.site_id=? AND artwork.value_json=?
      AND m.archived_at IS NULL
      AND m.mime_type IN ('image/png','image/jpeg','image/webp','image/gif')
  )`;
export const SCHEDULE_ARTWORK_CLEAR_AUDIT_GUARD =
  "EXISTS (SELECT 1 FROM schedule_items WHERE id=? AND site_id=?)";

// Recheck the same-site active image inside the artwork UPSERT itself. This
// complements the archive guard in the other transaction direction.
export const SCHEDULE_ARTWORK_ACTIVE_IMAGE_RECHECK =
  ` AND EXISTS (SELECT 1 FROM media
    WHERE id=? AND site_id=? AND archived_at IS NULL
      AND mime_type IN ('image/png','image/jpeg','image/webp','image/gif'))`;
