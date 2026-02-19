"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { useTerminalStore } from "@/stores/terminal";
import "xterm/css/xterm.css";
import { X, Trash2 } from "lucide-react";

export function TerminalPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setTerminal, clearTerminal, isOpen, toggleTerminal, clear } = useTerminalStore();
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddonInstance = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current || terminalInstance.current) return;

    // Initialize xterm
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "'Fira Code', monospace",
      fontSize: 14,
      theme: {
        background: "#09090b", // zinc-950
        foreground: "#fafafa", // zinc-50
        selectionBackground: "#27272a", // zinc-800
        black: "#000000",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        blue: "#3b82f6",
        magenta: "#a855f7",
        cyan: "#06b6d4",
        white: "#ffffff",
        brightBlack: "#71717a",
        brightRed: "#f87171",
        brightGreen: "#4ade80",
        brightYellow: "#facc15",
        brightBlue: "#60a5fa",
        brightMagenta: "#c084fc",
        brightCyan: "#22d3ee",
        brightWhite: "#ffffff",
      },
      convertEol: true, // Treat \n as \r\n
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(containerRef.current);
    fitAddon.fit();

    terminalInstance.current = term;
    fitAddonInstance.current = fitAddon;
    setTerminal(term, fitAddon);

    // Initial welcome message
    term.writeln("\x1b[38;2;60;165;250m Welcome to Solana Playground Terminal \x1b[0m");
    term.writeln("Build, test, and execution logs will appear here.");

    // Handle resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
      terminalInstance.current = null;
      fitAddonInstance.current = null;
      clearTerminal();
    };
  }, [clearTerminal, setTerminal]);

  // Re-fit when panel visibility changes
  useEffect(() => {
    if (isOpen && fitAddonInstance.current) {
        // slight delay to allow container to resize
        setTimeout(() => {
            fitAddonInstance.current?.fit();
        }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 bg-zinc-950 border-t border-zinc-800 flex flex-col z-50 shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-zinc-400">Terminal</span>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={clear}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Clear Terminal"
            >
                <Trash2 className="w-3 h-3" />
            </button>
            <button 
                onClick={() => toggleTerminal(false)}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Close"
            >
                <X className="w-3 h-3" />
            </button>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="flex-1 p-2 overflow-hidden relative">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
