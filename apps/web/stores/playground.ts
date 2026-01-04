import { create } from "zustand";
import type { ExecutionResult, LineExplanation } from "@solana-playground/types";

interface PlaygroundState {
  // Current template
  templateId: string | null;
  code: string;

  // Selection state (drives all panels)
  selectedLine: number | null;
  selectedInstruction: string | null;
  hoveredLine: number | null;

  // Execution state
  executionMode: "precomputed" | "live";
  currentScenario: string | null;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;

  // Current explanation
  currentExplanation: LineExplanation | null;

  // Actions
  setTemplate: (templateId: string, code: string) => void;
  setSelectedLine: (line: number | null) => void;
  setHoveredLine: (line: number | null) => void;
  setSelectedInstruction: (instruction: string | null) => void;
  setExecutionMode: (mode: "precomputed" | "live") => void;
  setCurrentScenario: (scenario: string | null) => void;
  setExecutionResult: (result: ExecutionResult | null) => void;
  setIsExecuting: (executing: boolean) => void;
  setCurrentExplanation: (explanation: LineExplanation | null) => void;
  reset: () => void;
  executeScenario: (scenario: string) => Promise<void>;
}

const initialState = {
  templateId: null,
  code: "",
  selectedLine: null,
  selectedInstruction: null,
  hoveredLine: null,
  executionMode: "precomputed" as const,
  currentScenario: null,
  isExecuting: false,
  executionResult: null,
  currentExplanation: null,
};

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  ...initialState,
  setTemplate: (templateId, code) => set({ templateId, code }),
  setSelectedLine: (line) => set({ selectedLine: line }),
  setHoveredLine: (line) => set({ hoveredLine: line }),
  setSelectedInstruction: (instruction) =>
    set({ selectedInstruction: instruction }),
  setExecutionMode: (mode) => set({ executionMode: mode }),
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),
  setExecutionResult: (result) => set({ executionResult: result }),
  setIsExecuting: (executing) => set({ isExecuting: executing }),
  setCurrentExplanation: (explanation) =>
    set({ currentExplanation: explanation }),
  executeScenario: async (scenario: string) => {
    set({ isExecuting: true, currentScenario: scenario });
    try {
      // TODO: Implement actual execution call
      // For now, just set the scenario
      set({ executionResult: null });
    } catch (error) {
      console.error("Execution error:", error);
    } finally {
      set({ isExecuting: false });
    }
  },
  reset: () => set(initialState),
}));

