import * as chai from "chai";

// Helper type for test results
export interface TestResult {
  title: string;
  fullTitle: string;
  duration: number;
  currentRetry: number;
  err?: {
    message: string;
    stack?: string;
    expected?: any;
    actual?: any;
  };
}

export interface TestSuiteResult {
  stats: {
    suites: number;
    tests: number;
    passes: number;
    pending: number;
    failures: number;
    start: string;
    end: string;
    duration: number;
  };
  tests: TestResult[];
  failures: TestResult[];
  passes: TestResult[];
}

export class BrowserTestRunner {
  constructor() {}

  async run(
    code: string,
    program: any,
    provider: any
  ): Promise<TestSuiteResult> {
    const startedAt = new Date();

    type HookFn = () => unknown | Promise<unknown>;
    type SuiteContext = {
      title: string;
      path: string[];
      parent: SuiteContext | null;
      beforeAll: HookFn[];
      beforeEach: HookFn[];
      afterEach: HookFn[];
      afterAll: HookFn[];
    };
    type CollectedTest = {
      title: string;
      fullTitle: string;
      suite: SuiteContext;
      fn: () => unknown | Promise<unknown>;
    };

    const rootSuite: SuiteContext = {
      title: "__root__",
      path: [],
      parent: null,
      beforeAll: [],
      beforeEach: [],
      afterEach: [],
      afterAll: [],
    };
    const collected: CollectedTest[] = [];
    const suitesInOrder: SuiteContext[] = [rootSuite];
    let currentSuite = rootSuite;
    let suiteCount = 0;

    const getHookFn = (nameOrFn?: unknown, maybeFn?: unknown): HookFn => {
      if (typeof nameOrFn === "function") return nameOrFn as HookFn;
      if (typeof maybeFn === "function") return maybeFn as HookFn;
      return () => undefined;
    };

    const describe = (title: string, fn: () => void) => {
      suiteCount += 1;
      const nextSuite: SuiteContext = {
        title: String(title),
        path: [...currentSuite.path, String(title)],
        parent: currentSuite,
        beforeAll: [],
        beforeEach: [],
        afterEach: [],
        afterAll: [],
      };
      suitesInOrder.push(nextSuite);
      const prevSuite = currentSuite;
      currentSuite = nextSuite;
      try {
        fn();
      } finally {
        currentSuite = prevSuite;
      }
    };

    const it = (title: string, fn?: () => unknown | Promise<unknown>) => {
      const testTitle = String(title);
      const fullTitle = [...currentSuite.path, testTitle].join(" ").trim();
      collected.push({
        title: testTitle,
        fullTitle,
        suite: currentSuite,
        fn: fn ?? (() => undefined),
      });
    };

    const before = (nameOrFn?: unknown, maybeFn?: unknown) => {
      currentSuite.beforeAll.push(getHookFn(nameOrFn, maybeFn));
    };
    const beforeEach = (nameOrFn?: unknown, maybeFn?: unknown) => {
      currentSuite.beforeEach.push(getHookFn(nameOrFn, maybeFn));
    };
    const after = (nameOrFn?: unknown, maybeFn?: unknown) => {
      currentSuite.afterAll.push(getHookFn(nameOrFn, maybeFn));
    };
    const afterEach = (nameOrFn?: unknown, maybeFn?: unknown) => {
      currentSuite.afterEach.push(getHookFn(nameOrFn, maybeFn));
    };

    const compileErrorResult = (message: string): TestSuiteResult => ({
      stats: {
        suites: suiteCount,
        tests: 0,
        passes: 0,
        pending: 0,
        failures: 1,
        start: startedAt.toISOString(),
        end: new Date().toISOString(),
        duration: 0,
      },
      tests: [],
      passes: [],
      failures: [
        {
          title: "Test Definition Error",
          fullTitle: "Test Definition Error",
          duration: 0,
          currentRetry: 0,
          err: { message },
        },
      ],
    });

    try {
      const userScript = new Function(
        "describe",
        "it",
        "before",
        "beforeEach",
        "after",
        "afterEach",
        "program",
        "provider",
        "expect",
        "assert",
        "anchor",
        code
      );

      userScript(
        describe,
        it,
        before,
        beforeEach,
        after,
        afterEach,
        program,
        provider,
        chai.expect,
        chai.assert,
        {
          web3: {},
          BN: (globalThis as any).BN,
        }
      );
    } catch (err: any) {
      return compileErrorResult(err?.message || String(err));
    }

    const tests: TestResult[] = [];
    const failures: TestResult[] = [];
    const passes: TestResult[] = [];
    const suiteBeforeAllRan = new Set<SuiteContext>();
    const suiteBeforeAllError = new Map<SuiteContext, Error>();

    const chainForSuite = (suite: SuiteContext): SuiteContext[] => {
      const chain: SuiteContext[] = [];
      let cursor: SuiteContext | null = suite;
      while (cursor) {
        chain.unshift(cursor);
        cursor = cursor.parent;
      }
      return chain;
    };

    for (const test of collected) {
      const started = performance.now();
      const chain = chainForSuite(test.suite);
      const ranBeforeEachSuites: SuiteContext[] = [];
      try {
        for (const suite of chain) {
          if (suiteBeforeAllRan.has(suite)) continue;
          try {
            for (const hook of suite.beforeAll) {
              await Promise.resolve(hook());
            }
            suiteBeforeAllRan.add(suite);
          } catch (err: any) {
            const normalized = err instanceof Error ? err : new Error(String(err));
            suiteBeforeAllError.set(suite, normalized);
            throw normalized;
          }
        }

        for (const suite of chain) {
          const setupErr = suiteBeforeAllError.get(suite);
          if (setupErr) throw setupErr;
        }

        for (const suite of chain) {
          for (const hook of suite.beforeEach) {
            await Promise.resolve(hook());
          }
          ranBeforeEachSuites.push(suite);
        }

        await Promise.resolve(test.fn());
        const result: TestResult = {
          title: test.title,
          fullTitle: test.fullTitle,
          duration: Math.max(0, Math.round(performance.now() - started)),
          currentRetry: 0,
        };
        tests.push(result);
        passes.push(result);
      } catch (err: any) {
        const result: TestResult = {
          title: test.title,
          fullTitle: test.fullTitle,
          duration: Math.max(0, Math.round(performance.now() - started)),
          currentRetry: 0,
          err: {
            message: err?.message || String(err),
            stack: err?.stack,
            expected: err?.expected,
            actual: err?.actual,
          },
        };
        tests.push(result);
        failures.push(result);
      } finally {
        for (const suite of [...ranBeforeEachSuites].reverse()) {
          for (const hook of suite.afterEach) {
            try {
              await Promise.resolve(hook());
            } catch {
              // ignore afterEach hook errors to keep per-test outcome from main assertion path
            }
          }
        }
      }
    }

    for (const suite of [...suitesInOrder].reverse()) {
      if (!suiteBeforeAllRan.has(suite)) continue;
      for (const hook of suite.afterAll) {
        try {
          await Promise.resolve(hook());
        } catch {
          // post-run hook failures are intentionally ignored in the summary
        }
      }
    }

    const finishedAt = new Date();

    return {
      stats: {
        suites: suiteCount,
        tests: tests.length,
        passes: passes.length,
        pending: 0,
        failures: failures.length,
        start: startedAt.toISOString(),
        end: finishedAt.toISOString(),
        duration: Math.max(0, finishedAt.getTime() - startedAt.getTime()),
      },
      tests,
      passes,
      failures,
    };
  }
}
