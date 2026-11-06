# Graph Report - nadezhny-partner  (2026-11-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 324 nodes · 431 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `103f254a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- package.json
- companyContent.ts
- steps
- with
- validate-site-config.mjs
- content.ts
- steps
- steps
- compilerOptions
- generate-seo-pages.mjs
- agent/package.json
- contact.ts
- chat.ts
- vercel.json
- browser-smoke.mjs

## God Nodes (most connected - your core abstractions)
1. `App()` - 17 edges
2. `react` - 17 edges
3. `compilerOptions` - 13 edges
4. `gsap` - 9 edges
5. `with` - 8 edges
6. `PHONES` - 7 edges
7. `steps` - 6 edges
8. `with` - 6 edges
9. `steps` - 6 edges
10. `EMAIL` - 6 edges

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

### Community 0 - "App.tsx"
Cohesion: 0.10
Nodes (28): react, App(), infoRoutes, NotFoundPage(), AboutSection(), CatalogSection(), categories, raw() (+20 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (35): dependencies, gsap@^3.12.5, react@^18.3.1, react-dom@^18.3.1, three@^0.170.0, devDependencies, autoprefixer@^10.4.20, postcss@^8.4.47 (+27 more)

### Community 2 - "companyContent.ts"
Cohesion: 0.07
Nodes (23): catalogPageBySlug, catalogPageByTitle, CatalogPageData, catalogPages, Product, about, catalog, catalogCategories (+15 more)

### Community 3 - "steps"
Cohesion: 0.07
Nodes (27): concurrency, cancel-in-progress, group, GH_TOKEN, name, runs-on, steps, timeout-minutes (+19 more)

### Community 4 - "with"
Cohesion: 0.07
Nodes (26): runs-on, steps, timeout-minutes, jobs, browser-smoke, name, on, pull_request (+18 more)

### Community 5 - "validate-site-config.mjs"
Cohesion: 0.08
Nodes (21): app, categoryNames, categoryPage, categoryPages, categorySlugs, company, duplicateCategorySlugs, groups (+13 more)

### Community 6 - "content.ts"
Cohesion: 0.15
Nodes (16): stageSummaries, CompanyPageKind, LINKS, CATALOG_GROUPS, EXTRA_LINKS, LINKS, legalText, PageKey (+8 more)

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

### Community 11 - "agent/package.json"
Cohesion: 0.22
Nodes (9): devDependencies, vite@8.3.5, vite, name, private, scripts, build, type (+1 more)

### Community 12 - "contact.ts"
Cohesion: 0.29
Nodes (9): clean(), ContactPayload, getHeader(), handler(), isValidEmail(), rateBuckets, rateLimited(), RequestLike (+1 more)

### Community 13 - "chat.ts"
Cohesion: 0.36
Nodes (8): github(), handler(), rateLimit(), requestCounts, runTool(), send(), tools, validRef()

### Community 14 - "vercel.json"
Cohesion: 0.40
Nodes (4): headers, redirects, rewrites, trailingSlash

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `package.json`, `companyContent.ts`, `content.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09716599190283401 - nodes in this community are weakly interconnected._
- **Why does `gsap` connect `package.json` to `App.tsx`, `companyContent.ts`, `content.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06970128022759602 - nodes in this community are weakly interconnected._
- **Should `companyContent.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07459677419354839 - nodes in this community are weakly interconnected._
- **Should `steps` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `with` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._