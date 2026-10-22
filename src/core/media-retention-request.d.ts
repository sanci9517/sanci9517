export type RetentionAsset = {
  id: string;
  site_id: string;
  object_key: string;
  archived_at?: string | null;
};

export type RetentionUsage = { complete: boolean; references: unknown[] };

export type RetentionPreview = {
  siteId: string;
  assetId: string;
  objectKey: string;
  state: "requested";
  notBefore: string;
  finalDeletionAuthorized: false;
};

export type RetentionPreparation =
  | { ok: true; value: RetentionPreview }
  | { ok: false; reason: string };

export function prepareRetentionRequest(input: {
  asset: RetentionAsset;
  usage: RetentionUsage;
  objectPresent: boolean;
  now: Date;
  days?: number;
}): Promise<RetentionPreparation>;

export function prepareRetentionCancellation(request: {
  id: string;
  site_id: string;
  state: string;
}): RetentionPreparation;
