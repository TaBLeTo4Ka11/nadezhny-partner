# Content verification register

This file is an internal editorial register. It is not rendered on the website.

## Source checked
- Official homepage: https://iv-partner.ru/
- Official company page: https://iv-partner.ru/o-kompanii/ (indexed extraction opened 2026-11-03; page snapshot marked crawled about five months earlier).
- Earlier work used an indexed extraction of the official homepage on 2026-11-03; this was not a full live-site crawl.
- A separate search-index result for the official homepage, retrieved on 2026-11-03 and marked as crawled roughly three weeks earlier, also shows three catalogue groups and the same 13 categories, plus the 15-year claim, 11 work photos, three reviews and the listed contact details. This corroborates the indexed homepage snapshot, not a full live catalogue inventory.
- Claude's repeat attempt on 2026-11-03 received `ROBOTS_DISALLOWED` for direct automated access and did not bypass the restriction. With no network access in its execution environment, it did not check Internet Archive, sitemap, WordPress REST API, XML-RPC, or download media.
- Replit archive repository: https://github.com/TaBLeTo4Ka11/nadezhny-partner-replit
- The Replit archive contains source code and repeated image references, not a separate verified 68-product catalogue or a new binary photo collection.

## Confirmed from the official homepage
- Company name: «Надёжный партнёр».
- Main activity stated on the homepage: production and supply of fire barriers and special doors; supply and installation of fire barriers, entrance metal doors, metal grilles and special-purpose gates.
- The homepage states 15 years of experience.
- An official homepage extraction opened 2026-11-03 exposed the original navigation menu with 17 product/service categories across five groups: 5 fire-barrier categories, 6 entrance-door categories, 3 armoured-door categories, 2 wooden-door categories and 1 fire-door hardware category. Four categories missing from the previous local menu have now been restored. This is a verified navigation inventory, not a count of individual products. The catalogue still does not contain the full product database.
- The current project references 11 work photographs and 13 production photographs. These are external URLs, not locally archived image files; all 24 work/production filenames include thumbnail dimensions (`225x300` or `169x300`). Original-size versions have not been located or checked.
- Three reviews are displayed with authors and ratings:
  - Алия — 4.5/5.
  - Мария — 5/5.
  - Ольга Петровна — 5/5.
- Contacts, working hours, email and public company requisites are copied from the official homepage. Verify current legal and banking details with the company before launch.

## Product references retained from earlier extraction (not independently reverified in Claude's repeat run)
- The official indexed category page «Банковские лотки» (snapshot crawled about 1.1 years ago) lists five products: «Электромеханический передаточный шлюз стандартный (ШПТ-1.ЭМ)», «Шлюз механический стандартный», «Устройство передаточное подвижное ЛТ-21», «Устройство передаточное подвижное ЛТ-22», «ЛТ-00 Щелевой». Only the LT-21 detail page could be opened from the indexed snapshot; the other four detailed pages returned cache misses.
- Three fire-door images, one fire-gate image and one fire-curtain image are linked from the official site's media library, but the URLs have not been downloaded or rechecked in the repeat audit.
- The indexed LT-21 detail page at https://iv-partner.ru/product/ustrojstvo-peredatochnoe-podvizhnoe-lt-21/ exposed a product description (one-level movable pass-through for two bank packages, stainless steel with a ballistic painted tray), ballistic class Бр3, and listed values: fire resistance 60 minutes, height 1800–2950 mm, width 800–1200 mm. A local detail page now presents these values with an explicit warning that the source snapshot is old and the values must be reconfirmed. The source's fire-resistance field appears unusual for this product type and must be checked with the owner before being relied upon.

## New source material reviewed on 2026-11-03\n- The official homepage menu lists the following additional original categories missing from the previous local list: «Коттеджные двери со стеклопакетом», «Двери металл-металл», «Полнотелые деревянные двери», «Фурнитура для противопожарных дверей». They were added to the local navigation and SPA routes.\n- The official company page states more than 15 years of activity, describes work with corporate and private customers, supply and installation, and gives a four-stage overview of production. The new `/o-kompanii/` page paraphrases the source without carrying over unverified technical guarantees.\n- The homepage snapshot exposes the `/kontakty/` page in its navigation. A local contact page was added using the contact details already visible on the official homepage.\n- The official indexed «Банковские лотки» category page (crawled about 1.1 years earlier) shows five product cards. This confirms only the five existing names in that category, not a total catalogue count.\n\n## Repeat extraction limitations
- Claude's `iv-partner-research.zip` was a scaffold with empty/placeholder JSON structures, not a recovered product database or downloaded media archive.
- The reported count of 19 items in six groups was taken from repository material and was not verified against the official source. Do not merge it into the current 13-category structure without source evidence.

## Removed or withheld because source evidence was incomplete
- Generic AI-written copy on category pages.
- The hand-curated 25-colour RAL sample. It must not be represented as a verified complete palette.
- Speculative descriptions on warehouse, delivery, vacancies, useful-information and legal pages. Those pages clearly state that content has not yet been migrated and show company contact details instead of fabricated copy.
- Individual product records beyond the five retained bank-transfer product names remain unverified. The indexed category listing for bank-transfer trays shows five products, corroborating that one category's count only.
- Product characteristics, prices, lead times, stock, warranties, delivery geography and other commercial conditions not explicitly confirmed by a source.

## Editorial rule
Do not invent product descriptions, technical data, certifications, guarantees, prices, stock levels, delivery terms, customer reviews or legal details. For each new factual claim, record its exact official source URL or source file. If the source cannot be retrieved, omit the claim or label the content as not yet verified.
