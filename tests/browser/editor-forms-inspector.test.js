import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const formId = "11111111-1111-4111-8111-111111111111";
const definition = {
  schemaVersion: 1,
  name: "Kapcsolat",
  fields: [{ id: "email", type: "email", label: "E-mail", required: true, maxLength: 254 }],
  consent: { text: "Elfogadom.", version: "privacy-v1" },
  successMessage: "Köszönjük.", retentionDays: 30
};

test("Forms Inspector keeps form Save/Publish independent from the page draft and page Publish", async t => {
  let currentVersion = 1;
  let publishedVersion = null;
  let formStatus = "draft";
  let storedDefinition = structuredClone(definition);
  const formActions = [];
  const pageDraft = { props: { formId, formBindingVersion: 1 } };
  const publishedPageSnapshot = { props: {} };
  const publicRoot = resolve(import.meta.dirname, "../../public");
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    response.setHeader("Access-Control-Allow-Origin", "*");
    const json = payload => { response.setHeader("Content-Type", "application/json; charset=utf-8"); response.end(JSON.stringify(payload)); };
    if (url.pathname === "/") { response.setHeader("Content-Type", "text/html; charset=utf-8"); return response.end("<!doctype html><html><body></body></html>"); }
    if (url.pathname === "/editor-v2/ui/forms-inspector.js") {
      response.setHeader("Content-Type", "text/javascript; charset=utf-8");
      return response.end(await readFile(resolve(publicRoot, "editor-v2/ui/forms-inspector.js")));
    }
    if (url.pathname === "/api/admin/forms" && request.method === "GET" && !url.searchParams.has("formId")) {
      return json({ ok: true, data: [{ id: formId, name: storedDefinition.name, status: formStatus, currentVersion, publishedVersion }] });
    }
    if (url.pathname === "/api/admin/forms" && request.method === "GET" && url.searchParams.get("formId") === formId) {
      return json({ ok: true, data: { id: formId, name: storedDefinition.name, status: formStatus, currentVersion, publishedVersion, definition: storedDefinition } });
    }
    if (url.pathname === "/api/admin/forms" && request.method === "POST") {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      formActions.push(body.action);
      if (body.action === "save") {
        assert.equal(body.expectedVersion, currentVersion);
        storedDefinition = body.definition;
        currentVersion += 1;
        return json({ ok: true, data: { id: formId, status: formStatus, currentVersion } });
      }
      if (body.action === "publish") {
        assert.equal(body.expectedVersion, currentVersion);
        assert.match(storedDefinition.consent.privacyUrl, /^https:\/\//);
        publishedVersion = currentVersion;
        formStatus = "published";
        return json({ ok: true, data: { id: formId, status: formStatus, publishedVersion } });
      }
    }
    response.writeHead(404).end();
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
  t.after(async () => { await browser.close(); await new Promise(resolve => server.close(resolve)); });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const base = `http://127.0.0.1:${server.address().port}`;
  const selected = await page.evaluate(async ({ base, formId, draft, published }) => {
    const { renderFormsInspector } = await import(`${base}/editor-v2/ui/forms-inspector.js`);
    const node = { props: { formId, formBindingVersion: 1 } };
    let selectionChanges = 0;
    const root = renderFormsInspector(node, { onSelect(id) {
      selectionChanges += 1;
      if (id) { draft.props.formId = id; draft.props.formBindingVersion = 1; }
      else delete draft.props.formId;
    } });
    document.body.append(root);
    await new Promise(resolve => {
      const observer = new MutationObserver(() => {
        if (root.querySelector('[aria-label="Űrlap neve"]')) { observer.disconnect(); resolve(); }
      });
      observer.observe(root, { childList: true, subtree: true });
      if (root.querySelector('[aria-label="Űrlap neve"]')) { observer.disconnect(); resolve(); }
    });
    return { selectionChanges, draft, published };
  }, { base, formId, draft: pageDraft, published: publishedPageSnapshot });
  assert.equal(selected.selectionChanges, 1);
  assert.deepEqual(selected.draft.props, { formId, formBindingVersion: 1 });
  assert.deepEqual(selected.published.props, {});

  const publish = page.getByRole("button", { name: "Űrlap publikálása" });
  assert.equal(await publish.isDisabled(), true, "privacy notice is mandatory before publish");
  await page.getByLabel("Adatkezelési tájékoztató HTTPS hivatkozása").fill("https://creator.test/privacy");
  assert.equal(await page.getByRole("button", { name: "Űrlap piszkozat mentése" }).isDisabled(), false);
  assert.equal(await publish.isDisabled(), true, "editing the definition must be saved before it can be published");
  await page.getByRole("button", { name: "Űrlap piszkozat mentése" }).click();
  await page.getByRole("status").filter({ hasText: "Űrlap piszkozat mentve: v2" }).waitFor();
  assert.deepEqual(formActions, ["save"]);
  assert.equal(publishedVersion, null, "Save updates only the form draft");
  assert.deepEqual(pageDraft.props, { formId, formBindingVersion: 1 });
  assert.deepEqual(publishedPageSnapshot.props, {}, "saving the form does not publish the page");

  assert.equal(await page.getByRole("button", { name: "Űrlap publikálása" }).isDisabled(), false);
  await page.getByRole("button", { name: "Űrlap publikálása" }).click();
  await page.getByRole("status").filter({ hasText: "Űrlap v2 publikálva" }).waitFor();
  assert.deepEqual(formActions, ["save", "publish"]);
  assert.equal(publishedVersion, 2);
  assert.deepEqual(pageDraft.props, { formId, formBindingVersion: 1 });
  assert.deepEqual(publishedPageSnapshot.props, {}, "publishing a form still does not publish the page");
});
