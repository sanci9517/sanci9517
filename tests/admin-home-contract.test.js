import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const worker = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../public/admin-home.html", import.meta.url), "utf8");

test("Admin entry authenticates before routing to the dashboard", () => {
  assert.match(
    worker,
    /if \(pathname === "\/admin" \|\| pathname === "\/admin\.html"\) \{\s*const user = await getAuthenticatedUser\(request, env\);\s*if \(!user\) return Response\.redirect\(new URL\("\/admin\/login", request\.url\)\.toString\(\), 302\);\s*return Response\.redirect\(new URL\("\/admin\/home", request\.url\)\.toString\(\), 302\);/
  );
});

test("dashboard route and direct asset path are authenticated", () => {
  assert.match(
    worker,
    /if \(pathname === "\/admin\/home" \|\| pathname === "\/admin-home\.html"\) \{\s*const user = await getAuthenticatedUser\(request, env\);\s*if \(!user\) return Response\.redirect\(new URL\("\/admin\/login", request\.url\)\.toString\(\), 302\);\s*return env\.ASSETS\.fetch\(assetRequest\("\/admin-home\.html", request\)\);/
  );
});

test("canonical Visual Editor v2 route remains available separately", () => {
  assert.match(
    worker,
    /if \(pathname === "\/admin\/editor"\) \{\s*const user = await getAuthenticatedUser\(request, env\);\s*if \(!user\) return Response\.redirect\(new URL\("\/admin\/login", request\.url\)\.toString\(\), 302\);\s*return env\.ASSETS\.fetch\(assetRequest\("\/editor-v2\/index\.html", request\)\);/
  );
});

test("dashboard reads real canonical APIs instead of hard-coded creator metrics", () => {
  for (const endpoint of [
    "/api/auth/session",
    "/api/admin/settings",
    "/api/admin/pages?meta=1",
    "/api/admin/schedule",
    "/api/integrations/twitch/connection"
  ]) {
    assert.ok(dashboard.includes(endpoint), `missing dashboard data source: ${endpoint}`);
  }
  assert.match(dashboard, /Promise\.allSettled/);
  assert.match(dashboard, /nem talál ki időpontot/i);
  assert.match(dashboard, /A provider állapota nem érhető el/);
});

test("dashboard offers a purple-accented light/dark theme toggle", () => {
  assert.match(dashboard, /id="themeToggle"/);
  assert.match(dashboard, /data-theme="light"/);
  assert.match(dashboard, /sanci9517-admin-theme/);
  assert.match(dashboard, /--accent: #c5a0ff/);
});

test("dashboard keeps planned Creator OS areas discoverable", () => {
  for (const area of ["Design Studio", "Stream Studio", "Publikálás", "Közösség", "Analitika", "Üzlet és tagság", "Automatizálás", "VOD és rövid videók", "AI-asszisztens", "Nyelvek és lokalizáció", "Fejlesztői eszközök"]) {
    assert.ok(dashboard.includes(area), `missing planned module: ${area}`);
  }
});

test("mobile users can open and close the same capability search", () => {
  assert.match(dashboard, /id="mobileSearch"[^>]*aria-expanded="false"[^>]*aria-controls="searchWrap"/);
  assert.match(dashboard, /id="searchWrap"/);
  assert.match(dashboard, /@media \(max-width: 600px\)[\s\S]*?\.search-wrap \{ display: none; \}/);
  assert.match(dashboard, /\.search-wrap\.mobile-search-open\s*\{[^}]*display: block;[^}]*position:\s*absolute/);
  assert.match(dashboard, /mobileSearch\.addEventListener\("click"/);
  assert.match(dashboard, /if \(event\.key === "Escape"\)\s*\{\s*closeSidebar\(\);\s*closeMobileSearch\(true\);/);
  assert.match(dashboard, /if \(restoreFocus && wasOpen && window\.matchMedia\("\(max-width: 600px\)"\)\.matches\)\s*\{\s*mobileSearch\.focus\(\);/);
  assert.match(dashboard, /else mobileSearch\.focus\(\);/);
});

test("dashboard visually separates surfaces and navigation groups", () => {
  assert.match(dashboard, /\.nav-label\s*\{[^}]*border-top:\s*1px solid var\(--line\)/);
  assert.match(dashboard, /\.metric-card\s*\{\s*border-top:\s*3px solid var\(--accent-strong\)/);
  assert.match(dashboard, /\.panel,\s*\.module-card\s*\{[^}]*border:\s*1px solid var\(--line-strong\)/);
  assert.match(dashboard, /\.action-card\s*\{[^}]*border:\s*1px solid var\(--line\)/);
});

test("dashboard is an operational workspace with the complete Creator Platform capability map", () => {
  assert.match(dashboard, /<h2>Gyors műveletek<\/h2>/);
  assert.match(dashboard, /aria-label="Gyors műveletek"/);
  assert.match(dashboard, /Weboldal szerkesztése/);
  assert.match(dashboard, /Adásrend kezelése/);
  assert.match(dashboard, /Publikus webhely ellenőrzése/);
  assert.match(dashboard, /id="platformCapabilities"/);
  assert.match(dashboard, /href="#platformCapabilities">Teljes funkciótérkép<\/a>/);
  assert.match(dashboard, /Egy alkotói platform\. Minden munkafolyamat/);
  assert.equal((dashboard.match(/class="capability-card"/g) || []).length, 24);
  for (const capability of ["Weboldal és CMS", "Visual Editor v2", "Design Studio", "Média- és erőforráskönyvtár", "Adásrend és játékprofilok", "Stream Studio és OBS", "VOD, klipek és Shorts", "Publikálási központ", "Twitch-integráció", "YouTube, TikTok és Discord", "Közösségi központ", "Közönség és e-mail", "Analitika és riportok", "AI Creator Copilot", "Webshop, merch és tagság", "Automatizálás és workflow", "Csapatok és több webhely", "Biztonság és helyreállítás", "Nyelvek, SEO és hozzáférhetőség", "Fejlesztői eszközök és piactér", "Dinamikus adatok és adatbinding", "Űrlapok és interakciók", "Publikálás és verziókezelés", "Tartalommodellek és bővíthető blokkok"]) {
    assert.ok(dashboard.includes(capability), "missing capability: " + capability);
  }
  assert.doesNotMatch(dashboard, /class="catalog-card"/);
  assert.match(dashboard, /A „Tervezett” és „Későbbi” elemek nem aktív funkciók/);
});

test("dashboard centers all action controls on both axes and preserves readable navigation", () => {
  assert.match(dashboard, /\.welcome-row \{ flex-direction: column; align-items: center; text-align: center; \}/);
  assert.match(dashboard, /\.section-heading \{ justify-content: center; text-align: center; \}/);
  assert.match(dashboard, /\.metric-card \{ text-align: center; \}/);
  assert.match(dashboard, /\.action-card \{ align-items: center; flex-direction: column; text-align: center; \}/);
  assert.match(dashboard, /\.module-list \.module-card \{ text-align: left; \}/);
  assert.match(dashboard, /\.module-copy \{ text-align: left; \}/);
  assert.match(dashboard, /\.btn,\.small-btn,\.logout,\.icon-action,\.theme-toggle,\.action-copy a,\.capability-cta \{ display:inline-flex; align-items:center; justify-content:center/);
  assert.match(dashboard, /\.nav-item \{ justify-content:flex-start; text-align:left; \}/);
  assert.match(dashboard, /document\.querySelectorAll\("\[data-capability-search\]"\)/);
  assert.ok(dashboard.includes(".mobile-menu { place-items:center; text-align:center; }"));
});

test("dashboard includes responsive, keyboard and reduced-motion affordances", () => {
  assert.match(dashboard, /@media \(max-width: 900px\)/);
  assert.match(dashboard, /@media \(max-width: 600px\)/);
  assert.match(dashboard, /prefers-reduced-motion: reduce/);
  assert.match(dashboard, /:focus-visible/);
  assert.match(dashboard, /aria-label="Admin navigáció"/);
  assert.match(dashboard, /aria-live="polite"/);
});

test("future modules are visibly disabled rather than presented as implemented", () => {
  assert.match(dashboard, /disabled data-nav-label="Média erőforrások/);
  assert.match(dashboard, /disabled data-nav-label="Publikálás/);
  assert.match(dashboard, /disabled data-nav-label="Analitika/);
  assert.match(dashboard, /Tervezett/);
});
