# Remediation Sprint 1 – Handoff

## Security
`info.html` remains public and `noindex`; this is not access control. Credentials and access codes were removed. Individual check-in data needs protected delivery outside GitHub Pages.

## Consent
Analytics, Maps, Calendar, and Forms load after consent; only the selected language form loads. Google Fonts were removed. Open-Meteo remains a functional cookieless request and needs external disclosure/legal review.

## Images
Exact duplicates: `1.jpg`/`balkon-sitzplatz.jpg`, `ausblick.jpg`/`see-nahaufnahme.jpg`, `dorf-san-zeno.JPEG`/`dorf-san-zeno.jpg`, `favicon.png`/`logo.JPG`. Defective: `see-nahaufnahmekaput.jpg` (2 bytes). Large: village files (~6.4 MB), lake close-ups (~3.7 MB), `wohnzimmer-ausblick.jpg` (~2.2 MB). No originals were deleted. Next: responsive AVIF/WebP, `srcset`, hero priority and lazy loading, then visual approval.

## SEO language migration
Create `/de/`, `/it/`, `/en/` with language-specific metadata, OG, JSON-LD, canonical, reciprocal hreflang and x-default. Define redirects before changing internal URLs.

## Open decisions
Full operator name; protected guest delivery; legal review of privacy/consent/Google/Open-Meteo; image migration; language URL migration.

## Booking-system handoff
Enforce 30/70 dates and 100% last-minute payment; keep forms as enquiries; ensure public calendar contains no guest data; publish stable labelled price rows including extra guest; confirm tourist-tax rules.
