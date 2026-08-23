# ADR 006 — Pages CMS

## Status

Accepted

## Context

Abi should be able to make routine project changes without editing Markdown by
hand. The repository already stores portable bilingual Markdown, validated
frontmatter and local source images. GitHub must remain the source of truth, and
Astro's schema, image pipeline and deployment workflow must remain authoritative.

A controlled proof of concept on `cms-poc` verified existing EN/ES projects,
nested metrics and galleries, Markdown, drafts, existing images, new source-image
uploads, Git commits and successful Astro builds.

## Decision

Adopt hosted Pages CMS as an external editorial interface for the existing
English and Spanish project collections.

- `.pages.yml` adapts to `src/content.config.ts`; Astro is not changed to fit the
  CMS.
- Pages CMS edits the existing Markdown, frontmatter and
  `src/assets/images/projects/` files through GitHub.
- Routine CMS saves target `main` and therefore use the existing GitHub Actions
  build and deployment pipeline.
- The GitHub App remains limited to the `abicaride.com` repository.
- Each editor signs into Pages CMS with their own GitHub identity; repository
  permissions and branch protection determine write access.
- Writing, static pages, navigation and arbitrary page structures remain outside
  the adopted CMS scope.

Pages CMS is not an Astro dependency, content database, backend or authentication
system for website visitors.

## Why

The proof of concept demonstrated that Pages CMS can sit cleanly over the current
architecture:

- English and Spanish remain separate, fixed-locale collections;
- Markdown remains human-readable;
- generic nested metrics and galleries round-trip correctly;
- existing and newly uploaded images retain paths accepted by Astro's `image()`
  schema;
- drafts continue to be controlled by Astro;
- saves produce ordinary, focused Git commits;
- no runtime, dependency, schema or deployment compromise is required.

## Alternatives considered

- **Sveltia CMS** — Git-based and capable, with a different configuration and
  editorial experience;
- **Decap CMS** — mature Git-based model, with more integration and identity
  considerations;
- **TinaCMS** — strong visual editing and schema tooling, with a larger runtime
  and platform footprint;
- **Keystatic** — typed and developer-friendly, but with additional framework and
  deployment considerations;
- **CloudCannon** — polished Git-based editing, with commercial platform
  dependency and cost considerations;
- continued direct Markdown editing through Codex or a local editor.

## Consequences

### Positive

- a friendlier routine project-editing workflow for Abi;
- Git remains the source of truth and deployment trigger;
- Astro validation and image processing remain intact;
- content remains portable without Pages CMS;
- no CMS JavaScript, backend or production dependency is added to the website.

### Negative / trade-offs

- the editorial interface depends on an external service and GitHub App;
- translated project pairing still requires an editorial convention;
- hosted saves normalize some YAML and Markdown formatting, creating moderate
  but understandable diff noise;
- upload, frontmatter update and media cleanup can create separate Git commits;
- direct saves to `main` deploy automatically, so editors must use drafts and
  review content carefully before saving.

## Reversibility

This decision is reversible. Removing `.pages.yml` disables the repository CMS
configuration; uninstalling or restricting the GitHub App removes external
access. Existing Markdown, assets, Astro code and Git history continue to work
without migration or data export.

See [the Pages CMS validation report](../CMS-POC.md) for the tested evidence.
