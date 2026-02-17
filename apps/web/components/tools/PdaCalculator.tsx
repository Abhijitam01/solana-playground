"use client";

import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { Plus, Trash2, Calculator, Copy, Check } from "lucide-react";

type SeedType = "string" | "pubkey" | "u8";

interface Seed {
  id: string;
  type: SeedType;
  value: string;
}

export function PdaCalculator({ defaultProgramId }: { defaultProgramId?: string }) {
  const [programId, setProgramId] = useState(defaultProgramId || "");
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [pda, setPda] = useState<string | null>(null);
  const [bump, setBump] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultProgramId) {
      setProgramId(defaultProgramId);
    }
  }, [defaultProgramId]);

  const addSeed = () => {
    setSeeds([...seeds, { id: `seed-${Date.now()}`, type: "string", value: "" }]);
  };

  const removeSeed = (id: string) => {
    setSeeds(seeds.filter((s) => s.id !== id));
  };

  const updateSeed = (id: string, updates: Partial<Seed>) => {
    setSeeds(seeds.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const calculatePda = useCallback(() => {
    setPda(null);
    setBump(null);

    if (!programId) return;

    try {
      let progId: PublicKey;
      try {
        progId = new PublicKey(programId);
      } catch {
        // Incomplete program ID
        return;
      }

      const seedBuffers = seeds.map((seed) => {
        if (seed.type === "string") {
          return Buffer.from(seed.value, "utf8");
        } else if (seed.type === "pubkey") {
            if (!seed.value) throw new Error("Empty pubkey seed");
            return new PublicKey(seed.value).toBuffer();
        } else if (seed.type === "u8") {
          const val = parseInt(seed.value, 10);
          if (isNaN(val) || val < 0 || val > 255) throw new Error("Invalid u8");
          return Buffer.from([val]);
        }
        return Buffer.alloc(0);
      });

      const [address, bumpSeed] = PublicKey.findProgramAddressSync(seedBuffers, progId);
      setPda(address.toBase58());
      setBump(bumpSeed);
    } catch (err) {
      // Don't show error immediately while typing
    }
  }, [programId, seeds]);

  useEffect(() => {
    calculatePda();
  }, [calculatePda]);

  const handleCopy = async () => {
    if (pda) {
      await navigator.clipboard.writeText(pda);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calculator className="w-4 h-4 text-primary" />
        PDA Calculator
      </div>

      <div className="space-y-3">
        {/* Program ID Input */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Program ID</label>
          <input
             type="text"
             value={programId}
             onChange={(e) => setProgramId(e.target.value)}
             placeholder="Program Public Key"
             className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
          />
        </div>

        {/* Seeds */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-muted-foreground">Seeds</label>
            <button
              onClick={addSeed}
              className="text-xs flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
            >
              <Plus className="w-3 h-3" />
              Add Seed
            </button>
          </div>
          
          <div className="space-y-2">
            {seeds.map((seed) => (
              <div key={seed.id} className="flex gap-2">
                <select
                  value={seed.type}
                  onChange={(e) => updateSeed(seed.id, { type: e.target.value as SeedType })}
                  className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="string">String</option>
                  <option value="pubkey">Pubkey</option>
                  <option value="u8">u8</option>
                </select>
                <input
                  type="text"
                  value={seed.value}
                  onChange={(e) => updateSeed(seed.id, { value: e.target.value })}
                  placeholder={seed.type === "pubkey" ? "Public Key" : "Value"}
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-primary"
                />
                <button
                  onClick={() => removeSeed(seed.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {seeds.length === 0 && (
                <div className="text-xs text-muted-foreground italic">No seeds added.</div>
            )}
          </div>
        </div>

        {/* Result */}
        {pda && (
          <div className="pt-2 border-t border-border mt-2">
             <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Derived Address (Bump: {bump})</span>
                <button 
                    onClick={handleCopy}
                    className="text-xs text-primary hover:text-primary-hover transition-colors"
                >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
             </div>
             <div className="bg-background border border-border rounded-lg p-2 text-xs font-mono text-foreground break-all">
                {pda}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
