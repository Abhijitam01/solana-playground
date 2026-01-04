"use client";

import { useEffect, useRef, useMemo } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { usePlaygroundStore } from "@/stores/playground";
import { Code, HelpCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/Tooltip";
import { HelpIcon } from "@/components/ui/HelpIcon";
import { useExecutionStore } from "@/stores/execution";

export function CodePanel() {
  const { code, selectedLine, hoveredLine, setSelectedLine, setHoveredLine } =
    usePlaygroundStore();
  const { breakpoints, toggleBreakpoint, currentStep } = useExecutionStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (editorRef.current && selectedLine !== null) {
      editorRef.current.revealLineInCenter(selectedLine);
      editorRef.current.setPosition({ lineNumber: selectedLine, column: 1 });
    }
  }, [selectedLine]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Add click handler
    editor.onMouseDown((e: editor.IEditorMouseEvent) => {
      if (e.target.position) {
        const lineNumber = e.target.position.lineNumber;
        // Toggle breakpoint on gutter click
        if (e.target.type === editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
          toggleBreakpoint(lineNumber);
        } else {
          setSelectedLine(lineNumber);
        }
      }
    });

    // Add hover handler
    editor.onMouseMove((e: editor.IEditorMouseEvent) => {
      if (e.target.position) {
        setHoveredLine(e.target.position.lineNumber);
      } else {
        setHoveredLine(null);
      }
    });
  };

  // Apply decorations when selectedLine, hoveredLine, or breakpoints change
  useEffect(() => {
    if (!editorRef.current) return;

    const decorations: editor.IModelDeltaDecoration[] = [];

    // Breakpoint decorations
    breakpoints.forEach((bp) => {
      if (bp.enabled) {
        decorations.push({
          range: {
            startLineNumber: bp.line,
            startColumn: 1,
            endLineNumber: bp.line,
            endColumn: 1,
          },
          options: {
            glyphMarginClassName: "breakpoint-glyph",
            isWholeLine: false,
            stickiness: editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          },
        });
      }
    });

    // Current execution step decoration
    if (currentStep) {
      decorations.push({
        range: {
          startLineNumber: currentStep.line,
          startColumn: 1,
          endLineNumber: currentStep.line,
          endColumn: Number.MAX_SAFE_INTEGER,
        },
        options: {
          className: "bg-warning-light/50 border-l-2 border-l-warning",
          isWholeLine: true,
          stickiness: editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          marginClassName: "execution-line-margin",
        },
      });
    }

    // Selected line decoration
    if (selectedLine !== null && selectedLine !== currentStep?.line) {
      decorations.push({
        range: {
          startLineNumber: selectedLine,
          startColumn: 1,
          endLineNumber: selectedLine,
          endColumn: Number.MAX_SAFE_INTEGER,
        },
        options: {
          className: "bg-primary-light/50 dark:bg-primary-light/20 border-l-2 border-l-primary",
          isWholeLine: true,
          stickiness: editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          marginClassName: "selected-line-margin",
        },
      });
    }

    // Hovered line decoration
    if (hoveredLine !== null && hoveredLine !== selectedLine && hoveredLine !== currentStep?.line) {
      decorations.push({
        range: {
          startLineNumber: hoveredLine,
          startColumn: 1,
          endLineNumber: hoveredLine,
          endColumn: Number.MAX_SAFE_INTEGER,
        },
        options: {
          className: "bg-muted/50",
          isWholeLine: true,
          stickiness: editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      });
    }

    decorationsRef.current = editorRef.current.deltaDecorations(
      decorationsRef.current,
      decorations
    );
  }, [selectedLine, hoveredLine, breakpoints, currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-card rounded-xl border border-border shadow-lg overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Code</h2>
        </div>
        <HelpIcon
          content="Click on any line to see its explanation. Hover to preview."
          side="left"
        />
      </div>
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          defaultLanguage="rust"
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            fontFamily: "var(--font-mono)",
            lineHeight: 22,
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "none",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            glyphMargin: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              useShadows: false,
            },
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </motion.div>
  );
}

