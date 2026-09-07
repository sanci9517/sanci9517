# Sanci9517 V2

Újraépített, moduláris streamer webplatform Sanci9517 számára.

## Projektelvek

- Az új rendszer tiszta alapokról épül.
- A funkciók elkülönített modulokban/fájlokban készülnek.
- Minden fejlesztési lépés után ellenőrzés és teszt következik.
- A működő részeket csak indokolt esetben módosítjuk.
- A publikus weboldal és az admin külön rétegben fejlődik.
- A későbbi integrációk és a SANCI AI nem kerülnek a frontend alapjába idő előtt.

## Fejlesztési sorrend

1. **Sanci9517 V2 weboldal** — publikus oldalak, egységes design system, navigáció, tartalomblokkok és reszponzív megjelenés.
2. **Admin** — teljes admin felület, jogosultságkezelés, weboldal- és tartalomszerkesztés.
3. **Teljes tesztelés** — útvonalak, build, validáció, hibajavítás és regressziós ellenőrzések.
4. **Twitch integráció** — élő állapot, csatornaadatok és későbbi statisztikai alapok.
5. **YouTube integráció** — csatorna- és videóadatok.
6. **TikTok integráció** — profil- és későbbi tartalomadatok.
7. **SANCI AI** — jogosultságkezelt fejlesztői és streaming asszisztens, amely a kész weboldalra és integrációkra épül.

## Alapstruktúra

- `core/` — alkalmazásmag, routing, állapot és tárolás
- `components/` — újrahasznosítható UI komponensek
- `pages/` — publikus oldalak
- `admin/` — admin felület és webhelykezelés
- `schemas/` — adat- és oldalstruktúrák
- `data/` — alapértelmezett tartalom és beállítások
- `styles/` — design system és reszponzív stílusok
- `integrations/` — elkülönített külső platform modulok
- `worker/` — későbbi backend/API réteg
- `.github/workflows/` — automatizált ellenőrzések és deploy folyamatok

## Állapot

A Foundation réteg és a GitHub Pages útvonalkezelés validált. A további fejlesztés lépésenként történik, minden módosítás után teszteléssel.
