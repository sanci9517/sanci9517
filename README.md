# Sanci9517 — Brand & Creator Platform

## Egyetlen aktuális fejlesztési terv

**Minden termékdöntés és fejlesztési lépés kiindulópontja:**

- [MASTER-DEVELOPMENT-PLAN.md](docs/MASTER-DEVELOPMENT-PLAN.md) — a teljes Creator Platform termékvíziója, moduljai, közös adat- és storage-architektúrája, Brand Kitje, sablonrendszere, integrációi, regisztrációs modellje, SANCI AI-ja és lépésenkénti fejlesztési sorrendje.

A régi tervek és történeti anyagok a Git-előzményekben/archívumban megmaradhatnak, de nem helyettesítik és nem írják felül az aktuális MASTER-t. A fő fejlesztési terv nem auditnapló: a meglévő, igazolt technikai alapokat és a ténylegesen fejlesztendő termékfunkciókat tartalmazza.

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

A [MASTER 41. fejezete](docs/MASTER-DEVELOPMENT-PLAN.md#41-aktuális-termékállapot-és-következő-lépések) rögzíti a jelenlegi sorrendet: először a meglévő Admin → Editor → mentés/újratöltés → előnézet/publikálás → publikus oldal alapfolyamatot kell megbízhatóvá tenni, majd a MASTER fázisai szerint haladni. Ez a végrehajtás sorrendje, nem a teljes termékcél szűkítése.

## Fejlesztési szabályok

1. Egy funkcióhoz egy kanonikus domain/adatforrás tartozik; a több helyen látható UI ugyanazt a szerződést használja.
2. A Page Model nem másolja le a Schedule, Media, Product, Membership vagy Integration üzleti rekordokat.
3. Az Admin moduljai feladat szerint elkülönülnek, de közös jogosultságot, állapotkezelést és domain/API-réteget használnak.
4. A provider-képességeket az aktuális hivatalos API, scope, jóváhagyás és policy határozza meg; hiányzó képességet nem szimulálunk.
5. A tervezett funkció nem egyenlő a kész implementációval. Késznek csak releváns teszt és szükséges valós ellenőrzés után jelölhető.
6. Minden fejlesztési pont kis, végigellenőrizhető felhasználói eredményre épül, és a következő pontot a tényleges repository állapota határozza meg.
