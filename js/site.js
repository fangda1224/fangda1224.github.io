/* Small progressive enhancements. The page works fully without this file. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Navbar shadow once the page is scrolled
    var nav = document.getElementById('navbar-main');
    var onScroll = function () {
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 2. Collapsible abstracts with an "Abstract" button
    document.querySelectorAll('.stream-item .article-style').forEach(function (abs, i) {
      var body = abs.closest('.media-body');
      if (!body || !abs.textContent.trim()) return;

      var links = body.querySelector('.btn-links');
      if (!links) {
        links = document.createElement('div');
        links.className = 'btn-links';
        body.appendChild(links);
      }

      var id = 'abstract-' + i;
      abs.id = id;
      abs.classList.add('is-collapsible');

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-abstract';
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', id);
      btn.innerHTML = 'Abstract<i class="fas fa-chevron-down" aria-hidden="true"></i>';
      links.insertBefore(btn, links.firstChild);

      // Keep the abstract below the citation line, above the buttons
      body.insertBefore(abs, links);

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        abs.classList.toggle('is-open', !open);
        abs.style.maxHeight = open ? '0px' : abs.scrollHeight + 'px';
      });
    });

    // 3. Wrap leading years in timeline lists so they can be styled
    document.querySelectorAll('#awards li, #service li').forEach(function (li) {
      var first = li.firstChild;
      if (!first || first.nodeType !== 3) return;
      var m = first.nodeValue.match(/^\s*(\d{4}(?:[–-]\d{4})?)\s*·\s*/);
      if (!m) return;
      first.nodeValue = first.nodeValue.slice(m[0].length);
      var span = document.createElement('span');
      span.className = 'yr';
      span.textContent = m[1];
      li.insertBefore(span, first);
      li.classList.add('has-yr');
    });

    // 4. Gentle reveal on scroll
    var items = document.querySelectorAll('.stream-item, .section-heading, #awards li, #teaching li, #service li');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
    }

    // 5. Highlight the nav link of the section in view
    var links = Array.prototype.slice.call(document.querySelectorAll('#navbar-main .nav-link[data-target^="#"]'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('data-target')); })
      .filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('data-target') === '#' + e.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { spy.observe(s); });
    }
  });
})();
