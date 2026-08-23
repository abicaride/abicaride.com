# ADR 004 — Bilingual content model

## Status

Accepted

## Context

The public website must support English and Spanish with accurate copy, routes,
language switching and search metadata.

## Decision

Use explicit `/en/` and `/es/` route prefixes. Share page composition while
keeping localized copy independently editable. Pair translated projects with a
shared `translationKey` and give each entry its own `routeSlug`, narrative and
image alternatives.

## Why

Independent entries support human-quality translations and genuinely localized
slugs. Shared page components prevent the two experiences from becoming
separate implementations.

## Alternatives considered

- runtime machine translation;
- one content file containing both languages;
- an unprefixed default locale;
- duplicate English and Spanish page templates.

## Consequences

### Positive

- clear, stable localized URLs;
- independent editorial control of each translation;
- paired canonical, `hreflang` and language-switcher targets;
- shared presentation and accessibility behaviour.

### Negative / trade-offs

- content must be maintained in pairs;
- translation pairing and alternate paths require validation;
- some localized routes need explicit mapping when slugs differ.
