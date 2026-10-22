import assert from "node:assert/strict";
import { test } from "node:test";
import { retentionTransition } from "../src/core/media-retention-policy.js";

const clean={archived:true,usageComplete:true,referenceCount:0,objectPresent:true,retentionExpired:true};
test("retention policy allows only safe nondestructive transitions",()=>{
  assert.equal(retentionTransition("requested","quarantined",clean).allowed,true);
  assert.equal(retentionTransition("quarantined","revalidated",clean).allowed,true);
  assert.equal(retentionTransition("quarantined","cancelled").allowed,true);
  assert.equal(retentionTransition("requested","blocked").allowed,true);
  assert.equal(retentionTransition("blocked","cancelled").allowed,true);
  assert.equal(retentionTransition("cancelled","requested").allowed,false);
  assert.equal(retentionTransition("deleted","requested").allowed,false);
});
test("retention policy never authorizes final deletion",()=>{
  assert.deepEqual(retentionTransition("revalidated","deleted",clean),{allowed:false,reason:"DELETION_NOT_IMPLEMENTED"});
  assert.equal(retentionTransition("requested","deleted",clean).allowed,false);
});
test("preflight denies incomplete, referenced, active, missing and premature media",()=>{
  const invalid=[
    [{...clean,usageComplete:false},"USAGE_INCOMPLETE"],
    [{...clean,referenceCount:1},"ASSET_IN_USE"],
    [{...clean,archived:false},"ASSET_NOT_ARCHIVED"],
    [{...clean,objectPresent:false},"OBJECT_UNAVAILABLE"]
  ];
  for(const [ctx,reason] of invalid){
    assert.equal(retentionTransition("requested","quarantined",ctx).reason,reason);
    assert.equal(retentionTransition("quarantined","revalidated",ctx).reason,reason);
  }
  assert.equal(retentionTransition("quarantined","revalidated",{...clean,retentionExpired:false}).reason,"RETENTION_NOT_EXPIRED");
  assert.equal(retentionTransition("requested","quarantined",{}).allowed,false);
  assert.equal(retentionTransition("requested","quarantined",{...clean,referenceCount:"0"}).allowed,false);
});
