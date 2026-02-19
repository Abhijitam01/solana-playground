import { createWithEqualityFn } from "zustand/traditional";
import type { Terminal } from "xterm";
import type { FitAddon } from "xterm-addon-fit";

interface TerminalState {
  terminal: Terminal | null;
  fitAddon: FitAddon | null;
  isOpen: boolean;
  bufferedOutput: Array<{ mode: "write" | "writeln"; text: string }>;
  setTerminal: (terminal: Terminal, fitAddon: FitAddon) => void;
  clearTerminal: () => void;
  toggleTerminal: (open?: boolean) => void;
  writeln: (line: string) => void;
  write: (text: string) => void;
  clear: () => void;
  fit: () => void;
}

export const useTerminalStore = createWithEqualityFn<TerminalState>()((set, get) => ({
  terminal: null,
  fitAddon: null,
  isOpen: false,
  bufferedOutput: [],
  setTerminal: (terminal, fitAddon) => {
    const { bufferedOutput } = get();
    set({ terminal, fitAddon });

    if (bufferedOutput.length > 0) {
      for (const entry of bufferedOutput) {
        if (entry.mode === "writeln") {
          terminal.writeln(entry.text);
        } else {
          terminal.write(entry.text);
        }
      }
      set({ bufferedOutput: [] });
    }
  },
  clearTerminal: () => set({ terminal: null, fitAddon: null }),
  toggleTerminal: (open) =>
    set((state) => ({
      isOpen: typeof open === "boolean" ? open : !state.isOpen,
    })),
  writeln: (line) => {
    const { terminal } = get();
    if (terminal) {
      terminal.writeln(line);
      return;
    }

    set((state) => ({
      bufferedOutput: [
        ...state.bufferedOutput.slice(-499),
        { mode: "writeln", text: line },
      ],
    }));
  },
  write: (text) => {
    const { terminal } = get();
    if (terminal) {
      terminal.write(text);
      return;
    }

    set((state) => ({
      bufferedOutput: [
        ...state.bufferedOutput.slice(-499),
        { mode: "write", text },
      ],
    }));
  },
  clear: () => {
    set({ bufferedOutput: [] });
    get().terminal?.clear();
  },
  fit: () => {
    get().fitAddon?.fit();
  },
}));
