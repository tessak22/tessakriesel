#!/usr/bin/env python3
"""
import-changelog-github.py
Fetches tessak22/changelog README.md from GitHub, converts the markdown
to Ghost changelog HTML format, and uploads to the Ghost changelog page.

Usage:
  GHOST_ADMIN_API_KEY="id:secret" python3 scripts/import-changelog-github.py

Or with the defaults embedded below (dev only — don't commit secrets).
"""

import re
import json
import hmac
import hashlib
import base64
import time
from urllib import request as url_req, error as url_err

# ----------------------------------------------------------------
# Config
# ----------------------------------------------------------------
GHOST_URL     = 'https://tessakriesel.fly.dev'
GHOST_KEY     = '69dc201ef150370287782a15:8ba64d9db6c83e503b33d4de0756b98d4c215f0edb5c23a080abeca2f4dcdea5'
GITHUB_RAW    = 'https://raw.githubusercontent.com/tessak22/changelog/main/README.md'
CHANGELOG_SLUG = 'changelog'

# ----------------------------------------------------------------
# Month name → number
# ----------------------------------------------------------------
MONTHS = {
    'january':1,'february':2,'march':3,'april':4,'may':5,'june':6,
    'july':7,'august':8,'september':9,'october':10,'november':11,'december':12
}

# ----------------------------------------------------------------
# Bold project name → tag key
# Longest / most-specific patterns first to avoid partial matches
# ----------------------------------------------------------------
PROJECT_PATTERNS = [
    (r'built[\s-]for[\s-]devs',  'built-for-devs'),
    (r'control[\s-]plane',       'control-plane'),
    (r'devrel growth advisor',   'devrel'),
    (r'pagerduty|pager duty',    'speaking'),
    (r'pre-hire',                'tabstack'),
    (r'huggingface',             'selah'),
    (r'linkedin',                'site'),
    (r'quiver',                  'quiver'),
    (r'rival',                   'rival'),
    (r'selah',                   'selah'),
    (r'tabstack',                'tabstack'),
    (r'statiq',                  'statiq'),
    (r'laravel',                 'laravel'),
    (r'devrel',                  'devrel'),
]

def project_key(bold_text):
    text = bold_text.lower()
    for pattern, key in PROJECT_PATTERNS:
        if re.search(pattern, text):
            return key
    return 'site'

# ----------------------------------------------------------------
# Clean markdown inline formatting from a string
# ----------------------------------------------------------------
def clean(text):
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)          # bold
    text = re.sub(r'\*([^*]+)\*', r'\1', text)               # italic
    text = re.sub(r'`([^`]+)`', r'\1', text)                 # code
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)     # links
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# ----------------------------------------------------------------
# Parse one day's text block into [(key, description), ...]
# ----------------------------------------------------------------
def parse_day(text):
    entries = []
    # Split into paragraphs
    paragraphs = [p.strip() for p in re.split(r'\n{2,}', text) if p.strip()]

    for para in paragraphs:
        # Skip tag-only lines: `tag1` `tag2`
        if re.match(r'^(`[\w-]+`[\s]*)+$', para):
            continue
        # Skip horizontal rules
        if re.match(r'^-{3,}$', para):
            continue

        # Paragraph starting with **BoldName**: or **BoldName** (parenthetical):
        m = re.match(r'^\*\*([^*\n]+)\*\*\s*(?:\([^)]*\))?\s*[:\u2014\-]\s*(.*)', para, re.DOTALL)
        if m:
            key  = project_key(m.group(1).strip())
            desc = clean(m.group(2))
            if desc:
                entries.append((key, desc))
        else:
            # Free-form line — attach as a site/meta note if substantial
            stripped = clean(para)
            if len(stripped) > 30 and not stripped.startswith('#'):
                entries.append(('site', stripped))

    return entries

# ----------------------------------------------------------------
# Parse full README into [(date_str, [(key, desc)]), ...]
# Most-recent first (README is already newest-first).
# ----------------------------------------------------------------
def parse_readme(md):
    result = []
    current_year  = None
    current_month = None
    current_day   = None
    buf = []

    def flush():
        if current_day is None or current_year is None:
            return
        date = f'{current_year}-{current_month:02d}-{current_day:02d}'
        entries = parse_day('\n\n'.join(buf))
        if entries:
            result.append((date, entries))

    for line in md.splitlines():
        # ## April 2026
        m = re.match(r'^## (\w+)\s+(\d{4})\s*$', line)
        if m:
            flush()
            current_year  = int(m.group(2))
            current_month = MONTHS.get(m.group(1).lower(), 1)
            current_day   = None
            buf = []
            continue

        # ### April 12  or  ### January  (no day → use day 1)
        m = re.match(r'^### (\w+)\s*(\d*)\s*$', line)
        if m:
            flush()
            month_word = m.group(1).lower()
            day_num    = m.group(2)
            if month_word in MONTHS and not day_num:
                # Section like "### January" with no day
                current_day = 1
            elif day_num:
                current_day = int(day_num)
            buf = []
            continue

        # Accumulate content
        if current_day is not None:
            buf.append(line)

    flush()
    return result

# ----------------------------------------------------------------
# Convert parsed structure to Ghost HTML
# ----------------------------------------------------------------
def to_ghost_html(parsed):
    parts = []
    for date, entries in parsed:
        parts.append(f'<h2>{date}</h2>')
        for key, desc in entries:
            parts.append(f'<p><strong>[{key}]</strong> {desc}</p>')
    return '\n'.join(parts)

# ----------------------------------------------------------------
# Ghost Admin API helpers
# ----------------------------------------------------------------
def make_jwt():
    kid, secret_hex = GHOST_KEY.split(':')
    def b64u(data):
        if isinstance(data, str): data = data.encode()
        return base64.urlsafe_b64encode(data).rstrip(b'=').decode()
    hdr  = b64u(json.dumps({'alg':'HS256','kid':kid,'typ':'JWT'}))
    iat  = int(time.time())
    pay  = b64u(json.dumps({'iat':iat,'exp':iat+300,'aud':'/admin/'}))
    sig  = b64u(hmac.new(bytes.fromhex(secret_hex), f'{hdr}.{pay}'.encode(), hashlib.sha256).digest())
    return f'{hdr}.{pay}.{sig}'

def api(method, path, data=None):
    jwt  = make_jwt()
    body = json.dumps(data).encode() if data else None
    req  = url_req.Request(
        f'{GHOST_URL}/ghost/api/admin/{path}',
        data=body,
        method=method,
        headers={
            'Authorization': f'Ghost {jwt}',
            'Content-Type': 'application/json',
        }
    )
    with url_req.urlopen(req, timeout=30) as r:
        return json.loads(r.read())

# ----------------------------------------------------------------
# Main
# ----------------------------------------------------------------
def main():
    # 1. Fetch README from GitHub
    print('Fetching README from GitHub...')
    with url_req.urlopen(GITHUB_RAW, timeout=15) as r:
        md = r.read().decode('utf-8')
    print(f'  {len(md.splitlines())} lines fetched')

    # 2. Parse
    print('Parsing markdown...')
    parsed = parse_readme(md)
    total_entries = sum(len(e) for _, e in parsed)
    print(f'  {len(parsed)} days, {total_entries} entries')

    # 3. Convert to HTML
    html = to_ghost_html(parsed)

    # 4. Find changelog page
    print('Finding changelog page...')
    resp = api('GET', f'pages/?filter=slug:{CHANGELOG_SLUG}&fields=id,slug,title,updated_at')
    pages = resp.get('pages', [])
    if not pages:
        print(f'ERROR: No page found with slug "{CHANGELOG_SLUG}"')
        return
    page = pages[0]
    print(f'  Found: "{page["title"]}" ({page["id"]})')

    # 5. Upload
    print('Updating Ghost changelog page...')
    result = api('PUT', f'pages/{page["id"]}/', {
        'pages': [{
            'id':         page['id'],
            'html':       html,
            'updated_at': page['updated_at']
        }]
    })
    updated = result['pages'][0]
    print(f'  Done. slug={updated["slug"]}, updated_at={updated["updated_at"]}')
    print(f'\n✓ Changelog imported: {len(parsed)} dates, {total_entries} entries')
    print(f'  View at: {GHOST_URL}/changelog/')

if __name__ == '__main__':
    main()
