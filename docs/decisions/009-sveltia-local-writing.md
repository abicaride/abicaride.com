# ADR 009 — Sveltia for local Writing

## Status

Accepted. Supersedes [ADR 006 — Pages CMS](006-pages-cms.md).

## Context

Abi wants a visual, rich-text way to write bilingual articles while seeing the
real Astro page beside the editor. The content must remain portable Markdown in
the repository, with no CMS runtime dependency on the public site. Projects do
not currently need a CMS form.

## Decision

- Sveltia CMS is the only active CMS. Its local editor is configured in
  `public/admin/` and exposes only the Writing/Notas collection. The build
  removes `dist/admin/` before deployment; the editor is available only on the
  local development server.
- Spanish is the initial article language; English is edited in the same
  bilingual entry. The files remain in `src/content/writing/{locale}/` and are
  validated by `src/content.config.ts`.
- Abi writes in Sveltia and previews the real page in a separate local Astro
  tab. A local CMS save changes files but does not commit, push or publish.
- Projects are edited directly in the repository, with Codex assistance when
  useful. New projects should explicitly start with `draft: true`.
- The obsolete `.pages.yml` configuration is removed. The earlier Pages CMS
  proof of concept remains as a historical record, not operating guidance.

## Consequences

Astro remains the source of truth for schemas, routes and presentation.
Sveltia's form must follow the Writing schema, not weaken it. New articles
default to `published: false` (Draft), with an enabled switch meaning Public,
and require review of facts, imagery, localized copy and URLs
before publication. Deployment still requires an explicit Git commit and push
through the existing GitHub Actions pipeline. Enabling remote `/admin/` editing
would require a separate authentication and media-path review.
