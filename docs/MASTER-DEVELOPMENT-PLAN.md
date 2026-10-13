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

**Termék**
- [ ] Minden Admin menü/almenü minden művelete felsorolva.
- [ ] Minden public route és content block szerepel.
- [ ] Minden domainnek egy canonical tulajdonosa van.
- [ ] Többfelületes funkciók közös adatforrást használnak.
- [ ] Integrációk provider capability matrix alapján készülnek.
- [ ] Commerce/entitlement auditált.
- [ ] AI strukturált/jóváhagyásos/visszavonható.
- [ ] Minden későbbi modulnak dependency és acceptance van.

**Technikai**
- [ ] Auth/permission/ownership/tenant isolation.
- [ ] Validation/API errors/idempotency.
- [ ] Migration/index/FK/integrity.
- [ ] D1/R2 boundary.
- [ ] Cache/invalidation.
- [ ] Logs/redaction/monitoring.
- [ ] Backup/export/restore.
- [ ] Performance/accessibility/SEO/privacy.
- [ ] Dependency/license/security.
- [ ] Browser/device/production acceptance.

**Felhasználói minőség**
- [ ] Menünév a felhasználói feladatot nevezi meg.
- [ ] Művelet eredménye egyértelmű.
- [ ] Save és publish külön.
- [ ] Hiba esetén érthető magyarázat és következő lépés.
- [ ] Unsaved módosítás nem vész el.
- [ ] Mobilon valóban használható.
- [ ] Közös adat minden felületen konzisztens.
- [ ] Nincs hamis adat vagy hamis sikerállapot.

---

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

## 18. Jelenleg nyitott elfogadási elemek

Ezek baseline megjegyzések; nem automatikus PASS:
- EDT-SAVE-RELOAD: kódoldali hardening rögzítve, de friss CI és production round-trip acceptance szükséges.
- EDT-PUBLISH-SNAPSHOT: draft mentés és publish szétválasztása javítva; éles save→reload→public oldal ellenőrzés kell.
- EDT-MOBILE-ACTION-BAR: viewporthoz kötött, safe-area támogatású javítás rögzítve; valós telefon és browser ellenőrzés kell.
- EDT-LAYERS-INSPECTOR-RESPONSIVE: property registry, resolved viewport value, reset útvonal implementálva; teljes canvas/layers/inspector/responsive acceptance szükséges.
- ADM-TABLET-LOGIN: külön, nem blokkoló deferred issue; megőrzendő.
- INT-TWITCH: korábban lezárt ownership/integration szerződés marad; Editor acceptance miatt nem kell feleslegesen újraírni.

---

## 19. Első végrehajtási kapu

### P0.1 — Tervintegritás és baseline ellenőrzés

**Cél:** az új terv konzisztenciájának, a repository valós állapotának és a tényleges tesztparancsoknak a rögzítése.

Lépések:
1. [ ] Git branch, HEAD, working tree és legutóbbi commitok ellenőrzése.
2. [ ] package scripts és tényleges tesztparancsok ellenőrzése; nem futtatható parancsot nem találunk ki.
3. [ ] Typecheck és releváns domain/editor/integration tesztek futtatása.
4. [ ] Aktív Editor route, canonical Page Model és revision API ellenőrzése.
5. [ ] D1 migration status és ownership integrity read-only/preflight ellenőrzése.
6. [ ] Save/reload, publish snapshot és mobile action bar nyitott acceptance ellenőrzése.
7. [ ] Eredmények rögzítése; lezárt, nem érintett gate-et nem implementálunk újra.
8. [ ] Domain/menu/feature egyedi ID-jegyzék véglegesítése.
9. [ ] Kettős aktív terv és párhuzamos feature work kizárása.
10. [ ] P0 PASS után a dependency alapján P1 vagy az első szükséges Editor/runtime acceptance pont következik.

**PASS feltételek:** repository baseline bizonyított; valós tesztparancsok ismertek; runtime acceptance és kódállapot külön; nincs kettős canonical owner; következő pont scope/DoD pontos; egyetlen követelmény sem veszett el indoklás nélkül.

**FAIL esetén:** új feature nem indul; csak a hiányzó baseline, tervellentmondás vagy tesztelhetőségi akadály rendezhető.

---

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

Ez a fejezet konkrét, önállóan ellenőrizhető képességekkel egészíti ki a fő menü- és végrehajtási katalógust. Ezek nem díszítő ötletek: a megfelelő domainhez és fázishoz kell őket rendelni, és nem maradhatnak elveszve az általános modulnevek alatt.

### 21.1. Website content types és creator resource oldal
- Creator Resources / Alkotói erőforrások önálló publikus oldalcél és CMS-kategória.
- Resources tartalomtípusok: útmutató, letölthető fájl, setup-lista, ajánlott eszköz, affiliate link csak megfelelő disclosure mellett, tutorial, FAQ, preset és külső erőforrás.
- Resource mezők: cím, slug, leírás, cover, kategória, tag, fájl/link, verzió, közzétételi dátum, visibility, SEO, kapcsolódó tartalom.
- Resource-oldal a canonical CMS/Page rendszerből kezelhető, nem külön hard-coded HTML-réteg.
- A letölthető vagy fizetős asset access kontrollja a Resource/Entitlement domainen keresztül működik.
- Oldaltípusok: Home, About, Live/Stream, Schedule, VOD/Content, Clips/Shorts, Community, Contact, Creator Resources, Link Hub, Support, Press/Sponsor, később Store, Membership, Events, Blog/News és Digital Products.
- Minden oldaltípusnak van responsive layoutja, SEO metadata, üres/error fallbackje és publish acceptance-e.

### 21.2. Sanci Button Registry és action registry
- Központi button/action registry egyedi, stabil ID-val; név, leírás, ikon ID, action type, target, permission, visibility, order és állapot.
- Action típusok: belső route, validált külső URL, scroll-to-section, dialog open/close, form submit, safe toggle és domain service által támogatott művelet.
- Nem megengedett arbitrary JavaScript stringet actionként tárolni vagy futtatni.
- Megjelenési mód: ikon és szöveg, csak ikon vagy csak szöveg; accessible label kötelező, ha csak ikon látszik.
- Hover/focus/active/disabled/loading állapotok, reduced-motion és keyboard támogatás.
- Gombok keresése, kategóriája, sorrendje, duplikálása, előnézete és törlés előtti használati hely ellenőrzése.
- Globális button style módosítás előnézettel és rollbackkel; helyi override csak explicit.
- Külső linknél valid URL, rel/target policy, open-redirect védelem és külső cél jelölése.
- Ugyanaz a button definition minden felületen azonos action contractot használ.

### 21.3. Forms és adatbeküldés
- Form builder: mezőtípus, címke, súgó, required, default, validation, min/max, option list, consent, success/error message.
- Field types: text, email, URL, textarea, select, checkbox, radio, date/time, file upload és későbbi conditional field.
- Szerveroldali validáció, rate limit, bot/spam védelem, honeypot vagy megfelelő anti-abuse megoldás, request-size limit.
- Submit action kizárólag regisztrált backend action lehet: contact request, newsletter opt-in, clip submission, event signup vagy más jóváhagyott domain action.
- Consent version/time/source tárolása, unsubscribe/withdrawal és adatmegőrzés.
- PII minimization, access control, export/delete és audit.
- Form success nem jelenhet meg backend visszaigazolás előtt; duplikált submit idempotensen kezelendő.
- Upload field csak validált file policyval, jogosultsággal és R2 lifecycle-lal.

### 21.4. Site search és discoverability
- Későbbi publikus site search a publikált oldalakra, resource-okra, tartalomra és termékekre, az aktív domain capability szerint.
- Index kizárólag publikált és kereshető tartalmat tartalmazhat; draft/member-only/private tartalom nem szivároghat.
- Search query normalizálás, pagination, no-results state, relevancia és canonical URL.
- Search index invalidation publish/unpublish/delete/update esetén.
- Későbbi sitemap- és broken-link report, redirect manager és indexelési problémák áttekintése.
- AEO/structured data csak értelmes, validált schema típusokhoz; nem szabad irreleváns markupot automatikusan hozzáadni.
- Social preview és OG image preview publikálás előtt ellenőrizhető.

### 21.5. Domain lifecycle
- Domain hozzáadása, verification challenge, DNS record instrukció, status polling és egyértelmű hibamagyarázat.
- Primary domain kijelölés, alias/redirect, HTTPS/TLS állapot, domain leválasztás és visszaállítás.
- DNS propagation miatt a pending állapot nem jelölhető hibásan késznek.
- Domainváltáskor canonical URL, redirect, sitemap, social preview és cache invalidation ellenőrzés.
- Domain detach/destructive action confirmation és audit.
- Custom domain működéséhez szükséges platform/Cloudflare képességek és költségek implementáció előtt igazolandók.

### 21.6. Game Profile és játékadatok
- Game profile: canonical ID, megjelenített név, platform, artwork/icon, description, genre/category, official URL, creator-specific notes, tags és kapcsolódó content/schedule.
- Játék létrehozása, szerkesztése, archiválása, keresése és használati helyei.
- Schedule event, content item és public page ugyanarra a game profile ID-ra hivatkozik.
- Külső játékadat csak provider/license policy alapján importálható.
- Artwork asset a Resource Registryhez kapcsolódik.
- Játék törlése előtt reference check; használt profil archiválása előnyben.

### 21.7. Link Hub és kampánylinkek
- Link item: title, destination, icon, description, visibility, order, active window, campaign, locale és status.
- Link típus: internal route, external URL, schedule, content, product, support, Discord, newsletter és event.
- Link health check, target validation, expired link warning és redirect/UTM policy.
- Click analytics csak consent/privacy szabály szerint, aggregáltan és szükségtelen fingerprinting nélkül.
- QR export és short link csak külön, biztonságos redirect contracttal.
- Link schedule és kampányhoz kötött CTA ugyanazt a canonical link/campaign recordot használja.
- Public link hub gyors, mobilbarát, akadálymentes és a creator brandjéhez illeszkedő.

### 21.8. Audience ownership és Founding Supporters
- Email audience: explicit consent, opt-in source, timestamp, consent version, language, status, suppression/unsubscribe.
- Export/delete és retention; a leiratkozott cím nem kaphat marketing e-mailt újra explicit új hozzájárulás nélkül.
- Newsletter, transactional email és automation notification külön kategória és jogosultsági szabály.
- Founding Supporters / támogatói oldal csak külön, önkéntes, visszavonható opt-in engedéllyel jeleníthet meg nevet.
- A támogatás ténye önmagában nem jelent hozzájárulást név vagy összeg nyilvánosságra hozatalához.
- Email delivery provider adapter, bounce/complaint state és retry/idempotency.

### 21.9. Stream diagnostics és Stream Intelligence
- Későbbi opt-in diagnostics: stream live/offline, connection quality, audio/mic problem, hosszú csend/speech activity, chat activity és OBS scene/recording state, ha a forrás és permission elérhető.
- A diagnosztika nem állíthat nem bizonyított okot tényként; confidence/source/freshness jelölés.
- Post-stream summary, VOD chapter, highlight/clip candidates, title/description és short-form script javaslat.
- A creator minden clipet/szöveget módosíthat; publikálás külön, jóváhagyott workflow.
- Media retention, privacy, consent és platform policy a feldolgozás előtt tisztázandó.
- Technikai stream assistant csak mért állapotból diagnosztizál; nem kér secretet és nem módosít OBS konfigurációt jóváhagyás nélkül.

### 21.10. AI Orchestrator és specialist agentek
- AI feladat lifecycle: intent → task plan → context selection → structured actions → permission check → schema validation → diff/preview → approval → execute through canonical APIs → verify → audit/version.
- Specialist role-k később: Web Engineer, Visual Editor, QA, GitHub/Cloudflare Engineer, Browser QA. Ezek nem különálló, korlátlan agent runtime-ok; a közös permission/action/audit pipeline-t használják.
- Model/provider registry, prompt-template version, task queue, usage/cost quota, timeout/retry, error handling és approval queue.
- Agent nem commitolhat, deployolhat, módosíthat production secretet vagy futtathat veszélyes műveletet explicit permission és jóváhagyás nélkül.
- AI output nem megbízható input: minden action schema- és permission-validációt kap.
- AI Control Center: provider state, usage/cost, active jobs, approvals, error/retry és audit.

### 21.11. Editor interakciók és mozgás
- Interakciók: click, hover, focus, active, submit, scroll, load, timer, open/close, navigation, show/hide és toggle csak validált action registryvel.
- Motion: duration, easing, delay, trigger, reduced-motion behavior és performance limit.
- State machine, advanced transitions, timeline/keyframes és scroll-driven animation későbbi külön scope.
- Motion preview nem módosíthatja a canonical data source-t és nem futtathat tetszőleges scriptet.
- Minden interakció keyboard/touch útvonalon is elérhető vagy indokoltan nem interaktív dekorációként jelölt.

### 21.12. Export, import és portability
- Export csomag verziózott manifesttel, checksummal, schema versionnel és asset listával.
- Secret/token export tilos; integrációt restore után újra kell hitelesíteni.
- Import dry-run: missing asset, duplicate ID, schema incompatibility, owner/permission, reference és migration check.
- Partial failure esetén nincs félig publikált állapot.
- Restore után page model, revisions, theme, navigation, media references és public render integritását ellenőrizni kell.
- A creator adatainak hordozhatósága nem lehet csak marketingállítás; tényleges export és restore teszt szükséges.

---

## 22. Benchmark alapvonal és forrásnapló

A külső termékekből átvehető tanulságok: vizuális canvas és responsive szerkesztés; CMS és publikálás előtti minőségellenőrzés; integrációs állapot és provider hibák átláthatósága; creator link hub; merchandise/digital product/membership/support; email audience ownership; content feed és collections; analytics és campaign tracking; accessibility/performance; AI structured proposals és approval.

Kutatási kezdőpontok, amelyeket implementáció előtt friss ellenőrizni kell:
- Framer website builder: https://www.framer.com/solutions/website-builder/
- Webflow platform/CMS: https://webflow.com/platform
- Wix accessibility/SEO nyilvános anyagok: https://www.wix.com/
- Twitch Creator Dashboard: https://help.twitch.tv/s/article/creator-dashboard?language=en_US
- Fourthwall features: https://fourthwall.com/features
- Fourthwall memberships: https://fourthwall.com/memberships
- Beacons creator platform: https://beacons.ai/
- Ko-fi features: https://ko-fi.com/features
- Patreon digital products: https://www.patreon.com/product/digital-products
- W3C accessibility guidance: https://www.w3.org/WAI/
- Web performance/Core Web Vitals: https://web.dev/vitals/
- OWASP web security guidance: https://owasp.org/www-project-top-ten/

A forráslista nem jelenti azt, hogy minden szolgáltató minden funkciója közvetlenül megvalósítható. Minden provider API, price, scope, licence és policy aktuális állapotát az adott implementációs pont előtt ellenőrizni kell.

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

## 33. Végrehajtási napló — kezdeti állapot

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

