import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const worker = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
const workerConfig = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"));

test("canonical Admin and Editor routes require authentication", () => {
  for (const path of ["/admin", "/admin/editor", "/admin/media", "/admin/schedule"]) {
    const marker = `if (pathname === "${path}") {`;
    const start = worker.indexOf(marker);
    assert.ok(start >= 0, `Missing ${path} route`);
    const block = worker.slice(start, worker.indexOf("\n    }", start) + 6);
    assert.match(block, /getAuthenticatedUser\(request, env\)/);
    assert.match(block, /if \(!user\) return Response\.redirect/);
  }
});

test("retired entry points return 410 without exposing backing HTML", () => {
  for (const path of ["/admin-login", "/admin-media", "/admin-schedule", "/admin-design", "/admin-home", "/admin-login.html", "/admin-media.html", "/admin-schedule.html", "/admin-design.html", "/admin-home.html", "/admin.html", "/admin/home", "/editor-v2", "/editor-v2/index.html"]) {
    assert.ok(worker.includes(`"${path}"`), `Missing retired entry: ${path}`);
  }
  assert.match(worker, /return new Response\("Gone", \{ status: 410 \}\)/);
  assert.doesNotMatch(worker, /LEGACY_REDIRECTS/);
});

test("static Admin and legacy Editor HTML matches enter the Worker before asset serving", () => {
  const workerFirst = workerConfig.assets?.run_worker_first;
  assert.ok(Array.isArray(workerFirst), "Sensitive static entrypoints must not use asset-first defaults");
  for (const pattern of ["/admin", "/admin/*", "/admin-*", "/admin.html", "/editor-v2", "/editor-v2/index.html"]) {
    assert.ok(workerFirst.includes(pattern), `Missing Worker-first asset route: ${pattern}`);
  }
});
