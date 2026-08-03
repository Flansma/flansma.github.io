# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Local dev server (http://localhost:4000)
bundle exec jekyll serve

# One-off build into _site/
bundle exec jekyll build
```

Deployment: pushing to `main` triggers `.github/workflows/jekyll.yml` (uses `actions/jekyll-build-pages` → GitHub Pages, ~1–2 min). There is no test suite — validate locally by running `jekyll serve` and visually checking pages, or rely on the GH Action build to fail-fast on Liquid/YAML errors.

GitHub Pages plugin allowlist: only `jekyll-seo-tag`, `jekyll-sitemap`, `jekyll-redirect-from` are whitelisted (`_config.yml`). Do not add other plugins — they will be silently dropped at build.

## Content model: collections, not data files

The site has five content collections (`_publications`, `_preprints`, `_talks`, `_awards`, `_writings`) plus `_data/*.yml` for non-itemized info (profile, bio, skills, navigation, scholarships, experience). **Anything that's a discrete dated item belongs in a collection, not a data file** — collections give you sortable dates, auto-aggregation in Recent Works, individual detail pages, JSON-LD, and badge rendering. The writings collection was originally a data file and was migrated for this exact reason.

Note: there is no `_projects/` collection. For paper-backed work, the publication page is the canonical hub — add `links:` (GitHub, HuggingFace, etc.) to its frontmatter rather than creating a separate project entry. A dedicated projects collection only makes sense if a non-paper software/tool needs its own landing page; reintroduce it then.

To add a new content item, copy the matching scaffold from `_templates/` (excluded from build) into the right collection folder. **Never add a `layout:` line** — `_config.yml` `defaults` auto-applies layouts per collection type.

| Collection | Output | What's auto-emitted |
|---|---|---|
| `_publications` | individual pages | `ScholarlyArticle` JSON-LD, `citation_*` meta (Google Scholar), DOI/PubMed/PMC identifiers |
| `_preprints` | individual pages | `ScholarlyArticle` (preprint status), arXiv id |
| `_talks` | individual pages | `Event` + nested `ScholarlyArticle` JSON-LD (`attendance: online\|mixed\|offline` drives `eventAttendanceMode` and `VirtualLocation` vs `Place`; omitting it means in-person) |
| `_awards` | no detail page | Appended to `Person.award[]` JSON-LD + AWARDS section |
| `_writings` | no detail page | WRITINGS section + Recent Works (no detail page since these are typically external magazine articles) |

## Cross-cutting conventions

**Date semantics per collection.** The `date:` field (and YYYY-MM-DD filename prefix) is the chronological anchor used for sorting and Recent Works ordering. Each collection has a fixed convention:

| Collection | `date:` means |
|---|---|
| `_publications` | publication date (or acceptance date while `status: in press`) |
| `_preprints` | arXiv submission date |
| `_talks` | presentation date |
| `_awards` | award ceremony / announcement date (not the conference start) |
| `_writings` | acceptance / in-press entry date (or actual issue release date once published) |

**Lifecycle rule:** while `status: in press`, `date:` should reflect the **most recent status change** (acceptance/in-press entry), not a future scheduled date. This keeps Recent Works ordering meaningful — items appear in the order their status actually changed. When the item is published, update both `date:` to the actual publication date AND remove the `status:` line. Rename the file's date prefix to match.

**Status as a lifecycle field.** Items can carry `status: submitted` or `status: in press`. Removing the line is the only edit needed when an item moves to "published" — badges (both inline `badge-status-*` on bibliography rows and `mini-badge` on Recent Works feed) auto-disappear. Don't bake status into venue/title strings.

**Recent Works aggregation** (`index.html`, search for `site.publications | concat:`). The feed concatenates all collections, sorts by date, and switches type label via a `{% case type %}` block. Adding a new collection requires updating three places: the `concat` chain, the type-label case block, and a `.type-badge.type-{name}` CSS rule in `assets/css/style.css`. The `mini-badge` for status currently shows for `type == 'article' or type == 'writing'` — extend the condition if other types need lifecycle badges.

**Author name highlighting** goes through one component: `{% include authors-hl.html item=<item> %}`. It underlines the owner's name (`.highlight-name`), reads that name from `_data/profile.yml` (`name.full`) rather than hardcoding it, and normalizes `authors` whether it's a YAML list or a legacy comma string, falling back to `presenter` for solo talks. Every author list on the site routes through it — `_includes/biblio-item.html`, the PRESENTATIONS loop and `.selected-authors`/`.section-meta` blocks in `index.html`, and the `publication`/`preprint`/`talk` layouts. Add authors to a new section by calling the include, never by re-implementing the `replace` filter. The `.highlight-name` CSS rule is deliberately unscoped so it works wherever the include lands.

**Never put an author list inside an element carrying `data-lang-*`.** On language switch `i18n.js` deletes that element's text nodes and inserts the translated string; the highlighted `<span>` survives as an element while every co-author (a text node) vanishes. Put the `data-lang-*` attributes on an inner span wrapping only the translated text — see the venue span in the PRESENTATIONS loop. The same mechanism silently drops any other text (dates, separators) that shares an element with `data-lang-*`, so keep those elements text-only.

**Authors live in front matter, not in the body.** Talk/publication layouts render the author line themselves. Repeating an `**Authors:**` line in the Markdown body duplicates it on the page and drifts out of sync with `content_ja`/`content_ko`.

**i18n is intentionally partial** (`assets/js/i18n.js`). Fixed UI strings (nav labels, section titles, ABOUT body, hero tagline) swap client-side via the `I18N` dict by language. Bibliographic entries (publications/preprints/talks/awards/writings) stay in source language — a Japanese magazine article keeps its Japanese title across all language modes, by convention. To provide an English subtitle for a non-English entry, use the `subtitle:` field — **`_writings` only**; it is rendered by the WRITINGS section in `index.html` and by nothing else, so setting it on a publication/preprint/talk silently does nothing. Extend `_includes/biblio-item.html` and the detail layouts first if another collection needs it.

**`data-lang-en` means "what to show in EN mode", not "English text."** A talk's `venue`/`venue_en` is usually the Japanese source name. So `i18n.js` deliberately does not stamp a `lang` attribute on the elements it swaps — that would assert a language the text does not have. Language of parts is marked **statically** instead, on regions that really are fixed English: `lang="en"` on the four `.biblio-list` lists, `.selected-list`, `.news-feed`, `.skill-list` in `index.html`, on the talk author line, and on a talk `<h1>` only when it has no `title_ja`/`title_ko`. Without this the root `lang` flip made screen readers read English paper titles in a Japanese voice (WCAG 3.1.2). Known residual: a Japanese venue string inside a `lang="en"` list is still marked `en`; fixing it needs per-entry language metadata on every venue field, which isn't worth the authoring burden.

**Theme and scroll-reveal are bootstrapped in `<head>`, not in `script.js`.** An inline script in `_includes/head.html` sets `data-theme` before first paint (`script.js` runs at `DOMContentLoaded`, which gave dark-mode readers a white flash then a 300ms fade on every navigation) and adds a `js` class to `<html>`. The scroll-reveal's hidden state lives in CSS gated on `html.js` and `prefers-reduced-motion: no-preference`, with an `@media print` override — never write `opacity: 0` from JS. It used to be inline-styled from `script.js`, so printing or saving the homepage as a PDF produced blank sections below the fold, and JS-off visitors saw nothing at all. `script.js` only toggles `.is-visible`.

**No third-party requests. Keep it that way.** Inter is self-hosted from `assets/fonts/` (declared at the top of `style.css`, SIL OFL text in `assets/fonts/OFL.txt`), so the site loads nothing from `fonts.googleapis.com`/`fonts.gstatic.com`. The old "everyone already has Google Fonts cached" argument stopped being true when browsers partitioned the HTTP cache per-site in 2020 — a Google-hosted font is a fresh cross-origin DNS + TLS + fetch for every first-time visitor, i.e. cost with no benefit, plus a third-party dependency in the render path. Both `latin` and `latin-ext` subsets are declared with `unicode-range`, so only what the text actually needs is fetched. Note the font preload needs `crossorigin` even same-origin — fonts are always fetched in CORS mode, and omitting it makes the browser download the file twice.

**Icons are inline SVG via `{% include icon.html name="…" %}`** (`_includes/icon.html`, official Material Icons Outlined geometry, Apache 2.0). The Material Icons *webfont* was removed: it cost 155 KB to draw eight glyphs and, because it loaded non-blocking with `display=swap` and the CSS never set a local `font-family`, the ligature names rendered as the literal words "light_mode"/"psychology" until it arrived. Add a glyph by adding a `when` branch, not by reintroducing the font. Likewise **CJK is served from the reader's OS fonts** (see the `body` stack in `style.css`) — `Noto Sans KR` used to be fetched on every page for ~1.9 MB of woff2 and forced Korean glyph forms onto Japanese text. Inter is requested as one variable axis (`wght@400..700`), which is why `font-weight: 500` now renders.

**There is no site-wide share card, on purpose.** `_config.yml` `defaults` sets no `image:`, so an entry's `image:` is its *own* picture — used as the page hero and as its og:image — and a page without one emits no og:image at all. A single default would have made one talk's photo the card for every publication and preprint, with that talk's (older) title visible on the slide inside it. The homepage sets `image: /assets/img/og-card.jpg` in its own front matter, because that card represents the homepage specifically.

Consequences worth knowing: `image:` is never injected, so `{% if page.image %}` means what it says and needs no `!= site.default_image` guard (that guard and the `default_image` config key are both gone). `thumb:` is a separate field for the 240×160 PRESENTATIONS crop. Awards use `image:` with a `-960` derivative for their 480px accordion box; the header logo is `-128` for its 64px slot. And note what a portrait `image:` means socially: X/LinkedIn centre-crop it to 1.91:1 in link previews, which on a podium photo cuts the top of the head off — that is a property of the photo's aspect ratio, not something the site controls.

Originals stay in the repo as sources. `awards/cbi2025-award.jpg` and `okuno-lab-logo-white.png` are intentionally unreferenced — do not "clean them up". Generate derivatives with `sips --resampleWidth N`, `sips -c H W` to crop centred, or `sips -c H W --cropOffset Y X` when the centre is the wrong place to cut. Re-check the byte count afterwards: on already-compressed sources, re-encoding can make the file *bigger* (the CBI photo grew from 442 KB to 546 KB at `formatOptions 82`), so the win comes from resizing, not from quality.

**Images need `image_width`/`image_height` in front matter.** Jekyll cannot measure images without a plugin and GitHub Pages allows none, so the talk hero and award photo take their intrinsic size from these fields; omit them and the image reserves no height and the page jumps when it decodes. `.biblio-thumb` is exempt (fixed size in CSS).

**Header swap pattern** for trilingual prose lives in `_includes/header.html`: `data-lang-en="…" data-lang-ja="…" data-lang-ko="…"` attributes that `i18n.js` swaps into innerHTML. Use this for short content where a translation actually exists, not for bibliographic data.

## Identity / social

`_data/profile.yml` is the single source of truth for name, ORCID, the homepage/header affiliation, and the `social:` array. It is **not** wired to per-item metadata: `citation_author_institution` and the talk JSON-LD read `affiliation:` from the item's own front matter with no fallback to profile.yml, so a talk that omits it ships no institution at all. Set `affiliation:` on each academic item, or add the fallback first. Deliberately omit it for work done in a personal capacity rather than as university work (see the Yokawa Hospital talk) — it would otherwise assert institutional involvement in `citation_author_institution` and `Event.performer.affiliation`. Do not "fill in the missing field" without checking which kind of item it is. The social array drives both the CONTACT icons (via `_includes/social-icon.html` — supports `linkedin`, `x`, `github`, `orcid`, `scholar`, `researchgate`) and the `Person.sameAs` JSON-LD. Adding a new platform icon requires a new `{% when %}` case in `social-icon.html`.

## SEO/structured data

JSON-LD lives in `_includes/jsonld/*.html`, one file per content type, plus `breadcrumb.html`. Each layout in `_layouts/` includes the matching JSON-LD block. The homepage Person graph aggregates ORCID, awards, and social `sameAs` automatically. Google Scholar discovery relies on `citation_*` meta tags emitted by `_includes/citation_meta.html` for academic content pages.

## Image strategy

Each image file maps to exactly one role — don't reuse across roles:

| File | Aspect | Role | Used by |
|---|---|---|---|
| `assets/img/face.jpg` | 531×531 square | Identity headshot | apple-touch-icon, ABOUT profile-img, Person.image JSON-LD |
| `assets/img/pwa-icon-512.png` | 512×512 square | PWA install icon | `manifest.webmanifest` only |
| `assets/img/og-card.jpg` | 1200×630 landscape | Homepage share card | `image:` in `index.html` front matter only — not a site-wide default |

`og-card.jpg` is a landscape crop of the CBI 2025 talk photo. It fronts the homepage only. If it is ever recropped, do not cut it centred — that removes the crown of the head; `sips -c H W --cropOffset Y X` lets you choose where to cut.
| `assets/img/favicon.svg` | vector "SL" letters | Browser tab + small icons | `<link rel="icon">` |
| `assets/img/okuno-lab-logo-white.png` | square | Lab affiliation logo | `_includes/header.html` (header brand) |

**Historical note.** `_config.yml` used to inject `image:` on every page, which made `{% if page.image %}` always true and leaked the share card into pages as if it were content imagery (it appeared as a bibliography thumbnail, an award photo and a talk hero banner). The fix was removing the default, not adding guards. Do not reintroduce a site-wide `image:` default.

Per-page `image:` frontmatter overrides the site default — use this on publication/talk pages that have their own banner (e.g., HELM-BERT publication uses `helm-bert-architecture.png` as og:image). Sub-folders under `assets/img/` (`awards/`, `talks/`, `publications/`) hold per-content images named `{event-or-id}-{role}.{ext}` (e.g., `cbi2025-oral.jpg`, `helm-bert-architecture.png`). Photos save as JPG quality ~88; diagrams/screenshots save as PNG (run `pngquant --quality=80-95 --strip` to optimize).
