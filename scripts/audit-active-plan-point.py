#!/usr/bin/env python3
"""Read-only semantic triage for the canonical Creator Platform plan.
Never promotes an uncertain mapping to PASS automatically.
"""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
path = root / "docs/SANCI9517-CREATOR-PLATFORM-PLAN.md"
text = path.read_text(encoding="utf-8")
lines = text.splitlines()
anchor = re.compile(r"(?<!\d)63\.50\.92(?!\d)")
matches = [i for i, line in enumerate(lines) if anchor.search(line)]
print(f"CANONICAL_FILE={path.relative_to(root)}")
print(f"TOTAL_LINES={len(lines)}")
print(f"ANCHOR_OCCURRENCES={len(matches)}")
if not matches:
    print("ERROR: active anchor 63.50.92 not found; do not advance.", file=sys.stderr)
    sys.exit(1)
for n, index in enumerate(matches, 1):
    print(f"\n=== 63.50.92 occurrence {n}, line {index + 1} ===")
    for j in range(max(0, index - 8), min(len(lines), index + 34)):
        print(f"{j+1}: {lines[j][:500]}")
print("\n=== REVIEW COUNTS (informational; NOT proof of completeness) ===")
for term in ("UNCERTAIN", "REVIEW", "NOT PASS", "IN PROGRESS", "bizonytalan", "függőség", "owner"):
    print(f"{term}: {text.casefold().count(term.casefold())}")
print("\nSTATUS: SOURCE_EXTRACTED_ONLY; manual source-by-source semantic verification required.")

print("\\n=== PRIORITY: NO LEXICAL EVIDENCE (source rows) ===")
for i, line in enumerate(lines):
    if re.match(r"^\|\s*54\.\d+\.\d+\s*\|", line) and "NO LEXICAL EVIDENCE" in line:
        print(f"{i+1}: {line[:1200]}")
print("\\n=== PRIORITY: AMBIGUOUS CANDIDATES (source rows) ===")
for i, line in enumerate(lines):
    if re.match(r"^\|\s*54\.\d+\.\d+\s*\|", line) and "AMBIGUOUS CANDIDATES" in line:
        print(f"{i+1}: {line[:1200]}")
