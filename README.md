# abicaride.com 🌿

[![Deploy to GitHub Pages](https://github.com/abicaride/abicaride.com/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/abicaride/abicaride.com/actions/workflows/deploy.yml)

Personal website for **Abilene Caride**, available at
[abicaride.com](https://abicaride.com).

The site is a bilingual, statically generated Astro project for presenting
Abilene's work across content, communication, marketing, UX and digital
experiences. It is intentionally lightweight, portable and independent of a
proprietary CMS or client-side UI framework.

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — how the technical system is designed
- [Workflow](docs/WORKFLOW.md) — safe Pages CMS, Codex, deployment and manual Figma release flows
- [Architecture decisions](docs/decisions/) — why the main decisions were made
- [Pages CMS validation](docs/CMS-POC.md) — tested Projects-only editorial integration
- [Agent instructions](AGENTS.md) — rules for AI-assisted changes

## 🚀 Technology

- 🚀 Astro with static output
- 🧩 Strict TypeScript configuration
- 🎨 Figma for design exploration and production-oriented page designs
- 🎨 Native CSS and CSS custom properties
- 🔤 Self-hosted Inter and Montserrat typography
- 🗂️ Astro Content Collections with Markdown and frontmatter
- 🌍 English and Spanish locale-prefixed routes
- 🖼️ Astro's responsive image pipeline
- 🔒 Google Analytics 4 with explicit consent
- ⚙️ GitHub Actions and GitHub Pages
- ☁️ Cloudflare-managed DNS

Astro is the only production dependency. Pages CMS is an external editorial
interface for English and Spanish projects; it adds no Astro runtime dependency.
A separate Writing collection remains planned and is not implemented.

## 🎨 Public design workspace

The Figma workspace is available as three public, view-only files:

- [Abi Website Moodboard](https://www.figma.com/board/PxH3eYTrRg5f2g8UenwGtP/Abi-Website-Moodboard) — references and visual preferences
- [Abi Website Foundations](https://www.figma.com/design/2yrZXRDGo95taZ1J3VOPxx/Abi-Website-Foundations) — foundations, components and explorations
- [Abi Personal Website](https://www.figma.com/design/qzSb1nHDgRm21LNLkCjaFT/Abi-Personal-Website) — production-oriented page designs

Figma communicates visual intention; this Astro repository remains the
implementation and production source of truth.

The local [Abi Website Design Publisher](tools/figma/abi-brief-builder/README.md)
packages repository-owned tokens and design metadata into traceable
`[CURRENT]`, `[APPROVED]` and `[ARCHIVE]` Figma sections. Figma publication is
an explicit visual-release step, separate from website deployment.

## 🛠️ Getting started

### Requirements

- Node.js 22.12.0 or newer
- npm
- Git

The deployment workflow currently uses Node.js 24.

Install the locked dependencies:

```sh
npm ci
```

Start the development server:

```sh
npm run dev
```

Astro normally serves the site at [http://localhost:4321](http://localhost:4321).

Create a production build:

```sh
npm run build
```

Preview the generated site:

```sh
npm run preview
```

The static output is written to `dist/`.

## ⌨️ Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm run build` | Generate the production site |
| `npm run preview` | Serve the production build locally |
| `npm run astro -- <command>` | Run an Astro CLI command |
| `npm run figma:package` | Package the local Figma Desktop design release |
| `npm run figma:validate` | Package and validate every publisher command without Figma or MCP |

## 🏗️ Project structure

```text
.
├── .github/workflows/deploy.yml    GitHub Pages deployment
├── .pages.yml                      Pages CMS editorial configuration
├── docs/
│   ├── ARCHITECTURE.md             Technical system reference
│   ├── WORKFLOW.md                 Human working guide
│   └── decisions/                  Architecture Decision Records
├── public/
│   ├── favicon.*                   Stable public assets
│   └── scripts/
│       └── analytics-consent.js    Consent and analytics browser logic
├── src/
│   ├── assets/images/              Images processed by Astro
│   ├── components/
│   │   └── pages/                  Shared EN/ES page compositions
│   ├── content/projects/
│   │   ├── en/                     English project entries
│   │   └── es/                     Spanish project entries
│   ├── data/                       Structured bilingual profile data
│   ├── i18n/                       UI copy, locale types and path helpers
│   ├── layouts/                    Global document layout
│   ├── lib/                        Shared build-time and routing helpers
│   ├── pages/                      English and Spanish route wrappers
│   ├── styles/                     Design tokens and global CSS
│   └── content.config.ts           Project collection schema
├── tools/figma/
│   └── abi-brief-builder/          Optional local V2 brief plugin
├── AGENTS.md                       Architecture-aware contributor rules
├── CLAUDE.md                       Imports AGENTS.md
├── astro.config.mjs                Site and i18n configuration
└── package.json                    Runtime requirements and scripts
```

## ✍️ Project content

Case studies are paired English and Spanish Markdown entries under
`src/content/projects/`. The content collection validates their metadata at
build time while the Markdown body remains the main narrative.

Most projects use the shared Markdown renderer. The imaginArt lead case keeps
the same collection-owned route and metadata while using a small bespoke Astro
renderer for its original diagrams; this is intentionally not a page-builder or
CMS schema expansion.

When adding a project:

1. Add source images to `src/assets/images/projects/`.
2. Create the English and Spanish Markdown entries.
3. Give both entries the same `translationKey`.
4. Provide localized slugs, metadata, narrative and image alternatives.
5. Verify both routes and their language-switching links.

See [Architecture: content](docs/ARCHITECTURE.md#content-architecture) for the
complete schema and rationale.

## 🌍 Localization

Public content uses explicit `/en/` and `/es/` prefixes. The non-indexable root
gateway selects the first supported browser language preference and defaults to
English, while retaining manual language links and a no-JavaScript English
fallback. Translated project routes are paired with
`translationKey`, and `BaseLayout.astro` generates canonical and `hreflang`
metadata for indexable content pages.

## 🔒 Privacy

Google Analytics 4 is optional. The Google tag does not load before explicit
acceptance, rejection sends no analytics requests, advertising consent remains
denied and visitors can change their choice from the footer. There are no custom
analytics events or advertising features.

## 🚢 Deployment

Pushes to `main` run `npm ci` and `npm run build` in GitHub Actions, then deploy
the static `dist/` artifact to GitHub Pages. Production uses the custom domain
[abicaride.com](https://abicaride.com); DNS is managed through Cloudflare outside
this repository.

## 🤝 Contributing

Before substantial changes, read [AGENTS.md](AGENTS.md) and the relevant
architecture documentation. Keep changes focused and run:

```sh
npm run build
```

Review generated code before merging, especially around bilingual routing,
accessibility, privacy, responsive images and dependency changes.

Abi may also use Codex directly for content preparation and vibe coding. The
recommended loop is local change → bilingual/mobile/desktop review → build →
explicit approval to commit and push. Pages CMS remains the simplest editor for
routine project content; Codex is appropriate when the change spans languages,
layout, behaviour or architecture. See the [working guide](docs/WORKFLOW.md#work-safely-with-codex)
for prompt examples, publication controls and the quota-independent Figma
Desktop release procedure.

## 📄 Ownership

The website's content and visual identity belong to Abilene Caride. This
repository does not currently include an open-source license.
