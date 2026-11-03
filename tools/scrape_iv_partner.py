#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Conservative WordPress / WooCommerce content exporter for iv-partner.ru.

Default behavior respects robots.txt and stops when permission cannot be verified.
For a site owner-authorized export, set IVP_OWNER_AUTHORIZED=1.
For private WooCommerce REST API access, also set:
  IVP_WC_KEY=ck_...
  IVP_WC_SECRET=cs_...
Optional WordPress Application Password:
  IVP_WP_USER=...
  IVP_WP_APP_PASSWORD=...

Install: python -m pip install requests beautifulsoup4
Run:     python tools/scrape_iv_partner.py
Output:  iv-partner-export/ and iv-partner-export.zip
"""
from __future__ import annotations

import hashlib
import html
import json
import mimetypes
import os
import re
import sys
import time
import urllib.parse
import urllib.robotparser
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
from bs4 import BeautifulSoup

BASE = os.getenv("IVP_BASE_URL", "https://iv-partner.ru").rstrip("/")
OUT = Path(os.getenv("IVP_OUTPUT_DIR", "iv-partner-export"))
USER_AGENT = "NadezhnyPartnerMigration/2.0 (+authorized content migration)"
DELAY = max(1.0, float(os.getenv("IVP_DELAY_SECONDS", "1.5")))
TIMEOUT = 30
PER_PAGE = 100
MAX_PAGES = 500
MAX_DOWNLOADS = 500
MAX_FILE_BYTES = 30 * 1024 * 1024
DOWNLOAD_MEDIA = os.getenv("IVP_DOWNLOAD_MEDIA", "1") == "1"
OWNER_AUTHORIZED = os.getenv("IVP_OWNER_AUTHORIZED", "0") == "1"
WC_KEY = os.getenv("IVP_WC_KEY", "")
WC_SECRET = os.getenv("IVP_WC_SECRET", "")
WP_USER = os.getenv("IVP_WP_USER", "")
WP_APP_PASSWORD = os.getenv("IVP_WP_APP_PASSWORD", "")

session = requests.Session()
session.headers.update({
    "User-Agent": USER_AGENT,
    "Accept": "application/json, text/html;q=0.9, */*;q=0.5",
})
if WP_USER and WP_APP_PASSWORD:
    session.auth = (WP_USER, WP_APP_PASSWORD)

NOTES: list[str] = []
REQUEST_COUNT = 0


class StopExport(RuntimeError):
    pass


def log(message: str) -> None:
    NOTES.append(message)
    print(message, flush=True)


def safe_json(response: requests.Response) -> Any:
    try:
        return response.json()
    except ValueError:
        return None


def request(url: str, params: dict[str, Any] | None = None,
            stream: bool = False) -> requests.Response | None:
    global REQUEST_COUNT
    REQUEST_COUNT += 1
    if REQUEST_COUNT > 10000:
        raise StopExport("Превышен предохранительный лимит запросов (10000).")
    time.sleep(DELAY)
    try:
        response = session.get(url, params=params, timeout=TIMEOUT, stream=stream)
    except requests.RequestException as exc:
        log(f"СЕТЕВАЯ ОШИБКА: {url} ({type(exc).__name__})")
        return None
    if response.status_code in (401, 403, 429):
        raise StopExport(
            f"Сайт/API ответил HTTP {response.status_code}: {response.url}. "
            "Экспорт остановлен; обход защиты не выполняется."
        )
    return response


def check_robots() -> None:
    robots_url = BASE + "/robots.txt"
    try:
        response = session.get(robots_url, timeout=TIMEOUT)
    except requests.RequestException as exc:
        if OWNER_AUTHORIZED:
            log(f"ПРЕДУПРЕЖДЕНИЕ: robots.txt недоступен ({type(exc).__name__}); "
                "продолжение только по явному разрешению владельца.")
            return
        raise StopExport(
            "Не удалось проверить robots.txt. По умолчанию экспорт остановлен. "
            "Если владелец сайта явно разрешил выгрузку, задайте IVP_OWNER_AUTHORIZED=1."
        )
    if response.status_code in (401, 403, 429):
        if OWNER_AUTHORIZED:
            log(f"ПРЕДУПРЕЖДЕНИЕ: robots.txt вернул HTTP {response.status_code}; "
                "продолжение только по явному разрешению владельца.")
            return
        raise StopExport(f"robots.txt вернул HTTP {response.status_code}; экспорт остановлен.")
    if response.status_code == 404:
        log("robots.txt не найден (HTTP 404); проверка ограничений по этому файлу невозможна.")
        if not OWNER_AUTHORIZED:
            raise StopExport("Нет подтверждённого разрешения владельца; экспорт остановлен.")
        return
    if response.status_code != 200:
        if OWNER_AUTHORIZED:
            log(f"ПРЕДУПРЕЖДЕНИЕ: robots.txt вернул HTTP {response.status_code}; "
                "продолжение по разрешению владельца.")
            return
        raise StopExport(f"Не удалось проверить robots.txt (HTTP {response.status_code}).")
    parser = urllib.robotparser.RobotFileParser()
    parser.set_url(robots_url)
    parser.parse(response.text.splitlines())
    allowed = parser.can_fetch(USER_AGENT, BASE + "/")
    if not allowed and not OWNER_AUTHORIZED:
        raise StopExport(
            "robots.txt запрещает автоматический доступ этому User-Agent. "
            "Скрипт остановлен. Используйте официальный экспорт WordPress/WooCommerce "
            "или получите явное разрешение владельца."
        )
    if not allowed:
        log("ВНИМАНИЕ: robots.txt запрещает автоматический доступ; продолжаем только "
            "потому, что владелец явно подтвердил разрешение (IVP_OWNER_AUTHORIZED=1).")
    else:
        log("robots.txt: доступ для указанного User-Agent разрешён.")


def clean_text(value: Any) -> str:
    if value is None:
        return ""
    soup = BeautifulSoup(str(value), "html.parser")
    for node in soup(["script", "style", "noscript"]):
        node.decompose()
    for br in soup.find_all("br"):
        br.replace_with("\n")
    text = html.unescape(soup.get_text(" ", strip=True))
    text = re.sub(r"[\t\xa0 ]+", " ", text)
    text = re.sub(r" *\n *", "\n", text)
    return text.strip()


def paginate(endpoint: str, label: str, params: dict[str, Any] | None = None,
             wc_auth: bool = False) -> tuple[list[dict[str, Any]], bool]:
    collected: list[dict[str, Any]] = []
    base_params = dict(params or {})
    for page in range(1, MAX_PAGES + 1):
        query = {**base_params, "per_page": PER_PAGE, "page": page}
        if wc_auth:
            query.update({"consumer_key": WC_KEY, "consumer_secret": WC_SECRET})
        response = request(endpoint, query)
        if response is None:
            return collected, False
        if response.status_code == 404:
            log(f"НЕДОСТУПНО {label}: HTTP 404")
            return collected, False
        if response.status_code != 200:
            log(f"НЕДОСТУПНО {label}: HTTP {response.status_code}")
            return collected, False
        payload = safe_json(response)
        if not isinstance(payload, list):
            log(f"НЕОЖИДАННЫЙ ОТВЕТ {label}: ожидался JSON-массив.")
            return collected, False
        if not payload:
            break
        collected.extend(x for x in payload if isinstance(x, dict))
        total_pages = response.headers.get("X-WP-TotalPages")
        if total_pages and total_pages.isdigit():
            if page >= int(total_pages):
                break
        elif len(payload) < PER_PAGE:
            break
    else:
        log(f"ПРЕДУПРЕЖДЕНИЕ: достигнут предел страниц для {label}.")
        return collected, False
    log(f"OK {label}: {len(collected)} записей.")
    return collected, True


def html_to_record(raw: dict[str, Any], key: str) -> str:
    return clean_text((raw.get(key) or {}).get("rendered") if isinstance(raw.get(key), dict) else raw.get(key))


def normalize_wc_product(item: dict[str, Any], source: str) -> dict[str, Any]:
    images = []
    for image in item.get("images") or []:
        if not isinstance(image, dict):
            continue
        images.append({
            "url": image.get("src") or image.get("url"),
            "name": image.get("name"),
            "alt": image.get("alt") or image.get("alt_text"),
            "id": image.get("id"),
        })
    categories = []
    for category in item.get("categories") or []:
        if isinstance(category, dict):
            categories.append({
                "id": category.get("id"), "name": category.get("name"),
                "slug": category.get("slug"), "url": category.get("permalink"),
                "parent": category.get("parent"),
            })
    attributes = []
    for attribute in item.get("attributes") or []:
        if isinstance(attribute, dict):
            attributes.append({
                "id": attribute.get("id"), "name": attribute.get("name"),
                "options": attribute.get("options") or [],
                "visible": attribute.get("visible"),
                "variation": attribute.get("variation"),
            })
    price = None
    if source == "wc/v3":
        raw_price = item.get("price")
        if raw_price not in (None, ""):
            price = {"raw": str(raw_price), "currency": None}
    else:
        prices = item.get("prices") or {}
        raw_price = prices.get("price")
        try:
            if raw_price not in (None, ""):
                minor = int(prices.get("currency_minor_unit", 2))
                price = {
                    "value": int(raw_price) / (10 ** minor),
                    "currency": prices.get("currency_code"),
                }
        except (ValueError, TypeError):
            price = None
    return {
        "id": item.get("id"), "title": clean_text(item.get("name")),
        "slug": item.get("slug"), "url": item.get("permalink"),
        "type": item.get("type"), "status": item.get("status"),
        "sku": item.get("sku") or None, "description": clean_text(item.get("description")),
        "description_html": item.get("description") or None,
        "short_description": clean_text(item.get("short_description")),
        "short_description_html": item.get("short_description") or None,
        "categories": categories, "attributes": attributes,
        "default_attributes": item.get("default_attributes") or [],
        "variations": item.get("variations") or [],
        "price": price, "regular_price": item.get("regular_price") or None,
        "sale_price": item.get("sale_price") or None,
        "stock_status": item.get("stock_status"), "manage_stock": item.get("manage_stock"),
        "dimensions": item.get("dimensions"), "weight": item.get("weight"),
        "images": images, "source": source,
        "source_id": item.get("id"),
    }


def normalize_wp_post(item: dict[str, Any], kind: str) -> dict[str, Any]:
    return {
        "id": item.get("id"), "slug": item.get("slug"), "url": item.get("link"),
        "title": html_to_record(item, "title"),
        "text": html_to_record(item, "content"),
        "html": (item.get("content") or {}).get("rendered") if isinstance(item.get("content"), dict) else None,
        "excerpt": html_to_record(item, "excerpt"),
        "modified": item.get("modified"), "date": item.get("date"),
        "status": item.get("status"), "source": f"wp/v2/{kind}",
    }


def discover_sitemaps() -> list[str]:
    candidates = [BASE + "/wp-sitemap.xml", BASE + "/sitemap_index.xml",
                  BASE + "/product-sitemap.xml", BASE + "/sitemap.xml"]
    found: list[str] = []
    seen: set[str] = set()
    for candidate in candidates:
        response = request(candidate)
        if response is None or response.status_code != 200:
            continue
        locs = re.findall(r"<loc>\s*(.*?)\s*</loc>", response.text, flags=re.I)
        if locs:
            found.extend(locs)
            log(f"Sitemap найден: {candidate} ({len(locs)} ссылок первого уровня).")
            break
    # Follow only sitemap URLs on the same host; depth and count are bounded.
    queue: list[tuple[str, int]] = []
    urls: list[str] = []
    host = urllib.parse.urlparse(BASE).netloc
    for loc in found:
        parsed = urllib.parse.urlparse(loc)
        if parsed.netloc != host:
            continue
        if parsed.path.lower().endswith(".xml"):
            queue.append((loc, 1))
        else:
            urls.append(loc)
    while queue and len(seen) < 30:
        current, depth = queue.pop(0)
        if current in seen or depth > 3:
            continue
        seen.add(current)
        response = request(current)
        if response is None or response.status_code != 200:
            continue
        locs = re.findall(r"<loc>\s*(.*?)\s*</loc>", response.text, flags=re.I)
        for loc in locs:
            parsed = urllib.parse.urlparse(loc)
            if parsed.netloc != host:
                continue
            if parsed.path.lower().endswith(".xml") and depth < 3:
                queue.append((loc, depth + 1))
            else:
                urls.append(loc)
    return sorted(set(urls))


def parse_product_page(url: str) -> dict[str, Any] | None:
    response = request(url)
    if response is None or response.status_code != 200:
        return None
    soup = BeautifulSoup(response.text, "html.parser")
    title = soup.select_one("h1.product_title, h1.entry-title, main h1, h1")
    description = soup.select_one(
        "#tab-description, .woocommerce-Tabs-panel--description, "
        ".woocommerce-product-details__short-description"
    )
    short = soup.select_one(".woocommerce-product-details__short-description")
    sku = soup.select_one(".sku")
    price = soup.select_one(".summary .price, p.price, .price")
    images, seen = [], set()
    for element in soup.select(
        ".woocommerce-product-gallery__image a, "
        ".woocommerce-product-gallery__image img, "
        "img.wp-post-image"
    ):
        image_url = (element.get("href") or element.get("data-large_image")
                     or element.get("data-src") or element.get("src"))
        if image_url:
            image_url = urllib.parse.urljoin(url, image_url)
            if image_url not in seen:
                seen.add(image_url)
                images.append({"url": image_url, "alt": element.get("alt"), "name": None})
    attrs = []
    for row in soup.select("table.woocommerce-product-attributes tr, table.shop_attributes tr"):
        th, td = row.find("th"), row.find("td")
        if th and td:
            attrs.append({"name": clean_text(th.get_text(" ", strip=True)),
                          "options": [clean_text(td.get_text(" ", strip=True))]})
    categories = [{"name": a.get_text(" ", strip=True), "url": a.get("href")}
                  for a in soup.select(".posted_in a")]
    return {
        "id": None, "title": title.get_text(" ", strip=True) if title else None,
        "slug": urllib.parse.urlparse(url).path.rstrip("/").split("/")[-1],
        "url": url, "sku": sku.get_text(" ", strip=True) if sku else None,
        "description": clean_text(description.get_text("\n", strip=True)) if description else "",
        "description_html": str(description) if description else None,
        "short_description": clean_text(short.get_text(" ", strip=True)) if short else "",
        "categories": categories, "attributes": attrs, "variations": [],
        "price": {"raw_text": price.get_text(" ", strip=True)} if price else None,
        "images": images, "source": "product-html",
    }


def safe_filename(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    basename = urllib.parse.unquote(parsed.path.rsplit("/", 1)[-1]) or "media"
    basename = re.sub(r"[^A-Za-zА-Яа-яЁё0-9._-]+", "_", basename)[:120]
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:12]
    return f"{digest}_{basename}"


def download_file(url: str, folder: Path) -> dict[str, Any]:
    result = {"url": url, "local_file": None, "download_status": "not_attempted"}
    if not url:
        result["download_status"] = "missing_url"
        return result
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https") or parsed.netloc != urllib.parse.urlparse(BASE).netloc:
        result["download_status"] = "skipped_external_host"
        return result
    response = request(url, stream=True)
    if response is None or response.status_code != 200:
        result["download_status"] = f"http_{response.status_code}" if response else "network_error"
        return result
    content_type = (response.headers.get("Content-Type") or "").split(";")[0].lower()
    if not (content_type.startswith("image/") or content_type == "application/pdf"):
        result["download_status"] = f"skipped_unexpected_content_type:{content_type or 'unknown'}"
        return result
    length = response.headers.get("Content-Length")
    if length and length.isdigit() and int(length) > MAX_FILE_BYTES:
        result["download_status"] = "skipped_too_large"
        return result
    filename = safe_filename(url)
    path = folder / filename
    size = 0
    try:
        with path.open("wb") as handle:
            for chunk in response.iter_content(chunk_size=64 * 1024):
                if not chunk:
                    continue
                size += len(chunk)
                if size > MAX_FILE_BYTES:
                    handle.close()
                    path.unlink(missing_ok=True)
                    result["download_status"] = "skipped_too_large"
                    return result
                handle.write(chunk)
    except OSError:
        path.unlink(missing_ok=True)
        result["download_status"] = "write_error"
        return result
    result.update({"local_file": str(path.relative_to(OUT)), "bytes": size,
                   "mime": content_type, "download_status": "downloaded"})
    return result


def write_json(name: str, payload: Any) -> None:
    (OUT / name).write_text(json.dumps(payload, ensure_ascii=False, indent=2),
                            encoding="utf-8")


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "images").mkdir(exist_ok=True)
    log(f"Экспорт: {BASE}")
    log(f"Режим WooCommerce: {'REST API wc/v3 (авторизованный)' if WC_KEY and WC_SECRET else 'публичный Store API'}")
    try:
        check_robots()

        products: list[dict[str, Any]] = []
        categories: list[dict[str, Any]] = []
        pages: list[dict[str, Any]] = []
        posts: list[dict[str, Any]] = []
        media: list[dict[str, Any]] = []
        product_ok = False

        # Authenticated WooCommerce REST API provides the richest product fields.
        if WC_KEY and WC_SECRET:
            raw_products, product_ok = paginate(
                BASE + "/wp-json/wc/v3/products", "WooCommerce REST: товары",
                {"status": "publish"}, wc_auth=True
            )
            products = [normalize_wc_product(x, "wc/v3") for x in raw_products]
            raw_categories, _ = paginate(
                BASE + "/wp-json/wc/v3/products/categories", "WooCommerce REST: категории",
                wc_auth=True
            )
            categories = raw_categories

        # Public Store API is a fallback, not an authentication bypass.
        if not product_ok:
            raw_products, product_ok = paginate(
                BASE + "/wp-json/wc/store/v1/products", "WooCommerce Store API: товары"
            )
            products = [normalize_wc_product(x, "wc/store/v1") for x in raw_products]
            raw_categories, _ = paginate(
                BASE + "/wp-json/wc/store/v1/products/categories",
                "WooCommerce Store API: категории"
            )
            categories = raw_categories

        # Fetch full variation records when authenticated WooCommerce REST API is available.
        if WC_KEY and WC_SECRET and products:
            for product in products:
                if product.get("type") != "variable" or not product.get("id"):
                    continue
                raw_variations, variations_ok = paginate(
                    BASE + f"/wp-json/wc/v3/products/{product['id']}/variations",
                    f"WooCommerce REST: вариации товара {product['id']}",
                    {"status": "publish"}, wc_auth=True
                )
                if variations_ok:
                    product["variation_records"] = raw_variations

        raw_pages, _ = paginate(BASE + "/wp-json/wp/v2/pages", "WordPress: страницы",
                                {"status": "publish"})
        pages = [normalize_wp_post(x, "pages") for x in raw_pages]
        raw_posts, _ = paginate(BASE + "/wp-json/wp/v2/posts", "WordPress: записи",
                                {"status": "publish"})
        posts = [normalize_wp_post(x, "posts") for x in raw_posts]
        raw_media, _ = paginate(BASE + "/wp-json/wp/v2/media", "WordPress: медиатека")
        media = raw_media

        # If API product catalogue is unavailable/empty, use same-host sitemap product URLs.
        if not products:
            urls = discover_sitemaps()
            product_urls = [u for u in urls if re.search(r"/product/[^/]+/?$", urllib.parse.urlparse(u).path)]
            log(f"Запасной sitemap-поиск: {len(product_urls)} URL карточек товаров.")
            for url in product_urls:
                item = parse_product_page(url)
                if item:
                    products.append(item)
            if not categories:
                cat_urls = [u for u in urls if "/product-category/" in urllib.parse.urlparse(u).path]
                categories = [{"name": None, "slug": urllib.parse.urlparse(u).path.rstrip("/").split("/")[-1],
                               "url": u, "source": "sitemap"} for u in cat_urls]

        # Build media index from WordPress media library and product gallery references.
        media_index: dict[str, dict[str, Any]] = {}
        documents: list[dict[str, Any]] = []
        for item in media:
            mime = item.get("mime_type") or ""
            details = item.get("media_details") or {}
            source_url = item.get("source_url")
            record = {
                "id": item.get("id"), "file": urllib.parse.urlparse(source_url or "").path.rsplit("/", 1)[-1],
                "url": source_url, "mime": mime, "width": details.get("width"),
                "height": details.get("height"), "alt": item.get("alt_text"),
                "title": html_to_record(item, "title"), "page_url": item.get("link"),
                "source": "wp/v2/media",
            }
            if mime.startswith("image/") and source_url:
                media_index[source_url] = record
            elif mime and source_url:
                documents.append(record)

        for product in products:
            for image in product.get("images", []):
                image_url = image.get("url")
                if image_url and image_url not in media_index:
                    media_index[image_url] = {
                        "file": urllib.parse.urlparse(image_url).path.rsplit("/", 1)[-1],
                        "url": image_url, "mime": None, "width": None, "height": None,
                        "alt": image.get("alt"), "title": image.get("name"),
                        "page_url": product.get("url"), "source": product.get("source"),
                    }
        image_records = list(media_index.values())

        # Associate product image URLs without guessing image-to-product relationships.
        by_image: dict[str, list[str]] = {}
        for product in products:
            for image in product.get("images", []):
                if image.get("url"):
                    by_image.setdefault(image["url"], []).append(product.get("title") or "")
        for image in image_records:
            image["products"] = by_image.get(image.get("url"), [])

        download_count = 0
        if DOWNLOAD_MEDIA:
            for record in image_records + documents:
                if download_count >= MAX_DOWNLOADS:
                    log(f"Достигнут лимит скачивания {MAX_DOWNLOADS} файлов.")
                    break
                url = record.get("url")
                if not url:
                    continue
                downloaded = download_file(url, OUT / "images")
                record.update(downloaded)
                if downloaded.get("download_status") == "downloaded":
                    download_count += 1

        write_json("products.json", {"count": len(products), "products": products})
        write_json("categories.json", {"count": len(categories), "categories": categories})
        write_json("images.json", {"count": len(image_records), "images": image_records})
        write_json("pages.json", {"pages": pages, "posts": posts})
        write_json("documents.json", {"count": len(documents), "documents": documents})

        full_cards = sum(bool(p.get("description") and p.get("images")) for p in products)
        report = [
            "# Отчёт об экспорте", "",
            f"- Дата UTC: {datetime.now(timezone.utc).isoformat()}",
            f"- Источник: {BASE}",
            f"- Товары: {len(products)}",
            f"- Карточки с описанием и фото: {full_cards}",
            f"- Категории: {len(categories)}",
            f"- Карточки с характеристиками: {sum(bool(p.get('attributes')) for p in products)}",
            f"- Карточки с ценой: {sum(bool(p.get('price')) for p in products)}",
            f"- Изображения: {len(image_records)}",
            f"- Документы: {len(documents)}",
            f"- Страницы: {len(pages)}; записи: {len(posts)}",
            f"- Скачано файлов: {download_count}",
            f"- Запросов: {REQUEST_COUNT}", "",
            "## Источники и ограничения", "",
            "Данные извлечены из WordPress REST API, WooCommerce REST/Store API, "
            "медиатеки и/или публичных sitemap/HTML-страниц. Поля, которых нет в источнике, "
            "не заполнялись догадками.", "",
            "## Журнал", "",
        ] + [f"- {entry}" for entry in NOTES]
        (OUT / "SOURCES.md").write_text("\n".join(report) + "\n", encoding="utf-8")

        archive = Path(str(OUT) + ".zip")
        with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as zf:
            for path in OUT.rglob("*"):
                if path.is_file():
                    zf.write(path, path.relative_to(OUT.parent))
        log(f"ГОТОВО: {archive.resolve()}")
        log(f"ИТОГО: товары={len(products)}, категории={len(categories)}, "
            f"фото={len(image_records)}, документы={len(documents)}, "
            f"страницы={len(pages)}, записи={len(posts)}.")
        return 0
    except StopExport as exc:
        log(f"ЭКСПОРТ ОСТАНОВЛЕН: {exc}")
        (OUT / "EXPORT_STOPPED.txt").write_text("\n".join(NOTES) + "\n", encoding="utf-8")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
