import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const fail = (message) => {
  console.error(`SITE CONFIG CHECK FAILED: ${message}`);
  process.exitCode = 1;
};
const pass = (message) => console.log(`OK: ${message}`);

const vercel = JSON.parse(read("vercel.json"));
const company = read("src/data/companyContent.ts");
const categoryPages = JSON.parse(read("seo/catalog-pages.json"));
const categoryPage = read("src/components/CategoryPage.tsx");
const app = read("src/App.tsx");
const infoPage = read("src/components/InfoPage.tsx");
const tailwind = read("tailwind.config.js");

const groups = [...new Set(categoryPages.map((page) => page.group))];
const categoryNames = categoryPages.map((page) => page.title);
const slugBlock = categoryPage.match(/const slugs: Record<string, string> = \{([\s\S]*?)\n\};/)?.[1] ?? "";
const slugEntries = [...slugBlock.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map(([, name, slug]) => ({ name, slug }));
const rewriteSources = new Set((vercel.rewrites ?? []).map((route) => route.source));
const redirects = vercel.redirects ?? [];
const productPaths = [...company.matchAll(/localPath:\s*"([^"]+)"/g)].map(([, path]) => path);
const infoRouteBlock = app.match(/const infoRoutes:[\s\S]*?= \{([\s\S]*?)\n\};/)?.[1] ?? "";
const infoPaths = [...infoRouteBlock.matchAll(/"([^"]+)":\s*"[^"]+"/g)].map(([, path]) => `${path.replace(/\/$/, "")}/`);
const requiredInfoPaths = [...infoPaths, "/o-kompanii/", "/kontakty/"];

if (groups.length !== 5) fail(`expected 5 catalogue groups, found ${groups.length}`);
else pass("5 catalogue groups found");

if (categoryNames.length !== 17) fail(`expected 17 categories, found ${categoryNames.length}`);
else pass("17 catalogue categories found");

const missingSlug = categoryPages.filter((page) => !slugEntries.some((entry) => entry.slug === page.slug));
if (missingSlug.length) fail(`categories without matching route slugs: ${missingSlug.map((page) => page.slug).join(", ")}`);
else pass("all 17 category pages have matching local route slugs");

const missingCategoryRewrite = categoryPages.filter((page) => !rewriteSources.has(`/catalog/${page.slug}/`));
if (missingCategoryRewrite.length) fail(`missing category rewrites: ${missingCategoryRewrite.map((page) => page.slug).join(", ")}`);
else pass("all 17 local category routes have rewrites");

if (redirects.length !== 17) fail(`expected 17 legacy category redirects, found ${redirects.length}`);
const invalidRedirects = redirects.filter((route) => route.permanent !== true || !route.source.startsWith("/product-category/") || !rewriteSources.has(route.destination));
if (invalidRedirects.length) fail(`invalid legacy redirects: ${invalidRedirects.map((route) => route.source).join(", ")}`);
else pass("all 17 legacy category URLs redirect permanently to valid local routes");

if (productPaths.length !== 5) fail(`expected 5 recovered product routes, found ${productPaths.length}`);
const missingProductRewrite = productPaths.filter((path) => !rewriteSources.has(path));
if (missingProductRewrite.length) fail(`missing product rewrites: ${missingProductRewrite.join(", ")}`);
else pass("all 5 recovered bank-tray products have local routes");

const missingInfo = requiredInfoPaths.filter((path) => !rewriteSources.has(path));
if (missingInfo.length) fail(`missing information-page rewrites: ${missingInfo.join(", ")}`);
else pass("all information pages have rewrites");

if (!app.includes('path.startsWith("/product/")') || !app.includes('path === "/o-kompanii"') || !app.includes('path === "/kontakty"')) {
  fail("App route handlers are incomplete");
} else {
  pass("product, company and contact route handlers are present");
}
if (!infoPage.includes('"colors"') || !infoPage.includes("page === \"colors\"")) {
  fail("RAL Classic placeholder page is not wired");
} else {
  pass("RAL Classic route has a dedicated honest placeholder");
}

const headers = vercel.headers ?? [];
const hasHeader = (source, key, value) => headers.some((rule) =>
  rule.source === source && rule.headers?.some((header) => header.key === key && header.value === value)
);
if (!hasHeader("/catalog/:path*", "X-Robots-Tag", "noindex, follow")) fail("catalog noindex header missing");
if (!hasHeader("/product/:path*", "X-Robots-Tag", "noindex, follow")) fail("product noindex header missing");
if (!hasHeader("/color-palette/ral-classic/", "X-Robots-Tag", "noindex, follow")) fail("RAL palette noindex header missing");
if (!process.exitCode) pass("unfinished catalog/product/RAL pages are excluded from indexing");

for (const [name, hex] of [["soft", "#f8f9fa"], ["graphite", "#1a1a1a"], ["ink", "#1a1a1a"], ["brand", "#c62828"]]) {
  if (!tailwind.includes(`${name}: "${hex}"`)) fail(`approved light-theme color missing: ${name}`);
}
if (!tailwind.includes('borderRadius: { none: "0", DEFAULT: "0"')) fail("square-corner design tokens missing");
if (!process.exitCode) pass("approved white / light-grey / graphite / red design tokens are present");
