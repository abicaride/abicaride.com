# ADR 001 — Astro static site

## Status

Accepted

## Context

abicaride.com is a content-heavy professional site. Its current pages do not
require authenticated application state, a backend or runtime data fetching.

## Decision

Use Astro with static output, semantic HTML, strict TypeScript and native CSS.
Add client-side JavaScript only when a requirement cannot be met with static
HTML and CSS.

## Why

Astro fits a portfolio with structured Markdown content, reusable components and
responsive images while producing deployable static files. It keeps the default
experience fast and the operational model small.

## Alternatives considered

- Next.js or another full-stack framework;
- a client-rendered SPA;
- a hand-built collection of HTML pages.

These are capable approaches, but they add runtime or maintenance complexity
that the current requirements do not need.

## Consequences

### Positive

- minimal JavaScript and strong baseline performance;
- simple static hosting;
- reusable components without a client framework;
- content and routes validated at build time.

### Negative / trade-offs

- every published change requires a build;
- dynamic or authenticated features would require a new architectural decision;
- build-time content must be available in the repository.
