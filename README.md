# Sanci9517 V2

Moduláris, adatvezérelt Sanci9517 brandplatform: publikus streamer/brand weboldal + külön privát Control Center + Cloudflare backend + platformintegrációk + későbbi SANCI AI.

## Alapelvek

- A publikus oldal és a privát admin teljesen külön belépési pont.
- A publikus mobilnézet stabil, célzottan nem törjük meg desktop-fejlesztésekkel.
- A desktop layout külön szabályrendszerben finomítható.
- A funkciók külön modulokban/fájlokban készülnek, hogy hibánként izolálhatók és tesztelhetők legyenek.
- A működő részeket nem írjuk át feleslegesen.
- A régi, használaton kívüli megoldások nem kerülnek vissza az új rendszerbe.
- A publikus állapot D1-ből tölthető, helyi cache/fallback mellett.
- Az admin módosítások védett szerveroldali munkameneten keresztül menthetők.
- Titkok kizárólag Cloudflare Worker Secretsben maradnak.

## Rendszerfelépítés

### Publikus weboldal

A látogatók számára készülő felület kezeli többek között:

- Sanci9517 brand
- Twitch / YouTube / TikTok jelenlét
- élő állapot
- játék- és streaminformációk
- adások, VOD-ok és klipek
- videók / Shorts
- publikus statisztikák
- közösségi és további brandtartalom

### Privát Control Center

A `admin.html` a teljes tulajdonosi vezérlőközpont. Innen kezelhető:

- weboldal és brand
- oldalak, menüpontok és tartalomblokkok
- Twitch / YouTube / TikTok modulok
- rendszer- és integrációs állapot
- D1 / KV állapot
- audit napló
- Test Center
- későbbi SANCI AI

A publikus oldal **nem** tölti be az admin felületet, és a publikus navigációban nincs admin útvonal.

## Fejlesztési sorrend

1. **Közös foundation** — routing, storage, design system, admin/public szétválasztás.
2. **Twitch** — live, csatorna, statisztika, VOD és clips alapok.
3. **YouTube** — csatorna, videók, Shorts, live és statisztikai alapok.
4. **TikTok** — profil, tartalom, live és statisztikai alapok.
5. **Publikus brandoldal** — a valódi integrációs adatokra épülő végleges látogatói felület.
6. **Control Center** — teljes adminisztráció, tesztelés, finomhangolás.
7. **Teljes rendszerellenőrzés** — útvonalak, API-k, storage, regressziók és deploy smoke test.
8. **SANCI AI** — csak a stabil rendszer tetejére építve, jogosultság- és jóváhagyáskezeléssel.
9. **Alkalmazás** — a stabil web + backend + AI architektúrára építve.

## Projektstruktúra

- `core/` — alkalmazásmag, routing, state és storage
- `components/` — újrahasznosítható UI komponensek
- `pages/` — publikus oldalak
- `admin/` — privát Control Center és szerkesztők
- `schemas/` — adat- és oldalstruktúrák
- `data/` — alapértelmezett publikus adatok
- `styles/` — design system és reszponzív stílusok
- `integrations/` — platformfüggetlen integrációs modulok
- `twitch/`, `youtube/` — platformhoz kötött frontend adapterek
- `worker/` — Cloudflare Worker, D1, KV és szerveroldali auth
- `.github/workflows/` — validáció és Cloudflare deploy + production smoke test

## Cloudflare

A production Worker neve: `sanci9517-api`.

A Workerhez tartozó tartós infrastruktúra:

- D1: `sanci9517-db`
- KV: `sanci9517-cache`
- production endpoint: `https://sanci9517-api.sandor-bogadi95.workers.dev`

A deploy workflow D1 migrációt futtat, deployolja a Workert, majd production `/health` smoke testtel ellenőrzi, hogy ténylegesen az elvárt Worker válaszol.

## Biztonság

- admin felhasználónév/jelszó Worker Secretből
- HMAC-aláírt admin munkamenet
- `__Host-sanci_admin` HttpOnly + Secure cookie
- cross-origin credentialed CORS csak a GitHub Pages originre
- KV alapú sikertelen belépési limit
- D1 audit napló
- lokális `.dev.vars` / `.env` fájlok Gitből kizárva

## Állapot

A rendszer jelenleg az alapoktól felépített V2 architektúrán dolgozik. A következő lépéseket mindig a ténylegesen működő kód, az integrációs állapot és a production smoke tesztek eredménye alapján kell folytatni.
