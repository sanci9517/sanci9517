import { getCanonicalSiteContext } from "./site-context";
import type { Env } from "../types/env";

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// A historical slug points to a page ID, never another slug or an arbitrary URL.
// The current published projection supplies the only redirect destination.
export async function resolvePublishedPageRedirect(env: Env, fromSlug: string): Promise<string | null> {
  if (!validSlug.test(fromSlug)) return null;
  const { siteId } = getCanonicalSiteContext();
  const row = await env.DB.prepare(`
    SELECT p.published_slug AS slug
    FROM page_slug_redirects r
    JOIN pages p ON p.id=r.page_id AND p.site_id=r.site_id
    WHERE r.site_id=? AND r.from_slug=?
      AND p.archived_at IS NULL AND p.is_published=1
      AND p.published_slug IS NOT NULL AND p.published_slug<>r.from_slug
      AND NOT EXISTS (
        SELECT 1 FROM page_slug_redirects next
        WHERE next.site_id=r.site_id AND next.from_slug=p.published_slug
      )
    LIMIT 1
  `).bind(siteId,fromSlug).first<{slug:string}>();
  return row && validSlug.test(row.slug) ? row.slug : null;
}
