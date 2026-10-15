# 63.50.92 — Szemantikai ellenőrzési munkalap (bizonyíték, nem második terv)

**Forrás:** `docs/SANCI9517-CREATOR-PLATFORM-PLAN.md`, `v2/foundation`, 54.x követelmények, 63.50.91 lexikai triage. **Állapot:** OPEN / NOT PASS. Ez a fájl az audit forrásjegyzete; a kanonikus terv fejlécének kurzorát és státuszát nem módosítja.

## Az első tíz NO LEXICAL EVIDENCE sor — kézi domainhatár-besorolás

| Forrás-ID | Követelmény | Kanonikus tulajdonos (javaslat, ellenőrizendő) | Többi felület szerepe | Hiányzó bizonyíték |
|---|---|---|---|---|
| 54.3.01 | Logóvariáns, szín, font, ikonstílus, vizuális szabály | Brand Kit / design system | Visual Editor fogyasztja a tokeneket | 24. fejezet megfelelő ID és teljes contract |
| 54.3.05 | SVG/PNG/WebP export és méretek | Brand Kit export szolgáltatás; Asset registry az elkészült fájl gazdája | Editor / publikus web csak használja | Export méretek, transzformáció, licenc, R2/D1 kapcsolat |
| 54.4.02 | Kép, videó, hang, ikon, font, dokumentum, thumbnail, export | Assets / egyetlen resource registry | Content Studio és Editor ID alapján hivatkozik | MIME, biztonság, verzió, tárolás és referenciaéletciklus |
| 54.4.06 | Használati helyek, függőség és biztonságos törlés | Assets / resource dependency graph | Minden fogyasztó referenciát regisztrál | Törlés/archiválás blokkoló és visszaállítási teszt |
| 54.4.07 | Metaadatváltozás minden hivatkozási helyen | Assets / canonical metadata | Felületek ugyanazt az ID-t oldják fel | Cache invalidation, stale/permission tesztek |
| 54.5.06 | Szinkronnapló, utolsó siker/hiba, resync, konfliktus | Integrations / provider sync service | Admin dashboard állapotot olvas | Retry, idempotencia, ownership, hibakezelés |
| 54.5.08 | Nem támogatott funkció és alternatív út | Integrations / provider capability registry | Content/OBS/Automation képesség szerint tilt vagy alternatívát mutat | Provider policy, fallback, jogosultság és UI acceptance |
| 54.6.02 | Streamcím, játék, kezdés, nézőszám és metrikák | Live / provider state; Schedule csak a saját eseményrekordját birtokolja | Public live block és Analytics csak olvas | Provider-freshness, manuális override, ownership |
| 54.6.04 | Egyetlen adásrend: esemény, ismétlődés, időzóna, ütközés | Schedule / schedule_items canonical domain | Editor schedule node csak megjelenít | Recurrence, DST, conflict, CRUD, több felület konzisztencia |
| 54.7.01 | OBS párosítás, auth, reconnect, diagnosztika | Stream Studio / OBS connection service | Integrations menü kapcsolódási pont; nem második OBS-állapot | Credential kezelés, reconnect, támogatott API, negatív tesztek |

**Döntési szabály:** a fenti tulajdonosok előzetes architekturális besorolások, nem igazolt stabil ID-megfeleltetések. Egyetlen sor sem kap PASS-t, amíg a 24., 49., 54. és 63.x releváns forrásmezői, a függőségek és az elfogadási feltételek egyenként össze nem lettek vetve.

## Következő ellenőrzés

A további 31 NO LEXICAL EVIDENCE és 47 AMBIGUOUS CANDIDATES sor ugyanígy ellenőrzendő. Az eltérő részfunkciókat nem szabad egyetlen homályos ID alá elrejteni; ha nincs teljes megfelelőjük, explicit új alfunkció vagy nyitott GAP kerül a **kanonikus** tervbe. A hiányzó 00/A és 00.9.6.B források továbbra is OPEN. A 63.50.46 HIGH publish conflict változatlanul NOT FIXED. Nincs implementációs vagy tervlezárási PASS.

## További 31 NO LEXICAL EVIDENCE sor — előzetes tulajdonosi besorolás

| ID | Követelmény | Javasolt kanonikus tulajdonos | Más modulok kapcsolata | Kötelező ellenőrzés |
|---|---|---|---|---|
| 54.7.11 | OBS plugin/widget registry | Stream Studio / extension registry | Integrations provider credentials; Marketplace discovery only | Manifest, permission, signature, version migration and uninstall |
| 54.7.12 | Natív OBS plugin / desktop companion | Stream Studio / companion lifecycle | Integrations connects, Security audits | Threat model, signed builds, local secrets and revocation |
| 54.8.09 | Platformonkénti publikálási metadata | Content Studio / content publication variants | Integrations supplies provider capability, Web embeds content | Provider-specific schema, draft/export, status reconciliation |
| 54.8.11 | Zene-/videójog és hozzájárulás | Content Studio / rights registry | Assets links source; Publishing enforces rights | Expiration, takedown, consent proof and negative publishing tests |
| 54.9.02 | Közösségi poszt/komment/poll/beküldés | Community / engagement records | Web displays; Moderation governs | Role, abuse, delete/export and audit trail |
| 54.9.03 | Követés, jelvény, kihívás, jutalom | Community / engagement and entitlement | Commerce grants entitlements; Web renders | Eligibility, duplicate reward, fraud and revocation |
| 54.9.07 | AI moderációs javaslat | Community moderation; AI suggestion provider | Moderator approves; AI no silent write | False positive, appeal, audit and opt-out |
| 54.9.09 | Közösségi szabályzat és korhatár | Community policy + Security/privacy governance | Public consent and moderation enforce | Consent version, age gate, retention |
| 54.10.07 | Egyszeri/visszatérő támogatás | Commerce / support payments | OBS alert and Web goal display | Provider settlement, refund, idempotency and permissions |
| 54.10.11 | Bevételi riport, díj, refund, export | Commerce ledger/reporting | Analytics consumes aggregates | Reconciliation, currencies, fees, exports |
| 54.10.12 | Fizetés/adó/számlázás/GDPR megfelelés | Commerce + Security policy | Legal/accounting integrations as approved | Jurisdiction, provider, retention and consumer-rights review |
| 54.11.01 | Platformmetrikák | Analytics / metrics ingest | Integrations source adapters | Permission, unavailable metric, provenance and freshness |
| 54.11.02 | Tartalom- és csatorna-összehasonlítás | Analytics / reporting | Content Studio links content ID | Comparable definitions, periods and missing data |
| 54.11.03 | Adatfrissesség és becsült/valós jelölés | Analytics / metric provenance | Dashboard renders metadata | Timestamp, stale, partial, estimates |
| 54.11.04 | Webanalitika, UTM, SEO, konverzió | Analytics / web events | Web injects permitted tracking | Consent, attribution, bot filtering and privacy |
| 54.11.05 | Thumbnail/cím/időzítés kísérlet | Analytics / experiments | Content Studio configures variants | Sample size, assignment, no false uplift |
| 54.11.07 | AI-elemzés hipotézisekkel | Analytics / insights; AI inference service | Dashboard reviews | Sources, uncertainty, reproducibility |
| 54.12.03 | Automation actions | Automation / action executor | Each domain exposes authorized commands | Idempotency, permissions, dry-run, rollback |
| 54.12.04 | Workflow sablon/verzió/aktiválás | Automation / workflow registry | Marketplace may distribute templates | Version pinning, RBAC, deactivate behavior |
| 54.12.06 | Automation failure/quarantine/recovery | Automation / run state | Ops dashboard observes | Retry, dead-letter, compensation, audit |
| 54.13.02 | Jogosult brand/projekt AI kontextus | SANCI AI / context gateway | Brand Kit and Assets source data | ACL, redaction, citations, retention |
| 54.13.07 | AI Business Analyst | SANCI AI / analysis assistant | Analytics owns metrics | Hypotheses, tests, confidence and approval |
| 54.13.09 | AI kép/hang/videógenerálás | SANCI AI / generation orchestration | Assets stores approved outputs | License, model costs, moderation and consent |
| 54.13.11 | Generált tartalom provenance | SANCI AI / generation metadata | Content Studio displays label | Source, uncertainty, export metadata |
| 54.13.12 | Manuális AI nélküli út | Cross-cutting product requirement | All functional domains provide manual UX | AI outage E2E tests and parity |
| 54.14.02 | Magyar elsődleges és további nyelvek | Localization / locale policy | Admin and Public consume locales | Fallback, coverage and no mixed-language regressions |
| 54.14.05 | Dátum/idő/pénznem lokalizáció | Localization / formatting service | Schedule retains canonical timezone semantics | DST, currency rounding, locale tests |
| 54.14.07 | Fordítási memória/szószedet | Localization / translation registry | AI proposes, editor approves | Version, review, rollback and terminology |
| 54.14.08 | Nyelvváltó és választás megőrzése | Localization / user preference | Admin and Public have separate policy | Consent, persistence, fallback |
| 54.15.11 | WCAG 2.2 AA / reduced motion | Cross-cutting accessibility governance | Every UI surface implements | Keyboard, screen reader, contrast, focus, touch |
| 54.15.12 | Responsive, weak network, offline state | Cross-cutting UX reliability | Editor, Admin, Public individually implement | No data loss, loading/retry, device matrix |

**Összesítés:** a 41 lexikai nulla sor mindegyikéhez elkészült az elsődleges domainhatár-hipotézis. Ez nem bizonyítja, hogy a 396 stabil ID valamelyike teljes egészében lefedi az adott követelményt; egyetlen sor sem PASS. A 47 többértelmű sor következő körben külön, a jelölt ID-k forrásszövegével együtt vizsgálandó.
