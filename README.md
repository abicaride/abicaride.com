# abicaride.com 🌿

[![Deploy to GitHub Pages](https://github.com/abicaride/abicaride.com/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/abicaride/abicaride.com/actions/workflows/deploy.yml)

Personal website for **Abilene Caride**, available at
[abicaride.com](https://abicaride.com).

The site is a bilingual, statically generated Astro project for presenting
Abilene's work across content, communication, marketing, UX and digital
experiences. It is intentionally lightweight, portable and independent of a
proprietary CMS or client-side UI framework.

## How the website works

See [docs/WORKFLOW.md](docs/WORKFLOW.md) for an overview of the Figma, CMS,
Codex, Astro and deployment workflows.

## 🚀 Technology

- 🚀 Astro with static output
- 🧩 Strict TypeScript configuration
- 🎨 Native CSS and CSS custom properties
- 🗂️ Astro Content Collections
- 🌍 English and Spanish locale-prefixed routes
- 🖼️ Astro's responsive image pipeline
- 🔒 Google Analytics 4 with explicit consent
- ⚙️ GitHub Actions and GitHub Pages
- ☁️ Cloudflare-managed DNS

Astro is the only production dependency.

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

## 🏗️ Project structure

```text
.
├── .github/workflows/deploy.yml    GitHub Pages deployment
├── docs/WORKFLOW.md                Tooling, content and publishing workflows
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
│   ├── pages/
│   │   ├── en/                     English route wrappers
│   │   └── es/                     Spanish route wrappers
│   ├── styles/                     Design tokens and global CSS
│   └── content.config.ts           Project collection schema
├── AGENTS.md                       Architecture and contributor rules
├── astro.config.mjs                Site and i18n configuration
└── package.json                    Runtime requirements and scripts
```

### Architectural boundaries

- Files in `src/pages/` define routes and remain thin. Equivalent English and
  Spanish routes render the same component from `src/components/pages/`.
- `BaseLayout.astro` owns the document shell, metadata, header, footer and
  consent component.
- Reusable UI belongs in `src/components/`; page-specific composition belongs
  in `src/components/pages/`.
- Shared UI copy and localized path generation belong in
  `src/i18n/config.ts`.
- Project narratives and metadata belong in the content collection. Other
  structured bilingual information belongs in `src/data/`.
- Design values belong in `src/styles/tokens.css`; component presentation stays
  scoped to the relevant Astro component.

The full implementation rules are maintained in [AGENTS.md](./AGENTS.md).
`CLAUDE.md` imports that file so Codex and Claude Code use the same source of
truth.

## 🌍 Localization and routing

Both locales use explicit URL prefixes:

```text
/en/
/es/
```

The root route redirects to `/en/`. Most route pairs share the same path shape,
while localized paths may differ where appropriate—for example, `/en/privacy/`
and `/es/privacidad/`.

Internal localized links should use `getLocalizedPath()`. Pages with different
translated paths provide an explicit alternate path so language switching,
canonical links and `hreflang` metadata resolve correctly.

The site also includes a single bilingual static `404.html`, which works as the
hosting fallback regardless of the missing URL's locale.

## ✍️ Project content

Project case studies are Markdown entries in:

```text
src/content/projects/en/
src/content/projects/es/
```

The collection schema validates:

- localized title, description, category and tags
- `locale` and locale-specific `routeSlug`
- shared `translationKey`
- optional company, client, role and display period
- optional structured metrics and image gallery
- display order, featured and draft state
- optional year and external source link
- an Astro-managed image with localized alternative text

Translated entries use the same `translationKey` while retaining independent
copy and slugs. Only non-draft entries are generated. Project listing order is
controlled by the `order` field.

When adding a project:

1. Add the image to `src/assets/images/projects/`.
2. Create the English and Spanish Markdown entries.
3. Give both entries the same `translationKey`.
4. Provide localized `routeSlug`, metadata, image alt text and narrative.
5. Verify both project URLs and their language switcher links.

## 🎨 Design, images and client-side code

The design system uses native CSS. Shared colors, typography, spacing, radii and
layout sizes live in `src/styles/tokens.css`; arbitrary visual values should not
be introduced when an existing token expresses the intent.

Raster content images are imported from `src/assets/` and rendered through
Astro's image tooling with responsive sizes, AVIF/WebP sources and JPEG
fallbacks. Above-the-fold LCP images load eagerly; non-critical images are lazy
loaded.

Pages otherwise render as static HTML. No hydrated UI framework is installed.
The consent and analytics script is the intentional browser-side exception.

## 🎨 Design workspace

The collaborative design process is organized across three Figma files:

- [Abi Website Foundations](https://www.figma.com/design/2yrZXRDGo95taZ1J3VOPxx/Abi-Website-Foundations)
  for visual foundations, reusable components and explorations
- [Abi Personal Website](https://www.figma.com/design/qzSb1nHDgRm21LNLkCjaFT/Abi-Personal-Website)
  for production-oriented homepage and case-study designs
- [Abi Website Moodboard](https://www.figma.com/board/PxH3eYTrRg5f2g8UenwGtP/Abi-Website-Moodboard)
  for references and shared visual preferences

Explorations and moodboard references are not automatically implementation
specifications. The design-to-code rules, approval boundary and architectural
constraints are maintained in [AGENTS.md](./AGENTS.md).

## 🔒 Analytics and privacy

The site uses the Google tag directly for Google Analytics 4—without Google Tag
Manager or a third-party consent platform.

Analytics follows Basic Consent Mode v2:

- the Google tag is not downloaded before explicit acceptance
- no GA measurement requests or analytics cookies are created before consent
- rejecting analytics preserves the same no-tracking behaviour
- `analytics_storage` is granted only after acceptance
- `ad_storage`, `ad_user_data` and `ad_personalization` are always denied
- the preference is stored locally for up to 180 days
- visitors can reopen cookie settings from the footer

There are currently no custom analytics events or advertising features.

## 🚢 Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow:

1. Checks out the repository.
2. Installs Node.js 24 and runs `npm ci`.
3. Runs `npm run build`.
4. Uploads `dist/` as a GitHub Pages artifact.
5. Deploys the artifact to GitHub Pages.

Production is served at [https://abicaride.com](https://abicaride.com), with DNS
managed through Cloudflare.

## 🤝 Contributing and AI-assisted development

Before making substantial changes, read [AGENTS.md](./AGENTS.md). It defines the
project's architectural boundaries, bilingual requirements, accessibility and
privacy constraints, image strategy and validation expectations.

Keep changes focused and review generated code before merging. In particular,
avoid duplicating EN/ES presentation, bypassing the content collection, adding
arbitrary design values or introducing dependencies without a concrete need.

Before considering a change complete, run:

```sh
npm run build
```

Depending on the change, also verify:

- affected English and Spanish routes
- language switching, canonical links and `hreflang`
- internal links and the 404 fallback
- narrow mobile and desktop layouts
- keyboard access, focus states and heading structure
- responsive image loading and layout stability
- analytics behaviour before acceptance, after rejection and after acceptance
- browser console errors

## 📄 Ownership

The website's content and visual identity belong to Abilene Caride. This
repository does not currently include an open-source license.
