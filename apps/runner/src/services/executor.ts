import type { ExecutionRequest, ExecutionResult } from "@solana-playground/types";
import { withTimeout } from "./sandbox";
import { ExecutionEngine } from "./execution-engine";

const MAX_EXECUTION_TIME_MS =
  parseInt(process.env.MAX_EXECUTION_TIME_MS || "30000", 10) || 30000;

const engine = new ExecutionEngine();

export async function executeProgram(
  request: ExecutionRequest
): Promise<ExecutionResult> {
  return withTimeout(
    async () => {
      return engine.execute(request);
    },
    MAX_EXECUTION_TIME_MS
  );
}
