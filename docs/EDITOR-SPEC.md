# Sanci9517 Visual Editor — Platform Specification

## 1. Goal

Build a professional visual website editor that remains easy enough for a first-time user while exposing advanced capabilities when needed. The current dark editor shell is retained as the UX foundation; complexity is progressively revealed instead of being forced on every user.

The editor is not Sanci-only. Sanci-specific blocks are a first-party extension layer on top of a generic website-builder core.

## 2. Non-negotiable principles

- PLAN → DEVELOP → TEST → FIX → APPROVE → NEXT PHASE.
- No phase is considered complete until its tests pass and the user approves it.
- Server-side document state is designed from the beginning.
- The canvas stores structured data, not generated HTML as the source of truth.
- Generic editor core and Sanci-specific integrations remain separate.
- Features are modular; adding a feature must not require replacing the document model.
- Desktop, tablet and mobile are first-class editing targets.
- Safe defaults keep the editor understandable for non-technical users.
- Advanced controls are available without making the basic workflow confusing.
- Production branch `v2/foundation` is protected by development branches and approval gates.

## 3. Feature coverage

### Canvas and editing
Selection, multi-selection, drag/drop, move, resize, rotate, duplicate, copy/paste, delete, lock, hide, z-index, rulers, guides, grid, snapping, alignment, distribution, zoom, pan, fit-to-screen, fullscreen, keyboard shortcuts, context menu and selection outlines.

### Layout
Sections, containers, columns, rows, flex, grid, stacks, absolute/relative/fixed/sticky positioning, min/max sizing, width/height, aspect ratio, margin, padding, gap, overflow and stacking contexts.

### Elements
Text, headings H1–H6, rich text, links, buttons, images, galleries, carousels, video, audio, icons, SVG, dividers, spacers, badges, avatars, cards, lists, tables, tabs, accordions, dropdowns, navigation, breadcrumbs, pagination, search, forms, inputs, checkbox, radio, select, slider, progress, map, embed, iframe, code/HTML, social embeds, countdown, popup/modal, notification and cookie UI.

### First-party Sanci blocks
Twitch live/player/status, YouTube, TikTok, Discord, schedule, next-stream countdown, VOD, stream statistics, follower/subscriber counters, social links, support/donation, community, gaming cards, game list and stream calendar.

### Inspector and styling
Content, typography, colors, backgrounds, gradients, borders, radius, shadows, opacity, transforms, filters, spacing, sizing, positioning, visibility, cursor, overflow, CSS classes, IDs, pseudo states and optional custom CSS.

### Design system
Global colors, fonts, typography scale, spacing, radius, shadows and CSS variables; reusable classes; reusable components; variants; global header/footer/navigation; light/dark themes.

### Responsive design
Desktop/laptop/tablet/mobile/custom breakpoints, inheritance and per-breakpoint overrides, responsive visibility, typography, spacing, layout and grid/flex behavior.

### Interactions and animation
Hover, click, double-click, mouse enter/leave, scroll, viewport entry, page load/leave and sticky triggers. Show/hide, toggle classes, scroll-to, popup actions, attribute changes and custom actions. Animation presets plus duration, delay, easing, loop, chaining, transforms, reveal, fade, slide, scale, rotate and parallax.

### Conditions
Authentication state, role, date/time/day, live status, URL/query parameters, device/browser, referrer and application/CMS state.

### CMS and dynamic content
Collections, custom fields, dynamic text/image/link, repeaters, query loops, filtering, sorting, pagination, infinite scroll, relations and dynamic page templates.

### Components and templates
Reusable components, variants, slots, nested components, global sections, page templates, archive templates, 404, popup templates, saved sections, import/export and template library.

### Media library
Images, video, audio, SVG and icons; folders, search, tags, alt text, metadata, compression, WebP/AVIF, crop, resize, focal point, replace and CDN-backed assets.

### Forms
Contact, newsletter, login, registration and custom forms; validation, required fields, spam protection, email notifications, webhook/database targets, success/error states and conditional fields.

### SEO
Title, description, canonical, robots, sitemap, Open Graph, Twitter/X cards, structured data/schema, redirects, slug, custom metadata, image alt text, heading audit, broken-link checks and SEO audit.

### Accessibility
Semantic HTML, heading hierarchy, alt text, ARIA, keyboard navigation, focus management, contrast checking, reduced-motion support, screen-reader labels and accessibility audit.

### Localization
Multiple locales, locale switcher, localized content and URLs, localized SEO metadata, hreflang, RTL support and translation-ready content.

### Preview, publishing and recovery
Draft, preview, staging, production, scheduled publishing, autosave, revision history, snapshots, rollback, backup/restore, diff and publish log.

### Collaboration
Comments, review, approval, permissions, roles, editor/content-only mode, design locks and activity log.

### Integrations
Twitch, YouTube, TikTok, Discord, Cloudflare D1/R2/KV, webhooks, REST APIs, embeds and controlled custom JS/CSS/HTML.

### AI layer
The AI layer operates on the same structured document model and can inspect, explain, modify and validate editor state. Example commands: add a Twitch block, normalize schedule cards, make mobile one-column, audit accessibility, or fix inconsistent spacing.

## 4. Architecture

The editor is split into modules rather than one large HTML file:

```text
public/editor/
├── core/
├── canvas/
├── elements/
├── layout/
├── inspector/
├── layers/
├── styles/
├── responsive/
├── interactions/
├── animations/
├── components/
├── cms/
├── media/
├── forms/
├── seo/
├── accessibility/
├── localization/
├── history/
├── preview/
├── publishing/
├── integrations/
└── ai/
```

The shell remains visually close to the current editor. The internal implementation is refactored behind that shell.

## 5. Canonical document model

A page is a versioned document containing a tree of nodes. Each node has a stable ID, generic layout properties, style references, responsive overrides, attributes, visibility/conditions and optional component/integration metadata.

Conceptual shape:

```text
Document
  metadata
  root
    Node[]
      id
      type
      children[]
      content
      layout
      style
      responsive
      attributes
      conditions
      interactions
      component
      integration
```

The model must allow unknown/new node types through a registry so future elements do not require changing the core document format.

## 6. Server-side persistence

The existing D1 foundation already has a `pages` table with JSON page content, plus site settings and media. The editor platform will evolve this safely with migrations rather than replacing the existing schema.

Planned server-side entities:
- editor documents/pages
- document revisions/snapshots
- reusable components/templates
- design-system tokens
- media metadata
- CMS collections/items
- publish records
- editor preferences
- audit events

The document JSON remains the canonical page structure; relational tables provide indexing, permissions, revisions, assets and operational metadata.

## 7. UX strategy for universal users

The default experience uses three levels:

1. **Simple:** common elements and visual controls.
2. **Advanced:** layout, responsive, states, animation and dynamic options.
3. **Expert:** CSS, HTML, API/integration and advanced conditions.

The user can start without knowing HTML/CSS. Nothing essential is hidden from an advanced user; advanced functionality is progressively disclosed.

## 8. Development phases

### Phase 2 — Canvas platform
2.1 document/node model
2.2 real selection
2.3 selection box
2.4 movement
2.5 resize
2.6 zoom coordinates
2.7 pan
2.8 grid
2.9 snap
2.10 Layers ↔ Canvas
2.11 multi-select/alignment
2.12 keyboard/context actions
2.13 persistent server-side document draft

### Phase 3 — Element registry
Generic node registry and element renderer. Add all core element categories through data-driven definitions.

### Phase 4 — Layout engine
Containers, flex/grid/stack, sizing, spacing, positioning and overflow.

### Phase 5 — Inspector and design system
Full style inspector, states, global tokens, classes and reusable styles.

### Phase 6 — Responsive engine
Breakpoints, inheritance and per-device overrides.

### Phase 7 — Components/templates
Reusable components, variants, slots and templates.

### Phase 8 — Interactions/animation
Trigger/action system and animation timeline/presets.

### Phase 9 — Dynamic/CMS
Collections, dynamic bindings, repeaters and conditions.

### Phase 10 — Media/forms
Media library, forms and external embeds.

### Phase 11 — SEO/accessibility/localization
Audits and production metadata systems.

### Phase 12 — Preview/publish/recovery
Draft/preview/staging/production, revisions, rollback and publish logs.

### Phase 13 — Integrations
Twitch/YouTube/TikTok/Discord and Cloudflare services.

### Phase 14 — AI control layer
Structured editor actions, analysis, validation and natural-language editing.

### Phase 15+ — collaboration, templates and advanced extensions
Permissions, comments, approvals, marketplace-style extension registry and further professional features.

## 9. Test gates

Every phase must have explicit tests for:
- UI rendering
- core interaction behavior
- desktop
- mobile/responsive behavior where relevant
- data persistence
- refresh/reload recovery
- API/server behavior where relevant
- invalid/error states
- regression against previous phases

A phase ends only when tests pass, fixes are applied, and the user explicitly approves it.

## 10. Current decision

Do not keep expanding the monolithic `public/admin-editor-v2.html` as the long-term architecture. It can remain the visual reference/prototype while the new modular editor platform is built on a development branch and promoted only after tests and approval.
