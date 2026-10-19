### 73.11. Külső referenciaforrások, érvényesség, ellenőrzési rend

- Webflow component properties: https://help.webflow.com/hc/en-us/articles/33961219350547-Component-properties — instance props, egyedi tartalom és shared structure.
- Webflow localization: https://developers.webflow.com/data/docs/working-with-localization/localize-components — definíció és példány localizálhatóság.
- Shopify sections/blocks: https://shopify.dev/docs/storefronts/themes/architecture/sections — dinamika és editorban rendezhető blokkstruktúra.
- Shopify JSON templates: https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates — deklaratív page structure, schema és preset elv.
- Twitch API/EventSub: https://dev.twitch.tv/docs/eventsub/ — provider-driven event subscription, hitelesítés és életciklus.
- YouTube Data API: https://developers.google.com/youtube/v3 — aktuális quota/scope/upload feltételek implementációkor ellenőrizendők.
- TikTok Content Posting: https://developers.tiktok.com/doc/content-posting-api-get-started — engedélyezés/audit és láthatósági feltételek implementációkor ellenőrizendők.
- Discord Developer docs: https://discord.com/developers/docs — bot, OAuth, permission és event szabályok.
- OBS WebSocket protocol: https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md — kapcsolat és request/event modellek.
- Cloudflare Workers/D1/R2/Queues: https://developers.cloudflare.com/ — a konkrét limit/ár/kompatibilitás implementáció és árazás előtt újraellenőrzendő.

A külső példák nem igazolják a SANCI9517 kód meglétét, licencét vagy működését. Minden képességet repository és futó teszt bizonyít.

## 74. FEJLESZTÉSI IRÁNYÍTÓ — EGYETLEN AKTÍV KURZOR ÉS ARCHÍV FELÜLÍRÁSI TILALOM

1. Az aktuális, egyetlen terv útvonala `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` a `v2/foundation` ágon. A korábbi checkpointok, legacy fájlok és 63.x történeti sorok forrás- és provenienciaanyagok, nem új fejlesztési kapuk.
2. **Termékkör nem szűkíthető F0-ra:** Twitch, OBS, TikTok, YouTube, Discord, shop/merch, tagság, közösség, SANCI AI és SaaS a *teljes termékcél* része. Csak az implementáció kapui fázisoltak.
3. A termékterv az egyetlen irányító; GitHub commit és teszt eredmény állapotbizonyíték. Külön párhuzamos aktív tervet, funkciókatalógust, roadmapet vagy auditnaplót nem készítünk.
4. **Aktív pont:** `F0.1-VERIFIED-BASELINE` — nem előzetes igazolt PASS, hanem következő megvalósítási/ellenőrzési feladat. HIGH publish conflict blokkoló az F0.3 kapunál; nem felejtjük el és nem szimuláljuk lezártnak.
5. A következő pont csak akkor léphet aktív státuszba, ha az előző működő kódja, tesztje, megfelelő szerepkörös és negatív tesztje bizonyított. A verziózható státuszbejegyzés ugyanebben a MASTER-ben frissül.
6. A teljes produktum *nyitott a későbbi bővítésre*, de nem nyitunk új teljes tervprojektet pusztán ötletek miatt. Új követelmény a megfelelő meglévő owner/modul/ID-szerződéshez kerül.
7. A feltöltendő fájl neve a GitHubon **pontosan** `SANCI9517-CREATOR-PLATFORM-PLAN.md`, útvonala `docs/`. A letöltött helyi fájl nem helyettesíti a GitHub frissítését; feltöltés után hash/diff/commit és HEAD ellenőrzendő.


---

## 75. Stream Studio, overlayek és makrók — részletes végrehajtási szerződés

**Státusz:** TERMÉKSPECIFIKÁCIÓ; nem implementáció- vagy teszt-PASS. Ez a 49.6, 49.14, 53.2, 54.7, OBS-001–OBS-009 és AUT-funkciók részletezése, nem külön rendszer vagy új kanonikus adatgazda. **Elsődleges felhasználó:** streamer/tartalomkészítő; a brand, media, integrációs és jogosultsági szolgáltatások közösek. Az itt szereplő alazonosítók a meglévő stabil ID-khez kapcsolódnak.

### 75.1. Overlay Studio — OBS-001, OBS-002, OBS-005, OBS-006
1. Overlay projektek: 16:9, 9:16, 1:1 és egyedi felbontás; több jelenet, safe area, rács, snap, zoom, kijelölés, rétegek, csoportok, zárás, igazítás, undo/redo.
2. Elemkönyvtár: kép, szöveg, videó, hang, kamera-keret, alsó sáv, live-státusz, aktuális játék, chat, event list, follower/sub counter, adománycél, countdown, poll, timer, alert és custom widget; csak valósan elérhető adatot mutathat.
3. Külön overlay sablon és preset: starting soon, BRB, intermission, gameplay, just chatting, ending, vertical live, webcam, sponsor, chat és event alert; minden sablon variánsai a Brand Kit tokenjeit használják.
4. Animáció: megjelenés/eltűnés, duration, delay, easing, trigger, motion-reduction, priority, overlap policy és audió ducking; GPU/CPU/bitráta/streamteljesítmény keretek.
5. Browser-source URL titkosított/rotálható hozzáféréssel, lejárat/revokáció és streaming módú cache-szabályok; nem tesz hozzáférhetővé Admin API-t vagy tokent.
6. Tesztüzem: mock event, sample names, preview mode, platformfüggetlen safe demo, hibás kapcsolati állapot, próbaalert; éles esemény nem keveredhet teszttel.
7. Publikálási életciklus: draft → preview → activate; verzió, snapshot, rollback, scene-hez kötés; a módosítás nem írhatja felül élő adás közben automatikusan az aktív konfigurációt.
8. Akadálymentesség és tartalomvédelem: villogás/motion limit, hangszint, szövegkontraszt, képernyőméret, közönség által beküldött tartalom szűrése.

### 75.2. Alert Engine és event queue — OBS-006, AUT-001–AUT-004
1. Eseménykatalógus provider capability szerint: follow, sub/resub, gift, cheer, raid, tip, member, donation, milestone, reward, chat command, poll, giveaway, saját webes esemény; hiányzó provider esemény nem jelenhet meg támogatottként.
2. Variánsok: platform, eseménytípus, összeg/szint, role, idő, kampány és véletlen súly alapján; előnézet, fallback, override és determinisztikus prioritás.
3. Queue: sorrend, priority, max backlog, deduplikáció, replay korlát, cooldown, coalesce, pause/resume, skip, expire, manual replay és cancellation; eltérő hang/vizuál csatornák kezelése.
4. Adatbiztonság: webhook signature, idempotency, privacy/redaction, szövegszűrés, XSS-védelem, érzékeny nevek és összegek opcionális maszkolása.
5. Hibakezelés: offline browser source, stale event, provider outage, dupla esemény, audio missing, sikertelen animáció; érthető állapot és részletes futási diagnosztika.
6. Acceptance: két egyidejű esemény sorrendhelyesen fut; deduplikált webhook nem jelenik meg kétszer; tesztriasztás nem növeli az éles statisztikát; éles beállítás visszaállítható.

### 75.3. Makró- és akciószerkesztő — OBS-004, OBS-009, AUT-002–AUT-014
1. Vizualizált trigger → feltétel → műveletek/alműveletek → várakozás → eredmény folyamat; akciócsoportok, újrahasznosítható rutinok, verzió, címkék, keresés, klónozás és sablon.
2. Triggerek: Stream Deck/Macro Deck/hotkey/MIDI/hitelesített webhook/chat command/reward/OBS state/scene switch/timer/schedule/live start/stop; triggerhez permission és adatforrás-frissesség.
3. Feltételek: élő státusz, jogosultság, napszak, rate limit, állapotváltozó, platform, futó sor, jelenet, értékhatár, és/vagy/nem csoportok; séma alapján típusellenőrzés.
4. Akciók: OBS scene/source/visibility/audio mute, overlay kapcsolás, alert test, chatüzenet, timer, counter, Discord notification, approved webhook és content draft; veszélyes és költséges akció alapértelmezésben jóváhagyásköteles.
5. Változók: workspace/site, makró-, futás- és esemény-scope; erős típus, alapérték, helyettesítés, titok maszkolása, input/output validáció; titok nem tárolható egyszerű makró-JSON-ben.
6. Vezérlési szerkezetek: if/else, switch, sequential/parallel, delay, timeout, retry/backoff, loop limit, subflow, cancel, manual pause, concurrency és lock; rekurzió/ciklusdetektálás.
7. Sorok: külön blocking/nonblocking prioritás, max concurrency, pause/resume, prioritás, vészleállítás, futásazonosító, idempotency és napló megőrzési szabályok.
8. Helyi végrehajtás: felhő Worker nem vezérelhet automatikusan helyi OBS-t; erre felhasználó által telepített, hitelesített és explicit párosított helyi bridge/agent szükséges, biztonságos outbound kommunikációval és revoke lehetőséggel. A bridge offline állapota külön kezelendő.
9. Presetcsomagok: starting soon → live, BRB, return, end stream, scene switch + audio fade, raid reaction, new subscriber, goal milestone, sponsor scene, emergency mute és stream end checklist.
10. Acceptance: dry-run side effect nélkül; OBS kapcsolat elvesztésekor nincs hamis siker; hibás trigger/rossz permission tiltva; rate-limit alatt ismételt akció nem floodol; cancel és emergency stop után nem marad futó veszélyes művelet.

### 75.4. Chatbot, interakciók és közösségi stream-eszközök — OBS-007, OBS-008
1. Parancs CRUD, alias, role, platform, template változók, válaszmód, cooldown globális/felhasználói, csatornaszabályok, teszt, napló és import/export.
2. Chat moderation: spam/link/caps/repeat szabályok, allowlist, ban/timeout kizárólag jóváhagyott provider capability szerint; moderációs napló és appeal-kapcsolat.
3. Loyalty: viewer points, earn/spend, anti-fraud, reset policy, leaderboards, redemption és későbbi entitlement kapcsolatok.
4. Játékos eszközök: szavazás, jóváhagyott giveaway, queue, counter, quote, challenge, shoutout, song request csak a platformszabályok szerint; résztvevők adatvédelme.
5. Nem kötelező saját chatbot: már használt Streamer.bot/StreamElements megoldás adapterrel kapcsolható, ha csökkenti a fejlesztési és migrációs terhet; ne fusson véletlenül két párhuzamos válaszoló bot.

### 75.5. Streaming vezérlő és biztonsági ellenőrzőlista — OBS-003, OBS-004, OPS
1. Live dashboard: platform- és OBS-kapcsolat, stream/record állapot, mikrofon/némítás, scenes, dropped-frame, bitrate, reconnect és adatfrissesség, kizárólag ha technikailag elérhetők.
2. Go-live checklist: cím, kategória, adásrend, overlay, bot, alert, hang, kamera, recording, hálózat, szponzor/brand, privát információ megjelenésének ellenőrzése.
3. Emergency controls: lokálisan párosított agenten keresztüli mute/scene-fallback/alert pause; jogosultság, explicit felhasználói művelet, audit és no-op fallback.
4. Többplatformos stream és vertical output: capability, platform policy, OBS profilok és valós teljesítmény alapján; a cloud app nem ígér transzkódolást vagy multistreamet működő szolgáltató/kapacitás nélkül.
5. Acceptance: teljes offline módban a publikus oldal működik; nincs téves live státusz; reconnect után nem duplázódnak makrók vagy alert-ek; csak engedélyezett kezelő változtathat OBS-állapotot.

### 75.6. Fejlesztési függőségek és végrehajtási sorrend
- STREAM-TOOLS-PLAN.01: Közös STREAM_TOOLS adatkontraktus és permissions; integrációs EventBus határ.
- STREAM-TOOLS-PLAN.02: Lokális OBS bridge és biztonságos pairing (csak felhasználói opt-in), fake és valódi OBS teszt.
- STREAM-TOOLS-PLAN.03: Overlay render/browser-source + demo widget + preview/version/rollback.
- STREAM-TOOLS-PLAN.04: Provider események + alert queue + variánsok + tesztmód.
- STREAM-TOOLS-PLAN.05: Macro runtime/queue/trigger/condition/action engine + dry-run + manual stop.
- STREAM-TOOLS-PLAN.06: Chatbot/interactive tools + provider capability + moderáció.
- STREAM-TOOLS-PLAN.07: Template/preset csomagok + megosztás/import + biztonságos frissítés.
- STREAM-TOOLS-PLAN.08: Live Control Center + observability + teljes E2E/failure/permission/load tesztek.

**Kötelező külső ellenőrzés fejlesztés előtt:** OBS WebSocket hivatalos protokoll/séma, Streamer.bot action/queue minták, StreamElements overlay/browser-source/alert biztonsági minták, provider API scope/kvóta/policy. Ezek nem jelentenek kötelező függőséget vagy átvett forráskódot.

**Forrásminták (funkciókutatás):** https://docs.streamer.bot/guide/core/actions ; https://docs.streamelements.com/overlays ; https://docs.streamelements.com/selive/guides/overlays-and-alerts .


---

## 76. TELJES MODULONKÉNTI VÉGREHAJTÁSI SPECIFIKÁCIÓ — KÖTELEZŐ TERMÉKSZERZŐDÉSEK
**Státusz:** részletes termékkövetelmény, nem kész implementáció. A 3., 24., 49., 54., 56–75. fejezet meglévő ID-it és kanonikus tulajdonosait részletezi. Nem hoz létre új Editor core-t, adatgazdát vagy külön tervet. A streamer/creator/brand teljes kör, OBS, YouTube, TikTok, Discord, shop, monetizáció, AI és SaaS mind a céltermék része, a fázisok csak az építési sorrendet adják.

### 76.0. Egységes definíció minden egyes alfunkcióhoz
Az alábbi modulonkénti sorok teljesítése **minden** önálló feladatra külön-külön kötelező: stabil feature ID / szülő ID; felhasználói probléma és sikeres út; tulajdonos domain; Admin / Editor / public belépési pont; adatmodell és migráció; szerveroldali API és esemény; hitelesítés és site/workspace-scope; hiba-, várakozó-, üres-, retry- és disabled állapot; mobil, billentyűzet és képernyőolvasó; provider capability és licence ahol van; adatvédelmi/retention szabály; feature flag, rollback és költségplafon; unit/integration/E2E/negatív teszt. Nem létező vagy nem tesztelt funkció nem jelölhető késznek.
**Specifikációs példányosítás:** a következő minden sorból a fejlesztéskor külön DB/API/UI/test részfeladat keletkezik. A szerződések nem jogosítanak fel egyszerre történő implementációra; az aktív pont F0.1 marad.

### 76.01. Platformmag és site ownership
**Kanonikus owner:** Platform Core. **Elsődleges folyamat és bontandó képességek:** workspace/site/owner és kanonikus erőforrás-határok; aktív site választása; több site előkészítés.
**Adat/API/esemény szerződés:** site-azonosító minden D1 üzleti sorban; domain action API; audit és idempotencia.
**Elfogadási minimum / negatív próbák:** tenant izoláció; migráció rollback; két site kereszthozzáférés tiltása.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.02. Creator onboarding és márkaindítás
**Kanonikus owner:** Admin. **Elsődleges folyamat és bontandó képességek:** regisztráció / belépés → creator profil → brand → site → starter kit → preview → publikálás; megszakított onboarding folytatása.
**Adat/API/esemény szerződés:** site-profil, onboarding-progress, modulválasztás, starter kit manifest.
**Elfogadási minimum / negatív próbák:** új creator Twitch nélkül publikál; elhagyott varázsló adatot nem veszít.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.03. Admin shell és feladatközpont
**Kanonikus owner:** Admin. **Elsődleges folyamat és bontandó képességek:** modulcsoportok, keresés, parancspaletta, gyorsműveletek, üres/hiba/stale állapot, értesítés.
**Adat/API/esemény szerződés:** kanonikus modul-regiszter, capability-aware menü, jogosultság-szűrés.
**Elfogadási minimum / negatív próbák:** mobil navigáció, billentyűzet, screen reader, jogosulatlan link tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.04. Identitás, jogosultság és biztonság
**Kanonikus owner:** Identity. **Elsődleges folyamat és bontandó képességek:** account recovery, MFA, session revoke, meghívók, site szerepkörök, sensitive action reauth.
**Adat/API/esemény szerződés:** szerveroldali RBAC/ABAC; audit, authz minden mutationnél; titokkezelés.
**Elfogadási minimum / negatív próbák:** cross-site API 403, expirált session, CSRF, role escalation negatív teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.05. Webhely- és domainkezelés
**Kanonikus owner:** Website. **Elsődleges folyamat és bontandó képességek:** site alapadat, slug, navigáció, domain, DNS-ellenőrzés, HTTPS, előnézeti domain.
**Adat/API/esemény szerződés:** site settings, route registry, redirects, domain ownership verification.
**Elfogadási minimum / negatív próbák:** slug collision, domain takeover, canonical redirect, 404, preview leak teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.06. Page Model és Visual Editor
**Kanonikus owner:** Website/Editor. **Elsődleges folyamat és bontandó képességek:** oldalfa, canvas, layer tree, Inspector, grid/flex, drag/resize, snap, zoom, history, responsive, accessibility.
**Adat/API/esemény szerződés:** strukturált Page Model, operation schema, revision/version lock, property registry.
**Elfogadási minimum / negatív próbák:** undo/redo konzisztens; offline/409 mentési hiba után nincs adatvesztés.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.07. Publikálás és release kezelés
**Kanonikus owner:** Publishing. **Elsődleges folyamat és bontandó képességek:** draft mentés, preview, validation, approval, publish, schedule, unpublish, rollback, cache purge.
**Adat/API/esemény szerződés:** külön immutable published snapshot + atomic pointer, optimistic revision control.
**Elfogadási minimum / negatív próbák:** konkurens publish, félbeszakadt művelet, anonymous draft leak, rollback és stale cache teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.08. Brand Kit és témák
**Kanonikus owner:** Design System. **Elsődleges folyamat és bontandó képességek:** logó, favicon, tipográfia, színskála, spacing, dark/light, font, motion, token variáns.
**Adat/API/esemény szerződés:** globális token registry, lokális override, token usage graph.
**Elfogadási minimum / negatív próbák:** token változás minden hivatkozó helyen látszik; leválasztott elem változatlan.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.09. Sablonok, presetek, komponensek
**Kanonikus owner:** Templates. **Elsődleges folyamat és bontandó képességek:** site kit, page, section, layout, synced symbol, detached preset, template galéria, import/export.
**Adat/API/esemény szerződés:** versioned manifest, prop schema, dependency resolver, semver migráció, preview/diff/rollback.
**Elfogadási minimum / negatív próbák:** frissítés nem írja felül saját tartalmat; inkompatibilis template blokkolva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.10. CMS és dinamikus tartalom
**Kanonikus owner:** Content. **Elsődleges folyamat és bontandó képességek:** tartalomtípus, mező, collection, referenciák, kategóriák, filterek, workflow és locale.
**Adat/API/esemény szerződés:** typed content schema, validation, localization, draft/published binding.
**Elfogadási minimum / negatív próbák:** törölt referencia fallback; verzióütközés; nyelvspecifikus publish teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.11. Médiatár és asset pipeline
**Kanonikus owner:** Media. **Elsődleges folyamat és bontandó képességek:** feltöltés, chunk/retry, képszerkesztés, thumbnail, alt text, font és ikon, licenc, használati térkép.
**Adat/API/esemény szerződés:** D1 metadata + R2 binary, checksum/dedupe, signed reads/uploads, lifecycle.
**Elfogadási minimum / negatív próbák:** nem megengedett MIME, idegen tenant asset, félbeszakadt feltöltés, függő törlés tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.12. Űrlap, lead, hírlevél
**Kanonikus owner:** Website/Content. **Elsődleges folyamat és bontandó képességek:** kapcsolat, ajánlatkérés, feliratkozás, inputvalidáció, honeypot/rate limit, értesítés, export.
**Adat/API/esemény szerződés:** form schema, submission encryption/redaction, consent log, retention, provider adapter.
**Elfogadási minimum / negatív próbák:** spam, XSS, CSRF, double-submit, opt-out, jogosulatlan beküldés-listázás tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.13. SEO, keresés, lokalizáció
**Kanonikus owner:** Website. **Elsődleges folyamat és bontandó képességek:** sitemap, robots, OG, canonical, structured data, redirects, hreflang, keresési index.
**Adat/API/esemény szerződés:** per-locale meta, slug és canonical rules, build/publish validation.
**Elfogadási minimum / negatív próbák:** duplikált canonical, broken links, hiányzó fordítás fallback, noindex tesztek.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.14. Integrációk és fiókkapcsolatok
**Kanonikus owner:** Integrations. **Elsődleges folyamat és bontandó képességek:** OAuth connect/reconnect/revoke, provider capability list, scope magyarázat, sync és quotas.
**Adat/API/esemény szerződés:** provider adapter, token vault, EventSub/webhook signature, subscription lifecycle.
**Elfogadási minimum / negatív próbák:** lejárt token, scope hiány, több site összekötési tiltás, idempotens webhook.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.15. Twitch, YouTube, TikTok, Kick, Discord
**Kanonikus owner:** Integrations. **Elsődleges folyamat és bontandó képességek:** platformonként csatorna, live/video/social capability, upload/sync, közösségi értesítés.
**Adat/API/esemény szerződés:** feature matrix provider verzió és engedély szerint; webhooks; policy gates.
**Elfogadási minimum / negatív próbák:** engedély nélküli publish tiltva; quota és részleges hiba látható.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.16. Stream Studio és OBS
**Kanonikus owner:** Stream Studio. **Elsődleges folyamat és bontandó képességek:** live dashboard, health, OBS-bridge, scene/source/mixer, előadási profil, go-live checklist.
**Adat/API/esemény szerződés:** paired local agent/bridge, outbound secured channel, state/event contract.
**Elfogadási minimum / negatív próbák:** helyi OBS offline nem zöld; jogosulatlan stream action tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.17. Overlay Studio és widgetek
**Kanonikus owner:** Overlay Studio. **Elsődleges folyamat és bontandó képességek:** canvas, browser source, event list, alerts, chat, stream goal, countdown, scene preset.
**Adat/API/esemény szerződés:** overlay version/snapshot, signed session access, render sandbox, theme tokens.
**Elfogadási minimum / negatív próbák:** anon admin API elérés tiltva; test event nem éles adat; active overlay rollback.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.18. Makrók és automatizált akciók
**Kanonikus owner:** Automation. **Elsődleges folyamat és bontandó képességek:** macro deck, hotkey, MIDI, Stream Deck, action graph, subflow, variables, retries, concurrency.
**Adat/API/esemény szerződés:** trigger-condition-action DAG, permission typed args, job execution log, kill-switch.
**Elfogadási minimum / negatív próbák:** végtelen ciklus kizárva; dry run side effect nélkül; retry idempotens.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.19. Chatbot és közönséginterakció
**Kanonikus owner:** Community/Stream. **Elsődleges folyamat és bontandó képességek:** chatparancs, moderáció, loyalty, queue, poll, giveaway, channel points, shoutout.
**Adat/API/esemény szerződés:** provider capability + normalized event + consent + abuse protection.
**Elfogadási minimum / negatív próbák:** dupla jutalom nincs; role check, cooldown és anti-spam; provider fallback.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.20. Adásrend, játékprofilok, események
**Kanonikus owner:** Schedule. **Elsődleges folyamat és bontandó képességek:** naptár, recurrence, timezone/DST, játékprofil, Twitch-szinkron, manual override.
**Adat/API/esemény szerződés:** kanonikus schedule_items, provider sync checkpoint, conflict policy.
**Elfogadási minimum / negatív próbák:** DST és recurring exception, kétirányú sync conflict, publikus render konzisztens.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.21. Content Studio és kampánynaptár
**Kanonikus owner:** Content. **Elsődleges folyamat és bontandó képességek:** ötletek, briefek, státuszok, együttműködés, content variants, publikálási queue.
**Adat/API/esemény szerződés:** content item/variant/asset kapcsolat, review workflow, publication jobs.
**Elfogadási minimum / negatív próbák:** részleges publikálás nem zöld; ismételt queue futás nem duplikál.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.22. VOD, klip, Shorts és videó workflow
**Kanonikus owner:** Video. **Elsődleges folyamat és bontandó képességek:** import, transzkripció, fejezetek, clip range, felirat, thumbnail, vertical crop, encode, export.
**Adat/API/esemény szerződés:** asset/job/transcode pipeline, media rights, storage lifecycle, result validation.
**Elfogadási minimum / negatív próbák:** félbeszakadt transcode resume; nincs public publish jóváhagyás nélkül.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.23. Social publikálás és cross-post
**Kanonikus owner:** Content/Social. **Elsődleges folyamat és bontandó képességek:** YouTube/TikTok/Discord/egyéb posztok előkészítése, preview, ütemezés, státusz.
**Adat/API/esemény szerződés:** provider-specific capability, approval, idempotent posting, retry with backoff.
**Elfogadási minimum / negatív próbák:** platform policy, OAuth scope, quota, nem támogatott mód megfelelő jelzés.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.24. Közösség, rajongók és moderáció
**Kanonikus owner:** Community. **Elsődleges folyamat és bontandó képességek:** fan accounts, comments, posts, reactions, notifications, reporting, community events.
**Adat/API/esemény szerződés:** public/private/member scopes, moderation queues, abuse controls, role mapping.
**Elfogadási minimum / negatív próbák:** cross-tenant fan-data tiltva; moderation appeals; deletion privacy.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.25. Tagság és támogatások
**Kanonikus owner:** Membership. **Elsődleges folyamat és bontandó képességek:** tier, perks, access, renewal, cancel, failed payments, tips, goals, Discord roles.
**Adat/API/esemény szerződés:** entitlement source-of-truth, signed provider webhook, chargeback state.
**Elfogadási minimum / negatív próbák:** refunded purchase access revoked; webhook replay nem növel kétszer.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.26. Merch, webshop, digitális termék
**Kanonikus owner:** Commerce. **Elsődleges folyamat és bontandó képességek:** products, variants, cart, checkout provider, orders, coupons, shipping, fulfillment, digital delivery.
**Adat/API/esemény szerződés:** order/payments state machine, inventory reservation, accounting hooks.
**Elfogadási minimum / negatív próbák:** dupla payment nem dupláz rendelést; downloads jogosultsággal.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.27. Szponzoráció, media kit, lead pipeline
**Kanonikus owner:** Business. **Elsődleges folyamat és bontandó képességek:** media kit, deal pipeline, kampányok, deliverable-ek, rate card, deadline, report.
**Adat/API/esemény szerződés:** deal/campaign contracts, private data ACL, link attribution, reports.
**Elfogadási minimum / negatív próbák:** nem nyilvános tárgyalás nem látható public site-on.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.28. Analitika, mérés és növekedés
**Kanonikus owner:** Analytics. **Elsődleges folyamat és bontandó képességek:** web, stream, content, kampány, conversion, membership és shop dashboard; privacy.
**Adat/API/esemény szerződés:** metric schema source+freshness+consent+window, aggregation, export.
**Elfogadási minimum / negatív próbák:** hiányzó adat nem nulla; consent/offline/cross-tenant teszt.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.29. SANCI AI és intelligens segédek
**Kanonikus owner:** AI. **Elsődleges folyamat és bontandó képességek:** brand, page, content, stream, VOD, caption, clip, moderation javaslat; emberi kontroll.
**Adat/API/esemény szerződés:** model/provider adapter, RAG tenant scope, cost meter, approval ledger, structured mutations.
**Elfogadási minimum / negatív próbák:** prompt injection, private data leak, runaway cost és auto-publish tiltva.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.30. Értesítések és háttérmunkák
**Kanonikus owner:** Operations. **Elsődleges folyamat és bontandó képességek:** in-app/email/push (opt-in), scheduled job, retry, dead-letter, support alert.
**Adat/API/esemény szerződés:** events/jobs, idempotency, audit, delivery preferences.
**Elfogadási minimum / negatív próbák:** dupla esemény nem kétszer küld; hibás job visszakövethető.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.31. SaaS, billing és workspace-ek
**Kanonikus owner:** SaaS. **Elsődleges folyamat és bontandó képességek:** self-service signup, plans, trial, entitlements, usage/metering, upgrade/downgrade, cancellation.
**Adat/API/esemény szerződés:** multi-tenant isolation, subscription state, billing adapter, quota guards, costs.
**Elfogadási minimum / negatív próbák:** nem fizető nem kap premium actiont; downgrade adatvesztés nélkül.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.32. Marketplace, API és kiterjesztések
**Kanonikus owner:** Developer. **Elsődleges folyamat és bontandó képességek:** template/widget/plugin install, version, marketplace review, API keys, webhook tester.
**Adat/API/esemény szerződés:** signed manifest, sandbox, permission scopes, trust review, API versioning.
**Elfogadási minimum / negatív próbák:** rosszindulatú plugin nem kaphat secretet; uninstall recovery.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.33. Üzemeltetés, hozzáférhetőség, adatvédelem
**Kanonikus owner:** Quality. **Elsődleges folyamat és bontandó képességek:** monitoring, backup restore, WCAG, mobile, i18n, incident, logging, support, deletion.
**Adat/API/esemény szerződés:** SLO, test pyramid, release gates, privacy retention, disaster recovery.
**Elfogadási minimum / negatív próbák:** restore drill; keyboard coverage; secret redaction; incident rollback.
**Kötelező építési szeletek:** (1) létező kód és stabil ID ellenőrzése; (2) adat-/esemény-/jogosultsági szerződés; (3) API/domain command; (4) Admin kezelőfelület; (5) Editor/publikus kapcsolódás csak szükség esetén; (6) loading/empty/error/retry/mobil/a11y; (7) unit, integration, cross-site és E2E; (8) dokumentált rollback és telemetria.

### 76.34. Keresztmodulú végponttól végpontig acceptance forgatókönyvek
1. **Streamer:** brand site kit → Twitch csatlakozás → schedule → játékprofil → dinamikus weboldal widget → preview → publish → live event → OBS overlay → alert/makró → VOD/klip → YouTube/TikTok publikálási előkészítés. Sikertelen provider esetén részleges, megmagyarázott állapot, adatvesztés nélkül.
2. **Creator:** saját brand → oldalsablon → videógyűjtemény → YouTube + TikTok → tartalomnaptár → időzítés → publikálás → analitika → közösségi CTA; provider-engedély hiánya blokkolja az adott akciót, nem a teljes brand-oldalt.
3. **Monetizáció:** látogató → shop/membership → provider checkout → verified webhook → rendelés/entitlement → letöltés/Discord role → refund/revoke; ismételt webhook idempotens.
4. **AI:** szerkesztő prompt → hozzáférésellenőrzött javaslat → schema validáció → diff → draft → felhasználói jóváhagyás → publikus publish; AI semmilyen titokhoz vagy idegen site-hoz nem fér.
5. **SaaS:** új tenant → saját site → sablon → publikálás → tervcsomag és kvóta → usage metering → downgrade → export/delete; más tenant beállításai és objektumai nem elérhetők.
6. **Recovery:** két tab revision conflict → egyértelmű merge/restore; deploy közbeni publish megszakítás → utolsó konzisztens snapshot; R2 megszakított feltöltés → retry/dedupe; expired OAuth → helyes reconnect.

### 76.35. Átadásra alkalmas fázis- és függőségi lánc
**F0** aktuális kód/repo baseline, jogosultság, Admin és Page Model; F0.2 save-reload+revision; F0.3 preview-publish atomicity és rollback. **F1** Site Manager + Visual Editor alap, navigáció, responsive, SEO. **F2** Brand Kit + Media + template + preset + reusable component + CMS. **F3** Twitch/YouTube/TikTok/Discord/Kick provider adapter alapok és adásrend; a konkrét képesség az aktuális provider policytól függ. **F4** OBS local bridge, Overlay Studio, chat, macro, alert, Stream Studio. **F5** Content Studio, VOD/clip/shorts, publishing pipeline. **F6** közösség, támogatás, tagság, merch/shop, szponzoráció. **F7** analitika, automatizáció, kampányok. **F8** SANCI AI és multimodális feldolgozás költség- és jóváhagyásvédelemmel. **F9** önkiszolgáló multi-tenant SaaS, billing, marketplace; az F0-tól már minden adat site-scope-ot és jövőbeni kvóta/metering csatlakozási pontot követ. A fázis nem egyenlő kihagyott funkcióval.
**Fáziskapu:** minden kiadásra számszerű vagy eldönthető PASS/FAIL teszt; a függő API/domain/core/migráció PASS-ja előtt UI nem jelölhető késznek; a marketing nem állíthat többet a tesztelt éles képességnél.

### 76.36. Kiegészítő, könnyen kihagyható minőségi és üzleti követelmények
- Támogatott böngészők, reszponzív minimumok, képernyőolvasó és csökkentett mozgás; nyílt forrás és fontikon licencek; képek, videók és zenék felhasználási jogai.
- Privacy: cookie/consent, adatportabilitás, törlés, felhasználói export, megőrzési idők, űrlap spam és moderáció; EU adatkezelési vizsgálat külön release gate.
- Árazás: R2/streaming egress, D1 tárolás/lekérdezés, Workers CPU, queues/AI token/video transcode, email, payment díjak; csomagonként soft/hard quota és abuse védelem.
- Támogatás: in-app help, státuszoldal, belső issue azonosító, self-service recovery, visszaállítási gyakorlat, SLA/SLO és üzleti kritikus hibák eszkalációja.
- Accessibility/SEO/performance közös release gate; adatforrás-frissesség és félkész modulok korrekt feliratozása.
- Nem építünk párhuzamos admin CRUD-ot, második oldalmodellt, második integrációs tokenboltot vagy független template rendszert.

### 76.37. A MASTER feltöltési és folytatási szabálya
Az egyetlen feltöltendő fájl a repository `v2/foundation` ágán: `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`. Az 0–75. fejezethez hozzáadott 76. fejezet a korábbi stabil követelményeket nem helyettesíti. **Aktív végrehajtási pont: `F0.1-VERIFIED-BASELINE`**. A tervezési bejegyzés PASS-ja nem implementációs vagy production PASS. A régi audit nem automatikus fejlesztési blokkoló, a HIGH publish conflict viszont marad, amíg a konkrét negatív tesztek nem igazolják a javítást.


---

## 77. VÉGLEGES ÁTADÁSI SZERZŐDÉS — EGY TERV, EGY AKTÍV PONT, VALÓS FEJLESZTÉS

### 77.1. Termékcél és korlát
A platform elsődleges piaca: **streamerek és digitális tartalomkészítők**, akik egyedi publikus brandwebhelyet, videókat, közösséget, élő közvetítést, kapcsolataikat, támogatást, webshopot, merchöt és üzleti folyamataikat egyetlen, feladatalapú Adminból kezelik. A Twitch, YouTube, TikTok, Discord, Kick, OBS, chat, alert, overlay, makró, Stream Studio, Content Studio, VOD, Shorts, média, SEO, sablon/preset/Brand Kit, community, shop, membership, analytics, AI, automation, SaaS, billing és marketplace **mind a teljes céltermék részei**. A saját brandwebhely streaming nélkül is használható. Általános fotós-, éttermi, szállás- és vállalkozói iparágspecifikus verticalok nem kötelező első kiadási scope-ok; később a közös site/CMS/template magot bővíthetik. A fázisolás kizárólag szállítási sorrend, nem funkciótörlés.

### 77.2. Egyetlen irányadó modulrendszer
A 49. fejezet 22 felhasználói főmodulja az Admin kanonikus navigációja. A 24. fejezet 396 stabil funkcióazonosítója a megőrzendő elsődleges index. Az 54., 56–57., 64–76. fejezetek *ugyanazon képességek* részletei és kibővített szerződései, nem párhuzamos új termék- vagy domainmodellek. Egy funkció tulajdonosa egy domain; több felületen megjelenő gyorsműveletek és komponensek ugyanarra az API-ra mutatnak. A Page, Overlay és Video Editor külön feladatszerkesztők; közös Brand Kit, Media Library, Design Tokens és jogosultsági szerződés használható.

### 77.3. Kiadási sorrend és kötelező PASS-kapuk
| Lépés | Felhasználói eredmény | Előfeltétel és elfogadás |
|---|---|---|
| F0.1 | Aktuális GitHub/Worker/D1/Admin/Auth/Page/Editor baseline ismert | HEAD, route-ok, D1 migrációk, permission és `npm run typecheck`, érintett unit/contract tesztek tényleges futtatási jegyzéke; ismeretlen státusz `UNVERIFIED` |
| F0.2 | Admin → Editor → mentés → újratöltés adatvesztés nélkül | Revision conflict, hálózati hiba, két fül, history/undo és jogosultság negatív teszt |
| F0.3 | Draft → preview → publish → public és rollback | Atomic published snapshot, HIGH publish conflict feloldás valós teszttel, publikus és illetéktelen szerepkör teszt |
| F1 | Site Manager, több oldal, navigáció, valódi reszponzív Page Editor | Üres/hiba/mobil/billentyűzetes állapot, stabil Page Model |
| F2 | Brand Kit, design tokenek, sablon/preset/ikon/komponens, Médiatár | Global vs detached instance, manifest/migration/preview, R2/D1 ownership és használati hivatkozás |
| F3 | CMS, SEO, domain, lokalizáció és publikálható brandwebhely | Típusos dinamikus kötés, slug/canonical/sitemap, preview, restore, privacy/consent |
| F4 | Integrációk + Twitch/YouTube/TikTok/Discord/Kick + adásrend/játékprofil | Provider capability/scope, tokenkezelés, limit/reconnect/sync, nem támogatott akció jelzése |
| F5 | Stream Studio, OBS, overlayek, alert-ek, chatbot, makrók, Stream Deck | Élő biztonság, trigger/condition/action, retry/idempotencia, kill switch, helyi bridge threat model |
| F6 | Content Studio, VOD, klip, Short, social publikálás | Médiafeldolgozó queue, platformvariáns, review, retry, jogok és kimeneti ellenőrzés |
| F7 | Rajongók, moderáció, tagság, támogatás, shop, merch, digitális termék | Verified provider webhook, entitlement, order/fulfillment, refund és cross-tenant isolation |
| F8 | Analitika, kampány, szponzoráció és creator business | Provenance, freshness, consent, KPI/revenue definíció, export, nem kitalált metrikák |
| F9 | Automatizáció és SANCI AI munkafolyamatok | Human approval, schema-validált action, redaction, idempotencia, usage/money quota, audit |
| F10 | Önkiszolgáló Creator SaaS, csapat, multi-site, billing és kvóták | Tenantizoláció, support/export, upgrade/downgrade, metering és költségvédelmi leállítás |
| F11 | Marketplace, bővítmények, skálázás és nemzetközi terjeszkedés | Security/licence review, kompatibilitás, moderation, szolgáltatási SLO és visszaállíthatóság |

A fázisokon belüli meglévő részfeladat-ID-k és a 71/73/75/76. fejezet acceptance szerződései érvényesek. Egy fázis csak az előző ténylegesen releváns, igazolt függőségeire épülhet. A tervezett funkciók az elfogadott teljes scope-ban maradnak akkor is, ha még nem aktívak.

### 77.4. Sablonok, presetek és közös szerkesztői szabályok — kiadástól független invariánsok
1. Template: **site-kit / page / layout / section / component / synced symbol / overlay / widget / video project**; preset: **theme / typography / color / spacing / effect / animation / responsive / alert / scene / macro**. A preset tulajdonságokat állít be, és nem vezet be második mentési vagy adatmodellt.
2. Template manifest: stabil ID, verzió, séma, cél, szerző/licenc, locale, függő modulok/provider-képességek, kapcsolódó assetek, jogosultsági hatás, preview, migráció/rollback. Komponensfrissítésnél diff és érintett példányok megjelenítése.
3. Globális, szinkronizált elem csak explicit linkeléssel változtat más példányokat; detached másolat, helyi override és revert külön kezelendő. A gyári induló tartalom soha nem tűnhet valódi felhasználói adatnak.
4. Overlay/alert/makró élő felhasználásnál elkülönített staging és live verzió, tesztgomb, queue/prioritás, rate limit, abort/kill switch, eszköz offline-fallback, audio licenc és módosítási audit szükséges.
5. API-k és események: site/workspace scope, role/permission, server-side validation, idempotent command, schema version, ownership, privacy, test, rollback. Csatlakozóproviderre épülő funkció nem ígérhet nem engedélyezett publikálást vagy streamvezérlést.

### 77.5. Minden fejlesztési feladat minimális kártyája
`ID | modul/owner | felhasználói eredmény | UI/hely | domain objektum + lifecycle | D1/R2/secret | API/event contract | jogosultság/site-scope | függőségek | responsive/a11y | hiba/fallback | pozitív+negatív+regressziós teszt | publish/rollback | provider/licenc | státusz és bizonyíték`.
A már részletezett 24/49/54/56/64–76. fejezet tartalmát **nem kell másodszor újralistázni**; a fejlesztéskor az adott funkcióhoz a kapcsolódó szerződéseket együtt kell alkalmazni.

### 77.6. Tényleges állapot és nyitott kockázatok

- **Fejlesztési környezet stratégia (felhasználói döntés, 2026-10-15):** A Creator Platform funkcióit és weboldalait alapértelmezetten közvetlenül a meglévő éles Cloudflare Worker/D1 környezetben fejlesztjük és ellenőrizzük. Külön teszt-/stagingkörnyezetet most nem hozunk létre; csak konkrét műszaki, adatvédelmi vagy biztonsági indok esetén vezetünk be. A jelenlegi oldalak tesztoldalak, végleges tartalom nélkül. Az automatizált regressziós tesztek, CI, jogosultsági és adatkonzisztencia-ellenőrzések ettől továbbra is kötelezőek; veszélyes vagy visszafordíthatatlan műveletek előtt külön óvatosság szükséges.


- **Jelenlegi oldalak tesztállapota (felhasználói megerősítés, 2026-10-15):** a jelenleg létrehozott publikus oldalak kizárólag tesztoldalak; nincs rajtuk végleges éles tartalom, és az eddigi szerkesztések tesztelési célt szolgáltak. Ez lehetővé teszi a meglévő tesztoldalak használatát F0.3 publish/rollback és konkurencia-elfogadási tesztekhez, külön tesztkörnyezet létrehozása nélkül. A tesztek előtt az érintett oldal azonosítóját és aktuális draft/published verzióját rögzíteni kell; az adatvesztés, más site adatainak érintése, jogosultságok megkerülése, séma- vagy éles migráció és nem visszaállítható műveletek továbbra sem megengedettek automatikusan. A teszteredményeket külön bizonyíték alapján kell PASS-nak jelölni.

- **Lezárt kapuk:** F0.1 és F0.2 CLOSED / PASS a korábban rögzített bizonyítékokkal. F0.3 CLOSED / PASS (2026-10-16): automatizált route-integráció 8/8, teljes F0 baseline 94/94, Node 22 GitHub CI sikeres, valamint a felhasználó visszaigazolta a kétfüles éles preview/publish/conflict/rollback eljárás sikeres végigfutását.
- **HIGH publish conflict:** RESOLVED a célzott route/SQLite-konkurenciatesztekkel és a felhasználó éles kétfüles stale-revision elfogadásával. A nyertes publikáció maradt publikus, az elavult publikáció konfliktusba futott, az eredeti tartalom vissza lett állítva a felhasználói visszajelzés szerint.
- **Egyetlen aktív pont:** `F1.1-SITE-CORE-MULTIPAGE-NAVIGATION`, IN PROGRESS. A WEB-003 user-accepted lezárása a 77.25-ben; az oldallista draft/LIVE jelzése és a következő WEB-002/WEB-013 előfeltételei a 77.26-ban. Nem indul új baseline- vagy történeti audit; F0.3 és WEB-003 lezárása nem igazolja a teljes F1 készültségét.
- Régi 63.x és PLAN-... aktív jelölések kizárólag dátumozott történeti pillanatképek, és **nem indítanak új auditprojektet**. Ha régi fejezet ellentmond a 77. fejezet aktív kurzorának, a fejléc és jelen fejezet az irányadó.
- A tervbe foglalás nem igazolja a kód készültségét. Tesztet/CI-t/éles hozzáférést csak tényleges ellenőrzés után lehet PASS-ra állítani.
- Nem garantálható, hogy soha nem merül fel új követelmény; új funkció ugyanebbe a tervbe kerül az owner és stabil azonosító megtartásával, nem második terméktervként.

### 77.7. Lokális GitHub-szinkron és első fejlesztési indítás
1. **Előbb a branch védett szinkronja:** tiszta helyi munkafa ellenőrzés, `git switch v2/foundation`, `git fetch origin`, `git pull --ff-only origin v2/foundation`.
2. Az itt jóváhagyott MASTER-fájlt a `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md` útvonalra másolni, **a friss GitHub-fájllal való diff után**. Ha közben más fejlesztő módosította ugyanezt a kanonikus dokumentumot, előbb az eltérést össze kell vezetni, tilos vakon felülírni.
3. `git diff --check`, `git diff --stat`, kritikus fejezetszám-/ID-check, majd csak a dokumentum stagingje, commit, `git push origin v2/foundation`.
4. Push után remote commit és nyers tervfájl ellenőrzés. **Csak ezután** F0.1: kód-, migráció-, Auth-, ownership- és testbaseline; F0.2–F0.3 csak a kapuk szerinti bizonyíték után.
5. Az éles telepítés és a D1 migráció külön kockázatos művelet; a puszta dokumentumfeltöltés sem deployt, sem migrációt nem indítson el tudatos jóváhagyás nélkül.

### 77.8. F0.3 tényleges route-integráció és éles olvasásos ellenőrzés — 2026-10-15

**Kiinduló GitHub HEAD:** `dbab7e73f6272700101e50fd8cf49879eea59c85`, `v2/foundation`. **Aktív pont változatlan:** `F0.3-PREVIEW-PUBLISH-PUBLIC`, **IN PROGRESS / NOT YET PASS**. A HIGH publish conflict éles E2E bizonyítékig OPEN.

**Igazolt hiány és változtatás:** a korábbi statikus contract- és külön bemásolt SQL-tesztek nem futtatták a tényleges TypeScript route-okat. Az új `tests/f0-3-route-integration.test.js` a production `adminEditorRoute` és `publicPagesRoute`, valamint a valódi session-hash/jogosultságkezelés kódját hívja, SQLite-adapterrel. A batch adapter tranzakciót használ; a versenyhelyzet determinisztikusan a route előellenőrzése és batch végrehajtása közé illeszti a másik valódi route-hívást. Ez automatizált teszt, nem külön telepített tesztkörnyezet. Runtime kód-, séma-, migráció- és éles adatváltoztatás ebben a lépésben nem történt.

**Helyi eredmények:**
- Új route-integráció: **8/8 PASS**. Anon/viewer preview és írás tiltása; draft–publish–rollback–újrapublish izoláció; konkurens publish nyertes/409; audit SQL-hibánál teljes batch visszagörgetés; unpublish/publish verseny és idempotens unpublish audit; idegen site olvasás/írás kizárása; rollback/publish verseny; hiányzó/elavult revision és hibás hierarchia elutasítása mutáció nélkül.
- Meglévő F0 baseline: **94/94 PASS** (Admin home/access, domain, Editor core, schedule, SQLite-konkurencia és F0.3 contract tesztek).
- `npm run typecheck`: **PASS**. `python3 scripts/check-canonical-plan.py`: **PASS**.
- Az új integrációs teszt bekerült a `.github/workflows/f0-baseline.yml` folyamatba. Helyi futtatás: `node --experimental-loader ./tests/ts-extension-loader.mjs --test tests/f0-3-route-integration.test.js`. A helyi Node verzió 24.19.0; a CI Node 22-t használ, ezért a helyi PASS önmagában nem CI PASS.
- D1 batch-szerződés ellenőrzött forrása: https://developers.cloudflare.com/d1/worker-api/d1-database/#batch — a batch hibájára az egész műveletsor visszagörgetendő. A SQLite-adapter ezt modellezi; nem bizonyítja a telepített Worker/D1 futását.

**Éles, kizárólag olvasásos HTTP-ellenőrzés:** a meglévő `sanci9517-streamer-brand.sandor-bogadi95.workers.dev` környezet `/api/health` végpontja **200**, `ok:true`; `/api/public/pages?preview=1` bejelentkezés nélkül **401 UNAUTHORIZED**; `/api/public/pages` **200**, `ok:true`, 9 oldal. A két public API-válaszban `Cache-Control: private, no-store, max-age=0` és `Vary: Cookie` szerepelt. Ez a hozzáférési/cache-fejléc smoke eredménye, nem teljes vizuális vagy éles konkurencia-elfogadás, és a health verziószáma nem bizonyít telepített commitazonosságot.

**Következő szükséges bizonyíték:** hitelesített éles Editor/D1 E2E ugyanazon tesztoldalon: oldal-ID, draft revision és published pointer rögzítése; két azonos revisionből induló publish közül pontosan egy siker és egy 409; egyetlen új revision/audit; a nyertes publikus snapshot és metadata; rollback után változatlan public, majd explicit újrapublish után visszaállított public. A tesztoldal tartalma szabadon cserélhető, de az előállapotot rögzíteni kell. Ebben a munkamenetben hitelesített éles felhasználói session nem állt rendelkezésre; auth megkerülés vagy új session létrehozása nem történt. E bizonyíték nélkül F1 nem aktiválható.

**GitHub CI utóellenőrzés:** a `db756de2e17124fef10a40410e700aaa4ee88ee9` commit mind az öt workflow-ja **completed / success**: F0 baseline checks ([38789842879](https://github.com/sanci9517/sanci9517/actions/runs/38789842879)), Editor Core Test (`38789842875`), Twitch Integration Check (`38789842981`), Canonical Creator Platform Plan (`38789842869`), Canonical Plan Active Point Audit (`38789842933`). Az új 8 route-integrációs tesztet a Node 22-es F0 baseline is sikeresen lefuttatta. Ez az adott tesztcommit igazolása; az éles F0.3 E2E és HIGH kapu állapotát nem változtatja meg.


### 77.9. F0.3 Editor URL és kiválasztott oldal helyreállítása — 2026-10-16

**Felhasználói hiba:** az Editorban kiválasztott YouTube-oldal nem jelent meg az URL-ben; az `/admin/editor` újratöltése mindig a lista első oldalát, a főoldalt nyitotta meg. **Ok a kódban:** `loadPages()` nem olvasott deep-link állapotot, és `loadPage()` sem szinkronizálta az URL-t.

**Módosítás:** az Editor URL `?pageId=<oldal-azonosító>` paramétere az aktuális oldal tartós, megosztható kiválasztása. Az indulás a paraméter alapján választ; hiányzó vagy már nem létező ID esetén biztonságosan a lista első oldalára esik vissza. Minden sikeres oldalbetöltés `history.replaceState` használatával frissíti a `pageId` értéket úgy, hogy más query paramétert és a hash-t megőrizze. A cache-buster frissült. Az új oldalválasztási tesztek a meglévő Editor tesztscriptből futnak.

**Ellenőrzés:** `npm run test:editor` **49/49 PASS**; `npm run typecheck` **PASS**; `git diff --check` **PASS**. Az induló kiválasztás, fallback, URL-paraméter olvasása, más query/hash megőrzése és az oldal kiválasztásának URL-be írása külön tesztet kapott. Éles böngészős frissítési ellenőrzés PASS felhasználói visszajelzés alapján (2026-10-16): a YouTube-oldal választása URL-be került és frissítés után is megmaradt.

**Állapot:** a kódjavítás és CI után a felhasználó megerősítette, hogy a YouTube-oldal kiválasztása bekerül az URL-be, és frissítéskor az oldal megmarad. A részletes kód- és CI-bizonyíték a 77.9 és 77.10 pontban áll. Az F0.3 éles publish/conflict kapu a 77.10 szerinti tesztmegerősítéssel CLOSED / PASS.


### 77.10. F0.3 kézi éles elfogadás és F1.1 aktiválása — 2026-10-16

**Felhasználói kézi tesztmegerősítés:** a felhasználó a teljes előzőleg leírt F0.3 ellenőrzési folyamatot sikeresnek jelezte. Ezt a teljes folyamat user-confirmed PASS eredményeként rögzítjük: azonos YouTube-oldal két Editor fülön; draft módosítás és publikálás; az elavult fül publikálási konfliktusa és helyi vázlatának megőrzése; a nyertes publikus tartalom ellenőrzése; az eredeti oldalverzió visszaállítása és újrapublikálása; az Editor URL/frissítés viselkedésének ellenőrzése. Revision számot, pontos publikus slugot vagy képernyőképet a felhasználó nem adott meg, ezért ezeket nem dokumentáljuk tényként.

**F0.3 elfogadási döntés:** CLOSED / PASS (2026-10-16). Együttes bizonyíték: valós route-okat hívó integrációs teszt 8/8 PASS; meglévő F0 regresszió 94/94 PASS; npm run typecheck PASS; a db756de2e17124fef10a40410e700aaa4ee88ee9 commit mind az öt GitHub Actions workflow-ja SUCCESS; a felhasználó megerősítette a kézi éles teszt sikerét. A HIGH publish conflict blokkoló státusza RESOLVED.

**Egyetlen következő aktív pont:** F1.1-SITE-CORE-MULTIPAGE-NAVIGATION — Site Core, oldal CRUD és navigáció (77.3 fáziskapu; funkciószelet: Site Core + többszintű oldalak/navigáció). Első művelet: a jelenlegi pages/site beállítások, admin oldalkezelő, API route-ok, D1 séma, publikus route/slug és tesztlefedettség vizsgálata; az oldalválasztó deep-link javítás már elérhető alap. Csak bizonyított hiányt implementálunk, majd a releváns CRUD, slug-ütközés, jogosultság, site-scope, 404/redirect, draft/published, mobil és keyboard acceptance szerint fejlesztünk és tesztelünk. F1.1 addig nem nevezhető PASS-nak, amíg a saját elfogadási feltételei nem igazoltak.


### 77.11. F1.1 — publikus oldalak valódi HTTP 404 státusza — 2026-10-16

**Leltározott hiány:** a `src/index.ts` minden `/p/*` útvonalra feltétel nélkül a `visual-page.html` shellt adta vissza 200-as státusszal. A nem létező és nem publikált oldalaknál csak a kliensoldali JavaScript mutatott 404-es üzenetet; crawler, HTTP kliens és státuszfigyelés továbbra is sikeres oldalt látott. A publikus listát és slug-keresést már a `publicPagesRoute` kezeli, ezért az útvonal-ellenőrzés ezt a published-only domain szerződést használja, nem épít második Page lekérdezési modellt.

**Módosítás:** a Worker a `/p/<slug>` kiszolgálása előtt a meglévő publikus Page route-on ellenőrzi, hogy a slug publikált oldalhoz tartozik-e. Publikált oldalnál változatlanul a közös visual-page shell töltődik be; ismeretlen vagy nem publikált slugnál ugyanaz a shell HTTP 404-et és `Cache-Control: no-store` fejlécet kap. Hibás encoding, nem megengedett slug és többszintű útvonal nem kerül D1-hez. A hitelesített `?preview=1` útvonal a cookie-t és preview módot továbbadja a már létező jogosultság-ellenőrzésnek, így a draft preview használható marad, az anonim preview 401-et kap. Adatbázisséma, migráció és éles adat nem változott.

**Automatizált ellenőrzés:** új Worker-szintű útvonalteszt 5/5 PASS: publikált oldal 200 és query megőrzése; ismeretlen és csak piszkozat slug HTTP 404; hibás encoding és nested slug D1 nélkül 404; hitelesített, nem publikált draft slug preview 200; anonim preview 401 draft-lekérdezés nélkül. A teszt bekerült a `F0 baseline checks` workflow-ba. Helyi teljes releváns regresszió: typecheck PASS; Admin home 16/16; Admin access 2/2; domain 5/5; Editor 49/49; F0 editor/publish contract 17/17; F0 route integration 8/8; F1.1 public route 5/5; schedule 9/9; canonical plan checker PASS; `git diff --check` PASS. Eredmény a helyi munkafára vonatkozik, GitHub CI és éles HTTP/böngészős ellenőrzés még nem történt.

**Éles ellenőrzés (2026-10-16):** a GitHub commit `c5ac4ae2c5c9dbb42115a8aca1c714dec5b29129` mind az öt workflow-ja SUCCESS (F0 baseline, Editor Core Test, Twitch Integration Check, Canonical Creator Platform Plan, Canonical Plan Active Point Audit). A Cloudflare API az `sanci9517-streamer-brand` Worker legutóbbi 100%-os deploymentjeként a `16e23b1a-8172-469d-8fd8-d3df0d3ef1e4` verziót mutatta, 2026-10-16 07:49 UTC időbélyeggel (version 2107). Éles böngészőben a `/p/youtube` útvonal a YouTube-oldal tartalmát jelenítette meg; az egyedi ellenőrző slug `/p/sanci9517-404-check-20261016` az „Az oldal nem található / 404” felületet mutatta. A távoli böngészőből a dokumentumnavigáció nyers HTTP-státusza nem volt közvetlenül olvasható. A felhasználó az ezután kért teljes éles ellenőrzőlistára „minden jó” visszajelzést adott (2026-10-16); ezt a `/p/youtube` HTTP 200, az ismeretlen slug HTTP 404 és az Editor hitelesített preview működése **felhasználó által megerősített PASS** eredményként rögzítjük, a nyers státuszkódot saját eszközzel nem mértük. Az automatizált route-teszt ugyanezeket a publikus státuszokat és a preview jogosultságot külön is ellenőrzi.

**Állapot:** ez az F1.1 egy elfogadási szelete, nem az F1.1 lezárása. A Site/Page CRUD, navigációs fa, hierarchia, slug-életciklus, redirect és több-site elfogadási pontjai továbbra is nyitva maradnak.


### 77.12. F1.1 — publikus mobilnavigáció fókusz-visszaállítása — 2026-10-16

**Leltározott hiány:** a canonical publikus `public/visual-page.html` menügombja megnyitotta és bezárta a menüt, Escape-re és külső kattintásra is bezárt, de bezáráskor a fókuszt nem állította vissza a megnyitó gombra. A vezérlő és navigációs panel között nem volt explicit `aria-controls` kapcsolat. Ez a WEB-011 mobil- és billentyűzetes elfogadás egy kis, adatmodell-migráció nélküli szelete; a WEB-009 szerveroldali navigációs fa ettől még nincs implementálva.

**Módosítás:** Escape bezárás után a fókusz a menügombra kerül vissza. Külső kattintás akkor állítja vissza a fókuszt, ha a fókusz a bezárás pillanatában a menün belül volt; egyébként nem rabolja el a külső vezérlő fókuszát. A menülink követése és a már becsukott állapot nem kényszerít fókuszváltást. A gomb `aria-controls="public-menu"` attribútumot, a panel stabil ID-t kapott; az érintett oldal `site.js` hivatkozása cache-bustert kapott. D1-séma, migráció és éles adat nem módosult.

**Helyi ellenőrzés:** új futtatható Node teszt 3/3 PASS: Escape bezárás és fókusz-visszaállítás; menün kívüli kattintás fókuszkezelése nyitott és zárt esetre; ARIA-kapcsolat és cache-buster jelenléte. Releváns helyi regressziók PASS: Admin home 16/16; Admin access 2/2; domain 5/5; Editor 49/49; F0 editor/publish contract 17/17; F0 route integration 8/8; F1.1 publikus route 5/5; schedule 9/9; új publikus navigáció 3/3; `npm run typecheck`; canonical plan checker; `git diff --check`. A teszt bekerült a `F0 baseline checks` GitHub Actions workflow-ba.

**GitHub CI és éles böngészőellenőrzés (2026-10-16, kódcommit `10d5a8d5942b633d968c190f804cf16b1e06ddd6`):** az öt workflow mind `completed / success`: F0 baseline (`38871126080`), Editor Core Test (`38871126132`), Twitch Integration Check (`38871126100`), Canonical Creator Platform Plan (`38871126016`), Canonical Plan Active Point Audit (`38871126188`). Cloudflare Worker `sanci9517-streamer-brand` friss deploymentje `432b4676-f0ee-4f1b-b330-3a5501a82eef`, az aktív version `a37fb1e7-080a-4c64-a793-95f21149c1e0`, 100%-os forgalommal, 2026-10-16 08:03:32 UTC időbélyeggel. Az éles `/p/youtube` böngészőben betöltődött; a publikus menüben 8 link jelent meg, a menügomb és navigációs panel `aria-controls` kapcsolata érvényesült. Az első menülink fókuszában küldött Escape bezárta a menüt és a fókuszt visszahelyezte a menügombra (`aria-expanded=false`, `document.activeElement` a toggle). Nyers viewport/responsive méretet ebben a böngésző-ellenőrzésben nem állítottunk; a mobil töréspont vizuális elfogadása külön még nyitva marad.

**Nyitott F1.1 elemek:** szerveroldali canonical navigációs fa, többszintű menü és page hierarchy, CRUD teljes negatív/site-scope tesztjei, slug/redirect életciklus, több-site elfogadás és a mobil töréspont vizuális elfogadása. A jelen módosítás csak a meglévő publikus disclosure menü keyboard/fókusz hibáját kezeli; nem zárja le a WEB-011-et vagy az F1.1-et.


### 77.13. F1.1 — oldalrendezés célindexének és site-scope-jának javítása — 2026-10-16

**Leltározott hiány:** az `adminPagesRoute` `PATCH sortOrder` eddig csak az aktuális oldal legközelebbi szomszédjával cserélt, bármilyen megadott célindex mellett. Például a 0. indexről 2-re mozgatás után az oldal a 1. sorrendbe kerülhetett, miközben az API-válasz 2-t jelentett. Az egyik csere `UPDATE` SQL-je nem tartalmazott `site_id` feltételt. Az Editor jelenlegi fel/le gombjai szomszédos lépést kérnek, de az API szerződése tetszőleges indexet is elfogadott.

**Módosítás:** sorrendmódosításkor a route az aktuális site oldalait stabil `sort_order,id` sorrendben beolvassa, ellenőrzi a célindexet, áthelyezi az elemet a kért pozícióra, majd batch-ben 0..N−1 folytonos sorrendet ír vissza. Minden írás `id` és `site_id` szerint korlátozott; az egyetlen D1 batch atomi. A negatív és a lista végi/out-of-range célindex 400 `INVALID_PAGE_ORDER`, adatváltozás nélkül. A `page.update` audit most a régi és az új sort ordert is tartalmazza. Sémamódosítás/migráció és publikus tartalom nem érintett.

**Célzott route/SQLite ellenőrzés:** az új `tests/admin-pages-sort.test.js` 3/3 PASS: tetszőleges célindex helyes áthelyezése és folytonos indexek; out-of-range kérés változás nélküli elutasítása; másik site oldalának 404-es elutasítása és változatlan sorrendje. A teszt bekerült a Node 22-es `F0 baseline checks` workflow-ba.

**Helyi regresszió:** `npm run typecheck` PASS; Admin home 16/16; Admin access 2/2; public navigation 3/3; page sort route 3/3; domain 5/5; Editor 49/49; F0 contracts 17/17; F0 route integration 8/8; F1.1 public route 5/5; schedule 9/9; canonical plan checker és `git diff --check` PASS. Node 24.19.0.

**GitHub CI és éles telepítés (2026-10-16, commit `c9202b778bd6812e5602f51add84ae0f7c0747cd`):** mind az öt workflow `completed / success`: F0 baseline (`38871798104`), Editor Core Test (`38871798058`), Twitch Integration Check (`38871798063`), Canonical Creator Platform Plan (`38871798038`), Canonical Plan Active Point Audit (`38871798051`). A Cloudflare Worker `sanci9517-streamer-brand` legfrissebb deploymentje `a8e8e532-e085-40a0-a991-779c7c349d66`, aktív verzió `3a49d450-ecd5-4533-a947-d9bb47b5cdb3`, 100% forgalom, 2026-10-16 08:09:35 UTC időbélyeggel. A kód éles; az új reorder route automatizált, valódi route-kódot SQLite-on futtató tesztjei 3/3 PASS. **Felhasználói kézi ellenőrzés:** az Editor oldallistáján az oldalt feljebb, majd vissza lefelé mozgató kért sorrendtesztet a felhasználó „működik” visszajelzéssel sikeresnek erősítette meg. Nincs rögzített képernyőkép vagy nyers adatbázis-vizsgálat; az éles kézi sorrendelfogadás user-confirmed PASS.

**Nyitott F1.1 elemek változatlanul:** canonical szerveroldali navigációs fa, page hierarchy és nested menu; CRUD/slug/redirect lifecycle teljes acceptance; mobil viewport vizuális elfogadása; több-site viselkedés. Ez a részszállítás nem zárja le F1.1-et.


### 77.14. F1.1 — WEB-009 canonical navigációs fa: következő adatmodell- és migrációs kapu — 2026-10-16

**Bizonyított jelenlegi hiány:** a publikus `public/assets/site.js` a `/api/public/pages` listából építi fel a menüt, és a `home` oldalt kihagyja. Nincs szerkeszthető, hierarchikus, kanonikus menümodell, ezért a menü most a publikált oldalak listájának nézetéből következik. A WEB-009 elvárt negatív feltételei közé tartozik a ciklikus és hiányzó célú menüpont publikálásának megakadályozása; ezekhez a jelenlegi megoldásban nincs menüfa-validáció.

**Éles D1 read-only ellenőrzés (2026-10-16):** az account `64bbd6a12ac732ed2cac4ca25d8bfa7e`, adatbázis `sanci9517-db` (`5a4a5e96-fdad-421a-a33c-143daaf33e98`). A `pages` táblában 9 oldal található az egyetlen `site-default` site alatt. A jelenlegi slugra globális `UNIQUE` megszorítás van; mellette létezik egyedi részleges index a `(site_id,published_slug)` mezőpárra. A más site-ok közti slug-ütközés lekérdezése nem adott találatot, mert jelenleg egyetlen site van. A `sqlite_master` indexek és page-count lekérdezései read-only, `changed_db=false`, `rows_written=0` eredményt adtak. Migráció vagy adatírás nem történt.

**Következő részfeladat:** `F1.1-WEB-009-CANONICAL-NAVIGATION`. A meglévő publikus listaútvonal és Page domain újrahasználásával egyetlen site-scoped menüfa szerződést kell kialakítani, amely támogatja a belső oldalcélt, külső hivatkozást, rendezést és hierarchiát; a draft/published határnak meg kell akadályoznia, hogy nem publikált menüváltozás azonnal megjelenjen. A mentési/publikálási tranzakció, oldal törlés/slug módosítás hatásai, ciklus- és hiányzó cél validáció, jogosultság, publikus renderelés, mobil/keyboard működés és visszaállíthatóság tesztelendő. A 77.4 egy adatgazda szabálya szerint párhuzamos menüadatforrás nem hozható létre.

**Helyi implementációs jelölt (2026-10-16, izolált worktree; nem éles):** a `work/f1.1-navigation` helyi ágon commit `c90f717f60562abaf5cf5ab58884837676f992e8` elkészült a WEB-009 első végigvezetett szelete: `site_navigation` site-scope-olt draft/published snapshot migrációval és jelenlegi publikált oldalakból seedeléssel; authenticated Admin GET/PUT/POST API-val, optimistic revision checkkel, oldalcél- és HTTPS külső URL validációval, publikált cél ellenőrzéssel és audit eseménnyel; publikus API-val, amely belső Page ID-t publikált URL-re old fel és elrejti a hiányzó/nem publikált célt; Editor oldalsó Navigáció panellel, hierarchia/rendezés, külső link, külön draft mentés és publikálás művelettel. A meglévő publikus menü ugyanazt a seeded sorrendet kapja, a Home és a draft oldalak kimaradnak. A migráció nem módosítja a pages táblát vagy a slug egyediségi megszorítást.

**Helyi automatizált ellenőrzés (Node 24.19.0):** új navigation migration/route/UI tesztek 10/10 PASS; meglévő publikus navigation + F1.1 route/reorder tesztek 20/20 PASS; F0.3 szerződéses és publikus navigáció regresszió 20/20 PASS; F0.3 route integration 8/8; F1.1 publikus route 5/5; Admin home 16/16; Admin access 2/2; domain 5/5; Editor 49/49; schedule 9/9; `npm run typecheck`, az érintett JS modulok parse checkje és `git show --check` PASS. A teljes helyi F0 baseline parancskészlet sikeres. A feature commit csak a helyi izolált worktree-ben létezik; a `v2/foundation` feature kódja és a `0020` migráció nem került fel, és nem alkalmazódott élesben. Ugyanakkor a MASTER-only `99dffefc46b07db41155c77d1f18d14ec56342e4` push is automatikusan elindította a Cloudflare `Workers Builds` production folyamatot: build `309ddd33-a216-4afc-a7d6-1d907de02679`, konfigurált parancs `npm run deploy`, amely `db:migrations:apply` és `wrangler deploy` lépéseket futtat. Az ebből létrejött deployment `192fa8a6-b4b8-447a-9b64-1d84b5ceee79`, Worker version `57a46115-008f-4206-9f0c-fc0ff36f6bf4`, 100%, 2026-10-16 08:54:10 UTC. Read-only D1 ellenőrzés szerint az utolsó alkalmazott migráció továbbra is `0019_published_page_timestamp.sql`, `site_navigation` tábla nincs; `rows_written=0`, `changed_db=false`. Ez docs-only push után futó automatikus deployment volt; a navigáció feature kód nem került productionbe. A Böngészős vizuális és autentikált éles acceptance még nem történt. **Üzemeltetési következmény:** a `v2/foundation` bármely push-a production deployt futtat, és a jelenlegi deploy parancs az összes függő D1-migrációt előbb élesben alkalmazza. Ezért a 0020 migrációt tartalmazó branch push/deploy előtt kifejezett felhasználói jóváhagyás szükséges.

**MASTER-re alapozás:** a feature commit újraalapozva a legfrissebb `v2/foundation` ágra; a release-re kerülő feature commit `2ddc30c` (a korábbi lokális jelölt commit utódja).

**Éles kapu:** a felhasználó 2026-10-16-án kifejezetten jóváhagyta az éles migrációt és deployt, ha külön tesztkörnyezet nem indokolt. A 0020 migráció és a feature kód production pushra vár; migráció, Worker deployment és CI csak azok tényleges ellenőrzése után rögzíthető. A WEB-009 és az F1.1 státusza továbbra is IN PROGRESS; ez a bejegyzés nem állít kész vagy PASS állapotot.

### 77.15. F1.1 WEB-009 — éles kiadás és runtime ellenőrzés — 2026-10-16

**Kiadás:** a `v2/foundation` ágra felkerült a WEB-009 canonical navigáció implementációja `85de0377fd311615e3a25181e3279ca21f932728` commitként, a 77.14-ben rögzített felhasználói jóváhagyás alapján. Külön tesztkörnyezet nem indokolt: a migráció kompatibilis, új `site_navigation` táblát hoz létre, a meglévő `pages` és slug korlátozásokhoz nem nyúl.

**Automatizált kapuk:** a GitHub ellenőrzések mind 6/6 sikeresek: Workers Builds, verify, source-audit, editor-core, twitch-integration, canonical-plan. A helyi, Node 24.19.0-s teljes releváns baseline is sikeres: typecheck; admin home 16/16; publikus menü 3/3; page reorder 3/3; új navigáció migráció/API/UI 10/10; admin access 2/2; domain 5/5; Editor 49/49; SQLite regresszió 17/17; F0.3 route integration 8/8; F1.1 public route 5/5; schedule 9/9; canonical plan checker és diff check PASS.

**Éles D1 és Worker:** Cloudflare build `9b20c43f-3bad-49e1-a8e8-d3cc1ddd2367` sikeres; a build `npm run typecheck`, majd a meglévő konfiguráció szerinti `npm run deploy` parancsot futtatta. A `0020_site_navigation_snapshots.sql` migráció 2026-10-16 09:01:12 UTC-kor alkalmazódott. A D1 read-only ellenőrzése szerint a `site-default` rekord létrejött, `revision=1`, `published_revision=1`, 8 publikált menüponttal; az ellenőrző SELECT-ek `rows_written=0`, `changed_db=false` eredménnyel zárultak. Az aktív Worker deployment `d167e289-9665-493f-b052-d193ba9909b0`, verzió `6d86d9db-cde0-41c7-a05c-954cc6bc8517`, forgalmi arány 100%, 2026-10-16 09:01:21 UTC.

**Éles runtime ellenőrzés:** a `https://sanci9517-streamer-brand.sandor-bogadi95.workers.dev/p/youtube` oldalon a menü megnyílt; 8 belső menüpont jelent meg, köztük a YouTube oldalra mutató hivatkozás, a menü a működő publikált sorrendet használja. Az `/admin/editor` első megnyitása a bejelentkezési oldalra irányított; a biztonságos hitelesítés után új böngészőlapon láthatóan betöltött a `Sanci9517 Visual Editor v2` és a `Navigáció` eszköz. A credential-delivery utáni böngészőadat-védelem blokkolta a további automatizált panel-interakciót, így a panel működésének kézi elfogadása még nem történt meg.

**Következő acceptance lépés:** felhasználó ellenőrizze az Admin Editorban a Navigáció panel betöltését, egy menüpont átrendezésének draft mentését (publikálás nélkül a publikus menü ne változzon), majd a draft publikálását, és a publikus menü frissítését. Ezt követően ellenőrizendő a külső HTTPS link, a hierarchikus/nested menü mobilon és billentyűzettel. Addig a WEB-009 és F1.1 státusza IN PROGRESS marad; az éles runtime és az automatizált tesztek PASS állapota nem helyettesíti a hitelesített UI kézi elfogadását.


### 77.16. F1.1 WEB-003/WEB-009 — navigációra hivatkozó oldal törlésének védelme — 2026-10-16

**Talált hiány:** az Admin oldal törlési útvonala nem ellenőrizte, hogy a törlendő oldal szerepel-e a site saját draft vagy publikált navigációjában. Ez árva menüpontot hagyhatott volna.

**Változtatás:** a `0021_prevent_deleting_navigation_pages.sql` D1-trigger ugyanazon site-hoz kötve, a draft és publikált JSON-fában is ellenőrzi a pageId-hivatkozásokat; a DB-védelem a párhuzamos szerkesztés és törlés közötti versenyhelyzetet is megfogja. Az Admin API ezt `PAGE_IN_USE` HTTP 409 hibává alakítja magyar útmutatással. Más site navigációja nem blokkolja a törlést.

**Automatizált ellenőrzés:** az új törlésvédelmi teszt 4/4 PASS; kapcsolódó oldal-, navigációs és publikus route regressziók 18/18 PASS; `git diff --check` PASS. A helyi `npm run typecheck` nem futott, mert a `tsc` nincs telepítve. A Cloudflare Workers Build `23428d94-e566-408a-9d8e-7361bf8ed6ac` sikeresen futtatta a `npm run typecheck` és `npm run deploy` lépéseket.

**Éles kiadás:** a feature commit `fab8c386fe6c5ab296ac0dea637acc6c868d4dd9` felkerült a `v2/foundation` ágra. A 0021 migráció sikeresen alkalmazódott; az első feature deployment `26f076ea-f346-46fc-bc38-ed6241b8a0ce`, Worker verzió `67cc0518-b243-44db-9147-928b2294717a`, forgalmi aránya 100%. A D1 read-only ellenőrzés igazolta a migrációt és a triggert (`rows_written=0`, `changed_db=false`); mind a 8 meglévő menüpont érvényes publikált oldalra mutatott.

**Kézi acceptance:** az automatizált böngészős vizsgálatkor a `/p/youtube` oldalon a menüpanel megnyílt, de a hivatkozások nem jelentek meg. A felhasználó 2026-10-16-án „minden működik” visszajelzéssel megerősítette a menüpontok láthatóságát és a törlésvédelmi próbát. Ezt a két acceptance pontot PASS-ként rögzítjük; az automatizált böngészős megfigyelés eltérésének oka nem ismert. A nested/mobile/keyboard acceptance ezzel nem zárult le.

### 77.17. F1.1 WEB-011 — publikus menü billentyűzetes fókusz és léptetés — 2026-10-16

**Felhasználói hiba:** a felhasználó visszajelzése szerint a menü bezárása működött, de a billentyűzetes léptetés közben az oldal görgetett, miközben a menü nyitva volt.

**Javítás:** a menü megnyitásakor a fókusz az első elérhető hivatkozásra kerül; ha a navigációs adatok csak ezután töltődnek be, a fókusz a rendereléskor kerül át. A nyitott menüben az ArrowDown/ArrowUp léptet, a Home/End az első/utolsó linkre ugrik, és ezek a billentyűk nem görgetik az oldalt. Escape bezár és visszaadja a fókuszt a menügombra; a fókusz látható stílust kap.

**Automatizált ellenőrzés:** a publikus fókusz-/léptetési/UI tesztek 7/7 PASS; a route- és törlésvédelmi regressziók 10/10 PASS; `node --check public/assets/site.js`, canonical plan checker és `git diff --check` PASS. A teljes helyi typecheck nem futott, mert `tsc` nincs telepítve.

**Éles build és deploy:** Cloudflare Workers Build `9150dd30-0333-4cb0-b770-cc7a94413fee` `success`; a `npm run typecheck` és `npm run deploy` lépések sikeresek. D1-migráció nem kellett (`No migrations to apply`). Deployment `0b8c8e8d-b77a-4a5b-b0fe-41cfaae64f18`, Worker verzió `33471b4a-fee7-4770-abc7-1c5a9e781fd7`, forgalmi arány 100%.

**Állapot és következő lépés:** a javítás éles, de WEB-011/F1.1 nem PASS. Az automatizált éles böngészőben a `/p/youtube` oldal betöltött és a menü kinyílt, de a linkek nem jelentek meg; emiatt a billentyűzetes fókusz/léptetés élő ellenőrzése ebben a böngészőpéldányban nem volt lehetséges. A felhasználó korábban jelezte, hogy saját böngészőjében a menü hivatkozásai láthatók; a billentyűzetes görgetés megszűnését most az új éles javítás után kézi újrateszteléssel kell ellenőrizni.

### 77.18. F1.1 WEB-011 — nyílbillentyű fókusz-fallback és mobil menügörgetés — 2026-10-16

**Visszajelzés:** a felhasználó jelezte, hogy a görgetés továbbra is marad. A 77.17-es implementáció a nyílbillentyűket csak akkor fogta meg, ha egy menühivatkozás már fókuszban volt; ha a fókusz a menügombon maradt, a böngésző alapértelmezett oldalgörgetése érvényesült.

**Javítás:** nyitott menünél a menügombon vagy a menüpanelen álló fókusz esetén az ArrowDown/Home az első, az ArrowUp/End az utolsó elérhető menühivatkozásra lép, és megakadályozza az oldal alapértelmezett görgetését. A fókuszhoz kötött léptetés továbbra is működik. Hosszú menü esetén a panel saját, korlátozott magasságú, overscroll-t a panelen belül tartó görgetést kapott. A CSS és JS cache-buster frissült.

**Automatizált ellenőrzés:** a publikus menü és UI tesztek 8/8 PASS, beleértve a menügombról induló ArrowDown/ArrowUp esetet és a panel saját görgethetőségének szerződését; a navigation route és page-navigation regreszsziók 10/10 PASS; `node --check public/assets/site.js`, `git diff --check` és `python3 scripts/check-canonical-plan.py` PASS.

**Kiadás:** a javítás a `v2/foundation` ágra került `b4acd7f19e698e5aa7f9fbfcc93b6dceb040421a` commitként. Cloudflare Workers Build `e272039e-679b-49bc-b2e7-b7a7555091da` sikeres; `npm run typecheck` és `npm run deploy` is sikeres, D1-migráció nem volt (`No migrations to apply`). Deployment `2571c784-a1a4-4aec-91cf-7ae4c1cbdbea`, Worker version `83ed93f4-1a4c-491c-aefc-67ec34c3289f`, forgalmi arány 100%. Adatbázis-változtatás nem történt. A WEB-011/F1.1 továbbra sem PASS: a felhasználónak az új éles verzióval meg kell ismételnie a nyitott menü nyílbillentyűs léptetését.

### 77.19. F1.1 WEB-011 — nyílbillentyűs léptetés kézi elfogadása — 2026-10-16

A felhasználó a 77.18-ban élesített javítás után „működik” visszajelzéssel megerősítette, hogy a nyitott menüben a billentyűzetes léptetés már nem görgeti az oldalt. A menügomb fókuszáról történő ArrowDown/ArrowUp belépés és a fókuszált linkek közötti léptetés acceptance **user-confirmed PASS**. A WEB-011 teljes vizuális/mobil elfogadása és az F1.1 továbbra is nyitott; a nested menü valós mobilnézeti ellenőrzése még szükséges.

### 77.20. F1.1 WEB-003 — oldal másolása új, nem publikált piszkozatként — 2026-10-16

**Leltározott hiány:** az oldalkezelőben volt oldal létrehozás, metaadat-módosítás, sorrendezés és törlés, de meglévő oldal másolására nem volt útvonal vagy művelet. Ez a WEB-003 page lifecycle elfogadási szerződés egy hiányzó szelete.

**Módosítás:** az Admin `POST /api/admin/pages` művelete `sourcePageId` megadásakor a site-on belüli canonical Editor v2 oldalt másolja. A másolat új page ID-t és minden node számára új, helyileg egyedi ID-t kap; a parent/children hivatkozások újramappeltek. Az oldal státusza draft, a published mezők üresek, a publikus navigáció nem módosul. A másolat létrehozása, első revisionje és `page.duplicate` audit eseménye egyetlen D1 batchben készül. A másik site-on lévő forrás 404; hibás vagy foglalt slug nem ír adatot. Az Editor oldallistáján elérhető, feliratozott másolásgomb cím- és slugbekéréssel. Nem mentett aktív módosítás mellett a felület a másolást megállítja, és mentést kér. D1-migráció nem szükséges.

**Automatizált ellenőrzés:** új route- és UI contract tesztek 3/3 PASS; oldal/navigáció regressziók 13/13 PASS; publikus menü/UI 8/8 PASS; `node --check public/editor-v2/app.js`, `git diff --check` és `python3 scripts/check-canonical-plan.py` PASS. A helyi `npm run typecheck` nem indítható, mert a `tsc` nincs telepítve; a Cloudflare Workers Build `npm run typecheck` kapuja még kiadási ellenőrzésre vár.

**Kiadás:** kódcommit `a5b3c26f71424c65eca8f8ac69faa4898cc353fd`. Cloudflare Workers Build `579ee8d1-02b1-4df1-9d5f-6a7721e5f021` success; `npm run typecheck` és `npm run deploy` befejeződött, `No migrations to apply`. Deployment `89748c52-43e7-4bd6-9ab1-a1c4e4d3909d`, Worker version `f1b99e5a-06d6-4f7d-9d93-8d997696667d`, 100% forgalom. GitHub check runok 6/6 `completed / success` (Workers Builds, verify, source-audit, editor-core, canonical-plan, twitch-integration). D1 séma/migráció nem változott.

**Elfogadás és következő lépés:** a felhasználóval a valódi Editorban ellenőrizendő egy publikált oldal másolása, a másolat DRAFT státusza és tartalma, az egyedi slug, valamint hogy az eredeti publikus oldal és menü változatlan marad. A WEB-003 másolási részfunkció és F1.1 addig nem PASS, amíg az éles UI-teszt nem igazolt. A következő fejlesztési szelet a Site/Page lifecycle további nyitott pontjainak tényleges kód/test leltára; nem állítjuk késznek az archiválást, hierarchiát, redirect- és multi-site acceptance-et.

### 77.21. F1.1 WEB-011 — Visual Editor kezelhetőségi újratervezés — 2026-10-16

**Felhasználói probléma:** a szerkesztő túl sűrű, a szövegek és vezérlők kicsik, nehezen különülnek el; a mobilos munkamenetben a panel és a fontos műveletek nem elég áttekinthetők. A Page Duplicate kézi acceptance tesztje a szerkesztő megújítása utánra kerül.

**Bevált vizuális szerkesztők hivatalos útmutatóinak tanulságai:**
- A Figma a bal navigációt, a canvas-t és a jobb, kijelöléstől függő Properties panelt választja szét; a Property labels kapcsoló a tulajdonságok érthetőbb elnevezését szolgálja: https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-explore-layer-properties-in-the-right-sidebar
- A Canva kijelölésfüggő quick actionöket és edit panelt használ; mobilon a további műveletek elkülönített, előhívható sávba kerülnek: https://www.canva.com/help/glow-up/
- A Framer külön kezeli a kijelölést, panninget és zoomot, a vászonillesztést is beleértve: https://www.framer.com/help/articles/how-to-use-the-canvas/
- A Webflow Navigator hierarchiája és canvas-kijelölése összekapcsolt; a panel rögzíthető és átméretezhető, mobilon a tartalmi feladatot külön kell a nagy vászonmunkától kezelni: https://help.webflow.com/hc/en-us/articles/33961320786451-Navigator
- A Webflow vászonleírása kiemeli a canvas, Navigator, breadcrumb és preview egymást kiegészítő útjait: https://help.webflow.com/hc/en-us/articles/33961319255059-Webflow-canvas-overview

**Tervezési döntés:** megmarad a jelenlegi Page Model, szerkesztőmotor és adat-/mentési szerződés; a módosítás az Editor shellt és a vizuális hierarchiát rendezi át. Asztali nézetben nagyobb, jól tagolt bal eszközpanel, vászonvezérlő sáv, Inspector, tágasabb mezők és 14–18 px körüli UI-tipográfia készül. Az oldal műveletei az oldal címe alatti külön, 44 px magas, akadálymentesen címkézett gombsorba kerülnek; az állapotjelölés magyarul jelenik meg. 1024 px-ig a szűk/tablet és mobil nézet vászonvezérlői két sorban, 44 px-es érintési célokkal jelennek meg; a Mentés, Publikálás, Beállítások és oldalválasztás külön, látható vezérlő. Az Oldalak/Elemek/Rétegek/Adásrend/Navigáció panel teljes szélességű, saját görgetésű, címkézett füles alsó munkalap. A változtatás nem módosítja az adatmodellt, Worker API-t vagy D1-migrációt.

**Implementációs jelölt:** `public/editor-v2/editor-refresh.css` desktop/mobil shell-stílus; `index.html` az új stílus és a shell-cache-buster betöltésére; `ui/shell.js` mobil Beállítások panel váltására; `app.js` az oldallista többsoros műveletsorára. A meglévő DOM-azonosítók, Editor funkciók, mentés/publikálás és site/page adatút változatlan marad.

**Automatizált ellenőrzés (helyi, Node 24.19.0):** a teljes meglévő `tests/*.test.js` és `public/editor-v2/tests/*.test.js` csomag 155/155 PASS a projekthez tartozó TypeScript loaderrel. Az első, loader nélküli futás 7 TS importot használó tesztje modulfeloldási hibával bukott; az ismételt, helyes loaderes futásban ezek is PASS. `node --check` az `app.js` és `ui/shell.js` fájlokon, `git diff --check` és `scripts/check-canonical-plan.py` PASS. Helyi `npm run typecheck` nem futtatható, mert a workspace-ben nincsenek telepítve az npm-függőségek; a Cloudflare Workers Build typecheck kapuja kiadás előtt szükséges.

**Elfogadási kapu:** ez egy éles, csak CSS/HTML/Editor-shell módosítás, adatbázis-migráció nélkül; a felhasználó korábbi utasítása szerint a jelenlegi Cloudflare production környezet használható, külön tesztkörnyezet nem indokolt. Kiadás után desktopon és mobilon ellenőrizendő az olvashatóság, vászonméret, bal alsó eszközpanel megnyitása/bezárása, Inspector, oldalválasztás, mentés és publikálás láthatósága, valamint hogy kis képernyőn nincs vízszintes tartalmi túlcsordulás. Az első éles desktop képernyőképen a szűk eszközsáv címkéi és az egy sorba sűrített oldalgombok még zsúfoltak voltak; a második iteráció szélesebb eszközsávot és külön műveletsort vezet be. A felhasználói UI-elfogadás még nem történt meg. A teljes F1.1/Web-011 vizuális/mobil elfogadás addig nyitott marad. A 77.20 Page Duplicate kézi ellenőrzése is függőben van, és csak a szerkesztő UI kézi elfogadása után következik.

**Kiadás utáni ellenőrzés:** a második build után az éles böngésző JavaScript-szintaktikai hibát jelzett. A GitHub API-n keresztüli nagy blob feltöltés bájthossz-ellenőrzése hiányzott; emiatt az `app.js` és a MASTER terv blobja eltért a helyi változattól, noha a Worker typecheck ezt a statikus JS-fájlt nem ellenőrzi. A hibás kiadást bájtonként ellenőrzött feltöltéssel javítottuk; az `app.js` 66 778 bájt / `eb5f8dcaf38a628f7f71571d1b2061d1ac9e0674`, a terv 2 154 445 bájt / `bea16634f7669a793799fc99c17746a6e0583ff4`, mindkét Git blob SHA a helyi `git hash-object` eredménnyel egyezik. A javító commit `bb8c2caf375251834198792a2f8783c72b794721`. A hozzá tartozó Cloudflare Workers Build `ac010a34-862c-41a0-b2f2-599116c8a962` success; `npm run typecheck` és `npm run deploy` sikeres, `No migrations to apply`. Aktív deployment `e60236a6-6fdf-4e60-9402-4a4a8049bd89`, Worker verzió `d7fc3429-0e48-40e8-a908-f028160b1943`, 100% forgalom. GitHub ellenőrzések 6/6 completed/success: Workers Build, editor-core, canonical-plan, verify, twitch-integration és source-audit.

**Éles vizuális ellenőrzés:** a javított `/admin/editor?pageId=page-about` útvonal hibamentesen betöltötte a `Sanci9517 Visual Editor v2` felületet, a lapválasztóban kilenc oldal látható volt. Az Oldalak panel képernyőképén az oldalankénti műveletek külön, legalább 44 px magas gombsorba kerültek; az Inspector jobb oldali panelként megnyílt, a canvas és a vászonvezérlők használhatók maradtak. A konzolban látható diagnosztika `0 hiba`. Ez az automatizált desktop vizuális smoke check PASS; nem helyettesíti a mobilos és felhasználói kézi acceptance-et. A hibás köztes deploy rövid idejű editor-oldali betöltési hibát okozott; a javítás élesítve és böngészőből visszaellenőrizve. D1-adatot és sémát nem érintett.


### 77.22. Editor UI felhasználói elfogadás és keskeny panel finomítása — 2026-10-16

**Felhasználói elfogadás:** a 77.21 után kért desktop- és mobiltesztekre a felhasználó „elfogadom és az ellenőrzés is pass” visszajelzést adott. Az Editor új elrendezésének kézi elfogadása user-confirmed PASS. Ez nem jelenti a teljes WEB-011 vagy F1.1 minden részfeladatának lezárását.

**Indokolt finomítás:** a korábbi desktop képernyőképen a keskeny bal panelben az öt oldalműveleti gomb utolsó eleme levágódott. A rögzített öt oszlop minimumszélessége a térközökkel együtt meghaladta a panel tartalmi szélességét. Az `editor-refresh.css` műveletsora `repeat(auto-fit, minmax(44px, 1fr))` elrendezésre vált: a gombok szükség esetén új sorba kerülnek, a 44 px minimum érintési méret megmarad. A kiadás és az éles vizuális ellenőrzés eredménye külön ellenőrizendő; a felhasználó elfogadását a már tesztelt alapelrendezéshez rögzítjük.

**Folytatás:** a 77.20 Page Duplicate kézi UI-ellenőrzése nyitott. A következő felhasználói tesztben egy publikált tesztoldal másolatát kell létrehozni egyedi címmel és sluggal, publikálás nélkül. Elvárt: PISZKOZAT státusz, a forrás tartalmának másolata, az eredeti oldal és a publikus menü változatlan.

**77.22 kiadási ellenőrzés:** `4d4077a02afa7554b624d6a79aadb6f2da761b7e` kódcommit; GitHub 6/6 completed/success (Workers Builds, twitch-integration, source-audit, editor-core, canonical-plan, verify). Cloudflare build `e962624b-1b0e-427d-b50d-1d56c6e350c7` success, Worker version `2b4d7263-7c92-4264-b44d-e424c031328f`; build és deploy sikeres, `No migrations to apply`. Friss éles böngészőlapon a keskeny Oldalak panelben a Rólam, Főoldal és Adásrend műveletei 3+2 gombos sorba törtek; a másolás és törlés gombja is teljes egészében látható. A gombsor levágódásának vizuális regresszióellenőrzése PASS. Ez a kis javítás nem igényli az elfogadott teljes UI ismételt felhasználói tesztjét.


### 77.23. Page Duplicate felhasználói elfogadás — 2026-10-16

**Bizonyíték:** az oldalmásolás még nyitott kézi UI-tesztjére a felhasználó „Az tesztelve és jo” visszajelzést adott. A 77.20 Page Duplicate részfunkció éles kézi elfogadása user-confirmed PASS. Ez a visszajelzés az oldalmásolásra vonatkozik; új képernyőkép, adatbázis-kivonat vagy külön mérési eredmény nem keletkezett. A korábbi automatizált route- és UI contract tesztek eredménye a 77.20-ban található. Az Editor UI elfogadása továbbra is a 77.22 szerint PASS.

**Következő részfeladat:** WEB-003 visszaállítható oldalarchiválás. A jelenlegi `src/routes/admin/pages.ts` létrehozást, másolást, módosítást és törlést kezel; archiválási/visszaállítási művelet nincs. A törlés navigációs hivatkozások elleni védelmét a meglévő `0021_prevent_deleting_navigation_pages.sql` biztosítja. Az archiváláshoz a tárolási szerződést, az admin listázást, a publikus elérhetőséget, a publikálást és a navigáció hivatkozásait együtt kell kezelni; a visszaállítás nem publikálhat automatikusan. A további hierarchia-, redirect- és multi-site pontok nyitottak maradnak. A WEB-003 teljes funkció és F1.1 nincs lezárva.


### 77.24. WEB-003 — visszaállítható oldalarchiválás, helyi implementáció és ellenőrzés — 2026-10-16

**Státusz:** IMPLEMENTÁLVA / helyi automatizált és Worker–D1 smoke PASS; kódreview, kiadás és böngészős desktop/mobil kézi acceptance NYITOTT. A teljes WEB-003 és F1.1 továbbra is IN PROGRESS. Éles Cloudflare-adat, konfiguráció vagy titok nem változott.

**Meglévő architektúra:** a canonical `pages`, `editor_revisions`, `site_navigation` és `audit_log`, a meglévő admin oldal API, az Editor v2 Oldalak panel és a közös jogosultsági/site-context réteg bővült; nincs párhuzamos oldal- vagy navigációs rendszer. A `0022_page_archive.sql` migráció `archived_at` mezőt, indexet és adatbázisszintű védelmeket ad hozzá. A migráció kizárólag helyi D1-en futott.

**Viselkedés:** `PATCH /api/admin/pages` `{id, action:"archive"|"restore"}` editor jogosultsággal és canonical site-scope-pal működik. Az aktív és archivált oldalak külön listázhatók (`GET` alapértelmezés, illetve `?archived=1`, opcionális `meta=1`). Az archiválás megőrzi az oldal azonosítóját, slugját, draft tartalmát és minden revisionjét, de törli a LIVE snapshot/metaadat/revision hivatkozást és visszavonja a publikálást. Az archivált slug foglalt marad; nincs végleges törlés vagy automatikus redirect. Az aktív sorrend tömörödik; a visszaállított oldal az aktív lista végére kerül. A visszaállítás kizárólag nem publikált piszkozatot állít vissza; a publikus megjelenéshez külön, meglévő Editor publish művelet szükséges. Az archiválás/visszaállítás és audit atomi D1 batch, ismételt azonos állapotkérés nem hoz létre új auditeseményt.

**Navigáció/publikálás:** a 0021 törlési védelmének mintájára az archiválás blokkolt, ha az oldal a site mentett vagy publikált navigációjában akár beágyazottan szerepel. Előbb a menühivatkozást kell eltávolítani és a navigációt publikálni; nincs csendes menüátírás. Az utolsó aktív oldal nem archiválható. Archivált oldal nem szerkeszthető, duplikálható, preview-zható vagy publikálható, és nem kerül a navigáció célpontválasztójába vagy publikus projekciójába. SQL triggerek védik az archiválás és a párhuzamos navigációmentés/publikálás, Editor save/publish/rollback közötti versenyhelyzeteket; hibánál a teljes batch visszagördül. A visszaállítás sem a menüt, sem a publikált állapotot nem állítja helyre automatikusan.

**Editor UI:** címkézett Archiválás művelet, megerősítés, külön Archivált oldalak lista és Visszaállítás piszkozatként gomb. Nem mentett vagy folyamatban lévő mentés esetén az archiválás/visszaállítás megáll. Sikeres aktuálisoldal-archiválás után az Editor aktív oldalra vált. Az app belépési pont cache-verziója frissült.

**Ellenőrzések:** Node 24.19.0 környezetben `npm run typecheck` PASS; `node --experimental-loader ./tests/ts-extension-loader.mjs --test tests/*.test.js public/editor-v2/tests/*.test.js` **166/166 PASS**, 0 failed/skipped (155 meglévő + 9 új SQLite/route integrációs és 2 új végrehajtott UI-action teszt). A meglévő teszt-fixture-ök az új archived_at oszlopra frissültek, állításaik megmaradtak. Tesztelt: tartalom/revision megőrzés, explicit republish, archívumlistázás, nested draft/LIVE menühivatkozás, utolsó aktív oldal, jogosultság/site-izoláció, audit rollback, idempotencia, slugfoglalás, párhuzamos archive/publish/navigation save és dupla archiválás/sorrend. A célzott új tesztek bekerültek a meglévő F0 baseline PR-ellenőrzésbe. `node --check public/editor-v2/app.js`, canonical-plan és `git diff --check` PASS.

**Valódi helyi futás:** a migráció Wrangler 4.130.0 + helyi D1 környezetben sikeres. A futó Workeren egy ideiglenes helyi tesztfelhasználó/session és oldalmásolat segítségével duplicate → explicit publish → public API 200 → archive → public/editor API 404 → archived list → restore → public API továbbra is 404, admin isPublished=false, két megőrzött revision ellenőrzés PASS. A helyi tesztadatokat eltávolítottuk; külső provider vagy éles adat nem vett részt a tesztben. Ez HTTP-integrációs ellenőrzés, nem kézi böngészős acceptance.

**Következő kapu:** a változás review-ja, majd csak külön engedélyezett kiadáskor a 0022 migráció alkalmazása és a hozzá tartozó Worker/asset kód együtt kiadása. Kézzel ellenőrizendő desktopon és mobilon az Archiválás és Visszaállítás gombok olvashatósága, a megerősítés/dirty védelem, az archívumlista, a menüben szereplő oldal érthető blokkolása, az eltávolított és publikált menühivatkozás után sikeres archiválás, az oldal publikus elérhetetlensége, majd a visszaállított PISZKOZAT csak explicit publish utáni megjelenése. A hierarchia-, redirect- és multi-site acceptance továbbra is nyitott; nem indult új történeti audit.


### 77.25. Issue #34 — WEB-003 éles felhasználói elfogadás és mobilfelirat-javítás — 2026-10-16

**WEB-003: CLOSED / user-confirmed PASS.** A #34 issue-ban rögzített felhasználói bizonyíték szerint az éles visszaállítható archiválás és visszaállítás tesztje PASS; a korábbi duplikálási acceptance a 77.23-ban marad. A #32 PR squash commitja `da9a56046330d246c6049d3981a19eff308bc514`, célág `v2/foundation`. A #34 szerint a `0022_page_archive.sql` éles D1-migráció sikeres; az első build a Cloudflare Workers versions API 504 Gateway Timeout hibájával bukott, ugyanazon commit kézi újrafuttatása sikeres lett (build `fc30e8d0-d259-47ab-99cb-9e71c8a219f3`, Worker módosítás `2026-10-16T18:10:45Z`). Ezek az issue-ban közölt kiadási bizonyítékok, nem ebben a munkamenetben lekért Cloudflare-naplók.

A mobilon levágott Archiválás/Újrapublikálás feliratokat a #33 PR javította, squash `41ce68ae49ada3071625d172582b6a2333c2252a`; az issue szerint kiadás után a felhasználó „Jó lett” visszajelzést adott. A távoli `v2/foundation` HEAD-jét és a két squash commit helyi történetét ebben a munkában Gitből ellenőriztük. Más kézi teszteset teljesítését nem állítjuk; a nested menü teljes mobilos acceptance-e, a teljes F1.1 és a későbbi hierarchy/redirect/multi-site munka nyitott marad. A 77.24 korábbi helyi pillanatképe történeti bizonyíték; a jelen lezárás az aktuális állapot, nem ismételt archiválásfejlesztés.

### 77.26. Issue #34 — következő F1.1 szelet: draft/LIVE eltérés az oldallistában — 2026-10-16

**Forrás, owner, hatókör:** 3.2 Oldalak („draft/published eltérés”), WEB-001/WEB-004, a 77.11/77.24 után még nyitott WEB-002 URL-életciklus előfeltétele. A jelenlegi oldallistában minden publikált oldal egységesen ÉLŐ volt, a mentett draft és az élő snapshot eltérése rejtve maradt; egy korábban draft oldal sikeres publikálása után a kliens isPublished értéke tévesen false maradt újratöltésig. Ez bizonyított, kisméretű hiány a meglévő állapotkezelésben; nem új oldal-, navigációs vagy publikálási rendszer.

**Implementáció és acceptance:** az admin lista a meglévő `content_json` és `published_content_json` snapshotokból `hasUnpublishedChanges` jelzést számít; meta-only listában is visszaadja, a snapshotot nem teszi a válaszba. Az Editor ÉLŐ / ÉLŐ · MÓDOSÍTOTT PISZKOZAT / PISZKOZAT állapotot mutat, keskeny panelben tördelhető címkével. A sikeres explicit publish azonnal frissíti az ÉLŐ státuszt; a következő draft mentés ismét jelzi az eltérést, a publikus tartalom változtatása nélkül. Publish-hiba nem jelez sikert és nem törli a helyi dirty állapotot. Az oldalbeállítások művelete az aktuális oldalon még nem mentett változásokkal, illetve folyamatban lévő mentés alatt már a prompt előtt megáll; nem cseréli le ezeket egy metaadat-válaszra. Nincs adatbázismigráció, provider-, secret-, jogosultság- vagy élesadat-változás. A listajelzés mentett snapshot-eltérést jelent (a revision is része), nem szerkezeti dokumentumdiffet.

**Helyi ellenőrzés:** TypeScript és JavaScript syntax PASS; teljes loaderes route/Editor regresszió **171/171 PASS**, 0 failed/skipped. Az öt új tesztből egy a valódi route SQL-jét SQLite-on futtatja: save → metadata/slug change → publish → rollback → unpublish állapotok, publikus URL draft/published izoláció, site-scope és meta-only válasz; négy a tényleges UI-függvényeket futtatja: publikálás/új draft mentés, publish-hiba, dirty/in-flight metaadatvédelem, három állapot felirata. A célzott UI-teszt a meglévő F0 baseline workflow-ban is szerepel. Canonical-plan checker és diff-check PASS. Ez nem kézi mobilböngészős elfogadás és nem új telepített tesztkörnyezet.

**Következő nyitott feladat és előfeltételek:** WEB-002 szülő/gyermek oldalhierarchia, a WEB-012 route-kezelésre és WEB-013 redirect-szerződésre építve (63. fejezet WEB-002 kártyája). A jelenlegi kódban nincs page parent mező vagy redirect-tároló; a `/p/<slug>` lapos, publikált slugot használ, az `site_navigation` fastruktúrája menühierarchia, nem oldalhierarchia. Következő implementáció előtt a MASTER-ben kell rögzíteni a szülőoldal és a publikus útvonal viszonyát, a draft/published parent-snapshotot, a szülő átnevezésének/archiválásának/törlésének gyermekhatását, az URL-foglalást és régi slugok átirányítását. Minimum acceptance: ciklus és idegen site parent elutasítva, draft nem változtat LIVE útvonalat, átnevezés nem hagy hibás hivatkozást, archivált cél nem lesz publikus. Ezeket nem állítjuk implementáltnak; az új státuszjelzés a biztonságos felhasználói URL-módosítás előfeltétele, a teljes WEB-002/WEB-013 továbbra is OPEN.

**Review/kiadás állapota:** GitHub API-hozzáférés a környezet proxyján CONNECT 403 hibával blokkolt, ezért PR-létrehozás, CI-eredmény, egyesítés és az új változás automatikus Cloudflare Production deployja jelenleg UNVERIFIED / BLOCKED. A hálózati akadályt a 171 helyi teszt nem helyettesíti. A #34-ben közölt korábbi éles elfogadás a 77.25 szerint érvényes; a jelen változáshoz új deploy-sikert nem állítunk. Következő kiadás után telefonon a hosszú oldallistastátusz olvashatósága, a LIVE oldal draft módosítása és a külön publikálás utáni státusz ellenőrizendő.

### 77.27. Issue #36 — WEB-002 oldalhierarchia alapja — 2026-10-16

**Kiinduló bizonyíték és szerződés:** A #36 issue szerint a #35 PR a `67d2eaed5f2ef16a2be4df94ce212a8e44118ce8` commitként a `v2/foundation` ágba került; négy check PASS, Cloudflare production build `66d244f0-8e7d-4f54-8616-4039a5e04182` sikeres. A felhasználó a draft/LIVE státuszt és a külön mentés/publikálást „Működik” visszajelzéssel ellenőrizte. Ez az issue-ban közölt acceptance, nem a jelen munkában lekért Cloudflare-napló.

A WEB-002 jelen szeletében az oldal szülője a `pages` rekord site-scoped kapcsolata, **nem** a `site_navigation` menüfája. A draft `parent_page_id` és az explicit oldalpublikáláskor másolt `published_parent_page_id` külön állapot. Meglévő oldalak gyökérek maradnak; a publikus `/p/<published_slug>` útvonal és a canonical/menülink továbbra is lapos, így szülőváltoztatás vagy szülőcím/slug draft átnevezés nem módosítja és nem szakítja el a LIVE URL-t. Szülőválasztás csak piszkozat, a LIVE viszonyhoz külön oldalpublikálás kell. A draft/LIVE jelzés a két szülő snapshot eltérését is figyeli. Külön hierarchikus publikus URL-t és átirányítást ez a szelet nem állít.

**Függőségi és URL-döntés:** a gyermek draft szülője csak aktív, azonos site-beli oldal lehet; önhivatkozás/ciklus tiltott. Gyermek publikálásához aktív, publikált szülő kell, és a publikált fának is ciklusmentesnek kell maradnia. Szülő archiválását/törlését gyermek draft vagy published referencia, publikálásának visszavonását LIVE gyermek blokkolja; előbb gyermekeket kell áthelyezni, a LIVE kapcsolatot külön publikálni, vagy a gyermek publikálását visszavonni. Archivált oldal publikus tartalma továbbra sem jelenik meg. A szülő slug változása nem írja át a gyermek URL-jét. A későbbi WEB-013-nál a régi publikált slug foglalását, redirect-regisztert, lánc/hurok/404/canonical/sitemap szabályt és backfill/rollbackot külön kell megtervezni; amíg ezek nincsenek igazolva, **hierarchikus URL-t nem kapcsolunk be**, a teljes WEB-002/WEB-013 acceptance OPEN.

**Megvalósítás:** a `0023_page_hierarchy.sql` additív, nullable mezőket és indexeket vezet be, a meglévő adatok újraírása nélkül. SQLite/D1 triggerek zárják a route-ellenőrzések és egyidejű archive/publish közti rést. Az admin oldallista szülőt és published szülőt ad vissza; a mobilon is elérhető Szülő művelet csak draftot ment. A meglévő Editor publish ugyanazon atomi batch-ben másolja a published parentet, és a betöltött draft szülőegyezését is ellenőrzi, hogy egy másik szerkesztő közbeni átrendezését ne publikálja észrevétlenül. Az archive és delete közös életciklusát guard védi. A migráció a forrásban van; éles D1-futtatását és az új Worker telepítését csak kiadási bizonyíték után lehet késznek nevezni.

**Helyi ellenőrzés:** teljes loaderes route/Editor regresszió **176/176 PASS**, 0 fail/skip; `npm run typecheck`, JavaScript syntax, canonical-plan checker és `git diff --check` PASS. A valódi migrációsor lokális Wrangler D1-ben a `0023`-ig PASS, az ismétlés `No migrations to apply`. A célzott tesztek külföldi/hiányzó szülőt, draft és published ciklust, stale szerkesztői publikálást, explicit snapshotot, archive/delete/unpublish függőséget és publikus URL izolációt vizsgálnak. Ez helyi bizonyíték, nem production vagy telefonos elfogadás.

**Kiadás és igazolt állapot:** A [#37 PR](https://github.com/sanci9517/sanci9517/pull/37) mind az öt PR-checken PASS (canonical-plan, editor-core, verify, twitch-integration, Workers Builds), majd `53d03b98359f770f3985a98d4f4a883977e53855` squash commitként a `v2/foundation` ágba került 2026-10-16 19:21:09 UTC-kor. A merge commit mind a hat checkje PASS, köztük a Cloudflare Production Workers build `a5dfb378-7644-45f4-82ab-f74bc28ce8b9` (GitHub check 2026-10-16 19:21:37 UTC-kor success). Az éles `sanci9517-streamer-brand.sandor-bogadi95.workers.dev/editor-v2/app.js` HTTP 200 választ adott és tartalmazta az új Szülőoldal műveletet; `/api/health` 200 `ok:true`, a meglévő `/api/public/pages?slug=youtube` 200. Ez az új kliensasset és a működő publikus API production smoke-ja. A build check sikeressége a meglévő Cloudflare build/parancs szerinti deploy bizonyítéka; a `0023` éles D1 alkalmazását külön read-only D1 lekérdezés és a szerkesztői művelet kézi ellenőrzése még nem bizonyította. Éles adatot kézzel nem módosítottunk.

**Állapot:** WEB-002 hierarchy foundation MERGED / production build és HTTP smoke PASS; D1 direkt ellenőrzés és telefonos hierarchia-elfogadás OPEN. Teljes WEB-002, WEB-013 és F1.1 OPEN. Telefonon ellenőrizendő: mobil oldallistában a Szülő gomb és a szülőfelirat olvasható; LIVE gyermek szülőjének piszkozat módosítása után a LIVE oldal és URL változatlan, majd külön Újrapublikálás után az eltérésjelzés megszűnik; gyermekes szülő archiválása/visszavonása érthető hibát ad. A #37 build és HTTP smoke nem helyettesíti a telefonos interakciót.


### 77.28. Issue #39 — WEB-002 publikált slug-életciklus és WEB-013 biztonságos átirányítási alap — 2026-10-16

**Kiinduló állapot:** A felhasználó a #39 feladatban megerősítette, hogy a #36/#37/#38 szülőoldal-alap telefonos tesztje PASS. Ezt nem ismételtük meg, és nem tekintjük a teljes WEB-002 lezárásának. A 77.27 szerint a publikus `/p/<published_slug>` útvonal lapos; a mentett draft slug külön él, de a korábbi publikált URL-ekhez még nem volt history/redirect. A 49. fejezet WEB-002/WEB-013 és a 63.50.82/103–104/114 URL-függőségi szerződéséből most a visszafordítható, additív slug-előzmény és HTTP átirányítás készült el.

**Döntés és határ:** A `0024_page_slug_redirects.sql` új `(site_id,from_slug) → page_id` előzménytáblát ad, meglévő Page vagy Revision adatot nem ír át. Az átirányítás célja nem szabadon beírható URL vagy másik alias: a céloldal **aktuális** publikált slugja, ezért az előzmények legfeljebb egy lépésben oldódnak fel, redirect-lánc és nyílt átirányítás nélkül. A táblát és a draft/published slug névteret D1 triggerek védik a másik oldal élő/draft/korábbi slugjának elfoglalása, a site-eltérés és a history-s oldal végleges törlése ellen. Egy oldal a saját korábbi slugját visszaveheti: az alias törlése, a régi publikált slug új aliasa és a publikált snapshot váltása ugyanabban az atomi Editor publish batch-ben történik. Sikertelen publish minden revision-, snapshot- és URL/history-írást visszagörget.

A draft slug mentése nem hoz létre redirectet és nem változtat LIVE útvonalat. Az új `/p/<slug>` HTML route 308-at ad a régi publikált slugra, kizárólag aktív és publikált, azonos site-beli oldalhoz, relatív `/p/<current>` Locationnel és `no-store` cache-szabállyal; ismeretlen, archivált vagy nem publikált cél 404, preview nem követ történeti aliast. A tartalom-API továbbra is csak a közvetlen publikált vagy jogosult draft slugot szolgálja ki; a menü az aktuális published slugra mutat. Az Editor a draft és az ÉLŐ URL eltérését a mobil oldallistában jelzi. A szülőkapcsolat és a publikus URL továbbra is külön fogalom; nincs hierarchikus URL-bevezetés.

**Korlátok és következő kapu:** A `pages.slug` örökölt globális UNIQUE megszorítása megmarad, ezért a teljes több-site slug-névtér még nem kész; az új redirect-regiszter és resolver viszont site-scoped. A korábbi, migráció előtti ismeretlen URL-történet nem állítható helyre automatikusan. WEB-013 broken-link riport, published-only canonical/SEO metadata és sitemap/robots, továbbá a globális UNIQUE biztonságos több-site átalakítása továbbra is OPEN; a teljes WEB-002/WEB-013/SEO acceptance nem zárható le ezzel a szelettel. Következő MASTER-pont: WEB-013 hibás belső linkek kimutatása és SEO-001/SEO-004 publikus canonical/sitemap szerződés, csak igazolt éles D1 státusz és adatvesztésmentes több-site döntés mellett.

**Helyi igazolás:** a valódi route SQL SQLite-on lefut; az új célzott tesztek a draft/LIVE elkülönítést, első és ismételt átnevezést, egy lépéses vissza-átirányítást, saját alias visszavételét, idegen/site-ütközést, nyílt cél kizárását, audit/redirect hiba atomi rollbackjét, unpublish és archive/restore 404-jét vizsgálják. Teljes loaderes regresszió **182/182 PASS**, 0 fail/skip; `npm run typecheck`, JavaScript syntax, canonical-plan checker és diff-check PASS. A teljes migrációsor a `0024`-ig izolált helyi Wrangler D1-ben PASS; megismételve `No migrations to apply`. A környezetben a Wrangler szerint nincs Cloudflare-hitelesítés, ezért a production D1 séma közvetlen read-only ellenőrzése itt nem igazolt.

**Kiadási állapot a fejlesztői commit idején:** WEB-002/WEB-013 URL-redirect foundation IMPLEMENTED / LOCAL TEST PASS; PR, CI, merge, éles build/HTTP smoke és telefonos elfogadás OPEN. Csak a ténylegesen bizonyított kiadási eredmény frissítheti ezt az állapotot.


**#39 kiadás és igazolt állapot (2026-10-16):** A [#40 PR](https://github.com/sanci9517/sanci9517/pull/40) mind az öt ellenőrzésen PASS, majd `62d9210b00f3674bf2b19ee06a5e48a22c9018cd` squash commitként a `v2/foundation` ágba került 20:07:40 UTC-kor. A merge commit mind a hat checkje PASS, benne a Cloudflare Production Workers build `b4401af2-4685-44aa-b630-f578f5e0c249`. Éles HTTP smoke: `/api/health`, `/api/db-health` (`connected:true`), `/api/public/pages?slug=youtube` és `/p/youtube` 200; nem létező `/p/issue39-nonexistent-check` valódi 404; a kiszolgált `/editor-v2/app.js` 200 és tartalmazza az új ÉLŐ URL-jelzést. A Cloudflare build check és az éles asset a telepítés bizonyítéka, de a `0024` tábla/triggerek direkt éles D1 lekérdezése, illetve valódi régi slug 308-as telefonos tesztje még nem történt meg. Éles adatot kézzel nem módosítottunk. **WEB-002/WEB-013 redirect foundation MERGED / production build és HTTP smoke PASS; telefonos elfogadás OPEN; a teljes WEB-002/WEB-013/SEO és F1.1 továbbra is OPEN.**


### 77.29. GitHub #42 — Editor shell UX és tartós böngészős no-overlap kapu — 2026-10-17

**Prioritás és állapot:** a PC Visual Editor egymásra csúszó és zsúfolt vezérlőinek javítása a következő F1.1 minőségi kapu. Az új felület implementációja a #44 PR-ben egyesült; helyi böngészős ellenőrzés, CI és Cloudflare Production build PASS. A felhasználói PC-s elfogadás külön igazolandó. A korábbi 77.22 elfogadás a korábbi kiadásra vonatkozott, az új #42 felületét nem minősíti automatikusan PASS-nak. A #39 URL-elfogadás és további WEB-013 munka ezután következik.

**Megoldás:** a meglévő Editor, Page Model, Inspector, Layers, canvas, mentési és publikálási szerződések maradnak. A három egymásra felülíró shell-stílus helyett az Editor egyetlen betöltött reszponzív shell-stíluslapot használ. Desktopon átlátható fejléc, külön Mentés és Publikálás, oldalkiválasztás, visszavonás/újra, előnézet, nyitható és átméretezhető bal panel, vászon és Inspector. A ritkább műveletek látható Továbbiak menüben vannak. Tablet/mobil nézetben a panelből saját görgetésű drawer lesz, egyszerre csak egy panel nyílik; a fix alsó sáv Undo/Redo/Illesztés/Előnézet műveleteket ad, a Mentés és Publikálás a fejlécben látható marad. A panel címsora görgetés közben is elérhető. Nincs adatmodell-, API-, D1-, jogosultság- vagy élesadat-változás.

**Tartós minőségi kapu:** a `test:editor:layout` valódi Chromium böngészőben 1920, 1600, 1440, 1366, 1280, 1100, 1024, 900, 768, 430, 390 és 360 px névleges szélességet vizsgál 100%, 125% és 150% effektív méretnél (36 kombináció). A teszt hosszú magyar oldal- és státuszszöveggel ellenőrzi a látható interaktív vezérlők bounding boxait, középponti kattinthatóságát, kivágást, egymásra csúszást, a dokumentum vízszintes túlcsordulását, a Mentés és Publikálás állandó láthatóságát, a mobil érintési célok méretét, a panelek és menü nyitott állapotát, valamint a panel saját görgetését. A mobil drawer és a Továbbiak menü szándékosan takarja a vászonvezérlőket; ezt a teszt kódja dokumentált kivételként kezeli, a fejléc és az alsó alapműveletek ellenőrzése közben is folytatódik. A teszt CI-kapu az Editor Core workflow-ban; a fontos desktop/tablet/mobil képernyőképek artifactként mentődnek.

**Helyi bizonyíték:** a 36 böngészős kombináció és nyitott panel/menü állapot mérése Chromiumban PASS; a 1440/768/390 px képernyőképeket vizuálisan átnéztük. A korai tesztfutások két valódi hibát találtak: 1366 px-en az új oldal gomb takarását, illetve keskeny mobilon a Publikálás régi CSS általi elrejtését; mindkettő javítva és újramérve. `npm run typecheck` és a meglévő teljes regressziós csomag 182/182 PASS; canonical-plan ellenőrzés és `git diff --check` PASS. A statikus fixture nem hitelesített Editor-backend, ezért ez layout- és interakciós shell-ellenőrzés, nem mentés/publikálás round-trip vagy felhasználói acceptance. A bejelentkezett Editor teljes betöltése és a felhasználói PC-s interakció külön elfogadási pont.

**Kiadási bizonyíték:** a [#44 PR](https://github.com/sanci9517/sanci9517/pull/44) öt PR-checkje PASS (canonical-plan, editor-core böngészős kapuval, verify, twitch-integration, Workers Builds), majd `f0543b9dc9aff7deced6dc22443e76fe25255f7c` squash commitként a `v2/foundation` ágba került 2026-10-17 10:51:08 UTC-kor. A merge commit mind a hat checkje PASS, köztük a Cloudflare Production build `cb95b8be-84a7-4924-98e7-013ac3e0014d`. Az éles `/editor-v2/editor-refresh.css` 200 és az új `Issue #42` shell-kódot szolgálja; `/api/health` és a meglévő `/p/youtube` 200. Az `/admin/editor` hitelesítés nélkül 302-vel a bejelentkezésre irányít; a hitelesített Editor-tartalom és a felhasználói PC-s elfogadás ezért UNVERIFIED / OPEN. D1-adatot, jogosultságot, secretet nem módosítottunk. Következő pont: #39 régi URL telefonos redirect-tesztje, majd WEB-013 broken-link riport és SEO canonical/sitemap a 77.28 függőségei szerint.

### 77.30. WEB-013 — publikus SEO és működő linkellenőrzési kapu — 2026-10-17

**Kiinduló igazolt állapot:** a #62–#77 változások már egyesültek; a `779e38a` MASTER-összevezetés szerint a teljes F1.1/WEB-013 elfogadás nyitott. A publikus HTML a publikált oldal helyett általános `<title>` értéket adott, előnézetnél és 404-nél canonical címkét tett a válaszba. A sitemap csak az első 1000 publikált oldalt sorolta fel. A hibáslink-riport tesztjei főként forrásszöveg-szerződéseket ellenőriztek.

**Megvalósított fejlesztési egység:** a `/p/{slug}` HTML a meglévő publikus Page API publikált title/description értékeit szerveroldalon, HTML-escape-pel teszi a title, description, Open Graph és canonical mezőkbe. A jogosult előnézet a draft címet mutatja, de noindex és nem kap canonical/OG URL-t; a 401/403/404 HTML ugyancsak noindex és canonical nélküli. A sitemap site-scoped, publikált, aktív oldalakra kurzoros lapozással működik, és a protokoll 50 000 URL-es felső határánál hibával jelez, nem ad csendesen hiányos listát. A rich-text linkkinyerés csak tényleges `href` attribútumot vesz figyelembe, `data-href`-et nem. Az Adminon a riport megnevezése és mobilos hosszú URL-tördelése az ellenőrzött tartalomhoz igazodik. A Save és Publish, az Editor és az éles adatok változatlanok; nincs D1-migráció.

**Ellenőrzési szerződés és helyi eredmény:** a `test:web013` **18/18 PASS**; valós Worker-útvonalakat és route SQL-t futtat memóriabeli SQLite-adatokon. Publikált és draft SEO-metaadatot, injekciómentes escape-et, preview/404 noindexet, 308-at, sitemap/robots site- és publikációs szűrését, 1000 feletti sitemapet, szerkesztői jogosultságot, publikált rich-text linket, redirectet, hibás célt és idegen site/navigáció kizárását vizsgálja. A `test:web013:browser` **1/1 PASS** Chromiumban 360/390/430/1280 px szélességen, hosszú hibás URL-lel és működő riportgombbal; a böngészőteszt csak az Admin felülethez ad mock API-választ. A szélesebb `tests/*.test.js` futás **148/148 PASS**, az Editor Core **49/49 PASS**, TypeScript, kanonikus terv és Admin-szerződések PASS. A széles regresszió először egy korábban hibásan escape-elt auth-teszt regexnél nem indult; a teszt szintaxisa javítva, majd a teljes futás PASS. Ezek helyi bizonyítékok; a tényleges éles HTML és bejelentkezett Admin böngészős vizsgálata külön elfogadási kapu. A teljes WEB-013/F1.1 továbbra is **OPEN**.

**Kiadási bizonyíték:** a [#79 PR](https://github.com/sanci9517/sanci9517/pull/79) mind az öt PR-checken PASS, majd 2026-10-17 13:48:56 UTC-kor `cc7d0c7e38fb49d5d74d90552d4dcc0f0088b1ad` squash commitként a `v2/foundation` ágba került. A merge commit mind a hat ellenőrzése PASS; a [Cloudflare Production Workers build](https://dash.cloudflare.com/64bbd6a12ac732ed2cac4ca25d8bfa7e/workers/services/view/sanci9517-streamer-brand/production/builds/0d67adad-37ce-4931-830b-5e8f1c40fee9) success. A futtatókörnyezet proxyja az éles HTTP-lekérést 403-mal blokkolta, a közvetlen kapcsolat sem sikerült; a publikus HTML és hitelesített Admin tényleges éles viselkedése ezért **UNVERIFIED**, nem PASS. Éles D1-migrációt, adatot vagy secretet nem módosítottunk. WEB-013/F1.1 teljes elfogadás **OPEN**; telefonon ellenőrizendő a publikált oldal címe/leírása, a régi URL 308 célja, az Admin riport hosszú linkjeinek olvashatósága és a külön mentés/publikálás.

### 77.31. WEB-013 — strukturált linkek és site-scoped URL-szolgáltatások — 2026-10-17

**Éles kiinduló bizonyíték a `9a6a730` kiadásról:** a Workers domain 2026-10-17-i olvasási célú HTTP-vizsgálatában a `/p/youtube` 200-as, publikált title/description/OG/canonical HTML-t adott. A `/sitemap.xml` 10 URL-je mind 200-as, saját canonical URL-lel és `index,follow` szabállyal; a `/robots.txt` 200. Nem létező `/p/...` 404 és noindex, jogosulatlan `?preview=1` 401, `/api/admin/link-report` 401, `/admin` 302. Ez **publikus SEO/404/hozzáférési határ HTTP PASS** az ellenőrzött állapotban. Valódi történeti slug 308-as éles ellenőrzés és hitelesített Admin-riport továbbra is **UNVERIFIED**; a korábbi 77.30 hálózati akadály erre a későbbi vizsgálatra már nem vonatkozik.

**Fejlesztési blokk:** a kanonikus Editor Rich Text `inline.link.href` eddig nem jelent meg kattinthatóan a publikus rendererben és a hibáslink-riport sem vizsgálta. A publikus megjelenítés most a strukturált bekezdés, címsor, idézet, kód és lista szövegét/engedélyezett `http(s)` linkjeit escape-pel és biztonságos újablak-szabállyal jeleníti meg; tiltott URL-ből csak szöveg lesz. A riport a publikált strukturált Rich Text-linkeket, az azonos originű abszolút `/p/` URL-eket és a navigáció URL-típusú belső linkjeit is vizsgálja; az idegen origint kizárja, a helyes történeti átirányítást külön jelzi. Az eredeti draft/LIVE és jogosultsági határ megmarad. A publikus oldal-, navigáció-, sitemap-, adásrend- és redirect-szolgáltatások most explicit site ID-t tudnak fogadni; a Worker jelenleg változatlanul a kanonikus `site-default` kontextust adja át.

**Igazolás és nyitott kapu:** lokális WEB-013 Worker/SQLite **19/19 PASS**, Chromium Admin+publikus Rich Text **2/2 PASS**, széles tesztcsomag **149/149 PASS**, Editor Core **49/49 PASS**, Editor böngészős layout, TypeScript és kanonikus terv PASS. A tesztek idegen site oldalát és slug-előzményét az explicit site-szolgáltatásokon is kizárják. Ez a blokk nem aktivál több publikus domaint: a `pages.slug` örökölt globális UNIQUE korlátja, a verifikált domain→site feloldás és a globális `site_settings` szétválasztása még hiányzik. A `pages` tábla éles újjáépítése adat- és FK-kockázat, ezért a teljes multi-site URL acceptance **OPEN**, és a migráció csak adatmegőrző preflight/rollback terv, izolált D1 próba és szükséges jóváhagyás után telepíthető. A bejelentkezett Admin-riport és egy valódi régi URL éles elfogadása szintén nyitott. Teljes WEB-013/F1.1 **OPEN**; következő aktív pont: verifikált domain/site feloldás és globális slug-egyediség biztonságos feloldása, a fennmaradó Admin-éles teszt mellett.

**Kiadási bizonyíték:** a [#81 PR](https://github.com/sanci9517/sanci9517/pull/81) mind az öt checken PASS és konfliktus nélkül egyesült 2026-10-17 14:18:46 UTC-kor `c0021b4708c85b4c5f0ab4fa1f31ba6eef1dbc9b` squash commitként a `v2/foundation` ágba. A merge commit mind a hat ellenőrzése PASS, köztük a [Cloudflare Production Workers build](https://dash.cloudflare.com/64bbd6a12ac732ed2cac4ca25d8bfa7e/workers/services/view/sanci9517-streamer-brand/production/builds/aa81221b-0319-4f57-a0fc-6fc5de464bfe). A telepítés utáni olvasási célú HTTP-próba szerint az új `page-renderer.js` és `admin-link-report.js` assetek ténylegesen élesek; a `/p/youtube` 200-as canonical/index HTML, a sitemap mind a 10 URL-je 200-as saját canonical/index HTML, a robots 200, a hiányzó oldal 404/noindex, a jogosulatlan preview és Admin-riport 401. A publikált strukturált Rich Text-link valós tartalmon, egy történeti URL 308-as átirányítása és a bejelentkezett Admin-riport éles felhasználói elfogadása **UNVERIFIED**. Éles D1-adatot/migrációt és secretet nem módosítottunk; a teljes WEB-013/F1.1 és a multi-site URL-elfogadás **OPEN**.

### 77.32. WEB-013 — hitelesített domain/site és site-scope slug migráció előkészítése — 2026-10-17

**Tényleges séma és határ:** a forrásmigrációkból tranzakciósan újraépített SQLite sémában a `pages.slug TEXT NOT NULL UNIQUE` globális, míg a publikált slug és a történeti redirect már site-scoped. A `pages` önmagára, az `editor_revisions` és a `page_slug_redirects` pedig rá hivatkozik; 11 kapcsolódó index és 14 trigger megőrzendő. A `site_settings` még globális, és az Admin route-ok a `site-default` kontextust használják. A Wrangler jelen futtatókörnyezetben nincs hitelesítve, ezért a **közvetlen éles D1-séma és adatszám UNVERIFIED**; a helyi séma nem állítja ezeket bizonyítottnak.

**Biztonságosan szállítható kód:** a Worker a saját, pontos Cloudflare-hostját továbbra is a meglévő `site-default` webhelyhez köti. Ismeretlen host nem kap alapértelmezett site-ot, hanem 421/noindex választ. További domain csak explicit telepített host-binding és a D1 `site_domains` táblájában `verified` státusz, `verified_at` és aktív site egyezése esetén választható; az `X-Forwarded-Host` fejlécet a feloldás figyelmen kívül hagyja. A publikus oldal/navigáció/sitemap/redirect az előző blokk explicit site ID-ját használja. Más site Admin/auth/integration és draft preview útvonala 403 a későbbi site-tagsági jogosultságig; publikus beállítása csak a site nevét vetíti ki, a régi globális beállítások a default site-on maradnak. Az éles többsite üzembe helyezés még nem aktivált.

**Migrációs és adatmegőrzési terv:** a kizárólag kézi jóváhagyás után futtatható `scripts/pending/0025_site_domains_and_site_slug.sql` a pages/revisions/redirects teljes sorait tranzakción belül pillanatképezi, az FK-ciklus és önhivatkozások miatt a három táblát együtt építi újra, az összes oszlopot, publikált snapshotot, szülőkapcsolatot, redirectet, indexet és triggert visszaállítja, majd `(site_id,slug)` UNIQUE indexet és ellenőrzött domainregisztert hoz létre. A futtatás végén FK-őr hibára megszakítja a tranzakciót; a script nincs a `migrations/` könyvtárban, így a Cloudflare automatikus deploy nem alkalmazza. A `scripts/web013-site-scope-preflight.sql` csak olvas: quick/FK check, tényleges séma és index/trigger leltár, sorok, site- és kapcsolati hibák, duplikált site slugok. Éles végrehajtás előtt a preflight összes eredményének ellenőrzése, friss D1 export és PITR/visszaállítási pont bizonyítása, írások átmeneti befagyasztása, friss exporttal lokális teljes sor-/kapcsolat-összehasonlító dry-run, majd külön jóváhagyás szükséges. Sikertelen, még nem commitolt migráció tranzakciósan ROLLBACK; commit utáni hiba esetén a verifikált pre-migrációs D1 PITR/backup visszaállítása és az előző Worker-verzióra rollback a terv. Az új, két site-on azonos slugot tartalmazó írások után a régi globális UNIQUE séma csak adatvesztéssel lenne visszaállítható, ezért az ilyen írások az elfogadásig tiltandók.

**Helyi igazolás és nyitott kapu:** a migrációs teszt a jelenlegi teljes sémát és seedelt tartalmat tranzakciósan építi, szülőkapcsolatot és régi redirectet ad hozzá, minden oldal/revízió/redirect/navigáció sorát és a 11 indexet/14 triggert összeveti, FK-t ellenőriz, ugyanazon site duplikációját tiltja, két site azonos slugját engedi, és külön tranzakciós ROLLBACK-et próbál. A Worker route-teszt az átfedő sluggot, idegen site redirectjét, hibás, visszavont és ismeretlen domain elutasítását ellenőrzi. WEB-013 **22/22 PASS**, széles regresszió **152/152 PASS**, Chromium WEB-013 **2/2 PASS**, Editor **49/49 PASS**, Editor layout **1/1 PASS**, Admin home **16/16 PASS**, TypeScript és kanonikus terv PASS. Éles D1-adat, migráció, secret és új domain nem módosult. A három nyitott éles elfogadás — valódi régi URL 308, hitelesített Admin-riport, valós publikált Rich Text-link — **UNVERIFIED**; teljes WEB-013/F1.1 **OPEN**. Következő aktív pont: éles D1 read-only preflight/backup/PITR és migrációs jóváhagyás, majd az Admin/site settings tenant jogosultság és új domain életciklus külön igazolása.


### 77.44.UX-P0.6.B — Aktuális Editor-kiegészítés — 2026-10-18

A WEB-011/76.06 Page Model–Editor modul aktuális felhasználói hibajelzése a vászon–Inspector szövegszinkron és az Inspector használhatósága. Az élő kétirányú gépelés, kijelöléshez kötött formázás, háromfüles szövegeszköztár, stíluskategóriák és nyolc reszponzív szövegszerep helyben implementált; Editor core 66/66, böngészős Editor 6/6 és TypeScript PASS. A részletes döntés, összehasonlító források, korlátok és kiadási bizonyíték az egyetlen kanonikus belépési pont [77.44.UX-P0.6.B fejezetében](../SANCI9517-CREATOR-PLATFORM-PLAN.md#7744ux-p06b--élő-szövegszerkesztés-és-tagolt-tartalomhoz-kötött-inspector-2026-10-18) található; ez annak fejezetkiegészítése, nem második terv. A teljes Editor OPEN, a natív telefonos/PC felhasználói elfogadás és a WEB-013 három éles tesztje UNVERIFIED. Következő aktív pont: a szövegfolyamat készülékes elfogadása és a hiányzó elrendezési/elem-specifikus paritás, majd a webhelyszintű szerkeszthető design tokenek. Save és Publish külön, éles D1-/secret-/jogosultság-változás nincs.

**77.44.UX-P0.6.B kiadási kiegészítés:** #117 MERGED, `d1d112af7d4bcc3d7dbdf6ad87c131106a3a09fc`; öt PR- és hat merge-check PASS, Cloudflare Production build `9fd1ab9f-bfda-4f15-bb9b-b57696e6966e` success. Az új Editor-assetek és a meglévő publikus oldal/health végpont olvasási célú éles HTTP-smoke 6/6 PASS 2026-10-18 16:16:11 UTC-kor; a hitelesített élő Editor és készülékes felhasználói elfogadás továbbra is UNVERIFIED. A részletes bizonyíték a fenti kanonikus 77.44.UX-P0.6.B pontban szerepel.


### 77.44.UX-P0.6.C — Reszponzív elrendezés és Inspector-kapcsolatok — 2026-10-18

A WEB-011/76.06 következő részblokkja nyolc visszavonható desktop/tablet/mobil elrendezésmintát, tényleges szülőhöz és displayhez igazodó Flex/Grid mezőket, szülőkijelölést, rácshely-figyelmeztetést és nézetenkénti atomi gyermek-auto-elhelyezést ad. A verziózott layout-jelölés csak explicit mintaválasztáskor kapcsolja be a tárolórészfa új publikus renderelését; a régi dokumentumok nem állnak át betöltéskor. Core 69/69, Chromium Editor 7/7, TypeScript PASS; a böngésző 8×3 mintán mér tényleges vászon–publikus CSS- és geometriaparitást. A részletes működés, korlátok, bizonyítékok és kiadás a kanonikus belépési pont 77.44.UX-P0.6.C fejezetében szerepel. A teljes Editor/F1.1 és WEB-013 elfogadása OPEN; kézi PC/telefonos teszt UNVERIFIED. Következő aktív pont az elem-specifikus/gyökérkimenet paritása és az új workflow elfogadása, majd a 76.08 közös webhelystílusai; ezek nem kész funkciók. Nincs éles D1-/secret-/jogosultság-változás, Save és Publish külön.

**77.44.UX-P0.6.C kiadási kiegészítés:** #119 MERGED, `f0609a57055cfd3fc92cd9b43047aeb98f0845c1`; öt PR- és hat merge-check PASS, Cloudflare Production build `72d167f4-90b4-41b4-b355-4521eacd2999` success. Olvasási célú éles HTTP-smoke 7/7 PASS 2026-10-18 16:40:18 UTC-kor: új layout-assetek, health és meglévő canonical publikus oldal. Éles tartalmat nem írtunk át mintával; a hitelesített Editor és újonnan publikált layout készülékes elfogadása UNVERIFIED. Részletes bizonyíték a kanonikus 77.44.UX-P0.6.C pontban.


### 77.44.UX-P0.6.D — Elem-specifikus tartalom/Inspector és publikus paritás (2026-10-18)

**STÁTUSZ: IN PROGRESS / felhasználói elfogadás OPEN.** A 77.44.UX-P0.6.C után a WEB-011 hiányzó statikus elem-specifikus szerkesztőjét és publikus megjelenítését készítjük. A kutatásban a Wix Studio kontextusfüggő Inspector, a Webflow közös stílusváltozói, a Framer variánsai és a Tiptap billentyűzettámogatása szolgált módszertani mintaként (az utóbbi modulokat nem fejlesztjük előre).

- **Aktuális PR:** [#121](https://github.com/sanci9517/sanci9517/pull/121) — külön fejlesztési ág, még nincs a `v2/foundation` ágba egyesítve.
- **Megvalósítás alatt:** képek/video/hang szerkeszthető URL-je és előnézete; kép alt/díszítő mód/vágás; új elemre vonatkozó publikálási validáció; verziózott statikus lista/táblázat/fül/accordion/galéria modellek; kontextuális Inspector mezők; publikus szemantikus és interaktív renderelés; billentyűzetes fülek, natív lenyitás, galéria dialógus; valódi szerkeszthető carousel; H1–H6; biztonságos hivatkozási cél és új lap; egyedi horgonyazonosítók ütközésmentes másolással; hover/focus állapotstílusok; többes kijelölésnél atomi, visszavonható közös formázás.
- **Változatkezelés:** a régi mentett elemek nem kapnak betöltéskor automatikusan új tartalomsémát; az új szerződést explicit új/átalakított elemek használják. Mentés nem publikál automatikusan; a szerkesztő és a publikus renderer ugyanabból a Page Modelből dolgozik.
- **Biztonság:** minden publikus szöveget HTML-escape-elj, csak biztonságos média/hivatkozási sémákat engedj; új, hiányos interaktív vagy médiatartalom publikálása tiltott, de piszkozatként menthető. Hiányzó Médiatár és más dinamikus modul nem helyettesíthető látszatfunkcióval.
- **Teszt:** új unit és Chromium böngészős regressziók hozzáadva a CI-hez. Az első teljes strukturált elem/browser kör, TypeScript és kapcsolódó checkek korábbi feature-commiton PASS; a legfrissebb commit ellenőrzése és az éles deploy még folyamatban. A teljes 77.44 / Visual Editor OPEN, kézi telefon/PC acceptance még nincs.
- **Következő sorrend:** PR teljes CI ellenőrzés és javítás → kód/MASTER egyesítés → a még ténylegesen hiányzó 77.44 elem-paritások és Inspector hibák célzott rendezése → a 76.08 Brand Kit függőségeinek külön kezelése a megfelelő későbbi pontban → végül teljes funkciónkénti kézi acceptance lista. Ne térj át más adminmodulokra és ne ismételj történeti auditot.


### 77.44.UX-P0.6.E — Kis statikus elemek teljes tartalmi szerződése (2026-10-18)

**STÁTUSZ: IN PROGRESS / manuális acceptance OPEN.** A #121 összetett elemekre vonatkozó Editor/Inspector fejlesztése után [#122 PR](https://github.com/sanci9517/sanci9517/pull/122) a jelenleg hiányos **Badge / Quote / Icon** elemeket készíti el. A közös Page Modelben a Badge szöveges címke, a Quote szöveg + opcionális forrás, az Icon pedig stabil, típusos és akadálymentes elnevezésű ikonbejegyzés. A vászon-Inspector és a publikus renderer ugyanazt a mezőkészletet használja, szerveroldali publikálási guarddal. Az ikonokhoz nem szükséges külső font/CDN. Régi tartalmat automatikusan nem migrálunk; az új elemek verziójelöltek.

- **Ellenőrzés:** unit és valódi böngészős tartalommentés + publikus szemantikai tesztek a meglévő Editor regressziókban; merge/production és kézi teszt csak ellenőrzés után PASS.
- **Függőségek:** a 76.08 Brand Kit és a későbbi teljes ikonkezelés külön modultulajdonban marad; nem építjük be most a Visual Editorba. WEB-011/77.44 összesített készültség továbbra is OPEN. Következő lépés: a PR és a felhasználói felület bizonyított működése, azután a fennmaradó Editor-eszközök és szakmai acceptance kritériumok célzott fejlesztése.

### 77.44.UX-P0.6.F — Editor gyökérstílus paritás (2026-10-18)

A #121 és #122 Visual Editor elem-paritás bővítések egyesültek. A következő nyitott 77.44 részblokk az explicit gyökérstílus-módosítás és a publikus `content-canvas` reszponzív CSS-azonosságának javítása. Korábban mentett oldalra nem alkalmazunk automatikus stílusmigrációt; a verziójelölt root módosítása Undo/Redo-val és a Save≠Publish életciklussal működik. Új core és Chromium teszt készül, eredményük CI futásig UNVERIFIED. A részletes aktuális státusz a kanonikus MASTER 77.44.UX-P0.6.F bejegyzésében szerepel. A teljes Editor és kézi felhasználói elfogadás OPEN.

### 77.44.UX-P0.6.G — Vizualis alapelemek (2026-10-18)

A #123 gyökérstílus publikálási paritás CI PASS után MERGED, `262ff98a52938b485f94eb36e9f5d359a02b8883`. A következő Editor-alpont új elemeknél verziózott, szerkeszthető, validált elválasztóvonalat és responsive térközt hoz; a régi elemek viselkedése nem változik automatikusan. Piszkozat Save külön a Publish-tól. Unit/Chromium regresszió készül a `test:editor:layout` parancsban, végső CI- és kézi PASS még UNVERIFIED. Az aktuális teljes státusz és következő lépések a kanonikus MASTER 77.44.UX-P0.6.G pontjában; a teljes Editor OPEN.

### 77.44.UX-P0.6.H — Statikus Card tartalmi szerződés (2026-10-18)

A #124 elválasztóvonal/reszponzív térköz CI PASS után MERGED: `458948c8a8868e9be5b3e533cd73e8dbdce7e9c7`. Az aktuális Visual Editor 77.44 alpontban a kártya gyermekeinek megőrzése mellett szerkeszthető, verziózott cím/leírás/kép/gomb és három megjelenési variáns készül. A megosztott adatséma, publikus renderer, Inspector, unit/Chromium regresszió kódja PR-en; CI futtatás és kézi elfogadás még UNVERIFIED. A kanonikus 77.44.UX-P0.6.H pont a részletes tulajdonos és bizonyítéki nyilvántartás. Egyetlen MASTER, nem párhuzamos roadmap; Save != Publish.

### 77.44.UX-P0.6.I — Valódi Countdown szerkesztőelem (2026-10-18)

#125 Card CI PASS után MERGED: `36d03548c6d88eaa032da3c1013ba3a41de40321`. Következő 77.44 Editor-alpont: új verziójelölt Countdown, felhasználó helyi idejű Inspector, abszolút ISO-eseményidő, közös szerkesztő/publikus live-timer és lejárati üzenet, mobil megjelenés, server Publish guard. Még üres dátummal is menthető piszkozat. Unit + Chromium regression CI-be kötve, csak sikeres végrehajtás igazolhatja. Teljes Editor és kézi elfogadás OPEN, a kanonikus MASTER 77.44.UX-P0.6.I része az egyetlen aktuális részletes nyilvántartás.


### 77.44.UX-P0.6.J — Social Links Editor-képesség (2026-10-19)

A #126 Countdown CI PASS után egyesült: 38a3c8570174ae09d21fcc3074d4c7d0e5327804. A következő 77.44 Editor-pont statikus, szerkeszthető közösségi hivatkozás elem: 11 platform, egyedi címek és biztonságos URL-ek, hozzáadás/sorrend/törlés, három layout és megjelenés, közös HTML renderer/Inspector, reszponzív fókusz- és érintési cél, verziózott opt-in, Undo/Redo és Save≠Publish. Nincs dinamikus platformintegráció vagy állítólagos követőszám, nincs régi adatmigráció. Unit és Chromium regression PR CI-vel igazolandó; teljes Editor és kézi elfogadás OPEN. Az egyetlen részletes tulajdonos a kanonikus MASTER 77.44.UX-P0.6.J alpontja.


### 77.44.UX-P0.6.K — Biztonságos creator-videó beágyazás (2026-10-19)

#127 Social Links CI PASS után MERGED: 3d206417b5bfa4684766cff3867259f2c2ce4d92. A következő Visual Editor-elem a verziózott YouTube/Twitch Live/Twitch VOD/Vimeo Embed: URL/ID és cím, képarány, kattintással betöltés; sandbox nélküli, előre engedélyezett szolgáltatói iframe-domain, szigorú platformlistás feloldás; YouTube nocookie, Vimeo dnt, dinamikus Twitch parent. 400px alatti Twitch iframe helyett használható közvetlen link. Draft Save külön, új hibás adat Publish guarddal tiltott, legacy opt-in. Core/Chromium desktop/mobil CI ellenőrzésre vár; teljes Editor és saját készülékes felhasználói elfogadás OPEN. Az egyetlen részletes forrás a kanonikus MASTER 77.44.UX-P0.6.K alpontja.


### 77.44.UX-P0.6.L — Code blokk, natív megjelenítés és másolás (2026-10-19)

A #128 Embed blokk minden elérhető GitHub check PASS után MERGED: 719b644ab3232aa173deb62f13f9c1a38125e20c. A következő 77.44 részblokk a Code elem: inert, biztonságos forrás, 12 nyelvi címke, világos/sötét téma, sorszámok, tördelés, valóban működő publikus Másolás művelet, közös Page Model és Inspector, mobil CSS, verziózott opt-in és server Publish guard. Unit/Chromium teszt a CI-ben futtatandó; rendszer-vágólap és teljes telefon/PC kézi elfogadás OPEN. Egyetlen részletes kanonikus nyilvántartás a MASTER 77.44.UX-P0.6.L.

### 77.44.UX-P0.6.M — Közös tartalom- és stílusszerződés — 2026-10-19

A következő összefüggő blokk a típusos, verziózott Inspector-tartalmakat, repeater/táblázat/belsőlink-választást, szemantikus vászon/publikus renderelést, Publish-validációt, állapotstílusokat és egy meglévő beállításokra épülő webhelyszintű design-token alapot kapcsolta össze. PR #130 CI és merge utáni ellenőrzések PASS; squash merge `f1a315a01a79a5b7b760f912db443a17b21a5080`. Cloudflare Production build `dea4f5b7-d121-4f2c-b0ca-d28b7f8dadef` PASS, Worker version `dfd57b39-3f7f-43e0-9786-e687ed657010`. Helyi igazolás: TypeScript PASS, Editor core 94/94, valós Chromium Editor-regresszió 18/18, Brand Kit-szerződés 5/5, WEB-013 57/57 és admin regresziók PASS. Régi strukturált/elem-specifikus tartalom útvonalai megmaradtak; éles D1/secret nem változott. A teljes Editor és PC/telefonos felhasználói acceptance **OPEN/UNVERIFIED**. A részletes változás- és bizonyítéknyilvántartás kizárólag a [kanonikus MASTER 77.44.UX-P0.6.M pontjában](../SANCI9517-CREATOR-PLATFORM-PLAN.md#7744ux-p06m--közös-szerkeszthető-tartalmak-állapotstílusok-és-webhelyszintű-stílusalap-2026-10-19) van. Következő aktív pont: a 77.44.7.A/C/D maradék Inspector/képesség-mátrix hiányai, a paletta részleges elemei és a valódi Médiatár-választó függősége; a 76.08 teljes Brand Kit külön OPEN marad.

### 77.44.UX-P0.6.N — Képkivágás fókuszcsúszkái

A `77.44.7.D` ezen részblokkja az ötállású kivágási presetet vízszintes/függőleges, 0–100%-os, értéket visszajelző Inspector csúszkával egészítette ki. A képeknél, galéria- és carousel-elemeknél a vászon és a publikus render azonos `object-position` értéket használ; a régi `focalPoint` dokumentumértékek változatlanul működnek, és sem médiafeltöltő, sem adatbázis-migráció nem készült. Bizonyíték: Editor Core 95/95, Chromium Editor-regresszió 18/18, célzott desktop/mobil képkivágás + külön Save/Publish teszt PASS; TypeScript, Design 5/5, WEB-013 57/57 és `git diff --check` PASS. A kód, PR/CI/merge és Production build még nincs igazolva; felhasználói eszközös elfogadás OPEN. A részletes egyetlen tulajdonosi állapot [a kanonikus MASTER 77.44.UX-P0.6.N pontjában](../SANCI9517-CREATOR-PLATFORM-PLAN.md#7744ux-p06n--képkivágás-pontos-fókuszbeállítása-2026-10-19). Következő aktív pont: 77.44.7.A/C/D tényleges Inspector–paletta képességmátrixa, valamint a 76.11 Médiatár közös adatgazdához szükséges bekötés megtervezése; párhuzamos feltöltőrendszer nem készül.
