# SANCI9517 — VÉGLEGES TERMÉK-, ARCHITEKTÚRA- ÉS FEJLESZTÉSI TERV

**Tervazonosító:** S9517-CREATOR-PLATFORM  
**Verzió:** 2.0.0  
**Dátum:** 2026-10-14  
**Állapot:** AKTÍV — ez az egyetlen aktuális termék- és fejlesztési terv; a belső konzisztencia és a fejlesztésindítási feltételek ellenőrzése még folyamatban van  
**Repository:** `sanci9517/sanci9517`, `v2/foundation`  
**Termékcél:** teljes, egy Adminból kezelhető Brand & Creator Operating Platform, saját weboldallal, közösségi és streaming integrációkkal, tartalomgyártással, bevételi eszközökkel, OBS-integrációval és multimodális SANCI AI-val.

---

## 0. A terv használata

Ez a dokumentum kizárólag a termék jelenlegi, ellenőrzött alapjait, a teljes termékcélt és a fejlesztendő képességeket írja le.

- **Egyetlen aktuális terv:** `docs/MASTER-DEVELOPMENT-PLAN.md`.
- A régi tervek, checkpointok és auditanyagok nem törlődnek a Git-előzményekből vagy az archívumból, de nem irányítják a jelenlegi terméktervezést.
- A termékfunkciók nem vesznek el pusztán azért, mert még nincsenek implementálva. A későbbi képességeket a megfelelő termékmodul és fejlesztési fázis alatt tartjuk nyilván.
- Minden funkciónál külön kell kezelni: **megvalósított**, **folyamatban**, **tervezett**, **külső szolgáltatóra vár**, illetve **felhasználói/éles ellenőrzésre vár**.
- Egy funkció tervben szereplése nem bizonyítja, hogy elkészült. Késznek csak működő implementáció, releváns tesztek és szükséges éles/felhasználói ellenőrzés alapján nevezhető.
- Nincs külön második termékterv vagy párhuzamos, új auditprojekt.
- A felhasználói élmény az első: a creator az Adminban a feladatának megfelelő, jól elkülönített modult találja meg; a közös adatok és műveletek minden érintett felületen következetesen frissülnek.
- A kézi alapfolyamatok AI nélkül is használhatók. Az AI bővíti és gyorsítja a platformot, de nem rejtheti el a működés állapotát, és nem végezhet korlátlan, jóváhagyás nélküli műveleteket.

### 0.1. Termékkategóriák
1. **Meglévő technikai alap:** a repositoryban és a futó rendszerben már meglevő Worker/D1/R2, ownership, Page Model, Editor és integrációs szerződések; csak igazolt állapot jelölhető késznek.
2. **A következő fejlesztési fókusz:** a meglévő Admin–Visual Editor–mentés/előnézet/publikálás–publikus weboldal folyamat teljes, megbízható lezárása.
3. **A teljes Creator Platform:** integrációk, tartalomgyártás, közösség, commerce, OBS/streaming eszközök, analitika, automatizáció és SANCI AI fokozatos megvalósítása.
4. **Későbbi platformosodás:** több creator/site, csapatmunka, billing, marketplace és kiterjesztések; ezek a végső terv részei, de nem előzik meg a stabil alapokat.

### 0.2. Változtatási szabály
Új funkció a megfelelő modulba kerül. Meglévő képesség módosításakor meg kell őrizni az adatkapcsolatokat, jogosultságokat, hibaállapotokat és a korábbi használati eseteket. Funkciót csak kifejezett termékdöntéssel lehet kivezetni; a későbbre ütemezés nem törlést jelent.

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

---

## 3. Részletes Admin-domainok és tételes funkciók

A 3.1–3.18 alfejezetek **felelősségi/domain-katalógusok, nem 18 külön főmenüpont**. A tényleges fő navigációt a 46.1. és 49. fejezet 16 modulja határozza meg. Az alábbi megfeleltetés a felelősséget rögzíti, hogy az azonos funkciók ne kapjanak külön menüben külön implementációt:

- 3.1 Dashboard → 49.1 Áttekintés.
- 3.2 Weboldal → 49.2 Weboldal és Visual Editor; a Brand Kit/design/template felelősség a 49.3 modulhoz tartozik.
- 3.3 Kapcsolatok → 49.6 Kapcsolatok és integrációk.
- 3.4 Live és Stream + 3.5 Adásrend → 49.4 Live és Stream Studio; az OBS-vezérlés és overlay eszközök a 49.5 modulhoz tartoznak.
- 3.6 Tartalom + 3.7 Média és erőforráskönyvtár → 49.7 Tartalomkönyvtár és Content Studio, közös asset registryvel.
- 3.8 Közösség → 49.8 Közösség és rajongók.
- 3.9 Bolt és kereskedelem + 3.10 Támogatás és tagság → 49.9 Bolt, támogatás és bevétel.
- 3.11 Analytics + 3.12 Tartalomtervező és kampányok + 3.15 Szponzoráció és üzleti központ → 49.10 Analitika és növekedés; a szponzorációs deal/lead/deliverable adatok kanonikus tulajdonosa ez a modul.
- 3.13 Automatizáció → 49.11 Automatizációk.
- 3.14 SANCI AI → 49.12 SANCI AI.
- Keresés/súgó/személyre szabás → 49.13.
- 3.16 Beállítások és hozzáférés + 3.18 Rendszerdiagnosztika → 49.14 Beállítások, biztonság és adat; a diagnosztika érzékeny nézetei korlátozott jogosultságúak.
- Fejlesztői eszközök és bővítmények → 49.15; 3.17 Csapat és munkaterület → 49.16.

A több helyen megjelenő gyorsművelet csak a kanonikus modulba navigál vagy annak közös domain commandját hívja; nem hozhat létre második tulajdonost, adatforrást vagy jogosultsági útvonalat.

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
**Kanonikus felelősség:** oldalak, navigáció, CMS/Page Model, Visual Editor, SEO, publikálás és weboldal-/domainbeállítások. A fő navigációban a Brand Kit/designrendszer és a sablon-/komponenskönyvtár külön, a 49.3. modulban található; a médiafájlok és asset-regiszter a 49.7. modulhoz tartoznak. A Weboldal modulból ezek közvetlenül elérhetők lehetnek, de a gyorselérés nem változtatja meg az adat- és funkciótulajdonost.
**Weboldal-almenük:** Oldalak; Navigáció; Visual Editor; CMS/tartalommodellek; SEO és publikálás; Domain és weboldalbeállítások.
**Külön modulhoz vezető gyorselérések:** Brand Kit és Design Studio (49.3); Média és erőforráskönyvtár (49.7). Ezek nem a Visual Editor belső almenüi és nem külön Editor-adatforrások.

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
- **Első működő szállítás:** a meglévő Twitch-kapcsolat stabil, teljesen kezelhető Admin modulja. A YouTube, TikTok, Discord, Kick és további provider-adapterek a teljes termékcél részei, külön, függőség szerint ütemezett fázisban. Az Editor nem lesz második connection manager; minden providernek külön capability/scope/policy ellenőrzése van.

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

## 9. Részletes fejlesztési munkacsomagok és elfogadási szerződések

**A kanonikus, legfelső szintű fejlesztési sorrend a 41.2. fejezet F0–F11 listája.** A 9. fejezet P1–P22 pontjai részletes munkacsomagok és elfogadási területek, nem egy második, párhuzamos roadmap. A munkacsomagok a megfelelő F-fázisokba kerülnek a 62.5. fejezet leképezése szerint. A 39. fejezet a fázisok rövid áttekintése; nem írhatja felül a 41.2. fejezet sorrendjét.

A fejlesztés függőségi sorrendben halad. A teljes termékcél végig megmarad; egyszerre a következő, a meglévő alapokra építhető és ellenőrizhető fejlesztési pont készül el. Történeti terv-összehasonlítás nem előfeltétele a termékfejlesztésnek.

### F0 — A meglévő core workflow megbízható lezárása
- Admin bejelentkezés és jogosultságok.
- Kanonikus Page Model és Visual Editor v2.
- Canvas, Layers, Inspector, responsive értékek és command/history.
- Draft mentés, reload, revision conflict és hálózati helyreállítás.
- Preview és publish külön életciklusa; a publikált snapshot ellenőrzése.
- A core workflow-hoz szükséges Resource/Media Registry-hivatkozások, R2 objektumok és D1 metaadatok konzisztenciája; a teljes asset-könyvtár, keresés, gyűjtemények, licenc- és használati térkép az F2/P4 megfelelő részében készül.
- Publikus renderer, cache invalidation és valós oldalellenőrzés.
- Telefonos/tabletes Admin és Editor alapvető használhatósága.
- A már lezárt site ownership, D1 integrity és Twitch ownership szerződések megőrzése; csak regresszió esetén nyílnak újra.
- **F0 kimenet:** a teljes alapfolyamat végigvihető, nincs csendes adatvesztés, a hibák helyreállíthatók, a draft nem publikálódik véletlenül.

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

### A részletes munkacsomagok határa
- A P1–P22 munkacsomagok a kanonikus F0–F11 fázisokon belül vagy azokat keresztmetszetben szolgálják ki; önmagukban nem hoznak létre külön, párhuzamos ütemtervet.
- A SANCI AI részletes képességeinek kanonikus termékfejezete a 40. fejezet, végrehajtási fázisa az F10.
- A multi-site/team/SaaS/marketplace részletes képességeinek kanonikus termékfejezete a 61. fejezet, végrehajtási fázisa az F11.
- **Fázisszabály:** a fázis nem töröl funkciót a termékcélból. A tényleges provider/API-képességet, költséget, jogi feltételeket és jogosultságokat az adott integráció aktiválásakor ellenőrizzük.

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

---

## 11. Megvalósítási állapotok

A terv és a tényleges készültség mindig különbözik. Csak az alábbi státuszok használhatók:

- **IMPLEMENTED / VERIFIED:** a kód és a szükséges teszt/runtime bizonyíték igazolja.
- **IMPLEMENTED / ACCEPTANCE OPEN:** a funkció kódban jelen van, de éles, böngészős, eszközös vagy felhasználói elfogadás még hiányzik.
- **IN PROGRESS:** aktív fejlesztés folyik.
- **PLANNED:** termékspecifikáció megvan, implementáció még nincs vagy nem igazolt.
- **PROVIDER-DEPENDENT:** a végleges viselkedés az adott platform API-jától, scope-jától vagy policy-jától függ.
- **BLOCKED:** konkrét külső vagy technikai akadály áll fenn, amelyhez megoldási lépés tartozik.

A „tervben szerepel”, „UI megjelenik” vagy „API válaszol” önmagában nem jelent teljes készültséget. A lezárás az adott funkcióra vonatkozóan ellenőrzi a sikeres és hibás útvonalat, jogosultságot, adatkonzisztenciát és helyreállítást.

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

---

## 13. Minőségi és üzemeltetési kapuk

**PR előtt:** diff/scope review, typecheck, releváns tesztek, diff-check, security/dependency review, migration/API contract review, aktív pont/acceptance ellenőrzése.

**Deploy előtt:** branch/commit/working tree, secret/binding/migration preflight, rollback plan, API/data tests, deploy diff/version.

**Deploy után:** health, auth/permission, érintett API/DB, public renderer/cache, Editor save/reload/publish ha érintett, browser/device ha UI érintett, log/error review, PASS/FAIL rögzítése.

**Release blocker:** adatvesztés/revision corruption, tenant data leak, secret leak, auth bypass, draft/published összekeverés, payment/entitlement hiba, csendes sync felülírás, kritikus broken public route/asset, kritikus accessibility/mobil hiba a release scope-ban, nem helyreállítható migration/restore.

---

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

---

## 15. Folyamatos ellenőrzőlisták

**Termék:** minden Admin művelet/public route; egy canonical domain owner; közös adat több felületen; provider capability matrix; commerce/entitlement; AI approval/rollback; minden modulhoz dependency/acceptance.

**Technika:** auth/RBAC/ownership/tenant isolation; validation/API errors/idempotency; migration/index/FK/integrity; D1/R2 boundary; cache invalidation; redacted logs/monitoring; backup/export/restore; performance/accessibility/SEO/privacy; dependency/license/security; browser/device/production acceptance.

**Felhasználói minőség:** feladatot nevező menük; egyértelmű eredmény; save és publish külön; érthető hiba/következő lépés; unsaved changes védelem; mobilhasználhatóság; közös adatok konzisztenciája; nincs hamis adat/success.

---

## 16. Döntési napló és változáskezelés

Minden döntéshez: dátum, ID, probléma, alternatívák, döntés/indok, érintett domain/menu/ID, data/API/migration/security/privacy/performance hatás, teszt/acceptance, rollback.

Tervmódosításkor a korábbi követelmény státusza és indoka megmarad. Új követelmény egyedi ID-t, domain ownert és DoD-t kap. Funkció nem nevezhető át úgy, hogy elveszítse korábbi jelentését; nem távolítható el csendben.

---

---

## 17. Aktív fejlesztési pont sablon

Minden konkrét fejlesztési pont rögzíti:
- az elérni kívánt felhasználói eredményt;
- a pontos scope-ot és a nem célzott változtatásokat;
- az érintett felületeket, domaineket, API-kat és adatforrásokat;
- az előfeltételeket és a függőségeket;
- a lépéseket és az érintett fájlokat;
- a valós repositoryban létező tesztparancsokat;
- a pozitív és negatív teszteket;
- az éles/böngészős ellenőrzést, ha releváns;
- a hibakezelést, visszaállítást és elfogadási feltételeket;
- az elkészült eredményt és a következő, függőség szerint esedékes fejlesztési pontot.

A pont célja működő termékfunkció szállítása, nem dokumentum-audit végrehajtása.

---

## 18. Ismert core acceptance-feladatok

Ezek meglévő termékfunkciókhoz tartozó ellenőrzési feladatok:
- **EDT-SAVE-RELOAD:** mentés és újratöltés utáni teljes round-trip.
- **EDT-PUBLISH-SNAPSHOT:** save → reload → publish → publikus render.
- **EDT-MOBILE-ACTION-BAR:** valódi mobilböngészős ellenőrzés.
- **EDT-LAYERS-INSPECTOR-RESPONSIVE:** Canvas/Layers/Inspector/responsive konzisztencia.
- **ADM-TABLET-LOGIN:** ismert, külön kezelendő tabletes belépési hiba.
- **INT-TWITCH:** a lezárt ownership/integration szerződés megőrzése és regressziótesztelése.

Az egyes tételek státusza csak az adott ellenőrzés tényleges lefutása után módosítható.

---

## 19. Következő fejlesztési pont

**Aktív fókusz: F0 — Admin → Visual Editor → mentés → előnézet → publikálás → publikus weboldal.**

**Következő konkrét ellenőrzési pont: EDT-SAVE-RELOAD → EDT-PUBLISH-SNAPSHOT.** A repositoryban lévő Editor-tesztek között a mentési útvonal több ellenőrzése forrásszöveg-szerződést (statikus mintákat) vizsgál; ez önmagában nem bizonyít valódi böngészős, D1-es mentés/újratöltés/publikálás round-tripet. Először a meglévő teszteket és futó környezetet kell ellenőrizni, majd valódi draft mentés → újratöltés → preview → explicit publish → publikus oldal ellenőrzést végigvinni, a hibákat reprodukálhatóvá tenni és csak ezután módosítani a kódot. Új, nagyobb termékmodul nem kerülhet e core ellenőrzés elé.

Ez a fókusz nem a teljes Creator Platform scope-jának szűkítése: csak a végrehajtás sorrendjét határozza meg. A statikus teszt, a valódi runtime/böngészős ellenőrzés és a felhasználói elfogadás külön bizonyítéktípus; egyik nem helyettesíti automatikusan a másikat.

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

---

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

---

## 22. Benchmark alapvonal és forrásnapló

Research: visual builder/responsive/CMS/publishing; provider health/integration UX; creator link hub; merch/digital products/membership/support; audience ownership; content feeds; analytics/campaign tracking; accessibility/performance; AI structured proposals/approval.

Kezdőpontok: https://www.framer.com/solutions/website-builder/ ; https://webflow.com/platform ; https://www.wix.com/ ; https://help.twitch.tv/s/article/creator-dashboard?language=en_US ; https://fourthwall.com/features ; https://beacons.ai/ ; https://ko-fi.com/features ; https://www.patreon.com/product/digital-products ; https://www.w3.org/WAI/ ; https://web.dev/vitals/ ; https://owasp.org/www-project-top-ten/.

Provider API, ár, scope, licenc és policy aktuális állapotát implementáció előtt újra ellenőrizni kell.

---

---

## 23. A platform készültségének termékdefiníciója

A platform nem attól teljes, hogy az Adminban sok menüpont látszik. Egy modul akkor használható, ha a creator a saját célját végig tudja vinni, a rendszer a valós adatokat és jogosultságokat kezeli, az állapotok érthetők, a hibákból helyre lehet állni, és a publikus/kapcsolódó felületek ugyanazt a kanonikus adatot használják.

A teljes terméknek ki kell terjednie a weboldalra és Visual Editorra, integrációkra, stream- és tartalomkezelésre, közösségre, bevételre, analitikára, kampányokra, automatizációra, OBS-re, SANCI AI-ra, adatvédelemre, biztonságra, helyreállításra, lokalizációra, csapatokra és későbbi bővíthetőségre. A teljes funkciókatalógus a végső cél része, de a készültséget minden modulnál külön kell igazolni.

---

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

---

## 26. Funkciószintű végrehajtási szerződés

Ez a fejezet a menü- és funkciójegyzéket végrehajtható specifikációvá teszi. A katalógusban felsorolt minden stabil ID csak akkor aktiválható implementációra, ha az alábbi szerződés minden mezője kitöltött. A hiányzó adat nem feltételezhető: az implementáció előtt a repositoryból kell feltárni, vagy nyitott döntésként kell megjelölni.

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

---

## 29. Adatmodell- és lifecycle katalógus

A tényleges táblák neveit és meglévő migrációit az implementáció előtt, az F0 platformbaseline részeként kell ellenőrizni; ez a logikai entitáskatalógus nem engedélyez új, párhuzamos táblák létrehozására.

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

---

## 32. Közös domain- és felületi konzisztencia

- Minden üzleti adatnak egy kanonikus domain tulajdonosa van; az Admin, az Editor, a Dashboard és a publikus weboldal ugyanazt a forrást használja.
- Az integrációk egyetlen token-/OAuth- és provider-adapter útvonalon keresztül működnek.
- A schedule, content, media, product, order, membership és analytics nem másolható szét felületenként eltérő adatforrásokra.
- A Visual Editor az oldalelrendezést és a dinamikus blokkok konfigurációját kezeli; a tényleges schedule, integráció, termék, közösség és analitika a saját Admin-moduljában marad.
- Minden keresztmodulos műveletnél egyértelmű az adatforrás, jogosultság, mentési életciklus, hibajelzés és visszaállítás.
- A provider hiányzó vagy nem támogatott képességét a rendszer nem szimulálhatja sikeresként.

---

## 33. Jelenlegi technikai kiindulópont

A jelenlegi rendszer Cloudflare Workers/TypeScript alapú, D1-et használ strukturált adatokhoz, R2-t bináris objektumokhoz; a Worker neve `sanci9517-streamer-brand`, a kanonikus Visual Editor runtime `public/editor-v2/`.

A korábbi fejlesztésből megőrzendő, már kialakított alapok:
- kanonikus Page Model és szerveroldali validáció;
- site ownership és D1 ownership-integritási szerződések;
- draft/revision és publikált állapot szétválasztására épülő Editor-architektúra;
- Schedule domain és az `schedule_items` kanonikus adatforrás;
- Twitch OAuth/site ownership integrációs alap;
- D1 strukturált metaadat és R2 bináris tároló elkülönítése.

Ezek nem jelentik automatikusan az összes felhasználói workflow teljes készültségét. A következő fejlesztésnek a valós kód- és tesztállapotból kell indulnia; lezárt alapot csak konkrét regresszió esetén nyitunk újra.

---

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

---

## 35. Felhasználói élmény alapelvei

- **Feladat szerint szervezett Admin:** a felhasználó azt a modult nyissa meg, ahol az adott feladat természetesen elvégezhető.
- **Valódi Visual Editor:** a vásznon látható elemek vizuálisan szerkeszthetők; a Layers, Inspector, responsive nézetek, előnézet és publikálás összefüggően működnek.
- **Egy változtatás mindenhol következetes:** közös adatot nem kell kétszer szerkeszteni; a kapcsolódó blokkok és publikus oldalak a kanonikus domainből frissülnek.
- **Különálló, de integrált munkaterületek:** a webshopot, integrációt, ütemezést vagy moderációt nem zsúfoljuk az Editor Inspectorába.
- **Átlátható állapotok:** loading, empty, error, stale, permission-denied, saving, saved, draft és published különbözik.
- **Mobilon is használható:** nem elegendő a desktop UI összenyomása.
- **AI-val vagy AI nélkül:** minden kritikus kézi folyamat érthető marad; AI-javaslat elfogadható, szerkeszthető és visszavonható.
- **Nincs hamis siker:** külső API-, publikálási, fizetési vagy küldési művelet csak a tényleges visszaigazolás után jelezhet sikert.

---

## 36. Kész és fejlesztendő funkciók szétválasztása

A tervben a teljes termékvízió és a fejlesztési sorrend szerepel; a tényleges készültség külön, valós bizonyíték alapján jelenik meg.

- **Meglévő alap:** a repositoryban megvalósított és korábban ellenőrzött technikai szerződés.
- **Elfogadásra vár:** a kód már létezik, de a teljes valós böngészős/éles/felhasználói folyamat nincs még lezárva.
- **Aktív fejlesztés:** a következő kijelölt implementációs pont.
- **Tervezett:** specifikált képesség, amely még nem tekinthető megvalósítottnak.
- **Külső függőség:** provider API, engedély, policy, költség vagy jogi feltétel miatt külön ellenőrzés szükséges.

A státusz nem lehet pusztán dokumentációból következtetett. Ha nincs aktuális bizonyíték, a funkció nem jelölhető késznek.

---

## 37. Integrációs központ és provider-képességek

Az Integrációk/Admin-központ egy helyen mutatja az összes csatlakoztatott platformot, jogosultságokat, egészségi állapotot, utolsó szinkront, hibákat, újracsatlakozást és leválasztást. Minden provider adapter egységes szerződést követ, de csak a szolgáltató által ténylegesen engedélyezett műveleteket teszi elérhetővé.

### 37.1. Elsődleges platformok
- **Twitch:** OAuth, live/offline, streamcím/kategória, chat és moderációs események a rendelkezésre álló scope szerint, VOD/clip/event adatok, követők/feliratkozók csak akkor, ha az API és jogosultság lehetővé teszi.
- **YouTube:** csatorna, videók/Shorts, streamütemezés és publikálás a támogatott API-műveletek szerint, analitika és quota-kezelés.
- **TikTok:** profil- és tartalomkapcsolatok, LIVE és publikálási funkciók kizárólag a fiókhoz és régióhoz elérhető hivatalos API-képesség szerint.
- **Discord:** szerverkapcsolat, bot, szerepkörök, értesítések, közösségi CTA-k és tagsági jogosultság-szinkron, a botengedélyek és szerverkonfiguráció szerint.
- **OBS Studio:** biztonságos pairing és WebSocket-alapú vezérlés, kapcsolatállapot, scene/source állapot, browser source, overlay, felvétel és stream műveletek csak explicit engedéllyel.
- **Későbbi provider adapterek:** Kick, Instagram, X, Patreon és más platformok csak a termékérték, API, policy, költség és karbantartási igény ellenőrzése után.

### 37.2. Egységes kapcsolati UX
Minden kapcsolatnál: csatlakozás, scope magyarázat, státusz, utolsó sikeres művelet, hiba és következő lépés, újracsatlakozás, biztonságos leválasztás, sync retry, provider-quota és részleges jogosultság jelzése. A provider hibája nem törölheti a kézi adatokat.

### 37.3. Többplatformos működés
Ahol hivatalosan támogatott, legyen közös chat/üzenetkezelés, streamcélok kezelése, tartalomnaptár, platformvariánsok, analitika és publikálási queue. A funkciók platformonként külön képességmátrixot használnak; a közös felület nem állíthatja, hogy egy művelet mindenhol elérhető, ha nem az.

---

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
- A legfelső szintű kiadási fázisok kanonikus sorrendjét a 41.2. fejezet határozza meg; a 39. fejezet összefoglaló. Az első kiadásból kimaradó képesség későbbi, explicit fázisban marad; nem törölhető.
- Do not build every advanced feature before the basic editor is reliable. Prefer a complete, testable capability inventory and a single dependency-ordered implementation path over rushed parallel work.
- This appendix adds no second editor, no second Page Model, no second Property Registry, no second Resource store, no second Schedule domain and no alternate save/publish route.

---

## 39. Teljes Brand & Creator Platform — végrehajtási életciklus

Ez a fejezet a teljes termék fejlesztési függőségeit rendezi sorba. A termékcél végig a teljes Creator Platform; a fázisok a biztonságos és tesztelhető szállítás sorrendjét jelölik, nem a funkciók végleges kizárását. A konkrét következő pontot a 41. fejezet és a repository aktuális állapota határozza meg.

### 39.1. F0 — Meglévő technikai alap és core workflow
Cloudflare Worker, D1/R2, auth/session, site ownership, domain validation, canonical Page Model, Editor command/history, draft/revision/publish, a core folyamathoz szükséges Resource/Media Registry-alapok és Twitch ownership szerződések megőrzése. A meglévő Admin → Editor → save/reload → preview/publish → public oldal folyamat hibáinak lezárása. A teljes erőforrás-könyvtár, bővített Brand Kit és sablonregiszter az F2-ben készül.

### 39.2. F1 — Közös Admin és modulhatárok
Egységes app shell, menürendszer, routing, permission-aware navigation, közös UI állapotok, domain API/command szerződések, szerveroldali jogosultság és diagnosztika. Minden modul külön feladatot kezel, de közös infrastruktúrát használ.

### 39.3. F2 — Brand Kit, Resource Registry és sablonrendszer
Kanonikus brand identity, design tokens, média/ikon/font library, site/page/section/component/theme template-ek, reusable component/symbol, preview/diff/version/rollback. A változtatások hatása követhető és visszavonható.

### 39.4. F3 — Publikus weboldal, CMS és a Visual Editor bővítése
Az F0-ban stabilizált kanonikus Visual Editor továbbfejlesztése a teljes oldalépítési élményhez: oldalak, navigáció, dinamikus blokkok, CMS/data binding, SEO, accessibility, custom domain és publikált renderer. Az F3 nem hoz létre második Editort, Page Modelt, mentési vagy publikálási útvonalat; a canvas/Layers/Inspector core az F0-ban marad, a designrendszer és reusable komponensek az F2-re épülnek.

### 39.5. F4 — Creator account, workspace és onboarding
Külön tervezett creator-regisztráció, email/identity verification, recovery, workspace/site setup, szerepkörök és permissionök. A jelenlegi admin-auth nem válik nyílt regisztrációvá addig, amíg a tenant/site izoláció és account lifecycle tesztelt. Fan account és membership külön publikus felhasználói réteg.

### 39.6. F5 — Integrációs központ és provider adapterek
Twitch meglévő kapcsolatának stabilizálása, majd YouTube, TikTok, Discord, Kick és további integrációk. Providerenként OAuth/scope, capability matrix, quota, token lifecycle, webhook verification, sync, error/retry, reconnect/disconnect és valós provider acceptance.

### 39.7. F6 — Stream Studio és OBS
Overlayek, alerts, widgets, stream scene/source állapot, biztonságos OBS pairing, browser source, stream eventek, stream vezérlés és permission-vezérelt automatizáció. Minden template ugyanazt a Brand Kitet és asset registryt használja.

### 39.8. F7 — Content Studio és többplatformos publikálás
VOD, clip, highlight, Shorts, transcript, thumbnail, platformvariáns, content calendar, edit/export pipeline, queue, jóváhagyás és provider státusz. A publikálás a hivatalos API, account scope, consent és policy korlátai szerint működik.

### 39.9. F8 — Közösség, támogatás, tagság és commerce
Fan account, publikus közösségi funkciók, Discord role sync, támogatás, merch/shop, digitális termékek, tagsági szintek, kupon, checkout, order/payment/fulfillment lifecycle, entitlement és vásárlói támogatás. Fizetési/adózási/fulfillment szolgáltatók külön üzleti és jogi ellenőrzésen mennek át.

### 39.10. F9 — Analitika, kampány és automatizáció
Forrás- és frissességjelölt analitika, stream/content/shop/web teljesítmény, kampányok, szponzoráció, workflow builder, event triggers, retry, dry-run, approval és recovery.

### 39.11. F10 — SANCI AI és multimodális Creator Intelligence
AI Control Center, model/provider registry, weboldal/Admin-asszisztens, élő stream coach, stream/VOD-elemzés, klip- és videógyártás, feliratozás, content strategy, moderációs javaslatok és specialist orchestration. Minden AI-művelet ugyanazt a permission/validation/command/history/approval útvonalat használja, mint a kézi művelet.

### 39.12. F11 — Platformosodás és bővíthető ökoszisztéma
Több workspace/site, csapat és szerepkör, előfizetés/usage, lokalizáció, theme/component/overlay/automation/AI workflow marketplace, külső extension manifest és biztonságos install/update/uninstall/migration/rollback.

### 39.13. Fázisok közötti megőrzési szabály
A későbbi fázisba ütemezés nem törlést jelent. Minden képesség a saját moduljában és stabil funkcióazonosítóval marad a tervben. Egy fázis csak a saját acceptance feltételei után tekinthető késznek. Új funkció nem kerülhet be párhuzamos miniappként, második storage-ként vagy külön jogosultsági rendszerként.

---

## 40. SANCI AI — teljes Creator Intelligence rendszer

A SANCI AI célja nem egy egyszerű chatablak. Egy, a creator teljes munkafolyamatát támogató, több specialista szerepből és multimodális feldolgozási folyamatból álló rendszer: előkészít, figyel, értelmez, visszajelez, tartalmat készít, automatizálási javaslatot ad és mérhető eredményekből tanul. A kézi vezérlés és a felhasználó döntési joga minden esetben megmarad.

### 40.1. AI Control Center
- Modell- és szolgáltató-regiszter, feladattípusonkénti modellválasztás, fallback és verziókövetés.
- Creator által szabályozható jogosultságok, adatforrások, élő megfigyelés, felvételek feldolgozása, tárolási idő, memória, költségkeret és értesítések.
- Feladatlista, feldolgozási állapot, várakozó jóváhagyások, költség/kvóta, hiba és újrapróbálás.
- A creator bármikor szüneteltetheti vagy kikapcsolhatja az AI-t, törölheti a memóriáját, és szabályozhatja, mi használható kontextusként.
- A rendszer feladatonként választhat beszéd-/audio-, video-, képi, nyelvi és strukturált adatelemző modelleket; nem szükséges egyetlen modellt minden munkára használni.

### 40.2. Élő stream társ és felügyelet
- Élő állapot, streamminőség, hang/mikrofon, csend vagy hangkimaradás, scene/source állapot, OBS- és provider-hibák jelzése, amennyiben az adott jel elérhető.
- Chattempó, visszatérő kérdések, hangulatjelzések, közösségi aktivitás és lehetséges moderációs kockázatok összefoglalása.
- Kontextusérzékeny ötletek, kérdések, témaváltási javaslatok, game-event/reakciós pillanatok és emlékeztetők.
- Opcionális AI co-host: előre beállított szerep, hangnem, tiltott témák, válaszkorlátok és látható „AI-javaslat” állapot.
- Stream közben az AI különböztesse meg a tényt, a becslést és a bizonytalanságot; ne állítson diagnózist vagy provider-állapotot nem ellenőrzött jelből.
- Moderációs akciók fokozatosan: először jelzés/javaslat, majd szabályozható automatikus intézkedés csak engedélyezett művelet, küszöbérték, naplózás és visszavonási lehetőség mellett.
- Az élő elemzés csak opt-in módon, a rendelkezésre álló stream-/chat-/OBS-adatok és a szolgáltatói feltételek szerint működik.

### 40.3. Stream utáni intelligencia
- Felvétel/transcript, fejezetek, témák, események, fontos pillanatok és highlight-jelöltek.
- Nézői aktivitás, chat, streamminőség, közönségmegtartás és kilépési pontok összefüggéseinek elemzése, ha a szükséges adat rendelkezésre áll.
- Mi működött / min érdemes változtatni / mi legyen a következő stream kísérlete — indoklással és forrásadatokkal.
- Streamenkénti és hosszabb távú összehasonlítás, célkövetés, preferenciák és felhasználó által kontrollált creator memory.

### 40.4. AI Content Factory
- Automatikus clip/Short/Reel/TikTok/YouTube-videó jelöltek streamből, VOD-ból vagy feltöltött anyagból.
- Szerkesztési folyamat: pillanatválasztás, vágás, 9:16/16:9/1:1 reframing, felirat, beszédátirat, audiojavítás, intro/outro, brand overlay, B-roll vagy egyéb vizuális kiegészítés, ahol jogszerű és támogatott.
- Cím, leírás, hashtag, fejezet, thumbnail brief/variáns, platformonkénti hossz/formátum és publikálási idő javaslata.
- Szerkeszthető timeline és szöveges vezérlés; AI-módosításokhoz diff, undo/restore és kézi finomítás.
- Tartalomnaptár, jóváhagyási queue, ütemezés és közzététel csak a megfelelő provider API, fiókjogosultság és explicit felhasználói szabály szerint.
- Jogvédett zene, személyes adatok, vendégek, chat és más érzékeny anyag esetén ellenőrzés, kizárás vagy jóváhagyás szükséges.

### 40.5. Creator stratégia és növekedés
- Összevont, de forrásonként megkülönböztetett platformanalitika.
- Tartalomötlet-, sorozat-, naptár-, kampány-, szponzorációs és közösségépítési javaslatok.
- A saját célokhoz illeszkedő kísérletek és eredmények követése; ne ígérjen garantált nézettséget vagy növekedést.
- Weboldal, SEO/AEO, link hub, shop/merch, tagság és kampány teljesítményének összekapcsolása a jogosultság és adatminőség figyelembevételével.

### 40.6. AI weboldal- és Admin-asszisztens
- Természetes nyelvű oldal-/szekció-/komponenslétrehozás, layout, theme, design token, responsive, szöveg, SEO és accessibility javaslat.
- Integráció, schedule, content, shop, campaign és automation draftok készítése.
- Minden módosítás a kanonikus API/command pipeline-on keresztül fut; nincs közvetlen DB-, DOM- vagy publikus éles módosítás a validáció megkerülésével.
- Preview/diff → engedélyellenőrzés → jóváhagyás (a kockázatnak megfelelően) → végrehajtás → ellenőrzés → visszaállítható verzió.
- Kockázatos művelethez — publikálás, fizetés, moderáció, külső üzenet, törlés, jogosultságváltoztatás, deploy — külön szabály és szükség esetén explicit megerősítés kell.

### 40.7. Specialisták és közös orchestration
A specialisták megosztott kontextus- és action pipeline-t használnak, de külön feladatuk van:
- **Live Coach:** élő stream visszajelzés és technikai figyelés.
- **Moderator Assistant:** chat összegzés, szabályjavaslatok, spam/abuse jelzések és engedélyezett moderáció.
- **Clip & Video Producer:** highlightok, vágás, felirat, formátumok és export.
- **Content Strategist:** ötlet, naptár, platformvariáns és teljesítmény-visszacsatolás.
- **Website/Brand Designer:** Visual Editor, design system, SEO, accessibility és brand consistency.
- **Community & Business Assistant:** Discord, kampányok, shop, membership, támogatás és szponzoráció.
- **Automation Builder:** eseményvezérelt munkafolyamatok, dry-run, jóváhagyás és helyreállítás.
- **Analytics Analyst:** összevont, de forrás- és frissességjelölt elemzés.

### 40.8. Biztonság, minőség és technikai realitás
- AI-adatkezelés opt-in és minimális adatgyűjtés; retention/export/delete és érzékeny adatok redakciója.
- Provider scope, copyright, consent, rate limit, model/API-költség, queue, retry, timeout, idempotency és background-job monitoring.
- Prompt injection és nem megbízható tartalom kezelése; a stream chat vagy felirat nem utasíthatja felül a rendszer jogosultsági szabályait.
- Minden automatikus műveletnek legyen naplója, eredménye, hibakezelése és ahol lehetséges rollbackje.
- A rendszer a legjobb elérhető modelleket/adapterszolgáltatásokat használhatja; saját alapmodell tanítása nem feltétele a teljes AI-terméknek. A saját értéket a creator-context, a workflow, a biztonságos action layer, a multimodális feldolgozás és a visszacsatolási rendszer adja.
- Az AI nem találhat ki hiányzó analitikát, nem állíthat biztos okot bizonytalan jelből, és nem publikálhat automatikusan a felhasználó beállításainak megkerülésével.

### 40.9. AI megvalósítási sorrend
1. AI Control Center, provider abstraction, permission/action pipeline és költség-/adatkezelés.
2. AI weboldal-/Admin-asszisztens diff/preview/jóváhagyás mellett.
3. VOD/stream utóelemzés, transcript, fejezetek és highlight-jelöltek.
4. Clip/Short videógyártás, felirat, reframing, brand template és szerkesztői finomítás.
5. Élő streamdiagnosztika és Live Coach, valós idejű adatút/OBS-integrációval.
6. Moderációs asszisztens és szabályozott automatizáció.
7. Creator memory, stratégiai analitika és mérhető, személyre szabott visszajelzés.
8. Többspecialistás orchestration, fejlettebb multimodális munkafolyamatok és marketplace-bővíthetőség.

A későbbi fázis nem jelenti a funkció kihagyását; a biztonságos és megbízható alapokra épülő megvalósítás sorrendjét jelöli.

---

## 41. Aktuális termékállapot és következő lépések

### 41.1. Meglévő, megőrzendő technikai alapok
- Cloudflare Worker + TypeScript runtime, D1 strukturált adatokhoz és R2 bináris objektumokhoz.
- Kanonikus Visual Editor v2 és Page Model; egyetlen draft/save/publish architektúra.
- Site ownership és a kapcsolódó adatbázis-integritási szerződések.
- Schedule domain és `schedule_items` kanonikus forrás.
- Twitch OAuth és site-hoz kötött integrációs alap.
- A már létező domain-, Editor- és integrációs tesztek megőrzése.

Ezek a meglévő alapok nem jelentik azt, hogy minden kapcsolódó felhasználói folyamat teljesen kész. A valós státuszt a kód, tesztek, runtime és felhasználói elfogadás együtt határozza meg.

### 41.2. Következő megvalósítási sorrend
1. **F0 — Core megbízhatóság:** Admin → Visual Editor → mentés/újratöltés → preview → publish → publikus oldal; a meglévő runtime- és acceptance-hibák tényleges lezárása.
2. **F1 — Alaprendszer és modulhatárok:** közös Admin shell, navigáció, routing, permission model, egységes loading/empty/error/stale state, szerveroldali domain-szerződések és közös API/command útvonal.
3. **F2 — Brand, design system, Resource Registry és sablonok:** brand kit, tokenek, reusable komponensek, page/section/component/site template, assetek, verziózás, preview és rollback.
4. **F3 — Publikus site builder és CMS:** oldalak, navigáció, dinamikus adatblokkok, SEO, accessibility, publikálás, domainbeállítás és mobilos végponttól végpontig elfogadás.
5. **F4 — Creator-fiók és onboarding alapjai:** a jelenlegi admin-auth megőrzése mellett külön megtervezett creator registration, workspace/site létrehozás, onboarding, szerepkörök és account recovery; csak a tenant-scope és biztonsági modell jóváhagyása után élesítve.
6. **F5 — Integrációs központ:** Twitch meglévő alapjának stabilizálása, majd YouTube, TikTok, Discord, Kick és további adapterek; providerenként külön képességmátrix, scope és éles engedély.
7. **F6 — Stream Studio és OBS:** overlay/alert/widget template-ek, OBS pairing, browser source, stream események, scene/source vezérlés és engedélyezett automatizációk.
8. **F7 — Content Studio:** VOD, klipek, highlightok, Shorts, metaadatok, többplatformos naptár, media processing, queue és publikálás provider-korlátokkal.
9. **F8 — Közösség és bevétel:** fan account/membership, támogatás, merch/shop, digitális termék, kupon, rendelés, fulfillment és jogosultságalapú közösségi funkciók.
10. **F9 — Analitika, kampány és automatizáció:** forrásmegjelölt metrikák, szponzoráció, kampányok, workflow builder, események, retry és dry-run.
11. **F10 — SANCI AI:** a 40. fejezet szerinti AI Control Center, admin/brand-asszisztens, VOD/clip factory, live coach és biztonságos specialist orchestration.
12. **F11 — Platformosodás:** csapatok, több site, billing/usage, localization, theme/component/overlay marketplace, külső extension API és tenant-onboarding.

A fázisok között kötelező függőségek vannak; a számok nem ígérnek határidőt. A teljes végső funkcióscope minden fázisban megmarad. Egy későbbi modul nem épülhet úgy, hogy saját, párhuzamos storage-t, jogosultsági rendszert vagy duplikált üzleti logikát hoz létre.

### 41.3. Mi számít késznek?
Egy funkció csak akkor kész, ha a megadott felhasználói cél a valós alkalmazásban végigvihető; az adatok helyesek és konzisztensen jelennek meg minden érintett felületen; a jogosultságok és hibás állapotok kezeltek; a releváns tesztek és szükséges valós böngészős/éles ellenőrzések sikeresek. A dokumentáció frissítése a megvalósítást követi, nem helyettesíti azt.

**Ez a fejezet az aktuális termékfejlesztés irányát rögzíti; a teljes Creator Platform célja és későbbi képességei változatlanul a terv részei.**

---

## 42. Brand Kit és vizuális identitásrendszer

A platform nem pusztán weboldal-sablonokat ad: a creator márkája minden kapcsolódó felület közös, verziózott rendszeréből épül fel.

### 42.1. Kanonikus Brand Kit
- Brand profil: név, leírás, hangnem, nyelvek, célközönség, közösségi linkek, kapcsolat és press/business információ.
- Logo family: primary, compact, monochrome, icon/mark, light/dark változat, clear-space és minimális méret.
- Színpaletták és szemantikus design tokenek: primary/secondary/accent, background/surface, text, border, success/warning/error, contrast metadata.
- Typography system: display, headings, body, caption, UI, font fallback, licenc és betöltési stratégia.
- Spacing, grid, container, breakpoint, radius, shadow, border, z-index, motion és accessibility tokenek.
- Brand assetek: avatar, banner, offline image, thumbnail, emote/badge, panel, favicon, social preview, watermark csak az adott platform szabályai szerint.
- Brand voice: megengedett hangnemek, preferált kifejezések, névírás, tiltott állítások és nyelvi stílus.
- Brand kit verziózás, változásnapló, preview, dependency map és rollback.

### 42.2. Egyszeri változtatás, közös hatás
A brand-adat nem másolható minden modul saját beállításaiba. A publikus weboldal, Visual Editor, Stream Studio, overlayek, Content Studio, thumbnail presetek, AI-generált szövegek és shop ugyanazokat a Brand Kit referenciákat használják. Modul-specifikus eltérés csak explicit override lehet, látható scope-pal és reset/restore művelettel.

A központi brand-változás előtt a rendszer megmutatja az érintett oldalakat, sablonokat, komponenseket és generálási preseteket. A változtatás nem írja át észrevétlenül a már publikált tartalmakat vagy a felhasználó által jóváhagyott kész videókat.

## 43. Sablonok, témák és újrahasznosítható blokkok

### 43.1. Sablonrétegek
- **Starter/site template:** teljes kezdő weboldal és kezdeti konfiguráció.
- **Page template:** Home, About, Live, Schedule, Games, Videos, Clips, Community, Support, Shop, Membership, Contact, Press Kit, Legal és egyedi landing.
- **Section template:** hero, live banner, next stream, schedule, featured video, social grid, community CTA, merch spotlight, membership CTA, sponsor strip, FAQ, footer.
- **Component template:** gombok, kártyák, stream állapot, játékprofil, videólista, termékkártya, CTA és adatállapotok.
- **Design/theme preset:** színek, tipográfia, spacing, shape, motion, háttér és vizuális stílus.
- **Stream overlay template:** gameplay, Just Chatting, starting soon, BRB, ending, vertical stream, alertbox, goals, chat, lower-third, webcam frame.
- **Content template:** thumbnail, Shorts/Reels/TikTok frame, caption style, title/description, intro/outro és export preset.
- **Automation template:** stream-start, stream-end, új videó, új tagság, merch order és hibaértesítés.
- **AI workflow template:** VOD analysis, clip selection, subtitles, weekly review, stream prep és brand-aware copy.

### 43.2. Sablon-életciklus
Minden sablonnak van stabil azonosítója, típusa, verziója, schema-verziója, preview, kompatibilitási feltétele, asset-/token-függősége, jogosultsága, szerzője/forrása és státusza. Műveletek: create, duplicate, preview, apply, save as, update, deprecate, archive, export/import és rollback.

Sablon alkalmazása alapértelmezetten független példányt hoz létre; csak az explicit reusable/linked component marad közösen hivatkozott. Frissítés előtt diff és impact preview szükséges. Schema-migráció nem változtathat meg csendben meglévő oldalakat. A marketplace későbbi fázis, de a belső sablonrendszert már eleve verziózhatóra kell tervezni.

### 43.3. Bővíthető komponenskönyvtár
A komponens egységes szerződése tartalmazza a type ID-t, schema-t, defaultokat, property registryt, editor renderer-t, public renderer-t, validációt, accessibility követelményeket, adatbindingokat, permissionöket, teszteket és migrációt. Új komponens hozzáadása nem igényelhet minden modulban külön, kézzel írt eltérő implementációt.

## 44. Regisztráció, creator workspace és közösségi felhasználók

A jelenlegi, meglévő admin-hitelesítés nem alakítható át észrevétlenül nyílt regisztrációvá. A regisztráció külön, biztonságosan megtervezett termékfunkció.

### 44.1. Creator regisztráció és első beállítás
- Email-/jelszó vagy jóváhagyott identity provider, email-ellenőrzés, biztonságos bejelentkezés és kijelentkezés.
- Elfelejtett jelszó, session kezelés, fiókzárás, fiók-helyreállítás és szükséges biztonsági értesítések.
- Creator workspace létrehozása, site/brand alapadatok, időzóna, locale, kezdeti template választás, domain és első publikálási útmutató.
- Lépésenkénti onboarding checklist, kihagyható és később folytatható lépésekkel.
- Integrációk csatlakoztatása külön, opcionális lépésként; a platform alapfunkciói nem feltételezhetnek minden szolgáltatóhoz adott engedélyt.
- Seed/demo tartalom egyértelműen jelölt, teljesen eltávolítható és soha nem keverhető össze valódi adatokkal.

### 44.2. Szerepkörök és workspace
- Tulajdonos, admin, editor/designer, content manager, moderator, analyst, shop manager és read-only szerepkörök a termékfázisnak megfelelően.
- Least-privilege, domain/action-szintű permissionök, server-side enforcement és workspace/site scope.
- Meghívás, elfogadás, visszavonás, szerepkörváltás, kiléptetés és tulajdonosváltás naplózott műveletekkel.
- Egy creator több workspace/site-ot is kezelhessen, ha a több-site fázis elkészült; az adat, token, media és domain izoláció kötelező.
- A publikus weboldal látogatói, regisztrált fanok, fizető tagok és creator-admin felhasználók eltérő identitás- és jogosultsági réteget alkotnak.

### 44.3. Fan account és tagság
- Opcionális regisztráció a creator publikus oldalán; a nyilvános tartalom megtekintéséhez ne legyen automatikusan kötelező account.
- Profil, preferenciák, értesítések, kedvencek/követés, komment/poll/event interakciók a megfelelő modulokban.
- Ingyenes és fizetős tagsági szintek, entitlement, lejárat, lemondás, számlázási állapot és hozzáférés-visszavonás.
- A fizetési adatokat és kártyaadatokat jóváhagyott fizetési szolgáltató kezeli; saját rendszer csak a szükséges provider reference és állapot tárolását végzi.
- Adatletöltés/törlés, hozzájárulások, adatmegőrzés és értesítési beállítások.
- Creator által konfigurálható, hogy mely nyilvános interakciók igényelnek regisztrációt, tagságot vagy moderátori jóváhagyást.

## 45. Közös adat-, erőforrás- és eseményarchitektúra

### 45.1. Kanonikus domain és közös storage
A „közös storage” nem egyetlen óriási, strukturálatlan JSON és nem egy közös tábla mindenhez. Közös platform-infrastruktúrát jelent, külön tulajdonolt, típusos domain-adatokkal.

- D1: strukturált rekordok, kapcsolatok, állapotok, jogosultságok, konfigurációk és indexelt metaadatok.
- R2: médiafájlok, generált videók, thumbnail-ek, exportok és nagy objektumok.
- Resource Registry: egységes asset ID, ownership, site/workspace scope, metadata, storage key, checksum, lifecycle és használati hivatkozások.
- Page Model: elrendezés, tartalomkonfiguráció és kanonikus domain rekordokra mutató referenciák; nem tárolhat másolatot a schedule, termék, rendelés, integration vagy membership rekordról.
- Domain-owned storage: Schedule, Content, Product/Order, Membership, Integration, Analytics, Automation és AI job külön szerződés szerint, közös auth/validation/observability infrastruktúrával.
- Secret/token storage: külön védett szerveroldali szerződés, soha nem public Page Modelben, resource metadata-ban vagy kliensoldali konfigurációban.
- Search index, cache és analytics projection újraépíthető származtatott adat; nem válhat a kanonikus adatforrás helyettesítőjévé.

### 45.2. Közös esemény- és szinkronmodell
- Domain event envelope: event ID, tenant/site scope, event type/version, occurred-at, actor/source, correlation ID és idempotency key.
- Retry/backoff, deduplication, dead-letter/failed state, reprocess, sync watermark és last-success jelzés.
- Külső webhook aláírásellenőrzés, replay protection és provider event ID deduplikáció.
- A kapcsolódó modulok eseményre vagy kanonikus API-ra támaszkodnak; nem írnak egymás tábláiba közvetlenül.
- A cache és search index invalidálása explicit; sikertelen feldolgozás látható és újrapróbálható.
- A felhasználói művelet státusza megkülönbözteti a kérés elfogadását a külső szolgáltató által visszaigazolt eredménytől.

### 45.3. Bővíthetőségi szerződések
Új funkció a megfelelő registryn keresztül illeszkedik be: domain/API, admin navigation, permission, event, resource type, template/component, editor property, provider adapter, automation action vagy AI tool. Egy extension nem kap automatikusan korlátlan DB-, hálózati vagy fájlrendszer-hozzáférést. Az extension manifest deklarálja a szükséges capabilityket, schema-verziót, scope-okat, migrációt, költséget, UI-entrypointot és eltávolítási/rollback viselkedést.

## 46. Admin információs architektúra és felhasználói élmény

### 46.1. Kanonikus fő navigáció és modulcsoportok
A 49. fejezet 16 főmodulja a kanonikus, funkció szerint elkülönített Creator Center-menütérkép. Ez a lista határozza meg a fő modulok nevét és felelősségét; a 3. fejezet ezek részletes domain- és almenüfunkcióit írja le. A menü nem jeleníti meg egyszerre az összes belső műveletet: a gyakori feladatok a modul kezdőlapján, a ritkábbak kereshető almenükben jelennek meg.

1. **Dashboard / Áttekintés:** valós státuszok, teendők, gyorsműveletek.
2. **Weboldal és Visual Editor:** oldalak, navigáció, CMS, publikálás, domain és publikus renderer.
3. **Brand Kit és Design Studio:** logók, témák, design tokenek, ikonok, presetek, sablonok és reusable komponensek.
4. **Live és Stream Studio:** live állapot, stream planner, adásrend, ismétlődések, játékprofilok, stream események és adás előtti ellenőrzések.
5. **OBS és stream eszközök:** OBS-kapcsolat, overlayek, widgetek, chatbot és engedélyezett vezérlés.
6. **Kapcsolatok és integrációk:** provider-kapcsolatok, scope-ok, tokenállapot, webhookok és szinkronnapló.
7. **Tartalomkönyvtár és Content Studio:** VOD, klipek, Shorts, tartalomnaptár, publikálási queue és közös média-/erőforráskönyvtár (asset registry, képek, videók, fájlok, ikonok, fontok, licencek, használati helyek).
8. **Közösség és rajongók:** Discord, fan account, posztok, szavazások, moderáció és értesítések.
9. **Bolt, támogatás és bevétel:** termékek, rendelések, digitális hozzáférés, támogatás, tagság és szponzorációs kapcsolódások.
10. **Analitika és növekedés:** forrásmegjelölt metrikák, kampányok, szponzoráció, SEO-teljesítmény és kísérletek.
11. **Automatizációk:** workflow builder, trigger, condition, action, futási előzmények és hibakezelés.
12. **SANCI AI:** AI Control Center, Live Coach, Content Factory, specialisták, jóváhagyások és költség/adatkezelés.
13. **Keresés, súgó és személyre szabás:** globális kereső, command palette, onboarding, mentett nézetek és felhasználói UI-preferenciák.
14. **Beállítások, biztonság és adat:** profil, site, nyelvek, időzóna, jogosultságok, értesítések, export/backup, adatkezelés és diagnosztika.
15. **Fejlesztői központ és bővítmények:** API/SDK, webhook tester, extension registry, marketplace és sandbox; csak a későbbi platformfázisban.
16. **Csapat, több site és SaaS:** workspace, meghívások, szerepek, több creator/site, billing és usage; csak a szükséges tenant-izolációs alapok után.

**Megjelenítési szabály:** a 16 modul a kanonikus funkciótérkép, nem 16 egyforma súlyú, mindig nyitva tartott menücsoport. A felület szerepkör, jogosultság, használati gyakoriság és kezdő/haladó mód szerint rendezheti a hozzáférést, de nem rejthet el jogosultsággal elérhető adatot úgy, hogy az kereséssel vagy dokumentált útvonallal se legyen megtalálható. Mobilon csoportosított, összecsukható navigáció szükséges.

### 46.2. Több helyen látható művelet, egyetlen üzleti logika
Ugyanaz a művelet megjelenhet Dashboardon, Editorban, tartalomkártyán vagy AI-javaslatként, de minden entrypoint ugyanazt a domain command/API-t hívja. A közös action meghatározza a jogosultságot, validációt, státuszátmenetet, idempotenciát, naplózást és hibakezelést. Az entrypoint csak a kontextust és a felhasználói felületet adja.

### 46.3. Könnyű kezelhetőség
- Kezdő és haladó útvonal; alapértelmezett értékek és fokozatosan felfedett haladó beállítások.
- Kereshető menü/command palette, globális keresés, breadcrumbs és következetes elnevezések.
- Kontextusfüggő súgó, minták, preview, undo, visszaállítás és megerősítés kockázatos műveleteknél.
- Egyértelmű empty state „mit tegyek most?” útmutatóval; nincs üres, magyarázat nélküli modul.
- Billentyűzet, screen reader, touch/tablet, reszponzív layout és lokalizáció.
- A Dashboard összefoglalhat, de a domain funkciót mindig a saját modul kezeli.

## 47. Meglévő kód és nyílt forrású komponensek újrahasználata

A gyors fejlesztés elsődleges módja a már működő saját kód, bevált szerződések és megfelelően licencelt, karbantartott nyílt forrású csomagok újrahasználata. Nem írunk újra olyat, ami a projektben már megbízhatóan működik, és nem építünk be csomagot csak azért, mert népszerű.

### 47.1. Kötelező reuse döntés minden új funkciónál
1. Először ellenőrizni kell a meglévő route-okat, domain helper-eket, DB migrationöket, UI-komponenseket, editor commandokat, teszteket és adaptereket.
2. A meglévő implementációt bővítsük, ha a felelőssége helyes és a szerződése tesztelhető.
3. Nyílt forrású csomag csak akkor kerül be, ha érdemi előnyt ad, kompatibilis a Cloudflare Workers/TypeScript környezettel, aktívan karbantartott, megfelelő licencű, méretben és függőségekben elfogadható, és van rá tesztelhető adapter.
4. Új dependency előtt rövid döntés: saját kód / meglévő csomag / új csomag / külső szolgáltatás, indoklás, licenc, biztonság, runtime kompatibilitás, lockfile és frissítési felelősség.
5. Nem másolunk be teljes másik terméket vagy nagy UI-rendszert pusztán a fejlesztés gyorsítása miatt; csak a szükséges, licencelt, elszigetelt és karbantartható részeket használjuk.
6. Külső mintakódot a saját auth, tenant-scope, domain validation, logging és tesztek megkerülése nélkül integrálunk.

### 47.2. Első technikai realitás
A jelenlegi `package.json` minimális függőségi felületet mutat, és a frontend jelentős része natív HTML/CSS/JavaScript; ezért nem feltételezünk automatikusan már telepített nagy frontend frameworköt vagy UI libraryt. A valós kódbázis és bundle-korlátok vizsgálata után modulonként döntünk arról, hogy a meglévő mintát bővítjük vagy célzott könyvtárat vezetünk be. A már működő Worker, D1, R2, Editor command/history és tesztstruktúra megőrzendő.

### 47.3. Benchmark-tanulságok
- StreamElements: vizuális overlay builder, alerts, chatbot/moderáció, custom widget és stream event alapú működés — hivatalos dokumentáció: https://docs.streamelements.com/overlays és https://docs.streamelements.com/chatbot/modules.
- Fourthwall: brandelt shop, merch, tagság, digitális termék, kupon és külső platform-integrációk — https://fourthwall.com/features és https://fourthwall.com/memberships.
- OBS Studio: az OBS WebSocket a 28-as verziótól beépített; távoli vezérlésnél jelszavas védelem kötelező — https://obsproject.com/kb/remote-control-guide.
- TikTok Content Posting API: app approval, scope, creator consent, content preview, posting status és korlátozások szükségesek; nem tekinthető univerzális automatikus publikálási API-nak — https://developers.tiktok.com/docs/en/content-posting-api-get-started és https://developers.tiktok.com/docs/en/content-sharing-guidelines.
- Discord: OAuth scope és bot permission külön kezelendő; botot nem szabad felhasználói önműködő fiókkal helyettesíteni — https://discord.com/developers/docs/topics/oauth2.

Ezekből a termékekből képességmintát és bevált UX-t tanulunk, nem teljes rendszert másolunk. A SANCI9517 saját előnye a közös Brand Kit, a canonical domain/storage, az Editor, a provider-adapterek, a Stream Studio, a shop/community és a SANCI AI összekapcsolása.

## 48. Fejlesztési pontok kiválasztásának szabálya

A következő munka mindig a repository tényleges állapotából indul:
1. Megnézzük az érintett route-ot, domain-szerződést, adatmodellt, UI-t, migrationt és tesztet.
2. Megállapítjuk, mi működik már és mit lehet közvetlenül újrahasználni.
3. Egyetlen, kicsi, felhasználói eredményt célzó fejlesztési pontot választunk.
4. Megírjuk a változtatást és a szükséges teszteket; nem csak dokumentációt frissítünk.
5. Lefuttatjuk a valós repositoryban elérhető releváns teszteket, typechecket és szükséges runtime/acceptance ellenőrzést.
6. Rögzítjük a tényleges eredményt, a még nyitott hibát és a következő függő fejlesztési pontot.
7. Nem állítunk PASS-t vagy készültséget futtatás/ellenőrzés nélkül.

A terv célja az, hogy a fejlesztés végre lépésenként, egyetlen irányadó sorrend szerint haladjon, miközben a teljes bővíthető Creator Platform célja megmarad.

---

## 49. Teljes Creator Center menütérkép — felhasználói funkciók szerint

Ez a menütérkép a végső termék navigációs célját rögzíti, nem azt állítja, hogy minden funkció már elkészült. A menü csoportosítható, kereshető és szerepkör szerint szűrhető; a ritkán használt funkciók nem zsúfolják tele az alapnézetet. A menüpontok ugyanazokat a kanonikus domain szolgáltatásokat használják, nem külön miniappok.

### 49.1. Kezdőlap és napi áttekintés
- **Áttekintés:** élő állapot, következő adás, feladatok, publikálási queue, figyelmeztetések, bevételi és közösségi összefoglaló.
- **Gyors műveletek:** stream indítás előtti ellenőrzőlista, új tartalom, új oldal, új kampány, overlay teszt.
- **Teendők:** sikertelen szinkronok, lejárt kapcsolatok, jóváhagyásra váró AI-módosítások, sikertelen publikálások.
- **Személyre szabás:** átrendezhető dashboard-kártyák, szerepkör szerinti nézetek, widget-beállítások.

### 49.2. Weboldal
**Tulajdonosi határ:** ez a modul a weboldal oldalstruktúráját, tartalmi modelljét, szerkesztését, SEO-ját és publikálását kezeli. Nem a teljes Creator Center funkcióinak gyűjtőhelye.
- **Oldalak:** létrehozás, másolás, archiválás, útvonal/slug, státusz, verzió, hozzáférés, átirányítás.
- **Navigáció:** menük, almenük, mobil menü, footer, breadcrumbs, külső és belső hivatkozások.
- **Visual Editor:** vászon, rétegek, komponensek, inspector, responsive preview, undo/redo, billentyűparancsok, keresés. Az Editor az oldal szerkezetét és a blokkok megjelenítési konfigurációját szerkeszti; nem veszi át a kapcsolatok, adásrend, média, bevétel vagy analitika üzleti kezelését.
- **Tartalom/CMS:** kollekciók, mezők, referenciák, szűrők, keresés, rendezés, ütemezett publikálás, draft/preview.
- **SEO és megosztás:** meta cím/leírás, canonical URL, sitemap, robots, Open Graph, social preview, strukturált adatok, redirectek.
- **Lokalizáció:** nyelvek, fordítási státusz, locale-öröklés és felülírás, lokalizált slug/meta/kép/alt text, RTL, nyelvváltó.
- **Űrlapok és interakciók:** kapcsolat, feliratkozás, leadek, spamvédelem, siker/hiba állapotok, hozzájárulás.
- **Publikálás:** preview, staging, diff, jóváhagyás, publish/unpublish, verzió és rollback, domain és DNS állapot.
- **Külön modulokból elérhető közös képességek:** Brand Kit, témák, design tokenek, ikonok, sablonok, blokkkönyvtár és presetek → **49.3. Márka és designrendszer**; feltöltés, asset-regiszter, média-metaadatok és használati helyek → **49.7. Tartalomstúdió**. Az Editor ezek kiválasztására/használatára adhat felületet, de a kanonikus kezelésük nem ide tartozik.

### 49.3. Márka és designrendszer
- **Brand Kit:** logóváltozatok, színek, betűk, ikonok, grafikai elemek, hangnem, írásmód, tiltott/előnyben részesített megoldások.
- **Brand assetek:** stream overlay, thumbnail, intro/outro, social post, merch design, watermark, email sablon.
- **Közös design tokenek:** globális és komponensszintű értékek, theme-variánsok, kontrasztellenőrzés, sötét/világos mód.
- **Brand consistency:** automatikus ellenőrzés és javítási javaslat weboldalon, videón, képen, poszton és overlayen.
- **Export:** SVG/PNG/WebP és más támogatott formátumok, szín-/méretváltozatok, licenc- és eredetadatok.

### 49.4. Élő adás és Stream Studio
- **Stream Planner:** adásrend, ismétlődő események, game/kategória, cím, leírás, vendégek, emlékeztetők.
- **Live Control Room:** stream állapot, platformonkénti státusz, késleltetett/elavult adat jelzése, eseményfolyam.
- **Multistream:** több célplatform, platformonkénti cím/leírás/kategória, capability-mátrix, előzetes ellenőrzés.
- **Unified Chat:** támogatott platformok üzeneteinek egy nézetben olvasása, válasz, platformonkénti küldési korlát, export.
- **Stream Checklist:** mikrofon/kamera/scene/bitrate/kapcsolat/overlay/alert ellenőrzések, tesztmód és adás előtti próba.
- **Stream notes/markers:** időbélyegek, highlight-jelöltek, jegyzetek, fontos események és későbbi vágási pontok.
- **Stream replay/backup:** rögzítési állapot, lokális felvétel állapota, támogatott tartalék stream, hibaértesítés; a platform/API korlátai szerint.

### 49.5. OBS és stream eszközök
- **OBS kapcsolat:** párosítás, hitelesítés, kapcsolat állapota, engedélyek, reconnect, hibakeresés; jelszó és token soha nem jelenhet meg logban.
- **Scene/source áttekintés:** scene-váltás, source státusz, source visibility, audio mute/volume és egyéb csak támogatott API-műveletek.
- **Overlay Studio:** browser source URL, méret, safe area, canvas, scene-enkénti variáns, teszt/preview, verzió és rollback.
- **Overlay/widget könyvtár:** alert box, event list, chat box, goal/progress bar, timer, countdown, now-playing, recent events, sponsor panel, QR/link panel.
- **Interakciók:** follow/sub/donation/cheer/raid/redeem események, media share, szavazás, wheel, giveaway, loyalty/points, csak megfelelő platform- és szolgáltatói jogosultsággal.
- **Chatbot:** parancsok, aliasok, változók, időzítők, spam- és linkvédelem, moderációs szabályok, shoutout, FAQ és jogosultsági szintek.
- **Automatizált scene/macro:** hotkey, stream deck / Macro Deck / MIDI / HTTP webhook / külső vezérlő adapterek, dry-run, visszajelzés és engedélyezett parancslista.
- **Audio/video segédletek:** hangszint-figyelés, némítás- és clipping-jelzés, scene/source checklist, virtuális kamera/portrait output integráció, ahol elérhető.
- **Plugin- és widget-központ:** telepített/engedélyezett bővítmények, kompatibilitás, verzió, permission scope, aláírás/eredet, frissítés, eltávolítás és sandbox.
- **Fontos határ:** a webes platform nem feltételezi, hogy minden OBS plugin böngészőből vezérelhető. Elsődleges a dokumentált OBS WebSocket/browser source; natív plugin vagy desktop companion külön, biztonsági és telepítési döntéssel készül.

### 49.6. Kapcsolatok és integrációk
- **Kapcsolatok:** Twitch, YouTube, TikTok, Discord, Kick és további provider-adapterek.
- **Fiókállapot:** connect/disconnect, scope, lejárat, újracsatlakozás, account/channel választás, jogosultságok.
- **Provider-képességek:** olvasás/írás/publikálás/chat/analitika külön jelölése; nem támogatott műveletet a UI nem ígérhet.
- **Webhookok és események:** aláírás-ellenőrzés, replay-védelem, deduplikáció, retry, dead-letter és diagnosztika.
- **Integrációs napló:** utolsó siker, utolsó hiba, rate limit, API-kvóta, szinkron és helyreállítás.
- **Későbbi bővítések:** email, naptár, felhőtárhely, fizetés, affiliate, CRM, streaming hardware és automatizációs szolgáltatók.

### 49.7. Tartalomstúdió
- **Tartalomkönyvtár:** videó, VOD, clip, Short/Reel, kép, hang, podcast, stream replay, szöveg és kampányanyag.
- **Szerkesztés:** timeline, vágás, trim, crop, aspect ratio, reframing, scene, B-roll, átmenet, hang, szín és brand overlay.
- **Felirat és transcript:** beszédfelismerés, speaker/fejezet, időzítés, felirat-stílus, fordítás, SRT/VTT és szerkeszthető szöveg.
- **AI clip finder:** highlight-javaslatok, kontextus és időbélyeg, chat/stream események összekapcsolása, manuális kiválasztás.
- **Thumbnail és grafika:** sablonok, variánsok, cím-/képkombinációk, platformonkénti méretek és preview.
- **Platformverziók:** hossz, képarány, cím, leírás, hashtag, thumbnail és CTA csatornánként.
- **Tartalomnaptár:** ötlet → draft → review → scheduled → published/failed, kampány és ismétlődő sorozat.
- **Közzététel:** közvetlen API-publikálás, ha engedélyezett; különben export és kézi publikálási útmutató.
- **Média- és jogkezelés:** felhasználási jog, zene, vendég-hozzájárulás, lejárat, forrás és eltávolítási kérés.

### 49.8. Közösség és rajongók
- **Fan account:** regisztráció, bejelentkezés, profil, preferenciák, adatletöltés/törlés és biztonsági beállítások.
- **Közösségi aktivitás:** kommentek, reakciók, szavazások, kérdések, beküldések, közösségi posztok.
- **Tagság:** szintek, jogosultságok, exkluzív tartalom, előnyök, megújítás, lemondás és tagsági státusz.
- **Közösségi jutalmak:** jelvények, mérföldkövek, hűségpontok, kihívások és giveaway-szabályok.
- **Discord összekötés:** szerepkiosztás és visszavonás tagsági státusz alapján, botengedélyekkel és naplóval.
- **Moderáció:** szabályok, report queue, tiltás/korlátozás, fellebbezés, spamvédelem, AI-javaslat és emberi felülvizsgálat.

### 49.9. Bolt, bevétel és üzlet
- **Bolt:** fizikai termék, merch, digitális letöltés, csomag, variáns, készlet, ár, adó/szállítási szabályok.
- **Rendelések:** fizetési státusz, teljesítés, szállítás, visszatérítés, lemondás, számlázási integráció és ügyfélszolgálat.
- **Támogatás:** egyszeri támogatás, recurring support, célok, kampányok, köszönőoldal/üzenet.
- **Szponzoráció:** media kit, ajánlat, kampány, deliverable, határidő, link/kód, eredményriport.
- **Affiliate és kupon:** partnerlinkek, kuponkódok, jutalék és konverzió, ahol jogszerű és mérhető.
- **Digitális hozzáférés:** vásárlás utáni biztonságos letöltés, hozzáférés-visszavonás és visszatérítéshez kötött jogosultság.
- **Pénzügyi áttekintés:** bevételi források elkülönítése, platformdíjak, visszatérítések és export; nem helyettesít könyvelőt/adótanácsadót.

### 49.10. Analitika és növekedés
- **Összesített dashboard:** platformonkénti nézettség, követők, engagement, streamidő, tartalomtípus és bevétel.
- **Adatminőség:** forrás, utolsó frissítés, becslés/valós adat, hiányzó és nem összehasonlítható metrikák jelzése.
- **Tartalomelemzés:** videó/clip összehasonlítás, megtartás és elérhető watch-time, publikálási idők, tesztelt variánsok.
- **Célok és kísérletek:** célkitűzés, mérföldkő, kísérlet, eredmény és következő javaslat.
- **SEO/AEO és webanalitika:** keresési láthatóság, oldalmegtekintés, konverzió, kampány-UTM, adatvédelmi beállítások.
- **Export és jelentés:** CSV/JSON, időszakos riport, forrásmegjelölés és csapatnak megosztható összefoglaló.

### 49.11. Automatizációk
- **Workflow builder:** trigger → feltétel → művelet → eredmény/hibaág; vizuális építés és sablonok.
- **Triggerek:** stream online/offline, új follower/sub/event, tartalom státusz, időpont, rendelés, tagság, webhook és kézi indítás.
- **Akciók:** értesítés, draft készítés, címke, export, engedélyezett overlay/OBS művelet, publikálási előkészítés.
- **Biztonsági korlátok:** dry-run, idempotency, rate limit, jóváhagyás, retry, rollback és futási napló.
- **Hibakezelés:** időtúllépés, leállítás, újrapróbálás, hibás workflow karantén, értesítés és manuális helyreállítás.

### 49.12. SANCI AI
- **AI Control Center:** modell/provider, költségkeret, kvóta, adatforrás, retention, memória, engedélyek és leállító kapcsoló.
- **AI chat és projektkontextus:** weboldal, brand, stream, tartalom, közösség és célok kontextusa jogosultság szerint.
- **Website Designer:** oldal/szekció/komponens létrehozás, design és responsive javítás, SEO/accessibility ellenőrzés.
- **Live Coach:** opt-in stream-/chat-/OBS-adatokból technikai figyelés, pillanatjelölés, javaslat és bizonytalanság jelzése.
- **Content Producer:** transcript, clip, vágás, felirat, fordítás, thumbnail, leírás, platformvariáns és export.
- **Community Assistant:** kérdések összegzése, moderációs javaslat, FAQ és tagsági/Discord művelet-előkészítés.
- **Business Analyst:** tartalom- és kampányteljesítmény, trendek, hipotézisek és mérhető kísérletek.
- **Automation Builder:** természetes nyelvből workflow draft, szimuláció, diff és jóváhagyás.
- **Multi-agent feladatok:** specialista feladatok összehangolása közös kontextussal, költségkorláttal és nyomon követhető eredménnyel.
- **Action safety:** az AI minden változtatást a domain API-n keresztül készít elő; kockázat szerint preview, diff, jóváhagyás, végrehajtás és rollback.

### 49.13. Keresés, súgó és személyre szabás
- **Globális kereső:** oldalak, media assetek, tartalmak, termékek, kapcsolatok, workflow-k, beállítások.
- **Command palette:** billentyűzetes műveletindítás, gyors navigáció és legutóbbi elemek.
- **Súgó:** kontextuális útmutató, interaktív onboarding, fogalomtár, hibaelhárítás és dokumentált API-korlátok.
- **Mentett nézetek:** szűrők, oszlopok, listanézetek, dashboard elrendezések és felhasználói preferenciák.
- **Értesítések:** in-app/email/push, kategória, prioritás, csendes időszak, digest és leiratkozás.

### 49.14. Beállítások, biztonság és adat
- **Profil és workspace:** nyelv, időzóna, dátum/pénznem, preferenciák, site/domain és márka.
- **Felhasználók és jogosultságok:** owner/admin/editor/moderator/analyst/commerce szerepek, modulonkénti és műveletenkénti engedély.
- **Biztonság:** session, eszközök, jelszó/SSO későbbi támogatása, 2FA, rate limiting, secret rotation és gyanús aktivitás.
- **Adatkezelés:** export, törlés, retention, consent, cookie/adatvédelmi beállítások, adatfeldolgozók.
- **Biztonsági mentés:** konfiguráció és tartalom export, visszaállítási próba, verziózott backup és disaster recovery.
- **Állapot és naplók:** health, background job, queue, API-kvóta, hibák, események, auditálható adminműveletek.
- **Díjcsomag és használat:** későbbi SaaS-plan, usage, billing, limit, számla és szolgáltatói költség.

### 49.15. Fejlesztői és bővítményközpont — későbbi platformfázis
- **Extension registry:** manifest, verzió, scope, permission, kompatibilitás, aláírás/eredet, frissítés és eltávolítás.
- **Integrációs SDK/API:** dokumentált endpointok, webhooks, OAuth adapterek, sandbox és rate limit.
- **Widget/overlay SDK:** saját komponensek, konfigurációs séma, preview, események és verziózás.
- **Template/component marketplace:** sablonok, komponensek, overlayek és workflow-k; licenc, szerző, értékelés és frissítés.
- **Developer tools:** API kulcsok, webhook tester, eseménynapló, sandbox workspace és API dokumentáció.
- **Külső bővítmények:** alapértelmezésben legkisebb jogosultság, izolált futtatás, felülvizsgálat és visszavonható hozzáférés.

### 49.16. Csapat, több site és SaaS — későbbi fázis
- Több creator/site/workspace kezelése egy fiókból, egyértelmű aktív workspace választással.
- Meghívás, csapattagok, szerepek, projekt- és ügyfélhozzáférés, jóváhagyási folyamat.
- Agency/studio mód több creatorhoz, közös sablonok és ügyfél-specifikus brand.
- Előfizetés, csomagok, usage/kvóta, billing, számlázás, lemondás és adat-export.
- Tenant-izoláció, migráció, adatrezidencia és skálázási stratégia; csak az egyfelhasználós alapok stabilizálása után.

---

## 50. Keresztmodulú, kötelező termékképességek

Ezek nem különálló menük: minden érintett modul közös követelményei.

1. **Többnyelvűség és nemzetköziesítés:** Admin és publikus web külön nyelve; locale-aware tartalom, dátum/időzóna/pénznem/számformátum; RTL; fordítási memória/szószedet; AI-fordítás emberi felülvizsgálattal; lokalizált SEO, Open Graph, alt text és URL; nyelvenkénti fallback.
2. **Akadálymentesség:** WCAG 2.2 AA cél; billentyűzet, fókusz, screen reader, kontraszt, reduced motion, felirat/átirat, érthető hibák, nagyítás és touch célterület.
3. **Reszponzivitás:** mobil, tablet, desktop, széles canvas és portrait/landscape; valódi mobil szerkesztési folyamat, nem csak összenyomott desktop.
4. **Megbízhatóság:** autosave státusz, offline/gyenge kapcsolat jelzése, konfliktusfeloldás, idempotens műveletek, retry, background job státusz és adatvesztés elleni védelem.
5. **Visszaállíthatóság:** undo/redo, verzióelőzmény, diff, restore, export/backup és törlés előtti függőségi ellenőrzés.
6. **Adat- és jogosultsági konzisztencia:** közös domain command, szerveroldali authorization, tenant/site scope, érzékeny adatok redakciója és követhető műveletnapló.
7. **Kereshetőség és felfedezhetőség:** globális keresés, modulon belüli keresés, szűrés, rendezés, címkék, kedvencek, recent items és üres állapotokból induló útmutatás.
8. **Értesítések:** egységes notification center, kategória, súlyosság, preferencia, digest és csendes időszak; ne legyen duplikált vagy félrevezető értesítés.
9. **Adatvédelem és tartalmi jogok:** consent, retention, export/delete, vendég-hozzájárulás, copyright, zenei licencek, személyes adatok és AI-feldolgozás szabályai.
10. **Teljesítmény és üzemeltetés:** Core Web Vitals, cache, image optimization, queue/worker limitek, observability, költség- és kvótafigyelés, backup/restore próba.
11. **Import/export és hordozhatóság:** oldal/content/media/brand/workflow export, CSV/JSON és támogatott szabványos formátumok; külső szolgáltatóhoz kötöttség csökkentése.
12. **Tesztelhetőség:** domain unit/integration, API authorization, migration, UI interaction, responsive/accessibility, end-to-end és éles smoke tesztek.
13. **AI átláthatóság:** generált tartalom jelölése, forrás és bizonytalanság, modell- és költséginformáció, jóváhagyás, módosítási diff és felhasználói visszajelzés.
14. **Felhasználóbarát hibaállapotok:** emberi nyelvű magyarázat, teendő, újrapróbálás és support/export lehetőség; technikai részletek a diagnosztikában maradnak.

---

## 51. Külső termékekből vizsgálandó funkcióminták

Az alábbiak kutatási alapok, nem automatikus implementációs döntések. A fejlesztés előtt az aktuális hivatalos dokumentációt, licenceket, API-korlátokat, biztonságot és kompatibilitást ellenőrizni kell.

- **OBS Studio:** scenes/sources, frontend API, plugin API, Python/Lua scripting, browser sources és WebSocket-vezérlés. Forrás: https://docs.obsproject.com/ és https://obsproject.com/kb/remote-control-guide.
- **Streamlabs:** alert box, chat box, event list, goals, tip jar, loyalty, media share, hotkeys, collab/dual output és widget témák. Forrás: https://support.streamlabs.com/hc/en-us/articles/14698267028379-New-to-Streamlabs-Start-Here és https://streamlabs.com/stream-widgets.
- **StreamElements:** overlay builder, custom widgets, alerts, chatbot commands/variables/timers/spam filters. Forrás: https://docs.streamelements.com/.
- **Restream:** többplatformos stream, unified chat, platformonkénti capability, analytics, replay/transcript és tartalék stream. Forrás: https://restream.io/live/multistreaming és https://support.restream.io/en/articles/2379624-what-is-restream-chat.
- **Webflow:** vizuális canvas, shared components/libraries, CMS, interakciók, staging/publishing, locale-onkénti tartalom és SEO. Forrás: https://webflow.com/feature/cms és https://help.webflow.com/hc/en-us/articles/33961240752147-Webflow-Localize-overview.
- **Framer:** AI segítségével létrehozott CMS-collectionök, draft/publish, lokalizáció, locale-onkénti meta és RTL. Forrás: https://www.framer.com/cms/ és https://www.framer.com/help/localization/.
- **Elementor:** kereshető widget-panel, globális widgetek, responsive beállítások, globális brand settings és theme builder. Forrás: https://developers.elementor.com/docs/editor/widgets-panel.html és https://elementor.com/products/website-builder/.
- **Descript:** transcript-alapú vágás, filler-word eltávolítás, zajjavítás, felirat, AI co-editor, remote recording és klipkészítés. Forrás: https://www.descript.com/features.
- **Fourthwall:** saját márkájú shop, tagsági szintek, digitális tartalom, tagsági analitika, Discord-integráció, kuponok és merchandise. Forrás: https://fourthwall.com/features és https://fourthwall.com/memberships.
- **Twitch Developer Platform:** EventSub, chat, extensions, API, authentication és platformonkénti engedélyek. Forrás: https://dev.twitch.tv/docs/ és https://dev.twitch.tv/docs/eventsub/.
- **W3C/WCAG:** akadálymentességi kritériumok és lokalizáció. Forrás: https://www.w3.org/WAI/standards-guidelines/wcag/.

### 51.1. A SANCI platform megkülönböztető értéke
Nem az a cél, hogy minden külső termék teljes másolata készüljön el. A cél az, hogy a creator egy közös Brand Kit, kanonikus adatok, Visual Editor, OBS/Stream Studio, tartalomgyártás, integrációk, közösség, commerce, automatizáció és AI segítségével egy összefüggő munkafolyamatot kapjon. A külső termékben talált jó funkció csak akkor kerül át, ha valódi felhasználói problémát old meg, jogszerűen megvalósítható és fenntartható.

---

## 52. Menütérkép felülvizsgálata a felhasználóval

A 49. fejezet a teljes javasolt menütérkép és funkciókatalógus. Ez az áttekintés nem lezárás: a felhasználói visszajelzés alapján új funkciót a megfelelő menüpont alá kell illeszteni, majd a kanonikus domain-, adat-, jogosultság-, teszt- és fázisleírást is frissíteni kell. Azonos képességet nem szabad párhuzamos menüben másik implementációként létrehozni.

A visszajelzés feldolgozási szabályai:
- **Kell:** bekerül a megfelelő menübe és a részletes funkciókatalógusba.
- **Máshova kell:** a felelősség szerinti modulba kerül, az eredeti helyről hivatkozással.
- **Nem kell:** csak explicit termékdöntéssel hagyható el; meg kell vizsgálni, érint-e más funkciót.
- **Később kell:** a teljes termékcél része marad, függőségekkel és fázissal.
- **Nem megvalósítható közvetlenül:** adapter, exportos alternatíva vagy korlátozás dokumentálása szükséges.
- A menü nem azonos a fázissal: egy későbbi fázis funkciója már most is szerepelhet a végleges menütérképen.



---

## 53. Külső platformok összehasonlító elemzése és SANCI-döntések

**Cél:** a külső szolgáltatások ismert képességeiből követelményeket vezetünk le. Ez funkcionális benchmark, nem teljes körű jogi, biztonsági vagy API-audit, és nem állítja, hogy bármely felsorolt képesség már megvalósult a SANCI rendszerben.

### 53.1. Weboldalépítők: Webflow, Framer, Elementor

**Megfigyelt minták**
- Vizuális canvas, drag-and-drop, elem-/widget-könyvtár, rétegek/navigátor és kontextusfüggő tulajdonságok.
- Újrahasználható komponensek, globális stílusok/tokens, sablonok, dinamikus CMS-gyűjtemények és mezőkapcsolatok.
- Reszponzív breakpointok, előnézet, draft/staging és külön publikálás.
- Lokalizált tartalom, képek/alt szövegek, locale-specifikus SEO és közösségi metaadatok.
- AI-segítség a létrehozásban, de a szerkesztőnek továbbra is átlátható, kézzel javítható struktúrát kell adnia.

**SANCI-követelmény**
- Valódi Visual Editor: Element Library + Canvas + Layers/Outline + Inspector + breakpoint-váltó + preview.
- Egy Property Registry és egy Page Model; nincs párhuzamos régi szerkesztő.
- Külön fogalom legyen a site template, page template, section template, reusable component, symbol/instance és design token.
- A globális változtatás előtt mutassuk meg az érintett komponenseket; legyen diff és visszaállítás.
- A CMS/dinamikus blokkok kanonikus domainrekordokat jelenítsenek meg, ne másolják azokat a Page Modelbe.
- Lokalizáció locale-onkénti tartalom-, kép-, alt-text-, slug-, SEO- és Open Graph-értékekkel.

**Ne másoljuk át:** egy teljes külső builder belső architektúráját vagy annak licencelt komponenseit. A funkcionális mintát és a használhatósági elvet vesszük át.

### 53.2. OBS, Streamlabs, StreamElements és Stream Deck

**Megfigyelt minták**
- OBS scene/source vezérlés és állapot; WebSocket-alapú külső vezérlés.
- Browser source-ra épülő overlayek és widgetek; alert, event list, chat, célmérő, timer, címke és egyedi widget.
- Chatbot parancsok, változók, időzítők, spamvédelem, moderáció és interaktív modulok.
- Eseményfüggő alert-variánsok, hangeffektek, vizuális témák, hotkeyek és külső vezérlők.

**SANCI-követelmény**
- Külön OBS/Stream Tools modul; párosítás, kapcsolatdiagnosztika, scene/source állapot, csak támogatott vezérlési műveletek.
- Overlay Studio külön vászonnal, safe area-val, méret-/pozíciókezeléssel, browser-source URL-lel, előnézettel és verziózással.
- Widgetkönyvtár: alerts, event list, chat, goals, countdown/timer, now playing, sponsor panel, QR/link panel, poll, giveaway, viewer queue.
- Eseményszabályok: eseménytípus + feltétel + widget/akció + cooldown + teszt + napló.
- Chatbot: parancsok, aliasok, role/permission, változók, timer, spam/link filter, shoutout, FAQ, quote/counter és moderátori kontroll.
- Macro/shortcut/Stream Deck/MIDI/HTTP-webhook adapterek engedélyezett műveletlistával, dry-run-nal és visszajelzéssel.
- A weboldal ne állítsa, hogy közvetlenül irányít bármely OBS plugint. A dokumentált OBS WebSocket és browser source az alap; natív plugin vagy desktop companion külön projekt- és biztonsági döntés.

**Kritikus biztonsági döntés:** az OBS vezérlő ne legyen nyitott internetes végpont. A kapcsolatot hitelesíteni kell, a titkot védeni kell, veszélyes műveleteket pedig jogosultsághoz és explicit jóváhagyáshoz kell kötni.

### 53.3. Multistream és közös chat: Restream és hasonló szolgáltatások

**Megfigyelt minták**
- Több célplatform egy adásból, platformonkénti cím/leírás és célállapot.
- Egyesített chat és közös streamirányító felület.
- Analitika, felvétel/visszajátszás és tartalék stream, ha a szolgáltatás és a csomag támogatja.

**SANCI-követelmény**
- Platformonkénti capability-mátrix: streamelés, chat olvasás/írás, események, publikálás, analitika, jogosultság és limit.
- Multistream csak igazolt technikai útvonalon: külső szolgáltató adapterrel vagy későbbi, külön infrastruktúrával. A Cloudflare Worker önmagában nem videótranszkóder vagy RTMP-relay.
- Unified Chatban minden üzenethez forrásplatform, idő, author, moderációs státusz és küldési lehetőség jelölése.
- A válasz csak akkor küldhető ki, ha a platform és az engedélyezett scope támogatja; platformonkénti hibák és részleges siker látszódjanak.
- A tartalék stream/felvétel legyen opcionális, költség- és adatmegőrzési szabályokkal.

### 53.4. Tartalomgyártás: Descript és Canva

**Megfigyelt minták**
- Transcript-alapú videó-/hangvágás, automatikus átirat és felirat, zajcsökkentés, kiemelés- és klipjavaslat.
- Többrétegű timeline, sablonok, képarány-átalakítás, feliratstílusok, thumbnail/grafika és platformhoz igazított export.
- AI-műveletek természetes nyelvű instrukcióval, de visszavonható vagy ellenőrizhető eredménnyel.

**SANCI-követelmény**
- Tartalomkönyvtár és média-nyilvántartás; VOD/clip/Short/Reel/post/audio/podcast/campaign asset.
- Transcript, időbélyeg, speaker/fejezet, SRT/VTT, fordítás és kézzel javítható felirat.
- Highlight-kereső, amely időbélyeget, okot és forráseseményt ad; az AI-javaslat nem publikál automatikusan.
- Első vágóeszközök: trim, split, crop/reframe, képarány, felirat, hangszint, egyszerű átmenet, brand overlay, export preset.
- Komplex renderelésnél külön feldolgozó infrastruktúra/szolgáltató kell; a Worker nem hosszú videórenderelő.
- Minden generált fájlhoz forrás, licencek, generálási státusz, verzió és felhasználási jogok.

### 53.5. Monetizáció és közösség: Fourthwall, Patreon

**Megfigyelt minták**
- Többféle tagsági szint, havi/éves előfizetés, tagsági előnyök és exkluzív tartalom.
- Fizikai és digitális termékek, kuponok, promóciók, támogatás, termék- és tagsági analitika.
- Rajongói profilok, posztok, kommentek, pollok, csoportos chat/DM és Discord-szerepkapcsolás.

**SANCI-követelmény**
- Saját közösségi/fan fiók elkülönített jogosultsági és adatvédelmi határral.
- Termék-, rendelés-, payment-, entitlement- és tagság-domain külön; a vásárlás/tagság ad jogosultságot, nem a kliens által küldött állapot.
- Fizikai termék, digitális letöltés, bundle, kupon, támogatás, tagsági szint, exkluzív tartalom és Discord-role mapping.
- Fizetéshez külső, erre alkalmas szolgáltató és webhook-ellenőrzés kell; kártyaadatot a SANCI nem tárol.
- Refund, lemondás, sikertelen megújítás és chargeback következetesen frissítse a jogosultságot.
- Rajongói közösség nem válhat az Admin belső felületévé; külön publikus/member UI és moderációs felület szükséges.

### 53.6. Integrációs platformok: Zapier, Buffer és Hootsuite

**Megfigyelt minták**
- Trigger → feltétel → akció workflow, újrapróbálás, futási előzmény és külső webhook.
- Központi tartalomnaptár, csatornánként testreszabott poszt, időzítés, draft/approval és teljesítményadat.
- Közösségi említések/trendek figyelése és riportálás, ahol az API és a szolgáltatási hozzáférés ezt lehetővé teszi.

**SANCI-követelmény**
- Visual Workflow Builder: trigger, condition, action, branch, delay, approval, retry, timeout, dry-run, run log, disable és rollback/compensation ahol lehetséges.
- Triggerként csak hitelesített, deduplikált esemény; minden futás kapjon azonosítót.
- Tartalomnaptár csatornánkénti változattal, időzónával, preview-val, státuszokkal, jóváhagyással és sikertelen publikálás utáni újrapróbálással.
- A közvetlen publikálás szolgáltatónkénti képesség- és app-review-függő; ahol nincs engedély, export/kézi publikálási útvonal szükséges.
- Social listening és trendfigyelés csak jogszerű, ténylegesen elérhető API-adatból; ne ígérjünk teljes internetes megfigyelést.

### 53.7. Platform API-k: Twitch, YouTube, TikTok, Discord és Kick

**Kötelező szabály:** a szolgáltatónevek nem egyenértékű képességeket jelentenek. Minden adapterhez dokumentált capability-nyilvántartás szükséges, amely tartalmazza: olvasás, írás, publikálás, live/chat, analytics, webhook/event, engedély/scope, kvóta, review, region/account restrictions és fallback.

- **Twitch:** OAuth, EventSub, chat, live státusz, adásrend, elérhető videó/clip/analitika. Scope-minimalizálás, tokenvédelem és webhook-/WebSocket-kezelés szükséges.
- **YouTube:** csatorna, videó/playlist, live broadcast, feltöltés, metaadat és elérhető analitika. API-kvóta, OAuth, feltöltési állapot és projekt-ellenőrzési követelmények kezelendők.
- **TikTok:** profil és videó megjelenítése; Content Posting API külön engedélyezési és domain-/app-feltételekkel. A közvetlen publikálást és a draft-feltöltést külön képességként kell kezelni.
- **Discord:** OAuth, bot, guild/channel/role, webhook, események és tagság-jogosultság; minimális botjogosultság és szerveroldali ellenőrzés szükséges.
- **Kick:** csak a mindenkori hivatalos API és hozzáférési feltételek által igazolt funkciók. Hiányzó API-képességet nem szabad szimulálni.

### 53.8. Megkülönböztető SANCI-érték

A platform ereje nem az, hogy mindenből legyen egy gyengébb másolat. A közös munkafolyamat a lényeg:
1. Egy Brand Kit szolgálja a weboldalt, overlayt, thumbnailt, posztot és terméket.
2. Egy tartalomrekord kapcsolja össze a VOD-ot, klipet, publikálási tervet, fordításokat és analitikát.
3. Egy adásrend táplálja a weboldalt, Dashboardot, emlékeztetőt és tartalomtervezést.
4. Egy jogosultsági/entitlement domain kapcsolja össze a vásárlást, tagságot, exkluzív tartalmat és Discord-szerepet.
5. Az automatizáció és az AI ugyanazokat a hitelesített domainműveleteket hívja, mint a kézi Admin.
6. Minden külső adatnál látszik a forrás, frissesség, jogosultság és hiba.
7. Minden kockázatos AI-/automatizációs műveletnél van preview, diff, jóváhagyás és napló.

---

## 54. Teljes, felülvizsgálatra szánt SANCI9517 funkciókatalógus

Ez a lista a végső termékcél funkcionális ellenőrzőlistája. Nem jelenti, hogy minden elem az első kiadásba kerül, vagy hogy már implementált. A fázis a megvalósítás sorrendjét szabja meg, nem töröl funkciót a végső célból.

### 54.1. Admin alapélmény és Dashboard
- [ ] Egységes Admin shell, oldalsáv, almenük, breadcrumbs, mobil navigáció.
- [ ] Áttekintő kártyák: weboldal, live, adásrend, kapcsolatok, tartalom, feladatok.
- [ ] Gyorsműveletek és legutóbbi aktivitás.
- [ ] Teendők, figyelmeztetések, hibák és elakadt folyamatok.
- [ ] Globális kereső, command palette, kedvencek, legutóbbi elemek.
- [ ] Kontextuális súgó, onboarding, üres állapotok és emberi nyelvű hibák.
- [ ] Értesítési központ, prioritások, digest és csendes időszak.
- [ ] Valós adatfrissesség, loading/empty/error/stale/partial állapot.

### 54.2. Saját weboldal és Visual Editor
- [ ] Oldal CRUD, hierarchia, slug, átnevezés, duplikálás, archiválás és törlés.
- [ ] Navigáció, dropdown/nested menü, footer, mobilmenü, belső/külső link.
- [ ] Egyetlen Visual Editor: elemkönyvtár, canvas, Layers/Outline, Inspector.
- [ ] Drag/drop, kijelölés, átrendezés, csoportosítás, duplicate, törlés, zoom/pan.
- [ ] Undo/redo, mentési állapot, konfliktusfeloldás, revision history és restore.
- [ ] Szöveg, heading, kép, videó/embed, gomb, link, ikon, lista, kártya, űrlap, divider, spacer, grid/flex/section/container.
- [ ] Dinamikus SANCI blokkok: live, következő stream, adásrend, játékprofil, videó/clip feed, social links, termék, tagság, támogatás és közösségi CTA.
- [ ] Desktop/tablet/mobile preview, breakpointonkénti override, öröklés és portrait/landscape.
- [ ] Globális design tokens: színek, fontok, tipográfia, spacing, border, radius, shadow, layout.
- [ ] Site/page/section/component sablonok, reusable komponensek, instance/override/detach, verziózás és rollback.
- [ ] Előnézet, draft, validálás, publikálás, visszavonás és publikált snapshot megőrzése.
- [ ] SEO: title, description, canonical, robots, Open Graph, social image, sitemap, robots.txt, structured data, redirect, 404.
- [ ] Domain/DNS/HTTPS státusz, favicon, brand assets, coming-soon/maintenance.
- [ ] Űrlapok, validáció, spamvédelem, adatkezelési hozzájárulás és beküldés-kezelés.
- [ ] Webes teljesítmény, képméretezés, lazy loading, cache és Core Web Vitals.

### 54.3. Brand Kit és Design Studio
- [ ] Logóvariánsok, színek, betűcsaládok, ikonstílus, vizuális szabályok.
- [ ] Overlay, thumbnail, intro/outro, watermark, social post, merch és email sablonok.
- [ ] Brand-safe színek/fontok és kontrasztellenőrzés.
- [ ] Globális és komponensszintű tokenek, theme-változatok és dark/light.
- [ ] SVG/PNG/WebP és megfelelő exportméretek.
- [ ] Licenc, forrás, tulajdonos, verzió és asset-használati helyek.
- [ ] Brand consistency ellenőrzés, AI-javaslat és kézi jóváhagyás.

### 54.4. Média- és erőforráskönyvtár
- [ ] Egy asset registry és asset ID, R2 bináris tárolással, D1 metaadattal.
- [ ] Képek, videók, hangok, ikonok, fontok, dokumentumok, thumbnailök és exportok.
- [ ] Egyenkénti/tömeges feltöltés, progress, cancel, retry és megszakadt feltöltés helyreállítása.
- [ ] MIME-/méretellenőrzés, feldolgozási státusz, preview/thumbnail és biztonsági ellenőrzés.
- [ ] Címke, keresés, gyűjtemény, alt text, licenc, forrás és crop/focal point.
- [ ] Használati helyek, függőségi figyelmeztetés és biztonságos archiválás/törlés.
- [ ] Metaadatmódosítások megjelenése minden hivatkozási helyen.

### 54.5. Kapcsolatok és integrációk
- [ ] Integrációs központ: Twitch, YouTube, TikTok, Discord, Kick és későbbi szolgáltatók.
- [ ] Connect/disconnect/reconnect, fiók-/csatornaválasztás, scope és lejárat.
- [ ] Tokenfrissítés, revoke, titkos tárolás, CSRF/state és site ownership.
- [ ] Capability/scope mátrix, API-kvóta, provider health és diagnosztika.
- [ ] Webhook aláírásellenőrzés, replay-védelem, deduplikáció, retry és dead-letter.
- [ ] Szinkronnapló, utolsó siker/hiba, kézi újraszinkron és konfliktusfeloldás.
- [ ] Későbbi email, naptár, fizetés, affiliate, CRM és cloud-storage adapterek.
- [ ] Nem támogatott funkció egyértelmű jelölése és alternatív folyamat.

### 54.6. Live, Stream Studio és adásrend
- [ ] Live/offline állapot és adatfrissesség platformonként.
- [ ] Cím, kategória/játék, kezdés, nézőszám és elérhető streammetrikák.
- [ ] Stream player/embed és offline fallback.
- [ ] Egyetlen adásrend-domain: események, ismétlődések, időzóna, ütközések.
- [ ] Draft/scheduled/confirmed/postponed/cancelled/completed állapot.
- [ ] Twitch/YouTube sync, irány/prioritás, konfliktuskezelés és szinkronelőzmény.
- [ ] Játékprofilok, kapcsolódó tartalom, publikus naptár, countdown és későbbi iCal.
- [ ] Stream előtti checklist, technikai próba, jegyzetek, markerek és highlight-pontok.
- [ ] Multistream célok és platformonkénti metadata csak igazolt capability szerint.
- [ ] Unified Chat, platformjelölés, moderációs státusz, küldési engedély és részleges hiba.
- [ ] Felvétel/backup/replay csak tényleges technikai lehetőség és tisztázott tárolási költség mellett.

### 54.7. OBS, overlayek, chatbot és stream-eszközök
- [ ] OBS-párosítás, hitelesítés, kapcsolatstátusz, reconnect és diagnosztika.
- [ ] Scene/source lista, állapot, scene-váltás, visibility, audio mute/volume a támogatott műveletek szerint.
- [ ] Overlay Studio, browser source, canvas, safe area, méret, pozíció, scene-variáns.
- [ ] Alert box és eseményvariánsok follow/sub/gift/cheer/raid/tip/purchase eseményekre, ha elérhetők.
- [ ] Event list, chat box, goal/progress, countdown/timer, now-playing, sponsor/QR/link widget.
- [ ] Poll, giveaway, loyalty/points, viewer queue és media request csak jogosultsággal és szabályokkal.
- [ ] Widgetteszt, preview, verziózás, rollback és megosztható overlay URL.
- [ ] Chatbot parancsok, aliasok, változók, timerek, quote/counter, shoutout és FAQ.
- [ ] Spam/linkvédelem, slow/follower/sub-only policy ahol a platform engedi, moderációs napló.
- [ ] Hotkey, Stream Deck/Macro Deck/MIDI/webhook adapter, allowlist, dry-run és végrehajtási eredmény.
- [ ] Plugin/widget registry, verzió, kompatibilitás, permission, eredet, frissítés és eltávolítás.
- [ ] Natív OBS plugin vagy desktop companion csak külön, dokumentált biztonsági tervvel.

### 54.8. Tartalomkönyvtár és Content Studio
- [ ] VOD, clip, highlight, long-form, Short/Reel, post, image, audio, podcast és replay.
- [ ] Közös content ID, platform ID, cím, leírás, thumbnail, időtartam, URL, státusz és jogadat.
- [ ] Keresés, szűrés, rendezés, bulk action, duplikáció-észlelés és gyűjtemények.
- [ ] Tartalomnaptár és státuszfolyam: idea/draft/review/ready/scheduled/publishing/published/failed.
- [ ] Transcript, időbélyeg, speaker/fejezet, felirat, SRT/VTT, fordítás és export.
- [ ] AI highlight/clip-javaslat forrás-időbélyeggel, indoklással és emberi választással.
- [ ] Videóvágás: trim/split/crop/reframe/aspect ratio, felirat, hang, átmenet és brand overlay.
- [ ] Thumbnail/grafika-sablon, variánsok, platformméretek és preview.
- [ ] Platformonkénti cím, leírás, hashtag, CTA, képarány és publikálási státusz.
- [ ] API-publikálás ahol engedélyezett; egyébként export és kézi közzétételi útmutató.
- [ ] Zene-/videójog, vendéghozzájárulás, lejárat, forrás és eltávolítási kérés.
- [ ] Tartalomból weboldali feed, social poszt és analitika ugyanazon canonical rekord alapján.

### 54.9. Közösség és rajongói fiókok
- [ ] Publikus fan regisztráció/bejelentkezés, profil, preferencia, adatletöltés/törlés.
- [ ] Posztok, kommentek, reakciók, pollok, kérdések, beküldések és események.
- [ ] Követés, értesítés, jelvény, mérföldkő, kihívás és közösségi jutalom.
- [ ] Tagsági szintek, exkluzív poszt/video/audio, member-only stream és archívum.
- [ ] Discord szerver/csatorna/role mapping entitlement alapján.
- [ ] Moderációs queue, report, appeal, korlátozás/tiltás, spamvédelem és audit.
- [ ] AI moderációs javaslat, bizonytalanság és emberi felülvizsgálat.
- [ ] Public/member-only/private hozzáférés szerveroldali ellenőrzése.
- [ ] Közösségi szabályzat, adatvédelmi és korhatár-/tartalmi szabályok.

### 54.10. Bolt, támogatás és bevétel
- [ ] Fizikai termék, merch, digitális termék, bundle, limited drop és preorder.
- [ ] Variánsok, SKU, ár/pénznem, készlet, kategória, kollekció, media és SEO.
- [ ] Terméklista, termékoldal, keresés, kosár, checkout-integráció és rendelés-visszaigazolás.
- [ ] Rendelésállapot, fizetés, teljesítés, tracking, cancel, refund és support.
- [ ] Kupon, ajándékkártya, promóció, kampány, bundle és lejárat.
- [ ] Biztonságos digitális delivery, entitlement és visszavonás refund/chargeback esetén.
- [ ] Egyszeri támogatás, visszatérő támogatás, célmérő és köszönőüzenet.
- [ ] Tagsági előnyök, kedvezmények, termékdrop és tagság–Discord összekapcsolás.
- [ ] Szponzorációs media kit, ajánlat, deliverable, határidő, kampánylink és riport.
- [ ] Affiliate link/kód, jutalék és konverzió csak mérhető/jogszerű keretben.
- [ ] Bevételi források, platformdíjak, refundok és export; nem könyvelési/adótanácsadási helyettesítő.
- [ ] Fizetési, adózási, számlázási, fogyasztóvédelmi és GDPR-követelmények ellenőrzése.

### 54.11. Analitika és növekedés
- [ ] Platformonkénti követő-/nézettség-/engagement-/streamidő-mutatók, ha elérhetők.
- [ ] Tartalom- és csatorna-összehasonlítás, trendek, időszakok és célok.
- [ ] Adatforrás, időbélyeg, frissesség, becsült/valós adat és hiányzó metrika jelzése.
- [ ] Webanalitika, UTM, konverzió, SEO és publikált oldalak teljesítménye.
- [ ] Thumbnail/cím/időzítés kísérletek és mérhető eredmények, ha elég adat áll rendelkezésre.
- [ ] Kampány-/szponzorriport, CSV/JSON export és időszakos jelentés.
- [ ] AI-elemzés hipotézisekkel, forrással és bizonytalansággal; nem garantált növekedési ígéret.

### 54.12. Automatizációk és workflow-k
- [ ] Vizuális trigger → condition → action → branch modell.
- [ ] Triggerek: stream, platformesemény, schedule, tartalom, rendelés, tagság, webhook, időzítés.
- [ ] Akciók: értesítés, draft, címke, export, overlay/OBS parancs, publikálási előkészítés.
- [ ] Sablonok, verziózás, aktiválás/leállítás és jogosultság.
- [ ] Dry-run, preview, jóváhagyás, idempotency, rate limit, retry, timeout és napló.
- [ ] Sikertelen ág, karantén, értesítés, kézi helyreállítás és rollback/kompenzáció.
- [ ] AI-ból létrehozott workflow először draft/szimuláció; csak jóváhagyás után éles.

### 54.13. SANCI AI és multimodális asszisztensek
- [ ] AI Control Center: provider/model, költségkeret, kvóta, retention, adatforrás és stop switch.
- [ ] Projekt-/brandkontextus jogosultsággal és megtekinthető forrásokkal.
- [ ] Website Designer: oldal/komponens/dizájn/responsive/SEO/accessibility javaslat.
- [ ] Live Coach: opt-in technikai jelzések, pillanatjelölés és stream-/chat-összegzés.
- [ ] Content Producer: transcript, clip, felirat, fordítás, thumbnail, cím és platformvariáns.
- [ ] Community Assistant: FAQ, összegzés, moderációs javaslat és tagsági művelet-előkészítés.
- [ ] Business Analyst: tartalom/kampány elemzés, hipotézis, mérhető teszt.
- [ ] Automation Builder: természetes nyelvből workflow-draft, szimuláció és diff.
- [ ] Kép-/grafika-/hang-/videógenerálás megfelelő külső modellel/szolgáltatóval, licenc- és költségkorláttal.
- [ ] AI-művelet domain API-n át; kockázati szint, preview, jóváhagyás, napló és visszaállítás.
- [ ] Generált tartalom jelölése, forrás és bizonytalanság, felhasználói visszajelzés.
- [ ] Manuális, AI nélküli út minden alapvető termékfolyamathoz.

### 54.14. Többnyelvűség és nemzetközi használat
- [ ] Admin és publikus web külön nyelvi beállítással.
- [ ] Magyar elsődleges nyelv, további nyelvek fokozatos bevezetése.
- [ ] Locale-onkénti oldal-/CMS-tartalom, menü, média, alt text, SEO és Open Graph.
- [ ] Lokalizált slug/URL, hreflang/canonical szabályok és nyelvi fallback.
- [ ] Dátum/idő/pénznem/szám lokalizáció, időzóna és nyári időszámítás.
- [ ] RTL layout, billentyűzet, font fallback és hosszabb fordítások tesztje.
- [ ] Fordítási memória/szószedet és AI-fordítás emberi jóváhagyással.
- [ ] Nyelvváltó, automatikus nyelvajánlás és felhasználói választás megőrzése.

### 54.15. Beállítások, biztonság, adatvédelem és megbízhatóság
- [ ] Profil, site/workspace, locale, timezone, dátum/pénznem és preferenciák.
- [ ] Szerepek: owner/admin/editor/moderator/analyst/commerce és modulonkénti engedély.
- [ ] Szerveroldali authorization, site/tenant izoláció és minimális jogosultság.
- [ ] Session, 2FA/SSO később, secret rotation, rate limit és gyanús aktivitás.
- [ ] Titok/token/payment adat redakció; titkosított token storage.
- [ ] Consent, cookie/privacy, retention, export/delete és adatfeldolgozók.
- [ ] Backup, restore próba, verziózott mentés, import/export és disaster recovery.
- [ ] Health, job queue, webhook, API-quota, error log és audit log.
- [ ] Idempotencia, retry, timeout, cache invalidation, stale-data és partial-failure kezelés.
- [ ] Undo/redo, revision diff, restore és törlés előtti függőségi vizsgálat.
- [ ] WCAG 2.2 AA cél, reduced motion, screen reader, kontraszt, fókusz és touch target.
- [ ] Mobil/tablet/desktop, gyenge hálózat, offline-jelzés és adatvesztés elleni védelem.
- [ ] Tesztek: domain, integration, authorization, migration, UI, accessibility, responsive, E2E és smoke.

### 54.16. Fejlesztői platform, bővítmények, csapat és SaaS
- [ ] Dokumentált API, webhook registry, API-key kezelés, tesztelő és sandbox.
- [ ] Extension/widget/overlay manifest, schema, permission, verzió és kompatibilitás.
- [ ] Eredet/licenc/aláírás, sandbox, felülvizsgálat, frissítés, eltávolítás és visszavonás.
- [ ] Template/component/overlay/workflow marketplace későbbi fázisban.
- [ ] Több site/workspace, aktív workspace választó, csapatmeghívás és szerepek.
- [ ] Agency/studio mód, ügyfélhozzáférés, közös sablonok és jóváhagyás.
- [ ] Későbbi SaaS billing, csomag, használati limit, számla, lemondás és adat-export.
- [ ] Tenant izoláció, migráció, skálázás, adatrezidencia és költségfelügyelet.

---

## 55. A teljes funkciólista értékelési szabályai

A felhasználói áttekintéskor minden egyes funkciót az alábbi döntések egyikével kell ellátni:
- **Kell az első használható kiadásba:** szükséges a teljes alapmunkafolyamathoz.
- **Kell, de későbbi fázisban:** a végső termék része, de függősége van.
- **Opcionális/integrációfüggő:** szolgáltatói API, hozzáférés, költség vagy technikai lehetőség határozza meg.
- **Nem kell:** csak explicit döntés után távolítható el a végső célból.
- **Másik modulba tartozik:** a felelősség szerinti egyetlen modulhoz kerül, a többi hely hivatkozik rá.

A megvalósítás sorrendjét a meglévő, működő kód, a felhasználói élmény, a biztonság és a függőségek alapján kell meghatározni. Minden képességhez később hozzá kell rendelni: canonical domain, adatmodell, API/command, jogosultság, UI-hely, külső függőség, teszt, státusz és elfogadási feltétel. A funkcióterv nem helyettesíti a kód és az éles működés igazolását.


---

## 56. Közös sablon-, ikon-, preset- és teljes személyre szabási rendszer

**Alapelv:** a SANCI9517-et a készítője saját brandjével is használhassa, de egy új felhasználó is teljesen a sajátjává alakíthassa. Ne legyen kötelező SANCI-logó, színvilág, előre eldöntött elrendezés vagy egyetlen munkamód. A közös infrastruktúra egységes; a felhasználó által látott megjelenés és a választható munkafolyamat testreszabható.

### 56.1. Közös design system és témarendszer
- [ ] Központi design tokenek: színek, fontok, tipográfiai skála, térközök, rácsok, szélességek, border, radius, shadow, elevation, animáció és fókuszstílus.
- [ ] Több theme-változat: világos, sötét, automatikus rendszerkövető, nagy kontrasztú és felhasználó által létrehozott témák.
- [ ] Teljes theme editor: színpaletta, háttér, felület, szöveg, állapotok, linkek, gombok, mezők, grafikonok és overlay-színek szerkesztése.
- [ ] Témaváltozatok mentése, duplikálása, átnevezése, exportja/importja, előnézete és visszaállítása.
- [ ] Token-szintű öröklés: alap-téma → workspace/site téma → oldal/komponens override; feloldás/override-törlés egyértelmű művelettel.
- [ ] Kontraszt- és olvashatósági ellenőrzés; hibás kombinációra javaslat, de ne írja felül csendben a felhasználó döntését.
- [ ] Fontfeltöltés és fontlicenc nyilvántartás; biztonságos formátum- és fájlméret-ellenőrzés.
- [ ] A téma a weboldalon, Adminban, overlayeken, widgeteken, tartalomsablonokon és későbbi storefronton ott alkalmazható, ahol értelmes; külön felületek külön theme scope-ot kaphatnak.
- [ ] Téma importálásakor verzió-/kompatibilitásellenőrzés, ismeretlen tokenek kezelése és ütközés előnézete.

### 56.2. Saját márka és white-label használat
- [ ] Első indítási Brand Setup Wizard: márkanév, creator-/cégnév, rövid leírás, logó, favicon, profilkép, borítókép, fő színek, fontok, nyelv és időzóna.
- [ ] Saját logó feltöltése több változattal: teljes logó, ikon/jel, világos/sötét háttérhez való variáns, monokróm, favicon és social avatar.
- [ ] Saját domain és aldomain; DNS/HTTPS ellenőrzés és domainenkénti site beállítás, ahol a hosting modell támogatja.
- [ ] Saját márkanevek, szövegek, linkek, közösségi fiókok, CTA-k, footer, email-sablonok és megosztási kép.
- [ ] SANCI-brand megjelenítése konfigurálható legyen ott, ahol technikailag/jogilag eltávolítható; platformos biztonsági, jogi és szolgáltatói jelzéseket nem lehet megtévesztő módon elrejteni.
- [ ] Saját favikon, böngészőcím, metaadat, OG-kép, loading/empty/error állapotok és felhasználói értesítések brandelése.
- [ ] Brand Kit export/import és teljes brand preset, amely a témát, logókat, fontokat, ikonstílust és használati szabályokat együtt viheti át.
- [ ] Több márka/site egy workspace-ben későbbi fázisban, külön brand- és domainhatárokkal.
- [ ] Új felhasználónak semmit nem kell kézzel nulláról építenie: választhat sablont/presetet, majd minden elem módosítható.

### 56.3. Közös ikonrendszer
- [ ] Egyetlen kanonikus Icon Registry és Icon Picker az egész termékben.
- [ ] Kategóriák: navigáció, szerkesztés, média, streaming, platformok, közösség, bevétel, analitika, AI, állapotok, műveletek és akadálymentesség.
- [ ] Egységes ikonméret-, stroke-, kitöltés- és igazítási szabályok; opcionális outline/solid/duotone stílusok, ha az ikonforrás licenc és vizuális minőség szerint támogatja.
- [ ] Keresés név, kulcsszó, kategória és szinonima alapján; billentyűzetes navigáció és akadálymentes címkék.
- [ ] Saját SVG ikon importálása ellenőrzött SVG-szabályokkal; ne engedjünk futtatható/veszélyes SVG-tartalmat.
- [ ] Egyedi ikonok elnevezése, címkézése, cseréje, archiválása, exportja és workspace/site scope-ja.
- [ ] Az ikon választása minden támogatott helyen ugyanazt az Icon Picker komponenst használja: Admin, Visual Editor, gombok, menük, overlayek és widgetek.
- [ ] Ikonfallback és migráció, ha egy régi preset ikonja megszűnik; ne jelenjen meg üres/hibás jelölő.
- [ ] Ikon használati helyeinek keresése és biztonságos cseréje.

### 56.4. Közös sablonrendszer
- [ ] Egy Template Registry, stabil azonosítóval, verzióval, kompatibilitással, kategóriával, címkékkel, előnézeti képpel és licenc/eredet mezővel.
- [ ] Sablontípusok: teljes weboldal, oldal, szekció, komponens, navigáció, dashboard layout, stream overlay, widget, alert, chatbot parancscsomag, workflow, content post, thumbnail, video preset, email, termékoldal, közösségi oldal és Brand Kit.
- [ ] Sablon használat előtti preview és kipróbálás; ne írja felül a meglévő adatokat előzetes diff/figyelmeztetés nélkül.
- [ ] Sablon létrehozása meglévő felhasználói tartalomból, megosztás, duplikálás, átnevezés, export/import, archiválás és verziózás.
- [ ] Sablonfrissítési stratégia: eredeti követése, helyi másolat, kiválasztott módosítások átvétele; ne vesszen el a személyre szabás.
- [ ] Sablonok jelölése: hivatalos, közösségi, saját, importált, ellenőrzött, kompatibilitási problémás.
- [ ] Külső sablonhoz licenc, attribúció és felhasználási feltételek tárolása; más termék sablonjának/assetjének jogosulatlan másolása tilos.
- [ ] Keresés és szűrés cél, stílus, platform, nyelv, képarány, kategória, kompatibilitás és akadálymentesség szerint.
- [ ] Marketplace később; elsőként lokális/saját sablonkönyvtár és biztonságos import/export.

### 56.5. Preset rendszer – ne legyen összekeverve a sablonnal
- [ ] **Preset:** egy adott funkció gyors konfigurációja, pl. overlay méret/színek/animáció, export beállítás, editor layout, chatbot válaszkészlet vagy workflow-induló beállítás.
- [ ] **Template:** teljesebb kiinduló szerkezet/tartalom, amelyet a felhasználó tovább alakít.
- [ ] **Theme:** a vizuális megjelenés tokenjeinek és szabályainak csomagja.
- [ ] **Brand Kit:** a márkaelemek, logók, fontok, assetek és használati szabályok csomagja.
- [ ] **Component:** újrahasználható működő UI-/oldalelem; **icon** egy vizuális jel; **workflow** végrehajtható lépésekből álló folyamat.
- [ ] Preset mentése aktuális beállításból, alkalmazás, duplikálás, diff, visszaállítás, import/export és kompatibilitási jelölés.
- [ ] Preset-könyvtár kategóriánként: Visual Editor, responsive, overlay, alerts, chatbot, streaming, content export, subtitle, thumbnail, analytics, automation, AI, accessibility és performance.
- [ ] Preset paraméterezhető változókkal és validációval; a felhasználó alkalmazás előtt látja, mit fog módosítani.
- [ ] Preset nem tartalmazhat éles titkot, access tokent, privát URL-t vagy más workspace személyes adatát.
- [ ] Preset verzióváltásakor megmaradjon a korábban alkalmazott beállítás; legyen migráció vagy kézi javítási út.

### 56.6. Teljes személyre szabás – a platform legyen mindenkié
- [ ] Modulok és navigáció személyre szabása: sorrend, kedvencek, elrejtés/megmutatás és szerepkör szerinti láthatóság; kritikus biztonsági menük jogosultság alapján maradnak védettek.
- [ ] Dashboard widgetek hozzáadása/eltávolítása/átrendezése, mentett nézetek és több dashboard preset.
- [ ] Szerkesztői layout: panelek mérete, elhelyezése, dock/undock ahol támogatott, billentyűparancsok és compact/comfortable sűrűség.
- [ ] Oldal- és komponensszintű vizuális override-ok, öröklés és „visszaállítás a témára”.
- [ ] Saját gyorsműveletek, kedvencek, parancspaletta és workflow-indítók.
- [ ] Felhasználói preferenciák és workspace/site alapértelmezések külön kezelése.
- [ ] Minden felhasználói override megőrzése frissítéskor; frissítés nem nullázhatja le csendben a beállításokat.
- [ ] Kezdő/haladó mód: az alapélmény ne legyen túlzsúfolt, de a fejlett funkciók ne vesszenek el.
- [ ] Visszafordítható beállítások, élő preview, visszaállítás, exportálható profil és könnyű „reset to defaults”.
- [ ] Mobilon a fontos beállítások kezelhetők legyenek; az összetett szerkesztő reszponzív kezelőfelületet vagy célzott mobilmódot kapjon.

### 56.7. Onboarding és kezdőélmény
- [ ] Célválasztó: streamer, videókészítő, podcaster, közösségépítő, zenész, oktató, kisvállalkozás/brand vagy vegyes használat.
- [ ] A választás csak kezdőajánlásokat módosít; semmilyen funkciót nem töröl a rendszerből.
- [ ] Induló csomag: brand preset + weboldalsablon + dashboard layout + releváns integrációk + ajánlott workflow-k.
- [ ] Importálható saját brand/logó/szín és meglévő tartalom; később platformimport, ahol API engedi.
- [ ] Lépésenkénti ellenőrzőlista, haladásmentés, kihagyás és későbbi folytatás.
- [ ] Demóadatok és safe preview egyértelmű jelöléssel; demó soha ne keveredjen éles adatokkal.
- [ ] Kezdő mód mellett „haladó eszközök megjelenítése” lehetőség.
- [ ] Segítség és dokumentáció kontextushoz kötve; ne csak egy hosszú, egyszeri útmutató legyen.

### 56.8. Megosztás, import/export és biztonság
- [ ] Brand Kit, theme, icon pack, template, preset, editor layout és workflow export/import.
- [ ] Verzió, schema, kompatibilitás, dependency és licencek az exportcsomagban.
- [ ] Import előnézet: létrejövő/módosuló elemek, ütközések, hiányzó assetek és ismeretlen mezők.
- [ ] Import előtt validáció és méretkorlát; sikertelen import ne hagyjon félkész adatot.
- [ ] Megosztáskor a titkok, személyes adatok és privát tartalmak alapértelmezésben kimaradnak.
- [ ] Nyilvános megosztási link visszavonható; jogosultság, lejárat és hozzáférési napló opcionális.
- [ ] Harmadik féltől importált sablon/ikon/widget csak biztonsági, licenc- és kompatibilitási ellenőrzés után aktiválható.

### 56.9. Elfogadási kritériumok
A rendszer akkor tekinthető megfelelően személyre szabhatónak, ha:
1. Új felhasználó választhat teljes induló presetet, majd minden nem biztonságkritikus elemet módosíthat.
2. Saját logót, színeket, fontokat, témát, ikonkészletet és domaint tud beállítani az adott hosting-/csomagképességek szerint.
3. Ugyanaz a téma/brand konzisztensen használható a támogatott webes, szerkesztői és streames felületeken.
4. A sablonok, ikonok és presetek központi regiszterből, verzióval és kompatibilitással működnek.
5. Egy preset vagy sablon alkalmazása előtt látszik a változás, és van helyreállítás.
6. Frissítés nem írja felül csendben a felhasználó saját beállításait.
7. A kezdő egyszerű élményt kap, a haladó felhasználó pedig eléri a mély testreszabást.
8. Az export/import licencet, biztonságot és személyes adatokat figyelembe véve működik.


---

## 57. Személyre szabhatósági architektúra: közös rendszer, saját identitás

Ez a fejezet a 56. fejezet szabályait pontosítja. A személyre szabás nem különálló, egymástól független beállítások gyűjteménye, hanem közös, verziózott és rétegezett konfigurációs rendszer.

### 57.1. Kanonikus erőforrás-típusok és határok
- [ ] **Design tokens/theme:** vizuális alapértékek és téma-variánsok.
- [ ] **Brand Kit:** logó, márkanév, színek, betűk, márkaeszközök és használati szabályok.
- [ ] **Icon Registry/Icon Pack:** ikonazonosítók, kategóriák, keresési címkék, stílusok és licenc.
- [ ] **Component Registry:** működő, újrahasználható UI-/Visual Editor komponensek, sémák, variánsok és instance properties.
- [ ] **Template Registry:** oldalak, szekciók, widget-összeállítások, dashboardok, overlayek, posztok és más tartalmi kiinduló struktúrák.
- [ ] **Preset Registry:** egy funkció beállításcsomagja, például export, overlay, chatbot, workflow vagy editor layout.
- [ ] **Workspace/User Preferences:** személyes munkafelület és preferenciák; nem módosítják automatikusan más felhasználók nézetét.
- [ ] **Site Configuration:** egy adott webhely domainje, publikus arculata, nyelvei és publikálási beállításai.
- [ ] **Extension Registry:** külső bővítmény manifestje, engedélyei, verziója, eredete és kompatibilitása.
- [ ] Az erőforrások stabil ID-t, owner/scope mezőt, verziót, sémát, létrehozási/frissítési adatot és életciklus-státuszt kapnak; a megjelenített név nem azonosító.

### 57.2. Hatókör és öröklési sorrend
- [ ] Legyen egy dokumentált konfigurációs feloldási sorrend, például: rendszer alapértéke → hivatalos preset/theme → workspace/site konfiguráció → oldal/komponens override → személyes UI-preferencia ott, ahol releváns.
- [ ] Az öröklés típusonként szabályozott legyen: a személyes Admin-sűrűség ne írja felül a publikus weboldal témáját; egy site logója ne változtassa meg egy másik site arculatát.
- [ ] Minden beállításnál látszódjon, hogy örökölt, helyileg beállított vagy felülírt érték-e.
- [ ] Legyen egy kattintásos „visszaállítás az örökölt értékre” és „visszaállítás alapértékre”, egyértelmű különbséggel.
- [ ] Több site/workspace esetén minden erőforrás a megfelelő scope-hoz kötődjön; a másik site adata nem szivároghat át.

### 57.3. Sablonfrissítés és felhasználói változtatások megőrzése
- [ ] A sablon/preset alkalmazása hozzon létre változás-előnézetet: új, módosított, eltávolított és ütköző elemek.
- [ ] A felhasználói változtatás és a sablon eredeti értéke külön követhető legyen.
- [ ] Frissítéskor legyen „minden elfogadása”, „kiválasztott módosítások”, „kihagyás” és konfliktusonkénti feloldás, ahol a struktúra ezt lehetővé teszi.
- [ ] Ha automatikus merge nem biztonságos, ne találgasson a rendszer: álljon meg, őrizze meg a meglévő állapotot és kérjen döntést.
- [ ] Törlés vagy schema-váltás előtt függőségi vizsgálat és mentés szükséges.
- [ ] A verzióváltás visszafordítható, naplózott és tesztelhető legyen.

### 57.4. Központi kereső és választó
- [ ] Egy egységes keresési élményben legyenek elérhetők a sablonok, presetek, ikonok, komponensek, témák és Brand Kitek, megfelelő szűrőkkel.
- [ ] Az adott szerkesztési kontextus csak releváns elemeket emeljen ki, de a teljes könyvtár kereshető maradjon.
- [ ] Minden elemhez előnézet, leírás, szerző/eredet, verzió, kompatibilitás, licenc és használati hely tartozzon.
- [ ] Legyen „saját”, „workspace”, „hivatalos” és később „közösségi/marketplace” könyvtár.
- [ ] A könyvtár ne terhelje túl az alapfelületet: kezdő nézetben ajánlott elemek, haladó nézetben részletes metaadatok és paraméterek.

### 57.5. Saját arculat és platformfüggetlen identitás
- [ ] A felhasználó ne legyen rákényszerítve a SANCI márkanévre a saját publikus weboldalán, overlayein, közösségi tartalmain vagy saját exportjain ott, ahol a termékfeltételek ezt megengedik.
- [ ] A SANCI saját belső Admin- és rendszerfelületei, valamint a felhasználó publikus brandje külön konfigurációs scope-ot kapnak.
- [ ] Legyen saját logó-/favicon-/social-avatar készlet, betűk, színpaletta, háttér, mozgásstílus, ikonstílus, gombstílus és hangulatpreset.
- [ ] A rendszernek legyen semleges, minimális márkájú induló megjelenése, amit a felhasználó saját márkájára alakíthat.
- [ ] White-label csak a technikai és üzleti feltételek szerint ígérhető; a szolgáltatói/jogi/security jelölések és harmadik fél kötelező attribúciói nem rejthetők el megtévesztően.

### 57.6. Egyediség a funkciókban, nem csak a színekben
- [ ] A felhasználó választhasson különböző navigációs modellek, oldalelrendezések, widget-kombinációk, tartalmi struktúrák és munkafolyamatok közül.
- [ ] A komponensek ne csak színezhetők legyenek: legyenek szerkeszthető tulajdonságaik, variánsaik, slotjaik és adatkapcsolataik.
- [ ] Legyen „gyors személyre szabás” (logó, színek, font, sablon) és „teljes testreszabás” (komponens-, layout-, adatmegjelenítési és workflow-beállítások).
- [ ] Egyedi CSS/JS vagy külső kód csak későbbi, explicit engedélyezési/sandbox terv mellett; ne kerülje meg a jogosultságokat, CSP-t vagy biztonsági határokat.
- [ ] A teljes személyre szabhatóság nem jelentheti a szerveroldali auth, adatvalidáció, audit, fizetési szabályok vagy adatvédelmi korlátok kikapcsolását.

### 57.7. Validáció és elfogadási tesztek
- [ ] Egy új felhasználó induló sablonból saját logós, saját témájú weboldalt és stream-asseteket tud készíteni anélkül, hogy a rendszer kódját módosítaná.
- [ ] A téma vagy Brand Kit változtatása minden hozzárendelt, támogatott helyen következetesen jelenik meg.
- [ ] A felhasználó által felülírt értékek egy hivatalos sablonfrissítés után megmaradnak.
- [ ] Egy site témájának/logójának módosítása nem érint más site-ot vagy másik felhasználót.
- [ ] Egy importált csomag nem tud titkot/hozzáférési tokent exportálni vagy szerveroldali jogosultságot megváltoztatni.
- [ ] Ismeretlen/hibás ikon vagy komponens helyén értelmes fallback és javítási lehetőség látszik.
- [ ] A teljes könyvtár billentyűzettel, képernyőolvasóval és mobil nézetben is használható a támogatott feladatokhoz.


---

## 58. Biztonság, adatvédelem és jogosultságok alapból

A személyre szabhatóság nem gyengítheti a biztonsági határokat; a platform személyes adatokat, médiát, integrációs tokeneket és később bevételi adatokat is kezelhet.

### 58.1. Identitás és hozzáférés
- [ ] Külön identitás és scope a felhasználói fióknak, workspace-nek, site-nak, publikus látogatónak és szolgáltatói adminnak.
- [ ] Indokolt szerepkörök: tulajdonos, admin, szerkesztő, tartalomkezelő, moderátor, elemző és csak olvasó; csak a szükséges szerepek kerüljenek az adott kiadásba.
- [ ] Szerveroldali jogosultság-ellenőrzés minden műveletnél és erőforrásnál; a rejtett UI-elem nem hozzáférés-védelem.
- [ ] Legkisebb szükséges jogosultság, visszavonható meghívók, lejáró megosztási linkek és biztonságos munkamenet-kezelés.
- [ ] Integrációs tokenek biztonságos tárolása, maszkolása, scope-korlátozása és visszavonása; titok nem kerülhet logba, exportba vagy kliensoldali payloadba.
- [ ] Külső szolgáltatói kapcsolat csak a jóváhagyott engedélyekhez adjon hozzáférést; egy integráció nem jelenthet általános hozzáférést a felhasználó minden adatához.

### 58.2. Audit és biztonsági események
- [ ] Naplózni kell a lényeges bejelentkezési, jogosultsági, integrációs, publikálási, exportálási, törlési és konfigurációs eseményeket.
- [ ] A napló rögzítse, ki, mikor, mely scope-ban, milyen műveletet végzett és mi lett az eredmény; titkokat és szükségtelen személyes adatot ne tároljon.
- [ ] Legyenek korrelálható hibajelzések, rate limit és visszaélésészlelési alapok.
- [ ] A hibaválasz ne fedjen fel belső stack trace-t, tokent, SQL-részletet vagy érzékeny rendszeradatot.
- [ ] A felhasználó számára érthető biztonsági események és aktív integrációk áttekintése legyen elérhető.

### 58.3. Feltöltés, import és bővítmények
- [ ] Fájloknál típus-, tartalom-, méret- és jogosultság-ellenőrzés; a fájlnév és MIME-header önmagában nem megbízható.
- [ ] Importcsomagok és külső bővítmények validálása, méretkorlát, függőségi ellenőrzés és hiba esetén atomikus visszagörgetés.
- [ ] Ismeretlen vagy aktív tartalom ne futhasson automatikusan; egyedi kód csak későbbi sandbox, explicit engedély és szűk képességek mellett.
- [ ] Minden publikus adat és felhasználói bemenet nem megbízható forrás; XSS, CSRF, jogosultság-megkerülés és adatok közötti szivárgás ellen tervezni és tesztelni kell.
- [ ] A biztonsági tesztek a többfelhasználós és több-site-os határokat is vizsgálják.

---

## 59. Megbízhatóság, mentés, visszaállítás és működtetés

A mentés nem tekinthető bizonyítottnak, amíg a visszaállítást nem teszteltük.

### 59.1. Adatok és helyreállítás
- [ ] Külön kezelendő a strukturált adat, a bináris média, a konfiguráció, a titok és a regenerálható gyorsítótár.
- [ ] Dokumentált mentési gyakoriság, megőrzési idő, felelős, valamint a valós képességekhez igazított RPO/RTO-cél.
- [ ] Visszaállítási próba külön környezetben és ellenőrzött adatintegritással; a „backup sikeres” üzenet önmagában nem elég.
- [ ] Felhasználói export és szolgáltatói katasztrófa-helyreállítás külön folyamat.
- [ ] Törlés előtt figyelmeztetés, függőségi áttekintés és ahol indokolt helyreállítási időablak; a jogi/adatvédelmi törlési kötelezettség ettől független.
- [ ] Migrációknál előzetes ellenőrzés, mentés és ahol lehetséges visszagörgetési terv szükséges.

### 59.2. Üzemeltetés és hibakezelés
- [ ] Egységes health/readiness ellenőrzések, strukturált hibák, korrelációs azonosítók és adatvédelmi szempontból biztonságos logolás.
- [ ] Követni kell a kritikus API-k hibaarányát, késleltetését, kvótáit, külső szolgáltatói hibáit és a tárhely-/feldolgozási fogyasztást.
- [ ] Érthető állapotok: mentve, mentés folyamatban, publikálva, szinkronizálás alatt, sikertelen és újrapróbálható.
- [ ] Kezelni kell a hálózati megszakítást, lejárt tokent, kvótakorlátot, duplikált webhookot, részleges importot és sikertelen publikálást.
- [ ] Idempotencia és deduplikáció szükséges ott, ahol az ismétlés dupla posztot, eseményt, fizetést vagy adatot okozhat.
- [ ] Kritikus rendszerekhez üzemeltetési runbook és incidenskezelési eljárás szükséges.

### 59.3. Teljesítmény és költség
- [ ] A publikus weboldal és a Creator Center teljesítménycéljai külön legyenek meghatározva.
- [ ] Médiaoptimalizálás, képméretek, lazy loading, cache-szabályok és mobil hálózat figyelembevétele.
- [ ] Külső API-, AI-, médiafeldolgozási és tárolási költségek mérhetők legyenek; költségkeret és figyelmeztetés nélkül ne induljon végtelen vagy meglepően drága automatizmus.
- [ ] Kvóták, háttérfeladat-sorok, újrapróbálási szabályok és túlterhelés esetén érthető, korlátozott működés.
- [ ] Minden teljesítmény- és költségállítást mérés igazoljon, ne feltételezés.

---

## 60. Hozzáférhetőség, mobilhasználat és lokalizáció

A vizuális szerkesztő és a személyre szabás akkor is használható maradjon, ha valaki billentyűzettel, képernyőolvasóval, nagyítással vagy kis kijelzőn dolgozik.

### 60.1. Hozzáférhetőség
- [ ] Cél a WCAG 2.2 AA követelményeinek figyelembevétele és ellenőrzése; megfelelőség nem állítható tesztelés nélkül.
- [ ] Billentyűzetes navigáció, látható fókusz, megfelelő kontraszt, szemantikus címsorok, címkézett vezérlők és érthető hibaüzenetek.
- [ ] Csökkentett mozgás preferencia; animációk és mozgó effektek kikapcsolása vagy mérséklése.
- [ ] A szín önmagában ne közvetítsen státuszt; ikonokhoz és nem szöveges vezérlőkhöz hozzáférhető név szükséges.
- [ ] Visual Editor: réteglista, fókuszkezelés, drag-and-drop alternatívák és billentyűzetes átrendezés.
- [ ] A publikus oldalakhoz hozzáférhetőségi ellenőrző és javítási javaslat; automatikus tökéletességet nem szabad ígérni.

### 60.2. Mobil és adaptív élmény
- [ ] A publikus weboldalak mobil-first és reszponzív módon készüljenek; különböző töréspontokon előnézet legyen.
- [ ] Az Admin és a Visual Editor összetett műveletei kapjanak célzott mobilkezelést; ne csak az asztali felület zsugorított változata legyen.
- [ ] Érintési célok, görgetés, modális ablakok és keskeny nézetek tesztelése.
- [ ] Lassú hálózat és kisebb teljesítményű eszköz esetén a legfontosabb feladatok maradjanak használhatók.

### 60.3. Nyelv, formátum és tartalom
- [ ] Magyar az elsődleges nyelv, de a felületi szövegek legyenek központilag fordíthatók, ne szétszórt kódliterálok.
- [ ] Külön kezelendő a felület nyelve, a publikus tartalom nyelve, a csatorna nyelve, a fordítás és az AI-kimenet nyelve.
- [ ] Dátum, időzóna, szám, pénznem, többes szám és időpont lokalizált legyen; az ütemezésben a helyi idő és UTC ne keveredjen.
- [ ] Fordítási hiány, fallback nyelv és fordítási státusz legyen felismerhető.
- [ ] Többnyelvű SEO (hreflang, canonical, metaadatok és oldalkapcsolatok) csak ellenőrzött konfigurációval publikálható.

---

## 61. Termékcsomagok, korlátok és későbbi többfelhasználós szolgáltatás

A hosszú távú cél lehet több alkotót kiszolgáló Creator Platform, de ezt fokozatosan, világos csomag- és adat-határokkal kell bevezetni.

### 61.1. Csomagok és funkciókorlátok
- [ ] A későbbi csomagokhoz mérhető korlátok tartozzanak: site-ok, tárhely, médiafeldolgozás, AI-használat, integrációk, csapattagok és automatizmusok.
- [ ] A funkcióelérhetőséget központi capability/entitlement réteg kezelje; ne legyen szétszórt, ellentmondásos csomagellenőrzés.
- [ ] A korlát elérésekor a felhasználó érthető tájékoztatást, fogyasztási adatot és szabályos alternatívát kapjon.
- [ ] Fizetős funkcióknál előre tervezendő a csomagváltás, lemondás, sikertelen fizetés, visszatérítés és adatmegőrzés.
- [ ] Ne kerüljön ki fizetési vagy előfizetési ígéret, amelyet a rendszer még nem tud megbízhatóan teljesíteni.

### 61.2. Workspace, csapat és szolgáltatói admin
- [ ] A személyes fiók, workspace, site, csapat és későbbi előfizetés kapcsolata explicit adatmodellben szerepeljen.
- [ ] A szolgáltatói admin ne kapjon automatikus, korlátlan betekintést a privát tartalmakba; a támogatási hozzáférés legyen indokolt, korlátozott és naplózott.
- [ ] Meghívás, szerepváltozás, tulajdonosváltás, kilépés, fióktörlés és workspace-megszüntetés külön folyamatot kapjon.
- [ ] Egy felhasználó több site-ja csak explicit megosztással használjon közös erőforrásokat.
- [ ] A több-bérlős (multi-tenant) modell előtt külön biztonsági és adatizolációs tesztek szükségesek.

### 61.3. Megvalósítási elv
- [ ] SaaS, piactér, csapatkezelés és fizetős csomagok a teljes célkép részei, de csak a függőségek, üzleti döntések és tesztek teljesülésekor aktiválhatók.
- [ ] Minden funkció kapjon állapotot, függőséget, hatókört és elfogadási feltételt; a „tervben szerepel” nem azonos a „kész” állapottal.
- [ ] Minden új funkció illeszkedjen a közös design-, adat-, jogosultság-, naplózási-, lokalizációs- és tesztelési alapokhoz.


---

## 62. MASTER-terv lezárási és fejlesztésindítási feltételek

Ez a fejezet határozza meg, mikor mondható ki, hogy a MASTER-terv elég teljes és egységes a következő fejlesztési pont végrehajtásához. A terv lezárása nem jelenti a teljes termék implementációjának lezárását.

### 62.1. A terv teljességének ellenőrzése
- [ ] A teljes termékvízió minden képessége a megfelelő modulban szerepel; a régi forrásokból megőrzendő képesség nem tűnhet el pusztán átrendezés vagy fázisváltás miatt.
- [ ] Minden funkció egyértelműen besorolt: core vagy későbbi, felhasználói felület/domain, függőség, státusz, elfogadási feltétel és szükséges teszt.
- [ ] A hasonló vagy ismétlődő leírások össze vannak vetve; egy fogalomnak egy kanonikus definíciója van, a többi helyen hivatkozás vagy következetes összefoglaló szerepel.
- [ ] Az Admin-menü, a modulhatárok, a funkcióazonosítók, a domain/adatforrás-térkép és a fejlesztési fázisok kölcsönösen összhangban vannak.
- [ ] A közös funkciók — Brand Kit, design tokenek, ikonok, sablonok, presetek, erőforrások, jogosultságok, audit, lokalizáció, értesítések és keresés — egyetlen megosztott szerződéshez kötődnek.
- [ ] A külső szolgáltatókhoz kötött képességek megkülönböztetik a terméktervet, az API-technikai lehetőséget, a szükséges engedélyt/policyt és a ténylegesen igazolt működést.
- [ ] Minden felhasználói végponttól végpontig folyamatnak van sikeres útja, hibautakra vonatkozó elvárása, jogosultsági határa és elfogadási kritériuma.
- [ ] A biztonság, adatvédelem, akadálymentesség, mobilhasználat, teljesítmény, költség, mentés/visszaállítás és működtetés nem utólagos feladatként, hanem a megfelelő funkciók részeként szerepel.
- [ ] A későbbi SaaS, csapat, marketplace, billing és AI-szolgáltatások megmaradnak a teljes célképben, de nem előzik meg a szükséges technikai és biztonsági alapokat.
- [ ] A terv nem jelöl implementáltként olyan funkciót, amelyet csak leírtak; a bizonyítékok státusza külön marad a termékspecifikációtól.

### 62.2. Kötelező konzisztencia-ellenőrzések
- [ ] Ismétlődő fejezetek és funkcióleírások egyeztetése, a korábbi részletek elvesztése nélkül.
- [ ] Azonosítók, státuszok, fogalmak, elnevezések, útvonalak és fázishivatkozások ellenőrzése.
- [ ] Függőségi sorrend és blokkoló feltételek ellenőrzése; nincs olyan későbbi funkció, amely nem létező előfeltételre épít.
- [ ] Kanonikus adatforrások és egyetlen üzleti logika ellenőrzése minden többfelületes folyamatnál.
- [ ] A meglévő kódra vonatkozó állítások ellenőrzése repository-, teszt-, runtime- vagy felhasználói bizonyíték alapján; bizonyíték nélkül a státusz nyitott marad.
- [ ] A terv olvashatóságának ellenőrzése: modulonként jól elkülönülő fejezetek, követhető navigáció, fogalomtár és egyértelmű aktív pont.
- [ ] Történeti forrásokból származó követelményeknél az eredet és a megőrzési döntés visszakövethető; hiányzó forrás nem nyilvánítható automatikusan egyeztetettnek.

### 62.3. Fejlesztésindítási feltétel
A következő fejlesztési pont csak akkor indítható, ha:
1. az aktuális aktív pont és annak scope-ja a MASTER-ben egyértelmű;
2. a szükséges függőségek és a tiltott mellékhatások rögzítettek;
3. a változtatás előtt szükséges repository/runtime/DB/provider ellenőrzések elvégezhetők;
4. az elfogadási és regressziós tesztek előre meghatározottak;
5. az adatvesztési, jogosultsági, migrációs és visszaállítási kockázatok kezelési módja dokumentált;
6. a lezárás feltételei objektíven ellenőrizhetők, és a PASS csak a bizonyítékok után adható meg.

### 62.4. Átadás a tervből a megvalósításba
- [ ] Először a MASTER belső egységességét és a szükséges történeti követelmények megőrzését kell ellenőrizni; ez nem külön termékterv és nem párhuzamos auditprojekt.
- [ ] A nyitott tervbeli kérdéseket a megfelelő modulban kell megoldani; a kész specifikációt nem kell minden fázisnál újra feltalálni.
- [ ] A terv lezárási kritériumainak teljesülése után az egyetlen aktív implementációs pont az F0 meglévő core workflow-ja marad, kivéve ha a repository aktuális, ellenőrzött állapota indokolt változtatást követel.
- [ ] F0 után kizárólag az elfogadott függőségi sorrendben haladunk; párhuzamos, egymástól független feature-szálak nem indulnak.
- [ ] Minden lezárt pont után a MASTER státusza, a bizonyíték, az ismert korlát és a következő aktív pont frissül.
- [ ] A terv lezárását és a kód készültségét külön kell kommunikálni: a terv lehet teljes, miközben a termék funkcióinak többsége még fejlesztésre vár.

### 62.5. Kanonikus fázis- és munkacsomag-leképezés
A következő táblázat feloldja a dokumentumban korábban párhuzamosnak tűnő P- és F-számozást. Az F-szám a legfelső szintű végrehajtási sorrend; a P-szám a részletes munkacsomag.

| Részletes munkacsomag | Kanonikus F-fázis | Megjegyzés |
|---|---|---|
| P1 Platformbaseline | F0–F1 | Az aktuális core állapotot és az Admin-shell alapját szolgálja; csak a szükséges baseline feladatokat kell megismételni. |
| P2 Admin shell | F1 | Közös navigáció, állapotok és mobilos Admin. |
| P3 Editor core | F0 | Mentés, history, canvas, layers, inspector és responsive core. |
| P4 Resource/media | F0–F2 | Az F0-ban csak a core workflow-hoz szükséges stabilitás; teljes registry és könyvtár F2. |
| P5 Design system | F2 | Brand Kit, tokenek, témák, ikonok, presetek, sablonok és reusable komponensek. |
| P6 Pages and renderer | F3 | Oldal-életciklus, renderer, navigáció és publikus minőség. |
| P7 Integrations | F5 | Provider-adapterek és engedélyezett kapcsolatok. |
| P8 Creator profile, schedule and blocks | F3–F5 | Publikus blokkok F3; provider- és schedule-függő integrációk F5-höz igazítva. |
| P9 Content and publishing | F7 | Tartalommodell, könyvtár, naptár és provider-publikálás. |
| P10 Community/audience | F8 | Közösség, audience és consent. |
| P11 Commerce/support/membership | F8 | Fizetési szolgáltató, termék, rendelés és entitlement. |
| P12 Analytics | F9 | Forrás- és frissességjelölt analitika. |
| P13 Campaign/sponsorship | F9 | Kampány- és üzleti funkciók. |
| P14 Automation | F9 | Eseményvezérelt, idempotens workflow-k. |
| P15 Stream Studio/Overlay/OBS | F6 | OBS-kapcsolat, overlayek és stream-eszközök. |
| P16 Backup/portability/diagnostics | F0 és F11 | A core mentési/visszaállítási alap F0; felhasználói export és platformos diagnosztika bővítése a függőségek szerint. |
| P17 Security/accessibility/performance/reliability | Keresztmetszeti, minden F-fázis | Nem különálló késői fázis; minden érintett változtatás része. |
| P18 Localization | Keresztmetszeti; többnyelvű site F3, platformos lokalizáció F11 | A magyar elsődleges nyelv már az alapfelületeknél kötelező. |
| P19 Multi-site/team/SaaS | F11 | Csak a tenant-izolációs és biztonsági előfeltételek után. |
| P20 Extension marketplace | F11 | Biztonságos extension-contract és review után. |
| P21 AI and creator intelligence | F10 | A 40. fejezet részletes AI-szerződése szerint. |
| P22 End-to-end acceptance | Keresztmetszeti, minden release előtt | A release elfogadása az érintett fázisok bizonyítékai alapján történik. |

A fenti leképezés nem engedélyezi a függőségek átugrását. Ha egy munkacsomag több fázist érint, csak az adott fázisra eső, bizonyítható rész zárható le; a teljes munkacsomag nem jelölhető késznek ettől.

### 62.6. Roadmap- és státusz-konfliktusok kezelése
- [ ] A 41.2. fejezet F0–F11 listája a legfelső szintű roadmap egyetlen forrása; a 39. fejezet összefoglaló, a 9. fejezet részletes munkacsomag-katalógus.
- [ ] A 19. fejezet F0 fókusza az aktuális implementációs cél, nem bizonyíték arra, hogy F0 minden acceptance-feladata nyitott vagy kész; a konkrét státuszt ellenőrzött teszt/runtime eredmény adja.
- [ ] Korábbi checkpointok vagy elavult állapotjelzések nem írhatják felül automatikusan a jelenlegi termék-roadmapet. Csak az aktuális termékfunkcióhoz szükséges, bizonyítékkal alátámasztott hiány vagy regresszió határozhatja meg a következő munkát.
- [ ] Ha egy státusz vagy roadmap-sorrend más fejezetben eltér, először ezt a kanonikus térképet és a legfrissebb igazolt repository/runtime állapotot kell alkalmazni; az eltérést a MASTER-ben egy helyen kell javítani.
- [ ] A dokumentum végső konzisztencia-ellenőrzése után a következő munka nem további roadmap-átírás, hanem a 19. fejezet szerinti legkorábbi, reprodukálható F0 acceptance-feladat implementációja/ellenőrzése.

### 62.7. Az eddigi dokumentumszerkezeti ellenőrzés eredménye — 2026-10-14
Az ellenőrzés a MASTER aktuális repository-változatára vonatkozik; nem jelent teljes szemantikai, runtime- vagy funkcionális PASS-t.

- [x] A számozott főfejezetek 0–62 között folytonosak, hiányzó főfejezetszámot nem találtunk.
- [x] Az aktuális dokumentumellenőrzésben nem találtunk azonos című, duplikált Markdown-fejezetcímet.
- [x] A 3. fejezet domain-felelősségeit a kanonikus 16 modulhoz rendeltük; a 46.1. menülistát a 49. fejezet modulstruktúrájához igazítottuk.
- [x] A 9. fejezet P1–P22 munkacsomagjait a 41.2. F0–F11 végrehajtási sorrendhez rendeltük a 62.5. leképezéssel.
- [x] A F0 core media/resource feladat és az F2 teljes Resource Registry/Design System határát különválasztottuk.
- [ ] A teljes termékfunkciók közötti szemantikai duplikáció- és függőségellenőrzés még nem teljes; a szerkezeti ellenőrzés nem helyettesíti.
- [ ] A történeti források minden követelményének megőrzése és a hiányzó források állapotának igazolása nem tekinthető teljesnek pusztán a jelenlegi dokumentum belső ellenőrzése alapján.
- [ ] A valódi F0 mentés–újratöltés–preview–publish–publikus oldal end-to-end ellenőrzés még nem futott le ebben a dokumentumellenőrzésben; ez a következő implementációs/validációs feladat.
- [x] A `52b4dc53f98d19bfb79dc06d0d69f8fe5dff21d8` commiton futó GitHub Actions `Editor Core Test` sikeres: TypeScript typecheck, Editor core, canonical schedule, domain contract és Admin home contract tesztek mind PASS. Futás: https://github.com/sanci9517/sanci9517/actions/runs/38602119822.
- [x] Ugyanezen a commiton a `Twitch Integration Check` is sikeres: TypeScript typecheck, Editor core regresszió, schedule source, Twitch OAuth és site ownership contract tesztek mind PASS. Futás: https://github.com/sanci9517/sanci9517/actions/runs/38602119661.
- [ ] Valódi böngészős smoke, éles Worker/D1 mentés–újratöltés–preview–publish–publikus oldal end-to-end ellenőrzés továbbra sincs igazolva; a CI tesztek ezt nem helyettesítik.

**Státusz:** a dokumentumszerkezet és a fő roadmap-ütközések részben rendezettek; a MASTER lezárása és a termékfejlesztés F0 PASS állapota még nincs kimondva. A korábbi P0/P0.2 checkpoint nem válik új aktív munkafolyamattá; a következő konkrét feladatot a jelenlegi F0 core workflow tényleges állapota határozza meg.
