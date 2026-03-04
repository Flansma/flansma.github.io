# Personal Portfolio (Jekyll + GitHub Pages)

A minimal academic portfolio site built with Jekyll collections. Live at [flansma.github.io](https://flansma.github.io).

## Features

- Single-page responsive design
- Dark mode support (system preference + manual toggle)
- Mobile hamburger menu
- Multi-language support (EN/JA/KO)
- Jekyll collections for publications, talks, awards, and projects
- Modular layout system with includes

## Project Structure

```
├── _includes/         # Reusable HTML components
│   ├── head.html      # Meta tags, CSS, fonts
│   ├── header.html    # Navigation header
│   └── footer.html    # Page footer
├── _layouts/          # Page templates
│   ├── default.html   # Base layout
│   └── project.html   # Project detail page
├── _publications/     # Journal articles
├── _preprints/        # Preprints (arXiv, etc.)
├── _talks/            # Conference presentations
├── _awards/           # Awards & honors
├── _projects/         # Research projects (with detail pages)
├── _data/             # YAML data files
│   ├── bio.yml        # Biography/positions
│   ├── experience.yml # Work experience
│   ├── scholarships.yml
│   └── writings.yml
├── assets/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript
│   └── img/           # Images
├── index.html         # Main page
├── _config.yml        # Jekyll configuration
├── sitemap.xml        # SEO sitemap
└── robots.txt         # Search engine directives
```

## Adding Content

### Publications / Preprints / Talks / Awards

Add Markdown files to the appropriate collection folder. Filename format: `YYYY-MM-DD-slug.md`

```yaml
---
title: "Paper or Presentation Title"
date: 2026-01-10
venue: "Journal/Conference Name"
authors:
  - First Author
  - Seungeon Lee
  - Third Author
type: article   # article | conference | preprint | talk | award
# Optional
status: submitted   # submitted | accepted | in press
doi: 10.xxxx/xxxxx
link: https://example.com
featured: true      # Show in "Selected Publications"
---
```

### Projects

Projects have their own detail pages. Add to `_projects/`:

```yaml
---
layout: project
title: "Project Name"
date: 2025-01-01
status: active   # active | completed | archived
tags:
  - Deep Learning
  - NLP
description: "Short description for the card."
links:
  - label: GitHub
    url: https://github.com/...
  - label: Paper
    url: https://...
featured: true
---

Full project description in Markdown...
```

## Customization

### Adding New Sections

1. Create a new collection in `_config.yml`
2. Add the folder (e.g., `_newcollection/`)
3. Add the section HTML to `index.html`

### Modifying Layout

- Edit `_includes/header.html` for navigation
- Edit `_layouts/default.html` for page structure
- Edit `assets/css/style.css` for styling

### Dark Mode Colors

CSS variables are defined in `:root` and `[data-theme="dark"]` in `style.css`.

## Deployment

This site uses GitHub Actions for automatic deployment.

1. Push changes to `main` branch
2. GitHub Actions builds and deploys automatically
3. Site updates within 1-2 minutes

### Initial Setup

1. Rename repository to `username.github.io`
2. Go to **Settings** → **Pages**
3. Set Source to **GitHub Actions**
4. Ensure repository is **Public**

## Local Development

```bash
# Install dependencies
gem install bundler jekyll

# Run locally
bundle exec jekyll serve

# Open http://localhost:4000
```

## License

MIT
