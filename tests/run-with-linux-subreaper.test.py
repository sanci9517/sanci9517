from __future__ import annotations

import os
import importlib.util
import subprocess
import sys
import tempfile
import textwrap
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RUNNER = ROOT / "scripts" / "run-with-linux-subreaper.py"


class BrowserSuiteRunnerTest(unittest.TestCase):
    def test_split_test_files_keeps_node_options_and_each_file(self):
        spec = importlib.util.spec_from_file_location("runner", RUNNER)
        runner = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(runner)

        parsed = runner.split_test_files(
            ["--test-files", "node", "--test", "--test-concurrency=1", "a.test.js", "b.test.js"]
        )
        self.assertEqual(
            parsed,
            (["node", "--test", "--test-concurrency=1"], ["a.test.js", "b.test.js"], []),
        )

    @unittest.skipUnless(sys.platform.startswith("linux"), "Linux child reaping contract")
    def test_runner_reaps_a_chromium_like_orphan_before_returning(self):
        with tempfile.TemporaryDirectory() as temporary:
            child_script = Path(temporary) / "leave-child.py"
            child_script.write_text(
                textwrap.dedent(
                    """
                    import os, sys, time
                    pid = os.fork()
                    if pid == 0:
                        time.sleep(0.12)
                        os._exit(0)
                    print(pid, flush=True)
                    """
                )
            )
            result = subprocess.run(
                [sys.executable, str(RUNNER), sys.executable, str(child_script)],
                check=False,
                capture_output=True,
                text=True,
                timeout=5,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("reaped 1 orphaned test descendant", result.stderr)
            child_pid = int(result.stdout.strip().splitlines()[-1])
            with self.assertRaises(ProcessLookupError):
                os.kill(child_pid, 0)

    def test_file_boundary_continues_after_failure_and_preserves_order(self):
        with tempfile.TemporaryDirectory() as temporary:
            folder = Path(temporary)
            fake_node = folder / "fake-node"
            order_file = folder / "order.txt"
            fake_node.write_text(
                "#!/usr/bin/env python3\n"
                "import os, pathlib, sys\n"
                "pathlib.Path(os.environ['ORDER_FILE']).open('a').write(pathlib.Path(sys.argv[-1]).name + '\\n')\n"
                "raise SystemExit(7 if pathlib.Path(sys.argv[-1]).name.startswith('fail') else 0)\n"
            )
            fake_node.chmod(0o755)
            first = folder / "fail-first.test.js"
            second = folder / "pass-second.test.js"
            first.write_text("// fake browser test\n")
            second.write_text("// fake browser test\n")
            environment = dict(os.environ, ORDER_FILE=str(order_file))
            result = subprocess.run(
                [
                    sys.executable,
                    str(RUNNER),
                    "--test-files",
                    str(fake_node),
                    "--test",
                    "--test-concurrency=1",
                    str(first),
                    str(second),
                ],
                check=False,
                capture_output=True,
                text=True,
                env=environment,
                timeout=5,
            )
            self.assertEqual(result.returncode, 7, result.stderr)
            self.assertEqual(order_file.read_text().splitlines(), [first.name, second.name])
            self.assertIn("1/2", result.stdout)
            self.assertIn("2/2", result.stdout)


if __name__ == "__main__":
    unittest.main(verbosity=2)
