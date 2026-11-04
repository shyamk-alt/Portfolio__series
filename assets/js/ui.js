(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = root.classList.contains('reduce');
  var canHover = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);

  /* split long statements into words so the scroll engine can light them up */
  [].forEach.call(document.querySelectorAll('[data-words]'), function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) {
      return '<span class="w">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
    }).join(' ');
  });

  /* number count-up */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function pad(v, n) { var s = String(v); while (s.length < n) s = '0' + s; return s; }
  function paint(n, v) {
    var padTo = +n.getAttribute('data-pad') || 0;
    n.textContent = pad(v, padTo) + (n.getAttribute('data-suffix') || '');
  }
  if (!reduce) counters.forEach(function (n) { paint(n, 0); });

  function runCounters(scope) {
    [].forEach.call(scope.querySelectorAll('[data-count]'), function (n) {
      if (n._ran) return;
      n._ran = true;
      var to = +n.getAttribute('data-count');
      if (reduce) { paint(n, to); return; }
      var t0 = null, dur = 1700;
      function step(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        paint(n, Math.round(to * (1 - Math.pow(1 - k, 4))));
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* reveal on scroll */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        runCounters(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); runCounters(el); });
  }

  /* pointer tilt on tiles and posters */
  if (canHover && !reduce) {
    [].forEach.call(document.querySelectorAll('[data-tilt]'), function (el) {
      var raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transform = 'perspective(900px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg) translateY(-4px)';
        });
      });
      el.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf);
        el.style.transform = '';
      });
    });

    /* soft light that follows the cursor */
    var bd = document.querySelector('.backdrop');
    var raf2 = 0;
    window.addEventListener('pointermove', function (e) {
      if (raf2 || !bd) return;
      raf2 = requestAnimationFrame(function () {
        raf2 = 0;
        bd.style.setProperty('--mx', e.clientX + 'px');
        bd.style.setProperty('--my', e.clientY + 'px');
      });
    }, { passive: true });
  }

  /* mobile menu */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  if (nav && burger) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    [].forEach.call(nav.querySelectorAll('.nav__links a'), function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }
})();
