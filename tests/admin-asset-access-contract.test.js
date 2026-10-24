import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const worker = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");

test("canonical Admin and Editor routes require authentication", () => {
  for (const path of ["/admin", "/admin/editor", "/admin/media"]) {
    const marker = `if (pathname === "${path}") {`;
    const start = worker.indexOf(marker);
    assert.ok(start >= 0, `Missing ${path} route`);
    const block = worker.slice(start, worker.indexOf("\n    }", start) + 6);
    assert.match(block, /getAuthenticatedUser\(request, env\)/);
    assert.match(block, /if \(!user\) return Response\.redirect/);
  }
});

test("retired entry points return 410 without exposing backing HTML", () => {
  for (const path of ["/admin-login.html", "/admin-media.html", "/admin-home.html", "/admin.html", "/admin/home", "/editor-v2", "/editor-v2/index.html"]) {
    assert.ok(worker.includes(`"${path}"`), `Missing retired entry: ${path}`);
  }
  assert.match(worker, /return new Response\("Gone", \{ status: 410 \}\)/);
  assert.doesNotMatch(worker, /LEGACY_REDIRECTS/);
});
