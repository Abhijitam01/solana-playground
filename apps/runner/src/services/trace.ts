export interface TraceEntry {
  program: string;
  depth: number;
  status: "invoke" | "success" | "failed";
  logs: string[];
}

const INVOKE_RE = /^Program ([A-Za-z0-9]+) invoke \[(\d+)\]/;
const SUCCESS_RE = /^Program ([A-Za-z0-9]+) success/;
const FAILED_RE = /^Program ([A-Za-z0-9]+) failed/;

export function parseTransactionLogs(logs: string[]): TraceEntry[] {
  const stack: TraceEntry[] = [];
  const output: TraceEntry[] = [];

  for (const line of logs) {
    const invoke = line.match(INVOKE_RE);
    if (invoke) {
      const program = invoke[1]!;
      const depth = parseInt(invoke[2] ?? "1", 10) || stack.length + 1;
      const entry: TraceEntry = {
        program,
        depth,
        status: "invoke",
        logs: [],
      };
      stack.push(entry);
      output.push(entry);
      continue;
    }

    const success = line.match(SUCCESS_RE);
    if (success) {
      const program = success[1]!;
      const entry = [...stack].reverse().find((e) => e.program === program);
      if (entry) {
        entry.status = "success";
      }
      stack.pop();
      continue;
    }

    const failed = line.match(FAILED_RE);
    if (failed) {
      const program = failed[1]!;
      const entry = [...stack].reverse().find((e) => e.program === program);
      if (entry) {
        entry.status = "failed";
      }
      stack.pop();
      continue;
    }

    const current = stack[stack.length - 1];
    if (current) {
      current.logs.push(line);
    }
  }

  return output;
}
