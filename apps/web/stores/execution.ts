import { create } from "zustand";

export type ExecutionState = "idle" | "running" | "paused" | "stepping" | "finished";

export interface Breakpoint {
  line: number;
  enabled: boolean;
}

export interface ExecutionStep {
  line: number;
  instruction?: string;
  accounts: Record<string, any>;
  stack: string[];
  timestamp: number;
}

interface ExecutionStore {
  // Execution state
  executionState: ExecutionState;
  currentStep: ExecutionStep | null;
  steps: ExecutionStep[];
  currentStepIndex: number;

  // Breakpoints
  breakpoints: Breakpoint[];
  
  // Watch variables
  watchExpressions: string[];

  // Actions
  setExecutionState: (state: ExecutionState) => void;
  addBreakpoint: (line: number) => void;
  removeBreakpoint: (line: number) => void;
  toggleBreakpoint: (line: number) => void;
  setBreakpoints: (breakpoints: Breakpoint[]) => void;
  addWatchExpression: (expression: string) => void;
  removeWatchExpression: (index: number) => void;
  setCurrentStep: (step: ExecutionStep | null) => void;
  addStep: (step: ExecutionStep) => void;
  setSteps: (steps: ExecutionStep[]) => void;
  setCurrentStepIndex: (index: number) => void;
  reset: () => void;
}

const initialState = {
  executionState: "idle" as ExecutionState,
  currentStep: null,
  steps: [],
  currentStepIndex: -1,
  breakpoints: [],
  watchExpressions: [],
};

export const useExecutionStore = create<ExecutionStore>((set) => ({
  ...initialState,
  setExecutionState: (state) => set({ executionState: state }),
  addBreakpoint: (line) =>
    set((state) => ({
      breakpoints: [...state.breakpoints, { line, enabled: true }],
    })),
  removeBreakpoint: (line) =>
    set((state) => ({
      breakpoints: state.breakpoints.filter((bp) => bp.line !== line),
    })),
  toggleBreakpoint: (line) =>
    set((state) => {
      const existing = state.breakpoints.find((bp) => bp.line === line);
      if (existing) {
        return {
          breakpoints: state.breakpoints.map((bp) =>
            bp.line === line ? { ...bp, enabled: !bp.enabled } : bp
          ),
        };
      } else {
        return {
          breakpoints: [...state.breakpoints, { line, enabled: true }],
        };
      }
    }),
  setBreakpoints: (breakpoints) => set({ breakpoints }),
  addWatchExpression: (expression) =>
    set((state) => ({
      watchExpressions: [...state.watchExpressions, expression],
    })),
  removeWatchExpression: (index) =>
    set((state) => ({
      watchExpressions: state.watchExpressions.filter((_, i) => i !== index),
    })),
  setCurrentStep: (step) => set({ currentStep: step }),
  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
      currentStep: step,
      currentStepIndex: state.steps.length,
    })),
  setSteps: (steps) => set({ steps, currentStep: steps[0] || null, currentStepIndex: 0 }),
  setCurrentStepIndex: (index) =>
    set((state) => ({
      currentStepIndex: index,
      currentStep: state.steps[index] || null,
    })),
  reset: () => set(initialState),
}));

