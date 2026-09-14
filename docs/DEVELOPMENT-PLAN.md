# Sanci9517 V2 — VÉGLEGES FEJLESZTÉSI ÉS TESZTELÉSI TERV

> **Ez a projekt egyetlen aktuális fejlesztési forrása.** Innen folytatjuk minden új beszélgetésben is.
>
> A cél nem egy egyszerű streamer bemutatkozó oldal, hanem egy hosszú távon bővíthető **streamer platform + vizuális CMS + admin rendszer + közösségi/üzleti központ + későbbi AI Stream Assistant**.
>
> A tervet szándékosan túlméreteztük: inkább legyen előre megtervezve egy funkció, mint hogy később az architektúrát újra kelljen építeni.

---

## 0. Végső cél — milyen rendszert építünk?

### 0.1 A publikus weboldal

A Sanci9517 oldal legyen:

- [ ] modern, prémium streamer/creator weboldal
- [ ] mobilon, tableten és asztali gépen is teljes értékű
- [ ] gyors és SEO-barát
- [ ] egységes vizuális rendszerrel működő
- [ ] minden fontos tartalom külön oldalon kezelhető
- [ ] Twitch, TikTok, YouTube és további platformok köré építhető
- [ ] közösségépítő, nem csak névjegykártya
- [ ] később szponzorok és üzleti partnerek számára is professzionális
- [ ] merch/donation/support lehetőségekre előkészített
- [ ] dinamikus, szerveroldali adatokból működő
- [ ] AI-val később módosítható és elemezhető
- [ ] technikai/admin szövegektől mentes a látogatók számára

### 0.2 A teljes rendszer

- [ ] Public frontend
- [ ] Admin felület
- [ ] Visual Editor / Page Builder
- [ ] Server API
- [ ] D1 tartalom- és konfigurációs adatbázis
- [ ] R2 média tárhely
- [ ] KV gyorsítótár, ahol indokolt
- [ ] Auth + RBAC
- [ ] Audit log
- [ ] Verziózás + rollback
- [ ] Backup + restore
- [ ] Integrációs réteg
- [ ] Analytics
- [ ] SEO rendszer
- [ ] AI service layer
- [ ] későbbi Stream Assistant

### 0.3 Aranyszabály

**Semmilyen későbbi funkció miatt ne kelljen az alap architektúrát újratervezni.**

Új funkció előtt mindig eldöntjük:

1. melyik modulhoz tartozik,
2. mi az igazságforrás,
3. D1/R2/KV/API/frontend közül hol tároljuk,
4. milyen jogosultság kell,
5. milyen audit szükséges,
6. hogyan teszteljük,
7. hogyan lehet később visszavonni vagy helyreállítani.

---

## 1. Projekt alapállapot

- [x] GitHub repository: `sanci9517/sanci9517`
- [x] Aktív fejlesztési branch: `v2/foundation`
- [x] Cloudflare Worker: `sanci9517-streamer-brand`
- [x] D1 alap létrehozva
- [x] GitHub → Cloudflare build/deploy kapcsolat működik
- [x] Moduláris fájlstruktúra alapja megvan
- [x] Szerveroldali tartalomlánc / D1 irány kijelölve
- [ ] Végleges automatikus tesztcsomag
- [ ] Végleges hiba- és regressziónapló

---

## 2. Fejlesztési szabályok — mindig így dolgozunk

- [x] Lépésenkénti fejlesztés
- [x] Egy teszt egyszerre
- [x] Minden változás után ellenőrzés
- [x] Sikertelen tesztnél nincs továbblépés
- [x] Siker esetén `[x]`
- [x] Sikertelen/részleges állapot esetén `[~]`
- [x] Blokkoló hibánál `[!]`
- [x] Érdemi változás után Git commit
- [x] Érintett változás után Cloudflare deploy ellenőrzés
- [x] Minden sikeres teszt után a terv frissítése
- [ ] Automatikus unit tesztek
- [ ] Integration tesztek
- [ ] E2E/smoke tesztek
- [ ] Regressziós tesztcsomag

### 2.1 Teszt Definition of Done

Egy funkció csak akkor `[x]`, ha:

- működik,
- a felhasználó ellenőrizte,
- mentés/persistencia esetén az adat megmarad,
- érintett backend esetén szerveroldalon is ellenőrizve van,
- érintett publikus oldalon megjelenik,
- hibás esetben nem omlik össze,
- mobil/desktop viselkedés ellenőrizve, ha releváns,
- a tervben kipipáltuk.

---

# 3. VISUAL EDITOR / PAGE BUILDER

## 3.1 Alap editor

- [x] Editor megnyitása
- [x] Elem kiválasztása
- [x] H1 szerkesztése
- [x] Bekezdés szerkesztése
- [x] Gomb szerkesztése
- [x] X/Y pozíció
- [x] Width/height
- [x] Több elem kezelése
- [x] Elem törlése
- [x] Elem duplikálása
- [x] Többes kijelölés
- [x] Csoportosítás
- [x] Csoport feloldása
- [x] Drag & drop
- [x] Snap/segédvonalak
- [x] Átfedés kezelése
- [x] Réteg sorrend / előre-hátra
- [x] Lock/unlock
- [ ] Hide/show
- [ ] Elem átnevezése
- [ ] Elem státuszjelzése
- [ ] Ismeretlen/legacy elem biztonságos megjelenítése
- [ ] Elem keresése
- [ ] Elem gyors duplikálása
- [ ] Másolás/beillesztés
- [ ] Stílus másolása/beillesztése
- [ ] Tömeges törlés megerősítése
- [ ] Undo
- [ ] Redo
- [ ] History

## 3.2 Layout / CSS-szerű vezérlés

- [x] X/Y
- [x] Width/height
- [ ] Min/max width
- [ ] Min/max height
- [ ] Padding
- [ ] Margin
- [ ] Gap
- [ ] Display
- [ ] Position
- [ ] Z-index külön vezérlése
- [ ] Overflow
- [ ] Flex row
- [ ] Flex column
- [ ] Flex wrap
- [ ] Justify
- [ ] Align
- [ ] Grid
- [ ] Grid columns
- [ ] Grid rows
- [ ] Grid gap
- [ ] Container max-width
- [ ] Container alignment
- [ ] Spacing scale
- [ ] Design-token alapú spacing
- [ ] Absolute/fixed/sticky positioning
- [ ] Aspect ratio
- [ ] Auto sizing
- [ ] Intrinsic sizing

## 3.3 Megjelenés

- [x] Border preset
- [ ] Background color
- [ ] Background image
- [ ] Background video
- [ ] Gradient
- [ ] Text color
- [ ] Border width
- [ ] Border style
- [ ] Border color
- [ ] Border radius
- [ ] Shadow
- [ ] Opacity
- [ ] Transform
- [ ] Rotation
- [ ] Scale
- [ ] Transition
- [ ] Hover
- [ ] Focus
- [ ] Active
- [ ] Disabled
- [ ] Theme token
- [ ] Központi színpaletta
- [ ] Központi tipográfia
- [ ] CSS custom properties / design tokens

## 3.4 Igazítás és elrendezés

- [ ] Balra igazítás
- [ ] Középre igazítás
- [ ] Jobbra igazítás
- [ ] Felső igazítás
- [ ] Vertikális közép
- [ ] Alsó igazítás
- [ ] Egyenletes vízszintes elosztás
- [ ] Egyenletes függőleges elosztás
- [ ] Méretek egyeztetése
- [ ] Pozíciók egyeztetése
- [ ] Smart guides
- [ ] Rácshoz igazítás

## 3.5 Canvas

- [x] Canvas középre igazítás
- [x] Canvas zoom
- [x] Zoom in/out
- [x] 100% / fit-to-screen
- [x] Rács
- [x] Segédvonalak
- [ ] Rácsméret állítás
- [ ] Snap erősség
- [ ] Canvas háttér
- [ ] Safe area
- [ ] Ruler
- [ ] Canvas reset
- [ ] Multi-page canvas navigation

## 3.6 Layer tree

- [x] Layer tree
- [ ] Elem drag-and-drop sorrendezése
- [ ] Elem csoportok vizuális jelzése
- [ ] Lock állapot jelzése
- [ ] Hide állapot jelzése
- [ ] Elem típusának jelzése
- [ ] Elem átnevezése
- [ ] Keresés
- [ ] Szülő/gyermek navigáció

## 3.7 Inspector

- [x] Elem inspector
- [x] Csoport inspector
- [x] Elkülönített csoporttulajdonságok
- [x] Vizuális színválasztó
- [ ] Általános tab
- [ ] Layout tab
- [ ] Appearance tab
- [ ] Typography tab
- [ ] Responsive tab
- [ ] Interaction tab
- [ ] Accessibility tab
- [ ] SEO/content tab
- [ ] Advanced tab
- [ ] CSS/custom code kontrollált módon

---

# 4. SZÖVEGSZERKESZTŐ

- [x] Alap H1 szerkesztés
- [x] Alap paragraph szerkesztés
- [ ] H1-H6
- [ ] Inline text editing
- [ ] Link
- [ ] Külső link
- [ ] Belső oldal link
- [ ] Anchor link
- [ ] Lista
- [ ] Számozott lista
- [ ] Idézet
- [ ] Félkövér
- [ ] Dőlt
- [ ] Aláhúzás
- [ ] Áthúzás
- [ ] Font family
- [ ] Font size
- [ ] Font weight
- [ ] Line height
- [ ] Letter spacing
- [ ] Text alignment
- [ ] Text transform
- [ ] Text color
- [ ] Text background
- [ ] Link normal/hover/active/visited/focus
- [ ] Rich text blocks
- [ ] Emoji/Unicode kezelés
- [ ] Magyar karakterek teljes támogatása

---

# 5. KÉP, VIDEÓ ÉS MÉDIA RENDSZER

- [ ] Kép beszúrás
- [ ] Kép feltöltés R2-be
- [ ] Kép csere
- [ ] Crop
- [ ] Object-fit
- [ ] Object-position
- [ ] Alt text
- [ ] Caption
- [ ] Kép link
- [ ] Videó elem
- [ ] YouTube embed
- [ ] Twitch embed
- [ ] TikTok embed
- [ ] Videó thumbnail
- [ ] Audio
- [ ] Média könyvtár
- [ ] Média keresés
- [ ] Média kategóriák
- [ ] Média törlés/archiválás
- [ ] MIME ellenőrzés
- [ ] Fájlnév biztonság
- [ ] Méretkorlát
- [ ] Képméretezés
- [ ] WebP/AVIF optimalizálás
- [ ] Thumbnail generálás
- [ ] Lazy loading
- [ ] Responsive image
- [ ] Media metadata D1-ben
- [ ] Későbbi clip/short támogatás

---

# 6. KOMPONENS-, SABLON- ÉS DESIGN SYSTEM

- [ ] Reusable component
- [ ] Global component
- [ ] Local component
- [ ] Shared component instance
- [ ] Component properties
- [ ] Component variants
- [ ] Component states
- [ ] Template library
- [ ] Oldal template
- [ ] Section template
- [ ] Card template
- [ ] Button template
- [ ] Saját template mentése
- [ ] Template import/export
- [ ] Template versioning
- [ ] Design tokens
- [ ] Színek tokenizálása
- [ ] Typography tokens
- [ ] Spacing tokens
- [ ] Radius tokens
- [ ] Shadow tokens
- [ ] Breakpoint tokens
- [ ] Global header
- [ ] Global footer
- [ ] Global menu
- [ ] Global Twitch Live indicator
- [ ] Global social buttons
- [ ] Globális frissítés biztonságos előnézettel

---

# 7. SANCi BUTTON / KÖZPONTI GOMBRENDSZER

- [ ] Központi registry
- [ ] Stabil button ID
- [ ] Megjelenítési név
- [ ] Leírás
- [ ] Stabil icon ID
- [ ] Ikonkönyvtár
- [ ] Ikon csere adminból
- [ ] Link/action szerkesztés
- [ ] Belső oldal
- [ ] Külső link
- [ ] Twitch action
- [ ] Discord action
- [ ] Social action
- [ ] Láthatóság
- [ ] Sorrend
- [ ] Duplikálás
- [ ] Több oldalon újrahasznosítás
- [ ] Kontrollált globális frissítés
- [ ] Oldalszintű override
- [ ] Normal
- [ ] Hover
- [ ] Active
- [ ] Disabled
- [ ] Icon + text
- [ ] Icon only
- [ ] Text only
- [ ] Analytics esemény
- [ ] AI módosíthatóság
- [ ] Pontos ikonreferencia-visszaállítás

---

# 8. ELEM- ÉS KONTÉNERKÖNYVTÁR

- [ ] Container
- [ ] Section
- [ ] Card
- [ ] Grid
- [ ] Flex row
- [ ] Flex column
- [ ] Divider
- [ ] Spacer
- [ ] Badge
- [ ] Tag
- [ ] Panel
- [ ] Modal
- [ ] Popup
- [ ] Tabs
- [ ] Accordion
- [ ] Carousel
- [ ] Marquee/ticker indokolt esetben
- [ ] Alert
- [ ] Tooltip
- [ ] Dropdown
- [ ] Breadcrumb
- [ ] Timeline
- [ ] Stats block
- [ ] Countdown block
- [ ] Social grid
- [ ] Video grid
- [ ] VOD grid
- [ ] Schedule block
- [ ] Live block
- [ ] Discord block
- [ ] Merch block
- [ ] Sponsor block
- [ ] Media-kit block
- [ ] Newsletter block

---

# 9. RESPONSIVE RENDSZER

- [x] Desktop alap
- [x] Mobile alap
- [x] PC/Mobile preview
- [x] Mobile stacking
- [x] Új publikus oldalak mobil egyoszlopos alapja
- [ ] Tablet breakpoint
- [ ] Mobil breakpoint
- [ ] Desktop/tablet/mobile értékek elemenként
- [ ] Mobile hide
- [ ] Tablet-only
- [ ] Desktop-only
- [ ] Mobile-only
- [ ] Responsive typography
- [ ] Responsive spacing
- [ ] Responsive image sizing
- [ ] Orientation
- [ ] Tablet Preview
- [ ] Breakpoint preview
- [ ] Responsive visibility
- [ ] Responsive order
- [ ] Responsive grid columns

---

# 10. OLDALKEZELÉS / CMS

- [x] Új oldal létrehozása
- [x] Oldal mentése
- [x] Oldal átnevezése
- [ ] Biztonságos slug szerkesztés
- [ ] Oldal klónozása
- [ ] Oldal törlése
- [ ] Törlés megerősítése
- [ ] Piszkozat
- [ ] Publikált állapot
- [ ] Scheduled publish
- [ ] Verziók
- [ ] Korábbi verzió visszaállítása
- [ ] Oldal sablonból létrehozás
- [ ] Navigációs sorrend
- [ ] Menüstruktúra
- [ ] Aloldalak
- [ ] 404
- [ ] Redirect kezelés
- [ ] Draft preview
- [ ] Preview link
- [ ] Oldal archiválás
- [ ] Oldal export/import
- [ ] Oldal metaadatok

---

# 11. MENTÉS / VERZIÓZÁS / BACKUP / RESTORE

- [x] D1 mentés
- [x] Mentett állapot visszaolvasása
- [x] Refresh utáni perzisztencia
- [ ] Autosave
- [ ] Dirty state
- [ ] Nem mentett változás jelzése
- [ ] Mentési hiba UI
- [ ] Szerver-visszaigazolás
- [ ] Revision ID
- [ ] Optimistic/pessimistic save stratégia
- [ ] Ütközésvédelem
- [ ] Undo
- [ ] Redo
- [ ] Change history
- [ ] Before/after diff
- [ ] Restore
- [ ] Audit log
- [ ] Dupla mentés kezelése
- [ ] Network interruption recovery
- [ ] Automatikus backup
- [ ] Kézi backup
- [ ] Backup verziók
- [ ] Backup listázás
- [ ] Backup restore
- [ ] Restore megerősítés
- [ ] Restore előtti snapshot
- [ ] Biztonsági rollback
- [ ] Adat export
- [ ] Adat import

---

# 12. PREVIEW / PUBLISH / STAGING

- [x] Preview PC
- [x] Preview Mobile
- [x] Preview mentett D1 állapotból
- [x] Publikus renderer editor dokumentummal
- [ ] Preview Tablet
- [ ] Megosztható preview link
- [ ] Nem publikált változás jelzése
- [ ] Draft vs published összehasonlítás
- [ ] Publish
- [ ] Publish confirmation
- [ ] Published version ID
- [ ] Unpublish
- [ ] Republish
- [ ] Cache invalidation
- [ ] Staging környezet
- [ ] Production környezet
- [ ] Publish előtti ellenőrzés
- [ ] Publish rollback
- [ ] Publikálási napló
- [ ] Publikálási jogosultság

---

# 13. EDITOR UX / PROFESSZIONÁLIS FUNKCIÓK

- [x] Középső canvas
- [x] Jobb inspector
- [x] Zoom
- [x] Grid
- [x] Guides
- [x] Layer tree
- [x] Bal/jobb panel collapse
- [ ] Bal oldali element library véglegesítése
- [ ] Keyboard shortcuts
- [ ] Kontextusmenü
- [ ] Breadcrumb
- [ ] Parent navigation
- [ ] Element search
- [ ] Element rename
- [ ] Status/error indicators
- [ ] Accessibility warnings
- [ ] Command palette
- [ ] Quick actions
- [ ] Recent elements
- [ ] Favorites
- [ ] Undo/redo history panel
- [ ] Multi-select toolbar
- [ ] Inspector reset control
- [ ] Copy CSS/style
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Tooltips
- [ ] Empty-state segítség
- [ ] Onboarding
- [ ] Editor autosave indicator
- [ ] Save status indicator
- [ ] Error recovery UI

---

# 14. PUBLIKUS STREAMER OLDAL — KÖTELEZŐ MODULOK

## 14.1 Főoldal

- [ ] Hero
- [ ] Rövid bemutatkozás
- [ ] Live/offline állapot
- [ ] Következő stream
- [ ] Következő stream countdown
- [ ] Twitch CTA
- [ ] TikTok CTA
- [ ] YouTube CTA
- [ ] Discord CTA
- [ ] Legutóbbi VOD/clip
- [ ] Kiemelt tartalom
- [ ] Schedule preview
- [ ] Community CTA
- [ ] Merch CTA, ha később kell
- [ ] Support CTA
- [ ] Sponsor/media kit CTA

## 14.2 Twitch

- [ ] Twitch oldal
- [ ] Élő állapot
- [ ] Stream embed
- [ ] Chat embed, ha indokolt
- [ ] Stream title
- [ ] Game/category
- [ ] Viewer count
- [ ] Stream schedule
- [ ] Latest VOD
- [ ] Latest clips
- [ ] Follow CTA
- [ ] Subscribe CTA

## 14.3 TikTok

- [ ] TikTok oldal
- [ ] Profil link
- [ ] Latest TikTok feed/embed
- [ ] Kiemelt videók
- [ ] Követés CTA
- [ ] TikTok statisztika

## 14.4 YouTube

- [ ] YouTube oldal
- [ ] Latest videos
- [ ] Shorts
- [ ] Playlists
- [ ] Featured video
- [ ] Subscribe CTA
- [ ] YouTube statisztikák

## 14.5 Schedule / menetrend

- [ ] Heti schedule
- [ ] Egyedi stream esemény
- [ ] Ismétlődő esemény
- [ ] Game/category
- [ ] Start/end time
- [ ] Timezone
- [ ] Countdown
- [ ] Következő adás kiemelése
- [ ] Naptár export
- [ ] ICS
- [ ] Google Calendar link
- [ ] Emlékeztető CTA
- [ ] Automatikus platform szinkron később

## 14.6 VOD / Clips / Highlights

- [ ] VOD oldal
- [ ] Clip oldal
- [ ] Highlight oldal
- [ ] Keresés
- [ ] Szűrés játék szerint
- [ ] Szűrés dátum szerint
- [ ] Kategória
- [ ] Kiemelt videó
- [ ] YouTube/Twitch source
- [ ] Rövid klip grid
- [ ] Megosztás

## 14.7 About

- [ ] Bemutatkozás
- [ ] Streamer történet
- [ ] Jelenlegi játékok
- [ ] Setup
- [ ] Statisztikák
- [ ] Célok
- [ ] Brand story
- [ ] GYIK

## 14.8 Community

- [ ] Discord
- [ ] Közösségi szabályok
- [ ] Közösségi események
- [ ] Community posts
- [ ] Polls
- [ ] Kérdések
- [ ] Versenyek
- [ ] Giveaway modul előkészítés
- [ ] Leaderboard előkészítés

## 14.9 Support / támogatás

- [ ] Support oldal
- [ ] Donation link
- [ ] Tip page
- [ ] Support CTA
- [ ] Supporter lista, ha később kell
- [ ] Támogatói üzenet

## 14.10 Contact

- [ ] Általános kapcsolat
- [ ] Üzleti kapcsolat
- [ ] Szponzori kapcsolat
- [ ] Média kapcsolat
- [ ] Spam protection
- [ ] Form validation
- [ ] Rate limit
- [ ] Email routing

## 14.11 Merch / shop

- [ ] Merch oldal
- [ ] Külső shop integráció
- [ ] Termékek megjelenítése
- [ ] Merch CTA
- [ ] Affiliate link támogatás

## 14.12 Media kit / sponsor

- [ ] Media kit
- [ ] Follower stats
- [ ] Average viewers
- [ ] Peak viewers
- [ ] Hours streamed
- [ ] Platform split
- [ ] Audience demographics, ha rendelkezésre áll
- [ ] Top games
- [ ] Past sponsors
- [ ] Brand logos
- [ ] Deliverables
- [ ] Sponsor contact form
- [ ] Letölthető media kit PDF
- [ ] Frissíthető statisztikák

## 14.13 Blog / News / Updates

- [ ] Blog
- [ ] Hírek
- [ ] Stream recap
- [ ] Game guide
- [ ] Community update
- [ ] Tagging
- [ ] Categories
- [ ] Search
- [ ] Related posts
- [ ] Scheduled posts
- [ ] Drafts

---

# 15. KÖZÖSSÉGI ÉS INTERAKTÍV FUNKCIÓK

- [ ] Discord invite
- [ ] Newsletter
- [ ] Email feliratkozás
- [ ] Push notification előkészítés
- [ ] Live notification
- [ ] Stream reminder
- [ ] Poll
- [ ] Voting
- [ ] Giveaway
- [ ] Community leaderboard
- [ ] Viewer profiles későbbi opció
- [ ] Loyalty system későbbi opció
- [ ] Points/economy későbbi opció
- [ ] Quests/challenges későbbi opció
- [ ] Achievements későbbi opció
- [ ] Fan wall későbbi opció
- [ ] Supporter wall későbbi opció
- [ ] Chat/command page
- [ ] Bot commands lista
- [ ] Emote lista
- [ ] Community calendar

---

# 16. STREAMER-RELEVÁNS WIDGETEK / LIVE RENDSZER

- [ ] Twitch Live indicator
- [ ] Current game
- [ ] Current title
- [ ] Viewer count
- [ ] Followers
- [ ] Subscribers, ha elérhető
- [ ] Last follower
- [ ] Last subscriber
- [ ] Recent support
- [ ] Recent activity
- [ ] Next stream
- [ ] Countdown
- [ ] Live video embed
- [ ] Live chat
- [ ] VOD carousel
- [ ] Clip carousel
- [ ] Social feed
- [ ] Spotify/now playing későbbi opció
- [ ] Stream uptime
- [ ] Stream status health

---

# 17. INTEGRÁCIÓS RÉTEG

- [ ] Twitch API service
- [ ] YouTube API service
- [ ] TikTok integráció
- [ ] Discord
- [ ] OAuth
- [ ] Token refresh
- [ ] Integration status
- [ ] Error isolation
- [ ] Rate limit handling
- [ ] Retry/backoff
- [ ] Webhook handling
- [ ] Webhook signature validation
- [ ] Normalized internal data model
- [ ] Integration cache
- [ ] Manual sync
- [ ] Automatic sync
- [ ] Last sync timestamp
- [ ] Sync error log

---

# 18. AUTH / ADMIN / JOGOSULTSÁG

- [ ] Szerveroldali auth teljesen működőképes
- [ ] Login
- [ ] Logout
- [ ] Session management
- [ ] HttpOnly cookie
- [ ] Secure cookie
- [ ] SameSite
- [ ] Biztonságos password hash
- [ ] CSRF
- [ ] Rate limiting
- [ ] RBAC
- [ ] Owner role
- [ ] Admin role
- [ ] Editor role későbbre
- [ ] Reviewer role későbbre
- [ ] Admin API protection
- [ ] Public/admin API separation
- [ ] Input validation
- [ ] Output validation
- [ ] Secret management
- [ ] Session expiration
- [ ] Session revoke
- [ ] Audit log
- [ ] No direct D1/R2/KV frontend access

---

# 19. ADMIN DASHBOARD

- [ ] Dashboard overview
- [ ] Site health
- [ ] Live status
- [ ] Upcoming stream
- [ ] Recent changes
- [ ] Recent errors
- [ ] Analytics summary
- [ ] Integration status
- [ ] Media storage usage
- [ ] Backup status
- [ ] Publish status
- [ ] Notifications
- [ ] Quick actions
- [ ] Search
- [ ] Global settings
- [ ] User/role management későbbi opció

---

# 20. MEDIA / R2

- [ ] R2 binding
- [ ] Upload
- [ ] D1 media metadata
- [ ] Image optimization
- [ ] MIME/type validation
- [ ] Safe filename
- [ ] Size limit
- [ ] Delete/archive
- [ ] Thumbnail
- [ ] Media search
- [ ] Media categories
- [ ] Media usage tracking
- [ ] Orphan media detection
- [ ] Storage cleanup
- [ ] Backup strategy
- [ ] Clip/short support

---

# 21. SEO / DISCOVERABILITY

- [ ] Title
- [ ] Description
- [ ] Canonical
- [ ] Open Graph
- [ ] Twitter/X card
- [ ] Robots
- [ ] Sitemap
- [ ] Structured data
- [ ] FAQ schema
- [ ] Video schema
- [ ] Article schema
- [ ] Breadcrumb schema
- [ ] SEO preview
- [ ] Per-page SEO
- [ ] Slug control
- [ ] Redirects
- [ ] 404
- [ ] Search-friendly content
- [ ] Social sharing preview
- [ ] AI/AEO-friendly metadata

---

# 22. ANALYTICS

- [ ] Saját event rendszer
- [ ] Page views
- [ ] Button clicks
- [ ] Link clicks
- [ ] Social clicks
- [ ] Twitch CTA clicks
- [ ] Discord joins/clicks
- [ ] Schedule interactions
- [ ] Video plays
- [ ] Stream events
- [ ] Conversion tracking
- [ ] Sponsor contact conversions
- [ ] Merch CTA conversions
- [ ] Newsletter conversion
- [ ] Admin dashboard statistics
- [ ] Privacy-aware measurement
- [ ] Data retention policy
- [ ] Export
- [ ] Aggregation
- [ ] Anomaly detection később

---

# 23. PERFORMANCE / ACCESSIBILITY / QUALITY

- [ ] Core Web Vitals ellenőrzés
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Asset minification
- [ ] Cache strategy
- [ ] KV cache ahol indokolt
- [ ] API response caching
- [ ] Error boundaries/fallbacks
- [ ] 404 handling
- [ ] Accessibility audit
- [ ] Keyboard navigation
- [ ] Focus states
- [ ] ARIA where needed
- [ ] Contrast checks
- [ ] Reduced motion
- [ ] Screen reader checks
- [ ] Mobile performance
- [ ] Desktop performance
- [ ] Tablet performance
- [ ] Browser compatibility

---

# 24. DESIGN / BRAND / UX

- [ ] Egységes header
- [ ] Egységes footer
- [ ] Egységes menu
- [ ] Desktop menu a kívánt mobilos gömb/lenyíló logika szerint
- [ ] Twitch Live indicator
- [ ] Közös design tokens
- [ ] Közös színpaletta
- [ ] Közös typography
- [ ] Közös spacing
- [ ] Kártyaméretek egységesítése
- [ ] Schedule végleges design
- [ ] Support végleges design
- [ ] Community végleges design
- [ ] Twitch végleges design
- [ ] TikTok végleges design
- [ ] YouTube végleges design
- [ ] About végleges design
- [ ] Contact végleges design
- [ ] Media kit végleges design
- [ ] Merch végleges design
- [ ] Mobil regressziómentesség
- [ ] Desktop regressziómentesség
- [ ] Tablet regressziómentesség
- [ ] Külföldi streamer oldalak jó UX mintáinak felhasználása klónozás nélkül
- [ ] Publikus oldalon nincs fejlesztői/technikai szöveg

### Design kutatási alap

A tervet több modern vizuális builder/CMS és streamer-site minta alapján bővítettük. Különösen hasznos minták: Webflow strukturált visual builder/CMS, Framer canvas + CMS + AI workflow, valamint creator/streamer oldalaknál a live státusz, schedule, VOD, közösség, media kit, sponsor contact és merch felületek. citeturn0search1turn0search2turn0search0turn0search17

---

# 25. AI-READY ARCHITEKTÚRA

- [ ] AI service layer
- [ ] Tool registry
- [ ] Tool permission system
- [ ] Read-only AI mode
- [ ] Suggestion mode
- [ ] Approval-to-execute mode
- [ ] Audit minden AI műveletről
- [ ] AI csak engedélyezett service/API-n keresztül módosít
- [ ] AI oldal létrehozás
- [ ] AI oldal módosítás
- [ ] AI layout módosítás
- [ ] AI szövegírás
- [ ] AI SEO javaslat
- [ ] AI content quality check
- [ ] AI Sanci Button módosítás
- [ ] AI schedule módosítás
- [ ] AI social content előkészítés
- [ ] AI media tagging
- [ ] AI accessibility check
- [ ] AI design consistency check
- [ ] AI regresszió ellenőrzés
- [ ] AI change preview
- [ ] AI rollback

---

# 26. JÖVŐBELI AI STREAM ASSISTANT

A weboldal nem csak weboldal lesz: később ugyanebből az architektúrából építhető a stream közbeni asszisztens.

- [ ] OBS kapcsolat
- [ ] OBS WebSocket
- [ ] Stream állapot figyelése
- [ ] Scene figyelés
- [ ] Mic/audio állapot
- [ ] Hangszint figyelés
- [ ] Csend érzékelés
- [ ] Túl hosszú csend jelzése
- [ ] Beszédaktivitás
- [ ] Chat aktivitás
- [ ] Viewer aktivitás
- [ ] Ötletjavaslat adás közben
- [ ] Stream esemény felismerés
- [ ] Jó pillanat jelölése
- [ ] Clip marker
- [ ] Gombnyomásra clip/short készítés
- [ ] Automatikus clip javaslat
- [ ] Clip mentés
- [ ] Short előkészítés
- [ ] Több platformra tartalomváltozat
- [ ] OBS scene ellenőrzés
- [ ] Mikrofon ellenőrzés
- [ ] Audio ellenőrzés
- [ ] Stream beállítás teszt
- [ ] Technikai hibajelzés
- [ ] Post-stream összefoglaló
- [ ] VOD elemzés
- [ ] Legjobb pillanatok kiválasztása
- [ ] Tartalomötletek valódi stream alapján
- [ ] Silence/topic/activity trendek
- [ ] Stream quality report

---

# 27. STREAMER TARTALOM- ÉS NÖVEKEDÉSI ESZKÖZÖK

- [ ] Content calendar
- [ ] Stream calendar
- [ ] Short idea database
- [ ] Clip library
- [ ] Content tagging
- [ ] Game tagging
- [ ] Platform tagging
- [ ] Cross-post workflow
- [ ] YouTube description template
- [ ] TikTok caption template
- [ ] Social post template
- [ ] Thumbnail management
- [ ] Thumbnail variants
- [ ] Content status: idea/draft/ready/published/archive
- [ ] Content performance
- [ ] Best-performing content
- [ ] Reuse content workflow
- [ ] Sponsor campaign tracking későbbi opció

---

# 28. ÜZLETI / MONETIZÁCIÓS ELŐKÉSZÍTÉS

- [ ] Sponsor page
- [ ] Media kit
- [ ] Business contact
- [ ] Sponsor inquiry form
- [ ] Brand assets page
- [ ] Past collaborations
- [ ] Affiliate links
- [ ] Merch
- [ ] Donations
- [ ] Support
- [ ] Newsletter
- [ ] Paid membership későbbi opció
- [ ] Digital products későbbi opció
- [ ] Campaign landing pages
- [ ] Sponsor campaign pages
- [ ] UTM tracking
- [ ] Conversion tracking

---

# 29. HIBAKEZELÉS / EDGE CASE / REGRESSZIÓ

- [ ] Hibás page ID
- [ ] Nem létező oldal
- [ ] Üres dokumentum
- [ ] Hibás JSON
- [ ] Sérült JSON
- [ ] Mentési API hiba
- [ ] D1 hiba
- [ ] R2 hiba
- [ ] Integration API hiba
- [ ] Jogosulatlan admin kérés
- [ ] Session lejárat
- [ ] Network interruption
- [ ] Dupla mentés
- [ ] Stale revision
- [ ] Race condition
- [ ] Nagy dokumentum
- [ ] Nagy médiafájl
- [ ] Ismeretlen elem
- [ ] Legacy elem
- [ ] Hiányzó média
- [ ] Hiányzó integration token
- [ ] API rate limit
- [ ] Webhook hiba
- [ ] Cache stale state
- [ ] Publish részleges hiba
- [ ] Rollback hiba
- [ ] Backup restore hiba
- [ ] Mobil regresszió
- [ ] Desktop regresszió
- [ ] Tablet regresszió

---

# 30. IMPORT / EXPORT / MIGRÁCIÓ

- [ ] Page export
- [ ] Page import
- [ ] Site export
- [ ] Site backup export
- [ ] Media metadata export
- [ ] Settings export
- [ ] JSON schema versioning
- [ ] Migration system
- [ ] Legacy document migration
- [ ] Import validation
- [ ] Import preview
- [ ] Import rollback

---

# 31. FEJLESZTŐI / ÜZEMELTETÉSI ESZKÖZÖK

- [ ] Health endpoint
- [ ] DB health
- [ ] Integration health
- [ ] Deployment status
- [ ] Error logging
- [ ] Structured logs
- [ ] Audit logs
- [ ] Admin diagnostics
- [ ] Feature flags
- [ ] Environment separation
- [ ] Secrets Cloudflare Secretsben
- [ ] No secrets GitHubban
- [ ] Migration tracking
- [ ] Deployment rollback
- [ ] Release notes
- [ ] Change log

---

# 32. VÉGSŐ INTEGRÁCIÓS TESZTEK

- [ ] Login → Admin → Editor
- [ ] Új oldal → elem → szerkesztés
- [ ] Save → D1 → refresh
- [ ] Preview PC → Mobile → Tablet
- [ ] Publish → public
- [ ] Republish → public refresh
- [ ] Unpublish
- [ ] Rollback
- [ ] Backup → restore
- [ ] Shared component update → minden használat
- [ ] Sanci Button update → minden használat
- [ ] Social integrations
- [ ] Twitch
- [ ] TikTok
- [ ] YouTube
- [ ] Schedule
- [ ] VOD
- [ ] Media/R2
- [ ] SEO
- [ ] Analytics
- [ ] Security
- [ ] Auth
- [ ] Error handling
- [ ] Mobile regression
- [ ] Desktop regression
- [ ] Tablet regression
- [ ] Performance
- [ ] Accessibility
- [ ] Final public-site walkthrough
- [ ] Final admin walkthrough
- [ ] Final restore/rollback test

---

# 33. VÉGLEGES ÁTADÁSI CHECKLIST

- [ ] Nincs ismert blokkoló hiba
- [ ] Minden kritikus funkció tesztelve
- [ ] Minden `[x]` valóban felhasználó által ellenőrzött
- [ ] Minden backend funkció szerveroldalon ellenőrzött
- [ ] D1 adatok rendben
- [ ] R2 adatok rendben
- [ ] Auth rendben
- [ ] Security ellenőrizve
- [ ] Backup ellenőrizve
- [ ] Restore ellenőrizve
- [ ] Publish/rollback ellenőrizve
- [ ] SEO ellenőrizve
- [ ] Analytics ellenőrizve
- [ ] Performance ellenőrizve
- [ ] Accessibility ellenőrizve
- [ ] Mobil ellenőrizve
- [ ] Tablet ellenőrizve
- [ ] Desktop ellenőrizve
- [ ] Publikus oldal végigtesztelve
- [ ] Admin végigtesztelve
- [ ] Dokumentáció frissítve

---

# 34. ÚJ IGÉNYEK KEZELÉSE

Minden új ötlet ugyanazon a folyamaton megy végig:

1. [x] bekerül a tervbe
2. [x] modul kijelölése
3. [x] igazságforrás meghatározása
4. [x] jogosultság meghatározása
5. [x] jövőbeli hatás ellenőrzése
6. [x] teszt meghatározása
7. [ ] fejlesztés
8. [ ] teszt
9. [ ] felhasználói ellenőrzés
10. [ ] `[x]` pipálás

**Új funkciót nem építünk úgy, hogy előtte ne kerüljön bele ebbe a tervbe.**

---

# 35. ÁLLAPOTJELÖLÉSEK

- `[x]` Kész és felhasználó által ellenőrizve
- `[~]` Részben kész / javítás vagy további teszt kell
- `[ ]` Nincs kész
- `[!]` Ismert blokkoló probléma

---

# 36. AKTUÁLIS FEJLESZTÉSI ÁLLAPOT

**Dátum: 2026-09-14**

### Biztosan felhasználó által ellenőrzött Visual Editor funkciók

- [x] X/Y pozíció
- [x] Elemátfedés
- [x] Réteg sorrend / előre-hátra
- [x] Lock / Unlock

### Következő egyetlen teszt

- [ ] **Hide / Show**

### Fontos szabály

A következő teszt mindig az itt megjelölt **egyetlen** pont. Ha sikerül, ezt a fájlt azonnal frissítjük `[x]` állapotra, kijelöljük a következő egyetlen tesztet, és csak utána haladunk tovább.

---

## Végleges projektirány

**Sanci9517 = streamer weboldal + professzionális visual CMS + közösségi platform + creator/business hub + AI-ready rendszer + későbbi Stream Assistant.**

A rendszernek úgy kell felépülnie, hogy a későbbi funkciók hozzáadhatók legyenek anélkül, hogy a meglévő oldalakat vagy az alap architektúrát újra kelljen építeni.

**Utolsó tervfrissítés: 2026-09-14**