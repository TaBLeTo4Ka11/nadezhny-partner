# Cybara adoption assessment and integration plan

Status: preliminary static audit; no code from upstream Cybara has been installed or executed.

## Goal

Make one iPhone-first entry point for the user's development workflow. A single request should be handled by a coordinated agent team that can research, critique one another, use project tools, implement changes, verify them, and return one synthesized report. Keep the existing corporate website and the current agent backend intact while evaluating Cybara as a separate runtime.

## Upstream candidate

- Repository: https://github.com/metaspartan/cybara
- Audited ref: `main` at `6db8b574ac872afb9a0b57cf9e1ef7368428869c` (2026-10-24)
- License declared in root package metadata: MIT
- Runtime: Bun + TypeScript gateway; React web UI; React Native iOS/Android companion.
- Root package declares version `1.0.2555`; `apps/mobile/package.json` declares `1.0.330`, while `apps/mobile/app.json` declares `1.0.2555`. Resolve this version mismatch before building/releasing mobile artifacts.

## Confirmed from source documentation

- Persistent sessions and shared session persistence across clients.
- Subagents with isolated sessions and multi-result synthesis.
- Persistent group-room sessions with round-robin, mention-only, parallel, and moderated discussion modes; bounded rounds and manual next-speaker control.
- Provider registry/router, usage-aware account pools, and mixture-of-agents synthesis.
- MCP host/client, plugins, skills, browser, terminal, Git, IDE/LSP and file tools.
- Durable memory and task/plan facilities.
- React Native companion app is remote-first: it connects to an already-running Cybara Gateway; it does not host the runtime on the iPhone.
- Mobile pairing supports short-lived one-time pairing codes and revocable per-device tokens.
- Gateway exposes REST/SSE/WebSocket surfaces and persists state in SQLite under `~/.cybara`.

Primary upstream docs reviewed:
- `README.md`
- `docs/architecture.md`
- `docs/agent-runtime.md`
- `docs/security.md`
- `docs/production.md`
- `apps/mobile/README.md`
- `apps/mobile/app.json`, `apps/mobile/package.json`
- `scripts/postinstall.ts`
- `.github/workflows/ci.yml`, `.github/workflows/release.yml`

## Critical constraints

1. The Gateway is a persistent Bun process with filesystem/SQLite state, terminal processes and WebSockets. Vercel Functions/serverless deployment is not an appropriate primary host.
2. The iOS companion is not a self-contained agent. It needs a reachable, always-on Gateway.
3. The upstream mobile README says signed iOS distribution/TestFlight depends on Apple signing and App Store Connect secrets. An unsigned IPA is not directly installable on a normal iPhone. A free iPhone-first fallback may be the web UI/PWA over HTTPS, but must be tested on-device before selecting it.
4. Zero-cost model use is not guaranteed by Cybara. Each provider's free quota, OAuth terms, model availability, rate limits and tool-calling support must be checked individually. Never assume an API is free because the client is open source.
5. Current Vercel agent project is a separate serverless backend with a fixed internal tool list. It should not be merged into Cybara blindly; integrate through explicit adapters or migrate selected tools after testing.

## Security findings / precautions

- Upstream security docs explicitly state plugins and MCP servers execute trusted local code and are not a sandbox boundary.
- Keep the Gateway bound to localhost/private mesh by default. Do not expose it directly to the public internet.
- Use a dedicated gateway key and per-device revocable token. Do not reuse `AGENT_ACCESS_KEY`, GitHub OAuth credentials, COCO credentials, or any existing project secret.
- Start with no wallet, no external messaging, no arbitrary shell, and no third-party plugins.
- Review all MCP server source, package provenance, dependency lockfiles, install scripts, outbound network destinations and filesystem access before enabling.
- Run the first deployment with a disposable workspace and synthetic credentials. No real GitHub/Vercel credentials until the security gate passes.
- Take a backup of the current agent project before any migration. Do not alter production deployments during evaluation.

## Required free-hosting decision

Cybara requires an always-on process and persistent storage. Candidate zero-dollar route to investigate first: Oracle Cloud Always Free VM (subject to current eligibility, regional capacity, identity/card verification, and resource reclaim rules). This is not yet provisioned and is not guaranteed. Render's free web services sleep when idle, so they are unsuitable for a reliable always-on Gateway. Vercel Sandboxes are temporary execution environments, not a permanent host.

Do not create any paid resource or accept a paid trial. Do not enter payment details or enable billing without explicit user approval.

## Implementation sequence

### Phase 1 — upstream validation (no secrets, no production changes)
- Pin the audited upstream commit; compare latest commit/release and inspect changes.
- Resolve the mobile version mismatch.
- Inspect group-room implementation and mixture-of-agents execution path in source, not only docs.
- Inspect provider adapters and verify DeepSeek-compatible function/tool calling.
- Run dependency, license, secret, malware, static-analysis and CI checks in an isolated disposable environment.
- Review all install/update scripts and release artifacts/checksums.

### Phase 2 — architecture proof
- Run Gateway locally or on a free disposable host with a synthetic workspace.
- Verify session persistence after restart, WebSocket/SSE streaming, approvals, sandbox boundaries and backups.
- Configure at least two genuinely free/available models, if any are currently usable.
- Create a Council workflow: independent analysis -> shared transcript -> critique/rebuttal rounds -> verifier -> one final synthesis with citations/evidence and unresolved disagreements.
- Test that agents see each other's work and can materially revise it; merely concatenating model outputs does not pass.

### Phase 3 — mobile proof
- Verify iPhone access through the companion app or HTTPS web UI/PWA.
- Verify QR pairing, revocation and secure token storage.
- Confirm one chat can create tasks, read/write a test Git repository, run tests, and return one consolidated result.
- No purchase, paid Apple developer membership, or paid model API.

### Phase 4 — controlled integration
- Connect the existing `TaBLeTo4Ka11/nadezhny-partner` repository with least-privilege access.
- Add the existing agent backend's useful read-only tools through reviewed adapters.
- Add write operations only behind explicit per-action approval and Git branch/PR workflow.
- Keep corporate website deployment and current production secrets untouched.

## Acceptance criteria

Cybara is accepted as the primary agent only when all are true:
- one iPhone entry point works reliably;
- the Gateway remains available and data survives restart;
- at least one free model is usable without surprise billing;
- at least two agents genuinely debate/critique in shared context and produce one synthesized answer;
- GitHub read/write tasks work in a test branch with approval gates;
- web research and MCP tools work with verified source provenance;
- secrets are isolated and revocable;
- backup/restore and rollback are tested;
- no paid resource is created.

Until these checks pass, Cybara is an evaluation candidate, not a production replacement.
