# ADR 007 — Figma and code workflow

## Status

Accepted; extended by [ADR 008](008-code-first-figma-publishing.md)

## Context

The website needs space for visual exploration without confusing exploratory
work with production implementation or creating a requirement for continuous
Figma/code synchronization.

## Decision

Figma owns visual references, foundations, explorations and approved design
intention. Astro owns production rendering. Codex or a developer translates an
explicitly approved direction into the existing architecture.

The visual exploration phase for V2 closed with the refined approved
pre-production direction recorded in
[`../design/V2-PREPRODUCTION-DIRECTION.md`](../design/V2-PREPRODUCTION-DIRECTION.md).
The historical A/B/C/D frames remain useful evidence of the decision process,
but they are not competing implementation specifications.

The approved hero reference at
[`../design/references/hero-approved-reference.jpg`](../design/references/hero-approved-reference.jpg)
expresses composition, atmosphere, photography direction and palette source.
It is not a production asset and must not be imported into Astro.

There is no requirement for perfect bidirectional synchronization. ADR 008 adds
a deliberate one-way publishing path from the repository into managed Figma
sections and production-page captures.

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
