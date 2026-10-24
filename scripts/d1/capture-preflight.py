#!/usr/bin/env python3
"""Read-only production evidence collector; never prints credentials or headers."""
import os,json,urllib.request,urllib.error,argparse,sys
from pathlib import Path
p=argparse.ArgumentParser(description=__doc__)
p.add_argument("--output",type=Path,required=True)
a=p.parse_args()
if not __debug__: raise RuntimeError("Python -O is forbidden")
sql="""SELECT type,name,tbl_name,sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY type,name;
SELECT id,name,applied_at FROM d1_migrations ORDER BY id;
SELECT 'domain' AS check_name,COUNT(*) AS n FROM site_domains WHERE hostname='sanci9517-streamer-brand.sandor-bogadi95.workers.dev' AND site_id='site-default' AND status='verified' AND verification_method='cloudflare-worker-route' AND verified_at IS NOT NULL
UNION ALL SELECT 'active_default_users_without_membership',COUNT(*) FROM users u WHERE u.is_active=1 AND NOT EXISTS(SELECT 1 FROM site_memberships m WHERE m.site_id='site-default' AND m.user_id=u.id AND m.status='active' AND m.role=u.role)
UNION ALL SELECT 'default_settings_missing_or_different',COUNT(*) FROM site_settings s WHERE s.key='site' AND json_valid(s.value_json) AND NOT EXISTS(SELECT 1 FROM site_scoped_settings t WHERE t.site_id='site-default' AND t.key=s.key AND t.value_json=s.value_json)
UNION ALL SELECT 'snapshot_tables',COUNT(*) FROM sqlite_master WHERE name GLOB '__web013_*';
PRAGMA foreign_key_check; PRAGMA quick_check;"""
u='https://api.cloudflare.com/client/v4/accounts/64bbd6a12ac732ed2cac4ca25d8bfa7e/d1/database/5a4a5e96-fdad-421a-a33c-143daaf33e98/query'
r=urllib.request.Request(u,data=json.dumps({'sql':sql}).encode(),headers={'Authorization':'Bearer '+os.environ['CLOUDFLARE_API_TOKEN'],'Content-Type':'application/json'})
try:
 with urllib.request.urlopen(r,timeout=30) as response: d=json.load(response)
except urllib.error.HTTPError as e:
 print(f'D1 read failed: HTTP {e.code}',file=sys.stderr); sys.exit(1)
except urllib.error.URLError:
 print('D1 read failed: network/proxy/TLS error',file=sys.stderr); sys.exit(1)
assert d['success'], 'D1 query failed'
assert all(x['success'] and x['meta']['rows_written']==0 for x in d['result'])
from datetime import datetime,timezone
d['captured_at']=datetime.now(timezone.utc).isoformat()
d['account_id']='64bbd6a12ac732ed2cac4ca25d8bfa7e'; d['database_id']='5a4a5e96-fdad-421a-a33c-143daaf33e98'
a.output.write_text(json.dumps(d,indent=2)+'\n')
print(json.dumps({'checks':d['result'][2]['results'],'fk':d['result'][3]['results'],'quick':d['result'][4]['results'],'schema_objects':len(d['result'][0]['results'])}))
