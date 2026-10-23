import assert from 'node:assert/strict';
export async function exerciseComposition({page,input,selector,attribute,before,final,posts,restart=false,otherInput,attemptBlocked}){
 const writes=posts.length,read=()=>attribute?page.locator(selector).getAttribute(attribute):page.locator(selector).textContent();
 await input.evaluate(el=>{
  el.focus();window.__compositionField=el;el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='Félkész';
  el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));
 });
 assert.equal(await read(),before,'a composition candidate cannot update the Canvas');
 await page.keyboard.press('Control+s');await page.waitForFunction(()=>document.querySelector('#saveStatus').textContent.includes('Javítsd'));
 for(const action of ['#save','#publish']){await page.locator(action).click();assert.equal(posts.length,writes,'unfinished input cannot reach Save or Publish');}
 assert.equal(await input.evaluate(el=>el===window.__compositionField),true,'blocked actions retain the composing field');
 if(otherInput){await otherInput.focus();await page.keyboard.press('Control+s');assert.equal(posts.length,writes,'focusing another field must not lose the shared composition guard');}
 if(attemptBlocked)await attemptBlocked();

 await input.focus();
 if(restart){
  await input.evaluate(el=>{
   el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));
   el.value='Újabb félkész';el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));
  });
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
  assert.equal(await read(),before,'an old callback cannot commit a newer unfinished composition');
  await page.keyboard.press('Control+s');assert.equal(posts.length,writes);
 }
 const immediate=await input.evaluate((el,{final,selector,attribute})=>{
  el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true,data:final}));el.value=final;el.setSelectionRange(final.length,final.length);
  el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:false,data:final}));
  const mirror=document.querySelector(selector);return attribute?mirror.getAttribute(attribute):mirror.textContent;
 },{final,selector,attribute});
 assert.equal(immediate,before,'the late final input stays pending until the next frame');
 await page.waitForFunction(({selector,attribute,final})=>{
  const el=document.querySelector(selector);return (attribute?el?.getAttribute(attribute):el?.textContent)===final;
 },{selector,attribute,final});
 assert.equal(await input.evaluate(el=>el===window.__compositionField&&el===document.activeElement&&el.selectionStart===el.value.length),true,'finalization keeps DOM identity, focus and caret');
 await page.keyboard.press('Control+z');assert.equal(await read(),before,'one Undo reverts the composition');
 await page.keyboard.press('Control+Shift+z');assert.equal(await read(),final);
 await input.evaluate(el=>{
  el.focus();el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));el.value='Elvetett';
  el.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true}));el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));
  el.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
 });
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
 assert.equal(await input.inputValue(),final);assert.equal(await read(),final,'Escape cancels the candidate and its queued callback');
 assert.equal(await page.locator('#rightDock').evaluate(el=>el.classList.contains('closed')),false);
 assert.equal(posts.length,writes);
}
