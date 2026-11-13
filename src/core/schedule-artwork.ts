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
export const SCHEDULE_ARTWORK_SELECT =
  "CASE WHEN json_valid(artwork.value_json) THEN json_extract(artwork.value_json, '$.assetId') ELSE NULL END AS image_asset_id";
