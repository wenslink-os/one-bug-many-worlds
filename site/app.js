'use strict';
(function () {
  var DATA = window.OBMW_DATA;
  var REPO_URL = 'https://github.com/wenslink-os/one-bug-many-worlds';
  var STORE_KEY = 'obmw-progress-v1';
  var LABEL = { silent: 'Wrong, no warning', raises: 'Stops with an error', safe: 'Correct by default' };
  var CHOICE = { silent: 'Wrong', raises: 'Error', safe: 'Correct' };
  var MARKER = /\s*(\/\/|#)\s*~(broken|fixed)\s*$/;

  var progress = load();
  var current = null;
  var tabLang = {};
  var regLang = 'js';

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { predictions: {}, revealed: {} }; }
    catch (e) { return { predictions: {}, revealed: {} }; }
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* storage unavailable */ } }

  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') el.className = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] !== null && attrs[k] !== undefined) el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (kids || []).forEach(function (k) { if (k !== null && k !== undefined) el.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
    return el;
  }

  function worldsOf(bug) { return Object.keys(DATA.languages).filter(function (l) { return bug.worlds[l] && bug.worlds[l].checks; }); }
  function wantedOf(bug) { return Object.keys(DATA.languages).filter(function (l) { return !(bug.worlds[l] && bug.worlds[l].checks); }); }
  function pred(bugId, lang, check) { return ((progress.predictions[bugId] || {})[lang] || {})[check]; }
  function setPred(bugId, lang, check, v) {
    progress.predictions[bugId] = progress.predictions[bugId] || {};
    progress.predictions[bugId][lang] = progress.predictions[bugId][lang] || {};
    progress.predictions[bugId][lang][check] = v;
    save();
  }

  function scoreOf(bug) {
    var total = 0, right = 0;
    worldsOf(bug).forEach(function (lang) {
      bug.checks.forEach(function (c) {
        total++;
        if (pred(bug.id, lang, c.id) === bug.worlds[lang].checks[c.id].verdict) right++;
      });
    });
    return { right: right, total: total };
  }

  function renderNav() {
    var list = document.getElementById('bug-list');
    list.textContent = '';
    DATA.bugs.forEach(function (b) {
      var btn = h('button', { type: 'button', 'aria-current': b.id === current ? 'true' : 'false', onclick: function () { go(b.id); } }, [b.title]);
      if (progress.revealed[b.id]) { var s = scoreOf(b); btn.appendChild(h('span', { class: 'done' }, ['You predicted ' + s.right + ' of ' + s.total])); }
      list.appendChild(h('li', {}, [btn]));
    });
  }

  function go(id) {
    current = id;
    if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    render();
    var main = document.getElementById('main');
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function board(bug) {
    var revealed = !!progress.revealed[bug.id];
    var langs = worldsOf(bug);
    var wanted = wantedOf(bug);
    var head = h('tr', {}, [h('th', { scope: 'col' }, ['What the code does'])]);
    langs.forEach(function (l) {
      var th = h('th', { scope: 'col' }, [DATA.languages[l].label]);
      if (DATA.languages[l].version) th.appendChild(h('span', { class: 'ver' }, [DATA.languages[l].version]));
      head.appendChild(th);
    });
    wanted.forEach(function (l) { head.appendChild(h('th', { scope: 'col' }, [DATA.languages[l].label])); });

    var body = h('tbody');
    bug.checks.forEach(function (c) {
      var row = h('tr', {}, [h('th', { scope: 'row' }, [c.label])]);
      langs.forEach(function (l) {
        var td = h('td');
        if (!revealed) {
          var group = h('div', { class: 'choices', role: 'radiogroup', 'aria-label': c.label + ' in ' + DATA.languages[l].label });
          ['silent', 'raises', 'safe'].forEach(function (v) {
            var id = 'p-' + bug.id + '-' + l + '-' + c.id + '-' + v;
            var input = h('input', { type: 'radio', name: 'p-' + bug.id + '-' + l + '-' + c.id, id: id, value: v, checked: pred(bug.id, l, c.id) === v,
              onchange: function () { setPred(bug.id, l, c.id, v); } });
            group.appendChild(h('label', { for: id }, [input, CHOICE[v]]));
          });
          td.appendChild(group);
        } else {
          var r = bug.worlds[l].checks[c.id];
          var guess = pred(bug.id, l, c.id);
          var box = h('div', { class: 'result ' + r.verdict }, [
            h('strong', {}, [LABEL[r.verdict]]),
            h('code', {}, [r.broken]),
            h('span', { class: 'guess' }, [guess ? (guess === r.verdict ? 'You predicted this.' : 'You predicted: ' + CHOICE[guess] + '.') : 'No prediction.'])
          ]);
          td.appendChild(box);
        }
        row.appendChild(td);
      });
      wanted.forEach(function (l) {
        row.appendChild(h('td', { class: 'wanted' }, [h('a', { href: REPO_URL + '/blob/main/CONTRIBUTING.md' }, ['Port wanted'])]));
      });
      body.appendChild(row);
    });
    var table = h('table', { class: 'board' }, [
      h('caption', {}, [revealed ? 'What each language really does' : 'Before you look: what will each language do?']),
      h('thead', {}, [head]), body
    ]);
    return h('div', { class: 'board-wrap' }, [table]);
  }

  function codeBlock(world, lang) {
    var pre = h('pre', { class: 'code', tabindex: '0' });
    world.code.replace(/\n$/, '').split('\n').forEach(function (line) {
      var m = MARKER.exec(line);
      var cls = 'ln' + (m ? ' ' + m[2] : '');
      pre.appendChild(h('span', { class: cls }, [m ? line.replace(MARKER, '') : (line === '' ? ' ' : line)]));
    });
    return pre;
  }

  function parseChecks(stdout) {
    var out = {};
    stdout.split('\n').forEach(function (line) {
      if (line.indexOf('CHECK ') !== 0) return;
      var p = line.slice(6).split('|');
      if (p.length === 3) out[p[0]] = p[1] + '|' + p[2];
    });
    return out;
  }

  function runJsLive(world, statusEl, outEl) {
    statusEl.className = 'live-status'; statusEl.textContent = 'Running...';
    var lines = [];
    var src = 'var __l=[];var console={log:function(){__l.push(Array.prototype.join.call(arguments," "));}};' +
      'try{' + world.code + '\n;postMessage({ok:true,lines:__l});}catch(e){postMessage({ok:false,error:String(e)});}';
    var url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
    var worker = new Worker(url);
    var timer = setTimeout(function () { worker.terminate(); statusEl.className = 'live-status bad'; statusEl.textContent = 'Stopped after 3 seconds.'; }, 3000);
    worker.onmessage = function (ev) {
      clearTimeout(timer); worker.terminate(); URL.revokeObjectURL(url);
      if (!ev.data.ok) { statusEl.className = 'live-status bad'; statusEl.textContent = 'Error: ' + ev.data.error; return; }
      lines = ev.data.lines;
      var text = lines.join('\n') + '\n';
      outEl.textContent = text;
      var same = JSON.stringify(parseChecks(text)) === JSON.stringify(parseChecks(world.output));
      statusEl.className = 'live-status ' + (same ? 'ok' : 'bad');
      statusEl.textContent = same ? 'Ran in your browser. Matches the recorded output.' : 'Ran in your browser. Differs from the recorded output (engine difference).';
    };
    worker.onerror = function (ev) { clearTimeout(timer); statusEl.className = 'live-status bad'; statusEl.textContent = 'Error: ' + ev.message; };
  }

  function worldPanels(bug) {
    var langs = worldsOf(bug);
    if (!tabLang[bug.id] || langs.indexOf(tabLang[bug.id]) < 0) tabLang[bug.id] = langs[0];
    var active = tabLang[bug.id];
    var wrap = h('div');
    var tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Language' });
    langs.forEach(function (l) {
      tabs.appendChild(h('button', { type: 'button', role: 'tab', id: 'tab-' + l, 'aria-selected': l === active ? 'true' : 'false', 'aria-controls': 'panel',
        onclick: function () { tabLang[bug.id] = l; render(); } }, [DATA.languages[l].label]));
    });
    wrap.appendChild(tabs);
    var w = bug.worlds[active];
    var panel = h('div', { class: 'panel', id: 'panel', role: 'tabpanel', 'aria-labelledby': 'tab-' + active });
    panel.appendChild(h('p', {}, [w.why]));
    panel.appendChild(h('p', { class: 'legend' }, [h('span', { class: 'sw b' }), 'the mistake', h('span', { class: 'sw f' }), 'the fix']));
    panel.appendChild(codeBlock(w, active));
    var out = h('pre', { class: 'out', 'aria-label': 'Program output' }, [w.output]);
    panel.appendChild(out);
    var srcLine = w.source === 'live-run' ? 'Output captured on the build machine' : 'Output recorded earlier';
    panel.appendChild(h('p', { class: 'meta-line' }, [srcLine + (DATA.languages[active].version ? ' with ' + DATA.languages[active].version : '') + '. Each line reads: check, broken result, fixed result.']));
    if (active === 'js' && typeof Worker !== 'undefined') {
      var status = h('span', { class: 'live-status', role: 'status' });
      var btn = h('button', { type: 'button', class: 'btn secondary', onclick: function () { runJsLive(w, status, out); } }, ['Run it in this browser']);
      panel.appendChild(h('div', { class: 'actions' }, [btn, status]));
    }
    wrap.appendChild(panel);
    return wrap;
  }

  function copy(text, done) {
    function fallback() {
      var ta = h('textarea', { 'aria-hidden': 'true' }); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(true); } catch (e) { done(false); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    else fallback();
  }

  function toast(msg) {
    var t = h('div', { class: 'toast', role: 'status' }, [msg]);
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2200);
  }

  function regression(bug) {
    var langs = Object.keys(bug.regression);
    var box = h('div');
    var tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Test language' });
    langs.forEach(function (l) {
      tabs.appendChild(h('button', { type: 'button', role: 'tab', 'aria-selected': l === regLang ? 'true' : 'false', onclick: function () { regLang = l; render(); } }, [DATA.languages[l].label]));
    });
    box.appendChild(tabs);
    var text = bug.regression[regLang];
    var panel = h('div', { class: 'panel', role: 'tabpanel' }, [
      h('p', {}, ['Paste this into your own project. It fails if the mistake comes back.']),
      h('pre', { class: 'code', tabindex: '0' }, text.replace(/\n$/, '').split('\n').map(function (l) { return h('span', { class: 'ln' }, [l === '' ? ' ' : l]); })),
      h('div', { class: 'actions' }, [
        h('button', { type: 'button', class: 'btn secondary', onclick: function () { copy(text, function (ok) { toast(ok ? 'Test copied' : 'Copy failed. Select the code and copy it by hand.'); }); } }, ['Copy test'])
      ])
    ]);
    box.appendChild(panel);
    return box;
  }

  function render() {
    renderNav();
    var bug = DATA.bugs.filter(function (b) { return b.id === current; })[0];
    var main = document.getElementById('main');
    main.textContent = '';
    main.appendChild(h('h1', {}, [bug.title]));
    main.appendChild(h('p', { class: 'hook' }, [bug.hook]));
    main.appendChild(h('p', { class: 'concept' }, [bug.concept]));
    main.appendChild(board(bug));

    var revealed = !!progress.revealed[bug.id];
    var actions = h('div', { class: 'actions' });
    if (!revealed) {
      actions.appendChild(h('button', { type: 'button', class: 'btn', onclick: function () { progress.revealed[bug.id] = true; save(); render(); document.getElementById('main').querySelector('.board-wrap').scrollIntoView({ block: 'start' }); } }, ['Show what really happens']));
    } else {
      var s = scoreOf(bug);
      actions.appendChild(h('span', { class: 'score' }, ['You predicted ' + s.right + ' of ' + s.total + ' correctly.']));
      actions.appendChild(h('button', { type: 'button', class: 'btn secondary', onclick: function () { delete progress.revealed[bug.id]; delete progress.predictions[bug.id]; save(); render(); } }, ['Try again']));
    }
    main.appendChild(actions);

    if (!revealed) {
      main.appendChild(h('p', { class: 'hidden-until' }, ['The code, the explanation and the fix appear after you look.']));
      return;
    }
    main.appendChild(h('h2', {}, ['The code in each world']));
    main.appendChild(worldPanels(bug));
    main.appendChild(h('h2', {}, ['The fix']));
    main.appendChild(h('p', { class: 'concept' }, [bug.fix]));
    main.appendChild(h('h2', {}, ['A test to keep']));
    main.appendChild(regression(bug));
  }

  document.getElementById('repo-link').setAttribute('href', REPO_URL + '/blob/main/CONTRIBUTING.md');
  window.addEventListener('hashchange', function () {
    var id = location.hash.slice(1);
    if (id && id !== current && DATA.bugs.some(function (b) { return b.id === id; })) { current = id; render(); }
  });
  var start = location.hash.slice(1);
  current = DATA.bugs.some(function (b) { return b.id === start; }) ? start : DATA.bugs[0].id;
  render();
})();
