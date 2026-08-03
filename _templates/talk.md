---
# Location: _talks/YYYY-MM-DD-slug.md
# Auto-generates: /talks/<slug>/ page, Event + ScholarlyArticle JSON-LD,
# citation_* meta (Google Scholar), article:* OG, breadcrumb, sitemap entry, feed entry.
# layout is auto-set via _config.yml defaults — do NOT add `layout:` here.

# --- Required ---
title: "Talk Title"
date: YYYY-MM-DD
venue: "Event / Venue (Oral / Invited / Poster)"
presenter: Seungeon Lee
type: talk

# --- Recommended ---
format: oral                  # oral / invited / poster (drives badge color)
attendance: offline           # offline / online / mixed — drives Event.eventAttendanceMode
                              # and Place vs VirtualLocation in JSON-LD. Omit = offline.
description: "Short summary used as meta description and social preview."

# --- Optional: enables Scholar indexing & richer JSON-LD ---
# authors:                    # YAML list, same shape as publications/preprints.
#   - Seungeon Lee            # Rendered by _layouts/talk.html with the owner's name
#   - Co-author Name          # underlined — do NOT repeat an "Authors:" line in the body
                              # (it would duplicate, and drift across en/ja/ko).
                              # Solo talks may omit this; `presenter` is used instead.
# affiliation: "Kyoto University Graduate School of Medicine, ..."
# conference_title: "CBI Society Annual Meeting 2025"   # Defaults to venue if omitted
# arxiv_id: "2512.23175"      # → citation_arxiv_id
# doi: "10.xxxx/yyy"          # → citation_doi
# pdf_url: https://...        # → citation_pdf_url (auto-detected from links if any link ends in .pdf)
# image: /assets/img/talks/filename.jpg   # og:image override (place photo in assets/img/talks/ first)

# --- Multilingual (used by current JS i18n; preserved for future static i18n) ---
# title_ja: "..."
# title_ko: "..."
# venue_ja: "..."
# venue_ko: "..."
# content_ja: |
#   ## 概要
# content_ko: |
#   ## 개요

# --- Optional: external links shown as buttons on detail page ---
# links:
#   - label: Abstract
#     url: https://...
#   - label: PDF
#     url: https://...
---

Body content in Markdown (rendered on the detail page).
