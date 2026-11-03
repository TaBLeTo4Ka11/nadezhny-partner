import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const categories = JSON.parse(fs.readFileSync(path.join(root, "seo/catalog-pages.json"), "utf8"));
const products = JSON.parse(fs.readFileSync(path.join(root, "seo/product-pages.json"), "utf8"));
const baseUrl = "https://iv-partner.ru";
const indexHtml = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const script = indexHtml.match(/<script[^>]+src="([^"]+)"[^>]*>/i)?.[1];
const styles = [...indexHtml.matchAll(/href="([^"]+[.]css)"/gi)].map((match) => match[1]);
if (!script) throw new Error("Не найден собранный JS entry в dist/index.html");

const escapeHtml = (value) => {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value).replace(/[&<>"']/g, (char) => entities[char]);
};

function writePage(route, title, description, robots, body, image) {
  const canonical = baseUrl + "/" + route + "/";
  const html = [
    "<!doctype html>",
    '<html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff">',
    '<meta name="robots" content="' + robots + '">',
    "<title>" + escapeHtml(title) + "</title>",
    '<meta name="description" content="' + escapeHtml(description) + '">',
    '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:type" content="website"><meta property="og:locale" content="ru_RU">',
    '<meta property="og:title" content="' + escapeHtml(title) + '"><meta property="og:description" content="' + escapeHtml(description) + '">',
    '<meta property="og:url" content="' + canonical + '">',
    image ? '<meta property="og:image" content="' + escapeHtml(image) + '">' : "",
    ...styles.map((href) => '<link rel="stylesheet" href="' + href + '">'),
    "</head><body>",
    '<div id="root">' + body + "</div>",
    '<script type="module" crossorigin src="' + script + '"></script></body></html>'
  ].join("\n");
  const target = path.join(dist, route, "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}

const header = '<header><a href="/">НАДЁЖНЫЙ ПАРТНЁР</a></header>';

for (const page of categories) {
  const title = page.title + " — Надёжный партнёр | Иваново";
  const body = header
    + "<main><p>" + escapeHtml(page.group) + "</p><h1>" + escapeHtml(page.title) + "</h1>"
    + "<p>" + escapeHtml(page.description) + "</p>"
    + '<p><a href="/#kp">Связаться с компанией</a></p></main>';
  writePage("catalog/" + page.slug, title, page.description, "noindex,follow", body, page.image);
}

for (const page of products) {
  const title = page.title + " — Надёжный партнёр";
  const body = header
    + "<main><p>Банковские лотки</p><h1>" + escapeHtml(page.title) + "</h1>"
    + "<p>" + escapeHtml(page.description) + "</p>"
    + '<p><a href="/catalog/bankovskie-lotki/">Вернуться к категории</a></p></main>';
  writePage("product/" + page.slug, title, page.description, "noindex,follow", body);
}

const companyPages = [
  { route: "o-kompanii", title: "О компании — Надёжный партнёр", description: "О компании «Надёжный партнёр»: производство, поставка и монтаж дверных и противопожарных конструкций." },
  { route: "kontakty", title: "Контакты — Надёжный партнёр", description: "Контактные данные, адрес и режим работы компании «Надёжный партнёр» в Иваново." }
];
for (const page of companyPages) {
  const body = header + "<main><h1>" + escapeHtml(page.title.split(" — ")[0]) + "</h1><p>" + escapeHtml(page.description) + '</p><p><a href="/#kp">Связаться с компанией</a></p></main>';
  writePage(page.route, page.title, page.description, "index,follow", body);
}

const infoPages = [
  ["sklad", "Склад", "Сведения о складе компании пока не перенесены и не проверены."],
  ["dostavka-i-ustanovka", "Доставка и установка", "Условия доставки и монтажа необходимо уточнить у компании."],
  ["vakansii", "Вакансии", "Актуальные вакансии пока не перенесены. Уточните информацию у компании."],
  ["poleznoe", "Полезное", "Материалы этого раздела пока не перенесены и не проверены."],
  ["privacy-policy", "Политика конфиденциальности", "Оригинальный юридический текст политики ещё не получен и не утверждён оператором."],
  ["kuki", "Сведения об использовании cookie", "Оригинальный текст согласия на cookie ещё не получен и не утверждён оператором."],
  ["color-palette/ral-classic", "Цвета RAL Classic", "Архивный снимок палитры содержит повреждённые HEX-коды; значения не публикуются до проверки."]
];
for (const [route, title, description] of infoPages) {
  const body = header + "<main><h1>" + escapeHtml(title) + "</h1><p>" + escapeHtml(description) + '</p><p><a href="/#kp">Связаться с компанией</a></p></main>';
  writePage(route, title + " — Надёжный партнёр", description, "noindex,follow", body);
}

const urls = [baseUrl + "/", baseUrl + "/o-kompanii/", baseUrl + "/kontakty/"];
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + urls.map((url) => "  <url><loc>" + url + "</loc><changefreq>monthly</changefreq></url>").join("\n")
  + "\n</urlset>\n";
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), "User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: " + baseUrl + "/sitemap.xml\n");
console.log("Generated " + categories.length + " noindex category pages, " + products.length + " noindex product pages, company/info pages and a focused sitemap.");