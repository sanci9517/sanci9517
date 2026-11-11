import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editorWorkflow = readFileSync(new URL("../.github/workflows/editor-core-test.yml", import.meta.url), "utf8");
const planAuditWorkflow = readFileSync(new URL("../.github/workflows/active-plan-audit.yml", import.meta.url), "utf8");

test("Editor screenshots are retained only to diagnose a failed check", () => {
  const uploadStep = editorWorkflow.match(/      - name: Upload Editor layout screenshots([\s\S]*?)(?=\n      - name: |$)/)?.[1];

  assert.ok(uploadStep, "the Editor diagnostic screenshot upload remains explicit");
  assert.ok(editorWorkflow.indexOf("- name: Run Admin home contract tests") < editorWorkflow.indexOf("- name: Upload Editor layout screenshots"),
    "the single failure-only upload runs after every Editor Core check");
  assert.match(uploadStep, /\n        if: failure\(\)/, "successful CI runs must not store screenshots");
  assert.match(uploadStep, /retention-days: 7/, "diagnostic screenshots use the shortest supported retention window");
  assert.doesNotMatch(uploadStep, /\.apk|\.aab|\.aar|node_modules|dist\//i, "generated build output is never uploaded");
});

test("active-plan audit retains only its small text artifact for thirty days", () => {
  const uploadStep = planAuditWorkflow.match(/      - uses: actions\/upload-artifact@v4([\s\S]*?)(?=\n      - |$)/)?.[1];

  assert.ok(uploadStep, "the plan audit has one explicit artifact upload");
  assert.match(uploadStep, /name: canonical-active-point-source/);
  assert.match(uploadStep, /path: active-plan-audit\.txt/);
  assert.match(uploadStep, /retention-days: 30/);
  assert.doesNotMatch(uploadStep, /\.apk|\.aab|\.aar|node_modules|dist\//i, "plan evidence never contains build output");
});
