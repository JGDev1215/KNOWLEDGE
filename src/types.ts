export type WorkCategory = "Lecture Notes" | "Primary Text" | "Theology" | "Epic Poetry" | "Literary Studies";

export type ProvenanceKind = "public-domain-primary" | "lecture-derived" | "mixed-source" | "unverified-source";

export interface SourceLink {
  label: string;
  url?: string;
  localPath?: string;
}

export interface WorkProvenance {
  kind: ProvenanceKind;
  statusLabel: string;
  notice: string;
  sourceLinks: SourceLink[];
  requiresCaution: boolean;
}

export interface Section {
  id: string;
  heading: string;
  bodyHtml: string;
  text: string;
  keywords: string[];
}

export interface Passage {
  id: string;
  ref: string;
  text: string;
  source: string;
  themes: string[];
  characters: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
  ref?: string;
}

export interface StudyItem {
  id: string;
  workId: string;
  type: "flashcard" | "quiz" | "passage";
  prompt: string;
  answer: string;
  choices?: string[];
  answerIndex?: number;
  sourceRef: string;
}

export interface Work {
  id: string;
  title: string;
  sourceFile: string;
  sourceText: string;
  category: WorkCategory;
  provenance: WorkProvenance;
  summary: string;
  sections: Section[];
  passages: Passage[];
  keywords: string[];
  characters: string[];
  themes: string[];
  studyItems: StudyItem[];
  rawHtml: string;
}

export interface ProgressState {
  completedSections: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
  quizScores: Record<string, number[]>;
  lastOpened: Record<string, string>;
  reviewHistory: Record<string, number>;
}

export interface SearchResult {
  work: Work;
  kind: "Title" | "Section" | "Keyword" | "Passage" | "Character" | "Theme";
  id: string;
  title: string;
  excerpt: string;
}
