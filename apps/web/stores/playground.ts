import { createWithEqualityFn } from "zustand/traditional";
import type { ExecutionResult, FunctionSpec } from "@solana-playground/types";
import { markFirstTxStart, markFirstTxSuccess, trackEvent } from "@/lib/analytics";
import { useTerminalStore } from "@/stores/terminal";

interface PlaygroundState {
  // Current template
  templateId: string | null;
  code: string;

  // Selection state (drives all panels)
  selectedLine: number | null;
  hoveredLine: number | null;
  selectedInstruction: string | null;
  selectedFlowStepId: string | null;

  // Execution state
  executionMode: "precomputed" | "live";
  currentScenario: string | null;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;

  // Current explanation
  currentFunctionSpec: FunctionSpec | null;

  // Actions
  setTemplate: (templateId: string, code: string) => void;
  setSelectedLine: (line: number | null) => void;
  setHoveredLine: (line: number | null) => void;
  setSelectedInstruction: (instruction: string | null) => void;
  setSelectedFlowStepId: (stepId: string | null) => void;
  setExecutionMode: (mode: "precomputed" | "live") => void;
  setCurrentScenario: (scenario: string | null) => void;
  setExecutionResult: (result: ExecutionResult | null) => void;
  setIsExecuting: (executing: boolean) => void;
  setCurrentFunctionSpec: (spec: FunctionSpec | null) => void;
  reset: () => void;
  executeScenario: (
    scenario: string,
    instruction?: string,
    stepId?: string
  ) => Promise<void>;
  executeTransaction: (transaction: any) => Promise<void>;
}

const initialState = {
  templateId: null,
  code: "",
  selectedLine: null,
  hoveredLine: null,
  selectedInstruction: null,
  selectedFlowStepId: null,
  executionMode: "precomputed" as const,
  currentScenario: null,
  isExecuting: false,
  executionResult: null,
  currentFunctionSpec: null,
};

export const usePlaygroundStore = createWithEqualityFn<PlaygroundState>((set, get) => ({
  ...initialState,
  setTemplate: (templateId, code) => set({ templateId, code }),
  setSelectedLine: (line) => set({ selectedLine: line }),
  setHoveredLine: (line) => set({ hoveredLine: line }),
  setSelectedInstruction: (instruction) =>
    set({ selectedInstruction: instruction }),
  setSelectedFlowStepId: (stepId) => set({ selectedFlowStepId: stepId }),
  setExecutionMode: (mode) => set({ executionMode: mode }),
  setCurrentScenario: (scenario) => set({ currentScenario: scenario }),
  setExecutionResult: (result) => set({ executionResult: result }),
  setIsExecuting: (executing) => set({ isExecuting: executing }),
  setCurrentFunctionSpec: (spec) => set({ currentFunctionSpec: spec }),
  executeScenario: async (scenario: string, instruction?: string, stepId?: string) => {
    // ... existing implementation ...
    const templateId = get().templateId;
    if (!templateId) return;
    
    // Terminal logging
    const term = useTerminalStore.getState();
    term.toggleTerminal(true);
    term.writeln(`\x1b[38;2;60;165;250m[EXEC]\x1b[0m Running scenario: \x1b[1m${scenario}\x1b[0m...`);

    const executionMode = get().executionMode;
    const startedAt = Date.now();
    if (executionMode === "live") {
      markFirstTxStart();
      void trackEvent({
        event: "execution_start",
        templateId,
        stepId,
        metadata: { scenario, instruction },
      });
    }
    set({ isExecuting: true, currentScenario: scenario });
    try {
      const runnerUrl =
        process.env.NEXT_PUBLIC_RUNNER_URL || "http://localhost:3002";
      const res = await fetch(`${runnerUrl}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          type: "scenario",
          scenario,
          instruction: instruction || scenario,
        }),
      });

      if (!res.ok) {
        throw new Error(`Execution failed (${res.status})`);
      }

      const result = await res.json();
      set({ executionResult: result });
      
      // Log result to terminal
      if (result.success) {
        term.writeln(`\x1b[32m[SUCCESS]\x1b[0m Execution completed in ${Date.now() - startedAt}ms`);
        term.writeln(`  • Compute Types: \x1b[36m${result.computeUnits}\x1b[0m`);
        if (result.logs && result.logs.length > 0) {
            term.writeln("  • Logs:");
            result.logs.forEach((log: string) => term.writeln(`    \x1b[2m${log}\x1b[0m`));
        }
      } else {
        term.writeln(`\x1b[31m[FAILED]\x1b[0m Execution failed`);
        if (result.error) term.writeln(`  \x1b[31m${result.error}\x1b[0m`);
        if (result.logs && result.logs.length > 0) {
            term.writeln("  • Logs:");
            result.logs.forEach((log: string) => term.writeln(`    \x1b[2m${log}\x1b[0m`));
        }
      }

      if (executionMode === "live") {
        const durationMs = Date.now() - startedAt;
        if (result?.success) {
          void trackEvent({
            event: "execution_success",
            templateId,
            stepId,
            success: true,
            durationMs,
            metadata: { scenario, instruction },
          });
          if (stepId) {
            void trackEvent({
              event: "step_complete",
              templateId,
              stepId,
              success: true,
            });
          }
          markFirstTxSuccess();
        } else {
          void trackEvent({
            event: "execution_failed",
            templateId,
            stepId,
            success: false,
            durationMs,
            metadata: { scenario, instruction },
          });
        }
      }
    } catch (error) {
      console.error("Execution error:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      term.writeln(`\x1b[31m[ERROR]\x1b[0m ${errorMsg}`);
      
      set({
        executionResult: {
          success: false,
          scenario,
          accountsBefore: [],
          accountsAfter: [],
          logs: [],
          computeUnits: 0,
          trace: [],
          error: errorMsg,
        },
      });
      if (executionMode === "live") {
        void trackEvent({
          event: "execution_failed",
          templateId,
          stepId,
          success: false,
          durationMs: Date.now() - startedAt,
          metadata: { scenario, instruction },
        });
      }
    } finally {
      set({ isExecuting: false });
    }
  },
  executeTransaction: async (transaction: any) => {
    const templateId = get().templateId;
    if (!templateId) return;

    // Terminal logging
    const term = useTerminalStore.getState();
    term.toggleTerminal(true);
    term.writeln(`\x1b[38;2;60;165;250m[TX]\x1b[0m Executing custom transaction...`);
    const startedAt = Date.now();

    set({ isExecuting: true, currentScenario: "custom-transaction" });
    try {
      const runnerUrl = process.env.NEXT_PUBLIC_RUNNER_URL || "http://localhost:3002";
      const res = await fetch(`${runnerUrl}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          type: "transaction",
          transaction,
        }),
      });

      if (!res.ok) {
        throw new Error(`Execution failed (${res.status})`);
      }

      const result = await res.json();
      set({ executionResult: result });

      // Log result to terminal
      if (result.success) {
        term.writeln(`\x1b[32m[SUCCESS]\x1b[0m Transaction confirmed in ${Date.now() - startedAt}ms`);
        term.writeln(`  • Compute Units: \x1b[36m${result.computeUnits}\x1b[0m`);
        if (result.logs && result.logs.length > 0) {
            term.writeln("  • Logs:");
            result.logs.forEach((log: string) => term.writeln(`    \x1b[2m${log}\x1b[0m`));
        }
      } else {
        term.writeln(`\x1b[31m[FAILED]\x1b[0m Transaction failed`);
        if (result.error) term.writeln(`  \x1b[31m${result.error}\x1b[0m`);
        if (result.logs && result.logs.length > 0) {
            term.writeln("  • Logs:");
            result.logs.forEach((log: string) => term.writeln(`    \x1b[2m${log}\x1b[0m`));
        }
      }
    } catch (error) {
      console.error("Transaction execution error:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      term.writeln(`\x1b[31m[ERROR]\x1b[0m ${errorMsg}`);

      set({
        executionResult: {
          success: false,
          scenario: "custom-transaction",
          accountsBefore: [],
          accountsAfter: [],
          logs: [],
          computeUnits: 0,
          trace: [],
          error: errorMsg,
        },
      });
    } finally {
      set({ isExecuting: false });
    }
  },
  reset: () => set(initialState),
}));
