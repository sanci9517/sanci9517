import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const formId = "11111111-1111-4111-8111-111111111111";
const otherFormId = "33333333-3333-4333-8333-333333333333";
const publicRoot = resolve(import.meta.dirname, "../../public");
const receivedAt = n => `2026-11-${String(26 - Math.floor((n - 1) / 24)).padStart(2, "0")} ${String(23 - Math.floor((n - 1) % 24)).padStart(2, "0")}:00:00`;
const submission = (n, overrides = {}) => ({
  id: `22222222-2222-4222-8222-${String(n).padStart(12, "0")}`,
  formId, formVersion: 2, pageId: "home", pageRevisionId: "rev-1", status: "new",
  receivedAt: receivedAt(n), consentText: "Elfogadom az adatkezelést.", consentVersion: "privacy-v2",
  consentAcceptedAt: "2026-11-26 12:00:00", values: { email: `user${n}@example.test`, message: `Üzenet ${n}` },
  ...overrides
});

test("Admin Forms inbox is scoped to the selected form, searchable, cursor-paginated and safe to operate", async t => {
  const calls = [];
  let deleted = false;
  let deleteDenied = true;
  let currentStatus = "new";
  let newCount = 3;
  let nextHeldCount = null;
  const items = Array.from({ length: 50 }, (_, index) => submission(index + 1));
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    const json = payload => { response.setHeader("Content-Type", "application/json; charset=utf-8"); response.end(JSON.stringify({ ok: true, data: payload })); };
    if (url.pathname === "/") {
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      return response.end(await readFile(resolve(publicRoot, "admin-forms.html"), "utf8"));
    }
    if (url.pathname === "/assets/admin-forms.js") {
      response.setHeader("Content-Type", "text/javascript; charset=utf-8");
      return response.end(await readFile(resolve(publicRoot, "assets/admin-forms.js"), "utf8"));
    }
    if (url.pathname === "/api/admin/forms" && request.method === "GET" && url.searchParams.has("newCount")) {
      const selectedId = url.searchParams.get("newCount");
      calls.push({ method: "GET", newCountFormId: selectedId });
      assert.ok([formId, otherFormId].includes(selectedId), "notice counts must be requested for an explicit selected form");
      if (nextHeldCount?.formId === selectedId) {
        const held = nextHeldCount;
        nextHeldCount = null;
        held.started();
        await held.response;
      }
      return json({ count: selectedId === otherFormId ? 0 : newCount });
    }
    if (url.pathname === "/api/admin/forms" && request.method === "GET" && !url.searchParams.has("formId") && !url.searchParams.has("submissions")) {
      calls.push({ method: "GET", url: url.pathname });
      return json([
        { id: formId, name: "Kapcsolat", status: "published", currentVersion: 2, publishedVersion: 2 },
        { id: otherFormId, name: "Feliratkozás", status: "published", currentVersion: 1, publishedVersion: 1 }
      ]);
    }
    if (url.pathname === "/api/admin/forms" && request.method === "GET" && url.searchParams.has("formId")) {
      const selectedId = url.searchParams.get("formId");
      calls.push({ method: "GET", url: url.pathname, formId: selectedId });
      assert.ok([formId, otherFormId].includes(selectedId));
      return json({ id: selectedId, name: selectedId === formId ? "Kapcsolat" : "Feliratkozás", definition: { fields: selectedId === formId ? [{ id: "email", label: "E-mail cím" }, { id: "message", label: "Üzenet" }] : [{ id: "email", label: "E-mail cím" }] } });
    }
    if (url.pathname === "/api/admin/forms" && request.method === "GET" && url.searchParams.has("submissions")) {
      calls.push({ method: "GET", formId: url.searchParams.get("submissions"), q: url.searchParams.get("q"), before: url.searchParams.get("before"), limit: url.searchParams.get("limit") });
      const selectedId = url.searchParams.get("submissions");
      assert.ok([formId, otherFormId].includes(selectedId), "every inbox read must carry an available selected form ID");
      if (selectedId === otherFormId) return json({ items: [], nextCursor: null });
      if (deleted) return json({ items: [], nextCursor: null });
      if (url.searchParams.get("q") === "failure") {
        response.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
        return response.end(JSON.stringify({ ok: false, error: { code: "FORMS_UNAVAILABLE" } }));
      }
      if (url.searchParams.get("q")) {
        return json({ items: [submission(7, { values: { email: "<img src=x onerror=alert(1)>", message: "needle result" } })], nextCursor: null });
      }
      if (url.searchParams.has("before")) return json({ items: [submission(51), submission(52)], nextCursor: null });
      return json({ items: items.map(item => item.id === submission(1).id ? { ...item, status: currentStatus } : item), nextCursor: `${items.at(-1).receivedAt}|${items.at(-1).id}` });
    }
    if (url.pathname === "/api/admin/forms" && request.method === "POST") {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      calls.push({ method: request.method, body });
      assert.equal(body.action, "export");
      assert.equal(body.formId, formId, "exports must stay tied to the selected form");
      response.writeHead(200, {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="Kapcsolat-${formId.slice(-8)}.csv"`,
        "Cache-Control": "private, no-store",
        "X-Export-Rows": "1"
      });
      return response.end("\uFEFF\"Beküldés azonosítója\",\"Beküldés ideje\",\"E-mail cím\"\r\n\"submission-id\",\"2026-11-26 12:00:00\",\"user@example.test\"\r\n");
    }
    if (url.pathname === "/api/admin/forms" && ["PATCH", "DELETE"].includes(request.method)) {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      calls.push({ method: request.method, body });
      assert.equal(body.formId, formId, "mutations must remain tied to the selected form");
      if (request.method === "PATCH") { currentStatus = body.status; newCount = currentStatus === "reviewed" ? 2 : 3; return json({ id: body.submissionId, status: currentStatus }); }
      if (deleteDenied) {
        response.writeHead(403, { "Content-Type": "application/json; charset=utf-8" });
        return response.end(JSON.stringify({ ok: false, error: { code: "FORBIDDEN" } }));
      }
      deleted = true;
      return json({ id: body.submissionId, deleted: true });
    }
    response.writeHead(404).end();
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
  t.after(async () => { await browser.close(); await new Promise(resolve => server.close(resolve)); });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.addInitScript(() => {
    let visibility = "visible";
    const intervals = [];
    const noticeRequests = [];
    const noticeResponses = [];
    const originalFetch = window.fetch.bind(window);
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => visibility });
    window.setInterval = (callback, delay, ...args) => {
      if (delay === 60_000) {
        intervals.push(() => callback(...args));
        return intervals.length;
      }
      return 0;
    };
    window.fetch = async (input, init) => {
      const rawUrl = typeof input === "string" ? input : input.url;
      const url = new URL(rawUrl, location.href);
      const isNotice = url.pathname === "/api/admin/forms" && url.searchParams.has("newCount");
      if (isNotice) noticeRequests.push(url.searchParams.get("newCount"));
      const response = await originalFetch(input, init);
      if (isNotice) noticeResponses.push(url.searchParams.get("newCount"));
      return response;
    };
    window.__formsInboxTest = {
      noticeRequests,
      noticeResponses,
      setVisibility(value) {
        visibility = value;
        document.dispatchEvent(new Event("visibilitychange"));
      },
      fireMinute() { for (const callback of intervals) callback(); }
    };
  });
  const dialogMessages = [];
  page.on("dialog", async dialog => { dialogMessages.push(dialog.message()); await dialog.accept(); });
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await page.locator(".submission").first().waitFor();
  await page.waitForFunction(() => document.querySelector("#newSubmissionNotice")?.textContent === "3 új beküldés vár átnézésre.");
  assert.equal(await page.locator("#newSubmissionNotice").getAttribute("role"), "status");
  assert.equal(await page.locator("#newSubmissionNotice").getAttribute("aria-live"), "polite");
  assert.equal(await page.evaluate(() => window.__formsInboxTest.noticeRequests.length), 1, "initial load makes one explicit count request");
  assert.equal(await page.getByRole("button", { name: "CSV export (Admin)" }).isDisabled(), false);
  assert.equal(await page.getByRole("heading", { level: 1, name: "Űrlapbeküldések" }).count(), 1);
  assert.equal(await page.getByRole("navigation", { name: "Admin navigáció" }).count(), 1);
  await page.getByLabel("Űrlap").focus();
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.id), "searchInput", "the toolbar is keyboard reachable in DOM order");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.id), "exportButton", "CSV export follows the selected-form search control");
  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement.id), "refreshButton");
  const desktopFormY = await page.locator("#formSelect").evaluate(node => node.getBoundingClientRect().top);
  const desktopSearchY = await page.locator("#searchInput").evaluate(node => node.getBoundingClientRect().top);
  assert.equal(desktopFormY, desktopSearchY, "desktop controls should share the same toolbar row");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "inbox should fit a desktop viewport");
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileFormY = await page.locator("#formSelect").evaluate(node => node.getBoundingClientRect().top);
  const mobileSearchY = await page.locator("#searchInput").evaluate(node => node.getBoundingClientRect().top);
  assert.ok(mobileSearchY > mobileFormY, "mobile toolbar controls should stack vertically");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "inbox should fit a 390px mobile viewport");
  assert.equal(await page.locator(".submission").count(), 50);
  assert.equal(await page.locator(".submission").first().getAttribute("data-submission-id"), items[0].id, "the server's newest-first order must be retained");
  assert.equal(await page.getByText("E-mail cím", { exact: true }).count(), 50);
  assert.equal(await page.getByRole("button", { name: "Előző oldal" }).isDisabled(), true);
  assert.equal(await page.getByRole("button", { name: "További beküldések" }).isDisabled(), false);
  const firstPageIds = await page.locator(".submission").evaluateAll(nodes => nodes.map(node => node.dataset.submissionId));

  await page.getByRole("button", { name: "További beküldések" }).click();
  await page.getByText("2 beküldés betöltve.").waitFor();
  assert.equal(await page.locator(".submission").count(), 2);
  assert.equal(await page.locator(".submission").nth(0).getAttribute("data-submission-id"), submission(51).id);
  assert.equal(await page.locator(".submission").nth(1).getAttribute("data-submission-id"), submission(52).id);
  const secondPageIds = await page.locator(".submission").evaluateAll(nodes => nodes.map(node => node.dataset.submissionId));
  assert.equal(secondPageIds.filter(id => firstPageIds.includes(id)).length, 0, "cursor pagination must not repeat submissions from the previous page");
  assert.ok(calls.some(call => call.method === "GET" && call.before === `${items.at(-1).receivedAt}|${items.at(-1).id}`), "next page must use the opaque server cursor");
  await page.getByRole("button", { name: "Előző oldal" }).click();
  await page.getByText("50 beküldés betöltve.").waitFor();
  assert.equal(await page.locator(".submission").count(), 50);

  await page.getByRole("searchbox", { name: "Keresés a beküldött adatokban" }).fill("needle");
  await page.getByText("1 beküldés betöltve.").waitFor();
  assert.equal(await page.locator(".submission").count(), 1);
  assert.equal(await page.locator("img").count(), 0, "submission values must never be interpreted as HTML");
  assert.equal(await page.locator(".value dd").filter({ hasText: "<img src=x onerror=alert(1)>" }).count(), 1);
  assert.ok(calls.some(call => call.method === "GET" && call.q === "needle" && call.before === null));

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV export (Admin)" }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), `Kapcsolat-${formId.slice(-8)}.csv`);
  const downloadPath = await download.path();
  assert.ok(downloadPath);
  const csv = await readFile(downloadPath, "utf8");
  assert.match(csv, /^\uFEFF\"Beküldés azonosítója\",\"Beküldés ideje\"/);
  assert.match(csv, /user@example\.test/);
  assert.equal(await page.getByText("1 beküldés CSV-exportja elkészült. Az export admin naplóba került.").count(), 1);
  assert.deepEqual(calls.filter(call => call.method === "POST").map(call => call.body), [
    { action: "export", formId, query: "needle" }
  ], "export downloads only the selected form/search result and never calls Save or Publish");

  await page.getByRole("searchbox", { name: "Keresés a beküldött adatokban" }).fill("failure");
  await page.getByText(/A beküldések nem tölthetők be/).waitFor();
  assert.equal(await page.locator(".submission").count(), 0, "a failed request must not leave stale rows visible");
  await page.getByRole("searchbox", { name: "Keresés a beküldött adatokban" }).fill("needle");
  await page.getByText("1 beküldés betöltve.").waitFor();

  const statusSelect = page.getByRole("combobox", { name: /Beküldés állapota/ });
  await statusSelect.selectOption("reviewed");
  await page.getByText("A beküldés állapota frissült.").waitFor();
  await page.waitForFunction(() => document.querySelector("#newSubmissionNotice")?.textContent === "2 új beküldés vár átnézésre.");
  assert.equal(await statusSelect.inputValue(), "reviewed");
  assert.equal(await page.getByText("Állapot: Átnézve").count(), 1);
  assert.ok(calls.some(call => call.method === "PATCH" && call.body.status === "reviewed"));

  const noticeRequestCount = () => page.evaluate(() => window.__formsInboxTest.noticeRequests.length);
  const beforeHidden = await noticeRequestCount();
  await page.evaluate(() => window.__formsInboxTest.setVisibility("hidden"));
  await page.evaluate(() => window.__formsInboxTest.fireMinute());
  await page.waitForTimeout(50);
  assert.equal(await noticeRequestCount(), beforeHidden, "hidden tabs suppress both visibility and minute-poll refreshes");
  await page.evaluate(() => window.__formsInboxTest.setVisibility("visible"));
  await page.waitForFunction(expected => window.__formsInboxTest.noticeRequests.length === expected + 1, beforeHidden);
  assert.equal((await page.evaluate(() => window.__formsInboxTest.noticeRequests)).at(-1), formId,
    "returning to the visible page refreshes only the currently selected form");
  const beforeVisibleMinute = await noticeRequestCount();
  await page.evaluate(() => window.__formsInboxTest.fireMinute());
  await page.waitForFunction(expected => window.__formsInboxTest.noticeRequests.length === expected + 1, beforeVisibleMinute);
  assert.equal((await page.evaluate(() => window.__formsInboxTest.noticeRequests)).at(-1), formId,
    "the 60-second refresh requests only the selected form");

  await page.getByRole("button", { name: /Beküldés törlése/ }).click();
  await page.getByText(/A beküldés törléséhez Admin jogosultság szükséges/).waitFor();
  assert.equal(await page.locator(".submission").count(), 1, "a forbidden delete must leave the submission visible");
  assert.ok(calls.some(call => call.method === "DELETE"));

  deleteDenied = false;
  await page.getByRole("button", { name: /Beküldés törlése/ }).click();
  await page.getByText("A beküldés törölve.").waitFor();
  assert.equal(dialogMessages.length, 2);
  for (const message of dialogMessages) assert.match(message, /végleg törlöd/);
  assert.ok(calls.some(call => call.method === "DELETE" && call.body.submissionId === submission(7).id));
  assert.equal(await page.getByText("Nincs a keresésnek megfelelő beküldés.").count(), 1);
  assert.deepEqual(calls.filter(call => call.method === "POST").map(call => call.body.action), ["export"], "the inbox only invokes its explicit export action, never form/page Save or Publish");
  await page.getByRole("searchbox", { name: "Keresés a beküldött adatokban" }).fill("");
  let releaseStaleCount;
  let startStaleCount;
  const staleCountStarted = new Promise(resolve => { startStaleCount = resolve; });
  nextHeldCount = { formId, started: startStaleCount, response: new Promise(resolve => { releaseStaleCount = resolve; }) };
  const beforeStale = await noticeRequestCount();
  await page.evaluate(() => window.__formsInboxTest.fireMinute());
  await staleCountStarted;
  assert.equal(await noticeRequestCount(), beforeStale + 1, "the prior form's refresh is now in flight");
  await page.getByLabel("Űrlap").selectOption(otherFormId);
  await page.getByText("Ehhez az űrlaphoz még nem érkezett beküldés.").waitFor();
  await page.waitForFunction(() => document.querySelector("#newSubmissionNotice")?.textContent === "Nincs új beküldés.");
  await page.waitForFunction(expected => window.__formsInboxTest.noticeRequests.length === expected + 1, beforeStale + 1);
  releaseStaleCount();
  await page.waitForFunction(expectedFormId => window.__formsInboxTest.noticeResponses.filter(id => id === expectedFormId).length >= 5, formId);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  assert.equal(await page.locator("#newSubmissionNotice").textContent(), "Nincs új beküldés.",
    "an older count response cannot overwrite the newly selected form's notice");
  assert.equal(await page.locator(".submission").count(), 0, "changing the selected form must not leak prior form rows into the inbox");
  assert.ok(calls.filter(call => call.method === "GET" && call.formId).some(call => call.formId === otherFormId));
  assert.ok(calls.filter(call => call.newCountFormId).every(call => [formId, otherFormId].includes(call.newCountFormId)),
    "the notice count is always scoped to an explicit selected form ID");
});
