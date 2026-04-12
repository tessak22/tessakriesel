# CHANGELOG.md — tessak22/tessakriesel repo

Repo-level changelog. Not the site changelog (that lives at /changelog/ on tessakriesel.com).

---

## 2026-04-12

**[site]** Initial build of `tk-terminal` Ghost theme — all 27 files across 5 phases.

Includes:
- Full design system (`screen.css`, `terminal.css`, `post.css`) with CSS variables, typography, layout
- Base layout (`default.hbs`) with VT323 + JetBrains Mono fonts, scanline overlay, ASCII Easter egg
- All page templates: homepage, post, page, about, speaking, projects, changelog, wall of love, contact, tag, author, 404
- All partials: header, footer, terminal chrome, post card, project card, subscribe CTA, social links
- JavaScript: typing animation, nav toggle, speaking year filter, changelog tag rendering
- Ghost Koenig card CSS (kg-width-wide, kg-gallery-*, kg-bookmark-*)
- Passed `gscan` validation — zero errors, zero warnings
- Changelog automation script (`scripts/update-changelog.js`) using Ghost Admin API v6.0
