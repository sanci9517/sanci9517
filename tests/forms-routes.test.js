import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { adminFormsRoute } from "../src/routes/admin/forms.ts";
import { publicFormRoute } from "../src/routes/public/forms.ts";
import { hashSessionToken } from "../src/core/auth/session.ts";
import { DEFAULT_SITE_ID } from "../src/core/site-context.ts";

const migration = readFileSync(new URL("../scripts/pending/0032_forms_service.sql", import.meta.url), "utf8");
const siteId = DEFAULT_SITE_ID;
const formId = "11111111-1111-4111-8111-111111111111";
const pageId = "22222222-2222-4222-8222-222222222222";
const editorToken = "forms-editor-session";
const adminToken = "forms-admin-session";

const definition = (retentionDays = 30, versionName = "contact-v1") => ({
  schemaVersion: 1,
  name: versionName,
  fields: [
    { id: "email", type: "email", label: "E-mail", required: true, maxLength: 254 },
    { id: "message", type: "textarea", label: "Üzenet", required: true, maxLength: 2_000 },
    { id: "viewers", type: "number", label: "Nézőszám", required: false }
  ],
  consent: { text: "Az üzenet kezeléséhez hozzájárulok.", version: versionName, privacyUrl: "https://creator.test/privacy" },
  successMessage: "Köszönöm, megkaptuk.",
  retentionDays
});

function makeDb() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON;");
  db.exec(`
    CREATE TABLE sites(id TEXT PRIMARY KEY,name TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active');
    CREATE TABLE users(id TEXT PRIMARY KEY,email TEXT NOT NULL,display_name TEXT NOT NULL,role TEXT NOT NULL,is_active INTEGER NOT NULL);
    CREATE TABLE sessions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL,token_hash TEXT NOT NULL,expires_at TEXT NOT NULL);
    CREATE TABLE pages(id TEXT PRIMARY KEY,site_id TEXT NOT NULL,is_published INTEGER NOT NULL DEFAULT 0,archived_at TEXT,
      published_revision_id TEXT,published_content_json TEXT);
    CREATE TABLE audit_log(id TEXT PRIMARY KEY,user_id TEXT,action TEXT NOT NULL,entity_type TEXT NOT NULL,entity_id TEXT,metadata_json TEXT NOT NULL);
    INSERT INTO sites(id,name) VALUES ('site-default','SANCI9517');
    INSERT INTO users(id,email,display_name,role,is_active) VALUES
      ('editor','editor@example.test','Editor','editor',1),('admin','admin@example.test','Admin','admin',1);
  `);
  db.exec(migration);
  const binding = {
    afterVersionRead: null,
    prepare(query) {
      const statement = db.prepare(query);
      let args = [];
      const bound = {
        bind(...values) { args = values; return bound; },
        async first() {
          const result = statement.get(...args) ?? null;
          if ((query.includes("SELECT current_version AS version,status FROM forms") ||
              query.includes("SELECT f.current_version AS version,f.status,r.definition_json AS definitionJson")) && binding.afterVersionRead) {
            const race = binding.afterVersionRead;
            binding.afterVersionRead = null;
            race();
          }
          return result;
        },
        async all() { return { results: statement.all(...args) }; },
        async run() { const result = statement.run(...args); return { meta: { changes: Number(result.changes) } }; },
        _runForTest() { const result = statement.run(...args); return { meta: { changes: Number(result.changes) } }; }
      };
      return bound;
    },
    async batch(statements) {
      const results = [];
      for (const statement of statements) {
        // D1 batches execute statements in order. The test adapter uses the
        // same SQLite connection so conditional `changes()` guards are real.
        results.push(statement._runForTest());
      }
      return results;
    }
  };
  const env = { DB: binding, SESSION_SECRET: "a-test-only-hmac-secret-long-enough", SITE_MEMBERSHIP_ENFORCEMENT: "disabled" };
  return { db, env };
}

async function addSession(db, token, userId) {
  db.prepare("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)")
    .run(crypto.randomUUID(), userId, await hashSessionToken(token), "2999-01-01T00:00:00.000Z");
}

function bindPublishedForm(db, { currentRetentionDays = 1, publishedDefinition, draftDefinition } = {}) {
  const published = publishedDefinition ?? definition(30, "published-v1");
  const newerDraft = draftDefinition ?? definition(currentRetentionDays, "draft-v2");
  const document = { pages: { [pageId]: { nodes: { contact: {
    type: "form", props: { formId, formBindingVersion: 1 }
  } } } } };
  db.prepare("INSERT INTO pages(id,site_id,is_published,published_revision_id,published_content_json) VALUES(?,?,1,'page-revision-v1',?)")
    .run(pageId, siteId, JSON.stringify(document));
  db.prepare(`INSERT INTO forms(id,site_id,name,status,current_version,retention_days)
    VALUES(?,?,?,'published',2,?)`).run(formId, siteId, "Kapcsolat", currentRetentionDays);
  db.prepare("INSERT INTO form_revisions(site_id,form_id,version,definition_json) VALUES(?,?,1,?),(?,?,2,?)")
    .run(siteId, formId, JSON.stringify(published), siteId, formId, JSON.stringify(newerDraft));
  db.prepare("UPDATE forms SET published_version=1 WHERE id=? AND site_id=?").run(formId, siteId);
  return { published, newerDraft };
}

function publicRequest(method, body, { origin = "https://creator.test", headers = {} } = {}) {
  return new Request(`https://creator.test/api/public/forms?formId=${formId}&pageId=${pageId}`, {
    method,
    headers: { ...(body === undefined ? {} : { "Content-Type": "application/json", Origin: origin }), ...headers },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
}

function validSubmission(overrides = {}) {
  return { values: { email: "creator@example.test", message: "Szia" }, consentAccepted: true, ...overrides };
}

test("public submission is bound to the published schema and snapshots its consent and retention", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  const { published, newerDraft } = bindPublishedForm(db);
  assert.equal(newerDraft.retentionDays, 1);
  const get = await publicFormRoute(publicRequest("GET"), env, siteId);
  assert.equal(get.status, 200);
  assert.equal((await get.json()).data.version, 1);

  const response = await publicFormRoute(publicRequest("POST", validSubmission({ values: { email: "creator@example.test", message: "Szia", viewers: "125.5" } }), { headers: { "CF-Connecting-IP": "203.0.113.23" } }), env, siteId);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, data: { submitted: true, message: published.successMessage } });
  const row = db.prepare(`SELECT form_version,page_revision_id,values_json,consent_text,consent_version,
      consent_accepted_at,expires_at FROM form_submissions`).get();
  assert.equal(row.form_version, 1);
  assert.equal(row.page_revision_id, "page-revision-v1");
  assert.deepEqual(JSON.parse(row.values_json), { email: "creator@example.test", message: "Szia", viewers: 125.5 });
  assert.equal(row.consent_text, published.consent.text);
  assert.equal(row.consent_version, published.consent.version);
  assert.ok(Number.isFinite(Date.parse(row.consent_accepted_at)));
  // The public expiry follows the immutable published revision (30 days), not
  // the newer draft's one-day preference.
  assert.ok(Date.parse(row.expires_at) > Date.now() + 29 * 86_400_000);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submission_rate_limits").get().n, 1);
  assert.doesNotMatch(JSON.stringify(db.prepare("SELECT client_hash FROM form_submission_rate_limits").get()), /203\.0\.113\.23/);
});

test("public submission rejects a malformed email without writing a submission", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  const published = definition();
  published.fields[0].maxLength = 4_000; // Simulate an older over-permissive saved definition.
  bindPublishedForm(db, { publishedDefinition: published });

  const response = await publicFormRoute(publicRequest("POST", validSubmission({
    values: { email: "creator..clips@example.test", message: "Szia" }
  }), { headers: { "CF-Connecting-IP": "203.0.113.24" } }), env, siteId);

  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, "INVALID_FORM_EMAIL");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions").get().n, 0,
    "invalid contact data must not be persisted");
});

test("public v2 Forms accept visible conditional values and reject submitted hidden fields without storing them", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  const published = definition(30, "published-conditional-v2");
  published.schemaVersion = 2;
  published.fields.splice(2, 0, { id: "topic", type: "select", label: "Téma", required: true, options: ["Együttműködés", "Egyéb"] });
  published.fields.push({
    id: "details", type: "text", label: "Részletek", required: true,
    condition: { fieldId: "topic", equals: "Egyéb" }
  });
  bindPublishedForm(db, { publishedDefinition: published, draftDefinition: definition(1, "draft-v1") });

  const hidden = await publicFormRoute(publicRequest("POST", validSubmission({
    values: { email: "creator@example.test", message: "Szia", topic: "Együttműködés", details: "" }
  }), { headers: { "CF-Connecting-IP": "203.0.113.61" } }), env, siteId);
  assert.equal(hidden.status, 400);
  assert.equal((await hidden.json()).error.code, "HIDDEN_FORM_FIELD_SUBMITTED");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions").get().n, 0,
    "a forged hidden value is rejected before any submission is stored");

  const valid = await publicFormRoute(publicRequest("POST", validSubmission({
    values: { email: "creator@example.test", message: "Szia", topic: "Együttműködés" }
  }), { headers: { "CF-Connecting-IP": "203.0.113.62" } }), env, siteId);
  assert.equal(valid.status, 200, "a hidden required conditional field is omitted from a valid submission");
  const row = db.prepare("SELECT values_json,form_version FROM form_submissions").get();
  assert.equal(row.form_version, 1, "the public page remains bound to the immutable published form version");
  assert.deepEqual(JSON.parse(row.values_json), { email: "creator@example.test", message: "Szia", topic: "Együttműködés" });

  const visibleMissing = await publicFormRoute(publicRequest("POST", validSubmission({
    values: { email: "creator@example.test", message: "Szia", topic: "Egyéb" }
  }), { headers: { "CF-Connecting-IP": "203.0.113.63" } }), env, siteId);
  assert.equal(visibleMissing.status, 400, "a visible required conditional field is still required");
  assert.equal((await visibleMissing.json()).error.code, "FORM_FIELD_REQUIRED");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions").get().n, 1);
});

test("public form rejects cross-origin and honeypot posts without storing user content", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  bindPublishedForm(db);
  const crossOrigin = await publicFormRoute(publicRequest("POST", validSubmission(), {
    origin: "https://attacker.test", headers: { "CF-Connecting-IP": "203.0.113.24" }
  }), env, siteId);
  assert.equal(crossOrigin.status, 403);
  const honeypot = await publicFormRoute(publicRequest("POST", validSubmission({ website: "bot" }), {
    headers: { "CF-Connecting-IP": "203.0.113.24" }
  }), env, siteId);
  assert.equal(honeypot.status, 422);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions").get().n, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submission_rate_limits").get().n, 0);
});

test("public form rejects a streamed oversized request even without Content-Length", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  bindPublishedForm(db);
  const tooLarge = "{" + " ".repeat(12_288) + "}";
  const request = new Request(`https://creator.test/api/public/forms?formId=${formId}&pageId=${pageId}`, {
    method: "POST",
    headers: { Origin: "https://creator.test", "Content-Type": "application/json" },
    body: tooLarge
  });
  assert.equal(request.headers.has("Content-Length"), false);
  const response = await publicFormRoute(request, env, siteId);
  assert.equal(response.status, 413);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions").get().n, 0);
});

test("public first-party rate limit stores exactly five requests and fails closed on the sixth", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  bindPublishedForm(db);
  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const response = await publicFormRoute(publicRequest("POST", validSubmission({ values: {
      email: `creator${i}@example.test`, message: `Message ${i}`
    } }), { headers: { "CF-Connecting-IP": "198.51.100.10" } }), env, siteId);
    statuses.push(response.status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions").get().n, 5);
  assert.equal(db.prepare("SELECT attempts FROM form_submission_rate_limits").get().attempts, 5);
});

test("admin form save and publish are versioned separately and audit only committed changes", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  await addSession(db, editorToken, "editor");
  const request = (method, body) => new Request("https://creator.test/api/admin/forms", {
    method,
    headers: { Cookie: `sanci9517_session=${editorToken}`, Origin: "https://creator.test", "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const createdResponse = await adminFormsRoute(request("POST", { action: "create", definition: definition(30) }), env, siteId);
  assert.equal(createdResponse.status, 200);
  const created = (await createdResponse.json()).data;
  assert.equal(created.currentVersion, 1);
  assert.equal(created.publishedVersion, null);

  const saved = await adminFormsRoute(request("POST", { action: "save", formId: created.id, expectedVersion: 1,
    definition: definition(14, "draft-v2") }), env, siteId);
  assert.equal(saved.status, 200);
  assert.deepEqual({ ...db.prepare("SELECT current_version,published_version,status FROM forms WHERE id=?").get(created.id) }, {
    current_version: 2, published_version: null, status: "draft"
  });

  const stalePublish = await adminFormsRoute(request("POST", { action: "publish", formId: created.id, expectedVersion: 1 }), env, siteId);
  assert.equal(stalePublish.status, 409);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.publish'").get().n, 0);
  const published = await adminFormsRoute(request("POST", { action: "publish", formId: created.id, expectedVersion: 2 }), env, siteId);
  assert.equal(published.status, 200);
  const editedAgain = await adminFormsRoute(request("POST", { action: "save", formId: created.id, expectedVersion: 2,
    definition: definition(7, "draft-v3") }), env, siteId);
  assert.equal(editedAgain.status, 200);
  assert.deepEqual({ ...db.prepare("SELECT current_version,published_version,status FROM forms WHERE id=?").get(created.id) }, {
    current_version: 3, published_version: 2, status: "published"
  });

  const audit = db.prepare("SELECT action,entity_id FROM audit_log ORDER BY rowid").all();
  assert.deepEqual(audit.map(row => row.action), ["form.create", "form.save", "form.publish", "form.save"]);
  assert.ok(audit.every(row => row.entity_id === created.id));
});

test("form publication is blocked until an HTTPS privacy notice is configured", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  await addSession(db, editorToken, "editor");
  const request = body => new Request("https://creator.test/api/admin/forms", {
    method: "POST",
    headers: { Cookie: `sanci9517_session=${editorToken}`, Origin: "https://creator.test", "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const withoutNotice = definition();
  delete withoutNotice.consent.privacyUrl;
  const createdResponse = await adminFormsRoute(request({ action: "create", definition: withoutNotice }), env, siteId);
  const created = (await createdResponse.json()).data;
  const response = await adminFormsRoute(request({ action: "publish", formId: created.id, expectedVersion: 1 }), env, siteId);
  assert.equal(response.status, 409);
  assert.equal((await response.json()).error.code, "FORM_PRIVACY_NOTICE_REQUIRED");
  assert.deepEqual({ ...db.prepare("SELECT status,published_version FROM forms WHERE id=?").get(created.id) }, {
    status: "draft", published_version: null
  });
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.publish'").get().n, 0);
});

test("admin Forms body limit streams and cancels oversized requests without Content-Length", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  await addSession(db, editorToken, "editor");
  let cancelled = false;
  const body = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(24_577).fill(32)); },
    cancel() { cancelled = true; }
  });
  const request = new Request("https://creator.test/api/admin/forms", {
    method: "POST",
    headers: { Cookie: `sanci9517_session=${editorToken}`, Origin: "https://creator.test", "Content-Type": "application/json" },
    body,
    duplex: "half"
  });
  assert.equal(request.headers.has("Content-Length"), false);
  const response = await adminFormsRoute(request, env, siteId);
  assert.equal(response.status, 413);
  assert.equal(cancelled, true);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM forms").get().n, 0);
});

test("a concurrent form edit makes publish conflict without switching the published revision or writing an audit row", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  await addSession(db, editorToken, "editor");
  const request = body => new Request("https://creator.test/api/admin/forms", {
    method: "POST",
    headers: { Cookie: `sanci9517_session=${editorToken}`, Origin: "https://creator.test", "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const createdResponse = await adminFormsRoute(request({ action: "create", definition: definition() }), env, siteId);
  assert.equal(createdResponse.status, 200);
  const created = (await createdResponse.json()).data;
  env.DB.afterVersionRead = () => {
    db.prepare("INSERT INTO form_revisions(site_id,form_id,version,definition_json) VALUES(?,?,2,?)")
      .run(siteId, created.id, JSON.stringify(definition(7, "racing-edit")));
    db.prepare("UPDATE forms SET current_version=2 WHERE id=? AND site_id=?").run(created.id, siteId);
  };
  const response = await adminFormsRoute(request({ action: "publish", formId: created.id, expectedVersion: 1 }), env, siteId);
  assert.equal(response.status, 409);
  assert.deepEqual({ ...db.prepare("SELECT current_version,published_version,status FROM forms WHERE id=?").get(created.id) }, {
    current_version: 2, published_version: null, status: "draft"
  });
  assert.deepEqual(db.prepare("SELECT action FROM audit_log ORDER BY rowid").all().map(row => row.action), ["form.create"]);
});

test("an unpublished, archived, unbound, or foreign-site form is never public", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  bindPublishedForm(db);
  db.prepare("UPDATE pages SET published_content_json=? WHERE id=?")
    .run(JSON.stringify({ pages: { [pageId]: { nodes: { form: { type: "form", props: { formId: "33333333-3333-4333-8333-333333333333", formBindingVersion: 1 } } } } } }), pageId);
  let response = await publicFormRoute(publicRequest("GET"), env, siteId);
  assert.equal(response.status, 404);
  db.prepare("UPDATE pages SET published_content_json=? WHERE id=?")
    .run(JSON.stringify({ pages: { [pageId]: { nodes: { form: { type: "form", props: { formId, formBindingVersion: 1 } } } } } }), pageId);
  db.prepare("UPDATE forms SET status='archived' WHERE id=?").run(formId);
  response = await publicFormRoute(publicRequest("GET"), env, siteId);
  assert.equal(response.status, 404);
});

test("new-submission notice count is site/form scoped and excludes reviewed or expired private rows", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  bindPublishedForm(db);
  await addSession(db, editorToken, "editor");
  const insert = db.prepare(`INSERT INTO form_submissions
    (id,site_id,form_id,form_version,page_id,page_revision_id,values_json,consent_text,consent_version,consent_accepted_at,received_at,expires_at,status)
    VALUES(?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?)`);
  const add = (email, expiresAt, state) => insert.run(crypto.randomUUID(), siteId, formId, 1, pageId, "page-revision-v1",
    JSON.stringify({ email }), "Sensitive consent text", "privacy-v1", "2026-11-27T12:00:00.000Z", expiresAt, state);
  add("new-1@example.test", "2999-01-01 00:00:00", "new");
  add("new-2@example.test", "2999-01-01 00:00:00", "new");
  add("reviewed@example.test", "2999-01-01 00:00:00", "reviewed");
  add("expired@example.test", "2000-01-01 00:00:00", "new");
  const request = url => new Request(`https://creator.test${url}`, {
    headers: { Cookie: `sanci9517_session=${editorToken}`, "Sec-Fetch-Site": "same-origin" }
  });

  const response = await adminFormsRoute(request(`/api/admin/forms?newCount=${formId}`), env, siteId);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, { count: 2 });
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM audit_log").get().count, 0,
    "a read-only count does not create an audit event or change submission state");

  const invalid = await adminFormsRoute(request("/api/admin/forms?newCount=bad"), env, siteId);
  assert.equal(invalid.status, 400);
  const otherForm = await adminFormsRoute(request("/api/admin/forms?newCount=33333333-3333-4333-8333-333333333333"), env, siteId);
  assert.equal(otherForm.status, 404, "a form outside the active site returns no submission metadata");
  const foreignSite = await adminFormsRoute(request(`/api/admin/forms?newCount=${formId}`), env, "foreign-site");
  assert.equal(foreignSite.status, 403, "a valid form ID cannot be counted from a different site context");
});

test("a legacy or manually published form without a privacy URL fails closed on the public endpoint", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  const { published } = bindPublishedForm(db);
  delete published.consent.privacyUrl;
  db.prepare("UPDATE form_revisions SET definition_json=? WHERE site_id=? AND form_id=? AND version=1")
    .run(JSON.stringify(published), siteId, formId);
  const response = await publicFormRoute(publicRequest("GET"), env, siteId);
  assert.equal(response.status, 404);
});

test("form inbox returns only unexpired site-scoped rows, records status changes, and reserves deletion for admins", async t => {
  const { db, env } = makeDb();
  t.after(() => db.close());
  bindPublishedForm(db);
  await addSession(db, editorToken, "editor");
  await addSession(db, adminToken, "admin");
  const insert = db.prepare(`INSERT INTO form_submissions
    (id,site_id,form_id,form_version,page_id,page_revision_id,values_json,consent_text,consent_version,consent_accepted_at,received_at,expires_at)
    VALUES(?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,?)`);
  const submissionId = crypto.randomUUID();
  insert.run(submissionId, siteId, formId, 1, pageId, "page-revision-v1", JSON.stringify({ email: "creator@example.test", message: "Segítség" }),
    "Hozzájárulási szöveg", "privacy-v1", "2026-11-25T12:00:00.000Z", "2999-01-01 00:00:00");
  const formulaSubmissionId = crypto.randomUUID();
  insert.run(formulaSubmissionId, siteId, formId, 1, pageId, "page-revision-v1",
    JSON.stringify({ email: "=HYPERLINK(\"https://attacker.test\")", message: "-SUM(1,1)" }),
    "Hozzájárulási szöveg", "privacy-v1", "2026-11-25T12:00:00.000Z", "2999-01-01 00:00:00");
  insert.run(crypto.randomUUID(), siteId, formId, 1, pageId, "page-revision-v1", JSON.stringify({ email: "expired@example.test", message: "Régi" }),
    "Hozzájárulási szöveg", "privacy-v1", "2026-11-25T12:00:00.000Z", "2000-01-01 00:00:00");
  const request = (token, method, url, body, origin = "https://creator.test") => new Request(`https://creator.test${url}`, {
    method,
    headers: { Cookie: `sanci9517_session=${token}`, Origin: origin, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  const inbox = await adminFormsRoute(request(editorToken, "GET", `/api/admin/forms?submissions=${formId}&q=creator%40example.test`), env, siteId);
  assert.equal(inbox.status, 200);
  const payload = (await inbox.json()).data;
  assert.equal(payload.items.length, 1);
  assert.equal(payload.items[0].id, submissionId);
  assert.deepEqual(payload.items[0].values, { email: "creator@example.test", message: "Segítség" });
  assert.equal(payload.items[0].consentText, "Hozzájárulási szöveg");
  const changed = await adminFormsRoute(request(editorToken, "PATCH", "/api/admin/forms", { formId, submissionId, status: "reviewed" }), env, siteId);
  assert.equal(changed.status, 200);
  assert.equal(db.prepare("SELECT status FROM form_submissions WHERE id=?").get(submissionId).status, "reviewed");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.status'").get().n, 1);
  const editorExport = await adminFormsRoute(request(editorToken, "POST", "/api/admin/forms", { action: "export", formId, query: "" }), env, siteId);
  assert.equal(editorExport.status, 403, "PII export is reserved for an Admin-granted user");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.export'").get().n, 0,
    "a denied export must not create an audit record");
  const exported = await adminFormsRoute(request(adminToken, "POST", "/api/admin/forms", { action: "export", formId, query: "" }), env, siteId);
  assert.equal(exported.status, 200);
  assert.match(exported.headers.get("content-type"), /text\/csv; charset=utf-8/i);
  assert.match(exported.headers.get("content-disposition"), /attachment; filename="Kapcsolat-[0-9a-f]{8}\.csv"/i);
  assert.match(exported.headers.get("cache-control"), /private, no-store/i);
  assert.equal(exported.headers.get("x-export-rows"), "2");
  const csvBytes = new Uint8Array(await exported.arrayBuffer());
  assert.deepEqual([...csvBytes.slice(0, 3)], [0xef, 0xbb, 0xbf], "UTF-8 BOM preserves accented CSV headers in spreadsheet applications");
  const csv = new TextDecoder().decode(csvBytes);
  assert.ok(csv.startsWith("\"Beküldés azonosítója\",\"Beküldés ideje\""));
  assert.match(csv, /"E-mail · email"/);
  assert.match(csv, /"'=HYPERLINK\(""https:\/\/attacker\.test""\)"/, "CSV quoting must neutralize formula-like submitted text");
  assert.match(csv, /"'-SUM\(1,1\)"/);
  assert.doesNotMatch(csv, /2000-01-01|expired@example\.test/, "expired private submissions are excluded from export");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.export'").get().n, 1);
  const exportAudit = JSON.parse(db.prepare("SELECT metadata_json FROM audit_log WHERE action='form.submission.export'").get().metadata_json);
  assert.deepEqual(exportAudit, { rows: 2, filtered: false, format: "csv" }, "audit metadata never stores the search text or submitted values");
  const foreignFormExport = await adminFormsRoute(request(adminToken, "POST", "/api/admin/forms", { action: "export", formId: "33333333-3333-4333-8333-333333333333", query: "" }), env, siteId);
  assert.equal(foreignFormExport.status, 404, "export remains scoped to an existing form owned by the active site");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.export'").get().n, 1,
    "failed and foreign-site exports are not audited as successful downloads");
  const wrongOrigin = await adminFormsRoute(request(adminToken, "POST", "/api/admin/forms", { action: "export", formId, query: "" }, "https://evil.test"), env, siteId);
  assert.equal(wrongOrigin.status, 403, "an authenticated Admin still cannot trigger a cross-site export");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.export'").get().n, 1,
    "a cross-site request cannot create an export audit record");
  const malformedSubmissionId = crypto.randomUUID();
  insert.run(malformedSubmissionId, siteId, formId, 1, pageId, "page-revision-v1", JSON.stringify({ unknown: "untrusted" }),
    "Hozzájárulási szöveg", "privacy-v1", "2026-11-25T12:00:00.000Z", "2999-01-01 00:00:00");
  const malformedExport = await adminFormsRoute(request(adminToken, "POST", "/api/admin/forms", { action: "export", formId, query: "" }), env, siteId);
  assert.equal(malformedExport.status, 503, "a corrupt historic row fails the whole export instead of leaking a partial file");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.export'").get().n, 1,
    "a rejected corrupt-data export is not logged as a successful download");
  db.prepare("DELETE FROM form_submissions WHERE id=?").run(malformedSubmissionId);
  for (let index = 0; index < 501; index++) {
    insert.run(crypto.randomUUID(), siteId, formId, 1, pageId, "page-revision-v1", JSON.stringify({ email: "bulk@example.test", message: "Bulk row" }),
      "Hozzájárulási szöveg", "privacy-v1", "2026-11-25T12:00:00.000Z", "2999-01-01 00:00:00");
  }
  const cappedExport = await adminFormsRoute(request(adminToken, "POST", "/api/admin/forms", { action: "export", formId, query: "" }), env, siteId);
  assert.equal(cappedExport.status, 413, "large exports are capped instead of building unbounded CSV in Worker memory");
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.export'").get().n, 1,
    "an over-limit export cannot create a success audit record");
  const editorDelete = await adminFormsRoute(request(editorToken, "DELETE", "/api/admin/forms", { formId, submissionId }), env, siteId);
  assert.equal(editorDelete.status, 403);
  const adminDelete = await adminFormsRoute(request(adminToken, "DELETE", "/api/admin/forms", { formId, submissionId }), env, siteId);
  assert.equal(adminDelete.status, 200);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM form_submissions WHERE id=?").get(submissionId).n, 0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log WHERE action='form.submission.delete'").get().n, 1);
});
