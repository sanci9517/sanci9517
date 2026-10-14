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
- **Új chatnek szánt rövid folytatási szöveg:** „A `docs/MASTER-DEVELOPMENT-PLAN.md` az egyetlen irányadó terv. Olvasd el a 0.0, 0.2, 37.3, 37.9–37.32 és 41. fejezetet. Az aktív pont P0.2; folytasd a C.23 és F.1–F.13 belső felsorolásainak, a korábbi 00/A és 00.9–00.9.6.B forrásoknak, majd mind a 362 jelenlegi registry-ID kétirányú reconciliációját. Ne állíts PASS-t bizonyíték nélkül, ne indíts párhuzamos feature-fejlesztést, és a végső funkciólista közös ellenőrzését még ne kérd.”

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
- EDT-043: Advanced Rich Text editor and structured inline/block content; planned after the 1.0 plain-text baseline, gated by schema, safe renderer, accessibility and round-trip tests.
- EDT-044: Per-user Editor workspace preferences (viewport, panel layout, grid and favorites) stored outside the site Page Model.

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
- RES-004: Image preview/thumbnail/variant, crop/resize and optimization pipeline.
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
- SCH-002: Calendar/list/upcoming/past views with site-scoped search/filter/sort/pagination.
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
- QA-004: Browser/device responsive and visual-regression acceptance.
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
- SET-004: Custom domain lifecycle, verification, DNS/SSL status, primary-domain transition and canonical URL.

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
- **P0.2:** IN PROGRESS — **AKTÍV**. A 271 H19–H34 történeti kulcs MAPPED DRAFT crosswalkja (§40–§41) megvan. Az E.1 15 termékfelülete előzetes, explicit traceability-mappinget kapott (§41.3.13), a C.23 + F.1–F.13 310 forrásbulletjének szövegmegőrzése ellenőrzött (§41.3.15). A §37.22–§37.30 crosswalk 2026-10-14-i friss strukturális ellenőrzése a jelenlegi 362 egyedi registry-ID mindegyikét feloldotta (362/362; §37.32, §41.3.75); a korábbi 361/361 eredmény és a 362-ID-s ellenőrzésről szóló régebbi „még hátravan” megfogalmazás történeti állapot, nem aktuális nyitott feladat. Ettől külön nyitott marad a 271 történeti sor szemantikai reconciliációja, az E.1/C.23/C.24 és a 310 forrásbullet teljes eredetleképezése, a jelenlegi registry-ID-k kétirányú eredetbesorolása, az ID-nkénti permission/dependency/acceptance contractok, valamint az eredeti 00/A és 00.9–00.9.6.B források visszakeresése. A Game Profile fázisellentmondás célzottan javítva (§41.3.73), runtime acceptance nélkül. P0.2 továbbra sem PASS.
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
- **Történeti snapshot (2026-10-13):** 359 stabil feature ID volt a registryben; a H19–H34 crosswalkban hivatkozott ID-k feloldhatók voltak. Ez a darabszám nem a jelenlegi registry állapota.
- A jelenlegi feature-ID prefix és a megadott canonical domain owner egyezik; a vegyes ownerű sorok explicit több-ID hozzárendelést használnak.
- A kilenc több-ID hozzárendelés külön felülvizsgálva: architektúra+secret boundary; reduced-motion/QA; interaction validation/QA; performance/ops; content management/Page Model; integrations/Connections Center; permissions/security; AI Editor action pipeline; collaboration/conflict. A több-ID sor nem helyettesíti a kapcsolódó feature ID-k külön DoD-ját.
- A korábbi általános phase-dependent célfázisok megszüntetve: a VOD-admin capability 1.5–2.0, az analytics reporting 2.0 célfázist kapott; a crosswalkban már nincs phase-dependent célfázis.
- A történeti eljárási checklist H34 soraiban az „all phases” a folyamatos governance-kötelezettséget jelenti, nem azt, hogy az összes termékfunkció minden fázisban implementálandó.
- A H27 Admin-capability soroknál a jelenlegi menüben látható placeholder nem runtime feature: a crosswalk csak a canonical owner/funkcióazonosítóhoz rendeli, és külön jelzi a későbbi fázist.

**Továbbra is nyitott:** a sorok eredeti történeti forrásával való emberi, tartalmi összevetés; minden cél-ID feature contractjának (permission, data owner, dependency, negative tests, acceptance evidence) kitöltése; a teljes történeti↔aktuális provenance. A 359-es registry-szám a 2026-10-13-i review snapshotja; a jelenlegi registry 362 egyedi ID-jának strukturális crosswalk-lefedettségét a §37.32 és §41.3.75 később 362/362-re igazolta. Ez a későbbi strukturális PASS sem zárja le a szemantikai review-t vagy P0.2-t.


### 37.17. P0.2 — Történeti és új funkciók közti lefedettségi különbség

A §24 registry és a §41 crosswalk újraszámolt kapcsolata:

- **Történeti snapshot (2026-10-13):** §24: 359 egyedi stabil feature ID (az akkori registry-állapot szerint). A jelenlegi registry 362 egyedi ID-t tartalmaz; lásd §37.32 és §41.3.75.
- §41: 271 egyedi történeti követelménykulcs.
- A történeti crosswalk 128 különböző aktuális feature ID-t hivatkozik közvetlenül; minden ilyen ID feloldható a registryben, és a crosswalkban használt QA-ID-k is feloldhatók.
- **Történeti snapshot (2026-10-13):** a H19–H34 crosswalk akkor 128 különböző feature ID-t kötött közvetlenül történeti kulcshoz. Ez az akkori 359-ID-s állapotból számolt különbség, nem jelenlegi registry-számlálás. A teljes, összes archive source-ra kiterjedő eredetbesoroláshoz minden jelenlegi ID-nél rögzíteni kell: NEW PRODUCT REQUIREMENT, EXPANDED ACCEPTANCE, CROSS-CUTTING CONTROL, PLATFORM/OPERATIONS vagy HISTORICAL MAPPING GAP. Az ID strukturális hivatkozása önmagában nem bizonyít történeti eredetet.
- A P0.2 zárás előtt a **jelenlegi 362 registry-ID mindegyikéhez** ki kell tölteni és ellenőrizni a provenance mezőket: historical key(s), new requirement source, domain owner, target phase, dependency IDs, acceptance/test IDs és státusz. Ha egy ID új, a forrás a MASTER döntési naplójában szerepeljen; ha történeti, a H-key legyen visszakövethető. Az üres provenance nem törlési ok, hanem nyitott auditfeladat.

**Aktuális döntés:** a 271 H19–H34 kulcs és a jelenlegi 362 registry-ID közötti teljes történeti↔aktuális feature coverage továbbra sem PASS, amíg az összes ID provenance-e és a tételenkénti feature contract nincs teljesen dokumentálva. A 362/362 strukturális crosswalk-ellenőrzés csak ID-feloldást igazol.


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
| E.3.1-05 | Resizable/collapsible panels and no clipped small-screen workspace | ADM-010, EDT-035, EDT-036, EDT-044, QA-005 | EXPAND | 1.0 desktop/mobile baseline; per-user panel preferences must stay outside Page Model; tablet acceptance explicitly required | QA-004/005 |
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
| E.3.6-01 | Base elements and plain text; Rich Text editor explicitly later | EDT-017–EDT-019, EDT-043 | EXPAND | 1.0 base elements; advanced Rich Text later | QA-002/004 |
| E.3.6-02 | Table/Accordion/Tabs typed fields, validation, keyboard/responsive/public renderer | EDT-019, WEB-032, QA-005 | EXPAND | 1.0 only if full acceptance passes; otherwise defer individual blocks | QA-002/004/005 |
| E.3.6-03 | Section/Box/Stack/Row/Columns/Grid/reusable Slot | EDT-016, DSN-013 | EXPAND | 1.0 layout primitives; reusable slot phased | QA-002/004 |
| E.3.6-04 | Live/Twitch/Next Stream/Schedule/VOD/Clips/Social/Community/Support/Store dynamic blocks | EDT-020, LIV-001–LIV-007, SCH-001–SCH-015, CNT-002–CNT-020, COM-001–COM-018, SUP-001–SUP-012, STO-001–STO-020, DYN-001–DYN-008 | EXPAND | 1.0 Twitch/Schedule/social baseline; later domains only in their phases | QA-002/003/004 |
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
| E.20-07 | Integration/dependencies/scopes/rate limits/timeouts/provider downtime, including dependency/license/CVE review | INT-001–INT-009, OPS-010/011 | KEEP | Every provider-dependent phase; dependency/license/CVE review before adding or upgrading packages | QA-003/006/008 |
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
| F.1-01 | Editor full user flow: select/create page, add/select element, Inspector/canvas edit, undo/redo, save draft, preview, explicit publish | EDT-001, EDT-003, EDT-015–EDT-017, EDT-005, EDT-027–EDT-034, WEB-004–WEB-008 | KEEP | 1.0 | QA-002/004 |
| F.1-02 | Reload/reopen preserves selection/editability; saved elements are not delete-only | EDT-002, EDT-003, EDT-013, EDT-027–EDT-030, WEB-004 | KEEP | 1.0 release gate | QA-002/004 |
| F.1-03 | Regression sequence: Box + heading/text/button/divider; Layers reselects earlier nodes; layout edit/save/reload/public render parity | EDT-003, EDT-004, EDT-013, EDT-015–EDT-017, EDT-022, EDT-027–EDT-034, WEB-004–WEB-006 | KEEP | 1.0 release gate | QA-002/004 |
| F.1-04 | Immutable history, maximum 50 entries, FIFO overflow | EDT-004, EDT-005 | KEEP | 1.0 | QA-002 |
| F.1-05 | One user intent per transaction; text debounce/blur groups edits; drag/slider groups pointer-down to pointer-up | EDT-004, EDT-005, EDT-008/009, EDT-022 | KEEP | 1.0 | QA-002/004 |
| F.1-06 | Preset/batch explicit transaction boundaries; no partial or self-referential undo/redo entries | EDT-003–EDT-005, DSN-004 | KEEP | 1.0 | QA-002 |
| F.1-07 | Canvas, Layers, Inspector and persisted model share canonical command/state, not DOM snapshots | EDT-001–EDT-006, EDT-013, EDT-027–EDT-030 | KEEP | 1.0 release gate | QA-002/004 |
| F.1-08 | Debounced 2000 ms draft autosave; explicit Save Draft remains immediate; only validated Page Model persists | EDT-001, EDT-022, EDT-027, EDT-028, WEB-004 | KEEP | 1.0 | QA-002/004 |
| F.1-09 | Local crash recovery is separate from server draft and stores no secrets; conflict offers recovery/server/discard choices | EDT-029, EDT-031, WEB-007/008, OPS-009, SEC-008 | EXPAND | 1.0 recovery baseline | QA-003/006/007 |
| F.1-10 | Optimistic concurrency, unsaved-change warning, real retry/restore; larger Page Model history/autosave performance tests | EDT-004, EDT-005, EDT-027–EDT-034, WEB-008, OPS-008 | KEEP | 1.0 release gate | QA-002/004/005/006 |
| F.2-01 | Canonical dynamic data pipeline: domain service → declared source → schema-valid binding → allowed transform → conditional render | DYN-001–DYN-008, EDT-020, WEB-031, SEC-002 | KEEP | 2.0, with 1.0 safe core only | QA-002/003/004 |
| F.2-02 | Provider sources enabled only by phase, official capability and connection scope | DYN-001, DYN-007, INT-001, INT-005/006, INT-013–INT-016, SEC-002/003 | KEEP | Per-provider 1.5+ | QA-002/003/008 |
| F.2-03 | Query/filter/sort/limit saved only against declared schema; prohibit arbitrary SQL, arbitrary fetch and unrestricted JS | DYN-002–DYN-004, SEC-002, SEC-005–SEC-007 | KEEP | 2.0 | QA-002/003 |
| F.2-04 | Separate loading/empty/error/stale/partial-provider-failure states; redact internals and secrets | DYN-005, DYN-006, OPS-003, SEC-008 | KEEP | 1.0 baseline; full binding UI 2.0 | QA-003/004/006 |
| F.2-05 | Conditional visibility never bypasses authorization; cache invalidates on publish/schedule/sync | DYN-004, DYN-006, DYN-007, WEB-030, OPS-008, SEC-002 | KEEP | 1.0–2.0 | QA-002/003/006 |
| F.2-06 | Editor stores display configuration only; a Schedule block cannot mutate Schedule domain rows | EDT-020, SCH-001–SCH-015, DYN-001, DYN-007, SEC-002 | KEEP | 1.0 | QA-002/003/004 |
| F.3-01 | No-code Inspector choices for alignment, text alignment, stack/columns/grid and vertical alignment | EDT-009–EDT-016, EDT-021, EDT-022 | EXPAND | 1.0 core; advanced layout phased | QA-002/004 |
| F.3-02 | Width/height/units, independent horizontal/vertical spacing, gap/padding/margin and per-side values | EDT-009–EDT-016, EDT-021, EDT-022, DSN-001/004 | EXPAND | 1.0 | QA-002/004/005 |
| F.3-03 | Min/max, aspect ratio, overflow, wrap, order and responsive overrides validated against layout mode | EDT-009, EDT-016, EDT-021–EDT-026 | KEEP | 1.0 core; advanced responsive later | QA-002/004/005 |
| F.3-04 | Canvas and Layers selection target same canonical node; drag/resize does not unexpectedly convert flex/grid to absolute positioning | EDT-003, EDT-004, EDT-009–EDT-016 | KEEP | 1.0 release gate | QA-002/004 |
| F.3-05 | Plain Text is 1.0 baseline; no parallel rich-text path delaying core editor closure | EDT-001–EDT-003, EDT-017, EDT-022, EDT-043 | KEEP | 1.0 plain text; EDT-043 rich text separately scoped and non-blocking | QA-002/004 |
| F.4-01 | Explicit public page types: Creator Home, Stream, Schedule, VOD/Video Hub, Clips/Shorts, About, Community, Contact, Support, Link Hub and Press Kit | WEB-014–WEB-024, CNT-001–CNT-005 | EXPAND | 1.0 core pages; later pages phased | QA-002/004/008 |

**Felhasználói felület szétválasztási szabály:** az F.4-01 **oldaltípus-leltár**, nem egyetlen „mindent tudó” publikus oldal vagy mega-funkció. A külön oldaltípusoknak saját WEB capability-je, route-ja, tartalommodellje, üres/hiba állapota és acceptance-e marad (pl. Home `WEB-014`, Stream `WEB-015`, Schedule `WEB-016`, Content Hub `WEB-017`, About `WEB-018`, Community `WEB-019`, Contact `WEB-020`, Resources `WEB-021`, Link Hub `WEB-022`, Support `WEB-023`, Press Kit `WEB-024`). Csak közös, valóban ismétlődő viselkedés kerülhet shared component/contract alá; a közös keret nem moshatja össze az oldalak külön szerkesztési, jogosultsági, adat- és publish-életciklusát.

| F.4-02 | Creator Home uses authenticated provider data only, upcoming stream, content, social/community/support and phased merch/email/campaign | WEB-014–WEB-019, WEB-022–WEB-024, LIV-001–LIV-004, SCH-009, CNT-001–CNT-005, INT-001, COM-001, SUP-001 | EXPAND | 1.0 core; later capabilities phased | QA-002/003/004 |
| F.4-03 | Stream page: player/embed, real status/title/category/start, next stream and safe optional embeds | WEB-015, WEB-032, LIV-001–LIV-005, SCH-009, SEC-005 | EXPAND | 1.0 Twitch baseline | QA-002/003/004 |
| F.4-04 | VOD/content hub supports categories/tags/search/filter/playlists/related content and honest manual fallback when API unavailable | WEB-017, CNT-001–CNT-008, CNT-020, INT-012–INT-014 | EXPAND | 1.5–2.0 | QA-002/003/004 |
| F.4-05 | About, Link Hub and press-kit content are configurable; no hardcoded creator-specific product behavior | WEB-018, WEB-022, WEB-024, CAM-004, DSN-001, LOC-001 | EXPAND | 1.0 basic profile/link; advanced kit later | QA-002/004 |
| F.4-06 | Basic interaction behavior: click/hover/focus/active/submit/scroll/load/timer/open-close/navigation/show-hide/toggle | EDT-039, WEB-011; cross-cutting accessibility contract TBD in M0.2 | KEEP | 1.0 baseline; interaction behavior and accessibility acceptance are separate contracts | QA-002/004/005 |
| F.4-07 | Advanced state machines/timeline/keyframes remain separately scoped; reduced motion, keyboard/focus, valid actions and performance are required | EDT-039, EDT-040, WEB-011, OPS-008; action security and accessibility acceptance remain separate cross-cutting contracts | EXPAND | 1.0 reduced-motion baseline; advanced motion 2.0 | QA-004/005/008 |

**Batch 5 result:** 28 source requirements mapped for F.1–F.4. Structural checks must confirm each referenced ID exists in §24; source-bullet completeness and runtime behavior remain separate gates.



### 37.29. P0.2 — Bullet-szintű crosswalk, batch 6: F.5–F.8 (Content, Schedule, Admin, Analytics, Automation, AI)

**Forrás:** archived MASTER snapshot, 00.9.6.F.5–F.8. Mind a 26 forrásbullet külön kulcsot kap; a provider-, pénzügyi és AI-műveletek csak a saját capability/security gate után aktiválhatók.

| Forráskulcs | Megőrzött követelmény | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| F.5-01 | Content Manager ideas/drafts/scripts/title/description/tags/thumbnail/platform/date/campaign/approval | CNT-009–CNT-016, CAM-001 | EXPAND | 1.5–2.0 | QA-002/004 |
| F.5-02 | VOD ingestion/category, clips/Shorts, calendar, platform metadata variants, publish queue/external IDs/dedupe | CNT-001–CNT-007, CNT-009–CNT-017 | DEFER/EXPAND | 1.5–2.0 | QA-002/003/006 |
| F.5-03 | Twitch OAuth/live/channel/game/permitted metrics/VOD/clips/events/sync diagnostics | INT-001, INT-003–INT-012, INT-017–INT-020, LIV-001–LIV-007, CNT-002–CNT-004 | KEEP/EXPAND | 1.0 core; advanced content later | QA-002/003/006 |
| F.5-04 | YouTube channel/video/Shorts/available analytics/quota/scope/fallback | INT-001, INT-006, INT-008/009, INT-013, INT-018, INT-020, ANL-004, CNT-002/003 | DEFER | 1.5+ provider-gated | QA-002/003/008 |
| F.5-05 | TikTok account-capability-gated profile/content with rate-limit/manual fallback | INT-006, INT-008/009, INT-014, INT-018, INT-020, CNT-002/003 | DEFER | 1.5+ provider-gated | QA-002/003/008 |
| F.5-06 | Discord link baseline; bot/role/status and Kick/OBS/email/payment/commerce adapters have own contracts | INT-015/016, INT-018, INT-021, COM-001, OBS-001–OBS-010, STO-001–STO-020 | DEFER/EXPAND | 1.0 links; integrations later | QA-002/003/008 |
| F.5-07 | Normalize provider data; outage fallback; never invent missing metrics | INT-001, INT-018, INT-020, LIV-002, DYN-005, ANL-008 | KEEP | 0.x–1.0 baseline | QA-002/003/006 |
| F.6-01 | Canonical Schedule fields, lifecycle, recurrence, source and external-ID mapping | SCH-001–SCH-015, RES-001, RES-007 | EXPAND | 1.0 core; advanced recurrence phased | QA-002/004 |
| F.6-02 | Schedule list/calendar/upcoming/past/search/filter/sort and lifecycle states | SCH-001, SCH-002, SCH-005, SCH-010 | EXPAND | 1.0 baseline | QA-002/004 |
| F.6-03 | DST/timezone and recurrence edits scoped to one event/future events/series where supported | SCH-003, SCH-004 | EXPAND | 1.0 timezone; recurrence 1.5–2.0 if not accepted | QA-002/004 |
| F.6-04 | Next stream/countdown uses canonical schedule/site timezone/authenticated live state and excludes cancelled/past events | SCH-009, SCH-003, SCH-005, LIV-001, WEB-016 | KEEP | 1.0 | QA-002/004 |
| F.6-05 | Link VOD/clip/Short to stream and calendar; Editor Schedule block changes presentation only | SCH-014, CNT-002–CNT-004, EDT-020, SCH-011 | EXPAND | 1.0 Schedule; richer content later | QA-002/003/004 |
| F.7-01 | Admin shell navigation/breadcrumb/public return/profile/session/logout/help/notifications/mobile shell | ADM-001–ADM-010, SEC-001, WEB-011 | EXPAND | 1.0 | QA-003/004/005 |
| F.7-02 | Shared loading/empty/error/success/disabled/unsaved states, validation/confirm/search/filter/pagination/keyboard/Hungarian UI | ADM-001, ADM-006–ADM-010, EDT-027, LOC-001, OPS-003, WEB-011 | EXPAND | 1.0 | QA-004/005/006 |
| F.7-03 | Session expiry/logout/inactivity/multi-tab/unsaved flow and server-side admin/API authorization | SEC-001, SEC-002, SEC-004, ADM-007, EDT-031 | KEEP | 0.x–1.0 | QA-003/004 |
| F.7-04 | Public forms: schema/required labels/client+server validation/spam rate limit/success/error/privacy notice | WEB-020, SEC-005, SEC-007, SEC-011 | EXPAND | 1.0 if form enabled | QA-003/004/006 |
| F.7-05 | Store CRUD/variants/SKU/pricing/stock/order/payment/fulfillment/refund/provider errors | STO-001–STO-020, WEB-025 | DEFER | 5.0 | QA-002/003/008 |
| F.7-06 | Merch/digital/bundle/preorder/limited drop/coupon/gift card/invoice/shipping/tax | STO-005–STO-020, CAM-009, SUP-004–SUP-006 | DEFER | 5.0 after legal/payment review | QA-002/003/008 |
| F.8-01 | Consent-aware web/content/stream/commerce/community analytics only from real sources | ANL-001–ANL-006, ANL-009, SEC-011 | DEFER/EXPAND | 2.0+ by source | QA-003/008 |
| F.8-02 | Metrics source/period/freshness/missing values/API limits/retention/export/role; anomaly detection later | ANL-007–ANL-010, SEC-002 | EXPAND | 2.0+ | QA-002/003/008 |
| F.8-03 | Automation event/schedule→trigger→condition→action→result→verify→audit with retry/idempotency/rate/dead-letter/version/site rules | AUT-001–AUT-014, SEC-003, SEC-010 | DEFER | 7.0 | QA-002/003/006/008 |
| F.8-04 | AI website edits use canonical Page Model/action pipeline, permission/schema validation, preview/diff/approval/verify/audit; no arbitrary DB/HTML | AI-003, AI-005–AI-009, AI-019, EDT-003, SEC-002 | DEFER | 3.0 safety gate | QA-002/003/008 |
| F.8-05 | AI orchestrator/agent/tool/model registry, task planner/context selector, permission/approval, specialist agents and multi-model routing | AI-001–AI-009, AI-016–AI-019 | DEFER | 3.0–8.0 | QA-002/003/008 |
| F.8-06 | AI costs/quotas/approval/prompt versions/usage/errors/recovery/rollback; provider keys server-side | AI-001, AI-002, AI-007, AI-009, AI-010, AI-017, SEC-008 | DEFER | 3.0 | QA-003/008 |
| F.8-07 | Stream Intelligence for live/silence/speech/chat/audio/OBS/highlights/VOD/clips/feedback/opt-in memory | AI-004, AI-014–AI-016, ANL-003, ANL-006, OBS-003, LIV-006, SEC-011 | DEFER | 3.0–8.0 | QA-003/006/008 |
| F.8-08 | Human-reviewed clip/export, stream setup assistant, AI Control Center, experience evaluation and E2E tests | AI-014, AI-015, AI-017–AI-020, OPS-007 | DEFER | 3.0–8.0 | QA-002/003/008 |

**Batch 6 result:** all 26 F.5–F.8 source bullets are individually represented. This does not establish provider approval, runtime capability, or acceptance PASS.
### 37.30. P0.2 — Bullet-szintű crosswalk, batch 7: F.9–F.13 (quality gates, recovery, context, Game Profile, domains)

**Forrás:** archived MASTER snapshot, 00.9.6.F.9–F.13. A személyes/projektindulási kontextus konfigurációként marad meg; a custom domain, email audience és workspace/team későbbi, külön security/legal acceptance-t igénylő scope. A korábbi F.10–F.13 sorok külön detail mappingjét ebbe az egyetlen táblába vontam össze, hogy ne maradjon két párhuzamos crosswalk.

| Forráskulcs | Megőrzött követelmény | Canonical current ID | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|
| F.9-01 | Published-page SEO metadata, canonical, Open Graph/social cards, sitemap/robots/schema; drafts and preview non-indexable | SEO-001–SEO-005, WEB-005, WEB-006, WEB-031 | KEEP/EXPAND | 1.0 release gate | QA-004/008 |
| F.9-02 | Redirect/broken-link tooling only with preview and approval | SEO-005, WEB-013, SEC-002; redirect lifecycle and broken-link detection remain distinct actions | DEFER | 2.0+ | QA-003/008 |
| F.9-03 | Semantic HTML, heading hierarchy, alt, labels, ARIA, keyboard/focus, contrast, screen reader, reduced motion | EDT-017, EDT-037, EDT-040, RES-007, WEB-011; cross-cutting accessibility contract TBD in M0.2 | KEEP | 1.0 release gate | QA-004/005 |
| F.9-04 | Secure session/cookies/password/auth rate limit/RBAC/CSRF/OAuth state/webhook replay/upload validation | SEC-001–SEC-010, RES-003, INT-003, INT-017 | KEEP | 0.x–1.0 release gate | QA-003 |
| F.9-05 | Separate public/preview/admin permission boundaries; no draft or secret leakage in logs/export | SEC-002, SEC-008, WEB-005, WEB-006, WEB-031, OPS-002, OPS-005 | KEEP | 0.x–1.0 | QA-003/004 |
| F.9-06 | Performance budgets based on measured baseline; image variants/lazy load/cache invalidation/Core Web Vitals/large-tree tests | OPS-008, WEB-030, RES-004 | EXPAND | 1.0 baseline; advanced optimization phased | QA-005/006 |
| F.9-07 | Visual regression for public home/navigation/schedule, Editor state and desktop/tablet/mobile | WEB-009, WEB-011, WEB-014, WEB-016, EDT-035–EDT-037 | KEEP | 1.0 release gate | QA-004/005 |
| F.10-01 | Versioned export of Page/revision/theme/template/component/media refs/domain data; never export secrets/tokens | OPS-005, WEB-008, DSN-014/015, RES-001/008, SET-003, SEC-008 | EXPAND | 1.0 safe export foundation; full package later | QA-003/007 |
| F.10-02 | Import dry-run validates schema/version/assets/duplicate IDs/owner/permissions/migration compatibility | OPS-004/005, WEB-008, DSN-014/015, RES-008/009, SEC-002/003/008; generic package-import contract TBD in M0.2 | EXPAND | 2.0 full import/export | QA-002/003/007 |
| F.10-03 | Recovery preview/conflicts/integrity/backup verification and post-restore Page Model/revision/public-render consistency | OPS-005/006/009, EDT-001, EDT-028, EDT-034, WEB-004, WEB-007/008 | KEEP | 0.x–1.0 safety baseline | QA-002/006/007 |
| F.10-04 | Diagnostics for deploy/request/sync/provider/jobs/D1/cache/latency; no secrets or unnecessary personal data in logs | OPS-001–OPS-008, SEC-008, SEC-010/011 | EXPAND | 1.0 baseline; advanced operations later | QA-003/006/008 |
| F.11-01 | 1.0 scope: own public site/Admin/working Editor slice/responsive/resource/Schedule/Twitch/publish/SEO/accessibility/security/performance | §39.2, WEB-001–WEB-032, ADM-001–ADM-010, EDT-001–EDT-042, RES-001–RES-016, SCH-001–SCH-015, INT-001–INT-021, SEO-001–SEO-005 | KEEP | 1.0 selected subset only; §39 per-domain gates override family ranges | QA-002–QA-009 |
| F.11-02 | 1.x: Link Hub/Content Hub/multi-platform/VOD/Shorts/calendar/commerce foundations/community/alerts/audience capture | WEB-022, CNT-001–CNT-020, INT-013–INT-021, STO-001–STO-020, SUP-001–SUP-012, COM-001–COM-018, ANL-001–ANL-004 | MERGE | 1.5–2.0 by domain | QA-002/003/008 |
| F.11-03 | 2.x Creator OS: dashboard/analytics/content studio/email audience/sponsorship/OBS/advanced stream tools | ADM-001–ADM-010, ANL-001–ANL-010, CNT-001–CNT-020, COM-015–COM-017, CAM-001–CAM-009, OBS-001–OBS-010 | MERGE | 2.0+ | QA-002/003/008 |
| F.11-04 | 3.x+: AI assistant/stream intelligence/business platform/marketplace/multi-site/SaaS/global ecosystem | AI-001–AI-020, MKT-001–MKT-005, TEAM-001–TEAM-006, LOC-001–LOC-006, §39.5–39.12 | MERGE | 3.0–10.0 | QA-002/003/008 |
| F.12-01 | Hungarian-first launch, international-ready locale/date/time/UI-string model | LOC-001–LOC-006, SET-001, WEB-001 | EXPAND | 1.0 architecture-ready; full locale workflow later | QA-004/005 |
| F.12-02 | Gaming streamer profile and games configurable from Admin, not hardcoded into product logic | SCH-012–SCH-014, WEB-018, RES-001/007, SET-001 | EXPAND | 1.0 configurable creator profile and minimum Game Profile CRUD; extended profile metadata/provider mapping 1.5–2.0 | QA-002/004 |
| F.12-03 | TikTok handle and 5,000-follower personal goal are editable profile data, not UI guarantee | INT-014, SET-001, WEB-018, ANL-004 | KEEP | Profile config 1.0; provider metrics gated | QA-002/003/004 |
| F.12-04 | Weekly stream cadence is editable Schedule data, not a hardcoded product rule | SCH-001–SCH-003, SCH-009 | KEEP | 1.0 | QA-002/004 |
| F.12-05 | Historical support goal/platforms are not active payment integration; recheck current target/platform/privacy/legal text before campaign | SUP-001, SUP-002, WEB-023, COM-014, SEC-011 | KEEP | 1.0 external links only if confirmed; payments later | QA-003/004/008 |
| F.12-06 | Project brand/profile/goal data remains configurable and changeable | SET-001–SET-003, WEB-001, SCH-001, INT-001 | KEEP | 1.0 | QA-002/004 |
| F.13-01 | Game Profile stable ID/slug/name/provider mapping/resource refs/brand metadata/cover/status/description | SCH-012–SCH-014, RES-001/007, SET-001 | EXPAND | 1.0 minimum stable-ID profile CRUD, slug/name and Schedule reference; extended provider mapping/brand metadata/lifecycle fields 1.5–2.0 | QA-002/004 |
| F.13-02 | Schedule references Game Profile by stable ID, not copied fields or name matching | SCH-001, SCH-012, SCH-014 | KEEP | 1.0 stable-ID reference and no copied game data; advanced Game Profile workflows 1.5–2.0 | QA-002/003 |
| F.13-03 | Missing artwork/metadata must use explicit fallback; Inspector shows only valid fields | SCH-013, RES-001/004/007/015, DYN-005, EDT-022 | EXPAND | 1.5–2.0 | QA-002/004/006 |
| F.13-04 | Game Profile is a domain; Editor references it and must not create an editor-only data store | SCH-012–SCH-014, EDT-020, DYN-001 | KEEP | 1.0 domain-ownership invariant and minimum reference contract; advanced profile management 1.5–2.0 | QA-002/003 |
| F.13-05 | Custom domain lifecycle: add/verify ownership/DNS/primary/SSL/canonical URL/redirect/error states | SET-002/004, WEB-012/013, SEO-001, SEO-005, OPS-001, SEC-006 | DEFER | 4.0+ | QA-003/004/008 |
| F.13-06 | Domain/primary change preview and explicit SEO/redirect warning; unverified domain cannot become primary | SET-002/004, WEB-012/013, SEO-001, SEO-005, SEC-006 | KEEP | 4.0+ safety gate | QA-003/004 |
| F.13-07 | Brand settings: creator name/logo/favicon/social registry/colors/fonts/tokens/avatar/cover/media refs are data, not renderer hardcode | SET-001/003, DSN-001, RES-001/004/007, RES-011–RES-013, WEB-010 | EXPAND | 1.0 baseline | QA-002/004 |
| F.13-08 | Link Hub: platform/social links/CTA ordering/visibility and Schedule/Content/Community/Support targets, mobile-friendly | WEB-009, WEB-011, WEB-016, WEB-019, WEB-022/023, CNT-020, COM-001, SUP-001 | EXPAND | 1.0 basic profile/links; richer hub later | QA-002/004/005 |
| F.13-09 | Later link scheduling/campaign UTM/QR/smart redirect/click analytics with privacy controls | CAM-002, ANL-001/002, WEB-013, SEC-011 | DEFER | 1.5–2.0 | QA-003/008 |
| F.13-10 | External URLs validated; dangerous schemes blocked; public menu/CTA behavior consistent | WEB-009, WEB-013, WEB-032, SEC-006 | KEEP | 1.0 | QA-003/004 |
| F.13-11 | Signup/subscribe collects email only with clear purpose/consent; records time/purpose version/unsubscribe | COM-015, COM-017, SEC-011 | DEFER | 2.0+ | QA-003/008 |
| F.13-12 | Subscriber list/segments/campaign/newsletter/transactional email/templates/opt-out/bounce/rate/consent history | COM-015–COM-018, CAM-002, SEC-011, INT-021 | DEFER | 2.0+ | QA-003/008 |
| F.13-13 | Marketing vs transactional email separated; unsubscribe blocks future marketing; privacy export/delete/retention | COM-016, COM-017, SEC-011, OPS-005 | KEEP | 2.0+ privacy gate | QA-003/008 |
| F.13-14 | Later tenant→workspace/account→members→sites→domain modules | TEAM-001–TEAM-006, SEC-003 | DEFER | 4.0+ | QA-003/008 |
| F.13-15 | Role catalog for owner/admin/editor/designer/moderator/analyst/content/store/finance; every mutation checks server-side permission | TEAM-003, SEC-002, SEC-003 | KEEP | RBAC baseline 1.0; team roles 4.0+ | QA-003/008 |
| F.13-16 | Workspace/site scope separated; client-provided tenant/site ID is not authorization | TEAM-005, SEC-002, SEC-003 | KEEP | 0.x–1.0 baseline; expand before multi-site | QA-003 |
| F.13-17 | Free/Creator/Pro/Business/Team/Agency and billing/quota/invoice/change/cancel only after cost/usage evidence | TEAM-006, STO-019, CAM-009, OPS-008 | DEFER | 4.0–5.0 | QA-003/008 |
| F.13-18 | Public website responsive from 1.0; PWA/native app is a later option | WEB-011, WEB-014–WEB-032, ADM-010, EDT-025 | KEEP/DEFER | Responsive web 1.0; PWA later | QA-004/005 |
| F.13-19 | Later creator app uses canonical APIs/permissions for live/alerts/schedule/analytics/moderation/content approval | ADM-001–ADM-010, INT-001–INT-021, SCH-001–SCH-015, LIV-001–LIV-007, CNT-015, ANL-001–ANL-010, OBS-006, COM-001–COM-018, SEC-002 | DEFER | 2.0+ | QA-002/003/008 |
| F.13-20 | Starter template categories remain available as configurable library choices | DSN-008–DSN-010 | EXPAND | 1.0 starter templates; library later | QA-004 |
| F.13-21 | Future creator-made template/component/theme/overlay/OBS/digital asset marketplace with license/version/review/revenue share | DSN-005, DSN-011–DSN-018, RES-001, OBS-001–OBS-010, STO-012, MKT-001–MKT-005 | DEFER | 3.0–6.0 | QA-002/003/008 |

**További F.9/F.10 szemantikai ellenőrzés:**
- Az F.9-07 vizuális regressziós baseline-t ír elő public home/navigation/Schedule és Editor állapotokhoz, desktop/tablet/mobile méreteken. A meglévő `QA-004` leírás korábban csak browser/device responsive acceptance-et mondott ki; pontosítottam úgy, hogy a visual-regression acceptance is kifejezett része legyen.
- Az F.10-02 teljes package import dry-run követelményét nem szabad úgy értelmezni, hogy a `OPS-005` export/restore vagy a `DSN-015` template import/export önmagában lefedi a teljes Page Model/revision/resource/domain package importot. A sor most explicit nyitott generic package-import contractot jelöl. M0.2-ben kell kijelölni a canonical owner/ID-t, az import validation és permission/owner checks határát, a dry-run outputot és a rollback/partial-failure acceptance-t. Addig a teljes import-dry-run szemantikai lefedettsége OPEN.


**Szemantikai ID-ellenőrzés — accessibility cross-cutting capability nyitott:** a korábbi F.9-03 sor a `WEB-032` ID-t használta, amelynek registry-definíciója **public content rendering security and safe embeds**, nem általános accessibility. Ez hibás szemantikai hozzárendelés volt, ezért kivettem a mappingből. A sor most a ténylegesen releváns rész-képességekre mutat (`EDT-017` alap-elemek, `EDT-037` keyboard-accessible canvas alternative, `EDT-040` reduced motion, `RES-007` alt text metadata, `WEB-011` navigation/keyboard behavior), de ezek nem bizonyítják önmagukban a teljes semantic HTML/labels/ARIA/focus/contrast/screen-reader/form accessibility lefedettségét. A hiányzó cross-cutting contract/domain besorolását M0.2-ben kell eldönteni; addig az F.9-03 szemantikai lefedettsége **OPEN**, noha a forráskövetelmény és az 1.0 release gate megmarad.


**Szemantikai surface-ellenőrzés — nyitott M0.3-függőség:** az archív F.12 követelménye kifejezetten azt mondja, hogy a creator profil és a játékok **Adminból legyenek konfigurálhatók**. A F.12-02/F.13-01 crosswalk helyesen hivatkozza a Game Profile domain CRUD-ját (`SCH-012`), a kapcsolati modellt (`SCH-014`) és a resource-megjelenítést, de ezek önmagukban nem neveznek meg egy konkrét Admin route-ot vagy Admin felületet. Az `ADM-001`–`ADM-010` jelenlegi registry-leírásai között nincs Game Profile-specifikus kezelőfelület-ID; nem szabad egy általános Admin-shell vagy permission ID-t tévesen CRUD-felületként feltüntetni. Ez **nem bizonyított hiányzó runtime-funkció**, hanem surface-traceability rés: M0.3-ban a tényleges Admin route/menu/action inventory alapján kell megnevezni a kanonikus felületet, és csak ezután dönteni, hogy meglévő ADM ID alá tartozik-e vagy új, indokolt capability ID szükséges. Addig F.12-02 és F.13-01 szemantikai/surface lezárása nyitott marad.


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

A §24 registry a jelenlegi állapotban 362 egyedi ID-t tartalmaz duplikáció nélkül; a H19–H34 ledger 271 egyedi történeti kulcsból és 271 sorból áll. A 2026-10-14-i újraellenőrzés a §37.22–§37.30 crosswalkban mind a 362 registry-ID-t feloldotta, beleértve a perjeles rövidítéseket (például SET-002/004) és a tartományokat. A `LOC-007`/`LOC-008` kizárólag a §37.26-ban szereplő, nem hivatkozható ID-ket tiltó magyarázó szövegben jelenik meg; nem aktív feature-hivatkozások.

**Mit bizonyít:** a felsorolt crosswalk sorok szerkezetileg léteznek, és a hivatkozott ID-k feloldhatók a registryben.

**Mit nem bizonyít:** az eredeti source szöveg minden bulletjének teljes szemantikai megőrzését; az E.1/C.23/C.24/00-A teljes tételes leképezését; a jelenlegi 362 registry-ID teljes kétirányú eredetbesorolását; a domain/service/permission/dependency contractok teljességét; vagy bármely funkció runtime PASS állapotát. P0.2 továbbra is IN PROGRESS.

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
| H19.18 | video/audio | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-001/002/003; supported media-type/preview contract TBD in M0.2 | RES | MERGE | 1.0 foundation; advanced media handling phased | QA-002/004 |
| H19.19 | clip/Short assets | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | RES-001/002 + CNT-003; asset storage vs. content-item management boundary explicit | RES + CNT | MERGE | 1.0 asset/resource support; advanced clip/Short workflows 1.x+ | QA-002/004 |
| H19.20 | cache policy | Resource / Asset Library (C.4) | Creator Center Resource Manager + Editor picker + upload API | 1.0 foundation for required media; advanced media workflows 1.x+ | Resource contract; R2 binary + D1 metadata boundary | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-04 | E-08 | AREA-05 | Resource foundation 1.0; advanced media workflows 1.x+ | WEB-030, OPS-008; asset-specific cache policy/invalidation owner TBD in M0.2 | WEB + OPS | MERGE | 1.0 cache-safety baseline; advanced media cache workflows phased | QA-002/004 |
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
| H21.05 | Twitch viewer statistics | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch connection/live core 1.0; viewer metrics are not part of the §39.2 minimum and require provider-capability/permission review | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Metrics staged after the 1.0 core, provisionally 2.0+ Creator OS analytics; confirm provider permission/data availability before commitment | LIV-004 | LIV | MERGE | 2.0+; provider-capability/permission gated | QA-002/003 |
| H21.06 | Twitch followers/subscribers where available | Integration/Platform contract + Streamer domain (C.7) | Creator Center integrations + server adapters + public widgets | Twitch connection/live core 1.0; follower/subscriber metrics are not part of the §39.2 minimum and require provider-capability/permission review | Secrets; OAuth/session security; normalized adapter contract; quota/rate-limit/error policy | Historical requirement retained; not runtime-complete by this mapping | Historical traceability only; implementation DoD/test/acceptance must be defined and passed in the phase-specific engineering point | UI-09; státusz UI-10; tartalom UI-11 | E-10 | AREA-08–AREA-12 | Metrics staged after the 1.0 core, provisionally 2.0+ Creator OS analytics; confirm provider permission/data availability before commitment | LIV-004 | LIV | MERGE | 2.0+; provider-capability/permission gated | QA-002/003 |
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
| H24.01 | semantic HTML | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.02 | heading hierarchy | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.03 | alt text | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | RES-007 | RES | MERGE | 1.0 | QA-004/005 |
| H24.04 | labels | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.05 | ARIA | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.06 | keyboard navigation | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | EDT-037 | EDT | MERGE | 1.0 | QA-004/005 |
| H24.07 | focus order | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.08 | focus visibility | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.09 | contrast warnings | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.10 | screen-reader metadata | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.11 | form validation accessibility | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.12 | editor accessibility checks | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | EDT-037; full Editor accessibility contract TBD in M0.2 | EDT + cross-cutting owner TBD in M0.2 | MERGE | 1.0 | QA-004/005 |
| H24.13 | public accessibility audit | Public Website / Accessibility (C.5 + C.13) | Editor accessibility checks + public site + forms | Semantic structure, labels, keyboard/focus and public baseline: 1.0 release gate; advanced audit tooling: staged | Semantic renderer, component contracts, forms, keyboard/focus behavior; no unsupported compliance claim | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; UI-22 | E-11; E-15; E-16 | AREA-02; AREA-18; AREA-24 | Accessibility baseline is a 1.0 release gate; advanced audit tooling staged | Cross-cutting accessibility contract TBD in M0.2 | TBD — cross-cutting owner in M0.2 | MERGE | 1.0 | QA-004/005 |

**H24 semantic ownership note:** a QA-horgony (`QA-005`) acceptance/audit gate, nem a követelmény runtime canonical feature ownerje. Ezért a H24.01–H24.13 sorokból a generic accessibility tételeknél kikerült a `QA-005` hamis feature-ID szerepben; a QA anchor oszlopban megmaradt. Csak a tényleges rész-képességek (`RES-007` alt metadata és `EDT-037` keyboard-accessible canvas alternatives) kaptak meglévő domain-ID-t. A semantic HTML, labels/ARIA, focus, contrast, screen-reader, form accessibility és teljes Editor/public accessibility contract ownershipét M0.2-nek kell kijelölnie.
| H25.01 | title | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-001 | SEO | MERGE | 1.0 | QA-004/006 |
| H25.02 | description | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-001 | SEO | MERGE | 1.0 | QA-004/006 |
| H25.03 | canonical | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-001 | SEO | MERGE | 1.0 | QA-002/004/006 |
| H25.04 | Open Graph | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-002 | SEO | MERGE | 1.0 | QA-002/004/006 |
| H25.05 | X/Twitter card | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-002 | SEO | MERGE | 1.0 | QA-002/004/006 |
| H25.06 | structured data | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-003 | SEO | MERGE | 1.0 | QA-002/004/006 |
| H25.07 | sitemap | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-004 | SEO | MERGE | 1.0 | QA-002/006 |
| H25.08 | robots | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-004 | SEO | MERGE | 1.0 | QA-002/006 |
| H25.09 | per-page SEO | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-005 | SEO | MERGE | 1.0 | QA-004/006 |
| H25.10 | SEO preview | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | SEO-005 | SEO | MERGE | 1.0 | QA-004/006 |
| H25.11 | redirects | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | WEB-013 | WEB | MERGE | 1.0 | QA-002/006 |
| H25.12 | broken-link detection | Public Website / SEO & Discoverability (C.13) | Per-page settings + public renderer + preview/admin | Title/description/social metadata and crawl baseline: 1.0; advanced redirect/broken-link tooling: scope decision | Canonical URL/site settings, published page metadata, sitemap/robots ownership | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-15; per-page UI-02 | E-12 | AREA-02; AREA-18 | Core SEO 1.0; redirect/broken-link scope needs explicit decision | WEB-013 | WEB | MERGE | 1.0 | QA-002/006 |
| H26.01 | page views | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Creator analytics: page views; consent/notice rules, event schema, bot/internal-traffic policy, aggregation, retention/deletion, access control, and no personal/sensitive payloads. Acceptance requires documented collection and privacy tests. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.02 | button clicks | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Creator analytics: button-click events use an allowlisted event schema and avoid recording entered form values, secrets, or arbitrary URL/query payloads. Acceptance requires event-contract and privacy-negative tests. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.03 | social clicks | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Creator analytics: social-link clicks are counted without leaking destination tokens or unnecessary identifiers; external navigation must continue to work when analytics is blocked. Acceptance requires privacy and graceful-degradation tests. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.04 | stream events | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Creator analytics: stream-related events require a defined event source, deduplication/idempotency, timestamp/timezone normalization, and explicit handling of provider outage or stale data. Never invent events. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.05 | conversion events | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Creator analytics: conversion events require a named conversion definition, source attribution boundary, deduplication and retention policy; no payment/order success may be inferred from a client-only event. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.06 | privacy-aware analytics | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Privacy-aware analytics: document consent/legal basis as applicable, data minimization, aggregation, retention/deletion, access control and user-facing disclosure before collection. Exact policy requires legal/product review; this mapping is not a compliance claim. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-002 | ANL + privacy/security policy owner TBD in M0.2 | DEFER | 2.0+ | QA-002 |
| H26.07 | retention policy | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Retention policy: define separate retention and deletion rules for raw events, aggregates, operational telemetry and audit/security records; document purpose, owner, access and deletion verification. Do not assume one shared retention period. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-009 | ANL + privacy/security policy owner TBD in M0.2 | DEFER | 2.0+ | QA-002 |
| H26.08 | admin dashboard | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Admin analytics dashboard: role/site-scoped access, explicit empty/loading/error states, consistent date range/timezone, definitions for each metric, and separation of creator outcomes from operational health. Dashboard rendering is not data correctness evidence. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-007 | ANL | DEFER | 2.0+ | QA-002 |
| H26.09 | editor/content performance | Analytics + operational performance (C.16 + H30) | Creator analytics dashboard + Editor/public performance telemetry; separate reporting surfaces and data owners | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Split into two separately owned products: (1) Editor/public operational performance telemetry (OPS-008: render/input latency, errors and resource use, restricted operational access/retention); (2) creator/content performance analytics (ANL-004: outcome metrics with privacy/retention controls). Never combine the metrics or imply one validates the other. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | OPS-008 + ANL-004 | OPS/ANL split ownership (M0.2 must confirm) | DEFER | 2.0+ | QA-002 |
| H26.10 | content performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Creator/content performance: define each metric, platform/source, refresh/staleness marker, attribution limits and comparison window; missing provider data stays missing/unknown rather than being fabricated. Acceptance includes source reconciliation and stale-data tests. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-004 | ANL | DEFER | 2.0+ | QA-002 |
| H26.11 | stream performance | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Stream performance: define supported source metrics and freshness, normalize time windows, label provider/account limitations and separate observed metrics from estimates. Acceptance requires fixtures for missing, stale and provider-error responses. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-003 | ANL | DEFER | 2.0+ | QA-002 |
| H26.12 | anomaly detection later | Analytics / Insights (C.16) | Public event collection + admin insights | Privacy/retention contract and minimum useful analytics: scope decision for 1.0; anomaly detection explicitly later | Anomaly detection is explicitly later-phase: define baseline/window, minimum sample size, false-positive handling, explainability and opt-in/notification controls before implementation. No anomaly-detection capability is implied in 1.0 or by this historical mapping. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; verify canonical event/source contracts, privacy/retention rules, metric definitions and phase-specific tests before acceptance | UI-19; summary UI-01 | — (domain analytics, not an Editor-owned feature) | AREA-17 | Operational telemetry separate from creator analytics; privacy/retention scope gate | ANL-010 | ANL | DEFER | 2.0+ | QA-002 |
| H27.01 | dashboard | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Creator Center overview; aggregates links/status only, with each metric owned by its source domain | Only workflows required for 1.0; advanced admin domains staged by roadmap | Dashboard must define every displayed status/metric, source freshness and role/site visibility; no duplicate domain data store, fabricated totals or clickable dead cards. Empty/loading/error states and links to canonical workflows are explicit. | Historical requirement retained; runtime not verified by this mapping | M0.1 map dashboard tiles to their source owners and prove each route exists; dashboard is not a replacement for domain-specific management screens | UI-01 shell; destination UI belongs to each canonical domain owner | E-15 shell/device tests plus source-domain acceptance tests for every displayed metric | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | ADM-002 | ADM | MERGE | 1.0 | QA-008 |
| H27.02 | navigation | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin shell navigation and route registry; distinct from module-level feature navigation and permissions | Only workflows required for 1.0; advanced admin domains staged by roadmap | Navigation exposes only authorized, implemented or explicitly labeled planned destinations; active state, direct URL entry, keyboard use, responsive collapse and unknown/unauthorized route behavior are defined. Server/API authorization remains authoritative. | Historical requirement retained; runtime not verified by this mapping | M0.1 reconcile visible links with canonical routes, module owners, role/site permissions and legacy redirects; no dead or misleading navigation entries | UI-01 shell/navigation; feature UI owned by the destination domain | E-15 navigation/responsive tests plus SEC-002/route-level negative authorization tests | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | ADM-001 | ADM | MERGE | 1.0 | QA-008 |
| H27.03 | responsive admin | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Creator Center shell and domain screens at desktop, tablet and mobile breakpoints | Only workflows required for 1.0; advanced admin domains staged by roadmap | Define breakpoint behavior for navigation, forms, tables, dialogs, long content, focus/keyboard access and touch targets; responsive layout must not silently remove required actions or weaken authorization. | Historical requirement retained; runtime not verified by this mapping | M0.1 map responsive acceptance to shell and each critical workflow separately; passing shell layout does not prove all modules responsive | UI-01 shell; each destination's UI remains with its canonical owner | E-15 viewport/browser matrix plus module-specific critical-flow tests | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | ADM-010 | ADM | MERGE | 1.0 | QA-008 |
| H27.04 | diagnostics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Operational diagnostics and health/status views; distinct from creator analytics and public-facing content | Only workflows required for 1.0; advanced admin domains staged by roadmap | Show only authorized operational facts with source, freshness, severity and actionable safe detail; redact secrets and personal data, separate provider/service health from creator performance, and handle missing/stale/error states without false-green status. | Historical requirement retained; runtime not verified by this mapping | M0.1 map each diagnostic to a real signal, owner, access rule and remediation; a UI placeholder or successful health endpoint does not prove full system health | UI-01 shell; OPS-007 diagnostics owner | OPS/QA operational checks plus SEC-003 access/redaction negatives; exact evidence required per diagnostic signal | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | OPS-007 | OPS | MERGE | 0.x–1.0 | QA-006/008 |
| H27.05 | page list | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Public-page inventory/list and page-specific actions; distinct from Editor Canvas and from published public rendering | Only workflows required for 1.0; advanced admin domains staged by roadmap | List is site-scoped and permission-checked; statuses distinguish draft/published/archived, sorting/filtering/pagination are deterministic, and create/edit/preview/publish actions link to canonical workflows without duplicating Page Model state. | Historical requirement retained; runtime not verified by this mapping | M0.1 reconcile list columns/actions with Page Model, revision and publish contracts; verify empty/error/unsaved/conflict states and route boundaries | WEB-001 page lifecycle owner; EDT-001 owns editing, not the page-list data | E-15 browser/responsive plus page lifecycle, site-isolation and authorization tests | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | WEB-001 | WEB | MERGE | 1.0 | QA-008 |
| H27.06 | content management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Content Center/page-content workflows (CNT) linked to Editor v2 (EDT) for visual composition; separate domain records from page layout | Only workflows required for 1.0; advanced admin domains staged by roadmap | CNT owns content records and lifecycle; EDT owns Page Model composition and rendering. No duplicate content store in the Editor. Draft/published revisions, references, media, and publish failures must be explicit. | Historical requirement retained; runtime not verified by this mapping | M0.1 identify which historical 'content management' means page content, reusable content records or advanced CMS; keep each canonical owner distinct and phase any uncovered capability | CNT-001 owns content domain; EDT-001 owns page composition | content lifecycle/revision tests plus Editor rendering/persistence tests and site-boundary negatives | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | CNT-001, EDT-001 | CNT/EDT | EXPAND | 1.0 pages/content / 2.0 advanced CMS | QA-002/004/008 |
| H27.07 | schedule | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Creator Center Schedule management; public schedule/calendar/next-stream are read-only presentations of canonical schedule records | Only workflows required for 1.0; advanced admin domains staged by roadmap | SCH owns event records, timezone/recurrence, lifecycle and site ownership; calendar/list are views. Editing or configuring an Editor Schedule block must not mutate event records. DST, stale/live and recurrence cases are explicit. | Historical requirement retained; runtime not verified by this mapping | M0.1 reconcile admin CRUD, public display, timezone and recurrence to SCH-001; verify ownership and phase-specific acceptance independently | SCH-001 canonical Schedule owner; Editor widget is presentation-only | Schedule domain/date/DST/recurrence tests, public-render tests and site-isolation checks | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | SCH-001 | SCH | MERGE | 1.0 | QA-008 |
| H27.08 | socials | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Public social/community links and separately authorized provider connection management | Only workflows required for 1.0; advanced admin domains staged by roadmap | COM-001 owns social/community link presentation; INT owns OAuth/provider connection, scope, token lifecycle and sync. A visible link is not proof of an authenticated integration, bot, role sync or provider API capability. | Historical requirement retained; runtime not verified by this mapping | M0.1 distinguish public links from Twitch/YouTube/TikTok/Discord connection workflows and map each provider capability to its approved phase and adapter contract | COM-001 public links; INT-002/007/010/011/019 integration workflows | public-link rendering plus OAuth scope/state, token secrecy, provider failure and authorization tests | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | COM-001 | COM | MERGE | 1.0 public social/community links; provider connections separately gated | QA-002/004/008 |
| H27.09 | VOD | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | VOD/content library and publishing workflows staged separately from 1.0 public Schedule/live states | Only workflows required for 1.0; advanced admin domains staged by roadmap | CNT owns VOD/content metadata, lifecycle, source references and platform availability; provider APIs and scopes gate sync/publish features. Do not infer a full VOD manager from public video embeds or Schedule entries. | Historical requirement retained; runtime not verified by this mapping | M0.1 retain historical VOD requirement, identify canonical CNT capability and explicit deferred phase; avoid promoting it to 1.0 without roadmap approval | CNT-002 canonical content/VOD owner | content lifecycle, provider-missing/stale/error and permission tests when its phase is approved | AREA-01–AREA-24 by canonical owner | VOD/content-management capability is staged with the Content Studio roadmap; public 1.0 schedule/live content is not proof of a full VOD manager | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004/008 |
| H27.10 | media | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Media/Asset Manager for uploaded binaries, metadata, selection and references consumed by pages/content | Only workflows required for 1.0; advanced admin domains staged by roadmap | RES owns asset metadata, validation, site ownership, lifecycle and safe delivery; R2/binary storage remains separate from structured D1 state. Validate MIME/size/type, access and deletion/reference behavior; Editor selection does not own the media library. | Historical requirement retained; runtime not verified by this mapping | M0.1 reconcile Admin media library, Editor asset picker and public asset delivery to one canonical resource owner and explicit adapter/UI boundaries | RES-001 canonical resource/media owner; Editor picker is a consumer | upload validation, cross-site access, metadata/reference integrity, deletion and public delivery tests | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | RES-001 | RES | MERGE | 1.0 | QA-002/004/007/008 |
| H27.11 | settings | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Site and application settings separated from provider-specific integration settings and user/session security settings | Only workflows required for 1.0; advanced admin domains staged by roadmap | SET owns general site configuration and validated defaults; INT owns provider connection configuration; SEC owns authentication/authorization secrets and session controls. Scope, validation, auditability and effect on published output must be explicit. | Historical requirement retained; runtime not verified by this mapping | M0.1 inventory every settings screen/field and assign one owner; remove duplicate fields and ensure changes propagate only through canonical configuration contracts | SET-001 general settings; INT and SEC retain their own canonical settings | schema/input validation, permission/site isolation, audit and published-output regression tests | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | SET-001 | SET | MERGE | 1.0 | QA-008 |
| H27.12 | SEO | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Per-page SEO metadata and site-level crawl/discoverability configuration | Only workflows required for 1.0; advanced admin domains staged by roadmap | SEO owns metadata generation, canonical URL, Open Graph/social cards, structured data, sitemap/robots and any approved redirects; page-specific fields follow page ownership and public renderer output. No SEO setting may leak draft or preview-only data. | Historical requirement retained; runtime not verified by this mapping | M0.1 reconcile SEO editor controls with H25 and generated public output; keep redirects/broken-link tooling as explicit scope decisions rather than implied capabilities | SEO-005 canonical SEO owner; WEB owns page lifecycle and URL identity | metadata/output, sitemap/robots, canonical URL, redirect and draft-leak production-smoke checks | AREA-01–AREA-24 by canonical owner | Only real, implemented workflows may appear active; planned modules must be labeled | SEO-005 | SEO | MERGE | 1.0 | QA-005/008 |
| H27.13 | analytics | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin analytics screen is a reporting view; ANL owns metric definitions, query semantics, filters and export. Operational health remains OPS-owned; do not duplicate telemetry or imply advanced analytics before its phase. | Only workflows required for 1.0; advanced admin domains staged by roadmap | A screen is in scope only when its metric definitions, source data, freshness, filters, export behavior and permission checks are specified; ANL-007 reporting/filter/export is the 2.0 baseline, not a full analytics backend. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | ANL-007 provides staged reporting/filter/export; stream/content/commerce analytics, attribution and anomaly detection remain governed by their canonical ANL roadmap entries. | ANL-007 | ANL | DEFER | 2.0 | QA-002/008 |
| H27.14 | integrations | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Connections Center is the Admin management surface; INT owns provider adapters, OAuth/token lifecycle, connection state and sync contracts. Public social links remain COM-owned and are not authenticated connections. | Only workflows required for 1.0; advanced admin domains staged by roadmap | Show only implemented connection workflows as active; label planned providers as planned. Each provider requires explicit auth scopes, token handling, disconnect/revoke, error/freshness state and provider-specific tests. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Twitch connection baseline for 1.0; additional providers follow INT roadmap phases. A visible tile alone does not prove a working integration. | INT-002, INT-007, INT-010, INT-011, INT-019 | INT | EXPAND | 1.0 Twitch Connections Center baseline / 1.5+ provider expansion | QA-002/003/008 |
| H27.15 | editor management | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Editor management configures entry into the canonical Editor v2; EDT owns editor capabilities and state. Do not revive the legacy Admin schedule editor or create a second visual editor. | Only workflows required for 1.0; advanced admin domains staged by roadmap | Management controls must target the canonical Editor v2 and its defined page/document model; editing, validation, persistence and publish behavior remain separately tested in EDT/WEB contracts. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Canonical Editor v2 only; legacy editor surfaces must be classified as redirect, migration aid or retired—not presented as parallel editors. | EDT-001 | EDT | MERGE | 1.0 | QA-008 |
| H27.16 | preview | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Preview is a read-only representation of the selected draft/revision using the canonical Page Model and public renderer contract; WEB owns preview routing and render parity. | Only workflows required for 1.0; advanced admin domains staged by roadmap | Preview must identify draft/revision context, avoid mutating production content, reflect supported responsive states and expose parity gaps; publish and public rendering require their own acceptance evidence. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | Preview capability does not equal publish success or prove production/public-render parity; use WEB-005 and the related publish/render gates. | WEB-005 | WEB | MERGE | 1.0 | QA-008 |
| H27.17 | recovery | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Recovery is an OPS-owned recovery workflow for backed-up structured state/assets and documented restore points; it is separate from Editor undo/redo and revision history. | Only workflows required for 1.0; advanced admin domains staged by roadmap | Define backup scope, retention, restore authorization, point-in-time limits, integrity checks and a tested restore procedure. Do not claim recoverability from backup creation alone. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | OPS-009 recovery capability requires restore evidence; Editor undo/redo (EDT) and revision history (EDT-005) remain separate mechanisms. | OPS-009 | OPS | MERGE | 0.x–1.0 | QA-006/007/008 |
| H27.18 | history | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | History means immutable/auditable page or editor revisions under EDT-005; operational logs and security audit events remain owned by OPS/SEC. | Only workflows required for 1.0; advanced admin domains staged by roadmap | Define revision scope, author/time metadata, diff or inspect behavior, restore semantics and permission checks; distinguish revision history from runtime logs and backups. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | EDT-005 page/editor revision history only; security audit logs, operational telemetry and disaster recovery must not be collapsed into one generic history feature. | EDT-005 | EDT | MERGE | 1.0 | QA-002/004/007/008 |
| H27.19 | permissions | Admin Platform / Creator Center (C.6 + C.7 + C.8 + C.16) | Admin permissions are the UI projection of server-enforced authorization. ADM owns Admin roles/workflow policy and SEC owns the security enforcement contract; hiding controls is not authorization. | Only workflows required for 1.0; advanced admin domains staged by roadmap | Specify role/action/resource matrix, least privilege, deny-by-default behavior, cross-site ownership checks and negative API tests; UI affordances must agree with server-side decisions. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-01–UI-23, according to the feature's canonical owner | E-15 for shell/device behavior; otherwise feature-specific E group | AREA-01–AREA-24 by canonical owner | ADM-009 workflow permissions align with SEC-002 RBAC. Authorization must be checked at every protected API/resource boundary, not only in navigation. | ADM-009, SEC-002 | ADM/SEC | MERGE | 0.x–1.0 | QA-003/008 |
| H28.01 | HttpOnly | Security / Auth / Audit (cross-cutting) | Session cookie must be HttpOnly; browser JavaScript must not read the session credential. Applies only to cookies carrying session/auth state, not every cookie indiscriminately. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Verify Set-Cookie attributes on login/refresh/logout paths and assert session cookie is inaccessible to document.cookie; test negative and expiry paths. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-001 session-cookie baseline; verify actual emitted headers and browser behavior. | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.02 | Secure cookie | Security / Auth / Audit (cross-cutting) | Session cookies must use Secure in production HTTPS; local development exceptions must be explicit and must not leak into production configuration. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Assert production Set-Cookie includes Secure and test deployment/configuration paths; do not infer safety from HTTPS redirect alone. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-001 production cookie configuration; release evidence must come from deployed response headers. | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.03 | SameSite | Security / Auth / Audit (cross-cutting) | Choose SameSite deliberately for each session/auth flow; document any cross-site OAuth callback exception and its compensating state/CSRF checks. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test cookie behavior for same-site requests and OAuth callback flow; validate state/nonce binding where applicable rather than weakening every cookie globally. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-001 session cookies plus SEC-004 CSRF/OAuth-state tests where flows require them. | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.04 | password hash | Security / Auth / Audit (cross-cutting) | Do not assume a local password-login feature exists. If passwords are introduced, use a current password-hashing algorithm with per-password salt and suitable work factor; never store plaintext or reversible passwords. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | First record whether password authentication is in scope. If absent, mark password-hash implementation not applicable; if introduced, add hash/verify, migration and credential-reset tests before release. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | Password hashing is a conditional security contract, not evidence that local password auth exists; current auth mechanism and scope must be verified. | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.05 | CSRF | Security / Auth / Audit (cross-cutting) | Protect state-changing cookie-authenticated requests against CSRF using a flow-appropriate token/origin strategy; GET/HEAD must not perform mutations. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test missing/invalid token, origin checks, cross-site requests and legitimate forms/API calls; OAuth callback state validation is related but not a substitute for general mutation protection. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-004 applies to state-changing browser/API flows; test each protected mutation surface. | SEC-004 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.06 | rate limiting | Security / Auth / Audit (cross-cutting) | Rate-limit abuse-prone endpoints by risk and identity/context, including authentication/OAuth callbacks, expensive actions and upload boundaries; avoid locking out unrelated users through overly broad keys. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test threshold, window/reset, response semantics, bypass resistance and legitimate traffic; document per-route limits and any distributed/runtime limitations. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-007 policy must be route-specific and observable; limits are not proven by a generic middleware declaration alone. | SEC-007 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.07 | RBAC | Security / Auth / Audit (cross-cutting) | Define role-to-action/resource permissions with least privilege and deny-by-default semantics; roles are not a replacement for site/resource ownership checks. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test allowed and denied role/action pairs, role changes and cross-site resource access at the server boundary; ensure UI state matches server decisions. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-002 RBAC contract coordinated with ADM-009; UI hiding alone never counts as enforcement. | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.08 | API authorization | Security / Auth / Audit (cross-cutting) | Every protected API handler must authorize the actor against the requested action and resource after validating the session; frontend route guards are not sufficient. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Add direct API tests for unauthenticated, insufficient-role, wrong-site/owner and valid-owner requests, including alternate identifiers and mutation endpoints. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-002 must cover every protected route and resource, including upload and integration operations. | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.09 | public/admin separation | Security / Auth / Audit (cross-cutting) | Keep public rendering/data endpoints separate from Admin/editor mutations and private data; public responses must not expose drafts, secrets, internal identifiers or privileged controls. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test public and authenticated variants, draft/private-resource denial, cache behavior and route/method separation; public page rendering must not inherit admin session privilege. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-002 boundary applies at API/data level, not merely separate HTML routes or navigation. | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.10 | Cloudflare Secrets | Security / Auth / Audit (cross-cutting) | Store credentials and provider secrets in the deployment secret store, not source, public assets, client bundles, logs or committed environment files; restrict access and rotate on exposure. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Scan tracked files/build output/log paths for secret leakage and verify production binding/configuration; test that secrets are never returned by APIs or diagnostic views. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-008 secret handling; distinguish secret values from non-secret connection metadata and redact diagnostic output. | SEC-008 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.11 | audit log | Security / Auth / Audit (cross-cutting) | Security audit events must record security-relevant actor/action/target/outcome/time with sensitive values redacted; audit history is distinct from operational metrics and Editor revision history. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test event creation for success and denial paths, redaction, access restrictions and failure behavior; define retention and avoid logging tokens, passwords or raw sensitive payloads. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-010 audit trail; OPS telemetry and EDT revision history retain their own canonical ownership. | SEC-010 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.12 | input validation | Security / Auth / Audit (cross-cutting) | Validate untrusted input at server boundaries with schema, type, length, range and allowed-value constraints; client-side validation is only a usability layer. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test malformed, missing, oversized and unexpected values on APIs; ensure validation happens before persistence or side effects and errors do not disclose internals. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-005 applies to request parameters, structured content and integration callbacks according to each endpoint contract. | SEC-005 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.13 | output validation | Security / Auth / Audit (cross-cutting) | Encode or sanitize output for its destination context; prevent stored/reflected XSS and unsafe URL/HTML injection in public rendering, Admin and Editor previews. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Use hostile-input tests across public render, preview and Admin display contexts; verify context-appropriate encoding and avoid treating input validation as a substitute for output encoding. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-005 output controls must be tested per rendering context; preserve safe authoring flexibility through explicit trusted-content rules. | SEC-005 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.14 | file validation | Security / Auth / Audit (cross-cutting) | Validate uploads server-side: allowed type/extension, actual content/signature where feasible, size, filename/path safety and authorization; keep object metadata separate from R2 binary storage. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test spoofed MIME/extensions, oversized/empty files, path traversal names, unauthorized upload/delete and failure cleanup; ensure public delivery policy is explicit. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | RES-003 owns media validation/lifecycle; R2 stores binaries while D1 stores structured metadata. | RES-003 | RES | MERGE | 0.x–1.0 | QA-003 |
| H28.15 | replay protection where applicable | Security / Auth / Audit (cross-cutting) | Use replay protection for one-time or signed operations where the protocol requires it, including OAuth state and expiring/single-use action tokens; do not apply a vague global replay flag. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test duplicate, expired, mismatched and already-consumed state/token values; ensure state is bound to the expected site/session/connection context. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-009 is protocol-specific; preserve exact resource/site ownership binding and one-time consumption semantics. | SEC-009 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.16 | action permission `can()` checks | Security / Auth / Audit (cross-cutting) | Centralize action authorization through a server-side permission contract such as can(actor, action, resource); avoid scattered UI-only conditionals and ambiguous implicit allow behavior. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | Test policy decisions for allowed/denied actions and missing context; ensure each mutation invokes the canonical check and denial is enforced at the API boundary. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | SEC-002 and ADM-009 define policy/roles; helper usage alone is not proof every handler is protected. | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.17 | AI permission boundary | Security / Auth / Audit (cross-cutting) | AI operations, when introduced, must have explicit permission, data-access, tool/action and approval boundaries; AI must not inherit unrestricted Admin authority or bypass existing ownership checks. | Security controls required for 1.0 are release gates; AI-specific boundary applies when AI execution is introduced | If AI execution is not present in the current phase, keep the boundary as a future contract. Before enabling it, test denied tools/actions, scoped data access, prompt-injection resistance and human approval for consequential changes. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-18; UI-22; affected UI-04/UI-09/UI-14/UI-21 | E-16; applicable E group | AREA-01; AREA-24 | AI-006 is conditional on AI feature activation; no current AI runtime or completed control is implied by this mapping. | AI-006 | AI | MERGE | 0.x–1.0 | QA-003 |
| H29.01 | full backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | A full backup contract must define included D1 structured data, schema/migration metadata, R2 objects and references, exclusions, encryption/access, retention and consistency point. A successful export command alone is not a complete backup. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Test a consistent capture, enumerate included/excluded resources, verify access restrictions and retention, and demonstrate restore into an isolated target before claiming recoverability. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | OPS-005 backup scope and restore evidence; distinguish operational backup from portable user export. | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.02 | page backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Page backup must preserve the selected page's canonical Page Model, metadata, ownership, publication/draft state and referenced resources without copying unrelated site records. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Restore into a test site/revision and verify page structure, ownership boundaries, resource references and public rendering; reject cross-site import/overwrite without explicit authorization. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | WEB-008 page backup must align with canonical Page Model and publishing contracts; it is not a second page persistence system. | WEB-008 | WEB | MERGE | 0.x–1.0 | QA-007 |
| H29.03 | revision backup | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Revision backup must preserve revision identity, parent/ordering metadata, content snapshot and actor/time metadata needed by EDT-005; it must not conflate revision snapshots with disaster-recovery backups. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Test revision round-trip, ordering, inspect/restore behavior and permissions; verify restore does not silently rewrite audit metadata or overwrite unrelated revisions. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | EDT-005 owns revision history; OPS backup may contain it but does not replace revision semantics. | WEB-008 | WEB | MERGE | 0.x–1.0 | QA-007 |
| H29.04 | media references | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Backups and exports must preserve media object keys and stable metadata references, and define behavior for missing, private, deleted or externally hosted assets; never silently remap one site's private asset into another. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Test object existence/checksum, reference resolution, access policy and missing-asset reporting across backup and restore; keep binary R2 objects distinct from D1 metadata. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | RES-008 owns media-reference integrity; R2 binary inclusion and D1 metadata inclusion must be explicitly stated. | RES-008 | RES | MERGE | 0.x–1.0 | QA-007 |
| H29.05 | restore validation | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Validate a restore candidate before activation: schema compatibility, ownership constraints, required records, asset references and integrity checks must pass or produce actionable errors. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Run validation in isolation before mutation; test corrupt, incomplete, incompatible and cross-site restore sets, with no partial production mutation on validation failure. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | OPS-005 restore validation is a release gate; a successful backup creation does not satisfy it. | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.06 | rollback | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Rollback must identify the target deployment/data/revision and its consistency boundary; define whether rollback affects content, schema, assets or runtime configuration, and require explicit confirmation for destructive operations. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Test rollback success and failure, ownership, concurrent edits, schema compatibility and post-rollback public rendering; retain an audit record and avoid silent partial rollback. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | OPS-009 operational recovery/rollback is separate from Editor undo/redo and EDT revision restore. | OPS-009 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.07 | import/export JSON | Persistence / Revision / Resource (C.4 + C.5 + C.6) | JSON import/export must use a versioned schema, validate untrusted input, document portability boundaries and exclude secrets/session credentials; exports must identify included records and referenced assets. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Test round-trip compatibility, unknown versions/fields, malformed and oversized input, secret exclusion and cross-site import restrictions; report skipped/unresolved references explicitly. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | OPS-005 structured export/import contract; portable JSON is not automatically a full D1+R2 disaster-recovery backup. | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.08 | migration compatibility | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Backup and restore artifacts must declare schema version and required migration level; migration compatibility policy must cover supported upgrade/restore directions and incompatible versions. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Test current-version restore, supported older artifact upgrade, unsupported future version rejection and migration failure without corrupting source/target state. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | OPS-004 migration compatibility aligns with D1 migration history; never bypass schema/ownership constraints to force restore. | OPS-004 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.09 | backup integrity check | Persistence / Revision / Resource (C.4 + C.5 + C.6) | Integrity checks must cover artifact completeness and checksums where applicable, structured-data consistency, required references and detectable corruption; record the result and timestamp. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Test altered/truncated artifacts, checksum mismatch, missing R2 objects, broken references and successful clean artifacts; failed checks must block activation. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | OPS-005 integrity evidence must be repeatable and distinguish validation passed from backup merely present. | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.10 | recovery drill | Persistence / Revision / Resource (C.4 + C.5 + C.6) | A recovery drill must exercise the documented restore path against an isolated target and record recovery outcome, integrity, duration/limitations and unresolved manual steps. | Reliable rollback and minimum recoverability: 1.0 gate; broader backup/export workflows staged only by explicit scope | Run and retain evidence of a full restore drill for the declared backup scope; test that the recovered service/data is usable, not merely that files were copied. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-17; UI-22 | E-13; E-14 | AREA-01; AREA-24 | OPS-006 recovery drill is the proof gate for the declared recovery objective; no RPO/RTO target should be invented without an explicit product decision. | OPS-006 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H30.01 | bundle review | Performance / Production QA (cross-cutting) | Review production bundles for accidental secrets, oversized dependencies, duplicate code and unused payload; report reproducible artifact-level findings for public site, Editor and Worker rather than relying on a source-only checklist. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Define the bundle targets and build variants in M0.2, capture repeatable build-size evidence, inspect emitted artifacts for secrets/duplicate payload, and fail the gate on unexplained regressions; numerical budgets remain a decision until recorded. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | OPS-010 build/production quality gate; budget values and per-artifact ownership must be explicit before acceptance. | OPS-010 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.02 | lazy loading | Performance / Production QA (cross-cutting) | Load non-critical images, embeds and below-the-fold content when appropriate while preserving layout stability, keyboard access and visible loading/error states; do not defer critical above-the-fold content blindly. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Test initial viewport, slow network, keyboard/screen-reader behavior, layout shift and failure fallback on representative public pages. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | RES-004 owns media delivery behavior; page rendering and accessibility acceptance remain with WEB/QA. | RES-004 | RES | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.03 | image optimization | Performance / Production QA (cross-cutting) | Serve appropriately sized and encoded image variants with dimensions/aspect ratio reserved; define format fallback, quality, responsive selection and cache identity without altering source assets unexpectedly. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Measure representative image transfer and render; test responsive candidates, fallback, dimensions, failed variants and source preservation. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | RES-004 image optimization is separate from media-library lifecycle and upload validation. | RES-004 | RES | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.04 | caching | Performance / Production QA (cross-cutting) | Caching policy must distinguish immutable assets, public rendered content, private drafts/Admin responses and authenticated API data; never publicly cache private or user-specific responses. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Inspect Cache-Control and cache keys across public, draft, authenticated and asset responses; test isolation between users/sites and stale-data behavior. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | OPS-008 operational caching telemetry does not own content cache semantics; policy must follow resource sensitivity. | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.05 | cache invalidation | Performance / Production QA (cross-cutting) | Publishing, page updates, media replacement and relevant settings changes must invalidate or version every affected cache layer; define propagation and stale-content behavior. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Test publish/update/unpublish, asset replacement and rollback against edge/browser caches; verify public content converges and private drafts remain isolated. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | OPS-008 monitoring can measure freshness, but canonical invalidation triggers belong to the publishing/resource owners. | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.06 | Core Web Vitals | Performance / Production QA (cross-cutting) | Measure Core Web Vitals on representative public templates and real user/device conditions where available; record lab versus field data, sample window and thresholds separately. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | M0.2 must assign canonical measurement owner and approve explicit LCP/INP/CLS thresholds; validate repeatable lab tests and field-data provenance without inventing a passing score. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | OPS-008 telemetry plus WEB public-render contract; owner and numeric budget remain OPEN for M0.2. | OPS-008; public performance budget/measurement contract TBD in M0.2 | OPS + cross-cutting owner TBD in M0.2 | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.07 | rendering performance | Performance / Production QA (cross-cutting) | Measure public-render cost separately from Editor canvas and API latency; cover first render, navigation and representative page complexity using reproducible fixtures. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | M0.2 must name WEB/OPS responsibility and numeric budgets; test representative pages at defined device/network profiles and record p50/p95 where applicable. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Public rendering ownership is shared WEB/OPS until M0.2 explicitly resolves the contract; do not silently assign final ownership here. | OPS-008; public rendering performance contract TBD in M0.2 | OPS + WEB; canonical performance ownership TBD in M0.2 | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.08 | large-page performance | Performance / Production QA (cross-cutting) | Define large-page performance by bounded page complexity (node count, assets and content size) and representative worst-case fixtures; avoid an undefined label such as large page. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | M0.2 must define supported page-size envelope, responsible owner and measured budgets; benchmark render, interaction and asset loading at that envelope. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | OPS + WEB ownership and large-page limits remain OPEN for M0.2; do not treat generic performance checks as acceptance. | OPS-008; large-page performance budget and owner TBD in M0.2 | OPS + WEB; canonical performance ownership TBD in M0.2 | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.09 | large-tree editor performance | Performance / Production QA (cross-cutting) | Benchmark Editor canvas interaction and tree operations on large documents, including selection, drag/resize, inspector updates and history memory; keep canvas performance distinct from public rendering. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | M0.2 must define document-size envelope, EDT/OPS ownership and budgets; test interaction latency and stability on repeatable large-tree fixtures. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | Editor performance ownership remains OPEN for M0.2; EDT owns Editor behavior while OPS provides cross-cutting measurement. | OPS-008; Editor large-tree performance capability/acceptance owner TBD in M0.2 | OPS + EDT; canonical Editor performance ownership TBD in M0.2 | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.10 | history memory limits | Performance / Production QA (cross-cutting) | Bound in-memory revision/undo history by an explicit retention policy and document-size strategy; preserve correctness of undo/redo and avoid unbounded memory growth. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Test long edit sessions, large changes, undo/redo after pruning and memory stability; define what history is retained and when a limit is reached. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | EDT-005 revision semantics and EDT runtime history are related but not interchangeable; document any separate in-memory history limits. | EDT-005 | EDT | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.11 | autosave efficiency | Performance / Production QA (cross-cutting) | Autosave should avoid unnecessary full-document writes where safe, coalesce rapid changes without losing the latest state, and expose saving/saved/error/conflict states. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Test rapid edits, navigation/close, network interruption, retries, concurrent revision conflicts and recovery of the latest acknowledged state; measure request/write volume. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | EDT-030 owns autosave efficiency; correctness and conflict recovery take precedence over reducing request count. | EDT-030 | EDT | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.12 | API latency monitoring | Performance / Production QA (cross-cutting) | Measure API latency by route class and outcome, separating Worker compute, D1/R2/provider latency and client wait; redact identities/secrets and define sampling/retention. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Set route-specific latency budgets in the canonical OPS contract; test slow/error paths and ensure telemetry freshness, sampling and redaction are visible. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | OPS-008 operational telemetry only; creator/content analytics metrics remain ANL-owned. | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.13 | production smoke test | Performance / Production QA (cross-cutting) | Production smoke must exercise deployed critical public, auth/Admin, Editor persistence/publish and required integration paths after deployment/migration; report version and environment. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Maintain a critical-path list with expected status/content and safe side effects; verify deployment version, database migration state, error rates and rollback criteria against live evidence. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | QA-006 is an execution gate, not a checklist title; only fresh evidence for the current deployment can pass it. | QA-006 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.14 | visual regression baseline | Performance / Production QA (cross-cutting) | Maintain approved visual baselines for representative public and Editor states, with controlled viewport/font/theme and explicit handling for intentional changes; pair screenshots with functional assertions. | Production smoke, critical rendering and autosave performance: 1.0 gates; advanced monitoring/tooling staged | Test critical viewport states and regressions for canvas, overlays, responsive layouts and public rendering; document baseline update approval and avoid accepting unexplained diffs. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-22; impacted public/editor modules | Cross-cutting; applicable E groups | AREA-24; applicable AREA | QA-004 visual regression is distinct from functional QA and must cover the user-visible surfaces relevant to each release. | QA-004 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H31.00 | AI editor must use the same canonical action system as manual Editor; pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version | AI Platform / AI Editor (C.14) | AI Editor must use the same canonical action executor as manual editing: intent → plan → typed actions → permission → validation → preview/diff → approval → execute → verify → audit/version. No direct DOM, database or provider-side mutation bypass. | Post-1.0 unless explicitly re-scoped by roadmap gate | Before AI is enabled, test denied actions, invalid plans, approval binding, execution failure, verification mismatch, audit completeness and undo/rollback; human approval must cover the exact diff being executed. | Supplementary architecture contract; not a separate item in historical H31 checklist; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Architecture contract spanning AI-003/005–009 and EDT; this row is supplementary and does not imply an AI runtime exists. | AI-003, AI-005, AI-006, AI-007, AI-008, AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.01 | AI page operations | AI Platform / AI Editor (C.14) | AI page operations may propose Page Model actions only; page creation, duplication, deletion, metadata and navigation changes each need explicit allowed-action and ownership rules. | Post-1.0 unless explicitly re-scoped by roadmap gate | M0.2 must enumerate supported page actions and test validation, target/site ownership, diff, approval, persistence, publish impact and rollback; reject unsupported operations explicitly. | Historical requirement retained; runtime not verified by this mapping | M0.2 must name the page operation set, canonical EDT/Page Model owner, validation, preview/diff, approval, persistence and rollback tests | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI + EDT ownership remains open until M0.2 defines the page action contract; AI-011 assistant surface alone is not the mutation lifecycle. | AI-003, AI-005–AI-009 + canonical page owner TBD M0.2 | AI + EDT (operation owner open) | DEFER | 3.0 | QA-002/003/008 |
| H31.02 | AI element operations | AI Platform / AI Editor (C.14) | AI element operations target stable Editor node identities and schema-approved actions; they must not manipulate rendered DOM or write storage directly. | Post-1.0 unless explicitly re-scoped by roadmap gate | M0.2 must define allowed node types/properties, stale-target handling, selection scope, validation, preview/diff and undo/rollback tests, including malformed and cross-page targets. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define allowed element actions, schema validation, permissions, selection/target identity, preview, execution and undo/rollback tests | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Element actions are separate from page-level operations; AI and EDT owners must be assigned per action family in M0.2. | AI-003, AI-005–AI-009 + canonical element owner TBD M0.2 | AI + EDT (operation owner open) | DEFER | 3.0 | QA-002/003/008 |
| H31.03 | AI style/layout operations | AI Platform / AI Editor (C.14) | AI style/layout operations may use approved design tokens and schema properties; prevent arbitrary CSS/script injection and preserve responsive and accessibility constraints. | Post-1.0 unless explicitly re-scoped by roadmap gate | Define allowed tokens/properties, responsive scope, conflict behavior, preview/diff and visual regression acceptance; reject unsupported values and preserve a reversible change record. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define supported style/layout properties, token restrictions, responsive scope, validation, diff/approval and visual regression acceptance | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI generation does not own the design system; canonical EDT/DSN contracts govern style and layout mutations. | AI-003, AI-005–AI-009 + canonical style/layout owner TBD M0.2 | AI + EDT/DSN (operation owner open) | DEFER | 3.0 | QA-002/003/008 |
| H31.04 | AI responsive operations | AI Platform / AI Editor (C.14) | AI responsive operations must target explicit breakpoints and follow canonical inheritance/override rules; never silently alter all breakpoints when the request targets one viewport. | Post-1.0 unless explicitly re-scoped by roadmap gate | Test breakpoint-specific diffs, inheritance, canvas/public parity, narrow/wide viewport rendering, approval and rollback; unspecified target behavior must be clarified rather than guessed. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define breakpoint targeting, inheritance/override rules, canvas/public parity, validation, preview and rollback tests | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Responsive mutation contract and final owner remain an M0.2 closure item; AI is an orchestrator, not a second responsive layout engine. | AI-003, AI-005–AI-009 + canonical responsive owner TBD M0.2 | AI + EDT (operation owner open) | DEFER | 3.0 | QA-002/003/008 |
| H31.05 | AI content generation | AI Platform / AI Editor (C.14) | AI content generation creates proposals for canonical content fields/blocks with provenance and user review; it must not silently publish or overwrite authored content. | Post-1.0 unless explicitly re-scoped by roadmap gate | Test field/locale targeting, unsafe or malformed content, preservation of existing content, revision creation, approval and rejection paths; generated claims/data must be identified as generated where relevant. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI-013 generation assistance remains post-1.0 and uses canonical content/page owners; generation is not equivalent to publish. | AI-013 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.06 | AI SEO assistance | AI Platform / AI Editor (C.14) | AI SEO assistance may suggest metadata, canonical/redirect decisions or structured-data changes, but must distinguish evidence-based findings from generated suggestions and never silently publish. | Post-1.0 unless explicitly re-scoped by roadmap gate | Test generated metadata against SEO field contracts, preview/public output, structured data validity and approval/rejection; prevent duplicate or conflicting canonical settings. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI-012 suggestion support does not replace SEO-005 ownership or H25 public-output acceptance. | AI-012 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.07 | AI accessibility QA | AI Platform / AI Editor (C.14) | AI accessibility QA must report reproducible findings with rule, affected target, evidence, severity and uncertainty; automated checks cannot certify full accessibility or replace human review. | Post-1.0 unless explicitly re-scoped by roadmap gate | M0.2 must define supported rules, false-positive handling, manual review and safe remediation proposals; test keyboard/focus/semantics findings and ensure any changes use the canonical approval pipeline. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define audited rules, source evidence, severity, false-positive handling, manual approval for changes and keyboard/screen-reader acceptance; QA IDs remain test anchors | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | Accessibility rule ownership remains open; AI-012 is not an accessibility domain owner and QA IDs are evidence gates only. | TBD M0.2; AI-012 alone is not an accessibility-QA owner | AI + accessibility domain (owner open) | DEFER | 3.0 | QA-002/003/008 |
| H31.08 | AI visual QA | AI Platform / AI Editor (C.14) | AI visual QA compares controlled render/screenshot baselines and reports differences with viewport, browser, revision and reproducibility metadata; it is separate from SEO and accessibility analysis. | Post-1.0 unless explicitly re-scoped by roadmap gate | Define baseline capture, tolerated variance, repeatability, false-positive review and human acceptance; test stable and intentionally changed renders before classifying regressions. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define viewport/browser baselines, comparison thresholds, false-positive review, reproducibility and human acceptance; QA-004 is a test gate, not runtime owner | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | QA-004 validates visual regressions but is not the runtime owner; final AI visual-QA owner remains open for M0.2. | TBD M0.2; AI-012 not sufficient | AI + visual-QA domain (owner open) | DEFER | 3.0 | QA-002/003/008 |
| H31.09 | action permissions | AI Platform / AI Editor (C.14) | Every proposed AI action must be checked against the same actor, role, site, resource and action policy as manual Editor actions immediately before execution. | Post-1.0 unless explicitly re-scoped by roadmap gate | Test unauthorized action families, wrong-site targets, expired approval and permission changes between plan and execution; deny by default and record denials without leaking sensitive data. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI-006 must integrate with SEC-002/ADM-009 and canonical ownership checks; plan-time permission alone is insufficient. | AI-006 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.10 | approval rules | AI Platform / AI Editor (C.14) | Approval must bind to an immutable or verifiably identical action plan/diff, target and scope; if the plan changes after approval, approval is invalidated and renewed. | Post-1.0 unless explicitly re-scoped by roadmap gate | Test modified-after-approval plans, partial approvals, expired approvals, cancellation and destructive changes; show users clear consequences and a no-op/reject path. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI-007 approval rules are a separate contract from permission checks and should use the canonical action pipeline. | AI-007 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.11 | rollback | AI Platform / AI Editor (C.14) | AI rollback must use the canonical revision/action recovery mechanism and declare which changes can be reversed; external provider side effects may require compensating actions rather than true rollback. | Post-1.0 unless explicitly re-scoped by roadmap gate | Test partial execution, verification failure, cancellation and rollback failure; record residual side effects and never claim rollback succeeded without post-rollback verification. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI-009 coordinates with EDT revision history and OPS recovery; these mechanisms are related but not interchangeable. | AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.12 | audit | AI Platform / AI Editor (C.14) | AI audit must record request/action identifiers, actor, approved plan/diff, policy decision, execution outcome, verification and version/revision reference while redacting secrets and unnecessary prompt data. | Post-1.0 unless explicitly re-scoped by roadmap gate | Test success, denial, rejection, timeout, partial execution and retry paths; audit access/retention and ensure tokens or sensitive content are not logged indiscriminately. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI-009 audit/version responsibilities align with SEC-010 security audit and EDT revisions without collapsing their ownership. | AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.13 | rate/cost controls | AI Platform / AI Editor (C.14) | AI rate/cost controls must bound per-user/site/provider spend and request frequency, support cancellation and prevent retry loops; disclose usage/limit state without exposing provider secrets. | Post-1.0 unless explicitly re-scoped by roadmap gate | Define budgets and thresholds before activation; test concurrent requests, provider failures, retry caps, quota exhaustion, cancellation and usage accounting. Numeric limits remain an explicit product/ops decision. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; connected UI-02/UI-17 | E-13; E-14; E-16 | AREA-21; AREA-03; AREA-01 | AI-010 cost controls are required before AI activation; no spend limit or live billing integration is implied by this mapping. | AI-010 | AI | DEFER | 3.0 | QA-002/003/008 |
| H32.01 | live stream monitoring | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Live-stream monitoring must identify each provider's actual telemetry, permission scopes, freshness and outages; distinguish live state from cached or inferred values. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Define provider/source, polling/event freshness, failure states, privacy and retention; test disconnects, stale data and unavailable APIs before showing a metric as current. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-015 is a broad capability anchor, not proof of provider access or real-time monitoring; post-1.0 Creator OS scope. | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.02 | silence/speech detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Silence/speech detection requires an explicitly selected audio source, processing mode and confidence threshold; do not infer silence from missing telemetry or treat silence as a technical fault automatically. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Define input quality, false-positive/negative review, language/noise limitations and user consent; test silence, low volume, muted source and missing-data cases. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 analysis capability; source access, retention and user controls must be explicit before implementation. | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.03 | chat activity analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Chat activity analysis must use authorized provider data and defined aggregation windows; separate observed messages/counts from sentiment or inferred intent. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test missing/deleted messages, moderation filtering, bot/noise handling, privacy minimization and metric provenance; never imply complete chat coverage if provider limits apply. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-015 capability umbrella; provider adapter and analytics definitions must be owned by INT/ANL as M0.2 assigns. | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.04 | technical issue detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Technical issue detection should correlate only available stream/network/encoder/provider signals and report evidence plus confidence, not invent a root cause from a single symptom. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test known failure scenarios, missing telemetry, false alarms and actionable diagnostics; separate observed facts from suggested remedies. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Operational signals belong to OPS/provider contracts; AI analysis is advisory and post-1.0. | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.05 | audio problem detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Audio problem detection must distinguish clipping, noise, dropouts, channel imbalance and absent input where the source supports it; define which signals are measurable. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test representative audio fixtures and confidence/error cases; disclose unsupported diagnosis and avoid retaining raw audio unless explicitly approved. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Audio analysis source, privacy and retention remain explicit scope decisions; no audio-monitoring runtime is implied. | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.06 | stream quality checks | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream quality checks must define observable metrics (for example bitrate, dropped frames or connection state) per supported source and mark unsupported fields unavailable rather than guessing. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test thresholds, stale data, source disconnect and provider-specific differences; keep diagnostic evidence separate from automated control actions. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Provider/OPS contracts own measurements; AI-015 alone does not establish a complete quality-monitoring implementation. | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.07 | scene suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Scene suggestions must be recommendations tied to a supported context and explicit user-selected OBS/provider integration; suggestion must not change a live scene without separate permission and approval. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Define context signals, latency, supported scenes, confidence, no-suggestion fallback and explicit approval for any future execution; test disconnected integration and stale context. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define the scene-suggestion source, permission, latency/safety boundary and approval UX; AI-015 does not establish ownership | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Scene recommendation owner and source contract remain OPEN for M0.2; post-1.0 only unless formally re-scoped. | TBD M0.2; AI-015 not sufficient | AI (owner open) | DEFER | 3.0–8.0 | QA-002/008 |
| H32.08 | context-aware ideas | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Context-aware ideas must cite the context used (current game, stream status, schedule or user-provided preference) and allow the user to dismiss or correct it. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test stale/missing context, conflicting sources, sensitive data exclusion and user correction; recommendations must degrade gracefully when context is unavailable. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-014 idea generation is separate from AI-015 live diagnostics; source provenance and memory permissions must be explicit. | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.09 | interesting moment detection | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Interesting-moment detection must identify evidence/time ranges and confidence, distinguish candidate detection from actual clip creation, and respect source availability/retention. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test timestamp accuracy, false positives, stream gaps and source expiry; users must be able to inspect, dismiss and correct candidates. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-014 candidate discovery is post-1.0; it does not itself create/publish clips or guarantee complete stream coverage. | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.10 | post-stream summary | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Post-stream summaries must be derived from available session/chat/telemetry sources and label coverage, gaps and generated interpretation separately from observed facts. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test incomplete recordings, unavailable chat, timestamp alignment and contradictory signals; allow review/edit and define retention/deletion. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-014 summary assistance is not a replacement for canonical analytics or an authoritative event log. | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.11 | VOD analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | VOD analysis must declare supported platforms, accessible source types, processing limits and retention; distinguish video metadata/transcript from actual visual/audio analysis. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test private/expired/unavailable VODs, timestamp mapping, partial processing and deletion; show coverage and failure status accurately. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 AI-014; provider access and media-processing capability require a separately approved phase and owner. | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.12 | clip candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Clip candidates are timestamped recommendations with source references and evidence; they are not published clips and must not imply export/edit capability unless separately implemented. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test candidate boundaries, source availability, duplicate handling and timestamp validity; require user review before creating or exporting a clip. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-014 candidate discovery is distinct from actual clip creation, media storage and provider publishing workflows. | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.13 | Short candidates | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Short-form candidates must include proposed segment bounds and platform-specific duration/aspect constraints only for explicitly supported targets; retain source provenance. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test duration limits, segment boundaries, crop/aspect preview and unsupported platform behavior; candidate approval precedes render/export/publish. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-014 suggests candidates; actual Shorts/TikTok publishing and rendering are separate roadmap capabilities. | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.14 | title/description suggestions | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Title/description suggestions must be editable, platform-aware and grounded in the selected content; label generated suggestions and avoid fabricated facts or unapproved claims. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test length/format rules per target, localization, unsafe claims and preservation of user-authored values; no silent metadata publishing. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-013 content assistance remains separate from provider publishing and SEO-005 public-site metadata ownership. | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.15 | platform variants | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Platform variants must be generated against explicit per-platform requirements and preserve a canonical source version with traceable differences. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Define supported targets, length/format constraints, localization behavior, revision lineage and unsupported-target handling; test that one variant cannot silently overwrite another. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-013 content generation is not equivalent to authenticated integrations or actual cross-platform publishing. | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.16 | thumbnail briefs | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Thumbnail briefs describe concept, composition, text and target constraints; image generation/editing and asset publication are separate actions requiring their own user approval. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test platform dimensions, text readability, brand constraints, generated-vs-final status and asset licensing/source metadata where applicable. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-013 brief generation does not imply a thumbnail generator or automatic upload exists. | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.17 | publishing recommendations | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Publishing recommendations must separate recommendation from scheduling/publishing execution and disclose evidence, uncertainty and relevant platform constraints. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test recommendation provenance, conflicting schedule/provider limits and user override; any write/schedule action must use the canonical integration permission and approval flow. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | AI-013 recommendation capability is separate from SCH scheduling and INT provider publishing. | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.18 | content performance analysis | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Content performance analysis must use ANL-owned metric definitions and source freshness, distinguish correlation from causation, and disclose incomplete provider coverage. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Test date ranges, attribution definitions, missing/stale metrics and exports; recommendations must not be based on fabricated or incomparable provider values. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | ANL-004 owns content-performance semantics; AI is a consumer/analyst, not a second analytics store. | ANL-004 | ANL | DEFER | 3.0 | QA-002/008 |
| H32.19 | streamer profile | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Streamer profile is durable, user-controlled structured context with defined fields, provenance, visibility and lifecycle; keep it separate from transient prompts and agent-role definitions. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | M0.2 must define fields, edit/delete/export, consent, access scope, retention and source provenance before storage or personalization is implemented. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define profile fields, source provenance, user edit/delete/export, consent and access controls before implementation | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Profile ownership remains OPEN; AI-016 specialist-agent roles are not a canonical user-profile model. | TBD M0.2; AI-016 is agent-role ownership only | AI/profile owner open | DEFER | 3.0 | QA-002/008 |
| H32.20 | long-term memory | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Long-term memory is a separate opt-in persistence/retrieval domain, with source attribution, correction, deletion, export, retention and per-site/user isolation. | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | M0.2 must define what may be stored, how it is retrieved/corrected/deleted, access/consent rules and tests for stale or conflicting memory before implementation. | Historical requirement retained; runtime not verified by this mapping | M0.2 must define memory sources, retention, correction/deletion/export, privacy boundaries and retrieval tests before implementation | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Memory must not be inferred from a profile or transient conversation; canonical owner and lifecycle remain OPEN for M0.2. | TBD M0.2; AI-016 is agent-role ownership only | AI/memory owner open | DEFER | 3.0 | QA-002/008 |
| H32.21 | preferences | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | User preferences are explicit user-controlled settings, distinct from inferred profile and long-term memory | Historical requirement retained; runtime not verified by this mapping | M0.2 must define preference schema, explicit vs inferred values, edit/reset/export and permission behavior before implementation | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | TBD M0.2; AI-016 is agent-role ownership only | AI/preferences owner open | DEFER | 3.0 | QA-002/008 |
| H32.22 | historical outcomes | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Historical outcomes are an evidence dataset with provenance/retention; distinct from live stream diagnostics | Historical requirement retained; runtime not verified by this mapping | M0.2 must define outcome schema, provenance, privacy/retention, correction/deletion and query access before implementation | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | TBD M0.2; AI-015 is diagnostics/summary only | AI/evaluation-data owner open | DEFER | 3.0 | QA-002/008 |
| H32.23 | experiment tracking | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Experiment tracking is a distinct experiment lifecycle, not stream diagnostics | Historical requirement retained; runtime not verified by this mapping | M0.2 must define experiment identity, hypothesis, variant, metrics, sample boundaries, consent and stop/rollback rules before implementation | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | TBD M0.2; AI-015 is diagnostics/summary only | AI/experiment owner open | DEFER | 3.0 | QA-002/008 |
| H32.24 | evaluation cycle | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Evaluation cycle is a distinct evaluation lifecycle using explicit metrics and evidence | Historical requirement retained; runtime not verified by this mapping | M0.2 must define evaluation datasets, scoring criteria, regression gates, human review and release criteria before implementation | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | TBD M0.2; AI-015 is diagnostics/summary only | AI/evaluation owner open | DEFER | 3.0 | QA-002/008 |
| H32.25 | feedback loop | Streamer Intelligence / Content Factory (C.6 + C.7 + C.16) | Stream Assistant + content/schedule insights + streamer profile | Post-1.0 Creator OS roadmap; individual items require a separate scoped phase | Feedback loop is distinct from evaluation and experiment tracking; user feedback and automated signals need separate provenance | Historical requirement retained; runtime not verified by this mapping | M0.2 must define feedback capture, user controls, provenance, abuse handling, retention and its effect on future behavior before implementation | UI-10; UI-11; UI-19; UI-21 | E-10; E-16 where diagnostics apply | AREA-13; AREA-17; AREA-21 | Post-1.0 Creator OS; provider availability, privacy and user controls must be scoped | TBD M0.2; AI-015 is diagnostics/summary only | AI/feedback owner open | DEFER | 3.0 | QA-002/008 |
| H33.00 | Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit | Automation / Event domain (C.16) | Any automation must follow a single lifecycle: trigger → evaluate condition → authorize action → execute → verify outcome → audit. Define deduplication, retry, cancellation and loop prevention as shared runtime contracts. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Before activation, test duplicate delivery, repeated triggers, denied actions, partial failure, retry exhaustion, cancellation and audit completeness; do not imply a queue/runtime exists from this architecture row. | Supplementary architecture contract; not a separate item in historical H33 checklist; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-001 is the shared contract; specific workflows remain separately owned by their canonical domains and are post-1.0 unless explicitly approved. | AUT-001 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.01 | scheduled automations | Automation / Event domain (C.16) | Scheduled automations must use an explicit timezone, recurrence/DST policy, next-run calculation, missed-run behavior and per-run identity; scheduling an automation is distinct from the existing creator streaming schedule. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Test timezone changes, DST gaps/overlaps, missed runs, duplicate delivery, pause/resume and permission revocation; no action may execute twice without an explicit idempotent contract. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-005 automation scheduling is not the canonical SCH schedule_items event/calendar feature. | AUT-005 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.02 | event automations | Automation / Event domain (C.16) | Event-driven automations must define event schema/version, trusted source, signature/verification where applicable, event time versus receipt time and deduplication key. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Test invalid/untrusted events, duplicates, out-of-order delivery, stale events and replay; reject or quarantine events that fail source/ownership validation. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-002 owns orchestration; provider/webhook event verification remains with the canonical integration/provider owner. | AUT-002 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.03 | content workflows | Automation orchestration + canonical Content domain (C.16) | Content workflows may orchestrate approved CNT/WEB actions but must not become a second content database or independently own publish/version lifecycle. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | M0.2 must specify each workflow's triggers/actions, content scope, role/site permissions, draft/publish boundary, approval and rollback behavior; test duplicate and failed execution. | Historical requirement retained; runtime not verified by this mapping | M0.2 must name exact content workflow, canonical data owner, permitted actions, approval/publish boundary and negative tests before implementation | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-014 is orchestration only; CNT/WEB remain canonical content and publication owners. | AUT-014 + content-domain owner TBD in M0.2 | AUT + CNT/WEB (open) | DEFER | 7.0 | QA-002/003 |
| H33.04 | media workflows | Automation orchestration + canonical Resource/Media domain | Media workflows may orchestrate RES-owned operations but must preserve R2 binary and D1 metadata ownership, media validation and object lifecycle semantics. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | M0.2 must define input asset scope, permissions, processing result, object cleanup, metadata update atomicity and retry behavior; test partial upload/processing failure. | Historical requirement retained; runtime not verified by this mapping | M0.2 must name exact media workflow, RES-owned resource lifecycle, file/permission boundary, failure cleanup and negative tests before implementation | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-014 is orchestration only; RES owns media metadata, validation and lifecycle. | AUT-014 + RES domain owner TBD in M0.2 | AUT + RES (open) | DEFER | 7.0 | QA-002/003 |
| H33.05 | stream workflows | Automation orchestration + canonical Stream/Integration domain | Stream workflows must declare supported provider, verified trigger source, connection/site binding, permission scope and whether an action is advisory or mutates external provider state. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Before implementation, define webhook/polling freshness, token lifecycle, duplicate event handling, external side-effect recovery and provider rate limits; test revoked/disconnected connections. | Historical requirement retained; runtime not verified by this mapping | M0.2 must identify each supported stream trigger/action, provider permission, site ownership, retry/idempotency and recovery behavior before implementation | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-014 does not own provider credentials or stream state; INT/LIV/OBS own their canonical contracts. | AUT-014 + stream-domain owner TBD in M0.2 | AUT + INT/LIV/OBS (open) | DEFER | 7.0 | QA-002/003 |
| H33.06 | notification workflows | Automation orchestration + canonical notification/delivery domain | Notification workflows must define channel, recipient, consent/preferences, template/locale, delivery status, deduplication and retry limits; notification attempts must not silently bypass user preferences. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | M0.2 must scope supported channels and data retention, test opted-out recipients, duplicate sends, provider failures, backoff and delivery-status accuracy. | Historical requirement retained; runtime not verified by this mapping | M0.2 must specify supported channels, recipient/consent rules, delivery status, deduplication, retry/backoff and failure reporting before implementation | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-014 is orchestration only; delivery provider, consent and recipient preferences require a canonical owner before activation. | AUT-014 + notification-domain owner TBD in M0.2 | AUT + delivery owner (open) | DEFER | 7.0 | QA-002/003 |
| H33.07 | retry policy | Automation / Event domain (C.16) | Retry policy must classify transient versus permanent failures, define bounded attempts/backoff/jitter and terminal/dead-letter behavior, and preserve the original action identity. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Test retry exhaustion, recovery after outage, non-retryable validation/permission failures and duplicate side-effect prevention; retries must not bypass fresh authorization. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-007 retry semantics are shared; external side effects require idempotency or explicit compensation. | AUT-007 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.08 | idempotency | Automation / Event domain (C.16) | Idempotency keys must be scoped to the actor/site/workflow/action and retained long enough to cover redelivery/retry; distinguish a repeated request from a legitimate new action. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Test concurrent duplicates, key collision/scope isolation, expiry, partial completion and retry after timeout; only report success when the original result is known or verified. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-006 must define durable deduplication and side-effect semantics; in-memory suppression alone is insufficient for durable workflows. | AUT-006 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.09 | failure handling | Automation / Event domain (C.16) | Failure handling must expose a stable run status and actionable reason, preserve correlation IDs and distinguish failed, retrying, cancelled, timed-out and outcome-unknown states. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Test failures at trigger, authorization, action, verification and audit stages; partial/external side effects must be surfaced for reconciliation rather than marked simply failed or rolled back. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-012 failure handling must not conceal unknown outcomes; recovery/compensation is explicit and separately tested. | AUT-012 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.10 | permissions | Automation / Event domain (C.16) | Automation permissions must be checked at trigger registration and again at execution against current actor, site, resource and action policy; credentials must be least-privilege and revocable. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Test denied actions, cross-site resources, revoked permissions/connections, stale approvals and privilege changes between schedule and execution; default to deny. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-004 coordinates with SEC-002/ADM-009; a stored workflow's past approval does not permanently authorize future execution. | AUT-004 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.11 | audit | Automation / Event domain (C.16) | Audit each run with trigger/source, workflow version, actor or service identity, action target, policy decision, timestamps, outcome/verification and retry/correlation IDs; redact secrets and sensitive payloads. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Test audit events for success, denial, cancellation, retry, partial failure and unknown outcome; define access/retention and ensure audit failure is handled explicitly for sensitive actions. | Historical requirement retained; runtime not verified by this mapping | M0.1 traceability only; phase-specific implementation DoD, tests and acceptance evidence required before marking complete | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | AUT-008 aligns with SEC-010 security audit; operational telemetry and content revision history remain separate. | AUT-008 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.12 | Queues/Durable Objects only when justified by a real background-task or realtime requirement | Automation / Event domain (C.16) | Use Queues or Durable Objects only after documenting a real asynchronous/realtime requirement, consistency needs, delivery guarantees, lifecycle and simpler alternatives; do not add infrastructure merely because automation is planned. | Post-1.0 unless a specific 1.0 workflow is explicitly approved | Record the requirement, expected concurrency/delivery semantics, idempotency strategy, failure recovery and cost/operational burden; prove the chosen primitive meets it with tests before adoption. | Architecture constraint retained; runtime not verified by this mapping | Document the concrete background/realtime need and evaluate simpler alternatives before introducing queues or Durable Objects | UI-21; UI-22 | E-14; E-16 | AREA-21; AREA-24 | OPS-011 is an architecture decision gate, not a mandate to introduce Queues or Durable Objects. | OPS-011 | OPS | DEFER | 7.0 | QA-002/003 |
| H34.00 | Continuous feature discovery is never permanently closed; repeat the review before every significant Editor/platform extension | Continuous product governance / benchmark process (C.18-C.20) | Before every significant Editor/platform extension, run a documented discovery review against the current MASTER, canonical domain owners, dependency map, security/accessibility/performance contracts and user outcome. This is recurring governance, not a feature that can be permanently marked complete. | Always-on governance rule; not a finite feature or permanently closable milestone | Evidence must name the proposed change, current owner/phase, existing coverage, gaps, dependencies, risk, test/acceptance plan and user validation; update the single MASTER before implementation. | Always-on governance rule; not a finite implementation-completion item | Evidence the review in each significant extension's engineering record and update MASTER when scope changes | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | QA-010 is a recurring review gate; a past review or a checklist row does not prove a new extension was reviewed. | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.01 | modern visual builder minták; | Visual Editor / builder architecture (C.9; C.18-C.20) | Benchmark modern visual-builder patterns against the canonical Editor v2 model, Canvas/Inspector interaction, responsive behavior, reusable components and public-render parity; benchmark findings do not authorize a second editor. | Review topic; the canonical owner and D roadmap determine the phase; not a standalone milestone | Record the specific pattern, source, applicable user outcome, compatibility/licensing concern, canonical destination and decision (adopt/adapt/reject/defer); validate against current architecture. | Historical review topic retained; implementation status must be verified through its canonical owner | M0.1: verify owner and roadmap boundary; record coverage gaps and evidence; do not infer implementation from a roadmap mention | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | This is a recurring architecture review topic, not a standalone implementation task; canonical Editor v2 remains the only visual editor. | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.02 | GrapesJS / Craft.js / Puck architekturális minták; | Visual Editor / architecture benchmark (C.9; C.18-C.20) | Compare GrapesJS, Craft.js and Puck only for relevant documented architectural patterns; do not copy implementations or introduce a competing framework without a scoped decision. | Benchmark topic; no independent phase or copied third-party implementation | Record source/version, licensing and maintenance review, model/action compatibility, accessibility/responsive implications, migration cost and explicit adopt/adapt/reject decision. | Historical benchmark topic retained; no claim that a particular architecture has been implemented | M0.1: preserve the benchmark requirement; map relevant findings to canonical owners and the D roadmap | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Benchmark evidence informs canonical Editor architecture; no dependency adoption or implementation is implied. | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.03 | új responsive/layout megoldások; | Theme/Presentation + Visual Editor + public renderer | Review responsive/layout requirements across breakpoints, inheritance, Canvas, Inspector and public rendering; distinguish a new user need from behavior already owned by the canonical responsive contract. | Review topic; scope is determined by the existing responsive/layout owners and D roadmap | Map each finding to existing requirements/tests and identify only uncovered behavior for a new scoped item; include desktop/tablet/mobile and interaction evidence as applicable. | Historical review topic retained; implementation status must be verified through canonical owners | M0.1: cross-reference existing responsive requirements; identify gaps without creating duplicate tasks | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | Use the canonical responsive/layout owners; avoid duplicate requirements or treating one viewport test as complete responsive acceptance. | EDT-024 | EDT | EXPAND | all phases | QA-010 |
| H34.04 | accessibility; | Accessibility domain (H24) + Editor + public renderer | Review accessibility across the Editor workflow and published output, including keyboard/focus, semantics, labels, zoom/reduced motion and assistive-technology interaction; automated scans are not certification. | Review topic; follow the canonical accessibility scope and D roadmap | Map findings to H24 and canonical EDT/WEB owners, record manual and automated tests, and preserve unresolved issues with severity and acceptance criteria. | Historical review topic retained; H24 coverage does not by itself prove runtime compliance | M0.1: link to H24 and record any uncovered requirement; implementation needs its own tests and acceptance evidence | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | H24 is the requirement source; QA-005 is an evidence anchor, not an implementation owner or proof of compliance. | RES-007 + EDT-037; QA-005 remains test/review anchor only | RES/EDT (QA separate) | EXPAND | all phases | QA-010 |
| H34.05 | performance; | Performance/Production domain (H30) | Review performance across public rendering, Editor Canvas/tree/Inspector, APIs, media delivery and persistence using explicit workload and device/network profiles. | Review topic; follow the canonical performance scope and D roadmap | Map findings to H30, record measured baseline, sample/profile, owner, threshold decision and regression test; never infer a pass from a generic performance checklist. | Historical review topic retained; roadmap presence is not a performance test result | M0.1: map to H30 and record gaps; phase-specific performance thresholds and test evidence remain required | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | OPS-008 supplies operational telemetry while canonical feature owners remain responsible for behavior and acceptance. | OPS-008 | OPS | EXPAND | all phases | QA-010 |
| H34.06 | reusable components; | Component Registry / Symbols / Reusable Components | Review reusable components and Symbols without conflating copy/fork templates with shared definitions/instances; changes must preserve canonical component identity, ownership and compatibility rules. | Review topic; canonical Component Registry ownership and D roadmap determine the phase | Record whether a finding concerns template duplication, shared Symbol updates, registry metadata, versioning or instance override; map it to the relevant DSN/EDT contract and migration tests. | Historical review topic retained; implementation status must be verified through the canonical component owner | M0.1: cross-reference component and Symbol contracts; record gaps without adding duplicate implementation items | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | DSN-012 is the current component-registry anchor; no parallel registry or alternate Page Model may be created. | DSN-012 | DSN | EXPAND | all phases | QA-010 |
| H34.07 | design systems; | Theme/Design System / Design Tokens | Review design-system and theme evolution through canonical tokens, theme configuration/revisions and published rendering; avoid duplicated token stores or uncontrolled per-component styling. | Review topic; canonical Theme/Design System ownership and D roadmap determine the phase | Record token ownership, inheritance/override rules, migration impact, contrast/accessibility implications and Editor/public parity tests for any proposed change. | Historical review topic retained; a listed design-system capability is not proof of completion | M0.1: link to the canonical Theme/Design System scope; record gaps and acceptance evidence still needed | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | DSN owns the design-system contract; listed theme capabilities are not evidence that every Theme Editor feature is implemented. | DSN-001 | DSN | EXPAND | all phases | QA-010 |
| H34.08 | collaboration/conflict; | Collaboration / concurrency / approvals / conflict handling | Review collaboration as distinct concerns: slug/name conflicts, concurrent document editing, optimistic revision conflicts, multi-user presence, approvals and shared ownership; one does not prove the others. | Review topic; phase depends on the canonical collaboration scope in the D roadmap | Identify the exact collaboration capability, concurrency model, conflict resolution, permissions, data lifecycle and deterministic tests before scoping implementation. | Historical review topic retained; search matches do not prove full collaboration or concurrency support | M0.1: identify the canonical owner and exact coverage; any uncovered capability requires explicit scoping | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | TEAM-004 and EDT-029 are candidate anchors; exact ownership and supported collaboration scope must be verified in M0.2. | TEAM-004, EDT-029 | TEAM/EDT | EXPAND | all phases | QA-010 |
| H34.09 | backup/recovery; | Backup/Restore domain (H29) + relevant Admin recovery flows | Review backup, restore, import/export and rollback against H29 without creating parallel recovery mechanisms; confirm the claimed recovery scope includes the relevant D1 records, R2 objects and references. | Review topic; follow the canonical backup/recovery scope and D roadmap | Map each gap to backup/restore contracts and require isolated restore/integrity evidence for any recoverability claim. | Historical review topic retained; listed requirements do not prove a successful restore | M0.1: link to H29 and record gaps; recovery acceptance requires phase-specific verification | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | OPS-005 is the backup/restore anchor; a listed requirement or created archive is not proof of successful restoration. | OPS-005 | OPS | EXPAND | all phases | QA-010 |
| H34.10 | AI action safety; | Security/permissions (H28) + AI Editor (H31) + Automation (H33) | Review AI and automation changes against H28/H31/H33: canonical actions, least privilege, fresh authorization, validation, reviewed diff, approval, execution verification, idempotency and audit. | Review topic; follow the canonical security and AI/automation scope in the D roadmap | Record threat scenarios and negative tests for bypass, stale approval, cross-site access, prompt/event injection, duplicate execution and partial external side effects. | Historical review topic retained; architecture text alone does not prove safe runtime behavior | M0.1: link existing security/AI/automation contracts; gaps require scoped security tests and acceptance evidence | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | AI-006 is only one authorization anchor; the full AI/automation pipeline must retain each canonical security and lifecycle boundary. | AI-006 | AI | EXPAND | all phases | QA-010 |
| H34.11 | stream/content intelligence. | Streamer Intelligence / Content Factory (H32; C.6/C.7/C.16) | Review stream/content intelligence against H32 and canonical ANL/INT/SCH/RES owners; identify source provenance, provider availability, freshness, consent, retention and the boundary between recommendation and external action. | Review topic; individual capabilities follow their canonical phase in the D roadmap | Record supported source/platform, measurable output, limitations, user controls, deletion path and tests; keep post-1.0 features staged unless a formal roadmap gate changes them. | Historical review topic retained; no implication that post-1.0 intelligence features are implemented | M0.1: link existing intelligence/content requirements; record gaps without creating parallel feature rows | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | AI-015 alone does not establish all intelligence capabilities; each H32 capability needs its own owner and phase. | AI-015 | AI | EXPAND | all phases | QA-010 |
| H34.12 | azonosítás; | Continuous product governance / benchmark process (C.18-C.20) | Identify the candidate extension and its user/problem statement; search existing MASTER requirements and canonical owners before proposing a new row. | Identification step under H34.00; not an independent feature or milestone | Record source of request, affected users/surfaces, existing coverage and duplicate/overlap decision; unresolved historical requirements remain open rather than being silently dropped. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | This is step 1 of the recurring H34.00 process, not a product capability or a completion milestone. | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.13 | cél és felhasználási eset; | Continuous product governance / benchmark process (C.18-C.20) | Define the intended user outcome, use case, primary workflow and measurable acceptance result before choosing implementation details. | Goal/use-case definition step under H34.00; not an independent feature or milestone | Record primary/edge/error states, non-goals and user-validation method; reject vague feature labels that cannot be tested. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | This is step 2 of H34.00; user outcome and acceptance belong in the canonical MASTER entry. | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.14 | függőségek; | Continuous product governance / benchmark process (C.18-C.20) | Map upstream prerequisites, downstream consumers, data ownership, security/privacy obligations and cross-surface effects before assigning implementation order. | Dependency mapping step under H34.00; not an independent feature or milestone | Record each dependency's canonical owner and readiness condition; flag circular dependencies, shared-resource conflicts and migration needs explicitly. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | This is step 3 of H34.00; dependency mapping is not a substitute for domain-owner approval. | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.15 | Page Model/adatmodell; | Canonical Page Model/data-model owner for the proposed extension | Decide whether the extension reuses the canonical Page Model, requires a backward-compatible schema evolution or needs a separately justified domain model; avoid duplicating page/content data. | Page Model/data-model review step under H34.00; not an independent feature or milestone | Record entities, identity, ownership/site scope, validation, versioning, persistence and migration/rollback impact before implementation. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | EDT-001 is the Page Model anchor; domain data remains with its canonical domain owner. | EDT-001 | EDT | EXPAND | all phases | QA-010 |
| H34.16 | Command/Action; | Canonical Command/Action owner for the proposed extension | Specify typed canonical commands/actions, valid targets, preconditions, authorization, validation, side effects, idempotency and failure semantics for any mutation. | Command/Action contract review step under H34.00; not an independent feature or milestone | Record the action contract and negative tests; UI, AI and automation must call the same permitted mutation boundary rather than direct-write around it. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | EDT-003 is the Editor action anchor; cross-domain actions require the canonical owning domain's contract too. | EDT-003 | EDT | EXPAND | all phases | QA-010 |
| H34.17 | Inspector/Canvas/UI; | Canonical Editor/UI owner for the proposed extension | Specify the user-facing surface and its state model, selection/targeting, keyboard/focus behavior, responsive behavior, loading/error/empty states and public-preview relationship. | Inspector/Canvas/UI review step under H34.00; not an independent feature or milestone | Map UI responsibilities to Canvas/Inspector/Admin/public surfaces and test each affected surface; avoid putting every capability into one overloaded screen. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | EDT-021 is an Editor UI anchor, not blanket ownership of all Admin/public UI. | EDT-021 | EDT | EXPAND | all phases | QA-010 |
| H34.18 | persistence; | Canonical persistence/data owner for the proposed extension | Define persistence, revision/consistency model, transaction boundary, ownership enforcement, cache invalidation and recovery semantics for the extension. | Persistence review step under H34.00; not an independent feature or milestone | Test successful and rejected writes, concurrency/conflict, partial failure, migration and restore behavior; separate structured D1 data from R2 binary assets where applicable. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | EDT-028 is an Editor persistence anchor; actual data persistence belongs to the canonical domain owner. | EDT-028 | EDT | EXPAND | all phases | QA-010 |
| H34.19 | teszt; | Canonical test/QA owner for the proposed extension | Define automated and manual tests from the requirement, including negative/permission cases, browser/device states, failure/recovery and production evidence when relevant. | Test-planning and test-evidence step under H34.00; not an independent feature or milestone | Each acceptance criterion must map to a reproducible test or explicitly recorded manual review; identify owner, fixture, expected result and evidence location. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | QA-002 is a test-process anchor, not proof that the feature passed; security/accessibility/visual gates retain their specific evidence requirements. | QA-002 | QA | EXPAND | all phases | QA-010 |
| H34.20 | MASTER-be felvétel; | MASTER roadmap governance (C.18-C.20) | Add the approved extension to the single MASTER before implementation with stable ID, canonical owner, phase, dependencies, scope/non-goals, status, DoD, tests and historical-source traceability. | MASTER recording step under H34.00; not an independent feature or milestone | Check for duplicate IDs/rows and verify that the new item does not contradict existing canonical contracts or silently remove a historical capability. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | MASTER remains the only source of truth; do not create a competing roadmap or external feature list as an alternative authority. | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.21 | implementáció; | Canonical implementation owner approved by the D roadmap | Implement only after scope, owner, dependencies, acceptance criteria and required gates are approved; use the existing canonical domain and shared contracts. | Implementation step for an approved, separately scoped extension; not a standalone milestone | Implementation evidence must include changed files, tests, migrations/deployment evidence where applicable, failure-path validation and a truthful status update in MASTER. | Historical procedure step retained; actual implementation is governed by its separately approved canonical point | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | This is a gated process step, not a pre-authorized feature or permission to bypass the currently active P0.2 audit freeze. | QA-010 governance step; actual implementation owner is the approved canonical domain/feature | QA governance + domain owner (per extension) | EXPAND | all phases | QA-010 |
| H34.22 | felhasználói validáció. | User acceptance / product validation for the proposed extension | Validate the completed workflow with the intended user against the approved use case, including usability, expected outcomes, error recovery and unmet needs. | User-validation step under H34.00; not an independent feature or milestone | Record the tested version, scenario, result, defects/follow-up and explicit acceptance or rejection; user acceptance complements rather than replaces automated/security/accessibility tests. | Historical procedure step retained; process step, not a product feature | M0.1: preserve traceability to H34.00; evidence belongs to the relevant extension's canonical engineering record; do not mark this row as a completed product capability | MASTER governance; UI-22 only for operational help | — (not an Editor feature) | AREA-24; cross-cutting governance | QA-009 anchors user validation; the result must be tied to the actual implemented version and cannot be claimed before review. | QA-009 | QA | EXPAND | all phases | QA-010 |

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
- **Történeti snapshot (2026-10-13):** funkciójegyzék 359 stabil ID a §24.1–24.18 tartományban; a LOC-005/LOC-006 bővítés utáni registry- és crosswalk-hivatkozások akkor még újraellenőrzésre vártak. A későbbi, aktuális strukturális ellenőrzést a §41.3.75 rögzíti (362/362).
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

#### 41.3.4. Feature-ID provenance — kétirányú nyomkövetés (2026-10-14 baseline 359 → current 360)

A §24.1–§24.18 registry korábbi 359-ID baseline-ja 2026-10-14-én az EDT-043 (advanced Rich Text), majd az EDT-044 (per-user Editor workspace preferences) külön nyomkövetett planned capability-kkel 361-re bővült. A 361 stabil ID esetében két külön ellenőrzés szükséges:

1. **Régi forrás → új funkció:** minden történeti bullethez tartozzon egy vagy több pontos ID, vagy indokolt explicit disposition.
2. **Új funkció → régi forrás/indoklás:** minden ID-hoz tartozzon konkrét eredeti forrás vagy dokumentált új követelmény/architekturális indok. A „modern platformhoz kell” önmagában nem elég részletes indok.
3. Minden ID kapjon canonical owner/domain, admin/public/editor surface, phase/lifecycle, permission boundary, dependency ID-k, pozitív és negatív tesztek, elfogadási feltételek és bizonyítékmezőket.
4. A folyamat-/governance-ID-ket külön kell választani a felhasználó által elérhető termékfunkcióktól; ne legyenek tévesen kész termékfunkcióként számolva.
5. Az automatikus ellenőrzés csak strukturális hibát (hiányzó/duplikált ID, feloldhatatlan hivatkozás) jelezhet. A szemantikai helyességhez minden sor emberi tartalmi ellenőrzése szükséges.

**P0.2 zárási feltétel:** a C.23 összes bulletje és nested bulletje, F.1–F.13 összes belső tétele, a 00/A és 00.9–00.9.6.B eredeti forrásai, mind a jelenlegi registry-ID kétirányú nyomkövetése (jelenleg 362) és az ID-szintű contractok ellenőrzöttek; nincs megmagyarázatlan árva követelmény/ID, a döntések és phase-besorolások indokoltak, és a dokumentációs szerkezeti ellenőrzés megismételve. A P0.2 csak ezután lehet PASS; ez továbbra sem jelenti a runtime funkciók készültségét.


### 41.3.5. Tételes, egyedi forrás-bullet ledger — első kör

**Forrásverzió:** docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md (blob adc958b61e9c09d246989626c92066489d1d72f4). Az alábbi táblák a C.23 és F.1–F.13 alatti felsorolásokat egyenként rögzítik, stabil forráskulccsal és archív sorszámmal. A teljes forrásszöveg megőrzése cél; a forrás sorainak felvétele NEM jelenti a leképezés, a jogosultság, a teszt vagy az implementáció igazolását.

- C.23: 210 felsorolási pont külön rögzítve.
- F.1–F.13: 100 felsorolási pont külön rögzítve.
- Minden sor státusza OPEN marad a tételes szemantikai ellenőrzés és bizonyítékig. A nem-TBD mappingek is csak jelölt (candidate) lefedettséget jelentenek: a canonical ID létezését és a várható kapcsolatot azonosítják, de nem végleges megfeleltetések, nem döntések és nem PASS-ok. Véglegesítés előtt a teljes eredeti tételt össze kell vetni a registryvel, a tényleges UI/API/runtime tulajdonossal és a teszt/acceptance bizonyítékkal; a hiányzó vagy túl tág ID-ket javítani kell.
- A C.23.2–C.23.6.3 tartományban 50 sorhoz készült első jelölt mapping és konkrét owner/phase/permission/dependency/test/acceptance javaslat. Ezek mind OPEN review állapotúak, nem végleges crosswalkok. A sorok az archive sorhivatkozását is megőrzik; archívum átírása esetén a forrás SHA és sorszámok újraellenőrzendők.

#### C.23.1–C.23.22 — minden belső bullet

| Source key | Archive line | Exact source bullet | Canonical feature mapping | Decision / owner / phase / permission / dependency / tests / acceptance |
|---|---:|---|---|---|
| C.23.1-01 | 2369 | - **Webflow Designer:** components, variables, cross-site libraries, breakpoint canvas. | QA-010 (benchmark review); candidate coverage EDT-024/025, DSN-012–015; shared/cross-site scope additionally gated by SEC-003, TEAM-003, MKT-001–005 | OPEN — QA owner for benchmark; Design System owner for component/variable contract; 1.0 local responsive/component baseline, cross-site/shared library later only after tenant/role/license/provenance contract; verify source URLs/licensing and distinguish local component reuse from cross-site marketplace sharing; QA-002/003/004/007; acceptance: benchmark decision recorded, cross-site access denied without explicit entitlement, no second component registry |
| C.23.1-02 | 2372 | - **Wix Studio:** custom breakpoints, responsive behavior, design libraries, saved sections/assets, design kits, wireframes és gyors hozzáadás. | QA-010 (benchmark review); candidate coverage EDT-015/024/025, DSN-008–015, RES-001/004/007–010; shared library scope gated by SEC-003 and TEAM-003 | OPEN — QA owner for benchmark; Editor Library + Design System + Resource owners; site-local template/asset baseline 1.0, cross-site/user-shared libraries phased later; depends on canonical asset IDs, versioned template metadata and role/site ownership; QA-002/003/004/007; acceptance: wireframe/design-kit/template/asset are classified as distinct resource types, import/use preserves references, cross-site reads/writes are denied absent explicit permission |
| C.23.1-03 | 2376 | - **Elementor:** központi Site Settings, global colors/fonts, theme styles, layout defaults, reusable website kits és responsive containers. | QA-010 (benchmark review); candidate coverage SET-001–003, DSN-001–011, DSN-012–018, EDT-016/024/025, RES-001/004/007/009 | OPEN — QA benchmark owner; Settings + Design System + Template/Resource owners; 1.0 site-local settings/tokens and responsive container contract only where canonical schemas support them; website-kit import/reuse is gated by versioned template/resource contract; depends on explicit global-token vs theme-style vs per-node override precedence and migration policy; QA-002/003/004/006/007; acceptance: token edits affect only declared consumers, local overrides are preserved or explicitly reset, breakpoint behavior is deterministic, and kit apply/replace never silently overwrites page content |
| C.23.1-04 | 2381 | - **WordPress Site Editor / Gutenberg:** full-site editing, templates/template parts, patterns, synced vs. unsynced patterns, style variations, global styles, command palette, list view, zoom-out view és export. | QA-010 (benchmark review); candidate coverage WEB-009/010, EDT-007/012/015/038, DSN-001–018; versioned export boundary OPS-005, SEC-008 | OPEN — QA owner for benchmark; Editor + Design System + export/recovery owners; distinguish synced component propagation from copied template/pattern content and global styles from local overrides; export must be versioned, validated and secret-free; depends on canonical node/template registry and import/export contract; QA-002/003/004/007; acceptance: list/layer/zoom/command actions resolve to canonical handlers, synced/unsynced behavior is explicit, and export preserves references without secrets |
| C.23.1-05 | 2386 | - **Framer:** visual canvas, reusable responsive components, CMS, breakpoint editing, localization, SEO, redirects és publishing workflow. | QA-010 (benchmark review); candidate coverage EDT-007–025, DSN-012–018, DYN-001–008, LOC-001–004, SEO-001–005, WEB-004–013 | OPEN — QA owner for benchmark; Editor, Dynamic Content, Localization, SEO and Publish owners retain separate canonical domains; phase each capability by its own domain gate rather than treating the benchmark as a bundled 1.0 commitment; depends on locale-aware content/URL policy, canonical redirects/SEO metadata and transactional publish/revision path; QA-002/003/004/006/008; acceptance: each capability has a separate reuse/adapt/defer decision and no parallel CMS/locale/SEO/publish source of truth |
| C.23.2-01 | 2414 | - stabil ID, név, leírás, kategória, címkék, preview/thumbnail, version és owner/site scope; | DSN-008–DSN-015, RES-001/004/007, SEC-003 | OPEN — Design System/Resource registry owners; 1.0 baseline for site-local templates and asset metadata, shared library later; verify stable ID/version/site owner and authorization model; dependency DSN/RES schema; QA-002/003/004; acceptance: schema contract and cross-site negative tests |
| C.23.2-02 | 2415 | - keresés, szűrés, rendezés, kedvencek, legutóbb használt és kategóriák; | DSN-008–DSN-018, EDT-015, RES-005/010; per-user library favorites/recent-use scope requires explicit contract review against EDT-044 without conflating workspace-panel favorites | OPEN — Design System + Editor Library owner; phased by library type; permission inherits site/resource scope; depends on canonical registry and metadata; QA-002/003/004; acceptance: search/filter/sort and empty/error states are deterministic; favorite/recent-use metadata is scoped to the correct user/site and never mutates the Page Model or grants resource access; workspace-panel favorites and library-item favorites remain semantically distinct unless a shared contract is explicitly proven |
| C.23.2-03 | 2416 | - alkalmazás előtt preview; alkalmazás után Undo; megerősítés romboló/globalis művelet előtt; | EDT-005, EDT-032, EDT-039, DSN-004 | OPEN — Editor command/history + Design System owner; 1.0 safety gate for every mutating preset action; editor permission required; depends on a deterministic dry-run/diff and one atomic history command; QA-002/003/004/006; acceptance: preview leaves Page Model and persistence unchanged, confirm/cancel are explicit for destructive/global scope, one Undo reverses the whole apply, and failed apply leaves no partial mutation |
| C.23.2-04 | 2417 | - **Apply / Replace / Merge / Reset / Save as new / Duplicate / Rename / Archive / Restore** művelet, ahol a preset típusa alapján értelmezhető; | EDT-005, EDT-011, DSN-004, DSN-008–DSN-015, RES-009 | OPEN — Editor + Design System + Resource owners; publish an operation-by-resource-type capability matrix before UI exposure; permissions are checked server-side on source and destination; depends on typed lifecycle states, conflict policy, atomic command/history and reference validation; QA-002/003/004/006; acceptance: unsupported actions are absent/disabled with reason, duplicate creates new IDs, restore revalidates ownership and references, archive is reversible, and reset/replace scope is previewed before mutation |
| C.23.2-05 | 2418 | - a felhasználói tartalom és resource reference-ek megtartásának világos szabálya; | EDT-001/002, DSN-012–DSN-014, RES-001/008 | OPEN — Page Model + Design System + Resource owners; 1.0 data-integrity gate; edit permission plus source-resource visibility required; depends on canonical node/resource IDs, binding/reference inventory and explicit merge-conflict policy; QA-002/003/004/006; acceptance: preserve/replace/delete behavior is documented per content/reference type, inaccessible references are rejected or safely remapped, and apply/merge/replace cannot silently drop user data or create dangling/cross-site references |
| C.23.2-06 | 2419 | - preset frissítésekor meglévő instance-ok változásának explicit jelzése; nincs rejtett, váratlan tömeges átírás; | DSN-003/004/012–014, EDT-027–031 | OPEN — Design System/Component Registry owner; instance propagation is deferred until master/instance, detach and override semantics are canonical; edit permission required; depends on versioned definition, instance reference and consumer inventory; QA-002/003/004/006; acceptance: update preview lists affected instances and override conflicts, no instance changes before confirmation, detached instances remain detached, and rollback restores all affected instances atomically |
| C.23.2-07 | 2420 | - gyári, site-local, user-library és későbbi shared-library scope megkülönböztetése; | DSN-008–DSN-018, SEC-003, TEAM-001/002 | OPEN — Design System + tenancy/security owner; factory and site-local scopes only where their schemas and policies are explicit; user/shared scope is later-phase and separately gated; depends on immutable owner/scope fields and server-enforced authorization on list/read/write/duplicate/restore/export; QA-003/008; acceptance: each scope has a documented lifecycle and owner, cross-site enumeration and direct-ID access are denied without entitlement, and client-supplied scope cannot override server ownership |
| C.23.2-08 | 2421 | - schema/version migráció és érvénytelen preset hibakezelése; | DSN-014, EDT-001/042, QA-002/003/006 | OPEN — Design System/Resource + validation owners; versioned schema and migration registry required before import/export or restore; mutation permission required; depends on explicit supported-version window and rollback strategy; QA-002/003/006; acceptance: migrations are deterministic/idempotent, unknown future versions are rejected safely, invalid input returns actionable errors, and failed validation/migration leaves stored and live state unchanged |
| C.23.2-09 | 2422 | - jogosultság, audit, export/backup és törlés előtti használatellenőrzés. | SEC-001–SEC-011, OPS-005, DSN-015, RES-008/009 | OPEN — Security/Operations + Resource/Design System owners; authorization/audit and recoverability contract is a prerequisite for destructive lifecycle operations and any shared scope; depends on server-side policy, append-only audit evidence, complete usage/reference map and versioned secret-free backup/export; QA-003/006/008; acceptance: denied actions leave no side effects, audit records actor/action/resource/outcome, referenced resources cannot be hard-deleted without an explicit migration/replacement plan, and backup restore is validated |
| C.23.3-01 | 2428 | - Canvas automatikus szélesség/magasság, content-aware minimum size, hosszú oldal kezelése, scroll/zoom közbeni stabil geometria. | EDT-007/009, EDT-023–025, QA-002/004/005 | OPEN — Editor Canvas owner; 1.0 geometry gate; editor role required; depends on one canonical geometry/viewport calculation and content measurement invalidation; QA-002/004/005; acceptance: long content, min-size, zoom, scroll extent, font/image load and viewport resize recalculate bounds without clipping, drift or unreachable content; empty and very tall pages are covered |
| C.23.3-02 | 2429 | - Zoom in/out, fit page, fit selection, 100%, pan/space-drag, minimap vagy overview, canvas reset. | EDT-007, QA-002/004/005 | OPEN — Editor Canvas owner; core zoom/pan/fit/reset are 1.0 candidates; minimap/overview only if justified by canvas scale and performance; editor role required; depends on explicit viewport transform and coordinate conversion shared by render, hit-testing and pointer gestures; QA-002/004/005; acceptance: each control has defined bounds/anchor behavior, selection remains stable, fit-selection handles empty/multi-selection, and zoom/pan never changes persisted page geometry |
| C.23.3-03 | 2430 | - Rács, baseline/grid, rulers, guides, smart guides, snapping to grid/edges/centers/spacing, snap toggle és snap threshold. | EDT-010, EDT-009, EDT-021/022 | OPEN — Editor Canvas + Inspector owners; basic grid/snap is separate from rulers, baseline grid and smart guides, each requiring an explicit phase decision; editor role required; depends on canonical transform math and device-pixel/zoom normalization; QA-002/004/005; acceptance: toggle and threshold are deterministic across zoom levels, guides do not become persisted content unless explicitly saved, keyboard nudge has declared snap behavior, and snap never alters unrelated properties |
| C.23.3-04 | 2431 | - Kijelölőkeret, resize handles, rotation handle ahol támogatott, bounding box, anchor/origin és transform preview. | EDT-006–010, EDT-021/022 | OPEN — Editor Canvas + Page Model owners; rotation remains unsupported unless node schema, renderer and serializer all represent it; editor role required; depends on transform constraints, origin semantics and pointer-capture lifecycle; QA-002/004/005; acceptance: preview matches committed geometry, cancel/escape restores the exact prior state, minimum/maximum constraints are enforced, and unsupported rotation is not shown as an actionable handle |
| C.23.3-05 | 2432 | - Egyszeres/többszörös kijelölés, Shift/Ctrl módosítás, marquee selection, parent/child kiválasztás, breadcrumb és „select parent/child”. | EDT-006, EDT-012/013, EDT-038 | OPEN — Editor selection owner; 1.0 selection baseline; editor role required; depends on stable node IDs, hierarchy and a shared selection state model; QA-002/004/005; acceptance: Canvas/Layers/Inspector stay synchronized, keyboard modifiers follow documented platform behavior, marquee excludes locked/non-selectable nodes per policy, and parent/child navigation cannot leave stale inspector targets |
| C.23.3-06 | 2433 | - Drag-and-drop insert, reorder, reparent, drop-target preview, insertion marker és invalid-drop tiltás. | EDT-008, EDT-011, EDT-002, EDT-016 | OPEN — Editor command + Page Model owners; 1.0 insert/reorder only for schema-permitted node pairs; editor role required on target page; depends on allowed-child matrix, cycle detection and one atomic hierarchy command; QA-002/003/004/005; acceptance: preview and committed destination agree, invalid/circular/cross-page drops are rejected before mutation, cancellation leaves order and selection unchanged, and undo restores parent/order/reference state exactly |
| C.23.3-07 | 2434 | - Billentyűzetes mozgatás, finom/nagy lépés, duplikálás, delete, undo/redo, copy/paste, duplicate, nudge, bring forward/back, bring to front/back. | EDT-005, EDT-011, EDT-038/039 | OPEN — Editor command/history owner; 1.0 core actions only where the node/property supports the operation; editor role required; depends on one transactional command registry and deterministic ordering semantics; QA-002/004/005; acceptance: keyboard/menu/shortcut invoke the same command, duplicate regenerates IDs and references safely, delete checks dependencies, z-order actions are unavailable for non-layered layouts, and undo/redo restores exact data/order/selection |
| C.23.3-08 | 2435 | - Copy/paste style, paste properties, reset property, reset to inherited, clear override. | EDT-021/022/024, DSN-001–DSN-004 | OPEN — Inspector + Design System owners; property actions are schema- and target-compatible; editor role required; depends on canonical property registry, token/inheritance precedence and clipboard schema; QA-002/004/006; acceptance: incompatible values are rejected, reset-to-default differs from reset-to-inherited, clear-override reveals the declared inherited value, and paste changes only selected compatible properties with undo coverage |
| C.23.3-09 | 2436 | - Kontextusmenü, command palette/quick actions, kereshető Add panel, recent/favorite elements, parancsok billentyűparancsai. | EDT-015, EDT-039, EDT-037 | OPEN — Editor interaction owner; contextual actions, command palette and Add catalog are separate surfaces over one canonical action/element registry; editor role required; depends on stable command IDs, discoverability metadata and keyboard focus model; QA-002/004/005; acceptance: every visible action has one handler and permission check, shortcuts are conflict-free and discoverable, Add results reflect allowed node types, and favorites/recent metadata cannot grant capabilities or mutate the Page Model |
| C.23.3-10 | 2437 | - Drag/resize alatt élő Page Model/command állapot, pointer-capture, cancel/escape, pointer loss, scroll-container és zoom-korrekció kezelése. | EDT-003/004, EDT-007–009, EDT-027/030/042 | OPEN — Editor runtime + command owners; 1.0 data-loss/geometry gate; editor role required; depends on explicit gesture state machine, pointer capture/release and atomic commit boundary; QA-002/004/005; acceptance: pointer cancel/loss, Escape, blur, scroll, zoom and resize release all transient resources, commit at most once, and never persist partial geometry or leave the editor stuck |
| C.23.3-11 | 2438 | - Vászon overlay és editor selection decoration nem kerülhet a public renderer outputjába. | EDT-034, WEB-032, QA-002 | OPEN — Public renderer + Editor owners; 1.0 isolation/security gate; editor decorations are a separate layer and never part of the serialized public Page Model; QA-002/003/004/008; acceptance: public DOM, HTML snapshot, accessibility tree and published output contain no selection handles, editor controls, hidden editor metadata or privileged action hooks; test both preview and production render paths |
| C.23.3-12 | 2439 | - Canvas render és selection hit-testing ne a DOM-ot tegye source of truth-szá; a canonical Page Model a mérvadó. | EDT-001–004, EDT-034 | OPEN — Page Model + Editor runtime owners; architectural invariant for all phases; editor mutation permission required; depends on canonical schema, deterministic renderer mapping and command pipeline; QA-002/004/006; acceptance: DOM is only a projection/hit-test surface, every mutation goes through validated commands, serialization derives from the Page Model, and rerender/reload produces equivalent model state |
| C.23.4-01 | 2443 | - Page → template/section → container/layout → element hierarchia, stabil node ID-val. | EDT-001/002, EDT-016, DSN-008–DSN-012 | OPEN — Page Model + Design System owners; 1.0 hierarchy only for canonical node types; editor role required; depends on typed node schema, stable IDs, parent-child rules and template-instance boundary; QA-002/004/006; acceptance: save/reload preserves IDs, parent/order and resource bindings; template/section definitions are not silently copied into page content or confused with live instances |
| C.23.4-02 | 2444 | - Layers fa: keresés, név, ikon/típus, collapse/expand, drag reorder, reparent, rename, duplicate, delete, hide, lock, unlock, multi-select. | EDT-012–015, EDT-011, EDT-006 | OPEN — Editor Layers owner; 1.0 core actions only where valid for node type; editor role required; depends on canonical node tree, shared selection and atomic command history; QA-002/004/005; acceptance: search/filter does not mutate tree, collapse is view state, reorder/reparent obeys allowed-child rules, duplicate regenerates IDs, and rename/hide/lock persist with exact undo/redo |
| C.23.4-03 | 2445 | - Layer visibility és lock állapota külön kezelendő a public visibility/conditional rendering szabálytól. | EDT-014, EDT-026, WEB-031 | OPEN — Editor state + public renderer owners; editor hide and lock are editor-only metadata; breakpoint visibility and public conditional rendering are separate persisted concepts; QA-002/003/004/008; acceptance: hide/lock never changes public output, responsive hiding applies only to declared breakpoints, and public conditions are serialized/evaluated only by the public rendering contract |
| C.23.4-04 | 2446 | - Csoportosítás/felbontás; wrapper létrehozása; groupból kiemelés; több node együttes igazítása és elosztása. | EDT-002/004/011/016, EDT-010 | OPEN — Page Model + command owners; grouping/wrapping only for schema-supported nodes; editor role required; depends on atomic subtree rewrite and layout-specific alignment semantics; QA-002/004/005; acceptance: group/ungroup preserves child order, bindings and effective layout; align/distribute applies only to compatible selections, and one undo restores exact hierarchy and geometry |
| C.23.4-05 | 2447 | - Parent/child breadcrumb; hierarchy outline; node típus és megengedett gyermekek; invalid nesting és circular parent tiltása. | EDT-001/002, EDT-012/013/016 | OPEN — Page Model + Layers owners; 1.0 hierarchy validation; depends on canonical node-type registry and allowed-child matrix shared by Canvas, Layers, paste/import and server validation; QA-002/003/004/006; acceptance: all mutation entry points reject invalid parent-child pairs and cycles before state change, and breadcrumbs/outline match the canonical model after undo/redo and reload |
| C.23.4-06 | 2448 | - Üres container, section és page drop-target; üres állapotból elem hozzáadása. | EDT-008, EDT-015/016, EDT-041 | OPEN — Canvas + Editor Library owners; 1.0 empty-state baseline for supported containers; editor role required; depends on allowed-child matrix and canonical insert command; QA-002/004/005; acceptance: empty page/container exposes only valid drop targets, keyboard and pointer users can add a first child, and empty/loading/error/permission-denied states are distinct and recoverable |
| C.23.4-07 | 2449 | - Copy/cut/paste azonos oldalon és később oldalak között, ID-regenerálással és resource/binding reference-ek biztonságos rendezésével. | EDT-002/011/038, RES-001/008, EDT-039 | OPEN — Page Model + Resource owners; same-page copy/paste is a 1.0 candidate; cross-page transfer remains gated; depends on clipboard schema, ID regeneration, source/target authorization and reference mapping; QA-002/003/004/006/008; acceptance: cut is atomic, failed paste leaves clipboard/model intact, clone IDs are fresh, same-site references are validated, cross-site references are rejected or explicitly remapped, and undo restores source/target trees |
| C.23.4-08 | 2450 | - Node állapotok: selected, focused, hovered, locked, hidden-in-editor, hidden-on-breakpoint, inherited, overridden, invalid, data-bound. | EDT-001/006/014/023/024/026, EDT-021/022 | OPEN — Editor state + Inspector owners; classify each state as transient UI state, editor metadata or canonical content/property state; editor role required; depends on explicit state ownership and serializer allowlist; QA-002/003/004; acceptance: hover/focus/selection are never persisted as content, editor lock/hide are not public visibility, breakpoint/inherited/overridden/data-bound states are derived from their owning contracts, and invalid state blocks unsafe commit |
| C.23.4-09 | 2451 | - Több node property-szerkesztése csak közös, kompatibilis property-kre; eltérő értékek mixed-state megjelenítése. | EDT-006, EDT-021/022, EDT-038 | OPEN — Inspector owner; multi-edit only for properties marked multi-edit-safe in the canonical registry; editor role required; depends on per-node schema validation and mixed-value model; QA-002/004/006; acceptance: untouched mixed values remain unchanged, incompatible node types/properties are excluded with explanation, partial failure is atomic or explicitly reported with rollback, and undo restores each node's original value |
| C.23.4-10 | 2452 | - Reusable component instance és belső child szerkesztésének egyértelmű módja; instance override vs. main definition. | DSN-012/013, EDT-001/002, EDT-021/022 | OPEN — Component Registry + Editor owners; master/instance editing is gated until definition, instance reference, override and detach semantics are canonical; editor role required; depends on versioned component definition and consumer inventory; QA-002/003/004/006; acceptance: editing an instance cannot mutate the master unless explicitly entered in definition-edit mode, override reset is scoped, detached instances remain independent, and definition updates show impact/conflicts before atomic propagation |
| C.23.5-01 | 2456 | - Display: block/inline/inline-block/flex/grid/none és a támogatott semantic layout primitive-ek. | EDT-016, EDT-021/022, WEB-032 | OPEN — Layout + Inspector + public renderer owners; only explicitly supported semantic display values are selectable; editor role required; depends on shared value registry and browser-render parity; QA-002/004/005/006; acceptance: unsupported values are rejected before save, display:none is not confused with editor hide or breakpoint visibility, and editor preview and published output agree at supported viewports |
| C.23.5-02 | 2457 | - Sizing: width/height/min/max, auto, fit-content, min-content, max-content, aspect ratio, intrinsic sizing. | EDT-009, EDT-016, EDT-021/022 | OPEN — Layout + Inspector owners; 1.0 sizing subset must be explicitly enumerated; advanced intrinsic values are unavailable until renderer/browser support is verified; editor role required; depends on typed unit/value parser, min/max constraints and content measurement; QA-002/004/005/006; acceptance: min/max conflicts are rejected or normalized by a documented rule, intrinsic sizes do not produce unreachable canvas bounds, and save/reload/preview agree across supported viewports |
| C.23.5-03 | 2458 | - Units: px, %, rem/em, vw/vh, svh/lvh/dvh és támogatott CSS clamp/min/max/calc-szerű értékek validált, UI-barát kezelése. | EDT-021/022, EDT-023/024, DSN-006 | OPEN — Inspector + Responsive Design owners; publish an explicit property × unit support matrix, including the containing reference for percentages and viewport units; editor role required; depends on typed parser, canonical serialization and breakpoint inheritance; QA-002/004/005/006; acceptance: invalid/unsupported expressions fail before persistence, unit conversion never changes meaning silently, and values round-trip consistently across supported browsers/viewports |
| C.23.5-04 | 2459 | - Position: static/relative/absolute/fixed/sticky; inset/top/right/bottom/left; z-index; containing block és stacking context jelzése. | EDT-009, EDT-016, EDT-021/022, WEB-032 | OPEN — Layout + public renderer owners; position modes are enabled only with defined containing-block, stacking-context and scroll behavior; editor role required; depends on shared position schema and render parity; QA-002/004/005/006; acceptance: fixed/sticky/absolute are unavailable where semantics cannot be preserved, z-index is scoped to valid stacking contexts, and scroll/overflow/transform combinations have regression coverage |
| C.23.5-05 | 2460 | - Flex: direction, wrap, justify, align, gap, order, grow/shrink/basis, align-self. | EDT-016, EDT-021/022 | OPEN — Layout + Inspector owners; supported Flex properties and value enums must be declared in the canonical registry; editor role required; depends on parent layout model and shared serialization; QA-002/004/005/006; acceptance: axis-specific alignment is not conflated, order does not mutate canonical tree order, and grow/shrink/basis/gap round-trip in preview and public render |
| C.23.5-06 | 2461 | - Grid: template columns/rows, auto-fit/auto-fill, minmax, gap, alignment, placement, span, auto-flow és named areas ahol támogatott. | EDT-016, EDT-021/022 | OPEN — Layout + Inspector owners; Grid is a declared subset, not a promise of arbitrary CSS; editor role required; depends on typed track/placement schema and browser support baseline; QA-002/004/005/006; acceptance: invalid track definitions and overlapping/out-of-range placements are handled deterministically, unsupported auto-fit/fill/named-area behavior is unavailable with explanation, and preview/public layout matches |
| C.23.5-07 | 2462 | - Stack/row/column, nested containers, responsive reorder és content flow. | EDT-016, EDT-024–026 | OPEN — Layout + Responsive Design owners; define canonical flow primitives and whether responsive order is visual-only or also affects accessibility/reading order; editor role required; depends on breakpoint override precedence and semantic DOM order; QA-002/004/005/008; acceptance: mobile overrides do not mutate desktop values, keyboard/focus/reading order remains coherent, and nested flow saves/reloads without layout drift |
| C.23.5-08 | 2463 | - Spacing: margin, padding, gap, logical properties, linked/unlinked sides, negative margin csak validált és indokolt esetben. | EDT-021/022, EDT-016, DSN-001/006 | OPEN — Inspector + Design System owners; spacing tokens, raw values and logical properties require explicit precedence and reset semantics; editor role required; depends on unit validation, writing direction and token inheritance; QA-002/004/005/006; acceptance: linked/unlinked edits affect only declared sides, logical properties resolve correctly in supported writing directions, negative margin has explicit limits, and reset-to-token differs from clearing the value |
| C.23.5-09 | 2464 | - Overflow: visible/hidden/clip/auto/scroll; scroll container; sticky/overflow konfliktus diagnosztika. | EDT-016, EDT-021/022, EDT-009 | OPEN — Layout + Canvas owners; overflow behavior must be declared per axis and container; editor role required; depends on scroll-root and sticky/containing-block rules; QA-002/004/005/006; acceptance: overflow does not make content or Inspector controls unreachable, axis combinations are validated, and sticky/overflow conflicts are surfaced rather than silently misrendered |
| C.23.5-10 | 2465 | - Alignment/distribution: left/center/right, top/middle/bottom, space-between/around/evenly, equal-size, align-to-selection. | EDT-010, EDT-016, EDT-021/022 | OPEN — Layout + Inspector owners; alignment semantics depend on selection anchor and parent layout mode; editor role required; depends on canonical geometry and selection model; QA-002/004/005; acceptance: anchor is explicit, unsupported alignment for flow/grid children is disabled, equal-size preserves constraints/aspect policy, and each multi-node action is one reversible command |
| C.23.5-11 | 2466 | - Box sizing, border, radius, outline, shadow, opacity, blend mode, background color/image/gradient/video (video háttér csak performance/accessibility korláttal). | EDT-021/022, EDT-016, EDT-040, DSN-001–DSN-007, RES-001/002/004/008, WEB-032, QA-005 | OPEN — Inspector + Design System + Resource + public renderer owners; safe visual properties are separated from blend/video capabilities; editor role required; depends on token/property schema, asset lifecycle, safe URL/embed policy and reduced-motion behavior; QA-002/003/004/005/008; acceptance: unsupported blend modes are unavailable, video background has poster/fallback, pause/reduced-motion and bandwidth controls, and all assets/URLs pass validation before public rendering |
| C.23.5-12 | 2467 | - Transform: translate/rotate/scale/skew, transform origin, 2D/3D csak biztonságos és tesztelt scope-ban. | EDT-009, EDT-021/022, WEB-032 | OPEN — Editor geometry + public renderer owners; only transforms represented by schema, editor geometry and serializer may be exposed; editor role required; depends on explicit transform order/origin and coordinate conversion; QA-002/004/005/006; acceptance: transform preview equals saved/public output, cancel/undo restores exact prior state, transform does not break hit-testing or canvas bounds, and 3D remains unavailable absent dedicated tests |
| C.23.5-13 | 2468 | - Aspect ratio, object-fit/object-position, image focal point, crop/cover/contain. | EDT-018, RES-004, EDT-021/022 | OPEN — Media + Inspector owners; asset reference is canonical and crop/focal point is node presentation metadata, not a copied binary; editor role and asset visibility required; depends on image metadata, focal-point coordinate schema and responsive override policy; QA-002/004/006; acceptance: focal point and fit/crop survive save/reload, breakpoint overrides are explicit, and missing/unavailable assets produce a safe fallback |
| C.23.5-14 | 2469 | - Container width, full-bleed, boxed layout, content max-width, section inner width, viewport-aware spacing. | EDT-016, EDT-021/022, DSN-006, WEB-032 | OPEN — Layout + Design System owners; site/page/section width constraints and viewport spacing require explicit inheritance precedence; editor role required; depends on canonical content-width tokens and responsive renderer; QA-002/004/005/006; acceptance: full-bleed escapes only the declared content container, max-width is stable, and section/page overrides do not silently rewrite site-wide tokens |
| C.23.5-15 | 2470 | - Inspectorben pontos értékbeírás és vásznon drag; mindkettő ugyanazt a command/property-registry útvonalat használja. | EDT-003/004, EDT-009, EDT-021/022, EDT-039 | OPEN — Editor command + Inspector owners; 1.0 unified-editing invariant; depends on shared property registry, unit parser and transform command; QA-002/004/005/006; acceptance: numeric input and drag produce the same canonical value/command, keyboard edits are equivalent, validation errors do not mutate state, and undo/redo returns the exact prior value |
| C.23.5-16 | 2471 | - Computed/inherited/overridden értékek megkülönböztetése; invalid CSS vagy nem támogatott érték nem menthető csendben. | EDT-021–024, EDT-028, WEB-032 | OPEN — Inspector + public renderer owners; value origin and validation result must be visible separately; editor role required; depends on canonical cascade/inheritance resolver and typed parser; QA-002/003/004/006; acceptance: computed vs inherited vs explicit override is inspectable, invalid values block save with actionable errors, unsupported values are never silently coerced, and editor/public computed results match |
| C.23.6-01 | 2475 | - Font family, font loading, fallback, size, weight, style, line-height, letter/word spacing, text transform, decoration, alignment, wrapping, hyphenation és text balance. | DSN-007, RES-013, EDT-017, EDT-021/022 | OPEN — Typography + Resource + Editor owners; declare the supported typography property/value matrix and font-loading lifecycle; editor role and asset/license permissions enforced; depends on canonical font registry, fallback stack and responsive property resolver; QA-002/004/005/006; acceptance: unavailable fonts fall back without layout dead ends, unsupported features are not silently coerced, and saved typography matches public output |
| C.23.6-02 | 2476 | - Heading level (H1–H6) a vizuális stílustól külön; link, emphasis, inline code, quote és rich-text struktúra. | EDT-001/002, EDT-017, EDT-021/022, EDT-043, WEB-032 | OPEN — Editor text/schema + public renderer owners; semantic heading level is independent from typography token/style; editor role required; depends on typed text tree, safe URL policy and serializer allowlist; QA-002/003/004/005/008; acceptance: headings do not derive semantics from font size, inline links/marks round-trip, unsafe markup/URLs are rejected, and keyboard/screen-reader structure matches the published DOM |
| C.23.6-03 | 2477 | - Global color palette, semantic tokens (primary/surface/text/border/success/warning/error), gradients, transparency és contrast preview. | DSN-001–DSN-007, EDT-021/022, QA-005 | OPEN — Design System + Inspector owners; semantic token names/roles are distinct from raw color values and gradients; global edit permission required; depends on versioned token registry, consumer map and contrast algorithm; QA-002/003/004/005/008; acceptance: token changes show affected consumers, contrast result includes the evaluated foreground/background and threshold, and gradients/transparency are validated in the supported renderer |
| C.23.6-04 | 2478 | - Global typography roles (display/headings/body/caption/label/code) és user-defined text styles. | DSN-007, DSN-001/002, EDT-017/021 | OPEN — Typography + Design System owners; role styles and user-defined named styles are separate resource types with explicit version/lifecycle policy; global edit permission required; depends on font/token registry and semantic text model; QA-002/004/005/006; acceptance: style application changes presentation only, heading semantics remain intact, and rename/delete checks consumers before changing referenced styles |
| C.23.6-05 | 2479 | - Spacing scale, container widths, breakpoints, radius, border, shadow, z-index layers, motion duration/easing token. | DSN-001/006, DSN-005, EDT-016/024, EDT-040 | OPEN — Design System + Responsive Design owners; token families require typed units/ranges and collision policy (not one untyped value bag); global-token permission required; depends on breakpoint precedence, z-index layer taxonomy and reduced-motion contract; QA-002/004/005/006; acceptance: invalid/overlapping breakpoints are rejected, z-index tokens resolve within declared layers, and motion tokens collapse safely under reduced motion |
| C.23.6-06 | 2480 | - Token létrehozás/átnevezés/használatkeresés/átállítás/törlés előtti dependency check. | DSN-003/004, DSN-001, SEC-001–SEC-011 | OPEN — Design System owner; lifecycle actions require server-side global-token edit permission and a complete consumer/reference map; depends on stable token IDs and atomic migration command; QA-002/003/004/006/008; acceptance: rename updates references atomically, delete is blocked while referenced unless replacement is explicit, and failed migration/rollback leaves all consumers unchanged |
| C.23.6-07 | 2481 | - Token vs. literal value: jelölés, „convert to token”, „detach from token”, token reset és site-wide impact preview. | DSN-001–DSN-004, EDT-021–024 | OPEN — Design System + Inspector owners; token reference and literal value are distinct persisted states; depends on resolved-property provenance and consumer map; QA-002/004/006; acceptance: convert/detach/reset each has defined semantics, impact preview lists affected nodes/pages, and detaching preserves the current resolved value without altering other consumers |
| C.23.6-08 | 2482 | - Theme/style variations, light/dark/high-contrast theme előkészítés; a tényleges váltás csak explicit theme supporttal. | DSN-005/006, DSN-001–DSN-004, EDT-040 | OPEN — Design System owner; theme variants remain non-functional until theme schema, activation policy and fallback are defined; global edit permission required; depends on token mapping and contrast checks; QA-002/004/005/008; acceptance: unavailable theme switching is not exposed, each supported theme has complete token coverage, and runtime preference changes preserve contrast/reduced-motion requirements |
| C.23.6-09 | 2483 | - Font asset/license metadata, font display/performance és unavailable-font fallback. | DSN-007, RES-013, RES-007, RES-015 | OPEN — Resource + Typography owners; font binary, font metadata, license/provenance and applied style reference remain separate; asset permission and license constraints required; depends on canonical asset registry and loader policy; QA-002/003/004/005/008; acceptance: license/source metadata is retained, unauthorized font assets cannot be applied/exported, failed loads use declared fallback, and font loading/performance is measurable |
| C.23.6-10 | 2484 | - Site-wide global style change előtt érintett oldalak/komponensek előnézete és undo/rollback. | DSN-003/004, DSN-012–014, EDT-005/032 | OPEN — Design System + Editor history owners; site-wide mutation is one previewable transaction with an affected-consumer snapshot; global edit permission required; depends on complete usage map, revision conflict policy and atomic history/rollback; QA-002/003/004/006/008; acceptance: preview is read-only, concurrent revision conflicts block stale apply, one undo restores prior effective styles across consumers, and failed apply leaves no partial global change |
| C.23.7-01 | 2488 | - Inspector kategóriák: Content, Layout, Size, Position, Spacing, Typography, Appearance, Background, Border/Shadow, Effects, Responsive, Interactions, Accessibility, SEO, Data/Bindings, Advanced. | EDT-021/022, EDT-017–020, WEB-032, SEC-001–011 | OPEN — Inspector + Property Registry owners; categories are presentation groupings, not separate property stores; controls are filtered by node type, permission and supported phase; QA-002/003/004/008; acceptance: unsupported or unauthorized controls are absent/disabled with reason, and every exposed value round-trips through the canonical registry/serializer |
| C.23.7-02 | 2489 | - Kontextusfüggő property-k csak az adott node type által támogatottan jelenhetnek meg. | EDT-001/002, EDT-017–022, EDT-039 | OPEN — Page Model + Property Registry owners; compatibility is enforced both in UI metadata and server validation; depends on canonical node schema and property capability matrix; QA-002/003/004/008; acceptance: forged property/node combinations are rejected server-side, and renderer/serializer do not silently discard unsupported properties |
| C.23.7-03 | 2490 | - Property search, kategóriafilter, recent properties, favorites, tooltip/help, default/inherited/override jelzés. | EDT-021/022/023/024, EDT-039 | OPEN — Inspector owner; search/filter/help/favorites are view metadata over canonical property definitions; depends on searchable registry metadata and resolved value provenance; QA-002/004/005; acceptance: search is deterministic, favorites/recent do not mutate document or grant access, and default/inherited/override indicators match actual resolver state |
| C.23.7-04 | 2491 | - Reset property, reset group, reset to breakpoint parent, reset element to preset, copy/paste property group. | EDT-005, EDT-021–024, DSN-001–004 | OPEN — Inspector + Design System owners; property/group/breakpoint-parent/preset resets are distinct commands; depends on explicit inheritance precedence and compatible clipboard schema; QA-002/004/006; acceptance: each reset names its target scope, breakpoint reset removes only the selected override, preset reset preserves content/bindings, and undo restores exact prior values |
| C.23.7-05 | 2492 | - Input validation, unit validation, min/max, enum, required fields, invalid value, dependency/compatibility warnings. | EDT-021/022, EDT-009, WEB-032 | OPEN — Property Registry + validation owners; client validation improves UX but server validation is authoritative; depends on shared schema/version, unit parser and cross-property constraints; QA-002/003/004/006; acceptance: boundary, enum, required/dependency and malformed-input cases are tested; stale client metadata cannot bypass server rejection; failures leave model/history unchanged |
| C.23.7-06 | 2493 | - Property change → command → validation → history → dirty state → save/reload round-trip. | EDT-003–005, EDT-027–031, QA-002 | OPEN — Editor command + persistence owners; release gate for every mutation route; depends on transaction boundary, revision conflict handling and canonical serialization; QA-002/003/004/006; acceptance: successful change traverses validation/history/dirty/save and round-trips exactly; failed save preserves dirty state and edits; stale revision cannot overwrite newer content; publish state remains separate |
| C.23.7-07 | 2494 | - Batch edit, mixed values, apply to all selected compatible nodes. | EDT-006, EDT-021/022, EDT-038 | OPEN — Inspector owner; multi-edit only for registry-approved properties and compatible node types; depends on mixed-value model and atomic multi-node command; QA-002/004/006; acceptance: mixed values remain untouched until explicit user input, all selected nodes update atomically or roll back, and one undo restores each original value |
| C.23.7-08 | 2495 | - Property registry schema version, deprecation notice és migráció; új UI nem tarthat fenn második property store-t. | EDT-001, EDT-021/022 | OPEN — Property Registry owner; schema version, deprecation and migration are prerequisites to registry expansion; depends on versioned schema and compatibility policy; QA-002/004/006; acceptance: migrations are deterministic/idempotent, deprecated keys have an explicit replacement path, unknown incompatible versions fail safely, and no parallel property store is introduced |
| C.23.7-09 | 2496 | - Advanced CSS/custom attributes csak későbbi, explicit sandbox/security contracttal; arbitrary script nem futtatható a szerkesztői jogosultság miatt. | SEC-001–SEC-011, EDT-021/022, WEB-032 | OPEN — Security + Editor owners; custom CSS/attributes remain later-phase until sandbox, CSP, validation and export policy are explicit; editor role alone never authorizes script execution; QA-003/004/008; acceptance: arbitrary scripts do not execute, custom values are scoped/escaped/audited, and published rendering cannot invoke privileged editor APIs |
| C.23.8-01 | 2502 | - Structure: Section, Container, Row, Column, Stack, Flex, Grid, Spacer, Divider, Separator. | EDT-016/019, EDT-021/022 | OPEN — Element Registry + Page Model + public renderer owners; layout primitives map to canonical node types and declared parent-child rules, not one-off DOM wrappers; QA-002/004/005/006/008; acceptance: each enabled primitive inserts, edits, saves/reloads, exposes valid Inspector properties and renders with accessible/responsive parity; unsupported variants are unavailable with explanation |
| C.23.8-02 | 2503 | - Content: Text, Heading, Rich Text, Quote, List, Numbered List, Table, Code, Badge, Icon, Image, Gallery, Video, Audio, Embed. | EDT-017–019, EDT-021/022, EDT-043, RES-001–015 | OPEN — Content + Resource + public renderer owners; semantic text, rich-text tree and media assets are separate typed contracts; editor role and asset authorization required; QA-002/003/004/005/008; acceptance: enabled elements validate input, preserve semantic structure, support responsive output and missing/error states, and reject unsafe markup/URLs; Add-menu presence is not implementation evidence |
| C.23.8-03 | 2504 | - Navigation: Header, Footer, Navbar, Menu, Breadcrumbs, Tabs, Anchor, Pagination, Back-to-top. | EDT-017/019, WEB-001–013, EDT-039 | OPEN — Editor + Website Manager + public routing owners; site-wide shell, page-local navigation and in-page anchors have distinct scope; QA-002/004/005/008; acceptance: routes/labels/current-page state are canonical, keyboard and focus behavior works, and navigation changes update preview/public output without duplicate route stores |
| C.23.8-04 | 2505 | - Action: Button, Link, CTA, Icon Button, Download, Share. | EDT-017, EDT-039, WEB-032, RES-014 | OPEN — Action Registry + Security + public renderer owners; visual elements point to typed, allowlisted action definitions; QA-002/003/004/008; acceptance: internal routes, external links, downloads and share actions have separate target/permission policies, unsafe schemes are rejected, and public actions cannot invoke editor-only commands |
| C.23.8-05 | 2506 | - Cards/collections: Card, Feature Card, Profile Card, Game Card, Stream Card, Product Card, List/Grid/Carousel/Slider. | EDT-018/019, DSN-011–013, STO-001–007/017, WEB-025 | OPEN — Element Registry + Component Registry + domain owners; generic presentation cards are distinct from Twitch/game/product domain data and reusable component definitions; QA-002/003/004/005/006; acceptance: each card declares its DTO/schema, empty/loading/error states, responsive behavior and update source; unavailable domain data never fabricates content |
| C.23.8-06 | 2507 | - Interactive: Accordion, Tabs, Modal/Dialog, Tooltip, Popover, Toggle, Disclosure, Search, Filter, Sort. | EDT-019, EDT-039, WEB-032 | OPEN — Interaction Registry + public renderer owners; each widget needs explicit state model, keyboard/focus contract and persistence-vs-transient decision; QA-002/003/004/005/008; acceptance: Escape/focus restoration/keyboard controls are tested, state changes do not leak into editor state, and search/filter/sort use authorized canonical data sources |
| C.23.8-07 | 2508 | - Form: Form shell, text/email/url/number/date/select/checkbox/radio/textarea fields, validation/help/success/error state; secure submit handler külön canonical domain. | EDT-019, SEC-001–SEC-011, WEB-032 | OPEN — Forms + Security + domain API owners; editor configuration and public submission are separate trust boundaries; QA-002/003/008; acceptance: server validates schema/authorization/rate limits and abuse controls, secrets never enter Page Model, success/error states are explicit, and no submission is trusted from client validation alone |
| C.23.8-08 | 2509 | - Media: image/video/audio embeds, responsive source, poster, captions/transcript, aspect ratio, lazy loading. | EDT-018/019, RES-002–009, RES-014/015 | OPEN — Media + Resource + public renderer owners; binary asset, metadata, source selection and presentation options are separate; QA-002/003/004/006/008; acceptance: authorization, responsive source/poster/fallback, captions/transcript, lazy loading and external provider policy are tested; missing/deleted assets never break page rendering |
| C.23.8-09 | 2510 | - Social/creator: Twitch live/status/player/chat where permitted, schedule, countdown, channel link, VOD/clip link, social icon row, community invite, support CTA. | EDT-020, SCH-009–011, INT-001–018, LIV-001–007, RES-011 | OPEN — Dynamic Blocks + Schedule + Integration owners; provider connection is configured through a dedicated integration contract, not inside the visual element; QA-002/003/004/005/008; acceptance: each block declares provider capability/scope, public-safe DTO, cache/freshness policy and stale/empty/error fallback; revoked permission is recoverable and credentials are never exposed |
| C.23.8-10 | 2511 | - CMS/data: collection list, item template, dynamic field, reference/relationship, empty/loading/error state, conditional block, pagination/filter. | DYN-001–008, WEB-031/032, SEC-001–011 | OPEN — Dynamic Data/CMS + API owners; collection schema, queries, relation graph and public DTO projection are canonical domain contracts separate from page presentation; QA-002/003/004/008; acceptance: query fields/relations/limits are validated, published-only public access is enforced server-side, and drafts/secrets/private fields never leak through element bindings |
| C.23.8-11 | 2512 | - Commerce future: product/collection/price/stock/CTA and external checkout boundary; order/payment state nem lehet egyszerű Page Model tartalom. | STO-001–020, WEB-025/026, SEC-001–011 | OPEN — Commerce + Security + domain API owners; future phase; catalog presentation is separate from authoritative inventory/order/payment state; QA-003/008; acceptance: price/stock/order/payment are server/provider sourced, checkout is a dedicated authorized boundary, and no commerce capability is claimed before provider, failure and reconciliation tests |
| C.23.8-12 | 2513 | - Future app slots/widgets: explicit capability and security boundary, not arbitrary injected code. | EDT-039, SEC-001–011, OPS-005, WEB-032 | OPEN — Platform Extensibility + Security owners; future phase behind reviewed capability manifest, sandbox and resource quotas; QA-003/008; acceptance: unknown/unapproved widgets fail closed, arbitrary injected scripts do not execute, and installation/update/removal are permissioned, audited and reversible |
| C.23.8-13 | 2514 | - Minden elementhez type-specific schema, defaults, accessible output, responsive behavior, Inspector mapping, validation, preview, tests and public renderer support kell. | EDT-001/002, EDT-017–022, EDT-024–026, WEB-032, QA-002–005 | OPEN — Element Registry + Page Model + Inspector + public renderer + QA owners; this is a release gate, not a documentation-only checklist; QA-002/003/004/005/006/008; acceptance: each enabled element has versioned schema/defaults/migrations, allowed-child rules, accessible/responsive output, Inspector mapping, validation, preview/public parity, regression tests and an owner; any missing item keeps that element disabled |
| C.23.9-01 | 2518 | - Desktop/tablet/mobile előre definiált nézetek, egyedi breakpoints és custom viewport width/height. | EDT-007, EDT-024/025 | OPEN — Responsive viewport owner; 1.0 desktop/tablet/mobile presets, custom dimensions phased; editor role required; depends on canonical viewport state and breakpoint registry; QA-002/004/005; acceptance: changing viewport updates only preview dimensions and resolved styles, never creates a second document or mutates saved content; dimensions are validated and reproducible |
| C.23.9-02 | 2519 | - Breakpointok egymás melletti preview-ja, single-breakpoint mode, rotate/portrait-landscape preview. | EDT-007, EDT-025 | OPEN — Responsive preview owner; side-by-side/single/rotation modes phased by canvas capability; editor role required; depends on viewport/breakpoint registry; QA-002/004/005; acceptance: preview mode is explicit transient UI state, cannot alter Page Model, node order, save route or publish output; unsupported mode is unavailable rather than simulated as real device behavior |
| C.23.9-03 | 2520 | - Resize drag handle és pontos viewport mező; common device presets, custom device preset. | EDT-007/009, EDT-025 | OPEN — Viewport geometry owner; common/custom presets phased; editor role required; depends on validated dimensions and transform model; QA-002/004/005; acceptance: drag handle and numeric fields resolve to the same dimensions, invalid/unsafe extremes are rejected, and presets are convenience metadata rather than device-test evidence |
| C.23.9-04 | 2521 | - Cascading/inherited style model: nagyobb breakpoint értékei öröklődnek; kisebb breakpoint override nem írhatja felül észrevétlenül a nagyobbat. | EDT-023/024, DSN-006, EDT-021/022 | OPEN — Responsive property owner; 1.0 inheritance invariant; editor role required; depends on canonical breakpoint ordering and resolved-value model; QA-002/004/005; acceptance: inheritance direction is documented and deterministic, child overrides never silently rewrite parent values, and Inspector shows inherited versus explicit values |
| C.23.9-05 | 2522 | - Property-level breakpoint overrides; reset inherited; copy breakpoint settings; clear all overrides with confirmation. | EDT-005, EDT-021–026, DSN-006 | OPEN — Responsive command owner; property-level override/reset/copy/clear phased by schema; editor role required; depends on inheritance model, usage/scope model and undoable commands; QA-002/004/005; acceptance: each operation declares source/target breakpoint and affected properties, is undoable/atomic, confirms destructive clear, and preserves unrelated overrides |
| C.23.9-06 | 2523 | - Responsive behavior: fluid, scale, fixed, min/max, wrap, stack, reorder, hide/show, overflow strategy, typography scaling. | EDT-016, EDT-023–026, DSN-006 | OPEN — Layout/Responsive owner; 1.0 flow-first behavior, advanced fluid/scale strategies phased; editor role required; depends on responsive schema, supported CSS/layout semantics and renderer parity; QA-002/004/005; acceptance: wrap/stack/reorder/visibility/overflow/typography behavior is deterministic at supported widths, unsupported combinations are rejected or diagnosed, and public rendering matches preview |
| C.23.9-07 | 2524 | - Breakpoint-specifikus layout és visibility; tartalmi/strukturális változás közös modellben marad, ha nem indokolt valódi külön node. | EDT-001/002, EDT-023–026, WEB-031 | OPEN — Page Model + Responsive owner; 1.0 shared-node model invariant; editor role required; depends on canonical node identity and separation of content/structure from presentation overrides; QA-002/004/005; acceptance: responsive style/visibility changes use one canonical node model and scoped overrides; duplicate mobile-only page/node trees require an explicit product decision and migration, never implicit preview behavior |
| C.23.9-08 | 2525 | - Oldal-, section- és komponensszintű breakpointok összehangolása; konfliktus és nem használt breakpoint jelzése. | DSN-006, EDT-023–026, EDT-021/022 | OPEN — Design System + Responsive owner; shared breakpoint policy phased by contract; editor role required; depends on site/page/component scope and versioned breakpoint registry; QA-002/004/005; acceptance: breakpoint definitions have stable IDs, ordering and scope; conflicts, unused entries and incompatible component requirements are surfaced with impact before changes |
| C.23.9-09 | 2526 | - Minimum width/overflow/overlap/viewport clipping diagnostics; szélső méretek és zoom tesztek. | EDT-007/009/010, EDT-024–026 | OPEN — Canvas/Responsive owner; 1.0 clipping/overflow diagnostics gate; editor role required; depends on geometry, font/media loading and breakpoint tests; QA-002/004/005; acceptance: narrow/wide/extreme viewport tests report overflow, overlap and clipping with node/property context; essential content remains reachable and diagnostics distinguish warnings from blockers |
| C.23.9-10 | 2527 | - Canvas height és scroll extent újraszámítása drag/resize/content growth közben, zoommal és transformmal korrigálva. | EDT-007–010, EDT-027/030/042 | OPEN — Canvas geometry owner; explicit 1.0 regression gate; editor role required; depends on content-size observation, scroll extent and transform/zoom-correct geometry; QA-002/004/005; acceptance: drag/resize/content growth recomputes canvas height and scroll extent at multiple zoom levels and viewport sizes; no stale extent, clipped off-canvas content or coordinate drift remains |
| C.23.9-11 | 2528 | - Responsive preview nem külön mobil Page Model és nem külön save route. | EDT-001, EDT-023–026, EDT-028/032/033 | OPEN — Page Model + Responsive owner; architectural invariant across phases; editor role required; depends on one canonical document, revisioned save and publish separation; QA-002/004/005; acceptance: all breakpoints persist through the same canonical model and save/revision contract; viewport selection is transient and publishing deterministically resolves responsive rules without a separate mobile save route |
| C.23.9-12 | 2529 | - Device presets nem helyettesítik a valódi browser/device tesztet. | QA-004/005, EDT-025/026 | OPEN — QA/Responsive owner; required test policy across phases; no special runtime permission; depends on declared browser/device matrix and release criteria; QA-004/005; acceptance: preset previews are supplemented by real browser viewport tests and representative device/browser coverage, with recorded viewport, browser, result and regression evidence; a preset alone cannot close QA |
| C.23.10-01 | 2533 | - Hover, focus, active, disabled, selected, expanded/collapsed, loading, success, error és empty states. | EDT-017–020, EDT-039, WEB-032 | OPEN — Interaction-state + public renderer owner; 1.0 common states, specialized widget states phased; editor role required to configure; depends on typed state schema and accessible renderer; QA-002/003/004/005; acceptance: hover/focus/active/disabled/selected/expanded/loading/success/error/empty are distinct semantic states, have defined precedence and keyboard/screen-reader behavior, and do not rely on color alone |
| C.23.10-02 | 2534 | - Link/action target, anchor, external/internal navigation, download, open-in-new-tab, safe rel policy. | EDT-017, EDT-039, WEB-001–013, RES-014, SEC-001–011 | OPEN — Navigation/action registry owner; 1.0 safe links/actions; editor role required for authoring, public target policy enforced at render; depends on canonical route/URL/action schema; QA-002/003/004; acceptance: internal route, anchor, external URL, download and new-tab are typed target kinds; URL schemes and destinations are validated, external links apply safe rel policy, and missing targets have explicit fallback/diagnostic |
| C.23.10-03 | 2535 | - Hover/focus transitions, entrance/exit, scroll-triggered motion és component interaction presets. | EDT-039/040, DSN-001/005, WEB-032 | OPEN — Interaction + Design System owner; motion/interactions phased by reduced-motion and performance policy; editor role required; depends on shared interaction schema and preview/public renderer parity; QA-002/004/005; acceptance: transitions and scroll triggers declare scope, trigger, target and lifecycle; preview uses the same configuration without executing privileged actions; reduced-motion and performance budget govern public playback |
| C.23.10-04 | 2536 | - Duration/easing/delay, trigger, target, replay, reduced-motion alternative, animation conflict warning. | EDT-040, DSN-001/005, SEC-001–011 | OPEN — Motion/accessibility owner; 1.0 reduced-motion baseline, advanced triggers phased; editor role required; depends on validated duration/easing/delay/trigger schema and conflict resolver; QA-002/004/005; acceptance: values are bounded and validated, conflicting animations are surfaced deterministically, replay/cancel semantics are explicit, and prefers-reduced-motion provides a tested alternative without essential information loss |
| C.23.10-05 | 2537 | - Interakciók explicit trigger/action modelben; preview-ban szimulálhatók, de szerkesztői műveletet nem hajthatnak végre. | EDT-039, EDT-032, SEC-001–011 | OPEN — Editor action registry owner; 1.0 preview isolation invariant; editor role required to configure actions; depends on typed trigger/action registry and command authorization boundary; QA-002/003/004; acceptance: preview may simulate public interaction only; it cannot mutate Page Model, dirty state, command history, credentials, or invoke privileged editor commands; server authorization remains authoritative |
| C.23.10-06 | 2538 | - Form success/error, media load failure, empty CMS collection, offline/unavailable integration állapotok. | EDT-019/020, DYN-001–008, INT-001–020, RES-015, WEB-028 | OPEN — Domain/widget owners; state coverage phased per canonical domain; editor role required for configuration and provider/domain permissions enforced; depends on typed DTO, loading/error/empty/offline state and retry contracts; QA-002/003/004/005; acceptance: failed media, empty CMS, invalid form submission, rate limit, offline provider and disconnected integration produce distinguishable safe states with contextual recovery where appropriate; secrets and raw provider errors are not exposed |
| C.23.10-07 | 2539 | - Tab/focus order, keyboard operation, escape/cancel és focus return. | EDT-037, EDT-039, WEB-032 | OPEN — Accessibility + Editor owner; 1.0 keyboard/focus contract; editor role required in editor, public controls follow public access; depends on semantic controls, focus manager and overlay lifecycle; QA-002/004/005; acceptance: keyboard-only path covers interactive controls, tab order follows meaningful structure, Escape/cancel restores focus to the invoking control, and modal/menus have no focus trap or lost-focus state |
| C.23.10-08 | 2540 | - Motion és third-party embeds csak performance/privacy/accessibility guardrail mellett. | EDT-040, WEB-032, SEC-001–011, OPS-005 | OPEN — Security/Performance/Accessibility owners; motion and third-party embeds guarded in all phases; editor role required for configuration, CSP/privacy policy applies at render; depends on consent/privacy policy, sandbox/CSP and performance budgets; QA-003/004/008; acceptance: embed origin and capabilities are allowlisted, consent is honored where required, unsafe scripts are blocked, loading is bounded/lazy where appropriate, and reduced-motion plus keyboard/accessibility behavior are verified |
| C.23.11-01 | 2544 | - Oldallista: create, rename, duplicate, archive, delete, restore, search, filter, reorder, parent/child, draft/published state. | WEB-001–013, EDT-027–033, SEC-001–011 | OPEN — Website Manager/Page lifecycle owner; 1.0 page lifecycle baseline; authorized editor/admin role required; depends on canonical Page CRUD, revision, draft/published, audit and recovery contracts; QA-002/003/004; acceptance: create/rename/duplicate/archive/delete/restore/search/filter/reorder/status transitions persist with server authorization, audit history, reversible deletion policy and concurrency-safe updates |
| C.23.11-02 | 2545 | - Slug/URL, canonical URL, trailing slash policy, redirects, duplicate slug detection, 404 handling. | WEB-001–013, SEO-001–005, SEC-001–011 | OPEN — Routing/SEO owner; 1.0 slug/canonical/404 baseline; redirect and slug mutation require permission; depends on canonical route resolver and unique slug policy; QA-002/003/004; acceptance: slug normalization and trailing-slash policy are deterministic, duplicate/conflicting routes are blocked, redirects avoid loops/chains where policy forbids them, canonical URLs are correct and 404 is distinct from unauthorized/private content |
| C.23.11-03 | 2546 | - Page type/template assignment: standard, landing, about, schedule, game/profile, blog/article, directory, contact, support, future commerce. | WEB-001–028, DSN-008/009, SCH-012–014, CNT-001–020, STO-001–020 | OPEN — Website Manager + domain owners; page types enabled only when owning domain exists; editor role required; depends on canonical templates, domain DTOs and lifecycle contracts; QA-002/004/005; acceptance: each page type declares schema, template, data owner and public renderer; future/unimplemented types are unavailable or clearly non-functional and never fabricate domain data |
| C.23.11-04 | 2547 | - Site shell: global header/footer, announcement bar, sidebar, Navbar, mobile menu, shared navigation and reusable site sections. | WEB-001–013, DSN-008–012, EDT-016/017 | OPEN — Website shell + Design System owner; 1.0 shared header/footer/navigation baseline; site-edit permission required for shared changes; depends on shared component/template ownership and responsive shell; QA-002/004/005; acceptance: global shell has canonical site scope and usage map; site-wide edits list impacted pages, while page-local overrides cannot silently mutate shared shell |
| C.23.11-05 | 2548 | - Navigation tree, nested menus, active state, external links, accessibility labels, mobile collapse behavior. | WEB-001–013, EDT-017/019, EDT-037/039 | OPEN — Navigation owner; 1.0 accessible navigation; site-edit permission required; depends on canonical navigation tree, safe URL registry and responsive shell; QA-002/004/005; acceptance: nested menus, active route, external links, accessible labels and mobile collapse work by keyboard/touch, with deterministic focus, safe URL handling and no orphaned navigation references |
| C.23.11-06 | 2549 | - Site-wide edit vs. page-local edit világos jelölése; shared template change impact list. | DSN-003/004, DSN-008–012, WEB-001–013 | OPEN — Website Manager + Design System owner; 1.0 scope clarity; site-wide permission required for shared changes; depends on resource usage/impact map and shared template model; QA-002/003/004; acceptance: editing UI visibly distinguishes site/page/component scope and previews affected pages/components plus inheritance/override effects before a shared change is applied |
| C.23.11-07 | 2550 | - System pages: 404, search, archive/list/detail, privacy/terms, maintenance/offline and unavailable content states. | WEB-028/029, WEB-031/032, SEC-001–011, SEO-001–005 | OPEN — Public renderer + Security/SEO owner; 1.0 error/privacy pages, advanced archive/search phased; public-safe content only; depends on canonical error routes and published-only policy; QA-002/003/004; acceptance: 404, search, archive/list/detail, maintenance/offline, privacy and terms routes have explicit ownership/status; drafts and private data never leak through fallback, search or cache |
| C.23.11-08 | 2551 | - Page duplication/import must regenerate identifiers where required and preserve only valid canonical references. | EDT-001/002, EDT-011, RES-001/008, DYN-001–008 | OPEN — Page Model + Resource/Dynamic Data owner; 1.0 duplicate/import integrity; authorized editor role required; depends on stable IDs, canonical reference registry and import validation; QA-002/003/004; acceptance: duplicated/imported pages regenerate IDs according to entity semantics, preserve only valid in-scope references, report skipped/conflicting resources and leave no dangling IDs or cross-site links |
| C.23.11-09 | 2552 | - Public renderer kizárólag published canonical Page Modelt használ; draft/preview route protected és noindex. | WEB-031/032, EDT-027–034, SEC-001–011, SEO-001–005 | OPEN — Public renderer + Security/SEO owner; 1.0 release gate; public reads published-only and previews protected/noindex; depends on publish snapshot, auth, cache and route rules; QA-002/003/004/008; acceptance: public routes serve only the canonical published revision, preview/draft routes require authorization and noindex policy, and publish/unpublish/rollback invalidates relevant caches deterministically |
| C.23.12-01 | 2556 | - Collection/schema designer: text, rich text, number, boolean, date/time/timezone, URL, image/file, enum, reference/relation, list, JSON with validation. | DYN-001–008, WEB-025/026, SEC-001–011 | OPEN — Dynamic Data schema owner; collections phased after typed schema and migration contract; editor role required for schema changes, public reads published-only; depends on field registry, validation and versioned migration; QA-002/003/004/008; acceptance: each field type has canonical storage/validation/serialization semantics, JSON is schema-constrained, relations are typed and query-safe, and unsupported types cannot be activated |
| C.23.12-02 | 2557 | - Field labels, help, required, default, validation, unique, search/filter/sort, display format and migration. | DYN-001–008, SEC-001–011 | OPEN — Dynamic Data schema owner; 1.0 schema validation gate; schema-edit permission required; depends on server-side validation, uniqueness strategy and migration engine; QA-002/003/006; acceptance: required/default/unique/search/filter/sort/format rules are enforced server-side, migration is transactional or safely resumable, and incompatible data produces an actionable report rather than silent loss |
| C.23.12-03 | 2558 | - Static vs. dynamic property/binding indicator; choose source, field, transform/format and fallback. | DYN-001–008, RES-001–015 | OPEN — Dynamic Data + Resource owner; relation/media fields phased by resource contracts; schema-edit permission required; depends on canonical resource IDs, typed bindings and scope authorization; QA-002/003/004; acceptance: static and dynamic values are distinguishable, bindings declare source/field/transform/fallback, references are validated in scope, and deleted/moved/cross-site resources fail safely |
| C.23.12-04 | 2559 | - Canonical sources: site settings, schedule domain, Twitch adapter, Resource metadata, CMS collections and future platform adapters. | DYN-001–008, SET-001–003, SCH-001–015, INT-001–021, RES-001–016, CNT-001–020, SEC-001–011 | OPEN — Dynamic Data owner with each source-domain owner; adapters enabled only for declared canonical sources/capabilities; editor role required for configuration and site scope enforced at runtime; depends on typed binding schema, domain DTOs, freshness/error contract and audit; QA-002/003/004/006; acceptance: every source declares owner, allowed fields, scope, freshness and error semantics; unauthorized/unsupported sources are rejected; Page Model stores binding/configuration, never duplicate domain records |
| C.23.12-05 | 2560 | - Loading/empty/error/stale states; timeout, retry, caching, invalid/stale binding and deleted source handling. | DYN-001–008, WEB-031/032, SEC-001–011 | OPEN — Dynamic Data + Public renderer owner; public reads published-only; editor role required for setup, public access constrained; depends on safe query DTOs, cache policy and publication lifecycle; QA-002/003/004/008; acceptance: loading/empty/error/stale/timeout/retry states are explicit, cache freshness and invalidation are defined, queries are bounded, and draft/private/secret fields never reach public output |
| C.23.12-06 | 2561 | - Conditional visibility based on safe typed values, integration status or content presence; no arbitrary code evaluation. | DYN-001–008, EDT-020/039, QA-002/004 | OPEN — Dynamic Data + Editor owner; typed conditional/query blocks phased by canonical data API; editor role required; depends on typed operators, null/missing semantics and bounded evaluation; QA-002/003/004; acceptance: conditional visibility uses allowlisted typed operators and deterministic null/missing behavior, arbitrary code/eval is forbidden, and failed or oversized queries degrade safely |
| C.23.12-07 | 2562 | - Collection list/grid/repeater, item template, pagination, sorting, filtering and URL/query state where permitted. | DYN-001–008, EDT-020, WEB-031/032 | OPEN — Dynamic Data + Editor owner; collection/repeater support phased by query contract; editor role required; depends on typed schema, bounded query API and stable pagination; QA-002/003/004; acceptance: list/grid/repeater use declared fields and stable ordering, pagination/filter/sort have limits, URL state is allowlisted and cannot bypass access controls, and item templates cannot escape collection scope |
| C.23.12-08 | 2563 | - Data preview with sample/real data toggle; secret fields and private data must never leak to public preview. | DYN-001–008, SEC-001–011, WEB-031/032 | OPEN — Dynamic Data + Editor owner; sample/real data preview gated by privacy boundary; editor role required; depends on field-level privacy classification and safe DTO projection; QA-002/003/004; acceptance: sample and real preview modes are explicit, preview access is authorized, secret/private fields are redacted at source projection, and preview cannot bypass published-only public rendering |
| C.23.12-09 | 2564 | - D1 domain records remain domain-owned; Page Model stores binding/reference/config only and does not duplicate schedule or integration data. | DYN-001–008, SCH-001–015, INT-001–021, EDT-001/020, SEC-002 | OPEN — Domain architecture owner; invariant across all phases; editor stores binding/reference/config only; depends on canonical domain services and site ownership; QA-002/003/004; acceptance: schedule, integration, resource and other domain records remain owned by their domain services; Page Model holds only references/configuration; writes route through authorized domain APIs and cross-site ownership checks |
| C.23.13-01 | 2568 | - Központi Resource Manager és Editor picker ugyanazon registryt használja. | RES-001–015, EDT-018/019, SEC-001–011 | OPEN — Resource Registry owner; 1.0 invariant: Admin Resource Manager and Editor picker resolve the same canonical resource IDs, metadata, site ownership, availability and permission decisions; no duplicated picker-specific asset authority; depends on Resource schema and server-side site-scoped read authorization; QA-002/003/004; acceptance: the same asset appears with consistent metadata and access in both surfaces, and cross-site IDs are denied server-side. |
| C.23.13-02 | 2569 | - Upload/drop, multi-upload, progress, cancel/retry, duplicate detection, type/size validation, safe object keys and ownership checks. | RES-001–015, OPS-005, SEC-001–011 | OPEN — Resource upload owner; upload is a validated lifecycle, not a client-only file drop; require authenticated site-scoped write permission, server-generated object keys, byte/content MIME sniffing, extension/type and size limits, duplicate/idempotency semantics, progress/cancel/retry and compensation cleanup; QA-002/003/006; acceptance: invalid or unauthorized uploads are rejected and interrupted/retried batches leave no orphaned R2 objects or D1 rows. |
| C.23.13-03 | 2570 | - Search/filter by type/tag/usage/date/dimensions/owner; sort, folders/collections, favorites and recent. | RES-001–015, SEC-001–011 | OPEN — Resource Library owner; search/filter/sort is deterministic over typed, indexed, site-scoped metadata; folders/collections/favorites/recent are views or metadata, never alternate ownership or authorization; owner/usage/date/type/tag/dimensions filters must have explicit semantics; QA-002/003/004; acceptance: stable paginated results, correct empty/error states and no cross-site leakage under direct API requests. |
| C.23.13-04 | 2571 | - Preview, metadata, alt text/caption/credit, crop/focal point, resize/replace, derivatives, optimization and thumbnail. | RES-001–015, EDT-018/021, WEB-032 | OPEN — Media Resource owner; persist distinct alt text, caption and credit/license metadata; crop/focal point, replacement, resize and generated derivatives have explicit source-versus-rendition semantics; require read/write authorization and public-safe rendition policy; QA-002/003/004/006; acceptance: metadata and crop survive save/reload, accessible output uses alt correctly, and preview/replacement match published rendition behavior. |
| C.23.13-05 | 2572 | - Usage references across pages/components/templates; before-delete impact list; unused asset detection; archive/restore. | RES-001–015, SEC-001–011, OPS-005 | OPEN — Resource lifecycle owner; maintain a complete typed reference map for pages, components, templates, icons, fonts and generated renditions; show impact before destructive action, block deletion with unresolved/live references, define archive/restore and stale-reference behavior, and audit privileged actions; QA-002/003/006; acceptance: delete/archive/restore cannot silently break known references and recovery is verified. |
| C.23.13-06 | 2573 | - SVG sanitization, allowed MIME validation, font file constraints, video/audio duration/poster/caption and file-download policy. | RES-001–015, SEC-001–011, QA-003/006 | OPEN — Resource security owner; validate extension, declared MIME and detected content server-side; sanitize SVG and reject active/dangerous formats; constrain font formats and preserve license/source notes; define video/audio duration, codec, poster, caption and download disposition/access policy; QA-003/006; acceptance: malicious, mismatched and over-limit files are rejected by tested server paths and safe supported formats have documented limits. |
| C.23.13-07 | 2574 | - Image variants/responsive sources and cache invalidation; preserve old references safely when replacing. | RES-001–015, WEB-031/032, OPS-008 | OPEN — Media delivery owner; stable resource identity is distinct from immutable/versioned renditions; responsive sources and cache keys are deterministic; replacement creates a safe version transition and invalidates all relevant public caches without exposing private/draft media; QA-002/003/004/006; acceptance: old references remain valid or produce explicit migration diagnostics, and publish/replace/unpublish cache behavior is tested. |
| C.23.13-08 | 2575 | - Icon registry: searchable icons, categories, style/weight/size/color, custom approved SVG upload, icon accessibility mode. | RES-001–015, DSN-001–007, EDT-019/021 | OPEN — Icon Registry owner; icons are typed resources in the canonical registry, with searchable approved catalogue metadata and explicit style/weight/size/color/accessibility semantics; custom SVG upload is gated by the same sanitizer and permissions; QA-002/003/004/005; acceptance: selected icon properties serialize consistently and decorative versus meaningful icon accessibility output is testable. |
| C.23.13-09 | 2576 | - Font library: family/weight/style metadata, fallback and license notes. | RES-001–015, DSN-007, EDT-017/021 | OPEN — Font Resource owner; fonts are typed resources in the canonical registry with family, weight, style, format, fallback, origin and license metadata; loading is scoped, performant and failure-safe; no separate font storage/ownership authority; QA-002/004/005; acceptance: unavailable or disallowed fonts fall back predictably and metadata/license survives editing, publishing and export where supported. |
| C.23.13-10 | 2577 | - R2 stores binary data; D1 stores metadata/reference/ownership. No separate media/icon/font storage owner. | RES-001–015, OPS-005, SEC-001–011 | OPEN — Resource architecture owner; R2 is the binary-object authority and D1 is the metadata, site ownership, lifecycle and reference authority; no binary duplication in D1 and no parallel media/icon/font store; define consistency checks, failed-write compensation, orphan reconciliation and private/public delivery boundaries; QA-002/003/006; acceptance: storage and metadata invariants are verified under failure/retry and private objects cannot be fetched through public routes. |
| C.23.14-01 | 2581 | - Explicit saved/dirty/saving/saved/error/offline/conflict state; no decorative save indicators. | EDT-027–034, WEB-004–008, QA-002/004 | OPEN — Editor persistence owner; 1.0 release gate; editor role required; define a real persistence state machine tied to server acknowledgements and current revision; dirty/saving/saved/error/offline/conflict are distinct and accessible; acceptance: state transitions are derived from actual outcomes and no unconfirmed operation displays success. |
| C.23.14-02 | 2582 | - Autosave with debounce, retry/backoff, cancellation safety and dirty state reconciliation. | EDT-027–034, WEB-004–008, OPS-008, QA-002/004/006 | OPEN — Editor autosave owner; 1.0 recovery baseline; editor role required; define debounce cancellation, request identity, idempotent retry/backoff, ordering and dirty-state reconciliation against the canonical revision; acceptance: stale or cancelled requests cannot mark newer content saved or overwrite it. |
| C.23.14-03 | 2583 | - Manual save, save status, save/reload round-trip, recovery after refresh/tab close where safe. | EDT-027–034, WEB-004–008, OPS-009, QA-002/004/006 | OPEN — Editor save/recovery owner; 1.0 save/reload gate; editor role required; manual save and reload round-trip use canonical Page Model and revision API; local recovery is scoped, versioned and excludes credentials/private provider secrets; acceptance: valid edits survive save/reload and safe recovery without restoring stale state over newer server data. |
| C.23.14-04 | 2584 | - Preview draft, preview at viewport/breakpoint, preview as public visitor, protected preview token/route and noindex. | EDT-027–034, WEB-005/006, SEC-002, SEO-001–005 | OPEN — Preview owner; protected draft preview; editor role required and preview route/token protected; pin preview to an explicit draft revision and viewport/breakpoint, isolate preview cache/cookies from public output, apply noindex and expire/revoke preview access; QA-002/003/004; acceptance: correct draft is rendered and cannot be retrieved through public routes, caches or an expired/unauthorized token. |
| C.23.14-05 | 2585 | - Publish/unpublish/republish, published snapshot, publish validation, changed-page summary and confirmation. | EDT-027–034, WEB-004–008, SEC-002, QA-002/003/006 | OPEN — Publish owner; 1.0 publish gate; explicit publish permission required; validate a specific revision, present changed-page/resource impact and confirmation, then atomically promote the published snapshot and audit actor/time/revision; QA-002/003/006; acceptance: public output changes only after successful publication and failed publication leaves the prior published snapshot intact. |
| C.23.14-06 | 2586 | - Revision timeline, author/time/reason, diff/compare, restore/rollback, conflict handling and optimistic concurrency. | EDT-027–034, WEB-007/008, OPS-009, QA-002/006 | OPEN — Revision/recovery owner; full timeline/diff phased by persistence contract; editor role required and restore is a mutation; revisions identify author/time/reason and immutable target; compare and rollback use optimistic concurrency with conflict resolution; acceptance: restore is traceable and never silently overwrites a newer revision. |
| C.23.14-07 | 2587 | - Recovery after API/network failure; avoid lost changes, duplicate commands or stale overwrite. | EDT-027–034, WEB-007/008, OPS-008/009, QA-002/006 | OPEN — Editor resilience owner; 1.0 network recovery gate; editor role required; classify retryable/permanent errors, use idempotency keys for mutations, reconcile server revision before retry/recovery and prevent duplicate commands; acceptance: offline/API failure retains recoverable edits, avoids duplicate mutation and surfaces actionable conflict state. |
| C.23.14-08 | 2588 | - Bulk publish only with explicit preview and permission; public renderer must never expose unpublished data. | EDT-027–034, WEB-004–008, SEC-002, QA-002/003/006 | OPEN — Bulk publishing owner; deferred until per-page publish/permission/preview contract passes; publish permission required; show explicit selected-page impact, validate all targets, define atomic versus per-page partial outcome, and protect draft/private boundaries; acceptance: every page result is reported and no draft/private data becomes public on partial failure. |
| C.23.14-09 | 2589 | - Import/export/backup/restore schemas include versioning, validation, resource references, migration and rollback policy. | OPS-004–009, WEB-007/008, RES-001–015, SEC-002 | OPEN — Import/export/recovery owner; versioned packages phased by canonical schemas; export/import permission required; packages define schema version, ownership mapping, resource references, validation, migration, secret exclusion, dry-run, rollback and partial-failure behavior; QA-002/003/006/007; acceptance: invalid/cross-site references are rejected or explicitly mapped and restore can be verified without leaking credentials. |
| C.23.14-10 | 2590 | - Save, preview, publish, revision and rollback use existing canonical persistence/command contracts, not separate Editor-specific persistence. | EDT-001–005, EDT-027–034, WEB-004–008 | OPEN — Editor architecture owner; invariant across all phases; editor permission required; save, autosave, preview, publish, revisions, restore and import/export must use canonical persistence/command and ownership contracts, not Editor-only stores or bypass endpoints; QA-002/004/006; acceptance: contract and integration tests show one authoritative Page Model/revision/published-snapshot path. |
| C.23.15-01 | 2594 | - Per-site/page SEO title, meta description, canonical URL, index/follow controls, robots rules, sitemap and robots.txt. | SEO-001–005, WEB-001–013, SEC-001–011 | OPEN — SEO owner; 1.0 published-page metadata baseline; site-edit permission required; canonical route and published revision are authoritative; define title/description limits, canonical URL normalization, index/follow controls, sitemap inclusion and robots rules; drafts/previews are noindex and excluded from public sitemap; QA-002/003/004; acceptance: rendered metadata and crawler directives match the published page and route state. |
| C.23.15-02 | 2595 | - Open Graph/Twitter/social image preview, title/description, fallback image and per-page override. | SEO-001–005, WEB-031/032, RES-001–015 | OPEN — SEO/social preview owner; 1.0 Open Graph/social cards; site-edit permission required; define page override, site fallback and safe public image resolution; never expose private/draft assets or arbitrary unsafe URLs; QA-002/003/004; acceptance: rendered OG/Twitter metadata uses the intended public title/description/image with documented fallback and matches share preview. |
| C.23.15-03 | 2596 | - Structured data/schema where valid; canonical language/locale, hreflang where multilingual. | SEO-001–005, LOC-001–006, WEB-031/032 | OPEN — SEO/localization owner; structured data and hreflang only when valid content/locale contracts exist; site-edit permission required; generate schema from validated visible canonical content and canonical locale routes; omit unsupported or unverifiable fields rather than inventing them; QA-002/003/004; acceptance: structured data agrees with page content and hreflang targets are real, reciprocal and canonical. |
| C.23.15-04 | 2597 | - Heading structure, semantic landmarks, alt text, link purpose, descriptive labels and empty-alt handling. | WEB-031/032, QA-004/005, EDT-017/019 | OPEN — Accessibility owner; 1.0 semantic/alternative-text gate; editor role required for content authoring; define semantic heading hierarchy, landmarks, link purpose, form labels and decorative-versus-informative alt behavior across element schema and renderer; QA-004/005; acceptance: rendered public HTML is semantic and missing/invalid accessible names are diagnosed. |
| C.23.15-05 | 2598 | - Redirect manager and broken-link/404 diagnostics; duplicate title/description and missing metadata reports. | SEO-001–005, WEB-001–013, SEC-001–011 | OPEN — SEO/routing owner; redirects and broken-link reports phased with route contract; privileged site-edit permission required; validate source/destination, canonicalization, status codes, loop/chain/conflict and impact before activation; diagnostics identify broken internal links and duplicate/missing metadata; QA-002/003/004; acceptance: unsafe/conflicting redirects are blocked and approved changes are auditable. |
| C.23.15-06 | 2599 | - Public preview cards for social shares; validate image dimensions and external URL behavior. | SEO-001–005, WEB-031/032, RES-001–015 | OPEN — SEO/social preview owner; social card preview and image-dimension validation; site-edit permission required; preview must use the same resolver and fallback rules as public metadata; validate dimensions, format, reachability and public access without treating local preview as external crawler proof; QA-002/003/004; acceptance: preview matches published tags and flags inaccessible, private or unsuitable images/URLs. |
| C.23.15-07 | 2600 | - AEO/search discoverability metadata is additive and must not generate misleading structured data. | SEO-001–005, WEB-031/032, SEC-001–011 | OPEN — SEO owner; AEO/discoverability is additive only; site-edit permission required; generated summaries/schema must be grounded in visible page content and valid typed fields; no invented reviews, ratings, people, products, dates or claims; QA-002/003/004; acceptance: machine-readable metadata does not assert facts absent from the canonical published content. |
| C.23.15-08 | 2601 | - SEO panel distinguishes warning from blocking error and reports the exact affected page/element. | SEO-001–005, EDT-021/022, QA-002/004 | OPEN — SEO panel owner; 1.0 warning/error distinction; editor role required; every diagnostic carries severity, rule, affected page/element, remediation and whether publication is blocked; diagnostics are reproducible against a specified revision; QA-002/004; acceptance: advisory warnings remain distinct from release blockers and link to the exact affected source. |
| C.23.16-01 | 2605 | - Keyboard-only editor operation; visible focus; screen-reader labels; focus trap/return in modal UI. | EDT-037/039, QA-004/005 | OPEN — Accessibility owner; keyboard-only Editor and focus management gate; editor role required; define keyboard access for every editor command, visible focus, semantic names/states, modal focus containment and restoration, Escape/cancel behavior and no keyboard trap; QA-004/005; acceptance: keyboard-only and screen-reader tests cover selection, inspector, dialogs and recovery paths. |
| C.23.16-02 | 2606 | - Public semantic HTML, heading hierarchy, alt/caption/transcript, contrast checks, reduced motion and responsive zoom. | WEB-031/032, RES-007/013, DSN-001–007, QA-004/005 | OPEN — Accessibility owner; public semantic output and responsive zoom gate; editor role required to author metadata; define semantic headings/landmarks, image alternatives, media captions/transcripts, contrast, reflow/zoom and reduced-motion behavior across renderer and design tokens; QA-004/005; acceptance: automated checks plus manual keyboard/zoom/motion review pass against published output. |
| C.23.16-03 | 2607 | - Forms have labels, instructions, error summary, validation announcements and accessible success state. | WEB-020, EDT-019, SEC-007/011, QA-003/004/006 | OPEN — Forms + Accessibility owner; forms enabled only with canonical submit/validation contract; editor role required to configure; labels, instructions, field errors, error summary, async announcements and success state must be accessible; server validation remains authoritative; QA-003/004/006; acceptance: invalid, pending, failure and success states are announced and cannot be bypassed by client validation. |
| C.23.16-04 | 2608 | - Embed/iframe allowlist, sandbox and permissions policy; CSP/URL validation; no arbitrary script execution in Editor. | SEC-001–011, WEB-032, RES-001–015 | OPEN — Security owner; embed/upload security gate; Editor role does not grant script execution; enforce provider/domain allowlists, sandbox and permissions policy, strict URL parsing, CSP and consent rules; disallow arbitrary inline scripts; QA-003/008; acceptance: untrusted embeds and script payloads are blocked by server/rendering policy and tested in public output. |
| C.23.16-05 | 2609 | - External links, uploads, SVG, custom CSS and custom attributes require validation and safe output encoding. | SEC-001–011, RES-001–015, WEB-032 | OPEN — Security owner; safe external links/uploads/custom attributes; editor role required for configuration but output is untrusted; validate URL schemes/targets, sanitize uploaded SVG, validate file content and encode HTML/attributes/CSS contexts; arbitrary custom CSS/attributes require constrained policy; QA-003/008; acceptance: injection payloads are rejected or safely encoded in both stored data and rendered HTML. |
| C.23.16-06 | 2610 | - Consent/privacy controls for analytics, embeds, cookies and future marketing integrations; no secrets in Page Model/client output. | SEC-001–011, OPS-005, QA-003/008 | OPEN — Privacy/security owner; consent-aware analytics/embeds/cookies and future marketing; privileged integration configuration required; define purpose, consent state, opt-out and retention for non-essential tracking; secrets stay server-side and never enter Page Model, browser bundles or public responses; QA-003/008; acceptance: denied consent blocks optional tracking and secret scans find no credential leakage. |
| C.23.16-07 | 2611 | - Role/permission checks server-side for editing, publishing, resource access and global changes. | SEC-001–011, QA-003/008, EDT-027–034 | OPEN — Authorization owner; server-side permission gate for editing/publishing/resources/global changes; role/site/resource scope required; every read and mutation validates authenticated actor, action, site ownership and object scope; deny-by-default and re-check authorization at execution time; QA-003/008; acceptance: direct API requests, forged IDs and stale sessions cannot bypass UI permissions or cross-site boundaries. |
| C.23.16-08 | 2612 | - Every destructive/global mutation has confirmation as needed, audit evidence and recovery path. | SEC-001–011, OPS-005/009, QA-003/006 | OPEN — Destructive action owner; confirmation/audit/recovery gate; privileged role required; impact preview, confirmation proportional to blast radius, idempotent mutation, actor/time/target audit and tested rollback/recovery are required; acceptance: destructive and global mutations are traceable, safely retryable and recoverable or explicitly documented as irreversible. |
| C.23.16-09 | 2613 | - Accessibility/security findings are testable; no compliance claim without automated plus manual evidence. | SEC-001–011, QA-003/004/005/008 | OPEN — Security/accessibility verification owner; no compliance claim without evidence; define threat-focused automated tests plus manual assistive-tech, keyboard, contrast, zoom and reduced-motion review; retain reproducible reports and record exceptions; QA-003/004/005/008; acceptance: each finding has severity, scope, evidence, owner and resolution status, with no unsupported compliance assertion. |
| C.23.17-01 | 2617 | - Resizable/collapsible side panels, left/right panel state, canvas workspace, fullscreen/focus mode. | EDT-007/009, EDT-035/037, EDT-044, QA-002/004/005 | OPEN — Editor workspace owner; panel/workspace behavior phased by responsive acceptance; editor role required; define panel min/max bounds, collapse/restore, left/right layout, fullscreen/focus mode and canvas resize observation; panel state must not steal selection or change document content; QA-002/004/005; acceptance: canvas remains reachable and correctly sized, selection is stable and keyboard access survives layout changes. |
| C.23.17-02 | 2618 | - Quick Add, searchable command palette, keyboard shortcut map, shortcut conflict handling. | EDT-015, EDT-037/039, QA-002/004/005 | OPEN — Quick Add/Command owner; searchable add and keyboard shortcuts phased by action registry; editor role required; palette entries reference typed canonical commands with permission, context and availability checks; shortcuts declare scope, precedence and conflict handling; QA-002/004/005; acceptance: each action resolves to one handler, unavailable actions explain why and shortcut collisions are detectable. |
| C.23.17-03 | 2619 | - Selection breadcrumb, recent nodes, favorites, recent assets/templates and contextual actions. | EDT-012–016, EDT-015, DSN-008–018 | OPEN — Editor navigation owner; breadcrumbs/recent/favorites phased by stable IDs; editor role required; derive breadcrumb from current canonical selection and node ancestry; recent/favorites/assets/templates reference registry IDs and tolerate deletion/movement; browsing is read-only; acceptance: stale items resolve safely and navigation never mutates Page Model. |
| C.23.17-04 | 2620 | - Inspector pinning/favorites, property search, panel state persistence per user. | EDT-021–024, EDT-044, QA-002/004 | OPEN — Inspector UX owner; favorites/search/panel preference phased; editor role required; property search/favorites are derived from the property registry and preferences are user-scoped, versioned and independent from site content; QA-002/004; acceptance: settings persist for the user without dirtying Page Model or bypassing property validation. |
| C.23.17-05 | 2621 | - Inline text editing with clear exit/commit/cancel behavior and no accidental selection loss. | EDT-003–006, EDT-017/022, QA-002/004 | OPEN — Inline text editing owner; 1.0 text interaction gate; editor role required; define enter/edit/commit/cancel/blur semantics, keyboard navigation and composition/input behavior; commits use canonical undoable commands and preserve selection; acceptance: cancel restores pre-edit value, commit creates one correct history operation and accidental blur does not lose text. |
| C.23.17-06 | 2622 | - Empty-state onboarding, contextual help, non-blocking diagnostics, actionable error messages. | EDT-037/039, QA-002/004/005 | OPEN — Editor onboarding owner; 1.0 usability baseline; editor role required; empty states explain the next safe action; diagnostics link to affected node/property and provide remediation, retry or recovery where possible; acceptance: permission, network, missing-resource and invalid-document errors are actionable and do not dead-end. |
| C.23.17-07 | 2623 | - Editor preferences are separate from site content: zoom, panel layout, grid visibility and default viewport. | EDT-007, EDT-035/037, EDT-044, QA-002/004 | OPEN — Editor preferences owner; preferences separate from site content; authenticated user required; define schema/version/default/reset and cross-device persistence policy for zoom, panels, grid and default viewport; acceptance: changing preferences never dirties the document, changes published output or enters Page Model serialization. |
| C.23.17-08 | 2624 | - Tablet/touch support is separately acceptance-tested; tablet login remains a separate deferred item and is not silently conflated with Editor touch UX. | EDT-035–037, QA-004/005, SEC-001–011 | OPEN — Tablet/touch acceptance owner; deferred tablet login remains a separate issue; editor role required; maintain a browser/device matrix for touch targets, gestures, pointer cancellation, canvas/panel resizing and virtual keyboard; do not conflate login/authentication defects with Editor interaction defects; QA-004/005; acceptance: touch UX is separately tested on target tablet browsers. |
| C.23.17-09 | 2625 | - Localization-ready editor strings and accessible error/status announcements. | LOC-001–006, EDT-037, WEB-032, QA-004/005 | OPEN — Localization/accessibility owner; Hungarian-first with localization-ready strings; editor role required; move UI messages, labels, errors and shortcut descriptions to a message catalog with locale fallback and pluralization; announce state changes accessibly; acceptance: no user-facing control logic depends on hardcoded Hungarian strings and key status/error announcements are tested. |
| C.23.18-01 | 2629 | - Twitch: connection status, live/offline, title/game/channel link, permitted live/player/embed, schedule binding, error/stale state and safe disconnect/reconnect UX. | INT-001–012, LIV-001–007, SCH-007–011, SEC-001–011 | OPEN — Twitch integration block owner; 1.0 baseline only for verified provider scopes; editor role required to configure and provider scope applies; read status through canonical adapter with freshness timestamp and explicit live/offline/stale/error states; player/embed and disconnect/reconnect obey consent, origin, token and ownership rules; QA-002/003/004/008; acceptance: displayed status is provider-grounded and reconnect/disconnect does not orphan or cross-bind a connection. |
| C.23.18-02 | 2630 | - YouTube/TikTok/Discord: 1.0 static link/basic embed only where explicitly scoped; API-backed integrations remain in their roadmap phases. | INT-013–016, WEB-022/026, SEC-001–011 | OPEN — Other platform block owner; 1.0 static links/basic embeds only where approved; API-backed features remain in explicit roadmap phases; provider capability registry determines supported state and consent/security policy; acceptance: UI never implies account connected, live metrics or API functionality unless verified and implemented. |
| C.23.18-03 | 2631 | - Schedule: domain-owned events, timezone, start/end, recurrence where approved, status, platform, game, artwork, URL, filters, views and sync provenance; no Page Model duplicate schedule records. | SCH-001–015, DYN-001–008, EDT-020, SEC-002 | OPEN — Schedule block owner; schedule records and sync provenance remain owned by canonical Schedule domain; editor role controls presentation config only and schedule mutations use Schedule APIs; timezone, event status, recurrence and provider sync semantics are explicit; QA-002/003/004; acceptance: block renders canonical events and never duplicates events in Page Model. |
| C.23.18-04 | 2632 | - Stream content: VOD/clip/Short/highlight link/embed baseline; canonical media workflows in their planned phase. | CNT-001–020, RES-001–015, WEB-017/032, SEC-002 | OPEN — Stream content block owner; VOD/clip/Short/highlight support phased by content and resource contracts; editor role required; use canonical content/resource references and provider-approved URLs/embed modes; define unavailable, deleted, private and rate-limited provider behavior; acceptance: no duplicate content authority and unavailable/private content degrades safely. |
| C.23.18-05 | 2633 | - Creator profile/game profiles, social links, community invite, support/funding/press kit blocks. | SET-001–003, SCH-012–014, WEB-018–024, COM-001–018, SUP-001–012 | OPEN — Creator profile block owner; profile/game/social/community/support/press data are configurable, site-scoped and phase-gated; editor role required; external links and funding/payment state are validated and truthful; acceptance: no hardcoded personal target, fake payment status, exposed provider secret or unsafe invite/link is rendered. |
| C.23.18-06 | 2634 | - Future overlay/widget/alert/OBS browser-source blocks use a separate Stream Studio contract, not arbitrary Editor nodes that bypass it. | OBS-001–010, SEC-001–011, OPS-005 | OPEN — Stream Studio boundary owner; overlays/alerts/OBS browser-source blocks are future-gated and use a separate authenticated Stream Studio contract; Editor public nodes cannot issue OBS commands or expose privileged runtime channels; acceptance: integration/security tests prove isolation between public site renderer and stream-control runtime. |
| C.23.18-07 | 2635 | - Integration block exposes connection/permission/availability states; secrets and tokens never become editable public properties. | INT-001–021, SEC-001–011, EDT-021/022 | OPEN — Integration block owner; expose safe connection/capability/freshness states only; editor role required to configure; credentials and tokens remain server-side and are excluded from Page Model, editor property schema, logs and public output; acceptance: secret scans and direct API tests show no token/secret disclosure. |
| C.23.18-08 | 2636 | - Every provider block uses the canonical integration adapter and consistent loading/empty/error/offline handling. | INT-001–021, DYN-005/006, QA-002/003/004 | OPEN — Integration adapter owner; every provider block consumes canonical adapter DTOs and shared loading/empty/error/offline/stale/permission-denied states; provider scopes, freshness, rate limits and retry behavior are explicit; acceptance: adapters have consistent state semantics and one provider failure cannot expose another site's data. |
| C.23.19-01 | 2640 | - Find/replace content with preview and undo; page/node/resource search; usage/reference search. | EDT-015/037/039, RES-001–015, WEB-001–013 | OPEN — Search/find-replace owner; site-scoped search and preview/undo; editor role required; index canonical pages/nodes/resources with explicit field scope; replacements preview exact targets and before/after values, validate type and binding, execute as one bounded undoable command; QA-002/003/004; acceptance: preview is complete for the selected scope and undo restores the exact prior values. |
| C.23.19-02 | 2641 | - Bulk apply style/token/preset to selected compatible nodes, with mixed-state handling and change summary. | EDT-005/006, EDT-021/022, DSN-001–018 | OPEN — Bulk style operation owner; compatible selection and mixed-state model required; editor role required; apply only schema-compatible properties, show mixed/unchanged/unsupported counts and a change summary, validate constraints and use one undoable command; acceptance: incompatible nodes remain unchanged and full bulk operation is reversible. |
| C.23.19-03 | 2642 | - Find broken links, missing images, orphaned assets, duplicate IDs/slugs, missing alt text and unsupported bindings. | RES-001–015, WEB-001–013, SEO-001–005, EDT-001/002, DYN-001–008 | OPEN — Site health diagnostics owner; read permission required; depends on route/resource/binding validation; distinguish missing, inaccessible, deleted and unsupported resources; detect broken links, duplicate identifiers/slugs, missing alt and invalid bindings without leaking private targets; QA-002/003/004; acceptance: findings are reproducible and identify exact page/node/resource and remediation. |
| C.23.19-04 | 2643 | - Site health panel for unpublished changes, broken bindings, missing required fields, page-level warnings and failed integrations. | WEB-001–013, DYN-001–008, INT-001–021, OPS-001–010 | OPEN — Site health panel owner; admin/read scopes required; depends on publication, binding and integration status sources; aggregate authoritative timestamps and source status, distinguish warning/error/stale/unknown and link to the affected page; acceptance: panel reports only verified health signals and never invents provider or publication status. |
| C.23.19-05 | 2644 | - Bulk archive/restore/delete/publish only with permission, impact preview and recoverability. | EDT-005/032, WEB-001–013, RES-001–015, SEC-001–011 | OPEN — Bulk lifecycle owner; privileged role required; depends on impact preview, confirmation, audit and restore; validate the full target set and per-item permissions before execution, define atomic versus partial outcomes and idempotent retry; QA-002/003/006; acceptance: results are reported per item, unauthorized targets are not changed and recoverable actions can be restored. |
| C.23.19-06 | 2645 | - Global change impact map: pages, shared components, templates, tokens and presets affected. | DSN-003/004, DSN-008–018, RES-001–015, WEB-001–013 | OPEN — Global change impact owner; global edit permission required; depends on complete typed usage/reference map; resolve transitive usage across pages, shared components, templates, tokens and presets, and show direct/indirect impact before mutation; acceptance: known dependent pages are identified before apply and stale/incomplete impact data is flagged. |
| C.23.19-07 | 2646 | - Page compare, revision compare, template diff and resource replacement impact preview. | WEB-007/008, DSN-008–018, RES-001–015, EDT-001/002 | OPEN — Compare/diff owner; editor role required; depends on immutable revisions and template/resource diff contract; compare is read-only and identifies semantic changes, changed references and exact restore target; distinguish content, metadata, style and resource-version changes; acceptance: diffs are stable, permission-scoped and support a verified rollback target. |
| C.23.19-08 | 2647 | - Search and command operations are site-scoped and permission-aware. | SEC-001–011, WEB-001–013, RES-001–015, DYN-001–008 | OPEN — Site-scoped command owner; server-side site/role/resource checks required; every search result and mutation revalidates tenant/site ownership and current permission; no client-supplied IDs, filters or bulk selections can bypass scope; QA-003/008; acceptance: cross-site reads and writes are denied and audit logs identify denied privileged attempts where appropriate. |
| C.23.20-01 | 2651 | - Canonical extension points: component schema/renderer, property registry, command API, resource type registry, template registry, integration adapter and diagnostics. | EDT-001–042, DSN-001–018, RES-001–015, INT-001–021, OPS-001–010 | OPEN — Extension architecture owner; registry boundaries invariant; architecture approval required; define canonical extension points and ownership for component schema/renderer, property registry, commands, resources, templates, integration adapters and diagnostics; extension registration/versioning cannot create parallel persistence or bypass permission checks; QA-002/003/004; acceptance: each extension type has one owner, schema, lifecycle and compatibility policy. |
| C.23.20-02 | 2652 | - Future custom CSS, HTML/embed and third-party component support only through reviewed, sandboxed, permissioned contracts. | SEC-001–011, WEB-032, OPS-005, QA-003/008 | OPEN — Custom extension security owner; future sandboxed scope only; admin/editor role does not authorize arbitrary HTML/script; custom CSS/HTML/embed/third-party components require explicit capability policy, review, sandbox, CSP, allowlists and resource limits; acceptance: unsupported custom execution remains unavailable until security tests and rollback exist. |
| C.23.20-03 | 2653 | - No direct client mutation of D1/R2 and no arbitrary privileged JavaScript. | SEC-001–011, RES-001–015, OPS-005, QA-003/008 | OPEN — Data boundary owner; invariant across all phases; clients cannot directly mutate D1/R2 or execute privileged JavaScript; all writes pass through authenticated, site-scoped domain APIs with schema validation, audit and ownership checks; QA-003/008; acceptance: direct storage/privileged-script attempts are impossible from client and unauthorized server mutations are rejected. |
| C.23.20-04 | 2654 | - AI may propose edits to Page Model/commands, generate content, map responsive layouts or suggest presets, but must use shared Action API. | AI-001–020, EDT-001–042, SEC-001–011 | OPEN — AI Action API owner; future AI features only through canonical command/action API; permission and schema validation required; AI proposals are typed, scoped, validated Page Model changes with preview/diff; no direct database, resource-storage or arbitrary HTML writes; QA-002/003/008; acceptance: AI-generated edits use the same command handlers, history and authorization as manual edits. |
| C.23.20-05 | 2655 | - AI changes require preview-before-apply, diff, validation, explicit approval where destructive/global, undo and audit. | AI-001–020, EDT-005/032, SEC-001–011, OPS-005 | OPEN — AI safety owner; preview-before-apply gate; editor role plus explicit approval for destructive/global changes; require before/after diff, validation, affected-scope summary, explicit approval, undo/recovery and audit; publication remains a separate explicit authorized action; acceptance: no destructive/global AI mutation occurs before approved preview. |
| C.23.20-06 | 2656 | - AI must not silently publish, change auth/secrets, overwrite user content or execute arbitrary external code. | AI-001–020, SEC-001–011, OPS-005 | OPEN — AI permission owner; hard safety invariant; AI cannot silently publish, change auth/secrets, overwrite user content or run arbitrary code; enforce denied capabilities server-side and revalidate permissions on execution; acceptance: tests demonstrate blocked publish, secret/auth mutation, stale overwrite and arbitrary-code requests. |
| C.23.20-07 | 2657 | - Future marketplace/shared libraries require license/source metadata, compatibility/version constraints, dependency inventory, safe import, sandbox and rollback. | MKT-001–005, DSN-008–018, RES-001–015, SEC-001–011, OPS-005/010 | OPEN — Marketplace/library owner; future scope only; require license/source provenance, version/compatibility constraints, dependency inventory, vulnerability review, sandbox/capability limits, safe import and rollback; acceptance: untrusted packages cannot execute or mutate site before validation and explicit installation approval. |
| C.23.20-08 | 2658 | - Export/import packages need schema version, dependency manifest, media references and validation before applying. | OPS-004–009, RES-001–015, DSN-008–018, SEC-001–011 | OPEN — Package import/export owner; schema/dependency/media manifest required; import permission required; validate package version, signatures/integrity where supported, ownership mapping, dependency compatibility, resource references and size/limits before apply; define dry-run and rollback for partial failures; QA-002/003/006/007; acceptance: invalid package is rejected before mutation and failure cannot leave an unreported partial site state. |
| C.23.21-01 | 2663 | - unit tests for pure layout/geometry/preset/schema helpers; | QA-001–008, EDT-001–042 | OPEN — QA owner; pure helper unit tests release gate; deterministic fixtures and property-based/boundary cases where useful; layout, geometry, presets and schema helpers must be independent of browser timing; acceptance: repeatable tests cover normal, boundary and invalid inputs and report exact failures. |
| C.23.21-02 | 2664 | - command/history/undo/redo and Page Model round-trip tests; | QA-001–008, EDT-003–007, EDT-027–034 | OPEN — QA + Editor command owner; command/history round-trip gate; canonical command API and Page Model are authoritative; test undo/redo stacks, selection-independent command results, serialization and reload; acceptance: round-trip restores exact intended state without lost fields, duplicate operations or hidden mutations. |
| C.23.21-03 | 2665 | - property validation, invalid nesting and malformed import tests; | QA-001–008, EDT-021/022, EDT-001/002, OPS-004–006 | OPEN — QA + validation owner; malformed input release gate; test invalid property types, impossible nesting, unknown schema versions, malformed/cross-site imports and partial failure; acceptance: invalid data is rejected before mutation or rolled back completely with actionable diagnostics. |
| C.23.21-04 | 2666 | - breakpoint inheritance/override/reset tests; | QA-001–008, EDT-023–026, DSN-006 | OPEN — QA + Responsive owner; breakpoint inheritance tests; exercise default inheritance, explicit override, reset-to-inherit, copy and clear across breakpoint transitions; acceptance: child overrides never mutate parent/base values and persisted state matches preview. |
| C.23.21-05 | 2667 | - canvas geometry tests at zoom levels, long pages, negative/large Y movement and content growth; | QA-001–008, EDT-007–010, EDT-027/030/042 | OPEN — QA + Canvas owner; geometry regression gate; cover multiple zoom factors, long documents, negative/large Y movement, drag/resize, panel changes and content growth; acceptance: canvas extent/scrolling follows content and saved geometry round-trips without clipping or coordinate drift. |
| C.23.21-06 | 2668 | - preset apply/merge/replace/reset/fork/undo and shared-instance impact tests; | QA-001–008, EDT-005/006, DSN-008–018 | OPEN — QA + Preset owner; preset lifecycle gate; test apply/merge/replace/reset/fork/undo and all shared-instance impact; acceptance: scoped changes affect only intended nodes/instances and undo restores prior values and relationships. |
| C.23.21-07 | 2669 | - component/template/token migration and broken-reference tests; | QA-001–008, DSN-001–018, RES-001–015, OPS-004–006 | OPEN — QA + migration owner; migration/reference gate; exercise component/template/token schema versions, stable ID policy, dependency upgrades and deleted/missing references; acceptance: migrations are deterministic/recoverable and broken references are reported without silent data loss. |
| C.23.21-08 | 2670 | - save/reload, revision conflict, publish isolation and rollback tests; | QA-001–008, EDT-027–034, WEB-004–008 | OPEN — QA + persistence owner; save/publish gate; test save/reload, delayed and failed requests, optimistic conflict, draft/public isolation, publish failure and rollback; acceptance: prior published snapshot survives failed operations and no draft/private data leaks into public output. |
| C.23.21-09 | 2671 | - keyboard/touch/browser accessibility tests; | QA-001–008, EDT-035–037, WEB-032 | OPEN — QA + accessibility owner; keyboard/touch/browser gate; define supported browser/viewport/device matrix and manually verify keyboard, focus, touch targets, pointer cancellation, screen-reader names and zoom/reflow; acceptance: reproducible evidence covers each supported matrix entry and limitations are explicit. |
| C.23.21-10 | 2672 | - public renderer, SEO, performance, reduced-motion and privacy tests; | QA-001–008, WEB-031/032, SEO-001–005, SEC-001–011, OPS-008 | OPEN — QA + public renderer owner; public quality gate; test semantic output, canonical metadata, sitemap/robots, social cards, performance budgets, reduced-motion, consent/privacy and cache invalidation; acceptance: results are tied to exact build/revision with failures and exceptions recorded. |
| C.23.21-11 | 2673 | - production runtime acceptance for any behavior whose correctness cannot be established by unit tests alone. | QA-001–008, OPS-001–010, SEC-001–011 | OPEN — Runtime acceptance owner; production runtime evidence required where unit tests are insufficient; record commit/build, environment, prerequisites, exact steps, expected and observed results, logs/screenshots where relevant and rollback; acceptance: no PASS is inferred from source review or documentation alone. |
| C.23.22-01 | 2679 | - **Canvas drag/resize acceptance:** the user has confirmed that the canvas now behaves correctly; the previous canvas-height defect is no longer the active blocker. Preserve the merged implementation and regression tests. The active continuation is Layers/Inspector/responsive integration. Do not start a parallel feature branch/workstream from this appendix. | EDT-003/004, EDT-007–010, QA-002/004/005 | OPEN — Editor + QA owners; user-confirmed behavior is historical evidence, not a substitute for current regression tests; dependency: canonical canvas geometry, resize/drag state and responsive viewport contracts; acceptance: retained regression tests cover drag, resize, canvas-height recalculation, undo/redo and narrow/wide viewport behavior; active implementation remains frozen during P0 audit |
| C.23.22-02 | 2680 | - The immediate F0.4 continuation is Layers + Inspector + responsive behavior using the existing Page Model, command/history/validation and property registry. | EDT-001–044, DSN-001–018, QA-002/004/005 | OPEN — Historical sequencing note; Editor + Design System owners; F0.4 is superseded by P0.2 and does not authorize implementation; dependency: canonical Page Model, command/history/validation and Property Registry contracts; acceptance: Layers, Inspector and responsive requirements remain in the single ordered roadmap with no duplicate model or parallel workstream |
| C.23.22-03 | 2681 | - Foundational Editor interactions and the smallest useful set of element types are implemented before expanding the full component catalog. | EDT-001–044, QA-001–005 | OPEN — Product + Editor + QA owners; foundational interactions and minimal element set precede catalog expansion; dependency: P0 audit closure, canonical Page Model/command/history/validation and typed renderer support; acceptance: each enabled element has a declared schema, safe renderer, editing/undo behavior and regression coverage before catalog expansion |
| C.23.22-04 | 2682 | - Presets, tokens, templates and reusable components must be architecturally reserved now, but are implemented only when their canonical registries/contracts and dependency order are ready. | DSN-001–018, RES-001–015, EDT-001–044 | OPEN — Design System + Resource + Editor owners; planned until canonical registries/contracts and dependency order are approved; dependency: ownership, scope, versioning and Resource contracts; acceptance: each capability has one canonical registry/store, declared owner and phase gate before implementation; no duplicate stores |
| C.23.22-05 | 2683 | - 1.0 vs. 1.x+ assignment follows 00.9.6.D and the current product scope. A capability omitted from 1.0 remains explicitly planned; it is not deleted. | LOC-001–006, WEB-001–032, §39.2 | OPEN — Product scope/roadmap owner; final phase allocation is blocked until original 00.9.6.D is recovered and reconciled; acceptance: every deferred capability remains in the registry with an explicit phase/reason and no deletion by omission |
| C.23.22-06 | 2684 | - Do not build every advanced feature before the basic editor is reliable. Prefer a complete, testable capability inventory and a single dependency-ordered implementation path over rushed parallel work. | EDT-001–044, QA-001–010 | OPEN — Product + Editor + QA owners; feature implementation remains frozen during P0.2; dependency: reconciled inventory, explicit feature contracts and approved phase ordering; acceptance: one dependency-ordered implementation path, no parallel feature workstream, and basic Editor reliability gates precede advanced scope |
| C.23.22-07 | 2685 | - This appendix adds no second editor, no second Page Model, no second Property Registry, no second Resource store, no second Schedule domain and no alternate save/publish route. | EDT-001–044, DSN-001–018, RES-001–015, SCH-001–015, WEB-001–032 | OPEN — Architecture + domain owners; invariant across all phases; dependency: canonical ownership contracts for Editor/Page Model/Property Registry/Resource/Schedule/save-publish; acceptance: exactly one canonical implementation/store/route per listed domain and regression checks reject duplicate models or alternate mutation/publish paths |

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
| ARCH-3365 | 3365 | - Twitch: OAuth/connection, live/offline, title/game/category, viewer/follower/subscriber statisztikák csak ahol az API és scope engedi, VOD, clips, webhook/event, sync state és hibadiagnosztika. | INT-003–INT-012, INT-017–INT-020, LIV-001–LIV-007, SEC-004/008/009/010, SCH-007/008 | OPEN — Twitch-specific contract; distinguish OAuth/site binding and scope, normalized live data/freshness, permitted VOD/clip metadata, webhook verification, sync/error/recovery. Metrics remain capability- and scope-gated; phase and acceptance evidence still required |
| ARCH-3366 | 3366 | - YouTube: channel, video, Shorts, rendelkezésre álló analytics; quota limit, API hiba, hiányzó scope és fallback. | INT-001/002/006/008/009/013/018/019/020, CNT-001–CNT-006, ANL-001–ANL-009, SEC-008/010/011 | OPEN — YouTube adapter must expose only documented/account-authorized capabilities; cover quota/error/missing-scope/fallback and data freshness; Content/Analytics domains remain canonical and provider-specific scope needs evidence |
| ARCH-3367 | 3367 | - TikTok: profile/content csak a hivatalosan és adott accountnál rendelkezésre álló API-képesség szerint; rate limit/fallback és kézi link/import. | INT-001/002/006/008/009/014/018/019/020, CNT-001–CNT-006, SEC-007/008/010/011 | OPEN — TikTok features are capability-gated per approved API/account scope; document rate limits, fallback and manual link/import path; no scraping or invented availability implied; phase/acceptance remain open |
| ARCH-3368 | 3368 | - Discord alapként közösségi link; bot/role/status funkció csak külön integrációs scope-pal. Kick, OBS, e-mail, payment és commerce adapterek saját contractot kapnak. | INT-001/002/003/005–009/015/016/018–021, OBS-002–OBS-009, SUP-001–SUP-012, STO-001–STO-020, SEC-002/003/008/009/010/011 | OPEN — Discord social link is the baseline; bot/role/status and Kick/OBS/email/payment/commerce each require separate provider contract, permissions, data handling, lifecycle and phase acceptance; broad future domain families are not a claim of 1.0 scope |
| ARCH-3369 | 3369 | - A provider-adatot canonical domain state-re kell normalizálni; egy külső API kiesése nem teheti használhatatlanná az oldalt. Hiányzó statisztikát nem szabad kitalált számmal pótolni. | INT-001/002/008/009/018–020, DYN-001/005/006/007/008, OPS-003/007, QA-002/003/006/008 | OPEN — normalize provider data through canonical adapters; explicitly represent stale/missing/error states and last success, use safe fallback, and never fabricate metrics; verify site scope, diagnostics and provider-outage behavior |
| ARCH-3373 | 3373 | - Canonical Schedule item mezői: title, description, start/end, timezone, platform, game/category, artwork, stream link, visibility, featured, lifecycle status, recurrence, manual override és external ID. | SCH-001, SCH-003–SCH-008, SCH-012–SCH-014, RES-013, SEC-002/003 | OPEN — canonical Schedule owns these fields; validate timezone/DST, recurrence scope, lifecycle, external identity, ownership and media references; phase advanced recurrence separately and do not duplicate game profile data into event rows |
| ARCH-3374 | 3374 | - List/calendar/upcoming/past nézetek, keresés, szűrés és rendezés; cancelled/postponed/completed/live/planned állapotok. | SCH-001/002/005/010, WEB-016, QA-002/004 | OPEN — distinguish Schedule domain lifecycle from its list/calendar/public presentation; verify site-scoped search/filter/sort and correct upcoming/past treatment for every lifecycle state |
| ARCH-3375 | 3375 | - DST/időzóna helyes kezelése; recurrence szerkesztése csak esemény / ettől a jövőben / teljes sorozat scope szerint, amennyiben ez a funkció támogatott. | SCH-003/004, LOC-002, QA-002/004 | OPEN — require DST boundary and timezone round-trip tests; expose occurrence/this-and-future/whole-series editing only where recurrence support exists, with explicit scope and no silent series-wide mutation |
| ARCH-3376 | 3376 | - Next-stream és countdown a canonical schedule, site timezone és hiteles live state alapján számoljon; lemondott vagy múltbeli esemény ne maradjon hibásan következő adásként. | SCH-003/005/009/010, INT-011, LIV-001/002, DYN-005/006/007, QA-002/004/006 | OPEN — compute next stream from canonical Schedule and site timezone, reconcile with trustworthy live state, and exclude cancelled/completed/past items; test stale provider data, DST and countdown refresh |
| ARCH-3377 | 3377 | - VOD/clip/Short összekapcsolható legyen az adott adással, kategorizálható legyen és bekerülhessen a content calendarba. Editorban a Schedule blokk megjelenítése konfigurálható, de a Schedule domainadat nem. | SCH-001/011/014, CNT-001–CNT-006, INT-001/012/013/014, RES-001–RES-016, EDT-020, QA-002/003/004 | OPEN — link content to Schedule via stable canonical IDs/provider IDs; content categorization/calendar placement belongs to Content; Editor changes presentation only and must not mutate Schedule domain records |
| ARCH-3381 | 3381 | - Az Admin shellből mindig elérhető az Admin főoldal, az aktuális modul/breadcrumb, a publikus oldal megnyitása, profil/session állapot, logout, help és értesítések. Mobilon külön responsive shell kell. | ADM-001/007/008/010, WEB-012, SEC-001, QA-004/008 | OPEN — define shell navigation and responsive acceptance separately from module features; session/profile/logout state must reflect server truth, and public-site opening must preserve the intended route/context |
| ARCH-3382 | 3382 | - Minden modulban loading/empty/error/success/disabled state, save/unsaved state, inline validation, veszélyes művelethez confirm, keresés/filter/sort/pagination és indokolt tömeges műveletek legyenek; billentyűzetes működés és egyértelmű magyar UI-szöveg az 1.0-ban. | ADM-008/009, EDT-021/022, WEB-011, QA-002/004/005 | OPEN — shared states and controls must be implemented in the owning module, not forced into one overloaded global screen; test keyboard/focus, Hungarian messages, unsaved changes, confirmations and relevant list operations per module |
| ARCH-3383 | 3383 | - Lejárt session kezelése szerveroldali policy szerint: logout/session invalidation, inactivity timeout, több tab és nem mentett változtatás figyelmeztetése; admin/API jogosultság nélkül nem használható. | SEC-001/002/004/007, ADM-007, QA-003/004 | OPEN — session expiry and invalidation must be server-enforced; cover multi-tab expiry, inactivity policy, logout, unauthorized API rejection and unsaved-change warning without treating client-side hiding as authorization |
| ARCH-3384 | 3384 | - Public form: field schema, required/optional, labels, kliens- és szervervalidáció, spam/rate-limit védelem, success/error state és privacy notice. | WEB-020, SEC-005/007/011, QA-002/003/005 | OPEN — define field schema and truthful success/error states; validate on server, apply abuse/request limits and purpose-specific privacy notice; prove no unauthorized data exposure and accessible labels/focus |
| ARCH-3385 | 3385 | - Store Manager: termék create/edit/duplicate/archive, variáns/SKU/ár/pénznem/kategória/collection/SEO/stock abstraction, order/payment/fulfillment status, refund/cancel/tracking és provider error. A storefront csak canonical product/collection adatot renderel. | STO-001–STO-020, SEC-002/003/010/011, SEO-001/002/005, QA-002/003/006/008 | OPEN — separate catalog/product, order, payment and fulfillment lifecycles; storefront is a read/render surface for canonical product/collection state, and all mutations require server-side owner/permission checks; phase and payment-provider scope remain explicit |
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
| ARCH-3404 | 3404 | - Session/cookie: HttpOnly, Secure, helyes SameSite; expiry, inactivity timeout, logout/session invalidation. Megfelelő password hash, auth rate limiting, RBAC, szerveroldali can permission check, CSRF/Origin protection a választott auth modellnek megfelelően, input/output validation, OAuth state/PKCE, webhook signature/replay defense és upload validation. | SEC-001–SEC-009, SEC-010, SEC-011, INT-003/004/017, RES-009/010/014, QA-001/002/003/006 | OPEN — split the security control families into independently testable contracts: session/cookie/password/rate-limit, server authorization/CSRF, input/output and upload validation, OAuth state/PKCE, webhook signature/replay and secret/audit/privacy handling; map each implementation to its actual boundary and test evidence |
| ARCH-3405 | 3405 | - Minden publikus, preview és admin route-nak saját jogosultsági határa van; preview nem leakelhet draftot, log/export nem leakelhet tokent. | SEC-001/002/003/008/010, WEB-004/005/006/007/012, OPS-002/005, QA-003/006 | OPEN — verify route-by-route public/published, authenticated admin and authorized preview boundaries; negative tests must cover draft leakage, cross-site access and token/secret exposure in logs or exports |
| ARCH-3406 | 3406 | - Performance: JS bundle, lazy loading, image dimensions/variants, cache invalidation, Core Web Vitals, nagy page/tree history-memória és autosave overhead, API latency és production smoke. Számszerű budget a mérési baseline után rögzítendő. | OPS-008, RES-004/005/015, WEB-030, EDT-005/006/007/030, QA-004/005/006/010 | OPEN — establish a measured baseline before numeric budgets; separately measure public JS/image/layout-shift/cache behavior, Editor tree/history/autosave cost and API latency; production smoke is required and no unmeasured budget may be claimed |
| ARCH-3407 | 3407 | - Visual regression baseline: publikus home/navigation/Schedule, Editor core state és desktop/tablet/mobile. | QA-004/005/006, WEB-010/011/014/016, EDT-001/007/020/024/025/035 | OPEN — maintain explicit screenshots/fixtures for public home/navigation/Schedule and canonical Editor states at desktop/tablet/mobile viewports; compare meaningful states and review diffs rather than relying on a single generic responsive test |
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

### 41.3.11. P0.2 — Canonical MASTER content restoration and verification (2026-10-14)

**Hiba észlelése:** a `v2/foundation` ágon a kanonikus `docs/MASTER-DEVELOPMENT-PLAN.md` útvonal olvasása üres tartalmat adott vissza (0 karakter), miközben a korábbi, P0.2 állapotot és a 37.3, 37.9–37.32, valamint 41. fejezet auditnyomát tartalmazó `c21997f` commitban a teljes MASTER elérhető volt.

**Végrehajtott helyreállítás:** a teljes, ellenőrzött `c21997f` forrástartalom visszaállítva ugyanarra a kanonikus útvonalra a `v2/foundation` ágon. Helyreállítási commit: `91c776490bb9a24d22ac6c0ff13887277f918ce3`. A visszaolvasás megerősítette: 658 992 karakter, 3 915 sor; a P0.2 aktív pont, a 41.3.10 forrás-visszakeresési bizonyítékhatár és a `P0.2 IN PROGRESS / NOT PASS` státusz megmaradt.

**Hatókör és korlát:** ez dokumentum-integritási javítás, nem feature-implementáció és nem P0.2 lezárás. A hiányzó eredeti `00/A` és `00.9–00.9.6.B` források továbbra is `UNRECOVERED / OPEN`; a teljes 359 funkció-ID kétirányú reconciliációja, a mappingek szemantikai ellenőrzése és az ID-szintű acceptance/permission/dependency/evidence kitöltés nem tekinthető teljesítettnek. A következő munka továbbra is kizárólag P0.2 forrás-visszakeresés és tételes reconciliáció, párhuzamos feature-fejlesztés nélkül. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.12. P0.2 — H19–H34 archive ledger row-by-row structural reconciliation (2026-10-14)

**Források:** a jelen MASTER `§40.1–§40.16` H19–H34 ledgerje és az archivált `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` `M0.1 historical traceability ledger` táblái (batch 1: H19–H22; batch 2: H23–H34). A két fájl a `v2/foundation` ágon online visszaolvasással ellenőrizve.

**Elvégzett ellenőrzés és eredmény:**
- [x] Az archív ledgerben 271 egyedi H19–H34 azonosító található; a kanonikus MASTER §40.1–§40.16 tábláiban ugyanez a 271 azonosító szerepel.
- [x] Hiányzó ID: 0. A MASTER-ben az archív ledgerhez képest többlet vagy hiányzó ledger-sor: 0.
- [x] Az azonosítóhoz tartozó történeti követelménycímke mind a 271 sorban karakterpontosan egyezik az archív és a kanonikus ledger között.
- [x] Csoportonkénti darabszám: H19=20; H20=18; H21=22; H22=19; H23=20; H24=13; H25=12; H26=12; H27=19; H28=17; H29=10; H30=14; H31=14; H32=25; H33=13; H34=23. Összesen: 271.

**Mit bizonyít és mit nem:** ez az eredmény a H19–H34 ledger sorazonosságát és a történeti címkék megőrzését bizonyítja az elérhető archív ledgerhez képest. Nem bizonyítja, hogy az egyes sorok teljes leírása szemantikailag változatlan, hogy minden capability-owner/surface/phase/dependency helyes, vagy hogy bármely képesség implementálva és elfogadva van. Nem helyettesíti a hiányzó eredeti `00/A` és `00.9–00.9.6.B` forrásokat, a teljes `00.9.6.E/F` bullet-szintű szemantikai auditot vagy a 359 funkció-ID teljes kétirányú reconciliációját.

**Következő lépés:** a P0.2 következő ellenőrzése a §37.22–§37.30 crosswalk és az archív `00.9.6.E/F` követelménybulletjeinek tételes, szemantikai egyeztetése; az eredményeket ugyanebben a MASTER-ben kell rögzíteni. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.13. P0.2 — E.1 product-surface boundary crosswalk gap and provisional closure (2026-10-14)

**Forrás:** archivált `00.9.6.E / E.1 — Termékfelületek és határok` (15 felsorolt platformfelület), összevetve a kanonikus `§37.22–§37.30` E/F bullet-crosswalkjaival.

**Auditmegállapítás:** a crosswalkban az E.2–E.22 és F.1–F.13 közvetlen hivatkozásai szerepelnek, de az E.1 szakasz és annak 15 felsorolt felülete nem rendelkezik saját, közvetlen sorazonosítóval. A felületek sok képessége más E-sorokon keresztül már szerepel; ezért ezt nem elveszett termékterületként, hanem a felület-/határszintű nyomkövetés explicit hiányaként kell kezelni. Az alábbi E.1-S01–E.1-S15 az auditban létrehozott belső traceability-alazonosító, nem az archív forrás eredeti azonosítója.

| Audit ID | E.1 történeti felület | Canonical owner / képességcsoport | Kötelező határ / egyeztetési pont | Állapot |
|---|---|---|---|---|
| E.1-S01 | Public Website | WEB / SEO / QA | Publikus renderer és publikált snapshot; draft/admin adatok nem szivároghatnak a publikus oldalra | PROVISIONAL MAP |
| E.1-S02 | Creator Center / Admin | ADM / SEC / OPS | Egyetlen canonical admin shell; auth/RBAC minden admin route-on és API-n | PROVISIONAL MAP |
| E.1-S03 | Visual Editor | EDT | Egyetlen Editor v2; Page Model/command/history/persistence közös útvonal | PROVISIONAL MAP |
| E.1-S04 | CMS / Content Center | CNT / WEB | Tartalmi lifecycle külön a Page Modeltől; platform-specifikus content típusok megőrzése | PROVISIONAL MAP |
| E.1-S05 | Resource / Media Library | RES | D1 metadata és R2 binary külön; asset registry, usage map, MIME/size/security ellenőrzés | PROVISIONAL MAP |
| E.1-S06 | Schedule / Calendar | SCH | `schedule_items` canonical domain; Editor node nem másolja le az eseményrekordokat | PROVISIONAL MAP |
| E.1-S07 | Live / Integration Center | INT / LIV / OBS | Provider capability/scope-gated adapterek; site-scoped ownership és tokenbiztonság | PROVISIONAL MAP |
| E.1-S08 | Theme / Design System | DSN | Canonical design token, theme és responsive property szerződés; nincs párhuzamos style state | PROVISIONAL MAP |
| E.1-S09 | Template / Component / Symbol Library | DSN / EDT | Reusable template/component/symbol fogalmak külön; verziózás és instance-link megőrzése | PROVISIONAL MAP |
| E.1-S10 | Stream / Overlay Studio | OBS / LIV | Editor csak konfigurálja a megjelenítést; stream runtime és OBS-műveletek külön domain | PROVISIONAL MAP |
| E.1-S11 | Store / Monetization | STO / SUP / SEC | Fizetés, entitlement, refund és creator/platform bevétel elkülönítése; jogi/provider gate | PROVISIONAL MAP |
| E.1-S12 | Community / Audience | COM / SUP / SEC | Consent, moderation, role/entitlement és export/delete szabályok | PROVISIONAL MAP |
| E.1-S13 | Analytics / Automation / AI | ANL / AUT / AI / QA | Külön domain contractok; auditálhatóság, jóváhagyás, retry/idempotency és forrásfrissesség | PROVISIONAL MAP |
| E.1-S14 | Platform Administration | SEC / OPS / TEAM | Account/workspace/site/team határok, tenant/site isolation, lifecycle és audit | PROVISIONAL MAP |
| E.1-S15 | Developer / Extension surface | INT / MKT / OPS / SEC | Későbbi API/SDK/marketplace; permission declaration, sandbox, provenance és rollback | PROVISIONAL MAP |

**Korlát:** a táblázat lezárja az E.1 felületnevek explicit nyomkövetési hiányát, de a hozzárendelések szemantikai felülvizsgálata és a célképességek részletes acceptance-e még nyitott. A `PROVISIONAL MAP` nem implementációs státusz és nem PASS. Következőként az E.2–E.22 és F.1–F.13 crosswalk sorainak egyedi source-bullet és canonical capability szintű ellenőrzése folytatandó. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.14. P0.2 — E.22 plan-maintenance requirements mapped to canonical execution controls (2026-10-14)

**Forrás:** az archív `00.9.6.E / E.22 — Teljességi zár és tervkarbantartás` hat kötelező szabálya. Ezek nem termékfeature-ök, hanem a MASTER karbantartására és a végrehajtás fegyelmére vonatkozó követelmények; ezért nem szabad őket mesterségesen runtime feature ID-vé alakítani.

| Source bullet | Követelmény röviden | Canonical végrehajtási kontroll | Eredmény |
|---|---|---|---|
| E.22-B01 | A közvetlen termékkatalógus, a végrehajtási sorrend és a domain/API/test szerződések alkotják az operatív tervet | §0.0–§0.2; §37.3; §37.9–§37.32; §41 auditnapló | MAPPED — governance |
| E.22-B02 | A történeti ID-k csak audit/traceability hivatkozások; a munkapontot a MASTER-ből kell megérteni | §0.0 precedence rule; §40 H19–H34 ledger; §41.3.12 | MAPPED — historical traceability |
| E.22-B03 | Minden régi követelménynek canonical domain/fázis kell; a nem térképezhető tétel UNMAPPED REQUIREMENT marad | §37.17–§37.18; §37.22–§37.30; §41.3.10–§41.3.13 | MAPPED — unresolved items remain open |
| E.22-B04 | Új felhasználói igény ugyanebbe a MASTER-be kerül domain/fázis/függőség/DoD/teszt mezőkkel | §0.1; §25–§26; §41.3.14 | MAPPED — maintenance rule |
| E.22-B05 | Egyszerre egy ACTIVE engineering point lehet; a későbbi képességek PLANNED/QUEUED állapotban maradnak | §0.2 ACTIVE_POINT; PARALLEL_WORKSTREAMS=0; §37.3 P0 status | MAPPED — execution invariant |
| E.22-B06 | Minden módosítás előtt beolvasás, utána aktív pont/fázissorrend/capability/owner/gate ellenőrzés kell | §0.0 continuation protocol; §0.1 single source; §41.3.11–§41.3.14 verification notes | MAPPED — change-control rule |

**Ellenőrzési korlát:** ez a tábla mind a hat E.22 tervkarbantartási szabályhoz explicit MASTER-hivatkozást ad. Nem jelenti az E.2–E.21 funkcionális crosswalk szemantikai PASS-át, nem oldja fel a hiányzó eredeti `00/A` / `00.9–00.9.6.B` forrásokat, és nem zárja le a C.23/C.24 teljes bullet-szintű leképezését. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.15. P0.2 — C.23 + F.1–F.13 exact source-bullet text reconciliation (2026-10-14)

**Ellenőrzött források:** az archivált `00.9.6.C.23` és `00.9.6.F` bulletjei, valamint a MASTER `§41.3.5` egyedi forrás-bullet ledgerje. Az összevetés a bullet szövegét whitespace/Markdown-formázás normalizálása után, multisetként vizsgálta; a forrásban ismétlődő szövegek számossága is számít.

| Tartomány | Forrásbullet | Ledger-sor | Szövegeltérés | Hiányzó / többlet |
|---|---:|---:|---:|---:|
| C.23.1–C.23.22 | 210 | 210 | 0 | 0 / 0 |
| F.1–F.13 | 100 | 100 | 0 | 0 / 0 |
| **Összesen** | **310** | **310** | **0** | **0 / 0** |

**Következtetés:** a ledger a jelenleg elérhető archív MASTER-ben szereplő C.23 és F.1–F.13 bullet-szövegeket teljes darabszámban és szövegszinten megőrzi. Ez erősebb bizonyíték a puszta ID-jelenlétnél, de továbbra is **source-text integrity**, nem teljes szemantikai megfelelőség: nem bizonyítja, hogy a canonical feature-mappingek helyesek, a permission/owner/phase/dependency/test/acceptance minden sorban teljes, a benchmarkforrások aktuálisak, vagy a funkciók runtime PASS állapotúak. A `00/A` és `00.9–00.9.6.B` hiányzó eredeti szövegét ez nem pótolja. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.16. P0.2 — F.3 Plain Text capability mapping correction (2026-10-14)

**Forrás:** archivált `00.9.6.F / F.3` utolsó bulletje, `§37.27` `F.3-05` crosswalk sora és a `§24.3` EDT feature registry.

**Talált eltérés:** a F.3-05 sor a plain Text alapfunkciót `EDT-019/020/022` ID-khez kötötte, miközben a registryben a Text/Heading/Link/Button/Icon/Divider/Spacer elemkészlet `EDT-017`. Az `EDT-020` a dinamikus Sanci blokk konfigurációja, ezért nem megfelelő elsődleges mapping a plain Text követelményhez.

**Javítás:** a F.3-05 mapping most `EDT-001–EDT-003, EDT-017, EDT-019, EDT-022`; ez a canonical Page Model/command alapot, a plain Text elemet és a schema-validált Inspector kontrollokat köti össze. A rich-text bővítés továbbra is külön scope, nem kerül vissza a 1.0 alapszerkesztőbe.

**Bizonyítékhatár:** ez egy konkrét mapping korrekciója, nem a teljes F.3 vagy F.1–F.13 szemantikai PASS-a. A F.3 további sorai, a teljes permission/dependency/acceptance szerződés és a többi 309 forrásbullet szemantikai review-ja nyitott. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.17. P0.2 — F.3 Inspector/property/responsive mapping corrections (2026-10-14)

**Forrás:** az archivált `00.9.6.F / F.3` választó-, méretezés-, térköz- és responsive-követelményei, a `§37.27` F.3 crosswalk, valamint a `§24.3` EDT registry.

**Javítások:**
- `F.3-01`: hozzáadva `EDT-021` (Inspector Property Registry), mert az alapvető layout/alignment vezérlőknek a canonical property-registry útvonalon kell működniük.
- `F.3-02`: a szélesség/magasság és spacing mapping kiegészült `EDT-009` geometriai korlátokkal, `EDT-021` registryvel és `EDT-022` schema-validált controlokkal.
- `F.3-03`: az irreleváns `EDT-036` (mobil Layers/Inspector panelváltás) helyett a responsive override/preview/visibility/order szerződés `EDT-021–EDT-026` került be, az adott layout által engedélyezett geometry/layout ID-kkel.

**Ellenőrzési korlát:** ezek célzott mapping-helyesbítések. Nem bizonyítják az Editor implementáció runtime acceptance-ét, a teljes F.3 bulletjeinek szemantikai lezárását vagy a teljes F.1–F.13 acceptance szerződés teljességét. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.18. P0.2 — C.23.3 canvas viewport mapping precision (2026-10-14)

**Forrás:** `§41.3.5` `C.23.3-02` és a `§24.3` EDT registry.

**Javított mapping:** a zoom/fit/pan/100%/overview/reset követelmény elsődlegesen a `EDT-007` canvas viewport/zoom/pan/fit capability-hez tartozik. A korábbi `EDT-025` (responsive device preview) és `EDT-035` (mobil Editor action bar/safe area) hivatkozás nem közvetlenül ezt a viselkedést azonosította, ezért eltávolítva. A QA-002/004/005 acceptance-kapcsolat változatlanul megmaradt.

**Bizonyítékhatár:** ez egy mapping pontosítása; nem állítja, hogy a minimap/overview vagy a viewport controls implementálva vannak, és nem zárja le a C.23.3 teljes runtime acceptance-ét. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.19. P0.2 — C.23.6 semantic text versus advanced rich-text scope correction (2026-10-14)

**Forrás:** archivált `00.9.6.C.23.6` typography/text requirement, `00.9.6.F / F.3` plain-Text boundary, canonical `§24.3` EDT registry.

**Eltérés:** a `C.23.6-02` korábbi mappingje `EDT-019`-et (Table/Accordion/Tabs/Form) használt rich-text struktúrához, és a „1.0 semantic rich-text baseline” megfogalmazás összemoshatta a szemantikus text primitíveket az összetett Rich Text szerkesztővel. A történeti F.3 kifejezetten azt írja elő, hogy a plain Text legyen az 1.0 stabil alap, és a komplex Rich Text külön scope-ban maradjon.

**Javítás:** a mapping most a typed Page Model/node schema (`EDT-001/002`), plain text primitives (`EDT-017`), Inspector schema/controls (`EDT-021/022`) és safe public renderer (`WEB-032`) útvonalat használja. Az 1.0-ban csak a támogatott szemantikus text primitives követelhetők; a teljes rich-text editor külön, explicit scope és acceptance alapján aktiválható.

**Bizonyítékhatár:** ez a scope- és mapping-ellentmondást tisztázza, nem igazolja a text/rich-text funkciók implementációját. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.20. P0.2 — C.23.7 Property Registry migration mapping correction (2026-10-14)

**Forrás:** `§41.3.5` `C.23.7-08` és `§24.3` EDT registry, összevetve a `§24.4` DSN registryvel.

**Javítás:** a Property Registry schema-version/deprecation/migration követelmény korábbi `DSN-014` hivatkozása eltávolítva, mert az a template versioning/compatibility/migration képességhez tartozik, nem a Property Registryhez. A canonical mapping `EDT-001` (Page Model schema/version) és `EDT-021/022` (Property Registry + schema-validált controlok); a sor acceptance mezője megtartja a QA-002/004/006 tesztelési kaput.

**Bizonyítékhatár:** a mapping javítása nem bizonyítja, hogy a property-schema migráció implementált vagy elfogadott. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.21. P0.2 — Final unreferenced registry ID OPS-010 mapped into E.20 dependency gate (2026-10-14)

**Elvégzett ellenőrzés:** a `§24` registry 359 egyedi feature/quality ID-ját összevetettem a `§37.22–§37.30` E/F crosswalk soraiban szereplő explicit és tartományból kibontott hivatkozásokkal. Az aktuális crosswalkban 323 sor található; a mappingekben 358 különböző registry ID volt hivatkozva, feloldatlan/érvénytelen hivatkozás nélkül. Egy registry ID nem szerepelt a crosswalk mapping oszlopaiban: `OPS-010 — Dependency/license/CVE review`.

**Javítás:** az `E.20-07` integrációs/dependency követelmény most explicit tartalmazza a dependency/license/CVE review-t, és a mapping `OPS-010/011` hivatkozást. Ez a függőségek hozzáadása/frissítése előtti felülvizsgálatot a közös fejlesztési szerződéshez kapcsolja.

**Ellenőrzési korlát:** ez megszünteti az egyetlen olyan registry-ID-t, amelyet a gépi ellenőrzés a §37.22–§37.30 crosswalk mapping oszlopaiban nem talált. Nem bizonyítja a 359 ID mindegyikének teljes szemantikai megfelelését, és nem helyettesíti a 00/A / 00.9–00.9.6.B forrás-visszakeresését. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.22. P0.2 — C.23.12 canonical data-source mapping correction (2026-10-14)

**Forrás:** `§41.3.5` `C.23.12-04`, canonical registry `§24` (DYN/SET/SCH/INT/RES/CNT/SEC) és a domain-ownership invariánsok `§2.4–§2.5`.

**Talált eltérés:** a forrás hat konkrét canonical data-source csoportot nevez meg, de a korábbi mapping csak DYN/SEC/QA ID-kat tartalmazott. Az acceptance mező tévesen import/export viselkedést írt le, ami nem a forrásbullet tárgya.

**Javítás:** a mapping most explicit hivatkozik a site settings, schedule, integration/Twitch, Resource, CMS/Content és authorization domain ID-kre. A decision/acceptance mező a deklarált canonical adaptert, source-owner/site scope-ot, provider capability/freshness/error állapotot és a Page Model domainrekordoktól való elkülönítését írja elő. Import/export nem lett ebből a forrásbulletből kikövetkeztetve.

**Bizonyítékhatár:** a mapping most jobban követi a forrás szándékát, de az adapterek és domain contractok runtime működése nincs ezzel igazolva. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.23. P0.2 — EDT-043 advanced Rich Text capability added to the canonical registry (2026-10-14)

**Döntés oka:** az E.3.6-01, C.23.6-02, C.23.8-02 és F.3-05 forráskövetelmények a rich-text képességet kifejezetten későbbi, nem 1.0-blokkoló scope-ként tartják meg, de a korábbi §24 registryben nem volt önálló feature-ID-ja. A képesség nem maradhat kizárólag prózában, mert így hiányozna az ID-szintű fázis/DoD/acceptance nyomkövetés.

**Új canonical registry ID:** `EDT-043 — Advanced Rich Text editor and structured inline/block content`. Scope: advanced Rich Text/Quote/Code and structured inline/block editing; phase: post-1.0, only after typed schema, safe renderer, accessibility and save/reload round-trip contracts; no parallel rich-text implementation may delay the 1.0 plain-text editor. E.3.6-01, C.23.6-02, C.23.8-02 and F.3-05 now reference EDT-043 explicitly.

**Registry impact:** unique feature IDs increased from 359 to 360. The current E/F crosswalk has 323 rows; the structural reference check must be rerun after this change. Historical audit snapshots dated before this entry retain their 359-ID count as historical evidence; they must not be interpreted as the current registry size.

**Acceptance boundary:** EDT-043 is PLANNED, not implemented. P0.2 remains **IN PROGRESS / NOT PASS**.

### 41.3.24. P0.2 — Registry/crosswalk structural recheck after EDT-043 addition (2026-10-14)

**Recheck scope:** current §24 registry versus the seven E/F crosswalk batches in §37.22–§37.30, after adding `EDT-043` and updating its E/F mapping references.

- [x] Registry IDs: **360 unique**, including `EDT-043`.
- [x] Crosswalk rows: **323** across §37.22 (57), §37.23 (66), §37.24 (45), §37.25 (59), §37.27 (28), §37.29 (26), §37.30 (42).
- [x] Unique registry IDs referenced by the crosswalk: **360/360**.
- [x] Unresolved/unknown ID references: **0**.
- [x] Registry IDs not referenced by any checked crosswalk mapping/QA column: **0**.

**Interpretation:** this confirms current structural coverage of every registered ID by at least one checked crosswalk mapping or QA reference. It does not prove correct semantics for every mapping, bidirectional source provenance for every ID, complete permission/dependency/acceptance fields, or runtime implementation. The missing original `00/A` and `00.9–00.9.6.B` source texts remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.

### 41.3.25. P0.2 — C.23.9 responsive preview mapping cleanup (2026-10-14)

A C.23.9-01–03 responsive viewport mappingből eltávolítva az EDT-035 hivatkozás, mert az a mobil Editor action bar/safe-area képesség, nem viewport preset/preview. A C.23.9-02 sorból az EDT-026 is eltávolítva, mert az breakpoint visibility/order/column mutation, nem side-by-side/single/rotation preview. A releváns mappingek: EDT-007 viewport controls, EDT-024/025 responsive override/device preview, és C.23.9-03 esetén EDT-009 geometry constraints.

Ez mapping-pontosítás, nem runtime acceptance. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.26. P0.2 — Structural recheck after targeted semantic mapping corrections (2026-10-14)

A C.23.6, C.23.7, C.23.9 és C.23.12 mappingjavítások után ismét lefuttatva a §24 registry és a §37.22–§37.30 crosswalk strukturális összevetése: 360 egyedi registry ID, 323 crosswalk sor, 360 hivatkozott ID, 0 feloldatlan hivatkozás, 0 hivatkozatlan registry ID. A hét batch sorszámai változatlanok (57/66/45/59/28/26/42). Ez csak strukturális ellenőrzés; a szemantikai és ID-nkénti contract-audit továbbra is nyitott. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.27. P0.2 — EDT-044 per-user Editor workspace preferences capability (2026-10-14)

**Eltérés:** a C.23.17-01/04/07 követelmények resizable/collapsible panelek, panel-state persistence, favorites és viewport/grid preference viselkedést írnak elő. A korábbi registryben az EDT-007 viewport és az EDT-035/037 mobil/keyboard UX ID-k szerepeltek, de nem volt külön nyomkövethető az a szerződés, hogy ezek felhasználói preferenciák, és nem site Page Model tartalom.

**Új canonical ID:** `EDT-044 — Per-user Editor workspace preferences (viewport, panel layout, grid and favorites) stored outside the site Page Model`. A C.23.17-01, C.23.17-04 és C.23.17-07 mappingjei EDT-044-re hivatkoznak. A preferenciák felhasználónként menthetők; nem jelölhetik dirty-nek a weboldalt, nem szivároghatnak másik user/site között, és nem írhatják át a canonical Page Modelt.

**Registry impact:** 361 egyedi ID. EDT-044 planned capability; ez nem implementációs vagy runtime acceptance bizonyíték. P0.2 **IN PROGRESS / NOT PASS**.

Az EDT-044 crosswalk-kapcsolatának lezárásához az E.3.1-05 sor is explicit EDT-044 hivatkozást kapott: a resizable/collapsible workspace paneljeinek felhasználói preferenciái nem kerülhetnek a site Page Modelbe. A C.23.17-01/04/07 sorok továbbra is részletes történeti forrásleképezések; a közvetlen E/F crosswalk most már ugyanezt a képességet is lefedi.

### 41.3.28. P0.2 — Registry/crosswalk structural recheck after EDT-044 addition (2026-10-14)

A per-user Editor workspace preferences capability hozzáadása és az E.3.1-05 crosswalk-kapcsolat után végzett friss ellenőrzés: 361 egyedi registry ID; 323 crosswalk sor; 361/361 ID hivatkozott; 0 feloldatlan és 0 hivatkozatlan ID. A hét batch sorszámai változatlanok (57/66/45/59/28/26/42). Ez kizárólag strukturális coverage; a szemantikai mapping, kétirányú provenance és ID-nkénti contract audit továbbra is nyitott. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.29. P0.2 — C.23.20 marketplace mapping correction (2026-10-14)

A C.23.20-07 forrásbullet jövőbeli marketplace/shared-library képességeket és licenc/provenance/kompatibilitás/dependency/import/sandbox/rollback szerződéseket ír elő. A korábbi mapping a template/resource/security/operations ID-kat tartalmazta, de kihagyta a marketplace domain saját `MKT-001–MKT-005` capability-csoportját. A mapping most kiegészült a MKT ID-kkel és az `OPS-010` dependency/license/CVE review-val. Ez tervezett jövőbeli scope, nem marketplace runtime acceptance. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.30. P0.2 — C.24 open-source-first policy bullet ledger (2026-10-14)

**Forrás:** archivált `00.9.6.C.24 — OPEN-SOURCE-FIRST ENGINEERING POLICY`, §C.24.1–C.24.7. Az alábbi auditkulcsok a MASTER-ben létrehozott nyomkövetési kulcsok, nem az archívum eredeti ID-i. A 37 felsorolt forrásbullet mindegyikét megőrzik; a külön policy-paragrafusok és döntési címkék külön sorokban szerepelnek, hogy ne vesszenek el a bullet-számlálásból.

| Audit key | Archive line | Exact source requirement / policy | Initial canonical mapping | Decision / owner / status |
|---|---:|---|---|---|
| C.24.1-01 | 2291 | 1. Meglévő, a Sanci9517-ben már helyesen használt canonical megoldás újrahasználata. | OPS-010, QA-002/009 | OPEN — confirm the existing solution is canonical and meets the task acceptance; reuse does not waive regression or ownership checks |
| C.24.1-02 | 2292 | 2. Megfelelő szabványos, karbantartott és tesztelt nyílt forráskódú könyvtár vagy eszköz integrálása. | OPS-010, QA-001/002/009 | OPEN — evaluate a named candidate's license, maintenance, advisories, compatibility and actual requirement coverage; add task-specific domain and runtime tests |
| C.24.1-03 | 2293 | 3. Bevett szabvány és dokumentált, egyszerű saját adapter a meglévő rendszerhez. | OPS-010, INT-001, QA-002/009 | OPEN — identify the applicable standard and define a thin adapter contract; canonical data ownership and authorization remain in Sanci9517 |
| C.24.1-04 | 2294 | 4. Saját implementáció akkor, ha nincs megfelelő megoldás, a meglévő megoldás nem felel meg a követelményeknek, vagy az integrációs/licenc/biztonsági kockázat nagyobb, mint a saját fejlesztéséé. | OPS-010, QA-001/002/009 | OPEN — document why reuse/adoption/adaptation is unsuitable and compare total maintenance/security/compatibility cost; test the implementation against explicit acceptance |
| C.24.1-05 | 2295 | 5. Fork csak indokolt esetben, dokumentált upstream-követési és biztonsági karbantartási tervvel. | OPS-009/010, QA-001/006/007/009 | OPEN — require a written reason, upstream tracking/security patch owner, divergence plan, reproducible build and recovery/exit strategy |
| C.24.2-01 | 2302 | - milyen problémát és elfogadási feltételeket kell megoldani; | OPS-010, QA-009 | OPEN — state the user/problem outcome and measurable acceptance cases before selecting a package or implementation; attach the actual feature/domain IDs |
| C.24.2-02 | 2303 | - mely meglévő projektmodulok, canonical contractok és függőségek fedik már le a feladatot; | OPS-010, OPS-008, QA-002/009 | OPEN — inspect existing modules, contracts and dependencies first; document overlap and avoid a second source of truth or redundant package |
| C.24.2-03 | 2304 | - milyen nyílt forráskódú alternatívákat vizsgáltunk, és miért relevánsak; | OPS-010, QA-009 | OPEN — list the actual relevant alternatives and comparison criteria; popularity or demo quality alone is not evidence |
| C.24.2-04 | 2305 | - a licencet, karbantartottságot, kiadási aktivitást, dokumentációt, ismert sérülékenységeket és kompatibilitást; | OPS-010, SEC-010, QA-001/006/009 | OPEN — record candidate-specific license, provenance, maintenance/release, documentation, advisory and compatibility evidence |
| C.24.2-05 | 2306 | - bundle/runtime hatást, browser/Worker/D1/R2 kompatibilitást, adatvédelmi és ellátásilánc-kockázatot; | OPS-008/010, SEC-008/010/011, QA-001/003/004/006 | OPEN — measure production bundle/runtime impact and verify the actual target environment; assess data exposure and supply-chain risk before acceptance |
| C.24.2-06 | 2307 | - a választás indokát: reuse, integrate, adapt, fork vagy build; | OPS-010, QA-009 | OPEN — record exactly one primary decision label with rationale and alternatives; keep unresolved choices OPEN rather than implying an approved solution |
| C.24.2-07 | 2308 | - milyen tesztek és visszaállítási lehetőség igazolja az integrációt. | OPS-009/010, QA-001/002/006/007 | OPEN — define tests and recovery/rollback evidence appropriate to the integration risk; documentation alone cannot satisfy acceptance |
| C.24.3-01 | 2315 | - a licence megengedett a projekt tervezett használatához és terjesztéséhez; | OPS-010, QA-009 | OPEN — license/use-scope evidence; legal/redistribution review where applicable; acceptance remains task-specific |
| C.24.3-02 | 2316 | - kompatibilis a jelenlegi futtatókörnyezettel, builddel, TypeScript- és böngészőkövetelményekkel; | OPS-008, OPS-010, QA-001, QA-004, QA-006 | OPEN — build/typecheck plus target-runtime/browser compatibility evidence; acceptance remains task-specific |
| C.24.3-03 | 2317 | - a projekt eredete és karbantartási állapota ellenőrizhető; | OPS-010, QA-009 | OPEN — verify upstream provenance, maintenance/release activity and record the evidence; acceptance remains task-specific |
| C.24.3-04 | 2318 | - nincs ismert, elfogadhatatlan biztonsági kockázata; | OPS-010, SEC-008, SEC-010, QA-003, QA-006 | OPEN — review advisories/CVEs and project-specific exposure; do not treat absence of known CVEs as proof of safety |
| C.24.3-05 | 2319 | - a szükséges funkciót a valós követelmények szerint lefedi, nem csupán hasonló nevű vagy látványú; | OPS-010, QA-002, QA-009 | OPEN — compare against the task's explicit acceptance cases and canonical owner; attach domain-specific IDs per actual use |
| C.24.3-06 | 2320 | - integrációja nem hoz létre második canonical adatmodellt, historyt, property registryt, Resource-tárat, schedule-domaint vagy mentési/publikálási útvonalat; | OPS-010, QA-002, QA-008 | OPEN — architecture invariant; add the affected canonical domain IDs per integration; verify no parallel source of truth or write path |
| C.24.3-07 | 2321 | - nem sérti a hozzáférés-vezérlést, a site ownershipot, a public/draft izolációt vagy a titkok kezelését; | SEC-002, SEC-003, SEC-008, QA-003 | OPEN — run authorization/ownership/isolation negative tests for the actual integration boundary; acceptance remains task-specific |
| C.24.3-08 | 2322 | - tesztelhető, frissíthető, eltávolítható és szükség esetén visszaállítható. | OPS-009, OPS-010, QA-001, QA-006, QA-007 | OPEN — require upgrade/removal/rollback procedure and relevant CI/live/recovery evidence; acceptance remains task-specific |
| C.24.4-01 | 2328 | - Előnyben részesítendő a kis, célzott dependency és a jól körülhatárolt adapter. | OPS-010, OPS-011, INT-001, QA-001/002/006 | OPEN — record why a dependency is needed versus a small local implementation; assess maintenance, runtime need and operational lifecycle; do not infer approval from this policy alone |
| C.24.4-02 | 2329 | - A könyvtár ne vegye át a domain logikát vagy az adatforrás tulajdonjogát, ha az már a Sanci9517 canonical rendszeréhez tartozik. | INT-001, QA-002/008 | OPEN — identify the affected canonical domain owner and prove the library remains an adapter; attach the actual domain IDs and test for duplicate state/write paths |
| C.24.4-03 | 2330 | - A külső könyvtár kimenetét és bemenetét validálni kell; a külső kód nem kap automatikusan jogosultságot titkokhoz vagy privilegizált műveletekhez. | SEC-002/003/005/006/008, QA-002/003 | OPEN — validate external input/output at the trust boundary; prove server-side authorization, site isolation and secret redaction with negative tests for the actual integration |
| C.24.4-04 | 2331 | - A lockfile-t és a deklarált verziókat frissíteni kell; indokolatlanul mozgó verziókra nem szabad productiont építeni. | OPS-010, QA-001/006 | OPEN — verify manifest and lockfile agree, production dependency resolution is reproducible, and no unjustified floating version remains; record exact package/version |
| C.24.4-05 | 2332 | - A függőségeket verziófrissítés, teszt, build és deploy ellenőrzés mellett kell frissíteni. | OPS-009/010, QA-001/006/007 | OPEN — define per-upgrade review, tests/build/deploy smoke checks and rollback path; a successful typecheck alone is insufficient |
| C.24.4-06 | 2333 | - Licenc- és harmadikféltől származó attribúciós kötelezettségeket a repository megfelelő helyén meg kell őrizni. | OPS-010, MKT-004, QA-009 | OPEN — preserve required license notices/attribution in the repository and distributed artifacts as applicable; verify obligations for the named dependency and its transitive packages |
| C.24.4-07 | 2334 | - Ha a könyvtár csak egy részfeladatot old meg, a Sanci9517 saját canonical contractja marad a külső integráció határa. | INT-001, QA-002/008 | OPEN — document adapter input/output and failure contract; canonical domain/API remains authoritative and user-facing workflows must not bypass permission, validation, history or audit paths |
| C.24.4-08 | 2335 | - A külső megoldás nem kerülhet be automatikusan a production bundle-be, amíg a méret-, teljesítmény- és security-hatása nincs elfogadva. | OPS-008/010, QA-001/004/006 | OPEN — measure actual production bundle delta and runtime/browser impact; review exposed attack surface and explicitly accept the result before shipping |
| C.24.5-01 | 2342 | - milyen alternatívát kerestünk; | OPS-010, QA-009 | OPEN — record the relevant alternatives actually considered and why each is or is not suitable; scale comparison depth to task risk and architectural impact |
| C.24.5-02 | 2343 | - miért nem felelt meg; | OPS-010, QA-009 | OPEN — document concrete requirement, compatibility, license, maintenance, security or integration gaps; preference alone is not sufficient evidence |
| C.24.5-03 | 2344 | - mely szabványokat és bevett megoldásokat követi a saját implementáció; | OPS-010, QA-001/002/009 | OPEN — identify applicable standards and canonical contracts; verify the implementation against explicit acceptance cases and relevant tests |
| C.24.5-04 | 2345 | - hogyan teszteljük és tartjuk karban. | OPS-009/010, QA-001/002/006/007 | OPEN — define tests, owner, maintenance expectations, upgrade/removal strategy and rollback or recovery path |
| C.24.6-01 | 2351 | - A lényeges dependency-ket és licenceket időszakosan felül kell vizsgálni. | OPS-010, QA-006/009 | OPEN — define review cadence/trigger and record current package, license and advisory evidence; this policy is not proof a review has occurred |
| C.24.6-02 | 2352 | - Biztonsági frissítések és kompatibilitási problémák esetén a függőségi kockázatot priorizálni kell. | OPS-010, SEC-010, QA-001/006 | OPEN — triage severity, exploitability and runtime exposure; verify the candidate fix with compatibility/build/tests and document defer/mitigation if blocked |
| C.24.6-03 | 2353 | - Egy meglévő jó megoldást nem cserélünk le pusztán divatból vagy esztétikai preferenciából. | OPS-010, QA-009 | OPEN — require a concrete benefit and migration-cost/risk comparison before replacement; preserve the current working solution absent a justified decision |
| C.24.6-04 | 2354 | - Ha később jobb, biztonságosabb alternatíva jelenik meg, összehasonlítás után migrálható, de csak tesztekkel és visszaállítási tervvel. | OPS-009/010, QA-001/002/006/007 | OPEN — compare the named alternative, test migration and regression paths, and prove rollback/recovery before replacing the existing solution |
| C.24.6-05 | 2355 | - A funkcióleltárban külön jelölendő, ha egy képesség meglévő dependency-vel, adapterrel, saját kóddal vagy még meg nem választott megoldással készül. | OPS-010, QA-009 | OPEN — record the implementation strategy per feature ID as reuse/adopt/adapt/build/fork/not-yet-selected; do not infer runtime completion from a planned strategy |
| C.24.1-P01 | policy text | A jelentős új funkció, technikai probléma vagy infrastruktúra-döntés előtt kötelező felmérni a megfelelő, karbantartott és biztonságosan használható open-source megoldásokat. | OPS-010, QA-009 | OPEN — require a proportionate candidate search and recorded decision before implementation; this policy does not authorize parallel work or bypass the active point |
| C.24.1-P02 | policy text | A cél nem a függőségek mennyiségének maximalizálása, hanem a megbízható, biztonságos, tesztelhető és karbantartható megoldás. | OPS-008/010, QA-001/002/009 | OPEN — evaluate total operational burden, bundle/runtime cost, testability and maintenance; fewer dependencies is not automatically better if required controls are lost |
| C.24.2-P01 | policy text | Kis, egyértelmű módosításnál rövid ellenőrzési megjegyzés elegendő; összetett/architekturális döntésnél összehasonlítás és írásos döntési rekord szükséges. | OPS-010, QA-009 | OPEN — scale the decision record to risk and architectural impact; small low-risk changes need a concise rationale, while high-impact choices require alternatives, evidence and an explicit decision owner |
| C.24.3-P01 | policy text | Népszerűség, GitHub-csillagok vagy demó önmagában nem bizonyíték; ismeretlen, elhagyott, inkompatibilis vagy nem megfelelő licencű csomag nem vehető át pusztán gyorsaság miatt. | OPS-010, SEC-010, QA-001/006/009 | OPEN — exclude candidates with unacceptable license, maintenance, advisory or target-runtime compatibility gaps; popularity/demo are not qualification evidence; record the actual candidate review |
| C.24.5-P01 | policy text | Saját kód választandó, ha nincs megfelelő nyílt megoldás, a viselkedés projekt-specifikus, az integráció túl kockázatos vagy a dependency aránytalan terhet okoz. | OPS-010, QA-009 | OPEN — in-house decision criteria; requires a recorded alternative/risk comparison and task-specific acceptance |
| C.24.5-P02 | policy text | Biztonsági vagy adatvédelmi szempontból nem megfelelő kódot nyílt forráskódúsága ellenére sem veszünk át. | OPS-010, SEC-002/003/008/010/011, QA-003/009 | OPEN — mandatory security/privacy exclusion; assess the actual integration boundary, data handled and privilege exposure; source availability does not waive negative tests or privacy review |
| C.24.7-P01 | policy text | Az open-source-first szabály nem indít párhuzamos munkát, nem írja felül az aktív munkapontot, és nem igazolja önmagában egyetlen funkció készre jelentését. | §0.2, OPS-010, QA-009 | MAPPED — process invariant only: open-source research stays inside the single active point, creates no parallel workstream, and cannot mark runtime work complete; active-point protocol is covered, but any feature completion still needs its own evidence |
| C.24.7-P02 | policy text | Kötelező döntési címkék: REUSE EXISTING; ADOPT OPEN SOURCE; ADAPT VIA CANONICAL CONTRACT; BUILD IN-HOUSE — JUSTIFIED; FORK — MAINTENANCE PLAN REQUIRED. | OPS-010, QA-009 | OPEN — apply one explicit primary decision label per relevant work item and include rationale/evidence; do not treat a label as proof of implementation or acceptance |
| C.24.7-P03 | policy text | A feladat csak indokolt választás, elfogadott licenc/kompatibilitás/kockázat és sikeres releváns tesztek után zárható le; dokumentálás nem helyettesíti a működő implementációt. | OPS-010, QA-001/002/003/006/007/009 | OPEN — acceptance rule; add task-specific domain/security/browser/runtime IDs and actual evidence; no blanket QA-range mapping or documentation-only PASS |

**Értelmezés:** ez teljes forrásszöveg-megőrzési és kezdeti mapping-ledger a C.24 szabályhoz. A hivatkozások elsődleges keresztvágó kontrollok, nem azt jelentik, hogy minden dependency-review lépés már megtörtént. Minden tényleges új dependency/upgrade/fork/build döntésnél a konkrét alternatívák, licenc, maintenance, CVE, runtime/bundle-hatás, teszt és rollback bizonyítékát az adott engineering taskban kell rögzíteni. A C.24 szemantikai/acceptance auditja és a hiányzó eredeti `00/A` / `00.9–00.9.6.B` források továbbra is nyitottak. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.31. P0.2 — Final structural recheck after C.24 and marketplace mapping (2026-10-14)

- Current §24 registry: **361 unique IDs**.
- Current §37.22–§37.30 crosswalk: **323 rows** across 37.22=57, 37.23=66, 37.24=45, 37.25=59, 37.27=28, 37.29=26, 37.30=42.
- Distinct IDs referenced by the checked crosswalk: **361/361**; unresolved references: **0**; unreferenced registry IDs: **0**.
- The C.24 policy ledger in §41.3.30 contains **46 rows**: 37 original source bullets plus 9 separate policy/decision/acceptance rules.

This confirms structural ID coverage and source-bullet ledger construction only. It does not close semantic mapping review, per-ID provenance/permission/dependency/acceptance contracts, or the unrecovered original `00/A` and `00.9–00.9.6.B` source texts. P0.2 remains **IN PROGRESS / NOT PASS**.

### 41.3.32. P0.2 — C.23.22 continuation and architecture invariants contract closure (2026-10-14)

A C.23.22-02 és C.23.22-04–07 soroknál a történeti követelmény megmaradt, de a mapping korábban nem rögzítette következetesen a tulajdonost, a dependency gate-et és a konkrét acceptance határt. A sorok most explicit módon elválasztják a régi F0.4 folytatási szándékot a jelenlegi P0.2 aktív ponttól; az architekturális rezervációt a canonical registry/store contractokhoz kötik; a végleges 1.0 vs. 1.x+ besorolást a hiányzó 00.9.6.D forrás visszakereséséhez kötik; és tiltják a párhuzamos feature workstreamet. A C.23.22-01 canvas-acceptance sor továbbra is történeti user-confirmation plusz külön regression-evidence elvárást tartalmaz.

**Bizonyítékhatár:** dokumentációs contract-pontosítás; nem runtime bizonyíték, nem jelenti a hiányzó források helyreállítását és nem zárja le a P0.2-t. P0.2 **IN PROGRESS / NOT PASS**.

C.23.22-01 és C.23.22-03 kiegészítése: a canvas drag/resize korábbi felhasználói visszaigazolása történeti jelzésként marad meg, de a jelenlegi regression suite külön igazolja a drag, resize, canvas-height recalculation, undo/redo és viewport viselkedést. A minimális Editor elemkészlet minden tagja csak explicit schema + safe renderer + edit/undo + regression evidence után engedhető a komponenskatalógus bővítése elé.

### 41.3.33. P0.2 — C.23.22 acceptance-contract recheck (2026-10-14)

A C.23.22-01–07 mind a hét történeti sor megmaradt, és a célzott szerződés-ellenőrzés most mind a hét soron explicit tulajdonosi felelősséget talál. A drag/resize sor elfogadása külön kezeli a korábbi user confirmationt és a jelenlegi regression evidence-et; a minimális elemkészlet schema/safe-renderer/edit-undo/test kapuhoz kötött; a régi F0.4 folytatási szándék nem írhatja felül a P0.2 aktív pontot; a canonical registry/store és a phase-allocation függőségek meg vannak nevezve. Strukturális újraellenőrzés: 361 egyedi registry ID, 210 C.23 mapping sor, a C.23.22 blokk 7/7 sora megtalálható, hiányzó tulajdonosi/acceptance contract sor 0. A forrásbullet szövegét a javítások nem módosították. Ez dokumentációs szerződés-ellenőrzés, nem runtime PASS; a P0.2 **IN PROGRESS / NOT PASS** marad.


### 41.3.34. P0.2 — C.23.1 benchmark mapping semantic correction, batch 1 (2026-10-14)

**Audit scope:** C.23.1-01, C.23.1-02 and C.23.1-05 in §41.3.5, checked against the preserved source bullets in archived MASTER §C.23.1 and the current §24 canonical registry / §37.23 E.3 crosswalk.

- **C.23.1-01 — Webflow:** the original candidate IDs captured responsive overrides and reusable components, but did not express the boundary between site-local component reuse and cross-site/shared-library governance. The candidate mapping now explicitly names SEC-003, TEAM-003 and MKT-001–MKT-005 as later-phase gates. These IDs are traceability targets, not evidence that shared-library or marketplace runtime exists.
- **C.23.1-02 — Wix Studio:** the original mapping named the asset picker but underrepresented the canonical asset lifecycle/metadata and the cross-site authorization boundary. RES-001/004/007–010 plus SEC-003/TEAM-003 are now included; acceptance distinguishes asset/resource references from template/design-kit metadata and requires negative isolation checks.
- **C.23.1-05 — Framer:** localization was present in the source bullet but absent from the candidate mapping. LOC-001–004 is now explicit. The contract also prevents a benchmark bundle from collapsing dynamic content, locale/URL policy, SEO/redirects and publish/revision into one owner or implying that all are 1.0 scope.

**Evidence boundary:** the source bullets were preserved; only candidate mappings and their review contracts were refined. This batch does not verify benchmark claims against live vendor documentation, prove runtime implementation, or close any related feature. C.23.1-03/04 and C.23.2 onward remain open for further semantic review. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.35. P0.2 — C.23.1-04 and C.23.2-02 semantic boundary review (2026-10-14)

**Audit scope:** two additional source bullets in §41.3.5, checked against the archived C.23.1/C.23.2 wording, the §24 canonical registry and the existing E.3/E.18 crosswalk.

- **C.23.1-04 — WordPress Site Editor/Gutenberg:** template/pattern editing and global styles were mapped, but the benchmark bullet also explicitly includes export. OPS-005 and SEC-008 are now named as the export/recovery and secret-exclusion boundary. Acceptance distinguishes synced propagation from copied content; the presence of DSN-015 or OPS-005 does not itself prove an import/export implementation.
- **C.23.2-02 — library search/favorites/recent use:** the mapping previously did not distinguish a favorite workspace panel from a favorite template/resource entry. The row now requires an explicit user/site scope contract and forbids favorites/recent-use metadata from mutating the Page Model or granting access. EDT-044 is a comparison point, not presumed to be a complete library-item favorites implementation; if the existing registry cannot represent the library-specific contract, a separately justified canonical ID may be needed.

**Evidence boundary:** source text retained; candidate mapping and acceptance wording refined. No runtime test was run and no implementation PASS is implied. C.23.1-03, the remaining C.23.2 rows and C.23.3–C.23.21 remain open for semantic review. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.36. P0.2 — Elementor and preset lifecycle semantic contract review (2026-10-14)

**Audit scope:** C.23.1-03 and C.23.2-03–09. The source bullets remain unchanged; candidate coverage and acceptance contracts were tightened in place.

- **C.23.1-03 — Elementor Site Settings / global styles / kits:** coverage now separates global tokens, theme styles, node-level overrides, responsive containers and website-kit resources. The critical missing proof is precedence and migration behavior: global edits must affect only declared consumers, local overrides must not disappear silently, and kit application must not overwrite user content without a declared, previewed policy.
- **C.23.2-03 — preview/undo/confirmation:** “preview” now means a deterministic dry run that leaves both live model and persistence untouched. The complete apply must be one atomic history operation; failed operations cannot leave partial state.
- **C.23.2-04 — preset actions:** requires a resource-type × operation matrix; duplicate/restore/archive/reset/replace are not assumed universally valid for every preset type.
- **C.23.2-05 — content/reference integrity:** apply/merge/replace require an explicit conflict and reference policy, including inaccessible resources and cross-site references.
- **C.23.2-06 — propagation:** instance updates require a consumer inventory, visible impact preview, override-conflict handling and atomic rollback. Detach must be a durable semantic state, not just a UI toggle.
- **C.23.2-07 — scope isolation:** server-side authorization must protect enumeration and direct-ID reads/writes; client-provided scope is not authoritative. Shared/user libraries remain later-phase unless separately gated.
- **C.23.2-08 — schema migration:** supported versions, deterministic/idempotent migration, unknown-version rejection and no-mutation-on-failure are explicit acceptance conditions.
- **C.23.2-09 — audit/recovery/deletion:** audit evidence, a complete usage map and validated backup/restore are prerequisites for destructive operations; a referenced resource must not disappear silently.

**Evidence boundary:** these are contract-level semantic corrections based on the preserved source bullets and current candidate registry references. No live vendor verification, runtime test or implementation PASS is claimed. C.23.1-01–02/04–05 have prior targeted notes; C.23.1-03 is now reviewed at contract level. C.23.3 onward remains open for continued source-by-source review. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.37. P0.2 — Canvas geometry, viewport and selection semantics (2026-10-14)

**Audit scope:** C.23.3-01–06. This batch refines the acceptance contracts where a visually plausible interaction could still violate the canonical Page Model or lose state.

- **Geometry and measurement (C.23.3-01):** canvas bounds must recalculate after content, font/image load and viewport changes; test long/empty pages and reachability, not just initial render.
- **Viewport (C.23.3-02):** zoom/pan/fit are viewport state, not persisted node geometry. Minimap/overview is not automatically 1.0 scope; it needs a scale/performance justification.
- **Grid and snapping (C.23.3-03):** basic snap, rulers, baseline grid and smart guides are distinct capabilities. Zoom normalization and keyboard behavior need explicit acceptance; transient guides must not accidentally serialize as content.
- **Transform handles (C.23.3-04):** rotation is gated on schema/renderer/serializer support. A UI handle must never advertise a transform the canonical model cannot preserve.
- **Selection (C.23.3-05):** Canvas, Layers and Inspector must share stable node IDs and selection state; modifier and locked-node semantics need deterministic tests.
- **Drag/drop (C.23.3-06):** drop preview, validation and commit must agree; invalid nesting/cycles/cross-page transfer are rejected before mutation; cancel and undo preserve exact hierarchy and references.

**Evidence boundary:** contract-level documentation change only; no runtime regression suite was run in this operation. The original source bullets were preserved. C.23.3-07 onward and C.23.4–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.38. P0.2 — Canvas commands, property actions and command discovery (2026-10-14)

**Audit scope:** C.23.3-07–09. The mapping now distinguishes the visible control from the canonical command contract behind it.

- **C.23.3-07:** operation support is conditional on node/layout semantics; duplicate must regenerate identifiers safely, delete must respect references, and z-order must not be exposed where layout order is not a z-stack.
- **C.23.3-08:** reset-to-default, reset-to-inherited and clear-override are different state transitions. Copy/paste properties must validate the registry schema and modify only compatible selected properties.
- **C.23.3-09:** context menu, command palette and Add panel remain separate UI surfaces backed by one action/element registry. Keyboard discoverability, permission checks and allowed-child filtering are acceptance requirements; favorites/recent use are metadata, not authorization.

**Evidence boundary:** semantic contract refinement only; no runtime behavior was tested here. Original source bullets retained. C.23.3-10 onward and C.23.4–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.39. P0.2 — Gesture lifecycle and public-renderer isolation (2026-10-14)

**Audit scope:** C.23.3-10–12. These rows are treated as architectural invariants, not optional interaction polish.

- **C.23.3-10 — pointer/gesture lifecycle:** define a gesture state machine with explicit capture/release and a single atomic commit boundary. Escape, pointer loss, blur, scroll and zoom must clean up transient state; no partial geometry may persist.
- **C.23.3-11 — editor/public separation:** the exclusion applies to published output, preview, DOM, accessibility tree and serialized model—not merely visible overlay styling. Editor-only metadata and privileged action hooks are excluded too.
- **C.23.3-12 — canonical model:** the DOM is a projection/hit-test surface only. Mutations use validated commands; serialization derives from the Page Model; reload/rerender equivalence is part of acceptance.

**Evidence boundary:** contract-level update only; no browser regression was executed in this documentation pass. C.23.4–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.40. P0.2 — Page hierarchy, Layers and sizing semantic review (2026-10-14)

**Audit scope:** C.23.4-01–10 and C.23.5-01–02. The source requirements are preserved; candidate mappings and acceptance boundaries were tightened.

- **C.23.4-01:** stable node IDs and save/reload must preserve parent/order and bindings; template definitions, section resources and live page instances must not be conflated.
- **C.23.4-02:** Layers search and collapse are view operations; node mutations are canonical commands with undo/redo. Operations are limited by node-type semantics.
- **C.23.4-03:** editor-only hide/lock, responsive breakpoint visibility and public conditional rendering are separate states with separate owners.
- **C.23.4-04–06:** group/wrapper/align operations require schema-valid selections; all mutation entry points share parent-child/cycle validation; empty states must remain usable for pointer and keyboard users.
- **C.23.4-07:** same-page clipboard operations and future cross-page transfer have different gates. Cut/paste must be atomic and validate IDs, permissions and references.
- **C.23.4-08–09:** transient UI state must not leak into persisted content; multi-edit is limited to explicitly compatible properties and must preserve untouched mixed values.
- **C.23.4-10:** reusable component definition/instance/override/detach behavior is not presumed implemented by the existence of registry IDs; impact preview and atomic propagation are required before master updates.
- **C.23.5-01–02:** supported display and sizing values must be enumerated and renderer-parity tested. Editor-only hide is distinct from CSS display and responsive/public visibility; intrinsic sizing is gated on deterministic content measurement and reachable canvas geometry.

**Evidence boundary:** this is a semantic contract update based on the current MASTER candidate rows; no runtime test or vendor verification was run in this batch. C.23.5-03 onward and C.23.6–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.41. P0.2 — Layout units, positioning and flow semantics (2026-10-14)

**Audit scope:** C.23.5-03–08. The candidate mapping now distinguishes a UI control from the exact CSS/layout behavior the canonical model can safely represent.

- **C.23.5-03 — units and expressions:** require a property-by-unit support matrix, a typed parser and a defined reference basis for percentages/viewport units. Invalid expressions cannot be persisted; conversion must not silently change meaning.
- **C.23.5-04 — positioning:** absolute/fixed/sticky/z-index require explicit containing-block, stacking and scroll semantics, with preview/public parity.
- **C.23.5-05 — Flex:** axis-specific alignment is distinct from canonical tree order; Flex order is visual order and must not silently reorder semantic reading order.
- **C.23.5-06 — Grid:** define a tested Grid subset; invalid tracks/placements must fail deterministically and unsupported named areas/auto-fit/fill must not be implied as available.
- **C.23.5-07 — flow/responsive reorder:** responsive overrides cannot mutate desktop state, and visual ordering must preserve keyboard/focus/reading-order expectations.
- **C.23.5-08 — spacing:** token values, raw values, logical properties and linked-side controls need explicit precedence/reset semantics; negative margins need a constrained policy.

**Evidence boundary:** source bullets retained and acceptance contracts refined; no runtime browser matrix was executed. C.23.5-09 onward and C.23.6–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.42. P0.2 — Overflow, visual properties and unified Inspector editing (2026-10-14)

**Audit scope:** C.23.5-09–16. This batch tightens the acceptance contracts for visual controls whose apparent UI simplicity can hide renderer, accessibility or state-consistency failures.

- **C.23.5-09–10:** overflow is axis/container-specific; alignment requires an explicit anchor and must respect flow/grid constraints. Multi-node operations are atomic and reversible.
- **C.23.5-11:** visual properties, blend modes and video backgrounds are distinct capability groups. Video requires fallback/poster, reduced-motion behavior and performance constraints; assets/URLs must be validated.
- **C.23.5-12:** transform support is gated on schema, geometry, serializer and public-renderer parity; unsupported 3D cannot be shown as available.
- **C.23.5-13:** media remains a canonical asset reference; crop/focal point belongs to presentation metadata and needs responsive and missing-asset behavior.
- **C.23.5-14:** site/page/section content width and full-bleed behavior require explicit inheritance; local overrides cannot silently rewrite global tokens.
- **C.23.5-15–16:** canvas drag, numeric Inspector input and keyboard edits share one validated command/property path. Computed, inherited, explicit override and invalid states remain distinct and testable.

**Evidence boundary:** source bullets preserved; candidate contracts refined only. No runtime/browser tests were executed in this batch. C.23.6–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.43. P0.2 — Typography, tokens and global style lifecycle (2026-10-14)

**Audit scope:** C.23.6-01–10. The mapping now treats typography semantics, token provenance and global-style mutations as separate contracts with explicit owners and failure boundaries.

- **C.23.6-01–02:** font availability/fallback and typography value support are distinct from semantic text structure; heading level remains independent of visual size, and rich-text URLs/markup require safe validation.
- **C.23.6-03–05:** semantic color roles, named typography styles, typed spacing/breakpoint/motion/z-index tokens and raw values must not be conflated in one untyped registry.
- **C.23.6-06–07:** token rename/delete/convert/detach operations require complete consumer maps and atomic reference updates; detach preserves the current resolved value.
- **C.23.6-08:** theme variants are not functional until token coverage, activation policy, fallback, contrast and reduced-motion behavior are defined.
- **C.23.6-09:** font binary, license/provenance metadata and applied style references remain separate; permissions and fallback behavior are explicit.
- **C.23.6-10:** global style changes require read-only impact preview, stale-revision conflict handling and atomic undo/rollback across all affected consumers.

**Evidence boundary:** source bullets preserved and semantic acceptance contracts refined; no typography/browser/performance test was run. C.23.7–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.44. P0.2 — Inspector property registry and mutation pipeline (2026-10-14)

**Audit scope:** C.23.7-01–09. Inspector category labels are not treated as proof that the underlying property, validation or persistence contract exists.

- **C.23.7-01–02:** category grouping is UI-only; node/property compatibility is enforced in both client metadata and authoritative server validation.
- **C.23.7-03:** search/favorites/recent/help are registry-backed view metadata; inheritance indicators must match the canonical resolver and never grant access.
- **C.23.7-04:** property reset, group reset, breakpoint-parent reset and preset reset are distinct commands with different scopes.
- **C.23.7-05–06:** validation, command history, dirty state, save/reload and revision conflict handling form one mutation pipeline; failed save preserves edits and cannot silently publish.
- **C.23.7-07:** multi-edit is limited to explicitly compatible properties and is atomic with one reversible history operation.
- **C.23.7-08:** schema versioning and deprecation migration are required; a parallel property store is prohibited.
- **C.23.7-09:** custom CSS/attributes are later-phase and cannot imply arbitrary script execution; sandbox/CSP and published-render isolation are mandatory gates.

**Evidence boundary:** semantic acceptance refinement only; no implementation or runtime test PASS is claimed. C.23.8–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.45. P0.2 — Visual Editor element registry and integration connection boundaries (2026-10-14)

**Audit scope:** C.23.8-01–13. This section connects the goal of a real visual editor to a canonical element registry and makes integrations explicit domain connection points rather than hidden behavior embedded in visual components.

- **Structure/content elements:** each element maps to a typed canonical node, supported parent-child rules, Inspector schema, validation and public renderer; an Add-menu entry alone is not implementation evidence.
- **Navigation/actions:** site shell, page navigation, in-page anchors and user actions have separate scopes and canonical route/action definitions. Public actions cannot invoke editor commands.
- **Cards and interactive widgets:** presentation elements are separated from domain DTOs and interaction state; loading/empty/error states and keyboard/focus behavior are mandatory contracts.
- **Forms:** editor-side configuration is separate from public submission authority. Server validation, authorization, abuse controls and secret isolation are required.
- **Media:** asset binaries, metadata, references and node presentation settings remain distinct; deleted or inaccessible media has safe fallback behavior.
- **Creator/integration elements:** Twitch/status/player/schedule/social blocks consume public-safe, capability-gated data. OAuth/connection lifecycle, scopes, refresh, disconnect and provider errors belong to a dedicated Integration domain, not to the visual node.
- **Dynamic data and future commerce/widgets:** page presentation cannot become an alternate source of truth for collections, inventory, orders or payments. Future widgets require explicit sandbox/capability approval and resource quotas.
- **Release gate:** an element is enabled only after schema, defaults, migration, parent-child validation, Inspector mapping, accessibility, responsive behavior, preview/public parity and automated tests are evidenced together.

**Evidence boundary:** C.23.8 source bullets retained; acceptance contracts refined. This does not assert that every listed element or integration exists in runtime. C.23.9–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.46. P0.2 — Responsive viewport, breakpoint inheritance and canvas extent contract (2026-10-14)

**Audit scope:** C.23.9-01–12. The responsive editor must be one viewport over one canonical Page Model, not a parallel mobile document or alternate persistence path.

- **Viewport state vs document state:** viewport size, device preset, orientation and preview mode are transient editor state. Only explicit node/property edits enter command history, dirty state, revisioned save and publish.
- **Breakpoint registry:** breakpoints have stable IDs, deterministic ordering, explicit scope and validated dimensions. Site/page/component breakpoint definitions must share a declared policy; conflicting and unused definitions need diagnostics and impact review.
- **Inheritance and overrides:** the resolved-value algorithm must define inheritance direction and distinguish inherited values from explicit overrides in the Inspector. A child breakpoint edit must never silently rewrite a parent breakpoint value.
- **Override commands:** reset, copy, and clear are separate scoped commands. They must identify affected properties and source/target breakpoints, preserve unrelated overrides, participate in undo/redo, and apply atomically; bulk clearing requires confirmation.
- **Layout behavior and renderer parity:** fluid sizing, fixed/min/max constraints, wrapping, stacking, reordering, visibility, overflow and typography scaling require typed supported semantics. Preview and public rendering must resolve the same canonical data and supported CSS behavior.
- **Single canonical structure:** responsive visibility and presentation are overrides on canonical nodes by default. A separate node/page tree is not an acceptable workaround unless an explicit product requirement, migration, ownership model and publication semantics are approved.
- **Canvas geometry regression:** drag, resize, content growth, font/media load, zoom and transforms must update canvas height and scroll extent without clipping or coordinate drift. Test narrow, wide and extreme dimensions.
- **Diagnostics and evidence:** overflow/overlap/clipping findings should identify the affected node/property and distinguish warning from release blocker. Presets are not device testing; record actual browser/device viewport coverage and reproducible results.

**Evidence boundary:** all 12 C.23.9 acceptance contracts were refined while preserving the original source bullets and traceability IDs. This is documentation/contract work only: no runtime implementation or browser/device tests were executed in this batch. C.23.10–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.

### 41.3.47. P0.2 — Interaction states, public actions, motion and accessibility contract (2026-10-14)

**Audit scope:** C.23.10-01–08. Interactive behavior is a typed public-facing contract, not arbitrary event handlers attached to visual nodes. Preview behavior must remain isolated from editor authority.

- **State model:** common UI states have distinct meanings, precedence and transitions. Loading, empty, success, error, disabled and offline/unavailable are not interchangeable placeholders; states must remain perceivable without color alone.
- **Canonical navigation/actions:** links and actions use typed target kinds and one route/action registry. Internal routes, anchors, external URLs, downloads and new-tab behavior are validated; external links receive safe rel handling and invalid/missing targets are diagnosed.
- **Motion lifecycle:** transitions declare trigger, target, scope, timing and cancellation/replay semantics. Reduced-motion preferences and performance budgets constrain both preview and public playback; motion cannot carry essential information exclusively.
- **Preview security boundary:** preview may simulate public interaction but cannot invoke editor commands, alter Page Model/dirty state/history, access credentials or bypass server authorization. Client-side hiding is not an authorization control.
- **Domain failure states:** forms, media, CMS collections and integrations must distinguish validation errors, empty results, unavailable/offline services and recoverable failures. Recovery is contextual, while secrets and raw provider errors stay private.
- **Keyboard and focus:** all interactive controls have semantic keyboard behavior. Escape/cancel restores focus to the invoking control; menus, dialogs and overlays must not create focus traps or leave focus lost.
- **Third-party content:** embed origins and capabilities are allowlisted, sandbox/CSP and consent policy apply at render, unsafe scripts are blocked, and loading/performance/accessibility constraints are tested.

**Evidence boundary:** all 8 C.23.10 acceptance contracts were refined while preserving original source bullets and traceability IDs. Documentation/contract refinement only; no runtime, security, accessibility or browser tests were executed in this batch. C.23.11–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.

### 41.3.48. P0.2 — Page lifecycle, site shell, routing and published-only rendering (2026-10-14)

**Audit scope:** C.23.11-01–09. The Website Manager is the control plane for canonical page lifecycle and site structure; it must not create a second content authority or bypass the publish boundary.

- **Page lifecycle:** create, rename, duplicate, archive, delete, restore, reorder and publication-state transitions are distinct authorized operations. Destructive actions require defined recovery/retention semantics, audit history and concurrency handling.
- **Route identity:** slugs, canonical URLs, trailing slash, redirects and 404 behavior are one routing contract. Normalization is deterministic, duplicate routes are blocked, redirect loops are diagnosed, and private/unauthorized content is not misrepresented as public 404 data.
- **Page type ownership:** every enabled type identifies its schema, template, owning domain, data contract and public renderer. A placeholder or future commerce/content type cannot appear as functional without its owning capability.
- **Shared site shell and edit scope:** header/footer, announcement, navigation and shared sections use canonical shared resources. The editor must distinguish site-wide, page-local and component-level changes and show impact before applying a shared edit.
- **Navigation integrity and accessibility:** nested routes, active state, external links, labels and mobile behavior use the canonical navigation tree and safe URL policy; keyboard/touch operation and focus behavior are tested.
- **System routes and privacy:** 404, search, archives, maintenance/offline, privacy and terms pages have explicit lifecycle and ownership. Search, fallbacks and cache must never expose drafts or private records.
- **Duplication/import:** regenerate identifiers only where entity semantics require it; retain valid canonical references and reject/report invalid, dangling or cross-site references. Import is validated before atomic application.
- **Publish boundary:** public rendering reads only the canonical published revision. Draft/preview access is protected and noindex; publish, unpublish and rollback trigger deterministic cache invalidation and cannot leak stale/private content.

**Evidence boundary:** all 9 C.23.11 acceptance contracts were refined with source bullets and traceability IDs retained. Documentation/contract refinement only; no runtime routing, authorization, cache or browser tests were executed. C.23.12–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.

### 41.3.49. P0.2 — Dynamic Data schema, binding safety and canonical domain ownership (2026-10-14)

**Audit scope:** C.23.12-01–09. Dynamic Data is a typed binding/query layer over canonical domain sources, not a second database hidden inside the Page Model.

- **Versioned field schema:** every field type defines storage, validation, serialization, default/null/missing behavior, query capability and migration semantics. JSON is constrained by a declared schema and size/depth limits; relation/reference types are typed and scope-aware.
- **Schema lifecycle:** required, default, unique, searchable/filterable/sortable and display-format metadata are enforced by the server where authoritative. Schema changes need versioning, usage impact, migration preview, conflict reporting and safe rollback/resume behavior.
- **Binding contract:** every binding records canonical source/owner, resource identity, field, permitted transform/format, fallback and scope. Deleted, moved, incompatible or cross-site references produce explicit diagnostics and safe fallback, never implicit data copying.
- **Canonical source adapters:** site settings, schedule, Twitch/integrations, resource metadata and CMS collections are exposed only through declared adapters and public-safe DTOs. Each adapter defines allowed fields, authorization, site scope, freshness, cache invalidation and provider failure semantics.
- **Query and conditional evaluation:** conditions use typed allowlisted operators with deterministic null/missing behavior. No arbitrary code/eval; collection/repeater queries have bounded results, stable ordering, pagination limits and allowlisted URL state.
- **Privacy and preview:** sample/real-data preview modes are explicit and authorized. Secret/private fields are removed at source projection, not merely hidden in the UI; preview cannot bypass the published-only public output boundary.
- **Domain ownership invariant:** schedule, integration, resource and future business records remain owned by their domain services. Page Model stores binding/reference/configuration only; mutations go through the owning authorized domain API.
- **Failure and cache semantics:** loading, empty, error, stale, timeout, retry and unavailable-source states are distinguishable. Cache lifetime/invalidation and query limits are explicit; drafts/private data cannot leak through public queries or stale cache.

**Evidence boundary:** all 9 C.23.12 acceptance contracts were refined and the original source bullets/traceability IDs were preserved. Documentation/contract work only; no schema migration, query, privacy or runtime tests were executed. C.23.13–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.

### 41.3.50. P0.2 — Canonical Resource Manager, safe media lifecycle and R2/D1 boundary (2026-10-14)

**Purpose:** close the C.23.13 contract without implying that the implementation or its tests already exist. The Resource Manager, Editor picker, media, icon and font selection must be different views over one canonical, site-scoped resource registry—not independent stores or competing authorities.

- **One registry and one authorization path:** the Admin Resource Manager and Editor picker resolve the same stable resource identity, metadata, lifecycle state, availability and ownership. Enforce read/write permissions and site/tenant scope on the server for list, search, preview, upload, mutation and direct-ID access; hiding an item in the client is not authorization.
- **Upload lifecycle and recovery:** server-generate object keys; validate size, extension, declared MIME and detected content; define duplicate detection and idempotent retries. Multi-upload progress, cancel and retry must have deterministic outcomes. A failed metadata write or interrupted upload must trigger compensating cleanup or a reconcilable pending state, never an invisible orphan.
- **Metadata and library views:** search/filter/sort uses typed, site-scoped metadata with stable pagination. Folders/collections, favorites and recent items are organization/query metadata, not a second ownership model. Empty, unavailable, loading and error states remain distinguishable.
- **Accessible media editing and delivery:** keep alt text separate from caption, credit and license. Model crop/focal point and source-versus-derived rendition explicitly. Stable resource IDs survive replacement; rendition versioning and cache invalidation prevent stale output. Public delivery exposes only intended public renditions, never drafts or private originals.
- **Reference-aware lifecycle:** map resource usage across pages, components, templates and derived assets. Before delete/archive, show the impact set; block or explicitly migrate unresolved/live references. Archive, restore, replacement and missing-resource recovery must be auditable and produce actionable diagnostics rather than silently breaking published pages.
- **Format-specific security:** sanitize SVG with a maintained allowlist-based policy; reject active or dangerous content and MIME/content mismatches. Define permitted font formats, source/license metadata, video/audio limits, poster/caption requirements and download disposition/access. Enforce all controls server-side and test them through direct API paths, not only the UI.
- **Icons and fonts are resource types:** use the same canonical identity, site scope, lifecycle and audit path. The approved icon catalogue defines category/style/weight and meaningful-versus-decorative accessibility semantics; custom SVG follows the standard sanitizer. Fonts preserve family/weight/style/fallback/origin/license metadata and degrade safely when unavailable.
- **Storage authority:** R2 owns binary bytes; D1 owns resource metadata, site ownership, lifecycle and canonical references. Do not store duplicate binary payloads in D1 or introduce parallel media/icon/font ownership tables as a second authority. Define consistency checks, orphan reconciliation and compensation for partial writes.
- **Release evidence:** acceptance requires runtime tests for authorization and cross-site isolation, upload failure/retry cleanup, malicious file rejection, reference-aware delete/restore, replacement/cache invalidation, public/private delivery and metadata persistence. A written contract alone is not runtime proof.

**Evidence boundary:** the 10 C.23.13 rows now have explicit owner, scope, dependencies and acceptance contracts; original source bullets and traceability IDs are preserved. This is documentation-only work: no runtime, upload, security, storage-consistency or browser tests were executed. C.23.14–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.51. P0.2 — Editor persistence, recovery, preview and publication contract (2026-10-14)

**Purpose:** make save/recovery and public release a single revision-aware lifecycle. Editor UI indicators are not proof of persistence; only canonical server outcomes and published snapshots determine saved/public state.

- **One authoritative state machine:** track dirty, saving, saved, error, offline and conflict separately, tied to the exact document revision and mutation/request identity. Saving is not saved; a timeout is not proof that a write failed; success is shown only after a confirmed outcome and reconciliation.
- **Autosave and manual save:** define debounce and cancellation, mutation ordering, idempotency, retry/backoff, and stale-response handling. A response for an older edit must not clear dirty state for a newer edit. Manual save and autosave share the same canonical persistence path.
- **Safe recovery:** after refresh, tab closure or network/API failure, recover only versioned, scoped and authorized editor data. Reconcile with the server revision before applying local recovery; never persist session tokens, credentials or private integration secrets in local recovery.
- **Revision-pinned preview:** draft preview identifies the exact revision and viewport/breakpoint, uses protected and expiring access, is noindex, and has cache/session isolation from public output. Public routes and stale caches must never become a draft-preview back door.
- **Explicit publish transaction:** validate the selected revision and all required dependencies, show changed pages/resources and warnings, require publish permission and confirmation, then promote the published snapshot and audit the actor, time and revision. A failed publish preserves the previous public snapshot.
- **Revision history and concurrency:** revisions are immutable and attributable; diff/compare and restore identify the exact target. Optimistic concurrency detects stale edits; restore is a new authorized mutation with audit and cannot silently erase later work.
- **Network resilience:** distinguish retryable from permanent failures, use idempotency keys for mutation retries, reconcile uncertain outcomes and present conflicts in actionable form. Do not blindly replay non-idempotent actions or duplicate commands.
- **Bulk publish and package operations:** bulk publish remains gated until per-page publication is safe; define all-or-nothing versus per-page outcomes and report each result. Versioned import/export/backup packages validate schemas, site ownership, resource references and migration/rollback behavior; exclude secrets and support a dry run where appropriate.
- **Canonical architecture:** save, preview, publish, revisions, rollback and import/export use the existing canonical Page Model, revision, command and ownership contracts. No Editor-specific persistence or alternative publication authority is allowed.
- **Release evidence:** test real save/reload round trips, delayed/out-of-order responses, cancellation, offline recovery, stale-revision conflict, failed/partial publication, preview authorization/cache isolation, rollback and malformed/cross-site import packages.

**Evidence boundary:** the 10 C.23.14 rows now specify owner, gates, dependencies and observable acceptance outcomes. This is documentation-only work; no runtime persistence, network-failure, authorization, publication or browser tests were executed. C.23.15–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.52. P0.2 — Public SEO, social metadata, semantic accessibility and route diagnostics (2026-10-14)

**Purpose:** define SEO and accessibility as outputs of the canonical published page, not as editor-only labels or generated claims. Drafts and protected previews must remain outside public indexing and social discovery.

- **Canonical published metadata:** title, description, canonical URL, index/follow policy, sitemap membership and robots rules resolve from the actual canonical route and published revision. Draft, preview, private and unpublished pages are noindex and excluded from public sitemap output; robots.txt is not an authorization mechanism.
- **Social card parity:** Open Graph/Twitter metadata, preview UI, image fallback and per-page overrides use the same resolver. Only publicly fetchable media may be referenced. Validate image format/dimensions and external URL handling; distinguish a locally generated preview from proof of how a third-party crawler will fetch the page.
- **Truthful structured data and locale alternates:** generate schema only from typed, supported data that matches visible published content. Do not fabricate ratings, reviews, authorship, dates or other claims. Emit canonical language/locale and hreflang only when locale routes exist, are valid and point to the correct canonical counterparts.
- **Semantic accessibility:** headings, landmarks, link purpose, labels and image alternatives are part of the element schema and public renderer contract. Distinguish informative images from decorative images, for which empty alt is intentional; do not use filenames as a silent accessibility substitute. Validate the resulting public HTML, not only editor controls.
- **Redirects and link integrity:** validate redirect source/destination and status, prevent loops/conflicts and unnecessary chains, and require explicit approval before changes go live. Broken links, missing/duplicate metadata and canonical inconsistencies identify exact affected routes/elements and provide actionable remediation.
- **Diagnostics semantics:** each SEO/accessibility diagnostic is tied to a specific revision and identifies severity, rule, page/element and remediation. Warnings and publication-blocking errors are distinct; publish policy is explicit and does not block on subjective advisory scores.
- **AEO/discoverability safety:** assistant/search-oriented metadata is additive and evidence-bound to canonical visible content. No misleading schema, hidden keyword stuffing, unsupported factual claims or metadata that contradicts the public page.
- **Release evidence:** test generated HTML/meta for published, draft, preview, redirect, missing-media and locale scenarios; validate sitemap/robots behavior, canonical URLs, social image access, schema-content parity, keyboard/screen-reader semantics and exact diagnostic links.

**Evidence boundary:** all 8 C.23.15 rows now have explicit acceptance contracts. This is documentation-only work; no live crawl, metadata render, accessibility audit or route tests were executed. C.23.16–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.53. P0.2 — Accessibility, application security, consent and authorization gates (2026-10-14)

**Purpose:** define security and accessibility as enforceable behavior across the Editor, domain APIs and published renderer. A permission or accessibility control in the interface alone is not evidence of protection or conformance.

- **Keyboard and assistive technology:** every editing action must have a keyboard path, visible focus and a semantic accessible name/state. Dialogs manage focus containment, Escape/cancel and focus return; selection, canvas, Layers, Inspector, menus and error/recovery flows are included. Avoid keyboard traps.
- **Public output accessibility:** semantic heading hierarchy and landmarks, link purpose, labels, alt text, captions/transcripts, contrast, zoom/reflow and reduced-motion behavior must survive publishing. Test rendered public output at narrow viewports and enlarged text, not only the Editor chrome.
- **Accessible forms:** labels, instructions, inline errors, error summary, pending announcements and success/failure status have explicit semantics. Client validation improves usability but server validation is authoritative; server errors map safely to fields without leaking internal details.
- **Untrusted content boundary:** embeds use provider/domain allowlists, validated URLs, sandbox and permissions policy, CSP and consent gates. Arbitrary scripts are not permitted. SVG, URLs, custom attributes and constrained CSS are validated/sanitized and contextually encoded before rendering.
- **Privacy and consent:** analytics, cookies, embeds and future marketing integrations define purpose and consent behavior. Non-essential tracking is blocked when consent is absent or denied. Credentials, access tokens and private provider payloads never enter Page Model, browser bundles, logs exposed to users or public responses.
- **Server-side authorization:** every read and mutation checks actor, action, site ownership and object scope at execution time. Direct API calls, guessed identifiers and stale client state cannot bypass permission checks; deny by default and keep cross-site isolation as a release gate.
- **Destructive/global actions:** preview impact before execution; require confirmation appropriate to blast radius; record actor, target, time and outcome; use idempotent commands where possible and define rollback/recovery. Irreversible operations must be explicitly labeled and justified.
- **Evidence and claims:** combine automated security/accessibility checks with manual keyboard, screen-reader, contrast, zoom and reduced-motion review. Record test version, scope, findings, exceptions and remediation. Do not claim WCAG/security compliance from a checklist or automated scan alone.

**Evidence boundary:** the 9 C.23.16 rows now have explicit contracts and acceptance outcomes. Documentation-only work; no penetration tests, assistive-technology review, browser checks or runtime authorization tests were executed. C.23.17–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.54. P0.2 — Editor workspace, command discovery, user preferences and interaction contracts (2026-10-14)

**Purpose:** make workspace conveniences consistent with the canonical Editor state model. Navigation and preferences are not content mutations; every action must route through the same typed command and permission system.

- **Workspace layout:** resizable/collapsible panels, left/right arrangement, fullscreen/focus mode and canvas extent must cooperate. Recompute available canvas geometry after panel changes, retain valid selection and avoid clipping/scroll desynchronization. All workspace controls remain keyboard reachable.
- **Quick Add and command palette:** search returns typed actions from the canonical action/element registry, with context, permissions and disabled reasons. Keyboard shortcuts declare scope and precedence, detect collisions and avoid intercepting text entry or assistive-technology commands.
- **Selection navigation:** breadcrumb follows the selected node's canonical ancestry. Recent nodes, favorite assets and templates reference stable registry IDs and handle deleted, moved or unavailable items explicitly. Opening a menu, browsing or changing a preference is read-only.
- **Inspector preferences:** property search/favorites derive from the property registry. Panel state and preferences are user-scoped and versioned, with defined defaults/reset behavior; they never enter the site Page Model or published output.
- **Inline text editing:** define explicit start, commit, cancel, blur and exit semantics, including keyboard and text-composition input. Commit through one undoable canonical command; cancel restores the original value; focus or selection changes must not silently discard text.
- **Onboarding and diagnostics:** empty states offer the next safe action. Errors identify affected node/property and provide a useful recovery, retry or remediation path without exposing internal secrets. Permission, invalid document, missing asset and network failure states must not become dead ends.
- **Localization and accessibility:** UI labels/messages are catalogued, Hungarian-first and localization-ready, with fallback and pluralization rules. Live status/error announcements are accessible; shortcut hints are localized and keyboard/screen-reader tested.
- **Touch and tablet:** touch Editor acceptance has its own real-device/browser matrix, including target size, gestures, pointer cancellation, virtual keyboard and panel/canvas geometry. Tablet login/authentication is tracked separately and is not treated as proof of touch UX.
- **Release evidence:** test layout changes during drag/resize, keyboard navigation and shortcut conflicts, stale favorites, inline commit/cancel/undo, user preference persistence and isolation, localization fallback, and touch behavior on target devices.

**Evidence boundary:** the 9 C.23.17 rows now have explicit contracts and acceptance outcomes. Documentation-only work; no runtime workspace, tablet, localization or accessibility tests were executed. C.23.18–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.55. P0.2 — Canonical creator integrations, schedule/content blocks and Stream Studio boundary (2026-10-14)

**Purpose:** ensure Editor blocks present domain-owned data and provider capabilities without creating a second source of truth or exposing credentials. A visual block is not evidence that a provider API integration exists.

- **Twitch baseline:** use the canonical integration adapter for connection/capability state, live/offline status, channel metadata and approved embed/player behavior. Show freshness and stale/error states; reconnect/disconnect must preserve site ownership and avoid orphaned or misbound connections. Never expose tokens in block properties or public output.
- **Other platforms:** YouTube, TikTok and Discord may expose static links or explicitly approved basic embeds in the baseline. API-backed account connections, analytics, publishing and messaging remain gated to their roadmap phases; never show fictional connected state or unsupported live metrics.
- **Schedule domain ownership:** schedule blocks query the canonical Schedule domain for events, timezone, status, platform, game, artwork, URL and sync provenance. Page Model stores block configuration and references, not duplicate event rows. Editing event data routes through Schedule APIs and permissions.
- **Stream content:** VOD, clip, Short and highlight blocks use canonical content/resource references and provider-approved link/embed modes. Private, removed, rate-limited or unsupported content has explicit fallback and error behavior; the Editor does not become an alternative content store.
- **Creator profile and community:** profile/game/social/community/support/press-kit blocks use configurable, site-scoped data. Links, invites and support destinations are validated; funding amounts and payment status are factual and never fabricated or hardcoded as user-specific targets.
- **Stream Studio separation:** OBS browser sources, overlays, alerts and stream-control features are a separate future-gated capability with its own authentication, authorization and runtime contract. Public Editor nodes cannot invoke privileged OBS commands or bypass that boundary.
- **Common adapter contract:** provider adapters declare supported capability, required scopes, owner/site scope, freshness, rate limits, cache, errors, retry policy and public-safe DTOs. Blocks share loading, empty, stale, offline, permission-denied and provider-failure semantics.
- **Release evidence:** test revoked scopes, disconnected/stale providers, rate limits, unavailable embeds, cross-site connection IDs, token redaction, canonical schedule reads, private content and strict separation of public rendering from Stream Studio controls.

**Evidence boundary:** the 8 C.23.18 rows now have explicit contracts and acceptance outcomes. Documentation-only work; no provider API, embed, schedule, privacy or integration runtime tests were executed. C.23.19–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.56. P0.2 — Site search, bulk operations, dependency impact and health diagnostics (2026-10-14)

**Purpose:** define cross-site/editor operations as scoped, previewable and reversible commands. Search and diagnostics must report canonical state; bulk actions must not turn convenience into a permission or data-integrity bypass.

- **Find/replace:** search canonical page/node/resource fields within the authorized site and explicit scope. Show every target and before/after value, validate property types and binding rules, and apply as a bounded undoable command. Define behavior for stale results and concurrent edits; undo restores the original values.
- **Bulk style/token/preset:** apply only to compatible selected nodes and registered properties. Report changed, unchanged and incompatible targets, including mixed values and validation failures. The entire action has deterministic undo semantics and must not partially mutate without reporting it.
- **Site health checks:** detect broken links, missing/inaccessible assets, orphaned resources, duplicate IDs/slugs, missing alt text, invalid bindings and unsupported providers. Distinguish deleted from inaccessible and unknown from healthy; findings identify exact page/node/resource and actionable remediation.
- **Authoritative health panel:** derive publication, binding and integration state from canonical services with timestamps/freshness. Do not infer success from client state or show green/healthy when a source is stale, unavailable or unknown.
- **Bulk lifecycle actions:** archive, restore, delete and publish require appropriate permissions, impact preview and confirmation. Validate all targets before mutation; explicitly define atomic versus per-item partial outcomes, idempotent retries, audit and recovery. Report every item's result.
- **Transitive impact map:** resolve direct and indirect use across pages, shared components, templates, tokens, presets and resource references. Show affected surfaces before a global change and flag incomplete/stale dependency data rather than promising an exhaustive impact list without evidence.
- **Comparison and rollback:** page/revision/template/resource diffs are read-only and permission-scoped, distinguish semantic categories and identify the exact revision or resource version. A rollback target must be verifiable and restoring it is a separate authorized mutation.
- **Scope enforcement:** search, diagnostics and commands enforce site/resource/role scope on the server, not by filtering only in the UI. Revalidate scope when executing commands to handle stale selections and prevent cross-site ID probing.
- **Release evidence:** test large find/replace sets, mixed-compatible bulk styling, stale dependency maps, partial bulk failure, duplicate identifiers, missing/private assets, revision diffs and cross-site direct API attempts.

**Evidence boundary:** the 8 C.23.19 rows now have explicit contracts and acceptance outcomes. Documentation-only work; no runtime bulk, health-check, search, diff or authorization tests were executed. C.23.20–C.23.21 remain open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.57. P0.2 — Extension architecture, AI action safety and package integrity (2026-10-14)

**Purpose:** future extensibility and AI must build on canonical registries and the same authorized command pipeline as manual editing. Extensibility does not permit a second data authority or arbitrary code execution.

- **Canonical extension points:** component schemas/renderers, property registry, command API, resource types, template registry, integration adapters and diagnostics each have one owner and explicit version/compatibility/lifecycle contracts. Extensions cannot register hidden alternate persistence or bypass validation, ownership and audit.
- **Custom code boundary:** custom CSS, HTML, embeds and third-party components remain unavailable until reviewed contracts define sandboxing, CSP, allowlists, capability policy, resource limits, consent, versioning and rollback. An editor/admin role alone never authorizes arbitrary script execution.
- **Server-owned data:** the client never directly mutates D1/R2 and never receives privileged JavaScript capabilities. Every mutation passes through an authenticated server-side domain API with schema validation, site/resource scope, authorization and audit.
- **AI as proposal author, not a privileged executor:** AI may propose typed Page Model edits, responsive layouts, content or presets only through the shared Action API. It must not write storage directly or emit executable arbitrary HTML/scripts as a bypass around component schemas.
- **Approval and history:** show a before/after diff, affected page/resource/global scope, validation findings and undo path before applying AI changes. Destructive/global actions require explicit approval; publishing remains a separate user-authorized action. Every applied action is attributable and reversible where feasible.
- **Hard-denied capabilities:** AI cannot silently publish, alter authentication or secrets, overwrite newer user content without conflict resolution, or run arbitrary external code. Server-side authorization and approval checks cannot rely on model instructions or client-only controls.
- **Marketplace/shared libraries:** future third-party packages require provenance/license, version compatibility, dependency and vulnerability inventory, sandbox/capability review, safe import and rollback. Installation must not execute untrusted code by default.
- **Import/export integrity:** packages define schema version, dependencies, ownership mapping, media/resource references and validation policy. Validate the complete package before apply, support dry-run where useful, and define atomic/partial failure and rollback rather than leaving silent partial state.
- **Release evidence:** test attempted storage/script bypass, AI approval and publish boundaries, stale-content conflicts, malicious/incompatible package imports, missing dependencies and recovery after import failure.

**Evidence boundary:** the 8 C.23.20 rows now have explicit contracts and acceptance outcomes. Documentation-only work; no extension runtime, AI action, package-import or security tests were executed. C.23.21 remains open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.58. P0.2 — Verification matrix, regression coverage and evidence-based runtime acceptance (2026-10-14)

**Purpose:** make verification requirements executable and auditable. The existence of a test name, a written contract or a green unit test does not prove behaviors outside that test's scope.

- **Deterministic unit coverage:** pure layout, geometry, preset and schema helpers have stable fixtures plus boundary/invalid-input cases. Keep pure logic independent from browser timing where feasible.
- **Command and document integrity:** test canonical commands, history, undo/redo, Page Model serialization and save/reload round-trip. Assert exact state and relationships, not only that an action completed without throwing.
- **Validation and migration:** malformed property/nesting/import data, unknown schema versions, cross-site references and partial-failure paths must be rejected before mutation or fully rolled back. Preserve stable IDs according to entity semantics and report broken references.
- **Responsive invariants:** test inheritance, explicit overrides, reset-to-inherit, copy/clear and breakpoint switching. A child override must never mutate its parent/base value; persisted state and rendered preview must agree.
- **Canvas regression matrix:** include multiple zoom levels, long pages, negative and large Y movement, drag/resize, panel resizing and content growth. Verify canvas bounds, scroll extent, coordinate mapping and persisted geometry—not only a screenshot of the initial state.
- **Preset/shared-instance lifecycle:** cover apply, merge, replace, reset, fork and undo, including impact across shared instances and templates. Assert that changes stay within intended scope and undo restores exact prior relationships.
- **Persistence/publication:** test delayed/out-of-order responses, offline/error recovery, optimistic concurrency, draft/public isolation, publish failure, rollback and cache invalidation. Prior published output remains intact when a new publish fails.
- **Browser/accessibility:** maintain an explicit supported browser, viewport and device matrix. Combine automation with manual keyboard, focus, screen-reader, touch, zoom/reflow and reduced-motion checks; state unsupported environments clearly.
- **Public quality and privacy:** verify semantic HTML, canonical metadata, sitemap/robots, social cards, performance budgets, consent, secret redaction and private-resource cache boundaries against the actual built/public output.
- **Runtime evidence protocol:** for behaviors not proven by unit tests, record exact commit/build, environment, prerequisites, steps, expected/observed result and relevant logs/artifacts. Link failures and exceptions to an owner and resolution. Never infer PASS from a source diff or a checklist.
- **Gate discipline:** these tests are required evidence, not claimed results. A contract row can only move to PASS after the matching evidence is collected, reviewed and traceably attached to the canonical plan.

**Evidence boundary:** all 11 C.23.21 rows now have explicit test scope and acceptance outcomes. This is documentation-only work; no tests or production runtime checks were executed in this step. All C.23.13–C.23.21 contract batches are now documented, but this does not itself complete P0.2 archive reconciliation or prove the entire 01–140 traceability set. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.59. P0.2 — F.1 Editor history, transaction and recovery crosswalk corrections (2026-10-14)

**Források:** archived `00.9.6.F / F.1` history/autosave/recovery requirements; current `§24.3` EDT registry; `§37.27` F.1 crosswalk. The original source descriptions and stable F.1 keys remain unchanged.

- **F.1-05 — user-intent transaction boundaries:** corrected the candidate mapping from `EDT-005, EDT-006, EDT-007` to `EDT-004, EDT-005, EDT-008/009, EDT-022`. The source requires text debounce/blur grouping and drag/slider pointer-down-to-pointer-up grouping. EDT-006 is selection synchronization and EDT-007 is viewport zoom/pan/fit, so neither directly owns history grouping; transaction/history, drag/resize, and Inspector control semantics are the appropriate candidate owners.
- **F.1-06 — preset/batch transaction boundaries:** corrected `EDT-005–EDT-007, QA-002` to `EDT-003–EDT-005, DSN-004`. QA-002 is a QA anchor, not a feature-registry ID, and belongs in the QA column. The behavior is about canonical mutation, atomic transaction/rollback, history integrity and preset/global-change rollback; selection synchronization and viewport behavior are not the primary mapping.
- **F.1-08 — validated Page Model autosave:** added `EDT-001` to the existing `EDT-022, EDT-027, EDT-028, WEB-004` mapping because the requirement explicitly restricts persistence to the validated canonical Page Model. EDT-022 covers property/schema validation; EDT-027/028 cover draft/save-reload and WEB-004 the server draft path.
- **F.1-09 — crash recovery and conflict choices:** corrected the mapping to include `EDT-029` and `EDT-031`, replacing the misleading `EDT-030` as the primary local recovery reference. EDT-029 owns revision conflict recovery; EDT-031 explicitly owns network failure/retry/local recovery. WEB-007/008, OPS-009 and SEC-008 remain supporting revision/backup/secret-boundary references.
- **Evidence limit:** this is a targeted semantic correction of four F.1 crosswalk rows, based on the preserved source bullet text and the current registry definitions. No implementation or runtime test was run. F.1 rows outside this correction batch and F.2–F.13 still require their own semantic review; the original `00/A` and `00.9–00.9.6.B` source recovery remains open. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.60. P0.2 — F.1 end-to-end workflow and F.2 dynamic-data source mapping review (2026-10-14)

**Sources:** archived `00.9.6.F / F.1–F.2`, canonical `§24.3` EDT, `§24` DYN/WEB/SEC/OPS registries, and `§37.27` crosswalk. Source-key names and preserved requirement descriptions are unchanged; only candidate current-ID mappings and one QA anchor were corrected.

- **F.1-01 — complete editor workflow:** expanded coverage to the canonical Page Model/mutation path, element library and baseline element types, undo/redo, save/reload, preview, publish and renderer parity. A full user path cannot be represented by history and save IDs alone.
- **F.1-02 — reload/reopen/editability:** added stable node identity and the canonical Canvas/Layers/Inspector selection-sync contract; save/reload and selection/editability are distinct outcomes.
- **F.1-03 — required regression sequence:** added the element-library, container/layout and baseline element-type IDs plus selection synchronization. The source explicitly tests adding Box/heading/text/button/divider, reselecting earlier nodes in Layers, editing layout, save/reload and public-render parity; those capabilities must be represented rather than inferred from persistence IDs.
- **F.1-04 — immutable 50-entry FIFO history:** removed `EDT-006` (selection synchronization) from the primary mapping and retained transaction/history owners `EDT-004/005`. The FIFO capacity is preserved as a source requirement and still requires a direct boundary test at entry 51.
- **F.1-07 — one canonical model, no DOM snapshots:** broadened to Page Model and node invariants, mutation/transaction/history, plus selection synchronization; removed `EDT-007` as a primary mapping because viewport zoom/pan/fit does not own canonical mutation state.
- **F.1-10 — concurrency/retry/performance:** added transaction/history owners and moved QA-005 from the feature-ID cell to the QA-anchor cell. QA IDs are verification references, not feature-registry capabilities.
- **F.2-01 — dynamic pipeline:** removed `WEB-020` (public Contact page/form) and `EDT-018` (media/content block types) as misleading primary mappings. Added `EDT-020` for Dynamic Sanci block configuration and `WEB-031` for the published-only data boundary; DYN-001–008 remain the canonical pipeline contract.
- **F.2-05 — conditional visibility/cache:** added DYN-004 (conditional rendering) and DYN-007 (permission/site/published-only boundary), because cache invalidation alone does not represent the authorization invariant.
- **F.2-06 — Schedule block ownership:** replaced `EDT-018` with `EDT-020` and added DYN-007. The block configures display only; canonical Schedule records remain domain-owned and protected by site-scope/published-only checks.
- **Evidence boundary:** this batch corrects nine F.1/F.2 mapping rows from the preserved source text and current registry descriptions. No runtime tests were run. F.1 remaining rows and F.2–F.13 still require complete semantic review; the original `00/A` and `00.9–00.9.6.B` source recovery remains open. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.61. P0.2 — F.2 provider-scope and untrusted-query security mapping correction (2026-10-14)

- **F.2-02 — provider capability and connection scope:** expanded the mapping with `DYN-007`, `INT-005/006` and `SEC-003`. A provider adapter/capability ID alone does not express site ownership binding, allowed scopes, or tenant isolation; these are explicit acceptance boundaries for enabling any source.
- **F.2-03 — query/filter/transform safety:** expanded the mapping to `SEC-005–SEC-007` alongside `DYN-002–DYN-004` and `SEC-002`. The source prohibits arbitrary SQL, unrestricted fetch and JavaScript; server authorization alone does not cover injection/sanitization or abuse/rate limits.
- **Evidence boundary:** this is a mapping correction based on current registry descriptions and the preserved F.2 source bullets. No query-engine/security runtime tests were executed. F.2 remains open for full semantic review; F.3–F.13 remain to be reconciled row by row, and the original `00/A` and `00.9–00.9.6.B` source recovery is still unresolved. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.62. P0.2 — F.3 Inspector layout, QA-anchor and Plain Text capability mapping cleanup (2026-10-14)

- **F.3-02 — spacing/size controls:** retained the canonical layout and Inspector property owners, added `DSN-001` for token schema, and kept `DSN-004` only as the global-change/rollback supporting contract. Spacing values, linked sides and raw/token provenance are not owned by the global diff feature alone.
- **F.3-03 — responsive layout validation:** removed `QA-005` from the feature-ID mapping cell. It is a QA reference already represented in the dedicated QA-anchor column, not a product capability ID.
- **F.3-04 — Canvas/Layers selection and layout preservation:** the existing `EDT-009–EDT-016` range already includes EDT-013 selection synchronization, alongside geometry/layout constraints; the direct mapping is therefore present. The acceptance must still prove that drag/resize preserves flex/grid mode and Canvas/Layers resolve to the same canonical node.
- **F.3-05 — plain Text versus rich-text editor:** removed `EDT-019`, which is the Table/Accordion/Tabs/Form capability and does not own plain text or rich text. The 1.0 plain-text baseline maps to EDT-017 and validated mutation/schema contracts; EDT-043 remains a separately gated advanced Rich Text capability.
- **Evidence boundary:** these are four targeted F.3 mapping cleanups based on the preserved source text and §24 registry definitions. No runtime layout/editor tests were run. F.3 still requires complete semantic review; F.4–F.13 remain open, and missing original `00/A` / `00.9–00.9.6.B` sources remain unresolved. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.63. P0.2 — F.4 public page-type, stream/content and interaction mapping correction (2026-10-14)

**Source:** archived `00.9.6.F / F.4`; current WEB/LIV/CNT/EDT/SEC/OPS registries; `§37.27` F.4 crosswalk. The source requirements remain unchanged.

- **F.4-01 — explicit public page types:** replaced the previous `WEB-001, WEB-021–WEB-026` emphasis with `WEB-014–WEB-024` and canonical content IDs. The former mapping missed the actual Creator Home, Stream, Schedule, VOD/Content Hub, About and Community page IDs while including Store/Product and Membership pages not in this source bullet.
- **F.4-02 — Creator Home:** mapped to the actual home/profile/community/support and core content/schedule domains. Merch, email capture and campaign capabilities remain phased; the presence of a public page ID is not proof that each future commerce or marketing capability is available.
- **F.4-03 — Stream page:** corrected `WEB-022` (Link Hub) to `WEB-015` (Stream page), added `LIV-005` for player/embed and `WEB-032/SEC-005` for safe optional embeds. Live status/title/category and next-stream data remain separate canonical capabilities.
- **F.4-04 — VOD/Content Hub:** corrected `WEB-023` (Support page) to `WEB-017`, added search/filter/featured/related/public-hub content IDs, and narrowed provider adapters to Twitch VOD plus YouTube/TikTok capability-gated sources instead of unrelated Discord/Kick adapters.
- **F.4-05 — About, Link Hub and Press Kit:** replaced the Store/Product and Membership IDs with `WEB-018` About/Creator, `WEB-022` Link Hub and `WEB-024` Press Kit. Configuration, media-kit export and localization remain distinct support contracts.
- **F.4-06 — basic interactions:** removed QA-004/005 from the feature-ID cell and added `EDT-039` for the canonical action registry. QA references remain solely in the QA-anchor column.
- **F.4-07 — advanced interaction/motion gate:** removed `QA-005` from the feature-ID cell; mapped valid actions/safe output to `EDT-039`, `WEB-032` and `SEC-005`, with `EDT-040` for motion and `OPS-008` for performance.
- **Evidence boundary:** seven F.4 mapping rows were corrected using the preserved source bullet and registry definitions. No public runtime or provider tests were run. F.4 remains open for full semantic review; F.5–F.13 and original-source recovery remain open. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.64. P0.2 — F.4 interaction ownership and F.5 content/provider capability mapping review (2026-10-14)

- **F.4-06 — basic accessible interactions:** narrowed the feature mapping to `EDT-039` (canonical interaction/action registry), `WEB-032` (safe public rendering) and `SEC-005` (sanitization/safe embeds). Inspector property/schema IDs did not directly own the public interaction lifecycle; QA-004/005 remain in the QA column.
- **F.5-02 — content production lifecycle:** added `CNT-017` short-form export preparation and removed `CNT-018` transcript/chapter/highlight suggestions, which is a separate later capability and not a direct owner of the listed ingestion/calendar/publish-queue workflow.
- **F.5-03 — Twitch integration:** added the canonical adapter, capability registry and secret-redaction/audit contracts alongside OAuth, token, site binding, scope, event, live/schedule, VOD/clip and diagnostic IDs. Provider data is not enabled merely because a UI block exists.
- **F.5-04 — YouTube:** expanded the mapping to include connection-scope, retry/quota, capability and diagnostic contracts; the prior mapping named the adapter and analytics/content but omitted the source bullet's quota/scope/fallback behavior.
- **F.5-05 — TikTok:** added scope, capability-registry and diagnostics coverage to the existing rate-limit/retry/content references; TikTok support remains capability- and account-scope-gated.
- **F.5-06 — Discord/Kick/OBS/email/payment/commerce:** added the explicit Kick adapter and shared capability registry, removed the unrelated entitlement-lifecycle ID as a proxy for general adapter support, and retained dedicated OBS/store contracts plus the canonical community-link baseline.
- **F.5-07 — provider normalization/fallback:** confirmed the mapping already covers adapter contract, capability registry, diagnostics, freshness, shared state handling and analytics missing-data semantics; no ID change was required.
- **Evidence boundary:** the source text and historical keys remain intact. This is a mapping/registry review, not evidence that YouTube, TikTok, Discord, Kick, OBS, email or commerce integrations are implemented or authorized. No provider runtime tests were run. F.5 remains open; F.6–F.13 and original-source recovery remain open. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.65. P0.2 — F.6 Schedule ownership, query semantics and content relationship mapping (2026-10-14)

- **F.6-01 — canonical Schedule record:** replaced `RES-013` (font registry) with `RES-001/007` for canonical resource identity and artwork metadata. Schedule fields, lifecycle and external-ID provenance remain owned by SCH-001–015.
- **F.6-02 — schedule views and queries:** removed `SCH-006` (conflict detection) as the proxy for search/filter/sort. Clarified the existing `SCH-002` registry description to explicitly own site-scoped search/filter/sort/pagination for schedule list/calendar/upcoming/past views; this is an expansion of the existing capability, not a new feature ID.
- **F.6-05 — content-to-schedule relationship:** replaced `SCH-015` (iCal/export and later notifications) with `SCH-014` (game/content/schedule relationship). The canonical Schedule block remains `SCH-011` plus Editor display configuration; content ingestion/clip IDs describe the content records being linked, not ownership of the relationship itself.
- **F.4-06 — interaction mapping finalization:** the feature cell now contains only `EDT-039`, `WEB-032` and `SEC-005`; Inspector property IDs were not direct owners of the public interaction lifecycle. QA-004/005 remain in the dedicated QA-anchor column.
- **Evidence boundary:** four crosswalk/registry changes were verified in the canonical MASTER. No schedule query, timezone, content-link or public-render runtime tests were executed. F.6 remains open for full semantic review; F.7–F.13 and original-source recovery remain open. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.66. P0.2 — F.7 Admin/forms and F.9 SEO, accessibility, privacy and visual-regression mapping corrections (2026-10-14)

- **F.7-02 — shared Admin states:** removed `QA-005` from the feature-ID cell and retained it in the dedicated QA column. Added `OPS-003` as the error-observability support reference; QA anchors are evidence requirements, not product feature IDs.
- **F.7-04 — public forms:** corrected `WEB-027` (Events/Blog/News/Digital Products routes) to `WEB-020` (Contact page/form), and added safe validation, rate-limit and consent/privacy references. QA-006 remains in the QA column.
- **F.9-01 — published SEO/indexing:** added `WEB-031` for the published-only data boundary; preview/publish IDs alone do not fully express the no-draft/no-private indexing rule.
- **F.9-02 — redirects/broken links:** replaced `WEB-008` (revision history/diff) with `WEB-013` (redirect manager and broken-link report).
- **F.9-03 — public accessibility:** removed QA-004/005 from the feature-ID cell and replaced the misleading published-only visibility reference with semantic text/action, media-alternative, motion and safe public-renderer capabilities. QA-004/005 remain in the QA column.
- **F.9-05 — public/preview/admin boundaries:** added `WEB-031` so published-only visibility is explicit alongside preview authorization, publish validation, server permissions, logging and secret-safe export.
- **F.9-06 — performance gate:** removed `QA-005` from the feature-ID cell; performance QA remains in the dedicated QA column.
- **F.9-07 — visual regression:** moved QA IDs out of the feature-ID cell and added the canonical navigation, mobile-navigation, Creator Home and Schedule page IDs to the Editor mobile-action/Layers/Inspector test scope.
- **Evidence boundary:** eight mapping rows were corrected against the archived F.7/F.9 requirements and current registry. No forms, crawl, accessibility, security or visual-regression tests were executed. F.7/F.9 remain open for full semantic review; F.8 and F.10–F.13 remain open, as does original-source recovery. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.67. P0.2 — F.7 Admin state ownership, F.8 AI safety lifecycle and F.10 import/operations mapping review (2026-10-14)

- **F.7-02 — shared Admin usability contract:** expanded from a single shared-state ID to Admin shell/search/session/state/mobile, Editor dirty-state, localization and error-observability owners. The source combines several cross-cutting behaviors; ADM-008 alone does not represent search, keyboard/mobile, localization and unsaved state.
- **F.8-05 — AI orchestration lifecycle:** added AI-007–AI-009 and AI-019 for preview/approval, canonical execution, verification/audit/rollback and human approval of public/destructive/financial actions. A registry/task-planner mapping alone is insufficient to cover safe execution.
- **F.8-06 — AI cost and recovery:** added AI-007 approval and AI-009 audit/rollback to cost/quota/prompt/usage/error tracking. Secret handling remains server-side under SEC-008.
- **F.8-07 — Stream Intelligence and opt-in memory:** added AI-004 context selection/privacy filtering; opt-in memory must be explicitly privacy-filtered and consent/retention-controlled, not inferred from analytics or agent IDs.
- **F.10-02 — import integrity:** added RES-008/009 reference/lifecycle validation and SEC-003 tenant isolation. Schema validation alone does not prove that imported assets have valid usage references or that ownership cannot cross site boundaries.
- **F.10-04 — operational diagnostics:** added SEC-010 audit/privacy logging alongside secret redaction and retention. Logs must support diagnosis without exposing secrets or unnecessary personal data.
- **Evidence boundary:** six F.7/F.8/F.10 mapping rows were refined from source requirements and registry definitions. No AI, import/export, logging or Admin runtime tests were executed. F.7–F.10 remain open for complete semantic review; F.11–F.13 and original-source recovery remain open. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.68. P0.2 — F.11 release-phase boundary and F.12/F.13 profile, domain and creator-platform mapping corrections (2026-10-14)

- **F.11-01 — 1.0 release scope:** clarified the phase cell to “1.0 selected subset only; §39 per-domain gates override family ranges.” Its broad registry ranges identify the owning product families and do **not** mean every later capability in WEB/RES/INT is a 1.0 commitment. This avoids accidentally pulling Store, Membership, later platform adapters or paid/private asset access into the 1.0 release gate.
- **F.12-02 / F.13-01 — Game Profile:** removed `RES-013` (font registry) and the unrelated Link Hub reference from the Game Profile mapping. The canonical game domain is SCH-012–014, the About/Creator profile is WEB-018, and artwork/cover uses canonical resource identity and metadata (RES-001/007).
- **F.12-03 — TikTok handle and personal goal:** replaced `WEB-010` (global header/footer layout) with `WEB-018` (Creator profile). Provider capability/analytics remain gated and the personal goal remains editable profile data, not a guaranteed platform metric.
- **F.13-03 — artwork/metadata fallback:** replaced the font registry mapping with canonical asset, image variant, metadata and broken-resource diagnostics; DYN-005 and EDT-022 remain supporting fallback/state and Inspector-validation contracts.
- **F.13-06 — domain primary-change safety:** replaced `WEB-003` (page lifecycle) with `WEB-012/013` for route and redirect behavior. Domain verification, canonical URL and redirect warnings remain a gated future scope.
- **F.13-08 — Link Hub targets:** removed QA-005 from the feature-ID cell and added explicit Schedule, Community and public Content Hub target references; mobile/keyboard behavior is still verified via the QA column and mobile-navigation contract.
- **F.13-09 — smart redirect/UTM/QR analytics:** replaced `WEB-029` (public search index) with `WEB-013` (redirect/broken-link manager), which is the appropriate route-level capability.
- **F.13-10 — external URL safety:** added `WEB-032` safe public rendering to navigation/redirect and URL-scheme validation references.
- **F.13-12 — email integration:** replaced `INT-020` (integration diagnostics/recovery) with `INT-021` (future payment/email/commerce adapters); subscriber lifecycle/consent IDs remain explicit.
- **F.13-18 — responsive web/PWA boundary:** removed QA IDs from the feature mapping cell, added the mobile-navigation and responsive-preview contracts, and retained QA-004/005 only as evidence anchors. Responsive web is 1.0; PWA/native remains deferred.
- **F.13-21 — creator marketplace:** removed `CAM-009` invoice/payment status as a proxy for marketplace revenue share and added canonical resource provenance alongside template/component, OBS, digital entitlement and marketplace contracts. License/review and revenue share are owned by MKT-004/005.
- **Evidence boundary:** eleven F.11/F.12/F.13 mapping/phase cells were reviewed and corrected. No custom-domain, analytics, email, game-profile or marketplace runtime tests were executed. F.11–F.13 remain open for full semantic review, and original-source recovery remains unresolved. P0.2 stays **IN PROGRESS / NOT PASS**.


### 41.3.69. P0.2 — F-crosswalk separation of feature mappings from QA evidence anchors (2026-10-14)

A structural scan of the 96 F.1–F.13 crosswalk rows found two remaining rows where QA IDs were mixed into the canonical feature-mapping cell:

- **F.8-08:** removed `QA-008` from the mapping cell; AI/operations feature references remain there and QA-002/003/008 remain in the dedicated QA column.
- **F.11-01:** removed `QA-001–QA-010` from the mapping cell. QA-002–QA-009 remain in the dedicated QA column. `§39.2` and the feature-family ranges remain scope references, not a claim that every referenced capability is scheduled for 1.0; the phase-cell qualifier added in §41.3.68 keeps §39 per-domain gates authoritative.
- **Verification:** a fresh scan of all 96 F.1–F.13 crosswalk rows found no remaining `QA-###` IDs in the feature-mapping column. This is structural hygiene only; it does not prove semantic completeness or feature readiness.
- **Evidence boundary:** no runtime tests were run. F.1–F.13 still need complete source-by-source semantic approval, and the original `00/A` / `00.9–00.9.6.B` recovery remains open. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.70. P0.2 — Additional historical source recovered: 00/A.2.2 Schedule CRUD + Inspector / domain-driven Editor DoD (2026-10-14)

**Source provenance:** read-only retrieval from the historical branch `planning/ultimate-master-plan`, file `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md`, blob SHA `adc958b61e9c09d246989626c92066489d1d72f4`, lines 30–44. This exact subsection was absent from the currently canonical archive snapshot on `v2/foundation`; its presence on the historical branch is now recorded here so the requirement is not lost. The archive file remains historical evidence, not a second active plan.

**Recovered requirement/architecture content:**
- The canonical Visual Editor runtime is exclusively `public/editor-v2/`; legacy Editor/Admin/Schedule layers must not be reactivated as competing canonical surfaces.
- Schedule records remain canonical domain data in D1. The Page Model stores presentation/configuration and references, not duplicate Schedule domain records.
- Inspector uses the existing canonical Property Registry/state contract; it must not create a parallel property or state system.
- Every new data path is site-scoped and uses the established E4 site-ownership contract.
- Every mutation uses the established command/history/validation/persistence/audit pattern. Preserve the canonical Page Model, domain ownership, command/history, validation, revision/save/publish and site-ownership boundaries unless a proven architectural reason and separately approved plan change justify otherwise.
- The Editor may be redesigned or rebuilt at the UI level, but this does not authorize a second canonical Editor core, Schedule domain or persistence path.
- The historical subsection's old F-active and M0-superseded execution statements are not current instructions. The current MASTER's `§0.2` active point and sequential P0.2 gate remain authoritative.

**Recovery limit:** this recovers one historical subsection and its seven architecture invariants, not the full original `00/A` chapter. The complete original `00/A` and `00.9–00.9.6.B` source set remains **PARTIALLY RECOVERED / OPEN**. Do not infer missing bullets from this subsection or from E/F. Continue searching historical branches/commits and map each recovered requirement into the existing single MASTER.

**Evidence boundary:** source presence was verified by fetching the named file on the named historical branch and reading the exact lines. No runtime implementation or acceptance is implied. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.71. P0.2 — F.10 recovery-package integrity and F.13 creator-app/marketplace capability mapping (2026-10-14)

- **F.10-01 — versioned export:** added template schema/version compatibility, resource usage/reference integrity and public-safe settings projection. A secret-free export contract must cover not only media IDs but also resource references and settings fields that are excluded from public output.
- **F.10-02 — import dry-run:** added DSN-014 schema migration/compatibility and SEC-008 secret handling to the existing package, ownership and reference validation mapping. Import must reject or explicitly migrate incompatible versions before any mutation.
- **F.10-03 — restore verification:** added canonical Page Model identity and public-render parity plus draft/published state to the recovery mapping. A successful backup restore is not accepted until revision, draft/published boundary and rendered output are checked.
- **F.13-07 — brand settings:** added canonical media identity, variants and accessible media/license metadata for logo/avatar/cover references; icon/SVG/font registries remain separate typed resource capabilities.
- **F.13-19 — future creator app:** added analytics, content approval and OBS alert-event references because the source explicitly includes analytics, moderation and content approval in addition to live, alerts and schedule. Reuse of canonical APIs/permissions remains mandatory.
- **F.13-21 — creator marketplace:** expanded the design-system mapping to include themes, reusable component/master-instance/variants and later community/marketplace capabilities. The future marketplace must not be represented only by template export IDs.
- **Evidence boundary:** six mapping rows were refined from source text and canonical registry descriptions. No import/restore, mobile-app, marketplace or creator-profile runtime tests were executed. F.10 and F.13 remain open for full semantic review, as do remaining F sections and original-source recovery. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.72. P0.2 — Custom-domain lifecycle identified as a missing canonical capability (SET-004) (2026-10-14)

**Gap:** F.13-05/06 require adding/verifying a custom domain, DNS/SSL state, primary-domain selection, canonical URL transition and redirect warnings. The prior SET registry contained only site settings CRUD, site ownership/multi-site scope, and public-safe settings projection. Mapping this lifecycle only to SET-002 plus route/SEO/security IDs did not provide a dedicated domain-lifecycle owner.

- Added **SET-004 — Custom domain lifecycle, verification, DNS/SSL status, primary-domain transition and canonical URL** under the existing §24.18 SET registry. This is a planned canonical capability ID, not an implementation claim.
- Updated F.13-05 and F.13-06 to map to SET-004 alongside site scope, route/redirect, SEO, operational health and open-redirect defenses.
- The former 361-ID baseline remains a historical snapshot. The current registry now contains 362 unique IDs. SET-004 is explicitly referenced in both F.13-05 and F.13-06; a fresh full registry-to-crosswalk structural reconciliation is required before claiming 362/362 coverage.
- **Source recovery:** the historical `00/A.2.2` subsection remains only a partial recovery. Searches across the known `planning/ultimate-master-plan` archive snapshot and the three discovered archive branches did not locate separate `00-A.md` or `00.9.6.B.md` files. This only bounds the paths/refs searched; it does not prove the sources never existed elsewhere in history.
- **Evidence boundary:** registry/mapping documentation only; no DNS, domain verification, SSL, redirect or runtime test was executed. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.73. P0.2 — Game Profile phase reconciliation against the 1.0 release contract (2026-10-14)

**Conflict found:** §39.2 explicitly includes Schedule/Game Profiles in the 1.0 professional creator website, while the F.13-01/02/04 crosswalk assigned the entire Game Profile domain to 1.5–2.0. F.12-02 also described the Game Profile domain as phased, leaving the minimum 1.0 commitment ambiguous. That would let the roadmap contradict its own release contract and could defer a capability that §39.2 promises.

**Correction in the existing crosswalk:**
- F.12-02 now defines the 1.0 minimum as configurable creator profile plus minimum Game Profile CRUD, with extended profile metadata/provider mapping staged later.
- F.13-01 now separates the 1.0 stable-ID profile/slug/name and Schedule-reference baseline from advanced provider mapping, brand metadata and lifecycle fields in 1.5–2.0.
- F.13-02 makes stable-ID Schedule references and the prohibition on copied game data a 1.0 invariant; advanced Game Profile workflows remain phased.
- F.13-04 makes canonical domain ownership and the prohibition on an Editor-only game store a 1.0 architecture invariant, while advanced management remains later-phase.

**Acceptance boundary:** this resolves a roadmap/crosswalk phase contradiction; it does not claim that Game Profile CRUD or Schedule references are implemented or runtime-accepted. The minimum 1.0 scope must still pass schema, site scope, CRUD, Schedule reference integrity, Editor read-only/reference behavior, save/reload and public-render tests. The richer Game Profile capability remains preserved for later expansion. P0.2 remains **IN PROGRESS / NOT PASS**; no feature implementation was started.


### 41.3.74. P0.2 — Active status corrected after SET-004 registry expansion (2026-10-14)

The opening P0.2 summary now distinguishes the last verified 361-ID structural snapshot from the current 362-ID registry after SET-004. The former 361/361 result is historical evidence only; it is not promoted to 362/362 by inference. The current summary also records the Game Profile phase reconciliation at §41.3.73 and keeps the archive/source-provenance and per-ID semantic contract work explicitly open.

**Evidence boundary:** this is a consistency correction to the active status summary. It does not constitute the pending 362-ID structural recheck, does not recover the missing original source set, and does not change P0.2 from **IN PROGRESS / NOT PASS**.


### 41.3.75. P0.2 — Friss teljes registry→crosswalk strukturális újraellenőrzés (2026-10-14)

**Vizsgált állapot:** a jelenlegi `v2/foundation` MASTER teljes tartalma; §24.1 registry és a §37.22–§37.30 crosswalk, beleértve a §37.32 összesítőt.

**Eredmény — strukturális lefedettség PASS, kizárólag erre a szűk ellenőrzésre:**
- A §24 registryben **362 egyedi ID** található; a registry-szeletben nem találtam duplikált ID-t.
- A crosswalk explicit ID-ket, azonos prefixű tartományokat és perjeles rövidítéseket együtt kezelő újraellenőrzése **362/362 registry-ID lefedettséget** talált.
- A korábbi egyszerű parser a `SET-002/004` alakból csak a `SET-002` ID-t olvasta ki; a helyes rövidítésfeloldás `SET-004`-et is lefedett. Ezért a korábbi 361/362 jelzés parserkorlát volt, nem tényleges crosswalk-hiány.
- `LOC-007` és `LOC-008` csak a §37.26-ban található tiltó/magyarázó mondatban fordul elő, amely kimondja, hogy nincsenek definiálva és nem hivatkozhatók; nem szerepelnek aktív crosswalk-hozzárendelésként.
- A §37.32 korábbi „359 ID” összesítő mondata frissítve lett 362-re, és rögzíti a jelenlegi ellenőrzést.

**Hatókör és korlát:** ez a kör a registry-ID-k strukturális feloldását igazolja a §37 crosswalkban. Nem bizonyítja az összes történeti követelmény szemantikai megőrzését, a forrásbulletek kétirányú teljességét, a hiányzó archív források megtalálását, a domain/permission/dependency contractok teljességét vagy a runtime megvalósítást. A 271 H19–H34 történeti kulcs és a 310 C.23 + F.1–F.13 forrásbullet külön auditfeladat marad. **P0.2 továbbra is IN PROGRESS / NOT PASS**; ezzel csak a §24→§37 ID-feloldási strukturális részfeladat zárható le.


### 41.3.76. P0.2 — Game Profile Admin surface traceability gap flagged for M0.3 (2026-10-14)

Az archív `F.12` forrás kimondja, hogy a creator profil és a játékok Adminból legyenek konfigurálhatók. A jelenlegi `F.12-02` és `F.13-01` sorok a `SCH-012` Game Profile CRUD-t, `SCH-014` kapcsolatot, valamint a resource/profile adatokat leképezik, de nem neveznek meg explicit kanonikus Admin route-ot vagy felületet. Az `ADM-001`–`ADM-010` leírásai között nincs Game Profile-specifikus Admin CRUD felület-ID.

**Döntés:** nem hozok létre találomra új ADM-ID-t, és nem állítom, hogy a runtime-funkció hiányzik. A crosswalkba bekerült a nyitott surface-traceability megjegyzés. M0.3-nak a tényleges Admin menü/route/action inventory alapján kell:
1. megneveznie a Game Profile CRUD kanonikus Admin felületét és route-ját;
2. rögzítenie az owner/domain, permission és CRUD action kapcsolatot;
3. eldöntenie, hogy egy meglévő ADM capability pontosítása elég-e, vagy külön capability ID indokolt;
4. ellenőriznie, hogy az Editor csak a canonical Game Profile domainre hivatkozik, és nincs editor-only párhuzamos adattár.

**Állapot:** nyitott M0.3-függőség; ez nem zárja le F.12/F.13 szemantikai traceability-jét, és nem változtatja meg P0.2 **IN PROGRESS / NOT PASS** állapotát.


### 41.3.77. P0.2 — F.9-03 hibás accessibility ID-hozzárendelés javítva; cross-cutting contract nyitott (2026-10-14)

Az archív F.9-03 a teljes publikus accessibility követelményt sorolja fel: semantic HTML/heading hierarchy, alt, form labels, ARIA, keyboard/focus, contrast, screen-reader support és reduced motion. A korábbi crosswalk ezt részben a `WEB-032` ID-hez rendelte, miközben a §24 registry `WEB-032` leírása „Public content rendering security and safe embeds”; ez nem megfelelő szemantikai egyezés.

**Korrekció:** a `WEB-032` kikerült az F.9-03 accessibility-hozzárendelésből. A megmaradt rész-azonosítók: `EDT-017`, `EDT-037`, `EDT-040`, `RES-007`, `WEB-011`. Ezek konkrét rész-képességeket fednek le, de nem állítom, hogy együtt bizonyítottan lefedik a teljes accessibility szerződést.

**Következő döntés M0.2-ben:** a cross-cutting domain/capability inventory alapján kell eldönteni, hogy a teljes accessibility contract külön canonical capability/ID-t igényel-e, vagy mely már létező domain kapja a normatív ownershipet és acceptance checklistet. Addig F.9-03 szemantikai lefedettsége OPEN, a 1.0 accessibility release gate kötelező marad. Nem hoztam létre előre új ID-t, mert a domain- és prefix-ownership döntés még nem zárult le.

Ez a javítás kizárólag a crosswalk szemantikai pontosságát érinti; a 362/362 strukturális ID-lefedettség továbbra is igaz az explicit/tartományos/perjeles feloldásra, de ez nem helyettesíti az újonnan rögzített szemantikai hiány rendezését. **P0.2 marad IN PROGRESS / NOT PASS.**


### 41.3.78. P0.2 — F.9 visual-regression acceptance és F.10 package-import contract pontosítása (2026-10-14)

**F.9-07 / QA-004:** a forrás külön vizuális regressziós baseline-t követel a publikus home/navigation/Schedule és Editor állapotokhoz desktop/tablet/mobile felbontásokon. A QA registry `QA-004` leírása csak browser/device responsive acceptance-et nevezett meg. Pontosítottam a definíciót „Browser/device responsive and visual-regression acceptance” alakra. Ez a contract pontosítása, nem azt jelenti, hogy a vizuális tesztek már megvalósultak vagy PASS állapotúak.

**F.10-02 / package import:** a követelmény schema/version, assets, duplicate IDs, owner/permission és migration compatibility dry-run validációt ír elő. A jelenlegi `OPS-005` backup/export/restore és `DSN-015` template import/export nem bizonyítja a teljes Page Model/revision/resource/domain package importot. A crosswalk most explicit nyitott generic package-import contractot jelez. M0.2-ben kell meghatározni a canonical ownershipet/ID-t, az import scope-ot, a dry-run eredményformát, a részleges hibák viselkedését és a rollback/acceptance kritériumokat; nem szabad a template-importot teljes site-package importnak tekinteni.

**Állapot:** a QA-004 fogalom pontosítva; az F.10-02 import contract továbbra is OPEN. Ez a két szemantikai részfeladat nem zárja le P0.2-t, amely **IN PROGRESS / NOT PASS** marad.


### 41.3.79. P0.2 — H19 Resource historical mapping: image processing, video/audio, clip assets and cache policy (2026-10-14)

A H19.01–H19.20 Resource/Asset Library ledger szemantikai ellenőrzése a RES-004 media-processing contractot pontosította, és három további, külön ownershipű sort rendezett:

- **H19.08 crop, H19.09 resize és H19.17 image optimization:** a korábbi RES-004 leírás csak preview/thumbnail/variant volt, ezért a három történeti képesség nem volt explicit a registryben. A RES-004 definíciója bővült crop/resize és optimization pipeline-nal; a konkrét supported format, output variants, quality/size budget és phase-specific acceptance továbbra is a Resource contract része, nem runtime PASS.
- **H19.18 video/audio:** a korábbi `RES-004` mapping hibásan image preview/thumbnail/variant capabilityre támaszkodott. Javítva `RES-001/002/003` alapokra (canonical asset registry, R2/D1 boundary, upload lifecycle); az explicit támogatott media type, preview/playback és elfogadott formátumok contractja M0.2-ben nyitott. Ez nem állítja, hogy a teljes video/audio processing 1.0 része.
- **H19.19 clip/Short assets:** a korábbi csak `CNT-003` mapping a content item managementet fedte le, de az eredeti Resource / Asset Library ownerből következő binary asset ownershipet nem tette láthatóvá. Javítva `RES-001/002 + CNT-003` leképezésre: az asset binary/resource és a clip/Short canonical content item külön felelősség, az advanced workflow 1.x+ marad.
- **H19.20 cache policy:** az `OPS-008` önmagában általános performance/cache/query monitoring; nem specifikálja az asset cache policyt és invalidationt. A mapping `WEB-030 + OPS-008` lett, és az asset-specific owner/policy/invalidation contract M0.2 nyitott pontként szerepel.

**Döntés:** az eredeti három történeti kulcs megmaradt, a jelenlegi hozzárendelés pontosabb lett; nem hoztam létre új RES ID-t a domain-ownership audit lezárása előtt. A 1.0 alap media support és a későbbi video/clip processing közti határ explicit marad. A H19 ledger továbbra is **MAPPED DRAFT**, nem PASS; P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.80. P0.2 — H21 Twitch metric phase corrected against §39.2 release minimum (2026-10-14)

A H21.05 (Twitch viewer statistics) és H21.06 (followers/subscribers where available) sorok korábban 1.0 célfázist kaptak, mert a környező H21 táblázat a Twitch integrációt általánosan 1.0-hoz kötötte. Ez túl tág besorolás volt: a §39.2 1.0 minimum Twitch connection/live/next-stream és Schedule alapokra épül, nem ígéri meg a viewer/follower/subscriber metricst. A F.12-03 is külön kimondja, hogy a személyes follower goal konfiguráció és a provider metric külön, gated képesség.

**Korrekció:** a két történeti követelmény megmarad, de célfázisuk **2.0+ Creator OS analytics, provider capability/permission gated** lett. A provider API-jogosultságot, elérhetőséget és acceptance-t a megfelelő fázisban kell bizonyítani; a „where available” nem jelent garantált adatot. A Twitch alapkapcsolat/live state 1.0 scope-ja változatlan.

Ez fázis-koherencia javítás, nem runtime-állítás. A H21 ledger továbbra is **MAPPED DRAFT**, P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.81. P0.2 — H24 accessibility ledger: QA acceptance was incorrectly used as feature ownership (2026-10-14)

A H24.01–H24.13 historical ledger semantic review found that most rows mapped the canonical feature ID to `QA-005` (public SEO/accessibility/performance audit), or `QA-004` (browser/device acceptance). These are test/acceptance anchors, not the runtime feature owner. This would make the traceability table look complete while hiding the missing canonical accessibility contract.

**Correction:** `QA-004/005` remains in the QA-anchor column, but is no longer presented as the feature owner for H24.01–H24.13. Existing feature mappings remain only where the scope actually matches: `RES-007` for alt-text metadata and `EDT-037` for keyboard-accessible canvas alternatives. The other generic accessibility requirements now explicitly say that the cross-cutting accessibility contract and owner are TBD in M0.2. The Editor accessibility-check row keeps `EDT-037` only as a partial mapping and marks the full contract open.

**Required M0.2 decision:** assign canonical ownership for semantic HTML/heading hierarchy, labels/ARIA, focus order/visibility, contrast, screen-reader support, form validation accessibility, Editor accessibility checks and public accessibility audit; define 1.0 acceptance evidence and tests; then decide whether an existing domain can own the full contract or a dedicated cross-cutting capability ID is needed. No new ID was created ahead of the domain-ownership decision.

**State:** H24 remains MAPPED DRAFT and semantically open. This corrects misleading traceability, not implementation status. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.82. P0.2 — F.4 interaction mapping cleaned; public page types explicitly remain separate capabilities (2026-10-14)

A felhasználóbarát, jól elkülönített funkcióstruktúra érdekében az F.4 public-surface és interaction sorait ellenőriztem.

- Az F.4-01-et explicit **oldaltípus-leltárként** jelöltem, nem egyetlen mega-oldalként. A `WEB-014`–`WEB-024` külön capability-k maradnak Home, Stream, Schedule, Content Hub, About, Community, Contact, Resources, Link Hub, Support és Press Kit célokra. Közös komponensek megengedettek, de nem olvaszthatják össze a külön route-, adat-, permission-, editor- és publish-életciklusokat.
- Az F.4-06 korábban a `WEB-032` safe-embed/security ID-t és `SEC-005` sanitization ID-t általános interaction/accessibility mappingként használta. Ezek nem fedik le a teljes click/focus/navigation/submit UX-et. A mappinget `EDT-039` interaction registryre és részleges `WEB-011` keyboard/mobile navigationre javítottam; a teljes accessibility acceptance az M0.2 cross-cutting contract döntéséig nyitott.
- Az F.4-07-ből kivettem a szintén nem megfelelő safe-embed/sanitization hozzárendeléseket. A motion, interaction, keyboard behavior és performance külön képességként marad; az action-security és accessibility contract nem rejtőzik az Editor interaction ID alatt.

**Állapot:** dokumentációs/szemantikai javítás; nem runtime acceptance. F.4-06 teljes accessibility coverage OPEN; P0.2 továbbra is **IN PROGRESS / NOT PASS**.


### 41.3.83. P0.2 — H30 performance ledger: QA acceptance separated from canonical feature ownership (2026-10-14)

A H30.06–H30.09 sorok korábban `QA-005` vagy `QA-004` ID-t mutattak feature capabilityként Core Web Vitals, rendering performance, large-page performance és large-tree Editor performance esetén. Ezek acceptance/audit kapuk, nem önmagukban a teljesítmény-funkciók runtime tulajdonosai. A QA ID-k a QA-anchor oszlopban maradtak.

**Korrekció és bontási elv:**
- **H30.06 Core Web Vitals:** `OPS-008` monitoring/baseline alap, de a public budget/measurement contract ownership még M0.2 döntés.
- **H30.07 rendering performance:** külön public rendering contract; nem olvad össze a cache-sel vagy az általános QA-val.
- **H30.08 large-page performance:** külön nagy oldalakra vonatkozó budget/acceptance; nem azonos a Core Web Vitals általános mérésével.
- **H30.09 large-tree Editor performance:** külön Editor-specifikus capability és acceptance kell; a public rendering budget nem helyettesíti.

Nem hoztam létre előre új ID-t és nem állítottam, hogy a runtime funkció hiányzik. M0.2-ben kell lezárni a canonical cross-cutting/Editor ownershipet, a mérhető budgeteket, a mérési környezetet és a release acceptance-et. A QA-004/005 audit szerepe változatlan; a H30.06–H30.09 szemantikai ownership **OPEN** marad. P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.88. P0.2 — H26 editor performance separated from creator content analytics (2026-10-14)

A H26.09 editor/content performance sor korábban kizárólag ANL-004 content performance ID-ra mutatott. Ez összemosta az Editor/public renderer technikai teljesítményét a tartalom eredményességi metrikáival. Az OPS-008 technikai performance baseline/monitoring és az ANL-004 content performance külön tulajdonosi és adat-hozzáférési határ marad; a mérőszámok, retention, dashboard és acceptance részleteit M0.2-ben kell pontosítani.

**Állapot:** H26.09 mapping szétválasztva; ez nem állít befejezett telemetriát vagy analytics runtime-ot. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.87. P0.2 — H31 AI Editor actions and AI accessibility/visual QA mapped to the correct contract boundaries (2026-10-14)

A H31.01–H31.04 page/element/style-layout/responsive operations sorok korábban kizárólag AI-011-re mutattak. Az AI-011 a website structure/content assistant felületét írja le, nem a tényleges Page Model mutáció, canonical action, permission, validation, preview/diff, approval, execute, verify, audit és rollback teljes szerződését. A négy művelettípus külön marad, és az adott Editor-domain owner M0.2-ben zárandó; az AI pipeline ID-k csak a végrehajtási határt adják, nem helyettesítik a domaint.

A H31.07 accessibility QA és H31.08 visual QA korábban AI-012-re mutatott, de az AI-012 registry-definíciója SEO/accessibility/localization suggestions; nem bizonyít teljes akadálymentességi auditot vagy vizuális regressziós rendszert. Ezeknél a canonical runtime owner és mérhető acceptance külön M0.2-feladat, a QA ID-k teszt/release horgonyok maradnak.

**Állapot:** hat H31 mapping pontosítva; nincs új feature-ID, runtime-állítás vagy implementation PASS. A konkrét Editor action/domain owner és az AI QA acceptance szerződések M0.2-ben zárandók. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.86. P0.2 — H32 stream diagnostics separated from scene suggestions, profile/memory/preferences and evaluation lifecycle (2026-10-14)

A H32.07 scene suggestions sor korábban AI-015-re mutatott, noha az AI-015 canonical registry-definíciója stream diagnostics/summary; a scene-suggestion forrás, permission és jóváhagyási UX külön szerződés. A H32.19–H32.21 streamer profile, long-term memory és preferences három külön adat- és felhasználói kontroll-életciklus: nem olvaszthatók össze az AI-016 specialist-agent role definíciójával. A H32.22–H32.25 historical outcomes, experiment tracking, evaluation cycle és feedback loop szintén külön fogalmak; az AI-015 diagnosztikai horgonya nem igazolja ezek tulajdonjogát.

A félrevezető canonical ID-hozzárendeléseket nyitott M0.2 tulajdonosi döntésre cseréltem. Nem hoztam létre új ID-t, nem állítok runtime hiányt vagy kész funkciót; a cél a hamis lefedettség elkerülése és a külön adatforrások, lifecycle-ok, consent/retention, user controls és acceptance követelmények láthatóvá tétele.

**Állapot:** nyolc H32 mapping pontosítva; a nyitott canonical owner és részletes DoD M0.2-ben zárandó. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.85. P0.2 — H33 workflow domains separated from generic automation orchestration; H34 QA ownership clarified (2026-10-14)

A H33.03–H33.06 sorok korábban mind kizárólag az AUT-014 Safe cross-domain actions ID-ra mutattak. Ez csak az automatizációs action/orchestration határt jelöli; nem jogosít fel arra, hogy a content, media/resource, stream/provider és notification/delivery workflow egyetlen közös funkcióvá vagy adat-életciklussá olvadjon össze. A négy történeti követelmény külön sor és külön lifecycle marad. A canonical domain owner mindegyiknél nyitott M0.2-feladatként szerepel; implementációt nem indítunk, és új feature-ID-t bizonyíték nélkül nem találunk ki.

A H34.04 accessibility benchmark sorból eltávolítottam a QA-005-öt mint látszólagos runtime feature-ownert: a RES-007 alt metadata és EDT-037 keyboard-accessible canvas alternatives csak a már ismert részleges feature horgonyok, míg QA-005 review/test szerepű. H34.21 implementációs eljárási lépése sem a QA-001 runtime/domain owner funkciója; a végrehajtás tulajdonosa minden esetben az adott, MASTER-ben jóváhagyott domain/feature marad, QA-010 pedig a folyamatos governance lépést horgonyozza.

**Állapot:** H33 workflow sorok külön lifecycle/owner-closure feladatot kaptak; H34.04 és H34.21 owner mapping javítva. A hiányzó canonical domain-owner döntéseket M0.2-ben kell lezárni. Ez szemantikai crosswalk-javítás, nem runtime implementáció vagy acceptance PASS. P0.2 **IN PROGRESS / NOT PASS**.

### 41.3.84. P0.2 — F.9-02 redirect/broken-link mapping separated from sitemap/robots lifecycle (2026-10-14)

Az F.9-02 redirects és broken-link tooling követelmény korábban `SEO-004`-et is tartalmazott, amelynek canonical registry-definíciója a sitemap és robots.txt lifecycle, publish és cache invalidation; ez nem a redirect/broken-link műveletek tulajdonosa. A mappingből eltávolítottam a `SEO-004`-et, és meghagytam a page-level SEO diagnostics `SEO-005`, a redirect/link lifecycle `WEB-013` és az authorization/approval boundary `SEC-002` hivatkozásokat.

A két művelet külön acceptance-t igényel: a redirect create/update/preview/approval/loop protection nem azonos a broken-link scan/report/fix flow-val. Ezeket a későbbi 2.0+ pontban külön actionként kell bontani, nem egy általános SEO gombba sűríteni. A jelenlegi sor ezt a különbséget rögzíti; a runtime megvalósítás nincs ezzel igazolva.

**Állapot:** F.9-02 mapping javítva, a részletes 2.0+ action DoD későbbi engineering point feladata. P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.33. P0.2 — C.24.3 dependency qualification mapping narrowed (2026-10-14)

**Audit target:** the eight C.24.3 qualification bullets in the C.24 source ledger. The initial mapping assigned every bullet the full `SEC-001–011` and `QA-001–010` ranges. Those ranges were structurally valid but semantically overbroad: they implied unrelated controls (for example, webhook replay defense or consent deletion) applied to every package qualification check, while obscuring the actual acceptance evidence.

**Corrections made in the C.24.3 ledger:**
- License suitability → `OPS-010, QA-009`; retain task-specific legal/distribution review where applicable.
- Runtime/build/browser compatibility → `OPS-008/010, QA-001/004/006`.
- Provenance and maintenance → `OPS-010, QA-009`.
- Known security risk → `OPS-010, SEC-008/010, QA-003/006`; a clean known-CVE result is not treated as proof of safety.
- Real requirement coverage → `OPS-010, QA-002/009`, plus the actual task's domain IDs.
- No parallel canonical model/history/registry/storage/write path → `OPS-010, QA-002/008`, plus affected canonical domain IDs.
- Access, ownership, public/draft isolation and secret handling → `SEC-002/003/008, QA-003`.
- Testability, upgrade/removal and recovery → `OPS-009/010, QA-001/006/007`.

**Boundary:** this narrows the source-ledger cross-references and makes the evidence expected for each qualification rule clearer. It does not certify any particular dependency, complete a package review, or mark C.24/P0.2 PASS. Every concrete dependency decision still needs its own named candidate, license/provenance/maintenance/CVE assessment, compatibility and bundle impact, canonical-boundary check, tests, and rollback evidence. The missing original `00/A` and `00.9–00.9.6.B` source texts remain `UNRECOVERED / OPEN`. P0.2 **IN PROGRESS / NOT PASS**.


### 41.3.87. P0.2 — C.24.4 dependency integration rules mapped to specific controls (2026-10-14)

**Audit target:** C.24.4-01–08 in the C.24 source ledger. The prior mapping assigned the entire SEC-001–011 range and a broad INT/QA pair to all eight rules. That obscured the difference between dependency selection, canonical ownership, trust-boundary validation, reproducible versioning, upgrade/rollback, license attribution, adapter contracts and production bundle review.

**Corrections made:**
- Prefer small dependencies/adapters → OPS-010/011, INT-001, QA-001/002/006; the preference is not blanket approval to add a package.
- Preserve canonical domain ownership → INT-001, QA-002/008, plus task-specific domain IDs when a real candidate is proposed.
- Validate external input/output and deny implicit privilege → SEC-002/003/005/006/008, QA-002/003.
- Keep lockfile/version declarations reproducible → OPS-010, QA-001/006.
- Test upgrades and deployment, with rollback → OPS-009/010, QA-001/006/007.
- Preserve license/attribution notices → OPS-010, MKT-004, QA-009, with actual package and transitive-license review.
- Keep the Sanci9517 canonical contract at the adapter boundary → INT-001, QA-002/008.
- Require measured and accepted bundle/performance/security impact → OPS-008/010, QA-001/004/006.

**Boundary:** these are traceability and acceptance-definition corrections, not a review or approval of any named package. No dependency candidate was evaluated in this batch; package-level license, provenance, maintenance/advisory, version, bundle delta, canonical-boundary and rollback evidence remains required when a concrete candidate is proposed. Original `00/A` and `00.9–00.9.6.B` source texts remain `UNRECOVERED / OPEN`. P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.88. P0.2 — C.24.5–C.24.7 policy mappings made evidence-specific (2026-10-14)

**Audit target:** the four C.24.5 in-house implementation criteria, five C.24.6 maintenance/replacement criteria, and the C.24.5-P01/P02 and C.24.7-P03 policy rows. The previous ledger used generic OPS/SEC/QA mappings that did not distinguish a documented decision from an executed review, or a test/recovery requirement from a generic policy statement.

**Corrections made:** alternative search and rejection reasons now point to OPS-010/QA-009 decision evidence; implementation standards to OPS-010 and relevant build/domain tests; maintenance and recovery to OPS-009/010 and QA-001/002/006/007; periodic dependency review to OPS-010 with recorded cadence/evidence; security/compatibility triage to OPS-010, SEC-010 and build/runtime checks; replacement decisions require concrete benefit/risk comparison; each feature must record whether it reuses, adopts, adapts, builds, forks or has no selected solution. The security/privacy exclusion policy now uses relevant access/isolation/secret/audit/retention controls and negative tests. The broad QA-001–010 policy mapping was narrowed to relevant gates, with task-specific IDs required.

**Boundary:** this batch updates the traceability and evidence contract only. It does not establish that a dependency review, security review, migration, or runtime test has happened. Concrete decisions still require named alternatives, package-specific evidence, relevant tests and rollback/recovery proof. Original `00/A` and `00.9–00.9.6.B` sources remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.89. P0.2 — C.24.1–C.24.2 decision records and open-source-first policy narrowed (2026-10-14)

**Audit target:** five C.24.1 solution-strategy rows, seven C.24.2 pre-decision review rows, and C.24.1-P01/P02 plus C.24.7-P02. The original ledger reused broad `OPS-010, QA-009` or `OPS-008, SEC-010, QA-009` mappings across materially different decisions.

**Corrections made:** existing canonical reuse now requires task-fit/regression evidence; open-source adoption requires a named candidate and package-specific checks; adapter strategy is anchored to INT-001 and the canonical ownership boundary; in-house implementation requires an explicit alternatives/cost/risk rationale; fork requires upstream/security maintenance and an exit/recovery plan. The pre-decision checklist now separates acceptance definition, existing-module overlap, candidate comparison, license/maintenance/advisory evidence, actual runtime/bundle/privacy/supply-chain checks, decision label and rollback tests. The policy rows now require proportionate evidence and an explicit decision label without implying that a dependency search or label completes the feature.

**Boundary:** no package was selected or certified in this batch. The rows remain OPEN until a concrete decision is recorded with candidate-specific evidence and relevant tests. Original `00/A` and `00.9–00.9.6.B` sources remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.90. P0.2 — C.24 policy meta-rules separated by decision risk and exclusion criteria (2026-10-14)

**Audit target:** C.24.2-P01, C.24.3-P01 and C.24.7-P01. The policy rows distinguish (a) proportional depth of a decision record, (b) explicit exclusion criteria for an unsuitable dependency, and (c) the invariant that open-source-first research never overrides the single active work point or substitutes for runtime evidence.

**Corrections made:** C.24.2-P01 now states how decision-record depth scales with risk/architectural impact; C.24.3-P01 points to package qualification, target-runtime/build and advisory evidence rather than generic review labels; C.24.7-P01 remains MAPPED only as a process invariant, explicitly not as feature acceptance or implementation completion.

**Boundary:** this is policy-traceability refinement only. No concrete dependency has been qualified, and the semantic audit of C.24 plus historical source recovery remain open. Original `00/A` and `00.9–00.9.6.B` sources remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.91. P0.2 — ARCH integration and Schedule source rows semantically narrowed (2026-10-14)

**Audit target:** ARCH-3365–3369 (provider integrations/data normalization) and ARCH-3373–3377 (canonical Schedule, lifecycle, timezone/recurrence, next-stream and content linkage). The earlier rows used wide family ranges and the generic `PROPOSED — semantic crosswalk to validate` text, which did not show the actual domain boundaries or the specific failure/acceptance conditions.

**Corrections made:** Twitch now distinguishes OAuth/site binding, permitted scopes, normalized live state, VOD/clips, webhooks and sync recovery; YouTube/TikTok are capability-gated and keep Content/Analytics canonical; Discord baseline is a community link, while bot/role and other provider adapters require separate contracts; provider data must represent stale/missing/error states rather than invent metrics. Schedule requirements now distinguish canonical event fields, list/calendar views, DST and recurrence edit scopes, next-stream logic, and stable Schedule↔Content links. Editor Schedule block configuration is explicitly presentation-only and cannot mutate Schedule domain records.

**Boundary:** the mappings are now more specific but remain OPEN; owner/phase and runtime acceptance evidence must still be completed from the source and canonical contracts. This does not certify provider availability or mark these features implemented. Original `00/A` and `00.9–00.9.6.B` source texts remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.92. P0.2 — ARCH Admin shell, security, forms, commerce and performance mappings refined (2026-10-14)

**Audit target:** ARCH-3381–3385 and ARCH-3404–3407. These rows previously carried broad module/SEC/WEB/EDT ranges with only a generic proposed-mapping status. The revised mappings distinguish shell/session behavior, shared module UX, public-form validation, commerce lifecycle, security boundaries, performance measurement and visual regression.

**Corrections made:** the Admin shell is separated from per-module UX; expired sessions are server-enforced; public forms require server validation, abuse controls and accessible feedback; commerce distinguishes catalog, order, payment and fulfillment while the storefront reads canonical data only. Security requirements are decomposed into testable control families and route boundaries. Performance budgets must follow a measured baseline, and visual regression requires named public/editor fixtures across desktop/tablet/mobile.

**Boundary:** the crosswalk is semantically more specific but remains OPEN. This is not a security audit, payment-provider approval, performance measurement or browser-regression PASS. Original `00/A` and `00.9–00.9.6.B` sources remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.93. P0.2 — H25 SEO acceptance gates separated from accessibility QA (2026-10-14)

**Audit target:** H25.01–H25.12 SEO/discoverability requirements. The previous rows used `QA-005` as their only test anchor, but the accessibility QA anchor is not sufficient evidence for SEO metadata, structured data, crawl files, redirects or broken-link behavior.

**Corrections made:** title/description/canonical and social metadata now require browser/public-render and production-smoke checks; structured data also requires output/data validation; sitemap/robots and redirects/broken-link checks require output/API or routing validation plus production smoke; per-page SEO and preview require browser rendering plus production smoke. The SEO canonical owner IDs remain unchanged.

**Boundary:** this is a test-crosswalk correction, not proof of current SEO runtime behavior or search-engine indexing. Every row remains subject to its phase-specific implementation, generated-output checks and acceptance evidence. Original `00/A` and `00.9–00.9.6.B` source texts remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.94. P0.2 — H26 creator analytics separated from operational telemetry (2026-10-14)

**Audit target:** H26.01–H26.12 analytics/insights requirements. The historical rows reused broad analytics wording and generic acceptance references, which obscured privacy boundaries, event semantics, data freshness and the distinction between Editor/production performance and creator outcomes.

**Corrections made:** page views, button/social clicks, stream events and conversions now have distinct collection and validation constraints; privacy and retention call for explicit policy and deletion evidence; dashboard acceptance includes role/site scoping and metric definitions; H26.09 explicitly splits operational performance (OPS-008) from creator/content analytics (ANL-004); provider metrics must disclose missing/stale/error states; anomaly detection remains a later-phase decision with defined false-positive and explainability controls.

**Boundary:** no analytics collection, legal compliance, dashboard accuracy or anomaly-detection runtime has been verified by this mapping. Original `00/A` and `00.9–00.9.6.B` source texts remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.95. P0.2 — H27 Admin shell and page-list boundaries clarified (2026-10-14)

**Audit target:** H27.01–H27.05 dashboard, navigation, responsive Admin, diagnostics and page list. Generic `UI-01–UI-23` ownership and broad acceptance text blurred shell responsibilities with the canonical owners of individual domains.

**Corrections made:** dashboard aggregates now link to canonical source owners without creating duplicate data; navigation is distinct from feature-level navigation and server-side permissions; responsive acceptance is split between shell and modules; diagnostics must disclose freshness and avoid false-green/redaction failures; the page list is distinct from Editor Canvas and public rendering and must follow Page Model/revision/publish ownership.

**Boundary:** these mappings define ownership and acceptance expectations only; they do not prove every screen/route is implemented or responsive. Original `00/A` and `00.9–00.9.6.B` source texts remain `UNRECOVERED / OPEN`; P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.96. P0.2 — H27 domain-specific Admin workflows mapped to canonical owners (2026-10-14)

**Audit target:** H27.06–H27.12 content management, Schedule, socials, VOD, media, settings and SEO. The generic Admin-shell wording did not adequately separate domain records, Editor presentation, public output and provider-specific authorization.

**Corrections made:** Content Center is split from Editor composition; Schedule remains canonical with calendar and Editor blocks as views; public social links are distinct from authenticated integrations; VOD stays phase-gated; Media/Asset Manager distinguishes structured metadata from R2 binaries; general settings are separated from integration and security settings; SEO controls map to H25 and generated public output.

**Boundary:** ownership mapping does not imply implementation or provider availability. Every workflow still needs its canonical contracts and phase-specific tests; original `00/A` and `00.9–00.9.6.B` sources remain `UNRECOVERED / OPEN`, and P0.2 remains **IN PROGRESS / NOT PASS**.


### 41.3.97. P0.2 — H27 remaining Admin workflows and ownership boundaries (2026-10-14)

The H27.13–H27.19 crosswalk entries now distinguish reporting from operational telemetry; authenticated integrations from public social links; the canonical Editor v2 from legacy editing surfaces; preview from publish/public-render proof; recovery from undo/redo and revision history; revision history from audit logs; and UI permission affordances from server-enforced authorization. Canonical owners and existing roadmap phases remain authoritative; these edits do not claim runtime implementation or acceptance.

**Evidence limitation:** historical source documents `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN in this audit context. This is a refinement of the current MASTER crosswalk, not proof that every historical requirement has been recovered or semantically reconciled. **P0.2 remains IN PROGRESS / NOT PASS.** No implementation gate is opened by this documentation change.


### 41.3.98. P0.2 — H28.01–H28.17 security controls separated into testable contracts (2026-10-14)

The H28 security crosswalk now distinguishes session-cookie attributes, conditional password hashing, CSRF, rate limits, RBAC, per-resource API authorization, public/Admin data separation, secret storage, audit events, input/output handling, upload validation, replay protection, centralized action checks and the conditional AI boundary. The rows require route/context-specific negative tests and avoid treating a helper, UI guard, middleware declaration or historical mention as proof of runtime coverage. Password authentication and AI execution are explicitly not assumed to exist merely because their security requirements are retained.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN in this audit context. These changes refine current MASTER semantics only; they do not prove full historical recovery or implementation. **P0.2 remains IN PROGRESS / NOT PASS.** No implementation gate is opened by this documentation change.


### 41.3.99. P0.2 — H29 backup, import/export and recovery acceptance boundaries (2026-10-14)

The H29.01–H29.10 rows now distinguish full disaster-recovery backup from page/revision snapshots and portable JSON export; define D1/R2 inclusion and media-reference behavior; and require isolated restore validation, migration compatibility, integrity checks and a real recovery drill. No RPO/RTO value or completed runtime capability is inferred without evidence.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN in this audit context. The current MASTER crosswalk is being semantically refined, but complete historical recovery and bidirectional reconciliation are not yet proven. **P0.2 remains IN PROGRESS / NOT PASS.** Implementation remains frozen by the active gate.


### 41.3.100. P0.2 — H30 performance and production-quality requirements made measurable (2026-10-14)

The H30.01–H30.14 crosswalk now separates bundle review, lazy loading, image delivery, cache policy/invalidation, Core Web Vitals, public rendering, large-page and Editor-tree performance, history memory, autosave efficiency, API latency, production smoke and visual regression. Unknown numerical budgets and unresolved cross-cutting ownership are explicitly left OPEN for M0.2 rather than fabricated. Smoke/visual/performance evidence must be current and tied to the deployed version or a reproducible fixture.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN. These edits refine the current MASTER only and do not establish complete archive reconciliation or runtime acceptance. **P0.2 remains IN PROGRESS / NOT PASS; implementation remains frozen.**


### 41.3.101. P0.2 — H31 AI Editor action pipeline and guardrails (2026-10-14)

The H31.00–H31.13 crosswalk now separates AI page/element/style/responsive/content/SEO/accessibility/visual-QA actions, authorization, approval, rollback, audit/version and rate/cost control. The common contract requires canonical actions, explicit permission and validation, approval bound to the reviewed diff, verification after execution and audit evidence. It explicitly avoids implying that post-1.0 AI runtime, provider billing, or full automated accessibility/visual certification already exists.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN. The entries are current-MASTER refinements, not proof of complete historical reconciliation or implementation. **P0.2 remains IN PROGRESS / NOT PASS; implementation remains frozen.**


### 41.3.102. P0.2 — H32 Creator Intelligence and content-factory scope boundaries (2026-10-14)

The H32.01–H32.20 crosswalk now separates live diagnostics, audio/chat analysis, scene suggestions, contextual ideas, moment/clip/Short candidates, post-stream and VOD analysis, platform variants, thumbnail briefs, publishing recommendations, content analytics, user profile and long-term memory. Each capability requires source provenance, supported-provider scope, freshness/coverage, user control and a clear separation between recommendation and execution. Profile and long-term memory remain distinct domains with unresolved ownership explicitly retained for M0.2.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN. These are semantic refinements of the current MASTER crosswalk, not proof of complete historical reconciliation or runtime capability. **P0.2 remains IN PROGRESS / NOT PASS; implementation remains frozen.**


### 41.3.103. P0.2 — H33 automation lifecycle, delivery and safety contracts (2026-10-14)

The H33.00–H33.12 crosswalk now defines automation-specific behavior for schedules, event trust, content/media/stream/notification workflows, retries, idempotency, failure states, execution-time authorization, audit and infrastructure choice. It separates the existing creator schedule from scheduled automation, keeps orchestration out of canonical domain persistence, and requires explicit evidence before adding queues or Durable Objects.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN. This refines current MASTER mappings and does not establish complete archive reconciliation or runtime implementation. **P0.2 remains IN PROGRESS / NOT PASS; implementation remains frozen.**


### 41.3.104. P0.2 — H34 recurring discovery and architecture benchmark acceptance (2026-10-14)

The H34.00–H34.11 entries now define repeatable discovery evidence for builder architecture, accessibility, performance, reusable components, design systems, collaboration, recovery, AI/automation safety and Creator Intelligence. The review must map findings to canonical owners and current tests, preserve adopt/adapt/reject/defer decisions, and avoid opening duplicate systems or inferring implementation from a roadmap mention.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN. This does not close historical reconciliation or certify runtime features. **P0.2 remains IN PROGRESS / NOT PASS; implementation remains frozen.**


### 41.3.105. P0.2 — H34 discovery procedure steps made actionable and auditable (2026-10-14)

The H34.12–H34.22 process rows now define the evidence required for candidate identification, user outcome, dependency mapping, Page Model decision, canonical actions, UI surface design, persistence, test design, MASTER registration, gated implementation and user validation. These rows are governance steps rather than extra product features; they preserve one canonical MASTER and explicitly respect the active implementation freeze.

**Evidence limitation:** original sources `00/A` and `00.9–00.9.6.B` remain UNRECOVERED / OPEN. Completing these current-MASTER refinements does not prove that every archived H34 requirement or any other historical source has been fully reconciled. **P0.2 remains IN PROGRESS / NOT PASS.**


### 41.3.106. P0.2 — Elavult státuszszöveg összehangolása a 362-ID ellenőrzés után (2026-10-14)

A §37.3 P0.2 összefoglaló még nyitott feladatként írta le a 362 registry-ID strukturális újraellenőrzését, miközben a későbbi §37.32 és §41.3.75 már dokumentálta a 362/362 eredményt. Az összefoglaló most a későbbi, konkrét ellenőrzési bizonyítékhoz igazodik; a régi 361/361 állapotot történeti eredményként kezeli. A §37.32 korábbi „359 ID” caveatje szintén a jelenlegi 362 ID kétirányú eredetbesorolására lett pontosítva.

**Bizonyított határ:** ez a javítás a belső státuszellentmondást és az elavult számszerű hivatkozást rendezi. A 362/362 eredmény csak registry→crosswalk strukturális feloldást igazol; nem bizonyít szemantikai megfelelést, teljes kétirányú provenance-t, hiányzó archív források visszakeresését vagy runtime acceptance-t. Az eredeti `00/A` és `00.9–00.9.6.B` továbbra is UNRECOVERED / OPEN. **P0.2 IN PROGRESS / NOT PASS marad.**


### 41.3.107. P0.2 — 359-ID-s történeti snapshotok és a jelenlegi 362-ID-s állapot megkülönböztetése (2026-10-14)

A §37.16, §37.17 és §41.2 egyes mondatai a 2026-10-13-i, 359-ID-s registry-snapshotot aktuális állapotként fogalmazták meg. A régi számokat történeti bizonyítékként megtartottam, de egyértelműen snapshotként jelöltem; a jelenlegi provenance-követelmény már mind a 362 registry-ID-re vonatkozik. A jelenlegi strukturális crosswalk-ellenőrzés helyes hivatkozása §37.32 és §41.3.75.

**Bizonyított határ:** a 362/362 a registry→crosswalk strukturális feloldás eredménye, nem a történeti eredet kétirányú bizonyítéka. A 271 H19–H34 kulcs szemantikai reconciliációja, a teljes E.1/C.23/C.24 forrásleképezés, az ID-szintű contractok és az eredeti `00/A`, `00.9–00.9.6.B` források továbbra is nyitottak. **P0.2 IN PROGRESS / NOT PASS marad.**

### 41.3.108. P0.2 — A H19–H34 ledger forrás-hivatkozásának ellenőrizhetőségi eltérése (2026-10-14)

**Ellenőrzött eltérés:** az archivált MASTER §M0.1 ledgerének forrásmondata a korábbi MASTER `aedb2ea` revízióját nevezi meg a 19–34 történeti szakaszok kinyerési forrásaként. A `docs/MASTER-DEVELOPMENT-PLAN.md` fájlt közvetlenül az `aedb2ea` commiton is visszaolvastam: a GitHub által visszaadott blob SHA `e5fc71d24a561eb4ed0f7da1e70d051543853431`, a tartalom 30 944 karakter; ebben a fájlpéldányban nem található `00/A`, `00.9.6.B`, illetve a H19–H34 ledger forrásfejezetként megjelölt szövege. Ez a fájl ezért önmagában nem támasztja alá a ledger jelenlegi forrásmegjelölését.

**Következtetés:** a ledger 271 sora a jelenlegi MASTER-ben létezik, egyedi azonosítókkal, de a forrásproveniencia nem tekinthető bizonyítottnak pusztán az `aedb2ea` hivatkozással. Lehetséges, hogy az eredeti forrás más fájlban, más branch-en, más commitban vagy a lokális auditkivonatban volt; ezt további bizonyíték nélkül nem választom ki találomra.

**Szükséges feloldás:** a 19–34 eredeti forrásfájl vagy a teljes, ellenőrizhető blob/commit azonosítása; az auditkivonat pontos útvonalának és hashének visszakeresése; ezt követően tételes source→ledger és ledger→source összevetés, hiányzó/összevont/duplikált/superseded tételek explicit döntésével. Addig a 271 sor szerkezeti megléte nem jelent teljes történeti reconciliációt.

**Bizonyítékhatár:** ez a kör egy forráshivatkozási eltérést azonosít; nem töröl és nem módosít történeti követelményt, nem állítja, hogy a forrás sehol nem létezik, és nem bizonyít runtime készültséget. Az eredeti `00/A` és `00.9–00.9.6.B` források továbbra is **UNRECOVERED / OPEN**; P0.2 **IN PROGRESS / NOT PASS** marad, a fejlesztési fagyasztás érvényben marad.

### 41.3.109. P0.2 — A 00/A és a 19–34 forrás egy régebbi MASTER-snapshotban visszanyerve; tételszám-eltérés nyitva (2026-10-14)

**Visszanyert forrásjelölt:** a repository docs/MASTER-DEVELOPMENT-PLAN.md fájljának 8a4f296b8c87643a3199e5787541e8eefb17f930 commiton rögzített változata (blob SHA: 6e02a804325eadd9296f02a5d830440b63744c8c, 434 800 karakter) tartalmazza a # 00/A — MASTER VÉGREHAJTÁSI INDEX fejezetet, valamint a teljes, számozott # 19–# 34 fejezetcsoportot. Ez konkrét történeti forrásbizonyíték a korábban nem visszakeresett 00/A és a 19–34 szakaszok legalább egy változatához. Ez a snapshot nem az aktuális végrehajtási terv, ezért régi aktív pontjai nem írhatják felül a jelenlegi MASTER aktív indexét.

**Tételes strukturális összevetés:** a visszanyert snapshot 19–33 fejezeteiben 244 checkbox-tétel szerepel; a 19. fejezetben az alt text és crop egy fizikai sorba tapadt, de két külön checkboxként olvasható, ezért a normalizált checklist-összeg 255-re adódik, ha a 34. fejezet 11 számozott folyamatlépését is beleszámítjuk. A jelenlegi H19–H34 ledger 271 egyedi ID-t tartalmaz. A különbség **16 sor**, amelyet nem szabad automatikusan hiányzó történeti követelménynek vagy duplikációnak minősíteni.

**Lokalizált eltérés a szakaszok között:**
- H21: a forrássnapshotban 21 checkbox-tétel, a ledgerben 22 sor;
- H31: 13 forrás-checkbox, 14 ledger-sor;
- H33: 11 forrás-checkbox, 13 ledger-sor;
- H34: 11 számozott folyamatlépés, 23 ledger-sor (a ledgerben H34.00 és további részletes sorok is vannak).
- H19-ben a forrásformázás két checkboxot egy sorba fűzött; ezt külön formázási anomáliaként kell megőrizni a normalizálásban.

**Döntés:** a visszanyert snapshot igazolja, hogy a korábbi aedb2ea hivatkozás önmagában nem volt elegendő, ugyanakkor a forrás-visszakeresés most részlegesen előrelépett. A 271 sor teljes történeti provenienciája még nem igazolt. A következő körben a forrás és ledger minden H-ID-ját két irányban kell összevetni, és minden többletsort source item, split/expanded mapping, supplemental governance vagy unresolved kategóriába kell sorolni; ehhez további időbélyegzett snapshotokat is keresni kell, különösen H34 és 00.9.6.B esetében.

**Bizonyítékhatár:** 00/A és a 19–34 fejezetek egy történeti változata most visszanyert, de nem állítom, hogy ez az egyetlen vagy a legteljesebb változat. Az eredeti 00.9.6.B teljes szövege továbbra is **UNRECOVERED / OPEN**. A történeti active-index nem aktiválható. P0.2 **IN PROGRESS / NOT PASS** marad, és a fejlesztési fagyasztás nem változik.

### 41.3.110. P0.2 — A 16 soros eltérés szerkezeti felbontása; a számlálási különbség magyarázható, a szemantikai PASS még nem (2026-10-14)

**Közvetlen forrás–ledger újraszámlálás:** a 8a4f296b8c87643a3199e5787541e8eefb17f930 snapshot 19–33. fejezeteiben 244 külön checkbox-követelmény található. A 19. fejezetben az `alt text` és `crop` ugyanazon fizikai sorba tapadt, de két külön checkbox, ezért két külön követelményként kell számolni. A 34. fejezet további 11 felfedezési témát és 11 eljárási lépést sorol fel, valamint kimondja a folyamatos felfedezés átfogó szabályát.

**A 271 ledger-ID számlálási felbontása:**
- 244 tétel: a 19–33. fejezetek checkbox-követelményei;
- 4 kiegészítő sor a 19–33 tartományban: H21.22 (titokkezelési/API-adapter architekturális korlát), H31.00 (AI Editor közös action pipeline), H33.00 (automatizálási életciklus-korlát), H33.12 (Queues/Durable Objects csak indokolt háttérfeladat/realtime esetén);
- 23 H34 sor: 11 felfedezési témakör + 11 eljárási lépés + 1 átfogó, ismétlődő felfedezési szabály.
- Összesen: 244 + 4 + 23 = 271 egyedi ID; duplikált H-ID nem található.

**Mit old fel ez:** a korábban jelzett 16-os darabszámkülönbség szerkezetileg megmagyarázható: a 19–33. fejezetek 244 checklist-sorához képest négy kiegészítő korlát/szabály került explicit ID-val a ledgerbe, a 34. fejezet pedig nem csupán 11 számozott eljárási lépésből áll, hanem 11 felfedezési témát és egy átfogó szabályt is tartalmaz. Ezeket nem szabad automatikusan duplikátumnak vagy hiányzó forrástételnek nevezni.

**Ami továbbra sincs lezárva:** a számlálási egyezés önmagában nem bizonyítja, hogy minden egyes H-ID szemantikailag pontos, teljes, nem összevont, megfelelő canonical ownerhez rendelt vagy a teljes történeti változatok között konzisztens. A következő audit továbbra is minden forrásmondat ↔ ledger sor kétirányú megfeleltetését, a kiegészítő sorok explicit `supplemental governance/architecture` jelölésének ellenőrzését, és az alternatív történeti snapshotok összevetését igényli. A `00.9.6.B` teljes eredeti szövegét ebben a körben sem sikerült visszanyerni; a vizsgált snapshotban a `00.9.6` általános térkép és a `00.9.6.A` fejezet szerepel, de külön `00.9.6.B` heading nem.

**Státusz:** a 271-es darabszám strukturális magyarázata **RECONCILED — STRUCTURAL ONLY**. A teljes szemantikai reconciliáció és P0.2 továbbra is **IN PROGRESS / NOT PASS**; a fejlesztési fagyasztás változatlan.

### 41.3.111. P0.2 — H19–H33 címke- és kontextus-összevetés: a normalizálási kivételek rögzítve (2026-10-14)

**Ellenőrzött összevetés:** a történeti `8a4f296b8c87643a3199e5787541e8eefb17f930` snapshot 19–33. fejezeteit a jelenlegi H19–H33 ledgerrel szakaszonként összevetettem. Az összevetés nem egyszerű teljes sorcím-egyezés: a forrásban a csoportcímek (például Twitch/YouTube/TikTok/Discord) adják a kontextust, a ledgerben ez a platformnév a sorcímkébe is bekerül.

**Kifejezetten ellenőrzött kivételek:**
- **H19:** a forrásban az `alt text` és `crop` két checkboxa ugyanabba a fizikai sorba fűződött. A ledger ezeket helyesen két külön ID-ként tartja meg: H19.07 és H19.08. A normalizálás két külön követelményt számol, nem egyet.
- **H20:** a 18 forráskövetelmény 18 ledger-sornak felel meg.
- **H21:** a forrás 21 integrációs követelményt tartalmaz: Twitch 9, YouTube 5, TikTok 4, Discord 3. Ezek a ledger H21.01–H21.21 soraival platformkontextussal egyeznek. H21.22 külön architekturális kiegészítés (Cloudflare Secrets + külső API-k szolgáltatásrétegen keresztüli normalizálása), nem 22. forrás-checkbox; külön `supplemental architecture` jelölést igényel.
- **H22:** a forrás egy `search/filter` követelményt tartalmaz, a ledger H22.11 ezt `VOD search/filter` címkével őrzi meg. Ez a VOD fejezet kontextusával konzisztens, nem két külön követelmény.
- **H23–H30:** a forráscímkék és a ledger-címkék szakaszonként megfelelnek; H23 20, H24 13, H25 12, H26 12, H27 19, H28 17, H29 10, H30 14 sor.
- **H31:** a 13 forráskövetelményhez 13 funkciósor tartozik; H31.00 a közös AI Editor action pipeline külön architekturális kiegészítése.
- **H32:** a 25 forráskövetelmény 25 ledger-sornak felel meg.
- **H33:** a 11 forráskövetelmény 11 funkciósornak felel meg; H33.00 az automatizálás életciklus-szabálya, H33.12 pedig a Queues/Durable Objects feltételes használatának architekturális korlátja. Mindkettő kiegészítő szabály, nem külön forrás-checkbox.

**Eredmény:** a 19–33. fejezeteknél az azonosított számlálási eltérések a H19 formázási összevonására és a H21/H31/H33 négy külön kiegészítő szabályára vezethetők vissza. Ez támogatja a **strukturális reconciliációt**, de még nem igazolja a minden követelményhez tartozó teljes leírás, canonical owner, lifecycle, fázis, függőség, elfogadási feltétel és teszt szemantikai helyességét. H34 külön folyamat/témakör leképezése továbbra is önálló, tételes ellenőrzést igényel.

**Státusz:** H19–H33 címke- és darabszám-összevetés **STRUCTURAL REVIEW COMPLETE WITH EXPLICIT EXCEPTIONS**; teljes szemantikai reconciliáció **OPEN**. `00.9.6.B` teljes eredeti forrása továbbra is **UNRECOVERED / OPEN**. P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.

### 41.3.112. P0.2 — H34 kétirányú forrás–ledger megfeleltetés és a 00.9.6.B keresésének eredménye (2026-10-14)

**Forrás:** a történeti `8a4f296b8c87643a3199e5787541e8eefb17f930` MASTER-snapshot `# 34 — FOLYAMATOS FUNKCIÓFELFEDEZÉS` szakasza; ellenőrzött forrás-blokk: 3046. sortól, a következő `# 35` fejezetig. **Cél:** a H34 ledger szakaszának forrás→ledger és ledger→forrás lefedettségi vizsgálata, a funkciók és a folyamatlépések külön kezelésével.

**Forrásból ledgerbe:**
- A folyamatos felfedezés el nem zárható alapelve: H34.00.
- A 11 ismétlődő vizsgálati téma: H34.01–H34.11 (modern visual builder; GrapesJS/Craft.js/Puck; responsive/layout; accessibility; performance; reusable components; design systems; collaboration/conflict; backup/recovery; AI action safety; stream/content intelligence).
- A 11 új funkció felvételére vonatkozó eljárási lépés: H34.12–H34.22 (azonosítás; cél/use case; függőségek; Page Model/adatmodell; Command/Action; Inspector/Canvas/UI; persistence; teszt; MASTER-be felvétel; implementáció; felhasználói validáció).

**Ledgerből forrásba:** a H34.00–H34.22 sorok mindegyikének azonosítható forrásmegfelelője van a fenti alapelvben, a 11 témában vagy a 11 számozott folyamatlépésben. A 23 ledger-sor bontása így 1 alapelv + 11 témakör + 11 eljárási lépés; a szakaszban nincs további önálló termékfunkcióként szereplő checkbox. A ledger H34.01–H34.11 címkéiben a magyar írásjelek (pontosvessző, záró pont) megőrzése nem funkcionális eltérés.

**Értelmezési korlát:** ez a megfeleltetés a történeti forrás e snapshotjára bizonyítja a H34 strukturális lefedettségét, nem bizonyítja, hogy minden témához már létezik implementált funkció, megfelelő canonical owner, elfogadási feltétel vagy sikeres teszt. A H34 folyamat ismétlődő governance-kötelezettség; a H34-sorok nem kész termékfunkciók.

**00.9.6.B forráskeresés:** a GitHub fájlkeresésben a `00.9.6.B` és `00.9.6` keresőkifejezések, valamint a commitkeresésben ugyanezek és a történeti ledgerre vonatkozó keresőkifejezés nem adtak találatot. Ez kizárólag a jelenleg elérhető keresési index eredménye; **nem** bizonyítja, hogy a szakasz nem létezett, vagy nincs meg egy nem indexelt commitban, archivált fájlban vagy másik ágon. A teljes eredeti `00.9.6.B` szöveg ezért továbbra is **UNRECOVERED / OPEN**, és további commit-/snapshot-szintű vizsgálat szükséges.

**Státusz:** H34 strukturális, kétirányú lefedettségi ellenőrzése **PASS a megnevezett történeti snapshotra**; teljes történeti szemantikai reconciliáció **OPEN**; `00.9.6.B` forrás-visszakeresés **OPEN**. P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.

### 41.3.113. P0.2 — Második körös archív tervfájl- és verziónév-keresés a hiányzó 00.9.6.B forráshoz (2026-10-14)

**Vizsgált források:** a `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` teljes szövege, valamint a `docs/archive/plans/` alatt jelenleg elérhető mind a nyolc tervfájl: `MASTER-CURRENT-STATUS.md`, `MASTER-FINAL-ROADMAP.md`, `PLAN-AMENDMENT-EDITOR-UNIFICATION.md`, `SANCI-MASTER-PLAN.md`, `ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md`, `V2-BLUEPRINT.md`, `VISUAL-EDITOR-ARCHITECTURE.md` és `visual-editor-roadmap.md`. A GitHub repository fájlkeresését és commitkeresését is futtattam a `00.9.6.B`, `00.9.6.A`, `00.9.6.C` és `MASTER-2.70` kifejezésekre.

**Eredmény:** az archív MASTER-ben a teljes `00.9.6.C` (MASTER-2.71), `00.9.6.D` (MASTER-2.72), valamint `00.9.6.E/F` (MASTER-2.74) szakaszok szerepelnek, de külön `00.9.6.B` fejezetcím vagy `MASTER-2.70` jelölés nem található. A nyolc kapcsolódó tervfájlban sem találtam explicit `00.9.6.B`, `00.9.6.A` vagy `MASTER-2.70` hivatkozást. A GitHub keresője a fenti verzió-/fejezetkifejezésekre nem adott találatot.

**Következtetés és korlát:** a keresés leszűkíti az ellenőrzött, jelenleg elérhető archív tervanyagok körét, de nem zárja ki, hogy a hiányzó szöveg más nevű régi commitban, törölt fájlban, pull request mellékletében/kommentjében vagy külső mentésben szerepel. A C/D/E/F fejezetek nem tekinthetők a B fejezet helyettesítőjének, és a MASTER-2.70 tartalma nem rekonstruálható megbízhatóan pusztán a szomszédos verziószámokból.

**Következő vizsgálat:** a teljes commit-történetben a `docs/MASTER-DEVELOPMENT-PLAN.md` és a `docs/archive/**` útvonalak korábbi állapotait kell tovább vizsgálni, különös tekintettel a C/D/E/F első megjelenése előtti commitokra és azokra a commitokra, amelyek a `00.9.6` szakaszcsaládot átrendezték vagy lecserélték. A már rögzített 44 egyedi branch-head fa útvonal-ellenőrzését nem ismétlem meg; a következő körnek commit-/blob-szintű tartalmi vizsgálatnak kell lennie.

**Státusz:** a második archív fájlkör ellenőrizve; eredeti `00.9.6.B` tartalom továbbra is **UNRECOVERED / OPEN**. P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.


### 41.3.114. P0.2 — MASTER commit- és előd-snapshot vizsgálat a 00.9.6.C/D bevezetése körül (2026-10-14)

**Vizsgálati cél:** a fájl-/verziókeresés után azonosítani a roadmap-családot érintő konkrét commitokat, megnézni a C/D fejezetek bevezetésének közvetlen előzményeit, és ellenőrizni, hogy az elérhető előd-snapshotokban megtalálható-e a hiányzó B eredeti szövege.

**Ellenőrzött commit- és snapshot-lánc:**
- 36b6ce5fb207b889ad48ce1dd36e9cda475bea93 — „docs: establish unified ultimate Sanci9517 master plan”; a commit üzenete szerint a tervet önálló, egységes MASTER-re cserélte, és a korábbi MASTER-t archívumba mentette. Közvetlen szülője: 217f7d47107d6f1fe43b7b331fef71ce66d07443.
- A szülő commiton olvasott docs/MASTER-DEVELOPMENT-PLAN.md blob: adc958b61e9c09d246989626c92066489d1d72f4, 686 481 karakter. A vizsgált fejezetcsaládban C/D/E/F jelen van, de külön 00.9.6.B címsor vagy MASTER-2.70 verziójelölés nem azonosítható.
- 4321d333214eaf8dbb8978620fd0b10222478ecc — „docs: restore full historical roadmap and endgame stages”; a megtekinthető diff a 00.9.6.D — MASTER-2.72 blokkot adja hozzá a meglévő 00.9.6.C után, a 19–34 történeti backlog megőrzésére és a későbbi 0.x–10.0 fejlődési ívre hivatkozva. Ez a diff a D bevezetését igazolja, nem a B szövegét.
- A közvetlenül vizsgált régebbi 0ebf7a9d2fb8f13040513c412d2ff98698c94b54 MASTER-snapshot blobja 211ca4475c901b102b068ea39d8a1746a299b04e, 55 646 karakter; a dokumentum fejezetcímei között csak 00.9.6.C található. A 00.9.6.B szövegrészre utaló szórványos említés nem B-fejezet, és nem használható a hiányzó fejezet rekonstruálására.
- A 36b6ce5 előtti szülő-snapshot, a 4321d333-hoz kapcsolódó előd, valamint a korábban azonosított 8a4f296b8c87643a3199e5787541e8eefb17f930 történeti snapshot ellenőrzése sem szolgáltatta a teljes B-fejezetet. Az utóbbi snapshotban a 00.9.6 és 00.9.6.A megvan, külön B-címsor nincs.

**Következtetés:** a vizsgált, közvetlenül elérhető commit-elődök és snapshotok a C/D roadmap kialakulásának egy részét megvilágítják, de nem fedik fel a 00.9.6.B eredeti tartalmát. Ez nem bizonyítja, hogy a B soha nem létezett; a vizsgálat nem terjed ki minden törölt blobra, PR-mellékletre, kommentre vagy külső mentésre. Nem készítek helyettesítő B-fejezetet találgatásból, és a C/D tartalmat nem minősítem B-vel egyenértékűnek.

**Következő célzott lépés:** a docs/MASTER-DEVELOPMENT-PLAN.md és az archív MASTER útvonalak további korábbi commitjainak, illetve a releváns commitok teljes patch-/blobtörténetének vizsgálata; különösen olyan régi fájlútvonalak és törlések keresése, amelyek a jelenlegi útvonalon nem jelennek meg. Ha ez a kör sem adja elő a B szöveget, a hiányt explicit unresolved source gapként kell fenntartani, és a P0.2 záráshoz alternatív, dokumentált forrásdöntés szükséges — nem automatikus rekonstrukció.

**Státusz:** commit-/előd-snapshot vizsgálat dokumentálva; 00.9.6.B teljes forrása továbbra is UNRECOVERED / OPEN; teljes történeti szemantikai reconciliáció OPEN; P0.2 IN PROGRESS / NOT PASS; fejlesztési fagyasztás változatlan.


### 41.3.115. P0.2 — A 00.9.6.C első megjelenése előtti commit közvetlen ellenőrzése (2026-10-14)

**Újonnan vizsgált bizonyíték:** a `0ebf7a9d2fb8f13040513c412d2ff98698c94b54` commit teljes elérhető diffje, közvetlen szülője (`cfb2de5f1590c767eae86296bc58f0e8d02592d1`) és a szülő MASTER-blob (`ea1c9b14c0b3a98a5a284703f6df3a1ef02b3e46`). A szülő blob 36 379 karakteres; a következő commit 893 soros `00.9.6.C — MASTER-2.71` fejezetet fűzött a dokumentum végére.

**Közvetlen előd állapota:** a szülő MASTER-ben az eredeti `00.9.6` és `00.9.6.A` címsorok megtalálhatók, de `00.9.6.B` vagy `00.9.6.C` fejezetcím még nincs. A szülő egyetlen `00.9.6.B` előfordulása egy régi ellenőrzőlista-állításban szerepel: azt állítja, hogy a 00/A és 00.9–00.9.6.B „újrapontozása megtörtént”. Ez az állítás önmagában nem tartalmazza a B-fejezetet, nem ad forráshivatkozást, és ellentmond a szülőben ténylegesen jelen lévő fejezetcímeknek. Emiatt ezt **státusz-/proveniencia-ellentmondásként** kell kezelni, nem a B létezésének vagy tartalmának bizonyítékaként.

**A C bevezetésének diffje:** a `0ebf7a9` diff a `00.9.6.C — ULTIMATE CREATOR PLATFORM — MASTER-2.71` új fejezetet adja hozzá, a teljes Creator Platform capability-scope-pal. A diffben nem jelenik meg a B-fejezet szövege, nem látszik B→C átnevezési vagy összevonási művelet, és nincs olyan kifejezett döntés sem, amely a B tartalmát a C által teljesen kiváltottnak nyilvánítaná. A C szövege ezért csak a C saját scope-jának bizonyítéka.

**Következtetés:** az eddig vizsgált közvetlen történeti lánc pontosítja a hiány jellegét: a B-fejezet hiánya már a C bevezetése előtti elérhető MASTER-snapshotban fennállt; ugyanakkor a régi checklistben maradt egy ellenőrizetlen állítás, amely a B korábbi „újrapontozását” említi. Nem bizonyított, hogy a B eredeti szövege soha nem létezett, de a jelenlegi forrásanyag alapján sem a tartalma, sem a C-vel való formális helyettesítése nem igazolható.

**Kötelező kezelés:** a régi checklist állítása nem tekinthető lezárási bizonyítéknak. A további auditnak vagy meg kell találnia a B pontos forrását egy másik korábbi fájlban/commitban, vagy külön, kifejezett forrásdöntéssel kell meghatároznia a hiányzó történeti anyag kezelését; a második lehetőség sem engedélyezheti a történeti funkciók csendes elhagyását. Addig a B forrásrés **UNRECOVERED / OPEN**, P0.2 **IN PROGRESS / NOT PASS**, a fejlesztési fagyasztás változatlan.


### 41.3.116. P0.2 — Korábbi MASTER-verziók és a dokumentumútvonal commit-történetének kiterjesztett ellenőrzése (2026-10-14)

**Új vizsgálati kör:** a GitHub commit-history API alapján a `docs/MASTER-DEVELOPMENT-PLAN.md` útvonal régebbi pontjai is ellenőrzésre kerültek, beleértve a 2026-09-25 és 2026-09-28 közötti korai MASTER-verziókat. A vizsgált konkrét snapshotok:

- `346ff9875ce9a26ff26bc4f3a016f33d0f2734a6` — blob `edf156d0b3ba0eacec0ed064b281c0e90ed96d9a`, 418 601 karakter;
- `d76ed3c6e5fb91d0a9253c3ae84e5ace53362fc0` — blob `5c7d89efc362d82a9ede5405493a4fc810ef4bbf`, 402 868 karakter;
- `db209b0418e46d34a9880cc8331356efa58d97b4` — blob `cf53eea22b971ed444d55b7f6ab6ba7eb9970edf`, 446 556 karakter.

**Eredmény:** mindhárom korábbi, nagy terjedelmű MASTER-változatban szerepel a `00.9.6` és `00.9.6.A` fejezetcím, de nem található `00.9.6.B` fejezetcím, `00.9.6.B` szöveges előfordulás vagy `MASTER-2.70` jelölés. A korábban vizsgált 2026-09-28-i `8a4f296...` snapshotban szintén csak a `00.9.6` és `00.9.6.A` címsor igazolható. A 2026-10-08-i `0ebf7a9...` snapshot már a `00.9.6.C / MASTER-2.71` anyagot tartalmazza; ez a C-szöveg nem szolgáltatja a hiányzó B-fejezetet.

**Mit bizonyít és mit nem:** a vizsgált MASTER-útvonal korai, elérhető változatai nem támasztják alá, hogy a B szövege ezekben a snapshotokban jelen lett volna. Ez nem bizonyítja, hogy más fájlban, törölt blobban, nem vizsgált commitban, PR-megbeszélésben vagy külső mentésben soha nem létezett. A path-history önmagában nem teljes Git-objektum-adatbázis- vagy minden PR-mellékletre kiterjedő bizonyítás.

**Következő auditlépés:** a hiányzó B forrására vonatkozó keresést csak új bizonyítéktípusra érdemes kiterjeszteni: a korai MASTER-ekhez kapcsolódó régi fájlútvonalak/törlések, pull request diffek és review-kommentek, illetve külső vagy helyi archívumok. Ugyanazokat a jelenlegi fájlokat és azonos kifejezéseket változatlanul ismételni nem tekinthető új bizonyítéknak. Ha új forrás nem kerül elő, külön, nyomon követhető döntés szükséges a hiányzó történeti forrás kezelésére; a tartalom nem rekonstruálható találgatással, és a 19–34 történeti képességekből semmi nem hagyható el pusztán emiatt.

**Státusz:** kiterjesztett korai MASTER-snapshot ellenőrzés dokumentálva; `00.9.6.B` forrása továbbra is **UNRECOVERED / OPEN**; teljes történeti szemantikai reconciliáció **OPEN**; P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.


### 41.3.117. P0.2 — PR #29 fájlmódosítási és megbeszélési bizonyítékai, valamint Library-keresés (2026-10-14)

**Vizsgálati cél:** a 00.9.6.B hiányának további vizsgálata a MASTER lecserélését végrehajtó PR fájlmódosításain, PR-megbeszélésein/review-in és a ChatGPT Libraryben elérhető, releváns történeti anyagokon keresztül.

**PR #29 — `docs: replace MASTER with unified ultimate product plan`:**
- PR: https://github.com/sanci9517/sanci9517/pull/29; merge commit: `36b6ce5fb207b889ad48ce1dd36e9cda475bea93`; előd: `217f7d47107d6f1fe43b7b331fef71ce66d07443`.
- A merge commit tényleges fájllistája két módosítást mutat: `docs/MASTER-DEVELOPMENT-PLAN.md` — módosítva, 1 477 hozzáadás / 5 054 törlés; `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` — hozzáadva, 5 160 sor. Az archív fájl blobja `adc958b61e9c09d246989626c92066489d1d72f4`, 686 481 karakter.
- Az archív MASTER és a PR előd-commitjában lévő MASTER ugyanazt a blob SHA-t adja; tehát a korábbi MASTER-t archiválták, nem pedig egy másik, ismeretlen változatot.
- A vizsgált archív fájlban nincs önálló `00.9.6.B` vagy `MASTER-2.70` fejezetcím. A fejezetcímek hiánya és a korábbi auditban rögzített ellenőrzőlista-említés nem adja meg a B-fejezet tartalmát.
- A PR issue-kommentjei között egyetlen Cloudflare deployment-bot megjegyzés található. A review-végpont üres listát adott vissza; a rendelkezésre álló PR-adatokban nincs emberi review, amely a B-fejezet törlését, átnevezését, összevonását vagy formális helyettesítését magyarázná. Ez csak a jelenleg visszaadott PR-adatokra vonatkozó megállapítás, nem bizonyíték arra, hogy más beszélgetés vagy külső forrás nem létezik.

**Történeti útvonal- és Library-vizsgálat:**
- A PR által megnevezett `docs/archive/MASTER-DEVELOPMENT-PLAN-2026-10-13.md` útvonal igazolható a merge commit fájllistájában. A GitHub útvonal-commit-lekérdezése az aktuális ágon nem adta vissza a történeti archív fájl teljes előzményét; ezért ezt nem értelmezem törlés vagy soha-nem-létezés bizonyítékaként. A konkrét merge commit fájllistája és blobja viszont ellenőrizhető.
- A Library szemantikus keresése releváns korábbi, beillesztett terminálkimeneteket adott vissza, köztük egy 2026-10-14-i commit-/útvonal-audit kivonatot, de nem talált önálló, teljes eredeti B-fejezetet tartalmazó tervfájlt. A találatok logok és kivonatok; nem tekinthetők a hiányzó B forrásszövegének.
- A PR #29 leírása szerint a két korábbi vNext terv és a kapcsolódó történeti audit-scriptek a ChatGPT Library `Archive/Sanci9517/Legacy-Planning` helyére kerültek. A mostani keresés nem igazolta ezek között a teljes B-szöveg jelenlétét; a találatok korlátozott volta miatt a teljes külső archívum tartalmáról nem teszek általános negatív állítást.

**Következtetés:** a MASTER-csere PR és a közvetlen előd-blob bizonyítja, hogyan archiválták a régi MASTER-t és melyik fájlt rövidítették/cserélték le, de nem bizonyít B→C átnevezést, B-törlést vagy B-tartalmi helyettesítést. A PR megbeszélési adatai nem szolgáltattak további magyarázó forrást. A B-fejezet tartalma továbbra is **UNRECOVERED / OPEN**; a teljes történeti szemantikai megfeleltetés **OPEN**; P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.

**Következő célzott lépés:** a PR #29 előtti, `217f7d4` elődöt megelőző dokumentum-commitok és a `docs/archive/plans/**` történeti állapotainak tartalmi összehasonlítása, majd a H19–H34 / 359 stabil ID-s registry kétirányú, tételes szemantikai leképezésének folytatása. A B-fejezetet nem szabad találgatásból rekonstruálni, és a C/D/E/F szöveg nem fogadható el automatikus helyettesítőként.


### 41.3.118. P0.2 — Régi tervfájlok és archivált útvonalak célzott vizsgálata (2026-10-14)

**Vizsgálati cél:** a PR #29 leírásában említett történeti tervanyagok és a repository jelenlegi `docs/archive/plans/` könyvtárának ellenőrzése a `00.9.6.B` forrás, illetve a korábbi roadmapekből fennmaradt képességbizonyítékok szempontjából.

**Ellenőrzött repository-útvonalak a `v2/foundation` ágon:**
- `docs/archive/plans/MASTER-CURRENT-STATUS.md` — 82 sor;
- `docs/archive/plans/MASTER-FINAL-ROADMAP.md` — 679 sor;
- `docs/archive/plans/PLAN-AMENDMENT-EDITOR-UNIFICATION.md` — 311 sor;
- `docs/archive/plans/SANCI-MASTER-PLAN.md` — 683 sor;
- `docs/archive/plans/ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md` — 277 sor;
- `docs/archive/plans/V2-BLUEPRINT.md` — 375 sor;
- `docs/archive/plans/VISUAL-EDITOR-ARCHITECTURE.md` — 160 sor;
- `docs/archive/plans/visual-editor-roadmap.md` — 53 sor.

**Szó szerinti forráskeresés eredménye:** a fenti nyolc fájl egyikében sem találtam szó szerinti `00.9.6.B`, `MASTER-2.70`, `00/A`, `H19` vagy `00.9.6.C` egyezést. Ez a pontos kifejezésekre és a jelenlegi ágon elérhető nyolc fájlra korlátozott eredmény; nem jelent teljes szemantikai auditot, és nem bizonyítja, hogy a B-hez tartozó funkciók nem szerepelnek más néven vagy más történeti forrásban.

**Útvonal-megállapítás:** a `docs/archive/plans/` könyvtár jelenleg több korábbi tervet őriz, de a könyvtár útvonalának commit-history API-lekérdezése nem adott vissza külön commitlistát. Ebből nem következtetek arra, hogy a fájloknak nincs korábbi történetük. A következő történeti lépés a fájlok konkrét hozzáadási/módosítási commitjainak, korábbi neveinek és esetleges törlési/átnevezési diffjeinek lekérése, majd az eredeti tervszövegek funkciószintű összevetése a jelenlegi MASTER capability registryjével.

**Megőrzési szabály:** az archivált fájlok nem válnak második aktív tervvé. Bizonyítékként használhatók történeti funkciók visszakeresésére és eredetük igazolására; a végrehajtási sorrend és az aktuális státusz továbbra is a `docs/MASTER-DEVELOPMENT-PLAN.md` irányadó blokkjából származik.

**Státusz:** a jelenlegi `docs/archive/plans/` nyolc fájljának szó szerinti B-/2.70-keresése dokumentálva; a B-fejezet eredeti forrása továbbra is **UNRECOVERED / OPEN**; teljes történeti szemantikai reconciliáció **OPEN**; P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.


### 41.3.119. P0.2 — Archivált tervútvonalak eredet-commitjának ellenőrzése (2026-10-14)

A korábbi, különálló útvonal-commit-lekérdezések első futása nem adott eredményt, mert a GitHub API hívás nem tartalmazta explicit módon a `v2/foundation` ágat. A helyes, ágra szűkített lekérdezés mind a négy vizsgált fő tervnél ugyanazt az első elérhető útvonal-commitot adta vissza: `aedb2eaab244` — `docs: unify project plans into single master plan`, 2026-09-17.

Az `aedb2eaab244` commit fa-struktúrájában a következő utak már jelen vannak:
- `docs/MASTER-DEVELOPMENT-PLAN.md`;
- `docs/archive/plans/MASTER-FINAL-ROADMAP.md`;
- `docs/archive/plans/SANCI-MASTER-PLAN.md`;
- `docs/archive/plans/V2-BLUEPRINT.md`;
- `docs/archive/plans/visual-editor-roadmap.md`;
- `docs/archive/2026-09-16/LEGACY-HTML-ARCHIVE.md`.

**Értelmezési korlát:** ez azt igazolja, hogy az archivált tervfájlok a 2026-09-17-i egységesítési commitban már jelen voltak. A megadott útvonalakhoz a vizsgált ágon a lekérdezés csak ezt az egy commitot adta vissza; ezért az API útvonal-előzménye önmagában nem rekonstruálja a fájlok esetleges korábbi, más néven vagy más útvonalon tárolt eredetét. A commit szülőjének teljes fájafáját és az elődcommit diffjét kell tovább ellenőrizni, különösen az esetleges régi útvonalak, törlések és átnevezések miatt. A B forrásának meglétéről vagy nemlétéről ebből még nem vonok le következtetést.

**Státusz:** a helyes ágparaméterrel végzett útvonal-előzmény ellenőrzés dokumentálva; további régi útvonalak keresése nyitott; `00.9.6.B` **UNRECOVERED / OPEN**; P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.


### 41.3.120. P0.2 — Az egységesítési commit tényleges rename-diffje és közvetlen előd-MASTER (2026-10-14)

**Új, konkrét fájltörténeti bizonyíték:** a `aedb2eaab244` (`docs: unify project plans into single master plan`) commitot a közvetlen szülőjével (`87b6f0bb71cd96646b6a501ab85c242386a1124e`) összehasonlítottam. A GitHub compare eredménye szerint a MASTER módosítása mellett nyolc tervfájl útvonala **rename** státusszal került az archívumba, tartalmi hozzáadás/törlés nélkül a rename-sorokban:
- `docs/MASTER-CURRENT-STATUS.md` → `docs/archive/plans/MASTER-CURRENT-STATUS.md`;
- `docs/MASTER-FINAL-ROADMAP.md` → `docs/archive/plans/MASTER-FINAL-ROADMAP.md`;
- `docs/PLAN-AMENDMENT-EDITOR-UNIFICATION.md` → `docs/archive/plans/PLAN-AMENDMENT-EDITOR-UNIFICATION.md`;
- `docs/SANCI-MASTER-PLAN.md` → `docs/archive/plans/SANCI-MASTER-PLAN.md`;
- `docs/ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md` → `docs/archive/plans/ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md`;
- `docs/V2-BLUEPRINT.md` → `docs/archive/plans/V2-BLUEPRINT.md`;
- `docs/VISUAL-EDITOR-ARCHITECTURE.md` → `docs/archive/plans/VISUAL-EDITOR-ARCHITECTURE.md`;
- `docs/visual-editor-roadmap.md` → `docs/archive/plans/visual-editor-roadmap.md`.

A közvetlen előd `docs/MASTER-DEVELOPMENT-PLAN.md` fájlja 1 792 soros, blob SHA-ja `235165980be8a522860ae442e79a705b26127429`. Ebben a snapshotban a szó szerinti `00.9.6.B`, `MASTER-2.70`, `00/A`, `H19` és `00.9.6.C` kifejezésekre végzett célzott keresés nem adott találatot. Ez a konkrét, 2026-09-17 előtti közvetlen előd snapshotjára vonatkozik; nem zárja ki más fájlban, más elnevezéssel vagy másik történeti forrásban lévő funkciótartalom létezését.

**Következtetés:** most már igazolható, hogy a korábbi roadmapek és editor-tervek nem törlésként tűntek el az egységesítési commitban, hanem Git által felismert átnevezéssel kerültek az `docs/archive/plans/` alá. A MASTER maga jelentősen módosult (1 114 hozzáadás, 1 568 törlés). A diff nem bizonyítja, hogy a hiányzó B-fejezet tartalma ezek valamelyikében volt; csak a megnevezett nyolc fájl útvonalváltozását bizonyítja. A következő célzott feladat a közvetlen előd és az archív tervfájlok tartalmi diffje, majd a H19–H34 funkciók tételes szemantikai megfeleltetése a jelenlegi stabil ID-registryvel.

**Státusz:** nyolc történeti tervfájl rename-diffje dokumentálva; `00.9.6.B` forrása továbbra is **UNRECOVERED / OPEN**; teljes történeti szemantikai reconciliáció **OPEN**; P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.


### 41.3.121. P0.2 — Nyolc átnevezett tervfájl blobazonosságának ellenőrzése (2026-10-14)

A nyolc rename-pár mindegyikét külön beolvastam a közvetlen előd-commitból (`87b6f0bb71cd96646b6a501ab85c242386a1124e`) és a jelenlegi `v2/foundation` archív útvonaláról. Mind a nyolc párnál a régi és az új útvonal SHA/blob-azonosítója egyezik, és a visszaadott teljes szöveg is bájtszinten egyező volt:
- `MASTER-CURRENT-STATUS.md`: `d3e9b171d601f93b09c4fe0c3038d208c8766163`;
- `MASTER-FINAL-ROADMAP.md`: `c7c68a8cc8342751875f90fe2e9ca1d5657e0534`;
- `PLAN-AMENDMENT-EDITOR-UNIFICATION.md`: `6407f90379a480ae037b7609efc335f3623691e0`;
- `SANCI-MASTER-PLAN.md`: `bb6378b1803c6e3564a81b28327f3aa109b55881`;
- `ULTIMATE-PLATFORM-DIRECTION-2026-09-16.md`: `2caecf3c1f4a5738a5a0a4bca69476875264df84`;
- `V2-BLUEPRINT.md`: `66e9064e518cc0276555ea3f986074526b80ae82`;
- `VISUAL-EDITOR-ARCHITECTURE.md`: `e4d21bac4b3d72d96c335b3697724b4f991229eb`;
- `visual-editor-roadmap.md`: `082b4afbb40d4b4e3363f91691e546cf91ced32d`.

A nyolc fájl teljes szövegén végzett célzott szó szerinti keresés nem talált `00.9.6.B`, `MASTER-2.70`, `00/A), illetve H19–H34 azonosítókat. Ez kizárólag a megadott szó szerinti jelölések hiányát állapítja meg ezekben a fájlokban; a funkciók más megnevezéssel való jelenlétét nem dönti el.

**Bizonyítéki érték:** az archiválás nem módosította e nyolc fájl tartalmát, így az eredeti elődútvonalak és a mostani archív példányok tartalmi bizonyítékként egymással felcserélhetők. Ez nem jelenti azt, hogy a B-fejezet ezekben volt; a közvetlen előd-MASTERben sem szerepeltek a keresett B/2.70 kifejezések. A következő munka ezért a régi MASTER törzsének tényleges diffjére és a történeti funkciók névfüggetlen összehasonlítására irányul.

**Státusz:** nyolc tervfájl rename- és blobazonosságának ellenőrzése kész; szemantikai funkcióegyeztetés nyitott; `00.9.6.B` **UNRECOVERED / OPEN**; P0.2 **IN PROGRESS / NOT PASS**; fejlesztési fagyasztás változatlan.
