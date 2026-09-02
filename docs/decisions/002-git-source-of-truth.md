# ADR 002 — Git as source of truth

## Status

Accepted

## Context

The site needs one authoritative place for code, structured content, Markdown,
configuration and relevant assets. Future editorial tooling should not create a
parallel content system.

## Decision

The GitHub repository is the production source of truth. Figma describes design
intention, and Pages CMS edits repository files for supported collections, but
deployment always uses a Git commit.

## Why

Git provides transparent history, diffs, attribution, rollback and portability.
It also keeps the build pipeline independent from any editor or CMS.

## Alternatives considered

- a database-backed headless CMS as the content authority;
- content maintained directly in a hosting platform;
- separate repositories for code and content.

## Consequences

### Positive

- one auditable change history;
- straightforward rollback and backup;
- low CMS lock-in;
- the same deployment path for content and code.

### Negative / trade-offs

- editors need Git-aware tooling or assistance;
- merge conflicts remain possible;
- assets contribute to repository size.
