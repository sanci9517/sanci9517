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
