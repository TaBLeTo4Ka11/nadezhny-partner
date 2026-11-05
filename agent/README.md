# Надёжный партнёр — AI-разработчик (первый этап)

Отдельная мобильная панель разработчика. Она не встраивается в публичный сайт и не меняет его интерфейс. Есть выбор DeepSeek V4.1 Flash, OpenAI GPT-6 Luna, Claude Haiku 5.5 / Sonnet 5.5 и бесплатных Recursive Flint / Xing4.0 29B A4B через OpenRouter. Все выбранные модели используют один и тот же набор read-only инструментов проекта; write-доступа нет. Запись в репозиторий, merge и деплой намеренно отсутствуют.

## Ограничения расходов

Используется официальный DeepSeek API, модель `deepseek-flash` (актуальный API ID на момент подготовки). API-ключ хранится только в переменных окружения сервера. DeepSeek API не требует ежемесячной подписки: оплачиваются фактически использованные токены после отправки запросов. Если агентом не пользоваться, запросов и расходов на токены нет. Панель ограничивает размер входного запроса (12 000 символов), историю (8 сообщений), число циклов инструментов (5), совокупный лимит 10 000 токенов на один запрос, адаптивное глубокое рассуждение DeepSeek: high по умолчанию и max для сложных задач; размер ответа до 4 096 токенов и размер возвращаемых данных. После ответа интерфейс показывает фактическое число токенов из usage API.

Важно: эти ограничения уменьшают риск случайного перерасхода, но не являются жёстким месячным денежным лимитом. Для надёжного общего лимита потребовалось бы постоянное хранилище учёта расходов, которое сейчас специально не подключаем, чтобы не добавлять платную инфраструктуру. Не включай платные тарифы и не создавай платные ресурсы без отдельного решения.

Официальные документы:
- https://api-docs.deepseek.com/quick_start/pricing/
- https://api-docs.deepseek.com/api/create-chat-completion/

## Переменные окружения

Задать в настройках отдельного Vercel-проекта, корневая папка которого — `agent`:

- `DEEPSEEK_API_KEY` — ключ DeepSeek API (нужен для режима DeepSeek).
- `CLAUDE_API_KEY` — необязательный официальный ключ Anthropic Console (нужен только для режима Claude; без него другие модели продолжают работать).
- `OPENROUTER_API_KEY` — необязательный ключ OpenRouter для бесплатных моделей; endpoints ограничены квотами провайдера.
- `OPENAI_API_KEY` — необязательный официальный ключ OpenAI API для режима GPT-6 Luna; хранится только в server env.
- `AGENT_ACCESS_KEY` — длинный случайный пароль доступа к панели.
- `GITHUB_TOKEN` — fine-grained GitHub token только для репозитория `TaBLeTo4Ka11/nadezhny-partner`, разрешения Contents: Read-only и Pull requests: Read-only.

Не добавляй эти значения в Git, клиентский код или сообщения чата. Файл `.env.example` содержит только имена переменных.

## Развёртывание

1. Создать отдельный Vercel Project из этого репозитория.
2. Установить Root Directory = `agent`; не подключать его к production-проекту сайта.
3. Добавить `AGENT_ACCESS_KEY`, `GITHUB_TOKEN`, `DEEPSEEK_API_KEY` и по желанию `OPENAI_API_KEY`, `CLAUDE_API_KEY`, `OPENROUTER_API_KEY` для Preview/Production.
4. Развернуть только после проверки переменных и доступа.
5. Открыть выданный Preview URL на телефоне.

Пока переменные не добавлены, панель не заработает. Никакие секреты в репозитории не сохранены.

## Защитные ограничения первого этапа

- Жёстко закреплён репозиторий `TaBLeTo4Ka11/nadezhny-partner`.
- Модели используют общий список read-only инструментов: PR/файлы, GitHub search, npm, Hugging Face, Stack Overflow, OSV и документация.
- Нельзя создавать/изменять/удалять файлы, ветки и PR, делать merge, менять настройки GitHub или запускать деплой.
- Проверяется имя инструмента и JSON-аргументы; путь к файлу не может содержать `..`.
- Запросы к DeepSeek и GitHub выполняются только сервером.
- Доступ закрыт Bearer-ключом; размер запроса и число сообщений ограничены.
- Ограничение частоты в памяти процесса — best-effort, не замена внешнему rate limiter.

Перед реальным использованием нужен отдельный preview-деплой, тест авторизации и проверка расхода API. Ежемесячная подписка DeepSeek не нужна. Не публиковать эту панель в качестве части сайта компании.


## Сравнение моделей

- DeepSeek V4.1 Flash остаётся режимом по умолчанию: он очень экономичный и имеет GitHub/npm/Hugging Face/OSV/Stack Exchange инструменты.
- Recursive Flint через OpenRouter — бесплатная coding-модель с tool calling и контекстом 262K.
- Xing4.0 29B A4B через OpenRouter — бесплатная MoE-модель (29B параметров, 4B активных) с контекстом 262K, ориентированная на сложные инженерные задачи, tool calling и многошаговое планирование.
- Для бесплатных моделей OpenRouter опубликован ориентир 20 запросов/мин и 50 запросов/день; лимиты, квоты и доступность могут меняться. Это fallback для экспериментов, не SLA.
- Claude Haiku 5.5 — быстрый и недорогой второй взгляд; Claude Sonnet 5.5 — более сильный режим для сложного анализа. Claude использует тот же безопасный набор read-only tools, что и DeepSeek, через нативный Anthropic tool-use loop. Flint и Xing4.0 используют OpenAI-совместимый tool-call loop.
- Claude подключается напрямую через официальный Anthropic Messages API. Ключ необязателен для запуска DeepSeek, хранится только в server env и не передаётся браузеру.
- Официальные цены Anthropic: Haiku 5.5 — $0.10/M input и $0.50/M output (до 100K prompt); Sonnet 5.5 — $2/M input и $10/M output. Claude заметно дороже DeepSeek Flash, поэтому для экономии оставляй DeepSeek основным.
- Модельные ID задаются сервером, а не принимаются произвольной строкой от клиента. Для OpenRouter используются только фиксированные бесплатные ID `recursive/flint-v1.0:free` и `xingchen-agi/xing4.0-29b-a4b:free`.

## Бесплатные источники и инструменты агента

Дополнительные функции не требуют отдельной платной подписки; OpenRouter требует собственный бесплатный API key:
- GitHub REST API — поиск публичных репозиториев и просмотр PR фиксированного проекта (используется уже настроенный GitHub token).
- npm Registry — поиск публичных npm-пакетов без ключа.
- OSV.dev — бесплатная проверка конкретной версии npm/PyPI/Go/Maven/NuGet/crates.io пакета на известные уязвимости.
- Hugging Face Hub API — поиск публичных моделей, датасетов и Spaces по метаданным, без запуска и скачивания кода.
- Stack Exchange API — поиск публичных вопросов Stack Overflow по ошибкам и технологиям; без отдельного ключа в пределах анонимной квоты.
- Официальная документация — чтение HTTPS-страниц только с доменов `docs.github.com`, `developer.mozilla.org`, `docs.python.org`, `nodejs.org`, `vercel.com`, `docs.vercel.com`, `api-docs.deepseek.com`.

Произвольный URL и перенаправления запрещены, чтобы не превращать инструмент в SSRF-прокси. Результаты внешних страниц считаются недоверенными данными. Эти функции не дают агенту права менять GitHub или публиковать код.

## Важные ограничения

- История интерфейса отправляет максимум 8 сообщений — столько же принимает сервер.
- Бесплатные публичные API могут иметь собственные лимиты и временную недоступность.
- Поиск GitHub использует лимиты GitHub API; поиск npm и проверка уязвимостей через OSV.dev не требуют отдельного токена.
- Никакие сторонние/утёкшие API-ключи, аккаунты, прокси или платные сервисы не добавляются.


## OpenAI GPT-6 Luna

- Добавлен отдельный необязательный провайдер OpenAI API: модель `gpt-6-luna` через официальный Chat Completions endpoint.
- Использует общий безопасный набор read-only инструментов агента: GitHub, npm, Hugging Face, Stack Overflow, OSV.dev и документацию.
- Для совместимости function calling у GPT-6 Luna в Chat Completions используется `reasoning_effort: "none"`; для более глубокого рассуждения с инструментами нужна отдельная реализация Responses API. Это честное ограничение текущего адаптера, а не «максимальный режим GPT».
- Официальная цена на момент подготовки: $0.10 за 1 млн входных и $0.50 за 1 млн выходных токенов (обычный стандартный тариф). Проверяй актуальную цену перед использованием: https://developers.openai.com/api/docs/pricing
- OpenAI API оплачивается отдельно от подписки ChatGPT. Не добавляй баланс и не включай автоплатёж без отдельного решения.
- Документация модели: https://developers.openai.com/api/docs/models/gpt-6-luna


## Project memory, skills and token efficiency

- agent/PROJECT_MEMORY.md — compact version-controlled project facts and safety constraints. Update it when architecture or rules change; it is not automatic model memory.
- agent/skills/ — focused playbooks for architecture, debugging, code review, security and token efficiency.
- Added read-only code search inside the fixed repository and exact PyPI metadata inspection to avoid blind repository dumps and unnecessary package installs.

## Graphify knowledge graph (optional, zero LLM credits for code)

Graphify is an Apache-2.0 open-source code knowledge-graph tool. Code-only extraction uses local tree-sitter parsing and requires no LLM key. The GitHub Actions workflow .github/workflows/graphify.yml builds graph.json, GRAPH_REPORT.md and graph.html using local code-only parsing, uploads the full graph as a 7-day artifact, and publishes only graph.json + GRAPH_REPORT.md to the dedicated feature branch agent/knowledge-graph. It runs on updates to the developer feature branch or manual dispatch. It never writes to main, deploys the site, or sends code to Graphify Cloud. The runtime agent can read the compact index through its existing read-only GitHub file tool. The graph is an index, not an authority; always verify against current source files.

- Official repository: https://github.com/Graphify-Labs/graphify
- Documentation: https://docs.graphify.com/reference/overview
- Package: https://pypi.org/project/graphifyy/
- Cloud features/trials are intentionally not enabled.


## Browser smoke tests (Playwright)

A separate GitHub Actions workflow runs the production build locally, serves the built site, and checks the homepage in desktop and mobile Chromium. It verifies the document title, React root mount, and uncaught page errors, then uploads screenshots for diagnosis. The workflow runs on pull requests and pushes to the feature branch; it does not deploy the site or require API keys. Playwright is installed only in the ephemeral GitHub runner with `--no-save`; it is not added to the site's production dependencies or lockfile.

## Expanded documentation sources

The agent's HTTPS documentation allowlist also includes official React, Vite, Tailwind CSS, TypeScript, Three.js, Playwright and Context7 documentation. This is a no-account fallback for reading official docs. Context7's hosted API/MCP can offer richer version-aware snippets, but its API authentication and quotas must be configured separately; no Context7 account or key is assumed or fabricated.
