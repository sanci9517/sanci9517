import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, existsSync, readdirSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./dev-metrics.mjs', import.meta.url));
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'sanci-metrics-'));
  mkdirSync(join(root, 'tests'), { recursive: true });
  copyFileSync(source, join(root, 'tests', 'dev-metrics.mjs'));
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['config', 'user.name', 'Test'], { cwd: root });
  execFileSync('git', ['config', 'user.email', 'test@example.org'], { cwd: root });
  execFileSync('git', ['add', 'tests/dev-metrics.mjs'], { cwd: root });
  execFileSync('git', ['commit', '-qm', 'init'], { cwd: root });
  const run = (...args) => spawnSync(process.execPath, ['tests/dev-metrics.mjs', ...args], { cwd: root, encoding: 'utf8' });
  return { root, run, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}
test('session starts, pauses, resumes and archives verifiable elapsed interval', () => {
  const f = fixture();
  try {
    const s = f.run('start', '--task=77.44.6.1.C', '--trigger=scheduled');
    assert.equal(s.status, 0, s.stderr);
    const id = JSON.parse(s.stdout).id;
    assert.equal(f.run('pause', `--id=${id}`).status, 0);
    assert.equal(f.run('resume', `--id=${id}`).status, 0);
    const r = f.run('finish', `--id=${id}`, '--status=pass', '--kind=code', '--summary=Dock test', '--evidence=tests:PASS', '--checks=unit:PASS');
    assert.equal(r.status, 0, r.stderr);
    const file = join(f.root, JSON.parse(r.stdout).archive);
    assert.equal(existsSync(file), true);
    const body = JSON.parse(readFileSync(file, 'utf8'));
    assert.equal(body.status, 'pass');
    assert.equal(body.kind, 'code');
    assert.equal(body.trigger, 'scheduled');
    assert.ok(body.measured_seconds >= 0);
    assert.equal(f.run('finish', `--id=${id}`).status, 1);
  } finally { f.cleanup(); }
});
test('PASS without evidence is refused, pending state survives error, report is honest', () => {
  const f = fixture();
  try {
    const id = JSON.parse(f.run('start').stdout).id;
    assert.equal(f.run('start').status, 1);
    assert.equal(f.run('finish', `--id=${id}`, '--status=pass', '--kind=code').status, 1);
    const r = f.run('report', '--json=true');
    const info = JSON.parse(r.stdout);
    assert.equal(info.runs, 0);
    assert.equal(info.incomplete_sessions, 1);
    assert.equal(info.indicative_completion_date, null);
    assert.equal(f.run('finish', `--id=${id}`, '--status=blocked', '--kind=none').status, 0);
    const after = JSON.parse(f.run('report', '--json=true').stdout);
    assert.equal(after.runs, 1);
    assert.equal(after.statuses.blocked, 1);
    assert.equal(after.evidence_linked_code_test_hours, 0);
    assert.equal(after.indicative_completion_date, null);
  } finally { f.cleanup(); }
});
test('interrupted runs are archived without invented duration', () => {
  const f = fixture();
  try {
    const id = JSON.parse(f.run('start', '--trigger=scheduled').stdout).id;
    const x = f.run('abandon', `--id=${id}`, '--reason=cloud workspace interrupted');
    assert.equal(x.status, 0, x.stderr);
    const record = JSON.parse(readFileSync(join(f.root, JSON.parse(x.stdout).archive), 'utf8'));
    assert.equal(record.measured_seconds, null);
    assert.equal(record.status, 'interrupted');
    const report = JSON.parse(f.run('report', '--json=true').stdout);
    assert.equal(report.runs, 0);
    assert.equal(report.interrupted_sessions, 1);
    assert.equal(report.total_measured_hours, 0);
  } finally { f.cleanup(); }
});
test('rejects unsupported CLI input', () => {
  const f = fixture();
  try {
    assert.equal(f.run('start', '--task=../../secret').status, 1);
    assert.equal(f.run('report', '--days=0').status, 1);
    assert.equal(f.run('report', '--remaining-hours=-1').status, 1);
    assert.equal(f.run('unknown').status, 1);
  } finally { f.cleanup(); }
});
