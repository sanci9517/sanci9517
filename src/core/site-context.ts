export const DEFAULT_SITE_ID = "site-default";

export type SiteContext = {
  siteId: string;
};

/**
 * Canonical site context bootstrap.
 *
 * The current product has one production site. Keeping site resolution behind
 * this boundary lets future user/site membership replace the bootstrap without
 * changing domain consumers.
 */
export function getCanonicalSiteContext(): SiteContext {
  return { siteId: DEFAULT_SITE_ID };
}
