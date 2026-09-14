# Sanci9517 V2 — Élő fejlesztési terv

> Ez az egyetlen aktuális ellenőrző lista. A tervet minden sikeres felhasználói teszt után frissítjük.
>
> **Munkaszabály:** egyszerre egy teszt. Csak felhasználó által megerősített siker után kerül `[x]` állapotba és lépünk tovább. Hiba esetén `[~]`, javítás és újrateszt következik.

## 0. Projektállapot

- [x] GitHub repository: `sanci9517/sanci9517`
- [x] Aktív branch: `v2/foundation`
- [x] Cloudflare Worker: `sanci9517-streamer-brand`
- [x] D1 alap létrehozva
- [x] GitHub → Cloudflare build/deploy kapcsolat működik
- [x] Moduláris fájlstruktúra alapja megvan
- [x] Szerveroldali tartalomlánc / D1 irány kijelölve

## 1. Fejlesztési és tesztelési szabályok

- [x] Lépésenkénti fejlesztés
- [x] Minden változás után ellenőrzés
- [x] Sikertelen tesztnél nincs továbblépés
- [x] Érdemi változtatás után Git commit
- [x] Érintett változás után Cloudflare deploy ellenőrzés
- [ ] Végleges automatikus unit/integration/smoke tesztcsomag
- [ ] Külön hiba- és regressziónapló
- [x] Minden sikeres teszt után ez a terv frissül

## 2. Visual Editor — már elkészült és felhasználó által ellenőrzött

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

- [ ] Lock / unlock
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
- [ ] Flex row / column beállítások
- [ ] Grid beállítások
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

## 4. Szöveg

- [x] Alap H1 szövegszerkesztés
- [x] Alap bekezdésszerkesztés
- [ ] H1–H6 elemválasztás teljes körűen
- [ ] Link
- [ ] Lista / számozott lista
- [ ] Idézet
- [ ] Félkövér / dőlt / aláhúzás
- [ ] Betűtípus
- [ ] Betűméret
- [ ] Betűvastagság
- [ ] Sorköz
- [ ] Betűköz
- [ ] Szöveg igazítása
- [ ] Szövegszín
- [ ] Háttérszín
- [ ] Link állapotok

## 5. Képek és média

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
- [ ] AI által engedélyezett módosítás később
- [ ] Jelenlegi kiválasztott ikonok referencia szerinti pontos visszaállítása

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

## 10. Mentés, verziózás, szerkesztési biztonság

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
- [ ] Mobil + desktop regresszióteszt

## 25. Új ötlet / új igény szabálya

1. Először bekerül ebbe a tervbe.
2. Meghatározzuk a modult.
3. Meghatározzuk, hogy D1/R2/KV/API/frontend közül hol az igazságforrás.
4. Ellenőrizzük, hogy nem okoz-e későbbi újratervezést.
5. Csak ezután kezdődik a kódolás.
6. Egyszerre egy tesztet végzünk.
7. Siker esetén `[x]`, hibánál `[~]` és javítás/újrateszt.

## 26. Állapotjelölések

- `[x]` Kész és a felhasználó által ellenőrizve.
- `[~]` Részben kész / további ellenőrzés kell.
- `[ ]` Nincs kész.
- `[!]` Ismert probléma / blokkoló.

### Legutóbbi ellenőrzött állapot — 2026-09-14

- [x] X/Y pozíció tesztelve
- [x] Elemátfedés tesztelve
- [x] Réteg sorrend / előre-hátra gomb tesztelve
- [ ] Következő teszt: Lock / unlock

**Utolsó frissítés:** 2026-09-14