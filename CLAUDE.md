# Project instructions — «Надёжный партнёр»

## Mission
You are working on the corporate website of «Надёжный партнёр», a manufacturer of fire-rated doors and constructions. The visual direction is premium dark industrial: restrained, architectural, confident, high-quality, and credible for a B2B audience. Avoid cheap AI-looking effects, excessive neon, and decorative animation that harms usability.

## Non-negotiable project rules
- Preserve the existing project structure, content, product data, routes, SEO pages, legal notices, and working functionality unless the user explicitly approves a change.
- Do not invent product specifications, certifications, fire-resistance ratings, customer reviews, company details, legal claims, or contact information.
- Do not delete or replace existing photos, catalog entries, object/production imagery, or copy just to simplify the implementation.
- Keep secrets out of source files, commits, browser bundles, logs, and screenshots. Never request or print API keys.
- Do not deploy, merge into `main`, rewrite git history, or perform destructive commands.
- Work on the current feature branch. Before edits, explain the plan and identify the files expected to change.
- Prefer small, reviewable changes. Keep mobile performance and accessibility in mind.

## Project stack
- React 18, TypeScript, Vite 8, Tailwind CSS 3
- GSAP / ScrollTrigger
- Three.js is already a dependency
- Node.js 24 is configured for Codespaces

## First task: audit only
1. Inspect the repository and report its architecture, key routes, components, content/data locations, assets, and build scripts.
2. Run available checks where practical: `npm run build`, TypeScript checks if configured, and inspect GitHub Actions workflows.
3. Identify real bugs, broken links/routes, responsive issues, accessibility problems, performance bottlenecks, SEO issues, and visual inconsistencies. Distinguish verified bugs from recommendations.
4. Give every finding a severity, evidence, affected file/path, and proposed fix.
5. Do not modify files during the first audit. Do not claim a test passed unless you ran it and saw the result.

## Planned second task: interactive 3D fire door
After the user approves the audit and a separate implementation plan:
- Build a realistic, product-appropriate 3D fire-rated steel door using the existing Three.js stack (React Three Fiber only if its dependencies and architecture are justified).
- Show a complete door leaf and frame, believable steel finish, hinges, handle/lock hardware, seams, and physically plausible proportions.
- Support drag rotation, zoom, a clear front/three-quarter view, and a controlled opening animation if it can be implemented accessibly.
- Optimize for iPhone and mid-range devices: lazy-load the 3D scene, limit pixel ratio, provide a poster/fallback image, respect reduced-motion preferences, and avoid blocking the initial page.
- Do not imply that a visual 3D model proves a real product's certification or technical properties.
- Match the established dark industrial design system and integrate into the most appropriate existing page rather than creating an unrelated demo.

## Completion standard
After approved changes, run the production build and relevant checks, summarize exactly what changed, list remaining risks, and provide a preview/testing URL only if one is actually available.
