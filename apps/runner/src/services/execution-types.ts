import type { ExecutionRequest, ExecutionResult, Template } from "@solana-playground/types";

export interface ExecutionScenarioInput {
  template: Template;
  scenarioName: string;
  instruction: string;
  args: unknown[];
}

export interface ExecutionTransactionInput {
  template: Template;
  transaction: NonNullable<ExecutionRequest["transaction"]>;
}

export interface ExecutionAdapter {
  executeScenario(input: ExecutionScenarioInput): Promise<ExecutionResult>;
  executeTransaction(input: ExecutionTransactionInput): Promise<ExecutionResult>;
}
