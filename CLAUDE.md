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
| `_talks` | individual pages | `Event` + nested `ScholarlyArticle` JSON-LD |
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

**Author name highlighting.** Liquid `replace` swaps `Seungeon Lee` → `<span class="highlight-name">…</span>`. The CSS for `.highlight-name` is scoped (`.biblio-meta .highlight-name`, `.section-meta .highlight-name`, `.work-authors .highlight-name`); when adding a new section that lists authors, either add its parent selector to the existing rule or the highlight will render but be invisible.

**i18n is intentionally partial** (`assets/js/i18n.js`). Fixed UI strings (nav labels, section titles, ABOUT body, hero tagline) swap client-side via the `I18N` dict by language. Bibliographic entries (publications/preprints/talks/awards/writings) stay in source language — a Japanese magazine article keeps its Japanese title across all language modes, by convention. To provide an English subtitle for a non-English entry, use the `subtitle:` field (renders in italic under the main title) — this matches J-STAGE/CiNii indexing conventions for Japanese commentary articles.

**Header swap pattern** for trilingual prose lives in `_includes/header.html`: `data-lang-en="…" data-lang-ja="…" data-lang-ko="…"` attributes that `i18n.js` swaps into innerHTML. Use this for short content where a translation actually exists, not for bibliographic data.

## Identity / social

`_data/profile.yml` is the single source of truth for name, ORCID, affiliation, and the `social:` array. The social array drives both the CONTACT icons (via `_includes/social-icon.html` — supports `linkedin`, `x`, `github`, `orcid`, `scholar`, `researchgate`) and the `Person.sameAs` JSON-LD. Adding a new platform icon requires a new `{% when %}` case in `social-icon.html`.

## SEO/structured data

JSON-LD lives in `_includes/jsonld/*.html`, one file per content type, plus `breadcrumb.html`. Each layout in `_layouts/` includes the matching JSON-LD block. The homepage Person graph aggregates ORCID, awards, and social `sameAs` automatically. Google Scholar discovery relies on `citation_*` meta tags emitted by `_includes/citation_meta.html` for academic content pages.

## Image strategy

Each image file maps to exactly one role — don't reuse across roles:

| File | Aspect | Role | Used by |
|---|---|---|---|
| `assets/img/face.jpg` | 531×531 square | Identity headshot | apple-touch-icon, ABOUT profile-img, Person.image JSON-LD |
| `assets/img/pwa-icon-512.png` | 512×512 square | PWA install icon | `manifest.webmanifest` only |
| `assets/img/og-card.jpg` | 1200×630 landscape | Social share card | Site-wide default `image:` (`_config.yml`), all JSON-LD content fallbacks |
| `assets/img/favicon.svg` | vector "SL" letters | Browser tab + small icons | `<link rel="icon">` |
| `assets/img/okuno-lab-logo-white.png` | square | Lab affiliation logo | `_includes/header.html` (header brand) |

Per-page `image:` frontmatter overrides the site default — use this on publication/talk pages that have their own banner (e.g., HELM-BERT publication uses `helm-bert-architecture.png` as og:image). Sub-folders under `assets/img/` (`awards/`, `talks/`, `publications/`) hold per-content images named `{event-or-id}-{role}.{ext}` (e.g., `cbi2025-oral.jpg`, `helm-bert-architecture.png`). Photos save as JPG quality ~88; diagrams/screenshots save as PNG (run `pngquant --quality=80-95 --strip` to optimize).
