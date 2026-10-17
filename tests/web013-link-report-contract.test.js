import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const route = readFileSync(new URL("../src/routes/admin/link-report.ts", import.meta.url), "utf8");
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
  assert.match(route, /anchors\.exec\(html\)/);
  assert.match(route, /href\.startsWith\("\/p\/"\)/);
});

test("WEB-013 admin report surfaces broken and redirected links separately", () => {
  assert.match(dashboard, /id="refreshLinkReport"/);
  assert.match(ui, /contentFindings/);
  assert.match(ui, /redirectedContentLinks/);
  assert.match(ui, /Átirányítás/);
  assert.match(ui, /fetch\("\/api\/admin\/link-report"/);
});

test("WEB-013 rich-text anchor matcher recognizes actual quoted and unquoted href values", () => {
  const source = route.match(/const anchors = (\/<a[^;]+\/gi);/);
  assert.ok(source, "anchor matcher must be present");
  const expression = source[1];
  const lastSlash = expression.lastIndexOf("/");
  const matcher = new RegExp(expression.slice(1, lastSlash), expression.slice(lastSlash + 1));
  const html = '<p><a href="/p/first-page">First</a><a class="cta" href=\'/p/second-page?x=1\'>Second</a><a href=/p/third-page>Third</a></p>';
  const found = [...html.matchAll(matcher)].map(match => match[1] ?? match[2]);
  assert.deepEqual(found, ["/p/first-page", "/p/second-page?x=1", "/p/third-page"]);
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

test("WEB-013 decodes HTML-escaped ampersands in rich-text hrefs", () => {
  assert.match(route, /replace\(\/&amp;\/gi, "&"\)/);
  assert.equal("/p/target?x=1&amp;y=2".replace(/&amp;/gi, "&"), "/p/target?x=1&y=2");
});

test("WEB-013 warns about published pages with missing content", () => {
  assert.match(route, /let missingPublishedContentPages = 0/);
  assert.match(route, /if \(!page\.published_content_json\) \{ missingPublishedContentPages\+\+; continue; \}/);
  assert.match(route, /redirectedContentLinks, missingPublishedContentPages, unparseablePublishedPages/);
  assert.match(ui, /data\.missingPublishedContentPages/);
  assert.match(ui, /tartalom nélküli/);
});

test("WEB-013 marks truncated rich-text candidate extraction", () => {
  assert.match(route, /while \(\(match = anchors\.exec\(html\)\) !== null\)/);
  assert.match(route, /if \(candidates\.length >= 2000\) \{ contentTruncated = true; break; \}/);
  assert.match(ui, /if \(data\.contentTruncated\)/);
});

test("WEB-013 discloses oversized rich-text fields excluded from scanning", () => {
  assert.match(route, /let oversizedRichTextFields = 0/);
  assert.match(route, /if \(html\.length > 100000\) \{ oversizedRichTextFields\+\+; continue; \}/);
  assert.match(route, /unsupportedPublishedDocuments, oversizedRichTextFields/);
  assert.match(ui, /if \(data\.oversizedRichTextFields\)/);
  assert.match(ui, /túl hosszú rich-text mező/);
});
