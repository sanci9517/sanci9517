/*
 * Sanci9517 Visual Editor v2 — canonical Schedule node configuration.
 *
 * This module owns only the Page Model configuration contract for a
 * schedule node. Schedule domain records remain outside the Page Model.
 */

export const SCHEDULE_SCHEMA_VERSION = 1;

export const SCHEDULE_MODES = Object.freeze(['upcoming', 'all', 'next']);
export const SCHEDULE_ORDERS = Object.freeze(['asc', 'desc']);
export const SCHEDULE_STATUSES = Object.freeze(['scheduled', 'live', 'completed']);
export const SCHEDULE_LIMIT_MAX = 50;
export const SCHEDULE_PLATFORM_MAX = 40;
export const SCHEDULE_PLATFORMS_MAX = 20;
export const SCHEDULE_EMPTY_TEXT_MAX = 200;

export const DEFAULT_SCHEDULE_CONFIG = Object.freeze({
  version: SCHEDULE_SCHEMA_VERSION,
  mode: 'upcoming',
  limit: 10,
  statuses: Object.freeze(['scheduled', 'live']),
  platforms: Object.freeze([]),
  order: 'asc',
  showTitle: true,
  showPlatform: true,
  showTime: true,
  showEndTime: false,
  showStatus: false,
  showNotes: false,
  showLink: true,
  emptyText: 'Nincs tervezett stream.'
});

function assertObject(value, message) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(message);
  }
}

function normalizeStringArray(value, allowed, field) {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);
  const normalized = [...new Set(value.map((item) => {
    if (typeof item !== 'string' || !item.trim()) {
      throw new Error(`${field} contains an invalid value`);
    }
    const trimmed = item.trim();
    if (allowed && !allowed.includes(trimmed)) {
      throw new Error(`${field} contains an unsupported value: ${trimmed}`);
    }
    return trimmed;
  }))];

  if (normalized.length === 0) throw new Error(`${field} must contain at least one value`);
  return normalized;
}

function normalizePlatforms(value) {
  if (!Array.isArray(value)) throw new Error('platforms must be an array');
  if (value.length > SCHEDULE_PLATFORMS_MAX) {
    throw new Error(`platforms must contain at most ${SCHEDULE_PLATFORMS_MAX} values`);
  }

  return [...new Set(value.map((item) => {
    if (typeof item !== 'string') throw new Error('platforms contains an invalid value');
    const trimmed = item.trim();
    if (!trimmed) throw new Error('platforms contains an invalid value');
    if (trimmed.length > SCHEDULE_PLATFORM_MAX) {
      throw new Error(`platform names must be at most ${SCHEDULE_PLATFORM_MAX} characters`);
    }
    return trimmed;
  }))];
}

function normalizeBoolean(value, field) {
  if (typeof value !== 'boolean') throw new Error(`${field} must be a boolean`);
  return value;
}

export function createDefaultScheduleConfig() {
  return {
    ...DEFAULT_SCHEDULE_CONFIG,
    statuses: [...DEFAULT_SCHEDULE_CONFIG.statuses],
    platforms: []
  };
}

export function normalizeScheduleConfig(value = {}) {
  assertObject(value, 'Schedule config must be an object');

  const version = value.version ?? SCHEDULE_SCHEMA_VERSION;
  if (version !== SCHEDULE_SCHEMA_VERSION) {
    throw new Error(`Unsupported Schedule schema version: ${version}`);
  }

  const mode = value.mode ?? DEFAULT_SCHEDULE_CONFIG.mode;
  if (!SCHEDULE_MODES.includes(mode)) throw new Error(`Unsupported Schedule mode: ${mode}`);

  const limit = value.limit ?? DEFAULT_SCHEDULE_CONFIG.limit;
  if (!Number.isInteger(limit) || limit < 1 || limit > SCHEDULE_LIMIT_MAX) {
    throw new Error(`Schedule limit must be an integer between 1 and ${SCHEDULE_LIMIT_MAX}`);
  }

  const statuses = normalizeStringArray(
    value.statuses ?? DEFAULT_SCHEDULE_CONFIG.statuses,
    SCHEDULE_STATUSES,
    'statuses'
  );

  const platforms = normalizePlatforms(value.platforms ?? []);

  const order = value.order ?? DEFAULT_SCHEDULE_CONFIG.order;
  if (!SCHEDULE_ORDERS.includes(order)) throw new Error(`Unsupported Schedule order: ${order}`);

  const booleans = ['showTitle', 'showPlatform', 'showTime', 'showEndTime', 'showStatus', 'showNotes', 'showLink'];
  const normalized = {
    version: SCHEDULE_SCHEMA_VERSION,
    mode,
    limit,
    statuses,
    platforms,
    order
  };

  for (const field of booleans) {
    normalized[field] = normalizeBoolean(
      value[field] ?? DEFAULT_SCHEDULE_CONFIG[field],
      field
    );
  }

  const emptyText = value.emptyText ?? DEFAULT_SCHEDULE_CONFIG.emptyText;
  if (typeof emptyText !== 'string') throw new Error('emptyText must be a string');
  const normalizedEmptyText = emptyText.trim();
  if (!normalizedEmptyText) throw new Error('emptyText must not be empty');
  if (normalizedEmptyText.length > SCHEDULE_EMPTY_TEXT_MAX) {
    throw new Error(`emptyText must be at most ${SCHEDULE_EMPTY_TEXT_MAX} characters`);
  }

  normalized.emptyText = normalizedEmptyText;
  return normalized;
}

export function validateScheduleConfig(value) {
  try {
    normalizeScheduleConfig(value);
    return [];
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)];
  }
}
