# Sanci9517 Stream Hub

A projekt teljesen újraépítve, régi forráskód nélkül.

## Részek
- reszponzív publikus stream oldal
- központi JSON konfiguráció
- Twitch / játék / menetrend / clips / Discord oldalak
- új AI Admin vezérlőközpont alap
- Cloudflare Worker biztonságos API-alap

## Következő élesítés
A Workerhez Cloudflare API hitelesítés és a szükséges titkok beállítása kell. A Cloudflare hivatalos CI/CD folyamata GitHub Actionsből Wranglerrel támogatott; a tokeneket GitHub Secretsben kell tartani, nem a repositoryban.
