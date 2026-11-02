export type HtmlAnchorHrefScan = { hrefs: string[]; truncated: boolean };

/**
 * Extract actual anchor href attributes from bounded legacy Rich Text HTML.
 * HTMLRewriter applies the platform HTML parser, so comments and raw-text
 * elements do not produce links merely because their text resembles markup.
 */
export async function scanHtmlAnchorHrefs(html: string, limit = 2000): Promise<HtmlAnchorHrefScan> {
  const maxHrefs = Number.isSafeInteger(limit) && limit >= 0 ? limit : 0;
  const hrefs: string[] = [];
  let truncated = false;
  const parsed = new HTMLRewriter()
    .on("a[href]", {
      element(element) {
        const href = element.getAttribute("href");
        if (href === null) return;
        if (hrefs.length >= maxHrefs) {
          truncated = true;
          return;
        }
        hrefs.push(href);
      },
    })
    .transform(new Response(html));
  // The source is capped by the caller before parsing. Drain the transformed
  // body so HTMLRewriter completes tokenization and all element callbacks.
  await parsed.arrayBuffer();
  return { hrefs, truncated };
}
