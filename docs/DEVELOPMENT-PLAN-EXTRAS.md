# Sanci9517 V2 — Fejlesztési terv kiegészítések

> Ez a dokumentum a `docs/DEVELOPMENT-PLAN.md` kiegészítése. Nem írja felül és nem törli a meglévő tervet.
> A meglévő fejlesztési sorrend, az aktuális ellenőrzött állapot és a lépésenkénti tesztelési szabály változatlan marad.

## 1. Backup / Restore

- [ ] D1 tartalom biztonsági mentése
- [ ] Szerkesztési dokumentum exportálható mentése
- [ ] Média metaadatok mentése
- [ ] Backup verzióazonosító
- [ ] Kézi backup indítása adminból
- [ ] Automatikus backup stratégia
- [ ] Restore előtti megerősítés
- [ ] Teljes restore teszt
- [ ] Részleges restore, ha biztonságosan megoldható
- [ ] Restore után integritásellenőrzés

## 2. Autosave és adatvesztés elleni védelem

- [ ] Autosave
- [ ] Mentési állapot egyértelmű kijelzése
- [ ] Dirty state
- [ ] Nem mentett módosítások figyelmeztetése oldalváltáskor
- [ ] Böngésző bezárása / frissítése előtti védelem
- [ ] Hálózati hiba utáni biztonságos folytatás
- [ ] Sikertelen autosave kezelése
- [ ] Ne jöjjön létre végtelen számú felesleges revision

## 3. Audit és rendszerlog

- [ ] Admin műveletek auditálása
- [ ] Login / logout naplózás
- [ ] Oldal létrehozás / módosítás / törlés naplózása
- [ ] Publish / unpublish naplózása
- [ ] Restore naplózása
- [ ] Beállítások módosításának naplózása
- [ ] Integrációs változtatások naplózása
- [ ] AI-műveletek későbbi auditálása
- [ ] Hiba- és regressziónapló
- [ ] Naplók keresése/szűrése adminból

## 4. Maintenance Mode

- [ ] Maintenance mode kapcsoló
- [ ] Publikus oldal karbantartási nézete
- [ ] Admin hozzáférés karbantartás alatt
- [ ] Egyértelmű állapotjelző
- [ ] Ki-/bekapcsolás auditálása

## 5. Feature Flags

- [ ] Feature flag adatmodell
- [ ] Adminból kapcsolható funkciók
- [ ] Biztonságos alapértelmezett állapot
- [ ] Funkciók ki-/bekapcsolásának auditálása
- [ ] Feature flag használata új funkciók fokozatos bekapcsolásához

## 6. Import / Export

- [ ] Oldal export
- [ ] Teljes tartalom export
- [ ] Beállítások exportja, titkok nélkül
- [ ] Import validáció
- [ ] Import előnézet
- [ ] Import előtt backup
- [ ] Hibás import visszavonása
- [ ] Export/Import verzióazonosítás

## 7. Többnyelvűségre előkészítés

- [ ] Tartalommodell legyen locale-képes
- [ ] HU alapnyelv
- [ ] EN előkészítés
- [ ] UA előkészítés
- [ ] Nyelvváltó komponens architektúrája
- [ ] SEO metaadatok nyelvenként
- [ ] Fallback nyelv
- [ ] URL-struktúra későbbi többnyelvűséghez

## 8. Média Manager bővítés

- [ ] Keresés
- [ ] Szűrés fájltípus szerint
- [ ] Kategóriák / tagek
- [ ] Alt text kötelező kezelése képeknél
- [ ] Kép előnézet
- [ ] Thumbnail
- [ ] Kép csere hivatkozások megtartásával
- [ ] Használati helyek megjelenítése
- [ ] Archiválás törlés helyett, ahol indokolt
- [ ] Biztonságos MIME- és méretellenőrzés

## 9. Design System / Theme

- [ ] Globális színpaletta
- [ ] Tipográfiai skála
- [ ] Spacing tokenek
- [ ] Border tokenek
- [ ] Radius tokenek
- [ ] Shadow tokenek
- [ ] Gomb tokenek
- [ ] Globális header
- [ ] Globális footer
- [ ] Globális navigáció
- [ ] Globális Twitch Live indicator
- [ ] Theme mentése D1-ben
- [ ] Theme előnézet

## 10. Responsive editor bővítés

- [ ] Desktop / tablet / mobile breakpointok
- [ ] Elemenkénti breakpoint értékek
- [ ] Responsive typography
- [ ] Responsive spacing
- [ ] Responsive image sizing
- [ ] Breakpoint-specifikus visibility
- [ ] Orientation kezelés
- [ ] Minden publikus oldal regressziótesztje

## 11. UX és szerkesztési védelem

- [ ] Keyboard shortcuts
- [ ] Kontextusmenü
- [ ] Breadcrumb / szülőelem navigáció
- [ ] Elemkeresés
- [ ] Elem átnevezése
- [ ] Hibás elem jelzése
- [ ] Accessibility figyelmeztetések
- [ ] Törlés megerősítése
- [ ] Tömeges műveletek megerősítése
- [ ] Veszélyes műveletek egyértelmű jelzése

## 12. SEO bővítés

- [ ] SEO preview
- [ ] Social preview
- [ ] Sitemap automatikus frissítése
- [ ] Robots kezelés
- [ ] Canonical kezelés
- [ ] Structured data
- [ ] Oldalankénti SEO
- [ ] Többnyelvű SEO előkészítés

## 13. Analytics bővítés

- [ ] Oldalmegtekintés
- [ ] Link/gomb kattintás
- [ ] Stream események
- [ ] Admin dashboard statisztikák
- [ ] Privacy-aware mérés
- [ ] Adatmegőrzési szabály
- [ ] Exportálható statisztikák

## 14. Technikai minőség

- [ ] Képoptimalizálás
- [ ] Lazy loading
- [ ] Cache stratégia
- [ ] Cache invalidation publish után
- [ ] Accessibility ellenőrzés
- [ ] Keyboard navigation
- [ ] Kontrasztellenőrzés
- [ ] Core web performance ellenőrzés
- [ ] PWA lehetőség előkészítése

## 15. Biztonsági hardening

- [ ] Auth teljes körű ellenőrzése
- [ ] Authorization minden admin endpointon
- [ ] HttpOnly / Secure / SameSite cookie
- [ ] Password hashing
- [ ] CSRF
- [ ] Rate limiting
- [ ] Input validation
- [ ] Output validation, ahol szükséges
- [ ] Public/admin API szétválasztás
- [ ] Secrets kizárása Gitből
- [ ] D1/R2/KV közvetlen frontend hozzáférés tiltása
- [ ] Session lejárat és visszavonás
- [ ] Audit log ellenőrzés
- [ ] Biztonsági regresszióteszt

## 16. Publish és verziózás bővítés

- [ ] Draft
- [ ] Preview
- [ ] Publish
- [ ] Published revision ID
- [ ] Unpublish
- [ ] Republish
- [ ] Revision history
- [ ] Diff
- [ ] Restore
- [ ] Publish utáni cache invalidation
- [ ] Publish hiba esetén biztonságos visszaesés

## 17. Streamer-specifikus V1

- [ ] Twitch live/offline
- [ ] Stream title
- [ ] Aktuális játék
- [ ] Viewer count, ahol az API engedi
- [ ] Uptime
- [ ] Következő stream
- [ ] Countdown
- [ ] Heti schedule
- [ ] VOD
- [ ] Highlights
- [ ] Clips
- [ ] Social linkek
- [ ] Community / Discord
- [ ] Support
- [ ] Media Kit
- [ ] Sponsor / partner modul

## 18. Publikus design minőség

- [ ] Egységes design minden oldalon
- [ ] Mobilos navigációs koncepció megtartása desktopon is
- [ ] Kártyaméretek egységesítése
- [ ] Schedule végleges design
- [ ] Twitch végleges design
- [ ] TikTok végleges design
- [ ] YouTube végleges design
- [ ] Support végleges design
- [ ] Community végleges design
- [ ] About / Contact végleges design
- [ ] Desktop / tablet / mobile regresszióteszt
- [ ] Idegen streamer oldalakból szerzett UX minták felhasználása klónozás nélkül

## 19. Végső V1 ellenőrzés

- [ ] Teljes admin folyamat végigtesztelve
- [ ] Teljes Visual Editor folyamat végigtesztelve
- [ ] D1 adatút végigtesztelve
- [ ] R2 médiaút végigtesztelve
- [ ] Preview → Publish végigtesztelve
- [ ] Backup → Restore végigtesztelve
- [ ] Autosave és dirty state tesztelve
- [ ] Auth és security tesztelve
- [ ] SEO tesztelve
- [ ] Analytics tesztelve
- [ ] Desktop / tablet / mobile tesztelve
- [ ] Publikus oldalak végigtesztelve
- [ ] Hibás és edge case forgatókönyvek tesztelve
- [ ] Production smoke test

## 20. AI — csak V1 után

- [ ] AI service réteg
- [ ] Tool registry
- [ ] Permission rendszer
- [ ] Read-only mód
- [ ] Javaslat mód
- [ ] Jóváhagyásos végrehajtás
- [ ] Auditált site módosítás
- [ ] Stream figyelés
- [ ] Csend/beszéd elemzés
- [ ] Chat elemzés
- [ ] Stream ötletek
- [ ] Technikai problémák jelzése
- [ ] OBS segítség
- [ ] Highlight felismerés
- [ ] Clip/short készítés
- [ ] VOD elemzés
- [ ] Adás utáni elemzés

> **AI fejlesztés nem kezdődhet el addig, amíg a V1 weboldal, admin, szerveroldali adatkezelés, publish rendszer, biztonság és végső tesztelés nincs kész.**

## 21. Munkaszabály

Ez a kiegészítés is ugyanazt a szabályt követi, mint a fő terv:

**egy lépés → teszt → felhasználói ellenőrzés → `[x]` → következő lépés.**

A már meglévő fő terv pontjait nem jelöljük újra késznek pusztán azért, mert itt szerepelnek. Az állapotot mindig a tényleges teszt alapján változtatjuk.

**Kiegészítés dátuma:** 2026-09-14
