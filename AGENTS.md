# AGENTS.md — tessakriesel.com / tk-terminal
**Read this entire file before writing a single line of code.**
This is the canonical context document for every agent session working on this project.

---

## 1. Project Overview

**Site:** tessakriesel.com
**Platform:** Ghost v6 (self-hosted, open-source)
**Theme:** `tk-terminal` — fully custom Handlebars theme
**Node.js requirement:** v22 (Ghost v6 hard requirement)
**Repo:** `https://github.com/tessak22/tessakriesel` (GitHub)
**Status:** Active development

**What this is:** A dark terminal/command-line aesthetic personal site for Tessa Kriesel—DevRel leader, founder, builder. ~18 years in tech. The site is professional-forward but fully personal. Audience: developers, founders, GTM leaders. The aesthetic is developer-flavored but the content is for anyone.

---

## 2. Skills & Plugins (Install Before Any Work)

The following must be installed at the start of every new agent session before writing any code. The agent must verify installation before proceeding.

```bash
# Anthropic's official frontend design skill
# Prevents generic "AI slop" aesthetics — enforces distinctive typography,
# cohesive CSS variable systems, high-impact motion, atmospheric depth
npx skills add anthropics/skills frontend-design

# Ghost plugin for Claude Code
# Manages Ghost CMS directly — posts, pages, tags, members, changelog updates
/plugin marketplace add georgeguimaraes/claude-code-ghost
```

**`frontend-design` skill must be active throughout the entire build.** It applies to every CSS file, every template, every design decision. The terminal aesthetic must feel intentional and distinctive — not generic AI output.

**`claude-code-ghost` plugin is used post-build** for changelog automation, content updates, and Ghost management via natural language.

---

## 3. Toolchain — CLI & APIs

### 2.1 Ghost CLI (local development)

```bash
# Install globally (one time)
npm install -g ghost-cli@latest

# Install Ghost v6 locally in an empty directory
mkdir ghost-local && cd ghost-local
ghost install local

# Ghost runs at http://localhost:2368
# Ghost Admin at http://localhost:2368/ghost

# Essential commands (run from install directory)
ghost start          # Start Ghost
ghost stop           # Stop Ghost
ghost restart        # Restart Ghost
ghost log            # View logs
ghost update         # Update Ghost version
ghost ls             # List all Ghost installs

# Theme development: symlink or place theme in:
# ghost-local/content/themes/tk-terminal/
# Ghost auto-reloads on file changes (no restart needed for CSS/JS/HBS edits)
# New FILES require: ghost restart
```

### 2.2 GScan (theme validation)

```bash
# Install globally
npm install -g gscan

# Validate theme directory (must pass before any deploy)
gscan /path/to/ghost-local/content/themes/tk-terminal

# Validate a zip file
gscan -z tk-terminal.zip

# Also available at: https://gscan.ghost.org
# TARGET: Zero fatal errors, zero errors. Warnings are acceptable.
# ALWAYS run gscan against Ghost v6 compatibility before declaring Phase complete.
```

### 2.3 Ghost Admin API (programmatic content management)

Used for: changelog updates, automated content, post creation via Claude.

```bash
# Official JS client
npm install @tryghost/admin-api

# Get your Admin API key:
# Ghost Admin > Settings > Integrations > Add Custom Integration
# Copy the Admin API Key (format: id:secret)
```

```javascript
// Basic usage
const GhostAdminAPI = require('@tryghost/admin-api');

const api = new GhostAdminAPI({
  url: 'https://tessakriesel.com',   // or http://localhost:2368 for local
  version: 'v6.0',
  key: process.env.GHOST_ADMIN_API_KEY  // NEVER hardcode — use env var
});

// Update the changelog page (prepend new entry)
async function updateChangelog(newEntry) {
  // Step 1: Fetch current page (must include updated_at for collision prevention)
  const page = await api.pages.read({ id: process.env.CHANGELOG_PAGE_ID });

  // Step 2: Prepend new entry to existing HTML
  const updatedHtml = newEntry + '\n\n' + page.html;

  // Step 3: Update — must include updated_at to prevent collision error
  await api.pages.edit({
    id: page.id,
    html: updatedHtml,
    updated_at: page.updated_at  // REQUIRED — prevents UpdateCollisionError
  });
}
```

**Important v6 API notes:**
- `?limit=all` is removed — use pagination (max 100 per request)
- API version string: `"v6.0"`
- Always include `updated_at` when editing posts/pages to prevent collision errors
- Store `CHANGELOG_PAGE_ID` as an env var once the page is created

### 2.4 Ghost MCP Server (Claude-native content management)

A Ghost MCP server exists that gives Claude direct control over Ghost via natural language. **This is the preferred method for changelog updates and content management.**

```bash
# Install and configure (one time)
# Add to claude_desktop_config.json:
{
  "mcpServers": {
    "ghost-mcp": {
      "command": "npx",
      "args": ["-y", "@fanyangmeng/ghost-mcp"],
      "env": {
        "GHOST_API_URL": "https://tessakriesel.com",
        "GHOST_ADMIN_API_KEY": "your_id:your_secret",
        "GHOST_API_VERSION": "v6.0"
      }
    }
  }
}
```

**What Ghost MCP can do:**
- Browse, read, create, edit, delete posts and pages
- Manage members, newsletters, tags, tiers
- Update the changelog page directly
- Create new speaking engagement posts
- Manage webhooks

**Changelog automation flow (via Ghost MCP):**
1. Slack reminder fires (daily)
2. Tessa reviews what shipped across Tabstack, Built for Devs, Selah, open source
3. Claude formats entries into the changelog template (see Section 7)
4. Ghost MCP updates the changelog page — prepend new entry to top
5. Tessa approves before publish OR autopublish is on

### 2.5 Theme deployment workflow

```bash
# Development cycle
# 1. Edit files in /content/themes/tk-terminal/
# 2. CSS/JS/HBS changes auto-reload in browser
# 3. New files require: ghost restart
# 4. Run gscan before each phase completion

# Production deploy (zip + upload)
cd /path/to/tk-terminal
zip -r tk-terminal.zip . -x "*.git*" -x "node_modules/*"
# Upload via Ghost Admin > Settings > Design > Upload theme
# OR via Ghost Admin API:
await api.themes.upload({ file: '/path/to/tk-terminal.zip' });
await api.themes.activate('tk-terminal');

# VS Code extension (recommended for theme dev)
# Install: "Ghost Theme" extension for syntax highlighting + live preview
```

---

## 3. Repository Structure

```
tessak22/tessakriesel/          # GitHub repo — https://github.com/tessak22/tessakriesel
├── AGENTS.md                  # THIS FILE — read first every session
├── SPEC.md                    # Full design and feature specification
├── CHANGELOG.md               # Repo-level changelog (not the site changelog)
├── tk-terminal/               # The Ghost theme itself
│   ├── assets/
│   │   ├── css/
│   │   │   ├── screen.css     # Main stylesheet — design system
│   │   │   ├── terminal.css   # Terminal UI components
│   │   │   └── post.css       # Post body reading styles
│   │   ├── js/
│   │   │   ├── main.js        # Nav, typing animation, cursor, interactions
│   │   │   └── changelog.js   # Changelog rendering helpers
│   │   ├── images/
│   │   │   └── tk-logo.svg    # Purple T logo — brand asset
│   │   └── fonts/             # Self-hosted font fallbacks if needed
│   ├── partials/
│   │   ├── header.hbs         # Site header + nav
│   │   ├── footer.hbs         # Site footer
│   │   ├── post-card.hbs      # Reusable post card
│   │   ├── project-card.hbs   # Reusable project card
│   │   ├── subscribe-cta.hbs  # Newsletter CTA block
│   │   ├── social-links.hbs   # Social profile links — single source of truth
│   │   └── terminal-chrome.hbs # macOS-style terminal top bar
│   ├── default.hbs            # Base layout
│   ├── index.hbs              # Homepage
│   ├── post.hbs               # Single post
│   ├── page.hbs               # Generic page fallback
│   ├── page-about.hbs
│   ├── page-speaking.hbs
│   ├── page-projects.hbs
│   ├── page-changelog.hbs
│   ├── page-wall-of-love.hbs
│   ├── page-contact.hbs
│   ├── tag.hbs
│   ├── author.hbs
│   ├── error.hbs              # 404 page with ASCII T art
│   └── package.json
└── scripts/
    └── update-changelog.js    # Node script for changelog automation
```

---

## 4. Design System — Non-Negotiable Rules

### Colors (CSS variables — use these everywhere, no hardcoded hex)

```css
--bg-primary:    #0d0d0d;   /* Page background */
--bg-surface:    #141414;   /* Cards, code blocks */
--bg-elevated:   #1a1a1a;   /* Hover states */
--border:        #2a2a2a;   /* All borders */
--border-accent: #3d2a6e;   /* Purple-tinted borders */
--text-primary:  #c8c8c8;   /* Body text */
--text-secondary:#888888;   /* Muted text, dates, labels */
--text-dim:      #555555;   /* Very muted, decorative */
--accent:        #8161da;   /* Brand purple — PRIMARY ACCENT */
--accent-dark:   #6347b8;   /* Hover state for accent */
--green:         #28c840;   /* Success, online indicators */
--amber:         #febc2e;   /* Warning, featured badges */
```

**Brand purple is `#8161da`. This is exact. Do not approximate.**

### Typography

| Use | Font | Size | Notes |
|-----|------|------|-------|
| Hero / display | VT323 | 64px / 48px / 36px | Always uppercase |
| Body / UI | JetBrains Mono | 14px | Weight 400/700 only |
| Post body | JetBrains Mono | 15px, 1.8 line height | Comfortable reading |

- Load via Google Fonts in `default.hbs`
- **VT323 = display/hero ONLY.** Never body text, never UI labels
- **JetBrains Mono = everything else**
- No serif fonts anywhere on the site
- No external CSS frameworks — vanilla CSS only

### Layout

- Max content width: `860px`
- Border radius: `2px` — sharp, angular, no rounded cards
- No gradients, no drop shadows, no blur effects
- Dark mode only — no light mode toggle, intentional

### Ghost required helpers (every template must include)

```handlebars
{{asset}}
{{body_class}}
{{post_class}}
{{ghost_head}}
{{ghost_foot}}
```

---

## 5. Build Order (follow exactly)

### Phase 1 — Foundation
1. `package.json`
2. `default.hbs` — base layout, fonts, scanline overlay
3. `assets/css/screen.css` — full design system
4. `partials/header.hbs`
5. `partials/footer.hbs`
6. `partials/terminal-chrome.hbs`

### Phase 2 — Core pages
7. `index.hbs` — homepage with all 6 sections
8. `post.hbs` — single post
9. `page.hbs` — generic fallback
10. `partials/post-card.hbs`
11. `assets/js/main.js` — typing animation, cursor, nav

### Phase 3 — Section pages
12. `page-about.hbs`
13. `page-speaking.hbs`
14. `page-projects.hbs`
15. `partials/project-card.hbs`
16. `page-changelog.hbs`

### Phase 4 — Supporting pages + flows
17. `tag.hbs`
18. `author.hbs`
19. `page-wall-of-love.hbs`
20. `page-contact.hbs`
21. `error.hbs` — 404 with ASCII T
22. `assets/css/post.css`
23. `assets/js/changelog.js`
24. Ghost membership/subscribe flow styling
25. Ghost Search results styling

### Phase 5 — Polish + validation
26. Mobile responsiveness pass
27. `gscan` validation — zero fatal errors
28. Cross-browser: Chrome, Firefox, Safari
29. PageSpeed Insights target: 90+

---

## 6. Page Specifications (summary — see SPEC.md for full detail)

| Page | Template | Key notes |
|------|----------|-----------|
| Home | `index.hbs` | 6 sections: hero, currently, writing, speaking, about, subscribe |
| About | `page-about.hbs` | Bio + career timeline as git log |
| Speaking | `page-speaking.hbs` | Speaker card top + #speaking tag feed below |
| Projects | `page-projects.hbs` | 4 categories: My Work, My Projects, Dev Tool GTM, Archive |
| Changelog | `page-changelog.hbs` | Git log style, updated via Ghost MCP/API |
| Post | `post.hbs` | VT323 title, no featured image header |
| 404 | `error.hbs` | ASCII T art + terminal error copy |

### Projects page categories
1. `// my work` — Tabstack, Built for Devs
2. `// my projects` — Selah, StatIQ Analytics, others
3. `// dev tool gtm` — Quiver, Rival, others
4. `// archive` — Devocate (acquired), others (dimmed styling)

---

## 7. Changelog Entry Format

The changelog page (`page-changelog.hbs`) is updated by prepending new entries.

**Entry template (HTML in Ghost page):**
```html
<h2>2026-04-12</h2>
<p><strong>[tabstack]</strong> Description of what happened</p>
<p><strong>[built-for-devs]</strong> Description of what happened</p>
<p><strong>[selah]</strong> Description of what happened</p>
```

**Project tag keys:** `[tabstack]` `[built-for-devs]` `[selah]` `[site]` `[quiver]` `[rival]` `[statiq]`

**Rendering:** `page-changelog.hbs` styles `h2` tags as git commit date headers (VT323, accent color) and `strong` project tags as accent-colored badges.

**Update script:** `scripts/update-changelog.js` — Node script using `@tryghost/admin-api` to prepend a new entry. Requires env vars `GHOST_ADMIN_API_KEY` and `CHANGELOG_PAGE_ID`.

---

## 8. Ghost Tag Taxonomy

| Tag name | Slug | Usage |
|----------|------|-------|
| DevRel & Community | `devrel` | DevRel writing |
| Developer GTM | `developer-gtm` | GTM / growth writing |
| Working in Tech | `working-in-tech` | Career, industry |
| Coding & Dev | `coding-dev` | Technical posts |
| Speaking | `speaking` | **Auto-populates Speaking page feed** |
| Projects | `projects` | Project updates |
| Adventures | `adventures` | Personal |
| Being a Wife & Mom | `wife-mom` | Personal |
| Spirituality & Healing | `spirituality-healing` | Personal |
| Mentorship | `mentorship` | Mentorship |

---

## 9. Implemented Design Decisions

| Decision | Choice | Notes |
|----------|--------|-------|
| Typing animation | Yes | Hero tagline types on load, sessionStorage skips on return visits |
| ASCII art | 404 + source Easter egg | NOT in hero |
| GitHub API stats | Static in v1 | Edge function planned for v2 |
| Images in feed | No | Text-only cards, OG images auto-generated |
| Light mode | No | Dark only, intentional |
| CSS framework | None | Vanilla CSS only |
| AMP | No | Removed in Ghost v6 — do not create amp.hbs |
| Membership | Free tier at launch | Ghost infrastructure supports paid tiers later |

---

## 10. Content & Branding Rules

- **Brand purple:** `#8161da` — exact hex, no approximations
- **Logo:** Purple T icon — SVG asset at `assets/images/tk-logo.svg`
- **Experience framing:** "nearly two decades in tech" — never "20 years", never "18.5 years"
- **No images in post feed cards** — text only
- **Honesty rule:** No invented facts, fabricated numbers, or unverifiable claims in any copy
- **Built for Devs:** Developer compensation is always described as a flat fee, no dollar amount in public copy
- **Name:** Tessa Kriesel (full legal: Tessa Marie Kriesel)

## 10a. Social Profiles

Single source of truth: `partials/social-links.hbs`. Included in footer and about page.

| Platform | URL | Display handle |
|----------|-----|----------------|
| GitHub | `https://github.com/tessak22` | `@tessak22` |
| LinkedIn | `https://linkedin.com/in/tessak22` | `Tessa Kriesel` |
| Twitter/X | `https://twitter.com/tessak22` | `@tessak22` |

**To add a new profile:** One `<a>` entry in `partials/social-links.hbs` — no other files need changing.
**Styling:** Inline SVG icons, terminal bracket aesthetic `[github]`, hover in `--accent` color.
**Note:** Confirm LinkedIn handle before launch — update this table if it differs from `tessak22`.

---

## 11. Environment Variables

```bash
# Required for API/automation scripts
GHOST_ADMIN_API_KEY=id:secret          # From Ghost Admin > Integrations
GHOST_URL=https://tessakriesel.com     # Production URL
GHOST_URL_LOCAL=http://localhost:2368  # Local dev URL
CHANGELOG_PAGE_ID=                     # Fill in after Ghost setup
GHOST_API_VERSION=v6.0

# Never commit these — use .env file, add to .gitignore
```

---

## 12. Session Startup Checklist

Every new agent session must complete ALL steps in order before writing any code:

- [ ] Read `AGENTS.md` (this file) in full
- [ ] Read `SPEC.md` for full design and page specs
- [ ] Check `CHANGELOG.md` for what's been built so far
- [ ] Install frontend-design skill: `npx skills add anthropics/skills frontend-design`
- [ ] Install Ghost plugin: `/plugin marketplace add georgeguimaraes/claude-code-ghost`
- [ ] Confirm Node.js v22: `node --version`
- [ ] Confirm ghost-cli: `ghost --version`
- [ ] Confirm gscan: `gscan --version`
- [ ] Identify which Phase you're in (see Section 5)
- [ ] Start local Ghost if not running: `ghost start` (from ghost-local dir)
- [ ] Never start building without completing this checklist

---

## 13. Key External Links

| Resource | URL |
|----------|-----|
| Ghost v6 docs | https://docs.ghost.org |
| Ghost theme structure | https://docs.ghost.org/themes/structure |
| Ghost Handlebars helpers | https://docs.ghost.org/themes/helpers |
| Ghost Admin API docs | https://ghost.org/docs/admin-api/ |
| Ghost Admin API JS client | https://www.npmjs.com/package/@tryghost/admin-api |
| Ghost MCP server | https://github.com/MFYDev/ghost-mcp |
| GScan (online) | https://gscan.ghost.org |
| Ghost breaking changes | https://docs.ghost.org/changes |
| VT323 font | https://fonts.google.com/specimen/VT323 |
| JetBrains Mono font | https://fonts.google.com/specimen/JetBrains+Mono |

---

*AGENTS.md version 1.0 — April 2026*
*This file lives at the root of the tessak22/tessakriesel repo.*
*Update this file whenever major decisions change.*

---

## 15. Hosting

**Provider:** Fly.io
**Cost:** ~$3–5/mo (free tier available, credit card required)
**Domain:** tessakriesel.com
**Docs:** https://fly.io/docs

**Why Fly.io:** Persistent volumes keep Ghost content and theme files intact across deploys. Ghost v6 confirmed working. Excellent `flyctl` CLI means agents can deploy from anywhere. Lower cost than DigitalOcean. US regions available—no latency issues.

**Stack:**
- Ghost v6 via Docker image (`ghost:6-alpine`)
- Fly persistent volume (1GB) mounted at `/var/lib/ghost/content`
- SQLite (sufficient for a personal site — no separate DB service needed)
- SSL auto-provisioned by Fly.io
- Custom domain via Fly certificate

**Initial setup (one time):**
```bash
# Install flyctl CLI
curl -L https://fly.io/install.sh | sh

# Authenticate
flyctl auth signup  # or: flyctl auth login

# Set app name
appname="tessakriesel"

# Create app without deploying
flyctl launch --name $appname --image=ghost:6-alpine \
  --vm-memory 512 --region dfw --no-deploy --org personal

# Create persistent volume (1GB, Dallas region)
flyctl volumes create ghost_data --region dfw --size 1 \
  -a $appname --auto-confirm

# Add to fly.toml:
# [mounts]
# source = "ghost_data"
# destination = "/var/lib/ghost/content"
#
# [env]
# url = "https://tessakriesel.com"
# database__client = "sqlite3"
# database__connection__filename = "content/data/ghost.db"
# database__useNullAsDefault = "true"

# Deploy
flyctl deploy

# Add custom domain
flyctl certs add tessakriesel.com
```

**Theme deployment from local to production:**
```bash
# Upload via Ghost Admin API (from any machine with the API key)
const api = new GhostAdminAPI({ url: 'https://tessakriesel.com', ... });
await api.themes.upload({ file: 'tk-terminal.zip' });
await api.themes.activate('tk-terminal');
```

**Important — theme persistence:**
Fly volumes persist the Ghost content directory, so themes uploaded via the Admin API or Ghost Admin UI will survive redeploys. This is the key advantage over Railway (which has an ephemeral filesystem).

**Ghost MCP server:**
The Ghost MCP server runs locally (on your machine or in Claude Desktop) and connects to the live Fly.io Ghost instance via the Admin API URL + key. No need to run it on the server itself.

```json
{
  "mcpServers": {
    "ghost-mcp": {
      "command": "npx",
      "args": ["-y", "@fanyangmeng/ghost-mcp"],
      "env": {
        "GHOST_API_URL": "https://tessakriesel.com",
        "GHOST_ADMIN_API_KEY": "your_id:your_secret",
        "GHOST_API_VERSION": "v6.0"
      }
    }
  }
}
```

**Useful flyctl commands:**
```bash
flyctl status -a tessakriesel      # Check app health
flyctl logs -a tessakriesel        # View live logs
flyctl ssh console -a tessakriesel # SSH into the container
flyctl deploy                       # Redeploy (from project dir)
flyctl volumes list -a tessakriesel # Check volume status
```

---

## 16. Future Ideas (Not Scoped — Vet Later)

### Personal MCP Server: `tessak22`

**Concept:** A public-facing MCP server — `mcp.tessakriesel.com` or similar — that exposes Tessa's accumulated DevRel knowledge as a connectable tool for other AI agents and developers.

**What it could contain:**
- DevRel playbook content (structured, queryable)
- Developer GTM frameworks
- Career advice and mental models from 18+ years in tech
- Speaking content and frameworks
- Built for Devs methodologies

**Monetization angle to vet:**
- Free tier: basic knowledge access, rate-limited
- Paid tier: full access, higher rate limits, private knowledge base
- Could align with Built for Devs positioning — credibility proof

**Technical path (when ready to explore):**
- MCP server built on Cloudflare Workers (free tier available, global edge)
- Knowledge base stored as structured markdown or vector embeddings
- Auth via API key (free = limited key, paid = full key)
- Payment via Stripe + simple key management

**Questions to answer before committing:**
- Is there actual demand for a developer knowledge MCP?
- Does this dilute or strengthen the Built for Devs brand?
- What's the right knowledge to put behind a paywall vs. free?
- How does this interact with the Ghost newsletter/membership already in place?

**Status:** Future idea — do not build yet. Revisit when tessakriesel.com is live and Built for Devs has traction.
