# Mdihni Advisory

Editable static website, improved from the original Mdihni-Advisory-Website project.

- English pages in the root; full Dutch translations in `nl/`.
- Shared styling in `assets/styles.css`, `assets/refinements.css`, `assets/theme-dark.css`, `assets/polish.css`.
- Accessible language links work without JavaScript, cookies or browser storage.
- The email composer opens the visitor's email application or copies a message. It does not send or store submissions.
- Local fonts, optimized imagery and a pinned local Lenis 1.3.26 copy; no CDN requests or trackers.
- Gentler font-ready text entrances, stable decorative detail, staggered reveals, wheel easing and native crossfades respect the reduced-motion preference. See `SMOOTH-MOTION-NL.md` for edition 6 and `POLISH-NL.md` for the previous edition.

## Run locally

Run `python -m http.server 8000` from this directory. Open `http://localhost:8000/nl/` for Dutch or the root for English.

## Publish

GitHub Pages uses the workflow in `.github/workflows/pages.yml`. Edits pushed to `main` are published automatically. `scripts/prepare-pages.py` prepares the existing HTML and replaces source metadata with the configured publishing URL. The original source retains `mdihni.com` and `contact@mdihni.com`.

The source `CNAME` is a reference for the intended domain. It is excluded from the Pages artifact: GitHub Pages stays on its GitHub URL until a custom domain is configured in Pages settings. No STRATO DNS or mail records are changed by this workflow.

When connecting mdihni.com, preserve the existing STRATO MX, SPF, DKIM, DMARC and mail host records. No nameserver change is needed merely to connect web hosting.

## Content and artwork

Focus areas describe a developing initiative and possible support. No testimonials, credentials or past engagements are asserted. Legal notices are drafts that require checking against the actual business details and hosting setup.

The M monogram was supplied by the owner. The architecture is an AI-generated illustrative image, not a photograph of an actual Mdihni office. Original source assets remain available for editing; optimized versions are served. Font license files are included in `assets/fonts`.
