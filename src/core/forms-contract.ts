/**
 * Versioned, server-owned contract for first-party public forms.
 *
 * Form definitions are intentionally data-only: no arbitrary action URL, HTML,
 * file upload, script, or provider callback is accepted here. Public rendering,
 * editor binding, and submission handling must all consume this same schema.
 */
export const FORM_SCHEMA_VERSION = 1 as const;
export const MAX_FORM_FIELDS = 24;
export const MAX_FORM_OPTIONS = 20;
export const MAX_FORM_DEFINITION_BYTES = 16_384;
export const MAX_FORM_SUBMISSION_BYTES = 12_288;

export type FormFieldType = "text" | "email" | "textarea" | "select" | "checkbox";

export type FormFieldDefinition = {
  id: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  maxLength?: number;
};

export type FormDefinition = {
  schemaVersion: typeof FORM_SCHEMA_VERSION;
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
  values: Record<string, string | boolean>;
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

export function normalizeFormDefinition(input: unknown): FormValidationResult<FormDefinition> {
  if (!isRecord(input) || !hasOnlyKeys(input, ["schemaVersion", "name", "fields", "consent", "successMessage", "retentionDays"]) || input.schemaVersion !== FORM_SCHEMA_VERSION) {
    return { ok: false, code: "UNSUPPORTED_FORM_SCHEMA_VERSION" };
  }
  if (!boundedText(input.name, 100)) return { ok: false, code: "INVALID_FORM_NAME" };
  if (!Array.isArray(input.fields) || input.fields.length < 1 || input.fields.length > MAX_FORM_FIELDS) {
    return { ok: false, code: "INVALID_FORM_FIELDS" };
  }
  const ids = new Set<string>();
  const fields: FormFieldDefinition[] = [];
  for (const raw of input.fields) {
    if (!isRecord(raw) || !hasOnlyKeys(raw, ["id", "type", "label", "required", "helpText", "options", "maxLength"]) ||
        typeof raw.id !== "string" || !/^[a-z][a-z0-9_-]{0,39}$/.test(raw.id) || ids.has(raw.id)) {
      return { ok: false, code: "INVALID_FORM_FIELD_ID" };
    }
    ids.add(raw.id);
    if (!(["text", "email", "textarea", "select", "checkbox"] as unknown[]).includes(raw.type)) {
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
      if (!Number.isInteger(raw.maxLength) || (raw.maxLength as number) < 1 || (raw.maxLength as number) > 4_000 || raw.type === "checkbox" || raw.type === "select") {
        return { ok: false, code: "INVALID_FORM_FIELD_LENGTH", fieldId: raw.id };
      }
      field.maxLength = raw.maxLength as number;
    }
    if (raw.type === "select") {
      if (!Array.isArray(raw.options) || raw.options.length < 1 || raw.options.length > MAX_FORM_OPTIONS ||
          raw.options.some(option => !boundedText(option, 120)) ||
          new Set((raw.options as string[]).map(option => option.trim())).size !== raw.options.length) {
        return { ok: false, code: "INVALID_FORM_FIELD_OPTIONS", fieldId: raw.id };
      }
      field.options = (raw.options as string[]).map(option => option.trim());
    } else if (raw.options !== undefined) {
      return { ok: false, code: "UNEXPECTED_FORM_FIELD_OPTIONS", fieldId: raw.id };
    }
    fields.push(field);
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
    schemaVersion: FORM_SCHEMA_VERSION,
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
  const values: Record<string, string | boolean> = {};
  for (const field of definition.fields) {
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
    if (typeof value !== "string") return { ok: false, code: "INVALID_FORM_FIELD_VALUE", fieldId: field.id };
    const normalized = value.trim();
    if (normalized.length > (field.maxLength ?? (field.type === "textarea" ? 4_000 : 500))) {
      return { ok: false, code: "FORM_FIELD_TOO_LONG", fieldId: field.id };
    }
    if (field.type === "email" && !/^[^\s@<>]{1,128}@[A-Za-z0-9.-]{1,190}\.[A-Za-z]{2,63}$/.test(normalized)) {
      return { ok: false, code: "INVALID_FORM_EMAIL", fieldId: field.id };
    }
    if (field.type === "select" && !field.options?.includes(normalized)) {
      return { ok: false, code: "INVALID_FORM_OPTION", fieldId: field.id };
    }
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(normalized)) {
      return { ok: false, code: "INVALID_FORM_FIELD_VALUE", fieldId: field.id };
    }
    values[field.id] = normalized;
  }
  return { ok: true, value: { values, consentAccepted: true, spam } };
}
