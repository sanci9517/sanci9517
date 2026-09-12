(() => {
  const info = {
    text:['Szöveg','Egyszerű szövegrész elhelyezése az oldalon.'], heading:['Címsor','Nagyobb címsor, például egy oldal vagy szakasz címéhez.'], paragraph:['Bekezdés','Hosszabb normál szöveghez.'], richtext:['Formázott szöveg','Többféle szövegformázást tartalmazó tartalom.'], link:['Hivatkozás','Kattintható link másik oldalra vagy külső webhelyre.'], button:['Gomb','Műveletet vagy hivatkozást indító gomb.'], image:['Kép','Kép megjelenítése az oldalon.'], video:['Videó','Videó beágyazása vagy megjelenítése.'], audio:['Hang','Hanganyag lejátszása.'], icon:['Ikon','Ikon megjelenítése.'], svg:['SVG','Vektoros grafika használata.'], divider:['Elválasztó','Vizuális elválasztó két tartalomrész között.'], spacer:['Térköz','Üres hely létrehozása az elemek között.'], badge:['Címke','Kis jelölő vagy státusz címke.'], avatar:['Profilkép','Profilhoz vagy felhasználóhoz tartozó kép.'], card:['Kártya','Önálló tartalmi kártya címhez, szöveghez vagy más elemekhez.'],
    section:['Szakasz','Az oldal egy nagyobb, önálló tartalmi része.'], container:['Konténer','Tartalom szélességének és elhelyezésének rendezésére.'], row:['Sor','Elemek vízszintes sorba rendezésére.'], columns:['Oszlopok','Több tartalmi oszlop létrehozására.'], grid:['Rács','Tartalom szabályos rácsos elrendezésére.'], stack:['Egymásra rendezés','Elemek függőleges egymás alá rendezésére.'], flex:['Rugalmas elrendezés','Flex alapú, rugalmas elemrendezéshez.'], group:['Csoport','Több elem együttes kezelésére.'],
    list:['Lista','Felsorolás vagy rendezett lista.'], table:['Táblázat','Sorokból és oszlopokból álló adatmegjelenítés.'], tabs:['Fülek','Több tartalomrész közötti váltás fülekkel.'], accordion:['Lenyitható blokk','Tartalom megjelenítése és elrejtése kattintással.'], dropdown:['Lenyíló menü','Opciók vagy további tartalom lenyíló listában.'], breadcrumb:['Morzsamenü','Megmutatja, hol jár a látogató az oldalon.'], pagination:['Lapozás','Több oldalnyi tartalom közötti navigáció.'], search:['Kereső','Keresőmező tartalom vagy oldalak kereséséhez.'], countdown:['Visszaszámláló','Időpontig hátralévő idő kijelzésére.'], progress:['Folyamatjelző','Egy folyamat vagy érték állapotának megjelenítése.'], notification:['Értesítés','Fontos üzenet vagy figyelmeztetés megjelenítése.'], cookie:['Cookie sáv','Cookie-hozzájárulás kezelésére szolgáló sáv.'], modal:['Felugró ablak','Külön felugró ablak fontos tartalomhoz vagy művelethez.'],
    navbar:['Navigációs sáv','Az oldal fő navigációját tartalmazó sáv.'], menu:['Menü','Navigációs menü vagy műveleti menü.'], footer:['Lábléc','Az oldal alsó, közös tartalmi része.'], sidebar:['Oldalsáv','Oldal mellett megjelenő kiegészítő tartalom vagy navigáció.'], backtotop:['Vissza a tetejére','Gomb, amely az oldal tetejére görget.'],
    form:['Űrlap','Felhasználói adatok bekérésére szolgáló űrlap.'], input:['Szövegmező','Egy soros adatbevitel.'], textarea:['Többsoros szövegmező','Hosszabb szöveg megadására.'], checkbox:['Jelölőnégyzet','Egy vagy több válasz kiválasztására.'], radio:['Választógomb','Egymást kizáró lehetőségek közül egy választására.'], select:['Legördülő választó','Előre megadott lehetőségek kiválasztására.'], slider:['Csúszka','Érték kiválasztása csúszkával.'], file:['Fájlfeltöltés','Fájl feltöltésének lehetősége.'], submit:['Küldés gomb','Űrlap elküldésére szolgáló gomb.'],
    gallery:['Galéria','Több kép rendezett megjelenítése.'], carousel:['Képváltó','Tartalmak vagy képek lapozható megjelenítése.'], embed:['Beágyazás','Külső tartalom beágyazása.'], iframe:['Iframe','Külső oldal vagy alkalmazás beillesztése.'], map:['Térkép','Térképes helymegjelenítés.'], code:['HTML / kód','Egyedi HTML vagy kódrészlet beillesztésére.'], socialembed:['Közösségi beágyazás','Közösségi média tartalom beillesztésére.'],
    live:['Twitch élő állapot','Megmutatja, hogy a Twitch-csatorna élőben van-e.'], twitch:['Twitch lejátszó','Twitch-adás lejátszó beillesztése.'], youtube:['YouTube','YouTube-videó vagy csatornatartalom megjelenítése.'], tiktok:['TikTok','TikTok-tartalom megjelenítése vagy beágyazása.'], discord:['Discord','Discord-közösséghez kapcsolódó blokk.'], schedule:['Menetrend','A streamidőpontok és következő adások megjelenítése.'], streamcount:['Stream statisztika','Streamhez kapcsolódó statisztikák megjelenítése.'], followers:['Követők száma','Követőszám megjelenítése.'], subs:['Feliratkozók','Feliratkozói adatok megjelenítése.'], vod:['VOD','Korábbi adások vagy videók megjelenítése.'], support:['Támogatás','Támogatási és adományozási lehetőségek megjelenítése.'], community:['Közösség','Közösségi csatornák és közösségi tartalmak blokkja.'], gamecard:['Játékkártya','Egy játék kiemelt kártyás megjelenítése.'], gamelist:['Játéklista','A játszott vagy tervezett játékok listája.'], calendar:['Stream naptár','A streamidőpontok naptárnézetben.'],
    component:['Komponens','Újrahasználható saját elem vagy elemcsoport.'], repeater:['Ismétlődő lista','Adatok alapján automatikusan ismétlődő elemek.'], query:['Lekérdezés','Dinamikus adatok lekérése és megjelenítése.'], custom:['Egyedi HTML','Teljesen egyedi HTML tartalom.'], customcss:['Egyedi CSS','Az adott oldal vagy elem egyedi stílusának megadása.'], script:['Egyedi JavaScript','Egyedi működéshez használható JavaScript.'], popup:['Felugró ablak','Kattintásra, időzítésre vagy feltételre megjelenő ablak.'], condition:['Feltételes elem','Elem megjelenítése meghatározott feltétel teljesülésekor.']
  };

  const wait = () => {
    document.querySelectorAll('.element[data-add]').forEach(btn => {
      if (btn.dataset.infoReady) return;
      const key = btn.dataset.add;
      const item = info[key];
      if (!item) return;
      btn.dataset.infoReady = '1';
      const span = btn.querySelector('span');
      const small = btn.querySelector('small');
      if (span) span.textContent = item[0];
      if (small) small.textContent = 'elem';
      btn.title = `${item[0]} — ${item[1]}`;
      const i = document.createElement('button');
      i.type = 'button'; i.className = 'element-info'; i.textContent = 'i';
      i.setAttribute('aria-label', `${item[0]} információ`);
      i.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.element-popover').forEach(x => x.remove());
        const p = document.createElement('div');
        p.className = 'element-popover';
        p.innerHTML = `<strong>${item[0]}</strong><p>${item[1]}</p><button type="button">Bezárás</button>`;
        btn.appendChild(p);
        p.querySelector('button').onclick = () => p.remove();
      });
      btn.appendChild(i);
    });
  };

  const style = document.createElement('style');
  style.textContent = `.element{position:relative}.element-info{position:absolute;right:9px;top:50%;transform:translateY(-50%);width:25px;height:25px;border:1px solid currentColor;border-radius:50%;background:transparent;color:inherit;opacity:.8;font-size:14px;line-height:23px;font-weight:700;cursor:pointer;display:grid;place-items:center}.element-info:hover{opacity:1;background:rgba(110,168,254,.12)}.element-popover{position:absolute;z-index:9999;left:calc(100% + 10px);top:0;width:270px;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:#151922;box-shadow:0 12px 30px rgba(0,0,0,.35);color:#fff;text-align:left}.element-popover strong{display:block;margin-bottom:7px;font-size:14px}.element-popover p{margin:0 0 12px;font-size:13px;line-height:1.5;color:#b8c0cc}.element-popover button{border:0;border-radius:6px;padding:7px 10px;background:#2a3140;color:#fff;cursor:pointer;font-size:12px}`;
  document.head.appendChild(style);
  wait();
  new MutationObserver(wait).observe(document.body, {childList:true, subtree:true});
})();
