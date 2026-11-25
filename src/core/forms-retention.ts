import type { Env } from "../types/env";

export const FORMS_RETENTION_BATCH_SIZE = 100;
export const FORMS_RETENTION_MAX_BATCHES = 10;

type DeleteResult = { meta?: { changes?: number } };

async function deleteBounded(
  env: Env,
  sql: string,
  parameters: number[]
): Promise<number> {
  const result = await env.DB.prepare(sql).bind(...parameters).run() as DeleteResult;
  const changes = Number(result.meta?.changes ?? 0);
  return Number.isFinite(changes) && changes > 0 ? changes : 0;
}

/**
 * Enforce the per-form retention deadline and expire anti-abuse buckets.
 * Work is deliberately capped per daily Cron invocation so an old backlog
 * cannot monopolize a Worker event; a later run resumes from the oldest rows.
 */
export async function purgeExpiredFormData(env: Env, nowSeconds = Math.floor(Date.now() / 1_000)) {
  let submissionsDeleted = 0;
  let rateLimitsDeleted = 0;
  const submissionCutoff = "CURRENT_TIMESTAMP";
  const maxBatches = FORMS_RETENTION_MAX_BATCHES;
  const batchSize = FORMS_RETENTION_BATCH_SIZE;

  for (let batch = 0; batch < maxBatches; batch++) {
    const deleted = await deleteBounded(env, `DELETE FROM form_submissions
      WHERE rowid IN (
        SELECT rowid FROM form_submissions WHERE expires_at<=${submissionCutoff}
        ORDER BY expires_at ASC,id ASC LIMIT ?
      )`, [batchSize]);
    submissionsDeleted += deleted;
    if (deleted < batchSize) break;
  }

  for (let batch = 0; batch < maxBatches; batch++) {
    const deleted = await deleteBounded(env, `DELETE FROM form_submission_rate_limits
      WHERE rowid IN (
        SELECT rowid FROM form_submission_rate_limits WHERE expires_at<=?
        ORDER BY expires_at ASC,site_id ASC,form_id ASC,client_hash ASC,window_start ASC LIMIT ?
      )`, [nowSeconds, batchSize]);
    rateLimitsDeleted += deleted;
    if (deleted < batchSize) break;
  }

  return { submissionsDeleted, rateLimitsDeleted, batchSize, maxBatches };
}
