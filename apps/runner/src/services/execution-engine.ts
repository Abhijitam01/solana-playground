import type { ExecutionRequest, ExecutionResult } from "@solana-playground/types";
import { loadTemplate } from "@solana-playground/solana";
import { LocalValidatorAdapter } from "./execution/local-validator-adapter";
import type { ExecutionAdapter, ExecutionScenarioInput, ExecutionTransactionInput } from "./execution-types";

export type { ExecutionAdapter, ExecutionScenarioInput, ExecutionTransactionInput };

export class ExecutionEngine {
  private readonly adapter: ExecutionAdapter;

  constructor(adapter?: ExecutionAdapter) {
    this.adapter = adapter ?? new LocalValidatorAdapter();
  }

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const template = await loadTemplate(request.templateId);

    // custom transaction mode
    if (request.type === "transaction" && request.transaction) {
      return this.adapter.executeTransaction({
        template,
        transaction: request.transaction,
      });
    }

    // scenario mode
    const scenarioName = request.scenario;
    const instructionName = request.instruction;

    if (!scenarioName && !instructionName) {
         return {
            success: false,
            scenario: "unknown",
            accountsBefore: [],
            accountsAfter: [],
            logs: [],
            computeUnits: 0,
            trace: [],
            error: "Missing scenario or instruction in request",
         };
    }

    const scenario =
      template.precomputedState.scenarios.find((s) => s.name === scenarioName) ||
      template.precomputedState.scenarios.find((s) => s.instruction === instructionName);

    if (!scenario) {
      return {
        success: false,
        scenario: scenarioName || instructionName || "unknown",
        accountsBefore: [],
        accountsAfter: [],
        logs: [],
        computeUnits: 0,
        trace: [],
        error: `Scenario "${scenarioName}" not found for template "${request.templateId}"`,
      };
    }

    return this.adapter.executeScenario({
      template,
      scenarioName: scenario.name,
      instruction: scenario.instruction,
      args: scenario.args ?? request.args ?? [],
    });
  }
}
