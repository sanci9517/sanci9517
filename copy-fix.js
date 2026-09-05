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
})();
