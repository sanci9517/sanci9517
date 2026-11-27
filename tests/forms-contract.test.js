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
    value => { value.schemaVersion = 4; },
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

test("conditional Forms v2 fields preserve v1 and validate choice/checkbox sources", () => {
  const v1 = validDefinition();
  assert.equal(normalizeFormDefinition(v1).ok, true, "existing v1 forms keep their schema and behavior");
  const v1WithCondition = structuredClone(v1);
  v1WithCondition.fields.push({ id: "details", type: "text", label: "Részletek", required: false, condition: { fieldId: "topic", equals: "Egyéb" } });
  assert.equal(normalizeFormDefinition(v1WithCondition).code, "INVALID_FORM_FIELD_CONDITION",
    "conditional fields are opt-in to the v2 contract");

  const input = validDefinition();
  input.schemaVersion = 2;
  input.fields.push(
    { id: "details", type: "text", label: "Részletek", required: true, maxLength: 120, condition: { fieldId: "topic", equals: "Egyéb" } },
    { id: "callback", type: "text", label: "Visszahívás részletei", required: true, maxLength: 120, condition: { fieldId: "updates", equals: true } }
  );
  const normalized = normalizeFormDefinition(input);
  assert.equal(normalized.ok, true);
  assert.equal(normalized.value.schemaVersion, 2);
  assert.deepEqual(normalized.value.fields.slice(-2).map(field => field.condition), [
    { fieldId: "topic", equals: "Egyéb" }, { fieldId: "updates", equals: true }
  ]);

  const invalid = [];
  const unknownSource = structuredClone(input); unknownSource.fields.at(-2).condition.fieldId = "missing"; invalid.push(unknownSource);
  const selfSource = structuredClone(input); selfSource.fields.at(-2).condition.fieldId = "details"; invalid.push(selfSource);
  const invalidChoice = structuredClone(input); invalidChoice.fields.at(-2).condition.equals = "Nincs ilyen választás"; invalid.push(invalidChoice);
  const wrongCheckboxValue = structuredClone(input); wrongCheckboxValue.fields.at(-1).condition.equals = "true"; invalid.push(wrongCheckboxValue);
  const nonChoiceSource = structuredClone(input); nonChoiceSource.fields.at(-2).condition.fieldId = "email"; invalid.push(nonChoiceSource);
  const chainedSource = structuredClone(input);
  chainedSource.fields.at(-1).condition.fieldId = "details";
  chainedSource.fields.at(-1).condition.equals = "nyitott";
  invalid.push(chainedSource);
  for (const value of invalid) assert.equal(normalizeFormDefinition(value).ok, false);
});

test("conditional values skip hidden required fields, accept visible values, and reject forged hidden input", () => {
  const input = validDefinition();
  input.schemaVersion = 2;
  input.fields.push(
    { id: "details", type: "text", label: "Részletek", required: true, condition: { fieldId: "topic", equals: "Egyéb" } },
    { id: "callback", type: "text", label: "Visszahívás részletei", required: true, condition: { fieldId: "updates", equals: true } }
  );
  const normalized = normalizeFormDefinition(input);
  assert.equal(normalized.ok, true);
  const hidden = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", topic: "Együttműködés", updates: false }, consentAccepted: true
  });
  assert.equal(hidden.ok, true, "hidden required fields do not block the submission");
  assert.equal(Object.hasOwn(hidden.value.values, "details"), false);
  assert.equal(Object.hasOwn(hidden.value.values, "callback"), false);

  const visible = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", topic: "Egyéb", details: "Bővebben", updates: true, callback: "Este" }, consentAccepted: true
  });
  assert.equal(visible.ok, true);
  assert.equal(visible.value.values.details, "Bővebben");
  assert.equal(visible.value.values.callback, "Este");

  for (const hiddenValue of ["", "hamisított", false]) {
    const forged = normalizeFormSubmission(normalized.value, {
      values: { email: "creator@example.com", message: "Szia", topic: "Együttműködés", details: hiddenValue }, consentAccepted: true
    });
    assert.equal(forged.ok, false);
    assert.equal(forged.code, "HIDDEN_FORM_FIELD_SUBMITTED");
    assert.equal(forged.fieldId, "details");
  }

  const uncheckedDefinition = structuredClone(input);
  uncheckedDefinition.fields.at(-1).condition.equals = false;
  const normalizedUnchecked = normalizeFormDefinition(uncheckedDefinition);
  assert.equal(normalizedUnchecked.ok, true);
  const uncheckedOmitted = normalizeFormSubmission(normalizedUnchecked.value, {
    values: { email: "creator@example.com", message: "Szia", topic: "Együttműködés", callback: "Elérhető vagyok" }, consentAccepted: true
  });
  assert.equal(uncheckedOmitted.ok, true, "an omitted optional checkbox is treated as unchecked for visibility");
  assert.equal(uncheckedOmitted.value.values.callback, "Elérhető vagyok");
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

test("number fields accept finite bounded numeric values and reject malformed or unsafe values", () => {
  const input = validDefinition();
  input.fields.push({ id: "viewers", type: "number", label: "Nézőszám", required: false });
  const normalized = normalizeFormDefinition(input);
  assert.equal(normalized.ok, true);
  const invalidDefinition = validDefinition();
  invalidDefinition.fields.push({ id: "viewers", type: "number", label: "Nézőszám", required: false, maxLength: 12 });
  assert.equal(normalizeFormDefinition(invalidDefinition).code, "INVALID_FORM_FIELD_LENGTH", "numbers use a numeric bound instead of a character limit");
  const accepted = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", viewers: "1.25e2" }, consentAccepted: true
  });
  assert.equal(accepted.ok, true);
  assert.equal(accepted.value.values.viewers, 125);
  assert.equal(typeof accepted.value.values.viewers, "number");
  const zero = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", viewers: 0 }, consentAccepted: true
  });
  assert.equal(zero.ok, true);
  assert.equal(zero.value.values.viewers, 0);
  const emptyOptional = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia", viewers: "" }, consentAccepted: true
  });
  assert.equal(emptyOptional.ok, true);
  assert.equal(Object.hasOwn(emptyOptional.value.values, "viewers"), false, "empty optional numeric fields are omitted, not coerced to zero");
  for (const value of ["", "0x10", "Infinity", "1e999", "1".repeat(65), 1_000_000_000_001, Number.NaN]) {
    if (value === "") continue; // Empty optional fields are omitted by the shared submission contract.
    const rejected = normalizeFormSubmission(normalized.value, {
      values: { email: "creator@example.com", message: "Szia", viewers: value }, consentAccepted: true
    });
    assert.equal(rejected.ok, false, String(value));
    assert.equal(rejected.code, "INVALID_FORM_NUMBER", String(value));
    assert.equal(rejected.fieldId, "viewers");
  }
  const required = structuredClone(normalized.value);
  required.fields.at(-1).required = true;
  const missing = normalizeFormSubmission(required, {
    values: { email: "creator@example.com", message: "Szia" }, consentAccepted: true
  });
  assert.equal(missing.ok, false);
  assert.equal(missing.code, "FORM_FIELD_REQUIRED");
  assert.equal(missing.fieldId, "viewers");
});

test("slider fields enforce a versioned finite range and normalize only in-range step-aligned values", () => {
  const input = validDefinition();
  input.schemaVersion = 3;
  input.fields.push({ id: "intensity", type: "slider", label: "Intenzitás", required: true, min: -1, max: 1, step: 0.25 });
  const normalized = normalizeFormDefinition(input);
  assert.equal(normalized.ok, true);
  assert.deepEqual(normalized.value.fields.at(-1), {
    id: "intensity", type: "slider", label: "Intenzitás", required: true, min: -1, max: 1, step: 0.25
  });

  for (const [value, expected] of [["-1", -1], ["0.5", 0.5], [1, 1]]) {
    const accepted = normalizeFormSubmission(normalized.value, {
      values: { email: "creator@example.com", message: "Szia", intensity: value }, consentAccepted: true
    });
    assert.equal(accepted.ok, true, String(value));
    assert.equal(accepted.value.values.intensity, expected);
    assert.equal(typeof accepted.value.values.intensity, "number");
  }

  for (const [value, code] of [["1.25", "FORM_SLIDER_OUT_OF_RANGE"], ["0.3", "FORM_SLIDER_INVALID_STEP"]]) {
    const rejected = normalizeFormSubmission(normalized.value, {
      values: { email: "creator@example.com", message: "Szia", intensity: value }, consentAccepted: true
    });
    assert.equal(rejected.ok, false, value);
    assert.equal(rejected.code, code, value);
    assert.equal(rejected.fieldId, "intensity");
  }

  const missing = normalizeFormSubmission(normalized.value, {
    values: { email: "creator@example.com", message: "Szia" }, consentAccepted: true
  });
  assert.equal(missing.code, "FORM_FIELD_REQUIRED");
  assert.equal(missing.fieldId, "intensity");

  const invalidDefinitions = [
    value => { value.fields.push({ id: "intensity", type: "slider", label: "Intenzitás", required: false, min: 0, max: 10, step: 0 }); },
    value => { value.fields.push({ id: "intensity", type: "slider", label: "Intenzitás", required: false, min: 10, max: 10, step: 1 }); },
    value => { value.fields.push({ id: "intensity", type: "slider", label: "Intenzitás", required: false, min: 0, max: 10, step: 3 }); },
    value => { value.fields.push({ id: "intensity", type: "slider", label: "Intenzitás", required: false, min: 0, max: 1_000_001, step: 1 }); },
    value => { value.fields.push({ id: "intensity", type: "slider", label: "Intenzitás", required: false, min: 0, max: 10, step: 1, maxLength: 12 }); },
    value => { value.fields.push({ id: "other", type: "text", label: "Másik mező", required: false, maxLength: 120, min: 0 }); }
  ];
  for (const mutate of invalidDefinitions) {
    const invalid = validDefinition(); invalid.schemaVersion = 3; mutate(invalid);
    assert.equal(normalizeFormDefinition(invalid).ok, false);
  }
  const oldVersion = validDefinition();
  oldVersion.fields.push({ id: "intensity", type: "slider", label: "Intenzitás", required: false, min: 0, max: 10, step: 1 });
  assert.equal(normalizeFormDefinition(oldVersion).code, "FORM_SLIDER_SCHEMA_VERSION_REQUIRED");
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
