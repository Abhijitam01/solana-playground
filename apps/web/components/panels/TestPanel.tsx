"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useProgramStore } from "@/stores/programs";
import { BrowserTestRunner } from "@/lib/test-runner";
import { motion } from "framer-motion";
import { Beaker, Play, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type * as Monaco from "monaco-editor";
import { useAnchorProgram } from "@/hooks/use-anchor-program";
import { Badge } from "@/components/ui/Badge"; 
import { HelpIcon } from "@/components/ui/HelpIcon";
import { useSettingsStore } from "@/stores/settings";
import { useTerminalStore } from "@/stores/terminal";
import { defineSolanaThemes } from "@/lib/monaco-themes";
import { shallow } from "zustand/shallow";

export function TestPanel() {
  const { activeProgram, updateProgramTestCode, setProgramTestResult } = useProgramStore(
    (state) => ({
      activeProgram: state.activeProgramId ? state.programs[state.activeProgramId] : null,
      updateProgramTestCode: state.updateProgramTestCode,
      setProgramTestResult: state.setProgramTestResult,
    })
  );

  const { theme, playgroundTheme } = useSettingsStore(
    (state) => ({
      theme: state.theme,
      playgroundTheme: state.playgroundTheme,
    }),
    shallow
  );

  const { program, provider } = useAnchorProgram();
  const terminal = useTerminalStore();

  const [isRunning, setIsRunning] = useState(false);
  const [testRunner] = useState(() => new BrowserTestRunner());
  const monacoRef = useRef<typeof Monaco | null>(null);

  // Computed values
  const monacoTheme = useMemo(() => {
    if (playgroundTheme === "grid") {
      return "solana-grid";
    }
    if (playgroundTheme === "matrix") {
      return "solana-matrix";
    }
    return theme === "dark" ? "solana-dark" : "solana-light";
  }, [theme, playgroundTheme]);

  // Apply theme changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [monacoTheme]);

  const handleEditorDidMount = useCallback(
    (_editor: editor.IStandaloneCodeEditor, monaco: typeof Monaco) => {
      monacoRef.current = monaco;
      defineSolanaThemes(monaco);
      monaco.editor.setTheme(monacoTheme);
    },
    [monacoTheme]
  );

  // Default test code if none exists
  const defaultTestCode = `
describe('${activeProgram?.name || "My Program"}', () => {
  it('Is customized', async () => {
    // Add your test logic here.
    // Use 'program', 'provider', 'expect', 'assert'
    // Example:
    // await program.methods.initialize().rpc();
  });
});
`;

  useEffect(() => {
    if (!activeProgram?.id) return;
    if (activeProgram.testCode && activeProgram.testCode.trim().length > 0) return;
    updateProgramTestCode(activeProgram.id, defaultTestCode.trim());
  }, [activeProgram?.id, activeProgram?.testCode, defaultTestCode, updateProgramTestCode]);

  const handleRunTests = useCallback(async () => {
    if (!activeProgram || !program || !provider) return;
    const runtimeTestCode =
      activeProgram.testCode && activeProgram.testCode.trim().length > 0
        ? activeProgram.testCode
        : defaultTestCode.trim();
    
    setIsRunning(true);
    try {
      terminal.toggleTerminal(true);
      terminal.writeln(`\x1b[38;2;60;165;250m[TEST]\x1b[0m Running tests for ${activeProgram.name}...`);
      if (!activeProgram.testCode || activeProgram.testCode.trim().length === 0) {
        updateProgramTestCode(activeProgram.id, runtimeTestCode);
      }
      const result = await testRunner.run(runtimeTestCode, program, provider);
      setProgramTestResult(activeProgram.id, result);
      if (result.stats.failures > 0) {
        terminal.writeln(
          `\x1b[31m[FAIL]\x1b[0m ${result.stats.passes} passed, ${result.stats.failures} failed`
        );
      } else {
        terminal.writeln(`\x1b[32m[PASS]\x1b[0m All ${result.stats.passes} tests passed`);
      }
    } catch (err) {
      console.error("Test execution failed:", err);
      terminal.writeln(`\x1b[31m[ERROR]\x1b[0m ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsRunning(false);
    }
  }, [
    activeProgram,
    defaultTestCode,
    program,
    provider,
    testRunner,
    setProgramTestResult,
    terminal,
    updateProgramTestCode,
  ]);

  const stats = activeProgram?.lastTestResult?.stats;

  if (!activeProgram) {
     return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
           No program selected
        </div>
     );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel flex h-full flex-col"
    >
      <div className="panel-header justify-between">
        <div className="flex items-center gap-2">
          <Beaker className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Tests</h2>
          {stats && (
             <div className="flex gap-2 ml-2">
                <Badge variant={stats.failures > 0 ? "destructive" : "success"} size="sm">
                   {stats.passes} passing
                </Badge>
                {stats.failures > 0 && (
                    <Badge variant="destructive" size="sm">
                       {stats.failures} failing
                    </Badge>
                )}
             </div>
          )}
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={handleRunTests}
                disabled={isRunning}
                className={`btn-primary text-xs flex items-center gap-2 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isRunning ? <Loader2 className="w-3 h-3 animate-spin"/> : <Play className="w-3 h-3" />}
                Run Tests
            </button>
            <HelpIcon content="Write and run Mocha/Chai tests against your devnet program." />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
         {/* Editor Section */}
         <div className="h-1/2 border-b border-border relative">
            <Editor
                height="100%"
                defaultLanguage="typescript"
                theme={monacoTheme}
                onMount={handleEditorDidMount}
                value={activeProgram.testCode || defaultTestCode}
                onChange={(val) => val !== undefined && updateProgramTestCode(activeProgram.id, val)}
                options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />
         </div>

         {/* Results Section */}
         <div className="flex-1 overflow-auto p-4 space-y-2 bg-background">
             {!activeProgram.lastTestResult && (
                 <div className="text-center text-muted-foreground text-sm py-4">
                     Run tests to see results here.
                 </div>
             )}
             
             {activeProgram.lastTestResult?.tests.map((test, i) => (
                 <div key={i} className={`p-2 rounded border flex items-start gap-2 text-sm ${
                     test.err ? "bg-red-500/10 border-red-500/20" : "bg-green-500/10 border-green-500/20"
                 }`}>
                     {test.err ? (
                         <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                     ) : (
                         <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                     )}
                     <div className="flex-1 min-w-0">
                         <div className={`font-medium ${test.err ? "text-red-400" : "text-green-400"}`}>
                             {test.fullTitle}
                         </div>
                         {test.err && (
                             <div className="text-red-300 text-xs mt-1 font-mono break-all whitespace-pre-wrap">
                                 {test.err.message}
                             </div>
                         )}
                     </div>
                     <div className="text-xs text-muted-foreground whitespace-nowrap">
                         {test.duration}ms
                     </div>
                 </div>
             ))}

             {activeProgram.lastTestResult?.failures.some(f => f.title === "Test Definition Error") && (
                 <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                     <div className="font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4"/>
                        Test Definition Error
                     </div>
                     <div className="mt-1 font-mono text-xs">
                        {activeProgram.lastTestResult?.failures.find((f) => f.title === "Test Definition Error")?.err?.message}
                     </div>
                 </div>
             )}
         </div>
      </div>
    </motion.div>
  );
}
