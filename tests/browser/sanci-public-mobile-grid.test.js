import assert from 'node:assert/strict';
import test from 'node:test';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

const root=resolve(import.meta.dirname,'../../public');
const slugs=['home','twitch','videok','schedule','community','about','tiktok','youtube','contact'];
function documentFor(slug){
  // Canonical Page Model with the same nested flex / two-column grid / mobile
  // overrides used in the 9 real SANCI editorial snapshots.
  const nodes={
    root:{id:'root',type:'root',name:'Oldal',parentId:null,children:['outer'],props:{},style:{},responsive:{desktop:{},tablet:{},mobile:{}},metadata:{}},
    outer:{id:'outer',type:'container',parentId:'root',children:['column','tiles'],props:{},style:{maxWidth:'1240px',margin:'0 auto',minWidth:'0',padding:'12px 0 44px'},
      responsive:{desktop:{display:'flex',flexDirection:'column',gap:'16px'},tablet:{display:'flex',flexDirection:'column',gap:'16px'},mobile:{display:'flex',flexDirection:'column',gap:'12px'}},
      metadata:{layoutVersion:1,layoutPresetId:'stack'}},
    column:{id:'column',type:'container',parentId:'outer',children:['eyebrow','headline','copy',...(slug==='schedule'?['schedule-block']:[])],props:{},style:{minWidth:'0',padding:'12px 0',gap:'14px'},
      responsive:{desktop:{display:'flex',flexDirection:'column',gap:'16px'},tablet:{display:'flex',flexDirection:'column',gap:'16px'},mobile:{display:'flex',flexDirection:'column',gap:'12px'}},
      metadata:{layoutVersion:1,layoutPresetId:'stack'}},
    eyebrow:{id:'eyebrow',type:'text',parentId:'column',children:[],props:{text:'HÉTFŐ–VASÁRNAP / EUROPE-BUDAPEST'},style:{fontSize:'11px',letterSpacing:'.16em',color:'#78B8D4'},responsive:{desktop:{},tablet:{},mobile:{}}},
    headline:{id:'headline',type:'heading',parentId:'column',children:[],props:{text:slug==='schedule'?'HETI MENETREND.':'SANCI — '+slug.toUpperCase(),level:1},style:{maxWidth:'850px',fontSize:'clamp(36px,5.5vw,66px)',lineHeight:'1.14',color:'#F5F7FB'},responsive:{desktop:{},tablet:{},mobile:{fontSize:'clamp(35px,9vw,47px)'}}},
    copy:{id:'copy',type:'text',parentId:'column',children:[],props:{text:'Válassz hetet a nyilakkal. Az időpontok magyarországi idő szerint jelennek meg; minden szövegnek olvashatónak kell maradnia mobilon.'},style:{fontSize:'16px',lineHeight:'1.7',maxWidth:'790px',overflowWrap:'anywhere'},responsive:{desktop:{},tablet:{},mobile:{}}},
    tiles:{id:'tiles',type:'container',parentId:'outer',children:['tile-text'],props:{},style:{width:'100%',minWidth:'0'},
      responsive:{desktop:{display:'grid',gridTemplateColumns:'minmax(0,1.1fr) minmax(0,.9fr)',gap:'28px'},tablet:{display:'grid',gridTemplateColumns:'minmax(0,1fr)',gap:'16px'},mobile:{display:'grid',gridTemplateColumns:'1fr',gap:'16px'}},
      metadata:{layoutVersion:1,layoutPresetId:'grid'}},
    'tile-text':{id:'tile-text',type:'text',parentId:'tiles',children:[],props:{text:'Reszponzív SANCI márka: normál, több sorba törő szöveg a tartalmi hasábban.'},style:{fontSize:'17px'},responsive:{desktop:{},tablet:{},mobile:{}}}
  };
  if(slug==='schedule')nodes['schedule-block']={id:'schedule-block',type:'schedule',parentId:'column',children:[],props:{schedule:{
    version:1,mode:'week',limit:50,statuses:['scheduled','live'],platforms:[],order:'asc',showTitle:true,showPlatform:true,showTime:true,showEndTime:true,showStatus:true,showNotes:true,showArtwork:true,showLink:true,emptyText:'Erre a hétre nincs meghirdetett adás.'
  }},style:{width:'100%',maxWidth:'100%',minWidth:'0',padding:'16px'},responsive:{desktop:{},tablet:{},mobile:{}}};
  return {rootId:'root',metadata:{sanciEditorialVersion:1},nodes};
}
test('all nine editorial pages preserve a usable content column at 320-390 px',async t=>{
  const server=createServer(async(req,res)=>{
    const url=new URL(req.url,'http://127.0.0.1');
    if(url.pathname.startsWith('/api/')){
      const slug=url.searchParams.get('slug')||'home';
      const result=url.pathname==='/api/public/pages'?{ok:true,data:{id:slug,slug,title:'SANCI',description:'',content:documentFor(slug)}}:
        url.pathname==='/api/public/schedule'?{ok:true,data:[]}:
        url.pathname==='/api/auth/session'?{ok:true,data:{authenticated:false,user:null}}:
        {ok:true,data:{items:[],siteName:'SANCI9517'}};
      res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'}).end(JSON.stringify(result));return;
    }
    const name=url.pathname.startsWith('/p/')||url.pathname==='/'?'/visual-page.html':url.pathname;
    const file=resolve(root,'.'+name);
    if(!file.startsWith(root+'/'))return res.writeHead(403).end();
    try{
      let bytes=await readFile(file);
      if(name==='/visual-page.html')bytes=Buffer.from(bytes.toString().replace('__SANCI_SHELL__','1'));
      res.writeHead(200,{'Content-Type':{'.html':'text/html','.js':'text/javascript','.css':'text/css'}[extname(file)]||'application/octet-stream'}).end(bytes);
    }catch{res.writeHead(404).end()}
  });
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const browser=await chromium.launch({headless:true,
    executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),
    args:['--no-sandbox']});
  t.after(async()=>{await browser.close();await new Promise(ok=>server.close(ok))});
  const host='http://127.0.0.1:'+server.address().port;
  const page=await browser.newPage({viewport:{width:390,height:850}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [320,390,768,1024,1440]){
    await page.setViewportSize({width,height:850});
    const group=width===390?slugs:width===320?['schedule','home','about']:['schedule','home'];
    for(const slug of group){
      await page.goto(host+'/p/'+slug,{waitUntil:'load'});
      await page.locator('#content-canvas .visual-text').first().waitFor();
      const m=await page.evaluate(()=>{
        const r=x=>document.querySelector(x).getBoundingClientRect();
        return {w:innerWidth,layout:getComputedStyle(document.querySelector('.public-page-layout')).display,
          center:r('.content-page').width,text:r('#content-canvas .visual-text').width,
          grid:r('#content-canvas .visual-layout').width,
          bodyOverflow:document.documentElement.scrollWidth-innerWidth};
      });
      assert.ok(m.center>=width-45,`content collapsed at ${width}px /p/${slug}: ${JSON.stringify(m)}`);
      assert.ok(m.text>=Math.min(240,width-80),`text too narrow at ${width}px /p/${slug}: ${JSON.stringify(m)}`);
      assert.ok(m.bodyOverflow<=3,`horizontal overflow at ${width}px /p/${slug}: ${JSON.stringify(m)}`);
      if(width<=1360)assert.equal(m.layout,'block',`single-column shell required for /p/${slug}`);
    }
  }
  assert.deepEqual(errors,[],'browser emitted no JS errors');
});
