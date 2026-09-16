# Sanci9517 — MASTER FEJLESZTÉSI TERV

**Dátum:** 2026-09-16  
**Repository:** `sanci9517/sanci9517`  
**Aktív branch:** `v2/foundation`  
**Státusz:** az új canonical rendszer alapja működik; a régi publikus HTML rendszer archiválva van.

> Ez az aktuális, hivatkozható fejlesztési sorrend. A régebbi tervek és blueprint-ek tartalmát megtartjuk, de a végrehajtás sorrendjét ez a dokumentum határozza meg. Új igény először ide kerül be.

## 0. Végcél

Teljes, saját Sanci9517 streamer-platform: prémium publikus oldal, szerveroldali D1 tartalomkezelés, teljes admin és Visual Editor, közös Page Model + Renderer, Twitch/YouTube/TikTok/Discord integrációk, menetrend, VOD, Shorts, média, statisztika, SEO, Draft/Preview/Publish, Versioning/Rollback, Backup/Restore, audit, majd strukturált SANCI AI és később Stream Assistant.

## 1. Kötelező fejlesztési protokoll

`Tervpont → kód → GitHub visszaolvasás → build/deploy → API → D1/R2/KV → admin → public → mobil/desktop → felhasználói teszt → csak siker esetén következő pont`

- `[x]` ellenőrzött és felhasználó által visszaigazolt
- `[~]` részleges / ellenőrzés alatt
- `[ ]` nincs kész
- `[!]` blokkoló hiba

Sikertelen teszt után nincs következő pont.

## 2. PHASE 0 — Foundation lezárása

### 0/A — Canonical routing
- [x] `/` canonical renderer
- [x] `/p/<slug>` canonical renderer
- [x] legacy URL → canonical redirect
- [x] Worker routing működik
- [x] D1 published snapshot alap

### 0/B — Legacy archívum
- [x] régi publikus HTML-ek eltávolítása az aktív branchből
- [x] dátumozott Git archive branch létrehozva
- [x] aktív rendszer nem függ a legacy HTML-ektől
- [x] admin és aktív renderer megmaradt

### 0/C — Foundation smoke test
- [x] `/` működik
- [x] `/p/...` működik
- [x] Worker működik
- [ ] API smoke test teljes lista
- [ ] D1 állapot végleges ellenőrzése
- [ ] admin login/session smoke test
- [ ] legacy redirect teljes lista

**Kapupont 0:** a fenti nyitott ellenőrzések lezárása.

## 3. PHASE 1 — Visual Editor Core stabilizálása

### 1/A — Editor lifecycle
- [ ] editor megnyitás
- [ ] oldal betöltés
- [ ] loading / empty / error state
- [ ] oldal kiválasztása
- [ ] új oldal
- [ ] mentés
- [ ] újratöltés
- [ ] újratöltés után szerkeszthetőség

### 1/B — Alapelemek
- [ ] box/container
- [ ] heading
- [ ] text
- [ ] button
- [ ] image
- [ ] divider
- [ ] spacer
- [ ] több elem egy parentben
- [ ] elem kijelölése
- [ ] elem újrakijelölése
- [ ] elem szerkesztése
- [ ] törlés
- [ ] duplikálás

### 1/C — Hierarchy / Layers
- [ ] valódi parent/child modell
- [ ] layer tree
- [ ] nested elements
- [ ] parent/child kiválasztás
- [ ] reparent
- [ ] sorrend
- [ ] overlap / z-index
- [ ] lock / hide
- [ ] hierarchy mentés D1-be
- [ ] hierarchy visszatöltése D1-ből

### 1/D — Inspector
- [ ] content
- [ ] layout
- [ ] spacing
- [ ] appearance
- [ ] minden releváns elemnél konzisztens mezők
- [ ] stabil inspector állapot
- [ ] hibás input kezelése

### 1/E — Save gate
- [ ] szerkesztés → mentés
- [ ] D1 ellenőrzés
- [ ] reload
- [ ] elem újrakijelölés
- [ ] újabb szerkesztés
- [ ] újabb mentés
- [ ] preview
- [ ] public renderer ugyanazt mutatja

### 1/F — Core 15 tesztkapu
1. editor megnyílik
2. oldal betöltődik
3. box létrejön
4. heading hozzáadható
5. text hozzáadható
6. button hozzáadható
7. heading újra kijelölhető
8. text újra kijelölhető
9. button újra kijelölhető
10. minden szerkeszthető
11. sorrend működik
12. mentés működik
13. újratöltés után minden megmarad
14. újratöltés után minden újra szerkeszthető
15. public renderer helyesen jeleníti meg

**Kapupont 1:** mind a 15 teszt felhasználói visszaigazolással.

## 4. PHASE 2 — Valódi vizuális szerkesztés

- [ ] zoom / 100% / fit page / teljes oldal
- [ ] grid / guides / snap
- [ ] elem mozgatás
- [ ] drop zone
- [ ] reorder / reparent
- [ ] invalid drop tiltása
- [ ] inline szövegszerkesztés
- [ ] link szerkesztés

## 5. PHASE 3 — Responsive

- [ ] desktop
- [ ] tablet
- [ ] mobile
- [ ] breakpoint modell
- [ ] responsive sizing
- [ ] responsive spacing
- [ ] responsive typography
- [ ] hide/show per device
- [ ] responsive preview

## 6. PHASE 4 — Sanci Brand komponensek

- [ ] Twitch Live
- [ ] Következő adás
- [ ] Adásrend
- [ ] VOD
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] Statisztika
- [ ] Támogatás
- [ ] stream card
- [ ] social card
- [ ] countdown
- [ ] live/offline indicator

## 7. PHASE 5 — Page Model + valódi oldalak

- [ ] stabil page schema
- [ ] stabil element IDs
- [ ] schema validation
- [ ] migration strategy
- [ ] public renderer contract

Minden valódi oldal külön kapun megy át: `Editor → Save → D1 → Reload → Preview → Publish → Public`.

Sorrend: Home → Rólam → Adásrend → Twitch → YouTube → TikTok → Közösség → Kapcsolat → Támogatás → VOD → további oldalak.

Egyszerre nem migráljuk az egész oldalt.

## 8. PHASE 6 — Draft / Preview / Publish + Versioning

- [ ] draft
- [ ] save draft
- [ ] preview
- [ ] publish / unpublish
- [ ] published snapshot
- [ ] version history
- [ ] version diff
- [ ] restore
- [ ] rollback
- [ ] publish audit

## 9. PHASE 7 — Globális komponensek és sablonok

- [ ] header
- [ ] navigation
- [ ] footer
- [ ] global settings
- [ ] reusable components
- [ ] component library
- [ ] templates
- [ ] Sanci page templates

## 10. PHASE 8 — Média

- [ ] R2 alap
- [ ] media metadata D1
- [ ] upload
- [ ] image management
- [ ] thumbnail
- [ ] video metadata
- [ ] media picker
- [ ] delete confirmation
- [ ] orphan cleanup

## 11. PHASE 9 — Schedule / Social / VOD

### 9/A Schedule
- [ ] admin CRUD
- [ ] következő adás kiválasztás
- [ ] múltbeli adások szűrése
- [ ] countdown
- [ ] live status

### 9/B Social
- [ ] Twitch
- [ ] YouTube
- [ ] TikTok
- [ ] Discord
- [ ] normalizált saját adatmodell

### 9/C VOD / Shorts
- [ ] VOD lista
- [ ] kiemelt VOD
- [ ] Shorts lista
- [ ] külső platform linkek
- [ ] automatikus clip workflow előkészítése

## 12. PHASE 10 — SEO + Analytics + Accessibility

- [ ] title
- [ ] description
- [ ] canonical
- [ ] Open Graph
- [ ] robots
- [ ] sitemap
- [ ] structured data
- [ ] analytics events
- [ ] dashboard
- [ ] accessibility audit
- [ ] keyboard navigation
- [ ] semantic HTML

## 13. PHASE 11 — Backup / Restore / Audit / Import / Export

- [ ] page/site backup
- [ ] export format
- [ ] preview restore
- [ ] selected/full restore
- [ ] restore audit
- [ ] admin audit log
- [ ] publish/security event log
- [ ] page/schedule/media export
- [ ] safe import validation

## 14. PHASE 12 — Security hardening

- [ ] login rate limit
- [ ] CSRF
- [ ] session cleanup
- [ ] session refresh
- [ ] részletes RBAC
- [ ] XSS védelem
- [ ] input validation
- [ ] API security
- [ ] secret kezelés
- [ ] security regression tests

## 15. PHASE 13 — Külső integrációk

### 13/A Twitch
- [ ] OAuth
- [ ] live status
- [ ] channel/stream data
- [ ] jogosultságfüggő statisztikák

### 13/B YouTube
- [ ] channel
- [ ] videos
- [ ] live
- [ ] Shorts

### 13/C TikTok
- [ ] hivatalos API lehetőségek felmérése
- [ ] account/content integration
- [ ] statisztikai lehetőségek

### 13/D Discord
- [ ] közösségi link
- [ ] későbbi bot/API lehetőségek

## 16. PHASE 14 — SANCI AI Editor

`AI request → permission → structured action → validation → preview → approval → Page Model → D1 → renderer → audit`

- [ ] AI service
- [ ] tool permission rendszer
- [ ] action schema
- [ ] validation
- [ ] preview-before-apply
- [ ] AI audit
- [ ] AI rollback
- [ ] AI oldal szerkesztés
- [ ] AI tartalomjavaslat
- [ ] AI schedule/social előkészítés

## 17. PHASE 15 — SANCI AI / Stream Assistant

### 15/A Élő adás megfigyelés
- [ ] stream állapot
- [ ] hang aktivitás
- [ ] csendes időszakok
- [ ] chat/context figyelés
- [ ] technikai jelek

### 15/B Élő segítség
- [ ] „nem beszélsz” jelzés
- [ ] ötletadás
- [ ] témajavaslat
- [ ] chat alapján kontextus
- [ ] technikai hibajelzés
- [ ] stream-beállítások ellenőrzése

### 15/C Tartalomértékelés
- [ ] adás elemzése
- [ ] jó pillanatok felismerése
- [ ] engagement elemzés
- [ ] hosszú távú streamer profil
- [ ] tanulási/értékelési ciklus

### 15/D Clip / Short pipeline
- [ ] „jó jelenet” jelölés
- [ ] automatikus klip-előkészítés
- [ ] vágási pontok
- [ ] Short formátum
- [ ] mentés
- [ ] későbbi publikálási workflow

## 18. PHASE 16 — Teljes regresszió és véglegesítés

- [ ] teljes API
- [ ] D1/R2
- [ ] admin
- [ ] Visual Editor
- [ ] Draft/Publish
- [ ] Version/Rollback
- [ ] public renderer
- [ ] mobile/desktop
- [ ] accessibility
- [ ] performance
- [ ] security
- [ ] integration regression
- [ ] AI permission/safety regression

## 19. Amit nem csinálunk

- Nem hozzuk vissza a régi publikus HTML architektúrát.
- Nem folytatjuk a hibás V3 editort.
- Nem építünk AI-t stabil Page Model és Editor nélkül.
- Nem építünk nagy funkciót tesztkapu nélkül.
- Nem migráljuk egyszerre az összes oldalt.
- A frontend nem ír közvetlenül D1/R2/KV-be.
- Secret nem kerül GitHubba.

## 20. AKTUÁLIS KÖVETKEZŐ PONT

### A/1 — Foundation végleges smoke-test és dokumentációs szinkron

1. `/` működés
2. `/p/home` működés
3. legalább egy további `/p/<slug>` működés
4. legacy redirect ellenőrzés
5. Worker/API health
6. D1 pages állapot
7. admin login/session
8. GitHub branch/HEAD
9. aktív public könyvtár legacy HTML-mentessége
10. archive branch létezése

**A/1 csak akkor [x], ha mind a 10 pont rendben van.**

### A/2 — Visual Editor Core teljes audit

Nem módosítunk még. Először feltérképezzük az aktuális editor fájlokat, adatmodellt, API-kat, D1 kapcsolatot és renderer kapcsolatot. Ezután indul az 1/A.
