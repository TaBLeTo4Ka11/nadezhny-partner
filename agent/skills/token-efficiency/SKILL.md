# Token and cost efficiency

- Start with project memory and targeted code search; do not dump the repository.
- Keep stable system instructions and tool schemas unchanged where provider prompt caching can reuse prefixes.
- Prefer deterministic local tools (AST/Graphify code-only, package metadata, OSV) over LLM inference.
- Read relevant file ranges; cap tool output and remove irrelevant boilerplate.
- Never summarize away exact identifiers, versions, errors, constraints or decisions.
- Avoid duplicate searches; cache deterministic metadata only with freshness timestamps.
- Use cheap models for routine work; route architecture/security/debugging to stronger models when needed.
- Track actual input/output/cached token usage. Never promise savings without measurement.
- No semantic compression or embeddings that silently send source code to paid providers.
