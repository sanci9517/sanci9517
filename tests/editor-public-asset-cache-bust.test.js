import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'../public/editor-v2');

test('the authenticated media admin entry and retention module request the refreshed cursor behavior',async()=>{
  const [html,entry]=await Promise.all([
    readFile(resolve(import.meta.dirname,'../public/admin-media.html'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/assets/admin-media.js'),'utf8')
  ]);
  const version='20261123-d06-retention-refresh-cursor-v1';
  assert.match(html,new RegExp(`<script type="module" src="/assets/admin-media\\.js\\?v=${version}"></script>`),
    'the protected media-admin HTML must request the cache-keyed entry');
  assert.match(entry,new RegExp(`from "\\./admin-media-retention\\.js\\?v=${version}"`),
    'the cache-keyed entry must request the fixed retention-pagination controller');
});

test('the Editor and public renderer release tokens bust the structured accessibility assets',async()=>{
  const [html,css,publicHtml,publicRenderer]=await Promise.all([
    readFile(resolve(root,'index.html'),'utf8'),
    readFile(resolve(root,'editor-refresh.css'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/visual-page.html'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/assets/page-renderer.js'),'utf8')
  ]);
  assert.match(html,/href="\/editor-v2\/editor-refresh\.css\?v=20261127-d06-form-preview-v1"/,
    'the deployed HTML must request the stylesheet containing the selected Canvas keyboard controls');
  assert.match(css,/\.element-favorite-toggle\s*\{/,
    'the stylesheet referenced by the versioned link must include the palette-favorites UI');
  const recoveryVersion='20261124-edt042-publish-recovery-safe-label-v1';
  const editorEntryVersion='20261125-edt016-child-reference-limit-v1';
  const editorScriptVersion='20261127-d06-conditional-fields-v1';
  const pageInteractionControlsVersion='20261127-edt039-form-submit-controls-v1';
  const editorTreeVersion='20261126-edt007-canvas-pan-v1';
  const trustedFormSubmitVersion='20261127-edt039-form-submit-trusted-v2';
  const mediaPlaybackVersion='20261125-forms-service-v1';
  const publicRendererVersion='20261127-d06-conditional-fields-v1';
  assert.match(html,new RegExp(`src="/editor-v2/app\\.js\\?v=${editorScriptVersion}"`),
    'the deployed entry page must request the active conditional Forms Inspector');
  assert.match(html,new RegExp(`href="/editor-v2/editor\\.css\\?v=${editorTreeVersion}"`),
    'the deployed entry page must request full-width nested tree groups');
  assert.match(html,/src="\/editor-v2\/ui\/shell\.js\?v=20261126-edt007-keyboard-pan-v1"/,
    'the deployed entry page must request the shell with keyboard-pan action help');
  const [shell,actionHelp,actionCatalog]=await Promise.all(['ui/shell.js','ui/action-help.js','ui/action-catalog.js'].map(path=>readFile(resolve(root,path),'utf8')));
  assert.match(shell,/action-help\.js\?v=20261126-edt007-keyboard-pan-v1/);
  assert.match(shell,/action-catalog\.js\?v=20261126-edt007-keyboard-pan-v1/);
  assert.match(actionHelp,/action-catalog\.js\?v=20261126-edt007-keyboard-pan-v1/);
  assert.match(actionCatalog,/Billentyűzettel fókuszáld a vásznat/u);
  const app=await readFile(resolve(root,'app.js'),'utf8');
  assert.match(app,/core\/richtext-import\.js\?v=20261125-edt016-child-reference-limit-v1/,
    'the cache-keyed Editor entry must request the HTML-table no-silent-truncation guard');
  assert.match(app,new RegExp(`core/publication-recovery\\.js\\?v=${recoveryVersion}`),
    'the cache-keyed entry must request the targeted recovery module');
  assert.match(app,/legacyPlaybackSettings\(node\.props,\{video:node\.type===NODE_TYPES\.VIDEO,editor:true,reducedMotion:prefersReducedMotion\(\)\}\)/,
    'the Editor Canvas must honor reduced motion for legacy media');
  assert.match(app,/authoredNodeHtml\(node,\{device:state\.viewport\.device,editor:true,reducedMotion:prefersReducedMotion\(\)\}\)/,
    'the Editor Canvas must honor reduced motion for authored media');
  assert.match(app,new RegExp(`core/schema\\.js\\?v=${editorEntryVersion}`),'the Editor entry must request the cache-busted shared Page Model validator');
  assert.match(app,new RegExp(`core/state\\.js\\?v=${editorEntryVersion}`),'the Editor entry must request state validation using the node-count contract');
  assert.match(app,new RegExp(`core/commands\\.js\\?v=${editorEntryVersion}`),'commands must request the node-count admission guard');
  assert.match(app,new RegExp(`core/editor-templates\\.js\\?v=${editorEntryVersion}`),'templates must use the node-count validation contract');
  for(const path of ['core/state.js','core/commands.js','core/editor-templates.js']){const source=await readFile(resolve(root,path),'utf8');assert.match(source,new RegExp(`validation\\.js\\?v=${editorEntryVersion}`),`${path} must load the refreshed validator`)}
  assert.match(app,/core\/responsive\.js\?v=20261122-edt024-responsive-prototype-safety-v1/,
    'the versioned entry script must request the responsive resolver cache key');
  assert.match(app,/ui\/structured-inspector\.js\?v=20261125-d06-structured-accordion-behavior-v1/,
    'the versioned entry script must request the structured Inspector accessible-name controls, including Accordion');
  assert.match(app,/ui\/forms-inspector\.js\?v=20261127-d06-conditional-fields-v1/,
    'the versioned entry script must request the active, inert form preview');
  assert.match(app,new RegExp(`ui\/page-interaction-controls\\.js\\?v=${pageInteractionControlsVersion}`),
    'the Editor loads the form-submit action controls');
  const pageActionControls = await readFile(resolve(root,'ui/page-interaction-controls.js'),'utf8');
  assert.match(pageActionControls,/core\/page-interactions\.js\?v=20261127-edt039-form-submit-registry-v1/,
    'the Inspector loads the Form submit action allowlist');
  assert.match(app,/if\(isAuthoredContent\(node\)&&\['button','form'\]\.includes\(node\.type\)\)/,
    'the selected bound Form exposes safe interaction controls');
  assert.match(publicRenderer,/creator-form-radio-group/);
  assert.match(publicRenderer,/updateConditionalFields/,
    'the public renderer evaluates v2 field conditions after source input and before submission');
  const formsContract = await readFile(resolve(root,'../../src/core/forms-contract.ts'),'utf8');
  assert.match(formsContract,/HIDDEN_FORM_FIELD_SUBMITTED/,
    'the runtime schema rejects forged values for fields hidden by the published condition');
  assert.match(publicRenderer,/emitAcceptedPublicFormSubmission\(form\)/,
    'the public renderer can notify Page Action dispatch only through the trusted success notifier');
  const authoredContent=await readFile(resolve(root,'core/authored-content.js'),'utf8');
  assert.match(authoredContent,/acceptedPublicFormSubmissions\.has\(form\)/,
    'the Page Action listener rejects spoofed custom events without a private accepted-response token');
  assert.match(publicRenderer,new RegExp(`authored-content\\.js\\?v=${trustedFormSubmitVersion}`));
  assert.match(publicRenderer,/field\.type==='date'\?'date'/);
  assert.match(publicRenderer,/field\.type==='url'\?'url'/);
  assert.match(publicRenderer,/field\.type==='radio'/);
  assert.match(app,new RegExp(`core/authored-content\\.js\\?v=${trustedFormSubmitVersion}`),
    'the Editor must load the page-action timer lifecycle guard');
  assert.match(publicHtml,new RegExp(`page-renderer\\.js\\?v=${publicRendererVersion}`),
    'published pages must request the renderer version containing reduced-motion playback behavior');
  assert.match(publicRenderer,new RegExp(`authored-content\\.js\\?v=${trustedFormSubmitVersion}`),
    'the public renderer must request the cache-busted authored content timer and playback behavior');
  assert.match(publicRenderer,new RegExp(`legacy-media-source\\.js\\?v=${mediaPlaybackVersion}`),
    'the public renderer must request the cache-busted legacy media playback behavior');
  assert.match(publicRenderer,/matchMedia\('\(prefers-reduced-motion: reduce\)'\)/,
    'public playback must read the visitor reduced-motion preference');
  assert.match(publicRenderer,/reducedMotion:prefersReducedMotion\(\)/,
    'public renderers must pass the preference into authored and legacy media helpers');
  assert.match(publicRenderer,/applyReducedMotionVideoPlayback\(document\.getElementById\('content-canvas'\),\{reducedMotion:prefersReducedMotion\(\)\}\)/,
    'a changed operating-system preference updates only public video controls without replacing interactive page content');
  assert.match(app,/applyReducedMotionVideoPlayback\(canvas,\{reducedMotion:prefersReducedMotion\(\),editor:true\}\)/,
    'a changed operating-system preference updates only Editor Canvas video controls without rerendering the active workspace');
  assert.match(publicRenderer,/element-content\.js\?v=20261125-d06-structured-accordion-behavior-v1/,
    'the public renderer must request the shared collision-resistant content DOM ID helper');
});

test('the EDT-040 in-view trigger refreshes both renderers and the shared motion registry',async()=>{
  const [editorHtml,editor,canvasEngine,motionStyle,publicHtml,publicRenderer,css]=await Promise.all([
    readFile(resolve(root,'index.html'),'utf8'),
    readFile(resolve(root,'app.js'),'utf8'),
    readFile(resolve(root,'core/canvas-engine.js'),'utf8'),
    readFile(resolve(root,'core/motion-style.js'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/visual-page.html'),'utf8'),
    readFile(resolve(import.meta.dirname,'../public/assets/page-renderer.js'),'utf8'),
    readFile(resolve(root,'editor-motion.css'),'utf8')
  ]);
  const motionVersion='20261123-edt040-in-view-motion-v1';
  const domIdVersion='20261125-d06-authored-carousel-slide-semantics-v1';
  const editorEntryVersion='20261125-edt016-child-reference-limit-v1';
  const editorScriptVersion='20261127-d06-conditional-fields-v1';
  const mediaPlaybackVersion='20261125-forms-service-v1';
  const publicRendererVersion='20261127-d06-conditional-fields-v1';
  assert.match(editorHtml,new RegExp(`editor-motion\\.css\\?v=${motionVersion}`));
  assert.match(editorHtml,new RegExp(`app\\.js\\?v=${editorScriptVersion}`));
  assert.match(editor,new RegExp(`core/property-registry\\.js\\?v=${motionVersion}`));
  assert.match(editor,new RegExp(`core/motion-style\\.js\\?v=${motionVersion}`));
  assert.match(editor,/dataset\.motionTrigger=motionTrigger/);
  assert.match(canvasEngine,/motion-style\.js/);
  assert.match(motionStyle,/MOTION_TRIGGER_OPTIONS/);
  assert.match(publicHtml,new RegExp(`editor-motion\\.css\\?v=${motionVersion}`));
  assert.match(publicHtml,new RegExp(`page-renderer\\.js\\?v=${publicRendererVersion}`));
  assert.match(publicRenderer,new RegExp(`motion-style\\.js\\?v=${motionVersion}`));
  assert.match(publicRenderer,/data-motion-trigger="\$\{motionTrigger\}"/);
  assert.match(css,/animation-timeline:\s*view\(\)/);
  assert.match(css,/animation-range:\s*entry 0% entry 100%/);
});
