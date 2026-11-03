import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const pages = JSON.parse(fs.readFileSync(path.join(root, "seo/catalog-pages.json"), "utf8"));
const baseUrl = "https://iv-partner.ru";
const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const script = indexHtml.match(/<script[^>]+src="([^"]+)"[^>]*>/i)?.[1];
const styles = [...indexHtml.matchAll(/href="([^"]+[.]css)"/gi)].map((match) => match[1]);
if (!script) throw new Error("Не найден собранный JS entry в dist/index.html");

const escapeHtml = (value) => {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (char) => entities[char]);
};

for (const page of pages) {
  const title = page.title + " — Надёжный партнёр | Иваново";
  const canonical = baseUrl + "/catalog/" + page.slug + "/";
  const html = [
    "<!doctype html>",
    '<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="robots" content="index,follow">',
    "<title>" + escapeHtml(title) + "</title>",
    '<meta name="description" content="' + escapeHtml(page.description) + '">',
    '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:type" content="website"><meta property="og:locale" content="ru_RU">',
    '<meta property="og:title" content="' + escapeHtml(title) + '"><meta property="og:description" content="' + escapeHtml(page.description) + '">',
    '<meta property="og:url" content="' + canonical + '"><meta property="og:image" content="' + escapeHtml(page.image) + '">',
    ...styles.map((href) => '<link rel="stylesheet" href="' + href + '">'),
    '</head><body style="margin:0;background:#fff;font-family:Arial,sans-serif;color:#1a1a1a">',
    '<div id="root"><header style="padding:20px 6vw;border-bottom:1px solid #e5e7eb"><a href="/" style="color:inherit;text-decoration:none;font-weight:800">НАДЁЖНЫЙ ПАРТНЁР</a></header>',
    '<main style="max-width:1200px;margin:auto;padding:64px 6vw"><p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#5f6368">' + escapeHtml(page.group) + '</p>',
    '<h1 style="font-size:clamp(36px,6vw,72px);line-height:1.02;max-width:16ch">' + escapeHtml(page.title) + '</h1>',
    '<p style="font-size:18px;line-height:1.7;max-width:720px;color:#5f6368">' + escapeHtml(page.description) + '</p>',
    '<p><a href="/#kp" style="display:inline-block;background:#c62828;color:#fff;padding:16px 24px;text-decoration:none">Запросить коммерческое предложение</a></p>',
    '<p><a href="' + escapeHtml(page.sourceUrl) + '">Открыть исходный каталог</a></p></main></div>',
    '<script type="module" crossorigin src="' + script + '"></script></body></html>'
  ].join("\n");

  const target = path.join(dist, "catalog", page.slug, "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

const urls = [
  { loc: baseUrl + "/", priority: "1.0" },
  ...pages.map((page) => ({ loc: baseUrl + "/catalog/" + page.slug + "/", priority: "0.7" }))
];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map((url) => "  <url><loc>" + url.loc + "</loc><changefreq>monthly</changefreq><priority>" + url.priority + "</priority></url>").join("\n")
  + "\n</urlset>\n";
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: " + baseUrl + "/sitemap.xml\n");
console.log("Generated " + pages.length + " SEO category pages and sitemap.");