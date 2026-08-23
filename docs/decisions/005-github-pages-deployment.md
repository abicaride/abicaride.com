# ADR 005 — GitHub Pages deployment

## Status

Accepted

## Context

Astro produces a static `dist/` directory, and the site needs a simple,
repeatable production deployment without an application server.

## Decision

Pushes to `main` trigger GitHub Actions. The workflow installs dependencies with
Node 24, runs the Astro build, uploads `dist/` and deploys it to GitHub Pages.
Cloudflare manages the custom-domain DNS outside the repository.

## Why

GitHub Pages directly matches the static artifact and keeps source control,
automation and hosting close together.

## Alternatives considered

- Netlify or Vercel;
- Cloudflare Pages;
- a self-managed web server.

All are viable, but the current GitHub Pages pipeline meets the site's needs
with less operational surface.

## Consequences

### Positive

- no application server or runtime deployment;
- automatic, reproducible builds from Git history;
- failed builds do not replace the existing production artifact.

### Negative / trade-offs

- production publishing is tied to GitHub Actions and Pages availability;
- server-side features would require another platform or architecture;
- DNS configuration is managed separately from deployment configuration.
