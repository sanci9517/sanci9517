import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const worker = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");

test("canonical Admin and Editor routes require authentication", () => {
  for (const path of ["/admin", "/admin/editor"]) {
    const marker = `if (pathname === "${path}") {`;
    const start = worker.indexOf(marker);
    assert.ok(start >= 0, `Missing ${path} route`);
    const block = worker.slice(start, worker.indexOf("\n    }", start) + 6);
    assert.match(block, /getAuthenticatedUser\(request, env\)/);
    assert.match(block, /if \(!user\) return Response\.redirect/);
  }
});

test("legacy dashboard HTML paths redirect to the canonical Admin entry", () => {
  for (const path of ["/admin/home", "/admin-home.html", "/admin.html"]) {
    assert.ok(worker.includes(`pathname === "${path}"`));
  }
  assert.match(worker, /new URL\("\/admin", request\.url\)/);
});

test("editor HTML direct access redirects to authenticated entry", () => {
  assert.ok(worker.includes('pathname === "/editor-v2/index.html"'));
  assert.ok(worker.includes('pathname === "/editor-v2/"'));
  assert.ok(worker.includes('new URL("/admin/editor", request.url)'));
});
