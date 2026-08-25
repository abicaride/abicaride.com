# Abi Website Brief Builder

A local Figma development plugin that lays out Abi's V2 creative brief safely
and consistently. It is a design-workflow tool, not part of the Astro website or
its build.

## What it creates

- In **Abi Website Moodboard**: one bounded `V2 — Creative Brief` FigJam
  section containing Abi's feedback, visual references, positioning note,
  homepage content hypothesis and the potential imaginArt lead case.
- In **Abi Website Foundations → Explorations**: one bounded section containing
  direction boards for `A — Editorial Calm`, `B — Fresh / Image-led` and
  `C — Content-led Personality`.

It does not create finished homepage designs or polished marketing copy.

## Safety model

- The plugin has no network access.
- It validates the open Figma file and editor type before writing.
- The Foundations command also validates that the current page is
  `Explorations`.
- It requires exactly one selected object as a placement anchor.
- It creates the new section 400 px to the right of that anchor.
- Generated root sections are tagged with private plugin data.
- A command cannot create a second copy on the same page.
- The plugin never deletes nodes. `Find generated content` selects its output so
  it can be reviewed, moved or deleted manually.
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

## Reruns and cleanup

Run **Find generated content** to select the plugin-created section on the
current page. Delete it manually if a rebuild is needed, then run the relevant
build command again with a placement anchor selected.

Figma's ordinary Undo command can also reverse a plugin run immediately.

## Maintenance

The source feedback and layout data live directly in `code.js` so the plugin can
run without package installation, compilation or bundling. If the brief changes,
update the relevant `MOODBOARD` or `DIRECTIONS` data and re-import or rerun the
local plugin.

The manifest deliberately declares `allowedDomains: ["none"]`; adding external
references to the generated text does not cause the plugin to fetch those sites.

Run the dependency-free validation harness after changing the layout or content:

```sh
node tools/figma/abi-brief-builder/validate.mjs
```

It exercises both editor commands with a mock Figma document, checks placement
and required content, verifies duplicate protection and confirms that a wrong
file remains untouched. Final visual verification must still happen in Figma
Desktop.
