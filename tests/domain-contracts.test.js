import assert from "node:assert/strict";
import test from "node:test";

import {
  createSitePresentation,
  normalizeAssetReference,
  normalizeGameProfile,
  normalizeScheduleEvent
} from "../src/core/domain/contracts.ts";

const NOW = "2026-09-25T10:00:00.000Z";

test("asset references contain only the canonical asset id", () => {
  assert.deepEqual(normalizeAssetReference({ assetId: "asset-1", extra: "ignored" }), {
    assetId: "asset-1"
  });
});

test("game profile is site-scoped and supports asset references", () => {
  const profile = normalizeGameProfile({
    id: "game-1", siteId: "site-1", slug: "fortnite", name: "Fortnite",
    platform: "pc", category: null, coverAssetId: "asset-cover", iconAssetId: null,
    brand: { accent: "blue" }, metadata: {}, isActive: true, createdAt: NOW, updatedAt: NOW
  });
  assert.equal(profile.siteId, "site-1");
  assert.equal(profile.coverAssetId, "asset-cover");
});

test("schedule event references a game profile instead of copying game data", () => {
  const event = normalizeScheduleEvent({
    id: "event-1", siteId: "site-1", title: "Fortnite stream",
    startsAt: NOW, endsAt: "2026-09-25T12:00:00.000Z", status: "scheduled",
    platform: "Twitch", url: null, notes: "", gameProfileId: "game-1",
    source: "twitch", sourceId: "twitch-segment-1", sourceAccountId: "1144260301",
    sourcePresence: "present", sourceSyncedAt: NOW, sourceMissingAt: null,
    isRecurring: false, sourceCategoryId: "cat-1", sourceCategoryName: "Fortnite",
    createdAt: NOW, updatedAt: NOW
  });
  assert.equal(event.gameProfileId, "game-1");
  assert.equal("gameName" in event, false);
  assert.equal("coverAssetId" in event, false);
});

test("schedule event rejects an invalid time range", () => {
  assert.throws(() => normalizeScheduleEvent({
    id: "event-1", siteId: "site-1", title: "Invalid",
    startsAt: NOW, endsAt: NOW, status: "scheduled", platform: "Twitch",
    url: null, notes: "", gameProfileId: null, source: "manual",
    sourceId: null, sourceAccountId: null, sourcePresence: "present",
    sourceSyncedAt: null, sourceMissingAt: null, isRecurring: false,
    sourceCategoryId: null, sourceCategoryName: null, createdAt: NOW, updatedAt: NOW
  }), /end must be after start/);
});

test("site presentation is site-scoped and revisioned", () => {
  const presentation = createSitePresentation("site-1", NOW);
  assert.equal(presentation.siteId, "site-1");
  assert.equal(presentation.themeVersion, 1);
  assert.equal(presentation.revision, 0);
  assert.equal(presentation.status, "draft");
  assert.deepEqual(presentation.componentOverrides, {});
  assert.deepEqual(presentation.pageOverrides, {});
});
