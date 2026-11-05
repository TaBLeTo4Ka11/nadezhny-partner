import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const categories = JSON.parse(fs.readFileSync(path.join(root, "seo/catalog-pages.json"), "utf8"));
const products = JSON.parse(fs.readFileSync(path.join(root, "seo/product-pages.json"), "utf8"));
const companyPages = JSON.parse(fs.readFileSync(path.join(root, "seo/company-pages.json"), "utf8"));
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

for (const page of companyPages) {
  let body = header + "<main><h1>" + escapeHtml(page.title.split(" — ")[0]) + "</h1>";
  if (page.paragraphs) {
    body += page.paragraphs.map((paragraph) => "<p>" + escapeHtml(paragraph) + "</p>").join("\\n");
    body += "<h2>Этапы производства</h2><ul>" + page.stages.map((stage) => "<li>" + escapeHtml(stage) + "</li>").join("") + "</ul>";
  } else {
    body += "<p>" + escapeHtml(page.address) + "</p>";
    body += "<p>" + page.phones.map(escapeHtml).join(" · ") + "</p>";
    body += "<p>" + escapeHtml(page.email) + "</p><p>" + escapeHtml(page.hours) + "</p>";
  }
  body += '<p><a href="/#kp">Связаться с компанией</a></p></main>';
  writePage(page.route, page.title, page.description, "index,follow", body);
}

const infoPages = [
  ["sklad", "Склад", "Информация о наличии продукции и сроках отгрузки предоставляется менеджерами компании по запросу."],
  ["dostavka-i-ustanovka", "Доставка и установка", "Компания организует поставку и монтаж противопожарных преград и специальных дверных конструкций. Сроки и условия согласовываются при оформлении заказа."],
  ["vakansii", "Вакансии", "По вопросам трудоустройства и сотрудничества можно обратиться в компанию по телефону или электронной почте."],
  ["poleznoe", "Полезное", "Информация о продукции, комплектации, монтаже и эксплуатации дверных конструкций предоставляется специалистами компании."],
  ["privacy-policy", "Политика конфиденциальности", "Порядок обработки и защиты персональных данных посетителей сайта iv-partner.ru."],
  ["kuki", "Согласие на использование cookie", "Информация об использовании файлов cookie и аналогичных технологий на сайте iv-partner.ru."],
  ["color-palette/ral-classic", "Цвета RAL Classic", "Варианты цветов и покрытий дверных конструкций согласовываются с менеджером компании."]
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