# Mdihni Advisory

Editable static website, improved from the original Mdihni-Advisory-Website project.

- English pages in the root; full Dutch translations in `nl/`.
- Shared styling in `assets/styles.css`, `assets/refinements.css`, `assets/theme-dark.css`, `assets/polish.css`, `assets/editorial.css`.
- Accessible language links work without JavaScript, cookies or browser storage.
- The email composer opens the visitor's email application or copies a message. It does not send or store submissions.
- Local fonts, optimized imagery and a pinned local Lenis 1.3.26 copy; no CDN requests or trackers.
- Gentler font-ready text entrances, stable decorative detail, staggered reveals, wheel easing and native crossfades respect the reduced-motion preference. See `SMOOTH-MOTION-NL.md` for edition 6 and `POLISH-NL.md` for the previous edition.

## Run locally

Run `python -m http.server 8000` from this directory. Open `http://localhost:8000/nl/` for Dutch or the root for English.

## Publish

GitHub Pages uses the workflow in `.github/workflows/pages.yml`. Edits pushed to `main` are published automatically. `scripts/prepare-pages.py` prepares the existing HTML and replaces source metadata with the configured publishing URL. The original source retains `mdihni.com` and `contact@mdihni.com`.

The live custom domain is `https://mdihni.com/home/`, with Dutch at `/nl/home/`. Published routes use readable directories such as `/services/` and `/nl/diensten/`. Root and legacy `.html` URLs redirect to their clean routes, preserving query strings and fragments in the browser. All navigation, canonical URLs, language alternates and sitemap entries use clean routes. `www.mdihni.com` redirects to the main domain. GitHub Pages manages HTTPS and automatic certificate renewal. The source `CNAME` is excluded from the workflow artifact; the custom domain is configured in GitHub Pages settings. No STRATO DNS or mail records are changed by this workflow.

The original HTML files remain editable in the source. Run `python scripts/prepare-pages.py` to generate `_site`, then serve `_site` locally to test published routes. Legacy redirects are static HTML with JavaScript and a meta-refresh fallback; GitHub Pages does not provide custom server redirect rules. The root `404.html` remains a full error page so missing deep URLs load navigation and assets correctly.

The domain was connected on 9 October 2026 by changing only STRATO's A, AAAA and www CNAME web records and adding GitHub domain-verification TXT. STRATO nameservers, MX, SPF, DKIM, DMARC and mail settings were preserved. See `STRATO-DOMAIN-GUIDE.md` in the delivery folder. During initial certificate provisioning, the publishing script normalizes GitHub's temporary HTTP address for this verified domain to HTTPS metadata.

## Content and artwork

Edition 9 uses owner-supplied building photographs and one group photograph. Individual portraits, names and invented bios are not included. The building is described as a workspace in the Fontys Eindhoven entrepreneurial environment; visits are by appointment. It is not presented as a privately owned headquarters or a Fontys partnership.

The M monogram and existing dark identity are preserved. Earlier illustrative assets remain in editable source, but the homepage and supporting location sections now use the supplied photographs. Optimized WebP copies are served; font license files are included in `assets/fonts`.

The contact details are owner-confirmed: contact@mdihni.com, ihab@mdihni.com, +31 6 83515003. The site states that Mdihni is an early-stage independent practice. It does not assert registrations, qualifications, clients, reviews or track record. Privacy information reflects the static email-draft form, GitHub Pages hosting and STRATO email setup. Business registration, legal entity, street address and actual email retention procedures still need owner confirmation before adding such information; no compliance certification is claimed.

See DESIGN-REFINEMENT-V9.md for the design rationale, photo provenance and verification scope.
