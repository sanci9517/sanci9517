# Sanci9517 — VÉGLEGES MASTER FEJLESZTÉSI ÚTVONAL

**Verzió:** FINAL-1.0  
**Dátum:** 2026-09-17  
**Repository:** `sanci9517/sanci9517`  
**Branch:** `v2/foundation`

Ez a dokumentum a fejlesztés végrehajtási sorrendjét rögzíti. A korábbi MASTER terv részletes követelményei továbbra is érvényesek; ez a dokumentum az aktuális sorrendet és a készültségi kapukat teszi egyértelművé.

## 0. Fejlesztési szabályok

1. Egy pontot egyszerre építünk.
2. Előbb audit, utána kód.
3. Régi hibás editor-kódot nem foltozunk vissza aktív runtime-ba.
4. Ha egy régi megoldás akadályozza a helyes architektúrát, archiváljuk és tiszta v2 megoldással váltjuk ki.
5. A tesztelt Editor Core marad az alap.
6. A frontend nem ír közvetlenül D1-be; API-n keresztül dolgozik.
7. A Page Model az editor igazságforrása, nem a generált HTML.
8. Minden editorfunkció ugyanazon command/action rendszeren keresztül módosítja a dokumentumot.
9. Minden nagy pont végén: GitHub → build → deploy → működési teszt → felhasználói visszaigazolás.
10. Amíg a felhasználó nem mondja, hogy működik, a pont nem `[x]`.

---

# I. ALAPRENDSZER

## 1. Foundation
- [x] Canonical public renderer
- [x] `/p/<slug>` routing
- [x] legacy public HTML archiválás
- [x] Worker + D1 alap
- [x] admin authentication alap
- [x] public admin entry
- [ ] teljes Foundation smoke/regression újraellenőrzés

## 2. Adatmodell
- [x] strukturált Page Model alap
- [x] stabil element ID-k
- [x] hierarchy alap
- [x] props/style/responsive alap
- [x] editor state alap
- [x] command engine alap
- [x] validation alap
- [x] history alap
- [ ] teljes draft/revision/conflict/recovery szerződés

## 3. Editor Core
- [x] create document
- [x] element add/update/delete/duplicate
- [x] hierarchy reparent/reorder
- [x] responsive mutation alap
- [x] lock/visibility alap
- [x] undo/redo
- [x] transaction/batch history
- [x] 12/12 core teszt
- [x] E2 user verification

---

# II. VISUAL EDITOR — ÚJ V2 FELÉPÍTÉS

**Fontos:** innen nem a régi editor továbbfejlesztése történik. A v2 Editor Core fölé építünk teljes új Editor UI/runtime rendszert.

## E3. Editor Shell — KÖVETKEZŐ PONT

### Cél
Egy valódi, használható vizuális szerkesztő munkaasztal létrehozása. Ebben a pontban még nem építjük meg az összes szerkesztési funkciót; a teljes editor szerkezete és kezelési rendszere készül el.

### 3.1 Fő elrendezés
- [ ] felső toolbar
- [ ] bal oldali Elements panel
- [ ] bal oldali Layers/Navigator panel
- [ ] középső Canvas
- [ ] jobb oldali Inspector
- [ ] alsó státusz/save sáv, ha szükséges
- [ ] egységes sötét Sanci design

### 3.2 Panelek
- [ ] panel megnyitás/zárás
- [ ] panelek összecsukása
- [ ] panel szélesség állítása
- [ ] minimum/maximum panelméret
- [ ] panel állapot megőrzése
- [ ] aktív panel jelölése
- [ ] mobil admin/editor használhatóság

### 3.3 Toolbar
- [ ] oldal neve
- [ ] mentés állapot
- [ ] undo
- [ ] redo
- [ ] preview
- [ ] publish előkészítés
- [ ] desktop/tablet/mobile választó
- [ ] zoom
- [ ] fit canvas
- [ ] editor menü

### 3.4 Canvas alap
- [ ] valódi központi munkafelület
- [ ] dokumentum betöltése a Core state-ből
- [ ] viewport keret
- [ ] háttér/grid
- [ ] zoom
- [ ] pan
- [ ] device preview
- [ ] canvas scroll
- [ ] üres állapot

### 3.5 UI eseményrendszer
- [ ] toolbar események
- [ ] panel események
- [ ] selection események
- [ ] canvas click
- [ ] tree click
- [ ] inspector change események
- [ ] event routing egyetlen editor state felé
- [ ] nincs párhuzamos state
- [ ] nincs rejtett legacy listener

### E3 készségi kapu
A pont akkor kész, ha:
1. az editor ténylegesen megnyílik;
2. a teljes shell látható;
3. minden fő panel nyitható/zárható;
4. a canvas középen működik;
5. device és zoom vezérlés működik;
6. toolbar gombok nem halottak;
7. a Core state-hez kapcsolódik;
8. nincs régi editor runtime-függőség;
9. desktop és mobil nézet ellenőrizve;
10. a felhasználó azt mondja: **működik**.

---

# III. CANVAS ÉS HIERARCHY

## E4. Canvas Engine
- [ ] Page Model → DOM render
- [ ] DOM node → element ID mapping
- [ ] click selection
- [ ] hover
- [ ] selected outline
- [ ] parent highlight
- [ ] drop zones
- [ ] drag/drop
- [ ] reparent
- [ ] reorder
- [ ] resize handles
- [ ] multi-select
- [ ] keyboard navigation
- [ ] escape/parent navigation
- [ ] canvas/tree synchronization
- [ ] invalid drop prevention

**Kapcsolat:** minden módosítás a Core commandokon keresztül történik.

## E5. Layers / Navigator
- [ ] teljes fa
- [ ] expand/collapse
- [ ] drag reorder
- [ ] drag reparent
- [ ] hide
- [ ] lock
- [ ] rename
- [ ] duplicate
- [ ] delete
- [ ] search
- [ ] expand-to-selection
- [ ] breadcrumbs
- [ ] multi-selection
- [ ] subtree szabályok

## E6. Element Library
### Alap
- [ ] Section
- [ ] Container
- [ ] Stack
- [ ] Group
- [ ] Div/Box
- [ ] Spacer
- [ ] Heading
- [ ] Text
- [ ] Rich Text
- [ ] Link
- [ ] Button
- [ ] Icon
- [ ] Divider

### Layout
- [ ] Flex
- [ ] Grid
- [ ] Row
- [ ] Columns
- [ ] Absolute
- [ ] Sticky
- [ ] Overlay

### Média
- [ ] Image
- [ ] Gallery
- [ ] Video
- [ ] Audio
- [ ] Embed
- [ ] iframe

### Interaktív
- [ ] Accordion
- [ ] Tabs
- [ ] Modal
- [ ] Carousel
- [ ] Tooltip
- [ ] Dropdown
- [ ] Form
- [ ] Input
- [ ] Select
- [ ] Checkbox
- [ ] Textarea

### Sanci komponensek
- [ ] Twitch Live/Offline
- [ ] Countdown
- [ ] Next Stream
- [ ] Schedule
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] VOD
- [ ] Shorts
- [ ] Community
- [ ] Support
- [ ] Stream Stats
- [ ] Game Card
- [ ] Social Links
- [ ] Sponsor
- [ ] Business Contact
- [ ] About Me

---

# IV. INSPECTOR ÉS STÍLUS

## E7. Inspector
- [ ] Content
- [ ] Layout
- [ ] Size
- [ ] Spacing
- [ ] Flex
- [ ] Grid
- [ ] Position
- [ ] Typography
- [ ] Background
- [ ] Border
- [ ] Radius
- [ ] Shadow
- [ ] Opacity
- [ ] Transform
- [ ] Filter
- [ ] Animation
- [ ] Interaction
- [ ] Responsive
- [ ] Accessibility
- [ ] SEO
- [ ] Data
- [ ] Advanced

Minden szekció összecsukható.

Inspector funkciók:
- [ ] property search
- [ ] reset
- [ ] inherited value jelzés
- [ ] override jelzés
- [ ] invalid value jelzés
- [ ] unit selector
- [ ] color picker
- [ ] token selector
- [ ] multi-selection editing

## E8. Layout Engine
- [ ] width/height
- [ ] min/max
- [ ] auto/fit/fill
- [ ] margin
- [ ] padding
- [ ] gap
- [ ] box model
- [ ] flex
- [ ] grid
- [ ] position
- [ ] z-index
- [ ] overflow
- [ ] aspect ratio
- [ ] responsive layout

## E9. Responsive System
- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] breakpoint model
- [ ] inheritance
- [ ] per-device overrides
- [ ] visibility per device
- [ ] typography per device
- [ ] spacing per device
- [ ] custom breakpoint később
- [ ] responsive validation

---

# V. DESIGN SYSTEM ÉS ÚJRAHASZNOSÍTHATÓSÁG

## E10. Design System
- [ ] colors
- [ ] typography
- [ ] spacing
- [ ] radius
- [ ] shadows
- [ ] breakpoints
- [ ] CSS variables/tokens
- [ ] themes
- [ ] light/dark későbbi lehetőség
- [ ] Sanci brand tokens
- [ ] token override
- [ ] usage search

## E11. Components / Variants
- [ ] reusable component
- [ ] component instance
- [ ] master/instance kapcsolat
- [ ] local override
- [ ] variants
- [ ] state variants
- [ ] reusable sections
- [ ] header/footer
- [ ] card systems
- [ ] CTA
- [ ] component validation

---

# VI. SZERKESZTÉSI MŰVELETEK

## E12. Clipboard + manipulation
- [ ] copy
- [ ] cut
- [ ] paste
- [ ] duplicate
- [ ] multi-copy
- [ ] cross-page paste
- [ ] paste structure
- [ ] paste style only
- [ ] import/export JSON
- [ ] context menu
- [ ] keyboard shortcuts

## E13. History / Versions
- [x] Core undo/redo alap
- [ ] UI history panel
- [ ] grouped history
- [ ] drag/resize grouping
- [ ] typing grouping
- [ ] named versions
- [ ] restore
- [ ] history preview
- [ ] diff
- [ ] server-side versions

## E14. Autosave / Recovery / Conflict
- [ ] autosave debounce
- [ ] save queue
- [ ] retry
- [ ] timeout
- [ ] dirty state
- [ ] local recovery
- [ ] crash recovery
- [ ] unsaved changes protection
- [ ] revision/ETag
- [ ] conflict screen
- [ ] reload/merge/overwrite policy
- [ ] multi-tab detection

---

# VII. OLDALAK ÉS PUBLISHING

## E15. Page Model / CRUD
- [ ] page create
- [ ] edit
- [ ] duplicate
- [ ] delete
- [ ] slug
- [ ] title
- [ ] meta
- [ ] canonical
- [ ] status
- [ ] template
- [ ] permissions

## E16. Draft / Preview / Publish
- [ ] draft
- [ ] preview
- [ ] publish
- [ ] unpublish
- [ ] published snapshot
- [ ] version ID
- [ ] rollback
- [ ] publish validation
- [ ] atomic publish

## E17. Templates
- [ ] blank
- [ ] streamer home
- [ ] schedule
- [ ] about
- [ ] contact
- [ ] community
- [ ] VOD
- [ ] support
- [ ] custom template

## E18. Real Sanci pages
- [ ] Home
- [ ] Rólam
- [ ] Adásrend
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Közösség
- [ ] Kapcsolat
- [ ] Támogatás
- [ ] VOD
- [ ] Shorts
- [ ] Sponsor/Business
- [ ] Press Kit

---

# VIII. MÉDIA, ADAT ÉS INTEGRÁCIÓK

## E19. Media Manager / R2
- [ ] upload
- [ ] folders
- [ ] search
- [ ] filter
- [ ] preview
- [ ] metadata
- [ ] alt text
- [ ] crop/resize
- [ ] replace
- [ ] delete
- [ ] usage tracking
- [ ] unused media

## E20. Dynamic data / bindings
- [ ] D1 bindings
- [ ] site settings
- [ ] schedule
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] VOD
- [ ] collections
- [ ] loading/empty/error states
- [ ] conditional rendering

## E21. External integrations
- [ ] Twitch API
- [ ] YouTube API
- [ ] TikTok integration
- [ ] Discord integration
- [ ] webhook/event handling
- [ ] secrets/permissions
- [ ] cache policy
- [ ] failure fallback

---

# IX. INTERACTIONS, ACCESSIBILITY, SEO

## E22. Interactions
- [ ] click
- [ ] hover
- [ ] focus
- [ ] submit
- [ ] scroll
- [ ] load
- [ ] timer
- [ ] open/close
- [ ] navigate
- [ ] show/hide
- [ ] toggle
- [ ] state
- [ ] animation triggers

## E23. Accessibility
- [ ] semantic HTML
- [ ] heading hierarchy
- [ ] alt
- [ ] labels
- [ ] ARIA
- [ ] keyboard navigation
- [ ] focus order
- [ ] contrast warnings
- [ ] screen-reader metadata
- [ ] editor validation

## E24. SEO
- [ ] title
- [ ] description
- [ ] canonical
- [ ] Open Graph
- [ ] Twitter metadata
- [ ] structured data
- [ ] sitemap
- [ ] robots
- [ ] per-page SEO

---

# X. ADMIN PLATFORM

## A1. Admin shell
- [ ] dashboard
- [ ] navigation
- [ ] responsive admin
- [ ] diagnostics

## A2. Page management
- [ ] page list
- [ ] create/delete/duplicate
- [ ] status
- [ ] versions
- [ ] publish

## A3. Editor management
- [ ] open editor
- [ ] preview
- [ ] recovery
- [ ] history
- [ ] permissions

## A4. Content systems
- [ ] schedule
- [ ] social
- [ ] VOD
- [ ] media
- [ ] settings

## A5. Security / Audit
- [ ] RBAC
- [ ] audit log
- [ ] session security
- [ ] CSRF/replay protection where applicable
- [ ] mutation authorization

## A6. Backup / Restore
- [ ] full backup
- [ ] page backup
- [ ] media references
- [ ] restore validation
- [ ] rollback
- [ ] import/export

---

# XI. SANCI AI PLATFORM

## AI-1. AI Editor
- [ ] AI uses the same command/action system
- [ ] no direct arbitrary HTML mutation
- [ ] permission checks
- [ ] validation before execution
- [ ] preview/diff before destructive actions
- [ ] audit log

## AI-2. Stream Assistant
- [ ] live stream context
- [ ] silence detection
- [ ] idea suggestions
- [ ] stream analysis
- [ ] technical diagnostics
- [ ] chat/context analysis
- [ ] streamer profile/memory

## AI-3. Clip/Short pipeline
- [ ] good moment detection
- [ ] marker button
- [ ] automatic clip preparation
- [ ] short generation pipeline
- [ ] save to media storage
- [ ] review/edit/publish flow

## AI-4. Learning / Evaluation
- [ ] experience memory
- [ ] feedback
- [ ] outcome tracking
- [ ] evaluation cycles
- [ ] safe model/tool boundaries

---

# XII. TESZTELÉS ÉS RELEASE

## T1. Unit
- [x] Editor Core 12/12
- [ ] UI state tests
- [ ] commands regression
- [ ] validation regression

## T2. Integration
- [ ] editor ↔ API
- [ ] API ↔ D1
- [ ] R2
- [ ] publish
- [ ] auth

## T3. E2E
- [ ] create page → edit → save → reload → preview → publish
- [ ] mobile/desktop
- [ ] recovery
- [ ] conflict

## T4. Regression
- [ ] public pages
- [ ] redirects
- [ ] admin
- [ ] editor
- [ ] integrations

## T5. Performance
- [ ] editor load
- [ ] canvas performance
- [ ] large page
- [ ] many nodes
- [ ] media

## T6. Release gate
- [ ] no blocking errors
- [ ] build passes
- [ ] deploy passes
- [ ] API passes
- [ ] D1 verified
- [ ] public verified
- [ ] mobile verified
- [ ] desktop verified
- [ ] user verification

---

# XIII. VÉGREHAJTÁSI SORREND — NEM UGRÁLUNK

**Mostani állapot:**

1. Foundation: alapok kész.
2. Editor Core: kész és felhasználó által ellenőrzött.
3. Régi editor: archiválva, nem hozzuk vissza.
4. Új Editor v2 UI: jelenlegi változata elégtelen → nem tekintjük késznek.
5. **KÖVETKEZŐ: E3 Editor Shell.**

### E3 után sorrend:
`E3 Shell → E4 Canvas → E5 Layers → E6 Elements → E7 Inspector → E8 Layout → E9 Responsive → E10 Design System → E11 Components → E12 Clipboard → E13 History → E14 Recovery → E15 Pages → E16 Publish → E17 Templates → E18 Sanci Pages → E19 Media → E20 Data → E21 Integrations → E22 Interactions → E23 Accessibility → E24 SEO → Admin → AI → teljes E2E/Release`

### Minden pontnál ugyanaz a ciklus
`Audit → tervezés → implementáció → érintett fájlok visszaolvasása → commit → GitHub Actions → Cloudflare build/deploy → működési teszt → user verification → státuszfrissítés`

**Sikertelen pont után nincs következő pont.**

---

# XIV. JELENLEGI DÖNTÉS

A Sanci9517 editor célja nem egy egyszerű CMS-szerkesztő, hanem egy saját, professzionális visual builder.

A viselkedési mintákat több működő builderből és licenc-kompatibilis open-source projektekből vizsgáljuk, de nem másolunk be védett/proprietary forráskódot. A saját Page Model, Command System, D1/R2, Sanci design és későbbi SANCI AI action-rendszer marad az alap.

**Következő konkrét munkapont: E3.1 — Editor Shell fő elrendezés.**
