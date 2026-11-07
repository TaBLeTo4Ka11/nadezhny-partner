# Claude Fable 5.1 in GitHub Codespaces

This repository has a prepared Codespaces environment for Claude Code and RelayModels.

## Start on iPhone
1. Open this repository on GitHub and switch to branch `claude/fable-setup`.
2. Tap **Code → Codespaces → Create codespace on claude/fable-setup**.
3. Wait for the Codespace to finish creating. The first setup installs the project dependencies and Claude Code; it can take a few minutes.
4. Open **Terminal → New Terminal**.
5. Run:

   ```bash
   bash scripts/start-fable.sh
   ```

6. When prompted, paste the RelayModels API key and press Enter. Input is hidden. The script does not save the key in the repository.
7. Claude Code starts in plan mode. Start with the audit prompt below.

## Model connection
The launcher uses the RelayModels Claude Code settings:
- Base URL: `https://api.relaymodels.com/v1`
- Model: `claude-fable-5-1`
- Authentication variable: `ANTHROPIC_AUTH_TOKEN`

The key is held only in the current terminal process environment. If the Codespace is stopped/recreated or a new terminal is opened, run the launcher again and paste the key again. Never put the key into a source file, commit, issue, or chat.

## First prompt: read-only audit

```text
Проведи полный read-only аудит сайта «Надёжный партнёр».
Сначала изучи структуру репозитория, маршруты, страницы, компоненты,
каталог, данные, изображения, SEO, адаптивность, доступность,
производительность, безопасность и CI.

Запусти production build и другие уже настроенные проверки.
Ничего не изменяй, не устанавливай новые зависимости и не делай commit.

Верни отчёт на русском языке:
1. Архитектура проекта и ключевые файлы.
2. Проверки, которые реально запускались, и их результаты.
3. Подтверждённые ошибки с доказательствами и файлами.
4. Недочёты и рекомендации, отдельно от ошибок.
5. Приоритетный план исправлений.
6. План создания и интеграции интерактивной реалистичной 3D-модели
   противопожарной стальной двери на Three.js с поддержкой iPhone.

Сохрани все существующие материалы и функциональность.
Дождись моего согласия перед любыми изменениями.
```

## Notes
- The Codespace is created from this feature branch, not `main`.
- Claude starts with `--permission-mode plan`, so inspect and plan first.
- Review all proposed changes before accepting them. Do not merge the branch into `main` until the site is tested.
- If RelayModels returns an API/model compatibility error, stop and inspect the exact error rather than repeatedly retrying (requests may be billed).
