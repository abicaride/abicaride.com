/*
 * Abi Website Brief Builder
 *
 * A deliberately small, local-only Figma development plugin. It creates the
 * V2 brief from Abi's source feedback without connecting to a server or
 * modifying unrelated nodes. Run it from Figma Desktop.
 */

const PLUGIN_DATA_KEY = "abi-website-brief-builder";
const PLUGIN_VERSION = "1";
const INSERTION_GAP = 400;

const EXPECTED_FILES = {
  moodboard: "abi website moodboard",
  foundations: "abi website foundations",
};

const GENERATED_KIND = {
  moodboard: "v2-creative-brief",
  foundations: "v2-exploration-directions",
};

const FONT = {
  regular: { family: "Inter", style: "Regular" },
  medium: { family: "Inter", style: "Medium" },
  semibold: { family: "Inter", style: "Semi Bold" },
};

const COLOR = {
  ink: "#252421",
  muted: "#66625B",
  canvas: "#F2EFE8",
  paper: "#FFFEFA",
  line: "#D8D2C8",
  sage: "#DDE7DC",
  peach: "#F1DDD0",
  blue: "#DDE6EC",
  yellow: "#F2E6B8",
  rose: "#EADDD8",
  white: "#FFFFFF",
};

const MOODBOARD = {
  desiredFeeling: [
    "Professional",
    "Approachable",
    "Calm",
    "Modern",
    "Fresh",
    "Human",
    "Confident",
  ],
  preserve: [
    "Neutral / calm color direction",
    "Sense of space",
    "Visual calm",
  ],
  change: [
    "Current site feels too close to the previous WordPress portfolio",
    "Current copy feels too generic / AI-generated",
    "Current portrait should not remain",
    "Homepage needs a real hero section",
    "Stronger photography",
    "Clear CTA",
    "Professional work should become the focus",
  ],
  avoid: [
    "old WordPress portfolio feeling",
    "generic portfolio templates",
    "SaaS aesthetics",
    "card-heavy layouts",
    "excessive gradients",
    "generic AI-written copy",
    "over-designed UI",
    "visual noise",
  ],
  references: [
    {
      name: "Marina Posniak",
      url: "https://www.marinaposniak.com/",
      quote: "The different cases are presented very clearly.",
      tag: "Project presentation / information hierarchy",
    },
    {
      name: "Josiah Flores",
      url: "https://www.josiahflores.com/",
      quote: "The hero with a photograph and a short description.",
      tag: "Hero / photography / positioning",
    },
    {
      name: "Leah Kim",
      url: "https://www.leahkim.design/",
      quote:
        "The general design, the single-page feeling and the more social-media-like presentation of work.",
      tag: "Composition / personality / project presentation",
    },
  ],
  openQuestions: [
    "final hero photography",
    "final positioning sentence",
    "primary CTA",
    "final professional case selection",
  ],
  evidence: [
    "Turtle AV product/landing content",
    "Madrid Open Days campaign",
    "Bilbao event communication",
    "Hikvision event/editorial content",
    "BrightSign newsletters/email campaigns",
    "additional imaginArt articles",
  ],
  confirmation: [
    "Madrid expected attendance",
    "Madrid actual attendance",
    "exact +10pp email-open-rate context",
    "exact ownership of every deliverable",
  ],
};

const DIRECTIONS = [
  {
    key: "A",
    title: "Editorial Calm",
    color: COLOR.sage,
    rationale:
      "Explore a restrained, spacious direction led by typography and professional calm.",
    keywords: [
      "spacious",
      "typography-led",
      "restrained",
      "calm",
      "professional",
    ],
  },
  {
    key: "B",
    title: "Fresh / Image-led",
    color: COLOR.peach,
    rationale:
      "Explore stronger photography and contemporary composition while keeping the overall experience calm.",
    keywords: [
      "stronger photography",
      "larger visual moments",
      "contemporary composition",
      "more energetic without losing calm",
    ],
  },
  {
    key: "C",
    title: "Content-led Personality",
    color: COLOR.blue,
    rationale:
      "Explore editorial storytelling, a stronger personal voice and work presented as stories rather than cards.",
    keywords: [
      "editorial storytelling",
      "stronger personal voice",
      "work presented as stories rather than cards",
      "subtle human details",
    ],
  },
];

function normalizeName(value) {
  return value.trim().toLocaleLowerCase();
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function solid(hex, opacity = 1) {
  return {
    type: "SOLID",
    color: hexToRgb(hex),
    opacity,
  };
}

function bullets(items) {
  return items.map((item) => `• ${item}`).join("\n");
}

function generatedValue(kind) {
  return JSON.stringify({ kind, version: PLUGIN_VERSION });
}

function markGenerated(node, kind) {
  node.setPluginData(PLUGIN_DATA_KEY, generatedValue(kind));
  node.setRelaunchData({
    "find-generated": "Find content created by Abi Website Brief Builder",
  });
}

function isGenerated(node, kind) {
  const value = node.getPluginData(PLUGIN_DATA_KEY);
  if (!value) return false;

  try {
    const parsed = JSON.parse(value);
    return !kind || parsed.kind === kind;
  } catch {
    return false;
  }
}

function collectGenerated(node, kind, output = []) {
  if (node.type !== "PAGE" && isGenerated(node, kind)) {
    output.push(node);
    return output;
  }

  if ("children" in node) {
    for (const child of node.children) {
      collectGenerated(child, kind, output);
    }
  }

  return output;
}

function closeWithMessage(message, error = false) {
  figma.notify(message, { error, timeout: error ? 5000 : 3500 });
  figma.closePlugin();
}

function requireExpectedFile(expectedName) {
  const actual = normalizeName(figma.root.name);
  if (!actual.includes(expectedName)) {
    throw new Error(
      `Open “${titleCase(expectedName)}” before running this command. Current file: “${figma.root.name}”.`,
    );
  }
}

function titleCase(value) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function requireSingleAnchor() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1) {
    throw new Error(
      "Select exactly one existing frame, section or object to use as the placement anchor.",
    );
  }

  return selection[0];
}

function insertionPoint(anchor) {
  const bounds = anchor.absoluteRenderBounds || anchor.absoluteBoundingBox;
  if (!bounds) {
    throw new Error("Figma could not calculate the selected anchor's bounds.");
  }

  return {
    x: Math.round(bounds.x + bounds.width + INSERTION_GAP),
    y: Math.round(bounds.y),
  };
}

function ensureNoExisting(kind) {
  const existing = collectGenerated(figma.currentPage, kind);
  if (existing.length === 0) return;

  figma.currentPage.selection = existing;
  figma.viewport.scrollAndZoomIntoView(existing);
  throw new Error(
    "This generated board already exists on the current page. It has been selected instead of duplicated.",
  );
}

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync(FONT.regular),
    figma.loadFontAsync(FONT.medium),
    figma.loadFontAsync(FONT.semibold),
  ]);
}

function createSection(name, point, width, height, fill, kind) {
  const section = figma.createSection();
  section.name = `[ABI BRIEF] ${name}`;
  section.x = point.x;
  section.y = point.y;
  section.resizeWithoutConstraints(width, height);
  section.fills = [solid(fill)];
  markGenerated(section, kind);
  return section;
}

function populateSectionSafely(section, populate) {
  try {
    populate();
  } catch (error) {
    section.remove();
    throw error;
  }
}

function appendText(parent, options) {
  const text = figma.createText();
  parent.appendChild(text);
  text.name = options.name || options.characters.split("\n")[0];
  text.fontName = options.font || FONT.regular;
  text.fontSize = options.fontSize || 26;
  text.lineHeight = {
    unit: "PIXELS",
    value: options.lineHeight || Math.round((options.fontSize || 26) * 1.45),
  };
  text.fills = [solid(options.color || COLOR.ink)];
  text.characters = options.characters;
  text.resize(options.width, 10);
  text.textAutoResize = "HEIGHT";
  text.x = options.x;
  text.y = options.y;
  return text;
}

function createFigJamCard(section, options) {
  const background = figma.createShapeWithText();
  section.appendChild(background);
  background.name = `${options.title} — background`;
  background.shapeType = "ROUNDED_RECTANGLE";
  background.fills = [solid(options.fill || COLOR.paper)];
  background.strokes = [solid(options.stroke || COLOR.line)];
  background.strokeWeight = 2;
  background.resize(options.width, options.height);
  background.x = options.x;
  background.y = options.y;

  const padding = options.padding || 52;
  const title = appendText(section, {
    name: `${options.title} — title`,
    characters: options.title,
    font: FONT.semibold,
    fontSize: options.titleSize || 34,
    lineHeight: options.titleLineHeight || 44,
    color: COLOR.ink,
    width: options.width - padding * 2,
    x: options.x + padding,
    y: options.y + padding,
  });

  const body = appendText(section, {
    name: `${options.title} — content`,
    characters: options.body,
    font: FONT.regular,
    fontSize: options.bodySize || 26,
    lineHeight: options.bodyLineHeight || 39,
    color: options.bodyColor || COLOR.ink,
    width: options.width - padding * 2,
    x: options.x + padding,
    y: title.y + title.height + (options.titleGap || 30),
  });

  if (body.y + body.height > options.y + options.height - padding) {
    throw new Error(
      `The “${options.title}” card content exceeds its safe bounds. Increase the card height before using the plugin.`,
    );
  }

  return { background, title, body };
}

function createDesignFrame(parent, options) {
  const frame = figma.createFrame();
  parent.appendChild(frame);
  frame.name = options.name;
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = options.fixedHeight ? "FIXED" : "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.paddingTop = options.padding || 64;
  frame.paddingRight = options.padding || 64;
  frame.paddingBottom = options.padding || 64;
  frame.paddingLeft = options.padding || 64;
  frame.itemSpacing = options.gap || 28;
  frame.cornerRadius = options.radius || 28;
  frame.clipsContent = false;
  frame.fills = [solid(options.fill || COLOR.paper)];
  frame.strokes = options.stroke ? [solid(options.stroke)] : [];
  frame.strokeWeight = options.stroke ? 1 : 0;
  frame.resize(options.width, options.height || 100);
  frame.x = options.x;
  frame.y = options.y;
  return frame;
}

function appendAutoLayoutText(parent, options) {
  const text = figma.createText();
  parent.appendChild(text);
  text.name = options.name || options.characters.split("\n")[0];
  text.fontName = options.font || FONT.regular;
  text.fontSize = options.fontSize || 26;
  text.lineHeight = {
    unit: "PIXELS",
    value: options.lineHeight || Math.round((options.fontSize || 26) * 1.45),
  };
  text.fills = [solid(options.color || COLOR.ink)];
  text.characters = options.characters;
  text.resize(parent.width - parent.paddingLeft - parent.paddingRight, 10);
  text.textAutoResize = "HEIGHT";
  text.layoutAlign = "STRETCH";
  return text;
}

function createPlaceholder(parent, label) {
  const frame = createDesignFrame(parent, {
    name: `${label} placeholder`,
    x: 0,
    y: 0,
    width: parent.width - parent.paddingLeft - parent.paddingRight,
    padding: 28,
    gap: 10,
    radius: 18,
    fill: COLOR.white,
    stroke: COLOR.line,
  });
  frame.layoutAlign = "STRETCH";

  appendAutoLayoutText(frame, {
    characters: label,
    font: FONT.semibold,
    fontSize: 22,
    lineHeight: 30,
  });
  appendAutoLayoutText(frame, {
    characters: "Add references and observations here during exploration.",
    fontSize: 20,
    lineHeight: 30,
    color: COLOR.muted,
  });

  return frame;
}

function createDirectionBoard(section, direction, x, y, width, height) {
  const frame = createDesignFrame(section, {
    name: `${direction.key} — ${direction.title}`,
    x,
    y,
    width,
    height,
    fixedHeight: true,
    padding: 64,
    gap: 28,
    radius: 32,
    fill: direction.color,
  });

  appendAutoLayoutText(frame, {
    characters: `${direction.key} — ${direction.title}`,
    font: FONT.semibold,
    fontSize: 48,
    lineHeight: 58,
  });
  appendAutoLayoutText(frame, {
    characters: "DIRECTION BOARD — NOT A FINISHED HOMEPAGE",
    font: FONT.medium,
    fontSize: 17,
    lineHeight: 24,
    color: COLOR.muted,
  });
  appendAutoLayoutText(frame, {
    characters: `Rationale\n${direction.rationale}`,
    fontSize: 26,
    lineHeight: 39,
  });
  appendAutoLayoutText(frame, {
    characters: `Keywords\n${bullets(direction.keywords)}`,
    fontSize: 24,
    lineHeight: 36,
  });

  for (const label of [
    "Typography references",
    "Layout ideas",
    "Image treatment ideas",
    "Visual notes",
  ]) {
    createPlaceholder(frame, label);
  }

  return frame;
}

async function buildMoodboard() {
  if (figma.editorType !== "figjam") {
    throw new Error(
      "The Moodboard command only runs in FigJam. Open Abi Website Moodboard first.",
    );
  }

  requireExpectedFile(EXPECTED_FILES.moodboard);
  ensureNoExisting(GENERATED_KIND.moodboard);
  const anchor = requireSingleAnchor();
  const point = insertionPoint(anchor);
  await loadFonts();

  const sectionWidth = 3960;
  const sectionHeight = 4240;
  const padding = 120;
  const columnGap = 80;
  const columnWidth = 1186;
  const section = createSection(
    "V2 — Creative Brief",
    point,
    sectionWidth,
    sectionHeight,
    COLOR.canvas,
    GENERATED_KIND.moodboard,
  );

  populateSectionSafely(section, () => {
  createFigJamCard(section, {
    title: "V2 — Creative Brief",
    body:
      "Abi's real feedback, references and evidence organized for visual exploration.\n\nThis is a design brief, not a finished website direction. Figma is for exploration; Astro remains production.",
    x: padding,
    y: 140,
    width: sectionWidth - padding * 2,
    height: 340,
    fill: COLOR.yellow,
    titleSize: 52,
    titleLineHeight: 62,
    bodySize: 27,
    bodyLineHeight: 40,
  });

  createFigJamCard(section, {
    title: "Desired feeling",
    body: bullets(MOODBOARD.desiredFeeling),
    x: padding,
    y: 580,
    width: columnWidth,
    height: 520,
    fill: COLOR.sage,
  });
  createFigJamCard(section, {
    title: "Preserve",
    body: bullets(MOODBOARD.preserve),
    x: padding + columnWidth + columnGap,
    y: 580,
    width: columnWidth,
    height: 520,
    fill: COLOR.blue,
  });
  createFigJamCard(section, {
    title: "Current positioning direction",
    body:
      "Content strategy · Communications · Content\n\nInternal note\nAbi describes herself as a “Swiss army knife”: she has worked across many kinds of communication and learns quickly. Do not turn this into final homepage copy yet.\n\nDesign implication\nThe website should communicate breadth without making Abi look unfocused.",
    x: padding + (columnWidth + columnGap) * 2,
    y: 580,
    width: columnWidth,
    height: 520,
    fill: COLOR.paper,
    bodySize: 22,
    bodyLineHeight: 32,
  });

  createFigJamCard(section, {
    title: "Change",
    body: bullets(MOODBOARD.change),
    x: padding,
    y: 1180,
    width: columnWidth * 2 + columnGap,
    height: 720,
    fill: COLOR.peach,
  });
  createFigJamCard(section, {
    title: "Avoid",
    body: bullets(MOODBOARD.avoid),
    x: padding + (columnWidth + columnGap) * 2,
    y: 1180,
    width: columnWidth,
    height: 720,
    fill: COLOR.rose,
  });

  appendText(section, {
    name: "Visual references — heading",
    characters: "Visual references",
    font: FONT.semibold,
    fontSize: 42,
    lineHeight: 52,
    color: COLOR.ink,
    width: sectionWidth - padding * 2,
    x: padding,
    y: 2000,
  });
  appendText(section, {
    name: "Visual references — note",
    characters:
      "Use these to identify recurring preferences. Do not treat them as designs to copy.",
    fontSize: 24,
    lineHeight: 36,
    color: COLOR.muted,
    width: sectionWidth - padding * 2,
    x: padding,
    y: 2062,
  });

  MOODBOARD.references.forEach((reference, index) => {
    createFigJamCard(section, {
      title: reference.name,
      body: `${reference.url}\n\nAbi likes\n“${reference.quote}”\n\nPrimary tag\n${reference.tag}\n\nWhat we want to learn from this — not copy literally`,
      x: padding + (columnWidth + columnGap) * index,
      y: 2150,
      width: columnWidth,
      height: 850,
      fill: COLOR.paper,
      bodySize: 23,
      bodyLineHeight: 34,
    });
  });

  createFigJamCard(section, {
    title: "Initial homepage content hypothesis",
    body: `Hero\n↓\nSelected professional work\n↓\nShort positioning / About\n↓\nWriting (future)\n↓\nPrimary CTA\n\nOpen questions\n${bullets(MOODBOARD.openQuestions)}`,
    x: padding,
    y: 3100,
    width: columnWidth,
    height: 980,
    fill: COLOR.blue,
    bodySize: 23,
    bodyLineHeight: 34,
  });
  createFigJamCard(section, {
    title: "Potential lead case — imaginArt",
    body: `Current hypothesis\nA broader professional case showing how Abi translated complex audiovisual technology and business needs into clear B2B content across web, events, email and product communication.\n\nPotential evidence\n${bullets(MOODBOARD.evidence)}\n\nNeeds confirmation — do not invent metrics\n${bullets(MOODBOARD.confirmation)}\n\nDo not write the final case study yet.`,
    x: padding + columnWidth + columnGap,
    y: 3100,
    width: columnWidth * 2 + columnGap,
    height: 980,
    fill: COLOR.yellow,
    bodySize: 23,
    bodyLineHeight: 33,
  });
  });

  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Created V2 — Creative Brief beside the selected anchor.");
}

async function buildFoundations() {
  if (figma.editorType !== "figma") {
    throw new Error(
      "The Foundations command only runs in Figma Design. Open Abi Website Foundations first.",
    );
  }

  requireExpectedFile(EXPECTED_FILES.foundations);
  if (!normalizeName(figma.currentPage.name).includes("explorations")) {
    throw new Error(
      `Open the Explorations page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }

  ensureNoExisting(GENERATED_KIND.foundations);
  const anchor = requireSingleAnchor();
  const point = insertionPoint(anchor);
  await loadFonts();

  const sectionWidth = 3960;
  const sectionHeight = 1960;
  const padding = 120;
  const gap = 80;
  const cardWidth = 1186;
  const section = createSection(
    "V2 — Exploration Directions",
    point,
    sectionWidth,
    sectionHeight,
    COLOR.canvas,
    GENERATED_KIND.foundations,
  );

  populateSectionSafely(section, () => {
  const header = createDesignFrame(section, {
    name: "V2 exploration directions — introduction",
    x: padding,
    y: 140,
    width: sectionWidth - padding * 2,
    padding: 52,
    gap: 18,
    radius: 28,
    fill: COLOR.yellow,
  });
  appendAutoLayoutText(header, {
    characters: "V2 — Exploration Directions",
    font: FONT.semibold,
    fontSize: 52,
    lineHeight: 62,
  });
  appendAutoLayoutText(header, {
    characters:
      "Three direction boards for testing visual ideas before committing to a homepage. These are placeholders for exploration, not approved designs.",
    fontSize: 27,
    lineHeight: 40,
    color: COLOR.muted,
  });

  const cardsY = 140 + header.height + 80;
  for (let index = 0; index < DIRECTIONS.length; index += 1) {
    createDirectionBoard(
      section,
      DIRECTIONS[index],
      padding + (cardWidth + gap) * index,
      cardsY,
      cardWidth,
      1360,
    );
  }
  });

  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Created the three V2 direction boards beside the selected anchor.");
}

function findGenerated() {
  const generated = collectGenerated(figma.currentPage);
  if (generated.length === 0) {
    closeWithMessage("No content generated by this plugin exists on the current page.");
    return;
  }

  figma.currentPage.selection = generated;
  figma.viewport.scrollAndZoomIntoView(generated);
  closeWithMessage(
    `Selected ${generated.length} generated section${generated.length === 1 ? "" : "s"}.`,
  );
}

async function run() {
  try {
    switch (figma.command) {
      case "build-moodboard":
        await buildMoodboard();
        break;
      case "build-foundations":
        await buildFoundations();
        break;
      case "find-generated":
        findGenerated();
        break;
      default:
        closeWithMessage("Choose one of the plugin commands from the Development menu.", true);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected plugin error.";
    closeWithMessage(message, true);
  }
}

run();
