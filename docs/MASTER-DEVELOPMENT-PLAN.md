# Sanci9517 — EGYSÉGES MASTER FEJLESZTÉSI, TESZTELÉSI ÉS FUNKCIÓBŐVÍTÉSI TERV

**Verzió:** MASTER-2.64.0  
**Dátum:** 2026-10-08  
**Repository:** `sanci9517/sanci9517`  
**Aktív branch:** `v2/foundation`  
**Projekt:** Sanci9517 Streamer Brand Platform  
**Állapot:** ez az egyetlen aktív fejlesztési terv.

**Feature-preservation szabály:** a korábbi MASTER/roadmap bármely kívánt funkciója megmarad. Új igények csak hozzáadódnak; sem funkció, sem domain, sem jövőbeli backlog tétel nem törölhető vagy némítható el döntés nélkül. A régi 19–34 szakaszok teljes funkciólistája archivált backlogként továbbra is érvényes, és az 1.0/post-1.0 besorolás csak explicit döntéssel változhat.

**Optimalizált fejlesztési sebesség / minőségi kapu szabály — 2026-09-28:** A fejlesztést minden olyan ponton gyorsítani kell, ahol ez a minőségi, biztonsági és architekturális bizonyosság csökkentése nélkül megtehető. A gyorsítás nem jelent teszt, security gate, ownership/permission ellenőrzés, validation, idempotency, failure/rollback, live verification vagy MASTER checkpoint kihagyását. A gyorsítás elsődleges eszközei: kevesebb felesleges újraépítés, canonical contract előre rögzítése, célzott referencia-architektúra/kódvizsgálat, automatizált CI/regressziótesztek, újrahasználható infrastruktúra és független munkák biztonságos párhuzamosítása. Egy logikai, önálló feature továbbra is egy fejlesztési pont; annak technikai al-lépései a pont DoD-ján belül maradnak. Sikertelen ellenőrzés esetén nincs „elég jó” lezárás és nincs minőségi kapu átugrás. A cél: a teljes fejlesztési idő csökkentése úgy, hogy a hibamentes, reprodukálható és hosszú távon bővíthető megvalósítási standard változatlan maradjon.

**Public Design Freedom / Multi-user uniqueness szabály:** az 1.0 vizuális rendszerének nem csak tartalom- és komponensszerkesztést kell biztosítania. A publikusan megjelenő weboldal vizuális identitása is felhasználónként/site-onként egyedileg konfigurálható kell legyen. A felhasználóbarát admin/editor célja, hogy technikai CSS-kód nélkül is létrehozható legyen saját brand és megjelenés: theme/design tokens, typography, colors, semantic colors, backgrounds, spacing, radius, shadows, containers, layout variants, component styles, navigation/header/footer, card/button/form styles, responsive presentation, visibility, imagery, templates és page-level presentation. A rendszernek preset/template alapú gyors indulást és mélyebb egyedi testreszabást is támogatnia kell. A domain adat, a Page Model és az Editor UI state továbbra is külön marad; a public design egy canonical presentation/theme réteg lesz. Multi-user jövőre készülve minden design/configuration site-scoped/tenant-scoped kell legyen, ne globális megosztott állapot. A default design csak kiindulópont, nem korlát.

**Legutóbbi igazolt állapot:** 2026-10-07 — az E4.3.4–E4.3.8 teljes ownership/security/live hardening sorozat PASS és lezárva. Az E4.4 teljes `site_id NOT NULL` schema-hardening DoD is PASS és lezárva: az E4.4.1 migration design/exact SQL audit PASS, az E4.4.2 actual implementation + isolated dry-run PASS, a production schema már mind a hat érintett táblán `site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE RESTRICT`, minden érintett rekord `site_id` értéke kitöltött, `foreign_key_check` PASS, a pages → published revision linkage megmaradt, és a live Worker/public API smoke tesztek PASS állapotban vannak. A következő és egyetlen fejlesztési kapu az E5; E5 az E4.4 teljes lezárása után nyitható meg.

## 00/B — ÚJ BESZÉLGETÉS / CHECKPOINT VÉDELMI ZÁR — 2026-09-22

**Ez a blokk kötelező boot-ellenőrzés új beszélgetés indításakor.**

Ha bármilyen régi checkpoint, összefoglaló, korábbi üzenet vagy történeti fejezet az alábbiak bármelyikét állítja, az **ELAVULT**, és nem szabad folytatási pontként használni:
- „40.68 – pageOrder teljes tesztelése”
- „Most következő pont: 40.68”
- „deploy után kezdjük a mobilos pageOrder tesztet”
- „40.67 → 40.68 pageOrder teszt”
- bármely olyan állapot, amely 40.67-et vagy 40.68-at aktív/pending fejlesztési pontként jelöl.

**Hivatalos aktuális állapot:**
- 40.67 — `[x]` LEZÁRVA.
- 40.68 — `[x]` LEZÁRVA.
- 40.69.1 — `[x]` AUDIT PASS — teljes kód- és adatfolyam-audit lezárva.
- 40.69.2 — `[x]` LEZÁRVA.
- 40.69.5 — `[x]` LEZÁRVA — rollback + republish live regresszió PASS.
- 40.69.7 — `[x]` LEZÁRVA — célzott live page.update + audit_log együttállás PASS.
- A pageOrder mobil élő tesztje nem aktuális feladat; a 40.67 teljes mobil tesztje már lezárt.
- A korábban csak mobilon tesztelt funkciók PC/Desktop visszatesztje későbbi tesztkapu, és csak a felhasználó külön kérésére indul.

**Boot-szabály:** új beszélgetésben a modellnek először ezt a 00/B blokkot, majd közvetlenül a 00/A indexet kell figyelembe vennie. Ha bármely régi checkpoint ettől eltér, a régi checkpointot kell figyelmen kívül hagyni, nem az aktuális MASTER állapotot.

**Egyetlen aktuális folytatási mondat:**
 > „Folytassuk a Sanci9517 MASTER tervet az **E5** pontnál. E4.3.1–E4.3.8 és E4.4 teljesen lezárultak; az E4.4 production schema, integrity, ownership és live public smoke gate-jei PASS. A következő munka kizárólag az E5 MASTER-ben rögzített követelményei szerint nyitható meg.”

> **Ez a dokumentum az egyetlen végrehajtási igazságforrás.** A korábbi blueprint-ek, roadmap-ek, editor-tervek, AI-tervek és státuszfájlok archivált tudásanyagként maradnak meg. Új beszélgetésben, akár hónapok múlva is, ezt a fájlt kell először elolvasni, majd kizárólag a **00/A MASTER VÉGREHAJTÁSI INDEX egyetlen aktív pontjából** folytatni. Más fejezet `[ ]`, `[~]` vagy régebbi „következő lépés” szövege nem jelent aktuális folytatási pontot.

---

# 00.9 — VÉGÁLLAPOT / TERMÉKCÉL — Sanci9517 → GLOBAL STREAMER PLATFORM

**Célmeghatározás — 2026-09-25**

A projekt végső iránya nem egyszerűen egy Sanci9517 bemutatkozó weboldal és nem csak egy Schedule Builder. Az **1.0 cél egy működő, professzionális, szerveroldali streamer-weboldal + admin/content management + visual website editor platform**, amely jelenleg **Sanci9517 Streamer Brand** néven és saját tartalommal készül, de az architektúra úgy épül, hogy később más streamerek számára is használható legyen.

**1.0 elsődleges célja:**
- [ ] Sanci9517 teljes, professzionális streamer-weboldala.
- [ ] Admin rendszer, ahol a webhely tartalma és beállításai kezelhetők.
- [ ] Visual Editor v2, amely valódi oldalépítőként használható.
- [ ] Canonical Page Model + node tree + property/Inspector rendszer.
- [ ] Draft → Preview → Publish → Public workflow.
- [ ] Twitch integráció és Schedule domain stabil működése.
- [ ] Media/asset kezelés.
- [ ] Responsive desktop/tablet/mobile működés ugyanazon canonical rendszerrel.
- [ ] Security, accessibility, performance, observability és audit alapok.
- [ ] Magyar (hu-HU) teljesen támogatott 1.0 tartalmi nyelv.
- [ ] Localization-ready architektúra későbbi globális nyelvi bővítéshez.
- [ ] Olyan domain és adatmodell, amelyből később több streamer/site/account kezelhető ugyanazon platformon.

**Ami 1.0 előtt NEM cél:** minden későbbi platformintegráció, teljes fordítási ökoszisztéma, SaaS billing, csapatmunka, AI content generation, analytics/AB testing, calendar/reminder/export, minden közösségi integráció és minden haladó template. Ezeket a MASTER külön post-1.0 backlogként kezeli, de az 1.0 architektúra nem akadályozhatja őket.

## 00.9.1 — Szakmai szerep és fejlesztési minőség

A projekt fejlesztését a beszélgetésekben **Senior Full-Stack Software Architect / Senior Programmer / Web Designer / UX-UI Designer / Systems & Product Engineer** szerepkörben kell kezelni. Ez nem marketingcím, hanem munkamódszer: a válaszok és implementációk a teljes webplatform, adatmodell, UI/UX, visual editor, backend, D1, Cloudflare, security, testing és product architecture összefüggésében készülnek.

**Kötelező szakmai hozzáállás:**
- [x] Senior architektúra-szemlélet: előbb ownership, contract, adatfolyam, lifecycle, majd kód.
- [x] Senior full-stack szemlélet: frontend, editor, Worker/API, D1, media, deploy és public renderer együtt kezelendő.
- [x] Webdesigner/UX szemlélet: nem elég működnie; hierarchia, spacing, typography, visual rhythm, responsive viselkedés, accessibility és használhatóság is követelmény.
- [x] Product engineering: 1.0 scope, Definition of Done és felhasználói érték szerint haladunk.
- [x] Nem változtatjuk meg azt, ami már bizonyítottan jó. Először bizonyítékot keresünk; refaktor csak akkor történik, ha kisebb kockázatot, jobb karbantarthatóságot vagy jobb bővíthetőséget ad.
- [x] A hibás részeknél nem patch-elünk végtelenül: gyökérok-audit → canonical javítás → regresszió.
- [x] Új funkciót nem azért építünk, mert „lehet”, hanem mert a termékcélhoz, UX-hez, domainhez vagy jövőbeli bővíthetőséghez szükséges.

## 00.9.2 — Profi benchmark / forráskód-vizsgálati szabály

Minden jelentős Visual Editor, CMS, Schedule, Media vagy localization architekturális döntés előtt a MASTER alapján célzott benchmarkot végzünk.

**Elsődleges referencia-csoport:**
- [ ] **Puck** — component registry, fields/Inspector, component data, render boundary, permissions/extensibility, serialization.
- [ ] **Craft.js** — node tree, selection, hierarchy, connectors, drag/drop, state, serialization/history.
- [ ] **GrapesJS** — component model, Blocks, Style Manager, Layer Manager, Asset Manager, commands, storage.
- [ ] **Builder Visual Editor** — iframe/live visual editing, Layers/X-Ray, reusable Templates/Symbols, responsive Artboard Mode, locale picker, history/comments.
- [ ] **Framer** — Canvas/Layers/Assets, CMS, reusable components, drafts/publish, localization, responsive design.
- [ ] **Webflow** — visual/CMS model, responsive styling, localization inheritance/override, Navigator/Components.
- [ ] **Sanity** — structured content, visual editing, content-source mapping, draft/published perspective, localization and custom Studio.
- [ ] További open-source projektek, ha egy konkrét problémára jobb, bizonyítható referencia van.

**Forrásvizsgálati szabály:** ahol a forráskód nyíltan és jogszerűen hozzáférhető, a releváns implementationt, modulhatárokat, teszteket és adatfolyamot is megvizsgáljuk — nem csak a marketing/documentation oldalt. Zárt/proprietary rendszereknél csak a nyilvánosan dokumentált működést és UI/UX mintákat használjuk; nem állítjuk, hogy a belső kódjukat láttuk.

**Cél:** gyorsabb, egyszerűbb, pontosabb és kevesebb visszalépéssel járó fejlesztés. Benchmark nem másolás; a saját Cloudflare/D1/Page Model rendszerünk canonical contractja mindig elsőbbséget élvez.

## 00.9.3 — A platform canonical rétegei

A célarchitektúra:

```
Platform / Site / Account
        │
        ├── Localization
        ├── Content / Page Model
        ├── Domain Data
        │      ├── Schedule
        │      ├── Game Profiles
        │      ├── Platforms
        │      ├── Media
        │      └── future VOD/Clips/etc.
        │
        ├── Visual Presentation
        │      ├── Components
        │      ├── Templates
        │      ├── Design tokens
        │      ├── Responsive rules
        │      └── Visibility
        │
        ├── Editor State
        │      ├── Selection
        │      ├── Hierarchy
        │      ├── Commands
        │      ├── History
        │      └── Transactions
        │
        ├── Persistence / Revision
        │      ├── Draft
        │      ├── Preview
        │      ├── Publish
        │      └── Rollback
        │
        └── Public Runtime
               ├── Renderer
               ├── SEO/meta
               ├── localized route
               └── public domain data
```

**Tiltás:** domain adat, Page Model/presentation és Editor UI state nem keverhető össze csak azért, hogy egy UI funkció gyorsabban elkészüljön.

## 00.9.4 — Tartalom és megjelenés: minden ésszerűen szerkeszthető

Az 1.0-ig a rendszernek elő kell készítenie, hogy egy komponensnél a felhasználó a domain által engedett tulajdonságokat Inspectorból kezelhesse.

**Content/data példák:**
- cím, leírás, rich text/structured text;
- link, URL, CTA;
- media/asset referencia;
- game profile;
- platform;
- schedule időpont/status;
- optional metadata;
- SEO/meta;
- alt text;
- visibility/conditional data, ahol indokolt.

**Presentation példák:**
- template;
- layout;
- width/height;
- spacing;
- padding/margin/gap;
- alignment;
- typography;
- color/accent;
- border/radius/shadow;
- image fit/position;
- visible/hidden fields;
- responsive breakpoint overrides;
- component-specific options;
- reusable style/token/preset.

**Szabály:** opcionális adat hiánya normális állapot. A renderer nem generál hibás üres blokkokat; a component csak azt mutatja, amire van adat és amire a presentation contract engedélyt ad.

**Preset + manual:** ahol értelmes, ugyanazon canonical command/validation/history/persistence útvonalon legyen preset és kézi beállítás.

## 00.9.5 — Global-ready localization stratégia

**1.0:** HU-HU.  
**Architektúra:** később tetszőleges locale hozzáadható.

Kötelező előkészítés:
- locale registry;
- default/fallback locale;
- translatable vs non-translatable fields;
- localized content reference/field strategy;
- locale-aware date/time/number formatting;
- localized route/SEO stratégia;
- alt text/meta localization;
- Editor locale context;
- draft/publish per locale későbbi támogatásának lehetősége;
- RTL-kompatibilis UI és CSS alapok;
- missing translation állapot későbbi kezelhetősége.

**Referenciaelv:** a secondary locale ne kényszerítse a teljes oldalstruktúra lemásolását. A tartalom/field szintű lokalizáció és fallback legyen első osztályú lehetőség; a Webflow és Sanity dokumentált localization modelljei erre hasznos referenciát adnak. citeturn0search8turn0search4

## 00.9.6 — 1.0 Admin / Streamer Platform funkciótérkép

**A 1.0 admin rendszer célja:** egy streamer a saját webhelyét fejlesztői segítség nélkül, biztonságosan és vizuálisan kezelhesse.

### Site / Pages
- [ ] Dashboard
- [ ] Pages lista
- [ ] oldal létrehozás/duplikálás/archiválás
- [ ] slug
- [ ] meta title/description
- [ ] Open Graph alapok
- [ ] menu/navigation
- [ ] page order
- [ ] draft/preview/publish/unpublish
- [ ] revision/history
- [ ] rollback/republish
- [ ] page-level visibility
- [ ] future localization-ready page structure

### Visual Editor
- [ ] canvas
- [ ] responsive viewport
- [ ] element/block library
- [ ] component registry
- [ ] Layers/tree
- [ ] selection
- [ ] inspector
- [ ] contextual toolbar
- [ ] drag/drop
- [ ] reparent
- [ ] reorder
- [ ] duplicate
- [ ] delete
- [ ] lock/unlock
- [ ] group/ungroup, ahol a component contract engedi
- [ ] undo/redo
- [ ] transactions/batch
- [ ] responsive values
- [ ] presets/tokens
- [ ] media/asset picker
- [ ] template/section reuse
- [ ] preview
- [ ] publish
- [ ] diagnostics/debugger
- [ ] keyboard/accessibility
- [ ] mobile editor shell
- [ ] future collaboration/comments/permissions előkészítés

### Content / CMS
- [ ] structured content
- [ ] reusable content records
- [ ] optional fields
- [ ] content validation
- [ ] references
- [ ] status/lifecycle
- [ ] future localization fields
- [ ] SEO content
- [ ] alt text/accessibility content

### Schedule / Streamer
- [x] Twitch OAuth alap
- [x] Twitch schedule read/sync foundation
- [ ] Schedule CRUD
- [ ] manual + source-aware events
- [ ] Game Profiles
- [ ] media/artwork
- [ ] platform
- [ ] status
- [ ] Next Stream
- [ ] Next 3
- [ ] Weekly
- [ ] Full
- [ ] Featured
- [ ] responsive layouts
- [ ] templates
- [ ] future recurring
- [ ] future timezone/reminder/calendar/export

### Media / Assets
- [ ] canonical asset model audit
- [ ] image upload/reference
- [ ] asset metadata
- [ ] alt text
- [ ] reuse/reference
- [ ] orphan cleanup strategy
- [ ] future R2-backed storage
- [ ] transformations/optimization később
- [ ] access/security policy

### Streamer identity / social
- [ ] profile/about
- [ ] avatar/banner
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord/community
- [ ] support links
- [ ] social link management
- [ ] platform availability/status
- [ ] future platform adapters

## 00.9.6.A — CREATOR CENTER / ADMIN UX ARCHITECTURE — RÖGZÍTVE 2026-09-25

A platform felhasználóbarát működésének alapelve: **egy közös Creator Center, de nem egyetlen óriási adminoldal**.

A referencia-elemzés alapján a profi creator- és website-platformok közös mintája az, hogy a felhasználó egy központi dashboardból éri el az eszközöket, miközben a komplex szerkesztők saját, célfeladatra optimalizált munkaterületet kapnak. A Wix a Dashboardból indítja a Site Editort és külön dashboard-feladatokat csoportosít; a StreamElements pedig egy közös creator platformon belül külön Overlays/Alerts szerkesztési élményt használ. citeturn0search9turn0search11turn0search2turn0search0

### Kötelező felületi modell

```
Creator Center
│
├── 🏠 Dashboard
│
├── 🌐 Weboldal
│   ├── Oldalak
│   ├── Weboldalszerkesztő
│   ├── Megjelenés / Theme
│   ├── Navigáció
│   └── SEO
│
├── 🎮 Stream
│   ├── Twitch / platformok
│   ├── Schedule
│   └── Stream beállítások
│
├── 🎨 Overlay Studio       ← későbbi külön visual editor
│   ├── Overlays
│   ├── Alerts
│   ├── Widgets
│   └── Scenes / layoutok
│
├── 🗂️ Tartalom / Média
├── 🤖 Automatizáció
├── 📊 Analytics
├── 👥 Community
└── ⚙️ Beállítások
```

**Fontos architekturális különbség:**
- **külön adminpont / workspace:** IGEN;
- **külön canonical domain/state rendszer:** NEM;
- **külön editor runtime:** IGEN, ha az adott feladat runtime-ja indokolja;
- **párhuzamos adatmodell, command/history vagy asset rendszer:** NEM.

### Website Editor

A Weboldalszerkesztő önálló product surface lesz:
- oldalépítés;
- Layers;
- Inspector;
- responsive canvas;
- presentation/theme;
- page preview/publish;
- content/domain binding;
- website-specific onboarding és contextual help.

A felhasználónak nem kell az egész Creator Platform fogalmait ismernie ahhoz, hogy egy oldalt elkészítsen.

### Későbbi Overlay Studio

Az Overlay Studio külön adminpont és külön visual workspace lehet. Az OBS/streaming munkafolyamat más mentális modellt használ, ezért nem célszerű a Website Editor minden paneljét és funkcióját egy képernyőre kényszeríteni. Az OBS alapmodellje Scenes + Sources, míg a StreamElements overlay szerkesztése overlay + widget/alert elemekből indul; ezeket a felhasználói feladatnak megfelelően külön kezeljük. citeturn0search6turn0search7turn0search1

Az Overlay Studio azonban továbbra is ugyanazokat a canonical alapokat használja:
- Media Asset;
- Component Registry;
- Presentation/Theme Contract;
- brand tokens;
- domain/event binding;
- Command/History/Transaction;
- persistence/revision;
- site/creator scope.

### Felhasználóbarát döntések

1. **Progressive disclosure:** kezdő felhasználónak csak a szükséges funkciók látszanak; haladó funkciók fokozatosan nyithatók meg.
2. **Feladat-alapú navigáció:** „Weboldal”, „Stream”, „Overlay” és „Tartalom” legyen érthetőbb, mint technikai backend-nevek.
3. **Contextual UI:** az adott workspace csak az ahhoz tartozó eszközöket mutassa.
4. **Quick actions:** gyakori feladatok a Dashboardból egy lépésben indíthatók.
5. **Közös vizuális nyelv:** navigation, dialogs, notifications, status, permissions és help ugyanazon design systemből jöjjön.
6. **Editor isolation:** egy editor megnyitásakor a canvas kapja a fókuszt; az admin shell ne zsúfolja tele a munkaterületet.
7. **Clear return path:** minden editorból egyértelműen vissza lehet térni a Creator Centerbe.
8. **Safe destructive actions:** törlés, publish, disconnect, reset és overwrite megerősítést/undo/recovery lehetőséget kap, ahol indokolt.
9. **Beginner → Pro:** ugyanaz a rendszer használható egyszerű template-szerkesztéssel és később mélyebb szakértői vezérléssel.
10. **Mobile admin ≠ mobile editor:** a mobil adminfelület legyen használható; a komplex visual editor külön responsive editor shellt kap, és nem próbáljuk a desktop canvas teljes funkcionalitását egyetlen keskeny nézetbe beszorítani.

### Termékarchitektúra-szabály

A Creator Center **navigation shell**, nem canonical domain.

A Website Editor, Overlay Studio és későbbi editorok saját workspace/runtime lehetnek, de:
`Domain → Component → Field → Presentation → Render → Command → History → Persistence`
ugyanazon canonical szerződésláncon marad.

**Tilos:** külön „Overlay Node Model”, külön „Overlay History”, külön „Overlay Asset DB”, külön „Theme DB” vagy külön „AI Editor State” létrehozása csak azért, mert az új workspace más UI-t használ.

**Megengedett:** editor-specifikus UI state, runtime adapter és workspace layout, ha az nem veszi át a canonical domain ownershipet.

### UX Definition of Done

Minden új admin workspace esetén ellenőrizni kell:
- [ ] a creator egyértelműen tudja, mire való;
- [ ] az elsődleges feladat 1–3 logikus lépésből elindítható;
- [ ] a haladó funkciók nem terhelik a kezdő nézetet;
- [ ] van mentés/állapot-visszajelzés;
- [ ] van hibakezelés és recovery;
- [ ] van egyértelmű visszalépés;
- [ ] desktop + mobil admin használhatóság külön vizsgálandó;
- [ ] az adott workspace nem hoz létre canonical párhuzamos rendszert.

### Design system
- [ ] typography
- [ ] spacing scale
- [ ] colors
- [ ] semantic colors
- [ ] radius
- [ ] shadows
- [ ] container/layout
- [ ] responsive breakpoints
- [ ] buttons/forms/cards
- [ ] reusable components
- [ ] design presets/tokens
- [ ] theme/brand settings
- [ ] accessibility states
- [ ] dark/light strategy, ha indokolt

### Public website
- [ ] home
- [ ] about
- [ ] schedule
- [ ] community
- [ ] support
- [ ] social/platform pages
- [ ] SEO/meta
- [ ] responsive
- [ ] fast rendering
- [ ] accessible navigation
- [ ] dynamic live/next-stream state
- [ ] public published snapshot
- [ ] future localized routes

### Admin / Security
- [ ] authentication
- [ ] role/permission boundary
- [ ] session/security hardening
- [ ] CSRF/session policy where applicable
- [ ] input validation
- [ ] URL/HTML/content sanitization
- [ ] rate limits
- [ ] audit log
- [ ] secret/token isolation
- [ ] error codes
- [ ] observability without secret leakage
- [ ] destructive action confirmation/recovery
- [ ] revision/concurrency protection

### Platform foundation
- [ ] site/account ownership boundary
- [ ] future multi-tenant-ready IDs/scoping
- [ ] D1 canonical storage
- [ ] media abstraction/R2 később
- [ ] API/domain services
- [ ] public read boundaries
- [ ] migration discipline
- [ ] backup/export strategy később
- [ ] test/CI/deploy gate

## 00.9.7 — Post-1.0 global roadmap

**Nem szakítja meg az 1.0 aktív sorrendet.**

Későbbi fő szakaszok:
1. Global Localization full implementation.
2. Multi-streamer / multi-site / tenant onboarding.
3. YouTube integration.
4. Kick/egyéb platform adapters.
5. Discord/community automation.
6. VOD/Clips domain.
7. Recurring schedule + timezone + calendar/reminders.
8. Social content/export.
9. Advanced Media/R2 pipeline.
10. Analytics.
11. SEO advanced tooling.
12. Collaboration/team roles/comments.
13. Template marketplace/library.
14. Advanced design system/theme engine.
15. AI-assisted content/design/translation tools with human control.
16. Subscription/billing/package system.
17. White-label/custom domains.
18. Advanced experimentation/personalization.
19. Monitoring/usage limits/tenant isolation.
20. Public platform onboarding and documentation.

Ezek sorrendje csak az 1.0 lezárása után kerül külön MASTER aktív pontokba.

## 00.9.8 — „Ami jó, ahhoz nem nyúlunk” szabály

A jelenlegi projektben már bizonyítottan működő részeket **nem építjük újra csak azért, mert egy benchmark projekt máshogy csinálja**.

Minden E0/E1/E2 audit végén minden érintett terület kap egy döntést:
- **KEEP** — jó, canonical, nem változtatjuk.
- **IMPROVE** — jó alap, célzott javítás szükséges.
- **REFACTOR** — architekturális probléma bizonyított.
- **REPLACE** — csak akkor, ha a jelenlegi út hosszú távon hibás vagy nem tartható.

A benchmarkból származó ötlet önmagában **nem ok refaktorra**.

## 00.9.9 — Haladás láthatósága

Minden fő pontnak látható legyen:
- cél;
- aktuális al-pont;
- Definition of Done;
- kész/pending/blokkolt tételek;
- tesztbizonyíték;
- commit/HEAD;
- production állapot, ha releváns;
- következő **egyetlen** lépés.

A felhasználó számára a fejlesztés mindig ilyen láncban legyen követhető:

**TERV → AUDIT → DÖNTÉS → IMPLEMENTÁCIÓ → TESZT → LIVE → PASS → MASTER → KÖVETKEZŐ PONT**

Nem ugrunk egy másik funkcióra azért, mert közben új ötlet merült fel.


# 00 — A MASTER TERV SZABÁLYAI

## 00.1 Státuszjelölések
- `[x]` = implementálva, végigtesztelve és a felhasználó visszaigazolta.
- `[~]` = részleges, folyamatban vagy újratesztelendő.
- `[ ]` = még nincs kész.
- `[!]` = blokkoló hiba.
- `[D]` = dokumentálandó döntési pont.

**Kód jelenléte önmagában soha nem jelent `[x]` státuszt.**

## 00.2 Egyetlen MASTER terv + egyetlen aktív munkapont
Ez a projekt **egyetlen aktív MASTER tervet és pontosan egy aktív végrehajtási pontot** használ.

- Soha nincs két párhuzamos fejlesztési munkasáv.
- PC/Desktop és Mobile/Touch **nem külön munkasáv**, csak ugyanazon funkció külön tesztfelülete.
- A közös canonical State, Page Model, Command API, selection, hierarchy, history és renderer csak egyszer létezhet.
- Minden további funkció csak backlogként létezhet, amíg az aktuális aktív pont le nincs zárva.
- Új beszélgetésben kizárólag a **00/A MASTER VÉGREHAJTÁSI INDEX** alapján szabad folytatni.
- Régi fejezetekben található `[~]`, `[ ]` vagy régebbi „következő lépés” szöveg nem aktiválható önállóan.

**KÖTELEZŐ ÁLLAPOTMENTÉS MINDEN LÉPÉS UTÁN:** minden fejlesztési, javítási, tesztelési vagy döntési lépés lezárásakor frissíteni kell ezt a MASTER fájlt. Az indexnek mindig az utolsó ténylegesen lezárt lépést és az egyetlen következő aktív pontot kell mutatnia.

## 00.2a Platformfelületek: fejlesztés közös, tesztelés felületenként
A fejlesztés során az Editor v2-t **PC/Desktop és Mobile/Touch felületre is fejlesztjük**, de ezek nem külön fejlesztési ágak. Ugyanazt a canonical funkciót, State-et, Page Modelt, Command API-t, History-t és Renderert használják.

**Kötelező visszatérési szabály a teszteknél:**
- Ha egy funkciót valamelyik élő tesztben csak mobilon ellenőriztünk, az attól még **nem tekinthető PC/Desktop oldalon teljesen teszteltnek**.
- Az ilyen pontokat a MASTER-ben **PC/Desktop live test PENDING / visszatérő tesztként** kell megőrizni.
- Később, amikor a felhasználó PC/Desktop tesztet kér, az összes korábban csak mobilon ellenőrzött releváns funkcióhoz vissza kell térni.
- Ez **nem nyit új fejlesztési ágat**: a PC/Desktop ellenőrzés ugyanazon lezárt funkció utólagos tesztkapuja.
- Egy funkció csak akkor jelölhető teljes platformtesztként lezártnak, ha a szükséges PC/Desktop, tablet és mobile ellenőrzési státusza egyértelműen dokumentált.
- A PC/Desktop live teszt továbbra sem indul automatikusan; csak a felhasználó külön kérésére.

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

## 00.4a Folyamatos funkcióbővítés
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

## 00.4b — GLOBAL LOCALIZATION-READY ALAP — 1.0 ELŐTT KÖTELEZŐ

A platform hosszú távú célja globálisan használható streamer platform, ezért a teljes többnyelvű rendszer nem kerül 1.0 előtt teljes implementálásra, de az 1.0-ig elkészülő architektúra kötelezően localization-ready lesz.

**1.0 scope döntés:**
- [x] 1.0 elsődleges és teljesen támogatott tartalmi nyelve: **magyar (hu-HU)**.
- [ ] 1.0 előtt teljes többnyelvű UI/content rendszer implementációja: **nem cél**.
- [ ] 1.0 előtt minden nyelvhez teljes fordítás: **nem cél**.
- [x] 1.0 előtt tilos olyan Page Model, routing, D1 schema, editor, renderer vagy domain contract döntést hozni, amely később szükségtelen újraépítést kényszerítene ki a lokalizáció miatt.

**Kötelező alapok 1.0 előtt:**
- locale fogalom és canonical locale azonosításának szerződése;
- platform UI stringek és streamer által létrehozott tartalom szétválasztásának architekturális szabálya;
- Page Model localization-safe kialakítása;
- domain adatok és lokalizálható megjelenítési szövegek szétválasztása;
- Schedule és egyéb dinamikus domain adatok localization-safe modellje;
- locale-aware dátum/idő/szám megjelenítésre előkészített adatfolyam;- fallback stratégia helyének és működési szerződésének meghatározása;
- localized routing/SEO későbbi bevezethetőségének biztosítása;
- Unicode és RTL kompatibilitás megőrzése;
- Editor és renderer úgy épüljön, hogy a lokalizáció később ne igényeljen második editort, renderert, Page Modelt vagy command rendszert;
- migration strategy a későbbi locale-bővítéshez.

**Fontos:** 1.0 előtt csak a szükséges **alap/szerződés** készül el. Nem készítünk félkész HU/EN rendszert, nem másoljuk le az oldalakat nyelvenként, és nem vezetünk be párhuzamos lokalizációs adatutat.

**1.0 után külön fő szakasz:** Global Localization Architecture & Implementation.
Ennek teljes auditja és implementációja külön MASTER munkapont lesz, többek között: locale registry, region/language kezelés, fallback, platform UI localization, Page/content localization, component/editor localization, dynamic data localization, localized routing/SEO, translation state/versioning, per-locale publish, missing-translation detection, locale-aware formatting, RTL, localization testing és későbbi AI-assisted translation/human review workflow.

**Definition of Done az 1.0 előtti alaphoz:**
- a fenti localization-safe szerződések auditálva és a MASTER-ben rögzítve;
- a meglévő canonical Page Model, D1, routing, renderer, Editor v2 és domain modellek nem akadályozzák a későbbi többnyelvűséget;
- ahol szükséges, minimális foundation módosítás készül és tesztelve van;
- tényleges többnyelvű UI/content csak a külön 1.0 utáni szakaszban indul.
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

## 00.8 — PROFI WEBENGINEERING / EDITOR-ENGINEERING ALAPELV — KÖTELEZŐ
A projektet nem „kódolási feladatként”, hanem professzionális, hosszú távon karbantartható webplatform és vizuális webszerkesztő fejlesztéseként kezeljük. A gondolkodási sorrend mindig: probléma → követelmény → architektúra → adatfolyam → állapot → biztonság → implementáció → automatizált teszt → élő teszt → regresszió → felhasználói visszaigazolás.

Kötelező szakmai szabályok:
- Gyökérok, nem tünet: hibát nem CSS-/JS-patcheléssel fedünk el. Először a valódi gyökérokot keressük az UI → state → command → validation → Page Model → persistence/API → D1 → renderer teljes láncában.
- Egyetlen canonical megoldás: ugyanarra a feladatra nem maradhat párhuzamos, egymást részben helyettesítő kódút. A régi utat auditáljuk, leválasztjuk/archiváljuk, és egyértelmű canonical utat jelölünk ki.
- Audit megelőzi a kódolást: jelentősebb funkció előtt kötelező az érintett fájlok, API-k, adatmodell, állapotátmenetek, meglévő tesztek és legacy rétegek teljes auditja.
- Minimális, de helyes módosítás: nem a legkevesebb kódsor a cél, hanem a legkisebb architekturálisan helyes, tesztelhető és bővíthető változtatás. Ha az alap rossz, előbb refaktorálunk.
- Szerződésalapú fejlesztés: minden domainhez és komponenshez egyértelmű input/output, schema, validation, ownership és lifecycle tartozik. A kliens nem írhatja felül a szerver üzleti szabályait.
- Egyértelmű adat-tulajdonos: minden adatnak pontosan egy canonical source of truth-ja legyen. Cache, preview, derived state és UI state nem válhat véletlenül elsődleges adattárolóvá.
- Perzisztencia és concurrency első osztályú: save, publish, rollback, revision, expectedVersion, audit és hibatűrés a funkció része, nem utólagos extra.
- Security by design: auth, authorization, secret/token kezelés, input validation, URL/HTML sanitization, session/CSRF szempontok, rate limit és abuse protection már tervezéskor szerepel.
- Accessibility by design: billentyűzet, fókusz, kontraszt, szemantikus vezérlők, érthető állapotjelzés, touch célméret és reduced-motion szempontok a funkció részei.
- Responsive by architecture: Desktop, tablet és mobile ugyanazt a canonical rendszert használja. Nem készül külön mobil üzleti logika.
- Performance by default: kerüljük a felesleges újrarenderelést, N+1 lekérést, memóriaszivárgást és indokolatlan hálózati terhelést.
- Megfigyelhetőség: hibákhoz stabil diagnosztikai kód, reprodukálható logika és értelmezhető állapot szükséges. A „nem működik” nem elfogadható diagnosztikai állapot.
- Teszt bizonyíték, nem dísz: unit/contract/integration/live/E2E tesztet az adott kockázat alapján választunk. A kód jelenléte vagy egy zöld unit teszt önmagában nem PASS.
- UX és technikai minőség együtt: egy funkció akkor kész, ha működik, érthető, olvasható, kiszámítható, hibakezelhető és profi használatra alkalmas.
- Benchmarkból tanulunk, nem másolunk: ismert editorokból mintát veszünk, de a saját domainhez és architektúrához igazítjuk.
- Nem overengineerelünk: új absztrakció, tábla, service, cache vagy dependency csak bizonyítható felelősséggel és haszonnal kerül be.
- Visszafelé kompatibilitás tudatos: meglévő adatok és dokumentumok esetén migráció/normalizálás/rollback stratégia nélkül nem törünk szerződést.
- Minden döntés dokumentált: elutasított irányt és okát a MASTER-ben rögzítjük, hogy új beszélgetésben ne térjünk vissza ugyanahhoz a hibás párhuzamos úthoz.
- Nincs bizonytalan PASS: ha egy kapu hibás, részleges vagy nem ellenőrzött, marad [~]/[!]. Nem nevezünk késznek valamit csak azért, hogy haladhassunk.

### 00.8b — GITHUB ↔ VS CODE / LOCAL WORKTREE SZINKRONIZÁCIÓ — KÖTELEZŐ

A projektben a GitHub repository és a Cloudflare deployhoz használt lokális VS Code munkakönyvtár állapota nem térhet el észrevétlenül. A 2026-09-24-i C.5.1 live route ellenőrzés során bizonyítást nyert, hogy a GitHub `v2/foundation` ágon a C.5 admin Twitch Schedule sync route már létezett, miközben a lokális munkakönyvtárból az `src/routes/admin/twitch-schedule-sync.ts` fájl és az `src/index.ts` route-bekötés hiányzott. Emiatt egy sikeres Cloudflare deploy egy régebbi lokális állapotot tett live-ba, amely a route-ra 404-et adott.

**Rögzített canonical fejlesztési szabály:**
- [x] GitHub `v2/foundation` a repository referenciaállapota.
- [x] A VS Code lokális munkakönyvtár a fejlesztési/deploy forrás, ezért annak GitHub branch állapotával szinkronban kell lennie.
- [x] GitHub webes módosítás után a lokális munkakönyvtárat tudatosan Sync/Pull művelettel kell frissíteni, mielőtt további lokális módosítás vagy deploy történik.
- [x] Lokális módosítás után a GitHub branchre Commit + Push szükséges, mielőtt a GitHub állapotot tekintenénk kész/canonical változatnak.
- [x] Cloudflare deploy csak az ellenőrzött, szinkronizált lokális állapotból történhet.
- [x] Automatikus háttérben futó pull/sync nem kötelező és nem kívánatos, mert helyi, még nem mentett munkát felülírhatna; a szinkronizálás legyen explicit és ellenőrizhető.
- [ ] A felhasználó gépén a Git CLI / VS Code Git integráció tényleges beállítása és ellenőrzése még hátra van.
- [ ] A GitHub ↔ VS Code → CI → Cloudflare teljes szinkronizált munkafolyamatát lépésenként kell beállítani és végigtesztelni.

**Kötelező ellenőrzési szabály minden deploy előtt:**
1. lokális branch/HEAD azonosítása;
2. lokális módosítások ellenőrzése;
3. GitHub branch aktuális állapotának ellenőrzése;
4. eltérés esetén Sync/Pull vagy Commit/Push rendezése;
5. typecheck + érintett tesztek;
6. csak ezután Cloudflare deploy;
7. live API ellenőrzés;
8. MASTER frissítése.

**Szigorú tiltás:** GitHub weben létrehozott/javított fájlt nem tekintünk automatikusan lokálisan jelen lévőnek. A lokális fájlrendszer és a GitHub branch közötti eltérést minden deploy előtt ellenőrizni kell.

### 00.8a — Profi fejlesztési döntési sorrend
1. Követelmény és Definition of Done pontosítása.
2. Teljes érintett kód- és adatfolyam-audit.
3. Canonical ownership és szerződések rögzítése.
4. Security, data integrity, concurrency, performance, accessibility, responsive és migration kockázatok felmérése.
5. Implementációs terv a legkisebb helyes változtatással.
6. Implementáció után az érintett fájlak visszaolvasása és diff/audit.
7. Automatizált tesztek.
8. Élő API/D1/Editor/Public teszt, ahol releváns.
9. Regresszió és diagnosztika.
10. Felhasználói ellenőrzés.
11. MASTER frissítés még a következő fejlesztési lépés előtt.

Szigorú tiltás: gyors patch, második renderer, külön mobil hack, legacy UI visszafoltozása vagy szerződés nélküli kódolás csak akkor megengedett, ha az audit bizonyítja, hogy az adott megoldás valóban canonical és architekturálisan indokolt.


# 00/A — MASTER VÉGREHAJTÁSI INDEX — EZ AZ EGYETLEN AKTÍV VÉGREHAJTÁSI FORRÁS

> **BOOT / ABSZOLÚT SZABÁLY:** A dokumentum teljes tartalmából kizárólag ez a blokk határozza meg, hogy mit szabad végrehajtani. Más fejezetben szereplő `[ ]`, `[~]`, „következő pont”, „aktív”, „pending” vagy hasonló történeti szöveg **nem végrehajtási utasítás**. A történeti részeket nem szabad újra megnyitni.

## 00/A.1 — EGYETLEN AKTÍV PONT

**ACTIVE_POINT_ID:** `E5`  
**ACTIVE_POINT_STATUS:** `ACTIVE`  
**ACTIVE_POINT_TITLE:** Regression + D1/live verification + user PASS  
**PREVIOUS_GATE:** `E4.4` — CLOSED / PASS  
**NEXT_GATE:** `E6` — csak E5 teljes PASS után nyitható  
**PARALLEL_WORKSTREAMS:** `0`

### Jelenlegi igazolt állapot
- [x] E4.3.1–E4.3.8 lezárva.
- [x] E4.4.1 final migration design + SQL audit lezárva.
- [x] E4.4.2 implementation/dry-run/remote schema verification lezárva.
- [x] Production `site_id NOT NULL` schema/integrity/ownership ellenőrzés PASS.
- [x] Live Worker/public API smoke PASS.
- [x] E4.4 teljes DoD PASS.
- [ ] E5 teljes regression/live/user PASS még nincs lezárva.
- [ ] E6 closure még nincs megnyitva.

**Következő végrehajtható pont: kizárólag E5.**

## 00/A.2 — E5 HIVATALOS DEFINITION OF DONE

E5 nem új feature-fejlesztési szakasz. **E5 célja a már elkészült E4 foundation bizonyítása, regressziómentesítése és felhasználói elfogadása.** E5 alatt nem kezdünk Schedule Buildert, új Editor-funkciót, template-rendszert vagy más későbbi feature-t.

### E5.1 — Repository / branch / baseline verification
- [ ] GitHub `v2/foundation` és lokális worktree állapot összevetése.
- [ ] Aktuális HEAD és MASTER verzió rögzítése.
- [ ] Working tree / nem kívánt módosítások ellenőrzése.
- [ ] A lezárt E4.3/E4.4 állapot bizonyítékainak ellenőrzése.

### E5.2 — Automated regression gate
- [ ] Typecheck PASS.
- [ ] Editor Core teszt PASS.
- [ ] Schedule teszt PASS.
- [ ] Domain contract teszt PASS.
- [ ] Site-ownership contract teszt PASS.
- [ ] Twitch integration/security regression tesztek PASS, ahol a repository aktuális CI-je ezt előírja.
- [ ] Nincs új teszt-regresszió.

### E5.3 — D1 production integrity gate
- [ ] Production D1 migration state ellenőrzése.
- [ ] `PRAGMA quick_check` PASS.
- [ ] `PRAGMA foreign_key_check` PASS / üres eredmény.
- [ ] Mind a hat E4.4 érintett táblán `site_id NOT NULL` ellenőrzése.
- [ ] NULL ownership count = 0 minden érintett táblán.
- [ ] Row-count / ownership invariánsok ellenőrzése.
- [ ] Published revision linkage ellenőrzése.
- [ ] Index/FK/schema invariánsok ellenőrzése.
- [ ] A verification csak read-only módon történjen, kivéve ha egy külön, előzetesen jóváhagyott tesztadat szükséges.

### E5.4 — Live application / public verification
- [ ] Worker health PASS.
- [ ] Public pages list PASS.
- [ ] Valid page lookup PASS.
- [ ] Invalid page lookup → megfelelő `PAGE_NOT_FOUND` / 404 contract PASS.
- [ ] Public published snapshot helyes.
- [ ] Admin/editor alap Save/Publish/Unpublish/Rollback regresszió ellenőrizve, ahol a jelenlegi live contract releváns.
- [ ] Schedule public read alap regresszió ellenőrizve.
- [ ] Nincs cross-site adat-hozzáférés a canonical site-scoped útvonalakon.
- [ ] Nincs secret/token leakage.

### E5.5 — User acceptance gate
- [ ] A szükséges live ellenőrzéseket a felhasználó elvégzi.
- [ ] A felhasználói eredmény egyértelműen `PASS / MŰKÖDIK`.
- [ ] Hiba esetén E5 nem zárható le: gyökérok-audit → minimális javítás → teljes érintett regresszió → új live ellenőrzés.

### E5.6 — E5 closure
E5 csak akkor állítható `CLOSED` állapotba, ha **minden E5.1–E5.5 kötelező pont PASS**, a bizonyítékok rögzítve vannak, a felhasználói PASS megtörtént, és a MASTER frissítve lett.

### E5.4 ellenőrzési bizonyíték — 2026-10-07

Az E5.4 live verification eddig ellenőrzött részei:

- [x] Worker health: HTTP 200, `ok:true`, service `sanci9517-streamer-brand`, version `2.0.0`.
- [x] Public root: HTTP 200, `lang="hu"`.
- [x] Canonical public page `/p/about`: HTTP 200.
- [x] Public pages list: HTTP 200, `ok:true`.
- [x] Valid page lookup: `/api/public/pages?slug=home` → HTTP 200.
- [x] Invalid page lookup: `/api/public/pages?slug=this-page-must-not-exist` → `PAGE_NOT_FOUND` / 404 contract.
- [x] Published public snapshot: `/api/public/pages?slug=about` → HTTP 200, canonical page payload.
- [x] Public Schedule read: `/api/public/schedule` → HTTP 200, current public result `[]`.
- [x] Unauthenticated `/api/admin/pages` → HTTP 401.
- [x] Unauthenticated `/api/admin/editor` → HTTP 401.
- [x] Public Pages route uses canonical `siteId` and SQL `WHERE site_id=?` for list and slug lookup.
- [x] Public Schedule route obtains canonical `siteId` and passes it into the public schedule reader.
- [x] Public route secret/token scan: no matches for `token`, `access_token`, `refresh_token`, `client_secret`, `authorization`, `oauth`.
- [x] `wrangler deploy --dry-run`: PASS; 76 assets read, DB/ASSETS bindings resolved, no deployment performed.

**E5.4 live admin/editor regression — 2026-10-08 — PASS**
- [x] Hitelesített admin session létrejött a live Workeren.
- [x] Editor v2 Főoldal (page-home) betöltve.
- [x] **Save:** változtatás nélküli mentés sikeresen lefutott.
- [x] **Publish:** publikálás sikeresen lefutott.
- [x] **Unpublish:** publikálás visszavonása sikeresen lefutott.
- [x] **Rollback:** korábbi revision kiválasztása és visszaállítása sikeresen lefutott.
- [x] A teljes live Save → Publish → Unpublish → Rollback regressziós lánc felhasználói böngészős ellenőrzéssel PASS.
- [x] E5.4 összes kötelező live/public/security ellenőrzési eleme PASS.

**E5.4 állapot:** **PASS / teljesítve**. E5.4 lezárásához már csak az E5.5 explicit felhasználói acceptance gate szükséges; E5 ettől még nem CLOSED.

## 00/A.3 — SZIGORÚ SORREND E5 UTÁN

**Nem:** E5 → közvetlenül Editor.

**Hivatalos sorrend:**

`E5 → E6 → F → G → H → I → J → Early Public Website → további 1.0 munkák → 1.0 Production Gate`

- **E6:** MASTER closure / E-szakasz lezárása.
- **F:** Schedule CRUD + Inspector / domain-driven Editor bővítés.
- **G:** templates / presentation / design-system bővítések.
- **H:** preview / public integration.
- **I:** teljes E2E integráció.
- **J:** legacy cleanup.
- Ezután következnek az Early Public Website és a további 1.0 production munkák.

A későbbi DoD-ket csak az adott kapu megnyitásakor aktiváljuk; **nem nyitunk előre több aktív pontot**.

## 00/A.4 — DUPLIKÁCIÓ ELLENI REGISZTER

### Lezárt, nem újranyitható fő kapuk
- `E4.1` — CLOSED
- `E4.2` — CLOSED
- `E4.3.1` — CLOSED
- `E4.3.2` — CLOSED
- `E4.3.3` — CLOSED
- `E4.3.4` — CLOSED
- `E4.3.5` — CLOSED
- `E4.3.6` — CLOSED
- `E4.3.7` — CLOSED
- `E4.3.8` — CLOSED
- `E4.4.1` — CLOSED
- `E4.4.2` — CLOSED

**Újranyitási szabály:** `CLOSED` pontot későbbi munka miatt sem nyitunk vissza. Ha ugyanazon területen új munka szükséges, új, egyedi azonosítójú pontot kap, és az új pont explicit módon hivatkozik a lezárt pontra.

**Duplikációs ellenőrzés minden új munka előtt:**
1. ACTIVE_POINT_ID ellenőrzése;
2. CLOSED regiszter ellenőrzése;
3. annak ellenőrzése, hogy ugyanaz a feature/DoD már nem szerepel-e lezártként;
4. ha igen, nem implementáljuk újra;
5. valódi új követelmény esetén új pontazonosító;
6. csak ezután audit vagy kódolás.

## 00/A.5 — TÖRTÉNETI RÉSZEK VÉDELME

A MASTER történeti fejezetei megmaradnak teljes auditnyomként, de:
- nem nyithatnak új munkapontot;
- nem írhatják felül az ACTIVE_POINT_ID-t;
- nem írhatják felül a CLOSED regisztert;
- régi „Következő pont” mondatuk történeti információ;
- régi `[ ]` / `[~]` státuszuk nem jelenti azt, hogy a pont még fejlesztendő;
- régi hibaleírás csak történeti bizonyíték, ha a későbbi lezárás bizonyítja, hogy megoldódott.

**Történeti audit és jelenlegi végrehajtás két külön fogalom.**

## 00/A.6 — MASTER CHECKPOINT FORMÁTUM

Minden aktív pontnál kötelező:

`ACTIVE_POINT_ID → STATUS → DOD → EVIDENCE → USER_PASS → CLOSED → NEXT_POINT`

Egy pont nem válik CLOSED állapotúvá pusztán attól, hogy a kód elkészült.

## 00/A.7 — ÚJ BESZÉLGETÉS BOOT

1. `00/A.1 — EGYETLEN AKTÍV PONT`
2. `00/A.2 — az aktív pont DoD-ja`
3. `00/A.4 — lezárt pontok regisztere`
4. csak ezután a történeti fejezetek, ha szükséges.

**Egyetlen aktuális folytatási mondat:**

> „Folytassuk a Sanci9517 MASTER tervet az **E5** pontnál. E4.1–E4.4 lezárva. Először az E5 aktuális DoD szerinti első ellenőrzést végezzük el. Más történeti fejezetet nem aktiválunk.”

---

# 00/H — TÖRTÉNETI MASTER / ARCHIVÁLT E-FEJEZETEK

> **ARCHIVE LOCK:** Az alábbi blokk a korábbi fejlesztési történetet és bizonyítékokat őrzi. **NEM AKTÍV.** Semmilyen benne lévő „következő pont”, `[ ]`, `[~]` vagy régi checkpoint nem nyithat új munkasávot. A jelenlegi végrehajtási állapotot kizárólag a 00/A index adja.

# 00/A — MASTER VÉGREHAJTÁSI INDEX — EZ AZ EGYETLEN AKTÍV SORREND

> **KÖTELEZŐ:** A dokumentum bármely más fejezetében szereplő `[ ]`, `[~]` vagy régebbi „következő lépés” szöveg **történeti dokumentáció vagy backlog**, és **nem végrehajtási utasítás**. Az egyetlen végrehajtási forrás az alábbi index **EGYETLEN AKTÍV PONT** sora. A történeti fejezetek státuszai nem írhatják felül az indexet, és nem nyithatnak új munkasávot.

### Kész, lezárt fő blokkok
- [x] **40.69.4 — Revision conflict második gyökérok + LIVE Save/Publish regresszió**
- [x] **40.62–40.63 — Canonical standard oldalak + dinamikus publikus menü**
- [x] **40.64–40.66 — Oldal slug/meta lifecycle**
- [x] **40.67 — Canonikus oldalsorrend: Editor = publikus menü**
- [x] **40.68 — Draft / Preview / Publish hardening**
  - [x] Draft mentés
  - [x] Preview
  - [x] Publish → LIVE
  - [x] Published snapshot / publikus route
  - [x] Unpublish
  - [x] Draft megmaradás
  - [x] Republish
  - [x] Invalid Page Model publish-védelem
  - [x] Publish/Unpublish audit
  - [x] Mobil UI regresszió
  - [x] Diagnosztika 0 hiba
  - [x] Core CI 24/24

### 🔵 EGYETLEN AKTÍV PONT
**40.69.13 — Twitch-integrációs alap + Schedule/Adásrend újratervezés**

**Státusz:** [~] AKTÍV — **Twitch/C.5.1, E4.1, E4.2 és E4.3.1–E4.3.8 lezárva; E4.3 ownership/hardening és D1 readiness/live DoD PASS.** A következő egyetlen munkapont: **40.69.13.E4.4.1 — `site_id NOT NULL` schema hardening: final migration design + exact table-rebuild SQL audit**. Az E4.3.8 live deployment, publikus HTML/renderer, `home`/`about` API és felhasználói böngészős ellenőrzése PASS. Az E4.4 migration továbbra is csak a teljes E4.4 DoD szerinti kontrollált table-rebuild + post-migration verification után tekinthető lezártnak.

**Szigorú haladási szabály 2026-10-07-től:** az E4.3.1–E4.3.4 lezárult, ezért nem nyitunk vissza korábbi Twitch ownership-munkasávot. A következő sorrend szigorúan: **E4.3.5–E4.3.8 canonical szerződés + DoD → E4.4 NOT NULL/schema hardening → E5 regression/live gate → F Schedule CRUD + Inspector → G templates/presentation → H preview/public integration → I teljes E2E → J legacy cleanup**. Új ötlet vagy későbbi funkció csak backlogként kerülhet be, és nem szakíthatja meg az aktív pont.

### 40.69.13.E — GLOBAL-GRADE DOMAIN + VISUAL EDITOR ARCHITECTURE AUDIT — 2026-09-25

**Új döntés:** az E pontot kibővítjük a korábban külön kezelt Game Profile/Media auditból egy teljes, de szigorúan fókuszált **domain + visual editor architecture gate**-té. Ennek oka, hogy a Schedule Builder/Inspector és a későbbi globális streamer-platform csak akkor építhető stabilan, ha előtte a tárolt adat, az opcionális megjelenés, a média, a localization-safe tartalom és az Editor state/command/renderer modell egyetlen canonical rendszerben kapcsolódik.

**Benchmark irány — nem másolás, célzott referenciaelemzés:**
- [D] **Puck:** component registry, field-driven Inspector, component data/config, render boundary, ownership és extensibility.
- [D] **Craft.js:** node tree, selection, hierarchy, drag/drop, connectors, serialization és editor state.
- [D] **GrapesJS:** component/block model, Style Manager, Layer Manager, Asset Manager, commands és storage.
- [D] **Builder Visual Editor:** live visual editing, layers/X-Ray, responsive breakpoints, reusable templates/symbols, locale picker és preview workflow.
- [D] **Framer:** responsive canvas, CMS-driven templates, reusable components, drafts/publish, conditional visibility és localization.
- [D] **Webflow:** CMS + visual design + localization; különösen a locale-inheritance/override modell.
- [D] **Sanity:** structured content + visual editing + click-to-edit + draft/published perspective + localization.
- [D] További releváns nyílt forrású projektek csak akkor kerülnek be, ha egy konkrét architekturális kérdésre jobb bizonyítékot adnak.

**E Definition of Done:**
- [ ] A jelenlegi teljes Editor v2 architektúra és érintett domain/data flow auditálva.
- [ ] Puck/Craft.js/GrapesJS és a kiválasztott profi rendszerek releváns mintái dokumentálva, forrással és saját projektbeli alkalmazhatósággal.
- [ ] Canonical döntés rögzítve a document/node tree, selection, hierarchy, command, history, transaction, inspector/property registry, renderer és persistence határaira.
- [ ] Schedule/Game/Media domain canonical ownership rögzítve.
- [ ] Game Profile nem csak név/kép rekord: identity, slug, platform mappings, media references, opcionális brand/presentation metadata és lifecycle szükségessége auditálva.
- [ ] Schedule Event minden ésszerűen opcionális mezője explicit contractban kezelhető; hiányzó adat nem generálhat hibás/üres UI-t.
- [ ] A tartalom és a megjelenés szétválasztása rögzítve: domain data ≠ presentation/template ≠ editor UI state.
- [ ] Látható mezők, template, layout, media, typography, spacing, visibility és egyéb megjelenési tulajdonságok későbbi szerkeszthetőségének canonical modellje rögzítve.
- [ ] Media/asset kapcsolat meglévő rendszerhez igazítva; második asset/media rendszer nem hozható létre.
- [ ] Localization-ready alap rögzítve: hu-HU az 1.0 elsődleges nyelve, későbbi locale-bővítéshez nincs szükség második editorra/rendererre/Page Modelre.
- [ ] Responsive, accessibility, security, performance és concurrency követelmények az Editor/domain contract részei.
- [ ] 1.0 scope és post-1.0 global backlog szétválasztva.
- [ ] Csak az audit eredménye után indulhat implementáció; az E alatt nincs Schedule Inspector UI fejlesztés.

### E0 — teljes jelenlegi repo / Visual Editor / domain audit — PASS — 2026-09-25
**Státusz:** [x] AUDIT PASS. Kódot ebben az al-lépésben nem módosítottunk.

**Auditált rétegek:**
- [x] Repository structure: src/core, src/routes, migrations, public/editor-v2/core, public/editor-v2/ui, editor tests és Cloudflare/D1 entrypoints.
- [x] Page Model: src/core/page-model.ts szerveroldali legacy-normalizációs boundary; public/editor-v2/core/schema.js a browser oldali canonical sanci-page-document v1 modell.
- [x] Node tree/hierarchy: rootId + nodes map + parentId + children invariáns; hierarchy validation és command-level rollback működik.
- [x] Selection/state: egy editor state tartalmazza selection, viewport, history, persistence, recovery, UI és runtime állapotot.
- [x] Command engine: mutationok központi commands.js útvonalon, validation + history + transaction/batch + locked-node védelemmel.
- [x] History/transactions: undo/redo, transaction és atomic batch egy közös history modellen.
- [x] Responsive: desktop/tablet/mobile inheritance/override/reset contract létezik.
- [x] Property Registry: extensible registry létezik, de az aktuális app.js Inspector még nem használja közvetlenül; jelenleg kézi Inspector-renderelés működik. Ez E2 architekturális döntési/IMPROVE tétel, nem indokolt most párhuzamos registryt létrehozni.
- [x] Canvas/render boundary: Page Model az editor source of truth, de a jelenlegi canvas renderer még foundation/preview jellegű: a node-ok általános DOM konténerekként jelennek meg, speciális render jelenleg főleg Rich Text/Schedule esetén van. A valódi component registry → render boundary → public renderer E2/E3 alatt szükséges.
- [x] Schedule: a schedule node konfigurációja külön Page Model contract; a domain rekordok D1-ben maradnak.
- [x] Persistence/revision: pages.content_json = draft/canonical document, editor_revisions = immutable revision snapshots, published_content_json + published_revision_id = live published snapshot/linkage; expectedVersion concurrency guard működik.
- [x] Public boundary: public page route published snapshotot olvas, preview explicit auth után draftot; Schedule public read külön DTO-ban nem szivárogtat source/sync mezőket.
- [x] Auth/security/audit: auth role boundary, session lookup, audit statement és publish validation meglévő canonical réteg.
- [x] Feature preservation: a korábbi 19–34 roadmap teljes funkciótérképe megmarad; az E pont csak az 1.0/post-1.0 besorolást és a megvalósítás sorrendjét rendezi, funkciót nem töröl.

**E0 fő architekturális megállapítások:**
1. A meglévő Core alap jó és megtartandó: KEEP schema/state/commands/validation/history/transactions/responsive/revision/concurrency/Twitch Schedule boundary.
2. Az Inspector jelenlegi kézi UI-rétege és a Property Registry között nincs még teljes canonical bekötés: IMPROVE, nem REPLACE.
3. A Canvas jelenleg nem végleges component renderer: IMPROVE/EXPAND szükséges egy valódi component registry + render boundary felé.
4. A domain/presentation/editor-state szétválasztás megfelelő irány, ezt meg kell őrizni.
5. A szerveroldali normalizeEditorDocument() nem második editor; migration/compatibility boundaryként kezelendő.
6. A published_content_json/published_revision_id modell jó alap; a public renderernek erre a published snapshotra kell épülnie, nem a draft UI state-re.
7. A jelenlegi Schedule rendszerhez nem nyúlunk vissza; C.5.1 lezárva.

**E0 döntés:** nincs bizonyíték teljes Core újraírására. A következő lépés célzott benchmark és az E2 saját canonical architecture decision előkészítése.

**E0 tesztbizonyíték / állapot:**
- [x] Legutóbbi felhasználó által visszaigazolt local typecheck PASS.
- [x] Schedule regression 9/9 PASS.
- [x] Editor Core regression 30/30 PASS.
- [x] GitHub Actions #104 Twitch Integration SUCCESS.
- [x] GitHub Actions #728 Editor Core SUCCESS.
- [x] Production C.5.1 gate PASS.
- [x] E0 audit repository/current branch v2/foundation állapotára készült.

**Következő egyetlen aktív al-pont:** **40.69.13.E1 — célzott Puck/Craft.js/GrapesJS + profi Visual Editor benchmark/source-code audit.**

### Public Design Freedom — 1.0 követelmény — RÖGZÍTVE — 2026-09-25

- [x] Az 1.0 célja nem egyetlen fix Sanci9517 design.
- [x] A public site megjelenése site/user szinten egyedivé tehető.
- [x] A design/theme nem hardcoded page CSS-ként, hanem canonical presentation/theme rétegként kezelendő.
- [x] Admin-friendly preset → advanced customization útvonal szükséges.
- [x] A vizuálisan szerkeszthető területek közé tartozik a brand, typography, colors, spacing, layout, backgrounds, cards, buttons, navigation, header/footer, imagery, responsive behavior és component-level presentation.
- [x] A template nem zárja be a felhasználót; template-ből indulhat, majd saját designná alakíthatja.
- [x] Multi-user esetén a design konfiguráció site/tenant scoped.
- [x] A public renderer kizárólag az adott site published presentation + content + domain data állapotából renderel.
- [x] Az E1/E2 során külön canonical **Presentation/Theme Contract** készül; külön párhuzamos styling rendszer nem hozható létre.

**Következmény:** a későbbi Visual Editor nem pusztán elemek elhelyezésére szolgál. A cél egy olyan user-friendly admin/editor, ahol a felhasználó a saját publikus oldalának teljes vizuális identitását és komponensmegjelenését is kialakíthatja, miközben a technikai CSS és platform-komplexitás el van rejtve.

### E1 — célzott benchmark / source-code audit — [~] FOLYAMATBAN — 2026-09-25

**Első benchmark kör lezárva:** Puck, Craft.js, GrapesJS, Builder, Framer, Webflow és Sanity releváns nyilvános működése és a nyílt forrású projektek releváns forráskód-részletei ellenőrizve.

**Rögzített benchmark megfigyelések:**
- [x] **Puck:** a component config, fields, render boundary, defaultProps és a központi store/history/nodes/permissions szeparáció erős referencia arra, hogy a component registry és Inspector-konfiguráció egyértelmű szerződésből származzon. A saját rendszerben ezt a Property Registry + Component Registry + Render Contract irányába alkalmazzuk, nem Puck-adatmodellt másolunk. citeturn2search0turn2search4
- [x] **Craft.js:** a node tree, editor state, serialization/deserialization és history-kezelés megerősíti a saját canonical node-tree/state irány helyességét. A saját Page Model marad a canonical storage shape. citeturn2search1turn2search3
- [x] **GrapesJS:** a Component modell külön kezeli a children/selection/layer/toolbar/styling/commands jellegű felelősségeket; a Component collection és command-réteg jó referencia a saját component registry + hierarchy + command boundary kialakításához. citeturn2search2turn2search8turn2search9
- [x] **Builder:** a live iframe preview, Blocks/Templates/Symbols, Layers/X-Ray, responsive device preview, history/comments minták alapján a későbbi Preview/Visual Editing rétegnek a valós public renderhez kell közel lennie, nem egy külön „fake canvas” világhoz. citeturn3search16
- [x] **Framer:** a Page/CMS Page különválasztás, responsive layout, draft/publish és locale workflow megerősíti a domain content és visual presentation szétválasztását. A localizationben page/content/component/metadata/alt text és locale path is kezelhető. citeturn4search3turn4search6turn4search9
- [x] **Webflow:** a secondary locale primary locale-ból örököl, majd field/style/asset/visibility szinten felülírható; a dokumentált modellben a struktúra a primary locale tulajdona. Ez fontos referencia a jövőbeli localization inheritance modellhez. citeturn3search3turn3search13
- [x] **Sanity:** a Presentation Tool iframe-ben futó frontend preview, secure draft mode, published/draft perspective, click-to-edit overlays és page-building modellje erős referencia a saját Draft/Preview/Public boundary és későbbi visual editing összekötéséhez. citeturn3search0turn3search1turn3search11

**E1 aktuális architekturális következtetés:**
1. Nem indokolt a meglévő canonical Core lecserélése.
2. A következő canonical rétegnek egy **Component Registry → Property/Field Registry → Render Contract → Command Contract** láncot kell adnia.
3. A Canvas és a Public Renderer közös render-contract felé kell közeledjen; a mostani editor preview renderer foundation maradhat, de nem lehet végleges külön világ.
4. A domain rekordok (Schedule/Game/Media) nem kerülnek component props-ba teljes másolatként; a component konfiguráció binding/reference jellegű marad.
5. Localizationnél primary/default locale + fallback + field-level localized values/overrides irány szükséges; a Page Model struktúráját nem szabad locale-onként lemásolni.
6. Draft/Preview/Published snapshot boundary marad első osztályú; preview csak explicit authenticated/editor contextben használhat draftot.
7. A benchmark nem indít refaktort önmagában; minden változtatás KEEP/IMPROVE/REFACTOR/REPLACE döntést kap E2-ben.

**E1 hátralévő rész:**
- [x] Component/field/registry/history/serialization saját fájlokkal összevetve.
- [ ] Media/asset manager és template/reusable-component minták célzott auditja.
- [ ] Property Registry konkrét Inspector-adatfolyam és schema audit.
- [ ] Benchmark eredmények végleges E2 decision matrixba rendezése.

**40.69.13.E1.1 — Component Registry / Property Registry / Render Contract + Presentation/Theme Contract döntési audit — PASS — 2026-09-25**

**Auditált saját kód:**
- [x] public/editor-v2/core/schema.js — canonical Page Model/node tree, node lifecycle, responsive, visibility, dataBindings.
- [x] public/editor-v2/core/state.js — isolated editor state, selection, viewport, history, persistence, recovery/runtime.
- [x] public/editor-v2/core/commands.js — egyetlen canonical mutation path, validation, rollback, history, transaction/batch, locked-node protection.
- [x] public/editor-v2/core/canvas-engine.js — responsive style resolution és DOM canvas mapping.
- [x] public/editor-v2/core/responsive.js — desktop/tablet/mobile inheritance + override/reset.
- [x] public/editor-v2/app.js — palette, hierarchy, selection, canvas, jelenlegi kézi Inspector, preview/publish és API lifecycle.
- [x] Property Registry megléte és jelenlegi használati határa: a registry jó canonical alap, de az Inspector jelenleg kézi field-renderinggel dolgozik.

**Benchmark-ellenőrzés:**
- [x] Puck: component config → fields → defaultProps → render contract → data payload modell megerősítve. A saját rendszerben ennek megfelelő canonical registry + property/field + render boundary szükséges. citeturn0search0turn0search3turn0search4
- [x] Craft.js: node tree/state/selection/hierarchy/serialization irány kompatibilis a meglévő Core döntéseivel; teljes Core-csere nem indokolt.
- [x] GrapesJS: Component/Block/Style/Layer/Command/Storage külön felelősségi rétegei megerősítik, hogy a saját registry, hierarchy, command és persistence külön maradjon. citeturn0search11
- [x] Builder: live visual canvas + Layers + reusable Templates/Symbols + responsive + data/comments minták megerősítik a későbbi reusable component/template/presentation irányt. citeturn0search15
- [x] Framer: Canvas/CMS/localization/analytics/settings szétválasztása és draft/publish modell megerősíti a presentation és domain/content különválasztását. citeturn0search18turn0search9
- [x] Webflow: secondary locale primary locale-ból örököl, majd field/style szinten override-ol; a struktúra nem másolódik locale-onként. Ez a saját localization contract irányát megerősíti. citeturn0search13
- [x] Sanity: Presentation Tool iframe/live preview/click-to-edit + draft mode/published boundary megerősíti, hogy a public renderer és editor preview ugyanazon presentation contract felé közelítsen, miközben a draft/published adatforrás külön marad. citeturn0search6turn0search14turn0search12

### E1.1 döntési mátrix

| Terület | Döntés | Indok |
|---|---|---|
| Page Model / node tree | **KEEP** | Már canonical, validálható és tesztelt. |
| Selection / editor state | **KEEP** | Egyetlen state ownership, nincs bizonyíték cserére. |
| Command engine | **KEEP** | AI/integráció később ugyanide fordítható. |
| History / transaction | **KEEP** | Undo/redo/batch/rollback már működő canonical alap. |
| Responsive model | **KEEP + IMPROVE** | Jó inheritance contract; később property-level schema-val bővítendő. |
| Property Registry | **IMPROVE** | Megvan a canonical registry, de az Inspector nincs teljesen rákötve. |
| Component Registry | **IMPLEMENT / CANONICALIZE** | A node type lista önmagában nem elég: kell explicit component definition/ownership/capability/render metadata registry. |
| Render Contract | **IMPLEMENT** | A canvas jelenleg generic DOM preview; végleges shared render boundary kell. |
| Public Renderer boundary | **IMPROVE** | A published snapshot marad; ugyanazt a component/render contractot kell használnia, ahol runtime-kompatibilis. |
| Presentation/Theme | **IMPLEMENT / CANONICALIZE** | Site-scoped theme/design tokens + component presentation kell; nem lehet ad-hoc Inspector CSS. |
| Domain bindings | **KEEP + IMPROVE** | Schedule binding jó irány; domain rekordok referencia/binding alapján kerüljenek a componentbe. |
| Media/Asset | **AUDIT → CANONICALIZE** | Nem hozunk létre második media rendszert; meglévő ownershiphez igazítjuk. |
| Template/reusable component | **IMPLEMENT LATER** | Builder/Framer/Puck minták alapján szükséges, de E2/E3 contract után. |
| Localization | **KEEP DIRECTION + IMPLEMENT FOUNDATION** | Primary/default + fallback + field-level override, struktúra duplikáció nélkül. |
| Draft/Preview/Published | **KEEP** | A jelenlegi revision/published snapshot boundary bizonyítottan működik. |
| Legacy Inspector / renderer | **DO NOT REUSE AS CANONICAL** | Csak akkor maradhat compatibility UI, ha nincs más ownership; új rendszer ne erre épüljön. |

### E1.1 kötelező architekturális következtetések
1. **Nem cseréljük le a Visual Editor Core-t.**
2. A következő canonical lánc:
   **Component Registry → Property/Field Registry → Presentation/Theme Contract → Render Contract → Command Contract → Persistence/Revision.**
3. A Component Registry nem pusztán NODE_TYPES lista: minden komponenshez definiálható legyen legalább identity, label/category, allowed parent/children capability, default props/presentation, field/property schema, render adapter, data-binding capability, accessibility metadata és permission/lock capability.
4. A Property/Field Registry legyen az Inspector egyetlen meződefiníciós forrása; az Inspector UI csak ennek a contractnak a megjelenítője lehet.
5. A Presentation/Theme Contract legyen site-scoped, token-alapú és publishable. A component saját presentation schema-ja és a site theme tokenjei összehangoltan működjenek.
6. A Render Contract válassza szét a canonical data és a runtime renderer felelősségét. A Canvas preview és Public Renderer ugyanarra a canonical component definitionre támaszkodjon, de külön runtime adaptert használhat.
7. Domain adat (Schedule/Game/Media) nem kerülhet teljes rekordmásolatként a node props-ba; binding/reference + runtime resolution szükséges.
8. Localization nem hozhat létre külön Page Modelt vagy külön editort locale-onként.
9. AI/OBS/jövőbeli integrations csak Command/Domain/Presentation contractokon keresztül módosíthatnak.
10. Minden új componentnek ugyanazon validation/history/persistence útvonalon kell működnie.
11. A mostani app.js kézi Inspector-renderelése célzottan lecserélendő a canonical Property Registry adapterre, de csak E2 döntés + E3 contract után.

**E1.1 státusz:** [x] PASS — benchmark + saját kód összevetés és KEEP/IMPROVE/REFACTOR/REPLACE döntés elkészült. Kódmódosítás ebben az al-pontban nem történt.

**40.69.13.E1.2 — Media/Asset + Template/Reusable Component + Property Registry adatfolyam-audit — PASS — 2026-09-25**

**Saját repository audit:**
- [x] A jelenlegi Editor v2-ben nincs külön canonical Media/Asset Manager vagy `src/core/media` domain: a media node-ok léteznek a Page Modelben, de a tényleges asset ownership/storage lifecycle még nincs önálló canonical contractként kiépítve.
- [x] A régi public oldalak `/assets/site.css` és `/assets/site.js` fájlokat használnak, de ez nem tekinthető Editor v2 Media/Asset rendszernek.
- [x] A Property Registry jelenleg valódi extensibility boundary, de a registry és az app.js Inspector között még nincs teljes runtime adapter.
- [x] A Property Registryben már van asset típusú property (`background.image`), ezért a későbbi Asset Reference contractot ehhez kell igazítani; nem szabad új, párhuzamos asset mezőrendszert létrehozni.
- [x] A schema jelenleg sok node type-ot ismer, köztük COMPONENT/CUSTOM, de nincs még explicit reusable-component definition/template registry ownership.
- [x] A repository audit alapján nincs kész canonical Template/Reusable Component storage/domain; ezt E2/E3 alatt kell megtervezni, nem most ad-hoc Page Model mezőként hozzáadni.

### E1.2 döntések

| Terület | Döntés | Következő canonical irány |
|---|---|---|
| Media ownership | **IMPLEMENT LATER / CONTRACT NOW** | Site-scoped Media Asset + metadata + ownership + lifecycle + references. |
| Asset reference | **IMPLEMENT IN E3** | Node/domain csak immutable/reference ID-t tároljon; binary/storage rész külön boundary. |
| R2 | **BACKLOG** | R2 későbbi storage backend; a domain contract ne függjön közvetlenül R2-től. |
| Image/background asset | **KEEP + BIND** | A `type: asset` property canonical Asset Reference-re forduljon. |
| Template | **CONTRACT NOW / IMPLEMENT LATER** | Template = versioned reusable presentation/document preset, nem külön editor. |
| Reusable Component | **CONTRACT NOW / IMPLEMENT LATER** | Component definition + props/schema + presentation + version/lifecycle. |
| Component instance | **CANONICALIZE** | Page node hivatkozhat component definitionre; instance override-ok a node saját canonical state-jében legyenek. |
| Template vs Component | **SEPARATE** | Template oldal/szekció/preset jellegű; Component kisebb újrafelhasználható definíció. |
| Inspector | **IMPROVE** | Property Registry legyen az egyetlen field schema; asset/template/component választók adapterből jöjjenek. |
| Legacy assets | **DO NOT REUSE AS DOMAIN** | Statikus public assetek maradhatnak runtime resource-ok, de nem válnak media database-é. |
| Storage backend | **ABSTRACT** | D1 metadata + későbbi R2/object storage; provider csere ne törje a Page Modelt. |

### E1.2 szükséges Media/Asset contract

Minimum canonical irány:
- `assetId`
- `siteId`
- `kind` (image/video/audio/font/file/other)
- `storageProvider`
- `storageKey`
- `mimeType`
- `size`
- `width/height/duration` ahol értelmezhető
- `altText`
- `title`
- `metadata`
- `createdAt/updatedAt`
- ownership/reference state
- lifecycle/orphan state

**Biztonsági szabály:** a Page Model nem tárolhat titkos storage credentialt, signed URL-t vagy provider-specifikus session adatot.

### E1.2 szükséges Template/Reusable Component contract

**Template:**
- identity + site scope
- type (page/section/layout/preset)
- version
- canonical document/presentation reference
- preview metadata
- published/active state
- clone/fork lifecycle

**Reusable Component:**
- definition identity/version
- component registry key
- property schema
- allowed children/slots
- default props/presentation
- data-binding capability
- accessibility metadata
- instance override policy
- compatibility/migration version

**Fontos:** Template és Reusable Component nem kap külön command/history/renderer rendszert. Mindkettő a canonical Editor Core-ra fordul.

### Property Registry E1.2 megállapítás

- [x] A registry jó alap és bővíthető.
- [x] `asset` field type már létezik.
- [x] Group taxonomy széles, későbbi professional Inspectorhoz megfelelő irányt ad.
- [ ] A schema nincs még elég szigorúan gépesítve: type-specific validation, defaults, visibility/conditions, readOnly/locked, responsive capability, localized capability, binding capability és UI control metadata később canonical field contractba kerül.
- [ ] A jelenlegi `appliesTo` lista jó kezdet, de Component Registry capability/field resolution váltja fel.
- [ ] A jelenlegi `command` stringek maradnak command boundary-re mutató metadata-k; az Inspector nem hajthat végre közvetlen DOM mutációt.

### E1.2 E2-előkészítő döntés

**KEEP:** meglévő Core, Property Registry, Page Model, asset property irány.

**IMPROVE:** Property/Field schema, Component Registry, asset reference resolution, presentation/theme contract.

**IMPLEMENT LATER:** Media Manager, Template Registry, Reusable Component Registry, R2 backend, visual asset picker.

**REJECT:** külön Media Editor state, külön Template Editor, külön Component Editor, külön Asset Page Model vagy második renderer.

**E1.2 státusz:** [x] PASS — a saját Media/Asset, Template/Reusable Component és Property Registry adatfolyam audit elkészült. Kódmódosítás ebben az al-pontban nem történt.

**40.69.13.E1.3 — teljes E1 benchmark lezárás + E2 canonical architecture decision matrix — PASS — 2026-09-25**

### E1 teljes benchmark lezárás

A saját Editor Core, Page Model, State, Commands, Canvas/Responsive, Property Registry, Schedule domain binding, valamint a korábban elvégzett Puck / Craft.js / GrapesJS / Builder / Framer / Webflow / Sanity referenciaauditok alapján az E1 benchmark lezárható.

**E1 végleges következtetés:**
- [x] A meglévő Visual Editor Core nem cserélendő le.
- [x] A Page Model marad az egyetlen canonical document source of truth.
- [x] A Selection / State / Command / History / Transaction réteg marad.
- [x] A Responsive rendszer marad, canonical property resolutionnel továbbfejlesztve.
- [x] A Property Registry marad, de canonical Field Contract irányba fejlődik.
- [x] Component Registry kerül bevezetésre mint a komponens definíciók egyetlen canonical registry-je.
- [x] Render Contract kerül bevezetésre a canonical component definition és a runtime renderer közé.
- [x] Presentation / Theme Contract kerül bevezetésre site-scoped, token-alapú és publisholható rétegként.
- [x] Domain bindings maradnak reference/binding alapúak; domain rekordokat nem másolunk node props-ba.
- [x] Media/Asset külön canonical domain lesz, storage-provider agnosztikus contracttal.
- [x] Template és Reusable Component külön fogalom marad.
- [x] Localization ugyanazt a document/presentation modellt használja; nem készül locale-onként külön Page Model.
- [x] Draft / Preview / Published boundary marad.
- [x] AI / OBS / későbbi integrációk csak canonical command/domain/presentation boundaryn keresztül módosíthatnak.
- [x] Legacy Inspector és legacy renderer nem lesz canonical.

## E2 — CANONICAL ARCHITECTURE DECISION MATRIX

| Réteg | Döntés | Canonical ownership | Következő megvalósítás |
|---|---|---|---|
| Document/Page Model | KEEP | Editor Core Schema | E3 contract freeze |
| Node Tree | KEEP | Editor Core Schema | capability-k finomítása |
| Selection/Editor State | KEEP | Editor Core State | nincs második state |
| Command Engine | KEEP | Editor Core Commands | minden mutation ezen át |
| History/Undo/Redo | KEEP | Command/State | nincs feature-specifikus history |
| Transaction/Batch | KEEP | Command Engine | domain műveletek is ezt használják |
| Responsive | IMPROVE | Responsive + Field Contract | inheritance/override/reset contract |
| Component Registry | IMPLEMENT | Component Domain/Registry | identity/capability/props/render metadata |
| Property/Field Registry | IMPROVE | Field Contract | schema + UI adapter + validation |
| Render Contract | IMPLEMENT | Presentation/Renderer boundary | Canvas + Public Renderer közös contract |
| Presentation/Theme | IMPLEMENT | Site-scoped Presentation Domain | tokenek, component presentation, publish snapshot |
| Domain Binding | KEEP + IMPROVE | Domain Binding layer | reference/runtime resolution |
| Schedule Binding | KEEP | Schedule domain | canonical source már működik |
| Media/Asset | IMPLEMENT | Media Domain | metadata/reference/storage abstraction |
| Asset Storage | ABSTRACT | Storage boundary | R2 később, provider-agnosztikusan |
| Template | IMPLEMENT LATER | Template Domain | versioned document/presentation preset |
| Reusable Component | IMPLEMENT LATER | Component Definition Domain | versioned definition + instance overrides |
| Localization | FOUNDATION | Localization layer | 1.0 HU, későbbi locale bővítés |
| Draft/Preview/Published | KEEP | Revision/Publishing | explicit lifecycle |
| Public Renderer | IMPROVE | Render Contract | editor/public parity |
| Inspector | REFACTOR | Property Registry adapter | manual field branches fokozatos kivezetése |
| Media Picker | IMPLEMENT LATER | Media Domain UI | canonical Asset Reference |
| Template Picker | IMPLEMENT LATER | Template Domain UI | no separate editor |
| AI | FUTURE CAPABILITY | Command/Domain/Presentation | no parallel editor state |
| OBS | FUTURE CAPABILITY | Local bridge + Presentation/Command | separate trust boundary |
| Automation | FUTURE CAPABILITY | Event/Automation/Command | idempotent/auditable |
| Analytics | FUTURE DOMAIN | Analytics boundary | no direct editor mutation |
| Multi-tenant | ARCHITECTURE FOUNDATION | site/tenant scope | design/data/storage isolation |

### E2 canonical dependency chain

A rendszer fő függőségi sorrendje:

```
Domain entities / integrations
          ↓
Canonical Domain Contracts
          ↓
Component Registry
          ↓
Property / Field Registry
          ↓
Presentation / Theme Contract
          ↓
Render Contract
          ↓
Canvas Renderer / Public Renderer
          ↓
Command Contract
          ↓
History / Transaction
          ↓
Persistence / Revision / Publish
```

**Fontos korrekció:** a fenti rétegek logikai contractok; a Command Engine továbbra is az Editor Core mutation boundaryja. A Component/Field/Presentation/Render réteg nem kerülhet meg semmilyen validation/history/persistence szabályt.

### E2 nem-negotiable architektúra szabályok

1. Egyetlen Page Model.
2. Egyetlen canonical node tree.
3. Egyetlen selection/state rendszer.
4. Egyetlen mutation/Command boundary.
5. Egyetlen history/transaction rendszer.
6. Egyetlen Property/Field definition source.
7. Egyetlen Component definition registry.
8. Egyetlen Presentation/Theme contract.
9. Egyetlen Render contract.
10. Domain adat node props-ba csak reference/binding formában kerülhet.
11. Asset binary és storage credential soha nem kerül Page Modelbe.
12. Template és reusable component nem hoz létre második editort.
13. Locale nem hoz létre második Page Modelt.
14. Public renderer és Editor canvas ugyanazt a canonical component/presentation contractot használja, ahol a runtime különbség indokolja, ott külön adapterrel.
15. AI, OBS, Automation és későbbi integrációk nem hozhatnak létre saját állapot- vagy mutation-rendszert.
16. Minden új feature a meglévő validation/history/persistence útvonalon megy.
17. Site/tenant scope kötelező a user-specifikus design, media, template és későbbi configuration adatoknál.
18. R2/storage provider cserélhető marad.
19. Feature preservation kötelező: új igény nem törölhet korábbi MASTER backlog elemet.
20. Legacy rendszer csak kompatibilitási/átmeneti szerepet tölthet be, canonical ownershipet nem.

### E2 scope boundary

**Most nem implementáljuk:**
- teljes Media Manager UI
- R2 upload
- Template Builder
- Reusable Component Builder UI
- teljes Inspector UI rewrite
- teljes Theme Editor
- AI editor
- OBS editor
- multi-platform control surface

**Ezeknek most a canonical contractját és ownershipét rögzítjük.**

### E1/E2 státusz

- **E0 — Audit:** [x] PASS
- **E1.1 — Benchmark + saját Editor Core audit:** [x] PASS
- **E1.2 — Media/Asset + Template/Reusable Component + Property Registry audit:** [x] PASS
- **E1.3 — E1 benchmark lezárás + E2 decision matrix:** [x] PASS
- **E2 — Canonical architecture decision:** [x] PASS — az E1 eredményei alapján rögzítve, implementáció nélkül.

**TÖRTÉNETI — NEM AKTÍV — korábbi checkpoint:** **40.69.13.E3 — Game Profile + Media Asset + Schedule Event + Presentation/Theme canonical domain contract megtervezése és freeze**, kiegészítve a Creator Center / külön workspace admin-UX szerződéssel.

### E3 kiegészített contract-scope

Az E3 nem csak adatmodellt freeze-el. Rögzíteni kell:
- [ ] Creator Center / Admin Shell ownership és navigation boundary.
- [ ] Website workspace / Visual Editor boundary.
- [ ] későbbi Overlay Studio workspace boundary.
- [ ] közös canonical domain és presentation rétegek.
- [ ] editor-specifikus UI/runtime state határa.
- [ ] Media Asset és brand-token megosztás szabálya.
- [ ] site/creator/tenant scope.
- [ ] workspace-permission és capability boundary.
- [ ] onboarding / progressive disclosure alapelvek.
- [ ] deep-link / return-to-workspace / unsaved-changes viselkedés későbbi contractja.
- [ ] a Website Editor és Overlay Studio külön UI-ja mellett is egyetlen canonical mutation/persistence útvonal.

**E3 UX döntési alap:** a platformot nem „egy nagy adminpanelként”, hanem **egy Creator Center + több célfeladatra optimalizált workspace** modellként építjük. Ez a felhasználóbarátságot javítja anélkül, hogy a canonical architektúrát szétbontaná.

### E3 — CANONICAL CONTRACT FREEZE — 2026-09-25

**Repo-audit eredmény:** a jelenlegi rendszer már jó alapot ad a közös platformmotorhoz, de a domain-scope és néhány domain ownership még nincs canonicalizálva. A jelenlegi Document már tartalmaz siteId mezőt, viszont a default értéke null; a jelenlegi media tábla még globális/legacy jellegű és csak alap metaadatot tárol; a schedule_items jelenleg canonical Schedule domainként működik, de még nincs Game Profile referencia; a Presentation/Theme külön canonical domain még nincs implementálva. Ezeket E4-ben, új párhuzamos rendszer létrehozása nélkül rendezzük.

#### 1. Creator Center / Workspace Contract

**Canonical:**
- Creator Center = navigation/orchestration shell.
- Website Editor = külön workspace/runtime.
- Stream/Twitch = külön management workspace.
- Overlay Studio = későbbi külön visual workspace.
- Future Content/Automation/Analytics/Community/OBS/Video workspaces = külön felületek lehetnek.

**Nem canonical:**
- workspace saját domain DB;
- workspace saját asset store;
- workspace saját theme store;
- workspace saját command/history;
- workspace saját Page/Node Model.

**Workspace state** csak UI/runtime állapot lehet: megnyitott panel, aktív tab, zoom, layout, filter, temporary selection stb.

**Navigációs szerződés:**
Creator Center → Workspace → konkrét entity/editor → mentés/publish → visszatérés Creator Centerbe.

Deep-link, unsaved changes és permission ellenőrzés később közös platformszinten kezelendő.

#### 2. Site / Creator / Tenant Scope

Minden creatorhoz tartozó tartalom és konfiguráció később site/tenant scope alatt él:
- pages;
- editor documents/revisions;
- media assets;
- game profiles;
- schedule data;
- presentation/theme;
- templates;
- reusable components;
- integrations;
- későbbi automation/analytics/configuration.

**Egyetlen Sanci site esetén is most ezt az ownershipet tervezzük**, hogy később multi-tenant átépítés nélkül bővíthető legyen.

A meglévő global/legacy táblák csak migrációs/kompatibilitási források lehetnek; új canonical domain ownership nem épül rájuk változtatás nélkül.

#### 3. Game Profile Contract

A Game Profile külön domain entity, nem Schedule node prop.

Minimum canonical mezők:
- id
- siteId
- slug
- name
- platform/category opcionális domain metadata
- coverAssetId / iconAssetId opcionális Asset Reference
- brand opcionális presentation metadata
- metadata
- isActive
- createdAt
- updatedAt

A Schedule Event csak gameProfileId referencia lehet; a játék neve/képe nem kerül minden adás rekordjába duplikált domain adatként.

#### 4. Schedule Event Contract

A meglévő schedule_items marad a Schedule domain kiindulópontja, de E4-ben canonical Schedule Event fogalomként kell kezelni.

Minimum:
- identity + site scope;
- title;
- start/end;
- status;
- platform;
- URL/notes;
- gameProfileId nullable reference;
- source/sourceAccount/source identity;
- source presence/sync timestamps;
- recurring metadata;
- source category metadata;
- created/updated lifecycle.

**Twitch továbbra is adapter/source, nem canonical owner.**

Editorban a Schedule node csak:
ScheduleBinding + PresentationConfig
formában hivatkozik a domainre.

#### 5. Media Asset Contract

A jelenlegi media tábla nem tekintendő végleges canonical Media domainnek.

Canonical Asset:
- assetId
- siteId
- kind
- storageProvider
- storageKey
- mimeType
- size
- width
- height
- duration
- originalName
- altText
- title
- metadata
- lifecycle/orphan/reference metadata
- created/updated timestamps.

A binary object külön storage boundaryn marad. MEDIA R2 már rendelkezésre áll az environmentben, de **E3-ban nem implementálunk upload rendszert**.

Page Modelben csak immutable Asset Reference / asset ID szerepelhet.

#### 6. Presentation / Theme Contract

A Presentation/Theme nem egyetlen „CSS blob” és nem editor-specifikus beállítás.

Két szint:
1. **Site Theme** — site-scoped design tokens.
2. **Component Presentation** — component-scoped presentation overrides.

Theme token kategóriák későbbi canonical alapjai:
- colors;
- typography;
- spacing;
- radii;
- shadows;
- borders;
- layout/container;
- responsive breakpoints;
- motion;
- states;
- accessibility-related presentation tokens.

A komponens instance saját override-ot kaphat, de az alapértelmezés a theme/component contractból öröklődik.

Theme és presentation publisholható, revisioned állapot legyen; a Public Renderer publishelt snapshotból dolgozhat.

#### 7. Localization Contract

E3-ban nincs locale-onként külön Page Model.

A domain:
- default locale;
- supported locales;
- localized field/value reference;
- fallback locale

modellt támogat későbbi bővítéshez.

1.0-ban HU az aktív tartalmi locale; az adatmodell nem zárhatja ki a későbbi DE/UK/RU/EN stb. bővítést.

#### 8. Cross-workspace ownership

Egy későbbi Overlay Studio használhat:
- ugyanabból a Media Asset domainből;
- ugyanabból a brand/theme token rendszerből;
- ugyanabból a Component Registryből;
- ugyanabból a domain/event binding rétegből;
- ugyanabból a Command/History/Persistence boundaryból

de az Overlay UI nem veheti át a Website Page Model ownershipét, és fordítva.

**Ez a „közös motor, külön személyre szabott felület” végleges architekturális értelmezése.**

#### 9. E3 Definition of Done

- [x] Creator Center / workspace boundary freeze.
- [x] Site/tenant ownership freeze.
- [x] Game Profile contract freeze.
- [x] Schedule Event contract freeze.
- [x] Media Asset contract freeze.
- [x] Presentation/Theme contract freeze.
- [x] Localization boundary freeze.
- [x] Cross-workspace canonical ownership freeze.
- [x] No second editor/core/state/mutation system decision.

**E3 státusz: [x] PASS — contract freeze kész, implementáció nélkül.**

**Következő egyetlen aktív pont: 40.69.13.E4 — minimális canonical domain/foundation implementation.**

### E4.1 — CANONICAL DOMAIN CONTRACT FOUNDATION — 2026-09-25

**Státusz:** [x] IMPLEMENTED — első minimális foundation.

Létrejött a 'src/core/domain/contracts.ts' canonical domain-contract réteg.

Rögzített és normalizálható domain-ek:
- **Media Asset / Asset Reference** — az Editor/Page Model felé csak Asset Reference ('assetId') mehet; binary/storage adat külön domain.
- **Game Profile** — site-scoped entity, saját identity/slug/lifecycle, opcionális media references és brand metadata.
- **Schedule Event** — site-scoped canonical esemény, a Game Profilet csak 'gameProfileId' referenciával kapcsolja; a játék neve/képe nem duplikálódik minden eseménybe.
- **Site Presentation / Theme** — site-scoped, revisioned, draft/published állapotú theme token + component/page override foundation.
- **Theme tokens** — colors, typography, spacing, radii, shadows, borders, layout, responsive, motion, states és accessibility kategóriák canonical alapok.

### E4.1 invariánsok

- [x] Minden új domain contract site-scoped.
- [x] Asset binary nem kerül Page Modelbe.
- [x] Schedule Event nem másolja a Game Profile adatát.
- [x] Twitch továbbra is source/adapter, nem canonical owner.
- [x] Presentation/Theme különválik a domain adattól.
- [x] Workspace/editor UI state nem került a domain contractba.
- [x] Hibás azonosító/időintervallum normalizációval elutasítható.
- [x] Új párhuzamos Editor/State/Command/History rendszer nem jött létre.

### E4.1 regression gate

Létrejött:
- 'tests/domain-contracts.test.js'
- 'npm run test:domain'

A teszteli:
- Asset Reference minimalitás;
- Game Profile site-scope + asset reference;
- Schedule Event → Game Profile reference;
- hibás időintervallum elutasítása;
- Presentation site-scope + revision/draft alap.

**Fontos:** a GitHubon létrejött kódot a lokális munkagépnek előbb 'git pull --ff-only origin v2/foundation' paranccsal kell átvennie. A lokális 'typecheck', 'test:domain', 'test:schedule' és 'test:editor' futtatása ezután a következő ellenőrzési kapu része; production deploy még nincs.

**E4.1 státusz: [x] PASS — contract foundation létrehozva.**

**E4 következő egyetlen al-pont: 40.69.13.E4.2 — canonical site ownership + D1 foundation migration megtervezése és implementálása.**

### E4.2 — SITE OWNERSHIP D1 FOUNDATION — VERIFIED / CLOSED

Elkészült és production remote D1-ben igazoltan érvényesült a `migrations/0015_site_ownership_foundation.sql` migration.

**Migration-kompatibilitási korrekció:**
- az első változatot a Cloudflare D1/SQLite elutasította a `REFERENCES` + nem-null default kombináció miatt;
- a végleges változat nullable `site_id` oszlopot ad hozzá, majd azonnali backfillt végez;
- a későbbi `NOT NULL` hardening csak a consumer audit után történhet.

**Production verification — 2026-09-25:**
- `sites` tábla létezik;
- bootstrap site: `site-default / sanci9517 / Sanci9517 / active`;
- `pages`: 9 rekord, 0 NULL `site_id`;
- `schedule_items`: 3 rekord, 0 NULL `site_id`;
- `media`: 0 rekord;
- `social_accounts`: 0 rekord;
- `twitch_connections`: 1 rekord, 0 NULL `site_id`;
- meglévő Twitch kapcsolat változatlanul `connected`, broadcaster `1144260301 / sanci9517`;
- mindhárom meglévő manual schedule rekord `site-default` ownership alatt megmaradt;
- `PRAGMA quick_check` → `ok`;
- `PRAGMA foreign_key_check` → nem jelzett hibát;
- a compound-count lekérdezés D1-ben SQLite compound-term limit miatt hibázott, de ez nem adatbázis- vagy migrationhiba; az egyenként végrehajtott countok sikeresek voltak.

**E4.2 státusz: [x] PASS — remote schema, ownership backfill és adatmegőrzés ellenőrizve.**

### E4.3 — site-scoped consumer/read-write audit és canonical ownership enforcement

**E4.3.1 — Consumer audit:** [x] PASS
- [x] `pages`, `schedule_items`, `media`, `social_accounts` és `twitch_connections` runtime fogyasztóinak feltérképezése.
- [x] Legacy/global `site_settings` fogyasztó azonosítva és elkülönítve.
- [x] Canonical site context boundary létrehozva: `src/core/site-context.ts`, bootstrap site=`site-default`.
- [x] Döntés rögzítve: `site_settings` jelenleg legacy/global marad; párhuzamos site-scoped settings rendszer nem kerül bevezetésre E4.3 alatt.

**E4.3.2 — Pages + Editor ownership enforcement:** [x] PASS
- [x] Admin Pages list/create/update/delete/order/count műveletek site-scoped.
- [x] Editor GET/save/publish/unpublish/rollback műveletek site ownership alapján védettek.
- [x] Editor rollback előtt explicit page ownership ellenőrzés történik.
- [x] Canonical site context minden érintett runtime consumerhez átvezetve.

**E4.3.3 — Schedule CRUD + public read + Twitch Schedule sync ownership:** [x] PASS
- [x] Admin Schedule CRUD minden SELECT/INSERT/UPDATE/DELETE művelete site-scoped.
- [x] Public Schedule read kizárólag a canonical site contexthez tartozó rekordokat olvassa.
- [x] Twitch Schedule sync connection lookup site ownership alapján történik.
- [x] Canonical schedule sync mapper/upsert/reconcile a `site_id` értéket végigviszi.
- [x] Korábbi C.5.1 regressziós viselkedés megőrizve.
- [x] GitHub Actions **Twitch Integration Check #151 — PASS**.
- [x] GitHub Actions **Editor Core Test #775 — PASS**.
- [x] A #149/#773 és #150/#774 köztes sikertelen futások diagnosztizálva és a végleges javítás után nem tekintendők aktuális állapotnak.
- [x] Végső javító commit: `7cfbef4d3cb02d592b69ef4d36b6b6f5d28aecafac` — schedule context import Node ESM kompatibilitásának javítása és canonical site context teszt rögzítése.

**E4.3 aktuális állapot: 40.69.13.E4.3.4 — [x] LEZÁRVA, 2026-10-07**

### E4.3.1 — Consumer audit — [x] PASS
- [x] `pages`, `schedule_items`, `media`, `social_accounts` és `twitch_connections` runtime fogyasztóinak feltérképezése.
- [x] Legacy/global `site_settings` fogyasztó azonosítva és elkülönítve.
- [x] Canonical site context boundary létrehozva: `src/core/site-context.ts`, bootstrap site=`site-default`.
- [x] Döntés rögzítve: `site_settings` jelenleg legacy/global marad; külön site-scoped settings rendszer nem kerül bevezetésre ezen a kapun.

### E4.3.2 — Pages + Editor ownership enforcement — [x] PASS
- [x] Admin Pages list/create/update/delete/order/count műveletek site-scoped.
- [x] Editor GET/save/publish/unpublish/rollback site ownership alapján védett.
- [x] Editor rollback előtt explicit page ownership ellenőrzés történik.
- [x] Canonical site context az érintett runtime consumerekhez átvezetve.

### E4.3.3 — Schedule CRUD + public read + Twitch Schedule sync ownership — [x] PASS
- [x] Admin Schedule CRUD SELECT/INSERT/UPDATE/DELETE műveletei site-scoped.
- [x] Public Schedule read kizárólag a canonical site contexthez tartozó rekordokat olvassa.
- [x] Twitch Schedule sync connection lookup site ownership alapján történik.
- [x] Canonical schedule sync mapper/upsert/reconcile végigviszi a `site_id` értéket.
- [x] Korábbi C.5.1 regressziós viselkedés megőrizve.
- [x] Twitch Integration Check #151 — PASS.
- [x] Editor Core Test #775 — PASS.
- [x] Végső javító commit: `7cfbef4d3cb02d592b69ef4d36b6b6f5d28aecafac`.

### E4.3.4 — Twitch connection/OAuth ownership enforcement — [x] PASS / CLOSED
- [x] `migrations/0016_twitch_oauth_site_ownership.sql` létrehozva és remote D1-ben alkalmazva.
- [x] `twitch_oauth_states.site_id` hozzáadva, meglévő state rekordok canonical site-ra backfillölve és indexelve.
- [x] OAuth connect state canonical site ownershiphez kötve.
- [x] OAuth callback a code exchange előtt ellenőrzi a state `user_id + site_id + expiry + used_at` feltételeit.
- [x] Callback után csak az exchange által visszaadott pontos `twitch_connections.id` rekord kerül site binding alá.
- [x] `bindTwitchConnectionToSite(siteId, connectionId)` exact-ID helper `site_id IS NULL` guarddal.
- [x] `exchangeTwitchCode()` csak a szükséges connection azonosítót adja vissza; token/secret nem kerül ki.
- [x] Connection / validation / disconnect route-ok explicit user + connection + site ownership ellenőrzést használnak.
- [x] Validation/revoke token-műveletek előtt külön ownership assertion történik.
- [x] Cross-site connection ID access blokkolva.
- [x] Célzott cross-site, site-scoped lookup, NULL legacy binding és exact-ID regression tesztek PASS.
- [x] Twitch Integration Check #176 — PASS.
- [x] Editor Core Test #800 — PASS.
- [x] A két CI gate ugyanazon hardening HEAD-en `c8d1501b7e17b9db1f3d55b1229e74ae7519191a` PASS.
- [x] Remote D1 live verification PASS: schema/ownership/integrity ellenőrzések lezárva.
- [x] E4.3.4 végleges security/live gate PASS.

**E4.3.4 státusz:** `[x] LEZÁRVA`. Több E4.3.4 pending tétel nem maradhat aktív checkpointként.

### E4.3.5–E4.3.8 — CANONICAL CONTRACT + HARDENING + DoD SPECIFICATION — [x] PASS / CLOSED — TÖRTÉNETI RÉSZ

**Cél:** az E4.3.4 bizonyított ownership enforcementre építve rögzíteni azokat a canonical szerződéseket és hardening előfeltételeket, amelyekből az E4.4 `site_id NOT NULL` schema hardening biztonságosan, visszaellenőrizhetően és D1-kompatibilisen végrehajtható.

#### E4.3.5 — Canonical site-ownership contract — [x] PASS

**Runtime hardening implementation checkpoint:** `[x]` IMPLEMENTÁLVA — végső CI HEAD `e18b0b48efcfb8e966f89401296257386bb7f645`; Twitch Integration Check #216 PASS; Editor Core Test #840 PASS.
- [x] Public Pages list és slug read `site_id` alapján szűrt.
- [x] Twitch OAuth state létrehozás `site_id`-t atomikusan ír.
- [x] Twitch OAuth exchange/state claim user + site ownership alapján védett.
- [x] Twitch connection upsert cross-site ownership conflict ellenőrzést és `site_id`-t használ.
- [x] Twitch connection lookup, refresh lock, validation és revoke site + user ownershipre szűkített.
- [x] Twitch Schedule adapter identity/token útvonal site + user contextet visz végig.
- [x] Cross-site Twitch connection regression és public Pages ownership regression automatikus tesztben lefedve.
- [x] Site ownership contract teszt bekerült a Twitch Integration CI gate-be.

**Canonical consumer / ownership matrix — E4.3.5 review PASS:**

| Domain/table | Aktív read/write consumer | Canonical ownership contract | Állapot |
|---|---|---|---|
| `pages` | Admin Pages, Editor, Public Pages | `site_id` minden read/write útvonalon; public read is site-scoped | PASS |
| `schedule_items` | Admin Schedule, Public Schedule, Twitch Schedule sync | `site_id` minden domain read/write útvonalon; sync site-scoped connectionnel dolgozik | PASS |
| `media` | Jelenleg nincs aktív canonical runtime consumer | Schema site-scoped; future consumer csak canonical site contexttel léphet be | PASS / no active consumer |
| `social_accounts` | Jelenleg nincs aktív canonical runtime consumer | Schema site-scoped; future consumer csak canonical site contexttel léphet be | PASS / no active consumer |
| `twitch_connections` | Twitch integration routes, Schedule adapter/sync | user + connection + site ownership; cross-site access fail-closed | PASS |
| `twitch_oauth_states` | Twitch connect/callback | user + site + state + expiry + used_at ownership; site binding atomikus | PASS |
| `site_settings` | Admin/Public Site Settings | legacy/global domain, E4.3-ban out-of-scope; nincs implicit partial scoping | PASS / explicit exception |

- [x] Minden releváns read/write consumerhez a canonical site-context forrás és ownership átadási pont dokumentálva.
- [x] A runtime hardening valamennyi jelenlegi érintett consumerre kiterjedő query/mutation matrixként dokumentálva.
- [x] User-only / connection-only / broadcaster-only canonical mutation útvonalak az audit alapján megszüntetve vagy site ownershipre szűkítve.
- [x] Public read és authenticated admin read/write között külön ownership contract rögzítve.
- [x] `site_settings` explicit legacy/global out-of-scope státusza rögzítve.
- [x] A jelenlegi bootstrap site-context resolver nem fogad külső site ID-t; ezért missing/unknown site context jelen állapotban nem kerülhet canonical consumerhez. Jövőbeli dinamikus resolver esetén az érvénytelen context csak fail-closed módon engedhető tovább.

#### E4.3.6 — Legacy / NULL ownership hardening contract — [x] PASS / CLOSED
- [x] Az E4.4 előtti nullable `site_id` állapot preconditionje dokumentálva: minden jelenlegi site-scoped production rekordnak non-NULL ownershiptel kell rendelkeznie.
- [x] Az E4.3.4 remote verification alapján a `pages`, `schedule_items`, `media`, `social_accounts` és `twitch_connections` táblák NULL ownership countja 0 volt; `twitch_oauth_states` 0016 verification során szintén non-NULL state ownershipre lett backfillölve.
- [x] Unexpected NULL Twitch ownership esetén nincs user-wide bulk binding az active OAuth callbackben; az exact-ID legacy rebinding helper teljesen eltávolítva, így NULL ownershipre nincs automatikus újrakötési út. Minden aktív Twitch connection read/refresh/validation/revoke és Schedule identity útvonal user + site ownershipre zár.
- [x] Wrong-site Twitch connection és public Pages hozzáférés a canonical query boundaryn kívül nem adható vissza.
- [x] Cross-site és wrong-site inputokra a security response contract lezárva: idegen Twitch connection resource nem adható vissza; explicit resource lookup/sync ownership mismatch `TWITCH_CONNECTION_NOT_FOUND`/404 irányba fail-closed, collection/read útvonalak pedig kizárólag canonical site contextből dolgoznak.
- [x] Index/FK/integrity ellenőrzések E4.4 előtti kötelező gate-ként dokumentálva.
- [x] Legacy rekordkezelés és későbbi cleanup felelősségi határ dokumentálva.

#### E4.3.7 — E4.4 schema-hardening readiness contract — [x] PASS / CLOSED
- [x] D1/SQLite-kompatibilis `NOT NULL` migration strategy rögzítve: érintett táblák kontrollált table-rebuildje explicit `site_id NOT NULL REFERENCES sites(id)` oszloppal, majd adat-copy/index/FK verification.
- [x] Pre-migration backup/rollback/recovery stratégia ténylegesen végrehajtva és igazolva: production D1 export 412 387 bájt, SHA-256 `6D26A38712A0F9BBA087612A61788530239AFF5FE9B0740773D734A5E93A4CF9`; remote preflight PASS; izolált SQLite recovery PASS (`quick_check=ok`, `foreign_key_check=[]`, 22 tábla). A Wrangler 4.130.0 export hitelesítési hibája után a 4.148.0 export sikeresen teljesült.
- [x] Backfill előfeltételek és row-count invariánsok rögzítve: migráció előtt NULL count = 0 és a table-rebuild után összesített row-count változatlan.
- [x] Foreign key és index invariánsok rögzítve.
- [x] Migration order és érintett consumer deployment order rögzítve: schema hardening csak az ownership-aware runtime után.
- [x] Post-migration verification query-k és PASS/FAIL küszöbök rögzítve.
- [x] E4.3.7 minden readiness előfeltétele explicit PASS állapotban van; E4.4 továbbra is az E4.3.8 teljes PASS-jához kötött.

#### E4.3.8 — Regression / security / live Definition of Done — [x] PASS / CLOSED — 2026-10-07
- [x] Cross-site read/write regression matrix rögzítve: Pages, Twitch connection/OAuth és Schedule ownership esetek.
- [x] OAuth state ownership + exact connection binding regression matrix rögzítve és automatizált teszttel lefedve.
- [x] Public Schedule / Editor / Pages ownership regression matrix rögzítve.
- [x] Missing/invalid site-context security cases külön explicit regression suite-tal lefedve.
- [x] NULL legacy-state és unexpected ownership anomaly edge-case suite teljesítve.
- [x] CI/typecheck/test commandok és szükséges GitHub Actions gate-ek rögzítve; az új hardening HEAD-en Twitch Integration #221 és Editor Core #845 PASS; a Twitch Integration és Editor Core workflow-k PR-gate-ként is futtathatók `v2/foundation` ellen.
- [x] E4.3.7 remote D1 verification/preflight PASS: quick_check OK, foreign_key_check üres, érintett site-scoped táblák NULL ownership countja 0, ownership indexek mind jelen vannak, séma az E4.4 table-rebuild előtti canonical állapotnak megfelelő.
- [x] Live evidence és felhasználói PASS: 2026-10-07 — Cloudflare deployment lista szerint a legfrissebb live deployment 15:58:58 UTC-kor jött létre; live `/` HTTP 200; `/assets/page-renderer.js?v=20260917-2` HTTP 200; `/api/public/pages?slug=home` HTTP 200; `/api/public/pages?slug=about` HTTP 200; a felhasználói böngészős ellenőrzés szerint a publikus oldal ténylegesen betöltött. A korábbi D1 parameter-binding 1101/500 hiba ezeken az útvonalakon megszűnt.
- [x] MASTER checkpoint lezárási formátuma rögzítve.

### E4.3.5–E4.3.8 közös Definition of Done
- [x] A canonical ownership contract egyértelmű és végrehajtható.
- [x] A hardening előfeltételek nem hagynak implicit vagy user-only hozzáférési kiskaput.
- [x] Az E4.4 migration technikai preconditionjei dokumentáltak; az actual remote backup/recovery gate még nyitott.
- [x] A szükséges automatikus regressziók és live verification lépések reprodukálhatók; a végső lokális `typecheck` és site-ownership contract teszt PASS, az E4.3 hardening CI gate-ek PASS, a remote D1 preflight/recovery és a live public verification PASS.
- [x] A MASTER 00/A, 00/B és az E4.3 aktuális rész ugyanazt az egyetlen aktív pontot mutatja.
- [x] Csak a teljes DoD PASS után nyitható meg az E4.4.

**E4.4 `site_id NOT NULL` schema hardening:** [x] LEZÁRVA — 2026-10-07 — teljes migration, recovery, remote schema/integrity és live application verification PASS.

#### E4.4.1 — Final migration design + exact table-rebuild SQL audit — [x] PASS / CLOSED — 2026-10-07
- [x] Az E4.3.7 backup/export, preflight és recovery bizonyítékcsomag a migration inputjaként rögzítve: production D1 export 412 387 bájt, SHA-256 \`6D26A38712A0F9BBA087612A61788530239AFF5FE9B0740773D734A5E93A4CF9\`; remote quick_check OK, foreign_key_check üres, érintett site-scoped NULL count = 0, izolált recovery 22 tábla / quick_check OK / foreign_key_check üres.
- [x] Az érintett site-scoped táblák végleges listája: \`pages\`, \`schedule_items\`, \`media\`, \`social_accounts\`, \`twitch_connections\`, \`twitch_oauth_states\`.
- [x] A production \`sqlite_master\` audit alapján minden érintett table exact oszlopa, CHECK/UNIQUE/PRIMARY KEY/FK definíciója és jelenlegi indexe reprodukálható; aktív trigger az érintett táblákon nincs.
- [x] D1/SQLite-kompatibilis strategy rögzítve: \`PRAGMA defer_foreign_keys = ON\` alatt kontrollált shadow-table rebuild; a \`pages\` ↔ \`editor_revisions\` kölcsönös FK-függőség miatt az \`editor_revisions\` snapshotját ideiglenes táblába meg kell őrizni, az eredeti \`editor_revisions\` táblát a \`pages\` rebuild előtt el kell távolítani, majd az eredeti FK/index contracttal vissza kell építeni. Ez elkerüli az \`ON DELETE CASCADE\` adatvesztést és nem használja a D1-ben tiltott \`PRAGMA foreign_keys=OFF\` mintát.
- [x] Adatmásolásnál minden rekord megőrzése, \`site_id\` változatlansága és row-count invariáns explicit post-migration verification querykkel kerül ellenőrzésre; a migration nem írhat át meglévő \`site_id\` értéket.
- [x] FK/index/unique/trigger/schema invariánsok rebuild utáni ellenőrzési lekérdezései az E4.4.2 verification csomagban kerülnek rögzítésre; az audit megállapította, hogy az egyetlen speciális FK-ciklus a \`pages\` ↔ \`editor_revisions\` kapcsolat.
- [x] Migration transaction/failure behavior audit: Cloudflare D1 az egyes migration/query végrehajtásokat implicit tranzakcióban futtatja; FK-k ideiglenes késleltetésére a D1 által támogatott \`PRAGMA defer_foreign_keys = ON\` használható, és a tranzakció végén a feloldatlan FK-eltérés hibát okoz. A rebuild ezért egyetlen migrációs egységben, explicit ellenőrző lépésekkel készül.
- [x] Deployment order véglegesítve: ownership-aware runtime → production backup/preflight → verified migration → post-migration schema/integrity verification → live regression.
- [x] A migration előtti production backup azonosítója és SHA-256 bizonyítéka a release recordban rögzítve: \`d1-backup-2026-10-07.sql\`, SHA-256 \`6D26A38712A0F9BBA087612A61788530239AFF5FE9B0740773D734A5E93A4CF9\`.
- [x] E4.4.1 audit PASS; az E4.4.2 actual implementation/apply szakasz nyitható.

#### E4.4.2 — \`site_id NOT NULL\` actual implementation + remote apply — [x] PASS / CLOSED — 2026-10-07
- [x] `migrations/0017_site_ownership_not_null.sql` elkészült és a D1/SQLite-kompatibilis shadow-table rebuild contract alapján ellenőrizve.
- [x] A hat érintett tábla exact schema/index contractja 1:1 reprodukálva, `site_id NOT NULL` + `ON DELETE RESTRICT` ownership FK-val.
- [x] A `pages` ↔ `editor_revisions` ciklikus FK snapshot/rebuild eljárás dry-runban adatvesztés nélkül PASS.
- [x] Isolated recovery DB-n a teljes migration dry-run PASS: 9 pages, 73 editor revisions, 3 schedule item, 1 Twitch connection, 2 Twitch OAuth state; linkage/index/FK/snapshot cleanup PASS.
- [x] Remote production schema verification PASS; Wrangler migration history szerint nem volt új pending migration, a tényleges remote schema már az E4.4 végállapotot tartalmazta, ezért újraalkalmazás nem történt.
- [x] Production `PRAGMA foreign_key_check` PASS; korábbi E4.3.7 `quick_check` PASS bizonyíték megőrizve.
- [x] Mind a hat érintett production táblán `site_id TEXT NOT NULL` schema PASS.
- [x] Row-count és `site_id` ownership invariáns PASS: pages 9, schedule_items 3, media 0, social_accounts 0, twitch_connections 1, twitch_oauth_states 1; minden meglévő rekord site-scoped.
- [x] FK/index/unique/schema invariáns PASS; production `foreign_key_check` üres és az exact `sqlite_master` audit E4.4.1 contracttal egyező.
- [x] Alkalmazási regression/live smoke PASS: Worker `/api/health`, public pages list, `home` lookup és invalid slug → `PAGE_NOT_FOUND`.
- [x] MASTER checkpoint closure: E4.4 teljesen lezárva; a következő fejlesztési kapu E5.

**E4.4 migration scope:** `pages`, `schedule_items`, `media`, `social_accounts`, `twitch_connections`, `twitch_oauth_states` — mindenhol canonical site ownership, `site_id NOT NULL`, `REFERENCES sites(id) ON DELETE RESTRICT`; a pontos meglévő constraint/index/trigger reprodukciót az E4.4.1 audit hitelesíti.

**MASTER-2.61.0 checkpoint:** E4.2, E4.3.1–E4.3.8 és E4.4 lezárva. Az E4.4 production schema/integrity/ownership/live verification PASS; a következő és egyetlen új fejlesztési kapu az E5. A teljes 1.0 és post-1.0 backlog változatlanul megmarad, és minden új funkció ugyanebbe az egyetlen MASTER-be kerül.

**1.0 fókusz:** először egy stabil, professzionális magyar streamer-weboldal + működő visual editor + Twitch Schedule alap + publish/public flow. A globális piacra szükséges architekturális alapok már 1.0 előtt készülnek, de a teljes többnyelvű tartalom, fordítási workflow, további platformok és haladó SaaS funkciók 1.0 utáni szakaszok.

**Tervezett, szigorú E al-sorrend:**
- **E0 — teljes jelenlegi repo/Editor/domain audit** `[x]`
- **E1 — benchmark/reference code audit** `[~]`
- **E2 — saját canonical architecture decision**
- **E3 — Game Profile + Media + Schedule Event + Presentation contract**
- **E4 — minimális domain/foundation implementation**
- **E5 — regression + D1/live verification + user PASS**
- **E6 — MASTER closure; csak ezután F**

### Kötelező sorrend — 40.69.13 aktív munkapont
**Szigorú szabály:** először csak audit és szerződéstervezés történik. OAuth bekötés, Twitch kódolás vagy Schedule Builder UI implementáció csak az audit eredményének MASTER-be rögzítése után indul.

1. **Twitch integráció teljes audit**
   - OAuth / jogosultságok / token-kezelés;
   - Twitch API kliens és szerveroldali service boundary;
   - stream live/offline állapot;
   - csatorna alapadatok;
   - aktuális kategória/játék;
   - Twitch Schedule API és a meglévő `schedule_items` domain kapcsolata;
   - webhook/EventSub lehetőségek;
   - rate limit, cache, token refresh/recovery;
   - audit/security/secret kezelés.
2. **Twitch → Schedule domain szerződés**
   - a saját `schedule_items` marad a weboldal canonical Schedule domainje;
   - Twitch lehet külső forrás/szinkron, de nem veheti át ellenőrizetlenül a Page Model vagy a saját D1 domain igazságforrás szerepét;
   - egyértelmű source/sync állapot kell;
   - kézi saját adás és Twitchből származó adat együtt kezelhető;
   - ütközés esetén ne történjen csendes felülírás.
3. **Adásrend mint első osztályú Editor v2 blokk**
   - belső node type: `schedule`;
   - UI-ban külön „Adásrend/Menetrend” blokk, nem a generic Sanci blokk része;
   - Editor Inspectorból kezelhető adások;
   - ne kelljen minden streamet külön Text/Image node-okból kézzel felépíteni;
   - a vizuális blokk egy adatvezérelt rendszer legyen.
4. **Játékprofil + sablon rendszer**
   - játékprofilok: név, slug, kép/media, opcionális színek/brand adatok;
   - első példák: Fortnite, Hearthstone, Hades, majd korlátlan új játékprofil;
   - vizuális sablonok külön a játékprofiloktól: Minimal, Gaming, Neon, Cards, Timeline, Weekly Grid, Featured Stream stb.;
   - saját sablon menthető legyen;
   - új játékhoz ne kelljen kódot írni.
5. **Adás rekord modell bővítésének auditja**
   - játékprofil referencia;
   - opcionális eseménykép / borító;
   - cím, leírás/jegyzet;
   - kezdés/végzés;
   - platform;
   - stream URL;
   - státusz;
   - timezone kezelési stratégia;
   - későbbi recurring stream támogatás előkészítése;
   - naptár/emlékeztető későbbi bővíthetőség.
6. **Profi Schedule UX**
   - Next Stream / Next 3 / Weekly / Full / Featured nézet;
   - desktopon kártya/grid/timeline lehetőségek;
   - mobilon rendezett stacked/day-card megjelenítés;
   - helyi időzóna megjelenítés;
   - live/next státusz kiemelés;
   - játék artwork;
   - platform és link;
   - később calendar/reminder és export;
   - social/share formátumok későbbi bővíthetősége.
7. **Integrációs jövőkép**
   - Twitch mellett később YouTube/TikTok/Discord/VOD/Clips integrációk;
   - egységes Integration service layer;
   - a Schedule Builder ne legyen Twitch-specifikus hardcoded rendszer.

### Szigorú architekturális döntések
- [x] Nem készül külön második Visual Editor.
- [x] A legacy Admin Schedule UI-t nem élesztjük újra.
- [x] A `schedule_items` D1 domain megmarad.
- [x] A Page Model nem másolja bele az eseményrekordokat.
- [x] A `schedule` node külön canonical Editor v2 blokk.
- [x] Twitch integrációs contract audit PASS; a B.4–B.13 token lifecycle/security hardening, live reauthorization recovery, production/observability query-string leakage és disconnect/reconnect atomicity/state-transition kapuk lezárultak.
- [ ] Játékprofil/sablon adatmodell még nincs véglegesítve.
- [ ] Inspectorból történő Schedule event CRUD még nincs implementálva.
- [ ] Schedule Builder végső UX még nincs implementálva.
- [ ] End-to-end Twitch → Schedule → Editor → Publish → Public teszt még nincs.

### Tesztkapu
Az aktív pont csak akkor zárható, ha:
- [ ] teljes Twitch kód/adatfolyam audit;
- [ ] token/security/rate-limit stratégia ellenőrizve;
- [ ] Twitch API szerződés és D1 Schedule mapping rögzítve;
- [ ] szükséges migration/data-model terv rögzítve;
- [ ] CI/typecheck;
- [ ] Twitch API integration smoke test;
- [ ] Schedule domain regression;
- [x] no-secret/no-token leakage ellenőrzés — B.12 PASS;
- [ ] MASTER frissítve;
- [ ] felhasználói PASS.

**PC Editor live olvashatósági teszt:** későbbi visszatérő tesztkapu, nem külön aktív fejlesztési ág.

### 40.69.12.B — Live audit megállapítás: legacy Schedule UI / canonical API eltérés

- [x] `src/routes/admin/schedule.ts` teljes létrehozási validáció auditálva.
- [x] A canonical POST body mezői: `title`, `platform`, `startsAt`, `endsAt`, `status`, `url`, `notes`.
- [x] A backend a kezdés/befejezés értékeket `Date.parse()` alapján validálja.
- [x] A meglévő `public/admin.html` Schedule UI nem a canonical kontraktust használja: `startAt` és `endAt` mezőket küld, miközben a backend `startsAt` és `endsAt` mezőket vár.
- [x] A legacy UI ráadásul `/api/admin/schedule/:id` URL-struktúrát használ, miközben a jelenlegi canonical route body-alapú `id` mezőt használ ugyanazon `/api/admin/schedule` végponton.
- [x] Ez magyarázza az `INVALID_SCHEDULE_ITEM` létrehozási hibát; a dátumválasztó önmagában nem bizonyult hibásnak.
- [x] Döntés: a legacy Schedule UI-t nem javítjuk vissza aktív rendszerként, mert a 40.69.9 szerint archivált réteg.
- [!] A live D1 read teszt csak akkor zárható, ha a canonical Schedule domainhez készül egy nem-legacy létrehozási útvonal / tesztadat, vagy a D1-ben kontrollált tesztrekord jön létre.

**40.69.12.B — LIVE LEZÁRÁS — 2026-09-22**
- [x] Canonical POST → D1 rekord létrehozás PASS.
- [x] Public read PASS.
- [x] `next` PASS.
- [x] Platform filter PASS.
- [x] Status filter PASS.
- [x] A legacy Schedule UI nem lett újraaktiválva.
- [x] Felhasználói tesztkapu lezárva.

**TÖRTÉNETI — NEM AKTÍV — korábbi checkpoint:** **40.69.12.C — Editor preview renderer.**

**TÖRTÉNETI — NEM AKTÍV — korábbi checkpoint:** 40.69.12.C — Editor preview renderer.
## 40.69.9 — CANONICAL PAGES / VISUAL EDITOR / SCHEDULE ARCHITEKTÚRA TELJES AUDIT — 2026-09-22

**Állapot:** [~] AUDIT FOLYAMATBAN — ebben a lépésben nincs kódmódosítás.

### Audit eredmény
- [x] A jelenlegi aktív Visual Editor a `public/editor-v2/` rendszer: közös state, command, schema, validation, canvas, property registry, responsive, rich-text, diagnostics és core tesztek.
- [x] `/admin/editor` közvetlenül az Editor v2 felületre nyit; nem a régi `public/editor/` rendszert használja.
- [x] A canonical oldal-életciklus: `/api/admin/pages` + `/api/admin/editor` + `editor_revisions` + draft/published snapshot + rollback/audit.
- [x] A régi `public/assets/system-page-editor.js` fix 9 rendszeroldalas modellt és külön `/api/admin/system-pages` GET/PUT rendszert használ; create/delete nincs.
- [x] A régi `public/assets/system-page-runtime.js` külön `system_page_content` adatmodellt renderel, tehát nem a canonical Page Modelt.
- [x] A repositoryban külön `public/editor/` legacy editor-kódbázis is van; ez nem lehet az új fejlesztések alapja.
- [x] `public/admin.html` legacy admin UI; tartalomkezelési API-szerződése eltér a canonical pages API-tól, ezért nem lehet a jövőbeli Visual Editor forrása.
- [x] Az Adásrend D1 CRUD backendje már működik; a 40.69.8 live create/update/delete teszt PASS.
- [x] Döntés: az Adásrend adat-domainje marad külön D1-ben, de a vizuális Adásrend oldal canonical `pages` + Editor v2 dokumentum lesz.
- [x] Döntés: nem készül külön Schedule Editor és nem marad fenn második Visual Editor.

### Hol van a weboldal szerkesztő a MASTER-ben?
A weboldal-szerkesztő **már elkészült alapként**: ez az Editor v2. A MASTER további editor-pontjai ennek a canonical rendszernek a folyamatos bővítései. Az Adásrend-készítő ennek egy domain-specifikus felhasználási rétege lesz, nem új szerkesztő.

### 40.69.9 — LEGACY ARCHITEKTÚRA ARCHIVÁLÁSA — [x] PASS

A teljes audit után a régi rendszer működési útvonalait leválasztottuk a canonical rendszerről.

- [x] `/admin` és `/admin.html` többé nem nyitja meg a legacy admin UI-t; authenticated felhasználót az `/admin/editor` canonical Editor v2-re irányít.
- [x] `/api/admin/system-pages` route-regisztráció megszüntetve.
- [x] `/api/public/system-pages` route-regisztráció megszüntetve.
- [x] `system-page-runtime.js` automatikus HTML-injektálása megszüntetve.
- [x] A régi Editor/Admin/System Page fájlokat nem töröltük véglegesen; dokumentált legacy archív rétegként megmaradnak visszaállítási lehetőséggel.
- [x] Archiválási dokumentum: `docs/ARCHIVE-LEGACY-LAYERS.md`.
- [x] A `system_page_content` D1 adatot ebben a lépésben nem töröltük; cleanup/migráció külön kapu lesz.
- [x] A canonical rendszer egyetlen aktív Visual Editorja továbbra is `public/editor-v2/`.

**Implementációs commitok:**
- `3a8c9afbe52429e84d2c2d7272215ae52e558b95` — legacy route/runtime leválasztás
- `c5ad2b870a11b394d07903ca1e35c4c9425f6bd5` — legacy archívum dokumentálása

**Fontos:** a régi fájlok fizikai törlése/migrációja nem része ennek a kapunak. Előbb az új canonical Schedule/Page rendszert kell felépíteni és validálni; utána külön cleanup kapuban lehet véglegesíteni a régi adatot/fájlokat.

### Következő egyetlen aktív pont
**40.69.10 — Canonical Schedule Builder szerződés:** az Adásrend D1 domain-adat és a canonical Pages + Editor v2 dokumentum közötti kapcsolat teljes auditja, majd az új builder implementációs terv. Kódmódosítás csak az audit lezárása után.


**40.69.7 lezárás:**
- [x] CI/typecheck/editor-core PASS.
- [x] Cloudflare deploy zöld.
- [x] Célzott live `page.update` + `audit_log` együttállás PASS.
- [x] MASTER-2.39.63-ban a 40.69.7 lezárása dokumentálva.

**40.69.8 audit szabály:** először csak teljes érintett kód- és adatfolyam-audit; kódmódosítás kizárólag bizonyított hiányosság esetén. A vizsgálat fókusza: page create/update/delete/rename, save/publish/unpublish/rollback, valamint minden további admin state mutation audit lefedettsége. Nem indítunk új UI- vagy platformfunkciót.

**Aktív munkasáv száma:** **1**

**Nem aktív:** PC/Desktop, Mobile/Touch, Rich Text, Group/Ungroup, Page CRUD, 40.68 és minden más régebbi vagy későbbi fejezet. Ezek csak történeti dokumentáció, lezárt tesztek vagy későbbi backlogok. A PC és Mobile nem külön fejlesztési sáv, hanem ugyanazon funkció tesztfelülete.

### 40.69.5.B — ROLLBACK LIVE SMOKE TEST — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **„Működik”**.

- [x] Revision előzmények panel betölt.
- [x] Korábbi revision kiválasztható és visszaállítható.
- [x] Rollback megerősítés működött.
- [x] A draft visszaállt a kiválasztott korábbi állapotra.
- [x] A rollback új revisionként jött létre.
- [x] Újratöltés után a visszaállított draft megmaradt.
- [x] A felhasználói live teszt eredménye: **Működik**.
- [x] A rollback nem tekintendő automatikus publishnak; a published snapshot külön tesztkapu.

**TÖRTÉNETI — NEM AKTÍV — korábbi checkpoint:** published snapshot + unpublish regressziós teszt.

### 40.69.5.C — PUBLISHED SNAPSHOT REGRESSZIÓ: PRE-PUBLISH JAVÍTVA, POST-PUBLISH HIBA — 2026-09-22

**Állapot:** [~] BLOKKOLVA — felhasználói teszt alapján a módosított draft normál publikus oldalon már nem jelenik meg publikálás előtt, viszont publikálás után sem jelenik meg a publikus oldalon.

**Elvégzett audit:**
- [x] `src/routes/public/pages.ts`: normál publikus kérés többé nem szolgál ki automatikusan editor draftot; draft csak explicit, jogosított `?preview=1` esetén használható.
- [x] `src/routes/admin/editor.ts`: Publish ugyanabban a D1 batch-ben frissíti a `content_json`, `editor_revisions`, `published_content_json`, `published_revision_id` és `is_published` mezőket.
- [x] `public/assets/page-renderer.js`: normál `/p/<slug>` oldal `/api/public/pages?slug=...` végpontot hív `preview` nélkül, `cache: no-store` mellett.
- [x] A publikus route normál módban `WHERE is_published=1` feltételt használ és `published_content_json` snapshotból renderel.
- [ ] Meg kell határozni, miért nem látszik a frissen publikált snapshot a tényleges live publikus útvonalon.
- [ ] Következő egyetlen aktív lépés: live API/D1 állapot ellenőrzés ugyanazon pageId/slug mellett: `is_published`, `published_revision_id`, `published_content_json`, valamint `/api/public/pages?slug=...` válasz összevetése.
- [ ] Ezután csak a bizonyított gyökérok minimális javítása és újraépítés/deploy következhet.

**Fontos:** a pre-publish draft leak javítását nem tekintjük kész regressziónak, amíg a Publish → LIVE útvonal ugyanazon teszten nem igazolt.


### 40.69.5.C — PUBLISHED SNAPSHOT REGRESSZIÓ: PUBLISH UI GYÖKÉROK AZONOSÍTVA — 2026-09-22

**Állapot:** [~] BLOKKOLÓ GYÖKÉROK AZONOSÍTVA; KÓDJAVÍTÁS ELŐTT.

A live D1/API audit bizonyította:
- [x] is_published=1.
- [x] published_revision_id pontosan a LIVE revisionre mutat.
- [x] published_content_json byte-pontosan megegyezik a published revision document_json értékével.
- [x] A publikus API normál módban ezt a published snapshotot adja vissza.
- [x] v10 publikált dokumentum a korábbi, üres root állapot.
- [x] v11 draft már tartalmazza az új Section/Stack/Row node-hierarchiát.
- [x] A jelenlegi v11 mentés után a Publish UI nem indít új publish revisiont.

**Bizonyított kliens oldali gyökérok:**
A public/editor-v2/app.js syncPublishControls() függvénye a Publish gombot feltétel nélkül letiltja, ha az oldal már publikált: publish.disabled=published.
Ez azt jelenti, hogy ha egy már LIVE oldalon új draft módosítás történik, a jelenlegi UI nem engedi ugyanazt a módosított draftot újra publikálni. A szerveroldali save(true) útvonal viszont erre képes lenne.

**Következő egyetlen aktív lépés:**
1. csak a Publish UI állapotlogikáját javítjuk úgy, hogy már publikált, de dirty draft esetén a Publish/Re-publish művelet engedélyezett legyen;
2. ugyanazt a meglévő save(true) → POST /api/admin/editor útvonalat használjuk;
3. nem készül második publish state vagy API;
4. reread + CI/build + deploy;
5. élő teszt: v11 draft → Publish → új published revision → published_content_json = új revision → public API már az új node-hierarchiát adja.

**PC/Desktop live teszt:** továbbra is PENDING, nem indul.

### 40.69.5.D — REPUBLISH LIVE SMOKE TEST — 2026-09-22

**Állapot:** [x] PASS — felhasználói élő teszt: **„Működik”**.

- [x] Már publikált, de módosított draft esetén a Publish vezérlő újrapublikálható állapotba kerül.
- [x] A gomb felirata dirty állapotban **„Újrapublikálás”**.
- [x] A meglévő save(true) → POST /api/admin/editor útvonal maradt az egyetlen publish útvonal.
- [x] Nem került be második publish state vagy párhuzamos API.
- [x] A felhasználói live teszt eredménye: **Működik**.
- [x] A korábbi hibát okozó publish.disabled=published UI-logika javítva lett.
- [x] Javító commit: c3740fb910042ddab707212abe55eb291983a71d — fix: allow republish for dirty published drafts.

**40.69.5 regressziós kapu lezárása:** a rollback és az újrapublikálás felhasználói élő tesztje PASS. A PC/Desktop live teszt továbbra is PENDING és nem indul automatikusan.

**Következő egyetlen aktív lépés:** 40.69.6 teljes revision/persistence audit; csak audit alapján készülhet új kódmódosítás.


### 40.69.6 — REVISION PERSISTENCE TELJES AUDIT — 2026-09-22

**Állapot:** [x] AUDIT PASS — új kódmódosítás nem szükséges ebben a lépésben.

**Áttekintett fő útvonalak:**- `src/routes/admin/editor.ts`: Save, Publish, Rollback, Unpublish, expectedVersion, revision numbering.
- `src/routes/admin/pages.ts`: page list revision source, metadata/slug revision, published linkage, page-create + initial revision batch.
- `src/routes/public/pages.ts`: normal public route kizárólag published snapshotból dolgozik; explicit preview külön auth-gated.
- `src/core/page-model.ts`: canonical `sanci-page-document` normalizálás.
- `src/core/editor-validation.ts`: Publish előtti hierarchy/Page Model validation.
- `migrations/0010_canonical_revision_contract.sql`: published revision linkage és meglévő snapshotok visszakötése.
- `public/editor-v2/app.js`: egyetlen `save(true)` publish útvonal és a republish UI állapot.
- `.github/workflows/editor-core-test.yml`: Node 24 + install + typecheck + editor core teszt.

**Audit eredmények:**
- [x] `pages.content_json` továbbra is a draft snapshot.
- [x] `pages.published_content_json` továbbra is a LIVE snapshot.
- [x] `pages.published_revision_id` a LIVE snapshot konkrét revisionjére mutat.
- [x] Save/Publish/rollback revision számozása az `editor_revisions` MAX(version) értékéhez igazodik.
- [x] `expectedVersion` védelem nincs megkerülve.
- [x] Rollback draft-only marad; nem publikál automatikusan.
- [x] Publish egy D1 batchben írja a draftot, revisiont és LIVE snapshotot.
- [x] Page create + initial revision egy D1 batch.
- [x] Normál public route nem szolgál ki draftot.
- [x] Republish nem hozott létre második publish-rendszert.
- [x] A vizsgált canonical state/persistence útvonalban nem találtunk olyan hibát, amely most új kódmódosítást indokolna.

**Megállapított következő audit-téma:** az üzleti state-módosítások és az `audit_log` írása jelenleg több helyen külön lépés. Például Publish/Save/rollback/unpublish után az audit insert külön történik. Ez nem rontotta el a mostani live regressziós tesztet, de hiba esetén az üzleti művelet és az audit esemény eltérhet.

**Következő egyetlen aktív lépés:** 40.69.7 — audit-log atomicity és persistence-boundary hardening célzott audit.


### 40.69.7 — AUDIT-LOG ATOMICITY HARDENING — 2026-09-22

**Állapot:** [x] PASS — implementálva, CI/typecheck/editor-core PASS, Cloudflare deploy zöld, célzott live audit PASS.

**Elvégzett módosítás:**
- [x] Létrejött a közös `src/core/audit.ts` `auditStatement()` helper.
- [x] Editor Save/Publish/Unpublish/Rollback audit statementek a state-módosítással azonos D1 batch-ben futnak.
- [x] Page create/delete/update audit statementek a megfelelő state-módosító batch részei.
- [x] Megszűnt a különálló `await audit(...)` persistence-lépés az érintett Editor/Page admin útvonalakon.
- [x] Nem készült második audit-rendszer.

**Módosító commitok:**
- `3e424605a5599f32f7e94f546c4eeaa3ad76e00f` — audit helper
- `e7389f87102227155f9b9998d9114c5a0f51ca48` — editor atomic audit
- `95fb08738c69b5c47710efd6fbd8ebb674005ed1` — page update atomic audit

**CI / typecheck / Editor Core teszt — 2026-09-22:**
- [x] CI zöld.
- [x] Typecheck PASS.
- [x] Editor Core Test PASS.
- [x] A 40.69.7 tesztkapu kódoldali/CI része lezárható.
- [x] Deploy ellenőrzés — a felhasználó visszaigazolta, hogy az utolsó Cloudflare állapot zöld.
- [x] Célzott live audit — az `uj-oldal` cím módosítása `Új oldal` → `Új oldal test` sikeresen létrejött a `pages` táblában, és ugyanahhoz a pageId-hoz `page.update` audit rekord jött létre.
- [x] Audit metadata ellenőrzés: `version=15`, `revisionId=924b38b0-8d7f-4fac-acbb-4696dc7e421e` rögzült az audit rekordban.
- [x] Az audit rekord időpontja közvetlenül a state-módosítás előtt/azzal összhangban jelent meg; a live smoke teszt bizonyította, hogy a canonical admin update útvonal az auditot is létrehozza.

**Live teszt eredmény:** PASS — a state-módosítás és a megfelelő `audit_log` esemény együtt igazolva.

**TÖRTÉNETI — NEM AKTÍV — korábbi checkpoint:** 40.69.7 lezárva; a következő egyetlen aktív pont kijelölése a MASTER index alapján, külön audit után.

**Fontos:** a kódot a módosítás után újraolvastuk; a CI/typecheck/editor-core tesztkapu zöld. PC/Desktop live teszt továbbra is PENDING.


### Kötelező folytatási szabály
1. Csak a kék **EGYETLEN AKTÍV PONT** dolgozható fel.
2. Egy ponton belül is csak **egy következő lépés** lehet kijelölve.
3. A következő pontot csak akkor írjuk át aktívra, ha az előző pont implementációja + szükséges tesztje + user PASS + MASTER frissítése megtörtént.
4. Minden lépés után a MASTER tetején lévő indexet azonnal frissíteni kell.
5. Ha új funkció merül fel, először backlogba kerül; **nem nyithat második aktív sávot**.
6. PC/Desktop live teszt csak külön felhasználói kérésre indítható; ettől nem jön létre külön munkasáv. A korábban csak mobilon élőben ellenőrzött funkciók PC/Desktop tesztje későbbi visszatérő tesztkapu marad.
7. Új beszélgetés mindig ezt az indexet olvassa először. A folytatás automatikusan a kék aktív pontról indul.

### Új beszélgetés checkpoint
**„Folytassuk a Sanci9517 MASTER tervet. Először olvasd el a 00/A MASTER VÉGREHAJTÁSI INDEXET, és csak az ott megjelölt egyetlen aktív pontot folytasd. A régi fejezetek státuszait ne tekintsd aktív feladatnak.”**

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