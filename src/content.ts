import type { Passage, QuizQuestion, Section, StudyItem, Work, WorkCategory } from "./types";

interface RawWork {
  id: string;
  file: string;
  category: WorkCategory;
  html: string;
}

const htmlModules = import.meta.glob<string>("../Knowledge/*.html", {
  eager: true,
  import: "default",
  query: "?raw",
});

const KNOWN_IDS: Record<string, string> = {
  "great_books_1_secrets_of_the_universe.html": "great-books-secrets",
  "great_books_5_the_odyssey.html": "odyssey",
  "iliad.html": "iliad",
  "divine_comedy.html": "divine-comedy",
  "paradise-lost.html": "paradise-lost",
  "newton-daniel-study.html": "newton-daniel",
};

const RAW_WORKS: RawWork[] = Object.entries(htmlModules)
  .map(([path, html]) => {
    const file = path.split("/").pop() || path;
    return {
      id: KNOWN_IDS[file] || slugFromFile(file),
      file,
      category: inferCategory(file),
      html,
    };
  })
  .sort((a, b) => a.file.localeCompare(b.file));

const FALLBACK_SUMMARY: Record<string, string> = {
  "great-books-secrets": "Lecture notes on consciousness, imagination, freedom, meditation, and the role of great books.",
  odyssey: "Lecture notes reading the Odyssey as a family story about trauma, memory, and the repair of the soul.",
  iliad: "A primary text explorer for Homeric books, characters, themes, and passages from the Iliad.",
  "divine-comedy": "A canto and passage explorer for Dante's Inferno, Purgatorio, and Paradiso.",
  "paradise-lost": "A study explorer for Milton's Paradise Lost with books, notable passages, characters, and quiz material.",
  "newton-daniel": "A study guide to Newton's Observations upon the Prophecies of Daniel, focused on prophecy, concepts, and chronology.",
  "dante-in-paradise": "A literature study page on Dante's Paradise, poetic tradition, Beatrice, and ascent through the spheres.",
  "dantes-hierarchy-of-hell": "A literature study page on Dante's cosmology, hierarchy, love, and the structure of Hell.",
  "dantes-la-commedia": "A literature study page on Dante's La Commedia, its structure, and its response to the Aeneid.",
  "dantes-revolution": "A literature study page on Dante's revolution, Virgil, Augustine, and The Divine Comedy.",
  "gay-taleses-sparks-of-light": "A literature study page on Gay Talese's writing method, books, essays, and sparks of light.",
  "the-anti-homer": "A literature study page on the Aeneid as anti-Homer and the shift from Greek arete to Roman piety.",
  "the-poetry-of-empire": "A literature study page on the Aeneid, empire, love, piety, and The Divine Comedy.",
};

let cachedWorks: Work[] | null = null;

export function getWorks(): Work[] {
  if (!cachedWorks) {
    cachedWorks = RAW_WORKS.map(normalizeWork);
  }
  return cachedWorks;
}

export function getWork(id: string): Work | undefined {
  return getWorks().find((work) => work.id === id);
}

export function createSourceBlobUrl(work: Work): string {
  return URL.createObjectURL(new Blob([work.rawHtml], { type: "text/html" }));
}

function normalizeWork(raw: RawWork): Work {
  const doc = new DOMParser().parseFromString(raw.html, "text/html");
  const title = cleanText(
    doc.querySelector("title")?.textContent ||
      doc.querySelector("h1")?.textContent ||
      raw.file.replace(".html", ""),
  );
  const body = doc.body.cloneNode(true) as HTMLElement;
  body.querySelectorAll("script, style").forEach((node) => node.remove());

  const sections = extractSections(raw.id, body);
  const keywords = unique([
    ...Array.from(doc.querySelectorAll(".keyword")).map((node) => cleanText(node.textContent || "")),
    ...Array.from(doc.querySelectorAll(".card-title, .flashcard-question")).map((node) => cleanText(node.textContent || "")),
    ...extractArrayNames(raw.html, "CONCEPTS", ["term", "name"]),
  ]).slice(0, 80);
  const passages = extractPassages(raw.id, body, raw.html);
  const characters = unique([
    ...extractArrayNames(raw.html, "CHARACTERS", ["name"]),
    ...Array.from(body.querySelectorAll(".char-name")).map((node) => cleanText(node.textContent || "")),
  ]).slice(0, 80);
  const themes = unique([
    ...extractArrayNames(raw.html, "THEMES", ["name"]),
    ...Array.from(body.querySelectorAll(".theme-name")).map((node) => cleanText(node.textContent || "")),
    ...Array.from(body.querySelectorAll(".card-title")).map((node) => cleanText(node.textContent || "")),
  ]).slice(0, 80);
  const quizQuestions = extractQuizQuestions(raw.html);
  const sourceFlashcards = extractSourceFlashcards(raw.id, doc);
  const studyItems = buildStudyItems(raw.id, sections, passages, keywords, characters, themes, quizQuestions, sourceFlashcards);

  return {
    id: raw.id,
    title,
    sourceFile: raw.file,
    category: raw.category,
    summary: inferSummary(raw.id, body, sections),
    sections,
    passages,
    keywords,
    characters,
    themes,
    studyItems,
    rawHtml: raw.html,
  };
}

function extractSections(workId: string, body: HTMLElement): Section[] {
  const h2s = Array.from(body.querySelectorAll("h2"));
  if (h2s.length >= 4) {
    return h2s.map((heading, index) => {
      const nodes: Node[] = [];
      let current = heading.nextSibling;
      while (current && !(current instanceof HTMLElement && current.tagName.toLowerCase() === "h2")) {
        nodes.push(current.cloneNode(true));
        current = current.nextSibling;
      }
      return makeSection(workId, index, cleanText(heading.textContent || `Section ${index + 1}`), nodes);
    });
  }

  const bookSections = Array.from(body.querySelectorAll(".book-section"));
  if (bookSections.length) {
    return bookSections.map((node, index) => {
      const heading =
        cleanText(node.querySelector(".book-roman")?.textContent || "") +
        (node.querySelector(".book-title") ? `: ${cleanText(node.querySelector(".book-title")?.textContent || "")}` : "");
      return makeSection(workId, index, heading || `Book ${index + 1}`, [node.cloneNode(true)]);
    });
  }

  const chapterPanels = Array.from(body.querySelectorAll("[id^='panel-']"));
  if (chapterPanels.length) {
    return chapterPanels
      .map((node, index) => {
        const heading =
          cleanText(node.querySelector(".chapter-title")?.textContent || "") ||
          cleanText(node.querySelector(".section-title")?.textContent || "") ||
          cleanText(node.getAttribute("id")?.replace("panel-", "").replace(/-/g, " ") || "");
        return makeSection(workId, index, titleCase(heading || `Panel ${index + 1}`), [node.cloneNode(true)]);
      })
      .filter((section) => section.text.length > 40);
  }

  const headings = Array.from(body.querySelectorAll("h1, .page-title, .panel-heading, .chapter-title"));
  if (headings.length) {
    return headings.slice(0, 24).map((node, index) => makeSection(workId, index, cleanText(node.textContent || ""), [node.parentElement?.cloneNode(true) || node.cloneNode(true)]));
  }

  return [makeSection(workId, 0, "Source Notes", [body.cloneNode(true)])];
}

function makeSection(workId: string, index: number, heading: string, nodes: Node[]): Section {
  const shell = document.createElement("div");
  nodes.forEach((node) => shell.appendChild(node));
  sanitizeEmbeddedHtml(shell);
  const keywords = unique(Array.from(shell.querySelectorAll(".keyword, .anno, .tag, .badge")).map((node) => cleanText(node.textContent || ""))).slice(0, 16);
  return {
    id: `${workId}-section-${index}`,
    heading: cleanText(heading) || `Section ${index + 1}`,
    bodyHtml: shell.innerHTML,
    text: cleanText(shell.textContent || ""),
    keywords,
  };
}

function sanitizeEmbeddedHtml(root: HTMLElement): void {
  root
    .querySelectorAll("script, style, button, input, select, textarea, form, iframe, object, embed, link, meta, base")
    .forEach((node) => node.remove());
  root.querySelectorAll("*").forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      if (name.startsWith("on") || name === "style" || name === "srcdoc") {
        node.removeAttribute(attribute.name);
      }
      if (["href", "src", "xlink:href", "action"].includes(name) && !isSafeEmbeddedUrl(attribute.value)) {
        node.removeAttribute(attribute.name);
      }
    });
  });
}

function isSafeEmbeddedUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return true;
  }
  try {
    const url = new URL(trimmed, window.location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) || (url.protocol === "data:" && /^data:image\//i.test(trimmed));
  } catch {
    return false;
  }
}

function extractPassages(workId: string, body: HTMLElement, rawHtml: string): Passage[] {
  const passages: Passage[] = [];

  body.querySelectorAll(".passage, .passage-block, .theme-passage, .quote").forEach((node, index) => {
    const el = node as HTMLElement;
    const ref = cleanText(
      el.querySelector(".passage-label, .tp-source, .passage-ref, .sr-source")?.textContent || `Quote ${index + 1}`,
    );
    const text = cleanText(el.querySelector(".passage-text, .tp-text")?.textContent || el.textContent || "");
    if (text.length > 35) {
      passages.push(makePassage(workId, passages.length, ref, text));
    }
  });

  body.querySelectorAll(".poem-stanza").forEach((node) => {
    const text = cleanText(node.textContent || "");
    const marker = cleanText(previousText(node as HTMLElement, ".speech-marker, .section-divider, .book-title"));
    if (text.length > 80) {
      passages.push(makePassage(workId, passages.length, marker || "Poem passage", text));
    }
  });

  extractObjectTexts(rawHtml, ["ref", "text", "quote", "excerpt"]).forEach((entry) => {
    if (entry.text.length > 80) {
      passages.push(makePassage(workId, passages.length, entry.ref || "Source passage", entry.text));
    }
  });

  return dedupePassages(passages).slice(0, 180);
}

function makePassage(workId: string, index: number, ref: string, text: string): Passage {
  return {
    id: `${workId}-passage-${index}`,
    ref: cleanText(ref),
    text: cleanText(text).slice(0, 1200),
    source: ref,
    themes: [],
    characters: [],
  };
}

function buildStudyItems(
  workId: string,
  sections: Section[],
  passages: Passage[],
  keywords: string[],
  characters: string[],
  themes: string[],
  quizQuestions: QuizQuestion[],
  sourceFlashcards: StudyItem[],
): StudyItem[] {
  const items: StudyItem[] = [...sourceFlashcards];

  sections.slice(0, 18).forEach((section, index) => {
    const answer = section.text.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
    if (answer.length > 80) {
      items.push({
        id: `${workId}-section-card-${index}`,
        workId,
        type: "flashcard",
        prompt: `What is the main idea of "${section.heading}"?`,
        answer,
        sourceRef: section.heading,
      });
    }
  });

  keywords.slice(0, 24).forEach((keyword, index) => {
    const section = sections.find((candidate) => candidate.text.toLowerCase().includes(keyword.toLowerCase()));
    items.push({
      id: `${workId}-keyword-${index}`,
      workId,
      type: "flashcard",
      prompt: `Where does the source discuss "${keyword}"?`,
      answer: section ? `${keyword} appears in "${section.heading}".` : `${keyword} is a source keyword for this work.`,
      sourceRef: section?.heading || "Keyword index",
    });
  });

  [...characters.slice(0, 18), ...themes.slice(0, 18)].forEach((name, index) => {
    items.push({
      id: `${workId}-concept-${index}`,
      workId,
      type: "flashcard",
      prompt: `Identify the role or study context for "${name}".`,
      answer: `The source index includes "${name}" for this work. Review the source section for the exact context before treating it as a factual claim.`,
      sourceRef: "Source index",
    });
  });

  passages.slice(0, 24).forEach((passage, index) => {
    items.push({
      id: `${workId}-passage-${index}`,
      workId,
      type: "passage",
      prompt: `Recall the source or context for this passage: "${passage.text.slice(0, 180)}..."`,
      answer: passage.ref,
      sourceRef: passage.ref,
    });
  });

  quizQuestions.forEach((question, index) => {
    items.push({
      id: `${workId}-quiz-${index}`,
      workId,
      type: "quiz",
      prompt: question.question,
      answer: question.options[question.answerIndex] || "",
      choices: question.options,
      answerIndex: question.answerIndex,
      sourceRef: question.ref || "Source quiz",
    });
  });

  return items;
}

function extractSourceFlashcards(workId: string, doc: Document): StudyItem[] {
  return Array.from(doc.querySelectorAll(".flashcard")).flatMap((node, index): StudyItem[] => {
      const prompt = cleanText(node.querySelector(".flashcard-question")?.textContent || "");
      const answer = cleanText(node.querySelector(".flashcard-answer")?.textContent || "");
      if (!prompt || !answer) return [];
      return [{
        id: `${workId}-source-flashcard-${index}`,
        workId,
        type: "flashcard" as const,
        prompt,
        answer,
        sourceRef: "Source study card",
      }];
    });
}

function extractQuizQuestions(rawHtml: string): QuizQuestion[] {
  const blocks = [...rawHtml.matchAll(/\{\s*q:\s*["'`]([^"'`]+)["'`][\s\S]*?options:\s*\[([^\]]+)\][\s\S]*?(?:answer|correct):\s*(\d+)/g)];
  return blocks
    .map((match) => ({
      question: decodeEntities(match[1]),
      options: [...match[2].matchAll(/["'`]([^"'`]+)["'`]/g)].map((option) => decodeEntities(option[1])),
      answerIndex: Number(match[3]),
    }))
    .filter((question) => question.question && question.options.length >= 2 && Number.isFinite(question.answerIndex))
    .slice(0, 30);
}

function extractArrayNames(rawHtml: string, constName: string, fields: string[]): string[] {
  const start = rawHtml.indexOf(`const ${constName}`);
  if (start === -1) return [];
  const end = rawHtml.indexOf("];", start);
  if (end === -1) return [];
  const slice = rawHtml.slice(start, end);
  return unique(
    fields.flatMap((field) =>
      [...slice.matchAll(new RegExp(`${field}:\\s*["'\`]([^"'\`]+)["'\`]`, "g"))].map((match) => decodeEntities(match[1])),
    ),
  );
}

function extractObjectTexts(rawHtml: string, fields: string[]): Array<{ ref: string; text: string }> {
  const values: Array<{ ref: string; text: string }> = [];
  const textRegex = new RegExp(`(?:${fields.join("|")}):\\s*(["'\`])([\\s\\S]*?)\\1`, "g");
  let match: RegExpExecArray | null;
  while ((match = textRegex.exec(rawHtml)) !== null) {
    const text = decodeEntities(match[2]).replace(/\\n/g, " ");
    if (text.length > 70 && !text.includes("<") && !text.includes("${")) {
      values.push({ ref: "Source data", text });
    }
  }
  return values.slice(0, 220);
}

function inferSummary(workId: string, body: HTMLElement, sections: Section[]): string {
  const explicit = cleanText(
    body.querySelector(".book-summary, .chapter-subtitle, .page-subtitle, .welcome p, .panel-sub")?.textContent || "",
  );
  if (explicit.length > 80) return explicit.slice(0, 260);
  const firstSection = sections.find((section) => section.text.length > 120);
  if (firstSection) return firstSection.text.slice(0, 260);
  return FALLBACK_SUMMARY[workId];
}

function previousText(node: HTMLElement, selector: string): string {
  let current: Element | null = node.previousElementSibling;
  while (current) {
    if (current.matches(selector)) return current.textContent || "";
    current = current.previousElementSibling;
  }
  return "";
}

function dedupePassages(passages: Passage[]): Passage[] {
  const seen = new Set<string>();
  return passages.filter((passage) => {
    const key = passage.text.slice(0, 120).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cleanText(input: string): string {
  return decodeEntities(input).replace(/\s+/g, " ").trim();
}

function decodeEntities(input: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = input;
  return textarea.value;
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  return values
    .map((value) => cleanText(value))
    .filter((value) => {
      const key = value.toLowerCase();
      if (!value || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugFromFile(file: string): string {
  return file
    .replace(/\.html$/i, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function inferCategory(file: string): WorkCategory {
  if (file.includes("newton") || file.includes("daniel")) return "Theology";
  if (file.includes("iliad") || file.includes("odyssey") || file.includes("paradise-lost")) return "Epic Poetry";
  if (file.includes("divine_comedy")) return "Primary Text";
  if (file.includes("great_books")) return "Lecture Notes";
  return "Literary Studies";
}
