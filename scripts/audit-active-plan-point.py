#!/usr/bin/env python3
"""Check the current master cursor and all 396 source mappings, not readiness."""
from pathlib import Path
import json
import sys
from collections import Counter
from plan_contract import validate, TRACE

root = Path(__file__).resolve().parents[1]
try:
    report = validate(root)
    features = json.loads((root / TRACE).read_text(encoding='utf-8'))['features']
except (ValueError, KeyError, IndexError, OSError) as error:
    print(f'ERROR: {error}', file=sys.stderr)
    sys.exit(1)
report['source_status_counts'] = dict(Counter(f['source_status'] for f in features))
report['scope'] = 'Current cursor + complete source crosswalk; neither semantic feature acceptance nor production PASS'
print(json.dumps(report, ensure_ascii=False, indent=2))
