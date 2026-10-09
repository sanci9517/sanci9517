**ACTIVE_POINT_ID:** `M0`  
**ACTIVE_POINT_STATUS:** `ACTIVE`  
**ACTIVE_POINT_TITLE:** Global Product Rebaseline + Legacy/Dead Surface Audit + Canonical Platform Scope Freeze  
**ACTIVE_SUBPOINT_ID:** `M0.1-RESIDUAL-CONSISTENCY-CLOSURE`  
**ACTIVE_SUBPOINT_STATUS:** `ACTIVE — a státuszellentmondások és a M0.1 nyitott traceability-feladatai rendezendők; feature-implementáció továbbra is tiltott`  
**PREVIOUS_GATE:** `E6` — CLOSED / PASS  
**NEXT_GATE:** `M0.1 residual closure → M0.2 closure → M0.3 closure → M0.5 Resource contract freeze; F0 csak a teljes M0 PASS után nyitható`  
**PARALLEL_WORKSTREAMS:** `0`

### Jelenlegi igazolt állapot
Ez a blokk kizárólag az M0 előtti lezárt gate-eket rögzíti; nem jelenti azt, hogy az M0 alatti részpontok lezárultak.
- [x] E4.3.1–E4.3.8 lezárva.
- [x] E4.4.1 final migration design + SQL audit lezárva.
- [x] E4.4.2 implementation/dry-run/remote schema verification lezárva.
- [x] Production `site_id NOT NULL` schema/integrity/ownership ellenőrzés PASS.
- [x] Live Worker/public API smoke PASS.
- [x] E4.4 teljes DoD PASS.
- [x] E5 teljes regression/live/user PASS lezárva.
- [x] E6 closure PASS / lezárva.

**F végrehajtási állapot:** PAUSED / QUEUED. Az F/F0 korábbi implementációja nem törlődik és nem tekintendő automatikusan rossznak, de az új M0 audit lezárásáig nem folytatunk további F0/F1 feature-kódolást. Az M0 eredménye alapján a F0 scope és DoD véglegesítendő.


## HISTORICAL / QUEUED — 00/A.2.2 — F — SCHEDULE CRUD + INSPECTOR / DOMAIN-DRIVEN EDITOR — DEFINITION OF DONE

**Állapot:** HISTORICAL SCOPE / QUEUED. Ez a korábbi F-terv megőrzött definíciója, nem aktív végrehajtási utasítás; a jelenlegi sorrendet az M0, majd a rebaselined F0 határozza meg.

**Cél:** a lezárt E-stage foundationre építve elkészíteni a canonical Schedule CRUD és az Inspector/domain-driven Editor bővítés első 1.0-s megvalósítási szakaszát. Ez nem új Visual Editor, nem új Schedule domain és nem a legacy rendszer visszaaktiválása.

**Kötelező architekturális szabályok:**
- [x] A canonical Visual Editor kizárólag `public/editor-v2/`.
- [x] A Schedule domain D1-ben marad canonical domain adatként.
- [x] A Page Model/presentation és a Schedule domain adat külön réteg marad.
- [x] Inspector nem hoz létre párhuzamos property/state rendszert.
- [x] Legacy Schedule/Admin/Editor réteg nem aktiválható újra.
- [x] Minden új adatút site-scoped és a lezárt E4 ownership contractot használja.
- [x] Minden új mutation meglévő command/history/validation/persistence/audit mintára épül.

## M0 — GLOBAL PRODUCT REBASELINE + LEGACY / DEAD SURFACE AUDIT

**M0 státusz:** `[~] ACTIVE — scope/documentation audit IN PROGRESS; implementation frozen`

**M0 célja:** a jelenlegi teljes MASTER, repository és meglévő runtime alapján bizonyítani, hogy a Sanci9517 projekt valódi termék- és platformcélja teljesen lefedett, nincs elfelejtett domain vagy későbbi funkció, nincs párhuzamos canonical rendszer, és az Admin/Editor/Public felületeken nem marad olyan régi működés, amelyet az új platform nem tud kezelni.

**M0 alatt új feature runtime implementáció NEM indul.** M0 csak audit, specifikáció, scope-rendezés, ownership-döntés és legacy-felület osztályozás.

### M0.1 — MASTER teljes funkcióinventár
**Állapot:** `[~] IN PROGRESS — a 01–140 traceability mátrix dokumentálva van, de a történeti 19–34 backlog teljes összevetése és az alábbi maradék ellenőrzések lezárása nincs a MASTER-ben bizonyítva. M0.1 ezért nem jelölhető PASS-nak.`

- [x] A 01–140 történeti funkciópont egyedi ID-val megőrizve és canonical capability/domain alá rendelve.
- [x] A történeti státuszok a preservation matrixban történeti jelölésként vannak megmagyarázva; nem tekinthetők mai runtime készültségnek.
- [ ] A 00/A és 00.9–00.9.6.B szakaszok teljes, pontról pontra történő egyeztetése a jelenlegi canonical product map-pel.
- [ ] A korábbi 19–34 backlog hiteles forrásának visszakeresése, teljes összevetése, és minden elemhez egyedi traceability-kapcsolat vagy indokolt superseded/duplicate döntés rögzítése.
- [ ] A teljes capability inventoryban minden funkcióhoz domain, surface, owner, phase/scope és lifecycle státusz hozzárendelése.
- [ ] A tényleges duplikátumok azonosítása és csak bizonyíték alapján történő összevonása; külön capability-k nem törölhetők puszta hasonlóság miatt.
- [ ] Minden elveszett vagy implicit funkció visszavezetése a canonical mapbe vagy dokumentált, indokolt kizárása.

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
| 057 | [ ] Twitch / YouTube / TikTok / Discord blokkok | Content / Media / Asset | 1.0 foundation + 1.x |
| 058 | [ ] Schedule / Live / Countdown / VOD blokkok | Content / Media / Asset | 1.0 foundation + 1.x |
| 059 | [ ] Form / contact blokkok | Content / Media / Asset | 1.0 foundation + 1.x |
| 060 | [ ] Media library / R2 | Content / Media / Asset | 1.0 foundation + 1.x |
| 061 | [ ] Draft | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 062 | [ ] Preview | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 063 | [ ] Publish | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 064 | [ ] Public renderer canonical published documentből | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 065 | [ ] Public / draft izoláció | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 066 | [ ] Revision history UI | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 067 | [ ] Rollback UI | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 068 | [ ] Import / export | Publishing / Revision / Import-Export | 1.0 + 1.x |
| 069 | [ ] Főoldal | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 070 | [ ] Twitch | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 071 | [ ] YouTube | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 072 | [ ] TikTok | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 073 | [ ] Adásrend | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 074 | [ ] Következő adás / countdown | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 075 | [ ] Élő / offline állapot | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 076 | [ ] VOD / Shorts / Clips | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 077 | [ ] Rólam | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 078 | [ ] Közösség / Discord | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 079 | [ ] Kapcsolat | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 080 | [ ] Támogatás | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 081 | [ ] Szponzor / üzleti / Press Kit | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 082 | [ ] 404 / loading / empty / error állapotok | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 083 | [ ] Egységes mobil / tablet / desktop UX | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 084 | [ ] SEO / Open Graph / structured data | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 085 | [ ] Accessibility | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 086 | [ ] Performance / caching | Public Website / UX / SEO / Accessibility / Performance | 1.0 |
| 087 | [ ] Schedule D1 rendszer | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 088 | [ ] Twitch API / live state | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 089 | [ ] YouTube API | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 090 | [ ] TikTok rendszer | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 091 | [ ] VOD rendszer | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 092 | [ ] Community / Discord | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 093 | [ ] Contact / collaboration | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 094 | [ ] Site settings | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
| 095 | [ ] Analytics | Streamer Domain / Integrations / Analytics | 1.0 + 1.x + future adapters |
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

**M0.1 interim megállapítás — nem zárási döntés:** a 01–140 mátrix megőrzi a korábban visszaolvasott funkciópontokat, de ez önmagában nem bizonyítja a 19–34 backlog teljes egyeztetését vagy a teljes MASTER konzisztenciáját. M0.1 csak a fenti nyitott ellenőrzések bizonyíték-alapú lezárása után kaphat PASS.

### M0.2 — Platform domain inventory
**Állapot:** `[~] FOLYAMATBAN — canonical ownership matrix rögzítve; repository evidence audit PASS, runtime-capability gapek külön jelölve.`

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

| Domain | Canonical owner / source of truth | Storage / boundary | Scope |
|---|---|---|---|
| Search / Discovery | Platform Search / indexing contract | indexed metadata + D1/R2 refs | 1.0 foundation / 1.x+ |
| Notifications / Messaging | Notification domain + integration adapters | D1 + provider boundary | 1.x+ |
| Privacy / Consent / Compliance | Privacy & Policy domain | D1/config + legal/provider boundary | 1.0 foundation / SaaS+ |
| Secrets / Integration Config | Secret/config boundary | Cloudflare secret/config layer; never Page Model | 1.0+ |
| API / Webhook / Developer Surface | Integration/API contract | Worker routes + webhook boundary | 1.0 foundation / 1.x+ |
| Deployment / Release / Environments | Release/Deployment domain | Worker/deploy config + environment state | 1.0 gates / SaaS+ |
| Migration / Data Lifecycle | Migration contract | D1 migrations + import/export boundary | 0.x–10.0 |
| Backup / Disaster Recovery | Backup/Recovery domain | D1/R2/export boundary | 1.0 gates / 1.x+ |
| Testing / Quality Gates | QA/Verification contract | CI/test/live acceptance evidence | 0.x–10.0 |
| Diagnostics / Observability | Diagnostics/Observability domain | logs/metrics/error boundary | 0.x–10.0 |
| Performance / Caching / Edge | Performance platform contract | Worker/cache/CDN boundary | 1.0+ |
| Accessibility | Accessibility contract | Editor + renderer + public UI | 1.0+ |
| Billing / Entitlements | Billing/Subscription domain | D1 + payment-provider boundary | 4.0+ |
| Audit / Governance | Audit + policy contract | D1/log boundary | 0.x–10.0 |
| Data Portability | Import/Export/Portability contract | JSON/media/package boundary | 1.0+ |
| Custom Code / HTML / Embed | Secure Embed/Custom-Code contract | sandboxed renderer boundary; never direct privileged persistence | 1.x+ |
| Experimentation / Personalization | Experimentation domain | analytics/config/content boundary | 6.0–10.0 |

**M0.2.A szabály:** ezek nem „extra funkciók”, hanem platform-szintű cross-cutting contracts. Ha egy későbbi capability ezekre támaszkodik, a capability saját domainje nem hozhat létre második auth, permission, audit, resource, search, analytics, notification, deployment, migration vagy persistence rendszert.

### M0.3 — Admin / Editor / Public surface audit
**Állapot:** `[~] IN PROGRESS — a canonical Admin → Editor → Schedule böngészős útvonal és felhasználói acceptance igazolt; a teljes legacy disposition és az Admin/Editor/Public surface-leltár lezárása még M0.9/M0.10 feladat. A pont ezért nem PASS.`

| Surface | Current entry | Canonical runtime | Evidence | Current finding | M0 action |
|---|---|---|---|---|---|
| Admin login | `/admin/login`, `/admin-login.html` | auth login | `src/index.ts` + `public/admin-login.html` | active | KEEP |
| Admin root | `/admin`, `/admin.html` | redirect → `/admin/editor` | `src/index.ts` | `public/admin.html` is physically present but not canonical authenticated runtime | DISABLE/ARCHIVE legacy file after replacement-safe check |
| Canonical Editor | `/admin/editor` | `public/editor-v2/index.html` | `src/index.ts` + editor-v2 | canonical | KEEP |
| Legacy Editor | `public/editor/` | none | repository inventory | physically present; no canonical route | ARCHIVE/REMOVE after reference scan |
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
| Legacy system-page assets | `public/assets/system-page-editor.js`, `system-page-runtime.js` | none canonical | repository inventory | legacy | ARCHIVE/REMOVE after reference scan |
| Social Admin panel | `public/admin.html` | none yet | placeholder only | labelled active-looking while backend is not implemented | RECLASSIFY as PLANNED |
| Future Admin features | product-map capability registry | future | M0 product map | allowed, but must show explicit PLANNED/BETA/FOUNDATION state | KEEP with feature-state contract |

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
**Állapot:** `[ ] QUEUED — M0.1–M0.3 státusz- és lezárási konzisztencia rendezéséig nem indul. M0.5 a következő termék/domain contract feladat, amint az előtte lévő M0 részpontok lezárása és a sorrend explicit igazolása megtörtént. Feature-implementáció itt sem indulhat.`

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
**Állapot:** `[ ] QUEUED — kizárólag M0.5 PASS után.`

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
**Állapot:** `[ ] QUEUED — kizárólag M0.6 PASS után.`

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
**Állapot:** `[ ] QUEUED — kizárólag M0.7 PASS után.`

Minden funkció explicit státuszt kap. A „majd egyszer” kategória is megmarad, de nem blokkolhatja az 1.0-t.

### M0.9 — Legacy removal plan
**Állapot:** `[ ] QUEUED — kizárólag M0.8 PASS után.`

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
**Állapot:** `[ ] QUEUED — kizárólag M0.9 PASS után.`

- [ ] nincs aktívnak látszó hibás admin funkció;
- [ ] future funkciók PLANNED/BETA/FOUNDATION állapotot mutatnak;
- [ ] régi route-ok redirect/disabled/archive stratégiát kapnak;
- [ ] Admin navigation canonical feature registryből származik.

### M0.11 — Benchmark completion
**Állapot:** `[ ] QUEUED — kizárólag M0.10 PASS után.`

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
**Állapot:** `[ ] QUEUED — kizárólag M0.1–M0.11 minden előírt feltételének teljesülése után.`

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
**Állapot:** `[ ] QUEUED — csak M0.12 PASS és felhasználói jóváhagyás után.`

M0 után az egyetlen aktív pont:
**F0 — Canonical Editor UI + Schedule + Inspector remediation, a rebaselined platform contract szerint.**

F0 után csak a teljes PASS lánc:
**F0 → G → H → I → J → Early Public Website → további 1.0 production gates → 1.0 Production Gate.**


## F0 — CANONICAL EDITOR UI + SCHEDULE + INSPECTOR — TELJES BŐVÍTETT AUDIT, CONTRACT ÉS JAVÍTÁSI KAPU
**F0 státusz:** `[ ] QUEUED / PAUSED — M0 PASS-ig nincs F0 feature-implementáció. A korábbi audit/implementáció bizonyítékait M0 újraértékeli.`

**F0 célja:**  
A jelenlegi `public/editor-v2/` canonical Editor v2 teljes használhatósági alapjának helyreállítása és bizonyítása úgy, hogy az Editor **desktopon, tableten és mobilon ugyanazt a canonical Page Modelt szerkessze**, a bal oldali navigáció valóban használható legyen, az Inspector valódi szerkesztési felületként működjön, az Adásrend külön domain-szerkesztési felületként elérhető legyen, és egyetlen szerkesztési/mutation/persistence útvonal maradjon.

Ez az F0 **nem egy új Visual Editor és nem egy második Schedule Builder**. Az F0 az eddig meglévő canonical alapokat auditálja, összeköti és csak a bizonyított UI/contract hiányosságokat javítja.

**F0 scope egyetlen ponton belül:**
- Editor shell és panel lifecycle.
- Desktop/tablet/mobile responsive shell.
- Bal oldali navigáció / Pages / Elements / Layers.
- Jobb oldali Inspector.
- Selection → Inspector binding.
- Property Registry → Inspector binding.
- Schedule node → Schedule Inspector contract.
- Schedule domain → Page Model boundary.
- Canonical command/history/mutation útvonal.
- Dirty/save/reload/recovery állapot.
- Publish/republish kapcsolat.
- Permission/site-scope/concurrency/audit.
- Accessibility/keyboard/touch.
- Diagnostics és regresszió.
- Live browser acceptance.

**F0 kizárólagos szabály:** a fenti technikai alrészek nem külön aktív fejlesztési pontok. Mind ugyanennek az F0 kapunak a DoD-ján belüli al-lépések. Az F1 csak akkor nyitható, ha az egész F0 PASS és a felhasználói acceptance is PASS.

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

## F0.1 — TELJES EDITOR SHELL / PANEL CONTRACT AUDIT

---

# 00.9.6.C — ULTIMATE CREATOR PLATFORM — VÉGLEGES TERMÉK- ÉS FEJLESZTÉSI VILÁGTÉRKÉP — MASTER-2.71

**Rögzítve:** 2026-10-08  
**Jelleg:** CANONICAL PRODUCT SCOPE / ROADMAP FREEZE  
**Aktív engineering pont:** továbbra is **M0**. Ez a fejezet nem nyit párhuzamos fejlesztési pontot és nem írja felül az M0 sorrendjét.  
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

## PHASE 0 — Foundation / M0 → F0
**Cél:** canonical architecture, ownership, dead-surface cleanup, builder foundation.

- M0.1–M0.13 teljes audit/freeze
- canonical ownership
- Resource contract
- Template/Component/Theme contract
- streamer/OBS capability freeze
- 1.0 scope freeze
- legacy cleanup plan
- no-dead-admin gate
- benchmark gate
- M0 PASS
- F0 rebaselined DoD

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
**M0 → M0 PASS → F0 → F1... → 1.0 gates → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8+**

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

A korábbi MASTER **19–34** szakaszai nem kerültek kivonásra vagy törlésre. Ezek archivált, de érvényes backlogként kezelendők. Ha egy funkció új domain alá került, az csak **canonical owner consolidation**, nem feature deletion.

Minden korábbi funkciót a végrehajtás előtt újra kell térképezni:
**historical ID → canonical domain → surface → phase → dependency → DoD → test → acceptance**.

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