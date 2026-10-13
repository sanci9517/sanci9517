**ACTIVE_POINT_ID:** `F0.2-ADMIN-NAVIGATION-GLOBAL-SHELL-ACCEPTANCE`
**ACTIVE_POINT_STATUS:** `ACTIVE — az Admin/Creator Center globális navigációjának, site contextjének, route-jainak, jogosultsági és állapotjelzéseinek valós ellenőrzése és javítása`
**ACTIVE_POINT_TITLE:** Admin navigáció és globális shell acceptance
**ACTIVE_SUBPOINT_ID:** `F0.2-ADMIN-NAVIGATION-GLOBAL-SHELL-ACCEPTANCE`
**ACTIVE_SUBPOINT_STATUS:** `ACTIVE — ellenőrizd az összes látható menülinket, aktív/tervezett/letiltott állapotot, site contextet, auth/role határokat és mobil navigációt; csak létező funkciót mutass működőként`
**PREVIOUS_GATE:** `F0.1 — CLOSED / PASS` (PR #7 squash merge: `047d66f78cc4bdd6c7b50ddd83140d3ddf4aae48`)
**NEXT_GATE:** `F0.2 Admin navigation + global shell acceptance → F0.3 Editor foundation + first vertical slice → F0.4 Visual Builder/Layers/Inspector → további F0.x pontok szigorú sorrendben; M0 audit PASS nem előfeltétel`
**PARALLEL_WORKSTREAMS:** `0`

# Sanci9517 — EGYSÉGES MASTER FEJLESZTÉSI, TESZTELÉSI ÉS FUNKCIÓBŐVÍTÉSI TERV
**Verzió:** MASTER-2.77 — végleges termékleírás, Admin UI-specifikáció és egyetlen függőség-alapú fejlesztési sorrend; a 2.75–2.76 roadmapek történetiek.  
**Frissítve:** 2026-10-13.  
**Dokumentum státusza:** ez az egyetlen végrehajtási igazságforrás.
**Audit / implementation baseline:** GitHub `v2/foundation`, commit `aeba30d9` (2026-10-13). A tervben szereplő régi kód- és tesztállapot nem jelent kész Editor-funkciót; minden F0 képességet a build pont saját acceptance-e igazol.

### Jelenlegi igazolt állapot
Ez a blokk kizárólag az E4/E5/E6 korábban bizonyított lezárt gate-jeit rögzíti. Az M0 auditfázist a felhasználó döntése lezárta / superseded állapotba helyezte; ez nem runtime PASS.
- [x] E4.3.1–E4.3.8 lezárva.
- [x] E4.4.1 final migration design + SQL audit lezárva.
- [x] E4.4.2 implementation/dry-run/remote schema verification lezárva.
- [x] Production `site_id NOT NULL` schema/integrity/ownership ellenőrzés PASS.
- [x] Live Worker/public API smoke PASS.
- [x] E4.4 teljes DoD PASS.
- [x] E5 teljes regression/live/user PASS lezárva.
- [x] E6 closure PASS / lezárva.

**F végrehajtási állapot:** ACTIVE. A 2026-10-13-i MASTER-2.77 termékdöntés alapján az első implementációs pont az Admin főoldal vizuális terve és shellje; az Editor core a következő pont. A felhasználó döntése alapján a M0 audit lezárult mint külön munkafázis, nem PASS-minősítéssel, hanem SUPERSEDED / CLOSED BY PRODUCT DECISION állapottal. A korábbi Editor UI és részleges funkciók nem számítanak késznek; a szükséges képességeket a F0 egymás után végrehajtott, tesztelt fejlesztési pontjai valósítják meg. A lezáratlan audit-tételek nem blokkolók: ahol termékkövetelményt őriznek, átkerülnek a megfelelő buildpont acceptance-ébe.


## HISTORICAL / QUEUED — 00/A.2.2 — F — SCHEDULE CRUD + INSPECTOR / DOMAIN-DRIVEN EDITOR — DEFINITION OF DONE

**Állapot:** HISTORICAL SCOPE / QUEUED. Ez a korábbi F-terv megőrzött definíciója, nem aktív végrehajtási utasítás. A jelenlegi végrehajtási sorrendet kizárólag a dokumentum eleji ACTIVE_POINT_ID és a MASTER-2.77 szekvenciális implementációs program határozza meg; M0 audit PASS nem előfeltétel.

**Cél:** az új, felhasználó által elfogadott Visual Editor-koncepció megvalósítása a meglévő canonical platformra építve. A szerkesztő felülete és interakciós modellje jelentősen újratervezhető vagy újraépíthető; a meglévő UI nem élvez elsőbbséget pusztán azért, mert korábban elkészült. A canonical Page Model, domain ownership, command/history/validation, revision/save/publish és site-ownership boundary viszont megőrzendő, hacsak bizonyított architekturális ok és külön jóváhagyott tervmódosítás mást nem indokol. Ez nem jelent második canonical Editor core-t, Schedule domaint vagy persistence útvonalat.

**Kötelező architekturális szabályok:**
- [x] A canonical Visual Editor kizárólag `public/editor-v2/`.
- [x] A Schedule domain D1-ben marad canonical domain adatként.
- [x] A Page Model/presentation és a Schedule domain adat külön réteg marad.
- [x] Inspector nem hoz létre párhuzamos property/state rendszert.
- [x] Legacy Schedule/Admin/Editor réteg nem aktiválható újra.
- [x] Minden új adatút site-scoped és a lezárt E4 ownership contractot használja.
- [x] Minden új mutation meglévő command/history/validation/persistence/audit mintára épül.

## M0 — GLOBAL PRODUCT REBASELINE + LEGACY / DEAD SURFACE AUDIT — LEZÁRVA / SUPERSEDED

**M0 státusz:** `CLOSED BY USER PRODUCT DECISION — nem PASS auditminősítés; a külön auditfázis megszűnt, mert a fejlesztés a ténylegesen használható termék felépítésével folytatódik.`

**Lezárási döntés:** a felhasználó 2026-10-13-án úgy döntött, hogy a további történeti/strukturális auditkörök helyett a MASTER teljes termékkövetelményeit meg kell őrizni, majd a megvalósítást egymás után végrehajtott, runtime- és felhasználói acceptance-szel lezárt fejlesztési pontokban kell elvégezni. Az M0 alatt nyitva maradt traceability, domain, surface és benchmark tételek nem maradnak külön blokkoló auditfeladatok: a releváns követelményeket a megfelelő implementációs pontok DoD-jába kell átvezetni.

**Kötelező értelmezés a teljes M0.1–M0.13 fejezetre:** az alatta látható régi `[ ]`, `QUEUED`, `PASS előtt`, `csak M0.x PASS után` és korábbi következőlépés-szövegek történeti auditpillanatképek. Ezek nem aktuális fejlesztési utasítások, nem indíthatók újra, és nem blokkolják F0.1-et. Ez nem jelenti az auditpontok teljesítését vagy PASS-át: a külön audit munkafázis SUPERSEDED. A termék-követelmények operatív leírását a közvetlen E/F specifikáció és az egyetlen aktív F0.x pont adja.

**Fontos különbség:** ez nem állítja, hogy a régi Editor/Admin/Schedule kész, biztonságos vagy hibamentes. Az Editor a termékfunkciók szempontjából új fejlesztésnek számít; a meglévő kód csak akkor használható fel, ha az adott buildpontban ténylegesen megfelel és teszttel bizonyítható. A lezárt E4/E5/E6 ownership/regression bizonyítékok érvényben maradnak, amíg konkrét új ellentmondás nem merül fel.

### M0.1 — MASTER teljes funkcióinventár
**Állapot:** `SUPERSEDED / CLOSED AS AUDIT WORK — a nyitva maradt checklist sorok nem külön auditblokkolók; az általuk képviselt követelményeket a releváns F0.x buildpontok DoD-jába kell átvezetni. Nem állítjuk, hogy ezek a funkciók már implementálva vannak.`

- [x] A 01–140 történeti funkciópont egyedi ID-val megőrizve és canonical capability/domain alá rendelve.
- [x] A történeti státuszok a preservation matrixban történeti jelölésként vannak megmagyarázva; nem tekinthetők mai runtime készültségnek.
- [x] KÜLÖN AUDITFELADATKÉNT SUPERSEDED — a régi végrehajtási indexek és roadmap-állapotok nem blokkolók. Az aktív sorrendet a dokumentum eleji ACTIVE_* blokk és az F0.x program adja; a közvetlen követelményeket az E/F fejezet tartalmazza. Ez nem utólagos M0 PASS.
- [x] A korábbi 19–34 backlog hiteles történeti forrása az `aedb2ea` revízióban azonosítva; a 19–34 szakaszok forráskivonata elkészült. A ledger azonosítóinak/rekordszerkezetének korábbi ellenőrzését lezártnak kell tekinteni, és nem szabad pusztán a darabszám-eltérés miatt újra lefuttatni.
- [x] KÜLÖN AUDITFELADATKÉNT SUPERSEDED — a követelmények végrehajtható leírása a 00.9.6.E/F fejezetben található; a régi azonosítók csak forrás-nyomkövetésként maradnak meg. Az esetlegesen később előkerülő konkrét hiányzó capability-t a hozzá tartozó aktív buildpont DoD-jába kell felvenni, nem külön auditprojektet nyitni.
- [x] A 001–140 és H19–H34 történeti azonosítók megőrizve. A közvetlen, fejlesztéshez használható capability-, scope-, fázis- és acceptance-specifikáció az E/F fejezetekben van. A régi táblázat státusza nem jelent mai implementáltságot.
- [x] A duplikált canonical domain elkerülésének aktív szabálya az E.1/E.19 és F0.0 része; a régi auditként elvégzendő általános duplikátumkör SUPERSEDED. Külön capability nem törölhető puszta hasonlóság miatt.
- [x] A termékkövetelmények közvetlen E/F specifikációba való integrálása megtörtént az elérhető források alapján; újonnan azonosított hiányt a pontos fázis DoD-jába kell emelni. A történeti visszaaudit nem blokkoló külön feladat.

**M0.1 audit evidence snapshot — 2026-10-08:**
- [x] `src/index.ts` jelenlegi canonical API/admin/public belépési pontjai ellenőrizve: auth, admin settings/schedule/twitch-schedule-sync/pages/editor, public site-settings/schedule/pages és Twitch integration route-ok regisztrálva.
- [x] `/admin` és `/admin.html` authenticated esetben `/admin/editor` → `public/editor-v2/index.html` felé redirectel; az aktív admin belépési runtime ezért az Editor v2.
- [x] `public/editor-v2/` az aktív canonical Editor runtime; külön `public/editor/` legacy editor-kódbázis továbbra is fizikailag jelen van.
- [x] `public/admin.html` továbbra is fizikailag jelen lévő legacy/admin surface, miközben a router már nem ezt szolgálja ki authenticated `/admin` útvonalon.
- [x] `public/assets/system-page-editor.js` és `system-page-runtime.js`, továbbá `src/routes/admin/system-pages.ts` és `src/routes/public/system-pages.ts` fizikailag jelen vannak; ezek legacy system-page rétegek, ezért M0 alatt explicit KEEP/FIX/MIGRATE/REMOVE/DISABLE/ARCHIVE döntést kell kapniuk.
- [x] `src/core/page-model.ts`, `src/core/editor-validation.ts`, `src/core/domain/contracts.ts`, `src/core/schedule-read.ts` és `src/core/schedule/` jelenlegi canonical backend/domain alapként azonosítva.
- [x] `public/editor-v2/core/commands.js`, `schema.js`, `state.js`, `validation.js`, `property-registry.js`, `responsive.js`, `schedule-schema.js` és `schedule-preview.js` az Editor v2 canonical kliensoldali core-jának részei; külön második canonical core létrehozása tilos.
- [x] Migrations inventory alapján legacy/canonical rétegek történetileg egymás mellett léteznek (`0003_legacy_pages`, `0004_system_page_content`, majd canonical page/revision migrációk), ezért a fizikai legacy maradványok nem tekinthetők automatikusan aktív domainnek.

**M0.1 legacy 01–140 preservation matrix — 2026-10-08**

A korábbi MASTER 44f42403… állapotából visszaolvastuk a **140 számozott funkciópontot**. Egyik sem törlődik. Az alábbi mátrix megőrzi a történeti státuszt és hozzárendeli a jelenlegi canonical product/domain ownerhez. A történeti [x]/[~]/[ ] nem jelenti a mai runtime készültségét; csak a régi állapot bizonyítéka.

| ID | Történeti funkció | Jelenlegi canonical owner / capability | Jelenlegi scope |
|---:|---|---|---|
| 001 | [x] GitHub + Cloudflare alapstruktúra működő branch/deploy útja | Platform foundation / persistence | 1.0 foundation |
| 002 | [~] D1 séma és canonical oldalmodell teljes auditja | Platform foundation / persistence | 1.0 foundation |
| 003 | [~] Legacy → canonical migráció véglegesítése és ellenőrzése | Platform foundation / persistence | 1.0 foundation |
| 004 | [ ] Legacy HTML teljes leválasztása és archiválása | Platform foundation / persistence | 1.0 foundation |
| 005 | [ ] Canonical Page Model kizárólagos aktív használata | Platform foundation / persistence | 1.0 foundation |
| 006 | [ ] D1 draft / published snapshot / revision modell teljes validálása | Platform foundation / persistence | 1.0 foundation |
| 007 | [ ] Revision rollback teljes tesztje | Platform foundation / persistence | 1.0 foundation |
| 008 | [ ] Audit log teljes ellenőrzése | Platform foundation / persistence | 1.0 foundation |
| 009 | [ ] Autosave | Platform foundation / persistence | 1.0 foundation |
| 010 | [ ] Backup / restore | Platform foundation / persistence | 1.0 foundation |
| 011 | [x] Auth / session alap | Auth + Pages/CMS | 1.0 |
| 012 | [x] Editor jogosultság / RBAC alap | Auth + Pages/CMS | 1.0 |
| 013 | [~] Oldallista D1-ből | Auth + Pages/CMS | 1.0 |
| 014 | [~] Egyedi oldal megnyitása D1-ből | Auth + Pages/CMS | 1.0 |
| 015 | [~] Oldal létrehozása | Auth + Pages/CMS | 1.0 |
| 016 | [~] Oldal átnevezése | Auth + Pages/CMS | 1.0 |
| 017 | [~] Oldal törlése | Auth + Pages/CMS | 1.0 |
| 018 | [ ] Slug kezelés és ütközéskezelés teljes UI teszttel | Auth + Pages/CMS | 1.0 |
| 019 | [ ] CMS teljes regressziós teszt | Auth + Pages/CMS | 1.0 |
| 020 | [x] Editor betöltés / boot diagnostics | Visual Editor Core | 1.0 foundation |
| 021 | [x] Canonical Page Model betöltése | Visual Editor Core | 1.0 foundation |
| 022 | [x] Node ID / parent / children modell | Visual Editor Core | 1.0 foundation |
| 023 | [x] Selection alap | Visual Editor Core | 1.0 foundation |
| 024 | [x] Layer tree alap | Visual Editor Core | 1.0 foundation |
| 025 | [x] Command API alap | Visual Editor Core | 1.0 foundation |
| 026 | [x] Undo / redo alap | Visual Editor Core | 1.0 foundation |
| 027 | [x] Element update / add / delete / duplicate commandok alapja | Visual Editor Core | 1.0 foundation |
| 028 | [x] Hierarchy reparent / reorder command alapja | Visual Editor Core | 1.0 foundation |
| 029 | [~] Canvas Engine foundation | Visual Editor Core | 1.0 foundation |
| 030 | [~] Responsive engine foundation | Visual Editor Core | 1.0 foundation |
| 031 | [~] Property Registry foundation | Visual Editor Core | 1.0 foundation |
| 032 | [ ] Canvas Engine tényleges bekötése az Editor rendererbe | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 033 | [ ] Stabil DOM ↔ Page Model node binding | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 034 | [ ] Geometry Inspector | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 035 | [ ] Responsive geometry | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 036 | [ ] Drag | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 037 | [ ] Resize | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 038 | [ ] Snap / guides / alignment | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 039 | [ ] Layer / lock / hide / rename teljes editor UX | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 040 | [ ] Multi-select / group / ungroup | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 041 | [ ] Canvas zoom / fit / grid / viewport UX | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 042 | [ ] Nested hierarchy teljes működése | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 043 | [ ] Invalid nesting védelem | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 044 | [ ] Section / container / row / columns / flex / grid / stack | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 045 | [ ] Layout sizing / spacing / alignment / distribution | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 046 | [ ] Positioning / overflow | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 047 | [ ] Responsive layout szabályok | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 048 | [ ] Typography Inspector | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 049 | [ ] Appearance Inspector | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 050 | [ ] Interaction / accessibility / advanced properties | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 051 | [ ] Property search / reset / validation | Website Builder / Layout / Inspector | 1.0 + 1.x |
| 052 | [ ] Text / rich text | Content / Media / Asset | 1.0 foundation + 1.x |
| 053 | [ ] Image / video / embed | Content / Media / Asset | 1.0 foundation + 1.x |
| 054 | [ ] Button / link / CTA | Content / Media / Asset | 1.0 foundation + 1.x |
| 055 | [ ] Card / list / table / accordion / tabs | Content / Media / Asset | 1.0 foundation + 1.x |
| 056 | [ ] Social és streamer blokkok | Content / Media / Asset | 1.0 foundation + 1.x |
| 057 | [ ] Twitch / YouTube / TikTok / Discord blokkok | Public social-link blocks + platform adapters | 1.0 simple links and explicitly scoped Twitch blocks; YouTube/TikTok/Discord API-backed integration blocks 1.x (00.9.6.D PHASE 2) |
| 058 | [ ] Schedule / Live / Countdown / VOD blokkok | Content / Media / Asset | 1.0 foundation + 1.x |
| 059 | [ ] Form / contact blokkok | CMS / Form domain + secure submission boundary | 1.0 contact/content block only; secure form submission and backend actions 1.x (00.9.6.D PHASE 2) |
| 060 | [ ] Media library / R2 | Content / Media / Asset | 1.0 foundation + 1.x |
| 061 | [ ] Draft | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 062 | [ ] Preview | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 063 | [ ] Publish | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 064 | [ ] Public renderer canonical published documentből | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 065 | [ ] Public / draft izoláció | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 066 | [ ] Revision history UI | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 067 | [ ] Rollback UI | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 068 | [ ] Import / export | Publishing / Revision / Import-Export | 1.0 backup/recovery export only where required by the release gate; user-facing import/export workflow 1.x/2.x after contract freeze (00.9.6.D PHASE 2) |
| 069 | [ ] Főoldal | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 070 | [ ] Twitch | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 071 | [ ] YouTube | Public Website / social-link presentation | 1.0 static channel/link presentation only; YouTube API integration 1.x (00.9.6.D PHASE 2) |
| 072 | [ ] TikTok | Public Website / social-link presentation | 1.0 static channel/link presentation only; TikTok API integration 1.x (00.9.6.D PHASE 2) |
| 073 | [ ] Adásrend | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 074 | [ ] Következő adás / countdown | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 075 | [ ] Élő / offline állapot | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 076 | [ ] VOD / Shorts / Clips | Public link/embed baseline + Stream Media/Content domain | 1.0 external links/basic embeds only if in release scope; canonical VOD/Clips/Shorts workflows 1.x (00.9.6.D PHASE 2) |
| 077 | [ ] Rólam | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 078 | [ ] Közösség / Discord | Public community links + Community domain | 1.0 public community link/basic entry only; deeper integrations/community workflows 1.x (00.9.6.D PHASE 2); memberships 5.x where applicable |
| 079 | [ ] Kapcsolat | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 080 | [ ] Támogatás | Public support content/link + Support/Membership domain | 1.0 static support content/external link only; supporter programs and membership workflows 5.x (00.9.6.D PHASE 6) |
| 081 | [ ] Szponzor / üzleti / Press Kit | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 082 | [ ] 404 / loading / empty / error állapotok | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 083 | [ ] Egységes mobil / tablet / desktop UX | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 084 | [ ] SEO / Open Graph / structured data | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 085 | [ ] Accessibility | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 086 | [ ] Performance / caching | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 087 | [ ] Schedule D1 rendszer | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 088 | [ ] Twitch API / live state | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 089 | [ ] YouTube API | YouTube platform adapter under Integration/Platform contract | 1.x (00.9.6.D PHASE 2); not a 1.0 API integration |
| 090 | [ ] TikTok rendszer | TikTok platform adapter under Integration/Platform contract | 1.x (00.9.6.D PHASE 2); not a 1.0 API integration |
| 091 | [ ] VOD rendszer | Stream Media/Content domain + provider adapters | 1.x canonical VOD/Clips workflows (00.9.6.D PHASE 2); simple links/embeds are a separate public-site scope |
| 092 | [ ] Community / Discord | Community domain + Discord integration adapter | 1.0 public link baseline only if approved; deeper integration/community 1.x (PHASE 2); membership/support 5.x (PHASE 6) |
| 093 | [ ] Contact / collaboration | Public contact entry + later collaboration/CRM domains | 1.0 contact entry only; team/collaboration workflows 4.x (PHASE 5); creator CRM/fan relationships 5.x (PHASE 6) |
| 094 | [ ] Site settings | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 095 | [ ] Analytics | Release/operational telemetry + Creator Analytics domain | 1.0 release/operational telemetry only; Creator Analytics 2.x (PHASE 3); advanced analytics 4.x (PHASE 5) |
| 096 | [ ] Unit tesztek | QA / Security / Production | 1.0 gates |
| 097 | [ ] API / integration tesztek | QA / Security / Production | 1.0 gates |
| 098 | [ ] D1 tesztek | QA / Security / Production | 1.0 gates |
| 099 | [ ] E2E / browser tesztek | QA / Security / Production | 1.0 gates |
| 100 | [ ] Regression tesztek | QA / Security / Production | 1.0 gates |
| 101 | [ ] Security hardening | QA / Security / Production | 1.0 gates |
| 102 | [ ] Observability / error reporting | QA / Security / Production | 1.0 gates |
| 103 | [ ] Production backup / recovery teszt | QA / Security / Production | 1.0 gates |
| 104 | [ ] Production release checklist | QA / Security / Production | 1.0 gates |
| 105 | [ ] Stabil page / node / component / action / revision / media / schedule ID-k | Platform contracts / Governance / AI-ready actions | 1.0 foundation + post-1.0 |
| 106 | [ ] Strukturált page model teljes lezárása | Platform contracts / Governance / AI-ready actions | 1.0 foundation + post-1.0 |
| 107 | [ ] Közös Action API az Editor és későbbi AI számára | Platform contracts / Governance / AI-ready actions | 1.0 foundation + post-1.0 |
| 108 | [ ] Permission / approval / audit réteg | Platform contracts / Governance / AI-ready actions | 1.0 foundation + post-1.0 |
| 109 | [ ] Preview-before-apply / rollback mechanizmus | Platform contracts / Governance / AI-ready actions | 1.0 foundation + post-1.0 |
| 110 | [ ] AI Orchestrator | SANCI AI / Creator Intelligence | post-1.0 |
| 111 | [ ] Agent / Tool / Model Registry | SANCI AI / Creator Intelligence | post-1.0 |
| 112 | [ ] Task Planner / Context Selector | SANCI AI / Creator Intelligence | post-1.0 |
| 113 | [ ] Permission Checker / Approval Flow | SANCI AI / Creator Intelligence | post-1.0 |
| 114 | [ ] Execution / verification / recovery | SANCI AI / Creator Intelligence | post-1.0 |
| 115 | [ ] Multi-model routing | SANCI AI / Creator Intelligence | post-1.0 |
| 116 | [ ] Web Engineer Agent | SANCI AI / Creator Intelligence | post-1.0 |
| 117 | [ ] Visual Editor Agent | SANCI AI / Creator Intelligence | post-1.0 |
| 118 | [ ] QA Agent | SANCI AI / Creator Intelligence | post-1.0 |
| 119 | [ ] GitHub / Cloudflare Engineer Agent | SANCI AI / Creator Intelligence | post-1.0 |
| 120 | [ ] Browser QA AI | SANCI AI / Creator Intelligence | post-1.0 |
| 121 | [ ] Stream observation | SANCI AI / Creator Intelligence | post-1.0 |
| 122 | [ ] Silence / pacing detection | SANCI AI / Creator Intelligence | post-1.0 |
| 123 | [ ] Chat / context analysis | SANCI AI / Creator Intelligence | post-1.0 |
| 124 | [ ] Contextual live suggestions | SANCI AI / Creator Intelligence | post-1.0 |
| 125 | [ ] Streamer profile / long-term memory | SANCI AI / Creator Intelligence | post-1.0 |
| 126 | [ ] Experience learning / evaluation cycles | SANCI AI / Creator Intelligence | post-1.0 |
| 127 | [ ] One-click clip / Short creation | SANCI AI / Creator Intelligence | post-1.0 |
| 128 | [ ] Stream setup diagnostics assistant | SANCI AI / Creator Intelligence | post-1.0 |
| 129 | [ ] AI control center | SANCI AI / Creator Intelligence | post-1.0 |
| 130 | [ ] End-to-end AI platform test | SANCI AI / Creator Intelligence | post-1.0 |
| 131 | [ ] Teljes public website teszt | Final production QA / release gates | 1.0 production gates |
| 132 | [ ] Teljes admin / CMS teszt | Final production QA / release gates | 1.0 production gates |
| 133 | [ ] Teljes Visual Editor teszt | Final production QA / release gates | 1.0 production gates |
| 134 | [ ] D1 / R2 / integrations teszt | Final production QA / release gates | 1.0 production gates |
| 135 | [ ] Mobile / tablet / desktop teszt | Final production QA / release gates | 1.0 production gates |
| 136 | [ ] Security / permissions teszt | Final production QA / release gates | 1.0 production gates |
| 137 | [ ] Performance / accessibility teszt | Final production QA / release gates | 1.0 production gates |
| 138 | [ ] Backup / restore / disaster recovery teszt | Final production QA / release gates | 1.0 production gates |
| 139 | [ ] Regression teszt | Final production QA / release gates | 1.0 production gates |
| 140 | [ ] Production release jóváhagyás | Final production QA / release gates | 1.0 production gates |

**M0.1 megállapítás:** a korábbi 01–140 backlog **nem veszett el**; minden pontnak van jelenlegi helye a rebaselined platform mapben. Ahol a régi pont több mai capability-re bomlik (pl. 60 Media library → Central Resource + Asset Manager + storage boundary; 55 Card/list/table/accordion/tabs → Component/Interaction system), ott nem összevonással töröljük, hanem egyedi feature-ként megőrizzük a traceabilityt.

**M0.1 történeti auditpillanatkép — SUPERSEDED:** az akkori megállapítás a 2026-10-13-i termékdöntés előtt rögzült; nem aktuális státusz és nem írhatja felül az aktív F0.1 pontot. Az audit külön fázisként nem kapott PASS-t és nem kell újraindítani. A közvetlen termékkövetelmények a MASTER E/F fejezeteiben, a megvalósítási acceptance pedig az aktív buildpontban található.

### M0.1 teljes MASTER-audit — szerkezeti bizonyíték és nyitott korrekciók (2026-10-13)

**Ellenőrzött struktúra — a GitHub `v2/foundation` ág `9a6ae12` snapshotja alapján:**
- A 01–140 preservation matrix 140 sort tartalmaz, azonosítói 001–140 között folytonosak, hiányzó vagy duplikált ID nélkül.
- A H19–H34 ledger 271 egyedi sort tartalmaz: 267 történeti követelmény/procedure item és 4 kifejezetten kiegészítő architekturális/governance sor (`H21.22`, `H31.00`, `H33.00`, `H34.00`). A kiegészítő sorok nem számolhatók történeti checklist feature-ként.
- A H19–H34 ledger egyedi ID-i nem duplikálódnak; a forrás szerinti sorok és a ledger számai szakaszonként egyeztethetők. Ez a strukturális egyezés még nem helyettesíti a teljes 00.9.6.C/D capability/phase crosswalket.

**Nyitott, tényleges tartalmi eltérések:**
- A 01–140 matrix négy oszlopos preservation crosswalk; nem tartalmaz minden tételhez külön surface, dependency/boundary, lifecycle/disposition és phase-specifikus DoD/test/acceptance hivatkozást. Ezért a 140 ID megléte önmagában nem teljes M0.1 closure evidence.
- A történeti fázisnevek és a 00.9.6.D canonical lifecycle közötti különbséget capability-határonként kell értelmezni. A 057, 059, 068, 071/072, 076, 078, 080, 089–093 és 095 sorok scope-szövege most különválasztja az 1.0-s egyszerű link/content/telemetry baseline-t a későbbi API-integrációktól, workflow-któl, membershiptől és creator analytics-től. Ez tervszintű besorolás, nem runtime completion.
- A korábbi 00/A és 00.9–00.9.6.B címek nem találhatók meg jelen formában a jelenlegi MASTER-ben; az aktuális ACTIVE_* index és a 00.9.6.C/D roadmap az elsődleges jelenlegi nézet. A korábbi forrásokból esetleg még megőrzendő követelményeket history/archive alapon kell visszavezetni, nem feltételezni, hogy a cím hiánya önmagában funkciótörlést jelent.
- A H19–H34 ledger generic DoD-szövege traceability-feladatot rögzít, nem az egyes jövőbeli implementációk kész DoD-ját. A konkrét engineering pointban kell majd capability-specifikus tesztet, failure case-t és acceptance-t definiálni.

**Történeti auditjegyzet — nem aktív blokkoló:** az akkori M0.1 állapot IN PROGRESS volt. A felhasználó későbbi döntése a külön auditfázist megszüntette; a capability/phase crosswalk és a surface/dependency/lifecycle hiányok releváns követelményeit az F0.x buildpontok acceptance-ébe kell átvezetni. A lezárt szerkezeti ellenőrzéseket nem kell ismételni.

### M0.1 historical traceability ledger — batch 1 (sections 19–22)

**Forrás:** a korábbi MASTER `aedb2ea` revíziójából kinyert `19–34` történeti szakaszok; a lokális auditkivonat 2026-10-09-én ellenőrizve. Ez a ledger a követelményeket egyedi ID-val őrzi meg, és nem állít runtime készültséget.

**Értelmezési szabály:** a `C.4–C.8` hivatkozások a jelenlegi canonical capability-owner fejezetek. A fázisbesorolás a `00.9.6.D` roadmaphoz igazítandó; ahol a történeti pont nem bizonyítja önmagában a pontos fázist, a megadott fázis előzetes scope-javaslat, nem végrehajtási engedély. A felsorolt követelmények státusza a megfeleltetés után is `PLANNED / runtime not verified`, amíg külön implementációs DoD, teszt és elfogadási bizonyíték nincs.

| Historical ID | Történeti követelmény | Canonical owner / fejezet | Surface | Phase / scope | Dependency / boundary | Lifecycle | DoD / test / acceptance |
|---|---|---|---|---|---|---|---|
| H19.01 | upload | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.02 | folders | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.03 | search | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.04 | filter | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.05 | preview | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.06 | metadata | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.07 | alt text | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.08 | crop | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.09 | resize | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.10 | replace | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.11 | archive/delete | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.12 | usage tracking | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.13 | unused media detection | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.14 | MIME validation | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.15 | file-size limits | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.16 | secure object keys | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.17 | image optimization | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.18 | video/audio | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.19 | clip/Short assets | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H19.20 | cache policy | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.01 | D1 binding | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.02 | site settings | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.03 | schedule | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.04 | Twitch | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.05 | YouTube | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.06 | TikTok | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.07 | Discord | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.08 | VOD | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.09 | collections | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.10 | API data source | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.11 | loading state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.12 | empty state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.13 | error state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.14 | conditional rendering | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.15 | data transforms | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.16 | caching | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.17 | stale-data handling | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H20.18 | binding validation | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.01 | Twitch OAuth | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.02 | Twitch live/offline | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.03 | Twitch title | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.04 | Twitch game | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.05 | Twitch viewer statistics | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.06 | Twitch followers/subscribers where available | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.07 | Twitch VOD | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.08 | Twitch clips | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.09 | Twitch events/webhooks where applicable | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.10 | YouTube channel | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.11 | YouTube videos | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.12 | YouTube Shorts | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.13 | YouTube statistics where available | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.14 | YouTube API quota/error handling | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.15 | TikTok profile | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.16 | TikTok supported content integration | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.17 | TikTok API capability review | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.18 | TikTok rate limits/fallback | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.19 | Discord community link | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H21.20 | Discord optional integration | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Discord integration staged by D roadmap unless explicitly approved for 1.0 | Optional integration; least-privilege permissions; OAuth/session security where applicable | Historical checkbox mapped; runtime not verified by this mapping | Define the supported Discord capability, permissions, failure behavior and acceptance tests in its phase-specific engineering point |
| H21.21 | Discord status where justified | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Only where a concrete user-facing status use case justifies it; phase per D roadmap | Must not imply a live Discord integration unless a real supported status source exists | Historical checkbox mapped; runtime not verified by this mapping | Document the justified status use case and data source; test unavailable/stale status and fallback behavior |
| H21.22 | Architecture constraint: keep secrets in Cloudflare Secrets; normalize external APIs behind services | Integration/Platform contract + Streamer domain (C.7), aligned with Security/Auth (H28.10) | Worker secrets/configuration + server-side service adapters | Cross-cutting architecture constraint; apply whenever external integrations are implemented | No client-side secret exposure; provider-specific APIs remain behind normalized server-side service boundaries | Source architecture rule retained separately from the 21 checkbox requirements; runtime not verified by this mapping | Verify secret handling and adapter boundaries in the relevant integration DoD; do not treat this row as a separate product feature |
| H22.01 | schedule CRUD | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.02 | recurring schedule | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.03 | timezone handling | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.04 | next-stream calculation | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.05 | countdown | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.06 | live state | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.07 | game/category | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.08 | stream type | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.09 | VOD ingestion | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.10 | VOD categorization | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.11 | VOD search/filter | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.12 | Shorts management | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.13 | clips management | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.14 | content calendar | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.15 | platform-specific variants | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.16 | title/description/hashtag suggestions | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.17 | thumbnail brief | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.18 | publishing workflow | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |
| H22.19 | performance feedback loop | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point |

**Történeti batch 1 megjegyzés:** a 19–22 fejezet ledgerje megmarad traceability-forrásként. Az akkori hiányzó auditkörök nem blokkolják a buildet; az érintett képességek az F0.x és későbbi fázisok DoD-jában kapnak tesztelhető megvalósítási követelményt.

### M0.1 historical traceability ledger - batch 2 (sections 23-34)

**Source:** historical MASTER UTF-8 extract from commit aedb2ea, sections H23-H34. Entries preserve historical requirements; they do not prove runtime completion.

**Historical-only rule:** these phase labels are preserved as origin/traceability data and do not govern current execution. The direct current specification is in MASTER sections 00.9.6.E/F and the release/fase order is in 00.9.6.D/F0.x. The former M0 scope-freeze gate is superseded. Runtime status may change only with the relevant build point's DoD, test and acceptance evidence.

| Historical ID | Historical requirement | Canonical owner / section | Surface | Phase / scope (provisional) | Dependency / boundary | Lifecycle | DoD / test / acceptance |
|---|---|---|---|---|---|---|---|
| H23.01 | event model | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.02 | click | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.03 | hover | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.04 | focus | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.05 | active | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.06 | submit | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.07 | scroll | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.08 | load | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.09 | timer | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.10 | open/close | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.11 | navigation | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.12 | show/hide | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.13 | toggle | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.14 | state machine | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.15 | transition | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.16 | animation timeline | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.17 | keyframes | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.18 | reduced-motion | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.19 | interaction validation | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H23.20 | performance safeguards | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.01 | semantic HTML | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.02 | heading hierarchy | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.03 | alt text | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.04 | labels | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.05 | ARIA | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.06 | keyboard navigation | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.07 | focus order | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.08 | focus visibility | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.09 | contrast warnings | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.10 | screen-reader metadata | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.11 | form validation accessibility | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.12 | editor accessibility checks | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H24.13 | public accessibility audit | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.01 | title | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.02 | description | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.03 | canonical | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.04 | Open Graph | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.05 | X/Twitter card | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.06 | structured data | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.07 | sitemap | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.08 | robots | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.09 | per-page SEO | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.10 | SEO preview | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.11 | redirects | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H25.12 | broken-link detection | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.01 | page views | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.02 | button clicks | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.03 | social clicks | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.04 | stream events | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.05 | conversion events | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.06 | privacy-aware analytics | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.07 | retention policy | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.08 | admin dashboard | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.09 | editor/content performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.10 | content performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.11 | stream performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H26.12 | anomaly detection later | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.01 | dashboard | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.02 | navigation | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.03 | responsive admin | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.04 | diagnostics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.05 | page list | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.06 | content management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.07 | schedule | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.08 | socials | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.09 | VOD | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.10 | media | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.11 | settings | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.12 | SEO | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.13 | analytics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.14 | integrations | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.15 | editor management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.16 | preview | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.17 | recovery | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.18 | history | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H27.19 | permissions | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.01 | HttpOnly | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.02 | Secure cookie | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.03 | SameSite | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.04 | password hash | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.05 | CSRF | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.06 | rate limiting | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.07 | RBAC | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.08 | API authorization | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.09 | public/admin separation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.10 | Cloudflare Secrets | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.11 | audit log | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.12 | input validation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.13 | output validation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.14 | file validation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.15 | replay protection where applicable | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.16 | action permission `can()` checks | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H28.17 | AI permission boundary | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.01 | full backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.02 | page backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.03 | revision backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.04 | media references | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.05 | restore validation | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.06 | rollback | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.07 | import/export JSON | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.08 | migration compatibility | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.09 | backup integrity check | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H29.10 | recovery drill | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.01 | bundle review | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.02 | lazy loading | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.03 | image optimization | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.04 | caching | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.05 | cache invalidation | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.06 | Core Web Vitals | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.07 | rendering performance | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.08 | large-page performance | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.09 | large-tree editor performance | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.10 | history memory limits | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.11 | autosave efficiency | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.12 | API latency monitoring | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.13 | production smoke test | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H30.14 | visual regression baseline | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.00 | AI editor must use the same canonical action system as manual Editor; pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Supplementary architecture contract; not a separate item in historical H31 checklist; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.01 | AI page operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.02 | AI element operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.03 | AI style/layout operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.04 | AI responsive operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.05 | AI content generation | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.06 | AI SEO assistance | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.07 | AI accessibility QA | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.08 | AI visual QA | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.09 | action permissions | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.10 | approval rules | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.11 | rollback | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.12 | audit | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H31.13 | rate/cost controls | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.01 | live stream monitoring | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.02 | silence/speech detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.03 | chat activity analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.04 | technical issue detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.05 | audio problem detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.06 | stream quality checks | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.07 | scene suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.08 | context-aware ideas | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.09 | interesting moment detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.10 | post-stream summary | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.11 | VOD analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.12 | clip candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.13 | Short candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.14 | title/description suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.15 | platform variants | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.16 | thumbnail briefs | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.17 | publishing recommendations | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.18 | content performance analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.19 | streamer profile | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.20 | long-term memory | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.21 | preferences | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.22 | historical outcomes | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.23 | experiment tracking | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.24 | evaluation cycle | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H32.25 | feedback loop | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.00 | Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Supplementary architecture contract; not a separate item in historical H33 checklist; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.01 | scheduled automations | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.02 | event automations | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.03 | content workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.04 | media workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.05 | stream workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.06 | notification workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.07 | retry policy | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.08 | idempotency | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.09 | failure handling | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.10 | permissions | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.11 | audit | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete |
| H33.12 | Queues/Durable Objects only when justified by a real background-task or realtime requirement | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit; queues/Durable Objects only when justified | Architecture constraint retained; runtime not verified by this mapping | Document the concrete background/realtime need and evaluate simpler alternatives before introducing queues or Durable Objects |
| H34.00 | Continuous feature discovery is never permanently closed; repeat the review before every significant Editor/platform extension | Continuous product governance / benchmark process (C.18-C.20) | MASTER roadmap + pre-extension architecture/QA review | Always-on governance rule; not a finite feature or permanently closable milestone | New requirements must be scoped, dependency-mapped, tested, recorded in MASTER, implemented and user-validated | Always-on governance rule; not a finite implementation-completion item | Evidence the review in each significant extension's engineering record and update MASTER when scope changes |
| H34.01 | modern visual builder minták; | Visual Editor / builder architecture (C.9; C.18-C.20) | Pre-extension architecture review; canonical Editor scope | Review topic; the canonical owner and D roadmap determine the phase; not a standalone milestone | Compare builder patterns with the existing Editor architecture; record gaps against canonical owners; do not create duplicate feature work | Historical review topic retained; implementation status must be verified through its canonical owner | M0.1: verify owner and roadmap boundary; record coverage gaps and evidence; do not infer implementation from a roadmap mention |
| H34.02 | GrapesJS / Craft.js / Puck architekturális minták; | Visual Editor / architecture benchmark (C.9; C.18-C.20) | Pre-extension architecture review; public patterns and documented contracts only | Benchmark topic; no independent phase or copied third-party implementation | Assess applicable patterns from GrapesJS, Craft.js and Puck against the existing architecture; respect licenses and avoid duplicate systems | Historical benchmark topic retained; no claim that a particular architecture has been implemented | M0.1: preserve the benchmark requirement; map relevant findings to canonical owners and the D roadmap |
| H34.03 | új responsive/layout megoldások; | Theme/Presentation + Visual Editor + public renderer | Responsive layout, Canvas/Inspector and rendering boundaries | Review topic; scope is determined by the existing responsive/layout owners and D roadmap | Check layout behavior across breakpoints and editor/public rendering; uncovered requirements need an explicitly scoped canonical point | Historical review topic retained; implementation status must be verified through canonical owners | M0.1: cross-reference existing responsive requirements; identify gaps without creating duplicate tasks |
| H34.04 | accessibility; | Accessibility domain (H24) + Editor + public renderer | Accessibility review across editing and published output | Review topic; follow the canonical accessibility scope and D roadmap | Cross-check H24 requirements, keyboard/focus behavior, semantics, labels and accessible editor workflows | Historical review topic retained; H24 coverage does not by itself prove runtime compliance | M0.1: link to H24 and record any uncovered requirement; implementation needs its own tests and acceptance evidence |
| H34.05 | performance; | Performance/Production domain (H30) | Editor, public renderer, data loading and production performance | Review topic; follow the canonical performance scope and D roadmap | Cross-check H30 and relevant editor/content performance requirements; avoid duplicating existing performance work | Historical review topic retained; roadmap presence is not a performance test result | M0.1: map to H30 and record gaps; phase-specific performance thresholds and test evidence remain required |
| H34.06 | reusable components; | Component Registry / Symbols / Reusable Components | Page Model, component definitions, instances and Component Library | Review topic; canonical Component Registry ownership and D roadmap determine the phase | Preserve the distinction between copy/fork templates and shared Symbol definitions; do not create a second registry or Page Model | Historical review topic retained; implementation status must be verified through the canonical component owner | M0.1: cross-reference component and Symbol contracts; record gaps without adding duplicate implementation items |
| H34.07 | design systems; | Theme/Design System / Design Tokens | Theme configuration, tokens, Theme Editor and rendering | Review topic; canonical Theme/Design System ownership and D roadmap determine the phase | Cross-check token ownership, theme revisions and published rendering; do not create a parallel theme/token store | Historical review topic retained; a listed design-system capability is not proof of completion | M0.1: link to the canonical Theme/Design System scope; record gaps and acceptance evidence still needed |
| H34.08 | collaboration/conflict; | Collaboration / concurrency / approvals / conflict handling | Shared editing, mutation boundaries, persistence and user feedback | Review topic; phase depends on the canonical collaboration scope in the D roadmap | Distinguish CMS slug conflicts from concurrent collaborative editing; do not treat one as proof of the other | Historical review topic retained; search matches do not prove full collaboration or concurrency support | M0.1: identify the canonical owner and exact coverage; any uncovered capability requires explicit scoping |
| H34.09 | backup/recovery; | Backup/Restore domain (H29) + relevant Admin recovery flows | Backup, restore, import/export and recovery | Review topic; follow the canonical backup/recovery scope and D roadmap | Cross-check H29 and existing recovery ownership; do not create a parallel backup or restore mechanism | Historical review topic retained; listed requirements do not prove a successful restore | M0.1: link to H29 and record gaps; recovery acceptance requires phase-specific verification |
| H34.10 | AI action safety; | Security/permissions (H28) + AI Editor (H31) + Automation (H33) | AI/action permission boundary, validation, approval, execution and audit | Review topic; follow the canonical security and AI/automation scope in the D roadmap | Cross-check permission checks, canonical actions, validation, preview/diff, approval, verification and audit; no bypass of canonical boundaries | Historical review topic retained; architecture text alone does not prove safe runtime behavior | M0.1: link existing security/AI/automation contracts; gaps require scoped security tests and acceptance evidence |
| H34.11 | stream/content intelligence. | Streamer Intelligence / Content Factory (H32; C.6/C.7/C.16) | Stream Assistant, streamer profile, content insights and related platform adapters | Review topic; individual capabilities follow their canonical phase in the D roadmap | Cross-check H32 and related content/integration owners; account for platform access, privacy, retention and user control | Historical review topic retained; no implication that post-1.0 intelligence features are implemented | M0.1: link existing intelligence/content requirements; record gaps without creating parallel feature rows |
| H34.12 | azonosítás; | Continuous product governance / benchmark process (C.18-C.20) | Pre-extension review record | Identification step under H34.00; not an independent feature or milestone | Starts the H34.00 review cycle; identify the candidate change and its existing owner before scoping | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.13 | cél és felhasználási eset; | Continuous product governance / benchmark process (C.18-C.20) | Pre-extension review record | Goal/use-case definition step under H34.00; not an independent feature or milestone | Depends on H34.12; define the intended user outcome and use case | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.14 | függőségek; | Continuous product governance / benchmark process (C.18-C.20) | Dependency map and review record | Dependency mapping step under H34.00; not an independent feature or milestone | Depends on the defined use case; map prerequisites, downstream consumers and ownership boundaries | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.15 | Page Model/adatmodell; | Canonical Page Model/data-model owner for the proposed extension | Page Model/data-model contract | Page Model/data-model review step under H34.00; not an independent feature or milestone | Depends on H34.14; reuse the canonical Page Model or explicitly scope a reviewed change | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.16 | Command/Action; | Canonical Command/Action owner for the proposed extension | Command/Action contract | Command/Action contract review step under H34.00; not an independent feature or milestone | Depends on the approved data/model boundary; use canonical actions and permission rules | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.17 | Inspector/Canvas/UI; | Canonical Editor/UI owner for the proposed extension | Inspector/Canvas/UI contract | Inspector/Canvas/UI review step under H34.00; not an independent feature or milestone | Depends on the model/action contracts; align UI behavior with the canonical Editor architecture | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.18 | persistence; | Canonical persistence/data owner for the proposed extension | Persistence contract | Persistence review step under H34.00; not an independent feature or milestone | Depends on the model/action contracts; specify persistence, revision and recovery boundaries | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.19 | teszt; | Canonical test/QA owner for the proposed extension | Test plan and evidence | Test-planning and test-evidence step under H34.00; not an independent feature or milestone | Depends on the requirements and contracts; define automated/manual tests and acceptance criteria | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.20 | MASTER-be felvétel; | MASTER roadmap governance (C.18-C.20) | MASTER roadmap and engineering checkpoint | MASTER recording step under H34.00; not an independent feature or milestone | Record owner, phase, dependencies, DoD, tests and acceptance in the single MASTER before implementation | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.21 | implementáció; | Canonical implementation owner approved by the D roadmap | Approved canonical engineering point | Implementation step for an approved, separately scoped extension; not a standalone milestone | Implementation starts only after scope, owner, dependencies, DoD and tests are approved in the canonical roadmap | Historical procedure step retained; actual implementation is governed by its separately approved canonical point | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |
| H34.22 | felhasználói validáció. | User acceptance / product validation for the proposed extension | User validation and acceptance record | User-validation step under H34.00; not an independent feature or milestone | Depends on implementation and test evidence; user validation must not replace automated/security tests | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability |

### M0.2 — Platform domain inventory
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT WORK — a domain és cross-cutting követelmények operatív szerződése az E/F fejezetben, illetve az érintett F0.x acceptance-ben van. Ez a korábbi auditstátusz nem blokkol és nem jelent automatikus runtime PASS-t.`

| Domain | Canonical owner / source of truth | Jelenlegi bizonyított alap | Storage / boundary | Scope | Döntés |
|---|---|---|---|---|---|
| Site | Site Context / site-scoped domain | `src/core/site-context.ts`, site ownership contracts | D1 | 1.0 | KEEP |
| Account / Tenant | Auth + ownership | auth routes/core + site ownership | D1/session | 1.0 foundation | KEEP |
| Pages | Page Model | `src/core/page-model.ts`, page/revision migrations | D1 | 1.0 | KEEP |
| Navigation | Page order / public menu contract | page sort-order + public renderer path | D1/Page Model | 1.0 | KEEP |
| Content / CMS | CMS/Content domain | legacy backlog + canonical content contracts to be completed | D1 | 1.0 foundation / 1.x richer | EXPAND |
| Schedule | Schedule domain | `src/core/schedule/`, `schedule-read.ts`, Editor `schedule-schema.js` | D1 | 1.0 | KEEP / SINGLE OWNER |
| Game Profiles | Game Profile domain | product-map scope; no second registry allowed | D1 | 1.0 foundation / 1.x | ADD/EXPAND |
| Platforms | Integration/Platform adapter registry | Twitch foundation; future adapters planned | D1/config | 1.0 Twitch + future | KEEP/EXPAND |
| Streamer Identity | Site/Creator profile domain | product-map scope | D1 | 1.0 | ADD |
| Live State | Integration-derived stream state | Twitch foundation; future adapters | API/cache boundary | 1.0 Twitch | KEEP/EXPAND |
| Media / Assets | Asset domain | product-map only; no canonical Asset DB yet | R2 binary + D1 metadata | 1.0 foundation | ADD FOUNDATION |
| Icons | Icon Registry / Asset reference | product-map only | D1 metadata + R2/SVG | 1.0 foundation | ADD |
| Files / Documents | Resource/Asset domain | product-map only | R2 + D1 metadata | 1.x | ADD |
| Fonts | Asset/Design domain | product-map only | R2 + metadata | 1.x | ADD |
| Theme / Presentation | Theme/Presentation domain | Editor property registry + product-map | D1/Page Model | 1.0 foundation | KEEP/EXPAND |
| Design Tokens | Design System | property registry foundation; token system to formalize | D1/config | 1.0 foundation | ADD/FORMALIZE |
| Components | Component Registry | Page Model + Editor core; registry needs formal contract | Page Model + registry | 1.0 foundation | KEEP/FORMALIZE |
| Reusable Components / Symbols | Component Registry | product-map only | D1 | 1.x | ADD |
| Templates | Template Registry | product-map only | D1 + Asset refs | 1.0 starter / 1.x advanced | ADD |
| Forms | Form domain | legacy feature 059 + product-map | D1 + secure submission boundary | 1.x | ADD |
| Interactions / Motion | Interaction domain | property registry foundation | Page Model/config | 1.0 foundation / 1.x | EXPAND |
| SEO | SEO metadata domain | public/product-map scope | D1/Page Model | 1.0 | KEEP/EXPAND |
| Publishing / Revisions | Revision/Publishing domain | canonical revision migrations + publish path | D1 | 1.0 | KEEP |
| Integrations | Adapter boundary | `src/routes/integrations/`, Twitch core | API secrets/config + D1 | 1.0/1.x | KEEP/EXPAND |
| Twitch | Twitch integration | OAuth/ownership/live/schedule foundations | D1 + external API | 1.0 | KEEP |
| YouTube | Platform adapter | planned only | external API + D1 | 1.x | ADD |
| TikTok | Platform adapter | planned only | external API + D1 | 1.x | ADD |
| Discord / Community | Community integration/domain | planned only | external API + D1 | 1.x | ADD |
| VOD / Clips / Highlights | Content/Stream media domain | planned only | R2 + D1 + external adapters | 1.x | ADD |
| Overlay / Widgets | Stream Studio domain | product-map scope | Page/Widget model + R2/D1 | post-1.0 | ADD |
| OBS Bridge | Integration adapter | product-map scope only | browser-source/integration boundary | post-1.0 | ADD |
| Community | Community domain | product-map scope | D1/external adapters | 1.x/post-1.0 | ADD |
| Support | Support/Funding content | public product scope | D1/config + external provider | 1.0 | KEEP/EXPAND |
| Automation | Automation/Event domain | product-map scope only | D1 + event/queue boundary | post-1.0 | ADD |
| Analytics | Analytics domain | legacy backlog 095 + product-map | analytics store/edge boundary | 1.x | ADD |
| Localization | Locale/content system | HU-first + i18n-ready architecture | D1/Page Model | 1.0 foundation / 1.x | KEEP/EXPAND |
| Permissions | Auth/RBAC/ownership | auth + site ownership foundation | D1/session | 1.0 | KEEP/EXPAND |
| Audit | Audit domain | `src/core/audit.ts` + existing contracts | D1/log boundary | 1.0 | KEEP |
| Backup / Export | Backup/Recovery domain | production backup evidence + legacy 068/103/138 | external export + D1/R2 | 1.0 gate / 1.x | KEEP/EXPAND |
| Marketplace | Template/Asset marketplace | product-map only | future service/storage | post-1.0 | ADD |
| Billing | Commercial layer | product-map only | future provider boundary | post-1.0 | ADD |

**Canonical boundary rules — M0.2 freeze:**
1. **D1 = structured domain metadata/state; R2 = binary assets/media.**
2. **Page Model nem tárol külön Asset/Theme/Component/Schedule adatbázist.** Csak canonical reference/config/binding lehet benne.
3. **Schedule egyetlen domain owner:** `src/core/schedule/` + hozzá tartozó API/storage contract. Az Editor `schedule-schema.js` csak kliensoldali contract/normalizer; nem második Schedule domain.
4. **Editor Property Registry egyetlen property-registry owner.** Új Inspector kategória csak ide kerülhet.
5. **Twitch/YouTube/TikTok/Discord külön adapterek lehetnek, de közös Integration/Platform contract alatt.**
6. **Asset picker, icon picker, template picker, component picker ugyanazt a Resource/Registry réteget használja; nem épül külön, párhuzamos storage.**
7. **Template ≠ Symbol:** Template másolható/forkolható kiindulási állapot; Symbol/Reusable Component közös, változásra reagáló definíció.
8. **Public renderer csak canonical published state-et szolgálhat ki.**
9. **Legacy code jelenléte nem jelent ownershipet.**
10. **Admin menüpont csak canonical capability registryből kaphat ACTIVE állapotot.**

**M0.2 bizonyíték:** a repository jelenlegi core/routes/migrations/editor-v2 felépítése alapján a fenti canonical tulajdonosi modell összeállítható; ahol a capability még csak product-map szinten létezik, azt explicit `ADD/PLANNED` jelöléssel tartjuk nyilván, nem tekintjük késznek.

### M0.2.A — Cross-cutting platform domains, amelyek minden későbbi fázist lefednek
A capability-lista önmagában nem elég: az alábbi keresztmetszeti domainek a teljes 0.x → 10.0 roadmap kötelező platformrétegei, és nem veszhetnek el egyetlen későbbi fázisban sem.

| Domain | Canonical owner / source of truth | Storage / boundary | Scope | Decision / lifecycle |
|---|---|---|---|---|
| Search / Discovery | Platform Search / indexing contract | indexed metadata + D1/R2 refs | 1.x basic search/indexing contract; semantic/multimodal search 8.x (00.9.6.D PHASE 8) | ADD / PLANNED |
| Notifications / Messaging | Notification domain + integration adapters | D1 + provider boundary | 1.x+ notification foundation; automation-triggered notifications 7.x+ (00.9.6.D PHASE 7) | ADD / PLANNED |
| Privacy / Consent / Compliance | Privacy & Policy domain | D1/config + legal/provider boundary | 1.0 foundation / SaaS+ | ADD / PLANNED; 1.0 policy baseline required |
| Secrets / Integration Config | Secret/config boundary | Cloudflare secret/config layer; never Page Model | 1.0+ | KEEP / EXPAND existing secret/config boundary |
| API / Webhook / Developer Surface | Integration/API contract | Worker routes + webhook boundary | 1.0 foundation / 1.x+ | KEEP / EXPAND Worker API; webhook/developer UI PLANNED |
| Deployment / Release / Environments | Release/Deployment domain | Worker/deploy config + environment state | 1.0 gates / SaaS+ | KEEP / EXPAND deployment baseline; richer environments PLANNED |
| Migration / Data Lifecycle | Migration contract | D1 migrations + import/export boundary | 0.x–10.0 | KEEP / EXPAND D1 migration baseline; broader lifecycle contract required |
| Backup / Disaster Recovery | Backup/Recovery domain | D1/R2/export boundary | 1.0 gates / 1.x+ | KEEP / EXPAND; restore/recovery DoD remains release-gated |
| Testing / Quality Gates | QA/Verification contract | CI/test/live acceptance evidence | 0.x–10.0 | KEEP / EXPAND; complete release matrix still required |
| Diagnostics / Observability | Diagnostics/Observability domain | logs/metrics/error boundary | 0.x–10.0 | KEEP / EXPAND existing health/diagnostics; structured observability PLANNED |
| Performance / Caching / Edge | Performance platform contract | Worker/cache/CDN boundary | 1.0+ | KEEP / EXPAND; measured budgets/cache contract required |
| Accessibility | Accessibility contract | Editor + renderer + public UI | 1.0+ | KEEP / EXPAND; do not claim compliance without evidence |
| Billing / Entitlements | Billing/Subscription domain | D1 + payment-provider boundary | 4.0+ | ADD / PLANNED |
| Audit / Governance | Audit + policy contract | D1/log boundary | 0.x–10.0 | KEEP / EXPAND shared audit boundary |
| Data Portability | Import/Export/Portability contract | JSON/media/package boundary | 1.0 backup/recovery gate only; user-facing import/export 1.x/2.x after contract freeze | ADD / PLANNED; contract before implementation |
| Custom Code / HTML / Embed | Secure Embed/Custom-Code contract | sandboxed renderer boundary; never direct privileged persistence | 1.x+ | ADD / PLANNED; sandbox/security contract required |
| Experimentation / Personalization | Experimentation domain | analytics/config/content boundary | 7.0–10.0; advanced personalization/experimentation 9.0 (00.9.6.D PHASE 7–9) | ADD / PLANNED |

**M0.2.A szabály:** ezek nem „extra funkciók”, hanem platform-szintű cross-cutting contracts. Ha egy későbbi capability ezekre támaszkodik, a capability saját domainje nem hozhat létre második auth, permission, audit, resource, search, analytics, notification, deployment, migration vagy persistence rendszert.

**M0.2 canonical alias / parent-child szabályok — a PASS előtt bizonyítandó:**
- A Media/Assets, Files/Documents, Fonts, Logo, Game/Stream artwork és derivatives a közös Resource domain típusai; D1 metadata + R2 binary boundaryt használnak. Az Icon Registry a keresés/kiválasztás/metadata registryje lehet, de nem hozhat létre második binary libraryt.
- A Platform Integrations a közös adapter contract; Twitch, YouTube, TikTok és Discord adapterek. A Discord adapter nem azonos a Community termékdomainnel.
- A Community domain, a Support/Membership termékfunkció és a platform-adapterek külön capabilityk maradnak; a közös link vagy embed nem bizonyít teljes integrációt.
- Account/Tenant az identity/ownership boundary; Auth/RBAC/Permissions közös cross-cutting contract, nem külön domainenként ismételt auth store.
- Backup/Disaster Recovery és Data Portability közös D1/R2/export primitíveket használhat, de külön workflow-k; egyik nem helyettesíti a másik acceptance-ét.
- Analytics (termékhasználati/event adatok), Diagnostics/Observability (hibák/üzemeltetési állapot) és Automation (trigger/action workflow) külön felelősségek; közös infrastruktúra nem jelent azonos domaint.
- Az M0.4 mátrix a jelenlegi implementált ownership bizonyítéka; egy M0.2 sorban szereplő PLANNED domain nem tekinthető implementáltnak csak azért, mert koncepcionális owner/boundary van megadva.

**M0.2 closure checklist — PASS csak mindegyik teljesülése után:**
- [ ] Minden core domain és minden cross-cutting domain szerepel a megfelelő inventoryban.
- [ ] Minden domainhez egy canonical owner, storage/boundary, scope és KEEP/EXPAND/ADD/PLANNED döntés tartozik.
- [ ] A még nem implementált capability-k explicit PLANNED/ADD állapotúak; a tervezett modell nem állítja, hogy a runtime már elkészült.
- [ ] Az inventory és az M0.4 ownership matrix között nincs megmagyarázatlan eltérés vagy párhuzamos owner.
- [ ] A hiányzó vagy összevont domainek döntése indoklással és traceabilityvel dokumentált.
- [ ] Felhasználói áttekintés és MASTER checkpoint rögzítve.

### M0.3 — Admin / Editor / Public surface audit
**Állapot:** `SUPERSEDED / CLOSED AS AUDIT WORK — a korábbi route/surface findings megőrzendők, de a teljes auditlista nem külön blokkoló. A legacy hozzáférés, auth és disposition kérdéseit az Admin/Editor buildpontok és a production readiness DoD-ja ellenőrzi.`

| Surface | Current entry | Canonical runtime | Evidence | Current finding | M0 action |
|---|---|---|---|---|---|
| Admin login | `/admin/login`, `/admin-login.html` | auth login | `src/index.ts` + `public/admin-login.html` | active | KEEP |
| Admin root | `/admin`, `/admin.html` | redirect → `/admin/editor` | `src/index.ts` | `public/admin.html` is physically present but not canonical authenticated runtime | DISABLE/ARCHIVE legacy file after replacement-safe check |
| Canonical Editor | `/admin/editor`; direct static path `/editor-v2/index.html` also needs checking | `public/editor-v2/index.html` | `src/index.ts` auth-gated route + default `ASSETS.fetch(request)` fallback | `/admin/editor` is auth-gated; direct static URL may bypass that route-level gate and must be verified before claiming the shell itself is protected. | KEEP canonical UI; test unauthenticated direct access and redirect/protect it or document an explicit accepted exposure |
| Legacy Editor | `/editor/*` static paths, including `public/editor/preview.html` | none canonical | `src/index.ts` default `ASSETS.fetch(request)` + repository inventory | No route registration does **not** prove unreachability; direct static assets may still be served. Authentication/redirect disposition is unverified. | Verify anonymous direct access; disable/redirect legacy paths, then ARCHIVE/REMOVE after reference scan in M0.9/M0.10 |
| Legacy visual page | `public/visual-page.html` | public renderer shell | `src/index.ts` | active public shell | KEEP until renderer migration is explicitly completed |
| Admin Settings | `/api/admin/settings` | D1 settings | admin settings route + admin.html | active API, but UI is legacy admin surface | MIGRATE UI to canonical Admin/Editor shell |
| Admin Schedule | `/api/admin/schedule` | Schedule domain | `src/routes/admin/schedule.ts` | CRUD API exists and is site-scoped; admin.html has CRUD UI | KEEP domain; MIGRATE UI |
| Editor Schedule node | Page Model Schedule node | `schedule-schema.js` + Schedule domain binding | editor-v2 core | canonical config contract exists | KEEP / EXPAND Inspector later |
| Twitch Schedule Sync | `/api/admin/twitch/schedule-sync` | Twitch adapter → Schedule domain | route + Twitch core | active backend route | KEEP |
| Admin Pages | `/api/admin/pages` | Page Model | pages route + editor-v2 | active | KEEP |
| Admin Editor persistence | `/api/admin/editor` | Revision/Publishing domain | editor route + editor-v2 | active | KEEP |
| Public Pages | `/api/public/pages` | published Page Model | public pages route | active | KEEP |
| Public Schedule | `/api/public/schedule` | Schedule domain read | public schedule route | active | KEEP |
| Legacy System Pages API | `src/routes/admin/system-pages.ts` | none registered in `src/index.ts` | route exists but import/registration absent | dead/unreachable backend surface | DISABLE/ARCHIVE |
| Legacy Public System Pages API | `src/routes/public/system-pages.ts` | none registered in `src/index.ts` | route exists but import/registration absent | dead/unreachable backend surface | DISABLE/ARCHIVE |
| Legacy system-page assets | `/assets/system-page-editor.js`, `/assets/system-page-runtime.js` | none canonical | repository inventory + default `ASSETS.fetch(request)` fallback | Legacy files exist; direct static reachability and references are not yet proven absent. | Verify direct access/reference graph; DISABLE/ARCHIVE/REMOVE according to M0.9/M0.10 disposition |
| Legacy Social Admin source | `public/admin.html` file; `/admin.html` request is intercepted by the auth redirect | none canonical | `src/index.ts` admin-root handler + repository inventory | The physical source file is not the active authenticated Admin runtime; direct asset-file status must not be confused with the `/admin.html` route behavior. | RECLASSIFY its capabilities as PLANNED or MIGRATE; keep the file's final disposition under M0.9/M0.10 |
| Future Admin features | product-map capability registry | future | M0 product map | allowed, but must show explicit PLANNED/BETA/FOUNDATION state | KEEP with feature-state contract |
| Health / DB health | `/api/health`, `/api/db-health` | shared health/DB diagnostic routes | `src/index.ts` + `src/routes/health.ts`, `db-health.ts` | registered API routes omitted from the original surface table | KEEP; include in route inventory and release gates |
| Auth API | `/api/auth/bootstrap`, `login`, `logout`, `session` | shared Auth/session boundary | `src/index.ts` + `src/routes/auth/*` | registered shared security routes omitted from the original surface table | KEEP; one shared auth boundary |
| Twitch integration API | `/api/integrations/twitch/{diagnostic,connect,callback,connection,validation,disconnect}` | Twitch adapter / shared integration boundary | `src/index.ts` + `src/routes/integrations/twitch.ts` | six registered endpoint families were not explicitly listed in the surface inventory | KEEP; include auth/ownership/secret and callback failure cases in the integration evidence |
| Public page shell | `/`, `/index.html`, `/p/*` | `public/visual-page.html` + canonical public renderer/data routes | `src/index.ts` + public pages/schedule routes | public entry/shell is canonical; direct static and API paths still need a complete disposition map | KEEP; verify published-state behavior and all public paths |
| Direct Editor v2 static entry | `/editor-v2/index.html` and `/editor-v2/*` | canonical Editor v2 files; canonical admin entry remains `/admin/editor` | `src/index.ts` default `ASSETS.fetch(request)` fallback | direct static reachability may differ from the auth-gated route; not yet verified by this source audit | Test anonymous access; protect/redirect or explicitly document approved behavior before M0.3 PASS |

**Repository inventory baseline — source-tree evidence at commit `9a6ae12` (not a runtime PASS):**
- 157 tracked repository files; 17 route modules, of which 15 are imported/registered in `src/index.ts` and the two system-pages modules are not registered as API routes.
- 21 SQL migration files.
- 68 files under `public/`: 33 under legacy `public/editor/`, 25 under canonical `public/editor-v2/`, 7 under `public/assets/`, and 3 root HTML files. Five HTML files exist in total; the other two are `public/editor/preview.html` and `public/editor-v2/index.html` already counted in their directories.
- The default `return env.ASSETS.fetch(request)` fallback means absence from the route registry is not proof that a static asset path is unreachable. Every direct Editor/legacy asset entry must be tested unauthenticated and given an explicit disposition.

**Admin Schedule root-cause audit — source-level result:**
- [x] `/api/admin/schedule` exists and performs site-scoped GET/POST/PUT/DELETE against `schedule_items`.
- [x] Schedule mutations use role protection and audit statements.
- [x] Schedule domain is not duplicated in `public/admin.html`.
- [x] Editor Schedule configuration is owned by `public/editor-v2/core/schedule-schema.js`; it does not own D1 schedule records.
- [x] The Editor command path uses the canonical Schedule normalizer; no second Schedule normalizer is permitted.
- [x] The previously observed Admin/Schedule UI flow was rechecked in browser; the user confirmed the Admin → canonical Editor → Schedule flow works. This closes that specific UX reproduction/acceptance item only; it does not close all M0.3 legacy-disposition work.
- [ ] Compare all Schedule fields required by the final product contract against the current admin form. Current legacy admin form exposes title/platform/start/end/status/url/notes, while the canonical product target also requires richer metadata such as artwork, game, timezone/source/sync/recurrence/featured/views/filters/template binding where applicable.
- [x] User acceptance of the tested Admin → canonical Editor → Schedule flow was recorded on 2026-10-08. Richer product-field parity remains a separate scope/contract item and is not implied by this acceptance.

**M0.3 legacy rule:** no dead backend or static legacy surface may remain linked as an ACTIVE Admin capability. Physical legacy files may remain temporarily only under explicit ARCHIVE/MIGRATE status and must have no canonical ownership.

**M0.3 closure checklist — PASS csak mindegyik teljesülése után:**
- [x] Az Admin → canonical Editor → Schedule böngészős útvonalat ellenőriztük; a felhasználói acceptance rögzítve van.
- [ ] A route-, navigation-, static asset- és public surface-leltár teljes; a 17 route-modul, a 68 public asset és a közvetlen statikus belépési útvonalak runtime szinten is ellenőrzöttek.
- [ ] Minden leltárelem besorolása canonical active / legacy unreachable / legacy reachable / placeholder-planned / disabled, bizonyítékkal; a route-regisztráció hiánya önmagában nem bizonyít unreachable állapotot.
- [ ] A `/editor-v2/*`, `/editor/*` és legacy system-page assetek anonymous direct-access viselkedése tesztelt, és auth/redirect/disable/archive döntés rögzítve.
- [ ] Minden legacy elem ideiglenes dispositiont és későbbi végrehajtási pontot kap; az M0.9/M0.10 törlési/archiválási feladatait nem kell előre végrehajtani.
- [ ] A Schedule UX jelenlegi acceptance-e és a későbbi termékmezők scope-ja különválasztva van; a hiányzó termékmezők nem minősülnek már elkészült funkciónak.
- [ ] Felhasználói review és MASTER checkpoint rögzítve.

### M0.4 — Canonical ownership matrix freeze
**Állapot:** [x] PASS — 2026-10-08; ownership contract, repository mutation-map, runtime/browser verification és user acceptance lezárva. M0.4 nem nyit új engineering workstreamet.

**M0.4 célja:** minden canonical domainhez pontosan egy source of truth, storage owner, mutation boundary, UI owner, public consumer, revision/publish lifecycle és permission boundary tartozzon. A történeti feature-ek több helyről származhatnak, de canonical ownershipből csak egy lehet.

### M0.4 evidence round 1 — repository baseline
- [x] Canonical Site Context exists: `src/core/site-context.ts`.
- [x] Canonical Page Model exists: `src/core/page-model.ts`; legacy document input is normalized into the canonical page-document shape rather than creating a second Page Model.
- [x] Shared domain contracts exist in `src/core/domain/contracts.ts` for assets, game profiles, schedule events and presentation/theme state.
- [x] Publish validation is centralized in `src/core/editor-validation.ts`, including canonical page hierarchy and Schedule-node contract validation.
- [x] Audit mutation evidence exists in `src/core/audit.ts` through the server-side `audit_log` boundary.
- [x] Schedule read ownership is explicit in `src/core/schedule-read.ts`; Schedule integration code is grouped under `src/core/schedule/`.
- [x] Editor Inspector property ownership is centralized in `public/editor-v2/core/property-registry.js`.
- [x] Editor Schedule configuration ownership is isolated to `public/editor-v2/core/schedule-schema.js`; the module explicitly does not own Schedule domain records.
- [x] Initial duplicate-storage search did not reveal a second canonical Asset/Media/Theme/Component/Template table in the indexed repository evidence.
- [x] The existing evidence supports the ownership matrix as the current canonical baseline.

### M0.4 evidence round 2 — high-risk domain findings
- [x] **Schedule:** canonical storage/API path is identifiable; no second schedule table was found by targeted repository search. The Editor schedule schema is a client configuration contract, not a second Schedule record store.
- [x] **Publishing/Revisions:** canonical revision linkage is represented by migration `0010_canonical_revision_contract.sql`, including `pages.published_revision_id → editor_revisions(id)`.
- [x] **RBAC/Auth:** the MASTER and current canonical route structure identify Auth/RBAC as a shared boundary; no domain-specific RBAC store was found in targeted search.
- [x] **Integration ownership:** Twitch is implemented as an adapter/integration boundary; YouTube/TikTok/Discord remain planned/future adapters rather than parallel streamer-domain stores.
- [x] **Legacy editor:** the repository still contains legacy editor files; these are not evidence of a second canonical ownership and remain subject to the explicit legacy disposition gate.
- [x] **Resource/Theme/Component/Template:** targeted code search did not find implemented parallel canonical stores for these future domains. This is a **planned-domain gap**, not permission to invent parallel storage later; M0.5/M0.6 must freeze their contracts before implementation.
- [x] **Historical public pages:** old `public/*.html` surfaces contain placeholder/legacy content and are not to be promoted back to canonical ownership; routing/legacy disposition remains an M0.9/M0.10 closure item.

**Round 2 conclusion:** no confirmed duplicate canonical owner was found in the targeted high-risk search. M0.4 nevertheless remains [~] until repository-wide mapping, legacy disposition and runtime/user acceptance are closed.

### M0.4 evidence round 3 — canonical mutation/ownership path audit
- [x] **Page Model boundary:** `src/core/page-model.ts` normalizes legacy documents into the canonical `sanci-page-document` shape; it does not introduce a second domain database.
- [x] **Shared contracts:** `src/core/domain/contracts.ts` is the common contract layer for MediaAsset, GameProfile, ScheduleEvent and presentation/theme state; normalization is centralized there.
- [x] **Site context:** `src/core/site-context.ts` provides the canonical site-context boundary; current default site is explicit rather than inferred from individual domains.
- [x] **Schedule read boundary:** `src/core/schedule-read.ts` reads canonical `schedule_items` with site scoping and controlled filters; the Editor Schedule schema remains configuration-only.
- [x] **Publish validation:** `src/core/editor-validation.ts` centrally validates canonical page structure and Schedule-node configuration before publish.
- [x] **Audit boundary:** `src/core/audit.ts` writes through the shared `audit_log` mutation boundary instead of creating domain-specific audit stores.
- [x] **Inspector ownership:** `public/editor-v2/core/property-registry.js` is the single extensibility boundary for Inspector properties; mutation is delegated to the Core command API.
- [x] **Schedule config ownership:** `public/editor-v2/core/schedule-schema.js` explicitly states that it owns only Page Model Schedule-node configuration, while Schedule records remain outside Page Model.
- [x] **Canonical command model:** the Editor Core command layer provides the mutation/history boundary for document state; direct feature-specific Inspector mutation is not established by the audited files.

**Round 3 historical snapshot:** at the time of this round, runtime/browser evidence and later route-level closure evidence had not yet been recorded. This snapshot is superseded by evidence round 4 and the explicit M0.4 closure gate below; it must not be read as the current status.

### M0.4 evidence round 4 — route-level mutation map / repository-wide active-path baseline
- [x] **Schedule mutation path:** `src/routes/admin/schedule.ts` is the active CRUD owner for `schedule_items`; all CRUD queries are site-scoped and create/update/delete operations append shared audit records.
- [x] **Editor persistence path:** `src/routes/admin/editor.ts` owns Editor v2 save/publish/rollback persistence through `pages` + `editor_revisions`; expected-version conflict protection is present.
- [x] **Page management path:** `src/routes/admin/pages.ts` owns canonical page metadata/order/create/delete operations and uses the same `pages` + `editor_revisions` model and shared audit boundary.
- [x] **Public read path:** `src/routes/public/pages.ts` serves published page snapshots by default; draft access requires authenticated Editor role. `src/routes/public/schedule.ts` delegates to the canonical Schedule read service.
- [x] **Twitch integration path:** `src/routes/integrations/twitch.ts` uses site/user ownership checks and the shared audit boundary; it does not introduce a second streamer/site ownership model.
- [x] **Auth path:** `src/core/auth/require-auth.ts` resolves the active user/session and applies the shared role hierarchy; domain routes do not define separate authentication stores.
- [x] **Repository-wide active mutation baseline:** the audited active route families map to the canonical owners already frozen in M0.4. No additional active mutation owner was identified in the inspected route/core surface.

**Round 4 historical snapshot:** the source-level mutation map was consistent with the ownership matrix. The remaining runtime/browser and user-acceptance items were subsequently closed by the M0.4 closure gate below. Complete legacy disposition remains an M0.3/M0.9 concern and is not falsely claimed as complete by M0.4.

### M0.4 closure gate — PASS evidence
- [x] Repository/source-level ownership and active mutation-path audit completed through evidence rounds 1–4.
- [x] High-risk domain ownership checked; no confirmed duplicate canonical owner identified.
- [x] Canonical Admin/Editor/Public route behavior verified against the ownership matrix.
- [x] Worker runtime health verified: `/api/health` returned `200` with `ok:true`.
- [x] Public root `/` verified `200 OK` and canonical visual-page shell.
- [x] Canonical Schedule route `/p/schedule` verified `200 OK`.
- [x] Legacy `/schedule.html` verified `301` to `/p/schedule`.
- [x] Admin runtime verified; Admin → canonical Visual Editor → Schedule navigation verified in browser.
- [x] User acceptance: user confirmed the tested Admin/Editor/Schedule flow is working correctly.
- [x] M0.4 closure conclusion: ownership is frozen; no duplicate canonical system was introduced; remaining M0 work continues only under the single M0 active point.


| Domain | Source of truth | Storage owner | Mutation boundary | UI owner | Public consumer | Revision / publish | Permission |
|---|---|---|---|---|---|---|---|
| Site / Site Context | Site Context + site contract | D1 | site-scoped server boundary | Creator Center / Editor | public renderer | site revision/publish | site owner |
| Account / Tenant | Auth + ownership | D1/session | auth/ownership boundary | Creator Center settings | none | account state | account/tenant |
| Pages | Page Model | D1 | canonical Editor commands/API | Visual Editor | published renderer | Revision/Publishing | site roles |
| Navigation | Page order/navigation contract | D1/Page Model | Page/navigation mutation API | Editor / Creator Center | public nav | published revision | site roles |
| CMS / Content | CMS/Content domain | D1 + R2 refs | CMS mutation API/commands | Creator Center/CMS | published bindings | content revisions | content roles |
| Schedule | Schedule domain | D1 | Schedule service/API | Schedule Editor/Inspector | public schedule | schedule state + publish binding | site roles |
| Game Profiles | Game Profile domain | D1 | Game Profile service/API | Creator Center | public bindings | revision/publish as applicable | site roles |
| Platform Integrations | Integration/Platform registry | D1 + secret/config boundary | adapter service/API | Integrations UI | adapter-fed public data | config/revision as applicable | integration/admin roles |
| Streamer Identity | Creator profile domain | D1 | profile mutation API | Creator Center | public profile | profile publish | site roles |
| Live State | integration-derived Live State | provider/cache boundary | adapter sync/read boundary | Stream Center | live widgets/public renderer | ephemeral; no Page Model ownership | integration roles |
| Resources / Assets | Resource/Asset registry | R2 binary + D1 metadata | Resource service/API | Resource Library + pickers | published asset refs | asset metadata/version | site/media roles |
| Icons | Icon Registry | D1 metadata + R2/external refs | Icon Registry service | Icon picker/Editor | published icon refs | registry/version | site/design roles |
| Files / Documents | Resource domain | R2 + D1 metadata | Resource service | Resource Library | published/download refs | metadata/version | site/media roles |
| Fonts | Resource/Design domain | R2 + D1 metadata | Resource service | Theme/Resource UI | published theme refs | version/publish | site/design roles |
| Theme / Presentation | Theme/Presentation domain | D1 | Theme commands/API | Theme/Design UI + Inspector | renderer | draft/published presentation | design/site roles |
| Design Tokens | Design System | D1 | Theme/Design commands | Theme Editor | renderer | theme revision/publish | design/site roles |
| Components | Component Registry | D1/Page Model refs | Component service/commands | Editor + Component Library | renderer | component version/publish | design/site roles |
| Symbols / Reusable Components | Component Registry | D1 | Symbol mutation boundary | Component Library/Editor | renderer | shared version/publish | design/site roles |
| Templates | Template Registry | D1 + canonical refs | Template service | Template Library/Editor | template start/fork only | template version | site/design roles |
| Forms | Form domain | D1 + secure submission boundary | Form service/action boundary | Editor + Form Manager | public form runtime | form version/publish | site/admin roles |
| Interactions / Motion | Interaction contract | Page Model/config | Editor command/validation boundary | Inspector | renderer/runtime | page revision/publish | editor roles |
| SEO / AEO | SEO metadata contract | D1/Page Model | SEO mutation boundary | Page/SEO Inspector | renderer/head metadata | publish | content/site roles |
| Publishing / Revisions | Revision/Publishing domain | D1 | publish/rollback service | Creator Center/Editor | public renderer | canonical lifecycle | publisher roles |
| Twitch | Twitch adapter | D1 + provider boundary | Twitch integration service | Integrations/Stream Center | public live/schedule bindings | adapter sync state | integration roles |
| YouTube | YouTube adapter | D1 + provider boundary | YouTube integration service | Integrations/Stream Center | future public bindings | adapter sync state | integration roles |
| TikTok | TikTok adapter | D1 + provider boundary | TikTok integration service | Integrations/Stream Center | future public bindings | adapter sync state | integration roles |
| Discord / Community | Community integration/domain | D1 + provider boundary | community adapter | Community UI | public links/widgets | config/content publish | community roles |
| VOD / Clips / Highlights | Stream Media/Content domain | R2 + D1 | content/media service | Stream Center/CMS | public media pages/widgets | content revision/publish | content roles |
| Overlay / Widgets | Stream Studio domain | D1 + R2 refs | Stream Studio commands/API | Overlay Studio | browser-source/runtime | version/publish | creator/design roles |
| OBS Bridge | OBS integration adapter | integration/config boundary | adapter/browser-source boundary | Stream Studio | external OBS/browser source | config/version | integration roles |
| Community / Support / Membership | Community/Support domain | D1 + provider boundary | support/community service | Creator Center | public support/community | content/config publish | site/admin roles |
| Analytics | Analytics domain | analytics store/edge boundary | analytics ingestion API | Analytics Center | none by default | immutable/event lifecycle | analytics/admin roles |
| Automation | Automation/Event domain | D1 + queue/event boundary | workflow engine | Automation Center | runtime effects only | workflow version | automation roles |
| Localization | Locale/content system | D1/Page Model | locale/content mutation boundary | Localization Center/Editor | locale-aware renderer | locale publish | content/admin roles |
| Permissions / RBAC | Auth/RBAC contract | D1/session | authorization boundary | Security/Settings | enforcement only | policy version as needed | owner/admin |
| Audit / Governance | Audit contract | D1/log boundary | server audit boundary | Diagnostics/Security | none | append-only evidence | admin/auditor |
| Backup / Recovery | Backup/Recovery domain | D1/R2/export | backup/export service | Settings/Recovery | none | snapshot/version lifecycle | owner/admin |
| Search / Discovery | Search/index contract | indexed metadata + canonical refs | indexing/search service | Library/CMS/Creator Center | public search later | index rebuild lifecycle | scoped roles |
| Notifications / Messaging | Notification domain | D1 + provider boundary | notification service | Creator Center | user-facing channels | message/event lifecycle | scoped roles |
| Privacy / Consent / Compliance | Policy/Privacy contract | D1/config + provider boundary | policy/consent service | Settings | public consent/privacy surfaces | policy version | owner/admin |
| API / Webhook / Developer | API contract | Worker routes + webhook boundary | API/integration layer | Developer/Integration UI later | external consumers | contract version | API roles |
| Deployment / Environments | Release contract | environment/deploy state | deployment boundary | Creator Center/ops | deployed public runtime | release/version | owner/admin |
| Performance / Caching / Edge | Platform performance contract | Worker/cache/CDN | edge/runtime boundary | Diagnostics/ops | public runtime | release-level | system |
| Accessibility | Accessibility contract | Editor/renderer config | validation/render boundary | Editor + Diagnostics | public renderer | page/release gate | system/editor |
| Billing / Entitlements | Billing domain | D1 + payment provider | billing service | Billing Center | commerce/SaaS runtime | entitlement lifecycle | billing/admin |
| Marketplace | Marketplace domain | D1 + R2 | marketplace service | Marketplace Center | public marketplace | listing/version/moderation | marketplace roles |
| Import / Export / Portability | Data Portability contract | package/export boundary | import/export service | Settings/Library | none | package/version | owner/admin |
| Secure Custom Code / Embed | Secure Embed contract | Page Model config + sandbox boundary | validated command/render boundary | Advanced Inspector | sandboxed public renderer | page revision/publish | privileged editor/admin |

**Canonical ownership rules:**
1. Egy domainnek csak egy canonical source of truth lehet.
2. A Page Model nem válhat második Asset, Theme, Component, Schedule, CMS vagy Integration adatbázissá.
3. A Resource/Asset rendszer közös; Image/Video/Audio/Icon/Font/File nem hozhat létre saját párhuzamos library-t.
4. A Schedule domain egyetlen adat-owner; az Editor schedule node csak konfiguráció/binding.
5. A Property Registry az Inspector egyetlen property-registryje.
6. Template és Symbol külön fogalom: Template = copy/fork; Symbol = shared definition.
7. Platformok adapterek; Twitch/YouTube/TikTok nem hozhatnak létre külön, egymással inkompatibilis streamer modellt.
8. Minden mutation canonical command/service/API boundaryn keresztül történik.
9. A public renderer csak canonical published state-et fogyaszt.
10. Legacy kód jelenléte önmagában nem ownership; legacy csak explicit KEEP/FIX/MIGRATE/REPLACE/REMOVE/DISABLE/ARCHIVE státusszal maradhat.
11. Auth/RBAC, audit, validation, migration, diagnostics és persistence nem másolható domainenként.
12. Minden későbbi AI, automation, SaaS, marketplace vagy commerce funkció ugyanezeket a canonical contractokat használja; nem kerülheti meg őket.
13. Custom code/HTML/embed nem kaphat közvetlen privilegizált D1/R2 hozzáférést.
14. Egy időben továbbra is pontosan egy ACTIVE engineering point lehet.

**M0.4 initial evidence snapshot (historical; not the current gate):** The unchecked bullets below record what remained open at the time of the initial baseline. The later `M0.4 closure gate — PASS evidence` is the authoritative current M0.4 status.
- [x] Site context contract létezik: src/core/site-context.ts.
- [x] Page Model canonical: src/core/page-model.ts.
- [x] Domain contracts tartalmaznak Asset/Game/Schedule/Theme/SitePresentation canonical modelleket: src/core/domain/contracts.ts.
- [x] Publish validation a canonical Page Model/Schedule kapcsolatot ellenőrzi: src/core/editor-validation.ts.
- [x] Audit mutation boundary létezik: src/core/audit.ts.
- [x] Editor Property Registry egyetlen registryként működik: public/editor-v2/core/property-registry.js.
- [x] Schedule command/config canonical normalizer útvonal már korábban javítva lett.
- [ ] minden fenti domain teljes repository-level implementation evidence-e összegyűjtve;
- [ ] storage/mutation/UI/public/revision/permission mapping minden domainnél runtime tesztekkel is igazolva;
- [ ] legacy ownership/disposition teljesen lezárva;
- [ ] user review / acceptance.

**M0.4 döntés — lezárt:** a fenti matrix a további fejlesztés canonical ownership baseline-ja. Az M0.4 closure gate alatti, 2026-10-08-i runtime/browser/user-acceptance bizonyítékok alapján M0.4 PASS. Ez nem jelenti az M0 egészének PASS állapotát.

### M0.5 — Central Resource contract freeze
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT POINT — a Resource/Media követelményeket az E.5 és az F0.7 acceptance kezeli. A korábbi M0.5 PASS nem előfeltétele az F0.1–F0.13 sorrendnek.`

Kötelező eldönteni és MASTER-ben rögzíteni:
- Asset;
- Image;
- Video;
- Audio;
- File;
- Document;
- Icon;
- Font;
- Logo;
- Game artwork;
- Stream artwork;
- Overlay asset;
- Thumbnail/derivative;
- usage/reference/orphan lifecycle;
- storage abstraction;
- R2 implementation boundary.

### M0.6 — Template / Component / Design-system contract freeze
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT POINT — a Template/Component/Design System követelményeket az E.6 és az F0.8 acceptance kezeli; nincs külön M0.6 blokk.`

Kötelezően külön:
- Theme;
- Token;
- Component;
- Variant;
- Reusable Component/Symbol;
- Section;
- Page Template;
- Site Template;
- Preset;
- Library item.

### M0.7 — Streamer / OBS capability freeze
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT POINT — a Streamer/OBS jövőkép az E.9/E.11/F.8 fejezetben marad, a fázis szerinti implementáció későbbi roadmap feladata; nincs külön M0.7 blokk.`

- Schedule;
- Game;
- platform;
- live state;
- VOD;
- clips;
- overlays;
- alerts;
- widgets;
- themes;
- scenes;
- browser-source outputs;
- OBS bridge;
- future automation.

### M0.8 — 1.0 / 1.x / post-1.0 scope freeze
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT POINT — az 1.0/1.x/post-1.0 scope-ot az E.21/F.11 és a közvetlen F0 végrehajtási sorrend adja.`

Minden funkció explicit státuszt kap. A „majd egyszer” kategória is megmarad, de nem blokkolhatja az 1.0-t.

### M0.9 — Legacy removal plan
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT POINT — a legacy felületek csak akkor módosíthatók, ha az adott F0.x vagy production-readiness pont pontosan megnevezi az érintett route-ot és bizonyítja a biztonságos dispositiont; a régi M0.9 nem önálló munkapont.`

Minden legacy surface kap:
- KEEP;
- FIX;
- MIGRATE;
- REPLACE;
- REMOVE;
- DISABLE;
- ARCHIVE.

**Kötelező:** a legacy útvonalnak nem lehet canonical ownershipje.

### M0.10 — No Dead Admin Surface gate
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT POINT — a működő/tervezett/legacy adminfelületek elvárt státusza a F0.2 és a production-readiness acceptance része; nincs külön M0.10 gate.`

- [ ] nincs aktívnak látszó hibás admin funkció;
- [ ] future funkciók PLANNED/BETA/FOUNDATION állapotot mutatnak;
- [ ] régi route-ok redirect/disabled/archive stratégiát kapnak;
- [ ] Admin navigation canonical feature registryből származik.

### M0.11 — Benchmark completion
**Állapot:** `SUPERSEDED AS SEPARATE AUDIT POINT — a benchmark-kutatást minden jelentős capability előtt az E.22/E.20 szabályok szerint, az adott buildpont részeként végezzük; nincs teljes fejlesztést blokkoló M0.11 kapu.`

**Sorrendi pontosítás:** M0.11 a teljes benchmark-lefedettség végső összesítő kapuja; nem engedi a benchmarkot a későbbi fázisokra halasztani. Az M0.5/M0.6/M0.7 contract freeze során minden érintett domain célzott benchmarkját a contract lezárása előtt kell elvégezni és az adott pontban rögzíteni. M0.11 ezután azt ellenőrzi, hogy a teljes platform-scope releváns benchmarkjai megvannak-e, és nincs-e indokolatlanul kihagyott terület.

A hivatalos benchmarkok releváns részei rögzítve:
- Webflow;
- Wix Studio;
- Framer;
- GrapesJS;
- Builder;
- Sanity;
- StreamElements;
- Streamlabs;
- OBS Studio;
- további streamer/creator website példák, ha új képességet bizonyítanak.

### M0.12 — M0 Definition of Done
**Állapot:** `SUPERSEDED — a felhasználó döntése alapján a külön M0 audit DoD nem előfeltétele a fejlesztésnek. A checklist követelményei a megfelelő implementációs pontok acceptance-listáiban maradnak meg.`

M0 csak akkor PASS:
- [ ] teljes feature inventory auditált;
- [ ] minden domain canonical ownerrel rendelkezik;
- [ ] central Asset/Resource scope freeze kész;
- [ ] Icon Registry scope freeze kész;
- [ ] Template/Component/Symbol scope freeze kész;
- [ ] Theme/Design System scope freeze kész;
- [ ] Website Builder capability map kész;
- [ ] Streamer/OBS capability map kész;
- [ ] CMS/content map kész;
- [ ] SEO/accessibility/performance map kész;
- [ ] publishing/revision map kész;
- [ ] integration/automation/analytics future map kész;
- [ ] Admin feature state contract kész;
- [ ] Schedule legacy/dead surface audit PASS;
- [ ] minden jelenlegi legacy surface KEEP/FIX/MIGRATE/REPLACE/REMOVE/DISABLE/ARCHIVE státuszt kap;
- [ ] nincs azonos célra két canonical rendszer;
- [ ] 1.0/1.x/post-1.0 scope freeze kész;
- [ ] F0 új scope-ja explicit M0 eredményére épül;
- [ ] user review PASS;
- [ ] MASTER frissítve;
- [ ] M0 CLOSED / PASS.

### M0.13 — M0 utáni sorrend
**Állapot:** `SUPERSEDED — F0 közvetlenül aktív; M0.12 PASS nem szükséges.`

Az egyetlen aktív fejlesztési pont:
**F0.1 — Editor foundation és első végig működő szerkesztési szelet.**

F0 után csak a teljes PASS lánc:
**F0 → G → H → I → J → Early Public Website → további 1.0 production gates → 1.0 Production Gate.**


## F0 — VISUAL EDITOR + CREATOR CENTER + SCHEDULE — SZEKVENCIÁLIS IMPLEMENTÁCIÓS PROGRAM
**F0 státusz:** `ACTIVE — az egyes F0.x pontok egymás után hajthatók végre; egyszerre csak egy aktív.`

**F0 célja:**  
A Visual Editor UX/UI-jának újraalapozása a korábban elfogadott strukturált-konténeres koncepció szerint, úgy, hogy desktopon, tableten és mobilon ugyanazt a canonical Page Modelt szerkessze. A régi UI csak akkor maradhat meg, ha a célkövetelményeknek bizonyíthatóan megfelel; egyébként a felületi réteg újraépítendő, miközben a bizonyított canonical domain-, mutation- és persistence alapokat megőrizzük. A bal oldali navigáció/Layers, a canvas, a jobb oldali Inspector, a responsive módok és az Adásrend szerkesztése egyetlen összefüggő felhasználói folyamat részei.

Az F0 **a Visual Editor új UX/UI-koncepciójának újraalapozási és megvalósítási kapuja**: nem kötelező a régi felületet foltozgatni, és indokolt esetben a UI-réteg újraépíthető. A meglévő, bizonyítottan megfelelő domain- és platformalapokat újra kell használni. Nem készül második canonical Page Model, Editor core, Schedule domain, Property Registry vagy save/publish útvonal.

**F0 teljes scope-ja (nem egyetlen óriási feladat):** az operatív funkciók teljes leírását a 00.9.6.E/F közvetlen termékkövetelmény-fejezetek adják; a 00.9.6.C/D a platform térképét és a fázisokat őrzi, a történeti ledger csak nyomkövetésre szolgál. Az alábbi F0.x pontok a szükséges 1.0 képességeket fokozatosan, egyetlen aktív ponttal építik fel. A korábban kipipált alapok sem jelentenek automatikusan használható, kész felhasználói funkciót. Minden képességet az adott pont acceptance-e igazol.

- Új szerkesztői információ-architektúra és UI: Page → Section → Box → szerkeszthető elemek; nested Box.
- Canvas + Layers/tree + jobb oldali Inspector + responsive breakpointok + preview; hétköznapi szerkesztés dropdown/vezérlő alapú, CSS/JSON írása nélkül.
- Vertikális/horizontális és két-/háromoszlopos layout; position/alignment/size/spacing/order.
- Heading, plain Text (1.0 alap), image, button, divider, spacer, icon, link, video/audio/embed/form/list/table/accordion/tabs/dynamic content és Sanci-specifikus blokkok; a teljes Rich Text szerkesztő külön, későbbi scope.
- Reusable component/symbol/template, theme/design tokens, media/resource/icon pickerek.
- Selection, Layers, add/delete/duplicate/reparent/reorder, undo/redo, validation, keyboard/touch, drag/resize, snapping/guides, multi-select, zoom/grid, nesting, property search/reset.
- Inspector/Property Registry, responsive overrides, typography, appearance, interactions/accessibility.
- Dirty/save/reload/recovery, revisions/rollback, preview/publish/unpublish/republish.
- Teljesen újratervezett Admin/Creator Center dashboard és navigation; a jelenlegi elavult admin kezdőoldal nem maradhat végső UI.
- Schedule: a meglévő primitív CRUD csak kiindulópont; timezone, recurrence, game/category, platform, artwork/resource refs, status, visibility, featured, filtering/views, cancellation/reschedule, live linkage, Twitch sync/error state, public next/live/countdown és rich Editor block integráció szükséges.
- Twitch: meglévő foundation megtartandó, de connect/callback/connection/live state/schedule sync/diagnostics/error/retry/ownership UX és acceptance teljesítendő; a jelenlegi alap nem tekintendő teljes streamer-integrációnak.
- VOD/Clips/Shorts/content calendar és további platformadapterek a roadmap szerinti fázisban maradnak; nem minősülnek 1.0-késznek pusztán a tervbe kerüléstől.
- Minden pont: unit/domain + API/contract + browser responsive + regression + production smoke ahol releváns + user acceptance.

**F0 végrehajtási szabály:** a korábban egyetlen nagy kapuba zsúfolt Editor/Schedule munkát kisebb, sorrendben végrehajtott F0.x pontokra bontjuk. Minden pontnak saját scope-ja, fájl-/API-/adatmodell-változáslistája, tesztje, runtime acceptance-e és felhasználói ellenőrzése van. Egy pont PASS után a következő nyílik; az F1 és a következő termékfázisok csak a hozzájuk tartozó 1.0 release gate-ek után indulnak.

---

## F0.0 — KIINDULÁSI BASELINE ÉS DUPLIKÁCIÓS ZÁR

### Canonical rendszer
- [x] Az aktív Visual Editor kizárólag `public/editor-v2/`.
- [x] A régi `public/editor/`, legacy admin és system-page editor nem aktiválható újra.
- [x] A Schedule domain továbbra is külön canonical domain adat.
- [x] A Schedule vizuális konfigurációja a canonical Page Model `schedule` node-ja.
- [x] D1 a strukturált domain/persistence source of truth.
- [x] A frontend nem ír közvetlenül D1/R2/KV-be.
- [x] Existing command/history/transaction infrastruktúra marad az egyetlen mutation boundary.
- [x] Existing revision/save/publish/rollback infrastruktúra marad az egyetlen persistence lifecycle.
- [x] Existing diagnostics rendszer marad az editor hibák és verification jelzések canonical helye.

### Tiltott duplikációk
- [x] Nem készül második Visual Editor.
- [x] Nem készül második Schedule CRUD API.
- [x] Nem készül második Schedule domain modell.
- [x] Nem készül második Property Registry.
- [x] Nem készül UI-only Schedule state, amely megkerüli a Page Modelt.
- [x] Nem készül külön mobil Editor-kódút.
- [x] Nem kerül vissza legacy renderer/admin/editor.
- [x] Nem készül külön save/publish API.
- [x] Nem készül DOM-as-source-of-truth megoldás.

---

## HISTORICAL / QUEUED — korábbi F0.1 — EDITOR FOUNDATION ÉS ELSŐ VÉGIG MŰKÖDŐ SZERKESZTÉSI SZELET

> A részletes Editor DoD megmarad, de az aktív sorrend MASTER-2.77 szerint előbb az Admin főoldal és shell. Az Editor foundation következő aktív fejlesztési pontja F0.3.

**Cél:** az Editor új fejlesztési alapja: az új shell elindul, betölti a canonical Page Modelt, létrejön vagy kiválasztható egy elem, a változás a canonical command/validation/history láncon halad, a canvas és az Inspector ugyanazt az állapotot mutatja, a mentés/visszatöltés pedig bizonyíthatóan működik. Nem a régi Editor „készre jelölése”.

**F0.1 DoD:**
- [ ] A régi Editor funkciók ténylegesen újratesztelve; a hiányos/hibás elemek nincsenek késznek jelölve.
- [ ] Új shell/layout és canvas workspace; bal oldali panel, canvas, jobb oldali Inspector elrendezés.
- [ ] Egyetlen canonical Page Model és command/state/validation/history/persistence útvonal.
- [ ] Első elemtípus legalább add/select/edit/delete + undo/redo útja végig működik.
- [ ] Dirty/save/reload állapot és hibaüzenetek valósak, nem dekoratívak.
- [ ] `npm run typecheck`, célzott unit/domain tesztek, browser desktop + mobile smoke, mentés-visszatöltés és user acceptance PASS.
- [ ] MASTER checkpoint és a következő egyetlen aktív pont frissítve.

### HISTORICAL / SUPERSEDED — korábbi F0 végrehajtási sorrend

> A táblázat a korábbi Editor-első sorrendet őrzi; nem operatív. A MASTER-2.77 végrehajtási táblája az irányadó.

| Pont | Implementációs cél | Kötelező készültségi bizonyíték |
|---|---|---|
| **F0.1 ACTIVE** | Editor foundation + első végig működő szerkesztési szelet | add/select/edit/delete → command/history/validation → save/reload; desktop/mobile smoke + user acceptance |
| F0.2 | Admin / Creator Center kezdőoldal és navigation teljes újratervezése | új dashboard, valós állapotok és linkek, nincs halott/hamis ACTIVE capability; auth/role + browser acceptance |
| F0.3 | Page/Section/Box/element hierarchia + Layers tree | create/rename/duplicate/reparent/reorder/lock/hide/delete; Page Model round-trip |
| F0.4 | Canvas selection és direct manipulation | hit-testing, drag/resize, guides/snap, zoom/grid, multi-select ahol scope; no DOM-as-source-of-truth |
| F0.5 | Inspector + Property Registry | selection binding, category/search/reset, validation, undo/redo, responsive-aware properties |
| F0.6 | Layout és responsive | stack/flex/grid/rows/columns, alignment/gap/padding/margin/size/position, desktop/tablet/mobile preview + overrides |
| F0.7 | Element library + Resource/Media/Icon contract | plain text (Rich Text külön későbbi scope)/image/button/icon/divider/spacer/link/media/embed/form/list; upload/picker/metadata/alt/usage/delete safety |
| F0.8 | Reusable components, templates, theme/design tokens | canonical registry/reference model; insert/edit/preview; no duplicate resource/property stores |
| F0.9 | Schedule domain és Schedule Inspector bővítése | rich fields, timezone/recurrence, status/visibility/featured, filtering/views, artwork, cancel/reschedule, site ownership, API + Editor + public read tests |
| F0.10 | Twitch integration UX és schedule/live linkage bővítése | OAuth/connection states, live/offline, schedule sync, errors/retry/diagnostics, ownership and failure-path tests |
| F0.11 | Draft/preview/publish/revisions/recovery | save/reload, preview, publish/unpublish/republish, rollback/recovery, concurrency and authorization tests |
| F0.12 | Public renderer + SEO/accessibility/performance integration | published-only state, semantic output, keyboard/reduced motion, metadata, responsive/performance gates |
| F0.13 | End-to-end production readiness for Editor/Admin/Schedule/Twitch | regression matrix, browser desktop/tablet/mobile, Worker/API/D1 checks, user acceptance; only then mark this release slice PASS |

**HISTORICAL SORRENDI SZABÁLY — SUPERSEDED:** ez a korábbi F0.1 Editor-első sorozatot írta le. Az aktuális aktív pontot és sorrendet kizárólag a dokumentum eleji ACTIVE_POINT_ID és a MASTER-2.77 2.77.5 táblája határozza meg.

---

# 00.9.6.C — ULTIMATE CREATOR PLATFORM — VÉGLEGES TERMÉK- ÉS FEJLESZTÉSI VILÁGTÉRKÉP — MASTER-2.71

**Rögzítve:** 2026-10-08  
**Jelleg:** CANONICAL PRODUCT SCOPE / ROADMAP FREEZE  
**Aktív engineering pont:** **F0.1**. A capability map teljes termékigény-lista; a megvalósítás a F0.x pontokban történik, nem párhuzamos munkában.  
**Cél:** a Sanci9517 ne csak egy streamer weboldal legyen, hanem lépésről lépésre egy világpiaci, többplatformos **Creator OS / Creator Platform** legyen.

## 00.9.6.C.1 — Végső termékígéret

A végső rendszernek egyetlen összefüggő platformként kell kezelnie:

1. Creator Website / public site
2. Visual Website Builder
3. Pages / Navigation / Layout / Components
4. CMS / structured content
5. Media / Asset / Resource Library
6. Icons / Icon Registry
7. Themes / Design System / Tokens
8. Templates / Sections / Components / Symbols
9. Streamer identity / profile / games / platforms
10. Schedule / Live / Countdown / VOD / Clips / Highlights
11. Twitch / YouTube / TikTok és további platform adapterek
12. Community / Discord / social/community functions
13. Stream Studio / Overlay Studio / Widgets / Alerts
14. OBS / Browser Source / streaming output
15. Forms / support / newsletter / contact
16. Shop / Merch / products / collections / orders / checkout integration
17. Payments / supporter / donation / membership capabilities
18. SEO / AEO / social sharing / discoverability
19. Analytics / conversion / audience insights
20. Automation / event / trigger / workflow engine
21. AI-assisted creation / content / SEO / analytics / localization / automation
22. Localization / internationalization / multilingual publishing
23. Accounts / permissions / multi-creator / future multi-tenant SaaS
24. Backup / import / export / migration
25. Marketplace / template library / component library / creator ecosystem
26. Performance / accessibility / security / diagnostics / observability
27. Future integrations through a canonical adapter/integration architecture

**Semmilyen későbbi capability nem törölhető csak azért, mert nem része az első 1.0-nak.** A későbbi capability-t a megfelelő PHASE alá kell helyezni és explicit státusszal kell megőrizni.

---

## 00.9.6.C.2 — Szerkeszthetőség alapelve: „minden értelmezhető helyen”

A platform minden olyan területén, ahol technikailag és UX szempontból értelmezhető, támogatnia kell:

- létrehozás
- szerkesztés
- duplikálás
- áthelyezés
- újrarendezés
- törlés
- archiválás
- mentés
- előnézet
- visszaállítás
- verziózás
- keresés
- szűrés
- kiválasztás pickerből
- saját egyedi elem létrehozása
- meglévő elem testreszabása
- sablonból indulás
- saját sablon mentése
- sablon duplikálása/forkolása
- újrafelhasználás
- import/export
- jogosultság és állapotkezelés
- ahol indokolt: globális/shared módosítás vagy csak az adott instance módosítása

A „template” nem lehet merev kész oldal. A template **kiindulási állapot**. A template-ből létrehozott oldal minden megengedett property-jével tovább szerkeszthető.

---

## 00.9.6.C.3 — Canonical Template / Component / Symbol rendszer

### A. Site Template
Komplett creator/webshop/site kiinduló rendszer:
- pages
- navigation
- header/footer
- theme
- design tokens
- components
- content structure
- SEO defaults
- responsive rules
- asset references

### B. Page Template
Egy teljes oldal kiinduló állapota.

### C. Section Template
Hero, schedule, about, social, gallery, support, shop, footer stb. újrahasznosítható szekció.

### D. Component Template
Egy komponens előre definiált, de teljesen tovább szerkeszthető kiinduló változata.

### E. Reusable Component / Symbol
Közös definíció, amely több helyen használható. A main definition módosítása az összes instance-ra kihat, miközben az engedélyezett instance properties egyedileg felülírhatók.

### F. Variants
Egy komponens több hivatalos változata:
- layout
- size
- color
- typography
- state
- responsive behavior
- content arrangement

### G. User-created library
A felhasználó saját:
- site template
- page template
- section template
- component template
- symbol/reusable component
- theme
- icon pack
- asset collection
- overlay
- widget
- stream scene
- shop section
- content structure

elemeit mentheti és később újra felhasználhatja.

**Kötelező különbség:** Template = copy/fork; Symbol = shared definition. Egyik sem hozhat létre második Page Modelt, Asset DB-t, Theme DB-t vagy Component Registryt.

---

## 00.9.6.C.4 — Resource / Asset / Icon / Font / File Library

Egyetlen központi Resource réteg kezeli a:
- images
- videos
- audio
- documents
- SVG
- icons
- logos
- avatars
- banners
- game artwork
- stream artwork
- thumbnails
- fonts
- downloadable files
- future resource types

Minden resource rendelkezzen szükség szerint:
- ID
- type
- storage reference
- metadata
- title/name
- alt text
- MIME/type
- dimensions/duration
- size
- tags
- usage references
- owner/site scope
- status
- created/updated timestamps
- version/restore information where applicable

**Storage boundary:**
- binary/media -> R2
- structured metadata/domain -> D1
- Page Model -> csak canonical resource reference
- nincs második Asset DB.

Picker funkciók:
- search
- filter
- sort
- upload
- select
- preview
- replace
- crop/transform where supported
- metadata edit
- alt text
- usage inspection
- orphan detection
- safe delete
- restore

---

## 00.9.6.C.5 — Website Builder teljes capability-köre

A visual buildernek végső állapotban kezelnie kell:

**Canvas/layout**
- container
- stack
- flex
- grid
- rows/columns
- alignment
- gap
- padding/margin
- width/height/min/max
- aspect ratio
- overflow
- position
- z-index
- responsive constraints
- viewport-specific overrides

**Structure**
- pages
- sections
- containers
- components
- slots
- children
- layers
- grouping
- reparenting
- reorder
- duplicate
- lock
- hide
- rename

**Content**
- text
- rich text
- image
- video
- audio
- link
- button
- icon
- embed
- form
- list
- dynamic content
- CMS binding
- platform binding

**Presentation**
- typography
- color
- background
- gradient
- border
- radius
- shadow
- opacity
- filters
- transform
- animation
- state styles

**Responsive**
- desktop
- tablet
- mobile
- future custom breakpoints
- inheritance
- override
- reset
- responsive visibility
- responsive typography
- responsive spacing
- responsive media
- responsive component variants

**Editor productivity**
- drag/drop
- multi-select
- copy/paste
- duplicate
- style copy
- command palette
- keyboard shortcuts
- undo/redo
- search
- recent/favorites
- context menu
- batch operations

---

## 00.9.6.C.6 — CMS / Content Factory

A CMS végső capability-köre:
- collections
- records
- custom fields
- references
- relationships
- rich text
- media fields
- taxonomy/tags
- drafts
- publishing
- scheduling
- revisions
- authoring
- reusable content
- dynamic page bindings

Creator-specific collections:
- posts
- news
- videos
- VOD
- clips
- highlights
- games
- stream events
- projects
- gallery
- sponsors
- supporters
- FAQs
- links
- social posts
- custom creator records

---

## 00.9.6.C.7 — Streamer platform

Canonical streamer domains:
- creator identity
- profile
- social platforms
- games
- game profiles
- schedule
- live state
- current game
- next stream
- VOD
- clips
- highlights
- stream events
- platform links
- community links

Integrációs sorrend:
1. Twitch
2. YouTube
3. TikTok
4. Discord/community
5. további adapterek

Minden adapter közös Integration/Platform contractot használ. Nincs platformonként külön, párhuzamos Page Model vagy Schedule domain.

---

## 00.9.6.C.8 — Schedule végső capability

A Schedule nem egyszerű lista.

Támogatandó:
- date
- start/end
- timezone
- title
- game
- platform
- status
- artwork
- notes
- URL
- source
- sync state
- recurring events
- featured
- visibility
- filters
- views
- templates
- external integration
- live linkage
- cancellation/reschedule
- past/upcoming/all/next views

A Schedule eseményekhez is használható legyen template/recurring/template-based creation, de a canonical Schedule domain marad az egyetlen domain owner.

---

## 00.9.6.C.9 — Theme / Design System

Global:
- colors
- typography
- spacing
- radius
- shadows
- borders
- containers
- breakpoints
- z-index
- motion
- focus
- theme modes
- component variants
- brand assets

A user:
- saját theme-et hozhat létre
- meglévő theme-et duplikálhat
- theme-et módosíthat
- theme-et menthet
- theme-et template-hez kötheti
- később theme package-ként exportálhat/megoszthat.

---

## 00.9.6.C.10 — Stream Studio / Overlay Studio / OBS

Végső capability:
- overlay canvas
- scenes
- starting soon
- BRB
- ending
- webcam frame
- alerts
- widgets
- chat
- goals
- countdown
- labels
- ticker
- social handles
- media
- game widgets
- stream variables
- event triggers
- animations
- themes
- reusable widgets
- preview/test
- browser-source output
- OBS integration

Az overlay/widget rendszer ugyanazokat a Resource, Theme, Component, Template és Integration contractokat használja; nem készül második párhuzamos Asset/Theme/Component rendszer.

A StreamElements benchmark alapján különösen fontos a vizuális editor, testreszabható alert/widget, theme/package és browser-source workflow; a jelenlegi hivatalos dokumentáció ezt a modellt igazolja. citeturn0search0turn0search1turn0search3turn0search4

---

## 00.9.6.C.11 — Shop / Merch / Creator Commerce

A végső platform része:
- shop
- products
- product variants
- collections
- categories
- product media
- pricing
- stock/inventory
- digital products where applicable
- merch
- creator bundles
- discount/coupon capability
- cart
- checkout integration
- orders
- customer/order status
- shipping/tax integration boundary
- supporter products
- limited drops
- shop analytics

A webshop ne külön, idegen rendszer legyen: ugyanazt a Page Model / Resource / Theme / Component / Template / Auth / Publishing architektúrát használja, miközben a commerce domain külön canonical owner.

---

## 00.9.6.C.12 — Community / Support / Membership

- contact
- support
- donations
- supporter listing
- memberships
- gated content foundation
- community links
- Discord integration
- community events
- polls
- forms
- newsletter integration
- future member profiles

---

## 00.9.6.C.13 — SEO / AEO / Discoverability

- title
- description
- canonical
- robots
- sitemap
- OG
- social cards
- favicon
- structured data
- headings
- alt text
- redirects
- 404
- clean URLs
- locale metadata
- index/noindex
- performance signals
- AEO/AI-search readiness
- content discoverability
- social preview

---

## 00.9.6.C.14 — AI platform

AI nem egyetlen „AI gomb”.

Későbbi capability-k:
- AI site generation
- AI section generation
- AI component generation
- AI copywriting
- AI rewriting
- AI SEO suggestions
- AI AEO suggestions
- AI alt text
- AI metadata
- AI translation
- AI content planning
- AI social post generation
- AI schedule/content assistance
- AI analytics explanation
- AI optimization suggestions
- AI theme/design assistance
- AI image/media assistance where legally and technically appropriate
- AI automation creation
- AI support assistant
- AI creator copilot

**Biztonsági szabály:** AI által generált módosítás mindig a canonical Editor/Command/Validation/Persistence útvonalon menjen át; az AI nem írhat közvetlenül D1/R2-be.

---

## 00.9.6.C.15 — Localization / World Language

**Jelenlegi 1.0 nyelv:** magyar.

Az architektúra viszont már most localization-ready legyen:
- locale-aware content
- translation keys
- localized metadata
- localized slugs
- locale fallback
- RTL-ready layout
- locale-specific assets where needed
- translation workflow
- future AI translation

Későbbi világnyelvi sorrend:
- magyar
- angol
- német
- további nagy világnyelvek
- szükség esetén regionális locale-ok

A Framer jelenlegi localization modellje is külön kezeli a locale-t, fallbacket, CMS-t, képeket, slugokat és AI translationt; ezt benchmarkként használjuk, nem másolandó implementációként. citeturn0search5turn0search20turn0search21

---

## 00.9.6.C.16 — Analytics / Automation

**Analytics:**
- visitors
- traffic
- sources
- engagement
- stream metrics
- content performance
- shop performance
- supporter/conversion metrics
- campaign performance
- dashboard
- reports
- export

**Automation:**
- event
- trigger
- condition
- action
- schedule
- webhook
- integration event
- content workflow
- stream workflow
- commerce workflow
- notification
- AI-assisted workflow creation

---

## 00.9.6.C.17 — Accounts / SaaS / Ecosystem

Későbbi platform:
- multi-creator
- multi-site
- roles
- permissions
- teams
- collaboration
- approvals
- audit
- environments
- staging
- production
- custom domains
- billing
- subscriptions
- marketplace
- creator onboarding
- public template marketplace
- component/widget marketplace
- creator ecosystem

---

# 00.9.6.C.18 — VÉGLEGES FÁZIS-MENETREND

## PHASE 0 — FOUNDATION → F0 IMPLEMENTATION
**Cél:** a már lezárt ownership/regression alapokra támaszkodva elindítani a tényleges Builder/Creator Center/Schedule építést.

- [x] E4/E5/E6 lezárt alapok megőrzése; csak konkrét új hiba nyitja újra.
- [x] M0 külön auditfázis lezárva a felhasználó döntésével; ez nem hamis PASS, és nem állít kész runtime funkciókat.
- [ ] F0.1 Editor foundation + első végig működő szerkesztési szelet.
- [ ] F0.2 Admin/Creator Center dashboard újratervezés.
- [ ] F0.3–F0.13 Editor/Layers/Inspector/Layout/Resource/Schedule/Twitch/publish/public/QA sorban.

Az E/F fejezetek közvetlen, részletes termékkövetelményei és a F0.x DoD-k adják a fejlesztés operatív specifikációját. A 00.9.6.C/D a teljes platformcélt és fázisokat őrzi; a történeti listák kizárólag megőrzési/eredet-nyomkövetési szerepűek, és nem igényelnek külön újratérképezési auditkört.

## PHASE 1 — Creator Website 1.0
**Cél:** professzionális, működő Sanci9517 creator site.

- Visual Editor
- Page Model
- Pages
- Navigation
- Header/Footer
- Layers
- Inspector
- Property Registry
- responsive
- content blocks
- Media/Asset foundation
- Icon picker
- Theme foundation
- basic reusable components
- templates
- Schedule
- Game Profiles
- Twitch
- live/next-stream
- draft/preview/publish/unpublish
- revisions/rollback
- SEO
- accessibility
- diagnostics
- public renderer
- regression/E2E/live acceptance
- legacy active-surface elimination

**1.0 nem jelent végállapotot.** Ez az első stabil Creator Platform release.

## PHASE 2 — Creator Platform 1.x
- richer CMS
- advanced Resource Manager
- advanced templates
- Symbols
- Theme Editor
- forms
- advanced interactions
- animation
- richer schedule
- VOD/Clips
- YouTube/TikTok integrations
- richer social/community
- media transforms
- stronger SEO/AEO
- richer shop foundation

## PHASE 3 — Creator OS 2.x
- Stream Studio
- Overlay Studio
- widgets
- alerts
- scenes
- browser source
- OBS integration
- reusable stream packages
- automation
- creator analytics
- advanced community
- creator commerce
- merch
- supporter/membership system

## PHASE 4 — AI Creator Platform 3.x
- AI copilot
- AI website generation
- AI sections/components
- AI content
- AI SEO/AEO
- AI media metadata
- AI translation
- AI analytics
- AI automation
- AI creator workflows

## PHASE 5 — SaaS / Business 4.x
- multi-creator
- multi-site
- accounts
- teams
- roles
- permissions
- collaboration
- custom domains
- billing
- subscriptions
- environments
- advanced analytics

## PHASE 6 — Creator Business 5.x
- full commerce
- merch
- products
- collections
- campaigns
- memberships
- supporter programs
- creator CRM/fan relationships
- marketing automation
- conversion optimization

## PHASE 7 — Ecosystem / Marketplace 6.x
- template marketplace
- component marketplace
- widget marketplace
- theme marketplace
- creator asset packs
- public creator libraries
- sharing
- ratings/reviews/moderation
- licensing/reuse model

## PHASE 8 — Global / Advanced AI 7.x+
- world-language rollout
- advanced localization
- advanced AI agents
- autonomous workflow assistance
- personalization
- experimentation
- advanced analytics
- global creator ecosystem
- future capabilities discovered through continuous benchmark/research

---

## 00.9.6.C.19 — Benchmark / Research szabály

A fejlesztés során nem csak a saját ötleteinkből dolgozunk.

Minden nagy capability előtt ellenőrizhető benchmarkforrás:
- Webflow
- Wix Studio
- Framer
- Sanity
- Builder.io
- GrapesJS
- StreamElements
- Streamlabs
- OBS
- Shopify
- további releváns creator/e-commerce/CMS/platform rendszerek

A benchmark célja:
1. hiányzó capability felismerése;
2. jó UX pattern felismerése;
3. edge case-ek azonosítása;
4. működési szerződések összehasonlítása;
5. saját canonical design kialakítása.

**Tilos** harmadik fél kódját vagy zárt implementációját engedély nélkül másolni. Nyilvános dokumentáció, működés, API-contract, UX és saját implementáció használható; ahol jogilag/technikailag indokolt, külön licence/API feltételek ellenőrzendők.

A Webflow komponensmodellje például a main component / instance / props / slots / variants különbségét explicit kezeli; ez releváns benchmark a saját reusable component rendszerhez. citeturn0search2

A Sanity visual editing modellje a live preview, click-to-edit és drag-and-drop szerkesztést egy közös visual editing workflow-ban kezeli; ez releváns benchmark a public preview ↔ editor kapcsolathoz. citeturn0search8turn0search18

A Wix Studio template-rendszere responsive és erősen testreszabható template-eket használ; ez releváns benchmark a saját template libraryhoz. citeturn0search17

---

## 00.9.6.C.20 — „Nem maradhat ki” szabály

Minden új funkció bekerülése előtt ezt a kérdéssort kell lefuttatni:

1. Van-e saját canonical domain owner?
2. Van-e saját UI/editor surface?
3. Szerkeszthető-e, ahol értelmezhető?
4. Menthető-e?
5. Újrahasznosítható-e?
6. Template-ként használható-e, ahol értelmezhető?
7. Reusable Component/Symbol lehet-e?
8. Resource/Asset pickerből kiválasztható-e, ahol értelmezhető?
9. Responsive?
10. Permission/security?
11. Draft/preview/publish?
12. Revision/rollback?
13. Validation?
14. Accessibility?
15. SEO/AEO?
16. Analytics?
17. Integration/adapter?
18. Import/export/backup?
19. Future localization?
20. Future AI integration?
21. Future marketplace/ecosystem?
22. Legacy/duplicate owner keletkezik-e?
23. Van-e teszt/acceptance/diagnostic?
24. Melyik PHASE-ben kell ténylegesen megvalósítani?

Ha egy capability valamelyik pontja későbbi fázis, azt explicit **PLANNED / PHASE-X** státusszal kell rögzíteni, nem elfelejteni és nem félkészként ACTIVE-nak jelölni.

---

## 00.9.6.C.21 — Sorrendiség és végrehajtási zár

**Precedence:** ez a fejezet a globális végrehajtási szabályt rögzíti. Az aktuális aktív részpontot kizárólag a MASTER eleji `ACTIVE_POINT_ID` és `ACTIVE_SUBPOINT_ID` adja meg; a roadmap fejezetekben felsorolt fázisok nem aktív munkapontok.

**Egy időben pontosan egy ACTIVE engineering point lehet.**

Sorrend:
**E4/E5/E6 CLOSED/PASS → F0.1 → F0.2 → F0.3…F0.13 → 1.0 release gates → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8+. M0 audit PASS nem előfeltétel.**

Minden pont:
- előfeltételekkel
- inputtal
- outputtal
- DoD-val
- tesztekkel
- live acceptance-szel, ahol szükséges
- MASTER checkpointtal
- commit/revision evidence-szel

zárandó.

**Nem lépünk tovább azért, mert „nagyjából működik”.**

---

## 00.9.6.C.22 — Végső állapot

A végső cél nem a „Sanci9517 1.0 weboldal”.

A végső cél:

> **Sanci9517 — egy világpiaci, magyar alapokról induló, teljesen szerkeszthető Creator Platform / Creator OS, amelyben a website, visual builder, CMS, media, icons, themes, templates, reusable components, streaming, Twitch, YouTube, TikTok, community, overlays, OBS, shop/merch, analytics, automation, AI, localization és később a creator ecosystem egyetlen canonical platformként működik.**

**1.0 = első stabil mérföldkő.  
Nem a végcél.**

A roadmap ezen pontja után egyetlen funkció sem „veszhet el”: ha még nem implementáljuk, a megfelelő későbbi PHASE-ben marad dokumentálva, canonical ownerrel és előfeltételekkel.


## 00.9.6.C/D — CANONICAL ROADMAP PRECEDENCE
A **00.9.6.C** fejezet a teljes capability/product inventoryt rögzíti; nem önálló alternatív roadmap.
A **00.9.6.D** fejezet a canonical lifecycle/fázis-sorrend, és az 0.x → 1.0 → 1.5 → 2.0 → 3.0 → 4.0 → 5.0 → 6.0 → 7.0 → 8.0 → 9.0 → 10.0 fejlődési ív elsődleges végrehajtási referenciája.

Ha C és D bármely fáziscímkéje eltérően csoportosít egy capability-t, **D a mérvadó a phase/scope besorolásban, C pedig a capability megőrzését és részleteit biztosítja**. Ez nem két terv, hanem egyetlen MASTER két nézetben: capability inventory + canonical lifecycle.

## 00.9.6.D — MASTER-2.72 — FULL HISTORICAL ROADMAP PRESERVATION + 10-STAGE ENDGAME

**Fontos korrekció:** a 00.9.6.C nem a teljes korábbi roadmap kivonata volt. A MASTER korábbi állapotából ismert **0.x → 1.0 → 1.5 → 2.0 → 3.0 → 4.0 → 5.0 → 6.0 → 7.0 → 8.0 → 9.0 → 10.0** végső fejlődési ívet is meg kell őrizni. A korábbi **19–34** szakaszok archivált backlogja továbbra is érvényes; funkció, domain vagy későbbi capability explicit döntés nélkül nem törölhető.

### 00.9.6.D.1 — Teljes végső fejlődési ív

**0.x — Foundation / Platform Hardening**
- canonical architecture
- Page Model
- D1/R2 boundary
- auth/RBAC/site ownership
- revisions/publishing
- command/history/validation
- diagnostics/audit
- migration/legacy isolation
- test/live gates
- performance/accessibility/security foundation

**1.0 — Working Professional Sanci9517 Creator Website**
- teljes public site
- Creator Center/Admin
- Visual Editor
- pages/navigation/layers/inspector
- responsive
- content/components
- Media/Assets
- Icons
- Theme foundation
- Templates
- Schedule/Game Profiles
- Twitch
- live/next stream
- draft/preview/publish/rollback
- SEO/accessibility
- regression/E2E/live acceptance

**1.5 — Multi-Platform Creator**
- YouTube
- TikTok
- Discord/community
- platform profiles
- richer live state
- VOD/clips/highlights
- cross-platform content
- platform-aware widgets
- unified social/link system

**2.0 — Creator Operating System**
- advanced CMS
- advanced Asset/Resource Manager
- Template/Section/Component/Symbol ecosystem
- Theme Editor
- Design System
- Forms/backend actions
- advanced interactions/motion
- calendar/reminders/export
- content workflows
- creator dashboard
- media/video workflows
- richer scheduling

**3.0 — AI Creator Platform**
- AI Creator Copilot
- AI website/section/component generation
- AI content/copy
- AI SEO/AEO
- AI metadata/alt text
- AI media assistance
- AI translation
- AI schedule/content assistance
- AI analytics explanation
- AI automation generation
- AI support assistant
- AI personalization assistance

**4.0 — Team / SaaS / Billing**
- multi-creator
- multi-site
- teams
- roles/permissions
- collaboration
- approvals
- concurrency
- staging/production
- custom domains
- subscriptions
- billing
- entitlements
- usage limits
- plans
- creator onboarding

**5.0 — Creator Business / Commerce**
- Shop
- Merch
- products
- variants
- collections
- inventory
- digital products
- bundles
- coupons
- cart
- checkout integration
- orders
- customer/order management
- payments
- donations
- supporter programs
- memberships
- CRM/fan relationships
- marketing automation
- conversion optimization

**6.0 — Creator Ecosystem / Marketplace**
- template marketplace
- component marketplace
- widget marketplace
- theme marketplace
- asset packs
- creator libraries
- public sharing
- ratings/reviews
- moderation
- licensing/reuse
- creator ecosystem
- partner/integration ecosystem

**7.0 — Advanced Automation + AI**
- event/trigger/condition/action engine
- webhooks
- workflows
- scheduled automation
- cross-platform automation
- commerce automation
- content automation
- stream automation
- notification automation
- AI-generated workflows
- agent-assisted operations

**8.0 — Multimodal Creator Intelligence**
- unified text/image/video/audio understanding
- content intelligence
- media classification
- clip/highlight assistance
- semantic search
- knowledge/context layer
- cross-domain recommendations
- multimodal analytics
- creator knowledge base

**9.0 — Advanced Personal Creator AI**
- persistent creator copilot
- creator-specific context
- proactive recommendations
- personalized content strategy
- personalized website optimization
- personalized commerce optimization
- personalized stream/overlay assistance
- advanced experimentation/personalization
- AI-assisted decision support

**10.0 — Full Creator Operating Platform**
- website
- builder
- CMS
- media
- assets
- templates
- components
- themes
- streaming
- Twitch/YouTube/TikTok and future platforms
- community
- overlays
- OBS
- commerce/merch
- analytics
- automation
- AI
- localization
- SaaS
- marketplace
- creator ecosystem
- global expansion

### 00.9.6.D.2 — Korábbi backlog megőrzési szabály

A korábbi MASTER **19–34** szakaszaiból származó történeti azonosítók és tartalmi nyomkövetés megmaradnak, de nem külön végrehajtási backlogként. A konkrét, aktuális funkciókövetelmények a MASTER **00.9.6.E/F** fejezeteiben vannak összefésülve és részletezve; fejlesztéskor ezeket és az egyetlen aktív F0.x pont DoD-ját kell követni. A történeti azonosító csak eredet-nyomkövetés, nem feltétel egy újabb térképezési körre.

Új, valóban hiányzó funkció felmerülésekor a követelmény közvetlenül a canonical domain, fázis, függőség, DoD, teszt és acceptance alá kerül. Domain-összevonás csak azonos célú rendszereknél történhet bizonyítékkal; külön capability nem törölhető puszta hasonlóság miatt.

### 00.9.6.D.3 — Teljes termékfelület

A végső platformon külön-külön, de közös architektúrával kezelendő:
- Public Website
- Creator Center
- Visual Editor
- CMS
- Media/Resource Library
- Icon Library
- Theme/Design System
- Template Library
- Component/Symbol Library
- Schedule/Calendar
- Stream Center
- Overlay/Stream Studio
- Platform Integrations
- Community
- Support
- Shop/Merch
- Analytics
- Automation
- AI Center
- Localization
- Settings/Security
- Billing
- Marketplace
- Developer/Integration surface
- Backup/Import/Export
- Diagnostics/Observability

### 00.9.6.D.4 — Kutatási és benchmark kapu

Minden nagyobb capability megvalósítása előtt külön research pass végezhető:
- hivatalos dokumentáció
- publikus API dokumentáció
- nyilvános demo
- működő creator oldalak
- nagy külföldi streamerek publikus oldalai
- CMS/builder/commerce/streaming benchmarkok
- szükség esetén publikus repositoryk és licencek

A kutatás eredménye a MASTER megfelelő pontjába kerülhet **reference / benchmark / edge-case evidence** formában. Más rendszerek zárt kódját nem másoljuk; saját canonical implementáció készül.

### 00.9.6.D.5 — Végrehajtási szabály

A teljes végső tervből egyszerre mindig csak **egy ACTIVE engineering point** nyílhat. A többi:
**QUEUED / PLANNED / BLOCKED / CLOSED / ARCHIVED**.

Ez biztosítja, hogy a teljes világvezető cél megmaradjon, miközben a tényleges fejlesztés továbbra is kontrollált, tesztelt és sorrendhelyes marad.

# 00.9.6.E — MASTER-2.74 — ÖSSZEFÉSÜLT, KÖZVETLEN TERMÉKKÖVETELMÉNY-KATALÓGUS

**Ez a szakasz a termék funkcionális igazságforrása.** A fejlesztéshez nem kell régi tervfájlokat, korábbi beszélgetéseket vagy történeti kivonatokat újra megnyitni. A régi anyagokból átvett és egységesített követelmények itt közvetlen, aktuális követelményként szerepelnek. A történeti ledger csak eredet- és nyomkövetési bizonyíték; nem külön specifikáció és nem végrehajtási függőség.

**Megőrzési szabály:** minden alábbi capability megmarad a teljes termékútban. Az, hogy egy funkció nem része az 1.0-nak, nem törlést jelent: a funkció a megjelölt későbbi fázisban marad. A legfrissebb felhasználói döntés felülírja a korábbi ütemezést, de egy funkció csak explicit termékdöntéssel törölhető. Az azonos célú elemeket egy canonical modulba kell összevonni; ez nem funkcióvesztés.

**Megvalósítási szabály:** a tervben való szereplés nem bizonyítja, hogy a funkció kész. Csak kóddal, teszttel, böngészős/éles ellenőrzéssel és az adott pont acceptance-eivel igazolt képesség kaphat PASS-t.

## E.1 — Termékfelületek és határok

A platform egy egységes creator-rendszer, amelynek felületei ugyanazokat a canonical domain-szolgáltatásokat használják:

1. **Public Website:** látogatóknak szóló creator weboldal és minden publikált oldal.
2. **Creator Center / Admin:** a teljes weboldal, tartalom, élő jelenlét, közösség és későbbi üzleti modulok kezelőfelülete.
3. **Visual Editor:** a weboldal vizuális felépítésére szolgáló külön szerkesztői munkatér.
4. **CMS / Content Center:** oldalak, bejegyzések, videók, VOD-ok, klipek, rövid videók és kampányok tartalmi kezelése.
5. **Resource / Media Library:** képek, videók, fájlok, ikonok, betűkészletek, feltöltések és felhasználási hivatkozások.
6. **Schedule / Calendar:** események, adások, megjelenési terv és a publikus adásrend.
7. **Live / Integration Center:** Twitch és a későbbi YouTube, TikTok, Kick, Discord, OBS, e-mail, fizetési és kereskedelmi kapcsolatok.
8. **Theme / Design System:** színek, tipográfia, térközök, komponensstílusok és reszponzív szabályok.
9. **Template / Component / Symbol Library:** újrafelhasználható oldalak, szakaszok, komponensek és összekapcsolt példányok.
10. **Stream / Overlay Studio:** streamelemek, overlayek, alert-ek, OBS browser source-ok és későbbi streamvezérlés.
11. **Store / Monetization:** merch, digitális termékek, támogatás, tagság és kampányok.
12. **Community / Audience:** közösségi funkciók, tagság, szerepkörök, moderáció és saját közönségkapcsolat.
13. **Analytics / Automation / AI:** adatok, szabályalapú munkafolyamatok és jóváhagyás-köteles AI-segítség.
14. **Platform Administration:** fiókok, workspace-ek, site-ok, csapatok, jogosultságok, előfizetések, integrációk, biztonság és üzemeltetés.
15. **Developer / Extension surface:** későbbi integrációs API-k, bővítmények, marketplace és import/export.

**Határszabály:** az Editor a tartalom szerkezetét és megjelenítését szerkeszti; a Schedule, Twitch, Store, Content, Analytics és más modulok a saját domainjük canonical adatait kezelik. Az Editor ezekhez konfigurálható dinamikus blokkokat biztosít, nem másolja le és nem birtokolja a domainadatokat.

## E.2 — Public Website: teljes funkcionális követelmény

A publikus oldal mobilon, tableten és asztali gépen is egységes, gyors és használható creator-márkaélményt adjon.

### E.2.1 — Alapoldalak és navigáció
- Kezdőlap, bemutatkozás / About, Schedule, Live, VOD / videók, Clips / Shorts, platformonkénti profil- vagy tartalomoldal, Community, Contact és későbbi Store, Membership, Events, Blog/News, Digital Products és Sponsor/Business oldalak.
- Az oldalak és az útvonalak a Page/CMS rendszerből legyenek kezelhetők; ne legyen szükség kézi HTML-módosításra a normál tartalomfrissítéshez.
- Közös fejléc, navigáció, lábléc, mobilmenü, aktív navigációs állapot, logó és közösségi linkek.
- Navigációs elemek sorrendje, címkéje, célja, láthatósága és új ablakos viselkedése kezelhető legyen; a jogosultság és külső URL validációja szerveroldalon is történjen.
- 404 oldal, üres állapotok, betöltés, API-hiba, offline állapot és karbantartási állapot kapjon tervezett felületet.
- Nyelvenkénti oldalcím, slug, metaadat és tartalom; a hiányzó fordításnak legyen explicit fallback szabálya.

### E.2.2 — Dinamikus creator állapot
- Twitch/live állapot, platformlinkek, aktuális kategória/játék és csak akkor megjelenő élő elemek, ha az adat hiteles és friss.
- Következő adás, időzóna, visszaszámlálás, adás állapota, elhalasztott vagy törölt esemény jelzése.
- Legfrissebb VOD, klipek, Shorts és más tartalmak konfigurálható feedje; üres és integrációs hibaállapotok.
- Közösségi CTA-k, feliratkozási/támogatási linkek és későbbi tagsági vagy termékblokkok.
- A külső platform meghibásodása nem teheti használhatatlanná az egész oldalt; fallback, utolsó sikeres frissítés és retry szabály legyen meghatározva.

### E.2.3 — Publikálás és tartalomminőség
- Minden publikált oldalhoz canonical URL, title, description, Open Graph/Twitter social preview, favicon, robots policy, sitemap és strukturált adatok szükség szerint.
- Megosztáskor helyes kép, cím és leírás; preview-változtatás publikálás előtt ellenőrizhető.
- Billentyűzetes navigáció, látható fókusz, szemantikus heading-struktúra, megfelelő kontraszt, alt text, űrlapcímkék és reduced-motion támogatás.
- Képek méretezése, modern formátumok, lazy loading és layout shift csökkentése; cache és invalidálás publikáláskor.
- Analitika csak megfelelő adatvédelmi/hozzájárulási szabályok mellett; a személyes adatok gyűjtése minimalizált.

## E.3 — Visual Editor: teljes, nem technikai felhasználónak szánt követelmény

Az Editor önálló, professzionális, vizuális alkalmazás. Az alapvető oldalépítéshez a felhasználónak ne kelljen CSS-t, HTML-t, JSON-t vagy kódot írnia. A kódalapú escape hatch később csak biztonságos, korlátozott és külön jogosultsággal engedélyezhető.

### E.3.1 — Munkatér
- Felső eszközsor: oldal neve, mentési állapot, undo/redo, viewport-váltás, zoom, előnézet, publikálási műveletek és kontextuális műveletek.
- Bal panel: Pages, Layers/Outline, Elements/Blocks és később Assets/Templates/Symbols lapok.
- Középső canvas: valósághű oldal-előnézet, kijelölési keretek, drop-zónák, guide-ok és viewporthoz tartozó szélesség.
- Jobb Inspector: kiválasztott oldal/elem tulajdonságai, kategóriák, keresés, mezőleírás, validáció és alapérték visszaállítása.
- Panelméretek, összecsukás és elrendezés kezelhető legyen; kis kijelzőn a munkatér átalakuljon, ne legyen levágott kezelőfelület.
- Üres projektben legyen egyértelmű első lépés, sablonválasztás és üres canvas; hibás állapotban legyen mentésvédelmi üzenet.

### E.3.2 — Canonical Page Model és fa
- Egyetlen canonical Page Model és egyetlen mentési/publikálási/revíziós út létezhet.
- Alapstruktúra: Page → Section → Container/Box → Column/Stack → Element; szükség szerint Slot és reusable Component.
- Stabil ID, típus, tulajdonságok, gyermekkapcsolat, sorrend, láthatóság, lock, responsive override, adatforrás és schema-verzió.
- A DOM/canvas nem lehet az adatmodell forrása. Minden felhasználói művelet strukturált parancson keresztül módosítja a Page Modelt.
- A fa nem engedhet ciklust, érvénytelen szülő-gyerek kapcsolatot vagy olyan node-típust, amely nem engedélyezett az adott konténerben.
- Sorrendmódosítás, reparent, duplicate és delete atomikus, validált művelet legyen.

### E.3.3 — Kijelölés és közvetlen manipuláció
- Kijelölés canvasról és Layers fából; egyértelmű hover/selected/focus állapot és breadcrumb a szülőkhöz.
- Elem mozgatása, átméretezése, drop-zónák, snapping, guide-ok, rács, zoom, pan és viewporthoz kötött határok.
- Kijelölés, drag és resize csak olyan tulajdonságot változtasson, amely az adott layout módhoz tartozik; a flex/grid elemeket ne alakítsa véletlen abszolút pozícióvá.
- Duplikálás, törlés, másolás/beillesztés, sorrend előre/hátra, lock/unlock, hide/show és többes kijelölés fokozatosan, tesztelt scope-ban.
- Billentyűparancsok, context menu és akadálymentes alternatívák; touch eszközön használható interakciók.

### E.3.4 — Layout és responsive
- Felhasználóbarát layout-választók: Vertical/Stack, Horizontal/Row, két-/háromoszlopos és grid elrendezés; oszlopszám, töréspont és sorrend.
- Igazítás, gap, padding, margin, szélesség/magasság, min/max, arány, pozicionálás, overflow, wrap és igazítási tengely.
- Flex/Grid/flow előnyben részesítése a merev abszolút pozicionálással szemben.
- Desktop/Tablet/Mobile viewport, viewport szélesség és külön responsive override-ok; az öröklési modell legyen látható.
- Mobile-on elem elrejtése, sorrendváltás és oszlopszám csökkentése kontrolláltan; nem megengedett, hogy egy desktop-módosítás észrevétlenül tönkretegye a mobilnézetet.
- Kontrasztos előnézeti állapot, overflow/wrapping figyelmeztetés és minimális viewport teszt.

### E.3.5 — Inspector / Property Registry
- Az Inspector mezői típusos, deklaratív Property Registryből származzanak, ne legyen minden elemhez külön ad hoc szerkesztési logika.
- Szöveg (1.0 plain text), későbbi Rich Text mező, URL, image/resource, szám, mértékegység, szín, token, select, toggle, spacing, typography, responsive és domain-specifikus mezőtípusok.
- Kategóriák, keresés, mezővalidáció, súgó, default/reset, dirty state, dependency, read-only és permission kezelés.
- Az Inspector, a canvas és a Layers mindig ugyanazt a state-et jelenítse meg; az érvénytelen módosítás ne kerüljön mentésre.
- Domain blokkoknál konfiguráció és adatforrás különüljön el: például Schedule blokk megjelenítési beállítása nem módosítja az események domainrekordjait.

### E.3.6 — Elem- és blokk-könyvtár
- Alapelemek: Heading, Text (az 1.0 stabil plain-text eleme), Image, Video/Embed, Button, Link, Icon, Divider, Spacer, List, Table, Quote, Card, Badge, Accordion, Tabs, Form és Container. Az összetett Rich Text szerkesztő külön, későbbi scope; a korábbi döntés alapján nem nyithat párhuzamos alapirányt.
- A Table/Accordion/Tabs elemeknek típusos tartalmi mezői, validációja, keyboard/focus kezelése, responsive viselkedése és publikus renderer-tesztje legyen; ha 1.0 előtt nincs kész és tesztelt acceptance-e, későbbi elemként maradnak, nem állítjuk késznek.
- Layout elemek: Section, Box/Container, Stack, Row, Columns, Grid és reusable Slot.
- Dinamikus Sanci blokkok: Live Status, Twitch Player/Channel, Next Stream, Schedule, VOD/Video Feed, Clips/Shorts, Social Links, Community CTA, Support, Merch/Product Collection és későbbi Membership/Events/Content/Analytics blokkok.
- Minden elemnél típusos default config, validáció, renderer, responsive viselkedés, accessible output és hiba/üres állapot.
- Új blokk hozzáadása kategóriával és kereséssel; preview a canvasban; kompatibilis drag-and-drop.
- Külső embed csak engedélyezett hostokról, CSP/permission szabályok mellett.

### E.3.7 — Undo/redo, autosave és helyreállítás
- Undo/redo a strukturált parancsokra épül, nem DOM-pillanatképre.
- Dirty state, mentés folyamatban/sikeres/hibás, retry és ütközésjelzés.
- Autosave csak validált állapotot menthet; explicit mentés is legyen.
- Expected-version/optimistic concurrency; párhuzamos változtatás esetén ne írja felül csendben a frissebb adatot.
- Navigáció elhagyásakor figyelmeztetés, recovery/draft visszaállítás és tesztelt browser refresh út.
- Minden művelet után a canvas, Layers, Inspector, undo/redo és a backend ugyanarra az állapotra jusson.

## E.4 — Page, CMS és publikálási életciklus

- Page CRUD, slug, státusz, nyelv, SEO, sablon, hozzáférés, menühöz rendelés, duplikálás és archiválás.
- Tartalmi státuszok: draft, in review/ready, published, scheduled publication, archived; a megengedett átmenetek explicit szabályok szerint működnek.
- Preview a publikált verzió módosítása nélkül; a draft nem szivároghat ki publikus útvonalon vagy cache-ben.
- Revision history: ki/mikor/mit módosított, összehasonlítás, visszaállítás, published revision link és verziókonzisztencia.
- Publish/rollback tranzakciós viselkedése, authorization, cache invalidation és sikertelen publikálás utáni visszaállás.
- Content types későbbi bővíthetősége: posts/news, videos/VODs, clips, Shorts, playlists, campaigns, content calendar és platformonkénti metadata.
- Tartalom újrahasznosítása feedekben és dinamikus blokkokban; a feedek lekérdezési és rendezési szabályai legyenek konfigurálhatók.

## E.5 — Resource, Media, Icon, Font és fájlkezelés

- Egy közös Resource Library legyen a canonical asset tulajdonos; az Editor, CMS, Schedule, Theme és későbbi Store erre hivatkozik.
- Upload, progress, cancel, retry, file picker, preview, keresés, szűrés, mappák/collectionök, címkék és metadata.
- Metadata: owner/site, MIME, méret, dimenzió, duration ahol releváns, alt text, caption, checksum, storage key, állapot, létrehozó és felhasználási hivatkozások.
- D1 csak metadata/referencia; nagy bináris állomány R2-ben. Upload validáció, méretkorlát, content-type ellenőrzés és jogosultság.
- Képekhez thumbnail/variant, fontokhoz license/metaadat, ikonokhoz név/csomag/keresés és egységes renderelési szerződés.
- Replace/rename/archive/delete előtt usage check; használt assetet ne lehessen észrevétlenül eltörni. Soft delete/restore ahol indokolt.
- Publikus és védett fájlok szétválasztása; digitális termékek védett letöltése későbbi commerce fázisban.

## E.6 — Theme, Design System, Template, Component és Symbol

- Design tokenek: colors, typography, font scale, spacing, sizing, breakpoints, radii, shadows, borders, button/card/form styles és focus states.
- Theme Editorből módosított tokenek az összes kapcsolódó blokkra érvényesüljenek; lokális override csak explicit legyen.
- Template Library: teljes site starter, page template, section template, block preset és későbbi creator-created template.
- Kiinduló template-kategóriák: Gaming, Just Chatting, Esports, Variety, VTuber, Music, Podcast, Creator Business, Merch-first.
- Component Library: reusable komponensek, variantok, slotok, alapértékek, belső struktúra és frissítési szabály.
- Symbol/linked instance: közös forrás és hivatkozott példány; a közös módosítás hatóköre előre látható, detach csak explicit művelet.
- Import/export, versioning, kompatibilitás, preview és rollback; későbbi marketplace licenc- és jogosultságkezeléssel.
- Template/component változás nem ronthat el csendben már publikált oldalt; migráció/preview és revízió szükséges.

## E.7 — Creator Center / Admin UX és modulok

### E.7.1 — Dashboard
- Áttekintés: Live/Offline, következő adás, legfrissebb tartalom, fontos feladatok, integrációs állapot, figyelmeztetések és későbbi audience/revenue/analytics kártyák.
- A dashboard csak valódi adatot és működő műveletet mutathat; placeholder vagy fake action nem kaphat aktív státuszt.
- Üres, loading, stale, partial failure, permission denied és error állapotokhoz külön UI.
- Gyors műveletek: oldal szerkesztése, adás létrehozása, tartalom hozzáadása, integráció javítása és későbbi termék/kampány létrehozása.

### E.7.2 — Navigáció és keresés
- Modulonkénti bal oldali navigáció, breadcrumb, aktuális oldal megjelölése, mobilmenü, visszaút a publikus oldalra és Adminba való biztonságos visszalépés.
- Globális keresés későbbi bővítéssel oldalakra, assetekre, schedule eseményekre, tartalmakra, termékekre és beállításokra.
- Quick actions / command palette, billentyűzetes elérés és legutóbbi elemek.
- Nem létező vagy még nem kész modul ne szerepeljen működőként; tervezett modul csak egyértelmű Planned/Coming later státusszal jelenhet meg.
- A session/auth védelmet minden admin útvonal és API érvényesítse; adminból kilépés és session lejárat viselkedése legyen explicit és tesztelt.

### E.7.3 — Közös UI-állapotok
- Közös visszajelzési rendszer: success/error/warning/info, inline validation, toast ahol indokolt, confirm dialog destruktív művelethez.
- Minden listában loading, empty, error, retry, pagination és permission state.
- Formdirty state, mentésállapot, hibamegőrzés és accessible focus management.
- Veszélyes műveletekhez egyértelmű hatásmagyarázat; törlés/leválasztás/rollback előtt confirmation.
- UI ne mutasson sikeres műveletet a backend visszaigazolása előtt.

### E.7.4 — Modulhatárok
- Website Manager: pages, navigation, SEO, publish és theme beállítások.
- Schedule Manager: eseményadatok, naptár, ismétlődés, időzóna és szinkronállapot.
- Integration Manager: connect/disconnect/reconnect, scope, token állapot, utolsó sync, health és hibák.
- Media Manager: fájlok, metadata, usage és storage állapot.
- Content Manager: ötletek, draftok, médiatartalom, címek, leírások, tagek, naptár és publikálási queue.
- Store Manager: termékek, variánsok, kollekciók, rendelések, kedvezmények és fulfillment adapter.
- Community Manager: tagok, szerepek, események, pollok, moderáció, reports és későbbi reputation.
- Analytics Manager: időszak, platform, weboldal, tartalom, community, commerce és export.
- Automation Manager: trigger, feltétel, action, verzió, log, retry és enable/disable.
- AI Manager: model/config, usage, prompt/template, generálási job, jóváhagyás, diff és rollback.
- Business/Sponsorship Manager: media kit, statisztikák, sponsor lead, deal, deliverable, deadline és kampány.
- Settings/Security: account, site, locale, domain, SEO defaults, roles, privacy, integrations, export/delete és audit log.
- A fenti modulok a teljes Creator OS célfelületei; az 1.0-ban csak a hozzá tartozó fázisban megvalósított elemek jelenhetnek meg működő funkcióként.

## E.8 — Schedule / Calendar

- Canonical schedule item; az Editor csak a Schedule blokk lekérdezését és megjelenítését konfigurálja.
- Mezők: cím, leírás, kezdés/vége, időzóna, platform, kategória/játék, thumbnail/artwork, stream link, visibility, státusz, featured, ismétlődési szabály, manuális override és külső platformazonosító.
- Státuszok: planned, live/in progress, completed, cancelled, postponed; a publikus megjelenés és notification az állapotot követi.
- Nézetek: list/calendar/upcoming/past, filter platform/státusz/kategória, keresés, pagination, esemény részletek.
- Időzóna és DST kezelése; a tárolt időpont és a megjelenített helyi idő nem keverhető össze.
- Ismétlődő esemény módosításánál választás: csak ez az esemény, ez és a jövőbeliek, vagy a teljes sorozat, amennyiben támogatott.
- Twitch-szinkron és manuális override ütközésének szabálya; sync state, last sync, hiba, retry és forrásjelölés.
- Oldaltulajdon, jogosultság, validáció, idempotencia és public API/render tesztek.
- A jelenlegi Schedule CRUD csak kezdeti alap; a teljes fenti képességkör fokozatosan épül fel, nem tekinthető késznek.

## E.9 — Platformintegrációk és Twitch

- Közös integration lifecycle: not connected, connecting, connected, degraded, needs reauth, disconnected, error; permissions/scopes, token expiry, last success, health és diagnostics.
- Connect/disconnect/reconnect, scope-változás, visszavonás, lejárt token, hálózati hiba, rate limit, provider downtime és hibás payload kezelése.
- OAuth state/PKCE ahol releváns, tokenek biztonságos tárolása, state/nonce validáció és callback védelem.
- Twitch 1.0 alap: connection ownership, hiteles live/offline állapot, channel/profile adat, aktuális kategória/játék ahol elérhető, schedule/live összekötés, last sync, hibajelzés és kézi retry.
- Külső webhook/API adat normalizálása canonical StreamEvent/Integration state-be; a többi domain ne függjön Twitch-specifikus formátumtól.
- Későbbi adapterek: YouTube, TikTok, Kick, Discord, OBS, e-mail, payment, commerce és egyéb szolgáltatások; minden adapternek külön scope, rate-limit, retry, sync és failure-path tesztje.
- A provider nem elérhetősége nem okozhat teljes weboldal- vagy adminleállást.

## E.10 — Content Factory és többplatformos tartalom

- Tartalmi ötlet, draft, script, thumbnail, title, description, tags, státusz, csatorna/platform, publikálási idő és kampánykapcsolat.
- Content calendar, queue, jóváhagyás, publikálási állapot és hibakezelés.
- VOD, clip, short, highlight, video, playlist és bejegyzés külön tartalomtípusként, közös metadata-konvenciókkal.
- Platformonként eltérő cím/leírás/thumbnail/tag és publikálási korlátozás.
- Import/szinkron, duplikáció felismerése, külső ID-k és idempotens feldolgozás.
- 1.x/2.x-ben cross-platform adaptation és publishing queue; a provider API-képességei és engedélyei alapján, nem feltételezett automatikus hozzáféréssel.

## E.11 — Stream Studio, Overlay és OBS

- Overlay/alert csomagok, stream frame-ek, scene/browser-source konfigurációk és reszponzív overlay renderelés.
- OBS kapcsolatállapot, scene/stream/recording state, parancsok, stream marker és későbbi replay buffer, ahol az OBS API ezt lehetővé teszi.
- Alert-ek: follow/sub/raid, donation/tip, merch purchase, membership és más események, csak ott, ahol provider vagy saját integráció ténylegesen biztosítja az eseményt.
- Chatbot, commands, timers, loyalty/points, giveaways, polls, moderation és prediction csak a megfelelő fázisban és az adott platform szabályai szerint.
- Macro Deck vagy hasonló külső vezérlés adapteren keresztül; nincs rejtett provider-függőség.
- A stream eszközök ne kerüljenek bele az Editor core-ba; az Editor az overlay/stream blokkok megjelenítését és elrendezését szerkeszti.

## E.12 — Shop, Merch, digitális termékek és monetizáció

- Termékkatalógus: product, variant, category, collection, media, price, currency, stock abstraction, status és fulfillment state.
- Terméktípusok: fizikai, digitális, bundle, limited edition, preorder és későbbi membership-linked product.
- Storefront: listázás, részletező oldal, keresés/szűrés, cart, checkout provider integration és order confirmation.
- Fulfillment adapterek: például Fourthwall, Printful, Shopify vagy későbbi provider; kezdetben integráció-alapú megoldás elfogadható.
- Későbbi saját commerce: order management, refund, discount code, gift card, customer account, abandoned cart, shipping/tax/VAT és invoicing integration.
- Digitális termékek: overlay/OBS/emote pack, wallpaper, preset, guide, ebook, course, download és license/access control.
- Biztonságos purchase → entitlement → customer access lánc; védett fájl nem tehető publikus R2 URL-lel korlátlanul elérhetővé.
- Monetizáció: tip/support, supporter goal, membership tiers, recurring payments, perks, members-only page/post/video, badge, supporter history, Discord role sync, Twitch subscriber benefits, discount, exclusive drops, poll és private event.
- Creator revenue és platform revenue elkülönítése; több creator közötti pénzkezelés csak megfelelő payment platform, compliance és jogi felülvizsgálat után.

## E.13 — Community és audience ownership

- Kezdetben külső platformokhoz kapcsolt community entry points; később saját member/profile/follow/comment/reaction/post/poll/event/notification rendszer.
- Moderation, report, ban, roles, submission, clip submission, badges, challenges és későbbi reputation/points.
- Discord role sync és membership entitlement csak hitelesített, naplózott adapteren át.
- Saját e-mail közönség: feliratkozási űrlap, consent, listák, segmentation, kampány, newsletter, automated/transactional e-mail és unsubscribe.
- Hozzájárulás visszavonása, export/törlés és adatmegőrzési szabályok.
- Későbbi member area és mobil/PWA funkciók: értesítések, schedule, live, community, store és creator dashboard.
- Founding Supporters oldal a támogatóknak; név megjelenítése kizárólag külön, önkéntes opt-in hozzájárulással, visszavonható módon. A támogatás ténye önmagában nem ad engedélyt a név publikálására.

## E.14 — Analytics, Automation és AI

### Analytics
- Website: visitors, sessions, page views, device, referrer, conversion és csak megfelelő jogalappal kezelt aggregált földrajzi adatok.
- Creator: Twitch/YouTube/TikTok/Kick metrics, provider- és időszakfüggő elérhetőséggel.
- Commerce: sales, revenue, average order value, conversion, product és campaign performance.
- Community: active members, engagement, retention és event participation.
- Egységes metric modell, forrás, időszak, frissesség, hiányzó adat és provider limit jelölése; CSV/export és hozzáférés-szabályozás.

### Automation
- Event → trigger → condition → action, verziózott szabályokkal.
- Példák: Twitch LIVE → website live state; Twitch LIVE → Discord alert; new video → content feed; purchase → stream alert; new member → Discord role; schedule changed → notification; new clip → social workflow.
- Delay, retry, idempotency, rate limit, dead-letter/failed state, audit log, enable/disable és per-site rules.
- Egy automation hibája ne indítsa el végtelenül ugyanazt a műveletet, és ne kerülje meg a domain permissionöket.

### AI
- AI website assistant strukturált szándékot alakítson validált Page Operations listává; közvetlen, korlátlan HTML/DB/kódmódosítás nem engedélyezett.
- Folyamat: intent → structured operations → schema validation → draft revision → diff preview → human approval → publish.
- AI-javaslatok: layout, content, SEO, title/description, localization, schedule/content workflow és később stream transcript, chapters, highlights, clip candidates, title/description és short-form scripts.
- AI-generated változás mindig preview, jogosultságellenőrzés, validáció, rollback és usage tracking mellett fusson.
- AI usage/permission, prompt templates, generation jobs, approval queue és hibák; provider-kulcs soha nem kerülhet böngészőbe.
- AI nem publikálhat vagy küldhet ki visszafordíthatatlan üzleti műveletet emberi jóváhagyás nélkül, ha az adott művelet ezt megköveteli.

## E.15 — Sponsorship / Creator Business Hub

- Media kit, automatikusan frissülő creator statisztikák, audience overview, brand category, rate card és brand assets.
- Sponsor lead, deal, campaign brief, deliverable, deadline, státusz, kampányanalitika és később invoice/payment status.
- Dokumentum- és adat-hozzáférés csak megfelelő szerepkörnek; a publikus media kit csak kiválasztott adatokat tehet közzé.
- A modul a Creator OS későbbi fázisában épül; nem akadályozza az 1.0 website/Editor befejezését.

## E.16 — Localization és nemzetközi használat

- Magyar az elsődleges induló nyelv; a modell és a UI legyen többnyelvű bővítésre alkalmas.
- Fordítási kulcsok, locale fallback, dátum/időzóna, szám/pénznem és nyelvenkénti SEO metadata.
- Fordítható Page/Content/Navigation/Theme/Template mezők; a fordítás ne írja felül a másik nyelv tartalmát.
- Hiányos fordítás látható státusza, preview és publish szabály.
- Később AI-assisted translation csak review és explicit elfogadás után.

## E.17 — Accounts, multi-site, teams és SaaS

- Későbbi tenant/workspace → users/members → sites → modules struktúra.
- Több site egy workspace-ben: streamer site, esports/team, personal brand, merch brand, podcast vagy event site; közös workspace, külön site settings.
- Szerepkörök: owner, admin, editor, designer, moderator, analyst, content manager, store manager, finance role; granular permissions modul- és site-szinten.
- Free/Creator/Pro/Business/Team/Agency csomagok csak a tényleges költségek, használati adatok és üzleti modell igazolása után kerülnek véglegesítésre.
- Billing, subscription, quota, usage, invoice, upgrade/downgrade/cancel és platform vs creator revenue határ.
- Tenant isolation minden rekordnál és műveletnél; a kliens által küldött tenant/site/workspace ID soha nem bizonyít jogosultságot.
- Ez hosszú távú cél, nem része automatikusan az 1.0 scope-nak.

## E.18 — Import/export, backup, diagnostics és developer surface

- Site/Page/Template/Component/Theme export/import verziózott, validált csomagformátumban; titkok és tokenek nem exportálhatók.
- Backup/restore és publikált/draft állapot visszaállíthatósága; a restore dry-run és integrity check után hajtható végre.
- Structured logs, request/correlation IDs, integration health, error codes, sync failures, queue/retry state, DB latency és cache hit/miss ahol elérhető.
- Admin diagnostics: failed jobs/syncs, integration status, deployment/version és actionable error details; secret/token nem kerülhet logba.
- Későbbi public API, webhook subscriptions, developer keys, extension/plugin contract és marketplace, scoped permissionökkel, rate limittel és verziózott API-val.

## E.19 — Platform-architektúra és biztonsági invariánsok

- D1 a relációs canonical domain adatokhoz; R2 nagy fájlokhoz; Queues retryzható aszinkron feladatokhoz; Workflows hosszú, több lépéses folyamatokhoz; Durable Objects csak tényleges stateful/realtime coordination igénynél.
- Minden domainnek canonical schema, service layer, API contract, authorization, validation, audit, tests és dokumentált failure behavior kell.
- Integrációs adapterek normalizálják a külső adatot; a domain nem támaszkodhat provider-specifikus payloadokra.
- Kritikus webhook és sync: signature/state ellenőrzés, replay protection, idempotency, rate limit, retry és hibás feladatok diagnosztikája.
- Biztonság: authentication, authorization, site ownership, tenant isolation, input validation, output encoding, XSS/CSRF védelem ahol releváns, secure cookies, secrets, OAuth state/PKCE, token protection, upload validation, least privilege és audit logging.
- Adatvédelem: consent, privacy policy support, data access/export/deletion, retention, cookie controls, unsubscribe és auditability; tényleges jogi kötelezettséghez szakértői felülvizsgálat szükséges.
- Cache invalidation eseményhez és publikáláshoz kötve; admin/editor state nem kaphat veszélyes stale cache-t.
- Minden migration forward-only, visszaállítási és adatvesztési kockázatának dokumentálásával; production D1 művelet előtt preflight, dry-run és utóellenőrzés.

## E.20 — Kötelező fejlesztési és elfogadási sablon minden funkcióhoz

Minden fejlesztési pont az alábbiakat tartalmazza; ezek nélkül nincs PASS:

1. **Felhasználói cél:** ki, mit, milyen eredménnyel végez el.
2. **UI útvonal:** hol található, hogyan jut oda, hogyan tér vissza.
3. **Funkcionális viselkedés:** normál, üres, loading, validation, error, retry és permission-denied eset.
4. **Canonical domain és adatmodell:** tulajdonos, mezők, státuszok, kapcsolatok és invariánsok.
5. **API/service:** contract, validation, authorization, error codes és idempotency ahol szükséges.
6. **Megjelenítés:** Admin/Editor/Public felületek és responsive/accessibility követelmények.
7. **Integráció és függőségek:** külső API, token/scope, rate limit, timeout és provider downtime.
8. **Tesztcsomag:** unit/domain, API/integration, D1/migration, permission/ownership, browser desktop/tablet/mobile és regresszió, az adott funkcióhoz mérten.
9. **Elfogadási forgatókönyv:** lépésről lépésre reprodukálható input → művelet → elvárt eredmény.
10. **Bizonyíték:** parancsok, tesztkimenet, browser/live ellenőrzés, commit és ismert korlátok.
11. **Státusz:** PLANNED / ACTIVE / BLOCKED / PASS / FAIL / DEFERRED; a PASS kizárólag minden releváns DoD teljesülése után.
12. **MASTER checkpoint:** eredmény, módosított canonical contract, következő egyetlen aktív pont.

### Kötelező negatív tesztek
- jogosulatlan user nem olvashat/módosíthat idegen site adatot;
- invalid input nem menthető;
- ismételt webhook/sync nem hoz létre duplikált eseményt vagy tranzakciót;
- provider outage nem teszi használhatatlanná a főoldalt vagy admin egészét;
- failed save/publish nem jelölhet sikeres állapotot és nem törölheti el a draftot;
- stale revision nem írhatja felül csendben a frissebb állapotot;
- törlés nem hagyhat sérült hivatkozást vagy elérhetetlen, még használt assetet;
- mobilnézetben nem lehet kritikus overflow vagy elérhetetlen kezelőelem;
- titok/token nem jelenhet meg kliensoldali kódban, URL-ben, logban vagy exportban;
- rollback/restore után a canonical adat és a publikus render konzisztens marad.

## E.21 — Teljes termékfázisok és scope-határ

- **F0.1–F0.13 — Creator Website 1.0 foundation:** a jelenleg aktív fejlesztési program. Editor első végig működő szelete, Admin dashboard, page/layer struktúra, canvas/Inspector, responsive layout, alap elem- és resource könyvtár, theme/template/component alap, Schedule-bővítés, Twitch UX és kapcsolat, draft/preview/publish/revision, public renderer, SEO/accessibility/performance és teljes E2E/regresszió.
- **1.x — Creator Profile / Link Hub és Content Hub:** profil/linkgyűjtő, tartalomfeed, VOD/Clips/Shorts és tartalomnaptár, további integrációk, audience capture és alap analitika.
- **1.5–1.9 — Monetization / Community / Automation foundations:** merch provider-integráció, digitális termékek, támogatás/tagság, community kapcsolatok, alert-ek és alap automatizáció.
- **2.x — Creator OS:** bővített Creator Dashboard, analytics, Content Studio, email/audience ownership, Sponsorship/Business Hub, OBS/Stream Control, advanced stream tools, AI Website Assistant és Stream AI.
- **3.x — Creator Business Platform / Marketplace:** commerce/membership/content/community/automation/AI integrációja; template, block, theme, overlay, OBS scene és digital asset marketplace, licencelés, rating/review és revenue share.
- **4.x — Multi-site / Teams:** több brand/site, workspace, szerepkörök és csapatmunkafolyamatok.
- **5.x — SaaS / Multi-tenant:** tenant/workspace isolation, csomagok, billing, usage/quota és platformadminisztráció.
- **6.x–10.x — Global Creator Ecosystem:** skálázás, bővítmény/API ökoszisztéma, fejlettebb automation/AI, integrációk és globális lokalizáció a későbbi roadmap szerint.

A fázisnév nem önmagában acceptance: minden fázis pontos végrehajtási pontokra bontandó, függőséggel, DoD-val és teszttel. Az 1.0 nem vállalja magára a teljes Creator OS megépítését, de a későbbi funkciók nem törlődhetnek és nem maradhatnak kizárólag címként megemlítve.

## E.22 — Teljességi zár és tervkarbantartás

- Ez a közvetlen termékkatalógus, a F0 végrehajtási sorrend és a hozzájuk tartozó domain/API/test szerződések alkotják a jelenlegi operatív tervet.
- A történeti 01–140 és 19–34 azonosítók csak audit-eredet/nyomkövetési hivatkozások. Egy fejlesztési ponthoz nem kell visszamenni a régi dokumentumba ahhoz, hogy megértsük, mit kell építeni.
- Minden régi követelmény a fenti canonical domainben és a megfelelő fázisban kap közvetlen leírást. Ha egy régi tétel nem térképezhető be egyértelműen, akkor **UNMAPPED REQUIREMENT** hibaként nyitott marad; nem lehet csendben törölni vagy késznek nyilvánítani.
- Minden új, korábban nem rögzített felhasználói igény közvetlenül ebbe a MASTER-be kerül, és megkapja a canonical domain, fázis, függőség, DoD és teszt meghatározását.
- A MASTER nem válhat ötletgyűjteménnyé: egyetlen ACTIVE engineering point lehet, a teljes jövőkép pedig PLANNED/QUEUED fázisokban marad.
- A MASTER változtatása előtt a jelenlegi tartalmat be kell olvasni, a módosítás után pedig ellenőrizni kell az aktív pontot, a fázissorrendet, a megőrzött capability-ket, a duplikált canonical owneröket és a lezárt gate-eket.



## 00.9.6.F — MASTER-2.74 — KÖZVETLEN MŰKÖDÉSI RÉSZLETEK ÉS TELJESSÉGI LEFEDETTSÉG

Ez a fejezet a platform követelményeit közvetlen, végrehajtható viselkedéssé részletezi. A funkció értelmezéséhez nem kell külön történeti tervfájlt vagy régi beszélgetést újra megnyitni. Ha egy képesség későbbi fázisban esedékes, a részletes követelmény akkor is megmarad, de nem válik automatikusan az 1.0 kötelező implementációjává. Egyszerre csak egy aktív fejlesztési pont van: F0.1.

### F.1 — Editor: stabil munkafolyamat, history és helyreállítás

**Kötelező felhasználói útvonal:** Creator Center → Weboldal → Oldalak → oldal kiválasztása/létrehozása → Szerkesztés → elem hozzáadása → kijelölés → Inspector/canvas szerkesztés → undo/redo → Save Draft → Preview → publish külön, explicit művelettel. Reload/reopen után az elem újra kijelölhető és szerkeszthető; mentés után nem fordulhat elő, hogy csak a törlés működik.

**Kötelező Editor regressziós forgatókönyv:** Box létrehozása → heading → text → button → divider → második text → második button; Layersben újra ki kell választani és szerkeszteni az első textet és headinget; módosítani kell a Box layoutját; menteni, újratölteni, minden elemet újra kijelölni; végül ellenőrizni kell a nyilvános renderben a gombok megjelenését, a sorrendet és a módosításokat. Ez a kritikus kijelölési, state-szinkron-, persistence- és render-regressziót fedi.

**History-szerződés:**
- Immutábilis history, legfeljebb 50 lépéses FIFO stack; az 51. lépésnél a legrégebbi bejegyzés kiesik.
- Egy felhasználói szándék egy history transaction. Gépelés 800 ms inaktivitás után vagy blur-nél egyetlen history entry.
- Slider/drag transaction a pointer down és pointer up között egy bejegyzés; add/delete/move/reparent/duplicate művelet önálló transaction.
- Programozott, preset- és batch-változtatás explicit transaction boundary-t kap. Félbemaradt transaction nem kerülhet a historyba. Undo/redo nem hozhat létre önmagára mutató entry-t.
- Undo/redo a canonical command/state modellre épül, nem DOM-pillanatképre; a canvas, Layers, Inspector és a mentett modell konzisztens marad.

**Autosave és recovery:**
- Debounced háttérmentés 2000 ms után az aktív draftba; az explicit Save Draft azonnal elérhető. Csak validált Page Model menthető.
- Local crash recovery helyreállítási példányt készíthet a nem mentett állapotból, de nem helyettesíti a szerveroldali draftot, és nem tárolhat tokent vagy secretet. Konfliktusnál a felhasználó választhat helyreállítás, szerververzió vagy elvetés között.
- Expected-version/optimistic concurrency; stale draft vagy párhuzamos szerkesztés nem írhatja felül csendben a frissebb revíziót.
- Navigáció/refresh előtt unsaved-changes figyelmeztetés; mentési hiba, retry és visszaállítás valós legyen, ne dekoratív UI.
- A history és autosave működését nagyobb Page Modellel is tesztelni kell; a számok nem indokolatlanul növelhetik a memória- vagy hálózati terhelést.

### F.2 — Dinamikus blokkok és adatbinding

- A canonical útvonal: Domain API/service → deklarált Data Source → schema-validált binding → engedélyezett transform → conditional rendering → renderer.
- Támogatott források fázisonként: site settings, Schedule query, hitelesített Twitch/live state, elérhető YouTube/TikTok-content, VOD/clip/content collections, később Store/Community/Membership/Analytics. Minden platformnál csak a hivatalosan elérhető és az adott kapcsolat scope-jával engedélyezett képesség használható.
- Query/filter/sort/limit beállítás csak deklarált schema szerint menthető. Arbitrary SQL, tetszőleges URL fetch, titkos API-kulcs vagy korlátlan JavaScript binding nem megengedett.
- Külön loading, empty, error, stale-data és partial-provider-failure állapot kell; a hiba nem jeleníthet meg raw stack trace-t, DB mezőnevet, tokent vagy titkot.
- Conditional visibility hiteles állapot alapján működhet, de nem kerülheti meg az authorizationt. A cache élettartam és invalidation publishhoz, Schedule-módosításhoz és integration synchez legyen kötve.
- A dinamikus blokk csak a saját megjelenési konfigurációját mentheti az Editorban; például a Schedule blokk layoutja nem írhatja át a Schedule domainrekordjait.

### F.3 — Editor legördülő kezelőelemek és elrendezés

Az alap oldalépítéshez ne kelljen CSS-t vagy HTML-t írni. Az Inspector biztosítson hétköznapi választókat:
- Box igazítás: Balra, Középre, Jobbra, Teljes szélesség.
- Szövegigazítás: Balra, Középre, Jobbra, Sorkizárt.
- Belső elrendezés: Egymás alatt, Egymás mellett, 2 oszlop, 3 oszlop, Grid.
- Függőleges igazítás: Felül, Középen, Alul.
- Méret: Automatikus, 25%, 50%, 75%, 100%, továbbá egyedi mértékegységes érték.
- Térköz: függőleges és vízszintes Spacer külön; gap, padding és margin külön értékként és ahol indokolt oldalanként. A vízszintes térköz módosítása nem írhatja felül a függőlegest.
- Méretezésnél szélesség/magasság, min/max, arány, overflow, wrap, order és reszponzív override csak az adott layout mód által megengedett módon működhet.
- Az elem kiválasztása canvasról és Layers fából azonos canonical state-re mutasson. Drag/resize nem alakíthatja át véletlenül a flex/grid elrendezést abszolút pozicionálássá.
- A 1.0 stabil alapeleme a plain Text. Az összetett Rich Text szerkesztő külön, tesztelt scope; a régi döntés szerint ne legyen új, párhuzamos rich-text irány, amely elhalasztja az alapszerkesztő lezárását.

### F.4 — Weboldal tartalmi és interakciós capability-k

- Publikus oldaltípusok: Home/Creator-home, Stream/Live, Schedule, VOD/Video Hub, Clips/Shorts, About/Creator, Community, Contact, Support, Link Hub és Sponsor/Press Kit. Store, Membership, Events, Blog/News és Digital Products a fázisroadmap szerint kapcsolódik be.
- Creator-home: live/offline, játék/kategória, nézőszám és follower/subscriber érték csak hiteles adat és megfelelő jogosultság esetén; következő adás/countdown; kiemelt és legutóbbi VOD/clip/video; social links; community/Discord; support/tip; későbbi merch; e-mail feliratkozás; kampány/esemény.
- Stream oldal: player/embed, stream állapot, cím/kategória, adás kezdete, következő adás, opcionális, biztonságos chat embed, support és közösségi linkek.
- VOD/Content Hub: VOD, highlight, clip, Shorts, YouTube/TikTok videók; kategóriák/tagek, keresés/szűrés, playlist és kapcsolódó tartalom. Ha automatikus platformadat nem hozzáférhető, legyen egyértelmű fallback/kézi link/import út.
- About/Creator: bemutatkozás, játékok, karrier, setup, FAQ, sponsor/partner és média-kit; Link Hub: platform/social linkek, fő CTA-k, Schedule, tartalom, Discord, merch/support, kampányok és email capture; későbbi smart redirect és link analytics a privacy policy szerint.
- Interakciók 1.0 alapja: click, hover, focus, active, submit, scroll, load, timer, open/close, navigation, show/hide és toggle — csak validált, hozzáférhető actionökkel. State machine, advanced transitions, animation timeline és keyframes későbbi, külön scope-olt funkció.
- Animation/interactions esetén reduced-motion, keyboard/focus, érvényes link/action, teljesítménykorlát és publikus renderer-teszt kötelező.

### F.5 — Content Factory és platformintegrációk részletesen

- Content Manager kezelje az ötletet, draftot, scriptet, címet, leírást, tageket/hashtageket, thumbnail briefet, platformot, publikálási időt, státuszt, kampánykapcsolatot és jóváhagyást.
- VOD ingestion/import, VOD kategorizálás, clip/Short menedzsment, content calendar, platformonként eltérő title/description/thumbnail/tag, publishing queue, külső ID és duplikációvédelem szerepeljen a későbbi Content Factory-ban.
- Twitch: OAuth/connection, live/offline, title/game/category, viewer/follower/subscriber statisztikák csak ahol az API és scope engedi, VOD, clips, webhook/event, sync state és hibadiagnosztika.
- YouTube: channel, video, Shorts, rendelkezésre álló analytics; quota limit, API hiba, hiányzó scope és fallback.
- TikTok: profile/content csak a hivatalosan és adott accountnál rendelkezésre álló API-képesség szerint; rate limit/fallback és kézi link/import.
- Discord alapként közösségi link; bot/role/status funkció csak külön integrációs scope-pal. Kick, OBS, e-mail, payment és commerce adapterek saját contractot kapnak.
- A provider-adatot canonical domain state-re kell normalizálni; egy külső API kiesése nem teheti használhatatlanná az oldalt. Hiányzó statisztikát nem szabad kitalált számmal pótolni.

### F.6 — Schedule, idő és tartalom-összerendelés

- Canonical Schedule item mezői: title, description, start/end, timezone, platform, game/category, artwork, stream link, visibility, featured, lifecycle status, recurrence, manual override és external ID.
- List/calendar/upcoming/past nézetek, keresés, szűrés és rendezés; cancelled/postponed/completed/live/planned állapotok.
- DST/időzóna helyes kezelése; recurrence szerkesztése csak esemény / ettől a jövőben / teljes sorozat scope szerint, amennyiben ez a funkció támogatott.
- Next-stream és countdown a canonical schedule, site timezone és hiteles live state alapján számoljon; lemondott vagy múltbeli esemény ne maradjon hibásan következő adásként.
- VOD/clip/Short összekapcsolható legyen az adott adással, kategorizálható legyen és bekerülhessen a content calendarba. Editorban a Schedule blokk megjelenítése konfigurálható, de a Schedule domainadat nem.

### F.7 — Admin, forms, store és kezelőfelületi szabályok

- Az Admin shellből mindig elérhető az Admin főoldal, az aktuális modul/breadcrumb, a publikus oldal megnyitása, profil/session állapot, logout, help és értesítések. Mobilon külön responsive shell kell.
- Minden modulban loading/empty/error/success/disabled state, save/unsaved state, inline validation, veszélyes művelethez confirm, keresés/filter/sort/pagination és indokolt tömeges műveletek legyenek; billentyűzetes működés és egyértelmű magyar UI-szöveg az 1.0-ban.
- Lejárt session kezelése szerveroldali policy szerint: logout/session invalidation, inactivity timeout, több tab és nem mentett változtatás figyelmeztetése; admin/API jogosultság nélkül nem használható.
- Public form: field schema, required/optional, labels, kliens- és szervervalidáció, spam/rate-limit védelem, success/error state és privacy notice.
- Store Manager: termék create/edit/duplicate/archive, variáns/SKU/ár/pénznem/kategória/collection/SEO/stock abstraction, order/payment/fulfillment status, refund/cancel/tracking és provider error. A storefront csak canonical product/collection adatot renderel.
- Fizikai merch, digitális termék, bundle, preorder, limited drop, kupon/gift card, order/customer és invoice/shipping/tax funkciók a megfelelő későbbi commerce fázisban; a teljes saját checkout nem automatikus 1.0 scope.

### F.8 — Analytics, AI, automation és stream intelligence

- Web analytics: page views, sessions, device/referrer, CTA/button/social click és konverzió csak consent/privacy szabály szerint; content/stream/commerce/community metric kizárólag valós, hiteles adatokból.
- Metricsnél forrás, időszak, frissesség, hiányzó érték, API limit és retention legyen jelölve; export és role-based access. Anomaly detection későbbi fázis.
- Automation lifecycle: event/schedule → trigger → condition → action → result → verify → audit. Típusok: scheduled, event, content, media, stream, notification. Delay/retry/idempotency/rate limit/dead-letter/failure state, enable/disable, version és per-site rules.
- AI Website Assistant ugyanazt a canonical Page Model command/action rendszert használja, mint a manuális Editor: intent → task plan → structured actions → permission → schema validation → preview/diff → approval → execute → verify → audit/version. Nincs arbitrary database write vagy közvetlen generált HTML-kód publikálás.
- Későbbi AI Orchestrator, Agent/Tool/Model Registry, Task Planner/Context Selector, Permission Checker/Approval Flow és több-modelles routing egyetlen auditálható feladat-életciklust alkot. Specialist agentek lehetnek: Web Engineer Agent, Visual Editor Agent, QA Agent, GitHub/Cloudflare Engineer Agent és Browser QA AI; ezek nem kapnak automatikus, korlátlan jogosultságot és nem kerülhetik meg a canonical API/action rendszert.
- AI cost/rate limits, user/site quotas, approval queue, prompt-template versions, usage/error logs, error recovery és rollback; provider key soha nem lehet browserben.
- Későbbi Stream Intelligence: live/silence/speech/chat activity/technical/audio-quality analysis ahol engedélyezett; context/scene suggestions, interesting moments, post-stream summary, VOD analysis, clip/Short candidates, platform-variánsok, thumbnail briefs, publishing advice, performance-feedback loops és szerkeszthető opt-in memory/preferences.
- További későbbi AI-eszközök: egykattintásos clip/Short jelölt- és exportfolyamat emberi ellenőrzéssel; stream setup diagnostics assistant; AI Control Center az engedélyek, használat/költség, feladatok, approval, provider állapot és audit áttekintésére; experience evaluation/experiment cycle. Ezek nem 1.0 release gate-ek, és minden végigfutó AI-workflow end-to-end tesztet kap.

### F.9 — SEO, accessibility, security és performance kiadási kapu

- Published/indexelhető oldalak: valid title/description/canonical, Open Graph és X/Twitter card, sitemap/robots, strukturált adatok ahol értelmes; draft/unpublished/preview nem indexelhető.
- Későbbi SEO tooling: redirect-kezelés és broken-link detection előnézettel és jóváhagyással.
- Public output: semantic HTML, helyes heading hierarchy, alt text, form labels, ARIA ahol szükséges, keyboard navigation, focus order/visibility, screen-reader metadata, kontrasztfigyelmeztetés, form accessibility és reduced-motion.
- Session/cookie: HttpOnly, Secure, helyes SameSite; expiry, inactivity timeout, logout/session invalidation. Megfelelő password hash, auth rate limiting, RBAC, szerveroldali can permission check, CSRF/Origin protection a választott auth modellnek megfelelően, input/output validation, OAuth state/PKCE, webhook signature/replay defense és upload validation.
- Minden publikus, preview és admin route-nak saját jogosultsági határa van; preview nem leakelhet draftot, log/export nem leakelhet tokent.
- Performance: JS bundle, lazy loading, image dimensions/variants, cache invalidation, Core Web Vitals, nagy page/tree history-memória és autosave overhead, API latency és production smoke. Számszerű budget a mérési baseline után rögzítendő.
- Visual regression baseline: publikus home/navigation/Schedule, Editor core state és desktop/tablet/mobile.

### F.10 — Backup, export/import, diagnostics és recovery

- Export csomag: verziózott Page Model/page revisions/theme/templates/components/media references és támogatott domainadatok; secrets és access tokenek nélkül.
- Import dry-run: schema/version compatibility, missing asset, duplicate IDs, permission/owner és migrációs kompatibilitás ellenőrzése; részleges hibás publikálás nem történhet.
- Recovery/restore: célverzió és ütközések előnézete, integrity check, backup-ellenőrzés, visszaállítás utáni Page Model/revision/public-render konzisztencia. Recovery drill fázisonként előírt.
- Diagnostics: deploy/version ID, request/correlation ID, last sync, provider health, failed jobs/retry, D1/migration/cache állapot, API latency és actionable error; sem secret, sem szükségtelen személyes adat nem kerül logba.

### F.11 — Teljességi lefedettség és megőrzési szabály

A következő csoportok közvetlenül specifikálva vannak ebben a MASTER-ben: media/resource/fájlok; dinamikus data binding; Twitch/YouTube/TikTok/Discord integrációk; Schedule/recurrence/timezone/countdown; VOD/clip/Short/content calendar; Editor interakciók és animáció; accessibility/forms; SEO; analytics/privacy; Admin/navigation/diagnostics; auth/RBAC/site ownership/secrets; backup/import/export/recovery; performance/visual regression; AI Editor actions; Stream Intelligence; automation; continuous feature discovery.

Fázis szerinti zár:
- **1.0:** stabil saját Sanci9517 public website + Admin + működő Editor első teljes szelete és szükséges layere/Inspector/mentési lánca; responsive; alap Media/Resource; Schedule/Twitch; draft/preview/publish/revision; SEO/accessibility/security/performance és release tesztek.
- **1.x:** profil/link hub, content hub, többplatformos integrációk, commerce alap, digitális termékek/membership/community, alerts/automation, email audience capture.
- **2.x Creator OS:** creator dashboard 2.0, analytics, content studio, audience/email ownership, sponsorship/business hub, OBS/stream control, advanced stream tools.
- **3.x+:** AI website assistant/stream intelligence, Creator Business Platform, Marketplace, multi-site/teams, SaaS/multi-tenant, billing és globális ökoszisztéma.

### F.12 — Sanci9517 projekt- és indulási kontextus (konfigurálható, nem hardcode)

- Indulási nyelv: magyar; nemzetközi bővítés később, ezért a dátum/idő, locale és UI-stringek nem hardcode-olhatók egyetlen nyelvre a domainmodellben.
- Kiinduló brand/content profil: gaming streamer, többek között Fortnite, Hearthstone és roguelike/Hades-jellegű játékok. Kiemelt játék, streamcím, Schedule és platformlinkek Adminból módosíthatók.
- Korábban megadott TikTok-azonosító: sanci9517twitch; az 5000 követő személyes cél, nem UI-garancia. A cél/link profilbeállításként legyen változtatható.
- Heti három stream korábban lehetséges ritmusként merült fel; Schedule-ban szerkeszthető terv, nem kötelező vagy beégetett ütem.
- Fejlesztési támogatás/kampány kontextus: korábban 1 000 000 Ft-os cél, Brancs/Ko-fi/Buy Me a Coffee jellegű online támogatás, fizikai jutalom nélkül merült fel. Ez nem automatikusan aktív fizetési modul: publikus kampány előtt aktuális cél, platformfeltételek, linkek és privacy/jogi információk újraellenőrzendők. Supporter nevek csak külön, önkéntes opt-in alapján jelenhetnek meg.
- Ezek projektkontextusok és kezdeti tartalomadatok; a termékben konfigurációként kell szerepelniük, és később változtathatónak kell maradniuk.



### F.13 — Game Profile, custom domain, Link Hub, email audience, teams és későbbi mobilélmény

**Game Profile / canonical játékprofil:**
- A Game Profile ne csupán név/kép pár legyen: stabil ID, canonical slug, megjelenített név, platform- és külsőazonosító-mapping, media/resource references, opcionális brand/presentation metadata, szín/hero/cover, lifecycle status és adminból szerkeszthető leírás.
- Schedule item Game Profile-ra stabil referencia útján mutathat; ne másolja le a játékprofil egészét és ne az elnevezés alapján kapcsoljon rekordot.
- Opcionális artwork vagy extra metadata hiánya nem eredményezhet hibás/üres layoutot. A publikus megjelenítés fallbackje legyen explicit, az Inspector pedig csak a létező, érvényes mezőket mutassa.
- A Game Profile külön domain legyen, a Page Model a hozzá tartozó resource/domain reference-t használja. Ne készüljön párhuzamos, editor-only játék-adattár.

**Custom domain és branding:**
- A végtermék célja saját creator domain támogatása. A domainkezelés a megfelelő fázisban tartalmazza a domain hozzáadását, tulajdonjog-verifikációt, DNS-állapotot, primary domain kiválasztását, SSL provisioning/renewal state-et, canonical URL-t, redirecteket és hibaállapotokat.
- Domaincsere vagy primary-domain módosítás előtt előnézet és explicit figyelmeztetés szükséges az URL-, SEO- és redirect-hatásokról. Nem ellenőrzött domain nem válhat automatikusan publikus primary domainné.
- Brandbeállítások: creator név, logó, favicon, social link registry, színek, betűk, vizuális tokenek, cover/avatar és kapcsolódó médiaforrások. Ezek konfigurálható adatok legyenek, ne hardcode a rendererben.

**Link Hub és kampánylinkek:**
- Alapfunkció: platform/social linkek, CTA-k, linkek sorrendje és láthatósága, Schedule/Content/Community/Support célok és mobilbarát Link Hub oldal.
- Későbbi bővítés: link-időzítés, campaign links, UTM paraméterek, QR-kódos megosztás, smart redirect és kattintásanalitika. Redirect/click analytics csak mérési és adatvédelmi szabályokkal.
- Külső linkeknél validált URL, világos külső-link viselkedés, veszélyes scheme-ek tiltása és a publikus menü/CTA konzisztencia szükséges.

**Email audience ownership:**
- Signup/subscribe form csak célhoz kötött, átlátható hozzájárulással gyűjthet címet; tárolandó az időpont, a consent/purpose verzió és az unsubscribe státusz.
- Későbbi funkciók: subscriber list, segmentation, campaigns/newsletters, automated és transactional email, email templates, opt-out/unsubscribe, bounce/failed delivery state, rate limits és consent history.
- Marketing és tranzakciós levél különüljön el. Unsubscribe után marketingküldés nem indulhat újra automatikusan; export/törlés/retention a privacy szabályok szerint.

**Workspace, team és permission model:**
- Későbbi struktúra: tenant → workspace/creator account → workspace members → sites → domain modules. Egy workspace több site-ot tarthat, például streamer brand, esports team, personal brand, podcast, event vagy merch brand, külön site settingekkel.
- Szerepkörök lehetnek owner, admin, editor, designer, moderator, analyst, content manager, store manager és finance role. A role ne csak navigációt rejtsen el: minden API/domain mutation szerveroldali permission checket kap.
- Workspace- és site-szintű hozzáférés külön kezelendő; a kliens által küldött site/workspace/tenant ID önmagában nem jogosultsági bizonyíték.
- A Free/Creator/Pro/Business/Team/Agency csomagok csak valós költség-, usage- és üzleti adatok alapján véglegesíthetők. Billing, quota, usage, invoice, upgrade/downgrade/cancel későbbi SaaS scope.

**Mobil/PWA jövőkép:**
- A publikus website 1.0-tól reszponzív web. A későbbi PWA vagy külön mobilalkalmazás lehetősége: notifications, schedule, live state, community, member area, store és Creator Dashboard.
- A későbbi creator app képességei: live status, alerts, schedule changes, analytics, moderation és content approval. Ez nem jelent külön Page Modelt vagy párhuzamos backend domaint; ugyanazokat a canonical API-kat és jogosultságokat használja.

**Template-kategóriák és későbbi marketplace:**
- Starter template-kategóriák: Gaming, Just Chatting, Esports, Variety, VTuber, Music, Podcast, Creator Business és Merch-first.
- Később creator-created template, component/block/theme/overlay/OBS scene/digital asset marketplace, licenc, kompatibilitás, verzió, preview, rating/review és revenue share. A marketplace csak külön jogosultsági, moderációs, fizetési és licencelési scope után aktív.


**Végső operatív szabály:** egyetlen aktív pont van: F0.1. A dokumentum minden fenti követelménye megmarad a maga fázisában. Új igény csak canonical ownerrel, fázissal, függőséggel, DoD-val, teszttel és acceptance-szel vehető fel; korábbi funkció nem maradhat puszta névként specifikáció nélkül.



---

# HISTORICAL / SUPERSEDED — MASTER-2.75 — FULL CREATOR PLATFORM: DEPENDENCY-FIRST EXECUTION ROADMAP

 > **Történeti pillanatkép, nem aktuális végrehajtási sorrend.** A képességek és a benchmarkforrások megőrzendők. A végrehajtási sorrendet a MASTER-2.77 váltja fel.
**Döntési státusz:** CANONICAL PRODUCT DIRECTION / LOGICAL ROADMAP  
**Cél:** a teljes Sanci9517 Creator Platform és AI Creator OS felépítése; nincs előre kijelölt végső kiadás vagy olyan verzióhatár, amelynél a fejlesztésnek meg kell állnia.  
**Végrehajtási szabály:** a dokumentum eleji `ACTIVE_POINT_ID` és `ACTIVE_SUBPOINT_ID` továbbra is kizárólagos az aktuális munkapont meghatározására. E fejezet a hosszú távú, függőség-alapú sorrendet teszi egyértelművé; nem indít párhuzamos munkát és nem írja felül az aktív F0.1-et.  
**Tervkarbantartás:** a korábbi fázis- és verziónevek történeti/nyomkövetési célból megmaradnak. A termék teljességét és a fejlesztés sorrendjét ezentúl nem egy 1.0/2.0-s címke, hanem az alábbi képesség- és függőségi térkép határozza meg. A már rögzített követelményeket nem töröljük; az átfedéseket canonical ownerhez kapcsoljuk, a hiányzó részleteket pedig új, egyértelmű azonosítóval vesszük fel.

## 2.75.1 — Termékcél és sikerdefiníció
A Sanci9517 egy magyar alapokról induló, nemzetközi alkotói platform: weboldal- és tartalomépítő rendszer, Creator Center, közösségi és streaming integrációs központ, videó- és média Content Factory, OBS/Stream Studio, alkotói üzleti eszközök, valamint ezekre épülő AI Creator OS. A cél nem a funkciók puszta mennyisége, hanem az, hogy a tartalomgyártó a lehető legtöbb napi feladatot egy egységes, személyre szabható, biztonságos és tanulásra képes munkakörnyezetben végezhesse.

**Kiemelt termékígéretek**
- Kezdők számára érthető, vezetett beállítás és egyszerű alapmunkafolyamatok; haladóknak mély testreszabás és részletes vezérlés.
- Egy közös Creator Centerből kezelhető weboldal, média, tartalom, platformkapcsolatok, közösség, stream, shop, analitika és automatizálás.
- Egyetlen canonical domain- és adatmodell, közös Resource Library, egyetlen publishing lifecycle és közös, engedélyezésen alapuló AI-eszközrendszer.
- Az AI az alkotó munkáját támogatja és automatizálja, de nem garantál nézettséget, virálisságot vagy bevételt. Javaslatait mérhető eredmények, minőségellenőrzés és felhasználói visszajelzés alapján javítja.
- A termék új alkotói típusokkal, platformokkal, formátumokkal és üzleti modellekkel bővíthető, anélkül, hogy minden alkalommal újra kellene építeni a központi rendszert.

## 2.75.2 — Külső benchmark: tanulságok és alkalmazásuk
A benchmark nem más termékek felületének vagy márkájának másolása. A cél a bevált képességek feltérképezése, a lefedettségi hiányok felderítése és a Sanci9517 saját, egységes megoldásának megtervezése.

| Referencia | Megfigyelt képesség / tanulság | Sanci9517-ben lefedendő képesség |
|---|---|---|
| Wix AI Website Builder | AI-alapú oldalindítás, üzleti és marketingeszközök, akadálymentességi segítség, fokozatos bővítés | Vezetett AI-onboarding, weboldalgenerálás, módosítható eredmény, SEO/accessibility ellenőrzés |
| Webflow CMS / Visual Builder | Vizualitás és strukturált CMS, komponensek, tartalomelőnézet, szerepkörök, lokalizáció, SEO/AEO | Canonical Page Model, CMS collections, reusable components, preview/publish, lokalizáció, granular permissions |
| OBS Studio | Helyi WebSocket-alapú vezérlés, scene/source automation, helyi futtatás és biztonságos kapcsolat | OBS connector/local companion, hitelesített kapcsolat, állapotfigyelés, scene/source műveletek és reconnect/error handling |
| Restream | Többplatformos streamelés, közös chat, platformonkénti streamstatisztika, transcript/chat alapján visszakereshető időpontok | Közös Live Center, ha a platformjogok és technikai útvonal ezt lehetővé teszik; egységes chat és visszanézhető streamtimeline |
| Streamlabs | Stream alert-ek, platformkapcsolatok, overlayek és eseményvezérelt reakciók | Overlay/Widget Studio, alert registry, eseményadapterek, tesztelhető browser source |
| OpusClip | Hosszú videóból klipjelöltek, AI caption, reframing, virality/quality scoring és publikálási munkafolyamat | Stream/VOD highlight detection, szerkeszthető clip project, platformonkénti kimenetek, pontszám indoklással és emberi review |
| Descript | Transzkripció-alapú szerkesztés, filler-word eltávolítás, felirat, hangjavítás, fordítás és klipgyártás | Transcript-alapú timeline/editing, hangjavítási pipeline, feliratok, nyelvi változatok, visszavonható AI-módosítások |
| Metricool / Buffer | Többplatformos naptár, ütemezés, analitika, inbox, legjobb időpontok és AI-javaslatok | Social Publishing Center, platformonkénti preview/validation, unified calendar/inbox, cross-platform analytics |
| Beacons | Link-in-bio, store, email marketing, media kit és beépített AI | Link Hub, Media Kit, CRM/audience ownership, digitális termékek, AI által támogatott üzleti munkafolyamat |
| Fourthwall | Merch fulfillment, digitális termék, tagság, shop, Discord/Twitch előnyök és integrációk | Commerce provider abstraction, merch provider, termék-/rendelés-/entitlement modell, membership/Discord role sync |
| Patreon | Tagság, közösségi tartalom, egyszeri digitális értékesítés és alkotói közönségkapcsolat | Saját közösségi feed, tagsági szintek, paywall/entitlement, digitális termék, közvetlen közönségkapcsolat |
| Canva | Sablonvezérelt vizuális készítés, márkaelemek és többféle kreatív kimenet | Brand Kit, design tokens, kreatív sablonok, thumbnail/overlay/asset export, következetes arculat |
| WordPress ökoszisztéma tanulsága | Bővíthetőség és sokféle integráció, ugyanakkor plugin-konfliktus és karbantartási teher kockázata | Verziózott extension/adapter contract, kompatibilitási ellenőrzés, permission sandbox, marketplace moderation és deprecation policy |

**Benchmark-források (elsődleges termék-/dokumentációs oldalak):**
- Wix AI Website Builder: https://www.wix.com/ai-website-builder
- Webflow CMS: https://webflow.com/feature/cms
- OBS Remote Control Guide: https://obsproject.com/kb/remote-control-guide
- OBS Developer Guide: https://obsproject.com/kb/developer-guide
- Restream Chat: https://restream.io/chat
- Restream Analytics: https://support.restream.io/en/articles/4167758-track-your-stream-s-performance-with-analytics
- Streamlabs Alerts: https://support.streamlabs.com/hc/en-us/articles/52499995174299-Setting-up-Your-Streamlabs-Alerts
- OpusClip: https://www.opus.pro/
- Descript Features: https://www.descript.com/features
- Metricool Planner: https://metricool.com/planner/
- Buffer Insights: https://support.buffer.com/en-us/articles/using-insights-in-buffer-x4gLauQU5a
- Beacons creator tools: https://help.beacons.ai/en/articles/4695105
- Fourthwall Memberships: https://fourthwall.com/memberships
- Patreon Digital Products: https://www.patreon.com/product/digital-products
- Webflow Localization: https://help.webflow.com/hc/en-us/articles/33961240752147-Webflow-Localize-overview

**Benchmark korlátja:** a funkciók elérhetősége platformonként, országonként, account-jogosultságonként és API-verziónként eltér. Minden külső integráció képességét a megvalósításkor az aktuális hivatalos dokumentációval és tényleges API-hozzáféréssel kell ellenőrizni; a marketingoldalon felsorolt funkció nem bizonyítja, hogy harmadik fél API-ja ugyanezt biztosítja.

## 2.75.3 — Canonical architekturális szabályok a teljes termékre
1. **Egy termék, egy canonical owner/domain:** a weboldal, CMS, media, schedule, platformintegráció, stream, content factory, shop, community, analytics és AI adatai saját domainhez tartoznak; ugyanazt az üzleti entitást nem tárolhatjuk több, egymással versengő modellben.
2. **D1 és R2 közös erőforrás-szabálya:** D1 tárolja a strukturált metaadatot, állapotot, jogosultságot, verziót és hivatkozásokat; R2 a nagy bináris fájlokat. A media, video, audio, thumbnail, font, overlay, template asset, export és clip ugyanazon Resource/Asset contracton keresztül érhető el. R2 nem önálló domain-adatbázis.
3. **Aszinkron feldolgozás:** nagy médiafeltöltés, transzkódolás, speech-to-text, AI-elemzés, klipgenerálás, fordítás, publikálás és analitika ne blokkoló webkérésben fusson. Queue/retry/idempotency/progress/cancel/dead-letter és költségkorlát kell; tartós, több lépéses workflow csak a szükséges infrastruktúrával.
4. **Platformadapterek:** Twitch, YouTube, TikTok, Discord, Kick és a későbbi platformok külön adapterek, közös capability/credential/rate-limit/retry/error/sync contract alatt. A platformonként nem támogatott funkciót a UI nem ígérheti; szükséges a kézi fallback.
5. **OBS helyi határ:** a böngészőben futó weboldal önmagában nem kap közvetlen, korlátlan hozzáférést a felhasználó gépén futó OBS-hez. Ehhez hitelesített helyi connector/companion vagy a felhasználó által engedélyezett helyi WebSocket-kapcsolat kell; alapértelmezésben localhost/explicit endpoint, titkosított secret-kezelés, explicit párosítás, visszavonás, reconnect és permission scope.
6. **AI nem ír közvetlenül adatbázisba:** minden AI által kezdeményezett változtatás canonical command/API, validation, authorization, audit, revision és rollback útvonalon megy át. A modellkimenet nem megbízható parancs és nem kap közvetlen D1/R2/OBS hozzáférést.
7. **Egységes AI Tool Registry:** a website, CMS, media, integrations, schedule, video, OBS, analytics, community és commerce műveletekhez leírt, verziózott tool-contractok tartoznak; a permission checker feladatonként és erőforrásonként ellenőriz, az approval flow pedig veszélyes vagy külső hatású műveleteknél kötelező.
8. **Bővíthetőség:** új platform, media-formátum, AI-modell, sablon, widget vagy commerce provider extension pointon csatlakozik. Nem engedünk be nem ellenőrzött plugin-kódot a privilegizált runtime-ba.
9. **Data portability:** export, import, törlés, account/site törlés, retention és helyreállítás nem utólagos kiegészítés; az adatmodell és az erőforrás-hivatkozások része.
10. **Minden kritikus funkció mérhető:** structured logs, correlation/task IDs, audit log, metrics, error states, latency/cost counters, health checks és diagnosztikai UI szükséges a megfelelő fázisban.
11. **API- és platformkorlátok tisztelete:** csak hivatalosan engedélyezett OAuth scope, API, kvóta, rate limit és monetizációs útvonal használható. A hiányzó hozzáféréshez őszinte státusz és kézi alternatíva kell.
12. **Accessibility és felhasználóbarátság:** billentyűzet, képernyőolvasó, kontraszt, reduced motion, reszponzív működés, érthető hibák, onboarding, üres állapotok és undo/redo a termék alapjai.
13. **Biztonság és adatvédelem:** site/workspace ownership, RBAC, tenant izoláció, OAuth secret védelem, rate limiting, CSRF/XSS/SSRF/IDOR védelem, fájlvalidáció, consent/retention, export/delete, AI-adatkezelés és audit.
14. **Nincs kettős implementáció:** meglévő canonical domain vagy lifecycle bővítendő; új párhuzamos editor, külön save/publish rendszer, második Resource Library vagy AI-only mutation útvonal nem hozható létre.

## 2.75.4 — Függőség-alapú teljes fejlesztési sorrend
A sorrend capability-gate-eket jelent, nem dátumokat és nem release-verziókat. Minden munkapont a MASTER elején szereplő egyetlen aktív pont szerint fut. A fázisok közötti átmenethez acceptance bizonyíték kell; a későbbi fázisok részletes alfeladatait a tényleges kódbázis és az előző fázis tanulságai alapján kell lebontani.

### STAGE 0 — Meglévő alapok és végrehajtási fegyelem
- A már bizonyított E4/E5/E6 alapok megőrzése: site ownership, D1-migrációk, Worker/API, Twitch OAuth ownership, regression és health checks.
- Aktív MASTER-pont, tiszta git-állapot, egyetlen aktív workstream, scope, tesztparancsok, rollback és acceptance rögzítése.
- Legacy editor/admin/surface csak dokumentált migrációval vagy eltávolítási döntéssel kezelhető; régi funkció nem törölhető pusztán hasonló elnevezés miatt.
- Kimenet: reprodukálható fejlesztési alap, regressziós baseline és a canonical útvonalak listája.

### STAGE 1 — Editor foundation és első teljes vertikális szelet
- `public/editor-v2/` az egyetlen aktív Editor.
- Shell, route/state lifecycle, loading/error/empty states, command/history/transaction boundary.
- Legalább egy valós szerkesztési út: kiválasztás → módosítás → validation → save/draft → reload → ugyanaz az állapot.
- A munkapontban már legyenek mérhető browser acceptance-ek, keyboard accessibility és regressziótesztek.
- Gate: az első slice ténylegesen működik; nem csak mock UI és nem csak typecheck.

### STAGE 2 — Creator Center / Admin shell és navigáció
- Áttekinthető dashboard, globális site/workspace selector, fő navigáció és státuszok.
- Onboarding checklist, első használatú konfiguráció, súgó és diagnosztika.
- A felület kezdő és haladó módja; a kritikus funkciók elérhetők legyenek fölösleges menühalmozás nélkül.
- Szerepkörönkénti láthatóság és tiltott műveletek visszajelzése.
- Gate: minden kanonikus admin területnek egyértelmű tulajdonosa és útvonala van.

### STAGE 3 — Canonical Page Model, Layers és vizuális szerkesztés
- Page/section/container/element fa, layers tree, selection, drag/drop, direct manipulation.
- Inspector + Property Registry, typed props, defaultok, validation és property serialization.
- Undo/redo, multi-select ahol biztonságos, copy/paste/duplicate, keyboard shortcuts.
- Layout primitives, flex/grid, spacing, sizing, constraints, stacking, alignment és responsive breakpoints.
- Desktop/tablet/mobile preview, overflow diagnostics, breakpoint inheritance és per-device override szabályok.
- Formázás, interakció, linkek, anchors, hover/focus/active, animációk, reduced-motion fallback.
- Gate: a vizuális állapot és a mentett Page Model mindig egyezik; nincs DOM mint adatforrás.

### STAGE 4 — Resource / Asset / Media közös rendszer
- Canonical Resource Registry és Resource Service/API; D1 metadata + R2 binary.
- Upload, multipart/large-file flow, MIME/magic-byte validation, méretkorlát, jogosultság, secure object key, malware/abuse policy.
- Folders/collections, search, filters, tags, metadata, alt text, crop, resize, replace, archive/delete, usage tracking, unused asset detection.
- Képek, SVG/icon, video, audio, font, dokumentum, thumbnail, overlay, scene asset, clip és export közös contract alatt.
- Transcoding/derivatives, thumbnails, cache/CDN, deduplication ahol biztonságos, checksum/integrity, lifecycle és cleanup.
- A media picker, Editor, CMS, Content Factory, shop és AI ugyanazt a Resource API-t használja.
- Gate: upload → metadata → R2 object → permission → preview → editor/content reference → publish → delete/recovery végig tesztelve.

### STAGE 5 — Design system, templates és komponens-ökoszisztéma alap
- Theme, tokens, typography, color, spacing, borders, shadows, breakpoints, component variants.
- Reusable components, symbols, global/local styles, component properties, versioning és dependency updates.
- Template/section/block library, kategóriák, preview, search, import/insert, replace/override és custom save.
- Brand Kit: logo, palette, font, imagery, voice/tone, thumbnail/overlay rules.
- Template-ből indulás, de teljes utólagos szerkeszthetőség; lock/override és compatibility validation.
- Gate: template/component használata nem hoz létre eltérő Page Modelt vagy második asset libraryt.

### STAGE 6 — CMS és teljes alkotói weboldal
- Structured content types/collections, fields, relationships, tags/categories, drafts, scheduled publishing, revisions.
- Blog/news, creator bio, games/categories, projects, portfolio, videos/VOD/clips, events, FAQs, sponsor/partner, press/media kit, downloadable resources.
- Navigation/menu, footer, breadcrumbs, search, pagination, related content, filters, dynamic pages, reusable content blocks.
- Forms/contact, newsletter signup, lead capture, spam protection, consent and submission management.
- Website settings, custom domain, DNS/SSL lifecycle, redirects, 404, preview links, staging/production separation.
- Public renderer: SSR/static/edge strategy a tényleges architektúrához illesztve, cache invalidation, canonical URL, sitemap, robots, RSS/feeds, metadata, Open Graph, structured data.
- SEO/AEO: page-level és site-wide audit, internal linking, crawl/index diagnostics, social previews, performance and accessibility checks.
- Gate: draft → preview → publish → public rendering → revision → rollback és cache refresh végig ellenőrizve.

### STAGE 7 — Schedule, streamer profile és első platformintegrációk
- Canonical schedule domain, timezone/DST, recurring events, exceptions, game/category, stream type, countdown, live/offline state.
- Twitch OAuth/connection lifecycle, token refresh/revoke, live state, title/category és csak ténylegesen engedélyezett statisztikák.
- Provider capability registry, integration health, scopes, quota, sync status, last success, retry and error recovery.
- YouTube, TikTok, Discord, Kick és későbbi platformok külön adapterként; kézi link/import fallback, ahol API hiányos.
- Közös Integration Center, account linking, disconnect, scope explanation, data freshness és permission review.
- Gate: token/secret nem kerül kliensoldalra, site ownership és platform identity nem keveredik, rate limit/error path tesztelt.

### STAGE 8 — Content Factory: tartalom- és publikációs központ
- Egy központi tartalom-entitás és asset provenance: source stream/VOD → transcript → highlight candidates → edit project → platform variants → scheduled/published items.
- VOD ingestion/import, source URL/file, metadata, collections, tags, chapters, search/filter, transcript és timeline.
- Content calendar, backlog, campaign, content pillars, recurring series, status workflow, draft/review/approved/scheduled/published/failed.
- Platformonkénti változatok: aspect ratio, duration, title, description, CTA, hashtags, cover/thumbnail, subtitles, safe zones, disclosure.
- Publishing queue, idempotency, retry, scheduled time/timezone, platform response, external IDs és duplikációvédelem.
- AI által készített title/caption/description/hashtags/thumbnail briefs, de szerkeszthető és jóváhagyható formában.
- Gate: egy forrásból több platformra készülő tartalom visszakövethető; nincs csendes duplikált publikálás vagy adatvesztés.

### STAGE 9 — Stream Studio, Overlay Studio és OBS connector
- Overlay/scene/widget/alert builder; responsive browser-source canvas; custom themes; preview/test event; version/publish/rollback.
- Alert event registry: follow/sub/raid/donation/purchase/membership csak ahol a provider vagy saját integráció hitelesen biztosítja.
- OBS pairing és local connector; WebSocket auth, local endpoint allowlist, secret rotation, permission scopes, disconnect/revoke.
- Read-only status: connection, scene, source, recording/stream state, dropped frames/stats ahol elérhető.
- Engedélyezett control: scene/source switch, stream marker, replay buffer, recording/stream actions csak explicit user grants és confirmation mellett.
- Browser source URL/token lifecycle, overlay cache, reconnect, safe-mode, failure indicators.
- Audio/video device/setup diagnostics és guided OBS configuration; platform-specific limitation handling.
- Gate: helyi és felhős határ biztonságos, illetéktelen távoli vezérlés nem lehetséges, disconnect és credential revoke tesztelt.

### STAGE 10 — Live Stream Intelligence és technikai asszisztens
- Valós idejű vagy near-real-time eseményekből álló timeline; timestampelt markers és visszanézhető bizonyíték.
- Audio: silence/speech, clipping, loudness, noise, voice/game balance, desync és dropout jelek, a rendelkezésre álló jelforrások szerint.
- Video/stream health: OBS stats, dropped frames, bitrate/encoding/network warnings, scene/source failures, black/frozen frame gyanú, CPU/GPU/system telemetry csak explicit local connectorral.
- Chat/audience signals: message velocity, emote/reaction bursts, moderation flags és platformonkénti különbségek.
- Contextual assistance: scene, game/category, stream title, schedule, past content performance és creator preferences alapján javaslat.
- Live cue panel: rövid, prioritásos, nem tolakodó tanács; mute/quiet mode, sensitivity, ignore/dismiss, explain-why.
- Privacy controls: live audio/video analysis opt-in, retention windows, sensitive segment exclusions, delete/export, local-vs-cloud processing choice where feasible.
- Gate: false positive/negative mérés, latency/cost budget, opt-in/out, stream impact és no-interference test.

### STAGE 11 — AI Highlight Detection és automatikus klipgyártás
- Több jelből történő highlight candidate detection: speech/emotion cues, chat spikes, game events where available, scene changes, creator markers and manual hotkeys.
- OBS replay buffer / local recording marker / VOD timestamp összerendelése; az esemény előtti és utáni context ablak megőrzése.
- Candidate scoring több dimenzióban: érthetőség, kontextus, audio/video minőség, hook, önálló érthetőség, duplikáció, policy/copyright risk.
- AI által indokolt pontszám és confidence; nem állítható garantált viralitás.
- Clip editor: in/out trim, timeline, crop/reframe, face/game focus, captions, speaker labels, blur/redaction, audio cleanup, brand overlay, safe zones.
- 9:16 / 1:1 / 16:9 és platformspecifikus export; captions, fonts, brand presets, thumbnails, hooks, CTA, translated variants.
- Human review, batch approve/reject, edit history, undo, regenerate, source linkage, export queue és R2 storage lifecycle.
- Gate: valós tesztanyaggal mérhető klipminőség, timestamp pontosság, audio/video sync, feliratminőség és visszavonhatóság.

### STAGE 12 — AI Video/Audio Studio és teljes tartalom-újrahasznosítás
- Transcript-based editing, word/sentence cuts, filler/pauses detection, chapter generation, show notes.
- Speech-to-text, speaker diarization ahol megbízható, captions/subtitles, translation/dubbing csak a jogok és voice consent szabályaival.
- Audio cleanup, loudness normalization, noise/echo reduction, silence trim, voice/music balance.
- Thumbnail/cover/graphic generation, brand consistency, editable layers and export formats.
- Long-form video, stream VOD, podcast/audio, tutorial, clip/Short, trailer, quote card és text post egy közös source lineage alatt.
- AI-assisted script, outline, hook, title, thumbnail brief, CTA, description, chapters és content repurposing.
- Human review, licensed assets/music, rights provenance, synthetic media disclosure where required.
- Gate: eredeti forrás és minden derivative kapcsolatban marad; nincs felülírás vagy publikálás jóváhagyás nélkül.

### STAGE 13 — Cross-platform publishing, social inbox és community
- Közös social calendar, platformonkénti composer/preview/validation, drafts, approvals, scheduled publishing, retries and failure queue.
- Twitch, YouTube, TikTok, Discord és későbbi adapterek capability-alapú funkciókkal; API hiány esetén kézi publikálási út.
- Unified inbox/comments/mentions/messages csak ott, ahol hivatalos API és engedély ezt biztosítja.
- Moderation tools, keyword filters, escalation, spam controls, saved replies, community announcements and event notifications.
- Discord bot/roles/channels, membership sync és event routing külön permissioned adapteren keresztül.
- Campaigns, collaborations, guest content, sponsor deliverables, cross-posting, link tracking and UTM.
- Gate: platformonkénti API scope, publish status, retries, duplicate prevention, moderation audit and data deletion verified.

### STAGE 14 — Creator Analytics, growth intelligence és kísérletezés
- Egységes dashboard, de a nem összehasonlítható platformmetrikák nem keverhetők félrevezető közös számmá.
- Stream, video, Shorts, social post, website, store, membership, email and campaign analytics.
- Audience retention, watch time, CTR, engagement, returning audience, conversion funnel, revenue, churn and content cadence, ahol a provider ad adatot.
- Content cohort, topic/format/platform/time comparisons; attribution confidence és API data coverage láthatóvá tétele.
- AI insight: mi változott, mi lehet az oka, milyen bizonyíték támasztja alá, milyen következő kísérletet érdemes futtatni.
- A/B vagy controlled experiments csak megfelelő mintával, mérési tervvel és platform-/privacy-szabályokkal.
- Creator goal planning, weekly review, progress tracking, experiment history, outcome feedback loop.
- Gate: metrika-definíciók dokumentáltak, adatforrás és frissesség látható, a korrelációt nem állítjuk bizonyított ok-okozatnak.

### STAGE 15 — Creator Business, merch, shop és monetizáció
- Product catalog: physical merch, print-on-demand provider, creator-fulfilled items, digital downloads, bundles, courses/assets, licenses and access rights.
- Product variants, inventory, pricing, discounts, coupons, drops, preorder, gift cards, campaign landing pages.
- Orders, checkout provider abstraction, payment status, refunds, chargebacks, taxes/VAT, shipping, fulfillment and customer support workflows.
- Digital delivery secure links, expiring downloads, license/entitlement checks, member-only products and post-purchase access.
- Membership tiers, recurring payments, perks, supporter goals, donations/tips, subscriptions, exclusive posts/videos, private events.
- Twitch/Discord/member benefit sync where supported; purchase/sub events can trigger overlays and automations through the shared event system.
- Shop builder blocks inside the same Page Model, theme and Resource library; commerce has its own canonical domain and never duplicates website content storage.
- Gate: payment/webhook idempotency, order state transitions, refund/revoke, entitlement security, tax/region rules and reconciliation tests.

### STAGE 16 — Audience ownership, CRM, email és creator communication
- First-party subscriber/contact list with consent source, purpose, timestamp, unsubscribe and deletion controls.
- Segments, tags, forms, lead magnets, newsletter, campaign templates, sequences and scheduled messages.
- Event-triggered messages, welcome/retention/reactivation flows, content notifications and member communication.
- Contact preference center, suppression lists, deliverability/bounce handling, anti-spam and compliance.
- Media kit, sponsor/brand CRM, outreach pipeline, contract/deliverables, campaign reporting and invoices where appropriate.
- Gate: consent and suppression enforced across every campaign, unsubscribes are immediate, sensitive data is not fed to AI without a valid purpose/permission.

### STAGE 17 — AI Orchestrator és platformszintű AI-asszisztens
- One AI Control Center for provider/model selection, tool registry, prompt/task versions, permissions, approvals, budget, usage, latency, error and audit.
- Context selector combines only authorized workspace/site/resource/platform data and applies data minimization.
- Task planner breaks a goal into steps, checks dependencies, executes through canonical tools, reports results and offers rollback where possible.
- Specialist agents: Website/Editor, Content Strategist, Clip/Video Editor, Live Stream Assistant, OBS/Technical Diagnostics, Social Publishing, Analytics/Growth, Shop/Business, Accessibility/SEO, QA/Release.
- AI can inspect broad authorized context but does not automatically receive unlimited permissions. Read, propose, draft, execute-low-risk and execute-high-risk are separate capability levels.
- Confirmation required for publish, delete, payment/refund, account connection, external messages, OBS stream controls and other consequential operations according to risk.
- Durable creator profile/preferences and outcome history with user inspection, correction, export and deletion.
- Prompt-injection defense, tool output validation, untrusted-source labeling, secrets redaction, model fallback, cost limits, timeouts and retry policies.
- Evaluation harness: task success, factuality, quality, tool correctness, regression, latency, cost, user approval and rollback tests.
- Gate: end-to-end workflows work with least privilege, audit trail and deterministic fallback; model output never bypasses domain validation.

### STAGE 18 — Automation and event/workflow engine
- Canonical event registry and typed triggers/conditions/actions across website, schedule, platforms, stream, content, community, store and analytics.
- Visual workflow builder, templates, test/simulate mode, schedule, delay, branch, loop limits, retry, idempotency, cancellation and dead-letter handling.
- Example workflows: stream live → site live state + announcement; stream ended → VOD import + transcript; highlight candidate → clip draft; approved clip → platform-specific publish queue; new order → thank-you + eligible overlay event; member join → entitlement + Discord role where supported.
- User-defined conditions, rate limits, per-provider quotas, dry-run, execution history, permissions and audit.
- Gate: loops/duplicate events bounded, failures visible, replays safe, external side effects require proper approvals.

### STAGE 19 — Multi-creator, teams, workspaces and SaaS readiness
- Tenant → workspace → members → sites/projects → domain resources model with strict tenant isolation.
- Invites, roles, granular permissions, team ownership, handoff, agency/client workspace, shared libraries and per-site settings.
- Collaborative editing, comments, review/approval, change history, conflict resolution and lock strategy.
- Plan/entitlement/quota model, usage metering, billing integration, AI/media storage budgets and transparent limits if the product becomes commercial SaaS.
- White-label/custom domain, organization-level templates, brand kits and controlled client access.
- Gate: cross-tenant IDOR/access tests, billing/entitlement consistency, data export/delete and audit coverage pass.

### STAGE 20 — Template/extension marketplace and creator ecosystem
- Public/private template, section, component, theme, overlay, OBS scene, widget, workflow, automation and digital asset catalogs.
- Compatibility/version manifest, preview, dependencies, permissions, asset provenance, update/rollback and migration.
- Creator publisher profiles, submission review, malware/security scan, policy checks, ratings/reviews, reporting and moderation.
- Licensing, attribution, revenue share, purchase/entitlement and refund/revocation.
- Extension API/SDK, sandboxing and permission declarations; no unreviewed code in privileged server/browser contexts.
- Gate: malicious package, incompatible version, license violation, payment/refund and publisher withdrawal scenarios tested.

### STAGE 21 — Globalization, accessibility, mobile and broad creator support
- Localization architecture for UI, CMS, site, shop, email, AI output and metadata; Hungarian-first but not Hungarian-only.
- Translation memory, glossary, locale-specific URLs, hreflang, date/time/currency/number formats, fallback, RTL readiness where relevant.
- Accessibility audits and remediation workflow; keyboard/screen reader, contrast, focus, reduced motion, captions, transcript and accessible forms.
- Mobile-first Creator Center and public site, tablet/desktop responsive behavior; optional mobile companion for notifications, quick approvals and stream markers.
- Support for multiple creator types: streamer, video creator, podcaster, educator, artist, musician, esports/team, coach, writer, community operator and small creator business.
- Gate: representative persona journeys, locale fallback, accessibility regression and mobile/tablet/desktop tests pass.

### STAGE 22 — Security, reliability, performance and operations at scale
- Threat modeling per domain, secure defaults, RBAC/tenant isolation, rate limits, input validation, upload protection, secrets rotation and incident playbooks.
- Database migration safety, backup/restore drills, R2 object integrity, orphan cleanup, disaster recovery and retention enforcement.
- Performance budgets, Core Web Vitals, CDN/cache invalidation, image/video derivative strategy, lazy loading and public-site load testing.
- Queue depth/lag, job retries, webhook health, external provider outages, circuit breakers and status dashboards.
- Observability, SLOs, alerting, error budgets, dependency inventory, supply-chain scanning, accessibility/security regression.
- Cost controls for storage, egress, media processing, AI tokens, transcription, video rendering and provider APIs; quotas and transparent usage.
- Gate: tested recovery, incident response, load, security and degradation paths; graceful failure instead of silent corruption.

### STAGE 23 — Continuous discovery and product evolution (always active)
- Minden jelentős bővítés előtt benchmark a releváns piaci szereplőkkel és hivatalos API-dokumentációval.
- User feedback, creator interviews, usability tests, support issue themes and analytics-informed prioritization.
- Feature-gap review against the 27 product domains in 00.9.6.C.1 and the historical ledgers H19–H34.
- Minden új igényhez canonical owner, dependency, data contract, permissions, UX, DoD, tests, rollback and phase assignment.
- Meglévő feature nem törölhető hasonló név vagy újabb ötlet miatt; előbb usage/dependency audit és explicit migration/supersession decision kell.
- E fejezet folyamatosan bővül; a termék teljessége nem jelentheti a kutatás végleges lezárását.

## 2.75.5 — Cross-stage capability checklist (nem hagyható ki)
- [ ] Website builder: pages, navigation, layers, canvas, inspector, responsive, forms, CMS, dynamic data, preview, publishing, revisions and recovery.
- [ ] Design system: tokens, brand kit, reusable components, templates, symbols, icons, fonts, media, asset provenance and template compatibility.
- [ ] Public website: custom domains, SSL, redirects, SEO/AEO, social preview, sitemap, RSS, performance, accessibility and analytics.
- [ ] Content Factory: VOD ingestion, transcript, clips/Shorts, captions, thumbnails, format conversion, content calendar, platform variants, approval and publishing queue.
- [ ] Live/OBS: local connector, scene/source controls, replay buffer/markers, technical diagnostics, overlays, widgets, alerts and secure pairing.
- [ ] Integrations: Twitch, YouTube, TikTok, Discord, Kick and future providers under a shared adapter contract with scope/rate-limit/error handling.
- [ ] Community: unified inbox where supported, moderation, Discord roles, announcements, memberships, audience consent and direct communication.
- [ ] Commerce: merch, POD, own fulfillment, digital products, shop, checkout/payment adapters, orders, refunds, taxes/shipping, memberships and entitlements.
- [ ] Analytics: platform-specific metrics, cross-platform views, audience, content performance, conversion, revenue, experimentation and evidence-backed AI insights.
- [ ] AI: tool/model registry, context permissions, task planner, specialist agents, approvals, budget, audit, long-term preferences, evaluation and rollback.
- [ ] Automation: events, triggers, conditions, workflow UI, idempotency, retries, quotas, dry-run and execution history.
- [ ] Platform foundation: accounts, workspace/site ownership, teams, RBAC, import/export, backups, recovery, privacy, deletion, localization and accessibility.
- [ ] Ecosystem: extension SDK, template/component/overlay marketplace, moderation, licensing, billing and revenue share.
- [ ] Operations: security, reliability, observability, performance, cost limits, migration safety and disaster recovery.
- [ ] Governance: continuous benchmarking, no duplicate canonical domains, no feature removal without evidence, one active workstream and proof-based PASS.

## 2.75.6 — Definition of Done for every future work item
Every implementation point must include, before coding:
1. User problem and measurable acceptance outcome.
2. Canonical domain/owner and impacted surfaces (Admin, Editor, public site, integrations, AI, storage).
3. Data/API contract, migrations, ownership/tenant scope and backward-compatibility plan.
4. Permission/security/privacy threat review and external API capability verification.
5. UX states: loading, empty, error, offline, permission denied, quota/rate limit, partial success and retry.
6. Unit/domain tests, integration tests, regression tests and browser/runtime acceptance as applicable.
7. Observability and diagnostics, with redacted logs and correlation/task IDs.
8. Failure recovery, rollback, idempotency and cleanup requirements.
9. Accessibility, responsive behavior, localization and performance impact.
10. User acceptance and explicit evidence before marking PASS.

**PASS jelentése:** a követelmény a tényleges implementációban működik, a releváns tesztek és runtime acceptance-ek sikeresek, a hibautak ellenőrzöttek, és a bizonyíték a MASTER-ben rögzített. A dokumentumba felvett funkció, mock UI, leforduló kód vagy puszta API-válasz önmagában nem PASS.

## 2.75.7 — Végrehajtási zár
- A jelenlegi aktív munkapont változatlanul az MASTER elején megadott `F0.1-EDITOR-FOUNDATION-AND-FIRST-USABLE-SLICE`.
- A következő fejlesztési lépést nem az határozza meg, hogy melyik távoli fázis tűnik izgalmasabbnak, hanem az aktív pont DoD-je és a függőségi sorrend.
- A későbbi OBS/AI/Content Factory funkciók tervezése most megőrzött cél; implementációjuk a szükséges helyi connector, media pipeline, integration contract, event model, security and async processing alapok megléte után indul.
- A roadmap bővítése nem jelent automatikus párhuzamos munkát, és nem engedélyez második Editor/Resource/Publishing/AI mutation rendszert.
- A korábbi követelmények és történeti traceability táblák továbbra is megmaradnak. Ha egy követelmény több helyen szerepel, egy canonical implementációhoz kell kapcsolni, nem törölni.


# HISTORICAL / SUPERSEDED — MASTER-2.76 — TELJES CREATOR PLATFORM: TÉTELES KÉPESSÉGKATALÓGUS ÉS VÉGREHAJTÁSI TERV

> A 2.76 tartalmi leltára, 40 domainje és 411 történeti követelmény-leképezése megőrzendő. Az Admin/Editor sorrendet és a végleges képernyőspecifikációt a MASTER-2.77 váltja fel.

**Ez a MASTER legfrissebb termék- és sorrenddöntése.** A régi követelmények megmaradnak; a lenti szakaszok a végrehajtás sorrendjét és a teljes lefedettség ellenőrzését teszik egyértelművé. A terv nem állítja, hogy a felsorolt funkciók már elkészültek.

## 2.76.0 — Nem alku tárgya: egy MASTER, minden igény, AI a legvégén

1. Ez az egyetlen MASTER dokumentum. A korábbi 01–140 lista, H19–H34 ledger, 00/A, 00.9.6.C/D/E/F és E/F részletes specifikációk megmaradnak. Semmit nem törlünk pusztán azért, mert régi, hasonló nevű vagy későbbi fázisba kerül.
2. A jelen 2.76 fázissorrendje felülírja a korábbi fázissorrend-javaslatokat, de **nem** törli a régi funkciókövetelményeket. A 2.75 külön szakasza kizárólag történeti pillanatkép.
3. A platform alapvető feladatai AI nélkül is teljesen elvégezhetők legyenek. Az AI nem lehet szükséges weboldalépítéshez, média szerkesztéshez, publikáláshoz, stream kezeléshez, analitikához, közösséghez, üzlethez vagy automatizáláshoz.
4. Az AI/generatív/agent képességek egyetlen opcionális, utolsó fő fázisba kerülnek. Minden korábbi fejezetben megőrzött AI-követelmény a végső AI-fázisban marad, kivéve az AI nélküli alapokhoz szükséges determinisztikus adat-/eseményszerződéseket.
5. Biztonság, jogosultság, privacy, site/workspace ownership, audit, accessibility, backup/recovery, hibakezelés és tesztelés minden szakasz része, nem a végére hagyott extra.
6. A képességek canonical domain ownerhez tartoznak. Az Editor a Page Modelt szerkeszti, nem birtokolja a Schedule/Media/CMS/Commerce/Analytics adatait. Egy funkciónak egy canonical adatmodellje, mutation útja és owner-e lehet.
7. A külső platformok korlátait nem találjuk ki. API/scope/kvóta ellenőrzés, frissesség, hibajelzés, retry és ahol kell kézi fallback kötelező.
8. A régi státuszok és a tervben szereplés nem bizonyítanak runtime készültséget. PASS csak tesztelt, működő, user-acceptance-szel igazolt képességre adható.

## 2.76.1 — A kész, AI nélküli termék definíciója

AI nélkül a creator képes legyen: teljes weboldalt felépíteni és publikálni; oldalakat, CMS-t, navigációt, formokat, SEO-t és egyedi domaint kezelni; médiafájlokat rendszerezni és kézzel szerkeszteni; videót vágni, átméretezni és exportálni; feliratfájlokat importálni/szerkeszteni/exportálni; tartalmakat több platformra előkészíteni és ott publikálni, ahol hivatalos API engedi; schedule-t és streamer profilt kezelni; OBS-t biztonságosan csatlakoztatni; overlayeket és alert-eket konfigurálni; közösségi és közönségfolyamatokat kezelni; riportokat és metrikákat látni; termékeket/rendeléseket/tagságot kezelni a kiválasztott providerrel; determinisztikus automatizálásokat futtatni; adatot exportálni, backupot visszaállítani, jogosultságot és adatvédelmi beállításokat kezelni.

A nem-AI kézi út nem lehet másodrangú demó: legyen használható, tesztelt és dokumentált. Az AI később kényelmet, javaslatot és automatizálást adhat, de nem pótolhat hiányzó alapfunkciót.

## 2.76.2 — Teljes domain- és képességkatalógus

Az alábbi 40 domain az aktuális képességtulajdonosok és fejlesztési területek katalógusa. A történeti 01–140/H19–H34 ID-ket nem helyettesíti; az eredeti részletes sorok megmaradnak, és minden fázis előtt az adott sorokat is ellenőrizni kell.

| ID | Canonical domain | Tételesen lefedendő képességek | Fő fázis |
|---|---|---|---|
| D01 | Platform foundation | env/config, migration, health, error contracts, diagnostics, logs, correlation IDs, feature flags | 0, 21 |
| D02 | Identity/Auth | login/logout, session expiry, recovery, credential lifecycle, account security | 0–2 |
| D03 | Ownership/RBAC | site/workspace scope, roles, permission registry, tenant isolation, negative IDOR tests | 0–1, 17, 21 |
| D04 | Creator Center | shell, dashboard, navigation, settings, task/notification center, global search, error/empty/offline states | 2 |
| D05 | Visual Editor | boot, canvas, layers, selection, Inspector, commands, undo/redo, clipboard, drag/resize, keyboard, recovery | 1–3 |
| D06 | Page/Site Model | canonical schema, stable IDs, node tree, validation, page CRUD, slug, revision, migration, publish snapshot | 3, 6 |
| D07 | Layout/Responsive | sections, containers, stacks, rows, columns, grid, spacing, breakpoints, inheritance, overflow checks | 3 |
| D08 | Public Renderer | route resolution, published rendering, cache/invalidation, fallbacks, 404/maintenance | 6 |
| D09 | Design System | tokens, colors, typography, spacing, states, theme revision, brand kit, global/local override | 5 |
| D10 | Components/Templates | reusable components, slots, variants, symbols/linked instances, site/page/section templates, compatibility | 5, 18 |
| D11 | Resource/Media | D1 metadata + R2 binaries, upload, validation, variants, collections, search, usage graph, soft delete/restore | 4 |
| D12 | Icons/Fonts | searchable icon packs, semantic names, font loading/fallback, licensing, accessibility labels | 4–5 |
| D13 | CMS/Content | pages, posts, news, VOD, videos, clips, Shorts, playlists, campaigns, tags, categories, collections | 7 |
| D14 | Forms/Leads | form builder, server validation, spam protection, consent, submissions, notifications, export/delete | 6, 15 |
| D15 | Navigation/Search | menus, footer, breadcrumbs, internal search, indexing, filters, pagination, redirects, broken links | 6–7 |
| D16 | SEO/Discoverability | metadata, canonical URLs, OG cards, sitemap, robots, RSS, structured data, crawl diagnostics, AEO | 6 |
| D17 | Schedule/Calendar | CRUD, recurring events, timezone/DST, exceptions, reminders, public calendar, live state | 8 |
| D18 | Streamer Profile | creator profile, channels, categories/games, links, business/contact details, profile visibility | 8 |
| D19 | Integration Center | OAuth, provider adapters, scopes, token lifecycle, health, quota, sync freshness, disconnect/revoke | 8, 11–12 |
| D20 | OBS/Stream Studio | secure local connector, pairing, WebSocket auth, scene/source status, permitted controls, markers | 9 |
| D21 | Overlay/Widgets | overlay builder, browser source, alerts, widget config, themes, preview/test, revision/rollback | 9 |
| D22 | Manual Media Studio | timeline, trim, split, crop, resize, aspect ratio, audio levels, export presets, derivative lineage | 10 |
| D23 | Captions/Transcript | manual transcript, SRT/VTT import/edit/export, timing, line breaks, language metadata | 10 |
| D24 | Content Factory | source/derivative links, media projects, metadata, content calendar, status, approvals, provenance | 7, 10 |
| D25 | Publishing Center | per-platform composer, preview, validation, schedule, queue, idempotency, retries, external IDs | 11 |
| D26 | Community/Moderation | comments/mentions where API permits, moderation queue, saved replies, Discord bot/roles, announcements | 12 |
| D27 | Audience/CRM/Email | consent, contacts, tags/segments, suppression, newsletter, sequences, unsubscribe, deliverability | 15 |
| D28 | Analytics/Reporting | platform metrics, definitions, freshness, filters, comparison, conversion, export, scheduled reports | 13 |
| D29 | Commerce | products, variants, inventory, checkout adapter, orders, refunds, tax/shipping integration, entitlements | 14 |
| D30 | Membership/Support | tiers, perks, supporter links, donations via supported provider, recurring benefits, gated content | 14 |
| D31 | Sponsorship/Business | media kit, sponsor CRM, outreach, deliverables, deadlines, approvals, reporting | 14–15 |
| D32 | Deterministic Automation | event registry, triggers, conditions, actions, schedule, retry, idempotency, dry-run, audit | 16 |
| D33 | Collaboration | workspaces, invites, roles, review, approval, comments, change history, conflict resolution | 17 |
| D34 | Ecosystem/Extensions | package format, SDK/API, permission manifest, sandbox, licensing, marketplace, moderation | 18 |
| D35 | Data Portability/Recovery | site export/import, asset manifests, backup, restore drills, deletion, revision recovery | 19; foundations earlier |
| D36 | Localization/Accessibility | locale, translation fallback, date/currency formats, keyboard, screen reader, contrast, reduced motion, captions | 20 + every stage |
| D37 | Security/Reliability | threat model, rate limit, secrets, upload safety, audit, observability, incident response, disaster recovery | 0, 21 |
| D38 | Scale/Cost | performance budgets, load tests, queues only when justified, media egress, storage, quotas and cost visibility | 21 |
| D39 | Optional AI | model/tool registry, authorized context, drafting, analysis, agents, approvals, budget, evaluation, audit | **24 only** |
| D40 | Product governance | benchmarks, feedback, gap review, canonical owner, dependency, DoD, no duplicate systems | continuous |

### Kifejezett lefedettségi szabály

- A 01–140 preservation matrix minden egyes sora megmarad és a hozzá tartozó D-domain/fázis DoD-jához kell kapcsolni. A fenti összesítő sorok nem helyettesítik az egyedi soronkénti követelményeket.
- A H19–H34 ledger minden egyedi sora megmarad. H32 stream/content intelligence elemei: profil, mérhető stream health és kézi markerek a nem-AI szakaszokban; automatikus pillanatfelismerés, modellezett javaslatok, összefoglalás és generálás a 24. opcionális AI-fázisban.
- H33 automations minden eleme a 16. AI-mentes, determinisztikus automation fázisban épül: trigger, condition, action, result, verify, audit, retry, idempotency, permissions, failure handling.
- H34 folyamatos benchmark/governance szabály marad; responsive, accessibility, design system, collaboration, backup és performance a megfelelő nem-AI fázisokba kerül; AI safety az opcionális 24. fázisba.
- A 00/A és 00.9.6.C/D/E/F részletes követelményei megmaradnak. Az esetlegesen még nem explicit módon hozzárendelt sor nem tekinthető teljesítettnek: a megfelelő fázis PASS előtt a pontos owner/fázis/teszt kapcsolatot rögzíteni kell.
- A korábbi 27 product domain, 0.x→10.0 fejlődési ív és a 19–34 történeti backlog nem törölhető. A régi fázisnevek történeti címkék maradhatnak, de az operatív sorrend ez a 2.76 terv.

## 2.76.3 — Végrehajtási sorrend, teljes DoD-vel

### STAGE 0 — Foundation és biztonságos fejlesztési keret
- E4/E5/E6 bizonyítékok, production ownership, auth, RBAC, D1/R2 boundary és migration safety megőrzése.
- Git/branch/deploy baseline, env/config, health, diagnosztika, hibakód, redacted logs és tesztparancsok.
- Legacy UI/runtime döntés csak használati és dependency-bizonyítékkal; vak törlés tilos.
- Kilépés: reprodukálható baseline, egy aktív pont, ismert invariánsok és negatív tesztek.

### STAGE 1 — Editor core és első valódi vertikális út
- Editor v2 boot, canonical Page Model, schema, stable IDs, tree invariants, validation.
- Egyetlen command/action rendszer: add/update/delete/reorder/reparent/duplicate, undo/redo.
- Canvas/Page Model binding, selection, dirty state, save state, error boundary.
- Út: oldal megnyitása → elem hozzáadása → módosítás → undo/redo → mentés → refresh → állapot visszaolvasása.
- Kilépés: a módosítás túléli az újratöltést; domain/unit/integration/browser acceptance PASS.

### STAGE 2 — Creator Center/Admin shell
- Modulnavigáció, dashboard, site/account settings, global search, task/notification state.
- Egységes loading/empty/error/offline/permission-denied, form validation, confirmation és unsaved warning.
- Reszponzív, billentyűzettel kezelhető, kezdőbarát UX.
- Kilépés: a shell valós modulokhoz vezet, nem statikus mock.

### STAGE 3 — Visual Builder, Layers, Inspector és responsive
- Canvas selection, layer tree, breadcrumb, search, lock/hide, reorder, drag/resize, guides, snapping, zoom/pan.
- Section/Container/Stack/Row/Columns/Grid/Slot; flex/grid preferencia és layout-specific invariants.
- Property Registry: text, URL, asset, number/unit, color/token, select/toggle, spacing, typography, visibility, responsive overrides.
- Desktop/tablet/mobile, inheritance, hide/reorder, overflow/wrap diagnostics, keyboard shortcuts, copy/paste és multi-select.
- Kilépés: Canvas, Layers, Inspector és Page Model azonos állapotot tükröz; responsive regresszió PASS.

### STAGE 4 — Egyetlen Resource/Asset/Media Library
- D1 metadata, R2 binaries; upload progress/cancel/retry, MIME/size validation, checksum, dimensions/duration, alt/caption/license.
- Search/filter/collections/tags, preview, variants/thumbnails, replace, archive, soft-delete/restore, usage graph/orphan detection.
- Használt resource törlése csak dependency/usage checkkel; public/protected access és lifecycle.
- Kilépés: Editor, CMS, Theme, Stream és Commerce ugyanazt a resource tulajdonost használhatja.

### STAGE 5 — Theme, Design System, Template, Component, Symbol
- Tokenek, typography, color, spacing, breakpoints, radii, shadow, border, focus and component states.
- Theme editor, brand kit, global/local override, revision, preview/rollback.
- Site/page/section/block templates; component slots/variants; reusable linked instance/symbol, detach és impact preview.
- Package import/export, compatibility/version, provenance/license, rollback.
- Kilépés: a közös komponens módosítása nem töri el észrevétlenül a publikált oldalt.

### STAGE 6 — Website Builder és Public Website
- Page CRUD, slug, nav/menu/footer, breadcrumbs, redirects, 404, maintenance, preview, staging/production boundary.
- Dynamic blocks/data binding, forms, server validation, spam/consent/submission workflow.
- Public renderer, published snapshot, cache/invalidation, CDN, fallback.
- SEO/AEO: canonical URL, metadata, OG cards, sitemap, robots, RSS, structured data, crawl diagnostics.
- Accessibility, performance, alt text, focus, semantic headings, reduced motion, image loading, Core Web Vitals.
- Custom domain, DNS/SSL verification, redirect, disconnect and recovery.
- Kilépés: draft→preview→publish→public URL→revision→rollback tesztelt; draft leak nincs.

### STAGE 7 — CMS és kézi Content Management
- Content types: posts/news/articles, video/VOD, clips/Shorts, playlists, campaigns, downloads, sponsor pages.
- Draft/review/approved/scheduled/published/failed/archived lifecycle, tags, categories, collections, search/filter.
- Editorial calendar, recurring series, campaign, checklist, approvals, content provenance and derivative lineage.
- Import/export, mapping, duplicate detection, missing references, partial failure recovery.
- Kilépés: tartalom kezelhető és újrahasznosítható, Page Model/domain adatok másolása nélkül.

### STAGE 8 — Schedule, Streamer Profile, Integration Center
- Schedule CRUD, recurring event, timezone/DST, exceptions, reminder, public calendar.
- Creator profile, games/categories, platform links, contact/business details.
- Twitch OAuth/token lifecycle, live state and allowed metadata; YouTube/TikTok/Discord/Kick adapters according to real capabilities.
- Scopes, rate limits, quotas, last sync, freshness, retry/backoff, manual refresh, revoke/disconnect, fallback.
- Kilépés: ownership, token security, provider limits and errors tested.

### STAGE 9 — Stream Studio, Overlay Studio és OBS (AI nélkül)
- Overlay/widget/alert builder, browser source, themes, variants, preview, test event, publish, version and rollback.
- Secure local connector, pairing, authenticated WebSocket, local endpoint allowlist, secret rotation and disconnect/revoke.
- Read-only stream/recording/scene/source status and telemetry where available.
- Explicitly permissioned scene/source controls, recording/stream actions and replay markers; consequential actions need confirmation.
- Kilépés: local machine boundary is safe; unauthorized remote control is impossible in tested scenarios.

### STAGE 10 — Kézi Media Studio és export pipeline
- Projects/source/derivative, timeline, in/out, trim, split, join, crop, resize, rotate, aspect ratios and safe zones.
- Manual audio/video track selection, levels, fades, waveform and supported basic cleanup.
- Export presets 16:9/9:16/1:1/custom, codec/bitrate options where supported, progress/cancel/retry.
- Manual highlight markers, chapter ranges, title/end cards, brand overlays and thumbnail selection.
- Manual transcript, SRT/VTT import/edit/export, subtitle timing, line breaks, language metadata.
- Long tasks: queue only when justified, idempotency, timeout, retry, cleanup, result verification; originals immutable.
- Kilépés: a creator can produce and export clips and variants without AI.

### STAGE 11 — Cross-platform Publishing Center
- Platform-specific composer/preview/validation, title, description, tags, CTA, cover, caption, aspect ratio and disclosure.
- Draft/review/approval/scheduled queue, publish results, external IDs and status history.
- Capability registry documents which official API supports publishing, analytics, deletion, comments and required scopes.
- Idempotency, duplicate protection, retries, rate limits, quota, partial success, failed queue and manual retry.
- Where API publishing is unsupported: clear manual checklist, export and copy-ready metadata.
- Kilépés: no fake success, silent duplicate or lost partial publish.

### STAGE 12 — Community, Moderation, Notifications
- Unified inbox only where API/scope permits; otherwise platform deep links.
- Comments/mentions, moderation queue, filters, saved replies, escalation, spam reporting, audit.
- Discord bot/roles/channels, announcements, event routing and permission lifecycle.
- In-app/email notifications, preference, digest, mute/quiet hours, delivery status and failure recovery.
- Kilépés: moderation/communication permission-bound and auditable.

### STAGE 13 — Analytics és reporting AI nélkül
- Stream/video/Short/social/site/store/email/campaign dashboards and provider-defined metrics.
- Time range, comparison, filter, segments, CSV export, scheduled reports where available.
- Watch time, retention, CTR, engagement, returning audience, traffic, conversion, revenue/churn where provider supplies data.
- Metric definitions, data freshness, missing data, API coverage, attribution uncertainty and sample size.
- Manual goals, weekly review, content comparison and experiment log; no invented metrics or unsupported causal claims.
- Kilépés: creator can understand data sources and performance without AI.

### STAGE 14 — Commerce, Shop, Merch, Membership, Sponsorship
- Physical/POD/creator-fulfilled/digital products, variants, price, inventory, bundles, discounts, drops, gift cards.
- Checkout/payment adapter, verified webhooks, order state, idempotency, refunds, chargebacks, tax/shipping integration.
- Fulfillment, tracking, customer support, secure digital delivery, expiring links, entitlement and revocation.
- Membership tiers, perks, support/donation providers, gated content and benefit sync where supported.
- Sponsor CRM, media kit, outreach, deliverables, deadlines, approvals and reports.
- Kilépés: payment/order/entitlement flows secure, replay-safe, recoverable; raw card data not stored.

### STAGE 15 — Audience, CRM, Email
- First-party contacts, consent source/purpose/time, preference, retention, export/delete.
- Forms, tags/segments, double opt-in where required, suppression list, unsubscribe, preference center.
- Newsletter/campaign templates, preview/test send, scheduling, transactional vs marketing separation.
- Sequences and deterministic triggers, frequency limits, bounce/complaint/deliverability.
- Kilépés: unsubscribe/suppression apply to every path; imported consent is not fabricated.

### STAGE 16 — Determinisztikus Automation (AI nélkül)
- Typed events, triggers, conditions, actions, schedules, branches, delays and test/simulate.
- Permission checks, idempotency, retry/backoff, timeout, concurrency limits, cancellation, quotas.
- Execution history, step results, correlation IDs, redacted errors, replay/manual retry/dead letter/audit.
- Examples: stream live→site status; stream ended→VOD import task; approved content→publish queue; order paid→entitlement; member event→supported Discord role.
- Loop protection and external side-effect confirmation.
- Kilépés: automation works with explicit rules/canonical actions and no model dependency.

### STAGE 17 — Workspaces, Teams, Collaboration, SaaS readiness
- Tenant/workspace/site/project/resource isolation, invites, roles, site transfer, offboarding and shared libraries.
- Collaborative editing only with explicit concurrency contract; comments/review/approvals/change history/conflict resolution.
- Plan/entitlement/usage limits if product is offered as SaaS, transparent quota/billing.
- Export/delete, owner handoff, session revocation, audit.
- Kilépés: cross-tenant negative tests and offboarding/transfer pass; slug collision is not proof of collaboration.

### STAGE 18 — Extension ecosystem / marketplace
- Packages for templates, sections, components, themes, overlays, widgets, OBS scenes, workflows and assets.
- Manifest, dependencies, compatibility, preview, license, attribution, import/export, update/rollback.
- SDK/API, permission declarations, sandbox, resource limits, security review and publisher moderation.
- Purchase/entitlement/refund/revocation only after commerce foundation.
- Kilépés: untrusted extension cannot gain privileged access.

### STAGE 19 — Portability, Backup, Restore, Recovery
- Site export includes pages, navigation, theme, content, resource manifest, schedule/config references and metadata.
- Import dry-run, conflict/mapping report, ID remapping, duplicate/missing asset detection, migration and rollback.
- Backup inventory/retention/integrity, encryption, restore drill, disaster recovery runbook.
- D1/R2 consistency, checksums, orphan scan, partial restore handling, accidental delete/revision recovery.
- Kilépés: actual restore rehearsal passes; a backup file existing is not enough.

### STAGE 20 — Localization, Accessibility, Mobile, Creator Types
- Hungarian-first locale architecture, translations, fallback, untranslated status, locale URLs/hreflang and localized metadata.
- Date/time/currency/number formats, timezone, fonts, search/slug rules and RTL readiness where relevant.
- Keyboard/focus, screen reader, contrast, semantic structure, accessible errors/forms, reduced motion, captions/transcripts.
- Mobile-first public site and responsive Creator Center, touch interactions, tablet layout and mobile preview.
- Creator types: streamer, VTuber, musician, podcaster, educator, esports/team, artist, coach, writer and creator business.
- Kilépés: representative persona flows pass across mobile/tablet/desktop; accessibility regression tested.

### STAGE 21 — Production hardening, Security, Reliability, Performance, Cost
- Threat models, auth/RBAC/IDOR, CSRF/XSS/injection, CSP, upload validation, secrets rotation, rate limiting and abuse controls.
- Migration safety, D1 integrity, R2 lifecycle, webhook verification, audit, retention and deletion.
- Core Web Vitals, bundle/asset budgets, image/video delivery, cache correctness, load tests and degraded modes.
- Background processing health, retries/circuit breakers, provider outages, observability, SLOs, alerts and incident runbooks.
- Storage/egress/transcode/API cost budgets, quotas, dependency/supply-chain scans and recovery drills.
- Kilépés: security, load, degraded mode, restore and incident exercises pass.

### STAGE 22 — Teljes AI-mentes end-to-end acceptance
- Website journey: new site→template→page edit→resource upload→preview→publish→public URL→revision→rollback.
- Stream journey: schedule→Twitch connect→OBS pair→overlay test→manual marker→media import→manual clip/edit/export.
- Publishing journey: asset→platform variant→approval→scheduled queue→success/failure/retry→external ID.
- Commerce journey where enabled: product→provider checkout→webhook→order→delivery/entitlement→refund/revoke→reconciliation.
- Audience journey: consent→contact→segment→send→bounce/unsubscribe/suppression→export/delete.
- Automation journey: event→rule→permission→action→result verification→audit→retry/replay.
- Negative permission tests, cross-site/tenant isolation, browser/device, accessibility, migration, restore and production smoke.
- **Kilépés:** az AI nélküli platform önállóan használható és elfogadott. Ez a core teljességi kapu.

### STAGE 23 — További nem-AI bővítések
- Új hivatalos provider adapterek, extra import/export, template/component packek, creator-specifikus workflow-k.
- Haladó custom domain, multi-site, agency/client handoff, reporting, manual editing presets és accessibility improvements.
- Minden bővítés előtt API/license/security/cost/UX benchmark, owner, dependency, DoD és tests.
- Ez bővítési sor, nem blokkolhatja a core AI-mentes elfogadását.

### STAGE 24 — AI platform: opcionális UTOLSÓ fő fázis
**Csak a Stage 22 PASS után. Az AI kikapcsolható marad, és semmilyen core útvonal nem függhet tőle.**
- AI Control Center: provider/model, privacy controls, budgets, usage, latency, failures and emergency disable.
- Unified Tool Registry existing canonical APIs/commands felett: typed schema, scopes, permissions, risk, idempotency, result verification.
- Context selector with least privilege; site/workspace/resource scoping, provenance, retention, redaction and user-controlled exclusions.
- Optional drafts for pages, content, titles, captions, newsletters, product copy and scripts; outputs editable and unapproved by default.
- Optional transcription/speaker labeling, highlight candidates, VOD summaries, clip suggestions, translation and repurposing with confidence/quality indicators.
- Optional live assistance based on explicit telemetry opt-in, timestamps/evidence, quiet mode, privacy/retention controls and latency/cost budgets.
- Specialist assistants (Editor, Content, Media, OBS/Diagnostics, Publishing, Analytics, Commerce, Accessibility/SEO) reuse canonical tools, never parallel backends.
- Risk tiers: read-only; propose/draft; low-risk reversible; high-impact. Publish/delete/payments/refunds/account-linking/outbound messages/OBS control require appropriate explicit approval.
- Prompt injection defenses, untrusted-source isolation, tool output validation, secret redaction, timeout, retry, budget and provider fallback.
- Evaluation: factuality, task success, output quality, tool correctness, false positives/negatives, regression, latency, cost, human approval and rollback.
- User-visible audit of requested task, context, tools, actions, result, failures and cost; inspect/edit/export/delete durable preferences.
- **Kilépés:** AI kikapcsolásával minden Stage 22 journey továbbra is működik; AI soha nem kerüli meg a permission, validation, approval, persistence vagy audit réteget.

## 2.76.4 — Külső benchmarkok és hivatalos források

A 2.75 történeti benchmarkjait megőrizzük, és minden nagyobb domain előtt frissítjük. Példák a kiinduló referenciákra:
- Wix AI Website Builder: https://www.wix.com/ai-website-builder
- Webflow CMS: https://webflow.com/feature/cms
- Webflow localization: https://help.webflow.com/hc/en-us/articles/33961240752147-Webflow-Localize-overview
- OBS remote control: https://obsproject.com/kb/remote-control-guide
- OBS developer guide: https://obsproject.com/kb/developer-guide
- Restream Chat: https://restream.io/chat
- Restream Analytics: https://support.restream.io/en/articles/4167758-track-your-stream-s-performance-with-analytics
- Streamlabs Alerts: https://support.streamlabs.com/hc/en-us/articles/52499995174299-Setting-up-Your-Streamlabs-Alerts
- OpusClip: https://www.opus.pro/
- Descript: https://www.descript.com/features
- Metricool Planner: https://metricool.com/planner/
- Buffer Insights: https://support.buffer.com/en-us/articles/using-insights-in-buffer-x4gLauQU5a
- Beacons creator tools: https://help.beacons.ai/en/articles/4695105
- Fourthwall Memberships: https://fourthwall.com/memberships
- Patreon Digital Products: https://www.patreon.com/product/digital-products

A benchmark rekordnak tartalmaznia kell: dátum, forrás, user problem, releváns minta, nem alkalmazható elem, API/license limit, canonical owner, dependency, döntés és acceptance/test következmény. Nem másolunk vakon és nem állítjuk, hogy a benchmarkban látott funkció nálunk létezik.

## 2.76.5 — Minden munkapont kötelező szerződése

1. User problem és megfigyelhető acceptance outcome.
2. Canonical domain ID, érintett felületek, régi 01–140/H19–H34 ID-k ahol releváns.
3. Scope/out-of-scope, adatmodell/API, migration/backfill, ownership és kompatibilitás.
4. Security/privacy threat review, permission, provider scope, secret, retention és delete/export.
5. Loading/empty/success/validation/permission-denied/offline/quota/partial-success/retry/recovery UX.
6. Unit/domain, integration, regression, negative, browser/runtime és production smoke tesztek a kockázat szerint.
7. Observability, redacted diagnostics, performance/cost limit, rollback, idempotency és repair.
8. Accessibility, responsive, localization és user-facing documentation.
9. User acceptance és bizonyíték; commit/evidence/known limitations/next point rögzítése a MASTER-ben.

## 2.76.6 — PASS és tervteljesség

- PASS csak ténylegesen működő, releváns tesztekkel és runtime/user acceptance-szel igazolt képesség lehet.
- Egy későbbi fázis nem tesz utólag PASS-szá egy kihagyott előfeltételt.
- A 01–140/H19–H34 egyedi sorait az adott fázis PASS előtt hozzá kell rendelni konkrét domainhez, fázishoz és teszthez. A fenti csoportosított térkép nem helyettesíti az egyedi traceability-t.
- Nem törlünk capability-t pusztán hasonlóság alapján; a duplikációt canonical owner összevonással oldjuk meg.
- Provider-függő funkciónál dokumentáljuk a valódi API-korlátot és a kézi fallbackot.
- A platform AI nélkül a Stage 22 végén teljes és használható; a Stage 24 külön opcionális értéknövelő réteg.

## 2.76.7 — Végrehajtási zár

- A dokumentum elején szereplő egyetlen ACTIVE_POINT_ID továbbra is a végrehajtás kizárólagos belépési pontja.
- A következő aktív pont: `F0.1-EDITOR-FOUNDATION-AND-FIRST-USABLE-SLICE`; a roadmap nem engedélyez párhuzamos workstreamet vagy fázisugrást.
- A régi 2.75 és 2.76 stage-sorrend történeti; a MASTER-2.77 az irányadó: az AI a 24. és utolsó opcionális fő fázis.
- A MASTER bővíthető a H34 szabály szerint, de minden új igénynek owner, dependency, DoD, teszt és fázis kell; a korábbi követelmények megőrzése kötelező.


## 2.76.8 — Teljes, soronkénti visszakövethetőség: 01–140

Az alábbi táblázat a MASTER eredeti 140 funkciósorát egyenként megőrzi, és hozzákapcsolja a 2.76 végrehajtási szakaszait. A régi státusz és scope történeti adat; nem runtime PASS. Ha egy sor több domaint érint, a legkorábbi szükséges függőség és a downstream modul is szerepel.

| Historical ID | Megőrzött funkció | Eredeti canonical owner | MASTER-2.76 cél |
|---|---|---|---|
| 001 | GitHub + Cloudflare alapstruktúra működő branch/deploy útja | Platform foundation / persistence | Stage 0, 1, 19, 21 |
| 002 | D1 séma és canonical oldalmodell teljes auditja | Platform foundation / persistence | Stage 0, 1, 3 |
| 003 | Legacy → canonical migráció véglegesítése és ellenőrzése | Platform foundation / persistence | Stage 0, 1, 19, 21 |
| 004 | Legacy HTML teljes leválasztása és archiválása | Platform foundation / persistence | Stage 0, 1, 19, 21 |
| 005 | Canonical Page Model kizárólagos aktív használata | Platform foundation / persistence | Stage 1, 3 |
| 006 | D1 draft / published snapshot / revision modell teljes validálása | Platform foundation / persistence | Stage 6, 11, 19 |
| 007 | Revision rollback teljes tesztje | Platform foundation / persistence | Stage 6, 11, 19 |
| 008 | Audit log teljes ellenőrzése | Platform foundation / persistence | Stage 0, 1, 19, 21 |
| 009 | Autosave | Platform foundation / persistence | Stage 0, 1, 19, 21 |
| 010 | Backup / restore | Platform foundation / persistence | Stage 19, 21 |
| 011 | Auth / session alap | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 012 | Editor jogosultság / RBAC alap | Auth + Pages/CMS | Stage 1, 3 |
| 013 | Oldallista D1-ből | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 014 | Egyedi oldal megnyitása D1-ből | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 015 | Oldal létrehozása | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 016 | Oldal átnevezése | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 017 | Oldal törlése | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 018 | Slug kezelés és ütközéskezelés teljes UI teszttel | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 019 | CMS teljes regressziós teszt | Auth + Pages/CMS | Stage 1, 2, 6, 7, 17 |
| 020 | Editor betöltés / boot diagnostics | Visual Editor Core | Stage 1, 3 |
| 021 | Canonical Page Model betöltése | Visual Editor Core | Stage 1, 3 |
| 022 | Node ID / parent / children modell | Visual Editor Core | Stage 1, 3 |
| 023 | Selection alap | Visual Editor Core | Stage 1 |
| 024 | Layer tree alap | Visual Editor Core | Stage 1, 3 |
| 025 | Command API alap | Visual Editor Core | Stage 1 |
| 026 | Undo / redo alap | Visual Editor Core | Stage 1, 3 |
| 027 | Element update / add / delete / duplicate commandok alapja | Visual Editor Core | Stage 1 |
| 028 | Hierarchy reparent / reorder command alapja | Visual Editor Core | Stage 14 |
| 029 | Canvas Engine foundation | Visual Editor Core | Stage 1, 3 |
| 030 | Responsive engine foundation | Visual Editor Core | Stage 1, 3 |
| 031 | Property Registry foundation | Visual Editor Core | Stage 1 |
| 032 | Canvas Engine tényleges bekötése az Editor rendererbe | Website Builder / Layout / Inspector | Stage 1, 3 |
| 033 | Stabil DOM ↔ Page Model node binding | Website Builder / Layout / Inspector | Stage 1, 3 |
| 034 | Geometry Inspector | Website Builder / Layout / Inspector | Stage 1, 3 |
| 035 | Responsive geometry | Website Builder / Layout / Inspector | Stage 1, 3 |
| 036 | Drag | Website Builder / Layout / Inspector | Stage 1, 3 |
| 037 | Resize | Website Builder / Layout / Inspector | Stage 1, 3 |
| 038 | Snap / guides / alignment | Website Builder / Layout / Inspector | Stage 3, 6 |
| 039 | Layer / lock / hide / rename teljes editor UX | Website Builder / Layout / Inspector | Stage 1, 3 |
| 040 | Multi-select / group / ungroup | Website Builder / Layout / Inspector | Stage 3, 6 |
| 041 | Canvas zoom / fit / grid / viewport UX | Website Builder / Layout / Inspector | Stage 1, 3 |
| 042 | Nested hierarchy teljes működése | Website Builder / Layout / Inspector | Stage 3, 6 |
| 043 | Invalid nesting védelem | Website Builder / Layout / Inspector | Stage 3, 6 |
| 044 | Section / container / row / columns / flex / grid / stack | Website Builder / Layout / Inspector | Stage 3, 6 |
| 045 | Layout sizing / spacing / alignment / distribution | Website Builder / Layout / Inspector | Stage 3, 6 |
| 046 | Positioning / overflow | Website Builder / Layout / Inspector | Stage 3, 6 |
| 047 | Responsive layout szabályok | Website Builder / Layout / Inspector | Stage 1, 3 |
| 048 | Typography Inspector | Website Builder / Layout / Inspector | Stage 1, 3 |
| 049 | Appearance Inspector | Website Builder / Layout / Inspector | Stage 1, 3 |
| 050 | Interaction / accessibility / advanced properties | Website Builder / Layout / Inspector | Stage 20, 21, 22 |
| 051 | Property search / reset / validation | Website Builder / Layout / Inspector | Stage 3, 6 |
| 052 | Text / rich text | Content / Media / Asset | Stage 4, 7, 10 |
| 053 | Image / video / embed | Content / Media / Asset | Stage 4, 7, 10 |
| 054 | Button / link / CTA | Content / Media / Asset | Stage 4, 7, 10 |
| 055 | Card / list / table / accordion / tabs | Content / Media / Asset | Stage 4, 7, 10 |
| 056 | Social és streamer blokkok | Content / Media / Asset | Stage 8, 9 |
| 057 | Twitch / YouTube / TikTok / Discord blokkok | Public social-link blocks + platform adapters | Stage 8, 9 |
| 058 | Schedule / Live / Countdown / VOD blokkok | Content / Media / Asset | Stage 8, 9 |
| 059 | Form / contact blokkok | CMS / Form domain + secure submission boundary | Stage 6, 15 |
| 060 | Media library / R2 | Content / Media / Asset | Stage 4 |
| 061 | Draft | Publishing / Revision / Import-Export | Stage 6, 11, 19 |
| 062 | Preview | Publishing / Revision / Import-Export | Stage 6, 7, 11, 19 |
| 063 | Publish | Publishing / Revision / Import-Export | Stage 6, 11, 19 |
| 064 | Public renderer canonical published documentből | Publishing / Revision / Import-Export | Stage 6, 11, 19 |
| 065 | Public / draft izoláció | Publishing / Revision / Import-Export | Stage 6, 11, 19 |
| 066 | Revision history UI | Publishing / Revision / Import-Export | Stage 6, 11, 19 |
| 067 | Rollback UI | Publishing / Revision / Import-Export | Stage 6, 11, 19 |
| 068 | Import / export | Publishing / Revision / Import-Export | Stage 6, 7, 11, 19 |
| 069 | Főoldal | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 070 | Twitch | Public Website / UX / SEO / Accessibility / Performance | Stage 8, 9 |
| 071 | YouTube | Public Website / social-link presentation | Stage 6, 8 |
| 072 | TikTok | Public Website / social-link presentation | Stage 6, 8 |
| 073 | Adásrend | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 074 | Következő adás / countdown | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 075 | Élő / offline állapot | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 076 | VOD / Shorts / Clips | Public link/embed baseline + Stream Media/Content domain | Stage 6, 9, 10 |
| 077 | Rólam | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 078 | Közösség / Discord | Public community links + Community domain | Stage 6, 12 |
| 079 | Kapcsolat | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 080 | Támogatás | Public support content/link + Support/Membership domain | Stage 6, 14 |
| 081 | Szponzor / üzleti / Press Kit | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 082 | 404 / loading / empty / error állapotok | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 20, 21 |
| 083 | Egységes mobil / tablet / desktop UX | Public Website / UX / SEO / Accessibility / Performance | Stage 20, 21, 22 |
| 084 | SEO / Open Graph / structured data | Public Website / UX / SEO / Accessibility / Performance | Stage 6 |
| 085 | Accessibility | Public Website / UX / SEO / Accessibility / Performance | Stage 20, 21, 22 |
| 086 | Performance / caching | Public Website / UX / SEO / Accessibility / Performance | Stage 6, 15 |
| 087 | Schedule D1 rendszer | Streamer Domain / Integrations / Analytics | Stage 8, 9 |
| 088 | Twitch API / live state | Streamer Domain / Integrations / Analytics | Stage 8, 9 |
| 089 | YouTube API | YouTube platform adapter under Integration/Platform contract | Stage 8, 11 |
| 090 | TikTok rendszer | TikTok platform adapter under Integration/Platform contract | Stage 8, 11 |
| 091 | VOD rendszer | Stream Media/Content domain + provider adapters | Stage 7, 10, 11 |
| 092 | Community / Discord | Community domain + Discord integration adapter | Stage 12 |
| 093 | Contact / collaboration | Public contact entry + later collaboration/CRM domains | Stage 6, 15 |
| 094 | Site settings | Streamer Domain / Integrations / Analytics | Stage 8, 13 |
| 095 | Analytics | Release/operational telemetry + Creator Analytics domain | Stage 13 |
| 096 | Unit tesztek | QA / Security / Production | Stage 0, 21, 22 |
| 097 | API / integration tesztek | QA / Security / Production | Stage 0, 21, 22 |
| 098 | D1 tesztek | QA / Security / Production | Stage 0, 21, 22 |
| 099 | E2E / browser tesztek | QA / Security / Production | Stage 0, 21, 22 |
| 100 | Regression tesztek | QA / Security / Production | Stage 20, 21, 22 |
| 101 | Security hardening | QA / Security / Production | Stage 20, 21, 22 |
| 102 | Observability / error reporting | QA / Security / Production | Stage 8, 9 |
| 103 | Production backup / recovery teszt | QA / Security / Production | Stage 14 |
| 104 | Production release checklist | QA / Security / Production | Stage 14 |
| 105 | Stabil page / node / component / action / revision / media / schedule ID-k | Platform contracts / Governance / AI-ready actions | Stage 6, 11, 19 |
| 106 | Strukturált page model teljes lezárása | Platform contracts / Governance / AI-ready actions | Stage 1, 3 |
| 107 | Közös Action API az Editor és későbbi AI számára | Platform contracts / Governance / AI-ready actions | Stage 1, 3 |
| 108 | Permission / approval / audit réteg | Platform contracts / Governance / AI-ready actions | Stage 0, 16, 24 |
| 109 | Preview-before-apply / rollback mechanizmus | Platform contracts / Governance / AI-ready actions | Stage 6, 11, 19 |
| 110 | AI Orchestrator | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 111 | Agent / Tool / Model Registry | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 112 | Task Planner / Context Selector | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 113 | Permission Checker / Approval Flow | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 114 | Execution / verification / recovery | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 115 | Multi-model routing | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 116 | Web Engineer Agent | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 117 | Visual Editor Agent | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 118 | QA Agent | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 119 | GitHub / Cloudflare Engineer Agent | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 120 | Browser QA AI | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 121 | Stream observation | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 122 | Silence / pacing detection | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 123 | Chat / context analysis | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 124 | Contextual live suggestions | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 125 | Streamer profile / long-term memory | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 126 | Experience learning / evaluation cycles | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 127 | One-click clip / Short creation | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 128 | Stream setup diagnostics assistant | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 129 | AI control center | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 130 | End-to-end AI platform test | SANCI AI / Creator Intelligence | Stage 24 (optional AI) |
| 131 | Teljes public website teszt | Final production QA / release gates | Stage 22 |
| 132 | Teljes admin / CMS teszt | Final production QA / release gates | Stage 22 |
| 133 | Teljes Visual Editor teszt | Final production QA / release gates | Stage 1, 3 |
| 134 | D1 / R2 / integrations teszt | Final production QA / release gates | Stage 22 |
| 135 | Mobile / tablet / desktop teszt | Final production QA / release gates | Stage 20, 21, 22 |
| 136 | Security / permissions teszt | Final production QA / release gates | Stage 20, 21, 22 |
| 137 | Performance / accessibility teszt | Final production QA / release gates | Stage 6, 15 |
| 138 | Backup / restore / disaster recovery teszt | Final production QA / release gates | Stage 19, 21 |
| 139 | Regression teszt | Final production QA / release gates | Stage 20, 21, 22 |
| 140 | Production release jóváhagyás | Final production QA / release gates | Stage 14 |

## 2.76.9 — Teljes, soronkénti visszakövethetőség: H19–H34

Az alábbi táblázat minden meglévő H19–H34 ledger-sort felsorol. Az eredeti ledger teljes szövege a fenti történeti fejezetben változatlanul megmarad; ez a táblázat csak a jelenlegi végrehajtási hozzárendelést adja hozzá. A H31 és a modellezett H32 intelligenciafunkciók az opcionális AI-fázisba kerülnek. A determinisztikus stream metrikák, integration health, kézi markerek és a szabályalapú H33 automatizálás AI nélkül is megvalósítandók.

| Historical ID | Megőrzött capability | Eredeti canonical owner | MASTER-2.76 cél |
|---|---|---|---|
| H19.01 | upload | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.02 | folders | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.03 | search | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.04 | filter | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.05 | preview | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.06 | metadata | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.07 | alt text | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.08 | crop | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.09 | resize | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.10 | replace | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.11 | archive/delete | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.12 | usage tracking | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.13 | unused media detection | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.14 | MIME validation | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.15 | file-size limits | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.16 | secure object keys | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.17 | image optimization | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.18 | video/audio | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.19 | clip/Short assets | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H19.20 | cache policy | Resource / Asset Library (C.4) | Stage 4; advanced editing/derivatives: Stage 10 |
| H20.01 | D1 binding | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.02 | site settings | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.03 | schedule | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.04 | Twitch | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.05 | YouTube | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.06 | TikTok | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.07 | Discord | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.08 | VOD | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.09 | collections | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.10 | API data source | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.11 | loading state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.12 | empty state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.13 | error state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.14 | conditional rendering | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.15 | data transforms | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.16 | caching | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.17 | stale-data handling | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H20.18 | binding validation | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Stage 3, 6, 8 |
| H21.01 | Twitch OAuth | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.02 | Twitch live/offline | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.03 | Twitch title | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.04 | Twitch game | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.05 | Twitch viewer statistics | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.06 | Twitch followers/subscribers where available | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.07 | Twitch VOD | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.08 | Twitch clips | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.09 | Twitch events/webhooks where applicable | Integration/Platform contract + Streamer domain (C.7) | Stage 8, with domain-specific downstream stage |
| H21.10 | YouTube channel | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.11 | YouTube videos | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.12 | YouTube Shorts | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.13 | YouTube statistics where available | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.14 | YouTube API quota/error handling | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.15 | TikTok profile | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.16 | TikTok supported content integration | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.17 | TikTok API capability review | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.18 | TikTok rate limits/fallback | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 11 |
| H21.19 | Discord community link | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 12 |
| H21.20 | Discord optional integration | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 12 |
| H21.21 | Discord status where justified | Integration/Platform contract + Streamer domain (C.7) | Stage 8, 12 |
| H21.22 | Architecture constraint: keep secrets in Cloudflare Secrets; normalize external APIs behind services | Integration/Platform contract + Streamer domain (C.7), aligned with Security/Auth (H28.10) | Stage 8, with domain-specific downstream stage |
| H22.01 | schedule CRUD | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.02 | recurring schedule | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.03 | timezone handling | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.04 | next-stream calculation | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.05 | countdown | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.06 | live state | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.07 | game/category | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.08 | stream type | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.09 | VOD ingestion | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.10 | VOD categorization | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.11 | VOD search/filter | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.12 | Shorts management | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.13 | clips management | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.14 | content calendar | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.15 | platform-specific variants | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.16 | title/description/hashtag suggestions | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.17 | thumbnail brief | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.18 | publishing workflow | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H22.19 | performance feedback loop | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Stage 7, 10, 11 |
| H23.01 | event model | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.02 | click | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.03 | hover | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.04 | focus | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.05 | active | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.06 | submit | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.07 | scroll | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.08 | load | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.09 | timer | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.10 | open/close | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.11 | navigation | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.12 | show/hide | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.13 | toggle | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.14 | state machine | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.15 | transition | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.16 | animation timeline | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.17 | keyframes | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.18 | reduced-motion | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.19 | interaction validation | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H23.20 | performance safeguards | Website Builder / Interaction & Animation (C.5) | Stage 3, 6 |
| H24.01 | semantic HTML | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.02 | heading hierarchy | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.03 | alt text | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.04 | labels | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.05 | ARIA | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.06 | keyboard navigation | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.07 | focus order | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.08 | focus visibility | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.09 | contrast warnings | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.10 | screen-reader metadata | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.11 | form validation accessibility | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.12 | editor accessibility checks | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H24.13 | public accessibility audit | Public Website / Accessibility (C.5 + C.13) | Stage 20 + the relevant component/public-renderer stage |
| H25.01 | title | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.02 | description | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.03 | canonical | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.04 | Open Graph | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.05 | X/Twitter card | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.06 | structured data | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.07 | sitemap | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.08 | robots | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.09 | per-page SEO | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.10 | SEO preview | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.11 | redirects | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H25.12 | broken-link detection | Public Website / SEO & Discoverability (C.13) | Stage 6 |
| H26.01 | page views | Analytics / Insights (C.16) | Stage 13 |
| H26.02 | button clicks | Analytics / Insights (C.16) | Stage 13 |
| H26.03 | social clicks | Analytics / Insights (C.16) | Stage 13 |
| H26.04 | stream events | Analytics / Insights (C.16) | Stage 13 |
| H26.05 | conversion events | Analytics / Insights (C.16) | Stage 13 |
| H26.06 | privacy-aware analytics | Analytics / Insights (C.16) | Stage 13 |
| H26.07 | retention policy | Analytics / Insights (C.16) | Stage 13 |
| H26.08 | admin dashboard | Analytics / Insights (C.16) | Stage 13 |
| H26.09 | editor/content performance | Analytics / Insights (C.16) | Stage 13 |
| H26.10 | content performance | Analytics / Insights (C.16) | Stage 13 |
| H26.11 | stream performance | Analytics / Insights (C.16) | Stage 13 |
| H26.12 | anomaly detection later | Analytics / Insights (C.16) | Stage 13 |
| H27.01 | dashboard | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.02 | navigation | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.03 | responsive admin | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.04 | diagnostics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.05 | page list | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.06 | content management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.07 | schedule | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.08 | socials | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.09 | VOD | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.10 | media | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.11 | settings | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.12 | SEO | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.13 | analytics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.14 | integrations | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.15 | editor management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.16 | preview | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.17 | recovery | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.18 | history | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H27.19 | permissions | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Stage 2 + the owning module stage |
| H28.01 | HttpOnly | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.02 | Secure cookie | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.03 | SameSite | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.04 | password hash | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.05 | CSRF | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.06 | rate limiting | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.07 | RBAC | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.08 | API authorization | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.09 | public/admin separation | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.10 | Cloudflare Secrets | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.11 | audit log | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.12 | input validation | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.13 | output validation | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.14 | file validation | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.15 | replay protection where applicable | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.16 | action permission `can()` checks | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H28.17 | AI permission boundary | Security / Auth / Audit (cross-cutting) | Stage 0, 21 |
| H29.01 | full backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.02 | page backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.03 | revision backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.04 | media references | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.05 | restore validation | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.06 | rollback | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.07 | import/export JSON | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.08 | migration compatibility | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.09 | backup integrity check | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H29.10 | recovery drill | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Stage 19, 21 |
| H30.01 | bundle review | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.02 | lazy loading | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.03 | image optimization | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.04 | caching | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.05 | cache invalidation | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.06 | Core Web Vitals | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.07 | rendering performance | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.08 | large-page performance | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.09 | large-tree editor performance | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.10 | history memory limits | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.11 | autosave efficiency | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.12 | API latency monitoring | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.13 | production smoke test | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H30.14 | visual regression baseline | Performance / Production QA (cross-cutting) | Stage 21, 22 |
| H31.00 | AI editor must use the same canonical action system as manual Editor; pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.01 | AI page operations | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.02 | AI element operations | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.03 | AI style/layout operations | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.04 | AI responsive operations | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.05 | AI content generation | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.06 | AI SEO assistance | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.07 | AI accessibility QA | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.08 | AI visual QA | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.09 | action permissions | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.10 | approval rules | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.11 | rollback | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.12 | audit | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H31.13 | rate/cost controls | AI Platform / AI Editor (C.14) | Stage 24 (optional AI; canonical action prerequisites in Stages 1 and 16) |
| H32.01 | live stream monitoring | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 9, 21 for measurable non-AI telemetry; model interpretation stays Stage 24 |
| H32.02 | silence/speech detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.03 | chat activity analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.04 | technical issue detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 9, 21 for measurable non-AI telemetry; model interpretation stays Stage 24 |
| H32.05 | audio problem detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 9, 21 for measurable non-AI telemetry; model interpretation stays Stage 24 |
| H32.06 | stream quality checks | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 9, 21 for measurable non-AI telemetry; model interpretation stays Stage 24 |
| H32.07 | scene suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.08 | context-aware ideas | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.09 | interesting moment detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.10 | post-stream summary | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.11 | VOD analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.12 | clip candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.13 | Short candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.14 | title/description suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.15 | platform variants | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.16 | thumbnail briefs | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.17 | publishing recommendations | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.18 | content performance analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.19 | streamer profile | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 8 |
| H32.20 | long-term memory | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.21 | preferences | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 8 |
| H32.22 | historical outcomes | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.23 | experiment tracking | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.24 | evaluation cycle | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H32.25 | feedback loop | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stage 24 (optional AI intelligence) |
| H33.00 | Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.01 | scheduled automations | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.02 | event automations | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.03 | content workflows | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.04 | media workflows | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.05 | stream workflows | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.06 | notification workflows | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.07 | retry policy | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.08 | idempotency | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.09 | failure handling | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.10 | permissions | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.11 | audit | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H33.12 | Queues/Durable Objects only when justified by a real background-task or realtime requirement | Automation / Event domain (C.16) | Stage 16 (deterministic, AI-free) |
| H34.00 | Continuous feature discovery is never permanently closed; repeat the review before every significant Editor/platform extension | Continuous product governance / benchmark process (C.18-C.20) | Continuous governance; stage assigned by canonical owner before implementation |
| H34.01 | modern visual builder minták; | Visual Editor / builder architecture (C.9; C.18-C.20) | Stage 3, 6, 20 |
| H34.02 | GrapesJS / Craft.js / Puck architekturális minták; | Visual Editor / architecture benchmark (C.9; C.18-C.20) | Continuous governance; stage assigned by canonical owner before implementation |
| H34.03 | új responsive/layout megoldások; | Theme/Presentation + Visual Editor + public renderer | Stage 3, 6, 20 |
| H34.04 | accessibility; | Accessibility domain (H24) + Editor + public renderer | Stage 20 |
| H34.05 | performance; | Performance/Production domain (H30) | Stage 21 |
| H34.06 | reusable components; | Component Registry / Symbols / Reusable Components | Stage 5, 18 |
| H34.07 | design systems; | Theme/Design System / Design Tokens | Continuous governance; stage assigned by canonical owner before implementation |
| H34.08 | collaboration/conflict; | Collaboration / concurrency / approvals / conflict handling | Continuous governance; stage assigned by canonical owner before implementation |
| H34.09 | backup/recovery; | Backup/Restore domain (H29) + relevant Admin recovery flows | Stage 19, 21 |
| H34.10 | AI action safety; | Security/permissions (H28) + AI Editor (H31) + Automation (H33) | Stage 24 |
| H34.11 | stream/content intelligence. | Streamer Intelligence / Content Factory (H32; C.6/C.7/C.16) | Stage 24 |
| H34.12 | azonosítás; | Continuous product governance / benchmark process (C.18-C.20) | Continuous governance; stage assigned by canonical owner before implementation |
| H34.13 | cél és felhasználási eset; | Continuous product governance / benchmark process (C.18-C.20) | Continuous governance; stage assigned by canonical owner before implementation |
| H34.14 | függőségek; | Continuous product governance / benchmark process (C.18-C.20) | Continuous governance; stage assigned by canonical owner before implementation |
| H34.15 | Page Model/adatmodell; | Canonical Page Model/data-model owner for the proposed extension | Continuous governance; stage assigned by canonical owner before implementation |
| H34.16 | Command/Action; | Canonical Command/Action owner for the proposed extension | Continuous governance; stage assigned by canonical owner before implementation |
| H34.17 | Inspector/Canvas/UI; | Canonical Editor/UI owner for the proposed extension | Continuous governance; stage assigned by canonical owner before implementation |
| H34.18 | persistence; | Canonical persistence/data owner for the proposed extension | Continuous governance; stage assigned by canonical owner before implementation |
| H34.19 | teszt; | Canonical test/QA owner for the proposed extension | Continuous governance; stage assigned by canonical owner before implementation |
| H34.20 | MASTER-be felvétel; | MASTER roadmap governance (C.18-C.20) | Continuous governance; stage assigned by canonical owner before implementation |
| H34.21 | implementáció; | Canonical implementation owner approved by the D roadmap | Continuous governance; stage assigned by canonical owner before implementation |
| H34.22 | felhasználói validáció. | User acceptance / product validation for the proposed extension | Continuous governance; stage assigned by canonical owner before implementation |

**Soronkénti leképezési szabály:** a táblázat egy követelmény sem töröl. A több domaint érintő vagy bizonytalan besorolásnál a célfázis előtt a munkapont acceptance-e rögzíti a pontos owner-t, adatkontraktust és tesztet. A történeti sor csak akkor tekinthető lezártnak, ha a hozzárendelt fázisban a funkció runtime-bizonyítéka megvan; a leképezés önmagában nem készültségi állapot.


# MASTER-2.77 — VÉGLEGES TERMÉKLEÍRÁS, ADMIN UI-SPECIFIKÁCIÓ ÉS FEJLESZTÉSI SORREND

**Státusz:** CANONICAL PRODUCT SPECIFICATION / IMPLEMENTATION ORDER  
**Döntés:** a teljes termék AI nélkül is teljes értékű legyen; az AI a legutolsó, opcionális fő fázis.  
**Egyetlen aktív pont:** F0.1-ADMIN-HOME-VISUAL-DESIGN-AND-SHELL.  
**Ez a fejezet írja felül a 2.75/2.76 végrehajtási sorrendjét és a régi Editor-első F0 sorrendet.** A régi tartalom, az E/F közvetlen követelménykatalógus, a 01–140 funkciólista és a H19–H34 ledger nem törölhető, és továbbra is követelményforrás. Ha egy korábbi részlet és ez a sorrend ütközik, a 2.77 sorrendje irányadó, a korábbi funkciókövetelmény viszont megmarad.

## 2.77.1 — A termék végleges meghatározása

A Sanci9517 egy egységes, magyarul induló, globálisan bővíthető Creator Platform. Nem csak streamer portfólióoldal, nem csak website builder, nem csak OBS eszköz és nem AI-chatfelület. Egyetlen összefüggő rendszerben nyújtja a creator weboldalát, tartalomkezelését, médiaeszközeit, stream-infrastruktúráját, platformintegrációit, publikálását, közösségét, közönségkapcsolatát, analitikáját, üzleti funkcióit, szabályalapú automatizálását és később opcionális AI-asszisztenciáját.

**Nem szűkítjük a terméket az aktuálisan használt funkciókra.** A funkció akkor is a teljes terv része marad, ha későbbi fázisban épül, API-függő, vagy az első használó számára nem azonnal szükséges. A megvalósítás viszont függőségi sorrendben, egy aktív ponttal halad.

## 2.77.2 — A weboldal és az Admin vizuális iránya

### Nyilvános oldal: cél és minőségi elvárás
- Egyedi, professzionális creator márka; streamer/creator bemutatkozás, csatornák, tartalmak, schedule/live státusz, VOD/clips/Shorts, játékok/kategóriák, közösségi linkek, support/membership, később shop és kampányok.
- Mobilról is első osztályú, gyors, hozzáférhető, keresőbarát, megosztásra optimalizált, többnyelvűvé bővíthető.
- Az oldal vizuális elemei, szekciói, navigációja, tipográfiája, színei, responsive viselkedése és tartalmai a canonical Visual Editorral legyenek szerkeszthetők.
- A publikus render kizárólag publikált snapshotot szolgálhat ki; draft vagy jogosulatlan adat nem szivároghat ki.
- A site template kiindulópont, nem lezárt, nem szerkeszthető késztermék.

### Admin főoldal: alapértelmezett képernyő-elrendezés
A kezdőoldal egy valódi munkaközpont legyen, ne üres landing page és ne statikus statisztikakártya-demó.

**Desktop szerkezet**
1. **Bal oldali állandó navigációs sáv:** márka/site-váltó, keresés, modulcsoportok, aktív modul állapota, összecsukás, alsó beállítás/profil terület.
2. **Felső fejléc:** aktuális site/workspace, breadcrumb vagy oldalcím, globális keresés, értesítések, segítség/dokumentáció, profil és kijelentkezés; csak a ténylegesen létező funkció jelenhet meg aktívként.
3. **Fő tartalom:** üdvözlés és aktuális site állapot; elsődleges gyorsműveletek; valós státuszkártyák; következő stream/esemény; legutóbbi tartalom/módosítások; integrációs egészség; publikálási feladatok/figyelmeztetések.
4. **Másodlagos panelek:** teendők, legutóbbi aktivitás és diagnosztika. Csak valós, lekérdezett adatokból számolhatók.
5. **Üres állapotok:** első használatkor érthető útmutatás és következő lépés; nulla adat nem lehet kitalált metrika.

**Mobil/tablet**
- Oldalsáv drawer/bottom navigation vagy más, tesztelt kis-képernyős minta; nem egyszerűen összenyomott desktop.
- Kártyák egy oszlopba rendeződnek; a fő műveletek elérhetők; táblázatok alternatív nézetet vagy kontrollált vízszintes görgetést kapnak.
- Billentyűzet, fókusz, screen reader, kontraszt, zoom és reduced-motion támogatás.
- Nincs takarás, vízszintes overflow vagy csak hoverrel elérhető lényeges művelet.

**Vizuális nyelv**
- Egységes design tokenek: szín, háttérfelületek, tipográfia, spacing, radius, border, elevation, focus, státuszok és motion.
- Letisztult, professzionális creator/SaaS felület; jól elkülönülő hierarchia, levegős elrendezés, következetes ikonok, olvasható kontraszt.
- A sötét/világos megjelenés csak akkor kerül aktív kapcsolóként a felületre, ha mindkettő konzisztensen implementált; különben a választott alap téma következetes.
- Nincs pusztán dekoratív control, hamis számláló, fake online státusz, hamis „connected” badge vagy működőnek látszó disabled link.
- A konkrét vizuális irányt az F0.1-ben képernyőterv/prototípus, tokenek és jóváhagyott shell formájában rögzítjük, mielőtt további modulok felületét építjük.

### Admin főoldal — kártyák és tartalom
- **Site állapot:** draft/published, aktuális publikus URL és utolsó publikálás időpontja, csak valós állapotból.
- **Gyorsműveletek:** oldal szerkesztése, új oldal, média feltöltése, tartalom létrehozása, schedule esemény, preview/publish; jogosultság szerint.
- **Stream és schedule:** live/offline/unknown elkülönítve; következő esemény, időzóna és sync frissesség.
- **Tartalom:** legutóbbi módosítások, draft/review/scheduled/failed állapotok, folytatás linkje.
- **Integrációk:** Twitch/YouTube/TikTok/Discord és későbbi adapterek kapcsolati állapota, token/sync hiba és újracsatlakoztatás.
- **Media:** resource tárhely/feldolgozás állapota, sikertelen upload/job és teendő; költség csak akkor, ha mérhető.
- **Analytics:** valós provider adatok, forrás és frissesség feltüntetésével; ismeretlen adat „nincs adat”, nem 0-nak álcázott eredmény.
- **Rendszer/teendők:** mentési/publikálási hiba, hiányzó metaadat, jogosultság, domain/SSL ellenőrzés, sikertelen sync; csak ténylegesen detektált esemény.
- A kezdőoldal testreszabhatósága későbbi képesség: kártyák átrendezése, elrejtése és saját gyorsművelet csak a dashboard layout persistence-szel együtt kerülhet be.

## 2.77.3 — Teljes Admin navigáció és képernyőleltár

Az alábbi menü a teljes termék navigációs célképe, nem azt jelenti, hogy minden modul az első buildben aktív. A navigáció modulonként fokozatosan kapcsolható be; a nem implementált modul nem mutathat hamis működő oldalt.

1. **Kezdőlap:** áttekintés, gyorsműveletek, teendők, aktivitás és rendszerállapot.
2. **Weboldal**
   - Oldalak és oldalhierarchia
   - Navigáció, header, footer, menük, breadcrumb
   - Visual Editor / canvas
   - Layers / struktúra
   - Inspector / property-k
   - Responsive preview
   - Site settings, domain, publish/preview, revision/rollback
   - SEO és megosztási metaadatok
3. **Tartalom / CMS**
   - Bejegyzések, hírek, cikkek, statikus oldalak
   - VOD, videók, clips, Shorts, playlist és sorozatok
   - Tartalomtípusok, kategóriák, tagek, collectionök
   - Draft/review/approved/scheduled/published/failed/archived státuszok
   - Tartalomnaptár, kampány, editorial checklist és jóváhagyás
4. **Média és erőforrások**
   - Képek, videók, audio, dokumentumok, fájlok
   - Ikonok, fontok, brand assetek
   - Search/filter/tag/collection, preview, metadata, alt/caption/license
   - Variánsok, thumbnails, usage graph, replace, archive, restore
   - Feltöltési/feldolgozási állapotok és hibaelhárítás
5. **Design Studio**
   - Theme, design tokenek, brand kit
   - Site/page/section/component template-ek
   - Komponensek, slots, variants, linked symbols/reusable instances
   - Saját template-könyvtár, import/export, kompatibilitás
6. **Schedule és streamer profil**
   - Események, ismétlődés, időzóna, kivételek, emlékeztetők
   - Streamer profil, játékok/kategóriák, platform linkek
   - Live/offline állapot és szinkronállapot
7. **Stream Studio**
   - OBS csatlakozás és engedélyezés
   - Overlayek, browser source, alerts, widgets
   - Scene/source állapot, stream/recording kontroll csak explicit engedéllyel
   - Stream markerek, kézi highlight-jelölés, tesztesemény
8. **Media Studio**
   - Projektek, timeline, trim/split/join/crop/resize/rotate
   - Aspect ratio/safe zone, audio level/fade, export presets
   - Felirat és transcript import/szerkesztés/export
   - Forrás és származtatott fájlok kapcsolata
9. **Publikálás**
   - Platformonkénti composer, preview és validáció
   - Variánsok, caption, cím/leírás, tagek, cover, CTA
   - Queue, schedule, approval, publish result, retry és külső ID
   - API-korlát esetén kézi publikálási checklist
10. **Közösség**
    - Unified inbox, comments/mentions ahol hivatalos API engedi
    - Moderáció, saved replies, escalation és audit
    - Discord bot, szerepkörök, csatornák és bejelentések
11. **Analitika**
    - Stream/video/social/site/store/email metrikák a ténylegesen elérhető forrásokból
    - Idősávok, összehasonlítás, export, riport, célok és kísérletnapló
    - Forrás/frissesség/mérési definíció és hiányzó adatok
12. **Közönség és CRM**
    - Kontaktok, consent, preference, tagek, szegmensek
    - Formok, newsletter, kampányok, automatizált levelezési sorozatok
    - Unsubscribe/suppression/bounce/deliverability
13. **Üzlet**
    - Termékek, variánsok, készlet, kollekciók, ár, kedvezmény, drop
    - Checkout/payment adapter, rendelések, fulfillment, refunds
    - Digitális termékek, entitlement, tagság, support/donation provider
    - Sponsor CRM, media kit, deliverable és riport
14. **Automatizálás**
    - Trigger, condition, action, schedule, branch, delay
    - Dry-run, jogosultság, végrehajtási napló, retry/replay/cancel
    - Idempotency, loop protection, failure queue és audit
15. **Integrációk**
    - Twitch, YouTube, TikTok, Discord, OBS connector és későbbi providerek
    - OAuth/scope/token expiry/quota/last sync/freshness
    - Reconnect, disconnect/revoke, provider health és hibák
16. **Csapat és workspace**
    - Felhasználók, meghívók, szerepkörök, site transfer, offboarding
    - Review/approval, kommentek, change history és konfliktuskezelés
17. **Sablon- és bővítménytár**
    - Saját/külső template, component, theme, overlay és workflow csomagok
    - License, permission manifest, preview, install/update/rollback
18. **Beállítások**
    - Fiók, site, domain/DNS/SSL, locale, SEO defaults
    - Jogosultságok, session, integrációs titkok, notification preference
    - Data export/delete, retention, backup/recovery
19. **Diagnosztika és súgó**
    - Rendszerállapot, sync/job hibák, audit, dokumentáció
    - Reprodukálható hibaadat, redacted logs, user-support context
20. **Opcionális AI Center — kizárólag a végső fázis után**
    - AI provider/model, usage/cost, privacy, context, permission, approvals
    - AI-funkciók ki/be kapcsolása; a core platform AI nélkül működik.

## 2.77.4 — Admin globális viselkedés és UX-szabályok

- A site/workspace kontextus látható, és minden művelet ellenőrzi a szerveroldali ownershipet.
- A globális keresés csak valóban indexelt, a felhasználó számára engedélyezett erőforrásokat mutatja; a találatok típussal, helyzettel és gyorsművelettel rendelkezhetnek.
- A közös állapotok egységesek: loading, empty, success, validation error, permission denied, offline, stale data, quota/rate limit, partial success, retrying és failed.
- Mentés/publikálás állapota mindig valós; unsaved changes figyelmeztetés és visszaállítás támogatott.
- Destructive action megerősítést, megfelelő jogosultságot és szükség szerint undo/recovery útvonalat igényel.
- Minden képernyőn működik a billentyűzetes navigáció, a fókusz látható, a formoknak címkéjük és hibaüzenetük van.
- A dashboard és a modulok ugyanazt a canonical API/domain réteget használják; UI-nként nem keletkezik párhuzamos adatmodell.
- A navigációból eltávolított vagy elrejtett funkció mögötti adat/domain nem törölhető automatikusan. Legacy surface esetén külön KEEP/FIX/MIGRATE/REMOVE/DISABLE/ARCHIVE döntés és bizonyíték szükséges.

## 2.77.5 — Egyetlen végrehajtási sorrend

| Sorrend | Aktív munkapont / fázis | Mi készül el | Kilépési bizonyíték |
|---:|---|---|---|
| 0 | Foundation invariants | E4/E5/E6 bizonyítékok, auth/ownership, migration safety, branch/deploy/test baseline | baseline reprodukálható; nincs új regresszió |
| 1 | **F0.1 Admin home visual design + shell** | dashboard layout, design token alap, navigation shell, desktop/tablet/mobile wireframe és valódi shell | jóváhagyott képernyő, browser screenshot/smoke, accessibility/responsive acceptance; nincs fake data |
| 2 | **F0.2 Admin navigation + global shell acceptance** | site context, menu/routes, active/disabled states, auth/role gating, global search placeholder csak ha valós, notifications/tasks contract | minden aktív link működik, disabled/queued egyértelmű, route/permission/browser teszt PASS |
| 3 | **F0.3 Editor foundation + first vertical slice** | canonical Page Model, command/state/validation/history/persistence, első elem add/select/edit/delete/undo/redo/save/reload | end-to-end acceptance és runtime evidence PASS |
| 4 | **F0.4 Visual Builder, Layers, Inspector, responsive** | hierarchy, canvas manipulation, property registry, layout primitives, responsive overrides | canvas/layers/Inspector ugyanazt a modellt mutatja; round-trip/regression PASS |
| 5 | **F0.5 Resource/Asset/Media Library** | D1 metadata + R2 binary, upload/preview/search/usage/variants/delete/restore | ownership, upload validation, resource round-trip PASS |
| 6 | **F0.6 Design System / templates / components / symbols** | tokenek, themes, template-ök, variants, shared instance, impact preview | compatibility/rollback and rendering tests PASS |
| 7 | **F0.7 Website Builder + public renderer** | pages/nav/header/footer/forms, preview/publish/revisions, domain, SEO/AEO, public cache | draft leak nincs; publish/rollback/browser/SEO/a11y PASS |
| 8 | **F0.8 CMS + content lifecycle** | content types, taxonomy, collections, editorial workflow, calendar, import/export | lifecycle/permissions/recovery tests PASS |
| 9 | **F0.9 Schedule + streamer profile + integrations** | recurring schedule/timezones, Twitch, provider adapters, sync health, profile | token/site ownership, provider error and fallback tests PASS |
| 10 | **F0.10 Stream Studio / Overlay / OBS** | secure local connector, overlay/widgets/alerts, explicit control permissions, manual markers | unauthorized local control impossible; pairing/revoke tests PASS |
| 11 | **F0.11 Manual Media Studio** | timeline, editing, aspect ratios, audio, captions, export, derivative lineage | AI nélküli clip/edit/export journey PASS |
| 12 | **F0.12 Cross-platform Publishing Center** | composer, variants, approvals, queue, scheduled publish, retry, partial success | idempotency, no duplicate/lost publish, real API capability tests PASS |
| 13 | **F0.13 Community / moderation / notifications** | inbox where supported, Discord, moderation, notification preferences | scope/permission/retention tests PASS |
| 14 | **F0.14 Analytics / reports** | provider metrics, definitions, freshness, comparisons, exports, manual goals | source/freshness/metric accuracy tests PASS |
| 15 | **F0.15 Commerce / shop / merch / membership / sponsorship** | product, checkout adapter, orders, refunds, fulfillment, entitlements, sponsor workflows | verified webhooks, replay safety, refund/revoke tests PASS |
| 16 | **F0.16 Audience / CRM / email** | consent, segments, newsletter, campaigns, unsubscribe/suppression | consent and suppression tests PASS |
| 17 | **F0.17 Deterministic automation** | event registry, triggers, conditions, actions, schedule, retry, audit | dry-run, permission, idempotency, loop and replay tests PASS |
| 18 | **F0.18 Teams / workspace / collaboration** | invites, roles, reviews, history, conflict handling, offboarding | cross-tenant negative tests PASS |
| 19 | **F0.19 Extension ecosystem / marketplace** | SDK/API, package manifests, permissions, sandbox, review and rollback | untrusted package cannot escape permissions |
| 20 | **F0.20 Portability / backup / restore** | export/import, asset manifest, integrity, restore drills, recovery | real restore rehearsal PASS |
| 21 | **F0.21 Localization / accessibility / mobile / creator types** | locales, translations, accessible flows, mobile/tablet/desktop, broader creator use cases | representative persona/device acceptance PASS |
| 22 | **F0.22 Production hardening / security / performance / cost** | threat model, rate limits, observability, SLOs, load, degraded modes, cost visibility | security/load/recovery/incident tests PASS |
| 23 | **F0.23 Full AI-free end-to-end acceptance + non-AI gaps** | website, stream, manual editing, publishing, community, commerce, CRM, automation, export/recovery journeys | AI disabled; all required core journeys usable; no unresolved critical/high blocker |
| 24 | **F0.24 Optional AI platform — last** | unified Tool Registry, scoped context, drafting, analysis, highlight candidates, assistive agents, approvals, evaluations and cost controls | disabling AI leaves all F0.23 journeys operational; no permission bypass |

**Sorrendi szabály:** egy időben egyetlen aktív munkapont van. A fenti későbbi pontok nem engedélyeznek párhuzamos fejlesztést. Egy pont lezárása előtt a következő nem válhat aktívvá.

## 2.77.6 — F0.1 Admin főoldal DoD: mit kell ténylegesen átadni

1. Képernyőspecifikáció: desktop 1440 px, tablet és mobile layouts, nav expanded/collapsed, first-use/empty/error states.
2. Design tokens és komponenskönyvtár alap: typography, spacing, surfaces, borders, status, buttons, cards, fields, menus, focus.
3. Oldalsáv és topbar működő shell, active route, site/workspace context, permission-aware navigation.
4. Dashboard widget-contract: minden kártyához canonical data source, loading/empty/stale/error állapot és refresh/freshness policy.
5. A még nem implementált modulok nem jelenhetnek meg aktívnak. A későbbi menüpont lehet queued/disabled és egyértelműen jelzett, vagy fokozatosan kapcsolható be.
6. A kezdeti dashboard kártyák csak az aktuálisan elérhető, bizonyított adatokat mutatják; nincs hardcoded fake stream, follower count, revenue, schedule vagy integration state.
7. Keyboard-only, focus order, contrast, reduced motion, accessible labels és browser viewport regresszió.
8. /admin routing döntés: a valódi dashboard belépési pontot a route-audit alapján kell kialakítani. A korábbi /admin → /admin/editor redirectet csak a szükséges route/auth tesztek és canonical Editor deep-link megőrzése után szabad megváltoztatni. /admin/editor marad a canonical Editor belépési pont.
9. Screenshot/recorded evidence, teszteredmény, known limitations, commit és MASTER checkpoint.
10. User acceptance: a felhasználó látja, hol találja a weboldalt, tartalmat, médiát, streamet, schedule-t, publikálást és beállításokat; a következő lépés egyértelmű.

## 2.77.7 — Teljes funkcióleltár teljességi kapu

A végleges funkciókatalógus több, egymást kiegészítő rétegből áll:
- 27 eredeti product domain a 00.9.6.C.1-ben;
- a 00.9.6.C.2–C.22 közvetlen termék-specifikációi;
- a 00.9.6.E teljes közvetlen capability-katalógusa;
- a 00.9.6.F működési részletei és coverage szabályai;
- a történeti 01–140 funkciómátrix;
- a H19–H34 teljes történeti ledger;
- a MASTER-2.76 40 canonical domainje, benchmarkjai és 411 soros hozzárendelése;
- a jelen 2.77 Admin képernyő- és végrehajtási szerződése.

**Sem a 40 domain összefoglalója, sem a 411 soros mapping nem helyettesíti az E/F konkrét követelményeit.** Ha egy követelmény az E/F fejezetben szerepel, de nem jelenik meg az Admin menüben, attól még kötelező a megfelelő domainben. A menü IA, nem az adatmodell vagy a teljes scope határa.

Funkciók csak az alábbi állapotok egyikével tarthatók nyilván: REQUIRED / QUEUED / IMPLEMENTING / PASS / BLOCKED / DEFERRED-BY-EXPLICIT-DECISION / SUPERSEDED-WITH-TRACEABILITY. Egyetlen képesség sem hagyható el csak azért, mert nincs most használatban. A DEFERRED döntéshez ok, owner, újranyitási feltétel és hivatkozás kell.

## 2.77.8.A — Kiegészítő hivatalos benchmark és mit veszünk át

A terméket nem egyetlen versenytárshoz igazítjuk. A következő hivatalos források a képesség- és UX-audit referenciái; a felsorolt funkciókat a megfelelő Sanci domainben kell megvalósítani, nem külön másolatként.

| Referencia | Mit vizsgálunk | Mit építünk be a Sanci tervbe | Korlát / döntés |
|---|---|---|---|
| WordPress | page/content publishing, extensibility, themes/plugins, roles | tartalommodell, exportálhatóság, extension permission boundary | a bővítmények nem kaphatnak korlátlan runtime-hozzáférést |
| Shopify | product, inventory, checkout, orders, fulfillment, analytics, automation | canonical Commerce domain és provider adapter | payment/checkout felelősség és compliance a provider szerződéséhez igazodik |
| Squarespace | website, commerce, scheduling, email campaigns, memberships | integrált website+creator business flow, konzisztens márkázás | terv- és régiófüggő funkciót nem feltételezünk univerzálisnak |
| StreamElements | overlays, alerts, widgets, browser source, chatbot, loyalty, sponsorship | Overlay/Stream Studio, widget event contract, moderation/loyalty extension points | csak engedélyezett platformesemény és hivatalos integráció |
| YouTube Studio | video/Shorts management and performance analytics | content lifecycle, provider-metric dictionary, per-platform publishing/analytics | csak API/scope által engedett mező és művelet |
| TikTok Studio | creator content workflow and analytics | platform-specific composer, status, metrics, manual fallback | nem ígérünk olyan automatikus publikálást, amit az adott API/account nem támogat |
| Discord | roles, permissions, bot/integration and moderation model | least-privilege bot, scoped roles, community workflows | Discord role/permission és guild scope szerveroldalon ellenőrzendő |
| Ghost | publishing, newsletters, memberships, custom domains | CMS + first-party audience/consent + membership boundaries | email deliverability, opt-in és unsubscribes kötelező |
| Canva | brand kit, reusable design, video/content creation workflows | shared design tokens, reusable templates, manual media studio | nem keverjük a web Page Modelt a videós projektek adatmodelljével |
| Webflow | visual CMS, responsive layout, localization and publish workflow | visual builder, content binding, responsive preview, staged publishing | canonical Page Model marad az egyetlen weboldal-állapot |
| Wix | guided website creation and beginner-friendly setup | onboarding, empty states, sensible defaults, guided first site | a felhasználó minden automatikus defaultot kézzel módosíthasson |
| OBS Studio | authenticated local remote control and developer integration | secure local connector, explicit pairing, revoke, audit and safe actions | a böngésző nem kap korlátlan hozzáférést a felhasználó gépéhez |
| Restream | multi-platform live workflow, chat and analytics | integration center, cross-platform status, provider freshness | minden platform capability-jét külön szerződés írja le |
| OpusClip / Descript | clip workflow, timeline, transcript, captions, repurposing | AI nélküli kézi Media Studio előbb; AI javaslatok csak F0.24-ben | AI nem lehet az alapvágás vagy export előfeltétele |
| Metricool / Buffer | calendar, cross-platform scheduling, reporting and performance review | publishing queue, editorial calendar, source-aware analytics | nem szabad sikert állítani, amíg a provider nem igazolta |
| Beacons / Fourthwall / Patreon | link hub, creator commerce, membership and digital products | Link Hub, Commerce, membership/entitlement provider adapters | provider terms, fees, availability, tax and region must be checked |

### Hivatalos kiinduló források

- WordPress: https://wordpress.org/documentation/
- Shopify product/commerce capabilities: https://www.shopify.com/products
- Squarespace feature index: https://www.squarespace.com/feature-index
- StreamElements overlays and custom widgets: https://docs.streamelements.com/overlays
- StreamElements creator tools: https://support.streamelements.com/hc/en-us/categories/10474377631762-Creator-Tools
- YouTube Shorts analytics: https://support.google.com/youtube/answer/12942217
- Discord developer/community permissions: https://github.com/discord/discord-api-docs
- Ghost publishing and memberships: https://ghost.org/help/manual/
- Ghost newsletters: https://ghost.org/help/delivering-emails/
- Canva: https://www.canva.com/
- Webflow CMS: https://webflow.com/feature/cms
- Wix AI Website Builder: https://www.wix.com/ai-website-builder
- OBS remote control: https://obsproject.com/kb/remote-control-guide
- Restream Chat: https://restream.io/chat
- OpusClip: https://www.opus.pro/
- Descript: https://www.descript.com/features
- Metricool Planner: https://metricool.com/planner/
- Buffer Insights: https://support.buffer.com/en-us/articles/using-insights-in-buffer-x4gLauQU5a
- Beacons creator tools: https://help.beacons.ai/en/articles/4695105
- Fourthwall memberships: https://fourthwall.com/memberships
- Patreon digital products: https://www.patreon.com/product/digital-products

Minden nagyobb domain fejlesztése előtt a benchmarkot újra kell ellenőrizni, mert a termékek, díjcsomagok és API-képességek változhatnak. A benchmarkból átvett ötlethez rögzíteni kell a user problem-et, canonical owner-t, függőséget, API/license korlátot, acceptance-tesztet és a döntést (adopt/adapt/reject). A benchmarkban látott funkció nem bizonyíték arra, hogy a Sanci platformon már létezik.

## 2.77.8 — PR #6 lezárási bizonyíték

**Állapot:** CLOSED / MERGED 2026-10-13.  
**PR:** https://github.com/sanci9517/sanci9517/pull/6  
**Merge commit:** 147eabfe417b1e57d40ae3783b207ff70f6b1713  
**Scope:** kizárólag docs/MASTER-DEVELOPMENT-PLAN.md; production kód és migration nem változott.

- [x] MASTER tetején MASTER-2.77, egyetlen aktív pont és Admin-first sorrend szerepel.
- [x] A korábbi E/F specifikációk, a 01–140 mátrix, a H19–H34 ledger és a 2.75/2.76 tartalom megmaradt; a régi roadmapek történetiként jelöltek.
- [x] A régi Editor-first F0 sorrend nem írhatja felül a MASTER-2.77-et.
- [x] Az Admin kezdőoldal layoutja, navigációja, adatforrásai, responsive/accessibility és route acceptance le van írva.
- [x] Mind a 140 történeti funkciósor és a 271 H19–H34 ledger sor célfázishoz van rendelve; a mapping nem runtime PASS.
- [x] A teljes core AI nélkül működőként van specifikálva; az opcionális AI az F0.24 utolsó fő fázis.
- [x] A PR egyetlen dokumentumot módosított, a base branch a v2/foundation volt, a GitHub a merge előtt mergeable állapotot jelzett.
- [x] Az Admin UI F0.1 lett a következő aktív munkapont; a terv merge-je nem jelenti az Admin UI implementáltságát.

## 2.77.9 — F0.1 Admin home shell: lezárt implementációs checkpoint

**Állapot:** CLOSED / PASS — 2026-10-13; a részletes végleges closure record a 2.77.9.D szakaszban található.  
**Kód PR:** https://github.com/sanci9517/sanci9517/pull/7  
**Branch:** feature/admin-home-shell  
**Aktív scope:** a dashboard vizuális shell, az authenticated /admin belépési út, a valódi read-only dashboard adatforrások és a contract tesztek.

Elkészült a munkapont első implementációs szelete:
- [x] Új public/admin-home.html dashboard: bal navigációs sáv, felső sáv, overview kártyák, webhely/adasrend nézet, integrációs státusz és gyorsutak.
- [x] /admin és /admin.html hitelesített esetben /admin/home felé irányít; hitelesítés nélkül /admin/login a cél.
- [x] /admin/home és a közvetlen /admin-home.html asset kérés is auth guard mögött van.
- [x] A canonical /admin/editor → public/editor-v2/index.html út külön megmaradt.
- [x] A dashboard a meglévő session, site settings, page metadata, schedule és Twitch connection API-kból olvas; nincs kitalált follower/revenue/stream metrika.
- [x] A még nem implementált modulok disabled / Tervezett jelzést kapnak.
- [x] Hozzáadva a tests/admin-home-contract.test.js és az npm run test:admin-home script.
- [x] Statikus ellenőrzés: route guard minták, API-források, egyedi HTML ID-k, beágyazott JavaScript syntax, responsive breakpoints, keyboard focus és reduced-motion ellenőrizve.
- [ ] A helyi npm run test:admin-home, npm run typecheck és teljes releváns regression suite futtatása.
- [ ] Hitelesített browser acceptance desktop/tablet/mobile nézetben.
- [ ] Ellenőrizni kell a tényleges API-válaszokat és a Cloudflare branch preview viselkedését.
- [ ] Felhasználói vizuális acceptance után lehet F0.1 PASS; addig a következő munkapont nem aktiválható.

**Vizuális irány — 2026-10-13, felhasználói döntés:** sötét és világos téma közötti váltás; lila kiemelőszín; kiegyensúlyozott, nem túlzsúfolt dashboard; a teljes későbbi Creator OS modulrendszer maradjon felfedezhető, a még nem kész modulok jól látható „Tervezett” / AI esetén „Későbbi” státusszal. A téma választása helyi beállításként megmarad. A főoldal vizuális acceptance továbbra is nyitott; PR #7 nem merge-elhető és F0.1 nem jelölhető PASS-nak a felhasználó kifejezett vizuális elfogadása előtt.

**2026-10-13 vizuális iteráció:** PR #7 dashboard színrendszere lila hangsúlyú lett, bekerült a világos/sötét téma kapcsoló és a navigációba a VOD/rövid videók, AI-asszisztens, lokalizáció és fejlesztői eszközök tervezett bejegyzése. A tesztkontraktus külön ellenőrzi a téma kapcsolót és a tervezett modulok láthatóságát. Ez kódmódosítás, nem browser acceptance; a Cloudflare preview új commitjának tényleges megjelenését és a mobil/tablet nézetet még ellenőrizni kell.

**Megőrzési szabály:** a korábbi public/admin.html és a régi Admin panel nem törölhető ezen munkapontban. Csak a tényleges használati útvonal és a canonical dashboard shell változik; a legacy kód későbbi migrációs/archiválási döntésig megmarad.

**A jelen fejezet a termékirány és a fejlesztési sorrend végleges specifikációja.** A terv a jövőbeli capability-k teljes katalógusa; a runtime készültség kizárólag az egyes aktív munkapontok tesztjeiből és elfogadásából következhet.

**2026-10-13 felhasználói visszajelzés és második UI-iteráció — acceptance továbbra is NYITOTT:** a felhasználó jelezte, hogy a felületek túlzottan egybeolvadnak, és a modulok/funkciók felsorolása nem elég részletes. Ennek alapján a PR #7 dashboard újabb módosítást kapott; ez nem F0.1 PASS és nem merge-jóváhagyás.

- [x] Erősebb felületi hierarchia: kontrasztosabb felületi határok, különálló panel- és kártyafelületek, lila szekciójelölők, kiemelt kártyatetők, elkülönülő navigációs csoportok.
- [x] A „Teljes Creator OS modulrendszere” részletes, reszponzív katalógust kapott 17 külön kártyával: webhely/CMS; média; adásrend/streamerprofil; Stream Studio/OBS; cross-platform publikálás; integrációk; közösség/moderáció; analitika; commerce/tagság/szponzoráció; audience/CRM; automatizálás; fiók/biztonság/mentés; lokalizáció/hozzáférhetőség; fejlesztői eszközök/bővítmények; kézi Media Studio; csapatmunka; későbbi AI-asszisztens.
- [x] A képességek konkrét alfunkciókra vannak bontva; a katalógus a MASTER funkcióleltárának felfedezhető navigációs nézete, nem a MASTER helyettesítője és nem a teljes scope új forrása.
- [x] A készültségi címkék különválasztják a meglévő/ részben elérhető alapokat, a tervezett modulokat és a későbbi AI-fázist. A tervezett elemek nem működő funkciók, nem ígérnek nem létező API-képességet.
- [x] Az Admin contract tesztek bővültek a vizuális elkülönítés, a 17 kategóriás katalógus és a státuszcímkék ellenőrzésével.
- [ ] A helyi tesztek és typecheck újrafuttatása a friss PR-HEAD-en.
- [ ] Böngészős vizuális ellenőrzés 1440 px desktop, tablet és mobil szélességen, világos és sötét témával; szükség esetén további finomítás.
- [x] Felhasználói vizuális elfogadás — 2026-10-13: a felhasználó elfogadta a jelenlegi Admin főoldal irányát azzal, hogy a fejlesztés közben felmerülő hiányzó képességeket később bővítjük. Addig PR #7 nyitott/piszkozat marad; F0.1 nem PASS, merge tilos.

**Korlát:** a katalógus a MASTER-2.77.7 teljességi kapujában felsorolt forrásokból és a 2.77.5 fázistervből következik. A teljes funkciókatalógus teljességét továbbra is a MASTER E/F fejezetei, a 01–140 mátrix és a H19–H34 történeti ledger igazolja; a dashboard kártyáinak száma önmagában nem bizonyít teljességet.



## 2.77.9.A — F0.1 user feedback: Admin home must be a working Creator Platform dashboard

**Történeti checkpoint:** az akkori `IMPLEMENTING / NOT PASS` állapotot a 2.77.9.D closure record felülírja; az alábbi követelmények scope-megőrző acceptance-irányelvek.

A felhasználó egyértelmű visszajelzése: az Admin főoldal ne vizuális fejlesztési terv vagy funkciókatalógus legyen, hanem valódi Creator Platform adminfelület.

- A kezdőoldalon nem jelenhet meg a 17 kártyás, roadmap-szerű Creator OS katalógus. Ezt a nézetet el kell távolítani a fő dashboardról.
- A kezdőoldal elsődleges feladata: aktuális rendszerállapotok, a webhely és adásrend tényleges adatai, valós integrációs állapot, gyakori napi műveletek és gyors belépés a megfelelő munkaterületre.
- A teljes termék navigációja a bal oldali menüben és a canonical capability/domain registryben marad. A menü nem helyettesíti az E/F specifikációkat, és nem jelenti azt, hogy minden modul már működik.
- A főoldal nem mutathat hamis analitikát, fiktív teendőt, kitalált streamállapotot vagy nem létező publikálási sikert. Az adatforrás nélküli widgetet ki kell hagyni vagy valós, egyértelmű üres/tervezett állapotot kell mutatni.
- A napi munkafolyamatokhoz vezető gyorsműveleteknek valódi, létező útvonalra kell mutatniuk. A kanonikus Editor v2 továbbra is `/admin/editor`; a publikus webhely külön megnyitható.
- A termékbenchmarkokat a megfelelő domain kialakításakor kell felhasználni: Twitch Creator Dashboard (stream/content/community/analytics), Streamlabs (streaming tools/overlays/creator site) és Webflow (visual builder/CMS/preview/publish). Ezek minták, nem automatikus scope-bővítések; a Sanci MASTER és a capability traceability marad a mérvadó.
- A dashboard elrendezésének célja egy operatív munkaközpont; a funkciókészültségi címkék a navigációban és a modul saját képernyőjén jelenjenek meg, ne a kezdőoldal egészét uraló katalógusként.
- Az új irányt külön vizuálisan kell ellenőrizni desktop/tablet/mobile méreteken, világos és sötét témában. A frissített contract teszteknek biztosítaniuk kell, hogy a kezdőoldal ne regresszáljon roadmap-katalógussá.
- **Nincs merge és nincs F0.1 PASS** a helyi tesztek/typecheck, böngészős ellenőrzés és a felhasználó kifejezett vizuális elfogadása előtt.


## 2.77.9.B — Dashboard copy hierarchy and capability completeness clarification

**Történeti checkpoint:** az akkori `IMPLEMENTING / NOT PASS` állapotot a 2.77.9.D closure record felülírja.

- A felhasználó pontosította, hogy a Sanci9517 Creator Platform teljes funkciókészlete jóval több a mostani Admin menüben látható elemeknél. A menü rövid, első szintű navigáció; **nem a teljes capability inventory és nem a végleges termékscope**.
- A teljes scope továbbra is a MASTER 00.9.6.C / 00.9.6.D, az E/F buildpontok, a 01–140 preservation matrix és a H19–H34 történeti traceability alapján vezetendő. A képességek nem hagyhatók el azért, mert a dashboardon vagy a menüben nincs mindegyik felsorolva. A történeti vagy tervezett tétel nem jelent kész runtime-funkciót.
- A kezdőoldal szöveghierarchiája legyen rendezett és középre igazított: főcím és bevezető, szekciócímek, státuszkártyák és gyorsműveletek. A navigációs elemek, sűrű adatlisták és hosszabb munkafelületi tartalmak maradjanak balra igazítva, ahol ez gyorsabb olvashatóságot biztosít.
- Kerülendő a fölösleges ismétlés: ne ismételje ugyanazt a magyarázatot a főcím, szekcióleírás, kártya és gombszöveg. A státuszjelölés, rövid leírás vagy ismétlés csak akkor maradhat, ha külön döntést segít, navigációs kontextust ad, vagy szükséges akadálymentességi/állapotjelzés.
- A középre igazítás nem lehet minden elemre automatikusan ráhúzott szabály; a bal oldali navigáció és a listajellegű tartalom olvashatósága elsőbbséget élvez.
- A PR ellenőrzése tartalmazza a sötét/világos témát, desktop/tablet/mobil töréspontokat, a szövegek túlcsordulását, valamint a fölösleges ismétlések vizuális felülvizsgálatát.
- **Nincs merge és nincs F0.1 PASS** a helyi tesztek/typecheck, a böngészős vizuális ellenőrzés és a felhasználó kifejezett elfogadása előtt.


## 2.77.9.C — Full Creator Platform Admin home and universal action alignment

**Történeti checkpoint:** az akkori `IMPLEMENTING / NOT PASS` és nyitott acceptance állapotot a 2.77.9.D closure record felülírja.

A felhasználó pontos követelménye: nem kizárólag a jelenlegi működő modulok listája kell, hanem a teljes, MASTER-ben rögzített Creator Platform termékirányának áttekinthető megjelenítése az Admin főoldalon, prémium kivitelezéssel. A gombok feliratának és ikonjának függőlegesen és vízszintesen középre kell kerülnie.

- [x] A dashboard megőrzi a napi operatív területet (valós rendszeradatok, webhely, adásrend, integrációs állapot és meglévő belépési pontok).
- [x] Hozzáadva egy külön, kereshető Creator Platform képességtérkép 24 fő munkaterülettel: Weboldal/CMS, Visual Editor v2, Design Studio, Resource Library, Schedule/Game Profiles, Stream Studio/OBS, VOD/Clips/Shorts, Publishing, Twitch, YouTube/TikTok/Discord, Community, Audience/Email/CRM, Analytics, AI Copilot, Commerce/Membership, Automation, Team/SaaS, Security/Recovery, Localization/Accessibility/SEO, Developer Tools/Marketplace, Dynamic Data Binding, Forms/Interactions, Publishing/Revision Control, Content Models/Reusable Blocks.
- [x] A kártyák részletes capability-felsorolásokat és készültségi/fáziscímkéket adnak. A „Tervezett” és „Későbbi” képességek nem aktívként jelennek meg; ezek gombjai letiltott állapotúak, és nem színlelnek létező útvonalat.
- [x] A kereső a navigációs elemek és a capability-kártyák között is keres.
- [x] Az általános műveleti gombok, ikon-gombok, kis gombok, gyorsműveleti linkek és capability CTA-k inline-flex + align-items:center + justify-content:center szabályt kapnak; a navigáció és a sűrű listák balra igazítása szándékosan megmarad.
- [x] A képességkártyák reszponzív gridben, sötét/világos témához illeszkedő felületekkel, fókuszállapottal és reduced-motion támogatással jelennek meg.
- [x] A kártyákban elkerülendő az ugyanazon hosszú funkcióleírás bekezdésben és listában történő ismétlése; a részletes képességek egyszer szerepelnek.
- [x] GitHub Actions friss PR-HEAD-en: `npm run typecheck`, `npm run test:editor`, `npm run test:schedule`, `npm run test:domain`, `npm run test:admin-home` sikeres; a Twitch Integration Check regressziós futása is sikeres (2026-10-13). A felhasználó helyi gépén végzett külön futtatás még hátravan.
- [ ] Böngészős ellenőrzés desktop/tablet/mobil szélességen, mindkét témában; a kártyamagasságok, tördelés, keresés, gombközépre igazítás és túlcsordulás vizuális ellenőrzése.
- [x] Felhasználói vizuális elfogadás — 2026-10-13: a felhasználó elfogadta a jelenlegi Admin főoldal irányát azzal, hogy a fejlesztés közben felmerülő hiányzó képességeket később bővítjük.

**Scope-garancia:** a 24 dashboard-kártya magas szintű felfedezési felület, nem helyettesíti és nem rövidíti le a MASTER 00.9.6.C / 00.9.6.D, E/F specifikációit, a 01–140 preservation matrixet vagy a H19–H34 történeti traceability-t. Ha a részletes MASTER olyan capability-t tartalmaz, amely nem kapott külön dashboard-kártyát, a követelmény attól még megmarad és a megfelelő munkaterület/fázis specifikációjában kötelező. A dashboardon látható tervezett képesség nem bizonyít runtime-implementációt.

**Gate:** a vizuális irány felhasználói elfogadása és a friss PR-HEAD CI-ellenőrzése megtörtént. F0.1 továbbra sem PASS, amíg a felhasználó helyi ellenőrzése és a legfrissebb preview böngészős ellenőrzése nincs lezárva. PR #7 addig nyitott/piszkozat marad; merge csak az ellenőrzési kapuk teljesülése után.

- [x] Külön képességkártyák lefedik a dinamikus adatbindinget, a formokat/interakciókat, a publishing/revision folyamatot és a bővíthető tartalommodelleket; ezek sem jelentenek automatikusan kész runtime-funkciót.

- [x] A felhasználó elfogadta a jelenlegi Admin főoldal irányát; a később hiányzóként felismert funkciók fejlesztés közben, a MASTER scope megőrzésével bővíthetők. Ez nem tekintendő a még futtatandó lokális/böngészős ellenőrzések helyettesítésének.

- [x] CI bővítve `test:domain` és `test:admin-home` futtatásával; a `97c3ea85b62991d878d1d63c8f821f41abcc3b02` HEAD-en mindkét GitHub Actions workflow sikeres. Az Admin home szerződéses teszt egy elavult `.panel` CSS-szelektor elvárása miatt először hibázott; az elvárás a tényleges közös `.panel, .module-card` stílushoz igazítva lett, majd az újrafuttatás sikeres volt.

## 2.77.9.D — F0.1 closure record and F0.2 activation — 2026-10-13

**F0.1 státusz: CLOSED / PASS.** Ez a záróbejegyzés a 2.77.9 és 2.77.9.A–C korábbi, köztes ellenőrzési állapotait felülírja. A korábbi „draft / unmerged” és „még ellenőrzés szükséges” szövegek az akkori pillanatképeket írják le, nem a jelenlegi státuszt.

- [x] PR #7 `feat: start Admin home visual shell (F0.1)` a `feature/admin-home-shell` ágról a `v2/foundation` ágba squash merge-elve.
- [x] Merge commit: `047d66f78cc4bdd6c7b50ddd83140d3ddf4aae48`.
- [x] Merge előtti PR HEAD: `2dcc769c13571d532d27d65e0c7c658001d30e4c`; mindkét kötelező GitHub Actions workflow sikeres.
- [x] Helyi validáció: `npm run typecheck` sikeres; `npm run test:admin-home` 11/11, `npm run test:editor` 30/30, `npm run test:schedule` 9/9, `npm run test:domain` 5/5 — összesen 55 teszt PASS.
- [x] Felhasználói Preview acceptance: a legfrissebb Admin Home preview „teljesen rendben van” visszajelzést kapott.
- [x] A felhasználó elfogadta, hogy az esetlegesen hiányzó capability-k a tényleges fejlesztés közben, a MASTER teljes scope-jának megőrzésével kerülnek hozzáadásra.
- [x] Nem állítjuk, hogy a 24 capability-kártya minden jövőbeli funkciót implementál; a tervezett modulok továbbra sem kész runtime-funkciók.

**M0 értelmezése:** a külön M0 audit munkafázis korábbi felhasználói termékdöntéssel `SUPERSEDED / CLOSED BY PRODUCT DECISION` státuszú. Ez nem M0 audit-PASS; a fejlesztés folytatásának nem előfeltétele. A releváns scope-követelményeket az aktív F0.x munkapontok DoD-jába kell átvezetni.

**Következő aktív munkapont: F0.2 — Admin navigation + global shell acceptance.** Ez nem külön elméleti tervezési fázis: a specifikációt és az ellenőrzési mátrixot a tényleges navigáció/route/auth/state implementációjával együtt kell kidolgozni, majd ugyanabban a munkapontban tesztelni.

F0.2 DoD:
- [ ] Teljes menü- és route-leltár a valós alkalmazásból; minden aktív menüpont létező, helyes, hitelesített célra mutat.
- [ ] A működő, részben elérhető, tervezett, későbbi és letiltott modulok státusza következetes; nincs halott vagy hamisan aktív CTA.
- [ ] Site context és az admin belépési útvonalak következetesek; a canonical Editor továbbra is `/admin/editor`.
- [ ] Auth/role guard, közvetlen asset- és route-kérések, jogosultsághibák és visszairányítások ellenőrizve.
- [ ] Desktop/tablet/mobil navigáció, billentyűzetes fókusz, kontraszt, téma, túlcsordulás és reduced-motion ellenőrizve.
- [ ] Keresés, értesítés és feladatjelzés csak akkor működőként látható, ha valós adat-/viselkedési szerződés támasztja alá; egyébként egyértelmű disabled/queued állapot.
- [ ] Célzott contract/domain/API és regressziós tesztek PASS; `npm run typecheck` PASS.
- [ ] A friss éles deploy után a tényleges production URL-en desktop/mobil/keyboard smoke és felhasználói acceptance PASS; a F0.2 teljes lezárásához a teljes route/auth/navigation DoD is kötelező.
- [ ] E checkpoint végén a MASTER aktív pontja csak bizonyítékokkal frissíthető F0.3-ra.

**Végrehajtási szabály:** nincs párhuzamos engineering stream; nincs új külön auditfázis; nincs funkciótörlés pusztán azért, mert a jelenlegi menüben nem látszik. Amíg a terméket kizárólag a tulajdonos használja, alacsony kockázatú, kizárólag UI/static változás a teljes zöld CI után a meglévő `v2/foundation` → Cloudflare production folyamatba integrálható, majd az éles URL-en történik a vizuális/keyboard acceptance. Adatbázis-migráció, auth/RBAC, titokkezelés, adatvesztési vagy visszafordíthatatlan művelet nem kap automatikus élesítési kivételt. A MASTER marad az egyetlen source of truth.

## 2.77.9.E — F0.2 első implementációs szelet: mobil funkciókeresés — 2026-10-13

**Állapot: IMPLEMENTING — NOT PASS.** Ez a bejegyzés az F0.2 első konkrét kódszeletét rögzíti; nem zárja le az F0.2-t, és nem indít külön tervezési/auditfázist.

- [x] A valós route- és auth-kód áttekintése megkezdődött: `/admin`, `/admin/home`, `/admin/editor` és a közvetlen `/admin-home.html` útvonal auth-ellenőrzése a Workerben található.
- [x] A kanonikus Editor útvonal `/admin/editor`; a Schedule és oldalstruktúra jelenleg ebből az Editor munkaterületből érhető el, ezért külön Schedule URL-t nem szabad kitalálni.
- [x] A webhelybeállítások API admin szerepkört, az oldalak és adásrend API-k editor szerepkört igényelnek; a kezdőoldal valós session/role-adatot jelenít meg, az API-k pedig külön végzik a jogosultságellenőrzést.
- [x] F0.2 első kódváltozás: a korábban legfeljebb 600 px szélességen teljesen eltűnő funkciókeresés mobilon külön, billentyűzetet fókuszáló keresőgombbal megnyitható és Escape-pel bezárható.
- [x] A mobil kereső alapállapotban rejtett; megnyitáskor a keresőmező kap fókuszt, bezáráskor és Escape-re a fókusz visszatér a keresőgombra.
- [x] A statikus webhely-kontekstuson szereplő, működő webhelyváltót sugalló chevron eltávolítva; nincs még több-webhelyes váltófunkció, ezért nem mutatjuk interaktívnak.
- [x] Új Admin Home contract teszt készült a mobil kereső rejtett alapállapotára, nyitására, bezárására és fókuszkezelésére.
- [ ] A feature branch lokális TypeScript- és tesztfuttatásai még szükségesek.
- [ ] PR-hez kötött friss CI, a mobil kereső böngészős ellenőrzése, auth/role/direct-route regresszióteszt és felhasználói acceptance még szükséges.

**Aktuális feature branch:** `feature/f0-2-admin-global-shell`. A változások még nem kerültek a `v2/foundation` ágba. A kizárólag UI/static szelet a friss zöld CI után a felhasználó által jóváhagyott solo-production-first szabály szerint integrálható; az éles oldali acceptance a deploy után történik, és F0.2 ettől még nyitva marad a teljes route/auth/navigation DoD-ig. A következő munka az F0.2 ugyanazon checkpointján belül folytatódik: minden navigációs cél és a jogosultsági határ teljes ellenőrzése, majd a szükséges javítások és tesztek. Nem készítünk külön tervezési dokumentumot.



## 2.77.9.F — F0.2 navigációs route-contract — 2026-10-13

**Állapot: IMPLEMENTING — NOT PASS.** Az F0.2 ugyanazon aktív munkapontján belüli következő ellenőrizhető kódszelet; nem új fázis.

- [x] A friss v2/foundation kód alapján a tényleges Admin oldalsáv célpontjai leltározva: /admin/home és a kanonikus /admin/editor; a publikus oldalra mutató külön CTA célja /.
- [x] A nem implementált Creator OS modulok oldalsáv-elemei jelenleg disabled gombok, nem hamis, működő linkek.
- [x] Contract teszt készül annak kikényszerítésére, hogy az oldalsáv aktív linkjei csak a jóváhagyott Admin route-okra mutassanak, és a jövőbeli modulok letiltva maradjanak.
- [ ] Friss PR-CI PASS: npm run typecheck, npm run test:admin-home, Editor/Schedule/domain regressziók.
- [ ] Valós böngészős route/auth smoke a friss éles deployon; a /admin/home és /admin/editor közvetlen, kijelentkezett kérése /admin/login felé irányítson.
- [ ] F0.2 további DoD-elemei — jogosultsági határok, minden CTA, reszponzív/keyboard állapotok és production acceptance — továbbra is nyitottak.

**Biztonsági megjegyzés:** a statikus Editor asset közvetlen elérhetősége önmagában nem bizonyít jogosulatlan adathozzáférést; az adat/API route-ok szerveroldali auth/role ellenőrzése a lényegi határ. Az asset-route kezelését csak célzott vizsgálat és regressziós terv után szabad módosítani, hogy a CSS/JS betöltés és a bejelentkezett Editor működése ne törjön el.


## 2.77.9.G — F0.2 mobil navigáció fókuszkezelése — 2026-10-13

**Állapot: IMPLEMENTING — NOT PASS.** Az F0.2 aktív route/navigation elfogadási munkájának következő kis szelete.

- [x] A mobil oldalsáv Escape-pel vagy háttérre kattintással történő bezárásakor a fókusz visszakerül a navigációt nyitó gombra.
- [x] Contract teszt fedi a fókusz-visszaállítási viselkedést és a meglévő mobil kereső fókuszkezelését.
- [ ] Friss CI PASS a teljes kötelező tesztkészleten.
- [ ] Éles deploy utáni mobilos, billentyűzetes elfogadás továbbra is szükséges; F0.2 nem zárható le pusztán statikus tesztek alapján.
