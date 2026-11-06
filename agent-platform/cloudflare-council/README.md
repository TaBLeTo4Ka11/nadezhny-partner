# Council — iPhone-first AI workspace

A separate experimental application in this repository. It does not replace the corporate website, the existing Vercel agent project, or the Cybara evaluation branch.

## Why this architecture

The current strongest zero-server candidate is Cloudflare Workers + SQLite-backed Durable Objects + the Cloudflare Agents SDK:
- A Durable Object is a stateful, addressable agent with SQLite persistence and WebSocket support.
- It hibernates when idle and wakes on demand; no always-on computer or VPS is required.
- Workers AI is available through a binding and requires no model API key.
- Workers Free currently includes 100,000 Worker requests/day. SQLite Durable Objects are available on Free with capped usage (including 100,000 DO requests/day, 13,000 GB-s/day and 5 GB stored data). Exceeding Free quotas causes operations to fail; this project must never silently switch to paid billing.

Official sources:
- https://developers.cloudflare.com/agents/getting-started/quick-start/
- https://developers.cloudflare.com/agents/runtime/operations/using-ai-models/
- https://developers.cloudflare.com/workers/platform/pricing/\n- https://developers.cloudflare.com/workers-ai/platform/pricing/

## Current prototype

- src/server.ts: persistent CouncilAgent with a shared transcript and a three-stage workflow: independent architect + critic analyses, explicit rebuttal/arbitration, and one synthesized answer.
- src/client.tsx: responsive Russian-language chat UI designed for iPhone Safari / Add to Home Screen.
- wrangler.jsonc: Workers AI binding and SQLite-backed Durable Object registration.

Important honesty: the prototype assigns different Workers AI model families to the roles: GLM-4.7-Flash for architecture and synthesis, Qwen3-30B-A3B for independent criticism, and Llama 3.3 70B for arbitration. This is model diversity within one provider, not yet a multi-vendor council. Workers AI Free currently includes 10,000 Neurons/day; exceeding the daily free allocation causes inference requests to fail rather than silently bill. Gemini, DeepSeek API, Claude and OpenAI adapters should be added only after their free-tier terms, model access, tool calling and credentials are verified. No existing account secrets are copied into this project.

## Security and deployment gates

This prototype is not production-safe to expose publicly yet. Before deployment:
1. Create a Cloudflare Access self-hosted application for the worker hostname and restrict its policy to the owner's email identity. The Worker independently verifies the Cf-Access-Jwt-Assertion signature and audience on every request; missing configuration fails closed. Store ACCESS_TEAM_DOMAIN (for example https://your-team.cloudflareaccess.com) and ACCESS_AUD (the Access application's AUD tag) with wrangler secret put. Do not put a long-lived secret in a URL.
2. Add request rate limits and per-session ownership checks.
3. Add export/backup and data deletion controls.
4. Add tests for concurrent runs, interrupted requests, persistence after hibernation, and quota exhaustion.
5. Confirm Cloudflare account is on Free and has no paid Workers subscription or billing commitment.
6. Confirm reachability from the user's iPhone network in Russia before treating it as usable.

No credentials, external tools, shell execution, Git write access, or public MCP servers are enabled in this prototype.

## Local development

Requires Node.js 20+ and npm. Run npm install, npm run dev, npm run typecheck, and npm run build.

## Cloudflare deployment (not yet performed)

After the security gates pass and an account is available:
- Configure Cloudflare Workers Free.
- Run npx wrangler login.
- Deploy with npm run deploy.

Deployment is intentionally not automated from this repository because no Cloudflare account is connected to the available integrations. The app rejects all requests until Cloudflare Access is configured and its two verification values are set. No paid resources have been created.

## Roadmap

1. Authenticated private iPhone PWA and persistent Council room.
2. Provider router: Workers AI fallback plus verified free Gemini/DeepSeek/OpenAI-compatible providers.
3. Shared room where agents can read and revise one another's messages, with bounded debate rounds.
4. Read-only GitHub, web research and package/security research tools.
5. Isolated coding executor and approval-gated Git branch/PR writes. Use ephemeral GitHub Actions runners for jobs; never grant arbitrary shell to the public chat Worker.
6. Tests, audit, backup/restore and mobile network verification.
