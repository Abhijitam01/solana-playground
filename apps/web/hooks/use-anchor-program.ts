import { useMemo } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useProgramStore } from "@/stores/programs";
import { PublicKey } from "@solana/web3.js";

type RuntimeArg = { name: string; type: any };
type RuntimeInstruction = {
  name: string;
  args: RuntimeArg[];
  accounts: Array<{ name: string; isMut?: boolean; isSigner?: boolean; writable?: boolean; signer?: boolean }>;
};

const DEFAULT_PROGRAM_ID = "11111111111111111111111111111111";

const RUST_PRIMITIVES = new Set([
  "u8",
  "u16",
  "u32",
  "u64",
  "u128",
  "i8",
  "i16",
  "i32",
  "i64",
  "i128",
  "bool",
  "string",
]);

function normalizeType(raw: string): any {
  const cleaned = raw.trim();
  const lower = cleaned.toLowerCase();
  if (RUST_PRIMITIVES.has(lower)) {
    return lower;
  }
  if (cleaned === "Pubkey" || lower === "pubkey") {
    return "publicKey";
  }
  return { defined: cleaned.replace(/^.*::/, "") };
}

function parseInstructionArgs(code: string): Record<string, RuntimeArg[]> {
  const argsByInstruction: Record<string, RuntimeArg[]> = {};
  const fnRegex = /pub\s+fn\s+([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*->/g;

  let match: RegExpExecArray | null;
  while ((match = fnRegex.exec(code)) !== null) {
    const instructionName = match[1];
    if (!instructionName) continue;
    const fullArgs = match[2] ?? "";
    const parsedArgs: RuntimeArg[] = [];

    fullArgs
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        const [nameRaw, typeRaw] = part.split(":").map((s) => s?.trim());
        if (!nameRaw || !typeRaw) return;
        if (typeRaw.includes("Context<")) return;
        parsedArgs.push({
          name: nameRaw.replace(/^_+/, ""),
          type: normalizeType(typeRaw),
        });
      });

    argsByInstruction[instructionName] = parsedArgs;
  }
  return argsByInstruction;
}

function parseProgramId(code: string): PublicKey {
  const match = code.match(/declare_id!\("([^"]+)"\)/);
  const value = match?.[1] ?? DEFAULT_PROGRAM_ID;
  try {
    return new PublicKey(value);
  } catch {
    return new PublicKey(DEFAULT_PROGRAM_ID);
  }
}

function snakeToCamel(name: string): string {
  return name.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function useAnchorProgram() {
  const { connection } = useConnection(); // Or use from playground store
  const wallet = useWallet();
  const activeProgram = useProgramStore((state) => 
    state.activeProgramId ? state.programs[state.activeProgramId] : null
  );

  const provider = useMemo(() => {
    if (!connection) return null;
    
    const fallbackPk = new PublicKey(DEFAULT_PROGRAM_ID);
    const anchorWallet = {
      publicKey: wallet.publicKey || fallbackPk,
      signTransaction: wallet.signTransaction || (async (tx: any) => tx),
      signAllTransactions: wallet.signAllTransactions || (async (txs: any[]) => txs),
    };

    return {
      connection,
      wallet: anchorWallet,
      opts: { preflightCommitment: "confirmed" },
    } as const;
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider || !activeProgram) return null;
    const argsByInstruction = parseInstructionArgs(activeProgram.code);
    const instructions: RuntimeInstruction[] = (activeProgram.programMap.instructions || []).map((ix) => ({
      name: ix.name,
      args: argsByInstruction[ix.name] || [],
      accounts: (ix.accounts || []).map((account) => ({
        name: account.name,
        isMut: account.isMut,
        writable: account.isMut,
        isSigner: account.isSigner,
        signer: account.isSigner,
      })),
    }));

    const idlAccounts = (activeProgram.programMap.accounts || []).map((account) => ({
      name: account.name,
      type: {
        kind: "struct",
        fields: (account.fields || []).map((field) => ({
          name: field.name,
          type: normalizeType(field.type),
        })),
      },
    }));

    const idl = {
      version: "0.1.0",
      name: (activeProgram.metadata?.name || activeProgram.name || "program")
        .toLowerCase()
        .replace(/\s+/g, "_"),
      instructions,
      accounts: idlAccounts,
      address: parseProgramId(activeProgram.code).toString(),
      metadata: {
        name: activeProgram.metadata?.name || activeProgram.name || "Program",
        version: "0.1.0",
        spec: "0.1.0",
      },
    };

    const methods = Object.fromEntries(
      instructions.map((ix) => {
        const methodName = snakeToCamel(ix.name);
        const factory = (..._args: any[]) => {
          const builder = {
            accounts: (_accounts: Record<string, any>) => builder,
            rpc: async () => "SIMULATED_SIGNATURE",
          };
          return builder;
        };
        return [methodName, factory];
      })
    );

    return {
      provider,
      idl,
      methods,
      programId: parseProgramId(activeProgram.code),
    } as const;
  }, [provider, activeProgram]);

  return {
    program,
    provider,
    connection,
    wallet
  };
}
