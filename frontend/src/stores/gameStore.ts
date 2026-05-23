"use client";

import { create } from "zustand";
import { GameState, Script } from "@/types";

export const useGameStore = create<GameState>((set) => ({
  city: "",
  role: "",
  interests: [],
  duration: "",
  script: null,
  currentNodeIndex: 0,

  setPreferences: (prefs) =>
    set({
      city: prefs.city,
      role: prefs.role,
      interests: prefs.interests,
      duration: prefs.duration,
    }),

  setScript: (script: Script) =>
    set({
      script,
      currentNodeIndex: 0,
    }),

  completeNode: (nodeId) =>
    set((state) => {
      if (!state.script) return state;

      const nodes = state.script.nodes.map((node) =>
        node.id === nodeId ? { ...node, status: "completed" as const } : node
      );

      // Unlock next node
      const currentIdx = nodes.findIndex((n) => n.id === nodeId);
      if (currentIdx >= 0 && currentIdx < nodes.length - 1) {
        nodes[currentIdx + 1] = { ...nodes[currentIdx + 1], status: "active" };
      }

      return { script: { ...state.script, nodes } };
    }),

  setCurrentNode: (index) => set({ currentNodeIndex: index }),

  reset: () =>
    set({
      city: "",
      role: "",
      interests: [],
      duration: "",
      script: null,
      currentNodeIndex: 0,
    }),
}));
