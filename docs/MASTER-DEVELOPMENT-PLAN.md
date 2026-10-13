# SANCI9517 — VÉGLEGES TERMÉK-, ARCHITEKTÚRA- ÉS VÉGREHAJTÁSI TERV

**Tervazonosító:** S9517-ULTIMATE-PLAN  
**Verzió:** 1.0.0 — teljesen új, egységes termékterv  
**Dátum:** 2026-10-13  
**Állapot:** AKTÍV — ez az egyetlen fejlesztési igazságforrás  
**Végrehajtás:** egy aktív pont, szigorú függőségi sorrend, bizonyítékalapú lezárás  
**Termékcél:** professzionális streamer weboldalból teljes, bővíthető Creator Operating Platform

---

## 0. A terv kötelező értelmezése

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
**ACTIVE_SUBPOINT_ID:** P0.1-PLAN-INTEGRITY-AND-BASELINE-VERIFICATION  
**Állapot:** IN PROGRESS — az új tervet össze kell egyeztetni a repository és a futó termék valós állapotával.  
**PARALLEL_WORKSTREAMS:** 0  
**Következő kapu:** P0 lezárása, majd P1 rendszer- és adatút-baseline, utána a függőségi sorrend szerinti implementáció.

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

- **P0.1:** IN PROGRESS — a branch/MASTER/archive baseline és a fő route-viselkedés ellenőrizve; az archív route-leírás javítva és a canonical Admin/Dashboard vs Editor v2 útvonal egyeztetve. A commit `a083cf879c3dd15e565cffeb7556dac6d4728faa` ellenőrzésekor a Cloudflare Workers Build, Editor Core Test és Twitch Integration Check mind SUCCESS lett. Az Editor Core workflow typecheck + Editor + Schedule + domain + Admin-home contract tesztet futtat; a Twitch workflow typecheck + Editor/Schedule + Twitch OAuth + site-ownership teszteket futtat. A gate azért marad nyitva, mert a teljes helyi working-tree állapot, a remote D1/schema integritás, valamint a save/reload/publish/mobile browser acceptance ebből a forráskód-auditból nem bizonyítható.
- **P0.2:** IN PROGRESS — a 271 H19–H34 történeti kulcs soronkénti MAPPED DRAFT crosswalkja (§41) megvan, és a 00.9.6.E/F 35 fő fejezete szintű crosswalkja elkészült (§37.20). A teljes bullet-szintű E/F és korábbi 00/A/C.23/C.24 provenance, a 357 feature ID teljes eredetbesorolása, a döntésindoklás és az ID-nkénti permission/dependency/acceptance contract még nincs lezárva.
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
- 357 stabil feature ID a registryben; a crosswalk minden hivatkozott ID-ja feloldható.
- A jelenlegi feature-ID prefix és a megadott canonical domain owner egyezik; a vegyes ownerű sorok explicit több-ID hozzárendelést használnak.
- A kilenc több-ID hozzárendelés külön felülvizsgálva: architektúra+secret boundary; reduced-motion/QA; interaction validation/QA; performance/ops; content management/Page Model; integrations/Connections Center; permissions/security; AI Editor action pipeline; collaboration/conflict. A több-ID sor nem helyettesíti a kapcsolódó feature ID-k külön DoD-ját.
- A korábbi általános phase-dependent célfázisok megszüntetve: a VOD-admin capability 1.5–2.0, az analytics reporting 2.0 célfázist kapott; a crosswalkban már nincs phase-dependent célfázis.
- A történeti eljárási checklist H34 soraiban az „all phases” a folyamatos governance-kötelezettséget jelenti, nem azt, hogy az összes termékfunkció minden fázisban implementálandó.
- A H27 Admin-capability soroknál a jelenlegi menüben látható placeholder nem runtime feature: a crosswalk csak a canonical owner/funkcióazonosítóhoz rendeli, és külön jelzi a későbbi fázist.

**Továbbra is nyitott:** a sorok eredeti történeti forrásával való emberi, tartalmi összevetés; minden cél-ID feature contractjának (permission, data owner, dependency, negative tests, acceptance evidence) kitöltése; a 271 követelmény és a 357 feature ID közötti teljes lefedettségi mátrix. Ez a második review-kör sem P0.2 PASS, és nem változtat implementációs státuszt.


### 37.17. P0.2 — Történeti és új funkciók közti lefedettségi különbség

A §24 registry és a §41 crosswalk újraszámolt kapcsolata:

- §24: 357 egyedi stabil feature ID.
- §41: 271 egyedi történeti követelménykulcs.
- A történeti crosswalk 128 különböző aktuális feature ID-t hivatkozik közvetlenül; minden ilyen ID feloldható a registryben, és a crosswalkban használt QA-ID-k is feloldhatók.
- A 357-ből fennmaradó 229 feature ID nem kap közvetlen történeti kulcsot a jelenlegi crosswalkban. Ez önmagában nem hiba: ezek között lehet újonnan hozzáadott termékigény, kibővített acceptance, biztonsági/üzemeltetési kapu vagy korábbi tervben nem szereplő képesség. **De mindegyikhez explicit eredetbesorolás kell**: NEW PRODUCT REQUIREMENT, EXPANDED ACCEPTANCE, CROSS-CUTTING CONTROL, PLATFORM/OPERATIONS, vagy HISTORICAL MAPPING GAP.
- A P0.2 zárás előtt a 357 ID mindegyikéhez ki kell tölteni a provenance mezőt: historical key(s), new requirement source, domain owner, target phase, dependency IDs, acceptance/test IDs és státusz. Ha egy ID új, a forrás a MASTER döntési naplójában szerepeljen; ha történeti, a H-key legyen visszakövethető. Az üres provenance nem törlési ok, hanem nyitott auditfeladat.

**Aktuális döntés:** a 271 történeti követelmény soronkénti megőrzése szerkezetileg PASS; a teljes történeti↔aktuális feature coverage nem PASS, amíg a 229 közvetlenül nem hivatkozott ID eredete és a tételenkénti feature contract nem dokumentált.


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
| E.16 | Localization/international use | LOC-001–LOC-008; WEB; SEO; DSN | DEFER/EXPAND — preserve language-ready content/metadata in the architecture; full localization workflow phased later. |
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
| E.2.1-04 | Navigation order/label/target/visibility/new-tab; server-side URL and permission validation | WEB-009, WEB-013, SEC-008 | EXPAND | 1.0 | QA-003/004 |
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
| E.2.3-05 | Consent-aware analytics and data minimization | ANL-002, COM-015, COM-017, SEC-010 | DEFER/EXPAND | Privacy baseline 1.0; audience analytics later | QA-003/008 |
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
| E.3.6-04 | Live/Twitch/Next Stream/Schedule/VOD/Clips/Social/Community/Support/Store dynamic blocks | EDT-020, LIV, SCH, CNT, COM, SUP, STO, DYN | EXPAND | 1.0 Twitch/Schedule/social baseline; later domains only in their phases | QA-002/003/004 |
| E.3.6-05 | Every element has typed defaults/validation/renderer/responsive/accessibility/error-empty states | EDT-015–EDT-020, WEB-032, QA-005 | EXPAND | 1.0 for included elements | QA-002/004/005 |
| E.3.6-06 | Categorized searchable block library, canvas preview and compatible drag-drop | EDT-008, EDT-015 | EXPAND | 1.0 | QA-002/004 |
| E.3.6-07 | Embeds limited to approved hosts with CSP/permission controls | WEB-032, SEC-008, QA-003 | EXPAND | 1.0 | QA-003/004 |
| E.3.7-01 | Undo/redo from structured commands, never DOM snapshots | EDT-003, EDT-005 | KEEP | 0.x–1.0 | QA-002/004 |
| E.3.7-02 | Dirty/save-in-progress/success/error/retry/conflict states | EDT-027, EDT-029, EDT-031 | EXPAND | 1.0 | QA-002/004/006 |
| E.3.7-03 | Validated autosave and explicit save | EDT-027, EDT-028, EDT-031 | EXPAND | 1.0; autosave only if its own acceptance passes | QA-002/004/006 |
| E.3.7-04 | Expected-version concurrency; no silent overwrite | EDT-029, EDT-030 | KEEP | 1.0 | QA-002/003/004 |
| E.3.7-05 | Unsaved navigation warning, recovery and browser refresh recovery | EDT-031, EDT-042 | EXPAND | 1.0 | QA-002/004/006 |
| E.3.7-06 | Canvas/Layers/Inspector/history/backend stay consistent after each operation | EDT-006, EDT-013, EDT-028, QA-002 | KEEP | 0.x–1.0 | QA-002/004 |

**Batch 1 result:** 57 E.2/E.3 bullets mapped to canonical feature IDs, explicit decision, phase and QA family. The mapping is not runtime PASS. Before P0.2 closure, verify the source bullet count and text against the archive, validate every ID/QA anchor, and continue with E.4–E.22 and F.1–F.13 in further batches.

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
- Funkciójegyzék: 357 stabil ID a §24.1–24.18 tartományban; a vizsgált ID-k egyediek, duplikációt az ellenőrzés nem talált.
- A crosswalk minden cél-ID-ja feloldható a jelenlegi funkciójegyzékben; a QA-horgonyok szintaktikailag érvényes QA-ID-hivatkozások.
- A §40 katalóguscímkéi és a §41 crosswalk címkéi kulcsonként egyeztetve vannak.

**Amit ez az ellenőrzés nem bizonyít:** a leképezések teljes szemantikai helyességét, a döntések termékoldali indokoltságát, a részletes feature contractok meglétét, a tesztek lefutását vagy a runtime készültségét. Ezért P0.2 továbbra is IN PROGRESS; a következő munka a mapping tartalmi felülvizsgálata, az esetleges túl tág megfeleltetések pontosítása és minden sor acceptance/dependency/permission mezőinek kiegészítése.
