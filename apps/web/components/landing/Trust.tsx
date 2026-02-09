"use client";

import { Check } from "lucide-react";

export function Trust() {
  return (
    <section className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-[40px] font-bold text-[#FAFAFA] mb-16">Built for developers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-xl font-semibold text-[#FAFAFA] mb-6">Features</h3>
            <ul className="space-y-4">
              {[
                "No wallet required",
                "No mainnet risk",
                "Deterministic execution",
                "Same Solana runtime",
                "100% sandboxed environment",
                "Zero configuration needed"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#A3A3A3]">
                  <Check className="w-5 h-5 text-[#14F195]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-[#FAFAFA] mb-6">Development</h3>
            <ul className="space-y-4">
              {[
                "Open source",
                "Active maintenance",
                "Community-driven examples",
                "Issue tracking on GitHub",
                "Full documentation",
                "Discord community support"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#A3A3A3]">
                  <Check className="w-5 h-5 text-[#14F195]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
