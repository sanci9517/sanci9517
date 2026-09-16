# Sanci9517 — MASTER FEJLESZTÉSI ÉS TESZTELÉSI TERV

**Verzió:** MASTER-1.1  
**Dátum:** 2026-09-16  
**Repository:** `sanci9517/sanci9517`  
**Aktív branch:** `v2/foundation`  
**Cél:** a teljes Sanci9517 streamer-platform megvalósítása újratervezés nélkül.

---

# 00 — A MASTER TERV SZEREPE

Ez a dokumentum az elsődleges fejlesztési szerződés a projekt számára. A korábbi blueprint-ek, résztervek, AI-tervek és editor-tervek tudásanyagként megmaradnak, de a végrehajtási sorrendet ez a dokumentum szabályozza.

Ha egy későbbi beszélgetésben csak ennyit mondunk: **„folytassuk a MASTER 3/C-4 pontját”**, abból egyértelműen meg kell tudni állapítani, mit kell megvizsgálni, mit kell megépíteni és milyen teszt után tekinthető késznek.

## 00.1 Állapotjelölések
- `[x]` kész és ellenőrzött, felhasználó által visszaigazolva
- `[~]` részleges / folyamatban / újratesztelendő
- `[ ]` még nincs kész
- `[!]` blokkoló hiba
- `[D]` döntési pont, amelyet dokumentálni kell

**Soha nem jelölünk `[x]`-et pusztán azért, mert a kód elkészült.**

## 00.2 Kötelező végrehajtási ciklus

Minden változás:

`MASTER pont → jelenlegi kód audit → minimális módosítás → érintett fájl visszaolvasása → GitHub commit → branch ellenőrzés → Cloudflare build → Cloudflare deploy → API ellenőrzés → D1/R2/KV ellenőrzés → admin teszt → public teszt → mobil/desktop teszt → felhasználói visszaigazolás → MASTER státusz frissítés`

Sikertelen pont esetén **nem lépünk tovább**.

## 00.3 Alapelv

A rendszer ne csak „most működjön”, hanem a következő fejlesztéseket is támogassa. Minden nagy funkciónál vizsgáljuk:
1. célját;
2. adatmodelljét;
3. API-ját;
4. jogosultságát;
5. mentését;
6. visszatöltését;
7. preview/publish viselkedését;
8. hibakezelését;
9. mobil/desktop viselkedését;
10. későbbi AI-kompatibilitását;
11. visszaállíthatóságát;
12. regressziós hatását.

## 00.4 Editor benchmark / funkciógyűjtési szabály

A Visual Editor végleges specifikációját nem egyetlen meglévő editor alapján készítjük. Nyílt forrású és dokumentált page-builder/editor rendszerekből csak a hasznos, bizonyítható mintákat vesszük át.

Referenciaelemzések:
- **GrapesJS:** moduláris editor, UndoManager, komponens/page modell, CSS/trait/property rendszerek, storage és editor modulok;
- **Craft.js:** node-alapú hierarchy, selection, actions/query, history, undo/redo és throttling;
- **Puck:** komponenskonfiguráció, field-alapú inspector, drag/drop, permissions, history és editor UI minták.

Ezekből nem kódot másolunk. A projekt saját Page Modeljébe, jogosultsági modelljébe, D1/R2 architektúrájába és későbbi SANCI AI action-rendszerébe illesztjük a szükséges funkciókat.

**Kötelező:** minden új editorfunkció előtt ellenőrizni kell, hogy a funkció valamelyik ilyen kategóriába tartozik-e: hierarchy, selection, property editing, history, persistence, responsive, reusable components, design system, interaction, accessibility, collaboration/conflict handling, recovery, testing vagy AI-action compatibility.

## 00.5 Implementációs komment-szabály

Komplex üzleti vagy adatkezelési logikánál rövid, célmagyarázó kódkomment engedélyezett és kívánatos. Különösen:
- Page Model invariánsok;
- history transaction/grouping;
- publish atomicitás;
- responsive inheritance;
- permission/authorization döntések;
- R2 object-key szabályok;
- AI action safety;
- migration compatibility;
- recovery/conflict kezelés.

A komment **miértet** magyarázzon, ne a triviális **mitet**. A publikus UI-ba technikai komment vagy fejlesztői szöveg nem kerülhet.

---

# 01 — VÉGLEGES CÉLKÉP

## 01/A Publikus oldal
- prémium streamer/creator weboldal;
- magyar látogatói felület;
- mobil/tablet/desktop;
- Twitch, TikTok, YouTube és Discord központú jelenlét;
- Home;
- Rólam;
- Adásrend;
- Twitch;
- YouTube;
- TikTok;
- Közösség;
- Kapcsolat;
- Támogatás;
- VOD;
- Shorts;
- szponzor/üzleti oldal;
- média/press kit;
- dinamikus oldalak;
- SEO;
- analytics;
- accessibility;
- élő/offline állapot;
- következő adás countdown;
- szerverről érkező dinamikus tartalom.

## 01/B Admin/CMS
- biztonságos belépés;
- session kezelés;
- RBAC;
- dashboard;
- oldalkezelés;
- Visual Editor;
- layer tree;
- inspector;
- média;
- schedule;
- social;
- VOD;
- SEO;
- analytics;
- integrációk;
- settings;
- audit log;
- draft/publish;
- versioning;
- rollback;
- backup/restore;
- import/export;
- későbbi AI vezérlés.

## 01/C SANCI AI
Nem egyszerű chatbot.

A cél egy jogosultságokkal és auditálással rendelkező platform:
- oldal szerkesztés;
- tartalomjavaslat;
- stream elemzés;
- élő adás figyelése;
- beszéd/csend figyelése;
- ötletadás;
- chat/context elemzés;
- technikai problémák jelzése;
- stream setup ellenőrzés;
- jó pillanatok felismerése;
- klip/Short előkészítés;
- streamer-profil és hosszú távú memória;
- tapasztalati tanulási és értékelési ciklus.

---

# 02 — ARCHITEKTURÁLIS SZABÁLYOK

## 02/A Források
- D1 = strukturált tartalom és konfiguráció elsődleges igazságforrása;
- R2 = médiafájlok elsődleges tárolója;
- KV = cache/gyors, nem kritikus állapot;
- GitHub = forráskód és dokumentáció;
- archive branch = régi kód megőrzése, nem aktív runtime.

## 02/B Rétegek
1. public renderer;
2. Worker routing;
3. API/service layer;
4. domain/data layer;
5. D1/R2/KV;
6. admin/editor UI;
7. később AI service/tool layer.

A frontend nem ír közvetlenül adatbázisba.

## 02/C Stabil azonosítók
Minden szerkeszthető objektumnak stabil ID kell:
- page ID;
- element ID;
- component ID;
- action ID;
- version ID;
- media ID;
- audit event ID;
- asset reference ID;
- template ID;
- design token ID.

ID nem változhat pusztán áthelyezés vagy átnevezés miatt.

## 02/D Visszaállíthatóság
Minden kritikus módosításnak legyen:
- előző állapota;
- verziója vagy auditja;
- validálható formája;
- lehetőség szerint rollback útja.

## 02/E Editor adatmodell szabály

A Visual Editor nem HTML-szöveget szerkesztő rendszer. A szerkesztési igazságforrás strukturált Page Model.

Minimum logikai rétegek:
`Site → Page → Root → Node tree → Component/Element → Props/Style/Responsive → Bindings/Interactions`

A renderer ebből állítja elő a publikus HTML-t. A publikus HTML visszaimportálása nem lehet a működés feltétele.

## 02/F State rétegek

Külön kell kezelni:
- persisted server state;
- published state;
- editor working state;
- local recovery state;
- UI-only state;
- history state;
- preview state;
- external integration cache.

Ezek nem keveredhetnek össze.

## 02/G Concurrency / conflict szabály

Ha ugyanazt a draftot két editor-tab vagy két kliens módosítja:
- verzió/ETag vagy equivalent revision check szükséges;
- ütközés nem írhatja felül csendben a másik változást;
- a felhasználó kapjon egyértelmű konfliktusjelzést;
- legyen reload/merge/overwrite lehetőség megfelelő jogosultsággal;
- a konfliktus auditálható legyen.

## 02/H Recovery szabály

A szerkesztőnek számolnia kell:
- böngésző bezárásával;
- tab összeomlásával;
- hálózati hibával;
- deploy közbeni újratöltéssel;
- save timeouttal;
- részleges API hibával.

A lokális recovery nem válthatja ki a D1 mentést, csak biztonsági mentési réteg lehet.

---

# 03 — FEJLESZTÉSI KAPUK

## G0 — Foundation
Canonical routing + Worker + D1 + archive + admin alapok.

## G1 — Editor Core
Betöltés + kijelölés + szerkesztés + mentés + reload + recovery.

## G2 — Hierarchy/Layout
Valódi parent-child + layers + layout engine.

## G3 — Responsive
Desktop/tablet/mobile ugyanazon Page Modelből.

## G4 — Content/Pages
Valódi Sanci oldalak strukturált tartalommal.

## G5 — Publishing
Draft/Preview/Publish/Version/Rollback.

## G6 — Media/Integrations
R2 + Twitch/YouTube/TikTok/Discord.

## G7 — Production platform
SEO + analytics + accessibility + security + backup.

## G8 — SANCI AI
AI editor → később Stream Assistant.

Minden kapu után teljes smoke/regression ellenőrzés.

---

# 04 — PHASE 0 / FOUNDATION LEZÁRÁSA

## 0/A Canonical routing
- [x] `/` canonical renderer
- [x] `/p/<slug>` canonical renderer
- [x] legacy URL redirect
- [x] Worker routing
- [x] D1 published snapshot alap

## 0/B Legacy archive
- [x] régi publikus HTML-ek eltávolítva az aktív branchből
- [x] `archive/pre-canonical-public-2026-09-16` létrehozva
- [x] aktív renderer nem függ a régi HTML-ektől
- [x] admin rendszer megmaradt

## 0/C A/1 — Foundation smoke test
**Tesztpontok:**
1. `/`;
2. `/p/home`;
3. további `/p/<slug>`;
4. `/schedule.html` redirect;
5. `/about.html` redirect;
6. `/contact.html` redirect;
7. Worker health/API;
8. D1 pages;
9. admin login/session;
10. public könyvtár legacy HTML-mentessége;
11. archive branch;
12. GitHub branch/HEAD;
13. Cloudflare deploy;
14. nincs véletlen törlés;
15. renderer hibamentes.

**A/1 kész feltétele:** minden pont működik, és a felhasználó visszaigazolja.

## 0/D A/2 — teljes jelenlegi rendszer audit
Módosítás előtt fel kell térképezni:
- Worker entry;
- router;
- response layer;
- page renderer;
- page API;
- D1 schema;
- migrations;
- admin login;
- admin shell;
- Visual Editor;
- editor API;
- editor state;
- preview;
- publish;
- assets;
- CSS/JS függőségek.

**A/2 eredménye:** pontos fájl- és adatfolyam-térkép.

---

# 05 — PHASE 1 / EDITOR CORE

## 1/A Editor lifecycle
- [ ] editor megnyitása
- [ ] oldal kiválasztása
- [ ] oldal betöltése D1-ből
- [ ] loading state
- [ ] empty state
- [ ] API error state
- [ ] save error state
- [ ] retry
- [ ] offline/kapcsolati hiba kezelése
- [ ] draft/workspace azonosítás
- [ ] working state és persisted state szétválasztása
- [ ] dirty state pontos követése
- [ ] unsaved changes jelzés
- [ ] navigáció előtti unsaved-change védelem
- [ ] tab/browser close recovery
- [ ] local recovery snapshot
- [ ] recovery visszaállítás
- [ ] recovery törlés sikeres mentés után
- [ ] editor újranyitás ugyanarra az oldalra
- [ ] több editor-tab felismerése
- [ ] revision/conflict ellenőrzés

## 1/B Alapelemek
- [ ] root
- [ ] container/box
- [ ] section
- [ ] heading
- [ ] paragraph/text
- [ ] rich text
- [ ] button
- [ ] link
- [ ] image
- [ ] video/embed
- [ ] icon
- [ ] divider
- [ ] spacer
- [ ] list
- [ ] quote
- [ ] badge/tag
- [ ] columns
- [ ] form field
- [ ] form/container slot
- [ ] custom component slot

Minden elem:
- stabil ID;
- type;
- parent ID;
- order;
- props;
- style;
- responsive overrides;
- visibility;
- locked állapot;
- metadata;
- accessibility metadata;
- data bindings;
- interaction bindings;
- schema version.

## 1/C Selection és manipulation
- [ ] click select
- [ ] újrakijelölés
- [ ] canvas → tree sync
- [ ] tree → canvas sync
- [ ] multi-select
- [ ] shift/ctrl selection
- [ ] group
- [ ] ungroup
- [ ] lock
- [ ] hide
- [ ] rename
- [ ] drag selection
- [ ] resize handles
- [ ] keyboard move
- [ ] duplicate with offset
- [ ] copy
- [ ] cut
- [ ] paste
- [ ] paste into selected parent
- [ ] paste style only
- [ ] paste structure
- [ ] context menu
- [ ] breadcrumb selection
- [ ] parent selection
- [ ] focus selected
- [ ] escape to parent/clear selection

## 1/D CRUD és tree műveletek
- [ ] create
- [ ] duplicate
- [ ] delete
- [ ] delete confirmation ahol veszélyes
- [ ] reorder
- [ ] parenthez adás
- [ ] parentből kivétel
- [ ] másik parentbe helyezés
- [ ] drag/drop insertion
- [ ] drop zone preview
- [ ] invalid drop tiltás
- [ ] nesting rule ellenőrzés
- [ ] bulk delete
- [ ] bulk duplicate
- [ ] bulk move
- [ ] tree search
- [ ] collapse/expand tree
- [ ] expand to selected

## 1/E Inspector
- [ ] content
- [ ] rich text
- [ ] typography
- [ ] layout
- [ ] spacing
- [ ] appearance
- [ ] border
- [ ] radius
- [ ] shadow
- [ ] background
- [ ] image/media
- [ ] responsive
- [ ] interaction
- [ ] link/navigation
- [ ] accessibility
- [ ] data binding
- [ ] visibility
- [ ] states/pseudo-states ahol releváns
- [ ] advanced
- [ ] property search
- [ ] property reset
- [ ] inherited value jelzése
- [ ] overridden value jelzése
- [ ] invalid value jelzése
- [ ] unit választás
- [ ] color picker
- [ ] token választás

## 1/F History
- [ ] undo
- [ ] redo
- [ ] history model
- [ ] history panel
- [ ] entry preview
- [ ] restore history entry
- [ ] history grouping
- [ ] drag/resize history throttling
- [ ] typing history throttling
- [ ] ignored/internal action
- [ ] history limit
- [ ] history persistence policy
- [ ] history ne sértse a szerver állapotát
- [ ] undo után új változás branch history kezelése

## 1/G Save contract
- [ ] dirty state
- [ ] manual save
- [ ] optional autosave
- [ ] autosave debounce
- [ ] save queue
- [ ] duplicate save protection
- [ ] D1 update
- [ ] optimistic/pessimistic stratégia dokumentálva
- [ ] save success
- [ ] save failure
- [ ] timeout
- [ ] retry
- [ ] reload
- [ ] adat megmarad
- [ ] renderer ugyanazt az állapotot látja
- [ ] revision frissül
- [ ] conflict felismerés
- [ ] recovery snapshot frissül
- [ ] mentett állapot és publish állapot különválik

## 1/H Kötelező Core tesztkapu
1. editor megnyílik;
2. oldal betöltődik;
3. container létrejön;
4. heading létrejön;
5. text létrejön;
6. button létrejön;
7. elem kijelölhető;
8. elem újrakijelölhető;
9. elem szerkeszthető;
10. elem törölhető;
11. elem duplikálható;
12. sorrend működik;
13. mentés működik;
14. reload után megmarad;
15. reload után újra kijelölhető;
16. preview helyes;
17. public renderer helyes;
18. D1-ben ténylegesen megjelent;
19. hibás input nem töri el;
20. mobil/desktop nem romlik;
21. undo működik;
22. redo működik;
23. copy/paste működik;
24. reparent működik;
25. save hiba után adatvesztés nélkül retry lehetséges;
26. recovery működik;
27. konfliktus nem ír felül csendben;
28. jogosulatlan mutation elutasítva;
29. accessibility alapmezők nem hagyhatók hibásan;
30. editor újranyitása ugyanazt a strukturált állapotot adja vissza.

---

# 06 — PHASE 2 / VALÓDI HIERARCHY ÉS LAYOUT ENGINE

## 2/A Hierarchy
- [ ] root container
- [ ] section
- [ ] parent/child
- [ ] nested nesting
- [ ] empty container
- [ ] reparent
- [ ] invalid nesting tiltás
- [ ] breadcrumb
- [ ] X-Ray
- [ ] drop zone
- [ ] hierarchy D1 persistence
- [ ] hierarchy preview
- [ ] hierarchy publish
- [ ] hierarchy undo/redo
- [ ] tree search
- [ ] collapse/expand
- [ ] multi-level drag/drop
- [ ] allowed-child rules
- [ ] slot/capacity rules
- [ ] locked subtree szabály

## 2/B Sizing
- [ ] fixed
- [ ] auto
- [ ] fit-content
- [ ] fill
- [ ] min
- [ ] max
- [ ] aspect ratio
- [ ] fluid
- [ ] clamp
- [ ] viewport units
- [ ] percentage
- [ ] intrinsic sizing
- [ ] konfliktuskezelés

## 2/C Spacing
- [ ] padding top/right/bottom/left
- [ ] margin top/right/bottom/left
- [ ] gap
- [ ] negative margin
- [ ] shorthand
- [ ] responsive spacing
- [ ] spacing tokens
- [ ] linked/unlinked sides
- [ ] visual box-model editor

## 2/D Display
- [ ] block
- [ ] inline-block
- [ ] inline
- [ ] flex
- [ ] grid
- [ ] none
- [ ] display validation
- [ ] visibility/display különválasztás

## 2/E Flex
- [ ] row
- [ ] column
- [ ] reverse
- [ ] wrap
- [ ] no-wrap
- [ ] justify
- [ ] align
- [ ] align-content
- [ ] order
- [ ] grow
- [ ] shrink
- [ ] basis
- [ ] self
- [ ] gap
- [ ] responsive preview
- [ ] persistence

## 2/F Grid
- [ ] columns
- [ ] rows
- [ ] fixed
- [ ] fractional
- [ ] auto
- [ ] minmax
- [ ] auto-fit
- [ ] auto-fill
- [ ] areas
- [ ] placement
- [ ] alignment
- [ ] responsive
- [ ] persistence
- [ ] row/column gap
- [ ] explicit/implicit grid validation

## 2/G Position
- [ ] static
- [ ] relative
- [ ] absolute
- [ ] fixed
- [ ] sticky
- [ ] top/right/bottom/left
- [ ] inset
- [ ] z-index
- [ ] stacking context
- [ ] conflict handling
- [ ] containing-block validation

## 2/H Overflow
- [ ] visible
- [ ] hidden
- [ ] auto
- [ ] scroll
- [ ] x/y
- [ ] clip
- [ ] overflow-wrap
- [ ] text overflow

## 2/I Design system / CSS abstraction
- [ ] CSS variable/token model
- [ ] color tokens
- [ ] typography tokens
- [ ] spacing tokens
- [ ] radius tokens
- [ ] shadow tokens
- [ ] breakpoint tokens
- [ ] reusable style presets
- [ ] class/style strategy dokumentálása
- [ ] token override
- [ ] token usage search
- [ ] unused token detection későbbi pont

## 2/J Component states és variants
- [ ] default
- [ ] hover
- [ ] focus
- [ ] active
- [ ] disabled
- [ ] selected/current
- [ ] component variants
- [ ] variant props
- [ ] state validation
- [ ] responsive + state kombináció kezelése

---

# 07 — PHASE 3 / CANVAS ÉS EDITOR UX

## 3/A Canvas
- [ ] center
- [ ] zoom in/out
- [ ] 25/50/75/100/150/200% preset
- [ ] fit screen
- [ ] grid
- [ ] guides
- [ ] snap
- [ ] grid size
- [ ] snap strength
- [ ] safe area
- [ ] ruler
- [ ] device frame
- [ ] full-page mode
- [ ] focus selected
- [ ] preview overlay
- [ ] canvas background
- [ ] selection outline
- [ ] hover outline
- [ ] parent outline
- [ ] spacing/margin visualizer
- [ ] breakpoint indicator
- [ ] scroll position preservation

## 3/B Alignment
- [ ] left/center/right
- [ ] top/middle/bottom
- [ ] distribute horizontal
- [ ] distribute vertical
- [ ] match width
- [ ] match height
- [ ] match size
- [ ] align parent
- [ ] align canvas
- [ ] distance indicators
- [ ] equal spacing indicators
- [ ] smart guides
- [ ] snap to siblings
- [ ] snap to container

## 3/C Editor panels
- [ ] layer panel
- [ ] inspector
- [ ] resizable panels
- [ ] collapse/reopen
- [ ] width persistence
- [ ] keyboard shortcuts
- [ ] command palette
- [ ] quick actions
- [ ] property search
- [ ] component library/panel
- [ ] assets panel
- [ ] page panel
- [ ] history panel
- [ ] preview/publish controls
- [ ] unsaved indicator
- [ ] save status
- [ ] notifications/toasts
- [ ] modal system

## 3/D Component insertion UX
- [ ] drag component from library
- [ ] click-to-add
- [ ] insert before/after
- [ ] insert into container
- [ ] favorite components
- [ ] recently used
- [ ] search components
- [ ] categories
- [ ] component documentation/help text
- [ ] component compatibility warning

## 3/E Clipboard és import
- [ ] internal clipboard
- [ ] cross-page copy/paste
- [ ] duplicate IDs regenerálása
- [ ] external structured paste policy
- [ ] sanitization
- [ ] paste preview
- [ ] unsupported element fallback

---

# 08 — PHASE 4 / RESPONSIVE ENGINE

## 4/A Devices
- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] custom viewport preview
- [ ] orientation
- [ ] viewport presets
- [ ] min/max viewport validation

## 4/B Responsive properties
- [ ] width
- [ ] height
- [ ] padding
- [ ] margin
- [ ] gap
- [ ] font size
- [ ] line height
- [ ] letter spacing
- [ ] display
- [ ] position
- [ ] alignment
- [ ] visibility
- [ ] order
- [ ] grid/flex overrides
- [ ] image sizing/crop
- [ ] max-width/container rules

## 4/C Inheritance
- [ ] desktop default
- [ ] tablet override
- [ ] mobile override
- [ ] reset override
- [ ] inherited value display
- [ ] breakpoint validation
- [ ] explicit vs inherited distinction
- [ ] cascade conflict detection
- [ ] override cleanup

## 4/D Responsive gate
Ugyanaz az oldal ellenőrizve:
- editor desktop;
- editor tablet;
- editor mobile;
- public desktop;
- public tablet;
- public mobile;
- reload mindegyiken;
- preview;
- publish;
- nincs layout regression.

---

# 09 — PHASE 5 / PAGE MODEL + PUBLISHING

## 5/A Page schema
- [ ] page ID
- [ ] slug
- [ ] title
- [ ] status
- [ ] content schema
- [ ] metadata
- [ ] version
- [ ] revision
- [ ] updated timestamp
- [ ] published timestamp
- [ ] schema version
- [ ] author/owner
- [ ] template ID ahol releváns
- [ ] SEO data
- [ ] access/visibility policy

## 5/B Element schema
- [ ] element ID
- [ ] type
- [ ] parent
- [ ] order
- [ ] props
- [ ] style
- [ ] responsive overrides
- [ ] visibility
- [ ] lock
- [ ] data bindings
- [ ] interaction bindings
- [ ] component/variant reference
- [ ] accessibility metadata
- [ ] schema version

## 5/C Validation
- [ ] schema validation
- [ ] required fields
- [ ] type validation
- [ ] max sizes
- [ ] unsafe HTML filtering
- [ ] invalid nesting
- [ ] unknown element handling
- [ ] migration compatibility
- [ ] circular reference detection
- [ ] orphan node detection
- [ ] duplicate ID detection
- [ ] invalid style validation
- [ ] invalid binding validation
- [ ] permission validation

## 5/D Draft/Preview/Publish
- [ ] draft state
- [ ] save draft
- [ ] preview draft
- [ ] isolated preview URL/token
- [ ] published snapshot
- [ ] publish
- [ ] unpublish
- [ ] preview nem ír publicot
- [ ] publish atomic
- [ ] publish audit
- [ ] publish validation gate
- [ ] publish failure rollback
- [ ] cache invalidation
- [ ] stale public snapshot detection

## 5/E Versioning
- [ ] version number
- [ ] revision number
- [ ] created by
- [ ] timestamp
- [ ] change summary
- [ ] diff
- [ ] restore
- [ ] rollback
- [ ] rollback audit
- [ ] version compare
- [ ] version preview
- [ ] version retention policy

## 5/F Autosave és recovery
- [ ] autosave policy
- [ ] debounce
- [ ] save queue
- [ ] retry queue
- [ ] local recovery
- [ ] crash recovery
- [ ] conflict detection
- [ ] conflict resolution
- [ ] recovery cleanup

## 5/G Templates és reusable sections
- [ ] page template
- [ ] section template
- [ ] component template
- [ ] template clone
- [ ] detach from template
- [ ] template update policy
- [ ] instance override
- [ ] template versioning

---

# 10 — PHASE 6 / VALÓDI SANCI OLDALAK

Minden oldal ugyanazon kapun megy:
`Create → Edit → Save → D1 → Reload → Preview → Publish → Public → Mobile → Tablet → Desktop → Regression`.

## 6/A Home
- [ ] alap home működés megőrzése
- [ ] streamer branding
- [ ] Twitch állapot
- [ ] következő adás
- [ ] fő CTA

## 6/B Rólam
- [ ] bemutatkozás
- [ ] streamer profil
- [ ] social links

## 6/C Adásrend
- [ ] heti schedule
- [ ] időpontok
- [ ] játék
- [ ] platform
- [ ] következő adás
- [ ] countdown
- [ ] múltbeli adások

## 6/D Twitch
- [ ] live
- [ ] channel
- [ ] stream metadata
- [ ] link

## 6/E YouTube
- [ ] channel
- [ ] videos
- [ ] live
- [ ] Shorts

## 6/F TikTok
- [ ] profil
- [ ] videók/linkek ahol API lehetővé teszi
- [ ] statisztika ahol API lehetővé teszi

## 6/G Community
- [ ] Discord
- [ ] közösségi linkek
- [ ] közösségi tartalom

## 6/H Contact
- [ ] kapcsolat
- [ ] üzleti kapcsolat
- [ ] spamvédelem

## 6/I Support
- [ ] támogatási lehetőségek
- [ ] külső szolgáltatások
- [ ] biztonságos linkkezelés

## 6/J VOD/Shorts
- [ ] lista
- [ ] kategória
- [ ] kiemelt tartalom
- [ ] külső link
- [ ] későbbi automatikus pipeline slot

---

# 11 — PHASE 7 / SÁNCIBRAND KOMPONENSKÖNYVTÁR

- [ ] LiveIndicator
- [ ] NextStream
- [ ] Countdown
- [ ] ScheduleCard
- [ ] StreamCard
- [ ] SocialCard
- [ ] VideoCard
- [ ] VODCard
- [ ] ShortCard
- [ ] DiscordCard
- [ ] SupportCard
- [ ] CTA
- [ ] StatsCard
- [ ] MediaGallery
- [ ] Section
- [ ] Container
- [ ] Hero
- [ ] ProfileCard
- [ ] GameCard
- [ ] LinkCard
- [ ] SponsorCard
- [ ] PressKitBlock
- [ ] FAQ
- [ ] ContactForm
- [ ] SocialFeed
- [ ] FeaturedContent

Minden komponenshez kell:
- schema;
- default props;
- editor preview;
- public renderer;
- responsive behavior;
- accessibility;
- validation;
- stabil ID;
- dokumentáció;
- empty/loading/error state;
- analytics hooks ahol releváns;
- AI action compatibility ahol releváns.

---

# 12 — PHASE 8 / GLOBÁLIS RENDSZER

- [ ] global header
- [ ] navigation
- [ ] mobile navigation
- [ ] footer
- [ ] global social links
- [ ] global live state
- [ ] global theme
- [ ] design tokens
- [ ] typography tokens
- [ ] spacing tokens
- [ ] color tokens
- [ ] radius/shadow tokens
- [ ] breakpoints
- [ ] reusable sections
- [ ] templates
- [ ] template cloning
- [ ] global settings
- [ ] global components
- [ ] global styles
- [ ] token usage audit

---

# 13 — PHASE 9 / MÉDIA + R2

## 9/A Storage
- [ ] R2 bucket
- [ ] object key stratégia
- [ ] MIME validation
- [ ] size validation
- [ ] upload endpoint
- [ ] secure access
- [ ] signed/private access ahol kell
- [ ] upload cancellation
- [ ] upload progress
- [ ] retry
- [ ] resumable strategy ahol indokolt

## 9/B Media DB
- [ ] media ID
- [ ] object key
- [ ] filename
- [ ] MIME
- [ ] size
- [ ] dimensions
- [ ] duration
- [ ] alt text
- [ ] focal point/crop metadata
- [ ] created_at
- [ ] updated_at
- [ ] references
- [ ] checksum
- [ ] variants

## 9/C Media UI
- [ ] library
- [ ] search
- [ ] filter
- [ ] sort
- [ ] upload
- [ ] picker
- [ ] replace
- [ ] crop
- [ ] focal point
- [ ] alt text
- [ ] delete confirmation
- [ ] orphan detection
- [ ] cleanup
- [ ] bulk operations
- [ ] usage view

---

# 14 — PHASE 10 / SCHEDULE + SOCIAL + VOD

## 10/A Schedule backend
- [ ] CRUD
- [ ] recurring schedule
- [ ] exception
- [ ] timezone
- [ ] game/category
- [ ] platform
- [ ] status
- [ ] next event calculation
- [ ] cancellation
- [ ] reschedule
- [ ] special event
- [ ] past-event archive

## 10/B Schedule frontend
- [ ] calendar/list
- [ ] next stream
- [ ] countdown
- [ ] live status
- [ ] mobile layout
- [ ] timezone-aware display
- [ ] past streams
- [ ] filters

## 10/C Social data model
- [ ] provider
- [ ] account
- [ ] external ID
- [ ] URL
- [ ] cached stats
- [ ] last sync
- [ ] error state
- [ ] sync status
- [ ] manual refresh

## 10/D VOD
- [ ] import
- [ ] manual add
- [ ] metadata
- [ ] thumbnail
- [ ] category
- [ ] published state
- [ ] tags
- [ ] featured state
- [ ] external URL validation

---

# 15 — PHASE 11 / KÜLSŐ INTEGRÁCIÓK

Minden integráció külön service modul, saját hibakezeléssel és rate-limit kezeléssel.

## 11/A Twitch
- [ ] OAuth
- [ ] token lifecycle
- [ ] channel
- [ ] stream status
- [ ] stream metadata
- [ ] event handling
- [ ] permission handling
- [ ] cache
- [ ] reconnect
- [ ] rate-limit handling
- [ ] integration health

## 11/B YouTube
- [ ] OAuth/API credential kezelés
- [ ] channel
- [ ] videos
- [ ] live
- [ ] Shorts
- [ ] sync
- [ ] cache
- [ ] error recovery

## 11/C TikTok
- [ ] aktuális hivatalos API-k felmérése
- [ ] engedélyek
- [ ] account integration
- [ ] content integration
- [ ] statisztika, ha elérhető
- [ ] fallback külső link

## 11/D Discord
- [ ] invite/link
- [ ] későbbi bot integration
- [ ] webhook lehetőség
- [ ] community status lehetőség

---

# 16 — PHASE 12 / SEO + ANALYTICS + ACCESSIBILITY

## 12/A SEO
- [ ] title
- [ ] description
- [ ] canonical
- [ ] Open Graph
- [ ] Twitter/X card
- [ ] robots
- [ ] sitemap
- [ ] structured data
- [ ] 404
- [ ] redirect policy
- [ ] noindex draft/preview
- [ ] social preview validation

## 12/B Analytics
- [ ] page view
- [ ] CTA click
- [ ] social click
- [ ] stream click
- [ ] VOD click
- [ ] support click
- [ ] anonymized event model
- [ ] admin dashboard
- [ ] event deduplication
- [ ] retention policy

## 12/C Accessibility
- [ ] semantic HTML
- [ ] keyboard navigation
- [ ] focus states
- [ ] labels
- [ ] alt text
- [ ] contrast
- [ ] reduced motion
- [ ] screen reader basic flow
- [ ] heading hierarchy
- [ ] form error accessibility
- [ ] editor accessibility alapok

---

# 17 — PHASE 13 / BACKUP + RESTORE + AUDIT

## 13/A Backup
- [ ] page backup
- [ ] site snapshot
- [ ] schema version
- [ ] media manifest
- [ ] schedule backup
- [ ] settings backup
- [ ] checksum/integrity
- [ ] backup metadata
- [ ] backup retention
- [ ] restore test

## 13/B Restore
- [ ] restore preview
- [ ] selected page
- [ ] selected version
- [ ] whole site
- [ ] validation before restore
- [ ] confirmation
- [ ] rollback on failed restore
- [ ] dependency validation
- [ ] media reference validation

## 13/C Audit
- [ ] login events
- [ ] logout
- [ ] page changes
- [ ] publish
- [ ] rollback
- [ ] media delete
- [ ] settings changes
- [ ] integration changes
- [ ] security events
- [ ] AI events later
- [ ] actor
- [ ] target
- [ ] before/after reference
- [ ] request/correlation ID

## 13/D Import/export
- [ ] page export
- [ ] site export
- [ ] schedule export
- [ ] media manifest
- [ ] import validation
- [ ] dry-run import
- [ ] conflict handling
- [ ] import audit
- [ ] schema migration during import

---

# 18 — PHASE 14 / SECURITY

- [ ] authentication hardening
- [ ] session expiration
- [ ] refresh strategy
- [ ] logout invalidation
- [ ] rate limiting
- [ ] CSRF protection
- [ ] XSS protection
- [ ] input validation
- [ ] output encoding
- [ ] authorization every mutation endpointen
- [ ] RBAC
- [ ] secret management
- [ ] webhook verification
- [ ] API abuse protection
- [ ] error information minimization
- [ ] security audit
- [ ] security regression tests
- [ ] upload security
- [ ] path/object-key traversal prevention
- [ ] preview token security
- [ ] audit integrity

---

# 19 — PHASE 15 / ADMIN DASHBOARD

- [ ] overview
- [ ] site status
- [ ] recent changes
- [ ] draft count
- [ ] published pages
- [ ] next stream
- [ ] integration status
- [ ] media usage
- [ ] errors
- [ ] audit events
- [ ] quick actions
- [ ] global settings
- [ ] editor recovery alerts
- [ ] conflicts
- [ ] failed publishes
- [ ] system health

---

# 20 — PHASE 16 / SANCI AI EDITOR

## 16/A AI architecture
AI nem kap közvetlen, kontrollálatlan adatbázis-hozzáférést.

`User request → intent → permission → structured action → schema validation → preview → approval → transaction → audit`

## 16/B AI actions
- [ ] create page
- [ ] edit page
- [ ] add component
- [ ] move component
- [ ] style component
- [ ] change text
- [ ] change schedule
- [ ] suggest content
- [ ] generate metadata
- [ ] analyze page
- [ ] fix validation issue
- [ ] explain layout issue
- [ ] propose responsive fix
- [ ] prepare draft only
- [ ] compare versions

## 16/C Safety
- [ ] allowlist
- [ ] action schema
- [ ] permission levels
- [ ] preview
- [ ] confirmation
- [ ] audit
- [ ] rollback
- [ ] destructive action protection
- [ ] rate limiting
- [ ] action idempotency
- [ ] maximum mutation scope
- [ ] no direct arbitrary SQL
- [ ] no direct arbitrary file write

## 16/D AI/editor bridge
- [ ] every editor mutation has structured action equivalent
- [ ] action validation uses same schema as UI
- [ ] AI can read Page Model through controlled query layer
- [ ] AI can propose, but not silently publish
- [ ] human approval for consequential changes
- [ ] action result visible to user
- [ ] failed action leaves state valid

---

# 21 — PHASE 17 / SANCI AI STREAM ASSISTANT

## 17/A Stream context
- [ ] Twitch/OBS kapcsolat stratégia
- [ ] stream state
- [ ] scene state
- [ ] audio activity
- [ ] chat context
- [ ] game context
- [ ] event timeline
- [ ] active game/session identity
- [ ] streamer context

## 17/B Élő figyelés
- [ ] csend detektálás
- [ ] túl hosszú csend küszöb
- [ ] beszéd aktivitás
- [ ] chat aktivitás
- [ ] stream technikai hibák
- [ ] audio problémák
- [ ] scene/OBS problémák
- [ ] connection health
- [ ] dropped frames jelzés ahol elérhető

## 17/C Segítség
- [ ] „nem beszélsz” jelzés
- [ ] témaváltási ötlet
- [ ] chatből ötlet
- [ ] játékhoz kapcsolódó ötlet
- [ ] technikai ellenőrzés
- [ ] beállítási segítség
- [ ] tesztelési segítség
- [ ] kontextusfüggő prioritás
- [ ] ne legyen túl sok zavaró értesítés
- [ ] mute/snooze/cooldown

## 17/D Stream elemzés
- [ ] beszédarány
- [ ] csendek
- [ ] chat aktivitás
- [ ] interakciós események
- [ ] kiemelkedő pillanatok
- [ ] session summary
- [ ] hosszú távú trendek
- [ ] segmentek
- [ ] game/context váltások
- [ ] user feedback korreláció

## 17/E Streamer memory
- [ ] streamer profil
- [ ] preferenciák
- [ ] korábbi tapasztalatok
- [ ] bevált megoldások
- [ ] korábbi hibák
- [ ] célok
- [ ] értékelési ciklus
- [ ] memória törlés/korrekció
- [ ] confidence/source metadata
- [ ] lejárat/érvényesség ahol szükséges

## 17/F Clip/Short pipeline
- [ ] manuális „jó jelenet” trigger
- [ ] automatikus candidate
- [ ] timestamp
- [ ] start/end suggestion
- [ ] clip metadata
- [ ] vertical crop strategy
- [ ] caption strategy
- [ ] preview
- [ ] export
- [ ] mentés
- [ ] későbbi publikálás
- [ ] source media reference
- [ ] clip status lifecycle
- [ ] retry/failure state

---

# 22 — PHASE 18 / TANULÁSI ÉS ÉRTÉKELÉSI RENDSZER

- [ ] session metrics
- [ ] content outcomes
- [ ] clip outcomes
- [ ] user feedback
- [ ] AI suggestion feedback
- [ ] accepted/rejected actions
- [ ] experiment history
- [ ] trend analysis
- [ ] streamer-specific recommendations
- [ ] confidence tracking
- [ ] feedback provenance
- [ ] rollback of learned preference

Az AI nem „öntanuló fekete doboz”: minden releváns változás mérhető, visszakereshető és korlátozható legyen.

---

# 23 — PHASE 19 / TESZTELÉSI RENDSZER

## 19/A Unit
- [ ] schema
- [ ] parser
- [ ] validation
- [ ] service logic
- [ ] auth
- [ ] Page Model transformations
- [ ] history grouping
- [ ] responsive inheritance

## 19/B Integration
- [ ] Worker → D1
- [ ] API → D1
- [ ] editor → API
- [ ] renderer → API/data
- [ ] R2 → media
- [ ] integrations
- [ ] publish transaction
- [ ] audit transaction
- [ ] recovery
- [ ] conflict handling

## 19/C E2E
- [ ] login
- [ ] page edit
- [ ] save
- [ ] autosave
- [ ] reload
- [ ] recovery
- [ ] preview
- [ ] publish
- [ ] public
- [ ] rollback
- [ ] media
- [ ] schedule
- [ ] responsive
- [ ] unauthorized mutation

## 19/D Regression
Minden nagyobb változás után:
- [ ] home
- [ ] canonical pages
- [ ] redirects
- [ ] admin
- [ ] editor
- [ ] D1
- [ ] responsive
- [ ] auth
- [ ] media
- [ ] publish
- [ ] integrations

## 19/E Performance
- [ ] public load
- [ ] API latency
- [ ] editor load
- [ ] D1 query performance
- [ ] asset loading
- [ ] mobile performance
- [ ] large page/editor performance
- [ ] history performance
- [ ] autosave performance
- [ ] memory leak check

## 19/F Editor-specific regression matrix
- [ ] 1 node
- [ ] 10 nodes
- [ ] 100 nodes
- [ ] deep nesting
- [ ] large text
- [ ] many images
- [ ] many responsive overrides
- [ ] repeated undo/redo
- [ ] rapid typing
- [ ] rapid drag/drop
- [ ] network interruption
- [ ] duplicate tabs
- [ ] invalid imported schema

---

# 24 — PHASE 20 / RELEASE ÉS ÜZEMELTETÉS

- [ ] release checklist
- [ ] migration checklist
- [ ] deploy checklist
- [ ] rollback checklist
- [ ] error logging
- [ ] health endpoint
- [ ] monitoring
- [ ] backup verification
- [ ] incident procedure
- [ ] release notes
- [ ] architecture changelog
- [ ] feature flag strategy ahol szükséges
- [ ] migration rollback strategy
- [ ] production smoke test

---

# 25 — DEFINITION OF DONE

Egy funkció csak akkor kész, ha:

1. a célja egyértelmű;
2. a tervpont létezik;
3. az adatmodell megfelelő;
4. az API megfelelő;
5. jogosultság megfelelő;
6. validáció működik;
7. mentés működik;
8. reload után megmarad;
9. preview működik;
10. publish működik, ha releváns;
11. public renderer helyes;
12. mobil működik;
13. tablet működik, ha releváns;
14. desktop működik;
15. hibás input kezelve van;
16. audit/rollback megoldott, ha kritikus;
17. recovery megoldott, ha adatvesztés kockázata van;
18. nincs ismert regresszió;
19. GitHub commit megtörtént;
20. Cloudflare deploy sikeres;
21. felhasználói teszt sikeres;
22. MASTER pont `[x]`-re frissítve.

---

# 26 — MIT NEM SZABAD TENNI

- régi publikus HTML architektúrát visszahozni;
- működő canonical routingot szükségtelenül átírni;
- nagy fájlba zsúfolni az egész rendszert;
- frontendből közvetlen D1/R2/KV írást engedni;
- teszt nélkül továbblépni;
- több egymásra épülő változást egyszerre tesztelni;
- AI-nak kontrollálatlan írási jogot adni;
- secretet GitHubba tenni;
- adatmodellt újratervezni egyetlen UI-probléma miatt;
- régi kódot törölni archive nélkül, ha még referenciaértékű;
- `[x]` státuszt feltételezés alapján beállítani;
- HTML-t tekinteni az editor elsődleges adatmodelljének;
- publish nélkül public tartalmat kézzel módosítani;
- historyt és persisted state-et összekeverni;
- autosave hibát sikeres mentésként kezelni;
- konfliktust csendben felülírni;
- AI-t megkerülő, nem auditált mutation endpointet létrehozni.

---

# 27 — AKTUÁLIS PROJEKTÁLLAPOT

## Kész / visszaigazolt
- [x] GitHub repository
- [x] `v2/foundation`
- [x] Cloudflare Worker
- [x] D1
- [x] canonical routing
- [x] canonical renderer alap
- [x] legacy redirect alap
- [x] legacy public HTML-ek archive után eltávolítva
- [x] Worker működik
- [x] oldalak megnyílnak — felhasználói visszaigazolás
- [x] A/1 foundation smoke test felhasználói visszaigazolása

## Nyitott
- [ ] A/2 teljes editor audit
- [ ] 1/A editor lifecycle
- [ ] 1/B alapelemek
- [ ] 1/C selection/manipulation
- [ ] 1/D CRUD/tree
- [ ] 1/E inspector
- [ ] 1/F history
- [ ] 1/G save contract
- [ ] 1/H Core tesztkapu
- [ ] 2–20 további phase-ek a fenti sorrendben

---

# 28 — AKTUÁLIS KÖVETKEZŐ LÉPÉS

## **A/2 — TELJES VISUAL EDITOR AUDIT**

Az A/1 lezárása után most nem új funkciót találunk ki vaktában, hanem a jelenlegi kódot vetjük össze a MASTER-1.1 végleges követelményeivel.

### A/2.1
Worker entry, router és response layer.

### A/2.2
Canonical page renderer és Page API.

### A/2.3
D1 schema, migrations és Page Model.

### A/2.4
Admin login/session/RBAC alapok.

### A/2.5
Visual Editor shell és editor state.

### A/2.6
Canvas, selection, layer tree, inspector.

### A/2.7
CRUD, hierarchy, history és save.

### A/2.8
Preview, publish és public renderer kapcsolat.

### A/2.9
Assets/media kapcsolat.

### A/2.10
Recovery, autosave, conflict és error handling jelenlegi állapota.

### A/2.11
A jelenlegi kód összevetése a benchmarkként vizsgált editor-mintákkal.

### A/2.12
Fájl- és adatfolyam-térkép.

**A/2 kimenete kötelezően:**
- `kész`;
- `részleges`;
- `hibás`;
- `hiányzik`;
- `újratesztelendő`;
- `MASTER-bővítést igényel`.

A/2 lezárása nélkül **nem kezdünk vakon 1/A fejlesztést**.

---

# 29 — HIVATKOZÁSI RENDSZER

A projektben a következő formát használjuk:

- `A/1` = foundation smoke test
- `A/2` = editor audit
- `1/A` = editor lifecycle
- `1/B` = alapelemek
- `1/C` = selection/manipulation
- `1/E` = inspector
- `1/F` = history
- `1/G` = save contract
- `1/H-13` = Core tesztkapu 13. pont
- `2/A` = hierarchy
- `2/F` = Grid
- `2/I` = design system
- `3/A` = canvas
- `4/C` = responsive inheritance
- `5/D` = Draft/Preview/Publish
- `5/F` = autosave/recovery
- `6/C` = Schedule oldal
- `9/A` = R2 storage
- `11/A` = Twitch integráció
- `13/B` = Restore
- `16/C` = AI safety
- `17/C` = élő AI segítség
- `17/F` = Clip/Short pipeline
- `19/D` = regresszió

Ha a felhasználó csak egy ilyen azonosítót ír, a fejlesztést abból a pontból kell folytatni.

---

# 30 — MASTER TERV MÓDOSÍTÁSI SZABÁLY

A terv módosítható, ha:
- új szükséges funkció merül fel;
- technikai korlát miatt más sorrend kell;
- biztonsági vagy adatmodell-követelmény változik;
- a felhasználó új végcélt határoz meg;
- a benchmark/audit olyan szükséges editorfunkciót tár fel, amely nélkül a célrendszer hiányos lenne.

Módosításkor:
1. új pontot adunk hozzá vagy meglévő pontot módosítunk;
2. megőrizzük a korábbi döntés okát;
3. megvizsgáljuk a függőségeket;
4. ellenőrizzük, hogy nem sérül-e a későbbi AI/Editor/Publishing architektúra;
5. ha külső editorból veszünk mintát, dokumentáljuk a forrást és az adaptáció okát;
6. commitoljuk a tervet;
7. a régi terv nem válik csendben érvénytelenné.

**A terv nem díszdokumentum: minden fejlesztésnek vissza kell mutatnia egy MASTER pontra.**
