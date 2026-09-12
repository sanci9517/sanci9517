# Sanci9517 V2 — Architecture Blueprint

## 1. Cél

A Sanci9517 streamer brand oldal legyen egy valódi, bővíthető webalkalmazás: a publikus oldal, az admin felület és a backend ugyanarra a központi rendszerre épüljön. A későbbi AI-funkciók ezért már most külön szolgáltatási réteget kapnak.

## 2. Alapelv

- GitHub: kizárólag forráskód, konfiguráció és migrációk.
- Cloudflare Worker: egyetlen belépési pont a webhez és API-hoz.
- D1: strukturált, adminból szerkeszthető tartalom és beállítások.
- R2: képek, videó-bélyegképek és egyéb média.
- KV: rövid életű cache és nem kritikus gyorsítótár.
- Secrets: Twitch/TikTok/YouTube/API/auth titkok; soha nem kerülnek GitHubba.
- A frontend nem kap közvetlen hozzáférést D1/R2/KV-hez; minden érzékeny művelet Worker API-n keresztül történik.

## 3. Végleges könyvtárstruktúra

```text
public/
  index.html
  pages/
    twitch.html
    tiktok.html
    youtube.html
    schedule.html
    vod.html
    about.html
    contact.html
  admin/
    index.html
    login.html
    dashboard.html
    content.html
    socials.html
    schedule.html
    media.html
    seo.html
    analytics.html
    settings.html
  assets/
    css/
    js/
    icons/

src/
  index.ts
  core/
    router.ts
    response.ts
    errors.ts
    security/
    auth/
  routes/
    public/
    api/
      auth/
      content/
      socials/
      schedule/
      media/
      analytics/
      settings/
      integrations/
      ai/
    admin/
  services/
    site/
    content/
    social/
    schedule/
    media/
    analytics/
    integrations/
    ai/
  db/
    migrations/
    repositories/
    queries/
  types/
  utils/

tests/
  unit/
  integration/

wrangler.jsonc
package.json
tsconfig.json
```

A struktúra szándékosan moduláris. Nem lesz egyetlen óriási Worker-fájl.

## 4. Publikus oldal

Kezdő oldalak:

- `/` — Home
- `/twitch` — Twitch
- `/tiktok` — TikTok
- `/youtube` — YouTube
- `/schedule` — élő adás / heti menetrend
- `/vod` — VOD és kiemelt videók
- `/about` — bemutatkozás
- `/contact` — kapcsolat

Később bővíthető: Discord, támogatás, merch, partners, blog/news.

Minden oldal közös design tokenekből, komponensekből és közös navigációból épül. Mobil és desktop külön töréspontokon kezelhető, de nem két külön weboldal.

## 5. Admin rendszer

Az admin belépési pontja `/admin/login`.

Főmenü:

1. Dashboard
2. Tartalom
3. Social csatornák
4. Adásrend
5. Média
6. SEO
7. Analitika
8. Integrációk
9. Beállítások
10. AI — későbbi modul

Az admin minden módosítása API-n keresztül megy. A kliens soha nem ír közvetlenül D1-be.

## 6. D1 adatmodell

Első stabil séma:

- `users` — admin felhasználók
- `roles` — szerepkörök
- `user_roles` — felhasználó/szerepkör kapcsolat
- `sessions` — bejelentkezési munkamenetek
- `site_settings` — globális oldalbeállítások
- `pages` — publikus oldalak
- `page_sections` — oldalszakaszok
- `social_accounts` — Twitch/TikTok/YouTube/Discord stb.
- `schedule_items` — adások
- `media_items` — média metaadatok; maga a fájl R2-ben
- `seo_metadata` — oldalankénti SEO adatok
- `integrations` — külső szolgáltatások konfigurációs metaadatai
- `analytics_events` — saját események minimális tárolása
- `audit_logs` — admin műveletek naplózása

A táblákhoz migrációk készülnek, nem kézzel össze-vissza módosított production SQL.

## 7. API

Publikus:

- `GET /api/health`
- `GET /api/site`
- `GET /api/pages/:slug`
- `GET /api/socials`
- `GET /api/schedule`
- `GET /api/media`

Admin:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET/PUT /api/admin/settings`
- `GET/POST/PUT/DELETE /api/admin/pages`
- `GET/POST/PUT/DELETE /api/admin/sections`
- `GET/POST/PUT/DELETE /api/admin/socials`
- `GET/POST/PUT/DELETE /api/admin/schedule`
- `GET/POST/DELETE /api/admin/media`
- `GET/PUT /api/admin/seo`
- `GET /api/admin/analytics`
- `GET/PUT /api/admin/integrations`

AI később:

- `POST /api/ai/chat`
- `POST /api/ai/analyze`
- `POST /api/ai/site-change`

Az AI végpontok külön jogosultságot és auditálást kapnak.

## 8. Auth és jogosultság

A hozzáférés már az alapoktól szerveroldali lesz.

- HttpOnly, Secure, SameSite cookie alapú session.
- Jelszó csak biztonságos, egyirányú hash formában tárolható.
- CSRF-védelem az állapotmódosító admin kérésekhez.
- Rate limiting a login és érzékeny végpontokon.
- Role-based access control: kezdetben `owner` és `admin`, később finomítható jogosultságok.
- Audit log minden fontos admin változtatásról.
- Secrets nem kerülnek a repóba.

## 9. Cloudflare réteg

### Worker

A weboldal és API szerveroldali belépési pontja.

### D1

A strukturált tartalom elsődleges adatforrása. A Worker bindingon keresztül éri el.

### R2

Médiafájlok és nagyobb objektumok tárolása. Az adatbázis csak a metaadatot tárolja.

### KV

Cache, feature flag vagy rövid életű, nem kritikus adatok. Nem ez lesz a tartalom elsődleges adatbázisa.

### Queues / Durable Objects

Nem kapcsoljuk be indokolatlanul. Csak akkor kerülnek be, ha később a háttérfeladatok vagy valós idejű AI/stream funkciók ténylegesen indokolják.

## 10. Külső integrációk

A Twitch/TikTok/YouTube integrációk külön service modulok lesznek. Az API-kulcsok és OAuth titkok Cloudflare Secretként maradnak.

A publikus oldal csak normalizált saját adatmodellt kap, így egy külső API változása nem kényszeríti át az egész frontend átírását.

## 11. AI későbbi felépítése

Az AI nem kap közvetlen, korlátlan adatbázis-hozzáférést.

Rétegek:

`AI request → permission check → AI service → allowed tools → repository/service → audit log`

Az AI később képes lehet:

- adásadatok elemzésére,
- statisztikák összefoglalására,
- stream közbeni segítségre,
- tartalomjavaslatokra,
- admin által engedélyezett oldalváltoztatásokra,
- schedule és social tartalom előkészítésére.

A veszélyes vagy nagy hatású műveletekhez jóváhagyási lépés marad.

## 12. SEO

Oldalanként kezelhető:

- title
- description
- canonical
- Open Graph adatok
- Twitter/X card
- robots
- strukturált adatok
- sitemap

Az adminból szerkeszthető SEO mezők D1-ben lesznek.

## 13. Cache stratégia

- Publikus, ritkán változó tartalom: rövid cache.
- Admin API: `no-store`.
- Média: R2/HTTP cache.
- Frissítéskor célzott cache invalidálás.

A cache nem írhatja felül az adatbázis igazságforrását.

## 14. Biztonsági alapelv

A böngésző nem ismeri a Cloudflare secretjeit, D1 credentialjeit vagy külső OAuth titkait.

Minden admin mutation:

`browser → authenticated API → authorization → validation → service → repository → D1/R2 → audit`

## 15. Fejlesztési sorrend

### Fázis 1 — Foundation

- repository alap
- Worker
- routing
- health
- alap public shell
- típusok

### Fázis 2 — Server-side access

- D1 binding
- migrációs rendszer
- auth/session
- admin login
- jogosultságok

### Fázis 3 — Admin CMS

- dashboard
- settings
- pages/sections
- schedule
- socials
- media

### Fázis 4 — Public site

- egységes design rendszer
- home
- Twitch
- TikTok
- YouTube
- schedule
- VOD
- about/contact

### Fázis 5 — Integrációk

- Twitch
- YouTube
- TikTok
- Discord és továbbiak csak szükség esetén

### Fázis 6 — SEO/analytics/security hardening

### Fázis 7 — AI layer

- AI service
- tool permission rendszer
- stream analysis
- admin/site actions

## 16. Kötelező ellenőrzés minden fázis után

Minden lépésnél:

1. TypeScript ellenőrzés.
2. Build/deploy ellenőrzés.
3. Health endpoint ellenőrzés.
4. Érintett API-k ellenőrzése.
5. Publikus oldal ellenőrzése.
6. Admin oldal ellenőrzése, ha érintett.
7. Git diff/commit ellenőrzés.
8. Csak sikeres ellenőrzés után következő fázis.

## 17. Fontos döntés

A régi projektből nem másoljuk vissza a régi hibás architektúrát. Az új V2 tiszta alapra épül, de a korábbi működési tapasztalatokat megtartjuk.

A jelenlegi `v2/foundation` branch erre a blueprintre épül.

## 18. Élő részletes fejlesztési terv

A részletes, kipipálható és folyamatosan frissítendő ellenőrzőlista külön dokumentumban van:

`docs/DEVELOPMENT-PLAN.md`

Ezt használjuk a napi fejlesztés során. Ha új igény merül fel, előbb ide kerül be, és csak utána kezdjük a megvalósítást. A terv célja, hogy később bármikor vissza lehessen térni, ellenőrizni lehessen az állapotot, és új funkciókat lehessen hozzáadni anélkül, hogy az architektúrát újra kelljen tervezni.
