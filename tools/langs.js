'use strict';
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// One entry per language world. A bug directory may hold one program per language.
const LANGS = {
  js:     { label: 'JavaScript', file: 'program.js',   comment: '//', version: ['node', ['--version']] },
  python: { label: 'Python',     file: 'program.py',   comment: '#',  version: ['python3', ['--version']] },
  java:   { label: 'Java',       file: 'Program.java', comment: '//', version: ['java', ['--version']] },
  go:     { label: 'Go',         file: 'program.go',   comment: '//', version: ['go', ['version']] },
  rust:   { label: 'Rust',       file: 'program.rs',   comment: '//', version: ['rustc', ['--version']] }
};

function sh(cmd, args, opts) {
  return spawnSync(cmd, args, { encoding: 'utf8', timeout: 120000, ...opts });
}

function toolVersion(lang) {
  const [cmd, args] = LANGS[lang].version;
  const r = sh(cmd, args);
  if (r.error || r.status !== 0) return null;
  return ((r.stdout || '') + (r.stderr || '')).split('\n')[0].trim();
}

function runProgram(lang, file) {
  switch (lang) {
    case 'js': return sh('node', [file]);
    case 'python': return sh('python3', [file]);
    case 'java': return sh('java', [file]);
    case 'go': return sh('go', ['run', file]);
    case 'rust': {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'obmw-rust-'));
      const exe = path.join(dir, 'program');
      const c = sh('rustc', ['-o', exe, file]);
      if (c.error || c.status !== 0) return c;
      return sh(exe, []);
    }
    default: throw new Error('unknown language ' + lang);
  }
}

module.exports = { LANGS, toolVersion, runProgram };
