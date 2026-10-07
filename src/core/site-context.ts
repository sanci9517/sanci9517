export const DEFAULT_SITE_ID = "site-default";

export type SiteContext = {
  siteId: string;
};

export function validateSiteId(siteId: unknown): string {
  if (typeof siteId !== "string" || siteId.trim() === "") {
    throw new Error("SITE_CONTEXT_INVALID");
  }
  return siteId.trim();
}

export function getCanonicalSiteContext(): SiteContext {
  return { siteId: validateSiteId(DEFAULT_SITE_ID) };
}
