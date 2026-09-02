# ADR 003 — Astro Content Collections

## Status

Accepted

## Context

Project case studies and editorial articles need structured metadata, localized
routes and long-form narrative content without hardcoding each entry into an
Astro page.

## Decision

Store projects and Writing articles as Markdown entries in separate Astro
Content Collections. Validate frontmatter with `src/content.config.ts`, keep the
Markdown body as the primary narrative and render entries through shared
components. Keep their schemas separate because their editorial metadata and
presentation differ.

## Why

Content Collections provide build-time validation, typed data and reusable
rendering while keeping content portable and compatible with a future Git-based
CMS.

## Alternatives considered

- hardcoded project pages or card arrays;
- unvalidated Markdown imports;
- MDX and arbitrary component blocks;
- a remote content database.

## Consequences

### Positive

- invalid metadata fails during the build;
- routes and components share a typed content contract;
- narrative content remains readable outside Astro;
- CMS forms can target the same validated frontmatter.

### Negative / trade-offs

- schema changes require deliberate migration;
- complex page-builder layouts are intentionally unsupported;
- image paths must remain compatible with Astro's asset loader.
