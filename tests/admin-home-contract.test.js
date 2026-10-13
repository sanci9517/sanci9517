import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const worker = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../public/admin-home.html", import.meta.url), "utf8");

test("Admin entry authenticates before routing to the dashboard", () => {
  assert.match(
    worker,
    /if \(pathname === "\/admin" \|\| pathname === "\/admin\.html"\) \{\s*const user = await getAuthenticatedUser\(request, env\);\s*if \(!user\) return Response\.redirect\(new URL\("\/admin\/login", request\.url\)\.toString\(\), 302\);\s*return Response\.redirect\(new URL\("\/admin\/home", request\.url\)\.toString\(\), 302\);/
  );
});

test("dashboard route and direct asset path are authenticated", () => {
  assert.match(
    worker,
    /if \(pathname === "\/admin\/home" \|\| pathname === "\/admin-home\.html"\) \{\s*const user = await getAuthenticatedUser\(request, env\);\s*if \(!user\) return Response\.redirect\(new URL\("\/admin\/login", request\.url\)\.toString\(\), 302\);\s*return env\.ASSETS\.fetch\(assetRequest\("\/admin-home\.html", request\)\);/
  );
});

test("canonical Visual Editor v2 route remains available separately", () => {
  assert.match(
    worker,
    /if \(pathname === "\/admin\/editor"\) \{\s*const user = await getAuthenticatedUser\(request, env\);\s*if \(!user\) return Response\.redirect\(new URL\("\/admin\/login", request\.url\)\.toString\(\), 302\);\s*return env\.ASSETS\.fetch\(assetRequest\("\/editor-v2\/index\.html", request\)\);/
  );
});

test("dashboard reads real canonical APIs instead of hard-coded creator metrics", () => {
  for (const endpoint of [
    "/api/auth/session",
    "/api/admin/settings",
    "/api/admin/pages?meta=1",
    "/api/admin/schedule",
    "/api/integrations/twitch/connection"
  ]) {
    assert.ok(dashboard.includes(endpoint), `missing dashboard data source: ${endpoint}`);
  }
  assert.match(dashboard, /Promise\.allSettled/);
  assert.match(dashboard, /Nem talál ki időpontot/);
  assert.match(dashboard, /A provider állapota nem érhető el/);
});

test("dashboard includes responsive, keyboard and reduced-motion affordances", () => {
  assert.match(dashboard, /@media \(max-width: 900px\)/);
  assert.match(dashboard, /@media \(max-width: 600px\)/);
  assert.match(dashboard, /prefers-reduced-motion: reduce/);
  assert.match(dashboard, /:focus-visible/);
  assert.match(dashboard, /aria-label="Admin navigáció"/);
  assert.match(dashboard, /aria-live="polite"/);
});

test("future modules are visibly disabled rather than presented as implemented", () => {
  assert.match(dashboard, /disabled data-nav-label="Média erőforrások/);
  assert.match(dashboard, /disabled data-nav-label="Publikálás/);
  assert.match(dashboard, /disabled data-nav-label="Analitika/);
  assert.match(dashboard, /Tervezett/);
});
