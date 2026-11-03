import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const categories = JSON.parse(fs.readFileSync(path.join(root, "seo/catalog-pages.json"), "utf8"));
const legalPages = JSON.parse(fs.readFileSync(path.join(root, "seo/legal-pages.json"), "utf8"));
const baseUrl = "https://iv-partner.ru";
const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const script = indexHtml.match(/<script[^>]+src="([^"]+)"[^>]*>/i)?.[1];
const styles = [...indexHtml.matchAll(/href="([^"]+[.]css)"/gi)].map((match) => match[1]);
if (!script) throw new Error("Не найден собранный JS entry в dist/index.html");

const escapeHtml = (value) => {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (char) => entities[char]);
};

function writePage(slug, title, description, body, image) {
  const canonical = baseUrl + "/" + slug + "/";
  const html = [
    "<!doctype html>",
    '<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="robots" content="index,follow">',
    "<title>" + escapeHtml(title) + "</title>",
    '<meta name="description" content="' + escapeHtml(description) + '">',
    '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:type" content="website"><meta property="og:locale" content="ru_RU">',
    '<meta property="og:title" content="' + escapeHtml(title) + '"><meta property="og:description" content="' + escapeHtml(description) + '">',
    '<meta property="og:url" content="' + canonical + '">',
    image ? '<meta property="og:image" content="' + escapeHtml(image) + '">' : "",
    ...styles.map((href) => '<link rel="stylesheet" href="' + href + '">'),
    '</head><body style="margin:0;background:#fff;font-family:Arial,sans-serif;color:#1a1a1a">',
    '<div id="root">' + body + '</div>',
    '<script type="module" crossorigin src="' + script + '"></script></body></html>'
  ].join("\n");
  const target = path.join(dist, slug, "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

for (const page of categories) {
  const title = page.title + " — Надёжный партнёр | Иваново";
  const body = [
    '<header style="padding:20px 6vw;border-bottom:1px solid #e5e7eb"><a href="/" style="color:inherit;text-decoration:none;font-weight:800">НАДЁЖНЫЙ ПАРТНЁР</a></header>',
    '<main style="max-width:1200px;margin:auto;padding:64px 6vw">',
    '<p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#5f6368">' + escapeHtml(page.group) + '</p>',
    '<h1 style="font-size:clamp(36px,6vw,72px);line-height:1.02;max-width:16ch">' + escapeHtml(page.title) + '</h1>',
    '<p style="font-size:18px;line-height:1.7;max-width:720px;color:#5f6368">' + escapeHtml(page.description) + '</p>',
    '<p><a href="/#kp" style="display:inline-block;background:#c62828;color:#fff;padding:16px 24px;text-decoration:none">Запросить коммерческое предложение</a></p>',
    '<p><a href="' + escapeHtml(page.sourceUrl) + '">Открыть исходный каталог</a></p></main>'
  ].join("\n");
  writePage("catalog/" + page.slug, title, page.description, body, page.image);
}

for (const page of legalPages) {
  const sections = page.sections.map((section) => '<section style="margin:32px 0"><h2>' + escapeHtml(section.heading) + '</h2><p style="line-height:1.8;color:#444">' + escapeHtml(section.body) + '</p></section>').join("\n");
  const body = [
    '<header style="padding:20px 6vw;border-bottom:1px solid #e5e7eb"><a href="/" style="color:inherit;text-decoration:none;font-weight:800">НАДЁЖНЫЙ ПАРТНЁР</a></header>',
    '<main style="max-width:900px;margin:auto;padding:56px 6vw">',
    '<h1 style="font-size:clamp(32px,5vw,56px);line-height:1.1">' + escapeHtml(page.title) + '</h1>',
    '<p style="font-size:18px;line-height:1.7;color:#555">' + escapeHtml(page.description) + '</p>',
    '<aside style="margin:28px 0;padding:20px;border-left:4px solid #c62828;background:#f8f9fa">' + escapeHtml(page.draftNotice) + '</aside>',
    sections,
    '</main>'
  ].join("\n");
  writePage(page.slug, page.title + " — Надёжный партнёр", page.description, body);
}

const urls = [
  { loc: baseUrl + "/", priority: "1.0" },
  ...categories.map((page) => ({ loc: baseUrl + "/catalog/" + page.slug + "/", priority: "0.7" })),
  ...legalPages.map((page) => ({ loc: baseUrl + "/" + page.slug + "/", priority: "0.3" }))
];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map((url) => "  <url><loc>" + url.loc + "</loc><changefreq>monthly</changefreq><priority>" + url.priority + "</priority></url>").join("\n")
  + "\n</urlset>\n";
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: " + baseUrl + "/sitemap.xml\n");
console.log("Generated " + categories.length + " category pages, " + legalPages.length + " legal pages and sitemap.");