// Safe SQL statements for the future media retention adapter. None delete media or R2.
// These are inert until the controlled manual D1 migration is verified.
export const retentionQueries = Object.freeze({
  get: `SELECT id,site_id,asset_id,object_key,state,requested_at,not_before,updated_at,attempt_count
       FROM media_retention_requests WHERE id=? AND site_id=? LIMIT 1`,
  getByAsset: `SELECT id,site_id,asset_id,object_key,state,requested_at,not_before,updated_at,attempt_count
       FROM media_retention_requests WHERE asset_id=? AND site_id=? LIMIT 1`,
  request: `INSERT INTO media_retention_requests
       (id,site_id,asset_id,object_key,state,not_before)
       SELECT ?,m.site_id,m.id,m.object_key,'requested',?
       FROM media m
       WHERE m.id=? AND m.site_id=? AND m.archived_at IS NOT NULL
         AND NOT EXISTS (
           SELECT 1 FROM pages p WHERE p.site_id=m.site_id
             AND (instr(COALESCE(p.content_json,''),m.id)>0 OR instr(COALESCE(p.published_content_json,''),m.id)>0))
         AND NOT EXISTS (
           SELECT 1 FROM editor_revisions r JOIN pages p ON p.id=r.page_id
           WHERE p.site_id=m.site_id AND instr(COALESCE(r.document_json,''),m.id)>0
         )`,
  cancel: `UPDATE media_retention_requests SET state='cancelled',updated_at=CURRENT_TIMESTAMP
       WHERE id=? AND site_id=? AND state IN ('requested','quarantined','revalidated','blocked')`
});
