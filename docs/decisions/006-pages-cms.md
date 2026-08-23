# ADR 006 — Pages CMS

## Status

Planned

## Context

Abi should eventually be able to make routine editorial changes without editing
Markdown by hand. The repository already stores portable Markdown, frontmatter
and local images, but the professional case-study model is still being validated
with real content.

## Decision

Treat Pages CMS as the leading editorial-layer candidate, subject to a final
proof of concept. If adopted, it will edit Git-managed files and will not replace
GitHub, Astro or the deployment pipeline.

Do not add `.pages.yml` or consider Pages CMS finally adopted until the proof of
concept succeeds.

## Why

Pages CMS appears to fit the current direction because it is Git-based, preserves
Markdown and frontmatter, has limited architectural lock-in and could offer Abi
a simpler interface for projects and a future Writing collection.

## Alternatives considered

- **Sveltia CMS** — Git-based and capable, with a different configuration and
  editorial experience to validate;
- **Decap CMS** — mature Git-based model, but with more integration and identity
  considerations;
- **TinaCMS** — strong visual editing and schema tooling, with a larger runtime
  and platform footprint;
- **Keystatic** — typed and developer-friendly, but would add framework and
  deployment considerations to the current static setup;
- **CloudCannon** — polished Git-based editing, with commercial platform
  dependency and cost considerations;
- continued direct Markdown editing through Codex or a local editor.

## Consequences

### Positive

- a friendlier routine editorial workflow;
- Git remains the source of truth and deployment trigger;
- existing content remains portable without the CMS;
- one interface could eventually cover projects and Writing.

### Negative / trade-offs

- configuration and authentication still need design;
- bilingual content pairing may require editorial conventions;
- nested metrics, galleries and Astro image paths may expose limitations;
- the project gains dependence on a third-party editorial interface.

The proof of concept must validate bilingual projects, nested metrics, gallery
images, Astro-compatible image paths, Markdown editing, commits and successful
build/deploy behaviour before final adoption.
