const cors={
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET,OPTIONS',
  'access-control-allow-headers':'content-type,authorization',
};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8',...cors}});

async function twitchToken(env){
  if(!env.TWITCH_CLIENT_ID||!env.TWITCH_CLIENT_SECRET)return null;
  const body=new URLSearchParams({client_id:env.TWITCH_CLIENT_ID,client_secret:env.TWITCH_CLIENT_SECRET,grant_type:'client_credentials'});
  const r=await fetch('https://id.twitch.tv/oauth2/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});
  if(!r.ok)throw new Error('Twitch token error');
  return (await r.json()).access_token;
}

export default{async fetch(request,env){
  const url=new URL(request.url);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(url.pathname==='/health')return json({ok:true,service:'sanci9517-api'});
  if(url.pathname==='/twitch/stats'&&request.method==='GET'){
    if(!env.TWITCH_CLIENT_ID||!env.TWITCH_CLIENT_SECRET)return json({ok:false,configured:false,live:false,error:'Twitch API nincs konfigurálva'},503);
    try{
      const token=await twitchToken(env);
      const r=await fetch('https://api.twitch.tv/helix/streams?user_login=sanci9517',{headers:{'Client-ID':env.TWITCH_CLIENT_ID,'Authorization':`Bearer ${token}`}});
      if(!r.ok)return json({ok:false,error:'Twitch API hiba'},502);
      const d=await r.json();const stream=d.data?.[0];
      return json({ok:true,configured:true,live:Boolean(stream),game:stream?.game_name||null,viewers:stream?.viewer_count??null,title:stream?.title||null,started_at:stream?.started_at||null,checked_at:new Date().toISOString()});
    }catch(e){return json({ok:false,configured:true,live:false,error:'Twitch kapcsolat hiba'},502)}
  }
  return json({ok:false,error:'Not found'},404);
}};