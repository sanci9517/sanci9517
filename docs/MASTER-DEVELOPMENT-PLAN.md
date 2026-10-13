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
| P0.2 Követelmény- és funkciólefedettség | NOT STARTED | Teljes feature ID cross-check és explicit döntések |
| P0.3 Domain- és adatforrás-térkép | NOT STARTED | Canonical owner, source, site scope, lifecycle és dependency |
| P0.4 Admin/public/Editor surface audit | NOT STARTED | Minden route/menu/block és legacy állapot besorolása |
| P0.5 Provider/benchmark feasibility | NOT STARTED | Hivatalos API, capability, policy és cost kártyák |
| P0.6 Függőségi sorrend és acceptance freeze | NOT STARTED | Aktív pont, next point, DoD, tesztparancsok, rollback |
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
**Leltár eredménye:** 160 repository-fájl; a Git tree nem volt csonkolt. A kanonikus terv mellett a tervjellegű dokumentumok a dokumentációs archívumban vannak; az aktuális fejlesztési napló külön marad. A régi összesített MASTER-pillanatkép 5 161 soros, 686 481 karakteres, 283 címsorral. Ez a méretkülönbség miatt önmagában nem bizonyítja, hogy minden régi követelmény átkerült az új katalógusba.

Ez **leltárbizonyíték, nem történeti lefedettségi PASS**. A fájlok megtalálása és archiválása nem helyettesíti a tartalmi összehasonlítást. A P0.1 csak akkor zárható le, ha az aktív ág, a tervverzió, az archiválási állapot, a nyitott kérdések és a folytatási pont egyértelműek; a P0.2 csak a követelményenkénti leképezés után zárható le.

### 37.2. Kötelezően ellenőrzendő képességcsoportok

PWA/offline/mobile; provider capabilities/Discord roles; email/CRM/consent; Stream Deck; alert/chatbot/timer/poll/giveaway/loyalty/TTS/moderation; VOD→clip→Shorts→approval→publish→analytics; media processing/resumable upload; event/queue/webhook retry/idempotency/dead-letter/emergency stop; creator-type/brand-kit; payment/refund/entitlement; import/export/backup/restore; AI model routing/approval/verification/cost; observability/accessibility/reduced-motion/performance/rollback. Every group needs operation, owner, permission, errors, dependencies, tests and acceptance.
 
### 37.3. A P0 aktuális állapota

- **P0.1:** IN PROGRESS — a branch/MASTER/archive baseline és a fő route-viselkedés forráskódja ellenőrizve; a baseline commiton a Cloudflare Workers Build, Editor Core Test és Twitch Integration Check sikeres. A teljes tervintegritási gate még nyitott, mert a MASTER több korábbi fejezetében maradt státusz-/folytatási pont-ellentmondást és az archív route-leírás történeti eltérését egységesen reconciliálni kell. A tesztek sikere nem zárja le P0.1 önmagában.
- **P0.2:** IN PROGRESS — a 271 történeti kulcshoz elkészült a soronkénti MAPPED DRAFT crosswalk (§41), de a szemantikai megfeleltetés teljes felülvizsgálata, a döntések indoklása és a tételenkénti permission/dependency/acceptance contract még nincs lezárva.
- **P0.3:** IN PROGRESS — az első kódalapú domain/adatforrás-leltár elkészült; a teljes tábla-, owner-, lifecycle- és consumer-térkép még hiányzik.
- **P0.4:** IN PROGRESS — az első router/static surface-leltár elkészült; a teljes menü-/route-/block-lefedettség és legacy/placeholder besorolás még hiányzik.
- **P0.5:** IN PROGRESS — az első hivatalos provider-dokumentációs capability review rögzítve; a teljes feature-to-endpoint/scope/quota/approval matrix és élő integrációs acceptance még nyitott.
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

**P0.3 kiemelt blocker:** az `Env.MEDIA: R2Bucket` típusdeklaráció önmagában nem hoz létre Cloudflare R2 bindinget. A vizsgált `wrangler.jsonc` csak `ASSETS` és `DB` bindinget deklarál; a `MEDIA` R2 bucket nincs konfigurálva, és a fő router nem regisztrál Resource/media API-t. A canonical Resource domain ezért jelenleg tervezési cél, nem igazolt működő R2 upload/download rendszer. A fájlnevek vagy UI-elemek nem bizonyítanak domainkészültséget. A következő leltári körnek az összes migrációt, D1-táblát/indexet/foreign key-t, D1-olvasó/író consumer-t, R2 object-key/metadata útvonalat és site ownership határt kell összekapcsolnia; az éles D1 állapotot csak külön élő lekérdezés bizonyíthatja.

### 37.5. P0.4 — Első, kóddal igazolt route- és surface-leltár

**Router-forrás:** src/index.ts a v2/foundation ágon. Ez a regisztrált Worker-útvonalak listája; a statikus HTML-en belüli minden menüelem és kattintható művelet teljes auditja még hátravan.

| Surface / route | Jelenlegi cél | Besorolás | Bizonyíték / nyitott kérdés |
|---|---|---|---|
| /, /index.html | public/visual-page.html | Canonical public renderer entry | A publikus oldal dinamikus oldaltartalmat a public pages API-val olvas; a teljes public route/SEO/404 acceptance nyitott. |
| /p/* | public/visual-page.html | Canonical public page route family | A Page Modelből renderel; a published-only API szabály és az egyes oldalak állapota külön tesztelendő. |
| /admin/login | public/admin-login.html | Canonical login surface | /admin-login.html 302-vel ide irányít. |
| /admin | public/admin-home.html, hitelesítés után | Admin home/dashboard surface | **Dokumentációs eltérés:** docs/ARCHIVE-LEGACY-LAYERS.md azt állítja, hogy /admin és /admin.html az Editor v2-re irányít, de a jelenlegi src/index.ts szerint /admin az admin-home.html-t szolgálja ki, /admin.html pedig /admin-ra irányít. Ezt P0.1/P0.4-ben fel kell oldani; a runtime router a route viselkedésének elsődleges kódbizonyítéka. |
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

1. P0.1: a route/dokumentáció eltérés feloldása a kanonikus tervben; a legacy dokumentum csak igazolt runtime-viselkedés után módosítható.
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
| design_tokens, editor_components, editor_preferences | Korábbi Editor/platform design és preference adatok | Migrációban jelen vannak; aktív API/UI consumer, canonical registry és lifecycle nincs ebből önmagában igazolva. |
| system_page_content | Korábbi system-page tartalom | A migrációs láncban létrehozott legacy adatobjektum; a hozzá kapcsolódó route modulok nem regisztráltak a fő routerben. Törlés/migráció előtt adatmegőrzési döntés kell. |
| audit_log | Audit események | Az alapmigráció hozza létre; teljes eseménytaxonómia, hozzáférés, retention és export acceptance nyitott. |
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

**Editor action-to-handler evidence:** public/editor-v2/index.html declares Save, Publish, Unpublish, Preview, Undo/Redo, page selection, conflict export/reload, layers, element search, schedule tab, zoom/fit and mobile controls. public/editor-v2/app.js wires these through explicit click/change handlers; the app uses the command pipeline for editor mutations and /api/admin/pages + /api/admin/editor for persistence. This is evidence that the controls have source-level wiring, not a claim that every path passes browser/runtime acceptance.

**Admin home evidence:** public/admin-home.html calls the session, settings, pages, schedule and Twitch-connection endpoints and wires logout/mobile navigation/search/refresh/theme controls. The named capability cards marked “Tervezett” or “Későbbi” are disabled placeholders; they must remain PLANNED until the matching domain, API, permissions, tests and runtime evidence exist.

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
Magyar elsődleges publikus site; Creator Center/Admin; egyetlen Visual Editor; Pages/navigation/Layers/Inspector/responsive; core content/components; Resource/Media/Icon/Font Library; theme/template alapok; Schedule/Game Profiles; Twitch live/next-stream; draft/preview/publish/rollback; SEO/accessibility; E2E és production acceptance.

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

**Állapot: MAPPED DRAFT — P0.2 nem PASS.** Az alábbi 271 sor mindegyike megőrzi a történeti kulcsot és rövid címkét, javasolt canonical funkció-ID-t, domain owner-t, fő döntést, célfázist és QA-elfogadási horgonyt. A leképezés a §24.1–24.18 stabil ID-jegyzékéhez készül. A QA-horgony nem egyenlő a konkrét teszt végrehajtásával: minden sort továbbra is ellenőrizni kell a pontos user outcome, permission, adatforrás, dependency, negatív teszt és acceptance részletei alapján. Ahol egy sor összevont ID-ra mutat, az eredeti történeti kulcs önálló nyomon követhetősége megmarad.

| Történeti kulcs | Megőrzött követelmény | Canonical funkció-ID | Domain owner | Döntés | Célfázis | QA-horgony |
|---|---|---|---|---|---|---|
| H19.01 | upload | RES-003 | RES | MERGE | 1.0 | QA-002/004 |
| H19.02 | folders | RES-006 | RES | MERGE | 1.0 | QA-002/004 |
| H19.03 | search | RES-005 | RES | MERGE | 1.0 | QA-002/004 |
| H19.04 | filter | RES-005 | RES | MERGE | 1.0 | QA-002/004 |
| H19.05 | preview | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.06 | metadata | RES-007 | RES | MERGE | 1.0 | QA-002/004 |
| H19.07 | alt text | RES-007 | RES | MERGE | 1.0 | QA-002/004 |
| H19.08 | crop | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.09 | resize | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.10 | replace | RES-009 | RES | MERGE | 1.0 | QA-002/004 |
| H19.11 | archive/delete | RES-009 | RES | MERGE | 1.0 | QA-002/004 |
| H19.12 | usage tracking | RES-008 | RES | MERGE | 1.0 | QA-002/004 |
| H19.13 | unused media detection | RES-015 | RES | MERGE | 1.0 | QA-002/004 |
| H19.14 | MIME validation | RES-003 | RES | MERGE | 1.0 | QA-002/004 |
| H19.15 | file-size limits | RES-003 | RES | MERGE | 1.0 | QA-002/004 |
| H19.16 | secure object keys | RES-002 | RES | MERGE | 1.0 | QA-002/004 |
| H19.17 | image optimization | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.18 | video/audio | RES-004 | RES | MERGE | 1.0 | QA-002/004 |
| H19.19 | clip/Short assets | CNT-003 | CNT | MERGE | 1.0 | QA-002/004 |
| H19.20 | cache policy | OPS-008 | OPS | MERGE | 1.0 | QA-002/004 |
| H20.01 | D1 binding | DYN-001 | DYN | MERGE | 1.0 | QA-002 |
| H20.02 | site settings | SET-001 | SET | MERGE | 1.0 | QA-002 |
| H20.03 | schedule | SCH-001 | SCH | MERGE | 1.0 | QA-002 |
| H20.04 | Twitch | INT-011 | INT | MERGE | 1.0 | QA-002 |
| H20.05 | YouTube | INT-013 | INT | MERGE | 1.0 | QA-002 |
| H20.06 | TikTok | INT-014 | INT | MERGE | 1.0 | QA-002 |
| H20.07 | Discord | INT-015 | INT | MERGE | 1.0 | QA-002 |
| H20.08 | VOD | CNT-002 | CNT | MERGE | 1.0 | QA-002 |
| H20.09 | collections | CNT-005 | CNT | MERGE | 1.0 | QA-002 |
| H20.10 | API data source | DYN-001 | DYN | MERGE | 1.0 | QA-002 |
| H20.11 | loading state | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.12 | empty state | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.13 | error state | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.14 | conditional rendering | DYN-004 | DYN | MERGE | 1.0 | QA-002 |
| H20.15 | data transforms | DYN-003 | DYN | MERGE | 1.0 | QA-002 |
| H20.16 | caching | DYN-006 | DYN | MERGE | 1.0 | QA-002 |
| H20.17 | stale-data handling | DYN-005 | DYN | MERGE | 1.0 | QA-002 |
| H20.18 | binding validation | DYN-002 | DYN | MERGE | 1.0 | QA-002 |
| H21.01 | Twitch OAuth | INT-003 | INT | MERGE | 1.0 | QA-002/003 |
| H21.02 | Twitch live/offline | LIV-001 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.03 | Twitch title | LIV-003 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.04 | Twitch game | LIV-003 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.05 | Twitch viewer statistics | LIV-004 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.06 | Twitch followers/subscribers where available | LIV-004 | LIV | MERGE | 1.0 | QA-002/003 |
| H21.07 | Twitch VOD | INT-012 | INT | MERGE | 1.0 | QA-002/003 |
| H21.08 | Twitch clips | INT-012 | INT | MERGE | 1.0 | QA-002/003 |
| H21.09 | Twitch events/webhooks where applicable | INT-017 | INT | MERGE | 1.0 | QA-002/003 |
| H21.10 | YouTube channel | INT-013 | INT | MERGE | 1.5 | QA-002/003 |
| H21.11 | YouTube videos | INT-013 | INT | MERGE | 1.5 | QA-002/003 |
| H21.12 | YouTube Shorts | CNT-003 | CNT | MERGE | 1.5 | QA-002/003 |
| H21.13 | YouTube statistics where available | ANL-004 | ANL | MERGE | 1.5 | QA-002/003 |
| H21.14 | YouTube API quota/error handling | INT-009 | INT | MERGE | 1.5 | QA-002/003 |
| H21.15 | TikTok profile | INT-014 | INT | MERGE | 1.5 | QA-002/003 |
| H21.16 | TikTok supported content integration | INT-014 | INT | MERGE | 1.5 | QA-002/003 |
| H21.17 | TikTok API capability review | INT-014 | INT | MERGE | 1.5 | QA-002/003 |
| H21.18 | TikTok rate limits/fallback | INT-009 | INT | MERGE | 1.5 | QA-002/003 |
| H21.19 | Discord community link | COM-002 | COM | MERGE | 1.5 | QA-002/003 |
| H21.20 | Discord optional integration | INT-015 | INT | MERGE | 1.5 | QA-002/003 |
| H21.21 | Discord status where justified | INT-015 | INT | MERGE | 1.5 | QA-002/003 |
| H21.22 | Architecture constraint: keep secrets in Cloudflare Secrets and normalize external APIs behind services | INT-001, INT-019 | INT | MERGE | 1.5 | QA-002/003 |
| H22.01 | schedule CRUD | SCH-001 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.02 | recurring schedule | SCH-004 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.03 | timezone handling | SCH-003 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.04 | next-stream calculation | SCH-009 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.05 | countdown | SCH-009 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.06 | live state | LIV-001 | LIV | MERGE | 1.0 | QA-002/004 |
| H22.07 | game/category | SCH-012 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.08 | stream type | SCH-001 | SCH | MERGE | 1.0 | QA-002/004 |
| H22.09 | VOD ingestion | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.10 | VOD categorization | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.11 | VOD search/filter | CNT-002 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.12 | Shorts management | CNT-003 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.13 | clips management | CNT-003 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.14 | content calendar | CNT-009 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.15 | platform-specific variants | CNT-011 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.16 | title/description/hashtag suggestions | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H22.17 | thumbnail brief | CNT-012 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.18 | publishing workflow | CNT-013 | CNT | DEFER | 1.5–2.0 | QA-002/004 |
| H22.19 | performance feedback loop | ANL-004 | ANL | DEFER | 1.5–2.0 | QA-002/004 |
| H23.01 | event model | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.02 | click | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.03 | hover | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.04 | focus | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.05 | active | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.06 | submit | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.07 | scroll | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.08 | load | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.09 | timer | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.10 | open/close | EDT-039 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.11 | navigation | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.12 | show/hide | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.13 | toggle | EDT-039 | EDT | MERGE | 1.0 | QA-002/004 |
| H23.14 | state machine | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.15 | transition | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.16 | animation timeline | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.17 | keyframes | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.18 | reduced-motion | EDT-040 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.19 | interaction validation | EDT-022 | EDT | MERGE | 2.0 | QA-002/004 |
| H23.20 | performance safeguards | QA-005 | QA | MERGE | 2.0 | QA-002/004 |
| H24.01 | semantic HTML | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.02 | heading hierarchy | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.03 | alt text | RES-007 | RES | MERGE | 1.0 | QA-004/005 |
| H24.04 | labels | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.05 | ARIA | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.06 | keyboard navigation | EDT-037 | EDT | MERGE | 1.0 | QA-004/005 |
| H24.07 | focus order | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.08 | focus visibility | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.09 | contrast warnings | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.10 | screen-reader metadata | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.11 | form validation accessibility | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H24.12 | editor accessibility checks | QA-004 | QA | MERGE | 1.0 | QA-004/005 |
| H24.13 | public accessibility audit | QA-005 | QA | MERGE | 1.0 | QA-004/005 |
| H25.01 | title | SEO-001 | SEO | MERGE | 1.0 | QA-005 |
| H25.02 | description | SEO-001 | SEO | MERGE | 1.0 | QA-005 |
| H25.03 | canonical | SEO-001 | SEO | MERGE | 1.0 | QA-005 |
| H25.04 | Open Graph | SEO-002 | SEO | MERGE | 1.0 | QA-005 |
| H25.05 | X/Twitter card | SEO-002 | SEO | MERGE | 1.0 | QA-005 |
| H25.06 | structured data | SEO-003 | SEO | MERGE | 1.0 | QA-005 |
| H25.07 | sitemap | SEO-004 | SEO | MERGE | 1.0 | QA-005 |
| H25.08 | robots | SEO-004 | SEO | MERGE | 1.0 | QA-005 |
| H25.09 | per-page SEO | SEO-005 | SEO | MERGE | 1.0 | QA-005 |
| H25.10 | SEO preview | SEO-005 | SEO | MERGE | 1.0 | QA-005 |
| H25.11 | redirects | WEB-013 | WEB | MERGE | 1.0 | QA-005 |
| H25.12 | broken-link detection | WEB-013 | WEB | MERGE | 1.0 | QA-005 |
| H26.01 | page views | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.02 | button clicks | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.03 | social clicks | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.04 | stream events | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.05 | conversion events | ANL-001 | ANL | DEFER | 2.0+ | QA-002 |
| H26.06 | privacy-aware analytics | ANL-002 | ANL | DEFER | 2.0+ | QA-002 |
| H26.07 | retention policy | ANL-009 | ANL | DEFER | 2.0+ | QA-002 |
| H26.08 | admin dashboard | ANL-007 | ANL | DEFER | 2.0+ | QA-002 |
| H26.09 | editor/content performance | ANL-004 | ANL | DEFER | 2.0+ | QA-002 |
| H26.10 | content performance | ANL-004 | ANL | DEFER | 2.0+ | QA-002 |
| H26.11 | stream performance | ANL-003 | ANL | DEFER | 2.0+ | QA-002 |
| H26.12 | anomaly detection later | ANL-010 | ANL | DEFER | 2.0+ | QA-002 |
| H27.01 | dashboard | ADM-002 | ADM | MERGE | 1.0 | QA-008 |
| H27.02 | navigation | ADM-001 | ADM | MERGE | 1.0 | QA-008 |
| H27.03 | responsive admin | ADM-010 | ADM | MERGE | 1.0 | QA-008 |
| H27.04 | diagnostics | OPS-007 | OPS | DEFER | phase-dependent | QA-008 |
| H27.05 | page list | WEB-001 | WEB | MERGE | 1.0 | QA-008 |
| H27.06 | content management | CNT-001 | CNT | DEFER | phase-dependent | QA-008 |
| H27.07 | schedule | SCH-001 | SCH | MERGE | 1.0 | QA-008 |
| H27.08 | socials | INT-002 | INT | DEFER | phase-dependent | QA-008 |
| H27.09 | VOD | CNT-002 | CNT | DEFER | phase-dependent | QA-008 |
| H27.10 | media | RES-001 | RES | DEFER | phase-dependent | QA-008 |
| H27.11 | settings | SET-001 | SET | MERGE | 1.0 | QA-008 |
| H27.12 | SEO | SEO-005 | SEO | DEFER | phase-dependent | QA-008 |
| H27.13 | analytics | ANL-007 | ANL | DEFER | phase-dependent | QA-008 |
| H27.14 | integrations | INT-002 | INT | DEFER | phase-dependent | QA-008 |
| H27.15 | editor management | EDT-001 | EDT | MERGE | 1.0 | QA-008 |
| H27.16 | preview | WEB-005 | WEB | MERGE | 1.0 | QA-008 |
| H27.17 | recovery | OPS-009 | OPS | DEFER | phase-dependent | QA-008 |
| H27.18 | history | EDT-005 | EDT | DEFER | phase-dependent | QA-008 |
| H27.19 | permissions | ADM-009 | ADM | DEFER | phase-dependent | QA-008 |
| H28.01 | HttpOnly | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.02 | Secure cookie | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.03 | SameSite | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.04 | password hash | SEC-001 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.05 | CSRF | SEC-004 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.06 | rate limiting | SEC-007 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.07 | RBAC | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.08 | API authorization | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.09 | public/admin separation | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.10 | Cloudflare Secrets | SEC-008 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.11 | audit log | SEC-010 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.12 | input validation | SEC-005 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.13 | output validation | SEC-005 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.14 | file validation | RES-003 | RES | MERGE | 0.x–1.0 | QA-003 |
| H28.15 | replay protection where applicable | SEC-009 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.16 | action permission `can()` checks | SEC-002 | SEC | MERGE | 0.x–1.0 | QA-003 |
| H28.17 | AI permission boundary | AI-006 | AI | MERGE | 0.x–1.0 | QA-003 |
| H29.01 | full backup | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.02 | page backup | WEB-008 | WEB | MERGE | 0.x–1.0 | QA-007 |
| H29.03 | revision backup | WEB-008 | WEB | MERGE | 0.x–1.0 | QA-007 |
| H29.04 | media references | RES-008 | RES | MERGE | 0.x–1.0 | QA-007 |
| H29.05 | restore validation | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.06 | rollback | OPS-009 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.07 | import/export JSON | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.08 | migration compatibility | OPS-004 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.09 | backup integrity check | OPS-005 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H29.10 | recovery drill | OPS-006 | OPS | MERGE | 0.x–1.0 | QA-007 |
| H30.01 | bundle review | OPS-010 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.02 | lazy loading | RES-004 | RES | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.03 | image optimization | RES-004 | RES | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.04 | caching | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.05 | cache invalidation | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.06 | Core Web Vitals | QA-005 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.07 | rendering performance | QA-005 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.08 | large-page performance | QA-005 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.09 | large-tree editor performance | QA-004 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.10 | history memory limits | EDT-005 | EDT | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.11 | autosave efficiency | EDT-030 | EDT | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.12 | API latency monitoring | OPS-008 | OPS | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.13 | production smoke test | QA-006 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H30.14 | visual regression baseline | QA-004 | QA | MERGE | 0.x–1.0 | QA-001/005/006 |
| H31.00 | AI editor must use the same canonical action system as manual Editor, with pipeline: Intent -> Plan -> Actions -> Permission -> Validation -> Preview/Diff -> Approval -> Execute -> Verify -> Audit -> Version | AI-003, AI-005, AI-006, AI-007, AI-008, AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.01 | AI page operations | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.02 | AI element operations | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.03 | AI style/layout operations | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.04 | AI responsive operations | AI-011 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.05 | AI content generation | AI-013 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.06 | AI SEO assistance | AI-012 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.07 | AI accessibility QA | AI-012 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.08 | AI visual QA | AI-012 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.09 | action permissions | AI-006 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.10 | approval rules | AI-007 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.11 | rollback | AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.12 | audit | AI-009 | AI | DEFER | 3.0 | QA-002/003/008 |
| H31.13 | rate/cost controls | AI-010 | AI | DEFER | 3.0 | QA-002/003/008 |
| H32.01 | live stream monitoring | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.02 | silence/speech detection | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.03 | chat activity analysis | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.04 | technical issue detection | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.05 | audio problem detection | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.06 | stream quality checks | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.07 | scene suggestions | AI-015 | AI | DEFER | 3.0–8.0 | QA-002/008 |
| H32.08 | context-aware ideas | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.09 | interesting moment detection | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.10 | post-stream summary | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.11 | VOD analysis | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.12 | clip candidates | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.13 | Short candidates | AI-014 | AI | DEFER | 3.0 | QA-002/008 |
| H32.14 | title/description suggestions | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.15 | platform variants | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.16 | thumbnail briefs | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.17 | publishing recommendations | AI-013 | AI | DEFER | 3.0 | QA-002/008 |
| H32.18 | content performance analysis | ANL-004 | ANL | DEFER | 3.0 | QA-002/008 |
| H32.19 | streamer profile | AI-016 | AI | DEFER | 3.0 | QA-002/008 |
| H32.20 | long-term memory | AI-016 | AI | DEFER | 3.0 | QA-002/008 |
| H32.21 | preferences | AI-016 | AI | DEFER | 3.0 | QA-002/008 |
| H32.22 | historical outcomes | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H32.23 | experiment tracking | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H32.24 | evaluation cycle | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H32.25 | feedback loop | AI-015 | AI | DEFER | 3.0 | QA-002/008 |
| H33.00 | Automation lifecycle contract: Trigger -> Condition -> Action -> Result -> Verify -> Audit | AUT-001 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.01 | scheduled automations | AUT-005 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.02 | event automations | AUT-002 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.03 | content workflows | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.04 | media workflows | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.05 | stream workflows | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.06 | notification workflows | AUT-014 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.07 | retry policy | AUT-007 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.08 | idempotency | AUT-006 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.09 | failure handling | AUT-012 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.10 | permissions | AUT-004 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.11 | audit | AUT-008 | AUT | DEFER | 7.0 | QA-002/003 |
| H33.12 | Queues/Durable Objects only when justified by a real background-task or realtime requirement | OPS-011 | OPS | DEFER | 7.0 | QA-002/003 |
| H34.00 | Continuous feature discovery is never permanently closed, with review repeated before every significant Editor/platform extension | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.01 | modern visual builder minták | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.02 | GrapesJS / Craft.js / Puck architekturális minták | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.03 | új responsive/layout megoldások | EDT-024 | EDT | EXPAND | all phases | QA-010 |
| H34.04 | accessibility | QA-005 | QA | EXPAND | all phases | QA-010 |
| H34.05 | performance | OPS-008 | OPS | EXPAND | all phases | QA-010 |
| H34.06 | reusable components | DSN-012 | DSN | EXPAND | all phases | QA-010 |
| H34.07 | design systems | DSN-001 | DSN | EXPAND | all phases | QA-010 |
| H34.08 | collaboration/conflict | TEAM-004, EDT-029 | TEAM/EDT | EXPAND | all phases | QA-010 |
| H34.09 | backup/recovery | OPS-005 | OPS | EXPAND | all phases | QA-010 |
| H34.10 | AI action safety | AI-006 | AI | EXPAND | all phases | QA-010 |
| H34.11 | stream/content intelligence | AI-015 | AI | EXPAND | all phases | QA-010 |
| H34.12 | azonosítás | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.13 | cél és felhasználási eset | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.14 | függőségek | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.15 | Page Model/adatmodell | EDT-001 | EDT | EXPAND | all phases | QA-010 |
| H34.16 | Command/Action | EDT-003 | EDT | EXPAND | all phases | QA-010 |
| H34.17 | Inspector/Canvas/UI | EDT-021 | EDT | EXPAND | all phases | QA-010 |
| H34.18 | persistence | EDT-028 | EDT | EXPAND | all phases | QA-010 |
| H34.19 | teszt | QA-002 | QA | EXPAND | all phases | QA-010 |
| H34.20 | MASTER-be felvétel | QA-010 | QA | EXPAND | all phases | QA-010 |
| H34.21 | implementáció | QA-001 | QA | EXPAND | all phases | QA-010 |
| H34.22 | felhasználói validáció | QA-009 | QA | EXPAND | all phases | QA-010 |

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
