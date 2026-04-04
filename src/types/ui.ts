// ─── UI Types ─────────────────────────────────────────────────────────────────

export type CaseTab = "overview" | "suspects" | "evidence" | "timeline" | "notes";

export type ModalId =
  | "briefing"
  | "clue"
  | "scene"
  | "accusation-confirm"
  | null;

export type ViewMode = "grid" | "list";

export type ClueFilterType = "all" | "physical" | "testimony" | "document" | "observation" | "forensic";

export interface UIState {
  activeModal: ModalId;
  activeModalPayload: unknown;
  activeCaseTab: CaseTab;
  clueFilter: ClueFilterType;
  viewMode: ViewMode;

  openModal: (id: Exclude<ModalId, null>, payload?: unknown) => void;
  closeModal: () => void;
  setCaseTab: (tab: CaseTab) => void;
  setClueFilter: (filter: ClueFilterType) => void;
  setViewMode: (mode: ViewMode) => void;
}

// ─── Component Prop Utilities ────────────────────────────────────────────────

export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}
