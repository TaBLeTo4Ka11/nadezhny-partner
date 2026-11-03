# Content verification register

This file is an internal editorial register. It is not rendered on the website.

## Source checked
- Official homepage: https://iv-partner.ru/
- Earlier work used an indexed extraction of the official homepage on 2026-11-03; this was not a full live-site crawl.
- Claude's repeat attempt on 2026-11-03 received `ROBOTS_DISALLOWED` for direct automated access and did not bypass the restriction. With no network access in its execution environment, it did not check Internet Archive, sitemap, WordPress REST API, XML-RPC, or download media.
- Replit archive repository: https://github.com/TaBLeTo4Ka11/nadezhny-partner-replit
- The Replit archive contains source code and repeated image references, not a separate verified 68-product catalogue or a new binary photo collection.

## Confirmed from the official homepage
- Company name: «Надёжный партнёр».
- Main activity stated on the homepage: production and supply of fire barriers and special doors; supply and installation of fire barriers, entrance metal doors, metal grilles and special-purpose gates.
- The homepage states 15 years of experience.
- A previously available indexed homepage extraction listed three groups and the 13 categories currently represented in `src/data/companyContent.ts`. Claude's later report also counted six groups/19 items in repository material, but did not verify that count against the live source. The discrepancy remains unresolved.
- The current project references 11 work photographs and 13 production photographs. These are external URLs, not locally archived image files; all 24 work/production filenames include thumbnail dimensions (`225x300` or `169x300`). Original-size versions have not been located or checked.
- Three reviews are displayed with authors and ratings:
  - Алия — 4.5/5.
  - Мария — 5/5.
  - Ольга Петровна — 5/5.
- Contacts, working hours, email and public company requisites are copied from the official homepage. Verify current legal and banking details with the company before launch.

## Product references retained from earlier extraction (not independently reverified in Claude's repeat run)
- The project retains five bank-transfer product names and URLs from earlier work; Claude's repeat attempt could not independently re-open or verify the source pages. They are listed as links only, not presented as complete product cards.
- Three fire-door images, one fire-gate image and one fire-curtain image are linked from the official site's media library, but the URLs have not been downloaded or rechecked in the repeat audit.
- A search-index snippet for `Устройство передаточное подвижное ЛТ-21` contained a partial description and three attributes (fire resistance 60 minutes; height 1800–2950 mm; width 800–1200 mm). This is not a complete product page and is not displayed as specifications on the site.

## Repeat extraction limitations
- Claude's `iv-partner-research.zip` was a scaffold with empty/placeholder JSON structures, not a recovered product database or downloaded media archive.
- The reported count of 19 items in six groups was taken from repository material and was not verified against the official source. Do not merge it into the current 13-category structure without source evidence.

## Removed or withheld because source evidence was incomplete
- Generic AI-written copy on category pages.
- The hand-curated 25-colour RAL sample. It must not be represented as a verified complete palette.
- Speculative descriptions on warehouse, delivery, vacancies and useful-information pages. Those pages now clearly state that their content has not yet been migrated and link to the original pages.
- Catalogue categories not visible in the official homepage extraction used for this audit. Restore them only after checking the corresponding official page/menu.
- Product characteristics, prices, lead times, stock, warranties, delivery geography and other commercial conditions not explicitly confirmed by a source.

## Editorial rule
Do not invent product descriptions, technical data, certifications, guarantees, prices, stock levels, delivery terms, customer reviews or legal details. For each new factual claim, record its exact official source URL or source file. If the source cannot be retrieved, omit the claim or label the content as not yet verified.
