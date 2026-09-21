# Sanci9517 — EGYSÉGES MASTER FEJLESZTÉSI, TESZTELÉSI ÉS FUNKCIÓBŐVÍTÉSI TERV

**Verzió:** MASTER-2.13  
**Dátum:** 2026-09-18  
**Repository:** `sanci9517/sanci9517`  
**Aktív branch:** `v2/foundation`  
**Projekt:** Sanci9517 Streamer Brand Platform  
**Állapot:** ez az egyetlen aktív fejlesztési terv.

> **Ez a dokumentum az egyetlen végrehajtási igazságforrás.** A korábbi blueprint-ek, roadmap-ek, editor-tervek, AI-tervek és státuszfájlok archivált tudásanyagként maradnak meg. Új beszélgetésben, akár hónapok múlva is, ezt a fájlt kell először elolvasni, majd kizárólag a 35. fejezetben kijelölt **EGYETLEN AKTÍV PONTBÓL** folytatni. Más fejezet `[ ]` pontja nem jelent aktuális folytatási pontot.

---

# 00 — A MASTER TERV SZABÁLYAI

## 00.1 Státuszjelölések
- `[x]` = implementálva, végigtesztelve és a felhasználó visszaigazolta.
- `[~]` = részleges, folyamatban vagy újratesztelendő.
- `[ ]` = még nincs kész.
- `[!]` = blokkoló hiba.
- `[D]` = dokumentálandó döntési pont.

**Kód jelenléte önmagában soha nem jelent `[x]` státuszt.**

## 00.2 Egyetlen aktív pont
Egyszerre **csak egy fejlesztési pont** lehet aktív. Az aktuális pont lezárása előtt nem kezdünk következő pontot.

**KÖTELEZŐ ÁLLAPOTMENTÉS MINDEN LÉPÉS UTÁN:** minden fejlesztési, javítási, tesztelési vagy döntési lépés lezárásakor frissíteni kell ezt a MASTER fájlt. A frissítés akkor is kötelező, ha egy beszélgetésen belül több lépést teszünk meg. A MASTER-nek mindig a **legutolsó ténylegesen elvégzett lépés utáni állapotot** kell tükröznie, ezért új beszélgetés bármikor megszakíthatja a munkát anélkül, hogy elveszne a pontos folytatási pont.

## 00.3 Kötelező MASTER-állapotfrissítés minden lépés után
Minden egyes lépés után, még a következő lépés megkezdése előtt:
1. rögzíteni kell, mit végeztünk el;
2. rögzíteni kell a teszt eredményét;
3. rögzíteni kell, mi maradt hátra vagy mi blokkol;
4. rögzíteni kell az **egyetlen aktuális folytatási pontot**;
5. szükség esetén rögzíteni kell a commit/HEAD állapotot;
6. a MASTER fájlt GitHubon frissíteni kell.

**Tilos** több fejlesztési lépést úgy végrehajtani, hogy közben a MASTER ne tükrözze az aktuális állapotot. Ha a beszélgetés bármikor megszakad, az utolsó MASTER-frissítés legyen a hivatalos folytatási pont.

## 00.4 Kötelező munkaciklus
Minden aktív pont:

`MASTER pont → teljes érintett kód audit → adatfolyam audit → minimális módosítás → érintett fájl visszaolvasása → GitHub commit → branch/HEAD ellenőrzés → Cloudflare build → deploy → API ellenőrzés → D1/R2/KV ellenőrzés → admin teszt → public teszt → desktop/tablet/mobile teszt → regresszió → felhasználói teszt → felhasználói visszaigazolás → MASTER frissítése`

Sikertelen tesztnél **nem lépünk tovább**.

## 00.4 Folyamatos funkcióbővítés
A cél nem egy egyszer elkészített minimális editor. A Visual Editor és a teljes platform **folyamatosan bővülő rendszer**.

Ha a fejlesztés során:
- hiányzó funkciót találunk;
- jobb iparági megoldást találunk;
- új felhasználói igény merül fel;
- egy funkció más funkciótól függ;
- biztonsági, accessibility, performance vagy AI-kompatibilitási követelmény jelenik meg;
- a jelenlegi tervből kimaradt, de a lehető legrészletesebb editorhoz szükséges képesség azonosítható;

akkor **először ezt a MASTER tervet frissítjük**, megfelelő helyre soroljuk és csak utána implementáljuk.

A terv ezért élő dokumentum: nem rövidíteni kell, hanem új funkciókkal és pontos státuszokkal folyamatosan bővíteni.

## 00.5 Preset + manuális beállítás szabály
Ahol a felhasználó gyakran ismétlődő értékeket állít, ott a manuális mező mellett értelmes presetek is legyenek.

Példák:
- width: Auto / Fill / Fit / gyakori méretek;
- height: Auto / Fit / gyakori méretek;
- spacing: előre definiált lépések;
- typography: token/preset;
- radius/shadow: token/preset;
- breakpoint/device: presetek;
- zoom: 25/50/75/100/150/200% és Fit;
- layout: gyakori Flex/Grid/Stack beállítások.

A preset nem külön kerülőút: ugyanazon `Command → Validation → Page Model → History → Canvas → Persistence` láncon működik, mint a manuális szerkesztés. Minden preset legyen responsive-context aware, ha az adott tulajdonság responsive.

## 00.6 Forrás- és benchmark szabály
A Visual Editor specifikációját több dokumentált rendszer mintái alapján bővítjük. Vizsgálható többek között Builder Visual Editor, Elementor, Webflow, Pinegrow, GrapesJS, Craft.js és Puck. A vizsgált mintákat nem másoljuk; csak a hasznos, bizonyítható funkciókat építjük be saját Page Modelbe.

## 00.7 Architektúra elsőbbsége
Nem vezetünk be második selection-, hierarchy-, state-, renderer- vagy command-rendszert. Az új funkciók a kanonikus rendszert bővítik.

---

# 01 — VÉGLEGES CÉLKÉP

## 01/A Publikus Sanci9517 platform
- prémium streamer/creator weboldal;
- magyar publikus felület;
- közös Sanci Brand design;
- desktop/tablet/mobile;
- Twitch, TikTok, YouTube, Discord;
- Home, Rólam, Adásrend, Twitch, YouTube, TikTok, VOD, Shorts, Közösség, Kapcsolat, Támogatás, Sponsor/Business, Press Kit;
- később Merch, Blog/News, Events, Community Hub és további oldalak;
- élő/offline állapot;
- következő stream countdown;
- dinamikus szerveroldali adatok;
- SEO, analytics, accessibility, performance.

## 01/B Admin/CMS
- biztonságos login/session;
- RBAC;
- dashboard;
- pages;
- Visual Editor;
- Layers/Navigator;
- Inspector;
- Components;
- Templates;
- Design System;
- Media/R2;
- Schedule;
- Social;
- VOD/Clips/Shorts;
- SEO;
- Analytics;
- Integrations;
- Settings;
- Audit;
- Draft/Preview/Publish;
- Versioning/Rollback;
- Backup/Restore;
- Import/Export;
- később AI/Automation.

## 01/C SANCI AI
Nem egyszerű chatbot. Hosszú távú, jogosultságokkal, action-validációval, preview-val, approval-lel, auditálással és rollbackkel működő platform:
- Editor AI;
- tartalomjavaslat;
- oldal- és komponensmódosítás;
- streamer-profil és memória;
- stream megfigyelés;
- beszéd/csend figyelése;
- chat/context elemzés;
- technikai problémajelzés;
- stream setup ellenőrzés;
- ötletadás;
- jó pillanatok felismerése;
- klip/Short előkészítés és később automatizálás;
- stream utáni elemzés;
- tanulási/értékelési ciklus;
- analytics/research/content intelligence.

---

# 02 — KANONIKUS ARCHITEKTÚRA

## 02/A Adatforrások
- D1 = strukturált tartalom/configuration elsődleges igazságforrás;
- R2 = média elsődleges tároló;
- KV = cache és nem kritikus gyors állapot;
- GitHub = forráskód + migráció + dokumentáció;
- Cloudflare Worker = web/API belépési pont;
- frontend = nem ír közvetlenül D1/R2/KV-be.

## 02/B Rétegek
`Public Renderer → Worker Router → API/Service → Domain/Data → D1/R2/KV`

`Admin UI → API → Service → Repository → storage`

`AI/Automation → Permission → Action → Validation → State → History/Version → Persistence → Verify → Audit`

## 02/C Page Model
`Site → Page → Root → Section → Container → Component/Element`

Node minimum:
- stable id;
- type;
- name;
- parentId;
- children/order;
- props/content;
- style/layout;
- responsive;
- visibility;
- locked;
- metadata;
- accessibility;
- dataBindings;
- interactions;
- validation state;
- capabilities;
- schema version.

A DOM nem source of truth. HTML import nem lehet az editor működésének feltétele.

## 02/D Stabil ID-k
siteId, pageId, sectionId, containerId, componentId, elementId, actionId, versionId, mediaId, scheduleId, auditId, assetId, templateId, tokenId, dataSourceId, automationId, taskId, agentId.

## 02/E State rétegek
Külön:
- persisted server state;
- published state;
- working/editor state;
- local recovery;
- UI-only state;
- history;
- preview;
- integration cache.
## 02/F Konfliktus/recovery
- revision/ETag/equivalent check;
- több tab érzékelés;
- konfliktus nem írhat csendben felül;
- reload/merge/overwrite megfelelő jogosultsággal;
- audit;
- autosave/recovery;
- save queue/retry/timeout;
- browser/tab crash recovery;
- recovery törlése sikeres mentés után.

## 02/G D1 canonicalization blocker
A jelenlegi Editor canonical documentje `sanci-page-document`, schemaVersion 1, miközben korábbi migrationben eltérő `sanci-document`/schemaVersion 2 örökség is található. Ezt nem workarounddal fedjük el: a végleges D1 Page Model canonicalizálás külön architekturális feladat és tesztkapu.

---

# 03 — TESZTELÉSI ÉS MINŐSÉGI KAPUK

Minden nagy funkció ellenőrzése:
1. cél;
2. adatmodell;
3. API;
4. jogosultság;
5. validation;
6. command/action;
7. state;
8. history;
9. save;
10. reload;
11. preview;
12. publish;
13. error handling;
14. recovery;
15. responsive;
16. accessibility;
17. performance;
18. AI compatibility;
19. rollback;
20. regression.

Tesztkategóriák:
- unit;
- integration;
- API;
- D1/R2/KV;
- E2E/browser;
- smoke/regression;
- visual regression;
- responsive;
- accessibility;
- security;
- performance;
- migration;
- backup/restore;
- concurrency;
- AI action validation/rollback;
- production deploy.

---

# 04 — ALAPRENDSZER / FOUNDATION

## 4.1 Canonical routing
- [x] `/` canonical renderer
- [x] `/p/<slug>` canonical renderer
- [x] legacy URL redirect alap
- [x] Worker routing
- [x] D1 published snapshot alap

## 4.2 Legacy archive
- [x] régi publikus HTML archiválva
- [x] `archive/pre-canonical-public-2026-09-16`
- [x] aktív renderer nem függ a legacy HTML-től
- [x] régi editor archive: `archive/pre-editor-rebuild-2026-09-16`

## 4.3 Foundation teljes újrateszt
- [ ] `/`, `/p/home`, további `/p/<slug>`
- [ ] legacy redirectek
- [ ] health/API
- [ ] D1 pages
- [ ] auth/session
- [ ] GitHub branch/HEAD
- [ ] Cloudflare deploy
- [ ] nincs véletlen törlés
- [ ] renderer hibamentes

---

# 05 — EDITOR CORE / STATE / COMMAND

## 5.1 Core
- [x] document creation
- [x] selection alap
- [x] element add/update/content
- [x] style/layout/responsive mutation
- [x] visibility/lock
- [x] delete/duplicate
- [x] hierarchy reparent/reorder
- [x] undo/redo
- [x] transaction/batch history
- [x] validation
- [x] unknown command corruption protection
- [x] E2: 12/12 core test
- [x] user E2 confirmation

## 5.2 Command API teljesítési szabály
Alap actionök:
`create, update, delete, duplicate, move, resize, reparent, reorder, group, ungroup, select, style.set, layout.set, responsive.set, content.set, visibility.set, lock.set, page.create/delete/rename/duplicate, component.*, template.*, media.attach/detach, save, preview, publish, rollback, restore`.

Minden mutáció validation + history + ahol szükséges audit + rollback kompatibilitással készüljön.

---

# 06 — AKTUÁLIS EDITOR UI / INSPECTOR STABILIZÁLÁS

## 6.1 Geometry Inspector — kézi értékek
- [x] X
- [x] Y
- [x] width
- [x] height
- [x] position
- [x] responsive context használata
- [x] Command API-n át történő módosítás
- [x] Canvas Engine render
- [x] user browser test: **Működik**

## 6.2 Geometry Inspector presets
**Csak ezt a pontot dolgozzuk most.**

Cél: a geometry kézi mezői mellett gyors, értelmes presetek legyenek, anélkül hogy más adatfolyam jönne létre.

### Width presetek
- Auto;
- Fill / 100%;
- Fit-content / Fit;
- gyakori fix méretek csak akkor, ha az adott elemnél értelmesek;
- Manual továbbra is elérhető.

### Height presetek
- Auto;
- Fit-content / Fit;
- gyakori fix méretek csak akkor, ha értelmesek;
- Manual továbbra is elérhető.

### Position presetek
- Static;
- Relative;
- Absolute;
- Fixed/Sticky csak akkor jelenjen meg, ha a jelenlegi layout-engine már biztonságosan támogatja;
- a szükséges X/Y/inset mezők a választott módtól függően jelenjenek meg.

### Kötelező technikai szabályok
- preset → ugyanaz a Command API;
- ugyanaz a Page Model;
- ugyanaz a responsive context;
- undo/redo működjön;
- reset/inheritance működjön;
- reload után megmaradjon;
- invalid preset ne okozzon dokumentum-korrupciót;
- Inspector registry felé illeszthető legyen;
- ne legyen második style state.

### Tesztkapu
1. desktop preset;
2. tablet preset;
3. mobile preset;
4. manual → preset;
5. preset → manual;
6. preset → reset/inherit;
7. undo/redo;
8. reload;
9. canvas render;
10. invalid/edge case;
11. user confirmation.

**[x] User browser test: mind az 5 kötelező 6.2 teszt PASS; felhasználói visszaigazolás: „Mind az 5 jó”.**

---

# 07 — EDITOR SHELL ÉS CANVAS UX

## 7.1 Editor Shell — későbbi tesztkapuk, jelenleg NEM aktív
A 7.1 pont nem az aktuális folytatási pont. Az itt maradt feladatok későbbi tesztkapuk.
- [~] top toolbar

- [x] Elements panel — felhasználói tesztekkel lezárva
- [ ] Layers/Navigator — későbbi
- [ ] Canvas — későbbi
- [ ] Inspector — későbbi
- [ ] status/save bar — későbbi
- [x] panel open/close — felhasználói teszttel lezárva
- [x] collapse — felhasználói teszttel lezárva
- [x] panel width min/max — felhasználói teszttel lezárva
- [x] state persistence — UI-only localStorage; panel open/close, left tab és dock width visszaáll refresh után; user test: „Működik”
- [ ] mobile editor UX — későbbi
- [ ] egységes dark Sanci design — későbbi

## 7.2 Toolbar
- [ ] page name- [ ] save status
- [ ] undo/redo
- [ ] preview
- [ ] publish preparation
- [ ] desktop/tablet/mobile
- [ ] zoom
- [ ] fit
- [ ] editor menu
- [ ] command palette később

## 7.3 Canvas
- [ ] centered workspace
- [ ] viewport frame
- [ ] grid
- [ ] pan
- [ ] zoom presets: 25/50/75/100/150/200 + Fit
- [ ] device preview
- [ ] scroll preservation
- [ ] empty state
- [ ] background
- [ ] selection outline
- [ ] hover/parent outline
- [ ] spacing visualizer
- [ ] ruler
- [ ] safe area
- [ ] guides
- [ ] snap
- [ ] snap strength
- [ ] breakpoint indicator
- [ ] focus selected
- [ ] preview overlay

---

# 08 — CANVAS ENGINE / HIERARCHY / MANIPULATION

## 8.1 Render mapping
- [x] Page Model → DOM alap
- [x] DOM node → stable element ID mapping
- [x] responsive style resolution alap
- [x] geometry style mapping

## 8.2 Selection
- [ ] click
- [ ] hover
- [ ] selected outline
- [ ] parent highlight
- [ ] multi-select
- [ ] keyboard navigation
- [ ] escape/parent navigation
- [ ] tree/canvas sync

## 8.3 Drag/drop és manipulation
- [ ] drag
- [ ] drop zones
- [ ] invalid drop prevention
- [ ] reparent
- [ ] reorder
- [ ] resize handles
- [ ] move guides
- [ ] smart guides
- [ ] snap to grid
- [ ] snap to sibling/parent
- [ ] distance indicators
- [ ] alignment tools
- [ ] match width/height
- [ ] distribute

## 8.4 Layers/Navigator
- [ ] complete tree
- [ ] expand/collapse
- [ ] reorder/reparent
- [ ] hide/lock
- [ ] rename
- [ ] duplicate/delete
- [ ] search
- [ ] expand-to-selection
- [ ] breadcrumbs
- [ ] subtree rules

---

# 09 — ELEMENT LIBRARY

## 9.1 Basic
- [ ] Root
- [ ] Section
- [ ] Container/Box
- [ ] Div
- [ ] Stack
- [ ] Group
- [ ] Spacer
- [ ] Heading H1-H6
- [ ] Text/Paragraph
- [ ] Rich Text
- [ ] Link
- [ ] Button
- [ ] Icon
- [ ] Divider
- [ ] Badge/Tag
- [ ] Quote
- [ ] List

## 9.2 Layout
- [ ] Flex
- [ ] Grid
- [ ] Row
- [ ] Columns
- [ ] Panel
- [ ] Overlay
- [ ] Absolute
- [ ] Sticky
- [ ] responsive stack

## 9.3 Media
- [ ] Image
- [ ] Gallery
- [ ] Video
- [ ] Audio
- [ ] Embed
- [ ] iframe
- [ ] media placeholder
- [ ] lazy-loading metadata

## 9.4 Interactive
- [ ] Accordion
- [ ] Tabs
- [ ] Modal
- [ ] Tooltip
- [ ] Dropdown
- [ ] Carousel
- [ ] Form
- [ ] Input
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Textarea
- [ ] validation messages

## 9.5 Sanci blocks
- [ ] Twitch Live/Offline
- [ ] Twitch player
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
- [ ] Game Card/List
- [ ] Social Links
- [ ] Sponsor
- [ ] Business Contact
- [ ] About Me
- [ ] Sanci Button

---

# 10 — INSPECTOR TELJES RENDSZER

A Geometry pont után az Inspector fokozatosan, szekciónként készül.

## 10.0 Inspector kapcsolat — történeti, lezárt tesztállapot
- [x] kijelölt elem adatai megjelennek az Inspectorban
- [x] szövegtartalom módosítása → Canvas frissül
- [x] X/Y pozíció módosítása
- [x] szélesség/magasság módosítása
- [x] geometry preset működése
- [x] Inspector módosítások visszakijelölés után megmaradnak
- [!] Inspectorból elem törlése jelenleg nem érhető el UI-gombbal
- [x] a kanonikus `element.delete` command már létezik és validált history-láncon működik

## 10.0.1 Inspector törlés UI — LEZÁRVA
Cél: a meglévő `element.delete` commandhoz biztonságos Inspector műveletet adni.

Követelmények:
- törlés csak kijelölt elemnél;
- root elem ne legyen törölhető;
- locked elem törlését a command réteg blokkolja;
- törlés után selection frissüljön;
- Canvas és Layers/Navigator állapota frissüljön;
- undo/redo működjön;
- dirty state és revision frissüljön;
- nincs második mutation/state rendszer;
- felhasználói teszt nélkül nem lesz [x].

## 10.0.2 Tesztkapu
**[~] Részleges felhasználói teszt: az alap törlés + Canvas/Layers + Undo működését a felhasználó visszaigazolta („Működik”). A teljes kapuhoz az alábbi edge-case tesztek még hátravannak.**

1. Inspectorban a törlés művelet látható.
2. Nem-root elem törlése működik.
3. Törlés után az elem eltűnik a Canvasról.
4. Kijelölés megszűnik vagy értelmes szomszédos kijelölés marad.
5. Layers/Navigator frissül.
6. Undo visszahozza.
7. Redo újra törli.8. Root törlése védett.
9. Locked elem törlése védett.
10. User confirmation.

## 10.1 Content
- [ ] plain text
- [~] rich text — strukturált Rich Text Inspector első formázó UI implementálva; canonical schema/command/validation/Canvas lánc változatlan. Inspector: Bekezdés/H1-H6 + B/I vezérlők. Runtime felhasználói teszt még hátra van.
- [ ] links
- [ ] media selection
- [ ] alt/title
- [ ] dynamic content

## 10.2 Layout
- [ ] display
- [ ] width/height
- [ ] min/max
- [ ] auto/fit/fill
- [ ] block/inline/stack
- [ ] flex
- [ ] grid
- [ ] alignment
- [ ] distribution
- [ ] wrap
- [ ] gap
- [ ] aspect ratio
- [ ] overflow

## 10.3 Spacing / box model
- [ ] margin all/sides
- [ ] padding all/sides
- [ ] gap
- [ ] linked/unlinked sides
- [ ] shorthand
- [ ] negative margin rules
- [ ] visual box model
- [ ] responsive spacing
- [ ] spacing presets

## 10.4 Position
- [x] position/X/Y alap
- [ ] top/right/bottom/left
- [ ] inset
- [ ] z-index
- [ ] containing block
- [ ] stacking context
- [ ] conflict validation
- [ ] position presets

## 10.5 Typography
- [ ] font family
- [ ] font size
- [ ] weight
- [ ] line-height
- [ ] letter spacing
- [ ] word spacing
- [ ] text transform
- [ ] decoration
- [ ] alignment
- [ ] text color
- [ ] typography presets/tokens
- [ ] responsive typography

## 10.6 Appearance
- [ ] background color
- [ ] gradient
- [ ] image background
- [ ] border
- [ ] radius
- [ ] shadow
- [ ] opacity
- [ ] filter
- [ ] blend
- [ ] appearance presets/tokens

## 10.7 Transform / Animation
- [ ] translate
- [ ] rotate
- [ ] scale
- [ ] skew
- [ ] transform origin
- [ ] transition
- [ ] animation
- [ ] keyframe model
- [ ] trigger
- [ ] reduced-motion compatibility

## 10.8 Interaction
- [ ] click
- [ ] hover
- [ ] focus
- [ ] active
- [ ] submit
- [ ] scroll
- [ ] load
- [ ] timer
- [ ] open/close
- [ ] navigate
- [ ] show/hide
- [ ] toggle
- [ ] state variants

## 10.9 Advanced Inspector UX
- [ ] central property registry used by UI
- [ ] property search
- [ ] reset
- [ ] inherited value indicator
- [ ] override indicator
- [ ] invalid indicator
- [ ] unit selector
- [ ] color picker
- [ ] token selector
- [ ] multi-selection editing
- [ ] Beginner/Advanced/Pro progressive disclosure
- [ ] context-sensitive property visibility

---

# 11 — RESPONSIVE ENGINE

- [x] desktop/tablet/mobile viewport model alap
- [x] responsive inheritance alap
- [x] per-device responsive state alap
- [ ] device presets
- [ ] custom breakpoints
- [ ] orientation
- [ ] min/max breakpoint constraints
- [ ] breakpoint management UI
- [ ] property-by-device editing
- [ ] visibility per device
- [ ] typography per device
- [ ] spacing per device
- [ ] layout per device
- [ ] responsive presets
- [ ] inheritance reset
- [ ] override indicator
- [ ] responsive validation
- [ ] visual breakpoint indicator

Inheritance default:
`mobile → tablet → desktop`, `tablet → desktop`, `desktop → base`.

---

# 12 — DESIGN SYSTEM / TOKENS / PRESETS

- [ ] color tokens
- [ ] typography tokens
- [ ] spacing tokens
- [ ] radius tokens
- [ ] shadow tokens
- [ ] breakpoint tokens
- [ ] animation tokens
- [ ] CSS variables
- [ ] Sanci brand tokens
- [ ] themes
- [ ] token override
- [ ] usage search
- [ ] global/local scope
- [ ] token validation
- [ ] preset registry
- [ ] preset versioning
- [ ] preset preview
- [ ] preset apply/reset

Presets mindenhol csak ott jelenjenek meg, ahol ténylegesen gyorsítják a szerkesztést; a manual control mindig megmaradjon.

---

# 13 — COMPONENTS / VARIANTS / TEMPLATES

- [ ] reusable component
- [ ] component schema
- [ ] component instance
- [ ] master/instance relationship
- [ ] local override
- [ ] variants
- [ ] state variants
- [ ] reusable sections
- [ ] header/footer
- [ ] cards
- [ ] CTA
- [ ] global component
- [ ] component permissions
- [ ] component validation
- [ ] dependency/usage tracking
- [ ] component versioning

Templates:
- [ ] blank
- [ ] streamer home
- [ ] schedule
- [ ] about
- [ ] contact
- [ ] community
- [ ] VOD
- [ ] support
- [ ] custom
- [ ] reusable page templates

---
# 14 — CLIPBOARD / IMPORT / EXPORT / KEYBOARD

- [ ] copy
- [ ] cut
- [ ] paste
- [ ] duplicate
- [ ] multi-copy
- [ ] cross-page paste
- [ ] paste structure
- [ ] paste style only
- [ ] JSON export
- [ ] JSON import
- [ ] schema validation import
- [ ] context menu
- [ ] keyboard shortcuts
- [ ] shortcut customization later
- [ ] command palette
- [ ] quick action search

---

# 15 — HISTORY / AUTOSAVE / RECOVERY / CONFLICT

## History
- [x] core undo/redo
- [ ] UI history panel
- [ ] grouped history
- [ ] drag/resize grouping
- [ ] typing grouping
- [ ] named versions
- [ ] restore
- [ ] history preview
- [ ] diff
- [ ] server-side versions
- [ ] history retention policy

## Autosave/recovery
- [ ] debounce
- [ ] save queue
- [ ] retry
- [ ] timeout
- [ ] dirty state
- [ ] local recovery
- [ ] crash recovery
- [ ] unsaved navigation protection
- [ ] browser close recovery

## Conflict
- [ ] revision/ETag
- [ ] multi-tab detection
- [ ] conflict screen
- [ ] reload
- [ ] merge
- [ ] overwrite with permission
- [ ] conflict audit

---

# 16 — PAGE MANAGEMENT / D1 / CANONICALIZATION

## Page CRUD
- [ ] create
- [ ] rename
- [ ] edit
- [ ] duplicate
- [ ] delete
- [ ] slug
- [ ] title
- [ ] metadata
- [ ] canonical
- [ ] status
- [ ] template
- [ ] permissions

## D1 canonical Page Model
- [ ] egyetlen canonical schema rögzítése
- [ ] régi `sanci-document` örökség feltérképezése
- [ ] migration mapping
- [ ] canonical write
- [ ] canonical read
- [ ] validation
- [ ] rollback
- [ ] legacy migration teszt
- [ ] D1 schema audit

---

# 17 — DRAFT / PREVIEW / PUBLISH / VERSION / ROLLBACK

- [ ] draft state
- [ ] preview state
- [ ] preview URL/token
- [ ] publish validation
- [ ] publish
- [ ] unpublish
- [ ] republish
- [ ] published snapshot
- [ ] version ID
- [ ] timestamp
- [ ] atomic publish
- [ ] rollback
- [ ] diff
- [ ] cache invalidation
- [ ] preview-only state
- [ ] publish audit

---

# 18 — REAL SANSI OLDALAK / MIGRÁCIÓ

Megőrzendő valódi oldalak:
- [ ] Home
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Menetrend
- [ ] VOD
- [ ] Közösség
- [ ] Rólam
- [ ] Kapcsolat
- [ ] Támogatás
- [ ] Shorts
- [ ] Sponsor/Business
- [ ] Press Kit
- [ ] további valódi Sanci oldalak

Migráció sorrendje oldalanként:
`eredeti backup → HTML/CSS audit → Page Model mapping → hierarchy → dynamic mapping → fallback ahol szükséges → D1 save → editor check → reload → preview → publish → public compare → responsive → user confirmation`.

Egyetlen valódi oldal sem törölhető/cserélhető véglegesen a lánc sikeres tesztje előtt.

Régi tesztoldalak csak a valódi oldalak biztonságos migrációja után:
- [ ] azonosítás
- [ ] backup/export ha szükséges
- [ ] törlés
- [ ] D1 ellenőrzés
- [ ] page-list ellenőrzés

---

# 19 — MEDIA / R2

- [ ] upload
- [ ] folders
- [ ] search
- [ ] filter
- [ ] preview
- [ ] metadata
- [ ] alt text
- [ ] crop
- [ ] resize
- [ ] replace
- [ ] archive/delete
- [ ] usage tracking
- [ ] unused media detection
- [ ] MIME validation
- [ ] file-size limits
- [ ] secure object keys
- [ ] image optimization
- [ ] video/audio
- [ ] clip/short assets
- [ ] cache policy

---

# 20 — DYNAMIC DATA / BINDINGS

- [ ] D1 binding
- [ ] site settings
- [ ] schedule
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] VOD
- [ ] collections
- [ ] API data source
- [ ] loading state
- [ ] empty state
- [ ] error state
- [ ] conditional rendering
- [ ] data transforms
- [ ] caching
- [ ] stale-data handling
- [ ] binding validation

---

# 21 — STREAMER INTEGRATIONS

## Twitch
- [ ] OAuth
- [ ] live/offline
- [ ] title
- [ ] game
- [ ] viewer statistics
- [ ] followers/subscribers where available
- [ ] VOD
- [ ] clips- [ ] events/webhooks where applicable

## YouTube
- [ ] channel
- [ ] videos
- [ ] Shorts
- [ ] statistics where available
- [ ] API quota/error handling

## TikTok
- [ ] profile
- [ ] supported content integration
- [ ] API capability review
- [ ] rate limits/fallback

## Discord
- [ ] community link
- [ ] optional integration
- [ ] status where justified

Secrets remain Cloudflare Secrets; external APIs are normalized behind services.

---

# 22 — SCHEDULE / VOD / SHORTS / CONTENT ENGINE

- [ ] schedule CRUD
- [ ] recurring schedule
- [ ] timezone handling
- [ ] next-stream calculation
- [ ] countdown
- [ ] live state
- [ ] game/category
- [ ] stream type
- [ ] VOD ingestion
- [ ] VOD categorization
- [ ] search/filter
- [ ] Shorts management
- [ ] clips management
- [ ] content calendar
- [ ] platform-specific variants
- [ ] title/description/hashtag suggestions
- [ ] thumbnail brief
- [ ] publishing workflow
- [ ] performance feedback loop

---

# 23 — INTERACTIONS / ANIMATION

- [ ] event model
- [ ] click
- [ ] hover
- [ ] focus
- [ ] active
- [ ] submit
- [ ] scroll
- [ ] load
- [ ] timer
- [ ] open/close
- [ ] navigation
- [ ] show/hide
- [ ] toggle
- [ ] state machine
- [ ] transition
- [ ] animation timeline
- [ ] keyframes
- [ ] reduced-motion
- [ ] interaction validation
- [ ] performance safeguards

---

# 24 — ACCESSIBILITY

- [ ] semantic HTML
- [ ] heading hierarchy
- [ ] alt text
- [ ] labels
- [ ] ARIA
- [ ] keyboard navigation
- [ ] focus order
- [ ] focus visibility
- [ ] contrast warnings
- [ ] screen-reader metadata
- [ ] form validation accessibility
- [ ] editor accessibility checks
- [ ] public accessibility audit

---

# 25 — SEO

- [ ] title
- [ ] description
- [ ] canonical
- [ ] Open Graph
- [ ] X/Twitter card
- [ ] structured data
- [ ] sitemap
- [ ] robots
- [ ] per-page SEO
- [ ] SEO preview
- [ ] redirects
- [ ] broken-link detection

---

# 26 — ANALYTICS / INSIGHTS

- [ ] page views
- [ ] button clicks
- [ ] social clicks
- [ ] stream events
- [ ] conversion events
- [ ] privacy-aware analytics
- [ ] retention policy
- [ ] admin dashboard
- [ ] editor/content performance
- [ ] content performance
- [ ] stream performance
- [ ] anomaly detection later

---

# 27 — ADMIN PLATFORM

- [ ] dashboard
- [ ] navigation
- [ ] responsive admin
- [ ] diagnostics
- [ ] page list
- [ ] content management
- [ ] schedule
- [ ] socials
- [ ] VOD
- [ ] media
- [ ] settings
- [ ] SEO
- [ ] analytics
- [ ] integrations
- [ ] editor management
- [ ] preview
- [ ] recovery
- [ ] history
- [ ] permissions

---

# 28 — SECURITY / AUDIT / PERMISSIONS

- [ ] HttpOnly
- [ ] Secure cookie
- [ ] SameSite
- [ ] password hash
- [ ] CSRF
- [ ] rate limiting
- [ ] RBAC
- [ ] API authorization
- [ ] public/admin separation
- [ ] Cloudflare Secrets
- [ ] audit log
- [ ] input validation
- [ ] output validation
- [ ] file validation
- [ ] replay protection where applicable
- [ ] action permission `can()` checks
- [ ] AI permission boundary

---

# 29 — BACKUP / RESTORE / IMPORT / EXPORT

- [ ] full backup
- [ ] page backup
- [ ] revision backup
- [ ] media references
- [ ] restore validation
- [ ] rollback
- [ ] import/export JSON
- [ ] migration compatibility
- [ ] backup integrity check
- [ ] recovery drill

---

# 30 — PERFORMANCE / PRODUCTION

- [ ] bundle review
- [ ] lazy loading
- [ ] image optimization
- [ ] caching
- [ ] cache invalidation
- [ ] Core Web Vitals
- [ ] rendering performance
- [ ] large-page performance
- [ ] large-tree editor performance
- [ ] history memory limits
- [ ] autosave efficiency
- [ ] API latency monitoring- [ ] production smoke test
- [ ] visual regression baseline

---

# 31 — AI EDITOR / AUTOMATION

AI ugyanazt az action rendszert használja, mint a kézi Editor.

Pipeline:
`Intent → Plan → Actions → Permission → Validation → Preview/Diff → Approval → Execute → Verify → Audit → Version`

- [ ] AI page operations
- [ ] AI element operations
- [ ] AI style/layout operations
- [ ] AI responsive operations
- [ ] AI content generation
- [ ] AI SEO assistance
- [ ] AI accessibility QA
- [ ] AI visual QA
- [ ] action permissions
- [ ] approval rules
- [ ] rollback
- [ ] audit
- [ ] rate/cost controls

---

# 32 — SANCI STREAM ASSISTANT / INTELLIGENCE

## Live stream intelligence
- [ ] live stream monitoring
- [ ] silence/speech detection
- [ ] chat activity analysis
- [ ] technical issue detection
- [ ] audio problem detection
- [ ] stream quality checks
- [ ] scene suggestions
- [ ] context-aware ideas
- [ ] interesting moment detection
- [ ] post-stream summary

## Content intelligence
- [ ] VOD analysis
- [ ] clip candidates
- [ ] Short candidates
- [ ] title/description suggestions
- [ ] platform variants
- [ ] thumbnail briefs
- [ ] publishing recommendations
- [ ] content performance analysis

## Streamer memory / learning
- [ ] streamer profile
- [ ] long-term memory
- [ ] preferences
- [ ] historical outcomes
- [ ] experiment tracking
- [ ] evaluation cycle
- [ ] feedback loop

---

# 33 — AUTOMATION PLATFORM

`Trigger → Condition → Action → Result → Verify → Audit`

- [ ] scheduled automations
- [ ] event automations
- [ ] content workflows
- [ ] media workflows
- [ ] stream workflows
- [ ] notification workflows
- [ ] retry policy
- [ ] idempotency
- [ ] failure handling
- [ ] permissions
- [ ] audit

Queues/Durable Objects csak akkor, ha valós háttérfeladat vagy realtime követelmény indokolja.

---

# 34 — FOLYAMATOS FUNKCIÓFELFEDEZÉS

Ez a szakasz **nem lezárható egyszer és mindenkorra**.

Minden jelentős editor/platform bővítés előtt ellenőrizni kell:
- modern visual builder minták;
- GrapesJS / Craft.js / Puck architekturális minták;
- új responsive/layout megoldások;
- accessibility;
- performance;
- reusable components;
- design systems;
- collaboration/conflict;
- backup/recovery;
- AI action safety;
- stream/content intelligence.

Új funkció esetén:
1. azonosítás;
2. cél és felhasználási eset;
3. függőségek;
4. Page Model/adatmodell;
5. Command/Action;
6. Inspector/Canvas/UI;
7. persistence;
8. teszt;
9. MASTER-be felvétel;
10. implementáció;
11. felhasználói validáció.

---

# 35 — AKTUÁLIS ÁLLAPOT ÉS FOLYTATÁSI SZERZŐDÉS

## Lezárt, felhasználó által ellenőrzött jelenlegi pontok
- [x] E2 Core command/state tesztkapu: 12/12 PASS.
- [x] Geometry Inspector X/Y/width/height/position kézi szerkesztése.
- [x] Geometry változások Command API → Page Model → Canvas Engine lánca.
- [x] Geometry browser teszt: felhasználó visszajelzése: **„Működik”**.
- [x] 6.2 Geometry Inspector presets: mind az 5 felhasználói teszt PASS.
- [x] Elements panel alapfunkciók és kijelölés tesztelve.
- [x] Shell state persistence: felhasználói teszt PASS.
- [x] Panel collapse/reopen: felhasználói teszt PASS.
- [x] Panel width min/max: felhasználói teszt PASS.
- [x] Inspector kapcsolat 8.1–8.6: felhasználói tesztek PASS.

## JELENLEGI EGYETLEN AKTÍV PONT — EZT KELL FOLYTATNI
**10.1.2.2 — Rich Text strukturált Command + Validation runtime/integrációs teszt.**

A Diagnostics 9.1.1 runtime kapuja lezárva, a következő és egyetlen aktív tesztkapu a Rich Text strukturált modell integrációs tesztje.

**9.1.0 — Elements panel „elem hozzáadása” stabilizálás — IMPLEMENTÁLVA, FELHASZNÁLÓI TESZT HÁTRA**

Elkészült:
- Leaf elem kijelölése esetén az új elem nem a leaf node alá kerül, hanem automatikusan a legközelebbi érvényes szülőbe.
- Container jellegű kijelölés esetén az új elem továbbra is közvetlenül a kijelölt elem alá kerül.
- Az Elements palette korábbi `undefined` típusú bejegyzéseihez canonical node type értékek kerültek.
- Az add művelet továbbra is a meglévő `element.add` Command → Validation → History → Page Model láncot használja.

Implementációs commitok:
- app: `1bc79fde326890a75da5ac2dee6172adc42984fd`
- schema: `496b976af259e44f3ced9ad2bf1ef9c9fd23f23e`

Statikus visszaolvasás: PASS. A javítás után a palette csoportfejlécei láthatók, de a felhasználói visszajelzés alapján a kívánt alapállapot az, hogy a csoportok csukva legyenek; ezért a csoportok alapértelmezett állapotát visszaállítottuk `collapsed` értékre. A korábbi „teljesen eltűnt” problémát az okozta, hogy a panel/csoport láthatóságot összekevertük: a csoport fejlécének láthatónak kell maradnia, csak a benne lévő elemgombok legyenek csukva.
Felhasználói/runtime teszt még nincs, ezért `[x]` státusz nem adható.

Javító commitok:
- `257577335e046ddf8584ae832ed5f2f904554f9b` — palette csoportok láthatóvá tétele.
- `51a63531176f8f4a00eee378e3cce52cb03897f8` — csoportok csukott alapállapotának visszaállítása.

### ÚJ KÖVETELMÉNY — 9.1.0 elemkatalógus információs súgó
A felhasználó kéri, hogy az Elements palette minden hozzáadható elemgombján legyen egy kis **ⓘ információs ikon**, amely egyértelműen leírja, mi az adott elem és mire használható. Az ikon ne indítsa el az elem hozzáadását; a teljes elemgomb továbbra is hozzáadásra szolgál.

Első körben az Elements palette készül el. A szerkesztő egyéb gombjaihoz külön következő UX-lépésben készül ugyanilyen konzisztens információs súgó.

Követelmény: minden jelenleg támogatott palette elemhez legyen leírás; az információs UI ne fedje el tartósan a vásznat; billentyűzettel is elérhető legyen; a funkció ne vezessen be második state/command rendszert.

### 9.1.0 aktuális javítás — teljes érintett editor-kód audit + Elements info UI
A teljes releváns Editor v2 kódlánc újra lett nézve. A lista eltűnésének konkrét hibája megvan: a `renderPalette()` létrehozta a kategória `section` elemet, de nem fűzte hozzá az `#elementList` gyökérhez. Emiatt a DOM-ban létrejött elemek nem jelentek meg.

Javítások:
- `app.js`: `root.append(section)` visszaállítva;
- az Elements kategóriák továbbra is **csukott alapállapotból** indulnak;
- minden elemhez külön kis **ⓘ / i** gomb került;
- az i gomb nem ad hozzá elemet, hanem helyben megjeleníti az elem rövid leírását;
- minden jelenlegi palette elemhez leírás került, fallback szöveggel;
- CSS az info gombhoz és a leíráshoz hozzáadva;
- editor cache verzió frissítve.

Commitok:
- app: `b972d2a1ea281966a5387a7bc1ca07d662504dc6`
- CSS: `ffd57c6e1e4840def8d104428adf8f9b8b14f761`
- cache: `c4e8ef533c1302d4850bdfa993d59d2ebe8c9f7a`

Statikus visszaolvasás: PASS — `root.append(section)`, info vezérlő és leírás-adatmodell jelen van.
Felhasználói/runtime teszt még hátra. A szerkesztő többi gombjához tartozó i-súgó külön következő UX-lépés lesz, miután ez a palette tesztelve van.

### 9.1.0 — Elements palette javítás — syntax/runtime előellenőrzés
A frissítés után a böngésző az `app.js` betöltésekor syntax error-t jelzett: `app.js?v=20260918-8:10:492`.

A teljes érintett `app.js`-t újra átnéztük. A hiba oka a frissen hozzáadott `ELEMENT_DESCRIPTIONS` objektum néhány idézőjel nélküli, szóközt vagy `/` jelet tartalmazó kulcsa volt (pl. `Rich Text`, `Social Links`, `Badge/Tag`, `Business Contact`, `About Me`, `Sanci Button`). Emellett a fájlban egy literal `\\n` került a `const groups` elé.

Javítás:
- az érintett leírás-kulcsok érvényes string kulcsokká lettek alakítva;
- a hibás literal sortörés normalizálva lett;
- csak az `app.js` módosult, a működési logika nem lett újraépítve.

Javító commit:
- app: `0536aedc45d3963bc7ebcf9f8d3581d2958755ca`
- app content SHA: `bb35e394cca4edb9f13ee2e3719f72c02bfb7855`

A user által jelzett hiba alapján az előző változat **nem tekinthető teszteltnek**. A jelenlegi változatnál először a böngészős betöltést és az Elements panel megjelenését kell ellenőrizni.

### 9.1.0 — Elements palette második syntax hiba javítva
A felhasználó újabb betöltési hibát jelzett: `app.js?v=20260918-8:10:1702`.

A teljes aktuális `app.js` 10. sorát újraellenőrizve a hiba oka az `ELEMENT_DESCRIPTIONS` objektumban maradt, szóközt tartalmazó, idézőjel nélküli kulcsok voltak, többek között `Élő állapot`, `Stream számláló`, `Játékkártya`, `Játéklista`, `Egyedi elem` és hasonló kulcsok. Ezek JavaScript objektumkulcsként így syntax error-t okoztak.
Javítás:
- minden érintett, szóközt tartalmazó kulcs érvényes string kulccsá alakítva;
- működési logika nem változott;
- app.js frissített tartalma visszaolvasva: a leírásobjektum szintaktikailag konzisztens.

Javító commit:
- app: `487cee39dd89e2eb1ece26304294dce49d64770b`
- app content SHA: `40f8180d727d4d6ca70b3614cb5644511f17043b`

A következő lépés előtt a böngészős betöltés és az Elements panel runtime ellenőrzése szükséges. A korábbi syntax hiba miatt a palette funkció még nem tekinthető felhasználó által lezártnak.

### Egyetlen aktuális teszt
1. frissítsd az editor oldalt teljes újratöltéssel;
2. ellenőrizd, hogy az `app.js` már nem ad syntax error-t;
3. nyisd meg az **Elemek** panelt: a kategóriafejlécek látszanak, alapból csukva;
4. nyiss ki egy kategóriát: az elemek jelenjenek meg;
5. az elemgombok mellett legyen kis **i** ikon;
6. az **i** megnyomása leírást mutasson, és ne adjon hozzá elemet;
7. az elemgomb továbbra is adjon hozzá elemet;
8. jelezd, hogy működik-e. **Más tesztre addig nem lépünk tovább.**


### 9.1.0 — Elements palette: üres lista javítása
A felhasználó jelezte, hogy az editor már betölt, de az Elemek listában nem jelentek meg elemek.

Újraellenőrzés alapján a palette renderelését robusztusabbá tettem:
- a meglévő `groups` típusértéket közvetlenül használja, nem csak a név alapján történő visszakeresést;
- hiányzó típus esetén továbbra is használható a `typeForElement()` fallback;
- az `#elementList` hiányát külön `SANCI-UI-E002` hibakóddal jelzi;
- ha egyetlen érvényes elem sem kerül a listába, `SANCI-UI-E003` diagnosztikai hibát ad;
- az elemek kategóriánként továbbra is csukva indulnak;
- az i súgó és az elem hozzáadása logikája változatlan.

Javító commit:
- app: `b02e05a5309cb4f7d1321f9655bfe1e8ba27f30a`
- content SHA: `570d586fd4d17f2d059749757f87737df6502689`

A következő egyetlen aktív pont továbbra is a runtime ellenőrzés.

### 9.1.0 — Rich Text elem hozzáadásának javítása

A felhasználói teszt során az Elements palette többi eleme hozzáadható volt, de a **Rich Text** elem nem. A teljes Command/Schema lánc ellenőrzése alapján a konkrét ok:

- az `element.add` generic `createNode()` útvonalon hozta létre a Rich Text node-ot;
- a Rich Text node így nem kapott `props.richText` canonical dokumentumot;
- a 10.1.2.2-ben bevezetett Rich Text validation ezt helyesen elutasította;
- tehát nem a palette típusa vagy a szülőválasztás volt hibás, hanem a Rich Text node létrehozása nem követte az új canonical adatmodellt.

Javítás:
- `commands.js`: az `element.add` Rich Text esetén automatikusan létrehozza a `createEmptyRichText()` canonical dokumentumot;
- a művelet továbbra is ugyanazon `Command → Validation → Page Model → History → Canvas → Persistence` láncot használja;
- a többi elem hozzáadási útvonala változatlan;
- editor cache frissítve.

Javító commitok:
- commands: `23faaf85a32cc8add77f4fc1158202c862850656`
- commands content SHA: `637f43440e6c036acce26aeb83ea7c61b40e2a50`
- cache/index: `a54aa07a29e4b7f7c6e880db04428a4bc8422aa1`
- index content SHA: `8c4e5217d666beadace0e29c3905282395d244f4`

Statikus visszaolvasás: PASS.
Felhasználói/runtime teszt még hátra.

### 9.1.0 — Elements palette „elem hozzáadása” — LEZÁRVA
**Felhasználói teszt:** PASS — a felhasználó visszajelzése: **„Működik”**.

Ellenőrzött:
- Elements kategóriák megjelenése;
- kategóriák csukott alapállapota;
- elemek hozzáadása;
- Rich Text hozzáadása;
- Rich Text automatikus canonical üres dokumentuma;
- elem kijelölése hozzáadás után.

A Rich Text hozzáadási hibát a `element.add` Command javításával oldottuk meg: Rich Text node létrehozásakor automatikusan létrejön a `createEmptyRichText()` dokumentum.

Kapcsolódó javító commitok:
- commands: `23faaf85a32cc8add77f4fc1158202c862850656`
- cache/index: `a54aa07a29e4b7f7c6e880db04428a4bc8422aa1`

**Státusz:** `[x]`.

### KÖVETKEZŐ EGYETLEN AKTÍV PONT — 10.1.2.2 Rich Text strukturált Command + Validation runtime teszt
Most már visszatérünk a Rich Text rendszer integrációs tesztjéhez. UI-t még nem építünk.

Tesztelendő sorrend:
1. létrehozott Rich Text node canonical modellje;
2. strukturált Rich Text tartalom beállítása;
3. valid modell elfogadása;
4. invalid modell elutasítása;
5. rollback;
6. Undo;
7. Redo;
8. mentés/reload;
9. Canvas render;
10. user confirmation.

**Más fejlesztési pontra addig nem lépünk tovább, amíg ez a tesztkapu nincs lezárva.**


### 9.1.2 — Diagnostics műveleti eredményellenőrző réteg — LEZÁRVA

Cél: a Diagnostics ne csak tényleges JavaScript/Command/API/UI hibákat jelezzen, hanem az olyan „csendes” hibákat is, amikor egy felhasználói művelet lefutónak tűnik, de a várt eredmény nem jön létre.

Alapelv:
- a Diagnostics továbbra is csak megfigyelő/ellenőrző réteg;
- nem hoz létre második state-, Page Model-, selection-, history- vagy command-rendszert;
- az ellenőrzés a meglévő Command → Validation → Page Model → History → Canvas → Persistence lánc eredményét vizsgálja;
- a hibák egyedi `SANCI-VERIFY-E...` kódot kapnak.

Első célzott művelet: **Elem hozzáadása**.

Implementáció:
- `diagnostics.verify()` ellenőrző primitive elkészült;
- az `element.add` művelet ellenőrzése bekötve;
- a létrejött node Page Model-helye és a Canvas-megjelenés ellenőrzése megtörténik;
- eltérés esetén `SANCI-VERIFY-E001/E002` kerül a Diagnosticsba;
- a megoldás nem vezet be második state-, selection-, history- vagy command-rendszert.

Implementációs commitok:
- diagnostics verification primitive: `b7549eeddacb9f91f805c178f0d17673f8168bf0`
- Elem hozzáadása eredményellenőrzés: `3750944f90e559640a3827fd93f76e5723701b39`

### Runtime teszt eredménye — PASS
A felhasználó normál elem hozzáadását ellenőrizte.

Ellenőrzött:
- az elem hozzáadása sikeresen lefutott;
- az elem megjelent a Canvason;
- az elem kijelölődött;
- a Diagnostics nem jelzett hibát: `✓ 0 hiba`.

**Felhasználói visszaigazolás:** „Jó”.

A normál `element.add` műveleti eredményellenőrzés így lezárható. A szándékosan hibás/hiányos eredmény szimulációja továbbra is későbbi verification-regressziós tesztként marad, nem blokkolja a következő Rich Text tesztkaput.

**Státusz:** [x].

**KÖVETKEZŐ ÉS EGYETLEN AKTÍV PONT:** **10.1.2.2 — Rich Text strukturált Command + Validation runtime/integrációs teszt**, pontosan onnan folytatva, ahol a Diagnostics kiegészítése előtt abbahagytuk. UI-t még nem építünk.

### 9.1.1 — Editor Diagnostics / automatikus hibakereső — LEZÁRVA
A felhasználó kérésére elkészült az Editor v2 első automatikus hibakereső rendszere.

Cél: ha az editorban JavaScript, Promise, Command, API vagy UI hiba történik, azonnal legyen látható egy egyedi hibakód és részletes technikai információ.

Architektúra:
- a Diagnostics csak megfigyelő/reporting réteg;
- nem hoz létre második Page Model-, selection-, history- vagy command-rendszert;
- az adatok átmeneti, böngészőben élő diagnostics listában vannak;
- a canonical editor state továbbra is változatlan marad.

Elkészült:
- `public/editor-v2/diagnostics.js`: strukturált hibarekordok, kódok, forrás, üzenet, fájl/sor/oszlop, technikai részletek;
- automatikus JavaScript runtime error és unhandled Promise rejection figyelés;
- látható `✓ 0 hiba` / `🔴 N hiba` jelző;
- részletes hibapanel;
- technikai részletek lenyitható nézetben;
- Másolás és Törlés művelet;
- Command hibák jelentése: `SANCI-CMD-E001`;
- API hibák jelentése: `SANCI-API-E001/E002`;
- UI hibák jelentése: `SANCI-UI-E001`;
- korai boot/module hibák továbbítása a diagnostics rendszerbe: `SANCI-BOOT-E001`;
- `boot.js` korai hibapuffert is használ, így az app modul elindulása előtti hibák sem vesznek el;
- diagnostics UI desktop és mobile nézetre is kapott saját CSS-t;
- app/index cache verzió frissítve.

Commitok:
- diagnostics: `2106b7f8d0a2b386bc1bdd519c63db3feb6b2eca`
- boot: `edf97107b27b7968092ed6c08f4307500d318b20`
- app: `f533d718138da5f65dd86b12427cfb88b2504b4e`
- CSS: `70833b8e46b8f19bb0585eebad06d6e384fde8d5`
- cache/index: `bbfc000aaab310db1596f07232266604400159b1`

Statikus visszaolvasás: PASS.
- diagnostics modul: PASS;
- boot error bridge: PASS;
- app Command/API/UI diagnostics bekötés: PASS;
- diagnostics CSS: PASS;
- app cache: PASS.

Runtime teszt: PASS. A felhasználó visszaigazolta a működést.

**Felhasználói/runtime teszt eredménye:** PASS.
- `✓ 0 hiba` állapot megjelenik;
- a diagnosztikai panel megnyitható;
- a kontrollált teszthiba `SANCI-TEST-E001` hibakóddal megjelent;
- a hibaszámláló `🔴 1 hiba` állapotra váltott;
- a hibarekord technikai részletei megjeleníthetők;
- a teszt után a fejlesztői tesztgomb eltávolításra került, így production használatban nincs tesztvezérlő.

Kapcsolódó utolsó teszt/cleanup commitok:
- query/hash tesztút javítás: `706f5659579be521db9fc524050dc69a1e6f4c74`
- kontrollált runtime tesztvezérlő: `21dd1d619a89b1129b0b98639c6b3a871925bb82`
- tesztvezérlő eltávolítása: `c3534aa5501a94adb1da135863ba8e5600db5142`

**Státusz:** `[x]`.

**Következő egyetlen aktív pont:** 10.1.2.2 — Rich Text strukturált Command + Validation runtime/integrációs teszt. A diagnostics pont lezárva; UI-t továbbra sem építünk a Rich Text tesztkapu lezárása előtt.
### Egyetlen aktuális teszt — Elements syntax fix + Diagnostics első runtime kapu
1. teljesen töltsd újra az Editor v2 oldalt;
2. ellenőrizd, hogy nincs `app.js:10:1702` syntax error és az editor betölt;
3. az Elements panel kategóriafejlécei látszódjanak és alapból csukva legyenek;
4. nyiss ki egy kategóriát, majd ellenőrizd az i súgót és egy elem hozzáadását;
5. az editor jobb alsó részén legyen `✓ 0 hiba`;
6. ha szándékosan hibát okozunk a következő tesztlépésben, a panelben egyedi `SANCI-...` kód jelenjen meg.

**Más fejlesztési pontra addig nem lépünk tovább, amíg ezt a runtime kaput és a felhasználói visszaigazolást nem zártuk le.**

### 10.1.1 — Plain Text Content UI — LEZÁRVA
**Felhasználói teszt:** PASS — „Működik”. Canvas, Undo, Redo és mentés/reload ellenőrzése sikeres.
**Állapot:** `[x]`.

### 10.1.2 — Rich Text Content rendszer audit — AUDIT LEZÁRVA
**Audit eredmény:** PASS, de a jelenlegi rendszerben **valódi Rich Text még nincs implementálva**.

**Vizsgált fájlok:**
- `public/editor-v2/app.js`
- `public/editor-v2/core/commands.js`
- `public/editor-v2/core/schema.js`
- `public/editor-v2/core/validation.js`

**Megállapítások:**
- A Page Modelben külön `richtext` node type létezik.
- A node `props` szabad struktúrájú, ezért a Rich Text adatmodell technikailag bővíthető, de jelenleg nincs meghatározott Rich Text dokumentumstruktúra.
- Az `element.content.set` jelenleg a `richtext` típust a plain text típusokkal együtt kezeli, és egyszerű stringet ír `props.text` + `props.content` mezőbe.
- A Canvas jelenlegi editor renderere a `richtext` tartalmat `textContent` segítségével jeleníti meg, ezért formázott inline tartalom, link, lista stb. nem tud megjelenni.
- Nincs `contenteditable`, Rich Text toolbar, inline mark/node modell vagy Rich Text-specifikus validation.
- A history/revision/dirty lánc megfelelően központi: a Rich Text jövőbeli módosítását ugyanazon `element.content.set`/új Rich Text command láncban kell tartani.
- A mentés az egész canonical `state.document` objektumot küldi a `/api/admin/editor` végpontra, ezért a Rich Text adatmodell ugyanazon persistence láncon menthető.
- A jelenlegi schema/validation nem kényszerít Rich Text formátumot, ezért az új modellhez célzott validáció szükséges.

**Architekturális döntés:** nem vezetünk be HTML-string alapú Rich Text source-of-truth rendszert. A Rich Text canonical tartalma strukturált dokumentum lesz; a Canvas renderer ebből generálja a megjelenítést. A HTML/DOM csak renderelt eredmény.

**10.1.2.1 — Rich Text canonical adatmodell — LEZÁRVA**

**Döntés:** a Rich Text canonical source-of-truth egy strukturált, JSON-alapú dokumentum lesz a node props.richText mezőjében. HTML-string nem kerül canonical tárolásba.

### Canonical Rich Text shape
- props.richText.schemaVersion: jelenleg 1.
- props.richText.type: richtext-document.
- props.richText.blocks: sorrendben tárolt blokk-node-ok.
- Egy blokk minimális alakja:
  - type: pl. paragraph, heading, quote, code, list;
  - children: inline-node lista.
- Egy inline text-node minimális alakja:
  - type: text;
  - text: string;
  - marks: tömb, pl. bold, italic, underline, strike, code;
  - opcionális strukturált link: href, target, rel, title.
- A lista és hasonló összetett blokkok saját children/items struktúrát használhatnak; ezt célzott schema/validation szabályok védik.
- Üres dokumentum érvényes reprezentációja: legalább egy üres paragraph blokk, egy üres text inline-node-dal.

### Canonicalizálási szabályok
- A formázás nem HTML-ben és nem DOM-ban tárolódik.
- A renderer a strukturált dokumentumból állít elő DOM-ot.
- A DOM/HTML csak renderelt eredmény vagy import/export formátum lehet.
- A Rich Text dokumentum stabil, sorrendérzékeny struktúra; a UI nem tárolhat külön másolatot source-of-truthként.
- Ismeretlen blokk/mark típus mentés előtt validation hibát okoz, nem csendes fallbacket.
- href/link adatok strukturált mezők; nyers HTML beszúrás nem része a canonical modellnek.
- A dokumentum verziózása a Rich Text saját schemaVersion mezőjén keresztül történik, és a jövőbeli migrációk explicit mappinggel készülnek.

### Tervezett Command-lánc
A későbbi implementáció továbbra is a központi láncot használja:
Rich Text UI → Command → Validation → Page Model → History → Canvas Renderer → Persistence.
A meglévő element.content.set parancsot nem használjuk HTML-string tárolására. A Rich Text számára strukturált content command/action készül, amikor a 10.1.2.2 implementáció megkezdődik.

### Tervezett támogatási minimum
Első Rich Text implementáció:
- paragraph;
- H1–H6 heading;
- bold;
- italic;
- underline;
- strike;
- inline code;
- link;
- bulleted list;
- numbered list;
- blockquote;
- code block;
- hard/soft line break kezelése;
- üres állapot és normalizálás.

Későbbi bővítésként külön kezelhető:
- text color/highlight;
- alignment;
- nested lists;
- mentions;
- inline media;
- tables;
- embeds;
- custom marks/nodes.

### Kötelező validation
A Rich Text validationnek ellenőriznie kell:
1. root/type/schemaVersion;
2. blocks tömböt;
3. megengedett block-típusokat;
4. blokk-specifikus kötelező mezőket;
5. inline-node típust és text értéket;
6. markok engedélyezett készletét;
7. link URL/target/rel mezőket;
8. tiltott/érvénytelen HTML vagy ismeretlen struktúra ne kerülhessen canonical state-be;
9. normalizálható hibák esetén determinisztikus normalizálást;
10. nem javítható hibánál teljes command rollbacket.

### Tesztkapu a következő implementációs ponthoz
A 10.1.2.2 pontban külön tesztelendő:
- modell létrehozása;
- plain → Rich Text átmenet;
- inline markok;
- link;
- listák;
- blockquote/code;
- Undo/Redo;
- save/reload;
- Canvas render;
- invalid document rejection;
- schema migration alap;
- desktop/tablet/mobile;
- user confirmation.

**10.1.2.1 eredménye:** a canonical Rich Text adatmodell és a hozzá tartozó architekturális/validációs szabályok rögzítve. UI és HTML/DOM szerkesztés még nem implementált.

**10.1.2.2 — Rich Text strukturált Command + Validation implementáció — IMPLEMENTÁLVA, INTEGRÁCIÓS TESZT MÉG HÁTRA**

Elkészült:
- schema.js: Rich Text schema constants, üres dokumentum factory és determinisztikus normalizáló.
- validation.js: célzott Rich Text node validation bekötve a canonical document validationba.
- commands.js: új richtext.content.set strukturált command.
- A régi element.content.set Rich Text node-on szándékosan blokkol, hogy ne maradjon HTML/string alapú kerülőút.
- A strukturált command ugyanazon commit → validation → history → revision/dirty láncot használja.
- Ismeretlen block/mark, hibás heading/list/link/inline adat esetén a command hibával leáll és rollbackel.

Implementációs commitok:
- schema: 68506150bbbd1b9f512157e0088a39424e95518f
- validation: 7e6ba6e14a1ec487dc9d88ab5ccd787c7f4eb136
- commands: 466f81f2113cbab0ba5b1d5d6e8f9a6e0af6a215

Statikus visszaolvasás: PASS.
Még nincs felhasználói/runtime teszt, ezért a pont nem [x].

**10.1.2.2 runtime/integrációs teszt — [~] RICH TEXT LÉTREHOZÁS PASS, A TOVÁBBI RUNTIME TESZTEK FOLYAMATBAN**

Automatizált core tesztek:
- Rich Text canonical node létrehozása és valid strukturált módosítása;
- heading/mark/link/list/quote/code adatok megőrzése;
- invalid Rich Text elutasítása;
- pontos document rollback és history-változatlanság hibánál;
- Undo/Redo exact structured document visszaállítása.

A korábbi teszt assertion-hibája javítva lett:
- hibás elvárás: `items[0].children[0]`;
- helyes normalizált forma: `items[0][0]`;
- javító commit: `11d8121acb312614f4824ca293688596710de2f1`.

**Felhasználói runtime teszt — PASS:**
- Editor megnyitása;
- Elements panel → Rich Text;
- Rich Text node létrejött;
- Canvason megjelent;
- kijelölődött;
- a művelet nem jelzett Diagnostics hibát.

**Felhasználói visszaigazolás:** „Működik”.

A teljes 10.1.2.2 kapu még nem zárható le, mert hátra van:
1. strukturált Rich Text tartalom módosítása;
2. valid modell elfogadása;
3. invalid tartalom elutasítása + rollback;
4. Undo;
5. Redo;
6. mentés/reload;
7. Canvas render ellenőrzése strukturált tartalommal;
8. desktop/tablet/mobile regresszió;
9. teljes user confirmation.

A Node.js 20 deprecation warning dokumentált, de nem a Rich Text implementáció hibája; a korábbi futás Node 24.20.0-val történt.

**Frissített runtime eredmény — strukturált Rich Text módosítási útvonal javítása:**

A felhasználói teszt során a Rich Text Inspector tartalommezője még a generic `element.content.set` commandot hívta. A központi command réteg ezt szándékosan elutasította `SANCI-CMD-E001: Use richtext.content.set for Rich Text` hibával.

Javítás:
- `public/editor-v2/app.js`: Rich Text esetén a Content Inspector most kizárólag a `richtext.content.set` commandot használja.
- `public/editor-v2/core/richtext-editor.js`: létrejött egy kis adapter, amely a felhasználó által megadott egyszerű szöveget canonical Rich Text dokumentummá alakítja; több sor külön paragraph blokkot kap.
- A canonical source-of-truth továbbra is `node.props.richText`.
- Nem jött létre második command/state/history rendszer.

Javító commitok:
- app: `0ea8afa9fb7ac132358a875b33e5c12c5f798539`
- Rich Text adapter: `5ca7b0a64035bb0998e3249944651a48961963fd`

**Új runtime eredmény:** a Rich Text tartalom módosítása a Command rétegen már lefutott, de a Canvas nem jelenítette meg a canonical `props.richText` dokumentumot. A renderer továbbra is a régi `props.text/content` mezőt olvasta, ezért a módosítás csendes megjelenítési hibát okozott.

Javítás:
- `public/editor-v2/app.js`: a Rich Text node most a canonical `props.richText` strukturált dokumentumból renderel.
- támogatott alap render: paragraph, heading, quote, code, bulleted-list, numbered-list, valamint bold/italic inline megjelenítés.- a Rich Text Inspector továbbra is `richtext.content.set` commandot használ.
- a canonical Page Model nem változott; nincs második renderer/state/command rendszer.

Javító commitok:
- renderer első implementáció: `8916fdd9524bc0c95c9d91893bf0936332fe316a`
- renderer inline-node javítás: `2ec066e304bf8e400a34e39b882088a47d42d3db`

**Hiba állapota:** a renderer javítása után a felhasználói újrateszt PASS.

**Felhasználói visszaigazolás:** „Működik”.

Ellenőrzött:
1. Rich Text kijelölve maradt;
2. Inspector → Content;
3. `Sanci9517 Rich Text teszt` tartalom beírása;
4. a módosítás elfogadásra került;
5. a canonical Rich Text tartalom megjelent a Canvason;
6. Diagnostics nem jelzett hibát: `✓ 0 hiba`.

A korábbi silent render hibát ezzel lezártuk: a Command → Page Model → Canvas útvonal jelen tesztesetben működik.

**10.1.2.2 következő tesztkapuja:** strukturált/érvénytelen Rich Text tartalom kezelése. Ezt külön, egyetlen aktív tesztként kell folytatni; Undo/Redo, save/reload és responsive regresszió még nem tesztelendő.

**MASTER állapotfrissítés:** a Rich Text egyszerű tartalom-módosítási runtime teszt lezárva PASS állapotban.

**Új runtime teszt — valid strukturált Rich Text (paragraph blokkok): PASS**

A felhasználó a Rich Text multiline Inspector mezőjében három külön sort adott meg:
- `Sanci9517`
- `Rich Text teszt`
- `Ez egy harmadik sor.`

Ellenőrzött:
1. mindhárom sor külön sorban megjelenik;
2. a Canvas mindhárom sort megjeleníti;
3. a tartalom az Inspectorban megmarad;
4. Diagnostics állapot: `✓ 0 hiba`;
5. a három sor a canonical Rich Text modellen belül külön paragraph blokkokként kezelhető.

**Felhasználói visszaigazolás:** „Működik”.

Ez a teszt lezárta a valid, többblokkos/paragraph-alapú Rich Text megjelenítés alap runtime kapuját. A Rich Text formázott elemei (heading, bold, italic, underline, strike, inline code, link, listák, blockquote, code block) külön tesztelendők.

**EGYETLEN AKTUÁLIS FOLYTATÁSI PONT:** 10.1.2.2 — Rich Text formázó UI iparági minta szerinti ki/be kapcsolható markok runtime tesztje. Benchmark alapján a Tiptap/Slate és WordPress/Gutenberg Rich Text toolbarjai a B/I formázást valódi toggle-ként kezelik, és aktív állapotot vizuálisan jelzik; a formázás a kijelölt szövegrészre vonatkozik. Ennek megfelelően a saját canonical JSON modellben a B/I most ugyanazon toggleRichTextMark útvonalon működik: kijelölt rész esetén csak a kijelölt tartományt módosítja, kijelölés nélkül az aktuális sort; ha a teljes cél-tartomány már formázott, a következő kattintás eltávolítja a markot. Az Inspector toolbar a B/I aktív állapotát is mutatja. Új helper: isRichTextMarkActive. Automatikus core teszt is hozzáadva a ki/be kapcsolásra és aktív állapot ellenőrzésére. A kód elkészült, runtime felhasználói teszt még nincs lezárva. A felhasználó jelezte, hogy a következő lépésben kifejezetten a teszteléssel folytatjuk. Következő és egyetlen teszt: frissítés után Rich Text → egy sor kijelölése → B → látható félkövér + B aktív állapot → B újra → félkövér eltűnik + B inaktív állapot; ugyanez I-vel. Diagnostics maradjon ✓ 0 hiba. Undo/Redo, save/reload és responsive regresszió továbbra sem tesztelendő ebben a lépésben.

**10.1.2.2 — Rich Text formázó UI benchmark + toggle javítás — IMPLEMENTÁLVA, RUNTIME TESZT HÁTRA**

Benchmark megállapítás:
- Tiptap: a toolbar gombok toggleBold() / toggleItalic() műveletet használnak, és isActive() alapján aktív állapotot jeleznek.
- WordPress/Gutenberg: a RichText formázó gombok kijelölt szövegrészre alkalmazhatók, a formátum binary/toggle jellegű, és az aktív állapotot a toolbar is jelzi.
- Következtetés: a jelenlegi Sanci UI korábbi állapota nem volt elég jó, mert az I gomb csak hozzáadta az italic markot, a B pedig nem rendelkezett látható active state-tel.

Kódjavítás:
- public/editor-v2/core/richtext-editor.js: közös inline-bejárás; toggleRichTextMark() most valódi ki/be kapcsolás; isRichTextMarkActive() hozzáadva.
- public/editor-v2/app.js: B és I ugyanazt a toggle command-előkészítést használja; kijelölt szövegrész formázása támogatott; kijelölés nélkül az aktuális sor a cél; B/I aktív állapot vizuálisan frissül és a kijelölés a render után visszaáll.
- public/editor-v2/editor.css: aktív B/I toolbar állapot.
- public/editor-v2/index.html: CSS cache verzió frissítve.
- public/editor-v2/tests/core.test.js: automatikus B/I toggle + active-state teszt.

Commitok:
- rich text toggle: 4262c63d67ceb334ca98a196959895da52446e33
- app toolbar: 37f8fa8f5d254642e3b5a94dd11ed2382d6b154d
- document shadowing fix: bd2a4c213221f64c8067c2055b863cf5de1d16c7
- active CSS: 96d9017f7cb563ce42baacec83109dd50ac0bb6e
- CSS cache: a158024158ac60894685264a1b010aa8394080a0
- core test: 4643406d7284231458fe404b6213eafb1c329800

Tesztállapot: statikus kódútvonal PASS; automatikus teszt és böngészős runtime még ellenőrizendő. A pont [~], nem [x].

**TESZTELÉSI FOLYTATÁS RÖGZÍTVE:**
A következő munkamenetben kizárólag a 10.1.2.2 Rich Text B/I toggle runtime tesztet végezzük. Fejlesztési pontot nem nyitunk, amíg a felhasználó nem jelzi a teszt eredményét. Tesztelendő: B kijelölt szövegen ki/be, B aktív/inaktív vizuális állapot, I ugyanez, Canvas megjelenés, Diagnostics `✓ 0 hiba`. Sikertelenségnél nem lépünk tovább; előbb a hibás réteget auditáljuk és a MASTER-t újra frissítjük.

**Frissen feltárt editor library/add problémagyanú:** a jelenlegi `renderPalette()` mindig a kijelölt node-ot használja új elem szülőjeként. Leaf elem kijelölésekor ezért az új elem hozzáadása `Invalid parent for element` hibával leállhat. Emellett az Elements listában vannak olyan bejegyzések, amelyekhez jelenleg nincs `NODE_TYPES` érték (ezek `undefined` típussal nem adhatók hozzá). Ezt a hibát a Rich Text runtime teszt előtt külön javítási lépésként kell kezelni, mert közvetlenül érinti az Elements panel alapműködését.

**Audit/specifikáció dátuma:** 2026-09-18.
# 36 — TERVKARBANTARTÁS

- Ez az egyetlen aktív terv.
- Minden új funkció ide kerül.
- Minden státuszváltozás ide kerül.
- A napi fejlesztési állapot nem külön tervfájlban él.
- A részletes régi tervek csak archív referenciák.
- Ha két archív dokumentum ellentmond, ez a MASTER és a ténylegesen tesztelt jelenlegi kód az irányadó.
- Régi `[x]` státusz csak akkor érvényes, ha a jelenlegi rendszerben a funkció ténylegesen megvan és a MASTER-ben vagy a jelenlegi tesztállapotban igazolható.
- Ha egy korábbi terv kipipált valamit, de a jelenlegi kódban nincs meg, úgy kezeljük, mintha nem lett volna elkészítve.
- A terv nem szűkíti a végleges editor célját: új funkciók folyamatosan hozzáadhatók.

---

# 37 — ARCHÍV REFERENCIÁK

A korábbi tervfájlok archivált tudásanyagként maradnak meg, de **nem ezekből folytatjuk a fejlesztést**.

Archivált dokumentumok:
- `docs/archive/plans/MASTER-CURRENT-STATUS.md`
- `docs/archive/plans/MASTER-FINAL-ROADMAP.md`
- `docs/archive/plans/SANCI-MASTER-PLAN.md`
- `docs/archive/plans/ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md`
- `docs/archive/plans/V2-BLUEPRINT.md`
- `docs/archive/plans/PLAN-AMENDMENT-EDITOR-UNIFICATION.md`
- `docs/archive/plans/VISUAL-EDITOR-ARCHITECTURE.md`
- `docs/archive/plans/visual-editor-roadmap.md`

Az aktív terv kizárólag:
- `docs/MASTER-DEVELOPMENT-PLAN.md`

---

# 38 — VÉGLEGES CÉL

**Egy Sanci Brand + egy Page Model + egy Editor + egy Renderer + egy szerveroldali tartalomlánc + egy központi Command/Action rendszer.**

A rendszer később képes legyen a lehető legrészletesebb weboldal-szerkesztőként működni: pixelpontos layout, responsive design, components, templates, design tokens, dynamic data, integrations, interactions, animation, accessibility, SEO, analytics, collaboration/recovery, automation és AI ugyanarra a strukturált alapra építve.

A fejlesztés nem egyszeri projektlezárás: **folyamatos funkcióbővítés**, ahol minden új igény először a MASTER tervbe kerül, majd ugyanazon ellenőrzött fejlesztési cikluson megy végig.

# 39 — 10.1.2.2 RICH TEXT FORMÁZÁS — MÉLYDIAGNOSZTIKA

**Állapot:** [!] A jelenlegi B/I implementáció runtime viselkedése hibás. A felhasználói teszt alapján a kijelölt szövegrész helyett a teljes sor/inline blokk kapja a markot, és a félkövér vizuálisan nem jelenik meg megbízhatóan. Ezért a korábbi 10.1.2.2 runtime teszt nem zárható le.

**Kód-audit eredménye:**

1. **Biztosan azonosított fő hiba — nincs inline node split a kijelölés határainál.**
   - A toggleRichTextMark() a meglévő inline node-okat járja be.
   - Ha a kijelölés csak az inline node egy részét fedi le, a jelenlegi kód az egész inline node marks tömbjét módosítja.
   - Példa: Sanci9517 esetén San kijelölésekor nem San[bold] + ci9517 jön létre, hanem az egész Sanci9517 inline node kapja a bold markot.
   - Ez közvetlenül magyarázza a „kijelölésnél az egész sort alakítja” hibát.

2. **Második valószínű hiba — a toolbar nem védi a kijelölést a fókuszvesztéstől.**
   - A B/I gombok jelenleg onclick eseményre dolgoznak.
   - Modern Rich Text editorok toolbar gombjai pointer/mousedown default viselkedését megakadályozzák, hogy a toolbar ne vegye el a fókuszt és ne omoljon össze a selection a formázás előtt.
   - A jelenlegi textarea-alapú megoldás selectionStart/selectionEnd értékeket használ, ezért ez nem feltétlenül minden esetben okozza a hibát, de a selection kezelése stabilizálandó.

3. **Harmadik vizsgálati pont — félkövér Canvas render.**
   - A canonical renderer már strong elemet, richtext-mark-bold class-t és font-weight:700 inline style-t alkalmaz.
   - A CSS-ben szintén explicit font-weight:700 !important van.
   - Emiatt a „B nem látszik” problémát nem szabad újabb vak CSS-módosítással javítani.
   - A következő javításban ellenőrizni kell a teljes láncot: canonical marks → létrejött DOM elem → class/style → tényleges computed fontWeight.
   - Ha a mark a Page Modelben bold, de a DOM/computed style nem 700, renderer/CSS probléma; ha a Page Modelben nincs bold, command/selection probléma.

4. **Architekturális döntés.**
   - Nem vezetünk be második Rich Text state-et.
   - Nem tárolunk HTML-t source-of-truthként.
   - A canonical JSON marad az egyetlen forrás.
   - A javítás lánca: Rich Text selection → mark transformation → Command → Validation → Page Model → History → Canvas Renderer → Persistence.

**Kötelező javítási sorrend:**
1. pontos inline range-splitting megvalósítása, amely a kijelölt tartományt leválasztja az inline node-on belül, és az eredeti mark/link adatokat megőrzi;
2. toolbar pointer/mousedown selection-lock;
3. B/I active-state újraellenőrzése a tényleges kijelölt tartomány alapján;
4. Canvas DOM/computed-style ellenőrzés a félkövér vizuális hibára;
5. célzott automatikus tesztek: részleges kijelölés csak a kijelölt karakterekre alkalmazza a boldot; részleges kijelölés csak a kijelölt karakterekről veszi le; selection két inline node-on át; meglévő italic/link markok megőrzése; B/I active state; canonical validation;
6. ezután ugyanazon browser runtime teszt újra.

**Teszthatár:** Undo/Redo, save/reload és responsive regresszió továbbra sem része ennek az egyetlen javítási kapunak.

**Egyetlen aktuális folytatási pont:** a Rich Text inline selection/mark transzformáció javítása és utána ugyanennek a B/I runtime tesztnek az ismétlése.

**Benchmark:** Tiptap/Slate/tldraw dokumentáció alapján a markok kijelölt tartományra kerülnek, toggle-ként működnek, az active state a selection alapján frissül, és a toolbar pointerdown/default viselkedését a selection megőrzése érdekében kezelik.


## 10.1.2.2 javítási napló — inline selection range split
**Állapot:** `[~]` Kódjavítás elkészült, runtime még nincs lezárva.

- A fő hibát azonosítottuk: a korábbi `toggleRichTextMark()` az egész inline node marks tömbjét módosította, ha a kijelölés csak az inline node egy részére esett.
- Javítás: az inline node a kijelölés elején/végén feldarabolódik; csak a középső kijelölt rész kapja/veszíti el a markot; a külső részek és meglévő link/egyéb markok megmaradnak.
- A toolbar B/I gombok `mousedown` alatt megakadályozzák a fókuszvesztést, hogy a textarea selection stabil maradjon.
- Új automatikus tesztek: részleges kijelölés split, részleges mark eltávolítás, meglévő italic + link megőrzése.
- A Canvas renderer kódját is visszaellenőriztük: bold esetén `strong` + `richtext-mark-bold` + inline `fontWeight=700` készül. A vizuális hibát runtime DOM/computed-style teszttel kell még bizonyítani.
- GitHub Actions eredménye ehhez a commitfolyamhoz jelenleg nem igazolt; nem tekintjük automatikusan sikeresnek.

**Legutóbbi implementációs commitok:**
- `90f339de31ea34be54605e1ba2a7b926ac745a06` — inline range split
- `5fc400449d4dd1fe30031bff8d10d5735d4d5849` — toolbar selection lock
- `d76d42b8305d3e690157031d2608bf2fb45ed56e` — célzott Rich Text tesztek

**Egyetlen aktuális folytatási pont:** a javított build után ugyanazt a B/I runtime tesztet kell elvégezni, különösen részleges kijelöléssel. Ha a bold továbbra sem látható, a következő audit közvetlenül a Canvas DOM `strong` elemét és `getComputedStyle(...).fontWeight` értékét ellenőrzi.


# 40 — KÖTELEZŐ FEJLESZTÉSI MINŐSÉGI ÉS ARCHITEKTÚRAI SZABÁLYOK — 2026-09-18

A felhasználó kérésére a teljes Sanci9517 fejlesztésre, minden jövőbeli funkcióra, javításra, refaktorra és tesztelésre kötelezően érvényes:

1. **Senior Full-Stack / Architect szemlélet:** minden módosítás előtt az érintett teljes kódútvonalat, adatfolyamot és függőségeket át kell auditálni. Nem készítünk gyors, tüneti javítást a rendszer architekturális következményeinek vizsgálata nélkül.
2. **Clean Code:** a kód legyen tiszta, moduláris, olvasható, következetesen elnevezett, iparági konvencióknak megfelelő és lehetőség szerint újrafelhasználható.
3. **Error Handling:** minden releváns hibát és edge case-t előre azonosítani és kezelni kell. A hibák ne maradjanak csendesek; ahol értelmes, a Diagnostics/verification rétegen keresztül legyenek láthatók és visszakövethetők.
4. **Kommentek és dokumentálhatóság:** csak a működés megértéséhez szükséges, rövid és pontos kommenteket írunk. A komplex döntéseknél a kód magyarázza az okot és a szerződéses viselkedést, nem felesleges kommentár készül.
5. **Biztonság:** minden új funkciónál vizsgálni kell a jogosultságot, input-validációt, injection/XSS lehetőségeket, adatkezelést, hibaszivárgást, jogosulatlan állapotmódosítást és egyéb releváns támadási felületeket.
6. **Teljesítmény:** kerülni kell a felesleges DOM-műveleteket, ismételt számításokat, túlzott hálózati/DB-hívásokat, memória- és history-pazarlást. A teljesítménykritikus útvonalaknál a választott megoldás indokolt legyen.
7. **Canonical architektúra:** továbbra is egy Page Model, egy state-rendszer, egy selection/hierarchy rendszer, egy renderer és egy központi Command/Action lánc használható. Kerülőút vagy párhuzamos állapot csak külön, dokumentált architekturális döntéssel vezethető be.
8. **Validation + recovery:** minden mutáció validáción, history-n és szükség esetén rollback/verification útvonalon menjen keresztül. Silent failure nem tekinthető sikeres műveletnek.
9. **Tesztelhetőség:** minden új vagy módosított funkcióhoz a megfelelő unit/integration/browser/regression teszteket meg kell tervezni és a relevánsakat le kell futtatni. A kód jelenléte önmagában nem jelent kész állapotot.
10. **Végrehajtási ciklus:** MASTER pont → teljes érintett kód audit → adatfolyam audit → minimális, tiszta módosítás → fájl-visszaolvasás → GitHub commit → branch/HEAD ellenőrzés → build/deploy, ha az adott változás ezt igényli → célzott tesztek → regresszió → felhasználói teszt → MASTER frissítés.
11. **Dokumentáció:** minden lépés után a docs/MASTER-DEVELOPMENT-PLAN.md az egyetlen hivatalos állapotforrásban frissül. Új beszélgetésben kizárólag ebből a tervből és a tényleges kódállapotból folytatunk.
12. **Rövid futtatási/telepítési útmutató:** minden önállóan futtatható új program, script vagy fejlesztői eszköz elkészítésekor a végleges átadás része legyen a rövid, pontos futtatási/telepítési útmutató. A meglévő Sanci editor esetében ez nem jelent minden apró patch után külön használati leírást; a változás ellenőrzéséhez szükséges parancsokat és tesztlépéseket viszont dokumentáljuk.

**Döntés:** ezek nem külön fejlesztési pontok, hanem az egész MASTER tervre és minden jövőbeli fejlesztési pontra kötelező minőségi kapuk.

**Állapot:** rögzítve; a jelenlegi 10.1.2.2 Rich Text B/I runtime teszt továbbra is az EGYETLEN aktív fejlesztési/tesztpont.


## 10.1.2.2 — félkövér Canvas-vizsgálat, új diagnosztikai ellenőrzés — 2026-09-18

**Állapot:** `[~]` JAVÍTÁS ELKÉSZÜLT, FELHASZNÁLÓI RUNTIME TESZT SZÜKSÉGES.

A felhasználói teszt alapján:
- a részleges kijelölés működik;
- a B ki/be kapcsolása működik;
- a félkövér vizuális megjelenése továbbra sem igazolt.

Senior full-stack audit után a Canvas oldali teljes útvonalat külön ellenőrző réteggel egészítettük ki:
1. canonical Rich Text mark meglétének ellenőrzése;
2. Canvas `strong.richtext-mark-bold` DOM elem meglétének ellenőrzése;
3. `getComputedStyle(...).fontWeight` ellenőrzése, legalább 600 vagy `bold` értékkel;
4. eltérés esetén Diagnostics kód:
   - `SANCI-VERIFY-E003` — canonical bold megvan, de megfelelő Canvas `<strong>` nincs;
   - `SANCI-VERIFY-E004` — `<strong>` megvan, de computed font-weight nem félkövér.

A Rich Text renderer közös `renderRichTextInline()` útvonalat használ; a bold elem szemantikailag `<strong>`, és explicit `font-weight:700 !important` inline stílust kap. A listaelemek inline mark renderelése is ugyanebbe a közös útvonalba került.

**Implementáció:**
- `a3ca1a6fd2286f2739f9c6605e169dda7113165e` — renderer refaktor + bold DOM/computed-style verification.
- `f3138933e17e4e83b66361d1eea4c2ed5ec123f0` — editor app cache frissítése.

**Következő egyetlen tesztpont:** frissített editor betöltése után ugyanazzal a részleges B teszttel ellenőrizni:
- kijelölt rész félkövér;
- kijelöletlen rész normál;
- B második megnyomására a kijelölt rész visszaáll;
- Diagnostics állapota;
- ha vizuálisan továbbra sem látható, a Diagnostics panelben különösen az `E003/E004` eredményét kell figyelni.

**Teszthatár:** Undo/Redo, save/reload, responsive regresszió és további Rich Text funkciók továbbra sem tesztelendők, amíg ez a pont nincs lezárva.


### 10.1.2.2 — Bold canonical model verification — 2026-09-18
**Állapot:** [~] CÉLZOTT HIBAFELTÁRÁS, FELHASZNÁLÓI TESZT SZÜKSÉGES.

A felhasználói teszt szerint a dőlt működik, a kijelölés ki/be működik, a félkövér vizuálisan nem jelenik meg, Diagnostics pedig 0 hibát mutat. Ez alapján a következő vizsgálat a B művelet teljes adatútja.

Új ellenőrzések: SANCI-VERIFY-E005 ellenőrzi, hogy a B művelet tartománya megtalálható-e a canonical modellben; SANCI-VERIFY-E006 ellenőrzi, hogy a kijelölt tartományban létrejött-e a canonical bold mark.

A cél annak eldöntése, hogy a hiba a toggleRichTextMark/selection → Page Model szakaszban van-e, vagy a Canvas renderer/CSS szakaszban. A pont lezárása továbbra is tiltott a felhasználói visszaigazolásig.

Implementáció:
- ad1329caaeaea502036fd63a6e25d5fe1a15246d — canonical bold model verification
- 112fa13f8b0afe096f31b775bcb66e00768d0570 — editor app cache refresh

**Következő egyetlen teszt:** frissítés után ugyanaz a részleges B teszt. Ha nem látszik félkövérnek, Diagnostics panelben ellenőrizni, megjelent-e E005/E006. Más funkciót nem tesztelünk.


### 10.1.2.2 hibajavítás — 2026-09-18
A célzott verification módosítás közben a korábbi `verifyRichTextBoldRender()` függvény véletlenül kikerült az app.js-ből, ezért a runtime/boot teszt `SANCI-RUNTIME-E0002` / `SANCI-BOOT-E001` hibával leállt. Ezt nem tekintjük Rich Text funkcionális eredménynek; regresszióként javítva lett.

Javítások:
- d7891b1b7d71050ee35c9b03098013a6ca71b9c6 — `verifyRichTextBoldRender()` visszaállítva.
- c451ce6f51ed3abc8cde5bab24900a89667a2381 — cache frissítve.

**Következő egyetlen teszt:** teljes frissítés után ellenőrizd, hogy nincs-e runtime/boot hiba, majd ugyanaz a B kijelölés teszt. Más funkciót nem tesztelünk.


### 10.1.2.2 — E003 pontosítás — 2026-09-21
A felhasználói tesztben a canonical bold mark már létrejött, tehát az upstream B → Page Model szakasz működik. A kapott E003 alapján a hiba a Canvas DOM ellenőrzési/renderelési szakaszban van. A DOM-ellenőrzést robusztusabbá tettük: nem összetett escaped CSS selectorral keresi a node-ot, hanem a canvas data-node-id értékével azonosítja, majd azon belül keresi a Rich Text DOM-ot és a bold strong elemet.

Javítás:
- 260c004cbaf44c73b8fc9308b5855d8de7f1579f — robust Rich Text bold DOM verification
- 0a5a97c461c3f969e1d4653ba110bd2e726411fd — cache refresh

**Következő egyetlen teszt:** frissítés után ugyanaz a kijelölés + B teszt. Ellenőrizd a félkövér vizuális megjelenést és a Diagnostics állapotát. Ha továbbra sem jelenik meg, a következő lépés közvetlen Canvas DOM/render audit lesz; CSS-t addig nem módosítunk.


### 10.1.2.2 — Rich Text editor formázási modell újratervezése — 2026-09-21
**Állapot:** [~] ÚJRATERVEZÉS, KÓDOLÁS ELŐTTI ARCHITEKTÚRAI DÖNTÉS.

A jelenlegi B/félkövér megoldást nem foltozzuk tovább. A dőlt jelenleg az Inspector contenteditable felületén látható, de a Canvas megjelenítés/persistencia teljes adatútját külön kell helyreállítani és ellenőrizni.

**Döntés:**
- A félkövér többé ne egyszerű B ki/be gomb legyen.
- A professzionálisabb modell: Betűvastagság / Font Weight érték, 100–900 tartományban, 100-as lépéssel.
- UI: − [400] + jellegű vezérlő, 100 és 900 között; később opcionálisan lenyíló értéklista.
- 400 = normál, 500 = medium, 600 = semibold, 700 = bold; a tényleges betűkészlet támogatása szerint a böngésző választ megfelelő megjelenést.
- A canonical inline adatban a súly érték legyen számszerű fontWeight, ne egyetlen bold boolean/mark. A régi bold adatot kompatibilitási migrációként 700-ra kell értelmezni.
- Az italic marad külön italic mark, de a Canvas renderernek és a DOM → canonical serializernek is támogatnia kell, hogy ne csak az Inspectorban látszódjon.
- A formázás valódi DOM Selection/Range alapján történik; részleges kijelölésnél csak a kijelölt szövegrész módosulhat.
- A Canvas az Inspector DOM-jától függetlenül, ugyanabból a canonical Rich Text JSON-ból renderel.
- Nem nyúlunk a Page Model, History, Undo/Redo, Add/Delete, Layers, Lock, Geometry, Responsive, Save/Load, Publish rendszerekhez.

**Megvalósítási sorrend:**
1. Canonical Rich Text modell: fontWeight érték + backward compatibility.
2. Validation/normalization frissítés.
3. Inspector: B helyett − 400 + font-weight vezérlő.
4. DOM Selection → canonical fontWeight részleges kijelöléssel.
5. Canvas renderer: font-weight tényleges megjelenítése.
6. Italic teljes adatút javítása: Inspector → canonical → Canvas → újrarenderelés.
7. Mentés/újratöltés ellenőrzése.
8. Undo/Redo ellenőrzése.
9. Desktop/Tablet/Mobile regresszió.
10. Diagnostics: 0 hiba + műveleti eredményellenőrzés.

**Szigorú tesztelési szabály:** egyszerre csak az aktuális pontot teszteljük. A font-weight alapművelet lezárásáig italic/lista/link/egyéb Rich Text funkciót nem tekintünk késznek.

**Első fejlesztési feladat:** teljes Rich Text adatút audit (schema.js → validation.js → commands.js → richtext-editor.js → app.js Canvas renderer → History/Persistence), majd minimális, célzott módosítás.

### 10.1.2.2 — Rich Text editor újraépítése — 2026-09-21
**Állapot:** [~] ÚJ IMPLEMENTÁCIÓ, RUNTIME TESZT MÉG NINCS LEZÁRVA.

Döntés: a korábbi textarea + selectionStart/selectionEnd + saját offset-mark rendszer nem kerül tovább foltozásra. A működő Page Model/schema/validation/command/history/persistence réteg megmarad; a Rich Text Inspector szerkesztési felülete újraépült contenteditable alapra.

Új irány:
- canonical Rich Text JSON továbbra is a Page Model forrása;
- Inspector: contenteditable DOM;
- B/I műveletek valódi DOM Selection/Range alapján dolgoznak;
- DOM → canonical JSON szinkron a meglévő richtext.content.set commandon keresztül;
- canonical JSON → editor DOM betöltéskor;
- Canvas renderer külön marad;
- Undo/Redo továbbra is a központi History rendszeren fut.

Implementációs commitok:
- 1f7f0f8fbee503225dec5cce0608aabdd6cd575d — Rich Text editor core contenteditable selection engine
- 3bb673434e90fe84844f96dd0b4f96968ead4c06 — Inspector textarea → contenteditable
- 5efb78923e16e6ff49cca42d7d6153dcd4eb37e1 — editor surface CSS
- a099aa5ddadcd23ca5f0165d53650fd566492594 — canonical mark-toggle compatibility tests
- e82a6a9b0ad3ff8b3e926aa2073b7971e2518712 — obsolete textarea verification removal
- 083414a439169d7c7487b4f10e4eb7ce90a68e30 — cache refresh

**Fontos:** a korábbi E003 verification útvonalat eltávolítottuk, mert az a régi textarea-alapú implementációhoz tartozott. Az új editor saját DOM → model ellenőrzést kap a következő tesztkörben.

**Következő egyetlen teszt:** Editor betöltés → Rich Text kijelölése → B → félkövér → kijelölés megszüntetése → újra kijelölés és B → félkövér ki. Diagnosticsnak 0 hibát kell mutatnia. Más Rich Text funkciót még nem tesztelünk.
