#!/usr/bin/env python3
"""Read-only, pre-merge provenance check. Never calls Cloudflare or changes Git."""
import argparse, hashlib, json, pathlib, re, subprocess

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--head',default='HEAD')
parser.add_argument('--manifest',default='docs/evidence/session-release-sources.json')
parser.add_argument('--json',action='store_true')
args=parser.parse_args()
def git(*parts):
    return subprocess.run(['git',*parts],capture_output=True,text=True)
def ancestor(older,newer):
    return git('merge-base','--is-ancestor',older,newer).returncode==0
manifest=json.loads(pathlib.Path(args.manifest).read_text())
resolved=git('rev-parse','--verify',args.head+'^{commit}')
if resolved.returncode:parser.error('head is not a locally available commit')
head=resolved.stdout.strip();base=manifest['base'];errors=[]
start,end=manifest['required_pr_range'];sources=manifest['sources']
if [start,end]!=[292,312]:errors.append('this recorded release must cover exactly PRs 292-312')
if sorted(p['pr'] for p in sources)!=list(range(start,end+1)):
    errors.append('source PR set is incomplete or duplicated')
if not ancestor(base,head):errors.append('head does not descend from the recorded target base')
consumed=[]
for source in sources:
    if not re.fullmatch('[0-9a-f]{40}',source['source_head']):errors.append(f"invalid source head: #{source['pr']}")
    expected=5 if source['pr']==292 else 3 if source['pr']==293 else 2 if source['pr']==312 else 1
    if len(source['contributions'])!=expected:errors.append(f"incomplete contribution list: #{source['pr']}")
    for contribution in source['contributions']:
        commit=contribution['integrated_commit'];consumed.append(commit)
        if not ancestor(commit,head) or ancestor(commit,base):errors.append(f"missing contribution: #{source['pr']} {commit}")
        subject=git('show','-s','--format=%s',commit)
        if subject.returncode or subject.stdout.strip()!=contribution['subject']:errors.append(f"contribution identity mismatch: #{source['pr']}")
if len(consumed)!=28:errors.append('this release must contain 28 source contributions')
if len(set(consumed))!=len(consumed):errors.append('a contribution was assigned more than once')
for record in manifest['byte_preserved_files']:
    blob=subprocess.run(['git','show',head+':'+record['path']],capture_output=True)
    if blob.returncode or hashlib.sha256(blob.stdout).hexdigest()!=record['sha256']:errors.append('preserved source differs: '+record['path'])
reserved=git('diff','--name-only',base,head,'--','migrations','scripts/pending').stdout.splitlines()
if reserved:errors.append('reserved migration SQL changed: '+', '.join(reserved))
result={'stage':'pre-merge source coverage; not production acceptance','head':head,'base':base,'source_prs':len(sources),'contributions':len(consumed),'byte_preserved_files':len(manifest['byte_preserved_files']),'reserved_sql_unchanged':not reserved,'status':'PASS' if not errors else 'FAIL','errors':errors}
print(json.dumps(result,ensure_ascii=False,indent=2) if args.json else f"{result['status']}: {len(sources)} PRs, {len(consumed)} contributions, {result['byte_preserved_files']} preserved files\n"+'\n'.join(errors))
raise SystemExit(bool(errors))
