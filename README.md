# Sanci9517 — Brand & Creator Platform

## Egyetlen aktuális fejlesztési terv

**Minden termékdöntés és fejlesztési lépés kiindulópontja:**

- [SANCI9517-CREATOR-PLATFORM-PLAN.md](docs/SANCI9517-CREATOR-PLATFORM-PLAN.md) — a teljes Creator Platform termékvíziója, moduljai, közös adat- és storage-architektúrája, Brand Kitje, sablonrendszere, integrációi, regisztrációs modellje, SANCI AI-ja és lépésenkénti fejlesztési sorrendje.

A korábbi tervek kizárólag történeti archívumok; nem aktív fejlesztési tervek, és nem írhatják felül az új nevű, egyetlen kanonikus tervet. A fő fejlesztési terv nem auditnapló: a meglévő, igazolt technikai alapokat és a ténylegesen fejlesztendő termékfunkciókat tartalmazza.

## Alapvető termékdefiníció: Brand Platform, nem streamer-sablon

A SANCI9517 Creator Platform **általános, moduláris Brand & Creator weboldalépítő és működtető platform**. Minden regisztrált felhasználó (a jogosultságai és csomagja szerint) saját nyilvános brand-webhelyet készíthet és kezelhet. A streamer csak egy lehetséges felhasználói profil; ugyanolyan elsőrendű célcsoport a videós, zenész, művész, podcaster, író, freelancer, vállalkozás, csapat és közösség. **Nem kötelező Twitch-fiók, streaming- vagy creator-specifikus integráció egy általános brand-webhely használatához.**

- **Közös webhelymag:** site/workspace ownership, domains, oldalak, navigáció, CMS, média, Brand Kit, sablonok, komponensek, űrlapok, SEO, lokalizáció, publikálás és visszaállítás.
- **Választható képességcsomagok:** streamer/live, creator video/social, portfolio, services/booking, business, community/membership, commerce, nonprofit/event és későbbi modulok. A bekapcsolás nem hoz létre második website engine-t; a nyilvános oldal komponensei az engedélyezett modulok kanonikus adataira hivatkoznak.
- **Sablonrendszer:** teljes webhely-, oldal-, szekció-, layout-, tartalom-, komponens- és design-template; kategóriák, előnézet, variánsok, verziók, kompatibilitás, importálás, változtatás és rollback; sablonválasztás után minden módosítható, nincs profilhoz kötött vendor lock-in.
- **Felhasználói út:** regisztráció → brand/workspace → cél / starter kit → sablon → vizuális szerkesztés → saját modulok bekapcsolása → domain és előnézet → publikálás → analitika. A modulok bármikor bővíthetők vagy letilthatók adatvesztés nélkül, ellenőrzött függőségekkel.
- **Nem funkcionális követelmények:** tenantizoláció, role-based access, akadálymentesség, reszponzivitás, mobilhasználhatóság, SEO, strukturált adatok, biztonság, menthetőség, költség- és kvótakezelés, gyors publikus renderelés.
- **Tervezési minták:** a Webflow komponenspropok, Shopify szekció/blokk szerkezete és Framer sablonindítása referenciák, nem automatikus technológiai függőségek. Külső kódot csak licenc-, karbantartási és biztonsági ellenőrzés után használunk.

**Véglegesítés módja:** kizárólag a lent hivatkozott egyetlen kanonikus MASTER-be kerülhet a teljes feladathierarchia és valamennyi elfogadási teszt. Ez a README termékirányelv, **nem új terv és nem készre jelentett specifikáció**. A teljes MASTER biztonságos kiolvasása/egyesítése még szükséges; azt nem szabad részleges szöveggel felülírni.

## Termékcél

Egy bővíthető, egy Admin felületről kezelhető Brand & Creator Operating Platform, amelynek részei:

- saját márkájú publikus weboldal és valódi Visual Editor;
- közös Brand Kit, design tokenek, site/page/section/component sablonok és reusable blokkok;
- külön Integrációk menü Twitch, YouTube, TikTok, Discord, Kick és további szolgáltatók számára;
- Stream Studio és OBS, overlayek, alert-ek, widgetek;
- adásrend, játékprofilok, VOD, klipek, Shorts és Content Studio;
- közösség, fan accountok, tagság, támogatás, merch/shop és digitális termékek;
- analitika, kampányok, szponzoráció és automatizáció;
- SANCI AI: élő streamfigyelés, visszajelzés, VOD-elemzés, klip- és videógyártás, brand-/weboldal-asszisztens;
- később csapat, több workspace/site, SaaS-csomagok és marketplace.

## Aktuális technikai alap

A projekt Cloudflare Workers + TypeScript környezetet, D1-et strukturált adatokhoz, R2-t bináris objektumokhoz és a kanonikus Visual Editor v2-t használja. A meglévő működő kódot, route-okat, domain-szerződéseket, adatbázis-migrationöket és teszteket kell elsőként újrahasználni. Új könyvtár csak valós technikai és licencellenőrzés után kerülhet be.

## Következő munkapont

A [MASTER 41. fejezete](docs/SANCI9517-CREATOR-PLATFORM-PLAN.md#41-aktuális-termékállapot-és-következő-lépések) rögzíti a jelenlegi sorrendet: először a meglévő Admin → Editor → mentés/újratöltés → előnézet/publikálás → publikus oldal alapfolyamatot kell megbízhatóvá tenni, majd a MASTER fázisai szerint haladni. Ez a végrehajtás sorrendje, nem a teljes termékcél szűkítése.

## Fejlesztési szabályok

1. Egy funkcióhoz egy kanonikus domain/adatforrás tartozik; a több helyen látható UI ugyanazt a szerződést használja.
2. A Page Model nem másolja le a Schedule, Media, Product, Membership vagy Integration üzleti rekordokat.
3. Az Admin moduljai feladat szerint elkülönülnek, de közös jogosultságot, állapotkezelést és domain/API-réteget használnak.
4. A provider-képességeket az aktuális hivatalos API, scope, jóváhagyás és policy határozza meg; hiányzó képességet nem szimulálunk.
5. A tervezett funkció nem egyenlő a kész implementációval. Késznek csak releváns teszt és szükséges valós ellenőrzés után jelölhető.
6. Minden fejlesztési pont kis, végigellenőrizhető felhasználói eredményre épül, és a következő pontot a tényleges repository állapota határozza meg.
