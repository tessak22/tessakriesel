/**
 * tk-terminal — changelog.js
 * Changelog rendering helpers
 * tessakriesel.com
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Changelog Entry Styling
     Styles h2 date headers and strong [project] tags
     ---------------------------------------------------------- */
  function styleChangelogContent() {
    const content = document.querySelector('.changelog-content');
    if (!content) return;

    // Style h2 date headers as git commit lines
    content.querySelectorAll('h2').forEach(function (h2) {
      h2.classList.add('changelog-date');
    });

    // Style strong project tags: [tabstack] etc.
    content.querySelectorAll('p strong').forEach(function (strong) {
      const text = strong.textContent.trim();
      if (/^\[[\w-]+\]$/.test(text)) {
        strong.classList.add('changelog-project-tag');

        // Extract key for color coding
        const key = text.slice(1, -1);
        strong.dataset.project = key;
      }
    });

    // Add prompt prefix to each entry paragraph
    content.querySelectorAll('p').forEach(function (p) {
      if (!p.querySelector('strong.changelog-project-tag')) return;
      p.classList.add('changelog-entry');
    });
  }

  /* ----------------------------------------------------------
     Changelog Stats — count entries, list active projects
     ---------------------------------------------------------- */
  function renderChangelogStats() {
    const statsEl = document.getElementById('changelog-stats');
    if (!statsEl) return;

    const content = document.querySelector('.changelog-content');
    if (!content) return;

    const dateHeaders = content.querySelectorAll('h2').length;
    const entries = content.querySelectorAll('p strong.changelog-project-tag').length;

    statsEl.innerHTML =
      '<span class="text-dim">> entries: </span><span class="text-accent">' + entries + '</span>' +
      ' &nbsp; ' +
      '<span class="text-dim">// dates: </span><span class="text-secondary">' + dateHeaders + '</span>';
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  function init() {
    styleChangelogContent();
    renderChangelogStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
