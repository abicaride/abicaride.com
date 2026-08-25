/*
 * Abi Website Brief Builder
 *
 * A deliberately small, local-only Figma development plugin. It creates the
 * V2 brief from Abi's source feedback without connecting to a server or
 * modifying unrelated nodes. Run it from Figma Desktop.
 */

const PLUGIN_DATA_KEY = "abi-website-brief-builder";
const PLUGIN_VERSION = "5";
const INSERTION_GAP = 400;

const EXPECTED_FILES = {
  moodboard: "abi website moodboard",
  foundations: "abi website foundations",
  personal: "abi personal website",
};

const GENERATED_KIND = {
  moodboard: "v2-creative-brief",
  foundations: "v2-exploration-directions",
  homepages: "v2-homepage-concepts",
  imaginart: "imaginart-case-wireframe",
  directionD: "v2-direction-d-clean-organic-editorial",
  imaginartReframed: "imaginart-reframed-editorial-exploration",
  finalDirection: "v2-final-direction-preproduction",
  imaginartPreproduction: "imaginart-final-preproduction-editorial",
};

const FINAL_HERO_PHOTO = "WhatsApp Image 2026-08-25 at 18.49.46";

const FONT = {
  regular: { family: "Inter", style: "Regular" },
  medium: { family: "Inter", style: "Medium" },
  semibold: { family: "Inter", style: "Semi Bold" },
  display: { family: "Georgia", style: "Regular" },
  displayBold: { family: "Georgia", style: "Bold" },
  montserrat: { family: "Montserrat", style: "Regular" },
  montserratMedium: { family: "Montserrat", style: "Medium" },
  montserratBold: { family: "Montserrat", style: "Bold" },
};

const SYNTHESIS_COLOR = {
  ink: "#17372E",
  green: "#32664F",
  greenSoft: "#DDE9DF",
  pinkSoft: "#F4DEE3",
  blueSoft: "#DCE9EE",
  warmWhite: "#FBF9F3",
  canvas: "#EFEEE8",
  line: "#BAC9BF",
  muted: "#5E6B65",
  white: "#FFFFFF",
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
  burgundy: "#7D3043",
  forest: "#25493D",
  fresh: "#F4D6C7",
  lilac: "#D9D3EC",
  sky: "#CFE3E8",
};

const HOMEPAGE = {
  name: "Abi Caride",
  descriptor: "Content strategy · Communications · Content",
  workingLine:
    "I turn complex information into clear, useful content for people and organizations.",
  cta: "Get in touch",
  leadCase: "imaginArt",
  leadDescriptor: "B2B content & communications",
  themes: [
    "technical product content",
    "email",
    "event campaigns",
    "content structure",
  ],
  secondary: ["Website analysis", "Error messages"],
  about:
    "Working positioning: a curious, adaptable communications professional who brings structure, clarity and a human voice to complex subjects.",
  photo:
    "Preferred real photo\nClose portrait · curly hair · glasses · burgundy top",
};

const CASE_STUDY = {
  title: "imaginArt",
  descriptor: "B2B content & communications",
  role: "Communications Specialist · 2023–Present",
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
    "final homepage positioning sentence",
    "primary CTA",
    "final hero photograph",
    "final selection/order of professional cases",
    "final Abi review of public case-study voice",
  ],
  photography: {
    note:
      "Real photography is now available. Do not add personal photo files to the repository unless explicitly requested.",
    direction: [
      "natural",
      "approachable",
      "calm",
      "recognizably Abi",
      "less corporate / LinkedIn-like",
      "stronger personality than the current website portrait",
    ],
    provisional: [
      "Close portrait with curly hair + glasses + burgundy top — preferred hero exploration",
      "Full-body red/grey image — possible About / editorial supporting image",
      "Playful Totoro image — possible personal / About material, not hero",
    ],
  },
  imaginArt: {
    blueprint: "docs/content/case-study-imaginart.md",
    primaryStories: [
      "Turtle AV — technical product content; Abi structured the page herself; content architecture from technical input to usable B2B content",
      "Mundo BrightSign — revised editorial approach; closer professional tone; emoji-led subject; CTA above the fold; ~24% → ~34% open rate; NOT an A/B test",
      "Madrid Open Days 2026 — copy; Canva imagery; mailing design/copy; registration form; web invitation/post; LinkedIn input; ~110–125 attendees vs usual ~70–80",
    ],
    supportingEvidence: [
      "AV Supports Catalogue — information architecture; taxonomy/product categorization; structured product sheets; technical-to-commercial content; layout; imagery selection; sales enablement and content-systems thinking",
      "Lumens — technical source documentation adapted for a B2B audience; feature selection and organization; practical-use framing; technical content adaptation",
      "Bilbao — supporting event-communication evidence; conversion-oriented information structure",
    ],
  },
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
    figma.loadFontAsync(FONT.display),
    figma.loadFontAsync(FONT.displayBold),
  ]);
}

async function loadSynthesisFonts() {
  await Promise.all([
    figma.loadFontAsync(FONT.regular),
    figma.loadFontAsync(FONT.medium),
    figma.loadFontAsync(FONT.semibold),
    figma.loadFontAsync(FONT.montserrat),
    figma.loadFontAsync(FONT.montserratMedium),
    figma.loadFontAsync(FONT.montserratBold),
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

function createCanvasFrame(parent, options) {
  const frame = figma.createFrame();
  parent.appendChild(frame);
  frame.name = options.name;
  frame.resize(options.width, options.height);
  frame.x = options.x;
  frame.y = options.y;
  frame.cornerRadius = options.radius || 0;
  frame.clipsContent = options.clipsContent || false;
  frame.fills = options.fill ? [solid(options.fill)] : [];
  frame.strokes = options.stroke ? [solid(options.stroke)] : [];
  frame.strokeWeight = options.stroke ? options.strokeWeight || 1 : 0;
  return frame;
}

function createRule(parent, options) {
  return createCanvasFrame(parent, {
    name: options.name || "Divider",
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height || 2,
    fill: options.color || COLOR.line,
  });
}

function createEllipse(parent, options) {
  const ellipse = figma.createEllipse();
  parent.appendChild(ellipse);
  ellipse.name = options.name;
  ellipse.resize(options.width, options.height);
  ellipse.x = options.x;
  ellipse.y = options.y;
  ellipse.fills = options.fill ? [solid(options.fill)] : [];
  ellipse.strokes = options.stroke ? [solid(options.stroke)] : [];
  ellipse.strokeWeight = options.stroke ? options.strokeWeight || 1 : 0;
  return ellipse;
}

function findImageHashByName(fragment) {
  const wanted = normalizeName(fragment);
  const candidates = figma.currentPage.findAll
    ? figma.currentPage.findAll((node) => {
        if (!normalizeName(node.name || "").includes(wanted)) return false;
        if (!("fills" in node) || !Array.isArray(node.fills)) return false;
        return node.fills.some((fill) => fill && fill.type === "IMAGE" && fill.imageHash);
      })
    : [];
  const selectedImageNode = figma.currentPage.selection.find(
    (node) =>
      "fills" in node &&
      Array.isArray(node.fills) &&
      node.fills.some((fill) => fill && fill.type === "IMAGE" && fill.imageHash),
  );
  const imageNode = candidates[0] || selectedImageNode;
  const imageFill = imageNode?.fills?.find(
    (fill) => fill && fill.type === "IMAGE" && fill.imageHash,
  );
  return imageFill?.imageHash || null;
}

function preferGeneratedAnchor(kind) {
  const generated = collectGenerated(figma.currentPage, kind);
  if (generated.length === 1) return generated[0];
  if (generated.length > 1) {
    throw new Error("More than one possible historical anchor was found. Keep one generated source section before rebuilding.");
  }
  return requireSingleAnchor();
}

function applyImageFill(frame, imageHash) {
  if (!imageHash) return false;
  frame.fills = [{ type: "IMAGE", imageHash, scaleMode: "FILL" }];
  return true;
}

function createPill(parent, options) {
  const pill = createCanvasFrame(parent, {
    name: options.label,
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height || 44,
    fill: options.fill || COLOR.paper,
    stroke: options.stroke || COLOR.line,
    radius: 999,
  });
  appendText(pill, {
    characters: options.label,
    font: FONT.medium,
    fontSize: options.fontSize || 16,
    lineHeight: options.lineHeight || 22,
    color: options.color || COLOR.ink,
    width: pill.width - 28,
    x: 14,
    y: Math.round((pill.height - (options.lineHeight || 22)) / 2),
  });
  return pill;
}

function createPhotoPlaceholder(parent, options) {
  const frame = createCanvasFrame(parent, {
    name: "Working photography placeholder",
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    fill: options.fill,
    radius: options.radius || 0,
    stroke: options.stroke,
  });
  appendText(frame, {
    characters: "PHOTO — WORKING SELECTION",
    font: FONT.semibold,
    fontSize: 15,
    lineHeight: 22,
    color: options.labelColor || COLOR.ink,
    width: frame.width - 64,
    x: 32,
    y: 32,
  });
  appendText(frame, {
    characters: HOMEPAGE.photo,
    font: FONT.display,
    fontSize: options.fontSize || 32,
    lineHeight: options.lineHeight || 42,
    color: options.labelColor || COLOR.ink,
    width: frame.width - 64,
    x: 32,
    y: frame.height - (options.captionHeight || 150),
  });
  return frame;
}

function createNav(frame, palette) {
  appendText(frame, {
    characters: "ABI CARIDE",
    font: FONT.semibold,
    fontSize: 17,
    lineHeight: 24,
    color: palette.ink,
    width: 220,
    x: 80,
    y: 48,
  });
  for (const [label, x] of [["Work", 1020], ["About", 1125], ["Contact", 1235]]) {
    appendText(frame, {
      characters: label,
      font: FONT.medium,
      fontSize: 16,
      lineHeight: 24,
      color: palette.ink,
      width: 110,
      x,
      y: 48,
    });
  }
  createRule(frame, { x: 80, y: 98, width: 1280, color: palette.line });
}

function createConceptLabel(frame, direction, palette) {
  createPill(frame, {
    label: `${direction.key} — ${direction.title}`,
    x: 80,
    y: 126,
    width: direction.key === "C" ? 280 : 235,
    fill: palette.label,
    stroke: palette.line,
    color: palette.ink,
  });
  appendText(frame, {
    characters: "DESKTOP CONCEPT · WORKING COPY · NOT APPROVED",
    font: FONT.medium,
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    width: 420,
    x: 940,
    y: 140,
  });
}

function createThemePills(frame, palette, y) {
  const widths = [230, 110, 180, 180];
  let x = 80;
  HOMEPAGE.themes.forEach((theme, index) => {
    createPill(frame, {
      label: theme,
      x,
      y,
      width: widths[index],
      fill: palette.pill,
      stroke: palette.line,
      color: palette.ink,
      fontSize: 14,
      lineHeight: 20,
      height: 40,
    });
    x += widths[index] + 12;
  });
}

function createFooterCta(frame, palette, y) {
  createRule(frame, { x: 80, y, width: 1280, color: palette.line });
  appendText(frame, {
    characters: "Have something complex that needs clarity?",
    font: FONT.display,
    fontSize: 48,
    lineHeight: 58,
    color: palette.ink,
    width: 760,
    x: 80,
    y: y + 72,
  });
  createPill(frame, {
    label: `${HOMEPAGE.cta}  ↗`,
    x: 1090,
    y: y + 80,
    width: 270,
    height: 58,
    fill: palette.accent,
    stroke: palette.accent,
    color: palette.ctaText,
    fontSize: 18,
    lineHeight: 26,
  });
  appendText(frame, {
    characters: "Working CTA",
    font: FONT.medium,
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    width: 200,
    x: 1090,
    y: y + 148,
  });
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

function createHomepageA(section, x, y) {
  const palette = {
    background: "#F6F1E7",
    ink: "#203029",
    muted: "#5C675F",
    line: "#CFC5B3",
    accent: "#9B3B2B",
    ctaText: COLOR.white,
    label: "#ECE3D2",
    pill: "#FFFCF6",
  };
  const frame = createCanvasFrame(section, {
    name: "Home A — Editorial Calm",
    x,
    y,
    width: 1440,
    height: 3400,
    fill: palette.background,
  });
  createNav(frame, palette);
  createConceptLabel(frame, DIRECTIONS[0], palette);

  appendText(frame, {
    characters: HOMEPAGE.descriptor,
    font: FONT.medium,
    fontSize: 18,
    lineHeight: 28,
    color: palette.accent,
    width: 620,
    x: 80,
    y: 250,
  });
  appendText(frame, {
    characters: HOMEPAGE.name,
    font: FONT.display,
    fontSize: 112,
    lineHeight: 116,
    color: palette.ink,
    width: 820,
    x: 80,
    y: 300,
  });
  appendText(frame, {
    characters: `WORKING COPY\n${HOMEPAGE.workingLine}`,
    font: FONT.regular,
    fontSize: 28,
    lineHeight: 40,
    color: palette.ink,
    width: 680,
    x: 80,
    y: 470,
  });
  createPill(frame, {
    label: `${HOMEPAGE.cta}  ↗`,
    x: 80,
    y: 640,
    width: 220,
    height: 54,
    fill: palette.accent,
    stroke: palette.accent,
    color: palette.ctaText,
    fontSize: 17,
    lineHeight: 24,
  });
  createPhotoPlaceholder(frame, {
    x: 940,
    y: 230,
    width: 420,
    height: 520,
    fill: "#DED2BD",
    stroke: palette.line,
    radius: 8,
    fontSize: 26,
    lineHeight: 36,
  });

  createRule(frame, { x: 80, y: 840, width: 1280, color: palette.line });
  appendText(frame, {
    characters: "01 · LEAD PROFESSIONAL WORK",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 400,
    x: 80,
    y: 900,
  });
  appendText(frame, {
    characters: HOMEPAGE.leadCase,
    font: FONT.display,
    fontSize: 78,
    lineHeight: 86,
    color: palette.ink,
    width: 680,
    x: 80,
    y: 950,
  });
  appendText(frame, {
    characters: `${HOMEPAGE.leadDescriptor}\nMaking complex audiovisual information clearer and more useful across product, email and events.`,
    fontSize: 24,
    lineHeight: 36,
    color: palette.ink,
    width: 600,
    x: 80,
    y: 1060,
  });
  createThemePills(frame, palette, 1270);
  const leadVisual = createCanvasFrame(frame, {
    name: "imaginArt editorial visual placeholder",
    x: 820,
    y: 900,
    width: 540,
    height: 500,
    fill: "#ECE3D2",
    radius: 8,
  });
  appendText(leadVisual, {
    characters: "TECHNICAL INPUT\n↓\nCONTENT STRUCTURE\n↓\nUSEFUL B2B COMMUNICATION",
    font: FONT.semibold,
    fontSize: 24,
    lineHeight: 40,
    color: palette.ink,
    width: 420,
    x: 60,
    y: 90,
  });

  createRule(frame, { x: 80, y: 1510, width: 1280, color: palette.line });
  appendText(frame, {
    characters: "02 · EARLIER / SUPPORTING WORK",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 400,
    x: 80,
    y: 1570,
  });
  HOMEPAGE.secondary.forEach((title, index) => {
    const rowY = 1640 + index * 190;
    appendText(frame, {
      characters: `0${index + 2}`,
      font: FONT.display,
      fontSize: 38,
      lineHeight: 46,
      color: palette.muted,
      width: 90,
      x: 80,
      y: rowY,
    });
    appendText(frame, {
      characters: title,
      font: FONT.display,
      fontSize: 46,
      lineHeight: 56,
      color: palette.ink,
      width: 700,
      x: 210,
      y: rowY,
    });
    appendText(frame, {
      characters: index === 0 ? "Content review · structure · recommendations" : "UX writing · clarity · recovery",
      fontSize: 18,
      lineHeight: 28,
      color: palette.muted,
      width: 420,
      x: 840,
      y: rowY + 10,
    });
    createRule(frame, { x: 80, y: rowY + 130, width: 1280, color: palette.line });
  });

  const about = createCanvasFrame(frame, {
    name: "About / positioning",
    x: 80,
    y: 2150,
    width: 1280,
    height: 620,
    fill: "#DDE7DC",
    radius: 18,
  });
  appendText(about, {
    characters: "ABOUT · WORKING POSITIONING",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 420,
    x: 56,
    y: 56,
  });
  appendText(about, {
    characters: HOMEPAGE.about,
    font: FONT.display,
    fontSize: 48,
    lineHeight: 60,
    color: palette.ink,
    width: 1020,
    x: 56,
    y: 120,
  });
  appendText(about, {
    characters: "Spacious, restrained, editorial. Photography supports the story rather than dominating it.",
    fontSize: 18,
    lineHeight: 28,
    color: palette.muted,
    width: 650,
    x: 56,
    y: 470,
  });
  createFooterCta(frame, palette, 2980);
  return frame;
}

function createHomepageB(section, x, y) {
  const palette = {
    background: "#FFF9F4",
    ink: "#292724",
    muted: "#6D625D",
    line: "#DCC9BF",
    accent: COLOR.burgundy,
    ctaText: COLOR.white,
    label: COLOR.fresh,
    pill: "#FFFDF9",
  };
  const frame = createCanvasFrame(section, {
    name: "Home B — Fresh / Image-led",
    x,
    y,
    width: 1440,
    height: 3400,
    fill: palette.background,
  });
  createNav(frame, palette);
  createConceptLabel(frame, DIRECTIONS[1], palette);
  createPhotoPlaceholder(frame, {
    x: 700,
    y: 205,
    width: 660,
    height: 760,
    fill: COLOR.fresh,
    stroke: palette.line,
    radius: 80,
    fontSize: 34,
    lineHeight: 46,
    captionHeight: 190,
  });
  appendText(frame, {
    characters: HOMEPAGE.name,
    font: FONT.displayBold,
    fontSize: 94,
    lineHeight: 102,
    color: palette.ink,
    width: 590,
    x: 80,
    y: 280,
  });
  appendText(frame, {
    characters: HOMEPAGE.descriptor,
    font: FONT.medium,
    fontSize: 18,
    lineHeight: 28,
    color: palette.accent,
    width: 560,
    x: 80,
    y: 415,
  });
  appendText(frame, {
    characters: `WORKING COPY\n${HOMEPAGE.workingLine}`,
    fontSize: 27,
    lineHeight: 40,
    color: palette.ink,
    width: 500,
    x: 80,
    y: 510,
  });
  createPill(frame, {
    label: `${HOMEPAGE.cta}  ↗`,
    x: 80,
    y: 705,
    width: 220,
    height: 56,
    fill: palette.accent,
    stroke: palette.accent,
    color: palette.ctaText,
    fontSize: 17,
    lineHeight: 24,
  });

  const lead = createCanvasFrame(frame, {
    name: "Lead case — imaginArt",
    x: 80,
    y: 1060,
    width: 1280,
    height: 700,
    fill: "#F4D6C7",
    radius: 34,
  });
  appendText(lead, {
    characters: "LEAD PROFESSIONAL WORK · 01",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 430,
    x: 56,
    y: 54,
  });
  appendText(lead, {
    characters: HOMEPAGE.leadCase,
    font: FONT.displayBold,
    fontSize: 82,
    lineHeight: 90,
    color: palette.ink,
    width: 560,
    x: 56,
    y: 105,
  });
  appendText(lead, {
    characters: HOMEPAGE.leadDescriptor,
    font: FONT.medium,
    fontSize: 24,
    lineHeight: 34,
    color: palette.ink,
    width: 520,
    x: 56,
    y: 220,
  });
  appendText(lead, {
    characters: "Product content, editorial email and event campaigns held together by clear information structure.",
    fontSize: 21,
    lineHeight: 32,
    color: palette.ink,
    width: 500,
    x: 56,
    y: 290,
  });
  const moment = createCanvasFrame(lead, {
    name: "Project visual moment",
    x: 650,
    y: 50,
    width: 570,
    height: 600,
    fill: "#FFF5EE",
    radius: 28,
  });
  appendText(moment, {
    characters: "TECHNICAL\n→ CLEAR\n→ USEFUL",
    font: FONT.displayBold,
    fontSize: 60,
    lineHeight: 74,
    color: palette.accent,
    width: 460,
    x: 52,
    y: 80,
  });
  appendText(moment, {
    characters: bullets(HOMEPAGE.themes),
    fontSize: 18,
    lineHeight: 30,
    color: palette.ink,
    width: 420,
    x: 52,
    y: 365,
  });

  appendText(frame, {
    characters: "SECONDARY WORK",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 300,
    x: 80,
    y: 1840,
  });
  const secondaryOne = createCanvasFrame(frame, {
    name: HOMEPAGE.secondary[0],
    x: 80,
    y: 1900,
    width: 760,
    height: 430,
    fill: COLOR.sky,
    radius: 28,
  });
  const secondaryTwo = createCanvasFrame(frame, {
    name: HOMEPAGE.secondary[1],
    x: 880,
    y: 1980,
    width: 480,
    height: 430,
    fill: COLOR.lilac,
    radius: 28,
  });
  for (const [node, title, index] of [[secondaryOne, HOMEPAGE.secondary[0], 0], [secondaryTwo, HOMEPAGE.secondary[1], 1]]) {
    appendText(node, {
      characters: `0${index + 2}`,
      font: FONT.semibold,
      fontSize: 16,
      lineHeight: 24,
      color: palette.accent,
      width: 100,
      x: 42,
      y: 42,
    });
    appendText(node, {
      characters: title,
      font: FONT.displayBold,
      fontSize: index === 0 ? 48 : 40,
      lineHeight: index === 0 ? 58 : 50,
      color: palette.ink,
      width: node.width - 84,
      x: 42,
      y: 120,
    });
  }
  appendText(frame, {
    characters: "ABOUT · WORKING POSITIONING",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 400,
    x: 80,
    y: 2510,
  });
  appendText(frame, {
    characters: HOMEPAGE.about,
    font: FONT.display,
    fontSize: 46,
    lineHeight: 58,
    color: palette.ink,
    width: 1040,
    x: 80,
    y: 2570,
  });
  createCanvasFrame(frame, {
    name: "Fresh personality accent",
    x: 1160,
    y: 2560,
    width: 200,
    height: 200,
    fill: COLOR.yellow,
    radius: 100,
  });
  createFooterCta(frame, palette, 2980);
  return frame;
}

function createHomepageC(section, x, y) {
  const palette = {
    background: "#EAF1EF",
    ink: "#1E342D",
    muted: "#61706A",
    line: "#B9CBC5",
    accent: "#8B3B2C",
    ctaText: COLOR.white,
    label: COLOR.yellow,
    pill: "#F7FBF9",
  };
  const frame = createCanvasFrame(section, {
    name: "Home C — Content-led Personality",
    x,
    y,
    width: 1440,
    height: 3400,
    fill: palette.background,
  });
  createNav(frame, palette);
  createConceptLabel(frame, DIRECTIONS[2], palette);
  appendText(frame, {
    characters: "HELLO, I’M",
    font: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: palette.accent,
    width: 220,
    x: 80,
    y: 250,
  });
  appendText(frame, {
    characters: HOMEPAGE.name,
    font: FONT.displayBold,
    fontSize: 92,
    lineHeight: 100,
    color: palette.ink,
    width: 780,
    x: 80,
    y: 295,
  });
  appendText(frame, {
    characters: `WORKING COPY\n${HOMEPAGE.workingLine}`,
    font: FONT.display,
    fontSize: 52,
    lineHeight: 64,
    color: palette.ink,
    width: 920,
    x: 80,
    y: 450,
  });
  appendText(frame, {
    characters: HOMEPAGE.descriptor,
    font: FONT.medium,
    fontSize: 18,
    lineHeight: 28,
    color: palette.accent,
    width: 620,
    x: 80,
    y: 690,
  });
  createPhotoPlaceholder(frame, {
    x: 1040,
    y: 270,
    width: 320,
    height: 480,
    fill: "#D9D3EC",
    stroke: palette.line,
    radius: 160,
    fontSize: 21,
    lineHeight: 30,
    captionHeight: 185,
  });
  createPill(frame, {
    label: `${HOMEPAGE.cta}  ↗`,
    x: 80,
    y: 770,
    width: 220,
    height: 54,
    fill: palette.accent,
    stroke: palette.accent,
    color: palette.ctaText,
    fontSize: 17,
    lineHeight: 24,
  });

  createRule(frame, { x: 80, y: 920, width: 1280, color: palette.line });
  appendText(frame, {
    characters: "STORY 01",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 200,
    x: 80,
    y: 980,
  });
  appendText(frame, {
    characters: HOMEPAGE.leadCase,
    font: FONT.displayBold,
    fontSize: 68,
    lineHeight: 78,
    color: palette.ink,
    width: 800,
    x: 80,
    y: 1030,
  });
  appendText(frame, {
    characters: HOMEPAGE.leadDescriptor,
    font: FONT.displayBold,
    fontSize: 34,
    lineHeight: 44,
    color: palette.ink,
    width: 760,
    x: 80,
    y: 1120,
  });
  appendText(frame, {
    characters: "One professional story about making specialist audiovisual information clearer across product pages, editorial email and event campaigns.",
    fontSize: 25,
    lineHeight: 38,
    color: palette.ink,
    width: 720,
    x: 80,
    y: 1200,
  });
  const indexVisual = createCanvasFrame(frame, {
    name: "Story index visual",
    x: 920,
    y: 980,
    width: 440,
    height: 520,
    fill: COLOR.yellow,
    radius: 220,
  });
  appendText(indexVisual, {
    characters: "01",
    font: FONT.displayBold,
    fontSize: 150,
    lineHeight: 160,
    color: palette.accent,
    width: 300,
    x: 90,
    y: 95,
  });
  appendText(indexVisual, {
    characters: bullets(HOMEPAGE.themes),
    fontSize: 16,
    lineHeight: 26,
    color: palette.ink,
    width: 280,
    x: 90,
    y: 285,
  });

  createRule(frame, { x: 80, y: 1600, width: 1280, color: palette.line });
  appendText(frame, {
    characters: "MORE STORIES",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 240,
    x: 80,
    y: 1660,
  });
  HOMEPAGE.secondary.forEach((title, index) => {
    const rowY = 1740 + index * 240;
    appendText(frame, {
      characters: `0${index + 2} /`,
      font: FONT.display,
      fontSize: 34,
      lineHeight: 44,
      color: palette.muted,
      width: 120,
      x: 80,
      y: rowY,
    });
    appendText(frame, {
      characters: title,
      font: FONT.displayBold,
      fontSize: 58,
      lineHeight: 68,
      color: palette.ink,
      width: 800,
      x: 230,
      y: rowY,
    });
    appendText(frame, {
      characters: index === 0 ? "Finding structure in an existing experience." : "Helping people recover with clearer words.",
      fontSize: 18,
      lineHeight: 28,
      color: palette.muted,
      width: 350,
      x: 1010,
      y: rowY + 12,
    });
    createRule(frame, { x: 80, y: rowY + 150, width: 1280, color: palette.line });
  });
  const about = createCanvasFrame(frame, {
    name: "About / voice note",
    x: 80,
    y: 2350,
    width: 1280,
    height: 470,
    fill: "#F7FBF9",
    stroke: palette.line,
    radius: 12,
  });
  appendText(about, {
    characters: "A SMALL NOTE ABOUT HOW I WORK",
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: palette.accent,
    width: 420,
    x: 54,
    y: 54,
  });
  appendText(about, {
    characters: HOMEPAGE.about,
    font: FONT.display,
    fontSize: 42,
    lineHeight: 54,
    color: palette.ink,
    width: 1050,
    x: 54,
    y: 115,
  });
  createPill(about, {
    label: "Curious by default",
    x: 930,
    y: 355,
    width: 240,
    fill: COLOR.lilac,
    stroke: COLOR.lilac,
    color: palette.ink,
  });
  createFooterCta(frame, palette, 2980);
  return frame;
}

async function buildHomepageConcepts() {
  if (figma.editorType !== "figma") {
    throw new Error("Homepage concepts can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.foundations);
  if (!normalizeName(figma.currentPage.name).includes("explorations")) {
    throw new Error(
      `Open the Explorations page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }
  ensureNoExisting(GENERATED_KIND.homepages);
  const anchor = requireSingleAnchor();
  const point = insertionPoint(anchor);
  await loadFonts();

  const section = createSection(
    "V2 — Desktop Homepage Concepts",
    point,
    4800,
    3720,
    COLOR.canvas,
    GENERATED_KIND.homepages,
  );
  populateSectionSafely(section, () => {
    appendText(section, {
      characters: "V2 — FIRST HOMEPAGE VISUAL EXPLORATIONS",
      font: FONT.semibold,
      fontSize: 28,
      lineHeight: 38,
      color: COLOR.ink,
      width: 1200,
      x: 120,
      y: 55,
    });
    appendText(section, {
      characters: "Same information architecture and working content in all three. Compare visual direction—not content strategy.",
      fontSize: 20,
      lineHeight: 30,
      color: COLOR.muted,
      width: 1700,
      x: 120,
      y: 100,
    });
    createHomepageA(section, 120, 190);
    createHomepageB(section, 1680, 190);
    createHomepageC(section, 3240, 190);
  });
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Created three comparable desktop homepage concepts.");
}

function createCaseBand(parent, options) {
  return createCanvasFrame(parent, {
    name: options.name,
    x: 0,
    y: options.y,
    width: 1440,
    height: options.height,
    fill: options.fill,
  });
}

function addCaseHeading(band, number, title, subtitle, options = {}) {
  appendText(band, {
    characters: number,
    font: FONT.medium,
    fontSize: 15,
    lineHeight: 22,
    color: options.accent || COLOR.burgundy,
    width: 100,
    x: 80,
    y: 64,
  });
  appendText(band, {
    characters: title,
    font: FONT.displayBold,
    fontSize: options.size || 54,
    lineHeight: options.lineHeight || 64,
    color: options.ink || COLOR.ink,
    width: options.width || 920,
    x: 180,
    y: 50,
  });
  if (subtitle) {
    appendText(band, {
      characters: subtitle,
      fontSize: 19,
      lineHeight: 30,
      color: options.muted || COLOR.muted,
      width: 1040,
      x: 180,
      y: options.subtitleY || 125,
    });
  }
}

function createDiagramBox(parent, options) {
  const box = createCanvasFrame(parent, {
    name: options.title,
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    fill: options.fill || COLOR.paper,
    stroke: options.stroke || COLOR.line,
    radius: options.radius || 18,
  });
  appendText(box, {
    characters: options.title,
    font: FONT.semibold,
    fontSize: options.titleSize || 17,
    lineHeight: options.titleLineHeight || 24,
    color: options.titleColor || COLOR.burgundy,
    width: box.width - 48,
    x: 24,
    y: 24,
  });
  appendText(box, {
    characters: options.body,
    fontSize: options.bodySize || 18,
    lineHeight: options.bodyLineHeight || 28,
    color: options.bodyColor || COLOR.ink,
    width: box.width - 48,
    x: 24,
    y: options.bodyY || 72,
  });
  return box;
}

function addFlowArrow(parent, x, y, width = 80, color = COLOR.burgundy) {
  appendText(parent, {
    characters: "→",
    font: FONT.display,
    fontSize: 42,
    lineHeight: 48,
    color,
    width,
    x,
    y,
  });
}

function createConnectorBar(parent, options) {
  const connector = createCanvasFrame(parent, {
    name: options.name || "Collaboration connector",
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height || 4,
    fill: options.color || COLOR.burgundy,
    radius: 2,
  });
  connector.rotation = options.rotation || 0;
  return connector;
}

async function buildImaginartWireframe() {
  if (figma.editorType !== "figma") {
    throw new Error("The imaginArt wireframe can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  if (!normalizeName(figma.currentPage.name).includes("case studies")) {
    throw new Error(
      `Open the Case Studies page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }
  ensureNoExisting(GENERATED_KIND.imaginart);
  const anchor = requireSingleAnchor();
  const point = insertionPoint(anchor);
  await loadFonts();

  const section = createSection(
    "imaginArt — Case Study Structure Exploration",
    point,
    1740,
    8920,
    COLOR.canvas,
    GENERATED_KIND.imaginart,
  );
  populateSectionSafely(section, () => {
    appendText(section, {
      characters:
        "EDITORIAL WIREFRAME · WORKING COPY · ORIGINAL VISUAL CONCEPTS\nEvidence blueprint: docs/content/case-study-imaginart.md",
      font: FONT.medium,
      fontSize: 16,
      lineHeight: 24,
      color: COLOR.muted,
      width: 1200,
      x: 150,
      y: 70,
    });
    const page = createCanvasFrame(section, {
      name: "imaginArt — Case Study Structure Exploration",
      x: 150,
      y: 130,
      width: 1440,
      height: 8600,
      fill: "#F8F4EC",
    });

    const hero = createCaseBand(page, {
      name: "01 Hero",
      y: 0,
      height: 720,
      fill: "#203029",
    });
    appendText(hero, {
      characters: "01 · HERO · LEAD PROFESSIONAL CASE · WORKING STRUCTURE",
      font: FONT.medium,
      fontSize: 15,
      lineHeight: 22,
      color: "#E5B3A4",
      width: 700,
      x: 80,
      y: 70,
    });
    appendText(hero, {
      characters: CASE_STUDY.title,
      font: FONT.displayBold,
      fontSize: 112,
      lineHeight: 120,
      color: COLOR.white,
      width: 900,
      x: 80,
      y: 145,
    });
    appendText(hero, {
      characters: CASE_STUDY.descriptor,
      font: FONT.display,
      fontSize: 46,
      lineHeight: 58,
      color: "#F2E6B8",
      width: 850,
      x: 80,
      y: 290,
    });
    appendText(hero, {
      characters: CASE_STUDY.role,
      fontSize: 20,
      lineHeight: 30,
      color: "#E4E9E6",
      width: 620,
      x: 80,
      y: 390,
    });
    appendText(hero, {
      characters: "WORKING THESIS\nMaking complex B2B communication clearer and more useful.",
      font: FONT.medium,
      fontSize: 20,
      lineHeight: 32,
      color: COLOR.white,
      width: 480,
      x: 880,
      y: 450,
    });

    const context = createCaseBand(page, {
      name: "02 Context + Role",
      y: 720,
      height: 760,
      fill: "#F8F4EC",
    });
    addCaseHeading(
      context,
      "02",
      "Context + role",
      "A specialist B2B audiovisual environment where technical accuracy, customer usefulness and business action had to work together.",
    );
    createDiagramBox(context, {
      title: "THE CONTEXT",
      body: "Professional AV technology\nTechnical product information\nB2B audience\nMultiple channels",
      x: 180,
      y: 245,
      width: 460,
      height: 380,
      fill: COLOR.blue,
    });
    createDiagramBox(context, {
      title: "ABI’S ROLE",
      body: "Content structure\nCopy and hierarchy\nWeb + SEO\nEmail + events\nSocial inputs\nCross-team collaboration",
      x: 740,
      y: 245,
      width: 520,
      height: 380,
      fill: COLOR.sage,
    });

    const turtle = createCaseBand(page, {
      name: "03 Turtle",
      y: 1480,
      height: 1040,
      fill: COLOR.paper,
    });
    addCaseHeading(
      turtle,
      "03",
      "Turtle AV",
      "Original content-transformation diagram — not a reproduction of the imaginArt page.",
    );
    createDiagramBox(turtle, {
      title: "TECHNICAL INPUT",
      body: "4K · Dante · AES67\nPoE · HDR · latency\nredundancy · compatibility",
      x: 100,
      y: 260,
      width: 350,
      height: 360,
      fill: COLOR.blue,
    });
    addFlowArrow(turtle, 470, 395, 70);
    createDiagramBox(turtle, {
      title: "CONTENT QUESTIONS",
      body: "What is it?\nWhy does it matter?\nWhich solution fits?\nWhere can it be used?\nWhat happens next?",
      x: 540,
      y: 240,
      width: 360,
      height: 400,
      fill: COLOR.yellow,
    });
    addFlowArrow(turtle, 920, 395, 70);
    createDiagramBox(turtle, {
      title: "STRUCTURED PRODUCT CONTENT",
      body: "Value proposition\nKey benefits\nSolutions\nTechnical detail\nApplications\nContact CTA",
      x: 990,
      y: 220,
      width: 350,
      height: 440,
      fill: COLOR.sage,
    });
    appendText(turtle, {
      characters: "PORTFOLIO ANGLE",
      font: FONT.medium,
      fontSize: 14,
      lineHeight: 22,
      color: COLOR.burgundy,
      width: 240,
      x: 100,
      y: 760,
    });
    appendText(turtle, {
      characters: "From technical information to usable product content.",
      font: FONT.display,
      fontSize: 46,
      lineHeight: 58,
      color: COLOR.ink,
      width: 1080,
      x: 100,
      y: 810,
    });

    const mundo = createCaseBand(page, {
      name: "04 Mundo BrightSign",
      y: 2520,
      height: 1120,
      fill: "#F3E5DE",
    });
    addCaseHeading(
      mundo,
      "04",
      "Mundo BrightSign",
      "Abstract hierarchy comparison. Approximate recalled values; this was not an A/B test and does not prove causality.",
      { accent: COLOR.burgundy },
    );
    createDiagramBox(mundo, {
      title: "EARLIER HIERARCHY",
      body: "Subject\n↓\nIntro\n↓\nContent\n↓\nMore content\n↓\nCTA",
      x: 120,
      y: 280,
      width: 430,
      height: 500,
      fill: COLOR.paper,
    });
    createDiagramBox(mundo, {
      title: "REVISED HIERARCHY",
      body: "Emoji + revised subject\n↓\nCloser professional tone\n↓\nCTA above the fold\n↓\nContent\n↓\nAdditional content",
      x: 890,
      y: 280,
      width: 430,
      height: 500,
      fill: COLOR.paper,
    });
    appendText(mundo, {
      characters: "~24%",
      font: FONT.displayBold,
      fontSize: 76,
      lineHeight: 84,
      color: COLOR.ink,
      width: 280,
      x: 200,
      y: 835,
    });
    appendText(mundo, {
      characters: "→",
      font: FONT.display,
      fontSize: 68,
      lineHeight: 78,
      color: COLOR.burgundy,
      width: 120,
      x: 660,
      y: 835,
    });
    appendText(mundo, {
      characters: "~34%",
      font: FONT.displayBold,
      fontSize: 76,
      lineHeight: 84,
      color: COLOR.burgundy,
      width: 300,
      x: 965,
      y: 835,
    });
    appendText(mundo, {
      characters: "APPROXIMATE OPEN RATE · OBSERVED AFTER A COMBINED EDITORIAL REVISION",
      font: FONT.medium,
      fontSize: 13,
      lineHeight: 20,
      color: COLOR.muted,
      width: 760,
      x: 340,
      y: 965,
    });
    appendText(mundo, {
      characters: "NOT AN A/B TEST · THE CHANGE CANNOT BE ATTRIBUTED TO ONE VARIABLE",
      font: FONT.medium,
      fontSize: 13,
      lineHeight: 20,
      color: COLOR.burgundy,
      width: 760,
      x: 390,
      y: 1010,
    });

    const madrid = createCaseBand(page, {
      name: "05 Madrid Open Days",
      y: 3640,
      height: 1240,
      fill: "#EEF3F0",
    });
    addCaseHeading(
      madrid,
      "05",
      "Madrid Open Days 2026",
      "Original campaign-ecosystem concept showing how the channels worked toward registration and the event.",
    );
    const channels = ["Mailing", "Web", "Registration form", "Canva assets", "LinkedIn"];
    channels.forEach((label, index) => {
      createDiagramBox(madrid, {
        title: label.toUpperCase(),
        body: index === 2 ? "Capture intent" : "Campaign touchpoint",
        x: 80 + index * 258,
        y: 270,
        width: 226,
        height: 190,
        fill: index % 2 === 0 ? COLOR.paper : COLOR.blue,
        titleSize: 14,
        bodySize: 15,
        bodyLineHeight: 24,
      });
    });
    appendText(madrid, {
      characters: "↓",
      font: FONT.display,
      fontSize: 50,
      lineHeight: 58,
      color: COLOR.burgundy,
      width: 80,
      x: 680,
      y: 485,
    });
    createDiagramBox(madrid, {
      title: "REGISTRATION",
      body: "One clear action across channels",
      x: 470,
      y: 565,
      width: 500,
      height: 170,
      fill: COLOR.yellow,
    });
    appendText(madrid, {
      characters: "↓",
      font: FONT.display,
      fontSize: 50,
      lineHeight: 58,
      color: COLOR.burgundy,
      width: 80,
      x: 680,
      y: 755,
    });
    createDiagramBox(madrid, {
      title: "EVENT",
      body: "~110–125 attendees\nusual range ~70–80",
      x: 470,
      y: 835,
      width: 500,
      height: 230,
      fill: COLOR.sage,
      bodySize: 28,
      bodyLineHeight: 40,
    });
    appendText(madrid, {
      characters: "APPROXIMATE RECALLED ATTENDANCE · NO PRECISE UPLIFT CLAIM",
      font: FONT.medium,
      fontSize: 13,
      lineHeight: 20,
      color: COLOR.muted,
      width: 700,
      x: 430,
      y: 1110,
    });

    const other = createCaseBand(page, {
      name: "06 Other technical content",
      y: 4880,
      height: 850,
      fill: COLOR.paper,
    });
    addCaseHeading(
      other,
      "06",
      "AV Supports + Lumens",
      "Other technical-content evidence—not additional main mini-cases.",
    );
    createDiagramBox(other, {
      title: "AV SUPPORTS CATALOGUE",
      body: "Taxonomy + product categorization\nStructured product sheets\nTechnical-to-commercial content\nLayout + imagery selection\nSales enablement",
      x: 120,
      y: 245,
      width: 540,
      height: 450,
      fill: COLOR.blue,
    });
    createDiagramBox(other, {
      title: "LUMENS",
      body: "Technical source documentation\nAdaptation for a B2B audience\nFeature selection + organization\nPractical-use framing\nFinal communication piece",
      x: 780,
      y: 245,
      width: 540,
      height: 450,
      fill: COLOR.sage,
    });

    const outcomes = createCaseBand(page, {
      name: "07 Outcomes",
      y: 5730,
      height: 820,
      fill: "#203029",
    });
    addCaseHeading(outcomes, "07", "Outcomes", "Large typographic moments; figures remain qualified as approximate.", {
      ink: COLOR.white,
      muted: "#D9E2DE",
      accent: "#E5B3A4",
    });
    appendText(outcomes, {
      characters: "~24% → ~34%",
      font: FONT.displayBold,
      fontSize: 76,
      lineHeight: 84,
      color: "#F2E6B8",
      width: 640,
      x: 120,
      y: 300,
    });
    appendText(outcomes, {
      characters: "Email open rate\nApproximate · not an A/B test",
      fontSize: 18,
      lineHeight: 28,
      color: COLOR.white,
      width: 480,
      x: 120,
      y: 430,
    });
    appendText(outcomes, {
      characters: "~110–125",
      font: FONT.displayBold,
      fontSize: 86,
      lineHeight: 94,
      color: "#DDE7DC",
      width: 570,
      x: 770,
      y: 300,
    });
    appendText(outcomes, {
      characters: "Madrid attendees\nUsual range ~70–80 · approximate",
      fontSize: 18,
      lineHeight: 28,
      color: COLOR.white,
      width: 480,
      x: 770,
      y: 430,
    });

    const teams = createCaseBand(page, {
      name: "08 Working across teams",
      y: 6550,
      height: 1000,
      fill: "#F3EDE2",
    });
    addCaseHeading(
      teams,
      "08",
      "Working across teams",
      "A collaborative relationship—not a rigid waterfall or claimed fixed process.",
    );
    createDiagramBox(teams, {
      title: "ENGINEERING",
      body: "Technical accuracy\nProduct detail",
      x: 100,
      y: 250,
      width: 330,
      height: 220,
      fill: COLOR.blue,
    });
    createDiagramBox(teams, {
      title: "SALES",
      body: "Customer reality\nTarget needs",
      x: 100,
      y: 590,
      width: 330,
      height: 220,
      fill: COLOR.peach,
    });
    createDiagramBox(teams, {
      title: "ABI",
      body: "Content structure\nFraming + copy\nChannel execution",
      x: 555,
      y: 385,
      width: 330,
      height: 300,
      fill: COLOR.yellow,
      radius: 165,
      bodySize: 20,
      bodyLineHeight: 30,
    });
    createDiagramBox(teams, {
      title: "MANAGEMENT",
      body: "Business context\nFinal validation",
      x: 1010,
      y: 420,
      width: 330,
      height: 220,
      fill: COLOR.sage,
    });
    createConnectorBar(teams, {
      name: "Engineering to Abi",
      x: 420,
      y: 365,
      width: 180,
      rotation: 28,
    });
    createConnectorBar(teams, {
      name: "Sales to Abi",
      x: 420,
      y: 700,
      width: 185,
      rotation: -38,
    });
    createConnectorBar(teams, {
      name: "Abi to Management",
      x: 875,
      y: 535,
      width: 145,
    });
    appendText(teams, {
      characters: "ITERATIVE COLLABORATION AROUND TECHNICAL TRUTH, USER NEEDS AND BUSINESS CONTEXT",
      font: FONT.medium,
      fontSize: 13,
      lineHeight: 20,
      color: COLOR.muted,
      width: 900,
      x: 300,
      y: 875,
    });

    const learning = createCaseBand(page, {
      name: "09 Learning",
      y: 7550,
      height: 650,
      fill: COLOR.yellow,
    });
    addCaseHeading(
      learning,
      "09",
      "What I learned",
      "Working reflection—final voice requires Abi’s review.",
    );
    appendText(learning, {
      characters: "“Something can feel obviously better to you and the data can still disagree.”",
      font: FONT.display,
      fontSize: 46,
      lineHeight: 60,
      color: COLOR.ink,
      width: 1080,
      x: 180,
      y: 255,
    });
    appendText(learning, {
      characters: "A/B testing was adopted later. This sentence is a working idea, not final public copy.",
      fontSize: 18,
      lineHeight: 28,
      color: COLOR.muted,
      width: 900,
      x: 180,
      y: 465,
    });

    const evidence = createCaseBand(page, {
      name: "10 Optional external evidence",
      y: 8200,
      height: 400,
      fill: "#F8F4EC",
    });
    addCaseHeading(
      evidence,
      "10",
      "Optional external evidence",
      "Selected public links may support the final case. Company PDFs, newsletters and visual assets require a permission decision before reproduction.",
      { size: 44, lineHeight: 54, subtitleY: 115 },
    );
    appendText(evidence, {
      characters: "Turtle public page  ↗     Madrid Open Days article  ↗",
      font: FONT.medium,
      fontSize: 18,
      lineHeight: 28,
      color: COLOR.burgundy,
      width: 760,
      x: 180,
      y: 255,
    });
  });

  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Created the imaginArt case-study structure exploration.");
}

function addSynthesisLabel(parent, characters, x, y, width = 520) {
  return appendText(parent, {
    characters,
    font: FONT.montserratMedium,
    fontSize: 14,
    lineHeight: 22,
    color: SYNTHESIS_COLOR.green,
    width,
    x,
    y,
  });
}

function createTypographyComparison(parent, x, y) {
  const board = createCanvasFrame(parent, {
    name: "Direction D — typography comparison",
    x,
    y,
    width: 720,
    height: 1380,
    fill: SYNTHESIS_COLOR.warmWhite,
    stroke: SYNTHESIS_COLOR.line,
    radius: 24,
  });
  addSynthesisLabel(board, "TYPE COMPARISON · WORKING DECISION", 48, 48, 600);
  appendText(board, {
    characters: "A cleaner voice",
    font: FONT.montserratBold,
    fontSize: 52,
    lineHeight: 62,
    color: SYNTHESIS_COLOR.ink,
    width: 610,
    x: 48,
    y: 98,
  });
  appendText(board, {
    characters:
      "Both options keep the strong H1 / H2 / body contrast Abi liked. The comparison tests rhythm and readability—not final copy.",
    fontSize: 20,
    lineHeight: 31,
    color: SYNTHESIS_COLOR.muted,
    width: 610,
    x: 48,
    y: 185,
  });
  createRule(board, { x: 48, y: 310, width: 624, color: SYNTHESIS_COLOR.line });
  addSynthesisLabel(board, "OPTION 1 · PROVISIONALLY SELECTED", 48, 350, 600);
  appendText(board, {
    characters: "Montserrat + Inter",
    font: FONT.montserratBold,
    fontSize: 40,
    lineHeight: 50,
    color: SYNTHESIS_COLOR.ink,
    width: 610,
    x: 48,
    y: 396,
  });
  appendText(board, {
    characters: "Clear structure, human rhythm",
    font: FONT.montserratMedium,
    fontSize: 25,
    lineHeight: 36,
    color: SYNTHESIS_COLOR.green,
    width: 610,
    x: 48,
    y: 465,
  });
  appendText(board, {
    characters:
      "Montserrat gives headings and navigation a clean, confident shape. Inter keeps longer narrative text calm and easy to scan.",
    font: FONT.regular,
    fontSize: 21,
    lineHeight: 34,
    color: SYNTHESIS_COLOR.ink,
    width: 610,
    x: 48,
    y: 535,
  });
  createPill(board, {
    label: "Recommended for Direction D",
    x: 48,
    y: 690,
    width: 300,
    fill: SYNTHESIS_COLOR.greenSoft,
    stroke: SYNTHESIS_COLOR.greenSoft,
    color: SYNTHESIS_COLOR.ink,
  });
  createRule(board, { x: 48, y: 790, width: 624, color: SYNTHESIS_COLOR.line });
  addSynthesisLabel(board, "OPTION 2", 48, 830, 600);
  appendText(board, {
    characters: "Montserrat throughout",
    font: FONT.montserratBold,
    fontSize: 40,
    lineHeight: 50,
    color: SYNTHESIS_COLOR.ink,
    width: 610,
    x: 48,
    y: 876,
  });
  appendText(board, {
    characters: "Consistent, geometric, more insistent",
    font: FONT.montserratMedium,
    fontSize: 25,
    lineHeight: 36,
    color: SYNTHESIS_COLOR.green,
    width: 610,
    x: 48,
    y: 945,
  });
  appendText(board, {
    characters:
      "The single-family system feels cohesive, but longer paragraphs become more geometric and slightly less relaxed.",
    font: FONT.montserrat,
    fontSize: 21,
    lineHeight: 34,
    color: SYNTHESIS_COLOR.ink,
    width: 610,
    x: 48,
    y: 1015,
  });
  appendText(board, {
    characters:
      "Decision to validate with Abi: retain Option 1, or choose the more uniform Option 2 after reading real case-study copy.",
    fontSize: 17,
    lineHeight: 28,
    color: SYNTHESIS_COLOR.muted,
    width: 610,
    x: 48,
    y: 1195,
  });
  return board;
}

function createDirectionDHomepage(parent, x, y) {
  const frame = createCanvasFrame(parent, {
    name: "Home D — Clean Organic Editorial",
    x,
    y,
    width: 1440,
    height: 3400,
    fill: SYNTHESIS_COLOR.warmWhite,
  });

  appendText(frame, {
    characters: "ABI CARIDE",
    font: FONT.montserratBold,
    fontSize: 17,
    lineHeight: 24,
    color: SYNTHESIS_COLOR.ink,
    width: 220,
    x: 80,
    y: 46,
  });
  for (const [label, itemX] of [["Work", 1010], ["About", 1120], ["Contact", 1235]]) {
    appendText(frame, {
      characters: label,
      font: FONT.montserratMedium,
      fontSize: 15,
      lineHeight: 24,
      color: SYNTHESIS_COLOR.ink,
      width: 100,
      x: itemX,
      y: 46,
    });
  }
  createRule(frame, { x: 80, y: 96, width: 1280, color: SYNTHESIS_COLOR.line });
  createPill(frame, {
    label: "D — Clean Organic Editorial",
    x: 80,
    y: 130,
    width: 310,
    fill: SYNTHESIS_COLOR.greenSoft,
    stroke: SYNTHESIS_COLOR.greenSoft,
    color: SYNTHESIS_COLOR.ink,
  });
  addSynthesisLabel(frame, "DESKTOP SYNTHESIS · WORKING COPY · NOT APPROVED", 920, 142, 440);

  addSynthesisLabel(frame, "CONTENT STRATEGY · COMMUNICATIONS · CONTENT", 80, 250, 650);
  appendText(frame, {
    characters: "Clear thinking,\nmade human.",
    font: FONT.montserratBold,
    fontSize: 82,
    lineHeight: 92,
    color: SYNTHESIS_COLOR.ink,
    width: 760,
    x: 80,
    y: 300,
  });
  appendText(frame, {
    characters:
      "Working positioning: I turn complex information into clear, useful content for people and organizations.",
    fontSize: 25,
    lineHeight: 39,
    color: SYNTHESIS_COLOR.ink,
    width: 620,
    x: 80,
    y: 515,
  });
  createPill(frame, {
    label: "Get in touch  ↗",
    x: 80,
    y: 665,
    width: 210,
    height: 56,
    fill: SYNTHESIS_COLOR.green,
    stroke: SYNTHESIS_COLOR.green,
    color: SYNTHESIS_COLOR.white,
    fontSize: 17,
    lineHeight: 24,
  });
  createEllipse(frame, {
    name: "Hero pink organic accent",
    x: 915,
    y: 210,
    width: 420,
    height: 610,
    fill: SYNTHESIS_COLOR.pinkSoft,
  });
  const photo = createCanvasFrame(frame, {
    name: "Preferred real portrait — working placement",
    x: 955,
    y: 245,
    width: 350,
    height: 540,
    fill: SYNTHESIS_COLOR.blueSoft,
    stroke: SYNTHESIS_COLOR.line,
    radius: 175,
  });
  addSynthesisLabel(photo, "REAL PHOTO · NO RETOUCH", 34, 38, 280);
  appendText(photo, {
    characters: "Close portrait\nCurly hair + glasses\nBurgundy top",
    font: FONT.montserratMedium,
    fontSize: 24,
    lineHeight: 35,
    color: SYNTHESIS_COLOR.ink,
    width: 275,
    x: 34,
    y: 350,
  });
  createEllipse(frame, {
    name: "Hero green detail",
    x: 860,
    y: 690,
    width: 118,
    height: 82,
    fill: SYNTHESIS_COLOR.greenSoft,
  });

  createRule(frame, { x: 80, y: 890, width: 1280, color: SYNTHESIS_COLOR.line });
  addSynthesisLabel(frame, "01 · LEAD PROFESSIONAL WORK", 80, 945, 400);
  appendText(frame, {
    characters: "Making specialist B2B\ncontent clearer",
    font: FONT.montserratBold,
    fontSize: 57,
    lineHeight: 68,
    color: SYNTHESIS_COLOR.ink,
    width: 760,
    x: 80,
    y: 995,
  });
  appendText(frame, {
    characters:
      "imaginArt · Product content, editorial email and event communication",
    font: FONT.montserratMedium,
    fontSize: 18,
    lineHeight: 29,
    color: SYNTHESIS_COLOR.green,
    width: 650,
    x: 80,
    y: 1160,
  });
  appendText(frame, {
    characters:
      "One professional story about turning technical and business information into communication a specialist audience can use.",
    fontSize: 22,
    lineHeight: 34,
    color: SYNTHESIS_COLOR.ink,
    width: 600,
    x: 80,
    y: 1230,
  });
  const leadVisual = createCanvasFrame(frame, {
    name: "Lead-case transformation diagram",
    x: 820,
    y: 1010,
    width: 540,
    height: 430,
    fill: SYNTHESIS_COLOR.warmWhite,
  });
  createEllipse(leadVisual, {
    name: "Technical input",
    x: 30,
    y: 30,
    width: 190,
    height: 125,
    fill: SYNTHESIS_COLOR.blueSoft,
  });
  createEllipse(leadVisual, {
    name: "Useful communication",
    x: 305,
    y: 245,
    width: 205,
    height: 145,
    fill: SYNTHESIS_COLOR.greenSoft,
  });
  appendText(leadVisual, {
    characters: "TECHNICAL\nINPUT",
    font: FONT.montserratBold,
    fontSize: 16,
    lineHeight: 23,
    color: SYNTHESIS_COLOR.ink,
    width: 140,
    x: 58,
    y: 67,
  });
  appendText(leadVisual, {
    characters: "structure + framing",
    font: FONT.montserratMedium,
    fontSize: 18,
    lineHeight: 27,
    color: SYNTHESIS_COLOR.green,
    width: 220,
    x: 175,
    y: 185,
  });
  appendText(leadVisual, {
    characters: "USEFUL B2B\nCOMMUNICATION",
    font: FONT.montserratBold,
    fontSize: 16,
    lineHeight: 23,
    color: SYNTHESIS_COLOR.ink,
    width: 170,
    x: 330,
    y: 292,
  });
  appendText(frame, {
    characters: "View case study  ↗",
    font: FONT.montserratMedium,
    fontSize: 17,
    lineHeight: 26,
    color: SYNTHESIS_COLOR.green,
    width: 260,
    x: 80,
    y: 1395,
  });

  createRule(frame, { x: 80, y: 1530, width: 1280, color: SYNTHESIS_COLOR.line });
  addSynthesisLabel(frame, "02 · SELECTED EARLIER WORK", 80, 1580, 400);
  const secondaryRows = [
    ["Website analysis", "Content review · structure · recommendations"],
    ["Error messages", "UX writing · clarity · recovery"],
  ];
  secondaryRows.forEach(([title, meta], index) => {
    const rowY = 1660 + index * 205;
    const titleX = index === 0 ? 80 : 230;
    appendText(frame, {
      characters: `0${index + 2}`,
      font: FONT.montserratMedium,
      fontSize: 17,
      lineHeight: 26,
      color: SYNTHESIS_COLOR.green,
      width: 70,
      x: titleX,
      y: rowY + 13,
    });
    appendText(frame, {
      characters: title,
      font: FONT.montserratBold,
      fontSize: 40,
      lineHeight: 50,
      color: SYNTHESIS_COLOR.ink,
      width: 600,
      x: titleX + 80,
      y: rowY,
    });
    appendText(frame, {
      characters: meta,
      fontSize: 18,
      lineHeight: 28,
      color: SYNTHESIS_COLOR.muted,
      width: 410,
      x: 920,
      y: rowY + 10,
    });
    createRule(frame, {
      x: titleX,
      y: rowY + 120,
      width: 1360 - titleX,
      color: SYNTHESIS_COLOR.line,
    });
  });

  addSynthesisLabel(frame, "ABOUT · WORKING POSITIONING", 80, 2190, 400);
  appendText(frame, {
    characters: "Curious about the detail.\nFocused on the person reading.",
    font: FONT.montserratBold,
    fontSize: 52,
    lineHeight: 64,
    color: SYNTHESIS_COLOR.ink,
    width: 850,
    x: 80,
    y: 2245,
  });
  appendText(frame, {
    characters: HOMEPAGE.about,
    fontSize: 22,
    lineHeight: 35,
    color: SYNTHESIS_COLOR.ink,
    width: 650,
    x: 600,
    y: 2440,
  });
  createEllipse(frame, {
    name: "About blue accent",
    x: 85,
    y: 2450,
    width: 330,
    height: 155,
    fill: SYNTHESIS_COLOR.blueSoft,
  });
  appendText(frame, {
    characters: "natural · approachable · calm",
    font: FONT.montserratMedium,
    fontSize: 17,
    lineHeight: 26,
    color: SYNTHESIS_COLOR.ink,
    width: 280,
    x: 112,
    y: 2512,
  });

  createRule(frame, { x: 80, y: 2815, width: 1280, color: SYNTHESIS_COLOR.line });
  createEllipse(frame, {
    name: "CTA pink detail",
    x: 80,
    y: 2890,
    width: 160,
    height: 110,
    fill: SYNTHESIS_COLOR.pinkSoft,
  });
  appendText(frame, {
    characters: "Have something complex\nthat needs clarity?",
    font: FONT.montserratBold,
    fontSize: 52,
    lineHeight: 64,
    color: SYNTHESIS_COLOR.ink,
    width: 820,
    x: 170,
    y: 2920,
  });
  createPill(frame, {
    label: "Let’s talk  ↗",
    x: 1090,
    y: 2960,
    width: 220,
    height: 58,
    fill: SYNTHESIS_COLOR.green,
    stroke: SYNTHESIS_COLOR.green,
    color: SYNTHESIS_COLOR.white,
    fontSize: 18,
    lineHeight: 26,
  });
  appendText(frame, {
    characters:
      "CONTROLLED ASYMMETRY\nUnequal hero columns · offset secondary rows · editorial image placement\n\nSELECTIVE SHAPES\nPortrait arch · three small organic accents · pill CTAs—not rounded cards everywhere",
    fontSize: 15,
    lineHeight: 24,
    color: SYNTHESIS_COLOR.muted,
    width: 900,
    x: 80,
    y: 3205,
  });
  return frame;
}

async function buildDirectionD() {
  if (figma.editorType !== "figma") {
    throw new Error("Direction D can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.foundations);
  if (!normalizeName(figma.currentPage.name).includes("explorations")) {
    throw new Error(
      `Open the Explorations page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }
  ensureNoExisting(GENERATED_KIND.directionD);
  const anchor = requireSingleAnchor();
  const point = insertionPoint(anchor);
  await loadSynthesisFonts();

  const section = createSection(
    "D — Clean Organic Editorial",
    point,
    2540,
    3730,
    SYNTHESIS_COLOR.canvas,
    GENERATED_KIND.directionD,
  );
  populateSectionSafely(section, () => {
    appendText(section, {
      characters: "V2 — SYNTHESIS DIRECTION",
      font: FONT.montserratBold,
      fontSize: 28,
      lineHeight: 38,
      color: SYNTHESIS_COLOR.ink,
      width: 800,
      x: 100,
      y: 52,
    });
    appendText(section, {
      characters:
        "A’s calm + B’s intentional asymmetry + C’s rounded accents and strong type hierarchy. One synthesis for Abi’s next review—not a finished homepage.",
      fontSize: 19,
      lineHeight: 30,
      color: SYNTHESIS_COLOR.muted,
      width: 1700,
      x: 100,
      y: 96,
    });
    createTypographyComparison(section, 100, 190);
    createDirectionDHomepage(section, 900, 190);
  });
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Created Direction D beside the selected A/B/C exploration section.");
}

function createEditorialCaseHeading(band, number, title, metadata, subtitle) {
  addSynthesisLabel(band, number, 80, 62, 80);
  appendText(band, {
    characters: title,
    font: FONT.montserratBold,
    fontSize: 50,
    lineHeight: 61,
    color: SYNTHESIS_COLOR.ink,
    width: 1020,
    x: 180,
    y: 48,
  });
  if (metadata) {
    appendText(band, {
      characters: metadata,
      font: FONT.montserratMedium,
      fontSize: 16,
      lineHeight: 25,
      color: SYNTHESIS_COLOR.green,
      width: 1060,
      x: 180,
      y: 122,
    });
  }
  if (subtitle) {
    appendText(band, {
      characters: subtitle,
      fontSize: 19,
      lineHeight: 30,
      color: SYNTHESIS_COLOR.muted,
      width: 1020,
      x: 180,
      y: 165,
    });
  }
}

function createEditorialColumn(parent, options) {
  createRule(parent, {
    x: options.x,
    y: options.y,
    width: options.width,
    color: options.color || SYNTHESIS_COLOR.line,
  });
  appendText(parent, {
    characters: options.label,
    font: FONT.montserratBold,
    fontSize: 15,
    lineHeight: 23,
    color: SYNTHESIS_COLOR.green,
    width: options.width,
    x: options.x,
    y: options.y + 26,
  });
  appendText(parent, {
    characters: options.body,
    fontSize: options.bodySize || 19,
    lineHeight: options.lineHeight || 30,
    color: SYNTHESIS_COLOR.ink,
    width: options.width,
    x: options.x,
    y: options.y + 75,
  });
}

async function buildImaginartReframed() {
  if (figma.editorType !== "figma") {
    throw new Error("The reframed imaginArt exploration can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  if (!normalizeName(figma.currentPage.name).includes("case studies")) {
    throw new Error(
      `Open the Case Studies page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }
  ensureNoExisting(GENERATED_KIND.imaginartReframed);
  const anchor = requireSingleAnchor();
  const point = insertionPoint(anchor);
  await loadSynthesisFonts();

  const section = createSection(
    "imaginArt — Reframed Editorial Exploration",
    point,
    1740,
    9020,
    SYNTHESIS_COLOR.canvas,
    GENERATED_KIND.imaginartReframed,
  );
  populateSectionSafely(section, () => {
    appendText(section, {
      characters:
        "DIRECTION D · WORKING COPY · ORIGINAL DIAGRAMS\nDetailed factual and evidence blueprint: docs/content/case-study-imaginart.md",
      font: FONT.montserratMedium,
      fontSize: 16,
      lineHeight: 25,
      color: SYNTHESIS_COLOR.muted,
      width: 1300,
      x: 150,
      y: 54,
    });
    const page = createCanvasFrame(section, {
      name: "imaginArt — Reframed Editorial Exploration",
      x: 150,
      y: 130,
      width: 1440,
      height: 8730,
      fill: SYNTHESIS_COLOR.warmWhite,
    });

    const hero = createCaseBand(page, { name: "01 Hero", y: 0, height: 760, fill: SYNTHESIS_COLOR.warmWhite });
    addSynthesisLabel(hero, "LEAD PROFESSIONAL CASE · WORKING NARRATIVE", 80, 70, 700);
    appendText(hero, {
      characters: "Making specialist B2B\ncommunication clearer",
      font: FONT.montserratBold,
      fontSize: 72,
      lineHeight: 84,
      color: SYNTHESIS_COLOR.ink,
      width: 900,
      x: 80,
      y: 145,
    });
    appendText(hero, {
      characters: "imaginArt · B2B content & communications",
      font: FONT.montserratMedium,
      fontSize: 22,
      lineHeight: 32,
      color: SYNTHESIS_COLOR.green,
      width: 700,
      x: 80,
      y: 355,
    });
    appendText(hero, {
      characters:
        "Communications Specialist · 2023–Present\nProduct content · editorial email · event communication",
      fontSize: 20,
      lineHeight: 32,
      color: SYNTHESIS_COLOR.ink,
      width: 700,
      x: 80,
      y: 420,
    });
    createEllipse(hero, { name: "Hero green form", x: 1010, y: 120, width: 300, height: 450, fill: SYNTHESIS_COLOR.greenSoft });
    createEllipse(hero, { name: "Hero blue form", x: 890, y: 410, width: 220, height: 150, fill: SYNTHESIS_COLOR.blueSoft });
    appendText(hero, {
      characters: "TECHNICAL TRUTH\n↓\nSTRUCTURE + VOICE\n↓\nUSEFUL ACTION",
      font: FONT.montserratBold,
      fontSize: 18,
      lineHeight: 32,
      color: SYNTHESIS_COLOR.ink,
      width: 240,
      x: 1040,
      y: 235,
    });
    createRule(hero, { x: 80, y: 685, width: 1280, color: SYNTHESIS_COLOR.line });

    const context = createCaseBand(page, { name: "02 Context and role", y: 760, height: 700, fill: SYNTHESIS_COLOR.warmWhite });
    createEditorialCaseHeading(
      context,
      "02",
      "Working between expertise and action",
      "CONTEXT + ROLE",
      "Technical accuracy, customer usefulness and business action had to coexist across channels.",
    );
    createEditorialColumn(context, { x: 180, y: 285, width: 310, label: "ENGINEERING", body: "Technical truth\nProduct detail" });
    createEditorialColumn(context, { x: 565, y: 285, width: 310, label: "ABI", body: "Content structure\nFraming + copy\nChannel execution" });
    createEditorialColumn(context, { x: 950, y: 285, width: 310, label: "SALES + MANAGEMENT", body: "Customer reality\nBusiness context\nFinal validation" });
    appendText(context, {
      characters: "An iterative collaboration—not a claimed rigid waterfall.",
      fontSize: 17,
      lineHeight: 27,
      color: SYNTHESIS_COLOR.muted,
      width: 700,
      x: 565,
      y: 545,
    });

    const turtle = createCaseBand(page, { name: "03 Launching a new brand in Spain", y: 1460, height: 1120, fill: SYNTHESIS_COLOR.white });
    createEditorialCaseHeading(
      turtle,
      "03",
      "Launching a new brand in Spain",
      "TURTLE AV · IMAGINART",
      "Technical product information became a usable B2B content sequence. Abi structured the page herself.",
    );
    createEditorialColumn(turtle, { x: 100, y: 300, width: 340, label: "RAW TECHNICAL INPUT", body: "4K · Dante · AES67\nPoE · HDR · latency\nRedundancy · compatibility", bodySize: 18 });
    createEditorialColumn(turtle, { x: 550, y: 300, width: 340, label: "CONTENT QUESTIONS", body: "What is it?\nWhy does it matter?\nWhich solution fits?\nWhere can it be used?\nWhat happens next?", bodySize: 18 });
    createEditorialColumn(turtle, { x: 1000, y: 300, width: 340, label: "STRUCTURED PRODUCT CONTENT", body: "Value proposition\nBenefits\nSolutions\nTechnical detail\nApplications\nContact CTA", bodySize: 18 });
    appendText(turtle, { characters: "→", font: FONT.montserratBold, fontSize: 42, lineHeight: 50, color: SYNTHESIS_COLOR.green, width: 60, x: 470, y: 440 });
    appendText(turtle, { characters: "→", font: FONT.montserratBold, fontSize: 42, lineHeight: 50, color: SYNTHESIS_COLOR.green, width: 60, x: 920, y: 440 });
    createEllipse(turtle, { name: "Turtle supporting accent", x: 100, y: 780, width: 180, height: 110, fill: SYNTHESIS_COLOR.blueSoft });
    appendText(turtle, {
      characters: "CONTENT ARCHITECTURE\nTechnical-to-usable B2B content",
      font: FONT.montserratMedium,
      fontSize: 20,
      lineHeight: 31,
      color: SYNTHESIS_COLOR.ink,
      width: 600,
      x: 220,
      y: 800,
    });
    appendText(turtle, {
      characters: "Original explanatory diagram · not a recreation of imaginArt artwork",
      fontSize: 16,
      lineHeight: 25,
      color: SYNTHESIS_COLOR.muted,
      width: 600,
      x: 740,
      y: 835,
    });

    const email = createCaseBand(page, { name: "04 Refreshing a specialist B2B newsletter", y: 2580, height: 1180, fill: SYNTHESIS_COLOR.warmWhite });
    createEditorialCaseHeading(
      email,
      "04",
      "Refreshing a specialist B2B newsletter",
      "MUNDO BRIGHTSIGN",
      "A combined editorial revision: closer professional tone, emoji-led subject and CTA above the fold.",
    );
    createEditorialColumn(email, { x: 150, y: 310, width: 430, label: "EARLIER APPROACH", body: "Subject\nIntro\nContent\nContent\nCTA", bodySize: 20, lineHeight: 37 });
    createEditorialColumn(email, { x: 650, y: 310, width: 430, label: "REVISED APPROACH", body: "Emoji + revised subject\nCloser professional tone\nCTA above the fold\nContent\nAdditional content", bodySize: 20, lineHeight: 37 });
    appendText(email, { characters: "~24%", font: FONT.montserratBold, fontSize: 62, lineHeight: 72, color: SYNTHESIS_COLOR.ink, width: 280, x: 160, y: 720 });
    appendText(email, { characters: "→", font: FONT.montserratBold, fontSize: 52, lineHeight: 62, color: SYNTHESIS_COLOR.green, width: 100, x: 505, y: 725 });
    appendText(email, { characters: "~34%", font: FONT.montserratBold, fontSize: 62, lineHeight: 72, color: SYNTHESIS_COLOR.green, width: 300, x: 650, y: 720 });
    appendText(email, {
      characters:
        "Approximate recalled open rates · observed after the combined revision · NOT an A/B test · no single change is presented as causal",
      fontSize: 17,
      lineHeight: 27,
      color: SYNTHESIS_COLOR.muted,
      width: 1030,
      x: 160,
      y: 835,
    });
    createRule(email, { x: 160, y: 975, width: 1120, color: SYNTHESIS_COLOR.line });
    appendText(email, {
      characters: "Working story: a more intentional hierarchy and editorial voice preceded a stronger observed open rate.",
      font: FONT.montserratMedium,
      fontSize: 21,
      lineHeight: 33,
      color: SYNTHESIS_COLOR.ink,
      width: 1000,
      x: 160,
      y: 1020,
    });

    const event = createCaseBand(page, { name: "05 Planning and promoting a corporate event", y: 3760, height: 1200, fill: SYNTHESIS_COLOR.white });
    createEditorialCaseHeading(
      event,
      "05",
      "Planning and promoting a corporate event",
      "IMAGINART · MADRID OPEN DAYS 2026",
      "One communication objective carried across web, email, registration, Canva imagery and LinkedIn content.",
    );
    createEllipse(event, { name: "Event objective", x: 100, y: 320, width: 250, height: 160, fill: SYNTHESIS_COLOR.pinkSoft });
    appendText(event, { characters: "EVENT\nOBJECTIVE", font: FONT.montserratBold, fontSize: 19, lineHeight: 29, color: SYNTHESIS_COLOR.ink, width: 180, x: 142, y: 370 });
    appendText(event, { characters: "→", font: FONT.montserratBold, fontSize: 42, lineHeight: 50, color: SYNTHESIS_COLOR.green, width: 70, x: 395, y: 370 });
    createEditorialColumn(event, { x: 500, y: 320, width: 330, label: "CAMPAIGN SYSTEM", body: "Mailing design + copy\nWeb invitation / post\nRegistration form\nCanva imagery\nLinkedIn content input", bodySize: 18 });
    appendText(event, { characters: "→", font: FONT.montserratBold, fontSize: 42, lineHeight: 50, color: SYNTHESIS_COLOR.green, width: 70, x: 865, y: 370 });
    createEllipse(event, { name: "Attendance outcome", x: 980, y: 305, width: 300, height: 190, fill: SYNTHESIS_COLOR.greenSoft });
    appendText(event, { characters: "REGISTRATION\n↓\nEVENT", font: FONT.montserratBold, fontSize: 19, lineHeight: 31, color: SYNTHESIS_COLOR.ink, width: 190, x: 1038, y: 345 });
    appendText(event, { characters: "~110–125", font: FONT.montserratBold, fontSize: 64, lineHeight: 74, color: SYNTHESIS_COLOR.green, width: 430, x: 170, y: 750 });
    appendText(event, { characters: "attendees", font: FONT.montserratMedium, fontSize: 22, lineHeight: 32, color: SYNTHESIS_COLOR.ink, width: 250, x: 180, y: 830 });
    appendText(event, { characters: "vs usual ~70–80", font: FONT.montserratBold, fontSize: 38, lineHeight: 48, color: SYNTHESIS_COLOR.ink, width: 500, x: 700, y: 775 });
    appendText(event, {
      characters: "Approximate recalled ranges · no precise uplift or causal claim",
      fontSize: 17,
      lineHeight: 27,
      color: SYNTHESIS_COLOR.muted,
      width: 850,
      x: 700,
      y: 845,
    });
    appendText(event, {
      characters: "Bilbao supports repeat event-communication evidence and a conversion-oriented information structure.",
      fontSize: 17,
      lineHeight: 27,
      color: SYNTHESIS_COLOR.muted,
      width: 1050,
      x: 180,
      y: 1020,
    });

    const support = createCaseBand(page, { name: "06 Supporting technical-content evidence", y: 4960, height: 1140, fill: SYNTHESIS_COLOR.warmWhite });
    createEditorialCaseHeading(
      support,
      "06",
      "Other ways I worked with technical content",
      "SUPPORTING EVIDENCE · NOT ADDITIONAL MAIN MINI-CASES",
      "Two compact examples extend the same content-design pattern without competing with the three primary stories.",
    );
    createEditorialColumn(support, {
      x: 180,
      y: 330,
      width: 500,
      label: "STRUCTURING A 19-PAGE TECHNICAL PRODUCT CATALOGUE",
      body: "AV Supports Catalogue\n\nInformation architecture · taxonomy and product categorization · structured product sheets · technical-to-commercial content · layout and imagery selection · sales enablement",
      bodySize: 18,
      lineHeight: 30,
    });
    createEditorialColumn(support, {
      x: 780,
      y: 330,
      width: 500,
      label: "ADAPTING TECHNICAL PRODUCT INFORMATION FOR A B2B AUDIENCE",
      body: "Lumens\n\nSource technical documentation · feature selection and organization · practical-use framing · final communication piece. Adaptation, not merely translation.",
      bodySize: 18,
      lineHeight: 30,
    });
    createEllipse(support, { name: "Supporting pink accent", x: 120, y: 815, width: 150, height: 95, fill: SYNTHESIS_COLOR.pinkSoft });
    appendText(support, {
      characters: "CONTENT SYSTEMS THINKING\nRepeated structures and clear categories across a large, related content set.",
      font: FONT.montserratMedium,
      fontSize: 20,
      lineHeight: 32,
      color: SYNTHESIS_COLOR.ink,
      width: 850,
      x: 230,
      y: 830,
    });

    const outcomes = createCaseBand(page, { name: "07 Outcomes", y: 6100, height: 760, fill: SYNTHESIS_COLOR.white });
    createEditorialCaseHeading(outcomes, "07", "Observed outcomes", "APPROXIMATE WORKING EVIDENCE", "Large metric moments, with the evidence limits kept visible.");
    appendText(outcomes, { characters: "~24% → ~34%", font: FONT.montserratBold, fontSize: 62, lineHeight: 72, color: SYNTHESIS_COLOR.green, width: 520, x: 180, y: 315 });
    appendText(outcomes, { characters: "Mundo BrightSign open rate", fontSize: 18, lineHeight: 28, color: SYNTHESIS_COLOR.ink, width: 430, x: 180, y: 400 });
    appendText(outcomes, { characters: "~110–125", font: FONT.montserratBold, fontSize: 62, lineHeight: 72, color: SYNTHESIS_COLOR.green, width: 430, x: 800, y: 315 });
    appendText(outcomes, { characters: "Madrid attendees vs usual ~70–80", fontSize: 18, lineHeight: 28, color: SYNTHESIS_COLOR.ink, width: 450, x: 800, y: 400 });
    createRule(outcomes, { x: 180, y: 515, width: 1080, color: SYNTHESIS_COLOR.line });
    appendText(outcomes, {
      characters: "Both figures are approximate and recalled by Abi. They are not audited data. The email result was not an A/B test.",
      fontSize: 17,
      lineHeight: 27,
      color: SYNTHESIS_COLOR.muted,
      width: 1050,
      x: 180,
      y: 555,
    });

    const teams = createCaseBand(page, { name: "08 Working across teams", y: 6860, height: 900, fill: SYNTHESIS_COLOR.warmWhite });
    createEditorialCaseHeading(teams, "08", "Working across teams", "COLLABORATION", "Abi operated between technical knowledge, audience needs and business constraints.");
    createEllipse(teams, { name: "Engineering", x: 150, y: 330, width: 250, height: 170, fill: SYNTHESIS_COLOR.blueSoft });
    createEllipse(teams, { name: "Abi", x: 590, y: 300, width: 280, height: 240, fill: SYNTHESIS_COLOR.greenSoft });
    createEllipse(teams, { name: "Sales and management", x: 1040, y: 330, width: 250, height: 170, fill: SYNTHESIS_COLOR.pinkSoft });
    appendText(teams, { characters: "ENGINEERING\nTechnical truth", font: FONT.montserratBold, fontSize: 17, lineHeight: 27, color: SYNTHESIS_COLOR.ink, width: 190, x: 182, y: 385 });
    appendText(teams, { characters: "ABI\nStructure · framing\ncopy · execution", font: FONT.montserratBold, fontSize: 17, lineHeight: 27, color: SYNTHESIS_COLOR.ink, width: 210, x: 630, y: 360 });
    appendText(teams, { characters: "SALES + MANAGEMENT\nCustomer + business", font: FONT.montserratBold, fontSize: 16, lineHeight: 26, color: SYNTHESIS_COLOR.ink, width: 210, x: 1060, y: 385 });
    createRule(teams, { x: 400, y: 415, width: 190, color: SYNTHESIS_COLOR.green });
    createRule(teams, { x: 870, y: 415, width: 170, color: SYNTHESIS_COLOR.green });
    appendText(teams, {
      characters: "The diagram communicates collaboration, not a fixed sequence that the evidence cannot support.",
      fontSize: 17,
      lineHeight: 27,
      color: SYNTHESIS_COLOR.muted,
      width: 850,
      x: 300,
      y: 650,
    });

    const learning = createCaseBand(page, { name: "09 Learning", y: 7760, height: 570, fill: SYNTHESIS_COLOR.white });
    createEditorialCaseHeading(learning, "09", "A useful reminder", "LEARNING · WORKING VOICE", "Final first-person voice still requires Abi’s review.");
    appendText(learning, {
      characters: "“Something can feel obviously better to you and the data can still disagree.”",
      font: FONT.montserratBold,
      fontSize: 34,
      lineHeight: 47,
      color: SYNTHESIS_COLOR.ink,
      width: 1040,
      x: 180,
      y: 285,
    });
    appendText(learning, { characters: "A/B testing was adopted later. This is working copy—not a claim about Mundo BrightSign.", fontSize: 17, lineHeight: 27, color: SYNTHESIS_COLOR.muted, width: 1000, x: 180, y: 415 });

    const evidence = createCaseBand(page, { name: "10 Evidence note", y: 8330, height: 400, fill: SYNTHESIS_COLOR.warmWhite });
    createEditorialCaseHeading(
      evidence,
      "10",
      "Evidence before polish",
      "INTERNAL DESIGN EXPLORATION",
      "Detailed facts, ownership, reuse limits and publication constraints live in docs/content/case-study-imaginart.md. This Figma brief intentionally does not duplicate the full blueprint.",
    );
    appendText(evidence, {
      characters: "Next: Abi reviews the public voice, story order and which source links or company assets—if any—can appear.",
      font: FONT.montserratMedium,
      fontSize: 17,
      lineHeight: 27,
      color: SYNTHESIS_COLOR.green,
      width: 1050,
      x: 180,
      y: 285,
    });
  });

  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Created the reframed imaginArt editorial exploration beside the selected anchor.");
}

function addFinalLabel(parent, characters, x, y, width = 520) {
  return appendText(parent, {
    characters,
    font: FONT.medium,
    fontSize: 14,
    lineHeight: 22,
    color: SYNTHESIS_COLOR.green,
    width,
    x,
    y,
  });
}

function addFinalHeading(parent, options) {
  return appendText(parent, {
    ...options,
    font: options.font || FONT.semibold,
    color: options.color || SYNTHESIS_COLOR.ink,
  });
}

function addFinalBody(parent, options) {
  return appendText(parent, {
    ...options,
    font: options.font || FONT.montserrat,
    color: options.color || SYNTHESIS_COLOR.ink,
  });
}

function createFinalCaseHeading(band, number, title, metadata, subtitle) {
  addFinalLabel(band, number, 80, 64, 80);
  addFinalHeading(band, {
    characters: title,
    fontSize: 50,
    lineHeight: 61,
    width: 1040,
    x: 180,
    y: 48,
  });
  if (metadata) {
    addFinalLabel(band, metadata, 180, 122, 1080);
  }
  if (subtitle) {
    addFinalBody(band, {
      characters: subtitle,
      fontSize: 19,
      lineHeight: 31,
      color: SYNTHESIS_COLOR.muted,
      width: 1020,
      x: 180,
      y: 166,
    });
  }
}

function createFinalColumn(parent, options) {
  createRule(parent, {
    x: options.x,
    y: options.y,
    width: options.width,
    color: options.color || SYNTHESIS_COLOR.line,
  });
  addFinalLabel(parent, options.label, options.x, options.y + 26, options.width);
  addFinalBody(parent, {
    characters: options.body,
    fontSize: options.bodySize || 19,
    lineHeight: options.lineHeight || 31,
    width: options.width,
    x: options.x,
    y: options.y + 75,
  });
}

function createFinalHomepage(parent, x, y, heroImageHash) {
  const page = createCanvasFrame(parent, {
    name: "Final homepage — desktop pre-production",
    x,
    y,
    width: 1440,
    height: 4260,
    fill: SYNTHESIS_COLOR.warmWhite,
  });

  addFinalHeading(page, {
    characters: "ABILENE CARIDE",
    fontSize: 16,
    lineHeight: 24,
    width: 260,
    x: 80,
    y: 46,
  });
  for (const [label, itemX] of [["Work", 1010], ["About", 1120], ["Contact", 1235]]) {
    addFinalBody(page, {
      characters: label,
      font: FONT.montserratMedium,
      fontSize: 15,
      lineHeight: 24,
      width: 100,
      x: itemX,
      y: 46,
    });
  }
  createRule(page, { x: 80, y: 96, width: 1280, color: SYNTHESIS_COLOR.line });

  addFinalLabel(page, "CONTENT STRATEGY · COMMUNICATIONS · CONTENT", 80, 160, 720);
  addFinalHeading(page, {
    characters: "I help companies connect with their audiences through clear, honest communication.",
    fontSize: 68,
    lineHeight: 78,
    width: 1120,
    x: 80,
    y: 210,
  });
  createPill(page, {
    label: "Get in touch  ↗",
    x: 80,
    y: 470,
    width: 200,
    height: 54,
    fill: SYNTHESIS_COLOR.green,
    stroke: SYNTHESIS_COLOR.green,
    color: SYNTHESIS_COLOR.white,
    fontSize: 16,
    lineHeight: 24,
  });
  createPill(page, {
    label: "View my work  ↓",
    x: 300,
    y: 470,
    width: 210,
    height: 54,
    fill: SYNTHESIS_COLOR.warmWhite,
    stroke: SYNTHESIS_COLOR.green,
    color: SYNTHESIS_COLOR.green,
    fontSize: 16,
    lineHeight: 24,
  });

  const photo = createCanvasFrame(page, {
    name: `Hero photograph — ${FINAL_HERO_PHOTO}`,
    x: 80,
    y: 590,
    width: 1280,
    height: 720,
    fill: SYNTHESIS_COLOR.greenSoft,
    radius: 16,
    clipsContent: true,
  });
  if (!applyImageFill(photo, heroImageHash)) {
    addFinalLabel(photo, "SOURCE PHOTO REQUIRED IN THIS FIGMA PAGE", 48, 48, 600);
    addFinalHeading(photo, {
      characters: FINAL_HERO_PHOTO,
      fontSize: 32,
      lineHeight: 42,
      width: 700,
      x: 48,
      y: 110,
    });
    addFinalBody(photo, {
      characters: "Large landscape crop · no retouching · no decorative portrait frame",
      fontSize: 18,
      lineHeight: 30,
      width: 720,
      x: 48,
      y: 210,
    });
  }

  const lead = createCanvasFrame(page, {
    name: "Lead work — imaginArt",
    x: 0,
    y: 1420,
    width: 1440,
    height: 720,
    fill: SYNTHESIS_COLOR.greenSoft,
  });
  addFinalLabel(lead, "01 · LEAD PROFESSIONAL WORK", 80, 72, 430);
  addFinalHeading(lead, {
    characters: "Making specialist B2B communication clearer",
    fontSize: 56,
    lineHeight: 67,
    width: 720,
    x: 80,
    y: 125,
  });
  addFinalBody(lead, {
    characters: "imaginArt · Product content, editorial email and event communication",
    font: FONT.montserratMedium,
    fontSize: 18,
    lineHeight: 30,
    color: SYNTHESIS_COLOR.green,
    width: 650,
    x: 80,
    y: 285,
  });
  addFinalBody(lead, {
    characters: "A professional story about translating technical and business information into useful, audience-aware communication across products, newsletters and events.",
    fontSize: 21,
    lineHeight: 35,
    width: 610,
    x: 80,
    y: 350,
  });
  createRule(lead, { x: 800, y: 150, width: 520, color: SYNTHESIS_COLOR.green });
  const leadItems = [
    ["01", "Editorial newsletter", "~24% → ~34% open rate · approximate"],
    ["02", "Turtle AV launch", "Technical input → usable B2B content"],
    ["03", "Madrid Open Days", "Campaign system · ~110–125 attendees"],
  ];
  leadItems.forEach(([number, title, meta], index) => {
    const itemY = 180 + index * 145;
    addFinalLabel(lead, number, 800, itemY, 60);
    addFinalHeading(lead, {
      characters: title,
      fontSize: 24,
      lineHeight: 32,
      width: 430,
      x: 880,
      y: itemY - 5,
    });
    addFinalBody(lead, {
      characters: meta,
      fontSize: 15,
      lineHeight: 24,
      color: SYNTHESIS_COLOR.muted,
      width: 430,
      x: 880,
      y: itemY + 42,
    });
    createRule(lead, { x: 800, y: itemY + 100, width: 520, color: SYNTHESIS_COLOR.line });
  });

  const secondary = createCanvasFrame(page, {
    name: "Secondary work — equal hierarchy",
    x: 0,
    y: 2140,
    width: 1440,
    height: 650,
    fill: SYNTHESIS_COLOR.warmWhite,
  });
  addFinalLabel(secondary, "02 · SELECTED EARLIER WORK", 80, 72, 430);
  const secondaryItems = [
    ["Secondary work — Website Analysis", "Website Analysis", "Content review · structure · recommendations", 80],
    ["Secondary work — Error Messages", "Error Messages", "UX writing · clarity · recovery", 740],
  ];
  secondaryItems.forEach(([name, title, meta, itemX]) => {
    const item = createCanvasFrame(secondary, {
      name,
      x: itemX,
      y: 150,
      width: 620,
      height: 350,
    });
    createRule(item, { x: 0, y: 0, width: 620, color: SYNTHESIS_COLOR.line });
    addFinalHeading(item, {
      characters: title,
      fontSize: 38,
      lineHeight: 48,
      width: 560,
      x: 0,
      y: 45,
    });
    addFinalBody(item, {
      characters: meta,
      fontSize: 18,
      lineHeight: 29,
      color: SYNTHESIS_COLOR.muted,
      width: 520,
      x: 0,
      y: 118,
    });
    addFinalBody(item, {
      characters: "View project  ↗",
      font: FONT.montserratMedium,
      fontSize: 16,
      lineHeight: 25,
      color: SYNTHESIS_COLOR.green,
      width: 250,
      x: 0,
      y: 240,
    });
  });

  const about = createCanvasFrame(page, {
    name: "About — full-width pale blue transition",
    x: 0,
    y: 2790,
    width: 1440,
    height: 620,
    fill: SYNTHESIS_COLOR.blueSoft,
  });
  addFinalLabel(about, "ABOUT · WORKING POSITIONING", 80, 80, 440);
  addFinalHeading(about, {
    characters: "Curious about the detail. Focused on the person reading.",
    fontSize: 50,
    lineHeight: 62,
    width: 760,
    x: 80,
    y: 145,
  });
  addFinalBody(about, {
    characters: "I work across content strategy and communications, bringing structure, clarity and a human voice to complex subjects. The final first-person wording still needs Abilene’s review.",
    fontSize: 20,
    lineHeight: 34,
    width: 540,
    x: 800,
    y: 180,
  });

  const cta = createCanvasFrame(page, {
    name: "Contact — restrained pale pink transition",
    x: 0,
    y: 3410,
    width: 1440,
    height: 570,
    fill: SYNTHESIS_COLOR.pinkSoft,
  });
  addFinalLabel(cta, "CONTACT", 80, 82, 200);
  addFinalHeading(cta, {
    characters: "Have something complex that needs clarity?",
    fontSize: 52,
    lineHeight: 64,
    width: 830,
    x: 80,
    y: 140,
  });
  createPill(cta, {
    label: "Get in touch  ↗",
    x: 1080,
    y: 175,
    width: 240,
    height: 58,
    fill: SYNTHESIS_COLOR.green,
    stroke: SYNTHESIS_COLOR.green,
    color: SYNTHESIS_COLOR.white,
    fontSize: 17,
    lineHeight: 26,
  });
  addFinalBody(cta, {
    characters: "Abilene Caride · Content strategy · Communications · Content",
    fontSize: 15,
    lineHeight: 24,
    color: SYNTHESIS_COLOR.muted,
    width: 700,
    x: 80,
    y: 455,
  });

  return page;
}

async function buildFinalDirection() {
  if (figma.editorType !== "figma") {
    throw new Error("The final pre-production direction can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.foundations);
  if (!normalizeName(figma.currentPage.name).includes("explorations")) {
    throw new Error(
      `Open the Explorations page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }
  ensureNoExisting(GENERATED_KIND.finalDirection);
  const anchor = preferGeneratedAnchor(GENERATED_KIND.directionD);
  const point = insertionPoint(anchor);
  await loadSynthesisFonts();
  const heroImageHash = findImageHashByName(FINAL_HERO_PHOTO);
  const section = createSection(
    "Final Direction — Clean Organic Editorial — Pre-production",
    point,
    1800,
    5200,
    SYNTHESIS_COLOR.canvas,
    GENERATED_KIND.finalDirection,
  );
  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "Final Direction — Pre-production",
      fontSize: 48,
      lineHeight: 58,
      width: 1040,
      x: 180,
      y: 90,
    });
    addFinalBody(section, {
      characters: "Clean Organic Editorial closes visual exploration. A/B/C and the previous Direction D remain history; this frame is the only working direction to advance.",
      fontSize: 19,
      lineHeight: 31,
      color: SYNTHESIS_COLOR.muted,
      width: 1180,
      x: 180,
      y: 165,
    });
    createRule(section, { x: 180, y: 280, width: 1440, color: SYNTHESIS_COLOR.line });
    createFinalColumn(section, {
      x: 180,
      y: 330,
      width: 420,
      label: "TYPE",
      body: "Inter — headings and navigation\nMontserrat — body and metadata\nH1 68/78 · H2 50–56/62–67 · body 19–21/31–35",
      bodySize: 17,
      lineHeight: 28,
    });
    createFinalColumn(section, {
      x: 690,
      y: 330,
      width: 420,
      label: "COLOR + RHYTHM",
      body: "Green dominant · warm neutral base · occasional pale blue and pink · full-width tints, whitespace and thin rules",
      bodySize: 17,
      lineHeight: 28,
    });
    createFinalColumn(section, {
      x: 1200,
      y: 330,
      width: 420,
      label: "REMOVED",
      body: "No decorative ellipses · no portrait circle · no card system · no false hierarchy · no competing LinkedIn or CV hero actions",
      bodySize: 17,
      lineHeight: 28,
    });
    addFinalLabel(
      section,
      heroImageHash ? "REAL HERO PHOTO LINKED · LANDSCAPE CROP · NO RETOUCH" : "HERO PHOTO SOURCE NOT FOUND — IMPORT IT ON THIS PAGE BEFORE REBUILDING",
      180,
      620,
      1320,
    );
    createFinalHomepage(section, 180, 760, heroImageHash);
  });
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(
    heroImageHash
      ? "Created the final pre-production direction with the approved photograph."
      : "Created the final direction with a photo placeholder. Import the approved photo on this page and rebuild to link it.",
  );
}

async function buildImaginartPreproduction() {
  if (figma.editorType !== "figma") {
    throw new Error("The final imaginArt direction can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  if (!normalizeName(figma.currentPage.name).includes("case studies")) {
    throw new Error(
      `Open the Case Studies page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }
  ensureNoExisting(GENERATED_KIND.imaginartPreproduction);
  const anchor = preferGeneratedAnchor(GENERATED_KIND.imaginartReframed);
  const point = insertionPoint(anchor);
  await loadSynthesisFonts();
  const section = createSection(
    "imaginArt — Final Direction — Pre-production",
    point,
    1740,
    9420,
    SYNTHESIS_COLOR.canvas,
    GENERATED_KIND.imaginartPreproduction,
  );
  const page = createCanvasFrame(section, {
    name: "imaginArt — editorial case-study pre-production",
    x: 150,
    y: 360,
    width: 1440,
    height: 8840,
    fill: SYNTHESIS_COLOR.warmWhite,
  });
  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "imaginArt — Final pre-production editorial",
      fontSize: 42,
      lineHeight: 52,
      width: 1180,
      x: 150,
      y: 90,
    });
    addFinalBody(section, {
      characters: "Closed story order and visual hierarchy. Detailed factual constraints remain in docs/content/case-study-imaginart.md.",
      fontSize: 18,
      lineHeight: 29,
      color: SYNTHESIS_COLOR.muted,
      width: 1180,
      x: 150,
      y: 160,
    });

    const hero = createCaseBand(page, { name: "01 Hero", y: 0, height: 650, fill: SYNTHESIS_COLOR.warmWhite });
    addFinalLabel(hero, "LEAD PROFESSIONAL CASE · PRE-PRODUCTION", 80, 70, 700);
    addFinalHeading(hero, {
      characters: "Making specialist B2B communication clearer",
      fontSize: 68,
      lineHeight: 80,
      width: 980,
      x: 80,
      y: 140,
    });
    addFinalBody(hero, {
      characters: "imaginArt · B2B content & communications\nCommunications Specialist · 2023–Present",
      fontSize: 20,
      lineHeight: 33,
      width: 700,
      x: 80,
      y: 350,
    });
    createRule(hero, { x: 80, y: 575, width: 1280, color: SYNTHESIS_COLOR.line });

    const context = createCaseBand(page, { name: "02 Context and role", y: 650, height: 700, fill: SYNTHESIS_COLOR.blueSoft });
    createFinalCaseHeading(context, "02", "Working between expertise and action", "CONTEXT + ROLE", "Technical accuracy, customer usefulness and business action had to coexist across products, editorial email and event communication.");
    createFinalColumn(context, { x: 180, y: 320, width: 300, label: "ENGINEERING", body: "Technical truth\nProduct detail" });
    createFinalColumn(context, { x: 570, y: 320, width: 300, label: "ABILENE", body: "Content structure\nFraming + copy\nChannel execution" });
    createFinalColumn(context, { x: 960, y: 320, width: 300, label: "SALES + MANAGEMENT", body: "Customer reality\nBusiness context\nFinal validation" });

    const email = createCaseBand(page, { name: "03 Refreshing a specialist B2B newsletter", y: 1350, height: 1260, fill: SYNTHESIS_COLOR.warmWhite });
    createFinalCaseHeading(email, "03", "Refreshing a specialist B2B newsletter", "MUNDO BRIGHTSIGN · PRIMARY STORY 1", "A combined editorial revision: a closer professional tone, an emoji at the beginning of the subject and the CTA moved above the fold.");
    createFinalColumn(email, { x: 160, y: 340, width: 500, label: "EARLIER EDITORIAL APPROACH", body: "Subject\nIntroduction\nContent\nAdditional content\nCTA", bodySize: 20, lineHeight: 36 });
    createFinalColumn(email, { x: 780, y: 340, width: 500, label: "REVISED EDITORIAL APPROACH", body: "Emoji + revised subject\nCloser professional tone\nCTA above the fold\nContent\nAdditional content", bodySize: 20, lineHeight: 36 });
    addFinalHeading(email, { characters: "~24% → ~34%", fontSize: 68, lineHeight: 78, color: SYNTHESIS_COLOR.green, width: 600, x: 160, y: 790 });
    addFinalBody(email, { characters: "Approximate recalled open rates · observed after the combined revision", fontSize: 18, lineHeight: 30, width: 720, x: 160, y: 885 });
    createRule(email, { x: 160, y: 980, width: 1120, color: SYNTHESIS_COLOR.line });
    addFinalBody(email, { characters: "This was NOT an A/B test. The evidence does not isolate the effect of the subject, tone or CTA, so no individual change is presented as causal and the figures are not audited data.", fontSize: 18, lineHeight: 31, color: SYNTHESIS_COLOR.muted, width: 1030, x: 160, y: 1025 });

    const turtle = createCaseBand(page, { name: "04 Launching a new brand in Spain", y: 2610, height: 1280, fill: SYNTHESIS_COLOR.greenSoft });
    createFinalCaseHeading(turtle, "04", "Launching a new brand in Spain", "TURTLE AV · IMAGINART · PRIMARY STORY 2", "Abilene structured the page herself, turning technical product input into a usable B2B content sequence.");
    createFinalColumn(turtle, { x: 100, y: 350, width: 340, label: "RAW TECHNICAL INPUT", body: "4K · Dante · AES67\nPoE · HDR · latency\nRedundancy · compatibility", bodySize: 18 });
    createFinalColumn(turtle, { x: 550, y: 350, width: 340, label: "CONTENT QUESTIONS", body: "What is it?\nWhy does it matter?\nWhich solution fits?\nWhere can it be used?\nWhat happens next?", bodySize: 18 });
    createFinalColumn(turtle, { x: 1000, y: 350, width: 340, label: "STRUCTURED PRODUCT CONTENT", body: "Value proposition\nBenefits\nSolutions\nTechnical detail\nApplications\nContact CTA", bodySize: 18 });
    addFinalHeading(turtle, { characters: "Technical truth → structure → usable B2B content", fontSize: 34, lineHeight: 45, width: 1040, x: 180, y: 850 });
    addFinalBody(turtle, { characters: "Information architecture is the evidence here: selecting, ordering and explaining what a professional buyer needs without weakening technical accuracy.", fontSize: 19, lineHeight: 32, width: 900, x: 180, y: 940 });

    const event = createCaseBand(page, { name: "05 Planning and promoting a corporate event", y: 3890, height: 1330, fill: SYNTHESIS_COLOR.warmWhite });
    createFinalCaseHeading(event, "05", "Planning and promoting a corporate event", "IMAGINART · MADRID OPEN DAYS 2026 · PRIMARY STORY 3", "One communication objective carried across copy, Canva imagery, mailing design, registration, web and LinkedIn content input.");
    createRule(event, { x: 120, y: 360, width: 1200, color: SYNTHESIS_COLOR.green });
    const campaign = [
      ["01", "Invitation", "Web post + mailing"],
      ["02", "Registration", "Form + practical details"],
      ["03", "Reinforcement", "LinkedIn + reminders"],
      ["04", "Event", "One coherent message"],
    ];
    campaign.forEach(([number, title, body], index) => {
      const itemX = 120 + index * 315;
      addFinalLabel(event, number, itemX, 395, 80);
      addFinalHeading(event, { characters: title, fontSize: 23, lineHeight: 31, width: 250, x: itemX, y: 440 });
      addFinalBody(event, { characters: body, fontSize: 16, lineHeight: 26, color: SYNTHESIS_COLOR.muted, width: 250, x: itemX, y: 495 });
    });
    addFinalHeading(event, { characters: "~110–125", fontSize: 68, lineHeight: 78, color: SYNTHESIS_COLOR.green, width: 500, x: 180, y: 760 });
    addFinalBody(event, { characters: "attendees · compared with a usual range of ~70–80", fontSize: 20, lineHeight: 33, width: 600, x: 180, y: 855 });
    addFinalBody(event, { characters: "Approximate recalled ranges · not audited · no precise uplift or causal claim. Bilbao remains supporting evidence of repeatable, conversion-oriented event communication.", fontSize: 18, lineHeight: 31, color: SYNTHESIS_COLOR.muted, width: 980, x: 180, y: 980 });

    const support = createCaseBand(page, { name: "06 Supporting technical-content evidence", y: 5220, height: 1260, fill: SYNTHESIS_COLOR.greenSoft });
    createFinalCaseHeading(support, "06", "Other ways I worked with technical content", "SUPPORTING EVIDENCE · EQUAL LEVEL", "Two concise examples extend the same content-systems pattern without becoming additional main mini-cases.");
    createFinalColumn(support, { x: 160, y: 350, width: 520, label: "STRUCTURING A TECHNICAL CATALOGUE", body: "AV Supports Catalogue\n\nInformation architecture · taxonomy and product categorization · structured product sheets · technical-to-commercial content · layout · imagery selection · sales enablement and content-systems thinking", bodySize: 18, lineHeight: 31 });
    createFinalColumn(support, { x: 760, y: 350, width: 520, label: "ADAPTING TECHNICAL INFORMATION FOR B2B", body: "Lumens\n\nTechnical source documentation · feature selection and organization · practical-use framing · final communication piece. Technical content adaptation, not merely translation.", bodySize: 18, lineHeight: 31 });
    createRule(support, { x: 720, y: 350, width: 2, height: 650, color: SYNTHESIS_COLOR.line });
    addFinalBody(support, { characters: "Both examples show how Abilene builds reusable structures for complex information while keeping the final communication useful to commercial audiences.", font: FONT.montserratMedium, fontSize: 19, lineHeight: 32, width: 1040, x: 180, y: 1030 });

    const teams = createCaseBand(page, { name: "07 Working across teams", y: 6480, height: 900, fill: SYNTHESIS_COLOR.blueSoft });
    createFinalCaseHeading(teams, "07", "Working across teams", "COLLABORATION", "The work sat between technical knowledge, audience needs and business constraints.");
    createFinalColumn(teams, { x: 180, y: 340, width: 300, label: "ENGINEERING", body: "Technical truth\nProduct constraints" });
    createFinalColumn(teams, { x: 570, y: 340, width: 300, label: "ABILENE", body: "Structure · framing\nCopy · execution" });
    createFinalColumn(teams, { x: 960, y: 340, width: 300, label: "SALES + MANAGEMENT", body: "Customer context\nBusiness validation" });
    addFinalBody(teams, { characters: "Collaboration is shown as an equal relationship, not a rigid waterfall the evidence cannot support.", fontSize: 17, lineHeight: 28, color: SYNTHESIS_COLOR.muted, width: 880, x: 280, y: 675 });

    const learning = createCaseBand(page, { name: "08 Learning", y: 7380, height: 880, fill: SYNTHESIS_COLOR.warmWhite });
    createFinalCaseHeading(learning, "08", "A useful reminder", "LEARNING · WORKING PUBLIC VOICE", "The final first-person wording still requires Abilene’s review.");
    addFinalHeading(learning, { characters: "“Something can feel obviously better to you and the data can still disagree.”", fontSize: 38, lineHeight: 51, width: 1040, x: 180, y: 340 });
    addFinalBody(learning, { characters: "A/B testing was adopted later. This learning must not be rewritten as a claim that Mundo BrightSign itself was an A/B test.", fontSize: 19, lineHeight: 32, width: 920, x: 180, y: 515 });
    createRule(learning, { x: 180, y: 670, width: 1080, color: SYNTHESIS_COLOR.line });
    addFinalBody(learning, { characters: "Final editorial check: clarity, ownership and evidence limits matter more than making the case sound larger than it was.", font: FONT.montserratMedium, fontSize: 18, lineHeight: 30, width: 970, x: 180, y: 715 });

    const evidence = createCaseBand(page, { name: "09 Evidence note", y: 8260, height: 580, fill: SYNTHESIS_COLOR.pinkSoft });
    createFinalCaseHeading(evidence, "09", "Evidence before polish", "INTERNAL PRE-PRODUCTION DIRECTION", "The factual blueprint, ownership boundaries, publication constraints and interview-reuse notes live in docs/content/case-study-imaginart.md.");
    addFinalBody(evidence, { characters: "Next: one Abilene review of public voice and story order, then production foundations and final desktop/mobile design.", font: FONT.montserratMedium, fontSize: 18, lineHeight: 30, color: SYNTHESIS_COLOR.green, width: 1040, x: 180, y: 350 });
  });
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Created the final imaginArt pre-production direction beside the selected exploration.");
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
  const sectionHeight = 5740;
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
    title: "Photography direction",
    body: `${MOODBOARD.photography.note}\n\nWorking direction\n${bullets(MOODBOARD.photography.direction)}\n\nProvisional exploration choices\n${bullets(MOODBOARD.photography.provisional)}\n\nThese are working design choices, not final selections.`,
    x: padding + columnWidth + columnGap,
    y: 3100,
    width: columnWidth * 2 + columnGap,
    height: 980,
    fill: COLOR.sage,
    bodySize: 23,
    bodyLineHeight: 34,
  });
  createFigJamCard(section, {
    title: "imaginArt — supported lead-case evidence",
    body: `Working conclusion\nOne broad professional case can show how Abi turned complex audiovisual information and business needs into clear, useful B2B communication across product, email and events.\n\nDetailed factual / evidence blueprint\n${MOODBOARD.imaginArt.blueprint}\nKeep detailed facts there; the Figma brief should not duplicate the entire document.\n\nThree primary stories\n${bullets(MOODBOARD.imaginArt.primaryStories)}\n\nSupporting evidence\n${bullets(MOODBOARD.imaginArt.supportingEvidence)}\n\nMetrics note\nThe open-rate and attendance figures are approximate, recalled values suitable for working and design exploration. They are not audited data.\n\nDo not write the final public case study yet.`,
    x: padding,
    y: 4160,
    width: sectionWidth - padding * 2,
    height: 1400,
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
      case "build-homepage-concepts":
        await buildHomepageConcepts();
        break;
      case "build-direction-d":
        await buildDirectionD();
        break;
      case "build-final-direction":
        await buildFinalDirection();
        break;
      case "build-imaginart-wireframe":
        await buildImaginartWireframe();
        break;
      case "build-imaginart-reframed":
        await buildImaginartReframed();
        break;
      case "build-imaginart-preproduction":
        await buildImaginartPreproduction();
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
