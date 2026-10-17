import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const worker = readFileSync(new URL("../src/index.ts", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../public/admin-home.html", import.meta.url), "utf8");
const loginPage = readFileSync(new URL("../public/admin-login.html", import.meta.url), "utf8");
const adminSettingsRoute = readFileSync(new URL("../src/routes/admin/settings.ts", import.meta.url), "utf8");
const adminPagesRoute = readFileSync(new URL("../src/routes/admin/pages.ts", import.meta.url), "utf8");
const adminScheduleRoute = readFileSync(new URL("../src/routes/admin/schedule.ts", import.meta.url), "utf8");
const adminEditorRoute = readFileSync(new URL("../src/routes/admin/editor.ts", import.meta.url), "utf8");

test("Admin and Editor pages authenticate before serving assets and their APIs enforce roles", () => {
  const adminStart = worker.indexOf('if (pathname === "/admin") {');
  const editorStart = worker.indexOf('if (pathname === "/admin/editor") {');
  assert.ok(adminStart >= 0 && editorStart > adminStart, "Admin and Editor routes must exist in the expected order");
  const adminRouteBlock = worker.slice(adminStart, editorStart);
  const editorRouteBlock = worker.slice(editorStart);
  assert.ok(adminRouteBlock.includes("const user = await getAuthenticatedUser(request, env);"));
  assert.ok(adminRouteBlock.includes('if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);'));
  assert.ok(adminRouteBlock.includes('return env.ASSETS.fetch(assetRequest("/admin-home.html", request));'));
  assert.ok(editorRouteBlock.includes("const user = await getAuthenticatedUser(request, env);"));
  assert.ok(editorRouteBlock.includes('if (!user) return Response.redirect(new URL("/admin/login", request.url).toString(), 302);'));
  assert.ok(editorRouteBlock.includes('return env.ASSETS.fetch(assetRequest("/editor-v2/index.html", request));'));
  assert.ok(adminSettingsRoute.includes('requireSiteGrant(request, env, siteId, "admin")'));
  assert.ok(adminSettingsRoute.includes('if (!hasRole(legacyUser, "admin")) return error("FORBIDDEN", 403, "Admin role required");'));
  assert.ok(worker.includes('adminPagesRoute(request, env, siteId)'));
  assert.ok(adminPagesRoute.includes("requireSiteGrant(request,env,siteId,'editor')"));
  assert.ok(adminPagesRoute.includes("hasRole(legacyUser,'editor')"));
  assert.ok(adminScheduleRoute.includes('if (!hasRole(user, "editor")) return error("FORBIDDEN", 403, "Editor role required");'));
  assert.ok(worker.includes('adminEditorRoute(request, env, siteId)'));
  assert.ok(adminEditorRoute.includes("requireSiteGrant(request,env,siteId,'editor')"));
  assert.ok(adminEditorRoute.includes("hasRole(legacyUser,'editor')"));
});

test("login confirms the new session before navigating to Admin and avoids a redirect loop", () => {
  assert.match(loginPage, /async function waitForAuthenticatedSession\(\)/);
  assert.match(loginPage, /fetch\("\/api\/auth\/session", \{[\s\S]*?credentials: "same-origin",[\s\S]*?cache: "no-store"/);
  assert.match(loginPage, /attempt < 3/);
  assert.match(loginPage, /payload\?\.data\?\.authenticated === true/);
  assert.match(loginPage, /A belépés sikerült, de a munkamenet nem igazolható/);
  assert.match(loginPage, /window\.location\.replace\("\/admin"\)/);
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
  assert.match(dashboard, /if \(event\.key === "Escape"\)\s*\{\s*closeSidebar\(true\);\s*closeMobileSearch\(true\);/);
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
  assert.match(dashboard, /Adásrend frissítése/);
  assert.match(dashboard, /Publikus oldal ellenőrzése/);
  assert.match(dashboard, /id="platformCapabilities"/);
  assert.match(dashboard, /href="#platformCapabilities">Teljes funkciótérkép <span/);
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

test("every dashboard link targets the canonical Admin, Editor, public site, or an existing section", () => {
  const destinations = [...dashboard.matchAll(/\bhref="([^"]+)"/g)].map((match) => match[1]);
  const allowed = new Set(["/admin", "/admin/editor", "/", "#platformCapabilities"]);
  assert.ok(destinations.length > 0, "dashboard must contain navigable destinations");
  for (const destination of destinations) {
    assert.ok(allowed.has(destination), `unexpected dashboard destination: ${destination}`);
  }
  assert.ok(destinations.includes("/admin"), "canonical Admin home link must exist");
  assert.ok(destinations.includes("/admin/editor"), "canonical Editor link must exist");
  assert.ok(destinations.includes("/"), "public site link must exist");
  assert.ok(destinations.includes("#platformCapabilities"), "capability map anchor must exist");
  assert.doesNotMatch(dashboard, /href="\/admin\/home"/, "legacy Admin alias must not be linked from the dashboard");
});

test("every enabled sidebar destination is a canonical, authenticated Admin route", () => {
  const nav = dashboard.match(/<nav class="nav-list"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav, "Admin sidebar navigation must exist");

  const destinations = [...nav.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(destinations.length > 0, "sidebar must expose at least one active destination");
  for (const destination of destinations) {
    assert.ok(
      ["/admin", "/admin/editor"].includes(destination),
      `unexpected active sidebar destination: ${destination}`
    );
  }

  const activeControls = [...nav.matchAll(/<a\b([^>]*)>/g)].map((match) => match[1]);
  assert.ok(activeControls.every((attrs) => /class="nav-item"/.test(attrs)));
  assert.ok(nav.includes('href="/admin" aria-current="page"'));
  assert.match(nav, /href="\/admin\/editor"/);
  assert.match(nav, /<button\b[^>]*disabled[^>]*data-nav-label="Média erőforrások/);
  assert.doesNotMatch(nav, /<button\b(?![^>]*\bdisabled\b)[^>]*data-nav-label=/);
});

test("closing mobile navigation with Escape or backdrop restores toggle focus", () => {
  assert.match(dashboard, /function closeSidebar\(restoreFocus = false\)/);
  assert.match(dashboard, /if \(restoreFocus && wasOpen && window\.matchMedia\("\(max-width: 900px\)"\)\.matches\)\s*\{\s*\$\("mobileMenu"\)\.focus\(\);/);
  assert.match(dashboard, /backdrop\.addEventListener\("click", \(\) => closeSidebar\(true\)\)/);
  assert.match(dashboard, /if \(event\.key === "Escape"\)\s*\{\s*closeSidebar\(true\);\s*closeMobileSearch\(true\);/);
});


test("Admin home uses the full Creator Control Center redesign with operational and planned areas separated", () => {
  for (const fragment of [
    "hero-panel",
    "Építs valami emlékezeteset.",
    "Mai áttekintés",
    "Indítsd el a munkát",
    "Következő adás",
    "Gyors műveletek",
    "id=\"welcomeName\"",
    "id=\"heroSystemState\"",
    "id=\"platformCapabilities\"",
    "workspace-card-muted",
    "F0.1 full Admin Home redesign",
    "prefers-reduced-motion:reduce"
  ]) {
    assert.ok(dashboard.includes(fragment), "missing full Admin redesign feature: " + fragment);
  }
  assert.match(dashboard, /id="welcomeName"[\s\S]*?hero-gradient/);
  assert.match(dashboard, /function loadDashboard\(\)[\s\S]*?Promise\.allSettled/);
  assert.match(dashboard, /if \(\$\("welcomeName"\)\) \$\("welcomeName"\)\.textContent/);
  assert.match(dashboard, /id="heroSystemState"/);
  assert.equal((dashboard.match(/class="capability-card"/g) || []).length, 24);
});
