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
