# Sanci9517 — Change Log

## 2026-09-16

### Canonical Page Model foundation
- Added `published_content_json` to the page storage model.
- Added one-time migration `0006_canonicalize_legacy_pages.sql` for the existing legacy page rows.
- Canonical migration creates a server-side Visual Editor document and an initial revision for each migrated page.
- Visual Editor persistence now loads and saves one canonical page at a time.
- Visual Editor no longer silently creates a fallback document when the server returns a non-canonical page.
- New page creation now creates the canonical document on the server and creates revision 1.
- Page deletion is blocked when it would remove the last page.
- Public page API and renderer now accept only canonical published Page Model data.
- Public renderer was aligned with the editor's `content` fields for links and images.
- Added `docs/CURRENT-DEVELOPMENT-PLAN.md` as the ordered execution checklist.

### Verification status
- D1 `pages` schema verified on 2026-09-16.
- D1 page content audit verified on 2026-09-16.
- D1 revision audit verified on 2026-09-16.
- Remote application of migration 0006 and post-migration verification are still pending.
