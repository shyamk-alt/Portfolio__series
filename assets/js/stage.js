(function () {
  'use strict';

  var root = document.documentElement;
  var stage = document.getElementById('stage');
  if (!stage) return;

  var picker = document.getElementById('picker');
  var skipBtn = document.getElementById('stageSkip');
  var profiles = [].slice.call(stage.querySelectorAll('.profile'));
  var welcome = document.getElementById('welcome');
  var playBtn = document.getElementById('playBtn');
  var navWho = document.getElementById('navWho');
  var navWhoArt = document.getElementById('navWhoArt');
  var navWhoName = document.getElementById('navWhoName');
  var tiles = [].slice.call(document.querySelectorAll('[data-viewer-target]'));
  var reduce = root.classList.contains('reduce');

  var viewers = {
    shyam: { name: 'Shyam', line: 'Welcome. Start where the story starts.', cta: '#story', label: 'Play the story' },
    hiring: { name: 'Hiring', line: 'Short on time? The reel shows four things I’ve built — start there.', cta: '#projects', label: 'Play the reel' },
    dev: { name: 'Dev', line: 'Fellow builder — jump straight to the stack behind the scenes.', cta: '#skills', label: 'Open the stack' },
    design: { name: 'Design', line: 'Interfaces first. The reel is where the pixels and the motion live.', cta: '#projects', label: 'See the interfaces' }
  };

  var timers = [];
  var current = 'shyam';
  var pending = null;
  var live = root.classList.contains('is-live');

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function stopTimers() { while (timers.length) clearTimeout(timers.pop()); }

  function setStage(list) {
    ['t-in', 't-shine', 't-out', 't-picker', 't-static'].forEach(function (c) { stage.classList.remove(c); });
    list.forEach(function (c) { stage.classList.add(c); });
  }

  function applyViewer(key) {
    var v = viewers[key] || viewers.shyam;
    current = viewers[key] ? key : 'shyam';

    if (welcome) welcome.textContent = v.line;
    if (playBtn) {
      playBtn.setAttribute('href', v.cta);
      var label = playBtn.querySelector('span');
      if (label) label.textContent = v.label;
    }
    if (navWhoName) navWhoName.textContent = v.name;

    var btn = stage.querySelector('.profile[data-viewer="' + current + '"]');
    var art = btn && btn.querySelector('.profile__art');
    if (art && navWhoArt) {
      navWhoArt.innerHTML = art.innerHTML;
      var g = art.style.getPropertyValue('--g');
      if (g) navWhoArt.style.setProperty('--g', g); else navWhoArt.style.removeProperty('--g');
    }

    tiles.forEach(function (t) {
      var targets = (t.getAttribute('data-viewer-target') || '').split(/\s+/);
      t.classList.toggle('is-rec', targets.indexOf(current) > -1);
    });

    try { sessionStorage.setItem('series-viewer', current); } catch (e) {}
  }

  function goLive(key) {
    stopTimers();
    pending = null;
    applyViewer(key);
    stage.classList.add('is-gone');
    stage.setAttribute('aria-hidden', 'true');
    root.classList.remove('is-locked');
    if (!live) {
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      root.style.scrollBehavior = '';
    }
    live = true;
    root.classList.add('is-live');
    window.dispatchEvent(new CustomEvent('series:live'));
  }

  function resetPicker() {
    picker.classList.remove('is-picking');
    profiles.forEach(function (p) { p.classList.remove('is-picked'); });
    pending = null;
  }

  function focusFirst() {
    if (profiles[0]) { try { profiles[0].focus({ preventScroll: true }); } catch (e) { profiles[0].focus(); } }
  }

  function playIntro() {
    stopTimers();
    resetPicker();
    root.classList.add('is-locked');
    stage.classList.remove('is-gone');
    stage.removeAttribute('aria-hidden');

    if (reduce) {
      setStage(['t-static', 't-picker']);
      return;
    }
    setStage([]);
    void stage.offsetWidth;
    setStage(['t-in']);
    later(function () { stage.classList.add('t-shine'); }, 1500);
    later(function () { stage.classList.add('t-out'); }, 3200);
    later(function () { stage.classList.add('t-picker'); focusFirst(); }, 3800);
  }

  function openPicker() {
    stopTimers();
    resetPicker();
    root.classList.add('is-locked');
    stage.classList.remove('is-gone');
    stage.removeAttribute('aria-hidden');
    setStage(['t-static', 't-picker']);
    focusFirst();
  }

  profiles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (pending) return;
      pending = btn.getAttribute('data-viewer');
      picker.classList.add('is-picking');
      btn.classList.add('is-picked');
      var key = pending;
      later(function () { goLive(key); }, reduce ? 0 : 850);
    });
  });

  if (skipBtn) skipBtn.addEventListener('click', function () { goLive(pending || (live ? current : 'shyam')); });
  if (navWho) navWho.addEventListener('click', openPicker);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !stage.classList.contains('is-gone')) goLive(pending || current);
  });

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  var saved = null;
  try { saved = sessionStorage.getItem('series-viewer'); } catch (e) {}

  if (live) {
    window.scrollTo(0, 0);
    applyViewer(saved);
    stage.classList.add('is-gone');
    stage.setAttribute('aria-hidden', 'true');
  } else {
    window.scrollTo(0, 0);
    applyViewer('shyam');
    playIntro();
  }
})();
