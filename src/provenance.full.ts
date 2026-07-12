import type { WorkProvenance } from "./types";

const rawScriptBase = "../RawScripts/";

export const PROVENANCE_BY_FILE: Record<string, WorkProvenance> = {
  "dante_in_paradise.html": {
    kind: "lecture-derived",
    statusLabel: "Lecture-derived interpretation",
    notice: "This page is built from a local lecture transcript and now includes public-domain Paradiso excerpts. Treat broad literary claims as the speaker's interpretation unless separately sourced.",
    requiresCaution: true,
    sourceLinks: [
      { label: "Local transcript", localPath: `${rawScriptBase}Great Books #12: Dante in Paradise.md` },
      { label: "Project Gutenberg Paradiso", url: "https://www.gutenberg.org/ebooks/1003" },
    ],
  },
  "dantes_hierarchy_of_hell.html": {
    kind: "lecture-derived",
    statusLabel: "Lecture-derived interpretation",
    notice: "This page summarizes a local lecture transcript and now includes public-domain Inferno excerpts. Theological framing and cosmology claims should be read as interpretive notes.",
    requiresCaution: true,
    sourceLinks: [
      { label: "Local transcript", localPath: `${rawScriptBase}Great Books #10: Dante's Hierarchy of Hell.md` },
      { label: "Project Gutenberg Inferno", url: "https://www.gutenberg.org/ebooks/1001" },
    ],
  },
  "dantes_la_commedia.html": {
    kind: "lecture-derived",
    statusLabel: "Lecture-derived interpretation",
    notice: "This page summarizes a local lecture transcript and now includes public-domain Divine Comedy excerpts. Claims about literary influence and church history need citations before use as fact.",
    requiresCaution: true,
    sourceLinks: [
      { label: "Local transcript", localPath: `${rawScriptBase} Great Books #9: Dante's La Commedia.md` },
      { label: "Project Gutenberg Inferno", url: "https://www.gutenberg.org/ebooks/1001" },
      { label: "Project Gutenberg Purgatorio", url: "https://www.gutenberg.org/ebooks/1002" },
      { label: "Project Gutenberg Paradiso", url: "https://www.gutenberg.org/ebooks/1003" },
    ],
  },
  "dantes_revolution.html": {
    kind: "lecture-derived",
    statusLabel: "Lecture-derived interpretation",
    notice: "This page contains broad causation claims from a lecture transcript and now includes public-domain Divine Comedy excerpts. Those claims are not certified as neutral historical fact.",
    requiresCaution: true,
    sourceLinks: [
      { label: "Local transcript", localPath: `${rawScriptBase}Great Books #11: Dante's Revolution.md` },
      { label: "Project Gutenberg Inferno", url: "https://www.gutenberg.org/ebooks/1001" },
      { label: "Project Gutenberg Purgatorio", url: "https://www.gutenberg.org/ebooks/1002" },
      { label: "Project Gutenberg Paradiso", url: "https://www.gutenberg.org/ebooks/1003" },
    ],
  },
  "divine_comedy.html": {
    kind: "public-domain-primary",
    statusLabel: "Public-domain primary text",
    notice: "This page is based on Dante's Divine Comedy in Henry Wadsworth Longfellow's public-domain translation.",
    requiresCaution: false,
    sourceLinks: [{ label: "Project Gutenberg eBook 1004", url: "https://www.gutenberg.org/ebooks/1004" }],
  },
  "gay_taleses_sparks_of_light.html": {
    kind: "lecture-derived",
    statusLabel: "Lecture-derived modern-author material",
    notice: "This page concerns a living modern author and a local lecture transcript. The added source references are citation-only; avoid treating copyrighted article/book material as reusable unless rights are confirmed.",
    requiresCaution: true,
    sourceLinks: [
      { label: "Local transcript", localPath: `${rawScriptBase} Great Books #13: Gay Talese's Sparks of Light.md` },
      { label: "Penguin Random House author page", url: "https://www.randomhouse.com/kvpa/talese/" },
      { label: "Penguin Random House essays page", url: "https://www.randomhouse.com/kvpa/talese/essays.html" },
    ],
  },
  "great_books_1_secrets_of_the_universe.html": {
    kind: "unverified-source",
    statusLabel: "Source not fully documented",
    notice: "No matching raw script is tracked for this page. Use as draft study material until provenance is added.",
    requiresCaution: true,
    sourceLinks: [],
  },
  "great_books_5_the_odyssey.html": {
    kind: "mixed-source",
    statusLabel: "Primary text plus missing local source",
    notice: "The Odyssey is public-domain in many translations, but this page has no matching tracked raw script or exact local edition metadata.",
    requiresCaution: true,
    sourceLinks: [{ label: "Project Gutenberg eBook 1727", url: "https://www.gutenberg.org/ebooks/1727" }],
  },
  "iliad.html": {
    kind: "public-domain-primary",
    statusLabel: "Public-domain primary text",
    notice: "This page uses Homer's Iliad in Samuel Butler's public-domain translation.",
    requiresCaution: false,
    sourceLinks: [{ label: "Project Gutenberg Samuel Butler Iliad", url: "https://www.gutenberg.org/files/2199/2199-h/2199-h.htm" }],
  },
  "newton-daniel-study.html": {
    kind: "mixed-source",
    statusLabel: "Public-domain source with theological interpretation",
    notice: "Newton's source text is public-domain, but prophetic chronology summaries should be treated as Newton's interpretation, not modern consensus.",
    requiresCaution: true,
    sourceLinks: [{ label: "Project Gutenberg eBook 16878", url: "https://www.gutenberg.org/ebooks/16878" }],
  },
  "paradise-lost.html": {
    kind: "public-domain-primary",
    statusLabel: "Public-domain primary text",
    notice: "This page uses John Milton's Paradise Lost, a public-domain source text.",
    requiresCaution: false,
    sourceLinks: [{ label: "Project Gutenberg eBook 20", url: "https://www.gutenberg.org/ebooks/20" }],
  },
  "the_anti_homer.html": {
    kind: "lecture-derived",
    statusLabel: "Lecture-derived interpretation",
    notice: "This page summarizes a local lecture transcript and now includes public-domain Odyssey/Aeneid excerpts. Claims about Homer, Greece, Rome, and Virgil should still be read as interpretive theses.",
    requiresCaution: true,
    sourceLinks: [
      { label: "Local transcript", localPath: `${rawScriptBase} Great Books #7: The Anti-Homer.md` },
      { label: "Project Gutenberg Odyssey", url: "https://www.gutenberg.org/ebooks/1727" },
      { label: "Project Gutenberg Aeneid", url: "https://www.gutenberg.org/ebooks/228" },
    ],
  },
  "the_poetry_of_empire.html": {
    kind: "lecture-derived",
    statusLabel: "Lecture-derived interpretation",
    notice: "This page summarizes a local lecture transcript and now includes public-domain Aeneid excerpts. Broad historical/literary claims still need citation before factual use.",
    requiresCaution: true,
    sourceLinks: [
      { label: "Local transcript", localPath: `${rawScriptBase}Great Books #8: The Poetry of Empire.md` },
      { label: "Project Gutenberg Aeneid", url: "https://www.gutenberg.org/ebooks/228" },
    ],
  },
};

export const UNKNOWN_PROVENANCE: WorkProvenance = {
  kind: "unverified-source",
  statusLabel: "Source not documented",
  notice: "No provenance metadata is available for this work.",
  requiresCaution: true,
  sourceLinks: [],
};
