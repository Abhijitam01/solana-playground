"use client";

import { usePlaygroundStore } from "@/stores/playground";
import { useTemplate } from "@/hooks/use-templates";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { BookOpen, Database, ChevronDown, ChevronUp, Copy, Check, ArrowRight, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { HelpIcon } from "@/components/ui/HelpIcon";
import { Tooltip } from "@/components/ui/Tooltip";
import { StateDiff } from "@/components/ui/StateDiff";
import { StateTimeline, TimelineStep } from "@/components/ui/StateTimeline";

export function StatePanel() {
  const params = useParams();
  const templateId = params.templateId as string;
  const { data: template, isLoading } = useTemplate(templateId);
  const {
    selectedLine,
    currentExplanation,
    setCurrentExplanation,
    executionResult,
    currentScenario,
    setCurrentScenario,
    executionMode,
  } = usePlaygroundStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["explanation"]));
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"comparison" | "timeline">("comparison");

  useEffect(() => {
    if (selectedLine !== null && template?.explanations) {
      const explanation = template.explanations.find(
        (e) => e.lineNumber === selectedLine
      );
      setCurrentExplanation(explanation || null);
    } else {
      setCurrentExplanation(null);
    }
  }, [selectedLine, template, setCurrentExplanation]);

  const scenarios = template?.precomputedState?.scenarios || [];
  const scenario =
    executionMode === "precomputed" && template?.precomputedState
      ? template.precomputedState.scenarios.find(
          (s) => s.name === currentScenario
        ) || template.precomputedState.scenarios[0]
      : null;

  // Set default scenario on template load
  useEffect(() => {
    if (
      template?.precomputedState?.scenarios.length &&
      !currentScenario &&
      executionMode === "precomputed"
    ) {
      setCurrentScenario(template.precomputedState.scenarios[0].name);
    }
  }, [template, currentScenario, executionMode, setCurrentScenario]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getAccountChange = (accountBefore: any, accountAfter: any) => {
    if (!accountBefore || !accountAfter) return null;
    const beforeLamports = accountBefore.lamports || 0;
    const afterLamports = accountAfter.lamports || 0;
    const diff = afterLamports - beforeLamports;
    return diff !== 0 ? diff : null;
  };

  const accountsBefore = useMemo(
    () => scenario?.accountsBefore || executionResult?.accountsBefore || [],
    [scenario, executionResult]
  );
  const accountsAfter = useMemo(
    () => scenario?.accountsAfter || executionResult?.accountsAfter || [],
    [scenario, executionResult]
  );
  const logs = useMemo(
    () => scenario?.logs || executionResult?.logs || [],
    [scenario, executionResult]
  );

  // Create timeline steps
  const timelineSteps: TimelineStep[] = useMemo(() => {
    const steps: TimelineStep[] = [
      {
        id: "before",
        label: "Initial State",
        timestamp: Date.now() - 10000,
        state: accountsBefore.reduce((acc, a) => ({ ...acc, [a.address]: a }), {}),
        completed: true,
      },
      {
        id: "after",
        label: "Final State",
        timestamp: Date.now(),
        state: accountsAfter.reduce((acc, a) => ({ ...acc, [a.address]: a }), {}),
        completed: true,
      },
    ];
    return steps;
  }, [accountsBefore, accountsAfter]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full bg-card rounded-xl border border-border shadow-lg overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Explanation & State</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex flex-col h-full bg-card rounded-xl border border-border shadow-lg overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Explanation & State</h2>
        </div>
        <div className="flex items-center gap-2">
          {executionMode === "precomputed" && scenarios.length > 1 && (
            <select
              value={currentScenario || scenarios[0]?.name || ""}
              onChange={(e) => setCurrentScenario(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-border bg-background text-foreground focus-ring transition-all duration-fast"
            >
              {scenarios.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <HelpIcon
            content="View explanations and account state changes. Click sections to expand/collapse."
            side="left"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentExplanation && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <button
              onClick={() => toggleSection("explanation")}
              className="w-full flex items-center justify-between text-left"
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Line {currentExplanation.lineNumber} Explanation
              </h3>
              {expandedSections.has("explanation") ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            <AnimatePresence>
              {expandedSections.has("explanation") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <span>What</span>
                        <Badge variant="info" size="sm">Description</Badge>
                      </div>
                      <div className="text-sm text-foreground leading-relaxed">
                        {currentExplanation.what}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <span>Why</span>
                        <Badge variant="info" size="sm">Rationale</Badge>
                      </div>
                      <div className="text-sm text-foreground leading-relaxed">
                        {currentExplanation.why}
                      </div>
                    </div>
                    {currentExplanation.solanaConcept && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <span>Solana Concept</span>
                          <Badge variant="success" size="sm">Solana</Badge>
                        </div>
                        <div className="text-sm text-foreground leading-relaxed">
                          {currentExplanation.solanaConcept}
                        </div>
                      </div>
                    )}
                    {currentExplanation.rustConcept && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <span>Rust Concept</span>
                          <Badge variant="warning" size="sm">Rust</Badge>
                        </div>
                        <div className="text-sm text-foreground leading-relaxed">
                          {currentExplanation.rustConcept}
                        </div>
                      </div>
                    )}
                    {currentExplanation.whatBreaksIfRemoved && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                          <span>What Breaks If Removed</span>
                          <Badge variant="destructive" size="sm">Important</Badge>
                        </div>
                        <div className="text-sm text-destructive leading-relaxed">
                          {currentExplanation.whatBreaksIfRemoved}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}

        {!currentExplanation && (
          <div className="text-center py-12">
            <div className="inline-block p-4 rounded-full bg-muted mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Click on a line of code to see its explanation
            </p>
          </div>
        )}

        {(scenario || executionResult) && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleSection("state")}
                className="flex-1 flex items-center justify-between text-left"
              >
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Account State
                </h3>
                {expandedSections.has("state") ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              {expandedSections.has("state") && (
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("comparison")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      viewMode === "comparison"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Comparison
                  </button>
                  <button
                    onClick={() => setViewMode("timeline")}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      viewMode === "timeline"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Clock className="w-3 h-3 inline mr-1" />
                    Timeline
                  </button>
                </div>
              )}
            </div>
            <AnimatePresence>
              {expandedSections.has("state") && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  {viewMode === "comparison" ? (
                    <div className="space-y-4">
                      {accountsBefore.map((account) => {
                        const accountAfter = accountsAfter.find(
                          (a) => a.address === account.address
                        );
                        if (!accountAfter) return null;

                        return (
                          <motion.div
                            key={account.address}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg bg-muted/30 border border-border"
                          >
                            <div className="text-xs font-semibold text-muted-foreground mb-3 font-mono">
                              {account.label}
                            </div>
                            <StateDiff
                              before={{
                                lamports: account.lamports,
                                data: account.data,
                              }}
                              after={{
                                lamports: accountAfter.lamports,
                                data: accountAfter.data,
                                changes: accountAfter.changes,
                              }}
                              label="State Changes"
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <StateTimeline
                      steps={timelineSteps}
                      currentStep={1}
                      onStepClick={(step) => {
                        console.log("Step clicked:", step);
                      }}
                    />
                  )}
                    {logs.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                          <span>Logs</span>
                          <Badge variant="info" size="sm">Output</Badge>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30 border border-border">
                          <div className="space-y-1 font-mono text-xs">
                            {logs.map((log, idx) => (
                              <div
                                key={idx}
                                className="text-foreground flex items-start gap-2"
                              >
                                <span className="text-muted-foreground">$</span>
                                <span>{log}</span>
                                <button
                                  onClick={() => copyToClipboard(log, `log-${idx}`)}
                                  className="ml-auto opacity-0 hover:opacity-100 transition-opacity"
                                >
                                  {copiedText === `log-${idx}` ? (
                                    <Check className="w-3 h-3 text-success" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}
