# Sanci9517 — ULTIMATE PLATFORM DIRECTION

**Dátum:** 2026-09-16
**Státusz:** hivatalos architekturális kiegészítés

Ez a dokumentum a `DEVELOPMENT-PLAN.md`, `FINAL-DEVELOPMENT-ROADMAP.md` és `FINAL-MASTER-PLAN.md` mellett érvényes. Nem törli a korábbi részletes pontokat. A cél annak rögzítése, hogy a rendszert a jelenlegi szükségletnél jelentősen nagyobbra tervezzük, hogy később ne kelljen újraépíteni az alapokat.

## 1. ÚJ FŐELV

A Sanci9517 projektet nem egyszerű streamer weboldalként, hanem hosszú távon **moduláris creator platformként** építjük.

A jelenlegi funkciók csak az első működési réteg. Az architektúrának alkalmasnak kell lennie újabb, akár több száz vagy ezer későbbi funkció befogadására. Nem minden funkciót építünk meg most; az alapokat viszont úgy építjük, hogy később ne kelljen miattuk újratervezni.

## 2. MI NEM VÁLTOZIK

- GitHub + Cloudflare marad a projekt alapja.
- D1 marad az elsődleges strukturált tartalom-adatforrás.
- A részletes `DEVELOPMENT-PLAN.md` meglévő pontjai megmaradnak.
- A már ellenőrzött működéseket nem töröljük csak azért, mert az architektúrát újraépítjük.
- A mostani Visual Editor kódja referencia és funkcióleltár; nem tekintjük végleges architektúrának.
- Minden lényeges fejlesztés: terv → kód → GitHub → Cloudflare → API/D1 → böngésző → felhasználói teszt → visszaigazolás.

## 3. ÚJ VISUAL EDITOR ALAPELV

```text
UI / AI / Automation
        ↓
Command / Action
        ↓
Validation + Permission
        ↓
Editor State
        ↓
History / Version
        ↓
Renderer
   ├── Canvas
   ├── Layers
   └── Inspector
        ↓
Persistence API
        ↓
Cloudflare / D1 / R2 / KV
```

Az Editor State a szerkesztési igazságforrás. A DOM, Canvas, Layers és Inspector nem külön adatforrás.

## 4. FUNKCIÓBŐVÍTÉSI ELV

Az új rendszernek eleve helyet kell biztosítania többek között:

- site/page/section/container/element rendszer
- Flex, Grid és fejlett layout
- responsive szabályok
- typography, appearance, animation, interaction
- reusable component, template, global component
- design token és preset rendszer
- media library
- dynamic data és API data source
- Twitch, YouTube, TikTok, Discord
- schedule, VOD, Shorts, Clips
- analytics, SEO, accessibility
- forms, CTA, támogatás és későbbi kereskedelmi modulok
- import/export
- versioning, backup/restore, audit
- permissions és concurrency protection
- command palette, property search, fejlett canvas eszközök
- automation
- AI actions, approval, QA, content generation, engineering
- stream intelligence, research, analytics intelligence

Ez nem zárt lista. Új funkciók később hozzáadhatók újratervezés nélkül.

## 5. STABIL AZONOSÍTÓK

Minden fontos entitás saját stabil azonosítót kap:

`siteId, pageId, sectionId, containerId, componentId, elementId, mediaId, scheduleId, actionId, versionId, auditId, taskId, automationId, agentId, templateId, tokenId, dataSourceId`

Az ID nem változik pusztán áthelyezés, átnevezés vagy újrarenderelés miatt.

## 6. KÖZPONTI ACTION RENDSZER

Minden módosítás központi action/command rendszeren keresztül történik.

Alapműveletek:

`create, update, delete, duplicate, move, resize, reparent, reorder, group, ungroup, select, style.set, layout.set, responsive.set, content.set, visibility.set, lock.set, page.create/delete/rename/duplicate, component.create/update/delete, template.create/apply, media.attach/detach, save, preview, publish, rollback, restore`

Később ugyanennek a rendszernek a felhasználó mellett AI és automatizáció is fogyasztója lehet.

## 7. VALIDÁCIÓ ÉS BIZTONSÁG

Minden mutáló műveletnél legyen:

1. schema validation
2. input validation
3. hierarchy validation
4. permission validation
5. operation validation
6. szükség esetén preview
7. history entry
8. audit entry
9. rollback lehetőség

Legyen `can()` jellegű előzetes ellenőrzés is, amely módosítás nélkül megmondja, végrehajtható-e egy művelet.

## 8. DOCUMENT MODEL

```text
Site
 └── Page
      └── Root
           └── Section
                └── Container
                     └── Component / Element
```

Egy node tartalmazhat: `id, type, name, parentId, children, content, layout, style, responsive, interaction, visibility, locked, metadata, dataBindings, validationState, capabilities`.

## 9. PLATFORM RÉTEGEK

### Editor Layer
Canvas, Layers, Inspector, Toolbar, Command Palette.

### Content Layer
Pages, Components, Templates, Media, Content.

### Data Layer
D1, R2, KV, API data sources, caching.

### Integration Layer
Twitch, YouTube, TikTok, Discord és későbbi szolgáltatások.

### Automation Layer
Trigger → condition → action → result.

### AI Layer
Intent → Plan → Validate → Preview → Approve → Execute → Verify → Audit.

### Intelligence Layer
Analytics, Research, Stream Intelligence, Content Intelligence.

## 10. STREAMER PLATFORM

Később kezelhető legyen: élő állapot, játék, stream cím, nézőszám, következő adás, adásrend, VOD, Shorts, Clips, közösségi statisztikák, kiemelt tartalom, Discord állapot, támogatás, subscription/membership adatok, sponsor/press adatok, kampányok, tartalomnaptár és események.

## 11. CONTENT ENGINE

Későbbi modulok: VOD elemzés, érdekes pillanatok felismerése, short jelöltek, cím/leírás/hashtag javaslat, thumbnail brief, platform-specifikus tartalomváltozat, publikálási naptár és tartalomteljesítmény elemzés.

## 12. STREAM INTELLIGENCE

Későbbi lehetőségek: beszédszünet érzékelés, chat aktivitás elemzés, technikai problémák felismerése, hangproblémák jelzése, jelenetváltási javaslat, érdekes pillanatok jelölése, stream minőség ellenőrzése, adás közbeni ötletjavaslat és stream utáni összefoglaló.

## 13. AI ENGINEER

A későbbi AI ne közvetlen DOM-manipulációval dolgozzon.

```text
AI kérés
 ↓
értelmezés
 ↓
strukturált terv
 ↓
action lista
 ↓
validáció
 ↓
preview/diff
 ↓
jóváhagyás
 ↓
végrehajtás
 ↓
teszt
 ↓
ellenőrzés
 ↓
audit/version
```

Ugyanezt a biztonságos action rendszert használja majd a Visual Editor is.

## 14. TESZTELÉSI BŐVÍTÉS

A meglévő A–O tesztlista megmarad. A későbbi teljes rendszer további tesztjei:

- unit
- integration
- API
- D1/R2/KV
- E2E/browser
- smoke/regression
- visual regression
- responsive
- accessibility
- security
- performance
- backup/restore
- migration
- concurrency
- AI action validation
- AI rollback
- production deployment

## 15. ÚJRAÉPÍTÉSI SZABÁLY

A Visual Editor újraépítése nem projekt-visszalépés.

```text
Biztonsági backup ✓
      ↓
Régi editor funkcióinak feltérképezése ✓
      ↓
Új schema
      ↓
Új state
      ↓
Új commands/actions
      ↓
Validation
      ↓
History
      ↓
Selection
      ↓
Hierarchy
      ↓
Canvas
      ↓
Layers
      ↓
Inspector
      ↓
Persistence
      ↓
A jelenlegi funkcionális szint visszaépítése
      ↓
Teljes teszt
      ↓
Továbbfejlesztés
```

A régi `fix`, `stabilizer` és párhuzamos vezérlési rétegek csak akkor törlendők, amikor az új rendszer az általuk biztosított funkciókat már átvette és ellenőriztük.

## 16. VÉGSŐ IRÁNY

```text
Sanci9517 Website
      ↓
CMS
      ↓
Visual Editor
      ↓
Structured Platform
      ↓
Integrations
      ↓
Automation
      ↓
AI Orchestrator
      ↓
Specialized Agents
      ↓
Stream Intelligence
      ↓
Content Engine
      ↓
Analytics + Research
      ↓
Controlled Autonomy
```

A cél nem az, hogy most minden modult elkészítsünk, hanem hogy **az új alapok egy későbbi, akár nagyságrendekkel nagyobb funkciókészletet is elbírjanak újratervezés nélkül**.
