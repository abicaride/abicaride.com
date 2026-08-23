# Project instructions

## Product and technical direction

This is Abilene Caride's bilingual personal website, built with Astro and deployed
as a static site.

- Prefer semantic HTML, Astro components and build-time data.
- Do not add React or another UI framework unless explicitly requested.
- Keep client-side JavaScript and dependencies to the minimum required.
- Preserve the English and Spanish experience, accessibility, privacy and
  performance in every change.
- Reuse and extend the existing architecture before introducing a new pattern.

## Architecture

Keep responsibilities within these boundaries:

- `src/pages/` owns routes. Locale route files should remain thin wrappers that
  select a locale and pass data to a shared page component.
- `src/components/pages/` owns page composition shared by English and Spanish.
  Do not duplicate equivalent page markup between locale routes.
- `src/layouts/BaseLayout.astro` owns the HTML document, global metadata, shared
  header/footer and global consent component. Keep page-specific presentation out
  of the layout.
- `src/components/` owns reusable site components such as navigation, footer,
  consent UI and project previews.
- `src/i18n/config.ts` owns locale types, shared interface copy and localized
  path helpers.
- `src/content/projects/{locale}/` owns project narratives and project metadata.
  `src/content.config.ts` owns their schema.
- `src/data/` owns structured bilingual content that is not a content collection.
- `src/lib/` owns shared build-time data and routing helpers.
- `src/styles/tokens.css` owns design values. `src/styles/global.css` owns the
  reset and truly global primitives. Component-specific styles stay scoped in
  their Astro component.
- `src/assets/` owns source images processed by Astro. `public/` is reserved
  for files that must retain a stable URL or cannot enter Astro's asset pipeline.

Do not bypass these boundaries for convenience. If a requested change genuinely
requires a new architectural pattern, explain the reason and trade-off before or
with the implementation.

For significant architectural changes, also consult
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and the relevant records in
[`docs/decisions/`](docs/decisions/). They explain the current system and why its
main decisions were made. [`docs/WORKFLOW.md`](docs/WORKFLOW.md) describes the
human content, design and publishing workflow; it does not override this file's
implementation rules.

## Routing and internationalization

- All public content routes are locale-prefixed under `/en/` and `/es/`.
  The root route redirects to `/en/`.
- Keep equivalent EN and ES routes paired. A locale route should render the same
  shared component with a different `locale` prop.
- Put shared UI text in both branches of `ui` in `src/i18n/config.ts`; do not
  scatter duplicated locale conditionals through templates when structured copy
  can be used instead.
- Use `getLocalizedPath()` for internal localized URLs.
- When translated slugs differ, pass an explicit `alternatePath` so navigation,
  canonical and hreflang metadata point to the real counterpart.
- Pair translated projects with the same `translationKey`. Keep locale-specific
  `routeSlug`, image alt text and narrative in the content collection.
- The static `src/pages/404.astro` is intentionally one bilingual fallback.

## Content and components

- Keep content separate from presentation: prose and metadata belong in i18n,
  data or content files; Astro components render them.
- Add project entries through the `projects` content collection rather than
  hardcoding project cards or project pages.
- Preserve the content schema and update it deliberately when new project fields
  are required.
- Reuse an existing component when it already owns the relevant responsibility.
  Create a new component when it represents a reusable concept, not merely to
  shorten a file.
- Use TypeScript types for component props and shared data contracts.

## Rendering, JavaScript and privacy

- Static HTML is the default. Do not add hydration directives or browser scripts
  for behaviour that HTML and CSS can provide.
- The analytics consent implementation is the intentional JavaScript exception.
  Keep its UI in `AnalyticsConsent.astro` and its browser logic isolated in
  `public/scripts/analytics-consent.js`.
- Google Analytics must not load or make requests before explicit analytics
  consent. Preserve Basic Consent Mode v2 behaviour: `analytics_storage` is
  denied until acceptance; `ad_storage`, `ad_user_data` and
  `ad_personalization` remain denied.
- Do not add Google Tag Manager, advertising features, custom analytics events or
  another consent dependency unless explicitly requested.

## Styling and visual system

- Use native CSS and CSS custom properties.
- Use existing tokens for color, typography, spacing, radii, borders and layout.
  Add a token only when a value is intentionally reusable; do not introduce
  arbitrary one-off design values.
- Write mobile-first styles and add media queries only when the content requires
  them.
- Preserve the current visual language unless the task explicitly calls for a
  redesign.

## Figma and design workflow

The shared Figma workspace contains three complementary files:

- [Abi Website Foundations](https://www.figma.com/design/2yrZXRDGo95taZ1J3VOPxx/Abi-Website-Foundations)
  owns foundations, reusable components and visual explorations.
- [Abi Personal Website](https://www.figma.com/design/qzSb1nHDgRm21LNLkCjaFT/Abi-Personal-Website)
  owns production-oriented homepage and case-study designs.
- [Abi Website Moodboard](https://www.figma.com/board/PxH3eYTrRg5f2g8UenwGtP/Abi-Website-Moodboard)
  collects references and visual preferences; it is not an implementation
  specification.

Do not treat exploratory frames or moodboard references as approved designs.
Implement a Figma direction only when the task explicitly identifies it as
approved or asks for that specific design to be implemented.

When translating an approved design:

- Preserve the established Astro, localization, accessibility, privacy and
  performance architecture.
- Reuse existing components and design tokens before adding new ones.
- Promote intentional reusable design decisions into `src/styles/tokens.css`
  or the appropriate Astro component instead of copying arbitrary Figma values.
- Preserve content/presentation separation and shared EN/ES page composition.
- Report meaningful discrepancies between Figma and the implementation rather
  than silently changing the architecture.

Figma is not a build dependency. Do not modify Figma files, permissions or
workspace structure unless explicitly requested.

## Images and performance

- Import raster content images from `src/assets/` and use Astro's
  `Image`/`Picture` tooling with responsive widths, accurate `sizes`, modern
  formats and a sensible fallback.
- Preserve aspect ratio and provide meaningful localized alt text.
- Load the above-the-fold LCP image eagerly with high fetch priority. Lazy-load
  non-critical below-the-fold images.
- Do not add a dependency when Astro or the web platform already provides the
  capability.

## Accessibility and metadata

- Use semantic landmarks and a logical heading hierarchy with one primary
  `h1` per page.
- Keep controls keyboard accessible, focus states visible and labels meaningful.
  Do not communicate essential information through color alone.
- Every page rendered through `BaseLayout` must provide localized title,
  description and locale information.
- Preserve canonical and EN/ES hreflang metadata. Mark non-indexable pages
  explicitly and do not give them misleading canonical or alternate metadata.
- External links, image alternatives and language changes must remain
  understandable to assistive technology.

## Development and validation

- Before editing, inspect nearby components, helpers, tokens and content so the
  change follows established patterns.
- When starting the development server, use background mode:

  ```sh
  astro dev --background
  ```

  Manage it with `astro dev stop`, `astro dev status` and `astro dev logs`.
- Run `npm run build` before considering a task complete.
- For routing, navigation or content changes, also verify affected EN and ES URLs,
  alternate-language links and internal links.
- For visual changes, check at least one narrow mobile viewport and one desktop
  viewport.
- Report architectural decisions, assumptions and any validation that could not
  be completed.

## Astro documentation

Use the relevant official guide before changing these systems:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styles and CSS](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
