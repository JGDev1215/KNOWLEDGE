import type { ProgressState } from "./types";

const STORAGE_KEY = "homer-knowledge-study:v1";

export const emptyProgress: ProgressState = {
  completedSections: {},
  bookmarks: {},
  quizScores: {},
  lastOpened: {},
  reviewHistory: {},
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    return { ...emptyProgress, ...JSON.parse(raw) };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: ProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
