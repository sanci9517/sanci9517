# Sanci9517 Visual Editor — fejlesztési terv

## Munkaszabály

- A régi Visual Editort nem javítjuk tovább; az új editor külön architektúrával készül.
- Minden fázis: fejlesztés → felhasználói teszt → visszajelzés → javítás → jóváhagyás.
- Következő fázis csak jóváhagyás után indul.
- Visszalépés bármelyik korábbi fázisra megengedett.
- A PC editor készül először; a mobil editor külön UX lesz.
- A nagy funkciómennyiség progressive disclosure elven jelenik meg: accordions, tabs, keresés, Beginner/Advanced/Pro réteg.

## Fázisok

- [x] 00 Specifikáció
- [ ] 01 Editor Shell
- [ ] 02 Canvas Engine
- [ ] 03 Element System
- [ ] 04 Sanci9517 Blocks
- [ ] 05 Inspector
- [ ] 06 Layers
- [ ] 07 Design System
- [ ] 08 Drag & Drop
- [ ] 09 History / Autosave / Recovery
- [ ] 10 Preview
- [ ] 11 Twitch / YouTube / TikTok / Discord / Schedule / VOD integrációk
- [ ] 12 Animation / Interaction
- [ ] 13 Responsive
- [ ] 14 SEO / Accessibility
- [ ] 15 Reusable Components
- [ ] 16 Templates
- [ ] 17 PC Editor 1.0
- [ ] 18 Mobile Editor

## Phase 01 — Editor Shell teszt

Tesztelendő:

- topbar és oldalválasztó
- undo / redo gombok helye
- bal oldali elem panel
- kategóriák összecsukása / kinyitása
- elemkereső
- középső canvas
- zoom / fit
- grid / snap kapcsoló
- Layers panel
- jobb oldali Inspector
- Inspector összecsukható csoportjai
- alsó státuszsáv
- PC-only működés

A Phase 01-ben a backend mentés és valódi Publish még nincs kész; a Mentés jelenleg csak helyi böngészős tesztállapotot használ. A cél kizárólag az editor kezelési vázának validálása.
