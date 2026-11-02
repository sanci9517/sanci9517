import assert from 'node:assert/strict';
import test from 'node:test';
import {WORKSPACE_PREFERENCES_KEY,WORKSPACE_PREFERENCE_DEFAULTS,isAccessibleWorkspaceAccent,mountWorkspaceAppearance,normalizeWorkspacePreferences,readWorkspacePreferences} from '../public/editor-v2/ui/workspace-appearance.js';

function storage(initial={}){
  const values=new Map(Object.entries(initial));
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),values};
}

test('workspace preferences are versioned, separate from page content and tolerate malformed local storage',()=>{
  const current=storage({[WORKSPACE_PREFERENCES_KEY]:JSON.stringify({version:1,layout:'inspector',theme:'aurora',density:'compact',accent:'#00a7c8'})});
  assert.deepEqual(readWorkspacePreferences(current),{version:1,layout:'inspector',theme:'aurora',density:'compact',accent:'#00a7c8'});
  assert.deepEqual(readWorkspacePreferences(storage({[WORKSPACE_PREFERENCES_KEY]:'{broken'})),WORKSPACE_PREFERENCE_DEFAULTS);
  assert.deepEqual(normalizeWorkspacePreferences({layout:'unexpected',theme:'url(javascript:alert(1))',density:'tiny',accent:'red'}),WORKSPACE_PREFERENCE_DEFAULTS);
  assert.deepEqual([...current.values.keys()],[WORKSPACE_PREFERENCES_KEY],'presentation settings use a dedicated key, not the Page Model draft key');
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
