/**
 * Versioned, server-owned contract for first-party public forms.
 *
 * Form definitions are intentionally data-only: no arbitrary action URL, HTML,
 * file upload, script, or provider callback is accepted here. Public rendering,
 * editor binding, and submission handling must all consume this same schema.
 */
export const FORM_SCHEMA_VERSION = 1 as const;
export const CONDITIONAL_FORM_SCHEMA_VERSION = 2 as const;
export const RANGE_FORM_SCHEMA_VERSION = 3 as const;
export const MAX_FORM_FIELDS = 24;
export const MAX_FORM_OPTIONS = 20;
export const MAX_FORM_EMAIL_LENGTH = 254;
export const MAX_FORM_DEFINITION_BYTES = 16_384;
export const MAX_FORM_SUBMISSION_BYTES = 12_288;

export type FormFieldType = "text" | "email" | "tel" | "url" | "number" | "textarea" | "select" | "radio" | "date" | "checkbox" | "slider";
export type FormFieldCondition = { fieldId: string; equals: string | boolean };

export type FormFieldDefinition = {
  id: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  condition?: FormFieldCondition;
};

export type FormDefinition = {
  schemaVersion: typeof FORM_SCHEMA_VERSION | typeof CONDITIONAL_FORM_SCHEMA_VERSION | typeof RANGE_FORM_SCHEMA_VERSION;
  name: string;
  fields: FormFieldDefinition[];
  consent: {
    text: string;
    version: string;
    privacyUrl?: string;
  };
  successMessage: string;
  retentionDays: number;
};

export type FormSubmissionInput = {
  values: Record<string, unknown>;
  consentAccepted: unknown;
  website?: unknown;
};

export type NormalizedFormSubmission = {
  values: Record<string, string | number | boolean>;
  consentAccepted: true;
  spam: boolean;
};

export type FormValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: string; fieldId?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const hasOnlyKeys = (value: Record<string, unknown>, allowed: readonly string[]): boolean =>
  Object.keys(value).every(key => allowed.includes(key));

const boundedText = (value: unknown, max: number, min = 1): value is string =>
  typeof value === "string" && value.trim().length >= min && value.trim().length <= max;

const validPrivacyUrl = (value: unknown): value is string => {
  if (value === undefined || value === "") return true;
  if (typeof value !== "string" || value.length > 2_048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
};

const validHttpUrlFieldValue = (value: string): boolean => {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
};

const normalizeNumberFieldValue = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) && Math.abs(value) <= 1_000_000_000_000 ? value : null;
  if (typeof value !== "string" || value.length > 64) return null;
  const normalized = value.trim();
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && Math.abs(parsed) <= 1_000_000_000_000 ? parsed : null;
};

const validPhoneFieldValue = (value: string): boolean => {
  // Phone formatting varies by country; accept common display punctuation
  // without imposing a country-specific numbering plan.
  if (!/^[+0-9(). -]+$/.test(value) || !/[0-9]/.test(value)) return false;
  if (value.includes("+") && (value[0] !== "+" || value.indexOf("+") !== value.lastIndexOf("+"))) return false;
  let depth = 0;
  for (const character of value) {
    if (character === "(") {
      if (depth !== 0) return false;
      depth = 1;
    } else if (character === ")") {
      if (depth !== 1) return false;
      depth = 0;
    }
  }
  return depth === 0;
};

const validEmailFieldValue = (value: string): boolean => {
  if (value.length > MAX_FORM_EMAIL_LENGTH) return false;
  const separator = value.indexOf("@");
  if (separator <= 0 || separator !== value.lastIndexOf("@")) return false;
  const local = value.slice(0, separator);
  const domain = value.slice(separator + 1);
  if (local.length > 64 || !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local) || /(^\.|\.\.|\.$)/.test(local)) return false;
  if (domain.length > 253) return false;
  const labels = domain.split(".");
  if (labels.length < 2 || labels.some(label => label.length > 63 || !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label))) return false;
  const topLevel = labels.at(-1)!;
  return /^[A-Za-z]{2,63}$/.test(topLevel) || /^xn--[A-Za-z0-9](?:[A-Za-z0-9-]{0,57}[A-Za-z0-9])?$/.test(topLevel);
};

export function normalizeFormDefinition(input: unknown): FormValidationResult<FormDefinition> {
  if (!isRecord(input) || !hasOnlyKeys(input, ["schemaVersion", "name", "fields", "consent", "successMessage", "retentionDays"]) ||
      (input.schemaVersion !== FORM_SCHEMA_VERSION && input.schemaVersion !== CONDITIONAL_FORM_SCHEMA_VERSION && input.schemaVersion !== RANGE_FORM_SCHEMA_VERSION)) {
    return { ok: false, code: "UNSUPPORTED_FORM_SCHEMA_VERSION" };
  }
  const schemaVersion = input.schemaVersion;
  if (!boundedText(input.name, 100)) return { ok: false, code: "INVALID_FORM_NAME" };
  if (!Array.isArray(input.fields) || input.fields.length < 1 || input.fields.length > MAX_FORM_FIELDS) {
    return { ok: false, code: "INVALID_FORM_FIELDS" };
  }
  const ids = new Set<string>();
  const fields: FormFieldDefinition[] = [];
  const conditions: Array<{ fieldId: string; condition: unknown }> = [];
  for (const raw of input.fields) {
    if (!isRecord(raw) || !hasOnlyKeys(raw, ["id", "type", "label", "required", "helpText", "options", "maxLength", "min", "max", "step", "condition"]) ||
        typeof raw.id !== "string" || !/^[a-z][a-z0-9_-]{0,39}$/.test(raw.id) || ids.has(raw.id)) {
      return { ok: false, code: "INVALID_FORM_FIELD_ID" };
    }
    ids.add(raw.id);
    if (!(["text", "email", "tel", "url", "number", "textarea", "select", "radio", "date", "checkbox", "slider"] as unknown[]).includes(raw.type)) {
      return { ok: false, code: "UNSUPPORTED_FORM_FIELD_TYPE", fieldId: raw.id };
    }
    if (!boundedText(raw.label, 120) || typeof raw.required !== "boolean") {
      return { ok: false, code: "INVALID_FORM_FIELD", fieldId: raw.id };
    }
    if (raw.helpText !== undefined && (typeof raw.helpText !== "string" || raw.helpText.length > 240)) {
      return { ok: false, code: "INVALID_FORM_FIELD_HELP", fieldId: raw.id };
    }
    const field: FormFieldDefinition = {
      id: raw.id,
      type: raw.type as FormFieldType,
      label: raw.label.trim(),
      required: raw.required
    };
    if (raw.helpText !== undefined && raw.helpText.trim()) field.helpText = raw.helpText.trim();
    if (raw.maxLength !== undefined) {
      if (!Number.isInteger(raw.maxLength) || (raw.maxLength as number) < 1 || (raw.maxLength as number) > (raw.type === "url" ? 2_048 : raw.type === "tel" ? 40 : 4_000) || raw.type === "checkbox" || raw.type === "select" || raw.type === "radio" || raw.type === "date" || raw.type === "number" || raw.type === "slider") {
        return { ok: false, code: "INVALID_FORM_FIELD_LENGTH", fieldId: raw.id };
      }
      // Older saved definitions could allow email text beyond the platform's
      // 254-character address limit. Normalize those definitions safely instead
      // of rejecting them or advertising an unusable limit to the editor.
      field.maxLength = raw.type === "email"
        ? Math.min(raw.maxLength as number, MAX_FORM_EMAIL_LENGTH)
        : raw.maxLength as number;
    }
    if (raw.type === "select" || raw.type === "radio") {
      if (!Array.isArray(raw.options) || raw.options.length < 1 || raw.options.length > MAX_FORM_OPTIONS ||
          raw.options.some(option => !boundedText(option, 120)) ||
          new Set((raw.options as string[]).map(option => option.trim())).size !== raw.options.length) {
        return { ok: false, code: "INVALID_FORM_FIELD_OPTIONS", fieldId: raw.id };
      }
      field.options = (raw.options as string[]).map(option => option.trim());
    } else if (raw.options !== undefined) {
      return { ok: false, code: "UNEXPECTED_FORM_FIELD_OPTIONS", fieldId: raw.id };
    }
    if (raw.type === "slider") {
      if (schemaVersion !== RANGE_FORM_SCHEMA_VERSION) return { ok: false, code: "FORM_SLIDER_SCHEMA_VERSION_REQUIRED", fieldId: raw.id };
      if (typeof raw.min !== "number" || typeof raw.max !== "number" || typeof raw.step !== "number" ||
          !Number.isFinite(raw.min) || !Number.isFinite(raw.max) || !Number.isFinite(raw.step) ||
          Math.abs(raw.min) > 1_000_000_000_000 || Math.abs(raw.max) > 1_000_000_000_000 ||
          raw.max <= raw.min || raw.step <= 0) {
        return { ok: false, code: "INVALID_FORM_FIELD_RANGE", fieldId: raw.id };
      }
      const stepCount = (raw.max - raw.min) / raw.step;
      if (!Number.isFinite(stepCount) || stepCount > 1_000_000 || Math.abs(stepCount - Math.round(stepCount)) > 1e-8) {
        return { ok: false, code: "INVALID_FORM_FIELD_RANGE", fieldId: raw.id };
      }
      field.min = raw.min;
      field.max = raw.max;
      field.step = raw.step;
    } else if (raw.min !== undefined || raw.max !== undefined || raw.step !== undefined) {
      return { ok: false, code: "UNEXPECTED_FORM_FIELD_RANGE", fieldId: raw.id };
    }
    if (raw.condition !== undefined) conditions.push({ fieldId: raw.id, condition: raw.condition });
    fields.push(field);
  }
  for (const { fieldId, condition } of conditions) {
    const target = fields.find(field => field.id === fieldId)!;
    if (schemaVersion < CONDITIONAL_FORM_SCHEMA_VERSION || !isRecord(condition) || !hasOnlyKeys(condition, ["fieldId", "equals"]) ||
        typeof condition.fieldId !== "string" || !/^[a-z][a-z0-9_-]{0,39}$/.test(condition.fieldId)) {
      return { ok: false, code: "INVALID_FORM_FIELD_CONDITION", fieldId };
    }
    const source = fields.find(field => field.id === condition.fieldId);
    if (!source || source.id === target.id || source.condition || !["select", "radio", "checkbox"].includes(source.type)) {
      return { ok: false, code: "INVALID_FORM_CONDITION_SOURCE", fieldId };
    }
    if (source.type === "checkbox") {
      if (typeof condition.equals !== "boolean") return { ok: false, code: "INVALID_FORM_CONDITION_VALUE", fieldId };
    } else if (typeof condition.equals !== "string" || !source.options?.includes(condition.equals)) {
      return { ok: false, code: "INVALID_FORM_CONDITION_VALUE", fieldId };
    }
    target.condition = { fieldId: source.id, equals: condition.equals as string | boolean };
  }
  if (!isRecord(input.consent) || !hasOnlyKeys(input.consent, ["text", "version", "privacyUrl"]) || !boundedText(input.consent.text, 2_000) ||
      !boundedText(input.consent.version, 64) || !validPrivacyUrl(input.consent.privacyUrl)) {
    return { ok: false, code: "INVALID_FORM_CONSENT" };
  }
  if (!boundedText(input.successMessage, 240)) return { ok: false, code: "INVALID_FORM_SUCCESS_MESSAGE" };
  if (!Number.isInteger(input.retentionDays) || (input.retentionDays as number) < 1 || (input.retentionDays as number) > 365) {
    return { ok: false, code: "INVALID_FORM_RETENTION" };
  }
  const definition: FormDefinition = {
    schemaVersion,
    name: input.name.trim(),
    fields,
    consent: {
      text: input.consent.text.trim(),
      version: input.consent.version.trim(),
      ...(input.consent.privacyUrl ? { privacyUrl: input.consent.privacyUrl } : {})
    },
    successMessage: input.successMessage.trim(),
    retentionDays: input.retentionDays as number
  };
  if (new TextEncoder().encode(JSON.stringify(definition)).byteLength > MAX_FORM_DEFINITION_BYTES) {
    return { ok: false, code: "FORM_DEFINITION_TOO_LARGE" };
  }
  return { ok: true, value: definition };
}

const isValidIsoDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
};

export function normalizeFormSubmission(
  definition: FormDefinition,
  input: unknown
): FormValidationResult<NormalizedFormSubmission> {
  if (!isRecord(input) || !hasOnlyKeys(input, ["values", "consentAccepted", "website"]) || !isRecord(input.values)) return { ok: false, code: "INVALID_FORM_SUBMISSION" };
  // The honeypot is evaluated before schema errors to avoid revealing field
  // behavior to common bot probes. It is never persisted or echoed.
  const spam = typeof input.website === "string" && input.website.length > 0;
  if (input.consentAccepted !== true) return { ok: false, code: "FORM_CONSENT_REQUIRED" };
  const allowedIds = new Set(definition.fields.map(field => field.id));
  if (Object.keys(input.values).some(id => !allowedIds.has(id))) return { ok: false, code: "UNKNOWN_FORM_FIELD" };
  const values: Record<string, string | number | boolean> = {};
  for (const field of definition.fields) {
    if (field.condition) {
      const source = definition.fields.find(candidate => candidate.id === field.condition!.fieldId);
      // An omitted optional checkbox has the same meaning as an unchecked one.
      const rawConditionValue = input.values[field.condition.fieldId];
      const conditionValue = source?.type === "checkbox" && rawConditionValue === undefined ? false : rawConditionValue;
      if (conditionValue !== field.condition.equals) {
        if (Object.hasOwn(input.values, field.id)) return { ok: false, code: "HIDDEN_FORM_FIELD_SUBMITTED", fieldId: field.id };
        continue;
      }
    }
    const value = input.values[field.id];
    const empty = value === undefined || value === null || value === "" || (typeof value === "string" && value.trim() === "");
    if (empty && field.required) return { ok: false, code: "FORM_FIELD_REQUIRED", fieldId: field.id };
    if (empty) continue;
    if (field.type === "checkbox") {
      if (typeof value !== "boolean") return { ok: false, code: "INVALID_FORM_FIELD_VALUE", fieldId: field.id };
      if (field.required && value !== true) return { ok: false, code: "FORM_FIELD_REQUIRED", fieldId: field.id };
      values[field.id] = value;
      continue;
    }
    if (field.type === "number" || field.type === "slider") {
      const normalized = normalizeNumberFieldValue(value);
      if (normalized === null) return { ok: false, code: "INVALID_FORM_NUMBER", fieldId: field.id };
      if (field.type === "slider") {
        if (normalized < field.min! || normalized > field.max!) {
          return { ok: false, code: "FORM_SLIDER_OUT_OF_RANGE", fieldId: field.id };
        }
        const stepPosition = (normalized - field.min!) / field.step!;
        if (Math.abs(stepPosition - Math.round(stepPosition)) > 1e-8) {
          return { ok: false, code: "FORM_SLIDER_INVALID_STEP", fieldId: field.id };
        }
      }
      values[field.id] = normalized;
      continue;
    }
    if (typeof value !== "string") return { ok: false, code: "INVALID_FORM_FIELD_VALUE", fieldId: field.id };
    const normalized = value.trim();
    const maxLength = field.type === "email"
      ? Math.min(field.maxLength ?? MAX_FORM_EMAIL_LENGTH, MAX_FORM_EMAIL_LENGTH)
      : field.maxLength ?? (field.type === "textarea" ? 4_000 : field.type === "tel" ? 40 : 500);
    if (normalized.length > maxLength) {
      return { ok: false, code: "FORM_FIELD_TOO_LONG", fieldId: field.id };
    }
    if (field.type === "date" && !isValidIsoDate(normalized)) {
      return { ok: false, code: "INVALID_FORM_DATE", fieldId: field.id };
    }
    if (field.type === "url" && !validHttpUrlFieldValue(normalized)) {
      return { ok: false, code: "INVALID_FORM_URL", fieldId: field.id };
    }
    if (field.type === "tel" && !validPhoneFieldValue(normalized)) {
      return { ok: false, code: "INVALID_FORM_PHONE", fieldId: field.id };
    }
    if (field.type === "email" && !validEmailFieldValue(normalized)) {
      return { ok: false, code: "INVALID_FORM_EMAIL", fieldId: field.id };
    }
    if ((field.type === "select" || field.type === "radio") && !field.options?.includes(normalized)) {
      return { ok: false, code: "INVALID_FORM_OPTION", fieldId: field.id };
    }
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(normalized)) {
      return { ok: false, code: "INVALID_FORM_FIELD_VALUE", fieldId: field.id };
    }
    values[field.id] = normalized;
  }
  return { ok: true, value: { values, consentAccepted: true, spam } };
}
