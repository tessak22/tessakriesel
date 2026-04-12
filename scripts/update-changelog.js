/**
 * update-changelog.js
 * Node script to prepend a new changelog entry to the Ghost changelog page
 * via the Ghost Admin API.
 *
 * Usage:
 *   GHOST_ADMIN_API_KEY="id:secret" CHANGELOG_PAGE_ID="page_id" node scripts/update-changelog.js
 *
 * Or with a date and entries:
 *   node scripts/update-changelog.js --date "2026-04-12" --entry "[tabstack] Shipped X" --entry "[site] Updated Y"
 *
 * Env vars required:
 *   GHOST_ADMIN_API_KEY  — format: id:secret (from Ghost Admin > Integrations)
 *   GHOST_URL            — e.g. https://tessakriesel.com
 *   CHANGELOG_PAGE_ID    — the Ghost page ID for the changelog page
 *   GHOST_API_VERSION    — optional, defaults to v6.0
 */

'use strict';

const GhostAdminAPI = require('@tryghost/admin-api');

// ----------------------------------------------------------------
// Config from environment variables
// ----------------------------------------------------------------
const {
  GHOST_ADMIN_API_KEY,
  GHOST_URL = 'https://tessakriesel.com',
  CHANGELOG_PAGE_ID,
  GHOST_API_VERSION = 'v6.0'
} = process.env;

if (!GHOST_ADMIN_API_KEY) {
  console.error('Error: GHOST_ADMIN_API_KEY is required');
  process.exit(1);
}

if (!CHANGELOG_PAGE_ID) {
  console.error('Error: CHANGELOG_PAGE_ID is required');
  process.exit(1);
}

// ----------------------------------------------------------------
// Parse CLI arguments
// ----------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const result = { date: null, entries: [] };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) {
      result.date = args[++i];
    } else if (args[i] === '--entry' && args[i + 1]) {
      result.entries.push(args[++i]);
    }
  }

  // Default to today's date if not provided
  if (!result.date) {
    result.date = new Date().toISOString().split('T')[0];
  }

  return result;
}

// ----------------------------------------------------------------
// Format a changelog entry as HTML
// ----------------------------------------------------------------
function formatEntry(date, entries) {
  const lines = entries.map(e => `<p><strong>${e}</strong></p>`).join('\n');
  return `<h2>${date}</h2>\n${lines}`;
}

// ----------------------------------------------------------------
// Prepend a new entry to the changelog page
// ----------------------------------------------------------------
async function updateChangelog(date, entries) {
  if (!entries.length) {
    console.error('Error: at least one --entry is required');
    process.exit(1);
  }

  const api = new GhostAdminAPI({
    url: GHOST_URL,
    version: GHOST_API_VERSION,
    key: GHOST_ADMIN_API_KEY
  });

  console.log(`Fetching changelog page ${CHANGELOG_PAGE_ID}...`);
  const page = await api.pages.read({ id: CHANGELOG_PAGE_ID }, { formats: ['html'] });

  const newEntry = formatEntry(date, entries);
  const updatedHtml = newEntry + '\n\n' + (page.html || '');

  console.log(`Prepending entry for ${date}...`);
  await api.pages.edit({
    id: page.id,
    html: updatedHtml,
    updated_at: page.updated_at  // Required to prevent UpdateCollisionError
  });

  console.log(`✓ Changelog updated for ${date} with ${entries.length} entries.`);
}

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------
const { date, entries } = parseArgs();
updateChangelog(date, entries).catch(err => {
  console.error('Error updating changelog:', err.message || err);
  process.exit(1);
});
