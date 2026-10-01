'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { collect, render, parseChecks, verdict, ROOT, BUGS_DIR } = require('./build');
const { LANGS } = require('./langs');

const { data, stale, available } = collect({ write: false });
const metas = data.bugs.map((b) => JSON.parse(fs.readFileSync(path.join(BUGS_DIR, b.id, 'meta.json'), 'utf8')));

test('parseChecks and verdict', () => {
  const c = parseChecks('noise\nCHECK a|1|2\nCHECK b|ERROR X|3\n');
  assert.deepStrictEqual(c, { a: { broken: '1', fixed: '2' }, b: { broken: 'ERROR X', fixed: '3' } });
  assert.strictEqual(verdict('4', '4'), 'safe');
  assert.strictEqual(verdict('ERROR IndexError', '6'), 'raises');
  assert.strictEqual(verdict('NaN', '6'), 'silent');
});

test('at least three verified languages and six bugs', () => {
  assert.ok(data.bugs.length >= 6);
  const live = Object.keys(available).filter((k) => available[k]);
  assert.ok(live.length >= 3, 'need node, python3 and java on PATH, found: ' + live.join(','));
});

for (const meta of metas) {
  const bug = data.bugs.find((b) => b.id === meta.id);
  test(meta.id + ': metadata is complete', () => {
    for (const k of ['order', 'id', 'title', 'hook', 'concept', 'fix', 'checks', 'worlds', 'regression', 'expected']) {
      assert.ok(meta[k] !== undefined, 'missing ' + k);
    }
    assert.ok(meta.checks.length >= 2);
    for (const lang of ['js', 'python']) assert.ok(meta.regression[lang], 'missing regression for ' + lang);
  });

  for (const lang of Object.keys(bug.worlds)) {
    const w = bug.worlds[lang];
    test(meta.id + '/' + lang + ': has recorded output, markers, and every check', () => {
      assert.ok(w.output !== null, 'no live run and no recorded output');
      assert.match(w.code, /~broken/);
      assert.match(w.code, /~fixed/);
      for (const c of meta.checks) assert.ok(w.checks[c.id], 'missing check ' + c.id);
    });
    test(meta.id + '/' + lang + ': the fix produces the correct answer', () => {
      for (const c of meta.checks) assert.strictEqual(w.checks[c.id].fixed, c.correct, c.id);
    });
    test(meta.id + '/' + lang + ': verdicts match the documented claims', () => {
      const exp = meta.expected[lang];
      assert.ok(exp, 'no expected verdicts documented');
      for (const c of meta.checks) assert.strictEqual(w.checks[c.id].verdict, exp[c.id], c.id);
    });
  }

  for (const [lang, cmd, ext] of [['js', 'node', '.js'], ['python', 'python3', '.py']]) {
    test(meta.id + ': ' + lang + ' regression snippet passes', () => {
      const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'obmw-reg-')), 'regression' + ext);
      fs.writeFileSync(f, meta.regression[lang]);
      const r = spawnSync(cmd, [f], { encoding: 'utf8' });
      assert.strictEqual(r.status, 0, r.stderr);
    });
  }
}

test('recorded outputs match a fresh run', () => {
  assert.deepStrictEqual(stale, []);
});

test('site/data.js is current', () => {
  const onDisk = fs.readFileSync(path.join(ROOT, 'site', 'data.js'), 'utf8');
  assert.strictEqual(onDisk, render(data));
});

test('every language entry points at a file name', () => {
  for (const l of Object.keys(LANGS)) assert.ok(LANGS[l].file);
});
