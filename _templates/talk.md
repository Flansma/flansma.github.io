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

# --- Event JSON-LD: host and place. Google lists location.address as REQUIRED. ---
organizer: "Hosting body"     # The organisation that RAN the event — never your own
                              # affiliation. Defaults to conference_title, then venue.
# organizer_url: https://...
# location_name: "Venue name" # Keep the event's own title OUT of this (Google forbids it)
# address_street: "4-1-1 Funabori"     # offline / mixed only
# address_locality: "Edogawa-ku"
# address_region: "Tokyo"
# address_postal: "134-0091"
# address_country: JP         # defaults to JP
# event_url: https://...      # online / mixed only — VirtualLocation.url (the public
                              # event page). Without it the VirtualLocation is unusable.
# start_time: "14:55:00"      # optional session times, emitted with +09:00. Omit both
# end_time: "15:20:00"        # and the Event carries a date only — never midnight.
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
# --- Images. Omit all of these if the talk has no photo; nothing is defaulted. ---
# image: /assets/img/talks/filename.jpg   # This entry's photo: page hero AND its og:image.
# image_width: 1280                       # REQUIRED with image: — intrinsic pixel size.
# image_height: 960                       # Jekyll can't measure images (no plugins on
                                          # GH Pages); without these the box reserves
                                          # no height and the page jumps on decode.
# thumb: /assets/img/talks/filename-thumb.jpg   # 240x160 crop for the PRESENTATIONS list
#                                               # (2x its 120x80 CSS box).
                                          # Note: a portrait `image:` gets centre-cropped
                                          # by X/LinkedIn in link previews (1.91:1), which
                                          # on a podium shot cuts off the top of the head.

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
