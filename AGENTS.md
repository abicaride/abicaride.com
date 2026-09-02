# Project instructions

## Product and technical direction

This is Abilene Caride's bilingual personal website, built with Astro and deployed
as a static site.

- Use `Abilene Caride` for all public-facing design, UI, copy and metadata.
  `Abi` may remain in private working notes and established workspace/file names.
  Do not rename `abicaride.com`, repository/account names, routes, slugs or other
  technical identifiers solely to expand the name.

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
  consent UI, project previews and editorial article presentation.
- `src/i18n/config.ts` owns locale types, shared interface copy and localized
  path helpers.
- `src/content/projects/{locale}/` owns project narratives and project metadata.
  `src/content/writing/{locale}/` owns editorial articles and article metadata.
  `src/content.config.ts` owns both schemas.
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
  The non-indexable root route is a language gateway: the first supported browser
  language preference selects Spanish or English, with English as the default,
  manual language links and a no-JavaScript English fallback.
- Keep equivalent EN and ES routes paired. A locale route should render the same
  shared component with a different `locale` prop.
- Put shared UI text in both branches of `ui` in `src/i18n/config.ts`; do not
  scatter duplicated locale conditionals through templates when structured copy
  can be used instead.
- Use `getLocalizedPath()` for internal localized URLs.
- When translated slugs differ, pass an explicit `alternatePath` so navigation,
  canonical and hreflang metadata point to the real counterpart.
- Pair translated projects and articles with the same `translationKey` within
  their respective collection. Keep locale-specific `routeSlug`, image alt text
  and narrative in the content collection.
- The static `src/pages/404.astro` is intentionally one bilingual fallback.

## Content and components

- Keep content separate from presentation: prose and metadata belong in i18n,
  data or content files; Astro components render them.
- Add project entries through the `projects` content collection rather than
  hardcoding project cards or project pages.
- Add editorial articles through the separate `writing` content collection;
  do not mix them into Projects or turn the schema into a page builder.
- Preserve the content schemas and update them deliberately when new project or
  article fields are required.
- `src/content.config.ts` is authoritative. When Projects or Writing fields or
  their structure change, review and update `.pages.yml` in the same change so
  the CMS mapping remains compatible. Adapt Pages CMS to Astro's validation; do
  not weaken the schema to fit the CMS. If a future field cannot be represented
  safely, document the incompatibility before changing the architecture.
- Reuse an existing component when it already owns the relevant responsibility.
  Create a new component when it represents a reusable concept, not merely to
  shorten a file.
- Use TypeScript types for component props and shared data contracts.

### Pages CMS editing lane

- Pages CMS is an external editor for the Projects and Writing collections over
  the same Git-managed Markdown and source images. It is not a separate database
  and cannot create new presentation or application capabilities.
- `.pages.yml` should expose only fields that the Astro collection already
  validates. Development adds a capability to Astro first; the CMS may expose
  a bounded editorial control afterwards.
- Pages CMS creates new project entries with `draft: true`. Keep a new or
  materially revised project in draft until its facts, imagery, English and
  Spanish versions and public voice have been reviewed. The Astro schema's
  `draft: false` fallback exists only for backwards compatibility with older
  files that omit the field.
- Pages CMS also creates new Writing entries with `draft: true`; the Writing
  schema uses the same safe default because the collection has no legacy entries.
- Treat `routeSlug`, `translationKey`, `locale`, `draft`, `featured` and `order`
  as publication controls, not casual copy fields. Do not change a public URL,
  publish a draft or alter homepage prominence unless the request is explicit.
- Keep English and Spanish projects paired. Do not invent missing professional
  facts or silently publish an unreviewed translation; leave incomplete work in
  draft and report what still needs review.
- Pair English and Spanish articles through `translationKey`. Localized slugs may
  differ; when one translation is missing, the language switcher falls back to
  the other locale's Writing or Notas index.

## Rendering, JavaScript and privacy

- Static HTML is the default. Do not add hydration directives or browser scripts
  for behaviour that HTML and CSS can provide.
- The root language gateway's small inline preference check is an intentional
  JavaScript exception. It must remain non-indexable, avoid storage or tracking,
  and retain manual links plus the no-JavaScript fallback.
- The analytics consent implementation is another intentional JavaScript exception.
  Keep its UI in `AnalyticsConsent.astro` and its browser logic isolated in
  `public/scripts/analytics-consent.js`.
- Google Analytics must not load or make requests before explicit analytics
  consent. Preserve Basic Consent Mode v2 behaviour: `analytics_storage` is
  denied until acceptance; `ad_storage`, `ad_user_data` and
  `ad_personalization` remain denied.
- Do not add Google Tag Manager, advertising features, custom analytics events or
  another consent dependency unless explicitly requested.

### Interaction contracts

The small interaction surface is intentional. Preserve these ownership
boundaries instead of adding page-local variants:

- `src/pages/index.astro` owns the non-indexable browser-language gateway and
  its manual/no-JavaScript fallbacks.
- `SiteHeader.astro` and `getLocalizedPath()` own primary navigation, active
  state and EN/ES switching, including translated project slugs.
- Native links and anchors own email, project, contact and in-page CTA flows.
  Do not replace them with scripted navigation.
- `BaseLayout.astro` supplies the global back-to-top trigger;
  `BackToTop.astro` owns its minimal Intersection Observer, keyboard-accessible
  button and reduced-motion-aware scroll behaviour.
- `AnalyticsConsent.astro`, `analytics-consent.js` and footer/privacy
  `data-cookie-settings` links own the complete analytics choice and reopening
  flow. Do not duplicate or bypass that state elsewhere.

When an interaction changes, test the complete path rather than only its visual
state: keyboard operation, visible focus, reduced motion where relevant, both
locales, narrow and desktop layouts and the no-consent/no-JavaScript fallback
when one exists.

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

These file links are intentionally public and view-only. Public visibility does
not make exploratory material an approved specification, and agents must not
change sharing permissions or grant edit access unless explicitly requested.

The repository is the source of truth and Figma is a versioned visual release
target. Managed Figma roots use `[CURRENT]`, `[APPROVED]` or `[ARCHIVE]` as
defined in
[`docs/decisions/008-code-first-figma-publishing.md`](docs/decisions/008-code-first-figma-publishing.md).

- Update Astro/content/design sources before changing managed Figma output.
- Use the local
  [`Abi Website Design Publisher`](tools/figma/abi-brief-builder/README.md) for
  Foundations, implemented component references, production-page snapshots and
  bounded design summaries.
- Publish current Homepage, About and imaginArt references through the local
  publisher. Figma MCP is optional and quota-limited; it and manual browser
  capture must not be required for a design release. The supported quota-
  independent path is the local development plugin in authenticated Figma
  Desktop.
- Package and validate the publisher before a Figma release. Do not edit
  `tools/figma/abi-brief-builder/dist/code.js` directly.
- Never overwrite untagged manual work. Publisher commands may replace only
  their own tagged predecessor.
- Treat running a publisher command as an external Figma write. Run it only
  when the user explicitly asks to publish or synchronize Figma, and open the
  exact target file and page first.
- Verify the generated status, design release, source commit, right-edge canvas
  placement and survival of untagged/approved/archive material after every
  desktop publish. If output is wrong, use Figma Undo, fix `code.js` or its
  repository source, package and validate again, then republish. Do not repair a
  managed `[CURRENT]` section by dragging or editing it manually.

Do not treat exploratory frames or moodboard references as approved designs.
Implement a Figma direction only when the task explicitly identifies it as
approved or asks for that specific design to be implemented.

The authoritative V2 art-direction record is
[`docs/design/V2-PREPRODUCTION-DIRECTION.md`](docs/design/V2-PREPRODUCTION-DIRECTION.md).
Its hero reference lives at
[`docs/design/references/hero-approved-reference.jpg`](docs/design/references/hero-approved-reference.jpg)
and is a design reference only, never a flattened production asset.

The current approved working direction is documented in
[`docs/design/V2-PREPRODUCTION-DIRECTION.md`](docs/design/V2-PREPRODUCTION-DIRECTION.md).
Directions A/B/C/D remain exploration history; do not implement them as competing
production directions.

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

The exact Desktop command-to-file/page map and recovery procedure live in the
publisher [`README`](tools/figma/abi-brief-builder/README.md). Do not duplicate
that operational detail in implementation code.

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
- Classify the request before acting: routine Projects or Writing content, other
  content, visual/design work, application capability or workflow/infrastructure. Use
  Pages CMS, repository content, Figma or Astro code according to the ownership
  boundaries above; do not solve a content change by inventing architecture.
- Preserve unrelated user changes in a dirty worktree. Keep changes local and
  reversible while reviewing them. A local implementation or preview does not
  authorize committing, pushing, deploying, publishing to Figma, changing
  permissions or changing a CMS publication control; perform those actions only
  when explicitly requested.
- When starting the development server, use background mode:

  ```sh
  astro dev --background
  ```

  Manage it with `astro dev stop`, `astro dev status` and `astro dev logs`.
- Run `npm run build` before considering a task complete.
- If the Figma publisher changed, also run `npm run figma:validate`. If a design
  release is requested, package, validate, publish through Figma Desktop and
  visually verify the target canvas.
- For routing, navigation or content changes, also verify affected EN and ES URLs,
  alternate-language links and internal links.
- For visual changes, check at least one narrow mobile viewport and one desktop
  viewport.
- For CMS changes, verify `.pages.yml` still represents the Astro schema, new
  entries remain drafts by default and existing content builds without
  frontmatter rewrites.
- Report architectural decisions, assumptions and any validation that could not
  be completed.

## Astro documentation

Use the relevant official guide before changing these systems:

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Styles and CSS](https://docs.astro.build/en/guides/styling/)
- [Internationalization](https://docs.astro.build/en/guides/internationalization/)
