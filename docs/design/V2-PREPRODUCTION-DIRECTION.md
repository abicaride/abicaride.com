# V2 — Clean Organic Editorial, production direction

> **Status:** Approved and implemented in the Astro production system.
>
> This is a refinement of Clean Organic Editorial, not another competing
> direction. A/B/C/D remain exploration history. The visual exploration phase
> is closed; this document records the design decisions behind V2.

## Public naming

Use **Abilene Caride** in all future public UI, homepage copy, case-study copy,
metadata, design and person references. Do not use **Abi Caride** publicly.

`Abi` may remain in private working notes, established Figma workspace names,
local tool names and technical identifiers. Do not rename `abicaride.com`, the
repository, routes, slugs or accounts.

## Authoritative hero reference

The current approved art-direction reference is:

[`references/hero-approved-reference.jpg`](references/hero-approved-reference.jpg)

It is approved for:

- wide landscape composition;
- the balance between copy and portrait;
- a realistic plant-filled atmosphere;
- visual warmth and calm daylight;
- photography direction;
- the green-led mood and palette source.

> This reference supersedes previous hero explorations for composition,
> atmosphere and photographic art direction.

It is **design reference only**, not a production asset. It contains baked-in
typography, navigation, calls to action, invented logos and generated
photographic compositing. Production must recreate the approved intention with
real HTML/CSS and a final processed photograph.

The reference's accidental serif headline, logo strip, invented logos and
`Writing` navigation label are not approved decisions.

## Hero composition

Use one wide, full-bleed photographic hero in which editable copy and navigation
sit over the calmer left side of the image while Abilene remains on the right.

Desktop working composition:

- `AbileneHero.png` fills the complete hero zone rather than sitting in a
  separate image column;
- the `Abilene Caride` name in the hero navigation uses the approved 32px size;
- the right-side `Work`, `About`, `Contact` and locale links use the existing
  cream surface color over the dark greenery for legible contrast;
- a subtle warm readability gradient supports the left-side navigation,
  professional hero statement and CTA pair;
- Abilene remains visually concentrated on the right side of the composition;
- equal visual relevance: the photograph supports the professional message and
  does not become the site's main subject.

Do not place the photograph underneath the copy, split it into a visibly
separate card/column, frame the portrait in a circle/ellipse or let the face
dominate the viewport.

### Working hero copy

Hero statement:

> **I help companies connect with their audiences through clear, honest
> communication.**

Supporting role line:

> Content, communications and marketing specialist

Spanish working adaptation:

> Ayudo a empresas a conectar con su público a través de una comunicación clara
> y honesta.

> Especialista en contenidos, comunicación y marketing.

Both remain working editorial copy until Abilene's final review.

CTA hierarchy:

1. **Get in touch / Hablemos** — primary; email contact.
2. **View my work / Ver mi trabajo** — secondary; projects/work section.

Both hero actions use slightly enlarged 64px pill controls so their visual
weight and pointer/touch target match the stronger hero statement.

LinkedIn and CV must not compete with these actions in the hero.

## Photography and portrait treatment

The approved hero source is `AbileneHero.png`, imported for production as
`src/assets/images/abilene-hero-v2.png`. The image provides the intended
realistic, calm, welcoming, professional and human plant environment, with warm
daylight, soft depth of field, pale architectural surfaces and real greenery.
The left side receives only the restrained tonal treatment needed for readable
typography.

Allowed treatment:

- non-destructive cropping and responsive focal-position adjustments;
- a subtle warm gradient behind the copy for contrast;
- exposure and white-balance correction;
- subtle professional lighting and natural contrast;
- minor photographic cleanup and improved subject separation.

Do not alter facial structure, body shape, expression or identity; beautify
aggressively; smooth skin heavily; or make Abilene look AI-generated.

Avoid botanical illustration, fake vector leaves, jungle wallpaper, floating
leaves and obviously surreal AI environments.

## Typography

- **Inter** — H1, H2, H3, navigation where appropriate and major metrics.
- **Montserrat Regular** — body copy, descriptions and supporting text.

Use a comfortable line height, sufficient size and sensible measure for
long-form text. If Montserrat creates a concrete case-study readability issue,
document it rather than silently replacing the approved decision.

Do not copy the serif typography visible in the generated hero reference.

## Palette derived from the approved hero

The website must not maintain a separate arbitrary portfolio palette. Its
identity comes from warm creams, warm neutral greys, forest and leaf greens,
plus a purposeful burgundy derived from Abilene's clothing. Abilene's latest
homepage review places burgundy in the terminal footer rather than the hero CTA,
giving it a visible role without turning it into a second brand system.

### Durable palette hierarchy

Treat this hierarchy as the general rule for every production screen:

- **Neutrals** — dominant backgrounds.
- **Deep green** — primary identity, navigation, links and primary CTA.
- **Burgundy** — footer, terminal/contact emphasis and very occasional
  supporting detail.

This semantic hierarchy takes precedence over approximate color-percentage
guidance. Burgundy may occupy a large terminal footer, but it must not spread
into repeated section backgrounds or replace deep green in primary navigation
and actions.

| Token | Value | Intended role |
| --- | --- | --- |
| `--color-canvas` | `#F7F3EA` | Primary warm-cream background |
| `--color-surface` | `#ECE8DE` | Subtle section contrast |
| `--color-surface-strong` | `#DED9CE` | Stronger neutral separation, sparingly |
| `--color-ink` | `#20241F` | Main text |
| `--color-ink-muted` | `#62665E` | Supporting text |
| `--color-green-deep` | `#103A20` | Primary identity, typography, hero CTA, important links/icons |
| `--color-green` | `#34552E` | Diagrams, links and selected details |
| `--color-green-soft` | `#6F8A4F` | Larger graphic accents; contrast-check text use |
| `--color-green-tint` | `#DCE2D2` | Rare pale accent, not a section system |
| `--color-burgundy` | `#741A2A` | Terminal contact footer and selected meaningful highlights |
| `--color-burgundy-tint` | `#EADBDD` | Optional pale warm accent |
| `--color-border` | `#D3D0C7` | Thin rules and subtle boundaries |

Approximate visual distribution, as guidance rather than arithmetic:

- 70–80% neutral creams and warm greys;
- 15–20% charcoal/deep green;
- 5–10% natural green accents;
- 2–5% burgundy accents.

Burgundy closes the page through the contact footer and may support a few
selected metrics, focus/hover moments or tiny details. Deep green owns the
filled primary hero CTA again. Burgundy is not general body text, a repeated
section background, decorative blob language or a second competing brand
system. Do not introduce bright red, coral or orange-red.

## Background and graphic strategy

Create section contrast through warm neutral tonal changes, for example:

`#F7F3EA` → `#ECE8DE` → `#F7F3EA` → `#DED9CE`

Use color primarily for icons, diagrams, links, CTAs, metrics and small visual
details. The UI away from the hero should become calmer, not more colorful.

Do not use:

- large pale-green, pink, blue or burgundy section blocks;
- floating circles, ellipses, blobs, leaves or meaningless shapes;
- excessive cards or boxes;
- a rounded-card design system;
- pseudo-tabs, indentation, staggered labels or arbitrary offsets that create
  false hierarchy.

Rounded geometry is acceptable only for a functional CTA, image crop, icon or
genuinely useful container. Prefer whitespace, thin separators, one restrained
line-icon family and meaningful diagrams.

## Homepage hierarchy

The approved conceptual order is:

1. navigation;
2. hero: name, positioning, CTAs and portrait/environment in one vertical zone;
3. selected work: imaginArt as the lead professional case;
4. secondary work: Cognitive biases in ecommerce and Error Messages;
5. short About / positioning;
6. contact-oriented footer and utility metadata.

Cognitive biases in ecommerce and Error Messages must sit side by side with
equal hierarchy. Neither may appear nested inside the other. The existing EN/ES
content entries are reused through translation key `cognitive-biases`; no
duplicate project is created. Website Analysis may remain elsewhere in the
archive.

The hero action hierarchy is deliberate:

- **Get in touch / Hablemos** — deep-green filled primary action with warm-cream
  text, sufficient padding and a strong visible hover/focus treatment;
- **View my work / Ver mi trabajo** — neutral or transparent secondary action
  with deep-green border and text.

The primary action must carry more visual weight; the two actions must not look
equally loud.

## Back-to-top interaction

The homepage includes one functional back-to-top control. It is fixed near the
bottom-right of the viewport, hidden while the hero is meaningfully visible and
shown once the hero has left the viewport. It returns the reader to the top and
uses a simple upward arrow rather than decorative floating geometry.

Accessible names are `Back to top` in English and `Volver arriba` in Spanish.
The approved treatment is a compact warm-cream surface with a deep-green arrow
and subtle border; it must remain quieter than the primary CTA.

The Astro implementation uses a tiny native-JavaScript enhancement with
`IntersectionObserver` against the first major section. It exposes visible
keyboard focus, respect `prefers-reduced-motion`, and keep enough clearance from
the analytics/cookie consent interface. No framework or new dependency is
needed.

## Contact footer

V2 preserves and visually evolves the existing `SiteFooter.astro` responsibility
rather than introducing a parallel footer. The final burgundy region
is the deliberate full stop of the page and has two layers:

1. a spacious contact close led by the email address;
2. an editorial utility system with clearly labelled identity, privacy,
   language and architecture/build groups;
3. a quiet copyright close, with the existing fixed back-to-top control
   remaining visually available at the bottom-right while the footer is in
   view.

Working contact copy, pending final public-copy approval:

- EN: `LET'S TALK` — `Have a project, an idea, or just want to say hello?` —
  `abicaride@gmail.com →`;
- ES: `HABLEMOS` — `¿Tienes un proyecto, una idea o simplemente quieres
  saludar?` — `abicaride@gmail.com →`.

Use warm-cream typography, strong hierarchy and generous whitespace. Privacy
information and the cookie-settings action remain separate: the former is a
normal link; the latter uses a subtle settings cue and dotted link treatment.
Repeat the accessible EN/ES switch at the end of the page so changing language
does not require returning to the header. Preserve the original playful
architecture-link copy exactly in production: `Made with 🎨 Figma, 🚀 Astro,
✍️ Pages CMS, 🤖 Codex and lots of ❤️.` and `Hecha con 🎨 Figma, 🚀 Astro, ✍️
Pages CMS, 🤖 Codex y mucho ❤️.` Do not use a card grid or decorative ellipses.
Legal, privacy and consent controls must not be removed for visual minimalism.

## Responsive intent

- Hero CTAs may stack on narrow screens; the deep-green primary remains dominant.
- Cognitive Biases and Error Messages stack vertically while retaining equal
  hierarchy and the same editorial treatment.
- The back-to-top control uses a smaller footprint, remains bottom-right and
  never obscures content or cookie consent.
- In the footer, the contact CTA comes first and comfortably spaced utility
  groups follow. Stack those groups with subtle separators on narrow screens;
  do not force the desktop columns into the mobile layout.

## imaginArt visual direction

The evidence blueprint remains authoritative:

[`../content/case-study-imaginart.md`](../content/case-study-imaginart.md)

The Figma direction should summarize the evidence rather than duplicate the
entire document. The case becomes substantially more visual, with a conceptual
target of roughly 40% explanatory copy / 60% visual communication. This is a
design principle, not a production measurement.

Use:

- perceptible warm-neutral section contrast using `#F7F3EA` (canvas),
  `#ECE8DE` (surface) and `#DED9CE` (surface strong) purposefully rather than
  alternating them mechanically;
- dark typography and green accents;
- burgundy for at most a few selected metrics/details beyond the homepage footer;
- one simple, professional line-icon family at approximately 28–32px with an
  approximately 2–2.25px stroke;
- original diagrams, process maps and abstracted hierarchies;
- large metric moments, whitespace and thin separators;
- normal desktop body copy at approximately 20px Montserrat with 1.5–1.6 line
  height; captions and metadata remain smaller;
- concise paragraphs and captions, with a different visual grammar for each
  major story.

Do not reproduce company PDFs, newsletters, catalogue pages, imaginArt artwork
or layouts. Use original diagrams to demonstrate Abilene's thinking and
contribution.

### Fixed story order

1. **Refreshing a specialist B2B newsletter** — Mundo BrightSign.
2. **Launching a new brand in Spain** — Turtle AV · imaginArt.
3. **Planning and promoting a corporate event** — imaginArt · Madrid Open Days
   2026.
4. **Structuring a technical product catalogue** — AV Supports Catalogue.
5. **Adapting technical information for a B2B audience** — Lumens.

Bilbao remains supporting evidence of repeatable event-communication work.

### Diagram strategy

- Collaboration: Engineering and Sales provide technical/customer inputs to a
  visually central Abilene; Abilene structures, frames, writes and executes;
  Management provides business/final validation. This is an explanatory flow,
  not a claimed project-management waterfall.
- Newsletter: make the two approximate observed values a large honest dumbbell
  comparison (`~24%` and `~34%`, approximately +10 percentage points), with an
  abstract earlier/revised email hierarchy nearby. It is explicitly **not an
  A/B test** and must not look like a longitudinal trend chart.
- Brand launch: technical input → Abilene's selection/prioritization/structure →
  usable product content. Keep “Technical truth → structure → usable B2B
  content” as the takeaway and reserve one clearly labelled, rights-cleared
  real-work visual slot rather than inventing a client artifact.
- Event: show mailing, web, LinkedIn and Canva/support feeding registration and
  the event. Attendance is shown as approximate ranges (`~70–80` usual and
  `~110–125` corporate event), not precision bars.
- Catalogue: visualize product families branching into categories and converging
  on one repeatable product-sheet structure, demonstrating taxonomy and
  content-systems thinking.
- Lumens: manufacturer documentation → select/prioritize/adapt/structure →
  audience questions in clear B2B communication; this is technical adaptation,
  not mere translation, and its vertical transformation must remain visually
  distinct from the catalogue system.

The newsletter and event results stay inside their respective stories. Do not
repeat them in a generic outcomes/evidence section.

### Public-frame boundary and closing

The intended public case frame must not display internal workflow language such
as “pre-production”, “Evidence before polish”, “Visual exploration is closed”,
repository paths or next-step instructions. Those notes may live outside the
production frame as internal Figma annotations.

Close the case with the same approved homepage contact/footer system: burgundy
terminal background, warm-cream typography, generous spacing, clear email
action, identity and future utility/legal controls. Do not place cards inside
the footer.

Do not invent CTR, conversion, revenue, SEO growth, engagement or a precise
attendance uplift.

## About page direction

The final About direction is one editorial, personal composition—not a new
exploration series and not a web-formatted CV. Its central idea is that helping
people is Abilene's motive and communication/writing is the professional tool:
helping people understand what they need and find a useful way forward.

The approved full-body portrait with red top, grey skirt and softly blurred
organic background is the authoritative About photograph. It is stored for
production as `src/assets/images/abilene-about-v2.png`; do not generate, retouch
or substitute another likeness. Use the full-body composition with meaningful
visual presence rather than a circular crop, corporate headshot or card.

The narrative sequence is:

1. help-led portrait hero;
2. Administration → Communication → UX Writing → Content strategy ·
   Communications · Business;
3. Clear / Honest / Practical as three equally strong working principles;
4. a compact experience and education record that supports the story;
5. Galicia, sustainability, a simple/down-to-earth but active mind, and
   Barcelona as personal context;
6. compact primary and secondary languages;
7. the shared burgundy contact/footer close.

Tools are intentionally omitted from the design so how Abilene thinks remains
more prominent than software familiarity. Experience is concise and does not
repeat full CV responsibilities. Abilene confirmed the imaginArt period as
`2023–present`; the older `2021–present` production profile value must be
corrected during implementation. She also confirmed the Caprichos de Casa
Import scope as e-commerce manager plus administration, sales and business
operations; the qualification is `Postgraduate in UX Writing`, not a course;
and the certificate wording is
`Proficiency English Certificate - Cambridge C2 (2024)`. Older production
profile wording must be reconciled during implementation. Sign-language
wording is not strengthened beyond the existing source pending final
verification.

Use the same Inter-heading/Montserrat-body system, approximately 20px desktop
body copy, stronger warm-neutral surfaces, green identity/iconography and exact
burgundy footer treatment as the approved Homepage and imaginArt direction.
Desktop uses a two-column photo/content hero, horizontal career path and
vertically divided principles. Mobile stacks the story and portrait, converts
the path to a vertical progression, and keeps every supporting section and the
footer in a single readable flow. The back-to-top behavior remains shared and
functional. First-person narrative and personal statements remain working copy
until Abilene reviews the public voice.

## Production implementation

The visual exploration phase is closed. V2 is implemented through shared Astro
tokens and components rather than literal Figma coordinates. Responsive image
crops, continuous type scaling and shared spacing were normalized for one
cohesive production system. The three warm neutral values above are the final
production surfaces; they supersede slightly lighter provisional values in
earlier frames.

The imaginArt case uses one intentional bespoke Astro renderer and typed
bilingual data because its diagrams have a story-specific grammar. Its Content
Collection entries still own routing, metadata and project previews. No generic
page-builder or CMS schema extension was introduced.
