# Abi Website Brief Builder

A local Figma development plugin that lays out Abi's V2 creative brief safely
and consistently. It is a design-workflow tool, not part of the Astro website or
its build.

## What it creates

- In **Abi Website Moodboard**: one bounded `V2 — Creative Brief` FigJam
  section containing Abi's feedback, visual references, positioning note,
  homepage content hypothesis, working photography direction and a concise
  imaginArt lead-case evidence map.
- In **Abi Website Foundations → Explorations**: one bounded section containing
  direction boards for `A — Editorial Calm`, `B — Fresh / Image-led` and
  `C — Content-led Personality`.
- In **Abi Website Foundations → Explorations**: three comparable desktop
  homepage concepts using the same information architecture and working
  content, so the visual direction can be evaluated without a copy or scope
  change distorting the comparison.
- In **Abi Website Foundations → Explorations**: one separate synthesis section,
  `D — Clean Organic Editorial`, that preserves A/B/C and combines their
  strongest qualities. It includes a Montserrat + Inter versus all-Montserrat
  type comparison and one working desktop homepage.
- In **Abi Website Foundations → Foundations**: one replaceable
  `V2 — Approved production foundations` section containing the approved
  Inter/Montserrat typography, hero-derived token palette, graphic principles
  and the authoritative hero art-direction reference.
- In **Abi Website Foundations → Explorations**: one replaceable
  `Final Direction — Clean Organic Editorial — Pre-production` section. It uses
  a left-copy/right-photo hero, Inter headings, Montserrat body copy, neutral
  tonal section contrast and the closed CTA/work hierarchy.
- In **Abi Personal Website → Case Studies**: an editorial imaginArt case-study
  wireframe with ten narrative bands and four original explanatory diagrams.
- In **Abi Personal Website → Case Studies**: one separate Direction D
  imaginArt exploration with challenge-led story headings, restrained editorial
  layouts and visibly qualified working metrics.
- In **Abi Personal Website → Case Studies**: one replaceable final
  pre-production imaginArt section using the approved newsletter → Turtle AV →
  Madrid → AV Supports Catalogue → Lumens story order, with neutral bands,
  original diagrams and one coherent line-icon family.

It does not create finished homepage designs or polished marketing copy. The
homepage concepts are deliberately substantial enough for visual review while
remaining labelled as working explorations.

The detailed imaginArt factual and evidence blueprint lives in
[`docs/content/case-study-imaginart.md`](../../../docs/content/case-study-imaginart.md).
The Figma output deliberately summarizes its three primary stories and
supporting evidence instead of duplicating the full working document.

The photography notes identify provisional exploration choices only. Personal
photo files are not part of this plugin and must not be added to the repository
unless explicitly requested.

The final-direction command can reuse the approved hero image already imported
into the open Explorations page. It looks for an image layer named
`AbileneHero.png` and applies that image fill across the full hero zone, with an
editable warm readability gradient, navigation, headline and CTA pair layered
above it. The source file remains in Figma only.

The approved Foundations command looks for an image layer named
`hero-approved-reference.jpg`. Import
`docs/design/references/hero-approved-reference.jpg` manually onto the
Foundations page before running the command. The flattened image is placed only
as a labelled design reference and is never treated as a production component.

## Safety model

- The plugin has no network access.
- It validates the open Figma file and editor type before writing.
- The Foundations command also validates that the current page is
  `Explorations`.
- The imaginArt command validates the **Abi Personal Website** file and its
  `Case Studies` page.
- Exploration commands require exactly one selected object as a placement
  anchor. Final pre-production commands prefer their tagged Direction D source
  section automatically and use the current selection only as a fallback.
- It creates each new section 400 px to the right of its anchor.
- Generated root sections are tagged with private plugin data.
- Exploration commands cannot create a second copy on the same page. The three
  approved/final commands safely replace only their own previously tagged
  output after the new version has been created successfully.
- Exploration commands never delete nodes. `Find generated content` selects
  their output so it can be reviewed or moved manually. The three explicit
  approved/final rebuild commands replace only their own tagged predecessor.
- Existing V2 material created before this plugin is not tagged and is never
  modified automatically.

## Install locally

Local plugin development requires the Figma desktop app.

1. Open any editable Figma Design file in Figma Desktop.
2. Open the Figma menu and choose
   **Plugins → Development → Import plugin from manifest…**.
3. Select this folder's `manifest.json`.
4. The plugin will appear as **Abi Website Brief Builder** under Development.

The plugin is local to the computer where it is imported. It does not need to be
published to the Figma Community.

## Build the Moodboard brief

1. Open **Abi Website Moodboard** in Figma Desktop.
2. Select exactly one existing section or object immediately to the left of
   where the new V2 brief should go.
3. Run
   **Plugins → Development → Abi Website Brief Builder → Moodboard: Build V2 creative brief**.
4. Review the newly selected `V2 — Creative Brief` section before manually
   removing any older, untagged V2 experiments.

## Build the Foundations directions

1. Open **Abi Website Foundations** in Figma Desktop.
2. Open the **Explorations** page.
3. Select exactly one existing frame or section immediately to the left of
   where the direction boards should go.
4. Run
   **Plugins → Development → Abi Website Brief Builder → Foundations: Build exploration directions**.
5. Review the three direction boards. They intentionally contain empty areas
   for future references and observations.

## Build the desktop homepage concepts

1. Open **Abi Website Foundations → Explorations** in Figma Desktop.
2. Select the existing V2 exploration-directions section as the placement
   anchor.
3. Run
   **Plugins → Development → Abi Website Brief Builder → Foundations: Build desktop homepage concepts**.
4. Review all three concepts at the same zoom level. Each uses the same
   navigation, hero, imaginArt lead work, secondary work, About section and
   final CTA.

Photo areas are intentional placeholders. The plugin records the preferred
provisional portrait direction but does not import, copy or commit Abi's
personal photos.

## Build Direction D

1. Open **Abi Website Foundations → Explorations** in Figma Desktop.
2. Select the existing `V2 — Desktop Homepage Concepts` section as the
   placement anchor so the synthesis is created beside A/B/C.
3. Run
   **Plugins → Development → Abi Website Brief Builder → Foundations: Build Direction D synthesis**.
4. Review the typography comparison first, then the desktop homepage. Option 1
   (Montserrat headings/navigation with Inter body copy) is provisionally
   selected; Option 2 remains visible for Abi's review.

The generated concept uses green as the dominant color, with pink and blue as
sparse accents. Its asymmetry and organic forms are selective rather than a
system of rounded cards.

## Rebuild the approved V2 Foundations

1. Open **Abi Website Foundations → Foundations** in Figma Desktop.
2. Import `docs/design/references/hero-approved-reference.jpg` and keep the
   filename as its Figma layer name.
3. On the first run, select an existing frame immediately to the left of the
   intended output.
4. Run **Plugins → Development → Abi Website Brief Builder → Foundations:
   Rebuild approved V2 foundations**.
5. Confirm that the reference is labelled as design-only and that the cream,
   neutral, green and purposeful burgundy token swatches are visible.

Rerunning replaces only the plugin-tagged approved Foundations section. It does
not modify historical explorations or unrelated Foundations material.

## Rebuild the final pre-production direction

1. Open **Abi Website Foundations → Explorations** in Figma Desktop.
2. Import `C:\Users\alber\Downloads\AbileneHero.png` onto the current page. Keep
   the layer name intact; the photograph is not copied into this repository.
3. Select the existing `D — Clean Organic Editorial` section as the placement
   anchor.
4. Run **Plugins → Development → Abi Website Brief Builder → Foundations: Rebuild
   final pre-production direction**.
5. Confirm that `AbileneHero.png` fills the hero, Abilene remains on the right,
   and the editable navigation, copy and CTA pair remain readable on the left.
6. Confirm that the primary hero CTA is deep green; Cognitive Biases and Error
   Messages have equal secondary hierarchy; the burgundy contact footer
   retains privacy/cookie/build utility information; and the representative
   back-to-top control is documented as an interaction rather than decoration.
   The architecture link keeps the playful production copy, including its
   Astro, Pages CMS, Codex and love emojis.

This command does not modify or delete A/B/C/D. Its output deliberately contains
no decorative ellipse nodes, no large colored section blocks and is labelled as
the sole direction to advance. Rerunning replaces only the plugin-tagged final
direction. The generated English desktop frame also records the Spanish footer
working copy and mobile behavior as production annotations; it does not create
a separate speculative mobile concept.

## Build the imaginArt case-study structure

1. Open **Abi Personal Website → Case Studies** in Figma Desktop.
2. Select the existing introductory case-study frame as the placement anchor.
3. Run
   **Plugins → Development → Abi Website Brief Builder → Personal Website: Build imaginArt case wireframe**.
4. Review the narrative sequence, evidence caveats and diagrams against
   [`docs/content/case-study-imaginart.md`](../../../docs/content/case-study-imaginart.md).

The metrics are visibly marked as approximate working evidence. Mundo
BrightSign is explicitly not presented as an A/B test, and no external artwork
is copied into the file.

## Build the reframed imaginArt exploration

1. Open **Abi Personal Website → Case Studies** in Figma Desktop.
2. Select the existing imaginArt structure exploration as the placement anchor.
3. Run
   **Plugins → Development → Abi Website Brief Builder → Personal Website: Build reframed imaginArt exploration**.
4. Review the challenge-led headings and original diagrams against
   [`docs/content/case-study-imaginart.md`](../../../docs/content/case-study-imaginart.md).

The three primary stories remain Turtle AV, Mundo BrightSign and Madrid Open
Days, but their visible headings now lead with the professional challenge.
AV Supports Catalogue, Lumens and Bilbao remain supporting evidence. The older
case-study exploration is preserved for comparison.

## Rebuild the final imaginArt pre-production direction

1. Open **Abi Personal Website → Case Studies** in Figma Desktop.
2. Select the existing reframed imaginArt exploration as the placement anchor.
3. Run **Plugins → Development → Abi Website Brief Builder → Personal Website:
   Rebuild final imaginArt pre-production**.
4. Verify the story order and caveats against
   [`docs/content/case-study-imaginart.md`](../../../docs/content/case-study-imaginart.md).

The final frame uses approximately 20px Montserrat body copy, stronger warm
neutral separation, 32px/2.25px line icons and deliberately different visual
grammar for each story. Verify the directional collaboration flow, newsletter
dumbbell comparison, Turtle transformation and rights-cleared image slot, event
ecosystem and attendance ranges, catalogue taxonomy system, vertical Lumens
adaptation and the shared burgundy contact footer.

Internal evidence, copyright and workflow notes remain outside the public page
frame. The two approximate results stay inside their relevant stories rather
than reappearing in a generic outcomes section. Rerunning replaces only the
plugin-tagged final output; it does not alter the earlier wireframe, reframed
exploration or Direction D history.

## Reruns and cleanup

Run **Find generated content** to select plugin-created sections on the current
page. Historical exploration commands still require manual deletion before a
rerun. Approved Foundations, final homepage and final imaginArt commands rebuild
their own tagged output in place without duplicating it.

Figma's ordinary Undo command can also reverse a plugin run immediately.

## Maintenance

The source feedback and layout data live directly in `code.js` so the plugin can
run without package installation, compilation or bundling. If the brief changes,
update the relevant `MOODBOARD` or `DIRECTIONS` data. When evidence changes,
update the internal imaginArt blueprint first and keep the Figma summary
concise. Re-import the local plugin, delete the older generated section manually
and rerun the relevant command.

The manifest deliberately declares `allowedDomains: ["none"]`; adding external
references to the generated text does not cause the plugin to fetch those sites.

Run the dependency-free validation harness after changing the layout or content:

```sh
node tools/figma/abi-brief-builder/validate.mjs
```

It exercises every build command with a mock Figma document, checks placement
and required content, verifies duplicate protection and confirms that a wrong
file remains untouched. Final visual verification must still happen in Figma
Desktop.
