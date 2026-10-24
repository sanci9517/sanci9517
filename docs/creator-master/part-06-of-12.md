### 63.50.39. 54.1 Admin alapélmény: nyolc checklist-tétel elsődleges és fogyasztói megfeleltetése (2026-10-14)

**Módszer:** az 54.1 nyolc eredeti checkboxát változatlanul megtartva, soronként a 24. fejezet tényleges definícióihoz rendeltük. A 49.N a felhasználói főmodul, a felsorolt ID-k a kanonikus képességek; a másodlagos belépési pont nem válik új adatgazdává. **Ez tervszintű szemantikai routing, nem implementációs vagy runtime PASS.**

| 54.1 tétel | Kanonikus ID és szerep | Elsődleges 49. modul | Kötelező pozitív / negatív elfogadási határ |
| --- | --- | --- | --- |
| #1 Egységes Admin shell, oldalsáv, almenük, breadcrumbs, mobil navigáció | ADM-001, ADM-010, ADM-009 | 49.1 Admin | A navigáció mobilon és jogosultsághoz igazítva működik; elrejtett menüpont nem jelent szerveroldali hozzáférést |
| #2 Áttekintő kártyák: weboldal, live, adásrend, kapcsolatok, tartalom, feladatok | ADM-002, ADM-013; forrásadat a WEB/LIV/SCH/INT/CNT domainekből | 49.1 Admin (read-only aggregátor) | A kártya az eredeti domain állapotára navigál; hiányzó provider/adat nem jelenik meg sikeres élő állapotként |
| #3 Gyorsműveletek és legutóbbi aktivitás | ADM-003, ADM-005, SEARCH-002 | 49.1 Admin; keresési/command routing 49.16 | A gyorsművelet canonical route/command felé mutat; audit eseményt nem ír saját Dashboard-tárolóba |
| #4 Teendők, figyelmeztetések, hibák és elakadt folyamatok | ADM-004, OPS-003, ADM-013 | 49.1 Admin; forrásfolyamatok saját modulban | A felhasználó a tényleges hiba forrásához jut; a Dashboard nem hoz létre párhuzamos feladat-/értesítés-életciklust |
| #5 Globális kereső, command palette, kedvencek, legutóbbi elemek | ADM-006 (belépési pont), SEARCH-001, SEARCH-002, SEARCH-003, SEARCH-004 | 49.16 Search; 49.1 Admin fogyasztó | Jogosultság- és site-szűrt találatok; törölt vagy visszavont jogosultságú elem nem maradhat látható |
| #6 Kontextuális súgó, onboarding, üres állapotok és emberi nyelvű hibák | ADM-011 (belépési pont), HELP-001, HELP-002, HELP-004, ADM-008 | 49.18 Help; 49.1 Admin megjelenítés | A súgó kontextushoz és szerephez illeszkedik; hibaüzenet nem szivárogtat titkot/nyers belső diagnosztikát |
| #7 Értesítési központ, prioritások, digest és csendes időszak | ADM-012 (belépési pont), NTF-001, NTF-003, NTF-004 | 49.17 Notifications; 49.1 Admin fogyasztó | A csendes időszak/preferencia érvényesül; deduplikált esemény nem eredményez duplikált értesítést |
| #8 Valós adatfrissesség, loading/empty/error/stale/partial állapot | ADM-013, ADM-008, SEARCH-004; domain-saját frissességi szerződések | 49.1 Admin, keresésnél 49.16 | Stale/partial adat külön jelzett; sikertelen frissítés nem mutatható friss vagy sikeres állapotként |

**Tételes haladás:** 54.1 **8/8** sorhoz van explicit meglévő ID, modul és pozitív/negatív szerződéshatár; a teljes 54. fejezetből **8/156 első körben feltérképezett**, **148/156 még nem tételesen feldolgozott**. A fázis, az 5./63.20 domain tulajdonosok tételes ellenőrzése és a tényleges implementációs bizonyíték külön nyitott; ezért a 8 sor sem teljes, minden mezőre kiterjedő audit-PASS. Az 54.2–54.16 további feldolgozása ugyanebben a MASTER-ben történik.

### 63.50.40. Kötelező frissállapot-feloldás és beszélgetések közötti folytatási protokoll (2026-10-14)

**Egyetlen kanonikus munkaforrás:** a `sanci9517/sanci9517` repository `v2/foundation` ágán a `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`. Régi MASTER, csevegés, memória, archivált checkpoint, korábbi commit és munkaközi összefoglaló **nem írhatja felül** az aktuális ág HEAD-jén található dokumentumot.

**Minden új beszélgetés és minden új írás előtt kötelező:**
1. Lekérni a `v2/foundation` ág aktuális HEAD commitját, majd a kanonikus fájlt **kifejezetten ezen az ágon**; nem elegendő a korábbi beszélgetésből ismert SHA, fájlnév vagy állapot.
2. Kiolvasni a dokumentum elején az **aktív tervpontazonosítót és státuszt**, valamint a legutolsó, legmagasabb sorszámú **63.50.x** végrehajtási bejegyzést és a 63.54 történeti nyitott kapukat. A legutóbbi bejegyzés nem helyettesíti a fejlécet: eltérés esetén **STOP / CONSISTENCY CONFLICT**, nem visszaugrás.
3. Ellenőrizni, hogy a tervezett új munka **nincs-e már végrehajtva** a HEAD-ben; csak ténylegesen hiányzó részre dolgozni. A korábbi bejegyzés tévesen „következő”-nek nevezett pontja nem élvez elsőbbséget a frissebb bizonyítékkal szemben.
4. Íráskor a teljes fájl aktuális blob SHA-ját használni, ütközés esetén frissen olvasni és újraegyeztetni; **tilos régi fájlverzióval felülírni a későbbi módosításokat**.
5. Minden sikeres audit-commit után a fejléc folytatási állapotát és a legutolsó bejegyzést egyeztetni; a következő munka **egyértelmű azonosítóval**, a még nyitott részhalmazzal és a PASS/NOT PASS határral legyen megadva. A commit SHA csak a GitHub által visszaadott tényleges eredmény alapján közölhető.
6. Nem létező vagy nem visszanyert történeti forrást nem lehet rekonstruáltnak nevezni; a 396 ID, 22 modul, 156 review és 271 történeti H-ID számlálása nem runtime teszt. A fejlesztési fagyasztás az aktív kapu PASS-áig változatlan.

**Jelenlegi folytatási kurzor:** `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY / 63.50.75 ARCHIVE SOURCE FIELD EXTRACTION / NEXT ITEM GAP CLASSIFICATION`. A 54.1–54.4 további domain/fázis/bizonyíték-kiegészítése külön nyitott; 54.7–54.16 következik, nem a már lezárt 63.50.38 újraírása. **Globális kapu: IN PROGRESS / NOT PASS.**

### 63.50.41. 54.2 Saját weboldal és Visual Editor: 15 checklist-tétel első körös routingja (2026-10-14)

**Forrás:** az 54.2 mind a 15 eredeti sora és a 24. fejezet aktuális definíciói. A főmodul a 49. fejezet szerint értendő; a másodlagos domain-fogyasztók nem kapnak új CRUD-ot. A pozitív/negatív határok a későbbi acceptance-tesztek kiindulópontjai, **nem teszteredmények**.

| 54.2 tétel | Meglévő capability ID(k) | Modul / owner-határ | Pozitív és negatív acceptance / nyitott rés |
| --- | --- | --- | --- |
| #1 Oldal CRUD, hierarchia, slug, duplikálás, archív/törlés | WEB-001, WEB-002, WEB-003 | 49.2 | A draft/published slug külön kezelendő; archiválás nem szakíthat el hivatkozást figyelmeztetés nélkül |
| #2 Navigáció, nested menü, footer, mobilmenü, linkek | WEB-009, WEB-010, WEB-011, EDT-017 | 49.2 | Kanonikus navigáció és linkfeloldás; hibás/belső jogosulatlan link nem kerülhet csendben élesbe |
| #3 Egyetlen Visual Editor: könyvtár, canvas, Layers, Inspector | EDT-015, EDT-007, EDT-012, EDT-013, EDT-021 | 49.2 | Egy Page Model és command pipeline; az Inspector nem duplikál üzleti domain CRUD-ot |
| #4 Drag/drop, kijelölés, átrendezés, csoport, duplicate, törlés, zoom/pan | EDT-006, EDT-007, EDT-008, EDT-011, EDT-016 | 49.2 | Minden művelet érvényes node-fát hagy; tiltott reparent/ciklus nem menthető |
| #5 Undo/redo, mentés, konfliktus, revision history, restore | EDT-005, EDT-027, EDT-028, EDT-029, EDT-030, EDT-031, WEB-008, WEB-007 | 49.2 | Konfliktus és hálózati hiba nem írhat felül csendben módosítást; restore nem implicit publish |
| #6 Alapelemek: text, média, link, form, layout | EDT-016, EDT-017, EDT-018, EDT-019, EDT-043 | 49.2 | Biztonságos render és validált schema; a rich text EDT-043 későbbi fázis, nem 1.0 készültség |
| #7 Dinamikus SANCI blokkok és kapcsolódó domainek | EDT-020, DYN-001, DYN-002, DYN-007, WEB-031 | 49.2 (Editor fogyasztó), domain-adatgazdák saját modulban | Live/schedule/content/commerce adat canonical forrásból; publikus nézetben privát vagy draft rekord nem szivároghat |
| #8 Desktop/tablet/mobile, override, inheritance, orientáció | EDT-023, EDT-024, EDT-025, EDT-026, DSN-006 | 49.2; design token owner 49.3 | Breakpoint-váltás nem törli a másik viewport értékét; orientation viselkedés külön igazolandó |
| #9 Globális design tokenek | DSN-001, DSN-002, DSN-003, DSN-006, DSN-007 | 49.3 Brand/Design; 49.2 fogyasztó | Globális módosítás diff/usage hatással követhető; oldal override nem íródik felül rejtetten |
| #10 Site/page/section/component sablon, instance/override/detach | DSN-008, DSN-009, DSN-010, DSN-011, DSN-012, DSN-013, DSN-014 | 49.3; 49.2 felhasználó | Master/instance kapcsolatok és verziók stabilak; detach nem módosítja visszamenőleg a mastert |
| #11 Preview, draft, validálás, publish/unpublish, snapshot | WEB-004, WEB-005, WEB-006, WEB-007, EDT-032, EDT-033, EDT-034 | 49.2 | Draft mentése nem implicit publish; hibás draft nem írhatja felül az éles snapshotot |
| #12 SEO metadata, canonical, OG, sitemap, redirects, 404 | SEO-001, SEO-002, SEO-003, SEO-004, SEO-005, WEB-012, WEB-013 | 49.2; SEO szakági owner | Unpublished/staging nem indexelhető; régi slug nem vezet redirect loophoz |
| #13 Domain/DNS/HTTPS, favicon, brand assets, maintenance | WEB-028, RES-001, DSN-001, OPS-001 | 49.2; asset 49.4, ops 49.19 | Domain/DNS/HTTPS kezelő capability és tulajdonos külön részletesen ellenőrzendő: a felsorolt ID-k önmagukban nem bizonyítják teljes lefedését |
| #14 Űrlap, validáció, spam, consent, submission kezelés | WEB-020, EDT-019, SEC-005, SEC-006 | 49.2 public form; submissions owner NYITOTT | A publikus form és beküldés admin-életciklusa nem összemosható; szerveroldali consent/spam/retention bizonyítás nyitott |
| #15 Web performance, image resize, lazy loading, cache, Core Web Vitals | WEB-030, RES-004, OPS-008 | 49.2; asset 49.4, ops 49.19 | Éles cache és asset variáns nem szivárogtathat draftot; mérés nélküli Core Web Vitals PASS tilos |

**Kiemelt hiányjelölés:** a #13 domain/DNS/HTTPS beállítások és a #14 beküldés-kezelési admin workflow nem tekinthető automatikusan lefedettnek a megadott közeli ID-k által. A megfelelő kanonikus owner és önálló képességigény szemantikai döntésre vár; azonosítót nem találunk ki és nem jelölünk implementáltnak.

**Állapot:** 54.2 **15/15 sor első körös ID/modul/acceptance routing**, ebből **2 kifejezetten részleges képességlefedettségi jelölt** (#13, #14); 54.1–54.2 összesen **23/156 első körben feldolgozott**, **133/156 még nem feldolgozott**. A teljes `54.x#N → 5.DOMAIN → F-phase → evidence` lánc, a történeti forrás és a runtime bizonyítás továbbra is nyitott. **PLAN gate: IN PROGRESS / NOT PASS.**

### 63.50.42. 54.3 Brand Kit és Design Studio: tételes első körös megfeleltetés (2026-10-14)

| Review-tétel | Kanonikus cél-ID(k) | Elsődleges owner és fogyasztó | Elfogadási határ / nyitott rés |
| --- | --- | --- | --- |
| 54.3#1 Logóvariánsok, színek, betűk, ikonstílus és vizuális szabályok | DSN-001, DSN-005, DSN-007, DSN-017 | 49.3 | Brand Kit asset és stílus tulajdonos szétválasztandó; logóvariáns-kezelés részletes contract OPEN |
| 54.3#2 Overlay/thumbnail/intro/outro/watermark/social/merch/email sablonok | DSN-008, DSN-009, DSN-010, DSN-011, DSN-015 | 49.3; 49.6/49.8/49.10 fogyasztók | A webes sablonkönyvtár önmagában nem bizonyítja az összes kreatív exportformátum és downstream sablont |
| 54.3#3 Brand-safe színek/fontok és kontraszt | DSN-001, DSN-007, QA-005 | 49.3 | Automatikus kontrasztellenőrzés és tiltott kombinációk negatív tesztje szükséges |
| 54.3#4 Globális/komponens token, theme, dark/light | DSN-001, DSN-002, DSN-005, DSN-012, DSN-013 | 49.3 | Token öröklés és override következetes; dark/light váltás nem veszíthet egyedi beállítást |
| 54.3#5 SVG/PNG/WebP és exportméretek | DSN-015, RES-004, RES-012 | 49.3; 49.4 asset pipeline | SVG sanitization és megfelelő méret/format export részletes lefedése OPEN |
| 54.3#6 Licenc/forrás/tulajdonos/verzió/asset-használat | RES-007, RES-008, DSN-014 | 49.4 asset owner; 49.3 design fogyasztó | Jogadat nem vész el template verzióváltáskor; usage warning nélkül nincs törlés |
| 54.3#7 Brand consistency, AI-javaslat, kézi jóváhagyás | DSN-003, AI-012, AI-007 | 49.3; AI 49.15 | AI javaslat nem írhat éles brandet jóváhagyás nélkül; automatikus consistency checker contract OPEN |

**Állapot:** 54.3 **7/7 első körös mapping**, a felsorolt részleges szerződések továbbra is OPEN. Nem runtime vagy teljes szemantikai PASS.

### 63.50.43. 54.4 Média- és erőforráskönyvtár: tételes első körös megfeleltetés (2026-10-14)

| Review-tétel | Kanonikus cél-ID(k) | Elsődleges owner és fogyasztó | Elfogadási határ / nyitott rés |
| --- | --- | --- | --- |
| 54.4#1 Egy asset registry/ID, R2 bináris, D1 meta | RES-001, RES-002 | 49.4 | Egy kanonikus asset ID; nincs második média-adattár |
| 54.4#2 Kép, videó, hang, ikon, font, dokumentum, thumbnail, export | RES-001, RES-011, RES-013, RES-004 | 49.4 | Típusonként validált metadata/preview; támogatás nem állítható pusztán általános registry alapján |
| 54.4#3 Single/bulk upload, progress/cancel/retry/resume | RES-003 | 49.4 | Megszakított upload nem hagy árván látszólag kész assetet; resumable/bulk contract OPEN |
| 54.4#4 MIME/méret, processing, preview, security | RES-003, RES-004, RES-012, SEC-006 | 49.4; security 49.19 | Rosszindulatú SVG és hamis MIME nem válhat publikus aktív assetté |
| 54.4#5 Tag, search, collection, alt, license, crop/focal | RES-005, RES-006, RES-007, RES-004 | 49.4 | Alt/license/usage nem veszhet el transzformáció után; focal point részletes acceptance OPEN |
| 54.4#6 Usage references, warning, archive/delete | RES-008, RES-009 | 49.4 | Használt asset nem törölhető csendben; rollback/restore és dependency ellenőrzendő |
| 54.4#7 Metadata módosítás minden hivatkozási helyen | RES-007, RES-008, DYN-006 | 49.4; fogyasztó domainnézetek | Stale cache nem mutathat tartósan régi metaadatot; publikált snapshot és változó metadata határ tisztázandó |

**Állapot:** 54.4 **7/7 első körös mapping**, a felsorolt részleges szerződések továbbra is OPEN. Nem runtime vagy teljes szemantikai PASS.

### 63.50.44. 54.5 Kapcsolatok és integrációk: checklist-szintű capability routing (2026-10-14)

| Tétel | Stabil ID-k | Elsődleges modul / fogyasztó | Pozitív-negatív határ és nyitott gap |
| --- | --- | --- | --- |
| 54.5#1 Integrációs központ Twitch/YouTube/TikTok/Discord/Kick | INT-001, INT-002, INT-010, INT-013, INT-014, INT-015, INT-016 | 49.7 | A provider megléte nem jelent teljes API capability-t; unsupported művelet nem jelenhet meg elérhetőként |
| 54.5#2 Connect/disconnect/reconnect, fiók/channel, scope/expiry | INT-007, INT-005, INT-006, INT-004 | 49.7 | Wrong-site account nem köthető; revoke után a UI nem mutathat aktív kapcsolatot |
| 54.5#3 Token refresh/revoke, secure storage, CSRF/state, site ownership | INT-003, INT-004, INT-005, INT-019, SEC-009 | 49.7; security 49.19 | OAuth callback állapot és site kötelező; token/secret nem szivároghat logba |
| 54.5#4 Capability/scope, quota, provider health, diagnostics | INT-018, INT-006, INT-009, INT-002, INT-020 | 49.7 | Hiányzó scope vagy quota esetén korlátozott/hibás állapotot kell jelezni |
| 54.5#5 Webhook signature, replay, dedup, retry, dead-letter | INT-017, SEC-009, INT-008 | 49.7; security 49.19 | Érvénytelen aláírás/replay nem dolgozható fel; dead-letter részletes implementációs contract OPEN |
| 54.5#6 Sync log, last success/failure, manual resync, conflict | INT-008, INT-020 | 49.7; domain sync owner | Sync sikertelen esetben nem jelenthet friss adatot; konfliktus feloldás nem írhat felül kézi döntést |
| 54.5#7 Későbbi email/calendar/payment/affiliate/CRM/cloud adapterek | INT-001, INT-021, INT-018 | 49.7; domain workflow owner saját modul | Adapter registry nem jelent provider capability-t; calendar/CRM/cloud részletes scope OPEN |
| 54.5#8 Unsupported capability jelölés, alternatív út | INT-018, INT-020, INT-006 | 49.7 | Nem támogatott API-funkció nem ajánlható működő automatizálásként |

**Státusz:** 8/8 első körös routing, nem domain/fázis/evidence vagy runtime PASS; a megjelölt GAP CANDIDATE nem automatikusan új ID.

### 63.50.45. 54.6 Live, Stream Studio és adásrend: checklist-szintű capability routing (2026-10-14)

| Tétel | Stabil ID-k | Elsődleges modul / fogyasztó | Pozitív-negatív határ és nyitott gap |
| --- | --- | --- | --- |
| 54.6#1 Live/offline státusz és frissesség platformonként | LIV-001, LIV-002, LIV-007 | 49.5; provider 49.7 | Stale provider adat nem állítható biztos live állapotnak |
| 54.6#2 Cím, kategória, játék, kezdés, nézőszám, metrikák | LIV-003, LIV-004 | 49.5 | Nem engedélyezett provider-metrika nem szimulálható |
| 54.6#3 Player/embed és offline fallback | LIV-005, WEB-015 | 49.5; public shell 49.2 | Tiltott embed/offline helyzet nem eredményez üres vagy hibás public oldalt |
| 54.6#4 Egy schedule-domain, recurrence, timezone, collision | SCH-001, SCH-003, SCH-004, SCH-006 | 49.5 | DST és ismétlődő esemény ütközés nem írhatja felül csendben a sorozatot |
| 54.6#5 Draft/scheduled/confirmed/postponed/cancelled/completed | SCH-005, SCH-001 | 49.5 | Állapotátmenet és confirmed/draft részletezettsége további acceptance OPEN |
| 54.6#6 Twitch/YouTube sync, priority, conflicts, history | SCH-007, SCH-008, INT-011, INT-013 | 49.5; 49.7 provider adapter | YouTube schedule write capability nem feltételezhető; manual override védendő |
| 54.6#7 Game profile, content link, public calendar, countdown, iCal | SCH-012, SCH-013, SCH-014, SCH-010, SCH-009, SCH-015 | 49.5; public fogyasztó 49.2 | Editor blokk nem tartalmaz második schedule CRUD-ot; iCal későbbi scope |
| 54.6#8 Prestream checklist, tech rehearsal, notes, markers, highlights | LIV-006, SCH-001 | 49.5 | Önálló checklist/marker workflow nincs igazolva e két általános ID-val: capability GAP CANDIDATE |
| 54.6#9 Multistream destinations, per-provider metadata | LIV-008, INT-018 | 49.5; provider 49.7 | Nem engedélyezett multistream destination nem állítható elérhetőnek |
| 54.6#10 Unified Chat, provider labels, moderation, send permission, partial failure | LIV-009 | 49.5; provider 49.7 | Read-only providerbe küldés tiltott; partial failure nem globális siker |
| 54.6#11 Recording/backup/replay technikai és költségkorláttal | LIV-010 | 49.5; operations 49.19 | Tényleges recording támogatás/retention nélkül nem mutatható késznek |

**Státusz:** 11/11 első körös routing, nem domain/fázis/evidence vagy runtime PASS; a megjelölt GAP CANDIDATE nem automatikusan új ID.

### 63.50.46. Forráskód-audit: ellenőrzött prioritás és végrehajtási zárolás (2026-10-14)

**Miért ez a következő döntési kapu:** a 63.50.20–63.50.33 már valódi forráskód-auditot tartalmaz; a 63.50.39–63.50.45 később hozzáadott 56 checklist-routing sora nem bizonyít kódjavítást és nem írhatja felül a korábban azonosított HIGH publikálási kockázatot. Ez a bejegyzés **nem új auditkezdés**, hanem az eddigi eredmények összeolvasása az aktuális HEAD-del.

**Frissen újraolvasott, tényleges források a `v2/foundation` ágon:** `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `migrations/0005_canonical_page_storage.sql`.

1. A `0005` migráció kifejezetten az **utolsó explicit publikált snapshotként** definiálja a `pages.published_content_json` mezőt. Az Editor POST csak `body.publish===true` mellett hívja a `validatePublishDocument` függvényt és módosítja a published snapshotot; a PUT rollback draft-only. **Szerződés: EXPLICIT PUBLISH.**
2. Az Admin Pages PATCH `contentChanged && existing.is_published` ágában viszont `UPDATE pages SET published_content_json=?,published_revision_id=?` fut a frissen módosított `contentJson` értékkel, **explicit publish és `validatePublishDocument` nélkül**. A PATCH egyszerre írja a közös `title/slug/description` oszlopokat is. **A forráskódbeli szerződésütközés az aktuális HEAD-ben továbbra is fennáll.**
3. A PATCH válasz `serialize(...)` része `published_revision_id` értékét szintén az új revízióra állítja publikált oldal esetén, így a kliens számára is publikálásként látszhat a metaadat-művelet. Az Editor explicit publish API-val azonos szemantika **nem bizonyított**.
4. A jelenlegi publikus URL-feloldás a közös `pages.slug` mezőt használja (lásd 63.50.22–63.50.33). A teljes megoldás ezért nem lehet kizárólag a fenti egy SQL-sor törlése: azzal a draft/published **metaadat és URL** még mindig összekeveredhetne. A meglévő `pages` / `editor_revisions` ownership és revision history megtartandó.

**Döntés / szigorú munkasorrend:**
- **A — tervkapu:** a történeti 00/A és 00.9.6.B forráshiány, a H19–H34 szemantikai megfelelés, a 54.7–54.16 első körös review és az összes 156 sor owner/domain/fázis/acceptance hiányának rendezése. A teljes PASS csak bizonyíték alapján.
- **B — fejlesztésindítás előtti biztonsági szerződés:** published metadata/slug/snapshot atomi modell, redirect/404/SEO határ, migráció és rollback, ownership, permission és régi URL megőrzés specifikációja; `WEB-002/004/006/007/013`, `EDT-027/033`, `SEO-001/004` érintett. A jelenlegi HIGH kockázat nem veszhet el az általános checklist mögött.
- **C — a tervkapu PASS és felhasználói funkció-review után:** minimális, tesztekkel védett kódjavítás; published v1 → draft v2 → PATCH metadata → public v1; explicit publish → v2; slug redirect és valódi HTTP 404; preview noindex; rollback draft-only; role/site/revision negatív tesztek. Remote D1 módosítás előtt read-only leltár és backup.
- **D — a kódjavítás után:** célzott typecheck/test/CI/böngésző/production evidence külön naplózva. **Ezeket ebben a körben nem futtattuk**, ezért nincs runtime PASS.

**Aktuális tényállás:** `PUBLICATION CONTRACT CONFLICT / SOURCE CONFIRMED / NOT FIXED`; `54.1–54.6 FIRST-PASS ROUTING 56/156`; `HISTORICAL SEMANTICS OPEN`; `PLAN-CAPABILITY-COMPLETENESS-AND-CONSISTENCY IN PROGRESS / NOT PASS`. Következő dokumentációs auditpont: **54.7#1–#12**, majd 54.8–54.16; a publikálási konfliktus **HIGH blokkoló**, nem archiválható és nem tekinthető javítottnak a routing előrehaladásával.

### 63.50.47. 54.7 checklist-szintű első routing (2026-10-14)

| Tétel | Stabil capability ID | Elsődleges modul | Negatív teszt / nyitott szerződés |
| --- | --- | --- | --- |
| 54.7#1 OBS-párosítás, hitelesítés, kapcsolatstátusz, reconnect és diagnosztika. | OBS-002, OBS-003 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Disconnected OBS esetén vezérlés tiltott; reconnect/diagnosztika OPEN |
| 54.7#2 Scene/source lista, állapot, scene-váltás, visibility, audio mute/volume a támogatott műveletek szerint. | OBS-003, OBS-004 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Nem támogatott scene/source/audio parancs tiltott |
| 54.7#3 Overlay Studio, browser source, canvas, safe area, méret, pozíció, scene-variáns. | OBS-001, OBS-005, OBS-010 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Safe-area és scene-variáns részletes teszt OPEN |
| 54.7#4 Alert box és eseményvariánsok follow/sub/gift/cheer/raid/tip/purchase eseményekre, ha elérhetők. | OBS-006, OBS-008 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Csak hitelesített provider-esemény; replay/dedup kötelező |
| 54.7#5 Event list, chat box, goal/progress, countdown/timer, now-playing, sponsor/QR/link widget. | OBS-001, OBS-005, OBS-010 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Widgettípusok és registry részletezése OPEN |
| 54.7#6 Poll, giveaway, loyalty/points, viewer queue és media request csak jogosultsággal és szabályokkal. | OBS-007, COM-009 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Giveaway/loyalty és queue jogosultsági szabályok OPEN |
| 54.7#7 Widgetteszt, preview, verziózás, rollback és megosztható overlay URL. | OBS-008, OBS-010 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Publikus overlay URL nem fedhet fel vezérlési titkot |
| 54.7#8 Chatbot parancsok, aliasok, változók, timerek, quote/counter, shoutout és FAQ. | OBS-007 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Bot parancs/alias/timer rate limit OPEN |
| 54.7#9 Spam/linkvédelem, slow/follower/sub-only policy ahol a platform engedi, moderációs napló. | OBS-007, COM-009, COM-012 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Platform-policy és moderációs audit szükséges |
| 54.7#10 Hotkey, Stream Deck/Macro Deck/MIDI/webhook adapter, allowlist, dry-run és végrehajtási eredmény. | OBS-004, OBS-009, AUT-004 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Dry-run nem küldhet élő parancsot |
| 54.7#11 Plugin/widget registry, verzió, kompatibilitás, permission, eredet, frissítés és eltávolítás. | OBS-010, MKT-001, MKT-002, MKT-004 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Extension permission és kompatibilitás kötelező |
| 54.7#12 Natív OBS plugin vagy desktop companion csak külön, dokumentált biztonsági tervvel. | OBS-002, SEC-009 | 49.6 OBS/overlay; provider 49.7; Community 49.9 | Desktop companion külön threat model és döntés |

**Státusz:** 12/12 első körös routing; sem domain/fázis/evidence, sem runtime PASS nem bizonyított. Hiányzó rész csak GAP CANDIDATE.

### 63.50.48. 54.8 checklist-szintű első routing (2026-10-14)

| Tétel | Stabil capability ID | Elsődleges modul | Negatív teszt / nyitott szerződés |
| --- | --- | --- | --- |
| 54.8#1 VOD, clip, highlight, long-form, Short/Reel, post, image, audio, podcast és replay. | CNT-001, CNT-002, CNT-003, CNT-004 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Nem támogatott formátum nem ígérhető publikálhatónak |
| 54.8#2 Közös content ID, platform ID, cím, leírás, thumbnail, időtartam, URL, státusz és jogadat. | CNT-001, CNT-007, CNT-022 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Külső ID ütközés és lejárt jog kezelendő |
| 54.8#3 Keresés, szűrés, rendezés, bulk action, duplikáció-észlelés és gyűjtemények. | CNT-005, CNT-006, CNT-007 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Bulk művelet nem írhat felül idegen site-ot |
| 54.8#4 Tartalomnaptár és státuszfolyam: idea/draft/review/ready/scheduled/publishing/published/failed. | CNT-009, CNT-010, CNT-013, CNT-014, CNT-015 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Approval nélkül nincs éles publikálás |
| 54.8#5 Transcript, időbélyeg, speaker/fejezet, felirat, SRT/VTT, fordítás és export. | CNT-018, AI-014 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Transcript nem automatikusan jóváhagyott tartalom |
| 54.8#6 AI highlight/clip-javaslat forrás-időbélyeggel, indoklással és emberi választással. | CNT-018, AI-014 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | AI-javaslat időbélyeg és emberi döntés nélkül nem éles |
| 54.8#7 Videóvágás: trim/split/crop/reframe/aspect ratio, felirat, hang, átmenet és brand overlay. | CNT-021, CNT-022 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Export előtt média- és zenejog ellenőrzendő |
| 54.8#8 Thumbnail/grafika-sablon, variánsok, platformméretek és preview. | CNT-012 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Platformméret/preview és export validálás OPEN |
| 54.8#9 Platformonkénti cím, leírás, hashtag, CTA, képarány és publikálási státusz. | CNT-011, CNT-013, CNT-014 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Platformonként külön partial failure |
| 54.8#10 API-publikálás ahol engedélyezett; egyébként export és kézi közzétételi útmutató. | CNT-013, CNT-014, INT-018 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Unsupported write API esetén kézi fallback |
| 54.8#11 Zene-/videójog, vendéghozzájárulás, lejárat, forrás és eltávolítási kérés. | CNT-022 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Takedown/expiry után publikus megjelenés tiltott |
| 54.8#12 Tartalomból weboldali feed, social poszt és analitika ugyanazon canonical rekord alapján. | CNT-020, CNT-019, ANL-004 | 49.8 Content Studio; AI 49.15; Integrations 49.7; public 49.2 | Közös canonical content ID; nincs második tartalomtár |

**Státusz:** 12/12 első körös routing; sem domain/fázis/evidence, sem runtime PASS nem bizonyított. Hiányzó rész csak GAP CANDIDATE.

### 63.50.49. 54.9 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.9#1 Publikus fan regisztráció/bejelentkezés, profil, preferencia, adatletöltés/törlés. | COM-019, SEC-011 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#2 Posztok, kommentek, reakciók, pollok, kérdések, beküldések és események. | COM-003, COM-004, COM-005, COM-007, COM-008 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#3 Követés, értesítés, jelvény, mérföldkő, kihívás és közösségi jutalom. | COM-006, COM-010, COM-011 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#4 Tagsági szintek, exkluzív poszt/video/audio, member-only stream és archívum. | SUP-004, SUP-011, COM-013 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#5 Discord szerver/csatorna/role mapping entitlement alapján. | SUP-009, COM-002 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#6 Moderációs queue, report, appeal, korlátozás/tiltás, spamvédelem és audit. | COM-009, COM-012 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#7 AI moderációs javaslat, bizonytalanság és emberi felülvizsgálat. | AI-016, COM-009, AI-019 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#8 Public/member-only/private hozzáférés szerveroldali ellenőrzése. | COM-013, COM-018, SUP-006 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.9#9 Közösségi szabályzat, adatvédelmi és korhatár-/tartalmi szabályok. | COM-020, SEC-011 | Community 49.9; Support 49.11 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 9/9 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.50. 54.10 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.10#1 Fizikai termék, merch, digitális termék, bundle, limited drop és preorder. | STO-001, STO-005 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#2 Variánsok, SKU, ár/pénznem, készlet, kategória, kollekció, media és SEO. | STO-002, STO-003, STO-004, STO-006 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#3 Terméklista, termékoldal, keresés, kosár, checkout-integráció és rendelés-visszaigazolás. | STO-007, STO-008, STO-009 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#4 Rendelésállapot, fizetés, teljesítés, tracking, cancel, refund és support. | STO-009, STO-010, STO-015 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#5 Kupon, ajándékkártya, promóció, kampány, bundle és lejárat. | STO-011 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#6 Biztonságos digitális delivery, entitlement és visszavonás refund/chargeback esetén. | STO-012, STO-013, SUP-008 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#7 Egyszeri támogatás, visszatérő támogatás, célmérő és köszönőüzenet. | SUP-001, SUP-002, SUP-003 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#8 Tagsági előnyök, kedvezmények, termékdrop és tagság–Discord összekapcsolás. | SUP-004, SUP-005, SUP-009, SUP-012 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#9 Szponzorációs media kit, ajánlat, deliverable, határidő, kampánylink és riport. | CAM-004, CAM-005, CAM-006, CAM-007 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#10 Affiliate link/kód, jutalék és konverzió csak mérhető/jogszerű keretben. | CAM-002, CAM-007 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#11 Bevételi források, platformdíjak, refundok és export; nem könyvelési/adótanácsadási helyettesítő. | ANL-005, STO-020 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.10#12 Fizetési, adózási, számlázási, fogyasztóvédelmi és GDPR-követelmények ellenőrzése. | STO-014, STO-019, STO-021 | Store 49.10; Support 49.11; Campaigns 49.12 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 12/12 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.51. 54.11 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.11#1 Platformonkénti követő-/nézettség-/engagement-/streamidő-mutatók, ha elérhetők. | ANL-003, ANL-004 | Analytics 49.13 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.11#2 Tartalom- és csatorna-összehasonlítás, trendek, időszakok és célok. | ANL-004, ANL-007 | Analytics 49.13 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.11#3 Adatforrás, időbélyeg, frissesség, becsült/valós adat és hiányzó metrika jelzése. | ANL-008 | Analytics 49.13 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.11#4 Webanalitika, UTM, konverzió, SEO és publikált oldalak teljesítménye. | ANL-002, CAM-002 | Analytics 49.13 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.11#5 Thumbnail/cím/időzítés kísérletek és mérhető eredmények, ha elég adat áll rendelkezésre. | ANL-007, ANL-010 | Analytics 49.13 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.11#6 Kampány-/szponzorriport, CSV/JSON export és időszakos jelentés. | CAM-007, ANL-007 | Analytics 49.13 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.11#7 AI-elemzés hipotézisekkel, forrással és bizonytalansággal; nem garantált növekedési ígéret. | AI-016, ANL-008 | Analytics 49.13 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 7/7 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.52. 54.12 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.12#1 Vizuális trigger → condition → action → branch modell. | AUT-001, AUT-002, AUT-003, AUT-004 | Automation 49.14 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.12#2 Triggerek: stream, platformesemény, schedule, tartalom, rendelés, tagság, webhook, időzítés. | AUT-002, AUT-005 | Automation 49.14 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.12#3 Akciók: értesítés, draft, címke, export, overlay/OBS parancs, publikálási előkészítés. | AUT-004, AUT-014 | Automation 49.14 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.12#4 Sablonok, verziózás, aktiválás/leállítás és jogosultság. | AUT-010, AUT-013 | Automation 49.14 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.12#5 Dry-run, preview, jóváhagyás, idempotency, rate limit, retry, timeout és napló. | AUT-006, AUT-009, AUT-011, AUT-008 | Automation 49.14 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.12#6 Sikertelen ág, karantén, értesítés, kézi helyreállítás és rollback/kompenzáció. | AUT-007, AUT-012 | Automation 49.14 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.12#7 AI-ból létrehozott workflow először draft/szimuláció; csak jóváhagyás után éles. | AI-003, AI-007, AUT-009 | Automation 49.14 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 7/7 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.53. 54.13 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.13#1 AI Control Center: provider/model, költségkeret, kvóta, retention, adatforrás és stop switch. | AI-001, AI-010, AI-017 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#2 Projekt-/brandkontextus jogosultsággal és megtekinthető forrásokkal. | AI-004, AI-006 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#3 Website Designer: oldal/komponens/dizájn/responsive/SEO/accessibility javaslat. | AI-011, AI-012 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#4 Live Coach: opt-in technikai jelzések, pillanatjelölés és stream-/chat-összegzés. | AI-015 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#5 Content Producer: transcript, clip, felirat, fordítás, thumbnail, cím és platformvariáns. | AI-013, AI-014 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#6 Community Assistant: FAQ, összegzés, moderációs javaslat és tagsági művelet-előkészítés. | AI-016, AI-019 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#7 Business Analyst: tartalom/kampány elemzés, hipotézis, mérhető teszt. | AI-016, ANL-008 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#8 Automation Builder: természetes nyelvből workflow-draft, szimuláció és diff. | AI-003, AI-007, AUT-009 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#9 Kép-/grafika-/hang-/videógenerálás megfelelő külső modellel/szolgáltatóval, licenc- és költségkorláttal. | AI-021 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#10 AI-művelet domain API-n át; kockázati szint, preview, jóváhagyás, napló és visszaállítás. | AI-005, AI-006, AI-007, AI-008, AI-009 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#11 Generált tartalom jelölése, forrás és bizonytalanság, felhasználói visszajelzés. | AI-002, AI-018 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.13#12 Manuális, AI nélküli út minden alapvető termékfolyamathoz. | AI-020 | AI 49.15 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 12/12 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.54. 54.14 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.14#1 Admin és publikus web külön nyelvi beállítással. | LOC-001, LOC-003 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.14#2 Magyar elsődleges nyelv, további nyelvek fokozatos bevezetése. | LOC-001 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.14#3 Locale-onkénti oldal-/CMS-tartalom, menü, média, alt text, SEO és Open Graph. | LOC-003, LOC-005 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.14#4 Lokalizált slug/URL, hreflang/canonical szabályok és nyelvi fallback. | LOC-004 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.14#5 Dátum/idő/pénznem/szám lokalizáció, időzóna és nyári időszámítás. | LOC-002 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.14#6 RTL layout, billentyűzet, font fallback és hosszabb fordítások tesztje. | LOC-001, LOC-005 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.14#7 Fordítási memória/szószedet és AI-fordítás emberi jóváhagyással. | LOC-006 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.14#8 Nyelvváltó, automatikus nyelvajánlás és felhasználói választás megőrzése. | LOC-001, LOC-005 | LOCALIZATION cross-cutting; Settings 49.19; Website 49.2 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 8/8 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.55. 54.15 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.15#1 Profil, site/workspace, locale, timezone, dátum/pénznem és preferenciák. | TEAM-001, LOC-002 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#2 Szerepek: owner/admin/editor/moderator/analyst/commerce és modulonkénti engedély. | TEAM-003, SEC-002 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#3 Szerveroldali authorization, site/tenant izoláció és minimális jogosultság. | SEC-002, SEC-003 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#4 Session, 2FA/SSO később, secret rotation, rate limit és gyanús aktivitás. | SEC-001, SEC-004, SEC-012 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#5 Titok/token/payment adat redakció; titkosított token storage. | SEC-008 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#6 Consent, cookie/privacy, retention, export/delete és adatfeldolgozók. | SEC-011 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#7 Backup, restore próba, verziózott mentés, import/export és disaster recovery. | OPS-005, OPS-006 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#8 Health, job queue, webhook, API-quota, error log és audit log. | OPS-001, OPS-002, OPS-003, OPS-011 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#9 Idempotencia, retry, timeout, cache invalidation, stale-data és partial-failure kezelés. | AUT-006, AUT-007, OPS-008 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#10 Undo/redo, revision diff, restore és törlés előtti függőségi vizsgálat. | OPS-009, TEAM-004 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#11 WCAG 2.2 AA cél, reduced motion, screen reader, kontraszt, fókusz és touch target. | AI-012, SEC-005 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#12 Mobil/tablet/desktop, gyenge hálózat, offline-jelzés és adatvesztés elleni védelem. | OPS-008 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.15#13 Tesztek: domain, integration, authorization, migration, UI, accessibility, responsive, E2E és smoke. | OPS-004, OPS-006 | Security/Operations 49.19; Team | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 13/13 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.56. 54.16 első körös capability és owner megfeleltetés (2026-10-14)

| Tétel | Kapcsolódó meglévő ID-k | Elsődleges felelősségi kör | Ellenőrzendő negatív határ |
| --- | --- | --- | --- |
| 54.16#1 Dokumentált API, webhook registry, API-key kezelés, tesztelő és sandbox. | DEV-001, DEV-002, DEV-003, DEV-004 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.16#2 Extension/widget/overlay manifest, schema, permission, verzió és kompatibilitás. | DEV-001, DEV-005 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.16#3 Eredet/licenc/aláírás, sandbox, felülvizsgálat, frissítés, eltávolítás és visszavonás. | DEV-002, OPS-010 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.16#4 Template/component/overlay/workflow marketplace későbbi fázisban. | TEAM-007, DEV-005 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.16#5 Több site/workspace, aktív workspace választó, csapatmeghívás és szerepek. | TEAM-001, TEAM-002, TEAM-003, TEAM-005 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.16#6 Agency/studio mód, ügyfélhozzáférés, közös sablonok és jóváhagyás. | TEAM-007, TEAM-004 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.16#7 Későbbi SaaS billing, csomag, használati limit, számla, lemondás és adat-export. | TEAM-006 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |
| 54.16#8 Tenant izoláció, migráció, skálázás, adatrezidencia és költségfelügyelet. | SEC-003, OPS-004, OPS-008 | Developer 49.20; Extensions 49.21; Team 49.22 | Nincs automatikus működési vagy provider-képesség állítás; külön jogosultság, adatgazda, negatív teszt és fázis bizonyítandó |

**Státusz:** 8/8 első körös, *nem* teljes szemantikai igazolás. Az ID-k léteznek, de részletes scope, acceptance, dependency és evidence továbbra is ellenőrizendő.

### 63.50.57. Második kör I: modulazonosító-eltolódás és adatgazda-határok tételes korrekciója (2026-10-15)

**Forrás:** az aktuális 5. domain-tábla, a 49.1–49.22 kanonikus menütérkép, a 63.20 tulajdonosi keresztmátrix és az 54.7–54.16 első körös sorai. Ez a kör a korábban létrejött *téves hivatkozásokat* javítja, nem hoz létre új menüstruktúrát.

**Bizonyított hiba az első körben:** a 54.7 és 54.8 routingjában a modulok számozása eggyel elcsúszott: 49.6 = OBS, 49.7 = Integrations, 49.8 = Content Studio, 49.9 = Community, 49.10 = Store, 49.11 = Support, 49.12 = Sponsorship, 49.13 = Analytics, 49.14 = Automation, 49.15 = AI. A 49.16 **globális keresés**, nem Localization; a Localization keresztmetszeti domain, UI-ja Settings 49.19 / Website 49.2. A 49.20 = Developer, 49.21 = Extensions, 49.22 = Team/SaaS. A hibás routing **nem bizonyíthat helyes tulajdonost**, még ha a capability ID maga létezik is.

**Javítás a korábbi sorokban:** 54.7#1–#12 → 49.6 OBS; 54.8#1–#12 → 49.8 Content; 54.9#1–#9 → 49.9 Community; 54.10#1–#12 → 49.10 Store; 54.14#1–#8 → LOCALIZATION domain, Settings/Website; 54.16#1–#8 → Developer/Extensions/Team 49.20/49.21/49.22. Az OBS plugin-registry sorának `DEV-002` (API-key management) hivatkozását `MKT-001/002/004` extension manifest/install/license képességekre javítottuk; az OBS-010 a saját overlay preview/version tulajdonosa marad.

**Második körös domain/owner crosswalk a 16 checklist-blokkra** — a 49. fejezet modulja a *belépési pont*, az 5. fejezet domainje az *adat és életciklus tulajdonosa*. A táblázat nem jelenti minden összetett checkbox teljes szemantikai lezárását.

| 54 blokk | Elsődleges kanonikus UI | 5. fejezet domain tulajdonos(ok) | Kiemelt külön fogyasztó / tilos duplikáció |
| --- | --- | --- | --- |
| 54.1 | 49.1 Dashboard | SEARCH, NOTIFICATION, HELP_CENTER, AUDIT; ADM read projection | Nem saját task/notification store |
| 54.2 | 49.2 Website/Editor | SITE, PAGE, REVISION, NAVIGATION, SEO_PUBLICATION, FORM_SUBMISSION | Dinamikus blokk nem másol schedule/content rekordot |
| 54.3 | 49.3 Brand/Design | DESIGN_SYSTEM | RESOURCE bináris és asset registry külön |
| 54.4 | 49.4 Assets | RESOURCE | D1 metadata és R2 binary, minden felület közös asset ID |
| 54.5 | 49.7 Integrations | INTEGRATION | Provider inbound webhook ≠ creator outbound webhook |
| 54.6 | 49.5 Live/Schedule | LIVE_STATE, SCHEDULE, GAME_PROFILE | Provider state INTEGRATION, content CONTENT |
| 54.7 | 49.6 OBS/Overlay | STREAM_TOOLS | OBS auth/scope INTEGRATION, plugin install EXTENSION |
| 54.8 | 49.8 Content Studio | CONTENT, PUBLISHING | AI javaslat AI_OPERATION, asset RESOURCE |
| 54.9 | 49.9 Community | COMMUNITY, FAN_IDENTITY | Membership ENTITLEMENT; Discord INTEGRATION |
| 54.10 | 49.10 Store; 49.11 Support; 49.12 Sponsorship | PRODUCT, ORDER, SUPPORT, ENTITLEMENT, CAMPAIGN, SPONSORSHIP | Payment provider INTEGRATION, metrics ANALYTICS |
| 54.11 | 49.13 Analytics | ANALYTICS | Kísérlet/kampány forrás CAMPAIGN, AI javaslat AI_OPERATION |
| 54.12 | 49.14 Automation | AUTOMATION | Minden write domain API/command, nem közvetlen idegen tábla |
| 54.13 | 49.15 SANCI AI | AI_OPERATION | AI nem a cél domain adatait birtokolja |
| 54.14 | 49.19 Settings; 49.2 Website | LOCALIZATION | Locale-onkénti page/SEO publikálás PAGE és SEO_PUBLICATION |
| 54.15 | 49.19 Settings/Security | IDENTITY, SETTINGS, AUDIT, BACKUP, WORKSPACE; SEC/OPS cross-cutting | Site/tenant RBAC minden domainben |
| 54.16 | 49.20 Developer; 49.21 Extensions; 49.22 Team | DEVELOPER_API, EXTENSION, WORKSPACE, BILLING_PLAN | SaaS billing ≠ Store ORDER; provider inbound ≠ outbound webhook |

**Kötelező negatív ellenőrzési lánc minden sorhoz:** owner-domain record → permission/site-scope → mutációs API/command → másodlagos UI read projection → pozitív és tiltott hozzáférési eset → F0–F11 phase → source/test/runtime evidence. Ebből most az **54-blokk szintű domain és modul** rész igazolt dokumentumszerkezet alapján; az **egyedi 156 sor phase/evidence és 271 történeti sor szemantikája továbbra is OPEN**.

**Kiemelt release blocker:** 63.50.46 explicit-publish/snapshot/slug kódkonfliktus; a korábbi routing korrekciója ezt nem oldja meg. **SECOND PASS: MODULE/DOMAIN GROUP CROSSWALK DOCUMENTED; ITEM-LEVEL PHASE/EVIDENCE NOT PASS.**

### 63.50.58. Második kör II: mind a 16 review-blokk fázis- és release-függőségi ellenőrzése (2026-10-15)

**Forrás:** a 41.2 és 63.38 kanonikus F0–F11 crosswalk, a 24. ID-jegyzék és a 63.50.39–57 routing. A checkbox egyetlen mondata több fejlesztési fázist is érinthet: a *minimum működő szelet* és a *teljes célképesség* külön elfogadási kapu. Nem lehet az összes későbbi funkciót F0-ba húzni.

| Review-blokk | Indulási / teljes fázis | Függőségi szerződés | Elsődleges negatív teszt |
| --- | --- | --- | --- |
| 54.1 | F1 + forrásdomain későbbi fázisa | SEARCH/NTF/HELP core F1; nem létező forrásdomain kártyája nem élő | Dashboard read-only; stale/error és role |
| 54.2 | F0 core; F2 design; F3 CMS/SEO/forms; F5+ dinamikus provider | PAGE/REVISION snapshot F0; DSN F2; SEO/DYN/SET-004 F3 | Publikált v1 nem változhat draft PATCH miatt; slug/404 |
| 54.3 | F2; marketplace F11 | DSN-001–017 F2; DSN-018 F11 | Globális token override/instance nem szivároghat át másik site-ra |
| 54.4 | F0 asset reference minimum; F2 teljes könyvtár; F8 paid access | RES-001–002 F0; RES-003–015 F2; RES-016 F8 | Törölt/privát assetre hivatkozás nem válhat publikussá |
| 54.5 | F0 meglévő Twitch megőrzés; F5 integrációs központ; F8 payment adapter | INT-001–021 F5, scope és provider capability szerint | Expired/revoked/wrong-site token nem engedélyezhet parancsot |
| 54.6 | F0 schedule integrity; F3 schedule UX; F5 live; F6 studio | SCH-001/010 F0; SCH-002–006 F3; INT F5; LIV F5/F6 | DST ütközés, stale live, unsupported multistream |
| 54.7 | F6; F11 extension registry | OBS-001–010 F6; MKT-001/002/004 F11 | Disconnected OBS parancs tiltott; plugin permission/secret |
| 54.8 | F7; F10 AI clip javaslat | CNT-001–022 F7; AI-014 F10 | Publish approval és rights/takedown; unsupported API fallback |
| 54.9 | F8; AI moderáció F10 | COM-001–020 F8; AI-016/019 F10 | Member-only szerveroldali entitlement; abuse/appeal |
| 54.10 | F8 store/support; F9 campaigns/analytics; F11 SaaS billing külön | STO/SUP F8; CAM/ANL F9; TEAM-006 F11 | Refund/chargeback entitlement revoke; VAT/provider gate |
| 54.11 | F9; AI hipotézis F10 | ANL-001–010 F9; CAM-007 F9; AI-016 F10 | Hiányzó metrika nem nullának és nem ténynek mutatva |
| 54.12 | F9; AI workflow draft F10 | AUT-001–014 F9; AI-003/007 F10 | Dry-run nem futtathat éles akciót; retry idempotens |
| 54.13 | F10; F0/F1 security előfeltétel | AI-001–021 F10; SEC-002/003 F0+ | AI nem írhat domain-adatot approval és audit nélkül |
| 54.14 | F0/F1 locale alap; F3 web SEO/translation; F10 AI translation | LOC-001/002 F0/F1; LOC-003–005 F3; LOC-006 F10 | Locale fallback nem írhatja felül publikált eredeti tartalmat |
| 54.15 | F0–F11 cross-cutting; F4 account; F11 multi-site | SEC/OPS/QA folyamatos; SEC-012 F4/F11; TEAM F4/F11 | Cross-tenant access és restore failure negatív teszt |
| 54.16 | F4 team alap; F11 Developer/Extension/SaaS | TEAM-001–005 F4/F11; DEV/MKT/TEAM-006–007 F11 | API key/revoke, tenant isolation, marketplace trust boundary |

**Részletes következtetések és prioritási sorrend:**

1. **P0 — F0 blokkoló forráskód-szerződés:** `pages.content_json` draft vs `published_content_json` explicit snapshot; Admin Pages PATCH automatikus snapshot-felülírás és közös slug oszlop (63.50.21–23, 63.50.46). A javítás tervezésekor külön published metadata/URL lifecycle, migration, redirect, 404, canonical/OG/robots és read-only D1 preflight szükséges. **NOT FIXED**.
2. **P1 — site/tenant és permission:** `site_settings.key='site'` single-site scope, `system_page_content` legacy útvonal és aktív fogyasztók, OAuth ownership, API/route/role matrix (63.50.24–26). Jelenlegi single-site nem bizonyít multi-tenant izolációt. **NOT PASS**.
3. **P1 — egyetlen Admin és Editor:** 24 dashboard-kártya ≠ 22 főmodul; a kanonikus navigáció külön module entrypointokat igényel, miközben a domain-adat csak egy helyen létezik. Legacy assetek archiválása csak dependency inventory után. **NOT PASS**.
4. **P2 — Resource/Design/Template:** F0 csak minimális asset reference; teljes registry és master-instance/override F2. A sablon, komponens, ikon és gomb globális változásának hatása diff/rollback nélkül nem zárható. **NOT PASS**.
5. **P2 — külső integráció és későbbi AI:** provider capability és quota/scope/terms szerződés nélkül nincs éles action. AI először draft/preview, domain API-n át, human approval, AI-free fallback. **F5–F10, NOT IMPLEMENTED BY THIS AUDIT**.

**Bizonyítékhatár:** a fenti 16 sor a 63.38 csoportszintű fázis-szabályainak *második körös átvezetése*; az összes 156 checkbox külön ID-nkénti acceptance és 271 H-történeti sor szemantikai helyessége még nem bizonyított. A már meglevő 63.12–63.15 tételes crosswalkot meg kell őrizni; az első körös 63.50.39–56 táblák nem helyettesítik és nem teszik feleslegessé.

**Következő konkrét audit:** `63.50.59` — 54.1–54.4 soronkénti pozitív/negatív acceptance, domain és fázis, bizonyíték-állapot megkülönböztetése; majd 54.5–54.16; történeti 00/A / 00.9.6.B célzott forrásvizsgálat külön nyitott kapu. **SECOND PASS GROUP PHASES RECORDED / INDIVIDUAL EVIDENCE NOT PASS.**

### 63.50.59. Második kör III: 54.1–54.4 tételes domain, fázis, pozitív/negatív acceptance (2026-10-15)

**Módszer:** az eredeti 54.x checkbox-szöveg, az 5. domain-tábla, a 63.38 F-fázisok és a 63.50.39–43 capability routing soronkénti összevetése. Az itt írt acceptance **tervezett teszt**, nem lefuttatott teszt. Az ID-linkeket a korábbi routing tartalmazza, itt a domain/phase/test hiányzó dimenzióit tesszük visszakereshetővé.

#### 54.1 — 8 sor

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.1#1 Egységes Admin shell, oldalsáv, almenük, breadcrumbs, mobil navigáció. | IDENTITY, SETTINGS | F1 | Admin route/shell és mobil navigáció ugyanazon jogosultságszűrt menüből | Jogosulatlan menü/route nem érhető el |
| 54.1#2 Áttekintő kártyák: weboldal, live, adásrend, kapcsolatok, tartalom, feladatok. | LIVE_STATE, SCHEDULE, INTEGRATION, CONTENT | F1 + forrásfázis | Dashboard read projection megnyitja a canonical rekordot | Stale/offline kártya nem látszik élőnek |
| 54.1#3 Gyorsműveletek és legutóbbi aktivitás. | AUDIT + forrásdomain | F1 | Gyorsművelet canonical domain commandra visz, audit csak olvasás | Dashboard nem hoz létre külön activity store-t |
| 54.1#4 Teendők, figyelmeztetések, hibák és elakadt folyamatok. | NOTIFICATION, AUDIT, INTEGRATION | F1 + forrásfázis | Hiba és elakadás forrásmodulhoz navigál | Sikertelen művelet nem jelenik meg sikeresnek |
| 54.1#5 Globális kereső, command palette, kedvencek, legutóbbi elemek. | SEARCH | F1 + indexadapter később | Permission-aware keresés és billentyűs navigáció | Idegen site/role találat nem látható |
| 54.1#6 Kontextuális súgó, onboarding, üres állapotok és emberi nyelvű hibák. | HELP_CENTER | F1 | Contextual help és érthető empty/error | Nem létező feature nem szerepel késznek |
| 54.1#7 Értesítési központ, prioritások, digest és csendes időszak. | NOTIFICATION | F1 + delivery később | Digest/quiet hours preferenciák megmaradnak | Tiltott csatorna nem küld üzenetet |
| 54.1#8 Valós adatfrissesség, loading/empty/error/stale/partial állapot. | IDENTITY, SEARCH + forrásdomain | F1 | Loading/empty/error/stale/partial elkülönül | Cache adat nem jelenik meg frissnek |

#### 54.2 — 15 sor

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.2#1 Oldal CRUD, hierarchia, slug, átnevezés, duplikálás, archiválás és törlés. | PAGE, REVISION, SEO_PUBLICATION | F0 core/F3 | CRUD és draft/published slug külön lifecycle | Metadata PATCH nem publikál draftot; régi URL nem 404 redirect nélkül |
| 54.2#2 Navigáció, dropdown/nested menü, footer, mobilmenü, belső/külső link. | NAVIGATION, PAGE | F3 | Nested navigáció és belső link cél feloldható | Archivált/privát cél nem szivárog public menübe |
| 54.2#3 Egyetlen Visual Editor: elemkönyvtár, canvas, Layers/Outline, Inspector. | PAGE, REVISION | F0 | Canvas, layers, Inspector egyetlen Page Modelt használ | Inspector nem írja át domain üzleti rekordját |
| 54.2#4 Drag/drop, kijelölés, átrendezés, csoportosítás, duplicate, törlés, zoom/pan. | PAGE, REVISION | F0 | Minden canvas command mentés/újratöltés után konzisztens | Tiltott reparent/ciklus/locked mutation elutasítva |
| 54.2#5 Undo/redo, mentési állapot, konfliktusfeloldás, revision history és restore. | REVISION, PAGE | F0 | Undo/redo, restore és optimistic conflict kezelés | Restore nem implicit publish; konfliktus nem ír felül |
| 54.2#6 Szöveg, heading, kép, videó/embed, gomb, link, ikon, lista, kártya, űrlap, divider, spacer, grid/flex/section/container. | PAGE, RESOURCE, FORM_SUBMISSION | F0 core/F3 bővítés | Támogatott node validálva renderel | Unsafe embed/form és ismeretlen node elutasítva |
| 54.2#7 Dinamikus SANCI blokkok: live, következő stream, adásrend, játékprofil, videó/clip feed, social links, termék, tagság, támogatás és közösségi CTA. | PAGE + LIVE_STATE/SCHEDULE/CONTENT/PRODUCT/SUPPORT | F3 shell; F5–F8 adatok | Blokk canonical domain projectiont mutat | Draft/private rekord nem látható public blokkban |
| 54.2#8 Desktop/tablet/mobile preview, breakpointonkénti override, öröklés és portrait/landscape. | PAGE, DESIGN_SYSTEM | F0/F2 | Responsive override és inherit roundtrip | Breakpoint-váltás nem töröl másik viewport értéket |
| 54.2#9 Globális design tokens: színek, fontok, tipográfia, spacing, border, radius, shadow, layout. | DESIGN_SYSTEM | F2 | Token változás követhető usage/diff nézeten | Global token nem ír felül explicit local override-ot |
| 54.2#10 Site/page/section/component sablonok, reusable komponensek, instance/override/detach, verziózás és rollback. | DESIGN_SYSTEM, RESOURCE | F2 | Master-instance és verzióváltás explicit | Detach nem módosít mastert |
| 54.2#11 Előnézet, draft, validálás, publikálás, visszavonás és publikált snapshot megőrzése. | PAGE, REVISION, SEO_PUBLICATION | F0 | Preview draft; publish explicit snapshot | CMS PATCH nem publikál; preview nem indexelhető |
| 54.2#12 SEO: title, description, canonical, robots, Open Graph, social image, sitemap, robots.txt, structured data, redirect, 404. | SEO_PUBLICATION, PAGE | F3; F0 URL biztonság | HTTP status, canonical/OG/robots/redirect crawler ellenőrizhető | 404 shell nem adhat 200-at; preview noindex |
| 54.2#13 Domain/DNS/HTTPS státusz, favicon, brand assets, coming-soon/maintenance. | SITE, SETTINGS, RESOURCE | F3 | DNS/HTTPS domain státusz és site favicon valid | Nem igazolt domain nem válhat canonical-lá |
| 54.2#14 Űrlapok, validáció, spamvédelem, adatkezelési hozzájárulás és beküldés-kezelés. | FORM_SUBMISSION, PAGE | F3 | Form validation, consent és submission lifecycle | Spam, invalid consent és cross-site beküldés elutasítva |
| 54.2#15 Webes teljesítmény, képméretezés, lazy loading, cache és Core Web Vitals. | RESOURCE, PAGE, SEO_PUBLICATION | F3 | Valós CWV és cache invalidation mérhető | Draft/privát asset nem kerül public cache-be |

#### 54.3 — 7 sor

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.3#1 Logóvariánsok, színek, betűcsaládok, ikonstílus, vizuális szabályok. | DESIGN_SYSTEM, RESOURCE | F2 | Brand preset és asset hivatkozás konzisztens | Másik site brand asset nem örökölhető jogosulatlanul |
| 54.3#2 Overlay, thumbnail, intro/outro, watermark, social post, merch és email sablonok. | DESIGN_SYSTEM, RESOURCE | F2; marketplace F11 | Sablonváltozat és licenc/asset referenciák | Template export nem tartalmazhat privát assetet |
| 54.3#3 Brand-safe színek/fontok és kontrasztellenőrzés. | DESIGN_SYSTEM | F2 | Kontraszt és font fallback ellenőrizhető | AA kontrasztot sértő preset nem jelölhető késznek |
| 54.3#4 Globális és komponensszintű tokenek, theme-változatok és dark/light. | DESIGN_SYSTEM | F2 | Token cascade és dark/light preview | Explicit override nem vész el theme váltáskor |
| 54.3#5 SVG/PNG/WebP és megfelelő exportméretek. | DESIGN_SYSTEM, RESOURCE | F2 | Export pipeline valós formátum és méret | Hibás SVG/script nem jut át |
| 54.3#6 Licenc, forrás, tulajdonos, verzió és asset-használati helyek. | RESOURCE, AUDIT | F2 | Licenc/source/version és usage map egyezik | Jog nélküli asset nem exportálható publicba |
| 54.3#7 Brand consistency ellenőrzés, AI-javaslat és kézi jóváhagyás. | DESIGN_SYSTEM, AI_OPERATION | F2; AI F10 | AI javaslat draft, emberi approval | AI nem módosít automatikusan global brandet |

#### 54.4 — 7 sor

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.4#1 Egy asset registry és asset ID, R2 bináris tárolással, D1 metaadattal. | RESOURCE | F0 minimum/F2 | Canonical asset ID D1 metadata és R2 binary | Nincs második médiatár vagy orphan blob |
| 54.4#2 Képek, videók, hangok, ikonok, fontok, dokumentumok, thumbnailök és exportok. | RESOURCE | F2 | MIME típusonként feldolgozás/fallback | Nem támogatott media nem jelenik meg késznek |
| 54.4#3 Egyenkénti/tömeges feltöltés, progress, cancel, retry és megszakadt feltöltés helyreállítása. | RESOURCE | F2 | Upload progress/cancel/retry idempotens | Megszakadt upload nem duplikál vagy árva blob |
| 54.4#4 MIME-/méretellenőrzés, feldolgozási státusz, preview/thumbnail és biztonsági ellenőrzés. | RESOURCE | F2 | Server-side MIME/size/sanitize és processing state | Álcázott MIME vagy unsafe SVG elutasítva |
| 54.4#5 Címke, keresés, gyűjtemény, alt text, licenc, forrás és crop/focal point. | RESOURCE | F2 | Search/filter/alt/license/crop ugyanazon registry | Alt/licenc módosítás nem veszhet el |
| 54.4#6 Használati helyek, függőségi figyelmeztetés és biztonságos archiválás/törlés. | RESOURCE | F2 | Usage map, safe archive/delete és restore | Használt asset nem törölhető csendben |
| 54.4#7 Metaadatmódosítások megjelenése minden hivatkozási helyen. | RESOURCE, PAGE, DESIGN_SYSTEM | F2 | Metadata update minden consumeren követhető | Cache stale vagy cross-site megjelenés tiltott |

**Eredmény:** 37/37 tétel (54.1–54.4) tételes *specifikációs* domain/fázis/pozitív-negatív acceptance rögzítve. **Forráskód/test/runtime evidence:** nincs itt újonnan igazolva; az érintett korábbi 63.50.21–26 forráskód-audit tények és 63.26–37 feature-mátrixok csak korlátozott, külön bizonyítékok. A 54.2#1/#11/#12 **HIGH P0** explicit publish/slug/HTTP/SEO blokk; 54.2#13 domain/DNS és #14 submission admin lifecycle részleges képességlefedettség-jelölt, nem automatikus PASS.

**Következő:** 54.5–54.8 (Integrations, Live, OBS, Content) ugyanezzel az acceptance sémával; aztán 54.9–54.16. 00/A és 00.9.6.B eredeti forrása továbbra is OPEN. **GATE: NOT PASS.**

### 63.50.60. Második kör IV: 54.5–54.8 tételes integration/live/OBS/content acceptance (2026-10-15)

**Forrás:** az 54.5–54.8 eredeti checklist, az 5. domain-tábla, 49.5–49.8 kanonikus modulok és 63.38 F-fázis crosswalk. Ezek *teszttervek*, nem teszteredmények.

#### 54.5 — 8 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.5#1 Integrációs központ: Twitch, YouTube, TikTok, Discord, Kick és későbbi szolgáltatók. | INTEGRATION | F5 | Provider adapterek explicit támogatottsági mátrixa | Nem támogatott platformfunkció nem ígérhető |
| 54.5#2 Connect/disconnect/reconnect, fiók-/csatornaválasztás, scope és lejárat. | INTEGRATION, IDENTITY | F5 | Connect/reconnect és scope változás nyomon követhető | Idegen site account nem csatlakoztatható |
| 54.5#3 Tokenfrissítés, revoke, titkos tárolás, CSRF/state és site ownership. | INTEGRATION, AUDIT | F0 Twitch baseline/F5 | OAuth state egyszer használható, revoke invalidál | CSRF, lejárt state és plaintext token tiltott |
| 54.5#4 Capability/scope mátrix, API-kvóta, provider health és diagnosztika. | INTEGRATION | F5 | Health/quota/capability UI forrásfrissességgel | Kvótatúllépés nem végtelen retry |
| 54.5#5 Webhook aláírásellenőrzés, replay-védelem, deduplikáció, retry és dead-letter. | INTEGRATION, AUDIT | F5 | Aláírt webhook idempotens esemény-feldolgozás | Unsigned/replayed webhook nem változtat adatot |
| 54.5#6 Szinkronnapló, utolsó siker/hiba, kézi újraszinkron és konfliktusfeloldás. | INTEGRATION | F5 | Sync history és kézi retry ütközésjelzéssel | Manual override nem íródik felül észrevétlenül |
| 54.5#7 Későbbi email, naptár, fizetés, affiliate, CRM és cloud-storage adapterek. | INTEGRATION | F5 adapter/F8 fizetés | Adapter csak valós scope és compliance mellett aktív | Provider nélküli fake success tiltott |
| 54.5#8 Nem támogatott funkció egyértelmű jelölése és alternatív folyamat. | INTEGRATION | F5 | Unsupported action látható fallbackkal | Hiányzó capability nem válik látszólag kész funkcióvá |

#### 54.6 — 11 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.6#1 Live/offline állapot és adatfrissesség platformonként. | LIVE_STATE, INTEGRATION | F5/F6 | Live/offline frissesség és platform ID ellenőrizhető | Stale stream nem jelenik meg live-nak |
| 54.6#2 Cím, kategória/játék, kezdés, nézőszám és elérhető streammetrikák. | LIVE_STATE | F5/F6 | Provider mezők elérhetőség szerint normalizáltak | Hiányzó viewer count nem 0-ként állítva |
| 54.6#3 Stream player/embed és offline fallback. | LIVE_STATE, PAGE | F6 | Embed és offline fallback valós platform-szabály szerint | Privát/tiltott embed nem kerül publicba |
| 54.6#4 Egyetlen adásrend-domain: események, ismétlődések, időzóna, ütközések. | SCHEDULE | F0 alap/F3 | Egy canonical schedule_items, timezone/DST teszt | Recurrence ütközés és duplikáció tiltott |
| 54.6#5 Draft/scheduled/confirmed/postponed/cancelled/completed állapot. | SCHEDULE | F3 | Állapotváltások szabályozottak és auditáltak | Cancelled esemény nem jelenik meg upcomingként |
| 54.6#6 Twitch/YouTube sync, irány/prioritás, konfliktuskezelés és szinkronelőzmény. | SCHEDULE, INTEGRATION | F5 | Sync irány és conflict policy explicit | Kézi módosítást nem ír felül sync |
| 54.6#7 Játékprofilok, kapcsolódó tartalom, publikus naptár, countdown és későbbi iCal. | GAME_PROFILE, SCHEDULE, CONTENT | F3/F7 | Game profil és naptár canonical referenciákból | Külső calendar export nem ad privát eventet |
| 54.6#8 Stream előtti checklist, technikai próba, jegyzetek, markerek és highlight-pontok. | SCHEDULE, STREAM_TOOLS | F6 | Checklist és marker explicit owner és session ID | Lezárt streamre új marker nem kerül hibásan |
| 54.6#9 Multistream célok és platformonkénti metadata csak igazolt capability szerint. | LIVE_STATE, INTEGRATION | F6 | Csak támogatott multistream cél aktiválható | Nem támogatott stream target blokkolva |
| 54.6#10 Unified Chat, platformjelölés, moderációs státusz, küldési engedély és részleges hiba. | LIVE_STATE, INTEGRATION, COMMUNITY | F6 | Chat küldés scope alapján platformonként | Egy provider hibája nem jelöl közös sikert |
| 54.6#11 Felvétel/backup/replay csak tényleges technikai lehetőség és tisztázott tárolási költség mellett. | RESOURCE, STREAM_TOOLS | F6 | Record/replay csak storage cost és consent után | Rögzítés tiltva ha permission/cost gate hiányzik |

#### 54.7 — 12 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.7#1 OBS-párosítás, hitelesítés, kapcsolatstátusz, reconnect és diagnosztika. | STREAM_TOOLS, INTEGRATION | F6 | OBS pairing/reconnect és állapotváltozás | Lejárt pairing nem ad parancsjogot |
| 54.7#2 Scene/source lista, állapot, scene-váltás, visibility, audio mute/volume a támogatott műveletek szerint. | STREAM_TOOLS | F6 | Scene/source/audio parancs eredménye igazolt | Disconnected vagy unsupported command tiltott |
| 54.7#3 Overlay Studio, browser source, canvas, safe area, méret, pozíció, scene-variáns. | STREAM_TOOLS, DESIGN_SYSTEM | F6 | Overlay canvas és scene-variáns méret/preview | Safe-area overflow nem láthatatlanul publish |
| 54.7#4 Alert box és eseményvariánsok follow/sub/gift/cheer/raid/tip/purchase eseményekre, ha elérhetők. | STREAM_TOOLS, INTEGRATION | F6 | Event adapter signature/dedup és alert mapping | Replay/purchase spoof nem indít alertet |
| 54.7#5 Event list, chat box, goal/progress, countdown/timer, now-playing, sponsor/QR/link widget. | STREAM_TOOLS, LIVE_STATE | F6 | Widget registry állapot/frissesség szerint | Privát esemény nem szivárog overlay URL-en |
| 54.7#6 Poll, giveaway, loyalty/points, viewer queue és media request csak jogosultsággal és szabályokkal. | STREAM_TOOLS, COMMUNITY | F6/F8 | Giveaway/poll entitlement és szabály ellenőrzés | Jogosulatlan viewer action elutasítva |
| 54.7#7 Widgetteszt, preview, verziózás, rollback és megosztható overlay URL. | STREAM_TOOLS | F6 | Preview és rollback visszaállítható | Overlay token nem vezérlő secret |
| 54.7#8 Chatbot parancsok, aliasok, változók, timerek, quote/counter, shoutout és FAQ. | STREAM_TOOLS, COMMUNITY | F6/F8 | Bot command rate limit és audit | Spam és privilege escalation tiltott |
| 54.7#9 Spam/linkvédelem, slow/follower/sub-only policy ahol a platform engedi, moderációs napló. | COMMUNITY, STREAM_TOOLS | F6/F8 | Moderation policy és provider capability | Unsupported moderation API nem hívható |
| 54.7#10 Hotkey, Stream Deck/Macro Deck/MIDI/webhook adapter, allowlist, dry-run és végrehajtási eredmény. | STREAM_TOOLS, AUTOMATION | F6/F9 | Dry-run eredménynapló és allowlist | Dry-run nem küld élő OBS parancsot |
| 54.7#11 Plugin/widget registry, verzió, kompatibilitás, permission, eredet, frissítés és eltávolítás. | EXTENSION, STREAM_TOOLS | F11 | Manifest/signature/permission és verzió | Untrusted plugin nem telepíthető |
| 54.7#12 Natív OBS plugin vagy desktop companion csak külön, dokumentált biztonsági tervvel. | STREAM_TOOLS, EXTENSION | F11 külön döntés | Desktop threat model és explicit opt-in | Web scope nem ad helyi gép admin jogot |

#### 54.8 — 12 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.8#1 VOD, clip, highlight, long-form, Short/Reel, post, image, audio, podcast és replay. | CONTENT | F7 | Content type schema és platform support | Unsupported format nem publikálható |
| 54.8#2 Közös content ID, platform ID, cím, leírás, thumbnail, időtartam, URL, státusz és jogadat. | CONTENT, RESOURCE | F7 | Canonical content ID és provider IDs | External ID collision nem ír felül más rekordot |
| 54.8#3 Keresés, szűrés, rendezés, bulk action, duplikáció-észlelés és gyűjtemények. | CONTENT | F7 | Search/bulk és dedup site scope alatt | Bulk action nem érint idegen site-ot |
| 54.8#4 Tartalomnaptár és státuszfolyam: idea/draft/review/ready/scheduled/publishing/published/failed. | CONTENT, PUBLISHING | F7 | Review/approval és queue lifecycle | Draft nem publikál approval nélkül |
| 54.8#5 Transcript, időbélyeg, speaker/fejezet, felirat, SRT/VTT, fordítás és export. | CONTENT, RESOURCE | F7 | Transcript és caption export provenance | Transcript nem egyenlő publikált tartalommal |
| 54.8#6 AI highlight/clip-javaslat forrás-időbélyeggel, indoklással és emberi választással. | AI_OPERATION, CONTENT | F10 | AI clip javaslat forrás-időbélyeggel | Emberi approval nélkül nem publikál |
| 54.8#7 Videóvágás: trim/split/crop/reframe/aspect ratio, felirat, hang, átmenet és brand overlay. | CONTENT, RESOURCE | F7 | Video export jog/codec/processing validation | Nincs export ha rights vagy render fail |
| 54.8#8 Thumbnail/grafika-sablon, variánsok, platformméretek és preview. | DESIGN_SYSTEM, RESOURCE | F2/F7 | Thumbnail variáns és platformméret preview | Preview nem helyettesíti export validálást |
| 54.8#9 Platformonkénti cím, leírás, hashtag, CTA, képarány és publikálási státusz. | CONTENT, PUBLISHING, INTEGRATION | F7 | Per-provider metadata és részleges publish eredmény | Egy platform sikere nem jelöl mindent sikeresnek |
| 54.8#10 API-publikálás ahol engedélyezett; egyébként export és kézi közzétételi útmutató. | PUBLISHING, INTEGRATION | F7 | Capability alapján API publish vagy manual fallback | Unsupported write API nem hívható |
| 54.8#11 Zene-/videójog, vendéghozzájárulás, lejárat, forrás és eltávolítási kérés. | CONTENT, RESOURCE | F7 | Rights/expiry/takedown audit és eltávolítás | Lejárt jogú média nem marad public |
| 54.8#12 Tartalomból weboldali feed, social poszt és analitika ugyanazon canonical rekord alapján. | CONTENT, ANALYTICS, PAGE | F7/F9 | Public feed ugyanazt a canonical content ID-t használja | Weboldal nem tart fenn második content store-t |

**Összesen:** 43/43 új soronkénti specifikáció; 54.1–54.8 kumulált **80/156**. A Twitch/OAuth korábbi kódbizonyítékok csak a jelenlegi baseline-t igazolják, a jövőbeli platformintegrációkat nem. OBS native companion és Extension külön F11 döntés; Content Studio és AI nem kap azonos publikálási jogosultságot. **Runtime/CI/provider acceptance: UNVERIFIED; teljes kapu NOT PASS.**

**Következő:** 54.9–54.12 (Community, Store/Support, Analytics, Automation), majd 54.13–54.16; ezután szemantikai hiányok és forráskód-gate priorizálása.

### 63.50.61. Második kör V: 54.9–54.12 közösség/kereskedelem/analitika/automatizáció tételes acceptance (2026-10-15)

**Forrás:** 54.9–54.12 checkbox, 5. domain, 49.9–49.14 UI-modulok, 63.38 fázis. A siker/tiltott eset *tesztterv*, nem runtime bizonyíték.

#### 54.9 — 9 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.9#1 Publikus fan regisztráció/bejelentkezés, profil, preferencia, adatletöltés/törlés. | FAN_IDENTITY | F8 | Fan identity export/delete működik | Admin identityvel nem vonható össze automatikusan |
| 54.9#2 Posztok, kommentek, reakciók, pollok, kérdések, beküldések és események. | COMMUNITY | F8 | Post/reaction/poll consent és ownership | Spam/idegen rekord mutation tiltott |
| 54.9#3 Követés, értesítés, jelvény, mérföldkő, kihívás és közösségi jutalom. | COMMUNITY, NOTIFICATION | F8 | Milestone/reward canonical eventből | Duplicate event nem dupláz jutalmat |
| 54.9#4 Tagsági szintek, exkluzív poszt/video/audio, member-only stream és archívum. | ENTITLEMENT, COMMUNITY | F8 | Member content entitlement valid | Expired/refunded member hozzáférés tiltott |
| 54.9#5 Discord szerver/csatorna/role mapping entitlement alapján. | ENTITLEMENT, INTEGRATION | F8 | Discord role sync idempotens | Revoke után régi role nem marad |
| 54.9#6 Moderációs queue, report, appeal, korlátozás/tiltás, spamvédelem és audit. | COMMUNITY, AUDIT | F8 | Report/appeal és audit trail | Moderator saját döntését nem rejtheti el |
| 54.9#7 AI moderációs javaslat, bizonytalanság és emberi felülvizsgálat. | AI_OPERATION, COMMUNITY | F10 | AI moderáció csak javaslat és confidence | AI automatikus végleges ban tiltott |
| 54.9#8 Public/member-only/private hozzáférés szerveroldali ellenőrzése. | COMMUNITY, ENTITLEMENT | F8 | Server-side visibility és permission | Privát rekord public URL-en sem olvasható |
| 54.9#9 Közösségi szabályzat, adatvédelmi és korhatár-/tartalmi szabályok. | COMMUNITY, FAN_IDENTITY | F8 | Policy/age/consent kontroll | Nem jogosult korosztály nem regisztrálható |

#### 54.10 — 12 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.10#1 Fizikai termék, merch, digitális termék, bundle, limited drop és preorder. | PRODUCT | F8 | Terméktípus, készlet és preorder lifecycle | Oversell és unsupported physical fulfilment tiltott |
| 54.10#2 Variánsok, SKU, ár/pénznem, készlet, kategória, kollekció, media és SEO. | PRODUCT, RESOURCE | F8 | SKU/price/currency/asset konzisztens | Ár nem keverhető több pénznem között |
| 54.10#3 Terméklista, termékoldal, keresés, kosár, checkout-integráció és rendelés-visszaigazolás. | PRODUCT, ORDER | F8 | Checkout/order confirmation providerrel | Sikertelen payment nem paid order |
| 54.10#4 Rendelésállapot, fizetés, teljesítés, tracking, cancel, refund és support. | ORDER, INTEGRATION | F8 | Refund/tracking állapot visszaigazolt | Chargeback nem marad fulfilled entitlement |
| 54.10#5 Kupon, ajándékkártya, promóció, kampány, bundle és lejárat. | PRODUCT, CAMPAIGN | F8/F9 | Coupon expiry és bundle eligibility | Lejárt coupon nem használható |
| 54.10#6 Biztonságos digitális delivery, entitlement és visszavonás refund/chargeback esetén. | ENTITLEMENT, ORDER | F8 | Signed delivery és refund revoke | Lejárt link nem tölthet le |
| 54.10#7 Egyszeri támogatás, visszatérő támogatás, célmérő és köszönőüzenet. | SUPPORT | F8 | Provider-confirmed tip/sub és goal | Spoofed support event nem emeli célt |
| 54.10#8 Tagsági előnyök, kedvezmények, termékdrop és tagság–Discord összekapcsolás. | ENTITLEMENT, SUPPORT | F8 | Membership és Discord sync | Expired tier nem kap kedvezményt |
| 54.10#9 Szponzorációs media kit, ajánlat, deliverable, határidő, kampánylink és riport. | SPONSORSHIP, CAMPAIGN | F9 | Deal/deliverable és riport nyomon követhető | Privát szerződés nem public |
| 54.10#10 Affiliate link/kód, jutalék és konverzió csak mérhető/jogszerű keretben. | CAMPAIGN, ANALYTICS | F9 | Affiliate attribution forrással | Consent nélküli tracking tiltott |
| 54.10#11 Bevételi források, platformdíjak, refundok és export; nem könyvelési/adótanácsadási helyettesítő. | ANALYTICS, ORDER, SUPPORT | F8/F9 | Refund/fees és export provenance | Riport nem állítja magát adóbevallásnak |
| 54.10#12 Fizetési, adózási, számlázási, fogyasztóvédelmi és GDPR-követelmények ellenőrzése. | ORDER, IDENTITY, AUDIT | F8 | Legal/tax/VAT/GDPR checklist dokumentált | Compliance nélkül checkout nem indul |

#### 54.11 — 7 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.11#1 Platformonkénti követő-/nézettség-/engagement-/streamidő-mutatók, ha elérhetők. | ANALYTICS, INTEGRATION | F9 | Provider metric timestamp és source | Unsupported metric nem nullának álcázva |
| 54.11#2 Tartalom- és csatorna-összehasonlítás, trendek, időszakok és célok. | ANALYTICS, CONTENT | F9 | Trend és időablak összehasonlítás | Eltérő mérési definíciók nem keverhetők |
| 54.11#3 Adatforrás, időbélyeg, frissesség, becsült/valós adat és hiányzó metrika jelzése. | ANALYTICS | F9 | Freshness/estimate/missing UI | Becsült adat nem tényként jelölve |
| 54.11#4 Webanalitika, UTM, konverzió, SEO és publikált oldalak teljesítménye. | ANALYTICS, SEO_PUBLICATION | F9 | Consent-aware web conversion | Consent nélküli tracking tiltott |
| 54.11#5 Thumbnail/cím/időzítés kísérletek és mérhető eredmények, ha elég adat áll rendelkezésre. | ANALYTICS, CAMPAIGN | F9 | Kísérlet cohort és confidence | Elégtelen minta nem nyertes |
| 54.11#6 Kampány-/szponzorriport, CSV/JSON export és időszakos jelentés. | ANALYTICS, SPONSORSHIP | F9 | Auditálható export/report | Cross-site riport adat nem szivárog |
| 54.11#7 AI-elemzés hipotézisekkel, forrással és bizonytalansággal; nem garantált növekedési ígéret. | AI_OPERATION, ANALYTICS | F10 | AI hipotézis forrás és uncertainty | Garantált növekedés állítás tiltott |

#### 54.12 — 7 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.12#1 Vizuális trigger → condition → action → branch modell. | AUTOMATION | F9 | Trigger-condition-action schema valid | Ciklikus workflow nem aktiválható |
| 54.12#2 Triggerek: stream, platformesemény, schedule, tartalom, rendelés, tagság, webhook, időzítés. | AUTOMATION, INTEGRATION | F9 | Webhook/event idempotens trigger | Replayed event nem dupláz actiont |
| 54.12#3 Akciók: értesítés, draft, címke, export, overlay/OBS parancs, publikálási előkészítés. | AUTOMATION, PUBLISHING, STREAM_TOOLS | F9 | Action csak canonical command API-n | Jogosulatlan publish/OBS command tiltott |
| 54.12#4 Sablonok, verziózás, aktiválás/leállítás és jogosultság. | AUTOMATION, IDENTITY | F9 | Verzió és scope aktiválás előtt ellenőrzött | Revoke után workflow nem fut tovább |
| 54.12#5 Dry-run, preview, jóváhagyás, idempotency, rate limit, retry, timeout és napló. | AUTOMATION, AUDIT | F9 | Dry-run és retry idempotency | Dry-run nem okoz külső mellékhatást |
| 54.12#6 Sikertelen ág, karantén, értesítés, kézi helyreállítás és rollback/kompenzáció. | AUTOMATION, NOTIFICATION | F9 | Quarantine és compensation naplózott | Infinite retry és néma hiba tiltott |
| 54.12#7 AI-ból létrehozott workflow először draft/szimuláció; csak jóváhagyás után éles. | AI_OPERATION, AUTOMATION | F10 | AI workflow draft és human approval | AI nem aktivál éles workflowt magától |

**Összesen:** 35/35 új specifikációs sor; kumulált **115/156**. Külön trust boundary: FAN_IDENTITY ≠ creator IDENTITY; ORDER ≠ SaaS BILLING_PLAN; ANALYTICS csak derived metric; AUTOMATION nem ír közvetlen idegen domain rekordot. Payment/tax/legal és AI provider/runtime acceptance **OPEN**.

**Következő:** 54.13–54.16 soronkénti acceptance, utána 156 sor konzisztencia- és hiánylista; teljes tervkapu NOT PASS.

### 63.50.62. Második kör VI: 54.13–54.16 AI/localization/security/developer tételes acceptance (2026-10-15)

**Forrás:** 54.13–54.16 checklist, 5. domain, 49.15/49.19/49.20–22 modul, 63.38 roadmap. Minden acceptance tervezett és **nem** runtime PASS.

#### 54.13 — 12 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.13#1 AI Control Center: provider/model, költségkeret, kvóta, retention, adatforrás és stop switch. | AI_OPERATION | F10 | Provider/quota/stop switch auditálható | Budget limit után nincs AI call |
| 54.13#2 Projekt-/brandkontextus jogosultsággal és megtekinthető forrásokkal. | AI_OPERATION, IDENTITY | F10 | Permission-aware context provenance | Cross-site context leak tiltott |
| 54.13#3 Website Designer: oldal/komponens/dizájn/responsive/SEO/accessibility javaslat. | AI_OPERATION, PAGE, DESIGN_SYSTEM | F10 | Javaslat diff/preview az Editorban | AI nem publikál magától |
| 54.13#4 Live Coach: opt-in technikai jelzések, pillanatjelölés és stream-/chat-összegzés. | AI_OPERATION, LIVE_STATE | F10 | Opt-in és forrás-időbélyeg | Consent nélkül nincs stream/chat ingest |
| 54.13#5 Content Producer: transcript, clip, felirat, fordítás, thumbnail, cím és platformvariáns. | AI_OPERATION, CONTENT | F10 | Transcript/clip draft provenance | Nem publikál rights approval nélkül |
| 54.13#6 Community Assistant: FAQ, összegzés, moderációs javaslat és tagsági művelet-előkészítés. | AI_OPERATION, COMMUNITY | F10 | FAQ/moderation javaslat és emberi review | AI nem bannol automatikusan |
| 54.13#7 Business Analyst: tartalom/kampány elemzés, hipotézis, mérhető teszt. | AI_OPERATION, ANALYTICS | F10 | Hipotézis forrás és confidence | Bizonyítatlan növekedési ígéret tiltott |
| 54.13#8 Automation Builder: természetes nyelvből workflow-draft, szimuláció és diff. | AI_OPERATION, AUTOMATION | F10 | Workflow draft/simulation/diff | AI nem aktivál éles workflowt |
| 54.13#9 Kép-/grafika-/hang-/videógenerálás megfelelő külső modellel/szolgáltatóval, licenc- és költségkorláttal. | AI_OPERATION, RESOURCE | F10 | Generation license és quota megőrzött | Jog nélküli generált asset nem public |
| 54.13#10 AI-művelet domain API-n át; kockázati szint, preview, jóváhagyás, napló és visszaállítás. | AI_OPERATION, AUDIT | F10 | Domain command approval/rollback audit | AI közvetlen D1 write tiltott |
| 54.13#11 Generált tartalom jelölése, forrás és bizonytalanság, felhasználói visszajelzés. | AI_OPERATION, CONTENT | F10 | AI output provenance és user feedback | Becsült adat nem állítható biztosnak |
| 54.13#12 Manuális, AI nélküli út minden alapvető termékfolyamathoz. | AI_OPERATION + minden owner | F10 | Manual fallback végigjárható | AI outage nem blokkol alapfunkciót |

#### 54.14 — 8 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.14#1 Admin és publikus web külön nyelvi beállítással. | LOCALIZATION, SETTINGS | F0/F1 | Admin és public locale független | Admin nyelvváltás nem ír public tartalmat |
| 54.14#2 Magyar elsődleges nyelv, további nyelvek fokozatos bevezetése. | LOCALIZATION | F0/F1 | HU fallback és locale preference | Hiányzó fordítás nem blank UI |
| 54.14#3 Locale-onkénti oldal-/CMS-tartalom, menü, média, alt text, SEO és Open Graph. | LOCALIZATION, PAGE, RESOURCE, SEO_PUBLICATION | F3 | Locale-specific content és SEO preview | Más nyelv draftja nem public |
| 54.14#4 Lokalizált slug/URL, hreflang/canonical szabályok és nyelvi fallback. | LOCALIZATION, SEO_PUBLICATION | F3 | hreflang/canonical/slug valid | Cross-locale redirect loop tiltott |
| 54.14#5 Dátum/idő/pénznem/szám lokalizáció, időzóna és nyári időszámítás. | LOCALIZATION, SCHEDULE | F0/F3 | Timezone/DST és pénznem helyes | DST ambiguity nem ír hibás időpontot |
| 54.14#6 RTL layout, billentyűzet, font fallback és hosszabb fordítások tesztje. | LOCALIZATION, DESIGN_SYSTEM | F3 | RTL és hosszú szöveg responsive | RTL fókuszsorrend nem hibás |
| 54.14#7 Fordítási memória/szószedet és AI-fordítás emberi jóváhagyással. | LOCALIZATION, AI_OPERATION | F3/F10 | Glossary és human approval | AI fordítás nem implicit publish |
| 54.14#8 Nyelvváltó, automatikus nyelvajánlás és felhasználói választás megőrzése. | LOCALIZATION, SETTINGS | F3 | Language switch preference perzisztens | Automatikus ajánlás nem írja felül választást |

#### 54.15 — 13 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.15#1 Profil, site/workspace, locale, timezone, dátum/pénznem és preferenciák. | IDENTITY, SITE, WORKSPACE, SETTINGS | F0/F1/F4 | Scoped settings read/write | Más site preference nem írható |
| 54.15#2 Szerepek: owner/admin/editor/moderator/analyst/commerce és modulonkénti engedély. | IDENTITY, WORKSPACE | F1/F4 | Role permission matrix szerveroldalon | UI hidden ≠ authorization |
| 54.15#3 Szerveroldali authorization, site/tenant izoláció és minimális jogosultság. | IDENTITY, SITE | F0–F11 | Tenant ownership minden API-n | Cross-tenant read/write tiltott |
| 54.15#4 Session, 2FA/SSO később, secret rotation, rate limit és gyanús aktivitás. | IDENTITY, AUDIT | F0/F4/F11 | Session revoke és MFA recovery | Lejárt session nem módosíthat |
| 54.15#5 Titok/token/payment adat redakció; titkosított token storage. | INTEGRATION, IDENTITY | F0–F11 | Secret redaction és rotation | Token plaintext logban tiltott |
| 54.15#6 Consent, cookie/privacy, retention, export/delete és adatfeldolgozók. | SETTINGS, FAN_IDENTITY | F4/F8 | Consent/retention/export/delete | Törlés után derived index nem őriz PII-t |
| 54.15#7 Backup, restore próba, verziózott mentés, import/export és disaster recovery. | BACKUP, AUDIT | F0 minimum/F11 | Restore drill és snapshot integrity | Hibás backup nem jelölhető sikeresnek |
| 54.15#8 Health, job queue, webhook, API-quota, error log és audit log. | AUDIT, INTEGRATION, AUTOMATION | F0–F11 | Health/quota/log diagnosztika | PII/token log leak tiltott |
| 54.15#9 Idempotencia, retry, timeout, cache invalidation, stale-data és partial-failure kezelés. | AUTOMATION, INTEGRATION | F0–F11 | Retry idempotency/cache freshness | Duplicate webhook nem dupla side effect |
| 54.15#10 Undo/redo, revision diff, restore és törlés előtti függőségi vizsgálat. | PAGE, REVISION, RESOURCE | F0/F2 | Undo/restore és usage warning | Restore nem implicit publish |
| 54.15#11 WCAG 2.2 AA cél, reduced motion, screen reader, kontraszt, fókusz és touch target. | DESIGN_SYSTEM, PAGE | F0–F11 | WCAG és reduced motion teszt | Keyboard trap és inaccessible control tiltott |
| 54.15#12 Mobil/tablet/desktop, gyenge hálózat, offline-jelzés és adatvesztés elleni védelem. | PAGE, IDENTITY | F0–F11 | Mobile/slow network save recovery | Offline után silent overwrite tiltott |
| 54.15#13 Tesztek: domain, integration, authorization, migration, UI, accessibility, responsive, E2E és smoke. | AUDIT + minden owner | F0–F11 | CI/E2E/smoke evidence per release | Teszt nélküli PASS tiltott |

#### 54.16 — 8 tétel

| Checklist sor | Domain owner | Fázis | Pozitív acceptance (terv) | Negatív acceptance (terv) |
| --- | --- | --- | --- | --- |
| 54.16#1 Dokumentált API, webhook registry, API-key kezelés, tesztelő és sandbox. | DEVELOPER_API | F11 | API keys scoped revoke és sandbox | Revoked key nem működik |
| 54.16#2 Extension/widget/overlay manifest, schema, permission, verzió és kompatibilitás. | EXTENSION, STREAM_TOOLS | F11 | Manifest permission és compatibility | Unsigned/unsafe plugin nem települ |
| 54.16#3 Eredet/licenc/aláírás, sandbox, felülvizsgálat, frissítés, eltávolítás és visszavonás. | EXTENSION, AUDIT | F11 | Provenance/license/rollback | Visszavont extension nem fut |
| 54.16#4 Template/component/overlay/workflow marketplace későbbi fázisban. | EXTENSION, DESIGN_SYSTEM | F11 | Marketplace moderation és license | Unreviewed paid asset nem listázott |
| 54.16#5 Több site/workspace, aktív workspace választó, csapatmeghívás és szerepek. | WORKSPACE, IDENTITY | F4 alap/F11 | Invite/role/site switch | Cross-site membership escalation tiltott |
| 54.16#6 Agency/studio mód, ügyfélhozzáférés, közös sablonok és jóváhagyás. | WORKSPACE, DESIGN_SYSTEM | F11 | Agency approval és shared template scope | Ügyfél privát asset nem látszik másiknak |
| 54.16#7 Későbbi SaaS billing, csomag, használati limit, számla, lemondás és adat-export. | BILLING_PLAN, WORKSPACE | F11 | Plan quota/cancel/export lifecycle | SaaS billing nem Store ORDER |
| 54.16#8 Tenant izoláció, migráció, skálázás, adatrezidencia és költségfelügyelet. | WORKSPACE, AUDIT, BACKUP | F11 | Tenant isolation, restore, residency audit | Cross-tenant backup restore tiltott |

**Összesen:** 41/41 új sor; 54.1–54.16 **156/156 sor** most tételes domain, F-fázis, pozitív és negatív *specifikációs* acceptance mezővel szerepel a 63.50.59–62 fejezetben. A 63.50.39–56 ID-routing külön megőrzött; a 63.12–15 eredeti tételes megfeleltetés továbbra is irányadó a meglévő ID-k szempontjából. A forráskód, test, browser, CI, éles runtime bizonyíték **nem** keletkezett ettől a dokumentálástól. A 271 történeti H-ID szemantikai auditja és 00/A / 00.9.6.B forrás **OPEN**.

**Következő audit:** a 156 tétel között *bizonyítható szemantikai gap*, duplikált owner, elcsúszott F-fázis és a HIGH publish/slug kódblokk konkrét forráskód/test gate ellenőrzése. A teljes terv továbbra is IN PROGRESS / NOT PASS; a fejlesztés fagyasztott.

### 63.50.63. Második kör VII: publikálási állapotgép és HTTP/SEO szerződés — forráskód-újraellenőrzés (2026-10-15)

**Auditált HEAD:** `290fa1a823d8513f7100829b2f128436e7a5274e`. **Konkrét forrás:** `src/routes/admin/pages.ts`, `src/routes/admin/editor.ts`, `src/routes/public/pages.ts`, `src/index.ts`, `src/core/editor-validation.ts`, `src/core/page-model.ts`, `public/visual-page.html`, `public/assets/page-renderer.js`, `migrations/0005_canonical_page_storage.sql`, `migrations/0017_site_ownership_not_null.sql`. **Bizonyítékszint:** STATIC SOURCE VERIFIED; nincs helyi/CI/browser/D1 runtime teszt, sem új migráció vagy éles módosítás.

| Azonosító | Forrásból ellenőrzött tény | Következmény / negatív journey | Kapu |
| --- | --- | --- | --- |
| PUB-01 HIGH | `pages.ts` PATCH `contentChanged && existing.is_published` esetén `published_content_json` és `published_revision_id` értékét azonnal átírja; nincs `validatePublishDocument` és explicit publish action | Publikált v1 + mentetlen/draft v2 + CMS cím/slug módosítás → v2 váratlanul élesbe kerülhet | BLOCK |
| PUB-02 HIGH | `pages.ts` POST `isPublished: true` esetén azonnal publikálja az initial JSON-t; csak `canonical()` shape-check van, `validatePublishDocument()` nincs | Új, strukturálisan hibás dokumentum validált publish gate nélkül kerülhet publikus snapshotba | BLOCK |
| PUB-03 HIGH | `pages.slug/title/description` közös draft/public mező; `publicPagesRoute.mapPage()` ezekből képezi a publikus metaadatokat, nem a publikált snapshot metaadataiból | Draft slug/title módosítás publikált URL-t és címkéket változtathat explicit publish nélkül | BLOCK |
| PUB-04 HIGH | `src/index.ts` minden `/p/<slug>` kérést `visual-page.html` assetre továbbít, az API 404 csak később a böngésző JS-ben látható | Nem létező/unpublished slug HTTP 200 shellt adhat; kereső/crawler státusz hibás | BLOCK |
| PUB-05 HIGH | `visual-page.html` fix `robots=index,follow`, statikus title; `page-renderer.js` a title-t kliensoldalon állítja; `preview=1` azonos shellt kap | Preview/crawler noindex és server-visible canonical/OG/description nincs bizonyítva | BLOCK |
| PUB-06 MEDIUM | `adminEditorRoute` POST csak `publish=true` esetén futtatja a `validatePublishDocument` ellenőrzést, de `pages.ts` POST/PATCH nem ugyanazt a kaput használja | Több publish belépési út eltérő validációval; közös domain command hiányzik | BLOCK |
| PUB-07 MEDIUM | `adminEditorRoute` POST/PATCH revision `expectedVersion` opcionális; hiányában `null` és konfliktusvédelem kimarad | Két editor kliens felülírhatja egymást, ha nem ad expectedVersion-t | OPEN |
| PUB-08 MEDIUM | `pages.ts` DELETE fizikai `DELETE FROM pages` + sorrend-átrendezés; nincs archív/tombstone/redirect/dependency check | Publikált oldal törlése megtöri hivatkozásokat és FK cascade revision historyt | OPEN |
| PUB-09 MEDIUM | `0017` `pages.slug TEXT NOT NULL UNIQUE` globális; `site_id` külön FK, de nincs `UNIQUE(site_id,slug)` | Több-site esetén azonos slug ütközik; tenant scope követelménnyel eltérés | OPEN |
| PUB-10 MEDIUM | `publicPagesRoute` preview editor szerephez kötött, de a preview API válaszán és HTML shellen nincs önálló no-store/noindex/vary szerződés igazolva | Preview cache/index leak elleni HTTP acceptance hiányzik | OPEN |

**Kötelező kanonikus döntés F0 implementáció előtt (nem eldöntött migráció):**
1. **Egyetlen publication domain command:** saveDraft, publishValidatedRevision, unpublish, rollbackToDraft, archive; az Admin Pages és Editor ugyanazt hívja. `isPublished=true` CREATE sem kerülheti meg a validációt.
2. **Published snapshot nem változhat draft mentéskor:** title, description, slug és SEO mezők draft/published elválasztása, publikált revision metadata alapján történő public read; published URL reservation és collision policy.
3. **Migrációs terv:** előbb read-only D1 schema/adat előellenőrzés (published revision linkek, JSON canonical, slug uniqueness, site ownership), backup/restore próba; additív schema/backfill és dual-read kompatibilitás; FK ciklus miatt migration sorrend és rollback terv; utána route átállítás. **Nincs most DB write.**
4. **HTTP/SEO:** szerveroldali slug feloldás az asset shell előtt, valódi 404/410, 301/308 redirect vagy explicit policy; preview 401/403/noindex/no-store; publikus 200 csak valóban publikált rekordnál; canonical, title, description, OG, sitemap, robots és cache invalidation publikált snapshotból.
5. **Konkurencia:** kötelező expectedVersion vagy szerveroldali CAS, külön draft/published revision id; race/duplicate slug/permission/site-scope negatív tesztek.
6. **Törlés:** archive/unpublish/redirect/dependency map; hard delete csak külön jóváhagyott recovery/retention szabállyal.

**Minimális regressziós tesztmátrix (mind UNRUN):**

| Teszt | Kiindulás / akció | Kötelező eredmény |
| --- | --- | --- |
| T01 | v1 published; v2 draft save | Public v1, editor v2 |
| T02 | v1 published; v2 draft; CMS title PATCH | Public v1 title és content; preview v2 |
| T03 | v1 published; CMS slug PATCH | Régi published URL v1, új draft URL nem public |
| T04 | Invalid Page Model + admin pages create `isPublished=true` | 4xx, nincs public snapshot |
| T05 | Invalid draft + Admin Pages PATCH published | 4xx vagy draft-only, semmi implicit publish |
| T06 | Explicit publish valid v2 | Public v2, snapshot és published revision együtt |
| T07 | Explicit publish invalid schedule/hierarchy | 409, published v1 megmarad |
| T08 | Editor rollback v1 | Draft v1, public v2 marad amíg explicit publish |
| T09 | Unpublish + `/p/slug` GET | Valódi HTTP 404/410 és noindex policy |
| T10 | Nem létező slug, malformed URL, legacy redirect | HTTP 404/redirect, nem 200 shell |
| T11 | Preview authenticated/unauthenticated, cache, robots | Csak editor 200; más 401/403; no-store/noindex |
| T12 | Concurrent PATCH/POST stale revision | 409, nincs lost update |
| T13 | Két site azonos slug; idegen site request | Site scoped slug; idegen rekord 404/403 |
| T14 | Published page archive/delete linked nav/assets | Dependency warning és recovery; nincs silent cascade |
| T15 | Public page SEO/crawler fetch és sitemap | SSR-visible metadata/canonical/OG, unpublished kizárva |

**Különbség a 63.50.46-hoz képest:** PUB-02 (CREATE bypass), PUB-07 (opcionális CAS), PUB-08 (hard delete) és PUB-09 (globális slug unique) új, konkrétan ellenőrzött forráskód-határok; PUB-01/03/04/05 megerősített korábbi release blokkolók. Semmi nem lett implementáltnak jelölve. **F0 CODE/PUBLICATION GATE: FAIL / IMPLEMENTATION FROZEN.**

### 63.50.64. Második kör VIII: site, szerep, adatforrás és domain-határ — forráskód-eltérésjegyzék (2026-10-15)

**Forrás:** `src/core/site-context.ts`, `src/core/auth/require-auth.ts`, `src/routes/admin/settings.ts`, `src/routes/public/site-settings.ts`, `src/routes/admin/pages.ts`, `src/routes/public/pages.ts`, `migrations/0001_initial_schema.sql`, `migrations/0017_site_ownership_not_null.sql`, valamint 5. és 63.20 domain/owner tábla. A jövőbeli F11 workspace nem követel teljes SaaS megvalósítást F0-ban; viszont a ma aktív műveletek scope-jának helyesnek kell lennie.

| Azonosító | Tény | Tervbeli következmény | Kapu |
| --- | --- | --- | --- |
| OWN-01 | `getCanonicalSiteContext()` állandó `site-default`-ot ad; nincs request/session alapú site választás | Egy site jelenleg tudatos baseline; több-site switching és tenant isolation nem igazolt | OPEN F4/F11 |
| OWN-02 | `require-auth.ts` user role csak `admin/editor/viewer`; nincs owner/moderator/analyst/commerce vagy per-site membership | 54.15#2 célmodell későbbi; nem szabad F0 késznek állítani | OPEN F4/F11 |
| OWN-03 | `site_settings` kulcs `site` globális, `adminSettingsRoute` és `publicSiteSettingsRoute` ugyanazt olvassa | Site scope migráció szükséges multi-site előtt, public-safe projection maradjon | OPEN F1/F11 |
| OWN-04 | `0017` pages/media/schedule/social/twitch site_id NOT NULL FK; több aktuális pages lekérdezés `WHERE site_id=?` | Strukturális ownership baseline **létezik**, nem állítható, hogy nincs site_id | SOURCE VERIFIED BASELINE |
| OWN-05 | `pages.ts` `editor_revisions` max(version) lekérdezése csak `page_id` szerint történik, előtte oldal site-scope ellenőrzött; `pages.ts` reorder neighbor `site_id` szerint | Nem bizonyított cross-site adatolvasás e konkrét útvonalon; konkurencia és reordering invariáns teszt szükséges | TEST OPEN |
| OWN-06 | `pages.ts` `UPDATE pages SET sort_order=? WHERE id=?` reorder második statementje nem tartalmaz `site_id` feltételt | A page id globális PK és előzetes site-scope ellenőrzés mellett közvetlen exploit nem bizonyított; defense-in-depth site predicate javasolt | HARDENING OPEN |
| OWN-07 | `publicPagesRoute` draft preview authenticated editor; public normál ág published snapshotot olvas | A preview role baseline létezik; noindex/cache és publikált metaadat eltérés külön HIGH hiba | PARTIAL |
| OWN-08 | `0017` slug globális UNIQUE, `site_id` külön oszlop | F11 multi-site URL namespace döntés kell: site-domain+slug, unique(site_id,slug), redirect/canonical | OPEN |

**Keresztmetszeti döntési sorrend:** (a) F0 single-site publikálás helyessége, (b) F1 site-scoped settings és permission contract, (c) F4 team/membership alap, (d) F11 több-site workspace/SaaS; sem `site-default` eltávolítása, sem teljes role modell előrehozása nem megengedett a fogyasztók és migráció auditja nélkül.

**Külön tesztcsomag:** `owner/admin/editor/viewer` jelenlegi szerepek valós képességét a meglévő `admin/editor/viewer` baseline szerint kell tesztelni; jövőbeli szerepek **PLANNED**. Site ownership negatív route tesztek, settings public projection, OAuth token redaction, asset reference, revision site-scope, slug collision, multi-tab concurrency; a tesztek **UNRUN**.

**Jelen állapot:** a 38 domain és 22 UI-modul szerkezete megvan a tervben, de ez nem 38 implementált domain. A 156 acceptance tervkártya nem bizonyít működő terméket. A 271 történeti tétel strukturális megfeleltetése sem zárja le a hiányzó eredeti forrásokat. **SEMANTIC/EVIDENCE GATE: NOT PASS.**

### 63.50.65. Második kör IX: Public renderer, Admin navigáció és valódi fogyasztók forráskód-auditja (2026-10-15)

**Auditált fájlok:** `src/index.ts`, `public/visual-page.html`, `public/assets/page-renderer.js`, `public/assets/site.js`, `public/admin-home.html`, `src/routes/public/pages.ts`. **Bizonyítékszint: SOURCE VERIFIED; browser/network/performance tests UNRUN.**

| ID | Kódbeli tény | Hatás / 54.x megfeleltetés | Kötelező lezárás |
| --- | --- | --- | --- |
| RND-01 | `page-renderer.js` `sanci` blokk-listája Twitch/YouTube/TikTok/Discord/VOD/support/followers/stb. típusokat placeholder szöveggel jelenít meg; valós provider fetch csak a `schedule` blokkhoz látható | 54.2#7 dinamikus SANCI blokkok: a típus jelenléte **nem** jelent működő domain-adatkapcsolatot | DYN-001–008 blokkonként owner API, permission, loading/stale/error, public/preview parity |
| RND-02 | `page-renderer.js` `nodeHtml()` a `heading/text/richtext/button/link/image/divider/spacer/schedule` típusokra speciális renderert ad; a többi fallback `section` | 54.2#6: a teljes elemkönyvtár render-szemantikája nem bizonyított | Node registry → Inspector → serializer → public renderer → keyboard/ARIA teszt minden támogatott típusra |
| RND-03 | `page-renderer.js` `safeUrl` http/https protokollt enged; HTML text escape látható; `style()` CSS értékeket stringből épít | Van URL/HTML safety baseline, de style allowlist/CSS sanitization és browser CSP nincs itt bizonyítva | Security teszt: style injection, invalid CSS, URL, embeds, asset access |
| RND-04 | `page-renderer.js` schedule blokk `/api/public/schedule` projectiont fogyaszt; cache csak oldalbetöltésen belüli Map | Pozitív: schedule nem második Page Model event store; negatív: provider/network failure a `loadPage` teljes try/catch ágába eshet | Schedule hiba esetén izolált block error/stale/empty, ne váljon teljes oldal 404-vé |
| RND-05 | `loadPage()` közös `catch` ága `Az oldal nem található` és 404 üzenetet rajzol API-hibánál, invalid dokumentumnál és schedule fetch hibánál is | Valós 404 és átmeneti 5xx/timeout összekeveredik, a HTTP shell ettől nem változik | 404 vs 401/403 vs 5xx vs provider partial error külön HTTP és UI állapot |
| RND-06 | `visual-page.html` head statikus `index,follow`, nincs szerveroldali per-page title/OG/canonical; `site.js` és `page-renderer.js` kliens fetch-et használ | SEO-001–005 és 54.2#12 crawler gate FAIL/UNVERIFIED; ismételt PUB-04/05 | Server-resolved published snapshot meta és HTTP status, sitemap/robots/redirect |
| NAV-01 | `src/index.ts` autentikált `/admin` → `admin-home.html`, `/admin/editor` → Editor v2; legacy `/admin/home` redirect `/admin` | Pozitív: egyetlen fő Admin URL és egyetlen canonical Editor útvonal létezik | A route-szintű konszolidációt meg kell őrizni, nem szabad második Editort létrehozni |
| NAV-02 | `admin-home.html` több különálló „Adásrend”, „Oldalak”, „Szerkesztés” navigációs elemének célja ugyanaz a `/admin/editor` | 54.1#1, 54.6: Admin UX túlterheli az Editort és elrejti a domain funkciók saját belépési pontját | 49.1–49.22 menü/route map: valódi modul URL vagy egyértelmű `PLANNED`/disabled; ne legyen hamis működő link |
| NAV-03 | `admin-home.html` `Promise.allSettled`-del session/settings/pages/schedule/Twitch connection adatot olvas | Pozitív: dashboard több canonical API-t aggregál; nincs bizonyíték önálló domain write-ra | Per-widget partial failure, stale és permission-aware empty; valódi E2E |
| NAV-04 | `src/index.ts` a `/admin/editor` HTML route-nál bejelentkezést vizsgál, az API route saját `editor` minimum role-t ellenőriz | HTML viewer is kaphat Editor shellt, de API mutation tiltott; UI access és backend RBAC nem azonos | Viewer 403/readonly UX policy; API marad authoritative |
| NAV-05 | `public/assets/site.js` a publikus menüt `/api/public/pages` lista alapján építi | Jelenleg published-only projection, de draft metadata/slug PUB-03 hibája miatt navigáció is érintett | Public menu published slug/visibility/ordering snapshot alapján; redirect és invalid link teszt |

**Szemantikai hiányok külön kezelése:** `RND-01` nem jelenti, hogy a tervezett live/social/commerce blokkokat el kell hagyni; `NAV-02` nem jogosít fel a legacy kód törlésére; `RND-04` nem jogosít második schedule store létrehozására. A 54.2 és 54.6 képességmegőrzés marad, a domain owner pedig az 5. fejezet szerinti.

**E2E acceptance, nem lefuttatott:** (a) home, published slug, unpublished slug, unknown slug valódi HTTP status; (b) schedule API 500 mellett a többi blokk tovább működik; (c) role=viewer admin shell/Editor UI és API eltérő hozzáférése dokumentált; (d) minden Admin menüpont valós modulba vagy egyértelmű PLANNED állapotba vezet; (e) Page Model és domainblokkok a canonical API-n keresztül, cross-site szivárgás nélkül jelennek meg; (f) HTML head crawler snapshot és WCAG/keyboard/mobil. **RUNTIME UNVERIFIED.**

### 63.50.66. Második kör X: priorizált döntésjegyzék, kapusorrend és a review előfeltétele (2026-10-15)

A 63.50.59–62 szerinti 156/156 pozitív-negatív *specifikáció* elkészült; a 63.50.63–65 **nem** 156/156 kódtesztet jelent. A meglevő 396 capability ID és 271 történeti H-sor megőrzendő.

| Prioritás | Szemantikai vagy kódblokkoló | Kapcsolódó stabil képesség | Lezárási bizonyíték |
| --- | --- | --- | --- |
| P0 | Implicit publish PATCH és CREATE validáció-bypass; draft/published slug/metadata; HTTP 200 shell/SEO | WEB-004–008, WEB-012–013, EDT-032–034, SEO-001–005 | 63.50.63 T01–T15 regresszió, migration+rollback, crawler/browser |
| P0 | A published/draft/revision/site URL lifecycle döntése és kompatibilis D1 migration | PAGE, REVISION, SEO_PUBLICATION, SITE | Read-only schema/data preflight, additív migration, restore drill, public snapshot parity |
| P1 | Oldal archív/törlés, dependency/redirect, revision conflict CAS | WEB-001–003, WEB-007–008, RES-008–009 | DELETE/rollback/race/linked menu negative E2E |
| P1 | Domain owner és több-site settings/role scope | SET-001–004, SEC-001–004, TEAM-001–005 | Permission matrix, site scoped settings, cross-site negative tests |
| P1 | Public renderer blokk-paritás és partial failure | EDT-016–020, DYN-001–008, SCH-010–011 | Block registry contract, provider fallback, accessibility, preview/public |
| P1 | Admin főmodulok valódi navigációja, egy Editor, canonical domain CRUD | ADM-001–013, WEB, SCH, CNT, INT | 22-module route matrix, planned vs live state, user journey |
| P2 | Design/resource/template master-instance és safe asset deletion | DSN-001–018, RES-001–016 | F2 lifecycle/version/usage/rollback, reuse decision |
| P2 | Integrációk/OBS/AI provider scope és trust boundary | INT, OBS, AUT, AI, MKT | Provider capability, permissions, human approval, retry/idempotency |
| BLOCKING HISTORY | Hiányzó 00/A és 00.9.6.B eredeti forrás és H19–H34 271 sor szemantikai igazolása | 63.52–63.53 | Visszanyert forrás vagy indokolt UNRECOVERED, kétirányú szemantikai audit |
| USER REVIEW | A 396 ID és 22 főmodul felhasználói közös áttekintése | 24., 49., 54. | Hiány/bővítés/deduplikáció/fázis döntés feljegyezve |

**Végrehajtási kapuk:** (1) a fenti forráskód-szemantikai hiányok és a történeti megőrzés ellenőrzése dokumentálva; (2) 396 ID/22 modul közös termék-review; (3) csak ezután F0 munkapont kártya 26.1 szerinti 17 mezővel, REUSE/ADAPT/BUILD döntéssel; (4) teszt/CI/browser/live PASS nélkül nincs release PASS. A jelenlegi kódhibák **nem** javultak meg az auditbejegyzéstől. A kapu **IN PROGRESS / NOT PASS**.

**Következő tényleges feladat:** 00/A / 00.9.6.B célzott Git-history és archív forrásbizonyíték-vizsgálat; 63.52–53 H19–H34 mintavétel helyett szemantikai csoportos ellenőrzés, a 63.50.63–65 forráskódhibák nyitva tartásával. Ha eredeti forrás nincs, a tény `UNRECOVERED`, nem kitalált tartalom és nem PASS.

### 63.50.67. Történeti forráscélzás: 00/A, 00.9.6.B és H19–H34 ellenőrzési határ (2026-10-15)

**Ellenőrzött, konkrét GitHub források:**
- `aedb2ea:docs/MASTER-DEVELOPMENT-PLAN.md` első 160 sora: a korabeli MASTER-2.0 `# 00 — A MASTER TERV SZABÁLYAI` címet és `00.1–00.7` alapelveket tartalmaz; a vizsgált tartományban **nem** szerepel `00/A` vagy `00.9.6.B`. A 160 soros mintavétel **nem bizonyítja**, hogy a teljes régi fájlban nincs ilyen rész.
- `aedb2ea:docs/MASTER-HISTORICAL-19-34-AUDIT.txt` és `aedb2ea:docs/MASTER-HISTORICAL-19-34-SOURCE-EXTRACT.txt`: a megadott commit/path párok GitHub Contents API-ja 404-et adott. Ez csak azt bizonyítja, hogy **ezeken a pontos útvonalakon és commiton** a fájl nem olvasható, nem azt, hogy soha nem létezett vagy más branch/stash/commit alatt nincs meg.
- `v2/foundation:docs/MASTER-DEVELOPMENT-PLAN.md`: 404. A jelenlegi egyetlen aktív dokumentum `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`; a régi név 404-je nem auditbizonyíték a történeti funkciók hiányára.

**Történeti forrásminőség / státusz:** `00/A = UNRECOVERED / OPEN`; `00.9.6.B = UNRECOVERED / OPEN`; `H19–H34 = 271/271 strukturális nyomkövetés a 63.52–63.53-ban, egyedi szemantikai PASS NINCS`. A régi MASTER-2.0 00.1–00.7 alapelvei között bizonyított az egy aktív pont, teljes fejlesztési tesztciklus, funkcióbővítés, preset/manuális közös command pipeline, külső működő megoldások benchmarkja és egyetlen editor architektúra. Ezeket a jelenlegi 2., 5., 24., 41., 49., 54. és 63. fejezet szabályai mellett meg kell őrizni, de a régi dokumentum nem válhat ismét aktuális MASTER-ré.

**Következő visszakeresési sorrend:** (1) Git tree/history pontos régi path-rename és deleted file audit, (2) PR-ek és kommentek 00/A / 00.9.6.B hivatkozásokra, (3) helyi untracked/stash kivonatok csak a felhasználó által ténylegesen elérhetővé tett fájlok alapján, (4) 271 H-sorhoz source excerpt → current ID → domain → F-phase → acceptance → retained/superseded döntés. A hiányzó B-fejezetet C-ből vagy emlékezetből pótolni tilos.

**GATE:** történeti forrás teljesség **NOT PASS**; nem állítható a végső funkciólista közös felülvizsgálatra késznek pusztán a 156 checklist-sor dokumentálása miatt. **NEXT:** történeti forráshelyek és H19–H34 szemantikai sorok mélyvizsgálata; a P0 publikálási kódhiba továbbra is release blocker.

### 63.50.68. Nagy fájl biztonságos olvasása és 00/A.2.2 részleges forrás-visszanyerés (2026-10-15)

**Új bizonyíték / végrehajtási megoldás:** a kanonikus MASTER már ~1 MB; `fetch_file` a HEAD `b2ef7064bfd8` alatt érvényes blob SHA mellett **üres `content`** választ adott. Ez **nem üres fájl**: ugyanaz a blob `fetch_blob(blob_sha)` művelettel **992220 karakterként** sikeresen visszaolvasható. **Kötelező jövőbeli írási protokoll:** GitHub HEAD → `fetch_file` a blob SHA-hoz → ha tartalom üres, `fetch_blob` → első sor + méret + pontos egyedi insertion marker ellenőrzése → kizárólag egyetlen MASTER-be módosítás → `update_file` az eredeti blob SHA-val → új HEAD/blob visszaellenőrzés. Üres `fetch_file.content` tartalmat **soha nem szabad** visszaírni. Nem készül második aktív terv.

**Visszanyert hiteles archív részlet:** `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` tartalmazza a `## HISTORICAL / QUEUED — 00/A.2.2 — F — SCHEDULE CRUD + INSPECTOR / DOMAIN-DRIVEN EDITOR — DEFINITION OF DONE` című szakaszt. A szakasz 7 megőrzött architekturális szabálya: (1) csak `public/editor-v2/` canonical Editor, (2) Schedule canonical D1 domain, (3) Page Model/presentation és Schedule domain külön, (4) Inspector nem külön property/state engine, (5) legacy Schedule/Admin/Editor nem aktiválható újra, (6) site-scoped mutation/E4 ownership, (7) közös command/history/validation/persistence/audit pipeline. Az archív [x] jelölések **történeti állítások**, nem 2026-10-15-ös új PASS-ok.

| Visszanyert követelmény | Kanonikus cél / tulajdonos | Szemantikai megőrzési acceptance | Bizonyíték |
| --- | --- | --- | --- |
| Egyetlen Editor v2 | Editor v2, PAGE/REVISION | /admin/editor egy core, legacy nincs write authority | ARCHIVE SOURCE; runtime újrateszt OPEN |
| Schedule canonical D1 | SCHEDULE, 49.5 Live/Schedule modul | schedule_items CRUD és site ownership, nincs Page Model event másolat | ARCHIVE SOURCE; runtime OPEN |
| Presentation/domain külön | PAGE + SCHEDULE + DYN | Schedule node canonical public projectiont fogyaszt, nem ír event rekordot | ARCHIVE SOURCE; public renderer részleges forrás |
| Inspector egy property registry | PAGE + DESIGN_SYSTEM | Inspector és canvas ugyanazt a command/version útvonalat használja | ARCHIVE SOURCE; E2 történeti bizonyíték, mai E2E OPEN |
| Legacy nem reaktiválható | Admin/Editor/Schedule route owners | Legacy felület read-only/redirect/archived; nincs párhuzamos persistence | ARCHIVE SOURCE; route regression OPEN |
| Site ownership | SITE + SCHEDULE + PAGE | idegen site read/write negatív teszt, no cross-tenant | ARCHIVE SOURCE; 0017 schema baseline |
| Egységes mutation pipeline | PAGE + REVISION + AUDIT | history/validation/save/publish közös command; CMS bypass tiltott | ARCHIVE SOURCE; PUB-01/02/06 jelenleg BLOCK |

**Pontos korlát:** ez **csak a 00/A.2.2 fennmaradt részének visszanyerése**, nem az egész 00/A vagy 00.9.6.B eredeti forrásáé. A korábbi `UNRECOVERED` státuszt ezért részletezni kell: `00/A = PARTIAL SOURCE RECOVERED (00/A.2.2), FULL OPEN`; `00.9.6.B = UNRECOVERED / OPEN`. Az archív szakaszban szereplő régi M0 auditkapu elhagyása és F0 előfeltételei **történeti döntés**, nem a jelenlegi PLAN audit automatikus feloldása.

### 63.50.69. H19–H34 ledger kettős előfordulások és bizonyítékszintek (2026-10-15)

A kanonikus MASTER-ben a `^| Hxx.yy |` formájú sorok ellenőrzése **279 előfordulást, de pontosan 271 egyedi történeti ID-t** adott. Ez **nem 279 követelmény**: nyolc ID két táblában szerepel, mert az elsődleges traceability sor mellett szemantikai korrekciós/negatív acceptance sor is van. A 271/271 korábbi strukturális szám helyes, de az összes sor megszámlálása deduplikáció nélkül hibás eredményhez vezet.

| Ismételt H-ID | Elsődleges megőrzési térkép | Második előfordulás szerepe |
| --- | --- | --- |
| H19.16 | secure object keys → RES-002, RES-014, SEC-008 | R2 object key nem SEC-009 webhook signature |
| H21.13 | YouTube statistics → INT-013, ANL-004, ANL-001 | taxonomy nem platformmetrika-implementáció |
| H21.22 | Secrets + adapter → INT-019, INT-001, SEC-008 | webhook security nem secret storage |
| H22.16 | title/description/hashtag → CNT-010, CNT-011, AI-013 | AI-014 clip nem szövegjavaslat |
| H22.19 | performance feedback → ANL-004, CNT-016, ANL-001 | taxonomy nem teljes feedback loop |
| H28.14 | file validation → RES-003, SEC-006 | XSS sanitization nem teljes MIME/size/magic-byte |
| H32.18 | content performance → ANL-004, AI-004, AI-013 | stream summary nem content analytics |
| H34.21 | implementation lifecycle → DEV-001, QA-002, QA-008 | QA önmagában nem implementáció |

**Szemantikai következtetés:** mind a nyolc korrekciót **meg kell őrizni**; nem valódi dupla követelmények és nem törölhetők pusztán deduplikáció címén. A negatív teszt és owner határ a második sorból származik. A 271/271 strukturális ledger mellett a 271/271 *eredeti forráshoz mért teljes szemantikai bizonyítás* továbbra is **NOT PASS**. Következő: történeti 19–34 forrás eredeti szakaszai vs H-ID sorok; majd 00/A és 00.9.6.B további Git-history/PR keresés.

### 63.50.70. H19–H34 eredeti archívum ↔ egyetlen MASTER kétirányú 271 soros forrásellenőrzés (2026-10-15)

**Elsődleges forrás:** `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` két történeti ledger-táblája (H19–H22 és H23–H34). **Cél:** `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` 63.52–63.53 elsődleges H-sorai. **Módszer:** teljes két fájl, H-ID regex, azonosító szerinti deduplikáció; minden H-ID elsődleges `képességszöveg` összevetése; a korrekciós táblák további sorai nem számítanak új H-ID-nek. Ez **teljes, ID-szintű forrás-összevetés**, de nem bizonyítja a jelenlegi 396 ID minden szemantikai acceptance-ének teljességét.

| Történeti csoport | Egyedi H-ID |
| --- | ---: |
| H19 | 20 |
| H20 | 18 |
| H21 | 22 |
| H22 | 19 |
| H23 | 20 |
| H24 | 13 |
| H25 | 12 |
| H26 | 12 |
| H27 | 19 |
| H28 | 17 |
| H29 | 10 |
| H30 | 14 |
| H31 | 14 |
| H32 | 25 |
| H33 | 13 |
| H34 | 23 |
| **Összesen** | **271** |

**Eredmény:** archív forrásban **271 egyedi H-ID**, aktuális MASTER-ben **271 egyedi H-ID**; hiányzó forrás-ID **0**, forrás nélküli új H-ID **0**. Az aktuális MASTER összes H-táblasora 279; a 8 korrekciós ismétlést a 63.50.69 külön bizonyítja. Az archívban két történeti táblacsalád ugyanazokat az ID-kat kétszer is felsorolja, ezért az előfordulások nem alkalmasak darabszámnak.

**Elsődleges képességszöveg eltérés: 9 ID.** A különbségek között nyolc esetben a kanonikus tervben korrekciós táblasor **megelőzi** az eredeti traceability sort, ezért a puszta `first occurrence` félrevezető; az elsődleges H-ID forrásrekord továbbra is jelen van. A kilencedik, **H28.16** esetben az eredeti `action permission \u0060can()\u0060 checks` kifejezés az aktuális táblában `action permission 'can()' checks` alakban szerepel: tipográfiai eltérés, nem bizonyított szemantikai veszteség.

| Eltérő első előfordulás | Értelmezés / további teendő |
| --- | --- |
| H19.16 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |
| H21.13 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |
| H21.22 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |
| H22.16 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |
| H22.19 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |
| H28.14 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |
| H28.16 | Kódjelölés → idézőjel; eredeti jogosultsági `can()` követelmény megmaradt |
| H32.18 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |
| H34.21 | Korrekciós sor megelőzi az eredeti traceability sort; a 63.50.69 szerinti negatív szemantikai tesztet és az elsődleges forrásszöveget együtt kell megtartani |

**Új forrásbizonyíték-következtetés:** a 271/271 **azonosító és eredeti képességcímke** visszakereshetősége az archívumban ellenőrzött; a 00/A.2.2 részleges visszanyerése ettől külön áll. **Nem PASS** a teljes szemantikai audit: az archív táblák owner/surface/stage/acceptance szövegeinek soronkénti összehasonlítása, az ID→domain/phase új értelmezése és az éles funkciók működése külön vizsgálandó.

**Következő:** az archív H-sorok owner/surface/stage/acceptance oszlopainak szemantikai összevetése 19–22, 23–28, 29–34 csoportban; 00.9.6.B eredeti forrás keresése Git history/PR. **GATE: NOT PASS.**

### 63.50.71. H19–H34 archív owner/surface/stage/dependency — 16/16 csoportos szemantikai szerződés (2026-10-15)

**Módszer:** a 63.50.70 szerinti 271 egyedi H-sor archív elsődleges táblájának `domain owner`, `surface`, `scope/phase`, `dependencies` mezőit csoportonként visszaolvastam; összevetési cél az 5. canonical domain, 49. UI-modul és F0–F11 ütemezés. **Ez csoportszintű szemantikai kontroll**, nem minden egyes H-ID teljes oszloponkénti bizonyítása, és nem runtime acceptance.

| Történeti fejezet | Tételek | Mai kanonikus domain | Felületi tulajdonos | Fázis-kapu | Kötelező megőrzési / negatív szerződés |
| --- | ---: | --- | --- | --- | --- |
| H19 | 20 | RESOURCE | Resource Manager + Editor picker + upload API | F0 minimal/F2 full | D1 metadata / R2 binary; site scoped key; usage and safe delete |
| H20 | 18 | PAGE + source domains | Editor binding + public renderer | F0/F3 + source provider phase | Read projection only; loading/stale/error; no second source store |
| H21 | 22 | INTEGRATION + LIVE_STATE + CONTENT | Integrations module + Live + Content + public widget | F0 Twitch baseline/F5–F7 others | Cloudflare Secrets, provider scope/quota, no unsupported API |
| H22 | 19 | SCHEDULE + CONTENT | Schedule module + Content Studio + Editor widget | F0 schedule baseline/F3/F7 | schedule_items canonical, timezone/DST, no copied Page Model events |
| H23 | 20 | PAGE + REVISION + DESIGN_SYSTEM | Editor Inspector/Canvas + public renderer | F0 baseline/F2 motion | safe interaction, command validation, reduced motion |
| H24 | 13 | PAGE + DESIGN_SYSTEM + QA | Editor + public site + forms | F0 baseline/F3 accessibility | semantic HTML, keyboard/focus, WCAG, negative test |
| H25 | 12 | SEO_PUBLICATION + PAGE | Page settings + public HTTP renderer | F0 publish gate/F3 SEO | SSR status/canonical/robots/redirect, no draft leak |
| H26 | 12 | ANALYTICS | Public collection + Analytics Admin | F9 | consent, retention, source provenance, estimates labeled |
| H27 | 19 | IDENTITY + ADMIN shell + source domains | Admin home + 22 canonical modules | F1 shell + module phase | permission-aware routes, domain CRUD outside Editor |
| H28 | 17 | IDENTITY + AUDIT + all owners | Worker/API + Admin + Editor + uploads | F0 security baseline/F4/F11 | server-side can() auth, secrets, CSRF/replay, AI scope later |
| H29 | 10 | BACKUP + REVISION + RESOURCE | Backup/recovery Admin + D1/R2 | F0 minimum/F11 advanced | restore drill, revision recovery, site-scoped backup |
| H30 | 14 | QA + OPS | Public + Editor + CI/Worker | F0–F11 release gates | performance budget, E2E, visual regression, no false PASS |
| H31 | 14 | AI_OPERATION + PAGE/REVISION | AI module + Editor approval UI | F10 AI; canonical commands F0 | Intent→Plan→Actions→Permission→Validation→Preview/Diff→Approval→Execute→Verify→Audit→Version |
| H32 | 25 | LIVE_STATE + CONTENT + ANALYTICS + AI_OPERATION | Stream Assistant + Content + Analytics | F6/F7/F9; AI F10 | metrics provenance, manual fallback, no unsupported AI claim |
| H33 | 13 | AUTOMATION + INTEGRATION + AUDIT | Automation module + domain action endpoints | F9; AI F10 | Trigger→Condition→Action→Result→Verify→Audit, idempotency |
| H34 | 23 | QA + DEV + product governance | Product review + each module owner | Continuous per phase | discovery→approval→implementation→test→user validation; no standalone feature |
| **Összesen** | **271** | **16 csoport** | | | |

**Konkrét szemantikai kockázatok / nem automatikus PASS:**
1. **H19–H20:** asset és dynamic data a Page Modelben csak hivatkozás/binding; a R2 blob, D1 metadata, domain rekord és public projection külön tulajdonos. A jelenlegi `page-renderer.js` több dinamikus blokkot placeholderként renderel (RND-01), ezért a címke-megőrzés nem működési bizonyíték.
2. **H21–H22:** a régi Stage 7/8/10/11 megjelölések **nem** mechanikusan F7/F8/F10/F11; a jelenlegi F0/F3/F5/F7 ütemezésben a Schedule baseline és későbbi adapterek elkülönítendők. Twitch OAuth baseline nem bizonyít YouTube/TikTok/Discord API-képességet.
3. **H23–H25:** interaction/motion/a11y/SEO public runtime szerződés. A jelenlegi 63.50.63–65 PUB-01–10 és RND-01–06 hibák miatt sem Editor, sem SEO nem jelölhető teljesnek.
4. **H26–H27:** Analytics külön domain, Admin csak aggregál és navigál. A jelenlegi Admin menüpontok Editorra mutató helyettesítő útvonalai (NAV-02) nem elfogadott végső modulstruktúra.
5. **H28–H30:** biztonság, restore és release QA minden releváns F-fázis kapuja; a későbbi F11 multi-tenant szerepkörök nem feltételezhetők a mai három szerepkörből.
6. **H31–H33:** AI és Automation csak canonical command és human approval/permission határon keresztül dolgozhat; a történeti AI Editor nem jelent második Visual Editort. AI outage mellett manual fallback.
7. **H34:** a discovery, implementáció, teszt és felhasználói validáció **eljárás**, nem 23 külön UI-feature. Az eredeti H34.00 folyamatot nem szabad egy QA checkboxszal helyettesíteni.

**Következő:** a 271 sor teljes archív owner/surface/phase/dependency/acceptance oszlopainak *soronkénti* kockázati osztályozása; a 00.9.6.B forrás továbbra is UNRECOVERED. **GATE: NOT PASS.**

### 63.50.72. H19–H22 79/79 soronkénti történeti owner/phase/acceptance auditkártya (2026-10-15)

**Forrás:** `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` H19–H22 elsődleges tábla `historical requirement`, `owner`, `surface`, `scope`, `dependency`, `evidence`; a cél a 63.52–63.53 kanonikus ID és az 5./49./F0–F11 szerkezet. Az alábbi 79 sor **forrásból azonosított követelmény**, a domain/phase/test oszlop **tervezett audit-szerződés**, nem ténylegesen futtatott teszt. A korábbi Stage számokat nem szabad az új F számokkal automatikusan megfeleltetni.

| H-ID | Eredeti képesség | Mai stabil ID | Domain ownership | Új fázisértelmezés | Pozitív + negatív acceptance irány | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| H19.01 | upload | RES-003, RES-001, RES-002 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.02 | folders | RES-006 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.03 | search | RES-005 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.04 | filter | RES-005 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.05 | preview | RES-004 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.06 | metadata | RES-007 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.07 | alt text | RES-007 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.08 | crop | RES-004 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.09 | resize | RES-004 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.10 | replace | RES-009 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.11 | archive/delete | RES-009 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.12 | usage tracking | RES-008 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.13 | unused media detection | RES-008, RES-015 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.14 | MIME validation | RES-003 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.15 | file-size limits | RES-003 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.16 | secure object keys | R2 object key nem SEC-009 webhook signature | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.17 | image optimization | RES-004 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.18 | video/audio | RES-002, RES-004 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.19 | clip/Short assets | RES-001, CNT-003 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H19.20 | cache policy | RES-004, DYN-006, WEB-030 | RESOURCE / R2 binary + D1 metadata | F0 media minimum → F2 advanced Resource | asset CRUD + R2 key scope; MIME/size/auth; orphan/usage/rollback | ARCHIVE SOURCE; runtime UNRUN |
| H20.01 | D1 binding | DYN-001, DYN-002 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.02 | site settings | DYN-001, SET-001 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.03 | schedule | DYN-001, SCH-010, SCH-011 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.04 | Twitch | DYN-001, INT-011, LIV-001 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.05 | YouTube | DYN-001, INT-013 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.06 | TikTok | DYN-001, INT-014 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.07 | Discord | DYN-001, INT-015 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.08 | VOD | DYN-001, CNT-020 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.09 | collections | DYN-001, CNT-005 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.10 | API data source | DYN-001, DYN-002 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.11 | loading state | DYN-005 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.12 | empty state | DYN-005 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.13 | error state | DYN-005 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.14 | conditional rendering | DYN-004 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.15 | data transforms | DYN-003 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.16 | caching | DYN-006 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.17 | stale-data handling | DYN-005, DYN-006 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H20.18 | binding validation | DYN-002, DYN-008 | PAGE binding / owning domain source | F0 read-only baseline → F3 bindings | binding resolution + stale/loading/error; forbidden write; site leak | ARCHIVE SOURCE; runtime UNRUN |
| H21.01 | Twitch OAuth | INT-010, INT-003 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.02 | Twitch live/offline | INT-011, LIV-001 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.03 | Twitch title | LIV-003 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.04 | Twitch game | LIV-003 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.05 | Twitch viewer statistics | LIV-004 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.06 | Twitch followers/subscribers where available | LIV-004 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.07 | Twitch VOD | INT-012, CNT-002 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.08 | Twitch clips | INT-012, CNT-003 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.09 | Twitch events/webhooks where applicable | INT-017, LIV-006 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.10 | YouTube channel | INT-013 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.11 | YouTube videos | INT-013, CNT-004 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.12 | YouTube Shorts | INT-013, CNT-003 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.13 | YouTube statistics where available | taxonomy nem platformmetrika-implementáció | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.14 | YouTube API quota/error handling | INT-009, INT-020 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.15 | TikTok profile | INT-014 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.16 | TikTok supported content integration | INT-014, CNT-004 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.17 | TikTok API capability review | INT-014, INT-018 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.18 | TikTok rate limits/fallback | INT-009, INT-014 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.19 | Discord community link | INT-015, WEB-019 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.20 | Discord optional integration | INT-015 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.21 | Discord status where justified | INT-015, INT-020 | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H21.22 | Architecture constraint: keep secrets in Cloudflare Secrets; normalize external APIs behind services | webhook security nem secret storage | INTEGRATION / LIVE_STATE / CONTENT | F0 Twitch → F5–F7 platform adapters | OAuth/secret/scope/quota/provider outage; adapter fallback; audit | ARCHIVE SOURCE; runtime UNRUN |
| H22.01 | schedule CRUD | SCH-001 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.02 | recurring schedule | SCH-004 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.03 | timezone handling | SCH-003 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.04 | next-stream calculation | SCH-009 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.05 | countdown | SCH-009 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.06 | live state | LIV-001, SCH-005 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.07 | game/category | SCH-012, SCH-014 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.08 | stream type | SCH-001, SCH-005 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.09 | VOD ingestion | CNT-002 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.10 | VOD categorization | CNT-005 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.11 | VOD search/filter | CNT-006 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.12 | Shorts management | CNT-003 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.13 | clips management | CNT-003 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.14 | content calendar | CNT-009 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.15 | platform-specific variants | CNT-011 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.16 | title/description/hashtag suggestions | AI-014 clip nem szövegjavaslat | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.17 | thumbnail brief | CNT-012, CNT-010 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.18 | publishing workflow | CNT-013, CNT-014 | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |
| H22.19 | performance feedback loop | taxonomy nem teljes feedback loop | SCHEDULE / CONTENT / INTEGRATION | F0 Schedule → F3/F7 Content & VOD | timezone/DST + CRUD/revision; canonical schedule; public/preview parity | ARCHIVE SOURCE; runtime UNRUN |

**Soronkénti bizonyítási határ:** 79/79 ID, képességszöveg és stabil cél ellenőrizve; a csoporthoz tartozó archív owner/surface/scope/dependency oszlopokat **audit-bemenetként** használtuk, de a konkrét végső per-item pozitív és negatív acceptance implementációja nincs bizonyítva. A négy csoport 79 sora nem jelenti, hogy 79 feature működik.

**Kiemelt eltérés / negatív teszt:** H19.16 R2 object-key policy nem webhook signature; H21.13 YouTube statisztika nem mérési taxonómia; H21.22 Cloudflare Secrets nem webhook signature; H22.16 title/hashtag javaslat nem clip/transcript; H22.19 analytics feedback nem taxonomy. A 63.50.69 második sorai az elsődleges source- és acceptance sor mellett megmaradnak.

**Következő:** H23–H28 93/93 soros mély audit, majd H29–H34 99/99; végül mind a 271 H-ID és az eredeti archív owner/surface/dependency/acceptance külön soronkénti consistency gap ellenőrzése. **GATE: NOT PASS.**

### 63.50.73. H23–H28 93/93 soronkénti interaction, accessibility, SEO, analytics, Admin és security audit (2026-10-15)

**Forrás:** `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` H23–H28 elsődleges történeti tábla, szemben a kanonikus MASTER 63.52–63.53 és 5./49./F0–F11 fejezeteivel. A fázis, domain és tesztoszlop **audit-terv**, nem futtatott bizonyíték.

| H-ID | Eredeti képesség | Mai stabil ID | Domain owner | Új fázisértelmezés | Kötelező pozitív és negatív acceptance | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| H23.01 | event model | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.02 | click | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.03 | hover | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.04 | focus | EDT-039, EDT-037 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.05 | active | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.06 | submit | EDT-039, EDT-019 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.07 | scroll | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.08 | load | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.09 | timer | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.10 | open/close | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.11 | navigation | EDT-039, WEB-009 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.12 | show/hide | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.13 | toggle | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.14 | state machine | EDT-039 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.15 | transition | EDT-040 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.16 | animation timeline | EDT-040 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.17 | keyframes | EDT-040 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.18 | reduced-motion | EDT-040, QA-005 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.19 | interaction validation | EDT-039, EDT-022 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H23.20 | performance safeguards | OPS-008, QA-004 | PAGE + REVISION + DESIGN_SYSTEM | F0 safe baseline → F2 motion | event/state validation; reduced motion; keyboard; XSS/performance | SOURCE / UNRUN |
| H24.01 | semantic HTML | WEB-032, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.02 | heading hierarchy | EDT-017, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.03 | alt text | RES-007, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.04 | labels | EDT-019, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.05 | ARIA | QA-005, EDT-037 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.06 | keyboard navigation | EDT-037, QA-004 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.07 | focus order | EDT-037, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.08 | focus visibility | EDT-037, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.09 | contrast warnings | DSN-002, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.10 | screen-reader metadata | WEB-032, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.11 | form validation accessibility | EDT-019, QA-005 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.12 | editor accessibility checks | EDT-022, EDT-037 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H24.13 | public accessibility audit | QA-005, QA-009 | PAGE + QA + ACCESSIBILITY | F0 accessibility gate → F3 components | semantic/ARIA/keyboard/focus; screen-reader; negative WCAG | SOURCE / UNRUN |
| H25.01 | title | SEO-001 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.02 | description | SEO-001 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.03 | canonical | SEO-001, SET-004 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.04 | Open Graph | SEO-002 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.05 | X/Twitter card | SEO-002 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.06 | structured data | SEO-003 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.07 | sitemap | SEO-004 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.08 | robots | SEO-004 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.09 | per-page SEO | SEO-001 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.10 | SEO preview | SEO-005 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.11 | redirects | WEB-013 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H25.12 | broken-link detection | WEB-013, SEO-005 | SEO_PUBLICATION + PAGE | F0 publish/HTTP gate → F3 SEO | published-only SSR/HTTP 404; canonical/OG; no draft index | SOURCE / UNRUN |
| H26.01 | page views | ANL-001, ANL-002 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.02 | button clicks | ANL-001, ANL-002 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.03 | social clicks | ANL-001, ANL-002 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.04 | stream events | ANL-001, ANL-003 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.05 | conversion events | ANL-001, ANL-005 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.06 | privacy-aware analytics | ANL-002, ANL-009 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.07 | retention policy | ANL-009, SEC-011 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.08 | admin dashboard | ANL-007, ADM-002 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.09 | editor/content performance | ANL-004 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.10 | content performance | ANL-004 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.11 | stream performance | ANL-003 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H26.12 | anomaly detection later | ANL-010 | ANALYTICS + PRIVACY | F9 analytics | consent/source/retention; no tracking without consent; stale data | SOURCE / UNRUN |
| H27.01 | dashboard | ADM-001, ADM-002 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.02 | navigation | ADM-001 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.03 | responsive admin | ADM-010 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.04 | diagnostics | OPS-007, ADM-004 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.05 | page list | WEB-001 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.06 | content management | CNT-001, CNT-006 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.07 | schedule | SCH-001 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.08 | socials | INT-002, ADM-003 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.09 | VOD | CNT-002 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.10 | media | RES-001 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.11 | settings | SET-001 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.12 | SEO | SEO-005 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.13 | analytics | ANL-007 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.14 | integrations | INT-002 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.15 | editor management | EDT-001, WEB-001 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.16 | preview | EDT-032, WEB-005 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.17 | recovery | EDT-042, OPS-005 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.18 | history | WEB-008, EDT-005 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H27.19 | permissions | SEC-002, ADM-009 | ADMIN + source domain owner | F1 Admin shell → source module phase | real module route+permission; no Editor placeholder; viewer denied writes | SOURCE / UNRUN |
| H28.01 | HttpOnly | SEC-001 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.02 | Secure cookie | SEC-001 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.03 | SameSite | SEC-001 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.04 | password hash | SEC-001 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.05 | CSRF | SEC-004 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.06 | rate limiting | SEC-007 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.07 | RBAC | SEC-002 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.08 | API authorization | SEC-002, SEC-003 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.09 | public/admin separation | SEC-002, WEB-031 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.10 | Cloudflare Secrets | SEC-008 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.11 | audit log | SEC-010 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.12 | input validation | SEC-006, SEC-005 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.13 | output validation | SEC-005 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.14 | file validation | XSS sanitization nem teljes MIME/size/magic-byte | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.15 | replay protection where applicable | SEC-009 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.16 | action permission `can()` checks |  | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |
| H28.17 | AI permission boundary | AI-006, AI-019 | IDENTITY + SECURITY + AUDIT | F0 security gate → F4/F11 role expansion | server-side permission; CSRF/replay/secrets; cross-site negative | SOURCE / UNRUN |

**Ellenőrzött:** 93/93 H-ID megtalálható a történeti és aktuális táblában, stabil ID-hoz rendelve. **Nem bizonyított:** 93 működő funkció, 93 lefuttatott teszt, minden archív owner/surface/dependency elfogadása.

**Release-kritikus metszet:** H23 interaction és H24 a11y nem kizárólag Inspector-funkció; a public renderer és keyboard/screen-reader fogyasztó is kötelező. H25 SEO a 63.50.63 PUB-03–05 szerint P0 nyitott. H27 Admin nem egyenlő az Editor menüjével. H28 `can()` szerveroldali policy minden domain mutationt véd, AI permission későbbi fázis. H28.14 fájlvalidálásnál MIME/size/magic-byte és quarantine döntés nem helyettesíthető XSS-only szabállyal.

**Következő:** H29–H34 99/99 tétel; utána 271 sor source→owner/surface/dependency gap minősítés. **GATE: NOT PASS.**

