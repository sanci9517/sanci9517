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
  fields: [
    { id: "email", type: "email", label: 'E-mail "creator"', required: true, maxLength: 254 },
    { id: "field-2", type: "text", label: "Név", required: true, maxLength: 120 },
    { id: "field-3", type: "textarea", label: "Üzenet", required: false, maxLength: 500 }
  ],
  consent: { text: "Elfogadom.", version: "privacy-v1" },
  successMessage: "Köszönjük.", retentionDays: 30
};

test("Forms Inspector preserves field focus and keeps form Save/Publish independent from the page", async t => {
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

  const cards = page.locator(".form-inspector-field-card");
  const fieldIds = () => cards.evaluateAll(elements => elements.map(element => element.dataset.formFieldId));
  assert.equal(await cards.nth(0).getByRole("button", { name: 'Mező feljebb: E-mail "creator"' }).isDisabled(), true,
    "the first field cannot move above the start of the ordered schema");
  assert.equal(await cards.nth(2).getByRole("button", { name: "Mező lejjebb: Üzenet" }).isDisabled(), true,
    "the last field cannot move beyond the schema boundary");
  await cards.nth(0).getByRole("button", { name: 'Mező lejjebb: E-mail "creator"' }).click();
  assert.deepEqual(await fieldIds(), ["field-2", "email", "field-3"], "moving down changes only the draft field order");
  assert.equal(await cards.nth(1).getByRole("button", { name: 'Mező lejjebb: E-mail "creator"' }).evaluate(element => element === document.activeElement), true,
    "re-rendering after move preserves focus on the moved field action");
  await cards.nth(1).getByRole("button", { name: 'Mező feljebb: E-mail "creator"' }).click();
  assert.deepEqual(await fieldIds(), ["email", "field-2", "field-3"], "the up action reverses the ordered move");
  assert.equal(await cards.nth(0).getByRole("button", { name: 'Mező lejjebb: E-mail "creator"' }).evaluate(element => element === document.activeElement), true,
    "a move to the first row focuses its enabled opposite-direction action");
  await cards.nth(0).getByRole("button", { name: 'Mező lejjebb: E-mail "creator"' }).click();
  await cards.nth(1).getByRole("button", { name: 'Mező lejjebb: E-mail "creator"' }).click();
  assert.deepEqual(await fieldIds(), ["field-2", "field-3", "email"], "moving to the final row preserves the order");
  assert.equal(await cards.nth(2).getByRole("button", { name: 'Mező feljebb: E-mail "creator"' }).evaluate(element => element === document.activeElement), true,
    "a move to the final row focuses its enabled opposite-direction action");
  await cards.nth(2).getByRole("button", { name: 'Mező feljebb: E-mail "creator"' }).click();
  await cards.nth(1).getByRole("button", { name: 'Mező feljebb: E-mail "creator"' }).click();
  assert.deepEqual(await fieldIds(), ["email", "field-2", "field-3"]);
  assert.deepEqual(formActions, [], "reordering never saves or publishes implicitly");
  assert.equal(publishedVersion, null);

  const firstFieldType = cards.nth(0).getByLabel("Mezőtípus");
  await firstFieldType.selectOption("select");
  assert.equal(await cards.nth(0).getByLabel("Mezőtípus").evaluate(element => element === document.activeElement), true,
    "changing a field type should return focus to its replacement type selector");
  assert.equal(await cards.nth(0).getByLabel("Választások (soronként egy)").count(), 1,
    "select fields should retain their type-specific option editor after rerender");

  await cards.nth(1).getByLabel("Mezőtípus").selectOption("radio");
  const radioOptions = cards.nth(1).getByLabel("Választások (soronként egy)");
  assert.equal(await radioOptions.count(), 1, "radio fields share the bounded option editor");
  await radioOptions.fill("E-mail\nDiscord");
  assert.equal(await cards.nth(1).getByLabel("Maximális karakterszám").count(), 0, "radio options do not expose text length");
  await cards.nth(2).getByLabel("Mezőtípus").selectOption("url");
  assert.equal(await cards.nth(2).getByLabel("Mezőtípus").evaluate(element => element === document.activeElement), true,
    "changing to a URL field preserves focus on its type control");
  assert.equal(await cards.nth(2).getByLabel("Maximális karakterszám").count(), 1,
    "URL fields expose the bounded length control");
  assert.equal(await cards.nth(2).getByLabel("Maximális karakterszám").getAttribute("max"), "2048",
    "the Inspector caps URLs at the same limit as the server contract");
  await cards.nth(2).getByLabel("Mezőtípus").selectOption("date");
  assert.equal(await cards.nth(2).getByLabel("Maximális karakterszám").count(), 0, "date fields do not expose text length");
  assert.equal(await cards.nth(2).getByLabel("Választások (soronként egy)").count(), 0, "date fields clear irrelevant choices");
  await cards.nth(1).getByRole("button", { name: "Mező törlése: Név" }).click();
  assert.equal(await cards.nth(1).getByLabel("Mezőcímke").evaluate(element => element === document.activeElement), true,
    "removing a row should focus the next field at the same position");
  await page.getByRole("button", { name: "Mező hozzáadása" }).click();
  assert.equal(await cards.nth(2).getByLabel("Mezőcímke").evaluate(element => element === document.activeElement), true,
    "adding a row should focus its new label control");
  assert.deepEqual(await cards.evaluateAll(elements => elements.map(element => element.dataset.formFieldId)),
    ["email", "field-3", "field-4"], "new field IDs remain unique after removing a row");
  await cards.nth(2).getByRole("button", { name: "Mező törlése: Új mező" }).click();
  assert.equal(await cards.nth(1).getByLabel("Mezőcímke").evaluate(element => element === document.activeElement), true,
    "removing the last row should focus the preceding field");
  assert.deepEqual(formActions, [], "editing field structure must not save or publish implicitly");
  assert.equal(publishedVersion, null);
  assert.deepEqual(pageDraft.props, { formId, formBindingVersion: 1 }, "Inspector edits do not mutate the page draft");
  assert.deepEqual(publishedPageSnapshot.props, {}, "Inspector edits do not mutate the published page snapshot");

  const publish = page.getByRole("button", { name: "Űrlap publikálása" });
  assert.equal(await publish.isDisabled(), true, "privacy notice is mandatory before publish");
  await page.getByLabel("Adatkezelési tájékoztató HTTPS hivatkozása").fill("https://creator.test/privacy");
  assert.equal(await page.getByRole("button", { name: "Űrlap piszkozat mentése" }).isDisabled(), false);
  assert.equal(await publish.isDisabled(), true, "editing the definition must be saved before it can be published");
  await page.getByRole("button", { name: "Űrlap piszkozat mentése" }).click();
  await page.getByRole("status").filter({ hasText: "Űrlap piszkozat mentve: v2" }).waitFor();
  assert.deepEqual(storedDefinition.fields.map(field => field.type), ["select", "date"]);
  assert.deepEqual(storedDefinition.fields.map(field => field.id), ["email", "field-3"],
    "the saved field order persists through explicit save after reordering");
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
