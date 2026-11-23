import assert from 'node:assert/strict';
import test from 'node:test';
import {getElementInspectorContract} from '../core/capability-matrix.js';
import {getProperty} from '../core/property-registry.js?v=20261123-edt040-in-view-motion-v1';
import {normalizeInspectorValue} from '../core/property-values.js';
import {STYLE_MAP} from '../core/canvas-engine.js';
import {isAllowlistedMotionStyle,MOTION_TRIGGER_OPTIONS,motionTriggerForStyle} from '../core/motion-style.js';
import {readFileSync} from 'node:fs';

test('EDT-040 motion Inspector is allowlisted, responsive, and mapped to real CSS properties',()=>{
  const expected={
    'motion.entry':['animationName',['none','sanci-entry-fade','sanci-entry-rise','sanci-entry-scale']],
    'motion.duration':['animationDuration',['180ms','280ms','420ms']],
    'motion.easing':['animationTimingFunction',['ease-out','cubic-bezier(0.22,1,0.36,1)']]
  };
  for(const [id,[key,options]] of Object.entries(expected)){
    const property=getProperty(id);
    assert.ok(property,id);
    assert.equal(property.key,key);
    assert.equal(property.group,'animation');
    assert.equal(property.responsive,true);
    assert.equal(property.command,'responsive.set');
    if(id==='motion.entry')assert.equal(property.defaultValue,'none');
    if(id==='motion.duration')assert.equal(property.defaultValue,'280ms');
    if(id==='motion.easing')assert.equal(property.defaultValue,'ease-out');
    assert.deepEqual(property.options,options,id);
    assert.ok(Object.hasOwn(STYLE_MAP,key),`${id} reaches Canvas/public CSS`);
    assert.ok(getElementInspectorContract('heading').fields.some(field=>field.id===id),`${id} is visible in the Inspector`);
    assert.equal(normalizeInspectorValue(property,options.at(-1)),options.at(-1));
    for(const unsafe of ['javascript:alert(1)','sanci-entry-custom','infinite','url(https://evil.example)']){
      if(!options.includes(unsafe))assert.throws(()=>normalizeInspectorValue(property,unsafe),undefined,`${id} rejects ${unsafe}`);
    }
  }
  const trigger=getProperty('motion.trigger');
  assert.ok(trigger);
  assert.equal(trigger.key,'motionTrigger');
  assert.equal(trigger.group,'animation');
  assert.equal(trigger.responsive,true);
  assert.equal(trigger.command,'responsive.set');
  assert.equal(trigger.defaultValue,'on-load');
  assert.deepEqual(trigger.options,MOTION_TRIGGER_OPTIONS);
  assert.deepEqual(trigger.optionLabels,{'on-load':'Betöltéskor','in-view':'Láthatóvá váláskor'});
  assert.ok(getElementInspectorContract('heading').fields.some(field=>field.id==='motion.trigger'));
  assert.equal(normalizeInspectorValue(trigger,'in-view'),'in-view');
  assert.throws(()=>normalizeInspectorValue(trigger,'in-view;display:none'));
  assert.equal(motionTriggerForStyle({motionTrigger:'on-load',animationName:'sanci-entry-rise'}),'');
  assert.equal(motionTriggerForStyle({motionTrigger:'in-view',animationName:'none'}),'');
  assert.equal(motionTriggerForStyle({motionTrigger:'in-view',animationName:'sanci-entry-rise'}),'in-view');
  assert.equal(motionTriggerForStyle({motionTrigger:'in-view',animationName:'sanci-entry-rise;display:none'}),'');
});

test('EDT-040 public and Editor motion CSS is finite and reduced-motion safe',()=>{
  const css=readFileSync(new URL('../editor-motion.css',import.meta.url),'utf8');
  for(const name of ['fade','rise','scale'])assert.match(css,new RegExp(`@keyframes sanci-entry-${name}\\s*\\{`));
  assert.match(css,/animation-iteration-count:\s*1/);
  assert.match(css,/animation-fill-mode:\s*both/);
  assert.match(css,/animation-duration:\s*280ms/);
  assert.match(css,/animation-timing-function:\s*ease-out/);
  assert.match(css,/@supports\s*\(animation-timeline:\s*view\(\)\)\s*and\s*\(animation-range:\s*entry 0% entry 100%\)/);
  assert.match(css,/data-motion-trigger="in-view"[^\{]*\{\s*animation-timeline:\s*view\(\);\s*animation-range:\s*entry 0% entry 100%;/);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css,/animation:\s*none\s*!important/);
  assert.match(css,/opacity:\s*1\s*!important/);
  assert.doesNotMatch(css,/animation-iteration-count:\s*infinite|animation-duration:\s*[^;]+s\s*!important/i);
  assert.equal(isAllowlistedMotionStyle('animationName','sanci-entry-rise'),true);
  assert.equal(isAllowlistedMotionStyle('animationName','sanci-entry-custom'),false);
  assert.equal(isAllowlistedMotionStyle('animationDuration','900ms'),false);
  assert.equal(isAllowlistedMotionStyle('animationTimingFunction','steps(9,end)'),false);
});
