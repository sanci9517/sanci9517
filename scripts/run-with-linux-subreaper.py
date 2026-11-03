#!/usr/bin/env python3
"""Run browser test files serially and reap orphaned Linux descendants.

Chromium can briefly outlive Playwright's browser-close promise. In containers
whose PID 1 does not reap children, running every test in one Node process lets
those orphans accumulate throughout the entire suite. This runner makes each
test file an isolation boundary and reaps adopted descendants between files.
"""

from __future__ import annotations

import ctypes
import os
import subprocess
import sys
import time


PR_SET_CHILD_SUBREAPER = 36
REAP_GRACE_SECONDS = 10.0


def enable_subreaper() -> bool:
    if not sys.platform.startswith("linux"):
        return False
    libc = ctypes.CDLL(None, use_errno=True)
    if libc.prctl(PR_SET_CHILD_SUBREAPER, 1, 0, 0, 0) == 0:
        return True
    error = ctypes.get_errno()
    print(
        f"warning: cannot enable Linux child subreaper: {os.strerror(error)}; "
        "the runner will continue without orphan cleanup",
        file=sys.stderr,
    )
    return False


def reap_adopted_children() -> int:
    """Wait briefly for adopted descendants and reap every exited child."""
    deadline = time.monotonic() + REAP_GRACE_SECONDS
    reaped = 0
    while True:
        try:
            pid, _ = os.waitpid(-1, os.WNOHANG)
        except ChildProcessError:
            return reaped
        if pid > 0:
            reaped += 1
            continue
        if time.monotonic() >= deadline:
            print(
                "warning: adopted test descendants remained alive after "
                f"{REAP_GRACE_SECONDS:g}s; leaving them to the container init",
                file=sys.stderr,
            )
            return reaped
        time.sleep(0.05)


def split_test_files(arguments: list[str]):
    """Return the Node invocation prefix, test paths and trailing options."""
    if not arguments or arguments[0] != "--test-files":
        return None
    command = arguments[1:]
    first_test = next(
        (index for index, value in enumerate(command) if value.endswith(".test.js")),
        None,
    )
    if first_test is None or first_test == 0:
        return None
    last_test = next(
        index
        for index in range(len(command) - 1, first_test - 1, -1)
        if command[index].endswith(".test.js")
    )
    files = [
        value
        for value in command[first_test : last_test + 1]
        if value.endswith(".test.js")
    ]
    return command[:first_test], files, command[last_test + 1 :]


def run_one(command: list[str]) -> int:
    try:
        completed = subprocess.run(command, check=False)
    except KeyboardInterrupt:
        return 130
    return completed.returncode if completed.returncode >= 0 else 128 - completed.returncode


def main() -> int:
    if len(sys.argv) < 2:
        print(
            "usage: run-with-linux-subreaper.py [--test-files] COMMAND [ARG ...]",
            file=sys.stderr,
        )
        return 2

    enabled = enable_subreaper()
    plan = split_test_files(sys.argv[1:])
    if plan:
        prefix, files, suffix = plan
        commands = [[*prefix, *suffix, test_file] for test_file in files]
    else:
        commands = [sys.argv[1:]]

    result = 0
    try:
        for index, command in enumerate(commands, start=1):
            if plan:
                print(
                    f"\n[subreaper browser suite {index}/{len(commands)}] {command[-1]}",
                    flush=True,
                )
            file_result = run_one(command)
            if result == 0 and file_result != 0:
                result = file_result
            if file_result == 130:
                return 130
            if enabled:
                reaped = reap_adopted_children()
                if reaped:
                    print(
                        f"reaped {reaped} orphaned test descendant(s)",
                        file=sys.stderr,
                    )
    except KeyboardInterrupt:
        return 130
    return result


if __name__ == "__main__":
    raise SystemExit(main())
