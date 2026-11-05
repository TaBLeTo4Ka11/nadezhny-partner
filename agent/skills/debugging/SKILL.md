# Debugging

1. Reproduce the exact error from logs or a test; do not guess.
2. Find the failing symbol and callers with repository code search.
3. Read only relevant files, config and tests.
4. Form a falsifiable root-cause hypothesis and cite evidence.
5. Make the smallest fix; add a regression test where possible.
6. Run narrow tests first, then typecheck/lint/build as appropriate.
7. Review diff for unrelated changes and report what remains unverified.
