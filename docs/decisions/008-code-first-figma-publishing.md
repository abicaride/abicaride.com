# ADR 008 — Code-first Figma publishing

## Status

Accepted

## Context

After V2 was implemented, the public Figma files still presented a V1 homepage,
provisional token values and several frames labelled “final” or
“pre-production”. Manual synchronization had made it difficult to tell which
material was current, approved or historical.

Figma must remain valuable for review without becoming a second implementation
source or a production build dependency.

## Decision

The Git repository remains the source of truth. Figma is a versioned visual
release target.

The local **Abi Website Design Publisher** is the single Figma release path. It
packages repository metadata, production tokens and the two production
portrait images, validates its output and publishes bounded Foundations,
Components, Moodboard, production-page snapshots and approved/archive
reference sections. MCP is optional and never required for a release.

Managed root sections use exactly one status:

- `[CURRENT]` matches the implemented website;
- `[APPROVED]` records an approved design reference that is not itself the
  production baseline;
- `[ARCHIVE]` preserves superseded exploration or V1 history.

Packaged publisher output embeds the design release and source Git commit.
Publisher commands replace only their own tagged predecessor after the new
section has been created successfully. Untagged manual work is outside the
publisher's ownership.

Publishing is intentionally manual in an authenticated Figma Desktop session.
Packaging and validation are automated; writing to the shared Figma files and
visual verification remain explicit release actions.

Figma MCP is an optional inspection/authoring aid, not a release dependency.
Free-tier quota, connector availability or API access must not block design
synchronization. The local Desktop plugin uses the signed-in editor's existing
permission while keeping credentials out of the repository and CI.

## Why

This removes ambiguous “final” frames, prevents production tokens from drifting
through duplicated literals and makes the public design history understandable.
It also preserves Figma's exploratory value without asking Astro to consume
Figma or making a browser/Figma credential part of continuous deployment.

## Consequences

### Positive

- one authoritative implementation source;
- reproducible Foundations and component-reference publishing;
- traceable Figma releases tied to Git;
- safe replacement of managed output;
- clear separation between current, approved and archived work;
- rollback through Git plus Figma version history.

### Negative / trade-offs

- Figma publication is a separate intentional release step;
- generated snapshots still require visual verification;
- a user with edit access must run the release in Figma Desktop;
- packaged image data makes the generated development bundle larger;
- historical untagged clutter requires one initial manual review before
  deletion.

## Alternatives considered

- keeping Figma synchronized manually without status metadata;
- making Figma the production source of truth;
- fully automated Figma writes from CI;
- deleting historical frames instead of archiving them.

The first allows the existing drift to recur. The second conflicts with Astro's
accessibility, localization, privacy and performance architecture. The third
would introduce credentials and an unreliable external write into deployment.
The fourth would discard useful design history.
