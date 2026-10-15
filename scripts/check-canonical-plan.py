#!/usr/bin/env python3
"""Fail CI when historical plans become active or the canonical plan disappears."""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
canonical = root / "docs/SANCI9517-CREATOR-PLATFORM-PLAN.md"
archive = root / "docs/archive/plans"
errors = []

if not canonical.is_file() or canonical.stat().st_size < 1000:
    errors.append("Canonical Creator Platform plan is missing or unexpectedly empty.")
if not archive.is_dir():
    errors.append("Historical plan archive is missing.")

# Explicit legacy plan names must never be reintroduced as active docs.
legacy = (
    "MASTER-DEVELOPMENT-PLAN.md",
    "SANCI-MASTER-PLAN.md",
    "DEVELOPMENT-PLAN.md",
    "MASTER-FINAL-ROADMAP.md",
    "MASTER-CURRENT-STATUS.md",
    "V2-BLUEPRINT.md",
    "VISUAL-EDITOR-ARCHITECTURE.md",
)
for folder in (root, root / "docs"):
    for name in legacy:
        if (folder / name).exists():
            errors.append(f"Legacy plan reintroduced outside archive: {(folder / name).relative_to(root)}")

readme = (root / "README.md").read_text(encoding="utf-8")
if "docs/SANCI9517-CREATOR-PLATFORM-PLAN.md" not in readme:
    errors.append("README must link to the canonical plan.")

# The archived files remain available as evidence; do not enforce deletion.
if errors:
    for error in errors:
        print("ERROR:", error, file=sys.stderr)
    sys.exit(1)
print("PASS: one canonical plan; legacy names confined to archive.")
