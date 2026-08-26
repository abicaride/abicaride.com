import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

execFileSync(process.execPath, [fileURLToPath(new URL("./package.mjs", import.meta.url))], {
  stdio: "inherit",
});
const pluginSource = fs.readFileSync(new URL("./dist/code.js", import.meta.url), "utf8");

assert.match(pluginSource, /case "organize-status-labels"/);
assert.match(pluginSource, /\[ARCHIVE\] V1 — Current Baseline/);
assert.match(pluginSource, /\[APPROVED\] imaginArt — Final Direction/);

function estimateTextHeight(node) {
  if (!node.characters || !node.width) return 10;
  const fontSize = Number(node.fontSize) || 16;
  const lineHeight = node.lineHeight?.value || fontSize * 1.45;
  const averageCharacterWidth = fontSize * 0.54;
  const charactersPerLine = Math.max(1, Math.floor(node.width / averageCharacterWidth));
  const lines = node.characters
    .split("\n")
    .reduce((total, line) => total + Math.max(1, Math.ceil(line.length / charactersPerLine)), 0);
  return Math.ceil(lines * lineHeight);
}

class MockNode {
  constructor(type, parent = null) {
    this.type = type;
    this.name = type;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.parent = parent;
    this.removed = false;
    this.pluginData = new Map();
    this.children = [];
    this.fills = [];
    this.strokes = [];
  }

  appendChild(node) {
    if (node.parent?.children) {
      node.parent.children = node.parent.children.filter((child) => child !== node);
    }
    node.parent = this;
    this.children.push(node);
    this.reflow();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.reflow();
  }

  resizeWithoutConstraints(width, height) {
    this.resize(width, height);
  }

  setPluginData(key, value) {
    this.pluginData.set(key, value);
  }

  getPluginData(key) {
    return this.pluginData.get(key) || "";
  }

  setRelaunchData(data) {
    this.relaunchData = data;
  }

  remove() {
    this.removed = true;
    if (this.parent?.children) {
      this.parent.children = this.parent.children.filter((child) => child !== this);
    }
  }

  reflow() {
    if (this.layoutMode !== "VERTICAL" || this.primaryAxisSizingMode !== "AUTO") return;
    const childrenHeight = this.children.reduce((total, child) => total + child.height, 0);
    const gaps = Math.max(0, this.children.length - 1) * (this.itemSpacing || 0);
    this.height =
      (this.paddingTop || 0) + childrenHeight + gaps + (this.paddingBottom || 0);
    this.parent?.reflow?.();
  }

  get absoluteRenderBounds() {
    let x = this.x;
    let y = this.y;
    let current = this.parent;
    while (current && current.type !== "PAGE") {
      x += current.x;
      y += current.y;
      current = current.parent;
    }
    return { x, y, width: this.width, height: this.height };
  }

  get absoluteBoundingBox() {
    return this.absoluteRenderBounds;
  }
}

class MockTextNode extends MockNode {
  constructor(parent) {
    super("TEXT", parent);
    this._characters = "";
    this._textAutoResize = "NONE";
    this.fontSize = 16;
    this.lineHeight = { unit: "PIXELS", value: 24 };
  }

  set characters(value) {
    this._characters = value;
    this.updateHeight();
  }

  get characters() {
    return this._characters;
  }

  set textAutoResize(value) {
    this._textAutoResize = value;
    this.updateHeight();
  }

  get textAutoResize() {
    return this._textAutoResize;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.updateHeight();
  }

  updateHeight() {
    if (this._textAutoResize === "HEIGHT") {
      this.height = estimateTextHeight(this);
      this.parent?.reflow?.();
    }
  }
}

class MockShapeWithTextNode extends MockNode {
  constructor(parent) {
    super("SHAPE_WITH_TEXT", parent);
    this.text = new MockTextNode(this);
  }
}

class MockPage extends MockNode {
  constructor(name) {
    super("PAGE", null);
    this.name = name;
    this.selection = [];
  }

  findAll(predicate) {
    return allNodes(this).slice(1).filter(predicate);
  }
}

function createFigma({ editorType, fileName, pageName, command }) {
  const page = new MockPage(pageName);
  const root = new MockNode("DOCUMENT");
  root.name = fileName;
  root.children = [page];
  page.parent = root;
  const notifications = [];

  const figma = {
    editorType,
    command,
    root,
    currentPage: page,
    notifications,
    viewport: {
      scrollAndZoomIntoView(nodes) {
        figma.lastViewportNodes = nodes;
      },
    },
    createSection() {
      const node = new MockNode("SECTION", page);
      page.children.push(node);
      return node;
    },
    createFrame() {
      const node = new MockNode("FRAME", page);
      page.children.push(node);
      return node;
    },
    createText() {
      const node = new MockTextNode(page);
      page.children.push(node);
      return node;
    },
    createShapeWithText() {
      const node = new MockShapeWithTextNode(page);
      page.children.push(node);
      return node;
    },
    createEllipse() {
      const node = new MockNode("ELLIPSE", page);
      page.children.push(node);
      return node;
    },
    base64Decode() {
      return new Uint8Array([1, 2, 3]);
    },
    createImage() {
      return { hash: "packaged-production-image" };
    },
    createNodeFromSvg() {
      const node = new MockNode("FRAME", page);
      page.children.push(node);
      return node;
    },
    async loadFontAsync() {},
    notify(message, options = {}) {
      notifications.push({ message, ...options });
    },
    closePlugin() {
      figma.closed = true;
    },
  };

  const anchor = new MockNode("FRAME", page);
  anchor.name = "Placement anchor";
  anchor.x = 100;
  anchor.y = 200;
  anchor.resize(1000, 800);
  page.children.push(anchor);
  page.selection = [anchor];

  return figma;
}

async function execute(figma) {
  const context = vm.createContext({
    figma,
    console,
    Error,
    JSON,
    Math,
    Promise,
    Uint8Array,
    parseInt,
  });
  const script = new vm.Script(pluginSource, { filename: "code.js" });
  script.runInContext(context);
  await new Promise((resolve) => setImmediate(resolve));
}

function allNodes(node, output = []) {
  output.push(node);
  for (const child of node.children || []) allNodes(child, output);
  return output;
}

function generatedSections(figma) {
  return figma.currentPage.children.filter(
    (node) =>
      node.type === "SECTION" && /^\[(?:CURRENT|APPROVED|ARCHIVE)\]/.test(node.name),
  );
}

const moodboard = createFigma({
  editorType: "figjam",
  fileName: "Abi Website Moodboard",
  pageName: "Moodboard",
  command: "build-moodboard",
});
await execute(moodboard);

assert.equal(moodboard.closed, true);
assert.equal(moodboard.notifications.at(-1).error, false);
assert.equal(generatedSections(moodboard).length, 1);
const moodboardSection = generatedSections(moodboard)[0];
assert.equal(moodboardSection.x, 1500);
assert.equal(moodboardSection.y, 200);
assert.equal(moodboardSection.width, 3960);
assert.equal(moodboardSection.height, 5740);
assert.equal(
  allNodes(moodboardSection).filter((node) => node.type === "SHAPE_WITH_TEXT").length,
  12,
);
const moodboardText = allNodes(moodboardSection)
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "V2 — Creative Brief",
  "Current positioning direction",
  "Marina Posniak",
  "Josiah Flores",
  "Leah Kim",
  "Photography direction",
  "curly hair + glasses + burgundy top",
  "Totoro image",
  "imaginArt — supported lead-case evidence",
  "docs/content/case-study-imaginart.md",
  "Turtle AV",
  "Mundo BrightSign",
  "Madrid Open Days 2026",
  "AV Supports Catalogue",
  "Lumens",
  "Bilbao",
  "~24% → ~34%",
  "~110–125 attendees vs usual ~70–80",
  "NOT an A/B test",
  "not audited data",
  "final Abilene review of public case-study voice",
]) {
  assert.ok(moodboardText.includes(expected), `Missing Moodboard content: ${expected}`);
}

for (const obsolete of [
  "Madrid expected attendance",
  "Madrid actual attendance",
  "exact +10pp email-open-rate context",
  "exact ownership of every deliverable",
]) {
  assert.ok(!moodboardText.includes(obsolete), `Obsolete Moodboard content: ${obsolete}`);
}

await execute(moodboard);
assert.equal(generatedSections(moodboard).length, 1, "A rerun must not duplicate content");
assert.equal(moodboard.notifications.at(-1).error, false);

const foundations = createFigma({
  editorType: "figma",
  fileName: "Abi Website Foundations",
  pageName: "02 — Explorations",
  command: "build-foundations",
});
await execute(foundations);

assert.equal(foundations.closed, true);
assert.equal(foundations.notifications.at(-1).error, false);
assert.equal(generatedSections(foundations).length, 1);
const foundationsSection = generatedSections(foundations)[0];
assert.equal(foundationsSection.x, 1500);
assert.equal(foundationsSection.y, 200);
assert.equal(foundationsSection.width, 3960);
assert.equal(foundationsSection.height, 1960);
const directionNames = allNodes(foundationsSection)
  .filter((node) => node.type === "FRAME")
  .map((node) => node.name);
for (const expected of [
  "A — Editorial Calm",
  "B — Fresh / Image-led",
  "C — Content-led Personality",
]) {
  assert.ok(directionNames.includes(expected), `Missing direction board: ${expected}`);
}

const homepageConcepts = createFigma({
  editorType: "figma",
  fileName: "Abi Website Foundations",
  pageName: "03 — Explorations",
  command: "build-homepage-concepts",
});
await execute(homepageConcepts);

assert.equal(homepageConcepts.closed, true);
assert.equal(homepageConcepts.notifications.at(-1).error, false);
assert.equal(generatedSections(homepageConcepts).length, 1);
const homepageSection = generatedSections(homepageConcepts)[0];
assert.equal(homepageSection.x, 1500);
assert.equal(homepageSection.y, 200);
assert.equal(homepageSection.width, 4800);
assert.equal(homepageSection.height, 3720);
const homepageFrames = allNodes(homepageSection)
  .filter((node) => node.type === "FRAME")
  .map((node) => node.name);
for (const expected of [
  "Home A — Editorial Calm",
  "Home B — Fresh / Image-led",
  "Home C — Content-led Personality",
]) {
  assert.ok(homepageFrames.includes(expected), `Missing homepage concept: ${expected}`);
}
const homepageText = allNodes(homepageSection)
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "Abilene Caride",
  "Content strategy.\nCommunications.\nBusiness.",
  "imaginArt",
  "technical product content",
  "email",
  "event campaigns",
  "Website analysis",
  "Error messages",
  "Get in touch",
  "WORKING COPY",
  "Close portrait · curly hair · glasses · burgundy top",
]) {
  assert.ok(homepageText.includes(expected), `Missing homepage content: ${expected}`);
}
for (const inventedCase of ["Ailanto", "Ethic"]) {
  assert.ok(!homepageText.includes(inventedCase), `Invented case found: ${inventedCase}`);
}

await execute(homepageConcepts);
assert.equal(
  generatedSections(homepageConcepts).length,
  1,
  "A homepage rerun must not duplicate content",
);
assert.equal(homepageConcepts.notifications.at(-1).error, true);

const imaginart = createFigma({
  editorType: "figma",
  fileName: "Abi Personal Website",
  pageName: "04 — Case Studies",
  command: "build-imaginart-wireframe",
});
await execute(imaginart);

assert.equal(imaginart.closed, true);
assert.equal(imaginart.notifications.at(-1).error, false);
assert.equal(generatedSections(imaginart).length, 1);
const imaginartSection = generatedSections(imaginart)[0];
assert.equal(imaginartSection.x, 1500);
assert.equal(imaginartSection.y, 200);
assert.equal(imaginartSection.width, 1740);
assert.equal(imaginartSection.height, 8920);
const imaginartText = allNodes(imaginartSection)
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "imaginArt",
  "HERO",
  "Context + role",
  "Turtle AV",
  "INPUT",
  "QUESTIONS",
  "STRUCTURED PRODUCT CONTENT",
  "Mundo BrightSign",
  "~24%",
  "~34%",
  "NOT AN A/B TEST",
  "Madrid Open Days 2026",
  "~110–125",
  "~70–80",
  "Other technical-content evidence",
  "AV Supports Catalogue",
  "Lumens",
  "Outcomes",
  "Working across teams",
  "Engineering",
  "Sales",
  "Abi",
  "Management",
  "What I learned",
  "Optional external evidence",
  "docs/content/case-study-imaginart.md",
]) {
  assert.ok(
    imaginartText.toLowerCase().includes(expected.toLowerCase()),
    `Missing imaginArt content: ${expected}`,
  );
}
const imaginartFrames = allNodes(imaginartSection)
  .filter((node) => node.type === "FRAME")
  .map((node) => node.name);
for (const connector of [
  "Engineering to Abi",
  "Sales to Abi",
  "Abi to Management",
]) {
  assert.ok(imaginartFrames.includes(connector), `Missing connector: ${connector}`);
}
const emailMetric = allNodes(imaginartSection).find(
  (node) => node.type === "TEXT" && node.characters === "~24% → ~34%",
);
assert.equal(emailMetric.width, 640);
assert.equal(emailMetric.fontSize, 76);

const directionD = createFigma({
  editorType: "figma",
  fileName: "Abi Website Foundations",
  pageName: "03 — Explorations",
  command: "build-direction-d",
});
await execute(directionD);

assert.equal(directionD.closed, true);
assert.equal(directionD.notifications.at(-1).error, false);
assert.equal(generatedSections(directionD).length, 1);
const directionDSection = generatedSections(directionD)[0];
assert.equal(directionDSection.width, 2540);
assert.equal(directionDSection.height, 3730);
const directionDFrames = allNodes(directionDSection)
  .filter((node) => node.type === "FRAME")
  .map((node) => node.name);
assert.ok(directionDFrames.includes("Direction D — typography comparison"));
assert.ok(directionDFrames.includes("Home D — Clean Organic Editorial"));
const directionDText = allNodes(directionDSection)
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "OPTION 1 · PROVISIONALLY SELECTED",
  "Montserrat + Inter",
  "Montserrat throughout",
  "D — Clean Organic Editorial",
  "Clear thinking",
  "Making specialist B2B",
  "imaginArt",
  "Website analysis",
  "Error messages",
  "CONTROLLED ASYMMETRY",
  "SELECTIVE SHAPES",
]) {
  assert.ok(directionDText.includes(expected), `Missing Direction D content: ${expected}`);
}
for (const inventedCase of ["Ailanto", "Ethic"]) {
  assert.ok(!directionDText.includes(inventedCase), `Invented case found in D: ${inventedCase}`);
}
await execute(directionD);
assert.equal(generatedSections(directionD).length, 1, "A Direction D rerun must not duplicate content");
assert.equal(directionD.notifications.at(-1).error, true);

const imaginartReframed = createFigma({
  editorType: "figma",
  fileName: "Abi Personal Website",
  pageName: "02 — Case Studies",
  command: "build-imaginart-reframed",
});
await execute(imaginartReframed);

assert.equal(imaginartReframed.closed, true);
assert.equal(imaginartReframed.notifications.at(-1).error, false);
assert.equal(generatedSections(imaginartReframed).length, 1);
const imaginartReframedSection = generatedSections(imaginartReframed)[0];
assert.equal(imaginartReframedSection.width, 1740);
assert.equal(imaginartReframedSection.height, 9020);
const imaginartReframedText = allNodes(imaginartReframedSection)
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "Making specialist B2B",
  "Launching a new brand in Spain",
  "TURTLE AV · IMAGINART",
  "Refreshing a specialist B2B newsletter",
  "MUNDO BRIGHTSIGN",
  "Planning and promoting a corporate event",
  "MADRID OPEN DAYS 2026",
  "Structuring a 19-page technical product catalogue",
  "AV Supports Catalogue",
  "Adapting technical product information for a B2B audience",
  "Lumens",
  "Bilbao",
  "~24% → ~34%",
  "~110–125",
  "usual ~70–80",
  "NOT an A/B test",
  "not audited data",
  "docs/content/case-study-imaginart.md",
]) {
  assert.ok(
    imaginartReframedText.toLowerCase().includes(expected.toLowerCase()),
    `Missing reframed imaginArt content: ${expected}`,
  );
}
await execute(imaginartReframed);
assert.equal(
  generatedSections(imaginartReframed).length,
  1,
  "A reframed imaginArt rerun must not duplicate content",
);
assert.equal(imaginartReframed.notifications.at(-1).error, true);

const approvedFoundations = createFigma({
  editorType: "figma",
  fileName: "Abi Website Foundations",
  pageName: "01 — Foundations",
  command: "build-approved-foundations",
});
const approvedReference = new MockNode("RECTANGLE", approvedFoundations.currentPage);
approvedReference.name = "hero-approved-reference.jpg";
approvedReference.fills = [
  { type: "IMAGE", imageHash: "approved-reference-hash", scaleMode: "FILL" },
];
approvedReference.x = -900;
approvedFoundations.currentPage.children.push(approvedReference);
await execute(approvedFoundations);

assert.equal(approvedFoundations.closed, true);
assert.equal(approvedFoundations.notifications.at(-1).error, false);
assert.equal(generatedSections(approvedFoundations).length, 1);
const approvedFoundationsSection = generatedSections(approvedFoundations)[0];
assert.equal(approvedFoundationsSection.width, 1740);
assert.equal(approvedFoundationsSection.height, 3600);
const approvedFoundationsNodes = allNodes(approvedFoundationsSection);
const approvedFoundationsText = approvedFoundationsNodes
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "V2 — Current production foundations",
  "Design release 2.1.1",
  "Inter for headings",
  "Montserrat Regular",
  "--color-canvas",
  "#F7F3EA",
  "--color-green-deep",
  "#103A20",
  "--color-burgundy",
  "#741A2A",
  "No floating ellipses",
  "not a production asset",
  "supersedes previous hero explorations",
]) {
  assert.ok(
    approvedFoundationsText.toLowerCase().includes(expected.toLowerCase()),
    `Missing approved Foundations content: ${expected}`,
  );
}
const referenceFrame = approvedFoundationsNodes.find(
  (node) => node.name === "Design reference only — hero-approved-reference.jpg",
);
assert.equal(referenceFrame.fills[0].type, "IMAGE");
assert.equal(referenceFrame.fills[0].imageHash, "approved-reference-hash");
assert.equal(approvedFoundationsNodes.filter((node) => node.type === "ELLIPSE").length, 0);
await execute(approvedFoundations);
assert.equal(generatedSections(approvedFoundations).length, 1);
assert.equal(approvedFoundations.notifications.at(-1).error, false);

const finalDirection = createFigma({
  editorType: "figma",
  fileName: "Abi Website Foundations",
  pageName: "03 — Explorations",
  command: "build-final-direction",
});
const approvedPhoto = new MockNode("RECTANGLE", finalDirection.currentPage);
approvedPhoto.name = "AbileneHero.png";
approvedPhoto.fills = [{ type: "IMAGE", imageHash: "approved-photo-hash", scaleMode: "FILL" }];
approvedPhoto.x = -900;
finalDirection.currentPage.children.push(approvedPhoto);
await execute(finalDirection);

assert.equal(finalDirection.closed, true);
assert.equal(finalDirection.notifications.at(-1).error, false);
assert.equal(generatedSections(finalDirection).length, 1);
const finalDirectionSection = generatedSections(finalDirection)[0];
assert.equal(finalDirectionSection.width, 1800);
assert.equal(finalDirectionSection.height, 5360);
const finalDirectionNodes = allNodes(finalDirectionSection);
const finalDirectionText = finalDirectionNodes
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "Final Direction — Pre-production",
  "Abilene Caride",
  "I help companies connect with their audiences through clear, honest communication.",
  "Content, communications and marketing specialist",
  "Get in touch",
  "View my work",
  "Making specialist B2B communication clearer",
  "Cognitive biases in ecommerce",
  "Error Messages",
  "Back to top / Volver arriba",
  "LET’S TALK",
  "Privacy · Cookie settings",
  "Made with 🎨 Figma, 🚀 Astro, ✍️ Pages CMS, 🤖 Codex and lots of ❤️.",
  "Content strategy · Communications · Business",
  "PALETTE HIERARCHY · DURABLE RULE",
  "NEUTRALS · dominant backgrounds",
  "DEEP GREEN · primary identity · navigation · links · primary CTA",
  "BURGUNDY · footer · terminal/contact emphasis · very occasional supporting detail",
  "ABILENEHERO.PNG LINKED",
  "No decorative ellipses",
  "no colored section blocks",
  "docs/design/references/hero-approved-reference.jpg",
]) {
  assert.ok(finalDirectionText.toLowerCase().includes(expected.toLowerCase()), `Missing final direction content: ${expected}`);
}
assert.ok(!finalDirectionText.includes("EXPERIENCE WITH"), "The conceptual company strip must not appear in the final direction");
assert.ok(!finalDirectionText.includes("Content strategy.\nCommunications.\nBusiness."), "The category list must not compete with the final hero statement");
assert.ok(!finalDirectionText.includes("Abi Caride"), "Final public direction must use Abilene Caride");
assert.equal(finalDirectionNodes.filter((node) => node.type === "ELLIPSE").length, 0);
const heroPhoto = finalDirectionNodes.find(
  (node) => node.name === "Hero — full-bleed atmospheric image — AbileneHero",
);
assert.equal(heroPhoto.fills[0].type, "IMAGE");
assert.equal(heroPhoto.fills[0].imageHash, "approved-photo-hash");
assert.equal(heroPhoto.width, 1440);
assert.equal(heroPhoto.height, 860);
const heroScrim = finalDirectionNodes.find(
  (node) => node.name === "Hero — warm readability gradient",
);
assert.equal(heroScrim.fills[0].type, "GRADIENT_LINEAR");
const cognitiveBiases = finalDirectionNodes.find(
  (node) => node.name === "Secondary work — Cognitive biases in ecommerce",
);
const errorMessages = finalDirectionNodes.find(
  (node) => node.name === "Secondary work — Error Messages",
);
assert.equal(cognitiveBiases.y, errorMessages.y);
assert.equal(cognitiveBiases.width, errorMessages.width);
assert.ok(!finalDirectionText.includes("Website Analysis"), "Website Analysis must not remain in the approved homepage pair");
const cognitiveTitle = finalDirectionNodes.find(
  (node) => node.type === "TEXT" && node.characters === "Cognitive biases in ecommerce",
);
const cognitiveMeta = finalDirectionNodes.find(
  (node) => node.type === "TEXT" && node.characters === "Behavioural design · UX audit · Figma",
);
const errorMeta = finalDirectionNodes.find(
  (node) => node.type === "TEXT" && node.characters === "UX writing · clarity · recovery",
);
assert.equal(cognitiveMeta.y, 170);
assert.equal(errorMeta.y, 170);
assert.ok(
  cognitiveMeta.y >= cognitiveTitle.y + cognitiveTitle.height,
  "The two-line Cognitive Biases title must not overlap its metadata",
);
const finalBody = finalDirectionNodes.find(
  (node) => node.type === "TEXT" && node.characters.startsWith("A lead professional case showing"),
);
assert.equal(finalBody.fontName.family, "Montserrat");
const finalHeading = finalDirectionNodes.find(
  (node) => node.type === "TEXT" && node.characters.startsWith("I help companies connect"),
);
assert.equal(finalHeading.fontName.family, "Inter");
const heroName = finalDirectionNodes.find(
  (node) => node.type === "TEXT" && node.characters === "Abilene Caride",
);
assert.equal(heroName.fontName.family, "Inter");
assert.equal(heroName.fontName.style, "Semi Bold");
assert.equal(heroName.fontSize, 32);
assert.equal(heroName.x, 80);
assert.equal(heroName.y, 42);
const heroNavigation = [
  ["Home", 850],
  ["Work", 950],
  ["About", 1060],
  ["Contact", 1180],
  ["ES", 1320],
];
for (const [label, x] of heroNavigation) {
  const item = finalDirectionNodes.find(
    (node) => node.type === "TEXT" && node.characters === label && node.x === x && node.y === 44,
  );
  assert.ok(item, `Missing hero navigation item: ${label}`);
  assert.equal(item.fills[0].color.r, 0xec / 0xff);
  assert.equal(item.fills[0].color.g, 0xe8 / 0xff);
  assert.equal(item.fills[0].color.b, 0xde / 0xff);
}
const specialistLine = finalDirectionNodes.find(
  (node) => node.type === "TEXT" && node.characters === "Content, communications and marketing specialist",
);
assert.equal(specialistLine.fontName.family, "Inter");
assert.equal(specialistLine.fontName.style, "Medium");
assert.equal(specialistLine.fontSize, 24);
assert.equal(specialistLine.x, 80);
assert.equal(specialistLine.y, 448);
assert.equal(specialistLine.width, 660);
const primaryHeroCta = finalDirectionNodes.find(
  (node) => node.type === "FRAME" && node.name === "Get in touch  →",
);
const secondaryHeroCta = finalDirectionNodes.find(
  (node) => node.type === "FRAME" && node.name === "View my work  ↓",
);
assert.equal(primaryHeroCta.width, 220);
assert.equal(primaryHeroCta.height, 64);
assert.equal(primaryHeroCta.x, 80);
assert.equal(primaryHeroCta.fills[0].color.r, 0x10 / 0xff);
assert.equal(primaryHeroCta.fills[0].color.g, 0x3a / 0xff);
assert.equal(primaryHeroCta.fills[0].color.b, 0x20 / 0xff);
assert.equal(secondaryHeroCta.width, 240);
assert.equal(secondaryHeroCta.height, 64);
assert.equal(secondaryHeroCta.x, 320);
const contactFooter = finalDirectionNodes.find(
  (node) => node.type === "FRAME" && node.name === "Contact footer — burgundy terminal section",
);
assert.equal(contactFooter.fills[0].color.r, 0x74 / 0xff);
assert.equal(contactFooter.fills[0].color.g, 0x1a / 0xff);
assert.equal(contactFooter.fills[0].color.b, 0x2a / 0xff);
const backToTop = finalDirectionNodes.find(
  (node) => node.type === "FRAME" && node.name === "Back to top / Volver arriba — fixed scrolled state",
);
assert.equal(backToTop.width, 56);
assert.equal(backToTop.height, 56);
await execute(finalDirection);
assert.equal(generatedSections(finalDirection).length, 1, "A final direction rerun must not duplicate content");
assert.equal(finalDirection.notifications.at(-1).error, false);

const imaginartPreproduction = createFigma({
  editorType: "figma",
  fileName: "Abi Personal Website",
  pageName: "02 — Case Studies",
  command: "build-imaginart-preproduction",
});
await execute(imaginartPreproduction);

assert.equal(imaginartPreproduction.closed, true);
assert.equal(imaginartPreproduction.notifications.at(-1).error, false);
assert.equal(generatedSections(imaginartPreproduction).length, 1);
const imaginartPreproductionSection = generatedSections(imaginartPreproduction)[0];
assert.equal(imaginartPreproductionSection.width, 1740);
assert.equal(imaginartPreproductionSection.height, 8640);
const imaginartPreproductionNodes = allNodes(imaginartPreproductionSection);
const imaginartPreproductionText = imaginartPreproductionNodes
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "Refreshing a specialist B2B newsletter",
  "MUNDO BRIGHTSIGN",
  "~24%",
  "~34%",
  "+10 percentage points approx.",
  "approximate recalled open rate · not an A/B test",
  "Launching a new brand in Spain",
  "TURTLE AV · IMAGINART",
  "Technical truth → structure → usable B2B content",
  "REAL-WORK VISUAL SLOT",
  "Rights-cleared image pending",
  "Planning and promoting a corporate event",
  "MADRID OPEN DAYS 2026",
  "AV Supports Catalogue",
  "PRODUCT FAMILIES",
  "REPEATABLE PRODUCT STRUCTURE",
  "Lumens",
  "MANUFACTURER DOCUMENTATION",
  "B2B COMMUNICATION",
  "Bilbao",
  "~110",
  "~125",
  "approximate recalled attendance ranges",
  "LET’S TALK",
  "Privacy · Cookie settings",
  "docs/content/case-study-imaginart.md",
  "Abilene",
]) {
  assert.ok(
    imaginartPreproductionText.toLowerCase().includes(expected.toLowerCase()),
    `Missing final imaginArt content: ${expected}`,
  );
}
const orderedCaseText = imaginartPreproductionText.toLowerCase();
const newsletterIndex = orderedCaseText.indexOf("refreshing a specialist b2b newsletter");
const turtleIndex = orderedCaseText.indexOf("launching a new brand in spain");
const eventIndex = orderedCaseText.indexOf("planning and promoting a corporate event");
const catalogueIndex = orderedCaseText.indexOf("av supports catalogue");
const lumensIndex = orderedCaseText.indexOf("lumens");
assert.ok(newsletterIndex < turtleIndex && turtleIndex < eventIndex && eventIndex < catalogueIndex && catalogueIndex < lumensIndex);
assert.equal(imaginartPreproductionNodes.filter((node) => node.type === "ELLIPSE").length, 2);
const caseBody = imaginartPreproductionNodes.find(
  (node) => node.type === "TEXT" && node.characters.startsWith("The transformation is the story"),
);
assert.equal(caseBody.fontName.family, "Montserrat");
assert.equal(caseBody.fontSize, 20);
assert.equal(caseBody.lineHeight.value, 31);
const caseHeading = imaginartPreproductionNodes.find(
  (node) => node.type === "TEXT" && node.characters === "Refreshing a specialist B2B newsletter",
);
assert.equal(caseHeading.fontName.family, "Inter");
const publicCase = imaginartPreproductionNodes.find(
  (node) => node.type === "FRAME" && node.name === "imaginArt — editorial case study",
);
assert.equal(publicCase.width, 1440);
assert.equal(publicCase.height, 8080);
const publicCaseNodes = allNodes(publicCase);
const publicCaseText = publicCaseNodes
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const forbidden of [
  "LEAD PROFESSIONAL CASE · PRE-PRODUCTION",
  "Evidence before polish",
  "INTERNAL PRE-PRODUCTION",
  "Visual exploration is closed",
  "docs/content/",
  "Next:",
]) {
  assert.ok(
    !publicCaseText.includes(forbidden),
    `Internal imaginArt copy leaked into the public case: ${forbidden}`,
  );
}
assert.equal(publicCaseText.match(/~24%/g)?.length, 1);
assert.equal(publicCaseText.match(/~34%/g)?.length, 1);
assert.equal(publicCaseText.match(/~110/g)?.length, 1);
assert.equal(publicCaseText.match(/~125/g)?.length, 1);
assert.ok(!publicCaseText.includes("Outcomes and evidence note"));
const collaborationAbilene = publicCaseNodes.find(
  (node) => node.type === "FRAME" && node.name === "Diagram — ABILENE",
);
const collaborationEngineering = publicCaseNodes.find(
  (node) => node.type === "FRAME" && node.name === "Diagram — ENGINEERING",
);
const collaborationManagement = publicCaseNodes.find(
  (node) => node.type === "FRAME" && node.name === "Diagram — MANAGEMENT",
);
assert.ok(collaborationEngineering.x < collaborationAbilene.x);
assert.ok(collaborationAbilene.x < collaborationManagement.x);
assert.equal(collaborationAbilene.width, 320);
const storyIcons = publicCaseNodes.filter((node) => node.name?.startsWith("Icon —"));
assert.equal(storyIcons.length, 6);
for (const icon of storyIcons) {
  assert.equal(icon.width, 32);
  assert.equal(icon.height, 32);
}
const contextBand = publicCaseNodes.find(
  (node) => node.type === "FRAME" && node.name === "02 Context and collaboration",
);
const catalogueBand = publicCaseNodes.find(
  (node) => node.type === "FRAME" && node.name === "06 Structuring a technical product catalogue",
);
assert.equal(contextBand.fills[0].color.r, 0xec / 0xff);
assert.equal(contextBand.fills[0].color.g, 0xe8 / 0xff);
assert.equal(contextBand.fills[0].color.b, 0xde / 0xff);
assert.equal(catalogueBand.fills[0].color.r, 0xde / 0xff);
assert.equal(catalogueBand.fills[0].color.g, 0xd9 / 0xff);
assert.equal(catalogueBand.fills[0].color.b, 0xce / 0xff);
const caseFooter = publicCaseNodes.find(
  (node) => node.type === "FRAME" && node.name === "Contact footer — burgundy terminal section",
);
assert.equal(caseFooter.fills[0].color.r, 0x74 / 0xff);
assert.equal(caseFooter.fills[0].color.g, 0x1a / 0xff);
assert.equal(caseFooter.fills[0].color.b, 0x2a / 0xff);
assert.ok(
  pluginSource.includes('stroke-width="${options.strokeWidth || 2.25}"'),
  "The coherent case-study icon family must retain the stronger 2.25px default stroke",
);
await execute(imaginartPreproduction);
assert.equal(
  generatedSections(imaginartPreproduction).length,
  1,
  "A final imaginArt rerun must not duplicate content",
);
assert.equal(imaginartPreproduction.notifications.at(-1).error, false);

const aboutPreproduction = createFigma({
  editorType: "figma",
  fileName: "Abi Personal Website",
  pageName: "03 — Archive",
  command: "build-about-preproduction",
});
const approvedAboutPhoto = new MockNode("RECTANGLE", aboutPreproduction.currentPage);
approvedAboutPhoto.name = "AbileneAbout";
approvedAboutPhoto.fills = [{ type: "IMAGE", imageHash: "approved-about-photo-hash", scaleMode: "FILL" }];
approvedAboutPhoto.x = -900;
aboutPreproduction.currentPage.children.push(approvedAboutPhoto);
await execute(aboutPreproduction);

assert.equal(aboutPreproduction.closed, true);
assert.equal(aboutPreproduction.notifications.at(-1).error, false);
assert.equal(aboutPreproduction.currentPage.name, "03 — About + Archive");
assert.equal(generatedSections(aboutPreproduction).length, 1);
const aboutSection = generatedSections(aboutPreproduction)[0];
assert.equal(aboutSection.width, 2350);
assert.equal(aboutSection.height, 8800);
const aboutNodes = allNodes(aboutSection);
const aboutText = aboutNodes
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "About — Final pre-production",
  "I help people find the way to do what they want.",
  "Professionally, I do that through words.",
  "Administration",
  "Communication",
  "UX Writing",
  "Content strategy · Communications · Business",
  "Clear. Honest. Practical.",
  "2023–present",
  "Federación Pantalla",
  "Ailanto",
  "Ethic Investors",
  "Caprichos de Casa Import",
  "E-commerce manager · Administration, sales and business operations",
  "Degree in Communication",
  "Postgraduate in UX Writing",
  "Proficiency English Certificate - Cambridge C2 (2024)",
  "Administration and Finance",
  "Galicia taught me hard work",
  "Sustainability is one of the pivots of my life.",
  "Based in Barcelona. Galician at heart.",
  "Spanish · native",
  "Sign language · Portuguese · Korean",
  "LET’S TALK",
  "Made with 🎨 Figma, 🚀 Astro, ✍️ Pages CMS, 🤖 Codex and lots of ❤️.",
  "Back to top",
]) {
  assert.ok(aboutText.toLowerCase().includes(expected.toLowerCase()), `Missing final About content: ${expected}`);
}
assert.ok(!aboutText.includes("Postgraduate course in UX Writing"));
assert.ok(!aboutText.includes("Cambridge English C2"));
const aboutDesktop = aboutNodes.find((node) => node.type === "FRAME" && node.name === "About — Final pre-production");
const aboutMobile = aboutNodes.find((node) => node.type === "FRAME" && node.name === "About — Final pre-production — Mobile");
assert.equal(aboutDesktop.width, 1440);
assert.equal(aboutDesktop.height, 7230);
assert.equal(aboutMobile.width, 390);
assert.equal(aboutMobile.height, 8300);
const aboutPhoto = aboutNodes.find((node) => node.name === "About portrait — full body — AbileneAbout");
assert.equal(aboutPhoto.fills[0].type, "IMAGE");
assert.equal(aboutPhoto.fills[0].imageHash, "approved-about-photo-hash");
assert.equal(aboutPhoto.fills[0].scaleMode, "FIT");
assert.equal(aboutNodes.filter((node) => node.type === "ELLIPSE").length, 0);
const aboutBody = aboutNodes.find((node) => node.type === "TEXT" && node.characters.startsWith("Helping is the thread"));
assert.equal(aboutBody.fontName.family, "Montserrat");
assert.equal(aboutBody.fontSize, 20);
const aboutPrincipleHeading = aboutNodes.find((node) => node.type === "TEXT" && node.characters === "Clear. Honest. Practical.");
assert.equal(aboutPrincipleHeading.fontName.family, "Inter");
assert.ok(!aboutText.includes("2021–present"));
assert.ok(!aboutText.includes("Current role"));
assert.ok(!aboutText.includes("Selected tools"));
await execute(aboutPreproduction);
assert.equal(generatedSections(aboutPreproduction).length, 1, "A final About rerun must not duplicate content");
assert.equal(aboutPreproduction.notifications.at(-1).error, false);

const currentComponents = createFigma({
  editorType: "figma",
  fileName: "Abi Website Foundations",
  pageName: "02 — Components",
  command: "publish-current-components",
});
await execute(currentComponents);
assert.equal(currentComponents.closed, true);
assert.equal(currentComponents.notifications.at(-1).error, false);
assert.equal(generatedSections(currentComponents).length, 1);
const currentComponentsSection = generatedSections(currentComponents)[0];
assert.equal(currentComponentsSection.name, "[CURRENT] V2 — Current implemented components");
assert.equal(currentComponentsSection.width, 1740);
assert.equal(currentComponentsSection.height, 3380);
const currentComponentsText = allNodes(currentComponentsSection)
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "Design release 2.1.1",
  "Home",
  "Get in touch",
  "View my work",
  "Making specialist B2B communication clearer",
  "Analytics",
  "Accept",
  "Reject",
  "BACK TO TOP",
  "Made with 🎨 Figma, 🚀 Astro, ✍️ Pages CMS, 🤖 Codex and lots of ❤️.",
]) {
  assert.ok(currentComponentsText.includes(expected), `Missing current Components content: ${expected}`);
}
await execute(currentComponents);
assert.equal(generatedSections(currentComponents).length, 1);
assert.equal(currentComponents.notifications.at(-1).error, false);

const currentHomepage = createFigma({
  editorType: "figma",
  fileName: "Abi Personal Website",
  pageName: "01 — Homepage",
  command: "publish-current-homepage",
});
await execute(currentHomepage);
assert.equal(currentHomepage.notifications.at(-1).error, false);
assert.equal(generatedSections(currentHomepage).length, 1);
const currentHomepageSection = generatedSections(currentHomepage)[0];
assert.equal(currentHomepageSection.name, "[CURRENT] Homepage — production snapshot");
const currentHomepageNodes = allNodes(currentHomepageSection);
const currentHomepageText = currentHomepageNodes
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "Homepage — current production snapshot",
  "I help companies connect with their audiences through clear, honest communication.",
  "More ways of making digital communication useful.",
  "Clear thinking, honest communication and a practical way forward.",
]) {
  assert.ok(currentHomepageText.includes(expected), `Missing current Homepage content: ${expected}`);
}
const currentHero = currentHomepageNodes.find((node) => node.name.includes("Hero — full-bleed"));
assert.equal(currentHero.fills[0].type, "IMAGE");
assert.equal(currentHero.fills[0].imageHash, "packaged-production-image");
await execute(currentHomepage);
assert.equal(generatedSections(currentHomepage).length, 1);

const currentImaginart = createFigma({
  editorType: "figma",
  fileName: "Abi Personal Website",
  pageName: "02 — Case Studies",
  command: "publish-current-imaginart",
});
const currentImaginartBlocker = new MockNode("SECTION", currentImaginart.currentPage);
currentImaginartBlocker.name = "Existing approved material farther right";
currentImaginartBlocker.x = 3000;
currentImaginartBlocker.y = 0;
currentImaginartBlocker.resize(1200, 9000);
currentImaginart.currentPage.children.push(currentImaginartBlocker);
await execute(currentImaginart);
assert.equal(currentImaginart.notifications.at(-1).error, false);
assert.equal(generatedSections(currentImaginart).length, 1);
const currentImaginartSection = generatedSections(currentImaginart)[0];
assert.equal(currentImaginartSection.name, "[CURRENT] imaginArt — production snapshot");
assert.equal(currentImaginartSection.x, 4600, "Current snapshots must clear every top-level canvas item");
assert.equal(currentImaginartSection.y, 0, "Current snapshots should align with the page's topmost material");
const currentImaginartText = allNodes(currentImaginartSection)
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of ["~24%", "~34%", "Not an A/B test", "Madrid Open Days 2026", "AV Supports Catalogue", "Lumens"]) {
  assert.ok(currentImaginartText.toLowerCase().includes(expected.toLowerCase()), `Missing current imaginArt content: ${expected}`);
}

const currentAbout = createFigma({
  editorType: "figma",
  fileName: "Abi Personal Website",
  pageName: "03 — About + Archive",
  command: "publish-current-about",
});
await execute(currentAbout);
assert.equal(currentAbout.notifications.at(-1).error, false);
assert.equal(generatedSections(currentAbout).length, 1);
const currentAboutSection = generatedSections(currentAbout)[0];
assert.equal(currentAboutSection.name, "[CURRENT] About — production snapshot");
const currentAboutNodes = allNodes(currentAboutSection);
assert.ok(currentAboutNodes.some((node) => node.name === "About — desktop · current production snapshot"));
assert.ok(currentAboutNodes.some((node) => node.name === "About — mobile · current production snapshot"));
const currentAboutPhoto = currentAboutNodes.find((node) => node.name === "About portrait — full body — AbileneAbout");
assert.equal(currentAboutPhoto.fills[0].imageHash, "packaged-production-image");

const wrongFile = createFigma({
  editorType: "figjam",
  fileName: "Unrelated FigJam",
  pageName: "Board",
  command: "build-moodboard",
});
await execute(wrongFile);
assert.equal(generatedSections(wrongFile).length, 0);
assert.equal(wrongFile.notifications.at(-1).error, true);

console.log("Abi Website Design Publisher validation passed.");
