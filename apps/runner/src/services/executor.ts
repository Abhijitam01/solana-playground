import type { ExecutionRequest, ExecutionResult, AccountState } from "@solana-playground/types";
import { Connection } from "@solana/web3.js";
import { ValidatorManager } from "./validator";
import { ProgramCompiler } from "./compiler";
import { StateCapture } from "./state-capture";
import { withTimeout } from "./sandbox";
import { loadTemplate } from "@solana-playground/solana";

const MAX_EXECUTION_TIME_MS =
  parseInt(process.env.MAX_EXECUTION_TIME_MS || "30000", 10) || 30000;

// Singleton validator instance
let validatorManager: ValidatorManager | null = null;
let connection: Connection | null = null;

function getValidatorManager(): ValidatorManager {
  if (!validatorManager) {
    const port = parseInt(process.env.VALIDATOR_PORT || "8899", 10);
    validatorManager = new ValidatorManager(port, port);
  }
  return validatorManager;
}

function getConnection(): Connection {
  if (!connection) {
    const validator = getValidatorManager();
    connection = new Connection(validator.getRpcUrl(), "confirmed");
  }
  return connection;
}

export async function executeProgram(
  request: ExecutionRequest
): Promise<ExecutionResult> {
  return withTimeout(
    async () => {
      try {
        // 1. Ensure validator is running
        const validator = getValidatorManager();
        if (!validator.isRunning()) {
          await validator.start();
          // Wait for validator to be ready
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // 2. Load template
        const template = await loadTemplate(request.templateId);
        const scenario = template.precomputedState.scenarios.find(
          (s) => s.name === request.scenario
        );

        if (!scenario) {
          throw new Error(`Scenario "${request.scenario}" not found`);
        }

        // 3. Compile program (if needed)
        const compiler = new ProgramCompiler();
        const compileResult = await compiler.compile(
          request.templateId,
          template.code
        );

        if (!compileResult.success) {
          throw new Error(`Compilation failed: ${compileResult.error}`);
        }

        // 4. Capture state before
        const conn = getConnection();
        // TODO: use StateCapture to gather real on-chain state once execution path is implemented
        new StateCapture(conn);
        
        // For now, use precomputed state as we don't have actual account addresses
        // In full implementation, we'd derive/create accounts and capture real state
        const accountsBefore: AccountState[] = scenario.accountsBefore.map(
          (acc) => ({
            address: acc.address,
            label: acc.label,
            owner: acc.owner,
            lamports: acc.lamports,
            dataSize: acc.dataSize,
            data: acc.data,
          })
        );

        // 5. Execute transaction (placeholder - would build and send actual transaction)
        // TODO: Build transaction, send it, wait for confirmation

        // 6. Capture state after
        const accountsAfter = scenario.accountsAfter.map((acc) => ({
          address: acc.address,
          label: acc.label,
          owner: acc.owner,
          lamports: acc.lamports,
          dataSize: acc.dataSize,
          data: acc.data,
          changes: acc.changes,
        }));

        // 7. Return result
        return {
          success: true,
          scenario: request.scenario,
          accountsBefore,
          accountsAfter,
          logs: scenario.logs,
          computeUnits: scenario.computeUnits,
        };
      } catch (error) {
        return {
          success: false,
          scenario: request.scenario,
          accountsBefore: [],
          accountsAfter: [],
          logs: [],
          computeUnits: 0,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    MAX_EXECUTION_TIME_MS
  );
}

