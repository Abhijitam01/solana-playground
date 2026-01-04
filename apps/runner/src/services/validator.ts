import { spawn, ChildProcess } from "child_process";

export class ValidatorManager {
  private validatorProcess: ChildProcess | null = null;
  private readonly port: number;
  private readonly rpcPort: number;

  constructor(port: number = 8899, rpcPort: number = 8899) {
    this.port = port;
    this.rpcPort = rpcPort;
  }

  async start(): Promise<void> {
    if (this.validatorProcess && this.isRunning()) {
      return; // Already running
    }

    return new Promise((resolve, reject) => {
      try {
        // Spawn solana-test-validator
        this.validatorProcess = spawn("solana-test-validator", [
          "--reset",
          "--quiet",
          `--rpc-port=${this.rpcPort}`,
        ]);

        let started = false;

        this.validatorProcess.stdout?.on("data", (data) => {
          const output = data.toString();
          if (output.includes("validator ready") || output.includes("RPC")) {
            if (!started) {
              started = true;
              console.log(`solana-test-validator started on port ${this.port}`);
              resolve();
            }
          }
        });

        this.validatorProcess.stderr?.on("data", (data) => {
          const output = data.toString();
          // Ignore common warnings
          if (!output.includes("warning") && !output.includes("WARN")) {
            console.error(`Validator stderr: ${output}`);
          }
        });

        this.validatorProcess.on("error", (error) => {
          console.error("Failed to start validator:", error);
          reject(error);
        });

        this.validatorProcess.on("exit", (code) => {
          if (code !== 0 && code !== null) {
            console.error(`Validator exited with code ${code}`);
          }
          this.validatorProcess = null;
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!started) {
            reject(new Error("Validator startup timeout"));
          }
        }, 10000);
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop(): Promise<void> {
    if (this.validatorProcess) {
      this.validatorProcess.kill("SIGTERM");
      this.validatorProcess = null;
      
      // Wait a bit for cleanup
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  async reset(): Promise<void> {
    await this.stop();
    await this.start();
  }

  isRunning(): boolean {
    if (!this.validatorProcess) return false;
    
    // Check if process is still alive
    try {
      process.kill(this.validatorProcess.pid || 0, 0);
      return true;
    } catch {
      return false;
    }
  }

  getRpcUrl(): string {
    return `http://localhost:${this.rpcPort}`;
  }
}

