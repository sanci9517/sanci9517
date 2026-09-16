# Sanci9517 — MASTER-1.2 Visual Editor kiegészítő specifikáció

**Dátum:** 2026-09-16  
**Kapcsolódó főterv:** `docs/MASTER-DEVELOPMENT-PLAN.md`  
**Státusz:** kötelező végrehajtási specifikáció  
**Cél:** a Visual Editor teljes, bővíthető és AI-kompatibilis újraépítése.

> Ez a dokumentum a MASTER terv Visual Editor követelményeit részletezi. Nem a régi editor javításának terve. Az új editor egyetlen kanonikus architektúrából épül.

---

## 1. Kötelező architektúra

A kanonikus adatfolyam:

`Page Model → Editor State → Command System → Canvas → Layer Tree → Inspector → History → Persistence → D1 → Preview → Publish → Public Renderer`

Kötelező szabályok:
- egyetlen Page Model;
- egyetlen editor state;
- egyetlen mutation/command rendszer;
- egyetlen hierarchy modell (`parentId + children/order`);
- nincs legacy stabilizer;
- nincs párhuzamos `state.doc`/`state.document` modell;
- nincs külön groupId-alapú hierarchy;
- UI nem ír közvetlenül D1/R2/KV-t;
- AI később ugyanazokat a commandokat használja, mint a UI.

---

## 2. Dokumentum- és oldalrendszer

- több oldal kezelése;
- oldal létrehozás, másolás, duplikálás, törlés;
- slug, title, státusz és metaadatok;
- draft/preview/publish;
- verziózás;
- rollback;
- változás-összehasonlítás;
- oldalzárolás;
- jogosultság;
- sablonból oldal létrehozás;
- page template;
- section template;
- component template;
- import/export;
- strukturált JSON Page Model;
- schema migration;
- invalid/orphan/circular node védelem.

---

## 3. Hierarchy / Layers

- valódi parent-child kapcsolat;
- root/section/container/slot;
- nested nesting;
- multi-level tree;
- drag & drop;
- drop zone;
- insertion before/after/inside;
- reparent;
- unnest;
- multi-select;
- bulk move/delete/duplicate;
- group/ungroup;
- nested groups;
- lock/hide;
- rename;
- z-index/layer order;
- tree search;
- collapse/expand;
- expand-to-selected;
- breadcrumbs;
- parent selection;
- invalid nesting tiltás;
- allowed-child és slot/capacity szabályok.

---

## 4. Alapelemek és tartalom

Kötelező alapkészlet:
- root;
- container;
- section;
- row/columns;
- flex;
- grid;
- stack;
- group;
- heading;
- text/paragraph;
- rich text;
- link;
- button;
- image;
- video;
- audio;
- icon/SVG;
- divider;
- spacer;
- badge/avatar/card;
- list/table;
- tabs/accordion/dropdown;
- breadcrumb/pagination/search;
- countdown/progress/notification;
- modal/popup;
- navbar/menu/footer/sidebar;
- form/input/textarea/checkbox/radio/select/slider/file/submit;
- gallery/carousel;
- iframe/embed/map/code;
- social embed;
- dynamic/custom component slot.

Sanci-specifikus elemek:
- Twitch;
- YouTube;
- TikTok;
- Discord;
- Live status;
- Schedule;
- Stream count;
- Followers/Subs;
- VOD;
- Support;
- Community;
- Game card/list.

---

## 5. Inspector / property system

Minden szerkeszthető propertynek legyen:
- schema;
- default érték;
- típusellenőrzés;
- validáció;
- reset;
- inherited állapot;
- explicit override állapot;
- responsive override;
- token kapcsolat ahol releváns;
- undo/redo támogatás.

Inspector kategóriák:
- content;
- rich text;
- typography;
- dimensions;
- spacing;
- flex;
- grid;
- position;
- appearance;
- background;
- border;
- radius;
- shadow;
- media;
- responsive;
- states;
- interaction;
- navigation;
- accessibility;
- data binding;
- visibility;
- advanced.

UI funkciók:
- property search;
- color picker;
- unit selector;
- linked/unlinked spacing sides;
- token selector;
- inherited/overridden jelzés;
- invalid value jelzés;
- property reset;
- shorthand/expanded editing.

---

## 6. Layout engine

Sizing:
- fixed;
- auto;
- fit-content;
- fill;
- min/max;
- percentage;
- viewport units;
- intrinsic;
- fluid;
- clamp;
- aspect ratio.

Spacing:
- margin;
- padding;
- gap;
- negative margin ahol engedélyezett;
- responsive spacing;
- visual box-model editor.

Flex:
- row/column;
- reverse;
- wrap;
- justify;
- align;
- align-content;
- order;
- grow/shrink/basis;
- self;
- gap.

Grid:
- rows/columns;
- fixed/fractional/auto;
- minmax;
- auto-fit/auto-fill;
- areas;
- placement;
- alignment;
- explicit/implicit validation.

Position:
- static;
- relative;
- absolute;
- fixed;
- sticky;
- inset;
- z-index;
- stacking context validation.

Overflow:
- visible;
- hidden;
- auto;
- scroll;
- x/y;
- clip;
- text overflow.

---

## 7. Styling / Design System

- color;
- gradient;
- typography;
- font family/size/weight/line-height/letter-spacing;
- text alignment/transform;
- background;
- border;
- radius;
- shadow;
- opacity;
- transform;
- filter;
- transition;
- animation.

Design tokens:
- colors;
- typography;
- spacing;
- radius;
- shadow;
- breakpoints;
- reusable style presets;
- CSS variables;
- token override;
- token usage search;
- unused-token detection későbbi ellenőrzésként.

Component states:
- default;
- hover;
- focus;
- active;
- disabled;
- selected/current;
- variants;
- variant props.

---

## 8. Canvas / UX

- zoom 25/50/75/100/150/200%;
- fit screen;
- grid;
- guides;
- snap;
- rulers;
- safe area;
- device frame;
- full-page mode;
- focus selected;
- selection/hover/parent outline;
- spacing visualizer;
- breakpoint indicator;
- scroll preservation;
- alignment tools;
- distribute;
- match size;
- distance indicators;
- smart guides;
- snap to siblings/container.

Panels:
- layers;
- inspector;
- components;
- assets;
- pages;
- history;
- preview/publish;
- command palette;
- notifications;
- modal system;
- resizable/collapsible panels;
- persisted panel state.

---

## 9. Clipboard / bulk editing

- copy;
- cut;
- paste;
- duplicate;
- cross-page paste;
- duplicate ID regeneration;
- paste into selected parent;
- paste structure;
- paste style only;
- internal clipboard;
- sanitized external structured paste;
- paste preview;
- unsupported-element fallback;
- bulk style change;
- bulk delete;
- bulk move;
- bulk duplicate.

---

## 10. History / Recovery / Save

History:
- undo;
- redo;
- grouped transactions;
- drag/resize throttling;
- typing throttling;
- entry preview;
- restore entry;
- branch history kezelése;
- history limit;
- internal action exclusion.

Persistence:
- manual save;
- autosave;
- debounce;
- save queue;
- duplicate-save protection;
- retry;
- timeout handling;
- revision/ETag conflict detection;
- merge/reload/overwrite policy;
- local recovery snapshot;
- crash recovery;
- recovery cleanup;
- multi-tab detection.

---

## 11. Responsive rendszer

- desktop;
- tablet;
- mobile;
- custom viewport;
- orientation;
- custom breakpoint;
- inherited values;
- explicit override;
- reset override;
- width/height/padding/margin/gap;
- typography;
- display;
- position;
- alignment;
- visibility;
- order;
- flex/grid;
- image crop;
- container/max-width.

A Page Model tárolja az alapértéket és a breakpointonkénti override-okat. A renderer ugyanebből az adatból dolgozik.

---

## 12. Interaction system

- click;
- hover;
- focus;
- enter/leave;
- submit;
- scroll;
- load;
- timer;
- open/close modal;
- navigation;
- anchor;
- show/hide;
- toggle;
- state change;
- animation trigger;
- event validation;
- action chaining;
- cooldown/debounce ahol releváns.

---

## 13. Data binding / dynamic content

A statikus szöveg mellett támogatni kell strukturált adatforrást:
- D1 domain data;
- API data;
- Twitch;
- YouTube;
- TikTok, ha API engedi;
- Discord/integration data;
- schedule;
- site settings;
- dynamic collections.

Támogatott állapotok:
- loading;
- success;
- empty;
- error;
- conditional rendering;
- fallback value.

Példa logikai bindingre: `stream.next.title`, `schedule.next.start`, `twitch.viewerCount`.

---

## 14. Reusable Components / Variants

- component definition;
- component instance;
- master/instance kapcsolat;
- instance override;
- component update;
- detach;
- variants;
- state variants;
- reusable sections;
- reusable header/footer/card/CTA;
- Sanci komponenskönyvtár;
- component versioning;
- compatibility validation;
- component documentation.

---

## 15. Media

R2-alapú media rendszer:
- upload;
- progress;
- cancellation;
- retry;
- resumable strategy ahol szükséges;
- folders;
- search/filter/sort;
- preview;
- image metadata;
- dimensions;
- duration;
- crop/focal point;
- alt text;
- replace;
- delete;
- usage detection;
- orphan detection;
- cleanup;
- bulk operations;
- media variants;
- secure object access.

---

## 16. Accessibility / SEO

Accessibility:
- semantic element mapping;
- ARIA;
- labels;
- alt;
- keyboard navigation;
- focus order;
- contrast warnings;
- reduced motion;
- heading hierarchy;
- form error accessibility;
- screen-reader metadata.

SEO:
- title;
- description;
- canonical;
- Open Graph;
- Twitter/X metadata;
- robots;
- structured data;
- sitemap connection;
- noindex draft/preview.

---

## 17. Templates / Import / Export

- blank page;
- streamer home;
- schedule;
- about;
- contact;
- community;
- VOD;
- support;
- custom template;
- saved template;
- page JSON export/import;
- component export/import;
- site backup/export;
- schema version migration;
- dry-run validation;
- conflict handling.

---

## 18. Validation / Security

A command csak valid Page Model állapotot hozhat létre.

Ellenőrzendő:
- duplicate ID;
- orphan node;
- circular parent;
- invalid nesting;
- invalid component reference;
- invalid binding;
- invalid responsive value;
- invalid style value;
- unsafe HTML;
- size limits;
- permission/RBAC;
- mutation authorization;
- XSS/input filtering;
- audit event.

---

## 19. AI-ready command contract

Minden UI mutationnak legyen strukturált command megfelelője.

Példák:
- `element.add`
- `element.update`
- `element.delete`
- `element.duplicate`
- `element.copy`
- `element.paste`
- `hierarchy.reparent`
- `hierarchy.reorder`
- `group.create`
- `group.ungroup`
- `style.set`
- `responsive.set`
- `binding.set`
- `interaction.set`
- `component.create`
- `component.update`
- `page.create`
- `page.update`
- `page.publish`

A commandnak legyen:
- action ID;
- schema;
- permission check;
- target validation;
- before/after state;
- audit metadata;
- undo/redo lehetőség;
- idempotencia ahol szükséges.

Az AI később ugyanazt a command engine-t használja, nem külön editor logikát.

---

## 20. Tesztelési kötelezettség

Az új editor nem tekinthető késznek attól, hogy a UI megjelenik.

Minimum tesztkategóriák:
1. schema;
2. validation;
3. command;
4. hierarchy;
5. selection;
6. inspector;
7. layout;
8. responsive;
9. history;
10. persistence;
11. recovery;
12. conflict;
13. preview;
14. publish;
15. public renderer;
16. media;
17. accessibility;
18. permissions;
19. mobile;
20. tablet;
21. desktop;
22. regression;
23. performance;
24. large document;
25. invalid document recovery.

### Editor Core Gate — kötelező kézi teszt

1. megnyitás;
2. oldalbetöltés;
3. container létrehozás;
4. heading létrehozás;
5. text létrehozás;
6. text tényleges módosítása;
7. button létrehozás;
8. selection;
9. re-selection;
10. multi-select;
11. group;
12. ungroup;
13. parent-child kapcsolat;
14. reparent;
15. drag/drop;
16. inspector módosítás;
17. responsive módosítás;
18. copy/paste;
19. duplicate;
20. delete;
21. undo;
22. redo;
23. save;
24. reload;
25. D1 ellenőrzés;
26. preview;
27. publish;
28. public renderer;
29. recovery;
30. save retry;
31. conflict detection;
32. permission rejection;
33. invalid schema rejection;
34. mobile;
35. tablet;
36. desktop.

**Egyetlen pont hibája esetén a Core Gate nem teljes.**

---

## 21. Megvalósítási sorrend az új editorhoz

### E0 — Archive / isolation
- [ ] jelenlegi editor archiválva;
- [ ] archive branch ellenőrizve;
- [ ] régi editor nem kerülhet az új runtime-ba.

### E1 — Page Model + schema
- [ ] végleges node/page schema;
- [ ] migration/versioning;
- [ ] validation;
- [ ] test fixtures.

### E2 — State + Command Engine
- [ ] egyetlen state;
- [ ] command registry;
- [ ] validation;
- [ ] history transaction;
- [ ] selection;
- [ ] undo/redo.

### E3 — Hierarchy + Layers
- [ ] parent/children;
- [ ] tree;
- [ ] group;
- [ ] reparent;
- [ ] drag/drop;
- [ ] multi-select.

### E4 — Canvas
- [ ] render;
- [ ] selection overlay;
- [ ] resize;
- [ ] move;
- [ ] snap;
- [ ] zoom.

### E5 — Inspector
- [ ] content;
- [ ] layout;
- [ ] style;
- [ ] responsive;
- [ ] states;
- [ ] accessibility;
- [ ] bindings.

### E6 — Persistence
- [ ] D1;
- [ ] save;
- [ ] autosave;
- [ ] recovery;
- [ ] conflict.

### E7 — Preview/Publish
- [ ] draft;
- [ ] preview;
- [ ] publish;
- [ ] renderer;
- [ ] version.

### E8 — Components/Media
- [ ] reusable components;
- [ ] variants;
- [ ] templates;
- [ ] R2 media.

### E9 — Advanced editor UX
- [ ] command palette;
- [ ] alignment;
- [ ] smart guides;
- [ ] clipboard;
- [ ] import/export;
- [ ] performance.

### E10 — Core Gate
- [ ] teljes 36 pontos kézi teszt;
- [ ] automatikus tesztek;
- [ ] regression;
- [ ] user verification.

**E10 előtt az új editor nem tekinthető késznek.**

---

## 22. Régi editor kezelése

A jelenlegi editor kizárólag referencia/archive állapotban maradhat.

Nem szabad:
- részfunkcióit visszakötni az új editorba;
- legacy stabilizert használni;
- régi groupId hierarchy-t használni;
- régi globális `window.*` editor API-t újra feléleszteni;
- két külön state modellt fenntartani;
- a régi editor hibáit az új editorban foltozni.

Az új editor külön, tiszta modulstruktúrában készül.

---

## 23. Definition of Done — új Visual Editor

A Visual Editor csak akkor `[x]`, ha:
- a Page Model stabil;
- minden mutation commandon keresztül történik;
- nincs párhuzamos hierarchy/state;
- az inspector valóban módosítja a Page Modelt;
- a parent-child kapcsolat ténylegesen működik;
- group/ungroup/reparent működik;
- save/reload D1-ből működik;
- preview/publish/public ugyanabból a modellből működik;
- recovery működik;
- conflict handling működik;
- responsive működik;
- Core Gate 36/36 sikeres;
- regression sikeres;
- user ellenőrizte;
- MASTER megfelelő pontjai `[x]` státuszúak.
