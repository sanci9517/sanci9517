import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const route = readFileSync(new URL("../src/routes/admin/link-report.ts", import.meta.url), "utf8");
const htmlHrefs = readFileSync(new URL("../src/core/html-hrefs.ts", import.meta.url), "utf8");
const ui = readFileSync(new URL("../public/assets/admin-link-report.js", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../public/admin-home.html", import.meta.url), "utf8");

test("WEB-013 link report requires editor authorization and never caches private results", () => {
  assert.match(route, /getAuthenticatedUser\(request, env\)/);
  assert.match(route, /hasRole\(user, "editor"\)/);
  assert.match(route, /Cache-Control", "private, no-store"/);
});

test("WEB-013 scans published pages, not drafts or archived content", () => {
  assert.match(route, /if \(page\.archived_at \|\| !page\.is_published\) continue;/);
  assert.match(route, /if \(!page\.published_content_json\) \{ missingPublishedContentPages\+\+; continue; \}/);
  assert.match(route, /published_content_json/);
  assert.match(route, /checkedContentLinks >= 2000/);
});

test("WEB-013 distinguishes missing links from published historical redirects", () => {
  assert.match(route, /page_slug_redirects/);
  assert.match(route, /redirectedPage\.is_published/);
  assert.match(route, /redirectedContentLinks\.push/);
  assert.match(route, /contentFindings\.push/);
});

test("WEB-013 checks rich text anchors and explicit link properties", () => {
  assert.match(route, /node\?\.props\?\.link\?\.href/);
  assert.match(route, /node\?\.props\?\.html/);
  assert.match(route, /scanHtmlAnchorHrefs\(html,/);
  assert.match(route, /internalPageSlug\(href, origin\)/);
  assert.match(route, /inline\?\.link\?\.href/);
});

test("WEB-013 admin report surfaces broken and redirected links separately", () => {
  assert.match(dashboard, /id="refreshLinkReport"/);
  assert.match(ui, /contentFindings/);
  assert.match(ui, /redirectedContentLinks/);
  assert.match(ui, /navigationUrlFindings/);
  assert.match(ui, /redirectedNavigationLinks/);
  assert.match(ui, /Átirányítás/);
  assert.match(ui, /fetch\("\/api\/admin\/link-report"/);
});

test("WEB-013 extracts legacy anchors with the Workers HTML parser and reports its cap", () => {
  assert.match(htmlHrefs, /new HTMLRewriter\(\)/);
  assert.match(htmlHrefs, /\.on\("a\[href\]"/);
  assert.match(htmlHrefs, /element\.getAttribute\("href"\)/);
  assert.match(htmlHrefs, /await parsed\.arrayBuffer\(\)/);
  assert.match(htmlHrefs, /truncated = true/);
  assert.doesNotMatch(route, /const anchors = \/<a/);
});

test("WEB-013 reports published pages skipped during content scanning", () => {
  assert.match(route, /let unparseablePublishedPages = 0/);
  assert.match(route, /let unsupportedPublishedDocuments = 0/);
  assert.match(route, /catch \{ unparseablePublishedPages\+\+; continue; \}/);
  assert.match(route, /unsupportedPublishedDocuments\+\+; continue;/);
  assert.match(route, /unparseablePublishedPages, unsupportedPublishedDocuments/);
  assert.match(ui, /data\.unparseablePublishedPages \|\| data\.unsupportedPublishedDocuments/);
  assert.match(ui, /kimaradt a vizsgálatból/);
});

test("WEB-013 decodes HTML URL references before checking rich-text links", () => {
  assert.match(route, /import \{ decodeHTMLAttribute \} from "entities\/decode"/);
  assert.match(route, /anchors\.hrefs\.map\(decodeHTMLAttribute\)/);
  assert.doesNotMatch(route, /function decodeHtmlHref\(/, "the browser-compatible attribute decoder owns named and numeric HTML entity handling");
});
test("WEB-013 warns about published pages with missing content", () => {
  assert.match(route, /let missingPublishedContentPages = 0/);
  assert.match(route, /if \(!page\.published_content_json\) \{ missingPublishedContentPages\+\+; continue; \}/);
  assert.match(route, /redirectedContentLinks, missingPublishedContentPages, unparseablePublishedPages/);
  assert.match(ui, /data\.missingPublishedContentPages/);
  assert.match(ui, /tartalom nélküli/);
});

test("WEB-013 marks truncated rich-text candidate extraction", () => {
  assert.match(htmlHrefs, /hrefs\.length >= maxHrefs/);
  assert.match(route, /if \(anchors\.truncated\) \{ contentTruncated = true; break; \}/);
  assert.match(ui, /if \(data\.contentTruncated\)/);
});

test("WEB-013 discloses oversized rich-text fields excluded from scanning", () => {
  assert.match(route, /let oversizedRichTextFields = 0/);
  assert.match(route, /if \(html\.length > 100000\) \{ oversizedRichTextFields\+\+; continue; \}/);
  assert.match(route, /unsupportedPublishedDocuments, oversizedRichTextFields/);
  assert.match(ui, /if \(data\.oversizedRichTextFields\)/);
  assert.match(ui, /túl hosszú rich-text mező/);
});

test("WEB-013 reports navigation depth limits rather than silently skipping branches", () => {
  assert.match(route, /let navigationDepthTruncated = false/);
  assert.match(route, /if \(depth > 20\) \{ navigationDepthTruncated = true; return; \}/);
  assert.match(route, /truncated: checked >= 2000 \|\| navigationDepthTruncated, navigationDepthTruncated/);
  assert.match(ui, /if \(data\.navigationDepthTruncated\)/);
});

test("WEB-013 can show navigation depth and item limit warnings together", () => {
  assert.match(ui, /if \(data\.navigationDepthTruncated\)/);
  assert.match(ui, /if \(data\.checked >= 2000\)/);
  assert.doesNotMatch(ui, /data\.truncated && !data\.navigationDepthTruncated/);
});
