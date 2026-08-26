/*
 * Abi Website Design Publisher
 *
 * A local-only Figma development plugin that publishes repository-owned design
 * decisions into bounded, tagged Figma sections. It never connects to a server
 * or modifies unrelated nodes. Run the packaged build from Figma Desktop.
 */

const PLUGIN_DATA_KEY = "abi-website-brief-builder";
const PLUGIN_VERSION = "9";
const RELEASE_DATA_KEY = `${PLUGIN_DATA_KEY}:release`;
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
  approvedFoundations: "v2-approved-production-foundations",
  aboutPreproduction: "about-final-preproduction-editorial",
  currentComponents: "v2-current-components-reference",
  currentHomepage: "v2-current-homepage-snapshot",
  currentImaginart: "v2-current-imaginart-snapshot",
  currentAbout: "v2-current-about-snapshot",
};

const PUBLIC_FOUNDATIONS_LAYOUT = {
  foundations: {
    pageName: "01 — Foundations",
    currentKind: GENERATED_KIND.approvedFoundations,
    removableNames: new Set([
      "Start here",
      "Workspace Intro — Foundations",
      "[ARCHIVE] Workspace Intro — Foundations",
      "hero-approved-reference.jpg",
    ]),
  },
  components: {
    pageName: "02 — Components",
    currentKind: GENERATED_KIND.currentComponents,
    removableNames: new Set([
      "Workspace Intro — Components",
      "[ARCHIVE] Workspace Intro — Components",
    ]),
  },
  explorations: {
    pageName: "03 — Explorations",
    approvedName: "[APPROVED] Final Direction — Clean Organic Editorial — Pre-production",
    removableNames: new Set([
      "Workspace Intro — Explorations",
      "[ARCHIVE] Workspace Intro — Explorations",
    ]),
    archiveOrder: [
      "[ARCHIVE] D — Clean Organic Editorial",
      "[ARCHIVE] V2 — Desktop Homepage Concepts",
      "[ARCHIVE] V2 — Exploration Directions",
    ],
  },
};

const FINAL_HERO_PHOTO = "AbileneHero";
const FINAL_ABOUT_PHOTO = "AbileneAbout";
const FINAL_HERO_REFERENCE = "hero-approved-reference.jpg";
const FINAL_HERO_REFERENCE_PATH =
  "docs/design/references/hero-approved-reference.jpg";

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

const FINAL_COLOR = {
  canvas: ABI_DESIGN_TOKENS["--color-canvas"],
  surface: ABI_DESIGN_TOKENS["--color-surface"],
  surfaceStrong: ABI_DESIGN_TOKENS["--color-surface-strong"],
  ink: ABI_DESIGN_TOKENS["--color-ink"],
  inkMuted: ABI_DESIGN_TOKENS["--color-ink-muted"],
  greenDeep: ABI_DESIGN_TOKENS["--color-green-deep"],
  green: ABI_DESIGN_TOKENS["--color-green"],
  greenSoft: ABI_DESIGN_TOKENS["--color-green-soft"],
  greenTint: ABI_DESIGN_TOKENS["--color-green-tint"],
  burgundy: ABI_DESIGN_TOKENS["--color-burgundy"],
  burgundyTint: ABI_DESIGN_TOKENS["--color-burgundy-tint"],
  border: ABI_DESIGN_TOKENS["--color-border"],
  white: "#FFFFFF",
};

const CASE_COLOR = {
  canvas: "#F7F3EA",
  surface: "#ECE8DE",
  surfaceStrong: "#DED9CE",
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
  name: "Abilene Caride",
  descriptor: "Content strategy.\nCommunications.\nBusiness.",
  workingLine:
    "I help companies connect with their audiences through clear, honest communication.",
  specialistLine: "Content, communications and marketing specialist",
  cta: "Get in touch",
  leadCase: "imaginArt",
  leadDescriptor: "Marketing, B2B content & communications",
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
  descriptor: "Marketing, B2B content & communications",
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
    "final Abilene review of public case-study voice",
    "rights-cleared supporting imagery and gallery evidence for professional cases",
    "future Writing collection and its first publishable material",
  ],
  photography: {
    note:
      "Real photography is now available. Do not add personal photo files to the repository unless explicitly requested.",
    direction: [
      "realistic plant-filled interior or garden setting",
      "warm daylight and soft depth of field",
      "natural, approachable and calm",
      "recognizably Abilene",
      "professional and human rather than corporate / LinkedIn-like",
      "pale warm architecture with real greenery",
    ],
    provisional: [
      "Close portrait with curly hair + glasses + burgundy top — intended real hero source",
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

const FINAL_PALETTE_TOKENS = [
  ["--color-canvas", FINAL_COLOR.canvas, "Primary page background"],
  ["--color-surface", FINAL_COLOR.surface, "Subtle section contrast"],
  ["--color-surface-strong", FINAL_COLOR.surfaceStrong, "Stronger neutral separation"],
  ["--color-ink", FINAL_COLOR.ink, "Main text"],
  ["--color-ink-muted", FINAL_COLOR.inkMuted, "Supporting text"],
  ["--color-green-deep", FINAL_COLOR.greenDeep, "Identity, navigation, links and primary CTA"],
  ["--color-green", FINAL_COLOR.green, "Diagrams and links"],
  ["--color-green-soft", FINAL_COLOR.greenSoft, "Large graphic accents"],
  ["--color-green-tint", FINAL_COLOR.greenTint, "Rare pale accent"],
  ["--color-burgundy", FINAL_COLOR.burgundy, "Footer, contact emphasis and rare detail"],
  ["--color-burgundy-tint", FINAL_COLOR.burgundyTint, "Optional pale accent"],
  ["--color-border", FINAL_COLOR.border, "Rules and boundaries"],
];

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
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/\.(?:avif|jpe?g|png|webp)$/i, "");
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

function releaseStatusForKind(kind) {
  if (
    [
      GENERATED_KIND.approvedFoundations,
      GENERATED_KIND.currentComponents,
      GENERATED_KIND.currentHomepage,
      GENERATED_KIND.currentImaginart,
      GENERATED_KIND.currentAbout,
      GENERATED_KIND.moodboard,
    ].includes(kind)
  ) {
    return "CURRENT";
  }

  if (
    [
      GENERATED_KIND.finalDirection,
      GENERATED_KIND.imaginartPreproduction,
      GENERATED_KIND.aboutPreproduction,
    ].includes(kind)
  ) {
    return "APPROVED";
  }

  return "ARCHIVE";
}

function markGenerated(node, kind) {
  node.setPluginData(PLUGIN_DATA_KEY, generatedValue(kind));
  node.setPluginData(
    RELEASE_DATA_KEY,
    JSON.stringify({
      status: releaseStatusForKind(kind),
      release: ABI_DESIGN_RELEASE.version,
      commit: ABI_DESIGN_RELEASE.commit,
      source: ABI_DESIGN_RELEASE.sourceOfTruth,
    }),
  );
  node.setRelaunchData({
    "find-generated": "Find content created by Abi Website Design Publisher",
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

function replacementPlacement(kind, historicalAnchorKind) {
  const existing = collectGenerated(figma.currentPage, kind);
  if (existing.length > 1) {
    figma.currentPage.selection = existing;
    figma.viewport.scrollAndZoomIntoView(existing);
    throw new Error(
      "More than one generated final section exists. Keep one before rebuilding.",
    );
  }

  if (existing.length === 1) {
    return {
      existing: existing[0],
      point: { x: existing[0].x, y: existing[0].y },
    };
  }

  const anchor = historicalAnchorKind
    ? preferGeneratedAnchor(historicalAnchorKind)
    : requireSingleAnchor();
  return { existing: null, point: insertionPoint(anchor) };
}

function pageEdgeInsertionPoint(excludedNode) {
  const bounds = figma.currentPage.children
    .filter((node) => node !== excludedNode && node.visible !== false)
    .map((node) => node.absoluteRenderBounds || node.absoluteBoundingBox)
    .filter((box) => box && box.width > 0 && box.height > 0);

  if (bounds.length === 0) {
    return insertionPoint(requireSingleAnchor());
  }

  return {
    x: Math.round(Math.max(...bounds.map((box) => box.x + box.width)) + INSERTION_GAP),
    y: Math.round(Math.min(...bounds.map((box) => box.y))),
  };
}

function productionSnapshotPlacement(kind) {
  const existing = collectGenerated(figma.currentPage, kind);
  if (existing.length > 1) {
    figma.currentPage.selection = existing;
    figma.viewport.scrollAndZoomIntoView(existing);
    throw new Error("More than one current production snapshot exists. Keep one before republishing.");
  }
  if (existing.length === 1) {
    return { existing: existing[0], point: pageEdgeInsertionPoint(existing[0]) };
  }

  return { existing: null, point: pageEdgeInsertionPoint(null) };
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
  section.name = `[${releaseStatusForKind(kind)}] ${name}`;
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

const LINE_ICON_PATHS = {
  email:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  transform:
    '<path d="M4 7h12"/><path d="m13 4 3 3-3 3"/><path d="M20 17H8"/><path d="m11 14-3 3 3 3"/>',
  event:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M8 14h3v3H8z"/>',
  catalogue:
    '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  technical:
    '<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  network:
    '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m10.8 7.2-4.6 8.6M13.2 7.2l4.6 8.6M7.5 18h9"/>',
  trend:
    '<path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/><path d="M16 7h3v3"/>',
  administration:
    '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V4h6v3M4 12h16M10 15h4"/>',
  communication:
    '<path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/>',
  writing:
    '<path d="m5 19 3.5-.8L19 7.7 16.3 5 5.8 15.5 5 19Z"/><path d="m14.8 6.5 2.7 2.7M5 21h14"/>',
  compass:
    '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  clear:
    '<path d="M4 7h16M4 12h11M4 17h8"/><path d="m17 15 3 3-3 3"/>',
  honest:
    '<path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
  practical:
    '<path d="M14.5 5.5a4 4 0 0 0-5 5L4 16l4 4 5.5-5.5a4 4 0 0 0 5-5l-3 3-3-3 2-4Z"/>',
  leaf:
    '<path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M5 20c2-5 6-8 11-11"/>',
  home:
    '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  spark:
    '<path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  settings:
    '<path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M10 14v6"/>',
};

function createLineIcon(parent, options) {
  const path = LINE_ICON_PATHS[options.icon];
  if (!path) throw new Error(`Unknown line icon: ${options.icon}`);
  const size = options.size || 36;
  const color = options.color || FINAL_COLOR.greenDeep;
  const icon = figma.createNodeFromSvg(
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke="${color}" stroke-width="${options.strokeWidth || 2.25}" stroke-linecap="round" stroke-linejoin="round">${path}</g></svg>`,
  );
  parent.appendChild(icon);
  icon.name = `Icon — ${options.icon}`;
  icon.resize(size, size);
  icon.x = options.x;
  icon.y = options.y;
  return icon;
}

function createBrandMark(parent, options) {
  const mark = figma.createNodeFromSvg(ABI_DESIGN_VECTORS.favicon);
  parent.appendChild(mark);
  mark.name = options.name || `Favicon / Brand mark — ${options.size}px`;
  mark.resize(options.size, options.size);
  mark.x = options.x;
  mark.y = options.y;
  return mark;
}

function footerWatermarkOpacity() {
  const value = Number.parseFloat(ABI_DESIGN_TOKENS["--opacity-footer-watermark"] || "0.07");
  return Number.isFinite(value) ? value : 0.07;
}

function createTransparentBrandMark(parent, options) {
  const color = options.color || FINAL_COLOR.canvas;
  const svg = ABI_DESIGN_VECTORS.brandMark.replace(/#103A20/gi, color);
  const mark = figma.createNodeFromSvg(svg);
  parent.appendChild(mark);
  mark.name = options.name || "Decorative Abilene brand-mark watermark";
  mark.resize(options.size, options.size);
  mark.x = options.x;
  mark.y = options.y;
  mark.opacity = options.opacity ?? footerWatermarkOpacity();
  return mark;
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

function bundledImageHash(assetName) {
  const asset = ABI_DESIGN_ASSETS[assetName];
  if (!asset) throw new Error(`Packaged production image “${assetName}” is missing.`);
  let bytes;
  if (typeof figma.base64Decode === "function") {
    bytes = figma.base64Decode(asset.base64);
  } else {
    const binary = atob(asset.base64);
    bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
  }
  return figma.createImage(bytes).hash;
}

function preferGeneratedAnchor(kind) {
  const generated = collectGenerated(figma.currentPage, kind);
  if (generated.length === 1) return generated[0];
  if (generated.length > 1) {
    throw new Error("More than one possible historical anchor was found. Keep one generated source section before rebuilding.");
  }
  return requireSingleAnchor();
}

function applyImageFill(frame, imageHash, scaleMode = "FILL") {
  if (!imageHash) return false;
  frame.fills = [{ type: "IMAGE", imageHash, scaleMode }];
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
      color: FINAL_COLOR.inkMuted,
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
      color: FINAL_COLOR.inkMuted,
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
    color: options.color || FINAL_COLOR.border,
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
    color: FINAL_COLOR.green,
    width,
    x,
    y,
  });
}

function addFinalHeading(parent, options) {
  return appendText(parent, {
    ...options,
    font: options.font || FONT.semibold,
    color: options.color || FINAL_COLOR.ink,
  });
}

function addFinalBody(parent, options) {
  return appendText(parent, {
    ...options,
    font: options.font || FONT.montserrat,
    color: options.color || FINAL_COLOR.ink,
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
      fontSize: 20,
      lineHeight: 31,
      color: FINAL_COLOR.inkMuted,
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
    color: options.color || FINAL_COLOR.border,
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

function addCaseBody(parent, options) {
  return addFinalBody(parent, {
    fontSize: 20,
    lineHeight: 31,
    ...options,
  });
}

function createCaseDiagramNode(parent, options) {
  const node = createCanvasFrame(parent, {
    name: options.name || `Diagram — ${options.title}`,
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    fill: options.fill || CASE_COLOR.canvas,
    stroke: options.stroke || FINAL_COLOR.border,
    strokeWeight: options.strokeWeight || 1,
    radius: options.radius || 6,
  });
  addFinalLabel(node, options.title, 22, 20, options.width - 44);
  if (options.body) {
    addFinalBody(node, {
      characters: options.body,
      fontSize: options.bodySize || 17,
      lineHeight: options.lineHeight || 27,
      color: options.bodyColor || FINAL_COLOR.ink,
      width: options.width - 44,
      x: 22,
      y: options.bodyY || 58,
    });
  }
  return node;
}

function createCaseArrow(parent, options) {
  return addFinalHeading(parent, {
    characters: options.direction || "→",
    font: FONT.montserratMedium,
    fontSize: options.size || 30,
    lineHeight: options.lineHeight || 36,
    color: options.color || FINAL_COLOR.greenDeep,
    width: options.width || 48,
    x: options.x,
    y: options.y,
  });
}

function createFinalContactFooter(parent, y) {
  const footer = createCanvasFrame(parent, {
    name: "Contact footer — burgundy terminal section",
    x: 0,
    y,
    width: 1440,
    height: 850,
    fill: FINAL_COLOR.burgundy,
  });
  createTransparentBrandMark(footer, {
    name: "Footer watermark — desktop · approved transparent brand mark",
    x: 950,
    y: 20,
    size: 520,
  });
  addFinalBody(footer, {
    characters: "LET’S TALK",
    font: FONT.montserratMedium,
    fontSize: 14,
    lineHeight: 22,
    color: FINAL_COLOR.canvas,
    width: 240,
    x: 80,
    y: 82,
  });
  addFinalHeading(footer, {
    characters: "Have a project, an idea,\nor just want to say hello?",
    fontSize: 54,
    lineHeight: 66,
    color: FINAL_COLOR.canvas,
    width: 950,
    x: 80,
    y: 142,
  });
  addFinalBody(footer, {
    characters: "abicaride@gmail.com  →",
    font: FONT.montserratMedium,
    fontSize: 22,
    lineHeight: 32,
    color: FINAL_COLOR.canvas,
    width: 520,
    x: 80,
    y: 356,
  });
  createRule(footer, { x: 80, y: 535, width: 1280, color: FINAL_COLOR.burgundyTint });
  createTransparentBrandMark(footer, {
    name: "Footer identity mark — desktop · approved transparent brand mark",
    x: 80,
    y: 602,
    size: 58,
    opacity: 1,
  });
  addFinalHeading(footer, {
    characters: "Abilene Caride",
    fontSize: 18,
    lineHeight: 26,
    color: FINAL_COLOR.canvas,
    width: 280,
    x: 158,
    y: 606,
  });
  addFinalBody(footer, {
    characters: "Content strategy · Communications · Business",
    fontSize: 13,
    lineHeight: 22,
    color: FINAL_COLOR.surface,
    width: 280,
    x: 158,
    y: 643,
  });
  for (const separatorX of [450, 720, 880]) {
    const separator = createRule(footer, { x: separatorX, y: 580, width: 1, height: 145, color: FINAL_COLOR.burgundyTint });
    separator.opacity = 0.42;
  }
  addFinalBody(footer, {
    characters: "PRIVACY",
    font: FONT.montserratMedium,
    fontSize: 12,
    lineHeight: 20,
    color: FINAL_COLOR.canvas,
    width: 210,
    x: 485,
    y: 580,
  });
  addFinalBody(footer, {
    characters: "Privacy & cookies\nCookie settings",
    fontSize: 14,
    lineHeight: 42,
    color: FINAL_COLOR.surface,
    width: 210,
    x: 485,
    y: 620,
  });
  createLineIcon(footer, { icon: "settings", x: 650, y: 672, size: 18, strokeWidth: 1.5, color: FINAL_COLOR.surface });
  addFinalBody(footer, {
    characters: "LANGUAGE",
    font: FONT.montserratMedium,
    fontSize: 12,
    lineHeight: 20,
    color: FINAL_COLOR.canvas,
    width: 130,
    x: 755,
    y: 580,
  });
  addFinalBody(footer, {
    characters: "EN     ES",
    font: FONT.montserratMedium,
    fontSize: 14,
    lineHeight: 24,
    color: FINAL_COLOR.surface,
    width: 120,
    x: 755,
    y: 622,
  });
  createRule(footer, { x: 755, y: 654, width: 24, height: 2, color: FINAL_COLOR.canvas });
  addFinalBody(footer, {
    characters: "HOW IT’S MADE",
    font: FONT.montserratMedium,
    fontSize: 12,
    lineHeight: 20,
    color: FINAL_COLOR.canvas,
    width: 380,
    x: 915,
    y: 580,
  });
  addFinalBody(footer, {
    characters: "Made with 🎨 Figma, 🚀 Astro, ✍️ Pages CMS, 🤖 Codex and lots of ❤️.  →",
    fontSize: 14,
    lineHeight: 24,
    color: FINAL_COLOR.surface,
    width: 390,
    x: 915,
    y: 620,
  });
  const metaDivider = createRule(footer, { x: 80, y: 760, width: 1280, color: FINAL_COLOR.burgundyTint });
  metaDivider.opacity = 0.42;
  addFinalBody(footer, {
    characters: "© 2026 Abilene Caride. All rights reserved.",
    fontSize: 13,
    lineHeight: 24,
    color: FINAL_COLOR.surface,
    width: 420,
    x: 80,
    y: 796,
  });
  return footer;
}

function createTokenSwatch(parent, token, index, originY = 0) {
  const [name, value, use] = token;
  const column = index % 4;
  const row = Math.floor(index / 4);
  const x = 80 + column * 330;
  const y = originY + row * 210;
  const dark = [
    FINAL_COLOR.ink,
    FINAL_COLOR.greenDeep,
    FINAL_COLOR.green,
    FINAL_COLOR.burgundy,
  ].includes(value);
  const swatch = createCanvasFrame(parent, {
    name: `Token — ${name}`,
    x,
    y,
    width: 290,
    height: 170,
    fill: value,
    stroke: FINAL_COLOR.border,
    radius: 8,
  });
  addFinalBody(swatch, {
    characters: `${name}\n${value}`,
    font: FONT.montserratMedium,
    fontSize: 15,
    lineHeight: 24,
    color: dark ? FINAL_COLOR.white : FINAL_COLOR.ink,
    width: 250,
    x: 20,
    y: 20,
  });
  addFinalBody(swatch, {
    characters: use,
    fontSize: 13,
    lineHeight: 20,
    color: dark ? FINAL_COLOR.white : FINAL_COLOR.inkMuted,
    width: 250,
    x: 20,
    y: 112,
  });
  return swatch;
}

async function publishCurrentComponents() {
  if (figma.editorType !== "figma") {
    throw new Error("The current Components reference can only be published in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.foundations);
  if (!normalizeName(figma.currentPage.name).includes("components")) {
    throw new Error(
      `Open the Components page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }

  const placement = replacementPlacement(GENERATED_KIND.currentComponents);
  await loadSynthesisFonts();
  const section = createSection(
    "V2 — Current implemented components",
    placement.point,
    1740,
    4500,
    FINAL_COLOR.surface,
    GENERATED_KIND.currentComponents,
  );

  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "V2 — Current implemented components",
      fontSize: 48,
      lineHeight: 58,
      width: 1180,
      x: 150,
      y: 90,
    });
    addFinalBody(section, {
      characters: `CURRENT · Design release ${ABI_DESIGN_RELEASE.version} · Source ${ABI_DESIGN_RELEASE.commit}\nOnly patterns already reused by the Astro implementation belong here. This is a production reference, not a speculative UI library.`,
      fontSize: 18,
      lineHeight: 30,
      color: FINAL_COLOR.inkMuted,
      width: 1320,
      x: 150,
      y: 165,
    });

    addFinalLabel(section, "HEADER / NAVIGATION", 150, 330, 420);
    const header = createCanvasFrame(section, {
      name: "Header and localized navigation reference",
      x: 150,
      y: 390,
      width: 1440,
      height: 180,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.border,
    });
    addFinalHeading(header, {
      characters: "Abilene Caride",
      fontSize: 32,
      lineHeight: 40,
      width: 330,
      x: 64,
      y: 62,
    });
    for (const [label, itemX] of [
      ["Home", 850],
      ["Work", 945],
      ["About", 1040],
      ["Contact", 1140],
      ["ES", 1280],
    ]) {
      addFinalBody(header, {
        characters: label,
        font: FONT.montserratMedium,
        fontSize: 15,
        lineHeight: 24,
        color: FINAL_COLOR.greenDeep,
        width: 100,
        x: itemX,
        y: 76,
      });
    }

    addFinalLabel(section, "BUTTONS", 150, 660, 260);
    const buttonStage = createCanvasFrame(section, {
      name: "Primary and secondary CTA reference",
      x: 150,
      y: 720,
      width: 1440,
      height: 250,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.border,
    });
    createPill(buttonStage, {
      label: "Get in touch  →",
      x: 64,
      y: 70,
      width: 240,
      height: 72,
      fill: FINAL_COLOR.greenDeep,
      stroke: FINAL_COLOR.greenDeep,
      color: FINAL_COLOR.canvas,
      fontSize: 18,
      lineHeight: 28,
    });
    createPill(buttonStage, {
      label: "View my work  →",
      x: 330,
      y: 70,
      width: 250,
      height: 72,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.greenDeep,
      color: FINAL_COLOR.greenDeep,
      fontSize: 18,
      lineHeight: 28,
    });
    addFinalBody(buttonStage, {
      characters: "Deep green is the primary action color. Burgundy is reserved for the terminal/contact footer and rare supporting emphasis.",
      fontSize: 17,
      lineHeight: 28,
      color: FINAL_COLOR.inkMuted,
      width: 650,
      x: 700,
      y: 76,
    });

    addFinalLabel(section, "PROJECT PREVIEW", 150, 1060, 320);
    const project = createCanvasFrame(section, {
      name: "Project preview reference",
      x: 150,
      y: 1120,
      width: 760,
      height: 500,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.border,
    });
    addFinalLabel(project, "SELECTED WORK", 48, 46, 260);
    addFinalHeading(project, {
      characters: "Making specialist B2B communication clearer",
      fontSize: 38,
      lineHeight: 48,
      width: 640,
      x: 48,
      y: 105,
    });
    addFinalBody(project, {
      characters: "imaginArt · Product content, editorial email and event communication",
      fontSize: 17,
      lineHeight: 29,
      color: FINAL_COLOR.inkMuted,
      width: 620,
      x: 48,
      y: 240,
    });
    createRule(project, { x: 48, y: 350, width: 664, color: FINAL_COLOR.border });
    addFinalBody(project, {
      characters: "View case study  ↗",
      font: FONT.montserratMedium,
      fontSize: 16,
      lineHeight: 25,
      color: FINAL_COLOR.greenDeep,
      width: 260,
      x: 48,
      y: 390,
    });

    addFinalLabel(section, "ANALYTICS CONSENT", 990, 1060, 360);
    const consent = createCanvasFrame(section, {
      name: "Accessible analytics consent reference",
      x: 990,
      y: 1120,
      width: 600,
      height: 500,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.border,
      radius: 8,
    });
    addFinalHeading(consent, {
      characters: "Analytics",
      fontSize: 32,
      lineHeight: 40,
      width: 480,
      x: 48,
      y: 48,
    });
    addFinalBody(consent, {
      characters: "We use Google Analytics to understand how this website is used and improve it.",
      fontSize: 17,
      lineHeight: 29,
      width: 490,
      x: 48,
      y: 120,
    });
    createPill(consent, {
      label: "Accept",
      x: 48,
      y: 320,
      width: 180,
      height: 62,
      fill: FINAL_COLOR.greenDeep,
      stroke: FINAL_COLOR.greenDeep,
      color: FINAL_COLOR.canvas,
      fontSize: 16,
      lineHeight: 24,
    });
    createPill(consent, {
      label: "Reject",
      x: 248,
      y: 320,
      width: 180,
      height: 62,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.greenDeep,
      color: FINAL_COLOR.greenDeep,
      fontSize: 16,
      lineHeight: 24,
    });

    addFinalLabel(section, "BACK TO TOP", 150, 1740, 300);
    const controlStage = createCanvasFrame(section, {
      name: "Back-to-top interaction reference",
      x: 150,
      y: 1800,
      width: 1440,
      height: 230,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.border,
    });
    const control = createPill(controlStage, {
      label: "↑",
      x: 64,
      y: 70,
      width: 56,
      height: 56,
      fill: FINAL_COLOR.canvas,
      stroke: FINAL_COLOR.border,
      color: FINAL_COLOR.greenDeep,
      fontSize: 24,
      lineHeight: 28,
    });
    control.name = "Back to top / Volver arriba";
    addFinalBody(controlStage, {
      characters: "Fixed bottom-right after the hero leaves view · keyboard accessible · visible focus · reduced-motion aware · clears the consent UI.",
      fontSize: 17,
      lineHeight: 28,
      color: FINAL_COLOR.inkMuted,
      width: 1150,
      x: 180,
      y: 78,
    });

    addFinalLabel(section, "FOOTER · DESKTOP", 150, 2140, 300);
    createFinalContactFooter(section, 2200).x = 150;
    addFinalLabel(section, "FOOTER · MOBILE", 150, 3100, 300);
    const mobileFooter = createAboutMobileFooter(section, 3160);
    mobileFooter.x = 150;
    addFinalBody(section, {
      characters: "The same transparent brand mark becomes smaller and more cropped on narrow screens. It remains decorative, low-opacity and clear of email, privacy, cookie settings and build information.",
      fontSize: 18,
      lineHeight: 30,
      color: FINAL_COLOR.inkMuted,
      width: 780,
      x: 620,
      y: 3260,
    });
  });

  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(
    `Published current component references from design release ${ABI_DESIGN_RELEASE.version}.`,
  );
}

async function buildApprovedFoundations() {
  if (figma.editorType !== "figma") {
    throw new Error("The approved V2 foundations can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.foundations);
  if (!normalizeName(figma.currentPage.name).includes("foundations")) {
    throw new Error(
      `Open the Foundations page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }

  const placement = replacementPlacement(GENERATED_KIND.approvedFoundations);
  await loadSynthesisFonts();
  const referenceHash = findImageHashByName(FINAL_HERO_REFERENCE);
  const section = createSection(
    "V2 — Current production foundations",
    placement.point,
    1740,
    4400,
    FINAL_COLOR.surface,
    GENERATED_KIND.approvedFoundations,
  );

  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "V2 — Current production foundations",
      fontSize: 48,
      lineHeight: 58,
      width: 1260,
      x: 150,
      y: 90,
    });
    addFinalBody(section, {
      characters: `CURRENT · Design release ${ABI_DESIGN_RELEASE.version} · Source ${ABI_DESIGN_RELEASE.commit}\nGenerated from the production token source in src/styles/tokens.css. Astro remains authoritative; rerun the publisher after intentional token changes.`,
      fontSize: 19,
      lineHeight: 31,
      color: FINAL_COLOR.inkMuted,
      width: 1180,
      x: 150,
      y: 165,
    });

    addFinalLabel(section, "TYPOGRAPHY", 150, 300, 300);
    addFinalHeading(section, {
      characters: "Inter for headings, navigation and major metrics",
      fontSize: 38,
      lineHeight: 48,
      width: 1180,
      x: 150,
      y: 350,
    });
    addFinalBody(section, {
      characters: "Montserrat Regular for body copy, descriptions and supporting text. Keep long-form measure comfortable and document any concrete readability problem before reconsidering the decision.",
      fontSize: 19,
      lineHeight: 32,
      width: 1050,
      x: 150,
      y: 420,
    });
    createRule(section, { x: 150, y: 550, width: 1440, color: FINAL_COLOR.border });

    addFinalLabel(section, "PALETTE · DERIVED FROM THE APPROVED HERO", 150, 610, 700);
    FINAL_PALETTE_TOKENS.forEach((token, index) =>
      createTokenSwatch(section, token, index, 680),
    );

    createRule(section, { x: 150, y: 1350, width: 1440, color: FINAL_COLOR.border });
    addFinalLabel(section, "FAVICON / BRAND MARK", 150, 1410, 500);
    addFinalHeading(section, {
      characters: "Approved current favicon",
      fontSize: 38,
      lineHeight: 48,
      width: 700,
      x: 150,
      y: 1470,
    });
    addFinalBody(section, {
      characters: "The cream version is canonical: warm cream #F7F3EA with deep forest green #103A20. The serif A is a brand symbol only; interface typography remains Inter and Montserrat.",
      fontSize: 18,
      lineHeight: 30,
      color: FINAL_COLOR.inkMuted,
      width: 960,
      x: 150,
      y: 1535,
    });
    createBrandMark(section, {
      name: "[CURRENT] Favicon / Brand mark — canonical cream",
      x: 150,
      y: 1640,
      size: 360,
    });
    createBrandMark(section, {
      name: "Favicon / Brand mark — 180px presentation",
      x: 650,
      y: 1730,
      size: 180,
    });
    createBrandMark(section, {
      name: "Favicon / Brand mark — 32px presentation",
      x: 980,
      y: 1804,
      size: 32,
    });
    createBrandMark(section, {
      name: "Favicon / Brand mark — 16px presentation",
      x: 1130,
      y: 1812,
      size: 16,
    });
    addFinalBody(section, {
      characters: "CANONICAL CREAM · APPROVED",
      font: FONT.montserratMedium,
      fontSize: 15,
      lineHeight: 22,
      color: FINAL_COLOR.greenDeep,
      width: 360,
      x: 150,
      y: 2025,
    });
    addFinalBody(section, {
      characters: "180 × 180",
      fontSize: 15,
      lineHeight: 22,
      color: FINAL_COLOR.inkMuted,
      width: 180,
      x: 650,
      y: 1935,
    });
    addFinalBody(section, {
      characters: "32 × 32",
      fontSize: 15,
      lineHeight: 22,
      color: FINAL_COLOR.inkMuted,
      width: 110,
      x: 945,
      y: 1865,
    });
    addFinalBody(section, {
      characters: "16 × 16",
      fontSize: 15,
      lineHeight: 22,
      color: FINAL_COLOR.inkMuted,
      width: 110,
      x: 1095,
      y: 1865,
    });
    createFinalColumn(section, {
      x: 1280,
      y: 1640,
      width: 310,
      label: "PRODUCTION RULE",
      body: "Cream + deep green only. Burgundy remains a supporting site color, not a favicon variant. The simplified stems and leaves are optically weighted to survive at 16px.",
      bodySize: 17,
      lineHeight: 28,
    });

    createRule(section, { x: 150, y: 2200, width: 1440, color: FINAL_COLOR.border });
    addFinalLabel(section, "GRAPHIC PRINCIPLES", 150, 2260, 400);
    createFinalColumn(section, {
      x: 150,
      y: 2330,
      width: 420,
      label: "BACKGROUND RHYTHM",
      body: "Warm cream → light warm neutral → warm cream → stronger neutral only when necessary. No large colored section blocks.",
      bodySize: 17,
      lineHeight: 28,
    });
    createFinalColumn(section, {
      x: 660,
      y: 2330,
      width: 420,
      label: "COLOR AS ACCENT",
      body: "Deep green leads CTAs, links, icons and diagrams. Burgundy is tertiary: selected metrics or tiny details only—never the primary CTA or a section background.",
      bodySize: 17,
      lineHeight: 28,
    });
    createFinalColumn(section, {
      x: 1170,
      y: 2330,
      width: 420,
      label: "FORM",
      body: "Whitespace, thin separators, meaningful line icons and diagrams. No floating ellipses, blobs, fake leaves or speculative rounded-card system.",
      bodySize: 17,
      lineHeight: 28,
    });

    createRule(section, { x: 150, y: 2900, width: 1440, color: FINAL_COLOR.border });
    addFinalLabel(section, "APPROVED HERO ART-DIRECTION REFERENCE", 150, 2960, 700);
    const reference = createCanvasFrame(section, {
      name: `Design reference only — ${FINAL_HERO_REFERENCE}`,
      x: 150,
      y: 3030,
      width: 900,
      height: 600,
      fill: FINAL_COLOR.greenTint,
      stroke: FINAL_COLOR.border,
      clipsContent: true,
    });
    if (!applyImageFill(reference, referenceHash)) {
      addFinalHeading(reference, {
        characters: FINAL_HERO_REFERENCE,
        fontSize: 30,
        lineHeight: 40,
        width: 760,
        x: 50,
        y: 70,
      });
      addFinalBody(reference, {
        characters: `Import ${FINAL_HERO_REFERENCE_PATH} on this page, keep its filename as the layer name, and rebuild.`,
        fontSize: 18,
        lineHeight: 30,
        width: 740,
        x: 50,
        y: 150,
      });
    }
    createFinalColumn(section, {
      x: 1120,
      y: 3030,
      width: 470,
      label: "APPROVED FOR",
      body: "Wide landscape composition\nCopy left + portrait/environment right\nShared vertical hero zone\nPlant-filled realistic atmosphere\nWarm daylight and calm depth\nGreen-led palette",
      bodySize: 17,
      lineHeight: 29,
    });
    createFinalColumn(section, {
      x: 1120,
      y: 3550,
      width: 470,
      label: "NOT A PRODUCTION ASSET",
      body: "Do not ship the flattened mockup. It contains baked-in type, navigation, CTAs, invented logos and generated compositing. Recreate the approved intent with HTML/CSS and the final processed real portrait.",
      bodySize: 17,
      lineHeight: 29,
    });
    addFinalBody(section, {
      characters: "This reference supersedes previous hero explorations for composition, atmosphere and photographic art direction.",
      font: FONT.montserratMedium,
      fontSize: 19,
      lineHeight: 31,
      color: FINAL_COLOR.greenDeep,
      width: 1280,
      x: 150,
      y: 4090,
    });
  });

  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(
    referenceHash
      ? "Published the current V2 foundations with the approved favicon and authoritative hero reference."
      : "Published the current V2 foundations with the approved favicon. Import the hero reference image on this page and republish to show it.",
  );
}

function createFinalHomepage(parent, x, y, heroImageHash) {
  const page = createCanvasFrame(parent, {
    name: "Final homepage — desktop pre-production",
    x,
    y,
    width: 1440,
    height: 4260,
    fill: FINAL_COLOR.canvas,
  });

  const hero = createCanvasFrame(page, {
    name: `Hero — full-bleed atmospheric image — ${FINAL_HERO_PHOTO}`,
    x: 0,
    y: 0,
    width: 1440,
    height: 860,
    fill: FINAL_COLOR.greenTint,
    clipsContent: true,
  });
  const hasHeroImage = applyImageFill(hero, heroImageHash);
  const heroScrim = createCanvasFrame(hero, {
    name: "Hero — warm readability gradient",
    x: 0,
    y: 0,
    width: 960,
    height: 860,
  });
  heroScrim.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientStops: [
        { position: 0, color: { ...hexToRgb(FINAL_COLOR.canvas), a: 0.98 } },
        { position: 0.62, color: { ...hexToRgb(FINAL_COLOR.canvas), a: 0.84 } },
        { position: 1, color: { ...hexToRgb(FINAL_COLOR.canvas), a: 0 } },
      ],
      gradientTransform: [
        [1, 0, 0],
        [0, 1, 0],
      ],
    },
  ];

  addFinalHeading(hero, {
    characters: "Abilene Caride",
    fontSize: 32,
    lineHeight: 26,
    width: 260,
    x: 80,
    y: 42,
  });
  for (const [label, itemX] of [
    ["Home", 850],
    ["Work", 950],
    ["About", 1060],
    ["Contact", 1180],
    ["ES", 1320],
  ]) {
    addFinalBody(hero, {
      characters: label,
      font: FONT.montserratMedium,
      fontSize: 15,
      lineHeight: 24,
      width: 90,
      x: itemX,
      y: 44,
      color: FINAL_COLOR.surface,
    });
  }
  addFinalHeading(hero, {
    characters: HOMEPAGE.workingLine,
    fontSize: 54,
    lineHeight: 64,
    color: FINAL_COLOR.greenDeep,
    width: 660,
    x: 80,
    y: 170,
  });
  addFinalBody(hero, {
    characters: HOMEPAGE.specialistLine,
    font: FONT.medium,
    fontSize: 24,
    lineHeight: 64,
    color: FINAL_COLOR.greenDeep,
    width: 660,
    x: 80,
    y: 448,
  });
  createPill(hero, {
    label: "Get in touch  →",
    x: 80,
    y: 570,
    width: 220,
    height: 64,
    fill: FINAL_COLOR.greenDeep,
    stroke: FINAL_COLOR.greenDeep,
    color: FINAL_COLOR.canvas,
    fontSize: 18,
    lineHeight: 28,
  });
  createPill(hero, {
    label: "View my work  ↓",
    x: 320,
    y: 570,
    width: 240,
    height: 64,
    fill: FINAL_COLOR.canvas,
    stroke: FINAL_COLOR.greenDeep,
    color: FINAL_COLOR.greenDeep,
    fontSize: 18,
    lineHeight: 28,
  });
  if (!hasHeroImage) {
    addFinalLabel(hero, "IMPORT ABILENEHERO.PNG ON THIS PAGE AND REBUILD", 820, 180, 520);
    addFinalHeading(hero, {
      characters: "Full-bleed plant environment with Abilene placed on the right",
      fontSize: 34,
      lineHeight: 44,
      width: 530,
      x: 820,
      y: 238,
    });
  }

  const lead = createCanvasFrame(page, {
    name: "Lead work — imaginArt",
    x: 0,
    y: 860,
    width: 1440,
    height: 780,
    fill: FINAL_COLOR.surface,
  });
  addFinalLabel(lead, "01 · SELECTED WORK", 80, 72, 430);
  addFinalLabel(lead, "MARKETING, B2B CONTENT & COMMUNICATIONS · IMAGINART", 80, 120, 650);
  addFinalHeading(lead, {
    characters: "Making specialist B2B communication clearer",
    fontSize: 54,
    lineHeight: 65,
    width: 720,
    x: 80,
    y: 160,
  });
  addFinalBody(lead, {
    characters: "Product content, editorial email improvements and event communication for a specialist audiovisual audience.",
    font: FONT.montserratMedium,
    fontSize: 18,
    lineHeight: 30,
    color: FINAL_COLOR.green,
    width: 650,
    x: 80,
    y: 320,
  });
  addFinalBody(lead, {
    characters: "A lead professional case showing how technical and business information became clearer, useful communication.",
    fontSize: 20,
    lineHeight: 33,
    width: 560,
    x: 80,
    y: 390,
  });
  createRule(lead, { x: 800, y: 150, width: 520, color: FINAL_COLOR.green });
  const leadItems = [
    ["email", "Newsletter", "~24% → ~34% · approximate"],
    ["transform", "Brand launch", "Technical input → usable B2B content"],
    ["event", "Corporate event", "Campaign system · ~110–125 attendees"],
  ];
  leadItems.forEach(([icon, title, meta], index) => {
    const itemY = 180 + index * 150;
    createLineIcon(lead, { icon, x: 800, y: itemY, size: 32 });
    addFinalHeading(lead, {
      characters: title,
      fontSize: 24,
      lineHeight: 32,
      width: 400,
      x: 860,
      y: itemY - 2,
    });
    addFinalBody(lead, {
      characters: meta,
      fontSize: 15,
      lineHeight: 24,
      color: FINAL_COLOR.inkMuted,
      width: 430,
      x: 860,
      y: itemY + 42,
    });
    createRule(lead, { x: 800, y: itemY + 108, width: 520, color: FINAL_COLOR.border });
  });

  const secondary = createCanvasFrame(page, {
    name: "Secondary work — equal hierarchy",
    x: 0,
    y: 1640,
    width: 1440,
    height: 620,
    fill: FINAL_COLOR.canvas,
  });
  addFinalLabel(secondary, "SELECTED WORK", 80, 72, 430);
  addFinalHeading(secondary, {
    characters: "More ways of making digital communication useful.",
    fontSize: 34,
    lineHeight: 43,
    width: 780,
    x: 80,
    y: 105,
  });
  const secondaryItems = [
    ["Secondary work — Cognitive biases in ecommerce", "Cognitive biases in ecommerce", "Behavioural design · UX audit · Figma", 80],
    ["Secondary work — Error Messages", "Error Messages", "UX writing · clarity · recovery", 740],
  ];
  secondaryItems.forEach(([name, title, meta, itemX]) => {
    const item = createCanvasFrame(secondary, {
      name,
      x: itemX,
      y: 190,
      width: 620,
      height: 340,
    });
    createRule(item, { x: 0, y: 0, width: 620, color: FINAL_COLOR.border });
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
      color: FINAL_COLOR.inkMuted,
      width: 520,
      x: 0,
      y: 170,
    });
    addFinalBody(item, {
      characters: "View project  ↗",
      font: FONT.montserratMedium,
      fontSize: 16,
      lineHeight: 25,
      color: FINAL_COLOR.greenDeep,
      width: 250,
      x: 0,
      y: 270,
    });
  });

  const about = createCanvasFrame(page, {
    name: "About — neutral tonal transition",
    x: 0,
    y: 2260,
    width: 1440,
    height: 650,
    fill: FINAL_COLOR.surface,
  });
  addFinalLabel(about, "A LITTLE ABOUT ME", 80, 80, 440);
  addFinalHeading(about, {
    characters: "Clear thinking, honest communication and a practical way forward.",
    fontSize: 50,
    lineHeight: 62,
    width: 760,
    x: 80,
    y: 145,
  });
  addFinalBody(about, {
    characters: "I’m Galician and live in Barcelona. My career began in administration, shifted into communications and digital marketing, and expanded into UX writing and B2B and B2C content. Helping people get what they need is the thread connecting it all.",
    fontSize: 20,
    lineHeight: 34,
    width: 500,
    x: 820,
    y: 180,
  });
  addFinalBody(about, {
    characters: "More about me  →",
    fontSize: 15,
    lineHeight: 24,
    color: FINAL_COLOR.inkMuted,
    width: 500,
    x: 820,
    y: 330,
  });

  addFinalBody(about, {
    characters: "SCROLLED STATE · fixed 24px from viewport bottom/right · hidden while hero is visible",
    font: FONT.montserratMedium,
    fontSize: 12,
    lineHeight: 20,
    color: FINAL_COLOR.inkMuted,
    width: 470,
    x: 790,
    y: 548,
  });
  const backToTop = createPill(about, {
    label: "↑",
    x: 1304,
    y: 525,
    width: 56,
    height: 56,
    fill: FINAL_COLOR.canvas,
    stroke: FINAL_COLOR.border,
    color: FINAL_COLOR.greenDeep,
    fontSize: 24,
    lineHeight: 28,
  });
  backToTop.name = "Back to top / Volver arriba — fixed scrolled state";

  createFinalContactFooter(page, 2910);

  const note = createCanvasFrame(page, {
    name: "Production snapshot notes",
    x: 0,
    y: 3760,
    width: 1440,
    height: 500,
    fill: FINAL_COLOR.canvas,
  });
  createRule(note, { x: 80, y: 60, width: 1280, color: FINAL_COLOR.border });
  addFinalBody(note, {
    characters: `Generated from the Astro production implementation · ${ABI_DESIGN_RELEASE.commit}\nHero source: src/assets/images/abilene-hero-v2.png · full-bleed image with editable copy and navigation layered above it.`,
    fontSize: 16,
    lineHeight: 27,
    color: FINAL_COLOR.inkMuted,
    width: 1120,
    x: 80,
    y: 110,
  });
  addFinalBody(note, {
    characters: "Interaction: Back to top / Volver arriba is fixed bottom-right, hidden while the hero is meaningfully visible and revealed afterwards. The Astro implementation uses minimal native JavaScript, visible keyboard focus, reduced-motion-aware scrolling and cookie-consent clearance.",
    fontSize: 15,
    lineHeight: 25,
    color: FINAL_COLOR.inkMuted,
    width: 1180,
    x: 80,
    y: 215,
  });
  addFinalBody(note, {
    characters: "Mobile: hero CTAs may stack; secondary projects stack with equal hierarchy; contact CTA precedes comfortably spaced utility links; the smaller back-to-top control keeps bottom-right position without obscuring content or consent UI. Spanish contact working copy: HABLEMOS · ¿Tienes un proyecto, una idea o simplemente quieres saludar?",
    fontSize: 15,
    lineHeight: 25,
    color: FINAL_COLOR.inkMuted,
    width: 1180,
    x: 80,
    y: 315,
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
  const placement = replacementPlacement(
    GENERATED_KIND.finalDirection,
    GENERATED_KIND.directionD,
  );
  await loadSynthesisFonts();
  const heroImageHash = findImageHashByName(FINAL_HERO_PHOTO);
  const section = createSection(
    "Final Direction — Clean Organic Editorial — Pre-production",
    placement.point,
    1800,
    5360,
    FINAL_COLOR.surface,
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
      characters: "Clean Organic Editorial has been refined around Abilene’s approved hero art direction. A/B/C/D remain history; this is the only working direction to advance.",
      fontSize: 19,
      lineHeight: 31,
      color: FINAL_COLOR.inkMuted,
      width: 1180,
      x: 180,
      y: 165,
    });
    createRule(section, { x: 180, y: 280, width: 1440, color: FINAL_COLOR.border });
    createFinalColumn(section, {
      x: 180,
      y: 330,
      width: 420,
      label: "TYPE",
      body: "Inter — H1/H2/H3, navigation and major metrics\nMontserrat Regular — body and supporting text\nComfortable measure and line height",
      bodySize: 17,
      lineHeight: 28,
    });
    createFinalColumn(section, {
      x: 690,
      y: 330,
      width: 420,
      label: "PALETTE HIERARCHY · DURABLE RULE",
      body: "NEUTRALS · dominant backgrounds\nDEEP GREEN · primary identity · navigation · links · primary CTA\nBURGUNDY · footer · terminal/contact emphasis · very occasional supporting detail",
      bodySize: 15,
      lineHeight: 24,
    });
    createFinalColumn(section, {
      x: 1200,
      y: 330,
      width: 420,
      label: "REMOVED",
      body: "No decorative ellipses or blobs · no portrait circle · no colored section blocks · no false hierarchy · no competing LinkedIn/CV hero actions",
      bodySize: 17,
      lineHeight: 28,
    });
    addFinalLabel(
      section,
      heroImageHash ? "ABILENEHERO.PNG LINKED · FULL-BLEED EDITABLE HERO SIMULATION" : "ABILENEHERO.PNG NOT FOUND — IMPORT IT ON THIS PAGE BEFORE REBUILDING",
      180,
      620,
      1320,
    );
    addFinalBody(section, {
      characters: `Authoritative art-direction reference: ${FINAL_HERO_REFERENCE_PATH} · approved for composition, atmosphere and palette · never as a flattened production asset`,
      fontSize: 15,
      lineHeight: 24,
      color: FINAL_COLOR.inkMuted,
      width: 1300,
      x: 180,
      y: 670,
    });
    createFinalHomepage(section, 180, 820, heroImageHash);
  });
  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(
    heroImageHash
      ? "Rebuilt the refined final direction with AbileneHero.png as the full-bleed hero."
      : "Rebuilt the refined final direction with a photo placeholder. Import AbileneHero.png on this page and rebuild to link it.",
  );
}

async function buildImaginartPreproductionLegacy() {
  if (figma.editorType !== "figma") {
    throw new Error("The final imaginArt direction can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  if (!normalizeName(figma.currentPage.name).includes("case studies")) {
    throw new Error(
      `Open the Case Studies page before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }
  const placement = replacementPlacement(
    GENERATED_KIND.imaginartPreproduction,
    GENERATED_KIND.imaginartReframed,
  );
  await loadSynthesisFonts();
  const section = createSection(
    "imaginArt — Final Direction — Pre-production",
    placement.point,
    1740,
    8680,
    FINAL_COLOR.surface,
    GENERATED_KIND.imaginartPreproduction,
  );
  const page = createCanvasFrame(section, {
    name: "imaginArt — editorial case-study pre-production",
    x: 150,
    y: 360,
    width: 1440,
    height: 8120,
    fill: FINAL_COLOR.canvas,
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
      characters: "The approved direction is now diagram-led, neutral and substantially less text-heavy. Detailed evidence constraints remain in docs/content/case-study-imaginart.md.",
      fontSize: 18,
      lineHeight: 29,
      color: FINAL_COLOR.inkMuted,
      width: 1180,
      x: 150,
      y: 160,
    });

    const hero = createCaseBand(page, { name: "01 Hero", y: 0, height: 620, fill: FINAL_COLOR.canvas });
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
    createRule(hero, { x: 80, y: 545, width: 1280, color: FINAL_COLOR.border });

    const context = createCaseBand(page, { name: "02 Context and collaboration", y: 620, height: 720, fill: FINAL_COLOR.surface });
    createFinalCaseHeading(context, "02", "Working between expertise and action", "CONTEXT + COLLABORATION", "Technical knowledge, customer reality, business validation and content execution informed one another.");
    createLineIcon(context, { icon: "network", x: 1280, y: 60, size: 42 });
    const networkNodes = [
      ["Engineering", "Technical knowledge", 150, 330],
      ["Sales", "Customer reality", 150, 505],
      ["Management", "Business validation", 1010, 330],
      ["Abilene", "Structure · framing · execution", 1010, 505],
    ];
    networkNodes.forEach(([title, body, nodeX, nodeY]) => {
      const node = createCanvasFrame(context, { name: `Collaboration — ${title}`, x: nodeX, y: nodeY, width: 280, height: 120, fill: FINAL_COLOR.canvas, stroke: FINAL_COLOR.border, radius: 6 });
      addFinalHeading(node, { characters: title, fontSize: 21, lineHeight: 28, width: 235, x: 22, y: 20 });
      addFinalBody(node, { characters: body, fontSize: 14, lineHeight: 22, color: FINAL_COLOR.inkMuted, width: 235, x: 22, y: 58 });
    });
    createRule(context, { x: 430, y: 390, width: 580, color: FINAL_COLOR.green });
    createRule(context, { x: 430, y: 565, width: 580, color: FINAL_COLOR.green });
    addFinalBody(context, { characters: "COLLABORATION · NOT A RIGID WATERFALL", font: FONT.montserratMedium, fontSize: 14, lineHeight: 22, color: FINAL_COLOR.greenDeep, width: 450, x: 495, y: 462 });

    const email = createCaseBand(page, { name: "03 Refreshing a specialist B2B newsletter", y: 1340, height: 1120, fill: FINAL_COLOR.canvas });
    createFinalCaseHeading(email, "STORY 01", "Refreshing a specialist B2B newsletter", "MUNDO BRIGHTSIGN", "The result followed a broader editorial revision—not one isolated change.");
    createLineIcon(email, { icon: "email", x: 1280, y: 60, size: 42 });
    createFinalColumn(email, { x: 160, y: 340, width: 500, label: "EARLIER EDITORIAL APPROACH", body: "Subject\nIntroduction\nContent\nAdditional content\nCTA", bodySize: 20, lineHeight: 36 });
    createFinalColumn(email, { x: 780, y: 340, width: 500, label: "REVISED EDITORIAL APPROACH", body: "Emoji + revised subject\nCloser professional tone\nCTA above the fold\nContent\nAdditional content", bodySize: 20, lineHeight: 36 });
    createLineIcon(email, { icon: "trend", x: 880, y: 800, size: 56, color: FINAL_COLOR.burgundy });
    addFinalHeading(email, { characters: "~24% → ~34%", fontSize: 68, lineHeight: 78, color: FINAL_COLOR.burgundy, width: 600, x: 160, y: 790 });
    addFinalBody(email, { characters: "Approximate open rate · recalled by Abilene · not audited", fontSize: 17, lineHeight: 28, width: 650, x: 160, y: 880 });
    addFinalBody(email, { characters: "NOT AN A/B TEST · no single change is presented as causal", font: FONT.montserratMedium, fontSize: 15, lineHeight: 24, color: FINAL_COLOR.inkMuted, width: 750, x: 160, y: 960 });

    const turtle = createCaseBand(page, { name: "04 Launching a new brand in Spain", y: 2460, height: 1080, fill: FINAL_COLOR.surface });
    createFinalCaseHeading(turtle, "STORY 02", "Launching a new brand in Spain", "TURTLE AV · IMAGINART", "Abilene structured the page herself, turning technical product input into usable B2B communication.");
    createLineIcon(turtle, { icon: "transform", x: 1280, y: 60, size: 42 });
    createFinalColumn(turtle, { x: 100, y: 350, width: 340, label: "RAW TECHNICAL INPUT", body: "4K · Dante · AES67\nPoE · HDR · latency\nRedundancy · compatibility", bodySize: 18 });
    createFinalColumn(turtle, { x: 550, y: 350, width: 340, label: "CONTENT STRATEGY / ARCHITECTURE", body: "Select · prioritize\nFeatures → benefits\nSpecs → applications\nFamilies → navigation", bodySize: 18 });
    createFinalColumn(turtle, { x: 1000, y: 350, width: 340, label: "CLEAR PRODUCT COMMUNICATION", body: "Value proposition\nBenefits\nSolutions\nTechnical detail\nApplications\nContact CTA", bodySize: 18 });
    addFinalHeading(turtle, { characters: "Technical truth → structure → usable B2B content", fontSize: 34, lineHeight: 45, width: 1040, x: 180, y: 840 });

    const event = createCaseBand(page, { name: "05 Planning and promoting a corporate event", y: 3540, height: 1160, fill: FINAL_COLOR.canvas });
    createFinalCaseHeading(event, "STORY 03", "Planning and promoting a corporate event", "IMAGINART · MADRID OPEN DAYS 2026", "One communication objective carried across the campaign system.");
    createLineIcon(event, { icon: "event", x: 1280, y: 60, size: 42 });
    createRule(event, { x: 120, y: 360, width: 1200, color: FINAL_COLOR.green });
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
      addFinalBody(event, { characters: body, fontSize: 16, lineHeight: 26, color: FINAL_COLOR.inkMuted, width: 250, x: itemX, y: 495 });
    });
    addFinalHeading(event, { characters: "~110–125", fontSize: 68, lineHeight: 78, color: FINAL_COLOR.greenDeep, width: 500, x: 180, y: 760 });
    addFinalBody(event, { characters: "attendees · usual similar-event range ~70–80", fontSize: 19, lineHeight: 31, width: 650, x: 180, y: 850 });
    addFinalBody(event, { characters: "Approximate recollections · no precise uplift · Bilbao supports repeatable event-communication evidence", fontSize: 15, lineHeight: 24, color: FINAL_COLOR.inkMuted, width: 920, x: 180, y: 930 });

    const catalogue = createCaseBand(page, { name: "06 Structuring a technical product catalogue", y: 4700, height: 1040, fill: FINAL_COLOR.surface });
    createFinalCaseHeading(catalogue, "STORY 04", "Structuring a technical product catalogue", "AV SUPPORTS CATALOGUE", "A content system for a large technical product set—not isolated descriptions.");
    createLineIcon(catalogue, { icon: "catalogue", x: 1280, y: 60, size: 42 });
    createFinalColumn(catalogue, { x: 120, y: 340, width: 320, label: "PRODUCT FAMILIES", body: "Index\nTaxonomy\nProduct categorization", bodySize: 18 });
    createFinalColumn(catalogue, { x: 560, y: 340, width: 320, label: "REPEATABLE STRUCTURE", body: "Description\nCompatible size\nWeight · VESA\nMovement · use case", bodySize: 18 });
    createFinalColumn(catalogue, { x: 1000, y: 340, width: 320, label: "CUSTOMER-FACING OUTPUT", body: "Technical-to-commercial copy\nConsistent sheets\nLayout · imagery\nSales enablement", bodySize: 18 });
    addFinalBody(catalogue, { characters: "Categorize → standardize → transform → enable", font: FONT.montserratMedium, fontSize: 18, lineHeight: 30, color: FINAL_COLOR.greenDeep, width: 900, x: 260, y: 835 });

    const lumens = createCaseBand(page, { name: "07 Adapting technical information for a B2B audience", y: 5740, height: 1040, fill: FINAL_COLOR.canvas });
    createFinalCaseHeading(lumens, "STORY 05", "Adapting technical information for a B2B audience", "LUMENS", "Technical content adaptation—not merely translation.");
    createLineIcon(lumens, { icon: "technical", x: 1280, y: 60, size: 42 });
    createFinalColumn(lumens, { x: 120, y: 340, width: 320, label: "MANUFACTURER DOCUMENTATION", body: "Source specifications\nFeatures\nApplications", bodySize: 18 });
    createFinalColumn(lumens, { x: 560, y: 340, width: 320, label: "ABILENE", body: "Select\nPrioritize\nAdapt\nStructure", bodySize: 18 });
    createFinalColumn(lumens, { x: 1000, y: 340, width: 320, label: "CLEAR B2B COMMUNICATION", body: "What does it do?\nWho is it for?\nWhy does it matter?\nHow can it be used?", bodySize: 18 });
    addFinalBody(lumens, { characters: "The underlying manufacturer specifications remain the source; the contribution is audience-aware selection, framing and communication.", fontSize: 16, lineHeight: 27, color: FINAL_COLOR.inkMuted, width: 980, x: 230, y: 835 });

    const outcomes = createCaseBand(page, { name: "08 Outcomes and evidence note", y: 6780, height: 920, fill: FINAL_COLOR.surfaceStrong });
    createFinalCaseHeading(outcomes, "08", "Evidence before polish", "APPROXIMATE RESULTS · INTERNAL PRE-PRODUCTION", "The design keeps factual caveats visible and lets diagrams carry most of the explanation.");
    createLineIcon(outcomes, { icon: "trend", x: 1280, y: 60, size: 42 });
    addFinalHeading(outcomes, { characters: "~24% → ~34%", fontSize: 54, lineHeight: 66, color: FINAL_COLOR.burgundy, width: 500, x: 180, y: 340 });
    addFinalBody(outcomes, { characters: "approximate open rate · not an A/B test", fontSize: 16, lineHeight: 25, width: 500, x: 180, y: 420 });
    addFinalHeading(outcomes, { characters: "~110–125", fontSize: 54, lineHeight: 66, color: FINAL_COLOR.greenDeep, width: 500, x: 800, y: 340 });
    addFinalBody(outcomes, { characters: "attendees · usual range ~70–80", fontSize: 16, lineHeight: 25, width: 500, x: 800, y: 420 });
    createRule(outcomes, { x: 180, y: 535, width: 1080, color: FINAL_COLOR.border });
    addFinalBody(outcomes, { characters: "Detailed facts, ownership, copyright boundaries and publication constraints live in docs/content/case-study-imaginart.md. No CTR, revenue, SEO growth, conversion or precise attendance uplift is invented.", fontSize: 17, lineHeight: 29, color: FINAL_COLOR.inkMuted, width: 1040, x: 180, y: 600 });
    addFinalBody(outcomes, { characters: "Conceptual density target: roughly 40% explanatory copy / 60% visual communication.", font: FONT.montserratMedium, fontSize: 16, lineHeight: 25, color: FINAL_COLOR.greenDeep, width: 850, x: 180, y: 770 });

    const stop = createCaseBand(page, { name: "09 Stop condition", y: 7700, height: 420, fill: FINAL_COLOR.canvas });
    createRule(stop, { x: 80, y: 70, width: 1280, color: FINAL_COLOR.border });
    addFinalHeading(stop, { characters: "Visual exploration is closed.", fontSize: 34, lineHeight: 44, width: 720, x: 80, y: 120 });
    addFinalBody(stop, { characters: "Next: production Foundations, then final Homepage and imaginArt desktop/mobile screens. Do not create another competing direction.", fontSize: 17, lineHeight: 28, color: FINAL_COLOR.inkMuted, width: 980, x: 80, y: 190 });
  });
  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage("Rebuilt the refined imaginArt pre-production direction with neutral bands, line icons and diagram-led storytelling.");
}

function createFinalImaginartHero(page) {
  const hero = createCaseBand(page, {
    name: "01 Hero",
    y: 0,
    height: 560,
    fill: CASE_COLOR.canvas,
  });
  addFinalLabel(hero, "CASE STUDY", 80, 70, 300);
  addFinalHeading(hero, {
    characters: "Making specialist B2B communication clearer",
    fontSize: 68,
    lineHeight: 80,
    width: 980,
    x: 80,
    y: 140,
  });
  addCaseBody(hero, {
    characters: "imaginArt · B2B content & communications\nCommunications Specialist · 2023–Present",
    width: 700,
    x: 80,
    y: 350,
  });
  createRule(hero, { x: 80, y: 515, width: 1280, color: FINAL_COLOR.border });
}

function createCurrentImaginartAtAGlance(page) {
  const overview = createCaseBand(page, {
    name: "02 At a glance",
    y: 560,
    height: 500,
    fill: CASE_COLOR.surface,
  });
  addFinalHeading(overview, {
    characters: "At a glance",
    fontSize: 44,
    lineHeight: 54,
    width: 600,
    x: 80,
    y: 70,
  });
  const items = [
    ["THE CHALLENGE", "Make specialist technical information clearer and easier to act on."],
    ["MY ROLE", "Communications Specialist"],
    ["WHAT I DID", "Content strategy · Product content · Email · Events"],
    ["EVIDENCE", "~24% → ~34% email open rate\n~110–125 event attendees\nApproximate recalled figures"],
  ];
  items.forEach(([label, value], index) => {
    const itemX = 80 + index * 320;
    createRule(overview, { x: itemX, y: 205, width: 280, color: FINAL_COLOR.border });
    addFinalLabel(overview, label, itemX, 235, 280);
    addFinalBody(overview, {
      characters: value,
      fontSize: 17,
      lineHeight: 28,
      width: 280,
      x: itemX,
      y: 285,
    });
    if (index > 0) {
      createRule(overview, { x: itemX - 20, y: 205, width: 1, height: 210, color: FINAL_COLOR.border });
    }
  });
}

function createCurrentImaginartIndex(page) {
  const indexBand = createCaseBand(page, {
    name: "03 In this case",
    y: 1060,
    height: 360,
    fill: CASE_COLOR.canvas,
  });
  addFinalLabel(indexBand, "IN THIS CASE", 80, 65, 280);
  const items = [
    ["01", "Newsletter"],
    ["02", "Brand launch"],
    ["03", "Corporate event"],
    ["04", "Product catalogue"],
    ["05", "Technical adaptation"],
  ];
  items.forEach(([number, label], itemIndex) => {
    const itemX = 80 + itemIndex * 256;
    createRule(indexBand, { x: itemX, y: 145, width: 220, color: FINAL_COLOR.border });
    addFinalLabel(indexBand, number, itemX, 175, 60);
    addFinalHeading(indexBand, {
      characters: label,
      fontSize: 20,
      lineHeight: 28,
      width: 205,
      x: itemX,
      y: 220,
    });
  });
}

function createCurrentImaginartSynthesis(page) {
  const synthesis = createCaseBand(page, {
    name: "10 The common thread",
    y: 8090,
    height: 500,
    fill: CASE_COLOR.canvas,
  });
  addFinalLabel(synthesis, "THE COMMON THREAD", 80, 70, 340);
  addFinalHeading(synthesis, {
    characters: "Making complex information clearer and more useful.",
    fontSize: 58,
    lineHeight: 69,
    width: 760,
    x: 80,
    y: 125,
  });
  addFinalBody(synthesis, {
    characters: "Across product content, email, events and catalogues, the work was about connecting specialist knowledge with what an audience actually needed to understand and do next.",
    fontSize: 20,
    lineHeight: 33,
    color: FINAL_COLOR.inkMuted,
    width: 510,
    x: 850,
    y: 155,
  });
}

function createCurrentImaginartCompetencies(page) {
  const competencies = createCaseBand(page, {
    name: "11 What this work shows",
    y: 8590,
    height: 520,
    fill: CASE_COLOR.surface,
  });
  addFinalHeading(competencies, {
    characters: "What this work shows",
    fontSize: 71,
    lineHeight: 80,
    width: 920,
    x: 80,
    y: 70,
  });
  const items = ["Content strategy", "Technical communication", "Campaign execution"];
  items.forEach((label, index) => {
    const itemX = 80 + index * 440;
    createRule(competencies, { x: itemX, y: 270, width: 400, color: FINAL_COLOR.border });
    if (index > 0) {
      createRule(competencies, { x: itemX - 40, y: 270, width: 1, height: 150, color: FINAL_COLOR.border });
    }
    addFinalHeading(competencies, {
      characters: label,
      fontSize: 39,
      lineHeight: 48,
      color: FINAL_COLOR.greenDeep,
      width: 380,
      x: itemX,
      y: 315,
    });
  });
}

function createFinalImaginartCollaboration(page, yOffset = 0) {
  const context = createCaseBand(page, {
    name: "02 Context and collaboration",
    y: 560 + yOffset,
    height: 820,
    fill: CASE_COLOR.surface,
  });
  createFinalCaseHeading(
    context,
    "02",
    "Working between expertise and action",
    "CONTEXT + COLLABORATION",
    "Technical knowledge and customer reality flowed through Abilene's content role before business and final validation.",
  );
  createLineIcon(context, { icon: "network", x: 1288, y: 64, size: 32 });
  createCaseDiagramNode(context, {
    title: "ENGINEERING",
    body: "Technical truth\nProduct knowledge",
    x: 80,
    y: 330,
    width: 300,
    height: 150,
  });
  createCaseDiagramNode(context, {
    title: "SALES",
    body: "Customer reality\nTarget needs",
    x: 80,
    y: 560,
    width: 300,
    height: 150,
  });
  createCaseDiagramNode(context, {
    title: "ABILENE",
    body: "Content structure\nFraming\nCopy\nChannel execution",
    x: 570,
    y: 410,
    width: 320,
    height: 230,
    fill: CASE_COLOR.surfaceStrong,
    stroke: FINAL_COLOR.greenDeep,
    strokeWeight: 2,
    bodySize: 18,
    lineHeight: 29,
  });
  createCaseDiagramNode(context, {
    title: "MANAGEMENT",
    body: "Business validation\nFinal validation",
    x: 1060,
    y: 440,
    width: 300,
    height: 170,
  });
  createRule(context, { x: 380, y: 405, width: 95, height: 3, color: FINAL_COLOR.green });
  createRule(context, { x: 473, y: 405, width: 3, height: 230, color: FINAL_COLOR.green });
  createRule(context, { x: 380, y: 632, width: 95, height: 3, color: FINAL_COLOR.green });
  createRule(context, { x: 475, y: 518, width: 95, height: 3, color: FINAL_COLOR.green });
  createCaseArrow(context, { x: 520, y: 493, size: 32 });
  createRule(context, { x: 890, y: 523, width: 170, height: 3, color: FINAL_COLOR.green });
  createCaseArrow(context, { x: 1015, y: 498, size: 32 });
  addFinalBody(context, {
    characters: "A simplified view of inputs and validation—not a rigid project-management waterfall.",
    fontSize: 15,
    lineHeight: 24,
    color: FINAL_COLOR.inkMuted,
    width: 760,
    x: 570,
    y: 720,
  });
}

function createFinalImaginartNewsletter(page, yOffset = 0) {
  const email = createCaseBand(page, {
    name: "03 Refreshing a specialist B2B newsletter",
    y: 1380 + yOffset,
    height: 1180,
    fill: CASE_COLOR.canvas,
  });
  createFinalCaseHeading(
    email,
    "STORY 01",
    "Refreshing a specialist B2B newsletter",
    "MUNDO BRIGHTSIGN",
    "The result followed a broader editorial revision—not one isolated change.",
  );
  createLineIcon(email, { icon: "email", x: 1288, y: 64, size: 32 });
  addFinalLabel(email, "EARLIER", 150, 330, 180);
  addFinalLabel(email, "REVISED", 1100, 330, 180);
  addFinalHeading(email, {
    characters: "~24%",
    fontSize: 54,
    lineHeight: 66,
    width: 210,
    x: 120,
    y: 390,
  });
  createEllipse(email, {
    name: "Earlier open-rate point",
    x: 365,
    y: 421,
    width: 20,
    height: 20,
    fill: FINAL_COLOR.inkMuted,
  });
  createRule(email, { x: 385, y: 429, width: 650, height: 4, color: FINAL_COLOR.border });
  createEllipse(email, {
    name: "Revised open-rate point",
    x: 1035,
    y: 421,
    width: 20,
    height: 20,
    fill: FINAL_COLOR.greenDeep,
  });
  addFinalHeading(email, {
    characters: "~34%",
    fontSize: 54,
    lineHeight: 66,
    color: FINAL_COLOR.greenDeep,
    width: 210,
    x: 1090,
    y: 390,
  });
  addFinalBody(email, {
    characters: "+10 percentage points approx.",
    font: FONT.montserratMedium,
    fontSize: 17,
    lineHeight: 27,
    color: FINAL_COLOR.greenDeep,
    width: 380,
    x: 515,
    y: 475,
  });
  addFinalBody(email, {
    characters: "approximate recalled open rate · not an A/B test",
    fontSize: 15,
    lineHeight: 24,
    color: FINAL_COLOR.inkMuted,
    width: 620,
    x: 410,
    y: 525,
  });
  createCaseDiagramNode(email, {
    title: "EARLIER EMAIL HIERARCHY",
    body: "Subject\nIntroduction\nContent\nAdditional content\nCTA",
    x: 140,
    y: 660,
    width: 500,
    height: 360,
    fill: CASE_COLOR.surface,
    bodySize: 17,
    lineHeight: 29,
  });
  createCaseDiagramNode(email, {
    title: "REVISED EMAIL HIERARCHY",
    body: "Emoji + revised subject\nCloser professional tone\nCTA above the fold\nContent\nAdditional content",
    x: 800,
    y: 660,
    width: 500,
    height: 360,
    fill: CASE_COLOR.surfaceStrong,
    stroke: FINAL_COLOR.green,
    bodySize: 17,
    lineHeight: 29,
  });
}

function createFinalImaginartTurtle(page, yOffset = 0) {
  const turtle = createCaseBand(page, {
    name: "04 Launching a new brand in Spain",
    y: 2560 + yOffset,
    height: 1240,
    fill: CASE_COLOR.surface,
  });
  createFinalCaseHeading(
    turtle,
    "STORY 02",
    "Launching a new brand in Spain",
    "TURTLE AV · IMAGINART",
    "Abilene structured the page herself, turning technical product input into usable B2B communication.",
  );
  createLineIcon(turtle, { icon: "transform", x: 1288, y: 64, size: 32 });
  createCaseDiagramNode(turtle, {
    title: "TECHNICAL INPUT",
    body: "4K · Dante · HDR\nLatency\nCompatibility",
    x: 80,
    y: 340,
    width: 250,
    height: 300,
    bodySize: 18,
    lineHeight: 31,
  });
  createCaseArrow(turtle, { x: 345, y: 455, size: 34 });
  createCaseDiagramNode(turtle, {
    title: "ABILENE",
    body: "Select\nPrioritize\nStructure\nTranslate",
    x: 395,
    y: 340,
    width: 280,
    height: 300,
    fill: CASE_COLOR.surfaceStrong,
    stroke: FINAL_COLOR.greenDeep,
    strokeWeight: 2,
    bodySize: 18,
    lineHeight: 31,
  });
  createCaseArrow(turtle, { x: 690, y: 455, size: 34 });
  createCaseDiagramNode(turtle, {
    title: "USABLE PRODUCT CONTENT",
    body: "Benefits\nApplications\nNavigation\nCTA",
    x: 740,
    y: 340,
    width: 270,
    height: 300,
    bodySize: 18,
    lineHeight: 31,
  });
  const artifact = createCanvasFrame(turtle, {
    name: "Rights-cleared real-work visual placeholder",
    x: 1050,
    y: 310,
    width: 310,
    height: 440,
    fill: CASE_COLOR.canvas,
    stroke: FINAL_COLOR.green,
    strokeWeight: 2,
    radius: 6,
  });
  addFinalLabel(artifact, "REAL-WORK VISUAL SLOT", 24, 28, 260);
  addFinalHeading(artifact, {
    characters: "Rights-cleared image pending",
    fontSize: 28,
    lineHeight: 37,
    width: 250,
    x: 24,
    y: 90,
  });
  addFinalBody(artifact, {
    characters: "Reserved for an approved page, product or process artifact. No fabricated client work.",
    fontSize: 16,
    lineHeight: 27,
    color: FINAL_COLOR.inkMuted,
    width: 250,
    x: 24,
    y: 205,
  });
  addFinalHeading(turtle, {
    characters: "Technical truth → structure → usable B2B content",
    fontSize: 36,
    lineHeight: 47,
    color: FINAL_COLOR.greenDeep,
    width: 1100,
    x: 140,
    y: 850,
  });
  addCaseBody(turtle, {
    characters: "The transformation is the story: preserving specialist accuracy while giving customers a clearer route through benefits, applications and action.",
    width: 1000,
    x: 220,
    y: 950,
  });
}

function createFinalImaginartEvent(page, yOffset = 0) {
  const event = createCaseBand(page, {
    name: "05 Planning and promoting a corporate event",
    y: 3800 + yOffset,
    height: 1260,
    fill: CASE_COLOR.canvas,
  });
  createFinalCaseHeading(
    event,
    "STORY 03",
    "Planning and promoting a corporate event",
    "IMAGINART · MADRID OPEN DAYS 2026",
    "One communication objective carried across the campaign system.",
  );
  createLineIcon(event, { icon: "event", x: 1288, y: 64, size: 32 });
  createCaseDiagramNode(event, {
    title: "MAILING",
    x: 550,
    y: 270,
    width: 340,
    height: 90,
    fill: CASE_COLOR.surface,
  });
  createCaseDiagramNode(event, {
    title: "WEB",
    x: 120,
    y: 405,
    width: 260,
    height: 90,
    fill: CASE_COLOR.surface,
  });
  createCaseDiagramNode(event, {
    title: "REGISTRATION",
    body: "Form + practical details",
    x: 550,
    y: 400,
    width: 340,
    height: 120,
    fill: CASE_COLOR.surfaceStrong,
    stroke: FINAL_COLOR.greenDeep,
    strokeWeight: 2,
    bodySize: 16,
    lineHeight: 25,
  });
  createCaseDiagramNode(event, {
    title: "LINKEDIN",
    x: 1060,
    y: 405,
    width: 260,
    height: 90,
    fill: CASE_COLOR.surface,
  });
  createCaseDiagramNode(event, {
    title: "CANVA / SUPPORT",
    x: 550,
    y: 565,
    width: 340,
    height: 90,
    fill: CASE_COLOR.surface,
  });
  createCaseDiagramNode(event, {
    title: "EVENT",
    x: 550,
    y: 700,
    width: 340,
    height: 90,
    fill: CASE_COLOR.surfaceStrong,
    stroke: FINAL_COLOR.green,
  });
  createRule(event, { x: 718, y: 360, width: 3, height: 40, color: FINAL_COLOR.green });
  createRule(event, { x: 380, y: 448, width: 170, height: 3, color: FINAL_COLOR.green });
  createRule(event, { x: 890, y: 448, width: 170, height: 3, color: FINAL_COLOR.green });
  createRule(event, { x: 718, y: 520, width: 3, height: 45, color: FINAL_COLOR.green });
  createRule(event, { x: 718, y: 655, width: 3, height: 45, color: FINAL_COLOR.green });
  createCaseArrow(event, { direction: "↓", x: 700, y: 660, size: 28 });
  addFinalLabel(event, "USUAL SIMILAR EVENTS", 180, 865, 340);
  addFinalBody(event, { characters: "~70", fontSize: 17, lineHeight: 27, width: 70, x: 520, y: 905 });
  createRule(event, { x: 600, y: 916, width: 240, height: 4, color: FINAL_COLOR.inkMuted });
  createRule(event, { x: 598, y: 904, width: 3, height: 28, color: FINAL_COLOR.inkMuted });
  createRule(event, { x: 840, y: 904, width: 3, height: 28, color: FINAL_COLOR.inkMuted });
  addFinalBody(event, { characters: "~80", fontSize: 17, lineHeight: 27, width: 70, x: 865, y: 905 });
  addFinalLabel(event, "CORPORATE EVENT", 180, 985, 340);
  addFinalBody(event, { characters: "~110", fontSize: 17, lineHeight: 27, width: 80, x: 500, y: 1025 });
  createRule(event, { x: 600, y: 1036, width: 470, height: 4, color: FINAL_COLOR.greenDeep });
  createRule(event, { x: 598, y: 1024, width: 3, height: 28, color: FINAL_COLOR.greenDeep });
  createRule(event, { x: 1070, y: 1024, width: 3, height: 28, color: FINAL_COLOR.greenDeep });
  addFinalBody(event, { characters: "~125", fontSize: 17, lineHeight: 27, width: 80, x: 1095, y: 1025 });
  addFinalBody(event, {
    characters: "approximate recalled attendance ranges · Bilbao supports repeatable event-communication evidence",
    fontSize: 15,
    lineHeight: 24,
    color: FINAL_COLOR.inkMuted,
    width: 900,
    x: 360,
    y: 1145,
  });
}

function createFinalImaginartCatalogue(page, yOffset = 0) {
  const catalogue = createCaseBand(page, {
    name: "06 Structuring a technical product catalogue",
    y: 5060 + yOffset,
    height: 1120,
    fill: CASE_COLOR.surfaceStrong,
  });
  createFinalCaseHeading(
    catalogue,
    "STORY 04",
    "Structuring a technical product catalogue",
    "AV SUPPORTS CATALOGUE",
    "A content system for a large technical product set—not isolated descriptions.",
  );
  createLineIcon(catalogue, { icon: "catalogue", x: 1288, y: 64, size: 32 });
  createCaseDiagramNode(catalogue, {
    title: "PRODUCT FAMILIES",
    body: "Index · taxonomy · categorization",
    x: 500,
    y: 280,
    width: 440,
    height: 130,
    fill: CASE_COLOR.canvas,
    bodySize: 17,
    lineHeight: 27,
  });
  createRule(catalogue, { x: 718, y: 410, width: 3, height: 80, color: FINAL_COLOR.green });
  createRule(catalogue, { x: 280, y: 488, width: 880, height: 3, color: FINAL_COLOR.green });
  for (const [title, nodeX] of [["WALL", 155], ["MOBILE", 595], ["CEILING", 1035]]) {
    createRule(catalogue, { x: nodeX + 125, y: 488, width: 3, height: 42, color: FINAL_COLOR.green });
    createCaseDiagramNode(catalogue, {
      title,
      x: nodeX,
      y: 530,
      width: 250,
      height: 95,
      fill: CASE_COLOR.canvas,
    });
  }
  createRule(catalogue, { x: 718, y: 625, width: 3, height: 65, color: FINAL_COLOR.green });
  createCaseArrow(catalogue, { direction: "↓", x: 700, y: 650, size: 28 });
  createCaseDiagramNode(catalogue, {
    title: "REPEATABLE PRODUCT STRUCTURE",
    body: "Description · compatible size · weight · VESA\nMovement · use case · CTA\n\nTechnical-to-commercial copy · consistent sheets · layout · imagery · sales enablement",
    x: 250,
    y: 710,
    width: 940,
    height: 300,
    fill: CASE_COLOR.canvas,
    stroke: FINAL_COLOR.green,
    strokeWeight: 2,
    bodySize: 18,
    lineHeight: 30,
  });
}

function createFinalImaginartLumens(page, yOffset = 0) {
  const lumens = createCaseBand(page, {
    name: "07 Adapting technical information for a B2B audience",
    y: 6180 + yOffset,
    height: 1050,
    fill: CASE_COLOR.canvas,
  });
  createFinalCaseHeading(
    lumens,
    "STORY 05",
    "Adapting technical information for a B2B audience",
    "LUMENS",
    "Technical content adaptation—not merely translation.",
  );
  createLineIcon(lumens, { icon: "technical", x: 1288, y: 64, size: 32 });
  createCaseDiagramNode(lumens, {
    title: "MANUFACTURER DOCUMENTATION",
    body: "Source specifications · features · applications",
    x: 240,
    y: 280,
    width: 960,
    height: 130,
    fill: CASE_COLOR.surface,
    bodySize: 17,
    lineHeight: 27,
  });
  createCaseArrow(lumens, { direction: "↓", x: 700, y: 420, size: 30 });
  createCaseDiagramNode(lumens, {
    title: "ABILENE",
    body: "Select · prioritize · adapt · structure",
    x: 400,
    y: 500,
    width: 640,
    height: 150,
    fill: CASE_COLOR.surfaceStrong,
    stroke: FINAL_COLOR.greenDeep,
    strokeWeight: 2,
    bodySize: 18,
    lineHeight: 30,
  });
  createCaseArrow(lumens, { direction: "↓", x: 700, y: 665, size: 30 });
  createCaseDiagramNode(lumens, {
    title: "B2B COMMUNICATION",
    body: "What does it do?        Who is it for?\nWhy does it matter?      How can it be used?",
    x: 180,
    y: 745,
    width: 1080,
    height: 210,
    fill: CASE_COLOR.surface,
    stroke: FINAL_COLOR.green,
    bodySize: 18,
    lineHeight: 32,
  });
  addFinalBody(lumens, {
    characters: "The manufacturer documentation remains the technical source; Abilene's contribution is audience-aware selection, framing and communication.",
    fontSize: 15,
    lineHeight: 24,
    color: FINAL_COLOR.inkMuted,
    width: 980,
    x: 230,
    y: 980,
  });
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
  const placement = replacementPlacement(
    GENERATED_KIND.imaginartPreproduction,
    GENERATED_KIND.imaginartReframed,
  );
  await loadSynthesisFonts();
  const section = createSection(
    "imaginArt — Final Direction — Visual refinement",
    placement.point,
    1740,
    8640,
    CASE_COLOR.surface,
    GENERATED_KIND.imaginartPreproduction,
  );
  const page = createCanvasFrame(section, {
    name: "imaginArt — editorial case study",
    x: 150,
    y: 360,
    width: 1440,
    height: 8080,
    fill: CASE_COLOR.canvas,
  });
  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "imaginArt — final visual refinement",
      fontSize: 42,
      lineHeight: 52,
      width: 1180,
      x: 150,
      y: 90,
    });
    addFinalBody(section, {
      characters: "Internal annotation · The public frame below is the approved case direction. Evidence and copyright constraints remain in docs/content/case-study-imaginart.md. The Turtle real-work image slot remains unresolved until a rights-cleared asset is explicitly approved.",
      fontSize: 18,
      lineHeight: 29,
      color: FINAL_COLOR.inkMuted,
      width: 1320,
      x: 150,
      y: 160,
    });
    createFinalImaginartHero(page);
    createFinalImaginartCollaboration(page);
    createFinalImaginartNewsletter(page);
    createFinalImaginartTurtle(page);
    createFinalImaginartEvent(page);
    createFinalImaginartCatalogue(page);
    createFinalImaginartLumens(page);
    createFinalContactFooter(page, 7230);
  });
  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(
    "Rebuilt the final imaginArt refinement with stronger neutral contrast, varied diagrams, integrated evidence and the approved contact footer.",
  );
}

function createAboutHeader(parent, dark = false) {
  const color = dark ? FINAL_COLOR.canvas : FINAL_COLOR.greenDeep;
  addFinalHeading(parent, {
    characters: "Abilene Caride",
    fontSize: 32,
    lineHeight: 38,
    color,
    width: 280,
    x: 80,
    y: 42,
  });
  for (const [label, itemX] of [
    ["Work", 960],
    ["About", 1080],
    ["Contact", 1205],
    ["ES", 1330],
  ]) {
    addFinalBody(parent, {
      characters: label,
      font: FONT.montserratMedium,
      fontSize: 15,
      lineHeight: 24,
      color,
      width: 90,
      x: itemX,
      y: 48,
    });
  }
}

function createAboutBackToTop(parent, x, y) {
  const control = createPill(parent, {
    label: "↑",
    x,
    y,
    width: 56,
    height: 56,
    fill: FINAL_COLOR.canvas,
    stroke: FINAL_COLOR.border,
    color: FINAL_COLOR.greenDeep,
    fontSize: 24,
    lineHeight: 28,
  });
  control.name = "Back to top / Volver arriba — fixed scrolled state";
  return control;
}

function createAboutDesktop(parent, x, y, photoHash) {
  const page = createCanvasFrame(parent, {
    name: "About — Final pre-production",
    x,
    y,
    width: 1440,
    height: 7230,
    fill: FINAL_COLOR.canvas,
  });

  const hero = createCaseBand(page, {
    name: "01 About hero",
    y: 0,
    height: 1120,
    fill: FINAL_COLOR.canvas,
  });
  createAboutHeader(hero);
  addFinalLabel(hero, "ABOUT", 80, 190, 240);
  addFinalHeading(hero, {
    characters: "I help people find the way to do what they want.",
    fontSize: 58,
    lineHeight: 69,
    width: 640,
    x: 80,
    y: 240,
  });
  addFinalBody(hero, {
    characters: "Helping is the thread running through my work. I want people to understand what they need, find their way forward and feel that communication is working with them rather than against them.\n\nProfessionally, I do that through words.",
    fontSize: 20,
    lineHeight: 33,
    width: 620,
    x: 80,
    y: 480,
  });
  addFinalBody(hero, {
    characters: "I wear a lot of hats, but I don’t do things halfway. Whether I’m structuring technical information, writing a campaign or thinking through a user experience, I care about making it useful and getting it right.",
    fontSize: 20,
    lineHeight: 33,
    width: 620,
    x: 80,
    y: 760,
  });
  const photo = createCanvasFrame(hero, {
    name: `About portrait — full body — ${FINAL_ABOUT_PHOTO}`,
    x: 790,
    y: 120,
    width: 650,
    height: 1000,
    fill: FINAL_COLOR.surfaceStrong,
    clipsContent: true,
  });
  applyImageFill(photo, photoHash, "FIT");

  const path = createCaseBand(page, {
    name: "02 How I got here",
    y: 1120,
    height: 880,
    fill: CASE_COLOR.surface,
  });
  addFinalLabel(path, "HOW I GOT HERE", 80, 72, 280);
  addFinalHeading(path, {
    characters: "Words became the way I could be more useful.",
    fontSize: 48,
    lineHeight: 59,
    width: 760,
    x: 80,
    y: 125,
  });
  addFinalBody(path, {
    characters: "In my first jobs I realised how much the right words could change whether someone understood, trusted or acted. That made me want to learn how to reach people better, communicate better and ultimately be more useful.",
    fontSize: 20,
    lineHeight: 33,
    width: 510,
    x: 850,
    y: 135,
  });
  const pathItems = [
    ["administration", "Administration", "Business foundations"],
    ["communication", "Communication", "Reaching people"],
    ["writing", "UX Writing", "Removing friction"],
    ["compass", "Today", "Content strategy · Communications · Business"],
  ];
  pathItems.forEach(([icon, title, meta], index) => {
    const itemX = 80 + index * 335;
    createLineIcon(path, { icon, x: itemX, y: 455, size: 48 });
    addFinalHeading(path, {
      characters: title,
      fontSize: 26,
      lineHeight: 34,
      width: 260,
      x: itemX,
      y: 535,
    });
    addFinalBody(path, {
      characters: meta,
      fontSize: 16,
      lineHeight: 25,
      color: FINAL_COLOR.inkMuted,
      width: 245,
      x: itemX,
      y: 585,
    });
    if (index < pathItems.length - 1) {
      createCaseArrow(path, { x: itemX + 270, y: 466, size: 32 });
    }
  });

  const principles = createCaseBand(page, {
    name: "03 How I work",
    y: 2000,
    height: 800,
    fill: CASE_COLOR.canvas,
  });
  addFinalLabel(principles, "HOW I WORK", 80, 72, 260);
  addFinalHeading(principles, {
    characters: "Clear. Honest. Practical.",
    fontSize: 52,
    lineHeight: 64,
    width: 900,
    x: 80,
    y: 125,
  });
  const principleItems = [
    ["clear", "Clear", "I make complex information understandable."],
    ["honest", "Honest", "I don’t think communication needs to sound complicated to be professional."],
    ["practical", "Practical", "Good content should help the audience and make sense for the business behind it."],
  ];
  principleItems.forEach(([icon, title, body], index) => {
    const itemX = 80 + index * 440;
    if (index > 0) {
      createRule(principles, { x: itemX - 40, y: 340, width: 2, height: 300, color: FINAL_COLOR.border });
    }
    createLineIcon(principles, { icon, x: itemX, y: 330, size: 56 });
    addFinalHeading(principles, {
      characters: title,
      fontSize: 34,
      lineHeight: 43,
      width: 330,
      x: itemX,
      y: 425,
    });
    addFinalBody(principles, {
      characters: body,
      fontSize: 20,
      lineHeight: 33,
      width: 330,
      x: itemX,
      y: 500,
    });
  });

  const experience = createCaseBand(page, {
    name: "04 Experience — compact editorial timeline",
    y: 2800,
    height: 1240,
    fill: CASE_COLOR.surfaceStrong,
  });
  addFinalLabel(experience, "EXPERIENCE", 80, 72, 260);
  addFinalHeading(experience, {
    characters: "A broad profile, built deliberately.",
    fontSize: 48,
    lineHeight: 59,
    width: 760,
    x: 80,
    y: 125,
  });
  addFinalBody(experience, {
    characters: "The through-line is useful communication—not a list of every task.",
    fontSize: 20,
    lineHeight: 33,
    color: FINAL_COLOR.inkMuted,
    width: 520,
    x: 820,
    y: 145,
  });
  const roles = [
    ["2023–present", "imaginArt", "Content, communications and marketing"],
    ["2020–2021", "Federación Pantalla", "Communication and community"],
    ["2019–2021", "Ailanto", "Content, ecommerce and customer care"],
    ["2017–2019", "Ethic Investors", "Administration and commercial content"],
    ["2011–2019", "Caprichos de Casa Import", "E-commerce manager · Administration, sales and business operations"],
  ];
  roles.forEach(([period, company, role], index) => {
    const rowY = 330 + index * 165;
    createRule(experience, { x: 80, y: rowY, width: 1280, color: FINAL_COLOR.border });
    addFinalLabel(experience, period, 80, rowY + 35, 220);
    addFinalHeading(experience, {
      characters: company,
      fontSize: index === 0 ? 30 : 26,
      lineHeight: 38,
      width: 420,
      x: 330,
      y: rowY + 28,
    });
    addFinalBody(experience, {
      characters: role,
      fontSize: 18,
      lineHeight: 29,
      color: FINAL_COLOR.inkMuted,
      width: 520,
      x: 820,
      y: rowY + 34,
    });
  });

  const education = createCaseBand(page, {
    name: "05 Education — compact supporting context",
    y: 4040,
    height: 720,
    fill: CASE_COLOR.canvas,
  });
  addFinalLabel(education, "EDUCATION", 80, 72, 260);
  addFinalHeading(education, {
    characters: "Learning that explains the path.",
    fontSize: 46,
    lineHeight: 57,
    width: 720,
    x: 80,
    y: 125,
  });
  const studies = [
    ["Postgraduate in UX Writing", "2021–2022"],
    ["Proficiency English Certificate - Cambridge C2 (2024)", ""],
    ["Degree in Communication", "2014–2021"],
    ["Administration and Finance", "2009–2011"],
  ];
  studies.forEach(([study, period], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const itemX = 80 + column * 660;
    const itemY = 330 + row * 150;
    createRule(education, { x: itemX, y: itemY, width: 580, color: FINAL_COLOR.border });
    addFinalHeading(education, {
      characters: study,
      fontSize: 24,
      lineHeight: 32,
      width: 440,
      x: itemX,
      y: itemY + 28,
    });
    addFinalLabel(education, period, itemX + 455, itemY + 34, 125);
  });

  const personal = createCaseBand(page, {
    name: "06 A little more about me",
    y: 4760,
    height: 960,
    fill: CASE_COLOR.surface,
  });
  addFinalLabel(personal, "A LITTLE MORE ABOUT ME", 80, 72, 340);
  addFinalHeading(personal, {
    characters: "Where the work comes from.",
    fontSize: 48,
    lineHeight: 59,
    width: 760,
    x: 80,
    y: 125,
  });
  const personalItems = [
    ["compass", "Galicia", "Galicia taught me hard work — and gave me wings to see the world."],
    ["leaf", "Sustainability", "Sustainability is one of the pivots of my life."],
    ["spark", "Personality", "I’m down-to-earth, but my mind rarely stops."],
    ["home", "Location", "Based in Barcelona. Galician at heart."],
  ];
  personalItems.forEach(([icon, title, body], index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const itemX = 80 + column * 660;
    const itemY = 330 + row * 260;
    createLineIcon(personal, { icon, x: itemX, y: itemY, size: 42 });
    addFinalHeading(personal, {
      characters: title,
      fontSize: 28,
      lineHeight: 36,
      width: 460,
      x: itemX + 75,
      y: itemY,
    });
    addFinalBody(personal, {
      characters: body,
      fontSize: 20,
      lineHeight: 33,
      width: 500,
      x: itemX + 75,
      y: itemY + 65,
    });
  });

  const languages = createCaseBand(page, {
    name: "07 Languages — compact",
    y: 5720,
    height: 660,
    fill: CASE_COLOR.canvas,
  });
  addFinalLabel(languages, "LANGUAGES", 80, 72, 260);
  addFinalHeading(languages, {
    characters: "Different ways of listening.",
    fontSize: 46,
    lineHeight: 57,
    width: 700,
    x: 80,
    y: 125,
  });
  addFinalBody(languages, {
    characters: "Spanish · native     Galician · native     English · C2     Catalan · B1",
    font: FONT.montserratMedium,
    fontSize: 20,
    lineHeight: 34,
    width: 1180,
    x: 80,
    y: 330,
  });
  createRule(languages, { x: 80, y: 420, width: 1280, color: FINAL_COLOR.border });
  addFinalBody(languages, {
    characters: "Also part of the picture: sign language · Portuguese · Korean",
    fontSize: 18,
    lineHeight: 30,
    color: FINAL_COLOR.inkMuted,
    width: 920,
    x: 80,
    y: 465,
  });

  createFinalContactFooter(page, 6380);
  createAboutBackToTop(page, 1304, 6210);

  return page;
}

function createAboutMobileFooter(parent, y) {
  const footer = createCanvasFrame(parent, {
    name: "Contact footer — mobile burgundy terminal section",
    x: 0,
    y,
    width: 390,
    height: 1200,
    fill: FINAL_COLOR.burgundy,
  });
  createTransparentBrandMark(footer, {
    name: "Footer watermark — mobile · approved transparent brand mark",
    x: 210,
    y: 300,
    size: 270,
  });
  addFinalBody(footer, { characters: "LET’S TALK", font: FONT.montserratMedium, fontSize: 13, lineHeight: 21, color: FINAL_COLOR.canvas, width: 310, x: 28, y: 65 });
  addFinalHeading(footer, { characters: "Have a project, an idea,\nor just want to say hello?", fontSize: 38, lineHeight: 48, color: FINAL_COLOR.canvas, width: 330, x: 28, y: 120 });
  addFinalBody(footer, { characters: "abicaride@gmail.com  →", font: FONT.montserratMedium, fontSize: 19, lineHeight: 30, color: FINAL_COLOR.canvas, width: 330, x: 28, y: 330 });
  createRule(footer, { x: 28, y: 450, width: 334, color: FINAL_COLOR.burgundyTint });
  createTransparentBrandMark(footer, { name: "Footer identity mark — mobile · approved transparent brand mark", x: 28, y: 490, size: 46, opacity: 1 });
  addFinalHeading(footer, { characters: "Abilene Caride", fontSize: 17, lineHeight: 25, color: FINAL_COLOR.canvas, width: 260, x: 92, y: 492 });
  addFinalBody(footer, { characters: "Content strategy · Communications · Business", fontSize: 12, lineHeight: 21, color: FINAL_COLOR.surface, width: 270, x: 92, y: 526 });
  createRule(footer, { x: 28, y: 610, width: 334, color: FINAL_COLOR.burgundyTint });
  addFinalBody(footer, { characters: "PRIVACY", font: FONT.montserratMedium, fontSize: 11, lineHeight: 19, color: FINAL_COLOR.canvas, width: 220, x: 28, y: 650 });
  addFinalBody(footer, { characters: "Privacy & cookies\nCookie settings", fontSize: 13, lineHeight: 40, color: FINAL_COLOR.surface, width: 250, x: 28, y: 686 });
  createLineIcon(footer, { icon: "settings", x: 160, y: 733, size: 17, strokeWidth: 1.5, color: FINAL_COLOR.surface });
  createRule(footer, { x: 28, y: 780, width: 334, color: FINAL_COLOR.burgundyTint });
  addFinalBody(footer, { characters: "LANGUAGE", font: FONT.montserratMedium, fontSize: 11, lineHeight: 19, color: FINAL_COLOR.canvas, width: 220, x: 28, y: 820 });
  addFinalBody(footer, { characters: "EN     ES", font: FONT.montserratMedium, fontSize: 13, lineHeight: 22, color: FINAL_COLOR.surface, width: 150, x: 28, y: 855 });
  createRule(footer, { x: 28, y: 885, width: 22, height: 2, color: FINAL_COLOR.canvas });
  createRule(footer, { x: 28, y: 925, width: 334, color: FINAL_COLOR.burgundyTint });
  addFinalBody(footer, { characters: "HOW IT’S MADE", font: FONT.montserratMedium, fontSize: 11, lineHeight: 19, color: FINAL_COLOR.canvas, width: 220, x: 28, y: 962 });
  addFinalBody(footer, { characters: "Made with 🎨 Figma, 🚀 Astro, ✍️ Pages CMS, 🤖 Codex and lots of ❤️.  →", fontSize: 13, lineHeight: 23, color: FINAL_COLOR.surface, width: 330, x: 28, y: 998 });
  createRule(footer, { x: 28, y: 1105, width: 334, color: FINAL_COLOR.burgundyTint });
  addFinalBody(footer, { characters: "© 2026 Abilene Caride. All rights reserved.", fontSize: 12, lineHeight: 21, color: FINAL_COLOR.surface, width: 320, x: 28, y: 1138 });
  return footer;
}

function createAboutMobile(parent, x, y, photoHash) {
  const page = createCanvasFrame(parent, {
    name: "About — Final pre-production — Mobile",
    x,
    y,
    width: 390,
    height: 8400,
    fill: FINAL_COLOR.canvas,
  });
  addFinalHeading(page, { characters: "Abilene Caride", fontSize: 25, lineHeight: 31, width: 240, x: 28, y: 30 });
  addFinalBody(page, { characters: "Menu", font: FONT.montserratMedium, fontSize: 14, lineHeight: 22, color: FINAL_COLOR.greenDeep, width: 70, x: 310, y: 35 });
  addFinalLabel(page, "ABOUT", 28, 125, 180);
  addFinalHeading(page, { characters: "I help people find the way to do what they want.", fontSize: 43, lineHeight: 52, width: 334, x: 28, y: 170 });
  addFinalBody(page, { characters: "Helping is the thread running through my work. I want people to understand what they need and find their way forward.\n\nProfessionally, I do that through words.", fontSize: 18, lineHeight: 30, width: 334, x: 28, y: 410 });
  addFinalBody(page, { characters: "I wear a lot of hats, but I don’t do things halfway. I care about making communication useful and getting it right.", fontSize: 18, lineHeight: 30, width: 334, x: 28, y: 690 });
  const photo = createCanvasFrame(page, { name: `About portrait — mobile — ${FINAL_ABOUT_PHOTO}`, x: 0, y: 930, width: 390, height: 570, fill: FINAL_COLOR.surfaceStrong, clipsContent: true });
  applyImageFill(photo, photoHash, "FIT");

  const path = createCanvasFrame(page, { name: "Mobile — How I got here", x: 0, y: 1500, width: 390, height: 1000, fill: CASE_COLOR.surface });
  addFinalLabel(path, "HOW I GOT HERE", 28, 55, 250);
  addFinalHeading(path, { characters: "Words became the way I could be more useful.", fontSize: 34, lineHeight: 43, width: 334, x: 28, y: 100 });
  const pathItems = [
    ["administration", "Administration", "Business foundations"],
    ["communication", "Communication", "Reaching people"],
    ["writing", "UX Writing", "Removing friction"],
    ["compass", "Today", "Content strategy · Communications · Business"],
  ];
  pathItems.forEach(([icon, title, meta], index) => {
    const itemY = 320 + index * 155;
    createLineIcon(path, { icon, x: 28, y: itemY, size: 38 });
    addFinalHeading(path, { characters: title, fontSize: 23, lineHeight: 30, width: 260, x: 90, y: itemY - 2 });
    addFinalBody(path, { characters: meta, fontSize: 14, lineHeight: 23, color: FINAL_COLOR.inkMuted, width: 260, x: 90, y: itemY + 38 });
    if (index < pathItems.length - 1) createRule(path, { x: 46, y: itemY + 92, width: 2, height: 42, color: FINAL_COLOR.green });
  });

  const principles = createCanvasFrame(page, { name: "Mobile — How I work", x: 0, y: 2500, width: 390, height: 1100, fill: CASE_COLOR.canvas });
  addFinalLabel(principles, "HOW I WORK", 28, 55, 220);
  addFinalHeading(principles, { characters: "Clear. Honest. Practical.", fontSize: 36, lineHeight: 45, width: 334, x: 28, y: 100 });
  const principleItems = [
    ["clear", "Clear", "I make complex information understandable."],
    ["honest", "Honest", "Communication doesn’t need to sound complicated to be professional."],
    ["practical", "Practical", "Good content should help the audience and the business behind it."],
  ];
  principleItems.forEach(([icon, title, body], index) => {
    const itemY = 265 + index * 245;
    createLineIcon(principles, { icon, x: 28, y: itemY, size: 42 });
    addFinalHeading(principles, { characters: title, fontSize: 27, lineHeight: 35, width: 250, x: 95, y: itemY });
    addFinalBody(principles, { characters: body, fontSize: 18, lineHeight: 30, width: 320, x: 28, y: itemY + 75 });
    if (index < 2) createRule(principles, { x: 28, y: itemY + 195, width: 334, color: FINAL_COLOR.border });
  });

  const experience = createCanvasFrame(page, { name: "Mobile — Experience", x: 0, y: 3600, width: 390, height: 1300, fill: CASE_COLOR.surfaceStrong });
  addFinalLabel(experience, "EXPERIENCE", 28, 55, 220);
  addFinalHeading(experience, { characters: "A broad profile, built deliberately.", fontSize: 34, lineHeight: 43, width: 334, x: 28, y: 100 });
  const roles = [
    ["2023–present", "imaginArt", "Content, communications and marketing"],
    ["2020–2021", "Federación Pantalla", "Communication and community"],
    ["2019–2021", "Ailanto", "Content, ecommerce and customer care"],
    ["2017–2019", "Ethic Investors", "Administration and commercial content"],
    ["2011–2019", "Caprichos de Casa Import", "E-commerce manager · Administration, sales and business operations"],
  ];
  roles.forEach(([period, company, role], index) => {
    const rowY = 300 + index * 180;
    createRule(experience, { x: 28, y: rowY, width: 334, color: FINAL_COLOR.border });
    addFinalLabel(experience, period, 28, rowY + 24, 160);
    addFinalHeading(experience, { characters: company, fontSize: 22, lineHeight: 29, width: 330, x: 28, y: rowY + 62 });
    addFinalBody(experience, { characters: role, fontSize: 14, lineHeight: 23, color: FINAL_COLOR.inkMuted, width: 330, x: 28, y: rowY + 105 });
  });

  const education = createCanvasFrame(page, { name: "Mobile — Education", x: 0, y: 4900, width: 390, height: 700, fill: CASE_COLOR.canvas });
  addFinalLabel(education, "EDUCATION", 28, 55, 220);
  addFinalHeading(education, { characters: "Learning that explains the path.", fontSize: 33, lineHeight: 42, width: 334, x: 28, y: 100 });
  addFinalBody(education, { characters: "Postgraduate in UX Writing\nProficiency English Certificate - Cambridge C2 (2024)\nDegree in Communication\nAdministration and Finance", fontSize: 18, lineHeight: 52, width: 334, x: 28, y: 270 });

  const personal = createCanvasFrame(page, { name: "Mobile — A little more about me", x: 0, y: 5600, width: 390, height: 1000, fill: CASE_COLOR.surface });
  addFinalLabel(personal, "A LITTLE MORE ABOUT ME", 28, 55, 300);
  addFinalHeading(personal, { characters: "Where the work comes from.", fontSize: 34, lineHeight: 43, width: 334, x: 28, y: 100 });
  const personalItems = [
    ["compass", "Galicia taught me hard work — and gave me wings to see the world."],
    ["leaf", "Sustainability is one of the pivots of my life."],
    ["spark", "I’m down-to-earth, but my mind rarely stops."],
    ["home", "Based in Barcelona. Galician at heart."],
  ];
  personalItems.forEach(([icon, body], index) => {
    const itemY = 275 + index * 170;
    createLineIcon(personal, { icon, x: 28, y: itemY, size: 38 });
    addFinalBody(personal, { characters: body, fontSize: 18, lineHeight: 30, width: 275, x: 90, y: itemY - 2 });
  });

  const languages = createCanvasFrame(page, { name: "Mobile — Languages", x: 0, y: 6600, width: 390, height: 600, fill: CASE_COLOR.canvas });
  addFinalLabel(languages, "LANGUAGES", 28, 55, 220);
  addFinalHeading(languages, { characters: "Different ways of listening.", fontSize: 33, lineHeight: 42, width: 334, x: 28, y: 100 });
  addFinalBody(languages, { characters: "Spanish · native\nGalician · native\nEnglish · C2\nCatalan · B1", font: FONT.montserratMedium, fontSize: 18, lineHeight: 40, width: 334, x: 28, y: 250 });
  addFinalBody(languages, { characters: "Sign language · Portuguese · Korean", fontSize: 14, lineHeight: 23, color: FINAL_COLOR.inkMuted, width: 334, x: 28, y: 455 });

  createAboutMobileFooter(page, 7200);
  const control = createAboutBackToTop(page, 306, 7040);
  control.resize(48, 48);
  return page;
}

async function buildAboutPreproduction() {
  if (figma.editorType !== "figma") {
    throw new Error("The final About direction can only be created in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  const pageName = normalizeName(figma.currentPage.name);
  if (!pageName.includes("archive") && !pageName.includes("about")) {
    throw new Error(`Open the Archive/About page before running this command. Current page: “${figma.currentPage.name}”.`);
  }
  const placement = replacementPlacement(GENERATED_KIND.aboutPreproduction);
  await loadSynthesisFonts();
  const photoHash = findImageHashByName(FINAL_ABOUT_PHOTO);
  const section = createSection(
    "About — Final pre-production",
    placement.point,
    2350,
    9000,
    CASE_COLOR.surface,
    GENERATED_KIND.aboutPreproduction,
  );
  populateSectionSafely(section, () => {
    addFinalHeading(section, { characters: "About — Final pre-production", fontSize: 42, lineHeight: 52, width: 1100, x: 150, y: 70 });
    addFinalBody(section, { characters: "One approved direction · Desktop and mobile composition · Working public copy remains subject to Abilene’s voice review.", fontSize: 18, lineHeight: 29, color: FINAL_COLOR.inkMuted, width: 1250, x: 150, y: 130 });
    addFinalBody(section, { characters: photoHash ? "APPROVED FULL-BODY PORTRAIT LINKED FROM ABILENEABOUT" : "PHOTO PENDING · Import the approved full-body red-top / grey-skirt portrait on this page, name the image layer AbileneAbout, then rebuild. No substitute or generated likeness is used.", font: FONT.montserratMedium, fontSize: 14, lineHeight: 23, color: photoHash ? FINAL_COLOR.greenDeep : FINAL_COLOR.burgundy, width: 1500, x: 150, y: 195 });
    createAboutDesktop(section, 150, 330, photoHash);
    createAboutMobile(section, 1790, 330, photoHash);
    addFinalBody(section, { characters: "PRODUCTION NOTES · Back to top appears after the hero leaves view, remains keyboard accessible, respects reduced motion and clears consent UI. The tools inventory is intentionally omitted. ‘Sign language · bilingual’ is not strengthened in this direction; final wording needs verification. imaginArt · 2023–present is confirmed by Abilene; update the older production profile value during implementation.", fontSize: 15, lineHeight: 25, color: FINAL_COLOR.inkMuted, width: 1420, x: 150, y: 7670 });
  });
  placement.existing?.remove();
  if (
    normalizeName(figma.currentPage.name).includes("archive") &&
    !normalizeName(figma.currentPage.name).includes("about")
  ) {
    figma.currentPage.name = "03 — About + Archive";
  }
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(photoHash ? "Rebuilt the final About desktop and mobile direction with the approved portrait." : "Rebuilt the final About direction with a safe portrait slot. Import the approved photo as AbileneAbout and rerun to link it.");
}

async function publishCurrentHomepage() {
  if (figma.editorType !== "figma") {
    throw new Error("The Homepage snapshot can only be published in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  if (!normalizeName(figma.currentPage.name).includes("homepage")) {
    throw new Error(`Open the Homepage page before publishing. Current page: “${figma.currentPage.name}”.`);
  }

  const placement = productionSnapshotPlacement(GENERATED_KIND.currentHomepage);
  await loadSynthesisFonts();
  const heroImageHash = bundledImageHash("hero");
  const section = createSection(
    "Homepage — production snapshot",
    placement.point,
    1740,
    5060,
    CASE_COLOR.surface,
    GENERATED_KIND.currentHomepage,
  );
  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "Homepage — current production snapshot",
      fontSize: 42,
      lineHeight: 52,
      width: 1160,
      x: 150,
      y: 70,
    });
    addFinalBody(section, {
      characters: `CURRENT · Design release ${ABI_DESIGN_RELEASE.version} · Source ${ABI_DESIGN_RELEASE.commit}\nGenerated from src/components/pages/HomePage.astro, localized production copy, production tokens and the bundled hero source image.`,
      fontSize: 18,
      lineHeight: 29,
      color: FINAL_COLOR.inkMuted,
      width: 1380,
      x: 150,
      y: 135,
    });
    const page = createFinalHomepage(section, 150, 360, heroImageHash);
    page.name = "Homepage — desktop · current production snapshot";
  });
  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(`Published the editable Homepage snapshot from design release ${ABI_DESIGN_RELEASE.version}.`);
}

async function publishCurrentImaginart() {
  if (figma.editorType !== "figma") {
    throw new Error("The imaginArt snapshot can only be published in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  if (!normalizeName(figma.currentPage.name).includes("case studies")) {
    throw new Error(`Open the Case Studies page before publishing. Current page: “${figma.currentPage.name}”.`);
  }

  const placement = productionSnapshotPlacement(GENERATED_KIND.currentImaginart);
  await loadSynthesisFonts();
  const section = createSection(
    "imaginArt — production snapshot",
    placement.point,
    1740,
    10520,
    CASE_COLOR.surface,
    GENERATED_KIND.currentImaginart,
  );
  const page = createCanvasFrame(section, {
    name: "imaginArt case study — desktop · current production snapshot",
    x: 150,
    y: 360,
    width: 1440,
    height: 9960,
    fill: CASE_COLOR.canvas,
  });
  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "imaginArt — current production snapshot",
      fontSize: 42,
      lineHeight: 52,
      width: 1180,
      x: 150,
      y: 70,
    });
    addFinalBody(section, {
      characters: `CURRENT · Design release ${ABI_DESIGN_RELEASE.version} · Source ${ABI_DESIGN_RELEASE.commit}\nGenerated from src/components/case-studies/ImaginartCaseStudy.astro, src/data/imaginartCase.ts and src/data/selectedCaseDetails.ts. Approximate metrics retain their public caveats.`,
      fontSize: 18,
      lineHeight: 29,
      color: FINAL_COLOR.inkMuted,
      width: 1380,
      x: 150,
      y: 135,
    });
    createFinalImaginartHero(page);
    createCurrentImaginartAtAGlance(page);
    createCurrentImaginartIndex(page);
    createFinalImaginartCollaboration(page, 860);
    createFinalImaginartNewsletter(page, 860);
    createFinalImaginartTurtle(page, 860);
    createFinalImaginartEvent(page, 860);
    createFinalImaginartCatalogue(page, 860);
    createFinalImaginartLumens(page, 860);
    createCurrentImaginartSynthesis(page);
    createCurrentImaginartCompetencies(page);
    createFinalContactFooter(page, 9110);
  });
  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(`Published the editable imaginArt snapshot from design release ${ABI_DESIGN_RELEASE.version}.`);
}

async function publishCurrentAbout() {
  if (figma.editorType !== "figma") {
    throw new Error("The About snapshot can only be published in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.personal);
  const pageName = normalizeName(figma.currentPage.name);
  if (!pageName.includes("about") && !pageName.includes("archive")) {
    throw new Error(`Open the About + Archive page before publishing. Current page: “${figma.currentPage.name}”.`);
  }

  const placement = productionSnapshotPlacement(GENERATED_KIND.currentAbout);
  await loadSynthesisFonts();
  const photoHash = bundledImageHash("about");
  const section = createSection(
    "About — production snapshot",
    placement.point,
    2350,
    9000,
    CASE_COLOR.surface,
    GENERATED_KIND.currentAbout,
  );
  populateSectionSafely(section, () => {
    addFinalHeading(section, {
      characters: "About — current production snapshot",
      fontSize: 42,
      lineHeight: 52,
      width: 1100,
      x: 150,
      y: 70,
    });
    addFinalBody(section, {
      characters: `CURRENT · Design release ${ABI_DESIGN_RELEASE.version} · Source ${ABI_DESIGN_RELEASE.commit}\nGenerated from src/components/pages/AboutPage.astro, src/data/profile.ts, localized production copy and the bundled About portrait.`,
      fontSize: 18,
      lineHeight: 29,
      color: FINAL_COLOR.inkMuted,
      width: 1550,
      x: 150,
      y: 135,
    });
    createAboutDesktop(section, 150, 330, photoHash).name =
      "About — desktop · current production snapshot";
    createAboutMobile(section, 1790, 330, photoHash).name =
      "About — mobile · current production snapshot";
  });
  placement.existing?.remove();
  figma.currentPage.selection = [section];
  figma.viewport.scrollAndZoomIntoView([section]);
  closeWithMessage(`Published the editable About snapshot from design release ${ABI_DESIGN_RELEASE.version}.`);
}

async function buildMoodboard() {
  if (figma.editorType !== "figjam") {
    throw new Error(
      "The Moodboard command only runs in FigJam. Open Abi Website Moodboard first.",
    );
  }

  requireExpectedFile(EXPECTED_FILES.moodboard);
  const placement = replacementPlacement(GENERATED_KIND.moodboard);
  const point = placement.point;
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
      `CURRENT · Design release ${ABI_DESIGN_RELEASE.version} · Source ${ABI_DESIGN_RELEASE.commit}\n\nAbilene's feedback, references and evidence behind the implemented V2 direction. Figma records intent; Astro remains production.`,
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
      "Content strategy · Communications · Business\n\nImplemented homepage line\nI help companies connect with their audiences through clear, honest communication.\n\nDesign implication\nThe website communicates breadth without making Abilene look unfocused.",
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
    title: "Implemented homepage structure",
    body: `Hero\n↓\nLead imaginArt case\n↓\nSecondary work\n↓\nShort positioning / About\n↓\nPrimary contact CTA\n\nRemaining content questions\n${bullets(MOODBOARD.openQuestions)}`,
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
  placement.existing?.remove();
  closeWithMessage(
    `Published the current moodboard direction for design release ${ABI_DESIGN_RELEASE.version}.`,
  );
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

const STATUS_LABEL_MIGRATIONS = {
  "Abi Website Foundations::02 — Components": {
    "Workspace Intro — Components": "[ARCHIVE] Workspace Intro — Components",
  },
  "Abi Website Foundations::03 — Explorations": {
    "[ABI BRIEF] Final Direction — Clean Organic Editorial — Pre-production":
      "[APPROVED] Final Direction — Clean Organic Editorial — Pre-production",
    "[ABI BRIEF] D — Clean Organic Editorial":
      "[ARCHIVE] D — Clean Organic Editorial",
    "[ABI BRIEF] V2 — Desktop Homepage Concepts":
      "[ARCHIVE] V2 — Desktop Homepage Concepts",
    "[ABI BRIEF] V2 — Exploration Directions":
      "[ARCHIVE] V2 — Exploration Directions",
    "Workspace Intro — Explorations": "[ARCHIVE] Workspace Intro — Explorations",
  },
  "Abi Personal Website::01 — Homepage": {
    "V1 — Current Baseline": "[ARCHIVE] V1 — Current Baseline",
    "V1 — Current Baseline — Desktop": "[ARCHIVE] V1 — Current Baseline — Desktop",
    "Workspace Intro — Homepage": "[ARCHIVE] Workspace Intro — Homepage",
  },
  "Abi Personal Website::02 — Case Studies": {
    "[ABI BRIEF] imaginArt — Final Direction — Visual refinement":
      "[APPROVED] imaginArt — Final Direction — Visual refinement",
    "[ABI BRIEF] imaginArt — Reframed Editorial Exploration":
      "[ARCHIVE] imaginArt — Reframed Editorial Exploration",
    "[ABI BRIEF] imaginArt — Case Study Structure Exploration":
      "[ARCHIVE] imaginArt — Case Study Structure Exploration",
    "Workspace Intro — Case Studies": "[ARCHIVE] Workspace Intro — Case Studies",
  },
  "Abi Personal Website::03 — About + Archive": {
    "[ABI BRIEF] About — Final pre-production":
      "[APPROVED] About — Final pre-production",
    "Workspace Intro — Archive": "[ARCHIVE] Workspace Intro — Archive",
  },
};

function organizeStatusLabels() {
  const migrationKey = `${figma.root.name}::${figma.currentPage.name}`;
  const migrations = STATUS_LABEL_MIGRATIONS[migrationKey];
  if (!migrations) {
    closeWithMessage(
      `No status-label migration is defined for “${figma.root.name} / ${figma.currentPage.name}”.`,
      true,
    );
    return;
  }

  let renamed = 0;
  for (const node of figma.currentPage.children) {
    const nextName = migrations[node.name];
    if (!nextName) continue;
    node.name = nextName;
    renamed += 1;
  }

  closeWithMessage(
    renamed === 0
      ? "Status labels were already organized; no nodes were changed."
      : `Organized ${renamed} status label${renamed === 1 ? "" : "s"} without deleting or moving content.`,
  );
}

function exactPublicFoundationsPage() {
  return Object.entries(PUBLIC_FOUNDATIONS_LAYOUT).find(
    ([, config]) => figma.currentPage.name === config.pageName,
  );
}

function isSafePublicCleanupNode(node, pageKey, config) {
  if (config.removableNames.has(node.name)) return true;
  return pageKey === "foundations" && /^(0[1-9]|1[01])$/.test(node.name);
}

function requireSingleManagedSection(kind, label) {
  const managed = collectGenerated(figma.currentPage, kind);
  if (managed.length !== 1) {
    if (managed.length > 0) {
      figma.currentPage.selection = managed;
      figma.viewport.scrollAndZoomIntoView(managed);
    }
    throw new Error(
      `Expected exactly one managed ${label} section on “${figma.currentPage.name}”; found ${managed.length}. Publish it before preparing the public canvas.`,
    );
  }
  return managed[0];
}

function preparePublicFoundationsPage() {
  if (figma.editorType !== "figma") {
    throw new Error("Public Foundations cleanup can only run in Figma Design.");
  }
  requireExpectedFile(EXPECTED_FILES.foundations);

  const pageEntry = exactPublicFoundationsPage();
  if (!pageEntry) {
    throw new Error(
      `Open 01 — Foundations, 02 — Components or 03 — Explorations before running this command. Current page: “${figma.currentPage.name}”.`,
    );
  }

  const [pageKey, config] = pageEntry;
  let removed = figma.currentPage.children.filter((node) =>
    isSafePublicCleanupNode(node, pageKey, config),
  );
  const removedFlowStarts = figma.currentPage.flowStartingPoints?.length || 0;

  let arranged = [];
  if (pageKey === "explorations") {
    const approved = figma.currentPage.children.find(
      (node) => node.name === config.approvedName,
    );
    if (!approved) {
      throw new Error(
        `Could not find “${config.approvedName}”. Organize status labels on this page first.`,
      );
    }

    arranged = [approved];
    for (const name of config.archiveOrder) {
      const archive = figma.currentPage.children.find((node) => node.name === name);
      if (archive) arranged.push(archive);
    }
  } else {
    arranged = [requireSingleManagedSection(config.currentKind, pageKey)];
  }

  if (pageKey === "foundations") {
    removed = figma.currentPage.children.filter((node) => !arranged.includes(node));
  }

  for (const node of removed) node.remove();
  if (removedFlowStarts > 0) figma.currentPage.flowStartingPoints = [];

  let nextX = 0;
  for (const node of arranged) {
    node.x = nextX;
    node.y = 0;
    nextX += node.width + INSERTION_GAP;
  }

  figma.currentPage.selection = arranged.slice(0, 1);
  figma.viewport.scrollAndZoomIntoView(arranged.slice(0, 1));
  closeWithMessage(
    `Prepared ${config.pageName} for public viewing: removed ${removed.length} known starter/intro layer${removed.length === 1 ? "" : "s"}, cleared ${removedFlowStarts} prototype start label${removedFlowStarts === 1 ? "" : "s"} and arranged ${arranged.length} reference section${arranged.length === 1 ? "" : "s"}.`,
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
      case "build-approved-foundations":
        await buildApprovedFoundations();
        break;
      case "publish-current-components":
        await publishCurrentComponents();
        break;
      case "publish-current-homepage":
        await publishCurrentHomepage();
        break;
      case "publish-current-imaginart":
        await publishCurrentImaginart();
        break;
      case "publish-current-about":
        await publishCurrentAbout();
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
      case "build-about-preproduction":
        await buildAboutPreproduction();
        break;
      case "organize-status-labels":
        organizeStatusLabels();
        break;
      case "prepare-public-foundations-page":
        preparePublicFoundationsPage();
        break;
      case "find-generated":
        findGenerated();
        break;
      default:
        closeWithMessage("Choose one of the publisher commands from the Development menu.", true);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected plugin error.";
    closeWithMessage(message, true);
  }
}

run();
