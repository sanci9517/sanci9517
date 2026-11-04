import assert from 'node:assert/strict';
import test from 'node:test';
import {DEFAULT_LEFT_TAB_ORDER,LEGACY_WORKSPACE_PREFERENCES_KEY,WORKSPACE_PROFILE_MAX_BYTES,WORKSPACE_PREFERENCES_KEY,WORKSPACE_PREFERENCE_DEFAULTS,isAccessibleWorkspaceAccent,mountWorkspaceAppearance,normalizeLeftTabOrder,normalizeWorkspacePreferences,parseWorkspaceProfileTransfer,readWorkspacePreferences,serializeWorkspaceProfile} from '../public/editor-v2/ui/workspace-appearance.js';

function storage(initial={}){
  const values=new Map(Object.entries(initial));
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),values};
}

test('workspace preferences are versioned, separate from page content and tolerate malformed local storage',()=>{
  const current=storage({[LEGACY_WORKSPACE_PREFERENCES_KEY]:JSON.stringify({version:1,layout:'inspector',theme:'aurora',density:'compact',accent:'#00a7c8'})});
  assert.deepEqual(readWorkspacePreferences(current),{version:2,layout:'inspector',theme:'aurora',density:'compact',accent:'#00a7c8',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right',profiles:[]});
  assert.deepEqual(readWorkspacePreferences(storage({[WORKSPACE_PREFERENCES_KEY]:'{broken'})),WORKSPACE_PREFERENCE_DEFAULTS);
  assert.deepEqual(normalizeWorkspacePreferences({layout:'unexpected',theme:'url(javascript:alert(1))',density:'tiny',accent:'red'}),WORKSPACE_PREFERENCE_DEFAULTS);
  assert.deepEqual([...current.values.keys()],[LEGACY_WORKSPACE_PREFERENCES_KEY],'legacy presentation data remains intact while the next edit can migrate it');
});

test('curated workspace designs are allowlisted and remain compatible with saved profiles',()=>{
  const themes=['graphite','aurora','ocean','sage','cinder'];
  for(const theme of themes){
    assert.equal(normalizeWorkspacePreferences({theme}).theme,theme);
    const preferences=normalizeWorkspacePreferences({profiles:[{id:'profile-'+theme,name:theme,appearance:{theme}}]});
    assert.equal(preferences.profiles[0].appearance.theme,theme);
  }
  assert.equal(normalizeWorkspacePreferences({theme:'url(javascript:alert(1))'}).theme,'graphite');
  for(const accent of ['#5b8cff','#00a7c8'])assert.equal(isAccessibleWorkspaceAccent(accent),true,accent+' remains visible with every design');
});

test('dock position and saved profiles are bounded, inert data and safe to restore',()=>{
  const normalized=normalizeWorkspacePreferences({dockOrder:'right-canvas-left',profiles:[
    {id:'profile-one',name:' Creator ',appearance:{layout:'balanced',theme:'aurora',accent:'#00a7c8'},dock:{leftOpen:true,rightOpen:true,leftTab:'layers',inspectorTab:'advanced',leftWidth:999,rightWidth:290},customCss:'body{display:none}',script:'alert(1)'},
    {id:'profile-one',name:'Duplicate id'},
    {id:'profile-two',name:'creator'},
    {id:'bad id',name:'Invalid id'},
  ]});
  assert.equal(normalized.version,2);
  assert.equal(normalized.dockOrder,'right-canvas-left');
  assert.deepEqual(normalized.profiles,[{id:'profile-one',name:'Creator',createdAt:0,appearance:{layout:'balanced',theme:'aurora',density:'comfortable',accent:'#00a7c8',dockOrder:'left-canvas-right',panelMode:'separate',panelSide:'right'},dock:{leftOpen:true,rightOpen:true,leftTab:'layers',leftTabOrder:DEFAULT_LEFT_TAB_ORDER,inspectorTab:'advanced',panelActive:'left',leftWidth:460,rightWidth:290}}]);
  assert.equal('customCss' in normalized.profiles[0],false);
  assert.equal('script' in normalized.profiles[0],false);
  assert.equal(normalizeWorkspacePreferences({dockOrder:'left-center-right'}).dockOrder,'left-canvas-right','unknown docking expressions cannot reach CSS');
  const limited=normalizeWorkspacePreferences({profiles:Array.from({length:12},(_,index)=>({id:`profile-${index}`,name:`Profil ${index}`}))});
  assert.equal(limited.profiles.length,8,'profile storage has a fixed eight-item bound');
});

test('panel grouping accepts only safe layout modes and sides, including in portable workspace profiles',()=>{
  const safe=normalizeWorkspacePreferences({panelMode:'tabbed',panelSide:'left',profiles:[{id:'profile-tabbed',name:'Tabbed',appearance:{panelMode:'tabbed',panelSide:'left'},dock:{panelActive:'right'}}]});
  assert.equal(safe.panelMode,'tabbed');
  assert.equal(safe.panelSide,'left');
  assert.equal(safe.profiles[0].appearance.panelMode,'tabbed');
  assert.equal(safe.profiles[0].appearance.panelSide,'left');
  assert.equal(safe.profiles[0].dock.panelActive,'right');
  const unsafe=normalizeWorkspacePreferences({panelMode:'overlay',panelSide:'canvas',profiles:[{id:'profile-unsafe',name:'Safe fallback',appearance:{panelMode:'float',panelSide:'canvas'},dock:{panelActive:'overlay'}}]});
  assert.equal(unsafe.panelMode,'separate','unrecognized overlay modes never reach the renderer');
  assert.equal(unsafe.panelSide,'right');
  assert.equal(unsafe.profiles[0].appearance.panelMode,'separate');
  assert.equal(unsafe.profiles[0].appearance.panelSide,'right');
  assert.equal(unsafe.profiles[0].dock.panelActive,'left');
  const legacyRightOnly=normalizeWorkspacePreferences({profiles:[{id:'profile-right-only',name:'Jobb panel',dock:{leftOpen:false,rightOpen:true}}]});
  assert.equal(legacyRightOnly.profiles[0].dock.panelActive,'right','legacy profiles with only the right dock open keep that dock visible in tabbed mode');
});

test('left tool ordering keeps a complete unique allowlisted order and fills missing tools safely',()=>{
  assert.deepEqual(normalizeLeftTabOrder(['layers','navigation','layers','<img>']),['layers','navigation','pages','elements','schedule']);
  assert.deepEqual(normalizeLeftTabOrder(['navigation','schedule','layers','elements','pages']),['navigation','schedule','layers','elements','pages']);
  const saved=normalizeWorkspacePreferences({profiles:[{id:'profile-order',name:'Rendező',dock:{leftTabOrder:['schedule','schedule','javascript:alert(1)']}}]});
  assert.deepEqual(saved.profiles[0].dock.leftTabOrder,['schedule','pages','elements','layers','navigation'],'profile data cannot inject a tool or leave existing tools unreachable');
});

test('workspace profile transfer serializes only allowlisted data and rejects malformed, oversized or unsupported payloads',()=>{
  const raw=serializeWorkspaceProfile({id:'profile-original',name:'  Tervezői nézet  ',createdAt:123,appearance:{layout:'balanced',theme:'aurora',density:'compact',accent:'#00a7c8',dockOrder:'right-left-canvas'},dock:{leftOpen:true,rightOpen:true,leftTab:'layers',inspectorTab:'content',leftWidth:350,rightWidth:400},customCss:'body{display:none}',script:'alert(1)'});
  const transfer=JSON.parse(raw);
  assert.deepEqual(Object.keys(transfer).sort(),['kind','profile','version']);
  assert.deepEqual(transfer.profile,{id:'profile-original',name:'Tervezői nézet',createdAt:123,appearance:{layout:'balanced',theme:'aurora',density:'compact',accent:'#00a7c8',dockOrder:'right-left-canvas',panelMode:'separate',panelSide:'right'},dock:{leftOpen:true,rightOpen:true,leftTab:'layers',leftTabOrder:DEFAULT_LEFT_TAB_ORDER,inspectorTab:'content',panelActive:'left',leftWidth:350,rightWidth:400}});
  assert.equal(parseWorkspaceProfileTransfer(raw).name,'Tervezői nézet');
  assert.equal(parseWorkspaceProfileTransfer('{broken'),null);
  assert.equal(parseWorkspaceProfileTransfer(JSON.stringify({...transfer,version:999})),null);
  assert.equal(parseWorkspaceProfileTransfer(' '.repeat(WORKSPACE_PROFILE_MAX_BYTES+1)),null);
  assert.throws(()=>serializeWorkspaceProfile({name:'Invalid profile'}),/valid workspace profile/u);
});

test('custom accent accepts visible hex colors and rejects malformed or low-contrast colors',()=>{
  assert.equal(isAccessibleWorkspaceAccent('#00a7c8'),true);
  assert.equal(isAccessibleWorkspaceAccent('#5b8cff'),true);
  assert.equal(isAccessibleWorkspaceAccent('#111111'),false);
  assert.equal(isAccessibleWorkspaceAccent('red'),false);
  assert.equal(isAccessibleWorkspaceAccent('url(javascript:alert(1))'),false);
});

test('a privacy-blocked local storage getter never prevents the Editor shell from mounting',()=>{
  const documentRef={querySelector:()=>null,defaultView:{get localStorage(){throw new Error('storage denied')}}};
  const root={dataset:{},style:{setProperty(){}}};
  assert.deepEqual(readWorkspacePreferences({getItem(){throw new Error('storage denied')}}),WORKSPACE_PREFERENCE_DEFAULTS);
  assert.doesNotThrow(()=>mountWorkspaceAppearance({documentRef,root}));
});
