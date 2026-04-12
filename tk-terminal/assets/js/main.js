/**
 * tk-terminal — main.js
 * Nav, typing animation, cursor, UI interactions
 * tessakriesel.com
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Typing Animation — Hero tagline
     ---------------------------------------------------------- */
  function initHeroTyping() {
    const el = document.getElementById('hero-tagline');
    if (!el) return;

    const fullText = el.dataset.text || el.textContent.trim();
    const sessionKey = 'tk_hero_typed';

    // Skip animation on return visits within the same session
    if (sessionStorage.getItem(sessionKey)) {
      el.textContent = fullText;
      return;
    }

    // Clear and animate
    el.textContent = '';
    let i = 0;
    const speed = 45; // ms per character

    function type() {
      if (i < fullText.length) {
        el.textContent += fullText.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        sessionStorage.setItem(sessionKey, '1');
      }
    }

    // Small delay before starting
    setTimeout(type, 400);
  }

  /* ----------------------------------------------------------
     Mobile Nav Toggle
     ---------------------------------------------------------- */
  function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const nav    = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.textContent = isOpen ? '[close]' : '[menu]';
    });

    // Close nav when a link is clicked (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        toggle.textContent = '[menu]';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        toggle.textContent = '[menu]';
      }
    });
  }

  /* ----------------------------------------------------------
     Active Nav State
     ---------------------------------------------------------- */
  function initActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.site-nav a');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      // Exact match or prefix match for sections
      if (
        currentPath === href ||
        (href !== '/' && currentPath.startsWith(href))
      ) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     Speaking Filter — Year filter (no page reload)
     ---------------------------------------------------------- */
  function initSpeakingFilter() {
    const filterContainer = document.getElementById('speaking-year-filter');
    const items = document.querySelectorAll('[data-speaking-year]');
    if (!filterContainer || !items.length) return;

    filterContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-year]');
      if (!btn) return;

      const year = btn.dataset.year;

      // Update active state
      filterContainer.querySelectorAll('[data-year]').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Filter items
      items.forEach(function (item) {
        if (year === 'all' || item.dataset.speakingYear === year) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Ghost Search — Keyboard shortcut
     ---------------------------------------------------------- */
  function initSearchShortcut() {
    document.addEventListener('keydown', function (e) {
      // Ctrl+K or Cmd+K to open Ghost search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchBtn = document.querySelector('[data-ghost-search]');
        if (searchBtn) searchBtn.click();
      }
    });
  }

  /* ----------------------------------------------------------
     Page source Easter egg — ASCII T in HTML comment
     ---------------------------------------------------------- */
  // This is printed to HTML via default.hbs — handled in template

  /* ----------------------------------------------------------
     Changelog project tag rendering
     ---------------------------------------------------------- */
  function initChangelogTags() {
    // Tag mapping — project key → display label
    const tagMap = {
      'tabstack':      'tabstack',
      'built-for-devs': 'built-for-devs',
      'selah':         'selah',
      'site':          'site',
      'quiver':        'quiver',
      'rival':         'rival',
      'statiq':        'statiq'
    };

    const content = document.querySelector('.changelog-content');
    if (!content) return;

    // Replace [tag] patterns with styled spans
    const walker = document.createTreeWalker(
      content,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    textNodes.forEach(function (textNode) {
      const text = textNode.textContent;
      if (!/\[[\w-]+\]/.test(text)) return;

      const span = document.createElement('span');
      span.innerHTML = text.replace(/\[([\w-]+)\]/g, function (match, key) {
        if (tagMap[key]) {
          return '<span class="changelog-tag">[' + tagMap[key] + ']</span>';
        }
        return match;
      });

      textNode.parentNode.replaceChild(span, textNode);
    });
  }

  /* ----------------------------------------------------------
     Subtle cursor trail on desktop (optional, performant)
     ---------------------------------------------------------- */
  function initCursorEffect() {
    // Only on non-touch, non-reduced-motion devices
    if (
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    // Minimal — just add a class to body so CSS can style cursor
    document.body.classList.add('has-custom-cursor');
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  function init() {
    initHeroTyping();
    initNavToggle();
    initActiveNav();
    initSpeakingFilter();
    initSearchShortcut();
    initChangelogTags();
    initCursorEffect();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
