# Sanci9517 — MASTER FEJLESZTÉSI ÉS TESZTELÉSI TERV

**Verzió:** MASTER-1.0  
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
- audit event ID.

ID nem változhat pusztán áthelyezés vagy átnevezés miatt.

## 02/D Visszaállíthatóság
Minden kritikus módosításnak legyen:
- előző állapota;
- verziója vagy auditja;
- validálható formája;
- lehetőség szerint rollback útja.

---

# 03 — FEJLESZTÉSI KAPUK

## G0 — Foundation
Canonical routing + Worker + D1 + archive + admin alapok.

## G1 — Editor Core
Betöltés + kijelölés + szerkesztés + mentés + reload.

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

## 1/B Alapelemek
- [ ] root
- [ ] container/box
- [ ] section
- [ ] heading
- [ ] paragraph/text
- [ ] button
- [ ] image
- [ ] divider
- [ ] spacer
- [ ] későbbi custom component slot

Minden elem:
- stabil ID;
- type;
- parent ID;
- order;
- props;
- style;
- visibility;
- locked állapot;
- metadata.

## 1/C Selection
- [ ] click select
- [ ] újrakijelölés
- [ ] canvas → tree sync
- [ ] tree → canvas sync
- [ ] multi-select
- [ ] group
- [ ] ungroup
- [ ] lock
- [ ] hide
- [ ] rename

## 1/D CRUD
- [ ] create
- [ ] duplicate
- [ ] delete
- [ ] reorder
- [ ] parenthez adás
- [ ] parentből kivétel
- [ ] másik parentbe helyezés

## 1/E Inspector
- [ ] content
- [ ] typography
- [ ] layout
- [ ] spacing
- [ ] appearance
- [ ] responsive
- [ ] interaction
- [ ] accessibility
- [ ] advanced

## 1/F History
- [ ] undo
- [ ] redo
- [ ] history model
- [ ] history panel
- [ ] entry preview
- [ ] restore history entry
- [ ] history ne sértse a szerver állapotát

## 1/G Save contract
- [ ] dirty state
- [ ] save
- [ ] D1 update
- [ ] save success
- [ ] save failure
- [ ] reload
- [ ] adat megmarad
- [ ] renderer ugyanazt az állapotot látja

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
20. mobil/desktop nem romlik.

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
- [ ] konfliktuskezelés

## 2/C Spacing
- [ ] padding top/right/bottom/left
- [ ] margin top/right/bottom/left
- [ ] gap
- [ ] negative margin
- [ ] shorthand
- [ ] responsive spacing
- [ ] spacing tokens

## 2/D Display
- [ ] block
- [ ] inline-block
- [ ] flex
- [ ] grid
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

## 2/H Overflow
- [ ] visible
- [ ] hidden
- [ ] auto
- [ ] scroll
- [ ] x/y
- [ ] clip

---

# 07 — PHASE 3 / CANVAS ÉS EDITOR UX

## 3/A Canvas
- [ ] center
- [ ] zoom in/out
- [ ] 100%
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

---

# 08 — PHASE 4 / RESPONSIVE ENGINE

## 4/A Devices
- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] custom viewport preview

## 4/B Responsive properties
- [ ] width
- [ ] height
- [ ] padding
- [ ] margin
- [ ] gap
- [ ] font size
- [ ] line height
- [ ] display
- [ ] position
- [ ] alignment
- [ ] visibility

## 4/C Inheritance
- [ ] desktop default
- [ ] tablet override
- [ ] mobile override
- [ ] reset override
- [ ] inherited value display
- [ ] breakpoint validation

## 4/D Responsive gate
Ugyanaz az oldal ellenőrizve:
- editor desktop;
- editor mobile;
- public desktop;
- public mobile;
- reload mindkettőn;
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
- [ ] updated timestamp
- [ ] published timestamp
- [ ] schema version

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

## 5/C Validation
- [ ] schema validation
- [ ] required fields
- [ ] type validation
- [ ] max sizes
- [ ] unsafe HTML filtering
- [ ] invalid nesting
- [ ] unknown element handling
- [ ] migration compatibility

## 5/D Draft/Preview/Publish
- [ ] draft state
- [ ] save draft
- [ ] preview draft
- [ ] published snapshot
- [ ] publish
- [ ] unpublish
- [ ] preview nem ír publicot
- [ ] publish atomic
- [ ] publish audit

## 5/E Versioning
- [ ] version number
- [ ] created by
- [ ] timestamp
- [ ] change summary
- [ ] diff
- [ ] restore
- [ ] rollback
- [ ] rollback audit

---

# 10 — PHASE 6 / VALÓDI SANCI OLDALAK

Minden oldal ugyanazon kapun megy:
`Create → Edit → Save → D1 → Reload → Preview → Publish → Public → Mobile → Desktop`.

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

Minden komponenshez kell:
- schema;
- default props;
- editor preview;
- public renderer;
- responsive behavior;
- accessibility;
- validation;
- stabil ID;
- dokumentáció.

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
- [ ] breakpoints
- [ ] reusable sections
- [ ] templates
- [ ] template cloning
- [ ] global settings

---

# 13 — PHASE 9 / MÉDIA + R2

## 9/A Storage
- [ ] R2 bucket
- [ ] object key stratégia
- [ ] MIME validation
- [ ] size validation
- [ ] upload endpoint
- [ ] secure access

## 9/B Media DB
- [ ] media ID
- [ ] object key
- [ ] filename
- [ ] MIME
- [ ] size
- [ ] dimensions
- [ ] duration
- [ ] alt text
- [ ] created_at
- [ ] references

## 9/C Media UI
- [ ] library
- [ ] search
- [ ] filter
- [ ] upload
- [ ] picker
- [ ] replace
- [ ] delete confirmation
- [ ] orphan detection
- [ ] cleanup

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

## 10/B Schedule frontend
- [ ] calendar/list
- [ ] next stream
- [ ] countdown
- [ ] live status
- [ ] mobile layout

## 10/C Social data model
- [ ] provider
- [ ] account
- [ ] external ID
- [ ] URL
- [ ] cached stats
- [ ] last sync
- [ ] error state

## 10/D VOD
- [ ] import
- [ ] manual add
- [ ] metadata
- [ ] thumbnail
- [ ] category
- [ ] published state

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

## 11/B YouTube
- [ ] OAuth/API credential kezelés
- [ ] channel
- [ ] videos
- [ ] live
- [ ] Shorts
- [ ] sync
- [ ] cache

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

## 12/B Analytics
- [ ] page view
- [ ] CTA click
- [ ] social click
- [ ] stream click
- [ ] VOD click
- [ ] support click
- [ ] anonymized event model
- [ ] admin dashboard

## 12/C Accessibility
- [ ] semantic HTML
- [ ] keyboard navigation
- [ ] focus states
- [ ] labels
- [ ] alt text
- [ ] contrast
- [ ] reduced motion
- [ ] screen reader basic flow

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

## 13/B Restore
- [ ] restore preview
- [ ] selected page
- [ ] selected version
- [ ] whole site
- [ ] validation before restore
- [ ] confirmation
- [ ] rollback on failed restore

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

## 13/D Import/export
- [ ] page export
- [ ] site export
- [ ] schedule export
- [ ] media manifest
- [ ] import validation
- [ ] dry-run import
- [ ] conflict handling
- [ ] import audit

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

## 16/C Safety
- [ ] allowlist
- [ ] action schema
- [ ] permission levels
- [ ] preview
- [ ] confirmation
- [ ] audit
- [ ] rollback
- [ ] destructive action protection

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

## 17/B Élő figyelés
- [ ] csend detektálás
- [ ] túl hosszú csend küszöb
- [ ] beszéd aktivitás
- [ ] chat aktivitás
- [ ] stream technikai hibák
- [ ] audio problémák
- [ ] scene/OBS problémák

## 17/C Segítség
- [ ] „nem beszélsz” jelzés
- [ ] témaváltási ötlet
- [ ] chatből ötlet
- [ ] játékhoz kapcsolódó ötlet
- [ ] technikai ellenőrzés
- [ ] beállítási segítség
- [ ] tesztelési segítség

## 17/D Stream elemzés
- [ ] beszédarány
- [ ] csendek
- [ ] chat aktivitás
- [ ] interakciós események
- [ ] kiemelkedő pillanatok
- [ ] session summary
- [ ] hosszú távú trendek

## 17/E Streamer memory
- [ ] streamer profil
- [ ] preferenciák
- [ ] korábbi tapasztalatok
- [ ] bevált megoldások
- [ ] korábbi hibák
- [ ] célok
- [ ] értékelési ciklus
- [ ] memória törlés/korrekció

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

Az AI nem „öntanuló fekete doboz”: minden releváns változás mérhető, visszakereshető és korlátozható legyen.

---

# 23 — PHASE 19 / TESZTELÉSI RENDSZER

## 19/A Unit
- [ ] schema
- [ ] parser
- [ ] validation
- [ ] service logic
- [ ] auth

## 19/B Integration
- [ ] Worker → D1
- [ ] API → D1
- [ ] editor → API
- [ ] renderer → API/data
- [ ] R2 → media
- [ ] integrations

## 19/C E2E
- [ ] login
- [ ] page edit
- [ ] save
- [ ] reload
- [ ] preview
- [ ] publish
- [ ] public
- [ ] rollback
- [ ] media
- [ ] schedule

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

## 19/E Performance
- [ ] public load
- [ ] API latency
- [ ] editor load
- [ ] D1 query performance
- [ ] asset loading
- [ ] mobile performance

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
13. desktop működik;
14. hibás input kezelve van;
15. audit/rollback megoldott, ha kritikus;
16. nincs ismert regresszió;
17. GitHub commit megtörtént;
18. Cloudflare deploy sikeres;
19. felhasználói teszt sikeres;
20. MASTER pont `[x]`-re frissítve.

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
- `[x]` státuszt feltételezés alapján beállítani.

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

## Nyitott
- [ ] A/1 teljes foundation smoke test dokumentált lezárása
- [ ] A/2 teljes editor audit
- [ ] 1/A editor lifecycle
- [ ] 1/B alapelemek
- [ ] 1/C hierarchy
- [ ] 1/D inspector
- [ ] 1/E save contract
- [ ] 1/H Core tesztkapu
- [ ] további phase-ek a fenti sorrendben

---

# 28 — AKTUÁLIS KÖVETKEZŐ LÉPÉS

## **A/1 — FOUNDATION VÉGLEGES SMOKE TEST**

Ezt kell most végigellenőrizni. Nem módosítunk Visual Editor kódot addig, amíg A/1 nincs kész.

### A/1.1
`/` működik.

### A/1.2
`/p/home` működik.

### A/1.3
Egy további canonical `/p/<slug>` működik.

### A/1.4
Legacy URL-ek canonical URL-re redirectelnek.

### A/1.5
Worker/API health működik.

### A/1.6
D1 pages állapot ellenőrizve.

### A/1.7
Admin login/session működik.

### A/1.8
GitHub branch és HEAD ellenőrizve.

### A/1.9
Aktív `public/` nem tartalmazza a régi publikus HTML-eket.

### A/1.10
Archive branch létezik és megőrzi a régi állapotot.

**A/1 csak akkor `[x]`, ha mind a 10 pontot a felhasználó visszaigazolta.**

## Következő: **A/2 — teljes Visual Editor audit**

A/2-ben először csak feltérképezünk és ellenőrzünk. Utána kezdjük az 1/A pontot.

---

# 29 — HIVATKOZÁSI RENDSZER

A projektben a következő formát használjuk:

- `A/1` = foundation smoke test
- `A/2` = editor audit
- `1/A` = editor lifecycle
- `1/B` = alapelemek
- `1/C` = hierarchy
- `1/E` = save contract
- `1/H-13` = Core tesztkapu 13. pont
- `2/F` = Grid
- `4/C` = responsive inheritance
- `5/D` = Draft/Preview/Publish
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
- a felhasználó új végcélt határoz meg.

Módosításkor:
1. új pontot adunk hozzá vagy meglévő pontot módosítunk;
2. megőrizzük a korábbi döntés okát;
3. megvizsgáljuk a függőségeket;
4. ellenőrizzük, hogy nem sérül-e a későbbi AI/Editor/Publishing architektúra;
5. commitoljuk a tervet;
6. a régi terv nem válik csendben érvénytelenné.

**A terv nem díszdokumentum: minden fejlesztésnek vissza kell mutatnia egy MASTER pontra.**
