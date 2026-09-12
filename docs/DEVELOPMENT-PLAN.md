# Sanci9517 V2 — Élő fejlesztési terv

> **Ez a dokumentum az aktuális fejlesztési állapot egyetlen ellenőrző listája.**
> Minden elkészült és felhasználó által ellenőrzött pontot `[x]` jelölünk. A `[~]` részben elkészült / további tesztet igényel, a `[ ]` még nincs kész.
>
> **Munkaszabály:** egyszerre egy teszt. Csak a felhasználó által megerősített sikeres teszt után lépünk tovább. Ha hibát találunk, előbb javítjuk és újrateszteljük.

## 0. Projektállapot

- [x] GitHub repository: `sanci9517/sanci9517`
- [x] Aktív fejlesztési ág: `v2/foundation`
- [x] Cloudflare Worker: `sanci9517-streamer-brand`
- [x] D1 alap már létrehozva
- [x] GitHub → Cloudflare build/deploy kapcsolat működik
- [x] Moduláris fájlstruktúra alapja megvan
- [x] Szerveroldali tartalomlánc / D1 irány kijelölve

## 1. Kötelező fejlesztési munkafolyamat

- [x] Lépésenkénti fejlesztés
- [x] Minden lépés után ellenőrzés
- [x] Sikertelen tesztnél nincs továbblépés
- [x] Git commit minden érdemi változtatás után
- [x] Cloudflare deploy ellenőrzése érintett változás után
- [ ] Végleges automatikus tesztcsomag (unit + integration + smoke)
- [ ] Hibák és regressziók külön naplózása

## 2. Visual Editor — jelenlegi, ellenőrzött funkciók

- [x] Editor megnyitása
- [x] Elem kiválasztása
- [x] H1 szöveg módosítása
- [x] Bekezdés módosítása
- [x] Gomb módosítása
- [x] Elem pozíciójának módosítása
- [x] Elem méretének módosítása
- [x] Több elem együttes kezelése
- [x] Elem törlése
- [x] Mentés D1-be
- [x] Mentett állapot visszaolvasása
- [x] Teljes böngészőfrissítés után állapot megmarad
- [x] Új oldal létrehozása
- [x] Új oldal mentése és visszatöltése
- [x] Új oldal tartalma Preview-ban megjelenik
- [x] Új elem a valódi publikus oldalon is megjelenik
- [x] Border preset
- [x] Új/publikált oldal alap mobil egyoszlopos elrendezése
- [x] Preview PC/Mobile váltás
- [x] Preview Mobile javítása és felhasználói ellenőrzése

## 3. Visual Editor — következő alapfunkciók

### 3.1 Elemkezelés

- [ ] Elem duplikálása
- [ ] Több elem kijelölése
- [ ] Csoportosítás / csoport feloldása
- [ ] Lock / unlock
- [ ] Hide / show
- [ ] Layer sorrend: előre / hátra / legelőre / leghátra
- [ ] Drag & drop pozicionálás
- [ ] Snap / segédvonalak
- [ ] Igazítás: bal / közép / jobb / felső / közép / alsó
- [ ] Egyenletes elosztás
- [ ] Másolás / beillesztés
- [ ] Stílus másolása / beillesztése
- [ ] Tömeges törlés megerősítéssel

### 3.2 Szöveg

- [ ] Címek H1–H6
- [ ] Bekezdés
- [ ] Link
- [ ] Lista / számozott lista
- [ ] Idézet
- [ ] Inline formázás: félkövér, dőlt, aláhúzás
- [ ] Betűtípus
- [ ] Betűméret
- [ ] Betűvastagság
- [ ] Sorköz
- [ ] Betűköz
- [ ] Szöveg igazítása
- [ ] Szöveg színe
- [ ] Háttérszín
- [ ] Link állapotok

### 3.3 Képek és média

- [ ] Kép beszúrása
- [ ] Kép feltöltése R2-be
- [ ] Kép cseréje
- [ ] Kép kivágása / object-fit
- [ ] Kép pozicionálása
- [ ] Alt szöveg
- [ ] Kép linkelése
- [ ] Videó elem
- [ ] Videó-bélyegkép
- [ ] Audio elem
- [ ] Média könyvtárból választás
- [ ] Média törlése / archiválása
- [ ] Méret- és formátumkorlátok

### 3.4 Gombok és Sanci Buttons

**Fontos architekturális döntés:** a Sanci gombok nem lehetnek szétszórt, hard-coded HTML/emoji elemek. Központi, azonosító-alapú komponens/adatmodell kell.

- [ ] Központi Sanci Button registry
- [ ] Stabil button ID
- [ ] Megjelenítési név szerkesztése
- [ ] Leírás szerkesztése
- [ ] Ikon stabil ID alapján
- [ ] Kiválasztott ikonok külön ikonkönyvtárból
- [ ] Ikon csere adminból
- [ ] Link / action szerkesztése
- [ ] Külső link / belső oldal támogatás
- [ ] Gomb láthatóságának kapcsolása
- [ ] Gomb sorrendjének kezelése
- [ ] Gomb duplikálása
- [ ] Új Sanci Button típus létrehozása később
- [ ] Egy gomb több oldalon újrahasznosítható legyen
- [ ] Egy gomb változtatása kontrolláltan frissítse az összes használatot
- [ ] Oldalszintű felülírások támogatása, ha szükséges
- [ ] Gomb állapotok: normál / hover / aktív / tiltott
- [ ] Ikon + szöveg / csak ikon / csak szöveg mód
- [ ] AI számára engedélyezett button-módosító eszköz később
- [ ] A jelenlegi kiválasztott ikonok pontos visszaállítása referencia alapján; találomra nem helyettesítjük őket

### 3.5 Alakzatok és konténerek

- [ ] Container
- [ ] Section
- [ ] Card
- [ ] Grid
- [ ] Flex row / column
- [ ] Divider
- [ ] Spacer
- [ ] Badge / tag
- [ ] Panel
- [ ] Modal / popup
- [ ] Tabs
- [ ] Accordion
- [ ] Marquee / ticker csak indokolt esetben

### 3.6 Layout

- [x] X / Y pozíció
- [x] Width / height
- [ ] Min/max width
- [ ] Min/max height
- [ ] Padding
- [ ] Margin
- [ ] Gap
- [ ] Display
- [ ] Position
- [ ] Z-index
- [ ] Overflow
- [ ] Flex beállítások
- [ ] Grid beállítások
- [ ] Container max-width
- [ ] Egységes spacing rendszer
- [ ] Design token alapú spacing

### 3.7 Megjelenés

- [ ] Háttérszín
- [ ] Háttérkép
- [ ] Gradient
- [ ] Szövegszín
- [ ] Border
- [x] Border preset
- [ ] Border width/style/color
- [ ] Border radius
- [ ] Shadow
- [ ] Opacity
- [ ] Transform
- [ ] Transition
- [ ] Hover effect
- [ ] Focus state
- [ ] Theme/design token választás
- [ ] Központi színpaletta
- [ ] Központi tipográfiai skála

## 4. Responsive rendszer

- [x] Desktop alap működés
- [x] Mobile alap működés
- [x] Preview PC/Mobile
- [x] Preview Mobile stacking javítva
- [x] Publikus új oldalak mobil egyoszlopos alapja
- [ ] Tablet breakpoint szerkesztése
- [ ] Mobil breakpoint szerkesztése
- [ ] Elemenkénti desktop/tablet/mobile értékek
- [ ] Mobilon elrejtés
- [ ] Tablet-only / desktop-only / mobile-only láthatóság
- [ ] Responsive typography
- [ ] Responsive spacing
- [ ] Responsive image sizing
- [ ] Orientation kezelés

## 5. Oldalkezelés

- [x] Új oldal létrehozása
- [x] Oldal tartalmának mentése
- [ ] Oldal átnevezése
- [ ] Slug szerkesztése biztonságosan
- [ ] Oldal másolása / klónozása
- [ ] Oldal törlése
- [ ] Törlés megerősítéssel
- [ ] Piszkozat / publikált állapot
- [ ] Verziók
- [ ] Visszaállítás korábbi verzióra
- [ ] Oldal sablonból létrehozása
- [ ] Oldal sorrend / navigációs sorrend
- [ ] 404 oldal kezelése

## 6. Mentés, verziózás és biztonságos szerkesztés

- [x] Mentés D1-be
- [x] Mentett állapot visszatöltése
- [x] Refresh után állapot megmarad
- [ ] Autosave opcionálisan
- [ ] Dirty state jelzés
- [ ] Mentés előtti változásjelzés
- [ ] Mentési hiba egyértelmű UI-ja
- [ ] Optimistic update helyett kontrollált szerver-visszaigazolás
- [ ] Revision ID / verziószám
- [ ] Ütközésvédelem
- [ ] Undo
- [ ] Redo
- [ ] Változástörténet
- [ ] Módosítás előtti/utáni diff
- [ ] Visszaállítás
- [ ] Audit log

## 7. Preview / Publish

- [x] Preview PC
- [x] Preview Mobile
- [x] Preview mentett D1 állapotból
- [x] Publikus oldal renderer támogatja az editor dokumentumot
- [ ] Preview tablet
- [ ] Preview link / megosztható preview
- [ ] Preview-ban nem publikált változás elkülönítése
- [ ] Publish
- [ ] Publish visszaigazolás
- [ ] Publikált verzió azonosítása
- [ ] Unpublish / visszavonás
- [ ] Republish
- [ ] Cache invalidation publish után

## 8. Komponens- és sablonrendszer

- [ ] Újrafelhasználható komponensek
- [ ] Globális komponens
- [ ] Lokális komponens
- [ ] Component instance / shared component
- [ ] Template library
- [ ] Oldalsablonok
- [ ] Szakaszsablonok
- [ ] Gombsablonok
- [ ] Kártyasablonok
- [ ] Mentés saját sablonként
- [ ] Sablon verziózás
- [ ] Design tokenek
- [ ] Globális header/footer/menu komponens
- [ ] Globális Twitch Live indicator

## 9. Szerkesztő UX

- [ ] Bal oldali elemkönyvtár
- [ ] Középső canvas
- [ ] Jobb oldali inspector
- [ ] Reszponzív canvas zoom
- [ ] Zoom in/out
- [ ] 100% / fit-to-screen
- [ ] Rács kapcsoló
- [ ] Segédvonalak
- [ ] Keyboard shortcuts
- [ ] Kontextusmenü
- [ ] Breadcrumb / szülő elem navigáció
- [ ] Keresés az elemek között
- [ ] Layer tree
- [ ] Elem név átírása
- [ ] Elem státuszok és hibajelzések
- [ ] Accessibility ellenőrző jelzések

## 10. Tartalmi / üzleti modulok

- [ ] Twitch oldal
- [ ] TikTok oldal
- [ ] YouTube oldal
- [ ] Schedule / menetrend
- [ ] VOD
- [ ] About
- [ ] Contact
- [ ] Community / Discord
- [ ] Support / támogatás
- [ ] Játékkártyák
- [ ] Játéklista
- [ ] Stream naptár
- [ ] Social linkek
- [ ] Követő / feliratkozó statisztikák
- [ ] Élő adás állapot
- [ ] Következő adás visszaszámláló

## 11. Integrációk

- [ ] Twitch API service
- [ ] YouTube API service
- [ ] TikTok integráció
- [ ] Discord integráció szükség szerint
- [ ] OAuth kezelése
- [ ] Token frissítés
- [ ] Integráció állapotjelző
- [ ] Hibás integráció izolálása
- [ ] API rate limit kezelés
- [ ] Normalizált belső adatmodell

## 12. Média / R2

- [ ] R2 binding
- [ ] Média feltöltés
- [ ] Média metaadat D1-ben
- [ ] Képméretezés / optimalizálás
- [ ] MIME/type ellenőrzés
- [ ] Fájlnév biztonság
- [ ] Méretkorlát
- [ ] Média törlés / archiválás
- [ ] Thumbnail kezelés
- [ ] Későbbi short/clip média támogatás

## 13. SEO

- [ ] Title
- [ ] Description
- [ ] Canonical
- [ ] Open Graph
- [ ] Twitter/X card
- [ ] Robots
- [ ] Sitemap
- [ ] Structured data
- [ ] SEO preview az editorban
- [ ] Oldalankénti SEO beállítás

## 14. Analytics

- [ ] Minimális saját eseményrendszer
- [ ] Oldalmegtekintés
- [ ] Gombkattintás
- [ ] Linkkattintás
- [ ] Stream események
- [ ] Admin dashboard statisztikák
- [ ] Privacy-aware mérés
- [ ] Adatmegőrzési szabály

## 15. Auth / security

- [ ] Szerveroldali auth teljesen működőképes
- [ ] HttpOnly cookie
- [ ] Secure cookie
- [ ] SameSite
- [ ] Password hash
- [ ] CSRF védelem
- [ ] Rate limiting
- [ ] RBAC
- [ ] Admin API védelem
- [ ] Public API és admin API szétválasztás
- [ ] Input validation
- [ ] Output validation ahol indokolt
- [ ] Audit log
- [ ] Secret-ek csak Cloudflare Secretben
- [ ] D1/R2/KV közvetlen frontend hozzáférés tiltva

## 16. AI-ready architektúra

**Az AI-t nem most építjük bele mindenhová, de az architektúra már most úgy készül, hogy később ne kelljen újratervezni.**

- [ ] AI service réteg
- [ ] Tool registry
- [ ] Tool permission rendszer
- [ ] Read-only AI mód
- [ ] Javaslat mód
- [ ] Jóváhagyás után végrehajtó mód
- [ ] Audit minden AI műveletről
- [ ] AI csak engedélyezett service/API-n keresztül módosíthat
- [ ] Oldal szerkesztése AI segítségével
- [ ] Sanci Button módosítása AI segítségével
- [ ] Schedule módosítás AI segítségével
- [ ] Social tartalom előkészítés
- [ ] SEO javaslat
- [ ] Tartalomminőség ellenőrzés

## 17. Jövőbeli Stream Assistant — külön nagy modul

- [ ] OBS kapcsolat
- [ ] Stream állapot figyelése
- [ ] Hangszint / csend figyelése
- [ ] Túl hosszú csend jelzése
- [ ] Beszédaktivitás elemzése
- [ ] Chat aktivitás elemzése
- [ ] Ötletjavaslat adás közben
- [ ] Stream események felismerése
- [ ] Jó pillanat jelölése
- [ ] Gombnyomásra clip/short készítése
- [ ] Automatikus clip javaslat
- [ ] Clip mentése
- [ ] Short előkészítése
- [ ] OBS scene ellenőrzés
- [ ] Mikrofon / audio állapot ellenőrzés
- [ ] Stream beállítás tesztelés segítése
- [ ] Technikai hiba jelzése
- [ ] Stream utáni összefoglaló
- [ ] VOD elemzés
- [ ] Legjobb pillanatok kiválasztása
- [ ] Tartalomötletek generálása a tényleges adás alapján

## 18. Publikus design és UX

- [ ] Egységes közös header
- [ ] Egységes menü
- [ ] Desktop menü a kívánt mobilos gömb/lenyíló logika szerint
- [ ] Twitch Live indicator egységesen
- [ ] Közös design tokenek
- [ ] Desktop kártyaméretek egységesítése
- [ ] Schedule design véglegesítése
- [ ] Support design véglegesítése
- [ ] Community design véglegesítése
- [ ] Twitch/TikTok/YouTube oldalak véglegesítése
- [ ] Mobil regressziómentes maradjon minden desktop módosításnál
- [ ] Külföldi streamer oldalakból szerzett jó UX minták beépítése, klónozás nélkül

## 19. Hibakezelés és edge case-ek

- [ ] Hibás page ID
- [ ] Nem létező oldal
- [ ] Üres dokumentum
- [ ] Hibás JSON / sérült dokumentum
- [ ] Mentési API hiba
- [ ] D1 hiba
- [ ] R2 hiba
- [ ] Integrációs API hiba
- [ ] Jogosulatlan admin kérés
- [ ] Session lejárat
- [ ] Hálózati megszakadás szerkesztés közben
- [ ] Dupla mentés
- [ ] Versenyhelyzet / stale revision
- [ ] Nagy dokumentum kezelése
- [ ] Ismeretlen / régi editor elem biztonságos kezelése

## 20. Végső integrációs teszt

- [ ] Login → Admin → Editor
- [ ] Új oldal → elem hozzáadás → szerkesztés
- [ ] Mentés → D1 → refresh
- [ ] Preview PC → Preview Mobile → Preview Tablet
- [ ] Publish → publikus oldal
- [ ] Republish → publikus frissítés
- [ ] Közös komponens módosítása → minden használati hely ellenőrzése
- [ ] Sanci Button módosítása → minden használati hely ellenőrzése
- [ ] Social integrációk
- [ ] Schedule
- [ ] Média
- [ ] SEO
- [ ] Analytics
- [ ] Security
- [ ] Mobil + desktop regresszióteszt

## 21. Fejlesztési szabály az új ötletekre

Ha új igény merül fel:

1. először bekerül ebbe a tervbe,
2. meghatározzuk, melyik modulhoz tartozik,
3. eldöntjük, hogy D1/R2/KV/API/frontend közül hol legyen az igazságforrás,
4. ellenőrizzük, hogy nem okoz-e későbbi újratervezést,
5. csak ezután kezdjük a kódolást,
6. egyetlen teszttel haladunk,
7. siker esetén `[x]`, sikertelenségnél vissza `[~]` és javítás.

## 22. Állapotjelölések

- `[x]` Kész és a felhasználó által ellenőrizve.
- `[~]` Részben kész / további ellenőrzés kell.
- `[ ]` Nincs kész.
- `[!]` Ismert probléma / blokkoló.

**Utolsó frissítés:** 2026-09-12
