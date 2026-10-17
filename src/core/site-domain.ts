import { DEFAULT_SITE_ID } from "./site-context";
import type { Env } from "../types/env";

export type ResolvedSite = { siteId: string; siteName: string };
const bootstrapHost = "sanci9517-streamer-brand.sandor-bogadi95.workers.dev";

// Site IDs come from deployed bindings, never directly from request headers.
// Every non-bootstrap binding also needs a verified D1 domain record.
export async function resolveRequestSite(request: Request, env: Env): Promise<ResolvedSite | null> {
  const hostname = new URL(request.url).hostname.toLowerCase();
  if (hostname === bootstrapHost) {
    return await env.DB.prepare("SELECT id AS siteId,name AS siteName FROM sites WHERE id=? AND status='active' LIMIT 1")
      .bind(DEFAULT_SITE_ID).first<ResolvedSite>();
  }

  let bindings: Record<string, unknown>;
  try {
    const raw: unknown = JSON.parse(env.SITE_HOST_BINDINGS || "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    bindings = raw as Record<string, unknown>;
  } catch { return null; }

  const siteId = Object.hasOwn(bindings, hostname) ? bindings[hostname] : null;
  if (typeof siteId !== "string" || !siteId.trim()) return null;
  return await env.DB.prepare(`
    SELECT s.id AS siteId,s.name AS siteName FROM site_domains d
    JOIN sites s ON s.id=d.site_id
    WHERE d.hostname=? AND d.site_id=? AND d.status='verified'
      AND d.verified_at IS NOT NULL AND s.status='active' LIMIT 1
  `).bind(hostname, siteId).first<ResolvedSite>();
}
