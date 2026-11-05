# Graph Report - nadezhny-partner  (2026-11-05)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 318 nodes · 425 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b2233a4e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- react
- App.tsx
- companyContent.ts
- steps
- with
- validate-site-config.mjs
- steps
- steps
- compilerOptions
- generate-seo-pages.mjs
- contact.ts
- chat.ts
- agent/package.json
- vercel.json
- browser-smoke.mjs

## God Nodes (most connected - your core abstractions)
1. `App()` - 17 edges
2. `react` - 17 edges
3. `compilerOptions` - 13 edges
4. `gsap` - 9 edges
5. `with` - 8 edges
6. `PHONES` - 7 edges
7. `EMAIL` - 6 edges
8. `steps` - 6 edges
9. `with` - 6 edges
10. `steps` - 6 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `AboutSection()`  [EXTRACTED]
  src/App.tsx → src/components/AboutSection.tsx
- `App()` --calls--> `CatalogSection()`  [EXTRACTED]
  src/App.tsx → src/components/CatalogSection.tsx
- `App()` --calls--> `CategoryPage()`  [EXTRACTED]
  src/App.tsx → src/components/CategoryPage.tsx
- `App()` --calls--> `CompanyPage()`  [EXTRACTED]
  src/App.tsx → src/components/CompanyPage.tsx
- `App()` --calls--> `CookieConsent()`  [EXTRACTED]
  src/App.tsx → src/components/CookieConsent.tsx

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (35): dependencies, gsap@^3.12.5, react@^18.3.1, react-dom@^18.3.1, three@^0.170.0, devDependencies, autoprefixer@^10.4.20, postcss@^8.4.47 (+27 more)

### Community 1 - "react"
Cohesion: 0.12
Nodes (22): react, stageSummaries, CompanyPageKind, DoorScene(), makeBrushed(), LINKS, CATALOG_GROUPS, EXTRA_LINKS (+14 more)

### Community 2 - "App.tsx"
Cohesion: 0.11
Nodes (24): App(), infoRoutes, NotFoundPage(), AboutSection(), CatalogSection(), categories, raw(), CategoryPage() (+16 more)

### Community 3 - "companyContent.ts"
Cohesion: 0.08
Nodes (21): catalogPageBySlug, catalogPageByTitle, CatalogPageData, catalogPages, Product, about, catalogCategories, catalogProductLinks (+13 more)

### Community 4 - "steps"
Cohesion: 0.07
Nodes (27): concurrency, cancel-in-progress, group, GH_TOKEN, name, runs-on, steps, timeout-minutes (+19 more)

### Community 5 - "with"
Cohesion: 0.07
Nodes (26): runs-on, steps, timeout-minutes, jobs, browser-smoke, name, on, pull_request (+18 more)

### Community 6 - "validate-site-config.mjs"
Cohesion: 0.08
Nodes (21): app, categoryNames, categoryPage, categoryPages, categorySlugs, company, duplicateCategorySlugs, groups (+13 more)

### Community 7 - "steps"
Cohesion: 0.10
Nodes (20): runs-on, steps, jobs, build, name, on, pull_request, push (+12 more)

### Community 8 - "steps"
Cohesion: 0.12
Nodes (16): runs-on, steps, jobs, fix-lock, name, on, workflow_dispatch, permissions (+8 more)

### Community 9 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+6 more)

### Community 10 - "generate-seo-pages.mjs"
Cohesion: 0.15
Nodes (11): categories, companyPages, dist, escapeHtml(), indexHtml, infoPages, products, root (+3 more)

### Community 11 - "contact.ts"
Cohesion: 0.29
Nodes (9): clean(), ContactPayload, getHeader(), handler(), isValidEmail(), rateBuckets, rateLimited(), RequestLike (+1 more)

### Community 12 - "chat.ts"
Cohesion: 0.36
Nodes (8): github(), handler(), rateLimit(), requestCounts, runTool(), send(), tools, validRef()

### Community 13 - "agent/package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 14 - "vercel.json"
Cohesion: 0.40
Nodes (4): headers, redirects, rewrites, trailingSlash

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.tsx`, `companyContent.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07357357357357357 - nodes in this community are weakly interconnected._
- **Why does `gsap` connect `package.json` to `react`, `App.tsx`, `companyContent.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.11895161290322581 - nodes in this community are weakly interconnected._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10685483870967742 - nodes in this community are weakly interconnected._
- **Should `companyContent.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07956989247311828 - nodes in this community are weakly interconnected._
- **Should `steps` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._