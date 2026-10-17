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

## Forrásintegritás

A felosztás kiinduló eredeti Git blob SHA-ja: `16eb83190ffeb805cd9f4bcc9fa7458ddea4c8aa`. A forrás **2 092 085 JavaScript-karakter** hosszú volt; a 12 rész összege pontosan ugyanennyi. A darabolás Markdown címsoroknál történt, és az eredeti szöveget byte/karakter szinten változatlanul hagyja az összefűzés.
