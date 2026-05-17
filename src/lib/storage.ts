import { Decision } from "../types";

const STORAGE_KEY = "beyond_decisions";

export const storage = {
  getDecisions: (): Decision[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveDecision: (decision: Decision) => {
    const decisions = storage.getDecisions();
    const existingIndex = decisions.findIndex(d => d.id === decision.id);
    
    if (existingIndex >= 0) {
      decisions[existingIndex] = decision;
    } else {
      decisions.unshift(decision);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  },

  deleteDecision: (id: string) => {
    const decisions = storage.getDecisions().filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }
};
