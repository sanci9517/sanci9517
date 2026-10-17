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
  assert.match(route, /page\.archived_at \|\| !page\.is_published \|\| !page\.published_content_json/);
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
