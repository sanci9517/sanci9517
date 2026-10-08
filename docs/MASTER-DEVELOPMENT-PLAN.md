**ACTIVE_POINT_ID:** `M0`  
**ACTIVE_POINT_STATUS:** `ACTIVE`  
**ACTIVE_POINT_TITLE:** Global Product Rebaseline + Legacy/Dead Surface Audit + Canonical Platform Scope Freeze  
**PREVIOUS_GATE:** `E6` — CLOSED / PASS  
**NEXT_GATE:** `F0` — csak M0 teljes PASS után, a rebaselined F0 scope szerint nyitható  
**PARALLEL_WORKSTREAMS:** `0`

### Jelenlegi igazolt állapot
- [x] E4.3.1–E4.3.8 lezárva.
- [x] E4.4.1 final migration design + SQL audit lezárva.
- [x] E4.4.2 implementation/dry-run/remote schema verification lezárva.
- [x] Production `site_id NOT NULL` schema/integrity/ownership ellenőrzés PASS.
- [x] Live Worker/public API smoke PASS.
- [x] E4.4 teljes DoD PASS.
- [x] E5 teljes regression/live/user PASS lezárva.
- [x] E6 closure PASS / lezárva.

**F végrehajtási állapot:** PAUSED / QUEUED. Az F/F0 korábbi implementációja nem törlődik és nem tekintendő automatikusan rossznak, de az új M0 audit lezárásáig nem folytatunk további F0/F1 feature-kódolást. Az M0 eredménye alapján a F0 scope és DoD véglegesítendő.


## 00/A.2.2 — F — SCHEDULE CRUD + INSPECTOR / DOMAIN-DRIVEN EDITOR — DEFINITION OF DONE

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
**Állapot:** `[x] PASS — 2026-10-08; teljes 01–140 traceability és canonical capability hozzárendelés dokumentálva.`

- [~] teljes jelenlegi MASTER **4117 soros** állapotának átnézése; a 00/A és 00.9–00.9.6.B újrapontozása megtörtént, a történeti 19–34 szakasz teljes összevetése még hátra van;
- [~] régi 19–34 backlog és későbbi roadmap funkcióinak összevetése;
- [ ] minden funkció egyedi domain/surface/owner/státusz szerint regisztrálva;
- [ ] duplikált feature-ek összevonása;
- [ ] történeti státusz és jelenlegi végrehajtási státusz szétválasztása;
- [ ] elveszett/implicit funkciók visszaemelése a canonical product mapbe.

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

**M0.1 zárási döntés:** PASS. A történeti funkciólista nem törlődött; a modern capability map alá lett rendezve, és ahol egy régi funkció több új capability-re bomlik, az eredeti ID traceability megmaradt.

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

### M0.3 — Admin / Editor / Public surface audit
**Állapot:** `[~] FOLYAMATBAN — source-level route/surface audit PASS; runtime browser acceptance és végleges legacy disposition még szükséges.`

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
- [ ] Actual browser reproduction of the previously observed Admin/Schedule UI error still required before declaring the user-facing root cause closed.
- [ ] Compare all Schedule fields required by the final product contract against the current admin form. Current legacy admin form exposes title/platform/start/end/status/url/notes, while the canonical product target also requires richer metadata such as artwork, game, timezone/source/sync/recurrence/featured/views/filters/template binding where applicable.
- [ ] User acceptance of the final Schedule UX remains pending.

**M0.3 legacy rule:** no dead backend or static legacy surface may remain linked as an ACTIVE Admin capability. Physical legacy files may remain temporarily only under explicit ARCHIVE/MIGRATE status and must have no canonical ownership.

### M0.4 — Canonical ownership matrix freeze
Minden domainhez pontosan egy:
- source of truth;
- storage owner;
- mutation boundary;
- UI owner;
- public consumer;
- revision/publish lifecycle;
- permission boundary.

### M0.5 — Central Resource contract freeze
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
Minden funkció explicit státuszt kap. A „majd egyszer” kategória is megmarad, de nem blokkolhatja az 1.0-t.

### M0.9 — Legacy removal plan
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
- [ ] nincs aktívnak látszó hibás admin funkció;
- [ ] future funkciók PLANNED/BETA/FOUNDATION állapotot mutatnak;
- [ ] régi route-ok redirect/disabled/archive stratégiát kapnak;
- [ ] Admin navigation canonical feature registryből származik.

### M0.11 — Benchmark completion
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