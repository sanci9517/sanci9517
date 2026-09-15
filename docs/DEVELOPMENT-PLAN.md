# Sanci9517 V2 — VÉGLEGES, TELJES FEJLESZTÉSI ÉS TESZTELÉSI MASTER TERV

> **Ez az egyetlen hivatalos fejlesztési terv.** A fejlesztést ebből a dokumentumból, szigorúan sorrendben végezzük. A tervet szándékosan túlméreteztük: a később esetleg nem használt funkciók is szerepelnek benne, hogy az architektúra és a fejlesztési sorrend később ne kényszerítsen újratervezésre.
>
> **Módszer:** tervpont → kód → GitHub ellenőrzés → Cloudflare deploy → API/D1 ellenőrzés → böngészőteszt → felhasználói visszaigazolás → `[x]` → következő pont.
>
> **Fontos:** `[x]` csak valóban ellenőrzött és felhasználó által visszaigazolt állapot lehet. `[~]` részleges/korlátozott, `[!]` blokkoló, `[ ]` még nincs kész.

---

# 0. VÉGÁLLAPOT — MIT ÉPÍTÜNK?

## 0.1 Publikus Sanci9517 streamer platform
- [ ] Prémium streamer/creator weboldal
- [ ] Magyar nyelvű látogatói felület
- [ ] Mobil/tablet/desktop támogatás
- [ ] Twitch központú jelenlét
- [ ] TikTok központú jelenlét
- [ ] YouTube központú jelenlét
- [ ] Discord közösségi jelenlét
- [ ] Adásrend
- [ ] Következő adás visszaszámláló
- [ ] Élő/Offline állapot
- [ ] VOD rendszer
- [ ] Rövid videók/Shorts rendszer
- [ ] Közösségi oldalak
- [ ] Rólam oldal
- [ ] Kapcsolat oldal
- [ ] Támogatás oldal
- [ ] Közösség oldal
- [ ] Szponzor/üzleti oldal
- [ ] Média/press kit
- [ ] Dinamikus aloldalak
- [ ] SEO
- [ ] Analytics
- [ ] Accessibility

## 0.2 Admin + CMS
- [ ] Teljes admin
- [ ] Auth
- [ ] RBAC
- [ ] Dashboard
- [ ] Oldalkezelés
- [ ] Visual Editor
- [ ] Média
- [ ] Adásrend
- [ ] Social
- [ ] VOD
- [ ] Analytics
- [ ] SEO
- [ ] Beállítások
- [ ] Integrációk
- [ ] Audit log
- [ ] Draft/Publish
- [ ] Versioning
- [ ] Rollback
- [ ] Backup/Restore
- [ ] Import/Export
- [ ] AI vezérlés előkészítés

## 0.3 AI-ready rendszer
- [ ] Strukturált page model
- [ ] Strukturált component model
- [ ] Stabil element ID-k
- [ ] Stabil action ID-k
- [ ] Géppel olvasható schema
- [ ] Validálható műveletek
- [ ] Preview-before-apply
- [ ] AI audit
- [ ] AI rollback
- [ ] AI oldal szerkesztés
- [ ] AI tartalomjavaslat
- [ ] Későbbi Stream Assistant

---

# 1. PROJEKT- ÉS ARCHITEKTÚRA ALAPOK

- [x] GitHub repository: `sanci9517/sanci9517`
- [x] Aktív branch: `v2/foundation`
- [x] Cloudflare Worker: `sanci9517-streamer-brand`
- [x] D1 létrehozva
- [x] GitHub → Cloudflare build/deploy kapcsolat
- [x] Moduláris fájlszerkezet alapja
- [x] Szerveroldali tartalomlánc kijelölve
- [ ] Végleges automata tesztek
- [ ] Végleges regressziós suite
- [ ] Végleges hibanapló
- [ ] Architektúra dokumentáció véglegesítése
- [ ] API contract dokumentáció
- [ ] Data model dokumentáció
- [ ] Migration szabályzat
- [ ] Release szabályzat
- [ ] Rollback szabályzat

## 1.1 Kötelező architekturális szabályok
- [x] Moduláris kód
- [x] Szerveroldali tárolás az alapoktól
- [ ] D1 az elsődleges tartalom-igazságforrás
- [ ] R2 az elsődleges médiafájl-tároló
- [ ] KV csak cache/gyors állapot célra
- [ ] API réteg elválasztása a renderertől
- [ ] Public renderer elválasztása az admin editortól
- [ ] Editor state elválasztása a szerver state-től
- [ ] Validáció minden mentési ponton
- [ ] Verziózott adatmodell
- [ ] Migration-kompatibilitás
- [ ] Backward compatibility stratégia

---

# 2. FEJLESZTÉSI ÉS TESZTELÉSI PROTOKOLL

- [x] Egy lépés egyszerre
- [x] Egy felhasználói teszt egyszerre
- [x] Sikertelen tesztnél nincs továbblépés
- [x] Minden érdemi változás commit
- [x] Érintett fájl visszaolvasása
- [x] Branch ellenőrzése
- [x] Véletlen törlés ellenőrzése
- [x] Deploy ellenőrzése érintett változás után
- [x] Szerveroldali tárolás ellenőrzése releváns funkciónál
- [x] Public oldal ellenőrzése releváns funkciónál
- [ ] Unit testek
- [ ] Integration testek
- [ ] E2E tesztek
- [ ] Smoke testek
- [ ] Accessibility tesztek
- [ ] Performance tesztek
- [ ] Security tesztek
- [ ] Mobil regresszió
- [ ] Desktop regresszió

## 2.1 Definition of Done
- [ ] Kód működik
- [ ] UI működik
- [ ] Mentés működik
- [ ] Újratöltés után megmarad
- [ ] D1/R2/KV megfelelően működik
- [ ] Public renderer helyesen jelenít meg
- [ ] Hibás input nem töri el az editort
- [ ] Undo/redo nem sérül
- [ ] Jogosultság megfelelő
- [ ] Mobil/desktop ellenőrzött
- [ ] Dokumentáció frissített
- [ ] Master terv kipipálva

---

# 3. VISUAL EDITOR — STABIL CORE

## 3.1 Editor indítás
- [x] Editor megnyitása
- [x] Oldal betöltése
- [x] Editor shell megjelenik
- [ ] Loading állapot
- [ ] Empty state
- [ ] API hiba állapot
- [ ] Mentési hiba állapot
- [ ] Offline állapot
- [ ] Retry

## 3.2 Elemkezelés
- [x] Elem kiválasztása
- [x] H1
- [x] Paragraph
- [x] Button
- [x] X/Y
- [x] Width/height
- [x] Több elem
- [x] Törlés
- [x] Duplikálás
- [x] Multi-select
- [x] Group
- [x] Ungroup
- [x] Drag & drop alap
- [x] Snap
- [x] Guides
- [x] Overlap
- [x] Layer order
- [x] Lock/unlock
- [x] Hide/show
- [x] Rename
- [x] Ismeretlen elem biztonságos megjelenítése
- [x] Elem keresése
- [x] Quick duplicate
- [ ] Copy
- [ ] Paste
- [ ] Style copy
- [ ] Style paste
- [ ] Bulk delete confirmation
- [x] Undo
- [x] Redo
- [ ] History panel
- [ ] History entry preview
- [ ] History restore

## 3.3 Valódi DOM/page hierarchy — KÖTELEZŐ ALAP
- [ ] Valódi parent/child adatmodell
- [ ] Root container
- [ ] Container létrehozása
- [ ] Section létrehozása
- [ ] Child hozzáadása parenthez
- [ ] Child kivétele parentből
- [ ] Child áthelyezése másik parentbe
- [ ] Parent cseréje
- [ ] Többszintű nesting
- [ ] Empty container
- [ ] Container minimum child szabályok
- [ ] Layer Tree hierarchia
- [ ] Parent kiválasztása
- [ ] Child kiválasztása
- [ ] Parent/child breadcrumb
- [ ] X-Ray hierarchy nézet
- [ ] Drop zone jelzés
- [ ] Invalid nesting tiltása
- [ ] Legacy elem migrációja hierarchy modellre
- [ ] Hierarchy mentése D1-be
- [ ] Hierarchy visszatöltése D1-ből
- [ ] Hierarchy megőrzése refresh után
- [ ] Hierarchy megőrzése preview után
- [ ] Hierarchy megőrzése publish után
- [ ] Hierarchy undo
- [ ] Hierarchy redo

---

# 4. VISUAL EDITOR — LAYOUT ENGINE

## 4.1 Sizing
- [x] Width
- [x] Height
- [x] Minimum width behavior
- [x] Minimum height behavior
- [ ] Maximum width
- [ ] Maximum height
- [ ] Auto width
- [ ] Auto height
- [ ] Fit-content
- [ ] Fill available
- [ ] Intrinsic sizing
- [ ] Aspect ratio
- [ ] Fixed sizing
- [ ] Fluid sizing
- [ ] Clamp sizing
- [ ] Min/max conflict handling

## 4.2 Spacing
- [x] Padding
- [x] Margin
- [x] Negative margin
- [x] Gap
- [x] Positive gap
- [x] Zero gap
- [x] Negative gap editor behavior
- [x] Gap persistence
- [ ] Separate top/right/bottom/left padding
- [ ] Separate top/right/bottom/left margin
- [ ] Horizontal/vertical shorthand
- [ ] Spacing presets
- [ ] Spacing tokens
- [ ] Responsive spacing
- [ ] Container spacing inheritance rules

## 4.3 Display
- [x] Display selector
- [x] Block value
- [x] Flex value persistence
- [x] Grid value persistence
- [x] Inline-block value
- [ ] Actual Flex visual behavior
- [ ] Actual Grid visual behavior
- [ ] Container-only display validation
- [ ] Display conflict warning
- [ ] Hidden state via visibility model
- [ ] Visibility vs display separation

## 4.4 Flexbox
- [ ] Flex container
- [ ] Flex row
- [ ] Flex column
- [ ] Row reverse
- [ ] Column reverse
- [ ] Wrap
- [ ] No-wrap
- [ ] Wrap reverse
- [ ] Justify start
- [ ] Justify center
- [ ] Justify end
- [ ] Space-between
- [ ] Space-around
- [ ] Space-evenly
- [ ] Align start
- [ ] Align center
- [ ] Align end
- [ ] Stretch
- [ ] Baseline
- [ ] Align-content
- [ ] Child order
- [ ] Child grow
- [ ] Child shrink
- [ ] Child basis
- [ ] Child self alignment
- [ ] Flex gap
- [ ] Responsive flex
- [ ] Flex preview
- [ ] Flex persistence

## 4.5 Grid
- [ ] Grid container
- [ ] Columns
- [ ] Rows
- [ ] Column gap
- [ ] Row gap
- [ ] Combined gap
- [ ] Fixed columns
- [ ] Fractional columns
- [ ] Auto columns
- [ ] Auto rows
- [ ] Minmax tracks
- [ ] Auto-fit
- [ ] Auto-fill
- [ ] Grid areas
- [ ] Grid column start/end
- [ ] Grid row start/end
- [ ] Child placement
- [ ] Grid alignment
- [ ] Grid justify
- [ ] Grid responsive behavior
- [ ] Grid visual editor
- [ ] Grid persistence

## 4.6 Positioning
- [ ] Static
- [ ] Relative
- [ ] Absolute
- [ ] Fixed
- [ ] Sticky
- [ ] Top
- [ ] Right
- [ ] Bottom
- [ ] Left
- [ ] Inset
- [ ] Z-index
- [ ] Stacking context
- [ ] Position conflict handling
- [ ] Sticky preview
- [ ] Fixed preview

## 4.7 Overflow
- [ ] Visible
- [ ] Hidden
- [ ] Auto
- [ ] Scroll
- [ ] X overflow
- [ ] Y overflow
- [ ] Clip
- [ ] Overflow editor preview

---

# 5. VISUAL EDITOR — ALIGNMENT, CANVAS ÉS UX

## 5.1 Alignment
- [ ] Align left
- [ ] Align center
- [ ] Align right
- [ ] Align top
- [ ] Align middle
- [ ] Align bottom
- [ ] Distribute horizontally
- [ ] Distribute vertically
- [ ] Match width
- [ ] Match height
- [ ] Match size
- [ ] Align to parent
- [ ] Align to canvas
- [ ] Smart guides
- [ ] Distance indicators
- [ ] Equal spacing indicators

## 5.2 Canvas
- [x] Center canvas
- [x] Zoom
- [x] Zoom in/out
- [x] 100%
- [x] Fit screen
- [x] Grid
- [x] Guides
- [ ] Grid size
- [ ] Snap strength
- [ ] Canvas background
- [ ] Safe area
- [ ] Ruler
- [ ] Canvas reset
- [ ] Multi-page canvas
- [ ] Device frame
- [ ] Canvas selection outline
- [ ] X-Ray mode
- [ ] Preview overlay
- [ ] Full-page mode
- [ ] Focus selected element

## 5.3 Editor panels
- [x] Inspector
- [x] Group inspector
- [x] Collapsible inspector groups
- [ ] Resizable inspector
- [ ] Resizable layer panel
- [ ] Panel collapse
- [ ] Panel reopen
- [ ] Panel width persistence
- [ ] Keyboard shortcuts
- [ ] Command palette
- [ ] Quick actions
- [ ] Search all properties

---

# 6. LAYER TREE ÉS HIERARCHIA

- [x] Layer tree alap
- [ ] Nested tree
- [ ] Expand/collapse
- [ ] Parent icon
- [ ] Child icon
- [ ] Type icon
- [ ] Visibility icon
- [ ] Lock icon
- [ ] Drag reorder
- [ ] Drag reparent
- [ ] Multi-select in tree
- [ ] Rename in tree
- [ ] Search tree
- [ ] Context menu
- [ ] Duplicate tree node
- [ ] Delete tree node
- [ ] Move up/down
- [ ] Move into parent
- [ ] Move out of parent
- [ ] Empty parent indication
- [ ] Invalid drop indication
- [ ] Selected node synchronization with canvas

---

# 7. INSPECTOR RENDSZER

## 7.1 Csoportok
- [x] Alap
- [x] Elrendezés
- [x] Megjelenés alap
- [ ] Typography
- [ ] Responsive
- [ ] Interaction
- [ ] Accessibility
- [ ] SEO/content
- [ ] Advanced
- [ ] Data

## 7.2 Inspector UX
- [x] Accordion/collapsible groups
- [x] Scroll stability
- [x] Group state stability during editing
- [x] Group state persistence after refresh
- [ ] Search property
- [ ] Reset property
- [ ] Reset section
- [ ] Reset element
- [ ] Property tooltip
- [ ] Validation message
- [ ] Unsaved indicator
- [ ] Modified-property indicator
- [ ] Responsive override indicator
- [ ] Token indicator
- [ ] Inherited value indicator

---

# 8. APPEARANCE / CSS ENGINE

- [x] Border preset
- [ ] Background color
- [ ] Background image
- [ ] Background position
- [ ] Background size
- [ ] Background repeat
- [ ] Background video
- [ ] Gradient linear
- [ ] Gradient radial
- [ ] Multiple backgrounds
- [ ] Text color
- [ ] Border width
- [ ] Border style
- [ ] Border color
- [ ] Border radius
- [ ] Individual corner radius
- [ ] Shadow
- [ ] Multiple shadows
- [ ] Opacity
- [ ] Blend mode
- [ ] Filter
- [ ] Blur
- [ ] Backdrop blur
- [ ] Transform
- [ ] Translate
- [ ] Rotate
- [ ] Scale
- [ ] Skew
- [ ] Transform origin
- [ ] Transition
- [ ] Transition property
- [ ] Transition duration
- [ ] Transition easing
- [ ] CSS variables
- [ ] Design tokens

---

# 9. TYPOGRAPHY ENGINE

- [ ] Font family
- [ ] Web font loader
- [ ] Local font support
- [ ] Font size
- [ ] Font weight
- [ ] Line height
- [ ] Letter spacing
- [ ] Word spacing
- [ ] Text alignment
- [ ] Text transform
- [ ] Text decoration
- [ ] Text shadow
- [ ] White space
- [ ] Word break
- [ ] Overflow wrap
- [ ] Text truncation
- [ ] Responsive typography
- [ ] Typography scale
- [ ] Global heading styles
- [ ] Global body styles
- [ ] Link typography
- [ ] Button typography
- [ ] Accessibility contrast check

---

# 10. INTERACTION ÉS ÁLLAPOTOK

- [ ] Hover
- [ ] Focus
- [ ] Focus-visible
- [ ] Active
- [ ] Visited
- [ ] Disabled
- [ ] Loading
- [ ] Error
- [ ] Success
- [ ] Selected
- [ ] Open
- [ ] Closed
- [ ] Keyboard interaction
- [ ] Click action
- [ ] Double click action
- [ ] Scroll action
- [ ] External URL action
- [ ] Internal navigation action
- [ ] Modal open/close
- [ ] Dropdown open/close
- [ ] Accordion open/close
- [ ] Tabs
- [ ] Tooltip
- [ ] Custom event action

---

# 11. ANIMÁCIÓ

- [ ] Entrance animation
- [ ] Exit animation
- [ ] Hover animation
- [ ] Scroll animation
- [ ] Parallax
- [ ] Fade
- [ ] Slide
- [ ] Scale
- [ ] Rotate
- [ ] Custom keyframes
- [ ] Duration
- [ ] Delay
- [ ] Easing
- [ ] Repeat
- [ ] Direction
- [ ] Reduced motion support
- [ ] Animation preview
- [ ] Animation disable switch
- [ ] Performance guard

---

# 12. RESPONSIVE RENDSZER

- [x] Desktop alap
- [x] Mobile alap
- [ ] Tablet breakpoint
- [ ] Mobile landscape
- [ ] Mobile portrait
- [ ] Custom breakpoint
- [ ] Breakpoint add
- [ ] Breakpoint delete
- [ ] Breakpoint rename
- [ ] Breakpoint preview
- [ ] Breakpoint-specific styles
- [ ] Cascading styles
- [ ] Responsive override
- [ ] Override reset
- [ ] Responsive visibility
- [ ] Responsive position
- [ ] Responsive size
- [ ] Responsive spacing
- [ ] Responsive typography
- [ ] Responsive flex
- [ ] Responsive grid
- [ ] Responsive image
- [ ] Responsive menu
- [ ] Responsive header
- [ ] Responsive footer
- [ ] Cross-breakpoint persistence
- [ ] Device presets
- [ ] Custom viewport width
- [ ] Orientation testing

---

# 13. PAGE MANAGEMENT

- [ ] Oldal lista
- [ ] Oldal létrehozás
- [ ] Oldal megnyitás
- [ ] Oldal átnevezés
- [ ] Oldal duplikálás
- [ ] Oldal törlés
- [ ] Törlés megerősítés
- [ ] Slug kezelés
- [ ] Slug ütközés kezelése
- [ ] Draft oldal
- [ ] Published oldal
- [ ] Scheduled publish
- [ ] Unpublish
- [ ] Archive
- [ ] Restore archive
- [ ] Page template
- [ ] Page metadata
- [ ] Page permissions
- [ ] Page status
- [ ] Page version
- [ ] Page preview URL
- [ ] Page SEO
- [ ] Page redirects
- [ ] Page canonical
- [ ] 404 page
- [ ] 500 page
- [ ] Maintenance page

---

# 14. DRAFT / PUBLISH / VERZIÓZÁS

- [ ] Draft state
- [ ] Saved state
- [ ] Published state
- [ ] Publish confirmation
- [ ] Preview draft
- [ ] Preview token
- [ ] Scheduled publish
- [ ] Unpublish
- [ ] Version number
- [ ] Version author
- [ ] Version timestamp
- [ ] Version diff
- [ ] Version restore
- [ ] Rollback
- [ ] Rollback confirmation
- [ ] Version retention
- [ ] Version cleanup
- [ ] Autosave draft
- [ ] Autosave recovery
- [ ] Crash recovery
- [ ] Unsaved changes indicator
- [ ] Leave-page warning

---

# 15. UNDO / REDO / HISTORY

- [x] Undo
- [x] Redo
- [ ] History stack
- [ ] Named history entries
- [ ] History timestamps
- [ ] History grouping
- [ ] Undo hierarchy changes
- [ ] Undo style changes
- [ ] Undo page changes
- [ ] Undo reparenting
- [ ] Undo responsive changes
- [ ] Redo all corresponding actions
- [ ] History persistence for draft
- [ ] History cleanup

---

# 16. AUTOSAVE / PERSISTENCE

- [ ] Debounced autosave
- [ ] Manual save
- [ ] Save status
- [ ] Save timestamp
- [ ] Save retry
- [ ] Save conflict detection
- [ ] Concurrent edit detection
- [ ] Browser crash recovery
- [ ] Draft recovery
- [ ] D1 persistence
- [ ] Refresh persistence
- [ ] Re-login persistence
- [ ] Cross-device persistence
- [ ] Public render persistence
- [ ] Publish persistence
- [ ] Failed save rollback

---

# 17. BACKUP / RESTORE

- [ ] Full site backup
- [ ] Page backup
- [ ] Media metadata backup
- [ ] Settings backup
- [ ] Schedule backup
- [ ] Social configuration backup
- [ ] Export JSON
- [ ] Export ZIP
- [ ] Backup version ID
- [ ] Backup timestamp
- [ ] Backup checksum
- [ ] Manual backup
- [ ] Automatic backup
- [ ] Backup retention
- [ ] Restore full site
- [ ] Restore page
- [ ] Restore version
- [ ] Restore dry-run
- [ ] Restore validation
- [ ] Restore rollback

---

# 18. D1 ADATMODELL

- [x] users alap
- [x] sessions alap
- [x] site_settings alap
- [x] pages alap
- [x] schedule_items alap
- [x] social_accounts alap
- [x] media alap
- [x] audit_log alap
- [x] admin_audit_log alap
- [x] system_page_content alap
- [ ] page_versions
- [ ] page_revisions
- [ ] components
- [ ] component_instances
- [ ] templates
- [ ] assets
- [ ] asset_variants
- [ ] redirects
- [ ] seo_metadata
- [ ] analytics_events
- [ ] integrations
- [ ] notifications
- [ ] backups
- [ ] feature_flags
- [ ] ai_actions
- [ ] ai_audit
- [ ] stream_sessions
- [ ] stream_events
- [ ] clips
- [ ] sponsors
- [ ] campaigns
- [ ] merch
- [ ] donations

---

# 19. API RÉTEG

## 19.1 Admin pages
- [x] GET `/api/admin/pages`
- [x] POST `/api/admin/pages`
- [x] PUT `/api/admin/pages`
- [x] DELETE `/api/admin/pages`
- [ ] Page version API
- [ ] Draft API
- [ ] Publish API
- [ ] Rollback API
- [ ] Preview API

## 19.2 Public pages
- [x] GET `/api/public/pages`
- [ ] Public page by slug
- [ ] Public published-only enforcement
- [ ] Cache headers
- [ ] ETag
- [ ] 404 handling

## 19.3 Schedule
- [x] Admin schedule API alap
- [x] Public schedule API alap
- [ ] Past item filtering
- [ ] Next stream endpoint
- [ ] Countdown data endpoint
- [ ] Timezone handling
- [ ] Recurring schedule
- [ ] Exceptions
- [ ] Cancellations
- [ ] Stream status integration

## 19.4 Media
- [ ] Upload initiate
- [ ] Upload complete
- [ ] Asset metadata
- [ ] Asset delete
- [ ] Asset archive
- [ ] Asset variants
- [ ] Thumbnail API

## 19.5 Integrations
- [ ] Twitch API layer
- [ ] YouTube API layer
- [ ] TikTok integration layer
- [ ] Discord integration layer
- [ ] Webhook layer
- [ ] OAuth callback layer
- [ ] Token refresh
- [ ] Integration health

---

# 20. AUTH / RBAC / ADMIN SECURITY

- [x] Login alap
- [x] Session alap
- [x] HttpOnly cookie
- [x] Secure cookie
- [x] Session expiry
- [x] Logout
- [x] viewer role
- [x] editor role
- [x] admin role
- [x] Bootstrap
- [ ] Password reset
- [ ] Password change
- [ ] Session revocation
- [ ] Device/session list
- [ ] Login rate limit
- [ ] Brute-force protection
- [ ] CSRF strategy
- [ ] Origin validation
- [ ] Input validation
- [ ] Output escaping
- [ ] XSS protection
- [ ] SQL injection protection
- [ ] SSRF protection
- [ ] File upload security
- [ ] MIME validation
- [ ] Path traversal protection
- [ ] Secret rotation
- [ ] API key rotation
- [ ] Security headers
- [ ] CSP
- [ ] Permissions audit
- [ ] Security event audit

---

# 21. ADMIN DASHBOARD

- [ ] Overview
- [ ] System health
- [ ] Cloudflare health
- [ ] D1 health
- [ ] R2 health
- [ ] API health
- [ ] Current live status
- [ ] Next stream
- [ ] Recent content
- [ ] Recent visitors
- [ ] Recent errors
- [ ] Recent audit events
- [ ] Draft count
- [ ] Scheduled publish count
- [ ] Media usage
- [ ] Storage usage
- [ ] Integration health
- [ ] AI status

---

# 22. ADÁSREND RENDSZER

- [x] Schedule backend alap
- [x] Schedule public endpoint alap
- [ ] Múltbeli adások szűrése
- [ ] Következő adás
- [ ] Countdown
- [ ] Live state
- [ ] Date picker
- [ ] Time picker
- [ ] Game selector
- [ ] Platform selector
- [ ] Status
- [ ] URL
- [ ] Note
- [ ] Recurring streams
- [ ] Weekly template
- [ ] Cancel stream
- [ ] Reschedule
- [ ] Special event
- [ ] Holiday mode
- [ ] Timezone
- [ ] Localization
- [ ] Schedule block editor
- [ ] Public schedule cards
- [ ] Calendar view
- [ ] List view
- [ ] Mobile schedule
- [ ] SEO schedule data

---

# 23. TWITCH INTEGRÁCIÓ

- [ ] OAuth
- [ ] Channel info
- [ ] Live/offline
- [ ] Current game
- [ ] Stream title
- [ ] Viewer count
- [ ] Followers
- [ ] Subscriber count where permitted
- [ ] Recent VOD
- [ ] Clips
- [ ] Stream start timestamp
- [ ] Stream end timestamp
- [ ] Category
- [ ] Live indicator
- [ ] Public live card
- [ ] Twitch embed
- [ ] Chat link
- [ ] Follow CTA
- [ ] Subscribe CTA
- [ ] API failure fallback
- [ ] Rate limit handling
- [ ] Cache strategy

---

# 24. YOUTUBE INTEGRÁCIÓ

- [ ] Channel link
- [ ] OAuth/API
- [ ] Latest video
- [ ] Video list
- [ ] Shorts list
- [ ] Playlist
- [ ] Thumbnail
- [ ] Publish date
- [ ] View count where available
- [ ] Embed
- [ ] Public video grid
- [ ] Cache
- [ ] API failure fallback

---

# 25. TIKTOK INTEGRÁCIÓ

- [ ] Profile link
- [ ] TikTok CTA
- [ ] `sanci9517twitch` support
- [ ] Latest content representation where API permits
- [ ] TikTok embed where supported
- [ ] TikTok section
- [ ] Follow CTA
- [ ] Subscription CTA where applicable
- [ ] Cache
- [ ] Fallback

---

# 26. DISCORD / COMMUNITY

- [ ] Discord invite
- [ ] Discord CTA
- [ ] Server widget where appropriate
- [ ] Community page
- [ ] Rules
- [ ] Links
- [ ] Events
- [ ] Community announcements
- [ ] Moderation link
- [ ] Social links
- [ ] Community stats where available
- [ ] Mobile community layout

---

# 27. VOD / CLIP / SHORTS RENDSZER

- [ ] VOD model
- [ ] VOD list
- [ ] VOD detail
- [ ] Thumbnail
- [ ] Duration
- [ ] Date
- [ ] Game
- [ ] Platform
- [ ] Clip model
- [ ] Clip list
- [ ] Clip detail
- [ ] Shorts model
- [ ] Shorts list
- [ ] Tags
- [ ] Categories
- [ ] Search
- [ ] Filter
- [ ] Sort
- [ ] Featured clip
- [ ] Automatic metadata
- [ ] Future AI clip generation hook

---

# 28. STREAMER-SPECIFIC PUBLIC OLDALAK

- [ ] Főoldal végleges struktúra
- [ ] Twitch oldal
- [ ] TikTok oldal
- [ ] YouTube oldal
- [ ] Adásrend oldal
- [ ] VOD oldal
- [ ] Közösség oldal
- [ ] Rólam oldal
- [ ] Támogatás oldal
- [ ] Kapcsolat oldal
- [ ] Média/press oldal
- [ ] Szponzor oldal
- [ ] Merch oldal előkészítés
- [ ] Dinamikus custom pages
- [ ] 404
- [ ] 500
- [ ] Maintenance

## 28.1 Navigáció
- [ ] Közös header
- [ ] Mobil menü
- [ ] Desktop menü ugyanazzal a logikával
- [ ] Sanci név/logo
- [ ] Menü gomb
- [ ] Twitch live indicator jobb oldalon
- [ ] Social ikonok
- [ ] Active page
- [ ] Dropdown
- [ ] Keyboard navigation
- [ ] Escape close
- [ ] Click outside close
- [ ] Mobile close
- [ ] Sticky header
- [ ] Scroll behavior

---

# 29. STREAMER DESIGN SYSTEM

- [ ] Egységes színpaletta
- [ ] Sanci barna/kék irány
- [ ] Typography system
- [ ] Icon system
- [ ] Button system
- [ ] Card system
- [ ] Badge system
- [ ] Spacing system
- [ ] Radius system
- [ ] Shadow system
- [ ] Background system
- [ ] Section system
- [ ] Hero system
- [ ] CTA system
- [ ] Live system
- [ ] Schedule system
- [ ] VOD system
- [ ] Social system
- [ ] Footer system
- [ ] Mobile system
- [ ] Dark theme
- [ ] Accessibility contrast

---

# 30. SEO

- [ ] Page title
- [ ] Meta description
- [ ] Canonical
- [ ] Open Graph
- [ ] Twitter/X card
- [ ] Sitemap
- [ ] Robots
- [ ] Structured data
- [ ] Person schema
- [ ] Organization/creator schema
- [ ] Video schema
- [ ] Event schema
- [ ] Breadcrumb schema
- [ ] Schedule SEO
- [ ] VOD SEO
- [ ] Social preview image
- [ ] Favicon
- [ ] Web manifest
- [ ] Custom slug
- [ ] Redirects
- [ ] 404 SEO
- [ ] Index control

---

# 31. ACCESSIBILITY

- [ ] Semantic HTML
- [ ] Keyboard navigation
- [ ] Focus visibility
- [ ] Focus order
- [ ] ARIA where required
- [ ] Alt text
- [ ] Form labels
- [ ] Error announcements
- [ ] Reduced motion
- [ ] Contrast
- [ ] Touch target size
- [ ] Screen reader test
- [ ] Keyboard-only test
- [ ] Mobile accessibility
- [ ] Accessible menu
- [ ] Accessible modal
- [ ] Accessible accordion
- [ ] Accessible tabs
- [ ] Accessible buttons

---

# 32. ANALYTICS

- [ ] Page views
- [ ] Unique visitors
- [ ] Referrer
- [ ] Device
- [ ] Browser
- [ ] Country/region where lawful
- [ ] CTA clicks
- [ ] Twitch clicks
- [ ] TikTok clicks
- [ ] YouTube clicks
- [ ] Discord clicks
- [ ] Support clicks
- [ ] Schedule interaction
- [ ] VOD views
- [ ] Clip clicks
- [ ] Conversion events
- [ ] Privacy controls
- [ ] Data retention
- [ ] Admin dashboard
- [ ] Export

---

# 33. MEDIA LIBRARY / R2

- [ ] R2 bucket
- [ ] Upload API
- [ ] Secure upload
- [ ] Filename normalization
- [ ] MIME validation
- [ ] File size validation
- [ ] Image metadata
- [ ] Thumbnail generation
- [ ] WebP
- [ ] AVIF
- [ ] Original preservation
- [ ] Variants
- [ ] Delete
- [ ] Archive
- [ ] Restore
- [ ] Search
- [ ] Filters
- [ ] Pagination
- [ ] Usage tracking
- [ ] Orphan cleanup
- [ ] Storage metrics

---

# 34. CACHE / PERFORMANCE

- [ ] KV strategy
- [ ] API caching
- [ ] Public page caching
- [ ] Schedule caching
- [ ] Twitch caching
- [ ] YouTube caching
- [ ] Cache invalidation
- [ ] ETag
- [ ] Compression
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Asset fingerprinting
- [ ] Minification
- [ ] Critical CSS strategy
- [ ] Lighthouse baseline
- [ ] Core Web Vitals
- [ ] Slow API fallback
- [ ] Offline-safe admin state

---

# 35. IMPORT / EXPORT

- [ ] Page JSON export
- [ ] Page JSON import
- [ ] Full site export
- [ ] Full site import
- [ ] Template export
- [ ] Template import
- [ ] Component export
- [ ] Component import
- [ ] Media metadata export
- [ ] Version export
- [ ] Backup export
- [ ] Schema version
- [ ] Import validation
- [ ] Import preview
- [ ] Import rollback
- [ ] Duplicate handling

---

# 36. FORMS / INTERAKCIÓK

- [ ] Contact form
- [ ] Validation
- [ ] Spam protection
- [ ] Rate limiting
- [ ] Success state
- [ ] Error state
- [ ] Email integration hook
- [ ] Form submissions
- [ ] Admin view
- [ ] Export
- [ ] Delete/retention
- [ ] Newsletter hook
- [ ] Support form
- [ ] Sponsor inquiry form

---

# 37. SPONSZOR / ÜZLETI HUB

- [ ] Sponsor profile
- [ ] Sponsor logo
- [ ] Sponsor link
- [ ] Campaign
- [ ] Campaign dates
- [ ] Sponsored block
- [ ] Disclosure
- [ ] Media kit
- [ ] Statistics summary
- [ ] Contact route
- [ ] Sponsor CTA
- [ ] Admin management
- [ ] Analytics

---

# 38. MERCH / TÁMOGATÁS

- [ ] Support page
- [ ] Donation CTA
- [ ] External support link
- [ ] Subscription CTA
- [ ] Merch page placeholder
- [ ] Merch provider integration hook
- [ ] Product card model
- [ ] External checkout support
- [ ] Campaign tracking
- [ ] Legal disclosure

---

# 39. NOTIFICATIONS / SYSTEM

- [ ] Admin notifications
- [ ] Save success
- [ ] Save failure
- [ ] Publish success
- [ ] Publish failure
- [ ] Integration failure
- [ ] API failure
- [ ] D1 failure
- [ ] R2 failure
- [ ] Security alert
- [ ] Notification history
- [ ] Dismiss
- [ ] Severity

---

# 40. AUDIT LOG

- [x] Audit log alap
- [x] Admin audit log alap
- [ ] Login audit
- [ ] Logout audit
- [ ] Page create audit
- [ ] Page edit audit
- [ ] Page delete audit
- [ ] Publish audit
- [ ] Rollback audit
- [ ] Media audit
- [ ] Settings audit
- [ ] Integration audit
- [ ] AI audit
- [ ] Security audit
- [ ] IP handling policy
- [ ] Actor ID
- [ ] Timestamp
- [ ] Before/after metadata
- [ ] Search
- [ ] Filter
- [ ] Export

---

# 41. AI SERVICE LAYER

- [ ] AI provider abstraction
- [ ] Model registry
- [ ] Prompt registry
- [ ] Tool registry
- [ ] Permission layer
- [ ] Structured action schema
- [ ] Preview mode
- [ ] Confirmation mode
- [ ] Apply mode
- [ ] Undo AI action
- [ ] Audit AI action
- [ ] Token/cost tracking
- [ ] Rate limits
- [ ] Error handling
- [ ] Model fallback
- [ ] Context selection
- [ ] Page context
- [ ] Brand context
- [ ] Schedule context
- [ ] Analytics context

---

# 42. AI WEBOLDAL-SZERKESZTŐ

- [ ] "Módosítsd ezt az oldalt" alap
- [ ] Szöveg módosítás
- [ ] Elem hozzáadás
- [ ] Elem törlés
- [ ] Elem mozgatás
- [ ] Stílus módosítás
- [ ] Layout módosítás
- [ ] Responsive módosítás
- [ ] Page creation
- [ ] Page duplication
- [ ] SEO javaslat
- [ ] Accessibility javaslat
- [ ] Design consistency check
- [ ] Preview diff
- [ ] Human approval
- [ ] Apply
- [ ] Rollback

---

# 43. FUTURE STREAM ASSISTANT — ARCHITEKTÚRA

- [ ] Stream session model
- [ ] Stream event model
- [ ] Audio analysis input
- [ ] Video/frame analysis input
- [ ] Chat input
- [ ] OBS integration hook
- [ ] Scene state
- [ ] Mic state
- [ ] Technical telemetry
- [ ] Event timestamp
- [ ] Event severity
- [ ] Suggestion model
- [ ] Suggestion cooldown
- [ ] User preferences
- [ ] Privacy controls
- [ ] Local processing option
- [ ] Cloud processing option

## 43.1 Stream Assistant funkciók
- [ ] Csend felismerése
- [ ] Túl halk beszéd felismerése
- [ ] Mikrofon probléma jelzése
- [ ] Játékhang probléma jelzése
- [ ] OBS technikai probléma jelzése
- [ ] Chat aktivitás elemzése
- [ ] Chat téma felismerése
- [ ] Beszédtéma javaslat
- [ ] Stream ötlet javaslat
- [ ] Hosszú csend után prompt
- [ ] Ismétlődő téma jelzése
- [ ] Jó pillanat felismerése
- [ ] Manuális clip marker
- [ ] Automatikus clip marker
- [ ] Short jelölt pillanat
- [ ] Highlight lista
- [ ] Stream összefoglaló
- [ ] Stream utáni elemzés
- [ ] Teljesítményjavaslat
- [ ] Tartalomjavaslat

## 43.2 Stream Assistant → OBS
- [ ] OBS WebSocket kapcsolat
- [ ] Scene lista
- [ ] Scene váltás
- [ ] Mic mute/unmute
- [ ] Source visibility
- [ ] Recording state
- [ ] Streaming state
- [ ] Safe action confirmation
- [ ] Action log
- [ ] Emergency stop

## 43.3 Short/clip pipeline
- [ ] Marker
- [ ] Pre-roll
- [ ] Post-roll
- [ ] Video extraction
- [ ] Vertical crop
- [ ] Facecam handling
- [ ] Captions
- [ ] Highlight title
- [ ] Description
- [ ] Hashtags
- [ ] Export
- [ ] Local save
- [ ] R2 save
- [ ] Manual approval
- [ ] Future auto-publish hook

---

# 44. STREAM ANALYTICS

- [ ] Stream duration
- [ ] Average viewers
- [ ] Peak viewers
- [ ] Chat rate
- [ ] Follower gain
- [ ] Subscriber gain where available
- [ ] Game/category
- [ ] Stream title
- [ ] Start/end time
- [ ] Silent periods
- [ ] Engagement periods
- [ ] Highlight periods
- [ ] Clip conversion
- [ ] TikTok performance import hook
- [ ] YouTube performance import hook
- [ ] Cross-platform comparison
- [ ] Weekly report
- [ ] Monthly report
- [ ] Trend detection
- [ ] Recommendations

---

# 45. PUBLIC PAGE BUILDER BLOCKS

- [ ] Hero
- [ ] CTA hero
- [ ] About block
- [ ] Social links
- [ ] Live block
- [ ] Schedule block
- [ ] Countdown block
- [ ] VOD block
- [ ] Clip block
- [ ] YouTube block
- [ ] TikTok block
- [ ] Discord block
- [ ] Support block
- [ ] Sponsor block
- [ ] Media kit block
- [ ] Stats block
- [ ] Timeline
- [ ] FAQ
- [ ] Accordion
- [ ] Tabs
- [ ] Carousel
- [ ] Gallery
- [ ] Video section
- [ ] Testimonial/community quote block
- [ ] Custom HTML-safe block

---

# 46. TEMPLATE LIBRARY

- [ ] Streamer landing template
- [ ] Twitch template
- [ ] Schedule template
- [ ] VOD template
- [ ] About template
- [ ] Community template
- [ ] Support template
- [ ] Sponsor template
- [ ] Media kit template
- [ ] Event template
- [ ] Blog/news template
- [ ] Blank template
- [ ] Template preview
- [ ] Template categories
- [ ] Template search
- [ ] Template favorite
- [ ] Template duplicate
- [ ] Template versioning

---

# 47. KÖZÖSSÉGI / TARTALMI RENDSZER

- [ ] News/announcement model
- [ ] Announcement block
- [ ] Featured content
- [ ] Tags
- [ ] Categories
- [ ] Search
- [ ] Related content
- [ ] Archive
- [ ] Pagination
- [ ] RSS/Feed hook
- [ ] Social sharing
- [ ] Open Graph preview
- [ ] Content scheduling
- [ ] Draft content
- [ ] Publish content

---

# 48. LOCALIZATION / NYELVI ELŐKÉSZÍTÉS

- [x] Magyar publikus szöveg irány
- [ ] Translation keys
- [ ] Hungarian locale
- [ ] English locale architecture
- [ ] Ukrainian locale architecture if needed
- [ ] Locale selector
- [ ] SEO per locale
- [ ] Slug per locale
- [ ] Date/time localization
- [ ] Number localization
- [ ] Fallback locale

---

# 49. PRIVACY / JOGI

- [ ] Privacy policy page
- [ ] Cookie policy if required
- [ ] Consent strategy
- [ ] Analytics consent where required
- [ ] Data retention
- [ ] User data deletion
- [ ] Data export
- [ ] Contact data handling
- [ ] Third-party integration disclosures
- [ ] Sponsor disclosure
- [ ] Affiliate disclosure if used
- [ ] Terms page if required

---

# 50. MONITORING / OBSERVABILITY

- [ ] Error logging
- [ ] API error logging
- [ ] Worker error logging
- [ ] D1 error logging
- [ ] R2 error logging
- [ ] Integration error logging
- [ ] Performance metrics
- [ ] Request metrics
- [ ] Admin error viewer
- [ ] Alert threshold
- [ ] Health endpoint
- [ ] Dependency health
- [ ] Deployment health
- [ ] Rollback trigger

---

# 51. TESTING — UNIT

- [ ] Data model tests
- [ ] Node creation tests
- [ ] Node update tests
- [ ] Node deletion tests
- [ ] Nesting tests
- [ ] Reparent tests
- [ ] Layout tests
- [ ] Flex tests
- [ ] Grid tests
- [ ] Spacing tests
- [ ] Responsive tests
- [ ] Serialization tests
- [ ] Deserialization tests
- [ ] Validation tests
- [ ] Permission tests
- [ ] API tests
- [ ] Auth tests
- [ ] Backup tests
- [ ] Restore tests

# 52. TESTING — INTEGRATION

- [ ] Editor → API
- [ ] API → D1
- [ ] D1 → renderer
- [ ] Editor → D1 persistence
- [ ] Media → R2
- [ ] Schedule → public page
- [ ] Twitch → live block
- [ ] YouTube → content block
- [ ] TikTok → social block
- [ ] Discord → community block
- [ ] Auth → admin
- [ ] RBAC → permissions
- [ ] Publish → public
- [ ] Rollback → public
- [ ] Backup → restore

# 53. TESTING — E2E / SMOKE

- [ ] Login
- [ ] Logout
- [ ] Open editor
- [ ] Create page
- [ ] Add container
- [ ] Add child
- [ ] Nest child
- [ ] Reparent child
- [ ] Edit child
- [ ] Flex layout
- [ ] Grid layout
- [ ] Responsive edit
- [ ] Save
- [ ] Refresh
- [ ] Reopen
- [ ] Preview
- [ ] Publish
- [ ] Public page
- [ ] Rollback
- [ ] Backup
- [ ] Restore

# 54. REGRESSZIÓS MASTER TESZT

- [ ] Login regression
- [ ] Admin navigation regression
- [ ] Page CRUD regression
- [ ] Editor open regression
- [ ] Selection regression
- [ ] Text regression
- [ ] Button regression
- [ ] Layer regression
- [ ] Group regression
- [ ] Lock regression
- [ ] Hide regression
- [ ] Duplicate regression
- [ ] Undo regression
- [ ] Redo regression
- [ ] Width/height regression
- [ ] Min-size regression
- [ ] Padding regression
- [ ] Margin regression
- [ ] Gap regression
- [ ] Display regression
- [ ] Container regression
- [ ] Flex regression
- [ ] Grid regression
- [ ] Preview regression
- [ ] Save regression
- [ ] Refresh regression
- [ ] D1 regression
- [ ] Public renderer regression
- [ ] Mobile regression
- [ ] Desktop regression

---

# 55. BIZTONSÁGI REGRESSZIÓ

- [ ] Unauthorized admin access denied
- [ ] Viewer cannot edit
- [ ] Editor cannot perform admin-only actions
- [ ] Expired session denied
- [ ] Invalid CSRF denied where applicable
- [ ] Invalid payload rejected
- [ ] Malicious HTML sanitized
- [ ] Script injection rejected
- [ ] Unsafe URL rejected
- [ ] Unsafe file rejected
- [ ] Oversized file rejected
- [ ] Path traversal rejected
- [ ] Rate limit works
- [ ] Audit event created
- [ ] Secrets never rendered publicly

---

# 56. PERFORMANCE REGRESSZIÓ

- [ ] Editor initial load
- [ ] Large page load
- [ ] 100+ elements
- [ ] 500+ elements
- [ ] Deep nesting
- [ ] Large layer tree
- [ ] Large media library
- [ ] Large page JSON
- [ ] Undo/redo performance
- [ ] Autosave performance
- [ ] Public page performance
- [ ] Mobile performance
- [ ] Image-heavy page
- [ ] Video-heavy page
- [ ] API latency
- [ ] D1 query performance

---

# 57. VÉGLEGES PUBLIC OLDAL TESZT

- [ ] Főoldal
- [ ] Twitch
- [ ] TikTok
- [ ] YouTube
- [ ] Adásrend
- [ ] VOD
- [ ] Közösség
- [ ] Rólam
- [ ] Támogatás
- [ ] Kapcsolat
- [ ] Media kit
- [ ] Sponsor
- [ ] Custom page
- [ ] 404
- [ ] 500
- [ ] Mobile
- [ ] Tablet
- [ ] Desktop
- [ ] Navigation
- [ ] Live indicator
- [ ] Countdown
- [ ] Social links
- [ ] SEO
- [ ] Accessibility
- [ ] Performance

---

# 58. CLOUDflare / DEPLOYMENT FINAL

- [x] GitHub connection
- [x] Build command alap
- [x] Deploy command alap
- [x] Branch build kapcsolat
- [ ] Production deployment verification
- [ ] Preview deployment verification
- [ ] Environment variables audit
- [ ] D1 binding audit
- [ ] R2 binding audit
- [ ] KV binding audit
- [ ] Secrets audit
- [ ] Build cache audit
- [ ] Build failure recovery
- [ ] Rollback deployment
- [ ] Deployment smoke test

---

# 59. RELEASE MANAGEMENT

- [ ] Development branch
- [ ] Staging strategy
- [ ] Production branch strategy
- [ ] Release tag
- [ ] Changelog
- [ ] Migration checklist
- [ ] Backup before release
- [ ] Smoke test after release
- [ ] Rollback procedure
- [ ] Incident procedure
- [ ] Hotfix procedure
- [ ] Post-release regression

---

# 60. VÉGLEGES KARBANTARTÁS

- [ ] Dependency audit
- [ ] Wrangler audit
- [ ] TypeScript audit
- [ ] Browser compatibility audit
- [ ] Security dependency audit
- [ ] D1 migration audit
- [ ] R2 lifecycle audit
- [ ] KV lifecycle audit
- [ ] Dead code audit
- [ ] Dead assets audit
- [ ] Broken link audit
- [ ] Broken image audit
- [ ] SEO audit
- [ ] Accessibility audit
- [ ] Performance audit
- [ ] Backup restore drill
- [ ] Disaster recovery drill
- [ ] Full regression

---

# 61. FEJLESZTÉSI KAPUK — NEM UGROK ÁT FUNKCIÓKAT

## Gate A — Core
- [ ] Editor megnyílik
- [ ] Oldal betöltődik
- [ ] Elem létrehozható
- [ ] Elem kijelölhető
- [ ] Elem szerkeszthető
- [ ] Elem törölhető
- [ ] Elem duplikálható
- [ ] Mentés működik
- [ ] Újratöltés működik
- [ ] D1 persistence működik

## Gate B — Hierarchy
- [ ] Container létrehozható
- [ ] Child létrehozható
- [ ] Child parentbe tehető
- [ ] Child kivehető
- [ ] Reparent működik
- [ ] Layer tree mutatja
- [ ] Mentés után megmarad

## Gate C — Layout
- [ ] Flex ténylegesen működik
- [ ] Grid ténylegesen működik
- [ ] Gap ténylegesen működik konténerben
- [ ] Padding működik konténerben
- [ ] Alignment működik
- [ ] Responsive layout működik

## Gate D — Appearance
- [ ] Typography
- [ ] Colors
- [ ] Background
- [ ] Border
- [ ] Radius
- [ ] Shadow
- [ ] States
- [ ] Animation

## Gate E — Publish
- [ ] Draft
- [ ] Preview
- [ ] Publish
- [ ] Public renderer
- [ ] Version
- [ ] Rollback

## Gate F — Platform
- [ ] Media
- [ ] Schedule
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] Analytics
- [ ] SEO

## Gate G — AI
- [ ] AI page editor
- [ ] AI audit
- [ ] AI rollback
- [ ] Stream Assistant architecture
- [ ] Stream analysis
- [ ] Clip pipeline

---

# 62. VÉGLEGES PROJEKT-ELFOGADÁSI TESZT

- [ ] Teljes admin működik
- [ ] Teljes editor működik
- [ ] Valódi parent/child hierarchy működik
- [ ] Flex működik
- [ ] Grid működik
- [ ] Responsive működik
- [ ] Public renderer működik
- [ ] D1 persistence működik
- [ ] R2 media működik
- [ ] Auth/RBAC működik
- [ ] Draft/Publish működik
- [ ] Version/Rollback működik
- [ ] Backup/Restore működik
- [ ] Twitch működik
- [ ] TikTok működik
- [ ] YouTube működik
- [ ] Discord működik
- [ ] Schedule működik
- [ ] VOD működik
- [ ] Analytics működik
- [ ] SEO működik
- [ ] Accessibility ellenőrzött
- [ ] Security ellenőrzött
- [ ] Performance ellenőrzött
- [ ] Mobile ellenőrzött
- [ ] Desktop ellenőrzött
- [ ] Full regression passed

---

# 63. AKTUÁLIS FEJLESZTÉSI ÁLLAPOT

**Jelenlegi fókusz:** Visual Editor layout engine és valódi parent/child konténermodell.

**Következő egyetlen fejlesztési feladat:**

> A valódi Container / parent-child struktúra megvalósítása és tesztelhetővé tétele.

**Nem lépünk tovább Flex/Grid tényleges működésére addig, amíg a parent/child modell nincs meg és nincs user által ellenőrizve.**

**Utolsó tervfrissítés:** 2026-09-14

---

# 64. VÉGLEGES FEJLESZTÉSI ELV

A projektben semmit nem tekintünk késznek pusztán azért, mert a kód tartalmazza.

A státusz mindig:

`TERV → KÓD → GITHUB → DEPLOY → API/D1 → BÖNGÉSZŐ → FELHASZNÁLÓI TESZT → [x]`

A master tervet csak azért módosítjuk később, ha **új, előre nem tervezhető követelmény** jelenik meg. A már felsorolt funkciókat nem hagyjuk ki és nem ugrálunk közöttük találomra.
