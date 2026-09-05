(function(){
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const set=(selector,text)=>{const el=document.querySelector(selector);if(el)el.textContent=text};
  const replace=(from,to)=>{const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{if(n.nodeValue.includes(from))n.nodeValue=n.nodeValue.split(from).join(to)})};
  const meta=(description)=>{const el=document.querySelector('meta[name="description"]');if(el)el.setAttribute('content',description)};

  replace('Official Gaming Hub','Hivatalos gaming oldal');
  replace('Stats','Statisztikák');

  if(page==='index.html'){
    set('.premium-tagline','Gaming • Stream • Közösség');
    set('.premium-description','Élő adások, emlékezetes pillanatok és egy közösség, ahová jó visszatérni.');
    meta('SANCI9517 hivatalos oldala – élő streamek, gaming tartalmak és közösség.');
  }

  if(page==='hirek.html'){
    set('.page-header p','Bejelentések, változások és a közösség fontosabb újdonságai.');
    set('.featured h2','🎮 A SANCI9517 oldal folyamatosan fejlődik');
    set('.featured p','Egy helyen találod a streameket, a menetrendet, a klipeket, a játékokat és a közösségi tartalmakat.');
    set('.news-list .news-card:nth-child(3) p','A követői mérföldkövek aktuális állását itt követheted.');
    meta('SANCI9517 hírek, streambejelentések és közösségi újdonságok.');
  }

  if(page==='szavazas.html'){
    set('.page-header p','Te döntöd el, melyik játék kerüljön a következő streambe.');
    set('.poll-title p','Válaszd ki, mit nézzünk és játsszunk legközelebb.');
    set('.support-box p','Beszélgess a közösséggel, és mondd el, melyik játékot látnád szívesen a következő adásban.');
    meta('SANCI9517 közösségi szavazás – döntsd el, mi legyen a következő streamen.');
  }

  if(page==='clips.html'){
    set('.page-header p','A legjobb SANCI9517 pillanatok egy helyen, közvetlenül a Twitchről.');
    set('.clip-hero p','Nyisd meg a Twitch klipgyűjteményt, és válogass a legviccesebb, legizgalmasabb pillanatokból.');
    set('.tip','💡 Tipp: Ha látsz egy jó pillanatot stream közben, készíts róla Twitch-klipet, hogy mások is könnyen megtalálják.');
    meta('SANCI9517 Twitch klipek és emlékezetes stream pillanatok.');
  }

  if(page==='menetrend.html'){
    set('.page-header p','Itt találod a következő élő adások időpontjait.');
    set('section[style*="margin-top:40px"] h2','📅 Heti streammenetrend');
    set('.support-box h2','Ne maradj le az élő adásról');
    set('.support-box p','Kövesd a csatornát Twitch-en, és kapj értesítést, amikor élőbe megyek.');
    meta('SANCI9517 heti streammenetrend és a következő élő adás visszaszámlálója.');
  }

  if(page==='twitch.html'){
    set('.stream-head p','Az élő adás, a chat és a közvetítés legfontosabb adatai egy helyen.');
    set('.chat-head span','Csatlakozz a beszélgetéshez');
    meta('SANCI9517 élő Twitch stream, chat és aktuális közvetítési adatok.');
  }

  if(page==='games.html'){
    set('.page-header p','A csatorna fő játékai és a hozzájuk kapcsolódó tartalmak.');
    set('.game-feature p','Meccsek, kihívások és közösségi játékok. A Fortnite a csatorna egyik fő játéka.');
    set('.game-card:nth-child(1) p','Paklik, meccsek és stratégiai játék. A Hearthstone a csatorna egyik fő tartalma.');
    set('.game-card:nth-child(2) p','Új játékok és tartalmak esetén a hírekben és a menetrendben találod a friss információkat.');
    replace('Community','Közösség');
    replace('Decks','Paklik');
    replace('Ranked','Rangsorolt');
    meta('SANCI9517 játékok: Fortnite és Hearthstone tartalmak.');
  }

  if(page==='milestones.html'){
    set('.page-header p','A SANCI9517 közösségi mérföldkövei és követői céljai.');
    replace('Nagy közösség','Közösségi mérföldkő');
    replace('10 000 követő','Tízezer követő');
    meta('SANCI9517 közösségi mérföldkövek és követői célok.');
  }

  if(page==='stats.html'){
    set('.stats-hero-copy p','A csatorna legfontosabb aktuális adatai és követői mérföldkövei.');
    set('.section-note','Válassz egy mérföldkövet és kövesd a haladást.');
    meta('SANCI9517 aktuális Twitch statisztikák és követői mérföldkövek.');
  }

  if(page==='setup.html'){
    set('.page-header p','A SANCI9517 gaming- és streamingrendszerének bemutatása.');
    set('.setup-hero p','A bemutatott gaming- és streaminggép főbb adatai.');
    set('.section-title:nth-of-type(1) h2','Műszaki adatok');
    set('.section-title:nth-of-type(2) h2','Játék és stream');
    meta('SANCI9517 streaming setup és gaming hardver.');
  }

  if(page==='partners.html'){
    replace('PARTNERSHIPS','PARTNERSÉG');
    replace('CREATOR','TARTALOM');
    replace('COMMUNITY','KÖZÖSSÉG');
    replace('LONG TERM','HOSSZÚ TÁV');
    replace('PARTNERSHIP OPTIONS','EGYÜTTMŰKÖDÉS');
    set('.page-header p','Átlátható együttműködési lehetőségek gaming és streaming témában.');
    set('.support-box p','Gaming hardver, perifériák, szoftverek, szolgáltatások, kampányok és hosszabb távú creator-együttműködések.');
    meta('SANCI9517 partnerség és együttműködés gaming és streaming témában.');
  }

  if(page==='discord.html'){
    set('.page-header p','Discord, Twitch és a rövid tartalmak – minden közösségi felület egy helyen.');
    set('.card:nth-child(1) p','Beszélgetések, közös programok és értesítések az élő adásokról.');
    set('.card:nth-child(2) p','Élő közvetítések, gaming tartalmak és közös pillanatok.');
    set('.card:nth-child(3) p','Rövid videók, legjobb pillanatok és kiemelt tartalmak.');
    meta('SANCI9517 közösségi felületei: Discord, Twitch és TikTok.');
  }

  if(page==='kapcsolat.html'){
    set('.page-header p','Általános kérdésekhez, üzleti megkeresésekhez és együttműködéshez.');
    set('.card:nth-child(2) p','Szponzorációs és együttműködési lehetőségek.');
    meta('SANCI9517 kapcsolatfelvétel, üzleti megkeresések és együttműködés.');
  }

  if(page==='tamogatas.html'){
    set('.support-hero p','A cél egy erős közösség és egy folyamatosan fejlődő, egyre jobb stream.');
    set('.support-community-card:first-child p','Twitch, Discord és közös játékok – egy közösség, ahol nem csak néző vagy.');
    set('.support-community-card.accent p','Nézd az adást, beszélgess, játssz velünk, és építsük tovább együtt.');
    set('.support-vision p','A technikai fejlesztések mindig a jobb adást és a közösségi élményt szolgálják.');
    set('.support-section-title:nth-of-type(2) p','A támogatás önkéntes. Minden segítség a csatorna és a közösség fejlődését szolgálja.');
    meta('A SANCI9517 közösségének fejlődése és önkéntes támogatási lehetőségei.');
  }

  // Site-wide visitor counter: every page contributes to one shared counter.
  const counterNs='sanci9517.github.io';
  const counterKey='site';
  const counterUrl='https://counterapi.com/api/'+encodeURIComponent(counterNs)+'/view/'+encodeURIComponent(counterKey);
  const loadVisitorCounter=()=>{
    if(!document.body)return;
    const img=document.createElement('img');
    img.src=counterUrl+'?invisible=true&noLink=true&noCss=true&cb='+(Date.now());
    img.alt='';
    img.width=1;img.height=1;
    img.style.cssText='position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px';
    img.setAttribute('aria-hidden','true');
    document.body.appendChild(img);
  };
  loadVisitorCounter();

  if(page==='index.html'){
    const mount=()=>{
      if(document.getElementById('sanciVisitorCard'))return;
      const target=document.querySelector('.home-live')||document.querySelector('.premium-links')||document.querySelector('main');
      if(!target)return;
      const card=document.createElement('div');
      card.id='sanciVisitorCard';
      card.className='sanci-visitor-card';
      card.innerHTML='<div class="sanci-visitor-icon">◉</div><div><span>LÁTOGATÓK</span><strong id="sanciVisitorCount">—</strong><small>összes oldalmegtekintés</small></div>';
      target.parentNode.insertBefore(card,target.nextSibling);
      const style=document.createElement('style');
      style.textContent='.sanci-visitor-card{width:min(1240px,calc(100% - 80px));margin:20px auto 0;box-sizing:border-box;display:flex;align-items:center;gap:16px;padding:18px 22px;border:1px solid rgba(167,139,250,.18);border-radius:16px;background:linear-gradient(135deg,rgba(17,17,22,.96),rgba(13,10,19,.96));box-shadow:0 16px 45px rgba(0,0,0,.24)}.sanci-visitor-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:50%;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.28);color:#a78bfa;font-size:18px}.sanci-visitor-card span{display:block;color:#9b95a5;font-size:9px;font-weight:900;letter-spacing:1.8px}.sanci-visitor-card strong{display:block;margin-top:3px;color:#fff;font-size:25px;line-height:1.1}.sanci-visitor-card small{display:block;margin-top:3px;color:#77717f;font-size:10px}@media(max-width:760px){.sanci-visitor-card{width:calc(100% - 28px);padding:16px 18px;margin-top:14px}.sanci-visitor-card strong{font-size:22px}}@media(max-width:430px){.sanci-visitor-card{width:calc(100% - 20px)}}';
      document.head.appendChild(style);
      fetch(counterUrl+'?noLink=true&noCss=true&cb='+(Date.now()),{cache:'no-store'}).then(r=>r.json()).then(data=>{const el=document.getElementById('sanciVisitorCount');if(el&&data&&typeof data.value!=='undefined')el.textContent=Number(data.value).toLocaleString('hu-HU')}).catch(()=>{});
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else setTimeout(mount,0);
  }
})();