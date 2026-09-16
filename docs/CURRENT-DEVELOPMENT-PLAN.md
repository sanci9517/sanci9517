# Sanci9517 — CURRENT DEVELOPMENT PLAN

**Version:** 2026-09-16  
**Branch:** `v2/foundation`  
**Status authority:** this file is the execution checklist; the other planning documents remain design/reference history.

## Working rules

1. One numbered point at a time.
2. Every point is tested before the next point starts.
3. D1 is the server-side source of truth.
4. `pages.content_json` is the canonical draft/editor document.
5. `pages.published_content_json` is the explicit published snapshot.
6. Visual Editor works with one canonical page at a time.
7. Legacy HTML is migrated once, then archived and no longer read by the active system.
8. Every significant change is dated in Git history and `docs/CHANGELOG.md`.
9. No workaround architecture: if a feature is wrong, fix the underlying architecture.
10. New functionality is added only after the current foundation is verified.

## Execution checklist

### FOUNDATION — current phase

- [~] **01 — D1 canonical storage audit**
  - Verify `pages` schema.
  - Verify every page has canonical content.
  - Verify revisions.
  - Verify no active code requires legacy content.

- [ ] **02 — Apply canonical migration**
  - Run migration `0006_canonicalize_legacy_pages.sql` remotely.
  - Verify all existing pages are canonical.
  - Verify one initial migration revision exists for every migrated page.

- [ ] **03 — Active/legacy separation**
  - Archive the replaced legacy HTML files under a dated archive.
  - Keep historical SQL migrations as migrations; never delete applied migration history.
  - Verify active runtime has no dependency on archived HTML.

- [ ] **04 — Editor page loading**
  - Page selector loads server catalog.
  - Selecting a page loads exactly that page from D1.
  - No client-side multi-page document is used as the persistence source.

- [ ] **05 — Editor save**
  - Edit one element.
  - Save.
  - Confirm D1 `content_json` changed.
  - Confirm a new revision was created.

- [ ] **06 — Save/reload identity test**
  - Reload the page from D1.
  - Confirm the exact saved document returns.
  - Confirm no fallback document is generated.

- [ ] **07 — Revision and rollback**
  - Create multiple revisions.
  - Read revision list.
  - Roll back.
  - Verify rollback creates a new revision and updates canonical draft.

- [ ] **08 — Preview**
  - Preview reads draft `content_json` only for authenticated editors.
  - Public users cannot see unpublished draft data.

- [ ] **09 — Publish**
  - Publish copies canonical draft to `published_content_json`.
  - Verify public renderer changes only after publish.

- [ ] **10 — Public renderer**
  - `/p/<slug>` reads only published canonical Page Model.
  - Non-canonical content is rejected, not silently converted.

### CMS

- [ ] **11 — Independent page editing**
- [ ] **12 — New page creation**
- [ ] **13 — Page rename**
- [ ] **14 — Page deletion**
- [ ] **15 — Page slug management**
- [ ] **16 — Permissions / editor roles**
- [ ] **17 — Audit log verification**
- [ ] **18 — Autosave**
- [ ] **19 — Backup / restore**
- [ ] **20 — Full CMS regression test**

### SITE SYSTEM

- [ ] **21 — Shared navigation**
- [ ] **22 — Shared responsive design**
- [ ] **23 — Site settings from D1**
- [ ] **24 — Schedule data from D1**
- [ ] **25 — Twitch live data integration**
- [ ] **26 — YouTube integration**
- [ ] **27 — TikTok integration**
- [ ] **28 — VOD system**
- [ ] **29 — Community / Discord system**
- [ ] **30 — Contact / collaboration system**

### PLATFORM

- [ ] **31 — Media library / R2**
- [ ] **32 — Design tokens**
- [ ] **33 — Reusable components**
- [ ] **34 — Templates / page duplication**
- [ ] **35 — Analytics**
- [ ] **36 — Observability and error reporting**
- [ ] **37 — Security hardening**
- [ ] **38 — Performance / caching**
- [ ] **39 — Production backup and recovery test**
- [ ] **40 — Production release checklist**

### AI PLATFORM — only after the stable platform foundation

- [ ] **41 — Stream observation layer**
- [ ] **42 — Silence / pacing detection**
- [ ] **43 — Chat/context analysis**
- [ ] **44 — Contextual live suggestions**
- [ ] **45 — Streamer profile and long-term memory**
- [ ] **46 — Experience learning / evaluation cycles**
- [ ] **47 — One-click clip / Short creation**
- [ ] **48 — Stream setup diagnostics and testing assistant**
- [ ] **49 — AI control center**
- [ ] **50 — End-to-end AI platform testing**

## Current stop point

**01 is being closed now.** The D1 audit already proved that the schema contains `published_content_json`, that one page is already canonical, and that the other existing page rows are legacy records. Code changes have now been prepared so the one-time canonical migration can be applied and the active editor/public renderer no longer falls back to legacy documents.

**Next user action:** apply migration 0006 remotely, then run the verification SQL supplied in the chat. Do not manually delete page rows.
