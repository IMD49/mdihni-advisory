# Mdihni Advisory — edition 9

12 October 2026. A refinement of the existing bilingual static site, with its M monogram, dark palette, local Manrope/Cormorant fonts and clean directory routes preserved.

## Design review and benchmarks

The previous homepage used a centered headline over illustrative architecture, repeated introductory copy and several boxed explanatory sections. The contact page lacked the newly confirmed phone, founder email and working location. Source files and the live site were reviewed before changes.

Official references reviewed:

- [PJT Partners](https://www.pjtpartners.com/): a strong image-led opening, concise positioning and a clear progression into capabilities and people.
- [Kearney](https://www.kearney.com/about): human imagery, large typographic hierarchy and deliberate separation of purpose and business information.
- [Rothschild & Co](https://www.rothschildandco.com/en/): clear business-area, people and location navigation. Structure reviewed; this was not a direct visual template.

Interpretation for Mdihni: fewer homepage paragraphs, more space, an asymmetric photographic hero, restrained service rows, a real group photograph, and an appointment-based contact page. These are general composition principles; no other brand's identity, copy or claimed credentials were copied.

## What changed

- Homepage: owner-supplied building photograph, one-sentence introduction, two purposeful calls to action, four focus areas, team goal, a concise approach and contact invitation.
- About: truthful early-stage practice story, one group photograph with the shared goal and working principles. No individual portraits, names, credentials or invented biographies.
- Contact: contact@mdihni.com, ihab@mdihni.com, +31 6 83515003, appointment-only meetings and the full Fontys Eindhoven workspace context. No invented street address, map pin, headquarters ownership or partnership.
- Services: clearer descriptions of financial analysis, reporting, budgeting, cashflow, control and advisory/business insight. Existing service anchors and availability/scope boundaries retained.
- Footer: consistent contact details, full page navigation, Team and Location links, legal links and a keyboard-accessible return to top.
- Motion: font-ready text entrances and the existing time-based wheel easing retained; new text and service rows reveal once. Photograph crops, borders and thin rules remain stable. Button shine overlays removed. Touch and keyboard scrolling stay native; reduced-motion rules retained.
- Metadata: bilingual descriptions, a real-building social preview and factual organization data. No ratings, client counts, registrations or credentials added.
- Privacy: actual GitHub Pages hosting and STRATO email identified; local draft/copy form behavior explained. [GitHub documents visitor IP logging for security](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages). No analytics, cookie banner or third-party form processor was introduced.

## Photography

Four owner-supplied images are used: the wide exterior as hero, the courtyard on About, the facade on Contact, and the group photograph on Home/About. They are format-optimized WebP assets with explicit dimensions; supporting images load lazily. The original group composition is preserved with all four people visible. Individual portraits are excluded from the project and publication.

The earlier illustrative architecture and original logo assets remain available in editable source. They are not used as the new homepage hero. A social preview is a resized crop of the supplied building photograph, not invented artwork.

## Verification

- 16 bilingual source pages; 782 source links/assets/anchors validated.
- 16 clean public routes; 774 route references checked for both the custom domain and GitHub project-path hosting. Legacy query/fragment preservation and sitemap verified.
- 48 browser layout checks: every English/Dutch page at 320, 390 and 768 CSS-pixel frame widths, after fonts loaded. No horizontal content overflow. Scrollbars reduce available content width and are recorded in the report.
- Desktop homepage and About/group composition visually reviewed; mobile preview reviewed. Contact required-field behavior and copy-enquiry success checked without sending an email. Mobile menu opening and Escape closing checked.
- Website JavaScript syntax checked. Browser warnings came from an unrelated installed extension, not site code.
- HTTPS, www redirects, deployed-file integrity and before/after mail DNS are checked after publication; reports are included in the delivery ZIP.

The form opens the visitor's mail application or copies an enquiry. It is not an automatic server-side submission. Animation behavior was visually reviewed, not certified to a fixed frame rate on every device. No legal compliance certification is implied; owner-confirmed legal entity, registration, street address and actual correspondence-retention procedures should be supplied before adding them.

## Editing and publishing

Edit the existing HTML files and `assets/editorial.css`. EN and NL share assets and styling. `scripts/prepare-pages.py` generates public directory routes; do not replace editable source with `_site`. The existing GitHub Pages workflow publishes main without changing STRATO DNS or email settings. The ZIP contains an editable source project and a separate desktop/mobile preview.
