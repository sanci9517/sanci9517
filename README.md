# Sanci9517

Újraépített streamer webplatform.

## PHASE 01 — Foundation

A projekt moduláris alapokra épül. A publikus weboldal, komponensek, oldalak, sémák, stílusok és a későbbi API külön rétegekben vannak.

### Alapstruktúra

- `core/` — alkalmazásmag és routing
- `components/` — újrahasznosítható UI komponensek
- `pages/` — oldalak
- `schemas/` — adat- és oldalstruktúrák
- `data/` — központi tartalom és beállítások
- `styles/` — design system és reszponzív stílusok
- `worker/` — későbbi API/Twitch backend alap
- `.github/workflows/` — automatizált Worker deploy

## Fejlesztési sorrend

1. Foundation
2. Design System
3. Core
4. Homepage
5. Twitch
6. Admin
7. Database
8. További oldalak és CMS
9. AI
10. PWA / mobilalkalmazás

A régi oldalstruktúra és régi frontend fájlok törölve lettek. Az új rendszerből indulunk tovább.
