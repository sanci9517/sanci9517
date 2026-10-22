import assert from "node:assert/strict";
import {test} from "node:test";
import {prepareRetentionRequest,prepareRetentionCancellation} from "../src/core/media-retention-request.js";
const asset={id:"asset-a",site_id:"site-default",object_key:"sites/site-default/media/a",archived_at:"2026-10-22"};
const usage={complete:true,references:[]};
test("retention request preparation is deterministic, deferred and non-destructive",async()=>{
 const r=await prepareRetentionRequest({asset,usage,objectPresent:true,now:new Date("2026-10-22T12:00:00Z")});
 assert.equal(r.ok,true);
 assert.equal(r.value.notBefore,"2026-11-21T12:00:00.000Z");
 assert.equal(r.value.state,"requested");
 assert.equal(r.value.finalDeletionAuthorized,false);
});
test("retention request preparation refuses unsafe assets and invalid input",async()=>{
 const now=new Date("2026-10-22T12:00:00Z");
 for(const args of [
  {asset:{...asset,archived_at:null},usage,objectPresent:true},
  {asset,usage:{complete:false,references:[]},objectPresent:true},
  {asset,usage:{complete:true,references:[{}]},objectPresent:true},
  {asset,usage,objectPresent:false},
  {asset,usage,objectPresent:true,days:0},
  {asset,usage,objectPresent:true,days:366}
 ]) assert.equal((await prepareRetentionRequest({...args,now})).ok,false);
});
test("only cancellable requests can be prepared for cancellation",()=>{
 const req={id:"request-a",site_id:"site-default",state:"quarantined"};
 assert.equal(prepareRetentionCancellation(req).ok,true);
 assert.equal(prepareRetentionCancellation({...req,state:"deleted"}).ok,false);
 assert.equal(prepareRetentionCancellation({...req,state:"cancelled"}).ok,false);
});

test("retention requests reject cross-site R2 keys and invalid deadlines",async()=>{
 const now=new Date("2026-10-22T12:00:00Z");
 for(const object_key of ["sites/other/media/asset","sites/site-default/media/","other/key"]) {
  assert.deepEqual((await prepareRetentionRequest({asset:{...asset,object_key},usage,objectPresent:true,now})).ok,false);
 }
 assert.equal((await prepareRetentionRequest({asset,usage,objectPresent:true,now:new Date(NaN)})).ok,false);
 assert.equal((await prepareRetentionRequest({asset,usage,objectPresent:true,now:new Date(8640000000000000)})).ok,false);
});
