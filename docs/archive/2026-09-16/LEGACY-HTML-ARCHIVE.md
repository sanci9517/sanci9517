# Legacy HTML archive manifest — 2026-09-16

These files belong to the pre-canonical static-page implementation. They must not be read by the Visual Editor or the public canonical renderer after migration.

## Files scheduled for archive

- `public/about.html` → canonical page slug `about`
- `public/community.html` → canonical page slug `community`
- `public/contact.html` → canonical page slug `contact`
- `public/schedule.html` → canonical page slug `schedule`
- `public/tiktok.html` → canonical page slug `tiktok`
- `public/twitch.html` → canonical page slug `twitch`
- `public/vod.html` → canonical page slug `vod`
- `public/youtube.html` → canonical page slug `youtube`

## Archive rule

The files are retained in Git history and will be moved to a dated archive after the canonical D1 migration and public URL verification succeed. They are not allowed to remain an active data source.

## Migration

Migration: `migrations/0006_canonicalize_legacy_pages.sql`  
Date: `2026-09-16`

## Important

Historical SQL migrations are not treated as active legacy code and must remain in `migrations/` because D1 migration history depends on them.
