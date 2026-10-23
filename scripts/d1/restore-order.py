#!/usr/bin/env python3
"""Reorder a D1 export offline, preserving every complete SQL statement verbatim.

No network, no database execution, no SQL/INSERT content on stdout. Unknown
statement types fail closed. The input is never changed; output must not exist.
"""
import argparse
from collections import Counter
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3


def statements(sql):
    """SQLite's parser recognizes semicolons in strings/comments and trigger END."""
    start = 0
    result = []
    for pos, char in enumerate(sql):
        if char == ';' and sqlite3.complete_statement(sql[start:pos + 1]):
            result.append(sql[start:pos + 1])
            start = pos + 1
    tail = sql[start:]
    if strip_comments(tail):
        raise ValueError('Incomplete trailing SQL statement')
    return result, tail


def strip_comments(sql):
    return re.sub(r'\A(?:\s|--[^\n]*(?:\n|$)|/\*[\s\S]*?\*/)*', '', sql)


def ordered_export(sql):
    original, tail = statements(sql)
    groups = [[] for _ in range(5)]
    for number, statement in enumerate(original, 1):
        text = strip_comments(statement)
        if re.fullmatch(r'PRAGMA\s+defer_foreign_keys\s*=\s*(?:TRUE|ON|1)\s*;', text, re.I):
            phase = 0
        elif re.match(r'CREATE\s+TABLE\b', text, re.I):
            phase = 1
        elif re.match(r'INSERT\s+INTO\b', text, re.I) or re.fullmatch(r'DELETE\s+FROM\s+(?:sqlite_sequence|"sqlite_sequence"|`sqlite_sequence`)\s*;', text, re.I):
            phase = 2
        elif re.match(r'CREATE\s+(?:UNIQUE\s+)?INDEX\b', text, re.I):
            phase = 3
        elif re.match(r'CREATE\s+TRIGGER\b', text, re.I):
            phase = 4
        else:
            raise ValueError(f'Unsupported statement at ordinal {number}; contents withheld')
        groups[phase].append(statement)
    if len(groups[0]) != 1:
        raise ValueError('Exactly one deferred-FK pragma is required')
    ordered = [s for group in groups for s in group]
    if Counter(original) != Counter(ordered):
        raise ValueError('Statement preservation check failed')
    output = '\n'.join(ordered) + tail
    reparsed, _ = statements(output)
    # Added separators are whitespace only; SQL tokens and multiplicities match.
    if Counter(s.strip() for s in original) != Counter(s.strip() for s in reparsed):
        raise ValueError('Output reparse differs from original statements')
    return output, {'statements': len(original), 'phases': [len(g) for g in groups]}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--expected-sha256', required=True)
    args = p.parse_args()
    original = args.source.read_bytes()
    digest = hashlib.sha256(original).hexdigest()
    if digest != args.expected_sha256:
        raise ValueError('Source SHA-256 mismatch; no output written')
    output, summary = ordered_export(original.decode('utf-8'))
    # O_EXCL also prevents overwriting the source, another backup or a symlink.
    fd = os.open(args.output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, 'wb') as stream:
        stream.write(output.encode('utf-8'))
    if hashlib.sha256(args.source.read_bytes()).hexdigest() != digest:
        raise ValueError('Source changed during processing')
    print(json.dumps({**summary, 'source_sha256': digest,
                      'restore_sha256': hashlib.sha256(output.encode('utf-8')).hexdigest()}))


if __name__ == '__main__':
    main()
