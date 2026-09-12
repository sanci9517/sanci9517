# Sanci9517 V2 — MASTER TERV

> **A teljes Sanci9517 projekt központi terve.**
>
> Ez a dokumentum egy helyen tartalmazza, hogy **milyen weboldalt, milyen szerkesztőt, milyen admin rendszert és milyen későbbi AI/streamer rendszert akarunk felépíteni**.
>
> Állapotjelölések:
> - `[x]` elkészült és a felhasználó ellenőrizte
> - `[~]` részben kész / további teszt szükséges
> - `[ ]` még nincs kész
> - `[!]` ismert probléma vagy újratervezendő pont
>
> **Munkaszabály:** egyszerre egy fejlesztési teszt. Sikertelen tesztnél nem lépünk tovább.

---

# 1. A Sanci9517 oldal célja

A cél nem egy egyszerű bemutatkozó oldal és nem egy statikus streamer-linkgyűjtemény.

A végleges rendszer egy **professzionális, bővíthető streamer brand platform**, amelynek három fő része van:

1. **Publikus Sanci9517 weboldal** — a nézőknek.
2. **Admin + Visual Editor** — minden tartalom és megjelenés szerkesztésére.
3. **Szerveroldali platform + későbbi AI réteg** — adatok, integrációk, elemzés és automatizálás.

A cél az, hogy később a weboldal jelentős része programozás nélkül, az adminból legyen módosítható, miközben a rendszer technikailag továbbra is stabil, biztonságos és bővíthető marad.

---

# 2. A publikus Sanci9517 brand oldal

## 2.1 Alapélmény

- [ ] Modern, professzionális streamer megjelenés
- [ ] Magyar nyelvű publikus tartalom
- [ ] Egységes vizuális rendszer minden oldalon
- [ ] Mobil és desktop ugyanannak a rendszernek két responsive nézete
- [ ] Mobil jelenlegi jó működésének megőrzése
- [ ] Desktop egységesítése és professzionálisabbá tétele
- [ ] Közös navigáció minden oldalon
- [ ] Közös header / footer rendszer
- [ ] Twitch Live állapot jól látható megjelenítése
- [ ] Következő adás visszaszámláló
- [ ] Dinamikus adatok automatikus frissítése
- [ ] Technikai fejlesztői megjegyzések nem jelennek meg a nézőknek

## 2.2 Főoldal

A főoldal maradjon kezdetben egyszerű és áttekinthető; a részletes tartalmak külön oldalakon legyenek.

- [ ] Hero / bemutatkozó blokk
- [ ] Aktuális Twitch Live állapot
- [ ] Következő stream
- [ ] Fő Sanci Buttons
- [ ] Legfontosabb social csatornák
- [ ] Kiemelt tartalom
- [ ] Rövid bemutatkozás
- [ ] Közösség / Discord kiemelés
- [ ] Támogatás lehetőség

## 2.3 Twitch oldal

- [ ] Twitch profil és élő állapot
- [ ] Twitch player
- [ ] Stream információk
- [ ] Aktuális játék
- [ ] Nézőszám / elérhető statisztikák
- [ ] Következő adás
- [ ] VOD / korábbi adások
- [ ] Twitch-re vezető CTA

## 2.4 TikTok oldal

- [ ] TikTok profil
- [ ] TikTok link
- [ ] Rövid videók / kiemelések
- [ ] Kiemelt klipek
- [ ] Követésre ösztönzés
- [ ] Későbbi automatikus short rendszerhez előkészítve

## 2.5 YouTube oldal

- [ ] YouTube csatorna
- [ ] Videók
- [ ] Shorts
- [ ] Kiemelt videó
- [ ] YouTube statisztikák, ha elérhetők

## 2.6 Menetrend / Schedule

- [ ] Heti menetrend
- [ ] Következő adás
- [ ] Visszaszámláló
- [ ] Stream típus
- [ ] Játék
- [ ] Adás állapota
- [ ] Automatikusan frissülő időpontok
- [ ] Mobil / desktop megfelelő megjelenítés

## 2.7 VOD / videók

- [ ] VOD lista
- [ ] Kiemelt VOD
- [ ] Kategóriák / játékok
- [ ] Keresés / szűrés később
- [ ] YouTube / Twitch források

## 2.8 About / Bemutatkozás

- [ ] Sanci bemutatkozása
- [ ] Streamer történet
- [ ] Játékok
- [ ] Célok
- [ ] Közösségi szemlélet
- [ ] Social linkek

## 2.9 Community / Discord

- [ ] Discord közösség bemutatása
- [ ] Csatlakozási gomb
- [ ] Közösségi információk
- [ ] Későbbi community funkciók helye

## 2.10 Támogatás

- [ ] Támogatási lehetőségek
- [ ] Átlátható információk
- [ ] Social / Twitch kapcsolódás
- [ ] Későbbi támogatási szolgáltatások bővíthetősége

## 2.11 Kapcsolat

- [ ] Kapcsolati lehetőségek
- [ ] Üzleti kapcsolat
- [ ] Social linkek
- [ ] Későbbi partners / sponsorship kapcsolat

## 2.12 Későbbi bővíthető oldalak

- [ ] Partners / támogatók
- [ ] Merch
- [ ] Blog / hírek
- [ ] Events
- [ ] Community hub
- [ ] Creator resources
- [ ] Clips / Shorts külön oldal

---

# 3. Navigáció és közös design

- [ ] Mobilon bevált menümodell megtartása
- [ ] Desktopon is ugyanaz az alap navigációs logika
- [ ] Bal oldali menüvezérlő
- [ ] Sanci név / brand elem a menü mellett
- [ ] Twitch Live indicator a jobb oldalon
- [ ] Egységes animációk
- [ ] Egységes spacing
- [ ] Egységes kártyaméretek
- [ ] Egységes gombok
- [ ] Egységes ikonrendszer
- [ ] Egységes typography
- [ ] Egységes színrendszer
- [ ] Dark streamer-brand alapmegjelenés
- [ ] Responsive komponensek

---

# 4. Visual Editor — a rendszer célja

A Visual Editor célja, hogy később az oldal szinte teljes vizuális szerkezete adminból módosítható legyen.

Nem csak szöveget akarunk szerkeszteni.

A szerkesztőnek hosszú távon képesnek kell lennie:

- [ ] Oldalak létrehozására
- [ ] Oldalak másolására
- [ ] Oldalak törlésére
- [ ] Oldalak átnevezésére
- [ ] Slug kezelésére
- [ ] Szakaszok kezelésére
- [ ] Elemek létrehozására
- [ ] Elemek mozgatására
- [ ] Méretezésre
- [ ] Duplikálásra
- [ ] Törlésre
- [ ] Csoportosításra
- [ ] Rétegek kezelésére
- [ ] Lock / unlock
- [ ] Hide / show
- [ ] Copy / paste
- [ ] Undo / redo
- [ ] Verziózásra
- [ ] Preview-ra
- [ ] Publishra
- [ ] Responsive szerkesztésre

---

# 5. Visual Editor — elemrendszer

## Alap elemek

- [ ] H1–H6
- [ ] Paragraph
- [ ] Link
- [ ] Button
- [ ] Image
- [ ] Video
- [ ] Audio
- [ ] Icon
- [ ] Divider
- [ ] Spacer
- [ ] Badge

## Layout elemek

- [ ] Container
- [ ] Section
- [ ] Card
- [ ] Flex
- [ ] Grid
- [ ] Stack
- [ ] Columns
- [ ] Panel

## Interaktív elemek

- [ ] Tabs
- [ ] Accordion
- [ ] Modal
- [ ] Tooltip
- [ ] Dropdown
- [ ] Carousel

## Streamer-specifikus elemek

- [ ] Twitch Live card
- [ ] Twitch player
- [ ] TikTok card
- [ ] YouTube card
- [ ] VOD card
- [ ] Schedule card
- [ ] Countdown
- [ ] Stream statistics
- [ ] Followers counter
- [ ] Subscribers counter
- [ ] Game card
- [ ] Game list
- [ ] Social buttons
- [ ] Discord CTA
- [ ] Support CTA
- [ ] Sanci Button

---

# 6. Sanci Button rendszer

A Sanci Buttons külön komponensrendszer lesz.

**Nem hard-coded emoji és nem szétszórt HTML.**

- [ ] Központi registry
- [ ] Stabil ID
- [ ] Név
- [ ] Leírás
- [ ] Ikon ID
- [ ] Külön ikonkönyvtár
- [ ] A jelenleg kiválasztott ikonok pontos visszaállítása referencia alapján
- [ ] Ikon csere
- [ ] Link / action
- [ ] Külső link
- [ ] Belső oldal
- [ ] Gomb láthatóság
- [ ] Sorrend
- [ ] Duplikálás
- [ ] Új gombtípus létrehozása
- [ ] Több oldalon használható komponens
- [ ] Globális változtatás
- [ ] Oldalszintű override
- [ ] Hover
- [ ] Active
- [ ] Disabled
- [ ] Ikon + szöveg
- [ ] Csak ikon
- [ ] Csak szöveg
- [ ] AI által módosítható, jogosultsághoz kötve

---

# 7. Design rendszer

- [ ] Központi színpaletta
- [ ] Typography scale
- [ ] Spacing scale
- [ ] Border scale
- [ ] Radius scale
- [ ] Shadow scale
- [ ] Button variants
- [ ] Card variants
- [ ] Breakpoints
- [ ] Animation tokens
- [ ] Design tokens D1 / konfigurációs rétege
- [ ] Globális módosítás egy helyről
- [ ] Komponensek ne tartalmazzanak felesleges hard-coded értékeket

---

# 8. Szerveroldal és adatmodell

- [x] Cloudflare Worker
- [x] D1 alap
- [x] Szerveroldali adatkezelési irány
- [ ] Stabil migrációs rendszer
- [ ] Pages
- [ ] Page revisions
- [ ] Page sections
- [ ] Components
- [ ] Component instances
- [ ] Sanci Buttons
- [ ] Site settings
- [ ] Social accounts
- [ ] Schedule
- [ ] Media
- [ ] SEO metadata
- [ ] Analytics events
- [ ] Audit logs
- [ ] Integrations

---

# 9. Admin rendszer

- [ ] Biztonságos admin login
- [ ] Dashboard
- [ ] Visual Editor
- [ ] Oldalkezelés
- [ ] Sanci Button kezelés
- [ ] Social kezelés
- [ ] Schedule kezelés
- [ ] Média kezelés
- [ ] SEO
- [ ] Analytics
- [ ] Integrációk
- [ ] Beállítások
- [ ] Audit log
- [ ] AI modul később

---

# 10. Média rendszer

- [ ] Cloudflare R2
- [ ] Média könyvtár
- [ ] Upload
- [ ] Preview
- [ ] Replace
- [ ] Delete/archive
- [ ] Thumbnail
- [ ] Image optimization
- [ ] MIME ellenőrzés
- [ ] Fájlméret korlátozás
- [ ] Biztonságos fájlnevek
- [ ] Videó támogatás
- [ ] Audio támogatás
- [ ] Clip/short fájlok támogatása

---

# 11. Publikálás és verziózás

- [ ] Draft
- [ ] Preview
- [ ] Publish
- [ ] Unpublish
- [ ] Republish
- [ ] Revision history
- [ ] Restore
- [ ] Publish timestamp
- [ ] Published revision ID
- [ ] Cache invalidation
- [ ] Preview-only állapot
- [ ] Változások összehasonlítása

---

# 12. SEO és megtalálhatóság

- [ ] Title
- [ ] Description
- [ ] Canonical
- [ ] Open Graph
- [ ] X/Twitter card
- [ ] Sitemap
- [ ] Robots
- [ ] Structured data
- [ ] SEO preview
- [ ] Oldalankénti SEO

---

# 13. Analytics

- [ ] Page views
- [ ] Button clicks
- [ ] Social clicks
- [ ] Stream events
- [ ] Conversion events
- [ ] Admin dashboard
- [ ] Privacy-aware analytics
- [ ] Retention policy

---

# 14. Biztonság

- [ ] HttpOnly session
- [ ] Secure cookie
- [ ] SameSite
- [ ] Password hash
- [ ] CSRF
- [ ] Rate limiting
- [ ] RBAC
- [ ] Admin API protection
- [ ] Public/admin API separation
- [ ] Secrets Cloudflare Secretben
- [ ] Audit log
- [ ] Input validation
- [ ] Output validation
- [ ] File validation
- [ ] AI permission boundary

---

# 15. Integrációk

## Twitch

- [ ] OAuth
- [ ] Live state
- [ ] Stream title
- [ ] Game
- [ ] Viewer statistics
- [ ] Followers/subscribers, ahol elérhető
- [ ] VOD
- [ ] Clips

## YouTube

- [ ] Channel
- [ ] Videos
- [ ] Shorts
- [ ] Statistics, ahol elérhető

## TikTok

- [ ] Profil
- [ ] Tartalmak
- [ ] Integrációs lehetőségek vizsgálata

## Discord

- [ ] Community link
- [ ] Későbbi integráció, ha indokolt

---

# 16. Későbbi AI — Sanci Stream Assistant

Ez hosszú távú cél, nem az aktuális editor teszt része.

Az AI nem egyszerű chatbot és nem egy meglévő streamer oldal klónja.

Célja egy **valódi stream-elemző és streamer-asszisztens rendszer**.

## Adás közben

- [ ] Figyeli az adás állapotát
- [ ] Figyeli a beszédaktivitást
- [ ] Jelzi, ha túl hosszú ideje nincs beszéd
- [ ] Figyeli a chat aktivitást
- [ ] Ötleteket ad, amikor szükséges
- [ ] Jelzi a technikai problémákat
- [ ] Audio probléma felismerése
- [ ] Mikrofon probléma jelzése
- [ ] OBS állapot figyelése
- [ ] Scene állapot ellenőrzése
- [ ] Stream minőség figyelése
- [ ] Tartalmi pillanatok felismerése

## Adás elemzése

- [ ] Teljes stream elemzés
- [ ] Beszédaktivitás
- [ ] Csendek
- [ ] Chat aktivitás
- [ ] Nézőszám alakulása
- [ ] Jó pillanatok
- [ ] Gyenge részek
- [ ] Tartalmi javaslatok
- [ ] Következő stream javaslatok
- [ ] Heti összefoglaló

## Clip / Short rendszer

- [ ] Jó pillanat megjelölése
- [ ] Egy gombbal clip indítása
- [ ] Automatikus mentés
- [ ] Vágási pontok meghatározása
- [ ] Vertical short előkészítése
- [ ] Felirat előkészítése
- [ ] Cím / hook javaslat
- [ ] TikTok/YouTube Shorts export előkészítése

## AI + weboldal

- [ ] AI oldalváltoztatási javaslat
- [ ] AI által létrehozott draft
- [ ] AI által módosított Sanci Button
- [ ] AI által módosított schedule
- [ ] AI által előkészített social tartalom
- [ ] AI által előkészített oldal
- [ ] Minden AI művelet auditált
- [ ] Veszélyes műveletekhez felhasználói jóváhagyás

---

# 17. AI jogosultsági modell

Az AI nem kap korlátlan hozzáférést.

`AI kérés → jogosultság → engedélyezett eszköz → service → repository → D1/R2 → audit`

- [ ] Tool registry
- [ ] Tool permission
- [ ] Read-only AI mód
- [ ] Draft-only AI mód
- [ ] User-approved write mód
- [ ] Audit minden AI módosításról
- [ ] Rollback lehetőség

---

# 18. Tesztelési rendszer

Minden új funkció:

1. fejlesztés
2. deploy
3. egy konkrét teszt
4. felhasználói ellenőrzés
5. `[x]`
6. következő teszt

- [x] Ezt a munkamódszert használjuk
- [ ] Unit tesztek
- [ ] Integration tesztek
- [ ] API smoke tesztek
- [ ] Public page smoke tesztek
- [ ] Editor regression tesztek
- [ ] Responsive regression tesztek
- [ ] Security tesztek
- [ ] Publish regression tesztek
- [ ] AI tool permission tesztek

---

# 19. Jelenlegi tényleges állapot

## Ellenőrzött

- [x] Editor működik
- [x] Elem kiválasztás működik
- [x] H1 módosítás működik
- [x] Bekezdés módosítás működik
- [x] Gomb módosítás működik
- [x] Pozíció módosítás működik
- [x] Méret módosítás működik
- [x] Több elem kezelése működik
- [x] Elem törlés működik
- [x] D1 mentés működik
- [x] Mentett állapot visszaolvasása működik
- [x] Frissítés után állapot megmarad
- [x] Új oldal létrehozása működik
- [x] Új oldal tartalma Preview-ban működik
- [x] Új elem publikus oldalon megjelenik
- [x] Border preset működik
- [x] Preview PC működik
- [x] Preview Mobile működik
- [x] Preview Mobile stacking javítva és ellenőrizve
- [x] Publikus új oldal mobil egyoszlopos alapja működik

## Nem tekintjük késznek

- [ ] Page delete — nincs még megvalósítva
- [ ] Sanci Button registry
- [ ] Exact icon registry
- [ ] Undo/redo
- [ ] Publish rendszer teljesen
- [ ] Verziózás
- [ ] Responsive editor teljes rendszere
- [ ] Teljes komponensrendszer
- [ ] Teljes admin auth
- [ ] Twitch/TikTok/YouTube teljes integráció
- [ ] AI layer
- [ ] Stream Assistant

---

# 20. Fejlesztési prioritás

### P0 — Alap és biztonság

- [ ] Server-side auth
- [ ] D1 schema stabilizálás
- [ ] API réteg
- [ ] Admin védelem
- [ ] Editor stabilizálása

### P1 — Visual Editor

- [ ] Elemkezelés
- [ ] Layout
- [ ] Styling
- [ ] Responsive
- [ ] Sanci Button rendszer
- [ ] Components
- [ ] Templates
- [ ] Undo/redo
- [ ] Versioning

### P2 — Publikus brand oldal

- [ ] Közös design system
- [ ] Twitch
- [ ] TikTok
- [ ] YouTube
- [ ] Schedule
- [ ] VOD
- [ ] About
- [ ] Community
- [ ] Support
- [ ] Contact

### P3 — Integrációk / SEO / analytics

- [ ] Twitch API
- [ ] YouTube API
- [ ] TikTok
- [ ] SEO
- [ ] Analytics
- [ ] Media/R2

### P4 — AI

- [ ] AI service
- [ ] Tool permission
- [ ] Stream analysis
- [ ] Stream Assistant
- [ ] Clip/Short automation
- [ ] AI website control

---

# 21. Terv karbantartási szabály

Ez a dokumentum **élő terv**.

Ha új ötlet vagy új tapasztalat merül fel:

1. először bekerül ide,
2. meghatározzuk, melyik rendszerhez tartozik,
3. megvizsgáljuk, hogy érinti-e az architektúrát,
4. ha igen, előbb az architektúrát módosítjuk,
5. csak ezután kezdjük a kódolást,
6. elkészült + felhasználó által ellenőrzött állapotban `[x]` lesz.

A fejlesztési részletes ellenőrzőlista továbbra is a `docs/DEVELOPMENT-PLAN.md`.

Ez a dokumentum a **teljes Sanci9517 vízió és fejlesztési irány központi terve**.
