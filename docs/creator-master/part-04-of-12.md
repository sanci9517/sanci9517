### 63.15. Tételes checklist-megfeleltetés — 54.13–54.16

| Forrás | Ellenőrzőpont | Stabil ID / kanonikus modul | Megfeleltetés megjegyzése |
|---|---|---|---|
| 54.13 | AI Control Center: provider/model, költségkeret, kvóta, retention, adatforrás és stop switch | AI-001, AI-004, AI-010, AI-017, SEC-008, OPS-007 | Provider, usage és adatkezelési korlátok közös vezérlőfelülete. |
| 54.13 | Projekt-/brandkontextus jogosultsággal és megtekinthető forrásokkal | AI-004, AI-006, AI-018, DSN-003 hivatkozás | Kontextus csak engedélyezett domainből; források és kizárt mezők megtekinthetők. |
| 54.13 | Website Designer: oldal/komponens/dizájn/responsive/SEO/accessibility javaslat | AI-011–012, AI-007–009, EDT-001–026, DSN-001–007 hivatkozás | Az AI a kanonikus Editor/API szerződéseken dolgozik; nem épít második editort. |
| 54.13 | Live Coach: opt-in technikai jelzések, pillanatjelölés és stream-/chat-összegzés | AI-015, AI-004, LIV-006, OBS-003, OBS-008, SEC-011 | Opt-in és adatforrás-korlát; jelölés/javaslat nem egyenlő automatikus végrehajtással. |
| 54.13 | Content Producer: transcript, clip, felirat, fordítás, thumbnail, cím és platformvariáns | AI-013–014, AI-021, CNT-011–012, CNT-018–022, LOC-006 | A Content Studio a tartalom és a renderelt assetek kanonikus gazdája. |
| 54.13 | Community Assistant: FAQ, összegzés, moderációs javaslat és tagsági művelet-előkészítés | AI-016, AI-018–019, COM-009, COM-011, SUP-006 | AI javaslatot készít; moderációs, tagsági és hozzáférési döntés a domain policy szerint. |
| 54.13 | Business Analyst: tartalom/kampány elemzés, hipotézis, mérhető teszt | AI-013, AI-015–016, ANL-004, ANL-007–010, CAM-007 | Forrás, minta, bizonytalanság és mérhető validáció kötelező. |
| 54.13 | Automation Builder: természetes nyelvből workflow-draft, szimuláció és diff | AI-003, AI-005, AI-007–009, AUT-009–010 | Az első eredmény draft; aktiválás külön jóváhagyás. |
| 54.13 | Kép-/grafika-/hang-/videógenerálás megfelelő külső modellel/szolgáltatóval, licenc- és költségkorláttal | AI-001, AI-010, AI-021, RES-007, OPS-010 | Provider capability, licenc, költség, biztonság és eredet ellenőrzendő. |
| 54.13 | AI-művelet domain API-n át; kockázati szint, preview, jóváhagyás, napló és visszaállítás | AI-005–009, AI-019, SEC-002–003, OPS-009 | Nincs közvetlen, ellenőrizetlen adatbázis- vagy UI-módosítás. |
| 54.13 | Generált tartalom jelölése, forrás és bizonytalanság, felhasználói visszajelzés | AI-002, AI-007, AI-010, AI-018, AI-021 | Modell/verzió, forrás és felhasználói feedback rögzítendő. |
| 54.13 | Manuális, AI nélküli út minden alapvető termékfolyamathoz | AI-020, QA-008–009 | Az AI nem lehet kritikus funkció egyetlen elérési útja. |
| 54.14 | Admin és publikus web külön nyelvi beállítással | LOC-001–003, SET-001 | Admin UI-locale és publikus tartalom locale külön konfiguráció. |
| 54.14 | Magyar elsődleges nyelv, további nyelvek fokozatos bevezetése | LOC-001, LOC-003, LOC-005, SET-001 | Magyar az alapértelmezés; további locale nem jelenhet meg késznek hiányos fordítással. |
| 54.14 | Locale-onkénti oldal-/CMS-tartalom, menü, média, alt text, SEO és Open Graph | LOC-003–005, WEB-009, SEO-001–005, RES-007 | Locale-specifikus tartalom és metaadat; hiány esetén explicit fallback. |
| 54.14 | Lokalizált slug/URL, hreflang/canonical szabályok és nyelvi fallback | LOC-004, SEO-001, SEO-004, WEB-002, WEB-013 | URL és SEO-konfliktusok validálása publikálás előtt. |
| 54.14 | Dátum/idő/pénznem/szám lokalizáció, időzóna és nyári időszámítás | LOC-002, SCH-003, STO-002, SET-001 | Domainérték tárolása és locale szerinti megjelenítés nem keverhető. |
| 54.14 | RTL layout, billentyűzet, font fallback és hosszabb fordítások tesztje | LOC-002, LOC-005, QA-004–005, DSN-007 | Valós RTL és hosszú szöveg teszt szükséges, nem csak fordítási string. |
| 54.14 | Fordítási memória/szószedet és AI-fordítás emberi jóváhagyással | LOC-006, AI-007, AI-019 | Automatikus fordítás draft; publikálás előtt review. |
| 54.14 | Nyelvváltó, automatikus nyelvajánlás és felhasználói választás megőrzése | LOC-001, LOC-003, LOC-005, WEB-009 | Választás tiszteletben tartása; automatikus ajánlás nem kényszeríthet nyelvváltást. |
| 54.15 | Profil, site/workspace, locale, timezone, dátum/pénznem és preferenciák | SET-001–002, TEAM-001, LOC-001–002 | User preference és site setting külön scope. |
| 54.15 | Szerepek: owner/admin/editor/moderator/analyst/commerce és modulonkénti engedély | SEC-002–003, TEAM-002–004 | RBAC szerveroldali, modul- és műveletszintű ellenőrzéssel. |
| 54.15 | Szerveroldali authorization, site/tenant izoláció és minimális jogosultság | SEC-002–003, SEC-006–008, QA-003 | Negatív cross-site tesztek kötelezők. |
| 54.15 | Session, 2FA/SSO később, secret rotation, rate limit és gyanús aktivitás | SEC-001, SEC-007–008, SEC-012, OPS-003 | 2FA/SSO státusz és ütemezés külön kezelendő; secret soha nem kerül logba. |
| 54.15 | Titok/token/payment adat redakció; titkosított token storage | INT-004, INT-019, SEC-008, SEC-010 | Secret lifecycle és redaction mind a logban, mind diagnosztikai exportban. |
| 54.15 | Consent, cookie/privacy, retention, export/delete és adatfeldolgozók | SEC-010–011, COM-017, ANL-009, AI-004 | Domainonkénti retention/consent és ellenőrzött export/delete. |
| 54.15 | Backup, restore próba, verziózott mentés, import/export és disaster recovery | OPS-005–006, OPS-009, QA-007 | Restore drill bizonyíték nélkül nincs PASS. |
| 54.15 | Health, job queue, webhook, API-quota, error log és audit log | OPS-001–003, OPS-007, OPS-011, INT-008, AUT-008 | Egységes diagnosztika, korrelációs azonosítók és secret-redaction. |
| 54.15 | Idempotencia, retry, timeout, cache invalidation, stale-data és partial-failure kezelés | AUT-006–008, INT-008–009, DYN-005–006, WEB-030, OPS-011 | Domainonkénti retry és közös megfigyelhetőség; nincs végtelen újrapróbálás. |
| 54.15 | Undo/redo, revision diff, restore és törlés előtti függőségi vizsgálat | EDT-005, EDT-029–031, WEB-007–008, RES-008–009, OPS-005 | A visszaállítás a megfelelő domain saját verziómodelljén fut. |
| 54.15 | WCAG 2.2 AA cél, reduced motion, screen reader, kontraszt, fókusz és touch target | QA-004–005, EDT-037, EDT-040, DSN-003 | Akadálymentességi acceptance minden fő UI-útvonalon. |
| 54.15 | Mobil/tablet/desktop, gyenge hálózat, offline-jelzés és adatvesztés elleni védelem | QA-004, EDT-035–036, EDT-031, EDT-042, ADM-008, OPS-003 | Responsive és hálózati hibateszt külön acceptance. |
| 54.15 | Tesztek: domain, integration, authorization, migration, UI, accessibility, responsive, E2E és smoke | QA-001–009 | A tesztkatalógus nem puszta felsorolás: futási eredmény és evidence szükséges. |
| 54.16 | Dokumentált API, webhook registry, API-key kezelés, tesztelő és sandbox | DEV-001–004, DEV-006, INT-017, SEC-008 | Developer Platform/API modul; scope, expiry, rate limit és audit. |
| 54.16 | Extension/widget/overlay manifest, schema, permission, verzió és kompatibilitás | MKT-001–002, MKT-004, OBS-010, DEV-005 | Extension manifest és SDK külön szerződés; kompatibilitás tesztelendő. |
| 54.16 | Eredet/licenc/aláírás, sandbox, felülvizsgálat, frissítés, eltávolítás és visszavonás | MKT-001–004, OPS-010, SEC-002–008 | Bővítmény és dependency supply-chain kockázat kezelendő. |
| 54.16 | Template/component/overlay/workflow marketplace későbbi fázisban | MKT-003–005, DSN-018, AUT-013 | Marketplace későbbi fázis, jogi/licenc és fizetési kapuval. |
| 54.16 | Több site/workspace, aktív workspace választó, csapatmeghívás és szerepek | TEAM-001–004, TEAM-005, SEC-003 | Aktív scope explicit; minden kérés szerveroldalon ellenőrzött. |
| 54.16 | Agency/studio mód, ügyfélhozzáférés, közös sablonok és jóváhagyás | TEAM-007, TEAM-003–004, DSN-008–015 | Kliensenkénti brand, adat és jóváhagyás izolált. |
| 54.16 | Későbbi SaaS billing, csomag, használati limit, számla, lemondás és adat-export | TEAM-006, STO-021, OPS-007 | Billing és plan entitlement nem keverhető a store-rendelés domainnel. |
| 54.16 | Tenant izoláció, migráció, skálázás, adatrezidencia és költségfelügyelet | SEC-003, OPS-004–006, OPS-008–011, TEAM-005–006 | Későbbi SaaS-kapu; migráció/restore és költségmodell bizonyítékkal. |

**Állapot:** a 54.13–54.16 tételek stabil ID-khez vannak rendelve. A 54.1–54.16 teljes checklistének tervszintű megfeleltetése most elkészült; a következő audit a 156 sorhoz rendelt ID-k létezését, szemantikai pontosságát, valódi duplikációit és a 49. fejezet modulhatáraival való összhangját ellenőrzi. Ez még nem igazolja a runtime implementációt vagy az acceptance-tesztek PASS állapotát.

### 63.16. Tervszintű keresztmegfeleltetési ellenőrzőpont — 2026-10-14

Az ellenőrzés a kanonikus terv aktuális GitHub-változatán futott. Eredmény:
- A 54. fejezetben **156 checklist-tétel** van; a 63.12–63.15 táblázatokban **156/156** tételhez tartozik külön megfeleltetési sor.
- A megfeleltetési sorokban használt stabil ID-k mind megtalálhatók a 24. fejezetben; a jelen ellenőrzésben nincs feloldatlan ID-hivatkozás.
- A 24. fejezetben **396 stabil funkcióazonosító** szerepel, és az azonosítók egyediek.
- A 49. fejezetben **22 egymást követő főmodul** szerepel 49.1–49.22 között; a média/erőforrás, fejlesztői API, bővítmény-piactér és csapat/SaaS külön főmodul.
- A 54. fejezet normalizált, pontos szövegduplikáció-ellenőrzése korábban nem talált ismétlődő checklist-tételt.

**Korlátok és nyitott munka:** ez strukturális/azonosító-keresztellenőrzés, nem bizonyítja, hogy minden hozzárendelés szemantikailag tökéletes, nincs-e két külön szöveg mögött ugyanaz a képesség, minden domain-szerződés teljes-e, vagy a runtime megvalósítja-e a tervet. Következő feladat a szemantikai duplikáció- és tulajdonosmodul-audit, majd a meglévő kód, API-k, adatmodellek, jogosultságok és tesztek összevetése. A fejlesztési fagyasztás és a tervlezárási kapu változatlanul érvényes; ez az ellenőrzőpont önmagában nem engedélyezi az F0 megkezdését.

### 63.17. Szemantikai duplikáció- és határvizsgálat — első kör

A 24. fejezet 396 funkcióleírásán tokenhasonlósági előszűrés futott. Ez nem dönt automatikusan a duplikációról; a hasonló elnevezések kézi tulajdonosmodul-vizsgálatot indítanak. Az első körben az alábbi hasonlóságokat explicit határleírással oldottuk fel a stabil ID-k definíciójában:

- **INT-017 ↔ SEC-009:** provider webhook delivery/integráció vs. keresztmodulú biztonsági követelmény és negatív teszt.
- **WEB-017 ↔ CNT-020; WEB-016 ↔ SCH-010:** publikus oldal/route-shell vs. kanonikus tartalom-/schedule projection.
- **CNT-005 ↔ STO-003 ↔ RES-006:** content taxonómia vs. termékkatalógus taxonómia vs. asset library taxonómia.
- **ADM-008 ↔ DYN-005:** közös Admin UI-állapot komponensek vs. dinamikus binding runtime állapotgép.
- **RES-005 ↔ CNT-006 ↔ DYN-003:** asset könyvtár keresése vs. content könyvtár keresése vs. whitelistelt dinamikus lekérdezési műveletek.
- **INT-018 ↔ AI-001:** külső integrációk provider-capability katalógusa vs. AI modell/provider registry.
- **CNT-018 ↔ AI-014:** content-domain artifact/review lifecycle vs. AI által javasolt jelölt.
- **COM-013 ↔ SUP-005/SUP-011:** közösségi felületi hozzáférés-ellenőrzés vs. tagsági entitlement definíció.
- **AUT-008 ↔ SEC-010:** workflow run history vs. keresztmodulú security/privacy audit.
- **EDT-039 ↔ AUT-004:** oldalelem-interakciós séma vs. automation action catalog és szerveroldali engedélyezés.
- **DSN-014 ↔ AI-002:** vizuális template lifecycle vs. AI prompt-template lifecycle.
- **INT-001 ↔ STO-008:** általános provider adapter contract vs. Store checkout workflow adapter.
- **SCH-011 ↔ CNT-019:** két külön Editor-blokk; az egyik schedule, a másik content feed adatforrását fogyasztja.
- **SEC-003 ↔ TEAM-001/TEAM-005:** security isolation invariant vs. workspace selector/multi-site termékfolyamat.
- **OPS-005 ↔ QA-007; WEB-007 ↔ QA-007:** működési képesség vs. az azt bizonyító tesztkapu.

A hasonló prefixű provider adapterek (például TikTok/Kick), különböző template-típusok, valamint a publikus oldalak különböző route-jai önmagukban nem duplikációk: külön képességek vagy külön domain-típusok. Az explicit határleírások megőrzik a szükséges funkciókat, miközben megakadályozzák a párhuzamos adatgazdák létrehozását.

**Állapot:** az első körös, névszintű hasonlósági jelzések közül a fő modulhatár-ütközések definíciója tisztázva lett. A teljes szemantikai audit továbbra is IN PROGRESS: az ID-k és a 54. fejezet tételes megfeleltetésének véglegesítéséhez a domain-katalógus, API-k, adatmodellek, tényleges UI és tesztek összevetése szükséges.

### 63.18. Hasonlósági előszűrés — fennmaradó külön képességek

A 396 stabil ID leírásának második, név/token alapú előszűrésében fennmaradt magas hasonlóságok kézi osztályozása:

- **RES-006 / CNT-005 / STO-003:** hasonló taxonómiai műveletek, de eltérő kanonikus adattípusok (asset, content, product); az egyes definíciók kifejezetten kizárják a másik domain taxonómiájának birtoklását.
- **DSN-008–DSN-011:** site-, page-, section- és component-template könyvtárak; külön alkalmazási szint, közös design/template infrastruktúra.
- **INT-014 / INT-016:** TikTok- és Kick-adapterek; külön provider és külön capability/engedély.
- **RES-005 / CNT-006:** asset registry vs. content library keresés; közös UI-minta, eltérő domain query.
- **ANL-001 / AUT-001:** analytics eseménynév-/mérési taxonómia vs. workflow trigger-katalógus; az eseményforrás közös lehet, de az analitikai jelentés és a workflow végrehajtás külön szerződés.
- **WEB-016 / WEB-017, WEB-014 / WEB-018, WEB-015 / WEB-023 és a többi publikus route-pár:** külön publikus oldaltípusok; hasonló oldalszerkezet nem jelent azonos tartalmi célt.
- **SCH-011 / CNT-019:** két Editor-blokk, két eltérő domain-adatforrással.
- **DSN-014 / AI-002:** vizuális sablonverziózás vs. AI prompt/instruction verziózás.
- **INT-018 / AI-001:** külső integrációs capability vs. AI modell/provider capability.

Ezeket a párokat nem szabad pusztán szöveghasonlóság miatt összevonni. A tényleges összevonás csak akkor engedhető meg, ha a domainmodell, az adatforrás, a jogosultság, az életciklus és az elfogadási teszt is azonos, és az összevonás nem veszít el képességet.

**Állapot:** a szöveghasonlósági előszűrés és az első körös határmagyarázat elkészült. Ez nem zárja le a teljes szemantikai auditot: a továbbiakban a domain/adatmodell/API/UI/test evidence alapján kell ellenőrizni, hogy a szándékolt határok a terv többi fejezetében is következetesek-e.

### 63.19. Domain-térkép és felhasználói főmodulok egyeztetése

A 49. fejezet felhasználói navigációs moduljai és az 5. fejezet domain/adatforrás-térképe eltérő nézőpontok: egy modul több domain szolgáltatást fogyaszthat, egy domain több felületet kiszolgálhat, de üzleti képességenként egyetlen kanonikus adatgazda marad. Az 5. fejezet ezért kiegészült a lokalizáció, SEO/publikációs metadata, form beküldések, értesítések, permission-aware keresés, fan identity, OBS/overlay, Developer API, extension registry és SaaS billing/plan domainekkel.

Különösen fontos határok:
- **SEARCH / Dashboard:** indexelt és összesített olvasási nézet; soha nem írhatja felül a forrásdomaint.
- **FAN_IDENTITY / IDENTITY:** a creator/Admin session és a publikus rajongói fiók külön biztonsági határ.
- **DEVELOPER_API / EXTENSION:** az API key/webhook/API lifecycle nem azonos a telepített extension manifest/sandbox lifecycle-jával.
- **BILLING_PLAN / ORDER / ENTITLEMENT:** SaaS-előfizetés és platformcsomag nem azonos a creator boltjának rendelésével vagy a fan tagsági hozzáféréssel.
- **STREAM_TOOLS / INTEGRATION / AUTOMATION:** OBS pairing/overlay konfiguráció, külső provider-auth és workflow execution külön domainfelelősség.

**Állapot:** a domain-térkép szerkezeti teljessége bővült, és a provider-adapter, derived cache, creator webhook, fan identity, order és support owner határai egyértelműbbek lettek; a teljes schema/API/runtime egyezés továbbra is kód- és tesztbizonyítékot igényel.

### 63.20. Kanonikus főmodul → domain/adatgazda keresztmátrix

Ez a mátrix összeköti a 49. fejezet felhasználói moduljait az 5. fejezet kanonikus domainjeivel. A modul a felhasználói belépési pont; a domain az üzleti adat és lifecycle gazdája. Ha egy sor több domaint sorol fel, mindegyik külön szerződése megmarad, nem olvad össze egyetlen közös adattárrá.

| Kanonikus főmodul | Elsődleges domain/adatgazda | Határszabály |
|---|---|---|
| 49.1 Kezdőlap és napi áttekintés | ADM UI contract; permission-aware read projections | Aggregál és navigál; nem birtokolja a schedule, content, integration, order vagy analytics rekordokat. |
| 49.2 Weboldal | SITE, PAGE, REVISION, NAVIGATION, SEO_PUBLICATION, FORM_SUBMISSION | Page Model a megjelenítést/configot birtokolja; domainblokkok csak hivatkoznak más domainek adataira. |
| 49.3 Márka és designrendszer | DESIGN_SYSTEM | Tokenek, témák és template-masterek; bináris assetek a RESOURCE-ban. |
| 49.4 Média- és erőforráskönyvtár | RESOURCE | Egy asset registry, asset ID, D1 metadata és R2 bináris; a többi modul csak referenciát használ. |
| 49.5 Élő adás és Stream Studio | LIVE_STATE, SCHEDULE, GAME_PROFILE | Live state, adásrend és játékprofil külön domain; egy felület nem jelent közös rekordmodellt. |
| 49.6 OBS és stream eszközök | STREAM_TOOLS | Overlay/widget/pairing konfiguráció; OBS/provider auth és scope az INTEGRATION szerződését használja. |
| 49.7 Kapcsolatok és integrációk | INTEGRATION | Külső fiók, OAuth/token reference, scope, provider capability és inbound webhook. |
| 49.8 Tartalomstúdió | CONTENT, PUBLISHING | Tartalomrekord és publikálási queue; asset a RESOURCE, kampány a CAMPAIGN, provider connection az INTEGRATION tulajdona. |
| 49.9 Közösség és rajongók | COMMUNITY, FAN_IDENTITY | Community post/moderation és fan identity külön; membership entitlementet az ENTITLEMENT szolgáltatja. |
| 49.10 Bolt és kereskedelem | PRODUCT, ORDER | Termékkatalógus és rendelés külön; payment provider adapter az INTEGRATION-szerződést követi. |
| 49.11 Támogatás és tagság | SUPPORT, ENTITLEMENT | Support provider state és tagsági hozzáférés külön domain; Discord role sync az entitlementből indul. |
| 49.12 Szponzoráció és üzleti központ | CAMPAIGN, SPONSORSHIP | Lead/deal/deliverable és B2B kampány; a riport az ANALYTICS read-modelt fogyasztja. |
| 49.13 Analitika és növekedés | ANALYTICS | Metrikát normalizál/aggregál; nem írja át a forrásdomain üzleti rekordját. |
| 49.14 Automatizációk | AUTOMATION | Workflow/runs/retry; domainmódosítás csak az engedélyezett domain command/API-n keresztül. |
| 49.15 SANCI AI | AI_OPERATION | Javaslat, kontextus, approval és usage; üzleti módosítás a célmodul commandján keresztül. |
| 49.16 Globális keresés és parancspaletta | SEARCH | Permission-aware derived index; a találat a kanonikus domain rekordjára navigál. |
| 49.17 Értesítési központ | NOTIFICATION | Delivery/preference state saját domain; a Dashboard csak összesít. |
| 49.18 Súgó és onboarding | HELP_CENTER | Help content és onboarding progress; ADM csak kontextuális belépési pont. |
| 49.19 Beállítások, biztonság és adat | IDENTITY, SETTINGS, LOCALIZATION, AUDIT, BACKUP; SEC/OPS keresztmetszeti | A globális beállítások nem másolják a domain-specifikus konfigurációt; security policy minden modulra érvényes. |
| 49.20 Fejlesztői platform és API | DEVELOPER_API | Creator által létrehozott API keys/outbound webhooks; provider inbound webhooks az INTEGRATION-ben. |
| 49.21 Bővítmények, widgetek és piactér | EXTENSION | Manifest, install, permission, signature, compatibility és sandbox lifecycle. |
| 49.22 Csapat, több site és SaaS | WORKSPACE, BILLING_PLAN | Workspace/team és SaaS plan/usage külön; nem azonos a Store ORDER vagy fan ENTITLEMENT állapottal. |

**Ellenőrzés:** a jelenlegi 5. fejezet 38 domain-ID-ja mindegyikéhez kijelölhető a fenti főmodulok közül legalább egy kanonikus belépési pont. Ez a dokumentumon belüli felelősségi keresztmátrix; a tényleges kód, adatbázis, API és jogosultsági implementáció egyezését külön auditálni kell.

### 63.21. Termékterv-teljesség és funkcióindítás: két külön bizonyítékkapu

A 24. fejezetben **396 egyedi funkció-ID** szerepel; a 49. fejezet **22 főmodult** definiál. A 54. fejezet 156 elemű felhasználói felülvizsgálati listájának ID-megfeleltetését a 63.12–63.15, a 396 ID egyedi evidenciakiindulását a 63.26–63.37, a fázishoz rendelést a 63.38 tartalmazza. **Ezek együtt a teljes termékterv ellenőrizhető katalógusát alkotják, de nem jelentik, hogy a 396 képesség kész vagy minden implementációs részlet végleges.**

**A kapu — véglegesíthető termékscope / tervkonzisztencia, jelenleg IN PROGRESS:**
- [x] Egyetlen jelenlegi MASTER-fájl, egyetlen aktív tervpont, 396 egyedi ID, 22 főmodul és F0–F11 kanonikus fázisrendszer szerepel.
- [x] A 156 review checklist-elem és a 396 ID előzetes, visszakereshető modul-/fázis-/bizonyítékmátrixba van rendelve (63.12–63.38); ez statikus lefedettség, nem a jelentés teljes helyességének bizonyítása.
- [ ] A korábbi követelmények történeti megőrzése és a hiányzó források kezelése tételesen megvizsgált; „nem sikerült visszanyerni” **nem** egyenlő a „nem volt funkció” állítással.
- [ ] Valamennyi kanonikus modul és cross-module owner, felhasználói belépési pont, közös erőforrás, függőség és fontos negatív journey közötti szemantikai konfliktus feloldva vagy indokolt, lokalizált nyitott döntésként rögzítve.
- [ ] A menü-/modultérkép és a teljes, felhasználóval közösen áttekintett funkciólista jóváhagyott; a későbbi fázisok nem vesznek el a mostani 1.0-scope mögött.
- [ ] A 63.1–63.2 teljes checklisten minden PASS-állításnak konkrét bizonyítéka van; nincs nyitott, release-t blokkoló konzisztenciahiba.

**B kapu — egyetlen munkapont implementációs készsége (26.1 szerinti 17 mező és 25. szerinti státuszmezők):**
- Az adott **következő aktív** funkcióhoz/sub-ID-hoz a 26.1 teljes kártyája kitöltött, a kódolvasásból igazolható tény, az OPEN döntés és a későbbi teszt külön látszik.
- Meglévő route/domain/schema/UI/teszt áttekintése után kötelező a **REUSE / ADAPT / BUILD / DEFER / REJECT** döntés, feltüntetve a megfelelő jogosultságot és a nem kívánt duplikáció elkerülését.
- Pozitív, negatív, authorization, mentés/reload, mobil/accessibility, rollback és provider-failure acceptance csak ott követelhető, ahol releváns; hiányzó bizonyítéknál UNVERIFIED.
- Implementációs PASS csak tényleges teszt/CI/runtime/felhasználói elfogadás alapján. Dokumentációs PASS nem helyettesíti.
- Következő függő munkapont csak az előző lezárása és a MASTER státuszfrissítése után aktív.

**Kritikus különbség:** mind a 396 ID specifikációja, roadmapja és megőrzése a kész *termékterv* része; a 396 ID teljes, különálló végrehajtási kártyájának előzetes, azonos mélységű kidolgozása **nem** teszi automatikusan biztonságosabbá az F0 indulását. A teljes 17 mezős kártya **kötelező az érintett munka aktiválásakor**, nem kell a F10/F11 jövőbeli API-ját úgy előre részletezni, mintha ma ismert lenne. A már meglévő EDT-vázlatok és mély kártyák bizonyítékai megőrzendők, nem törölhetők. A 63.39–63.50 régebbi számadatai és „következő lépései” az adott ellenőrzés történeti pillanatképét jelentik; a **jelenlegi** végrehajtási szabály a 0., 25.–26. és e 63.21 szakasz együttese.

**Állapot:** A kapu IN PROGRESS / NOT PASS (elsősorban történeti forrás- és szemantikai audit); B kapu csak a konkrét aktív funkciónál, külön bizonyítható. F0 még nem aktív. A meglevő kód újraírása tilos igazolt hiány/hiba nélkül.

### 63.22. Meglévő kód újrahasználati audit — első core szelet, 2026-10-14

**Vizsgált ref:** `v2/foundation`. Ez forráskód-olvasási audit; ebben a lépésben nem futtattam tesztet, nem végeztem éles böngészős/Worker ellenőrzést, és nem állítottam runtime PASS-t.

| Terület | Meglévő bizonyíték a repositoryban | Előzetes döntés | Nyitott határ / következő ellenőrzés |
|---|---|---|---|
| Visual Editor v2 — EDT | `public/editor-v2/core/schema.js`, `commands.js`, `state.js`, `validation.js`, `responsive.js`, `property-registry.js`, `app.js`, `tests/core.test.js` | **REUSE + ADAPT** | A Page Model, command/history/transaction, Inspector registry, responsive override és schedule block alapja már létezik. Ne építsünk második Editort. A public renderer paritása, minden node-típus renderelése és a szerveroldali mentési validáció külön ellenőrzendő. |
| Oldalak, mentés és revision — WEB | `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `src/routes/public/pages.ts`, `src/core/page-model.ts` | **REUSE + ADAPT** | Van canonical Page Model normalizálás, D1 page CRUD, revision history, published snapshot, preview authorization és rollback. Az Editor save route alap Page Model alakot ellenőriz; a teljes hierarchia-/schema-validáció csak a publish akción fut, és az expectedVersion mezőt opcionálisként kezeli. Az admin page-create útvonal is engedi az isPublished=true értéket anélkül, hogy a teljes validatePublishDocument ellenőrzést meghívná. A szerveroldali validáció minden mentési/publikálási útvonalon és a revision-konfliktus kötelező kikényszerítése külön kapu. |
| Publikus renderer — WEB/DYN/SEO | `public/visual-page.html`, `public/assets/page-renderer.js`, `src/routes/public/pages.ts`, `src/index.ts` | **ADAPT + BUILD hiányokra** | A renderer csak a node-típusok egy részét kezeli külön; több SANCI provider-blokk ikon/szöveg placeholder. A style() a node.style mezőt olvassa, nem oldja fel a node.responsive értékeket; a currentDevice jelenleg a láthatóságot befolyásolja. A public responsive override/paritás ezért nem bizonyított. A Property Registry csoportlistája tartalmaz animation/interaction/accessibility/SEO/data csoportokat, de a vizsgált properties tömbben ezekhez nincs property definíció, ezért a renderRegistryInspector kihagyja őket. A meglévő box/font/color/asset/shadow típusokhoz sincs külön vezérlő; a select mezőn kívül a generikus text inputot használja. A registryben szereplő csoport vagy típus nem igazolja a teljes, end-to-end szerkesztést és publikus renderelést. A script frissíti a `document.title` és látható cím/leírás értékét, de a vizsgált kódban nincs dinamikus canonical/Open Graph/X-card/structured-data kezelés. A `public/visual-page.html` statikus `robots=index,follow` metaelemet tartalmaz; a repository fa nem tartalmaz `sitemap.xml` vagy `robots.txt` fájlt, és a vizsgált Worker route-regiszterben nem látható ezek generálása. A `/p/:slug` útvonal közös shellt szolgál ki, a kliens rendereli a 404 állapotot; a valódi HTTP státuszt és a crawler viselkedését élő smoke teszttel kell ellenőrizni. |
| Adásrend — SCH | `src/routes/admin/schedule.ts`, `src/core/schedule-read.ts`, `src/routes/public/schedule.ts`, `migrations/0017_site_ownership_not_null.sql` | **REUSE + ADAPT** | A canonical `schedule_items` és site-scoped CRUD/public read létezik. Az admin route által kezelt mezők és validáció jelenleg szűkebbek, mint a végső terv: recurrence, teljes timezone/DST workflow, konfliktusfeloldás és Game Profile CRUD nem tekinthető igazoltnak pusztán a jelenlegi route alapján. |
| Twitch-integráció — INT | `src/routes/integrations/twitch.ts`, `src/core/twitch-oauth.ts`, `src/core/twitch-site-ownership.ts`, `migrations/0015`–`0017`, Twitch/site-ownership tesztek | **REUSE** | A Twitch OAuth, site binding, token-validation/revoke és audit meglévő alap. Az integrációs szerződésből induljunk ki; új provider csak külön adapterrel és igazolt capabilityvel bővíthető. A YouTube/TikTok környezeti változók megléte önmagában nem bizonyít kész adaptert. |
| Média/asset registry — RES | `Env.MEDIA` R2 binding; `media` D1 tábla; `src/core/domain/contracts.ts` MediaAsset és asset-reference normalizálók; `migrations/0017` site ownership | **ADAPT + BUILD hiányokra** | Van tárolási és típusbeli alap: a jelenlegi media rekordban object_key, original_name, mime_type, size_bytes, alt_text, created_at és site_id mezők láthatók. A vizsgált `src/index.ts` route-regiszterben nincs külön admin media API, a repository route-fájllistájában nincs dedikált media route. Licenc/source/usage-map/collection/variant/processing-state és törlés előtti függőségkezelés nincs bizonyítva; a teljes upload/processing/search/usage-map/delete-safe registry ezért hiányzó vagy ellenőrizendő képesség. A meglévő táblát és R2 bindingot kell bővíteni, nem párhuzamos asset rendszert létrehozni. |
| Domain-szerződések — RESOURCE/SCHEDULE/GAME_PROFILE/DESIGN_SYSTEM/SITE | `src/core/domain/contracts.ts`, `migrations/0002_editor_platform.sql` (`design_tokens`, `editor_components`, `editor_preferences`) | **REUSE + ADAPT** | MediaAsset, GameProfile, ScheduleEvent, ThemeTokens és SitePresentation típusok/normalizálók, továbbá token/component/preference táblák léteznek. Ezeket kell auditálni és továbbfejleszteni, mielőtt új párhuzamos schema születne; a típusdefiníció vagy tábla önmagában nem bizonyít teljes service/API-t. A `design_tokens` és `editor_components` sémája nem tartalmaz `site_id`-t, és a vizsgált route-regiszterben nincs hozzájuk dedikált API. |
| Multi-site schema uniqueness — PAGE/SCHEDULE/INT/DESIGN_SYSTEM | `migrations/0013`, `0017`, `0002_editor_platform.sql` | **REVIEW BEFORE MULTI-SITE** | A `pages.slug` globálisan UNIQUE, a schedule source-identity index nem tartalmaz `site_id`-t, a `twitch_connections.broadcaster_id` globálisan UNIQUE, a design_tokens név és editor_components pedig nincs site-scoped. Ezek lehetnek tudatos korlátozások, de multi-site/agency/SaaS előtt explicit döntés és negatív teszt kell; ne módosítsuk vakon a működő egy-site alapot. |
| Site settings — SITE/SETTINGS | `src/routes/admin/settings.ts`, `src/routes/public/site-settings.ts`, `migrations/0015` megjegyzése | **REUSE + ADAPT, migráció csak audit után** | A `site_settings` route a globális `key='site'` rekordot olvassa/írja, és a jelenlegi útvonal nem site-scoped. A migration kommentje ezt tudatosan legacy/global állapotként tartja fenn, amíg a fogyasztók nincsenek auditálva. Az `editor_preferences` user-scope táblaként létezik, de hozzá tartozó API/UI használatát a route-regiszter nem bizonyítja. Nem szabad vakon új site-scoped settings táblát vagy második settings rendszert bevezetni; előbb az összes read/write consumer feltárása szükséges. |
| Canonical Editor entrypoint és legacy UI | `src/index.ts` az `/admin/editor` útvonalat a `/editor-v2/index.html` fájlra irányítja; a régi `public/editor/` könyvtár még jelen van | **REUSE v2 + legacy besorolás** | A működő v2 marad az egyetlen kanonikus Editor. A régi fájlok elérhetőségét, hivatkozásait és eltávolítási/archiválási döntését külön kell bizonyítani; nem készülhet második Editor. |

**Route-regiszter megfigyelés:** a vizsgált `src/index.ts` jelenleg auth/bootstrap/session, Admin pages/editor/schedule/settings, Twitch connection/validation/disconnect és Twitch schedule sync, public pages/schedule/site-settings, health/db-health és a statikus Admin/public shell útvonalakat regisztrálja. A 22 főmodul többségéhez nem látható dedikált route-modul ebben a regiszterben. A jelenlegi tesztfájl-listában Editor core/schedule, Admin home, domain contracts, site ownership és Twitch/OAuth tesztek szerepelnek; külön public-renderer/SEO, média-upload/asset registry, community, commerce, notifications/help, automation, AI, developer API vagy extension acceptance suite nem látható. Ezt hiányzó/ellenőrizendő implementációs és tesztbizonyítékként kezeljük, nem úgy, mintha a tervezett funkciók már működnének.

**Migrációs séma leltár:** a jelenlegi migration fájlok a users/sessions, site_settings, pages/editor_revisions, social_accounts, schedule_items/schedule_sync_state, media, audit_log, editor_preferences/design_tokens/editor_components, system_page_content, Twitch connections/OAuth states és sites köré épülnek. Nem találtam külön kanonikus táblát a Content Studio tartalomrekordjaihoz, termékkatalógus/rendelés, fan identity/community posts, support/membership entitlement, analytics event/read model, automation workflow/run, notification delivery, help content, developer API key/outbound webhook, extension registry vagy SaaS billing plan területéhez. Ezeket tervezett/hiányzó vagy más módon még igazolandó képességként kell kezelni; nem szabad késznek jelölni őket pusztán a feature ID létezése miatt.

**Fontos korlát:** a táblázat csak a felsorolt fájlokban és route-regiszterben látható bizonyítékot rögzíti. Nem bizonyítja, hogy egy funkció élőben hibátlan, és nem zárja ki, hogy egy nem vizsgált fájlban van részleges implementáció. A mentési/renderer boundary-k és az asset/site-settings fogyasztók első mélyebb vizsgálatát a 63.23 rögzíti. A következő audit a fennmaradó modulok route/UI/schema/test leltára, majd a 396 ID-hoz tartozó REUSE/ADAPT/BUILD/REJECT/DEFER döntések bizonyítékokkal való feltöltése.

**Státusz: IN PROGRESS / NOT PASS.**

### 63.23. Core feature ID-kódleltár — REUSE / ADAPT / BUILD döntések, első szelet

Ez a táblázat a 63.22 forráskód-olvasási auditot köti a stabil funkcióazonosítókhoz. A döntés a jelenlegi repositoryban látható implementációs alapra vonatkozik, nem runtime PASS-ra. A „REUSE” azt jelenti, hogy a meglévő alapot meg kell őrizni; a „REUSE + ADAPT” meglévő, de nem teljes képességet jelent; a „BUILD/UNVERIFIED” azt jelenti, hogy a tervezett teljes funkcióhoz nem találtunk elég route/UI/test bizonyítékot.

| Funkció-ID csoport | Forrásbizonyíték | Döntés | Nyitott követelmény |
|---|---|---|---|
| EDT-001–006 | Editor v2 schema, command pipeline, transaction/history/state/selection és core tests | **REUSE** | A meglévő Page Model és command API marad az egyetlen Editor-alap; futási eredmény ebben a lépésben nincs. |
| EDT-007–015 | Canvas engine, drag/resize, layers/selection UI, element palette, app.js | **REUSE + ADAPT** | Alignment/snap/grid, összes drag/reparent/lock és mobil input teljes acceptance-e külön bizonyítandó. |
| EDT-016–020 | NODE_TYPES/element palette, rich text és schedule block/config/preview | **REUSE + ADAPT** | A teljes elemkatalógus és SANCI provider-blokkok publikus adatforrása/renderje nem teljes; több blokk placeholder. |
| EDT-021–026 | Property Registry, responsive.js, canvas-engine és Inspector | **REUSE + ADAPT** | A Registryben lévő group nem bizonyítja minden property UI/render/validation megvalósítását; public responsive paritás hiányzik. |
| EDT-027–033 | Save/reload/revision/conflict recovery, adminEditorRoute, page CRUD/revision routes és core tests | **REUSE + ADAPT** | Draft save full validation, minden publish belépési útvonal validációja és kötelező expectedVersion konfliktusvédelem szükséges. |
| EDT-034–044 | Public renderer, mobile CSS, rich-text, Editor preferences részleges alapok | **ADAPT + BUILD hiányokra** | Full renderer parity, accessibility/reduced motion, minden viewport és per-user preferences külön tesztelendő. |
| WEB-001, WEB-004–005, WEB-007–008 | admin pages/editor/public pages routes, editor_revisions, published snapshot, preview auth és rollback | **REUSE + ADAPT** | Revision lista létezik, de diff, teljes acceptance és HTTP soft-404/crawler viselkedés külön vizsgálandó. |
| WEB-002–003, WEB-006, WEB-009–032 | Page route/renderer részleges; statikus shell és néhány publikus route | **ADAPT + BUILD hiányokra** | Teljes nav tree, duplicate/archive/usage warning, publish validation report, redirects, route 404, SEO metadata/sitemap/robots, minden node render és safe embed nincs bizonyítva. |
| SCH-001 | admin schedule CRUD + site-scoped schedule_items | **REUSE + ADAPT** | Basic CRUD létezik; a teljes mezőmodell és státuszátmenetek acceptance-e nyitott. |
| SCH-007–008 | Twitch schedule sync route, sync adapter, sync state/error mapping és tesztfájl | **REUSE + ADAPT** | Éles provider/API smoke és konfliktus/manual override út teljes tesztje nincs ebben az auditban. |
| SCH-010–011 | public schedule read projection, Editor schedule binding/config/preview | **REUSE + ADAPT** | A public render és Editor preview parity, timezone/freshness/empty/error state acceptance-e nyitott. |
| SCH-002–006, SCH-009, SCH-012–015 | Néhány query/preview helper és schedule schema; teljes admin UI/domain route nem bizonyított | **ADAPT + BUILD hiányokra** | Recurrence, DST, conflict detection, Game Profile CRUD/relations, iCal/export és teljes naptár UI hiányzó/ellenőrizendő. |
| INT-003–010, INT-019–020 | Twitch OAuth/site ownership/token validation, scope/connection route és audit | **REUSE** | A Twitch-adapter alapot újra kell használni; teljes provider matrix, quota/diagnostics és éles ellenőrzés nyitott. |
| INT-011 | Twitch live/schedule kapcsolódó route/adapter és schedule sync | **REUSE + ADAPT** | A normalizált Live domain és publikus live-block teljes viselkedése nem bizonyított. |
| INT-001–002, INT-012–018, INT-021 | Adapter contract részben; route registryben csak Twitch integráció látható | **ADAPT + BUILD hiányokra** | YouTube/TikTok/Discord/Kick, Twitch VOD/clip, provider webhook és későbbi payment/email adapterek külön capability-gated implementációt igényelnek. |
| RES-001–002 | MEDIA R2 binding, media D1 table, MediaAsset type/normalizer és site ownership migration | **REUSE + ADAPT** | Tárolási alap megvan; nincs bizonyított teljes registry/API/upload pipeline. |
| RES-003–016 | Nem találtunk dedikált media route-ot vagy külön asset-registry acceptance suite-ot | **BUILD/UNVERIFIED** | Upload/processing/variants/search/usage map/licence/alt text/SVG safety/authorized download/delete/restore flow szükséges. |
| DSN-001–018 | ThemeTokens/SitePresentation típusok/normalizálók a domain contracts fájlban | **REUSE + ADAPT** | Token editor, theme/template/component registry, instance/override, version/rollback route és UI nincs bizonyítva. |
| SET-001–004 | Admin/public settings route és site_settings tábla; csak siteName/tagline, globális key=site | **REUSE + ADAPT** | Site-scoped settings és custom-domain/DNS/SSL lifecycle előtt minden consumer és migrációs út auditálandó. |
| DYN-001–008 | Editor schedule data binding és schedule read query létezik; általános binding registry nem bizonyított | **ADAPT + BUILD hiányokra** | Whitelistelt source registry, type validation, permission/published-only boundary, state machine, cache/freshness és diagnostics szükséges. |
| SEO-001–005 | Statikus robots meta és kliensoldali document.title/visible title-description update | **BUILD/UNVERIFIED** | Canonical, OG/X cards, structured data, redirects, sitemap/robots, preview/diagnostics és crawler/HTTP acceptance hiányzó. |

**Határ:** a fenti döntések kizárólag az első, core kódszeletet fedik le. Nem osztanak ki kitalált státuszt a többi ID-hoz. Az akkori következő lépést a 63.25 és a 63.26–63.37 fejezetek azóta részletesen feldolgozták; az aktuális következő lépést kizárólag a legutolsó 63.x fejezet rögzíti.

### 63.24. Legacy Editor → canonical Editor v2 képességmegőrzési audit

A régi `public/editor/` modulok külön UX- és javítási kísérleteket tartalmaznak, de eltérő globális API-t/adatmodellt használnak. A `public/editor-v2/index.html` a v2 saját `app.js`/core/UI moduljait tölti be; a legacy scriptek nem részei a canonical v2 runtime-nak. Ezért a működő képességet kell megőrizni, nem a régi scriptet vakon bemásolni.

| Legacy forrás / képesség | V2-ben látható megfelelő | Döntés | Nyitott acceptance |
|---|---|---|---|
| `public/editor/hierarchy.js`: rétegfa, nest/unnest, parent/child szabály | `commands.js` hierarchy.group/ungroup/reparent; v2 layer tree | **REUSE v2** | Container-szabály, locked node, cycle prevention, keyboard/touch reparent E2E. |
| `public/editor/layer-order.js`: rétegsorrend előre/hátra/top/bottom | V2 `resolveLayerDrop` + drag/drop a layer tree-ben, hierarchy.reorder | **REUSE v2; UX gap ellenőrzés** | Drag-drop sorrend, mobile pointer és billentyűzetes alternatíva; ha a gyorsművelet hiányzik, v2 parancsra épülő UI-t adjunk hozzá. |
| `public/editor/multi-select.js`: Ctrl/Cmd többes kijelölés | V2 selection.ids/primaryId és mobil multi-select bar | **REUSE v2** | Kijelölés, csoportosítás, fókusz és Escape minden pointer/touch/keyboard útvonalon. |
| `public/editor/lock.js`: lock/unlock toolbar action | V2 Inspector lock checkbox + `element.lock.set`; Rétegek visibility toggle + `element.visibility.set` command | **REUSE v2 + ADAPT** | Locked node nem mozgatható/szerkeszthető/reparentelhető; root/group edge case, eszközönkénti hide/show és publikált renderer acceptance. |
| `EDT-038` / legacy multi-select: clipboard/copy/paste/duplicate | V2 selection state és `element.duplicate` command létezik; a vizsgált app.js/commands.js nem mutat copy/paste clipboard UI/handler útvonalat | **REUSE duplicate + ADAPT / BUILD** | Multi-select és duplicate külön acceptance; clipboard paste-nél ID remap, nested children, assets, permission, undo/redo és cross-page scope tesztelendő. |
| `public/editor/group-properties.js`: több elem közös property/layout szerkesztése | V2 többes kijelölés létezik, de `renderInspector()` jelenleg a kiválasztott `nodes[0]` elemre épül | **ADAPT / BUILD** | Valódi multi-property Inspector hiányzik; legacy UX követelményét meg kell őrizni, v2 `executeBatch`/canonical commands használatával. |
| `public/editor/margin-properties.js`, `minmax-properties.js`: margin és min/max width/height | V2 responsive X/Y/width/height/position controls léteznek; a Property Registry deklarál margin/padding box mezőket, de a generikus Inspector nem ad hozzájuk strukturált négyoldalas vezérlőt, a minWidth/minHeight controls pedig nem találhatók | **ADAPT / BUILD** | Margin/padding és min/max constraint property schema, validation, responsive inheritance, public renderer parity és reset/inherit teszt. |
| `public/editor/page-rename.js`: oldalnév átnevezése a PATCH title útvonalon | V2 `editPageMeta()` már szerkeszti a title/slug mezőt és expectedVersionnel hívja a PATCH route-ot | **REUSE v2 + ADAPT** | A funkció nem hiányzik; a legacy külön rename gombja nem szükséges automatikusan. Ellenőrizendő az unsaved-change guard, slug/SEO/redirect hatás, szerveroldali title/slug validation és konfliktuskezelés. |
| `public/editor/selection-routing.js`: DOM event monkey patch a parent selection megakadályozására | V2 saját node pointer handlers és layer selection routing | **REJECT legacy patch / VERIFY v2** | A globális `Element.prototype.addEventListener` felülírást nem szabad átvenni; nested selection regressziós teszt kell. |
| `public/editor/selection-clear-fix.js`: capture-phase blank-area clear | V2 state/selection/keyboard handlers | **REUSE v2 / VERIFY** | Canvas blank-area click, Escape, Inspector/panel click és touch esetek külön tesztelendők; globális capture hack nem portolható automatikusan. |
| `public/editor/inspector-atomic.js`: atomic Apply, legacy content/layout/style mezőkkel | V2 canonical command engine, validation és `executeBatch` atomic transaction | **REUSE v2 architecture / ADAPT UX** | Ha a felhasználói folyamat explicit Apply-t kíván, v2-ben batch/transaction alapú legyen; régi direct mutation/schema nem használható. |
| `public/editor/editor-stabilizer.js`: régi `s.doc`, `groupId`, window globals, direct mutation/history override | V2 izolált state, Page Model, command engine, revision/persistence | **REJECT direct port / extract requirements only** | Csak konkrét reprodukálható hiba és teszt alapján emeljünk át viselkedést; a legacy state/history nem keverhető a v2 Page Modellel. |

**Kötelező szabály:** a régi script eltávolítása/archiválása csak akkor zárható le, ha a képesség a v2-ben vagy bizonyítottan felesleges explicit döntéssel. Az eltérő adatmodellek, globális event patch-ek és direct mutation miatt a legacy kód nem automatikusan újrahasználható; a működő UX-t és edge case-eket viszont nem szabad bizonyíték nélkül eldobni.

**Státusz: IN PROGRESS / NOT PASS.** A táblázat első összehasonlítás; a v2-ben lévő képességeket interakciós és E2E teszttel kell igazolni, a hiányzó funkciókat a 396 ID feature contractjaiban kell rögzíteni. Az itt kijelölt következő lépések történeti auditjegyzetek; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.25. Nem-Editor termékmodulok — route/UI/schema/test bizonyíték és megvalósítási határ

**Auditmódszer:** a `v2/foundation` branch aktuális fájlfája alapján áttekintve a `src/routes/`, `src/core/`, `migrations/`, `tests/` és `public/` modulhatárait. Ez forráskód-leltár, nem éles runtime-bizonyíték. Egy domain type, feature ID vagy menüpont önmagában nem jelenti azt, hogy az adott képesség működő UI-val és API-val rendelkezik.

| Funkcióterület / ID-csoport | Jelenlegi bizonyíték | Döntés | Kötelező következő lépés |
|---|---|---|---|
| **IDENTITY / SEC / TEAM** — ADM-007, SEC-001–012, TEAM-001–007 | Auth route-ok: bootstrap/login/logout/session; require-auth/session/password helper és site-context/ownership alap. Külön MFA/SSO, workspace switcher, invite/roles/approval/team billing route és dedicated acceptance suite nem látható a vizsgált fájlfában. | **REUSE alap + ADAPT/BUILD hiányokra** | A működő session/site ownership maradjon canonical; külön capability-ként tervezzük az MFA/SSO, granular RBAC, invitation, workspace selector és tenant isolation negatív teszteket. A tenant isolation szerveroldali invariant, nem csak menüszűrés. |
| **OPS / QA** — OPS-001–011, QA-001–010 | Health/db-health route és domain/editor/Twitch/site-ownership tesztfájlok léteznek. Külön structured logging/correlation, alerting, backup/export/restore, recovery drill, performance budget és teljes browser E2E suite nem bizonyított a fájlfában. | **REUSE + ADAPT / BUILD** | A meglévő health/deploy és tesztparancsokat megtartani; minden további üzemeltetési funkcióhoz implementáció, runbook, teszt és evidence link szükséges. QA-007 csak az OPS-005/006 tényleges működését ellenőrzi, nem helyettesíti. |
| **CONTENT STUDIO** — CNT-001–022, WEB-017 | A jelenlegi route-regiszterben nincs Content Studio/VOD/clip CRUD route; nincs külön content-domain táblacsoport vagy content acceptance suite a vizsgált migráció-/tesztfában. | **BUILD/UNVERIFIED; adaptereknél REUSE** | CNT canonical content schema/service/API, külső ID/dedupe, content asset references, editorial lifecycle, publish queue/retry, rights/takedown és public feed projection. Twitch adaptert csak a támogatott metadata-hoz használjuk; content records nem kerülhetnek a Media Asset registrybe. |
| **COMMUNITY / FAN IDENTITY** — COM-001–020 | Nincs dedikált community/member/profile/post/poll/moderation route, domain schema vagy acceptance suite a vizsgált fájlfában. Twitch OAuth nem helyettesíti a fan account identitást. | **BUILD/UNVERIFIED** | Külön community és fan identity domain, consent/privacy lifecycle, moderation/abuse limits, visibility/entitlement contract. SUP-006 entitlementet fogyasztani kell; nem szabad COM-ban párhuzamos tagsági jogosultságot tárolni. |
| **STORE / SUPPORT / BILLING** — STO-001–021, SUP-001–012, TEAM-006 | Nem látható product/order/payment/membership/billing schema vagy route és commerce acceptance suite. | **BUILD/UNVERIFIED; provider döntési kapu kötelező** | A termékkatalógus, rendelés, checkout/payment, entitlement, fulfillment, refund, tax/VAT/invoice és consumer-rights külön életciklus. Fizetési adatot ne kezeljünk saját, nem auditált tárolóban; előbb merchant-of-record/provider és jogi megfelelőségi döntés. |
| **ANALYTICS / CAMPAIGNS** — ANL-001–010, CAM-001–009 | Nem látható canonical analytics event/read model, campaign/deal/deliverable schema/API vagy külön tesztcsomag. ADM-005 audit összefoglaló nem analytics, audit events maradnak SEC/AUDIT domainben. | **BUILD/UNVERIFIED** | Event taxonomy, privacy/consent/retention, bot filtering, source/freshness/unit és export; kampány/UTM/deal/deliverable pedig külön domain. AUT trigger routing ne legyen összekeverve az ANL mérési eseményekkel. |
| **AUTOMATION / SANCI AI** — AUT-001–014, AI-001–021 | Nincs workflow/run engine, AI provider registry, prompt/version/evaluation, approval queue vagy ezekhez tartozó API/test suite a vizsgált route-/schema-fában. | **BUILD/UNVERIFIED** | Későbbi, elkülönített domain. Automation csak engedélyezett domain actionöket hajthat végre idempotenciával/permissionnel; AI csak canonical API/command útvonalon, diff/preview/approval/audit/rollback mellett. Ne írjon közvetlenül domain táblákba. |
| **DEVELOPER / EXTENSIONS / MARKETPLACE** — DEV-001–006, MKT-001–005 | Nem látható public API/version registry, API key, webhook registry, sandbox, extension manifest/install lifecycle vagy marketplace schema/route. | **BUILD/UNVERIFIED** | Külön developer API és extension trust boundary, scoped keys, quota, signature/replay defense, permission manifest, version/migration/license/review. Marketplace/payment csak a STO/SUP provider és jogi kapu után. |
| **SEARCH / NOTIFICATIONS / HELP** — SEARCH-001–005, NTF-001–005, HELP-001–004, ADM-006/011/012 | A menütérkép meghatározza a belépési pontokat, de a route-/schema-/test-fában nincs külön global search/index, notification delivery/preference vagy help content/progress modul. | **BUILD/UNVERIFIED; ADM shell belépési pont REUSE** | A kereső canonical domain projectionöket olvasson permission- és site-scope ellenőrzéssel; értesítés domain eventből jöjjön idempotensen; help verziózott feature ID-ra hivatkozzon. ADM csak navigál, nem lesz ezek adatgazdája. |
| **LOCALIZATION / DOMAINS / SETTINGS** — LOC-001–006, SET-001–004 | Van globális legacy site_settings és public-safe settings projection; külön locale catalog/translation workflow, hreflang lifecycle és custom-domain verification/DNS/SSL state machine nem bizonyított. | **REUSE settings alap + ADAPT/BUILD** | A meglévő settings fogyasztóit fel kell térképezni, mielőtt site-scoped migráció készül. Localization és domain lifecycle külön domain/API; a canonical URL/SEO kimenethez explicit kapcsolat szükséges. |
| **DESIGN SYSTEM / MEDIA** — DSN-001–018, RES-001–016 | Domain type-ok, R2 binding, media metadata, design_tokens/editor_components táblák léteznek; teljes asset API/pipeline, token editor, template/component registry API és verziózás nincs bizonyítva. | **REUSE + ADAPT / BUILD hiányokra** | A meglévő D1/R2/típusokat bővíteni; site scoping, usage map, safe processing, variants, token/component versioning és rollback kapukat implementálni. Ne hozzunk létre második media/design adatgazdát. |
| **OBS / STREAM STUDIO / LIVE** — OBS-001–010, LIV-001–010 | Twitch kapcsolat és schedule-sync alap látható; OBS pairing/scene control, normalized live service, unified chat, multistream, alert engine, chatbot/loyalty és overlay registry nem bizonyított. | **REUSE Twitch integration; BUILD/UNVERIFIED további modulok** | A Live/Stream Studio legyen saját domain; provider capability matrix és permission scopes határozza meg, mi érhető el. OBS command csak explicit paired/authorized eszközön keresztül, dry-run/test/replay és audit mellett. |
| **PUBLIC WEB / SEO / DYNAMIC DATA** — WEB-001–032, SEO-001–005, DYN-001–008 | Public page/schedule/system-page routes és kliensoldali renderer létezik; több node/provider blokk placeholder, a responsive/property parity nem bizonyított. Dedicated sitemap/robots/OG/canonical/structured-data route és general binding registry nem látható a vizsgált fájlfában. | **REUSE + ADAPT / BUILD hiányokra** | Public renderer marad megjelenítési réteg; canonical domain projectiont fogyaszt. Minden public route-hoz HTTP státusz/404, published-only, SEO metadata, safe embed, cache/freshness és mobil/accessibility acceptance kell. |

**Következtetés:** a repository jelenlegi technikai alapja valós, de főként auth/site ownership, Editor/Page Model, schedule/Twitch és settings köré koncentrálódik. A táblázatban felsorolt további Creator OS domainek célzott, önálló modulok; jelen állapotban nem jelölhetők késznek. Ez nem ok a terv szűkítésére: a helyes megoldás a modulonkénti implementációs szerződés és fázis, nem az összes funkció Editorba vagy egyetlen admin route-ba zsúfolása.

**Státusz: IN PROGRESS / NOT PASS.** A leltár a fájlfán és route-regiszteren alapul. A hiányzó képességek végleges BUILD döntéséhez szükséges a teljes route consumer/search, schema/migration és runtime acceptance kör; az „UNVERIFIED” státusz addig nem alakítható PASS-szá. Az itt kijelölt következő lépések történeti auditjegyzetek; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.26. EDT-001–044 — funkciónkénti bizonyítékmátrix, első teljes modul-szelet

A 63.23 összesített ID-csoportjait ez a mátrix az EDT minden egyes stabil ID-jára bontja. A „részleges alap” a forráskód/tests fájlokban látható alapot jelenti, nem a teljes acceptance PASS-t. Az egyes fázis/prioritás végleges kiosztása a kanonikus 41.2/63.5 roadmap-keresztezés után zárható; ahol a repository-bizonyíték nem elég, az állapot **UNVERIFIED / OPEN**, nem kitalált státusz.

| ID | Kanonikus owner / forrás | Bizonyíték alapján látható állapot | Nyitott acceptance / függőség |
|---|---|---|---|
| EDT-001 | EDITOR / `core/schema.js`, Page Model | Részleges alap | Verziómigráció, backward compatibility és invalid schema reject E2E. |
| EDT-002 | EDITOR / schema + validation | Részleges alap; core tesztek parent/child invariants-t fednek | Duplicate ID, orphan node, cycle, root és nested container negatív mátrix. |
| EDT-003 | EDITOR / `commands.js` | Részleges alap; mutációs parancsok központosítottak | Minden UI mutation csak commandon át; nincs direct state mutation. |
| EDT-004 | EDITOR / `executeBatch`, transaction API | Részleges alap; atomic/non-atomic tesztek léteznek | Minden összetett UI műveletnél explicit atomic policy és failure recovery. |
| EDT-005 | EDITOR / history undo/redo | Részleges alap; snapshot round-trip teszt van | History limit, nagy dokumentum, selection és failed transaction edge case. |
| EDT-006 | EDITOR / state selection | Részleges alap; history selection restore teszt van | Canvas/layer/Inspector/multi-select fókuszszinkron minden inputmóddal. |
| EDT-007 | EDITOR / canvas engine, pan/extent | Részleges alap | Zoom/pan/fit/resize és viewport state browser/mobile acceptance. |
| EDT-008 | EDITOR / canvas pointer handlers | Részleges UI-alap | Drag/drop, pointer cancel, touch, locked node, nested target és save round-trip E2E. |
| EDT-009 | EDITOR / geometry/resize | Részleges UI-alap | Min/max constraints, aspect ratio, keyboard resize és responsive overrides. |
| EDT-010 | EDITOR / canvas geometry | Nincs teljes snap/grid acceptance bizonyíték | Alignment guides, snap thresholds, grid toggle és keyboard alternative. |
| EDT-011 | EDITOR / commands reorder/reparent/duplicate/delete | Core command/test alap létezik | UI-műveletek, törlés megerősítése/undo, cross-parent rules és subtree edge case. |
| EDT-012 | EDITOR / layer tree | Részleges UI-alap | Expand/collapse persistence, empty container és deep hierarchy. |
| EDT-013 | EDITOR / selection state + canvas/layers | Részleges UI-alap | Canvas↔layer↔Inspector sync, stale selection és deleted node recovery. |
| EDT-014 | EDITOR / lock command + Inspector | Lock UI és eszközönkénti visibility Inspector/Rétegek kapcsoló létezik; visibility lifecycle Chromiumon igazolt | Layer rename, lock lifecycle és keyboard/touch reparent még nyitott; visibility parity forrás + Chromium tesztekkel igazolt, élő HTTP/hash smoke és fizikai eszköz elfogadás külön nyitott. |
| EDT-015 | EDITOR / node palette | Részleges elemkatalógus | Keresés/kategória/favorite, unsupported capability label és minden NODE_TYPE coverage. |
| EDT-016 | EDITOR / container/section/row/grid node types | Schema/render alap részleges | Layout semantics, nested constraints, gap/columns, breakpoint change és public parity. |
| EDT-017 | EDITOR / text/heading/button/icon/divider/spacer | Részleges node/render alap | Minden node saját Inspector control, link safety, icon registry és accessible semantics. |
| EDT-018 | EDITOR + RESOURCE / image/video/embed/list/card/badge | Részleges/vegyes | Media picker, authorized asset reference, safe embed, video fallback, alt text és renderer parity. |
| EDT-019 | EDITOR / table/accordion/tabs/form | Teljes implementáció nem bizonyított | Minden komponens interakciós schema, keyboard/ARIA, validation, safe form submission és acceptance. |
| EDT-020 | EDITOR → owning domain blocks | Schedule block alap létezik; több SANCI provider blokk placeholder | Blockonként canonical source, owner/API, loading/empty/error/stale, permission és preview/public parity. |
| EDT-021 | EDITOR / Property Registry | Registry és property csoportok léteznek | Minden tervezett property tényleges definíciója, owner node, type, responsive flag és command. |
| EDT-022 | EDITOR / Inspector controls + validation | Általános input és select alap | Type-specific controls (box/font/color/asset/shadow), min/max, schema validation és invalid input UX. |
| EDT-023 | EDITOR / responsive resolver | Core inheritance/resolve tesztek léteznek | Az Inspector ténylegesen resolved értéket mutat-e minden property-nél; source/inherited jelzés. |
| EDT-024 | EDITOR / responsive helpers | Override/inherit/reset helper tesztelt | Minden property és viewport UI-ja reset/inherit állapotot mentés után is megőriz. |
| EDT-025 | EDITOR / responsive preview | Desktop/tablet/mobile UI-alap létezik | Breakpoint switch, viewport dimensions, zoom és visual regression. |
| EDT-026 | EDITOR / responsive visibility/layout | Visibility state részleges | Order/columns/visibility override minden breakpointon, publikus rendererrel egyezően. |
| EDT-027 | EDITOR / save dirty state | Save/dirty state kód és tesztlétezés | Explicit draft save, beforeunload guard és mentés közbeni további edit. |
| EDT-028 | EDITOR + PAGE API / save/reload | Revision alap és round-trip ellenőrzések részlegesek | Teljes node/property/data binding round-trip D1 → reload → render. |
| EDT-029 | EDITOR + REVISION / expectedVersion | 409 conflict handling és draft export/reload teszt van | expectedVersion szerveroldali kötelezővé tétele minden mutation/save útvonalon. |
| EDT-030 | EDITOR / in-flight save snapshot | Save kód a beküldött snapshotot külön kezeli | Race test: módosítás save közben, válasz sorrendcsere és dirty-state helyesség. |
| EDT-031 | EDITOR / network recovery | Conflict export és explicit reload alap van | Timeout/offline/retry és local draft retention; nincs silent data loss. |
| EDT-032 | EDITOR/PREVIEW / preview authorization | Preview route alap létezik | Draft preview link expiry, unauthorized, noindex, current revision és public shell parity. |
| EDT-033 | EDITOR/PUBLISH / publish flow | Publish action/validation alap létezik | Minden publish entrypoint ugyanazt a server-side validationt futtassa; save ≠ publish. |
| EDT-034 | PUBLIC_RENDERER / `page-renderer.js` | Paritás nem bizonyított; responsive override hiányos | Node-by-node Editor preview/public render parity, SEO/asset/safe embed/accessibility. |
| EDT-035 | EDITOR mobile shell | Mobil CSS és action-bar alap vizsgálandó | Safe-area, viewport keyboard, scroll/zoom és small-screen interaction E2E. |
| EDT-036 | EDITOR mobile panels | Mobil panel CSS/UI részleges | Layers/Inspector váltás, back/escape, focus restore és viewport state. |
| EDT-037 | EDITOR accessibility | Teljes keyboard canvas alternatíva nem bizonyított | Minden canvas művelet keyboard elérhető, focus order és screen-reader announcements. |
| EDT-038 | EDITOR / multi-select + duplicate | Multi-select/duplicate alap létezik; clipboard UI nem bizonyított | Copy/paste, ID remap, multi-selection batch, cross-page rules és undo/redo. |
| EDT-039 | EDITOR / page interaction schema | Property group létezik, teljes interaction property/runtime nem bizonyított | Whitelistelt action schema, URL/form safety, runtime policy; nem AUT action registry. |
| EDT-040 | EDITOR / motion | Reduced-motion csoport említve, property/runtime nem bizonyított | `prefers-reduced-motion`, motion disable policy, keyboard/vestibular-safe defaults. |
| EDT-041 | EDITOR / onboarding/templates | Template-start/onboarding teljes UI nem bizonyított | Empty state, template apply, no destructive overwrite, undo/rollback és sample content cleanup. |
| EDT-042 | EDITOR / error recovery | Conflict recovery alap van | Minden failure state, retry/reload/export, malformed Page Model és recovery telemetry. |
| EDT-043 | EDITOR / Rich Text | Structured Rich Text schema/command/tests léteznek | A funkciótervben plain-text baseline utáni gate; full editor toolbar, paste sanitization, accessibility és renderer parity. |
| EDT-044 | EDITOR / `editor_preferences` table | User-scope schema létezik, route/UI usage nem bizonyított | Per-user preferences API, permission, defaults, migration és Page Modeltől való elkülönítés. |

**EDT-függőségi gerinc (tervezett gate, nem kész státusz):** EDT-001/002 → EDT-003/004/005/006 → EDT-007–020 → EDT-021/022 → EDT-023–026 → EDT-027–033 → EDT-034; az EDT-035–044 hozzáférhetőség, mobil, rich text, interakció és személyes beállítás acceptance-e a kapcsolódó alapok után zárható. Ez a függőségi sorrend nem engedélyez implementációt a teljes terv lezárása előtt.

**Státusz: IN PROGRESS / NOT PASS.** Ez az első teljes, egyedi-ID-s modul-szelet; a fenti nyitott acceptance pontok nem jelentenek automatikus BUILD döntést. A WEB-001–032 mátrixot a 63.27 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.27. WEB-001–032 — oldalak, publikálás és publikus felület, egyedi-ID-s bizonyítékmátrix

A mátrix a `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `src/routes/public/pages.ts`, `src/core/page-model.ts`, `src/core/editor-validation.ts`, `public/assets/page-renderer.js` és `public/visual-page.html` aktuális forrásolvasására épül. Nem helyettesíti a HTTP/browser smoke tesztet. Ahol a repositoryban nincs bizonyíték, az állapot nyitott marad.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| WEB-001 | PAGE / admin pages CRUD | Site-scoped list/create/update route; slug/title/description validáció | Keresés/szűrés/pagináció, bulk actions, delete/archive és teljes lifecycle nem bizonyított; create útvonal publikált állapotot is elfogad. |
| WEB-002 | PAGE / slug + schema | Slug validáció és egyediség constraint létezik | Slug change → canonical URL, old link/redirect, internal links, SEO metadata és site-scoped uniqueness viselkedés tesztelendő. |
| WEB-003 | PAGE / page lifecycle | Duplicate/archive/delete/usage-map API nem látható a vizsgált admin route-ban | Reference/usage map, soft-delete/restore és safe delete; másik page/asset/form hivatkozásánál ne legyen árva rekord. |
| WEB-004 | PAGE/REVISION / D1 published snapshot | Draft content, published_content_json, is_published és published_revision_id létezik | Minden write útvonalon draft/published invariants; create-time publish bypass megszüntetése vagy explicit validált policy. |
| WEB-005 | PAGE/PREVIEW / public pages route | Preview query editor auth/role checkkel draftot olvas | Preview token/link expiry, page scope, noindex, unauthorized/cross-site és revision binding E2E. |
| WEB-006 | PAGE/PUBLISH / editor-validation | Publish document validator létezik és Editor publish útvonal hívja | A teljes validációt minden publish belépési pontnak hívnia kell, beleértve pages create; validációs riport mezőnként és UI-szinten hiányzó. |
| WEB-007 | PAGE/PUBLISH / editor route | Publish/unpublish/rollback műveletek és audit események léteznek | Állapotátmenetek, rollback published snapshotra, invalid transition, expectedVersion és idempotens ismétlés tesztelendő. |
| WEB-008 | REVISION / editor route | Legutóbbi 30 revision metadata listázása és restore-to-new-revision létezik | Revision diff/compare UI, megjegyzés/actor/time, régi verzió safe preview és concurrency E2E. |
| WEB-009 | NAVIGATION | Külön canonical navigation CRUD/schema route nem látható | Hierarchikus nav model, page reference validation, ordering, active state és publish atomikusság. |
| WEB-010 | SITE/PAGE / header-footer/global layout | A public shellben statikus header/footer és menu placeholder található | Canonical layout/schema, Brand Kit linkage, page-level override és minden route-on konzisztens render. |
| WEB-011 | NAVIGATION / accessibility | Statikus mobile menu markup és aria-label/expanded attribútum alap | Keyboard/focus/Escape, menu state, touch, reduced motion és real device/browser teszt. |
| WEB-012 | ROUTING / Worker | `/p/:slug` shell és public page API létezik | Nem létezik bizonyított teljes route registry/404/redirect matrix; invalid/unpublished slug tényleges HTTP státusza és crawler viselkedése smoke tesztet igényel. |
| WEB-013 | REDIRECT | Redirect manager/schema/route nem látható | 301/302/410 policy, loop detection, chain report, slug migration és canonical host. |
| WEB-014 | PUBLIC HOME | Statikus shell és dynamic page shell létezik | Canonical Home route/page identity, published-only output, SEO/OG, nav/footer és mobile E2E. |
| WEB-015 | PUBLIC LIVE | Live-state API/normalized live service nem bizonyított; Twitch connection önmagában nem elég | Offline/live/stale, player fallback, stream metadata, permission and provider failure. |
| WEB-016 | PUBLIC SCHEDULE / SCH-010 | Public schedule read projection és schedule renderer létezik | Timezone/DST, cache/freshness, empty/error state, canonical schedule equality és Editor preview parity. |
| WEB-017 | PUBLIC CONTENT HUB / CNT-020 | Content-domain feed/schema nincs bizonyítva | Csak canonical published-content projectionből rendereljen; page route/shell nem válhat content CRUD adatgazdává. |
| WEB-018 | PUBLIC PROFILE | About/profile page CRUD or dedicated schema not proven | Canonical profile fields, public-safe settings, metadata/localization and publish lifecycle. |
| WEB-019 | PUBLIC COMMUNITY / COM | Community domain/schema nincs bizonyítva | Member-only visibility, consent, moderation and entitlement contract. |
| WEB-020 | FORM SUBMISSION | Form schema/submission API/storage/moderation route nem látható | Server-side validation, consent, spam/rate limit, notification integration, retention/export/delete and private-data boundary. |
| WEB-021 | PUBLIC RESOURCES | Resource content/domain not proven | Canonical resource item type, visibility, download permission, asset references and SEO. |
| WEB-022 | LINK HUB | Canonical link-hub model/editor not proven | Shared links registry or page content decision; analytics/redirect policy and link validation. |
| WEB-023 | SUPPORT | Support domain/provider state not proven | External support link vs canonical SUP domain, truthful state, safe external navigation and member entitlement. |
| WEB-024 | SPONSOR/PRESS KIT | CAM/SPONSORSHIP model and export route not proven | Public/private field separation, generated export, asset usage and expiry/version. |
| WEB-025 | STORE/PRODUCT PAGES | Store product/order domain not proven | STO owns product projection; safe pricing/currency/availability and no mock checkout presented as live. |
| WEB-026 | MEMBERSHIP AREA | Fan identity/entitlement/member route not proven | Server-side entitlement checks on every private read, session lifecycle and unauthorized fallback. |
| WEB-027 | EVENTS/BLOG/NEWS/DIGITAL PRODUCTS | Separate event/content/product domain routes not proven | Each route consumes its owning domain projection; do not create one catch-all “page content” table. |
| WEB-028 | PUBLIC ERROR/MAINTENANCE/OFFLINE | Renderer has client-side catch/404 presentation | Real HTTP status, static fallback, outage handling, stale content and no secret/error leakage. |
| WEB-029 | SEARCH | Public search index/query API not proven | Published-only index, permission/consent filter, freshness/invalidation and safe snippets. |
| WEB-030 | CACHE/INVALIDATION | Some requests use no-store; canonical invalidation service not proven | Explicit cache policy for public page/feed/assets, publish/unpublish/rollback invalidation and stale fallback. |
| WEB-031 | PUBLISHED-ONLY BOUNDARY | Public page API filters `is_published=1`; preview is separately authenticated | All public content/feed/asset/form/member routes require explicit published/visibility gate and cross-site negative tests. |
| WEB-032 | RENDER SECURITY / SAFE EMBEDS | Renderer escapes text and applies `safeUrl` to link/image/schedule URLs | Node-by-node sanitization, allowed embed provider/origin, unsafe schemes/HTML, CSP and malformed nested content tests. |

**WEB kritikus kapu:** a public renderer nem lehet a teljes Editor Page Model másolata és nem birtokolhat üzleti adatokat. A publikált Page Modelt és domain-projectionöket biztonságosan kell megjelenítenie. A jelenlegi kód bizonyít néhány fontos alapot (site-scoped page read, preview authorization, revision/publish/unpublish/rollback), de a teljes nav/redirect/SEO/Content/Community/Store/Form route lifecycle nem igazolt.

**Külön szerveroldali korrekciós követelmény, mielőtt WEB/PUBLISH PASS adható:** a vizsgált `admin/pages.ts` create útvonal az `isPublished=true` esetet elfogadja, miközben nem hívja a `validatePublishDocument`-et; az `admin/editor.ts` save/publish és rollback útvonalon az `expectedVersion` jelenleg opcionális. Ezeket nem szabad pusztán UI oldali guarddal lezárni. A változtatás előtt a meglévő teszteket és minden API consumer-t fel kell térképezni; utána valid/invalid create, publish, conflict és concurrent update negatív teszt kell.

**Státusz: IN PROGRESS / NOT PASS.** A SCH-001–015 egyedi-ID-s mátrixot a 63.28 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.28. SCH-001–015 — schedule és Game Profile, egyedi-ID-s bizonyítékmátrix

A mátrix a `src/routes/admin/schedule.ts`, `src/core/schedule-read.ts`, `src/core/schedule/sync.ts`, `src/core/schedule/twitch-adapter.ts`, `src/routes/admin/twitch-schedule-sync.ts`, `src/routes/public/schedule.ts`, domain contracts és a kapcsolódó tesztek forrásolvasására épül.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| SCH-001 | SCHEDULE / admin schedule route + `schedule_items` | Site-scoped GET/POST/PUT/DELETE és title/platform/start/end/status/url/notes validáció | UI mezőmodell, archived state, audit completeness, invalid transition, idempotency és safe delete/restore. |
| SCH-002 | SCHEDULE / calendar UI | Admin route listát ad, dedikált naptár/lista UI nem bizonyított | Month/week/list/upcoming/past, keresés/szűrés/sorrend/pagináció és mobile calendar. |
| SCH-003 | SCHEDULE / date contract | ISO timestamp és UTC-alapú összehasonlítás látható | Explicit IANA timezone, DST gaps/folds, creator timezone change, locale display és recurring events. |
| SCH-004 | SCHEDULE / recurrence | Sync domain a Twitch `is_recurring` adatot rögzíti; saját recurrence editor nincs bizonyítva | Canonical recurrence rule, occurrence exceptions, edit-one/edit-series, DST and cancellation semantics. |
| SCH-005 | SCHEDULE / status | scheduled/live/completed/cancelled státuszok vannak; néhány időbeli validáció létezik | Állapotátmenet-mátrix, postpone/cancel reasons, stale live state, past event and restore. |
| SCH-006 | SCHEDULE / conflict detection | Overlap/conflict service/UI nem látható | Same-channel overlap, timezone-normalized intervals, warning vs hard block and override audit. |
| SCH-007 | SCHEDULE + INT / Twitch sync | Twitch adapter, sync endpoint, source mapping és connection identity létezik | Éles API smoke, missing/deleted source handling, partial response, rate-limit, expired auth and retry. |
| SCH-008 | SCHEDULE / sync state | `schedule_sync_state` status/count/error/time mezőkkel és audit route error mappinggel létezik | Admin sync history/diagnostics/retry UI, last successful sync/freshness and alerting. |
| SCH-009 | SCHEDULE / public projection | Public read config támogat next/upcoming/all lekérdezést | Dashboard countdown/live state, timezone correctness, stale/empty/error state and invalidation. |
| SCH-010 | SCHEDULE / `readPublicSchedule` | Site-scoped public projection filters statuses, orders and limits | Published/public policy, stable sort for equal times, pagination/limits and freshness/cache contract. |
| SCH-011 | EDITOR → SCHEDULE projection | Editor schedule config, defaults, preview helper és tests léteznek | Configured preview és public render azonos query/config eredményt adjon; error/empty/stale states. |
| SCH-012 | GAME_PROFILE / domain contracts | `GameProfile` type/normalizer és domain test létezik | Canonical persistence table/service/API, CRUD UI, uniqueness/site scope and lifecycle nem bizonyított. |
| SCH-013 | GAME_PROFILE → RESOURCE | Domain contract támogat asset reference-t | Artwork asset picker/usage map, replacement/delete safety, fallback and public rendering. |
| SCH-014 | SCHEDULE → GAME_PROFILE | ScheduleEvent contract `gameProfileId` referenciát támogat; teszt bizonyítja, hogy nem másolja a game name-et | DB/API foreign-key/ownership validation, archived/deleted profile behavior, relationship UI and migration. |
| SCH-015 | SCHEDULE / export | iCal/export/notification route nem látható | Correct timezone/UID/DTSTAMP/updated/cancelled event behavior, privacy, cache and later notification contract. |

**Kritikus sync-konfliktus:** a jelenlegi `sync.ts` upsertje `ON CONFLICT(source,source_account_id,source_id)` esetén frissíti a címet, platformot, időpontot, státuszt, URL-t és megjegyzést. A vizsgált mezőmodellben nincs külön, bizonyított manual-override mező/policy. Emiatt a „Twitch sync + kézi felülbírálás” teljes viselkedését nem szabad késznek jelölni: explicit mező-/prioritás-szabály és teszt kell arra, hogy mely mezőket birtokolja a provider, melyeket a creator, és hogyan kezeljük a provider által törölt/eltűnt eseményt. A source identity index site scope-ja szintén külön multi-site gate a 63.23-ban.

**Státusz: IN PROGRESS / NOT PASS.** Az INT-001–021 egyedi-ID-s mátrixot a 63.29 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.29. INT-001–021 — integrációs központ és provider adapterek, egyedi-ID-s bizonyítékmátrix

A mátrix a Twitch OAuth/crypto/site-ownership route-okat, Twitch schedule adaptert, `src/index.ts` route-regisztert és a Twitch/OAuth teszteket vizsgálja. A jelenlegi Twitch alap megőrzendő; a többi provider funkció nem tekinthető késznek pusztán konfigurációs kulcs vagy feature ID alapján.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| INT-001 | INTEGRATION / provider adapter contract | Twitch-specific adapterek léteznek; általános provider contract teljes végrehajtása nem bizonyított | Közös connect/status/capability/error/retry interface úgy, hogy a provider-specifikus OAuth és adatmodell ne mosódjon össze. |
| INT-002 | INTEGRATION / overview | Twitch status/diagnostic endpoint létezik; általános integrations dashboard nem látható | Provider registry, connection health, stale/expired/permission state, action links and partial failure. |
| INT-003 | INTEGRATION / Twitch OAuth state | Hashelt, rövid életű, user/site scoped, egyszer használatos OAuth state alap és tesztek léteznek | Callback error matrix, replay/expiry/race test, origin/redirect validation és audit. |
| INT-004 | INTEGRATION / Twitch token lifecycle | Token encryption, validation, refresh lock, revoke logic és tests léteznek | Provider-generic lifecycle contract, rotation/revoke proof, concurrent refresh and outage recovery. |
| INT-005 | INTEGRATION / site ownership | Twitch connection explicit user/site scoped; negative tests léteznek | Minden későbbi provider ugyanazt az ownership invariantot és cross-site negative testet alkalmazza. |
| INT-006 | INTEGRATION / scopes | Twitch scopes kiolvasása és megjelenítése létezik | Capability-to-scope matrix, missing scope UX, minimum scope and re-consent flow. |
| INT-007 | INTEGRATION / connect/reconnect/disconnect | Twitch connect/callback/validation/disconnect routes léteznek | Admin UX end-to-end, reconnect, revoke failure, disconnect idempotency and provider status truthfulness. |
| INT-008 | INTEGRATION / sync history | Twitch schedule sync state/error mapping létezik | General provider sync history, retry controls, bounded retry, per-run diagnostics and audit. |
| INT-009 | INTEGRATION / quotas | Explicit generalized quota/rate-limit service nem bizonyított | Provider 429/Retry-After policy, quota budget, backoff and UI freshness state. |
| INT-010 | INTEGRATION / Twitch adapter | Twitch OAuth/channel binding and schedule API integration exists | End-to-end live smoke, scope changes, identity mismatch, rate limits, API schema drift and revoke. |
| INT-011 | INTEGRATION → LIVE_STATE/SCHEDULE | Twitch schedule adapter exists; normalized live-state service not proven | Live/offline state, stream title/category/viewers, stale cache and public block must be a separate LIVE owner. |
| INT-012 | INTEGRATION / Twitch VOD/clip metadata | VOD/clip API adapter/route not visible in route registry | API scopes, content IDs, allowed fields, paging/quota and CNT handoff; do not store canonical content inside INT. |
| INT-013 | INTEGRATION / YouTube | Dedicated YouTube adapter/route/test not visible | OAuth/consent/scopes, live/video metadata, quota, revoke and capability tests. |
| INT-014 | INTEGRATION / TikTok | Dedicated TikTok adapter/route/test not visible | Capability-gated product API availability, review/approval, limited scopes and honest unavailable state. |
| INT-015 | INTEGRATION / Discord | Dedicated Discord bot/guild/role adapter not visible | Bot install, guild scope, role permissions, interaction/webhook verification and retry; role sync consumes SUP entitlement. |
| INT-016 | INTEGRATION / Kick | Dedicated Kick adapter/route/test not visible | Provider API availability/terms, auth and capabilities; unsupported operations hidden/disabled truthfully. |
| INT-017 | INTEGRATION / inbound provider webhook | Provider webhook registry/delivery route not visible | Signature/replay security follows SEC-009; idempotency, delivery log, retry and provider-specific signature tests. |
| INT-018 | INTEGRATION / provider capability registry | General provider registry not proven | Per-provider capability manifest/version/permission/quota; excludes AI model/provider configuration (AI-001). |
| INT-019 | INTEGRATION + SEC/AUDIT | Twitch audit records and encrypted tokens exist; redaction matrix not fully proven | No tokens/state/code in logs; structured secret redaction, retention and negative tests for errors/diagnostics. |
| INT-020 | INTEGRATION / diagnostics | Twitch config diagnostic, connection status and validation endpoints exist | Safe diagnostic report, provider latency/rate-limit/error category, recovery instructions and no secret exposure. |
| INT-021 | INTEGRATION / future payment/email adapters | Generic future intent only; no payment/email adapter route proven | Payment/email remain separate adapters with legal/provider gates; Store owns checkout/order workflow, NTF owns notification delivery. |

**Biztonsági megőrzési szabály:** a meglévő Twitch OAuth state hashing/TTL/single-use, encrypted token storage, refresh lock és site ownership kódot újra kell használni és megőrizni. Ne készüljön párhuzamos token store vagy második OAuth flow. A közös provider adapter a lifecycle/capability határt egységesíti, nem teszi az összes szolgáltató OAuth- és adatmodelljét azonossá.

**Státusz: IN PROGRESS / NOT PASS.** A Twitch alap kód- és tesztbizonyítéka létezik, de ebben a lépésben nem futott teszt és nem történt éles provider smoke. A RES-001–016 mátrixot a 63.30 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.30. RES-001–016 — canonical Media/Asset/Font/Icon Registry, egyedi-ID-s bizonyítékmátrix

A jelenlegi alap: `Env.MEDIA: R2Bucket`, `media` D1 tábla (id, object_key, original_name, mime_type, size_bytes, alt_text, created_at, site_id), `MediaAsset`/AssetReference type és normalizer a `src/core/domain/contracts.ts` fájlban, valamint Editor node-típusok/palette. A vizsgált Worker route-regiszterben nincs dedikált media API. Ebből a tárolási alap létezése bizonyítható; a teljes asset lifecycle nem.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| RES-001 | RESOURCE / MediaAsset type + D1 media | Canonical type/ID és metadata table alap létezik | Nincs bizonyított registry service/API, list/detail lifecycle vagy asset uniqueness policy; egyetlen registry legyen. |
| RES-002 | RESOURCE / D1 + R2 binding | D1 metadata és R2 binding létezik | Upload/delete/replace consistency, object-key generation, orphan scan, transaction/compensation and restore. |
| RES-003 | RESOURCE / upload API | Upload/progress/cancel/retry endpoint/UI nem látható | MIME sniffing, size cap, filename normalization, authorization, streaming upload, progress/cancel/retry and partial R2 failure. |
| RES-004 | RESOURCE / image processing | Thumbnail/variant/resize/crop/optimization pipeline nem bizonyított | Processing job/state, original retention, variant references, metadata stripping, dimension caps and retry. |
| RES-005 | RESOURCE / asset query | Registry search/filter/sort/pagination API nem látható | Server-side query over canonical assets only, site scope, stable sort, pagination and permission-aware UI. |
| RES-006 | RESOURCE / collections | Asset collection/tag/folder schema/API nem látható | Asset-only taxonomy, nested folder semantics, bulk move, delete/restore and no overlap with CNT/STORE taxonomy. |
| RES-007 | RESOURCE / metadata | Alt text field exists; license/source/caption/rights metadata not in the observed media schema | Required metadata policy by asset kind, rights/expiry/consent, provenance, accessibility warnings and import path. |
| RES-008 | RESOURCE / usage map | Asset reference normalizer exists; reference scanner/usage map not proven | Index every Page Model/domain reference, update on save/publish/delete, cross-site protection and “in use” report. |
| RES-009 | RESOURCE / safe lifecycle | Safe replace/archive/delete/restore service not visible | Referenced-delete block/replace, soft delete or recoverable tombstone, R2 failure compensation and audit. |
| RES-010 | EDITOR → RESOURCE | Editor has image/video/audio/icon/embed node types | Shared picker must consume the canonical registry and return asset ID/reference; Editor must not own upload metadata. |
| RES-011 | RESOURCE / icon registry | Icon node type exists; canonical icon catalog/search/category/preview not proven | License/provenance, searchable icons, stable ID, size/color semantics, keyboard accessible picker. |
| RES-012 | RESOURCE / SVG security | Sanitizer/upload gate not proven | SVG active-content sanitization, external reference rejection, CSP/content-type and malicious-file negative tests. |
| RES-013 | RESOURCE / font registry | Font node/type category exists; font registry/API/weight/style metadata not proven | Source/license, weight/style variants, fallback stack, preload/performance and public-safe delivery. |
| RES-014 | RESOURCE / private download | Authorized expiring download URL/service not visible | Signed URL expiry, site scope, one-time/limited access if needed, cache headers and no direct private R2 exposure. |
| RES-015 | RESOURCE / diagnostics | Broken-asset/metadata/orphan scan not proven | Scheduled/manual diagnostics, missing object and stale DB record report, repair workflow and safe retry. |
| RES-016 | RESOURCE + ENTITLEMENT | Paid/private asset access policy not implemented/proven | Server-side entitlement/access gate, revocation and expiry; public asset URLs cannot bypass private authorization. |

**Shared UI boundary:** az Editor, Content Studio, Store, Brand Kit és public renderer ugyanazt a canonical Asset ID-t/reference-et fogyasztja. A picker lehet újrahasználható UI, de nem külön media API, külön metadata store vagy második R2 naming system. Font/icon library szintén a RESOURCE domain része, a design token/font usage pedig a DESIGN_SYSTEM domainből hivatkozik rá.

**Státusz: IN PROGRESS / NOT PASS.** A meglévő táblát, bindingot és type-okat meg kell tartani és bővíteni; upload/pipeline/usage-map/safe-delete előtt nincs engedély párhuzamos asset rendszer vagy teljes funkció PASS jelölésére. A DSN-001–018 mátrixot a 63.31 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.31. DSN-001–018 — Brand Kit, design tokens, template és component registry

A forrásbizonyíték: `ThemeTokens`/ `SitePresentation` domain type-ok és normalizálók; a `migrations/0002_editor_platform.sql` létrehozza a `design_tokens` és `editor_components` táblákat, de egyik sem tartalmaz `site_id`-t. A vizsgált route-regiszterben nincs dedikált design-system/template/component CRUD API, és a canonical Editor UI-ban nem bizonyított teljes token/template szerkesztő.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| DSN-001 | DESIGN_SYSTEM / ThemeTokens + `design_tokens` | Token type/table alap létezik | Token schema/version, allowed token keys/types, responsive token and site scope. |
| DSN-002 | DESIGN_SYSTEM / token editor | Dedikált token editor/live preview nem bizonyított | CRUD UI/API, token preview across pages, validation and atomic apply. |
| DSN-003 | DESIGN_SYSTEM / dependency map | Token usage/dependency scanner nem látható | Page/component/template reference index, affected-item preview and delete/update guards. |
| DSN-004 | DESIGN_SYSTEM / version/rollback | Token version/diff/rollback route/schema nem látható | Immutable versions, diff, rollback as new version and renderer cache invalidation. |
| DSN-005 | DESIGN_SYSTEM / brand presets | Type-level presentation/token base only | Brand preset create/apply/duplicate/import/export, preview and safe override precedence. |
| DSN-006 | DESIGN_SYSTEM → EDT | Responsive helper exists in Editor | Shared breakpoint tokens and precedence across Editor, templates and public renderer. |
| DSN-007 | RESOURCE ↔ DESIGN_SYSTEM / fonts | Font node/type exists, canonical font registry not proven | Font metadata/license, weights, fallbacks, preload, accessible typography and performance. |
| DSN-008 | DESIGN_SYSTEM / site template | Site template registry/import flow not proven | Template manifest, schema version, asset dependencies, site-level apply/rollback and safe defaults. |
| DSN-009 | DESIGN_SYSTEM / page templates | No page-template registry API/UI proven | Page template CRUD, compatibility, preview, apply-to-new-page and non-destructive update. |
| DSN-010 | DESIGN_SYSTEM / section templates | Section template registry not proven | Reusable sections, responsive variants, token/asset refs and versioned update policy. |
| DSN-011 | DESIGN_SYSTEM / component templates | `editor_components` table exists but has no site scope or dedicated API | Canonical component schema, ownership, variants, slots, permissions and schema migrations. |
| DSN-012 | DESIGN_SYSTEM / master-instance | Master/instance propagation not proven | Stable master ID, instance references, explicit detach/override and dependency map. |
| DSN-013 | DESIGN_SYSTEM / variants/slots | Component variant/slot/override lifecycle not proven | Defined precedence, invalid slot fallback, accessibility and template compatibility. |
| DSN-014 | DESIGN_SYSTEM / versioning | Versioned design/component schema not proven | Version compatibility, migration preview, rollback and separate AI prompt versioning (AI-002). |
| DSN-015 | DESIGN_SYSTEM / import/export | Template import/export route not proven | Signed/validated manifest, asset dependency resolution, safe JSON/schema validation and license attribution. |
| DSN-016 | DESIGN_SYSTEM / Button Registry | Editor has button node and style props; global Button Registry not proven | Shared variants/styles across pages, token references and compatibility without copying domain logic. |
| DSN-017 | DESIGN_SYSTEM ↔ RESOURCE/INT | Icon node and link/button node exist; shared action/icon registry not proven | Icon IDs and action contract, allowlisted targets, safe URLs and no arbitrary page code. |
| DSN-018 | EXTENSION/MKT ↔ DESIGN_SYSTEM | Marketplace is roadmap-only; no marketplace route/schema proven | Review/license/signature/version/compatibility and legal gate; never load untrusted template code directly. |

**Site-scoping decision gate:** `design_tokens.name` is globally UNIQUE and `editor_components` has no `site_id`. These may be legacy single-site constraints; they must not be changed blindly. Before multi-site/agency SaaS, define whether each record is global, workspace-scoped or site-scoped; migrate existing rows safely and add cross-site negative tests. Design-system APIs must reuse one canonical registry, not create a second theme/template database.

**Státusz: IN PROGRESS / NOT PASS.** A DYN/SET/SEO mátrixot a 63.32 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.32. DYN-001–008, SET-001–004, SEO-001–005 — public data, settings és metadata contract

A forrásbizonyíték: `src/routes/admin/settings.ts` és `src/routes/public/site-settings.ts` a globális `site_settings.key='site'` rekordból csak `siteName`/ `tagline` mezőket kezel; a Page Model normalizer előkészít `canonical` és `openGraph` metadata mezőket, de a publikus renderer csak `document.title` és látható cím/leírás értékét frissíti. Az Editor schedule blockja egy szűk, whitelistelt schedule bindingot használ, általános data-source registry nem bizonyított.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| DYN-001 | DYNAMIC_DATA / schedule binding | Schedule block binding `source: schedule_items` és public read query létezik | Általános source registry canonical domain API-kon, versioned schemas és permission-aware capability registry. |
| DYN-002 | DYNAMIC_DATA / binding schema | Schedule config normalizer/type validation létezik | Minden source/field type compatibility, nullability, required fields, schema version and invalid-reference errors. |
| DYN-003 | DYNAMIC_DATA / query contract | Schedule read limit/status/platform/order whitelistelt | Általános filter/sort/transform csak allowlistelt AST-n keresztül; arbitrary SQL/JS nem engedélyezett. |
| DYN-004 | DYNAMIC_DATA / conditional rendering | Node visibility mező létezik; adatfeltétel engine nem bizonyított | Typed predicates, safe operators, missing-data fallback and no secret-dependent public leak. |
| DYN-005 | DYNAMIC_DATA + ADM-008 | Schedule read hibát jelez; általános loading/empty/partial/stale/error state machine nincs bizonyítva | Közös UI-state contract, domain-specific data state és accessible retry. |
| DYN-006 | DYNAMIC_DATA / cache | Néhány request no-store, általános cache/freshness/invalidation service nem látható | Source-specific TTL, publish/sync invalidation, stale fallback and race handling. |
| DYN-007 | DYNAMIC_DATA + SEC/PAGE | Public page read szűri a published page-et; preview auth-olt | Source-level server permission, site scope, published-only and member-entitlement boundary. |
| DYN-008 | DYNAMIC_DATA / diagnostics | Általános binding diagnostics nem bizonyított | Missing/invalid reference report, preview trace, safe error details and recovery path. |
| SET-001 | SETTINGS / site_settings | Admin CRUD csak siteName/tagline és global key='site' rekord | Canonical settings schema/version, validation, lifecycle and settings domain split. |
| SET-002 | SETTINGS + SEC / site ownership | Page/schedule/Twitch/media site scope több helyen létezik; settings global | Site-scoped migration csak minden read/write consumer auditja, backfill/rollback és cross-site negative tests után. |
| SET-003 | SETTINGS / public projection | Public endpoint csak siteName/tagline mezőket ad vissza | Public-safe projection mezőlista és secret/private field exclusion tests; nincs full settings object kitéve. |
| SET-004 | SITE_DOMAIN / custom domains | Domain verification/DNS/SSL lifecycle nem bizonyított | Ownership challenge, DNS/SSL state, primary domain switch, redirect/canonical URL and failure recovery. |
| SEO-001 | SEO_PUBLICATION / Page Model | Metadata type előkészíti title/description/canonical mezőket; title/description client-side update | Server-rendered or crawler-compatible per-page metadata, canonical/robots validation and publish snapshot. |
| SEO-002 | SEO_PUBLICATION / OG/X | `openGraph` placeholder van a Page Modelben; OG/X metadata/social preview nincs bizonyítva | og:title/description/image, X card, image validation/crop, preview and crawler acceptance. |
| SEO-003 | SEO_PUBLICATION / structured data | Structured data/schema.org generation nem látható | Typed allowlisted schemas only when applicable, validation, escaping and no invented facts. |
| SEO-004 | SEO_PUBLICATION / sitemap/robots | `visual-page.html` statikus `robots=index,follow`; dedicated sitemap/robots route/file nem látható | Per-site sitemap and robots policy, draft/preview exclusion, redirects, publish/cache invalidation and canonical host. |
| SEO-005 | SEO_PUBLICATION / diagnostics | Dedicated SEO audit/preview not proven | Missing/duplicate metadata, invalid canonical, broken link, indexability and public HTTP status report. |

**Public metadata acceptance:** a kliensoldali `document.title` módosítás nem bizonyítja, hogy a crawler a helyes title/description/OG/canonical adatot kapja. Minden publikált page-hez ellenőrizni kell a nyers HTTP HTML-t, status code-ot, canonical/robots/OG/X/structured data kimenetet és sitemap inclusiont; draft/preview nem indexelhető. Ezt browser/HTTP acceptance nélkül nem lehet PASS-nak jelölni.

**Státusz: IN PROGRESS / NOT PASS.** A CNT/LIV mátrixot a 63.33 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.33. CNT-001–022 és LIV-001–010 — Content Studio és Live State domainhatár

A jelenlegi route-regiszterben a Twitch adapter és schedule sync látható, de nincs dedikált Content Studio CRUD/publishing route, content-domain migration/schema vagy live-state API. Az Editor node palette tartalmaz media node-típusokat és schedule blokkot; ez nem bizonyít canonical content libraryt vagy live domain-t.

| ID | Owner / forrás | Látható alap | Nyitott acceptance / függőség |
|---|---|---|---|
| CNT-001 | CONTENT / canonical content schema | Content item D1 schema/service nem látható | Canonical ID, provider IDs, type/status/visibility, owner/site, lifecycle and rights references. |
| CNT-002 | CONTENT + INT / VOD import | Twitch VOD adapter/route nem látható | Supported provider import, pagination/quota, dedupe, metadata mapping and manual import fallback. |
| CNT-003 | CONTENT / clips/highlights/Shorts | Clip/Short management route/schema nem látható | Source video/timecode, crop/aspect, provider URL/ID, rights and lifecycle. |
| CNT-004 | CONTENT + INT / YouTube/TikTok feed | Dedicated adapters/routes not proven | Capability-gated read/publish permissions, per-provider limits and truthful unsupported states. |
| CNT-005 | CONTENT / taxonomy | Content tags/categories/collections/playlists schema not proven | Content-specific taxonomy, not shared with Store product taxonomy or RESOURCE folders. |
| CNT-006 | CONTENT / library query | Canonical content query API/UI not proven | Site-scoped search/filter/sort/pagination/bulk action, stable sort and authorization. |
| CNT-007 | CONTENT / dedupe | External IDs in a canonical content model not proven | Unique provider+account+external ID, duplicate merge/review and import idempotency. |
| CNT-008 | CONTENT / featured/related | Relationship model not proven | Stable content references, deleted/unpublished fallback and public projection. |
| CNT-009 | CONTENT / content calendar | Schedule domain exists, content calendar does not | Separate content publishing jobs linked to schedule; do not treat every content post as a stream event. |
| CNT-010 | CONTENT / ideas/drafts/scripts | Draft/brief schema not proven | Draft/review lifecycle, owner/permissions, autosave and version history. |
| CNT-011 | CONTENT / platform variants | Platform-specific metadata schema not proven | Per-provider length/format validation, locale variants and preview. |
| CNT-012 | CONTENT → RESOURCE | Editor image/media nodes and asset reference type exist | Canonical asset ID workflow, thumbnail selection, rights and missing-asset state. |
| CNT-013 | CONTENT / publishing queue | Queue/job schema/worker not proven | Durable scheduled jobs, timezone, cancel/retry, idempotency and provider confirmation. |
| CNT-014 | CONTENT / publish result | Partial-success model not proven | Per-provider result, retry failed destinations only, no false “published” status. |
| CNT-015 | CONTENT / approval | Approval workflow not proven | Author/reviewer role, approval state, immutable reviewed snapshot and publish gate. |
| CNT-016 | CONTENT ↔ CAMPAIGN | Campaign/content relationship not proven | Canonical references and attribution contract; analytics consumes events without owning content. |
| CNT-017 | CONTENT / short export | Export-preparation pipeline not proven | Aspect ratios, crop/reframe, captions/audio, codec/size constraints and progress/retry. |
| CNT-018 | CONTENT / transcript artifacts | AI transcript/chapter/highlight artifact lifecycle not proven | Source timestamps/confidence, human review, rights checks; AI-014 suggests but CONTENT owns approved artifacts. |
| CNT-019 | EDITOR → CONTENT projection | General content-feed block not proven; schedule block exists | Block binds canonical content projection, not copies content records into Page Model. |
| CNT-020 | CONTENT / public feed | Canonical published-content projection not proven | Published-only API, query/filter contract, stable IDs, cache invalidation and WEB-017 route consumption. |
| CNT-021 | CONTENT / timeline editor | Timeline-based video editing/render pipeline not proven | Separate media pipeline/worker feasibility, source asset retention, export status/cost and legal review. |
| CNT-022 | CONTENT / rights and takedown | Rights/consent/expiry schema not proven | Music/video/guest permission, expiry, takedown SLA, propagation to all public feeds and audit. |
| LIV-001 | LIVE_STATE / normalized state | Twitch connection exists; canonical live/offline service not proven | Provider-neutral state machine, online/offline transitions, event time and account binding. |
| LIV-002 | LIVE_STATE / freshness | Twitch connection validation time exists, but live-data freshness model not proven | Last fetched/observed timestamps, TTL, stale fallback and UI stale indicator. |
| LIV-003 | LIVE_STATE / stream metadata | Schedule includes title/platform/time; current live title/category data route not proven | Live stream title/category/game/start time from provider with normalized fields. |
| LIV-004 | LIVE_STATE / metrics | Viewer/follower/subscriber metrics API/read model not proven | Permission and provider availability, units/window/freshness, privacy and quota. |
| LIV-005 | LIVE_STATE / player | Static page shell exists; live player/offline fallback not proven | Safe provider embed, responsive sizing, autoplay policy, offline card and unsupported provider fallback. |
| LIV-006 | LIVE_STATE / event normalization | Normalized live event bus not proven | Start/end/title/category/provider events, dedupe and event time semantics. |
| LIV-007 | LIVE_STATE → ADM/PUBLIC/EDT | Admin and public live-status projection not proven | Dashboard and public blocks consume same normalized read model and truthful stale/error state. |
| LIV-008 | LIVE_STATE + INT / multistream | Multistream destination orchestration not proven | Capability matrix, platform-specific metadata, policy/legal review and per-destination partial failure. |
| LIV-009 | LIVE_STATE / unified chat | Unified chat read/send/moderation service not proven | Per-provider read vs send scopes, provider labels, moderation, rate limits and partial-failure handling. |
| LIV-010 | LIVE_STATE / recording/replay | Recording/replay status/retention/cost lifecycle not proven | Supported provider capabilities, retention/cost policy, authorized access and no unsupported promise. |

**Határszabály:** a `schedule_items` az adásrend kanonikus rekordja, nem a content library. A Twitch adapter connection metadata-t és schedule segmentet adhat; a Content Studio canonical content itemeket birtokolja, a Live State pedig a pillanatnyi stream állapotot. A public page és Editor blokk csak ezeket a read projectionöket fogyasztja. Sem a Page Model, sem az Integrations modul nem válhat content/live catch-all adattárrá.

**Státusz: IN PROGRESS / NOT PASS.** A COM/STO/SUP mátrixot a 63.34 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.34. COM-001–020, STO-001–021, SUP-001–012 — Community, Store és Support/Entitlement

A route-/schema-leltárban nem látható dedikált Community/Fan Identity, Product/Order/Payment vagy Support/Membership/Entitlement domain route és migration/test suite. Ezeket **nem kész funkcióként**, hanem tervezett domainként kezeljük. A meglévő Twitch auth, Page Model és RESOURCE alapokat csak explicit connectorokon keresztül szabad fogyasztani.

| ID | Owner / forrás | Állapot és kötelező acceptance |
|---|---|---|
| COM-001 | COMMUNITY / external links | Statikus linkek lehetnek, de canonical link registry nem bizonyított; URL safety, visibility és broken-link check kell. |
| COM-002 | COMMUNITY ↔ INT / Discord entry | Discord adapter nem bizonyított; install/guild permissions és honest unavailable state szükséges. |
| COM-003 | COMMUNITY / posts | Canonical post schema/API nincs bizonyítva; draft/publish/edit/archive, author/site scope és moderation audit kell. |
| COM-004 | COMMUNITY / polls | Poll/vote schema nincs bizonyítva; open/close, one-vote policy, rate-limit és tamper-resistant tally kell. |
| COM-005 | COMMUNITY / events & RSVP | Event domain külön a stream schedule-től; RSVP consent/capacity/cancel and timezone handling kell. |
| COM-006 | FAN_IDENTITY / profiles/follows | Fan account lifecycle nincs bizonyítva; profile privacy, block/unfollow, export/delete és account isolation kell. |
| COM-007 | COMMUNITY / comments/reactions | Comment/reaction API nincs bizonyítva; abuse/rate-limit, moderation, delete and permission checks kell. |
| COM-008 | COMMUNITY / clip submission | Content intake workflow nincs bizonyítva; upload asset reference, consent/rights, review and takedown kell. |
| COM-009 | COMMUNITY / moderation | Report/ban/role lifecycle nincs bizonyítva; least privilege, reason, appeal, audit and expiry kell. |
| COM-010 | COMMUNITY / reputation/challenges | Badge/reputation engine nincs bizonyítva; anti-abuse rules, explainable scoring and privacy controls kell. |
| COM-011 | NTF / notifications | Notification delivery domain nincs bizonyítva; community eventből idempotens notification event és truthful delivery state kell. |
| COM-012 | COMMUNITY / abuse | General rate-limit/spam controls nem bizonyítottak; per-account/IP/action limits, abuse reports and fail-safe policy kell. |
| COM-013 | COMMUNITY ↔ ENTITLEMENT | Member-only visibility gate nincs bizonyítva; minden server read ellenőrizze a canonical entitlementet, UI hide nem elég. |
| COM-014 | COMMUNITY / Founding Supporters | Opt-in listing model nincs bizonyítva; consent receipt, revoke, display-name policy and delete propagation kell. |
| COM-015 | FAN_IDENTITY/NTF / email signup | Consent/subscriber API nincs bizonyítva; double opt-in policy, consent timestamp/source and provider contract kell. |
| COM-016 | NTF/AUT / newsletter automation | Segmentation/automation engine nincs bizonyítva; audience consent, suppression, safe trigger and audit kell. |
| COM-017 | FAN_IDENTITY/NTF / unsubscribe | Suppression/export/delete workflow nincs bizonyítva; unsubscribe idempotency, retention and provider propagation kell. |
| COM-018 | COMMUNITY/WEB / visibility | Public/member/private policy nincs bizonyítva; single canonical visibility rule consumed by all surfaces. |
| COM-019 | FAN_IDENTITY / account lifecycle | Fan identity distinct from creator/Admin users; session, preferences, export/delete, consent withdrawal and cross-account negative tests. |
| COM-020 | COMMUNITY / rules and enforcement | Rules/age/content policy engine not proven; versioned rules, acknowledgement, enforcement reason, appeal and legal review. |
| STO-001 | PRODUCT / catalog | Product table/API/UI not visible; canonical product IDs and lifecycle needed. |
| STO-002 | PRODUCT / variants/SKU/price | Variant/SKU/currency schema not proven; currency precision, SKU uniqueness, price history and availability rules needed. |
| STO-003 | PRODUCT / taxonomy | Product categories/collections separate from CNT and RESOURCE taxonomies; relation and migration policy needed. |
| STO-004 | PRODUCT → RESOURCE/SEO | Product media/SEO not proven; canonical asset references, public-safe fields and SEO projection. |
| STO-005 | PRODUCT / type | Physical/digital/bundle/preorder/limited-drop support not proven; type-specific fulfillment and availability rules. |
| STO-006 | PRODUCT/ORDER / inventory | Inventory/fulfillment abstraction not proven; reserve/release, oversell policy and reconciliation. |
| STO-007 | STOREFRONT / listing/search | Public product listing/detail/search/filter not proven; published/active products only and correct currency. |
| STO-008 | ORDER / checkout provider | Checkout workflow/provider not proven; payment provider chosen after security/legal review, no DIY card storage. |
| STO-009 | ORDER / lifecycle | Canonical order/payment status schema not proven; provider-confirmed state transitions and idempotency. |
| STO-010 | ORDER / fulfillment | Shipping/tracking/cancel/refund lifecycle not proven; partial fulfillment and compensation workflow. |
| STO-011 | PRODUCT/ORDER / promotions | Coupon/promo/gift-card engine not proven; expiry, usage caps, stacking and abuse controls. |
| STO-012 | ENTITLEMENT / digital purchase | Purchase entitlement not proven; grant/revoke based on confirmed order/refund state, not UI. |
| STO-013 | RESOURCE/ENTITLEMENT / secure delivery | Secure download access not proven; short-lived signed URL, entitlement re-check and revoke/expiry. |
| STO-014 | ORDER / tax/shipping/VAT | Compliance integration not proven; provider and jurisdiction decision required before launch. |
| STO-015 | FAN_IDENTITY/ORDER / customer history | Customer account/history not proven; private order authorization, export/delete and minimum PII. |
| STO-016 | ORDER/AUT / abandoned cart | Abandoned-cart lifecycle not proven; deferred feature, consent/marketing policy and idempotent reminders. |
| STO-017 | EDITOR → PRODUCT projection | Product block not proven; Editor only configures view/query, PRODUCT owns catalog. |
| STO-018 | INT/ORDER / webhook idempotency | Payment webhook route/registry not proven; SEC-009 signature/replay, dedupe key, retry and audit. |
| STO-019 | PRODUCT/ORDER / merchant of record | Provider/merchant-of-record decision unresolved; explicit legal, tax, refund and consumer-rights gate. |
| STO-020 | ANALYTICS / store metrics | Store analytics read model not proven; derive from canonical order/product events, privacy-safe and source-labelled. |
| STO-021 | ORDER / legal compliance | VAT/invoice/consumer rights gate unresolved; must be decided before real transactions, not after implementation. |
| SUP-001 | SUPPORT / tip links | External links possible but support provider registry/state not proven; canonical URL and privacy/safety check. |
| SUP-002 | SUPPORT / tip status | Provider-confirmed donation/tip state not proven; never fabricate successful payment/receipt. |
| SUP-003 | SUPPORT / goals | Support goal/progress model not proven; event source, currency, date range and public opt-in policy. |
| SUP-004 | SUPPORT / membership tiers | Membership tier/billing period schema not proven; provider mapping and lifecycle. |
| SUP-005 | ENTITLEMENT / perks | Perk definition not proven; access policy separated from community/page UI and billing state. |
| SUP-006 | ENTITLEMENT / canonical access | Entitlement service/schema not proven; canonical grant/revoke/expiry decisions with audit. |
| SUP-007 | SUPPORT/ENTITLEMENT / renewal/cancel | Renewal/failed-payment lifecycle not proven; webhook-confirmed state and grace-period policy. |
| SUP-008 | ENTITLEMENT / refund/chargeback | Refund/chargeback handling not proven; revoke/restore semantics and reconciliation. |
| SUP-009 | ENTITLEMENT → INT/Discord | Discord role sync not proven; role changes derive from entitlement and retry idempotently. |
| SUP-010 | SUPPORT / supporter history | Supporter history/opt-in public listing not proven; consent, retention, export and revoke. |
| SUP-011 | ENTITLEMENT → WEB/COM | Content/event membership entitlement not proven; all surfaces consume same decision and deny by default. |
| SUP-012 | PRODUCT/ENTITLEMENT / member discount | Member discount/exclusive drop not proven; price eligibility server-side, anti-abuse and order snapshot. |

**Kötelező életciklus-szabály:** a Store Order, provider Payment state, Support event és Entitlement nem egyetlen státusz. A payment provider megerősített eseménye frissíti az ORDER állapotot; az ENTITLEMENT policy ebből dönt hozzáférésről; COMMUNITY/WEB/RESOURCE csak ezt olvassa. Refund/chargeback/cancel esetén a hozzáférés változását idempotensen és auditáltan kell végrehajtani. Semmilyen UI vagy AI nem állíthat be közvetlenül fizetési vagy tagsági állapotot.

**Státusz: IN PROGRESS / NOT PASS.** Az ANL/CAM/AUT/AI mátrixot a 63.35 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.35. ANL-001–010, CAM-001–009, AUT-001–014, AI-001–021 — Analytics, Campaigns, Automation és SANCI AI

A jelenlegi route-/migration-/test-leltárban nem látható dedikált analytics event/read model, campaign/deal, automation workflow/run engine vagy AI provider/action/approval API. Ez a mátrix a tervezett szerződéseket rögzíti, nem állít meglévő implementációt.

| ID | Owner | Státusz és kötelező acceptance |
|---|---|---|
| ANL-001 | ANALYTICS | Event taxonomy/schema registry nem bizonyított; versioned names/units/source/consent és deprecation policy kell, trigger routing AUT-001-től külön. |
| ANL-002 | ANALYTICS | Privacy-safe web analytics nincs bizonyítva; consent, IP/PII minimization, retention, bot filtering and export authorization. |
| ANL-003 | ANALYTICS | Stream analytics read model nincs bizonyítva; provider permissions, metric unit/window/source/freshness and missing-data state. |
| ANL-004 | ANALYTICS | Content analytics nincs bizonyítva; provider metrics join canonical CNT IDs, never mutate content records. |
| ANL-005 | ANALYTICS | Commerce analytics nincs bizonyítva; derive from confirmed order events, refund/currency normalization and privacy policy. |
| ANL-006 | ANALYTICS | Community analytics nincs bizonyítva; aggregate/minimize member data, consent and abuse/bot filtering. |
| ANL-007 | ANALYTICS | Date compare/filter/export API nincs bizonyítva; timezone boundaries, CSV/format safety, scoped exports. |
| ANL-008 | ANALYTICS | Source/freshness/unit/missing state nincs bizonyítva; unknown is not zero, stale/estimated data explicitly labelled. |
| ANL-009 | ANALYTICS + SEC | Consent/retention/bot filtering service nincs bizonyítva; opt-out, deletion propagation and retention enforcement. |
| ANL-010 | ANALYTICS | Anomaly detection/alerts nincs bizonyítva; explainable threshold, false-positive handling and human-readable source. |
| CAM-001 | CAMPAIGN | Campaign CRUD/status/goals schema/API nincs bizonyítva; state machine, owner, dates and permissions. |
| CAM-002 | CAMPAIGN + ANALYTICS | UTM/attribution service nincs bizonyítva; canonical campaign IDs, attribution window and consent policy. |
| CAM-003 | CAMPAIGN | Asset/content/product relationship model nincs bizonyítva; references only, no duplicated domain records. |
| CAM-004 | CAMPAIGN/RESOURCE | Media-kit generator/export nincs bizonyítva; public/private field separation, asset rights, version and expiry. |
| CAM-005 | SPONSORSHIP | Lead/deal/rate-card model nincs bizonyítva; private access, approval and no AI-generated binding offer without review. |
| CAM-006 | SPONSORSHIP | Deliverable/deadline/reminder workflow nincs bizonyítva; timezone, reminder idempotency and completion audit. |
| CAM-007 | ANALYTICS/CAMPAIGN | Sponsor campaign report nincs bizonyítva; source-labelled metrics, access control and export. |
| CAM-008 | SPONSORSHIP/SEC | Private business documents/permission not proven; scoped access, download expiry, audit and deletion. |
| CAM-009 | SPONSORSHIP/ORDER | Invoice/payment status unresolved; only after legal/accounting/provider decision, never as a fabricated local payment state. |
| AUT-001 | AUTOMATION | Trigger-event catalog/routing contract not proven; consume versioned domain events, separate from ANL measurement taxonomy. |
| AUT-002 | AUTOMATION | Trigger catalogue/UI not proven; typed events, source ownership and supported trigger capability. |
| AUT-003 | AUTOMATION | Condition/filter engine not proven; safe typed expression tree, limits and no arbitrary code execution. |
| AUT-004 | AUTOMATION | Action catalog/execution API not proven; allowlisted canonical domain commands, server permission re-check per run. |
| AUT-005 | AUTOMATION | Delay/schedule/timezone engine not proven; durable jobs, DST, cancellation and bounded scheduling horizon. |
| AUT-006 | AUTOMATION | Idempotency/deduplication not proven; stable event/run/action keys and duplicate delivery tests. |
| AUT-007 | AUTOMATION | Retry/backoff/dead-letter not proven; bounded retry, jitter, provider Retry-After, dead-letter review. |
| AUT-008 | AUTOMATION | Run history/diagnostics not proven; input/output redaction, correlation ID and safe recovery; SEC-010 owns security audit events. |
| AUT-009 | AUTOMATION | Dry-run/preview/approval not proven; show exact planned actions/side effects before execution. |
| AUT-010 | AUTOMATION | Enable/pause/version/clone lifecycle not proven; immutable published versions and pause stops future runs. |
| AUT-011 | AUTOMATION | Cycle detection/rate limit not proven; bounded graph traversal, per-tenant quotas and runaway-loop kill switch. |
| AUT-012 | AUTOMATION | Provider outage/recovery not proven; circuit breaker, retry policy, partial failure and manual fallback. |
| AUT-013 | AUTOMATION | Automation template library not proven; versioned template schema, safe import and explicit review. |
| AUT-014 | AUTOMATION/SEC | Safe cross-domain actions not proven; owner API/command only, least privilege, idempotency and audit. |
| AI-001 | AI_OPERATION | AI provider/model registry not proven; capability/region/data handling/cost/lifecycle, separate from INT-018 social providers. |
| AI-002 | AI_OPERATION | Prompt/instruction version/evaluation not proven; versioned prompt, regression corpus, rollback and safety review; separate from DSN-014. |
| AI-003 | AI_OPERATION | Intent/task planner not proven; typed plan, bounded steps, cancellation and transparent uncertainty. |
| AI-004 | AI_OPERATION/SEC | Context selection/privacy filter not proven; minimum required data, site/permission filter and PII redaction. |
| AI-005 | AI_OPERATION | Structured action schema not proven; strict schema validation, allowlisted actions and reject unknown fields. |
| AI-006 | AI_OPERATION/SEC | Permission/ownership checker not proven; server-side authorization re-run immediately before each action. |
| AI-007 | AI_OPERATION | Diff/preview/approval workflow not proven; exact changes, affected pages/records, risks and approve/reject. |
| AI-008 | AI_OPERATION | Canonical API/command execution not proven; never direct-write business tables or bypass domain validation. |
| AI-009 | AI_OPERATION | Verify/audit/version/rollback not proven; read-after-write checks and compensating action when safe. |
| AI-010 | AI_OPERATION | Cost/quota/usage/error tracking not proven; provider/token cost, limits, failure states and user-visible usage. |
| AI-011 | AI_OPERATION → PAGE/CONTENT | Website assistant not proven; suggestions/drafts by default, diff and approval before public changes. |
| AI-012 | AI_OPERATION → SEO/SEC/LOC | SEO/accessibility/localization suggestions not proven; source evidence, no guaranteed ranking claims, human review. |
| AI-013 | AI_OPERATION → CONTENT | Content title/script/description/thumbnail brief not proven; draft artifacts, platform limits and rights review. |
| AI-014 | AI_OPERATION → CONTENT | Transcript/chapter/highlight candidates not proven; timestamps/confidence, human review and content API storage. |
| AI-015 | AI_OPERATION → LIVE_STATE | Stream diagnostics/summary not proven; only supported provider data, source/freshness and privacy controls. |
| AI-016 | AI_OPERATION | Specialist agent roles not proven; shared policy/permission/cost caps, no independent authority escalation. |
| AI-017 | AI_OPERATION | AI Control Center/approval queue not proven; queue state, actor, expiration, approve/reject and audit. |
| AI-018 | AI_OPERATION/SEC | Prompt injection/untrusted-content tests not proven; hostile webpage/chat/content corpus and tool-output isolation. |
| AI-019 | AI_OPERATION/SEC | Human approval policy not proven; public/destructive/financial actions always require explicit approval and revalidation. |
| AI-020 | PRODUCT/QA | AI-free fallback not proven; every critical manual workflow must work with AI disabled/provider outage. |
| AI-021 | AI_OPERATION/RESOURCE | Multimodal generation adapters not proven; provider capability, rights/safety checks, cost limit, asset provenance and human review. |

**Kanonikus végrehajtási lánc:** ANALYTICS mérési eseményt és riportot birtokol; CAMPAIGN üzleti kampányt/dealt birtokol; AUTOMATION eseményből engedélyezett actiont hajt végre; AI tervet/javaslatot készít és jóváhagyott canonical commandokat kér. Ezek között explicit versioned event/API contract legyen. Egy analytics event nem automatikusan workflow trigger, egy AI-javaslat nem domain state, és egy workflow-run nem helyettesíti a security audit logot.

**Státusz: IN PROGRESS / NOT PASS.** A SEC/OPS/QA/LOC/TEAM mátrixot a 63.36 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.36. SEC-001–012, OPS-001–011, QA-001–010, LOC-001–006, TEAM-001–007 — cross-cutting acceptance contract

A jelenlegi forrásban auth/session/password/require-auth, site-context/ownership, audit helper, health/db-health, migrations és célzott tesztek léteznek. Nem bizonyított teljes MFA/SSO, RBAC permission matrix, backup/restore service, structured observability, locale workflow, workspace/team/billing implementation. A keresztmetszeti szerződések minden modulra kötelezők, de nem helyettesítik az egyes modulok adatgazdáját.

| ID | Owner | Állapot és kötelező acceptance |
|---|---|---|
| SEC-001 | IDENTITY | Login/logout/session/bootstrap route létezik; expiry/revocation/rotation and browser session matrix must be verified. |
| SEC-002 | SECURITY | require-auth/site ownership helpers exist; complete role/action permission matrix and server-side negative tests for every mutating route required. |
| SEC-003 | SECURITY / tenant isolation | Several routes are site-scoped, but global settings/design tables and global unique constraints remain; cross-site negative test for every domain/API and multi-site migration decision required. |
| SEC-004 | SECURITY / OAuth/CSRF | Twitch OAuth state protections exist; global CSRF/session-cookie policy, origin checks and every mutation route need audit. |
| SEC-005 | SECURITY / XSS/sanitization | Renderer escapes text and safeUrl handles some links; complete HTML/URL/embed/SVG/form sanitization and CSP acceptance not proven. |
| SEC-006 | SECURITY / SSRF/open redirect | General outbound URL policy not proven; allowlist outbound fetch, redirect target validation and DNS/IP/private-address defense for any server-side fetch. |
| SEC-007 | SECURITY / rate limit | General API/login/OAuth/submit rate limiter not proven; per-route/IP/account/provider limits, abuse alerts and retry policy. |
| SEC-008 | SECURITY / secret lifecycle | Twitch tokens encrypted and secret env keys used; secret rotation, redaction coverage, incident revoke and non-Twitch secret store not proven. |
| SEC-009 | SECURITY / webhooks | No generic webhook registry/receiver proven; provider signature verification, timestamp/replay defense, idempotency and negative tests. |
| SEC-010 | SECURITY/AUDIT | audit_log and helper exist; redaction/retention/export policy and complete security event coverage not proven. |
| SEC-011 | SECURITY/PRIVACY | Consent/retention/export/delete framework not proven; domain-by-domain PII inventory, consent withdrawal, deletion propagation and legal hold. |
| SEC-012 | IDENTITY/SECURITY | MFA/2FA/SSO/recovery/suspicious-login controls not proven; staged roadmap, recovery codes, session revoke and anti-lockout acceptance. |
| OPS-001 | OPERATIONS | Health and DB-health endpoints exist; deploy version/runtime commit visibility and public/private diagnostics boundary must be verified. |
| OPS-002 | OPERATIONS | Structured logs/correlation IDs not proven; request ID propagation, redaction and traceable API→provider flow. |
| OPS-003 | OPERATIONS | Error tracking/alerting service not proven; alert thresholds, ownership, dedupe and runbook. |
| OPS-004 | OPERATIONS / migrations | Migration directory and migration commands exist; every migration needs preflight, integrity/foreign-key check, backup and rollback plan. |
| OPS-005 | BACKUP | Backup/export/restore service not proven; encrypted backup, manifest, retention, ownership and restore acceptance. |
| OPS-006 | BACKUP/OPS | Recovery drill/runbook not proven; tested RTO/RPO targets, clean restore environment and evidence log. |
| OPS-007 | OPERATIONS | Unified diagnostics report not proven; safe environment/schema/provider/migration status without secrets. |
| OPS-008 | OPERATIONS | Performance/query/cache monitoring not proven; public route budgets, D1 query/index review, payload size and concurrency. |
| OPS-009 | OPERATIONS | Incident/rollback procedure not proven; deployment rollback, migration compatibility, incident roles and data recovery. |
| OPS-010 | OPERATIONS/SEC | Dependency/license/CVE review not proven as automated gate; SBOM/dependency inventory, license compatibility and remediation SLA. |
| OPS-011 | OPERATIONS | Durable background job/realtime runtime not proven; select only when a justified feature needs it, with retry/idempotency/observability. |
| QA-001 | QA/CI | Typecheck/test scripts exist from prior project evidence; current CI workflow and build gate evidence must be rechecked before PASS. |
| QA-002 | QA | Domain/Twitch/Editor tests exist; missing media/public SEO/community/commerce/automation/AI suites remain separate acceptance work. |
| QA-003 | QA/SEC | Site-ownership/Twitch negative tests exist; every endpoint needs unauthorized, cross-site and stale-version negative coverage. |
| QA-004 | QA/UI | Dedicated browser/device visual regression suite not proven; desktop/tablet/mobile, touch, keyboard and real-browser tests required. |
| QA-005 | QA/PUBLIC | SEO/accessibility/performance audit not proven; HTTP HTML metadata, WCAG keyboard/contrast/reduced-motion, performance budgets. |
| QA-006 | QA/RELEASE | Health checks exist; deploy smoke, real provider smoke, route status and production version evidence required. |
| QA-007 | QA/BACKUP | Test/acceptance gate only; actual OPS-005/006 backup and restore operations must exist first. |
| QA-008 | QA/E2E | Full creator journey suite not proven; setup→connect→create→preview→publish→public read→rollback, with failures. |
| QA-009 | QA/PRODUCT | User acceptance/evidence log not proven as complete; record actual test run, result, environment and unresolved issues. |
| QA-010 | QA/PRODUCT | Continuous benchmark/feature discovery not proven as executable workflow; periodic evidence-based review, license/security and decision log. |
| LOC-001 | LOCALIZATION | Translation key/fallback service not proven; no hardcoded critical UI strings in supported locales and missing-key report. |
| LOC-002 | LOCALIZATION | Locale-aware dates/numbers/currency/timezone service not proven; DST/currency/format tests. |
| LOC-003 | LOCALIZATION | Page/content/navigation translation workflow not proven; localized variants, fallback and publish completeness. |
| LOC-004 | SEO/LOCALIZATION | hreflang/canonical localization not proven; localized slug map, reciprocal hreflang, canonical policy and sitemap entries. |
| LOC-005 | LOCALIZATION | Translation completeness/locale preview not proven; status per field/locale and safe publish policy. |
| LOC-006 | AI/LOCALIZATION | AI translation review flow not proven; draft only, human approval, glossary, source/target diff and audit. |
| TEAM-001 | WORKSPACE | Workspace/site switcher not proven; active scope shown clearly, server-side scope independent of client state. |
| TEAM-002 | WORKSPACE/IDENTITY | Invite/accept/revoke route/schema not proven; expiring single-use invitation, scope binding and revoke. |
| TEAM-003 | WORKSPACE/SEC | Granular roles/permissions not proven end-to-end; deny by default and route-level tests. |
| TEAM-004 | WORKSPACE | Approval/review/activity feed not proven; source-domain ownership, reviewer permissions and audit. |
| TEAM-005 | WORKSPACE | Multi-site workspace workflows not proven; scoped resources, cross-site isolation, migration/backfill and negative tests. |
| TEAM-006 | BILLING_PLAN | SaaS billing/plan entitlement/quota not proven; separate from store orders and fan membership, provider-confirmed state. |
| TEAM-007 | WORKSPACE/AGENCY | Agency/client workspaces, shared templates and client approvals not proven; client isolation, scoped brand/template ownership and access revoke. |

**Cross-cutting closure rule:** a shared security/operations feature may provide a reusable helper/service, but each domain still needs to prove it uses that service correctly. For example, the existence of `requireAuth` does not prove every route has the right role check; the existence of `audit_log` does not prove all sensitive actions are audited; the existence of a migration command does not prove backup/restore works.

**Státusz: IN PROGRESS / NOT PASS.** Az ADM/SEARCH/NTF/HELP/DEV/MKT/OBS mátrixot a 63.37, a teljes ID-fázis keresztmegfeleltetést a 63.38 azóta rögzíti; az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.37. ADM-001–013, SEARCH-001–005, NTF-001–005, HELP-001–004, DEV-001–006, MKT-001–005, OBS-001–010

A jelenlegi repositoryban az Admin shell/home, auth és Editor v2 létezik; a dedicated global search, notification delivery, help content/progress, developer API keys/outbound webhooks, extension registry/marketplace és OBS pairing/command API nem bizonyított a route-/schema-/test-leltárban. Az ADM csak felhasználói belépési pont és read projection, nem catch-all domain.

| ID | Owner | Állapot és kötelező acceptance |
|---|---|---|
| ADM-001 | ADMIN SHELL | Admin shell exists; canonical routes, navigation, active scope and access denied states must be consistent. |
| ADM-002 | ADMIN/DASHBOARD | Dashboard shell exists; every status card needs a canonical source, timestamp/freshness and partial-failure state. |
| ADM-003 | ADMIN/DASHBOARD | Quick-action entrypoints exist in concept; each must route to the owning module's canonical action, not duplicate mutation logic. |
| ADM-004 | ADMIN/DASHBOARD | Task/error aggregate is not proven; aggregate only permission-filtered domain items and link to owner module. |
| ADM-005 | ADMIN/AUDIT | audit_log/helper exists; recent activity UI/source filtering, redaction and site scope remain to prove. |
| ADM-006 | SEARCH | Global search/command palette entrypoint in menu map only; canonical search API/index and command routing not proven. |
| ADM-007 | IDENTITY | Login/session/logout routes exist; profile/preferences UI and secure session controls need acceptance. |
| ADM-008 | SHARED UI | Generic loading/empty/error/stale state standard not proven across all modules; presentation may be shared, domain state machine stays with owner. |
| ADM-009 | SEC/ADMIN | Permission-based menu visibility not proven fully; it is UX only and cannot replace server authorization. |
| ADM-010 | ADMIN SHELL | Mobile/tablet shell exists in some markup/CSS; real-device layout, focus, scroll and safe-area tests required. |
| ADM-011 | HELP_CENTER | Contextual help/onboarding entrypoint in menu map; help article/progress service not proven. |
| ADM-012 | NOTIFICATION | Dashboard notification entrypoint in menu map; canonical notification center/delivery/preferences not proven. |
| ADM-013 | ADMIN/OBSERVABILITY | Freshness/stale/partial status aggregate not proven; every card must identify source, updatedAt and error state. |
| SEARCH-001 | SEARCH | Permission-aware global index not proven; derived projection, tenant scope, permission filtering and deletion propagation. |
| SEARCH-002 | SEARCH | Command palette not proven; actions call canonical module commands with permission re-check, never raw arbitrary command strings. |
| SEARCH-003 | SEARCH | Saved views/favorites/recent list not proven; user-scoped preferences, deletion and scope switch behavior. |
| SEARCH-004 | SEARCH | Index freshness/invalidation not proven; publish/update/delete/permission revoke must propagate. |
| SEARCH-005 | SEARCH | Module filters/snippets not proven; snippets must not leak private fields and filters must be type/owner scoped. |
| NTF-001 | NOTIFICATION | In-app notification center/read-unread not proven; source module link, ownership and read-state lifecycle. |
| NTF-002 | NOTIFICATION | Delivery adapters/status not proven; distinguish queued/sent/delivered/failed only when provider evidence supports it. |
| NTF-003 | NOTIFICATION | User preferences/digest/quiet hours/channel opt-in not proven; locale/timezone and consent controls. |
| NTF-004 | NOTIFICATION | Event-to-notification idempotency/retry not proven; dedupe key, bounded retry and dead-letter review. |
| NTF-005 | NOTIFICATION/SEC | Unsubscribe/retention/payload minimization not proven; no sensitive content in push/email preview. |
| HELP-001 | HELP_CENTER | Contextual help map not proven; map by canonical module/feature ID and disclose limitations. |
| HELP-002 | HELP_CENTER | Onboarding progress not proven; role/site scoped, skip/restart and privacy-safe progress. |
| HELP-003 | HELP_CENTER | Versioned searchable docs/glossary not proven; canonical links, feature version and deprecation handling. |
| HELP-004 | HELP_CENTER/SEC | Troubleshooting/feedback diagnostics not proven; diagnostic IDs with automatic secret/PII redaction. |
| DEV-001 | DEVELOPER_API | Public API reference/version/deprecation not proven; generated schema, supported version and examples. |
| DEV-002 | DEVELOPER_API/SEC | Scoped API key lifecycle not proven; one-time display, hash/storage policy, rotation, expiry/revoke and no plaintext logs. |
| DEV-003 | DEVELOPER_API | Creator outbound webhook registry/tester not proven; separate from INT inbound provider webhooks, signature, retries and replay defense. |
| DEV-004 | DEVELOPER_API | Sandbox fixtures/events not proven; isolated test workspace, no production secrets or real payment effects. |
| DEV-005 | DEVELOPER_API | SDK/examples not proven; generated from versioned API schema, compatibility and safe auth handling. |
| DEV-006 | DEVELOPER_API | Quotas/rate-limit visibility not proven; per-key and per-workspace limits, usage telemetry and actionable 429 state. |
| MKT-001 | EXTENSION | Extension manifest/permissions not proven; explicit capabilities, origin, data access and review. |
| MKT-002 | EXTENSION | Install/update/uninstall/migration not proven; staged rollout, rollback and orphan cleanup. |
| MKT-003 | EXTENSION/MARKETPLACE | Theme/block/template/overlay marketplace not proven; signed/versioned artifacts and canonical DESIGN_SYSTEM/RESOURCE references. |
| MKT-004 | EXTENSION/MARKETPLACE | License/attribution/version/review not proven; provenance, vulnerability scan and compatibility review. |
| MKT-005 | EXTENSION/ORDER | Marketplace payment/revenue-share not proven; legal/provider/merchant-of-record gate and auditable settlement. |
| OBS-001 | STREAM_TOOLS | Overlay asset/scene metadata not proven; canonical RESOURCE references and versioned scene manifest. |
| OBS-002 | STREAM_TOOLS/SEC | OBS secure pairing/connection not proven; one-time pairing code, explicit trust, expiry/revoke and secret-safe storage. |
| OBS-003 | STREAM_TOOLS | Scene/stream/recording state adapter not proven; provider-supported capabilities and freshness. |
| OBS-004 | STREAM_TOOLS/SEC | Authorized commands/markers not proven; command allowlist, role/connection checks, confirmation for destructive action. |
| OBS-005 | STREAM_TOOLS | Browser source config not proven; safe URLs, per-overlay secret isolation and preview. |
| OBS-006 | STREAM_TOOLS/NTF | Provider-supported alerts not proven; event source, dedupe, rate limits and test mode. |
| OBS-007 | STREAM_TOOLS | Chatbot/commands/timers/loyalty/giveaways not proven; permissioned event/action engine, moderation and legal/provider constraints. |
| OBS-008 | STREAM_TOOLS | Test/replay/rate limit not proven; dry-run, event fixture replay and no unintended production actions. |
| OBS-009 | STREAM_TOOLS | Macro Deck/external control adapter not proven; scoped pairing, signed commands and disconnect behavior. |
| OBS-010 | STREAM_TOOLS/RESOURCE | Overlay preview/export/version not proven; canonical asset references, compatibility, export manifest and rollback. |

**Module boundary rules:** (1) Dashboard aggregates and navigates; it never owns domain records. (2) Search index is derived, permission-aware and deletable; it is not a second source of truth. (3) Notifications are derived from domain events and own delivery/preferences only. (4) Help references canonical feature IDs. (5) Creator outbound webhooks/API keys belong to DEV; provider inbound webhooks belong to INT. (6) Extension artifacts never gain direct arbitrary D1 access. (7) OBS is a dedicated Stream Tools domain; Editor can place an overlay preview/block but cannot own pairing or commands.

**Státusz: IN PROGRESS / NOT PASS.** Az egyedi-ID-s hiánymátrixok elkészültek, a fázis-keresztmegfeleltetést a 63.38 rögzíti; továbbra is nyitott a funkciókártyák kötelező mezőinek és a végső konzisztencia-gate-ek ellenőrzése. Az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.38. A 396 funkció-ID kanonikus F0–F11 fázis-keresztmegfeleltetése

Ez a mátrix a 24. fejezet stabil ID-jait köti a 41.2/63.5 roadmaphez. **Fázis-hozzárendelés nem készültségi státusz és nem implementációs engedély.** A korai fázisokban csak az ott szükséges core szelet készül; a későbbi funkciók a saját domainjükben megmaradnak. Ha egy ID több fázist érint, az ID-n belüli acceptance-et bontani kell, nem szabad az egész funkciót előrehozni.

| Funkció-ID | Kanonikus fázis | Határ / függőség |
|---|---|---|
| ADM-001, ADM-003, ADM-008–010 | F1 | Közös Admin shell, route/UX és shared state; nem domain-adatgazda. |
| ADM-002, ADM-004–007, ADM-011–013 | F1 alap + az adatforrás tulajdonosának fázisa | Csak olyan kártya jelenjen meg, amelynek canonical source, permission és freshness contractja létezik. |
| WEB-001, WEB-004–008 | F0 core workflow; bővített CMS F3 | F0-ban save/reload/preview/publish/revision megbízhatóság; nav/SEO/CMS kiterjesztés csak F3-ban. |
| WEB-002–003, WEB-009–014, WEB-018–024, WEB-028–032 | F3 | URL/nav/page lifecycle, form, public states, SEO/security és renderer; a F0 core mentési/publikálási contractjára épül. |
| WEB-015 | F3 shell + F5 live provider data | Live page shell korábban készülhet, de valós adat csak LIV/INT capability után. |
| WEB-016 | F0 meglévő schedule stabilitás + F3 public UX | A canonical SCH-010 projection marad egyetlen adatforrás. |
| WEB-017, WEB-025–027 | F3 shell + F7/F8 owning domain | Content route a CNT-020-re, store/member routes a STO/SUP/ENTITLEMENT-re épülnek; nem épülnek másolatként WEB-ben. |
| EDT-001–038, EDT-041–042, EDT-044 | F0 core Editor; közös shell elemek F1 | Page Model/commands/canvas/layers/Inspector/save/history/preview/publish; az existing v2 megőrzése és hibáinak lezárása. |
| EDT-039–040 | F0 schema/accessible baseline + F3 teljes page interaction/motion UX | EDT-039 nem AUT-004; csak page-local allowlisted interaction. Reduced motion keresztmetszeti acceptance. |
| EDT-043 | F3, külön rich-text gate | A jelenlegi structured schema megőrzendő, de a full Rich Text UX a plain-text/core workflow stabilizálása után. |
| DSN-001–018 | F2; DSN-018 F11 marketplace | Token/template/component registry és versioning; site scope döntés F11 előtt. |
| RES-001–002 | F0 minimális stabil asset reference/storage | Csak a core Editor/public flowhoz szükséges minimum, ne épüljön párhuzamos asset store. |
| RES-003–016 | F2; RES-016 a STO/ENTITLEMENT F8 capabilitytől is függ | Teljes asset registry, processing, usage map, safe deletion and paid/private access. |
| INT-001–010, INT-019–020 | F5, a Twitch meglévő alap F0-ban megőrzendő | Provider adapter/health/scope/token/security; a működő Twitch OAuth nem íródik újra. |
| INT-011 | F5 + F6 live/stream surfaces | Normalized live state külön LIV domainben. |
| INT-012–018 | F5; INT-017 security acceptance keresztmetszeti | Providerenként capability/permission/legal gate; nem minden provider ígérhető egyidejűleg. |
| INT-021 | F5 adapter contract; valódi payment/email használat F8/F1 notification dependency szerint | Provider lifecycle contract nem azonos Store vagy Notification workflowval. |
| LIV-001–007 | F5 live integration + F6 Stream Studio UX | Normalized state, freshness, player/blocks, dashboard and public read projection. |
| LIV-008–010 | F6; retention/cost/security gates keresztmetszetiek | Multistream, unified chat, recording/replay csak provider-supported capabilityvel. |
| OBS-001–010 | F6 | Pairing/commands/overlay/widget; RESOURCE és INT connectorok után. |
| SCH-001 | F0 meglévő CRUD stabilitás + F3 bővített lifecycle | A jelenlegi canonical schedule_items megőrzendő. |
| SCH-002–006, SCH-009, SCH-012–015 | F3 | Calendar, timezone/recurrence/conflict, game profile and export; DST correctness is release gate. |
| SCH-007–008 | F5 | Twitch sync/provider error/retry, manual override contract. |
| SCH-010–011 | F0 projection integrity + F3 public/Editor block parity | Egyetlen canonical projection; no duplicate event rows in Page Model. |
| CNT-001–022 | F7 | Content schema/library/publishing/editing/rights; uses RESOURCE/INT and analytics later. |
| COM-001–020 | F8 | Community and fan identity distinct from creator Admin identity; entitlement from SUP. |
| STO-001–021, SUP-001–012 | F8, STO-014/019/021 before real transaction | Product/order/support/entitlement; provider, tax, VAT, legal and consumer-rights gates. |
| ANL-001–010, CAM-001–009, AUT-001–014 | F9 | Event taxonomy, campaigns and automation are separate domains; workflow triggers are not analytics measurements. |
| AI-001–021 | F10 | Must use F0/F1 canonical permission/command/approval/logging foundations; no direct domain writes. |
| SEC-001–011 | Cross-cutting F0–F11 | Security and privacy gates apply to every feature; no late-only security phase. |
| SEC-012 | F4/F11 staged | MFA/recovery for creator accounts and later SSO; don't enable open registration before isolation/recovery tests. |
| OPS-001–004, OPS-007–011 | Cross-cutting F0–F11 | Health, migrations, logs, alerts, performance, dependency, background-job/realtime runtime selection and incident readiness in each release; choose a job runtime only when a justified feature needs it. |
| OPS-005–006, QA-007 | F0 minimum operational recovery + F11 expanded portability | Real restore/rollback drill required; QA-007 verifies it but does not implement it. |
| QA-001–006, QA-008–010 | Cross-cutting each F release | Relevant tests, runtime smoke and user acceptance before each phase closes. |
| LOC-001–002 | Cross-cutting from F0/F1 | Hungarian-first UI, locale-safe date/time/currency from the start. |
| LOC-003–005 | F3 public-site localization | Localized page/content/navigation/SEO and publish completeness. |
| LOC-006 | F10 AI-assisted flow + F3/F11 localization | Draft-only AI translation, human approval and audit. |
| SET-001, SET-003 | F0 legacy settings stability + F1 contract | Public-safe projection; site-scope migration only after consumer audit. |
| SET-002 | F1 ownership contract + F11 full multi-site | Every new endpoint must already use scope; full workspace model later. |
| SET-004 | F3 custom-domain/public canonical URL | DNS/SSL verification, redirect and canonical metadata. |
| DYN-001–008, SEO-001–005 | F3 | Domain read APIs and Page Model baseline first; public renderer/HTTP/crawler acceptance required. |
| TEAM-001–005 | F4 account/workspace foundation, F11 full multi-site/agency | Basic identity/onboarding precedes agency/client workflows; SEC-003 isolation blocks release. |
| TEAM-006–007 | F11 | SaaS billing/quota and agency/studio workflows. |
| SEARCH-001–005 | F1 base navigation/command palette; per-domain index adapters staged with F3/F5/F7/F8/F9 | Derived index only, permission-aware, deletion propagated; don't index unavailable domains as if complete. |
| NTF-001–005 | F1 shared UX contract; channel adapters staged with F5/F7/F8/F9 | Notification state/delivery separate from dashboard and automation. |
| HELP-001–004 | F1 core onboarding/help entrypoint; domain-specific articles follow module delivery | Help references canonical feature IDs and never claims unavailable capabilities. |
| DEV-001–006, MKT-001–005 | F11 | Developer/extension/marketplace trust boundary, license/security and legal gate. |

**Konzisztencia-korlát:** a fázis-hozzárendelés a funkció katalógus minden ID-ját lefedi csoportos vagy egyedi sorral; a tényleges végrehajtás előtt a 25/26. fejezet szerinti kártyán belül meg kell jelölni a pontos al-fázist, blokkoló dependency-t, acceptance-t és bizonyítékot. A táblázat nem állítja, hogy a jelenlegi repo a későbbi fázisokat megvalósítja.

**Státusz: IN PROGRESS / NOT PASS.** Az ID-unikalitás, csoportlefedettség és aktív pont statikus ellenőrzését a 63.39 rögzíti; a végső checklist és feature-card mezőellenőrzés még nyitott. Az aktuális következő pontot a legutolsó 63.x fejezet tartalmazza.

### 63.39. Statikus tervkonzisztencia-ellenőrzés — eredmény és maradó blokkolók

A kanonikus terv legutóbbi GitHub-változatán végzett statikus szöveg-/azonosító-ellenőrzés eredménye:

| Ellenőrzés | Eredmény | Jelentés |
|---|---|---|
| 24. fejezet stabil funkció-ID-k | **396 / 396 egyedi** | Nincs duplikált ID a 24. fejezet jegyzékében. |
| 49. fejezet főmoduljai | **22 / 22** | 49.1–49.22 folyamatos, duplikáció nélkül. |
| 54. fejezet review checklist | **156 tétel** | A 63.12–63.15 mátrixokban **156 / 156** tételhez tartozik megfeleltetési sor. |
| 54. checklist ID-hivatkozások | **nincs feloldatlan hivatkozás** | A korábbi 63.16 ellenőrzés szerint a mapping ID-k a 24. fejezetben léteznek. |
| 24. fejezet ID-k → 63.38 fázis-mátrix | **396 / 396 lefedve** | Az ellenőrzés először két hiányt talált: WEB-019 és OPS-011; a 63.38 táblázat javítva lett, majd az ellenőrzés mind a 396 ID-t lefedettnek találta. |
| Főfejezetek számozása | **64 főfejezet, duplikált szám nélkül** | A főfejezet-címek egyediek. |
| 63. alfejezetek számozása az akkori ellenőrzéskor | **39 alfejezet, duplikált ID nélkül** | Ez történeti pillanatkép; az újabb 63.40+ szakaszok később kerültek hozzá. |
| Aktív tervpont | **egy kanonikus azonosító** | A fő aktív pont minden irányadó helyen PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY; F0 nincs aktívként megjelölve. |

**Mit nem bizonyít ez az ellenőrzés:** nem igazolja a 396 funkció teljes szemantikai specifikációját, az egyes dependency-k technikai helyességét, a teljes történeti források egyeztetését, a valódi böngészős/Worker runtime viselkedést vagy bármelyik funkció PASS állapotát. A 63.38 csoportos fázis-hozzárendelést ad; a 25/26. fejezet szerinti, minden ID-ra kiterjedő kártya mezőszintű kitöltése továbbra sincs kész. A funkciókártyákban külön meg kell adni a pontos al-fázist, blokkoló függőségeket, permission/scope, API/schema, pozitív és negatív teszteket, rollbacket és bizonyítékot.

**Aktuális aktív pont:** PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY.

**Állapot: IN PROGRESS / NOT PASS.** A 63.40 gépi lefedettségi auditja megállapította, hogy a 396/396 ID-s mátrix nem helyettesíti a 26.1 szerinti teljes funkciókártyát. Az EDT-001–044 első bővített kártyavázlatai a 63.41–63.46 fejezetben elkészültek; a 63.47 mezőminőségi audit szerint még nem teljesítik a 25. fejezet minden státuszmezőjét és a 26.1 minden külön mezőjét. Következő lépés: a 44 EDT-kártya teljes mezőnormalizálása, utána azonos eljárás a WEB ID-kkal. Ez dokumentációs munka, nem implementációindítás. A végső PASS csak a teljes történeti és szemantikai audit, a funkciókártya-kapu és a 63.1–63.3 feltételek bizonyítása után adható meg.

### 63.40. Funkciókártya-mezők gépi lefedettségi auditja — 396 ID, 2026-10-14 (történeti pillanatkép)

**Hatókör:** 24. fejezet stabil ID-jegyzéke, 25. fejezet státuszmezői, 26.1 funkciókártya-szerződése és 63.26–63.37 egyedi-ID-s mátrixai. Ez statikus dokumentumellenőrzés, nem kódteszt, runtime- vagy szemantikai PASS.

| Ellenőrzés | Eredmény | Helyes értelmezés |
|---|---:|---|
| Egyedi ID a 24. fejezetben | 396/396 | Stabil azonosító nincs duplikálva. |
| ID szerepel egyedi-ID-s bizonyítékmátrixban | 396/396 | Minden ID-hoz van legalább egy mátrixsor nyitott acceptance-szel vagy kódbizonyítékkal. |
| 26.1 szerinti önálló, teljes kártya az ellenőrzés időpontjában | 0/396 bizonyított | A későbbi 63.49–63.50 már tartalmaz részletes EDT-007 és EDT-008 kártyát; ez a sor korábbi pillanatkép, nem a jelenlegi teljeskártya-darabszám. |
| Státuszmezők ID-nként | NEM LEZÁRT | Status, Phase/priority, Permission, Dependencies, Tests, Negative tests, Live/user acceptance, Evidence, Known issues és Next action nem szerepel egységes, strukturált mezőként minden ID-nál. |
| Funkciószerződés mezői ID-nként | NEM LEZÁRT | Felhasználói eredmény, belépési pont, műveletek, domain owner, adatforrás/séma, API/command, UI-állapotok, security/privacy, teszt, E2E acceptance, evidence, rollback és next action kitöltése hátra van. |

**Következtetés:** a korábbi „396/396 lefedve” ID- és mátrix-/fázislefedettséget jelentett, nem 396 kész implementációs kártyát. Nem szabad üres sablonokat késznek jelölni: tényt kód-/tesztbizonyítékkal, hiányzó adatot explicit UNVERIFIED / OPEN / DECISION REQUIRED jelzéssel kell vezetni. A **termékscope lezárása** és az **adott funkció aktiválásához szükséges teljes kártya** külön kapu a 63.21 szerint. A jelenlegi aktív ellenőrzés nem egy évekig tartó, előzetes 396-kártyás adminisztrációs követelmény; a meglévő EDT-kártya-szeletek a B kapu felhasználható alapjai.

### 63.41. Funkciókártya-pilot — EDT-001–006

Az alábbi rövidített kártyák mindegyike név szerint lefedi a 26.1 kötelező mezőit. A „részleges alap” nem PASS. A forrásfájlok vizsgálata megtörtént, de ebben a dokumentációs lépésben tesztet és runtime-ot nem futtattam.

#### EDT-001 — Verziózott Page Model / document schema
- **Felhasználói eredmény:** az oldal stabil, verziózott modellben szerkeszthető és újratölthető.
- **Belépési pont / műveletek:** Editor v2 document lifecycle; létrehozás, validálás, mentés és reload.
- **Kanonikus owner / adatforrás:** EDITOR / public/editor-v2/core/schema.js, src/core/page-model.ts és canonical page/revision API; a teljes API→schema round-trip nyitott.
- **Séma / invariánsok:** sanci-page-document, schemaVersion=1, page/node ID, root, parent/children; schema migration és backward compatibility nyitott.
- **Jogosultság:** authenticated page API + site ownership; cross-site negatív teszt szükséges.
- **API/command:** Page Model + canonical command/state; request/response és DB mapping nincs teljesen lezárva.
- **Függőségek:** SITE/IDENTITY/SEC, EDT-002/003/027–032, WEB-004–008.
- **UI-állapotok:** loading/new/valid-invalid/saving/conflict/error/reload; teljes acceptance nyitott.
- **Biztonság/adatvédelem:** schema allowlist, malformed/oversized document rejection, site scope; méretlimit nyitott.
- **Tesztcsomag:** public/editor-v2/tests/core.test.js és page-model kapcsolódó tesztek; migration/API round-trip nem bizonyított.
- **Elfogadás:** valid dokumentum módosítása → save → reload → azonos modell; unsupported schema/invalid root elutasítása adatvesztés nélkül.
- **Bizonyíték:** schema.js, page-model.ts, core.test.js; CI/run link nincs rögzítve.
- **Visszaállítás:** revision restore/snapshot alap létezik; schema migration rollback nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; persistence round-trip és schema compatibility bizonyítása szükséges.

#### EDT-002 — Page Model hierarchia és szerkezeti invariánsok
- **Felhasználói eredmény:** a canvas/layer tree csak érvényes node-hierarchiát hoz létre.
- **Belépési pont / műveletek:** Editor v2 schema/validation/commands; add, move, group/ungroup, duplicate, delete.
- **Kanonikus owner / adatforrás:** EDITOR / public/editor-v2/core/schema.js, validation.js, commands.js; rootId/nodes/parentId/children.
- **Séma / invariánsok:** egy root; root parent nélkül; minden más node-nak parent; child-parent egyezés; nincs cycle/orphan/hiányzó child; container type rule.
- **Jogosultság:** a domain invariant nem helyettesíti a szerveroldali auth/site ownershipet.
- **API/command:** validateHierarchy, assertValidEditorDocument, canContain és canonical commands; minden server save/publish útvonalon való lefedettség nyitott.
- **Függőségek:** EDT-001/003/004/008/011–013/016/028–034.
- **UI-állapotok:** invalid drop/reparent/group, locked node, empty container, validation error.
- **Biztonság/adatvédelem:** malformed nested data, cycle és túl mély hierarchia; resource-limit és server parity nyitott.
- **Tesztcsomag:** public/editor-v2/tests/core.test.js; teljes negatív mátrix nem bizonyított.
- **Elfogadás:** nested műveletek → save/reload → invariánsok megmaradnak; cycle/orphan/invalid parent esetén rollback és olvasható hiba.
- **Bizonyíték:** schema.js, validation.js, commands.js, core.test.js; külön CI/runtime evidence nincs rögzítve.
- **Visszaállítás:** command snapshot/undo/atomic transaction alap; minden UI failure rollback nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; negatív invariáns- és API-boundary tesztek szükségesek.

#### EDT-003 — Canonical command-only mutation
- **Felhasználói eredmény:** minden módosítás validált, követhető és visszavonható úton történik.
- **Belépési pont / műveletek:** Editor v2 UI → public/editor-v2/core/commands.js; add/update/delete/duplicate/reparent/reorder/lock.
- **Kanonikus owner / adatforrás:** EDITOR / canonical state + Page Model; nincs második UI dokumentummodell.
- **Séma / invariánsok:** command payload validation, minden mutáció commandon át, document validation/history/dirty consistency.
- **Jogosultság:** a command engine nem auth boundary; backend save/publish saját scope gate-et igényel.
- **API/command:** execute(state, action), commands registry; az összes UI write-path lefedettsége nyitott.
- **Függőségek:** EDT-001/002/004–006/027–031.
- **UI-állapotok:** invalid action, locked/unsupported target, batch failure, dirty/saved/error és undo/redo.
- **Biztonság/adatvédelem:** nincs direct mutation validation/history megkerülésével; tiltott ID/parent/children patch elutasítandó.
- **Tesztcsomag:** core.test.js; teljes UI handler→command coverage nyitott.
- **Elfogadás:** UI-módosítás → command → valid modell → undo → redo → save/reload egyezés.
- **Bizonyíték:** commands.js commit/execute és assertValidEditorDocument; minden handler runtime lefedettsége nincs rögzítve.
- **Visszaállítás:** undo/redo és snapshot; command failure state-egyezés tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; direct mutation keresés és teljes UI coverage.

#### EDT-004 — Atomic batch és history transaction
- **Felhasználói eredmény:** összetett szerkesztés egy visszavonható egység, hibánál meghatározott rollbackkel.
- **Belépési pont / műveletek:** Editor v2 composite actions; executeBatch, beginTransaction, commitTransaction, rollbackTransaction.
- **Kanonikus owner / adatforrás:** EDITOR / state.history és Page Model snapshot.
- **Séma / invariánsok:** explicit atomic/non-atomic policy; nested transaction tiltása; atomic failure visszaállítja document/selection/history/persistence state-et.
- **Jogosultság:** lokális tranzakció nem jogosultsági boundary; backend write külön auth/version gate.
- **API/command:** executeBatch(actions,{label,atomic}) és transaction API; minden összetett UI action policy-ja nyitott.
- **Függőségek:** EDT-001–003/005–006/011/038.
- **UI-állapotok:** progress/success/rolled-back/error; nagy batch és megszakítás tesztelendő.
- **Biztonság/adatvédelem:** atomic hiba után nincs észrevétlen részállapot; batch resource limit nyitott.
- **Tesztcsomag:** core.test.js atomic/non-atomic transaction tesztekkel; composite UI workflow coverage nyitott.
- **Elfogadás:** több parancs egy history entry; középső hiba atomic módban teljes rollbacket ad.
- **Bizonyíték:** commands.js executeBatch/transaction implementáció; CI/UI evidence nincs rögzítve.
- **Visszaállítás:** rollbackTransaction és atomic snapshot; interruption/nested edge case nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; minden composite UI művelet policy-ja tesztelendő.

#### EDT-005 — Undo/redo history
- **Felhasználói eredmény:** szerkesztési művelet visszavonható és újraalkalmazható.
- **Belépési pont / műveletek:** Editor v2 history controls/keyboard shortcuts; history.undo/history.redo.
- **Kanonikus owner / adatforrás:** EDITOR / state.history, Page Model snapshot és selection snapshot.
- **Séma / invariánsok:** before/after document + selection; history limit jelenleg 100; új mutation üríti a redo ágat; undo/redo dirty state-et állít.
- **Jogosultság:** lokális history nem helyettesíti a backend save/publish authorizationt vagy revision concurrencyt.
- **API/command:** history.undo/history.redo; toolbar/keyboard paritás nyitott.
- **Függőségek:** EDT-001–004/006/027–031.
- **UI-állapotok:** empty history, undo/redo, unsaved changes, conflict, save/reload history policy.
- **Biztonság/adatvédelem:** history nem keveredhet más page/site adataival; memória/érzékeny snapshot policy nyitott.
- **Tesztcsomag:** core.test.js history/selection round-trip alap; limit/nagy dokumentum/failure/UI coverage nyitott.
- **Elfogadás:** edit→undo→eredeti modell+selection→redo→módosított modell; új mutation törli a redo ágat.
- **Bizonyíték:** state.js, commands.js, core.test.js; CI/run link nincs rögzítve.
- **Visszaállítás:** local undo/redo; szerveroldali rollback külön revision restore.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; UI/keyboard parity, memory limit és save/reload policy.

#### EDT-006 — Selection state és fókuszszinkron
- **Felhasználói eredmény:** canvas, layer tree és Inspector ugyanazt a node-ot vagy node-halmazt mutatja.
- **Belépési pont / műveletek:** canvas pointer/touch, layer tree, Inspector, keyboard; set/clear/multi-select/delete recovery.
- **Kanonikus owner / adatforrás:** EDITOR / state.selection (ids, primaryId), selectedNodes(); UI csak ezt fogyasztja.
- **Séma / invariánsok:** selected ID aktív Page Model node-ra mutat; primaryId a selection része; delete/undo/redo után nincs stale selection.
- **Jogosultság:** selection UI-state, nem authorization; page/site permission a backendnél marad.
- **API/command:** selection.set/clear, setSelection/clearSelection; minden UI event routing ugyanazt a state-et használja.
- **Függőségek:** EDT-001–005/008/012–014/035–038.
- **UI-állapotok:** none/single/multiple, stale node, keyboard focus, mobile action bar, panel switch, Escape.
- **Biztonság/adatvédelem:** csak aktuális Page Model node választható; UI selection nem jogosít hozzáférésre.
- **Tesztcsomag:** core.test.js selection/history restore alap; canvas/layer/Inspector/touch/keyboard E2E nincs bizonyítva.
- **Elfogadás:** canvas selection → layer/Inspector egyezés → delete/undo helyes recovery → Escape/blank canvas clear.
- **Bizonyíték:** state.js, commands.js, app.js, core.test.js; browser/device E2E evidence nincs rögzítve.
- **Visszaállítás:** history selection snapshot; törölt node-ra mutató selection és panel state recovery tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; teljes canvas↔layer↔Inspector, keyboard/touch E2E.

**Pilot-kapu:** a hat kártya mezőlefedettségét statikusan ellenőriztem; a 63.42 az EDT-007–014 következő szeletét rögzíti. Ez nem jelenti az EDT modul vagy a teljes terv PASS állapotát.

### 63.42. Funkciókártyák — EDT-007–014 (canvas, drag/resize, hierarchy, layers, selection, lock)

**Forrásalap:** public/editor-v2/app.js, core/canvas-engine.js, core/canvas-extent.js, core/commands.js, core/state.js és tests/core.test.js. A forrásban lévő logika és unit teszt nem bizonyítja a teljes browser/device acceptance-t. Minden kártya a 26.1 kötelező mezőit tartalmazza.

#### EDT-007 — Canvas viewport, zoom, pan és content extent
- **Felhasználói eredmény:** az oldal nagyítása, mozgatása és teljes tartalmának áttekintése kényelmesen használható.
- **Belépési pont / műveletek:** Editor canvas viewport; zoom/pan/fit és content extent frissítés.
- **Kanonikus owner / adatforrás:** EDITOR / viewport state, app.js és core/canvas-extent.js; dokumentumtartalom a Page Modelből jön.
- **Séma / invariánsok:** pozitív, véges zoom; canvas extent a tartalom alsó határát és paddinget figyelembe veszi.
- **Jogosultság:** csak authenticated Editor/page context; viewport nem ad hozzáférést más oldalhoz.
- **API/command:** lokális viewport state és computeCanvasMinHeight; fit/pan/zoom teljes interaction contract nyitott.
- **Függőségek:** EDT-001/006/025/035–036.
- **UI-állapotok:** initial viewport, zoomed, panning, empty/tall page, viewport resize, mobile safe-area.
- **Biztonság/adatvédelem:** nincs külön domain adat; extrém zoom/extent és túl nagy dokumentum resource limitje nyitott.
- **Tesztcsomag:** core.test.js canvas extent tesztet tartalmaz; browser zoom/pan/resize és touch acceptance nincs bizonyítva.
- **Elfogadás:** rövid és hosszú oldalon zoom/pan/fit → viewport resize → tartalom nem válik elérhetetlenné, a canvas és selection helyes marad.
- **Bizonyíték:** app.js, canvas-extent.js, canvas-engine.js, core.test.js; CI/browser run nincs ehhez a kártyához rögzítve.
- **Visszaállítás:** viewport reset/fit; viewport state mentésének policy-ja nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; keyboard, touch és valódi mobil viewport teszt.

#### EDT-008 — Canvas drag/drop mozgatás
- **Felhasználói eredmény:** az elem közvetlenül a canvasról pozicionálható.
- **Belépési pont / műveletek:** canvas pointer handlers; select tool, drag, pointer capture és position command.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model node style + command engine.
- **Séma / invariánsok:** root és locked node nem mozgatható; koordináták a zoomhoz igazodnak; csak érvényes node/parent szerkezet menthető.
- **Jogosultság:** backend page/site ownership változatlanul kötelező.
- **API/command:** UI drag state → canonical update command; a teljes drag minden útvonalon command-only-e, auditálandó.
- **Függőségek:** EDT-001–007/009/013/014/023–026/028.
- **UI-állapotok:** idle/dragging/cancelled/locked/invalid target/saving/conflict.
- **Biztonság/adatvédelem:** malformed coordinates, pointer cancellation és invalid target nem okozhat sérült modellt.
- **Tesztcsomag:** core.test.js reparent/reorder teszteket tartalmaz; pointer drag E2E, touch cancel és save round-trip nem bizonyított.
- **Elfogadás:** elem mozgatása különböző zoomnál → pointer cancel és locked elem ellenőrzése → save/reload → ugyanaz a helyzet és modell.
- **Bizonyíték:** app.js canvas drag handlers, canvas-engine.js, commands.js; browser/device run nincs rögzítve.
- **Visszaállítás:** history undo/redo; félbeszakadt drag nem hagyhat részleges mutationt.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; drag/pointer/touch és keyboard alternatíva acceptance.

#### EDT-009 — Geometry és resize
- **Felhasználói eredmény:** az elem mérete és pozíciója kiszámíthatóan módosítható.
- **Belépési pont / műveletek:** canvas resize handles és Inspector geometry controls.
- **Kanonikus owner / adatforrás:** EDITOR / node style, responsive resolver és command engine.
- **Séma / invariánsok:** véges X/Y/width/height; pozitív méret; aspect ratio és min/max constraint kezelése még nem teljesen bizonyított.
- **Jogosultság:** page/site ownership a mentési API-ban.
- **API/command:** geometry update a canonical commandon keresztül; minden resize handler command coverage nyitott.
- **Függőségek:** EDT-001/003/007–008/021–026/034.
- **UI-állapotok:** resize start/move/end/cancel, invalid value, responsive override, save conflict.
- **Biztonság/adatvédelem:** extrém vagy NaN/Infinity méretet el kell utasítani; overflow/resource-limit acceptance nyitott.
- **Tesztcsomag:** geometry UI tesztje nem bizonyított; schema/command tesztek csak részleges alapot adnak.
- **Elfogadás:** resize több viewporton → min/max és aspect ratio szabály → undo/redo → save/reload → public renderer parity.
- **Bizonyíték:** app.js, canvas-engine.js, responsive.js, commands.js; külön E2E evidence nincs rögzítve.
- **Visszaállítás:** history snapshot és undo; invalid resize atomic rejection tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; min/max schema, keyboard resize és renderer parity.

#### EDT-010 — Alignment guides, snap és grid
- **Felhasználói eredmény:** az elemek egymáshoz és a layout-rácshoz pontosan igazíthatók.
- **Belépési pont / műveletek:** canvas drag/geometry interaction; grid toggle, snap és alignment guide.
- **Kanonikus owner / adatforrás:** EDITOR / canvas interaction state; a teljes snap/grid funkció a vizsgált forrásban nem bizonyított.
- **Séma / invariánsok:** snap threshold, grid spacing, zoomtól független viselkedés és guide priority explicit szabályt igényel.
- **Jogosultság:** Editor/page permission.
- **API/command:** viewport/editor preference + geometry command; a preference persistence és parancsszerződés nyitott.
- **Függőségek:** EDT-007–009/021–025/044.
- **UI-állapotok:** snap on/off, guide visible/hidden, grid on/off, keyboard alternative.
- **Biztonság/adatvédelem:** nincs külön domain adat; nagy node számnál teljesítménybudget szükséges.
- **Tesztcsomag:** dedikált snap/grid acceptance nem található a vizsgált core tesztben.
- **Elfogadás:** snap/grid kapcsolás → drag/resize több zoomnál → guide helyesség → billentyűzetes alternatíva → save/reload.
- **Bizonyíték:** jelenleg csak a canvas geometry alap; teljes implementációs bizonyíték hiányzik.
- **Visszaállítás:** geometry undo/redo; grid preference reset.
- **Státusz / ismert probléma / következő lépés:** OPEN / UNVERIFIED; pontos UX/spec és implementációs döntés szükséges.

#### EDT-011 — Hierarchy operations: duplicate, delete, reorder, reparent
- **Felhasználói eredmény:** az elemek és teljes al-fáik biztonságosan átrendezhetők, másolhatók és törölhetők.
- **Belépési pont / műveletek:** layer tree/canvas context actions; duplicate, delete, reorder, reparent.
- **Kanonikus owner / adatforrás:** EDITOR / commands.js Page Model node tree.
- **Séma / invariánsok:** duplicate minden subtree ID-t újraoszt; root nem törölhető/reparentelhető; cycle és invalid container tiltott.
- **Jogosultság:** UI command nem jogosít backend adatokra; page/site scope mentéskor kötelező.
- **API/command:** element.duplicate/delete, hierarchy.reorder/reparent; UI action coverage és destructive confirmation nyitott.
- **Függőségek:** EDT-001–006/008/012–014/028–031.
- **UI-állapotok:** valid/invalid target, locked/root, delete confirm, undo/redo, save conflict.
- **Biztonság/adatvédelem:** subtree törlés, hivatkozott assetek és invalid nested model; usage map és safe delete külön nyitott.
- **Tesztcsomag:** core.test.js reparent/reorder/duplicate teszteket tartalmaz; UI confirmation és full subtree edge matrix nincs bizonyítva.
- **Elfogadás:** subtree duplicate új ID-kkel → reorder/reparent → delete → undo/redo → save/reload és invariáns ellenőrzés.
- **Bizonyíték:** commands.js és core.test.js; browser/E2E evidence nincs rögzítve.
- **Visszaállítás:** undo/redo snapshot; törlés utáni external asset cleanup nem történhet ellenőrizetlenül.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; UI coverage, confirm, lock/cycle/asset-reference edge cases.

#### EDT-012 — Layer tree és hierarchianavigáció
- **Felhasználói eredmény:** a felhasználó áttekintheti a nested elemeket és kiválaszthatja a megfelelő réteget.
- **Belépési pont / műveletek:** Editor v2 layer panel; expand/collapse, select, reorder és reparent.
- **Kanonikus owner / adatforrás:** EDITOR / Page Model tree + canonical selection state.
- **Séma / invariánsok:** a layer tree a nodes/children szerkezet vetülete; nem tarthat saját, eltérő hierarchiát.
- **Jogosultság:** az aktív page/site scope-on belüli node-ok.
- **API/command:** selection.set és hierarchy commands; expand/collapse preference per-user persistence nyitott.
- **Függőségek:** EDT-001–006/011/013/014/035–036/044.
- **UI-állapotok:** empty/deep tree, expanded/collapsed, selected/locked, mobile panel switch.
- **Biztonság/adatvédelem:** mély/nagy hierarchia teljesítmény- és keyboard-accessibility korlátai nyitottak.
- **Tesztcsomag:** külön layer-tree browser acceptance nem bizonyított; core hierarchia teszt nem igazolja a panel UX-et.
- **Elfogadás:** nested tree → canvas selection sync → reorder/reparent → collapse/reopen → undo/reload és tree consistency.
- **Bizonyíték:** app.js layer rendering/commands; külön E2E run nincs rögzítve.
- **Visszaállítás:** document history; tree expand state reset/persistence policy nyitott.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; deep hierarchy, keyboard/touch és expand-state acceptance.

#### EDT-013 — Canvas, layers és Inspector selection sync
- **Felhasználói eredmény:** minden szerkesztői felület ugyanazt a kiválasztott elemet vagy csoportot kezeli.
- **Belépési pont / műveletek:** canvas selection, layer tree, Inspector, keyboard/multi-select.
- **Kanonikus owner / adatforrás:** EDITOR / state.selection ids + primaryId; selectedNodes() vetület.
- **Séma / invariánsok:** primary selection a kijelölt ID-k közé tartozik; törölt node nem marad kijelölve; aktív page váltáskor nincs cross-page stale ID.
- **Jogosultság:** selection nem authorization; a backend page/site scope változatlan.
- **API/command:** selection.set/clear és setSelection; minden event path közös state-et használjon.
- **Függőségek:** EDT-001/006/008/012/014/035–038.
- **UI-állapotok:** none/single/multiple, stale selection, keyboard focus, mobile multi-select, panel switch.
- **Biztonság/adatvédelem:** csak az aktív Page Model node-jai; cross-page selection tiltása.
- **Tesztcsomag:** core.test.js state/history selection alap; panel/canvas/touch/keyboard E2E nincs bizonyítva.
- **Elfogadás:** canvas → layer → Inspector ugyanazt jelzi; delete/undo, page switch és Escape után state konzisztens.
- **Bizonyíték:** state.js, app.js, commands.js, core.test.js; device/browser run nincs rögzítve.
- **Visszaállítás:** selection snapshot az undo/redo historyban; stale ID-k tisztítása tesztelendő.
- **Státusz / ismert probléma / következő lépés:** IN PROGRESS / UNVERIFIED; teljes selection/focus E2E.

#### EDT-014 — Lock/unlock és layer visibility
- **Felhasználói eredmény:** egy réteg szerkesztése letiltható, illetve szükség esetén elrejthető.
- **Belépési pont / műveletek:** Inspector lock checkbox és layer controls; lock/unlock, hide/show.
- **Kanonikus owner / adatforrás:** EDITOR / `node.locked` és Page Model visibility property. Inspector és Rétegek toggle ugyanazt az `element.visibility.set` commandot és canonical Page Model property-t használja; nincs külön UI állapot.
- **Séma / invariánsok:** locked node drag/update/reparent/group/ungroup szabálya explicit; visibility állapotnak a preview és public renderer felé is konzisztensnek kell lennie.
- **Jogosultság:** lock csak szerkesztési UX-szabály, nem hozzáférés-védelem.
- **API/command:** `element.lock.set` és `element.visibility.set` létezik. A Rétegek toggle a Canvas aktuális desktop/tablet/mobile device-ára állít; a publikus renderer ugyanazt a published Page Model visibility állapotot fogyasztja.
- **Függőségek:** EDT-001–003/008/011–013/021–026/034.
- **UI-állapotok:** locked/unlocked, hidden/visible, eszközönkénti Inspector/Rétegek állapot, akadálymentes `aria-pressed` visibility action, disabled action, group/root edge case.
- **Biztonság/adatvédelem:** locked állapot nem helyettesítheti a backend permissiont; rejtett tartalom public output policy-ja külön rögzítendő.
- **Rögzített részhiba (2026-10-29):** a palette insertion resolver nem vette figyelembe a kijelölt szülő `locked` állapotát, és az `element.add` command közvetlen hívása is tudott gyereket hozzáadni zárolt konténerhez. Ez UI-lock megkerülés volt, nem jogosultsági határ.
- **Tesztcsomag:** `public/editor-v2/tests/element-insertion.test.js`; `public/editor-v2/tests/core.test.js`; `tests/browser/editor-element-insertion.test.js`; `tests/browser/editor-inspector-partial-types.test.js`; `tests/browser/editor-structural-parity.test.js`; `tests/browser/editor-schedule-visibility.test.js`.
- **Elfogadás:** palette-beszúrás nem mutálhat zárolt konténert; a kijelölt zárolt node után a legközelebbi feloldott szülőben, közvetlenül a zárolt subtree után kerüljön az új elem. `element.add`, törlés, reparent mindkét irányban, reorder, duplicate célpont, group és ungroup nem módosíthatja zárolt szülő gyereklistáját; az elutasított command nem módosíthat Page Modelt vagy historyt. A parancsmátrix 4/4 és a Chrome regresszió 2/2 PASS; a parancsvédelem a 3727-es, a Rétegek UI affordance a 3728-as Workeren éles.
- **Visibility bizonyíték:** `docs/evidence/editor-layer-visibility-2026-10-29.json` rögzíti a korábbi 44 PARTIAL-típusú Inspector Chromium lifecycle-t, strukturális és schedule renderer regressziókat, valamint az új Rétegek toggler tesztet. Az eszközönkénti állapot, Canvas preview, draft Save, külön Publish és publikus render parity igazolt. A `1c60101a` runtime change pontos Cloudflare builddel Worker **3729**-re került, **100%** forgalommal; `/api/health`, `/editor-v2/` és az `app.js`/`editor.css` SHA-256 egyezése HTTP-smoke-kal ellenőrzött. D1 migráció/írás és R2 változás nem történt.
- **Visszaállítás:** lock/visibility command undo/redo; hidden state publish/rollback policy nyitott.
- **Státusz / ismert probléma / következő lépés:** a palette, hierarchy parancsréteg, lock disabled/drag affordance és a Rétegek visibility quick toggle a Worker **3729**-en éles. Az Inspector hide/show és renderer visibility parity Chromium és production asset hash ellenőrzéssel igazolt. A lock Inspector roundtrip is böngészőtesztelt: feloldás visszaállítja a drag affordance-t, újrazárolás letiltja. EDT-014 egésze továbbra IN PROGRESS / NOT CERTIFIED: összes lock/ancestor edge case, desktop/touch reparent acceptance és fizikai eszközteszt nyitott.

**Szeletzárás:** EDT-007–014 mindegyikéhez kitöltöttem a kártyamezőket, de a forráskód-olvasás nem helyettesíti a böngészős acceptance-t. Következő lépés: a 63.42 kártyák mező- és függőségkonzisztenciájának gépi ellenőrzése; csak ezután jöhet EDT-015–020.

