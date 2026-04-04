"use client";

import { create } from "zustand";
import type { UIState, ModalId, CaseTab, ClueFilterType, ViewMode } from "@/types";

export const useUIStore = create<UIState>()((set) => ({
  activeModal: null,
  activeModalPayload: null,
  activeCaseTab: "overview",
  clueFilter: "all",
  viewMode: "grid",

  openModal: (id: Exclude<ModalId, null>, payload?: unknown) =>
    set({ activeModal: id, activeModalPayload: payload ?? null }),

  closeModal: () =>
    set({ activeModal: null, activeModalPayload: null }),

  setCaseTab: (tab: CaseTab) => set({ activeCaseTab: tab }),

  setClueFilter: (filter: ClueFilterType) => set({ clueFilter: filter }),

  setViewMode: (mode: ViewMode) => set({ viewMode: mode }),
}));
