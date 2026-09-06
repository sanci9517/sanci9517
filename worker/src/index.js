const cors={
  'access-control-allow-origin':'*',
  'access-control-allow-methods':'GET,OPTIONS',
  'access-control-allow-headers':'content-type,authorization',
};

const json=(data,status=200)=>new Response(JSON.stringify(data),{
  status,
  headers:{'content-type':'application/json; charset=utf-8',...cors}
});

let cachedToken=null;
let cachedTokenExpiresAt=0;

async function twitchToken(env){
  const now=Date.now();
  if(cachedToken&&cachedTokenExpiresAt>now+60000)return cachedToken;
  if(!env.TWITCH_CLIENT_ID||!env.TWITCH_CLIENT_SECRET)return null;

  const body=new URLSearchParams({
    client_id:env.TWITCH_CLIENT_ID,
    client_secret:env.TWITCH_CLIENT_SECRET,
    grant_type:'client_credentials'
  });

  const r=await fetch('https://id.twitch.tv/oauth2/token',{
    method:'POST',
    headers:{'content-type':'application/x-www-form-urlencoded'},
    body
  });

  if(!r.ok)throw new Error('Twitch token error');
  const data=await r.json();
  cachedToken=data.access_token;
  cachedTokenExpiresAt=now+(Number(data.expires_in)||3600)*1000;
  return cachedToken;
}

async function getTwitchStats(env){
  const token=await twitchToken(env);
  if(!token)throw new Error('Twitch credentials are not configured');

  const r=await fetch('https://api.twitch.tv/helix/streams?user_login=sanci9517',{
    headers:{
      'Client-ID':env.TWITCH_CLIENT_ID,
      'Authorization':`Bearer ${token}`
    }
  });

  if(!r.ok)throw new Error('Twitch API error');
  const data=await r.json();
  const stream=data.data?.[0];

  return {
    ok:true,
    configured:true,
    live:Boolean(stream),
    game:stream?.game_name||null,
    viewers:stream?.viewer_count??0,
    title:stream?.title||null,
    started_at:stream?.started_at||null,
    checked_at:new Date().toISOString()
  };
}

export default{async fetch(request,env){
  const url=new URL(request.url);

  if(request.method==='OPTIONS'){
    return new Response(null,{status:204,headers:cors});
  }

  if(url.pathname==='/health'&&request.method==='GET'){
    return json({
      ok:true,
      service:'sanci9517-api',
      twitch_configured:Boolean(env.TWITCH_CLIENT_ID&&env.TWITCH_CLIENT_SECRET)
    });
  }

  if(url.pathname==='/twitch/stats'&&request.method==='GET'){
    if(!env.TWITCH_CLIENT_ID||!env.TWITCH_CLIENT_SECRET){
      return json({
        ok:false,
        configured:false,
        live:false,
        error:'Twitch credentials are not configured'
      },503);
    }

    try{
      return json(await getTwitchStats(env));
    }catch(error){
      return json({
        ok:false,
        configured:true,
        live:false,
        error:'Twitch connection error'
      },502);
    }
  }

  return json({ok:false,error:'Not found'},404);
}};
