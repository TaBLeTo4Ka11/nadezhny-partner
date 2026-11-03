# Content verification register

This file is an internal editorial register. It is not rendered on the website.

## Source checked
- Official homepage: https://iv-partner.ru/
- Official company page: https://iv-partner.ru/o-kompanii/ (indexed extraction opened 2026-11-03; page snapshot marked crawled about five months earlier).
- Earlier work used an indexed extraction of the official homepage on 2026-11-03; this was not a full live-site crawl.
- An older homepage search snapshot (crawled roughly three weeks before 2026-11-03) showed only three groups and 13 categories. A newer official-page navigation snapshot opened from the LT-21 product page on 2026-11-03 exposes five groups and 17 categories. The older 13-category snapshot is therefore incomplete and is superseded by the newer five-group navigation evidence.
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
- The official indexed category page https://iv-partner.ru/product-category/cooking/bankovskie-lotki/ (snapshot crawled about 1.1 years ago) explicitly says «Представлено 5 товаров» and lists:  «Электромеханический передаточный шлюз стандартный (ШПТ-1.ЭМ)», «Шлюз механический стандартный», «Устройство передаточное подвижное ЛТ-21», «Устройство передаточное подвижное ЛТ-22», «ЛТ-00 Щелевой». The LT-21 detail page could be opened and inspected; the other four detailed pages returned cache misses in the current retrieval attempt. Their names and category membership are verified, but their descriptions and parameters are not.
- Three fire-door images, one fire-gate image and one fire-curtain image are linked from the official site's media library, but the URLs have not been downloaded or rechecked in the repeat audit.
- The indexed LT-21 detail page at https://iv-partner.ru/product/ustrojstvo-peredatochnoe-podvizhnoe-lt-21/ exposed a product description (one-level movable pass-through for two bank packages, stainless steel with a ballistic painted tray), ballistic class Бр3, and listed values: fire resistance 60 minutes, height 1800–2950 mm, width 800–1200 mm. A local detail page now presents these values with an explicit warning that the source snapshot is old and the values must be reconfirmed. The source's fire-resistance field appears unusual for this product type and must be checked with the owner before being relied upon.

## New source material reviewed on 2026-11-03
- The official homepage menu lists the following additional original categories missing from the previous local list: «Коттеджные двери со стеклопакетом», «Двери металл-металл», «Полнотелые деревянные двери», «Фурнитура для противопожарных дверей». They were added to the local navigation and SPA routes.
- The official company page states more than 15 years of activity, describes work with corporate and private customers, supply and installation, and gives a four-stage overview of production. The new `/o-kompanii/` page paraphrases the source without carrying over unverified technical guarantees.
- The homepage snapshot exposes the `/kontakty/` page in its navigation. A local contact page was added using the contact details already visible on the official homepage.
- The indexed LT-21 page exposes the original navigation hierarchy, including all 17 category links and their original WooCommerce URL paths. The local site now keeps those original category URLs alive with permanent redirects to the new local `/catalog/<slug>/` routes.
- The official RAL Classic page https://iv-partner.ru/color-palette/ral-classic/ contains a long table of color names and HEX values. The extracted text includes malformed HEX values and the page snapshot is old, so the table has not been copied as if it were a validated complete manufacturer palette. A local `noindex` information page explains the limitation and directs visitors to confirm a real sample with the company.

## Repeat extraction limitations
- Claude's `iv-partner-research.zip` was a scaffold with empty/placeholder JSON structures, not a recovered product database or downloaded media archive.
- The reported count of 19 items in six groups was taken from repository material and was not verified against the official source. Do not merge it into the current 17-category structure without source evidence.

## Removed or withheld because source evidence was incomplete
- Generic AI-written copy on category pages.
- The hand-curated 25-colour RAL sample. It must not be represented as a verified complete palette.
- Speculative descriptions on warehouse, delivery, vacancies, useful-information and legal pages. Those pages clearly state that content has not yet been migrated and show company contact details instead of fabricated copy.
- Five bank-transfer product names are verified. Local detail routes now exist for all five; only LT-21 has source-derived detail content. The other four pages intentionally show a notice that detailed data is not yet recovered.
- Product characteristics, prices, lead times, stock, warranties, delivery geography and other commercial conditions not explicitly confirmed by a source.

## Editorial rule
Do not invent product descriptions, technical data, certifications, guarantees, prices, stock levels, delivery terms, customer reviews or legal details. For each new factual claim, record its exact official source URL or source file. If the source cannot be retrieved, omit the claim or label the content as not yet verified.
