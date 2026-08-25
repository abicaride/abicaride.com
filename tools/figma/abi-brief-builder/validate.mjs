import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const pluginSource = fs.readFileSync(new URL("./code.js", import.meta.url), "utf8");

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
    (node) => node.type === "SECTION" && node.name.startsWith("[ABI BRIEF]"),
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
assert.equal(moodboard.notifications.at(-1).error, true);

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
  "V2 — Approved production foundations",
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
  "Made with 🚀 Astro, ✍️ Pages CMS, 🤖 Codex and lots of ❤️.",
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
  (node) => node.type === "TEXT" && node.characters.startsWith("One lead case showing"),
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
  ["Work", 940],
  ["About", 1060],
  ["Contact", 1190],
  ["ES", 1320],
];
for (const [label, x] of heroNavigation) {
  const item = finalDirectionNodes.find(
    (node) => node.type === "TEXT" && node.characters === label && node.x === x && node.y === 44,
  );
  assert.ok(item, `Missing hero navigation item: ${label}`);
  assert.equal(item.fills[0].color.r, 0xee / 0xff);
  assert.equal(item.fills[0].color.g, 0xec / 0xff);
  assert.equal(item.fills[0].color.b, 0xe6 / 0xff);
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
assert.equal(imaginartPreproductionSection.height, 8680);
const imaginartPreproductionNodes = allNodes(imaginartPreproductionSection);
const imaginartPreproductionText = imaginartPreproductionNodes
  .filter((node) => node.type === "TEXT")
  .map((node) => node.characters)
  .join("\n");
for (const expected of [
  "Refreshing a specialist B2B newsletter",
  "MUNDO BRIGHTSIGN",
  "~24% → ~34%",
  "NOT an A/B test",
  "Launching a new brand in Spain",
  "TURTLE AV · IMAGINART",
  "Planning and promoting a corporate event",
  "MADRID OPEN DAYS 2026",
  "AV Supports Catalogue",
  "Lumens",
  "Bilbao",
  "~110–125",
  "usual similar-event range ~70–80",
  "not audited",
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
assert.equal(imaginartPreproductionNodes.filter((node) => node.type === "ELLIPSE").length, 0);
const caseBody = imaginartPreproductionNodes.find(
  (node) => node.type === "TEXT" && node.characters.startsWith("NOT AN A/B TEST"),
);
assert.equal(caseBody.fontName.family, "Montserrat");
const caseHeading = imaginartPreproductionNodes.find(
  (node) => node.type === "TEXT" && node.characters === "Refreshing a specialist B2B newsletter",
);
assert.equal(caseHeading.fontName.family, "Inter");
await execute(imaginartPreproduction);
assert.equal(
  generatedSections(imaginartPreproduction).length,
  1,
  "A final imaginArt rerun must not duplicate content",
);
assert.equal(imaginartPreproduction.notifications.at(-1).error, false);

const wrongFile = createFigma({
  editorType: "figjam",
  fileName: "Unrelated FigJam",
  pageName: "Board",
  command: "build-moodboard",
});
await execute(wrongFile);
assert.equal(generatedSections(wrongFile).length, 0);
assert.equal(wrongFile.notifications.at(-1).error, true);

console.log("Abi Website Brief Builder validation passed.");
