# SANCI9517 — VÉGLEGES TERMÉK-, ARCHITEKTÚRA- ÉS VÉGREHAJTÁSI TERV

**Tervazonosító:** S9517-ULTIMATE-PLAN  
**Verzió:** 1.0.0 — teljesen új, egységes termékterv  
**Dátum:** 2026-10-13  
**Állapot:** AKTÍV — ez az egyetlen fejlesztési igazságforrás  
**Végrehajtás:** egy aktív pont, szigorú függőségi sorrend, bizonyítékalapú lezárás  
**Termékcél:** professzionális streamer weboldalból teljes, bővíthető Creator Operating Platform

---

## 0. A terv kötelező értelmezése

### 0.0. Új beszélgetés folytatási protokoll — kötelező
- **Az egyetlen fejlesztési terv:** `docs/MASTER-DEVELOPMENT-PLAN.md` a `sanci9517/sanci9517` repository `v2/foundation` ágán. Ezt kell elsőként megnyitni minden új beszélgetésben.
- **Aktív munkapont:** `P0-PRODUCT-BASELINE-AND-EXECUTION-CONTRACT` / `P0.2-ARCHIVE-RECONCILIATION-AND-BIDIRECTIONAL-FEATURE-TRACEABILITY`.
- **Folytatási sorrend:** először a jelen fájl 0.2 aktív állapotát, a 37.3 P0-állapotot, a 37.9–37.32 auditjegyzeteket és a 41. fejezet crosswalkját kell elolvasni; utána a `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` és a kapcsolódó archív tervek tételes összevetése következik.
- **Az archívum nem második terv:** az `docs/archive/**`, `docs/archive/plans/**`, régi checkpointok, issue-k, PR-ek és korábbi beszélgetések történeti források/bizonyítékok. Nem állíthatnak be másik aktív pontot, nem írhatják felül a jelen fájl aktív állapotát. Követelményük viszont nem törölhető; ha még nincs reconciliálva, nyitott tételként kell felvenni ebbe a MASTER-be.
- **Nincs külön audit- vagy funkciólista-terv:** az auditjegyzék, a forrásproveniencia, a funkciókatalógus, a döntések, a függőségek és az acceptance ugyanebben a fájlban él. Kiegészítő fájl csak nyers bizonyíték/kivonat lehet, végrehajtási igazságforrás nem.
- **Új chatnek szánt rövid folytatási szöveg:** „A `docs/MASTER-DEVELOPMENT-PLAN.md` az egyetlen irányadó terv. Olvasd el a 0.0, 0.2, 37.3, 37.9–37.32 és 41. fejezetet. Az aktív pont P0.2; folytasd a C.23 és F.1–F.13 belső felsorolásainak, a korábbi 00/A és 00.9–00.9.6.B forrásoknak, majd mind a 359 funkció-ID kétirányú reconciliációját. Ne állíts PASS-t bizonyíték nélkül, ne indíts párhuzamos feature-fejlesztést, és a végső funkciólista közös ellenőrzését még ne kérd.”

Ez a dokumentum egyszerre termékspecifikáció, architekturális szerződés, funkciókatalógus, tesztelési szabályzat és végrehajtási lista. Minden fejlesztési feladatot ebből kell kiválasztani és ide kell visszavezetni. Minden funkcióhoz tartozzon felhasználói cél, felület, domain-tulajdonos, adatforrás, jogosultság, függőség, teszt és elfogadási feltétel.

### 0.1. Egyetlen igazságforrás
- A végrehajtási sorrendet a dokumentum elején lévő aktív pont és az alábbi pontok határozzák meg.
- Minden új döntést, funkciót, hibát, státuszt, adatmodell-változást, teszteredményt és acceptance-bizonyítékot itt kell rögzíteni.
- A kód, a teszt, az éles rendszer és a felhasználói ellenőrzés tényleges állapota elsőbbséget élvez a tervben szereplő feltételezéssel szemben.
- A „kész”, „megvan” vagy „PASS” szó önmagában nem bizonyíték. A pont aktuális elfogadási feltételeit ellenőrizni kell.
- Minden képesség szerepel a teljes terméktervben; az implementáció a függőségek, biztonság, használhatóság és érték alapján következik.
- A korábbi funkció vagy adatmodell csak indoklással, migrációs tervvel, adatvesztés-ellenőrzéssel és regressziós teszttel vonható ki.
- Egyszerre egy aktív végrehajtási pont fut. Nincs párhuzamos termékfeature-fejlesztés.

### 0.2. Aktuális végrehajtási állapot
**ACTIVE_POINT_ID:** P0-PRODUCT-BASELINE-AND-EXECUTION-CONTRACT  
**ACTIVE_SUBPOINT_ID:** P0.2-ARCHIVE-RECONCILIATION-AND-BIDIRECTIONAL-FEATURE-TRACEABILITY  
**Állapot:** IN PROGRESS — az egységes MASTER belépési pontja rögzítve; a forrásonkénti reconciliáció és a kétirányú funkció-nyomkövetés aktív. A P0.1 marad nyitott, de nem párhuzamos munkaszál: csak új baseline-ellentmondás esetén nyitjuk újra aktív feladatként.  
**PARALLEL_WORKSTREAMS:** 0  
**Következő kapu:** P0.2 tételes reconciliáció → P0.3 → P0.4 → P0.5 → P0.6, kizárólag soros auditban; P0 csak minden kapu bizonyítékalapú PASS-a után zárható. Ezután P1 rendszer- és adatút-baseline, majd a függőségi sorrend szerinti implementáció.

### 0.3. Ismert kiindulási állapot
- Repo: sanci9517/sanci9517; fő fejlesztési ág: v2/foundation.
- Runtime: Cloudflare Workers; TypeScript/JavaScript; Cloudflare D1 strukturált adatokhoz; Cloudflare R2 bináris objektumokhoz.
- Worker: sanci9517-streamer-brand; D1 binding: DB; a jelenlegi konfigurációban ASSETS binding is szerepel.
- Kanonikus Editor runtime: public/editor-v2/.
- Kanonikus backend Page Model, validáció, schedule domain és site ownership szerződés már létezik.
- A site ownership, D1 integrity, élő Worker/API és E4/E5/E6 ellenőrzések korábban igazoltan lezárultak. Ezeket nem kell bizonyíték nélkül újranyitni; regresszió esetén csak az érintett kapu nyílik újra.
- A vászon közvetlen mozgatását és átméretezését a felhasználó működőnek jelezte.
- Az Inspector a Property Registry canonical style-key metaadataira, az aktív viewport resolved értékére és a responsive set/reset útvonalra épül.
- A draft mentése és publikálása külön művelet. A draft mentése nem frissítheti automatikusan a publikus snapshotot.
- A mobil műveletsor és a save/publish javítása kódban rögzített, de a teljes friss CI/éles runtime/valós eszköz acceptance még szükséges.
- Az Android Chrome tabletes belépés külön, elhalasztott nem blokkoló hiba; megőrzendő, de nem keverhető össze az aktív ponttal.
- Külön státusz: NOT STARTED, PLANNED, IN PROGRESS, BLOCKED, CODE COMPLETE, CI PASS, LIVE VERIFIED, USER ACCEPTED, PASS, DEFERRED, REJECTED.

---

## 1. Végső termékvízió

A Sanci9517 nem pusztán streamer-oldal, linkgyűjtő vagy vizuális szerkesztő. A végső termék egy saját márkára szabható Creator Operating Platform, ahol a creator a weboldalát, élő jelenlétét, adásrendjét, tartalmait, közösségét, bevételi lehetőségeit, automatizációit és később az AI-t egyetlen következetes rendszerből kezeli.

### 1.1. Fő eredmények
1. Saját márkájú, gyors, akadálymentes, mobilon elsőrangú publikus weboldal.
2. Közérthető Creator Center/Admin, külön feladatmodulokkal.
3. Megbízható vizuális weboldalépítő adatvesztés nélkül.
4. Egyetlen Page Model, mentési/publikálási folyamat, schedule domain és media/resource rendszer.
5. Twitch, YouTube, TikTok, Discord, Kick és későbbi platformok integrációs központja.
6. Live állapot, adásrend, game profile, VOD, clip, short és tartalmi központ.
7. Közösség, támogatás, tagság, webshop, digitális termékek és üzleti eszközök.
8. Analitika, eseményvezérelt automatizáció és később biztonságos AI-asszisztens.
9. Exportálhatóság, helyreállíthatóság, auditálhatóság, adatvédelem és fenntartható üzemeltetés.
10. Későbbi több site-os, többfelhasználós, csapatos, előfizetéses és bővíthető SaaS-képesség.

### 1.2. Sikerfeltételek
- A napi feladatok elvégezhetők az adatbázis ismerete nélkül.
- Ugyanaz az adat minden felületen ugyanabból a domainből származik.
- A publikus oldal csak validált és publikált állapotot mutat.
- Külső API-hiba, lejárt token, lassú hálózat vagy revision conflict nem okoz csendes adatvesztést.
- A mobil Admin/Editor használható, nem csupán összenyomott desktop.
- A kézi alapfolyamatok AI nélkül is teljesek.
- A terv megőrzi a végső képességkatalógust; a korai scope nem töröl jövőbeli funkciót.

---

## 2. Felülethatárok és közös működés

### 2.1. Publikus oldal
A publikus oldal megjelenít, tájékoztat, navigál, tartalmat szolgáltat, közösséghez vezet, és az elérhető kereskedelmi modulokkal vásárlást/támogatást tesz lehetővé. Nem kezel adminisztratív adatokat és nem fed fel privát integrációs vagy üzleti állapotot.

### 2.2. Creator Center/Admin
Az Admin külön modulokban kezeli az oldalt, kapcsolatokat, adásrendet, tartalmat, médiát, közösséget, bevételt, analitikát, automatizációt és beállításokat. Közös shell, navigáció, státuszok, hibakezelés és jogosultság tartozik hozzá.

### 2.3. Visual Editor
Az Editor a weboldal felépítését, elrendezését, vizuális megjelenését, dinamikus blokkjainak konfigurációját és publikálási folyamatát kezeli. Nem lesz belőle webshop-admin, Twitch-kapcsolatkezelő, teljes schedule manager, analytics dashboard vagy általános adatbázis-szerkesztő.

### 2.4. Egy domain, több felület
- Twitch-kapcsolat a Kapcsolatok modulban jön létre. Dashboard, Live, Schedule és Editor blokk ugyanazt az integrációs állapotot olvassa.
- Adásrend az Adásrend modulban szerkeszthető. Dashboard, Editor blokk és publikus naptár ugyanazt a schedule domaint használja.
- Termék a Bolt modulban jön létre. Termékoldal és Editor termékblokk ugyanazt a termékdomaint olvassa.
- Média minden használati helyen ugyanarra az asset ID-ra mutat.
- Globális design token változása minden hivatkozó komponensben érvényesül; lokális override explicit eltérés.
- A több felületen elérhető művelet nem hozhat létre második adatforrást vagy eltérő jogosultsági logikát.

### 2.5. Tiltott duplikációk
- Második Editor core/Page Model/schedule adatforrás.
- Második OAuth/token-tároló ugyanahhoz a platformhoz.
- Eltérő média-nyilvántartás ugyanarra az assetre.
- Azonos termék/tartalom/esemény szinkronizálatlan másolata csak azért, mert másik felületen jelenik meg.
- Inspectorból közvetlen adatbázis-módosítás a domain command útvonal megkerülésével.
- Kliensoldali jogosultság-ellenőrzés szerveroldali ellenőrzés helyett.
- Draft mentésből automatikus publikálás.
- Tokenek, személyes adatok vagy payment secret naplózása.

---

## 3. Végleges Admin menürendszer és tételes funkciók

### 3.1. Dashboard — Áttekintés
**Cél:** egyetlen kezdőképernyő, amely megmutatja a rendszer valós állapotát és a következő hasznos feladatot.

Funkciók:
- Weboldal publikálási állapota, live/offline, következő stream, legfrissebb tartalom, kapcsolatok és szinkronok állapota.
- Gyorsműveletek: új oldal, Editor, adásrend, médiafeltöltés, kapcsolat, tartalom.
- Teendők: sikertelen sync, lejáró engedély, draft publikálásra vár, hiányzó alt text, domainhiba.
- Legutóbbi aktivitás: mentés, publikálás, kapcsolatváltozás, ütemezett tartalom, hibák.
- Statisztikák csak valós, frissességgel jelölt adatból.
- Loading, empty, partial, stale, error és retry állapot.
- Minden kártya a canonical moduljába vezet; a Dashboard nem másolja az üzleti logikát.

Elfogadás: nincs hamis zöld állapot, nincs kitalált adat, minden gyorsművelet a saját modulhoz vezet.

### 3.2. Weboldal
**Almenük:** Oldalak; Navigáció; Weboldal szerkesztő; Megjelenés és design rendszer; Sablonok és komponensek; SEO és publikálás; Domain és weboldalbeállítások.

**Oldalak**
- Lista: cím, slug, státusz, módosítás ideje, draft/published eltérés.
- Create/edit/duplicate/rename/slug change/archive/delete.
- Hierarchia, szülőoldal, URL-struktúra, sablonból létrehozás.
- Draft, preview, publish, unpublish, revision restore.
- SEO mezők, canonical URL, social preview, indexelési beállítás.
- Slugütközés, redirect, 404 és törlés előtti hivatkozásvizsgálat.
- Státuszok: draft, published, scheduled, archived, validation error.

**Navigáció**
- Főmenü, lábléc, mobilmenü és későbbi egyedi navigációk.
- Link hozzáadás, sorrend, címke, belső oldal/külső URL, dropdown/nested menü.
- Aktív állapot, billentyűzet, fókusz, screen-reader label.
- Törölt céloldal vagy hibás URL jelzése.
- Minden felület ugyanazt a navigation domaint használja.

**Weboldal szerkesztő**
- Egyetlen canonical Editor runtime.
- Element library, canvas, Layers/Outline, Inspector/Properties.
- Section, container/box, row/column/grid, text, heading, image, video/embed, button, link, divider, spacer, icon, list, card, form és dinamikus Sanci blokkok.
- Kijelölés, mozgatás, méretezés, reorder, duplicate, delete, drag/drop, alignment guide, zoom, pan, fit.
- Undo/redo, tranzakció, history integrity, revision conflict recovery.
- Inspector a Property Registryből: typography, color, background, size, spacing, layout, border, radius, shadow, position, visibility, responsive override, accessibility.
- Desktop/tablet/mobile viewport, breakpoint override és inheritance.
- Preview, save, revision és publish külön.
- Unsaved state, mentés közbeni további változtatás megőrzése, network error recovery.
- Dinamikus blokk csak konfigurációt/hivatkozást tárol; nem másolja a mögöttes üzleti rekordot a Page Modelbe.

**Megjelenés és design rendszer**
- Globális színek, typography scale, font, spacing, radius, shadow, border, layout token.
- Site-wide header/footer, reusable sections és globális elemek.
- Site/page/section/component template, reusable symbol és variant fogalmak külön.
- Token usage map, függő komponensek előnézete, diff és rollback.
- Master component/instance, explicit override/detach.
- Nincs láthatatlan, váratlan globális változás.

**Sablonok és komponensek**
- Sablon létrehozása, mentése, elnevezése, kategória, preview, duplicate, update, archive.
- Site template, page template, section template, component template és symbol külön életciklus.
- Sablonból létrehozott oldal önálló, kivéve explicit linked component.
- Verziózás, kompatibilitás, migrációs preview, rollback.
- Későbbi marketplace: licenc, verzió, értékelés, ellenőrzött telepítés.

**SEO és publikálás**
- Title, description, canonical URL, robots, Open Graph, social image.
- Sitemap, robots.txt, structured data/schema.org ahol releváns.
- Redirect, 404, slugváltozás, duplikált meta figyelmeztetés.
- Preview link, publish validation, publikálási összefoglaló, restore.
- Draft mentés nem írja át a published snapshotot.
- Publikálás előtti link, metadata, media, alt text, route és data-binding ellenőrzés.
- SEO/AEO eszközök nem garantálnak rangsorolást; indexelési státusz csak valós forrásból jelezhető.

**Domain/site beállítások**
- Site cím, brand, logo, favicon, locale, timezone, domain, preview domain.
- Domain verification, DNS útmutató, HTTPS/TLS állapot.
- Default SEO/social image, publikus/coming-soon/maintenance státusz.
- Minden beállítás site-scoped; nincs véletlen cross-site szivárgás.

### 3.3. Kapcsolatok
**Almenük:** Áttekintés; Twitch; YouTube; TikTok; Discord; Kick; További szolgáltatók; Webhookok és API-k; Szinkronnapló.

Közös funkciók:
- Státusz: connected, disconnected, expired, limited, error, syncing.
- OAuth connect/callback/state/CSRF, token titkos tárolás, refresh és revoke.
- Connection tulajdonos és site binding ellenőrzés.
- Scope-ok emberi nyelvű magyarázata.
- Reconnect, disconnect, revocation, health check, last success, next sync.
- API quota, retry, provider error normalization és audit log.
- Provider adapter szerződés: connect, refresh, disconnect, health, sync, normalize, capabilities.
- Funkció csak akkor aktív, ha a provider API és a megadott scope valóban támogatja.
- Token nem kerül logba, frontend bundle-be vagy API response-ba.
- Dashboard, Live, Schedule, Content és Editor block ugyanazt az integration state-et használja.
- **1.0 minimum:** külön Admin Kapcsolatok belépési pont a Twitch-kapcsolat kezelésére; a provider-lista bővítése csak a 1.5 capability gate után. Az Editor nem lesz második connection manager.

**Twitch:** OAuth; broadcaster azonosítás; live/offline, cím, kategória/játék, kezdés, nézőszám ha elérhető; schedule sync; EventSub/webhook ahol indokolt; VOD/clip metadata a scope és policy szerint.

**YouTube:** OAuth/API, csatornaazonosítás, video/live/feed/playlist/thumbnail/analytics a hozzáférés szerint; upload/publish külön scope és policy ellenőrzéssel.

**TikTok:** kapcsolat, feed, analytics, publishing és live külön capability; csak az aktuálisan engedélyezett API termékek szerint.

**Discord:** bot/app, guild/server, channel és role mapping; webhook/értesítés; membership role sync; engedély, reconnect és disconnect.

**Kick és későbbi platformok:** provider capability audit; külön adapter; nem támogatott API-képességet nem szabad működőként szimulálni.

### 3.4. Live és Stream
**Almenük:** Live állapot; Stream áttekintés; Stream események; Stream eszközök; Alert/overlay kapcsolatok.

- Kapcsolt platformok live/offline összefoglalója, platformonkénti adatfrissesség.
- Játék/kategória, stream cím, kezdés, nézőszám és elérhető metrikák.
- Player/embed, külső platformra ugrás, offline fallback.
- Stream started/stopped, raid/follow/sub/donation csak megbízható provider eventből.
- Stream key soha nem jelenhet meg kliensoldali API-ban vagy logban.
- OBS kapcsolat későbbi külön modul.
- Elavult API adatnál „utolsó frissítés” és stale státusz; nincs hamis live állapot.

### 3.5. Adásrend
**Almenük:** Naptár; Adások; Ismétlődések; Események; Játékprofilok; Szinkron és előzmények.

- Egyetlen canonical schedule domain.
- Esemény create/edit/duplicate/delete/archive.
- Kezdés/vége, timezone, recurrence, cím, játék, leírás, platform és státusz.
- Draft, scheduled, confirmed, postponed, cancelled, completed.
- Időzóna/nyári időszámítás/ütközés kezelése.
- Ismétlődésnél csak ezt / ezt és jövőbelieket / teljes sorozatot.
- Twitch sync, manual override és konfliktusfeloldás.
- Sync iránya és prioritása explicit; nincs csendes oda-vissza felülírás.
- Publikus naptár, következő stream, countdown, később iCal export.
- Game profile: cím, platform, kép, leírás, linkek, tags, kapcsolódó content.
- Dashboard, Editor block és publikus naptár ugyanazt a schedule API-t olvassa.
- Módosításkor cache invalidation és a kapcsolódó felületek frissítése.

### 3.6. Tartalom
**Almenük:** Tartalomkönyvtár; VOD; Klipek; Highlightok; Videók és Shorts; Közösségi posztok; Tartalomnaptár; Gyűjtemények; Content Studio.

- Canonical content item modell, normalizált provider metaadatokkal.
- Create/import/edit/tag/category/archive/publish state.
- VOD, clip, highlight, YouTube video, short, TikTok video, replay, text/image post, campaign asset.
- Cím, leírás, thumbnail, duration, publish date, URL, platform ID, visibility, tags/category.
- Search/filter/sort/pagination/bulk action.
- Collections, playlists, related content, featured content.
- Duplicate detection provider ID/canonical URL alapján.
- Idea, draft, ready, scheduled, publishing, published, failed, archived státusz.
- Többplatformos content calendar, platformonkénti permission/capability.
- Kézi és automatikus import közti konfliktuskezelés.
- Publishing queue idempotens, auditált műveletekkel.
- Editor Content Feed ugyanebből a domainből olvas, nem másolja a tartalomrekordot a Page Modelbe.

### 3.7. Média és erőforráskönyvtár
**Almenük:** Minden média; Képek; Videók; Ikonok; Fontok; Fájlok; Gyűjtemények; Használati helyek; Feltöltési napló.

- Egyetlen asset registry és asset ID.
- R2 bináris; D1 metadata, owner, site, MIME, size, dimensions, checksum, object key, status.
- Upload, drag/drop, batch upload, progress, cancel, retry, failed upload recovery.
- MIME/size validation, thumbnail/process pipeline és file safety ahol indokolt.
- Search/filter/tag/collection, alt text, title, description, licence/source, crop/focal point.
- Usage locations, delete warning, archive előnyben ha hivatkozás létezik.
- Icon library: search, category, style, license, preview, size/color.
- Font library: family, weight, style, fallback, license és load performance.
- Metadata módosítása minden felületen látszik.
- Bináris adat soha nem kerül D1 JSON mezőbe.

### 3.8. Közösség
**Almenük:** Áttekintés; Discord; Posztok; Szavazások; Események; Tagok; Moderáció; Jelentések; Értesítések.

- Kezdetben külső közösségi platformok kapcsolata és public CTA.
- Saját post, poll, event, clip submission csak a hozzá tartozó domainnel és permissionnel.
- Később tagprofil, follow, comment, reaction, post, poll, event, notification, report, ban, role, badge, reputation/points és challenge.
- Moderációs események, audit, report és appeal status.
- Spam/rate limit, jelentés és biztonságos content rendering.
- Discord role sync csak canonical entitlementből.
- Public/member-only/private hozzáférési szint külön.
- Moderáció nem működhet kizárólag kliensoldali szűréssel.

### 3.9. Bolt és kereskedelem
**Almenük:** Termékek; Kategóriák; Kollekciók; Rendelések; Digitális termékek; Kuponok és kampányok; Készlet és teljesítés; Vásárlók; Bolt beállítások.

- Product CRUD, duplicate, archive, draft/active/hidden/out-of-stock.
- Physical, digital, bundle, limited drop, preorder, később membership-linked product.
- Variants, SKU, price/currency, media, category, collection, tags, SEO, publish date.
- Inventory, fulfillment provider, shipping/tax abstraction.
- Product listing/detail/search/filter/cart/checkout integration/order confirmation.
- Order list/detail, payment/fulfillment state, cancel/refund/tracking.
- Coupon, gift card, campaign, bundle, promotion and expiry.
- Purchase → entitlement → secure digital delivery/download.
- Külső fulfillment adapter; provider és saját készlet nem írhatja felül egymást tisztázatlan szabállyal.
- Pénzügyi művelet idempotens és auditált.
- Adó, számlázás, fogyasztóvédelem, GDPR és payment provider követelményét implementáció előtt fel kell mérni; megfelelőségi állítást nem találunk ki.
- Editor csak product blockot konfigurál; termék a Bolt modulban kezelhető.

### 3.10. Támogatás és tagság
**Almenük:** Támogatás; Tip/Donation; Tagsági szintek; Tagok; Perkek; Támogatói célok; Előzmények; Beállítások.

- Külső tip/donation link és provider adapter.
- Support goal, progress, campaign, supporter message, thank-you page.
- Membership tiers, price, billing period, perk, access level, renewal/cancel state.
- Member-only page/post/video/download/event.
- Entitlement domain dönti el a hozzáférést; UI nem.
- Webhook signature, idempotency, refund/chargeback.
- Member history, cancellation, failed payment, access revoke.
- Discord role sync canonical entitlementből.
- Kezdetben külső szolgáltató használható; saját payment processor csak indokkal.

### 3.11. Analytics
**Almenük:** Áttekintés; Weboldal; Stream; Tartalom; Közönség; Bolt; Kampányok; Exportok.

- Dátumtartomány, összehasonlítás, idősor, breakdown, filter, export.
- Web: views, sessions, referrer, device, performance, conversion privacy-safe módon.
- Stream: elérhető stream metrics, duration, category, engagement.
- Content: views, publish, platform, format, engagement és trend, provider API szerint.
- Store: sales, revenue, order state, conversion, average order value, product performance.
- Community: active members/participation/retention csak megbízható forrásból.
- Canonical metrics: source, unit, timezone, window, freshness, quality, provider.
- Unknown/absent adat nem jelenhet meg hamis nullaként.
- Privacy-safe analytics, consent, retention.
- Analytics olvasó/aggregáló réteg, nem ír üzleti adatot.

### 3.12. Tartalomtervező és kampányok
**Almenük:** Tartalomnaptár; Ötletek; Kampányok; Publikálási sor; Jóváhagyások; Kampányeredmények.

- Idea, brief, draft, asset, platform variant, deadline, owner, status.
- Campaign kapcsolja össze a weboldalt, contentet, schedule-t, linket, kupont és sponsor deliverable-t.
- Platform-specifikus title/caption/thumbnail variáns.
- Scheduled publishing, queue, retry, provider limits és human approval.
- Canonical entity ID-s kapcsolatok, nem duplikált tartalomrekord.
- Failed publish nem jelölhető successfulnak; partial result külön státusz.

### 3.13. Automatizáció
**Almenük:** Automatizációk; Sablonok; Események; Futási előzmények; Hibák és retry.

- Trigger → Condition → Action → Delay/Schedule → Result → Verify → Audit.
- Trigger: live start/stop, schedule change, new content, publish result, order paid, membership change, asset ready, webhook.
- Condition/filter/delay/retry/dead-letter/recovery.
- Action: notification, webhook, Discord message, tag, draft, analytics event, publishing job.
- Veszélyes, publikus vagy költséges akcióhoz preview/dry-run és jóváhagyás.
- Run ID, idempotency key, redacted log, result, rollback/compensation ahol lehetséges.
- Rate limit és loop detection.
- Queue/Workflow/Durable Object csak valós szükség alapján.
- Nincs arbitrary code execution vagy jogosultságot megkerülő admin útvonal.

### 3.14. SANCI AI
**Almenük:** AI áttekintés; Weboldal-asszisztens; Tartalom-asszisztens; Stream Intelligence; AI munkafolyamatok; Biztonsági napló.

Az AI későbbi réteg; a kézi és determinisztikus alapfolyamatok előbb készülnek el.
- Page outline, szöveg, SEO leírás, alt text, title, content idea és campaign brief javaslat.
- Page Model módosítás csak strukturált művelettel, nem tetszőleges HTML/JS közvetlen produkciós írásával.
- Intent → schema validation → permission/ownership check → diff/preview → draft revision → human approval → publish külön lépés.
- Nincs secret/private user data/tenant data kiszivárogtatás.
- Prompt injection és untrusted external content izolálása.
- Minden javaslat visszanézhető és visszavonható; public mutation emberi jóváhagyáshoz kötött.
- Cost/usage/quota/timeout/provider failure/redaction.
- AI-generated code nem futtatható közvetlenül a Workerben.
- Stream intelligence: transcript, chapter, clip/highlight candidate, title/description; csak engedélyezett media és reális feldolgozási kapacitás mellett.
- Automated publish alapértelmezetten kikapcsolt.

### 3.15. Szponzoráció és üzleti központ
**Almenük:** Media kit; Márkák és leadek; Megállapodások; Deliverable-ek; Határidők; Kampányok; Üzleti riportok.

- Creator profile és publikusan vállalható statisztikák.
- Media kit template/export/link/frissítés ideje.
- Brand lead/contact/status/deal/rate card/brief/deliverable/deadline.
- Campaign content, landing page, links and analytics.
- Private documents role/access control.
- Reminder/status/export.
- AI javaslatot adhat; árat, szerződést vagy vállalást ember hagy jóvá.

### 3.16. Beállítások és hozzáférés
**Almenük:** Fiók; Site; Nyelv és időzóna; Biztonság; Értesítések; Hozzáférések; Auditnapló; Adatkezelés; Export és helyreállítás; későbbi számlázás.

- Profile, email, avatar, identity provider, session, logout.
- Site name, locale, timezone, domain, default SEO, public status.
- Session expiry, sensitive action reauth, invalidation.
- RBAC és később granuláris permission.
- Audit: actor, timestamp, resource, action, result.
- Export: structured data, media manifest, importable config.
- Backup/restore, recovery, migration report, integrity check.
- Retention, consent, data export/delete request.
- Notification preferences/delivery status.
- Workspace/team/billing/tenant később.
- Destructive action confirmation és audit.

### 3.17. Csapat és munkaterület — későbbi
- Workspace, multi-site, invite, role, permission.
- Owner, admin, editor, designer, content manager, moderator, analyst, store manager, finance.
- Site/module/resource access.
- Invite expiry/revoke/accept, leave, owner transfer.
- Review/approval/comment/lock/conflict később.
- Tenant isolation API, asset, cache és analytics útvonalon.

### 3.18. Rendszerdiagnosztika — korlátozott hozzáférés
- Health, dependency, last sync, queue/workflow failure, runtime error.
- Structured log, correlation ID, redaction.
- Migration/schema version, integrity check, deploy version.
- Export/restore dry-run és recovery runbook.
- Developer API/webhook secret management admin jogosultsággal.
- Debug info nem jelenhet meg publikus oldalon.

---

## 4. Publikus weboldal — teljes funkciókatalógus

### 4.1. Főoldal
Hero/brand, creator profile, CTA, live/offline, current game, next stream, countdown, featured VOD/clip, YouTube/TikTok content, product, support, Discord/community, social hub, latest content, campaign, email signup megfelelő consenttel. Minden blokk Editorban konfigurálható; hiányzó adatnál fallback.

### 4.2. Stream oldal
Live player/embed, status, title, game/category, start time, next stream, support, community links. Offline fallback, mobil playback, external link, loading/error state. Chat/embed csak támogatott és privacy-safe esetben.

### 4.3. Adásrend oldal
Week/month/list view, timezone, next event, recurring/special events, postponed/cancelled, game profile, event link, később iCal/notification. Nincs külön publikus schedule database.

### 4.4. Tartalomközpont
VOD/clip/highlight/YouTube/TikTok/Shorts/category/tag/playlist/collection, search/filter/sort/pagination/related content. Private/deleted external item esetén fallback.

### 4.5. About/Creator profil
Bio, career, games, setup, FAQ, social, sponsor/media kit. Private contact data nem publikálható véletlenül.

### 4.6. Link Hub
Socials, CTA, schedule, latest content, Discord, merch, campaign, email signup. Mobile-first, link scheduling/UTM/click analytics később privacy-safe módon.

### 4.7. Közösség
Discord, events, posts, polls, clip submission; később profiles, comments, reactions, member-only content, moderation, spam controls.

### 4.8. Bolt és támogatás
Product list/detail, price/variant/stock, checkout provider, digital entitlement, tips, membership, supporter goal. Order/access status csak canonical backend domainből.

### 4.9. Public quality
- Responsive: kis/nagy mobil, tablet, laptop, desktop.
- Keyboard navigation, focus, semantic headings, alt text, contrast, reduced motion.
- Gyors first render, cache, optimized images, layout shift control.
- Per-page title/description/canonical/OG és link health.
- 404/500/maintenance navigálható, emberi nyelvű állapot.
- Consent/privacy ott, ahol analytics vagy embed igényli.
- Public oldal nem hívhat admin-only API-t és nem fedhet fel privát mezőt.

---

## 5. Kanonikus domain- és adatforrás-térkép

| Domain ID | Tulajdonos | Adat | Megjelenési felületek |
|---|---|---|---|
| IDENTITY | Auth/Identity | user, session | Admin, Settings |
| WORKSPACE | Workspace service, később | workspace, membership | Dashboard, Settings, Team |
| SITE | Site service | site config, ownership, locale | Admin, Website, public |
| PAGE | Page service/Page Model | page, draft, published snapshot | Pages, Editor, renderer |
| REVISION | Revision service | immutable revision/version/author | Editor, history, audit |
| NAVIGATION | Navigation service | menu tree/link target | Website, Editor, public |
| DESIGN_SYSTEM | Theme/token service | tokens/theme/components | Website, Editor, public |
| RESOURCE | Asset registry | asset metadata/reference | Media, Editor, public |
| INTEGRATION | Integration service | provider, connection, scopes, token ref, health | Connections, Dashboard, Live, blocks |
| LIVE_STATE | Normalized live service/cache | live/offline/stream data | Dashboard, Live, public blocks |
| SCHEDULE | Schedule domain | events, recurrence, overrides | Schedule, Dashboard, Editor, public |
| GAME_PROFILE | Game/profile domain | game metadata/links/related content | Schedule, Content, public |
| CONTENT | Content domain | VOD/clip/post/video metadata | Content, Calendar, Editor, public |
| PUBLISHING | Publishing service | queue, attempts, provider results | Content Studio, Automation |
| COMMUNITY | Community/integration service | posts, events, moderation | Community, public |
| PRODUCT | Commerce catalog | product, variant, collection, price | Store, Editor, public |
| ORDER | Commerce/provider adapter | order, payment/fulfillment state | Store, Dashboard, Analytics |
| ENTITLEMENT | Access service | member access, digital delivery | Membership, Content, Store, public |
| SUPPORT | Support domain/provider | tip, goal, support link | Support, Dashboard, public |
| ANALYTICS | Metrics pipeline | normalized events/aggregates | Analytics, Dashboard |
| CAMPAIGN | Campaign domain | campaign, links, assets, goals | Content Studio, Business, public |
| AUTOMATION | Workflow engine | rules, runs, retries, audit | Automation, system events |
| AI_OPERATION | AI orchestration | structured proposal, approval, usage | SANCI AI, Editor, Content Studio |
| SPONSORSHIP | Business domain | lead, deal, deliverable, media kit | Business, Campaigns |
| SETTINGS | Scoped settings service | locale, notifications, privacy | Settings, modules |
| AUDIT | Audit service | actor, operation, resource, result | Settings, Diagnostics |
| BACKUP | Export/recovery service | manifest, snapshots, restore jobs | Settings, Diagnostics |

Kötelező domain szabályok:
1. D1 tárolja a strukturált relációs adatot/állapotot; R2 a nagy bináris objektumot.
2. Minden üzleti lekérdezés site/workspace ownership kontextusban fut; a kliens által küldött site ID nem jogosultság.
3. Mutáció csak validált domain operation/command útvonalon.
4. Provider adapter normalizál; külső ID megőrződik, de nem helyettesíti a belső canonical ID-t.
5. Cache származtatott, lejáró vagy invalidálható; nem válhat végleges igazságforrássá.
6. Page Model dinamikus blokk konfigurációt/hivatkozást tárolhat, teljes üzleti rekordot nem másol.
7. Ownership ellenőrzés szerveroldali minden kapcsolatnál, adatnál, médiánál és műveletnél.
8. Domain változásakor minden olvasófelület konzisztens frissítést kap; stale állapot látható.

---

## 6. Technológiai és architekturális elvek

### 6.1. Meglévő stack
- Cloudflare Workers + TypeScript/JavaScript + D1 + R2 a jelenlegi alap.
- React vagy más nagy frontend framework nem vezethető be pusztán kényelmi okból; szükséges a bizonyított indok és külön döntés.
- Új dependency csak maintenance, license, security advisories, bundle size, compatibility, testability és alternatives review után.
- Először a meglévő platform és megbízható open-source lehetőségek felmérése; saját implementáció csak indokolt esetben.

### 6.2. API-first és domain ownership
- Minden API-nak egyértelmű request/response, error code, auth, ownership és idempotency szerződés.
- Route handler vékony; üzleti szabály domain/service rétegben.
- Szerveroldali schema validation; kliensvalidáció csak UX.
- Provider timeout, rate limit, retry/backoff és error normalization.
- Mutation correlation ID és audit, ahol indokolt.

### 6.3. Database és migration
- Minden schema változás verziózott migration.
- Előzetes schema/data audit, backfill, dry-run, rollback/recovery.
- Foreign key, unique, index, not-null és check constraint indok szerint.
- Site ownership adatbázis- és szerveroldalon.
- Migration előtt read-only/preflight és mentési terv.
- Row/null/FK counts és postcondition ellenőrzés.
- D1-ben nincs nagy médiafájl.
- Queue/Workflow/Durable Object csak konkrét indokkal.

### 6.4. Auth és security
- Server-side authn/authz minden védett útvonalon.
- User → workspace membership → site access → resource ownership → operation permission.
- OAuth state/CSRF, token titkos tárolás, refresh/revocation.
- XSS, CSRF, SSRF, injection, open redirect, IDOR, mass assignment, rate-limit/abuse védelem.
- Safe embed, sanitization, security headers, HTTPS, secure cookies, session rotation/expiry.
- Secret nem kerülhet logba, response-ba, bundle-be vagy commitba.
- Audit log redacted.
- Dependency és API policy rendszeres review.
- Public/admin és tenant/site adatizoláció.

### 6.5. UI/UX
- Közös design tokenek és következetes komponensállapotok.
- Minden data screen: loading/empty/error/success/stale/disabled/unsaved/retry.
- Save és publish külön.
- Veszélyes művelet megerősítés + eredmény + audit.
- Undo csak biztonságosan visszafordítható műveletre.
- Mobilon safe-area, keyboard/scroll és hüvelykujj-elérhető kontrollok.
- Keyboard navigation, focus, reduced motion, screen-reader labels.
- Állapot nem csak színnel jelölhető.
- Navigáció a felhasználói feladatot követi, nem a DB struktúrát.
- Placeholder egyértelmű; nincs dead UI.

### 6.6. Performance és operations
- Performance baseline, latency, bundle size, cache hit/miss, error rate.
- Responsive images, lazy loading, layout shift control.
- Public/private cache elkülönítése, explicit invalidation.
- Indexek, pagination, query plan review, N+1 elkerülése.
- Rate/quota-aware sync.
- Structured logs, correlation IDs, health, error tracking, deploy version.
- Backup/restore/export és recovery runbook.
- Deploy után smoke test; successful deploy önmagában nem user acceptance.

---

## 7. Kötelező fejlesztési elvek

1. Egy aktív pont, nincs párhuzamos product feature.
2. Függőség előbb: security/data/domain/API/UI/integration/acceptance.
3. Kicsi, ellenőrizhető változtatás.
4. No silent loss: adat, revision és unsaved edit nem veszhet el csendben.
5. No duplicate source: egy canonical domain tulajdonos.
6. Explicit status; kód, CI, live és user acceptance külön bizonyíték.
7. Test before close; acceptance nélkül nincs PASS.
8. Production evidence szükséges, ha runtime/DB/provider/deploy érintett.
9. UI munkafolyamatnál user acceptance, ha a pont ezt előírja.
10. Regression tests minden érintett korábbi útvonalra.
11. Migration safety: preflight, backup/recovery, postcondition.
12. Accessibility by default, nem utólagos javítás.
13. Privacy by design és adatminimalizálás.
14. AI bounded and last: strukturált, validált, jóváhagyásos.
15. Open-source-first, dependency/license/security review.
16. Evidence over assumption.
17. Recovery dokumentálása minden kritikus adatúthoz.
18. Nincs premature rewrite; bizonyíték, migration és regression szükséges.
19. No dead UI.
20. Continuous benchmark, de csak a célhoz, költséghez és architektúrához illő tanulságot alkalmazzuk.

---

## 8. Külső benchmark és kutatás

A benchmark célja a problémák és jó minták azonosítása, nem másolás. Minden megállapításhoz kell forrás, dátum, funkció/UX minta, creator-probléma, alkalmazhatóság, kockázat, döntés és acceptance-hatás.

### 8.1. Vizsgálandó kategóriák
- Visual website builders: Framer, Webflow, Wix, Squarespace.
- CMS/design systems: WordPress/Gutenberg, Webflow CMS, Figma workflows.
- Editor frameworks: GrapesJS, Craft.js, Puck, ha a jelenlegi Editorhoz relevánsak.
- Creator home/link hub: Beacons és hasonló platformok.
- Creator commerce/membership: Fourthwall, Patreon, Ko-fi, Shopify.
- Streamer tools: Twitch Creator Dashboard, Streamlabs, StreamElements, OBS.
- Integrációk: Discord, YouTube, TikTok, Kick hivatalos API-dokumentációi.
- AI/content repurposing: transcript, highlight, clip, caption, workflow.
- Webminőség: W3C/WCAG, Core Web Vitals, web security, privacy és SEO.

### 8.2. Kutatási szabályok
- Hivatalos docs/product/API/policy/release notes előnyben.
- Árazás, API-képesség, scope, provider policy változhat; implementáció előtt friss ellenőrzés.
- Nem másolunk védett UI-t, márkát, kódot, nem nyilvános adatot vagy működést.
- Nem építünk olyan funkciót, amit az API/policy nem enged.
- Benchmark nem helyettesíti a user testet és security review-t.
- Open-source library értékelése: licence, maintenance, CVE, community, bundle size, accessibility, integration cost.

### 8.3. Benchmark kimenet
1. Forráslista és ellenőrzési dátum.
2. Funkció- és UX-minták.
3. Releváns creator-probléma.
4. Adopt/modify/reject döntés és indok.
5. Domain/UI hatás.
6. Teszt és acceptance követelmény.
7. Következő felülvizsgálat.

---

## 9. Teljes végrehajtási program

A sorrend függőség-alapú, nem verziószámhoz kötött. Minden pont csak az előfeltételek PASS állapota után aktiválható. A teljes capability catalogue folyamatosan érvényes.

### P0 — Termékbaseline és tervintegritás
**P0.1 Tervintegritás és baseline**
- [ ] Aktív igazságforrás és egyetlen aktív pont rögzítve.
- [ ] Repo/branch/commit/deploy/runtime baseline rögzítve.
- [ ] Megőrzendő lezárt állapot és nyitott runtime acceptance szétválasztva.
- [ ] Minden jelenlegi felülethez KEEP/FIX/REPLACE/MIGRATE/DISABLE/REMOVE döntés bizonyítékkal.
- [ ] Teljes funkciókatalógus lefedettsége ellenőrizve.
- [ ] Aktív route-ok és legacy surface-ek inventoryja.
- [ ] Nincs párhuzamos feature implementation.

**P0.2 Fogalmi szótár**
- [ ] Egységes fogalom: Site, Workspace, Page, Revision, Resource/Asset, Integration, Schedule Item, Content Item, Product, Order, Entitlement, Automation Run.
- [ ] Magyar user-facing címke és belső domainnév különválasztva.
- [ ] Minden fogalomhoz definíció, owner és tiltott szinonima.

**P0.3 Képesség- és menülefedettség**
- [ ] Minden menü/almenü minden képessége egyedi ID-t kap.
- [ ] Minden képesség domain ownerhez és adatforráshoz kötött.
- [ ] Több felületes funkciók ugyanahhoz a domainhez kötöttek.
- [ ] Minden funkcióhoz dependency, permission, test és acceptance tartozik.
- [ ] A teljes platform végállapotának minden nagy modulja szerepel.

**P0.4 Végrehajtási szerződés**
- [ ] Egy aktív pont és nincs párhuzamos workstream.
- [ ] Kötelező DoD/státusz.
- [ ] User acceptance elemek jelölve.
- [ ] Terv csak igazolt eredmény után frissül.
- [ ] P0 PASS előtt új feature point nem indul.

### P1 — Platformbaseline
**P1.1 Repository/build:** branch, HEAD, working tree, scripts, typecheck, domain/editor/integration tests, CI checks, Worker entrypoint.  
**P1.2 Route inventory:** admin/public/API routes, auth, ownership, validation, legacy disposition, 401/403/404/405/409/429/500 behavior.  
**P1.3 Database/storage:** D1 schema/migrations, FK/quick_check/ownership, R2 metadata/object key, migration dry-run/rollback.  
**P1.4 Auth/session/ownership:** auth tests, cross-site negative tests, expiry/logout/invalidation, CSRF/OAuth state.  
**P1.5 Observability:** structured logs/redaction, health/version, backup/restore runbook, pre/post deploy smoke and rollback.

### P2 — Admin shell
**P2.1 Shell:** top bar, sidebar/adaptive navigation, breadcrumbs, profile, public site shortcut, session/logout; desktop/tablet/mobile.  
**P2.2 Navigation:** full menu map, permission visibility, explicit placeholder status, keyboard/mobile navigation.  
**P2.3 Shared UI states:** loading/empty/error/success/stale/disabled/dirty/saving, retry/recovery, unsaved guard, dialogs, forms, tables, filters, pagination.  
**P2.4 Dashboard:** real data, canonical links, stale/error states, mobile/keyboard acceptance.

### P3 — Editor core
**P3.1 Page Model:** canonical schema/version, stable IDs, parent-child invariant, validation, serialization round-trip, migration.  
**P3.2 Command/history:** every mutation via command, undo/redo, transaction/rollback, selection/history integrity.  
**P3.3 Save/revision:** draft save separate from publish, revision validation, save/reload round-trip, stale conflict recovery, in-flight edits remain dirty, network recovery.  
**P3.4 Canvas:** selection, drag/drop, resize, reorder, alignment, zoom/pan/fit, keyboard alternative.  
**P3.5 Layers:** tree, expand/collapse, sync with canvas/Inspector, reorder/rename/duplicate/hide/lock, hierarchy after reload.  
**P3.6 Inspector:** Property Registry, resolved viewport value, responsive override/reset, unit/min/max/enum/default, command/history/persistence.  
**P3.7 Responsive:** desktop/tablet/mobile, inheritance, viewport switching without data loss, real-browser acceptance.  
**P3.8 Mobile Editor:** fixed action bar/safe-area/keyboard/scroll, panel switch, save/preview/publish/undo, real Android Chrome phone/tablet smoke; tablet-login issue remains separately tracked.

### P4 — Resource/media
**P4.1 Registry:** asset ID/ownership/metadata, D1/R2 boundary, checksum, references, cross-site denial.  
**P4.2 Upload/download:** validation, progress, retry/cancel, R2 lifecycle, safe URL, expiry, large/mobile upload.  
**P4.3 Library UI:** search/filter/collection/tag/preview/alt text/usage map/delete warning; Editor picker shares registry.  
**P4.4 Icons/fonts:** category/search/license/SVG sanitization/font fallback/weight/load performance.

### P5 — Design system
**P5.1 Tokens:** typed schema, token editor, usage map, preview/diff/rollback.  
**P5.2 Theme:** colors/type/spacing/layout, responsive defaults, reduced motion, renderer/Editor consistency, contrast.  
**P5.3 Templates:** site/page/section/component distinct types, save/preview/apply/version/compatibility/rollback.  
**P5.4 Reusable symbols:** master/instance, explicit override/detach, global update preview, usage map, undo/reload consistency.

### P6 — Pages and renderer
**P6.1 Lifecycle:** CRUD/slug/hierarchy/draft/published/archive/revisions/duplicate/delete reference checks.  
**P6.2 Publish:** preview permission, validation, immutable published snapshot, cache invalidation, rollback, production acceptance.  
**P6.3 Renderer/blocks:** component registry/schema/fallback/safe rendering/data binding/performance; preview matches public.  
**P6.4 Navigation/header/footer:** canonical navigation, mobile menu, link validation, 404/redirect/canonical.  
**P6.5 SEO/public quality:** title/description/OG/sitemap/robots/structured data/link/alt audit, accessibility/performance/production domain smoke.

### P7 — Integrations
**P7.1 Contract:** provider adapter, secret/token storage, scopes, health, sync, errors, retries, audit, mock tests.  
**P7.2 Twitch:** OAuth/state/callback, token lifecycle, site binding, reconnect/disconnect, scope, production callback and cross-site negative tests.  
**P7.3 Live state:** normalize live/offline, poll/webhook, quota, stale state, Dashboard/Live/public consistency, outage test.  
**P7.4 Schedule sync:** conflict/manual override, timezone/recurrence, all surfaces share API, idempotent sync.  
**P7.5 YouTube/TikTok/Discord/Kick:** current capability/policy review, adapter, permission-specific activation, partial/revoked access, publish only when supported.

### P8 — Creator profile, schedule and blocks
**P8.1 Profile/game profile:** public/private fields, image/links/tags, schedule/content relationships.  
**P8.2 Dynamic block catalogue:** live, next stream, schedule, countdown, VOD/content feed, platform feed, Discord CTA, support, social hub, later product/collection; schema/source/fallback/error/permission for every block.  
**P8.3 Public site:** home/stream/schedule/about/content/link hub/community/support/store as enabled, responsive, accessible, fast, SEO and embed privacy.

### P9 — Content and publishing
**P9.1 Content model:** type/status/platform/source ID/metadata/tags/collections/ownership/visibility, duplicate detection.  
**P9.2 Library:** CRUD/import/archive/search/filter/sort/pagination, VOD/clip/highlight/short/video/post, related content and thumbnails.  
**P9.3 Calendar/queue:** status lifecycle, provider permission, idempotency, retry, approval, partial success.  
**P9.4 Studio:** ideas/brief/script/title/description/tag/thumbnail, platform variants, campaign, approval, export and schedule.

### P10 — Community/audience
**P10.1 External:** Discord server/bot/permissions, CTA, event/notification hooks, reconnect.  
**P10.2 Own community:** profile/follow/post/comment/reaction/poll/event, report/moderation/ban/role/audit, spam/rate limit/privacy.  
**P10.3 Email/audience:** signup/consent/double opt-in if required, subscriber list/segment/export/unsubscribe, newsletter vs transactional, bounce/complaint, retention/delete.

### P11 — Commerce/support/membership
**P11.1 Provider strategy:** fees, EU/HU payment, taxes, fulfillment, API, refund, portability, merchant-of-record decision, legal review.  
**P11.2 Catalog:** product/variant/collection/category/price/media, physical/digital/bundle/preorder, inventory/fulfillment, public pages.  
**P11.3 Orders:** checkout adapter, order/payment/fulfillment, signed webhook/idempotency, refund/cancel/tracking, test and production acceptance.  
**P11.4 Digital delivery:** purchase→entitlement→secure access, signed expiring links, refund revocation, no public R2 exposure.  
**P11.5 Support/membership:** tips/goals/tiers/perks/access, canonical entitlement, Discord role sync, cancellation/refund/failed payment.

### P12 — Analytics
**P12.1 Event taxonomy:** canonical event schema, source, timestamp, consent, dedup/late event, retention.  
**P12.2 Web analytics:** views/sessions/referrer/device/performance, privacy/consent/bot filtering.  
**P12.3 Creator/content analytics:** provider metrics with unit/source/freshness, per-stream/content comparisons, no fabricated values.  
**P12.4 Commerce/community analytics:** canonical order metrics, campaign attribution, permission, export/retention.

### P13 — Campaign/sponsorship
**P13.1 Campaigns:** goals/dates/links/assets/products/content/performance, templates, attribution.  
**P13.2 Sponsorship:** media kit, public metrics, leads/brands/deals/rate card/deliverables/deadlines, private docs, reminders/export.

### P14 — Automation
**P14.1 Event registry:** stable schema, authenticated source, dedup/order, retention.  
**P14.2 Engine:** trigger/condition/action/delay/result, run ID, idempotency, retry/timeout/cancel, cycle detection, dry-run/approval, recovery.  
**P14.3 Builder:** rules/templates/active/paused/version, preview/permissions/test run/audit; no arbitrary code.

### P15 — Stream Studio/Overlay/OBS
**P15.1 Assets:** overlay/scene/browser-source config, dimensions/safe area/version/preview/export.  
**P15.2 OBS connector:** explicit secure pairing, state/commands/permissions, disconnect/reconnect, no exposed secrets.  
**P15.3 Stream tools:** alerts/overlays/timers/commands/loyalty/giveaway/poll/moderation per provider capability, test mode/rate limit/audit.

### P16 — Backup/portability/diagnostics
**P16.1 Export:** site/pages/revisions as supported/design/navigation/metadata/asset manifest, version/checksum, secret exclusion.  
**P16.2 Backup/restore:** scope/retention/encryption, dry-run, D1/R2 consistency, RPO/RTO, restore test.  
**P16.3 Diagnostics:** broken links/assets/invalid blocks/stale integration/failed job, redacted report and remediation.

### P17 — Security/accessibility/performance/reliability
**P17.1 Security:** auth/permission/IDOR, OAuth/CSRF/session, XSS/embed, SSRF/redirect/injection, rate limit, webhook signature, secret/dependency audit.  
**P17.2 Accessibility:** keyboard, semantic structure, focus, screen reader, contrast, reduced motion, zoom, forms/dialogs/tables/canvas alternatives, automated and manual review.  
**P17.3 Performance:** Core Web Vitals, asset compression, query/API latency, pagination/cache, Editor large documents, bundle/dependency review, slow network.  
**P17.4 Reliability:** provider outage, retry/backoff, D1/R2 recovery, idempotent webhook/publish, alert thresholds, rollback/restore drill.

### P18 — Localization
**P18.1 Locale foundation:** Hungarian primary, translation keys/fallback, dates/numbers/currency/timezone, content locale vs UI locale, missing-key tests.  
**P18.2 Multi-language public site:** locale routes, hreflang, translated pages/SEO/content, fallback/navigation, canonical/indexing rules.

### P19 — Multi-site/team/SaaS
**P19.1 Workspace/site:** ownership model, switcher/context, resource/integration scope, cross-site denial, config isolation.  
**P19.2 Team:** invites/roles/permissions/review/approval/audit/notifications/conflict/owner transfer.  
**P19.3 Billing:** cost-based plans/entitlements/feature gates/subscription lifecycle/usage metering/quotas/export/deletion; no pricing promise before cost review.

### P20 — Extension marketplace
**P20.1 Contract:** manifest/permissions/version/compatibility/review, safe execution, install/update/uninstall/migration, supply-chain security/rollback.  
**P20.2 Marketplace:** themes/blocks/templates/overlays/OBS scenes/assets, license/attribution/version/rating/support, entitlement/payment only after legal review, moderation/malicious package scan.

### P21 — AI and creator intelligence
**P21.1 Governance:** provider/data policy, structured operations, schema/permission/ownership checks, diff/preview/approval/rollback, cost/quota/log/redaction, prompt-injection tests.  
**P21.2 Website/content AI:** page/design/text/SEO/accessibility/translation suggestions, human edit/approval, no direct production mutation.  
**P21.3 Stream intelligence:** transcript/chapter/highlight/clip candidate, short-form reuse, copyright/privacy/retention, publish only via separate explicit policy.

### P22 — End-to-end acceptance and continuous evolution
**P22.1 Full journey:** Admin login→connect Twitch→schedule→create page→blocks→preview→draft save→reload→publish→public verification; cross-surface consistency; asset flow; content hub; enabled commerce; recovery tests; mobile/desktop.  
**P22.2 Release readiness:** active gates PASS, no critical/high security defect, restore/rollback verified, accessibility/performance/SEO within budgets, help/error messages, production smoke/user acceptance, release notes/known issues.  
**P22.3 Continuous discovery:** benchmark refresh, user feedback, API/policy review, proposal with impact/dependency/cost/security, no capability silently removed.

---

## 10. Minden funkció kötelező specifikációja

Minden egyedi funkció-ID alatt kötelező:
1. ID és név.
2. Felhasználói cél.
3. Belépési hely: Admin menü, public route, Editor panel vagy automation.
4. Pontos működés és eredmény.
5. Canonical domain owner.
6. Adatforrás: D1/R2/provider/cache.
7. Olvasó és író felületek.
8. Permission, scope, ownership és operation.
9. Request/response/schema/status/error contract.
10. Függőségek.
11. Hibamódok: timeout, stale, outage, conflict, invalid input.
12. Security/privacy/secret/retention.
13. UI states.
14. Automated tests.
15. Negative tests.
16. Live acceptance ha runtime/DB/provider/deploy érintett.
17. User acceptance ha UI/workflow érintett.
18. Rollback/recovery.
19. Státusz.
20. Bizonyíték: commit/CI/test/runtime, titok nélkül.
21. Tervfrissítés és next point.
22. Regressziós hatás.

### 10.1. Kötelező negatív tesztek
- Másik site resource ID-ja.
- Hiányzó/lejárt session.
- Hiányzó scope vagy visszavont provider engedély.
- Hibás schema/túl nagy input.
- Duplikált webhook/publish/automation event.
- Stale revision és párhuzamos mentés.
- Hálózati timeout mentés közben.
- Használatban lévő asset törlése.
- Kliens által manipulált role/permission/site ID.
- Hiányzó/hibás provider data.
- Cache stale/invalidation.
- Public route privát adatot kér.
- Retry dupla tranzakciót vagy contentet okoz.
- Restore inkompatibilis manifestből.
- AI javaslat jogosulatlan műveletet tartalmaz.

---

## 11. Státusz és PASS

### 11.1. Státuszok
- NOT STARTED: nincs implementáció.
- PLANNED: specifikáció és dependency megvan.
- IN PROGRESS: aktív ponton belüli munka.
- BLOCKED: konkrét akadály és feloldási lépés.
- CODE COMPLETE: kód kész, de acceptance még hiányzik.
- CI PASS: előírt automatizált checkek pass.
- LIVE VERIFIED: production runtime/API/DB bizonyított.
- USER ACCEPTED: user elfogadta az előírt próbát.
- PASS: a teljes DoD igazolt.
- DEFERRED: indokkal és visszatérési feltétellel későbbre tett.
- REJECTED: megvizsgált, indokoltan elvetett irány.

### 11.2. PASS minimum
- Kötelező funkciók kész.
- Typecheck/build/unit/domain/API tesztek pass.
- Releváns integration/regression és ownership/security negative tests pass.
- Production smoke/DB check, ha érintett.
- Browser/device acceptance, ha UI érintett.
- User acceptance, ha előírt.
- Nincs kritikus adatvesztési, permission vagy publish hiba.
- Evidence, status, known issue és next point frissítve.

A build, CI, deploy, runtime és user acceptance külön bizonyíték; egyik sem helyettesíti automatikusan a többit.

---

## 12. Kiadási és prioritási stratégia

Nincs kötelező 1.0/2.0 számozás, amely mesterségesen korlátozza a fejlesztést. A teljes termékkatalógus mindig érvényes; a tényleges release a függőségek szerint áll össze:

1. Biztonságos alap: build/auth/ownership/data/revision/storage/recovery.
2. Első teljes napi workflow: Admin→connection→schedule→page/editor→save→preview→publish→public renderer.
3. Publikus minőség: pages/navigation/theme/media/SEO/accessibility/responsive.
4. Creator működés: live/schedule/game profile/content/integrations.
5. Növekedés: content studio/link hub/audience/community/analytics.
6. Bevétel: support/membership/commerce/digital products/sponsorship.
7. Operáció: automation/alerts/OBS/diagnostics/backup.
8. Platformosodás: multi-site/team/permissions/billing/marketplace.
9. AI: strukturált, jóváhagyásos segítség, majd stream intelligence.
10. Folyamatos security/performance/accessibility/benchmark.

Korábbi release scope csak akkor bővíthető, ha dependency PASS, érték egyértelmű, költség/kockázat vállalható és quality gate nem gyengül. A katalógusból funkciót nem törlünk pusztán azért, mert későbbre kerül.

---

## 13. Minőségi és üzemeltetési kapuk

**PR előtt:** diff/scope review, typecheck, releváns tesztek, diff-check, security/dependency review, migration/API contract review, aktív pont/acceptance ellenőrzése.

**Deploy előtt:** branch/commit/working tree, secret/binding/migration preflight, rollback plan, API/data tests, deploy diff/version.

**Deploy után:** health, auth/permission, érintett API/DB, public renderer/cache, Editor save/reload/publish ha érintett, browser/device ha UI érintett, log/error review, PASS/FAIL rögzítése.

**Release blocker:** adatvesztés/revision corruption, tenant data leak, secret leak, auth bypass, draft/published összekeverés, payment/entitlement hiba, csendes sync felülírás, kritikus broken public route/asset, kritikus accessibility/mobil hiba a release scope-ban, nem helyreállítható migration/restore.

---

## 14. Stabil funkcióazonosító-rendszer

Az ID a menücímke változásakor sem változik:
- ADM — Admin shell/Dashboard
- WEB — website/pages/navigation/SEO/publish
- EDT — Visual Editor
- DSN — design system/themes/templates/components
- RES — resources/media/assets/icons/fonts
- INT — integrations/connections
- LIV — live/stream
- SCH — schedule/calendar/game profiles
- CNT — content/studio/publishing
- COM — community/moderation
- STO — store/products/orders/fulfillment
- SUP — support/membership/entitlements
- ANL — analytics/metrics
- CAM — campaigns/sponsorship/business
- AUT — automation/workflows
- OBS — OBS/overlay/stream studio
- AI — AI orchestration/creator intelligence
- SEC — security/privacy/permissions
- OPS — observability/deploy/backup/recovery
- LOC — localization
- TEAM — workspace/team/roles
- MKT — marketplace/extensions
- QA — quality/release/acceptance

Példák: INT-TWITCH-OAUTH, SCH-RECURRING-EVENT, EDT-RESPONSIVE-RESET, WEB-PUBLISH-SNAPSHOT. A menücímke és a belső ID külön fogalom.

---

## 15. Folyamatos ellenőrzőlisták

**Termék:** minden Admin művelet/public route; egy canonical domain owner; közös adat több felületen; provider capability matrix; commerce/entitlement; AI approval/rollback; minden modulhoz dependency/acceptance.

**Technika:** auth/RBAC/ownership/tenant isolation; validation/API errors/idempotency; migration/index/FK/integrity; D1/R2 boundary; cache invalidation; redacted logs/monitoring; backup/export/restore; performance/accessibility/SEO/privacy; dependency/license/security; browser/device/production acceptance.

**Felhasználói minőség:** feladatot nevező menük; egyértelmű eredmény; save és publish külön; érthető hiba/következő lépés; unsaved changes védelem; mobilhasználhatóság; közös adatok konzisztenciája; nincs hamis adat/success.

## 16. Döntési napló és változáskezelés

Minden döntéshez: dátum, ID, probléma, alternatívák, döntés/indok, érintett domain/menu/ID, data/API/migration/security/privacy/performance hatás, teszt/acceptance, rollback.

Tervmódosításkor a korábbi követelmény státusza és indoka megmarad. Új követelmény egyedi ID-t, domain ownert és DoD-t kap. Funkció nem nevezhető át úgy, hogy elveszítse korábbi jelentését; nem távolítható el csendben.

---

## 17. Aktív pont sablon

Minden aktív pont fejléce:
- ACTIVE_POINT_ID
- ACTIVE_POINT_TITLE
- ACTIVE_POINT_STATUS
- ACTIVE_SUBPOINT_ID
- ACTIVE_SUBPOINT_STATUS
- PRECONDITIONS
- SCOPE_IN / SCOPE_OUT
- FILES_AND_DOMAINS
- IMPLEMENTATION_STEPS
- TEST_COMMANDS
- AUTOMATED_TESTS
- NEGATIVE_TESTS
- PRODUCTION_CHECKS
- USER_ACCEPTANCE
- ROLLBACK_AND_RECOVERY
- EVIDENCE
- KNOWN_ISSUES
- PASS_CRITERIA
- NEXT_POINT
- PARALLEL_WORKSTREAMS: 0

Pont lezárásakor: DoD ellenőrzés; teszteredmény/commit rögzítése; nyitott hiba BLOCKED/DEFERRED; függőségek alapján következő pont; csak utána új implementáció.

---

## 18. Nyitott elfogadási elemek — nem automatikus PASS
- **EDT-SAVE-RELOAD:** friss CI és production round-trip.
- **EDT-PUBLISH-SNAPSHOT:** éles save→reload→public render.
- **EDT-MOBILE-ACTION-BAR:** valós telefonos browser acceptance.
- **EDT-LAYERS-INSPECTOR-RESPONSIVE:** teljes canvas/Layers/Inspector/responsive acceptance.
- **ADM-TABLET-LOGIN:** külön, megőrzendő deferred issue.
- **INT-TWITCH:** lezárt ownership/integration szerződés megmarad; nem kell feleslegesen újraírni.

## 19. Első végrehajtási kapu — P0.1

P0.1 ellenőrzi branch/HEAD/working tree, package scripts, typecheck és releváns tesztek, canonical Editor/Page Model/revision API, D1 migration/ownership integrity, save/reload/publish/mobile acceptance, ID-jegyzék és egyetlen aktív terv állapotát. Nem létező tesztparancsot nem szabad kitalálni.

**PASS:** baseline és tesztparancsok bizonyítottak; runtime és kódállapot külön jelölt; nincs kettős canonical owner; a következő pont scope/DoD pontos; nincs indoklás nélkül eldobott követelmény. **FAIL:** nincs új feature; csak a baseline vagy akadály javítható.

## 20. A termék végső állapota

A Sanci9517 akkor éri el a teljes Creator Operating Platform célját, ha:
- egyetlen Editorral szerkeszthető a weboldal;
- Admin és public ugyanazon canonical Page/Content/Resource/Schedule/Integration domainekből dolgozik;
- kapcsolatok, live state, schedule és content megbízhatóan szinkronizál;
- media, design system, templates és reusable components konzisztens;
- content több platformra tervezhető/jóváhagyható/publikálható a tényleges provider képesség szerint;
- community, support, membership, store és sponsorship külön, érthető modul;
- analytics pontos, privacy-safe és forrással/freshness-szel jelölt;
- automation auditált, idempotens és helyreállítható;
- AI csak validált, engedélyezett, előnézhető és jóváhagyott műveletet végez;
- backup/export/restore ténylegesen tesztelt;
- multi-site/team/SaaS nem követel teljes újraírást;
- minden funkcióhoz domain owner, teszt, acceptance és recovery tartozik;
- a rendszer mobilon és desktopon gyors, hozzáférhető, biztonságos és megbízható.

**Végső szabály:** nem attól kész a termék, hogy a tervben minden sor szerepel, és nem attól teljes, hogy sok menüpont látható. Akkor kész, ha a funkció valós adatokkal, jogosultságokkal, hibakezeléssel, tesztekkel és acceptance-szel működik. A teljes terv megőrzi az összes képességet; a végrehajtás egyesével, függőség szerint halad.


## 21. Kiegészítő, kötelezően megőrzendő képességek

### 21.1. Publikus tartalomtípusok és Creator Resources
Home, About/Profile, Live, Schedule, VOD/Content, Clips/Shorts, Community, Contact, Creator Resources, Link Hub, Support, Press/Sponsor; később Store, Membership, Events, Blog/News, Digital Products. Resource types: guide, download, setup-lista, ajánlott eszköz, disclosed affiliate link, tutorial, FAQ, preset, külső erőforrás. Mezők: title/slug/description/cover/category/tags/file-or-link/version/date/visibility/SEO/related content. Canonical CMS/Page, responsive/SEO/error/publish acceptance és entitlement-védelem.

### 21.2. Sanci Button és action registry
Stabil ID, name/description/icon/action type/target/permission/visibility/order/status; route, validated external URL, anchor, dialog, form submit, safe toggle, domain action. Arbitrary JavaScript tilos. Icon/text modes, accessible label, hover/focus/active/disabled/loading, keyboard/reduced-motion, search/category/order/duplicate/preview/delete-impact, global style preview/rollback, explicit local override, open-redirect/external-link policy.

### 21.3. Forms
Text/email/URL/textarea/select/checkbox/radio/date-time/file fields; help/required/default/validation/min-max/options/consent/conditional fields. Server validation, rate/request-size limits, spam protection, approved backend actions only, consent version/time/source, unsubscribe/withdrawal/retention, PII minimization, access/export/delete/audit, idempotent submit, truthful success; upload file policy and R2 lifecycle.

### 21.4. Search, SEO/AEO
Search only published/allowed pages/resources/content/products; normalized query, pagination, relevance, no-results, canonical URLs, publish invalidation, no private/draft leakage. Sitemap/robots, redirects, broken links, valid structured data, OG/social preview/image validation; warnings separate from blocking errors.

### 21.5. Domain lifecycle
Add/verify domain, DNS instructions/status/errors, primary/alias/redirect, HTTPS/TLS, detach/restore, truthful pending state, canonical URL/redirect/sitemap/social/cache checks, destructive confirmation/audit; verify platform capability/cost first.

### 21.6. Game Profiles
Canonical game ID/name/platform/artwork/description/genre/category/official URL/tags/notes and related content/schedule; CRUD/archive/search/usage references; schedule/content/pages share one ID; provider/license policy for imports; Resource Registry artwork; archive rather than break used references.

### 21.7. Link Hub
Canonical title/destination/icon/description/visibility/order/active window/campaign/locale/status; internal/external/schedule/content/product/support/Discord/newsletter/event links; validation/health/expiry/UTM, privacy-safe click analytics, safe QR/short-link contract, mobile/accessibility/brand acceptance.

### 21.8. Audience és Founding Supporters
Email consent/source/time/version/language/status/suppression/unsubscribe, export/delete/retention; no marketing after unsubscribe without new consent. Newsletter/transactional/automation mail have separate policies; provider bounce/complaint/retry/idempotency. Public supporter names require explicit revocable opt-in.

### 21.9. Stream diagnostics
Opt-in live/offline, connection/audio/mic, silence/speech, chat and OBS scene/recording diagnostics only when source/permission exist. Show source/freshness/confidence; don't state unverified causes as facts. Post-stream summary, VOD chapters, highlight/clip candidates and scripts are editable suggestions; publication needs approval; privacy/retention/consent/provider policy apply.

### 21.10. AI orchestrator
Intent → plan → context → structured actions → permission/schema validation → diff/preview → approval → canonical API/command → verify → audit/version. Model/provider registry, prompt version, task queue, cost/quota, timeout/retry, approval queue and AI Control Center. Specialist roles share permission pipeline; no unauthorized commit/deploy/secret change.

### 21.11. Interactions/motion
Validated click/hover/focus/active/submit/scroll/load/timer/open-close/navigation/show-hide/toggle; duration/easing/delay/trigger/reduced-motion/performance controls. Timeline/keyframes/scroll-driven animation are later scoped. Preview cannot mutate canonical data; keyboard/touch alternatives or explicit decorative status required.

### 21.12. Export/import/portability
Versioned manifest/schema/checksum/assets; no secret/token export; providers reconnect after restore. Dry-run validates missing assets, duplicate IDs, schema/owner/permission/reference/migration. No half-published partial failure. Restore verifies Page Model/revisions/themes/navigation/media/public render; export/restore drills mandatory.


## 22. Benchmark alapvonal és forrásnapló

Research: visual builder/responsive/CMS/publishing; provider health/integration UX; creator link hub; merch/digital products/membership/support; audience ownership; content feeds; analytics/campaign tracking; accessibility/performance; AI structured proposals/approval.

Kezdőpontok: https://www.framer.com/solutions/website-builder/ ; https://webflow.com/platform ; https://www.wix.com/ ; https://help.twitch.tv/s/article/creator-dashboard?language=en_US ; https://fourthwall.com/features ; https://beacons.ai/ ; https://ko-fi.com/features ; https://www.patreon.com/product/digital-products ; https://www.w3.org/WAI/ ; https://web.dev/vitals/ ; https://owasp.org/www-project-top-ten/.

Provider API, ár, scope, licenc és policy aktuális állapotát implementáció előtt újra ellenőrizni kell.

---

## 23. Teljességi zár — a végrehajtás előfeltétele

A terv véglegesítésének ellenőrzése:
- [ ] Admin menürendszer és minden fő modul lefedve.
- [ ] Publikus oldaltípusok és dinamikus blokkok lefedve.
- [ ] Editor canvas, Layers, Inspector, responsive, history, save/reload/publish lefedve.
- [ ] Page/CMS, templates/components/symbols, theme/design tokens lefedve.
- [ ] Resource/media/icon/font/file registry lefedve.
- [ ] Connections/Twitch/YouTube/TikTok/Discord/Kick/OBS/provider contract lefedve.
- [ ] Schedule/recurrence/timezone/game profile/countdown lefedve.
- [ ] Content/VOD/clips/Shorts/Content Studio/publishing queue lefedve.
- [ ] Community/moderation/email audience/consent lefedve.
- [ ] Store/products/orders/digital delivery/membership/support/entitlement lefedve.
- [ ] Analytics/campaign/sponsorship lefedve.
- [ ] Automation/alerts/OBS/stream diagnostics lefedve.
- [ ] AI website/content/stream/orchestrator/approval/rollback lefedve.
- [ ] Security/privacy/ownership/migrations/observability/backup/restore lefedve.
- [ ] Localization/custom domain/multi-site/teams/SaaS/marketplace lefedve.
- [ ] Benchmark, accessibility, performance, SEO/AEO, release gates lefedve.
- [ ] Minden funkció egyedi ID-t, domain ownert, függőséget, tesztet és acceptance-t kap.
- [ ] Nincs párhuzamos canonical adatforrás és nincs rejtett, eldobott capability.
- [ ] A P0.1 valós repository/runtime ellenőrzése után a következő pont konkrét fájlokkal és tesztparancsokkal aktiválható.

A P0.1 lezárásáig új product feature nem implementálható. A tervben szereplő jövőbeli képesség nem kész funkció; csak a saját pontjának PASS elfogadása után tekinthető megvalósítottnak.


## 24. Teljes funkcióazonosító-jegyzék

Az alábbi jegyzék a menüfunkciókat külön, stabil munkapontokra bontja. A státusz minden ID-nál külön vezetendő; az, hogy egy képesség szerepel a tervben, nem jelenti a megvalósítását. Az egyes ID-k csak a 10. fejezet szerinti feature contracttal és saját acceptance-szel zárhatók le.

### 24.1. Dashboard és Admin shell — ADM
- ADM-001: Admin shell és globális navigáció.
- ADM-002: Dashboard állapotkártyák.
- ADM-003: Gyorsműveletek és canonical route-ok.
- ADM-004: Teendők és hibajelzések.
- ADM-005: Legutóbbi aktivitás és audit összefoglaló.
- ADM-006: Globális keresés és command palette.
- ADM-007: Profil/session/logout és lejáratkezelés.
- ADM-008: Közös loading/empty/error/stale/success state-ek.
- ADM-009: Permission-alapú menü- és action-visibility.
- ADM-010: Mobil/tablet Admin shell.

### 24.2. Weboldal és publikus renderer — WEB
- WEB-001: Page CRUD és listanézet.
- WEB-002: Slug, hierarchy és URL lifecycle.
- WEB-003: Page duplicate/archive/delete és usage warning.
- WEB-004: Draft/published state és published snapshot.
- WEB-005: Preview link és preview authorization.
- WEB-006: Publish validation és publish report.
- WEB-007: Unpublish/restore/rollback.
- WEB-008: Revision history és diff.
- WEB-009: Canonical navigation tree.
- WEB-010: Header/footer és global layout.
- WEB-011: Mobile navigation és keyboard behavior.
- WEB-012: Public route registry és 404.
- WEB-013: Redirect manager és broken-link report.
- WEB-014: Public Home/Creator-home.
- WEB-015: Public Live/Stream page.
- WEB-016: Public Schedule page.
- WEB-017: Public VOD/Content Hub.
- WEB-018: Public About/Creator profile.
- WEB-019: Public Community page/CTA.
- WEB-020: Public Contact page/form.
- WEB-021: Public Creator Resources page.
- WEB-022: Public Link Hub.
- WEB-023: Public Support page.
- WEB-024: Public Sponsor/Press Kit.
- WEB-025: Public Store/Product pages.
- WEB-026: Public Membership/Member area.
- WEB-027: Public Events/Blog/News/Digital Products routes.
- WEB-028: Public error/maintenance/offline states.
- WEB-029: Public search index and query.
- WEB-030: Public cache/invalidation.
- WEB-031: Published-only data visibility enforcement.
- WEB-032: Public content rendering security and safe embeds.

### 24.3. Visual Editor — EDT
- EDT-001: Canonical Page Model schema/version.
- EDT-002: Node IDs and parent/child invariants.
- EDT-003: Command mutation pipeline.
- EDT-004: Transaction/batch/rollback semantics.
- EDT-005: Undo/redo history integrity.
- EDT-006: Selection state synchronization.
- EDT-007: Canvas viewport, zoom, pan and fit.
- EDT-008: Canvas drag/drop.
- EDT-009: Canvas resize/geometry constraints.
- EDT-010: Alignment guides/snap/grid.
- EDT-011: Reorder/reparent/duplicate/delete.
- EDT-012: Layers tree expand/collapse.
- EDT-013: Layers/canvas/Inspector selection sync.
- EDT-014: Layer rename/hide/lock and hierarchy.
- EDT-015: Element/Block Library and search.
- EDT-016: Section/Container/Stack/Row/Columns/Grid.
- EDT-017: Text/Heading/Link/Button/Icon/Divider/Spacer.
- EDT-018: Image/Video/Embed/List/Card/Badge.
- EDT-019: Table/Accordion/Tabs/Form capability.
- EDT-020: Dynamic Sanci block configuration.
- EDT-021: Inspector Property Registry.
- EDT-022: Inspector schema validation and control types.
- EDT-023: Inspector resolved viewport value.
- EDT-024: Responsive override/inheritance/reset.
- EDT-025: Responsive desktop/tablet/mobile preview.
- EDT-026: Responsive visibility/order/column changes.
- EDT-027: Dirty state and explicit Save Draft.
- EDT-028: Save/reload round-trip.
- EDT-029: Revision conflict recovery.
- EDT-030: In-flight edit preservation during save.
- EDT-031: Network failure/retry/local recovery.
- EDT-032: Preview without publishing.
- EDT-033: Explicit publish separate from save.
- EDT-034: Public renderer parity with Editor preview.
- EDT-035: Mobile Editor action bar/safe area.
- EDT-036: Mobile Layers/Inspector panel switching.
- EDT-037: Keyboard-accessible canvas alternatives.
- EDT-038: Copy/paste and multi-select where enabled.
- EDT-039: Interactions and action registry.
- EDT-040: Motion/reduced-motion behavior.
- EDT-041: Empty-project onboarding and template start.
- EDT-042: Editor error recovery and no-data-loss guard.

### 24.4. Design system, templates and components — DSN
- DSN-001: Global design token schema.
- DSN-002: Token editor and live preview.
- DSN-003: Token usage/dependency map.
- DSN-004: Global change diff and rollback.
- DSN-005: Theme and brand presets.
- DSN-006: Responsive defaults and breakpoint tokens.
- DSN-007: Typography/font registry.
- DSN-008: Site template library.
- DSN-009: Page template library.
- DSN-010: Section template library.
- DSN-011: Component template library.
- DSN-012: Reusable component/symbol master-instance.
- DSN-013: Variants, slots and explicit overrides.
- DSN-014: Template versioning/compatibility/migration.
- DSN-015: Template import/export.
- DSN-016: Button Registry and global button styles.
- DSN-017: Icon/action registry linkage.
- DSN-018: Future community/marketplace templates.

### 24.5. Resource/media/icons/fonts — RES
- RES-001: Canonical asset registry and IDs.
- RES-002: R2 binary storage and D1 metadata.
- RES-003: Upload validation/progress/cancel/retry.
- RES-004: Image preview/thumbnail/variant.
- RES-005: Media search/filter/sort/pagination.
- RES-006: Collections/tags/folders.
- RES-007: Alt text/caption/license/source metadata.
- RES-008: Asset usage/reference map.
- RES-009: Replace/archive/delete/restore safety.
- RES-010: Editor asset picker.
- RES-011: Icon registry/search/category/preview.
- RES-012: SVG safety and sanitization.
- RES-013: Font registry/weight/style/fallback.
- RES-014: File download authorization/expiry.
- RES-015: Media diagnostics and broken asset scan.
- RES-016: Paid/private asset access integration.

### 24.6. Connections/integrations — INT
- INT-001: Canonical provider adapter contract.
- INT-002: Integration overview and health.
- INT-003: OAuth state/callback/CSRF protection.
- INT-004: Token lifecycle/refresh/revoke.
- INT-005: Site ownership and connection binding.
- INT-006: Scope/permission visibility.
- INT-007: Connect/reconnect/disconnect flow.
- INT-008: Sync history, retry and provider errors.
- INT-009: Rate-limit/quota handling.
- INT-010: Twitch OAuth and channel binding.
- INT-011: Twitch live/schedule data.
- INT-012: Twitch VOD/clip metadata where allowed.
- INT-013: YouTube channel/video/live adapter.
- INT-014: TikTok capability-gated adapter.
- INT-015: Discord bot/guild/channel/role integration.
- INT-016: Kick capability-gated adapter.
- INT-017: Webhook subscription/signature/replay defense.
- INT-018: Provider capability registry.
- INT-019: Integration secret redaction and audit.
- INT-020: Integration diagnostics and recovery.
- INT-021: Future payment/email/commerce adapters.

### 24.7. Live/Stream/OBS — LIV / OBS
- LIV-001: Normalized live/offline state.
- LIV-002: Live data freshness/stale indicator.
- LIV-003: Stream title/category/game/start time.
- LIV-004: Viewer/follower/subscriber metrics where permitted.
- LIV-005: Player/embed and offline fallback.
- LIV-006: Stream event normalization.
- LIV-007: Stream status in Dashboard and public blocks.
- OBS-001: Overlay asset and scene metadata.
- OBS-002: OBS secure pairing/connection.
- OBS-003: Scene/stream/recording state where supported.
- OBS-004: Authorized commands and stream markers.
- OBS-005: Browser source configuration.
- OBS-006: Alerts for provider-supported events.
- OBS-007: Chatbot/commands/timers/loyalty/giveaways.
- OBS-008: Test mode, event replay and rate limit.
- OBS-009: Macro Deck or external control adapter.
- OBS-010: Overlay preview/export/version.

### 24.8. Schedule/game profiles — SCH
- SCH-001: Schedule item CRUD.
- SCH-002: Calendar/list/upcoming/past views.
- SCH-003: Timezone and daylight-saving correctness.
- SCH-004: Recurrence and series edit scopes.
- SCH-005: Postponed/cancelled/completed/live states.
- SCH-006: Schedule conflict detection.
- SCH-007: Twitch schedule sync/manual override.
- SCH-008: Sync status/retry/audit.
- SCH-009: Next stream/countdown.
- SCH-010: Public schedule rendering.
- SCH-011: Editor Schedule block.
- SCH-012: Game Profile CRUD.
- SCH-013: Game artwork/resource linkage.
- SCH-014: Game/content/schedule relationship.
- SCH-015: iCal/export and later notifications.

### 24.9. Content/Content Studio — CNT
- CNT-001: Canonical content item schema.
- CNT-002: VOD import and metadata.
- CNT-003: Clip/highlight/Short management.
- CNT-004: YouTube/TikTok video feed.
- CNT-005: Tags/categories/collections/playlists.
- CNT-006: Search/filter/sort/pagination/bulk actions.
- CNT-007: Duplicate detection and external IDs.
- CNT-008: Featured/related content.
- CNT-009: Content calendar.
- CNT-010: Ideas/drafts/scripts/briefs.
- CNT-011: Platform-specific title/description/tag variants.
- CNT-012: Thumbnail and media asset workflow.
- CNT-013: Publishing queue and schedule.
- CNT-014: Publish status/retry/partial success.
- CNT-015: Approval workflow and public publish gate.
- CNT-016: Campaign linkage and content attribution.
- CNT-017: Short-form export preparation.
- CNT-018: Transcript/chapter/highlight suggestions later.
- CNT-019: Editor content feed block.
- CNT-020: Content public hub.

### 24.10. Community/audience — COM
- COM-001: External community links.
- COM-002: Discord community entry point.
- COM-003: Community posts.
- COM-004: Polls and voting.
- COM-005: Events and RSVP.
- COM-006: Member profiles and follows later.
- COM-007: Comments/reactions later.
- COM-008: Clip submission.
- COM-009: Moderation/report/ban/role.
- COM-010: Badges/reputation/challenges later.
- COM-011: Notifications and delivery status.
- COM-012: Abuse/spam/rate-limit controls.
- COM-013: Member-only content access.
- COM-014: Founding Supporters opt-in listing.
- COM-015: Email signup/consent/subscriber list.
- COM-016: Segmentation/newsletter/automation.
- COM-017: Unsubscribe/suppression/export/delete.
- COM-018: Public/member/private visibility policy.

### 24.11. Store/commerce — STO
- STO-001: Product catalog.
- STO-002: Product variants/SKU/price/currency.
- STO-003: Categories/collections/tags.
- STO-004: Product media and SEO.
- STO-005: Physical/digital/bundle/preorder/limited drop.
- STO-006: Inventory/fulfillment abstraction.
- STO-007: Storefront listing/detail/search/filter.
- STO-008: Cart and checkout provider adapter.
- STO-009: Order lifecycle/payment status.
- STO-010: Fulfillment/tracking/cancellation/refund.
- STO-011: Coupons/promotions/gift cards.
- STO-012: Digital purchase entitlement.
- STO-013: Secure download/access delivery.
- STO-014: Tax/shipping/VAT/invoice integration review.
- STO-015: Customer account/history where needed.
- STO-016: Abandoned cart later.
- STO-017: Product/collection Editor blocks.
- STO-018: Provider webhook idempotency and audit.
- STO-019: Merchant-of-record/provider decision.
- STO-020: Store analytics.

### 24.12. Support/membership — SUP
- SUP-001: Support/tip links and provider.
- SUP-002: Donation/tip state where available.
- SUP-003: Supporter goals and progress.
- SUP-004: Membership tiers and billing period.
- SUP-005: Perks and member-only access.
- SUP-006: Entitlement lifecycle.
- SUP-007: Membership renewal/cancel/failed payment.
- SUP-008: Refund/chargeback entitlement handling.
- SUP-009: Discord role sync from entitlement.
- SUP-010: Supporter history and opt-in public listing.
- SUP-011: Membership content and event access.
- SUP-012: Member discount/exclusive drop.

### 24.13. Analytics/campaign/business — ANL / CAM
- ANL-001: Canonical event taxonomy.
- ANL-002: Privacy-safe web analytics.
- ANL-003: Stream analytics.
- ANL-004: Content/platform analytics.
- ANL-005: Commerce analytics.
- ANL-006: Community analytics.
- ANL-007: Date range/comparison/filter/export.
- ANL-008: Freshness/source/unit/missing-data state.
- ANL-009: Consent/retention/bot filtering.
- ANL-010: Anomaly detection, thresholds and explainable alerts.
- CAM-001: Campaign CRUD/status/goals.
- CAM-002: Campaign links/UTM/attribution.
- CAM-003: Campaign asset/content/product relationships.
- CAM-004: Media kit generation/export.
- CAM-005: Brand lead/deal/rate card.
- CAM-006: Deliverables/deadlines/reminders.
- CAM-007: Sponsor campaign analytics.
- CAM-008: Private business documents and permission.
- CAM-009: Invoice/payment status only after business/legal review.

### 24.14. Automation — AUT
- AUT-001: Canonical event registry.
- AUT-002: Trigger catalogue.
- AUT-003: Condition/filter rules.
- AUT-004: Action registry and permission checks.
- AUT-005: Delay/schedule and timezone.
- AUT-006: Idempotency/deduplication.
- AUT-007: Retry/backoff/dead-letter.
- AUT-008: Run log and audit.
- AUT-009: Dry-run/preview/approval.
- AUT-010: Enable/pause/version/clone.
- AUT-011: Cycle detection and rate limits.
- AUT-012: Provider outage and recovery.
- AUT-013: Automation templates.
- AUT-014: Safe cross-domain actions.

### 24.15. SANCI AI — AI
- AI-001: Provider/model registry.
- AI-002: Prompt/template versioning.
- AI-003: Intent and task planner.
- AI-004: Context selection and privacy filter.
- AI-005: Structured action schema.
- AI-006: Permission/ownership checker.
- AI-007: Diff/preview/approval workflow.
- AI-008: Execute through canonical API/commands.
- AI-009: Verification/audit/version/rollback.
- AI-010: Cost/quota/usage/error tracking.
- AI-011: Website structure/content assistant.
- AI-012: SEO/accessibility/localization suggestions.
- AI-013: Content title/script/description/thumbnail brief.
- AI-014: Transcript/chapter/highlight/clip candidates.
- AI-015: Stream diagnostics/summary where supported.
- AI-016: Specialist agent roles under shared permissions.
- AI-017: AI Control Center and approval queue.
- AI-018: Prompt injection and untrusted content tests.
- AI-019: Human approval for public/destructive/financial action.
- AI-020: AI-free fallback for all critical manual workflows.

### 24.16. Settings/security/operations — SEC / OPS
- SEC-001: Authentication/session lifecycle.
- SEC-002: Server-side RBAC and ownership.
- SEC-003: Site/workspace/tenant isolation.
- SEC-004: OAuth/CSRF/session security.
- SEC-005: XSS/sanitization/safe embeds.
- SEC-006: SSRF/open redirect/injection defenses.
- SEC-007: Rate limiting and abuse protection.
- SEC-008: Secret storage/redaction/rotation.
- SEC-009: Webhook signature/replay defense.
- SEC-010: Audit log and privacy.
- SEC-011: Consent/retention/export/delete.
- OPS-001: Health/deploy version.
- OPS-002: Structured logs/correlation IDs.
- OPS-003: Error tracking/alerting.
- OPS-004: Migration preflight/integrity.
- OPS-005: Backup/export/restore.
- OPS-006: Recovery drill and runbook.
- OPS-007: Diagnostics report.
- OPS-008: Performance baseline/cache/query monitoring.
- OPS-009: Rollback and incident procedure.
- OPS-010: Dependency/license/CVE review.
- OPS-011: Background-job/realtime runtime selection and lifecycle, only where justified.

### 24.17. Localization/team/marketplace/quality — LOC / TEAM / MKT / QA
- LOC-001: Translation key/fallback.
- LOC-002: Locale-aware dates/numbers/currency/timezone.
- LOC-003: Page/content/navigation translation.
- LOC-004: Localized SEO/hreflang/canonical.
- LOC-005: Translation completeness status, locale preview and safe publish policy.
- LOC-006: AI-assisted translation workflow with explicit human review/approval and audit.
- TEAM-001: Workspace/site switcher.
- TEAM-002: Invite/accept/revoke.
- TEAM-003: Roles and granular permissions.
- TEAM-004: Approval/review/activity feed.
- TEAM-005: Multi-site isolation.
- TEAM-006: SaaS billing/plan entitlements/quota.
- MKT-001: Extension manifest/permissions.
- MKT-002: Extension install/update/uninstall/migration.
- MKT-003: Theme/block/template/overlay marketplace.
- MKT-004: License/attribution/version/review.
- MKT-005: Marketplace payment/revenue-share after legal review.
- QA-001: Typecheck/build/CI gates.
- QA-002: Domain/API/integration tests.
- QA-003: Ownership/security negative tests.
- QA-004: Browser/device responsive acceptance.
- QA-005: Public SEO/accessibility/performance audit.
- QA-006: Production smoke and runtime verification.
- QA-007: Backup/restore/rollback acceptance.
- QA-008: End-to-end creator journey.
- QA-009: User acceptance and evidence log.
- QA-010: Continuous benchmark and feature-discovery review.

---


### 24.18. Site settings, dinamikus adatbinding és SEO — SET / DYN / SEO

Ezek a stabil ID-k azért szükségesek, mert a korábbi követelménykatalógus külön site settings, data source, binding-state és SEO-meta képességeket tartalmaz, amelyeket a korábbi WEB/EDT/INT ID-k nem fedtek le kellő pontossággal. Az ID-k a követelmény-nyilvántartás célpontjai; a létük nem jelent implementációs státuszt.

**SET — Site settings**
- SET-001: Canonical site settings schema és CRUD lifecycle.
- SET-002: Site ownership/scope és multi-site kompatibilitás.
- SET-003: Public-safe settings projection és secret/private mezők kizárása.

**DYN — Dinamikus adatforrás és binding**
- DYN-001: Canonical data source registry és provider/domain adapter.
- DYN-002: Binding schema, type validation és resource/field compatibility.
- DYN-003: Whitelisted transforms, filter, sort, limit és pagination.
- DYN-004: Feltételes rendering és adatfüggő visibility.
- DYN-005: Loading/empty/error/partial/stale állapotgép.
- DYN-006: Cache policy, freshness, invalidation és stale fallback.
- DYN-007: Permission, site scope és published-only data boundary.
- DYN-008: Binding diagnostics, preview, invalid-reference report és recovery.

**SEO — Search/social metadata**
- SEO-001: Per-page title, description, canonical URL és robots policy.
- SEO-002: Open Graph, X/Twitter card és social preview/image validation.
- SEO-003: Validált structured data/schema.org, ahol releváns.
- SEO-004: Sitemap és robots.txt lifecycle, publish/cache invalidation.
- SEO-005: SEO preview/diagnostics, duplicate/missing metadata és page-level audit.

**Függőségi szabály:** SET/DYN/SEO csak a canonical Page Model, Resource, domain ownership és publish contracton keresztül működhet. Ezek nem adhatnak alternatív persistence vagy publikálási útvonalat. A korábbi ID-k megmaradnak; a crosswalk az eredeti követelményt a legpontosabb új vagy meglévő ID-hoz rendeli.

## 25. Kötelező státuszmezők a funkciójegyzékben

Minden ID-hoz az alábbi mezők tartoznak a terv karbantartásakor:
- Status;
- Phase/priority;
- Menu/surface;
- Canonical domain owner;
- Data source;
- Permission;
- Dependencies;
- Implementation point;
- Tests;
- Negative tests;
- Live/user acceptance;
- Evidence;
- Known issues;
- Next action.

A státuszt nem szabad pusztán a kód jelenléte alapján átállítani. Ha egy funkció több részre bontható, az al-ID-k saját DoD-t kapnak, és a szülő csak akkor PASS, ha minden kötelező al-ID PASS vagy az elhagyás explicit, indokolt és dokumentált scope döntés.


## 26. Funkciószintű végrehajtási szerződés

Ez a fejezet a menü- és funkciójegyzéket végrehajtható specifikációvá teszi. A katalógusban felsorolt minden stabil ID csak akkor aktiválható implementációra, ha az alábbi szerződés minden mezője kitöltött. A hiányzó adat nem feltételezhető: P0-ban fel kell tárni a repositoryból, vagy nyitott döntésként meg kell jelölni.

### 26.1. Kötelező funkciókártya

Minden funkcióhoz egy önálló kártya tartozik:
1. **ID és név:** stabil, egyedi ID; megjelenített magyar név; esetleges belső technikai név.
2. **Felhasználói eredmény:** mit tud a felhasználó elvégezni, és miért.
3. **Belépési pont:** Admin menü/almenü, public route, Editor panel vagy rendszerfolyamat.
4. **Műveletek:** listázás, részletezés, létrehozás, módosítás, archiválás/törlés, keresés, szűrés, export, visszaállítás; csak az értelmes műveletek.
5. **Domain owner:** egyetlen szerveroldali üzleti domain, amely az adatot és a szabályokat birtokolja.
6. **Kanonikus adatforrás:** D1 táblák/repository/API vagy R2 object reference; a tényleges implementációs vizsgálat után pontosítandó.
7. **Séma és invariánsok:** kötelező mezők, validáció, egyediség, kapcsolatok, lifecycle, törlési/archiválási szabály.
8. **Jogosultság:** anonim, tulajdonos, szerkesztő, moderátor, pénzügyi/admin szerep vagy rendszer; szerveroldali ellenőrzés és site ownership.
9. **API/command szerződés:** request/response schema, hibakódok, idempotency, concurrency/revision policy, audit esemény.
10. **Függőségek:** előfeltétel-ID-k; blokkoló és nem blokkoló függőség külön.
11. **UI-állapotok:** loading, empty, partial, stale, validation, saving, success, error, retry, conflict, offline/permission denied.
12. **Biztonsági és adatvédelmi határ:** PII, secret, consent, retention, export/delete, injection, abuse, rate limit.
13. **Tesztcsomag:** unit/domain, API/integration, DB migration/integrity, authorization negative, browser/responsive, production smoke és user acceptance, ahol releváns.
14. **Elfogadási forgatókönyv:** kiinduló állapot → művelet → elvárt adatváltozás → reload/re-entry → minden megjelenítési hely ellenőrzése → hibaút.
15. **Bizonyíték:** commit, CI run, teszteredmény, runtime URL/ellenőrzés és felhasználói visszaigazolás; titkot nem tartalmazhat.
16. **Visszaállítás:** rollback, revision restore, kompenzáló művelet vagy egyértelműen indokolt irreverzibilis állapot.
17. **Státusz és következő lépés:** a 11. fejezet státuszaiból; egy aktív subpoint és explicit next point.

### 26.2. CRUD nem elég — életciklus és állapotátmenetek

A domainenkénti funkciók nem kezelhetők pusztán CRUD-ként. A funkciókártya sorolja fel a megengedett állapotátmeneteket, például:
- Page: draft → previewed → published; published → draft/unpublished; revision → restored draft.
- Connection: disconnected → authorization pending → connected → degraded/expired → reconnecting → connected; revoke/disconnect.
- Scheduled content: draft → scheduled → publishing → published/failed/cancelled; retry idempotensen.
- Product/order: draft → active/archived; order state csak a payment/order provider igazolt eseményéből változhat.
- Membership/entitlement: pending → active → past due/cancelled/expired/revoked, provider webhook és helyi policy alapján.
- Automation: draft → validated → enabled → paused/failed; minden run külön futási rekordot kap.
- AI action: proposed → schema validated → approval pending → approved → executing → verified/failed/rolled back.
- Asset: upload pending → validated/scanned → ready → referenced/archived/deleted; publikus URL csak kész, engedélyezett assetre mutathat.

Érvénytelen állapotátmenetnél a szerver utasítsa el a műveletet, és az UI ne mutasson sikeres állapotot.

### 26.3. Domainenkénti műveleti szerződések

#### ADM — Dashboard és Admin shell
- Művelet: valós domainállapotok összesítése, gyorslinkek, teendők, friss aktivitás.
- Adatforrás: saját domain read API-k vagy egy összesítő read model; nem külön, kézzel szerkeszthető másolat.
- Jogosultság: a felhasználó csak az általa kezelhető site adatait láthatja.
- Teszt: nincs kapcsolat / stale sync / nincs schedule / API részleges hibája / unauthorized / mobile viewport.
- PASS: minden kártya forrása és frissessége megállapítható; hibás alrendszer nem zöld; gyorsművelet a canonical modulhoz visz.

#### WEB — Oldalak, navigáció, public renderer és publikálás
- Művelet: page create/edit/duplicate/archive/delete, slug és hierarchy kezelés, navigation CRUD, preview, publish/unpublish, revision restore.
- Adatforrás: canonical Page Model, navigation model, draft revision és külön published snapshot.
- Jogosultság: server-side site ownership; public olvasás csak published állapotból.
- Teszt: draft save → reload; preview vs published; publish → public route; unpublish; revision restore; invalid slug; cross-site ID.
- PASS: draft mentés nem publikál; publish explicit; minden route canonical URL-t és megfelelő metadata-t ad; hibás/deleted reference biztonságos fallback.

#### EDT — Visual Editor
- Művelet: canvas selection/move/resize, hierarchy/layers, inspector, responsive viewport, undo/redo, clipboard/duplicate, preview, save/reload, publish handoff.
- Adatforrás: canonical Page Model és command/validation/history/persistence API; Inspector a Property Registry metadata-t használja.
- Jogosultság: page edit permission és site ownership minden mutationnél.
- Teszt: move/resize, undo/redo, viewport override set/reset, inherited value, invalid property, save/reload round-trip, revision conflict, publish snapshot, keyboard/touch, mobile/desktop.
- PASS: minden felület ugyanazt a page state-et módosítja; undo/redo és reset az adatot is helyreállítja; nincs elveszett mentés vagy automatikus publish.

#### DSN — Design system, theme, template, reusable component
- Művelet: design tokenek, theme variable, font, breakpoint, component definition, variant, template create/preview/apply/version/rollback.
- Adatforrás: canonical Design System/Template/Component registry; page-local override explicit.
- Teszt: token update több oldalon; component instance frissül; lokális override megmarad; template apply preview; rollback; invalid token/reference.
- PASS: globális módosítás minden hivatkozó instance-ra hat; override precedence dokumentált; nincs duplikált style key.

#### RES — Media/resource/icon/font/file registry
- Művelet: upload, validation, preview, search/filter/tag, metadata/alt text, replace, reference lookup, archive/delete, safe download.
- Adatforrás: D1 asset metadata + R2 object; stable asset ID; object key nem user által tetszőlegesen megadott path.
- Jogosultság: upload/manage site permission; privát resource letöltésnél entitlement/auth check.
- Teszt: MIME/size rejection, malformed file, duplicate, replace, referenced delete, R2 failure, unauthorized download, alt text and responsive images.
- PASS: metadata és bináris objektum konzisztens; törlés előtt reference check; privát fájl nem érhető el publikus URL-lel.

#### INT — Integrációs központ
- Művelet: connect, callback, status, scopes, reconnect, revoke/disconnect, sync, retry, last sync/error display.
- Adatforrás: egy canonical connection record/provider adapter; secrets encrypted/secret store; site-scoped ownership.
- Jogosultság: site admin/owner; OAuth state egyszer használatos, site-hoz kötött, lejáró és CSRF-védett.
- Teszt: valid/invalid/expired state, mismatched site, denied scopes, token refresh, provider outage, disconnect, retry, webhook replay.
- PASS: kapcsolódás nem az Editorban történik; minden más modul ugyanazt a státuszt olvassa; secret nem kerül kliensre vagy logba.

#### LIV/OBS — Live, stream és OBS
- Művelet: live status, provider/channel info, stream setup, overlays, OBS connection status, scene/event triggers csak elérhető és engedélyezett API-val.
- Adatforrás: connection domain + provider status/cache + overlay config; a cache frissessége jelölt.
- Teszt: offline, online, stale response, missing scope, OBS unavailable, invalid overlay config, reconnect.
- PASS: nem állít live állapotot régi adatból frissként; OBS-vezérlés csak explicit permission és jóváhagyás után; manuális fallback elérhető.

#### SCH — Adásrend és Game Profile
- Művelet: event CRUD/archive, timezone, recurrence, conflict detection, game selection, public display, countdown.
- Adatforrás: canonical schedule domain; game profile stable ID; timezone explicit, UTC tárolás és locale display policy.
- Teszt: DST transition, timezone change, recurrence edit-one/edit-series, overlap, past event, archived game reference, public cache invalidation.
- PASS: Admin, Dashboard, Editor block és public schedule ugyanazt az eventet mutatja; Page Model nem másolja az event rekordot.

#### CNT — Tartalom és Content Studio
- Művelet: content item create/edit/organize, platform target, draft/review/schedule/publish, VOD/clip/short links, metadata and reuse.
- Adatforrás: canonical content item + provider publishing job + external provider IDs.
- Teszt: unsupported provider capability, expired auth, duplicate publish, retry, media missing, invalid platform length, cancel scheduled publish.
- PASS: platformképesség ellenőrzött; retry nem dupláz; provider siker/hiba tényszerűen megjelenik; nincs állított publikálás provider confirmation nélkül.

#### COM — Community és audience
- Művelet: community links, posts/events, moderation, member roles where permitted, newsletter/audience subscription.
- Adatforrás: community domain és consented audience; provider member data csak permissionnel és policy alapján.
- Teszt: consent absent, unsubscribe, duplicate signup, abuse/rate limit, moderator vs admin, private member data, export/delete.
- PASS: adatminimalizálás és opt-in bizonyítható; leiratkozás érvényesül; nyilvános supporter név külön hozzájárulást igényel.

#### STO/SUP — Bolt, támogatás és tagság
- Művelet: product/catalog CRUD, order status, digital delivery, support link, membership tiers, entitlement grants/revokes, refund/cancel handling.
- Adatforrás: product/order/payment provider truth + canonical local mapping; entitlement domain adja a hozzáférés döntését.
- Jogosultság: pénzügyi/admin művelet külön; secret/payment data soha nem jelenik meg normál Admin read modelben.
- Teszt: duplicate webhook, payment pending/failed/refund, expired entitlement, unauthorized download, cancellation, provider outage.
- PASS: nincs saját kézi payment-state kitalálás; webhook idempotens; entitlement a valós eseményből változik; digitális termék hozzáférése visszavonható.

#### ANL/CAM — Analytics, kampány és szponzoráció
- Művelet: date range/filter/compare/export, campaign create, UTM/link mapping, media kit, sponsor leads/deal deliverables.
- Adatforrás: canonical event taxonomy, provider analytics adapter, campaign entity; minden mérőszám source/freshness/unit címkével.
- Teszt: missing metrics, timezone boundaries, duplicate events, bot traffic, consent denied, provider API changes, export access.
- PASS: becsült és mért adat külön; provider nélküli metric nem nullával vagy kitalált értékkel helyettesül; PII nem kerül aggregált riportba szükségtelenül.

#### AUT — Automatizáció
- Művelet: trigger/condition/action builder, dry-run, approve, enable/pause, version, run history, retry and dead-letter.
- Adatforrás: event registry, action registry, durable job/run log.
- Teszt: duplicate event, cycle, action permission removed, provider outage, timeout, retry exhaustion, timezone boundary, partial failure.
- PASS: minden action explicit allowlist; idempotency key; retry limit/backoff; pause megállítja a következő futást; run logból hiba diagnosztizálható.

#### AI — SANCI AI
- Művelet: plan/proposal, preview diff, structured action, approve/reject, execute, verify, rollback.
- Adatforrás: csak engedélyezett context; domain read APIs; változtatás canonical command/API útvonalon.
- Jogosultság: AI nem adhat magának permissiont; destructive/public/financial/deploy action explicit emberi approvalt igényel.
- Teszt: prompt injection, invalid schema, wrong site, stale context, quota exceeded, provider unavailable, action partial failure, rollback.
- PASS: nincs arbitrary code execution vagy secret access; minden mutation auditált; AI kikapcsolásakor a core kézi folyamatok működnek.

#### SEC/OPS — Biztonság, beállítások és üzemeltetés
- Művelet: auth/session, role/ownership, audit, health/version, alerts, migration preflight, backup/restore, incident response.
- Adatforrás: canonical identity/site ownership, structured logs and migration ledger; secrets külön kezelt.
- Teszt: unauthorized, cross-site, session expiry/revocation, rate limit, log redaction, migration rollback, restore integrity.
- PASS: least privilege; fail closed; migráció előre ellenőrzött; backup visszaállítható; incident/rollback dokumentált és próbált.

#### LOC/TEAM/MKT — Localization, teams and extensions
- Művelet: locale content, translation workflow, invites/roles, workspace switch, extension manifest/install/update/uninstall.
- Adatforrás: canonical locale/page data, membership/role model, versioned extension manifest.
- Teszt: fallback, missing translation, locale URL/SEO, revoked invite, cross-site permission, extension over-permission, failed update/uninstall.
- PASS: locale nem keveri a tartalmat; role server-en ellenőrzött; extension explicit permissiont kér; eltávolítás után nem marad árva adat vagy executable hook.

### 26.4. Általános negatív tesztkövetelmény
Minden mutációs domain legalább az alábbi negatív eseteket teszteli:
- hiányzó/hibás mező;
- lejárt vagy elégtelen jogosultság;
- másik site-hoz tartozó ID;
- stale/revision conflict;
- hálózati timeout és provider hiba;
- ismételt kérés/webhook;
- részleges mentési hiba;
- törlés/archiválás hivatkozott rekorddal;
- titok/PII nem kerül a válaszba vagy logba;
- reload után a tényleges állapot egyezik a sikerüzenettel.

---

## 27. Felhasználói végponttól végpontig folyamatok

A teljes platform csak akkor koherens, ha a modulok közötti folyamatok is működnek. Az alábbi journey-k külön end-to-end acceptance pontok.

### 27.1. Weboldal készítés és publikálás
1. Admin belépés és megfelelő site kiválasztása.
2. Oldal létrehozása sablonból vagy üresen.
3. Blokkok elhelyezése, rétegek és Inspector használata.
4. Globális design token és lokális override ellenőrzése.
5. Media asset kiválasztása és alt text megadása.
6. Mobil/tablet/desktop viewport ellenőrzés.
7. Undo/redo, mentés, reload, revision visszaállítás.
8. Preview ellenőrzés külön a publikált oldaltól.
9. SEO, canonical URL, Open Graph, internal link és accessibility check.
10. Explicit publish; publikus route és snapshot ellenőrzése.
11. Unpublish/rollback és cache invalidation ellenőrzése.
12. PASS: nincs adatvesztés, draft-szivárgás, hamis siker vagy hibás mobil layout.

### 27.2. Integráció és live státusz
1. Admin Kapcsolatok → provider kiválasztása.
2. Scope/permission magyarázat és OAuth indítás.
3. State/redirect/callback ellenőrzés, token biztonságos tárolása.
4. Kapcsolat állapota, last sync és provider account megjelenítése.
5. Dashboard, Live és Editor live block ugyanazt az állapotot olvassa.
6. Token expiry/provider outage esetén degraded state és reconnect.
7. Disconnect után minden felület azonos állapotot mutat.
8. PASS: nincs duplikált kapcsolat, cross-site bind vagy secret leakage.

### 27.3. Adásrend és játékprofil
1. Game profile kiválasztása vagy létrehozása.
2. Event létrehozása explicit timezone/recurrence beállítással.
3. Ütközés és DST ellenőrzés.
4. Dashboard és public schedule ellenőrzése.
5. Editor schedule block konfigurációja ugyanarra a domainre mutat.
6. Event módosítása után minden felület frissül.
7. PASS: nincs másolt event rekord, időzóna-hiba vagy stale publikus cache.

### 27.4. Tartalomtervezés és publikálás
1. Canonical content item létrehozása.
2. Media asset és platform target hozzárendelése.
3. Provider capability és mezőkorlát validáció.
4. Draft/review/scheduled állapot.
5. Publish job, provider response és external ID tárolása.
6. Retry/cancel/failure handling.
7. Public content center és analytics frissülése.
8. PASS: duplikált publish nincs, nem támogatott platformművelet nincs hamis sikerrel elfogadva.

### 27.5. Digitális termék és entitlement
1. Product draft létrehozása és fájl/asset hozzárendelése.
2. Ár, currency, tax/merchant-of-record és provider képesség döntése.
3. Preview és explicit aktiválás.
4. Teszt purchase/sandbox payment.
5. Provider által megerősített payment event → entitlement grant.
6. Biztonságos, jogosultság-ellenőrzött letöltés.
7. Refund/cancel/chargeback → entitlement policy alkalmazása.
8. PASS: secret nem szivárog; fizetési állapotot nem a kliens állítja; access visszavonható.

### 27.6. Automatizáció és AI
1. Trigger és action kiválasztása az engedélyezett registryből.
2. Dry-run: célrekordok és side effectek megjelenítése.
3. Permission, ownership, quota és cycle check.
4. Approval, ha szükséges.
5. Futtatás idempotencyvel és audit loggal.
6. Result verification, retry vagy rollback.
7. PASS: nincs nem engedélyezett művelet, rejtett side effect vagy meg nem erősített siker.

---

## 28. UI- és hibakezelési standard

Minden képernyő és művelet a következő szabályoknak felel meg:
- **Loading:** a felhasználó látja, hogy a rendszer dolgozik; duplikált submit tiltott.
- **Empty:** magyarázat + releváns első lépés; nem üres fehér panel.
- **Stale:** régi adat frissességi címkével; kritikus művelet előtt frissítés.
- **Partial failure:** működő részek látszanak, hibás részek egyértelműen elkülönülnek.
- **Validation:** mezőhöz kötött, magyarul érthető hiba; a megadott adat nem vész el.
- **Conflict:** megmutatja, hogy a szerveroldali revision eltér; explicit reload/merge választás.
- **Permission denied:** nincs részleges mutáció; megfelelő magyarázat.
- **Offline/timeout:** retry biztonságos és idempotens; a rendszer nem állít sikert.
- **Success:** csak a szerver/domain megerősítése után jelenhet meg.
- **Destructive action:** hatás és célrekord megnevezése, confirmation, audit és recovery policy.
- **Keyboard/touch:** minden fontos művelet fókuszolható, címkézett és elérhető.
- **Reduced motion:** animáció és mozgás a felhasználói preferenciát tiszteletben tartja.
- **Responsive:** kis mobil, nagy mobil, tablet, laptop és nagy desktop; horizontális overflow csak indokolt helyen.
- **Localization:** nyelv, dátum, idő, szám, pénznem és időzóna külön kezelendő.

---

## 29. Adatmodell- és lifecycle katalógus

A tényleges táblák neveit és meglévő migrációit P0/P1 alatt kell ellenőrizni; ez a logikai entitáskatalógus nem engedélyez új, párhuzamos táblák létrehozására.

- **Site/Workspace:** tulajdonos, konfiguráció, domain, locale, status.
- **Identity/Session/Role:** user, session, membership, permission, revocation.
- **Page/PageRevision/PublishedSnapshot:** szerkeszthető állapot, változattörténet, publikus snapshot.
- **Navigation/Menu:** sorrend, hierarchia, cél, visibility, locale.
- **DesignToken/Theme/Font:** globális vizuális szerződés.
- **Component/Template/ComponentInstance:** újrafelhasználható definíció és példány.
- **Asset/Resource:** metadata, R2 key, checksum, dimensions, visibility, references.
- **Integration/ProviderAccount/SyncRun/WebhookEvent:** connection, token reference, provider state, idempotency.
- **ScheduleEvent/GameProfile:** canonical event és game identity.
- **ContentItem/ContentTarget/PublishJob/ExternalContentRef:** tartalom és platformonkénti publikálás.
- **CommunityPost/Audience/Consent/Subscription:** közösségi tartalom és hozzájárulási állapot.
- **Product/Order/PaymentEvent/Entitlement/DownloadGrant:** commerce és hozzáférés.
- **AnalyticsEvent/Aggregate/Campaign/SponsorDeal:** mérés és üzleti folyamat.
- **AutomationDefinition/AutomationRun/ActionAudit:** workflow és futás.
- **AIJob/AIProposal/Approval/ActionResult:** AI javaslat és kontrollált végrehajtás.
- **Notification/EmailDelivery/SupportRequest:** üzenetküldés és delivery state.
- **AuditEvent/BackupManifest/RestoreRun/Incident:** üzemeltetési bizonyíték és helyreállítás.
- **ExtensionManifest/InstalledExtension/WorkspacePlan/UsageQuota:** későbbi bővíthetőség.

Minden entitásnál tisztázandó: owner/site scope, ID, unique constraint, FK, lifecycle, delete/archive policy, PII/secret classification, index, migration, retention, export/restore és audit.

---

## 30. Külső szolgáltatók integrációs döntési kapuja

Külső szolgáltató integrációja előtt egy provider kártya készül:
- hivatalos API és OAuth dokumentáció;
- aktuális scopes/permission és review requirements;
- create/read/update/delete/publish/webhook capability matrix;
- rate limits, quota, pagination, token expiry/refresh;
- sandbox/test account elérhetőség;
- data retention, privacy, export/delete;
- API versioning, deprecation és outage policy;
- region, latency, pricing, transaction fees és dependency lock-in;
- licence, branding, attribution és platform policy;
- retry/idempotency/webhook signature contract;
- manual fallback és disconnect behavior;
- acceptance teszt és bizonyíték.

Provider funkciót nem szabad a marketingoldal alapján biztosan megvalósíthatónak tekinteni. A capability matrix csak hivatalos dokumentáció vagy működő teszt után jelölhető VERIFIED. Ha nincs API vagy engedély, a felület csak egyértelmű külső linket vagy manuális folyamatot adhat; nem szimulálhat natív integrációt.

---

## 31. Külső benchmark — konkrét tanulságok és korlátok

A benchmark célja nem a konkurensek felületeinek másolása, hanem a felhasználói feladatok, minőségi elvárások és működő termékminták összevetése.

### 31.1. Vizuális weboldalépítők
- Framer mintája: canvas-központú tervezés, responsive layout, CMS, SEO, publikálás előtti ellenőrzés, staging/domain/redirect és lokalizáció.
- Webflow mintája: vizuális felépítés és strukturált CMS összekapcsolása, illetve integrációs ökoszisztéma.
- Átvétel a Sanci9517-ben: a canvas és CMS külön felelősség; reusable component és token; preview/publish gate; SEO/performance/accessibility ellenőrzés.
- Nem vehető át vakon: szolgáltatóhoz kötött hosting, fizetős csomag, CMS limit vagy provider-specifikus API.

### 31.2. Creator platformok és monetizáció
- Beacons mintája: Link Hub, creator storefront, digitális termék, email marketing és media kit/creator analytics.
- Fourthwall mintája: merch fulfillment, saját termék, digitális letöltés, tagság, támogatás és integrált creator homebase.
- Átvétel: külön link/campaign, product, entitlement, membership, audience consent és sponsor/media kit domain; egyértelmű díj- és provider-függőség.
- Nem vehető át vakon: díjszabás, payment flow, fulfillment, membership vagy platform entitlement; ezek jogi, pénzügyi és provider-függő döntések.

### 31.3. Minőség, akadálymentesség és biztonság
- W3C WAI/WCAG irányelvek: a hozzáférhetőség tervezési és tesztelési alap, nem utólagos kozmetika.
- OWASP Top 10:2025: külön figyelmet igényel a broken access control, security misconfiguration, supply-chain, crypto, injection, insecure design, auth, integrity, logging/alerting és exceptional condition handling.
- Átvétel: keyboard/focus/contrast/labels/reduced-motion, server-side authorization, input validation, secret redaction, dependency review, audit és negatív tesztek.
- Minden külső benchmarkot a Sanci9517 céljaira, költségére, stackjére, jogi környezetére és valós API-képességére kell szűrni.

### 31.4. Benchmark forrásnapló
- Framer Website Builder: https://www.framer.com/solutions/website-builder/
- Framer localization: https://www.framer.com/help/localization/
- Webflow CMS: https://eu.webflow.com/feature/cms
- Webflow integrations: https://webflow.com/integrations
- Beacons creator store: https://beacons.bio/i/app-pages/store
- Beacons updates/media kit: https://shop.beacons.ai/i/whats-new
- Fourthwall creator platform: https://fourthwall.com/creators
- Fourthwall memberships: https://fourthwall.com/memberships
- W3C Web Accessibility Initiative: https://www.w3.org/WAI/
- OWASP Top 10:2025: https://owasp.org/www-project-top-ten/

Az oldalakat a pont implementációja előtt újra ellenőrizni kell, mert a termékfunkciók, díjak, API-k és feltételek változhatnak. A benchmark állítása nem jelenti, hogy a funkció már megvalósult vagy jogilag/API szinten megvalósítható.

---

## 32. Teljességi és ellentmondásfeloldási kapu

Mielőtt P0 lezárul:
1. A teljes követelménykatalógus minden egyedi képességét a 24. fejezet valamely stabil ID-jához kell rendelni.
2. Minden korábbi funkcióról explicit döntés készül: megmarad, összevonás (azonos canonical domain mellett), későbbre ütemezés, vagy indokolt elutasítás. Az elutasítás oka, hatása és alternatívája rögzítendő.
3. Két hasonló nevű funkciót nem szabad automatikusan duplikátumnak tekinteni: a felhasználói cél, domain owner, lifecycle és adatforrás összehasonlítása kötelező.
4. A capability matrix és a menürendszer minden ID-ja kölcsönösen ellenőrizendő; árva ID és árva követelmény nem maradhat.
5. A jelenlegi működő kód és tesztállapot a P0 baseline bizonyítéka; a tervben lévő jövőbeli funkció nem jelölhető késznek.
6. A tényleges provider API hiánya nem törli a termékigényt: a capability státusza BLOCKED/EXTERNAL-DEPENDENCY, és manuális fallback tervezendő.
7. A teljes audit után egyetlen aktív pont marad. A következő pontnak konkrét fájlok, parancsok, tesztek, scope és PASS feltétel kell.
8. P0 lezárásakor a teljes terv tartalomjegyzéke, stabil ID-katalógusa és minden nyitott döntése validálva legyen; csak utána kezdődhet a következő fejlesztési pont.

---

## 33. Végrehajtási napló — kezdeti baseline (történeti snapshot)

**Megjegyzés:** az alábbi táblázat a terv összeállításakor rögzített kezdeti állapotot őrzi. Nem írja felül az aktuális státuszt; a jelenlegi P0 státusz egyetlen mérvadó helye a 37.3. fejezet, a friss bizonyítékok pedig a 37.4–37.8. fejezetben vannak.

| Pont | Állapot | Kötelező bizonyíték |
|---|---|---|
| P0.1 Tervintegritás és baseline | IN PROGRESS | Repo/branch/working tree, package scripts, valós tesztparancsok, aktív route, nyitott acceptance |
| P0.2 Követelmény- és funkciólefedettség | IN PROGRESS | 271 soros crosswalk elkészült; szemantikai felülvizsgálat és teljes feature contract még nyitott |
| P0.3 Domain- és adatforrás-térkép | IN PROGRESS | Kódszintű schema/consumer leltár részleges; R2 binding hiányzik, site_settings singleton és consumer gap nyitott |
| P0.4 Admin/public/Editor surface audit | IN PROGRESS | Fő route-ok, Admin placeholder-ek és Editor action-wiring első leltára megvan; minden surface acceptance még nyitott |
| P0.5 Provider/benchmark feasibility | IN PROGRESS | Hivatalos Twitch/YouTube/TikTok/Discord/Kick capability előszűrés rögzítve; feature-to-endpoint/scope/quota matrix nyitott |
| P0.6 Függőségi sorrend és acceptance freeze | IN PROGRESS | Domain-gate gerinc megvan; feature-ID szintű dependency/acceptance freeze nyitott |
| P0 | NOT PASS | P0.1–P0.6 mind PASS; nincs elveszett capability vagy nyitott kritikus ellentmondás |

A P0.x sorok dokumentációs/baseline feladatok, nem termékfeature-implementációk. A P0 lezárásáig a párhuzamos termékfejlesztés tiltott. A terv csak a tényleges ellenőrzés után frissítheti az állapotot.

## 34. Végső cél: teljes Brand & Creator Platform SANCI AI-val

Ez a terv nem pusztán streamer-weboldal vagy egy 1.0-s bemutatkozó oldal terve. A végső termék egy egységes, bővíthető **Brand & Creator Platform**, amely a személyes márkát, a publikus jelenlétet, a közönséget, a tartalomgyártást, a live működést, a bevételi modelleket és az AI-alapú munkafolyamatokat egy összefüggő rendszerbe szervezi.

### 34.1. A végső platform kötelező képességcsoportjai

- **Brand Identity & Brand OS:** márkanév, profilok, arculati tokenek, színek, tipográfia, logó- és médiakészlet, hangnem, márkairányelvek, kampányazonosítók, egységes márkamegjelenés minden csatornán és felületen.
- **Creator Website Platform:** vizuális weboldalépítő, oldalak, navigáció, rétegek és inspector, reszponzív nézetek, sablonok, újrafelhasználható komponensek, blokkok, CMS/tartalomtípusok, publikálás, domain/SEO/AEO, űrlapok, keresés, link hub és kampányoldalak.
- **Creator Control Center:** egységes Dashboard és külön Connections-központ; jogosultságok, állapotok, naplók, értesítések, hibák, szolgáltatói limitek és visszaállítási műveletek.
- **Creator Content Factory:** ötlet- és szerkesztőségi naptár, hosszú és rövid tartalom, VOD/clip/shorts munkafolyamatok, metaadatok, médiatár, verziók, jóváhagyás, időzítés, újrahasznosítás, publikálási állapot és csatornánkénti eredmények.
- **Live & Stream Operating System:** Twitch és további támogatott platformok, élő státusz, streamdiagnosztika, stream események, overlayek, alert, chat- és közösségi widgetek, botok, timer, poll, giveaway, loyalty, TTS és moderációs kapcsolódási pontok; OBS és ahol indokolt Stream Deck/egyéb vezérlőintegráció.
- **Community & Audience OS:** közösségi funkciók, audience identity, hozzájárulás és adatkezelés, támogatók, tagságok, szerepkörök, Discord-kapcsolatok, kampányok, védett tartalom és közösségi aktivitás.
- **Commerce & Creator Business:** digitális termékek, támogatás, tagság, előfizetés, merchandise-szolgáltató integráció, kuponok/kampányok, rendelési és entitlement-életciklus, szponzorációs pipeline, affiliate/kampánylinkek és pénzügyi események. A külső fizetési szolgáltatók csak külön biztonsági, jogi, díj- és megbízhatósági kapu után választhatók ki.
- **Analytics & Intelligence:** látogatottság, források, elköteleződés, tartalom- és streameredmények, konverzió, kampány, közösség és bevételi mutatók; magyarázható jelentések, export és adatmegőrzési szabályok.
- **Automation & Event System:** eseménybusz, triggerek, feltételek, műveletek, időzítések, webhookok, integrációs események, értesítések, hibakezelés, retry/idempotencia, jóváhagyás, szüneteltetés és vészleállítás.
- **SANCI AI / Creator Intelligence:** AI-copilot, specialista agentek, modell- és eszközregiszter, feladat- és kontextusválasztás, weboldal/komponens/tartalom generálása, szövegírás, SEO/AEO, alt text, fordítás, kampány- és streamtervezés, tartalom-újrahasznosítás, analitikaértelmezés, automatizációs munkafolyamatok és hibakeresés.
- **Platform & Ecosystem:** export/import, mentés/visszaállítás, multi-site/multi-brand, csapat és szerepkörök, entitlement/billing, bővítmények/marketplace, szolgáltatói adapterek, API/webhookok és későbbi SaaS-üzemeltetés.

### 34.2. AI biztonsági és működési szerződés

- Az AI javasolhat, tervezhet és előkészíthet, de az éles módosításoknak ugyanazon canonical command, permission, validation, persistence, revision/history és audit útvonalon kell haladniuk, mint a kézi műveleteknek.
- Az AI nem írhat közvetlenül D1-be vagy R2-be, nem kerülheti meg a jogosultságokat, nem tehet közzé automatikusan kockázatos műveletet külön engedélyezés nélkül, és nem kezelhet titkot promptként vagy naplózott szövegként.
- Különbséget kell tenni javaslat, előnézet, jóváhagyásra váró változtatás, végrehajtott művelet és ellenőrzött eredmény között.
- Legyen költségkeret, kvóta, rate limit, timeout, megszakítás, modell-/szolgáltató-váltás, visszavonás ahol lehetséges, auditnyom, prompt-injection elleni védelem, adatminimalizálás és felhasználói kontroll.
- A több lépéses agentfeladatnak explicit tervet, eszközengedélyeket, ellenőrzési pontokat, hibakezelést és eredmény-összefoglalót kell adnia. Magas kockázatú művelethez emberi jóváhagyás kötelező.
- Az AI nem lehet a platform egyetlen működési útja: minden kritikus funkciónak legyen manuális vagy szabályalapú alternatívája, és AI-kieséskor a core platform maradjon használható.

### 34.3. Márka és creator-élmény egységessége

- A márkaidentitás ne csak a publikus weboldalon jelenjen meg: a Dashboard, Editor, media library, tartalomtervező, stream overlayek, kampányok és AI-kimenetek is közös design tokeneket és brand-kontextust használjanak.
- A brand-kontextus verziózott és felhasználó által módosítható legyen; az AI által javasolt változás előnézhető és jóváhagyható.
- A platformnak támogatnia kell a magyar nyelvű elsődleges élményt, a későbbi többnyelvű bővítést, a lokalizált dátum-/idő-/pénznem-formátumokat, az akadálymentességet és a mobilon is végrehajtható fő feladatokat.
- A funkciók külön modulok, de közös domain-szerződések, design system, jogosultság, audit, hibakezelés és navigáció alatt működjenek; nem jöhet létre egymástól független, duplikált miniappok halmaza.

## 35. Kötelező történeti funkciólefedettségi zár

**A végső terv akkor tekinthető teljesnek, ha nemcsak a jelenlegi funkciókatalógus részletes, hanem minden korábbi követelménycsalád tételesen össze van egyeztetve ezzel a tervvel és a jelenlegi repositoryval.** A dokumentum jelenlegi létezése vagy terjedelme önmagában nem bizonyítja ezt.

### 35.1. Kötelező reconciliációs állapotok

Minden megtalált funkcióhoz pontosan egy fő döntés tartozzon:
- **KEEP** — megőrzendő, azonos célú képességként jelenik meg a végleges katalógusban.
- **MERGE** — másik azonos vagy átfedő képességgel összevonva, a külön követelmény és annak elfogadása továbbra is nyomon követhető.
- **EXPAND** — korábbi képesség megtartva, részletesebb vagy szélesebb végrehajtási szerződéssel.
- **DEFER** — megőrzendő, de későbbi függőségi szakaszra ütemezett.
- **REPLACE** — más megoldás váltja ki; a régi viselkedés, migráció, kompatibilitás és regresszió külön bizonyítandó.
- **REJECT** — csak dokumentált indokkal, biztonsági/jogi/technikai indoklással és a termékhatás rögzítésével.

Egyetlen korábbi képesség sem tekinthető lefedettnek pusztán azért, mert a témája szerepel egy fejezetcímben. A konkrét művelet, állapotok, adatgazda, jogosultság, hibák és elfogadási feltételek is szükségesek.

### 35.2. Tételesen ellenőrizendő követelménycsaládok

- Weboldal és brand: oldalak, rétegek, navigáció, komponens- és template-rendszer, theme, design tokenek, responsive/editor interakciók, creator profile, Link Hub, kampány- és eseményoldalak.
- Erőforrások: fájlok, képek, videók, hangok, ikonok, fontok, R2-objektumok, metaadatok, transzformációk, feltöltési állapotok, újrafelhasználás, jogosultság és takarítás.
- Stream és interakció: platformkapcsolatok, OBS, overlay, Stream Deck, alert, chat, chatbot, timer, poll, giveaway, loyalty, TTS, moderáció, streamdiagnosztika és emergency controls.
- Tartalom és terjesztés: CMS, cikkek, VOD, clip, Shorts, platformonkénti publikálás, ütemezés, újrahasznosítás, jóváhagyás, verziózás, keresés és archívum.
- Közösség és identitás: audience identity, consent, adatmegőrzés/törlés, supporter, founding supporters, tagság, Discord-szerepkörök, protected downloads és jogosultság-ellenőrzés.
- Monetizáció: bolt, digitális termék, merchandise, támogatás, tagság, előfizetés, kupon, affiliate/UTM, kampány, szponzoráció, rendelés és entitlement-életciklus.
- Automatizáció: event bus, triggerek, feltételek, műveletek, időzítés, webhook, retry, idempotencia, deduplikáció, dead-letter/hibaállapot, jóváhagyás, visszavonás és vészleállítás.
- AI: orchestrator, specialist agentek, model/tool registry, context selector, permission checker, approval flow, execution verification, recovery, multi-model routing, költség- és adatvédelmi korlátok.
- Platform: auth, site ownership, több site/brand, csapat, billing/entitlements, API, import/export, backup/restore, diagnosztika, observability, bővítmények/marketplace és kompatibilitási politika.
- Minőség: mobil/tablet/desktop, billentyűzet és képernyőolvasó, reduced motion, SEO/AEO, teljesítmény, biztonság, adatvédelem, rate limit, audit log, hozzáférés-visszavonás, katasztrófa-helyreállítás, regresszió és kiadási rollback.

### 35.3. A lefedettségi nyilvántartás kötelező mezői

Minden egyes követelmény külön stabil ID-val rendelkezzen, és legalább a következő mezőket tartalmazza: rövid név; felhasználói eredmény; eredeti követelmény pontos helye/azonosítója; végleges fejezet és funkció-ID; KEEP/MERGE/EXPAND/DEFER/REPLACE/REJECT döntés; domain owner; canonical adatforrás; függőségek; státusz; teszt/elfogadási forgatókönyv; bizonyíték; nyitott kérdés. A forráshely megőrzése belső nyomon követésre szolgál; a végrehajtási igazságforrás továbbra is ez a dokumentum.

### 35.4. PASS feltétel

A történeti lefedettségi kapu csak akkor PASS, ha:
1. minden elérhető korábbi tervet, backlogot, auditot és releváns repository-dokumentumot felkutattunk;
2. a követelményeket ténylegesen, tételesen összevetettük, nem emlékezetből;
3. nincs megmagyarázatlan hiány, duplikáció, ütközés vagy árva funkció;
4. minden összevonás és kiváltás megőrzi a követelmény nyomon követhetőségét;
5. a végleges funkciók függőségi sorrendje, tulajdonosa és acceptance-e egyértelmű;
6. a terv és a tényleges kód/runtime közötti különbség külön jelölve van;
7. a záróellenőrzést és annak bizonyítékát a végrehajtási napló rögzíti.

Amíg ez nincs teljesítve, a terv **a végleges cél- és végrehajtási keret**, de a „minden korábbi funkció teljesen reconciliálva” állítás nem tehető meg.

## 36. A végleges terv és a megvalósulás közti különbség

- **A végső termékvízió végleges:** a cél a teljes Brand & Creator Platform SANCI AI-val, nem csak a korai weboldal.
- **A dokumentum az egyetlen aktív terv:** minden jövőbeli feladat, prioritás, függőség és döntés itt kap helyet.
- **A lefedettség lezárása bizonyítékhoz kötött:** az összes korábbi terv és a repository tételes egyeztetése még a P0 része; ezt nem lehet feltételezni.
- **A fejlesztés nem indulhat előre a kapukon:** P0 lezárásáig új termékfeature implementációja tilos; csak a terv, a leltár, a baseline és a követelmény-lefedettség tisztázható.
- **A teljes platform nem egyetlen kiadás:** a stabil alap, a creator weboldal és brand, a többplatformos működés, a monetizáció és a SANCI AI egymásra épülő, külön elfogadási feltételekkel rendelkező szakaszokban készül.

## 37. P0.1/P0.2 — Repositoryterv-leltár és feltárt ellenőrzési feladatok

### 37.1. Ellenőrzött repository-leltár

**Ellenőrzés dátuma:** 2026-10-13  
**Vizsgált ág:** `v2/foundation`  
**Leltár eredménye:** 192 repository-fájl a nem csonkolt recursive Git tree alapján. A kanonikus terv mellett a tervjellegű dokumentumok a dokumentációs archívumban vannak; az aktuális fejlesztési napló külön marad. A régi összesített MASTER-pillanatkép 5 161 soros, 686 481 karakteres, 283 címsorral. Ez a méretkülönbség miatt önmagában nem bizonyítja, hogy minden régi követelmény átkerült az új katalógusba.

Ez **leltárbizonyíték, nem történeti lefedettségi PASS**. A fájlok megtalálása és archiválása nem helyettesíti a tartalmi összehasonlítást. A P0.1 csak akkor zárható le, ha az aktív ág, a tervverzió, az archiválási állapot, a nyitott kérdések és a folytatási pont egyértelműek; a P0.2 csak a követelményenkénti leképezés után zárható le.

### 37.2. Kötelezően ellenőrzendő képességcsoportok

PWA/offline/mobile; provider capabilities/Discord roles; email/CRM/consent; Stream Deck; alert/chatbot/timer/poll/giveaway/loyalty/TTS/moderation; VOD→clip→Shorts→approval→publish→analytics; media processing/resumable upload; event/queue/webhook retry/idempotency/dead-letter/emergency stop; creator-type/brand-kit; payment/refund/entitlement; import/export/backup/restore; AI model routing/approval/verification/cost; observability/accessibility/reduced-motion/performance/rollback. Every group needs operation, owner, permission, errors, dependencies, tests and acceptance.
 
### 37.3. A P0 aktuális állapota

- **P0.1:** IN PROGRESS — nem PASS, de jelenleg nem aktív párhuzamos munkaszál; a branch/MASTER/archive baseline és a fő route-viselkedés ellenőrizve; az archív route-leírás javítva és a canonical Admin/Dashboard vs Editor v2 útvonal egyeztetve. A commit `a083cf879c3dd15e565cffeb7556dac6d4728faa` ellenőrzésekor a Cloudflare Workers Build, Editor Core Test és Twitch Integration Check mind SUCCESS lett. Az Editor Core workflow typecheck + Editor + Schedule + domain + Admin-home contract tesztet futtat; a Twitch workflow typecheck + Editor/Schedule + Twitch OAuth + site-ownership teszteket futtat. A gate azért marad nyitva, mert a teljes helyi working-tree állapot, a remote D1/schema integritás, valamint a save/reload/publish/mobile browser acceptance ebből a forráskód-auditból nem bizonyítható.
- **P0.2:** IN PROGRESS — **AKTÍV**. A 271 H19–H34 történeti kulcs MAPPED DRAFT crosswalkja (§41) megvan. A 00.9.6.E.2–E.21 és F.1–F.13 részletes crosswalkja §37.22–37.30 között halad; az eddig validált E/F táblák 323 mapping sort tartalmaznak, a hivatkozott feature/QA ID-k mind feloldhatók. A teljes E.1/C.23/C.24 és korábbi 00/A bullet-szintű provenance, a 359 feature ID kétirányú eredetbesorolása, a döntésindoklás és az ID-nkénti permission/dependency/acceptance contract még nyitott. Ezért P0.2 továbbra sem PASS.
- **P0.3:** IN PROGRESS — a migrációk és Page Model runtime forrásának első összevetése elkészült (§37.15); nyitott a remote D1 alkalmazott migrációk/séma/index/FK ellenőrzése, a teljes tábla-consumer térkép, a site-scope döntések és az R2 binding/resource API hiánya.
- **P0.4:** IN PROGRESS — a fő router, Admin placeholder-ek és Editor handler modulok első leltára megvan; a teljes surface/route/action acceptance még nyitott. A felhasználó által jelzett canvas-height/scroll-extent regresszió külön, reprodukálható acceptance-ként rögzítve (§37.21), de runtime PASS nincs.
- **P0.5:** IN PROGRESS — Twitch/YouTube/TikTok/Discord/Kick hivatalos dokumentációs review és approval/quota/runtime korlátok frissítve (§37.10, §37.14); a teljes feature-to-endpoint/scope/quota/approval mátrix és élő integrációs acceptance még nyitott.
- **P0.6:** IN PROGRESS — a domain-szintű függőségi gerinc rögzítve; a teljes feature-ID szintű dependency/acceptance freeze még nyitott.

P0 csak minden kapu bizonyítékalapú PASS-a után zárható.

### 37.4. P0.3 — Első, kóddal igazolt domain- és adatforrás-leltár

**Ellenőrzési forrás:** src/index.ts, src/routes/admin/pages.ts, src/routes/admin/editor.ts, src/routes/admin/schedule.ts, src/routes/admin/settings.ts, src/routes/public/pages.ts, src/routes/public/schedule.ts, src/routes/public/site-settings.ts, src/routes/integrations/twitch.ts, src/core/page-model.ts, src/core/schedule/types.ts, valamint a migrációk. Ez a repository-forrásból származó leltár, nem éles adatbázis-lekérdezés és nem teljes domain PASS.

| Domain / funkció | Jelenleg igazolt canonical adatforrás | Owner / scope a kódban | Érintett útvonalak | Bizonyított korlát / nyitott feladat |
|---|---|---|---|---|
| Page / Editor dokumentum | D1 pages.content_json; publikált snapshot: pages.published_content_json; revision: editor_revisions | Page Model / Editor; page lekérdezések site_id szerint szűrnek | /api/admin/pages, /api/admin/editor, /api/public/pages, /p/*, / | A draft és published snapshot külön kezelése látható a kódban; teljes mentés/újratöltés/preview/publish/rollback acceptance még külön bizonyítandó. |
| Adásrend | D1 schedule_items; Twitch sync típusok és source-adatok a schedule domainben | Schedule; admin olvasás/írás site_id szerint; public olvasás a readPublicSchedule szolgáltatáson át | /api/admin/schedule, /api/public/schedule, /api/admin/twitch/schedule-sync | A canonical kézi schedule CRUD és public read útvonal igazolt; minden recurrence, iCal és teljes edge-case acceptance nem igazolt. |
| Site settings | D1 site_settings, jelenleg key='site' rekord | Admin settings csak admin szereppel; a jelenlegi olvasás/írás nem site_id-paraméteres | /api/admin/settings, /api/public/site-settings | **P0.3 nyitott döntés:** a jelenlegi singleton beállítás és a jövőbeli multi-site/site ownership modell közötti kapcsolatot explicit módon rögzíteni kell; nem szabad a több site-os működést késznek feltételezni. |
| Twitch kapcsolat/OAuth | D1 Twitch connection/state táblák; OAuth állapot és connection site/user ownership-ellenőrzéssel | Integration adapter; site + user kapcsolatellenőrzés | /api/integrations/twitch/* | A Twitch útvonalak regisztrálva vannak; más provider adapterek nem következnek ebből, és nem jelölhetők implementáltnak pusztán a roadmap alapján. |
| Authentication / role | Session/auth útvonalak és szerveroldali getAuthenticatedUser / hasRole ellenőrzések | Auth/session + role check | /api/auth/*, Admin API-k | A route-kód több Admin API-n szerveroldali szerepellenőrzést tartalmaz; teljes RBAC/CSRF/session/security audit még külön feladat. |
| Asset / Resource | D1 `media` metadata tábla + `object_key`; `src/types/env.ts` deklarál `MEDIA: R2Bucket` mezőt | **Konfigurációs eltérés:** a `wrangler.jsonc` jelenlegi verziójában nincs `r2_buckets` binding, a fő routerben nincs media/resource API route, és a vizsgált aktív route-okban nincs `env.MEDIA` használat | Editor asset UI és D1 schema létezik; ez nem igazolja a működő R2 binary path-ot | **P0.3/P0.6 blocker:** rögzíteni kell a tényleges bucket/binding nevét és environmentet, a wrangler bindinget, upload/download/delete route-okat, authorizationt, object lifecycle-t és usage mapet; ezeket deploy és runtime acceptance nélkül nem lehet késznek jelölni. |
| Content / community / commerce / analytics / automation / SANCI AI | A tervben szereplő jövőbeli domainek | A jelenlegi Worker routerből nem igazolt teljes canonical backend | Nincs teljes domain-route készlet a jelenlegi regisztrált útvonalak között | Ezeket PLANNED/PHASED státuszban kell tartani, amíg kód, adatmodell, permission, teszt és runtime acceptance nem bizonyítja őket. |

**P0.3 site-scope finding:** a migrációk `site_id` mezőt adnak több üzleti táblához, de a `pages.slug` globálisan UNIQUE; a `site_settings` globális key/value singleton; a `design_tokens`/`editor_components` nem site-scoped; az `audit_log` nem tartalmaz külön site_id mezőt; a `users` táblához nincs explicit site-membership táblázat a vizsgált migrációs láncban. Emellett a `twitch_connections.broadcaster_id` globálisan UNIQUE, a schedule forrásazonosság egyedisége pedig a `(source, source_account_id, source_id)` indexen alapul, `site_id` nélkül. Ezek lehetnek tudatos globális invariánsok, de a policy-t explicit módon ki kell mondani, és a multi-site cross-boundary negatív tesztekkel bizonyítani kell. Ez nem bizonyít automatikusan 1.0 hibát, de kizárja azt az állítást, hogy a teljes multi-tenant SaaS scope már kész. A tenant policy és unique-key invariánsoknak a 4.0/team gate előtt döntést kell kapniuk.

**P0.3 kiemelt blocker:** az `Env.MEDIA: R2Bucket` típusdeklaráció önmagában nem hoz létre Cloudflare R2 bindinget. A vizsgált `wrangler.jsonc` csak `ASSETS` és `DB` bindinget deklarál; a `MEDIA` R2 bucket nincs konfigurálva, és a fő router nem regisztrál Resource/media API-t. A canonical Resource domain ezért jelenleg tervezési cél, nem igazolt működő R2 upload/download rendszer. A fájlnevek vagy UI-elemek nem bizonyítanak domainkészültséget. A következő leltári körnek az összes migrációt, D1-táblát/indexet/foreign key-t, D1-olvasó/író consumer-t, R2 object-key/metadata útvonalat és site ownership határt kell összekapcsolnia; az éles D1 állapotot csak külön élő lekérdezés bizonyíthatja.

### 37.5. P0.4 — Első, kóddal igazolt route- és surface-leltár

**Router-forrás:** src/index.ts a v2/foundation ágon. Ez a regisztrált Worker-útvonalak listája; a statikus HTML-en belüli minden menüelem és kattintható művelet teljes auditja még hátravan.

| Surface / route | Jelenlegi cél | Besorolás | Bizonyíték / nyitott kérdés |
|---|---|---|---|
| /, /index.html | public/visual-page.html | Canonical public renderer entry | A publikus oldal dinamikus oldaltartalmat a public pages API-val olvas; a teljes public route/SEO/404 acceptance nyitott. |
| /p/* | public/visual-page.html | Canonical public page route family | A Page Modelből renderel; a published-only API szabály és az egyes oldalak állapota külön tesztelendő. |
| /admin/login | public/admin-login.html | Canonical login surface | /admin-login.html 302-vel ide irányít. |
| /admin | public/admin-home.html, hitelesítés után | Canonical Admin home/dashboard | A korábbi eltérés feloldva: docs/ARCHIVE-LEGACY-LAYERS.md most a src/index.ts és tests/admin-home-contract.test.js által igazolt route-szerződést rögzíti. `/admin/editor` külön, autentikált Editor v2 belépés; a régi `/admin.html` kompatibilitási redirect `/admin`-ra. |
| /admin/editor | public/editor-v2/index.html, hitelesítés után | Canonical Visual Editor v2 entry | Egyetlen canonical Editor marad; a régi Editor nem aktiválható párhuzamosan. |
| /admin/home, /admin-home.html, /admin.html | /admin | Compatibility redirect | A végső redirect-szerződés és teszt még a P0 része. |
| /about.html, /community.html, /contact.html, /schedule.html, /tiktok.html, /twitch.html, /vod.html, /youtube.html | megfelelő /p/* slug | Legacy public redirects | Meg kell őrizni és regresszióval tesztelni, amíg a tervben lévő redirect/404 policy nincs lezárva. |
| /api/auth/* | bootstrap/login/logout/session | Canonical auth API family | Módszer-, session-, CSRF- és rate-limit audit a security kapu része. |
| /api/admin/pages, /api/admin/editor, /api/admin/schedule, /api/admin/settings, /api/admin/twitch/schedule-sync | Admin CRUD / Editor persistence / settings / sync | Registered admin API | A kódban szerep- és/vagy site-scope ellenőrzés látható; endpointonkénti permission/method/error teszt kell. |
| /api/public/pages, /api/public/schedule, /api/public/site-settings | public data APIs | Registered public API | Draft leak, cache, stale/error és site scope teszt szükséges. |
| /api/integrations/twitch/* | Twitch diagnostic/connect/callback/connection/validation/disconnect | Registered provider integration | Csak Twitch regisztrált; YouTube/TikTok/Discord/Kick/OBS capabilityt külön kell bizonyítani. |
| /api/health, /api/db-health | health / D1 health | Operational endpoints | Éles státusz csak aktuális production probe-ból állítható. |
| public/editor/ | régi Editor runtime | Legacy, nem canonical | Az archívum ezt külön rétegként nevezi meg; ne bővítsük, ne szolgáljon második Editor-alapként. |
| public/assets/system-page-editor.js, public/assets/system-page-runtime.js, src/routes/admin/system-pages.ts, src/routes/public/system-pages.ts | korábbi system-page megoldás | Legacy/unregistered route modules per router/archive | A kapcsolódó adatot és migrációs történetet nem töröljük külön adatmegőrzési/migrációs kapu előtt. |

**P0.4 még nem PASS:** a statikus route-ok és a legfontosabb backend API-k leltára nem fedi le automatikusan az Admin HTML minden menüpontját, a publikus dinamikus blokkokat, az Editor minden műveletét vagy a placeholder gombokat. A következő körnek a public/admin-home.html, public/editor-v2/index.html, public/editor-v2/app.js, public/visual-page.html és minden releváns script action/route hivatkozásait kell ellenőriznie.

### 37.6. Következő bizonyítékhoz kötött feladatok

1. P0.1: a route/dokumentáció eltérés feloldva és az archív rétegdokumentum frissítve; még hátra van a local working-tree, remote D1 és browser save/reload/publish/mobile acceptance bizonyítása.
2. P0.2: minden H19–H34 követelményhez külön crosswalk sor: eredeti kulcs + pontos címke + végleges funkció-ID + döntés (KEEP/MERGE/EXPAND/DEFER/REPLACE/REJECT) + domain owner + fázis + elfogadási bizonyíték vagy nyitott ok. A témacsoport-szintű megfeleltetés nem elég.
3. P0.3: összes migráció és D1/R2 consumer leltára; minden domainhez canonical owner/source, scope, lifecycle, permission és consumer.
4. P0.4: minden Admin menüpont, public route/block és Editor action/placeholder/legacy surface tételes ellenőrzése.
5. P0.5–P0.6 csak az előző evidence körök után zárható.



### 37.7. P0.4 — Admin menü és ténylegesen elérhető munkaterületek

**Ellenőrzött forrás:** public/admin-home.html, public/editor-v2/index.html, public/editor-v2/app.js és src/index.ts. A következő táblázat a jelenlegi UI-ban látható menü és a tényleges elérhetőség közti különbséget rögzíti. A felületi felirat önmagában nem igazolja a teljes backend capabilityt.

| Admin felületi elem | HTML/route állapot | Jelenlegi besorolás | Kötelező következő ellenőrzés |
|---|---|---|---|
| Kezdőlap | Aktív link /admin → public/admin-home.html | Elérhető Admin home | A Dashboard minden számlálójának és állapotának forrását, frissességét, hibakezelését és API-függését ellenőrizni. |
| Weboldal szerkesztése | Aktív link /admin/editor | Canonical Editor v2 belépés | A save/reload/preview/publish/unpublish/conflict/rollback útvonalak külön acceptance-e. |
| Adásrend | Aktív link az Editor v2-re; Editorban külön Adásrend tab | Meglévő canonical Schedule útvonal, nem külön Admin app | A Schedule UI és az admin/public API közös domainjének regressziós ellenőrzése. |
| Oldalak és tartalom | Aktív link az Editor v2-re | Editor által kezelt Page Model; külön CMS/content studio nincs igazolva | A tervben szereplő tartalomkezelési bővítéseket külön CNT capabilityként kell kezelni. |
| Média és erőforrások | HTML-ben disabled gomb, „Tervezett” címkével | Placeholder / nem elérhető munkaterület | Nem szabad késznek jelölni; Resource API, upload, registry és usage-map audit szükséges. |
| Design Studio | Disabled gomb, „Tervezett” | Placeholder | Design token/template/component domain még külön contractot igényel. |
| Stream Studio | Disabled gomb, „Tervezett” | Placeholder | OBS/overlay/alert funkciók külön fázis és provider/permission contract. |
| Publikálás | Disabled gomb, „Tervezett”; a tényleges Editorban van publish művelet | Admin menü-placeholder, de Editor publish művelet létezik | Külön kell választani az Editor page-publish-t a jövőbeli többplatformos content-publishingtól. |
| Közösség, Analitika, Üzlet és tagság, Közönség és e-mail, Automatizálás | Disabled gombok | Placeholder / tervezett | Nincs igazolt teljes modul-backend; roadmapban megőrzendők. |
| Integrációk | Disabled Admin menügomb, de Twitch connection kezelőgomb létezik az Editorban és Twitch API-k regisztráltak | Részben működő Twitch-integráció, még nem teljes Connections Center | A kapcsolatok önálló canonical Admin moduljának route/UI/permission/health/sync history szerződése hiányzik. |
| VOD és rövid videók, AI-asszisztens, Beállítások és biztonság, Nyelvek és lokalizáció, Fejlesztői eszközök | Disabled gombok | Placeholder / későbbi fázis | A jövőbeli igényeket nem szabad a menü jelenléte miatt implementáltnak minősíteni. |
| Editor: undo/redo, preview, save, publish/unpublish, konfliktus export/újratöltés, Oldalak/Elemek/Rétegek/Adásrend tab, canvas zoom/fit, Inspector és mobil műveletsor | public/editor-v2/index.html kontrolljai és app.js | Kódolvasással igazolt UI-elemek; a teljes működés nincs automatikusan bizonyítva | Minden actionhez event-handler → command/API → persistence → teszt → browser acceptance láncot kell ellenőrizni. |

**UI-állapot szabály:** a disabled „Tervezett” menüelem hasznos termék-roadmap jelzés, nem hiba és nem kész funkció. A következő felület-audit külön listázza az aktív, disabled, csak vizuális, hiányzó handlerű, hibás célra mutató és API nélküli műveleteket.

### 37.8. P0.3 — Migrációkból igazolt első D1 tábla- és ownership-leltár

A migrációk kódja alapján az alábbi adatobjektumok jelen vannak a schema-történetben. Ez nem helyettesíti a távoli D1 aktuális sémájának lekérdezését, a foreign key ellenőrzést vagy az összes runtime consumer feltérképezését.

| Tábla / objektum | Bizonyított szerep a migrációs lánc alapján | Végső állapot / nyitott ellenőrzés |
|---|---|---|
| users, sessions | Felhasználók, szerepek és sessionök | Auth domain; session lejárat, revocation, cookie/security és cleanup acceptance nyitott. |
| sites | Site ownership alap | A sites tábla létezik; minden tenant runtime enforcement és alapértelmezett site kiválasztása külön ellenőrzendő. |
| pages | Canonical oldalak, content_json, published snapshot, is_published, sort_order, site_id | 0017 újraépíti, site_id NOT NULL és sites FK; az aktuális remote D1 schema külön lekérdezéssel igazolandó. |
| editor_revisions | Oldalverziók, dokumentum JSON, szerző/időbélyeg és page FK | 0017 újraépíti a pages FK-ciklus kezelése mellett; a törlési/retention/rollback szerződés tesztelendő. |
| schedule_items | Canonical adásrend; source, source_presence, recurring és site_id mezők | 0017 schedule_items_v2 táblából visszanevezi canonical schedule_items-re; a végső név nem schedule_items_v2. |
| media | Metaadat, object_key, original_name, MIME, size, alt text, site_id | 0017 media_v2-ről visszanevezi media-re; R2 upload/download/delete és usage-map consumer audit nyitott. |
| social_accounts | Külső social profil metadata és láthatóság/sorrend | 0017 social_accounts_v2-ről visszanevezi social_accounts-re; teljes provider adapter-képesség nem következik a táblából. |
| twitch_connections | Titkosított tokenmezők, broadcaster, status, refresh lock, site_id | 0017 twitch_connections_v2-ről visszanevezi twitch_connections-re; token-életciklus és remote ownership acceptance nyitott. |
| twitch_oauth_states | Hash-elt OAuth state, user, expiry és site_id | 0017 twitch_oauth_states_v2-ről visszanevezi twitch_oauth_states-re; lejárat/cleanup és replay-negative teszt nyitott. |
| schedule_sync_state | Twitch/schedule sync státusz és utolsó futás/szinkron eredmény | 0013 hozza létre; minden mező fogyasztóját, retry-t és státuszváltást a sync service-szel egyeztetni kell. |
| site_settings | Webhely-beállítások, jelenleg key='site' rekord | Jelenlegi route key-alapú singleton; site_id-scope hiánya nyitott multi-site döntés. |
| design_tokens, editor_components, editor_preferences | Korábbi Editor/platform design és preference adatok | A design_tokens név UNIQUE és a design_tokens/editor_components táblákban nincs site_id; az editor_preferences user_id szerint scoped. El kell dönteni, hogy az első kettő rendszer-global vagy site-scoped legyen, mielőtt G4/multi-site fejlesztés indul. Aktív API/UI consumer és lifecycle nincs ebből önmagában igazolva. |
| system_page_content | Korábbi system-page tartalom | A migrációs láncban létrehozott legacy adatobjektum; a hozzá kapcsolódó route modulok nem regisztráltak a fő routerben. Törlés/migráció előtt adatmegőrzési döntés kell. |
| audit_log | Audit események | Az alapmigrációban nincs külön site_id mező; a tenant/site audit szűrés és metadata policy explicit döntést igényel. Teljes eseménytaxonómia, hozzáférés, retention és export acceptance nyitott. |
| __e44_pages_snapshot_20261007, __e44_editor_revisions_snapshot_20261007 | 0017 átmeneti recovery snapshotok | A 0017 migráció a sikeres visszatöltés után explicit DROP TABLE utasítással törli őket; nem kezelhetők elvárt végleges táblaként. Remote ellenőrzés csak akkor szükséges, ha a migráció futása/eredménye kétséges. |

**P0.3 következő technikai feladata:** migrációs sorrendből determinisztikusan rekonstruálni a végső schema-t, majd ezt összevetni a remote D1 schema-val; az összes SQL-ben előforduló tábla/mező/consumer listát ki kell nyerni, és domainenként rögzíteni az olvasókat, írókat, owner-t, site scope-ot, FK-kat, lifecycle-t és teszteket. A 0017 migráció forrása szerint az átmeneti snapshotokat a sikeres adat-visszatöltés után explicit törli. A remote D1-ben fennmaradó snapshot csak sikertelen/részleges migráció vagy eltérő futási állapot gyanúja esetén vizsgálandó.


### 37.9. P0.2 — Kanonikus crosswalk-hivatkozás

A 271 történeti követelmény teljes soronkénti munkatáblája a **41. fejezetben** található. A 37. fejezet nem másolja le a crosswalkot, hogy a kulcsok, funkció-ID-k, döntések és fázisok egyetlen táblában maradjanak karbantarthatók. A §41 „MAPPED DRAFT” státusza nem PASS: minden sor szemantikai megfeleltetését, döntését, függőségét és acceptance-bizonyítékát még felül kell vizsgálni.

### 37.10. P0.5 — Hivatalos provider-capability review (első bizonyítékkör)

**Ellenőrzés dátuma:** 2026-10-13. Ez dokumentációs előszűrés, nem provider app-approval, nem működő kapcsolat, nem production teszt, és nem végleges implementációs ígéret. A provider-képesség mindig az aktuális API-dokumentáció, a konkrét app jóváhagyása, engedélyezett scope, token típusa, rate limit és tesztelt endpoint alapján minősíthető.

| Provider | Hivatalos forrás / igazolt képesség | Architekturális következmény | Jelenlegi besorolás |
|---|---|---|---|
| Twitch | API reference tartalmazza a stream/channel adatokat, a VOD/clip és a schedule műveleteket; a schedule olvasása app- vagy user-tokenhez kötött, schedule-módosítás user tokennel és `channel:manage:schedule` scope-pal jár. Forrás: https://dev.twitch.tv/docs/api/reference és https://dev.twitch.tv/docs/api/schedule | Meglévő Twitch OAuth/schedule adaptert endpointonként kell capability registrybe leképezni. Az olvasás, írás, viewer/subscriber adat és VOD/clip jogosultság külön scope/approval acceptance. | KÓDBAN RÉSZBEN MEGLÉVŐ; feature-szintű runtime acceptance nyitott. |
| YouTube | A Data API külön csatorna-, videó- és élő közvetítési erőforrásokat ad; kvótaalapú. A hivatalos leírás szerint az alapkvóta jellemzően 10 000 egység/nap a legtöbb végpontra, a search.list és videos.insert külön keretet kap; a kvóta változhat. Forrás: https://developers.google.com/youtube/v3/getting-started | Adapterben quota accounting, retry/backoff, pagination, API-error normalization és capability-level disabled states szükséges. Publikálás nem vállalható app- és quota-ellenőrzés nélkül. | PLANNED / CAPABILITY REVIEW REQUIRED. |
| TikTok | A Display API profilt és nyilvános videómetaadatot szolgáltat; a Content Posting API külön jogosultságot és video.publish scope-ot igényel. Az auditálatlan kliens közvetlenül publikált tartalma privát megtekintésre korlátozódhat; a dokumentáció külön domain-verifikációs és rate-limit feltételeket is leír. Forrás: https://developers.tiktok.com/docs/en/display-api-overview és https://developers.tiktok.com/docs/en/content-posting-api-get-started | Read/display és publish két külön capability. Közvetlen publikálás csak jóváhagyás, UX-consent, scope, domain és status-polling után; fallback lehet export/hand-off, nem hamis „published” státusz. | PLANNED / CAPABILITY-GATED. |
| Discord | Interactions érkezhetnek Gateway WebSocketen vagy HTTP endpointon; HTTP esetén PING handshake és Ed25519 aláírás-ellenőrzés szükséges. A Gateway valós idejű eseményekhez tartós kapcsolatot használ. Forrás: https://github.com/discord/discord-api-docs/blob/main/developers/platform/interactions.mdx és https://github.com/discord/discord-api-docs/blob/main/developers/events/gateway.mdx | Egyszerű slash-command/interactions endpoint kezelhető HTTP modellel; tartós Gateway event fogyasztást nem szabad stateless Worker route-nak feltételezni. Durable Objects/queue csak konkrét persistent/realtime igény esetén, security- és reconnect-tervvel. | PLANNED / MODE-DEPENDENT. |
| Kick | Hivatalos Public API dokumentáció létezik, OAuth, csatorna- és kategória-végpontokkal, valamint bővülő API-val. Forrás: https://api.kick.com/swagger/index.html és https://docs.kick.com | A roadmap capability-gated adaptert tartalmaz; minden műveletet endpoint/scope/approval szerint kell validálni. A nyilvános API létezése nem bizonyítja, hogy minden Twitch-funkció megfelelője elérhető. | PLANNED / CAPABILITY REVIEW REQUIRED. |

**Kötelező provider-mátrix minden INT/LIV/OBS/CNT/COM/AUT funkcióhoz:**
1. Pontos user outcome és endpoint/művelet.
2. Read/write capability, token típusa, OAuth scope és app-review/verification státusz.
3. Rate limit/quota, pagination, retry/backoff, idempotency és provider error mapping.
4. Webhook vagy polling mód, aláírás/replay defense, freshness/stale fallback.
5. Személyes/adatvédelmi határ, token titkosítás/rotáció/redaction, site/user ownership.
6. Provider sandbox/test account és pozitív/negatív teszt.
7. Graceful fallback: kézi adat, külső link vagy export; a UI nem állíthat sikeres műveletet bizonyíték nélkül.
8. Acceptance evidence és utolsó felülvizsgálat dátuma.

**P0.5 nem PASS:** a fenti áttekintés csak a fő provider-korlátokat és architekturális döntéseket rögzíti. Az összes feature ID-t a konkrét endpointokkal, scope-okkal, approval feltételekkel, quota-val, rate limittel és teszttervvel összekötő mátrix még hátravan.


### 37.11. P0.6 — Függőségi gerinc és release-gate szabályok (első freeze-kör)

**Státusz: IN PROGRESS.** Ez a domain-szintű blokkolási sorrend. Nem helyettesíti a 24. fejezet minden egyes feature-ID-jához szükséges teljes dependency listát és acceptance cardot.

| Gate | Kötelező előfeltételek | Blokkolt domain / feature-csoport | Záró bizonyíték |
|---|---|---|---|
| G0 — Repository és biztonságos alap | P0.1–P0.6 PASS; aktív branch/commit baseline; migrációs sorrend; auth/session/RBAC/site ownership; CI és rollback útvonal | Minden új implementáció | Tiszta baseline; typecheck/build/domain/API/security tesztek; migration/schema/ownership evidence; route inventory és egyetlen aktív pont. |
| G1 — Canonical Page Model | EDT-001–EDT-006, canonical site context, schema validation, command/transaction/history, permission check | Minden Editor-művelet, page mutation, AI Editor action | Invariant/negative tests; node/parent invariants; command atomicity/rollback; site isolation. |
| G2 — Save/revision/publish contract | WEB-004–WEB-008, EDT-027–EDT-034, server-side revision conflict, published-only public read, public renderer parity | Editor 1.0, public content, AI page edits | Draft save/reload; conflict; preview vs public; publish/unpublish; revision restore; cache invalidation; runtime route acceptance. |
| G3 — Resource/asset contract | RES-001–RES-009, RES-010/012/014 where applicable; actual Cloudflare R2 bucket binding in wrangler; D1 metadata + R2 object lifecycle; authorization and usage map | Editor media picker, public images/video, templates/assets, future Content Studio | Upload/validation/retry; metadata/object consistency; safe download; referenced-delete protection; orphan/broken-object scan. |
| G4 — Design system and component contract | DSN-001–DSN-017 as phased scope; token registry; explicit override precedence; template/component version compatibility | Theme/template/section/component builder and design-system UI | Token usage map; instance propagation; override test; template migration/rollback; invalid-reference behavior. |
| G5 — Canonical domain data | SCH-001–SCH-015, SET-001–SET-003, DYN-001–DYN-008; explicit site scope and public-safe projection | Schedule, site settings, dynamic blocks, dashboard cards | Single owner/source; cross-surface consistency; timezone/DST; published-only; stale/error states; site isolation. |
| G6 — Connections and provider adapters | INT-001–INT-020; OAuth state/CSRF, token lifecycle, site binding, capability registry, secret redaction, quota/error/retry | Twitch enhancements; YouTube/TikTok/Discord/Kick; all cross-provider features | Provider-specific scope matrix; approval evidence; valid/expired/mismatched state; reconnect/disconnect; outage and quota tests. |
| G7 — Content and publication workflows | CNT-001–CNT-020; RES asset contract; provider capability; queue/status/idempotency; consent and approval | VOD/clip/Shorts, content calendar, cross-platform publishing | Draft→review→scheduled→publishing→published/failed lifecycle; duplicate retry test; provider confirmation before success; media and permission checks. |
| G8 — Analytics and business data | ANL-001–ANL-009; event taxonomy; consent/retention; provider source/freshness; campaign/content identity | Analytics, campaigns, sponsorship reporting, performance feedback loops | Source/unit/freshness labels; missing data is not fabricated; duplicate/bot/consent tests; access/export policy. |
| G9 — Automation | AUT-001–AUT-014; stable domain events/actions; permission registry; idempotency; durable run log | Cross-domain workflows, notifications, automated publishing | Dry-run; approval; cycle detection; retry/backoff/dead-letter; pause/kill switch; failure/recovery tests. |
| G10 — SANCI AI | AI-001–AI-020; allowed context; structured actions; canonical API/command; permission; preview/diff; approval; verify/audit/rollback | AI Editor, content/stream intelligence, proactive recommendations | Prompt-injection tests; wrong-site denial; no secret access; mutation audit; explicit approval for public/destructive/financial actions; AI-off manual fallback. |
| G11 — Multi-creator/SaaS/marketplace | TEAM-001–TEAM-006, SEC-003, MKT-001–MKT-005; billing/entitlement/legal review; extension permission manifest | Multi-site teams, SaaS billing, marketplace/extensions | Tenant isolation; role/entitlement negative tests; secure install/update/uninstall; billing/webhook idempotency; legal/security sign-off. |

**Globális nem-megkerülhető szabályok**
- Egyetlen canonical domain írhat egy üzleti rekordot; a Dashboard, Editor, public block és AI csak a domain API-ján keresztül olvas/módosít.
- A site ownership és authorization ellenőrzés a szerveren, minden mutációnál történik; UI visibility nem security boundary.
- A D1/R2, provider és payment műveletnél a részleges hiba és kompenzáló/rollback út dokumentált.
- A „disabled/placeholder”, roadmap vagy dokumentációs jelenlét nem PASS bizonyíték.
- Egy feature nem léphet át gate-et a blokkoló acceptance-ek megkerülésével; az 1.0-ból kimaradó tétel DEFERRED marad és a későbbi fázisban is megőrzendő.
- P0.6 csak akkor PASS, ha minden stabil feature ID-hoz explicit prerequisite ID-k, blokkoló/nem blokkoló dependency, acceptance scenario és evidence location tartozik.


### 37.12. P0.3/P0.4 — Runtime consumer és UI-action kapcsolótábla

**Határ:** az alábbiak a forráskód olvasásából igazolt consumer-kapcsolatok; nem állítják, hogy minden endpointot a jelenlegi production verzióban élőben teszteltünk.

| Canonical objektum | Igazolt olvasó/író vagy consumer | Route/UI evidence | Nyitott ellenőrzés |
|---|---|---|---|
| users / sessions | Auth bootstrap/login/logout, require-auth és session lifecycle | /api/auth/bootstrap, /api/auth/login, /api/auth/logout, /api/auth/session; src/routes/auth/*, src/core/auth/require-auth.ts | Session cookie, expiry/revocation, CSRF, rate limit, cross-site authorization negative tests. |
| pages | Admin Page CRUD, Editor document/publish persistence, public page projection | /api/admin/pages, /api/admin/editor, /api/public/pages; src/routes/admin/pages.ts, src/routes/admin/editor.ts, src/routes/public/pages.ts | Method/schema/permission matrix; draft vs published snapshot; revision conflict; publish/unpublish/rollback and public leak tests. |
| editor_revisions | Page CRUD revision read/write, Editor revision list/restore and audit lifecycle | src/routes/admin/pages.ts, src/routes/admin/editor.ts; editor_revisions SQL consumer | Revision ownership/site scope, version uniqueness, retention and rollback acceptance. |
| schedule_items | Admin Schedule CRUD, public schedule read, Twitch schedule synchronization | /api/admin/schedule, /api/public/schedule, /api/admin/twitch/schedule-sync; src/routes/admin/schedule.ts, src/core/schedule-read.ts, src/core/schedule/sync.ts | DST/recurrence/series edit, source precedence, duplicate sync, public cache and site scope. |
| schedule_sync_state | Sync service status and last-result tracking | src/core/schedule/sync.ts; table introduced by migration 0013 | Every field and status transition needs a consumer, retry and failure test; live DB state is separate evidence. |
| site_settings | Admin read/update and public-safe settings projection | /api/admin/settings, /api/public/site-settings; src/routes/admin/settings.ts, src/routes/public/site-settings.ts | Current key='site' singleton is not site-scoped; define canonical multi-site policy before broader rollout. |
| twitch_connections / twitch_oauth_states | Twitch OAuth callback/connect/connection/disconnect; site ownership helper; schedule adapter/sync | /api/integrations/twitch/*; src/core/twitch-oauth.ts, src/core/twitch-site-ownership.ts, src/core/schedule/twitch-sync.ts | Token refresh/revoke, least scopes, callback state reuse/expiry, provider outage and ownership mismatch tests. |
| audit_log | Canonical audit statement used by domain mutations and Twitch integration paths | src/core/audit.ts, Admin route mutations, src/routes/integrations/twitch.ts | Event taxonomy, failure semantics, sensitive-data redaction, read/export permissions and retention. |
| media / R2 object | D1 metadata schema exists; Env type declares MEDIA: R2Bucket | migrations/0017_site_ownership_not_null.sql, src/types/env.ts | wrangler.jsonc does not configure r2_buckets; main router has no Resource/media API route and no confirmed active env.MEDIA consumer. This is a hard blocker, not a completed integration. |
| social_accounts | D1 metadata schema and site-ownership migration exist | migrations/0001_initial_schema.sql, migrations/0015_site_ownership_foundation.sql, migrations/0017_site_ownership_not_null.sql | No canonical admin CRUD or public read route is registered in src/index.ts; identify intended owner and either implement a canonical route later or explicitly defer. |
| design_tokens / editor_components / editor_preferences | Schema objects exist from Editor platform migration | migrations/0002_editor_platform.sql | Need table-by-table consumer search and lifecycle decision; schema presence alone does not prove that current Editor reads/writes these tables. |
| system_page_content | Legacy system-page schema and legacy route modules | migrations/0004_system_page_content.sql, src/routes/admin/system-pages.ts, src/routes/public/system-pages.ts | Main router does not register these modules. Preserve data and migration history; no deletion until explicit migration/retention decision. |

**Editor action-to-handler evidence:** public/editor-v2/index.html declares Save, Publish, Unpublish, Preview, Undo/Redo, page selection, conflict export/reload, layers, element search, schedule tab, zoom/fit and mobile controls. Core page commands and persistence are wired in public/editor-v2/app.js; menu/dock/mobile Inspector and viewport controls are wired in public/editor-v2/ui/shell.js; canvas pan handlers are in public/editor-v2/ui/canvas-pan.js; geometry presets and Inspector grouping have their own modules. The app uses the canonical command pipeline and /api/admin/pages + /api/admin/editor for persistence. This is source-level handler evidence, not proof that every path passes browser/runtime acceptance.

**Admin home evidence:** public/admin-home.html calls the session, settings, pages, schedule and Twitch-connection endpoints and wires logout/mobile navigation/search/refresh/theme controls. The named capability cards marked “Tervezett” or “Későbbi” are disabled placeholders; they must remain PLANNED until the matching domain, API, permissions, tests and runtime evidence exist.


### 37.13. Audit evidence log — 2026-10-13

- Repository baseline for this audit: branch v2/foundation; recursive Git tree inventory counted 192 files at the time of inventory.
- The current feature registry contains 357 unique stable IDs.
- The historical H19–H34 catalogue/crosswalk contains 271 unique keys and 271 rows; all target feature IDs and referenced QA IDs resolve in the current registry. This is structural evidence only; semantic coverage and per-feature contracts remain open.
- On commit a083cf879c3dd15e565cffeb7556dac6d4728faa, Cloudflare Workers Build, Editor Core Test and Twitch Integration Check all completed SUCCESS. The later documentation-only commits trigger fresh CI runs; their latest status must be checked independently.
- Migration/source review found multiple historical Page Model shapes, global uniqueness/scope constraints, duplicate-equivalent revision indexes in migration 0017, multiple migration filenames sharing numeric prefixes, and an unconfigured R2 binding. These are documented findings requiring remote schema/config/runtime evidence before repair.
- The canonical Admin route documentation was reconciled to src/index.ts and tests/admin-home-contract.test.js: /admin is Dashboard, /admin/editor is Editor v2; archive statuses are historical, not active instructions.
- Provider source review is recorded in §37.10 and §37.14. Official documentation does not establish app approval or successful runtime integration.

**Not proven by this log:** local working-tree cleanliness; remote D1 applied migration/schema/index/foreign-key state; R2 object storage operation; full browser/device save/reload/publish acceptance; full source-by-source archive crosswalk; all 357 feature contracts; production provider approvals. These remain explicit open gates.
 
### 37.14. P0.5 — 2026-10-13 hivatalos dokumentációs delta és provider acceptance

Ez a rész a 37.10 első áttekintésének frissített, endpoint- és approval-szintű kiegészítése. A dokumentáció megnyitása nem egyenlő az alkalmazás jóváhagyásával vagy az adott Sanci9517 app jogosultságának bizonyításával.

| Provider | Frissített hivatalos bizonyíték | Kötelező acceptance / termékdöntés |
|---|---|---|
| Twitch | API reference és access-token scope leírás: https://dev.twitch.tv/docs/api/reference ; https://dev.twitch.tv/docs/authentication/scopes/ ; rate-limit modell: https://dev.twitch.tv/docs/api/guide | Csak a tényleges endpointokhoz szükséges legkisebb scope kérhető. A token típusát (app/user), az endpoint scope-ját, a rate-limit headereket és a 429 kezelést endpointonként kell tesztelni; egyetlen „Twitch connected” állapot nem jelent minden Twitch capabilityt. |
| YouTube | Data API overview/quota: https://developers.google.com/youtube/v3/getting-started ; quota/compliance audit: https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits ; aktuális revision history: https://developers.google.com/youtube/v3/revision_history | A kvótát endpointonként, a projekt Console aktuális beállítása szerint kell rögzíteni. A dokumentáció 2026-os változásai külön kvótakeretet jeleznek többek közt a search.list és videos.insert műveletre; a korábbi, általános „10 000 egység/nap mindenre” modellre nem szabad vakon építeni. Minden írás/publikálás előtt OAuth, API engedélyezés, quota és policy acceptance kell. |
| TikTok | Scope-ok: https://developers.tiktok.com/docs/en/scopes-overview ; Direct Post: https://developers.tiktok.com/docs/en/content-posting-api-get-started ; Upload/draft: https://developers.tiktok.com/docs/en/content-posting-api-get-started-upload-content ; app review: https://developers.tiktok.com/docs/en/app-review-guidelines | A Display/read, draft upload és Direct Post külön capability. Direct Posthoz jóváhagyott video.publish scope és a user engedélye kell; auditálatlan kliensnél a közvetlenül publikált tartalom privát módra korlátozódhat. Domain/URL verification, app review és végponttól végpontig demo is lehet feltétel. A UI-nak meg kell különböztetnie a „feltöltve draftként”, „TikTokban jóváhagyásra vár”, „publikálva” és „hiba” állapotot. |
| Discord | OAuth2 és bot jogosultság: https://discord.com/developers/docs/topics/oauth2 ; HTTP/Gateway rate-limit: https://discord.com/developers/docs/topics/rate-limits ; Gateway események: https://github.com/discord/discord-api-docs/blob/main/developers/events/gateway.mdx | Csak a szükséges bot permissions és OAuth scope kérhető. A rate limitet a válaszfejlécekből kell kezelni, nem hard-code-olt feltételezésből. A Gateway állandó kapcsolatot igényel; stateless Worker HTTP route nem tekinthető önmagában Gateway consumernek. Interactions HTTP esetén aláírás-ellenőrzés és replay/timeout teszt kell. |
| Kick | Hivatalos API referencia: https://api.kick.com/swagger/index.html ; docs: https://docs.kick.com ; fejlesztői FAQ: https://docs.kick.com/apis/faqs | Az API létezése igazolt, de a capabilityk endpoint/scope szerint külön vizsgálandók. A dokumentációs „Public API” nem jelent automatikus paritást a Twitch API-val, és nem igazolja a Sanci9517 alkalmazás jóváhagyását vagy production jogosultságát. |

**Kötelező mátrixséma (minden provider capability külön sor):** feature ID; provider; HTTP/API endpoint + method vagy event; read/write; token type; scopes/permissions; app approval/verification; quota/rate limit; pagination/freshness; retry/idempotency; webhook signature/replay; data retention/privacy; site/user ownership; sandbox/test account; positive + negative acceptance; fallback; last-reviewed date; evidence URL.

**P0.5 döntés:** az általános provider adapter és capability registry tervszinten elfogadott, de a fenti dokumentációs források alapján sem jelölhető késznek egyetlen nem tesztelt integráció sem. A TikTok direct publishing és a YouTube publishing/analytics külön approval/quota gate; a Discord persistent Gateway külön futtatási architektúra-gate; a Kick capabilityt csak konkrét endpoint/scope mátrix után szabad a Twitch-paritáshoz hasonlítani.


### 37.15. P0.3 — Migration-to-runtime Page Model reconciliation findings

**Sources read:** migrations 0003–0017 relevant to page storage, src/core/page-model.ts, src/routes/admin/pages.ts. This is source-level evidence, not a live remote D1 inspection.

| Finding | Direct source evidence | Consequence / required decision |
|---|---|---|
| Two historical document shapes exist | 0006 converts legacy pages into type='sanci-document', pages array and nested root.children; 0008 creates type='sanci-page-document', schemaVersion=1, pages object, rootId and normalized nodes. normalizeEditorDocument() explicitly accepts the latter and converts the former. | Keep one canonical persisted format (sanci-page-document, schemaVersion 1) and treat sanci-document as migration input only. Add fixture tests for every legacy shape and prove round-trip does not drop metadata, node IDs, responsive values, interactions or publication state. Do not remove the compatibility normalizer before remote row inventory proves no old format remains. |
| Historical migration changed public visibility | 0007 publishes canonical sanci-document rows by copying content_json to published_content_json; 0008 inserts standard pages with is_published=1 and the empty canonical document as published snapshot. | This is historical migration behavior, not proof that current pages are useful or correctly published. Verify the current remote row set, public navigation, page content and published revision linkage before any cleanup or republish operation. No automatic mass-unpublish or mass-republish. |
| Published revision can be null | 0010 attempts to match a published snapshot to an exact revision; rows with no exact match remain published_revision_id=NULL. 0017 preserves the nullable FK and uses ON DELETE SET NULL. | Acceptance must distinguish “published snapshot exists” from “snapshot linked to exact revision”. Inventory published pages with null/mismatched revision linkage and define safe repair only after remote read-only evidence. |
| Equivalent revision indexes may be duplicated | 0017 creates both idx_editor_revisions_page and idx_editor_revisions_page_version on (page_id, version DESC). | Check the actual remote index list before changing schema. If both exist, assess whether one is redundant; do not remove an index in the audit without a measured query-plan/performance decision and migration. |
| Slug uniqueness is global | Initial schema and 0017 both define pages.slug TEXT NOT NULL UNIQUE, while each page has site_id. | Current invariant means two sites cannot use the same slug. Record this as an intentional global slug policy or design a safe site-scoped unique index migration before any multi-site rollout. |
| Site settings remain global | 0015 explicitly documents site_settings as legacy/global and not yet site-scoped; route consumers use the singleton key. | Preserve as one-site 1.0 behavior unless product scope says otherwise; multi-site SaaS remains blocked until key/owner/tenant semantics and migration are approved. |
| Twitch account uniqueness is global | twitch_connections.broadcaster_id remains UNIQUE after 0017, even though the row also has site_id. | Explicitly decide whether one Twitch broadcaster may bind to exactly one site globally. Add cross-site negative tests for the chosen rule; do not silently relax the uniqueness constraint. |
| Schedule source identity and sync state are global across sites | 0017 creates UNIQUE(source, source_account_id, source_id) without site_id; 0013 schedule_sync_state is UNIQUE(source, source_account_id) and has no site_id. | Decide whether a provider source event and its sync status are globally unique or site-local. Test cross-site import, duplicate sync, sync status visibility and retry isolation before any multi-site use. |

**P0.3 acceptance additions:** (1) read-only remote sqlite_master/PRAGMA table_info/PRAGMA index_list/PRAGMA foreign_key_check; (2) compare remote tables and indexes against the migration-derived final schema; (3) count canonical vs legacy document shapes and published snapshot/linkage mismatches without mutating rows; (4) record every result with timestamp, environment and commit; (5) no data repair until the read-only report and rollback plan are reviewed.


### 37.16. P0.2 — Crosswalk szemantikai review, 2. kör

**Ellenőrzési forrás:** a §24 stabil feature-ID registry és a §41 teljes, 17 oszlopos crosswalk; 2026-10-13.

- 271 történeti kulcs → 271 sor, 271 egyedi kulcs.
- 359 stabil feature ID a registryben; a H19–H34 crosswalk minden hivatkozott ID-ja feloldható.
- A jelenlegi feature-ID prefix és a megadott canonical domain owner egyezik; a vegyes ownerű sorok explicit több-ID hozzárendelést használnak.
- A kilenc több-ID hozzárendelés külön felülvizsgálva: architektúra+secret boundary; reduced-motion/QA; interaction validation/QA; performance/ops; content management/Page Model; integrations/Connections Center; permissions/security; AI Editor action pipeline; collaboration/conflict. A több-ID sor nem helyettesíti a kapcsolódó feature ID-k külön DoD-ját.
- A korábbi általános phase-dependent célfázisok megszüntetve: a VOD-admin capability 1.5–2.0, az analytics reporting 2.0 célfázist kapott; a crosswalkban már nincs phase-dependent célfázis.
- A történeti eljárási checklist H34 soraiban az „all phases” a folyamatos governance-kötelezettséget jelenti, nem azt, hogy az összes termékfunkció minden fázisban implementálandó.
- A H27 Admin-capability soroknál a jelenlegi menüben látható placeholder nem runtime feature: a crosswalk csak a canonical owner/funkcióazonosítóhoz rendeli, és külön jelzi a későbbi fázist.

**Továbbra is nyitott:** a sorok eredeti történeti forrásával való emberi, tartalmi összevetés; minden cél-ID feature contractjának (permission, data owner, dependency, negative tests, acceptance evidence) kitöltése; a 271 követelmény és a 359 feature ID közötti teljes lefedettségi mátrix. Ez a második review-kör sem P0.2 PASS, és nem változtat implementációs státuszt.


### 37.17. P0.2 — Történeti és új funkciók közti lefedettségi különbség

A §24 registry és a §41 crosswalk újraszámolt kapcsolata:

- §24: 359 egyedi stabil feature ID (a P0.2 review során felvett LOC-005 és LOC-006 követelményekkel).
- §41: 271 egyedi történeti követelménykulcs.
- A történeti crosswalk 128 különböző aktuális feature ID-t hivatkozik közvetlenül; minden ilyen ID feloldható a registryben, és a crosswalkban használt QA-ID-k is feloldhatók.
- A H19–H34 crosswalk 128 különböző aktuális feature ID-t köt közvetlenül történeti kulcshoz; a 359-ből fennmaradó 231 ID-hoz ebből a ledgerből nem vezethető le közvetlen H-key. Ezek egy része a §37.22–37.25 E/F bullet-crosswalkjaiban már szerepelhet, ezért nem tekinthető automatikusan árva funkciónak. A teljes, összes archive source-ra kiterjedő eredetbesoroláshoz mindegyik ID-nél rögzíteni kell: NEW PRODUCT REQUIREMENT, EXPANDED ACCEPTANCE, CROSS-CUTTING CONTROL, PLATFORM/OPERATIONS, vagy HISTORICAL MAPPING GAP.
- A P0.2 zárás előtt a 359 ID mindegyikéhez ki kell tölteni a provenance mezőt: historical key(s), new requirement source, domain owner, target phase, dependency IDs, acceptance/test IDs és státusz. Ha egy ID új, a forrás a MASTER döntési naplójában szerepeljen; ha történeti, a H-key legyen visszakövethető. Az üres provenance nem törlési ok, hanem nyitott auditfeladat.

**Aktuális döntés:** a 271 H19–H34 követelmény soronkénti megőrzése szerkezetileg PASS; az összes korábbi tervre kiterjedő történeti↔aktuális feature coverage nem PASS, amíg a 359 ID provenance-e és a tételenkénti feature contract nincs teljesen dokumentálva.


### 37.18. P0.2 — Archived source inventory and precedence reconciliation

**Rule:** the current MASTER's ACTIVE_POINT block and current canonical architecture govern execution. Archive documents preserve historical requirements and decisions; their former ACTIVE_POINT, queued sequence, checked boxes or “M0 superseded” statements must not override the current MASTER. The old snapshot's M0 wording records a historical state, not an instruction to skip the current P0 gate. Conversely, this current P0 audit is not permission to delete or silently discard any archived feature.

| Archived source | Historical value to preserve | Current treatment / remaining crosswalk work |
|---|---|---|
| docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md | Full previous MASTER snapshot, H19–H34 ledger, M0 findings, 00.9.6.C platform map and C.24 engineering policy | Primary historical baseline; H19–H34 has 271-row draft crosswalk. Other sections and open requirements (including 00/A, 00.9.6.E/F, C.18–C.24 and M0 findings) still need source-level mapping to current IDs/acceptance. Snapshot statuses are historical. |
| docs/archive/plans/MASTER-CURRENT-STATUS.md | 2026-09-17 E2 completion evidence and former F0 checkpoint | Historical checkpoint only; do not restore its active point. Keep its test evidence only for the exact commit/scope it covers. |
| docs/archive/plans/MASTER-FINAL-ROADMAP.md | E3–E24 editor, page, media, dynamic data, integration, accessibility, SEO, Admin, AI, testing and release gate breakdown | Preserve all capabilities; crosswalk E/A/AI/T items to current EDT/WEB/RES/DYN/INT/QA/AI/ADM/OPS IDs and explicit acceptance. |
| docs/archive/plans/PLAN-AMENDMENT-EDITOR-UNIFICATION.md | One Page Model/renderer/save path; migrate real pages without data loss; old editor test pages distinguished from real pages | Architectural constraints retained. Current Editor v2 is canonical; historical paths and page migration acceptance must be checked against current code and data. |
| docs/archive/plans/SANCI-MASTER-PLAN.md | Public site pages, brand design, Admin, media, SEO, analytics, security, Twitch/YouTube/TikTok/Discord and Stream Assistant | Product-source inventory; reconcile each capability and any missing public page/workflow with WEB/CNT/COM/INT/ANL/AI IDs. |
| docs/archive/plans/ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md | Creator Platform layering, stable IDs, canonical action system, validation/security, Content Engine, Stream Intelligence, AI Engineer and evaluation | Long-term architecture; crosswalk all requirements not already represented by H19–H34, especially action/permission/verification/evaluation. |
| docs/archive/plans/V2-BLUEPRINT.md | Worker/D1/R2/KV/Queues/DO architecture, auth, cache, SEO, security and deployment sequence | Preserve as architecture evidence, not as proof that a binding/service is currently configured. Reconcile each planned Cloudflare capability with actual wrangler config and runtime consumers. |
| docs/archive/plans/VISUAL-EDITOR-ARCHITECTURE.md | Canonical structured tree, shared Canvas/Layers/Inspector state, history and AI action boundaries | Preserve architecture rules; its old runtime path public/editor/editor-core.js is historical. Current canonical runtime is public/editor-v2; no second Editor core. |
| docs/archive/plans/visual-editor-roadmap.md | Editor shell, canvas, element system, Sanci blocks, Inspector, Layers, design system and responsive work | Historical milestone labels are not active. Map every capability to current EDT/DSN/QA IDs and current responsive acceptance. |
| docs/archive/2026-09-16/LEGACY-HTML-ARCHIVE.md | Legacy public page file-to-slug mapping and no-parallel-renderer rule | Route documentation has been reconciled to the current Worker router; keep redirects and data-preservation tests until explicitly retired. |

**P0.2 gap:** the H19–H34 271-row crosswalk is not the whole archive audit. The current plan must also reconcile requirements and architecture constraints from the earlier 00/A and 00.9.6.C–F sections and the secondary archive plans above. A topic being represented in §38/§39 is not enough; record the exact source heading, current feature ID(s), KEEP/MERGE/EXPAND/DEFER/REPLACE/REJECT decision, phase, dependency and acceptance evidence.

### 37.19. Cross-cutting policy recovered from archive — Open-source-first engineering

**Scope:** all current and future product work, including Visual Editor, Worker/API, UI, data model, tests, build/deploy and Creator OS.

Before a significant new feature, infrastructure decision or complex technical fix, compare in this order:
1. Reuse the already-canonical Sanci9517 implementation when it meets the contract.
2. Prefer a maintained, tested and license-compatible open-source library or standard solution.
3. Use a narrow adapter around a proven standard when that preserves the canonical domain boundary.
4. Build custom only when no suitable solution exists, the existing one fails the acceptance requirements, or its integration/license/security burden is greater.
5. Fork only with a documented reason and upstream/security maintenance plan.

The short decision record must name the problem and acceptance criteria; existing modules/contracts; candidate alternatives; license and maintenance state; runtime/Worker/browser compatibility; security, privacy, supply-chain and bundle impact; chosen reuse/integrate/adapt/fork/build decision; tests and rollback. This is not a requirement to add dependencies for every small task.

**Non-negotiable exclusions:** no dependency may introduce a second Page Model, Editor history, Property Registry, Resource store, Schedule domain, or save/publish path; no external code gets implicit access to secrets or privileged actions; lockfile, license/attribution and update/rollback evidence are required. This policy is now preserved in the current MASTER rather than only in the archive.


### 37.20. P0.2 — 00.9.6.E/F közvetlen termékkatalógus kereszttérkép

**Forrás:** a történeti MASTER snapshot 00.9.6.E (E.1–E.22) és 00.9.6.F (F.1–F.13) fejezetei. Ez a fejezetszintű mapping az első összekapcsolás; nem helyettesíti az E/F alatti minden egyes bullet, állapotátmenet, teszt és acceptance tételes soronkénti crosswalkját.

| Történeti forrás | Követelménycsoport | Jelenlegi canonical cél | Döntés / fázis |
|---|---|---|---|
| E.1 | Product surfaces and boundaries | §2–4; ADM, WEB, EDT, CNT, RES, SCH, INT, DSN, LIV/OBS, STO/SUP, COM, ANL/AUT/AI, OPS, LOC, TEAM, MKT | EXPAND — a modulhatárok a teljes roadmapon érvényesek; az Adminban csak ténylegesen működő munkaterület lehet aktív. |
| E.2 | Public Website, dynamic creator state, publish quality | WEB-014–WEB-032; LIV; SCH; INT; SEO; QA | MERGE/EXPAND — 1.0 publikus site + accessibility/SEO baseline; provider-függő feed csak capability és freshness evidence mellett. |
| E.3 | Visual Editor, Page Model, manipulation, layout, Inspector, blocks, history/recovery | §38; EDT-001–EDT-042; DSN; RES; QA | EXPAND — 1.0 core Editor; minden mutáció canonical Page Model/command/history/persistence útvonalon. |
| E.4 | Page/CMS/publish lifecycle | WEB-001–WEB-008, WEB-012–WEB-013, CNT, EDT-027–EDT-034 | MERGE — 1.0 Page Model, draft/preview/publish/rollback; advanced CMS/content factory 2.0. |
| E.5 | Resource/Media/Icon/Font/File | RES-001–RES-016 | EXPAND — 1.0 resource foundation; actual R2 binding és upload/download API P0.3/G3 blocker. |
| E.6 | Theme, Design System, Template, Component, Symbol | DSN-001–DSN-018; EDT-021–EDT-026 | EXPAND — 1.0 theme/template baseline; advanced reusable registry/variants and marketplace phased later. |
| E.7 | Creator Center/Admin UX and modules | ADM-001–ADM-010 plus each canonical module owner | MERGE — 1.0 shell, Dashboard and canonical Connections Center baseline; disabled planned modules stay PLANNED. |
| E.8 | Schedule/Calendar | SCH-001–SCH-015; DYN-002/005/007; WEB-016 | EXPAND — 1.0 CRUD/public schedule/Editor block/Twitch sync; timezone, recurrence and source ownership acceptance required. |
| E.9 | Integrations and Twitch | INT-001–INT-020; LIV-001–LIV-007; SCH-007–SCH-008 | EXPAND — Twitch Connections Center minimum in 1.0; other provider adapters 1.5+ and capability-gated. |
| E.10 | Content Factory and multi-platform content | CNT-001–CNT-020; RES; INT; ANL | DEFER/EXPAND — 1.0 only the required public content/page foundations; VOD/Shorts workflow and cross-platform publishing staged 1.5–2.0. |
| E.11 | Stream Studio/Overlay/OBS | OBS-001–OBS-010; LIV; INT; AUT | DEFER — Stream/Overlay Studio and persistent/realtime architecture follow 2.0/7.0 dependencies. |
| E.12 | Shop/Merch/Digital Products/Monetization | STO-001–STO-020; SUP-001–SUP-012; SEC | DEFER — 5.0 business phase after payment/legal/provider review. |
| E.13 | Community/Audience ownership | COM-001–COM-018; SEC; LOC | DEFER/EXPAND — 1.0 external community links only; audience, consent, moderation and membership later. |
| E.14 | Analytics, Automation and AI | ANL-001–ANL-009; AUT-001–AUT-014; AI-001–AI-020; QA | DEFER — roadmap phases 2.0–9.0, each capability requiring source, consent, permission, cost and acceptance. |
| E.15 | Sponsorship/Creator Business Hub | CAM-001–CAM-008; ANL; STO; COM | DEFER — 5.0 business/commerce scope, not a 1.0 backend claim. |
| E.16 | Localization/international use | LOC-001–LOC-004; WEB; SEO; DSN | DEFER/EXPAND — preserve language-ready content/metadata in the architecture; full localization workflow phased later. |
| E.17 | Accounts, multi-site, teams and SaaS | SEC; TEAM-001–TEAM-006; OPS; STO/SUP entitlements | DEFER — 4.0+; current global slug/settings/provider uniqueness constraints must be decided before multi-site. |
| E.18 | Import/export, backup, diagnostics, developer surface | OPS-001–OPS-012; SEC; RES; WEB | EXPAND — 0.x/1.0 operational safety baseline; full developer/extensions surface later. |
| E.19 | Architecture and security invariants | EDT-001–EDT-006; SEC-001–SEC-010; INT-001/019; OPS | KEEP/EXPAND — cross-cutting release gates, not optional future UI features. |
| E.20 | Feature contract and negative tests | §25–26; QA-001–QA-010; every feature ID | KEEP — all features need their own data owner, permission, dependency, negative test and acceptance. |
| E.21 | Product phases and scope boundaries | §39.1–39.13 | MERGE — current §39 is the canonical phase roadmap; archive phase labels are historical. |
| E.22 | Completeness closure and plan maintenance | §0, §11, §16–18, §35–37 | KEEP/EXPAND — one active point, explicit provenance, decisions, tests and evidence. |
| F.1 | Editor workflow/history/recovery | EDT-003–EDT-005, EDT-027–EDT-031, EDT-035–EDT-042; WEB; QA | EXPAND — 1.0 save/reload/conflict/recovery acceptance; no data loss. |
| F.2 | Dynamic blocks/data binding | DYN-001–DYN-008; EDT-020; WEB-031–WEB-032; INT; SCH; RES | EXPAND — phased; schema validation, permission, freshness and published-only data required. |
| F.3 | Dropdown controls/layout | EDT-009–EDT-010, EDT-016–EDT-026; DSN | EXPAND — 1.0 core controls/responsive baseline; no direct CSS/JSON requirement for ordinary editing. |
| F.4 | Website content/interactions | WEB-014–WEB-032; EDT-017–EDT-020; COM; INT; SEO | EXPAND — public 1.0 baseline plus provider-gated dynamic blocks and later interaction features. |
| F.5 | Content Factory/platform integrations | CNT-001–CNT-020; INT-001–INT-021; RES; ANL | DEFER/EXPAND — 1.5–2.0 and endpoint-level provider acceptance. |
| F.6 | Schedule/time/content linkage | SCH-001–SCH-015; CNT; INT; DYN; WEB-016 | EXPAND — 1.0 schedule foundation, recurring/DST/source-identity/duplicate-sync acceptance. |
| F.7 | Admin/forms/store/UI rules | ADM; WEB; COM; STO; SUP; SEC; QA | MERGE — Admin shell in 1.0; forms/backend actions and commerce in later phases; placeholder UI is not implementation. |
| F.8 | Analytics/AI/automation/stream intelligence | ANL; AI; AUT; LIV; OBS; SEC | DEFER — roadmap 2.0–9.0 with explicit approval, privacy, cost, observability and rollback gates. |
| F.9 | SEO/accessibility/security/performance release gate | SEO-001–SEO-005; QA-002–QA-010; SEC; OPS; EDT-040 | KEEP/EXPAND — baseline release gates in 1.0; advanced monitoring/optimization remains phased. |
| F.10 | Backup/import/export/diagnostics/recovery | OPS-001–OPS-012; SEC; RES; WEB-007/008; EDT-031/042 | EXPAND — minimum safe recovery and evidence for 1.0; full self-service recovery tools only when accepted. |
| F.11 | Coverage and preservation rule | §35–37; §40–41 | KEEP — historical requirements must map to current IDs or have explicit decision; listing is not completion. |
| F.12 | Project/start context, configurable not hard-coded | SET-001–SET-003; LOC; WEB; SEC; OPS | EXPAND — remove environment/user-specific assumptions from reusable platform contracts; keep Sanci9517 branding/configuration intentional. |
| F.13 | Game Profile, custom domain, Link Hub, email audience, teams, mobile | SCH-012–SCH-014; WEB-022/024; COM-015–COM-017; TEAM; LOC; OPS | DEFER/EXPAND — game profiles and required link hub are phased by §39; custom domain, audience, teams and advanced mobile workflow need their own contracts. |

**E/F source-level review status:** 35 headings mapped to canonical domains and current phases at section level. Still required before P0.2 PASS: extract every bullet and nested requirement under these headings into individual source-key rows (including explicit source text/heading), connect each to exact current feature IDs, and verify no requirement is represented only by a broad family label. C.23 Visual Editor additions are mapped to §38/EDT, and C.24 open-source-first policy is preserved in §37.19; their individual checklist items still need provenance/acceptance links where they change implementation scope.


### 37.21. P0.4 — Konkrét Editor acceptance: canvas/scroll extent a tartalommal nő

**Felhasználói megfigyelés:** 2026-10-13 — a resize/move, undo/redo működött, de egy elemet jóval lejjebb mozgatva a fehér canvas/vászon nem követte a dokumentum tartalmi kiterjedését.

**Canonical követelmény:** §38.9, „Canvas height és scroll extent újraszámítása drag/resize/content growth közben, zoommal és transformmal korrigálva.” Ez jelenleg acceptance-követelmény; a tervben szereplés nem jelenti, hogy a runtime-hiba már javítva van.

**Reprodukció és PASS:**
1. Nyiss meg egy canonical Editor v2 oldalt, és hozz létre/kijelölj egy teszt-elemet.
2. Mozgasd az elemet egyre lejjebb, a kezdeti canvas alja alá; majd resize-old úgy, hogy a magassága is növekedjen.
3. A canvas fehér munkaterülete és a scroll extent automatikusan kövesse a tartalmi bounds-ot; az elem teljesen látható és elérhető maradjon, ne vágja le a canvas wrapper.
4. Ismételd meg 50%, 100% és nagyított zoom mellett, valamint drag közben és drag után; a zoom/transform ne okozzon hibás scroll-méretet.
5. Ellenőrizd desktop/tablet/mobile preview módokban és valódi viewporton; a preview mérete és az editor scroll-container mérete ne keveredjen össze.
6. Undo/redo, Save Draft, reload és újranyitás után az elem pozíciója, dokumentum magassága és a scrollozhatóság maradjon konzisztens.
7. A konzolban ne legyen ismétlődő resize loop vagy unbounded observer; nagy dokumentumnál is maradjon használható a szerkesztés.

**Érintett canonical ID-k:** EDT-007, EDT-009, EDT-024/025, EDT-027/028, QA-002, QA-004, QA-006.  
**Státusz:** OPEN — runtime/browser acceptance szükséges; a korábbi „resize + undo/redo működik” visszaigazolás nem zárja le a canvas height/scroll extent hibát.


### 37.22. P0.2 — Bullet-szintű crosswalk, batch 1: E.2 Public Website és E.3 Editor Core

**Forrás:** archived MASTER snapshot, 00.9.6.E.2.1–E.2.3 és E.3.1–E.3.7. A forráshely + sorszám stabil hivatkozás az adott fejezeten belüli bullet sorrendjére. A mapping a jelenlegi ID-khoz rendel, nem jelenti a runtime funkció készültségét.

| Forráskulcs | Megőrzött követelmény röviden | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| E.2.1-01 | Public page types: Home/About/Schedule/Live/VOD/Clips/platform pages/Community/Contact/Resources/Store/Membership/Events/News/Digital/Sponsor | WEB-014–WEB-027 | EXPAND | 1.0 core pages; 1.5–5.0 later domains | QA-002/004/008 |
| E.2.1-02 | Page and route editing through Page/CMS, no routine hand-edited HTML | WEB-001, WEB-002, WEB-012, WEB-013 | MERGE | 1.0 | QA-002/004 |
| E.2.1-03 | Shared header/footer/navigation/mobile menu/logo/social links | WEB-009, WEB-010, WEB-011 | EXPAND | 1.0 | QA-004/005 |
| E.2.1-04 | Navigation order/label/target/visibility/new-tab; server-side URL and permission validation | WEB-009, WEB-013, SEC-006 | EXPAND | 1.0 | QA-003/004 |
| E.2.1-05 | 404, empty/loading/API error/offline/maintenance states | WEB-028, ADM-008, QA-006 | EXPAND | 1.0 baseline | QA-004/006 |
| E.2.1-06 | Per-language title/slug/metadata/content and explicit missing-translation fallback | LOC-001, WEB-001, SEO-001 | DEFER/EXPAND | 1.0 architecture-ready; full workflow later | QA-004/005 |
| E.2.2-01 | Trustworthy/fresh Twitch live status, player, game/category and provider-permitted metrics | LIV-001–LIV-007, INT-010, INT-011 | EXPAND | 1.0 Twitch baseline; metrics scope-gated | QA-002/003/004 |
| E.2.2-02 | Next stream, timezone/countdown, postponed/cancelled state | SCH-003, SCH-005, SCH-009, WEB-016 | EXPAND | 1.0 | QA-002/004 |
| E.2.2-03 | Configurable VOD/clip/Short feed and empty/provider-error states | CNT-002–CNT-004, CNT-019, DYN-005 | DEFER/EXPAND | 1.5–2.0 | QA-002/004/006 |
| E.2.2-04 | Community/support CTA and later membership/product blocks | COM-001, SUP-001, WEB-019, WEB-023 | MERGE | 1.0 external links; membership/product later | QA-004/008 |
| E.2.2-05 | Provider outage fallback, last success/freshness and retry | INT-008, INT-009, INT-020, LIV-002, DYN-005, OPS-008 | EXPAND | 1.0 baseline; provider-specific later | QA-003/006/008 |
| E.2.3-01 | Canonical URL/title/description/OG/Twitter/favicon/robots/sitemap/structured data | SEO-001–SEO-004 | EXPAND | 1.0 | QA-004/005 |
| E.2.3-02 | Correct share preview and pre-publish metadata preview | SEO-002, WEB-005, WEB-006 | MERGE | 1.0 | QA-004/005 |
| E.2.3-03 | Keyboard/focus/heading/contrast/alt/forms/reduced motion | QA-005, EDT-037, EDT-040, RES-007 | EXPAND | 1.0 baseline; advanced interaction QA later | QA-004/005 |
| E.2.3-04 | Image optimization/lazy loading/layout shift/cache invalidation | RES-004, WEB-030, OPS-008, QA-006 | EXPAND | 1.0 baseline | QA-004/006 |
| E.2.3-05 | Consent-aware analytics and data minimization | ANL-002, COM-015, COM-017, SEC-011 | DEFER/EXPAND | Privacy baseline 1.0; audience analytics later | QA-003/008 |
| E.3.1-01 | Editor toolbar with page/save/history/viewport/zoom/preview/publish actions | EDT-005, EDT-007, EDT-027, EDT-032, EDT-033 | EXPAND | 1.0 | QA-002/004 |
| E.3.1-02 | Pages/Layers/Elements panels; later assets/templates/symbols | EDT-012, EDT-015, RES-010, DSN-008–DSN-012 | EXPAND | Core panels 1.0; library tabs phased | QA-002/004 |
| E.3.1-03 | Canvas with selection frame/drop zones/guides/viewport width | EDT-007–EDT-010, EDT-025 | EXPAND | 1.0 | QA-002/004/005 |
| E.3.1-04 | Inspector categories/search/help/validation/default reset | EDT-021–EDT-023 | EXPAND | 1.0 | QA-002/004 |
| E.3.1-05 | Resizable/collapsible panels and no clipped small-screen workspace | ADM-010, EDT-035, EDT-036, QA-005 | EXPAND | 1.0 desktop/mobile baseline; tablet acceptance explicitly required | QA-004/005 |
| E.3.1-06 | Empty-project onboarding/template start and save-protection messaging | EDT-041, EDT-042, DSN-008, DSN-009 | EXPAND | 1.0 | QA-002/004/006 |
| E.3.2-01 | One canonical Page Model and one save/publish/revision path | EDT-001, EDT-003–EDT-005, WEB-004–WEB-008 | KEEP | 0.x–1.0 | QA-002/003/004 |
| E.3.2-02 | Page→Section→Container/Box→Column/Stack→Element with reusable slots | EDT-002, EDT-016–EDT-019, DSN-012, DSN-013 | EXPAND | 1.0 core; reusable components phased | QA-002/004 |
| E.3.2-03 | Stable node IDs/types/props/children/order/visibility/lock/responsive/source/schema | EDT-001, EDT-002, EDT-014, EDT-024 | EXPAND | 0.x–1.0 | QA-002/003 |
| E.3.2-04 | DOM/canvas never source of truth; mutations through structured commands | EDT-003, EDT-004, EDT-006 | KEEP | 0.x–1.0 | QA-002/003 |
| E.3.2-05 | No tree cycles, invalid parent-child relations or forbidden node types | EDT-002, EDT-003, EDT-022 | EXPAND | 0.x–1.0 | QA-002/003 |
| E.3.2-06 | Atomic, validated reorder/reparent/duplicate/delete | EDT-004, EDT-011, EDT-038 | EXPAND | 1.0 | QA-002/004 |
| E.3.3-01 | Canvas/Layers selection sync, hover/focus and parent breadcrumb | EDT-006, EDT-012, EDT-013 | EXPAND | 1.0 | QA-002/004/005 |
| E.3.3-02 | Move/resize/drop/snap/guides/grid/zoom/pan/viewport bounds | EDT-007–EDT-010 | EXPAND | 1.0 | QA-002/004/005 |
| E.3.3-03 | Drag/resize respects layout mode; no accidental flex/grid→absolute conversion | EDT-009, EDT-016, EDT-022, EDT-024 | EXPAND | 1.0 | QA-002/004 |
| E.3.3-04 | Duplicate/delete/copy/paste/order/lock/hide/multi-select | EDT-011, EDT-014, EDT-038 | EXPAND | 1.0 core actions; multi-select only when accepted | QA-002/004 |
| E.3.3-05 | Keyboard shortcuts/context menu/accessibility/touch interactions | EDT-035, EDT-037, QA-005 | EXPAND | 1.0 baseline | QA-004/005 |
| E.3.4-01 | User-friendly Stack/Row/2–3 column/Grid layout selectors | EDT-016 | EXPAND | 1.0 | QA-002/004 |
| E.3.4-02 | Alignment/gap/padding/margin/size/min-max/aspect/position/overflow/wrap | EDT-009, EDT-016, EDT-021, EDT-022 | EXPAND | 1.0 | QA-002/004 |
| E.3.4-03 | Prefer Flex/Grid/flow over rigid absolute positioning | EDT-016, EDT-024 | EXPAND | 1.0 | QA-002/004/005 |
| E.3.4-04 | Desktop/tablet/mobile viewports and visible inherited responsive overrides | EDT-024, EDT-025 | EXPAND | 1.0 | QA-002/004/005 |
| E.3.4-05 | Controlled mobile hide/reorder/column changes without silent desktop regressions | EDT-024–EDT-026 | EXPAND | 1.0 | QA-002/004/005 |
| E.3.4-06 | Overflow/wrap warnings and minimum viewport checks | EDT-025, QA-005, OPS-008 | EXPAND | 1.0 baseline | QA-004/005/006 |
| E.3.5-01 | Declarative typed Property Registry, no per-element ad hoc Inspector | EDT-021, EDT-022 | KEEP | 0.x–1.0 | QA-002/004 |
| E.3.5-02 | Text/URL/resource/number/unit/color/token/select/toggle/spacing/type/responsive fields | EDT-022, DSN-007, RES-010, RES-013 | EXPAND | 1.0 core fields; advanced types phased | QA-002/004 |
| E.3.5-03 | Inspector categories/search/validation/help/default/reset/dirty/dependency/readonly/permission | EDT-021–EDT-023, ADM-009 | EXPAND | 1.0 | QA-002/003/004 |
| E.3.5-04 | Inspector/Canvas/Layers share one state; invalid changes cannot persist | EDT-006, EDT-013, EDT-021, EDT-022 | KEEP | 0.x–1.0 | QA-002/004 |
| E.3.5-05 | Schedule block presentation config never mutates Schedule domain records | EDT-020, SCH-011, DYN-001, DYN-007 | KEEP | 1.0 | QA-002/003/004 |
| E.3.6-01 | Base elements and plain text; Rich Text editor explicitly later | EDT-017–EDT-019 | EXPAND | 1.0 base elements; advanced Rich Text later | QA-002/004 |
| E.3.6-02 | Table/Accordion/Tabs typed fields, validation, keyboard/responsive/public renderer | EDT-019, WEB-032, QA-005 | EXPAND | 1.0 only if full acceptance passes; otherwise defer individual blocks | QA-002/004/005 |
| E.3.6-03 | Section/Box/Stack/Row/Columns/Grid/reusable Slot | EDT-016, DSN-013 | EXPAND | 1.0 layout primitives; reusable slot phased | QA-002/004 |
| E.3.6-04 | Typed Sanci creator blocks: Twitch Live/Offline, Countdown/Next Stream, Schedule, YouTube/TikTok/Discord links or phase-gated capability blocks, VOD/Clips/Shorts, Community, Support, Stream Stats, Game Card, Social Links, Sponsor/Business Contact/About Me and later Store | EDT-020, WEB-001/020/022/024, INT-001–INT-018, LIV-001–LIV-007, SCH-009–SCH-015, CNT-001–CNT-020, COM-001–COM-018, SUP-001–SUP-003, STO-001–STO-003, STO-017, CAM-001/CAM-004, DYN-001–DYN-008 | EXPAND | 1.0 verified Twitch/Schedule/social/profile baseline; API-backed and commerce blocks gated by their phases | QA-002/003/004/005/008 |
| E.3.6-05 | Every element has typed defaults/validation/renderer/responsive/accessibility/error-empty states | EDT-015–EDT-020, WEB-032, QA-005 | EXPAND | 1.0 for included elements | QA-002/004/005 |
| E.3.6-06 | Categorized searchable block library, canvas preview and compatible drag-drop | EDT-008, EDT-015 | EXPAND | 1.0 | QA-002/004 |
| E.3.6-07 | Embeds limited to approved hosts with CSP/permission controls | WEB-032, SEC-005, SEC-006, QA-003 | EXPAND | 1.0 | QA-003/004 |
| E.3.7-01 | Undo/redo from structured commands, never DOM snapshots | EDT-003, EDT-005 | KEEP | 0.x–1.0 | QA-002/004 |
| E.3.7-02 | Dirty/save-in-progress/success/error/retry/conflict states | EDT-027, EDT-029, EDT-031 | EXPAND | 1.0 | QA-002/004/006 |
| E.3.7-03 | Validated autosave and explicit save | EDT-027, EDT-028, EDT-031 | EXPAND | 1.0; autosave only if its own acceptance passes | QA-002/004/006 |
| E.3.7-04 | Expected-version concurrency; no silent overwrite | EDT-029, EDT-030 | KEEP | 1.0 | QA-002/003/004 |
| E.3.7-05 | Unsaved navigation warning, recovery and browser refresh recovery | EDT-031, EDT-042 | EXPAND | 1.0 | QA-002/004/006 |
| E.3.7-06 | Canvas/Layers/Inspector/history/backend stay consistent after each operation | EDT-006, EDT-013, EDT-028, QA-002 | KEEP | 0.x–1.0 | QA-002/004 |

**Batch 1 result:** 57 E.2/E.3 bullets mapped to canonical feature IDs, explicit decision, phase and QA family. Structural check on commit b1be3097cdbcfec570cc22da4bbe0d96c82dac72 confirmed 57 mapping rows and 125 distinct explicit/range-expanded feature/QA references, with no unresolved IDs. This validates references, not semantic correctness or runtime PASS. Continue with E.4–E.22 and F.1–F.13 in further batches.


### 37.23. P0.2 — Bullet-szintű crosswalk, batch 2: E.4–E.9

**Forrás:** archived MASTER snapshot, 00.9.6.E.4–E.9. A táblázat a 66 forrásbulletet külön sorba bontja; a célfázis a teljes termék-roadmap szerinti ütemezés, nem készültségi állítás.

| Forráskulcs | Megőrzött követelmény röviden | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| E.4-01 | Page CRUD, slug/status/locale/SEO/template/access/navigation/duplicate/archive | WEB-001–WEB-003, WEB-009, SEO-001, LOC-001 | EXPAND | 1.0 core; locale workflow later | QA-002/004 |
| E.4-02 | Draft/review/published/scheduled/archived states and valid transitions | WEB-004, WEB-006, CNT-013–CNT-015 | EXPAND | 1.0 page lifecycle; content queue later | QA-002/004/008 |
| E.4-03 | Preview without modifying live version; no draft leakage through public routes/cache | WEB-005, WEB-031, WEB-030 | KEEP | 1.0 | QA-002/003/004 |
| E.4-04 | Revision author/time/diff/restore/published-revision linkage | WEB-008, WEB-007, EDT-028, EDT-029 | EXPAND | 1.0 | QA-002/004 |
| E.4-05 | Transactional publish/rollback, authorization, cache invalidation and failed-publish recovery | WEB-006–WEB-008, WEB-030, SEC-002, OPS-009 | EXPAND | 1.0 | QA-002/003/004/006 |
| E.4-06 | Future content types: posts/news/video/VOD/clip/Short/playlist/campaign/calendar/platform metadata | CNT-001–CNT-020, CAM-001–CAM-003 | DEFER/EXPAND | 1.5–5.0 by domain | QA-002/004/008 |
| E.4-07 | Reuse content in feeds/dynamic blocks with configurable query/sort | CNT-019, DYN-001–DYN-006 | EXPAND | 2.0; minimal 1.0 blocks only | QA-002/004 |
| E.5-01 | One canonical Resource Library referenced by Editor/CMS/Schedule/Theme/Store | RES-001, RES-002, RES-008, EDT-018, SCH-013, DSN-001 | KEEP | 1.0 foundation; all consumer wiring phased | QA-002/004/007 |
| E.5-02 | Upload progress/cancel/retry/picker/preview/search/filter/folders/tags/metadata | RES-003–RES-007, RES-010 | EXPAND | 1.0 foundation | QA-002/004/006 |
| E.5-03 | Resource metadata: site/owner/MIME/size/dimensions/duration/alt/caption/checksum/key/status/usage | RES-001, RES-007, RES-008, RES-015 | EXPAND | 1.0 foundation | QA-002/003/004 |
| E.5-04 | D1 metadata and R2 binary boundary; upload validation, limits, MIME and permissions | RES-002, RES-003, RES-014, SEC-002, SEC-005 | KEEP | 0.x–1.0; actual R2 binding is blocking | QA-002/003/006 |
| E.5-05 | Image variants; font license/metadata; icon registry/search/rendering | RES-004, RES-011–RES-013 | EXPAND | 1.0 baseline; advanced transforms phased | QA-002/004/005 |
| E.5-06 | Usage checks before replace/rename/archive/delete; soft delete/restore where appropriate | RES-008, RES-009, RES-015 | EXPAND | 1.0 | QA-002/004/007 |
| E.5-07 | Public vs protected files; protected digital downloads later | RES-014, RES-016, STO-012, STO-013, SEC-002 | DEFER/EXPAND | Public resource 1.0; protected commerce 5.0 | QA-003/004/008 |
| E.6-01 | Design tokens for colors/type/spacing/size/breakpoints/radius/shadow/border/button/card/form/focus | DSN-001, DSN-005–DSN-007, DSN-016, QA-005 | EXPAND | 1.0 baseline | QA-002/004/005 |
| E.6-02 | Theme token changes propagate; local override must be explicit | DSN-002–DSN-004, DSN-013 | EXPAND | 2.0 full Theme Editor; 1.0 preset baseline | QA-002/004 |
| E.6-03 | Site/page/section/block presets and later creator templates | DSN-008–DSN-011 | EXPAND | 1.0 starter templates; library growth later | QA-002/004 |
| E.6-04 | Starter template categories: gaming/chat/esports/variety/VTuber/music/podcast/business/merch | DSN-005, DSN-008–DSN-010 | EXPAND | 1.0 initial selection; more later | QA-004 |
| E.6-05 | Reusable component library, variants, slots, defaults, internal structure and update policy | DSN-011–DSN-014 | EXPAND | 2.0 full registry | QA-002/004 |
| E.6-06 | Sanci Button Registry: stable ID, icon reference, route/action, visibility/order, display modes, states, global style and local override | DSN-016, DSN-017, EDT-017, SEC-005 | EXPAND | 1.0 core button behavior; registry maturity phased | QA-002/004/005 |
| E.6-07 | Linked Symbol instance; visible propagation scope and explicit detach | DSN-012, DSN-013 | EXPAND | 2.0 | QA-002/004 |
| E.6-08 | Import/export/version/compatibility/preview/rollback; marketplace later | DSN-014, DSN-015, MKT-001–MKT-005 | DEFER/EXPAND | 2.0 library; marketplace 6.0 | QA-002/004/007 |
| E.6-09 | Template/component updates cannot silently break published pages; preview/migration/revision | DSN-014, WEB-008, WEB-032, OPS-009 | EXPAND | 2.0 | QA-002/004/007 |
| E.7.1-01 | Dashboard: live/next stream/content/tasks/integration health/warnings and later business metrics | ADM-002–ADM-005, LIV-007, SCH-009, INT-002, ANL-001–ANL-010 | EXPAND | 1.0 truthful baseline; later cards phased | QA-002/004/006 |
| E.7.1-02 | Only real data/actions; no fake/placeholder action as active | ADM-003, ADM-004, ADM-008, QA-008 | KEEP | 0.x–1.0 and always-on | QA-004/006/008 |
| E.7.1-03 | Empty/loading/stale/partial failure/permission/error UI states | ADM-008, QA-006, INT-008, LIV-002 | EXPAND | 1.0 baseline | QA-004/006 |
| E.7.1-04 | Quick actions for edit/schedule/content/integration repair and future product/campaign | ADM-003, WEB-001, SCH-001, CNT-001, INT-007, STO-001, CAM-001 | EXPAND | 1.0 only implemented actions; future modules phased | QA-002/004/008 |
| E.7.2-01 | Module navigation, breadcrumb, active state, mobile menu, public/admin safe return | ADM-001, ADM-003, ADM-010, WEB-011 | EXPAND | 1.0 | QA-004/005 |
| E.7.2-02 | Global search for pages/assets/schedule/content/products/settings | ADM-006, WEB-029, RES-005, SCH-002, CNT-006, STO-007 | EXPAND | Shell baseline 1.0; cross-domain search phased | QA-002/004 |
| E.7.2-03 | Keyboard-accessible quick actions/command palette/recent items | ADM-006, ADM-003, QA-005 | EXPAND | 1.0 baseline; advanced command palette phased | QA-004/005 |
| E.7.2-04 | Unbuilt modules are not active; planned modules clearly labeled | ADM-001, ADM-003, ADM-008, QA-008 | KEEP | 0.x–1.0 and always-on | QA-004/008 |
| E.7.2-05 | Auth/session protection on all admin routes/APIs; logout/expiry explicit and tested | SEC-001, SEC-002, SEC-004, ADM-007 | KEEP | 0.x–1.0 | QA-003/004 |
| E.7.3-01 | Shared success/error/warning/info, inline validation, toast and destructive confirmation | ADM-008, QA-005 | EXPAND | 1.0 baseline | QA-004/005 |
| E.7.3-02 | Lists provide loading/empty/error/retry/pagination/permission states | ADM-008, QA-006 | EXPAND | 1.0 baseline | QA-004/006 |
| E.7.3-03 | Form dirty state/save status/error preservation/accessibility focus | EDT-027, ADM-008, QA-005 | EXPAND | 1.0 baseline | QA-002/004/005 |
| E.7.3-04 | Explain destructive effects; confirm delete/disconnect/rollback | ADM-008, RES-009, INT-007, WEB-007, OPS-009 | EXPAND | 1.0 | QA-003/004 |
| E.7.3-05 | UI cannot claim success before backend confirmation | ADM-008, EDT-027, INT-008, QA-006 | KEEP | 0.x–1.0 and always-on | QA-002/004/006 |
| E.7.4-01 | Website Manager owns pages/navigation/SEO/publish/theme settings | WEB-001–WEB-013, SEO-001–SEO-005, DSN-001–DSN-017, SET-001–SET-003 | MERGE | 1.0 core | QA-002/004 |
| E.7.4-02 | Schedule Manager owns event/calendar/recurrence/timezone/sync | SCH-001–SCH-015 | KEEP | 1.0 core with staged advanced features | QA-002/004 |
| E.7.4-03 | Integration Manager owns connect/disconnect/scope/token/sync/health/errors | INT-001–INT-020 | EXPAND | 1.0 Twitch Connections Center; providers later | QA-002/003/008 |
| E.7.4-04 | Media Manager owns files/metadata/usage/storage status | RES-001–RES-016 | EXPAND | 1.0 foundation; R2 binding/API blocker | QA-002/003/007 |
| E.7.4-05 | Content Manager owns ideas/drafts/media/metadata/calendar/publish queue | CNT-001–CNT-020 | DEFER/EXPAND | 1.5–2.0 | QA-002/004/008 |
| E.7.4-06 | Store Manager owns products/variants/collections/orders/discounts/fulfillment | STO-001–STO-020 | DEFER | 5.0 | QA-002/003/008 |
| E.7.4-07 | Community Manager owns members/roles/events/polls/moderation/reports/reputation | COM-001–COM-018 | DEFER/EXPAND | 1.0 links only; full community later | QA-003/004/008 |
| E.7.4-08 | Analytics Manager owns date/platform/domain metrics and export | ANL-001–ANL-010 | DEFER | 2.0+ by source capability | QA-002/003/008 |
| E.7.4-09 | Automation Manager owns triggers/conditions/actions/version/log/retry/toggle | AUT-001–AUT-014 | DEFER | 7.0 | QA-002/003/008 |
| E.7.4-10 | AI Manager owns model/config/usage/jobs/approval/diff/rollback | AI-001–AI-020 | DEFER | 3.0+ | QA-002/003/008 |
| E.7.4-11 | Business/Sponsorship Manager owns media kit/leads/deals/deliverables/deadlines/campaign | CAM-001–CAM-009 | DEFER | 5.0 | QA-002/003/008 |
| E.7.4-12 | Settings/Security owns account/site/locale/domain/SEO/roles/privacy/integrations/export/delete/audit | SET-001–SET-003, SEC-001–SEC-011, OPS-005 | EXPAND | 0.x–1.0 baseline; advanced settings later | QA-003/004/008 |
| E.7.4-13 | These are full Creator OS surfaces; only phased implemented modules may be active | ADM-003, ADM-008, QA-008 | KEEP | All phases by canonical owner | QA-004/008 |
| E.8-01 | One canonical Schedule item; Editor only configures the display block | SCH-001, SCH-011, EDT-020 | KEEP | 1.0 | QA-002/003/004 |
| E.8-02 | Schedule fields include title/description/timezone/platform/game/artwork/link/visibility/status/featured/recurrence/override/provider ID | SCH-001, SCH-003–SCH-008, SCH-012–SCH-014, RES-013 | EXPAND | 1.0 core fields; advanced recurrence phased | QA-002/004 |
| E.8-03 | Planned/live/completed/cancelled/postponed states drive public display and notifications | SCH-005, SCH-010, COM-011 | EXPAND | 1.0 states; notifications later | QA-002/004 |
| E.8-04 | List/calendar/upcoming/past/filter/search/pagination/details views | SCH-002, SCH-006 | EXPAND | 1.0 baseline; advanced views phased | QA-002/004 |
| E.8-05 | Timezone/DST storage and local display correctness | SCH-003 | KEEP | 1.0 | QA-002/004 |
| E.8-06 | Edit one occurrence/this and future/all series when recurrence supported | SCH-004 | EXPAND | 1.5–2.0 if not supported in 1.0 | QA-002/004 |
| E.8-07 | Twitch sync vs manual override precedence; sync status/error/retry/source | SCH-007, SCH-008, INT-008, INT-009 | EXPAND | 1.0 Twitch sync baseline | QA-002/003/006 |
| E.8-08 | Site ownership, permission, validation, idempotency and public API/render tests | SCH-001, SEC-002, SEC-003, QA-002–QA-004 | KEEP | 0.x–1.0 | QA-002/003/004 |
| E.8-09 | Current Schedule CRUD is only a starting point, not full capability completion | SCH-001–SCH-015 | KEEP | Incremental by §39 | QA-002/004/008 |
| E.9-01 | Common connection lifecycle, scopes, expiry, last success, health and diagnostics | INT-001–INT-009, INT-020 | EXPAND | 1.0 Twitch; later providers phased | QA-002/003/008 |
| E.9-02 | Connect/reconnect/revoke/expiry/network/rate-limit/outage/payload failure handling | INT-007–INT-009, INT-020 | EXPAND | 1.0 Twitch baseline; providers later | QA-002/003/006 |
| E.9-03 | OAuth state/PKCE where applicable, safe token storage, state/nonce and callback defense | INT-003–INT-006, SEC-004, SEC-008 | KEEP | 0.x–1.0 | QA-003 |
| E.9-04 | Twitch 1.0 ownership/live/channel/game/schedule sync/last sync/error/retry | INT-005, INT-010, INT-011, INT-020, LIV-001–LIV-007, SCH-007–SCH-008 | EXPAND | 1.0 Twitch | QA-002/003/004/006 |
| E.9-05 | Normalize external webhook/API payloads into canonical StreamEvent/Integration state | INT-001, INT-017, INT-018, LIV-006, AUT-001 | EXPAND | Twitch baseline 1.0; event ecosystem later | QA-002/003 |
| E.9-06 | Later YouTube/TikTok/Kick/Discord/OBS/email/payment/commerce adapters with independent capability tests | INT-013–INT-021, OBS-001–OBS-010, COM-001–COM-018, STO-001–STO-020, SUP-001–SUP-012 | DEFER | 1.5–5.0 by provider/domain | QA-002/003/008 |
| E.9-07 | Provider outage cannot take down the whole public site or Admin | INT-008, INT-020, LIV-002, DYN-005, OPS-003, OPS-008 | KEEP | 0.x–1.0 and all future providers | QA-003/006/008 |

**Batch 2 result:** 66 E.4–E.9 source bullets mapped at requirement level. Structural validation on commit 13da8d20c9483281d2d4b48532d8f2ca584e5e80 confirmed 66 rows, 282 distinct explicit/range-expanded feature/QA references and no unresolved IDs. Mapping remains non-runtime evidence; the next batch covers E.10–E.22, then F.1–F.13. Before P0.2 PASS, verify source bullet text/counts against the archive and resolve any broad domain mapping to the exact per-feature acceptance contract.


### 37.24. P0.2 — Bullet-szintű crosswalk, batch 3: E.10–E.14 (Content, OBS, Commerce, Community, Analytics, Automation, AI)

**Forrás:** archived MASTER snapshot, 00.9.6.E.10–E.14.1. A 45 forrásbullet külön mappinget kapott; a provider- és üzleti képességek későbbi fázisúak, amíg konkrét endpoint, engedély, jogi/pénzügyi döntés és acceptance nincs.

| Forráskulcs | Megőrzött követelmény röviden | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| E.10-01 | Content ideas/drafts/scripts/thumbnails/title/description/tags/platform/date/campaign | CNT-010–CNT-012, CNT-016 | EXPAND | 1.5–2.0 | QA-002/004 |
| E.10-02 | Content calendar/queue/approval/publish status/failure handling | CNT-009, CNT-013–CNT-015 | EXPAND | 1.5–2.0 | QA-002/004/006 |
| E.10-03 | Distinct VOD/clip/Short/highlight/video/playlist/post types with shared metadata | CNT-001–CNT-005, CNT-018, CNT-020 | EXPAND | 1.5–2.0 | QA-002/004 |
| E.10-04 | Platform-specific title/description/thumbnail/tags and publishing restrictions | CNT-011, CNT-012, INT-013–INT-016 | EXPAND | 1.5+ capability-gated | QA-002/003/004 |
| E.10-05 | Import/sync, duplicate detection, external IDs and idempotency | CNT-002, CNT-007, INT-008, INT-009 | EXPAND | 1.5–2.0 | QA-002/003/006 |
| E.10-06 | Clip/Short workflow, cut points, vertical format, captions, hooks and export preparation | CNT-003, CNT-017, CNT-018, AI-014, RES-004 | DEFER/EXPAND | 2.0–3.0 | QA-002/004/008 |
| E.10-07 | Cross-platform adaptation/publishing queue only when provider APIs/scopes allow it | CNT-011, CNT-013–CNT-015, INT-013–INT-016 | DEFER | 1.5–2.0 by provider | QA-002/003/008 |
| E.11-01 | Overlay/alert packs, stream frames, scenes/browser sources and responsive rendering | OBS-001, OBS-005, OBS-010, LIV-005 | DEFER/EXPAND | 2.0 | QA-002/004/005 |
| E.11-02 | OBS connection, scene/stream/recording state, commands/markers/replay buffer where supported | OBS-002–OBS-004, INT-001, INT-018 | DEFER | 2.0+ OBS capability-gated | QA-002/003/008 |
| E.11-03 | Follow/sub/raid/tip/purchase/membership alerts only from real supported events | OBS-006, OBS-008, AUT-001, INT-017, SUP-002, STO-018 | DEFER | 2.0–7.0 by event source | QA-002/003/008 |
| E.11-04 | Chatbot/commands/timers/loyalty/giveaways/polls/moderation/prediction | OBS-007, OBS-008, COM-004, COM-009, COM-010, AUT-004 | DEFER | 2.0–7.0, platform-policy gated | QA-002/003/008 |
| E.11-05 | Macro Deck/external controls through an adapter, no hidden provider dependency | OBS-009, INT-001, INT-018 | DEFER | 2.0+ | QA-002/003 |
| E.11-06 | Stream tools remain outside Editor core; Editor only configures layout/display | EDT-020, OBS-001–OBS-010, LIV-005 | KEEP | 2.0 | QA-002/004 |
| E.12-01 | Product catalogue with variants/categories/collections/media/price/currency/stock/fulfillment state | STO-001–STO-004, STO-006 | DEFER | 5.0 | QA-002/003/008 |
| E.12-02 | Physical/digital/bundle/limited/preorder/membership-linked product types | STO-005, STO-012, SUP-004–SUP-006 | DEFER | 5.0 | QA-002/003/008 |
| E.12-03 | Storefront list/detail/search/filter/cart/checkout/order confirmation | WEB-025, STO-007–STO-009, STO-019 | DEFER | 5.0 | QA-002/003/004 |
| E.12-04 | Fulfillment provider adapters (e.g. Fourthwall/Printful/Shopify) after feasibility review | STO-006, STO-010, STO-019, INT-021 | DEFER | 5.0 provider-gated | QA-002/003/008 |
| E.12-05 | Orders/refunds/discounts/gift cards/customer account/shipping/tax/VAT/invoice | STO-009–STO-015, STO-018–STO-019, CAM-009 | DEFER | 5.0 after legal/business review | QA-002/003/008 |
| E.12-06 | Digital products and license/access control | STO-005, STO-012–STO-014, RES-016 | DEFER | 5.0 | QA-002/003/008 |
| E.12-07 | Purchase→entitlement→customer access; protected files never exposed through unrestricted public R2 URL | STO-012, STO-013, SUP-006, RES-014, RES-016, SEC-002 | KEEP | 5.0 security gate | QA-003/008 |
| E.12-08 | Tips/supporter goals/membership/perks/private content/Discord role/sub benefits/discounts/exclusive events | SUP-001–SUP-012, COM-013, STO-011, INT-015 | DEFER | 5.0 provider/policy-gated | QA-002/003/008 |
| E.12-09 | Separate creator revenue from platform revenue; multi-creator funds only after payment/compliance/legal review | STO-019, CAM-009, SEC-003, TEAM-001 | KEEP | 4.0–5.0 legal gate | QA-003/008 |
| E.13-01 | External community entry points first; later member/profile/follow/comment/reaction/post/poll/event/notification | COM-001–COM-008, COM-011, COM-018 | DEFER/EXPAND | 1.0 links; full community later | QA-002/004/008 |
| E.13-02 | Moderation/report/ban/roles/submissions/badges/challenges/reputation | COM-008–COM-012 | DEFER | 2.0+ | QA-002/003/008 |
| E.13-03 | Discord role sync and membership entitlement through authenticated audited adapter | INT-015, SUP-006, SUP-009, COM-009, SEC-010 | DEFER | 1.5–5.0 | QA-002/003/008 |
| E.13-04 | Email audience: signup/consent/lists/segments/campaign/newsletter/transactional email/unsubscribe | COM-015–COM-017, CAM-002, SEC-011 | DEFER | 2.0+ provider/legal-gated | QA-003/008 |
| E.13-05 | Consent revoke, export/delete and retention | SEC-011, COM-017, OPS-005 | KEEP | Privacy baseline 1.0; audience workflows later | QA-003/008 |
| E.13-06 | Future member area/PWA/mobile notifications/schedule/live/community/store/dashboard | WEB-026, COM-006–COM-018, SCH-002, LIV-007, STO-007, ADM-010 | DEFER | 2.0+ | QA-004/005/008 |
| E.13-07 | Founding Supporters list requires separate voluntary revocable opt-in | COM-014, SEC-011, COM-018 | KEEP | 1.0 only if enabled; otherwise later | QA-003/004/008 |
| E.14-01 | Website analytics: visitors/sessions/pageviews/device/referrer/conversion/legally permitted aggregate geography | ANL-001, ANL-002, ANL-009 | DEFER/EXPAND | 2.0 privacy-gated | QA-003/008 |
| E.14-02 | Provider creator metrics only when provider/time period/scope permits | ANL-003, ANL-004, LIV-004, INT-013–INT-016 | DEFER | 1.5–2.0 by provider | QA-002/003/008 |
| E.14-03 | Stream intelligence: silence/chat/audio/OBS quality/highlights/weekly summary only with supported sources and consent | ANL-003, ANL-006, AI-014, AI-015, OBS-003, OPS-007 | DEFER | 3.0–8.0 | QA-003/006/008 |
| E.14-04 | Commerce analytics: sales/revenue/AOV/conversion/product/campaign | ANL-005, CAM-007, STO-020 | DEFER | 5.0 | QA-002/003/008 |
| E.14-05 | Community analytics: active members/engagement/retention/event participation | ANL-006, COM-005, COM-010 | DEFER | 2.0+ | QA-002/003/008 |
| E.14-06 | Unified metrics source/period/freshness/missing data/provider limits/CSV/export/permissions | ANL-001, ANL-007–ANL-009, SEC-002, SEC-011 | EXPAND | 2.0+ | QA-002/003/008 |
| E.14-07 | Versioned event→trigger→condition→action automation | AUT-001–AUT-005 | DEFER | 7.0 | QA-002/003/008 |
| E.14-08 | Cross-domain examples: live→site/Discord, video→feed, purchase→alert, member→role, schedule→notification, clip→social | AUT-001–AUT-004, AUT-014, INT-015, SCH-008, CNT-013 | DEFER | 7.0 after domain APIs | QA-002/003/008 |
| E.14-09 | Delay/retry/idempotency/rate limits/dead-letter/audit/enable-disable/site rules | AUT-005–AUT-012, SEC-003, SEC-010 | DEFER | 7.0 | QA-002/003/006/008 |
| E.14-10 | Automation failure cannot loop indefinitely or bypass domain permissions | AUT-006, AUT-007, AUT-011, AUT-014, SEC-002 | KEEP | 7.0 release gate | QA-003/006/008 |
| E.14-11 | AI website assistant converts intent to validated Page Operations, not arbitrary HTML/DOM/DB/code edits | AI-003, AI-005, AI-006, AI-008, EDT-003, SEC-002 | DEFER | 3.0 | QA-002/003/008 |
| E.14-12 | AI pipeline: intent→plan/actions→schema/permission validation→preview/diff→approval→canonical execute→verify→audit/version | AI-003, AI-005–AI-009, AI-019, EDT-003, SEC-002 | KEEP | 3.0 safety gate | QA-002/003/008 |
| E.14-13 | AI suggestions for layout/content/SEO/localization/schedule and later transcripts/chapters/highlights/clips/scripts | AI-011–AI-015, AI-012, AI-013, AI-014 | DEFER/EXPAND | 3.0–8.0 | QA-002/004/008 |
| E.14-14 | AI changes require preview/permission/validation/rollback/usage tracking | AI-006–AI-010, AI-019 | KEEP | 3.0 safety gate | QA-002/003/008 |
| E.14-15 | AI usage/permission/prompt templates/jobs/approval/errors; provider keys never in browser | AI-001, AI-002, AI-010, AI-017, SEC-008 | DEFER | 3.0 | QA-003/008 |
| E.14-16 | No irreversible public/business action without required human approval | AI-007, AI-019, STO-018, AUT-009, SEC-002 | KEEP | 3.0+ safety gate | QA-003/008 |

**Batch 3 result:** 45 E.10–E.14 source bullets mapped. Structural validation on commit 107e7a46628d290067631d0b32063bdd31538611 confirmed 45 rows, 150 distinct explicit/range-expanded feature/QA references and no unresolved IDs. Provider access, financial operations, member data and AI remain explicitly phase-/permission-gated. Mapping is not runtime PASS.


### 37.25. P0.2 — Bullet-szintű crosswalk, batch 4: E.15–E.21, E.20 contract és negatív tesztek

**Forrás:** archived MASTER snapshot, 00.9.6.E.15–E.21, E.20 funkciókártya-sablon és kötelező negatív tesztek. A történeti F0.1–F0.13 fázisnevek nem aktív utasítások; a jelenlegi §39 roadmap és P0/P1 végrehajtási állapot az irányadó.

| Forráskulcs | Megőrzött követelmény röviden | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| E.15-01 | Media kit, current creator stats, audience overview, brand category, rate card and brand assets | CAM-004, CAM-007, ANL-004, CAM-005 | DEFER | 5.0 | QA-002/008 |
| E.15-02 | Sponsor lead/deal/brief/deliverables/deadlines/status/analytics/invoice later | CAM-001, CAM-003, CAM-005–CAM-009 | DEFER | 5.0 | QA-002/003/008 |
| E.15-03 | Role-based business-document access; public media kit only exposes selected data | CAM-004, CAM-008, SEC-002, SEC-011 | KEEP | 5.0 privacy gate | QA-003/008 |
| E.15-04 | Sponsorship module later and must not block 1.0 website/editor | CAM-001–CAM-009, §39.7 | KEEP | 5.0 | QA-008 |
| E.16-01 | Hungarian first; model/UI ready for multiple languages | LOC-001–LOC-004, WEB-001 | EXPAND | 1.0 architecture-ready; full workflow later | QA-004/005 |
| E.16-02 | Translation keys/fallback/date-timezone/number-currency/locale SEO metadata | LOC-001–LOC-004, SEO-001, SCH-003 | EXPAND | 1.0 foundations; full locale workflow later | QA-004/005 |
| E.16-03 | Translate Page/Content/Navigation/Theme/Template fields without overwriting another locale | LOC-001, LOC-003, WEB-001, CNT-001, DSN-008 | DEFER/EXPAND | 2.0 | QA-002/004 |
| E.16-04 | Visible incomplete-translation status, preview and publish policy | LOC-004, WEB-005, WEB-006 | DEFER/EXPAND | 2.0 | QA-002/004 |
| E.16-05 | AI-assisted translation only after review/explicit acceptance | LOC-003, AI-012, AI-007, AI-019 | DEFER | 3.0 | QA-003/004/008 |
| E.17-01 | Future tenant/workspace→users/members→sites→modules structure | TEAM-001–TEAM-006, SEC-003 | DEFER | 4.0+ | QA-003/008 |
| E.17-02 | Multiple sites in workspace with separate settings | TEAM-001, TEAM-002, SET-001–SET-003, SEC-003 | DEFER | 4.0+; current global uniqueness constraints block unreviewed rollout | QA-003/008 |
| E.17-03 | Owner/admin/editor/designer/moderator/analyst/content/store/finance roles with granular site/module permissions | TEAM-003, TEAM-005, SEC-002, SEC-003 | DEFER | 4.0+; 1.0 RBAC baseline still mandatory | QA-003/008 |
| E.17-04 | Package tiers only after actual cost/usage/business-model evidence | TEAM-006, STO-019, CAM-009, OPS-008 | DEFER | 4.0–5.0 | QA-003/008 |
| E.17-05 | Billing/subscription/quota/usage/invoice/upgrade/downgrade/cancel and revenue boundaries | TEAM-006, STO-008–STO-010, STO-014, STO-019, CAM-009 | DEFER | 4.0–5.0 | QA-002/003/008 |
| E.17-06 | Tenant isolation on every record/action; client-supplied site ID is not authorization | SEC-002, SEC-003, TEAM-001, OPS-004 | KEEP | 0.x–1.0 baseline; expand before 4.0 | QA-003/008 |
| E.17-07 | Multi-site/team/SaaS is long-term and not automatic 1.0 scope | TEAM-001–TEAM-006, §39.6 | KEEP | 4.0+ | QA-008 |
| E.18-01 | Versioned validated import/export for Site/Page/Template/Component/Theme; no secrets/tokens | OPS-005, DSN-015, WEB-008, SEC-008 | EXPAND | 1.0 recovery/export baseline; broad packages later | QA-003/007 |
| E.18-02 | Backup/restore for published/draft states with dry-run and integrity check | OPS-005, OPS-006, OPS-009, WEB-007, WEB-008 | EXPAND | 0.x–1.0 baseline | QA-002/006/007 |
| E.18-03 | Structured logs/correlation IDs/integration health/errors/sync/queue/DB/cache metrics | OPS-002, OPS-003, OPS-008, INT-008, AUT-008 | EXPAND | 0.x–1.0 baseline; advanced operations later | QA-006/008 |
| E.18-04 | Admin diagnostics for failed jobs/syncs/integration/deploy version without secrets in logs | OPS-001–OPS-003, OPS-007, INT-020, SEC-008 | EXPAND | 1.0 baseline | QA-003/006/008 |
| E.18-05 | Future public API/webhooks/developer keys/extensions/marketplace with scoped permissions/rate limits/versioning | INT-017, INT-018, INT-021, MKT-001–MKT-005, SEC-007 | DEFER | 6.0+ | QA-002/003/008 |
| E.19-01 | D1 structured data, R2 binaries, Queues retryable work, Workflows long jobs, Durable Objects only for justified stateful coordination | RES-002, AUT-007, OPS-011, INT-001 | KEEP | Architecture baseline; each runtime capability gated | QA-002/003/006 |
| E.19-02 | Every domain has schema/service/API/auth/validation/audit/tests/failure behavior | §25–26, SEC-002, SEC-010, QA-001–QA-010 | KEEP | All phases | QA-002/003/008 |
| E.19-03 | Integration adapters normalize provider payloads | INT-001, INT-018, LIV-006, AUT-001 | KEEP | 0.x–1.0 baseline; expand per provider | QA-002/003 |
| E.19-04 | Webhook/sync signature/state/replay/idempotency/rate/retry/diagnostics | INT-003, INT-009, INT-017, SEC-004, SEC-009, AUT-006–AUT-008 | KEEP | 0.x–1.0 baseline; provider-specific tests later | QA-003/006 |
| E.19-05 | Auth/RBAC/site/tenant/input/output/XSS/CSRF/cookie/secrets/OAuth/upload/least privilege/audit | SEC-001–SEC-010, SEC-003, RES-003, INT-003, INT-019 | KEEP | 0.x–1.0 release gate | QA-003 |
| E.19-06 | Consent/privacy/access/export/delete/retention/cookies/unsubscribe and legal review | SEC-011, COM-017, ANL-009, OPS-005 | KEEP | Privacy baseline 1.0; domain-specific later | QA-003/008 |
| E.19-07 | Event/publish-bound cache invalidation; no dangerous stale Admin/Editor state | WEB-030, DYN-006, OPS-008, EDT-028 | KEEP | 0.x–1.0 | QA-002/004/006 |
| E.19-08 | Forward-only migrations with rollback/data-loss analysis, preflight/dry-run/post-check | OPS-004–OPS-006, OPS-009, SEC-010 | KEEP | 0.x–1.0 release gate | QA-003/006/007 |
| E.20-01 | Every feature defines user goal/outcome | §26.1, QA-001 | KEEP | All phases | QA-002/008 |
| E.20-02 | UI route, entry and return navigation | ADM-001, WEB-012, EDT-035 | KEEP | All phases | QA-004/005 |
| E.20-03 | Normal/empty/loading/validation/error/retry/permission-denied behavior | ADM-008, QA-006 | KEEP | All phases | QA-004/006 |
| E.20-04 | Canonical domain/data model/owner/fields/status/relations/invariants | §5, §29, SEC-002 | KEEP | All phases | QA-002/003 |
| E.20-05 | API/service contract, validation/auth/error codes/idempotency | §26.1, SEC-002, INT-001, AUT-006 | KEEP | All phases | QA-002/003/006 |
| E.20-06 | Admin/Editor/Public rendering and responsive/accessibility requirements | ADM-001–ADM-010, WEB-001–WEB-032, EDT-001–EDT-042, QA-005 | KEEP | All phases | QA-004/005 |
| E.20-07 | Integration/dependencies/scopes/rate limits/timeouts/provider downtime | INT-001–INT-009, OPS-011 | KEEP | Every provider-dependent phase | QA-003/006/008 |
| E.20-08 | Unit/domain/API/D1/migration/permission/ownership/browser desktop-tablet-mobile/regression tests | QA-001–QA-010 | KEEP | All phases | QA-002–QA-010 |
| E.20-09 | Reproducible acceptance scenario input→action→expected result | §26.1, QA-009 | KEEP | All phases | QA-009 |
| E.20-10 | Evidence: commands/test output/browser/live check/commit/known limitations | §16–18, QA-009, OPS-001 | KEEP | All phases | QA-009 |
| E.20-11 | Explicit PLANNED/ACTIVE/BLOCKED/PASS/FAIL/DEFERRED status; PASS only after DoD | §11, §25, QA-009 | KEEP | All phases | QA-009 |
| E.20-12 | MASTER checkpoint records result/contracts/next single active point | §0.2, §16–18 | KEEP | All phases | QA-009 |
| E.20-N01 | Unauthorized user cannot read/write another site's data | SEC-002, SEC-003, QA-003 | KEEP | All mutation domains | QA-003 |
| E.20-N02 | Invalid input cannot persist | SEC-002, EDT-022, QA-002 | KEEP | All mutation domains | QA-002/003 |
| E.20-N03 | Repeated webhook/sync cannot create duplicate event/transaction | INT-017, AUT-006, SCH-008, STO-018 | KEEP | All integrations | QA-003/006 |
| E.20-N04 | Provider outage cannot disable the entire public site/Admin | INT-020, LIV-002, DYN-005, OPS-003 | KEEP | All provider domains | QA-003/006 |
| E.20-N05 | Failed save/publish cannot show success or delete draft | EDT-027–EDT-031, WEB-006–WEB-007 | KEEP | 1.0 release gate | QA-002/004/006 |
| E.20-N06 | Stale revision cannot silently overwrite newer state | EDT-029, EDT-030, WEB-008 | KEEP | 1.0 release gate | QA-002/003/004 |
| E.20-N07 | Delete cannot leave broken references or remove used assets invisibly | RES-008, RES-009, WEB-003, QA-007 | KEEP | 1.0 resource/page safety | QA-002/004/007 |
| E.20-N08 | Mobile cannot have critical overflow/inaccessible controls | ADM-010, EDT-035–EDT-037, QA-005 | KEEP | 1.0 release gate | QA-004/005 |
| E.20-N09 | Secrets/tokens never appear in client code/URL/log/export | SEC-008, INT-019, OPS-002, OPS-005 | KEEP | 0.x–1.0 release gate | QA-003 |
| E.20-N10 | After rollback/restore canonical data and public rendering remain consistent | WEB-007, WEB-008, OPS-005, OPS-009 | KEEP | 0.x–1.0 release gate | QA-002/006/007 |
| E.21-01 | Historical F0.1–F0.13 Creator Website 1.0 program and feature set | §39.2, EDT-001–EDT-042, ADM-001–ADM-010, WEB-001–WEB-032, RES-001–RES-016, DSN-001–DSN-018, SCH-001–SCH-015, INT-001–INT-021, SEO-001–SEO-005, QA-001–QA-010 | REPLACE | Current §39 + P0/P1 sequence | QA-002/004/008 |
| E.21-02 | 1.x Creator Profile/Link Hub/Content Hub/VOD/Shorts/calendar/integrations/audience/basic analytics | WEB-022, CNT-002–CNT-020, INT-013–INT-021, COM-015, ANL-001–ANL-004 | MERGE | 1.5–2.0 | QA-002/004/008 |
| E.21-03 | 1.5–1.9 monetization/community/automation foundations | STO-001–STO-020, SUP-001–SUP-012, COM-001–COM-018, AUT-001–AUT-014 | MERGE | 1.5–7.0 by domain | QA-002/003/008 |
| E.21-04 | 2.x Creator OS dashboard/analytics/content/email/sponsorship/OBS/AI | ADM-001–ADM-010, ANL-001–ANL-010, CNT-001–CNT-020, COM-015–COM-017, CAM-001–CAM-009, OBS-001–OBS-010, AI-001–AI-020 | MERGE | §39.4–39.5 | QA-002/003/008 |
| E.21-05 | 3.x business/marketplace and revenue share | STO-001–STO-020, SUP-001–SUP-012, MKT-001–MKT-005, CAM-001–CAM-009, TEAM-001–TEAM-006 | MERGE | 5.0–6.0 | QA-002/003/008 |
| E.21-06 | 4.x multi-site/teams/workspaces/roles | TEAM-001–TEAM-006, SEC-003 | MERGE | 4.0 | QA-003/008 |
| E.21-07 | 5.x SaaS/multi-tenant/packages/billing/usage/platform admin | TEAM-006, STO-019, CAM-009, SEC-003, OPS-008 | MERGE | 4.0–5.0 | QA-003/008 |
| E.21-08 | 6.x–10.x global ecosystem/extensions/advanced automation/AI/localization | MKT-001–MKT-005, AUT-001–AUT-014, AI-001–AI-020, LOC-001–LOC-004, §39.8–39.12 | MERGE | 6.0–10.0 | QA-002/003/008 |

**Batch 4 result:** 59 source requirements mapped (47 E.15–E.21 bullets, including the 10 negative-test requirements, plus 12 feature-card fields). The historical phase labels are preserved as provenance; only the current §39 roadmap controls execution. This is structural validation, not source-text completeness or runtime PASS.


### 37.26. P0.2 — Bullet-szintű crosswalk, batch 4 szerkezeti validáció

**Ellenőrzött scope:** §37.25 táblázat, E.15–E.21 követelmények, E.20 feature-card/negative-test mezők.

- Tételsorok: 59; egyedi source key-k: 59; duplikált key: 0.
- A locale coverage audit két valódi követelményrést talált, ezért LOC-005 (translation completeness/preview/publish) és LOC-006 (AI-assisted translation review/approval) bekerült a §24 registrybe. LOC-007/LOC-008 nincs definiálva, és nem hivatkozható.
- A crosswalk továbbra is tervszintű leképezés. Nem bizonyítja, hogy a hivatkozott feature contractok teljesek, a történeti forrás minden alpontja szó szerint lefedett, vagy a funkciók runtime PASS állapotúak.
- Következő batch: a történeti F.1–F.13 forrásalpontok külön kulcsokra bontása, feature-ID-k validálása a §24 registry ellen, majd a forráskulcs-szám és a hivatkozások ellenőrzése. A régi F0.1–F0.13 fázisnevek provenance-adatok, nem aktív végrehajtási pontok.


### 37.27. P0.2 — Bullet-szintű crosswalk, batch 5: F.1–F.4 (Editor, data binding, layout, public content)

**Forrás:** archivált MASTER snapshot, 00.9.6.F.1–F.4. A forráskövetelmények az alábbi sorokban külön, stabil történeti kulcsot kapnak. A jelenlegi §39 fázisai irányadók; a régi F0 állapotnevek nem aktiválhatók újra.

| Forráskulcs | Megőrzött követelmény | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| F.1-01 | Editor full user flow: select/create page, add/select element, Inspector/canvas edit, undo/redo, save draft, preview, explicit publish | EDT-001, EDT-005, EDT-027–EDT-034, WEB-004–WEB-008 | KEEP | 1.0 | QA-002/004 |
| F.1-02 | Reload/reopen preserves selection/editability; saved elements are not delete-only | EDT-003, EDT-027–EDT-030, WEB-004 | KEEP | 1.0 release gate | QA-002/004 |
| F.1-03 | Regression sequence: Box + heading/text/button/divider; Layers reselects earlier nodes; layout edit/save/reload/public render parity | EDT-003, EDT-004, EDT-022, EDT-027–EDT-034, WEB-004–WEB-006 | KEEP | 1.0 release gate | QA-002/004 |
| F.1-04 | Immutable history, maximum 50 entries, FIFO overflow | EDT-005, EDT-006 | KEEP | 1.0 | QA-002 |
| F.1-05 | One user intent per transaction; text debounce/blur groups edits; drag/slider groups pointer-down to pointer-up | EDT-005, EDT-006, EDT-007 | KEEP | 1.0 | QA-002/004 |
| F.1-06 | Preset/batch explicit transaction boundaries; no partial or self-referential undo/redo entries | EDT-005–EDT-007, QA-002 | KEEP | 1.0 | QA-002 |
| F.1-07 | Canvas, Layers, Inspector and persisted model share canonical command/state, not DOM snapshots | EDT-003–EDT-007, EDT-027–EDT-030 | KEEP | 1.0 release gate | QA-002/004 |
| F.1-08 | Debounced 2000 ms draft autosave; explicit Save Draft remains immediate; only validated Page Model persists | EDT-022, EDT-027, EDT-028, WEB-004 | KEEP | 1.0 | QA-002/004 |
| F.1-09 | Local crash recovery is separate from server draft and stores no secrets; conflict offers recovery/server/discard choices | EDT-030, WEB-007, WEB-008, OPS-009, SEC-008 | EXPAND | 1.0 recovery baseline | QA-003/006/007 |
| F.1-10 | Optimistic concurrency, unsaved-change warning, real retry/restore; larger Page Model history/autosave performance tests | EDT-027–EDT-034, WEB-008, OPS-008, QA-005/006 | KEEP | 1.0 release gate | QA-002/004/006 |
| F.2-01 | Canonical dynamic data pipeline: domain service → declared source → schema-valid binding → allowed transform → conditional render | DYN-001–DYN-008, WEB-020, EDT-018 | KEEP | 2.0, with 1.0 safe core only | QA-002/003/004 |
| F.2-02 | Provider sources enabled only by phase, official capability and connection scope | DYN-001, INT-001, INT-013–INT-016, SEC-002 | KEEP | Per-provider 1.5+ | QA-002/003/008 |
| F.2-03 | Query/filter/sort/limit saved only against declared schema; prohibit arbitrary SQL, arbitrary fetch and unrestricted JS | DYN-002–DYN-004, SEC-002, SEC-007 | KEEP | 2.0 | QA-002/003 |
| F.2-04 | Separate loading/empty/error/stale/partial-provider-failure states; redact internals and secrets | DYN-005, DYN-006, OPS-003, SEC-008 | KEEP | 1.0 baseline; full binding UI 2.0 | QA-003/004/006 |
| F.2-05 | Conditional visibility never bypasses authorization; cache invalidates on publish/schedule/sync | DYN-006, WEB-030, OPS-008, SEC-002 | KEEP | 1.0–2.0 | QA-002/003/006 |
| F.2-06 | Editor stores display configuration only; a Schedule block cannot mutate Schedule domain rows | EDT-018, SCH-001–SCH-015, DYN-001, SEC-002 | KEEP | 1.0 | QA-002/003/004 |
| F.3-01 | Box alignment: left, center, right and full width | EDT-010, EDT-016, EDT-021/022 | EXPAND | 1.0 validated Inspector controls | QA-002/004/005 |
| F.3-02 | Text alignment: left, center, right and justified | EDT-017, EDT-021/022 | EXPAND | 1.0 supported text properties | QA-002/004/005 |
| F.3-03 | Inner layout choices: stack, row, 2 columns, 3 columns and grid | EDT-016, EDT-021/022 | EXPAND | 1.0 supported layout subset; advanced Grid phased | QA-002/004/005 |
| F.3-04 | Vertical alignment: top, center and bottom | EDT-016, EDT-021/022 | EXPAND | 1.0 where supported by the active layout mode | QA-002/004/005 |
| F.3-05 | Size choices: auto, 25%, 50%, 75%, 100% and custom validated units | EDT-009, EDT-021/022, EDT-023/024 | EXPAND | 1.0 supported units; advanced expressions phased | QA-002/004/005 |
| F.3-06 | Independent horizontal/vertical spacers; gap, padding and margin separately, including per-side values where supported | EDT-016, EDT-021/022, DSN-001/006 | EXPAND | 1.0 validated spacing subset | QA-002/004/005 |
| F.3-07 | Width/height/min/max/aspect/overflow/wrap/order/responsive override validated for the active layout mode | EDT-009, EDT-016, EDT-021–026, QA-005 | KEEP | 1.0 core constraints; advanced responsive phased | QA-002/004/005 |
| F.3-08 | Canvas and Layers select the same canonical node; drag/resize must not convert flex/grid to absolute positioning | EDT-003/004, EDT-008/009, EDT-013, EDT-016, EDT-021/022 | KEEP | 1.0 release gate | QA-002/004/005 |
| F.3-09 | Plain Text is the 1.0 baseline; rich-text editing is separate tested scope and must not delay core Editor closure | EDT-017, EDT-019, QA-002/004 | KEEP | 1.0 plain text; rich text separately scoped | QA-002/004 |
| F.4-01 | Explicit public page types: Creator Home, Stream, Schedule, VOD/Video Hub, Clips/Shorts, About, Community, Contact, Support, Link Hub and Press Kit | WEB-001, WEB-021–WEB-026, CNT-001–CNT-005 | EXPAND | 1.0 core pages; later pages phased | QA-002/004/008 |
| F.4-02 | Creator Home uses authenticated provider data only, upcoming stream, content, social/community/support and phased merch/email/campaign | WEB-021–WEB-026, LIV-001–LIV-004, SCH-009, INT-001, COM-001, SUP-001 | EXPAND | 1.0 core; later capabilities phased | QA-002/003/004 |
| F.4-03 | Stream page: player/embed, real status/title/category/start, next stream and safe optional embeds | WEB-015, WEB-016, LIV-001–LIV-005, SCH-009, SEC-005/007 | EXPAND | 1.0 Twitch baseline | QA-002/003/004 |
| F.4-04 | VOD/content hub supports categories/tags/search/filter/playlists/related content and honest manual fallback when API unavailable | WEB-017, CNT-001–CNT-008, INT-013–INT-016 | EXPAND | 1.5–2.0 | QA-002/003/004 |
| F.4-05 | About, Link Hub and press-kit content are configurable; no hardcoded creator-specific product behavior | WEB-001 About/Profile, WEB-022 Link Hub, WEB-024 Sponsor/Press Kit, CAM-004, DSN-001, LOC-001 | EXPAND | 1.0 basic profile/link; advanced kit later | QA-002/004 |
| F.4-06 | Basic accessible interactions: click/hover/focus/active/submit/scroll/load/timer/open-close/navigation/show-hide/toggle | EDT-020, EDT-021, EDT-022, QA-004, QA-005 | KEEP | 1.0 baseline | QA-002/004/005 |
| F.4-07 | Advanced state machines/timeline/keyframes remain separately scoped; reduced motion, keyboard/focus, valid actions and performance are required | EDT-040, QA-005, SEC-007, OPS-008 | EXPAND | 1.0 reduced-motion baseline; advanced motion 2.0 | QA-004/005/008 |

**Batch 5 result:** 28 source requirements mapped for F.1–F.4. Structural checks must confirm each referenced ID exists in §24; source-bullet completeness and runtime behavior remain separate gates.



### 37.29. P0.2 — Bullet-szintű crosswalk, batch 6: F.5–F.8 (Content, Schedule, Admin, Analytics, Automation, AI)

**Forrás:** archived MASTER snapshot, 00.9.6.F.5–F.8. Mind a 26 forrásbullet külön kulcsot kap; a provider-, pénzügyi és AI-műveletek csak a saját capability/security gate után aktiválhatók.

| Forráskulcs | Megőrzött követelmény | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| F.5-01 | Content Manager ideas/drafts/scripts/title/description/tags/thumbnail/platform/date/campaign/approval | CNT-009–CNT-016, CAM-001 | EXPAND | 1.5–2.0 | QA-002/004 |
| F.5-02 | VOD ingestion/category, clips/Shorts, calendar, platform metadata variants, publish queue/external IDs/dedupe | CNT-001–CNT-007, CNT-009–CNT-015 (including CNT-014 publish status/retry/partial success), CNT-018 | DEFER/EXPAND | 1.5–2.0 | QA-002/003/006 |
| F.5-03 | Twitch OAuth/live/channel/game/permitted metrics/VOD/clips/events/sync diagnostics | INT-003–INT-012 (including INT-004 token lifecycle and INT-005 site ownership), INT-017, INT-020, LIV-001–LIV-007, CNT-002–CNT-004 | KEEP/EXPAND | 1.0 core; advanced content later | QA-002/003/006 |
| F.5-04 | YouTube channel/video/Shorts/available analytics/quota/scope/fallback | INT-013, ANL-004, CNT-002, CNT-003 | DEFER | 1.5+ provider-gated | QA-002/003/008 |
| F.5-05 | TikTok account-capability-gated profile/content with rate-limit/manual fallback | INT-014, CNT-002, CNT-003, INT-008, INT-009 | DEFER | 1.5+ provider-gated | QA-002/003/008 |
| F.5-06 | Discord link baseline; bot/role/status and Kick/OBS/email/payment/commerce adapters have own contracts | INT-015, COM-001, SUP-006, OBS-001–OBS-010, STO-001–STO-020, INT-021 | DEFER/EXPAND | 1.0 links; integrations later | QA-002/003/008 |
| F.5-07 | Normalize provider data; outage fallback; never invent missing metrics | INT-001, INT-018, INT-020, LIV-002, DYN-005, ANL-008 | KEEP | 0.x–1.0 baseline | QA-002/003/006 |
| F.6-01 | Canonical Schedule fields, lifecycle, recurrence, source and external-ID mapping | SCH-001–SCH-015, RES-013 | EXPAND | 1.0 core; advanced recurrence phased | QA-002/004 |
| F.6-02 | Schedule list/calendar/upcoming/past/search/filter/sort and lifecycle states | SCH-002, SCH-005, SCH-006, SCH-010 | EXPAND | 1.0 baseline | QA-002/004 |
| F.6-03 | DST/timezone and recurrence edits scoped to one event/future events/series where supported | SCH-003, SCH-004 | EXPAND | 1.0 timezone; recurrence 1.5–2.0 if not accepted | QA-002/004 |
| F.6-04 | Next stream/countdown uses canonical schedule/site timezone/authenticated live state and excludes cancelled/past events | SCH-009, SCH-003, SCH-005, LIV-001, WEB-016 | KEEP | 1.0 | QA-002/004 |
| F.6-05 | Link VOD/clip/Short to stream and calendar; Editor Schedule block changes presentation only | SCH-015, CNT-002–CNT-004, EDT-020, SCH-011 | EXPAND | 1.0 Schedule; richer content later | QA-002/003/004 |
| F.7-01 | Admin shell navigation/breadcrumb/public return/profile/session/logout/help/notifications/mobile shell | ADM-001–ADM-010, SEC-001, WEB-011 | EXPAND | 1.0 | QA-003/004/005 |
| F.7-02 | Shared loading/empty/error/success/disabled/unsaved states, validation/confirm/search/filter/pagination/keyboard/Hungarian UI | ADM-008, QA-005, EDT-027 | EXPAND | 1.0 | QA-004/005/006 |
| F.7-03 | Session expiry/logout/inactivity/multi-tab/unsaved flow and server-side admin/API authorization | SEC-001, SEC-002, SEC-004, ADM-007, EDT-031 | KEEP | 0.x–1.0 | QA-003/004 |
| F.7-04 | Public forms: schema/required labels/client+server validation/spam rate limit/success/error/privacy notice | WEB-027, SEC-007, SEC-011, QA-006 | EXPAND | 1.0 if form enabled | QA-003/004/006 |
| F.7-05 | Store CRUD/variants/SKU/pricing/stock/order/payment/fulfillment/refund/provider errors | STO-001–STO-020 (including STO-002 variants/SKU/pricing and STO-003 categories/collections), STO-017, WEB-025 | DEFER | 5.0 | QA-002/003/008 |
| F.7-06 | Merch/digital/bundle/preorder/limited drop/coupon/gift card/invoice/shipping/tax | STO-005–STO-020, CAM-009, SUP-004–SUP-006 | DEFER | 5.0 after legal/payment review | QA-002/003/008 |
| F.8-01 | Consent-aware web/content/stream/commerce/community analytics only from real sources | ANL-001–ANL-006, ANL-009, SEC-011 | DEFER/EXPAND | 2.0+ by source | QA-003/008 |
| F.8-02 | Metrics source/period/freshness/missing values/API limits/retention/export/role; anomaly detection later | ANL-007–ANL-010, SEC-002 | EXPAND | 2.0+ | QA-002/003/008 |
| F.8-03 | Automation event/schedule→trigger→condition→action→result→verify→audit with retry/idempotency/rate/dead-letter/version/site rules | AUT-001–AUT-014 (including AUT-003 condition/filter rules, AUT-010 enable/pause/version/clone lifecycle, and AUT-013 templates as separately phased), SEC-003, SEC-010 | DEFER | 7.0 | QA-002/003/006/008 |
| F.8-04 | AI website edits use canonical Page Model/action pipeline, permission/schema validation, preview/diff/approval/verify/audit; no arbitrary DB/HTML | AI-003, AI-005–AI-009, AI-019, EDT-003, SEC-002 | DEFER | 3.0 safety gate | QA-002/003/008 |
| F.8-05 | AI orchestrator/agent/tool/model registry, task planner/context selector, permission/approval, specialist agents and multi-model routing | AI-001–AI-006 (including AI-004 context selection/privacy filter), AI-016–AI-018 | DEFER | 3.0–8.0 | QA-002/003/008 |
| F.8-06 | AI costs/quotas/approval/prompt versions/usage/errors/recovery/rollback; provider keys server-side | AI-001, AI-002, AI-010, AI-017, SEC-008 | DEFER | 3.0 | QA-003/008 |
| F.8-07 | Stream Intelligence for live/silence/speech/chat/audio/OBS/highlights/VOD/clips/feedback/opt-in memory | AI-014–AI-016, ANL-003, ANL-006, OBS-003, LIV-006, SEC-011 | DEFER | 3.0–8.0 | QA-003/006/008 |
| F.8-08 | Human-reviewed clip/export, stream setup assistant, AI Control Center, experience evaluation and E2E tests | AI-014, AI-015, AI-017–AI-020, OPS-007, QA-008 | DEFER | 3.0–8.0 | QA-002/003/008 |

**Batch 6 result:** all 26 F.5–F.8 source bullets are individually represented. This does not establish provider approval, runtime capability, or acceptance PASS.
### 37.30. P0.2 — Bullet-szintű crosswalk, batch 7: F.9–F.13 (quality gates, recovery, context, Game Profile, domains)

**Forrás:** archived MASTER snapshot, 00.9.6.F.9–F.13. A személyes/projektindulási kontextus konfigurációként marad meg; a custom domain, email audience és workspace/team későbbi, külön security/legal acceptance-t igénylő scope. A korábbi F.10–F.13 sorok külön detail mappingjét ebbe az egyetlen táblába vontam össze, hogy ne maradjon két párhuzamos crosswalk.

| Forráskulcs | Megőrzött követelmény | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| F.9-01 | Published-page SEO metadata, canonical, Open Graph/social cards, sitemap/robots/schema; drafts and preview non-indexable | SEO-001–SEO-005, WEB-005, WEB-006 | KEEP/EXPAND | 1.0 release gate | QA-004/008 |
| F.9-02 | Redirect/broken-link tooling only with preview and approval | SEO-004, SEO-005, WEB-008, SEC-002 | DEFER | 2.0+ | QA-003/008 |
| F.9-03 | Semantic HTML, heading hierarchy, alt, labels, ARIA, keyboard/focus, contrast, screen reader, reduced motion | QA-004, QA-005, EDT-040, WEB-031 | KEEP | 1.0 release gate | QA-004/005 |
| F.9-04 | Secure session/cookies/password/auth rate limit/RBAC/CSRF/OAuth state/webhook replay/upload validation | SEC-001–SEC-010, RES-003, INT-003, INT-017 | KEEP | 0.x–1.0 release gate | QA-003 |
| F.9-05 | Separate public/preview/admin permission boundaries; no draft or secret leakage in logs/export | SEC-002, SEC-008, WEB-005, WEB-006, OPS-002, OPS-005 | KEEP | 0.x–1.0 | QA-003/004 |
| F.9-06 | Performance budgets based on measured baseline; image variants/lazy load/cache invalidation/Core Web Vitals/large-tree tests | OPS-008, WEB-030, RES-004, QA-005 | EXPAND | 1.0 baseline; advanced optimization phased | QA-005/006 |
| F.9-07 | Visual regression for public home/navigation/schedule, Editor state and desktop/tablet/mobile | QA-004, QA-005, EDT-035–EDT-037 | KEEP | 1.0 release gate | QA-004/005 |
| F.10-01 | Versioned export of Page/revision/theme/template/component/media refs/domain data; never export secrets/tokens | OPS-005, WEB-008, DSN-015, RES-001, SEC-008 | EXPAND | 1.0 safe export foundation; full package later | QA-003/007 |
| F.10-02 | Import dry-run validates schema/version/assets/duplicate IDs/owner/permissions/migration compatibility | OPS-004, OPS-005, WEB-008, DSN-015, SEC-002 | EXPAND | 2.0 full import/export | QA-002/003/007 |
| F.10-03 | Recovery preview/conflicts/integrity/backup verification and post-restore Page Model/revision/public-render consistency | OPS-005, OPS-006, OPS-009, WEB-007, WEB-008, EDT-028 | KEEP | 0.x–1.0 safety baseline | QA-002/006/007 |
| F.10-04 | Diagnostics for deploy/request/sync/provider/jobs/D1/cache/latency; no secrets or unnecessary personal data in logs | OPS-001–OPS-008, SEC-008, SEC-011 | EXPAND | 1.0 baseline; advanced operations later | QA-003/006/008 |
| F.11-01 | 1.0 scope: own public site/Admin/working Editor slice/responsive/resource/Schedule/Twitch/publish/SEO/accessibility/security/performance | §39.2, WEB-001–WEB-032, ADM-001–ADM-010, EDT-001–EDT-042, RES-001–RES-016, SCH-001–SCH-015, INT-001–INT-021, SEO-001–SEO-005, QA-001–QA-010 | KEEP | 1.0 current release scope | QA-002–QA-009 |
| F.11-02 | 1.x: Link Hub/Content Hub/multi-platform/VOD/Shorts/calendar/commerce foundations/community/alerts/audience capture | WEB-022, CNT-001–CNT-020, INT-013–INT-021, STO-001–STO-020, SUP-001–SUP-012, COM-001–COM-018 (including COM-003 community posts and COM-007 comments/reactions, subject to moderation/privacy scope), ANL-001–ANL-004 | MERGE | 1.5–2.0 by domain; community publishing requires its own scope gate | QA-002/003/008 |
| F.11-03 | 2.x Creator OS: dashboard/analytics/content studio/email audience/sponsorship/OBS/advanced stream tools | ADM-001–ADM-010, ANL-001–ANL-010, CNT-001–CNT-020, COM-015–COM-017, CAM-001–CAM-009 (including CAM-006 deliverables/deadlines/reminders), OBS-001–OBS-010 | MERGE | 2.0+ | QA-002/003/008 |
| F.11-04 | 3.x+: AI assistant/stream intelligence/business platform/marketplace/multi-site/SaaS/global ecosystem | AI-001–AI-020, MKT-001–MKT-005, TEAM-001–TEAM-006, LOC-001–LOC-006, §39.5–39.12 | MERGE | 3.0–10.0 | QA-002/003/008 |
| F.12-01 | Hungarian-first launch, international-ready locale/date/time/UI-string model | LOC-001–LOC-006, SET-001, WEB-001 | EXPAND | 1.0 architecture-ready; full locale workflow later | QA-004/005 |
| F.12-02 | Gaming streamer profile and games configurable from Admin, not hardcoded into product logic | SCH-012–SCH-014, WEB-022, RES-013, SET-001 | EXPAND | 1.0 configuration baseline; Game Profile domain phased | QA-002/004 |
| F.12-03 | TikTok handle and 5,000-follower personal goal are editable profile data, not UI guarantee | INT-014, SET-001, WEB-010, ANL-004 | KEEP | Profile config 1.0; provider metrics gated | QA-002/003/004 |
| F.12-04 | Weekly stream cadence is editable Schedule data, not a hardcoded product rule | SCH-001–SCH-003, SCH-009 | KEEP | 1.0 | QA-002/004 |
| F.12-05 | Historical support goal/platforms are not active payment integration; recheck current target/platform/privacy/legal text before campaign | SUP-001, SUP-002, SUP-003 supporter goal/progress, WEB-023, COM-014, SEC-011 | KEEP | 1.0 external links only if confirmed; payments later | QA-003/004/008 |
| F.12-06 | Project brand/profile/goal data remains configurable and changeable | SET-001–SET-003, WEB-001, SCH-001, INT-001 | KEEP | 1.0 | QA-002/004 |
| F.13-01 | Game Profile stable ID/slug/name/provider mapping/resource refs/brand metadata/cover/status/description | SCH-012–SCH-014, RES-013, SET-001 | EXPAND | 1.5–2.0 | QA-002/004 |
| F.13-02 | Schedule references Game Profile by stable ID, not copied fields or name matching | SCH-001, SCH-012, SCH-014 | KEEP | 1.5–2.0; 1.0 schedule stays canonical | QA-002/003 |
| F.13-03 | Missing artwork/metadata must use explicit fallback; Inspector shows only valid fields | SCH-013, RES-013, DYN-005, EDT-022 | EXPAND | 1.5–2.0 | QA-002/004/006 |
| F.13-04 | Game Profile is a domain; Editor references it and must not create an editor-only data store | SCH-012–SCH-014, EDT-020, DYN-001 | KEEP | 1.5–2.0 | QA-002/003 |
| F.13-05 | Custom domain lifecycle: add/verify ownership/DNS/primary/SSL/canonical URL/redirect/error states | SET-002, WEB-012, SEO-001, SEO-005, OPS-001, SEC-006 | DEFER | 4.0+ | QA-003/004/008 |
| F.13-06 | Domain/primary change preview and explicit SEO/redirect warning; unverified domain cannot become primary | SET-002, WEB-003, SEO-001, SEO-005, SEC-006 | KEEP | 4.0+ safety gate | QA-003/004 |
| F.13-07 | Brand settings: creator name/logo/favicon/social registry/colors/fonts/tokens/avatar/cover/media refs are data, not renderer hardcode | SET-001, SET-003, DSN-001, RES-011–RES-013, WEB-010 | EXPAND | 1.0 baseline | QA-002/004 |
| F.13-08 | Link Hub: platform/social links/CTA ordering/visibility and Schedule/Content/Community/Support targets, mobile-friendly | WEB-022, WEB-023, WEB-009, COM-001, SUP-001, QA-005 | EXPAND | 1.0 basic profile/links; richer hub later | QA-002/004/005 |
| F.13-09 | Later link scheduling/campaign UTM/QR/smart redirect/click analytics with privacy controls | CAM-002, ANL-001, ANL-002, WEB-029, SEC-011 | DEFER | 1.5–2.0 | QA-003/008 |
| F.13-10 | External URLs validated; dangerous schemes blocked; public menu/CTA behavior consistent | WEB-009, WEB-013, SEC-006 | KEEP | 1.0 | QA-003/004 |
| F.13-11 | Signup/subscribe collects email only with clear purpose/consent; records time/purpose version/unsubscribe | COM-015, COM-017, SEC-011 | DEFER | 2.0+ | QA-003/008 |
| F.13-12 | Subscriber list/segments/campaign/newsletter/transactional email/templates/opt-out/bounce/rate/consent history | COM-015–COM-018, CAM-002, SEC-011, INT-021 email/provider adapter; INT-020 only for diagnostics/recovery | DEFER | 2.0+ | QA-003/008 |
| F.13-13 | Marketing vs transactional email separated; unsubscribe blocks future marketing; privacy export/delete/retention | COM-016, COM-017, SEC-011, OPS-005 | KEEP | 2.0+ privacy gate | QA-003/008 |
| F.13-14 | Later tenant→workspace/account→members→sites→domain modules | TEAM-001–TEAM-006, SEC-003 | DEFER | 4.0+ | QA-003/008 |
| F.13-15 | Role catalog for owner/admin/editor/designer/moderator/analyst/content/store/finance; every mutation checks server-side permission | TEAM-003, SEC-002, SEC-003 | KEEP | RBAC baseline 1.0; team roles 4.0+ | QA-003/008 |
| F.13-16 | Workspace/site scope separated; client-provided tenant/site ID is not authorization | TEAM-005, SEC-002, SEC-003 | KEEP | 0.x–1.0 baseline; expand before multi-site | QA-003 |
| F.13-17 | Free/Creator/Pro/Business/Team/Agency and billing/quota/invoice/change/cancel only after cost/usage evidence | TEAM-006, STO-019, CAM-009, OPS-008 | DEFER | 4.0–5.0 | QA-003/008 |
| F.13-18 | Public website responsive from 1.0; PWA/native app is a later option | WEB-014–WEB-032, ADM-010, QA-004, QA-005 | KEEP/DEFER | Responsive web 1.0; PWA later | QA-004/005 |
| F.13-19 | Later creator app uses canonical APIs/permissions for live/alerts/schedule/analytics/moderation/content approval | ADM-001–ADM-010, INT-001–INT-021, SCH-001–SCH-015, LIV-001–LIV-007, COM-001–COM-018, SEC-002 | DEFER | 2.0+ | QA-002/003/008 |
| F.13-20 | Starter template categories remain available as configurable library choices | DSN-008–DSN-010 | EXPAND | 1.0 starter templates; library later | QA-004 |
| F.13-21 | Future creator-made template/component/theme/overlay/OBS/digital asset marketplace with license/version/review/revenue share | DSN-014, DSN-015, OBS-001–OBS-010, STO-012, MKT-001, MKT-002, MKT-003, MKT-004, MKT-005, CAM-009 | DEFER | 3.0–6.0 | QA-002/003/008 |

**Batch 7 result:** 42 egyedi source bullet F.9–F.13 között (7 F.9 + 35 F.10–F.13). A hivatkozások szerkezeti validációja külön gate; ez a mapping nem runtime PASS.


### 37.32. P0.2 — Crosswalk szerkezeti validációs összesítő

**Validált forrás-revízió:** v2/foundation commit 2513c71bdfa36ae30bd02c3c378f626221506bb8. A validáció a §24 feature registryt hasonlította össze a §37 crosswalk táblák explicit és tartományból kibontott ID-hivatkozásaival.

| Crosswalk batch | Sorok | Különböző hivatkozott feature/QA ID-k | Feloldatlan ID |
|---|---:|---:|---:|
| §37.22 E.2–E.3 | 57 | 202 | 0 |
| §37.23 E.4–E.9 | 66 | 282 | 0 |
| §37.24 E.10–E.14 | 45 | 150 | 0 |
| §37.25 E.15–E.21 + E.20 contract/negative tests | 59 | 345 | 0 |
| §37.27 F.1–F.4 | 28 | 97 | 0 |
| §37.29 F.5–F.8 | 26 | 168 | 0 |
| §37.30 F.9–F.13 | 42 | 325 | 0 |
| **Összesen** | **323** | *batchenként külön számolt* | **0** |

A §24 registry 359 egyedi ID-t tartalmaz duplikáció nélkül; a H19–H34 ledger 271 egyedi történeti kulcsból és 271 sorból áll.

**Mit bizonyít:** a felsorolt crosswalk sorok szerkezetileg léteznek, és a hivatkozott ID-k feloldhatók a registryben.

**Mit nem bizonyít:** az eredeti source szöveg minden bulletjének teljes szemantikai megőrzését; az E.1/C.23/C.24/00-A teljes tételes leképezését; az összes 359 ID eredetbesorolását; a domain/service/permission/dependency contractok teljességét; vagy bármely funkció runtime PASS állapotát. P0.2 továbbra is IN PROGRESS.

## 38. Részletes Visual Editor képességkatalógus

**Cél:** a vizuális szerkesztő teljes részletképességeinek önálló, tesztelhető katalógusa. A felsorolás a végleges platform követelményét rögzíti, nem a runtime készültségét. Minden elem a közös Page Model, command/history/validation/persistence és jogosultsági szerződésen keresztül működik.

### 38.1 — Benchmark és képességbővítési szabály

A szerkesztői UX-et rendszeresen össze kell hasonlítani a Webflow, Wix Studio, Elementor, WordPress Site Editor/Gutenberg és Framer nyilvános funkcióival. Vizsgálandó: komponenskönyvtárak, breakpoints, canvas, design tokenek, templates/patterns, CMS, localization, SEO, redirect és publishing. A benchmark tanulságait át kell venni, nem a zárt kódot lemásolni. Ez reprezentatív kezdőlista, nem a teljes piac lefedettségének állítása.

### 38.2 — Preset-, template- és reusable-rendszer: kötelező fogalmi szétválasztás

A „preset” nem egyetlen funkció, hanem több külön, jól meghatározott művelet. Mindegyiknél látható legyen, hogy csak a kiválasztott elemre, az aktuális oldalra vagy globálisan hat-e.

1. **Property preset:** egy vagy több property-csoport előre mentett értékei, pl. árnyék, border, radius, typography, spacing, button state.
2. **Style preset:** egy elem teljes vizuális beállításcsomagja, tartalom nélkül vagy tartalommal jelölten.
3. **Layout preset:** flex/grid/stack/columns, gap, alignment, sizing és flow konfiguráció.
4. **Responsive preset:** breakpointokhoz és responsive behaviorhöz tartozó induló beállítások.
5. **Component variant preset:** egy reusable component hivatalos variánsa (size, density, color, layout, state).
6. **Element preset:** konfigurált, tovább szerkeszthető egyedi elem vagy elemcsoport.
7. **Section preset:** teljes, reszponzív, tovább szerkeszthető szekció.
8. **Page preset/template:** egy teljes oldal szerkezete és konfigurációja.
9. **Site starter/template:** oldalstruktúra, navigáció, header/footer, theme, tokens, component library és SEO-defaultok kiinduló csomagja.
10. **Theme/design-system preset:** színek, betűstílusok, spacing scale, radii, shadows, widths, breakpoints, motion és komponens-alapstílusok.
11. **Content/CMS preset:** tartalomstruktúra, collection mezők, mezősorrend, content blockok és alapértelmezett üres/hiba állapotok.
12. **Streamer preset:** creator-site szekciók, Twitch/stream állapotok, schedule, game/profile, social links és support megjelenítési változatok.
13. **Editor workspace preset:** panel-láthatóság, canvas elrendezés, zoom, segédvonalak, snapping és szerkesztői preferenciák; ez nem public-site adat.
14. **Importált/gyári preset és felhasználói preset:** az eredeti gyári elem védett marad; szerkesztéskor a felhasználó saját példányt/forkot készíthet.

Minden presethez, ahol értelmezhető, kötelező:
- stabil ID, név, leírás, kategória, címkék, preview/thumbnail, version és owner/site scope;
- keresés, szűrés, rendezés, kedvencek, legutóbb használt és kategóriák;
- alkalmazás előtt preview; alkalmazás után Undo; megerősítés romboló/globalis művelet előtt;
- **Apply / Replace / Merge / Reset / Save as new / Duplicate / Rename / Archive / Restore** művelet, ahol a preset típusa alapján értelmezhető;
- a felhasználói tartalom és resource reference-ek megtartásának világos szabálya;
- preset frissítésekor meglévő instance-ok változásának explicit jelzése; nincs rejtett, váratlan tömeges átírás;
- gyári, site-local, user-library és későbbi shared-library scope megkülönböztetése;
- schema/version migráció és érvénytelen preset hibakezelése;
- jogosultság, audit, export/backup és törlés előtti használatellenőrzés.

**Fontos:** a template másolható/forkolható kiindulási állapot; a reusable component/symbol közös definíció; a preset értékcsomag. Ezek nem helyettesítik egymást, és egyetlen canonical registry/reference-modellre épülnek.

### 38.3 — Canvas és szerkesztési interakciók

- Canvas automatikus szélesség/magasság, content-aware minimum size, hosszú oldal kezelése, scroll/zoom közbeni stabil geometria.
- Zoom in/out, fit page, fit selection, 100%, pan/space-drag, minimap vagy overview, canvas reset.
- Rács, baseline/grid, rulers, guides, smart guides, snapping to grid/edges/centers/spacing, snap toggle és snap threshold.
- Kijelölőkeret, resize handles, rotation handle ahol támogatott, bounding box, anchor/origin és transform preview.
- Egyszeres/többszörös kijelölés, Shift/Ctrl módosítás, marquee selection, parent/child kiválasztás, breadcrumb és „select parent/child”.
- Drag-and-drop insert, reorder, reparent, drop-target preview, insertion marker és invalid-drop tiltás.
- Billentyűzetes mozgatás, finom/nagy lépés, duplikálás, delete, undo/redo, copy/paste, duplicate, nudge, bring forward/back, bring to front/back.
- Copy/paste style, paste properties, reset property, reset to inherited, clear override.
- Kontextusmenü, command palette/quick actions, kereshető Add panel, recent/favorite elements, parancsok billentyűparancsai.
- Drag/resize alatt élő Page Model/command állapot, pointer-capture, cancel/escape, pointer loss, scroll-container és zoom-korrekció kezelése.
- Vászon overlay és editor selection decoration nem kerülhet a public renderer outputjába.
- Canvas render és selection hit-testing ne a DOM-ot tegye source of truth-szá; a canonical Page Model a mérvadó.

### 38.4 — Oldalmodell, Layers és struktúra

- Page → template/section → container/layout → element hierarchia, stabil node ID-val.
- Layers fa: keresés, név, ikon/típus, collapse/expand, drag reorder, reparent, rename, duplicate, delete, hide, lock, unlock, multi-select.
- Layer visibility és lock állapota külön kezelendő a public visibility/conditional rendering szabálytól.
- Csoportosítás/felbontás; wrapper létrehozása; groupból kiemelés; több node együttes igazítása és elosztása.
- Parent/child breadcrumb; hierarchy outline; node típus és megengedett gyermekek; invalid nesting és circular parent tiltása.
- Üres container, section és page drop-target; üres állapotból elem hozzáadása.
- Copy/cut/paste azonos oldalon és később oldalak között, ID-regenerálással és resource/binding reference-ek biztonságos rendezésével.
- Node állapotok: selected, focused, hovered, locked, hidden-in-editor, hidden-on-breakpoint, inherited, overridden, invalid, data-bound.
- Több node property-szerkesztése csak közös, kompatibilis property-kre; eltérő értékek mixed-state megjelenítése.
- Reusable component instance és belső child szerkesztésének egyértelmű módja; instance override vs. main definition.

### 38.5 — Layout, geometry és CSS-szintű vizuális tulajdonságok

- Display: block/inline/inline-block/flex/grid/none és a támogatott semantic layout primitive-ek.
- Sizing: width/height/min/max, auto, fit-content, min-content, max-content, aspect ratio, intrinsic sizing.
- Units: px, %, rem/em, vw/vh, svh/lvh/dvh és támogatott CSS clamp/min/max/calc-szerű értékek validált, UI-barát kezelése.
- Position: static/relative/absolute/fixed/sticky; inset/top/right/bottom/left; z-index; containing block és stacking context jelzése.
- Flex: direction, wrap, justify, align, gap, order, grow/shrink/basis, align-self.
- Grid: template columns/rows, auto-fit/auto-fill, minmax, gap, alignment, placement, span, auto-flow és named areas ahol támogatott.
- Stack/row/column, nested containers, responsive reorder és content flow.
- Spacing: margin, padding, gap, logical properties, linked/unlinked sides, negative margin csak validált és indokolt esetben.
- Overflow: visible/hidden/clip/auto/scroll; scroll container; sticky/overflow konfliktus diagnosztika.
- Alignment/distribution: left/center/right, top/middle/bottom, space-between/around/evenly, equal-size, align-to-selection.
- Box sizing, border, radius, outline, shadow, opacity, blend mode, background color/image/gradient/video (video háttér csak performance/accessibility korláttal).
- Transform: translate/rotate/scale/skew, transform origin, 2D/3D csak biztonságos és tesztelt scope-ban.
- Aspect ratio, object-fit/object-position, image focal point, crop/cover/contain.
- Container width, full-bleed, boxed layout, content max-width, section inner width, viewport-aware spacing.
- Inspectorben pontos értékbeírás és vásznon drag; mindkettő ugyanazt a command/property-registry útvonalat használja.
- Computed/inherited/overridden értékek megkülönböztetése; invalid CSS vagy nem támogatott érték nem menthető csendben.

### 38.6 — Typography, colors és design tokens

- Font family, font loading, fallback, size, weight, style, line-height, letter/word spacing, text transform, decoration, alignment, wrapping, hyphenation és text balance.
- Heading level (H1–H6) a vizuális stílustól külön; link, emphasis, inline code, quote és rich-text struktúra.
- Global color palette, semantic tokens (primary/surface/text/border/success/warning/error), gradients, transparency és contrast preview.
- Global typography roles (display/headings/body/caption/label/code) és user-defined text styles.
- Spacing scale, container widths, breakpoints, radius, border, shadow, z-index layers, motion duration/easing token.
- Token létrehozás/átnevezés/használatkeresés/átállítás/törlés előtti dependency check.
- Token vs. literal value: jelölés, „convert to token”, „detach from token”, token reset és site-wide impact preview.
- Theme/style variations, light/dark/high-contrast theme előkészítés; a tényleges váltás csak explicit theme supporttal.
- Font asset/license metadata, font display/performance és unavailable-font fallback.
- Site-wide global style change előtt érintett oldalak/komponensek előnézete és undo/rollback.

### 38.7 — Inspector és Property Registry

- Inspector kategóriák: Content, Layout, Size, Position, Spacing, Typography, Appearance, Background, Border/Shadow, Effects, Responsive, Interactions, Accessibility, SEO, Data/Bindings, Advanced.
- Kontextusfüggő property-k csak az adott node type által támogatottan jelenhetnek meg.
- Property search, kategóriafilter, recent properties, favorites, tooltip/help, default/inherited/override jelzés.
- Reset property, reset group, reset to breakpoint parent, reset element to preset, copy/paste property group.
- Input validation, unit validation, min/max, enum, required fields, invalid value, dependency/compatibility warnings.
- Property change → command → validation → history → dirty state → save/reload round-trip.
- Batch edit, mixed values, apply to all selected compatible nodes.
- Property registry schema version, deprecation notice és migráció; új UI nem tarthat fenn második property store-t.
- Advanced CSS/custom attributes csak későbbi, explicit sandbox/security contracttal; arbitrary script nem futtatható a szerkesztői jogosultság miatt.

### 38.8 — Elementek és tartalmi komponenskatalógus

Az Add/Insert katalógus kereshető, kategorizált, preview-val és preset-változatokkal. Legalább az alábbi elemtípusok képességeit kell megőrizni a megfelelő phase-ben:

- Structure: Section, Container, Row, Column, Stack, Flex, Grid, Spacer, Divider, Separator.
- Content: Text, Heading, Rich Text, Quote, List, Numbered List, Table, Code, Badge, Icon, Image, Gallery, Video, Audio, Embed.
- Navigation: Header, Footer, Navbar, Menu, Breadcrumbs, Tabs, Anchor, Pagination, Back-to-top.
- Action: Button, Link, CTA, Icon Button, Download, Share.
- Cards/collections: Card, Feature Card, Profile Card, Game Card, Stream Card, Product Card, List/Grid/Carousel/Slider.
- Interactive: Accordion, Tabs, Modal/Dialog, Tooltip, Popover, Toggle, Disclosure, Search, Filter, Sort.
- Form: Form shell, text/email/url/number/date/select/checkbox/radio/textarea fields, validation/help/success/error state; secure submit handler külön canonical domain.
- Media: image/video/audio embeds, responsive source, poster, captions/transcript, aspect ratio, lazy loading.
- Social/creator: Twitch live/status/player/chat where permitted, schedule, countdown, channel link, VOD/clip link, social icon row, community invite, support CTA.
- CMS/data: collection list, item template, dynamic field, reference/relationship, empty/loading/error state, conditional block, pagination/filter.
- Commerce future: product/collection/price/stock/CTA and external checkout boundary; order/payment state nem lehet egyszerű Page Model tartalom.
- Future app slots/widgets: explicit capability and security boundary, not arbitrary injected code.
- Minden elementhez type-specific schema, defaults, accessible output, responsive behavior, Inspector mapping, validation, preview, tests and public renderer support kell.

### 38.9 — Responsive design és device preview

- Desktop/tablet/mobile előre definiált nézetek, egyedi breakpoints és custom viewport width/height.
- Breakpointok egymás melletti preview-ja, single-breakpoint mode, rotate/portrait-landscape preview.
- Resize drag handle és pontos viewport mező; common device presets, custom device preset.
- Cascading/inherited style model: nagyobb breakpoint értékei öröklődnek; kisebb breakpoint override nem írhatja felül észrevétlenül a nagyobbat.
- Property-level breakpoint overrides; reset inherited; copy breakpoint settings; clear all overrides with confirmation.
- Responsive behavior: fluid, scale, fixed, min/max, wrap, stack, reorder, hide/show, overflow strategy, typography scaling.
- Breakpoint-specifikus layout és visibility; tartalmi/strukturális változás közös modellben marad, ha nem indokolt valódi külön node.
- Oldal-, section- és komponensszintű breakpointok összehangolása; konfliktus és nem használt breakpoint jelzése.
- Minimum width/overflow/overlap/viewport clipping diagnostics; szélső méretek és zoom tesztek.
- Canvas height és scroll extent újraszámítása drag/resize/content growth közben, zoommal és transformmal korrigálva.
- Responsive preview nem külön mobil Page Model és nem külön save route.
- Device presets nem helyettesítik a valódi browser/device tesztet.

### 38.10 — Motion, interaction és állapotok

- Hover, focus, active, disabled, selected, expanded/collapsed, loading, success, error és empty states.
- Link/action target, anchor, external/internal navigation, download, open-in-new-tab, safe rel policy.
- Hover/focus transitions, entrance/exit, scroll-triggered motion és component interaction presets.
- Duration/easing/delay, trigger, target, replay, reduced-motion alternative, animation conflict warning.
- Interakciók explicit trigger/action modelben; preview-ban szimulálhatók, de szerkesztői műveletet nem hajthatnak végre.
- Form success/error, media load failure, empty CMS collection, offline/unavailable integration állapotok.
- Tab/focus order, keyboard operation, escape/cancel és focus return.
- Motion és third-party embeds csak performance/privacy/accessibility guardrail mellett.

### 38.11 — Oldalak, site shell és navigáció vizuális kezelése

- Oldallista: create, rename, duplicate, archive, delete, restore, search, filter, reorder, parent/child, draft/published state.
- Slug/URL, canonical URL, trailing slash policy, redirects, duplicate slug detection, 404 handling.
- Page type/template assignment: standard, landing, about, schedule, game/profile, blog/article, directory, contact, support, future commerce.
- Site shell: global header/footer, announcement bar, sidebar, Navbar, mobile menu, shared navigation and reusable site sections.
- Navigation tree, nested menus, active state, external links, accessibility labels, mobile collapse behavior.
- Site-wide edit vs. page-local edit világos jelölése; shared template change impact list.
- System pages: 404, search, archive/list/detail, privacy/terms, maintenance/offline and unavailable content states.
- Page duplication/import must regenerate identifiers where required and preserve only valid canonical references.
- Public renderer kizárólag published canonical Page Modelt használ; draft/preview route protected és noindex.

### 38.12 — CMS, dynamic content és data binding

- Collection/schema designer: text, rich text, number, boolean, date/time/timezone, URL, image/file, enum, reference/relation, list, JSON with validation.
- Field labels, help, required, default, validation, unique, search/filter/sort, display format and migration.
- Static vs. dynamic property/binding indicator; choose source, field, transform/format and fallback.
- Canonical sources: site settings, schedule domain, Twitch adapter, Resource metadata, CMS collections and future platform adapters.
- Loading/empty/error/stale states; timeout, retry, caching, invalid/stale binding and deleted source handling.
- Conditional visibility based on safe typed values, integration status or content presence; no arbitrary code evaluation.
- Collection list/grid/repeater, item template, pagination, sorting, filtering and URL/query state where permitted.
- Data preview with sample/real data toggle; secret fields and private data must never leak to public preview.
- D1 domain records remain domain-owned; Page Model stores binding/reference/config only and does not duplicate schedule or integration data.

### 38.13 — Resource, media, icons, fonts és asset picker

- Központi Resource Manager és Editor picker ugyanazon registryt használja.
- Upload/drop, multi-upload, progress, cancel/retry, duplicate detection, type/size validation, safe object keys and ownership checks.
- Search/filter by type/tag/usage/date/dimensions/owner; sort, folders/collections, favorites and recent.
- Preview, metadata, alt text/caption/credit, crop/focal point, resize/replace, derivatives, optimization and thumbnail.
- Usage references across pages/components/templates; before-delete impact list; unused asset detection; archive/restore.
- SVG sanitization, allowed MIME validation, font file constraints, video/audio duration/poster/caption and file-download policy.
- Image variants/responsive sources and cache invalidation; preserve old references safely when replacing.
- Icon registry: searchable icons, categories, style/weight/size/color, custom approved SVG upload, icon accessibility mode.
- Font library: family/weight/style metadata, fallback and license notes.
- R2 stores binary data; D1 stores metadata/reference/ownership. No separate media/icon/font storage owner.

### 38.14 — Preview, saving, publishing, versioning és recovery

- Explicit saved/dirty/saving/saved/error/offline/conflict state; no decorative save indicators.
- Autosave with debounce, retry/backoff, cancellation safety and dirty state reconciliation.
- Manual save, save status, save/reload round-trip, recovery after refresh/tab close where safe.
- Preview draft, preview at viewport/breakpoint, preview as public visitor, protected preview token/route and noindex.
- Publish/unpublish/republish, published snapshot, publish validation, changed-page summary and confirmation.
- Revision timeline, author/time/reason, diff/compare, restore/rollback, conflict handling and optimistic concurrency.
- Recovery after API/network failure; avoid lost changes, duplicate commands or stale overwrite.
- Bulk publish only with explicit preview and permission; public renderer must never expose unpublished data.
- Import/export/backup/restore schemas include versioning, validation, resource references, migration and rollback policy.
- Save, preview, publish, revision and rollback use existing canonical persistence/command contracts, not separate Editor-specific persistence.

### 38.15 — SEO, social preview, discoverability és public quality

- Per-site/page SEO title, meta description, canonical URL, index/follow controls, robots rules, sitemap and robots.txt.
- Open Graph/Twitter/social image preview, title/description, fallback image and per-page override.
- Structured data/schema where valid; canonical language/locale, hreflang where multilingual.
- Heading structure, semantic landmarks, alt text, link purpose, descriptive labels and empty-alt handling.
- Redirect manager and broken-link/404 diagnostics; duplicate title/description and missing metadata reports.
- Public preview cards for social shares; validate image dimensions and external URL behavior.
- AEO/search discoverability metadata is additive and must not generate misleading structured data.
- SEO panel distinguishes warning from blocking error and reports the exact affected page/element.

### 38.16 — Accessibility, privacy, security és consent

- Keyboard-only editor operation; visible focus; screen-reader labels; focus trap/return in modal UI.
- Public semantic HTML, heading hierarchy, alt/caption/transcript, contrast checks, reduced motion and responsive zoom.
- Forms have labels, instructions, error summary, validation announcements and accessible success state.
- Embed/iframe allowlist, sandbox and permissions policy; CSP/URL validation; no arbitrary script execution in Editor.
- External links, uploads, SVG, custom CSS and custom attributes require validation and safe output encoding.
- Consent/privacy controls for analytics, embeds, cookies and future marketing integrations; no secrets in Page Model/client output.
- Role/permission checks server-side for editing, publishing, resource access and global changes.
- Every destructive/global mutation has confirmation as needed, audit evidence and recovery path.
- Accessibility/security findings are testable; no compliance claim without automated plus manual evidence.

### 38.17 — Editor workspace, usability és power-user funkciók

- Resizable/collapsible side panels, left/right panel state, canvas workspace, fullscreen/focus mode.
- Quick Add, searchable command palette, keyboard shortcut map, shortcut conflict handling.
- Selection breadcrumb, recent nodes, favorites, recent assets/templates and contextual actions.
- Inspector pinning/favorites, property search, panel state persistence per user.
- Inline text editing with clear exit/commit/cancel behavior and no accidental selection loss.
- Empty-state onboarding, contextual help, non-blocking diagnostics, actionable error messages.
- Editor preferences are separate from site content: zoom, panel layout, grid visibility and default viewport.
- Tablet/touch support is separately acceptance-tested; tablet login remains a separate deferred item and is not silently conflated with Editor touch UX.
- Localization-ready editor strings and accessible error/status announcements.

### 38.18 — Integrations and streamer-site block catalog

- Twitch: connection status, live/offline, title/game/channel link, permitted live/player/embed, schedule binding, error/stale state and safe disconnect/reconnect UX.
- YouTube/TikTok/Discord: 1.0 static link/basic embed only where explicitly scoped; API-backed integrations remain in their roadmap phases.
- Schedule: domain-owned events, timezone, start/end, recurrence where approved, status, platform, game, artwork, URL, filters, views and sync provenance; no Page Model duplicate schedule records.
- Stream content: VOD/clip/Short/highlight link/embed baseline; canonical media workflows in their planned phase.
- Creator profile/game profiles, social links, community invite, support/funding/press kit blocks.
- Future overlay/widget/alert/OBS browser-source blocks use a separate Stream Studio contract, not arbitrary Editor nodes that bypass it.
- Integration block exposes connection/permission/availability states; secrets and tokens never become editable public properties.
- Every provider block uses the canonical integration adapter and consistent loading/empty/error/offline handling.

### 38.19 — Site-wide tools and bulk operations

- Find/replace content with preview and undo; page/node/resource search; usage/reference search.
- Bulk apply style/token/preset to selected compatible nodes, with mixed-state handling and change summary.
- Find broken links, missing images, orphaned assets, duplicate IDs/slugs, missing alt text and unsupported bindings.
- Site health panel for unpublished changes, broken bindings, missing required fields, page-level warnings and failed integrations.
- Bulk archive/restore/delete/publish only with permission, impact preview and recoverability.
- Global change impact map: pages, shared components, templates, tokens and presets affected.
- Page compare, revision compare, template diff and resource replacement impact preview.
- Search and command operations are site-scoped and permission-aware.

### 38.20 — Extensibility, custom code and future AI

- Canonical extension points: component schema/renderer, property registry, command API, resource type registry, template registry, integration adapter and diagnostics.
- Future custom CSS, HTML/embed and third-party component support only through reviewed, sandboxed, permissioned contracts.
- No direct client mutation of D1/R2 and no arbitrary privileged JavaScript.
- AI may propose edits to Page Model/commands, generate content, map responsive layouts or suggest presets, but must use shared Action API.
- AI changes require preview-before-apply, diff, validation, explicit approval where destructive/global, undo and audit.
- AI must not silently publish, change auth/secrets, overwrite user content or execute arbitrary external code.
- Future marketplace/shared libraries require license/source metadata, compatibility/version constraints, dependency inventory, safe import, sandbox and rollback.
- Export/import packages need schema version, dependency manifest, media references and validation before applying.

### 38.21 — Quality, observability and acceptance matrix

Every capability must define, where applicable:
- unit tests for pure layout/geometry/preset/schema helpers;
- command/history/undo/redo and Page Model round-trip tests;
- property validation, invalid nesting and malformed import tests;
- breakpoint inheritance/override/reset tests;
- canvas geometry tests at zoom levels, long pages, negative/large Y movement and content growth;
- preset apply/merge/replace/reset/fork/undo and shared-instance impact tests;
- component/template/token migration and broken-reference tests;
- save/reload, revision conflict, publish isolation and rollback tests;
- keyboard/touch/browser accessibility tests;
- public renderer, SEO, performance, reduced-motion and privacy tests;
- production runtime acceptance for any behavior whose correctness cannot be established by unit tests alone.

**Release labels:** IMPLEMENTED + TESTED, PLANNED / PHASE-X, DEFERRED, NOT APPLICABLE WITH REASON, BLOCKED. A checklist row must never be marked complete solely because a schema, UI placeholder, API route or documentation line exists.

### 38.22 — Phase assignment and no-loss rules

- Canvas drag/resize acceptance csak friss teszt és böngészős ellenőrzés alapján jelölhető PASS-nak; a már igazolt működéshez tartozó implementációt és regressziós teszteket meg kell őrizni.
- A Layers, Inspector és responsive működés a meglévő Page Modelt, command/history/validation láncot és Property Registryt használja.
- Foundational Editor interactions and the smallest useful set of element types are implemented before expanding the full component catalog.
- Presets, tokens, templates and reusable components must be architecturally reserved now, but are implemented only when their canonical registries/contracts and dependency order are ready.
- A kiadási fázisokat a jelen terv 39. fejezete határozza meg. Az első kiadásból kimaradó képesség későbbi, explicit fázisban marad; nem törölhető.
- Do not build every advanced feature before the basic editor is reliable. Prefer a complete, testable capability inventory and a single dependency-ordered implementation path over rushed parallel work.
- This appendix adds no second editor, no second Page Model, no second Property Registry, no second Resource store, no second Schedule domain and no alternate save/publish route.

## 39. Teljes Brand & Creator Platform — végrehajtási életciklus

A végső cél egy egységes Brand & Creator Platform SANCI AI-val. A fázisok scope-ot és függőséget jelentenek, nem automatikus készültséget. PASS csak a saját DoD, teszt, runtime és felhasználói acceptance után adható.

### 39.1. 0.x — Foundation
Canonical architecture, Page Model, domain ownership, D1/R2 boundary, auth/RBAC/site ownership, command/validation/history, revisions/publish/rollback, migration/legacy isolation, diagnostics/audit, CI, security, accessibility, performance, observability és recovery.

### 39.2. 1.0 — Professzionális Creator Website
Magyar elsődleges publikus site; Creator Center/Admin; egyetlen Visual Editor; Pages/navigation/Layers/Inspector/responsive; core content/components; Resource/Media/Icon/Font Library; theme/template alapok; Schedule/Game Profiles; Twitch live/next-stream; **Kapcsolatok Admin modul minimuma Twitchre** (connection status, scopes, health/last success, reconnect/disconnect, audit; Dashboard, Live, Schedule és Editor ugyanazt a canonical connection state-et olvassa); draft/preview/publish/rollback; SEO/accessibility; E2E és production acceptance. A YouTube/TikTok/Discord/Kick és a további provider-adapterek 1.5-ben capability-gated scope.

### 39.3. 1.5 — Többplatformos creator
YouTube/TikTok/Discord és további capability-gated provider adapterek; platform profile, scope, rate limit, token lifecycle, sync/error recovery; gazdagabb live state; VOD/clips/Shorts/highlights; cross-platform content planning és unified social/link system.

### 39.4. 2.0 — Creator Operating System
Advanced CMS/collections/relationships/bindings/search; advanced media processing; Site/Page/Section/Component/Symbol templates és variants; Theme Editor/design tokens/Sanci Button Registry; forms/backend actions; interactions/motion; calendar/reminders/export; Content Studio; Stream/Overlay Studio és OBS integration contract.

### 39.5. 3.0 — SANCI AI Creator Platform
Copilot weboldalra, komponensekre, szövegre, SEO/AEO, alt textre, fordításra, médiára, stream summaryra, VOD/clip/Short ötletekre, schedulingre, analytics értelmezésére és automation draftokra. Specialist agentek közös permission/action pipeline-t használnak. Model/provider registry, context minimization, approval, diff/preview, cost/quota, verification, audit és rollback kötelező. Nincs közvetlen DB/DOM írás vagy jóváhagyás nélküli kockázatos publikálás; a core funkciók AI nélkül is használhatók.

### 39.6. 4.0 — Multi-creator, teams, SaaS és billing
Több creator/site/brand, workspace isolation, team invitations, granular roles, collaboration/approval, concurrency, staging/production, custom domains, subscriptions, billing, entitlements, usage limits, quota és onboarding.

### 39.7. 5.0 — Creator Business és commerce
Shop/merch, products/variants/collections/inventory/fulfillment, digital products/bundles/coupons/cart/checkout, order/payment lifecycle, support/donations, memberships/perks/entitlements, Discord role sync, customer/order management, CRM/fan relationships, marketing automation és conversion analytics. Payment/tax/VAT/shipping/invoice provider külön legal/business review után.

### 39.8. 6.0 — Creator ecosystem és marketplace
Template/component/widget/theme/overlay/asset marketplace; creator libraries, sharing, ratings, moderation, license/attribution, compatibility/version, dependency manifest, secure import, extension install/update/uninstall/migration/rollback; arbitrary privileged code tilos.

### 39.9. 7.0 — Advanced automation és AI operations
Event registry, triggers/conditions/actions, webhooks, scheduled workflows, cross-platform/commerce/content/stream/notification automation, AI-generated workflow proposals, dry-run, approval, versioning, pause/disable, emergency stop, idempotency, deduplication, retry/backoff, dead-letter, cycle detection és recovery.

### 39.10. 8.0 — Multimodal Creator Intelligence
Text/image/video/audio understanding consent és permission mellett; content intelligence, media classification, semantic search, clip/highlight assistance, knowledge/context layer, cross-domain recommendations, multimodal analytics, creator knowledge base, source/freshness/confidence és model evaluation.

### 39.11. 9.0 — Személyre szabott creator AI
User-controlled creator context, adatkezelési beállítások, magyarázható proaktív javaslatok content strategy/website/commerce/stream/overlay területen, mérhető kísérletezés, opt-out, rollback és emberi döntési kontroll.

### 39.12. 10.0 — Teljes Brand & Creator Operating Platform
Brand OS, website builder, CMS, media/assets, templates/components/themes, Twitch/YouTube/TikTok és jövőbeli provider adapters, community, OBS/overlays, commerce/merch, membership, sponsorship, analytics, campaigns, automation, SANCI AI, multimodal intelligence, localization, multi-creator SaaS, marketplace, extensions és globális működés.

### 39.13. Fázisok közötti megőrzési szabály
Az 1.0-ból kimaradó funkció későbbi fázisba kerül, nem törlődik. Fázisváltás nem törölhet részletes acceptance-t. Minden nagyobb fázis előtt provider/license/security/privacy/cost/operations/benchmark review kell. Egy időben egyetlen dependency-ready, tesztelhető implementációs pont lehet aktív.

## 40. Teljes megőrzött követelménykatalógus

Az alábbi sorrendben felsorolt címkék lefedik a 271 részletes követelménykulcsot; a csoporton belüli sorrend az ID-k növekvő sorrendjét követi. Ezek a tervben megőrzött követelmények, nem külön modulok és nem készültségi jelölések. A végrehajtási szerződést a domain funkciókártya adja.

### 40.1. H19.01–H19.20 — RES (20)
upload; folders; search; filter; preview; metadata; alt text; crop; resize; replace; archive/delete; usage tracking; unused media detection; MIME validation; file-size limits; secure object keys; image optimization; video/audio; clip/Short assets; cache policy.

### 40.2. H20.01–H20.18 — WEB/CNT/INT/SCH (18)
D1 binding; site settings; schedule; Twitch; YouTube; TikTok; Discord; VOD; collections; API data source; loading state; empty state; error state; conditional rendering; data transforms; caching; stale-data handling; binding validation.

### 40.3. H21.01–H21.22 — INT (22)
Twitch OAuth; Twitch live/offline; Twitch title; Twitch game; Twitch viewer statistics; Twitch followers/subscribers where available; Twitch VOD; Twitch clips; Twitch events/webhooks where applicable; YouTube channel; YouTube videos; YouTube Shorts; YouTube statistics where available; YouTube API quota/error handling; TikTok profile; TikTok supported content integration; TikTok API capability review; TikTok rate limits/fallback; Discord community link; Discord optional integration; Discord status where justified; Architecture constraint: keep secrets in Cloudflare Secrets and normalize external APIs behind services.

### 40.4. H22.01–H22.19 — SCH/CNT (19)
schedule CRUD; recurring schedule; timezone handling; next-stream calculation; countdown; live state; game/category; stream type; VOD ingestion; VOD categorization; VOD search/filter; Shorts management; clips management; content calendar; platform-specific variants; title/description/hashtag suggestions; thumbnail brief; publishing workflow; performance feedback loop.

### 40.5. H23.01–H23.20 — EDT/WEB (20)
event model; click; hover; focus; active; submit; scroll; load; timer; open/close; navigation; show/hide; toggle; state machine; transition; animation timeline; keyframes; reduced-motion; interaction validation; performance safeguards.

### 40.6. H24.01–H24.13 — EDT/QA (13)
semantic HTML; heading hierarchy; alt text; labels; ARIA; keyboard navigation; focus order; focus visibility; contrast warnings; screen-reader metadata; form validation accessibility; editor accessibility checks; public accessibility audit.

### 40.7. H25.01–H25.12 — WEB (12)
title; description; canonical; Open Graph; X/Twitter card; structured data; sitemap; robots; per-page SEO; SEO preview; redirects; broken-link detection.

### 40.8. H26.01–H26.12 — ANL (12)
page views; button clicks; social clicks; stream events; conversion events; privacy-aware analytics; retention policy; admin dashboard; editor/content performance; content performance; stream performance; anomaly detection later.

### 40.9. H27.01–H27.19 — ADM (19)
dashboard; navigation; responsive admin; diagnostics; page list; content management; schedule; socials; VOD; media; settings; SEO; analytics; integrations; editor management; preview; recovery; history; permissions.

### 40.10. H28.01–H28.17 — SEC (17)
HttpOnly; Secure cookie; SameSite; password hash; CSRF; rate limiting; RBAC; API authorization; public/admin separation; Cloudflare Secrets; audit log; input validation; output validation; file validation; replay protection where applicable; action permission `can()` checks; AI permission boundary.

### 40.11. H29.01–H29.10 — OPS (10)
full backup; page backup; revision backup; media references; restore validation; rollback; import/export JSON; migration compatibility; backup integrity check; recovery drill.

### 40.12. H30.01–H30.14 — OPS/QA (14)
bundle review; lazy loading; image optimization; caching; cache invalidation; Core Web Vitals; rendering performance; large-page performance; large-tree editor performance; history memory limits; autosave efficiency; API latency monitoring; production smoke test; visual regression baseline.

### 40.13. H31.00–H31.13 — AI/EDT (14)
AI editor must use the same canonical action system as manual Editor, with pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version; AI page operations; AI element operations; AI style/layout operations; AI responsive operations; AI content generation; AI SEO assistance; AI accessibility QA; AI visual QA; action permissions; approval rules; rollback; audit; rate/cost controls.

### 40.14. H32.01–H32.25 — AI/LIV (25)
live stream monitoring; silence/speech detection; chat activity analysis; technical issue detection; audio problem detection; stream quality checks; scene suggestions; context-aware ideas; interesting moment detection; post-stream summary; VOD analysis; clip candidates; Short candidates; title/description suggestions; platform variants; thumbnail briefs; publishing recommendations; content performance analysis; streamer profile; long-term memory; preferences; historical outcomes; experiment tracking; evaluation cycle; feedback loop.

### 40.15. H33.00–H33.12 — AUT (13)
Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit; scheduled automations; event automations; content workflows; media workflows; stream workflows; notification workflows; retry policy; idempotency; failure handling; permissions; audit; Queues/Durable Objects only when justified by a real background-task or realtime requirement.

### 40.16. H34.00–H34.22 — QA/PLATFORM (23)
Continuous feature discovery is never permanently closed, with review repeated before every significant Editor/platform extension; modern visual builder minták;; GrapesJS / Craft.js / Puck architekturális minták;; új responsive/layout megoldások;; accessibility;; performance;; reusable components;; design systems;; collaboration/conflict;; backup/recovery;; AI action safety;; stream/content intelligence.; azonosítás;; cél és felhasználási eset;; függőségek;; Page Model/adatmodell;; Command/Action;; Inspector/Canvas/UI;; persistence;; teszt;; MASTER-be felvétel;; implementáció;; felhasználói validáció..

### 40.17. Zárási szabály
Minden tételhez stabil funkció-ID, domain owner, user outcome, permission, dependency, lifecycle, pozitív/negatív teszt, runtime acceptance és evidence kell. KEEP/DEFERRED nem jelent implementáltságot; REPLACE/REJECT csak indokolt, auditált döntéssel lehetséges.


## 41. Történeti követelmény-crosswalk — első tételes leképezés

**Állapot: MAPPED DRAFT — P0.2 nem PASS.** A 271 sor az archív történeti ledger minden mezőjét megőrzi (owner, surface, fázis/scope, dependency/boundary, lifecycle, DoD/acceptance, Admin, Editor és canonical AREA), és mellé teszi a jelenlegi javasolt feature-ID-t, döntést, célfázist és QA-horgonyt. A történeti mezők nyomon követhetőségi forrásadatok; a jelenlegi hozzárendelés még szemantikai felülvizsgálat alatt áll. A leképezés a §24.1–24.18 stabil ID-jegyzékéhez készül. A QA-horgony nem egyenlő a konkrét teszt végrehajtásával: minden sort továbbra is ellenőrizni kell a pontos user outcome, permission, adatforrás, dependency, negatív teszt és acceptance részletei alapján. Ahol egy sor összevont ID-ra mutat, az eredeti történeti kulcs önálló nyomon követhetősége megmarad.

| Történeti kulcs | Eredeti követelmény | Eredeti canonical owner / fejezet | Eredeti surface | Eredeti phase / scope | Eredeti dependency / boundary | Eredeti lifecycle | Eredeti DoD / test / acceptance | Eredeti Admin munkaterület | Eredeti Editor-csoport | Eredeti canonical AREA | Eredeti fázis / acceptance irány | Jelenlegi canonical feature ID | Jelenlegi domain owner | Döntés | Javasolt célfázis | QA-horgony |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H19.01 | upload | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-003 | RES | MERGE | 1.0 | QA-002/004 |
| H19.02 | folders | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-006 | RES | MERGE | 1.0 | QA-002/004 |
| H19.03 | search | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-005 | RES | MERGE | 1.0 | QA-002/004 |
| H19.04 | filter | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-005 | RES | MERGE | 1.0 | QA-002/004 |
| H19.05 | preview | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.06 | metadata | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-007 | RES | MERGE | 1.0 | QA-002/004 |
| H19.07 | alt text | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-007 | RES | MERGE | 1.0 | QA-002/004 |
| H19.08 | crop | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.09 | resize | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.10 | replace | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-009 | RES | MERGE | 1.0 | QA-002/004 |
| H19.11 | archive/delete | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-009 | RES | MERGE | 1.0 | QA-002/004 |
| H19.12 | usage tracking | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-008 | RES | MERGE | 1.0 | QA-002/004 |
| H19.13 | unused media detection | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-015 | RES | MERGE | 1.0 | QA-002/004 |
| H19.14 | MIME validation | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-003 | RES | MERGE | 1.0 | QA-002/004 |
| H19.15 | file-size limits | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-003 | RES | MERGE | 1.0 | QA-002/004 |
| H19.16 | secure object keys | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-002 | RES | MERGE | 1.0 | QA-002/004 |
| H19.17 | image optimization | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.18 | video/audio | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.19 | clip/Short assets | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | CNT-003 | CNT | MERGE | 1.0 | QA-002/004 |
| H19.20 | cache policy | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | OPS-008 | OPS | MERGE | 1.0 | QA-002/004 |
| H20.01 | D1 binding | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-001 | DYN | MERGE | 1.0 | QA-002 |
| H20.02 | site settings | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | SET-001 | SET | MERGE | 1.0 | QA-002 |
| H20.03 | schedule | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | SCH-001 | SCH | MERGE | 1.0 | QA-002 |
| H20.04 | Twitch | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | INT-011 | INT | MERGE | 1.0 | QA-002 |
| H20.05 | YouTube | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | INT-013 | INT | MERGE | 1.5 | QA-002/003 |
| H20.06 | TikTok | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | INT-014 | INT | MERGE | 1.5 | QA-002/003 |
| H20.07 | Discord | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | INT-015 | INT | MERGE | 1.5 | QA-002/003 |
| H20.08 | VOD | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | CNT-002 | CNT | MERGE | 1.5–2.0 | QA-002/004 |
| H20.09 | collections | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | CNT-005 | CNT | MERGE | 2.0 | QA-002/004 |
| H20.10 | API data source | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-001 | DYN | MERGE | 2.0 | QA-002/003 |
| H20.11 | loading state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.12 | empty state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.13 | error state | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.14 | conditional rendering | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-004 | DYN | MERGE | 1.0 | QA-002 |
| H20.15 | data transforms | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-003 | DYN | MERGE | 1.0 | QA-002 |
| H20.16 | caching | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-006 | DYN | MERGE | 1.0 | QA-002 |
| H20.17 | stale-data handling | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.18 | binding validation | Page Model + CMS (C.5/C.6); integration and schedule domains (C.7/C.8) | Editor binding/Inspector + public renderer + API/data adapters | 1.0 foundation for required site/schedule bindings; broader CMS/platform bindings 1.x+ | Canonical Page Model; typed binding contract; loading/error/empty states; auth/site scope | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-03; adatforrás szerint UI-07/UI-09/UI-10/UI-11/UI-13/UI-20 | E-10 | AREA-04; AREA-07–AREA-14; AREA-19–AREA-20 | Required 1.0 bindings first; broader provider/CMS bindings by canonical owner phase | DYN-002 | DYN | MERGE | 1.0 | QA-002 |
| H21.01 | Twitch OAuth | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-003 | INT | MERGE | 1.0 | QA-002/003 |
| H21.02 | Twitch live/offline | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | LIV-001 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.03 | Twitch title | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | LIV-003 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.04 | Twitch game | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | LIV-003 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.05 | Twitch viewer statistics | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | LIV-004 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.06 | Twitch followers/subscribers where available | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | LIV-004 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.07 | Twitch VOD | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-012 | INT | MERGE | 1.5 | QA-002/003 |
| H21.08 | Twitch clips | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-012 | INT | MERGE | 1.5 | QA-002/003 |
| H21.09 | Twitch events/webhooks where applicable | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-017 | INT | MERGE | 1.5 | QA-002/003 |
| H21.10 | YouTube channel | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-013 | INT | MERGE | 1.5 | QA-002/003 |
| H21.11 | YouTube videos | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-013 | INT | MERGE | 1.5 | QA-002/003 |
| H21.12 | YouTube Shorts | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | CNT-003 | CNT | MERGE | 1.5 | QA-002/003 |
| H21.13 | YouTube statistics where available | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | ANL-004 | ANL | MERGE | 1.5 | QA-002/003 |
| H21.14 | YouTube API quota/error handling | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-009 | INT | MERGE | 1.5 | QA-002/003 |
| H21.15 | TikTok profile | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-014 | INT | MERGE | 1.5 | QA-002/003 |
| H21.16 | TikTok supported content integration | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-014 | INT | MERGE | 1.5 | QA-002/003 |
| H21.17 | TikTok API capability review | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-014 | INT | MERGE | 1.5 | QA-002/003 |
| H21.18 | TikTok rate limits/fallback | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-009 | INT | MERGE | 1.5 | QA-002/003 |
| H21.19 | Discord community link | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch in 1.0 where specified; YouTube/TikTok/Discord and extended capabilities staged by D roadmap | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | COM-002 | COM | MERGE | 1.5 | QA-002/003 |
| H21.20 | Discord optional integration | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Discord integration staged by D roadmap unless explicitly approved for 1.0 | Optional integration; least-privilege permissions; OAuth/session security where applicable | Historical checkbox mapped; runtime not verified by this mapping | Define the supported Discord capability, permissions, failure behavior and acceptance tests in its phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-015 | INT | MERGE | 1.5 | QA-002/003 |
| H21.21 | Discord status where justified | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Only where a concrete user-facing status use case justifies it; phase per D roadmap | Must not imply a live Discord integration unless a real supported status source exists | Historical checkbox mapped; runtime not verified by this mapping | Document the justified status use case and data source; test unavailable/stale status and fallback behavior | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-015 | INT | MERGE | 1.5 | QA-002/003 |
| H21.22 | Architecture constraint: keep secrets in Cloudflare Secrets; normalize external APIs behind services | Integration/Platform contract + Streamer domain (C.7), aligned with Security/Auth (H28.10) | Worker secrets/configuration + server-side service adapters | Cross-cutting architecture constraint; apply whenever external integrations are implemented | No client-side secret exposure; provider-specific APIs remain behind normalized server-side service boundaries | Source architecture rule retained separately from the 21 checkbox requirements; runtime not verified by this mapping | Verify secret handling and adapter boundaries in the relevant integration DoD; do not treat this row as a separate product feature | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Twitch 1.0 where required; each other provider staged and accepted separately | INT-001, INT-019 | INT | MERGE | 0.x–1.0 | QA-002/003 |
| H22.01 | schedule CRUD | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | SCH-001 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.02 | recurring schedule | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | SCH-004 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.03 | timezone handling | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | SCH-003 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.04 | next-stream calculation | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | SCH-009 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.05 | countdown | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | SCH-009 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.06 | live state | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | LIV-001 | LIV | MERGE | 1.0 | QA-002/004 |
| H22.07 | game/category | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | SCH-012 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.08 | stream type | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | SCH-001 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.09 | VOD ingestion | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.10 | VOD categorization | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.11 | VOD search/filter | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.12 | Shorts management | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-003 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.13 | clips management | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-003 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.14 | content calendar | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-009 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.15 | platform-specific variants | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-011 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.16 | title/description/hashtag suggestions | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H22.17 | thumbnail brief | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-012 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.18 | publishing workflow | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | CNT-013 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.19 | performance feedback loop | Schedule domain (C.8) + CMS/Content Factory (C.6) + Streamer domain (C.7) | Creator Center Schedule/Content Center + Editor widgets + public renderer | Schedule core and public next/live states 1.0; broader VOD/Shorts/content automation staged per D roadmap | Canonical schedule owner; timezone/date contract; platform adapters; Resource references; publishing/revision flow | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-07; megjelenítés UI-02/UI-10/UI-11 | E-09; E-10 | AREA-07; AREA-13; AREA-14 | Schedule core 1.0; expanded content/VOD/Shorts workflows 1.x+ | ANL-004 | ANL | DEFER | 1.5–2.0 | QA-002/004 |
| H23.01 | event model | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.02 | click | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.03 | hover | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.04 | focus | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.05 | active | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.06 | submit | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.07 | scroll | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.08 | load | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.09 | timer | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.10 | open/close | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.11 | navigation | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.12 | show/hide | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.13 | toggle | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.14 | state machine | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.15 | transition | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.16 | animation timeline | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.17 | keyframes | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.18 | reduced-motion | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | QA-005, EDT-040 | QA/EDT | EXPAND | 1.0 baseline / 2.0 advanced motion | QA-002/004/005 |
| H23.19 | interaction validation | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | EDT-022, QA-005 | EDT/QA | EXPAND | 1.0 baseline / 2.0 advanced interactions | QA-002/004/005 |
| H23.20 | performance safeguards | Website Builder / Interaction & Animation (C.5) | Editor Inspector + Canvas + public renderer | Basic interaction validation and safe navigation: 1.0 baseline; advanced state machines/timelines/keyframes: 1.x+ | Canonical Page Model + Command/Action contract; reduced-motion and performance safeguards | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-02; UI-05; UI-06 | E-04; E-07; E-11 | AREA-03; AREA-06 | Safe baseline interactions 1.0; advanced event/state/timeline features staged | QA-005, OPS-008 | QA/OPS | EXPAND | 1.0 baseline / 2.0 advanced interaction performance | QA-002/004/005 |
| H24.01 | semantic HTML | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.02 | heading hierarchy | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.03 | alt text | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | RES-007 | RES | MERGE | 1.0 | QA-004/005 |
| H24.04 | labels | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.05 | ARIA | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.06 | keyboard navigation | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | EDT-037 | EDT | MERGE | 1.0 | QA-004/005 |
| H24.07 | focus order | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.08 | focus visibility | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.09 | contrast warnings | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.10 | screen-reader metadata | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.11 | form validation accessibility | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.12 | editor accessibility checks | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-004 | QA | MERGE | 1.0 | QA-004/005 |
| H24.13 | public accessibility audit | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H25.01 | title | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-001 | SEO | MERGE | 1.0 | QA-005 |
| H25.02 | description | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-001 | SEO | MERGE | 1.0 | QA-005 |
| H25.03 | canonical | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-001 | SEO | MERGE | 1.0 | QA-005 |
| H25.04 | Open Graph | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-002 | SEO | MERGE | 1.0 | QA-005 |
| H25.05 | X/Twitter card | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-002 | SEO | MERGE | 1.0 | QA-005 |
| H25.06 | structured data | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-003 | SEO | MERGE | 1.0 | QA-005 |
| H25.07 | sitemap | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-004 | SEO | MERGE | 1.0 | QA-005 |
| H25.08 | robots | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-004 | SEO | MERGE | 1.0 | QA-005 |
| H25.09 | per-page SEO | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-005 | SEO | MERGE | 1.0 | QA-005 |
| H25.10 | SEO preview | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-005 | SEO | MERGE | 1.0 | QA-005 |
| H25.11 | redirects | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | WEB-013 | WEB | MERGE | 1.0 | QA-005 |
| H25.12 | broken-link detection | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | WEB-013 | WEB | MERGE | 1.0 | QA-005 |
| H26.01 | page views | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.02 | button clicks | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.03 | social clicks | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.04 | stream events | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.05 | conversion events | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.06 | privacy-aware analytics | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-002 | ANL | DEFER | 2.0+ | QA-002 |
| H26.07 | retention policy | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-009 | ANL | DEFER | 2.0+ | QA-002 |
| H26.08 | admin dashboard | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-007 | ANL | DEFER | 2.0+ | QA-002 |
| H26.09 | editor/content performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-004 | ANL | DEFER | 2.0+ | QA-002 |
| H26.10 | content performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-004 | ANL | DEFER | 2.0+ | QA-002 |
| H26.11 | stream performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-003 | ANL | DEFER | 2.0+ | QA-002 |
| H26.12 | anomaly detection later | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Consent/privacy policy, data minimization, retention and access control | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-010 | ANL | DEFER | 2.0+ | QA-002 |
| H27.01 | dashboard | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | ADM-002 | ADM | MERGE | 1.0 | QA-008 |
| H27.02 | navigation | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | ADM-001 | ADM | MERGE | 1.0 | QA-008 |
| H27.03 | responsive admin | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | ADM-010 | ADM | MERGE | 1.0 | QA-008 |
| H27.04 | diagnostics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | OPS-007 | OPS | MERGE | 0.x–1.0 | QA-006/008 |
| H27.05 | page list | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | WEB-001 | WEB | MERGE | 1.0 | QA-008 |
| H27.06 | content management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | CNT-001, EDT-001 | CNT/EDT | EXPAND | 1.0 pages/content / 2.0 advanced CMS | QA-002/004/008 |
| H27.07 | schedule | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | SCH-001 | SCH | MERGE | 1.0 | QA-008 |
| H27.08 | socials | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | COM-001 | COM | MERGE | 1.0 public social/community links; provider connections separately gated | QA-002/004/008 |
| H27.09 | VOD | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | VOD/content-management capability is staged with the Content Studio roadmap; public 1.0 schedule/live content is not proof of a full VOD manager | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004/008 |
| H27.10 | media | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | RES-001 | RES | MERGE | 1.0 | QA-002/004/007/008 |
| H27.11 | settings | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | SET-001 | SET | MERGE | 1.0 | QA-008 |
| H27.12 | SEO | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | SEO-005 | SEO | MERGE | 1.0 | QA-005/008 |
| H27.13 | analytics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Historical Admin capability maps to ANL-007 reporting/filter/export, not a promise of a complete analytics backend; advanced stream/content/commerce analytics remain staged by ANL domain | ANL-007 | ANL | DEFER | 2.0 | QA-002/008 |
| H27.14 | integrations | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | INT-002, INT-007, INT-010, INT-011, INT-019 | INT | EXPAND | 1.0 Twitch Connections Center baseline / 1.5+ provider expansion | QA-002/003/008 |
| H27.15 | editor management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | EDT-001 | EDT | MERGE | 1.0 | QA-008 |
| H27.16 | preview | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | WEB-005 | WEB | MERGE | 1.0 | QA-008 |
| H27.17 | recovery | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | OPS-009 | OPS | MERGE | 0.x–1.0 | QA-006/007/008 |
| H27.18 | history | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | EDT-005 | EDT | MERGE | 1.0 | QA-002/004/007/008 |
| H27.19 | permissions | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell, navigation, domain-specific management screens | Only workflows required for 1.0; advanced admin domains staged by roadmap | No dead admin surface; each screen must have canonical owner, persistence and permissions | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | ADM-009, SEC-002 | ADM/SEC | MERGE | 0.x–1.0 | QA-003/008 |
| H28.01 | HttpOnly | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.02 | Secure cookie | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.03 | SameSite | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.04 | password hash | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.05 | CSRF | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-004 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.06 | rate limiting | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-007 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.07 | RBAC | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.08 | API authorization | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.09 | public/admin separation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.10 | Cloudflare Secrets | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-008 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.11 | audit log | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-010 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.12 | input validation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-005 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.13 | output validation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-005 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.14 | file validation | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | RES-003 | RES | MERGE | 0.x–1.0 | QA-003 |
| H28.15 | replay protection where applicable | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-009 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.16 | action permission `can()` checks | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.17 | AI permission boundary | Security / Auth / Audit (cross-cutting) | Worker/API + sessions/cookies + admin/editor + upload + AI boundary | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Server-side authorization, secret handling, validation, replay/CSRF protections where applicable, auditability | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Security release gate; server-side auth and negative tests required | AI-006 | AI | MERGE | 0.x–1.0 | QA-003 |
| H29.01 | full backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.02 | page backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | WEB-008 | WEB | MERGE | 0.x–1.0 | QA-007 |
| H29.03 | revision backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | WEB-008 | WEB | MERGE | 0.x–1.0 | QA-007 |
| H29.04 | media references | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | RES-008 | RES | MERGE | 0.x–1.0 | QA-007 |
| H29.05 | restore validation | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.06 | rollback | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | OPS-009 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.07 | import/export JSON | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.08 | migration compatibility | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | OPS-004 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.09 | backup integrity check | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.10 | recovery drill | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Admin backup/recovery + D1/R2 persistence + import/export | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Canonical ownership, schema/migration compatibility, media references and integrity validation | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | Backup/restore integrity and recovery acceptance required; backup existence alone is insufficient | OPS-006 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H30.01 | bundle review | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | OPS-010 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.02 | lazy loading | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | RES-004 | RES | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.03 | image optimization | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | RES-004 | RES | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.04 | caching | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.05 | cache invalidation | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.06 | Core Web Vitals | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | QA-005 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.07 | rendering performance | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | QA-005 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.08 | large-page performance | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | QA-005 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.09 | large-tree editor performance | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | QA-004 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.10 | history memory limits | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | EDT-005 | EDT | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.11 | autosave efficiency | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | EDT-030 | EDT | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.12 | API latency monitoring | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.13 | production smoke test | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | QA-006 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.14 | visual regression baseline | Performance / Production QA (cross-cutting) | Public site + editor + Worker/API + deployment pipeline | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measured budgets and test evidence required; no completion based on names alone | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Measured budgets, production smoke and fresh evidence; no completion by checklist name | QA-004 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H31.00 | AI editor must use the same canonical action system as manual Editor; pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Supplementary architecture contract; not a separate item in historical H31 checklist; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-003, AI-005, AI-006, AI-007, AI-008, AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.01 | AI page operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.02 | AI element operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.03 | AI style/layout operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.04 | AI responsive operations | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.05 | AI content generation | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-013 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.06 | AI SEO assistance | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-012 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.07 | AI accessibility QA | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-012 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.08 | AI visual QA | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-012 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.09 | action permissions | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-006 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.10 | approval rules | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-007 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.11 | rollback | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.12 | audit | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.13 | rate/cost controls | AI Platform / AI Editor (C.14) | AI request/action pipeline + Editor preview/approval | Post-1.0 unless explicitly re-scoped by roadmap gate | AI must use canonical actions; permission -> validation -> preview/diff -> approval -> execute -> verify -> audit/version | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Post-1.0 AI unless explicitly re-scoped; shared action/approval/audit contract | AI-010 | AI | DEFER | 3.0 | QA-002/003/008 |
| H32.01 | live stream monitoring | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.02 | silence/speech detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.03 | chat activity analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.04 | technical issue detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.05 | audio problem detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.06 | stream quality checks | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.07 | scene suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.08 | context-aware ideas | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.09 | interesting moment detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.10 | post-stream summary | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.11 | VOD analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.12 | clip candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.13 | Short candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.14 | title/description suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.15 | platform variants | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.16 | thumbnail briefs | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.17 | publishing recommendations | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.18 | content performance analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | ANL-004 | ANL | DEFER | 3.0 | QA-002/008 |
| H32.19 | streamer profile | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-016 | AI | DEFER | 3.0 | QA-002/008 |
| H32.20 | long-term memory | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-016 | AI | DEFER | 3.0 | QA-002/008 |
| H32.21 | preferences | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-016 | AI | DEFER | 3.0 | QA-002/008 |
| H32.22 | historical outcomes | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H32.23 | experiment tracking | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H32.24 | evaluation cycle | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H32.25 | feedback loop | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Platform adapters, privacy/retention, user control, verifiable analysis outputs | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H33.00 | Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Supplementary architecture contract; not a separate item in historical H33 checklist; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-001 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.01 | scheduled automations | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-005 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.02 | event automations | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-002 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.03 | content workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.04 | media workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.05 | stream workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.06 | notification workflows | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.07 | retry policy | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-007 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.08 | idempotency | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-006 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.09 | failure handling | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-012 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.10 | permissions | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-004 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.11 | audit | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | AUT-008 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.12 | Queues/Durable Objects only when justified by a real background-task or realtime requirement | Automation / Event domain (C.16) | Automation Center + event/queue boundary + audit | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Trigger -> condition -> action -> result -> verify -> audit; queues/Durable Objects only when justified | Architecture constraint retained; runtime not verified by this mapping | Document the concrete background/realtime need and evaluate simpler alternatives before introducing queues or Durable Objects | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | Post-1.0 unless specific workflow approved; retry/idempotency/loop prevention tests | OPS-011 | OPS | DEFER | 7.0 | QA-002/003 |
| H34.00 | Continuous feature discovery is never permanently closed; repeat the review before every significant Editor/platform extension | Continuous product governance / benchmark process (C.18-C.20) | MASTER roadmap + pre-extension architecture/QA review | Always-on governance rule; not a finite feature or permanently closable milestone | New requirements must be scoped, dependency-mapped, tested, recorded in MASTER, implemented and user-validated | Always-on governance rule; not a finite implementation-completion item | Evidence the review in each significant extension's engineering record and update MASTER when scope changes | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.01 | modern visual builder minták; | Visual Editor / builder architecture (C.9; C.18-C.20) | Pre-extension architecture review; canonical Editor scope | Review topic; the canonical owner and D roadmap determine the phase; not a standalone milestone | Compare builder patterns with the existing Editor architecture; record gaps against canonical owners; do not create duplicate feature work | Historical review topic retained; implementation status must be verified through its canonical owner | M0.1: verify owner and roadmap boundary; record coverage gaps and evidence; do not infer implementation from a roadmap mention | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.02 | GrapesJS / Craft.js / Puck architekturális minták; | Visual Editor / architecture benchmark (C.9; C.18-C.20) | Pre-extension architecture review; public patterns and documented contracts only | Benchmark topic; no independent phase or copied third-party implementation | Assess applicable patterns from GrapesJS, Craft.js and Puck against the existing architecture; respect licenses and avoid duplicate systems | Historical benchmark topic retained; no claim that a particular architecture has been implemented | M0.1: preserve the benchmark requirement; map relevant findings to canonical owners and the D roadmap | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.03 | új responsive/layout megoldások; | Theme/Presentation + Visual Editor + public renderer | Responsive layout, Canvas/Inspector and rendering boundaries | Review topic; scope is determined by the existing responsive/layout owners and D roadmap | Check layout behavior across breakpoints and editor/public rendering; uncovered requirements need an explicitly scoped canonical point | Historical review topic retained; implementation status must be verified through canonical owners | M0.1: cross-reference existing responsive requirements; identify gaps without creating duplicate tasks | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | EDT-024 | EDT | EXPAND | all phases | QA-010 |
| H34.04 | accessibility; | Accessibility domain (H24) + Editor + public renderer | Accessibility review across editing and published output | Review topic; follow the canonical accessibility scope and D roadmap | Cross-check H24 requirements, keyboard/focus behavior, semantics, labels and accessible editor workflows | Historical review topic retained; H24 coverage does not by itself prove runtime compliance | M0.1: link to H24 and record any uncovered requirement; implementation needs its own tests and acceptance evidence | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-005 | QA | EXPAND | all phases | QA-010 |
| H34.05 | performance; | Performance/Production domain (H30) | Editor, public renderer, data loading and production performance | Review topic; follow the canonical performance scope and D roadmap | Cross-check H30 and relevant editor/content performance requirements; avoid duplicating existing performance work | Historical review topic retained; roadmap presence is not a performance test result | M0.1: map to H30 and record gaps; phase-specific performance thresholds and test evidence remain required | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | OPS-008 | OPS | EXPAND | all phases | QA-010 |
| H34.06 | reusable components; | Component Registry / Symbols / Reusable Components | Page Model, component definitions, instances and Component Library | Review topic; canonical Component Registry ownership and D roadmap determine the phase | Preserve the distinction between copy/fork templates and shared Symbol definitions; do not create a second registry or Page Model | Historical review topic retained; implementation status must be verified through the canonical component owner | M0.1: cross-reference component and Symbol contracts; record gaps without adding duplicate implementation items | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | DSN-012 | DSN | EXPAND | all phases | QA-010 |
| H34.07 | design systems; | Theme/Design System / Design Tokens | Theme configuration, tokens, Theme Editor and rendering | Review topic; canonical Theme/Design System ownership and D roadmap determine the phase | Cross-check token ownership, theme revisions and published rendering; do not create a parallel theme/token store | Historical review topic retained; a listed design-system capability is not proof of completion | M0.1: link to the canonical Theme/Design System scope; record gaps and acceptance evidence still needed | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | DSN-001 | DSN | EXPAND | all phases | QA-010 |
| H34.08 | collaboration/conflict; | Collaboration / concurrency / approvals / conflict handling | Shared editing, mutation boundaries, persistence and user feedback | Review topic; phase depends on the canonical collaboration scope in the D roadmap | Distinguish CMS slug conflicts from concurrent collaborative editing; do not treat one as proof of the other | Historical review topic retained; search matches do not prove full collaboration or concurrency support | M0.1: identify the canonical owner and exact coverage; any uncovered capability requires explicit scoping | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | TEAM-004, EDT-029 | TEAM/EDT | EXPAND | all phases | QA-010 |
| H34.09 | backup/recovery; | Backup/Restore domain (H29) + relevant Admin recovery flows | Backup, restore, import/export and recovery | Review topic; follow the canonical backup/recovery scope and D roadmap | Cross-check H29 and existing recovery ownership; do not create a parallel backup or restore mechanism | Historical review topic retained; listed requirements do not prove a successful restore | M0.1: link to H29 and record gaps; recovery acceptance requires phase-specific verification | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | OPS-005 | OPS | EXPAND | all phases | QA-010 |
| H34.10 | AI action safety; | Security/permissions (H28) + AI Editor (H31) + Automation (H33) | AI/action permission boundary, validation, approval, execution and audit | Review topic; follow the canonical security and AI/automation scope in the D roadmap | Cross-check permission checks, canonical actions, validation, preview/diff, approval, verification and audit; no bypass of canonical boundaries | Historical review topic retained; architecture text alone does not prove safe runtime behavior | M0.1: link existing security/AI/automation contracts; gaps require scoped security tests and acceptance evidence | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | AI-006 | AI | EXPAND | all phases | QA-010 |
| H34.11 | stream/content intelligence. | Streamer Intelligence / Content Factory (H32; C.6/C.7/C.16) | Stream Assistant, streamer profile, content insights and related platform adapters | Review topic; individual capabilities follow their canonical phase in the D roadmap | Cross-check H32 and related content/integration owners; account for platform access, privacy, retention and user control | Historical review topic retained; no implication that post-1.0 intelligence features are implemented | M0.1: link existing intelligence/content requirements; record gaps without creating parallel feature rows | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | AI-015 | AI | EXPAND | all phases | QA-010 |
| H34.12 | azonosítás; | Continuous product governance / benchmark process (C.18-C.20) | Pre-extension review record | Identification step under H34.00; not an independent feature or milestone | Starts the H34.00 review cycle; identify the candidate change and its existing owner before scoping | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.13 | cél és felhasználási eset; | Continuous product governance / benchmark process (C.18-C.20) | Pre-extension review record | Goal/use-case definition step under H34.00; not an independent feature or milestone | Depends on H34.12; define the intended user outcome and use case | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.14 | függőségek; | Continuous product governance / benchmark process (C.18-C.20) | Dependency map and review record | Dependency mapping step under H34.00; not an independent feature or milestone | Depends on the defined use case; map prerequisites, downstream consumers and ownership boundaries | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.15 | Page Model/adatmodell; | Canonical Page Model/data-model owner for the proposed extension | Page Model/data-model contract | Page Model/data-model review step under H34.00; not an independent feature or milestone | Depends on H34.14; reuse the canonical Page Model or explicitly scope a reviewed change | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | EDT-001 | EDT | EXPAND | all phases | QA-010 |
| H34.16 | Command/Action; | Canonical Command/Action owner for the proposed extension | Command/Action contract | Command/Action contract review step under H34.00; not an independent feature or milestone | Depends on the approved data/model boundary; use canonical actions and permission rules | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | EDT-003 | EDT | EXPAND | all phases | QA-010 |
| H34.17 | Inspector/Canvas/UI; | Canonical Editor/UI owner for the proposed extension | Inspector/Canvas/UI contract | Inspector/Canvas/UI review step under H34.00; not an independent feature or milestone | Depends on the model/action contracts; align UI behavior with the canonical Editor architecture | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | EDT-021 | EDT | EXPAND | all phases | QA-010 |
| H34.18 | persistence; | Canonical persistence/data owner for the proposed extension | Persistence contract | Persistence review step under H34.00; not an independent feature or milestone | Depends on the model/action contracts; specify persistence, revision and recovery boundaries | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | EDT-028 | EDT | EXPAND | all phases | QA-010 |
| H34.19 | teszt; | Canonical test/QA owner for the proposed extension | Test plan and evidence | Test-planning and test-evidence step under H34.00; not an independent feature or milestone | Depends on the requirements and contracts; define automated/manual tests and acceptance criteria | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-002 | QA | EXPAND | all phases | QA-010 |
| H34.20 | MASTER-be felvétel; | MASTER roadmap governance (C.18-C.20) | MASTER roadmap and engineering checkpoint | MASTER recording step under H34.00; not an independent feature or milestone | Record owner, phase, dependencies, DoD, tests and acceptance in the single MASTER before implementation | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.21 | implementáció; | Canonical implementation owner approved by the D roadmap | Approved canonical engineering point | Implementation step for an approved, separately scoped extension; not a standalone milestone | Implementation starts only after scope, owner, dependencies, DoD and tests are approved in the canonical roadmap | Historical procedure step retained; actual implementation is governed by its separately approved canonical point | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-001 | QA | EXPAND | all phases | QA-010 |
| H34.22 | felhasználói validáció. | User acceptance / product validation for the proposed extension | User validation and acceptance record | User-validation step under H34.00; not an independent feature or milestone | Depends on implementation and test evidence; user validation must not replace automated/security tests | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Always-on discovery gate before every significant extension | QA-009 | QA | EXPAND | all phases | QA-010 |

### 41.1. P0.2 crosswalk lezárási szabály

- A fenti tábla **leképezési munkaverzió**, nem azt állítja, hogy minden korábbi követelmény már teljes feature contracttal rendelkezik.
- A QA-horgony csak azt jelzi, mely tesztcsaládhoz kell a követelményt kapcsolni; nem helyettesíti a teszteset és acceptance pontos leírását.
- A 271 sort össze kell vetni a teljes §24 ID-jegyzékkel és a régi forrásokkal; a hibásan tág vagy túl általános ID-mappingot pontosítani kell.
- A funkciók végrehajtási státusza nem változik a crosswalk elkészítésétől. A kód, CI, runtime és user acceptance bizonyítéka külön marad.
- P0.2 csak akkor PASS, ha nincs mapping nélküli vagy árva ID, a döntés és fázis indokolt, és minden tétel saját feature contract/acceptance mezői kitöltöttek.


### 41.2. Crosswalk strukturális ellenőrzése — 2026-10-13

A MASTER jelenlegi tartalmán végzett strukturális ellenőrzés eredménye:

- Történeti katalógus: 271 címkézett követelmény, a §40.1–40.16 csoportok deklarált elemszámai egyeznek a címkelisták elemszámával.
- Crosswalk: 271 sor; 271 egyedi történeti kulcs; nincs duplikált kulcs.
- Funkciójegyzék: 359 stabil ID a §24.1–24.18 tartományban; a LOC-005/LOC-006 bővítés után a registry- és crosswalk-hivatkozásokat újra ellenőrizendő.
- A crosswalk minden cél-ID-ja feloldható a jelenlegi funkciójegyzékben; a QA-horgonyok szintaktikailag érvényes QA-ID-hivatkozások.
- A §40 katalóguscímkéi és a §41 crosswalk címkéi kulcsonként egyeztetve vannak.

**Amit ez az ellenőrzés nem bizonyít:** a leképezések teljes szemantikai helyességét, a döntések termékoldali indokoltságát, a részletes feature contractok meglétét, a tesztek lefutását vagy a runtime készültségét. Ezért P0.2 továbbra is IN PROGRESS; a következő munka a mapping tartalmi felülvizsgálata, az esetleges túl tág megfeleltetések pontosítása és minden sor acceptance/dependency/permission mezőinek kiegészítése.


### 41.3. Tételes forrás-reconciliációs napló — C.23, F.1–F.13 és korábbi 00/A

**Állapot:** OPEN / IN PROGRESS. Ez a napló rögzíti a következő auditmunkát; nem állítja, hogy a források már teljesen át vannak vezetve. A forrássorok végső státusza csak a teljes belső bullet-lista összevetése után változhat.

#### 41.3.1. C.23.1–C.23.22 — forrásonkénti bontás

Forrás: `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md`, a C.23 fejezet 2361–2685. sorai. A §38 és a meglévő EDT/DSN/WEB/RES/DYN/QA ID-k csak jelöltek mindaddig, amíg az egyes forrás-bullet, edge case, permission és acceptance pontos megfelelése nincs ellenőrizve.

| Forráskulcs | Archív sorok | Forráskör | Jelenlegi célterület / ellenőrzendő ID-család | Állapot |
|---|---:|---|---|---|
| C.23.1 | 2366–2393 | Benchmarkok és alkalmazási szabály | QA-010; §31; C.24 open-source-first policy | OPEN — forrás-bullet és döntési nyomvonal ellenőrzendő |
| C.23.2 | 2394–2425 | Preset, template, reusable fogalmak | DSN; EDT; §24 design/template/resource ID-k | OPEN — fogalmi határok és duplikáció kizárása |
| C.23.3 | 2426–2440 | Canvas és szerkesztési interakciók | EDT; command/history; canvas/viewport acceptance | OPEN — minden interakció és regressziós eset külön ellenőrzendő |
| C.23.4 | 2441–2453 | Page Model, Layers és struktúra | EDT; canonical Page Model és Layers | OPEN — selection/reselection, hierarchy és persistence lefedettség ellenőrzendő |
| C.23.5 | 2454–2472 | Layout, geometry, CSS-vizuális tulajdonságok | EDT; responsive/layout/property registry | OPEN — minden mező, egység, korlát és viewport-eset ellenőrzendő |
| C.23.6 | 2473–2485 | Typography, colors, design tokens | DSN; EDT; Theme/Design Token owner | OPEN — globális és lokális értékek, fallback és inheritance ellenőrzendő |
| C.23.7 | 2486–2497 | Inspector és Property Registry | EDT; canonical Property Registry | OPEN — mezőmetaadat, validáció, responsive set/reset és permission ellenőrzendő |
| C.23.8 | 2498–2515 | Elem- és tartalmi komponenskatalógus | EDT; WEB; RES; komponens-registry | OPEN — elemtípusonkénti művelet, props és render parity ellenőrzendő |
| C.23.9 | 2516–2530 | Responsive design és device preview | EDT; WEB; viewport/responsive contract | OPEN — breakpointok, preview és mentés/újratöltés ellenőrzendő |
| C.23.10 | 2531–2541 | Motion, interaction és state | EDT; WEB; QA; accessibility/reduced-motion | OPEN — állapotok, prefers-reduced-motion és hibautak ellenőrzendők |
| C.23.11 | 2542–2553 | Oldalak, site shell, vizuális navigáció | WEB; ADM; EDT | OPEN — canonical navigation/page owner és Admin/Editor határ ellenőrzendő |
| C.23.12 | 2554–2565 | CMS, dynamic content, data binding | DYN; WEB; EDT; SEC | OPEN — schema, source, transform, authorization és loading/error state ellenőrzendő |
| C.23.13 | 2566–2578 | Resource/media/icons/fonts/asset picker | RES; R2; EDT; DSN | OPEN — metadata/binary boundary, alt text, reuse és resource permission ellenőrzendő |
| C.23.14 | 2579–2591 | Preview, save, publish, versioning, recovery | EDT; WEB; OPS; QA | OPEN — draft/published separation, revision conflict, recovery és no-loss tesztek ellenőrzendők |
| C.23.15 | 2592–2602 | SEO, social preview, discoverability, public quality | WEB; QA | OPEN — title/meta, OG, sitemap, canonical, structured data és route acceptance ellenőrzendő |
| C.23.16 | 2603–2614 | Accessibility, privacy, security, consent | SEC; QA; WEB; ADM | OPEN — szerveroldali permission, consent, keyboard/focus, privacy és negatív tesztek ellenőrzendők |
| C.23.17 | 2615–2626 | Editor workspace, usability, power-user funkciók | EDT; ADM; QA | OPEN — shortcut, command/navigation, responsive workspace és usability acceptance ellenőrzendő |
| C.23.18 | 2627–2637 | Integrációk és streamer-site blokkok | INT; DYN; WEB; EDT | OPEN — provider capability/scope, stale/error fallback és block-level acceptance ellenőrzendő |
| C.23.19 | 2638–2648 | Site-wide tools és bulk operations | WEB; ADM; OPS; SEC | OPEN — tömeges művelet, preview, permission, rollback és audit trail ellenőrzendő |
| C.23.20 | 2649–2659 | Extensibility, custom code, future AI | AI; SEC; EDT; C.24 | OPEN — sandbox, approval, shared action API és open-source review ellenőrzendő |
| C.23.21 | 2660–2676 | Quality, observability, acceptance matrix | QA; OPS; SEC | OPEN — minden követelményhez pozitív/negatív teszt és bizonyíték szükséges |
| C.23.22 | 2677–2685 | Fázisbesorolás és no-loss szabályok | §0; §24; §35; canonical roadmap | OPEN — phase/decision/owner/acceptance egyezés ellenőrzendő |

**Kötelező eljárás C.23-hoz:** minden fenti forrástartományból a teljes bullet- és nested-bullet-listát ki kell nyerni; minden önálló viselkedés kapjon stabil source key-t (pl. `C.23.3-01`), pontos forrásszöveget vagy rövid, visszakereshető kivonatot, canonical feature ID-t, KEEP/MERGE/EXPAND/DEFER/REPLACE/REJECT döntést és indoklást, phase-t, owner-t, dependency-t, permission boundary-t, pozitív/negatív tesztet és acceptance-evidence mezőt. A fenti táblázat fejezetenkénti index, nem helyettesíti ezeket az egyedi sorokat.

#### 41.3.2. F.1–F.13 — meglévő crosswalkok tételes auditja

Forrás: ugyanazon archív MASTER F.1–F.13 fejezetei, a forrásban kb. 3309–3466. sorok. Jelenlegi táblák: §37.27 (F.1–F.4), §37.29 (F.5–F.8), §37.30 (F.9–F.13). A meglévő táblák sora és ID-hivatkozása nem jelenti a forrás-bullet szemantikai lefedésének igazolását.

| Forráskulcs | Forrásfejezet / fő tartalom | Jelenlegi crosswalk | Auditfeladat | Állapot |
|---|---|---|---|---|
| F.1 | Editor stabil workflow, history, recovery | §37.27 | Minden bullet/nested bullet, history limit, transaction, save/reload, conflict és recovery külön ellenőrzése | OPEN |
| F.2 | Dynamic blocks és data binding | §37.27 | Source/schema/transform/auth/loading/empty/error/stale és cache invalidation külön ellenőrzése | OPEN |
| F.3 | Editor dropdownok és layout | §37.27 | Minden UI-kontroll, keyboard/touch viselkedés, state és responsive acceptance ellenőrzése | OPEN |
| F.4 | Public content és interaction capabilities | §37.27 | Route, form, CTA, public render és accessibility bullet-szintű egyeztetése | OPEN |
| F.5 | Content Factory és platformintegrációk | §37.29 | Tartalomtípus, provider capability, import/sync, approval/publish és failure path | OPEN |
| F.6 | Schedule, idő és tartalomkapcsolatok | §37.29 | Canonical schedule/game profile, timezone, recurrence, resource refs és consumer parity | OPEN |
| F.7 | Admin, forms, store és UI-szabályok | §37.29 | Admin surface, server-side permission, consent, validation és empty/error state | OPEN |
| F.8 | Analytics, AI, automation, stream intelligence | §37.29 | Telemetry vs creator analytics, action approval, event retry/idempotency és AI safety | OPEN |
| F.9 | SEO, accessibility, security, performance release gate | §37.30 | Minden minőségi követelményhez külön mérés, negatív teszt és release acceptance | OPEN |
| F.10 | Backup, export/import, diagnostics, recovery | §37.30 | Export/restore integrity, permissions, retention, failure recovery és bizonyíték | OPEN |
| F.11 | Coverage és no-loss policy | §37.30 | Minden forrás- és feature-ID kétirányú egyeztetése, nincs árva követelmény/ID | OPEN |
| F.12 | Projekt- és indulási kontextus | §37.30 | Történeti személyre szabott elvárások elválasztása a konfigurálható termékkövetelménytől; hardcode tiltása | OPEN |
| F.13 | Game Profile, custom domain, Link Hub, email audience, teams, mobile | §37.30 | Domain owner, phase, privacy, team permissions, fallback és minden nested bullet elfogadása | OPEN |

**F-szabály:** a §37.27/29/30 meglévő sorait nem szabad újabb összesített táblával megkettőzni. Az eredeti forrássor és a jelenlegi sor párosát kell soronként ellenőrizni; eltérés esetén a kanonikus crosswalk javítandó, és a javítást itt a záró naplóban kell feljegyezni.

#### 41.3.3. Korábbi 00/A és 00.9–00.9.6.B — eredet és jelenlegi hely

| Forráscsoport | Jelenleg megtalált forrásnyom | Jelenlegi hely / lehetséges owner | Nyitott feladat |
|---|---|---|---|
| Korábbi 00/A index és végrehajtási követelmények | A 2026-10-13 archív MASTER 30. sorában megőrzött `00/A.2.2 — F — Schedule CRUD + Inspector / Domain-Driven Editor — Definition of Done`; további régi 00/A anyagok pontos eredeti verziója még nem teljesen visszaállított | A jelen MASTER 0.0/0.2 végrehajtási indexe, §24 feature registry, §35 no-loss policy, §37 P0 audit és a releváns domain acceptance pontok | Az eredeti commit/fájl/verzió megtalálása; minden 00/A alcím és bullet stabil source key-val; jelenlegi cél-ID, döntés, indok és acceptance rögzítése. A címek hiánya nem bizonyít törlést |
| 00.9–00.9.6.B | Az archív MASTER-ből származó korábbi fejezetcsalád; a jelenlegi MASTER-ben nem minden eredeti címsor szerepel változatlanul | A követelmény jellegétől függően §2–§35, §24 feature registry, §37 audit és a kapcsolódó domain contracts | Minden eredeti alcím/bullet pontos forráshelyének visszakeresése, diff/crosswalk, KEEP/MERGE/EXPAND/DEFER/REPLACE/REJECT döntés és owner/phase/dependency/acceptance. A jelenlegi fejezetcím alapján történő automatikus megfeleltetés tilos |

A 00/A és 00.9–00.9.6.B teljes forrásszövegének hiányzó részei **nyitott provenance-hiányok**. Ezt nem szabad a jelenlegi archív MASTER kivonatából kitalálni vagy teljesnek minősíteni. Következő lépésként a repository történetéből és az összes releváns `docs/archive/**` / `docs/archive/plans/**` forrásból kell visszakeresni a legrégebbi teljes példányt, majd a fenti táblát konkrét sorokkal kibővíteni.

#### 41.3.4. 359 stabil funkció-ID — kétirányú nyomkövetés

A jelenlegi §24.1–§24.18 registry 359 stabil ID-ja esetében két külön ellenőrzés szükséges:

1. **Régi forrás → új funkció:** minden történeti bullethez tartozzon egy vagy több pontos ID, vagy indokolt explicit disposition.
2. **Új funkció → régi forrás/indoklás:** minden ID-hoz tartozzon konkrét eredeti forrás vagy dokumentált új követelmény/architekturális indok. A „modern platformhoz kell” önmagában nem elég részletes indok.
3. Minden ID kapjon canonical owner/domain, admin/public/editor surface, phase/lifecycle, permission boundary, dependency ID-k, pozitív és negatív tesztek, elfogadási feltételek és bizonyítékmezőket.
4. A folyamat-/governance-ID-ket külön kell választani a felhasználó által elérhető termékfunkcióktól; ne legyenek tévesen kész termékfunkcióként számolva.
5. Az automatikus ellenőrzés csak strukturális hibát (hiányzó/duplikált ID, feloldhatatlan hivatkozás) jelezhet. A szemantikai helyességhez minden sor emberi tartalmi ellenőrzése szükséges.

**P0.2 zárási feltétel:** a C.23 összes bulletje és nested bulletje, F.1–F.13 összes belső tétele, a 00/A és 00.9–00.9.6.B eredeti forrásai, mind a 359 ID kétirányú nyomkövetése és az ID-szintű contractok ellenőrzöttek; nincs megmagyarázatlan árva követelmény/ID, a döntések és phase-besorolások indokoltak, és a dokumentációs szerkezeti ellenőrzés megismételve. A P0.2 csak ezután lehet PASS; ez továbbra sem jelenti a runtime funkciók készültségét.


### 41.3.5. Tételes, egyedi forrás-bullet ledger — első kör

**Forrásverzió:** docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md (blob adc958b61e9c09d246989626c92066489d1d72f4). Az alábbi táblák a C.23 és F.1–F.13 alatti felsorolásokat egyenként rögzítik, stabil forráskulccsal és archív sorszámmal. A teljes forrásszöveg megőrzése cél; a forrás sorainak felvétele NEM jelenti a leképezés, a jogosultság, a teszt vagy az implementáció igazolását.

- C.23: 210 felsorolási pont külön rögzítve.
- F.1–F.13: 100 felsorolási pont külön rögzítve.
- Minden sor státusza OPEN marad a tételes szemantikai ellenőrzés és bizonyítékig. A nem-TBD mappingek is csak jelölt (candidate) lefedettséget jelentenek: a canonical ID létezését és a várható kapcsolatot azonosítják, de nem végleges megfeleltetések, nem döntések és nem PASS-ok. Véglegesítés előtt a teljes eredeti tételt össze kell vetni a registryvel, a tényleges UI/API/runtime tulajdonossal és a teszt/acceptance bizonyítékkal; a hiányzó vagy túl tág ID-ket javítani kell.
- A C.23.2–C.23.6.3 tartományban 50 sorhoz készült első jelölt mapping és konkrét owner/phase/permission/dependency/test/acceptance javaslat. Ezek mind OPEN review állapotúak, nem végleges crosswalkok. A sorok az archive sorhivatkozását is megőrzik; archívum átírása esetén a forrás SHA és sorszámok újraellenőrzendők.

#### C.23.1–C.23.22 — minden belső bullet

| Source key | Archive line | Exact source bullet | Canonical feature mapping | Decision / owner / phase / permission / dependency / tests / acceptance |
|---|---:|---|---|---|
| C.23.1-01 | 2369 | - **Webflow Designer:** components, variables, cross-site libraries, breakpoint canvas. | QA-010 (benchmark review); candidate coverage EDT-024/025, DSN-012–015 | OPEN — QA owner; all-phase benchmark; verify source URLs/licensing, compare canonical contracts, record adopt/adapt/reuse decision and acceptance evidence |
| C.23.1-02 | 2372 | - **Wix Studio:** custom breakpoints, responsive behavior, design libraries, saved sections/assets, design kits, wireframes és gyors hozzáadás. | QA-010 (benchmark review); candidate coverage EDT-015/024/025, DSN-008–015, RES-010 | OPEN — QA owner; all-phase benchmark; verify each cited capability, compare canonical contracts and licensing, document reuse/adapt/build decision and acceptance evidence |
| C.23.1-03 | 2376 | - **Elementor:** központi Site Settings, global colors/fonts, theme styles, layout defaults, reusable website kits és responsive containers. | QA-010 (benchmark review); candidate coverage SET-001–003, DSN-001–011, EDT-016/024/025 | OPEN — QA owner; all-phase benchmark; verify Site Settings/token/template boundaries, source/licensing, owner and migration/override behavior; record acceptance evidence |
| C.23.1-04 | 2381 | - **WordPress Site Editor / Gutenberg:** full-site editing, templates/template parts, patterns, synced vs. unsynced patterns, style variations, global styles, command palette, list view, zoom-out view és export. | QA-010 (benchmark review); candidate coverage WEB-009/010, EDT-007/012/015/038, DSN-001–018 | OPEN — QA owner; all-phase benchmark; explicitly distinguish synced shared components from copied templates, verify licenses and canonical registry boundaries; record acceptance evidence |
| C.23.1-05 | 2386 | - **Framer:** visual canvas, reusable responsive components, CMS, breakpoint editing, localization, SEO, redirects és publishing workflow. | QA-010 (benchmark review); candidate coverage EDT-007–025, DSN-012–018, DYN-001–008, SEO-001–005, WEB-004–013 | OPEN — QA owner; all-phase benchmark; verify feature-specific behavior and licensing; keep locale, CMS, SEO, redirect and publish ownership canonical; record acceptance evidence |
| C.23.2-01 | 2414 | - stabil ID, név, leírás, kategória, címkék, preview/thumbnail, version és owner/site scope; | DSN-008–DSN-015, RES-001/004/007, SEC-003 | OPEN — Design System/Resource registry owners; 1.0 baseline for site-local templates and asset metadata, shared library later; verify stable ID/version/site owner and authorization model; dependency DSN/RES schema; QA-002/003/004; acceptance: schema contract and cross-site negative tests |
| C.23.2-02 | 2415 | - keresés, szűrés, rendezés, kedvencek, legutóbb használt és kategóriák; | DSN-008–DSN-018, EDT-015, RES-005/010 | OPEN — Design System + Editor Library owner; phased by library type; permission inherits site/resource scope; depends on canonical registry and metadata; QA-002/004; acceptance: deterministic search/filter/sort and empty/error states |
| C.23.2-03 | 2416 | - alkalmazás előtt preview; alkalmazás után Undo; megerősítés romboló/globalis művelet előtt; | EDT-005, EDT-032, EDT-039, DSN-004 | OPEN — Editor command/history + Design System owner; 1.0 destructive-action safety; editor permission required; depends on previewable command and undo/rollback semantics; QA-002/003/004; acceptance: preview does not mutate state, undo restores state, destructive/global operations require confirmation |
| C.23.2-04 | 2417 | - **Apply / Replace / Merge / Reset / Save as new / Duplicate / Rename / Archive / Restore** művelet, ahol a preset típusa alapján értelmezhető; | EDT-005, EDT-011, DSN-004, DSN-008–DSN-015, RES-009 | OPEN — Editor/Design System/Resource owners; operation availability is type-specific and phased; site/resource permissions apply; depends on typed registry lifecycle and history; QA-002/003/004; acceptance: supported operations are explicit, unsupported operations unavailable, restore/duplicate preserve reference integrity |
| C.23.2-05 | 2418 | - a felhasználói tartalom és resource reference-ek megtartásának világos szabálya; | EDT-001/002, DSN-012–DSN-014, RES-001/008 | OPEN — Page Model + Design System + Resource owners; 1.0 data-integrity contract; edit permission and resource visibility required; depends on canonical IDs/reference registry; QA-002/003/004; acceptance: apply/merge/replace never silently drops user content or leaves dangling references |
| C.23.2-06 | 2419 | - preset frissítésekor meglévő instance-ok változásának explicit jelzése; nincs rejtett, váratlan tömeges átírás; | DSN-003/004/012–014, EDT-027–031 | OPEN — Design System owner; reusable-component propagation phased; edit permission required; depends on explicit master/instance and override contract; QA-002/004; acceptance: update diff is visible and existing instances change only under declared propagation policy |
| C.23.2-07 | 2420 | - gyári, site-local, user-library és későbbi shared-library scope megkülönböztetése; | DSN-008–DSN-018, SEC-003, TEAM-001/002 | OPEN — Design System + tenancy/security owner; site-local 1.0, user/shared library later and gated; depends on owner/scope schema and access policy; QA-003/008; acceptance: factory/site/user/shared scopes are distinct and cross-site access is denied |
| C.23.2-08 | 2421 | - schema/version migráció és érvénytelen preset hibakezelése; | DSN-014, EDT-001/042, QA-002/003/006 | OPEN — Design System/Resource owners; schema migrations required before broad import/export; permission required for mutation; depends on versioned schemas and migration strategy; QA-002/003/006; acceptance: compatible migrations are deterministic and invalid/incompatible presets fail safely without mutation |
| C.23.2-09 | 2422 | - jogosultság, audit, export/backup és törlés előtti használatellenőrzés. | SEC-001–SEC-011, OPS-005, DSN-015, RES-008/009 | OPEN — Security/Operations + registry owners; baseline before import/export/delete and shared scope; role and site/resource ownership required; depends on audit log, usage map, backup/export contract; QA-003/006/008; acceptance: unauthorized action denied, audit evidence retained, referenced assets cannot be silently deleted |
| C.23.3-01 | 2428 | - Canvas automatikus szélesség/magasság, content-aware minimum size, hosszú oldal kezelése, scroll/zoom közbeni stabil geometria. | EDT-007/009, EDT-023–025, QA-002/004/005 | OPEN — Editor Canvas owner; 1.0 geometry gate; editor role required; depends on canonical viewport/geometry calculations; QA-002/004/005; acceptance: long content, min-size, zoom, scroll extent and viewport resize preserve reachable canvas geometry |
| C.23.3-02 | 2429 | - Zoom in/out, fit page, fit selection, 100%, pan/space-drag, minimap vagy overview, canvas reset. | EDT-007, EDT-025, EDT-035 | OPEN — Editor Canvas owner; 1.0 supported viewport controls; editor role required; depends on viewport state model; QA-002/004/005; acceptance: zoom/pan/fit/reset controls preserve selection and page geometry |
| C.23.3-03 | 2430 | - Rács, baseline/grid, rulers, guides, smart guides, snapping to grid/edges/centers/spacing, snap toggle és snap threshold. | EDT-010, EDT-009, EDT-021/022 | OPEN — Editor Canvas + Inspector owner; grid/guides phased by validated interaction design; editor role required; depends on geometry/transform math; QA-002/004/005; acceptance: snapping is toggleable, threshold-consistent, keyboard/mouse safe and does not mutate unrelated layout properties |
| C.23.3-04 | 2431 | - Kijelölőkeret, resize handles, rotation handle ahol támogatott, bounding box, anchor/origin és transform preview. | EDT-006–010, EDT-021/022 | OPEN — Editor Canvas owner; rotation only if supported by canonical schema; editor role required; depends on transform constraints and selection state; QA-002/004/005; acceptance: handles/preview reflect committed geometry and cancel restores prior state |
| C.23.3-05 | 2432 | - Egyszeres/többszörös kijelölés, Shift/Ctrl módosítás, marquee selection, parent/child kiválasztás, breadcrumb és „select parent/child”. | EDT-006, EDT-012/013, EDT-038 | OPEN — Editor selection owner; 1.0 keyboard/mouse selection baseline; editor role required; depends on stable node IDs and hierarchy; QA-002/004/005; acceptance: multi-selection and parent/child selection remain synchronized across Canvas, Layers and Inspector |
| C.23.3-06 | 2433 | - Drag-and-drop insert, reorder, reparent, drop-target preview, insertion marker és invalid-drop tiltás. | EDT-008, EDT-011, EDT-002, EDT-016 | OPEN — Editor command/Page Model owner; 1.0 insertion/reorder baseline; editor role required; depends on parent-child invariants and allowed-child schema; QA-002/004/005; acceptance: valid drops preview correctly and invalid/circular drops are rejected without state mutation |
| C.23.3-07 | 2434 | - Billentyűzetes mozgatás, finom/nagy lépés, duplikálás, delete, undo/redo, copy/paste, duplicate, nudge, bring forward/back, bring to front/back. | EDT-005, EDT-011, EDT-038/039 | OPEN — Editor command/history owner; 1.0 core actions; editor role required; depends on transactional command registry; QA-002/004; acceptance: keyboard and menu operations share canonical commands, undo/redo restores exact prior order and data |
| C.23.3-08 | 2435 | - Copy/paste style, paste properties, reset property, reset to inherited, clear override. | EDT-021/022/024, DSN-001–DSN-004 | OPEN — Inspector/Design System owner; 1.0 safe property actions, advanced inherited overrides phased; editor role required; depends on property registry and inheritance model; QA-002/004; acceptance: paste/reset/clear override validates property types and preserves unrelated values |
| C.23.3-09 | 2436 | - Kontextusmenü, command palette/quick actions, kereshető Add panel, recent/favorite elements, parancsok billentyűparancsai. | EDT-015, EDT-039, EDT-037 | OPEN — Editor interaction owner; core searchable Add and accessible actions phased by scope; editor role required; depends on action registry and element catalog; QA-002/004/005; acceptance: every listed action resolves to one canonical handler and is keyboard accessible |
| C.23.3-10 | 2437 | - Drag/resize alatt élő Page Model/command állapot, pointer-capture, cancel/escape, pointer loss, scroll-container és zoom-korrekció kezelése. | EDT-003/004, EDT-007–009, EDT-027/030/042 | OPEN — Editor runtime owner; 1.0 data-loss/geometry gate; editor role required; depends on pointer lifecycle and transactional command pipeline; QA-002/004/005; acceptance: cancel, pointer loss, scrolling and zoom do not leave stuck gestures or commit partial geometry |
| C.23.3-11 | 2438 | - Vászon overlay és editor selection decoration nem kerülhet a public renderer outputjába. | EDT-034, WEB-032, SEC-005, QA-002/003/004 | OPEN — Public renderer + Editor owner; 1.0 isolation/security gate; public access must not expose editor overlays; depends on separate editor decorations and renderer model; QA-002/003/004; acceptance: public DOM/output contains no editor-only selection or control artifacts |
| C.23.3-12 | 2439 | - Canvas render és selection hit-testing ne a DOM-ot tegye source of truth-szá; a canonical Page Model a mérvadó. | EDT-001–004, EDT-034 | OPEN — Page Model owner; architectural invariant for all phases; editor mutation permission required; depends on canonical schema/command pipeline; QA-002/004; acceptance: DOM hit testing is not persistence/source-of-truth and all edits serialize from canonical Page Model |
| C.23.4-01 | 2443 | - Page → template/section → container/layout → element hierarchia, stabil node ID-val. | EDT-001/002, EDT-016, DSN-008–DSN-012 | OPEN — Page Model + Design System owner; 1.0 core hierarchy, reusable template features phased; editor role required; depends on node schema and allowed parent-child rules; QA-002/004; acceptance: stable IDs and hierarchy round-trip through save/reload |
| C.23.4-02 | 2444 | - Layers fa: keresés, név, ikon/típus, collapse/expand, drag reorder, reparent, rename, duplicate, delete, hide, lock, unlock, multi-select. | EDT-012–015, EDT-011, EDT-006 | OPEN — Editor Layers owner; 1.0 core layers actions; editor role required; depends on canonical node tree and command history; QA-002/004/005; acceptance: each action updates the same canonical node and persists through reload |
| C.23.4-03 | 2445 | - Layer visibility és lock állapota külön kezelendő a public visibility/conditional rendering szabálytól. | EDT-014, EDT-026, WEB-031 | OPEN — Editor + public rendering owner; 1.0 visibility semantics; editor role required for editor-only state; depends on distinct editor visibility, responsive visibility and public conditional rules; QA-002/003/004; acceptance: lock/hide in Layers never silently changes public visibility |
| C.23.4-04 | 2446 | - Csoportosítás/felbontás; wrapper létrehozása; groupból kiemelés; több node együttes igazítása és elosztása. | EDT-002/004/011/016, EDT-010 | OPEN — Page Model + command owner; group/wrapper support only where schema-valid; editor role required; depends on transactional hierarchy edits; QA-002/004; acceptance: group/ungroup/align/distribute preserve order, references and undo integrity |
| C.23.4-05 | 2447 | - Parent/child breadcrumb; hierarchy outline; node típus és megengedett gyermekek; invalid nesting és circular parent tiltása. | EDT-001/002, EDT-012/013/016 | OPEN — Page Model + Layers owner; 1.0 hierarchy validation; editor role required; depends on typed node registry and allowed-child matrix; QA-002/004; acceptance: invalid nesting/cycles are rejected before persistence and parent breadcrumbs match model |
| C.23.4-06 | 2448 | - Üres container, section és page drop-target; üres állapotból elem hozzáadása. | EDT-008, EDT-015/016, EDT-041 | OPEN — Editor Canvas/Library owner; 1.0 empty-state baseline; editor role required; depends on insertion commands and node types; QA-002/004; acceptance: empty page/container supports valid insert and gives a reachable, non-dead-end empty state |
| C.23.4-07 | 2449 | - Copy/cut/paste azonos oldalon és később oldalak között, ID-regenerálással és resource/binding reference-ek biztonságos rendezésével. | EDT-002/011/038/039, RES-001/008, DYN-002/007, SEC-003 | OPEN — Page Model + Resource owner; same-page 1.0, cross-page transfer gated on reference policy; editor role required on source and target pages; depends on ID regeneration and binding/resource map; QA-002/003/004; acceptance: cloned nodes have fresh IDs and no dangling/cross-site references |
| C.23.4-08 | 2450 | - Node állapotok: selected, focused, hovered, locked, hidden-in-editor, hidden-on-breakpoint, inherited, overridden, invalid, data-bound. | EDT-001/006/014/023/024/026, EDT-021/022, DYN-002/005/007 | OPEN — Editor state + Inspector owner; states supported as applicable in 1.0; editor role required; depends on canonical node/property state; QA-002/004; acceptance: every state is derived consistently and cannot be mistaken for public visibility or persisted content |
| C.23.4-09 | 2451 | - Több node property-szerkesztése csak közös, kompatibilis property-kre; eltérő értékek mixed-state megjelenítése. | EDT-006, EDT-021/022, EDT-038 | OPEN — Inspector owner; multi-edit phased behind compatible-property registry; editor role required; depends on shared property schema and mixed-value model; QA-002/004; acceptance: only compatible properties update and mixed values are displayed without overwriting divergent values |
| C.23.4-10 | 2452 | - Reusable component instance és belső child szerkesztésének egyértelmű módja; instance override vs. main definition. | DSN-012/013, EDT-001/002, EDT-021/022 | OPEN — Component Registry + Editor owner; master/instance editing phased with component contract; editor role required; depends on explicit instance override/definition model; QA-002/004; acceptance: instance override never silently mutates master definition and master updates have declared propagation |
| C.23.5-01 | 2456 | - Display: block/inline/inline-block/flex/grid/none és a támogatott semantic layout primitive-ek. | EDT-016, EDT-021/022, WEB-032 | OPEN — Layout/Inspector owner; 1.0 validated layout primitives; editor role required; depends on supported display-value registry and renderer parity; QA-002/004/005; acceptance: unsupported values rejected and editor/public output remain consistent |
| C.23.5-02 | 2457 | - Sizing: width/height/min/max, auto, fit-content, min-content, max-content, aspect ratio, intrinsic sizing. | EDT-009, EDT-016, EDT-021/022 | OPEN — Layout/Inspector owner; 1.0 sizing baseline, advanced intrinsic sizing phased; editor role required; depends on geometry constraints and typed property registry; QA-002/004/005; acceptance: min/max/auto/fit/aspect constraints validate and canvas geometry remains reachable |
| C.23.5-03 | 2458 | - Units: px, %, rem/em, vw/vh, svh/lvh/dvh és támogatott CSS clamp/min/max/calc-szerű értékek validált, UI-barát kezelése. | EDT-021/022, EDT-023/024, DSN-006 | OPEN — Inspector + responsive design owner; 1.0 common units and validated expressions, advanced units phased; editor role required; depends on unit parser/validator and viewport inheritance; QA-002/004/005; acceptance: invalid units/expressions rejected, saved values render predictably across supported viewports |
| C.23.5-04 | 2459 | - Position: static/relative/absolute/fixed/sticky; inset/top/right/bottom/left; z-index; containing block és stacking context jelzése. | EDT-009, EDT-016, EDT-021/022, WEB-032 | OPEN — Layout/renderer owner; static/relative/flex/grid baseline first; fixed/sticky/absolute/z-index only where validated; editor role required; depends on containing-block/stacking model; QA-002/004/005; acceptance: positioning semantics and stacking are predictable and do not break public rendering |
| C.23.5-05 | 2460 | - Flex: direction, wrap, justify, align, gap, order, grow/shrink/basis, align-self. | EDT-016, EDT-021/022 | OPEN — Layout/Inspector owner; 1.0 Flex baseline; editor role required; depends on validated layout schema; QA-002/004/005; acceptance: grow/shrink/basis/alignment serialize and render consistently |
| C.23.5-06 | 2461 | - Grid: template columns/rows, auto-fit/auto-fill, minmax, gap, alignment, placement, span, auto-flow és named areas ahol támogatott. | EDT-016, EDT-021/022 | OPEN — Layout/Inspector owner; grid subset only after schema/render tests; editor role required; depends on supported Grid model; QA-002/004/005; acceptance: placement/span/auto-flow/named areas are either tested and supported or visibly unavailable |
| C.23.5-07 | 2462 | - Stack/row/column, nested containers, responsive reorder és content flow. | EDT-016, EDT-024–026 | OPEN — Layout/Responsive owner; 1.0 flow-first baseline; editor role required; depends on parent layout and responsive overrides; QA-002/004/005; acceptance: nested flow and responsive reorder do not silently regress desktop |
| C.23.5-08 | 2463 | - Spacing: margin, padding, gap, logical properties, linked/unlinked sides, negative margin csak validált és indokolt esetben. | EDT-021/022, EDT-016, DSN-001/006 | OPEN — Inspector/Design System owner; 1.0 spacing and logical-property subset; editor role required; depends on unit validation and token inheritance; QA-002/004/005; acceptance: linked/unlinked sides, logical properties and negative-margin constraints are explicit and tested |
| C.23.5-09 | 2464 | - Overflow: visible/hidden/clip/auto/scroll; scroll container; sticky/overflow konfliktus diagnosztika. | EDT-016, EDT-021/022, EDT-009 | OPEN — Layout/Canvas owner; overflow modes only where public renderer supports them; editor role required; depends on scroll-container and sticky semantics; QA-002/004/005; acceptance: overflow does not clip essential content or create unreachable canvas/inspector state |
| C.23.5-10 | 2465 | - Alignment/distribution: left/center/right, top/middle/bottom, space-between/around/evenly, equal-size, align-to-selection. | EDT-010, EDT-016, EDT-021/022 | OPEN — Layout/Inspector owner; 1.0 alignment baseline; editor role required; depends on multi-selection geometry; QA-002/004/005; acceptance: alignment/distribution produces deterministic geometry and reversible commands |
| C.23.5-11 | 2466 | - Box sizing, border, radius, outline, shadow, opacity, blend mode, background color/image/gradient/video (video háttér csak performance/accessibility korláttal). | EDT-021/022, EDT-016, EDT-040, DSN-001–DSN-007, RES-001/002/004/008, WEB-032, QA-005 | OPEN — Inspector/Design System owner; safe visual primitives baseline, video/blend advanced and performance-gated; editor role required; depends on token/property schema and renderer security; QA-002/004/005; acceptance: all styles validate, unsafe embeds/media are constrained, reduced-motion/performance limits are tested |
| C.23.5-12 | 2467 | - Transform: translate/rotate/scale/skew, transform origin, 2D/3D csak biztonságos és tesztelt scope-ban. | EDT-009, EDT-021/022, WEB-032 | OPEN — Editor geometry owner; transforms only for validated schema subset; editor role required; depends on transform serialization/render parity; QA-002/004/005; acceptance: transform origin and scale/rotate behavior are reversible and consistent; 3D disabled unless explicitly tested |
| C.23.5-13 | 2468 | - Aspect ratio, object-fit/object-position, image focal point, crop/cover/contain. | EDT-018, RES-004, EDT-021/022 | OPEN — Media/Inspector owner; 1.0 image-fit/crop baseline; editor role required and asset visibility checked; depends on image resource schema and focal-point representation; QA-002/004; acceptance: crop/object-position survives save/reload and public render |
| C.23.5-14 | 2469 | - Container width, full-bleed, boxed layout, content max-width, section inner width, viewport-aware spacing. | EDT-016, EDT-021/022, DSN-006, WEB-032 | OPEN — Layout/Design System owner; 1.0 content width/boxed/full-bleed baseline; editor role required; depends on responsive layout tokens and renderer parity; QA-002/004/005; acceptance: content max-width/full-bleed behavior remains stable at supported viewport sizes |
| C.23.5-15 | 2470 | - Inspectorben pontos értékbeírás és vásznon drag; mindkettő ugyanazt a command/property-registry útvonalat használja. | EDT-003/004, EDT-009, EDT-021/022, EDT-039 | OPEN — Editor command + Inspector owner; 1.0 unified-editing invariant; editor role required; depends on shared property registry and transform command; QA-002/004/005; acceptance: Inspector numeric edit and canvas drag emit the same validated command path and serialize the same final property value |
| C.23.5-16 | 2471 | - Computed/inherited/overridden értékek megkülönböztetése; invalid CSS vagy nem támogatott érték nem menthető csendben. | EDT-021–024, EDT-028, WEB-032 | OPEN — Inspector + renderer owner; 1.0 validation/inheritance baseline; editor role required; depends on computed-value resolution and schema validation; QA-002/003/004; acceptance: computed/inherited/overridden values are distinguishable and invalid/unsupported values cannot be silently persisted |
| C.23.6-01 | 2475 | - Font family, font loading, fallback, size, weight, style, line-height, letter/word spacing, text transform, decoration, alignment, wrapping, hyphenation és text balance. | DSN-007, RES-013, EDT-017, EDT-021/022 | OPEN — Typography/Resource + Editor owner; 1.0 accessible font and text baseline, advanced font features phased; editor role required and licensed asset access enforced; depends on font registry/loading/fallback and property validation; QA-002/004/005; acceptance: missing fonts fall back predictably and typography values persist/render consistently |
| C.23.6-02 | 2476 | - Heading level (H1–H6) a vizuális stílustól külön; link, emphasis, inline code, quote és rich-text struktúra. | EDT-017, EDT-021/022, WEB-032 | OPEN — Editor text/schema owner; 1.0 semantic rich-text baseline; editor role required; depends on text-node schema and safe renderer; QA-002/003/004/005; acceptance: heading semantics remain independent from visual styles, inline structure round-trips and unsafe markup is rejected |
| C.23.6-03 | 2477 | - Global color palette, semantic tokens (primary/surface/text/border/success/warning/error), gradients, transparency és contrast preview. | DSN-001–DSN-007, EDT-021/022, QA-005 | OPEN — Design System + Inspector owner; 1.0 token baseline, advanced gradient/transparency phased; edit permission required for global tokens; depends on token registry, usage map and contrast calculation; QA-002/003/004/005; acceptance: semantic tokens resolve consistently, changes are previewable/reversible and contrast warnings are deterministic |
| C.23.6-04 | 2478 | - Global typography roles (display/headings/body/caption/label/code) és user-defined text styles. | DSN-007, DSN-001/002, EDT-017/021 | OPEN — Typography/Design System owner; 1.0 role-based text styles, custom style management phased; global-style edit permission required; depends on font and token registries; QA-002/004/005; acceptance: role styles apply consistently and custom styles are versioned and editable without semantic heading loss |
| C.23.6-05 | 2479 | - Spacing scale, container widths, breakpoints, radius, border, shadow, z-index layers, motion duration/easing token. | DSN-001/006, DSN-005, EDT-016/024, EDT-040 | OPEN — Design System owner; 1.0 spacing/breakpoint tokens, advanced motion token set phased; global-token permission required; depends on token schema and responsive contract; QA-002/004/005; acceptance: tokens have stable names/values, viewport ranges are valid and motion respects reduced-motion policy |
| C.23.6-06 | 2480 | - Token létrehozás/átnevezés/használatkeresés/átállítás/törlés előtti dependency check. | DSN-003/004, DSN-001, SEC-001–SEC-011 | OPEN — Design System owner; 1.0 dependency-safe token lifecycle; global edit permission required; depends on complete token usage map; QA-002/003/004; acceptance: deletion/rename checks consumers, blocks unsafe deletion or requires explicit replacement, and rollback restores dependents |
| C.23.6-07 | 2481 | - Token vs. literal value: jelölés, „convert to token”, „detach from token”, token reset és site-wide impact preview. | DSN-001–DSN-004, EDT-021–024 | OPEN — Design System + Inspector owner; 1.0 token/literal distinction; edit permission required; depends on token usage map and resolved-property model; QA-002/004; acceptance: convert/detach/reset actions show impact and do not mutate unrelated styles |
| C.23.6-08 | 2482 | - Theme/style variations, light/dark/high-contrast theme előkészítés; a tényleges váltás csak explicit theme supporttal. | DSN-005/006, DSN-001–DSN-004, EDT-040 | OPEN — Design System owner; theme variations phased behind explicit theme schema; permission required for global changes; depends on tokens and contrast validation; QA-002/004/005; acceptance: unsupported light/dark/high-contrast switching is not exposed as functional and supported themes render predictably |
| C.23.6-09 | 2483 | - Font asset/license metadata, font display/performance és unavailable-font fallback. | DSN-007, RES-013, RES-007, RES-015 | OPEN — Resource/Typography owner; 1.0 font metadata/fallback, extended licensing workflow phased; asset permission and license constraints required; depends on font registry and loader; QA-002/003/004/005; acceptance: license/source metadata is retained, failed font loads fall back and performance is measurable |
| C.23.6-10 | 2484 | - Site-wide global style change előtt érintett oldalak/komponensek előnézete és undo/rollback. | DSN-003/004, DSN-012–014, EDT-005/032 | OPEN — Design System owner; 1.0 global-change safety; global edit permission required; depends on usage map, preview/diff and history; QA-002/003/004; acceptance: impact list identifies affected pages/components and undo/rollback restores previous effective styles |
| C.23.7-01 | 2488 | - Inspector kategóriák: Content, Layout, Size, Position, Spacing, Typography, Appearance, Background, Border/Shadow, Effects, Responsive, Interactions, Accessibility, SEO, Data/Bindings, Advanced. | EDT-021/022, EDT-017–020, WEB-032, SEC-001–011 | OPEN — Inspector/Property Registry owner; category baseline phased by supported node type; editor role required; depends on typed property schema and accessibility/security metadata; QA-002/003/004; acceptance: categories only expose supported controls and no property is silently dropped from serialization |
| C.23.7-02 | 2489 | - Kontextusfüggő property-k csak az adott node type által támogatottan jelenhetnek meg. | EDT-001/002, EDT-017–022, EDT-039 | OPEN — Page Model + Property Registry owner; 1.0 node-type schema invariant; editor role required; depends on canonical node type and property compatibility registry; QA-002/004; acceptance: unsupported properties are unavailable and server validation rejects forged/invalid combinations |
| C.23.7-03 | 2490 | - Property search, kategóriafilter, recent properties, favorites, tooltip/help, default/inherited/override jelzés. | EDT-021/022/023/024, EDT-039 | OPEN — Inspector owner; search/help and inheritance indicators phased by control type; editor role required; depends on registry metadata and resolved value model; QA-002/004/005; acceptance: search/filter is deterministic and recent/favorite metadata never changes the underlying document |
| C.23.7-04 | 2491 | - Reset property, reset group, reset to breakpoint parent, reset element to preset, copy/paste property group. | EDT-005, EDT-021–024, DSN-001–004 | OPEN — Inspector/Design System owner; reset/copy actions 1.0 where schema-valid; editor role required; depends on inheritance and command history; QA-002/004; acceptance: reset scope is explicit, undoable and cannot reset a wider scope than selected |
| C.23.7-05 | 2492 | - Input validation, unit validation, min/max, enum, required fields, invalid value, dependency/compatibility warnings. | EDT-021/022, EDT-009, WEB-032 | OPEN — Property Registry owner; 1.0 server/client validation parity; editor role required; depends on typed schema, unit parser and compatibility constraints; QA-002/003/004; acceptance: invalid values are blocked client-side and server-side, with actionable errors and no silent persistence |
| C.23.7-06 | 2493 | - Property change → command → validation → history → dirty state → save/reload round-trip. | EDT-003–005, EDT-027–031, QA-002 | OPEN — Editor command/persistence owner; 1.0 release gate; editor role required; depends on transaction pipeline and save/reload contract; QA-002/004; acceptance: every property mutation traverses validation/history/dirty/save and round-trips exactly |
| C.23.7-07 | 2494 | - Batch edit, mixed values, apply to all selected compatible nodes. | EDT-006, EDT-021/022, EDT-038 | OPEN — Inspector owner; multi-edit phased behind compatible schema; editor role required; depends on mixed-value model and node compatibility; QA-002/004; acceptance: only compatible properties update and mixed values do not overwrite divergent values without an explicit action |
| C.23.7-08 | 2495 | - Property registry schema version, deprecation notice és migráció; új UI nem tarthat fenn második property store-t. | EDT-001, EDT-021/022, DSN-014 | OPEN — Property Registry owner; schema version/deprecation before registry expansion; editor role required; depends on migration/compatibility policy; QA-002/004/006; acceptance: deprecated properties have migration path and no parallel property store is introduced |
| C.23.7-09 | 2496 | - Advanced CSS/custom attributes csak későbbi, explicit sandbox/security contracttal; arbitrary script nem futtatható a szerkesztői jogosultság miatt. | SEC-001–SEC-011, EDT-021/022, WEB-032 | OPEN — Security + Editor owner; advanced custom CSS/attributes later gated; editor role alone does not authorize script execution; depends on sandbox/content security policy and validation; QA-003/004/008; acceptance: arbitrary scripts never execute and custom values are escaped, scoped and auditable |
| C.23.8-01 | 2502 | - Structure: Section, Container, Row, Column, Stack, Flex, Grid, Spacer, Divider, Separator. | EDT-016/019, EDT-021/022 | OPEN — Editor element registry owner; 1.0 core layout primitives, advanced variants phased; editor role required; depends on typed node schemas and public renderer parity; QA-002/004/005; acceptance: each exposed primitive inserts, edits, saves/reloads and renders accessibly or is marked unavailable |
| C.23.8-02 | 2503 | - Content: Text, Heading, Rich Text, Quote, List, Numbered List, Table, Code, Badge, Icon, Image, Gallery, Video, Audio, Embed. | EDT-017–019, EDT-021/022, RES-001–015 | OPEN — Editor Content + Resource owner; element types phased by schema/renderer readiness; editor role and asset authorization required; depends on canonical element schemas, media registry and safe rendering; QA-002/003/004/005; acceptance: every enabled content/media element has validation, responsive output, fallback/error states and tests |
| C.23.8-03 | 2504 | - Navigation: Header, Footer, Navbar, Menu, Breadcrumbs, Tabs, Anchor, Pagination, Back-to-top. | EDT-017/019, WEB-001–013, EDT-039 | OPEN — Editor + Website Manager owner; core navigation shell 1.0, advanced widgets phased; editor role required; depends on canonical navigation/site-shell ownership; QA-002/004/005; acceptance: nav/menu/breadcrumb behaviors are keyboard accessible and match public routes |
| C.23.8-04 | 2505 | - Action: Button, Link, CTA, Icon Button, Download, Share. | EDT-017, EDT-039, WEB-032, RES-014 | OPEN — Editor action registry owner; 1.0 link/button baseline; editor role required to configure, public target policy enforced; depends on safe URL/action registry; QA-002/003/004; acceptance: internal/external/download actions resolve safely and use canonical handlers |
| C.23.8-05 | 2506 | - Cards/collections: Card, Feature Card, Profile Card, Game Card, Stream Card, Product Card, List/Grid/Carousel/Slider. | EDT-018/019, DSN-011–013, STO-001–007, STO-017 Product/collection Editor blocks, WEB-025 | OPEN — Editor + Component Registry owner; core card primitives first, content/product-specific cards phased by domain; editor role required; depends on typed component schema and domain DTOs; QA-002/004/005; acceptance: card/collection types only render from canonical data sources and have empty/loading/error states |
| C.23.8-06 | 2507 | - Interactive: Accordion, Tabs, Modal/Dialog, Tooltip, Popover, Toggle, Disclosure, Search, Filter, Sort. | EDT-019, EDT-039, WEB-032 | OPEN — Editor interaction + renderer owner; interactive widgets phased by keyboard/accessibility contract; editor role required; depends on shared interaction/action registry; QA-002/003/004/005; acceptance: keyboard/focus/escape behavior works and public controls do not execute editor commands |
| C.23.8-07 | 2508 | - Form: Form shell, text/email/url/number/date/select/checkbox/radio/textarea fields, validation/help/success/error state; secure submit handler külön canonical domain. | EDT-019, SEC-001–SEC-011, WEB-032 | OPEN — Forms + Security owner; form visuals can be phased, submit domain must be separately authorized; editor role required to configure and server policy for submissions; depends on canonical secure submit handler, validation and abuse controls; QA-002/003/008; acceptance: no client-only trust, validation/error states are explicit and submission is authorized/rate-limited |
| C.23.8-08 | 2509 | - Media: image/video/audio embeds, responsive source, poster, captions/transcript, aspect ratio, lazy loading. | EDT-018/019, RES-002–009, RES-014/015 | OPEN — Media/Resource owner; image/video/audio baseline gated by actual storage and provider support; editor role plus resource access required; depends on binary storage, metadata, captions/transcript and responsive source policy; QA-002/003/004/006; acceptance: media fallback, lazy loading, caption/transcript and authorization are tested |
| C.23.8-09 | 2510 | - Social/creator: Twitch live/status/player/chat where permitted, schedule, countdown, channel link, VOD/clip link, social icon row, community invite, support CTA. | EDT-020, WEB-001/020/022/024, INT-001–018, LIV-001–007, SCH-009–015, CNT-002–004, COM-001, SUP-001–003, CAM-001/CAM-004, RES-011 | OPEN — Dynamic blocks + Schedule + Integration owners; 1.0 only for verified data/provider capabilities, others phased; editor role required and provider scopes enforced; depends on public-safe DTOs and stale/error state contracts; QA-002/003/004/005; acceptance: every block has permission-safe data source, stale/empty/error states and provider capability gating |
| C.23.8-10 | 2511 | - CMS/data: collection list, item template, dynamic field, reference/relationship, empty/loading/error state, conditional block, pagination/filter. | DYN-001–008, WEB-031/032, SEC-001–011 | OPEN — Dynamic Data/CMS owner; collection/relationship CMS phased after schema contract; editor role required for configuration, public published-only access; depends on typed collection schema, query limits and safe DTO projection; QA-002/003/004/008; acceptance: invalid relations/query fields are rejected and drafts never leak publicly |
| C.23.8-11 | 2512 | - Commerce future: product/collection/price/stock/CTA and external checkout boundary; order/payment state nem lehet egyszerű Page Model tartalom. | STO-001, STO-002 variants/SKU/price, STO-003 categories/collections/tags, STO-001–020, WEB-025, SEC-002/003/008/010 | OPEN — Commerce + Content owner; future commerce phase; editor role for catalog setup and separate authorized checkout/payment domain; depends on product/order/payment contracts and provider boundary; QA-003/008; acceptance: order/payment state is never trusted as page content and no checkout capability is claimed before backend/provider tests |
| C.23.8-12 | 2513 | - Future app slots/widgets: explicit capability and security boundary, not arbitrary injected code. | EDT-039, SEC-001–011, OPS-005, WEB-032 | OPEN — Platform extensibility + Security owner; future phase behind explicit capability/sandbox contract; admin/editor role alone cannot run arbitrary code; depends on sandbox, approval, audit and resource limits; QA-003/008; acceptance: unknown widgets are blocked and no injected arbitrary code executes |
| C.23.8-13 | 2514 | - Minden elementhez type-specific schema, defaults, accessible output, responsive behavior, Inspector mapping, validation, preview, tests and public renderer support kell. | EDT-001/002, EDT-017–022, EDT-024–026, WEB-032, QA-002–005 | OPEN — Editor element registry + public renderer owner; release gate for every enabled element type; editor role required; depends on complete schema/Inspector/renderer contract; QA-002/003/004/005; acceptance: each enabled type has schema/defaults/accessibility/responsive/validation/preview/tests and renderer parity |
| C.23.9-01 | 2518 | - Desktop/tablet/mobile előre definiált nézetek, egyedi breakpoints és custom viewport width/height. | EDT-007, EDT-024/025, EDT-035 | OPEN — Editor viewport owner; 1.0 standard viewport controls, custom presets phased; editor role required; depends on canonical viewport state; QA-002/004/005; acceptance: desktop/tablet/mobile/custom dimensions update preview without creating a second document |
| C.23.9-02 | 2519 | - Breakpointok egymás melletti preview-ja, single-breakpoint mode, rotate/portrait-landscape preview. | EDT-007, EDT-025/026, EDT-035 | OPEN — Responsive preview owner; side-by-side/single/rotation features only when supported; editor role required; depends on viewport and breakpoint registry; QA-002/004/005; acceptance: preview mode is explicit and does not mutate page structure or save route |
| C.23.9-03 | 2520 | - Resize drag handle és pontos viewport mező; common device presets, custom device preset. | EDT-007/009, EDT-025, EDT-035 | OPEN — Editor viewport owner; common/custom device presets phased; editor role required; depends on validated viewport dimensions; QA-002/004/005; acceptance: resize and numeric dimensions agree, invalid dimensions are rejected and presets are metadata not test substitutes |
| C.23.9-04 | 2521 | - Cascading/inherited style model: nagyobb breakpoint értékei öröklődnek; kisebb breakpoint override nem írhatja felül észrevétlenül a nagyobbat. | EDT-023/024, DSN-006, EDT-021/022 | OPEN — Responsive property owner; 1.0 inheritance invariant; editor role required; depends on canonical breakpoint ordering and resolved-value model; QA-002/004/005; acceptance: child breakpoint overrides are explicit and never silently mutate parent breakpoint values |
| C.23.9-05 | 2522 | - Property-level breakpoint overrides; reset inherited; copy breakpoint settings; clear all overrides with confirmation. | EDT-005, EDT-021–026, DSN-006 | OPEN — Responsive Editor owner; property-level overrides/reset phased by schema; editor role required; depends on inheritance model and undoable commands; QA-002/004/005; acceptance: reset/copy/clear actions show scope and preserve unrelated breakpoints |
| C.23.9-06 | 2523 | - Responsive behavior: fluid, scale, fixed, min/max, wrap, stack, reorder, hide/show, overflow strategy, typography scaling. | EDT-016, EDT-023–026, DSN-006 | OPEN — Layout/Responsive owner; 1.0 flow-first behavior, advanced fluid/scale strategies phased; editor role required; depends on responsive schema and renderer parity; QA-002/004/005; acceptance: wrap/stack/reorder/visibility/overflow behavior is deterministic at supported widths |
| C.23.9-07 | 2524 | - Breakpoint-specifikus layout és visibility; tartalmi/strukturális változás közös modellben marad, ha nem indokolt valódi külön node. | EDT-001/002, EDT-023–026, WEB-031 | OPEN — Page Model + Responsive owner; 1.0 shared-node model invariant; editor role required; depends on separation of style overrides and structural content; QA-002/004/005; acceptance: responsive visibility/layout changes use canonical node/override model and do not duplicate pages |
| C.23.9-08 | 2525 | - Oldal-, section- és komponensszintű breakpointok összehangolása; konfliktus és nem használt breakpoint jelzése. | DSN-006, EDT-023–026, EDT-021/022 | OPEN — Design System + Responsive owner; coordinated breakpoints phased by shared contract; editor role required; depends on site/page/component breakpoint policy; QA-002/004/005; acceptance: conflicting/unused breakpoints are diagnosed and resolved consistently |
| C.23.9-09 | 2526 | - Minimum width/overflow/overlap/viewport clipping diagnostics; szélső méretek és zoom tesztek. | EDT-007/009/010, EDT-024–026 | OPEN — Canvas/Responsive owner; 1.0 clipping/overflow diagnostics gate; editor role required; depends on geometry and breakpoint tests; QA-002/004/005; acceptance: narrow/wide/extreme viewports reveal overflow/overlap and essential content remains reachable |
| C.23.9-10 | 2527 | - Canvas height és scroll extent újraszámítása drag/resize/content growth közben, zoommal és transformmal korrigálva. | EDT-007–010, EDT-027/030/042 | OPEN — Canvas geometry owner; explicit 1.0 regression gate; editor role required; depends on content-size observation and transform/zoom-correct geometry; QA-002/004/005; acceptance: drag/resize/content growth recomputes canvas height and scroll extent correctly at zoom levels, with no clipped off-canvas content |
| C.23.9-11 | 2528 | - Responsive preview nem külön mobil Page Model és nem külön save route. | EDT-001, EDT-023–026, EDT-028/032/033 | OPEN — Page Model + Responsive owner; architectural invariant across phases; editor role required; depends on one canonical document and save/publish separation; QA-002/004/005; acceptance: responsive preview changes viewport only, while all breakpoints persist through the same canonical model/save contract |
| C.23.9-12 | 2529 | - Device presets nem helyettesítik a valódi browser/device tesztet. | QA-004/005, EDT-025/026 | OPEN — QA/Responsive owner; required test policy for all phases; no special runtime permission; depends on supported browser/device matrix; QA-004/005; acceptance: device presets are supplemented by real browser viewport and representative device testing |
| C.23.10-01 | 2533 | - Hover, focus, active, disabled, selected, expanded/collapsed, loading, success, error és empty states. | EDT-017–020, EDT-039, WEB-032 | OPEN — Editor interaction + renderer owner; 1.0 common UI states, per-widget states phased; editor role required to configure; depends on state schema and public-safe renderer; QA-002/003/004/005; acceptance: hover/focus/disabled/loading/success/error/empty states are distinct, accessible and deterministic |
| C.23.10-02 | 2534 | - Link/action target, anchor, external/internal navigation, download, open-in-new-tab, safe rel policy. | EDT-017, EDT-039, WEB-001–013, RES-014, SEC-001–011 | OPEN — Navigation/action registry owner; 1.0 safe links/actions; editor role required for authoring, public target policy enforced; depends on canonical URL/action registry; QA-002/003/004; acceptance: internal/external/download/new-tab targets are validated and safe rel policy is applied |
| C.23.10-03 | 2535 | - Hover/focus transitions, entrance/exit, scroll-triggered motion és component interaction presets. | EDT-039/040, DSN-001/005, WEB-032 | OPEN — Interaction + Design System owner; motion/interactions phased by reduced-motion and performance policy; editor role required; depends on shared interaction schema and renderer; QA-002/004/005; acceptance: configured transitions are previewable, scoped and disabled or adapted for reduced motion |
| C.23.10-04 | 2536 | - Duration/easing/delay, trigger, target, replay, reduced-motion alternative, animation conflict warning. | EDT-040, DSN-001/005, SEC-001–011 | OPEN — Motion/accessibility owner; 1.0 reduced-motion baseline, advanced triggers phased; editor role required; depends on validated duration/easing/trigger schema; QA-002/004/005; acceptance: invalid/conflicting motion settings are warned and reduced-motion alternative is honored |
| C.23.10-05 | 2537 | - Interakciók explicit trigger/action modelben; preview-ban szimulálhatók, de szerkesztői műveletet nem hajthatnak végre. | EDT-039, EDT-032, SEC-001–011 | OPEN — Editor action registry owner; 1.0 preview isolation invariant; editor role required to configure actions; depends on separation of preview simulation from editor commands; QA-002/003/004; acceptance: preview interactions never mutate the Page Model or invoke privileged editor actions |
| C.23.10-06 | 2538 | - Form success/error, media load failure, empty CMS collection, offline/unavailable integration állapotok. | EDT-019/020, DYN-001–008, INT-001–020, RES-015, WEB-028 | OPEN — Widget/domain owners; states phased per canonical domain; editor role required for configuration and provider/domain permissions enforced; depends on typed state/DTO/error contracts; QA-002/003/004/005; acceptance: failed media, empty collections, form failures, offline and unavailable integrations show explicit recoverable states |
| C.23.10-07 | 2539 | - Tab/focus order, keyboard operation, escape/cancel és focus return. | EDT-037, EDT-039, WEB-032 | OPEN — Accessibility + Editor owner; 1.0 keyboard/focus contract; editor role required in editor, public controls follow public access; depends on semantic controls and focus management; QA-002/004/005; acceptance: tab order, escape/cancel and focus return are keyboard-tested without focus traps |
| C.23.10-08 | 2540 | - Motion és third-party embeds csak performance/privacy/accessibility guardrail mellett. | EDT-040, WEB-032, SEC-001–011, OPS-005 | OPEN — Security/Performance/Accessibility owners; third-party embeds and motion guarded in all phases; editor role required for configuration, CSP/privacy policy applies at render; depends on performance budget and consent/security rules; QA-003/004/008; acceptance: reduced motion, privacy, loading/performance and unsafe embed blocking are tested |
| C.23.11-01 | 2544 | - Oldallista: create, rename, duplicate, archive, delete, restore, search, filter, reorder, parent/child, draft/published state. | WEB-001–013, EDT-027–033, SEC-001–011 | OPEN — Website Manager/Page owner; 1.0 page lifecycle baseline; authorized editor/admin role required; depends on canonical Page CRUD, draft/published/revision and audit contracts; QA-002/003/004; acceptance: create/rename/duplicate/archive/delete/restore/search/reorder and status changes persist with correct authorization and recovery |
| C.23.11-02 | 2545 | - Slug/URL, canonical URL, trailing slash policy, redirects, duplicate slug detection, 404 handling. | WEB-001–013, SEO-001–005, SEC-001–011 | OPEN — Website Routing/SEO owner; 1.0 slug/canonical/404 baseline; admin permission required for redirects/slug changes; depends on unique slug policy and route resolver; QA-002/003/004; acceptance: duplicate slugs are blocked, redirects are deterministic, canonical/trailing-slash and 404 rules are tested |
| C.23.11-03 | 2546 | - Page type/template assignment: standard, landing, about, schedule, game/profile, blog/article, directory, contact, support, future commerce. | WEB-001–028, DSN-008/009, SCH-012–014, CNT-001–020, STO-001–020 | OPEN — Website Manager + domain owners; page types enabled only when owning domain exists; editor role required; depends on canonical templates and typed domain contracts; QA-002/004/005; acceptance: unavailable future page types are not exposed as functional and enabled templates use canonical data |
| C.23.11-04 | 2547 | - Site shell: global header/footer, announcement bar, sidebar, Navbar, mobile menu, shared navigation and reusable site sections. | WEB-001–013, DSN-008–012, EDT-016/017 | OPEN — Website shell + Design System owner; core shared header/footer/navigation baseline; site edit permission required; depends on shared component/template ownership and responsive shell; QA-002/004/005; acceptance: global edits show site-wide impact and page-local edits do not mutate shared shell |
| C.23.11-05 | 2548 | - Navigation tree, nested menus, active state, external links, accessibility labels, mobile collapse behavior. | WEB-001–013, EDT-017/019, EDT-037/039 | OPEN — Navigation owner; 1.0 accessible navigation; site edit permission required; depends on canonical nav tree and safe URL registry; QA-002/004/005; acceptance: nested/external links, active state, labels and mobile collapse work by keyboard and touch |
| C.23.11-06 | 2549 | - Site-wide edit vs. page-local edit világos jelölése; shared template change impact list. | DSN-003/004, DSN-008–012, WEB-001–013 | OPEN — Website Manager + Design System owner; 1.0 scope clarity; site-wide edit permission required for shared changes; depends on usage/impact map and shared template model; QA-002/003/004; acceptance: UI labels target scope and shared change previews list affected pages/components before apply |
| C.23.11-07 | 2550 | - System pages: 404, search, archive/list/detail, privacy/terms, maintenance/offline and unavailable content states. | WEB-028/029, WEB-031/032, SEC-001–011, SEO-001–005 | OPEN — Public renderer + Security/SEO owner; 1.0 error/privacy pages, advanced archive/search phased; public-safe content only; depends on canonical error routes and published-only policy; QA-002/003/004; acceptance: 404/search/archive/maintenance/offline/privacy/terms states resolve correctly without leaking draft/private data |
| C.23.11-08 | 2551 | - Page duplication/import must regenerate identifiers where required and preserve only valid canonical references. | EDT-001/002, EDT-011, RES-001/008, DYN-001–008 | OPEN — Page Model + Resource/Dynamic Data owner; 1.0 duplicate integrity; authorized editor role required; depends on stable IDs and canonical reference registry; QA-002/003/004; acceptance: duplicated/imported pages regenerate required IDs and preserve only valid references with no dangling or cross-site links |
| C.23.11-09 | 2552 | - Public renderer kizárólag published canonical Page Modelt használ; draft/preview route protected és noindex. | WEB-031/032, EDT-027–034, SEC-001–011, SEO-001–005 | OPEN — Public renderer + Security/SEO owner; 1.0 release gate; public reads are published-only and previews protected/noindex; depends on publish snapshot, auth and cache rules; QA-002/003/004/008; acceptance: public routes never serve draft content, protected previews are not indexed, and cache invalidation follows publish/unpublish |
| C.23.12-01 | 2556 | - Collection/schema designer: text, rich text, number, boolean, date/time/timezone, URL, image/file, enum, reference/relation, list, JSON with validation. | DYN-001–008, WEB-025/026, SEC-001–011 | OPEN — Dynamic Data schema owner; collections phased after schema contract; editor role required for schema changes and published-only public reads; depends on typed field registry and migration contract; QA-002/003/004/008; acceptance: all field types validate, JSON is constrained, relationships are typed and query-safe |
| C.23.12-02 | 2557 | - Field labels, help, required, default, validation, unique, search/filter/sort, display format and migration. | DYN-001–008, SEC-001–011 | OPEN — Dynamic Data schema owner; 1.0 schema validation gate; schema-edit permission required; depends on validation/migration engine; QA-002/003/006; acceptance: required/unique/default/search/filter/sort constraints are enforced and migrations preserve or explicitly reject incompatible data |
| C.23.12-03 | 2558 | - Static vs. dynamic property/binding indicator; choose source, field, transform/format and fallback. | DYN-001–008, RES-001–015 | OPEN — Dynamic Data + Resource owner; relation/media fields phased by resource contracts; schema-edit permission required; depends on canonical resource IDs and scoped authorization; QA-002/003/004; acceptance: references are validated, deleted resources are handled explicitly and cross-site references are rejected |
| C.23.12-04 | 2559 | - Canonical sources: site settings, schedule domain, Twitch adapter, Resource metadata, CMS collections and future platform adapters. | DYN-001–008, SEC-001–011, QA-002/003/006 | OPEN — Dynamic Data owner; bulk import/export phased behind schema contract; authorized role required; depends on schema version, validation and audit; acceptance: import previews row-level errors, export respects permissions, and failed imports do not partially mutate data |
| C.23.12-05 | 2560 | - Loading/empty/error/stale states; timeout, retry, caching, invalid/stale binding and deleted source handling. | DYN-001–008, WEB-031/032, SEC-001–011 | OPEN — Dynamic Data + Public renderer owner; published-only public reads; editor role required for setup, public access constrained; depends on safe query DTOs and publication lifecycle; QA-002/003/004/008; acceptance: draft/private fields never leak and collection queries are bounded |
| C.23.12-06 | 2561 | - Conditional visibility based on safe typed values, integration status or content presence; no arbitrary code evaluation. | DYN-001–008, EDT-020/039, QA-002/004 | OPEN — Dynamic Data + Editor owner; reusable query blocks phased by canonical data API; editor role required; depends on typed query definitions and empty/loading/error states; acceptance: bindings are typed, query limits enforced and failed queries degrade safely |
| C.23.12-07 | 2562 | - Collection list/grid/repeater, item template, pagination, sorting, filtering and URL/query state where permitted. | DYN-001–008, EDT-020, WEB-031/032 | OPEN — Dynamic Data + Editor owner; collection/repeater support phased by query contract; editor role required; depends on typed collection schema and bounded query API; QA-002/003/004; acceptance: pagination/filter/sort use declared fields and URL state cannot bypass authorization or query limits |
| C.23.12-08 | 2563 | - Data preview with sample/real data toggle; secret fields and private data must never leak to public preview. | DYN-001–008, SEC-001–011, WEB-031/032 | OPEN — Dynamic Data + Editor owner; sample/real data preview gated by privacy boundary; editor role required; depends on field-level privacy metadata and safe DTO projection; QA-002/003/004; acceptance: preview never exposes secret/private fields or bypasses published-only output |
| C.23.12-09 | 2564 | - D1 domain records remain domain-owned; Page Model stores binding/reference/config only and does not duplicate schedule or integration data. | DYN-001–008, SCH-001–015, INT-001–021, EDT-001/020, SEC-002 | OPEN — Domain architecture owner; invariant across all phases; editor may store binding/reference/config only; depends on canonical domain services; QA-002/003/004; acceptance: schedule/integration/resource domain records are not duplicated in Page Model and mutations use their owning domain |
| C.23.13-01 | 2568 | - Központi Resource Manager és Editor picker ugyanazon registryt használja. | RES-001–015, EDT-018/019, SEC-001–011 | OPEN — Resource Registry owner; 1.0 canonical picker/library invariant; resource-read permission and site scope required; depends on shared registry contract; QA-002/003/004; acceptance: Admin Manager and Editor picker show same canonical assets and ownership/availability |
| C.23.13-02 | 2569 | - Upload/drop, multi-upload, progress, cancel/retry, duplicate detection, type/size validation, safe object keys and ownership checks. | RES-001–015, OPS-005, SEC-001–011 | OPEN — Resource upload owner; upload baseline only where backend supports it; write permission required; depends on object-key/metadata ownership and upload validation; QA-002/003/006; acceptance: multi-upload/progress/cancel/retry and size/type/ownership checks do not create orphaned objects |
| C.23.13-03 | 2570 | - Search/filter by type/tag/usage/date/dimensions/owner; sort, folders/collections, favorites and recent. | RES-001–015, SEC-001–011 | OPEN — Resource Library owner; search/folders/favorites phased by metadata model; read permission required; depends on typed metadata and site-scoped query; QA-002/003/004; acceptance: filters/sorts are deterministic and never cross tenant boundary |
| C.23.13-04 | 2571 | - Preview, metadata, alt text/caption/credit, crop/focal point, resize/replace, derivatives, optimization and thumbnail. | RES-001–015, EDT-018/021, WEB-032 | OPEN — Media Resource owner; preview/alt/crop baseline and derivatives phased; resource-read/write permissions required; depends on media metadata and public rendition; QA-002/003/004/006; acceptance: preview, crop, focal point, replace and metadata persist through save/reload and public rendering |
| C.23.13-05 | 2572 | - Usage references across pages/components/templates; before-delete impact list; unused asset detection; archive/restore. | RES-001–015, SEC-001–011, OPS-005 | OPEN — Resource lifecycle owner; destructive actions require impact preview; privileged resource-write permission required; depends on complete reference map and audit; QA-002/003/006; acceptance: delete/archive/restore checks all known usages and blocks unresolved references |
| C.23.13-06 | 2573 | - SVG sanitization, allowed MIME validation, font file constraints, video/audio duration/poster/caption and file-download policy. | RES-003 upload validation, RES-007 metadata/caption, RES-012 SVG sanitization, RES-013 font registry/constraints, RES-014 download authorization, RES-015 diagnostics, SEC-005, QA-003/006 | OPEN — Resource security owner; format-specific validation release gate; upload permission required; depends on MIME/extension sniffing, SVG sanitization and media policy; acceptance: dangerous/mismatched files are rejected and safe formats have tested limits |
| C.23.13-07 | 2574 | - Image variants/responsive sources and cache invalidation; preserve old references safely when replacing. | RES-001–015, WEB-031/032, OPS-008 | OPEN — Media delivery owner; responsive variants/cache invalidation phased by pipeline; resource-write permission required; depends on stable resource IDs and cache policy; QA-002/003/004/006; acceptance: replacement preserves valid references and cache refreshes without exposing private assets |
| C.23.13-08 | 2575 | - Icon registry: searchable icons, categories, style/weight/size/color, custom approved SVG upload, icon accessibility mode. | RES-001–015, DSN-001–007, EDT-019/021 | OPEN — Icon Registry owner; approved icon catalogue baseline, custom upload gated; resource/icon permission required; depends on icon metadata and SVG sanitizer; QA-002/003/004/005; acceptance: search/style/size/color controls map to approved assets and accessibility mode is explicit |
| C.23.13-09 | 2576 | - Font library: family/weight/style metadata, fallback and license notes. | RES-001–015, DSN-007, EDT-017/021 | OPEN — Font Resource owner; font family/weight/style/fallback baseline; asset permission and license metadata required; depends on font registry/loading and typography property schema; QA-002/004/005; acceptance: missing fonts fall back predictably and source/license notes remain attached |
| C.23.13-10 | 2577 | - R2 stores binary data; D1 stores metadata/reference/ownership. No separate media/icon/font storage owner. | RES-001–015, OPS-005, SEC-001–011 | OPEN — Resource architecture owner; storage boundary invariant; resource-write permission required; depends on R2 binary/D1 metadata/reference/ownership contracts; QA-002/003/006; acceptance: binaries are not duplicated into D1 and metadata/reference/owner state remains consistent |
| C.23.14-01 | 2581 | - Explicit saved/dirty/saving/saved/error/offline/conflict state; no decorative save indicators. | EDT-027–034, WEB-004–008, QA-002/004 | OPEN — Editor persistence owner; 1.0 release gate; editor role required; depends on save state machine and persistence contract; acceptance: saved/dirty/saving/error/offline/conflict states reflect real outcomes and never show decorative success |
| C.23.14-02 | 2582 | - Autosave with debounce, retry/backoff, cancellation safety and dirty state reconciliation. | EDT-027–034, WEB-004–008, OPS-008, QA-002/004/006 | OPEN — Editor autosave owner; 1.0 recovery baseline; editor role required; depends on cancellation-safe debounce, retry/backoff and dirty-state reconciliation; acceptance: failed/cancelled requests cannot mark unsaved content saved or overwrite newer changes |
| C.23.14-03 | 2583 | - Manual save, save status, save/reload round-trip, recovery after refresh/tab close where safe. | EDT-027–034, WEB-004–008, OPS-009, QA-002/004/006 | OPEN — Editor save/recovery owner; 1.0 save/reload gate; editor role required; depends on canonical Page Model and recovery contract; acceptance: manual save, reload and safe local recovery preserve valid edits without storing secrets |
| C.23.14-04 | 2584 | - Preview draft, preview at viewport/breakpoint, preview as public visitor, protected preview token/route and noindex. | EDT-027–034, WEB-005/006, SEC-002, SEO-001–005 | OPEN — Preview owner; protected draft preview; editor role required and preview route/token protected; depends on revision pinning, auth and cache isolation; QA-002/003/004; acceptance: preview reflects selected draft/viewport, is noindex and cannot leak through public cache |
| C.23.14-05 | 2585 | - Publish/unpublish/republish, published snapshot, publish validation, changed-page summary and confirmation. | EDT-027–034, WEB-004–008, SEC-002, QA-002/003/006 | OPEN — Publish owner; 1.0 publish gate; explicit publish permission required; depends on validated revision, published snapshot and audit; acceptance: publish/unpublish is explicit, confirms impact and changes public snapshot only on successful operation |
| C.23.14-06 | 2586 | - Revision timeline, author/time/reason, diff/compare, restore/rollback, conflict handling and optimistic concurrency. | EDT-027–034, WEB-007/008, OPS-009, QA-002/006 | OPEN — Revision/recovery owner; full timeline/diff phased by persistence contract; editor role required, restore is a mutation; depends on immutable revisions and optimistic concurrency; acceptance: restore/compare/conflict identifies target revision and cannot silently overwrite newer work |
| C.23.14-07 | 2587 | - Recovery after API/network failure; avoid lost changes, duplicate commands or stale overwrite. | EDT-027–034, WEB-007/008, OPS-008/009, QA-002/006 | OPEN — Editor resilience owner; 1.0 network recovery gate; editor role required; depends on retry/idempotency and local recovery; acceptance: API/network failure does not lose changes, duplicate commands or overwrite stale revision |
| C.23.14-08 | 2588 | - Bulk publish only with explicit preview and permission; public renderer must never expose unpublished data. | EDT-027–034, WEB-004–008, SEC-002, QA-002/003/006 | OPEN — Bulk publishing owner; deferred until per-page publish/permission/preview contract passes; publish permission required; depends on impact preview and atomicity; acceptance: bulk publish cannot expose draft/private pages and reports per-page outcome |
| C.23.14-09 | 2589 | - Import/export/backup/restore schemas include versioning, validation, resource references, migration and rollback policy. | OPS-004–009, WEB-007/008, RES-001–015, SEC-002 | OPEN — Import/export/recovery owner; versioned packages phased by canonical schemas; export/import permission required; depends on migration and resource reference mapping; QA-002/003/006/007; acceptance: package version, ownership, validation, rollback and media references are explicit |
| C.23.14-10 | 2590 | - Save, preview, publish, revision and rollback use existing canonical persistence/command contracts, not separate Editor-specific persistence. | EDT-001–005, EDT-027–034, WEB-004–008 | OPEN — Editor architecture owner; invariant across all phases; editor permission required; depends on canonical command/persistence APIs; QA-002/004/006; acceptance: save/preview/publish/revision/rollback do not create Editor-specific parallel persistence |
| C.23.15-01 | 2594 | - Per-site/page SEO title, meta description, canonical URL, index/follow controls, robots rules, sitemap and robots.txt. | SEO-001–005, WEB-001–013, SEC-001–011 | OPEN — SEO owner; 1.0 per-page metadata baseline; site-edit permission required; depends on canonical route and published revision; QA-002/003/004; acceptance: title/description/canonical/index rules are correct for published pages and previews/drafts are noindex |
| C.23.15-02 | 2595 | - Open Graph/Twitter/social image preview, title/description, fallback image and per-page override. | SEO-001–005, WEB-031/032, RES-001–015 | OPEN — SEO/social preview owner; 1.0 Open Graph/social cards; site-edit permission required; depends on safe public media URL and metadata fallback; QA-002/003/004; acceptance: preview title/image/description match published page and external URL behavior is safe |
| C.23.15-03 | 2596 | - Structured data/schema where valid; canonical language/locale, hreflang where multilingual. | SEO-001–005, LOC-001–006, WEB-031/032 | OPEN — SEO/localization owner; structured data and hreflang only when valid locale/content contracts exist; site-edit permission required; depends on canonical locale routes and typed schemas; QA-002/003/004; acceptance: structured data matches visible content and locale alternates are not invented |
| C.23.15-04 | 2597 | - Heading structure, semantic landmarks, alt text, link purpose, descriptive labels and empty-alt handling. | WEB-031/032, QA-004/005, EDT-017/019 | OPEN — Accessibility owner; 1.0 semantic/alternative-text gate; editor role required for content authoring; depends on semantic element schema and renderer; QA-004/005; acceptance: headings/landmarks/alt/link purpose/labels are checked and public HTML remains semantic |
| C.23.15-05 | 2598 | - Redirect manager and broken-link/404 diagnostics; duplicate title/description and missing metadata reports. | SEO-001–005, WEB-001–013, SEC-001–011 | OPEN — SEO/routing owner; redirects and broken-link reports phased with preview/approval; privileged site-edit permission required; depends on route/redirect registry; QA-002/003/004; acceptance: redirect loops/conflicts and broken links are diagnosable and no redirect mutates without approval |
| C.23.15-06 | 2599 | - Public preview cards for social shares; validate image dimensions and external URL behavior. | SEO-001–005, WEB-031/032, RES-001–015 | OPEN — SEO/social preview owner; social card preview and image-dimension validation; site-edit permission required; depends on safe external URL handling and fallback media; QA-002/003/004; acceptance: preview accurately represents the public page and flags invalid images/URLs |
| C.23.15-07 | 2600 | - AEO/search discoverability metadata is additive and must not generate misleading structured data. | SEO-001–005, WEB-031/032, SEC-001–011 | OPEN — SEO owner; AEO/discoverability additive only; site-edit permission required; depends on visible content and validated structured metadata; QA-002/003/004; acceptance: generated metadata is truthful and never fabricates claims/schema |
| C.23.15-08 | 2601 | - SEO panel distinguishes warning from blocking error and reports the exact affected page/element. | SEO-001–005, EDT-021/022, QA-002/004 | OPEN — SEO panel owner; 1.0 warning/error distinction; editor role required; depends on per-page diagnostics and source links; acceptance: each issue names affected page/element and clearly distinguishes advisory warning from publish-blocking error |
| C.23.16-01 | 2605 | - Keyboard-only editor operation; visible focus; screen-reader labels; focus trap/return in modal UI. | EDT-037/039, QA-004/005 | OPEN — Accessibility owner; keyboard-only Editor and focus management gate; editor role required; depends on semantic controls and focus model; acceptance: modal focus trap/return, visible focus and screen-reader labels are tested |
| C.23.16-02 | 2606 | - Public semantic HTML, heading hierarchy, alt/caption/transcript, contrast checks, reduced motion and responsive zoom. | WEB-031/032, RES-007/013, DSN-001–007, QA-004/005 | OPEN — Accessibility owner; public semantic output and responsive zoom gate; editor role required to author metadata; depends on renderer and design tokens; acceptance: heading hierarchy, alternatives, captions/transcripts, contrast and reduced-motion are tested |
| C.23.16-03 | 2607 | - Forms have labels, instructions, error summary, validation announcements and accessible success state. | WEB-020, EDT-019, SEC-007/011, QA-003/004/006 | OPEN — Forms + Accessibility owner; forms enabled only with canonical submit/validation contract; editor role required to configure; depends on server validation and accessible announcements; acceptance: labels/instructions/error summary/success state are announced and server validation is authoritative |
| C.23.16-04 | 2608 | - Embed/iframe allowlist, sandbox and permissions policy; CSP/URL validation; no arbitrary script execution in Editor. | SEC-001–011, WEB-032, RES-001–015 | OPEN — Security owner; embed/upload security gate; editor role does not grant script execution; depends on allowlists, SVG sanitization, CSP and URL validation; QA-003/008; acceptance: arbitrary scripts are blocked and embeds use reviewed sandbox/permissions policy |
| C.23.16-05 | 2609 | - External links, uploads, SVG, custom CSS and custom attributes require validation and safe output encoding. | SEC-001–011, RES-001–015, WEB-032 | OPEN — Security owner; safe external links/uploads/custom attributes; editor role required for configuration but output is untrusted; depends on validation and output encoding; QA-003/008; acceptance: malicious URLs, files, SVG and attribute injection are rejected or safely encoded |
| C.23.16-06 | 2610 | - Consent/privacy controls for analytics, embeds, cookies and future marketing integrations; no secrets in Page Model/client output. | SEC-001–011, OPS-005, QA-003/008 | OPEN — Privacy/security owner; consent-aware analytics/embeds/cookies and future marketing; privileged integration configuration required; depends on consent and secret-handling policy; acceptance: no secrets enter Page Model/client output and optional tracking respects consent |
| C.23.16-07 | 2611 | - Role/permission checks server-side for editing, publishing, resource access and global changes. | SEC-001–011, QA-003/008, EDT-027–034 | OPEN — Authorization owner; server-side permission gate for editing/publishing/resources/global changes; role/site/resource scope required; depends on server-side authorization for every mutation; acceptance: direct API calls cannot bypass UI permissions or cross-site ownership |
| C.23.16-08 | 2612 | - Every destructive/global mutation has confirmation as needed, audit evidence and recovery path. | SEC-001–011, OPS-005/009, QA-003/006 | OPEN — Destructive action owner; confirmation/audit/recovery gate; privileged role required; depends on impact preview, audit and rollback; acceptance: destructive/global mutations require appropriate confirmation and have recoverable/auditable outcomes |
| C.23.16-09 | 2613 | - Accessibility/security findings are testable; no compliance claim without automated plus manual evidence. | SEC-001–011, QA-003/004/005/008 | OPEN — Security/accessibility verification owner; no compliance claim without evidence; depends on automated plus manual review; acceptance: findings are testable, evidence is retained and unresolved limitations are explicit |
| C.23.17-01 | 2617 | - Resizable/collapsible side panels, left/right panel state, canvas workspace, fullscreen/focus mode. | EDT-007/009, EDT-035/037, QA-002/004/005 | OPEN — Editor workspace owner; panel/workspace behavior phased by responsive acceptance; editor role required; depends on stable viewport/panel state; acceptance: resize/collapse/fullscreen/focus mode preserve reachable canvas and selected node |
| C.23.17-02 | 2618 | - Quick Add, searchable command palette, keyboard shortcut map, shortcut conflict handling. | EDT-015, EDT-037/039, QA-002/004/005 | OPEN — Quick Add/Command owner; searchable add and keyboard shortcuts phased by action registry; editor role required; depends on canonical action handlers and conflict detection; acceptance: palette actions resolve to one handler and shortcut conflicts are discoverable |
| C.23.17-03 | 2619 | - Selection breadcrumb, recent nodes, favorites, recent assets/templates and contextual actions. | EDT-012–016, EDT-015, DSN-008–018 | OPEN — Editor navigation owner; breadcrumbs/recent/favorites phased by stable IDs; editor role required; depends on node/resource/template registries; acceptance: contextual actions resolve to current valid items and do not mutate document just by browsing |
| C.23.17-04 | 2620 | - Inspector pinning/favorites, property search, panel state persistence per user. | EDT-021–024, QA-002/004 | OPEN — Inspector UX owner; favorites/search/panel preference phased; editor role required; depends on property metadata and user preference storage; acceptance: preference state is per user and never serialized into site Page Model |
| C.23.17-05 | 2621 | - Inline text editing with clear exit/commit/cancel behavior and no accidental selection loss. | EDT-003–006, EDT-017/022, QA-002/004 | OPEN — Inline text editing owner; 1.0 text interaction gate; editor role required; depends on text command/selection model; acceptance: commit/cancel/exit are explicit and preserve selection and undo semantics |
| C.23.17-06 | 2622 | - Empty-state onboarding, contextual help, non-blocking diagnostics, actionable error messages. | EDT-037/039, QA-002/004/005 | OPEN — Editor onboarding owner; 1.0 usability baseline; editor role required; depends on error/state registry and help content; acceptance: empty states guide next action and errors offer safe recovery rather than dead ends |
| C.23.17-07 | 2623 | - Editor preferences are separate from site content: zoom, panel layout, grid visibility and default viewport. | EDT-007, EDT-035/037, QA-002/004 | OPEN — Editor preferences owner; preferences separate from site content; authenticated user required; depends on preference schema; acceptance: zoom/panel/grid/default viewport settings do not dirty or change the site Page Model |
| C.23.17-08 | 2624 | - Tablet/touch support is separately acceptance-tested; tablet login remains a separate deferred item and is not silently conflated with Editor touch UX. | EDT-035–037, QA-004/005, SEC-001–011 | OPEN — Tablet/touch acceptance owner; deferred tablet login remains a separate issue; editor role required; depends on real tablet/browser test matrix; acceptance: touch Editor behavior is tested independently from login/auth defects |
| C.23.17-09 | 2625 | - Localization-ready editor strings and accessible error/status announcements. | LOC-001–006, EDT-037, WEB-032, QA-004/005 | OPEN — Localization/accessibility owner; Hungarian-first with localization-ready strings; editor role required; depends on message catalog and accessible announcement contract; acceptance: strings are not hardcoded in control logic and status/error announcements are accessible |
| C.23.18-01 | 2629 | - Twitch: connection status, live/offline, title/game/channel link, permitted live/player/embed, schedule binding, error/stale state and safe disconnect/reconnect UX. | INT-001–012 (including INT-004 token lifecycle, INT-005 site ownership, INT-006 scope/permission visibility, INT-007 disconnect/reconnect), LIV-001–007, SCH-007–011, SEC-002/004/008 | OPEN — Twitch integration block owner; 1.0 Twitch baseline only for verified scopes; editor role required to configure and provider scope applies; depends on canonical adapter and freshness/error states; QA-002/003/004/008; acceptance: status/data is real, stale/offline is explicit and disconnect/reconnect is safe |
| C.23.18-02 | 2630 | - YouTube/TikTok/Discord: 1.0 static link/basic embed only where explicitly scoped; API-backed integrations remain in their roadmap phases. | WEB-022 Link Hub, COM-001 external community links, INT-013–016 API-backed adapters only in their gated phases, SEC-002/005 | OPEN — Other platform block owner; 1.0 static links/basic embeds only where approved; API-backed features remain phased; acceptance: no unsupported provider API capability is represented as connected/live |
| C.23.18-03 | 2631 | - Schedule: domain-owned events, timezone, start/end, recurrence where approved, status, platform, game, artwork, URL, filters, views and sync provenance; no Page Model duplicate schedule records. | SCH-001–015, DYN-001–008, EDT-020, SEC-002 | OPEN — Schedule block owner; domain-owned schedule only; editor role required for presentation config, schedule mutation uses Schedule module; QA-002/003/004; acceptance: block reads canonical events and never creates duplicate schedule rows |
| C.23.18-04 | 2632 | - Stream content: VOD/clip/Short/highlight link/embed baseline; canonical media workflows in their planned phase. | CNT-001–020, RES-001–015, WEB-017/032, SEC-002 | OPEN — Stream content block owner; VOD/clip/Short features phased by content/resource contract; editor role required; acceptance: links/embeds use canonical content/resource references and unavailable providers degrade honestly |
| C.23.18-05 | 2633 | - Creator profile/game profiles, social links, community invite, support/funding/press kit blocks. | SET-001–003, SCH-012–014, WEB-018–024, COM-001–018, SUP-001–012 | OPEN — Creator profile block owner; profile/game/social/community/support/press data are configurable and phase-gated; editor role required; acceptance: no hardcoded personal target, provider secret or fake payment status is exposed |
| C.23.18-06 | 2634 | - Future overlay/widget/alert/OBS browser-source blocks use a separate Stream Studio contract, not arbitrary Editor nodes that bypass it. | OBS-001–010, SEC-001–011, OPS-005 | OPEN — Stream Studio boundary owner; overlays/alerts/OBS blocks future-gated; stream-studio capability required; acceptance: public Editor nodes cannot bypass dedicated OBS/overlay security and runtime contract |
| C.23.18-07 | 2635 | - Integration block exposes connection/permission/availability states; secrets and tokens never become editable public properties. | INT-001–021, SEC-001–011, EDT-021/022 | OPEN — Integration block owner; expose safe connection/capability state only; editor role required to configure; acceptance: tokens/secrets are not editable properties or public output |
| C.23.18-08 | 2636 | - Every provider block uses the canonical integration adapter and consistent loading/empty/error/offline handling. | INT-001–021, DYN-005/006, QA-002/003/004 | OPEN — Integration adapter owner; canonical adapters and common error states; provider scopes required; acceptance: every provider block has consistent loading/empty/error/offline/stale behavior |
| C.23.19-01 | 2640 | - Find/replace content with preview and undo; page/node/resource search; usage/reference search. | EDT-015/037/039, RES-001–015, WEB-001–013 | OPEN — Search/find-replace owner; site-scoped search and preview/undo; editor role required; depends on canonical page/node/resource index; QA-002/003/004; acceptance: find/replace preview lists exact changes and undo restores prior content |
| C.23.19-02 | 2641 | - Bulk apply style/token/preset to selected compatible nodes, with mixed-state handling and change summary. | EDT-005/006, EDT-021/022, DSN-001–018 | OPEN — Bulk style operation owner; compatible selection and mixed-state model required; editor role required; acceptance: bulk apply reports change summary, ignores incompatible nodes safely and is undoable |
| C.23.19-03 | 2642 | - Find broken links, missing images, orphaned assets, duplicate IDs/slugs, missing alt text and unsupported bindings. | RES-001–015, WEB-001–013, SEO-001–005, EDT-001/002, DYN-001–008 | OPEN — Site health diagnostics owner; read permission required; depends on route/resource/binding validation; QA-002/003/004; acceptance: broken links, missing assets, duplicate IDs/slugs, missing alt and unsupported bindings are reported accurately |
| C.23.19-04 | 2643 | - Site health panel for unpublished changes, broken bindings, missing required fields, page-level warnings and failed integrations. | WEB-001–013, DYN-001–008, INT-001–021, OPS-001–010 | OPEN — Site health panel owner; admin/read scopes required; depends on publication, binding and integration status sources; acceptance: warnings point to affected page and do not fabricate system health |
| C.23.19-05 | 2644 | - Bulk archive/restore/delete/publish only with permission, impact preview and recoverability. | EDT-005/032, WEB-001–013, RES-001–015, SEC-001–011 | OPEN — Bulk lifecycle owner; privileged role required; depends on impact preview, confirmation, audit and restore; QA-002/003/006; acceptance: bulk archive/restore/delete/publish is permission-checked and recoverable |
| C.23.19-06 | 2645 | - Global change impact map: pages, shared components, templates, tokens and presets affected. | DSN-003/004, DSN-008–018, RES-001–015, WEB-001–013 | OPEN — Global change impact owner; global edit permission required; depends on usage/reference map; acceptance: impact map identifies affected pages/components/templates/tokens before mutation |
| C.23.19-07 | 2646 | - Page compare, revision compare, template diff and resource replacement impact preview. | WEB-007/008, DSN-008–018, RES-001–015, EDT-001/002 | OPEN — Compare/diff owner; editor role required; depends on immutable revisions and template/resource diff contract; acceptance: comparison is read-only and clearly identifies changed references and rollback target |
| C.23.19-08 | 2647 | - Search and command operations are site-scoped and permission-aware. | SEC-001–011, WEB-001–013, RES-001–015, DYN-001–008 | OPEN — Site-scoped command owner; server-side site/role/resource checks required; depends on scoped search and command APIs; QA-003/008; acceptance: cross-site query or command attempts are denied |
| C.23.20-01 | 2651 | - Canonical extension points: component schema/renderer, property registry, command API, resource type registry, template registry, integration adapter and diagnostics. | EDT-001–042, DSN-001–018, RES-001–015, INT-001–021, OPS-001–010 | OPEN — Extension architecture owner; registry boundaries invariant; architecture approval required; depends on canonical component/property/command/resource/template/integration/diagnostic registries; QA-002/003/004; acceptance: each extension point has one canonical owner and no parallel store |
| C.23.20-02 | 2652 | - Future custom CSS, HTML/embed and third-party component support only through reviewed, sandboxed, permissioned contracts. | SEC-001–011, WEB-032, OPS-005, QA-003/008 | OPEN — Custom extension security owner; future sandboxed scope only; admin/editor role does not authorize arbitrary HTML/script; depends on review, CSP, sandbox and capability policy; acceptance: custom CSS/HTML/embed/extensions are unavailable until safe contracts exist |
| C.23.20-03 | 2653 | - No direct client mutation of D1/R2 and no arbitrary privileged JavaScript. | SEC-001–011, RES-001–015, OPS-005, QA-003/008 | OPEN — Data boundary owner; invariant across all phases; client cannot mutate D1/R2 or execute privileged JS; acceptance: all writes traverse authorized server-side domain APIs and unsafe scripts are blocked |
| C.23.20-04 | 2654 | - AI may propose edits to Page Model/commands, generate content, map responsive layouts or suggest presets, but must use shared Action API. | AI-001–020, EDT-001–042, SEC-001–011 | OPEN — AI Action API owner; future AI features only through canonical command/action API; permission and schema validation required; depends on preview/diff/approval/audit; QA-002/003/008; acceptance: AI never writes database or arbitrary HTML directly |
| C.23.20-05 | 2655 | - AI changes require preview-before-apply, diff, validation, explicit approval where destructive/global, undo and audit. | AI-001–020, EDT-005/032, SEC-001–011, OPS-005 | OPEN — AI safety owner; preview-before-apply gate; editor role plus explicit approval for destructive/global changes; depends on diff, validation, undo and audit; acceptance: AI cannot silently publish or mutate global/security settings |
| C.23.20-06 | 2656 | - AI must not silently publish, change auth/secrets, overwrite user content or execute arbitrary external code. | AI-001–020, SEC-001–011, OPS-005 | OPEN — AI permission owner; hard safety invariant; AI cannot publish, alter auth/secrets, overwrite content or run arbitrary code without authorized reviewed path; acceptance: permission, approval and audit checks are server-enforced |
| C.23.20-07 | 2657 | - Future marketplace/shared libraries require license/source metadata, compatibility/version constraints, dependency inventory, safe import, sandbox and rollback. | MKT-001, MKT-002 install/update/uninstall/migration, MKT-003 marketplace, MKT-004 license/attribution/version/review, DSN-008–018, RES-001–015, SEC-002/005/008, OPS-004/005/009 | OPEN — Marketplace/library owner; future scope only; license/compatibility and sandbox policy required; acceptance: third-party assets/templates/extensions include provenance, dependency checks and rollback |
| C.23.20-08 | 2658 | - Export/import packages need schema version, dependency manifest, media references and validation before applying. | OPS-004–009, RES-001–015, DSN-008–018, SEC-001–011 | OPEN — Package import/export owner; schema/dependency/media manifest required; import permission required; QA-002/003/006/007; acceptance: package is validated before apply and failed imports do not partially mutate site |
| C.23.21-01 | 2663 | - unit tests for pure layout/geometry/preset/schema helpers; | QA-001–008, EDT-001–042 | OPEN — QA owner; pure helper unit tests release gate; no special product permission; depends on deterministic fixtures; acceptance: layout/geometry/preset/schema helpers have repeatable unit tests |
| C.23.21-02 | 2664 | - command/history/undo/redo and Page Model round-trip tests; | QA-001–008, EDT-003–007, EDT-027–034 | OPEN — QA + Editor command owner; command/history round-trip gate; depends on canonical command and Page Model; acceptance: undo/redo and persisted Page Model round-trip tests cover exact state restoration |
| C.23.21-03 | 2665 | - property validation, invalid nesting and malformed import tests; | QA-001–008, EDT-021/022, EDT-001/002, OPS-004–006 | OPEN — QA + validation owner; malformed input release gate; acceptance: invalid property, nesting and import fixtures are rejected without partial mutation |
| C.23.21-04 | 2666 | - breakpoint inheritance/override/reset tests; | QA-001–008, EDT-023–026, DSN-006 | OPEN — QA + Responsive owner; breakpoint inheritance tests; acceptance: set/reset/inherit tests prove child override does not mutate parent breakpoint |
| C.23.21-05 | 2667 | - canvas geometry tests at zoom levels, long pages, negative/large Y movement and content growth; | QA-001–008, EDT-007–010, EDT-027/030/042 | OPEN — QA + Canvas owner; geometry regression gate; acceptance: zoom, long page, negative/large Y and content growth do not clip canvas or corrupt persisted geometry |
| C.23.21-06 | 2668 | - preset apply/merge/replace/reset/fork/undo and shared-instance impact tests; | QA-001–008, EDT-005/006, DSN-008–018 | OPEN — QA + Preset owner; preset lifecycle gate; acceptance: apply/merge/replace/reset/fork/undo and shared-instance effects are tested |
| C.23.21-07 | 2669 | - component/template/token migration and broken-reference tests; | QA-001–008, DSN-001–018, RES-001–015, OPS-004–006 | OPEN — QA + migration owner; migration/reference gate; acceptance: component/template/token migrations preserve IDs and reject broken references safely |
| C.23.21-08 | 2670 | - save/reload, revision conflict, publish isolation and rollback tests; | QA-001–008, EDT-027–034, WEB-004–008 | OPEN — QA + persistence owner; save/publish gate; acceptance: save/reload, revision conflict, publish isolation and rollback tests pass |
| C.23.21-09 | 2671 | - keyboard/touch/browser accessibility tests; | QA-001–008, EDT-035–037, WEB-032 | OPEN — QA + accessibility owner; keyboard/touch/browser gate; acceptance: supported browser, touch, focus and keyboard behavior are tested on real viewports |
| C.23.21-10 | 2672 | - public renderer, SEO, performance, reduced-motion and privacy tests; | QA-001–008, WEB-031/032, SEO-001–005, SEC-001–011, OPS-008 | OPEN — QA + public renderer owner; public quality gate; acceptance: renderer, SEO, performance, reduced-motion and privacy checks are recorded |
| C.23.21-11 | 2673 | - production runtime acceptance for any behavior whose correctness cannot be established by unit tests alone. | QA-001–008, OPS-001–010, SEC-001–011 | OPEN — Runtime acceptance owner; production runtime evidence required where unit tests are insufficient; acceptance: exact commit, environment, steps and observed result are recorded without inferring PASS |
| C.23.22-01 | 2679 | - **Canvas drag/resize acceptance:** the user has confirmed that the canvas now behaves correctly; the previous canvas-height defect is no longer the active blocker. Preserve the merged implementation and regression tests. The active continuation is Layers/Inspector/responsive integration. Do not start a parallel feature branch/workstream from this appendix. | EDT-003/004, EDT-007–010, QA-002/004/005 | OPEN — Canvas acceptance evidence; user-confirmed behavior is historical evidence, not a substitute for current regression tests; preserve implementation and tests; active implementation remains frozen during P0 audit |
| C.23.22-02 | 2680 | - The immediate F0.4 continuation is Layers + Inspector + responsive behavior using the existing Page Model, command/history/validation and property registry. | EDT-001–042, DSN-001–018, QA-002/004/005 | OPEN — Historical continuation note only; F0.4 is superseded by P0 audit state; retain Layers/Inspector/responsive requirement without reopening old active-point ordering |
| C.23.22-03 | 2681 | - Foundational Editor interactions and the smallest useful set of element types are implemented before expanding the full component catalog. | EDT-001–042, QA-002/004 | OPEN — Product sequencing rule; foundational Editor behavior precedes catalog expansion; no implementation until audit gates close; acceptance: enabled element types are bounded by verified schema/renderer support |
| C.23.22-04 | 2682 | - Presets, tokens, templates and reusable components must be architecturally reserved now, but are implemented only when their canonical registries/contracts and dependency order are ready. | DSN-001–018, RES-001–015, EDT-001–042 | OPEN — Architecture reservation; presets/tokens/templates/reusable components stay planned until canonical registries and dependencies pass; no duplicate stores |
| C.23.22-05 | 2683 | - 1.0 vs. 1.x+ assignment follows 00.9.6.D and the current product scope. A capability omitted from 1.0 remains explicitly planned; it is not deleted. | LOC-001–006, WEB-001–032, §39.2 | OPEN — Historical phase-allocation rule; reconcile 00.9.6.D before final 1.0 assignment; no capability is deleted because it is deferred |
| C.23.22-06 | 2684 | - Do not build every advanced feature before the basic editor is reliable. Prefer a complete, testable capability inventory and a single dependency-ordered implementation path over rushed parallel work. | EDT-001–042, QA-001–008 | OPEN — Dependency-order rule; finish the complete testable inventory and a single sequential path before feature expansion |
| C.23.22-07 | 2685 | - This appendix adds no second editor, no second Page Model, no second Property Registry, no second Resource store, no second Schedule domain and no alternate save/publish route. | EDT-001–042, DSN-001–018, RES-001–015, SCH-001–015, WEB-001–032 | OPEN — Architecture invariant; no second Editor/Page Model/Property Registry/Resource store/Schedule domain/save-publish route |

#### F.1–F.13 — minden belső bullet

| Source key | Archive line | Exact source bullet | Canonical feature mapping | Decision / owner / phase / permission / dependency / tests / acceptance |
|---|---:|---|---|---|
| ARCH-3316 | 3316 | - Immutábilis history, legfeljebb 50 lépéses FIFO stack; az 51. lépésnél a legrégebbi bejegyzés kiesik. | EDT-005, EDT-006 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3317 | 3317 | - Egy felhasználói szándék egy history transaction. Gépelés 800 ms inaktivitás után vagy blur-nél egyetlen history entry. | EDT-005, EDT-006, EDT-007 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3318 | 3318 | - Slider/drag transaction a pointer down és pointer up között egy bejegyzés; add/delete/move/reparent/duplicate művelet önálló transaction. | EDT-005–EDT-007 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3319 | 3319 | - Programozott, preset- és batch-változtatás explicit transaction boundary-t kap. Félbemaradt transaction nem kerülhet a historyba. Undo/redo nem hozhat létre önmagára mutató entry-t. | EDT-005–EDT-007, QA-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3320 | 3320 | - Undo/redo a canonical command/state modellre épül, nem DOM-pillanatképre; a canvas, Layers, Inspector és a mentett modell konzisztens marad. | EDT-003–EDT-007, EDT-027–EDT-030 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3323 | 3323 | - Debounced háttérmentés 2000 ms után az aktív draftba; az explicit Save Draft azonnal elérhető. Csak validált Page Model menthető. | EDT-022, EDT-027, EDT-028, WEB-004 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3324 | 3324 | - Local crash recovery helyreállítási példányt készíthet a nem mentett állapotból, de nem helyettesíti a szerveroldali draftot, és nem tárolhat tokent vagy secretet. Konfliktusnál a felhasználó választhat helyreállítás, szerververzió vagy elvetés között. | EDT-030, WEB-007, WEB-008, OPS-009, SEC-008 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3325 | 3325 | - Expected-version/optimistic concurrency; stale draft vagy párhuzamos szerkesztés nem írhatja felül csendben a frissebb revíziót. | EDT-027–EDT-034, WEB-008, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3326 | 3326 | - Navigáció/refresh előtt unsaved-changes figyelmeztetés; mentési hiba, retry és visszaállítás valós legyen, ne dekoratív UI. | EDT-027–EDT-034, WEB-008, OPS-003 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3327 | 3327 | - A history és autosave működését nagyobb Page Modellel is tesztelni kell; a számok nem indokolatlanul növelhetik a memória- vagy hálózati terhelést. | EDT-005–EDT-007, EDT-027–EDT-034, OPS-008, QA-002/004/006 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3331 | 3331 | - A canonical útvonal: Domain API/service → deklarált Data Source → schema-validált binding → engedélyezett transform → conditional rendering → renderer. | DYN-001–008, WEB-032, EDT-018/020 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3332 | 3332 | - Támogatott források fázisonként: site settings, Schedule query, hitelesített Twitch/live state, elérhető YouTube/TikTok-content, VOD/clip/content collections, később Store/Community/Membership/Analytics. Minden platformnál csak a hivatalosan elérhető és az adott kapcsolat scope-jával engedélyezett képesség használható. | DYN-001, INT-001, INT-013–INT-016, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3333 | 3333 | - Query/filter/sort/limit beállítás csak deklarált schema szerint menthető. Arbitrary SQL, tetszőleges URL fetch, titkos API-kulcs vagy korlátlan JavaScript binding nem megengedett. | DYN-002–DYN-004, SEC-002, SEC-006, SEC-007 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3334 | 3334 | - Külön loading, empty, error, stale-data és partial-provider-failure állapot kell; a hiba nem jeleníthet meg raw stack trace-t, DB mezőnevet, tokent vagy titkot. | DYN-005, DYN-006, OPS-003, SEC-008 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3335 | 3335 | - Conditional visibility hiteles állapot alapján működhet, de nem kerülheti meg az authorizationt. A cache élettartam és invalidation publishhoz, Schedule-módosításhoz és integration synchez legyen kötve. | DYN-004, DYN-006, DYN-007, WEB-030, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3336 | 3336 | - A dinamikus blokk csak a saját megjelenési konfigurációját mentheti az Editorban; például a Schedule blokk layoutja nem írhatja át a Schedule domainrekordjait. | EDT-018, SCH-001–SCH-015, DYN-001, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3341 | 3341 | - Box igazítás: Balra, Középre, Jobbra, Teljes szélesség. | EDT-009–EDT-016, EDT-022 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3342 | 3342 | - Szövegigazítás: Balra, Középre, Jobbra, Sorkizárt. | EDT-009–EDT-016, EDT-022 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3343 | 3343 | - Belső elrendezés: Egymás alatt, Egymás mellett, 2 oszlop, 3 oszlop, Grid. | EDT-009–EDT-016, EDT-022 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3344 | 3344 | - Függőleges igazítás: Felül, Középen, Alul. | EDT-009–EDT-016, EDT-022 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3345 | 3345 | - Méret: Automatikus, 25%, 50%, 75%, 100%, továbbá egyedi mértékegységes érték. | EDT-009–EDT-016, EDT-022 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3346 | 3346 | - Térköz: függőleges és vízszintes Spacer külön; gap, padding és margin külön értékként és ahol indokolt oldalanként. A vízszintes térköz módosítása nem írhatja felül a függőlegest. | EDT-009–EDT-016, EDT-022 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3347 | 3347 | - Méretezésnél szélesség/magasság, min/max, arány, overflow, wrap, order és reszponzív override csak az adott layout mód által megengedett módon működhet. | EDT-009–EDT-016, EDT-022, QA-004 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3348 | 3348 | - Az elem kiválasztása canvasról és Layers fából azonos canonical state-re mutasson. Drag/resize nem alakíthatja át véletlenül a flex/grid elrendezést abszolút pozicionálássá. | EDT-003–EDT-007, EDT-022, EDT-027–EDT-030 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3349 | 3349 | - A 1.0 stabil alapeleme a plain Text. Az összetett Rich Text szerkesztő külön, tesztelt scope; a régi döntés szerint ne legyen új, párhuzamos rich-text irány, amely elhalasztja az alapszerkesztő lezárását. | EDT-001–EDT-003, EDT-017, EDT-019, QA-002/004 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3353 | 3353 | - Publikus oldaltípusok: Home/Creator-home, Stream/Live, Schedule, VOD/Video Hub, Clips/Shorts, About/Creator, Community, Contact, Support, Link Hub és Sponsor/Press Kit. Store, Membership, Events, Blog/News és Digital Products a fázisroadmap szerint kapcsolódik be. | WEB-001–032, SCH-001–015, INT-001–021, RES-001–016, CNT-001–020, COM-001–018, SUP-001–012, STO-001–020, CAM-001–009 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3354 | 3354 | - Creator-home: live/offline, játék/kategória, nézőszám és follower/subscriber érték csak hiteles adat és megfelelő jogosultság esetén; következő adás/countdown; kiemelt és legutóbbi VOD/clip/video; social links; community/Discord; support/tip; későbbi merch; e-mail feliratkozás; kampány/esemény. | WEB-001–032, SCH-001–015, INT-001–021, RES-001–016, CNT-001–020, COM-001–018, SUP-001–012, CAM-001–009 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3355 | 3355 | - Stream oldal: player/embed, stream állapot, cím/kategória, adás kezdete, következő adás, opcionális, biztonságos chat embed, support és közösségi linkek. | WEB-001–032, INT-001–021, LIV-001–007, SUP-001–012, COM-001–018, SEC-005 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3356 | 3356 | - VOD/Content Hub: VOD, highlight, clip, Shorts, YouTube/TikTok videók; kategóriák/tagek, keresés/szűrés, playlist és kapcsolódó tartalom. Ha automatikus platformadat nem hozzáférhető, legyen egyértelmű fallback/kézi link/import út. | CNT-001–CNT-020, INT-001–INT-021, RES-001–RES-016, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3357 | 3357 | - About/Creator: bemutatkozás, játékok, karrier, setup, FAQ, sponsor/partner és média-kit; Link Hub: platform/social linkek, fő CTA-k, Schedule, tartalom, Discord, merch/support, kampányok és email capture; későbbi smart redirect és link analytics a privacy policy szerint. | WEB-001–032, CAM-001–009, INT-001–021, SEO-001–005, COM-001–018, SUP-001–012, CNT-001–020 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3358 | 3358 | - Interakciók 1.0 alapja: click, hover, focus, active, submit, scroll, load, timer, open/close, navigation, show/hide és toggle — csak validált, hozzáférhető actionökkel. State machine, advanced transitions, animation timeline és keyframes későbbi, külön scope-olt funkció. | EDT-039/040, EDT-021/022, WEB-031, SEC-005 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3359 | 3359 | - Animation/interactions esetén reduced-motion, keyboard/focus, érvényes link/action, teljesítménykorlát és publikus renderer-teszt kötelező. | EDT-039/040, WEB-031–032, QA-004/005 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3363 | 3363 | - Content Manager kezelje az ötletet, draftot, scriptet, címet, leírást, tageket/hashtageket, thumbnail briefet, platformot, publikálási időt, státuszt, kampánykapcsolatot és jóváhagyást. | CNT-001–CNT-020, CAM-001–CAM-009, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3364 | 3364 | - VOD ingestion/import, VOD kategorizálás, clip/Short menedzsment, content calendar, platformonként eltérő title/description/thumbnail/tag, publishing queue, külső ID és duplikációvédelem szerepeljen a későbbi Content Factory-ban. | CNT-001–CNT-020, INT-001–INT-021, SCH-001–SCH-015, RES-001–RES-016 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3365 | 3365 | - Twitch: OAuth/connection, live/offline, title/game/category, viewer/follower/subscriber statisztikák csak ahol az API és scope engedi, VOD, clips, webhook/event, sync state és hibadiagnosztika. | INT-001–021, LIV-001–007, SEC-004, SEC-009 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3366 | 3366 | - YouTube: channel, video, Shorts, rendelkezésre álló analytics; quota limit, API hiba, hiányzó scope és fallback. | INT-001–INT-021, CNT-001–CNT-020, ANL-001–ANL-010 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3367 | 3367 | - TikTok: profile/content csak a hivatalosan és adott accountnál rendelkezésre álló API-képesség szerint; rate limit/fallback és kézi link/import. | INT-001–INT-021, CNT-001–CNT-020, SEC-007 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3368 | 3368 | - Discord alapként közösségi link; bot/role/status funkció csak külön integrációs scope-pal. Kick, OBS, e-mail, payment és commerce adapterek saját contractot kapnak. | INT-001–INT-021, SUP-001–SUP-012, STO-001–STO-020, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3369 | 3369 | - A provider-adatot canonical domain state-re kell normalizálni; egy külső API kiesése nem teheti használhatatlanná az oldalt. Hiányzó statisztikát nem szabad kitalált számmal pótolni. | INT-001–INT-021, DYN-001–DYN-008, OPS-003, QA-002/003/008 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3373 | 3373 | - Canonical Schedule item mezői: title, description, start/end, timezone, platform, game/category, artwork, stream link, visibility, featured, lifecycle status, recurrence, manual override és external ID. | SCH-001–SCH-015, RES-001–RES-016, SET-001–SET-003 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3374 | 3374 | - List/calendar/upcoming/past nézetek, keresés, szűrés és rendezés; cancelled/postponed/completed/live/planned állapotok. | SCH-001–SCH-015, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3375 | 3375 | - DST/időzóna helyes kezelése; recurrence szerkesztése csak esemény / ettől a jövőben / teljes sorozat scope szerint, amennyiben ez a funkció támogatott. | SCH-001–SCH-015, LOC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3376 | 3376 | - Next-stream és countdown a canonical schedule, site timezone és hiteles live state alapján számoljon; lemondott vagy múltbeli esemény ne maradjon hibásan következő adásként. | SCH-001–SCH-015, INT-001–INT-021, DYN-006 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3377 | 3377 | - VOD/clip/Short összekapcsolható legyen az adott adással, kategorizálható legyen és bekerülhessen a content calendarba. Editorban a Schedule blokk megjelenítése konfigurálható, de a Schedule domainadat nem. | SCH-001–SCH-015, CNT-001–CNT-020, RES-001–RES-016 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3381 | 3381 | - Az Admin shellből mindig elérhető az Admin főoldal, az aktuális modul/breadcrumb, a publikus oldal megnyitása, profil/session állapot, logout, help és értesítések. Mobilon külön responsive shell kell. | ADM-001–ADM-010, WEB-001–WEB-032, SEC-001 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3382 | 3382 | - Minden modulban loading/empty/error/success/disabled state, save/unsaved state, inline validation, veszélyes művelethez confirm, keresés/filter/sort/pagination és indokolt tömeges műveletek legyenek; billentyűzetes működés és egyértelmű magyar UI-szöveg az 1.0-ban. | ADM-001–ADM-010, EDT-020–EDT-022, QA-004 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3383 | 3383 | - Lejárt session kezelése szerveroldali policy szerint: logout/session invalidation, inactivity timeout, több tab és nem mentett változtatás figyelmeztetése; admin/API jogosultság nélkül nem használható. | SEC-001–SEC-004, SEC-007, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3384 | 3384 | - Public form: field schema, required/optional, labels, kliens- és szervervalidáció, spam/rate-limit védelem, success/error state és privacy notice. | WEB-001–WEB-032, SEC-005–SEC-007, SEC-011 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3385 | 3385 | - Store Manager: termék create/edit/duplicate/archive, variáns/SKU/ár/pénznem/kategória/collection/SEO/stock abstraction, order/payment/fulfillment status, refund/cancel/tracking és provider error. A storefront csak canonical product/collection adatot renderel. | STO-001–STO-020, WEB-001–WEB-032, SEO-001–SEO-005, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3386 | 3386 | - Fizikai merch, digitális termék, bundle, preorder, limited drop, kupon/gift card, order/customer és invoice/shipping/tax funkciók a megfelelő későbbi commerce fázisban; a teljes saját checkout nem automatikus 1.0 scope. | STO-001–STO-020, SUP-001–SUP-012, SEC-011 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3390 | 3390 | - Web analytics: page views, sessions, device/referrer, CTA/button/social click és konverzió csak consent/privacy szabály szerint; content/stream/commerce/community metric kizárólag valós, hiteles adatokból. | ANL-001–ANL-009, CAM-002, SEC-011 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3391 | 3391 | - Metricsnél forrás, időszak, frissesség, hiányzó érték, API limit és retention legyen jelölve; export és role-based access. Anomaly detection későbbi fázis. | ANL-007–ANL-009, SEC-002, SEC-011 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3392 | 3392 | - Automation lifecycle: event/schedule → trigger → condition → action → result → verify → audit. Típusok: scheduled, event, content, media, stream, notification. Delay/retry/idempotency/rate limit/dead-letter/failure state, enable/disable, version és per-site rules. |AUT-001–AUT-014, SEC-002, OPS-002 , OPS-011 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3393 | 3393 | - AI Website Assistant ugyanazt a canonical Page Model command/action rendszert használja, mint a manuális Editor: intent → task plan → structured actions → permission → schema validation → preview/diff → approval → execute → verify → audit/version. Nincs arbitrary database write vagy közvetlen generált HTML-kód publikálás. | AI-003–AI-009, AI-011–AI-012, EDT-001–EDT-042, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3394 | 3394 | - Későbbi AI Orchestrator, Agent/Tool/Model Registry, Task Planner/Context Selector, Permission Checker/Approval Flow és több-modelles routing egyetlen auditálható feladat-életciklust alkot. Specialist agentek lehetnek: Web Engineer Agent, Visual Editor Agent, QA Agent, GitHub/Cloudflare Engineer Agent és Browser QA AI; ezek nem kapnak automatikus, korlátlan jogosultságot és nem kerülhetik meg a canonical API/action rendszert. | AI-001–AI-020, SEC-002, SEC-008, OPS-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3395 | 3395 | - AI cost/rate limits, user/site quotas, approval queue, prompt-template versions, usage/error logs, error recovery és rollback; provider key soha nem lehet browserben. | AI-001, AI-002, AI-010, AI-017, SEC-008, OPS-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3396 | 3396 | - Későbbi Stream Intelligence: live/silence/speech/chat activity/technical/audio-quality analysis ahol engedélyezett; context/scene suggestions, interesting moments, post-stream summary, VOD analysis, clip/Short candidates, platform-variánsok, thumbnail briefs, publishing advice, performance-feedback loops és szerkeszthető opt-in memory/preferences. | AI-014–AI-016, CNT-001–CNT-020, INT-001–INT-021, OBS-001–OBS-010 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3397 | 3397 | - További későbbi AI-eszközök: egykattintásos clip/Short jelölt- és exportfolyamat emberi ellenőrzéssel; stream setup diagnostics assistant; AI Control Center az engedélyek, használat/költség, feladatok, approval, provider állapot és audit áttekintésére; experience evaluation/experiment cycle. Ezek nem 1.0 release gate-ek, és minden végigfutó AI-workflow end-to-end tesztet kap. | AI-010–AI-020, QA-002/003/008, OPS-009 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3401 | 3401 | - Published/indexelhető oldalak: valid title/description/canonical, Open Graph és X/Twitter card, sitemap/robots, strukturált adatok ahol értelmes; draft/unpublished/preview nem indexelhető. | SEO-001–SEO-005, WEB-001–WEB-032, LOC-004 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3402 | 3402 | - Későbbi SEO tooling: redirect-kezelés és broken-link detection előnézettel és jóváhagyással. | SEO-005, WEB-001–WEB-013, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3403 | 3403 | - Public output: semantic HTML, helyes heading hierarchy, alt text, form labels, ARIA ahol szükséges, keyboard navigation, focus order/visibility, screen-reader metadata, kontrasztfigyelmeztetés, form accessibility és reduced-motion. | WEB-031–WEB-032, QA-004–QA-005 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3404 | 3404 | - Session/cookie: HttpOnly, Secure, helyes SameSite; expiry, inactivity timeout, logout/session invalidation. Megfelelő password hash, auth rate limiting, RBAC, szerveroldali can permission check, CSRF/Origin protection a választott auth modellnek megfelelően, input/output validation, OAuth state/PKCE, webhook signature/replay defense és upload validation. | SEC-001–SEC-011, TEAM-003, QA-003 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3405 | 3405 | - Minden publikus, preview és admin route-nak saját jogosultsági határa van; preview nem leakelhet draftot, log/export nem leakelhet tokent. | SEC-001–SEC-011, WEB-004–WEB-008, OPS-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3406 | 3406 | - Performance: JS bundle, lazy loading, image dimensions/variants, cache invalidation, Core Web Vitals, nagy page/tree history-memória és autosave overhead, API latency és production smoke. Számszerű budget a mérési baseline után rögzítendő. | OPS-008, WEB-001–WEB-032, EDT-005–EDT-007, QA-005–QA-006 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3407 | 3407 | - Visual regression baseline: publikus home/navigation/Schedule, Editor core state és desktop/tablet/mobile. | QA-004–QA-006, WEB-001–WEB-032, EDT-001–EDT-042 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3411 | 3411 | - Export csomag: verziózott Page Model/page revisions/theme/templates/components/media references és támogatott domainadatok; secrets és access tokenek nélkül. | OPS-005–OPS-006, RES-001–RES-016, WEB-004–WEB-008, SEC-008 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3412 | 3412 | - Import dry-run: schema/version compatibility, missing asset, duplicate IDs, permission/owner és migrációs kompatibilitás ellenőrzése; részleges hibás publikálás nem történhet. | OPS-004–OPS-006, RES-001–RES-016, SEC-002–SEC-003 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3413 | 3413 | - Recovery/restore: célverzió és ütközések előnézete, integrity check, backup-ellenőrzés, visszaállítás utáni Page Model/revision/public-render konzisztencia. Recovery drill fázisonként előírt. | OPS-005–OPS-009, RES-001–RES-016, WEB-004–WEB-008 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3414 | 3414 | - Diagnostics: deploy/version ID, request/correlation ID, last sync, provider health, failed jobs/retry, D1/migration/cache állapot, API latency és actionable error; sem secret, sem szükségtelen személyes adat nem kerül logba. | OPS-001–OPS-008, INT-001–INT-021, SEC-008, SEC-010 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3421 | 3421 | - **1.0:** stabil saját Sanci9517 public website + Admin + működő Editor első teljes szelete és szükséges layere/Inspector/mentési lánca; responsive; alap Media/Resource; Schedule/Twitch; draft/preview/publish/revision; SEO/accessibility/security/performance és release tesztek. | ADM-001–010, EDT-001–042, WEB-001–032, RES-001–016, SCH-001–015, INT-001–021, SEO-001–005, QA-001–009 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3422 | 3422 | - **1.x:** profil/link hub, content hub, többplatformos integrációk, commerce alap, digitális termékek/membership/community, alerts/automation, email audience capture. | WEB-001–032, CNT-001–020, COM-001–018, INT-001–021, STO-001–020, SUP-001–012, AUT-001–014, CAM-001–009 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3423 | 3423 | - **2.x Creator OS:** creator dashboard 2.0, analytics, content studio, audience/email ownership, sponsorship/business hub, OBS/stream control, advanced stream tools. | ANL-001–010, CNT-001–020, CAM-001–009, OBS-001–010, COM-001–018, SUP-001–012 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3424 | 3424 | - **3.x+:** AI website assistant/stream intelligence, Creator Business Platform, Marketplace, multi-site/teams, SaaS/multi-tenant, billing és globális ökoszisztéma. | AI-001–AI-020, MKT-001–MKT-005, TEAM-001–TEAM-006, SEC-003, TEAM-006 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3428 | 3428 | - Indulási nyelv: magyar; nemzetközi bővítés később, ezért a dátum/idő, locale és UI-stringek nem hardcode-olhatók egyetlen nyelvre a domainmodellben. | LOC-001–LOC-006, SET-001–SET-003, SCH-001–SCH-015 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3429 | 3429 | - Kiinduló brand/content profil: gaming streamer, többek között Fortnite, Hearthstone és roguelike/Hades-jellegű játékok. Kiemelt játék, streamcím, Schedule és platformlinkek Adminból módosíthatók. | SET-001–SET-003, SCH-001–SCH-015, INT-001–INT-021, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3430 | 3430 | - Korábban megadott TikTok-azonosító: sanci9517twitch; az 5000 követő személyes cél, nem UI-garancia. A cél/link profilbeállításként legyen változtatható. | SET-001–SET-003, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3431 | 3431 | - Heti három stream korábban lehetséges ritmusként merült fel; Schedule-ban szerkeszthető terv, nem kötelező vagy beégetett ütem. | SCH-001–SCH-015, SET-001–SET-003 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3432 | 3432 | - Fejlesztési támogatás/kampány kontextus: korábban 1 000 000 Ft-os cél, Brancs/Ko-fi/Buy Me a Coffee jellegű online támogatás, fizikai jutalom nélkül merült fel. Ez nem automatikusan aktív fizetési modul: publikus kampány előtt aktuális cél, platformfeltételek, linkek és privacy/jogi információk újraellenőrzendők. Supporter nevek csak külön, önkéntes opt-in alapján jelenhetnek meg. | CAM-001–CAM-009, WEB-001–WEB-032, SEC-011, SUP-010 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3433 | 3433 | - Ezek projektkontextusok és kezdeti tartalomadatok; a termékben konfigurációként kell szerepelniük, és később változtathatónak kell maradniuk. | SET-001–SET-003, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3440 | 3440 | - A Game Profile ne csupán név/kép pár legyen: stabil ID, canonical slug, megjelenített név, platform- és külsőazonosító-mapping, media/resource references, opcionális brand/presentation metadata, szín/hero/cover, lifecycle status és adminból szerkeszthető leírás. | SCH-001–SCH-015, RES-001–RES-016, SET-001–SET-003, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3441 | 3441 | - Schedule item Game Profile-ra stabil referencia útján mutathat; ne másolja le a játékprofil egészét és ne az elnevezés alapján kapcsoljon rekordot. | SCH-001–SCH-015, RES-001–RES-016, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3442 | 3442 | - Opcionális artwork vagy extra metadata hiánya nem eredményezhet hibás/üres layoutot. A publikus megjelenítés fallbackje legyen explicit, az Inspector pedig csak a létező, érvényes mezőket mutassa. | RES-001–RES-016, EDT-018, EDT-022, WEB-031–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3443 | 3443 | - A Game Profile külön domain legyen, a Page Model a hozzá tartozó resource/domain reference-t használja. Ne készüljön párhuzamos, editor-only játék-adattár. | SCH-001–SCH-015, RES-001–RES-016, EDT-018, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3446 | 3446 | - A végtermék célja saját creator domain támogatása. A domainkezelés a megfelelő fázisban tartalmazza a domain hozzáadását, tulajdonjog-verifikációt, DNS-állapotot, primary domain kiválasztását, SSL provisioning/renewal state-et, canonical URL-t, redirecteket és hibaállapotokat. | WEB-001–WEB-032, SEC-002, OPS-001 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3447 | 3447 | - Domaincsere vagy primary-domain módosítás előtt előnézet és explicit figyelmeztetés szükséges az URL-, SEO- és redirect-hatásokról. Nem ellenőrzött domain nem válhat automatikusan publikus primary domainné. | WEB-001–WEB-013, SEO-001–SEO-005, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3448 | 3448 | - Brandbeállítások: creator név, logó, favicon, social link registry, színek, betűk, vizuális tokenek, cover/avatar és kapcsolódó médiaforrások. Ezek konfigurálható adatok legyenek, ne hardcode a rendererben. | SET-001–SET-003, RES-001–RES-016, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3451 | 3451 | - Alapfunkció: platform/social linkek, CTA-k, linkek sorrendje és láthatósága, Schedule/Content/Community/Support célok és mobilbarát Link Hub oldal. | WEB-001–WEB-032, CAM-002, SET-001–SET-003 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3452 | 3452 | - Későbbi bővítés: link-időzítés, campaign links, UTM paraméterek, QR-kódos megosztás, smart redirect és kattintásanalitika. Redirect/click analytics csak mérési és adatvédelmi szabályokkal. | CAM-002, ANL-001–ANL-009, SEC-011 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3453 | 3453 | - Külső linkeknél validált URL, világos külső-link viselkedés, veszélyes scheme-ek tiltása és a publikus menü/CTA konzisztencia szükséges. | WEB-001–WEB-032, SEC-005–SEC-007 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3456 | 3456 | - Signup/subscribe form csak célhoz kötött, átlátható hozzájárulással gyűjthet címet; tárolandó az időpont, a consent/purpose verzió és az unsubscribe státusz. | CNT-001–CNT-020, SEC-011, WEB-001–WEB-032 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3457 | 3457 | - Későbbi funkciók: subscriber list, segmentation, campaigns/newsletters, automated és transactional email, email templates, opt-out/unsubscribe, bounce/failed delivery state, rate limits és consent history. | CNT-001–CNT-020, AUT-001–AUT-014, SEC-011 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3458 | 3458 | - Marketing és tranzakciós levél különüljön el. Unsubscribe után marketingküldés nem indulhat újra automatikusan; export/törlés/retention a privacy szabályok szerint. | CNT-001–CNT-020, SEC-011, SEC-010 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3461 | 3461 | - Későbbi struktúra: tenant → workspace/creator account → workspace members → sites → domain modules. Egy workspace több site-ot tarthat, például streamer brand, esports team, personal brand, podcast, event vagy merch brand, külön site settingekkel. | TEAM-001–TEAM-006, SEC-003, SET-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3462 | 3462 | - Szerepkörök lehetnek owner, admin, editor, designer, moderator, analyst, content manager, store manager és finance role. A role ne csak navigációt rejtsen el: minden API/domain mutation szerveroldali permission checket kap. | TEAM-001–TEAM-005, SEC-001–SEC-003, SEC-010 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3463 | 3463 | - Workspace- és site-szintű hozzáférés külön kezelendő; a kliens által küldött site/workspace/tenant ID önmagában nem jogosultsági bizonyíték. | TEAM-001–TEAM-006, SEC-002–SEC-003 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3464 | 3464 | - A Free/Creator/Pro/Business/Team/Agency csomagok csak valós költség-, usage- és üzleti adatok alapján véglegesíthetők. Billing, quota, usage, invoice, upgrade/downgrade/cancel későbbi SaaS scope. | TEAM-006, SEC-003, OPS-008 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3467 | 3467 | - A publikus website 1.0-tól reszponzív web. A későbbi PWA vagy külön mobilalkalmazás lehetősége: notifications, schedule, live state, community, member area, store és Creator Dashboard. | WEB-001–WEB-032, TEAM-001–TEAM-006 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3468 | 3468 | - A későbbi creator app képességei: live status, alerts, schedule changes, analytics, moderation és content approval. Ez nem jelent külön Page Modelt vagy párhuzamos backend domaint; ugyanazokat a canonical API-kat és jogosultságokat használja. | WEB-001–WEB-032, TEAM-001–TEAM-006, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3471 | 3471 | - Starter template-kategóriák: Gaming, Just Chatting, Esports, Variety, VTuber, Music, Podcast, Creator Business és Merch-first. | DSN-001–DSN-018, EDT-024–EDT-025 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |
| ARCH-3472 | 3472 | - Később creator-created template, component/block/theme/overlay/OBS scene/digital asset marketplace, licenc, kompatibilitás, verzió, preview, rating/review és revenue share. A marketplace csak külön jogosultsági, moderációs, fizetési és licencelési scope után aktív. | MKT-001–MKT-005, DSN-001–DSN-018, OBS-001–OBS-010, STO-001–STO-020, CAM-009, SEC-002 | PROPOSED — semantic crosswalk to validate against the exact source and feature contracts; permissions, phase, dependency, tests, and acceptance evidence remain open |

### 41.3.6. P0.2 — C.23 + F.1–F.13 crosswalk structural recheck (2026-10-13)

**Scope checked:** the 210 C.23 source-bullet rows and 100 F.1–F.13 archive-bullet rows in §41.3.5, against the 359 IDs declared in §24.

- C.23 rows: 210; F archive rows: 100; total source rows checked: 310.
- Unique source keys: 310/310. F archive rows use `ARCH-<archive-line>` keys so they cannot collide with the separate F.1–F.13 capability crosswalk in §37.27.
- Candidate feature coverage: all 359/359 declared feature IDs are referenced by at least one C.23/F archive row.
- Structural validation: 0 duplicate source keys, 0 unmapped/TBD mapping cells in these 310 rows, and 0 references to undeclared feature IDs or invalid range endpoints.
- Corrected nine C.23 SEO ranges from `SEO-001–010` to the actual declared range `SEO-001–005`.
- **Interpretation limit:** this is structural validation of proposed crosswalks, not proof of semantic completeness. The mappings remain proposed until each is compared against the exact source meaning and canonical feature contract. In particular, F archive rows still require item-level permission, owner, phase, dependency, test, negative-test, acceptance, and evidence decisions.
- Source-recovery check against `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` found the preserved `00.9.6.C/D/E/F` chapters and a partial `00/A.2.2` historical DoD block, but not a complete original `00/A` source or a `00.9.6.B` chapter. The archive itself explicitly notes that earlier `00/A` and `00.9–00.9.6.B` titles are not present in the current MASTER form. The historical `aedb2ea` version of `docs/MASTER-DEVELOPMENT-PLAN.md` also does not contain those sections. The exact missing originals must therefore be located in repository history/archived files or marked as unrecovered; their contents must not be inferred from C/D/E/F. Coverage in this table does not substitute for that missing-source reconciliation or establish P0.2 PASS.

**Current result:** P0.2 remains **IN PROGRESS / NOT PASS**. Continue source-by-source semantic review and contract completion; do not start parallel feature implementation or request the final user feature-list review yet.

### 41.3.7. P0.2 — Source-text integrity and focused semantic corrections (2026-10-13)

**Forrás-ellenőrzés:** a §41.3.5-ben szereplő 210 C.23 tétel szövege normalizált, whitespace/Markdown-formázás-független összevetésben mind a 210 esetben megtalálható a `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` fájlban. A 100 `ARCH-<line>` tétel szövege ugyanezzel a módszerrel 100/100 esetben megtalálható az archív MASTER-ben. Ez a szöveg-provenance ellenőrzése; nem igazolja önmagában a mapping szemantikai helyességét.

**A célzott szemantikai felülvizsgálatban javított megfeleltetések:**
- `C.23.1-04`: a zoom/viewport funkcióhoz bekerült az `EDT-007`.
- `C.23.2-08`: érvénytelen preset/schema hibakezelésnél a Resource ID-k helyett a `DSN-014`, `EDT-001/042` és QA contractok szerepelnek.
- `C.23.8-05` és `C.23.8-11`: a product-card/commerce követelmények canonical `STO` domainre kerültek.
- `C.23.11-03`: a jövőbeli commerce page type a `STO` domainre is vissza van kötve.
- `C.23.12-09`: a domain-owned schedule/integration adatoknál a Resource domain helyett a `DYN`, `SCH`, `INT`, `EDT` és ownership/security határ szerepel.
- `C.23.16-01` és `C.23.17-07`: az editor billentyűzetes hozzáférhetősége, illetve a személyes editor-preferenciák leválasztása a site-settings domainről pontosítva.
- `C.23.16-03`, `C.23.18-04`, `C.23.18-05`: form, VOD/Content Hub, creator/profile/community/support block hivatkozások a megfelelő canonical felületekhez igazítva.
- Az előző strukturális körben az SEO tartomány `SEO-001–005` értékre lett korrigálva; nincs többé hivatkozás nem deklarált `SEO-006–010` ID-kre.

**Újraellenőrzött strukturális eredmény:** 210 C.23 + 100 ARCH forrássor; 310 egyedi kulcs; 359 deklarált feature ID; mind a 359 legalább egy mappingben hivatkozott; 0 duplikált kulcs; 0 feloldhatatlan vagy unmapped/TBD ID-hivatkozás; 210/210 és 100/100 forrásszöveg-egyezés.

**Korlát és kapu:** ez célzott, nem teljes körű szemantikai audit. A többi sor javasolt mappingjét továbbra is az eredeti követelmény és a canonical contract alapján kell egyenként felülvizsgálni. A teljes `00/A` és `00.9–00.9.6.B` forráscsomag még nincs teljesen visszanyerve/reconciliálva; a 359 ID teljes mapping-lefedettsége nem bizonyítja az összes követelmény szemantikai megőrzését. P0.2 továbbra is **IN PROGRESS / NOT PASS**.

### 41.3.8. P0.2 — F archive crosswalk focused review (2026-10-13)

**Célzott szemantikai pontosítások:**
- `ARCH-3331`: a canonical dynamic-binding pipeline a `DYN` és safe public renderer (`WEB-032`) képességekhez került, nem a public contact/form oldalhoz.
- `ARCH-3353`–`ARCH-3357`: a teljes publikus oldalportfólió és Creator-home/Stream/About/Link Hub követelményekhez hozzá lettek kötve az érintett canonical Content, Community, Support, Store és Campaign domainek is; ez fázis- és scope-besorolás, nem 1.0 release-ígéret.
- `ARCH-3358`–`ARCH-3359`: az interaction/action és motion/reduced-motion követelmények az `EDT-039/040` registryhez igazítva.
- `ARCH-3365`: a Twitch provider/live state követelményből eltávolítva a nem indokolt OBS-domain mapping; az integrációs/live/security szerződések maradtak.
- `ARCH-3421`–`ARCH-3423`: a 1.0 Admin shell, 1.x Community, illetve Creator OS Community/Support részei explicit canonical mappinget kaptak.

**Új strukturális újraellenőrzés a módosítások után:** 210 C.23 sor + 100 ARCH sor; 310 egyedi source key; 359/359 feature ID hivatkozott; 0 duplikált source key; 0 ismeretlen/érvénytelen ID-tartomány; 0 TBD mapping; 210/210 C.23 és 100/100 ARCH forrásszöveg-egyezés az archív MASTER-rel.

**Korlát:** a strukturális ellenőrzés és a célzott szemantikai javítások nem jelentik mind a 310 mapping teljes szemantikai jóváhagyását. A soronkénti permission/owner/phase/dependency/test/negative-test/acceptance/evidence kitöltés, valamint a teljes `00/A` és `00.9–00.9.6.B` source recovery/reconciliation továbbra is nyitott. P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.9. P0.2 — C.23 canvas/layout/visual-style targeted semantic review (2026-10-13)

**Átnézett tartomány:** a §41.3.5 C.23.3–C.23.6.3 releváns canvas-geometria, layout, háttér/media és design-token sorai. Ez célzott, nem teljes fejezet- vagy crosswalk-jóváhagyás.

**Javított mappingek:**
- `C.23.3-01`: a hosszú vászon, scroll-extent, zoom és viewport-geometria acceptance-éhez a domain/API teszt mellett explicit browser/device és public SEO/accessibility/performance QA is hozzárendelve (`QA-002/004/005`). A konkrét canvas-height/scroll-extent runtime acceptance ettől továbbra sem tekinthető teljesítettnek.
- `C.23.5-11`: a háttér image/video követelmény most explicit módon hivatkozik a canonical asset registry/binary storage/preview/usage-map szerződésekre (`RES-001/002/004/008`), a reduced-motion szerződésre (`EDT-040`) és a performance/accessibility auditkapura (`QA-005`); a biztonságos publikus renderer (`WEB-032`) megmaradt.
- `C.23.6-03`: a globális színpaletta és kontraszt-előnézet mappingje összevonva a teljes token-sémára (`DSN-001–007`), és hozzáadva az explicit accessibility QA (`QA-005`).

**Ellenőrzési korlát:** a módosítások a mappingek tartalmi illeszkedését pontosítják; nem igazolják, hogy ezek a funkciók implementálva vagy runtime-ban elfogadva vannak. A többi sor, az ID-szintű teljes permission/dependency/test/acceptance contract és a hiányzó eredeti `00/A` / `00.9–00.9.6.B` források reconciliációja továbbra is nyitott. P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.10. P0.2 — Original-source recovery attempt and evidence boundary (2026-10-13)

**Végrehajtott keresési kör:** a `v2/foundation` ágon megkíséreltem beolvasni a `docs/MASTER-HISTORICAL-19-34-AUDIT.txt`, `docs/archive/MASTER-HISTORICAL-19-34-AUDIT.txt`, `docs/archive/00-A.md`, `docs/archive/00.9.6.B.md` és `docs/archive/plans/MASTER-DEVELOPMENT-PLAN.md` útvonalakat; ezek a jelenlegi ágon nem találhatók. A korábbi `aedb2ea` ref alatt a `docs/MASTER-DEVELOPMENT-PLAN.md` beolvasható, de az 30 944 karakteres, és nem tartalmazza a `00/A`, `00.9.6.B` vagy `00.9.6.*` marker/címsorokat. A kódtárkeresés az egzakt `00.9.6.B` és `MASTER-HISTORICAL-19-34-AUDIT` kifejezésekre nem adott találatot.

**Következtetés:** ez a keresési kör bizonyítja, hogy a megadott útvonalakon és az ellenőrzött régi MASTER-refben a forrás nem állt rendelkezésre; nem bizonyítja, hogy a forrás soha nem létezett vagy más commitban/néven nem található. A teljes eredeti `00/A` és `00.9–00.9.6.B` szöveg ezért továbbra is **UNRECOVERED / OPEN**. Nem készítek helyettesítő tartalmat és nem következtetek a hiányzó bulletpontokra a C/D/E/F fejezetekből. P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.11. P0.2 — C.23 renderer isolation and cross-page reference semantics (2026-10-13)

**Célzott tételes review:** a §41.3.5 C.23.3–C.23.4 táblázatából három mappinget pontosítottam a forrásbullet explicit biztonsági és reference-lifecycle jelentése alapján.

- `C.23.3-11`: az Editor overlay/selection decoration publikus kimenetből való kizárása a renderer parity (`EDT-034`) és safe renderer (`WEB-032`) mellett explicit XSS/sanitization (`SEC-005`), domain/browser és negatív security teszteket (`QA-002/003/004`) is kapott.
- `C.23.4-07`: oldalak közötti copy/cut/paste esetén a node ID-regenerálás és asset usage map mellett explicit dynamic binding type/resource compatibility (`DYN-002`), site-scope/published boundary (`DYN-007`) és tenant/site izoláció (`SEC-003`) szükséges. A cross-page művelet továbbra is scope-gated, nem automatikusan 1.0 ígéret.
- `C.23.4-08`: a `data-bound` node state nem pusztán editor UI-state; a binding schema, binding-state machine és permission/site-scope boundary (`DYN-002/005/007`) is része a szerződésnek.

**Korlát:** ez három sor célzott szemantikai javítása; nem bizonyítja a teljes C.23 tartomány vagy a 310 sor mindegyikének jóváhagyását. A source recovery és a soronkénti contract/evidence kitöltés továbbra is nyitott; P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.12. P0.2 — C.23 layout/Inspector/responsive/data-contract semantic review (2026-10-13)

**Hatókör és módszer:** a v2/foundation ág aktuális public/editor-v2/core/{canvas-engine,canvas-extent,property-registry,responsive,commands,schema,validation}.js, public/editor-v2/app.js, public/editor-v2/tests/core.test.js forrásainak olvasásalapú felülvizsgálata. Ez forráskód-ellenőrzés; ebben a körben tesztet nem futtattam, böngészős/runtime viselkedést nem igazoltam, és nem változtattam runtime kódot.

**Tényszerű kódmegfigyelések és következmények:**

- **C.23.5-15 — közös drag/Inspector command útvonal: RÉSZBEN IGAZOLT.** Az app.js finishCanvasDrag és setGeometry egyaránt responsive.set parancsot hív; a resize is ugyanebbe a parancsba menti a méretet. A core.test.js igazolja a responsive command alapvető state-módosítását, de nem hasonlítja össze a dragból és az Inspectorból érkező payloadokat, a végső Page Modelt, illetve a save/reload round-tripet. Következő bizonyíték: közös contract/integration teszt a két szerkesztési módról, zoommal, cancel/undo-val és mentés-visszatöltéssel.
- **C.23.5-03, C.23.5-05–06, C.23.7-05 — property coverage és validáció: NYITOTT, konkrét hiányjelzéssel.** A property-registry.js deklarál flex és grid csoportot, de a jelenlegi properties listában nincs flex/grid property; a canvas-engine.js STYLE_MAP sem tartalmaz flex/grid layout mezőket vagy általános gapet. A layoutcsoport jelenlegi listája alapvető display és overflow mezőket tartalmaz. Ebből nem következik, hogy a funkció sehol máshol nem létezik, de a vizsgált kanonikus registry/render útvonalon a C.23-ban felsorolt Flex/Grid tulajdonságok lefedettsége nincs igazolva. A támogatott subsetet explicit módon rögzíteni kell, a nem támogatott kontrollt pedig nem szabad működőként felkínálni.
- **C.23.5-03, C.23.5-02, C.23.7-05 — érvénytelen dimenzióérték: KONKRÉT VALIDÁCIÓS RÉS A VIZSGÁLT ÚTVONALON.** Az app.js normalizeDimension csak az auto (engedélyezett esetben), numerikus és px/%/vw/vh/rem/em formátumokat ismeri fel, de az ismeretlen szöveget változatlanul visszaadja ahelyett, hogy elutasítaná. A setGeometry ezt továbbítja a responsive.set parancsnak. A commands.js responsive commandja a patch mezőit közvetlenül beírja; a validation.js jelenlegi ellenőrzése dokumentumstruktúrát, hierarchiát, Rich Textet és a kapcsolódó sémákat ellenőriz, nem a CSS dimenziók és property/viewport kompatibilitás teljes készletét. Következésképpen a vizsgált editor útvonal önmagában nem bizonyítja, hogy az érvénytelen CSS/unit érték mentés előtt elutasításra kerül. A javítás/teszt külön feladat; a jelen audit nem módosította a kódot.
- **C.23.9-04–07 — responsive inheritance: ALAPLOGIKA IGAZOLT, TELJES SZERZŐDÉS NYITOTT.** A responsive.js desktop → tablet → mobile irányban feloldja a viewport értékeket, a tablet a desktopból, a mobile a tabletből/desktopból örököl; a teszt az alap öröklést és resetet ellenőrzi. A parancsrétegben viszont a responsive patch bármely kulcsot elfogadhatja, és a jelenlegi dokumentumvalidáció nem igazolja a property-specifikus override-kompatibilitást. Nincs itt bizonyíték az összes tulajdonság, konfliktus, oldal/komponens breakpoint-egyeztetés vagy a tényleges browser viewport teljes tesztjére.
- **C.23.9-10 — canvas height/scroll extent: ALAPMECHANIZMUS ÉS EGYSÉGTEST LÉTEZIK, RELEASE ACCEPTANCE NINCS IGAZOLVA.** Az app.js drag és resize közben meghívja az updateCanvasExtent függvényt; a canvas-extent.js a mért node-bottom értékeket zoommal visszaosztja, majd paddinget és minimumot ad. A core.test.js néhány numerikus esetet tesztel. Ezek nem bizonyítják a nested/positioned/transformed elemek, scroll container, különböző zoomszintek, content growth és valós browser viewportok helyes együttműködését. Ezekhez célzott browser/device tesztek szükségesek.
- **C.23.12-03–07 — általános adatbinding: NINCS TELJES SZERZŐDÉS IGAZOLVA.** A schema.js minden node-on tárol dataBindings mezőt, a Schedule node-hoz pedig schedule_items forrású alap bindinget ad. A jelen vizsgált validation.js nem validál általános binding-forrás/mező/típus/site-scope/engedélyezési szerződést. Ez a megfigyelés a vizsgált editor core határaira vonatkozik, nem állítás arról, hogy a backend összes adatvédelmi védelme hiányzik. A következő auditban a canonical DYN szerződéssel, server oldali olvasási útvonallal és negatív cross-site/draft/private tesztekkel kell összevetni.

**Auditminősítés:** ebben a körben egy közös command útvonal és a responsive alapöröklés forráskód-szinten részben megerősíthető; a flex/grid lefedettség, a property-szintű validáció, a teljes canvas geometria és az általános data-binding contract nem kapott teljes bizonyítékot. Ezeket nem szabad PASS-ként vagy kész funkcióként könyvelni. A kódbeli hiányjelzések javítása külön fejlesztési kapu; amíg P0.2 nyitott, runtime feature implementation nem indulhat.

**Következő sorrend:** (1) a C.23.5/C.23.7 sorok támogatott property subsetjének és invalid-value elutasításának pontosítása; (2) a drag ↔ Inspector és responsive save/reload acceptance tesztek hozzárendelése; (3) C.23.9 browser/device tesztbizonyítékok; (4) általános binding összevetése a DYN-002/005/007 szerződéssel; (5) az eredeti 00/A és 00.9–00.9.6.B source recovery külön folytatása. A teljes eredeti forrás továbbra is UNRECOVERED / OPEN. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.13. P0.2 — archived MASTER inventory, H19–H34 bidirectional ID check and source-provenance boundary (2026-10-13)

**Források és módszer:** összevetettem a jelenlegi kanonikus `docs/MASTER-DEVELOPMENT-PLAN.md` fájlt a `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` történeti snapshotjával a `v2/foundation` ágon. Mindkét dokumentum teljes szövegét beolvastam; a H19–H34 táblázatsorokból az egyedi stabil ID-kat programozottan kinyertem és két irányban összehasonlítottam. Ez ID-lefedettségi és proveniencia-ellenőrzés, nem teljes szemantikai vagy runtime acceptance.

**Igazolt eredmények:**
- Mindkét dokumentumban **271 egyedi H19–H34 ID** található; a csoportonkénti darabszám mindkét oldalon azonos: H19=20, H20=18, H21=22, H22=19, H23=20, H24=13, H25=12, H26=12, H27=19, H28=17, H29=10, H30=14, H31=14, H32=25, H33=13, H34=23.
- A két dokumentum ID-halmaza között az ellenőrzött H19–H34 tartományban **0 hiányzó ID mindkét irányban**. Ez azt igazolja, hogy a jelenlegi MASTER megőrzi az archivált ledger azonosítóit; nem igazolja, hogy minden történeti forrásbullet, jelentés, lifecycle, függőség vagy acceptance szemantikailag teljes és helyesen van leképezve.
- Az archív MASTER-ben szerepelnek `00/A` című történeti fejezetek, köztük egy korábbi F/Schedule CRUD + Inspector / Domain-Driven Editor DoD. Ez **archív követelményszöveg**, nem a hiányzó önálló `00/A` eredeti forrás teljes provenienciájának bizonyítéka. A kanonikus MASTER jelenlegi fájljában az eredeti `00/A` fejezetek nem szerepelnek ilyen formában.
- Az archív MASTER az eredeti `00.9.6.B` címet/szakaszt nem tartalmazza önálló fejezetként; egyetlen említésben azt rögzíti, hogy a régi címek jelen formában nem találhatók, és a követelményeket archív/történeti forrás alapján kell visszavezetni. Ez nem helyettesíti a `00.9–00.9.6.B` eredeti teljes szövegét.
- **Aktív státusz-ellentmondás az archív snapshotban:** annak eleje `F0.4-VISUAL-BUILDER-LAYERS-INSPECTOR` aktív pontot és `F0.4-LAYERS-INSPECTOR-RESPONSIVE-INTEGRATION` aktív al-pontot jelöl. A jelenlegi kanonikus MASTER eleje ezzel szemben `P0-PRODUCT-BASELINE-AND-EXECUTION-CONTRACT` / `P0.2-ARCHIVE-RECONCILIATION-AND-BIDIRECTIONAL-FEATURE-TRACEABILITY` állapotot jelöli. Az archív érték történeti állapot; **nem írhatja felül** a jelenlegi MASTER aktív pontját. A jövőbeli beszélgetés folytatási protokolljában a jelenlegi MASTER az irányadó.
- A H19–H34 sorok teljes száma és egyezése önmagában nem teszi lezárttá a korábbi 19–34 fejezetek forrásbullet-szintű reconciliációját. Minden capability-nél továbbra is külön kell ellenőrizni az eredeti megfogalmazást, a canonical domain/surface/owner/lifecycle besorolást, a duplikáció vagy superseded döntés indokát, valamint a fázis-DoD/test/acceptance kapcsolatot.

**Döntés / státusz:** a H19–H34 ID-szintű archive-to-current egyezés **PASS kizárólag erre a szűk ellenőrzésre**. A teljes H19–H34 szemantikai reconciliáció, a `00/A` és `00.9–00.9.6.B` eredeti források teljes visszanyerése, valamint a kétirányú 359 funkció-ID contract/evidence kitöltése továbbra is **OPEN**. P0.2 **IN PROGRESS / NOT PASS**. Nincs runtime kódmódosítás és nem indult feature-fejlesztés.

**Következő auditlépés:** a jelenlegi MASTER 41. fejezetének H19–H34 sorait eredeti forrásbullet- és capability-szinten kell folytatni, elsőként a 19–22 tartományban már megkezdett nyomkövetés bizonyítékainak kiterjesztésével a 23–34 tartományra; közben külön kell megőrizni a forrásból nem bizonyítható állításokat OPEN státusszal. A hiányzó eredeti fájlok tartalmát nem szabad az archív MASTER összefoglalóiból kitalálni.

### 41.3.14. P0.2 — dynamic binding contract versus canonical Schedule read path (2026-10-13)

**Átnézett források:** `public/editor-v2/core/schema.js`, `public/editor-v2/core/validation.js`, `src/core/editor-validation.ts`, `src/core/schedule-read.ts`, `src/routes/public/schedule.ts`, `public/assets/page-renderer.js`. Ez célzott kódút-ellenőrzés; tesztet és böngészős acceptance-et ebben a körben nem futtattam.

**Pozitív, konkrétan igazolható szerződések:**
- A kanonikus Editor schema a Schedule node létrehozásakor alapértelmezett `dataBindings.schedule = { source: 'schedule_items', version: 1 }` értéket állít be.
- A szerveroldali `validatePublishDocument` a Schedule node `props.schedule` konfigurációját validálja: verzió, mód, limit, statusok, platformok, sorrend, boolean megjelenítési kapcsolók és üres állapot szövege.
- A publikus renderer külön `/api/public/schedule` végpontot kér le a Schedule preview/render útvonalon; a `publicScheduleRoute` a canonical site contextből származó `siteId`-t továbbadja a `readPublicSchedule` függvénynek.
- A `readPublicSchedule` normalizálja és korlátozza a lekérdezési konfigurációt, a SQL lekérdezés pedig kötelező `site_id = ?` feltételt és engedélyezett státuszszűrést használ. Ez a konkrét Schedule olvasási útvonalon site-scope védelmet mutat.

**Nyitott contract-rés / határ:**
- A vizsgált `validatePublishDocument` a `props.schedule` konfigurációt ellenőrzi, de a node általános `dataBindings` mezőjét nem validálja source/field/type/version/permission/site-scope szerződésként.
- A Schedule node `dataBindings.schedule.source = schedule_items` és a `props.schedule` olvasási konfiguráció két külön mező; a vizsgált fájlok nem bizonyítják, hogy a generic `dataBindings` mező a runtime adatlekérés vezérlője. A megfigyelt publikus renderer a `props.schedule` konfigurációból építi a queryt. Ezért a konkrét Schedule API site-scope védelmét nem szabad általános data-binding contract PASS-ként kiterjeszteni.
- A vizsgált útvonalból nem következtetek arra, hogy a backend más részein nincs további védelem; a megállapítás kizárólag a felsorolt kódút és mezők közötti igazolható kapcsolatra vonatkozik.

**Következő bizonyítékigény:** (1) döntés, hogy `dataBindings` canonical konfigurációs metadata, tényleges runtime binding, vagy átmeneti/legacy mező; (2) ha runtime binding, explicit schema és szerveroldali allowlist/type/permission/site-scope/published-state validáció; (3) negatív tesztek másik site, draft/private adat, tiltott source/field és ismeretlen binding-version ellen; (4) save → publish → public-render end-to-end bizonyíték. A hiányzó contractot nem szabad pusztán a Schedule endpoint meglévő site-szűréséből lezártnak tekinteni.

**Státusz:** a Schedule-specifikus olvasási validáció és site-scope útvonal **FORRÁSSZINTEN IGAZOLT**; a generic `dataBindings` contract és a renderer/schema közötti kanonikus szerep **OPEN**. P0.2 **IN PROGRESS / NOT PASS**. Nincs runtime kódmódosítás.

### 41.3.15. P0.2 — H34 collaboration/conflict mapping semantic exception (2026-10-13)

**Hatókör:** a 40.16 H34.00–H34.22 megőrzött követelménykatalógus és a 41. crosswalk H34.08 sora; a stabil ID-k definíciói a §24 registryben.

**Konkrét szemantikai eltérés:** H34.08 történeti téma „collaboration/conflict”. A crosswalk célja jelenleg `TEAM-004, EDT-029`. A §24 registryben `TEAM-004` jelentése **Approval/review/activity feed**, míg `EDT-029` jelentése **Revision conflict recovery**. Az EDT-029 ezért részleges, konkrétan kapcsolódó leképezés; a TEAM-004 önmagában nem bizonyítja a kollaboratív szerkesztés, egyidejű módosítások, presence/locking vagy konfliktusfeloldás lefedettségét.

**Döntés:** H34.08 **OPEN — részleges megfelelés / cél-ID felülvizsgálata szükséges**. A `TEAM-004` nem fogadható el a teljes collaboration capability canonical ownerjeként pusztán a review/activity feed miatt. Nem hozok létre automatikusan új stabil ID-t a 359-es registryben, mert a teljes kétirányú reconciliáció még folyamatban van; előbb azonosítani kell, hogy létezik-e más, már kanonikus collaboration/approval/concurrency ID, illetve a roadmap mely fázisában kell az önálló együttműködési képességet kezelni.

**Kötelező folytatási ellenőrzés:** (1) a teljes §24 registryben és a 00.9.6.C–F történeti anyagokban keressük meg a collaboration, multi-user editing, presence, locking, revision conflict, approval és activity feed külön követelményeit; (2) válasszuk szét a már létező revision conflict recovery-t, az approval/activity feedet és a tényleges egyidejű szerkesztést; (3) rögzítsünk KEEP/MERGE/EXPAND/ADD/DEFER döntést, tulajdonost, fázist, dependency-t, negatív concurrency tesztet és acceptance-t; (4) csak ezután módosítsuk a H34.08 cél-ID-t vagy a stabil ID registryt.

**Korlát:** ez egy konkrét crosswalk-sor szemantikai kivételének azonosítása; nem állítja, hogy a többi H34 vagy H19–H33 sor már teljesen helyes. A jelen körben runtime kódot nem módosítottam, tesztet nem futtattam. H19–H34 ID-halmaz-egyezés továbbra is csak szűk ID-szintű PASS; a teljes szemantikai reconciliáció és P0.2 **IN PROGRESS / NOT PASS**.
### 41.3.16. P0.2 — H28 security validation and H29 backup/revision mapping exceptions (2026-10-13)

**Hatókör:** H28.01–H28.17 és H29.01–H29.10 történeti sorok; a cél-ID-k jelentése a §24 canonical registryből ellenőrizve.

**H28 — security mapping:**
- A H28.01–H28.04 sorok SEC-001 célja csak akkor fogadható el egyetlen összevont mappingként, ha a SEC-001 contract kifejezetten tartalmazza a cookie-flag és password-hash policy-t is; a registry címkéje „Authentication/session lifecycle”, ezért a mapping jelenleg **szemantikailag valószínű, de a részletek szintjén nincs bizonyítva**. A cookie flag-ek és a password hashing külön security acceptance esetként maradjanak láthatók.
- A H28.12 „input validation” SEC-005-re mutat, amelynek registry-megnevezése XSS/sanitization/safe embeds; ez szűkebb, mint az általános bemeneti schema/type/range/ownership validation. A H28.13 „output validation” esetén SEC-005 releváns lehet a sanitization/output safety részére, de nem helyettesíti a route/domain-specifikus output contractot.
- A H28.14 „file validation” → RES-003 célzás a feltöltés-validáció canonical ownerével összhangban van; a security crosswalknak ettől függetlenül meg kell őriznie az authorization, MIME/content inspection, méretlimit, object-key és veszélyes fájl esetek negatív tesztjeit.
- **Döntés:** H28.01–04 részletes security acceptance **OPEN**; H28.12 cél-ID/owner **OPEN — valószínűleg túl szűk egyetlen SEC-005 célra**; H28.13 **OPEN — sanitization csak részhalmaz**; H28.14 **MAPPED, runtime acceptance nincs igazolva**. A SEC ID-k létezése önmagában nem bizonyítja a védelmek tényleges lefedettségét.

**H29 — backup/revision mapping:**
- A H29.02 „page backup” és H29.03 „revision backup” egyaránt WEB-008-ra mutat. A §24 registryben WEB-008 jelentése „Revision history és diff”; ez a history megtekintését/összehasonlítását lefedheti, de nem bizonyítja a tényleges backup/export/restore artifact, integritásellenőrzés és visszaállítási műveletet. A tényleges backup/restore canonical owner az OPS-005 („Backup/export/restore”), a recovery drill az OPS-006, a rollback az OPS-009.
- **Döntés:** H29.02–03 **OPEN — partial mapping / owner mismatch risk**. A következő crosswalk-javításban külön kell ábrázolni a WEB-008 revision-history UI/metadata szerepét és az OPS-005 backup/restore műveletet; a két funkció nem olvasztható össze és a WEB-008 nem tekinthető a backup acceptance helyettesítőjének.
- H29.04 RES-008 media reference map, H29.06 OPS-009 rollback, H29.08 OPS-004 migration compatibility és H29.10 OPS-006 recovery drill jelentése a registry címkéjével összhangban van, de a tényleges elfogadáshoz integritás-, visszaállítási és recovery-drill bizonyíték kell.

**Kötelező javítási/ellenőrzési sorrend:** (1) H28.01–04 bontása külön pozitív és negatív acceptance esetekre; (2) H28.12 generic input validation céljának egyeztetése a domain-sémákkal és server-side validátorokkal; (3) H29.02–03 WEB-008 + OPS-005 szerepkülönbségének explicit rögzítése; (4) friss kétirányú crosswalk-ellenőrzés és a stabil ID-k lefedettségi számainak újraszámítása a módosítás után.

**Korlát:** ez célzott mapping review, nem security audit, restore drill vagy runtime PASS. Ebben a körben kódot és adatot nem módosítottam, teszteket nem futtattam. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.17. P0.2 — H30–H33 performance, AI intelligence and automation crosswalk semantic exceptions (2026-10-13)

**Hatókör és módszer:** a §40.12–40.15 történeti H30–H33 követelménycsoportjait és a §41 crosswalk egyedi sorait összevetettem a §24 stabil ID-regiszter jelentéseivel. Ez a review a mapping szemantikai megfelelőségét ellenőrzi; nem runtime audit, nem implementációs PASS, és nem teljes H19–H34 lezárás.

**H30 — performance / production QA:**
- H30.01 „bundle review” → OPS-010. Az OPS-010 registry-definíciója dependency/license/CVE review; ez a függőségi és ellátásilánc-ellenőrzés részét lefedheti, de a production bundle összetételének, méretének, chunkjainak, duplikációjának és build-artifactjának review-ját nem bizonyítja. **OPEN — részleges vagy félreérthető mapping.** Külön kell eldönteni, hogy a történeti „bundle” dependency-bundle-t vagy frontend production bundle-t jelentett-e; az eredeti forrás szövegkörnyezete nélkül nem szabad a két jelentést azonosnak venni.
- H30.02 lazy loading és H30.03 image optimization egyaránt RES-004-re mutat. Ez lehet közös resource-optimalizálási owner, de a lazy-loading trigger/viewport, az elhalasztott erőforrások, az image format/size/srcset és a layout-shift külön acceptance feltétel. **OPEN — a közös ID nem helyettesíti a két külön acceptance ágat.**
- H30.04 caching és H30.05 cache invalidation egyaránt OPS-008-ra mutat. Az OPS-008 a performance baseline/cache/query monitoringot nevezi meg; a mérés és a cache-invalidation helyessége nem ugyanaz. **OPEN — külön kell igazolni a cache key/scope, stale content, publish utáni invalidation, cache-control és site-isolation teszteket.**
- H30.12 API latency monitoring → OPS-008 a monitoring-baseline miatt releváns, de az alerting/error tracking/correlation és a route-szintű p95/p99 latency külön acceptance lehet; a registryben OPS-002/003 is létezik. **OPEN — owner/target kiegészítése szükséges a pontos elvárás tisztázása után.** Nem módosítok ID-t pusztán a címkék alapján.
- H30.06–09, H30.13–14 QA-005/QA-004/QA-006 céljai címke szerint relevánsak, de a mapping nem rögzít konkrét budgetet, viewportot, fixture-t, baseline-frissítési szabályt vagy küszöbértéket. **MAPPED, acceptance OPEN**; a „MERGE” döntés nem runtime bizonyíték.

**H31 — AI editor:**
- H31.00 pipeline → AI-003/005/006/007/008/009 összhangban van a registry intent/planner, action schema, permission, preview/approval, canonical execute és verify/audit/version szerepeivel. A pipeline teljes biztonsági szerződéséhez azonban az AI-019 emberi jóváhagyás, AI-018 prompt-injection teszt, AI-004 context/privacy filter és AI-020 AI-mentes fallback szükségességét is külön ellenőrizni kell a teljes crosswalkban. **OPEN — a részben megfelelő ID-lista nem bizonyítja a teljes biztonsági láncot.**
- H31.07 „AI accessibility QA” és H31.08 „AI visual QA” egyaránt AI-012-re mutat, amely a registryben SEO/accessibility/localization suggestions. Ez a hozzáférhetőségi javaslatot részben lefedheti, de a visual QA-t (referencia-képek, eltérésdetektálás, viewportok, toleranciák és false-positive kezelés) nem bizonyítja. **H31.07 PARTIAL; H31.08 OPEN — valószínű mapping-hiány.** A QA-004/QA-005 és az esetleges AI-képesség közti owner-szerepet a teljes ID-reconciliáció után kell rendezni; új ID automatikusan nem hozható létre.
- H31.01–04 közös AI-011 célja a website structure/content assistant alatt ésszerű közös belépési pont, de a page/element/style-layout/responsive műveletek mindegyikének canonical action, property schema, permission, preview/diff és rollback acceptance-e külön marad. **MAPPED AT CAPABILITY LEVEL; sub-capability acceptance OPEN.**

**H32 — streamer intelligence / memory / evaluation:**
- H32.08 „context-aware ideas” → AI-014 szemantikailag gyenge cél: AI-014 transcript/chapter/highlight/clip candidates. A kontextus kiválasztása és privacy-filter a registryben AI-004; a kontextusfüggő ötleteléshez AI-004 és a megfelelő generatív capability együtt is szükséges lehet. **OPEN — cél-ID felülvizsgálata szükséges.**
- H32.19 „streamer profile”, H32.20 „long-term memory” és H32.21 „preferences” → AI-016. AI-016 definíciója „specialist agent roles under shared permissions”; ez önmagában nem streamer-profile/adatmodell, opt-in memory/retention vagy preference management contract. **OPEN — valószínű owner mismatch.** Az AI-004 context/privacy filter és a SEC-011 consent/retention/export/delete releváns lehet, de a pontos felosztást nem szabad előzetes, teljes crosswalk nélkül kitalálni.
- H32.22 „historical outcomes”, H32.23 „experiment tracking”, H32.24 „evaluation cycle” és H32.25 „feedback loop” → AI-015. AI-015 definíciója stream diagnostics/summary where supported; ez nem azonos az experiment registryvel, model/prompt evaluationnel, outcome trackinggel vagy feedback governance-szel. **OPEN — szemantikai eltérés.** AI-002 prompt/template versioning, AI-010 cost/quota/usage/error tracking, AI-017 AI Control Center/approval queue és QA-010 continuous benchmark/feature-discovery egyes részeket érinthetnek, de ezek sem bizonyítják önmagukban a teljes történeti követelményt. Külön kell rögzíteni az adatforrást, mérési célt, retentiont, consentet, feedback opt-outot, evaluation methodot és acceptance-t.
- H32.01–07 AI-015 célja a stream diagnostics felől több tételnél valószínű, de a live monitoring, silence/speech, chat, audio, technical issue, quality és scene suggestion nem egyenértékű capability-k. **PARTIAL mapping; minden tételhez forrásadapter, elérhetőségi korlát, consent/privacy, false-positive és emberi kontroll acceptance kell.**
- H32.09–13 AI-014 céljai a highlight/clip/VOD tartományban illeszkednek; a post-stream summary és a platformonkénti Short/VOD feldolgozás viszont külön output/retention/publishing acceptance-t igényel. A mapping önmagában nem igazolja, hogy a runtime funkció létezik.

**H33 — automation:**
- H33.00 lifecycle → AUT-001 csak a canonical event registryt nevezi meg, miközben a saját sor lifecycle-lánca Trigger → Condition → Action → Result → Verify → Audit. A registryben ezekhez külön AUT-002/003/004/008 tartozik, továbbá az approval/dry-run AUT-009, enable/pause/version AUT-010, cycle detection/rate limit AUT-011. **OPEN — a H33.00 mapping túl szűk egyetlen AUT-001 célra; a teljes lifecycle-t explicit több-ID szerződésként kell lefedni.**
- H33.03–06 content/media/stream/notification workflows → AUT-014 (safe cross-domain actions) egy közös, magas szintű ownernek megfelelhet, de nem bizonyítja a négy workflow külön trigger/source, idempotency, permission, retry, failure, delivery és audit viselkedését. **PARTIAL mapping; workflow acceptance külön marad.**
- H33.09 failure handling → AUT-012 (provider outage/recovery) csak részhalmaz; általános action failure, retry exhaustion, dead-letter, pause/kill switch és operator recovery is külön ellenőrzendő. H33.07 AUT-007 és H33.08 AUT-006 jó registry-egyezés, de a retry/backoff/idempotency tényleges tesztjei továbbra is szükségesek.
- H33.12 → OPS-011 megfelel a registryben megadott „background-job/realtime runtime selection, only where justified” szerződésnek. **MAPPED**, de queue/Durable Object csak dokumentált háttérmunka/realtime szükséglet, lifecycle, idempotency és failure-recovery bizonyíték mellett fogadható el; nem előzetes technológiai kötelezettség.

**Kötelező következő lépések:**
1. A fenti OPEN/PARTIAL sorok mindegyikéhez rögzíteni kell a pontos forrásidézetet, cél-ID definícióját, döntést (KEEP/MERGE/EXPAND/ADD/DEFER), canonical owner/domain/surface, roadmap phase, dependency, pozitív és negatív teszt, DoD és user acceptance.
2. A H31–H32 AI-képességeknél ellenőrizni kell, hogy a szükséges cross-cutting ID-k (AI-004, AI-018/019/020, SEC-011, QA-004/005/010) külön szerepelnek-e a kapcsolódó funkcióknál; csak a címkézett AI-011/012/014/015/016 ID-k megléte nem elegendő.
3. A H30 teljesítmény- és H33 automation acceptance-et mérhető küszöbökkel, site-scope és failure-case tesztekkel kell kiegészíteni, de runtime megvalósítás csak a P0 kapu lezárása után indulhat.
4. E review után a H30–H33 sorokat mindkét irányban újra kell számolni a §24 registryvel, és ellenőrizni kell, hogy a cél-ID-k nem fednek-e el külön capability-ket pusztán közös címke vagy közös domain miatt.

**Státusz:** a H30–H33 stabil ID-k megléte és soronkénti mappingje ellenőrizhető; a fent megnevezett szemantikai eltérések miatt a H30–H33 teljes semantic PASS **NEM ADHATÓ MEG**. A teljes H19–H34 reconciliáció, a korábbi 00/A és 00.9–00.9.6.B források visszanyerése, a C.23/F.1–F.13 bullet-szintű acceptance és a 359 ID teljes kétirányú contract/evidence kitöltése továbbra is OPEN. P0.2 **IN PROGRESS / NOT PASS**. Ebben a körben kizárólag dokumentációt módosítok; runtime kódot és adatot nem, tesztet nem futtattam.

### 41.3.18. P0.2 — F.1–F.4 Editor, data binding, layout and public-content crosswalk semantic exceptions (2026-10-13)

**Hatókör és módszer:** a §41.3.5 F.1–F.4 forrás-bulletjeinek cél-ID-it a §24 canonical registry konkrét definícióival vetettem össze. Az alábbi eltérések a terven belüli jelentésütközések; a runtime útvonalak és tesztek külön bizonyítékot igényelnek. A megállapítás nem általános kódbiztonsági audit, és nem teszi lezárttá a teljes F.1–F.13 reconciliációt.

**F.1 — Editor transaction, autosave, recovery:**
- F.1-05 user-intent transaction/debounce/drag boundary → EDT-005/006/007. A registry szerint ezek history integrity, selection synchronization és canvas viewport; a tranzakciós/batch/rollback szerződés canonical ID-je EDT-004, míg a drag/drop EDT-008, Inspector edit intent pedig EDT-021/022-höz kapcsolódik. **OPEN — cél-ID lista hiányos és részben eltolódott.** Az EDT-004/008/021/022 célok szerepét az eredeti elvárás szerint kell megerősíteni; a történeti sor megőrzendő.
- F.1-08 autosave → EDT-022/027/028/WEB-004. Ezek az Inspector schema validation, dirty state, save/reload és weboldalhoz tartozó mapping; a registryben az in-flight edit preservation during save EDT-030, network failure/retry/local recovery EDT-031, no-data-loss guard EDT-042. **PARTIAL — autosave nem zárható le kizárólag save/reload és Inspector validation ID-kkel.** A debounced autosave, explicit immediate save, save közben keletkező edit, request failure, retry, reload és crash recovery külön acceptance eset marad.
- F.1-09 local crash recovery/conflict choices → EDT-030/WEB-007/WEB-008/OPS-009/SEC-008. EDT-030 a registry szerint in-flight edit preservation, nem a network failure/local recovery; WEB-007/008 history/conflict környéki céljai relevánsak lehetnek, OPS-009 rollback/incident procedure, SEC-008 secret storage/redaction. **OPEN — az EDT-031 és EDT-042 szerepe nincs megfelelően láthatóvá téve.** A lokális recovery adattárolása, titokmentessége, konfliktusválasztás, restore után menthetőség és adatvesztés nélküli retry külön tesztet igényel.
- F.1-10 optimistic concurrency/performance → EDT-027–034, WEB-008, OPS-008, QA-005/006. A tartományba olyan Editor ID-k is beleesnek, amelyek a canvas viewporttól a responsive/mobile UX-ig több külön képességet fednek, miközben a concurrency fő canonical célja EDT-029; a save közbeni módosítás EDT-030 és retry/recovery EDT-031. **PARTIAL — a tartományos ID-lista nem helyettesíti a concurrency konfliktus konkrét célját és negatív acceptance tesztjét.**

**F.2 — Dynamic data / Schedule boundary:**
- F.2-01 canonical dynamic data pipeline → DYN-001–DYN-008, WEB-020, EDT-018. A registryben WEB-020 a Public Contact page/form; nem általános data-binding runtime contract. EDT-018 az Image/Video/Embed/List/Card capability, nem a Dynamic Sanci block konfiguráció canonical ID-je (EDT-020). **OPEN — WEB-020 szemantikailag nem támasztja alá a generikus binding pipeline-t; EDT-020 hiányzik a célok közül.** A DYN-001–008 lefedettség mellett külön rögzítendő a binding konfiguráció tárolási helye, runtime olvasója, schema/version/source/field allowlistje, authorization/site scope, published-state szabály és a save→publish→public-render teszt.
- F.2-06 „Editor stores display configuration only; Schedule block cannot mutate Schedule domain rows” → EDT-018, SCH-001–SCH-015, DYN-001, SEC-002. A határkövetelmény releváns, de a registryben a Dynamic Sanci block konfiguráció EDT-020, a canonical Page Model/command és Inspector contract EDT-001/003/021/022, míg a Schedule CRUD owner a SCH-001. **PARTIAL — az EDT-020 hiánya miatt a konfiguráció és a domain CRUD elválasztása nincs teljesen leképezve.** Kötelező negatív teszt, hogy Editor block update/publish nem módosítja a schedule_items rekordokat; a Schedule domain módosítása csak a canonical Schedule API-n keresztül történhet.
- F.2-03–05 céljai a deklarált schema, permission, stale/error state és cache-invalidation témákhoz általában illenek; ugyanakkor a source/field/version allowlist és cross-site/draft/private negatív esetek tényleges elfogadása továbbra is OPEN a 41.3.14-ben rögzített binding-határ miatt.

**F.3 — Inspector/layout source bullets, now split one-to-one:**
- F.3-01 Box alignment → EDT-010/016/021/022 is a candidate mapping; exact box-width/justify semantics must be validated for each supported layout mode.
- F.3-02 text alignment → EDT-017/021/022; heading/text semantic type remains independent of visual alignment.
- F.3-03 inner layout choices → EDT-016/021/022; only the tested Stack/Row/Columns/Grid subset may be exposed.
- F.3-04 vertical alignment → EDT-016/021/022; unsupported layout/value combinations must be disabled or rejected.
- F.3-05 size presets/custom units → EDT-009/021/022/023/024; accepted units, ranges and viewport behavior require explicit validation.
- F.3-06 independent spacers/gap/padding/margin → EDT-016/021/022 and DSN tokens where used. Horizontal and vertical values must remain independent; per-side and logical properties require tests.
- F.3-07 width/height/min/max/aspect/overflow/wrap/order/responsive constraints → EDT-009/016/021–026 and QA-005. Property-mode compatibility, invalid-value rejection and responsive inheritance remain OPEN.
- F.3-08 Canvas/Layers selection and drag/resize → EDT-003/004/008/009/013/016/021/022. The command/property route must preserve flex/grid, canonical selection, save/reload and public-render parity.
- F.3-09 plain Text baseline vs separately scoped Rich Text → EDT-017/019 and QA-002/004. Plain-text release scope must not be delayed by advanced rich text; no parallel text model or persistence path is allowed.

**Source-to-crosswalk cardinality correction:** the archive contains nine distinct F.3 bullets (archive lines 3347–3355). The former §37.27 crosswalk compressed them into five rows, so the previous count of 96 crosswalk rows did not mean four source bullets were absent from the §41.3.5 ARCH ledger; it meant four fewer aggregate rows. The §37.27 crosswalk is now split into nine source-level rows, preserving each original behavior and making the F.1–F.13 crosswalk total **100 rows**, aligned with the 100 source bullets. The original source bullet ledger remains the provenance record; this split does not by itself prove runtime acceptance.

**F.4 — Public page type mapping:**
- F.4-04 VOD/content hub mapping correction: the current §37.27 row now uses WEB-017 plus CNT-001–CNT-008 and INT-013–016; WEB-023 was removed because it is the Public Support page. **Acceptance OPEN:** verify VOD/clip/Short/playlist routes, tags/search/filter/related content, published-only visibility and manual fallback when provider APIs are unavailable.
- F.4-05 About/Link Hub/Press Kit mapping correction: the current §37.27 row now uses WEB-001, WEB-022, WEB-024 and CAM-004; unrelated WEB-025 Store/Product and WEB-026 Membership IDs were removed. **Acceptance OPEN:** verify separate routes, editable content, CTA/link validation, responsive behavior, privacy and public-render parity.
- F.4-06 basic interaction set → EDT-020/021/022, QA-004/005. A registryben EDT-020 Dynamic Sanci block configuration, EDT-021 Inspector Property Registry, EDT-022 Inspector schema validation; ezek nem általános interakció-/action-registry ID-k. A click/submit/open-close/toggle viselkedéshez EDT-039 (Interactions and action registry) szemantikailag közvetlenebb cél. **OPEN — EDT-039 hiányzik a mappingből.** A reduced-motion/focus/keyboard és interakciós események külön tesztelendők.
- F.4-07 advanced state machines/timeline/keyframes → EDT-040, QA-005, SEC-007, OPS-008. EDT-040 a motion/reduced-motion contract, de a state machine/action registry és az idővonal/keyframe capability nem következik belőle. **PARTIAL — advanced animation maradhat későbbi scope, de az action registry EDT-039, teljesítmény és permission határok külön acceptance-t igényelnek.**

**Döntés és folytatás:** ezek a sorok **OPEN/PARTIAL semantic exceptions**, nem bizonyított runtime hibák. A következő javítás nem puszta ID-csere: minden érintett sornál meg kell őrizni az eredeti bullet jelentését, rögzíteni kell a canonical owner/domain/surface/phase/dependency-t, majd pozitív és negatív tesztet, DoD-t és user acceptance-t kell rendelni hozzá. Az ID-registry változtatása csak a teljes kétirányú 359-ID reconciliáció után engedélyezett; addig a bizonytalan célok maradjanak explicit nyitottak.

**Státusz:** F.1–F.4 structural mapping megléte nem egyenlő semantic PASS-szal. A jelen review nem futtatott runtime tesztet, nem módosított alkalmazáskódot vagy adatot. P0.2 **IN PROGRESS / NOT PASS**; F.5–F.13 és a C.23 teljes bullet-szintű szemantikai review-ja továbbra is nyitott.

### 41.3.19. P0.2 — F.5–F.9 integrations, Schedule, Admin, analytics and release-quality crosswalk exceptions (2026-10-13)

**Hatókör:** a §41.3.5 F.5–F.9 bulletjeinek canonical ID céljai a §24 registry jelentéseivel összevetve. A megállapítások a mapping szemantikájára vonatkoznak, nem a feature runtime meglétére.

**F.5 — Content and provider integrations:**
- F.5-04 YouTube adapter sor: a követelmény quota/scope/fallback elemeket is tartalmaz, de a célok INT-013, ANL-004, CNT-002, CNT-003. INT-013 a YouTube channel/video/live adapter, viszont a quota/rate-limit contract INT-009, provider capability registry INT-018, integration diagnostics/recovery INT-020. **PARTIAL — az adapter-ID helyes, a sorban kimondott quota/scope/fallback acceptance nem teljesen látható a mappingben.** A scope visibility/connection permissions és a quota exhaustion negatív tesztet külön meg kell őrizni.
- F.5-05 TikTok „account-capability-gated” sor: INT-014 és INT-008/009 szerepel, de a registryben az explicit provider capability registry INT-018. **PARTIAL — a capability gate ID-je hiányzik a célok közül.** A fiókhoz ténylegesen elérhető műveleteket nem szabad feltételezni; tiltott/hiányzó capability esetén biztonságos manual fallback kell.
- F.5-06 „Discord link baseline; bot/role/status és Kick/OBS/email/payment/commerce adapters have own contracts” sor egyszerre INT-015/COM-001/SUP-006 és teljes OBS/STO tartományokat említ. A külső Discord link (COM-001), Discord bot/guild/role (INT-015), membership entitlement (SUP-006), OBS és commerce külön lifecycle- és permission-contract. **OPEN — a sor összevonása nem tekinthető egyetlen implementálható capabilitynek.** A 1.0 külső linket és a későbbi bot/role/payment/commerce integrációkat külön phase/acceptance bontásban kell tartani.
- F.5-07 provider fallback/no invented metrics → INT-001/018/020, LIV-002, DYN-005, ANL-008. A mapping összességében releváns; **acceptance OPEN**, mert minden adatmezőnél a provider, timestamp/freshness, missing-value és manual fallback viselkedést bizonyítani kell.

**F.6 — Schedule / Game Profile:**
- F.6-01 canonical Schedule fields/lifecycle/recurrence/source/external-ID mapping → SCH-001–SCH-015 és RES-013. A RES-013 registry-jelentése Font registry/weight/style/fallback; ez nem látszik relevánsnak a Schedule lifecycle és external-ID mapping követelményhez. **OPEN — RES-013 szemantikai eltérésgyanú.** Ne távolítsuk el vakon, amíg az eredeti bullet teljes szövegkörnyezete nincs ellenőrizve; ha nincs konkrét font/resource függőség, a crosswalkban superseded/incorrect target döntést kell rögzíteni.
- F.6-02 schedule list/calendar/upcoming/past/search/filter/sort/lifecycle → SCH-002/005/006. Ezek a nézetek és lifecycle egy részét lefedik, de a keresés/filter/sort külön UI/domain acceptance-e és a publikus renderhez tartozó SCH-010/WEB-016 határ nincs külön megmutatva. **PARTIAL mapping**; az Admin CRUD és a public Schedule page nem olvasztható össze.
- F.6-04 next stream/countdown → SCH-009/003/005, LIV-001, WEB-016. A célok relevánsak; acceptance-ben explicit módon kell tesztelni a site timezone/DST, cancelled/past/completed kizárást, stale/offline provider állapotot, illetve a publikus Schedule oldal és a countdown parity-t.

**F.7 — Admin shell, forms and permissions:**
- F.7-04 public forms → WEB-027, SEC-007, SEC-011, QA-006. A registryben WEB-027 a Public Events/Blog/News/Digital Products routes, míg WEB-020 a Public Contact page/form. **OPEN — a form-route cél-ID szemantikailag hibás vagy túl tág.** A WEB-020/WEB-027 közti szerepet az eredeti form scope alapján kell helyretenni; a server-side schema/required field, spam/rate limit, consent/purpose, privacy, success/error és no-secret logging külön acceptance marad.
- F.7-02 common UI states/validation/confirm/search/filter/pagination/keyboard/Hungarian UI → ADM-008, QA-005, EDT-027. ADM-008 a közös loading/empty/error/stale/success state-ekhez illik, de EDT-027 a Editor dirty state, nem általános Admin form validation vagy keyboard behavior. **PARTIAL — a közös admin UI contract és az Editor dirty state külön kezelendő.** A pontos owner a releváns ADM/domain route-ok szerint legyen meghatározva.
- F.7-03 session expiry/logout/inactivity/multi-tab/unsaved/server-side authorization → SEC-001/002/004, ADM-007, EDT-031. A session/auth és ownership mapping releváns; EDT-031 a network failure/retry/local recovery, nem általános multi-tab/session contract. **PARTIAL — az unsaved change, auth expiry és multi-tab konfliktus külön negatív acceptance-t igényel.**

**F.8 — Analytics, automation and AI:**
- F.8-02 metric source/period/freshness/missing values/API limits/retention/export/role; anomaly detection later → ANL-007–ANL-010, SEC-002. A registryben ANL-007–010 date-range/filter/export, freshness/source/missing data, consent/retention/bot filtering és anomaly detection/alerts. A leírás az anomaly detectiont későbbre teszi, miközben ANL-010 a célhalmazban van. **OPEN — fázisellentmondás:** az ANL-010 szerepelhet dependencyként/roadmap hivatkozásként, de nem számíthat 1.x acceptance-ként, ha a sor kifejezetten későbbre halasztja.
- F.8-03 automation lifecycle → AUT-001–014, SEC-003/010. Ez teljes registry-tartományú, releváns mapping; **MAPPED, acceptance OPEN** a dry-run/approval, cycle detection, retry/backoff/dead-letter, pause/kill switch, idempotency, permission/site scope és recovery tesztekig.
- F.8-04 AI edit safety → AI-003/005–009, AI-019, EDT-003, SEC-002. Releváns a canonical action/permission/approval lánc; AI-018 prompt injection/untrusted content tesztek, AI-004 privacy/context filter és AI-020 AI-free fallback azonban nem látszik a sorban. **PARTIAL — az AI safety cross-cutting szerződés nincs teljesen leképezve.** A 41.3.17 H31 auditban megjelölt ellenőrzésekkel összehangolandó, ID-t duplikálni nem szabad.
- F.8-07 stream intelligence → AI-014–016, ANL-003/006, OBS-003, LIV-006, SEC-011. A történeti lista élő/silence/speech/chat/audio/OBS/highlight/VOD/clip/feedback/opt-in memory capability-ket egyetlen sorba von össze. A 41.3.17 audit szerint AI-015 diagnosztika/summary, AI-016 specialist agent roles; a hosszú távú memória/preference/feedback nem bizonyítottan lefedett. **OPEN — a sor capability-alapú bontása szükséges**, consent, retention, provider capability, opt-out és emberi review szerint.
- F.8-08 AI Control Center/approval queue/evaluation → AI-017–020 és QA-008. Releváns célok, de AI-018 prompt-injection, AI-019 human approval, AI-020 AI-free fallback külön negatív tesztet és kritikus manuális workflow parity-t igényel. **MAPPED, acceptance OPEN.**

**F.9 — SEO, accessibility, security and performance:**
- F.9-02 redirect/broken-link tooling → SEO-004, SEO-005, WEB-008, SEC-002. A registryben SEO-004 sitemap/robots lifecycle, SEO-005 SEO preview/diagnostics, WEB-008 revision history/diff; a canonical redirect manager/broken-link report ID WEB-013. **OPEN — WEB-013 hiányzik, WEB-008 nem helyettesíti a redirect manager szerződést.** Redirect target validation, loop prevention, preview/approval, 404/broken-link report és audit acceptance külön szükséges.
- F.9-01 published SEO metadata → SEO-001–005, WEB-005/006. Az SEO-001–005 tartomány a per-page metadata, Open Graph, structured data, sitemap/robots és SEO diagnostics öt funkcióját lefedi, de a draft/preview non-indexable és publish/cache invalidation acceptance-et külön kell tesztelni; a cél-ID megléte nem bizonyítja a crawl viselkedést.
- F.9-04 security release gate → SEC-001–010, RES-003, INT-003, INT-017. A széles SEC-tartomány releváns, de az upload validation és webhook signature/replay külön route-specific negative tests maradnak; a „SEC-001–010” tartományt nem szabad úgy értelmezni, hogy minden védelmi teszt automatikusan PASS.
- F.9-06 performance budget → OPS-008, WEB-030, RES-004, QA-005. A targetek relevánsak, de a budget csak mérési környezet, cache state, image variant, viewport/device, large page/tree fixture, p75/p95 küszöb és baseline-frissítési szabály rögzítése után elfogadható.

**Következő lépések:** a nyitott sorokhoz forrás-bullet, canonical ID definíció, KEEP/MERGE/EXPAND/ADD/DEFER döntés, domain owner, surface, fázis, dependency, pozitív/negatív teszt, DoD és user acceptance kell. A jelen szöveg audit-eltéréseket rögzít; nem hajt végre vak ID-cserét, nem töröl capability-t, és nem állít runtime PASS-t.

**Státusz:** F.5–F.9 **PARTIAL / OPEN semantic review**. Nincs runtime kódmódosítás és ebben a körben nem futottak tesztek. P0.2 **IN PROGRESS / NOT PASS**; F.10–F.13 és a C.23 teljes bullet-szintű review-ja továbbra is nyitott.

### 41.3.20. P0.2 — F.10–F.13 recovery, roadmap, localization, Game Profile and domain crosswalk exceptions (2026-10-13)

**Hatókör:** a §41.3.5 F.10–F.13 minden bulletjének cél-ID-ját a §24 registry definícióival vetettem össze. Ez a tervszintű semantic review; nem helyettesít backup/restore drillt, runtime tesztet, privacy auditot vagy user acceptance-t.

**F.10 — Backup/import/export/recovery:**
- F.10-01 versioned export of Page/revision/theme/template/component/media refs/domain data → OPS-005, WEB-008, DSN-015, RES-001, SEC-008. A célok részben relevánsak, de WEB-008 a revision history/diff (nem export package), DSN-015 template import/export (nem minden domain-data package), RES-001 canonical asset registry/IDs (nem a binary-storage metadata contract). **PARTIAL — a verziózott teljes package/export szerződéshez külön kell választani az export manifestet, asset references, binary handling, schema/version compatibility és secret exclusion acceptance-et.** OPS-005 backup/export/restore nem jelent automatikusan, hogy minden Page Model/theme/template/domain payload importálható és kompatibilis.
- F.10-02 import dry-run/schema/version/assets/duplicate IDs/owner/permissions/migration compatibility → OPS-004/005, WEB-008, DSN-015, SEC-002. OPS-004 migration preflight/integrity és DSN-015 template import/export releváns, de WEB-008 revision history/diff nem általános import parser/validator. **PARTIAL — az import package schema/version, duplicate-ID és owner/permission validáció explicit acceptance-e hiányzik a mappingből.** A dry-runnak semmilyen D1/R2 mutationt nem szabad végeznie; a valódi import csak jóváhagyott, tranzakciós/rollback-safe útvonalon futhat.
- F.10-03 recovery preview/conflict/integrity/backup verification/post-restore consistency → OPS-005/006/009, WEB-007/008, EDT-028. Ez szemantikailag releváns, de EDT-028 csak save/reload round-trip; a recovery utáni Page Model/revision/public-render consistency és data-integrity acceptance külön bizonyítandó. **MAPPED, acceptance OPEN** a sikeres restore, szándékosan hibás backup, részleges restore, conflict és rollback negatív tesztig.
- F.10-04 diagnostics → OPS-001–008, SEC-008/011. A mapping releváns; az acceptance külön ellenőrzi, hogy correlation ID/latency/provider errors jelen vannak, de secret/token és szükségtelen személyes adat nincs a logban.

**F.11 — Phase roadmap:**
- F.11-01 1.0 release scope a §39.2-re és a teljes WEB/ADM/EDT/RES/SCH/INT/SEO/QA tartományokra hivatkozik. Ez scope-összefoglaló, nem egyedi acceptance: minden tartományt saját fázis-DoD, release gate és bizonyíték alapján kell lezárni. **MAPPED AS ROADMAP, nem PASS.**
- F.11-02–04 a 1.x/2.x/3.x+ capability-ket széles ID-tartományokkal összefoglalja. A tartományos hivatkozás történeti feature-preservationre jó, de nem jelentheti azt, hogy minden benne foglalt ID automatikusan ugyanabba a fázisba kerül vagy a parent sor teljes acceptance-t kap. **OPEN — a roadmap phase és a registry feature-level phase mezőinek konfliktusát külön reconciliálni kell.**

**F.12 — Product context and localization:**
- F.12-01 Hungarian-first / international-ready → LOC-001–006, SET-001, WEB-001. A mapping lefedi a locale model alapjait, de a 1.0 „architecture-ready” nem egyenlő a teljes fordítási workflow, localized SEO/hreflang vagy AI translation megvalósításával. **MAPPED, phase boundary OPEN**; a magyar UI alap és a későbbi teljes locale workflow külön DoD-t kap.
- F.12-02 configurable gaming profile/game list → SCH-012–014, WEB-022, RES-013, SET-001. SCH-012–014 és SET-001 relevánsak; WEB-022 a Public Link Hub, RES-013 a Font registry. Ezek nem látszanak közvetlenül a játékprofil-admin/configuration contract részének, kivéve ha a forrás kifejezetten a publikus Link Hubot vagy fontot érint. **OPEN — WEB-022/RES-013 target indoklása szükséges**, nem szabad azokat a sor puszta ID-megőrzése miatt automatikusan helyesnek venni.
- F.12-03 editable TikTok handle/5,000-follower personal goal → INT-014, SET-001, WEB-010, ANL-004. A handle/profile config és későbbi provider metrics különböznek: INT-014 a capability-gated adapter, ANL-004 content/platform analytics, SET-001 site settings. **PARTIAL — a személyes cél konfigurációs adat, nem garantált metrika; a provider metric csak jogosultság és tényleges adat esetén jelenhet meg.**
- F.12-04 weekly stream cadence as Schedule data → SCH-001–003/SCH-009; ez a canonical Schedule modellel összhangban van. Acceptance-ben ellenőrizendő, hogy nincs hardcoded heti szabály és a timezone/DST helyes.

**F.13 — Game Profile, custom domains, brand, Link Hub, email and future platform:**
- F.13-03 missing Game Profile artwork/metadata fallback → SCH-013, RES-013, DYN-005, EDT-022. RES-013 a Font registry, nem játék-cover/artwork registry; a media/resource canonical IDs RES-001/004/008/010/015 relevánsabbak lehetnek. **OPEN — RES-013 szemantikai eltérésgyanú.** A végső cél-ID-ket a Game Profile artwork tényleges tárolási szerződése és a resource registry alapján kell dönteni.
- F.13-05 custom-domain lifecycle → SET-002, WEB-012, SEO-001/005, OPS-001, SEC-006. Ezek lefedhetik a site scope, route, SEO, deployment/health és redirect-safety egyes részeit, de a domain ownership verification, DNS challenge, primary-domain transition, SSL provisioning/renewal és unverified-domain deny behavior nincs külön canonical ID-ként egyértelműsítve ebben a mappingben. **OPEN — a domain lifecycle acceptance-t a roadmap 4.0+ kapujához külön kell bontani; WEB-012 (route registry/404) önmagában nem custom-domain lifecycle.**
- F.13-11 signup/subscribe consent → COM-015/017, SEC-011. Releváns mapping, de acceptance-nek meg kell őriznie a purpose/version/timestamp, unsubscribe/suppression, retention/export/delete és no-marketing-after-unsubscribe negatív eseteket.
- F.13-12 subscriber list/segments/campaign/newsletter/transactional email/templates/opt-out/bounce/rate/consent history → COM-015–018, CAM-002, SEC-011, INT-020. INT-020 a registry szerint integration diagnostics/recovery, míg a későbbi payment/email/commerce adapter INT-021. **OPEN — az email provider adapter cél-ID-je hiányzik, INT-020 nem helyettesíti a delivery/provider contractot.** A marketing vs transactional separation, bounce/failed delivery, suppression, retry, consent proof és provider capability külön acceptance-t igényel.
- F.13-13 marketing vs transactional email, unsubscribe, privacy export/delete/retention → COM-016/017, SEC-011, OPS-005. SEC-011 a consent/retention/export/delete canonical security/privacy contract; OPS-005 backup/export/restore viszont nem azonos az egyénhez kötött privacy data exporttal. **PARTIAL — az OPS-005 csak backup/package export esetén releváns, a privacy request teljesítését SEC-011/COM-017 acceptance alapján kell igazolni.**
- F.13-17 SaaS plan/billing/quota/invoice/change/cancel → TEAM-006, STO-019, CAM-009, OPS-008. TEAM-006 a SaaS billing/plan entitlements/quota, de STO-019 merchant-of-record/provider decision és CAM-009 invoice/payment status after legal review nem bizonyítja a teljes billing lifecycle-t; OPS-008 performance/cache/query monitoring szemantikailag nem billing quota/usage ledger. **OPEN — OPS-008 target mismatch gyanú.** A fázis 4.0–5.0, és a billing/quota csak cost/usage/legal evidence után aktív.
- F.13-18 responsive web/PWA/native app option → WEB-014–032, ADM-010, QA-004/005. Ez túl széles publikus-web tartomány, amely Store/Membership/Events/SEO/cache/error/security oldalakat is tartalmaz; a későbbi PWA/native appot nem szabad ezekkel az ID-kkel úgy kezelni, mintha a mobilalkalmazás capability már definiált volna. **MAPPED AS DIRECTION, implementation/owner OPEN**; PWA/native app csak külön platform scope után.
- F.13-21 future marketplace → DSN-014/015, OBS-001–010, STO-012, MKT-001–005, CAM-009. A scope történeti megőrzésre alkalmas, de marketplace listing/install/uninstall, license/attribution, moderation/payment/revenue-share és OBS overlay asset compatibility külön lifecycle; **DEFER, acceptance OPEN**, nem aktív 1.0 funkció.

**Kötelező folytatás:** a fenti OPEN/PARTIAL soroknál külön kell rögzíteni a forrás szövegkörnyezetét, canonical ID/owner döntést, fázist, függőséget, DoD, pozitív/negatív teszteket és elfogadási bizonyítékot. A WEB/RES/OPS/INT ID-k nem cserélhetők pusztán a címke alapján; minden módosítás előtt a kétirányú 359-ID crosswalkot újra kell ellenőrizni.

**Státusz:** F.10–F.13 **PARTIAL / OPEN semantic review**. Ez a kör kizárólag tervszintű auditot rögzít; runtime kódot/adatot nem módosítottam és tesztet nem futtattam. P0.2 **IN PROGRESS / NOT PASS**; a C.23 teljes bullet-szintű semantic review és a forráseredet nyitott kérdései továbbra is aktívak.

### 41.3.21. P0.2 — C.23.7–C.23.21 Inspector, components, binding, resources and acceptance crosswalk exceptions (2026-10-13)

**Forrás és módszer:** az archív C.23.7–C.23.21 egyedi bulletjeit a §41.3.5 source-key ledger sorain keresztül ellenőriztem a §24 canonical registry ID-definícióival. A forrás-bullet ledger 210 C.23 sort őriz, de a sok helyen alkalmazott széles ID-tartományok nem bizonyítják az egyes capability-k szemantikai lefedését. Az alábbiak célzott kivételek; nem a teljes C.23 PASS.

**C.23.7 — Inspector / Property Registry:**
- C.23.7-01 Inspector kategóriái → EDT-021/022/017–020, WEB-032 és SEC-001–011. A központi property contract ID-jei relevánsak; a teljes SEC-001–011 tartomány azonban nem jelent minden Inspector kategóriához igazolt security requirementet. A Data/Bindings, SEO és Accessibility kategóriáknak a DYN, SEO és QA/WEB canonical szerződéseihez kell kapcsolódniuk. **PARTIAL — túl tág cross-cutting mapping; kategóriánkénti owner/permission és supported-node mátrix szükséges.**
- C.23.7-05 input/unit/min/max/enum/dependency validation → EDT-021/022, EDT-009, WEB-032. Releváns célok, de a data binding source/field/version validation DYN-002, site/published scope DYN-007, és a domain input validation szerződések nem helyettesíthetők az Inspector property validatorral. **OPEN — a kliensoldali Inspector és a szerveroldali domain/publish validáció határát explicit módon kell megtartani.**
- C.23.7-09 advanced CSS/custom attributes sandbox/security → SEC-001–011, EDT-021/022, WEB-032. A széles SEC-tartomány nem önálló sandbox contract; a custom CSS/attribute subsetet, allowed URL/property setet, escapinget és arbitrary script tiltását konkrét negatív tesztekkel kell igazolni. **OPEN — a mapping csak jelölt lefedettség.**

**C.23.8 — Component catalog:**
- C.23.8-07 Form shell/fields/validation/accessibility → EDT-019, SEC-001–011, WEB-032. A registryben WEB-020 a public Contact page/form; a secure submit handlernek ezen felül konkrét canonical domain/API owner, server-side schema, CSRF/spam/rate limit, consent/privacy és error/success contract kell. **PARTIAL — az element schema és a valódi form submission/domain workflow külön capability.**
- C.23.8-09 Twitch/Schedule/VOD/social/support creator blocks → EDT-020, SCH-009–011, INT-001–018, LIV-001–007, RES-011. A capability-családok relevánsak, de egyetlen broad mapping nem bizonyítja, hogy minden block az adott provider capability-t ellenőrzi, a titkot nem teszi kliensre, és egységes stale/offline/error state-et mutat. **MAPPED AS INVENTORY; per-block acceptance OPEN.**
- C.23.8-11 future commerce blocks → STO-001–020, WEB-025/026 és SEC-001–011. A Store/Product route WEB-025 releváns; WEB-026 Membership külön domain. A Page Model content nem birtokolhat order/payment/entitlement state-et, és az external checkout boundary külön permission/provider acceptance-t igényel. **OPEN — commerce és membership ne legyen egyetlen implicit owner.**

**C.23.10 — Motion and interaction:**
- C.23.10-04 duration/easing/delay/trigger/target/replay/reduced-motion → EDT-040, DSN-001/005 és SEC-001–011. EDT-040 a motion/reduced-motion contract; a teljes SEC-tartomány nem specifikus motion mapping, és a teljesítmény- illetve accessibility acceptance-hez QA-005/OPS-008 relevanciáját külön kell vizsgálni. **PARTIAL — a reduced-motion, keyboard/focus, motion conflict és performance guardrail külön teszt.**
- C.23.10-08 motion + third-party embeds guardrails → EDT-040, WEB-032, SEC-001–011, OPS-005. OPS-005 a registryben backup/export/restore; ez nem performance/privacy/accessibility guardrail. **OPEN — OPS-005 szemantikai eltérésgyanú.** A konkrét elvárás szerint QA-005, OPS-008, SEC-011 és a safe-embed/security szerződés relevanciáját kell ellenőrizni, de a cél-ID-t csak teljes crosswalk után szabad módosítani.

**C.23.11–C.23.12 — Page/site shell and dynamic data:**
- C.23.11-03 page type/template assignment → WEB-001–028, DSN-008/009, SCH/CNT/STO tartományok. Ez az egész public route katalógust és több domaincsaládot felsorol; **OPEN — túl tág, nem teszi láthatóvá, hogy mely page type mely canonical ownerhez és mely fázishoz tartozik.** A célokat page-type-onként kell bontani, különös tekintettel a Schedule, Creator Profile, Contact, Support és későbbi Commerce oldalakra.
- C.23.12-01 collection/schema designer → DYN-001–008, WEB-025/026 és SEC-001–011. A generic collection schema nem azonos a Store és Membership route-okkal; a DYN schema/binding contract a releváns alap. **PARTIAL — WEB-025/026 célok csak akkor tarthatók meg, ha a forrás konkrét commerce/member collection use case-t nevez meg.**
- C.23.12-09 „D1 domain records remain domain-owned; Page Model stores binding/reference/config only” → DYN-001–008, SCH-001–015, INT-001–021, EDT-001/020, SEC-002. A no-duplicate-domain-state invariáns releváns, de a teljes Schedule/Integration ID-tartomány túl tág; az elfogadásnak konkrétan azt kell bizonyítania, hogy a Page Model nem írhat domain-owned schedule_items vagy integration state rekordokat. **OPEN — explicit negative mutation test és save/publish/public-render bizonyíték kell.** A 41.3.14 általános data-binding contract résével összhangban ez még nem PASS.

**C.23.13 — Resource/media ownership:**
- C.23.13-02 upload/drop/multi-upload/progress/retry/type-size/object key/ownership → RES-001–015, OPS-005, SEC-001–011. RES-003 az upload validation/progress/cancel/retry, RES-002 R2 binary + D1 metadata, SEC-002/003 ownership/site isolation; OPS-005 backup/export/restore nem önmagában upload acceptance. **PARTIAL — OPS-005 túl tág vagy nem releváns target; külön upload, MIME/content, size, object-key, site-owner és retry-negative teszt szükséges.**
- C.23.13-10 R2 binary / D1 metadata / no second storage owner → RES-001–015, OPS-005, SEC-001–011. A közvetlen canonical mapping RES-002; a széles RES/SEC tartomány és OPS-005 nem bizonyítja a binary/metadata ownership invariáns runtime betartását. **OPEN — D1 metadata és R2 object-key/owner/reference integritás tesztelendő; backup contract külön marad.**

**C.23.14 — Save/publish/recovery:**
- C.23.14-02 autosave debounce/retry/cancel/dirty reconciliation → EDT-027–034, WEB-004–008, OPS-008. A célok a dirty/save/reload/publish/history területet részben fedik; a registryben EDT-030 az in-flight edit preservation, EDT-031 network failure/retry/local recovery és EDT-042 no-data-loss guard. **PARTIAL — ezeket a konkrét ID-ket és a save közbeni új edit, cancel, retry, stale response és refresh/tab-close teszteket explicit módon kell igazolni.**
- C.23.14-07 API/network failure recovery/no duplicate commands/stale overwrite → EDT-027–034, WEB-007/008, OPS-008/009. OPS-008 performance baseline/cache/query monitoring; nem elsődleges network failure recovery owner. **OPEN — OPS-008 target mismatch gyanú**, az EDT-031/042 és OPS-003 error tracking, OPS-009 incident/rollback szerepét külön kell ellenőrizni.
- C.23.14-09 import/export/backup/restore schemas → OPS-004–009, WEB-007/008, RES-001–015, SEC-002. A széles tartományok lefedhetnek több szükséges részterületet, de nem igazolják a schema-version, dry-run no-write, asset reference, migration compatibility, permission és rollback viselkedését. **MAPPED AS CANDIDATE; acceptance OPEN.**

**C.23.16 — Accessibility/privacy/security:**
- C.23.16-06 consent/privacy for analytics/embeds/cookies/marketing + no secrets in Page Model/client output → SEC-001–011, OPS-005, QA-003/008. SEC-011 consent/retention/export/delete és SEC-008 secret storage/redaction a közvetlenebb registry-elem; OPS-005 backup/export/restore nem helyettesíti a consent vagy privacy request lifecycle-t. **PARTIAL — a backup és privacy export/consent fogalmi határát külön kell tartani.**
- C.23.16-08 destructive/global mutation confirmation/audit/recovery → SEC-001–011, OPS-005/009, QA-003/006. A teljes SEC-tartomány túl tág; a követelményhez explicit confirmation/approval, SEC-010 audit log, OPS-009 rollback és az érintett domain permission kell. **OPEN — minden destructive actionnél külön owner/permission/undo-or-restore acceptance.**

**C.23.18–C.23.21 — Provider blocks, extensibility and quality:**
- C.23.18-02 YouTube/TikTok/Discord „1.0 static link/basic embed only” → INT-013–016, WEB-022/026 és SEC-001–011. Az INT-013–016 a YouTube/TikTok/Discord/Kick API adapterek; a statikus link alaphoz WEB-022 Link Hub / COM-001 external community links illik. **OPEN — a statikus link és az API-backed integration fázisok össze vannak mosva.** A provider API scope nem lehet előfeltétel egy sima külső linknek, és a link jelenléte nem bizonyít OAuth/API-integrációt.
- C.23.18-06 future OBS/overlay blocks → OBS-001–010, SEC-001–011, OPS-005. Az OBS targetcsalád releváns, de OPS-005 backup/export/restore nem bizonyítja a Stream Studio/browser-source runtime contractot. **OPEN — külön OBS secure pairing, allowed command, test mode, overlay preview/export és public/editor isolation acceptance szükséges.**
- C.23.20-05 AI preview/diff/validation/approval/undo/audit → AI-001–020, EDT-005/032, SEC-001–011, OPS-005. A teljes AI-tartomány csak a feature registry jelenlétét mutatja; a konkrét biztonsági lánc AI-004 context/privacy, AI-006 permissions, AI-007 approval, AI-008 canonical execute, AI-009 verify/audit/version, AI-018 prompt-injection és AI-019 human approval. OPS-005 backup nem helyettesíti az undo/rollback acceptance-t. **PARTIAL — explicit AI safety negative tests and rollback proof required.**
- C.23.21-01–11 quality matrix minden sora QA-001–008-ra mutat. Ez túl tág: például a production runtime acceptance QA-006, a browser/device acceptance QA-004, a user acceptance/evidence log QA-009, a benchmark/continuous discovery QA-010. **OPEN — a QA crosswalkot tesztfajtánként kell pontosítani; egy QA-tartomány felsorolása nem bizonyítja a teszt lefutását vagy sikerét.**

**Döntés:** a C.23.7–C.23.21 soroknál több target releváns, de a broad range-ek, a backup/performance targetek és a statikus-link/API-integráció összemosása miatt a szemantikai lezárás **OPEN**. A mapping javításakor az eredeti bullet teljes jelentését meg kell tartani; nem törölhető funkció és nem hozható létre új ID a 359-es registry teljes kétirányú ellenőrzése előtt.

**Státusz:** C.23.7–C.23.21 célzott semantic review rögzítve, de a C.23.1–C.23.22 teljes bullet-by-bullet elfogadása még OPEN. Nincs runtime kód/adat módosítva, teszt nem futott. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.22. P0.2 — C.23.1–C.23.6 preset, canvas, hierarchy and layout crosswalk exceptions (2026-10-13)

**Hatókör:** az archív C.23.1–C.23.6 minden egyedi bulletje szerepel a §41.3.5 source-key ledgerben; ez a kör a jelölt ID-k definícióit ellenőrzi, és a már rögzített 41.3.9/41.3.12 canvas/layout megállapításokat kiegészíti. A benchmark-forrás felsorolása önmagában nem licenc-/kompatibilitási review, a crosswalk pedig nem runtime acceptance.

**C.23.1 — Benchmark sources:**
- C.23.1-01–05 a Webflow, Wix Studio, Elementor, WordPress/Gutenberg és Framer képességeket QA-010 benchmark review-ként, plusz EDT/DSN/DYN/SEO/WEB jelölt ID-kkal tartja nyilván. Ez megfelelő kiinduló leltár, de a mapping nem mutatja, hogy az egyes hivatkozott capability-ket, aktuális termékdokumentációt, licencet és a SANCI canonical contracttal való különbséget tételesen ellenőriztük. **OPEN — benchmark review csak akkor PASS, ha minden egyes összehasonlításból REUSE EXISTING / ADOPT OPEN SOURCE / ADAPT VIA CANONICAL CONTRACT / BUILD IN-HOUSE — JUSTIFIED / FORK — MAINTENANCE PLAN REQUIRED döntés és indok keletkezik.** Nincs engedélyezve zárt forrású termék kódjának másolása, és a felsorolt példák nem bizonyítják a piac teljes körű felmérését.

**C.23.2 — Preset/template/reusable concepts:**
- C.23.2-03 preview/undo/destructive confirmation → EDT-005, EDT-032, EDT-039, DSN-004. Ez releváns, de a global preset/token változás impact-preview és rollback mellett az érintett master/instance/template contractot is bizonyítani kell; egyetlen DSN-004 címke nem igazolja a preview state no-mutation vagy a shared-instance propagation szabályt. **PARTIAL — acceptance-nek külön kell fednie a preview no-write, explicit approval/confirmation, undo/rollback és affected-instance diff eseteket.**
- C.23.2-06 existing instance changes after preset update → DSN-003/004/012–014, EDT-027–031. A registryben DSN-012 master/instance, DSN-013 variants/slots/overrides és DSN-014 version compatibility/migration a relevánsak; EDT-027–031 save/reload/conflict/network recovery tartomány, nem önmagában a shared component propagation contract. **OPEN — master update vs instance override, synced/unsynced behavior, version migration és explicit user confirmation külön decision/acceptance kell.**
- C.23.2-09 permissions/audit/export/backup/delete-use checks → SEC-001–011, OPS-005, DSN-015, RES-008/009. A teljes SEC-tartomány túl tág, és a preset lifecycle-ben a permission/audit/backup külön szerepek: SEC-002 authorization, SEC-003 scope isolation, SEC-010 audit, OPS-005 backup/export/restore, RES-008 usage/reference map, RES-009 delete/restore safety. **PARTIAL — a végleges crosswalknak ezeket szerep szerint kell külön kezelnie; a tartományos mapping nem bizonyítja az egyes tesztek teljesülését.**

**C.23.3 — Canvas interactions:**
- C.23.3-02 minimap/overview → EDT-007/025/035. A viewport/preview/mobil szerkesztő célok részben relevánsak, de a minimap nem külön canonical feature ID. **OPEN — a minimap/overview legyen explicit KEEP/DEFER döntés a Canvas viewport contractban; ne állítsuk késznek pusztán a zoom/pan/fit megléte miatt.**
- C.23.3-04 rotation handle/anchor/origin/transform preview → EDT-006–010, EDT-021/022. A selection/geometry/property IDs relevánsak, de a forrás „where supported” korlátozása miatt a rotation/transform schema támogatását külön kell megnevezni. **PARTIAL — nem támogatott rotation/3D funkció nem jelenhet meg aktív UI-ként; supported subset, cancel/undo és public-render parity külön acceptance.**
- C.23.3-07 keyboard movement, duplicate/delete, undo/redo, copy/paste, z-order → EDT-005, EDT-011, EDT-038/039. A command/history és copy/paste/action registry releváns, de az EDT-037 keyboard-accessible canvas alternatives külön accessibility capability. **OPEN — a billentyűparancsok megléte nem bizonyítja a teljes keyboard-only canvas operálhatóságot; fókusz, shortcut conflict, disabled state és screen-reader feedback külön QA-004/005 tesztet igényel.**
- C.23.3-09 command palette/quick actions/searchable Add/favorites/shortcuts → EDT-015, EDT-039, EDT-037. A célok relevánsak, de az EDT-015 element/block library, EDT-039 action registry és EDT-037 keyboard canvas nem egyetlen command palette contract. **PARTIAL — a parancslista, keresés, shortcut binding, permission filtering és minden művelet canonical handlerhez rendelése külön acceptance.**
- C.23.3-11 editor overlays excluded from public output → EDT-034, WEB-032, SEC-005, QA-002/003/004. A renderer parity és safe output céljai relevánsak; acceptance-nek explicit DOM/render-output negatív assertiont kell tartalmaznia, amely tiltja a selection outline/resize handles/Inspector-only metadata publikus megjelenését. **MAPPED, runtime proof OPEN.**

**C.23.4 — Page Model / Layers / hierarchy:**
- C.23.4-03 layer visibility/lock distinct from public visibility/conditional rendering → EDT-014, EDT-026, WEB-031. WEB-031 registry-jelentése published-only data visibility enforcement, nem a conditional visibility engine; DYN-004 a conditional rendering/visibility ID. **OPEN — WEB-031 lehet releváns a published-only boundaryhez, de nem helyettesíti a DYN-004 célját.** Acceptance: Layers hide/lock kizárólag editor-layer állapotot változtat, és nem változtatja meg a publikus conditional rendering szabályt.
- C.23.4-06 empty container/section/page drop target → EDT-008, EDT-015/016, EDT-041. A célok relevánsak, de az üres állapotból hozzáadásnak egyértelműen támogatnia kell a valid parent/child mátrixot és a reachable empty-state UX-et; invalid child drop/circular parent elutasítás külön negatív teszt.
- C.23.4-07 copy/cut/paste cross-page and safe references → EDT-002/011/038/039, RES-001/008, DYN-002/007, SEC-003. Ez megfelelő candidate mapping; acceptance-nek külön kell ellenőriznie a friss node ID-ket, target page/site permissiont, dangling resource/binding references-t, secret/private fields kizárását és a source/target rollbacket.
- C.23.4-10 reusable component instance/master definition → DSN-012/013, EDT-001/002/021/022. A célok relevánsak, de a synced vs unsynced component, instance override és main-definition propagation szerződésnek külön kell rögzítenie, mi változik master updatekor és mi marad lokális. **MAPPED, acceptance OPEN.**

**C.23.5 — Layout/geometry/CSS property scope:**
- C.23.5-01–16 a széles EDT/DSN/RES/WEB ID-k mellett többféle CSS behavior-t említ. A 41.3.12 audit már rögzítette, hogy a vizsgált property registry/render map nem igazolta a teljes flex/grid property subsetet, és az unknown CSS string validációja nem bizonyítja a teljes CSS/unit/viewport kompatibilitást. **OPEN — minden display/position/flex/grid/spacing/overflow/transform propertynél explicit supported subset, schema validation, serialize/deserialize és public-render parity kell; a tervben felsorolt CSS fogalom nem egyenlő támogatott funkcióval.**
- C.23.5-03 units and clamp/min/max/calc-like values → EDT-021/022, EDT-023/024, DSN-006. A responsive token ID-k relevánsak, de nem helyettesítik a parse/validation contractot. **OPEN — minden engedélyezett unit/expression pontos allowlistje, numeric range, invalid-input elutasítás és viewport matrix teszt szükséges.**
- C.23.5-04 fixed/sticky/absolute/z-index/stacking context → EDT-009/016, EDT-021/022, WEB-032. A mapping releváns, de a containing-block/stacking-context diagnosztika és a sticky/overflow konfliktus csak explicit supported behavior és browser acceptance mellett tekinthető késznek. **PARTIAL — a nem támogatott positioning value-nak láthatóan tiltottként kell szerepelnie, nem csendben elmentődnie.**
- C.23.5-06 Grid named areas/auto-fit/auto-fill/minmax → EDT-016, EDT-021/022. **OPEN — Grid csak a ténylegesen validált és renderer által támogatott részhalmazban hirdethető meg; unsupported named areas/placement/auto-flow esetek negatív tesztje szükséges.**
- C.23.5-11 background blend/video, gradients, shadow/opacity → EDT-021/022, EDT-040, DSN-001–007, RES/WEB/QA. A széles célhalmaz releváns lehet, de a background video és blend mode performance/privacy/accessibility kockázata külön phase gate; ne kerüljön a baseline acceptance-be bizonyíték nélkül.
- C.23.5-15 Inspector numeric edit and canvas drag same command/property path → EDT-003/004/009, EDT-021/022, EDT-039. Ez fontos canonical invariant. **MAPPED, acceptance OPEN**: azonos node/property esetén az Inspector és drag ugyanazt a végső Page Model értéket kell előállítsa, azonos validation/history/save-reload útvonallal.
- C.23.5-16 computed/inherited/overridden vs invalid CSS → EDT-021–024, EDT-028, WEB-032. A célok relevánsak, de a 41.3.12 által megjelölt unknown-string validation rés miatt ez nem PASS; invalid/unrecognized property/unit/viewport combination nem menthető csendben.

**C.23.6 — Typography, design tokens and global styles:**
- C.23.6-06 token create/rename/usage search/change/delete dependency check → DSN-003/004, DSN-001, SEC-001–011. A registryben DSN-003 usage/dependency map és DSN-004 global change diff/rollback releváns; a teljes SEC-tartomány nem token-lifecycle owner. **PARTIAL — global-token mutationhoz explicit SEC-002 permission, SEC-010 audit és dependency-aware rollback kell, a többi security ID-t csak tényleges dependency esetén szabad hozzárendelni.**
- C.23.6-07 token vs literal convert/detach/reset/impact preview → DSN-001–004, EDT-021–024. **MAPPED, acceptance OPEN**: a token/literal különbség látszódjon, az impact preview ne módosítson állapotot, detach/reset ne írjon át más propertyt, és undo/rollback állítsa vissza az érintett értékeket.
- C.23.6-08 light/dark/high-contrast theme variations → DSN-005/006, DSN-001–004, EDT-040. A source kifejezetten előkészítést ír elő, a tényleges váltást csak explicit theme support esetén. **DEFER/PHASE GATED**: a nem támogatott theme switch nem jelenhet meg működő UI-ként, és nem számíthat 1.0 PASS-nak.
- C.23.6-09 font asset/license/fallback → DSN-007, RES-013, RES-007/015. A mapping releváns; acceptance-ben külön licencmetaadat, font load failure, fallback, FOIT/FOUT/performance és törlés/replace usage-impact esetek szükségesek.
- C.23.6-10 global style change impact preview/undo → DSN-003/004, DSN-012–014, EDT-005/032. **MAPPED, acceptance OPEN**: az érintett oldalak/komponensek listája teljes, a preview nem ír adatot, a jóváhagyás után a változás visszavonható, és a master/instance override policy következetes.

**Döntés:** a C.23.1–C.23.6 mappingben a benchmark- és preset-registry szintű lefedettség több helyen ésszerű, de a nem támogatott CSS/layout subset, Layers/public conditional visibility, túl tág SEC-tartományok és shared-instance propagation miatt a szemantikai lezárás **OPEN**. A következő crosswalk-javítás csak a teljes source-key és 359-ID bidirectional audit részeként végezhető; nem lehet capability-t törölni vagy egy létező ID puszta jelenlétét PASS-nak tekinteni.

**Státusz:** C.23.1–C.23.6 célzott semantic review rögzítve; C.23.1–C.23.22 teljes forrás-bullet acceptance továbbra is OPEN. Runtime kód/adat nem módosult, teszt nem futott. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.23. P0.2 — Explicit feature-ID references versus range-only coverage (2026-10-13)

**Structural recheck:** the §24 registry contains **359 unique stable IDs** with no duplicate definition. The C.23 source ledger contains **210 individual source rows**; the F.1–F.13 source ledger contains **100 individual source rows**, and the active F crosswalk now contains **100 rows** after F.3 was split to preserve all nine original bullets. The H19–H34 ledger contains **271 rows**. These counts establish inventory cardinality only, not semantic correctness.

**Range-only review:** before the explicit mapping refinements in the preceding commit, 22 registry IDs appeared after §24 only through a broad ID range and had no individual exact reference. The crosswalk has now been made explicit for the source-backed capabilities that can be safely tied to an existing source row (including WEB-015, RES-012, INT-004, CNT-008/CNT-014, STO-002/STO-003/STO-017, SUP-003, AUT-003, CAM-006 and MKT-002–MKT-004). Within the source crosswalk tables (excluding audit commentary), the remaining **five range-only IDs** are STO-016, SUP-005, SUP-007, SUP-008 and SUP-011. AUT-010 and AI-004 are now explicit in the F.8 automation/AI rows; COM-003 and COM-007 are explicitly retained in F.11-02, though their detailed contracts remain open.

- **COM-003 — Community posts:** F.11-02 now explicitly retains this as a planned community capability under the 1.x/2.0 community roadmap. It is not 1.0 runtime scope. **DEFER / phase-specific contract OPEN:** authoring/moderation roles, post visibility, abuse/spam controls, report/remove/audit, user privacy and negative authorization tests must be defined before implementation.
- **COM-007 — Comments/reactions:** F.11-02 now explicitly retains this planned capability, but it must not be inferred from a generic community link or post feed. **DEFER / phase-specific contract OPEN:** who can comment/react, rate limits, moderation, block/report, deletion/retention and abuse tests are required.
- **STO-016 — Abandoned cart:** no individually keyed historical bullet currently establishes this capability; broad store ranges alone are not enough. **UNMAPPED HISTORICAL SOURCE / NEW-ROADMAP DISPOSITION OPEN.** It may only be planned after the canonical store/order/provider and consent-aware notification contracts are defined; do not treat it as a 1.0 requirement or implement it during P0.
- **SUP-005 — Perks and member-only access:** no individual source-key mapping currently proves this entitlement capability. **UNMAPPED HISTORICAL SOURCE / NEW-ROADMAP DISPOSITION OPEN.** It requires a canonical entitlement/access policy, server-side route/API/content checks, expiry/revocation and cross-site/private-content negative tests; a Membership page alone is not member-only access.
- **SUP-007 — Membership renewal/cancel/failed payment:** no individual source-key mapping currently proves the membership billing lifecycle. **UNMAPPED HISTORICAL SOURCE / NEW-ROADMAP DISPOSITION OPEN.** Requires a provider/legal decision, verified webhook/idempotency, renewal/cancel/failed-payment state transitions and entitlement consistency tests.
- **SUP-008 — Refund/chargeback entitlement handling:** no individual source-key mapping currently proves membership refund/chargeback effects. **UNMAPPED HISTORICAL SOURCE / NEW-ROADMAP DISPOSITION OPEN.** It is distinct from store-order refunds; must define provider events, entitlement revocation/retention, audit and recovery tests.
- **SUP-011 — Membership content and event access:** no individual source-key mapping currently proves the protected content/event entitlement rule. **UNMAPPED HISTORICAL SOURCE / NEW-ROADMAP DISPOSITION OPEN.** Requires a content/event access policy linked to canonical entitlement state, server-side enforcement, expiry/revocation and public/private negative tests.

**Decision rule:** an ID that appears only inside a broad COM/STORE/SUPPORT range is not considered semantically reconciled. Where a historical source bullet does not explicitly establish the capability, the plan must record it as a new/roadmap requirement with an explicit rationale and phase decision, or retain it as an open provenance gap. Do not invent an archive source and do not delete the registry ID.

**Status:** 359 IDs structurally unique; 210 C.23 and 100 F source bullets individually preserved; F.3 is split one-to-one; the source crosswalk now explicitly references 354 IDs and has 5 range-only references. Five items above still lack an individual source-key mapping; COM-003/COM-007 have a roadmap mapping but require detailed phase/acceptance contracts. Full 359-ID semantic bidirectional reconciliation remains **OPEN**; all IDs still require owner/phase/dependency/DoD/test/acceptance validation. P0.2 **IN PROGRESS / NOT PASS**. No runtime code/data changed and no tests were run.

### 41.3.24. P0.2 — Archive-plan inventory, historical MASTER commit and unresolved source recovery (2026-10-13)

**Inventory verified against the current branch:** the dated archive contains the 2026-10-13 MASTER snapshot and a 2026-09-16 directory with the legacy HTML manifest. The current branch's docs/archive/plans directory contains the following eight plan files; their historical contents are requirements/decision sources, not current execution instructions.

| Archived source | Raw Markdown list items* | Provenance treatment and remaining work |
|---|---:|---|
| docs/archive/plans/MASTER-CURRENT-STATUS.md | 30 | E2 completion/test evidence applies only to its named historical commit and exact scope; former active point is superseded. |
| docs/archive/plans/MASTER-FINAL-ROADMAP.md | 454 | E3–E24 and the old release sequence are historical. The current E crosswalk has 249 rows, so it is not a proven one-to-one mapping of every raw list item; bullet-level semantic reconciliation remains OPEN. |
| docs/archive/plans/PLAN-AMENDMENT-EDITOR-UNIFICATION.md | 140 | Preserve one Page Model/Editor/renderer/save path, safe real-page migration, per-page migration gates, temporary fallback rules, and separation of real pages from disposable editor test pages. Individual migration requirements still need current feature ID, owner, phase, tests and acceptance evidence. |
| docs/archive/plans/SANCI-MASTER-PLAN.md | 423 | Public Brand pages, navigation, Admin, media, SEO, analytics, security, integrations and Stream Assistant; reconcile all unique requirements, not only headings or shared keywords. |
| docs/archive/plans/ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md | 42 | Preserve the long-term modular Creator Platform, stable object/action IDs, central action-validation-security chain, document model, platform layers and AI/engineering/QA direction. Exact bullet-level crosswalk remains OPEN. |
| docs/archive/plans/V2-BLUEPRINT.md | 117 | Preserve Worker/D1/R2/KV/Queues/DO, auth, API, cache, SEO, security and deployment architecture as historical intent. Each planned binding/service must be reconciled to current wrangler config, runtime consumers and phase gates; the document is not proof of implementation. |
| docs/archive/plans/VISUAL-EDITOR-ARCHITECTURE.md | 27 | Preserve structured-tree, shared Canvas/Layers/Inspector state, selection/hierarchy/history and AI action boundaries. Its historical runtime path public/editor/editor-core.js is not canonical; current canonical Editor is public/editor-v2. |
| docs/archive/plans/visual-editor-roadmap.md | 38 | Historical Editor shell/canvas/elements/Sanci blocks/Inspector/Layers/design/responsive milestone sequence; map each unique requirement to current EDT/DSN/QA contracts without reviving the old active point. |
| docs/archive/2026-09-16/LEGACY-HTML-ARCHIVE.md | 8 | Preserve the exact eight legacy page-to-slug mappings and migration 0006_canonicalize_legacy_pages.sql. Legacy HTML must not become a second active source; historical SQL migrations remain in migrations/. Current router reconciliation is recorded in §37.18, but migration/data-preservation/public parity evidence remains a separate acceptance gate. |

*Counts above are raw Markdown list-item counts, including nested and ordered lists; they are inventory metrics, not unique-feature counts and not evidence of coverage.

**Historical MASTER source at commit aedb2eaab2440c29bd0c05959d5064f410de5966:** the historical docs/MASTER-DEVELOPMENT-PLAN.md is 1,338 lines and contains 00.1–00.7, 01/A–01/C and sections 19–38. It does **not** contain a section named 00/A or the 00.9–00.9.6.B sequence. Its 19–34 source contains 266 Markdown list items (255 unordered bullets plus 11 ordered steps). The current H19–H34 ledger has 271 rows: 266 source items plus five separately retained cross-cutting/summary rows—H21.22, H31.00, H33.00, H33.12 and H34.00. This explains the five-row difference; those extra rows must remain labeled as architecture/process constraints, not misrepresented as additional historical bullets.

**Unrecovered source boundary:** in the current branch's dated archive, archived plan directory and the inspected historical MASTER commit, the full original 00/A and original 00.9–00.9.6.B files/text are not present. The current snapshot contains only a partial 00/A.2.2 fragment and later 00.9.6.C–F material. Exact-path and content search did not recover the missing originals. This is evidence of non-recovery from the inspected sources, **not proof that the documents never existed in any uninspected commit or external location**. Keep the source status UNRECOVERED / PARTIALLY RECOVERED / OPEN; do not reconstruct missing original text from guesses or silently mark it reconciled.

**Required next source-reconciliation sequence:**
1. Continue with MASTER-FINAL-ROADMAP.md as the first large secondary source: establish source heading/list-item keys for E3–E24, reconcile each unique item to current canonical IDs and phase, and record explicit duplicate/merge/superseded decisions. Do not treat the 249-row E crosswalk as one-to-one proof.
2. Reconcile the PLAN-AMENDMENT-EDITOR-UNIFICATION.md migration checklist item-by-item, including each real page, fallback, verification stage and test-page cleanup.
3. Reconcile SANCI-MASTER-PLAN.md, ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md and V2-BLUEPRINT.md for any capability or architectural constraint not already represented by a specific source-key/ID mapping.
4. Reconcile the Visual Editor architecture and roadmap against the current canonical runtime, preserving constraints while explicitly superseding only old paths/milestone labels.
5. Keep the legacy HTML manifest as a separate migration acceptance source; validate each listed route/content mapping and do not infer success from the manifest alone.

**Status:** the eight secondary plans plus legacy manifest have been enumerated and their precedence recorded; this is inventory, not full semantic coverage. The missing 00/A and 00.9–00.9.6.B source gap remains OPEN, and the secondary-plan bullet-level reconciliations remain OPEN. P0.2 **IN PROGRESS / NOT PASS**. No runtime code/data changed and no tests were run.

### 41.3.25. P0.2 — MASTER-FINAL-ROADMAP source-key ledger: E3–E5 (2026-10-13)

**Source:** docs/archive/plans/MASTER-FINAL-ROADMAP.md, FINAL-1.0 dated 2026-09-17. The old E3 shell, E4 Canvas Engine and E5 Layers/Navigator bullets are retained below individually. The old [ ] status is historical, not the current runtime status. Each target is a candidate mapping into the current E crosswalk and §24 canonical ID registry; it is not evidence of implementation.

| Source key | Archive line | Exact source item | Current E target | Candidate canonical IDs | Decision / phase / acceptance |
|---|---:|---|---|---|---|
| ROADMAP-E3-GOAL | 67 | Egy valódi, használható vizuális szerkesztő munkaasztal létrehozása. Ebben a pontban még nem építjük meg az összes szerkesztési funkciót; a teljes editor szerkezete és kezelési rendszere készül el. | E.3.1–E.3.7 | EDT-001–042; QA-002/004/006/009 | KEEP — goal retained; phase 1.0 core; acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.1-01 | 70 | - [ ] felső toolbar | E.3.1-01 | EDT-027/032/033; EDT-039 | MERGE — 1.0 toolbar; verify every action is live; tests and acceptance evidence still required |
| ROADMAP-E3.1-02 | 71 | - [ ] bal oldali Elements panel | E.3.1-02 | EDT-015 | KEEP — 1.0 element library panel; search and insert acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.1-03 | 72 | - [ ] bal oldali Layers/Navigator panel | E.3.1-02 | EDT-012/014 | KEEP — 1.0 Layers/Navigator; hierarchy and visibility acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.1-04 | 73 | - [ ] középső Canvas | E.3.1-03 | EDT-007/008/034 | KEEP — 1.0 canvas; canonical render and viewport acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.1-05 | 74 | - [ ] jobb oldali Inspector | E.3.1-04 | EDT-021/022 | KEEP — 1.0 Inspector; registry/validation acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.1-06 | 75 | - [ ] alsó státusz/save sáv, ha szükséges | E.3.1-01; ADM-008 | EDT-027/028 | MERGE — optional status/save bar; must show truthful save state; tests and acceptance evidence still required |
| ROADMAP-E3.1-07 | 76 | - [ ] egységes sötét Sanci design | E.6.1-01 | DSN-001/005/006 | KEEP — shared Sanci design tokens; responsive contrast/accessibility acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.2-01 | 79 | - [ ] panel megnyitás/zárás | E.3.1-05 | EDT-035/036 | KEEP — panels open/close; browser/device acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.2-02 | 80 | - [ ] panelek összecsukása | E.3.1-05 | EDT-035/036; EDT-012 | KEEP — collapsible panels and tree; state consistency OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.2-03 | 81 | - [ ] panel szélesség állítása | E.3.1-05 | EDT-035/036 | KEEP — resizable panel widths; min/max bounds and no canvas clipping tests OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.2-04 | 82 | - [ ] minimum/maximum panelméret | E.3.1-05 | EDT-035/036; QA-004 | KEEP — min/max panel sizing; responsive boundary tests OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.2-05 | 83 | - [ ] panel állapot megőrzése | E.3.1-05 | EDT-035/036 | OPEN — panel-state persistence has no dedicated canonical ID; define preference scope/storage and test reload; tests and acceptance evidence still required |
| ROADMAP-E3.2-06 | 84 | - [ ] aktív panel jelölése | E.3.1-05 | EDT-013/036 | KEEP — active panel indication and shared selection state; acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.2-07 | 85 | - [ ] mobil admin/editor használhatóság | E.3.1-05; ADM-010 | EDT-035/036; QA-004 | KEEP — mobile/tablet editor usability; touch/safe-area and no-clipped-panel tests OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-01 | 88 | - [ ] oldal neve | E.3.1-01 | EDT-027/028 | KEEP — page name reflects canonical loaded page; stale route/page tests OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-02 | 89 | - [ ] mentés állapot | E.3.1-01 | EDT-027/028/030/031 | KEEP — save state must distinguish dirty/saving/success/error/retry/conflict; tests and acceptance evidence still required |
| ROADMAP-E3.3-03 | 90 | - [ ] undo | E.3.7-01 | EDT-005 | KEEP — undo enabled only when history allows; command/history test OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-04 | 91 | - [ ] redo | E.3.7-01 | EDT-005 | KEEP — redo enabled only when redo history exists; command/history test OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-05 | 92 | - [ ] preview | E.4-03 | EDT-032/034 | KEEP — preview must not mutate published state; public-render parity OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-06 | 93 | - [ ] publish előkészítés | E.4-05 | EDT-033; WEB-005/006 | KEEP — publish preparation is not publish success; authorization/cache/failure tests OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-07 | 94 | - [ ] desktop/tablet/mobile választó | E.3.4-04 | EDT-024/025 | KEEP — desktop/tablet/mobile viewport selection; responsive inheritance tests OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-08 | 95 | - [ ] zoom | E.3.3-02 | EDT-007 | KEEP — zoom; no document mutation from viewport change; tests and acceptance evidence still required |
| ROADMAP-E3.3-09 | 96 | - [ ] fit canvas | E.3.3-02 | EDT-007 | KEEP — fit canvas; bounds and large-document tests OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.3-10 | 97 | - [ ] editor menü | E.3.1-01 | EDT-039; ADM-001 | OPEN — editor menu actions must resolve to canonical handlers; no dead/placeholder actions; tests and acceptance evidence still required |
| ROADMAP-E3.4-01 | 100 | - [ ] valódi központi munkafelület | E.3.3-02 | EDT-007/016 | KEEP — central work surface and layout bounds; browser acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E3.4-02 | 101 | - [ ] dokumentum betöltése a Core state-ből | E.3.2-01 | EDT-001/003/028 | KEEP — Canvas loads canonical Core state, never independent DOM state; tests and acceptance evidence still required |
| ROADMAP-E3.4-03 | 102 | - [ ] viewport keret | E.3.3-02 | EDT-007 | KEEP — viewport frame matches selected device width; tests and acceptance evidence still required |
| ROADMAP-E3.4-04 | 103 | - [ ] háttér/grid | E.3.3-02 | EDT-007/010 | KEEP — canvas background/grid are editor-only overlays, excluded from public render; tests and acceptance evidence still required |
| ROADMAP-E3.4-05 | 104 | - [ ] zoom | E.3.3-02 | EDT-007 | KEEP — zoom changes viewport only; tests and acceptance evidence still required |
| ROADMAP-E3.4-06 | 105 | - [ ] pan | E.3.3-02 | EDT-007 | KEEP — pan changes viewport only; tests and acceptance evidence still required |
| ROADMAP-E3.4-07 | 106 | - [ ] device preview | E.3.4-04 | EDT-025 | KEEP — device preview; viewport/property overrides tested; tests and acceptance evidence still required |
| ROADMAP-E3.4-08 | 107 | - [ ] canvas scroll | E.3.3-02 | EDT-007 | KEEP — canvas scroll does not lose selection or modify document; tests and acceptance evidence still required |
| ROADMAP-E3.4-09 | 108 | - [ ] üres állapot | E.3.1-06 | EDT-041; ADM-008 | KEEP — empty-project onboarding and safe empty state; tests and acceptance evidence still required |
| ROADMAP-E3.5-01 | 111 | - [ ] toolbar események | E.3.1-01 | EDT-039 | KEEP — toolbar events dispatch through canonical action registry; tests and acceptance evidence still required |
| ROADMAP-E3.5-02 | 112 | - [ ] panel események | E.3.1-05 | EDT-039/035/036 | KEEP — panel events do not create independent state; tests and acceptance evidence still required |
| ROADMAP-E3.5-03 | 113 | - [ ] selection események | E.3.3-01 | EDT-003/006/013 | KEEP — selection events share one canonical selected-node state; tests and acceptance evidence still required |
| ROADMAP-E3.5-04 | 114 | - [ ] canvas click | E.3.3-01 | EDT-003/006 | KEEP — canvas click uses canonical selection action; tests and acceptance evidence still required |
| ROADMAP-E3.5-05 | 115 | - [ ] tree click | E.3.3-01 | EDT-012/013 | KEEP — tree click and canvas selection remain synchronized; tests and acceptance evidence still required |
| ROADMAP-E3.5-06 | 116 | - [ ] inspector change események | E.3.5-04 | EDT-003/021/022 | KEEP — Inspector edits use typed, validated canonical commands; tests and acceptance evidence still required |
| ROADMAP-E3.5-07 | 117 | - [ ] event routing egyetlen editor state felé | E.3.2-01 | EDT-001/003/013 | KEEP — all events route to one editor state; no parallel source of truth; tests and acceptance evidence still required |
| ROADMAP-E3.5-08 | 118 | - [ ] nincs párhuzamos state | E.3.2-01 | EDT-001/003/013 | KEEP — no duplicated hierarchy/selection state; tests and acceptance evidence still required |
| ROADMAP-E3.5-09 | 119 | - [ ] nincs rejtett legacy listener | E.3.2-04 | EDT-003/039; QA-002/004 | KEEP — legacy listeners must not mutate state outside canonical actions; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-01 | 123 | 1. az editor ténylegesen megnyílik; | E.3.1-01; QA gate | QA-004/006 | GATE — editor opens in target environment; current runtime evidence required; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-02 | 124 | 2. a teljes shell látható; | E.3.1-01 | QA-004/006 | GATE — all shell regions visible at supported desktop viewport; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-03 | 125 | 3. minden fő panel nyitható/zárható; | E.3.1-05 | EDT-035/036; QA-004 | GATE — main panels open/close without stale selection or clipping; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-04 | 126 | 4. a canvas középen működik; | E.3.3-02 | EDT-007; QA-004 | GATE — canvas centered and usable at supported viewport sizes; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-05 | 127 | 5. device és zoom vezérlés működik; | E.3.4-04 | EDT-007/025; QA-004 | GATE — device and zoom controls produce expected viewport, no document mutation; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-06 | 128 | 6. toolbar gombok nem halottak; | E.3.1-01 | EDT-039; QA-002/004/006 | GATE — no dead toolbar actions; every visible action has tested handler; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-07 | 129 | 7. a Core state-hez kapcsolódik; | E.3.2-01 | EDT-001/003; QA-002 | GATE — shell is connected to canonical Core state and command path; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-08 | 130 | 8. nincs régi editor runtime-függőség; | E.3.2-04 | EDT-003/039; QA-002/006 | GATE — no dependency on old Editor runtime; current canonical public/editor-v2 path; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-09 | 131 | 9. desktop és mobil nézet ellenőrizve; | E.3.1-05 | QA-004 | GATE — desktop and mobile/device behavior tested in supported environments; tests and acceptance evidence still required |
| ROADMAP-E3-GATE-10 | 132 | 10. a felhasználó azt mondja: **működik**. | E.3.1-01; QA gate | QA-009 | GATE — explicit user acceptance for this exact build/scope; automated tests do not replace it; tests and acceptance evidence still required |
| ROADMAP-E4-01 | 139 | - [ ] Page Model → DOM render | E.3.2-01 | EDT-001/034 | KEEP — Page Model renders to DOM through canonical renderer; public parity acceptance OPEN; tests and acceptance evidence still required |
| ROADMAP-E4-02 | 140 | - [ ] DOM node → element ID mapping | E.3.3-01 | EDT-001/003/006 | KEEP — every rendered node has stable source element ID mapping; tests and acceptance evidence still required |
| ROADMAP-E4-03 | 141 | - [ ] click selection | E.3.3-01 | EDT-003/006 | KEEP — click selection goes through canonical selection action; tests and acceptance evidence still required |
| ROADMAP-E4-04 | 142 | - [ ] hover | E.3.3-01 | EDT-003/006 | KEEP — hover state is transient and does not mutate persisted document; tests and acceptance evidence still required |
| ROADMAP-E4-05 | 143 | - [ ] selected outline | E.3.3-01 | EDT-003/006 | KEEP — selected outline is editor-only, not public output; tests and acceptance evidence still required |
| ROADMAP-E4-06 | 144 | - [ ] parent highlight | E.3.3-01 | EDT-002/006/013 | KEEP — parent highlight follows canonical hierarchy and selection; tests and acceptance evidence still required |
| ROADMAP-E4-07 | 145 | - [ ] drop zones | E.3.3-02 | EDT-008/010 | KEEP — drop zones are derived from valid parent/child/layout rules; tests and acceptance evidence still required |
| ROADMAP-E4-08 | 146 | - [ ] drag/drop | E.3.3-02 | EDT-008 | KEEP — drag/drop uses canonical command path and transaction boundaries; tests and acceptance evidence still required |
| ROADMAP-E4-09 | 147 | - [ ] reparent | E.3.2-06 | EDT-002/008/011 | KEEP — reparent rejects cycles/invalid parents and preserves IDs; tests and acceptance evidence still required |
| ROADMAP-E4-10 | 148 | - [ ] reorder | E.3.3-04 | EDT-011 | KEEP — reorder changes sibling order, not hierarchy flattening; tests and acceptance evidence still required |
| ROADMAP-E4-11 | 149 | - [ ] resize handles | E.3.3-02 | EDT-009 | KEEP — resize handles enforce property/layout constraints; tests and acceptance evidence still required |
| ROADMAP-E4-12 | 150 | - [ ] multi-select | E.3.3-04 | EDT-038/006 | KEEP — multi-select operations are explicit, permission-safe and undoable; tests and acceptance evidence still required |
| ROADMAP-E4-13 | 151 | - [ ] keyboard navigation | E.3.3-05 | EDT-037 | KEEP — keyboard navigation has a complete accessible alternative; tests and acceptance evidence still required |
| ROADMAP-E4-14 | 152 | - [ ] escape/parent navigation | E.3.3-05 | EDT-006/037 | KEEP — Escape/parent navigation has predictable focus/selection semantics; tests and acceptance evidence still required |
| ROADMAP-E4-15 | 153 | - [ ] canvas/tree synchronization | E.3.3-01 | EDT-013 | KEEP — Canvas and tree stay synchronized after select/reparent/reorder; tests and acceptance evidence still required |
| ROADMAP-E4-16 | 154 | - [ ] invalid drop prevention | E.3.2-05 | EDT-002/008; QA-002 | KEEP — invalid drop/reparent rejected without partial mutation; tests and acceptance evidence still required |
| ROADMAP-E4-CORE-INVARIANT | 156 | **Kapcsolat:** minden módosítás a Core commandokon keresztül történik. | E.3.2-01 | EDT-003/004/039 | ARCHITECTURE INVARIANT — every mutation goes through canonical Core commands; tests and acceptance evidence still required |
| ROADMAP-E5-01 | 159 | - [ ] teljes fa | E.3.3-01 | EDT-012/002 | KEEP — full hierarchy tree represents canonical Page Model; tests and acceptance evidence still required |
| ROADMAP-E5-02 | 160 | - [ ] expand/collapse | E.3.3-01 | EDT-012 | KEEP — expand/collapse changes view state, not document hierarchy; tests and acceptance evidence still required |
| ROADMAP-E5-03 | 161 | - [ ] drag reorder | E.3.3-04 | EDT-011 | KEEP — layer drag reorder uses canonical sibling-order command; tests and acceptance evidence still required |
| ROADMAP-E5-04 | 162 | - [ ] drag reparent | E.3.2-06 | EDT-002/008/011 | KEEP — layer reparent obeys hierarchy/cycle constraints; tests and acceptance evidence still required |
| ROADMAP-E5-05 | 163 | - [ ] hide | E.3.3-04 | EDT-014 | KEEP — hide is editor-layer visibility state, not public conditional visibility; tests and acceptance evidence still required |
| ROADMAP-E5-06 | 164 | - [ ] lock | E.3.3-04 | EDT-014 | KEEP — lock prevents prohibited mutation; it is not a public hide; tests and acceptance evidence still required |
| ROADMAP-E5-07 | 165 | - [ ] rename | E.3.3-04 | EDT-014 | KEEP — rename updates canonical node label only, not ID/parent; tests and acceptance evidence still required |
| ROADMAP-E5-08 | 166 | - [ ] duplicate | E.3.3-04 | EDT-011 | KEEP — duplicate creates fresh IDs and valid resource references; tests and acceptance evidence still required |
| ROADMAP-E5-09 | 167 | - [ ] delete | E.3.3-04 | EDT-011; RES-009 | KEEP — delete checks references/usage and follows safe delete/restore policy; tests and acceptance evidence still required |
| ROADMAP-E5-10 | 168 | - [ ] search | E.3.3-01 | EDT-012/015 | KEEP — tree search filters view and does not mutate node data; tests and acceptance evidence still required |
| ROADMAP-E5-11 | 169 | - [ ] expand-to-selection | E.3.3-01 | EDT-013/012 | KEEP — expand-to-selection reveals the selected canonical node; tests and acceptance evidence still required |
| ROADMAP-E5-12 | 170 | - [ ] breadcrumbs | E.3.3-01 | EDT-013/006 | KEEP — breadcrumbs follow parent chain and clear correctly on selection changes; tests and acceptance evidence still required |
| ROADMAP-E5-13 | 171 | - [ ] multi-selection | E.3.3-04 | EDT-012/038 | KEEP — multi-selection semantics explicit; unsupported bulk actions disabled; tests and acceptance evidence still required |
| ROADMAP-E5-14 | 172 | - [ ] subtree szabályok | E.3.2-05 | EDT-002/011/014 | KEEP — subtree rules preserve valid parent/child and descendant constraints; tests and acceptance evidence still required |

**Audit findings from this batch:**
- E3.2-05 panel-state persistence has no dedicated canonical feature ID. It remains OPEN until its scope is decided (editor-only local preference vs user/site persisted preference), storage/retention is defined and reload behavior is tested.
- The old E3 readiness gate is a release gate, not a product feature. All ten criteria are preserved individually; QA-009 user acceptance is required in addition to QA-001–008 automated/runtime evidence.
- E4/E5 must share EDT-001–004 canonical document/command invariants. Selection/hover/outline/parent highlight are view state; only valid structural commands mutate the Page Model. Layer hide/lock must not silently change public conditional visibility.
- Old E3/E4/E5 source mappings are candidate semantic links, not an implementation PASS. The current runtime path is public/editor-v2; no legacy runtime listener or parallel state may be reactivated to satisfy an archived checklist.

**Coverage count:** 84 E3/E4/E5 source items are now individually keyed from the archived roadmap (including the E3 goal, ten readiness gates and the E4 Core invariant). The remaining MASTER-FINAL-ROADMAP E6–E24 source items and its global 0/Foundation/Data Model/Core rules remain OPEN for the next batches. P0.2 remains **IN PROGRESS / NOT PASS**. This documentation-only batch did not change runtime code/data or run tests.

### 41.3.26. P0.2 — MASTER-FINAL-ROADMAP source-key ledger: E6 Element Library (2026-10-13)

**Source:** docs/archive/plans/MASTER-FINAL-ROADMAP.md, E6 Element Library, archive lines 174–237. Every original checklist item below is kept separately. These are candidate crosswalks to current Editor/Resource/domain IDs; the archived [ ] checkboxes are historical and do not indicate current status.

| Source key | Archive line | Exact source item | Current E target | Candidate canonical IDs | Decision / phase / acceptance |
|---|---:|---|---|---|---|
| ROADMAP-E6-01 | 176 | - [ ] Section | E.3.6-03 | EDT-016 | KEEP — 1.0 section/container primitive; hierarchy/render tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-02 | 177 | - [ ] Container | E.3.6-03 | EDT-016 | KEEP — 1.0 container primitive; valid parent-child constraints OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-03 | 178 | - [ ] Stack | E.3.6-03 | EDT-016 | KEEP — 1.0 stack primitive; layout mode/serialization tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-04 | 179 | - [ ] Group | E.3.6-03; DSN-012/013 | EDT-002/011/016 | EXPAND — distinguish layout group from reusable component instance; phase/contract OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-05 | 180 | - [ ] Div/Box | E.3.6-03 | EDT-016/021/022 | KEEP — generic Box/Div; supported properties and public-render parity OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-06 | 181 | - [ ] Spacer | E.3.6-03 | EDT-016/017 | KEEP — spacer is a layout primitive; horizontal/vertical values remain independent; tests/acceptance evidence OPEN |
| ROADMAP-E6-07 | 182 | - [ ] Heading | E.3.6-01 | EDT-017 | KEEP — heading semantic level and accessibility tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-08 | 183 | - [ ] Text | E.3.6-01 | EDT-017 | KEEP — plain Text is 1.0 baseline; content serialization/reload OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-09 | 184 | - [ ] Rich Text | E.3.6-01; F.3-09 | EDT-017/019 | DEFER — rich-text editor separately scoped; no parallel text model; tests/acceptance evidence OPEN |
| ROADMAP-E6-10 | 185 | - [ ] Link | E.3.6-01 | EDT-017; WEB-013 | KEEP — Link element validates route/URL and target policy; tests/acceptance evidence OPEN |
| ROADMAP-E6-11 | 186 | - [ ] Button | E.3.6-01 | EDT-017; EDT-039 | KEEP — Button is typed action/link, not arbitrary script; tests/acceptance evidence OPEN |
| ROADMAP-E6-12 | 187 | - [ ] Icon | E.3.6-01 | EDT-017; RES-011/012 | KEEP — icon references canonical registry and safe SVG renderer; tests/acceptance evidence OPEN |
| ROADMAP-E6-13 | 188 | - [ ] Divider | E.3.6-01 | EDT-017 | KEEP — divider primitive; semantics and styling acceptance OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-14 | 191 | - [ ] Flex | E.3.6-03 | EDT-016/021/022 | KEEP — Flex supported subset only; serialize/render/responsive tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-15 | 192 | - [ ] Grid | E.3.6-03 | EDT-016/021/022 | KEEP — Grid supported subset only; named areas/auto-flow only if explicitly validated; tests/acceptance evidence OPEN |
| ROADMAP-E6-16 | 193 | - [ ] Row | E.3.6-03 | EDT-016/021/022 | KEEP — Row layout primitive; breakpoint/inheritance tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-17 | 194 | - [ ] Columns | E.3.6-03 | EDT-016/021/022 | KEEP — Columns layout primitive; no silent flex/grid→absolute conversion; tests/acceptance evidence OPEN |
| ROADMAP-E6-18 | 195 | - [ ] Absolute | E.3.6-03; C.23.5 | EDT-009/016/021/022 | PHASE-GATED — absolute positioning only in supported subset; invalid values rejected; tests/acceptance evidence OPEN |
| ROADMAP-E6-19 | 196 | - [ ] Sticky | E.3.6-03; C.23.5 | EDT-009/016/021/022 | PHASE-GATED — sticky behavior needs browser/overflow/stacking-context tests; tests/acceptance evidence OPEN |
| ROADMAP-E6-20 | 197 | - [ ] Overlay | E.3.6-03 | EDT-016/021/022 | OPEN — clarify layout Overlay vs OBS/browser-source overlay; do not conflate with OBS feature; tests/acceptance evidence OPEN |
| ROADMAP-E6-21 | 200 | - [ ] Image | E.3.6-02 | EDT-018; RES-001–015 | KEEP — image variant, alt, dimensions, owner and public/protected visibility tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-22 | 201 | - [ ] Gallery | E.3.6-02 | EDT-018/019; RES-001–015 | KEEP — gallery list/grid/carousel is typed; resource permissions and empty/error states OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-23 | 202 | - [ ] Video | E.3.6-02 | EDT-018; RES-001–015 | KEEP — video source/poster/duration/caption and provider/embed rules OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-24 | 203 | - [ ] Audio | E.3.6-02 | EDT-018; RES-007 | OPEN — audio player is not a named EDT registry capability; define supported sources, controls, caption/accessibility and phase; tests/acceptance evidence OPEN |
| ROADMAP-E6-25 | 204 | - [ ] Embed | E.3.6-02 | EDT-018; SEC-005; WEB-032 | KEEP — embed only from approved hosts; CSP/sandbox/URL validation required; tests/acceptance evidence OPEN |
| ROADMAP-E6-26 | 205 | - [ ] iframe | E.3.6-02 | EDT-018; SEC-005; WEB-032 | KEEP — iframe is not arbitrary HTML; allowlist, sandbox, permissions policy and negative tests; tests/acceptance evidence OPEN |
| ROADMAP-E6-27 | 208 | - [ ] Accordion | E.3.6-02 | EDT-019 | KEEP — Accordion typed fields, keyboard and responsive/public-render tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-28 | 209 | - [ ] Tabs | E.3.6-02 | EDT-019 | KEEP — Tabs typed fields, keyboard/focus and deep-link/selection policy OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-29 | 210 | - [ ] Modal | E.3.6-02; C.23.8-03 | EDT-018/019; EDT-039 | OPEN — Modal/Dialog focus trap/return, escape, keyboard and stacking context require a specific contract; tests/acceptance evidence OPEN |
| ROADMAP-E6-30 | 211 | - [ ] Carousel | E.3.6-06 | EDT-018/019; EDT-039 | KEEP — Carousel is a typed component; keyboard, reduced-motion, touch and accessibility tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-31 | 212 | - [ ] Tooltip | E.3.6-06 | EDT-039; QA-004/005 | OPEN — Tooltip semantics/focus/touch trigger need explicit component contract; tests/acceptance evidence OPEN |
| ROADMAP-E6-32 | 213 | - [ ] Dropdown | E.3.6-06 | EDT-039; QA-004/005 | OPEN — Dropdown menu/listbox distinction, keyboard navigation and focus return need explicit contract; tests/acceptance evidence OPEN |
| ROADMAP-E6-33 | 214 | - [ ] Form | E.3.6-02; C.23.8-07 | EDT-019; WEB-020; SEC-002/005/011 | KEEP — secure submit handler and server-side validation are separate from element schema; tests/acceptance evidence OPEN |
| ROADMAP-E6-34 | 215 | - [ ] Input | E.3.6-02; C.23.8-07 | EDT-019; WEB-020; SEC-002/005/011 | KEEP — input field type/constraints/help/required/default are schema-validated; tests/acceptance evidence OPEN |
| ROADMAP-E6-35 | 216 | - [ ] Select | E.3.6-02; C.23.8-07 | EDT-019; WEB-020; SEC-002/005/011 | KEEP — select options/permissions/server validation; no client-only trust; tests/acceptance evidence OPEN |
| ROADMAP-E6-36 | 217 | - [ ] Checkbox | E.3.6-02; C.23.8-07 | EDT-019; WEB-020; SEC-002/005/011 | KEEP — checkbox consent/required state must be explicit and audited where needed; tests/acceptance evidence OPEN |
| ROADMAP-E6-37 | 218 | - [ ] Textarea | E.3.6-02; C.23.8-07 | EDT-019; WEB-020; SEC-002/005/011 | KEEP — textarea size/request limits, sanitization and accessible labels OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-38 | 221 | - [ ] Twitch Live/Offline | E.3.6-04; C.23.8-09 | EDT-020; INT-001; LIV-001–004; WEB-015 | KEEP — live/offline state and player only from permitted, fresh provider data; tests/acceptance evidence OPEN |
| ROADMAP-E6-39 | 222 | - [ ] Countdown | E.3.6-04; F.6-04 | EDT-020; SCH-003/009; WEB-016 | KEEP — countdown timezone/DST/cancelled/past state tests OPEN; tests/acceptance evidence OPEN |
| ROADMAP-E6-40 | 223 | - [ ] Next Stream | E.3.6-04; F.6-02 | EDT-020; SCH-009; WEB-016 | KEEP — next stream resolves canonical Schedule and excludes cancelled/past items; tests/acceptance evidence OPEN |
| ROADMAP-E6-41 | 224 | - [ ] Schedule | E.3.6-04; F.6 | EDT-020; SCH-001–015; WEB-016 | KEEP — Schedule block stores presentation config only, not Schedule domain rows; tests/acceptance evidence OPEN |
| ROADMAP-E6-42 | 225 | - [ ] YouTube | E.3.6-04; F.5-04 | EDT-020; INT-013; CNT-002–004 | PHASE-GATED — YouTube static link/embed vs API adapter clearly separated; tests/acceptance evidence OPEN |
| ROADMAP-E6-43 | 226 | - [ ] TikTok | E.3.6-04; F.5-05 | EDT-020; INT-014; CNT-002–004 | PHASE-GATED — TikTok link/embed/API capability gated; no unsupported metrics; tests/acceptance evidence OPEN |
| ROADMAP-E6-44 | 227 | - [ ] Discord | E.3.6-04; C.23.18-02 | EDT-020; INT-015; COM-001/002 | PHASE-GATED — Discord link/basic embed distinct from bot/role/API integration; tests/acceptance evidence OPEN |
| ROADMAP-E6-45 | 228 | - [ ] VOD | E.3.6-04; F.5-02 | EDT-020; CNT-002–004; WEB-017 | KEEP — VOD uses canonical content source and honest manual fallback; tests/acceptance evidence OPEN |
| ROADMAP-E6-46 | 229 | - [ ] Shorts | E.3.6-04; F.5-02 | EDT-020; CNT-003/004 | PHASE-GATED — Shorts require provider capability and platform-specific metadata; tests/acceptance evidence OPEN |
| ROADMAP-E6-47 | 230 | - [ ] Community | E.3.6-04; F.11-02 | EDT-020; COM-001–COM-007 | PHASE-GATED — community invite/link is baseline; posts/comments require separate moderation/privacy contract; tests/acceptance evidence OPEN |
| ROADMAP-E6-48 | 231 | - [ ] Support | E.3.6-04; F.12-05 | EDT-020; SUP-001–SUP-003; COM-014 | KEEP — support CTA is a link/verified goal, not proof of payment integration; tests/acceptance evidence OPEN |
| ROADMAP-E6-49 | 232 | - [ ] Stream Stats | E.3.6-04; F.8-02 | EDT-020; LIV-004–007; ANL-001–004 | OPEN — Stream Stats only show permitted verified metrics with source/freshness/missing-value rules; tests/acceptance evidence OPEN |
| ROADMAP-E6-50 | 233 | - [ ] Game Card | E.3.6-04; F.12-02 | EDT-020; SCH-012–014 | KEEP — Game Card reads canonical Game Profile and uses safe media fallback; tests/acceptance evidence OPEN |
| ROADMAP-E6-51 | 234 | - [ ] Social Links | E.3.6-04; F.4-05 | EDT-020; COM-001; WEB-022 | KEEP — social link row validates URL/visibility; no provider API assumed; tests/acceptance evidence OPEN |
| ROADMAP-E6-52 | 235 | - [ ] Sponsor | E.3.6-04; F.4-05 | EDT-020; WEB-024; CAM-001/CAM-004 | PHASE-GATED — sponsor block/media kit, not a 1.0 sponsorship CRM; tests/acceptance evidence OPEN |
| ROADMAP-E6-53 | 236 | - [ ] Business Contact | E.3.6-04; F.4-05 | EDT-020; WEB-020; CAM-001/CAM-004 | KEEP — business contact uses validated public contact route; no private deal fields; tests/acceptance evidence OPEN |
| ROADMAP-E6-54 | 237 | - [ ] About Me | E.3.6-04; F.4-05 | EDT-020; WEB-001 | KEEP — About Me is a reusable content block/page binding, not a second page model; tests/acceptance evidence OPEN |

**Semantic findings:**
- The archive enumerates **54 individual element/component types** across base, layout, media, interactive and Sanci-specific blocks. They are not 54 separate backend domains: they must be typed variants in the single canonical Editor/Page Model and share the central Property Registry/action/persistence path.
- Audio, Modal/Dialog, Tooltip and Dropdown are **OPEN** as named runtime capabilities. Their appearance in a historical checklist or a broad EDT-018/019 range is not enough; define supported schema, keyboard/focus behavior, responsive/public renderer, accessibility and phase before enabling them.
- Rich Text remains separately scoped from the plain Text baseline. It must not create a second text model or delay the 1.0 Editor core.
- YouTube/TikTok/Discord blocks must distinguish static links/basic approved embeds from API-backed adapters. A link is not an OAuth integration; no unverified metric may be shown.
- Stream Stats must be source-backed, permission-safe and freshness-aware. Game Card must use the canonical Game Profile and resource fallback. Sponsor/Business Contact/About Me blocks must reuse canonical page/contact/press-kit data rather than create a parallel CMS or expose private business data.
- The source checklist does not prove these elements are currently implemented. Every KEEP/PHASE-GATED row still requires exact supported-property contract, empty/loading/error states, permission checks, browser/device tests, save/reload and public-render acceptance in its phase.

**Coverage count:** 54 E6 checklist items are now individually keyed. E7–E24, plus the archived roadmap's 0/Foundation/Data Model/Core items, remain OPEN. P0.2 remains **IN PROGRESS / NOT PASS**; no runtime code/data changed and no tests were run.

### 41.3.27. P0.2 — MASTER-FINAL-ROADMAP source-key ledger: E7 Inspector, E8 Layout, E9 Responsive (2026-10-13)

**Source:** docs/archive/plans/MASTER-FINAL-ROADMAP.md, E7–E9, archive lines 243–307. Each checklist item is kept separately; the old [ ] status is historical. Candidate mappings do not establish that a control exists in the current Editor runtime.

| Source key | Archive line | Exact source item | Current E target | Candidate canonical IDs | Decision / phase / acceptance |
|---|---:|---|---|---|---|
| ROADMAP-E7-01 | 244 | - [ ] Content | E.3.5-01 | EDT-021/022 | KEEP — Content category uses typed content schemas; no arbitrary raw HTML by default; acceptance evidence OPEN |
| ROADMAP-E7-02 | 245 | - [ ] Layout | E.3.5-01; E.3.4 | EDT-016/021/022 | KEEP — Layout properties only for the active layout mode; acceptance evidence OPEN |
| ROADMAP-E7-03 | 246 | - [ ] Size | E.3.5-02 | EDT-009/021/022 | KEEP — Size fields require unit/range/viewport validation; acceptance evidence OPEN |
| ROADMAP-E7-04 | 247 | - [ ] Spacing | E.3.5-02 | EDT-016/021/022 | KEEP — Spacing fields remain independent; per-side controls validated; acceptance evidence OPEN |
| ROADMAP-E7-05 | 248 | - [ ] Flex | E.3.4 | EDT-016/021/022 | PHASE-GATED — Flex properties only within the tested schema/render subset; acceptance evidence OPEN |
| ROADMAP-E7-06 | 249 | - [ ] Grid | E.3.4 | EDT-016/021/022 | PHASE-GATED — Grid properties only within tested schema/render subset; acceptance evidence OPEN |
| ROADMAP-E7-07 | 250 | - [ ] Position | E.3.4; C.23.5 | EDT-009/016/021/022 | PHASE-GATED — positioning values and containing-block behavior need browser acceptance; acceptance evidence OPEN |
| ROADMAP-E7-08 | 251 | - [ ] Typography | E.3.6-01 | EDT-017/021/022 | KEEP — text style schema; semantic heading levels and contrast tested; acceptance evidence OPEN |
| ROADMAP-E7-09 | 252 | - [ ] Background | E.3.5-02 | EDT-021/022; DSN-001/006 | KEEP — background values/assets/tokens validated; safe resource references; acceptance evidence OPEN |
| ROADMAP-E7-10 | 253 | - [ ] Border | E.3.5-02 | EDT-021/022; DSN-001/006 | KEEP — border style/width/color schema and supported values; acceptance evidence OPEN |
| ROADMAP-E7-11 | 254 | - [ ] Radius | E.3.5-02 | EDT-021/022; DSN-001/006 | KEEP — radius property supports only validated CSS units/tokens; acceptance evidence OPEN |
| ROADMAP-E7-12 | 255 | - [ ] Shadow | E.3.5-02 | EDT-021/022; DSN-001/006 | KEEP — shadow values use safe structured schema, not arbitrary unbounded CSS; acceptance evidence OPEN |
| ROADMAP-E7-13 | 256 | - [ ] Opacity | E.3.5-02 | EDT-021/022 | KEEP — opacity range and invalid-input rejection tests OPEN; acceptance evidence OPEN |
| ROADMAP-E7-14 | 257 | - [ ] Transform | E.3.5-02; C.23.5 | EDT-009/021/022; EDT-040 | PHASE-GATED — transform/rotation/anchor only if explicitly supported and validated; acceptance evidence OPEN |
| ROADMAP-E7-15 | 258 | - [ ] Filter | E.3.5-02; C.23.5 | EDT-021/022 | OPEN — CSS filter support is not a standalone registry ID; define allowed filter subset or mark unsupported; acceptance evidence OPEN |
| ROADMAP-E7-16 | 259 | - [ ] Animation | E.3.5-02; C.23.10 | EDT-039/040 | PHASE-GATED — animation properties must honor reduced-motion, accessibility and performance limits; acceptance evidence OPEN |
| ROADMAP-E7-17 | 260 | - [ ] Interaction | E.3.6-02; C.23.10 | EDT-019/039/040 | KEEP — interaction properties must use validated actions and avoid arbitrary script; acceptance evidence OPEN |
| ROADMAP-E7-18 | 261 | - [ ] Responsive | E.3.4 | EDT-023–026 | KEEP — responsive properties distinguish inherited and explicit overrides; acceptance evidence OPEN |
| ROADMAP-E7-19 | 262 | - [ ] Accessibility | C.23.16; F.9 | QA-004/005; EDT-021/022 | KEEP — accessibility checks are separate from Inspector category labels; keyboard/focus/contrast/labels tested; acceptance evidence OPEN |
| ROADMAP-E7-20 | 263 | - [ ] SEO | F.9; E.2.3-01 | SEO-001–005; WEB-005/006 | OPEN — SEO is page-level metadata/workflow, not arbitrary element Inspector fields; define exact property ownership; acceptance evidence OPEN |
| ROADMAP-E7-21 | 264 | - [ ] Data | F.2; C.23.12 | DYN-001–008; EDT-020/021/022 | KEEP — data-binding Inspector is schema/permission gated and cannot mutate domain rows; acceptance evidence OPEN |
| ROADMAP-E7-22 | 265 | - [ ] Advanced | C.23.7 | EDT-021/022; SEC-002/005 | OPEN — Advanced category exposes only explicitly supported, permission-safe properties; no arbitrary CSS/JS; acceptance evidence OPEN |
| ROADMAP-E7-COLLAPSIBLE-01 | 267 | Minden szekció összecsukható. | E.3.1-05 | EDT-021/022 | KEEP — Inspector groups collapse/expand without losing field state or causing accidental mutations; acceptance evidence OPEN |
| ROADMAP-E7-23 | 270 | - [ ] property search | C.23.7-03 | EDT-021/022/023/024 | KEEP — property search/category filter and recent/favorite behaviors have explicit empty/no-match states; acceptance evidence OPEN |
| ROADMAP-E7-24 | 271 | - [ ] reset | C.23.7-04 | EDT-021/022 | KEEP — reset uses typed default/inherited value and is undoable; acceptance evidence OPEN |
| ROADMAP-E7-25 | 272 | - [ ] inherited value jelzés | C.23.7-03 | EDT-023/024 | KEEP — inherited-value indicator is accurate for the selected viewport; acceptance evidence OPEN |
| ROADMAP-E7-26 | 273 | - [ ] override jelzés | C.23.7-03 | EDT-023/024 | KEEP — override indicator distinguishes explicit value from inherited default; acceptance evidence OPEN |
| ROADMAP-E7-27 | 274 | - [ ] invalid value jelzés | C.23.7-05 | EDT-021/022 | KEEP — invalid value is visible and cannot silently persist; acceptance evidence OPEN |
| ROADMAP-E7-28 | 275 | - [ ] unit selector | C.23.7-05 | EDT-021/022/023/024 | KEEP — unit selector only lists schema-allowed units and preserves value meaning; acceptance evidence OPEN |
| ROADMAP-E7-29 | 276 | - [ ] color picker | C.23.7-06 | EDT-021/022; DSN-001/006 | KEEP — color picker uses tokens/literals per schema and contrast checks where required; acceptance evidence OPEN |
| ROADMAP-E7-30 | 277 | - [ ] token selector | C.23.7-06 | EDT-021/022; DSN-001/006 | KEEP — token selector binds canonical token ID; no hidden literal overwrite; acceptance evidence OPEN |
| ROADMAP-E7-31 | 278 | - [ ] multi-selection editing | C.23.7-08 | EDT-021/022; EDT-038 | OPEN — multi-selection editing only when properties are compatible; atomic/undoable mixed-selection tests; acceptance evidence OPEN |
| ROADMAP-E8-01 | 281 | - [ ] width/height | E.3.4-02 | EDT-009/016/021/022 | KEEP — width/height values are schema-validated and viewport-aware; acceptance evidence OPEN |
| ROADMAP-E8-02 | 282 | - [ ] min/max | E.3.4-02 | EDT-009/021/022 | KEEP — min/max constraints validated against active layout mode; acceptance evidence OPEN |
| ROADMAP-E8-03 | 283 | - [ ] auto/fit/fill | E.3.4-02 | EDT-009/016/021/022 | KEEP — auto/fit/fill meanings defined per parent/layout; no invalid CSS string pass-through; acceptance evidence OPEN |
| ROADMAP-E8-04 | 284 | - [ ] margin | E.3.4-02 | EDT-016/021/022 | KEEP — margin semantics, supported units and reset/override tested; acceptance evidence OPEN |
| ROADMAP-E8-05 | 285 | - [ ] padding | E.3.4-02 | EDT-016/021/022 | KEEP — padding semantics and per-side independence tested; acceptance evidence OPEN |
| ROADMAP-E8-06 | 286 | - [ ] gap | E.3.4-02 | EDT-016/021/022 | KEEP — gap semantics defined separately from margin/padding; acceptance evidence OPEN |
| ROADMAP-E8-07 | 287 | - [ ] box model | C.23.5 | EDT-009/016/021/022 | KEEP — box model output must match editor preview and public renderer; acceptance evidence OPEN |
| ROADMAP-E8-08 | 288 | - [ ] flex | E.3.4-03 | EDT-016/021/022 | PHASE-GATED — flex direction/wrap/align/gap only within tested subset; acceptance evidence OPEN |
| ROADMAP-E8-09 | 289 | - [ ] grid | E.3.4-03 | EDT-016/021/022 | PHASE-GATED — Grid placement/auto-flow/named areas only if schema and renderer support them; acceptance evidence OPEN |
| ROADMAP-E8-10 | 290 | - [ ] position | C.23.5 | EDT-009/016/021/022 | PHASE-GATED — position values must define containing block/stacking context and unsupported values are rejected; acceptance evidence OPEN |
| ROADMAP-E8-11 | 291 | - [ ] z-index | C.23.5 | EDT-009/021/022 | KEEP — z-index/stacking context behavior tested; no arbitrary value pass-through; acceptance evidence OPEN |
| ROADMAP-E8-12 | 292 | - [ ] overflow | C.23.5 | EDT-009/021/022 | KEEP — overflow/scroll container/sticky conflict warning and public parity tested; acceptance evidence OPEN |
| ROADMAP-E8-13 | 293 | - [ ] aspect ratio | C.23.5 | EDT-009/021/022 | KEEP — aspect ratio valid range and interaction with width/height tested; acceptance evidence OPEN |
| ROADMAP-E8-14 | 294 | - [ ] responsive layout | E.3.4-04 | EDT-023–026 | KEEP — responsive layout and inherited/override values tested across viewport matrix; acceptance evidence OPEN |
| ROADMAP-E9-01 | 297 | - [ ] desktop | E.3.4-04 | EDT-025 | KEEP — desktop viewport preset; no change to persisted content; acceptance evidence OPEN |
| ROADMAP-E9-02 | 298 | - [ ] tablet | E.3.4-04 | EDT-025 | KEEP — tablet viewport preset; supported device width and touch behavior tested; acceptance evidence OPEN |
| ROADMAP-E9-03 | 299 | - [ ] mobile | E.3.4-04 | EDT-025 | KEEP — mobile viewport preset; no clipped canvas/panels; acceptance evidence OPEN |
| ROADMAP-E9-04 | 300 | - [ ] breakpoint model | E.3.4-04 | EDT-023–025 | KEEP — breakpoint model is explicit, stable and versioned; acceptance evidence OPEN |
| ROADMAP-E9-05 | 301 | - [ ] inheritance | E.3.4-04 | EDT-023/024 | KEEP — inheritance is deterministic desktop→tablet→mobile per property; acceptance evidence OPEN |
| ROADMAP-E9-06 | 302 | - [ ] per-device overrides | E.3.4-04 | EDT-023/024 | KEEP — per-device overrides distinguish inherit/reset/explicit value; acceptance evidence OPEN |
| ROADMAP-E9-07 | 303 | - [ ] visibility per device | E.3.4-05 | EDT-026 | KEEP — visibility per device is a supported override, not layer hide; acceptance evidence OPEN |
| ROADMAP-E9-08 | 304 | - [ ] typography per device | E.3.4-04 | EDT-023/024 | KEEP — typography per device respects allowed property schema; acceptance evidence OPEN |
| ROADMAP-E9-09 | 305 | - [ ] spacing per device | E.3.4-04 | EDT-023/024 | KEEP — spacing per device preserves horizontal/vertical and per-side independence; acceptance evidence OPEN |
| ROADMAP-E9-10 | 306 | - [ ] custom breakpoint később | E.3.4-04 | EDT-023–026 | DEFER — custom breakpoint editing is later scope; do not expose unimplemented control; acceptance evidence OPEN |
| ROADMAP-E9-11 | 307 | - [ ] responsive validation | E.3.4-06 | EDT-021–026; QA-004/005 | KEEP — responsive validation warns/rejects unsupported combinations and runs viewport tests; acceptance evidence OPEN |

**Semantic findings:**
- The Inspector's SEO and Accessibility categories are not evidence that the page-level SEO workflow or accessibility acceptance is implemented. Page metadata remains owned by SEO/WEB contracts; accessibility remains a separate QA requirement.
- CSS Filter has no standalone canonical registry ID in the reviewed list. Keep it OPEN until a supported subset and test matrix are explicitly decided; do not silently accept arbitrary CSS strings.
- Flex/Grid/position/transform/overflow remain supported-subset capabilities. A dropdown value must be schema-validated against the active layout mode, serialized, reloaded and rendered identically in preview/public output.
- Custom breakpoint editing is DEFERRED. Desktop/tablet/mobile presets and responsive inheritance/overrides are separate baseline requirements; a custom-breakpoint UI must not appear active before implementation.
- Multi-selection property editing is OPEN unless selected nodes share compatible property schema and the mutation is atomic, undoable and permission-safe.

**Coverage count:** 57 E7–E9 source items are individually keyed. E10–E24 and the roadmap's global rules remain OPEN. P0.2 **IN PROGRESS / NOT PASS**; documentation-only, no runtime code/data changed and no tests run.

### 41.3.28. P0.2 — MASTER-FINAL-ROADMAP source-key ledger: E10 Design System, E11 Components, E12 Clipboard (2026-10-13)

**Source:** docs/archive/plans/MASTER-FINAL-ROADMAP.md, E10–E12, archive lines 313–355. All 35 source checklist items are retained individually below; old checkbox status is historical.

| Source key | Archive line | Exact source item | Current E target | Candidate canonical IDs | Decision / phase / acceptance |
|---|---:|---|---|---|---|
| ROADMAP-E10-01 | 314 | - [ ] colors | E.6.1-01 | DSN-001/002 | KEEP — token schema/type/allowed value definitions required; acceptance evidence OPEN |
| ROADMAP-E10-02 | 315 | - [ ] typography | E.6.1-01 | DSN-001/007 | KEEP — typography tokens and font registry must be canonical; acceptance evidence OPEN |
| ROADMAP-E10-03 | 316 | - [ ] spacing | E.6.1-01 | DSN-001/006 | KEEP — spacing tokens preserve scale and unit semantics; acceptance evidence OPEN |
| ROADMAP-E10-04 | 317 | - [ ] radius | E.6.1-01 | DSN-001 | KEEP — radius token schema and supported CSS units OPEN; acceptance evidence OPEN |
| ROADMAP-E10-05 | 318 | - [ ] shadows | E.6.1-01 | DSN-001 | KEEP — shadow tokens require validated structured values; acceptance evidence OPEN |
| ROADMAP-E10-06 | 319 | - [ ] breakpoints | E.6.1-01; E.3.4-04 | DSN-006; EDT-023–026 | KEEP — breakpoints shared with responsive engine, not independent values; acceptance evidence OPEN |
| ROADMAP-E10-07 | 320 | - [ ] CSS variables/tokens | E.6.1-01 | DSN-001/002 | KEEP — CSS variables are generated from canonical token IDs; no second token store; acceptance evidence OPEN |
| ROADMAP-E10-08 | 321 | - [ ] themes | E.6.2-01 | DSN-005 | KEEP — theme/preset lifecycle and versioning acceptance OPEN; acceptance evidence OPEN |
| ROADMAP-E10-09 | 322 | - [ ] light/dark későbbi lehetőség | E.6.2-01 | DSN-005; QA-005 | DEFER — light/dark theme switching only after contrast, asset and responsive acceptance; acceptance evidence OPEN |
| ROADMAP-E10-10 | 323 | - [ ] Sanci brand tokens | E.6.1-01 | DSN-001/005/016 | KEEP — Sanci brand tokens remain reusable and configurable, not hardcoded per page; acceptance evidence OPEN |
| ROADMAP-E10-11 | 324 | - [ ] token override | E.6.2-02 | DSN-002/003/004 | KEEP — local override explicit, visible and reversible; acceptance evidence OPEN |
| ROADMAP-E10-12 | 325 | - [ ] usage search | E.6.2-03 | DSN-003 | KEEP — usage search/dependency map includes pages, components and templates; acceptance evidence OPEN |
| ROADMAP-E11-01 | 328 | - [ ] reusable component | E.6.5-01 | DSN-011/012 | KEEP — reusable component definition and typed schema; acceptance evidence OPEN |
| ROADMAP-E11-02 | 329 | - [ ] component instance | E.6.5-01 | DSN-012 | KEEP — instance references canonical master, not copied duplicate state; acceptance evidence OPEN |
| ROADMAP-E11-03 | 330 | - [ ] master/instance kapcsolat | E.6.5-01 | DSN-012/013 | KEEP — master/instance propagation and sync policy explicit; acceptance evidence OPEN |
| ROADMAP-E11-04 | 331 | - [ ] local override | E.6.5-01 | DSN-013 | KEEP — local override explicit, visible and resettable; acceptance evidence OPEN |
| ROADMAP-E11-05 | 332 | - [ ] variants | E.6.5-02 | DSN-013 | KEEP — variants use typed props/slots and compatibility checks; acceptance evidence OPEN |
| ROADMAP-E11-06 | 333 | - [ ] state variants | E.6.5-02 | DSN-013 | KEEP — state variants do not bypass interaction/action validation; acceptance evidence OPEN |
| ROADMAP-E11-07 | 334 | - [ ] reusable sections | E.6.3-01 | DSN-010/012/013 | KEEP — reusable section preserves hierarchy and resource references; acceptance evidence OPEN |
| ROADMAP-E11-08 | 335 | - [ ] header/footer | E.2.1-03; E.6.5-01 | WEB-002; DSN-012/013 | KEEP — shared header/footer/navigation are reusable canonical components, not duplicated hardcoded page markup; acceptance evidence OPEN |
| ROADMAP-E11-09 | 336 | - [ ] card systems | E.6.5-02 | EDT-018/019; DSN-011/013 | KEEP — card system uses typed data and shared variants; acceptance evidence OPEN |
| ROADMAP-E11-10 | 337 | - [ ] CTA | E.3.6-01; E.6.5-02 | EDT-017/039; DSN-016 | KEEP — CTA/button registry has canonical action/route, permission and style; acceptance evidence OPEN |
| ROADMAP-E11-11 | 338 | - [ ] component validation | E.3.5-04; E.6.5-02 | EDT-021/022; QA-002/003 | KEEP — component schema/props/slots validated before save and render; acceptance evidence OPEN |
| ROADMAP-E12-01 | 345 | - [ ] copy | E.3.3-04 | EDT-038; EDT-004 | KEEP — copy preserves source and creates immutable clipboard payload; acceptance evidence OPEN |
| ROADMAP-E12-02 | 346 | - [ ] cut | E.3.3-04 | EDT-038; EDT-004 | KEEP — cut is atomic/undoable; delete semantics and references validated; acceptance evidence OPEN |
| ROADMAP-E12-03 | 347 | - [ ] paste | E.3.3-04 | EDT-038; EDT-004 | KEEP — paste generates fresh IDs and validates parent/child rules; acceptance evidence OPEN |
| ROADMAP-E12-04 | 348 | - [ ] duplicate | E.3.3-04 | EDT-011/038 | KEEP — duplicate creates fresh IDs and rewrites internal references; acceptance evidence OPEN |
| ROADMAP-E12-05 | 349 | - [ ] multi-copy | E.3.3-04 | EDT-038 | KEEP — multi-copy is atomic, permission-safe and undoable; acceptance evidence OPEN |
| ROADMAP-E12-06 | 350 | - [ ] cross-page paste | E.3.3-04; E.4-01 | EDT-038; EDT-002/011; SEC-003 | KEEP — cross-page paste checks source/target site/page permissions and asset/binding references; acceptance evidence OPEN |
| ROADMAP-E12-07 | 351 | - [ ] paste structure | E.3.2-02 | EDT-001/002/038 | KEEP — pasted structure validated as a whole before mutation; acceptance evidence OPEN |
| ROADMAP-E12-08 | 352 | - [ ] paste style only | E.3.5-02 | EDT-021/022/038 | KEEP — style-only paste changes only compatible style properties and is undoable; acceptance evidence OPEN |
| ROADMAP-E12-09 | 353 | - [ ] import/export JSON | E.18-01; DSN-015 | EDT-001; DSN-015; OPS-004/005; SEC-002 | KEEP — JSON import/export requires schema/version validation, dry-run, permission and no-secret checks; acceptance evidence OPEN |
| ROADMAP-E12-10 | 354 | - [ ] context menu | E.3.1-01; E.3.3-05 | EDT-039; ADM-006 | KEEP — context menu actions map to canonical action registry and respect permissions; acceptance evidence OPEN |
| ROADMAP-E12-11 | 355 | - [ ] keyboard shortcuts | E.3.3-05 | EDT-037/038/039; QA-004 | KEEP — keyboard shortcuts have discoverable labels, focus behavior and conflict/disabled-state tests; acceptance evidence OPEN |

**Semantic findings:**
- Design tokens, themes, breakpoints and font metadata must remain a single canonical token system. Local overrides require explicit inheritance/detach/reset semantics, dependency search, impact preview and rollback; a token selector alone is not proof of these behaviors.
- Theme light/dark support remains phase-gated. The historical “later possibility” cannot be presented as an active 1.0 switch before contrast, responsive, asset and public-render tests pass.
- Components, instances, variants and reusable sections must use DSN-012/013 master-instance semantics; shared updates cannot silently overwrite local overrides or break published pages.
- Clipboard and JSON import/export are not raw DOM/JSON injection. Copy/cut/paste/duplicate must create valid fresh IDs and preserve/validate references; cross-page paste checks site/page ownership; JSON import requires dry-run/no-write, schema/version, permission, no-secret, asset/reference and rollback tests.
- Context menu and keyboard shortcuts are action-registry entries, not parallel mutation handlers.

**Coverage count:** 34 E10–E12 source items are individually keyed. E13–E24 and the roadmap's global rules remain OPEN. P0.2 **IN PROGRESS / NOT PASS**; documentation-only, no runtime code/data changed and no tests run.

### 41.3.29. P0.2 — MASTER-FINAL-ROADMAP source-key ledger: E13 History, E14 Recovery, E15 Pages, E16 Publish (2026-10-13)

**Source:** docs/archive/plans/MASTER-FINAL-ROADMAP.md, E13–E16, archive lines 357–409. All 42 source checklist items are individually keyed below; the old [x]/[ ] state is historical and does not override the current MASTER.

| Source key | Archive line | Exact source item | Current E target | Candidate canonical IDs | Decision / phase / acceptance |
|---|---:|---|---|---|---|
| ROADMAP-E13-01 | 358 | - [x] Core undo/redo alap | E.3.7-01 | EDT-005 | KEEP — core undo/redo historical check applies only to its exact commit; current runtime needs fresh tests; acceptance evidence OPEN |
| ROADMAP-E13-02 | 359 | - [ ] UI history panel | E.3.7-01 | EDT-005; EDT-027 | KEEP — history panel must reflect canonical command history, not create independent state; acceptance evidence OPEN |
| ROADMAP-E13-03 | 360 | - [ ] grouped history | E.3.7-01 | EDT-004/005 | KEEP — grouped history transaction boundaries are explicit and undoable; acceptance evidence OPEN |
| ROADMAP-E13-04 | 361 | - [ ] drag/resize grouping | F.1-05; E.3.7-01 | EDT-004/005/009 | KEEP — drag/resize from pointer-down to pointer-up is one history entry; acceptance evidence OPEN |
| ROADMAP-E13-05 | 362 | - [ ] typing grouping | F.1-05; E.3.7-01 | EDT-004/005 | KEEP — typing groups after debounce/blur; text changes cannot flood history; acceptance evidence OPEN |
| ROADMAP-E13-06 | 363 | - [ ] named versions | E.4-04 | WEB-008; EDT-005 | OPEN — named versions require explicit schema/retention/owner and restore contract; acceptance evidence OPEN |
| ROADMAP-E13-07 | 364 | - [ ] restore | E.4-04; E.4-05 | WEB-008; OPS-009 | KEEP — restore creates auditable revision and validates compatibility/ownership; acceptance evidence OPEN |
| ROADMAP-E13-08 | 365 | - [ ] history preview | E.4-03; E.3.7-01 | EDT-032; WEB-008 | KEEP — history preview is read-only and cannot mutate current draft or published snapshot; acceptance evidence OPEN |
| ROADMAP-E13-09 | 366 | - [ ] diff | E.4-04 | WEB-008 | KEEP — diff shows exact schema-safe change set and supports restore verification; acceptance evidence OPEN |
| ROADMAP-E13-10 | 367 | - [ ] server-side versions | E.4-04 | WEB-008; EDT-028/029 | KEEP — server-side versions are authoritative; client history is not persistence; acceptance evidence OPEN |
| ROADMAP-E14-01 | 370 | - [ ] autosave debounce | F.1-08; E.3.7-03 | EDT-027/028/030 | KEEP — debounce interval and explicit save semantics tested; acceptance evidence OPEN |
| ROADMAP-E14-02 | 371 | - [ ] save queue | F.1-08 | EDT-030/031 | OPEN — save queue ordering, coalescing and stale-response handling need explicit acceptance; acceptance evidence OPEN |
| ROADMAP-E14-03 | 372 | - [ ] retry | F.1-08 | EDT-031/042; OPS-003 | KEEP — retry is bounded/idempotent and preserves user edits; acceptance evidence OPEN |
| ROADMAP-E14-04 | 373 | - [ ] timeout | F.1-08 | EDT-031; OPS-003 | KEEP — timeout shows recoverable error and cannot report false success; acceptance evidence OPEN |
| ROADMAP-E14-05 | 374 | - [ ] dirty state | F.1-08; E.3.7-02 | EDT-027 | KEEP — dirty state follows canonical model and save status; acceptance evidence OPEN |
| ROADMAP-E14-06 | 375 | - [ ] local recovery | F.1-09 | EDT-031/042; SEC-008 | KEEP — local recovery is a separate recovery copy and stores no secrets/tokens; acceptance evidence OPEN |
| ROADMAP-E14-07 | 376 | - [ ] crash recovery | F.1-09 | EDT-031/042; SEC-008 | KEEP — crash recovery survives reload/crash without overwriting server draft silently; acceptance evidence OPEN |
| ROADMAP-E14-08 | 377 | - [ ] unsaved changes protection | F.1-08 | EDT-027/031 | KEEP — navigation/refresh protection covers unsaved edits and failed saves; acceptance evidence OPEN |
| ROADMAP-E14-09 | 378 | - [ ] revision/ETag | F.1-10 | EDT-029; WEB-008 | KEEP — expected revision/ETag is checked server-side before mutation; acceptance evidence OPEN |
| ROADMAP-E14-10 | 379 | - [ ] conflict screen | F.1-09; F.1-10 | EDT-029 | KEEP — conflict UI offers explicit valid choices; no silent overwrite; acceptance evidence OPEN |
| ROADMAP-E14-11 | 380 | - [ ] reload/merge/overwrite policy | F.1-09 | EDT-029/031/042; WEB-008 | OPEN — reload/merge/overwrite policy must define conflict types and preserve user edits; acceptance evidence OPEN |
| ROADMAP-E14-12 | 381 | - [ ] multi-tab detection | F.1-10 | EDT-029/030 | OPEN — multi-tab detection/coordination has no dedicated stable ID; define local coordination and server conflict tests; acceptance evidence OPEN |
| ROADMAP-E15-01 | 388 | - [ ] page create | E.4-01 | WEB-001; EDT-001/002 | KEEP — create page validates site scope, slug and initial Page Model; acceptance evidence OPEN |
| ROADMAP-E15-02 | 389 | - [ ] edit | E.4-01 | WEB-001/004; EDT-001/021/022 | KEEP — edit targets canonical page/draft version, not generated HTML; acceptance evidence OPEN |
| ROADMAP-E15-03 | 390 | - [ ] duplicate | E.4-01 | WEB-001; EDT-011 | KEEP — page duplicate generates unique slug/IDs and validates all references; acceptance evidence OPEN |
| ROADMAP-E15-04 | 391 | - [ ] delete | E.4-01 | WEB-001; RES-008/009; SEC-002 | KEEP — delete checks dependencies/redirect/asset usage and follows restore policy; acceptance evidence OPEN |
| ROADMAP-E15-05 | 392 | - [ ] slug | E.4-01 | WEB-001/013; SEC-002 | KEEP — slug changes are validated and redirect/URL conflicts are handled; acceptance evidence OPEN |
| ROADMAP-E15-06 | 393 | - [ ] title | E.4-01 | WEB-001; EDT-001 | KEEP — title is persisted as canonical page metadata and rendered safely; acceptance evidence OPEN |
| ROADMAP-E15-07 | 394 | - [ ] meta | E.4-01; E.2.3-01 | SEO-001/002; WEB-005 | KEEP — meta fields have schema/length/locale and preview validation; acceptance evidence OPEN |
| ROADMAP-E15-08 | 395 | - [ ] canonical | E.4-01; F.9-02 | SEO-001; WEB-013 | KEEP — canonical URL is normalized, unique and cannot point to unsafe/unowned destination; acceptance evidence OPEN |
| ROADMAP-E15-09 | 396 | - [ ] status | E.4-01; E.4-02 | WEB-004/006 | KEEP — draft/review/published/scheduled/archived transitions validated; acceptance evidence OPEN |
| ROADMAP-E15-10 | 397 | - [ ] template | E.4-01; E.6.3 | DSN-009/014; WEB-001 | KEEP — template assignment checks schema/version compatibility and migration; acceptance evidence OPEN |
| ROADMAP-E15-11 | 398 | - [ ] permissions | E.4-01; E.19 | SEC-002/003/010; WEB-001 | KEEP — page CRUD is server-authorized, site-scoped and audited; acceptance evidence OPEN |
| ROADMAP-E16-01 | 401 | - [ ] draft | E.4-02 | WEB-004 | KEEP — draft is not publicly reachable or indexable; acceptance evidence OPEN |
| ROADMAP-E16-02 | 402 | - [ ] preview | E.4-03 | EDT-032; WEB-005 | KEEP — preview is isolated from published state and cache; acceptance evidence OPEN |
| ROADMAP-E16-03 | 403 | - [ ] publish | E.4-05 | EDT-033; WEB-006 | KEEP — publish is explicit, authorized and atomic; acceptance evidence OPEN |
| ROADMAP-E16-04 | 404 | - [ ] unpublish | E.4-05 | WEB-006 | KEEP — unpublish has explicit public-route/cache behavior and audit; acceptance evidence OPEN |
| ROADMAP-E16-05 | 405 | - [ ] published snapshot | E.4-04; E.4-05 | WEB-006/008 | KEEP — published snapshot/revision linkage is immutable and traceable; acceptance evidence OPEN |
| ROADMAP-E16-06 | 406 | - [ ] version ID | E.4-04 | WEB-008; EDT-029 | KEEP — version ID binds revision and expected-version concurrency; acceptance evidence OPEN |
| ROADMAP-E16-07 | 407 | - [ ] rollback | E.4-05 | OPS-009; WEB-008 | KEEP — rollback has explicit authorization, cache invalidation and recovery; acceptance evidence OPEN |
| ROADMAP-E16-08 | 408 | - [ ] publish validation | E.4-05; E.20 | WEB-006; SEC-002; SEO-001–005 | KEEP — publish validation blocks invalid schema/permission/SEO/asset references; acceptance evidence OPEN |
| ROADMAP-E16-09 | 409 | - [ ] atomic publish | E.4-05 | WEB-006; OPS-009 | KEEP — publish is atomic: failure leaves prior published snapshot and cache behavior consistent; acceptance evidence OPEN |

**Semantic findings:**
- Historical undo/redo PASS is limited to the exact old commit/scope. Current acceptance must cover grouped typing/drag transactions, transaction rollback, history panel consistency, reload behavior and no DOM-snapshot history.
- Autosave, retry, timeout, local/crash recovery, dirty state, expected-version concurrency, conflict choices and multi-tab coordination are distinct failure modes. EDT-031/042 and EDT-029 acceptance must prove no lost edits, no duplicate command and no silent stale overwrite.
- Page CRUD and Publish are separate lifecycle contracts. Draft/preview/unpublish/publish/rollback must be site-scoped, server-authorized, revision-bound, cache-safe and failure-atomic. A visible button or a stored Page Model does not prove public route behavior.
- Multi-tab coordination remains OPEN because the historical requirement does not identify a dedicated stable ID; retain it as a requirement and resolve the canonical owner/implementation before P0.2 PASS.

**Coverage count:** 42 E13–E16 source items are individually keyed. E17–E24 and the roadmap's global rules remain OPEN. P0.2 **IN PROGRESS / NOT PASS**; documentation-only, no runtime code/data changed and no tests run.

### 41.3.30. P0.2 — MASTER-FINAL-ROADMAP source-key ledger: E17 Templates, E18 real pages, E19 Media/R2 (2026-10-13)

**Source:** docs/archive/plans/MASTER-FINAL-ROADMAP.md, E17–E19, archive lines 411–453. All 34 source checklist items are retained individually; old checkbox status is historical.

| Source key | Archive line | Exact source item | Current E target | Candidate canonical IDs | Decision / phase / acceptance |
|---|---:|---|---|---|---|
| ROADMAP-E17-01 | 412 | - [ ] blank | E.6.3-01 | EDT-041; DSN-009/010 | KEEP — blank starter is a valid empty Page Model and onboarding flow; acceptance evidence OPEN |
| ROADMAP-E17-02 | 413 | - [ ] streamer home | E.6.3-01; E.2.1-01 | DSN-009; WEB-014 | KEEP — streamer-home template must be editable and use canonical page/data sources; acceptance evidence OPEN |
| ROADMAP-E17-03 | 414 | - [ ] schedule | E.6.3-01; E.8 | DSN-009/010; WEB-016; SCH-001–015 | KEEP — Schedule template is presentation config, not a second Schedule data store; acceptance evidence OPEN |
| ROADMAP-E17-04 | 415 | - [ ] about | E.6.3-01; E.2.1-01 | DSN-009; WEB-018 | KEEP — About template binds to canonical profile/page content; acceptance evidence OPEN |
| ROADMAP-E17-05 | 416 | - [ ] contact | E.6.3-01; C.23.8-07 | DSN-009; WEB-020 | KEEP — Contact template uses validated form route and server-side consent/security; acceptance evidence OPEN |
| ROADMAP-E17-06 | 417 | - [ ] community | E.6.3-01; E.13 | DSN-009; WEB-019; COM-001/002 | KEEP — Community template distinguishes public links/CTA from future posts/comments; acceptance evidence OPEN |
| ROADMAP-E17-07 | 418 | - [ ] VOD | E.6.3-01; E.10 | DSN-009; WEB-017; CNT-001–020 | KEEP — VOD template uses canonical content records and honest provider fallback; acceptance evidence OPEN |
| ROADMAP-E17-08 | 419 | - [ ] support | E.6.3-01 | DSN-009; WEB-023; SUP-001–003 | KEEP — Support template is not proof of active payments/membership; acceptance evidence OPEN |
| ROADMAP-E17-09 | 420 | - [ ] custom template | E.6.3-01; DSN-014 | DSN-008/009/010/014 | KEEP — custom templates require compatibility, migration, preview and rollback policy; acceptance evidence OPEN |
| ROADMAP-E18-01 | 423 | - [ ] Home | E.2.1-01 | WEB-014; WEB-001/002 | KEEP — Home route/page model and content preserved; migration parity tests required; acceptance evidence OPEN |
| ROADMAP-E18-02 | 424 | - [ ] Rólam | E.2.1-01; F.4-05 | WEB-018; WEB-001/002 | KEEP — About/Profile route uses canonical page CRUD and profile content; acceptance evidence OPEN |
| ROADMAP-E18-03 | 425 | - [ ] Adásrend | E.2.1-01; E.8 | WEB-016; SCH-001–015 | KEEP — Schedule page and canonical Schedule domain remain separate but connected by safe binding; acceptance evidence OPEN |
| ROADMAP-E18-04 | 426 | - [ ] Twitch | E.2.1-01; E.9 | WEB-015; INT-001–012; LIV-001–007 | KEEP — Twitch/live page only uses permitted normalized data and safe embeds; acceptance evidence OPEN |
| ROADMAP-E18-05 | 427 | - [ ] YouTube | E.2.1-01; E.9 | WEB-001/002; INT-013; CNT-001–020 | OPEN — no distinct canonical YouTube page ID; decide whether generic Page/Content Hub route or platform-specific route is canonical; acceptance evidence OPEN |
| ROADMAP-E18-06 | 428 | - [ ] TikTok | E.2.1-01; E.9 | WEB-001/002; INT-014; CNT-001–020 | OPEN — no distinct canonical TikTok page ID; preserve source intent and decide route/template/adapter boundary; acceptance evidence OPEN |
| ROADMAP-E18-07 | 429 | - [ ] Közösség | E.2.1-01; E.13 | WEB-019; COM-001/002 | KEEP — Community page and public community links; posts/comments are separately gated; acceptance evidence OPEN |
| ROADMAP-E18-08 | 430 | - [ ] Kapcsolat | E.2.1-01; F.7-04 | WEB-020; SEC-002/005/011 | KEEP — Contact route/form schema, spam/rate limits, consent/privacy and no-secret logging; acceptance evidence OPEN |
| ROADMAP-E18-09 | 431 | - [ ] Támogatás | E.2.1-01; F.12-05 | WEB-023; SUP-001–003; COM-014 | KEEP — Support page with external CTA/verified goal; payment integration separately gated; acceptance evidence OPEN |
| ROADMAP-E18-10 | 432 | - [ ] VOD | E.2.1-01; E.10 | WEB-017; CNT-001–020; INT-013–016 | KEEP — VOD route includes VOD/highlight/clip/Shorts and provider/manual fallback; acceptance evidence OPEN |
| ROADMAP-E18-11 | 433 | - [ ] Shorts | E.2.1-01; E.10 | WEB-017; CNT-003/004 | KEEP — Shorts remain content records/feeds, not hardcoded page logic; acceptance evidence OPEN |
| ROADMAP-E18-12 | 434 | - [ ] Sponsor/Business | E.2.1-01; E.15 | WEB-024; CAM-001/004 | KEEP — Sponsor/Business page remains public press-kit/lead surface, not active CRM by default; acceptance evidence OPEN |
| ROADMAP-E18-13 | 435 | - [ ] Press Kit | E.2.1-01; E.15 | WEB-024; CAM-004 | KEEP — Press Kit export/privacy/version acceptance required; acceptance evidence OPEN |
| ROADMAP-E19-01 | 442 | - [ ] upload | E.5.1 | RES-003; RES-001/002 | KEEP — upload validates owner/site, MIME/content/size/object key and progress/cancel/retry; acceptance evidence OPEN |
| ROADMAP-E19-02 | 443 | - [ ] folders | E.5.1 | RES-006 | KEEP — folders/collections are metadata organization, not a second binary store; acceptance evidence OPEN |
| ROADMAP-E19-03 | 444 | - [ ] search | E.5.1 | RES-005/010 | KEEP — search indexes canonical metadata and permissions; acceptance evidence OPEN |
| ROADMAP-E19-04 | 445 | - [ ] filter | E.5.1 | RES-005 | KEEP — filter respects media type/status/owner/site scope; acceptance evidence OPEN |
| ROADMAP-E19-05 | 446 | - [ ] preview | E.5.1 | RES-004/010 | KEEP — preview uses safe variants and protected asset authorization; acceptance evidence OPEN |
| ROADMAP-E19-06 | 447 | - [ ] metadata | E.5.1 | RES-002/007 | KEEP — metadata belongs to D1; binary belongs to R2; acceptance evidence OPEN |
| ROADMAP-E19-07 | 448 | - [ ] alt text | E.5.1 | RES-007 | KEEP — alt text/caption/source/license fields have schema and requiredness policy; acceptance evidence OPEN |
| ROADMAP-E19-08 | 449 | - [ ] crop/resize | E.5.1 | RES-004; RES-002 | OPEN — crop/resize must distinguish non-destructive display variants from binary transformation/overwrite; acceptance evidence OPEN |
| ROADMAP-E19-09 | 450 | - [ ] replace | E.5.1 | RES-009; RES-008 | KEEP — replace is usage-aware, versioned and rollback-safe; acceptance evidence OPEN |
| ROADMAP-E19-10 | 451 | - [ ] delete | E.5.1 | RES-009; RES-008; SEC-002 | KEEP — delete checks references, site scope and restore/soft-delete policy; acceptance evidence OPEN |
| ROADMAP-E19-11 | 452 | - [ ] usage tracking | E.5.1 | RES-008 | KEEP — usage tracking covers Pages, blocks, templates, Schedule and protected downloads; acceptance evidence OPEN |
| ROADMAP-E19-12 | 453 | - [ ] unused media | E.5.1 | RES-008/015 | KEEP — unused-media report must distinguish truly unused from unindexed/failed references; acceptance evidence OPEN |

**Semantic findings:**
- Templates are reusable structured Page Model instances. They must not copy live Schedule/domain rows, bypass the canonical renderer or introduce a parallel Editor/page model.
- The old roadmap names separate Twitch, YouTube and TikTok pages. Twitch has the explicit public Live page ID WEB-015; YouTube/TikTok currently have adapters/content IDs but no distinct public page ID in the registry. This is an explicit route/template decision still OPEN, not permission to drop those historical pages.
- Media lifecycle is D1 metadata + R2 binary, with canonical resource IDs and site ownership. Upload, replace, delete and unused-media detection need reference checks and negative ownership tests; an upload button or media preview does not prove a complete Media Manager.
- Crop/resize must clarify whether it changes display metadata, generates a new derivative, or overwrites binary. Non-destructive variant generation and usage-aware rollback must be specified before accepting destructive transformations.

**Coverage count:** 34 E17–E19 source items are individually keyed. E20–E24 and the roadmap's global rules remain OPEN. P0.2 **IN PROGRESS / NOT PASS**; documentation-only, no runtime code/data changed and no tests run.

### 41.3.31. P0.2 — MASTER-FINAL-ROADMAP source-key ledger: E20 Data, E21 integrations, E22 interactions, E23 accessibility, E24 SEO (2026-10-13)

**Source:** docs/archive/plans/MASTER-FINAL-ROADMAP.md, E20–E24, archive lines 455–518. All 51 source checklist items are preserved individually. Old [ ] status is historical; this mapping does not assert that integrations, accessibility or SEO runtime acceptance currently passes.

| Source key | Archive line | Exact source item | Current E target | Candidate canonical IDs | Decision / phase / acceptance |
|---|---:|---|---|---|---|
| ROADMAP-E20-01 | 456 | - [ ] D1 bindings | F.2-01 | DYN-001–008; SEC-002 | KEEP — D1 accessed only through server-side domain service; never browser direct access; acceptance evidence OPEN |
| ROADMAP-E20-02 | 457 | - [ ] site settings | F.2-01 | DYN-001; SET-001 | KEEP — site settings are a declared, typed source with site-scope checks; acceptance evidence OPEN |
| ROADMAP-E20-03 | 458 | - [ ] schedule | F.2-01; F.2-06 | DYN-001; SCH-001–015; EDT-020 | KEEP — Schedule binding is read-only presentation; no domain-row mutation; acceptance evidence OPEN |
| ROADMAP-E20-04 | 459 | - [ ] Twitch | F.2-02; F.5-03 | DYN-001; INT-001; LIV-001–007 | KEEP — Twitch data is normalized, permission-checked and freshness-aware; acceptance evidence OPEN |
| ROADMAP-E20-05 | 460 | - [ ] YouTube | F.2-02; F.5-04 | DYN-001; INT-013; CNT-001–020 | PHASE-GATED — YouTube source only with actual scope/capability; no fabricated metrics; acceptance evidence OPEN |
| ROADMAP-E20-06 | 461 | - [ ] TikTok | F.2-02; F.5-05 | DYN-001; INT-014/018; CNT-001–020 | PHASE-GATED — TikTok source is capability-gated; manual fallback when API unavailable; acceptance evidence OPEN |
| ROADMAP-E20-07 | 462 | - [ ] Discord | F.2-02; C.23.18-02 | DYN-001; INT-015; COM-001/002 | PHASE-GATED — Discord link and API source are separate contracts; acceptance evidence OPEN |
| ROADMAP-E20-08 | 463 | - [ ] VOD | F.2-01; F.5-02 | DYN-001/002; CNT-001–020 | KEEP — VOD source uses canonical content collection and allowed query schema; acceptance evidence OPEN |
| ROADMAP-E20-09 | 464 | - [ ] collections | F.2-03 | DYN-002/003; CNT-001–020 | KEEP — collection query/filter/sort/limit schema and owner/site scope validated; acceptance evidence OPEN |
| ROADMAP-E20-10 | 465 | - [ ] loading/empty/error states | F.2-04 | DYN-005/006; OPS-003; SEC-008 | KEEP — loading/empty/error/stale/partial states; redact internals and secrets; acceptance evidence OPEN |
| ROADMAP-E20-11 | 466 | - [ ] conditional rendering | F.2-05 | DYN-004/006/007; WEB-030; SEC-002 | KEEP — conditional visibility cannot bypass authorization; cache invalidation tied to publish/sync; acceptance evidence OPEN |
| ROADMAP-E21-01 | 469 | - [ ] Twitch API | F.5-03 | INT-001–012; LIV-001–007 | KEEP — Twitch adapter scope, OAuth, refresh/disconnect and permitted metrics tested; acceptance evidence OPEN |
| ROADMAP-E21-02 | 470 | - [ ] YouTube API | F.5-04 | INT-013; INT-009/018/020 | PHASE-GATED — YouTube API quota/capability/error contract separate from public link; acceptance evidence OPEN |
| ROADMAP-E21-03 | 471 | - [ ] TikTok integration | F.5-05 | INT-014; INT-009/018/020 | PHASE-GATED — TikTok integration only with available official capability/scope; acceptance evidence OPEN |
| ROADMAP-E21-04 | 472 | - [ ] Discord integration | F.5-06; C.23.18-02 | INT-015; COM-001/002 | PHASE-GATED — Discord link vs bot/guild/role integration separate; acceptance evidence OPEN |
| ROADMAP-E21-05 | 473 | - [ ] webhook/event handling | F.5-03; E.20 | INT-017/020; SEC-003/004/010 | KEEP — webhook signature/replay/idempotency, event ownership and audit tested; acceptance evidence OPEN |
| ROADMAP-E21-06 | 474 | - [ ] secrets/permissions | F.5-03; E.19 | INT-019; SEC-001/002/008 | KEEP — tokens/secrets server-side only, least privilege, redaction and disconnect lifecycle; acceptance evidence OPEN |
| ROADMAP-E21-07 | 475 | - [ ] cache policy | F.2-05; F.9-06 | OPS-008; WEB-030; DYN-006 | KEEP — cache scope/freshness/invalidation explicit; no stale cross-site data; acceptance evidence OPEN |
| ROADMAP-E21-08 | 476 | - [ ] failure fallback | F.2-04; F.5-07 | INT-020; OPS-003; DYN-005/006 | KEEP — provider failure fallback is honest and exposes last-success/freshness where safe; acceptance evidence OPEN |
| ROADMAP-E22-01 | 483 | - [ ] click | F.4-06; C.23.10 | EDT-039 | KEEP — click actions are validated, permission-filtered and route through canonical action registry; acceptance evidence OPEN |
| ROADMAP-E22-02 | 484 | - [ ] hover | F.4-06; C.23.10 | EDT-039; QA-004 | KEEP — hover has keyboard/focus equivalent where functionally relevant; acceptance evidence OPEN |
| ROADMAP-E22-03 | 485 | - [ ] focus | F.4-06; C.23.10 | EDT-039; EDT-037; QA-004 | KEEP — focus behavior is visible, predictable and keyboard-operable; acceptance evidence OPEN |
| ROADMAP-E22-04 | 486 | - [ ] submit | F.4-06; C.23.8-07 | EDT-039; WEB-020; SEC-002/005/011 | KEEP — submit is server-validated, rate-limited and consent-aware where applicable; acceptance evidence OPEN |
| ROADMAP-E22-05 | 487 | - [ ] scroll | F.4-06 | EDT-039; QA-004/005 | KEEP — scroll triggers respect reduced-motion/performance and do not trap keyboard focus; acceptance evidence OPEN |
| ROADMAP-E22-06 | 488 | - [ ] load | F.4-06 | EDT-039; QA-004 | KEEP — load actions have deterministic timing and safe fallback; acceptance evidence OPEN |
| ROADMAP-E22-07 | 489 | - [ ] timer | F.4-06 | EDT-039; QA-004 | KEEP — timer actions cancel/cleanup correctly and do not create duplicate mutations; acceptance evidence OPEN |
| ROADMAP-E22-08 | 490 | - [ ] open/close | F.4-06 | EDT-039; QA-004 | KEEP — open/close state and focus return tested; acceptance evidence OPEN |
| ROADMAP-E22-09 | 491 | - [ ] navigate | F.4-06 | EDT-039; WEB-013 | KEEP — navigation uses validated internal route or safe external URL; acceptance evidence OPEN |
| ROADMAP-E22-10 | 492 | - [ ] show/hide | F.4-06; C.23.4-03 | EDT-039; DYN-004; EDT-014 | KEEP — public conditional visibility is separate from editor layer hide/lock; acceptance evidence OPEN |
| ROADMAP-E22-11 | 493 | - [ ] toggle | F.4-06 | EDT-039; DYN-004 | KEEP — toggle is typed state, not arbitrary script or hidden mutation; acceptance evidence OPEN |
| ROADMAP-E22-12 | 494 | - [ ] state | F.4-06; C.23.10 | EDT-039; AI-008 | OPEN — component interaction state vs page/domain state ownership must be explicit; acceptance evidence OPEN |
| ROADMAP-E22-13 | 495 | - [ ] animation triggers | F.4-07; C.23.10 | EDT-039/040; QA-004/005 | PHASE-GATED — animation triggers obey reduced-motion, valid target/action and performance limits; acceptance evidence OPEN |
| ROADMAP-E23-01 | 498 | - [ ] semantic HTML | F.9-03; C.23.16 | QA-004/005; WEB-032 | KEEP — semantic HTML landmarks and supported element semantics tested; acceptance evidence OPEN |
| ROADMAP-E23-02 | 499 | - [ ] heading hierarchy | F.9-03; C.23.16 | QA-004/005 | KEEP — heading hierarchy and heading-level validation tested; acceptance evidence OPEN |
| ROADMAP-E23-03 | 500 | - [ ] alt | E.5.1; C.23.13-06 | RES-007; QA-005 | KEEP — image alt policy distinguishes decorative vs informative assets; acceptance evidence OPEN |
| ROADMAP-E23-04 | 501 | - [ ] labels | C.23.8-07; F.7-04 | QA-004/005; WEB-020 | KEEP — forms and controls have programmatic labels and error associations; acceptance evidence OPEN |
| ROADMAP-E23-05 | 502 | - [ ] ARIA | F.9-03; C.23.16 | QA-004/005; WEB-032 | KEEP — ARIA only where needed; native semantic controls preferred; acceptance evidence OPEN |
| ROADMAP-E23-06 | 503 | - [ ] keyboard navigation | E.3.3-05; C.23.3-07 | EDT-037; QA-004 | KEEP — all core Editor operations have keyboard alternative; acceptance evidence OPEN |
| ROADMAP-E23-07 | 504 | - [ ] focus order | E.3.3-05; C.23.16 | EDT-037; QA-004 | KEEP — focus order follows UI hierarchy and returns after modal/overlay close; acceptance evidence OPEN |
| ROADMAP-E23-08 | 505 | - [ ] contrast warnings | F.9-03 | QA-005; DSN-001/005 | KEEP — contrast warnings use measured colors/tokens and identify affected element; acceptance evidence OPEN |
| ROADMAP-E23-09 | 506 | - [ ] screen-reader metadata | F.9-03; C.23.16 | QA-004/005 | KEEP — screen-reader names/status/errors are exposed without duplicate/confusing announcements; acceptance evidence OPEN |
| ROADMAP-E23-10 | 507 | - [ ] editor validation | F.9-03; C.23.16 | EDT-021/022; QA-004/005 | KEEP — Inspector/public validation flags accessibility issues; not a substitute for final audit; acceptance evidence OPEN |
| ROADMAP-E24-01 | 510 | - [ ] title | F.9-01 | SEO-001; WEB-001/014–027 | KEEP — title is page/locale-specific and validated before publish; acceptance evidence OPEN |
| ROADMAP-E24-02 | 511 | - [ ] description | F.9-01 | SEO-002; WEB-001/014–027 | KEEP — description length/empty/fallback behavior tested; acceptance evidence OPEN |
| ROADMAP-E24-03 | 512 | - [ ] canonical | F.9-01 | SEO-001; WEB-013 | KEEP — canonical URL normalized, unique and redirect-compatible; acceptance evidence OPEN |
| ROADMAP-E24-04 | 513 | - [ ] Open Graph | F.9-01 | SEO-003; WEB-006/032 | KEEP — Open Graph image/metadata preview and safe public output tested; acceptance evidence OPEN |
| ROADMAP-E24-05 | 514 | - [ ] Twitter metadata | F.9-01 | SEO-003; WEB-006 | KEEP — Twitter/X card metadata is separately validated in share preview; acceptance evidence OPEN |
| ROADMAP-E24-06 | 515 | - [ ] structured data | F.9-01 | SEO-003; WEB-032 | KEEP — structured data is schema-valid, safe and reflects published content only; acceptance evidence OPEN |
| ROADMAP-E24-07 | 516 | - [ ] sitemap | F.9-01 | SEO-004; WEB-012/030 | KEEP — sitemap includes only canonical published URLs and refreshes after publish/unpublish; acceptance evidence OPEN |
| ROADMAP-E24-08 | 517 | - [ ] robots | F.9-01 | SEO-004; WEB-012/030 | KEEP — robots rules cannot accidentally index drafts/private routes; acceptance evidence OPEN |
| ROADMAP-E24-09 | 518 | - [ ] per-page SEO | F.9-01 | SEO-001–005; WEB-005/006 | KEEP — per-page SEO metadata is editable and validated in preview/publish workflow; acceptance evidence OPEN |

**Semantic findings:**
- Dynamic bindings are declarative, typed and permission/site scoped. The Page Model stores binding/display configuration only; domain records remain owned by their canonical services. No arbitrary SQL, unrestricted fetch or unrestricted JS binding.
- Provider links, approved embeds and API-backed integrations are separate. Every API-backed source needs official capability/scope, normalized DTO, quota/failure/freshness policy and honest fallback.
- Interaction events route through EDT-039; animation/reduced-motion through EDT-040. A visible trigger is not proof of a safe or accessible action.
- Accessibility is an independent acceptance gate; Inspector warnings do not replace keyboard/browser/screen-reader/contrast testing.
- SEO metadata is page/locale-scoped and must reflect published content only. Sitemap/robots, Open Graph/Twitter cards, structured data, canonical redirects and preview/publish validation are separate requirements.

**Coverage count:** 51 E20–E24 source items are individually keyed. The archived roadmap's A1–A? Admin, remaining platform domains, AI/automation, testing gates and global 0/Foundation/Data Model/Core rules remain OPEN. P0.2 **IN PROGRESS / NOT PASS**; documentation-only, no runtime code/data changed and no tests run.

