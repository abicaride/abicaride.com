# ADR 007 — Figma and code workflow

## Status

Accepted

## Context

The website needs space for visual exploration without confusing exploratory
work with production implementation or creating a requirement for continuous
Figma/code synchronization.

## Decision

Figma owns visual references, foundations, explorations and approved design
intention. Astro owns production rendering. Codex or a developer translates an
explicitly approved direction into the existing architecture.

The visual exploration phase for V2 closed with the working pre-production
direction recorded in
[`../design/V2-PREPRODUCTION-DIRECTION.md`](../design/V2-PREPRODUCTION-DIRECTION.md).
The historical A/B/C/D frames remain useful evidence of the decision process,
but they are not competing implementation specifications.

There is no requirement for perfect bidirectional synchronization.

## Why

This keeps design exploration flexible while preserving accessible, responsive,
performant and maintainable production code. It also prevents moodboard
references or rejected concepts from being treated as specifications.

## Alternatives considered

- treating Figma as generated production code;
- maintaining every visual experiment in Astro;
- requiring exact automated Figma/code synchronization.

## Consequences

### Positive

- clear approval boundary between exploration and implementation;
- production architecture remains deliberate;
- reusable decisions can become tokens and Astro components;
- Figma remains useful without becoming a build dependency.

### Negative / trade-offs

- design and code can drift if comparisons are not reviewed;
- implementation requires interpretation and judgment;
- not every Figma value should or will map directly to code.
