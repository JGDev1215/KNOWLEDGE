import type { WorkProvenance } from "./types";

export const PROVENANCE_BY_FILE: Record<string, WorkProvenance> = {
  "divine_comedy.html": {
    kind: "public-domain-primary",
    statusLabel: "Public-domain primary text",
    notice: "This page is based on Dante's Divine Comedy in Henry Wadsworth Longfellow's public-domain translation.",
    requiresCaution: false,
    sourceLinks: [{ label: "Project Gutenberg eBook 1004", url: "https://www.gutenberg.org/ebooks/1004" }],
  },
  "iliad.html": {
    kind: "public-domain-primary",
    statusLabel: "Public-domain primary text",
    notice: "This page uses Homer's Iliad in Samuel Butler's public-domain translation.",
    requiresCaution: false,
    sourceLinks: [{ label: "Project Gutenberg Samuel Butler Iliad", url: "https://www.gutenberg.org/files/2199/2199-h/2199-h.htm" }],
  },
  "paradise-lost.html": {
    kind: "public-domain-primary",
    statusLabel: "Public-domain primary text",
    notice: "This page uses John Milton's Paradise Lost, a public-domain source text.",
    requiresCaution: false,
    sourceLinks: [{ label: "Project Gutenberg eBook 20", url: "https://www.gutenberg.org/ebooks/20" }],
  },
};

export const UNKNOWN_PROVENANCE: WorkProvenance = {
  kind: "unverified-source",
  statusLabel: "Source not documented",
  notice: "No provenance metadata is available for this work.",
  requiresCaution: true,
  sourceLinks: [],
};
