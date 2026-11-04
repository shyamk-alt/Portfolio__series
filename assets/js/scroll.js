(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = root.classList.contains('reduce');

  var bar = document.querySelector('.page-progress');
  var scenes = [].slice.call(document.querySelectorAll('[data-scene]'));

  var spyLinks = {};
  [].forEach.call(document.querySelectorAll('[data-spy]'), function (a) { spyLinks[a.getAttribute('data-spy')] = a; });
  var spySections = Object.keys(spyLinks).map(function (id) { return document.getElementById(id); }).filter(Boolean);

  var reel = document.getElementById('projects');
  var track = reel && reel.querySelector('.reel__track');
  var posters = track ? [].slice.call(track.children) : [];
  var reelNow = document.getElementById('reelNow');

  var story = document.getElementById('story');
  var words = null;
  var scrubNow = document.getElementById('scrubNow');

  var tl = document.getElementById('tl');
  var tlItems = tl ? [].slice.call(tl.querySelectorAll('.tl__item')) : [];

  var vh = window.innerHeight;
  var ticking = false;
  var activeId = null;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function measure() {
    vh = window.innerHeight;
    if (!reel || !track || reduce || !posters.length) return;
    var last = posters[posters.length - 1];
    var pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    var dist = Math.max(0, last.offsetLeft + last.offsetWidth + pad - window.innerWidth);
    reel.style.setProperty('--dist', dist + 'px');
    reel.style.height = Math.round(vh + dist * 1.15) + 'px';
  }

  function updateStory(p) {
    if (!story) return;
    if (!words) words = [].slice.call(story.querySelectorAll('.w'));
    var n = words.length;
    if (!n) return;
    var x = clamp(p / 0.82, 0, 1) * n;
    var lead = Math.min(n - 1, Math.floor(x));
    for (var i = 0; i < n; i++) {
      words[i].style.setProperty('--t', clamp(x - i, 0, 1).toFixed(3));
      words[i].classList.toggle('is-lead', i === lead && p > 0.005 && p < 0.8);
    }
    if (scrubNow) {
      var secs = Math.round(p * 90);
      scrubNow.textContent = Math.floor(secs / 60) + ':' + ('0' + (secs % 60)).slice(-2);
    }
  }

  function updateReel(p) {
    if (!reelNow || !posters.length) return;
    var idx = Math.round(p * (posters.length - 1)) + 1;
    var s = idx < 10 ? '0' + idx : String(idx);
    if (reelNow.textContent !== s) reelNow.textContent = s;
  }

  function updateTimeline() {
    if (!tl) return;
    var r = tl.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    var focus = vh * 0.62;
    tl.style.setProperty('--lp', clamp((focus - r.top) / r.height, 0, 1).toFixed(4));
    tlItems.forEach(function (item) {
      var dot = item.querySelector('.tl__dot').getBoundingClientRect();
      item.classList.toggle('is-on', dot.top + 12 < focus);
    });
  }

  function spy() {
    var cur = null;
    for (var i = 0; i < spySections.length; i++) {
      if (spySections[i].getBoundingClientRect().top <= vh * 0.4) cur = spySections[i].id;
    }
    if (cur === activeId) return;
    if (activeId && spyLinks[activeId]) spyLinks[activeId].classList.remove('is-active');
    if (cur && spyLinks[cur]) spyLinks[cur].classList.add('is-active');
    activeId = cur;
  }

  function frame() {
    ticking = false;

    if (bar) {
      var max = root.scrollHeight - vh;
      bar.style.setProperty('--page-p', max > 0 ? clamp(window.pageYOffset / max, 0, 1).toFixed(4) : '0');
    }

    for (var i = 0; i < scenes.length; i++) {
      var el = scenes[i];
      var r = el.getBoundingClientRect();
      var mode = el.getAttribute('data-scene');
      var p;
      if (mode === 'pin') p = r.height > vh ? -r.top / (r.height - vh) : 0;
      else if (mode === 'exit') p = -r.top / r.height;
      else if (mode === 'enter') p = (vh - r.top) / vh;
      else p = (vh - r.top) / (vh + r.height);
      p = clamp(p, 0, 1);

      if (el._p !== p) {
        el._p = p;
        el.style.setProperty('--p', p.toFixed(4));
        if (el === story) updateStory(p);
        if (el === reel) updateReel(p);
      }
    }

    updateTimeline();
    spy();
  }

  function request() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { measure(); request(); });
  window.addEventListener('load', function () { measure(); request(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); request(); });

  measure();
  request();
})();
