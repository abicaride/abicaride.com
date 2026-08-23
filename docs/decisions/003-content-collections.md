# ADR 003 — Astro Content Collections

## Status

Accepted

## Context

Project case studies need structured metadata, localized routes and long-form
narrative content without hardcoding each project into an Astro page.

## Decision

Store projects as Markdown entries in an Astro Content Collection. Validate
frontmatter with `src/content.config.ts`, keep the Markdown body as the primary
narrative and render entries through shared components.

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
- future CMS forms can target the same frontmatter.

### Negative / trade-offs

- schema changes require deliberate migration;
- complex page-builder layouts are intentionally unsupported;
- image paths must remain compatible with Astro's asset loader.
