# tessakriesel.com — Ghost Theme Spec
**Theme Name:** `tk-terminal`
**Platform:** Ghost v6 (open-source, self-hosted)
**Repo:** `https://github.com/tessak22/tessakriesel`
**Stack:** Handlebars templating, vanilla CSS (no Tailwind), vanilla JS
**Status:** Design spec — ready for development

---

## 1. Vision

A fully custom Ghost theme with a dark terminal/command-line aesthetic intermingled with personal branding. The site is Tessa's professional home base—showcasing her work, writing, speaking, and projects. The audience ranges from developers to founders to GTM leaders, so the aesthetic is developer-flavored but the content is accessible to anyone. It should feel like a developer's personal site that happens to belong to someone who is more than just a developer.

**Aesthetic keywords:** dark terminal, monospace, pixel/retro display headings, command-line UI patterns, chunky but readable, no gradients, no stock photos in feeds.

---

## 2. Design System

### 2.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0d0d0d` | Page background |
| `--bg-surface` | `#141414` | Cards, code blocks |
| `--bg-elevated` | `#1a1a1a` | Hover states, active nav |
| `--border` | `#2a2a2a` | All borders |
| `--border-accent` | `#3d2a6e` | Purple-tinted borders |
| `--text-primary` | `#c8c8c8` | Body text |
| `--text-secondary` | `#888888` | Muted text, dates, labels |
| `--text-dim` | `#555555` | Very muted, decorative |
| `--accent` | `#8161da` | Purple — primary accent, links, highlights |
| `--accent-dark` | `#6347b8` | Hover state for accent |
| `--green` | `#28c840` | Success states, online indicators |
| `--amber` | `#febc2e` | Warning, featured badges |

### 2.2 Typography

**Display / Hero headings:**
- Font: `VT323` (Google Fonts) — pixel/bitmap aesthetic
- Sizes: 64px (hero), 48px (page titles), 36px (section headers)
- Use: `TESSA KRIESEL`, page hero titles, section labels in terminal style
- Always uppercase

**Body / UI:**
- Font: `JetBrains Mono` (Google Fonts) — clean monospace, readable
- Sizes: 14px body, 13px cards/meta, 11px labels/tags, 10px tiny labels
- Weight: 400 regular, 700 bold only
- Line height: 1.7 body, 1.4 compact

**Post body text (reading experience):**
- Font: `JetBrains Mono` for short posts; consider `IBM Plex Mono` as an alternative for long-form readability
- Size: 15px with 1.8 line height for comfortable reading

**No serif fonts anywhere on the site.**

### 2.3 Spacing & Layout

- Max content width: `860px`
- Page padding: `2rem` horizontal on desktop, `1rem` mobile
- Grid gap: `12px` cards, `1.5rem` sections, `2.5rem` page sections
- Border radius: `2px` (sharp, minimal) — no rounded cards
- All corners intentionally angular to reinforce the terminal aesthetic

### 2.4 UI Patterns

**Scanlines overlay:** Subtle `repeating-linear-gradient` overlay on the page body — very low opacity (≤8%), adds CRT texture without being distracting.

**Prompt prefix:** Section labels and UI elements use `//` or `>` prefix styling.

**Cursor blink:** Animated block cursor (`█`) appears after the hero name, in the nav active state, and in certain decorative contexts. CSS animation, `step-end` timing.

**Terminal window chrome:** The main content area is optionally framed with a macOS-style terminal top bar (3 colored dots + path title) on desktop. On mobile this collapses cleanly.

**Tags/badges:** Small, bordered, no background fill. `border: 1px solid --border-accent`, `color: --accent`, `font-size: 9–10px`, uppercase, `letter-spacing: 0.08em`.

**Navigation active state:** Active nav item gets `background: --accent`, `color: #0d0d0d` — inverted block style.

---

## 3. Site Architecture

### 3.1 Navigation

**Primary nav:**
```
about  |  writing  |  speaking  |  projects  |  changelog
```

**Secondary / footer nav:**
- Wall of Love
- Contact
- Subscribe
- GitHub (external)
- LinkedIn (external)

### 3.2 Page Inventory

| Page | Template | Ghost Context |
|------|----------|---------------|
| Home | `index.hbs` | index |
| About | `page-about.hbs` | page |
| Writing (blog feed) | `index.hbs` or `tag.hbs` | index/tag |
| Speaking | `page-speaking.hbs` | page + tag feed |
| Projects | `page-projects.hbs` | page (static) |
| Changelog | `page-changelog.hbs` | page |
| Single Post | `post.hbs` | post |
| Wall of Love | `page-wall-of-love.hbs` | page |
| Contact | `page-contact.hbs` | page |
| Tag Archive | `tag.hbs` | tag |
| Author | `author.hbs` | author |
| Subscribe / Membership | `membership.hbs` | membership |
| 404 | `error.hbs` | error |

---

## 4. Page Specs

### 4.1 Homepage (`index.hbs`)

**Intent:** Professional showcase. Not just a blog feed. Introduces who Tessa is, what she's building, then flows into recent writing.

**Sections (top to bottom):**

1. **Terminal hero block**
   - MacOS terminal chrome (dots + `~/tessakriesel $`)
   - Name in VT323: `TESSA KRIESEL` with blinking cursor
   - Tagline: `// nearly two decades in tech · devrel · builder · founder`
   - One-line descriptor that rotates or is static: e.g. `founding gtm lead @tabstack · built for devs · selah`
   - CTA: `[subscribe]` and `[read my work]` as terminal-style buttons

2. **Currently section** (`// currently`)
   - 3 tiles showing active work: Tabstack, Built for Devs, Selah
   - Each tile: company/project name, one-line role description, status indicator (green dot = active)
   - Links to respective Projects entries or external sites

3. **Featured writing** (`// latest posts`)
   - 4–6 most recent posts, card grid (2-col desktop, 1-col mobile)
   - Card anatomy: date in accent color, title in primary text, tag badge
   - No featured images in cards — text only
   - `> load more` link to full writing archive

4. **Speaking snapshot** (`// recent talks`)
   - 2–3 most recent speaking entries
   - Minimal: event name, date, topic
   - Link to full Speaking page

5. **About blurb** (`// who i am`)
   - 2–3 sentence bio in terminal comment style (`/* ... */` or `//`)
   - Link to full About page

6. **Subscribe CTA** (`// stay in the loop`)
   - Ghost native membership/subscribe embed
   - Styled to match terminal aesthetic — input field with monospace font, `[subscribe]` button inverted

**Footer:**
- Minimal. Logo/name, secondary nav links, copyright line in `--text-dim`
- `> built with ghost · custom theme`

---

### 4.2 About (`page-about.hbs`)

- Full bio — personal + professional
- Career timeline styled as a git log or terminal output list
  - Each entry: `[year]  role @ company  // notes`
- Skills/expertise section — displayed as a tag cloud or a structured list with terminal-style categories
- Personal section — homeschooling, Waco TX, builder identity — humanizes beyond the professional
- Photo — if used, styled with a high-contrast duotone or desaturated treatment to match the dark palette
- Link to Wall of Love

---

### 4.3 Speaking (`page-speaking.hbs`)

**Two distinct sections:**

**Speaker card section (top):**
- Headshot / speaker photo
- Official speaker bio (short + long versions, copyable)
- Topics / talk titles offered
- Technical requirements / rider (if applicable)
- `[request to speak]` CTA — links to contact or form

**Speaking history feed (below):**
- Posts tagged `#speaking` rendered as a chronological feed
- Card anatomy: event name, date, location/format (in-person/virtual), talk title, link (recording or slides if available)
- Filterable by year (simple JS, no page reload required)
- Ghost-native: adding a new speaking engagement = write a post, tag it `#speaking`, done

---

### 4.4 Projects (`page-projects.hbs`)

**Replaces "Work With Me" entirely.**

**Intent:** Showcase everything Tessa is building. Let people find a way to get involved, use the products, or follow the work.

**Category sections:**

1. **`// my work`** — Active employment / primary ventures
   - Tabstack (Founding GTM Lead, Mozilla-backed)
   - Built for Devs (Founder)
   - Each: name, one-line description, status badge (active), links (site, docs, GitHub if applicable)

2. **`// my projects`** — Things I built and own
   - Selah (faith-rooted homeschool management)
   - StatIQ Analytics (part-time CTO, Texas HS sports)
   - Others as added
   - Each: name, description, tech stack tags, status, links

3. **`// dev tool gtm`** — Projects built around developer go-to-market
   - Quiver
   - Rival
   - Others
   - Each: name, description, GitHub stars (pulled via GitHub API or static), language tags, link

4. **`// archive`** — Past ventures
   - Devocate (acquired by Common Room)
   - Others
   - Styled more dimly — `--text-secondary` — to signal "completed/acquired"

**Card anatomy for all projects:**
```
[project-name]                    [status badge]
// one-line description
> tech: laravel · ghost · react
> links: [site] [github] [docs]
```

---

### 4.5 Changelog (`page-changelog.hbs`)

**Intent:** A running log of what Tessa is working on, building, shipping. Updated frequently via Claude/MCP automation.

**Visual design:** Styled as a `git log` output.

**Entry template (Ghost page content — structured markdown):**

```
## 2026-04-12

**[tabstack]** Completed first full GTM motion audit
**[built-for-devs]** Shipped new evaluator matching algorithm  
**[selah]** Locked architecture for Resource Intelligence System (#265)
**[site]** Launched new terminal theme
```

**Rendering:** The page template reads the Ghost page content and renders each `##` date heading as a commit-style entry header. Entries under it render as `> ` prefixed lines in the terminal style.

**Update mechanism:** Ghost page content (not posts) — updated via Ghost Admin API, which is MCP-accessible. Claude can append new entries by editing the page content. A Slack reminder or automation triggers daily review; Tessa approves and the update runs.

**Design details:**
- Date headers: VT323 font, accent color
- Entry lines: monospace, `--text-primary`
- Project tags like `[tabstack]` styled as accent-colored badges
- Most recent entries at the top
- No pagination needed initially — single scrollable page

---

### 4.6 Single Post (`post.hbs`)

- No featured image displayed in the post header
- Post title in VT323 (large, display)
- Meta row: date, author, tags — monospace, `--text-secondary`
- Reading time displayed
- Body text: JetBrains Mono, 15px, 1.8 line height — comfortable reading
- Code blocks: fully styled terminal aesthetic, accent-colored syntax if Ghost card supports it
- Footnotes / end matter: styled as terminal comment block
- Author card at bottom: minimal, monospace
- Next/prev post navigation: `< prev post` / `next post >` style
- Ghost native: comments (if enabled), membership gate (if enabled per post)

**OG image:** Ghost's built-in OG image generation, customized with a dark terminal template showing post title in VT323 — no photo needed.

---

### 4.7 Writing Archive / Tag Pages

- `tag.hbs` used for all tag archives
- Tag name displayed as `// tag: devrel` in terminal style
- Post count: `> 8 entries found`
- Same card layout as homepage feed
- Filterable by year (optional enhancement)

---

### 4.8 Wall of Love (`page-wall-of-love.hbs`)

- Testimonials / social proof
- Each entry styled as a terminal block quote:
  ```
  > "quote text here"
    — Name, Title @ Company
  ```
- Can be organized by category (DevRel, speaking, mentorship, etc.)

---

### 4.9 Subscribe / Membership

- Ghost native membership flows
- Styled to match terminal theme
- Free tier only at launch — architecture supports paid tiers later
- Subscribe confirmation page: terminal-style success message
  - `> success: you're subscribed.`
  - `> next email: whenever tessa ships something worth reading.`

---

## 5. Social Profiles

Social links appear in two places: the site footer (icon + handle) and the About page (fuller treatment). The system is extensible—adding a new profile is a one-line change in `partials/social-links.hbs`.

### Current profiles

| Platform | URL | Display |
|----------|-----|---------|
| GitHub | `https://github.com/tessak22` | `@tessak22` |
| LinkedIn | `https://linkedin.com/in/tessak22` | `Tessa Kriesel` |
| Twitter/X | `https://twitter.com/tessak22` | `@tessak22` |

### Implementation

**Partial:** `partials/social-links.hbs` — single source of truth for all social links. Included in footer and about page.

**Styling:** Icons as inline SVGs (no icon font dependency). Terminal-aesthetic inline treatment:

```
[github]  [linkedin]  [twitter]
```

Hover state: `--accent` color on bracket + handle text.

**To add a new profile:** Add one `<a>` entry to `partials/social-links.hbs`. No other files need changing.

**Ghost custom settings (optional v2):** Social URLs can be exposed as Ghost custom theme settings — editable from Ghost Admin without touching code. Add under `custom` in `package.json`.

---

## 6. Ghost Theme File Structure

```
tk-terminal/
├── assets/
│   ├── css/
│   │   ├── screen.css          # Main stylesheet
│   │   ├── terminal.css        # Terminal UI components
│   │   └── post.css            # Post/reading styles
│   ├── js/
│   │   ├── main.js             # Nav, cursor, UI interactions
│   │   └── changelog.js        # Changelog rendering helpers
│   └── fonts/                  # Self-hosted fallbacks if needed
├── partials/
│   ├── header.hbs              # Site header / nav
│   ├── footer.hbs              # Site footer
│   ├── post-card.hbs           # Reusable post card component
│   ├── project-card.hbs        # Reusable project card component
│   ├── subscribe-cta.hbs       # Newsletter CTA block
│   ├── terminal-chrome.hbs     # Terminal window top bar
│   └── icons/                  # SVG icons as partials
├── default.hbs                 # Base layout
├── index.hbs                   # Homepage
├── post.hbs                    # Single post
├── page.hbs                    # Generic page fallback
├── page-about.hbs
├── page-speaking.hbs
├── page-projects.hbs
├── page-changelog.hbs
├── page-wall-of-love.hbs
├── page-contact.hbs
├── tag.hbs
├── author.hbs
├── error.hbs
└── package.json
```

---

## 6. package.json

```json
{
  "name": "tk-terminal",
  "description": "Custom terminal-aesthetic Ghost theme for tessakriesel.com",
  "version": "1.0.0",
  "engines": {
    "ghost": ">=6.0.0",
    "ghost-api": "v6"
  },
  "config": {
    "posts_per_page": 10,
    "image_sizes": {
      "s": { "width": 400 },
      "m": { "width": 750 },
      "l": { "width": 1200 }
    },
    "card_assets": true
  }
}
```

---

## 7. Post Categories / Tags (Ghost Tags)

| Tag | Slug | Usage |
|-----|------|-------|
| DevRel & Community | `devrel` | DevRel writing |
| Developer GTM | `developer-gtm` | GTM / growth writing |
| Working in Tech | `working-in-tech` | Career, industry |
| Coding & Dev | `coding-dev` | Technical posts |
| Speaking | `speaking` | Speaking engagements (auto-populates Speaking page feed) |
| Projects | `projects` | Project updates |
| Adventures | `adventures` | Personal / travel |
| Being a Wife & Mom | `wife-mom` | Personal |
| Spirituality & Healing | `spirituality-healing` | Personal |
| Mentorship | `mentorship` | Mentorship |

---

## 8. Ghost Features to Enable

- [ ] Members / subscriptions (free tier)
- [ ] Newsletter (post → newsletter default behavior)
- [ ] Ghost Search (built-in, styled to match theme)
- [ ] Comments (Ghost native or disabled at launch)
- [ ] Custom OG image template (dark terminal style)
- [ ] Ghost Admin API access (for changelog MCP automation)

---

## 9. Changelog Automation Spec

**Goal:** Tessa (or an automated agent) updates the Changelog page daily via Ghost Admin API.

**Mechanism:**
1. A Slack reminder fires daily (or on a schedule)
2. Tessa reviews what shipped / happened across Tabstack, Built for Devs, Selah, open source
3. Claude formats entries into the structured changelog template
4. Ghost Admin API `PUT /ghost/api/admin/pages/{id}` updates the page content
5. Tessa approves before publish (or autopublish is enabled)

**Entry format (append to top of page body):**
```markdown
## YYYY-MM-DD

**[project]** Description of what happened
**[project]** Description of what happened
```

**Page ID:** To be filled in after Ghost setup.

---

## 10. Development Notes

- **Local dev:** Use `ghost-cli` local install + livereload
- **Validation:** Run `gscan` before upload — zero fatal errors required
- **No external CSS frameworks** — vanilla CSS only, keeps the theme lean and the aesthetic tight
- **Google Fonts:** `VT323` + `JetBrains Mono` loaded via `<link>` in `default.hbs`
- **Dark mode only:** No light mode toggle — this is an intentional aesthetic choice
- **Mobile:** Fully responsive. Terminal chrome collapses on mobile. VT323 sizes scale down. Nav becomes a hamburger or inline scroll.
- **Performance:** No images in post feeds = fast. Ghost static rendering = fast. Keep JS minimal.
- **Ghost MCP Server:** `@fanyangmeng/ghost-mcp` — connect Claude directly to Ghost via MCP for changelog updates, content management, and automation. See AGENTS.md Section 2.4 for setup.
- **Ghost Admin API JS client:** `@tryghost/admin-api` v6.0 — for scripted automation
- **Always include `updated_at`** when editing posts/pages via API to prevent UpdateCollisionError
- **AMP:** Not needed — fully removed in Ghost v6, do not create `amp.hbs`
- **API pagination:** The changelog automation must use pagination (max 100 items per request) — `?limit=all` is removed in v6
- **gscan:** Run against Ghost v6 compatibility before upload — zero fatal errors required

---

## 11. Resolved Design Decisions

### 11.1 Typing animation on hero tagline ✅
**Decision: Yes — implement on homepage hero.**

The tagline (`// nearly two decades in tech · devrel · builder · founder`) types itself out on page load using a vanilla JS typing function. No external library required.

**Implementation spec:**
- Trigger on `DOMContentLoaded`
- Type at ~45ms per character (natural, not slow)
- Blinking block cursor (`█`) appears at end when complete
- Use `sessionStorage` to detect return visits — skip animation and show full text immediately on repeat views within the same session
- Fallback: if JS disabled, full tagline displays statically

**Code location:** `assets/js/main.js` — `initHeroTyping()` function

---

### 11.2 ASCII art TK logo ✅
**Decision: 404 page + Easter egg — NOT the primary hero.**

A figlet-style block letter `T` rendered in monospace characters. Appears on:
1. **404 error page** (`error.hbs`) — large ASCII T centered on the page with terminal-style error output below it
2. **Page source Easter egg** — hidden in an HTML comment in `default.hbs` visible only if someone views source

**404 page copy:**
```
> error: 404
> path not found
> try: cd ~/tessakriesel

[ASCII T here]

> suggestion: return home?
  [yes] [no]
```

**ASCII T reference (to be refined during build):**
```
 ████████
    ██
    ██
    ██
    ██
```

**Implementation:** Static in `error.hbs`, styled with VT323 font at large size, `--accent` color.

---

### 11.3 GitHub API integration ✅
**Decision: Static data in v1, API integration in v2.**

**v1 (launch):** Hardcode GitHub stats (stars, language, last updated) directly in `page-projects.hbs` for Quiver, Rival, and any other repos. Easy to update manually or via Claude/MCP.

**v2 (post-launch enhancement):** Build a lightweight edge function (Cloudflare Worker or Vercel Edge Function) that:
- Fetches GitHub API data for specified repos
- Caches response for 1 hour to avoid rate limiting
- Returns clean JSON: `{ stars, lastCommit, language, openIssues }`
- Theme JS calls the edge function endpoint and populates project cards dynamically

**v2 edge function URL placeholder:** `https://api.tessakriesel.com/github-stats?repo=rival`

---

## 12. Future Enhancements (Post-Launch)

- GitHub API live stats via edge function (see 11.3)
- StatIQ Analytics added to Projects once public
- Speaking engagement individual detail pages (currently cards only)
- Dark/terminal-styled custom OG image template
- Search results page styled to match terminal aesthetic
- Paid membership tier + gated content (Ghost infrastructure already in place)

---

*Spec version 1.0 — April 2026*
*Built via conversation with Claude*

---

## 13. Agent Build Order

Build in this sequence. Each phase is independently shippable.

### Phase 1 — Foundation
1. `package.json` — theme config
2. `default.hbs` — base layout, Google Fonts import (VT323 + JetBrains Mono), ghost_head/ghost_foot, scanline overlay
3. `assets/css/screen.css` — full design system: CSS variables, reset, typography, terminal chrome, nav, footer, buttons, tags, cards
4. `partials/header.hbs` — nav with active state, T logo mark, terminal chrome top bar
5. `partials/footer.hbs` — minimal footer, secondary nav, built-with line
6. `partials/terminal-chrome.hbs` — reusable macOS terminal dots + path bar partial

### Phase 2 — Core pages
7. `index.hbs` — homepage: hero block with typing animation hook, Currently section, post feed, Speaking snapshot, About blurb, Subscribe CTA
8. `post.hbs` — single post: title in VT323, meta row, body styles, author card, prev/next nav
9. `page.hbs` — generic page fallback
10. `partials/post-card.hbs` — reusable post card: date, title, tag badge, no image
11. `assets/js/main.js` — typing animation (`initHeroTyping()`), sessionStorage check, cursor blink, nav interactions

### Phase 3 — Section pages
12. `page-about.hbs` — bio, career timeline as git log, skills, personal section
13. `page-speaking.hbs` — speaker card section + #speaking tag feed
14. `page-projects.hbs` — four category sections with project cards
15. `partials/project-card.hbs` — reusable project card: name, description, tech tags, status badge, links
16. `page-changelog.hbs` — git log styled page, structured markdown rendering

### Phase 4 — Supporting pages & flows
17. `tag.hbs` — tag archive with terminal-style header
18. `author.hbs` — author page
19. `page-wall-of-love.hbs` — testimonials as terminal block quotes
20. `page-contact.hbs` — contact page
21. `error.hbs` — 404 page with ASCII T art and terminal error copy
22. `assets/css/post.css` — post body reading styles, code block styling
23. `assets/js/changelog.js` — changelog entry rendering helpers

### Phase 5 — Polish & validation
24. Ghost membership/subscribe flow styling
25. Ghost Search results styling
26. Mobile responsiveness pass — all templates
27. `gscan` validation — zero fatal errors
28. Cross-browser test: Chrome, Firefox, Safari
29. Performance audit — PageSpeed Insights target: 90+

---

## 14. Agent Instructions

When building this theme, follow these rules:

- **Read this entire spec before writing a single line of code**
- **Build Phase 1 completely before moving to Phase 2** — the design system must exist before any templates
- **All colors must use CSS variables** from `screen.css` — never hardcode hex values in templates
- **No external CSS frameworks** — vanilla CSS only
- **Ghost helpers required in every template:** `{{asset}}`, `{{body_class}}`, `{{ghost_head}}`, `{{ghost_foot}}`
- **Test with gscan against Ghost v6 after Phase 4** before declaring complete
- **Mobile-first CSS** — write mobile styles first, use `min-width` media queries to scale up
- **The T logo** is referenced as `{{asset "images/tk-logo.svg"}}` — create a placeholder SVG if the final asset isn't provided yet
- **Brand purple is `#8161da`** — this is the exact hex, do not approximate
- **VT323 is display/hero only** — never use it for body text or UI labels
- **JetBrains Mono is everything else** — nav, body, cards, meta, tags, code

