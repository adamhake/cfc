#!/usr/bin/env bash
#
# Netlify `ignore` command — decides whether a site's build can be skipped.
#
# Netlify skips the build when this exits 0 and builds on any other exit code,
# so every uncertain case here deliberately fails open. A needless build costs a
# few minutes; a silently skipped deploy is invisible until someone notices the
# site is months stale.
#
# Usage from netlify.toml:
#   ignore = "bash \"$(git rev-parse --show-toplevel)/scripts/netlify-ignore.sh\" apps/next-web"

set -uo pipefail

app_dir=${1:?usage: netlify-ignore.sh <app directory, repo-root-relative>}

# Shared inputs — a change to any of these can change how every app builds.
shared_paths=(
  packages/sanity-config
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  turbo.json
  .node-version
  .nvmrc
)

# CACHED_COMMIT_REF is empty when Netlify has no build cache — a first build, or
# a cache that expired after the site sat idle. Left unguarded, the two-commit
# `git diff` below collapses into a one-commit diff against the working tree,
# which is always clean in a fresh checkout: exit 0, build skipped. That state
# is self-perpetuating, because a skipped build never writes a cache.
if [[ -z ${CACHED_COMMIT_REF:-} ]]; then
  echo "netlify-ignore: no CACHED_COMMIT_REF (no build cache) — building."
  exit 1
fi

if ! git cat-file -e "${CACHED_COMMIT_REF}^{commit}" 2>/dev/null; then
  echo "netlify-ignore: CACHED_COMMIT_REF ${CACHED_COMMIT_REF} is not in this clone (rewritten history?) — building."
  exit 1
fi

# `:/` anchors each pathspec to the repo root, so the answer does not depend on
# which directory Netlify happens to run this from.
pathspecs=(":/${app_dir}")
for path in "${shared_paths[@]}"; do
  pathspecs+=(":/${path}")
done

if git diff --quiet "${CACHED_COMMIT_REF}" "${COMMIT_REF}" -- "${pathspecs[@]}"; then
  echo "netlify-ignore: no changes to ${app_dir} or shared config since ${CACHED_COMMIT_REF} — skipping build."
  exit 0
fi

echo "netlify-ignore: changes since ${CACHED_COMMIT_REF} affect ${app_dir} — building."
exit 1
