# Экспорт исходного сайта iv-partner.ru

Файл `scrape_iv_partner.py` собирает доступный контент WordPress/WooCommerce в JSON и ZIP. Он не обходит robots.txt, авторизацию, HTTP 403 или 429.

## Google Colab (самый простой вариант)

1. Откройте ноутбук `tools/iv_partner_export_colab.ipynb` в Google Colab.
2. Владелец сайта уже дал явное разрешение на выгрузку для этого проекта; ноутбук предварительно настроен на `OWNER_PERMISSION_CONFIRMED = True`. Если владелец отзовёт разрешение, переключите значение на `False`.
3. Запустите ячейку. Скрипт проверит robots.txt и выполнит ограниченный экспорт. Если сайт недоступен из Colab или требует авторизацию, используйте предоставленные владельцем read-only API-ключи либо официальный экспорт WooCommerce.
4. При успешном завершении будет создан `iv-partner-export.zip`, который Colab предложит скачать.

## Более полный экспорт WooCommerce

Если владелец предоставит отдельный WooCommerce REST API key с правами чтения, можно ввести его в защищённый запрос ноутбука (значения не нужно вставлять в код/репозиторий). Переменные окружения:

- `IVP_WC_KEY` — consumer key (read-only).
- `IVP_WC_SECRET` — consumer secret (read-only).
- `IVP_WP_USER` и `IVP_WP_APP_PASSWORD` — необязательно, для защищённых материалов WordPress.

Без WooCommerce REST API key скрипт использует публичный WooCommerce Store API. У него может быть меньше полей, чем у авторизованного REST API.

## Состав архива

- `products.json` — карточки товаров, описания, категории, атрибуты, цены (если опубликованы), изображения и вариации (если API их отдаёт).
- `categories.json` — категории WooCommerce.
- `pages.json` — страницы и записи WordPress.
- `images.json` — реестр изображений и привязки к товарам.
- `documents.json` — документы и файлы из медиатеки.
- `images/` — скачанные изображения и PDF в пределах ограничений.
- `SOURCES.md` — отчёт, число извлечённых записей и журнал запросов.

Поля, которых нет в источнике, остаются пустыми. Число записей в отчёте не следует считать полным, если API/sitemap недоступен или экспорт остановился.

## Ограничения

- Скрипт не авторизует пользователя сам и не получает доступ к закрытым материалам без предоставленных владельцем учётных данных.
- Ответы 401, 403 и 429 останавливают работу.
- Скачиваются только изображения и PDF с того же домена, максимум 500 файлов по 30 МБ каждый.
- Публичные sitemap/HTML используются как ограниченный запасной источник, если каталог API пуст.
- Для юридически и коммерчески значимых данных требуется ручная сверка с владельцем.


## Owner-authorized GitHub Actions export

A one-time export workflow is available on branch `gpt6/site-completion`. It runs only when its workflow file or this README changes, checks out the exporter, and attempts a conservative owner-authorized WordPress/WooCommerce export. The output is uploaded as a short-lived Actions artifact (3 days). No credentials are stored in the repository; this first run uses public APIs. If the site requires authentication, use the Colab notebook with owner-provided read-only credentials.
