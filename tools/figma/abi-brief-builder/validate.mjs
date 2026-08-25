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
assert.equal(moodboardSection.height, 4240);
assert.equal(
  allNodes(moodboardSection).filter((node) => node.type === "SHAPE_WITH_TEXT").length,
  11,
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
  "Potential lead case — imaginArt",
  "exact +10pp email-open-rate context",
]) {
  assert.ok(moodboardText.includes(expected), `Missing Moodboard content: ${expected}`);
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
