"""Keep recent release evidence commit identifiers tied to real Git objects."""

import json
import pathlib
import subprocess
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs" / "evidence"
FILES = (
    "media-alias-head-parity-77-44-7-d-2026-11-11.json",
    "media-head-trailing-slash-parity-77-44-7-d-2026-11-11.json",
    "editor-core-gate-77-44-7-d-2026-11-11.json",
    "editor-local-suite-after-media-parity-77-44-7-d-2026-11-11.json",
)


class EvidenceCommitShaTest(unittest.TestCase):
    def test_commit_references_resolve_to_exact_local_commit(self):
        for name in FILES:
            with self.subTest(file=name):
                record = json.loads((EVIDENCE / name).read_text())
                source = record["source_control"]
                for field in ("base_sha", "verified_remote_head", "test_docs_commit", "docs_commit"):
                    if field not in source:
                        continue
                    sha = source[field]
                    self.assertRegex(sha, r"^[0-9a-f]{40}$")
                    result = subprocess.run(
                        ["git", "cat-file", "-t", sha], cwd=ROOT,
                        capture_output=True, text=True, check=False,
                    )
                    self.assertEqual(result.returncode, 0, f"{name}: {field} is not a Git object: {sha}")
                    self.assertEqual(result.stdout.strip(), "commit")


if __name__ == "__main__":
    unittest.main()
