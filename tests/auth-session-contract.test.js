import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { sessionCookie, clearSessionCookie, getSessionToken } from "../src/core/auth/session.ts";

const authQuery = readFileSync(new URL("../src/core/auth/require-auth.ts", import.meta.url), "utf8");
const loginPage = readFileSync(new URL("../public/admin-login.html", import.meta.url), "utf8");

test("session expiry is compared using the same ISO UTC format used when creating sessions", () => {
  assert.match(authQuery, /s\.expires_at > \?/);
  assert.match(authQuery, /\.bind\(tokenHash, new Date\(\)\.toISOString\(\)\)/);
  assert.doesNotMatch(authQuery, /s\.expires_at > CURRENT_TIMESTAMP/);
  const expiration = "2026-10-17T11:00:00.000Z";
  assert.equal(expiration > "2026-10-17T12:00:00.000Z", false);
  assert.equal(expiration > "2026-10-17 12:00:00", true, "SQLite text comparison against a different timestamp format is unsafe");
});

test("session cookies remain HttpOnly Secure SameSite Lax and host scoped", () => {
  const cookie = sessionCookie("opaque-session-token");
  for (const part of ["Path=/", "HttpOnly", "Secure", "SameSite=Lax"]) {
    assert.ok(cookie.includes(part), `missing cookie flag: ${part}`);
  }
  assert.doesNotMatch(cookie, /Domain=/);
  assert.match(clearSessionCookie(), /Max-Age=0/);
  const request = new Request("https://example.test/admin", {
    headers: { Cookie: "other=1; sanci9517_session=opaque-session-token" }
  });
  assert.equal(getSessionToken(request), "opaque-session-token");
});

test("login page verifies authenticated session before navigating to Admin", () => {
  assert.match(loginPage, /credentials: "same-origin"/);
  assert.match(loginPage, /waitForAuthenticatedSession\(\)/);
  assert.match(loginPage, /if \(!sessionReady\)/);
  assert.match(loginPage, /window\.location\.replace\("\/admin"\)/);
});
