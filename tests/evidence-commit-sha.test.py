"""Keep release evidence commit identifiers tied to real Git objects."""

import json
import pathlib
import re
import subprocess
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs" / "evidence"
SHA = re.compile(r"^[0-9a-f]{40}$")


class EvidenceCommitShaTest(unittest.TestCase):
    def test_commit_references_resolve_to_exact_local_commit(self):
        checked = 0
        for path in sorted(EVIDENCE.rglob("*.json")):
            with self.subTest(file=str(path.relative_to(ROOT))):
                record = json.loads(path.read_text())
                source = record.get("source_control") if isinstance(record, dict) else None
                if not isinstance(source, dict):
                    continue
                for field, sha in source.items():
                    if not any(token in field for token in ("commit", "head", "sha")):
                        continue
                    if not isinstance(sha, str) or not SHA.fullmatch(sha):
                        continue  # Explicit pending values and short display IDs are not commit claims.
                    checked += 1
                    result = subprocess.run(
                        ["git", "cat-file", "-t", sha], cwd=ROOT,
                        capture_output=True, text=True, check=False,
                    )
                    self.assertEqual(result.returncode, 0, f"{path}: {field} is not a Git object: {sha}")
                    self.assertEqual(result.stdout.strip(), "commit")
        self.assertGreater(checked, 200, "the evidence scan must cover the existing release history")


if __name__ == "__main__":
    unittest.main()
