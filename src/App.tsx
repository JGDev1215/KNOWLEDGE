import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  Library,
  ListChecks,
  RotateCcw,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createSourceBlobUrl, getWork, getWorks } from "./content";
import { emptyProgress, loadProgress, saveProgress } from "./storage";
import type { ProgressState, SearchResult, Section, StudyItem, Work } from "./types";

type Route =
  | { name: "library" }
  | { name: "search"; query?: string }
  | { name: "review" }
  | { name: "reader"; workId: string; sectionId?: string }
  | { name: "study"; workId?: string };

const works = getWorks();
const worksById = new Map(works.map((work) => [work.id, work]));

export function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname, window.location.search));
  const [progress, setProgress] = useState<ProgressState>(() => (typeof localStorage === "undefined" ? emptyProgress : loadProgress()));

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname, window.location.search));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (next: Route) => {
    const url = routeToUrl(next);
    window.history.pushState({}, "", url);
    setRoute(next);
  };

  const updateProgress = (updater: (state: ProgressState) => ProgressState) => {
    setProgress((state) => updater({ ...state }));
  };

  return (
    <div className="app-shell">
      <TopNav route={route} navigate={navigate} />
      <main className="app-main">
        {route.name === "library" && <LibraryView progress={progress} navigate={navigate} />}
        {route.name === "search" && <SearchView initialQuery={route.query || ""} navigate={navigate} />}
        {route.name === "review" && <ReviewView progress={progress} navigate={navigate} updateProgress={updateProgress} />}
        {route.name === "reader" && (
          <ReaderView
            workId={route.workId}
            sectionId={route.sectionId}
            progress={progress}
            navigate={navigate}
            updateProgress={updateProgress}
          />
        )}
        {route.name === "study" && <StudyView workId={route.workId} progress={progress} updateProgress={updateProgress} navigate={navigate} />}
      </main>
    </div>
  );
}

function TopNav({ route, navigate }: { route: Route; navigate: (route: Route) => void }) {
  return (
    <header className="top-nav">
      <button className="brand-button" onClick={() => navigate({ name: "library" })}>
        <Library size={21} />
        <span>Knowledge Study</span>
      </button>
      <nav className="nav-actions" aria-label="Main navigation">
        <button className={route.name === "library" ? "active" : ""} onClick={() => navigate({ name: "library" })}>
          <BookOpen size={18} />
          <span>Library</span>
        </button>
        <button className={route.name === "search" ? "active" : ""} onClick={() => navigate({ name: "search" })}>
          <Search size={18} />
          <span>Search</span>
        </button>
        <button className={route.name === "study" ? "active" : ""} onClick={() => navigate({ name: "study" })}>
          <Sparkles size={18} />
          <span>Study</span>
        </button>
        <button className={route.name === "review" ? "active" : ""} onClick={() => navigate({ name: "review" })}>
          <ListChecks size={18} />
          <span>Review</span>
        </button>
      </nav>
    </header>
  );
}

function LibraryView({ progress, navigate }: { progress: ProgressState; navigate: (route: Route) => void }) {
  const stats = works.reduce(
    (acc, work) => {
      acc.sections += work.sections.length;
      acc.passages += work.passages.length;
      acc.cards += work.studyItems.length;
      return acc;
    },
    { sections: 0, passages: 0, cards: 0 },
  );

  return (
    <div className="page-stack">
      <section className="dashboard-band">
        <div>
          <p className="eyebrow">Personal study library</p>
          <h1>Study the Knowledge folder as one connected course.</h1>
          <p className="lede">
            Browse source notes, search across every work, mark progress, bookmark difficult passages, and drill recall from the same
            source material.
          </p>
        </div>
        <div className="stat-grid">
          <Metric label="Works" value={works.length.toString()} />
          <Metric label="Sections" value={stats.sections.toString()} />
          <Metric label="Passages" value={stats.passages.toString()} />
          <Metric label="Study Items" value={stats.cards.toString()} />
        </div>
      </section>

      <AuditReadinessBanner />

      <section className="library-grid">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} progress={progress} navigate={navigate} />
        ))}
      </section>
    </div>
  );
}

function WorkCard({ work, progress, navigate }: { work: Work; progress: ProgressState; navigate: (route: Route) => void }) {
  const complete = work.sections.filter((section) => progress.completedSections[section.id]).length;
  const percent = work.sections.length ? Math.round((complete / work.sections.length) * 100) : 0;
  const lastSection = progress.lastOpened[work.id];

  return (
    <article className="work-card">
      <div className="work-card-top">
        <span className="category-pill">{work.category}</span>
        <span className="progress-label">{percent}% complete</span>
      </div>
      <h2>{work.title}</h2>
      <p>{work.summary}</p>
      <ProvenanceNotice work={work} compact />
      <div className="mini-progress" aria-label={`${percent}% complete`}>
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="work-meta">
        <span>{work.sections.length} sections</span>
        <span>{work.passages.length} passages</span>
        <span>{work.studyItems.length} drills</span>
      </div>
      <div className="card-actions">
        <button onClick={() => navigate({ name: "reader", workId: work.id, sectionId: lastSection || work.sections[0]?.id })}>
          <BookOpen size={17} />
          <span>Read</span>
        </button>
        <button onClick={() => navigate({ name: "study", workId: work.id })}>
          <Sparkles size={17} />
          <span>Study</span>
        </button>
      </div>
    </article>
  );
}

function ReaderView({
  workId,
  sectionId,
  progress,
  navigate,
  updateProgress,
}: {
  workId: string;
  sectionId?: string;
  progress: ProgressState;
  navigate: (route: Route) => void;
  updateProgress: (updater: (state: ProgressState) => ProgressState) => void;
}) {
  const work = getWork(workId);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  if (!work) return <NotFound navigate={navigate} />;

  const section = work.sections.find((candidate) => candidate.id === sectionId) || work.sections[0];
  const completed = section ? Boolean(progress.completedSections[section.id]) : false;
  const bookmarked = section ? Boolean(progress.bookmarks[section.id]) : false;

  const openSource = () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    const url = createSourceBlobUrl(work);
    setSourceUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const selectSection = (next: Section) => {
    updateProgress((state) => ({
      ...state,
      lastOpened: { ...state.lastOpened, [work.id]: next.id },
    }));
    navigate({ name: "reader", workId: work.id, sectionId: next.id });
  };

  return (
    <div className="reader-layout">
      <aside className="reader-sidebar">
        <button className="back-button" onClick={() => navigate({ name: "library" })}>
          <ArrowLeft size={17} />
          Library
        </button>
        <div className="side-title">
          <span>{work.category}</span>
          <h1>{work.title}</h1>
          <small className={`provenance-badge ${work.provenance.kind}`}>{work.provenance.statusLabel}</small>
        </div>
        <nav className="section-list" aria-label="Sections">
          {work.sections.map((candidate) => (
            <button
              key={candidate.id}
              className={candidate.id === section?.id ? "active" : ""}
              onClick={() => selectSection(candidate)}
            >
              {progress.completedSections[candidate.id] ? <CheckCircle2 size={17} /> : <Circle size={17} />}
              <span>{candidate.heading}</span>
            </button>
          ))}
        </nav>
      </aside>

      <article className="reader-panel">
        <div className="reader-toolbar">
          <button
            className={completed ? "tool-button active" : "tool-button"}
            onClick={() =>
              section &&
              updateProgress((state) => ({
                ...state,
                completedSections: { ...state.completedSections, [section.id]: !completed },
                lastOpened: { ...state.lastOpened, [work.id]: section.id },
              }))
            }
          >
            <Check size={17} />
            <span>{completed ? "Completed" : "Mark Complete"}</span>
          </button>
          <button
            className={bookmarked ? "tool-button active" : "tool-button"}
            onClick={() =>
              section &&
              updateProgress((state) => ({
                ...state,
                bookmarks: { ...state.bookmarks, [section.id]: !bookmarked },
                lastOpened: { ...state.lastOpened, [work.id]: section.id },
              }))
            }
          >
            <Bookmark size={17} />
            <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>
          <button className="tool-button" onClick={() => navigate({ name: "study", workId: work.id })}>
            <Sparkles size={17} />
            <span>Study</span>
          </button>
          <button className="tool-button" onClick={openSource}>
            <FileText size={17} />
            <span>Open Source</span>
          </button>
        </div>

        {section && (
          <>
            <header className="reader-heading">
              <p>{work.sourceFile}</p>
              <h2>{section.heading}</h2>
              <ProvenanceNotice work={work} />
              {section.keywords.length > 0 && (
                <div className="keyword-row">
                  {section.keywords.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              )}
            </header>
            <div className="source-content" dangerouslySetInnerHTML={{ __html: section.bodyHtml }} />
          </>
        )}
      </article>
    </div>
  );
}

function SearchView({ initialQuery, navigate }: { initialQuery: string; navigate: (route: Route) => void }) {
  const [query, setQuery] = useState(initialQuery);
  const results = useMemo(() => runSearch(query), [query]);

  return (
    <div className="page-stack">
      <section className="panel-block">
        <p className="eyebrow">Global search</p>
        <h1>Search every work, heading, keyword, passage, theme, and character.</h1>
        <label className="search-box">
          <Search size={20} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Odysseus, noumena, Inferno, Satan, prophecy, Achilles" />
        </label>
      </section>

      <section className="results-list">
        {query.trim() && <p className="result-count">{results.length} results</p>}
        {!query.trim() && <EmptyState title="Enter a term to search the full library." />}
        {query.trim() && results.length === 0 && <EmptyState title="No matches found." />}
        {results.map((result, index) => (
          <button
            key={`${result.work.id}-${result.kind}-${result.id}-${index}`}
            className="result-card"
            onClick={() => navigate({ name: "reader", workId: result.work.id, sectionId: result.id.startsWith(result.work.id) ? result.id : undefined })}
          >
            <span>{result.kind} - {result.work.title}</span>
            <small className={`provenance-badge ${result.work.provenance.kind}`}>{result.work.provenance.statusLabel}</small>
            <strong>{result.title}</strong>
            <p>{result.excerpt}</p>
          </button>
        ))}
      </section>
    </div>
  );
}

function StudyView({
  workId,
  progress,
  updateProgress,
  navigate,
}: {
  workId?: string;
  progress: ProgressState;
  updateProgress: (updater: (state: ProgressState) => ProgressState) => void;
  navigate: (route: Route) => void;
}) {
  const selectedWork = workId ? getWork(workId) : undefined;
  const workPool = selectedWork ? [selectedWork] : works;
  const items = workPool.flatMap((work) => work.studyItems);
  const [mode, setMode] = useState<StudyItem["type"]>("flashcard");
  const filtered = items.filter((item) => item.type === mode);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = filtered[index % Math.max(filtered.length, 1)];
  const currentWork = current ? worksById.get(current.workId) : undefined;

  useEffect(() => {
    setIndex(0);
    setRevealed(false);
  }, [workId, mode]);

  const recordReview = (item: StudyItem, score: number) => {
    updateProgress((state) => ({
      ...state,
      quizScores:
        item.type === "quiz"
          ? { ...state.quizScores, [item.workId]: [...(state.quizScores[item.workId] || []), score] }
          : state.quizScores,
      reviewHistory: { ...state.reviewHistory, [item.id]: Date.now() },
    }));
  };

  return (
    <div className="page-stack">
      <section className="study-header">
        <div>
          <p className="eyebrow">Recall practice</p>
          <h1>{selectedWork ? selectedWork.title : "All Works Study Mode"}</h1>
          <p className="lede">Drill flashcards, passage prompts, and source quiz questions generated from the Knowledge files.</p>
          {selectedWork && <ProvenanceNotice work={selectedWork} compact />}
        </div>
        {selectedWork && (
          <button className="secondary-button" onClick={() => navigate({ name: "reader", workId: selectedWork.id })}>
            <BookOpen size={17} />
            Read Source
          </button>
        )}
      </section>

      <div className="mode-tabs">
        <button className={mode === "flashcard" ? "active" : ""} onClick={() => setMode("flashcard")}>
          <Star size={17} />
          Flashcards
        </button>
        <button className={mode === "passage" ? "active" : ""} onClick={() => setMode("passage")}>
          <FileText size={17} />
          Passages
        </button>
        <button className={mode === "quiz" ? "active" : ""} onClick={() => setMode("quiz")}>
          <ListChecks size={17} />
          Quiz
        </button>
      </div>

      {!current && <EmptyState title="No study items available for this mode." />}
      {current && (
        <section className="study-card">
          <div className="study-card-meta">
            <span>{modeLabel(current.type)}</span>
            <span>{index + 1} of {filtered.length}</span>
          </div>
          {currentWork && <ProvenanceNotice work={currentWork} compact />}
          <h2>{current.prompt}</h2>
          {current.type === "quiz" && current.choices ? (
            <QuizChoices key={current.id} item={current} recordReview={recordReview} />
          ) : (
            <>
              {revealed ? <p className="answer-box">{current.answer}</p> : <p className="answer-placeholder">Reveal the answer when you are ready.</p>}
              <div className="study-actions">
                <button onClick={() => setRevealed((value) => !value)}>
                  <RotateCcw size={17} />
                  {revealed ? "Hide Answer" : "Reveal Answer"}
                </button>
                <button
                  onClick={() => {
                    recordReview(current, revealed ? 1 : 0);
                    setRevealed(false);
                    setIndex((value) => (value + 1) % filtered.length);
                  }}
                >
                  <ChevronRight size={17} />
                  Next
                </button>
              </div>
            </>
          )}
          <footer>{current.sourceRef}</footer>
        </section>
      )}

      <WorkPicker currentWorkId={workId} navigate={navigate} />
      <ProgressPanel progress={progress} />
    </div>
  );
}

function QuizChoices({ item, recordReview }: { item: StudyItem; recordReview: (item: StudyItem, score: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = item.answerIndex ?? 0;

  return (
    <div className="quiz-area">
      <div className="choice-grid">
        {item.choices?.map((choice, index) => {
          const state = selected === null ? "" : index === correct ? "correct" : selected === index ? "incorrect" : "";
          return (
            <button
              key={choice}
              className={state}
              disabled={selected !== null}
              onClick={() => {
                setSelected(index);
                recordReview(item, index === correct ? 1 : 0);
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className={selected === correct ? "quiz-feedback good" : "quiz-feedback bad"}>
          {selected === correct ? "Correct." : `Correct answer: ${item.answer}`}
        </p>
      )}
    </div>
  );
}

function ReviewView({
  progress,
  navigate,
  updateProgress,
}: {
  progress: ProgressState;
  navigate: (route: Route) => void;
  updateProgress: (updater: (state: ProgressState) => ProgressState) => void;
}) {
  const bookmarkedSections = works.flatMap((work) =>
    work.sections.filter((section) => progress.bookmarks[section.id]).map((section) => ({ work, section })),
  );
  const completedCount = Object.values(progress.completedSections).filter(Boolean).length;
  const reviewCount = Object.keys(progress.reviewHistory).length;

  return (
    <div className="page-stack">
      <section className="dashboard-band compact">
        <div>
          <p className="eyebrow">Review dashboard</p>
          <h1>Track what you have read, saved, and drilled.</h1>
        </div>
        <div className="stat-grid">
          <Metric label="Completed" value={completedCount.toString()} />
          <Metric label="Bookmarks" value={bookmarkedSections.length.toString()} />
          <Metric label="Reviewed" value={reviewCount.toString()} />
        </div>
      </section>

      <section className="panel-block">
        <div className="section-header-row">
          <h2>Bookmarks</h2>
          <button
            className="secondary-button"
            onClick={() => updateProgress((state) => ({ ...state, bookmarks: {} }))}
            disabled={bookmarkedSections.length === 0}
          >
            Clear Bookmarks
          </button>
        </div>
        {bookmarkedSections.length === 0 && <EmptyState title="No bookmarks yet." />}
        <div className="bookmark-list">
          {bookmarkedSections.map(({ work, section }) => (
            <button key={section.id} onClick={() => navigate({ name: "reader", workId: work.id, sectionId: section.id })}>
              <Bookmark size={18} />
              <span>
                <strong>{section.heading}</strong>
                <small>{work.title}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <ProgressPanel progress={progress} />
    </div>
  );
}

function WorkPicker({ currentWorkId, navigate }: { currentWorkId?: string; navigate: (route: Route) => void }) {
  return (
    <section className="work-picker">
      <button className={!currentWorkId ? "active" : ""} onClick={() => navigate({ name: "study" })}>
        All Works
      </button>
      {works.map((work) => (
        <button key={work.id} className={currentWorkId === work.id ? "active" : ""} onClick={() => navigate({ name: "study", workId: work.id })}>
          {work.title}
        </button>
      ))}
    </section>
  );
}

function ProgressPanel({ progress }: { progress: ProgressState }) {
  return (
    <section className="panel-block">
      <h2>Progress by Work</h2>
      <div className="progress-table">
        {works.map((work) => {
          const complete = work.sections.filter((section) => progress.completedSections[section.id]).length;
          const percent = work.sections.length ? Math.round((complete / work.sections.length) * 100) : 0;
          const scores = progress.quizScores[work.id] || [];
          const average = scores.length ? Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) : null;
          return (
            <div className="progress-row" key={work.id}>
              <span>{work.title}</span>
              <div className="mini-progress">
                <span style={{ width: `${percent}%` }} />
              </div>
              <strong>{percent}%</strong>
              <small>{average === null ? "No quiz score" : `${average}% quiz`}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return <div className="empty-state">{title}</div>;
}

function AuditReadinessBanner() {
  const cautionCount = works.filter((work) => work.provenance.requiresCaution).length;
  const publicDomainCount = works.length - cautionCount;

  return (
    <section className="audit-readiness" aria-label="Audit readiness">
      <div>
        <p className="eyebrow">Audit status</p>
        <h2>Not public-release ready.</h2>
        <p>
          {publicDomainCount} works have public-domain primary-source provenance. {cautionCount} works still require caution because they
          are lecture-derived, mixed-source, or missing full source documentation.
        </p>
      </div>
      <div className="readiness-status">
        <strong>Blocked</strong>
        <span>Transcript rights and unresolved claims must be cleared before certification.</span>
      </div>
    </section>
  );
}

function ProvenanceNotice({ work, compact = false }: { work: Work; compact?: boolean }) {
  const { provenance } = work;
  return (
    <div className={compact ? "provenance-notice compact" : "provenance-notice"}>
      <span className={`provenance-badge ${provenance.kind}`}>{provenance.statusLabel}</span>
      {!compact && <p>{provenance.notice}</p>}
      {provenance.sourceLinks.length > 0 && (
        <div className="source-link-row">
          {provenance.sourceLinks.map((source) =>
            source.url ? (
              <a key={source.label} href={source.url} target="_blank" rel="noreferrer">
                {source.label}
              </a>
            ) : (
              <span key={source.label}>{source.label}</span>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function NotFound({ navigate }: { navigate: (route: Route) => void }) {
  return (
    <div className="page-stack">
      <EmptyState title="That work could not be found." />
      <button className="secondary-button" onClick={() => navigate({ name: "library" })}>
        Back to Library
      </button>
    </div>
  );
}

function runSearch(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];

  works.forEach((work) => {
    if (contains(work.title, q) || contains(work.summary, q)) {
      results.push({ work, kind: "Title", id: work.sections[0]?.id || work.id, title: work.title, excerpt: work.summary });
    }
    work.sections.forEach((section) => {
      if (contains(section.heading, q) || contains(section.text, q) || section.keywords.some((keyword) => contains(keyword, q))) {
        results.push({ work, kind: "Section", id: section.id, title: section.heading, excerpt: excerpt(section.text, q) });
      }
    });
    work.keywords.forEach((keyword) => {
      if (contains(keyword, q)) {
        results.push({ work, kind: "Keyword", id: work.sections[0]?.id || work.id, title: keyword, excerpt: `Keyword in ${work.title}` });
      }
    });
    work.passages.forEach((passage) => {
      if (contains(passage.ref, q) || contains(passage.text, q)) {
        results.push({ work, kind: "Passage", id: work.sections[0]?.id || work.id, title: passage.ref, excerpt: excerpt(passage.text, q) });
      }
    });
    work.characters.forEach((name) => {
      if (contains(name, q)) {
        results.push({ work, kind: "Character", id: work.sections[0]?.id || work.id, title: name, excerpt: `Character indexed in ${work.title}` });
      }
    });
    work.themes.forEach((name) => {
      if (contains(name, q)) {
        results.push({ work, kind: "Theme", id: work.sections[0]?.id || work.id, title: name, excerpt: `Theme indexed in ${work.title}` });
      }
    });
  });

  return results.slice(0, 80);
}

function contains(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

function excerpt(text: string, query: string): string {
  const idx = text.toLowerCase().indexOf(query);
  if (idx === -1) return text.slice(0, 220);
  return text.slice(Math.max(0, idx - 90), Math.min(text.length, idx + 180));
}

function parseRoute(pathname: string, search: string): Route {
  const params = new URLSearchParams(search);
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "search") return { name: "search", query: params.get("q") || "" };
  if (parts[0] === "review") return { name: "review" };
  if (parts[0] === "study") return { name: "study", workId: parts[1] || params.get("work") || undefined };
  if (parts[0] === "work" && parts[1]) return { name: "reader", workId: parts[1], sectionId: params.get("section") || undefined };
  return { name: "library" };
}

function routeToUrl(route: Route): string {
  if (route.name === "library") return "/";
  if (route.name === "search") return route.query ? `/search?q=${encodeURIComponent(route.query)}` : "/search";
  if (route.name === "review") return "/review";
  if (route.name === "study") return route.workId ? `/study/${route.workId}` : "/study";
  if (route.name === "reader") {
    return `/work/${route.workId}${route.sectionId ? `?section=${encodeURIComponent(route.sectionId)}` : ""}`;
  }
  return "/";
}

function modeLabel(type: StudyItem["type"]): string {
  if (type === "flashcard") return "Flashcard";
  if (type === "passage") return "Passage Recall";
  return "Quiz";
}
