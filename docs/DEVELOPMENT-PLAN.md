# Sanci9517 V2 — Élő fejlesztési terv

> Ez a dokumentum a projekt egyetlen aktuális fejlesztési és tesztelési igazságforrása.
>
> **Munkaszabály:** egyszerre egy konkrét teszt. Csak a felhasználó által megerősített siker kerül `[x]` állapotba. Hiba esetén `[~]`, javítás, majd ugyanannak a tesztnek az újratesztelése következik. A tervet minden sikeres teszt után azonnal frissítjük.

## 0. Projekt és architektúra alapállapot

- [x] GitHub repository: `sanci9517/sanci9517`
- [x] Aktív branch: `v2/foundation`
- [x] Cloudflare Worker: `sanci9517-streamer-brand`
- [x] D1 adatbázis létrehozva
- [x] GitHub → Cloudflare build/deploy kapcsolat működik
- [x] Moduláris fájlstruktúra alapja megvan
- [x] Szerveroldali tartalomlánc / D1 irány kijelölve
- [x] GitHub a forráskód, migrációk és konfiguráció forrása
- [x] Worker a web/API belépési pont
- [x] D1 strukturált tartalom és beállítások tárolója
- [ ] R2 média tároló teljes bekötése
- [ ] KV cache használata, ahol indokolt
- [ ] Cloudflare Secrets véglegesítése minden érzékeny kulcshoz
- [x] Frontend nem kap közvetlen D1/R2/KV hozzáférést
- [ ] Admin műveletek teljes API-alapú védelme

## 1. Kötelező fejlesztési és tesztelési folyamat

- [x] Lépésenkénti fejlesztés
- [x] Minden változás után ellenőrzés
- [x] Sikertelen tesztnél nincs továbblépés
- [x] Érdemi változtatás után Git commit
- [x] Érintett változás után Cloudflare deploy ellenőrzés
- [x] Minden sikeres felhasználói teszt után tervfrissítés
- [x] A terv nem jelöl késznek olyan pontot, amit a felhasználó nem ellenőrzött
- [ ] Végleges automatikus unit tesztcsomag
- [ ] Végleges integration tesztcsomag
- [ ] Végleges smoke tesztcsomag
- [ ] Külön hiba- és regressziónapló
- [ ] Végső teljes regressziós teszt

### Tesztállapotok

- `[x]` Kész és felhasználó által ellenőrizve
- `[~]` Részben kész / hibás / újrateszt szükséges
- `[ ]` Még nincs kész vagy nincs ellenőrizve
- `[!]` Ismert blokkoló probléma

## 2. Visual Editor — elkészült és felhasználó által ellenőrzött

- [x] Editor megnyitása
- [x] Elem kiválasztása
- [x] H1 szöveg módosítása
- [x] Bekezdés módosítása
- [x] Gomb módosítása
- [x] X / Y pozíció módosítása
- [x] Elem szélesség / magasság módosítása
- [x] Több elem együttes kezelése
- [x] Elem törlése
- [x] Elem duplikálása
- [x] Több elem kijelölése
- [x] Csoportosítás / csoport feloldása
- [x] Drag & drop pozicionálás
- [x] Snap / segédvonalak
- [x] Átfedő elemek kezelése
- [x] Réteg sorrend / előre-hátra kezelés
- [x] Lock / unlock tesztelve
- [x] Mentés D1-be
- [x] Mentett állapot visszaolvasása
- [x] Teljes böngészőfrissítés után állapot megmarad
- [x] Új oldal létrehozása
- [x] Új oldal mentése és visszatöltése
- [x] Új oldal tartalma Preview-ban megjelenik
- [x] Új elem a valódi publikus oldalon megjelenik
- [x] Border preset
- [x] Új/publikált oldal alap mobil egyoszlopos elrendezése
- [x] Preview PC/Mobile váltás
- [x] Preview Mobile javítása és felhasználói ellenőrzése
- [x] Canvas középre igazítása
- [x] Panelvezérlők nem takarják a szöveget
- [x] Bal/jobb panel összecsukása és visszanyitása
- [x] Egy elem és csoport inspector elkülönítése
- [x] Csoport tulajdonságainak egységes alkalmazása
- [x] Vizuális színválasztó csoporttulajdonságokhoz
- [x] Layer tree
- [x] Canvas zoom
- [x] Zoom in/out
- [x] 100% / fit-to-screen
- [x] Rács kapcsoló
- [x] Segédvonalak

## 3. Visual Editor — elemkezelés, hátralévő

### 3.1 Alap elemkezelés

- [ ] Hide / show
- [ ] Igazítás: bal / közép / jobb / felső / közép / alsó
- [ ] Egyenletes elosztás
- [ ] Másolás / beillesztés
- [ ] Stílus másolása / beillesztése
- [ ] Tömeges törlés megerősítéssel
- [ ] Elem átnevezése
- [ ] Elem státuszának jelzése
- [ ] Ismeretlen / régi elem biztonságos kezelése

### 3.2 Layout

- [x] X / Y
- [x] Width / height
- [ ] Min/max width
- [ ] Min/max height
- [ ] Padding
- [ ] Margin
- [ ] Gap
- [ ] Display
- [ ] Position
- [ ] Z-index külön inspector-beállításként
- [ ] Overflow
- [ ] Flex row / column
- [ ] Grid
- [ ] Container max-width
- [ ] Egységes spacing rendszer
- [ ] Design token alapú spacing

### 3.3 Megjelenés

- [ ] Háttérszín
- [ ] Háttérkép
- [ ] Gradient
- [ ] Szövegszín
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

## 4. Szövegkezelés

- [x] Alap H1 szerkesztés
- [x] Alap bekezdés szerkesztés
- [ ] H1–H6 teljes körű támogatás
- [ ] Link beszúrás/szerkesztés
- [ ] Lista / számozott lista
- [ ] Idézet
- [ ] Félkövér / dőlt / aláhúzás
- [ ] Betűtípus
- [ ] Betűméret
- [ ] Betűvastagság
- [ ] Sorköz
- [ ] Betűköz
- [ ] Szövegigazítás
- [ ] Szövegszín
- [ ] Szöveg háttérszín
- [ ] Link állapotok

## 5. Képek és média az editorban

- [ ] Kép beszúrása
- [ ] Kép feltöltése R2-be
- [ ] Kép cseréje
- [ ] Crop / object-fit
- [ ] Kép pozicionálása
- [ ] Alt szöveg
- [ ] Kép linkelése
- [ ] Videó elem
- [ ] Videó bélyegkép
- [ ] Audio elem
- [ ] Média könyvtár
- [ ] Média törlése / archiválása
- [ ] Méret- és formátumkorlátok
- [ ] MIME ellenőrzés
- [ ] Biztonságos fájlnév
- [ ] Thumbnail kezelés

## 6. Sanci Buttons

- [ ] Központi Sanci Button registry
- [ ] Stabil button ID
- [ ] Megjelenítési név szerkesztése
- [ ] Leírás szerkesztése
- [ ] Ikon stabil ID alapján
- [ ] Külön ikonkönyvtár
- [ ] Ikon csere adminból
- [ ] Link / action szerkesztése
- [ ] Külső link / belső oldal
- [ ] Láthatóság kapcsolása
- [ ] Sorrend kezelése
- [ ] Duplikálás
- [ ] Új button típus később
- [ ] Több oldalon újrahasznosítás
- [ ] Kontrollált globális frissítés
- [ ] Oldalszintű felülírás szükség esetén
- [ ] Normál / hover / aktív / tiltott állapot
- [ ] Ikon + szöveg / csak ikon / csak szöveg
- [ ] Jelenlegi kiválasztott ikonok referencia szerinti pontos visszaállítása
- [ ] AI által engedélyezett button-módosítás később

## 7. Alakzatok és konténerek

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

## 8. Responsive rendszer

- [x] Desktop alap működés
- [x] Mobile alap működés
- [x] Preview PC/Mobile
- [x] Preview Mobile stacking
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
- [ ] Tablet Preview
- [ ] Desktop/mobile regresszióteszt minden reszponzív módosítás után

## 9. Oldalkezelés

- [x] Új oldal létrehozása
- [x] Oldal tartalmának mentése
- [x] Oldal átnevezése
- [ ] Biztonságos slug szerkesztés
- [ ] Oldal klónozása
- [ ] Oldal törlése
- [ ] Törlés megerősítése
- [ ] Piszkozat / publikált állapot
- [ ] Verziók
- [ ] Korábbi verzió visszaállítása
- [ ] Oldal sablonból létrehozása
- [ ] Navigációs sorrend
- [ ] 404 oldal

> **Megjegyzés:** az oldal törlése jelenleg nincs kész. Nem tekintjük elkészültnek addig, amíg külön funkcióként nincs megvalósítva és tesztelve.

## 10. Mentés, verziózás és szerkesztési biztonság

- [x] Mentés D1-be
- [x] Mentett állapot visszatöltése
- [x] Refresh utáni perzisztencia
- [ ] Autosave
- [ ] Dirty state
- [ ] Nem mentett változás jelzése
- [ ] Egyértelmű mentési hiba UI
- [ ] Kontrollált szerver-visszaigazolás
- [ ] Revision ID / verziószám
- [ ] Ütközésvédelem
- [ ] Undo
- [ ] Redo
- [ ] Változástörténet
- [ ] Előtte/utána diff
- [ ] Restore
- [ ] Audit log
- [ ] Dupla mentés kezelése
- [ ] Hálózati megszakadás kezelése
- [ ] Backup készítés
- [ ] Backup visszaállítás
- [ ] Biztonságos mentési pontok / restore pontok

## 11. Preview / Publish

- [x] Preview PC
- [x] Preview Mobile
- [x] Preview mentett D1 állapotból
- [x] Publikus renderer támogatja az editor dokumentumot
- [ ] Preview Tablet
- [ ] Megosztható preview link
- [ ] Nem publikált változás egyértelmű jelzése
- [ ] Publish
- [ ] Publish visszaigazolás
- [ ] Publikált verzió azonosítása
- [ ] Unpublish
- [ ] Republish
- [ ] Cache invalidation publish után
- [ ] Publish utáni publikus oldal ellenőrzése

## 12. Komponens- és sablonrendszer

- [ ] Újrafelhasználható komponensek
- [ ] Globális komponens
- [ ] Lokális komponens
- [ ] Shared component instance
- [ ] Template library
- [ ] Oldalsablonok
- [ ] Szakaszsablonok
- [ ] Gombsablonok
- [ ] Kártyasablonok
- [ ] Saját sablon mentése
- [ ] Sablon verziózás
- [ ] Design tokenek
- [ ] Globális header/footer/menu
- [ ] Globális Twitch Live indicator

## 13. Editor UX

- [ ] Bal oldali elemkönyvtár véglegesítése
- [x] Középső canvas
- [x] Jobb oldali inspector
- [x] Reszponzív canvas zoom
- [x] Zoom in/out
- [x] 100% / fit-to-screen
- [x] Rács
- [x] Segédvonalak
- [ ] Keyboard shortcuts
- [ ] Kontextusmenü
- [ ] Breadcrumb / szülő elem navigáció
- [ ] Elemkeresés
- [x] Layer tree
- [ ] Elemnév átírása
- [ ] Elem státusz / hibajelzés
- [ ] Accessibility figyelmeztetések
- [x] Bal/jobb panel collapse
- [x] Elem- és csoport-inspector elkülönítés
- [x] Csoporttulajdonságok egységes alkalmazása
- [x] Vizuális színválasztó
- [x] Canvas középre igazítás
- [x] Panelvezérlők nem takarnak szöveget

## 14. Tartalmi / üzleti modulok

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
- [ ] Dinamikus adatok automatikus frissítése

## 15. Integrációk

- [ ] Twitch API service
- [ ] YouTube API service
- [ ] TikTok integráció
- [ ] Discord integráció szükség szerint
- [ ] OAuth
- [ ] Token frissítés
- [ ] Integráció állapotjelző
- [ ] Hibás integráció izolálása
- [ ] API rate limit kezelés
- [ ] Normalizált belső adatmodell
- [ ] Integrációs adatok szerveroldali tárolása
- [ ] Titkok és tokenek GitHubból kizárva

## 16. Média / R2

- [ ] R2 binding
- [ ] Média feltöltés
- [ ] Média metaadat D1-ben
- [ ] Képméretezés / optimalizálás
- [ ] MIME/type ellenőrzés
- [ ] Fájlnév biztonság
- [ ] Méretkorlát
- [ ] Média törlés / archiválás
- [ ] Thumbnail
- [ ] Későbbi short/clip média támogatás

## 17. SEO

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

## 18. Analytics

- [ ] Saját eseményrendszer
- [ ] Oldalmegtekintés
- [ ] Gombkattintás
- [ ] Linkkattintás
- [ ] Stream események
- [ ] Admin dashboard statisztikák
- [ ] Privacy-aware mérés
- [ ] Adatmegőrzési szabály

## 19. Auth / security

- [ ] Szerveroldali auth teljesen működőképes
- [ ] HttpOnly cookie
- [ ] Secure cookie
- [ ] SameSite
- [ ] Biztonságos password hash
- [ ] CSRF védelem
- [ ] Rate limiting
- [ ] RBAC
- [ ] Admin API védelem
- [ ] Public/admin API szétválasztás
- [ ] Input validation
- [ ] Output validation ahol indokolt
- [ ] Audit log
- [ ] Secret-ek csak Cloudflare Secretben
- [ ] D1/R2/KV közvetlen frontend hozzáférés tiltva
- [ ] Session lejárat kezelése
- [ ] Jogosulatlan kérés megfelelő hibakezelése

## 20. AI-ready architektúra

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

## 21. Jövőbeli Stream Assistant

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
- [ ] Tartalomötletek a tényleges adás alapján

## 22. Publikus design és UX

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
- [ ] Mobil regressziómentesség desktop módosítások után
- [ ] Jó külföldi streamer UX minták felhasználása klónozás nélkül
- [ ] Publikus oldalon ne maradjon fejlesztői/technikai szöveg
- [ ] Publikus szövegek magyarul
- [ ] Homepage alapstruktúrája egyelőre változatlan marad
- [ ] Részletes tartalom külön oldalakon

## 23. Hibakezelés és edge case-ek

- [ ] Hibás page ID
- [ ] Nem létező oldal
- [ ] Üres dokumentum
- [ ] Hibás/sérült JSON
- [ ] Mentési API hiba
- [ ] D1 hiba
- [ ] R2 hiba
- [ ] Integrációs API hiba
- [ ] Jogosulatlan admin kérés
- [ ] Session lejárat
- [ ] Hálózati megszakadás szerkesztés közben
- [ ] Dupla mentés
- [ ] Stale revision / versenyhelyzet
- [ ] Nagy dokumentum kezelése
- [ ] Ismeretlen/örökölt elem biztonságos kezelése
- [ ] Hibás médiafájl
- [ ] Túl nagy médiafájl
- [ ] Hibás külső link / API válasz

## 24. Végső integrációs teszt

- [ ] Login → Admin → Editor
- [ ] Új oldal → elem hozzáadás → szerkesztés
- [ ] Mentés → D1 → refresh
- [ ] Preview PC → Mobile → Tablet
- [ ] Publish → publikus oldal
- [ ] Republish → publikus frissítés
- [ ] Közös komponens módosítása → minden használati hely
- [ ] Sanci Button módosítása → minden használati hely
- [ ] Social integrációk
- [ ] Schedule
- [ ] Média
- [ ] SEO
- [ ] Analytics
- [ ] Security
- [ ] Backup / restore
- [ ] Mobil + desktop regresszióteszt
- [ ] Cloudflare production smoke test

## 25. Új igény / új funkció szabálya

1. Az új igény először bekerül ebbe a tervbe.
2. Meghatározzuk a modult és a függőségeket.
3. Meghatározzuk az igazságforrást: D1 / R2 / KV / API / frontend.
4. Ellenőrizzük a szerveroldali és biztonsági hatást.
5. Ellenőrizzük, hogy okoz-e későbbi újratervezést.
6. Csak ezután kezdődik a kódolás.
7. A funkció elkészülte után külön teszt következik.
8. Siker esetén `[x]`, hiba esetén `[~]`, javítás és ugyanazon teszt újrafuttatása.
9. Sikeres teszt után azonnal frissítjük ezt a tervet.

## 26. Jelenlegi tényleges tesztállapot

### Felhasználó által ellenőrzött Visual Editor funkciók

- [x] X / Y pozíció
- [x] Elemátfedés
- [x] Réteg sorrend / előre-hátra gomb
- [x] Lock / unlock

### Következő egyetlen teszt

- [ ] **Hide / show**

**Tesztmenet:** válassz ki egy elemet → Hide → ellenőrizd, hogy eltűnik és nem jelenik meg a publikált/preview renderben ott, ahol rejtettnek kell lennie → Show → ellenőrizd, hogy újra látható.

> Más tesztet addig nem indítunk, amíg ezt a tesztet a felhasználó nem minősíti sikeresnek vagy hibásnak.

**Utolsó tervfrissítés:** 2026-09-14
