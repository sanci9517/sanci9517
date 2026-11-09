#!/usr/bin/env node
// Local, dependency-free Codex work-session telemetry. No network calls, CI or deploys.
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const archiveDir = join(root, 'docs', 'evidence', 'dev-metrics', 'runs');
const now = () => new Date().toISOString();
const fail = (message) => { throw new Error(message); };
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const stateDir = resolve(root, git('rev-parse', '--git-path', 'sanci-dev-metrics'));
const pendingDir = join(stateDir, 'pending');
const flags = Object.fromEntries(process.argv.slice(3).map(x => {
  if (!x.startsWith('--') || !x.includes('=')) fail('Use --name=value flags.');
  const i = x.indexOf('=');
  return [x.slice(2, i), x.slice(i + 1)];
}));
const command = process.argv[2];
const allowedFlags = {
  start: ['task', 'trigger'], pause: ['id'], resume: ['id'],
  finish: ['id', 'status', 'kind', 'summary', 'evidence', 'checks'],
  report: ['days', 'remaining-hours', 'json']
};
if (!Object.hasOwn(allowedFlags, command)) fail('Usage: node tests/dev-metrics.mjs start|pause|resume|finish|report [--key=value]');
for (const key of Object.keys(flags)) if (!allowedFlags[command].includes(key)) fail(`Unknown flag: --${key}`);
const safeId = x => typeof x === 'string' && /^[\w.-]{1,100}$/.test(x);
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const write = (p, value) => {
  mkdirSync(dirname(p), { recursive: true });
  const tmp = `${p}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  renameSync(tmp, p);
};
const pendingIds = () => existsSync(pendingDir) ? readdirSync(pendingDir).filter(n => n.endsWith('.json')).map(n => n.slice(0, -5)) : [];
const pendingPath = id => {
  if (!safeId(id)) fail('Invalid session ID.');
  return join(pendingDir, `${id}.json`);
};
const active = () => {
  const ids = pendingIds();
  const id = flags.id || (ids.length === 1 ? ids[0] : fail(`Specify --id=... (${ids.length} pending sessions).`));
  const p = pendingPath(id);
  if (!existsSync(p)) fail(`Session ${id} not found.`);
  return { p, value: read(p) };
};
const seconds = (from, to) => Math.max(0, Math.round((Date.parse(to) - Date.parse(from)) / 1000));

try {
  if (command === 'start') {
    const task = flags.task || '77.44.6.1.C';
    const trigger = flags.trigger || 'manual';
    if (!safeId(task) || !['scheduled', 'manual'].includes(trigger)) fail('Invalid task or trigger.');
    if (pendingIds().length) fail('A session is already pending. Finish it or inspect its ID; overlapping runs need separate handling.');
    const id = `${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}-${randomUUID().slice(0, 8)}`;
    const value = { schema: 1, id, task, trigger, started_at: now(), started_revision: git('rev-parse', 'HEAD'), paused_at: null, paused_seconds: 0 };
    write(pendingPath(id), value);
    console.log(JSON.stringify({ ok: true, id, started_at: value.started_at, task, trigger }));
  } else if (command === 'pause' || command === 'resume') {
    const { p, value: v } = active();
    const time = now();
    if (command === 'pause') {
      if (v.paused_at) fail('Session is already paused.');
      v.paused_at = time;
    } else {
      if (!v.paused_at) fail('Session is not paused.');
      v.paused_seconds += seconds(v.paused_at, time);
      v.paused_at = null;
    }
    write(p, v);
    console.log(JSON.stringify({ ok: true, id: v.id, state: command, at: time }));
  } else if (command === 'finish') {
    const { p, value: v } = active();
    const status = flags.status || 'partial';
    const kind = flags.kind || 'none';
    const summary = flags.summary || '';
    const evidence = flags.evidence ? flags.evidence.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!['pass', 'partial', 'blocked', 'failed'].includes(status)) fail('Invalid status.');
    if (!['code', 'test', 'docs', 'mixed', 'none'].includes(kind)) fail('Invalid kind.');
    if (summary.length > 400 || evidence.length > 15 || evidence.some(s => s.length > 180)) fail('Summary/evidence too long.');
    if (status === 'pass' && (kind === 'code' || kind === 'test' || kind === 'mixed') && evidence.length === 0) fail('Code/test PASS requires an evidence reference.');
    const finished = now();
    const paused = v.paused_seconds + (v.paused_at ? seconds(v.paused_at, finished) : 0);
    const elapsed = seconds(v.started_at, finished);
    const result = {
      schema: 1, id: v.id, task: v.task, trigger: v.trigger,
      started_at: v.started_at, finished_at: finished,
      wall_seconds: elapsed, paused_seconds: Math.min(paused, elapsed), measured_seconds: Math.max(0, elapsed - paused),
      status, kind, summary, evidence, checks: flags.checks || 'NOT_RECORDED',
      started_revision: v.started_revision, finished_revision: git('rev-parse', 'HEAD'),
      measurement: 'start-to-finish wall time excluding explicit pauses; not Codex token/compute time',
      verification: 'agent-reported; references are not independently checked by this script'
    };
    const dest = join(archiveDir, finished.slice(0, 10), `${v.id}.json`);
    if (existsSync(dest)) fail(`Archive already exists: ${dest}`);
    write(dest, result);
    unlinkSync(p);
    console.log(JSON.stringify({ ok: true, id: v.id, measured_seconds: result.measured_seconds, status, archive: dest.slice(root.length + 1) }));
  } else if (command === 'report') {
    const days = flags.days === undefined ? 7 : Number(flags.days);
    const remaining = flags['remaining-hours'] === undefined ? 300 : Number(flags['remaining-hours']);
    if (!Number.isInteger(days) || days < 1 || days > 365 || !Number.isFinite(remaining) || remaining < 0 || remaining > 100000) fail('Invalid reporting window or remaining estimate.');
    const from = Date.now() - days * 86400000;
    const records = [];
    if (existsSync(archiveDir)) for (const date of readdirSync(archiveDir)) {
      const dir = join(archiveDir, date);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      for (const file of readdirSync(dir)) {
        if (!file.endsWith('.json')) continue;
        const record = read(join(dir, file));
        if (record.schema === 1 && Number.isFinite(record.measured_seconds) && Date.parse(record.finished_at) >= from) records.push(record);
      }
    }
    const seen = new Set();
    for (const r of records) {
      if (seen.has(r.id)) fail(`Duplicate session ID: ${r.id}`);
      seen.add(r.id);
    }
    const totalSeconds = records.reduce((n, r) => n + r.measured_seconds, 0);
    const linked = records.filter(r => r.status === 'pass' && ['code', 'test', 'mixed'].includes(r.kind) && r.evidence?.length);
    const linkedSeconds = linked.reduce((n, r) => n + r.measured_seconds, 0);
    const weeklyLinkedHours = linkedSeconds / 3600 * 7 / days;
    // One-week minimum prevents a misleading ETA after only one or two runs.
    const eligible = days >= 7 && records.length >= 5 && weeklyLinkedHours > 0;
    const eta = eligible ? new Date(Date.now() + remaining / weeklyLinkedHours * 7 * 86400000).toISOString().slice(0, 10) : null;
    const result = {
      window_days: days, runs: records.length, incomplete_sessions: pendingIds().length,
      total_measured_hours: +(totalSeconds / 3600).toFixed(3),
      evidence_linked_code_test_hours: +(linkedSeconds / 3600).toFixed(3),
      statuses: Object.fromEntries(['pass', 'partial', 'blocked', 'failed'].map(s => [s, records.filter(r => r.status === s).length])),
      remaining_estimate_hours: remaining, estimated_weekly_evidence_linked_hours: +weeklyLinkedHours.toFixed(3),
      indicative_completion_date: eta,
      caveat: 'Measured elapsed wall time, not verified Codex active time. Evidence links are operator-supplied; ETA is indicative and depends on a stable task estimate.'
    };
    if (flags.json === 'true') console.log(JSON.stringify(result, null, 2));
    else console.log(`Futások: ${result.runs} (lezáratlan: ${result.incomplete_sessions}); mért: ${result.total_measured_hours} óra; bizonyítékhoz kötött kód/teszt: ${result.evidence_linked_code_test_hours} óra; becsült befejezés: ${eta || 'még nincs elegendő adat'}\n${result.caveat}`);
  }
} catch (e) {
  console.error(`dev-metrics: ${e.message}`);
  process.exitCode = 1;
}
