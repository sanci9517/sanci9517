# SANCI9517 Creator Platform — EGYETLEN KANONIKUS MASTER-TERV

> **Egy terv, 12 fájlban.** Ez a dokumentum az egyetlen hivatalos belépési pont. A fejezetfájlok az eredeti, 2026-10-17-i teljes MASTER-szöveg veszteségmentes, sorrendtartó felosztását tartalmazzák. Nem különálló vagy alternatív tervek.

## Olvasási és módosítási szabályok

1. **Mindig innen indulj.** A fejezeteket számozás szerint olvasd; a folytatódó alcímek az előző részhez tartoznak.
2. Az eredeti teljes szöveg pontosan a 12 fájl egymás utáni összefűzésével állítható helyre. Az átállás során az eredeti szöveghez nem nyúltunk; a tartalomjegyzék új.
3. Egy funkciónak csak egy kanonikus azonosítója és elfogadási állapota lehet. Régi, történeti checkpoint nem írhatja felül az aktuális végrehajtási kurzort.
4. Új döntést vagy fejlesztési státuszt a megfelelő fejezetbe írj; az aktuális pont rövid összefoglalását itt is frissítsd. Ne hozz létre párhuzamos MASTER-tervet.
5. A `docs/MASTER-DEVELOPMENT-PLAN.md` régi hivatkozási fájl, **nem** aktív fejlesztési terv.
6. Nagyobb átrendezés előtt ellenőrizd a teljes szöveg egyezését és az összes fejezetfájlt; ne hagyj ki funkciókat.

## A MASTER 12 része

- [1/12 – MASTER fejezetek](creator-master/part-01-of-12.md)
- [2/12 – MASTER fejezetek](creator-master/part-02-of-12.md)
- [3/12 – MASTER fejezetek](creator-master/part-03-of-12.md)
- [4/12 – MASTER fejezetek](creator-master/part-04-of-12.md)
- [5/12 – MASTER fejezetek](creator-master/part-05-of-12.md)
- [6/12 – MASTER fejezetek](creator-master/part-06-of-12.md)
- [7/12 – MASTER fejezetek](creator-master/part-07-of-12.md)
- [8/12 – MASTER fejezetek](creator-master/part-08-of-12.md)
- [9/12 – MASTER fejezetek](creator-master/part-09-of-12.md)
- [10/12 – MASTER fejezetek](creator-master/part-10-of-12.md)
- [11/12 – MASTER fejezetek](creator-master/part-11-of-12.md)
- [12/12 – MASTER fejezetek](creator-master/part-12-of-12.md)

## Aktuális végrehajtási állapot — 2026-10-17

- **Ág:** `v2/foundation` (a dokumentumszétválasztás #49 PR-en keresztül kerül ide).
- **#39 / WEB-002 és WEB-013 slug/átirányítás:** felhasználói ellenőrzés **PASS**, GitHub issue lezárva. A hibáslink-riport, canonical és sitemap további WEB-013 része **még fejlesztendő**.
- **#42 / Visual Editor reszponzív áttervezés:** felhasználói ellenőrzés **PASS**.
- **#47 / #48 Inspector kijelölés utáni panelösszezsugorodás:** javítás egyesítve (`aeef28e`); felhasználó szerint az eddigi tesztek **PASS**.
- **Következő funkcionális munka:** WEB-013 hibáslink-riport, SEO canonical/sitemap szerződés, figyelembe véve a felhasználó még bejelentendő egy további igényét.
- **Elfogadási szabály:** a felhasználói PASS nem helyettesíti az önálló CI/éles deploy bizonyítékot.

## Bejelentkezés és támogatott eszközök — 2026-10-17

- **#51: CLOSED / not planned (Android 5.0 támogatás).** A #54 javította a bejelentkezési JavaScript szintaktikai hibáját és a kötelező munkamenet-ellenőrzést; a #55 külön `COOKIE_MISSING` és `SESSION_INVALID` diagnosztikát adott.
- **Felhasználói éles elfogadás:** PC és telefon belépés PASS, mindkettőn biztonságos HTTPS-kapcsolatot jelez a böngésző. A Lenovo Android 5.0 tableten `COOKIE_MISSING` és nem biztonságos kapcsolat jelzés maradt; Wi-Fi és mobilhotspot mellett is. A konkrét TLS/tanúsítvány-ok nem bizonyított.
- **Biztonsági termékdöntés:** a régi Android 5.0 támogatása miatt nem gyengítjük a HTTPS, `Secure`, `HttpOnly`, `SameSite=Lax` és szerveroldali hitelesítési követelményeket. A támogatott modern eszközök működése elsődleges.
- **Következő funkcionális fókusz változatlan:** WEB-013 hibáslink-riport és SEO canonical/sitemap; az F1.1 teljes elfogadása továbbra is nyitott.

## WEB-013 tényleges előrehaladás — 2026-10-17

- **#57 MERGED:** `/sitemap.xml` és `/robots.txt`, kizárólag publikált oldalakkal.
- **#58 MERGED:** publikus canonical HTML URL és előnézet/hibaoldal noindex szabály.
- **#59 MERGED:** hitelesített, szerkesztői jogosultságú publikált navigációs hibás oldalhivatkozás-riport.
- **#60 MERGED:** manuálisan indítható riport az Admin főoldal alján; végleges modulba áthelyezése későbbi admin UX-feladat.
- **#61 MERGED:** publikált Editor-elemek explicit belső `/p/{slug}` linkjeinek ellenőrzése.
- **Felhasználói éles ellenőrzés:** 8 navigációs elem, 0 hibás hivatkozás; 0 ellenőrzött tartalmi belső link és 0 tartalmi hiba. A második nulla nem bizonyít teljes tartalmi linklefedettséget.
- **F1.1 / WEB-013 marad nyitott:** redirect-kompatibilis belső linkek megkülönböztetése, rich-text linkek és egyéb szerkesztői linkmezők lefedettsége, regressziós tesztek, SEO szerződés teljes elfogadása.
- **Admin UX döntés:** az Admin főoldal később modern Creator Control Centerként átalakul, részletes Webhelykezelés/SEO riporttal külön logikus modulban; a Visual Editor kizárólag szerkesztésre szolgál.

## Forrásintegritás

A felosztás kiinduló eredeti Git blob SHA-ja: `16eb83190ffeb805cd9f4bcc9fa7458ddea4c8aa`. A forrás **2 092 085 JavaScript-karakter** hosszú volt; a 12 rész összege pontosan ugyanennyi. A darabolás Markdown címsoroknál történt, és az eredeti szöveget byte/karakter szinten változatlanul hagyja az összefűzés.


## WEB-013 előrehaladási napló — #62–#77 (2026-10-17)

- **#62–#77 MERGED a `v2/foundation` ágba.** A WEB-013 publikus sitemap/canonical és admin hibáslink-riport részfeladataihoz elkészültek a slug-átirányítások felismerése, rich-text hivatkozások vizsgálata, az ellenőrzések CI-be kötése és a hibás HTML-hivatkozás-regex javítása.
- A riport külön kezeli a hibás és érvényesen átirányított belső linkeket. Figyelmeztet a hiányzó, sérült vagy nem támogatott publikált dokumentumokra, a túl hosszú rich-text mezőkre, valamint a link-, menüelem- és navigációmélység-korlátokra.
- **Bizonyíték:** a #77 PR három GitHub Actions munkafolyamata PASS; squash merge `83d69e4ee4753c633784f26273cf1329e33f651c`. A korábbi részfeladatok külön PR-eken keresztül kerültek be.
- **Nyitott elfogadás:** a teljes WEB-013/F1.1 még nem tekinthető PASS-nak. Ellenőrizendő a tényleges éles deploy, a publikus SEO-válaszok, a valós publikált rich-text tartalommal végzett funkcionális teszt, valamint a linkkinyerés lefedettsége. A szerkezeti/regex regressziós tesztek önmagukban nem bizonyítanak teljes end-to-end működést.
- **Következő fejlesztési döntési pont:** a megmaradt WEB-013 elfogadási kritériumokat kell igazolni, nem további öncélú figyelmeztetés-PR-eket gyártani.

## WEB-013 aktív blokk — publikus SEO és működő riporttesztek (77.30)

- A szerveroldali publikált SEO-fejléc, előnézet/hiba noindex és canonical kizárás, teljesebb sitemap, pontosabb rich-text href-vizsgálat és mobilon olvasható Admin-riport megvalósítva; célzott WEB-013 **18/18 PASS**, böngészős Admin **1/1 PASS**, széles route/regresszió **148/148 PASS**, Editor **49/49 PASS**, TypeScript és kanonikus terv **PASS** helyben.
- A [#79 PR](https://github.com/sanci9517/sanci9517/pull/79) öt checkje PASS, `cc7d0c7` a `v2/foundation` ágon; a merge commit hat checkje és a Cloudflare Production build PASS. A futtatókörnyezetből az éles HTTP és a hitelesített Admin nem volt elérhető, így ezek elfogadása **UNVERIFIED**. A teljes **WEB-013/F1.1 OPEN**; a következő kapu valós éles HTML/Admin ellenőrzés, majd a fennmaradó linkmezők és a több-site URL-névtér adatvesztésmentes kezelése.

## WEB-013 folytatás — Rich Text, belső linkek és site-scoped URL-alap (77.31)

- A későbbi éles, olvasási célú HTTP-vizsgálat a `9a6a730` kiadáson a sitemap 10 URL-jének canonical/robots válaszát, a `/p/youtube` SEO-fejlécét, a valódi 404-et és a jogosulatlan preview/Admin határát **PASS** állapotban igazolta; a 77.30 korábbi hálózati akadály itt már nem áll fenn. Hitelesített Admin és valós történeti slug 308-as éles próbája **UNVERIFIED**.
- A strukturált Rich Text-linkek publikus megjelenítése és riportja, azonos originű abszolút és navigációs belső URL-ek vizsgálata, valamint explicit site ID-t fogadó publikus URL-szolgáltatások helyben implementálva és tesztelve: WEB-013 **19/19**, Chromium **2/2**, széles regresszió **149/149**, Editor **49/49**, TypeScript **PASS**. A kiadási és éles HTTP-bizonyíték alább szerepel.
- **Következő aktív pont:** verifikált domain→site feloldás és az örökölt globális `pages.slug UNIQUE` adatmegőrző feloldása. Éles táblarebuild/migráció csak biztonságos preflight, rollback és szükséges jóváhagyás után; addig multi-site URL és teljes **WEB-013/F1.1 OPEN**.
- A [#81 PR](https://github.com/sanci9517/sanci9517/pull/81) öt PR-checkje PASS, `c0021b4` a `v2/foundation` ágon; a merge commit hat checkje és a [Cloudflare Production build](https://dash.cloudflare.com/64bbd6a12ac732ed2cac4ca25d8bfa7e/workers/services/view/sanci9517-streamer-brand/production/builds/aa81221b-0319-4f57-a0fc-6fc5de464bfe) PASS. Az új publikus assetek éles HTTP-n elérhetők, a SEO-oldal és mind a 10 sitemap URL canonical/index válasza, a 404/noindex és a jogosulatlan preview/Admin határ PASS. Valódi régi URL 308, hitelesített Admin és publikált Rich Text-link éles elfogadása **UNVERIFIED**; a teljes **WEB-013/F1.1 OPEN**.

## WEB-013 folytatás — domain és webhelyenkénti slug előkészítése (77.32)

- A publikus host feloldása explicit, ellenőrzött hozzárendelésre épül; ismeretlen host 421-et kap. A meglévő Cloudflare Worker-host változatlan `site-default` útvonala működik. Más webhely publikus útvonala csak konfigurált és D1-ben verifikált domainnel választható; Admin műveletei ott tiltottak a későbbi site-jogosultsági szerződésig.
- A `pages.slug` globális UNIQUE → `(site_id,slug)` átállásának teljes SQL-je, olvasási célú preflightja, adatmegőrzési és tranzakciós rollback-próbája elkészült; az SQL **`scripts/pending/` alatt marad, nem automatikus D1-migráció**. A helyi, teljes sémán és kapcsolatokon futó próba PASS. Közvetlen éles D1-séma/backup/preflight **UNVERIFIED** (nincs Wrangler-hitelesítés); éles táblarebuild és új domain aktiválása nem történt.
- A WEB-013 három éles elfogadása — valódi régi URL 308, bejelentkezett Admin-riport, valós publikált Rich Text-link — változatlanul **UNVERIFIED**. Teljes **WEB-013/F1.1 OPEN**. **Következő aktív pont:** hitelesített, olvasási célú éles D1-preflight és backup/PITR, majd az éles migráció külön jóváhagyása; ezt követi a domain/site beállítások és Admin-jogosultság teljes site-scope-ja.

## WEB-013 / 77.33 — éles D1 site-scope migráció igazolása (2026-10-17)

- **Éles módosítás felhasználói jóváhagyással:** a tesztoldalak adatvesztési kockázatának elfogadása után a `scripts/pending/0025_site_domains_and_site_slug.sql` kézi végrehajtása megtörtént a `sanci9517-db` éles D1 adatbázison. Külön SQL export/backup nem készült a felhasználó kifejezett döntése alapján. Nem állítjuk, hogy a felhasználó az összes egyéb adat elvesztését is elfogadta volna.
- **Éles utóellenőrzés PASS:** `pages` 9/9, `editor_revisions` 146/146, `page_slug_redirects` 1/1; `PRAGMA foreign_key_check` 0 hiba; ideiglenes `__web013_%` táblák nincsenek. A `pages.slug` globális UNIQUE megszűnt, `idx_pages_site_slug` létezik; `site_domains` tábla létezik, az alapértelmezett Worker-host verifikált `site-default` rekordja létrejött; a három érintett táblán 14 trigger található. Mindez az éles D1 közvetlen, csak olvasási lekérdezéseivel ellenőrizve.
- **Külön migrációs nyilvántartás:** a `d1_migrations` tábla legutolsó bejegyzése `0024_page_slug_redirects.sql`; a kézzel végrehajtott 0025 SQL **nincs** benne. Ne helyezd egyszerűen a meglévő 0025 SQL-t automatikus `migrations/` könyvtárba, és ne futtasd újra! A migráció státusza: **APPLIED MANUALLY / LEDGER NOT REGISTERED**. A nyilvántartási és jövőbeli tiszta telepítési stratégiát idempotencia és friss adatbázisos bootstrap teszt után tervezzük meg; az éles ledger módosítása külön jóváhagyást igényel.
- **Éles felhasználói elfogadás:** Creator Control Center login és főoldal PASS (felhasználói visszajelzés). A régi URL valós 308, a bejelentkezett Admin-linkriport és a publikált Rich Text linkek külön elfogadása továbbra is UNVERIFIED. WEB-013/F1.1 és teljes multi-site támogatás OPEN.
- **Következő aktív fejlesztési pont:** az alkalmazott kézi 0025 migráció és az automatikus Wrangler migrációs lánc biztonságos összehangolása új telepítésekre, majd site-tagsági Admin/auth jogosultság, tenant-szintű site settings és domain életciklus tesztelt megvalósítása. Ne módosíts éles adatokat önállóan a további fejlesztés során.

## WEB-013 / 77.34 — webhelytagsági jogosultság alap (2026-10-17)

- **Kód és teszt:** az új `src/core/auth/site-access.ts` szerveroldali `requireSiteGrant(request,env,trustedSiteId,requiredRole)` kizárólag a `site_memberships` aktív tagságát, az aktív felhasználót és az aktív webhelyet fogadja el. Másik webhely tagsága, visszavont grant, hiányzó felhasználói tagság vagy magasabb szerepkör-igény esetén 403; hitelesítetlen kérés 401; még nem telepített tábla/D1 hiba esetén 503 és **nincs globális role fallback**. A site ID-t a szerver hitelesített host-feloldásából kell átadni, soha nem a kliens saját kérésmezőjéből.
- **Adatmodell:** a `scripts/pending/0026_site_memberships.sql` külön jóváhagyásra váró, additív SQL. A `(site_id,user_id)` összetett elsődleges kulcs, FK-k, szerep- és státusz-korlátok mellett egyetlen induló seedet tartalmaz: meglévő aktív felhasználók csak a `site-default` webhelyre kapják a jelenlegi szerepkörüket. Egyetlen idegen webhely sem kap automatikus hozzáférést. Nem került automatikusan futó `migrations/` könyvtárba.
- **Határ:** az új `requireSiteGrant` még **nem aktív** a meglévő Admin endpointokon. A jelenlegi egywebhelyes Admin/login működés és a másodlagos webhelyek 403-as tiltása változatlan; a tényleges többwebhelyes Admin engedélyezése későbbi, site-scoped route és ellenőrzött D1-séma/seed után lehetséges. A 0025 kézi migráció és Wrangler-ledger eltérés szintén OPEN.
- **Elfogadás:** a `tests/web013-site-membership.test.js` a default seedet, cross-site izolációt, visszavonást, jogosultsági sorrendet, hiányzó táblán fail-closed viselkedést, FK/UNIQUE/CHECK integritást teszteli, és bekerült a `test:web013` regressziós parancsba. CI-eredmény csak lefutás után állítható. A teljes WEB-013/F1.1 és multi-site Admin továbbra is OPEN.
- **Következő lépés:** a 0025 ledger eltérés biztonságos rendezésének és a 0026 additív D1 migráció kontrollált telepítésének megtervezése; a hitelesített host-ból érkező site ID és az új membership-szerepkör összekötése minden Admin/editor/settings útvonallal, jogosultsági regresszióval és felhasználói elfogadással.

## WEB-013 / 77.35 — kapcsolható Admin tenant-jogosultsági kapu (2026-10-17)

- **Fejlesztés:** a Worker ingress pontján a `src/core/auth/admin-tenant-gate.ts` a szerver által feloldott `siteId` alapján tudja ellenőrizni az aktív `site_memberships` tagságot az Admin, Editor, Admin API és privát draft-preview útvonalakon. A `/api/admin/settings` admin szerepet, az Editor és egyéb Admin API-k editor szerepet, az Admin főoldal legalább viewer szerepet igényelnek. A `/admin/login` szabadon betölthető; a HTML Admin bejelentkezés nélküli hozzáférése továbbra is 302 átirányítást kap a bejelentkező oldalra. Az ismeretlen host és a nem alapértelmezett webhely Admin tiltása külön korábban is fennáll, nem változott.
- **Kontrollált aktiválás:** a kapu csak `SITE_MEMBERSHIP_ENFORCEMENT=enabled` telepített környezeti változó esetén éles; a változó hiányában a korábbi egywebhelyes Admin marad aktív. A `0026_site_memberships.sql` még a `scripts/pending/` könyvtárban található; a kaput csak a tényleges éles D1-séma és default-site membership seed PASS után szabad bekapcsolni. Bekapcsolt állapotban tábla-/D1-hiba 503, hiányzó/revokált grant 403; nem szabad globális role fallbacket alkalmazni.
- **Hatókör:** a régi belső Admin route handler-ek és a globális `users.role` még változatlanok. A központi ellenőrzés csak az átmeneti default-site védelmet adja, **nem** teszi multi-site képessé az Admin endpointokat. A tenant-szintű belső route refaktor, site-scoped settings és a 0025/0026 Wrangler-ledger összehangolás külön nyitott munka.
- **Teszt:** `tests/web013-admin-tenant-gate.test.js` a szerepkör-policyt, a 302-es login UX-et, az ismeretlen/revokált jogosultságot, a nemdefault Admin deny-t, a kliens `X-Site-ID` spoofingot, a hiányzó tábla fail-closed viselkedést és a kikapcsolt kapu visszafelé kompatibilitását ellenőrzi. Futtatása az általános WEB-013 CI-be kötve. CI és éles elfogadás csak tényleges ellenőrzés után PASS. A teljes WEB-013/F1.1 OPEN.

## WEB-013 / 77.36 — kapcsolható webhelyenkénti site settings alap (2026-10-17)

- **Additív séma, külön engedélyezéssel:** a `scripts/pending/0027_site_scoped_settings.sql` `(site_id,key)` összetett kulcsú `site_scoped_settings` táblát készít elő, a meglévő globális `site_settings` táblához nem nyúl. Az alap webhely már létező `site` rekordját változatlan JSON-nal és időbélyeggel másolja; idegen webhelynek nem adja át a default site adatait. A SQL nem került a `migrations/` könyvtárba, éles D1-végrehajtás még nem történt.
- **Kód:** a `src/core/site-scoped-settings.ts` szerveroldali read/upsert API kizárólag a hívó által hitelesített siteId alapján dolgozik. A publikus `/api/public/site-settings` a Worker domain→site feloldását követi, az Admin beállítás-route pedig a jelenlegi default-site kontextusban működik. A `SITE_SCOPED_SETTINGS_ENABLED=enabled` csak a 0027 kontrollált telepítése és ellenőrzése után kapcsolható be. A flag hiányában az összes legacy működés változatlan; bekapcsolt, de hiányzó/hibás táblánál 503 és nincs legacy/idegen tenant fallback.
- **Teszt:** `tests/web013-site-scoped-settings.test.js` az eredeti site setting és oldalsor változatlanságát, a tenant-szintű publikus izolációt, a jogosulatlan írás 403-as elutasítását, a sikeres auditált írást és a kikapcsolt flag változatlan működését ellenőrzi. A Save/Publish oldalszerkesztői szerződés változatlan.
- **Aktuális kapu:** a 0025 kézi schema/ledger összehangolása, a 0026 membership, a 0027 site settings éles, ellenőrzött installja és az Admin route-ok tényleges site-context refaktorja **OPEN**. A teljes WEB-013/F1.1 és éles multi-site aktiválás **OPEN**.

## WEB-013 / 77.37 — éles 0026–0027 migráció és kontrollált aktiválás (2026-10-17)

- **D1 módosítás:** a felhasználó folytatási jóváhagyása után az eredetileg `scripts/pending/0026_site_memberships.sql` és `scripts/pending/0027_site_scoped_settings.sql` fájlokat kézzel alkalmaztuk az éles `sanci9517-db` D1-re. A táblák előzőleg nem léteztek; az SQL-ek additívak, nem töröltek oldalt, munkamenetet vagy tartalmat. Az éles migrációkat **ne futtasd újra**; a Wrangler `d1_migrations` naplója továbbra sem tartalmazza a kézzel alkalmazott 0025/0026/0027 migrációkat. Az új, tiszta környezetekre való idempotens bootstrap/migrációs ledger rendezése OPEN.
- **Közvetlen éles D1 utóellenőrzés PASS:** a `site_memberships` táblában 1 aktív `site-default` admin tagság, a `site_scoped_settings` táblában 1 alapwebhely-rekord; a másolt `value_json` és `updated_at` pontosan egyezik a korábbi `site_settings` bejegyzéssel. A kapcsolódó index létezik, a `pragma_foreign_key_check` 0 hibát mutat. Meglévő adatok: 9 oldal, 146 editor-revízió, 1 redirect változatlan.
- **Aktiválás:** a `wrangler.jsonc` `vars` alá verziókövetett, nem titkos `SITE_MEMBERSHIP_ENFORCEMENT=enabled` és `SITE_SCOPED_SETTINGS_ENABLED=enabled` kapcsoló kerül. A kód a `site-default` admin/Editor/draft-preview jogosultságot már a site-tagsági táblával ellenőrzi; az Admin settings és a publikus site settings az új, site-scoped táblát olvassa/írja. A nemdefault site Admin-útvonalai változatlanul tiltottak; a további Admin tenant refaktor OPEN. A telepítés előtti CI és az éles aktiválás utáni HTTP/felhasználói ellenőrzések külön kapuk; amíg ezek nem teljesülnek, a teljes WEB-013/F1.1 OPEN.
- **Regressziós kapu:** új `tests/web013-live-activation-contract.test.js` rögzíti a bekapcsolt flag-értékeket, a Worker ingress guard és settings route kapcsolatát, valamint a manual-only SQL-eket; a meglévő `test:web013` suite futtatja. Az explicit Save és Publish továbbra is külön.
- **Hátralévő éles elfogadás:** hitelesített Admin bejelentkezés és beállítások megtekintése a két kapcsolóval, tényleges régi slug 308-as átirányítás, bejelentkezett Admin linkriport és publikált Rich Text linkjeinek kattinthatósága; továbbá a teljes többsite-admin, domain-életciklus és automatikus migrációs lánc.

## WEB-013 / 77.38 — 0026–0027 éles kapcsolók és kiadási bizonyíték (2026-10-17)

- **#89 PR MERGED** a `v2/foundation` ágba, squash commit `f535587fb62ff6be493eae65706fb34800978630`. A PR-en a Canonical Creator Platform Plan, Twitch Integration Check, F0 baseline checks és Editor Core Test **4/4 PASS**, benne az új aktiválási regressziós teszt.
- **Cloudflare Production kiadás:** a `sanci9517-streamer-brand` Workeren közvetlen API-ellenőrzéssel látható a `2026-10-17T16:02:07.520406Z` deployment, egyetlen `67d0f87b-7eab-4357-9789-6a0b89e7ad7b` verzióval, **100%** forgalmi súllyal. A script beállításai között `SITE_MEMBERSHIP_ENFORCEMENT=enabled` és `SITE_SCOPED_SETTINGS_ENABLED=enabled` plain-text binding szerepel. A korábban létező titkos, ASSETS és D1 binding-nevek változatlanul láthatók; a titkos értékeket nem olvastuk ki és nem másoltuk a MASTER-be.
- **Ellenőrzött D1 állapot:** a 0026/0027 migrációk közvetlen kézi alkalmazása után a `site_memberships` 1 aktív `site-default` admin grantet tartalmaz, a `site_scoped_settings` 1 rekordját a korábbi `site_settings` pontos `value_json` és `updated_at` egyezése igazolja. `pragma_foreign_key_check`: 0; 9 oldal, 146 revízió, 1 redirect megmaradt. A 0025–0027 SQL-ek a Wrangler `d1_migrations` naplóba továbbra **nincsenek** kézi telepítésként bevezetve; újrakezdésük tilos, a tiszta telepítés/replay-safe ledger egyeztetés **OPEN**.
- **A tényleges felhasználói elfogadás nem automatikus:** a Cloudflare telepítés és binding-ellenőrzés **PASS**, de az új kapcsolókkal a bejelentkezett Admin/Editor és a publikus beállítások éles, végfelhasználói HTTP/UX-smoke-je még **UNVERIFIED**. Valódi történeti URL 308, hitelesített hibáslink-riport és publikált Rich Text linkek ugyancsak nyitottak. WEB-013/F1.1 és multi-site Admin **OPEN**.
- **Következő aktív pont:** célzott éles felhasználói smoke, utána Wrangler migrációs nyilvántartás biztonságos rendezése és a további webhelyek Admin-scope/refaktorjának folytatása. A Save és Publish továbbra is különálló.

## WEB-013 / 77.39 — éles Admin elfogadás és migrációs lánc regresszió (2026-10-17)

- **Felhasználói éles smoke: PASS.** A felhasználó a `SITE_MEMBERSHIP_ENFORCEMENT=enabled` és `SITE_SCOPED_SETTINGS_ENABLED=enabled` telepítése után megerősítette: Creator Control Center bejelentkezés/főoldal megnyílik, a Visual Editor megnyílik, a korábbi webhelybeállítások megmaradtak. Ez a **célzott Admin/Editor/settings elfogadás**, nem teljes multi-site vagy teljes WEB-013 zárás.
- **Még UNVERIFIED:** a konkrét történeti URL éles 308-as átirányítása, a bejelentkezett Admin hibáslink-riport tényleges értékelése és a közzétett Rich Text-link valós kattinthatósága. A WEB-013/F1.1 OPEN.
- **Fejlesztői védelem:** a `scripts/web013-migration-safety-gate.mjs` most mindhárom, éles D1-en kézzel alkalmazott `0025`, `0026`, `0027` SQL automatikus migrációs könyvtárba helyezését blokkolja. A `tests/web013-manual-migration-chain.test.js` új, `0024` sémáról induló SQLite adatbázison egyetlen láncként gyakorolja a három migrációt, a meglévő tartalmak/kapcsolatok és default tagsági seed megőrzésével, külön site/slug izolációval és ismételt futtatás rollbackjével. Az új teszt a `test:web013` regresszió része. Ezek a **helyi/CI regressziók nem jelentik az éles adatbázis ismételt módosítását**.
- **Ledger rés:** az éles `d1_migrations` a kézzel végrehajtott 0025–0027 ellenére 0024-nél tart. A három migráció sem élesben, sem automatikusan nem futtatható újra. Tényleges Wrangler-ledger reconciliációhoz külön, schema-checkkel és adattartalom-ellenőrzéssel biztosított végrehajtás szükséges; addig OPEN, és új automatikus migrációt nem szabad erre a láncra építeni.
- **Következő aktív pont:** a webhelyenkénti Admin útvonalak site-context refaktorja és domain életciklus funkciók, a még nyitott három WEB-013 éles elfogadással párhuzamosan. A Save és Publish továbbra is külön.

## WEB-013 / 77.40 — hitelesített tenant-kontextus az Admin webhelybeállításoknál (2026-10-17)

- **Kód:** az `/api/admin/settings` route a Worker `resolveRequestSite` megbízható domain/site feloldásából megkapja a `siteId` és `siteName` adatokat. Bekapcsolt `SITE_MEMBERSHIP_ENFORCEMENT` esetén **közvetlenül a route-ban is** a `requireSiteGrant(request, env, siteId, "admin")` ellenőrzi a jogosultságot, így másik site-on a felhasználó globális `users.role=admin` szerepköre önmagában nem ad írási/olvasási jogot. A site-on `admin` tagsággal rendelkező felhasználó alacsonyabb régi globális szereppel is a saját site-ján jogosult. Visszavont grant, hiányzó tag, inaktív site vagy jogosultsági hiány esetén 403; séma-/DB-hiba esetén 503. A kliens `X-Site-ID`, query és JSON site paraméterei nem vehetik át a Worker hitelesített kontextusát.
- **Adat- és backward kompatibilitás:** a már bekapcsolt scoped-settings esetén a meglévő `site_scoped_settings` táblát `(site_id,key)` alapján használja; az alapértelmezett webhely régi beállításai és Save/Publish szétválasztása változatlan. Kikapcsolt tagsági flag esetén a régi globális szerepkör csak az alapértelmezett webhelyen használható, idegen site nem kaphat fallbacket. Az ismeretlen vagy még nem engedélyezett idegen domain Admin-hozzáférése továbbra is központilag 403; a teljes többwebhelyes Admin/UI aktiválása még nem része ennek a lépésnek.
- **Teszt:** a `tests/web013-site-scoped-settings.test.js` immár a valós, `site_memberships`-alapú engedélyezést használja, és ellenőrzi a másik webhely viewer/admin szerepét, a revokált grantet, az izolált auditált beállítás-módosítást, a globális role-tól független tagsági szerepet, a táblahiány fail-closed szabályát és a korábbi site-default működést. Az `tests/admin-home-contract.test.js` ellenőrzi a tenant- és legacy role-kaput. Az éles D1 ledger és az előző három WEB-013 éles elfogadás továbbra is nyitott.
- **Következő munka:** ugyanilyen explicit site-context és route-beli hozzáférésellenőrzés végigvezetése a Pages, Editor és Navigation modulokon; a tényleges multi-site auth/domain életciklus feloldása csak ezen route-ok teljes tesztje után.
