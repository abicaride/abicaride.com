/*
 * Abi Website Brief Builder
 *
 * A deliberately small, local-only Figma development plugin. It creates the
 * V2 brief from Abi's source feedback without connecting to a server or
 * modifying unrelated nodes. Run it from Figma Desktop.
 */

const PLUGIN_DATA_KEY = "abi-website-brief-builder";
const PLUGIN_VERSION = "3";
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
};

const FONT = {
  regular: { family: "Inter", style: "Regular" },
  medium: { family: "Inter", style: "Medium" },
  semibold: { family: "Inter", style: "Semi Bold" },
  display: { family: "Georgia", style: "Regular" },
  displayBold: { family: "Georgia", style: "Bold" },
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
      case "build-imaginart-wireframe":
        await buildImaginartWireframe();
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
