import test from "node:test";
import assert from "node:assert/strict";
import { normalizeFormDefinition, normalizeFormSubmission } from "../src/core/forms-contract.ts";

const validDefinition = () => ({
  schemaVersion: 1,
  name: "Kapcsolat",
  fields: [
    { id: "email", type: "email", label: "E-mail-cím", required: true, maxLength: 254 },
    { id: "message", type: "textarea", label: "Üzenet", required: true, maxLength: 2_000 },
    { id: "topic", type: "select", label: "Téma", required: false, options: ["Együttműködés", "Egyéb"] },
    { id: "updates", type: "checkbox", label: "Kérek értesítést", required: false }
  ],
  consent: { text: "Az üzenet elküldésével hozzájárulok a megkeresés kezeléséhez.", version: "privacy-2026-01" },
  successMessage: "Köszönöm, az üzenet megérkezett.",
  retentionDays: 30
});

function definition() {
  const result = normalizeFormDefinition(validDefinition());
  assert.equal(result.ok, true);
  return result.value;
}

test("form definitions normalize only versioned, bounded first-party fields", () => {
  const result = normalizeFormDefinition(validDefinition());
  assert.equal(result.ok, true);
  assert.equal(result.value.schemaVersion, 1);
  assert.equal(result.value.fields.length, 4);
  assert.equal(result.value.consent.version, "privacy-2026-01");
  assert.equal(result.value.retentionDays, 30);
});

test("unsupported versions, field types, duplicate IDs, and external actions fail closed", () => {
  const cases = [
    value => { value.schemaVersion = 2; },
    value => { value.fields[0].type = "file"; },
    value => { value.fields[1].id = "email"; },
    value => { value.action = "https://attacker.test/collect"; },
    value => { value.fields[0].action = "mailto:attacker@example.test"; }
  ];
  for (const mutate of cases) {
    const value = validDefinition();
    mutate(value);
    const result = normalizeFormDefinition(value);
    assert.equal(result.ok, false);
  }
});

test("consent wording and a bounded retention period are required in the schema", () => {
  for (const mutate of [
    value => { value.consent.text = " "; },
    value => { value.consent.version = " "; },
    value => { value.consent.privacyUrl = "javascript:alert(1)"; },
    value => { value.retentionDays = 366; }
  ]) {
    const value = validDefinition();
    mutate(value);
    assert.equal(normalizeFormDefinition(value).ok, false);
  }
});

test("valid submissions are allowlisted, normalized, and capture explicit consent", () => {
  const result = normalizeFormSubmission(definition(), {
    values: { email: "  creator@example.com ", message: "  Szia!  ", topic: "Egyéb", updates: false },
    consentAccepted: true
  });
  assert.deepEqual(result, {
    ok: true,
    value: { values: { email: "creator@example.com", message: "Szia!", topic: "Egyéb", updates: false }, consentAccepted: true, spam: false }
  });
});

test("consent, required values, field types, formats, options, and unknown keys are validated", () => {
  const cases = [
    [{ values: { email: "creator@example.com", message: "Szia" } }, "FORM_CONSENT_REQUIRED"],
    [{ values: { email: "creator@example.com", message: " " }, consentAccepted: true }, "FORM_FIELD_REQUIRED"],
    [{ values: { email: "not-an-email", message: "Szia" }, consentAccepted: true }, "INVALID_FORM_EMAIL"],
    [{ values: { email: "creator@example.com", message: "Szia", topic: "Unknown" }, consentAccepted: true }, "INVALID_FORM_OPTION"],
    [{ values: { email: "creator@example.com", message: "Szia", surprise: "x" }, consentAccepted: true }, "UNKNOWN_FORM_FIELD"],
    [{ values: { email: "creator@example.com", message: "Szia", updates: "yes" }, consentAccepted: true }, "INVALID_FORM_FIELD_VALUE"]
  ];
  for (const [payload, code] of cases) {
    const result = normalizeFormSubmission(definition(), payload);
    assert.equal(result.ok, false);
    assert.equal(result.code, code);
  }
});

test("required checkboxes must be checked; an absent optional checkbox remains absent", () => {
  const requiredCheckbox = definition();
  requiredCheckbox.fields[3].required = true;
  const rejected = normalizeFormSubmission(requiredCheckbox, {
    values: { email: "creator@example.com", message: "Szia", updates: false },
    consentAccepted: true
  });
  assert.equal(rejected.ok, false);
  assert.equal(rejected.code, "FORM_FIELD_REQUIRED");
  assert.equal(rejected.fieldId, "updates");

  const optional = normalizeFormSubmission(definition(), {
    values: { email: "creator@example.com", message: "Szia" },
    consentAccepted: true
  });
  assert.equal(optional.ok, true);
  assert.equal(Object.hasOwn(optional.value.values, "updates"), false);
});

test("honeypot signals spam without persisting its value or changing the truthful result", () => {
  const result = normalizeFormSubmission(definition(), {
    values: { email: "robot@example.com", message: "Request" },
    consentAccepted: true,
    website: "https://bot.invalid"
  });
  assert.equal(result.ok, true);
  assert.equal(result.value.spam, true);
  assert.equal(Object.hasOwn(result.value, "website"), false);
});


test("radio submissions stay within options and date fields require a real ISO calendar date", () => {
  const input = validDefinition();
  input.fields.push(
    { id: "contact", type: "radio", label: "Kapcsolat módja", required: true, options: ["E-mail", "Telefon"] },
    { id: "event-date", type: "date", label: "Időpont", required: true }
  );
  const normalized = normalizeFormDefinition(input);
  assert.equal(normalized.ok, true);
  const result = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", contact: "Telefon", "event-date": "2024-02-29" },
    consentAccepted: true
  });
  assert.equal(result.ok, true);
  assert.equal(result.value.values.contact, "Telefon");
  assert.equal(result.value.values["event-date"], "2024-02-29");
  for (const [id, value, code] of [
    ["contact", "Fax", "INVALID_FORM_OPTION"],
    ["event-date", "2025-02-29", "INVALID_FORM_DATE"],
    ["event-date", "2024-2-09", "INVALID_FORM_DATE"],
    ["event-date", "0000-12-31", "INVALID_FORM_DATE"]
  ]) {
    const rejected = normalizeFormSubmission(normalized.value, {
      values: { email: "creator@example.com", message: "Szia", contact: "Telefon", "event-date": "2024-03-01", [id]: value },
      consentAccepted: true
    });
    assert.equal(rejected.ok, false);
    assert.equal(rejected.code, code);
    assert.equal(rejected.fieldId, id);
  }
});


test("URL fields accept safe absolute HTTP(S) values and reject non-web or credentialed URLs", () => {
  const input = validDefinition();
  input.fields.push({ id: "website", type: "url", label: "Weboldal", required: false, maxLength: 2_048 });
  const normalized = normalizeFormDefinition(input);
  assert.equal(normalized.ok, true);
  const tooLongDefinition = validDefinition();
  tooLongDefinition.fields.push({ id: "website", type: "url", label: "Weboldal", required: false, maxLength: 2_049 });
  assert.equal(normalizeFormDefinition(tooLongDefinition).code, "INVALID_FORM_FIELD_LENGTH",
    "URL length limits cannot exceed the platform's 2048-character URL contract");
  const accepted = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", website: "https://creator.test/portfolio?clip=1" },
    consentAccepted: true
  });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.value.values.website, "https://creator.test/portfolio?clip=1");
  const oversized = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", website: `https://creator.test/${"a".repeat(2_048)}` }, consentAccepted: true
  });
  assert.equal(oversized.ok, false);
  assert.equal(oversized.code, "FORM_FIELD_TOO_LONG");
  for (const website of ["javascript:alert(1)", "data:text/html,hi", "ftp://creator.test/file", "//creator.test/path", "https://user:pass@creator.test", "https://"]) {
    const rejected = normalizeFormSubmission(normalized.value, {
      values: { email: "creator@example.com", message: "Szia", website }, consentAccepted: true
    });
    assert.equal(rejected.ok, false, website);
    assert.equal(rejected.code, "INVALID_FORM_URL", website);
    assert.equal(rejected.fieldId, "website");
  }
});

test("telephone fields accept bounded international formatting and reject malformed values", () => {
  const input = validDefinition();
  input.fields.push({ id: "phone", type: "tel", label: "Telefonszám", required: false, maxLength: 40 });
  const normalized = normalizeFormDefinition(input);
  assert.equal(normalized.ok, true);
  const tooLongDefinition = validDefinition();
  tooLongDefinition.fields.push({ id: "phone", type: "tel", label: "Telefonszám", required: false, maxLength: 41 });
  assert.equal(normalizeFormDefinition(tooLongDefinition).code, "INVALID_FORM_FIELD_LENGTH");

  const accepted = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", phone: " +36 (30) 123-4567 " },
    consentAccepted: true
  });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.value.values.phone, "+36 (30) 123-4567");
  const oversized = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", phone: `+${"1".repeat(40)}` },
    consentAccepted: true
  });
  assert.equal(oversized.ok, false);
  assert.equal(oversized.code, "FORM_FIELD_TOO_LONG");
  for (const phone of ["555-CALL", "++36301234567", "+36) (30", "---"]) {
    const rejected = normalizeFormSubmission(normalized.value, {
      values: { email: "creator@example.com", message: "Szia", phone },
      consentAccepted: true
    });
    assert.equal(rejected.ok, false, phone);
    assert.equal(rejected.code, "INVALID_FORM_PHONE", phone);
    assert.equal(rejected.fieldId, "phone");
  }
});

test("radio and date definitions reject irrelevant limits and option metadata", () => {
  for (const mutate of [
    value => { value.fields.push({ id: "contact", type: "radio", label: "Kapcsolat", required: false, options: ["A"], maxLength: 12 }); },
    value => { value.fields.push({ id: "event-date", type: "date", label: "Dátum", required: false, maxLength: 12 }); },
    value => { value.fields.push({ id: "event-date", type: "date", label: "Dátum", required: false, options: ["A"] }); }
  ]) {
    const value = validDefinition(); mutate(value);
    assert.equal(normalizeFormDefinition(value).ok, false);
  }
});
