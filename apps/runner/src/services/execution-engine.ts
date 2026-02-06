import type { ExecutionRequest, ExecutionResult } from "@solana-playground/types";
import type { Template } from "@solana-playground/types";
import { loadTemplate } from "@solana-playground/solana";
import { LocalValidatorAdapter } from "./execution/local-validator-adapter";

export interface ExecutionScenarioInput {
  template: Template;
  scenarioName: string;
  instruction: string;
  args: unknown[];
}

export interface ExecutionAdapter {
  execute(input: ExecutionScenarioInput): Promise<ExecutionResult>;
}

export class ExecutionEngine {
  private readonly adapter: ExecutionAdapter;

  constructor(adapter?: ExecutionAdapter) {
    this.adapter = adapter ?? new LocalValidatorAdapter();
  }

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const template = await loadTemplate(request.templateId);

    const scenario =
      template.precomputedState.scenarios.find((s) => s.name === request.scenario) ||
      template.precomputedState.scenarios.find((s) => s.instruction === request.instruction);

    if (!scenario) {
      return {
        success: false,
        scenario: request.scenario,
        accountsBefore: [],
        accountsAfter: [],
        logs: [],
        computeUnits: 0,
        trace: [],
        error: `Scenario "${request.scenario}" not found for template "${request.templateId}"`,
      };
    }

    return this.adapter.execute({
      template,
      scenarioName: scenario.name,
      instruction: scenario.instruction,
      args: scenario.args ?? request.args ?? [],
    });
  }
}
