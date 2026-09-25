export type DomainId = string;

export type AssetKind = "image" | "video" | "audio" | "font" | "file" | "other";
export type StorageProvider = "r2" | "external";

export type AssetReference = { assetId: DomainId };

export type MediaAsset = {
  id: DomainId;
  siteId: DomainId;
  kind: AssetKind;
  storageProvider: StorageProvider;
  storageKey: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  originalName: string;
  altText: string;
  title: string;
  metadata: Record<string, unknown>;
  isOrphaned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GameProfile = {
  id: DomainId;
  siteId: DomainId;
  slug: string;
  name: string;
  platform: string | null;
  category: string | null;
  coverAssetId: DomainId | null;
  iconAssetId: DomainId | null;
  brand: Record<string, unknown>;
  metadata: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ScheduleEvent = {
  id: DomainId;
  siteId: DomainId;
  title: string;
  startsAt: string;
  endsAt: string | null;
  status: "scheduled" | "live" | "completed" | "cancelled";
  platform: string;
  url: string | null;
  notes: string;
  gameProfileId: DomainId | null;
  source: string;
  sourceId: string | null;
  sourceAccountId: string | null;
  sourcePresence: "present" | "missing";
  sourceSyncedAt: string | null;
  sourceMissingAt: string | null;
  isRecurring: boolean;
  sourceCategoryId: string | null;
  sourceCategoryName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ThemeTokens = {
  colors: Record<string, string>;
  typography: Record<string, string | number>;
  spacing: Record<string, string | number>;
  radii: Record<string, string | number>;
  shadows: Record<string, string>;
  borders: Record<string, string | number>;
  layout: Record<string, string | number>;
  responsive: Record<string, string | number>;
  motion: Record<string, string | number>;
  states: Record<string, unknown>;
  accessibility: Record<string, unknown>;
};

export type SitePresentation = {
  siteId: DomainId;
  themeVersion: number;
  tokens: ThemeTokens;
  componentOverrides: Record<string, Record<string, unknown>>;
  pageOverrides: Record<string, Record<string, unknown>>;
  revision: number;
  status: "draft" | "published";
  updatedAt: string;
};

function requireId(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Invalid ${field}`);
  return value.trim();
}

function requireIsoDate(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim() || !Number.isFinite(Date.parse(value))) {
    throw new Error(`Invalid ${field}`);
  }
  return new Date(value).toISOString();
}

export function normalizeAssetReference(value: unknown): AssetReference {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid asset reference");
  return { assetId: requireId((value as { assetId?: unknown }).assetId, "assetId") };
}

export function normalizeGameProfile(input: GameProfile): GameProfile {
  return {
    ...input,
    id: requireId(input.id, "id"),
    siteId: requireId(input.siteId, "siteId"),
    slug: requireId(input.slug, "slug"),
    name: requireId(input.name, "name"),
    coverAssetId: input.coverAssetId == null ? null : requireId(input.coverAssetId, "coverAssetId"),
    iconAssetId: input.iconAssetId == null ? null : requireId(input.iconAssetId, "iconAssetId"),
    brand: { ...(input.brand ?? {}) },
    metadata: { ...(input.metadata ?? {}) },
    createdAt: requireIsoDate(input.createdAt, "createdAt"),
    updatedAt: requireIsoDate(input.updatedAt, "updatedAt")
  };
}

export function normalizeScheduleEvent(input: ScheduleEvent): ScheduleEvent {
  const startsAt = requireIsoDate(input.startsAt, "startsAt");
  const endsAt = input.endsAt == null ? null : requireIsoDate(input.endsAt, "endsAt");
  if (endsAt && Date.parse(endsAt) <= Date.parse(startsAt)) {
    throw new Error("Schedule event end must be after start");
  }

  return {
    ...input,
    id: requireId(input.id, "id"),
    siteId: requireId(input.siteId, "siteId"),
    title: requireId(input.title, "title"),
    startsAt,
    endsAt,
    platform: requireId(input.platform, "platform"),
    url: input.url == null ? null : String(input.url),
    notes: String(input.notes ?? ""),
    gameProfileId: input.gameProfileId == null ? null : requireId(input.gameProfileId, "gameProfileId"),
    source: requireId(input.source, "source"),
    sourceId: input.sourceId == null ? null : requireId(input.sourceId, "sourceId"),
    sourceAccountId: input.sourceAccountId == null ? null : requireId(input.sourceAccountId, "sourceAccountId"),
    sourceSyncedAt: input.sourceSyncedAt == null ? null : requireIsoDate(input.sourceSyncedAt, "sourceSyncedAt"),
    sourceMissingAt: input.sourceMissingAt == null ? null : requireIsoDate(input.sourceMissingAt, "sourceMissingAt"),
    sourceCategoryId: input.sourceCategoryId == null ? null : requireId(input.sourceCategoryId, "sourceCategoryId"),
    sourceCategoryName: input.sourceCategoryName == null ? null : String(input.sourceCategoryName),
    createdAt: requireIsoDate(input.createdAt, "createdAt"),
    updatedAt: requireIsoDate(input.updatedAt, "updatedAt")
  };
}

export function createDefaultThemeTokens(): ThemeTokens {
  return {
    colors: {}, typography: {}, spacing: {}, radii: {}, shadows: {},
    borders: {}, layout: {}, responsive: {}, motion: {}, states: {}, accessibility: {}
  };
}

export function createSitePresentation(siteId: string, now = new Date().toISOString()): SitePresentation {
  return {
    siteId: requireId(siteId, "siteId"),
    themeVersion: 1,
    tokens: createDefaultThemeTokens(),
    componentOverrides: {},
    pageOverrides: {},
    revision: 0,
    status: "draft",
    updatedAt: requireIsoDate(now, "updatedAt")
  };
}
